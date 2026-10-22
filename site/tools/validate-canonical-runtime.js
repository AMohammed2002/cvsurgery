#!/usr/bin/env node
"use strict";

/* Runtime catalog validation for the staged retrieval-v2 migration. This checks
   what learners can actually review; editorial claim/archetype rules live in
   validate-retrieval-cards.js. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const errors = [];
const fail = message => errors.push(message);
const document = {
  body: { classList: { add() {}, remove() {} } },
  querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; },
  createElement() { return { style: {}, classList: { add() {}, remove() {} }, appendChild() {}, setAttribute() {} }; },
  addEventListener() {}, removeEventListener() {}
};
const sandbox = {
  console, document, navigator: {}, location: { hash: "", pathname: "/" },
  Math, Date, JSON, Set, Map, WeakMap, Array, Object, String, Number, Boolean, RegExp, Promise,
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame() {}, cancelAnimationFrame() {}, addEventListener() {}, removeEventListener() {}
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);

function scripts() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  return Array.from(html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi), match => match[1].split("?")[0]);
}
function catalogInput(relative) {
  return relative === "js/data/curriculum.js" || relative === "js/data/diagrams.js" ||
    /^js\/data\/lessons-d\d+\.js$/.test(relative) || /^js\/data\/flashcards-d\d+\.js$/.test(relative) ||
    relative === "js/data/flashcard-schema.js" || /^js\/data\/flashcard-claims-.+\.js$/.test(relative) ||
    /^js\/data\/flashcards-retrieval-.+\.js$/.test(relative) ||
    relative === "js/data/flashcards-lessons-comprehensive.js" || relative === "js/data/exercises.js" ||
    relative === "js/data/viva.js" || relative === "js/advanced/advanced-data.js" ||
    relative === "js/anatomy/anatomy-base.js" || /^js\/anatomy\/(?:regions|cards)-.+\.js$/.test(relative) ||
    /^js\/trials\/trials-(?:base|coronary|valve|aortic|general)\.js$/.test(relative) ||
    /^js\/physiology\/(?:lab-core|lab-metadata|ecg-engine|labs-.+)\.js$/.test(relative) ||
    relative === "js/surgery/surgery-base.js" || /^js\/surgery\/(?:surgery-.+|cards-comprehensive)\.js$/.test(relative) ||
    relative === "js/angiography/angiography-data.js" || relative === "js/daily/day-ecosystem.js" ||
    relative === "js/data/flashcards-modules-comprehensive.js" || relative === "js/data/card-catalog.js";
}
for (const relative of scripts()) {
  if (!catalogInput(relative)) continue;
  const filename = path.join(root, relative);
  try { vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename }); }
  catch (error) { fail("Could not load " + relative + ": " + error.message); }
  if (relative === "js/data/card-catalog.js") break;
}

if (!sandbox.CardCatalog) fail("CardCatalog did not load");
const catalog = sandbox.CardCatalog;
const cards = catalog ? Array.from(catalog.all()) : [];
const ids = new Set();
const sourceKey = source => source && source.type && source.id ? source.type + ":" + source.id : "";

cards.forEach(card => {
  const label = card && card.id ? String(card.id) : "card-without-id";
  if (!card || !card.id) { fail("Active card has no ID"); return; }
  if (ids.has(label)) fail("Duplicate active card ID " + label);
  ids.add(label);
  if (card.kind !== "cloze" || typeof card.cloze !== "string") fail(label + " is not a canonical cloze card");
  if (!/class=["'][^"']*cloze-blank/.test(String(card.front || ""))) fail(label + " has no hidden front deletion");
  if (!/class=["'][^"']*cloze-answer/.test(String(card.back || ""))) fail(label + " has no revealed back answer");
  if (!card.source || !card.source.type || !card.source.id || !card.source.partId) fail(label + " has no stable primary source");
  if (!Array.isArray(card.sourceRefs) || !card.sourceRefs.length) fail(label + " has no sourceRefs");
  (card.sourceRefs || []).forEach(ref => {
    if (!ref.type || !ref.id || !ref.partId) fail(label + " has an incomplete sourceRef");
    if (ref.type !== "case" && ref.type !== "crisis" && !catalog.source(ref.type, ref.id)) fail(label + " has unresolved sourceRef " + sourceKey(ref));
  });
  if (!Array.isArray(card.linkedDays) || card.linkedDays.some((day, index, days) => !Number.isInteger(day) || day < 1 || day > 14 || (index && day <= days[index - 1]))) {
    fail(label + " has invalid linkedDays");
  }
  (card.sourceRefs || []).forEach(ref => {
    const source = catalog.source(ref.type, ref.id);
    (source && source.linkedDays || []).forEach(day => {
      if (!card.linkedDays.includes(day)) fail(label + " omits linked day " + day + " from " + sourceKey(ref));
    });
  });
  if (card.source.type === "case" || card.source.type === "crisis") fail(label + " reintroduced a case/crisis SRS card");
});

const compatibility = new Set((sandbox.FLASHCARDS || []).map(card => String(card.id)));
if (compatibility.size !== ids.size || Array.from(ids).some(id => !compatibility.has(id))) fail("window.FLASHCARDS is not the exact canonical catalog view");

const v2Ids = new Set((sandbox.RETRIEVAL_CARDS || []).map(card => String(card.id)));
v2Ids.forEach(id => { if (!ids.has(id)) fail("Retrieval-v2 card is absent from the active catalog: " + id); });
(sandbox.RETIRED_CARD_IDS || []).forEach(id => { if (ids.has(String(id))) fail("Retired card remains active: " + id); });
const rebuilt = new Set((sandbox.RETRIEVAL_SOURCE_REBUILDS || []).map(sourceKey));
cards.forEach(card => {
  if (rebuilt.has(sourceKey(card.source)) && card.schemaVersion !== 2) fail("Rebuilt source still exposes a legacy card: " + card.id);
});

for (let day = 1; day <= 14; day++) {
  const actual = catalog ? Array.from(catalog.forDay(day)) : [];
  const expected = cards.filter(card => card.linkedDays.includes(day));
  const actualIds = new Set(actual.map(card => String(card.id)));
  if (actualIds.size !== actual.length) fail("Day " + day + " contains duplicate IDs");
  expected.forEach(card => { if (!actualIds.has(String(card.id))) fail("Day " + day + " omitted " + card.id); });
  if (actualIds.size !== expected.length) fail("Day " + day + " does not equal its linked-card union");
}

console.log("Canonical runtime:", cards.length, "active cards;", v2Ids.size, "retrieval-v2;", rebuilt.size, "rebuilt sources");
if (errors.length) {
  console.error("\nFAIL " + new Set(errors).size + " canonical runtime error(s):");
  Array.from(new Set(errors)).forEach(error => console.error("  - " + error));
  process.exit(1);
}
console.log("PASS canonical IDs, rendered clozes, v2 replacement, source resolution, and day unions");
