#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const state = {};
const mainElement = { innerHTML: "", querySelector() { return null; }, focus() {} };
const document = {
  body: { appendChild() {}, classList: { add() {}, remove() {} } },
  querySelector(selector) { return selector === "#main" ? mainElement : null; },
  querySelectorAll() { return []; }, getElementById() { return null; },
  createElement() { return { className: "", value: "", setAttribute() {}, select() {}, remove() {} }; },
  addEventListener() {}, removeEventListener() {}, execCommand() { return true; }
};
const sandbox = {
  console, document, navigator: {}, location: { hash: "", pathname: "/" },
  Math, Date, JSON, Set, Map, WeakMap, Array, Object, String, Number, Boolean, RegExp, Promise,
  setTimeout() {}, clearTimeout() {}, setInterval, clearInterval,
  requestAnimationFrame() {}, cancelAnimationFrame() {}, addEventListener() {}, removeEventListener() {},
  matchMedia() { return { matches: false }; }
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
sandbox.Store = {
  get(key, fallback) { return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : fallback; },
  set(key, value) { state[key] = value; }
};
sandbox.doneLessons = () => sandbox.Store.get("done", {});
const context = vm.createContext(sandbox);

function load(relative) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), "utf8"), context, { filename: relative });
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

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = Array.from(html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi), match => match[1].split("?")[0]);
for (const relative of scripts) {
  if (!catalogInput(relative)) continue;
  load(relative);
  if (relative === "js/data/card-catalog.js") break;
}
sandbox.ALL_LESSONS = Object.values(sandbox.LESSONS || {}).sort((a, b) => a.day - b.day || a.ord - b.ord);
load("js/daily/voice-prompts.js");
load("js/daily/daily.js");

const records = Array.from(sandbox.VOICE_PROMPT_RECORDS || []);
assert.strictEqual(records.length, 14, "exactly 14 Voice-prompt records are required");
assert.deepStrictEqual(Array.from(records, record => record.day), Array.from({ length: 14 }, (_, index) => index + 1), "Voice-prompt days are unique and ordered");

const regions = new Set(((sandbox.ANATOMY && sandbox.ANATOMY.regions) || []).map(item => item.id));
const operations = new Set(((sandbox.SURGERY && sandbox.SURGERY.sections) || []).map(item => item.id));
const trials = new Set(((sandbox.TRIALS && sandbox.TRIALS.trials) || []).map(item => item.id));
const crises = new Set(((sandbox.CS_ADVANCED && sandbox.CS_ADVANCED.crises) || []).map(item => item.id));
const vivas = new Set((sandbox.VIVA || []).map(item => item.id));
const lessons = new Set(sandbox.ALL_LESSONS.map(item => item.id));
const known = { lesson: lessons, anatomy: regions, surgery: operations, evidence: trials, crisis: crises, viva: vivas };
const key = ref => ref.type + ":" + ref.id;

records.forEach(record => {
  assert.ok(record.title && Array.isArray(record.sourceRefs) && Array.isArray(record.domains), "Day " + record.day + " has structured prompt data");
  record.sourceRefs.forEach(ref => assert.ok(known[ref.type] && known[ref.type].has(ref.id), "Day " + record.day + " resolves " + key(ref)));
  record.domains.forEach(item => {
    assert.ok(item.id && item.label && Array.isArray(item.sourceRefs), "Day " + record.day + " domain is source-traceable");
    ["foundationTopics", "mechanismTopics", "applicationTopics", "synthesisTopics"].forEach(field => {
      assert.ok(Array.isArray(item[field]) && item[field].length, "Day " + record.day + " " + item.id + " populates " + field);
    });
  });

  const prompt = sandbox.VoicePrompts.build(record.day);
  const words = prompt.trim().split(/\s+/).length;
  const minimum = record.day === 14 ? 2500 : 1000;
  const maximum = record.day === 14 ? 3500 : 1800;
  assert.ok(words >= minimum && words <= maximum, "Day " + record.day + " prompt length " + words + " is in range");
  assert.doesNotMatch(prompt, /<\/?[a-z][^>]*>/i, "Day " + record.day + " generated prompt is plain text");
  assert.match(prompt, /Ask exactly one question in every response/, "Day " + record.day + " opens with one-question rule");
  assert.match(prompt, /final character must be \?/, "Day " + record.day + " states final-character rule");
  assert.match(prompt, /If the answer is insufficient[\s\S]*simpler follow-up on the same concept/, "Day " + record.day + " handles insufficient answers");
  assert.match(prompt, /If the answer is partial or satisfactory[\s\S]*same topic/, "Day " + record.day + " probes partial or satisfactory answers");
  assert.match(prompt, /If the answer is perfect[\s\S]*new topic/, "Day " + record.day + " moves perfect answers to a new topic");
  assert.match(prompt, /FINAL REMINDER:[\s\S]*absolutely nothing may follow it\.$/, "Day " + record.day + " repeats the absolute rule at the end");
});

for (let day = 1; day <= 13; day += 1) {
  const record = records[day - 1];
  const expected = new Set(sandbox.VoicePrompts.requiredRefs(day).map(key));
  const actual = new Set(Array.from(record.sourceRefs, key));
  assert.deepStrictEqual(Array.from(actual).sort(), Array.from(expected).sort(), "Day " + day + " includes exactly its lessons and five core sources");
}
assert.deepStrictEqual(Array.from(records[13].courseDays), Array.from({ length: 14 }, (_, index) => index + 1), "Day 14 spans every curriculum day");

function clearCompletion() {
  ["done", "anatomy_done", "surgery_read", "trials_done", "crisis_done", "vivastats"].forEach(name => { state[name] = {}; });
}
function completeLessons(day) {
  sandbox.ALL_LESSONS.filter(lesson => lesson.day === day).forEach(lesson => { state.done[lesson.id] = Date.now(); });
}
function completeCore(day) {
  const circuit = sandbox.DAY_ECOSYSTEMS.find(item => item.day === day);
  state.anatomy_done[circuit.anatomy.id] = Date.now();
  state.surgery_read[circuit.surgery.id] = Date.now();
  state.trials_done[circuit.evidence.id] = Date.now();
  state.crisis_done["cr-d" + day] = Date.now();
  state.vivastats[circuit.viva.id] = { grades: ["good"] };
}

for (let day = 1; day <= 14; day += 1) {
  clearCompletion();
  let completion = sandbox.Daily.completion(day);
  assert.strictEqual(completion.voicePromptUnlocked, false, "Day " + day + " starts locked");
  completeLessons(day);
  completion = sandbox.Daily.completion(day);
  assert.strictEqual(completion.voicePromptUnlocked, false, "Day " + day + " remains locked without five core stations");
  clearCompletion();
  completeCore(day);
  completion = sandbox.Daily.completion(day);
  assert.strictEqual(completion.voicePromptUnlocked, false, "Day " + day + " remains locked without every lesson");
  completeLessons(day);
  completion = sandbox.Daily.completion(day);
  assert.strictEqual(completion.voicePromptUnlocked, true, "Day " + day + " unlocks after lessons plus five core stations");
  mainElement.innerHTML = "";
  sandbox.Daily.render(["day", String(day)]);
  assert.match(mainElement.innerHTML, /voice-prompt-card card is-unlocked/, "Day " + day + " renders unlocked reward card");
  assert.match(mainElement.innerHTML, /data-voice-jump/, "Day " + day + " renders hero jump control");
  assert.match(mainElement.innerHTML, /<details class="voice-prompt-preview" open>/, "Day " + day + " preview starts expanded");
}

console.log("PASS 14 source-traceable Voice prompts, adaptive protocol, completion gating, and unlocked rendering");
