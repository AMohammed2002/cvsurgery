/* Structural validator for the STANDALONE Trials data.
   Run with: node tools/validate-trials.js
   Independent of tools/validate.js — does not touch the 14-day data. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);

const dir = path.join(root, "js/trials");
const dataFiles = ["trials-base.js"]
  .concat(fs.readdirSync(dir).filter(f => /^trials-(?!base).*\.js$/.test(f)).sort());

let errs = [], warns = [];
for (const f of dataFiles) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { warns.push("MISSING FILE: " + f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f }); }
  catch (e) { errs.push("RUNTIME ERROR in " + f + ": " + e.message); }
}

const T = ctx.window.TRIALS;
if (!T) { console.error("FATAL: window.TRIALS not defined"); process.exit(1); }

const catIds = new Set(T.categories.map(c => c.id));
const ids = new Set();
const byCat = {};
const req = ["id", "category", "name", "year", "journal", "topic", "question", "design", "outcome", "bottomLine", "citation"];

for (const t of T.trials) {
  const tag = t.id || t.name || "?";
  for (const k of req) if (!t[k]) errs.push("Trial " + tag + " missing field: " + k);
  if (t.id && ids.has(t.id)) errs.push("Duplicate trial id: " + t.id);
  if (t.id) ids.add(t.id);
  if (t.category && !catIds.has(t.category)) errs.push("Trial " + tag + " unknown category: " + t.category);
  if (!Array.isArray(t.mcqs) || t.mcqs.length < 3 || t.mcqs.length > 5)
    errs.push("Trial " + tag + " must have 3-5 mcqs (has " + (t.mcqs ? t.mcqs.length : 0) + ")");
  (t.mcqs || []).forEach((m, i) => {
    const mt = tag + " mcq#" + (i + 1);
    if (!m.q) errs.push(mt + " missing q");
    if (!Array.isArray(m.options) || m.options.length < 3) errs.push(mt + " needs >=3 options");
    if (typeof m.answer !== "number" || !m.options || m.answer < 0 || m.answer >= m.options.length)
      errs.push(mt + " answer index out of range");
    if (!m.explain) warns.push(mt + " has no explain");
  });
  if (t.category) byCat[t.category] = (byCat[t.category] || 0) + 1;
}

console.log("Categories:", T.categories.length);
console.log("Trials:", T.trials.length);
console.log("By category:", JSON.stringify(byCat));
console.log("Total MCQs:", T.trials.reduce((a, t) => a + (t.mcqs ? t.mcqs.length : 0), 0));

if (warns.length) { console.log("\nWARNINGS (" + warns.length + "):"); warns.forEach(w => console.log("  ⚠ " + w)); }
if (errs.length) { console.log("\nERRORS (" + errs.length + "):"); errs.forEach(e => console.log("  ✗ " + e)); process.exitCode = 1; }
else console.log("\n✓ 0 errors");
