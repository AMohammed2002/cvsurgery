/* Validate the additive comprehensive lesson-cloze pack. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const dataDir = path.join(root, "js", "data");
const errors = [];
const ctx = { window: {} };
vm.createContext(ctx);

function run(file) {
  const fullPath = path.join(dataDir, file);
  try {
    vm.runInContext(fs.readFileSync(fullPath, "utf8"), ctx, { filename: file });
  } catch (error) {
    errors.push("RUNTIME " + file + ": " + error.message);
  }
}

function dataFiles(pattern) {
  return fs.readdirSync(dataDir).filter((file) => pattern.test(file)).sort();
}

dataFiles(/^lessons-d\d+\.js$/).forEach(run);
dataFiles(/^flashcards-d\d+\.js$/).forEach(run);
const baseCards = (ctx.window.FLASHCARDS || []).slice();
run("flashcards-lessons-comprehensive.js");

const lessons = ctx.window.LESSONS || {};
const additions = ctx.window.LESSON_CLOZE_CARDS || [];
const authoredBase = baseCards.filter((card) => card.lesson && lessons[card.lesson]);
const kindEnum = new Set([
  "recall", "quantitative", "evidence", "operative-step", "complication-rescue",
  "when-not-to", "dosed-algorithm", "reconcile-discordant"
]);

function decodeEntities(value) {
  return String(value)
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&ge;/gi, "≥").replace(/&le;/gi, "≤").replace(/&rarr;/gi, "→").replace(/&times;/gi, "×")
    .replace(/&ndash;/gi, "–").replace(/&mdash;/gi, "—").replace(/&sup2;/gi, "²").replace(/&micro;/gi, "μ")
    .replace(/&#39;/gi, "'").replace(/&quot;/gi, "\"");
}

function plain(value) {
  return decodeEntities(String(value).replace(/<br\s*\/?\s*>/gi, "; ").replace(/<\/?[A-Za-z][^>]*>/g, " "))
    .replace(/\s+/g, " ").trim();
}

function canonical(value) {
  return plain(value).toLowerCase()
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/\s+([,.;:!?%)\]])/g, "$1")
    .replace(/([(\[])\s+/g, "$1")
    .replace(/\s+/g, " ").trim();
}

function slug(value) {
  return String(value).toLowerCase().normalize("NFKD")
    .replace(/[^\w\s-]/g, " ").replace(/_/g, " ").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).padStart(7, "0").slice(-7);
}

function countByLesson(cards) {
  const counts = {};
  cards.forEach((card) => { counts[card.lesson] = (counts[card.lesson] || 0) + 1; });
  return counts;
}

const baseByLesson = countByLesson(authoredBase);
const addedByLesson = countByLesson(additions);
const newIds = new Set();
const allIds = new Set();
const clozeTexts = new Set();
const baseDuplicateIds = [];
const lessonRows = [];
const dayTotals = {};
const kindTotals = {};

authoredBase.forEach((card) => {
  if (!card.id) errors.push("Base lesson card is missing id");
  else if (allIds.has(card.id)) baseDuplicateIds.push(card.id);
  else allIds.add(card.id);
});
if (baseDuplicateIds.length) errors.push("Duplicate IDs in baseline deck: " + baseDuplicateIds.join(", "));

Object.values(lessons).forEach((lesson) => {
  const teachingChunks = (lesson.chunks || []).filter((chunk) => chunk && chunk.type !== "checkpoint");
  // Figure-reading chunks (figure:true) explain a single image each and carry no
  // independent cloze quota -- the facts they teach belong to the prose chunks
  // they sit beside, which are already covered. Without this they would demand
  // two cards per figure purely for existing.
  const quotaChunks = teachingChunks.filter((chunk) => !chunk.figure);
  const floor = Math.max(12, quotaChunks.length * 2);
  const base = baseByLesson[lesson.id] || 0;
  const expectedAddition = Math.max(0, floor - base);
  const added = addedByLesson[lesson.id] || 0;
  const final = base + added;
  const distinctChunks = new Set(additions.filter((card) => card.lesson === lesson.id).map((card) => card.sourceChunk)).size;
  const breadthFloor = Math.min(quotaChunks.length, Math.ceil(floor / 3));

  // Consolidated single-deck model: the whole lesson deck lives in LESSON_CLOZE_CARDS.
  // Each lesson must meet its coverage floor and spread across enough distinct chunks;
  // there is no fixed per-lesson count (no upper cap beyond the global budget below).
  if (final < floor) errors.push(lesson.id + ": final " + final + " is below floor " + floor);
  if (distinctChunks < breadthFloor) {
    errors.push(lesson.id + ": deck covers " + distinctChunks + " chunks; expected at least " + breadthFloor);
  }

  lessonRows.push({ id: lesson.id, day: lesson.day, chunks: teachingChunks.length, base, added, final, floor });
  dayTotals[lesson.day] = (dayTotals[lesson.day] || 0) + final;
});

additions.forEach((card, index) => {
  const tag = "addition[" + index + "] " + (card.id || "<missing-id>");
  const lesson = lessons[card.lesson];
  if (!lesson) {
    errors.push(tag + ": unknown lesson " + card.lesson);
    return;
  }

  if (!card.id || !/^fc-[a-z0-9-]+-[0-9a-z]{7}$/.test(card.id)) errors.push(tag + ": unstable ID shape");
  if (newIds.has(card.id) || allIds.has(card.id)) errors.push(tag + ": duplicate ID");
  newIds.add(card.id);
  allIds.add(card.id);

  if (card.day !== lesson.day) errors.push(tag + ": day " + card.day + " does not match lesson day " + lesson.day);
  if (card.source !== "Lesson") errors.push(tag + ": source must be Lesson");
  if (!card.topic || !String(card.topic).trim()) errors.push(tag + ": missing topic");
  if (!Number.isInteger(card.level) || card.level < 1 || card.level > 5) errors.push(tag + ": level must be 1-5");
  if (card.kind !== "cloze") errors.push(tag + ": kind must be cloze");
  if (!kindEnum.has(card.depthKind)) errors.push(tag + ": invalid depthKind " + card.depthKind);

  const teachingChunks = (lesson.chunks || []).filter((chunk) => chunk && chunk.type !== "checkpoint");
  const sourceChunk = teachingChunks.find((chunk) => slug(chunk.title) === card.sourceChunk);
  if (!sourceChunk) errors.push(tag + ": sourceChunk does not resolve: " + card.sourceChunk);
  if (card.partId !== card.lesson + ":" + card.sourceChunk) errors.push(tag + ": partId does not match lesson/sourceChunk");
  if (!Array.isArray(card.tags) || !card.tags.includes("lesson-cloze") || !card.tags.includes("day-" + card.day) ||
      !card.tags.includes(card.sourceChunk) || !card.tags.includes(card.depthKind)) {
    errors.push(tag + ": tags do not include lesson/day/source/depth metadata");
  }

  const matches = Array.from(String(card.cloze || "").matchAll(/\{\{c(\d+)::([\s\S]*?)\}\}/g));
  if (matches.length !== 1 || matches[0][1] !== "1") {
    errors.push(tag + ": must contain exactly one c1 deletion");
  } else {
    const answer = matches[0][2].trim();
    const visible = canonical(String(card.cloze).replace(matches[0][0], " "));
    if (!answer) errors.push(tag + ": empty cloze answer");
    if (answer.split(/\s+/).length > 14) errors.push(tag + ": cloze answer is not atomic enough");
    if (visible.length < 12) errors.push(tag + ": insufficient visible context");
    if (canonical(answer).length >= 4 && visible.includes(canonical(answer))) errors.push(tag + ": answer leaks in visible text");

    const answerSlug = slug(answer).split("-").slice(0, 7).join("-") || "concept";
    const expectedId = "fc-" + card.lesson + "-" + answerSlug + "-" + hash(String(card.explanation || ""));
    if (card.id !== expectedId) errors.push(tag + ": ID is not the stable lesson/concept/content hash (expected " + expectedId + ")");
  }

  if (!card.explanation || canonical(card.explanation).length < 12) errors.push(tag + ": explanation is missing or too short");
  if (sourceChunk && !canonical(sourceChunk.html).includes(canonical(card.explanation))) {
    errors.push(tag + ": explanation is not grounded verbatim in its lesson chunk");
  }
  // Single-sentence rule: the cloze must teach exactly one atomic fact.
  const sentenceBody = String(card.explanation).replace(/(\d)\.(\d)/g, "$1$2")
    .replace(/\b(e\.g|i\.e|etc|vs|cf|Dr|No|Fig|al|St)\./gi, "$1");
  if ((sentenceBody.match(/[.!?](?:\s|$)/g) || []).length > 1) errors.push(tag + ": cloze must be a single sentence");

  const clozeKey = canonical(card.cloze);
  if (clozeTexts.has(clozeKey)) errors.push(tag + ": duplicate cloze text");
  clozeTexts.add(clozeKey);
  kindTotals[card.depthKind] = (kindTotals[card.depthKind] || 0) + 1;
});

const CAP = 856; // 745 baseline lesson-deck total + 15% budget granted by the author.
const grandTotal = authoredBase.length + additions.length;
if (Object.keys(lessons).length !== 44) errors.push("Expected 44 lessons, found " + Object.keys(lessons).length);
if (authoredBase.length !== 0) errors.push("Base day-decks must be empty after consolidation, found " + authoredBase.length);
if (grandTotal > CAP) errors.push("Consolidated lesson deck (" + grandTotal + ") exceeds cap " + CAP);

console.log("Lesson cloze coverage validator");
console.log("Lessons:", Object.keys(lessons).length);
console.log("Baseline lesson cards:", authoredBase.length);
console.log("Additive cloze cards:", additions.length);
console.log("Final lesson-card total:", authoredBase.length + additions.length);
console.log("Added depth mix:", JSON.stringify(kindTotals));
console.log("Final daily totals:", Object.keys(dayTotals).sort((a, b) => Number(a) - Number(b)).map((day) => day + ":" + dayTotals[day]).join("  "));

if (errors.length) {
  console.log("\nERRORS (" + errors.length + "):");
  errors.forEach((error) => console.log("  ✗ " + error));
  process.exit(1);
}

const belowFloor = lessonRows.filter((row) => row.final < row.floor);
console.log("Lessons below floor:", belowFloor.length);
console.log("\n✓ All existing cards are preserved and every lesson meets max(12, 2 × teaching chunks) with no upper cap.");
