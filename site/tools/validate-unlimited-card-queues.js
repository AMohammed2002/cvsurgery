#!/usr/bin/env node
/* Regression test: focused card queues stay complete and ignore legacy daily limits. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
const errors = [];

const functionMatch = appSource.match(/function orderedCompleteDeck\(pool\) \{[\s\S]*?\n\}/);
if (!functionMatch) errors.push("app.js is missing orderedCompleteDeck(pool)");
if (/\bnewToday\b/.test(appSource)) errors.push("app.js still reads the legacy newToday value");

if (functionMatch) {
  const now = Date.now();
  const pool = Array.from({ length: 64 }, (_, index) => ({ id: "card-" + String(index + 1).padStart(2, "0") }));
  const states = {};
  states[pool[0].id] = { due: now - 1000 };
  states[pool[1].id] = { due: now + 86400000 };
  const storage = { cs_newToday: JSON.stringify(999999) };
  const sandbox = {
    pool,
    states,
    storage,
    result: null,
    Date: { now: () => now },
    srsData: () => states,
    shuffle: cards => cards.slice()
  };
  vm.createContext(sandbox);
  vm.runInContext(functionMatch[0] + "\nresult = orderedCompleteDeck(pool);", sandbox);
  const result = sandbox.result || [];
  if (result.length !== pool.length) errors.push("A 64-card source deck was pruned to " + result.length);
  if (new Set(result.map(card => card.id)).size !== pool.length) errors.push("The complete-deck queue duplicated or dropped IDs");
  if (!result[0] || result[0].id !== pool[0].id) errors.push("Due cards are not ordered before new and future cards");
  if (!result.some(card => card.id === pool[1].id)) errors.push("A scheduled future card was dropped from the complete source deck");
  if (JSON.parse(storage.cs_newToday) !== 999999) errors.push("Legacy-value fixture was not initialized");
}

if (errors.length) {
  console.error("Unlimited queue validation failed:");
  errors.forEach(error => console.error("  - " + error));
  process.exit(1);
}
console.log("✓ A 64-card deck remains complete, due-first, and unaffected by stored newToday=999999.");
