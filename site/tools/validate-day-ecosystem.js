#!/usr/bin/env node
/* Validate the 14 daily circuits against the same canonical catalog used by the UI. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const errors = [];
const mainElement = { innerHTML: "" };
const storeState = {};

const document = {
  body: { classList: { add() {}, remove() {} } },
  querySelector(selector) { return selector === "#main" ? mainElement : null; },
  querySelectorAll() { return []; },
  getElementById() { return null; },
  createElement() { return { style: {}, classList: { add() {}, remove() {} }, appendChild() {}, setAttribute() {} }; },
  addEventListener() {},
  removeEventListener() {}
};
const contextObject = {
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
contextObject.Store = {
  get(key, fallback) { return Object.prototype.hasOwnProperty.call(storeState, key) ? storeState[key] : fallback; },
  set(key, value) { storeState[key] = value; }
};
contextObject.window = contextObject;
contextObject.self = contextObject;
contextObject.globalThis = contextObject;
const context = vm.createContext(contextObject);

function fail(message) { errors.push(message); }
function load(relative) {
  const filename = path.join(root, relative);
  try {
    vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
  } catch (error) {
    fail("RUNTIME " + relative + ": " + error.message);
  }
}
function catalogInput(relative) {
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

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = Array.from(html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi), match => match[1].split("?")[0]);
for (const script of scripts) {
  if (!catalogInput(script)) continue;
  load(script);
  if (script === "js/data/card-catalog.js") break;
}

const W = contextObject;
const days = W.DAY_ECOSYSTEMS || [];
const catalog = W.CardCatalog;
if (!catalog) fail("CardCatalog did not load");

const regions = new Set(((W.ANATOMY && W.ANATOMY.regions) || []).map(item => item.id));
const operations = new Set(((W.SURGERY && W.SURGERY.sections) || []).map(item => item.id));
const trials = new Set(((W.TRIALS && W.TRIALS.trials) || []).map(item => item.id));
const vivas = new Set((W.VIVA || []).map(item => item.id));
const crisesByDay = new Map(((W.CS_ADVANCED && W.CS_ADVANCED.crises) || []).map(item => [item.day, item]));
const seenDays = new Set();
const dailySummary = {};

if (days.length !== 14) fail("Expected 14 day circuits, found " + days.length);

for (const circuit of days) {
  const day = circuit.day;
  if (!Number.isInteger(day) || day < 1 || day > 14 || seenDays.has(day)) fail("Invalid or duplicate day: " + day);
  seenDays.add(day);
  if (!circuit.anatomy || !regions.has(circuit.anatomy.id)) fail("Day " + day + " unknown anatomy region: " + (circuit.anatomy && circuit.anatomy.id));
  if (!circuit.surgery || !operations.has(circuit.surgery.id)) fail("Day " + day + " unknown surgery: " + (circuit.surgery && circuit.surgery.id));
  if (!circuit.evidence || !trials.has(circuit.evidence.id)) fail("Day " + day + " unknown evidence item: " + (circuit.evidence && circuit.evidence.id));
  if (!circuit.viva || !vivas.has(circuit.viva.id)) fail("Day " + day + " unknown viva: " + (circuit.viva && circuit.viva.id));
  if (circuit.case) fail("Day " + day + " still exposes a retired integration case");
  const crisis = crisesByDay.get(day);
  if (!crisis || !crisis.id) fail("Day " + day + " is missing its Crisis Room");

  if (!catalog) continue;
  const dayCards = catalog.forDay(day);
  const dayIds = new Set(dayCards.map(card => String(card.id)));
  if (dayIds.size !== dayCards.length) fail("Day " + day + " contains duplicate cards");

  const sources = catalog.sourcesForDay(day);
  const union = new Set();
  const byType = {};
  sources.forEach(source => {
    const sourceCards = catalog.forSource(source.type, source.id);
    if (!sourceCards.length) fail("Day " + day + " connected source has no cards: " + source.type + ":" + source.id);
    sourceCards.forEach(card => {
      const id = String(card.id);
      union.add(id);
      if (!dayIds.has(id)) fail("Day " + day + " omits " + id + " from " + source.type + ":" + source.id);
    });
    byType[source.type] = (byType[source.type] || 0) + sourceCards.length;
  });
  dayIds.forEach(id => { if (!union.has(id)) fail("Day " + day + " contains unconnected card " + id); });
  if (union.size !== dayCards.length) fail("Day " + day + " total is not its deduplicated connected-source union");

  const required = [
    ["anatomy", circuit.anatomy && circuit.anatomy.id],
    ["surgery", circuit.surgery && circuit.surgery.id],
    ["evidence", circuit.evidence && circuit.evidence.id],
    ["viva", circuit.viva && circuit.viva.id]
  ];
  required.forEach(([type, id]) => {
    if (!id) return;
    const sourceCards = catalog.forSource(type, id);
    if (!sourceCards.length) fail("Day " + day + " required source deck is empty: " + type + ":" + id);
    if (sourceCards.some(card => !dayIds.has(String(card.id)))) fail("Day " + day + " does not contain the complete " + type + ":" + id + " source deck");
  });
  if (crisis) {
    const crisisSource = catalog.source("crisis", crisis.id);
    if (!crisisSource || crisisSource.route !== "#/crisis/" + crisis.id) fail("Day " + day + " Crisis Room route is not registered");
    if (catalog.forSource("crisis", crisis.id).length) fail("Day " + day + " Crisis Room still contributes flashcards");
  }

  dailySummary[day] = { total: dayCards.length, sources: sources.length, byType };
}

for (let day = 1; day <= 14; day += 1) if (!seenDays.has(day)) fail("Missing Day " + day);

load("js/daily/daily.js");
if (!W.Daily) {
  fail("Daily circuit renderer did not load");
} else {
  for (let day = 1; day <= 14; day += 1) {
    const crisis = crisesByDay.get(day);
    mainElement.innerHTML = "";
    W.Daily.render(["day", String(day)]);
    if (!crisis || !mainElement.innerHTML.includes(crisis.title)) fail("Day " + day + " Connected Circuit does not render its Crisis Room");
    if (!/circuit-station crisis/.test(mainElement.innerHTML)) fail("Day " + day + " Crisis Room is not a core circuit station");
    if (/Integration case|INTEGRATION CASE|linked cards[^<]*0/i.test(mainElement.innerHTML)) fail("Day " + day + " still exposes legacy case UI or a zero-card CTA");
  }
  contextObject.location.hash = "";
  W.Daily.render(["day", "1", "case"]);
  const dayOneCrisis = crisesByDay.get(1);
  if (!dayOneCrisis || contextObject.location.hash !== "#/crisis/" + dayOneCrisis.id) fail("Legacy Day 1 case route does not redirect to its Crisis Room");
  if (dayOneCrisis) {
    storeState.crisis_done = { [dayOneCrisis.id]: Date.now() };
    mainElement.innerHTML = "";
    W.Daily.render(["day", "1"]);
    if (!/circuit-station crisis done/.test(mainElement.innerHTML) || !/>Complete</.test(mainElement.innerHTML)) {
      fail("Completed Crisis Room is not reflected in Connected Circuit progress");
    }
  }
}

console.log("Daily circuits:", days.length);
console.log("Crisis Rooms:", crisesByDay.size);
Object.keys(dailySummary).forEach(day => {
  const item = dailySummary[day];
  const types = Object.keys(item.byType).sort().map(type => type + ":" + item.byType[type]).join(" ");
  console.log("Day " + day + ": " + item.total + " unique cards from " + item.sources + " sources (" + types + ")");
});

if (errors.length) {
  console.log("\nERRORS (" + errors.length + "):");
  Array.from(new Set(errors)).forEach(error => console.log("  ✗ " + error));
  process.exit(1);
}
console.log("\n✓ Every daily count is the complete deduplicated union of all connected source decks.");
