#!/usr/bin/env node
"use strict";

/*
 * Uniform retrieval-card release gate.
 *
 * Schema-v2 cards are held to the complete retrieval-card contract. The
 * pre-v2 catalog remains active during the staged rebuild and is summarized
 * below as a non-blocking transition audit; its known defects do not prevent
 * a release until the owning source is rebuilt.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const DATA_DIR = path.join(ROOT, "js", "data");
const CATALOG_PATH = "js/data/card-catalog.js";
const SCHEMA_PATH = "js/data/flashcard-schema.js";
const TODAY = new Date().toISOString().slice(0, 10);
const STRICT_CLINICAL = process.argv.includes("--clinical-release");

const CARD_ID = /^fc2_[a-z0-9]{26}$/;
const TIERS = ["core", "applied-core", "enrichment"];
const CATEGORIES = [
  "model", "definition", "mechanism", "bounded-set", "comparison", "number",
  "guideline", "formula", "sequence", "rescue", "evidence", "image"
];
const ARCHETYPES = [
  "atomic-concept", "mechanism-decision", "bounded-set", "mapping-set",
  "numeric-guideline", "formula", "ordered-sequence", "contrast",
  "image-identification"
];
const DISPOSITIONS = ["carded", "shared-card", "supporting-context"];
const PRECISIONS = ["exact", "range", "approximate", "institution-dependent"];
const CLAIM_FIELDS = [
  "claimId", "sourceRefs", "tier", "category", "statement", "required",
  "cardIds", "disposition", "rationale", "reviewer", "reviewedAt"
];
const CARD_FIELDS = [
  "schemaVersion", "id", "claimIds", "archetype", "tier", "category", "cloze",
  "explanation", "source", "sourceRefs"
];
const NUMERIC_FIELDS = ["comparator", "value", "unit", "condition", "precision"];
const GUIDELINE_FIELDS = [
  "sourceId", "organization", "year", "recommendationClass", "evidenceLevel",
  "reviewedAt", "reviewBy"
];
const CPB_GOLDEN_CLAIMS = [
  "cpb.circuit.roller.variables",
  "cpb.circuit.roller.afterload-independence",
  "cpb.circuit.roller.obstruction-response",
  "cpb.circuit.roller.occlusion-calibration",
  "cpb.circuit.roller.occlusion-errors"
];

const LIMITS = Object.freeze({
  "atomic-concept": { answerWords: 8, filledWords: 30 },
  "mechanism-decision": { answerWords: 10, filledWords: 36 },
  "bounded-set": { answerWords: 20, filledWords: 45, minItems: 2, maxItems: 5, itemWords: 5, ordered: false },
  "mapping-set": { answerWords: 20, filledWords: 45, minItems: 2, maxItems: 4, ordered: false },
  "numeric-guideline": { answerWords: 8, filledWords: 32 },
  "formula": { answerChars: 40, filledWords: 32 },
  "ordered-sequence": { answerWords: 24, filledWords: 45, minItems: 3, maxItems: 5, itemWords: 5, ordered: true },
  "contrast": { answerWords: 10, filledWords: 36 },
  "image-identification": { answerWords: 8, visibleWords: 20 }
});

const errors = [];
const notices = [];
let authoredSourceKeys = null;
function fail(message) { errors.push(String(message)); }
function notice(message) { notices.push(String(message)); }
function hasOwn(value, key) { return Object.prototype.hasOwnProperty.call(value || {}, key); }
function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
function nonempty(value) { return typeof value === "string" && value.trim().length > 0; }
function label(record, fallback) { return record && (record.id || record.claimId) ? String(record.id || record.claimId) : fallback; }

const document = {
  body: { classList: { add() {}, remove() {} } },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getElementById() { return null; },
  createElement() {
    return {
      style: {}, dataset: {}, classList: { add() {}, remove() {}, contains() { return false; } },
      appendChild() {}, setAttribute() {}, addEventListener() {}, removeEventListener() {}
    };
  },
  addEventListener() {},
  removeEventListener() {}
};
const sandbox = {
  console,
  document,
  navigator: {},
  location: { hash: "", pathname: "/" },
  Math,
  Date,
  JSON,
  Set,
  Map,
  WeakMap,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Promise,
  URL,
  Intl,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame() {},
  cancelAnimationFrame() {},
  addEventListener() {},
  removeEventListener() {}
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);

function load(relative) {
  const filename = path.join(ROOT, relative);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

function pageScripts() {
  const html = fs.readFileSync(INDEX, "utf8");
  return Array.from(html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi), match => match[1].split("?")[0]);
}

function isRetrievalPack(relative) {
  return relative === SCHEMA_PATH ||
    /^js\/data\/flashcard-claims-.+\.js$/.test(relative) ||
    /^js\/data\/flashcards-retrieval-.+\.js$/.test(relative);
}

function isCatalogInput(relative) {
  return isRetrievalPack(relative) ||
    relative === "js/data/curriculum.js" ||
    relative === "js/data/diagrams.js" ||
    /^js\/data\/lessons-d\d+\.js$/.test(relative) ||
    /^js\/data\/flashcards-d\d+\.js$/.test(relative) ||
    relative === "js/data/flashcards-cloze-plan.js" ||
    relative === "js/data/flashcards-lessons-comprehensive.js" ||
    relative === "js/data/exercises.js" ||
    relative === "js/data/viva.js" ||
    relative === "js/advanced/advanced-data.js" ||
    relative === "js/anatomy/anatomy-base.js" ||
    /^js\/anatomy\/(?:regions|cards)-.+\.js$/.test(relative) ||
    /^js\/trials\/trials-(?:base|coronary|valve|aortic|general)\.js$/.test(relative) ||
    /^js\/physiology\/(?:lab-core|lab-metadata|ecg-engine|labs-.+)\.js$/.test(relative) ||
    relative === "js/surgery/surgery-base.js" ||
    /^js\/surgery\/(?:surgery-.+|cards-comprehensive)\.js$/.test(relative) ||
    relative === "js/angiography/angiography-data.js" ||
    relative === "js/daily/day-ecosystem.js" ||
    relative === "js/data/flashcards-modules-comprehensive.js" ||
    relative === CATALOG_PATH;
}

function discoveredRetrievalPacks() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter(name => name === "flashcard-schema.js" || /^flashcard-claims-.+\.js$/.test(name) || /^flashcards-retrieval-.+\.js$/.test(name))
    .map(name => "js/data/" + name)
    .sort();
}

function stripHTML(value) {
  return String(value == null ? "" : value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function words(value) {
  return stripHTML(value).match(/[\p{L}\p{N}]+(?:[’'\/-][\p{L}\p{N}]+)*/gu) || [];
}

function wordCount(value) { return words(value).length; }

function sentenceCount(value) {
  let text = stripHTML(value).replace(/\s+/g, " ").trim();
  if (!text) return 0;
  text = text
    .replace(/\b(?:e\.g|i\.e|etc|vs|Dr|Mr|Mrs|Prof|Fig|No)\./gi, match => match.replace(/\./g, ""))
    .replace(/(\d)\.(\d)/g, "$1·$2");
  return text.split(/[.!?]+["')\]]*\s+(?=[\p{Lu}\d])/u).filter(Boolean).length;
}

function normalizeComparable(value) {
  return stripHTML(value).toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—−]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim().replace(/\s+/g, " ");
}

function sourceKey(ref) {
  if (!ref || !ref.type || !ref.id) return "";
  return (ref.type === "daily-case" ? "case" : String(ref.type)) + ":" + String(ref.id);
}

function collectAuthoredSourceKeys() {
  const keys = new Set();
  const add = (type, id) => { if (nonempty(type) && id != null && String(id).trim()) keys.add(sourceKey({ type, id })); };
  Object.values(sandbox.LESSONS || {}).forEach(record => add("lesson", record && record.id));
  ((sandbox.ANATOMY && sandbox.ANATOMY.regions) || []).forEach(record => add("anatomy", record && record.id));
  ((sandbox.SURGERY && sandbox.SURGERY.sections) || []).forEach(record => add("surgery", record && record.id));
  ((sandbox.TRIALS && sandbox.TRIALS.trials) || []).forEach(record => add("evidence", record && record.id));
  (sandbox.VIVA || []).forEach(record => add("viva", record && record.id));
  ((sandbox.CSLab && typeof sandbox.CSLab.all === "function" && sandbox.CSLab.all()) || []).forEach(record => add("physiology", record && record.id));
  (sandbox.EXERCISES || []).forEach(record => add("exercise", record && record.id));
  ((sandbox.CS_ADVANCED && sandbox.CS_ADVANCED.crises) || []).forEach(record => add("crisis", record && record.id));
  if (sandbox.ANGIOGRAPHY) add("angiography", "coronary-angiography");
  return keys;
}

function sameArray(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function parseISODate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + "T00:00:00Z");
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return value;
}

function parseCloze(value) {
  const text = String(value == null ? "" : value);
  const token = /\{\{c([1-9]\d*)::([^{}]*?)(?:::(.*?))?\}\}/g;
  const matches = Array.from(text.matchAll(token));
  const openings = text.match(/\{\{c\d+::/g) || [];
  const closings = text.match(/\}\}/g) || [];
  const complete = matches.length === openings.length && matches.length === closings.length && !token.test(text.replace(token, ""));
  if (matches.length !== 1 || openings.length !== 1 || closings.length !== 1 || !complete) {
    return { valid: false, matches, text };
  }
  const match = matches[0];
  return {
    valid: true,
    text,
    index: Number(match[1]),
    answer: match[2].trim(),
    hint: (match[3] || "").trim(),
    start: match.index,
    end: match.index + match[0].length,
    visible: text.slice(0, match.index) + " […] " + text.slice(match.index + match[0].length),
    filled: text.slice(0, match.index) + match[2].trim() + text.slice(match.index + match[0].length)
  };
}

function splitItems(answer) {
  return String(answer).split(/\s*;\s*/).map(item => item.trim()).filter(Boolean);
}

function tokenSet(value) {
  return new Set(normalizeComparable(value).split(" ").filter(token => token.length > 1));
}

function jaccard(left, right) {
  const a = tokenSet(left), b = tokenSet(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach(token => { if (b.has(token)) intersection += 1; });
  return intersection / (a.size + b.size - intersection);
}

function validateSourceRef(ref, owner, catalog, options) {
  const settings = Object.assign({ partIdOptional: true }, options || {});
  if (!isRecord(ref) || !nonempty(ref.type) || !nonempty(ref.id)) {
    fail(owner + " has an invalid source reference; expected {type,id,partId?}");
    return false;
  }
  const resolved = catalog.source(ref.type, ref.id);
  if (!resolved) {
    fail(owner + " references unknown source " + sourceKey(ref));
    return false;
  }
  if (authoredSourceKeys && !authoredSourceKeys.has(sourceKey(ref))) {
    fail(owner + " references " + sourceKey(ref) + ", which was not found in an authored source registry");
    return false;
  }
  if (!settings.partIdOptional && !nonempty(ref.partId)) fail(owner + " source reference must include partId");
  if (hasOwn(ref, "partId") && ref.partId != null && !nonempty(ref.partId)) fail(owner + " has an empty partId");
  return true;
}

function validateCitation(value, owner, catalog) {
  if (nonempty(value)) return true;
  if (isRecord(value)) return validateSourceRef(value, owner + " citation", catalog);
  fail(owner + " requires a nonempty citation string or resolvable source reference");
  return false;
}

function validateDatePair(reviewedAt, reviewBy, owner, allowPending, maximumMonths) {
  const pending = reviewedAt == null && reviewBy == null;
  if (pending) {
    if (!allowPending) fail(owner + " requires reviewedAt and reviewBy dates");
    return { valid: allowPending, pending: true };
  }
  if (reviewedAt == null || reviewBy == null) {
    fail(owner + " must set reviewedAt and reviewBy together (or both null while pending)");
    return { valid: false, pending: false };
  }
  const reviewed = parseISODate(reviewedAt), review = parseISODate(reviewBy);
  if (!reviewed) fail(owner + " reviewedAt must be an ISO date (YYYY-MM-DD)");
  if (!review) fail(owner + " reviewBy must be an ISO date (YYYY-MM-DD)");
  if (reviewed && reviewed > TODAY) fail(owner + " reviewedAt cannot be in the future");
  if (reviewed && review && review < reviewed) fail(owner + " reviewBy cannot precede reviewedAt");
  if (review && review < TODAY) fail(owner + " reviewBy is overdue (" + review + ")");
  if (reviewed && review && maximumMonths) {
    const limit = new Date(reviewed + "T00:00:00Z");
    limit.setUTCMonth(limit.getUTCMonth() + maximumMonths);
    if (review > limit.toISOString().slice(0, 10)) fail(owner + " reviewBy exceeds the " + maximumMonths + "-month review interval");
  }
  return { valid: !!reviewed && !!review, pending: false };
}

function validateExplicitCue(parsed, owner, archetype) {
  const prefix = stripHTML(parsed.text.slice(0, parsed.start)).replace(/\s+/g, " ").trim();
  const prefixWords = words(prefix);
  if (prefixWords.length < 2) {
    fail(owner + " must name an explicit subject before the cloze deletion");
    return;
  }
  if (/^(?:this|that|these|those|it|they|he|she|which|what)\b/i.test(prefix)) {
    fail(owner + " starts with a vague pronoun instead of an explicit subject cue");
  }
  const generic = new Set([
    "a", "an", "and", "answer", "best", "correct", "factor", "feature", "following",
    "for", "in", "is", "key", "main", "most", "of", "on", "the", "to", "with"
  ]);
  const content = prefixWords.map(word => word.toLowerCase()).filter(word => !generic.has(word));
  if (!content.length) fail(owner + " has only a generic lead-in; identify the tested subject explicitly");
}

function validateNumeric(card, owner, catalog) {
  if (!isRecord(card.numeric)) {
    fail(owner + " requires numeric metadata");
    return { pending: false };
  }
  NUMERIC_FIELDS.forEach(field => {
    if (!hasOwn(card.numeric, field)) fail(owner + ".numeric is missing " + field);
  });
  if (!nonempty(card.numeric.comparator)) fail(owner + ".numeric.comparator must be a nonempty string");
  if (!nonempty(card.numeric.unit)) fail(owner + ".numeric.unit must be a nonempty string (use 'dimensionless' when applicable)");
  if (!nonempty(card.numeric.condition)) fail(owner + ".numeric.condition must state the condition or context");
  if (!PRECISIONS.includes(card.numeric.precision)) fail(owner + ".numeric.precision must be one of: " + PRECISIONS.join(", "));
  const isRange = card.numeric.comparator === "range";
  if (isRange) {
    if (!Array.isArray(card.numeric.value) || card.numeric.value.length !== 2 || card.numeric.value.some(value => typeof value !== "number" || !Number.isFinite(value))) {
      fail(owner + ".numeric.value must be a two-number array when comparator is 'range'");
    } else if (card.numeric.value[0] > card.numeric.value[1]) {
      fail(owner + ".numeric.value range must be ordered low to high");
    }
  } else if (!((typeof card.numeric.value === "number" && Number.isFinite(card.numeric.value)) || nonempty(card.numeric.value))) {
    fail(owner + ".numeric.value must be a finite number or nonempty string");
  }
  const answer = parseCloze(card.cloze);
  const answerNumbers = answer.valid ? (String(answer.answer).match(/-?\d[\d,]*(?:\.\d+)?/g) || []).map(value => Number(value.replace(/,/g, ""))) : [];
  const metadataValues = (Array.isArray(card.numeric.value) ? card.numeric.value : [card.numeric.value]).filter(value => typeof value === "number" && Number.isFinite(value));
  metadataValues.forEach(value => {
    if (!answerNumbers.some(answerValue => answerValue === value)) fail(owner + " numeric answer does not contain metadata value " + value);
  });
  validateCitation(card.citation, owner, catalog);
  if (card.guideline || card.category === "guideline") return { valid: true, pending: false };
  /* registerPack supplies reviewedAt:null to compact records but intentionally
     leaves reviewBy absent. Treat that expanded shape as an explicit pending
     non-guideline number; true guidelines still require dated metadata. */
  const reviewedAt = hasOwn(card, "reviewedAt") ? card.reviewedAt : null;
  const reviewBy = hasOwn(card, "reviewBy") ? card.reviewBy : null;
  return validateDatePair(reviewedAt, reviewBy, owner, true, 24);
}

function validateGuideline(card, owner) {
  if (!isRecord(card.guideline)) {
    fail(owner + " requires guideline metadata");
    return;
  }
  GUIDELINE_FIELDS.forEach(field => {
    if (!hasOwn(card.guideline, field)) fail(owner + ".guideline is missing " + field);
  });
  ["sourceId", "organization", "recommendationClass", "evidenceLevel"].forEach(field => {
    if (!nonempty(card.guideline[field])) fail(owner + ".guideline." + field + " must be a nonempty string");
  });
  if (!(Number.isInteger(card.guideline.year) && card.guideline.year >= 1900 && card.guideline.year <= Number(TODAY.slice(0, 4)))) {
    fail(owner + ".guideline.year must be a plausible published year");
  }
  validateDatePair(card.guideline.reviewedAt, card.guideline.reviewBy, owner + ".guideline", false, 12);
  if (card.reviewedAt != null && card.reviewedAt !== card.guideline.reviewedAt) fail(owner + " top-level reviewedAt must match guideline.reviewedAt");
  if (card.reviewBy != null && card.reviewBy !== card.guideline.reviewBy) fail(owner + " top-level reviewBy must match guideline.reviewBy");
}

function validateArchetype(card, parsed, owner) {
  const limits = LIMITS[card.archetype];
  if (!limits) return;
  const answerWords = wordCount(parsed.answer);
  const filledWords = wordCount(parsed.filled);
  if (limits.answerWords && answerWords > limits.answerWords) {
    fail(owner + " answer has " + answerWords + " words; " + card.archetype + " allows at most " + limits.answerWords);
  }
  if (limits.answerChars && parsed.answer.length > limits.answerChars) {
    fail(owner + " answer has " + parsed.answer.length + " characters; formula allows at most " + limits.answerChars);
  }
  if (limits.filledWords && filledWords > limits.filledWords) {
    fail(owner + " filled prompt has " + filledWords + " words; " + card.archetype + " allows at most " + limits.filledWords);
  }
  const visibleWords = wordCount(parsed.visible);
  if (limits.visibleWords && visibleWords > limits.visibleWords) {
    fail(owner + " visible prompt has " + visibleWords + " words; " + card.archetype + " allows at most " + limits.visibleWords);
  }

  const isCollection = ["bounded-set", "mapping-set", "ordered-sequence"].includes(card.archetype);
  if (isCollection) {
    const items = splitItems(parsed.answer);
    if (!Number.isInteger(card.answerCount)) fail(owner + " must declare integer answerCount");
    else if (card.answerCount !== items.length) fail(owner + " answerCount " + card.answerCount + " does not match " + items.length + " semicolon-delimited answers");
    if (typeof card.ordered !== "boolean") fail(owner + " must declare boolean ordered");
    else if (card.ordered !== limits.ordered) fail(owner + " ordered must be " + limits.ordered + " for " + card.archetype);
    if (items.length < limits.minItems || items.length > limits.maxItems) {
      fail(owner + " requires " + limits.minItems + "–" + limits.maxItems + " answers; found " + items.length);
    }
    items.forEach((item, index) => {
      const count = wordCount(item);
      if (limits.itemWords && count > limits.itemWords) fail(owner + " answer item " + (index + 1) + " has " + count + " words; maximum is " + limits.itemWords);
    });
    if (card.archetype === "mapping-set") {
      items.forEach((item, index) => {
        if (!/(?:→|=>|=|:)/.test(item)) fail(owner + " mapping item " + (index + 1) + " needs an explicit mapping delimiter (→, =>, =, or :)");
      });
    }
  } else {
    if (/;/.test(parsed.answer)) fail(owner + " contains a multi-item answer but does not use a set or sequence archetype");
    if (hasOwn(card, "answerCount") && card.answerCount !== 1) fail(owner + " answerCount is only greater than 1 for set/sequence archetypes");
    if (hasOwn(card, "ordered") && card.ordered !== false) fail(owner + " ordered:true is reserved for ordered-sequence cards");
  }

  if (card.archetype === "contrast" && !/\b(?:but|compared|contrast|rather than|unlike|versus|whereas|while)\b/i.test(parsed.visible)) {
    fail(owner + " uses the contrast archetype without a visible contrast cue");
  }
  if (card.archetype === "formula" && !/[=÷×+\-\/]/.test(parsed.filled)) {
    fail(owner + " uses the formula archetype without a visible equation/operator");
  }
}

function validateCard(card, index, catalog, claimById, legacyAuthoredIds) {
  const owner = "Card " + label(card, "#" + (index + 1));
  if (!isRecord(card)) {
    fail(owner + " is not an object");
    return null;
  }
  CARD_FIELDS.forEach(field => {
    if (!hasOwn(card, field)) fail(owner + " is missing required field " + field);
  });
  if (card.schemaVersion !== 2) fail(owner + " schemaVersion must equal 2");
  if (!CARD_ID.test(String(card.id || ""))) {
    if (card.identityDisposition !== "equivalent-rewrite") {
      fail(owner + " ID must match /^fc2_[a-z0-9]{26}$/ unless it declares identityDisposition:'equivalent-rewrite'");
    } else if (!legacyAuthoredIds.has(String(card.id || ""))) {
      fail(owner + " claims an equivalent-rewrite ID that did not exist in the pre-v2 authored card inputs");
    }
  }
  if (!ARCHETYPES.includes(card.archetype)) fail(owner + " has unknown archetype " + String(card.archetype));
  if (!TIERS.includes(card.tier)) fail(owner + " has unknown tier " + String(card.tier));
  if (!CATEGORIES.includes(card.category)) fail(owner + " has unknown category " + String(card.category));

  if (!Array.isArray(card.claimIds) || !card.claimIds.length || card.claimIds.some(claimId => !nonempty(claimId))) {
    fail(owner + " claimIds must be a nonempty array of strings");
  } else {
    const uniqueClaims = new Set(card.claimIds);
    if (uniqueClaims.size !== card.claimIds.length) fail(owner + " repeats a claimId");
    card.claimIds.forEach(claimId => {
      if (!claimById.has(claimId)) fail(owner + " references unknown claim " + claimId);
    });
  }

  validateSourceRef(card.source, owner + " source", catalog);
  if (!Array.isArray(card.sourceRefs) || !card.sourceRefs.length) fail(owner + " sourceRefs must be a nonempty array");
  else {
    const seenRefs = new Set();
    card.sourceRefs.forEach((ref, refIndex) => {
      validateSourceRef(ref, owner + " sourceRefs[" + refIndex + "]", catalog);
      const refKey = sourceKey(ref) + ":" + String(ref && ref.partId || "");
      if (seenRefs.has(refKey)) fail(owner + " repeats source reference " + refKey);
      seenRefs.add(refKey);
    });
    if (isRecord(card.source) && !card.sourceRefs.some(ref => sourceKey(ref) === sourceKey(card.source))) {
      fail(owner + " primary source is absent from sourceRefs");
    }
  }

  const parsed = parseCloze(card.cloze);
  if (!parsed.valid) {
    fail(owner + " must contain exactly one well-formed cloze deletion");
    return null;
  }
  if (parsed.index !== 1) fail(owner + " must use c1 and no c2+ deletion");
  if (!parsed.answer) fail(owner + " has an empty cloze answer");
  if (/[{}<>]/.test(parsed.answer)) fail(owner + " answer contains markup or nested braces");
  if (sentenceCount(parsed.filled) !== 1) fail(owner + " front must be one grammatical sentence");
  if (!/[.!?]["')\]]*$/.test(stripHTML(parsed.filled).trim())) fail(owner + " front must end with sentence punctuation");
  validateExplicitCue(parsed, owner, card.archetype);
  validateArchetype(card, parsed, owner);

  const answerComparable = normalizeComparable(parsed.answer);
  const visibleComparable = normalizeComparable(parsed.visible);
  if (answerComparable && (" " + visibleComparable + " ").includes(" " + answerComparable + " ")) {
    fail(owner + " leaks the cloze answer in visible text");
  }
  if (["bounded-set", "mapping-set", "ordered-sequence"].includes(card.archetype)) {
    splitItems(parsed.answer).forEach((item, itemIndex) => {
      const comparable = normalizeComparable(item);
      if (comparable && (" " + visibleComparable + " ").includes(" " + comparable + " ")) {
        fail(owner + " leaks answer item " + (itemIndex + 1) + " in visible text");
      }
    });
  }

  const hints = [card.hint, parsed.hint].filter(value => value != null && value !== "");
  hints.forEach((hint, hintIndex) => {
    if (!nonempty(hint)) fail(owner + " hint " + (hintIndex + 1) + " must be a nonempty string");
    if (wordCount(hint) > 8) fail(owner + " hint " + (hintIndex + 1) + " exceeds 8 words");
    const hintComparable = normalizeComparable(hint);
    if (answerComparable && hintComparable && (hintComparable.includes(answerComparable) || answerComparable.includes(hintComparable))) {
      fail(owner + " hint reveals all or part of the answer");
    }
  });

  if (!nonempty(card.explanation)) fail(owner + " explanation must be a nonempty string");
  else {
    const explanationWords = wordCount(card.explanation);
    const explanationSentences = sentenceCount(card.explanation);
    if (explanationWords > 60) fail(owner + " explanation has " + explanationWords + " words; maximum is 60");
    if (explanationSentences > 2) fail(owner + " explanation has " + explanationSentences + " sentences; maximum is 2");
  }

  let review = { pending: false };
  const needsNumeric = card.archetype === "numeric-guideline" || card.category === "number" || hasOwn(card, "numeric");
  if (needsNumeric) review = validateNumeric(card, owner, catalog);
  if (card.category === "guideline" || hasOwn(card, "guideline")) {
    validateGuideline(card, owner);
    if (!needsNumeric) validateCitation(card.citation, owner, catalog);
  } else if (!needsNumeric && hasOwn(card, "citation") && card.citation != null) validateCitation(card.citation, owner, catalog);

  if (card.archetype === "numeric-guideline" && !["number", "guideline"].includes(card.category)) {
    fail(owner + " numeric-guideline archetype requires number or guideline category");
  }
  if (card.category === "number" && card.archetype !== "numeric-guideline") {
    fail(owner + " " + card.category + " category requires numeric-guideline archetype");
  }
  if (card.category === "formula" && card.archetype !== "formula") fail(owner + " formula category requires formula archetype");
  if (card.category === "sequence" && card.archetype !== "ordered-sequence") fail(owner + " sequence category requires ordered-sequence archetype");
  if (card.category === "image" && card.archetype !== "image-identification") fail(owner + " image category requires image-identification archetype");

  return { card, parsed, pendingNumericReview: !!review.pending };
}

function validateClaims(claims, cards, catalog) {
  const claimById = new Map();
  claims.forEach((claim, index) => {
    const owner = "Claim " + label(claim, "#" + (index + 1));
    if (!isRecord(claim)) {
      fail(owner + " is not an object");
      return;
    }
    CLAIM_FIELDS.forEach(field => {
      if (!hasOwn(claim, field)) fail(owner + " is missing required field " + field);
    });
    if (!nonempty(claim.claimId)) fail(owner + " claimId must be a nonempty string");
    else if (claimById.has(claim.claimId)) fail("Duplicate claimId " + claim.claimId);
    else claimById.set(claim.claimId, claim);
  });

  const cardById = new Map(cards.map(card => [card.id, card]));
  claims.forEach((claim, index) => {
    if (!isRecord(claim)) return;
    const owner = "Claim " + label(claim, "#" + (index + 1));
    if (!TIERS.includes(claim.tier)) fail(owner + " has unknown tier " + String(claim.tier));
    if (!CATEGORIES.includes(claim.category)) fail(owner + " has unknown category " + String(claim.category));
    if (!nonempty(claim.statement)) fail(owner + " statement must be a nonempty string");
    if (typeof claim.required !== "boolean") fail(owner + " required must be boolean");
    if (!DISPOSITIONS.includes(claim.disposition)) fail(owner + " disposition must be one of: " + DISPOSITIONS.join(", "));
    if (!nonempty(claim.rationale)) fail(owner + " rationale must be a nonempty string");
    if (!(claim.reviewer == null || nonempty(claim.reviewer))) fail(owner + " reviewer must be a nonempty string or null");
    if (claim.reviewedAt != null && !parseISODate(claim.reviewedAt)) fail(owner + " reviewedAt must be an ISO date or null");
    if (parseISODate(claim.reviewedAt) && claim.reviewedAt > TODAY) fail(owner + " reviewedAt cannot be in the future");
    if (claim.reviewedAt != null && !nonempty(claim.reviewer)) fail(owner + " reviewedAt requires a named reviewer");
    if (STRICT_CLINICAL) {
      if (!nonempty(claim.reviewer) || !/^clinician:/i.test(claim.reviewer.trim())) {
        fail(owner + " requires clinician sign-off (reviewer must begin with 'clinician:')");
      }
      if (!parseISODate(claim.reviewedAt)) fail(owner + " requires a dated clinician review");
    }

    if (!Array.isArray(claim.sourceRefs) || !claim.sourceRefs.length) fail(owner + " sourceRefs must be a nonempty array");
    else claim.sourceRefs.forEach((ref, refIndex) => validateSourceRef(ref, owner + " sourceRefs[" + refIndex + "]", catalog));

    if (!Array.isArray(claim.cardIds)) fail(owner + " cardIds must be an array");
    else {
      if (new Set(claim.cardIds).size !== claim.cardIds.length) fail(owner + " repeats a cardId");
      claim.cardIds.forEach(cardId => {
        if (!nonempty(cardId)) fail(owner + " contains an invalid cardId");
        const card = cardById.get(cardId);
        if (!card) fail(owner + " references unknown v2 card " + String(cardId));
        else if (!Array.isArray(card.claimIds) || !card.claimIds.includes(claim.claimId)) fail(owner + " points to " + cardId + " without a reciprocal claimIds reference");
      });
    }

    const mappedCount = Array.isArray(claim.cardIds) ? claim.cardIds.length : 0;
    if (["core", "applied-core"].includes(claim.tier)) {
      if (claim.required !== true) fail(owner + " must be required because its tier is " + claim.tier);
      if (!mappedCount) fail(owner + " is required but has no retrieval card");
      if (claim.disposition === "supporting-context") fail(owner + " cannot be supporting-context because required core/applied-core claims must be retrieved");
    }
    if (claim.required && !mappedCount) fail(owner + " is required but has no cardIds mapping");
    if (claim.disposition === "supporting-context" && mappedCount) fail(owner + " supporting-context disposition requires an empty cardIds array");
    if (["carded", "shared-card"].includes(claim.disposition) && !mappedCount) fail(owner + " " + claim.disposition + " disposition requires at least one mapped card");
    if (claim.disposition === "shared-card" && Array.isArray(claim.cardIds)) {
      claim.cardIds.forEach(cardId => {
        const card = cardById.get(cardId);
        if (card && (!Array.isArray(card.claimIds) || card.claimIds.length < 2)) fail(owner + " marks " + cardId + " shared-card, but that card maps only one claim");
      });
    }
  });

  cards.forEach(card => {
    if (!isRecord(card) || !Array.isArray(card.claimIds)) return;
    const owner = "Card " + label(card, "unknown");
    card.claimIds.forEach(claimId => {
      const claim = claimById.get(claimId);
      if (claim && (!Array.isArray(claim.cardIds) || !claim.cardIds.includes(card.id))) fail(owner + " maps claim " + claimId + " without a reciprocal cardIds reference");
    });
    const mappedClaims = card.claimIds.map(claimId => claimById.get(claimId)).filter(Boolean);
    if (mappedClaims.length) {
      const rank = { core: 0, "applied-core": 1, enrichment: 2 };
      const strongest = mappedClaims.slice().sort((left, right) => rank[left.tier] - rank[right.tier])[0];
      if (strongest && card.tier !== strongest.tier) fail(owner + " tier must match the strongest mapped claim tier (" + strongest.tier + ")");
      if (!mappedClaims.some(claim => claim.category === card.category)) fail(owner + " category does not match any mapped claim category");
      mappedClaims.forEach(claim => {
        const claimSources = new Set((claim.sourceRefs || []).map(sourceKey));
        if (claimSources.size && !(card.sourceRefs || []).some(ref => claimSources.has(sourceKey(ref)))) {
          fail(owner + " shares no resolved source with claim " + claim.claimId);
        }
      });
    }
  });

  return claimById;
}

function validateGoldenClaims(claimById, cardById) {
  const hasCpbLedger = Array.from(claimById.keys()).some(claimId => claimId.startsWith("cpb.circuit."));
  if (!hasCpbLedger) return;
  CPB_GOLDEN_CLAIMS.forEach(claimId => {
    const claim = claimById.get(claimId);
    if (!claim) {
      fail("CPB claim ledger is missing golden claim " + claimId);
      return;
    }
    if (claim.required !== true || !["core", "applied-core"].includes(claim.tier)) {
      fail("CPB golden claim " + claimId + " must be required core/applied-core");
    }
    if (!Array.isArray(claim.cardIds) || !claim.cardIds.length) fail("CPB golden claim " + claimId + " has no mapped card");
  });

  const cardsFor = claimId => {
    const claim = claimById.get(claimId);
    return claim && Array.isArray(claim.cardIds) ? claim.cardIds.map(id => cardById.get(id)).filter(Boolean) : [];
  };
  const variables = cardsFor("cpb.circuit.roller.variables");
  if (variables.length && !variables.some(card => card.archetype === "bounded-set" && card.answerCount === 4 && card.ordered === false)) {
    fail("CPB roller-variable golden claim requires one unordered four-item bounded-set card");
  }
  const calibration = cardsFor("cpb.circuit.roller.occlusion-calibration");
  if (calibration.length && !calibration.some(card => card.archetype === "numeric-guideline" && isRecord(card.numeric))) {
    fail("CPB occlusion-calibration golden claim requires a numeric-guideline card with numeric metadata");
  }
  const afterload = cardsFor("cpb.circuit.roller.afterload-independence");
  if (afterload.length && !afterload.some(card => card.archetype === "contrast")) {
    fail("CPB afterload-independence golden claim requires a contrast card");
  }
  const obstruction = cardsFor("cpb.circuit.roller.obstruction-response");
  if (obstruction.length && !obstruction.some(card => card.archetype === "mechanism-decision")) {
    fail("CPB obstruction-response golden claim requires a mechanism-decision card");
  }
  const errors = cardsFor("cpb.circuit.roller.occlusion-errors");
  if (errors.length && !errors.some(card => card.archetype === "mapping-set" && card.answerCount === 2 && card.ordered === false)) {
    fail("CPB occlusion-errors golden claim requires one unordered two-item mapping-set card");
  }
}

function validateRebuiltSourceCoverage(claims) {
  const rebuiltSources = (Array.isArray(sandbox.RETRIEVAL_SOURCE_REBUILDS) ? sandbox.RETRIEVAL_SOURCE_REBUILDS : [])
    .filter(source => source && nonempty(source.type) && nonempty(source.id));
  if (!rebuiltSources.length) return;
  const claimRefs = new Set();
  claims.forEach(claim => {
    (Array.isArray(claim && claim.sourceRefs) ? claim.sourceRefs : []).forEach(ref => {
      if (ref && nonempty(ref.type) && nonempty(ref.id) && nonempty(ref.partId)) {
        claimRefs.add(sourceKey(ref) + ":" + String(ref.partId));
      }
    });
  });
  rebuiltSources.filter(source => source.type === "lesson").forEach(source => {
    const lesson = sandbox.LESSONS && sandbox.LESSONS[source.id];
    if (!lesson) {
      fail("Rebuilt lesson source does not resolve to authored lesson " + source.id);
      return;
    }
    (Array.isArray(lesson.chunks) ? lesson.chunks : []).forEach((chunk, index) => {
      if (chunk && chunk.type === "checkpoint") return;
      const partId = chunk && chunk.partId;
      const fullPartId = chunk && chunk.id;
      const owner = "Rebuilt lesson " + source.id + " chunk " + (index + 1);
      if (!nonempty(partId)) {
        fail(owner + " has no stable partId");
      } else if (!claimRefs.has(sourceKey(source) + ":" + String(partId)) &&
          !(nonempty(fullPartId) && claimRefs.has(sourceKey(source) + ":" + String(fullPartId)))) {
        fail(owner + " (" + partId + ") is absent from the claim ledger sourceRefs");
      }
    });
  });

  function authoredParts(source) {
    if (source.type === "anatomy") {
      const region = ((sandbox.ANATOMY && sandbox.ANATOMY.regions) || []).find(item => item.id === source.id);
      return (region && region.sections || []).map((section, index) => section.partId || "section:" + String(index + 1).padStart(2, "0"));
    }
    if (source.type === "surgery") {
      const operation = ((sandbox.SURGERY && sandbox.SURGERY.sections) || []).find(item => item.id === source.id);
      return operation ? (operation.blocks || []).map((block, index) => block.partId || "block:" + String(index + 1).padStart(2, "0"))
        .concat((operation.steps || []).map((step, index) => "step:" + String(index + 1).padStart(2, "0"))) : [];
    }
    if (source.type === "evidence") return ["population", "result", "tradeoff", "limitation"];
    if (source.type === "viva") {
      const viva = (sandbox.VIVA || []).find(item => item.id === source.id);
      return (viva && viva.beats || []).map((beat, index) => beat.partId || "beat:" + String(index + 1).padStart(2, "0"));
    }
    if (source.type === "physiology") {
      const lab = (sandbox.CSLab && typeof sandbox.CSLab.all === "function" ? sandbox.CSLab.all() : []).find(item => item.id === source.id);
      if (!lab) return [];
      const equations = lab.teach && Array.isArray(lab.teach.equations) ? lab.teach.equations : [];
      return ["concept"]
        .concat((lab.objectives || []).map((objective, index) => "objective:" + String(index + 1).padStart(2, "0")))
        .concat(equations.map((equation, index) => "equation:" + String(index + 1).padStart(2, "0")));
    }
    if (source.type === "exercise") {
      const exercise = (sandbox.EXERCISES || []).find(item => item.id === source.id);
      return exercise && Array.isArray(exercise.partIds) ? exercise.partIds : [];
    }
    if (source.type === "angiography" && source.id === "coronary-angiography") {
      const parts = [];
      ((sandbox.ANGIOGRAPHY && sandbox.ANGIOGRAPHY.chapters) || []).forEach(chapter => (chapter.sections || []).forEach(section => {
        parts.push("section:" + chapter.id + ":" + section.id);
      }));
      ((sandbox.ANGIOGRAPHY && sandbox.ANGIOGRAPHY.cases) || []).forEach(item => parts.push("case:" + item.id));
      return parts;
    }
    return [];
  }

  rebuiltSources.filter(source => source.type !== "lesson").forEach(source => {
    const key = sourceKey(source), parts = authoredParts(source);
    const sourceClaims = claims.filter(claim => (claim.sourceRefs || []).some(ref => sourceKey(ref) === key));
    if (!sourceClaims.length) {
      fail("Rebuilt source " + key + " has no claim-ledger entries");
      return;
    }
    parts.forEach(partId => {
      if (!claimRefs.has(key + ":" + String(partId))) {
        fail("Rebuilt source " + key + " authored part " + partId + " is absent from claim sourceRefs");
      }
    });
  });
}

function validateWorkloadReviews(cards) {
  const reviews = isRecord(sandbox.FLASHCARD_WORKLOAD_REVIEWS) ? sandbox.FLASHCARD_WORKLOAD_REVIEWS : {};
  const counts = new Map();
  cards.forEach(card => {
    if (!card || !["core", "applied-core"].includes(card.tier) || !card.source) return;
    const key = sourceKey(card.source);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  counts.forEach((count, key) => {
    if (count <= 40) return;
    const review = reviews[key];
    if (!isRecord(review) || !nonempty(review.rationale) || !nonempty(review.reviewer) || !parseISODate(review.reviewedAt)) {
      fail("Source " + key + " has " + count + " default-queue v2 cards and requires a documented workload review");
    } else if (review.count !== count) {
      fail("Source " + key + " workload review count " + review.count + " does not match " + count);
    }
  });
}

function validateRuntimeSchema(schema) {
  if (!isRecord(schema)) {
    fail("FlashcardSchema did not initialize");
    return;
  }
  if (schema.version !== 2) fail("FlashcardSchema.version must equal 2");
  [
    ["tiers", TIERS],
    ["categories", CATEGORIES],
    ["archetypes", ARCHETYPES],
    ["dispositions", DISPOSITIONS],
    ["precisions", PRECISIONS]
  ].forEach(([field, expected]) => {
    const actual = Array.isArray(schema[field]) ? Array.from(schema[field]) : null;
    if (!sameArray(actual, expected)) fail("FlashcardSchema." + field + " does not match the validator contract");
  });
}

function legacyAudit(cards) {
  const totals = {
    total: 0, malformed: 0, multiple: 0, longAnswer: 0, longPrompt: 0,
    multiSentence: 0, weakCue: 0
  };
  const byType = new Map();
  function bucket(type) {
    if (!byType.has(type)) byType.set(type, { total: 0, malformed: 0, multiple: 0, longAnswer: 0, longPrompt: 0, multiSentence: 0, weakCue: 0 });
    return byType.get(type);
  }
  cards.forEach(card => {
    const type = card && card.source && card.source.type || "unknown";
    const row = bucket(type);
    totals.total += 1;
    row.total += 1;
    const text = String(card && card.cloze || "");
    const token = /\{\{c([1-9]\d*)::([^{}]*?)(?:::(.*?))?\}\}/g;
    const matches = Array.from(text.matchAll(token));
    if (!matches.length || (text.match(/\{\{c\d+::/g) || []).length !== matches.length) {
      totals.malformed += 1; row.malformed += 1;
      return;
    }
    if (matches.length > 1 || new Set(matches.map(match => match[1])).size > 1) {
      totals.multiple += 1; row.multiple += 1;
    }
    const longest = Math.max.apply(null, matches.map(match => wordCount(match[2])));
    if (longest > 8) { totals.longAnswer += 1; row.longAnswer += 1; }
    const filled = text.replace(token, (_, index, answer) => answer);
    if (wordCount(filled) > 30) { totals.longPrompt += 1; row.longPrompt += 1; }
    if (sentenceCount(filled) > 1) { totals.multiSentence += 1; row.multiSentence += 1; }
    const first = matches[0];
    if (wordCount(text.slice(0, first.index)) < 2) { totals.weakCue += 1; row.weakCue += 1; }
  });
  return { totals, byType };
}

function printLegacyAudit(audit) {
  console.log("\nLegacy transition audit (non-blocking)");
  console.log("  total=" + audit.totals.total +
    " malformed=" + audit.totals.malformed +
    " multi-cloze=" + audit.totals.multiple +
    " answer>8w=" + audit.totals.longAnswer +
    " prompt>30w=" + audit.totals.longPrompt +
    " multi-sentence=" + audit.totals.multiSentence +
    " weak-cue=" + audit.totals.weakCue);
  Array.from(audit.byType.entries()).sort((left, right) => left[0].localeCompare(right[0])).forEach(([type, row]) => {
    console.log("  " + type + ": total=" + row.total +
      " malformed=" + row.malformed +
      " multi-cloze=" + row.multiple +
      " answer>8w=" + row.longAnswer +
      " prompt>30w=" + row.longPrompt +
      " multi-sentence=" + row.multiSentence +
      " weak-cue=" + row.weakCue);
  });
}

function finish(stats, audit) {
  const uniqueErrors = Array.from(new Set(errors));
  console.log("Uniform retrieval-card validator");
  if (STRICT_CLINICAL) console.log("  mode=clinical-release");
  console.log("  canonical=" + stats.canonical +
    " v2=" + stats.v2 +
    " legacy=" + stats.legacy +
    " claims=" + stats.claims +
    " pending-numeric-review=" + stats.pendingNumericReview +
    " pending-clinician-claims=" + (stats.pendingClinicianClaims || 0));
  if (stats.v2 === 0) console.log("  transition: no schema-v2 cards are active yet; legacy findings remain audit-only");
  notices.forEach(message => console.log("  note: " + message));
  if (audit) printLegacyAudit(audit);
  if (uniqueErrors.length) {
    console.error("\nFAIL: " + uniqueErrors.length + " retrieval-card validation error(s)");
    uniqueErrors.forEach(message => console.error("  - " + message));
    process.exitCode = 1;
  } else {
    console.log("\nPASS: schema-v2 retrieval cards and claim mappings satisfy the uniform contract");
  }
}

let scripts = pageScripts();
const catalogPositions = scripts.reduce((positions, src, index) => src === CATALOG_PATH ? positions.concat(index) : positions, []);
if (catalogPositions.length !== 1) fail("index.html must load CardCatalog exactly once");
const catalogIndex = catalogPositions.length ? catalogPositions[0] : scripts.length;
if (!scripts.includes(SCHEMA_PATH)) fail("index.html must load " + SCHEMA_PATH);
else if (scripts.indexOf(SCHEMA_PATH) > catalogIndex) fail(SCHEMA_PATH + " must load before CardCatalog");

discoveredRetrievalPacks().forEach(relative => {
  if (!scripts.includes(relative)) fail("Retrieval schema/pack exists but is not loaded by index.html: " + relative);
});
scripts.filter(isRetrievalPack).forEach(relative => {
  if (relative !== SCHEMA_PATH && scripts.indexOf(relative) < scripts.indexOf(SCHEMA_PATH)) fail(relative + " loads before the retrieval schema");
  if (scripts.indexOf(relative) > catalogIndex) fail(relative + " loads after CardCatalog");
});

let loadedCatalog = false;
const legacyAuthoredIds = new Set();
for (const relative of scripts) {
  if (!isCatalogInput(relative)) continue;
  const filename = path.join(ROOT, relative);
  if (!fs.existsSync(filename)) {
    fail("index.html references missing catalog input " + relative);
    continue;
  }
  if (relative === CATALOG_PATH) {
    const authored = []
      .concat(Array.isArray(sandbox.FLASHCARDS) ? sandbox.FLASHCARDS : [])
      .concat(Array.isArray(sandbox.LESSON_CLOZE_CARDS) ? sandbox.LESSON_CLOZE_CARDS : [])
      .concat(sandbox.ANATOMY && Array.isArray(sandbox.ANATOMY.cards) ? sandbox.ANATOMY.cards : [])
      .concat(sandbox.SURGERY && Array.isArray(sandbox.SURGERY.cards) ? sandbox.SURGERY.cards : [])
      .concat(Array.isArray(sandbox.MODULE_CLOZE_CARDS) ? sandbox.MODULE_CLOZE_CARDS : []);
    authored.forEach(card => {
      if (card && card.schemaVersion !== 2 && card.id != null && String(card.id).trim()) legacyAuthoredIds.add(String(card.id));
    });
  }
  try {
    load(relative);
  } catch (error) {
    fail("Could not load " + relative + ": " + error.message);
  }
  if (relative === CATALOG_PATH) {
    loadedCatalog = true;
    break;
  }
}

if (!loadedCatalog || !sandbox.CardCatalog) {
  fail("CardCatalog did not load");
  finish({ canonical: 0, v2: 0, legacy: 0, claims: 0, pendingNumericReview: 0 }, null);
} else {
  const catalog = sandbox.CardCatalog;
  validateRuntimeSchema(sandbox.FlashcardSchema);
  authoredSourceKeys = collectAuthoredSourceKeys();
  const canonical = catalog.all();
  const registry = Array.isArray(sandbox.RETRIEVAL_CARDS) ? Array.from(sandbox.RETRIEVAL_CARDS) : [];
  const claims = Array.isArray(sandbox.FLASHCARD_CLAIMS) ? Array.from(sandbox.FLASHCARD_CLAIMS) : [];
  const canonicalV2 = canonical.filter(card => card && card.schemaVersion === 2);
  const legacy = canonical.filter(card => !card || card.schemaVersion !== 2);
  const registryV2 = registry.filter(card => card && card.schemaVersion === 2);
  const audit = legacyAudit(legacy);

  if (registry.some(card => !card || card.schemaVersion !== 2)) fail("Every RETRIEVAL_CARDS entry must use schemaVersion: 2");
  const registryIds = new Set();
  registryV2.forEach((card, index) => {
    if (registryIds.has(card.id)) fail("Duplicate RETRIEVAL_CARDS ID " + card.id + " at registry index " + index);
    registryIds.add(card.id);
  });
  const canonicalV2Ids = new Set();
  canonicalV2.forEach(card => {
    if (canonicalV2Ids.has(card.id)) fail("Duplicate canonical schema-v2 ID " + card.id);
    canonicalV2Ids.add(card.id);
  });
  registryIds.forEach(id => { if (!canonicalV2Ids.has(id)) fail("Retrieval card " + id + " is not active in the canonical CardCatalog"); });
  canonicalV2Ids.forEach(id => { if (!registryIds.has(id)) fail("Canonical schema-v2 card " + id + " is absent from RETRIEVAL_CARDS"); });
  if (registryIds.size !== canonicalV2Ids.size) fail("Canonical schema-v2 membership does not exactly match RETRIEVAL_CARDS");

  if (canonicalV2.length && !claims.length) fail("Schema-v2 cards require a FLASHCARD_CLAIMS ledger");
  const claimById = validateClaims(claims, registryV2, catalog);
  const validated = registryV2.map((card, index) => validateCard(card, index, catalog, claimById, legacyAuthoredIds)).filter(Boolean);
  const cardById = new Map(registryV2.map(card => [card.id, card]));
  validateGoldenClaims(claimById, cardById);
  validateRebuiltSourceCoverage(claims);
  validateWorkloadReviews(registryV2);

  const exactCloze = new Map();
  const exactFilled = new Map();
  validated.forEach(item => {
    const clozeKey = normalizeComparable(item.card.cloze);
    const filledKey = normalizeComparable(item.parsed.filled);
    if (exactCloze.has(clozeKey)) fail("Cards " + exactCloze.get(clozeKey) + " and " + item.card.id + " duplicate the same cloze prompt");
    else exactCloze.set(clozeKey, item.card.id);
    if (exactFilled.has(filledKey)) fail("Cards " + exactFilled.get(filledKey) + " and " + item.card.id + " duplicate the same filled prompt");
    else exactFilled.set(filledKey, item.card.id);
  });
  for (let left = 0; left < validated.length; left += 1) {
    for (let right = left + 1; right < validated.length; right += 1) {
      const a = validated[left], b = validated[right];
      if (wordCount(a.parsed.filled) < 8 || wordCount(b.parsed.filled) < 8) continue;
      const sharedSource = (a.card.sourceRefs || []).some(ref => (b.card.sourceRefs || []).some(other => sourceKey(ref) === sourceKey(other)));
      const sharedClaim = (a.card.claimIds || []).some(claimId => (b.card.claimIds || []).includes(claimId));
      if (!sharedSource && !sharedClaim) continue;
      const similarity = jaccard(a.parsed.filled, b.parsed.filled);
      if (similarity >= 0.96 && normalizeComparable(a.parsed.filled) !== normalizeComparable(b.parsed.filled)) {
        fail("Cards " + a.card.id + " and " + b.card.id + " are near-duplicate prompts (Jaccard " + similarity.toFixed(2) + ")");
      }
    }
  }

  const pendingNumericReview = validated.filter(item => item.pendingNumericReview).length;
  const pendingClinicianClaims = claims.filter(claim => !nonempty(claim && claim.reviewer) || !/^clinician:/i.test(claim.reviewer.trim())).length;
  if (pendingNumericReview) notice(pendingNumericReview + " non-guideline numeric card(s) explicitly remain pending clinical review");
  if (pendingClinicianClaims) notice(pendingClinicianClaims + " claim(s) remain blocked from clinical release pending named clinician sign-off");
  finish({
    canonical: canonical.length,
    v2: canonicalV2.length,
    legacy: legacy.length,
    claims: claims.length,
    pendingNumericReview,
    pendingClinicianClaims
  }, audit);
}
