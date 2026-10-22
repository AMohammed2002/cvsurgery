#!/usr/bin/env node
"use strict";

/* Validate the literal comprehensive surgery/anatomy cloze packs against every
   authored block, operative step, region, and section they are meant to cover. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const errors = [];
const pad = value => String(value).padStart(2, "0");
const fail = message => errors.push(message);

function run(context, relative) {
  const filename = path.join(root, relative);
  try {
    vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
  } catch (error) {
    fail("Runtime error in " + relative + ": " + error.message);
  }
}

function balanced(text) {
  const pairs = [["(", ")"], ["[", "]"]];
  return pairs.every(([open, close]) => {
    let depth = 0;
    for (const character of text) {
      if (character === open) depth += 1;
      if (character === close) depth -= 1;
      if (depth < 0) return false;
    }
    return depth === 0;
  });
}

function validateCloze(card) {
  const text = String(card.text || "");
  const tokens = Array.from(text.matchAll(/\{\{c1::([^{}]+)\}\}/g));
  const openings = (text.match(/\{\{c\d+::/g) || []).length;
  if (tokens.length !== 1 || openings !== 1) {
    fail(card.id + " must contain exactly one well-formed c1 deletion");
    return;
  }
  const answer = tokens[0][1].trim();
  const words = answer.split(/\s+/).filter(Boolean);
  if (answer.length < 2) fail(card.id + " has a one-character/empty answer");
  if (words.length > 12) fail(card.id + " answer exceeds 12 words: " + answer);
  if (!balanced(answer)) fail(card.id + " has unbalanced answer delimiters: " + answer);
  if (/^(?:and|or|it|this|that|these|those|they|there|when|where|during|after|before|because|although|conversely|once|no longer)\b/i.test(answer)) {
    fail(card.id + " starts with a dangling context/pronoun: " + answer);
  }
  if (/\b(?:is|are|was|were|can|could|may|might|must|should|would|will|has|have|had|does|did)\b/i.test(answer)) {
    fail(card.id + " contains an auxiliary clause instead of an atomic target: " + answer);
  }
  if (/\b(?:and|or|the|a|an|to|for|with|from|in|on|at|by|is|are|was|were|its|without|into|around|beneath|above|below|across|over|under|near|toward|towards|via|of|as)$/i.test(answer) && !/(?:^|\s)AS$/.test(answer)) {
    fail(card.id + " ends with a dangling function word: " + answer);
  }
  if (/^(?:as|not|one|both|slowly|afterward|outside|medial)$/i.test(answer)) {
    fail(card.id + " has a non-concept answer: " + answer);
  }
  const start = tokens[0].index;
  const before = start > 0 ? text[start - 1] : "";
  const afterIndex = start + tokens[0][0].length;
  const after = afterIndex < text.length ? text[afterIndex] : "";
  if ((/[A-Za-z0-9]/.test(before) && /[A-Za-z0-9]/.test(answer[0])) ||
      (/[A-Za-z0-9]/.test(after) && /[A-Za-z0-9]/.test(answer[answer.length - 1]))) {
    fail(card.id + " deletes only part of a word: " + answer);
  }
}

function validateUnique(cards, label) {
  const seen = new Set();
  cards.forEach(card => {
    if (!card || !card.id) {
      fail(label + " contains a card without an ID");
      return;
    }
    if (seen.has(card.id)) fail(label + " contains duplicate card ID " + card.id);
    seen.add(card.id);
  });
}

/* Surgery registry and comprehensive pack. */
const surgeryContext = vm.createContext({ window: {} });
run(surgeryContext, "js/surgery/surgery-base.js");
fs.readdirSync(path.join(root, "js/surgery"))
  .filter(file => /^surgery-(?!base|js).*\.js$/.test(file) && file !== "surgery.js")
  .sort()
  .forEach(file => run(surgeryContext, "js/surgery/" + file));
run(surgeryContext, "js/surgery/cards-comprehensive.js");

const surgery = surgeryContext.window.SURGERY;
const surgeryCards = surgery && surgery.cards || [];
const surgeryNew = surgeryCards.filter(card => String(card.id || "").startsWith("sxcomp-"));
if (surgeryCards.length !== 781) fail("Final surgery deck must contain 781 cards; found " + surgeryCards.length);
if (surgeryNew.length !== 512) fail("Comprehensive surgery pack must contain 512 cards; found " + surgeryNew.length);
validateUnique(surgeryCards, "Surgery deck");
surgeryNew.forEach(validateCloze);

const surgerySectionIds = new Set((surgery.sections || []).map(section => section.id));
surgeryNew.forEach(card => {
  if (!surgerySectionIds.has(card.section)) fail(card.id + " references unknown surgery section " + card.section);
  if (!card.partId || !card.sourceKind || !Number.isInteger(card.sourceIndex) || !card.sourceTitle) {
    fail(card.id + " has incomplete source metadata");
  }
});
(surgery.sections || []).forEach(section => {
  const cards = surgeryNew.filter(card => card.section === section.id);
  (section.blocks || []).forEach((block, index) => {
    const partId = "block:" + pad(index + 1);
    const matches = cards.filter(card => card.partId === partId);
    if (matches.length !== 3) fail("Surgery " + section.id + " " + partId + " requires exactly 3 new cards; found " + matches.length);
    matches.forEach(card => {
      if (card.sourceKind !== "block" || card.sourceIndex !== index || card.sourceTitle !== block.title) {
        fail(card.id + " metadata does not resolve to " + section.id + " " + partId);
      }
    });
  });
  (section.steps || []).forEach((step, index) => {
    const partId = "step:" + pad(index + 1);
    const matches = cards.filter(card => card.partId === partId);
    if (matches.length !== 1) fail("Surgery " + section.id + " " + partId + " requires exactly 1 new card; found " + matches.length);
    matches.forEach(card => {
      if (card.sourceKind !== "step" || card.sourceIndex !== index) fail(card.id + " metadata does not resolve to " + section.id + " " + partId);
    });
  });
});

/* Anatomy registry: ordinary regions first, operative appenders second, then cards. */
const anatomyContext = vm.createContext({ window: {} });
run(anatomyContext, "js/anatomy/anatomy-base.js");
const anatomyDir = path.join(root, "js/anatomy");
const anatomyFiles = fs.readdirSync(anatomyDir);
anatomyFiles.filter(file => /^regions-.*\.js$/.test(file) && file !== "regions-operative.js").sort()
  .forEach(file => run(anatomyContext, "js/anatomy/" + file));
const preOperativeIds = new Set((anatomyContext.window.ANATOMY.regions || []).map(region => region.id));
if (anatomyFiles.includes("regions-operative.js")) run(anatomyContext, "js/anatomy/regions-operative.js");
const operativeRegionIds = new Set((anatomyContext.window.ANATOMY.regions || []).filter(region => !preOperativeIds.has(region.id)).map(region => region.id));
anatomyFiles.filter(file => /^cards-.*\.js$/.test(file)).sort()
  .forEach(file => run(anatomyContext, "js/anatomy/" + file));

const anatomy = anatomyContext.window.ANATOMY;
const anatomyCards = anatomy && anatomy.cards || [];
const anatomyNew = anatomyCards.filter(card => String(card.id || "").startsWith("acomp-"));
if (anatomyCards.length !== 507) fail("Final anatomy deck must contain 507 cards; found " + anatomyCards.length);
if (anatomyNew.length !== 304) fail("Comprehensive anatomy pack must contain 304 cards; found " + anatomyNew.length);
if (operativeRegionIds.size !== 10) fail("Expected 10 operative anatomy regions; found " + operativeRegionIds.size);
validateUnique(anatomyCards, "Anatomy deck");
anatomyNew.forEach(validateCloze);

const anatomyRegionIds = new Set((anatomy.regions || []).map(region => region.id));
anatomyNew.forEach(card => {
  if (!anatomyRegionIds.has(card.region)) fail(card.id + " references unknown anatomy region " + card.region);
  if (!card.partId || card.sourceKind !== "section" || !Number.isInteger(card.sourceIndex) || !card.sourceTitle) {
    fail(card.id + " has incomplete source metadata");
  }
});
(anatomy.regions || []).forEach(region => {
  const cards = anatomyNew.filter(card => card.region === region.id);
  const expected = Math.max(8, (region.sections || []).length * 2, operativeRegionIds.has(region.id) ? 12 : 0);
  if (cards.length !== expected) fail("Anatomy " + region.id + " requires exactly " + expected + " new cards; found " + cards.length);
  (region.sections || []).forEach((section, index) => {
    const partId = "section:" + pad(index + 1);
    const matches = cards.filter(card => card.partId === partId);
    if (matches.length < 2) fail("Anatomy " + region.id + " " + partId + " requires at least 2 new cards; found " + matches.length);
    matches.forEach(card => {
      if (card.sourceIndex !== index || card.sourceTitle !== section.heading) {
        fail(card.id + " metadata does not resolve to " + region.id + " " + partId);
      }
    });
  });
});

console.log("Comprehensive surgery cards:", surgeryNew.length, "(final deck " + surgeryCards.length + ")");
console.log("Comprehensive anatomy cards:", anatomyNew.length, "(final deck " + anatomyCards.length + ")");
if (errors.length) {
  console.log("\nERRORS (" + errors.length + "):");
  Array.from(new Set(errors)).forEach(error => console.log("  ✗ " + error));
  process.exit(1);
}
console.log("\n✓ Exact source coverage, metadata, unique IDs, and atomic cloze quality validated");
