#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appSource = fs.readFileSync(path.join(__dirname, "..", "js", "app.js"), "utf8");
const start = appSource.indexOf("const RETRIEVAL_SOURCE_BATCHES_PER_DAY");
const end = appSource.indexOf("/* ---------- quiz stats ---------- */", start);
assert.ok(start >= 0 && end > start, "app exposes the staged retrieval-release section");

let today = "2026-07-31";
let stored = null;
let status = "missing";
let writes = 0;
const context = vm.createContext({
  window: {},
  Date,
  Set,
  Array,
  Object,
  JSON,
  Store: {
    inspect() {
      if (status === "malformed") return { status: "malformed", value: null, raw: "{broken" };
      return stored ? { status: "ok", value: stored, raw: JSON.stringify(stored) } : { status: "missing", value: null, raw: null };
    },
    set(key, value) {
      assert.strictEqual(key, "retrievalRelease");
      stored = JSON.parse(JSON.stringify(value));
      status = "ok";
      writes += 1;
      return true;
    }
  },
  todayStr() { return today; },
  cardSourceType(card) { return card.source.type; },
  cardSourceId(card) { return card.source.id; },
  srsData() { return {}; },
  unlockedCards() { return []; },
  cardTierEligible() { return true; },
  filterPacingCards(cards) { return cards; },
  DateNow: Date.now
});
vm.runInContext(appSource.slice(start, end), context, { filename: "app-retrieval-release.js" });

const release = context.window.RetrievalRelease;
assert.ok(release, "retrieval release API is exposed");
assert.strictEqual(release.batchesPerDay, 2);
assert.strictEqual(release.newCardsPerDay, 20);

const card = (id, source) => ({ id, schemaVersion: 2, source: { type: "lesson", id: source } });
const cards = [card("c", "source-c"), card("a", "source-a"), card("b", "source-b")];

let result = release.state(cards, {}, true);
assert.deepStrictEqual(Array.from(result.admitted), ["lesson:source-a", "lesson:source-b"], "only two sorted source batches enter on first day");
assert.deepStrictEqual(Array.from(result.pending), ["lesson:source-c"]);
assert.strictEqual(writes, 1);

result = release.state(cards, {}, true);
assert.deepStrictEqual(Array.from(result.admitted), ["lesson:source-a", "lesson:source-b"], "same-day calls are idempotent");
assert.strictEqual(writes, 1);

today = "2026-08-01";
result = release.state(cards, {}, true);
assert.ok(result.admitted.has("lesson:source-c"), "the next source batch enters on a later day");
assert.strictEqual(result.pending.length, 0);

stored = { version: 1, lastAdmissionDate: today, admittedSources: [] };
result = release.state(cards, { b: { st: "rev" } }, false);
assert.ok(result.admitted.has("lesson:source-b"), "an existing schedule admits its source without copying or changing that schedule");

status = "malformed";
stored = null;
const beforeMalformed = writes;
release.state(cards, {}, true);
assert.strictEqual(writes, beforeMalformed, "malformed release storage is inspected but never overwritten");

assert.match(appSource, /shuffle\(newCards\(\)\.filter\(inDeck\)\)\.slice\(0, remainingIntake\)/,
  "normal review caps daily new-card intake");
assert.match(appSource, /if \(wasNew\) bumpDaily\("newCards"\)/,
  "grading a previously unseen card consumes one daily intake slot");

console.log("retrieval release tests passed");
