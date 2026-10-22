/* Question Bank permutation/state regression tests — run with: node tools/test-question-bank.js */
"use strict";
const assert = require("assert");
require("../js/question-bank.js");
const QB = global.QuestionBank;

function seeded(seed) {
  let state = seed >>> 0;
  return max => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % max; };
}
function spread(sequence) {
  const counts = [0, 0, 0, 0]; sequence.forEach(value => counts[value]++);
  return { counts, value: Math.max(...counts) - Math.min(...counts) };
}

const blockSizes = [1, 3, 15, 40, 75];
blockSizes.forEach(count => {
  const targets = QB.balancedTargets(count, seeded(count));
  assert.strictEqual(targets.length, count, `target count ${count}`);
  assert.ok(spread(targets).value <= 1, `balanced positions for ${count}`);
  assert.ok(QB.sequenceQuality(targets).maxRun <= 2, `run limit for ${count}`);
});

const base = Array.from({ length: 90 }, (_, index) => ({
  id: `q-test-${String(index + 1).padStart(2, "0")}`,
  options: [`correct ${index}`, "distractor one", "distractor two", "distractor three"],
  answer: 0,
  objective: "Recognize the decisive finding and choose the safest management response in this representative clinical scenario.",
  refs: ["test"]
}));
const snapshot = JSON.stringify(base);
blockSizes.forEach(count => {
  const block = QB.buildBalancedBlock(base, count, seeded(99 + count));
  assert.strictEqual(block.length, count, `${count}-question block size`);
  assert.ok(spread(block.map(q => q.answer)).value <= 1, `${count}-question block positions are balanced`);
  assert.ok(QB.sequenceQuality(block.map(q => q.answer)).maxRun <= 2, `${count}-question block run limit`);
  block.forEach(q => assert.ok(q.options[q.answer].startsWith("correct"), `${q.id} answer remapped in ${count}-question block`));
});
assert.strictEqual(JSON.stringify(base), snapshot, "canonical questions are not mutated by any block size");
assert.strictEqual(QB.numericId({ id: "q-d1-100" }), 100, "three-digit suffix parsed numerically");
assert.deepStrictEqual(
  [{ id: "q-d1-100" }, { id: "q-d1-99" }].sort((a, b) => QB.numericId(a) - QB.numericId(b)).map(q => q.id),
  ["q-d1-99", "q-d1-100"],
  "numeric suffix sorting does not use lexical order"
);
const sourced = QB.enrichReferences({
  lesson: "d9-vad", kind: "evidence", stem: "MOMENTUM 3 compared two durable-flow devices.",
  options: ["one", "two", "three", "four"], explain: "", refs: ["cohn-5e"]
});
assert.deepStrictEqual(sourced.refs, ["cohn-5e", "momentum-3", "ishlt-mcs-2023"], "trial and guideline provenance is attached");

const stats = { [base[0].id]: { seen: 2, ok: 1 } };
const transformed = QB.permuteQuestion(base[0], 3, seeded(7)).question;
assert.strictEqual(transformed.id, base[0].id, "permutation preserves canonical id");
stats[transformed.id].seen++; stats[transformed.id].ok++;
assert.deepStrictEqual(stats[base[0].id], { seen: 3, ok: 2 }, "legacy stats continue under canonical id");
const missedIds = new Set(Object.entries(stats).filter(([, value]) => value.ok < value.seen).map(([id]) => id));
assert.ok(base.filter(q => missedIds.has(q.id)).some(q => q.id === base[0].id), "weakness drill still resolves canonical ids");

const canonicalInput = [];
for (let lesson = 1; lesson <= 44; lesson++) {
  for (let index = 0; index < 24; index++) {
    canonicalInput.push({
      id: `q-d${(lesson % 14) + 1}-${String(lesson * 24 + index).padStart(4, "0")}`,
      day: (lesson % 14) + 1,
      lesson: `lesson-${lesson}`,
      topic: `topic-${Math.ceil(lesson / 4)}`,
      options: ["one", "two", "three", "four"], answer: index % 4
    });
  }
}
const canonicalSnapshot = JSON.stringify(canonicalInput);
const canonical = QB.canonicalize(canonicalInput);
assert.strictEqual(canonical.length, 1056);
assert.strictEqual(JSON.stringify(canonicalInput), canonicalSnapshot, "canonical balancing does not mutate source questions");
const globalSlots = spread(canonical.map(q => q.answer));
assert.deepStrictEqual(globalSlots.counts, [264, 264, 264, 264], "canonical global distribution");
for (let lesson = 1; lesson <= 44; lesson++) {
  const lessonSlots = spread(canonical.filter(q => q.lesson === `lesson-${lesson}`).map(q => q.answer));
  assert.deepStrictEqual(lessonSlots.counts, [6, 6, 6, 6], `lesson ${lesson} distribution`);
}

console.log("Question Bank tests passed: balanced blocks, answer remapping, immutable canonical data, stats compatibility, and 1,056-item canonical balance.");
