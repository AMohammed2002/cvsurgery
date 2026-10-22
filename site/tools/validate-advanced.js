#!/usr/bin/env node
/* Validate the current resident-layer operations, labs, and crisis graphs. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../js/advanced/advanced-data.js"), "utf8"), context);

const data = context.window.CS_ADVANCED;
const errors = [];
const engineSource = fs.readFileSync(path.join(__dirname, "../js/advanced/advanced.js"), "utf8");
const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");
const ids = new Set();
const positions = [0, 0, 0, 0];
let questionCount = 0;
let flashcardCount = 0;
let uniqueLongest = 0;

if (!data) errors.push("CS_ADVANCED missing");
if (!data || !Array.isArray(data.operations) || data.operations.length < 6) errors.push("At least six flagship operations required");

(data && data.operations || []).forEach(operation => {
  if (!operation.id || !operation.title || ids.has(operation.id)) errors.push("Bad or duplicate operation id: " + operation.id);
  ids.add(operation.id);
  ["orientation", "indication", "anatomy", "evidence"].forEach(field => {
    if (!operation[field] || operation[field].length < 80) errors.push(operation.id + " has thin " + field);
  });
  if (!Array.isArray(operation.steps) || operation.steps.length < 8) errors.push(operation.id + " needs at least 8 operative steps");
  (operation.steps || []).forEach((step, index) => {
    if (!step.title || !step.text || !step.why) errors.push(operation.id + " bad step " + (index + 1));
  });

  if (!Array.isArray(operation.flashcards) || operation.flashcards.length < 6) errors.push(operation.id + " needs at least 6 integration flashcards");
  (operation.flashcards || []).forEach((card, index) => {
    if (!Array.isArray(card) || card.length < 2 || !String(card[0]).trim() || !String(card[1]).trim()) {
      errors.push(operation.id + " bad integration flashcard " + (index + 1));
    }
    flashcardCount += 1;
  });

  if (!Array.isArray(operation.questions) || operation.questions.length < 5) errors.push(operation.id + " needs at least 5 integration questions");
  (operation.questions || []).forEach((question, index) => {
    questionCount += 1;
    if (!question.stem || !question.explain || !Array.isArray(question.options) || question.options.length !== 4 ||
        !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) {
      errors.push(operation.id + " bad question " + (index + 1));
      return;
    }
    positions[question.answer] += 1;
    const lengths = question.options.map(option => String(option).length);
    const max = Math.max.apply(null, lengths);
    if (lengths[question.answer] === max && lengths.filter(length => length === max).length === 1) uniqueLongest += 1;
  });
});

if (!data || !Array.isArray(data.labs) || data.labs.length < 4) errors.push("Four physiology lab integrations required");
if (!data || !Array.isArray(data.crises) || data.crises.length < 14) errors.push("Fourteen crisis simulations required");
if (!/id="crisis-complete"/.test(engineSource) || !/Store\.set\("crisis_done"/.test(engineSource)) {
  errors.push("Crisis debrief is missing its explicit Mark as complete control");
}
if (!/migrateCrisisCompletions\(\)/.test(appSource) || !/crisisCompletionMigrationVersion/.test(appSource)) {
  errors.push("Existing Crisis Room completion history is not migrated");
}

(data && data.crises || []).forEach(crisis => {
  if (!crisis.id || !crisis.title || !Number.isInteger(crisis.day) || crisis.day < 1 || crisis.day > 14 || !crisis.brief) {
    errors.push("Bad crisis metadata: " + (crisis.id || "?"));
  }
  if (!crisis.nodes || typeof crisis.nodes !== "object") {
    errors.push((crisis.id || "?") + " has no decision graph");
    return;
  }
  const nodeIds = new Set(Object.keys(crisis.nodes));
  if (!nodeIds.has(crisis.start)) errors.push(crisis.id + " start node does not resolve: " + crisis.start);
  let decisions = 0;
  let terminals = 0;
  Object.entries(crisis.nodes).forEach(([nodeId, node]) => {
    if (node.end) {
      terminals += 1;
      if (!node.t || !node.r) errors.push(crisis.id + " terminal " + nodeId + " needs title and rationale");
      return;
    }
    decisions += 1;
    if (!node.q || !Array.isArray(node.opts) || node.opts.length < 2) errors.push(crisis.id + " decision " + nodeId + " is incomplete");
    (node.opts || []).forEach((option, index) => {
      if (!option.a || !option.to || !option.k || !option.r) errors.push(crisis.id + " decision " + nodeId + " option " + (index + 1) + " is incomplete");
      if (option.to && !nodeIds.has(option.to)) errors.push(crisis.id + " decision " + nodeId + " points to missing node " + option.to);
    });
  });
  if (decisions < 3) errors.push(crisis.id + " needs at least 3 decision nodes");
  if (!terminals) errors.push(crisis.id + " needs at least one terminal outcome");
  if (!crisis.summary || !Array.isArray(crisis.keyPoints) || crisis.keyPoints.length < 3) errors.push(crisis.id + " needs a summary and at least 3 key points");
});

if (Math.max.apply(null, positions) - Math.min.apply(null, positions) > 1) errors.push("Answer positions are imbalanced: " + positions.join(","));
if (uniqueLongest / Math.max(1, questionCount) > 0.35) errors.push("Correct answer is uniquely longest too often: " + uniqueLongest + "/" + questionCount);

console.log("Operations:", data && data.operations.length || 0);
console.log("Integration flashcards:", flashcardCount);
console.log("Integration questions:", questionCount);
console.log("Answer positions:", positions.join("/"), "unique-longest:", uniqueLongest + "/" + questionCount);
console.log("Physiology lab links:", data && data.labs.length || 0);
console.log("Crisis simulations:", data && data.crises.length || 0);
console.log("Errors:", errors.length);
errors.forEach(error => console.log("  ✗ " + error));
process.exit(errors.length ? 1 : 0);
