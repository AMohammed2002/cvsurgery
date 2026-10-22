#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sandbox = {
  console,
  window: null,
  LESSONS: {
    "fixture-a": { id: "fixture-a", day: 2, title: "Fixture A", chunks: [{ title: "Pump", html: "<p>Fixture.</p>" }] },
    "fixture-b": { id: "fixture-b", day: 3, title: "Fixture B", chunks: [{ title: "Shared", html: "<p>Fixture.</p>" }] }
  },
  FLASHCARDS: [],
  LESSON_CLOZE_CARDS: [
    { id: "legacy-retired", lesson: "fixture-a", day: 2, topic: "Old", cloze: "Old target is {{c1::retired}}." },
    { id: "legacy-equivalent", lesson: "fixture-a", day: 2, topic: "Old", cloze: "Equivalent target is {{c1::preserved}}." },
    { id: "legacy-other", lesson: "fixture-b", day: 3, topic: "Other", cloze: "Other target is {{c1::active}}." }
  ],
  ANATOMY: { regions: [], cards: [] },
  SURGERY: { sections: [], cards: [] },
  TRIALS: { trials: [] },
  VIVA: [],
  EXERCISES: [],
  MODULE_CLOZE_CARDS: [],
  DAY_ECOSYSTEMS: []
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);

function load(relative) {
  const filename = path.join(root, relative);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

load("js/data/flashcard-schema.js");
sandbox.FlashcardSchema.registerPack({
  source: { type: "lesson", id: "fixture-a" },
  reviewer: "fixture",
  reviewedAt: "2026-07-31",
  claims: [
    { claimId: "fixture-a-equivalent", partId: "fixture-a:pump", tier: "core", category: "definition", statement: "Equivalent target.", required: true, cardIds: ["legacy-equivalent"], disposition: "carded", rationale: "Fixture." },
    { claimId: "fixture-a-number", partId: "fixture-a:pump", tier: "applied-core", category: "number", statement: "A numeric target.", required: true, cardIds: ["fc2_abcdefghijklmnopqrstuvwx01"], disposition: "carded", rationale: "Fixture." }
  ],
  cards: [
    { id: "legacy-equivalent", claimIds: ["fixture-a-equivalent"], archetype: "atomic-concept", cloze: "Equivalent target is {{c1::preserved}}.", explanation: "The retrieval target is unchanged." },
    { id: "fc2_abcdefghijklmnopqrstuvwx01", claimIds: ["fixture-a-number"], archetype: "numeric-guideline", cloze: "The fixture threshold is {{c1::at least 20 mmHg}}.", hint: "Think of the lower boundary", explanation: "This is a fixture, not medical content.", numeric: { comparator: "at least", value: 20, unit: "mmHg", condition: "fixture threshold", precision: "exact" }, sourceRefs: [{ type: "lesson", id: "fixture-a", partId: "fixture-a:pump" }, { type: "lesson", id: "fixture-b", partId: "fixture-b:shared" }] }
  ]
});
load("js/data/card-catalog.js");

const catalog = sandbox.CardCatalog;
assert.ok(catalog, "catalog loaded");
assert.deepStrictEqual(Array.from(catalog.activeIds()).sort(), ["fc2_abcdefghijklmnopqrstuvwx01", "legacy-equivalent", "legacy-other"].sort());
assert.ok(!catalog.activeIds().includes("legacy-retired"), "a rebuilt source removes non-equivalent legacy cards from the active catalog");
assert.ok(catalog.activeIds().includes("legacy-equivalent"), "an equivalent v2 target may retain its immutable legacy ID");
assert.strictEqual(catalog.forSource("lesson", "fixture-a").length, 2);
assert.strictEqual(catalog.forSource("lesson", "fixture-b").length, 2, "a shared card resolves through every sourceRef");
assert.deepStrictEqual(Array.from(catalog.forDay(2).map(card => card.id)).sort(), ["fc2_abcdefghijklmnopqrstuvwx01", "legacy-equivalent"].sort());
assert.deepStrictEqual(Array.from(catalog.forDay(3).map(card => card.id)).sort(), ["fc2_abcdefghijklmnopqrstuvwx01", "legacy-other"].sort());
assert.strictEqual(catalog.forClaim("fixture-a-number")[0].id, "fc2_abcdefghijklmnopqrstuvwx01");
assert.strictEqual(catalog.guidelineNumberCards().length, 1);
const numeric = catalog.forClaim("fixture-a-number")[0];
assert.match(numeric.front, /cloze-blank/);
assert.match(numeric.front, /<summary>Hint<\/summary>/);
assert.doesNotMatch(numeric.front, /\[Think of the lower boundary\]/, "hints remain collapsed rather than leaking into the answer blank");
assert.match(numeric.back, /cloze-answer/);
assert.match(numeric.back, /Explanation &amp; source/);
assert.match(numeric.back, /This is a fixture/);

console.log("retrieval catalog tests passed");
