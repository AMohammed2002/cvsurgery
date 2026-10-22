/* Structural validator for the STANDALONE Surgeries data.
   Run with: node tools/validate-surgery.js
   Independent of tools/validate.js — does not touch the 14-day data.
   Enforces the spec's >=20 MCQs-per-operation minimum as a HARD ERROR. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);

const dir = path.join(root, "js/surgery");
const dataFiles = ["surgery-base.js"]
  .concat(fs.readdirSync(dir).filter(f => /^surgery-(?!base).*\.js$/.test(f)).sort())
  .concat(fs.existsSync(path.join(dir, "cards-comprehensive.js")) ? ["cards-comprehensive.js"] : []);

let errs = [], warns = [];
for (const f of dataFiles) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { warns.push("MISSING FILE: " + f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f }); }
  catch (e) { errs.push("RUNTIME ERROR in " + f + ": " + e.message); }
}

const SX = ctx.window.SURGERY;
if (!SX) { console.error("FATAL: window.SURGERY not defined"); process.exit(1); }

const catIds = new Set(SX.categories.map(c => c.id));
const secIds = new Set();
const byCatSec = {}, byCatQ = {}, qBySec = {}, stepsBySec = {};
const noBT = (s, where) => { if (/`/.test(s)) errs.push(where + " contains a backtick (forbidden)"); if (/\$\{/.test(s)) errs.push(where + " contains ${ (forbidden)"); };

/* ---- sections ---- */
const reqS = ["id", "category", "title"];
for (const s of SX.sections) {
  const tag = s.id || s.title || "?";
  for (const k of reqS) if (!s[k]) errs.push("Section " + tag + " missing field: " + k);
  if (s.id && secIds.has(s.id)) errs.push("Duplicate section id: " + s.id);
  if (s.id) secIds.add(s.id);
  if (s.category && !catIds.has(s.category)) errs.push("Section " + tag + " unknown category: " + s.category);
  if (!Array.isArray(s.blocks) || !s.blocks.length) errs.push("Section " + tag + " has no blocks");
  (s.blocks || []).forEach((b, i) => {
    const bt = tag + " block#" + (i + 1);
    if (!b.title) errs.push(bt + " missing title");
    if (!b.html) errs.push(bt + " missing html");
    if (b.html) noBT(b.html, bt);
  });
  /* ---- OPTIONAL ordered steps (Order-the-Steps game) ---- */
  if (s.steps !== undefined) {
    if (!Array.isArray(s.steps)) errs.push("Section " + tag + " steps must be an array");
    else {
      if (s.steps.length < 10) errs.push("Section " + tag + " has " + s.steps.length + " steps (need >=10, target 14-20)");
      s.steps.forEach((st, i) => {
        if (typeof st !== "string" || !st.trim()) errs.push("Section " + tag + " step#" + (i + 1) + " must be a non-empty string");
        else noBT(st, "Section " + tag + " step#" + (i + 1));
      });
    }
    stepsBySec[s.id] = Array.isArray(s.steps) ? s.steps.length : 0;
  } else {
    warns.push("Section " + tag + " has no steps (Order-the-Steps game unavailable for it)");
  }
  if (s.category) byCatSec[s.category] = (byCatSec[s.category] || 0) + 1;
}

/* ---- questions ---- */
const qIds = new Set();
for (const q of SX.questions) {
  const tag = q.id || q.q || "?";
  if (!q.id) errs.push("Question missing id near: " + String(q.q || "").slice(0, 40));
  if (q.id && qIds.has(q.id)) errs.push("Duplicate question id: " + q.id);
  if (q.id) qIds.add(q.id);
  if (q.category && !catIds.has(q.category)) errs.push("Question " + tag + " unknown category: " + q.category);
  if (q.section && !secIds.has(q.section)) errs.push("Question " + tag + " unknown section: " + q.section);
  if (!q.section) warns.push("Question " + tag + " has no section id");
  if (!q.q) errs.push("Question " + tag + " missing q");
  if (q.q) noBT(q.q, "Question " + tag + " q");
  if (!Array.isArray(q.options) || q.options.length < 3) errs.push("Question " + tag + " needs >=3 options");
  (q.options || []).forEach((o, i) => noBT(String(o), "Question " + tag + " option#" + (i + 1)));
  if (typeof q.answer !== "number" || !q.options || q.answer < 0 || q.answer >= q.options.length)
    errs.push("Question " + tag + " answer index out of range");
  if (!q.explain) warns.push("Question " + tag + " has no explain");
  if (q.explain) noBT(q.explain, "Question " + tag + " explain");
  if (q.category) byCatQ[q.category] = (byCatQ[q.category] || 0) + 1;
  if (q.section) qBySec[q.section] = (qBySec[q.section] || 0) + 1;
}

/* ---- cloze flashcards (OPTIONAL per section; breast operations ship them) ---- */
const CLOZE = /\{\{c\d+::(.+?)(?:::(.+?))?\}\}/;
const cardIds = new Set();
const cBySec = {}, byCatC = {};
for (const c of (SX.cards || [])) {
  const tag = c.id || "?";
  if (!c.id) errs.push("Card missing id near: " + String(c.text || "").slice(0, 40));
  if (c.id && cardIds.has(c.id)) errs.push("Duplicate card id: " + c.id);
  if (c.id) cardIds.add(c.id);
  if (c.category && !catIds.has(c.category)) errs.push("Card " + tag + " unknown category: " + c.category);
  if (c.section && !secIds.has(c.section)) errs.push("Card " + tag + " unknown section: " + c.section);
  if (!c.section) warns.push("Card " + tag + " has no section id");
  if (!c.text) errs.push("Card " + tag + " missing text");
  if (c.text) {
    noBT(c.text, "Card " + tag + " text");
    if (!CLOZE.test(c.text)) errs.push("Card " + tag + " text has no cloze {{cN::...}} deletion");
  }
  if (c.category) byCatC[c.category] = (byCatC[c.category] || 0) + 1;
  if (c.section) cBySec[c.section] = (cBySec[c.section] || 0) + 1;
}

/* ---- per-section volume check: >=25 MCQs is a HARD ERROR (CardiacSchool minimum) ---- */
for (const s of SX.sections) {
  if (!s.id) continue;
  const nq = qBySec[s.id] || 0;
  if (nq < 25) errs.push("Section " + s.id + " has " + nq + " MCQs (CardiacSchool REQUIRES >=25)");
}

/* ---- per-section card check: only sections that ship cards must hit >=20 ---- */
for (const s of SX.sections) {
  if (!s.id) continue;
  const nc = cBySec[s.id] || 0;
  if (nc > 0 && nc < 20) errs.push("Section " + s.id + " has " + nc + " flashcards (sections with cards REQUIRE >=20)");
}

console.log("Categories:", SX.categories.length);
console.log("Sections:", SX.sections.length, JSON.stringify(byCatSec));
console.log("Questions:", SX.questions.length, JSON.stringify(byCatQ));
console.log("Cards:", (SX.cards || []).length, JSON.stringify(byCatC));
console.log("MCQs per section:", JSON.stringify(qBySec));
console.log("Cards per section:", JSON.stringify(cBySec));
console.log("Steps per section:", JSON.stringify(stepsBySec), "(" + Object.keys(stepsBySec).length + "/" + SX.sections.length + " ops have steps)");

if (warns.length) { console.log("\nWARNINGS (" + warns.length + "):"); warns.forEach(w => console.log("  ⚠ " + w)); }
if (errs.length) { console.log("\nERRORS (" + errs.length + "):"); errs.forEach(e => console.log("  ✗ " + e)); process.exitCode = 1; }
else console.log("\n✓ 0 errors");
