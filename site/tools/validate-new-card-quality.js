#!/usr/bin/env node
/* Cross-pack quality checks for newly authored cloze cards only. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const errors = [];
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

function fail(message) { errors.push(message); }
function load(relative) {
  const filename = path.join(root, relative);
  try { vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename }); }
  catch (error) { fail("Could not load " + relative + ": " + error.message); }
}
function isInput(relative) {
  return relative === "js/data/curriculum.js" || relative === "js/data/diagrams.js" ||
    /^js\/data\/lessons-d\d+\.js$/.test(relative) || /^js\/data\/flashcards-d\d+\.js$/.test(relative) ||
    relative === "js/data/flashcards-cloze-plan.js" || relative === "js/data/flashcards-lessons-comprehensive.js" ||
    relative === "js/data/exercises.js" || relative === "js/data/viva.js" || relative === "js/advanced/advanced-data.js" ||
    relative === "js/anatomy/anatomy-base.js" || /^js\/anatomy\/(?:regions|cards)-.+\.js$/.test(relative) ||
    /^js\/trials\/trials-(?:base|coronary|valve|aortic|general)\.js$/.test(relative) ||
    /^js\/physiology\/(?:lab-core|lab-metadata|ecg-engine|labs-.+)\.js$/.test(relative) ||
    relative === "js/surgery/surgery-base.js" || /^js\/surgery\/(?:surgery-.+|cards-comprehensive)\.js$/.test(relative) ||
    relative === "js/angiography/angiography-data.js" || relative === "js/daily/day-ecosystem.js" ||
    relative === "js/data/flashcards-modules-comprehensive.js" || relative === "js/data/card-catalog.js";
}
function normalized(value) {
  return String(value || "").toLowerCase().replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function tokens(value) { return new Set(normalized(value).split(" ").filter(token => token.length > 1)); }
function jaccard(left, right) {
  let common = 0;
  left.forEach(token => { if (right.has(token)) common += 1; });
  return common / Math.max(1, left.size + right.size - common);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = Array.from(html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi), match => match[1].split("?")[0]);
for (const script of scripts) {
  if (!isInput(script)) continue;
  load(script);
  if (script === "js/data/card-catalog.js") break;
}

if (!sandbox.CardCatalog) {
  console.error("CardCatalog did not load");
  process.exit(1);
}

const newIds = new Set();
(sandbox.LESSON_CLOZE_CARDS || []).forEach(card => newIds.add(String(card.id)));
(sandbox.MODULE_CLOZE_CARDS || []).forEach(card => newIds.add(String(card.id)));
sandbox.CardCatalog.all().forEach(card => {
  if (/^(?:acomp|sxcomp)-/.test(String(card.id))) newIds.add(String(card.id));
});
const cards = sandbox.CardCatalog.all().filter(card => newIds.has(String(card.id)));
if (cards.length !== newIds.size) fail("New-card ID inventory does not resolve exactly through CardCatalog");

const CLOZE = /\{\{c\d+::([^{}]+?)(?:::[^{}]*)?\}\}/g;
const bySource = new Map();
cards.forEach(card => {
  const answers = Array.from(card.cloze.matchAll(CLOZE), match => match[1].trim());
  const visible = normalized(card.cloze.replace(CLOZE, " hidden "));
  answers.forEach((answer, index) => {
    const key = normalized(answer);
    if (!key) fail(card.id + " cloze " + (index + 1) + " has an empty answer");
    if (key.length >= 4 && visible.includes(key)) fail(card.id + " leaks answer " + JSON.stringify(answer) + " in visible context");
    if (/^(?:it|this|that|these|those|they|them|he|she|you|we|which|who|what|there)\b/i.test(answer)) {
      fail(card.id + " has an ambiguous pronoun-led answer: " + answer);
    }
  });
  const sourceKey = card.source.type + ":" + card.source.id;
  if (!bySource.has(sourceKey)) bySource.set(sourceKey, []);
  bySource.get(sourceKey).push({ id: card.id, text: normalized(card.cloze.replace(CLOZE, "$1")), words: tokens(card.cloze.replace(CLOZE, "$1")) });
});

bySource.forEach((sourceCards, sourceKey) => {
  const exact = new Map();
  sourceCards.forEach(card => {
    if (exact.has(card.text)) fail(sourceKey + " has duplicate new cards " + exact.get(card.text) + " and " + card.id);
    else exact.set(card.text, card.id);
  });
  for (let left = 0; left < sourceCards.length; left += 1) {
    for (let right = left + 1; right < sourceCards.length; right += 1) {
      const a = sourceCards[left], b = sourceCards[right];
      if (Math.min(a.words.size, b.words.size) < 8) continue;
      const score = jaccard(a.words, b.words);
      if (score >= 0.96) fail(sourceKey + " has near-duplicate new cards " + a.id + " and " + b.id + " (Jaccard " + score.toFixed(2) + ")");
    }
  }
});

console.log("New-card cross-pack quality audit:", cards.length, "cards across", bySource.size, "sources");
if (errors.length) {
  console.log("\nERRORS (" + errors.length + "):");
  Array.from(new Set(errors)).forEach(error => console.log("  ✗ " + error));
  process.exit(1);
}
console.log("✓ No empty answers, answer leakage, ambiguous answer targets, exact duplicates, or high-similarity near-duplicates.");
