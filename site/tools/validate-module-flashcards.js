#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const errors = [];
const noop = function () {};
const document = {
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  getElementById: function () { return null; },
  addEventListener: noop
};
const window = {
  document: document,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  requestAnimationFrame: noop,
  cancelAnimationFrame: noop,
  addEventListener: noop,
  removeEventListener: noop
};
window.window = window;
const context = vm.createContext({ window, document, console, setTimeout, clearTimeout, Math });

function load(relative) {
  const filename = path.join(ROOT, relative);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

load("js/data/diagrams.js");
load("js/data/exercises.js");
load("js/data/viva.js");
load("js/advanced/advanced-data.js");
load("js/daily/day-ecosystem.js");
load("js/trials/trials-base.js");
["coronary", "valve", "aortic", "general"].forEach(name => load("js/trials/trials-" + name + ".js"));
load("js/angiography/angiography-data.js");
load("js/physiology/lab-core.js");
context.CSLab = window.CSLab;
load("js/physiology/labs-foundations.js");
load("js/physiology/ecg-engine.js");
context.ECGEngine = window.ECGEngine;
["labs-rhythm.js", "labs-cpb.js", "labs-strategy.js", "labs-support.js"].forEach(name => load("js/physiology/" + name));

if (window.FLASHCARDS !== undefined) errors.push("Source loading unexpectedly created window.FLASHCARDS before module pack");
load("js/data/flashcards-modules-comprehensive.js");
if (window.FLASHCARDS !== undefined) errors.push("Module pack must not create or replace window.FLASHCARDS");

const cards = window.MODULE_CLOZE_CARDS;
if (!Array.isArray(cards)) {
  console.error("FATAL: window.MODULE_CLOZE_CARDS is not an array");
  process.exit(1);
}

const ids = new Set();
const sourceParts = new Set();
const byType = {};
const bySource = {};
const knownSources = new Set();
const addKnownSource = (type, id) => knownSources.add(type + ":" + id);
window.CSLab.all().forEach(lab => addKnownSource("physiology", lab.id));
(window.TRIALS.trials || []).forEach(trial => addKnownSource("evidence", trial.id));
(window.VIVA || []).forEach(viva => addKnownSource("viva", viva.id));
(window.EXERCISES || []).forEach(exercise => addKnownSource("exercise", exercise.id));
(window.ANGIOGRAPHY.chapters || []).forEach(chapter => (chapter.sections || []).forEach(section => addKnownSource("angiography", section.id)));
(window.ANGIOGRAPHY.cases || []).forEach(item => addKnownSource("angiography", item.id));

const CLOZE = /\{\{c\d+::[^{}]+?\}\}/;
const CLOZE_ANSWER = /\{\{c\d+::([^{}]+?)(?:::[^{}]*)?\}\}/g;
const MAX_ANSWER_CHARS = 160;
const MAX_ANSWER_WORDS = 24;
let longestAnswerChars = 0;
let longestAnswerWords = 0;
cards.forEach((card, index) => {
  const tag = card && card.id || "card#" + (index + 1);
  ["id", "cloze", "source", "sourceType", "sourceId", "partId", "topic"].forEach(field => {
    if (!card || typeof card[field] !== "string" || !card[field].trim()) errors.push(tag + " missing string field " + field);
  });
  if (ids.has(card.id)) errors.push("Duplicate card id: " + card.id);
  ids.add(card.id);
  if (!CLOZE.test(card.cloze || "")) errors.push(tag + " has no valid cloze deletion");
  if (/\[object Object\]|\b(?:undefined|null)\b/i.test(card.cloze || "")) errors.push(tag + " contains missing or stringified source text");
  if ((card.cloze || "").length > 1500) errors.push(tag + " is too long for a retrieval card (" + card.cloze.length + " chars)");
  const answers = Array.from((card.cloze || "").matchAll(CLOZE_ANSWER), match => match[1].trim());
  answers.forEach((answer, answerIndex) => {
    const answerTag = tag + " cloze#" + (answerIndex + 1);
    const words = answer.split(/\s+/).filter(Boolean).length;
    longestAnswerChars = Math.max(longestAnswerChars, answer.length);
    longestAnswerWords = Math.max(longestAnswerWords, words);
    if (answer.length > MAX_ANSWER_CHARS) errors.push(answerTag + " is too long (" + answer.length + " chars; max " + MAX_ANSWER_CHARS + ")");
    if (words > MAX_ANSWER_WORDS) errors.push(answerTag + " is too long (" + words + " words; max " + MAX_ANSWER_WORDS + ")");
    if (/^(?:it|this|that|these|those|they|them|he|she|you|we|which|who|what)\b/i.test(answer)) errors.push(answerTag + " begins with a vague pronoun: " + answer);
    if (/^(?:and|or|but|because|so|therefore|thus|although)\b/i.test(answer)) errors.push(answerTag + " begins as a sentence fragment: " + answer);
    if (/^(?:yes|no|true|false)[.!]?$/i.test(answer) || /^(?:the above|the former|the latter)\b/i.test(answer)) errors.push(answerTag + " is not an atomic retrieval target: " + answer);
    if (/[,:;\u2014-]\s*$/.test(answer)) errors.push(answerTag + " ends as an incomplete fragment: " + answer);
    const sentenceProbe = answer
      .replace(/(\d)\.(\d)/g, "$1\u00a7$2")
      .replace(/\b(e\.g|i\.e|vs|etc|Dr|Mr|Ms|St)\./gi, match => match.replace(/\./g, "\u00a7"));
    if (/[.!?][\"')\]]?\s+[A-Z]/.test(sentenceProbe)) errors.push(answerTag + " contains multiple sentences; split it into atomic targets");
  });
  if (!Array.isArray(card.linkedDays)) errors.push(tag + " linkedDays must be an array");
  else if (card.linkedDays.some(day => !Number.isInteger(day) || day < 1 || day > 14)) errors.push(tag + " has invalid linkedDays");
  const sourcePart = card.sourceType + ":" + card.sourceId + ":" + card.partId;
  if (sourceParts.has(sourcePart)) errors.push("Duplicate source part: " + sourcePart);
  sourceParts.add(sourcePart);
  byType[card.sourceType] = (byType[card.sourceType] || 0) + 1;
  const key = card.sourceType + ":" + card.sourceId;
  if (!knownSources.has(key)) errors.push(tag + " points to unknown or stale source " + key);
  bySource[key] = (bySource[key] || 0) + 1;
});

function requireExact(type, id, expected, label) {
  const count = bySource[type + ":" + id] || 0;
  if (count !== expected) errors.push((label || type + " " + id) + " has " + count + " cards; expected exactly " + expected);
}

window.CSLab.all().forEach(lab => requireExact("physiology", lab.id, 16, "Physiology lab " + lab.id));
(window.TRIALS.trials || []).forEach(trial => {
  requireExact("evidence", trial.id, 8, "Trial " + trial.id);
  [1, 2, 3].forEach(n => { if (!ids.has("evidence-" + trial.id + "-0" + n)) errors.push("Trial " + trial.id + " missing preserved evidence card 0" + n); });
});
(window.VIVA || []).forEach(viva => {
  requireExact("viva", viva.id, 5, "Viva " + viva.id);
  [1, 2, 3].forEach(n => { if (!ids.has(viva.id + "-card-" + n)) errors.push("Viva " + viva.id + " missing preserved card " + n); });
});
const caseCards = cards.filter(card =>
  card.sourceType === "crisis" || card.sourceType === "daily-case" ||
  /^module-crisis-|^dic-d\d+-card-/.test(card.id));
if (caseCards.length) errors.push("Case-simulation flashcards must remain removed; found " + caseCards.length);
(window.EXERCISES || []).forEach(exercise =>
  requireExact("exercise", exercise.id, exercise.type === "order" ? 0 : exercise.targets.length, "Exercise " + exercise.id));
(window.ANGIOGRAPHY.chapters || []).forEach(chapter => (chapter.sections || []).forEach(section => requireExact("angiography", section.id, 2, "Angiography section " + section.id)));
(window.ANGIOGRAPHY.cases || []).forEach(item => requireExact("angiography", item.id, 2, "Angiography case " + item.id));

const expectedTotal =
  window.CSLab.all().length * 16 +
  window.TRIALS.trials.length * 8 +
  window.VIVA.length * 5 +
  window.EXERCISES.reduce((sum, exercise) => sum + (exercise.type === "order" ? 0 : exercise.targets.length), 0) +
  window.ANGIOGRAPHY.chapters.reduce((sum, chapter) => sum + chapter.sections.length * 2, 0) +
  window.ANGIOGRAPHY.cases.length * 2;
if (cards.length !== expectedTotal) errors.push("Pack has " + cards.length + " cards; source-derived exact total is " + expectedTotal);

console.log("Comprehensive supporting-module cloze pack");
console.log("  total=" + cards.length);
console.log("  byType=" + JSON.stringify(byType));
console.log("  physiologyLabs=" + window.CSLab.all().length + " trials=" + window.TRIALS.trials.length + " vivas=" + window.VIVA.length);
console.log("  legacyCaseCards=0 crisisCards=0 exercises=" + window.EXERCISES.length);
console.log("  angioSections=" + window.ANGIOGRAPHY.chapters.reduce((n, chapter) => n + chapter.sections.length, 0) + " angioCases=" + window.ANGIOGRAPHY.cases.length);
console.log("  longestClozeAnswer=" + longestAnswerChars + " chars / " + longestAnswerWords + " words");

if (errors.length) {
  console.log("\nERRORS (" + errors.length + "):");
  errors.forEach(error => console.log("  x " + error));
  process.exitCode = 1;
} else {
  console.log("\nModule flashcard validation: PASS");
}
