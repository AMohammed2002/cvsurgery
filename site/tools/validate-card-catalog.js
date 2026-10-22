#!/usr/bin/env node
"use strict";

/*
 * Release validator for the canonical cloze-card catalog.
 *
 * The validator deliberately rebuilds expected source/day ownership from the
 * authored registries instead of trusting CardCatalog's output. That keeps it
 * capable of detecting a fabricated fallback day, a partial source deck, or a
 * catalog count that merely agrees with itself.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const errors = [];

function fail(message) { errors.push(message); }
function cleanDays() {
  const values = Array.prototype.concat.apply([], Array.from(arguments).map(value => Array.isArray(value) ? value : value == null ? [] : [value]));
  return Array.from(new Set(values.map(Number).filter(day => Number.isInteger(day) && day >= 1 && day <= 14))).sort((a, b) => a - b);
}
function sameArray(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => value === right[index]);
}
function sourceKey(type, id) { return (type === "daily-case" ? "case" : type) + ":" + String(id); }
function pad(value) { return String(value).padStart(2, "0"); }

const document = {
  body: { classList: { add() {}, remove() {} } },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getElementById() { return null; },
  createElement() { return { style: {}, classList: { add() {}, remove() {} }, appendChild() {}, setAttribute() {} }; },
  addEventListener() {},
  removeEventListener() {}
};
const sandbox = {
  console,
  document,
  navigator: {},
  location: { hash: "", pathname: "/" },
  Math,
  Date,
  JSON,
  Set,
  Map,
  WeakMap,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Promise,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame() {},
  cancelAnimationFrame() {},
  addEventListener() {},
  removeEventListener() {}
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);

function load(relative) {
  const filename = path.join(ROOT, relative);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

function pageScripts() {
  const html = fs.readFileSync(INDEX, "utf8");
  return Array.from(html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi), match => match[1].split("?")[0]);
}

function isCatalogInput(relative) {
  return relative === "js/data/curriculum.js" ||
    relative === "js/data/diagrams.js" ||
    /^js\/data\/lessons-d\d+\.js$/.test(relative) ||
    /^js\/data\/flashcards-d\d+\.js$/.test(relative) ||
    relative === "js/data/flashcards-cloze-plan.js" ||
    relative === "js/data/flashcards-lessons-comprehensive.js" ||
    relative === "js/data/exercises.js" ||
    relative === "js/data/viva.js" ||
    relative === "js/advanced/advanced-data.js" ||
    relative === "js/anatomy/anatomy-base.js" ||
    /^js\/anatomy\/(?:regions|cards)-.+\.js$/.test(relative) ||
    /^js\/trials\/trials-(?:base|coronary|valve|aortic|general)\.js$/.test(relative) ||
    /^js\/physiology\/(?:lab-core|lab-metadata|ecg-engine|labs-.+)\.js$/.test(relative) ||
    relative === "js/surgery/surgery-base.js" ||
    /^js\/surgery\/(?:surgery-.+|cards-comprehensive)\.js$/.test(relative) ||
    relative === "js/angiography/angiography-data.js" ||
    relative === "js/daily/day-ecosystem.js" ||
    relative === "js/data/flashcards-modules-comprehensive.js" ||
    relative === "js/data/card-catalog.js";
}

let scripts = pageScripts();
const catalogPath = "js/data/card-catalog.js";
const requiredPacks = [
  "js/data/flashcards-lessons-comprehensive.js",
  "js/anatomy/cards-comprehensive.js",
  "js/surgery/cards-comprehensive.js",
  "js/data/flashcards-modules-comprehensive.js"
];

if (scripts.filter(src => src === catalogPath).length !== 1) fail("index.html must load CardCatalog exactly once");
requiredPacks.forEach(relative => {
  if (!fs.existsSync(path.join(ROOT, relative))) {
    fail("Missing comprehensive card pack: " + relative);
    return;
  }
  if (!scripts.includes(relative)) {
    fail("index.html does not load comprehensive card pack: " + relative);
    const catalogIndex = scripts.indexOf(catalogPath);
    scripts.splice(catalogIndex < 0 ? scripts.length : catalogIndex, 0, relative);
  } else if (scripts.indexOf(relative) > scripts.indexOf(catalogPath)) {
    fail(relative + " loads after CardCatalog; it must load before the catalog is built");
  }
});

let baselineAnatomyIds = [];
let baselineSurgeryIds = [];
let baselineAnatomyCards = [];
let baselineSurgeryCards = [];
let baselineCurriculumCards = [];
let authoredInputsBeforeCatalog = [];
let operativeRegionIds = new Set();
let loadedCatalog = false;

const LAB_DAYS = {
  "cpb-console": [2], cardioplegia: [2],
  "oxygen-delivery": [3], "pv-loop": [3], valve: [4], "cpb-surgery": [7], cannulation: [9],
  iabp: [10], "teg-rotem": [11], ecg: [12], pacing: [12], shock: [13]
};
const EXERCISE_DAY_FIXES = {
  "ex-ischemic-cascade": 3, "ex-onto-bypass": 2, "ex-off-bypass": 2,
  "ex-cabg-sequence": 7
};
const CRISIS_DAYS = {
  "cannulation-dissection": [2], protamine: [11], "rv-failure": [13],
  "ic-looks-fine": [14], "ic-breathing-kidneys": [14], "ic-rhythm": [14], "ic-fine-yesterday": [14]
};
const expectedSources = new Map();
let circuits = [];

function circuitDays(type, id) {
  return circuits.filter(circuit => circuit[type] && circuit[type].id === id).map(circuit => circuit.day);
}
function expectSource(type, id, linkedDays, owner) {
  const key = sourceKey(type, id);
  if (expectedSources.has(key)) fail("Duplicate source registry entry: " + key);
  expectedSources.set(key, { type: key.split(":")[0], id: String(id), linkedDays: cleanDays(linkedDays), owner });
}
function capturePreCatalogState() {
  circuits = sandbox.DAY_ECOSYSTEMS || [];
  Object.values(sandbox.LESSONS || {}).forEach(lesson => expectSource("lesson", lesson.id, [lesson.day], lesson));
  ((sandbox.ANATOMY && sandbox.ANATOMY.regions) || []).forEach(region =>
    expectSource("anatomy", region.id, cleanDays(region.linkedDays || [], circuitDays("anatomy", region.id)), region));
  ((sandbox.SURGERY && sandbox.SURGERY.sections) || []).forEach(section =>
    expectSource("surgery", section.id, cleanDays(section.linkedDays || [], section.day, circuitDays("surgery", section.id)), section));
  ((sandbox.TRIALS && sandbox.TRIALS.trials) || []).forEach(trial =>
    expectSource("evidence", trial.id, cleanDays(trial.linkedDays || [], trial.day, circuitDays("evidence", trial.id)), trial));
  (sandbox.VIVA || []).forEach(viva =>
    expectSource("viva", viva.id, cleanDays(viva.linkedDays || [], viva.day, circuitDays("viva", viva.id)), viva));
  ((sandbox.CSLab && sandbox.CSLab.all && sandbox.CSLab.all()) || []).forEach(lab =>
    expectSource("physiology", lab.id, cleanDays(lab.linkedDays || [], LAB_DAYS[lab.id] || []), lab));
  (sandbox.EXERCISES || []).forEach(exercise =>
    expectSource("exercise", exercise.id, [EXERCISE_DAY_FIXES[exercise.id] || exercise.day], exercise));
  ((sandbox.CS_ADVANCED && sandbox.CS_ADVANCED.crises) || []).forEach(crisis =>
    expectSource("crisis", crisis.id, cleanDays(crisis.linkedDays || [], crisis.day, CRISIS_DAYS[crisis.id] || []), crisis));
  if (sandbox.ANGIOGRAPHY) {
    expectSource("angiography", "coronary-angiography", cleanDays(
      sandbox.ANGIOGRAPHY.meta && sandbox.ANGIOGRAPHY.meta.linkedDays || [],
      sandbox.ANGIOGRAPHY.meta && sandbox.ANGIOGRAPHY.meta.day || 5
    ), sandbox.ANGIOGRAPHY);
  }

  baselineCurriculumCards = (sandbox.FLASHCARDS || []).slice();
  authoredInputsBeforeCatalog = []
    .concat(baselineCurriculumCards)
    .concat(sandbox.LESSON_CLOZE_CARDS || [])
    .concat((sandbox.ANATOMY && sandbox.ANATOMY.cards) || [])
    .concat((sandbox.SURGERY && sandbox.SURGERY.cards) || [])
    .concat(sandbox.MODULE_CLOZE_CARDS || []);
}

for (const relative of scripts) {
  if (!isCatalogInput(relative)) continue;
  if (relative === "js/anatomy/cards-comprehensive.js") {
    baselineAnatomyCards = ((sandbox.ANATOMY && sandbox.ANATOMY.cards) || []).slice();
    baselineAnatomyIds = baselineAnatomyCards.map(card => String(card.id));
  }
  if (relative === "js/surgery/cards-comprehensive.js") {
    baselineSurgeryCards = ((sandbox.SURGERY && sandbox.SURGERY.cards) || []).slice();
    baselineSurgeryIds = baselineSurgeryCards.map(card => String(card.id));
  }
  const beforeOperative = relative === "js/anatomy/regions-operative.js"
    ? new Set(((sandbox.ANATOMY && sandbox.ANATOMY.regions) || []).map(region => region.id))
    : null;
  if (relative === catalogPath) capturePreCatalogState();
  try {
    load(relative);
  } catch (error) {
    fail("Could not load " + relative + ": " + error.message);
    continue;
  }
  if (beforeOperative) {
    operativeRegionIds = new Set((sandbox.ANATOMY.regions || []).map(region => region.id).filter(id => !beforeOperative.has(id)));
  }
  if (relative === catalogPath) {
    loadedCatalog = true;
    break;
  }
}

if (!loadedCatalog || !sandbox.CardCatalog) {
  fail("CardCatalog did not load");
  finish({ total: 0 });
}

const catalog = sandbox.CardCatalog;
const cards = catalog.all();
const curriculumBaselineIds = baselineCurriculumCards.map(card => String(card.id));
const baselineIds = new Set(curriculumBaselineIds.concat(baselineAnatomyIds, baselineSurgeryIds));
circuits.forEach(circuit => {
  for (let number = 1; number <= 3; number += 1) {
    baselineIds.add("evidence-" + circuit.evidence.id + "-" + pad(number));
  }
});
(sandbox.VIVA || []).forEach(viva => {
  for (let number = 1; number <= 3; number += 1) baselineIds.add(viva.id + "-card-" + number);
});

/* Input uniqueness is checked before the Map-backed catalog can overwrite an
   accidental duplicate. FLASHCARDS now points at the catalog, so rebuild the
   authored input from its four independent banks. */
const authoredInputs = authoredInputsBeforeCatalog;
const authoredSeen = new Map();
authoredInputs.forEach((card, index) => {
  if (!card || card.id == null || !String(card.id).trim()) {
    fail("Authored input #" + (index + 1) + " has no ID");
    return;
  }
  const id = String(card.id);
  if (authoredSeen.has(id)) fail("Duplicate authored card ID " + id + " (input positions " + authoredSeen.get(id) + " and " + (index + 1) + ")");
  else authoredSeen.set(id, index + 1);
});

const canonicalIds = new Set();
const CLOZE = /\{\{c([1-9]\d*)::([^{}]*?)(?:::[^{}]*?)?\}\}/g;
cards.forEach((card, index) => {
  const label = card && card.id != null ? String(card.id) : "canonical card #" + (index + 1);
  if (!card || !label.trim()) { fail("Canonical card #" + (index + 1) + " has no ID"); return; }
  if (canonicalIds.has(label)) fail("Duplicate canonical card ID: " + label);
  canonicalIds.add(label);
  if (card.kind !== "cloze") fail(label + " has kind " + JSON.stringify(card.kind) + "; expected cloze");
  if (typeof card.cloze !== "string" || !card.cloze.trim()) {
    fail(label + " has an empty cloze source");
  } else {
    const tokens = Array.from(card.cloze.matchAll(CLOZE));
    const openings = (card.cloze.match(/\{\{c\d+::/g) || []).length;
    if (!tokens.length) fail(label + " has no valid {{cN::answer}} deletion");
    if (tokens.length !== openings) fail(label + " contains a malformed cloze deletion");
    tokens.forEach(token => {
      const answer = String(token[2]).replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").trim();
      if (!answer) fail(label + " contains an empty cloze answer");
    });
  }
  if (typeof card.front !== "string" || !/class=["'][^"']*cloze-blank/.test(card.front) || /\{\{c\d+::/.test(card.front)) {
    fail(label + " does not render a hidden cloze deletion on its front");
  }
  if (typeof card.back !== "string" || !/class=["'][^"']*cloze-answer/.test(card.back) || /\{\{c\d+::/.test(card.back)) {
    fail(label + " does not render a revealed cloze answer on its back");
  }
  if (!card.source || typeof card.source !== "object" || !card.source.type || !card.source.id || !card.source.partId) {
    fail(label + " has an unresolved source object");
    return;
  }
  if (!Array.isArray(card.tags) || !card.tags.length || card.tags.some(tag => typeof tag !== "string" || !tag.trim())) {
    fail(label + " has no valid canonical tag list");
  }
  const key = sourceKey(card.source.type, card.source.id);
  const expected = expectedSources.get(key);
  const resolved = catalog.source(card.source.type, card.source.id);
  if (!expected) fail(label + " points to a source absent from the authored registries: " + key);
  if (!resolved) fail(label + " source does not resolve through CardCatalog: " + key);
  if (!Array.isArray(card.linkedDays)) fail(label + " linkedDays is not an array");
  else {
    const normalized = cleanDays(card.linkedDays);
    if (!sameArray(card.linkedDays, normalized)) fail(label + " has invalid, duplicate, or unsorted linkedDays");
    if (expected && !sameArray(card.linkedDays, expected.linkedDays)) {
      fail(label + " linkedDays " + JSON.stringify(card.linkedDays) + " do not match authored source " + key + " " + JSON.stringify(expected.linkedDays));
    }
    if (card.linkedDays.includes(1) && (!expected || !expected.linkedDays.includes(1))) {
      fail(label + " was silently assigned to Day 1 without an authored source mapping");
    }
  }
});

if (canonicalIds.size !== cards.length) fail("Canonical card IDs are not unique");
baselineIds.forEach(id => { if (!canonicalIds.has(id)) fail("Existing baseline card ID was not preserved: " + id); });
authoredSeen.forEach((position, id) => { if (!canonicalIds.has(id)) fail("Authored card was silently dropped by CardCatalog: " + id); });
if (authoredSeen.size !== cards.length) fail("CardCatalog has " + cards.length + " cards but there are " + authoredSeen.size + " unique authored inputs");

const compatibilityIds = new Set((sandbox.FLASHCARDS || []).map(card => String(card.id)));
if (compatibilityIds.size !== cards.length || cards.some(card => !compatibilityIds.has(String(card.id)))) {
  fail("window.FLASHCARDS is not an exact compatibility view of CardCatalog.all()");
}

/* Freeze the Day 1 regression set before checking the coverage packs: the Day 1
   circuit must assemble every independently authored card that links to it. Since the
   per-day curriculum decks were consolidated into the single grounded cloze deck
   (window.LESSON_CLOZE_CARDS), the lesson portion is drawn from that deck. */
const baselineDayOneByType = { lesson: [], anatomy: [], surgery: [], evidence: [], viva: [] };
baselineDayOneByType.lesson = (sandbox.LESSON_CLOZE_CARDS || []).filter(card => {
  const source = card.lesson && expectedSources.get(sourceKey("lesson", card.lesson));
  return source ? source.linkedDays.includes(1) : Number(card.day) === 1;
}).map(card => String(card.id));
baselineDayOneByType.anatomy = baselineAnatomyCards.filter(card => {
  const source = expectedSources.get(sourceKey("anatomy", card.region));
  return source && source.linkedDays.includes(1);
}).map(card => String(card.id));
baselineDayOneByType.surgery = baselineSurgeryCards.filter(card => {
  const source = expectedSources.get(sourceKey("surgery", card.section || card.surgery));
  return source && source.linkedDays.includes(1);
}).map(card => String(card.id));
const dayOneCircuit = circuits.find(circuit => circuit.day === 1);
if (dayOneCircuit) {
  for (let number = 1; number <= 3; number += 1) {
    baselineDayOneByType.evidence.push("evidence-" + dayOneCircuit.evidence.id + "-" + pad(number));
    baselineDayOneByType.viva.push(dayOneCircuit.viva.id + "-card-" + number);
  }
}
const baselineDayOneIds = new Set(Object.values(baselineDayOneByType).flat());
const baselineSternotomyIds = baselineSurgeryCards.filter(card => (card.section || card.surgery) === "sternotomy").map(card => String(card.id));
if (baselineDayOneIds.size !== 95) {
  fail("Day 1 union changed from the expected 95 non-case cards to " + baselineDayOneIds.size + " (" +
    Object.entries(baselineDayOneByType).map(([type, ids]) => type + ":" + ids.length).join(" ") + ")");
}
if (baselineSternotomyIds.length !== 24) fail("Pre-expansion Median Sternotomy deck changed from 24 cards to " + baselineSternotomyIds.length);
baselineDayOneIds.forEach(id => { if (!canonicalIds.has(id)) fail("Final catalog dropped pre-expansion Day 1 card " + id); });

/* Source resolution, source-specific counts, and coverage floors. */
expectedSources.forEach((expected, key) => {
  const source = catalog.source(expected.type, expected.id);
  if (!source) { fail("CardCatalog is missing source " + key); return; }
  if (!sameArray(source.linkedDays, expected.linkedDays)) {
    fail("Source " + key + " linkedDays " + JSON.stringify(source.linkedDays) + " do not match authored mapping " + JSON.stringify(expected.linkedDays));
  }
  const sourceCards = catalog.forSource(expected.type, expected.id);
  const intentionallyCardless = expected.type === "crisis" ||
    (expected.type === "exercise" && expected.owner && expected.owner.type === "order");
  if (!sourceCards.length && !intentionallyCardless) fail("Source has no flashcards: " + key);
  if (catalog.count(expected.type, expected.id) !== sourceCards.length) fail("Source count disagrees for " + key);
  if (sourceCards.some(card => sourceKey(card.source.type, card.source.id) !== key)) fail("forSource returned a foreign card for " + key);
});

function requireFloor(type, id, minimum, label) {
  const count = catalog.forSource(type, id).length;
  if (count < minimum) fail((label || sourceKey(type, id)) + " has " + count + " cards; requires at least " + minimum);
}

const lessons = Object.values(sandbox.LESSONS || {});
if (lessons.length !== 44) fail("Expected 44 lessons; found " + lessons.length);
lessons.forEach(lesson => {
  // Figure-reading chunks (figure:true) explain a single image each and carry no
  // independent cloze quota; see validate-lesson-cloze-coverage for the rationale.
  const teachingChunks = (lesson.chunks || []).filter(chunk => chunk.type !== "checkpoint" && !chunk.figure);
  requireFloor("lesson", lesson.id, Math.max(12, teachingChunks.length * 2), "Lesson " + lesson.id);
});

((sandbox.SURGERY && sandbox.SURGERY.sections) || []).forEach(section => {
  const sourceCards = catalog.forSource("surgery", section.id);
  requireFloor("surgery", section.id, (section.blocks || []).length * 3 + (section.steps || []).length, "Surgery " + section.id);
  (section.blocks || []).forEach((block, index) => {
    const partId = "block:" + pad(index + 1);
    const count = sourceCards.filter(card => card.source.partId === partId).length;
    if (count < 3) fail("Surgery " + section.id + " " + partId + " has " + count + " cards; requires at least 3");
  });
  (section.steps || []).forEach((step, index) => {
    const partId = "step:" + pad(index + 1);
    if (!sourceCards.some(card => card.source.partId === partId)) fail("Surgery " + section.id + " is missing a card for " + partId);
  });
});

((sandbox.ANATOMY && sandbox.ANATOMY.regions) || []).forEach(region => {
  const sourceCards = catalog.forSource("anatomy", region.id);
  const floor = Math.max(8, (region.sections || []).length * 2, operativeRegionIds.has(region.id) ? 12 : 0);
  requireFloor("anatomy", region.id, floor, "Anatomy region " + region.id);
  (region.sections || []).forEach((section, index) => {
    const partId = "section:" + pad(index + 1);
    const count = sourceCards.filter(card => card.source.partId === partId).length;
    if (count < 2) fail("Anatomy region " + region.id + " " + partId + " has " + count + " cards; requires at least 2");
  });
});

((sandbox.CSLab && sandbox.CSLab.all && sandbox.CSLab.all()) || []).forEach(lab => requireFloor("physiology", lab.id, 16, "Physiology lab " + lab.id));
((sandbox.TRIALS && sandbox.TRIALS.trials) || []).forEach(trial => requireFloor("evidence", trial.id, 8, "Evidence article " + trial.id));
(sandbox.VIVA || []).forEach(viva => requireFloor("viva", viva.id, 5, "Viva " + viva.id));
((sandbox.CS_ADVANCED && sandbox.CS_ADVANCED.crises) || []).forEach(crisis => {
  const sourceCards = catalog.forSource("crisis", crisis.id);
  if (sourceCards.length) fail("Crisis " + crisis.id + " still has " + sourceCards.length + " flashcards");
  if (catalog.count("crisis", crisis.id) !== 0) fail("Crisis " + crisis.id + " reports a nonzero flashcard count");
  if (catalog.ctaHTML("crisis", crisis.id) !== "") fail("Crisis " + crisis.id + " still renders a flashcard CTA");
});
const crisisCards = cards.filter(card => card.source.type === "crisis" || /^module-crisis-/.test(String(card.id)));
if (crisisCards.length) fail("Catalog still contains " + crisisCards.length + " crisis-room flashcards");
const legacyCaseCards = cards.filter(card => card.source.type === "case" || /^dic-d\d+-card-/.test(String(card.id)));
if (legacyCaseCards.length) fail("Catalog still contains " + legacyCaseCards.length + " retired integration-case flashcards");
(sandbox.EXERCISES || []).forEach(exercise => {
  if (exercise.type === "order") {
    if (catalog.count("exercise", exercise.id) !== 0) fail("Order exercise " + exercise.id + " still has flashcards");
    if (catalog.ctaHTML("exercise", exercise.id) !== "") fail("Order exercise " + exercise.id + " still renders a flashcard CTA");
    return;
  }
  requireFloor("exercise", exercise.id, (exercise.targets || []).length, "Exercise " + exercise.id);
});

const moduleCards = sandbox.MODULE_CLOZE_CARDS || [];
const moduleCount = (type, id) => moduleCards.filter(card => card.sourceType === type && String(card.sourceId) === String(id)).length;
let angioFloor = 0;
((sandbox.ANGIOGRAPHY && sandbox.ANGIOGRAPHY.chapters) || []).forEach(chapter => (chapter.sections || []).forEach(section => {
  angioFloor += 2;
  const count = moduleCount("angiography", section.id);
  if (count < 2) fail("Angiography section " + section.id + " has " + count + " cards; requires at least 2");
}));
((sandbox.ANGIOGRAPHY && sandbox.ANGIOGRAPHY.cases) || []).forEach(item => {
  angioFloor += 2;
  const count = moduleCount("angiography", item.id);
  if (count < 2) fail("Angiography case " + item.id + " has " + count + " cards; requires at least 2");
});
requireFloor("angiography", "coronary-angiography", angioFloor, "Angiography module");

/* Day decks must equal the deduplicated union of every explicitly linked source. */
const dayCounts = {};
for (let day = 1; day <= 14; day += 1) {
  const actualCards = catalog.forDay(day);
  const actualIds = new Set(actualCards.map(card => String(card.id)));
  if (actualIds.size !== actualCards.length) fail("Day " + day + " catalog contains duplicate card IDs");
  if (actualCards.some(card => !card.linkedDays.includes(day))) fail("Day " + day + " returned a card that is not linked to the day");

  const linkedSources = Array.from(expectedSources.values()).filter(source => source.linkedDays.includes(day));
  const expectedIds = new Set();
  linkedSources.forEach(source => catalog.forSource(source.type, source.id).forEach(card => expectedIds.add(String(card.id))));
  expectedIds.forEach(id => { if (!actualIds.has(id)) fail("Day " + day + " is missing linked source card " + id); });
  actualIds.forEach(id => { if (!expectedIds.has(id)) fail("Day " + day + " contains card " + id + " without a linked source"); });
  if (actualIds.size !== expectedIds.size) fail("Day " + day + " count disagrees with its deduplicated source union");

  const listedSources = catalog.sourcesForDay(day);
  const listedKeys = new Set(listedSources.map(source => sourceKey(source.type, source.id)));
  const expectedKeys = new Set(linkedSources.filter(source => catalog.forSource(source.type, source.id).length).map(source => sourceKey(source.type, source.id)));
  if (listedKeys.size !== listedSources.length) fail("Day " + day + " sourcesForDay contains duplicate sources");
  expectedKeys.forEach(key => { if (!listedKeys.has(key)) fail("Day " + day + " sourcesForDay is missing " + key); });
  listedKeys.forEach(key => { if (!expectedKeys.has(key)) fail("Day " + day + " sourcesForDay contains unlinked " + key); });
  dayCounts[day] = actualCards.length;
}

const sternotomyCards = catalog.forSource("surgery", "sternotomy");
const dayOneIds = new Set(catalog.forDay(1).map(card => String(card.id)));
if (!sternotomyCards.length) fail("Median Sternotomy source deck is empty");
sternotomyCards.forEach(card => { if (!dayOneIds.has(String(card.id))) fail("Day 1 is missing Median Sternotomy card " + card.id); });

/* Runtime queues must not reintroduce a hard card limit. */
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const forbidden = /\b(?:DAY_MAX|NEW_LIMIT|ANAT_NEW_LIMIT|newToday)\b/g;
walk(path.join(ROOT, "js")).filter(file => file.endsWith(".js")).forEach(file => {
  const source = fs.readFileSync(file, "utf8");
  source.split(/\r?\n/).forEach((line, index) => {
    forbidden.lastIndex = 0;
    if (forbidden.test(line)) fail("Forbidden card-limit reference in " + path.relative(ROOT, file) + ":" + (index + 1));
  });
});

finish({
  total: cards.length,
  baseline: baselineIds.size,
  lessons: cards.filter(card => card.source.type === "lesson").length,
  anatomy: cards.filter(card => card.source.type === "anatomy").length,
  surgery: cards.filter(card => card.source.type === "surgery").length,
  modules: cards.filter(card => !["lesson", "anatomy", "surgery"].includes(card.source.type)).length,
  sternotomy: sternotomyCards.length,
  baselineDayOne: baselineDayOneIds.size,
  dayCounts
});

function finish(summary) {
  console.log("Canonical cloze-card catalog");
  console.log("  total=" + (summary.total || 0));
  if (summary.baseline != null) console.log("  baselinePreserved=" + summary.baseline);
  if (summary.lessons != null) console.log("  lessons=" + summary.lessons + " anatomy=" + summary.anatomy + " surgery=" + summary.surgery + " supporting=" + summary.modules);
  if (summary.sternotomy != null) console.log("  day1=" + summary.dayCounts[1] + " sternotomy=" + summary.sternotomy);
  if (summary.baselineDayOne != null) console.log("  preExpansionDay1=" + summary.baselineDayOne + " (including 24 Sternotomy)");
  if (summary.dayCounts) console.log("  daily=" + Object.keys(summary.dayCounts).map(day => "D" + day + ":" + summary.dayCounts[day]).join(" "));
  if (errors.length) {
    console.error("\nFAIL " + errors.length + " catalog validation error" + (errors.length === 1 ? "" : "s") + ":");
    Array.from(new Set(errors)).forEach(error => console.error("  - " + error));
    process.exit(1);
  }
  console.log("\nPASS canonical catalog, cloze syntax, source coverage, day unions, preserved IDs, and unlimited queues");
}
