/* Structural validator for the STANDALONE anatomy data.
   Run with: node tools/validate-anatomy.js
   Independent of tools/validate.js — does not touch the 14-day data. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);

const dir = path.join(root, "js/anatomy");
// Base and ordinary regions load first. The operative file appends theatre sections
// to existing regions, so it must run after those regions and before any card packs.
// The engine (anatomy.js) is skipped because it requires the DOM.
const discovered = fs.readdirSync(dir);
const regionFiles = discovered.filter(f => /^regions-.*\.js$/.test(f) && f !== "regions-operative.js").sort();
const cardFiles = discovered.filter(f => /^cards-.*\.js$/.test(f)).sort();
const dataFiles = ["anatomy-base.js", "diagrams.js"]
  .concat(regionFiles)
  .concat(discovered.includes("regions-operative.js") ? ["regions-operative.js"] : [])
  .concat(cardFiles);

let errs = [], warns = [];
for (const f of dataFiles) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { warns.push("MISSING FILE: " + f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f }); }
  catch (e) { errs.push("RUNTIME ERROR in " + f + ": " + e.message); }
}

const A = ctx.window.ANATOMY;
const ADG = ctx.window.ADG || {};
const SUBTYPES = ["structures", "arterial", "venous", "lymphatic", "nerves", "surgical"];

if (!A) { console.error("FATAL: window.ANATOMY not defined"); process.exit(1); }

const catIds = new Set(A.categories.map(c => c.id));
const regionIds = new Set();

/* regions */
for (const r of A.regions) {
  if (!r.id || !r.title || !r.category) { errs.push("Bad region: " + (r.id || "?")); continue; }
  if (regionIds.has(r.id)) errs.push("Duplicate region id: " + r.id);
  regionIds.add(r.id);
  if (!catIds.has(r.category)) errs.push("Region " + r.id + " has unknown category: " + r.category);
  if (!Array.isArray(r.sections) || !r.sections.length) warns.push("Region " + r.id + " has no sections");
  if (r.diagram) {
    const [ns, name] = String(r.diagram).split(".");
    const ok = ns === "ADG" ? !!ADG[name] : ns === "DG"; // DG lives in app data, not loaded here
    if (ns === "ADG" && !ok) errs.push("Region " + r.id + " references missing ADG." + name);
    if (ns !== "ADG" && ns !== "DG") errs.push("Region " + r.id + " bad diagram ref: " + r.diagram);
  }
}

/* cards */
const ids = new Set();
const byCat = {}, bySub = {}, byRegion = {};
const cloze = /\{\{c\d+::.+?\}\}/;
for (const c of A.cards) {
  if (!c.id || !c.region || !c.category || !c.subtype || !c.text) { errs.push("Bad card: " + (c.id || "?")); continue; }
  if (ids.has(c.id)) errs.push("Duplicate card id: " + c.id);
  ids.add(c.id);
  if (!catIds.has(c.category)) errs.push("Card " + c.id + " unknown category: " + c.category);
  if (!regionIds.has(c.region)) errs.push("Card " + c.id + " unknown region: " + c.region);
  if (!SUBTYPES.includes(c.subtype)) errs.push("Card " + c.id + " bad subtype: " + c.subtype);
  if (!cloze.test(c.text)) errs.push("Card " + c.id + " has no {{cN::...}} cloze deletion");
  byCat[c.category] = (byCat[c.category] || 0) + 1;
  bySub[c.subtype] = (bySub[c.subtype] || 0) + 1;
  byRegion[c.region] = (byRegion[c.region] || 0) + 1;
}

console.log("Categories:", A.categories.length);
console.log("Regions:", A.regions.length);
console.log("Cards:", A.cards.length);
console.log("By category:", JSON.stringify(byCat));
console.log("By subtype:", JSON.stringify(bySub));
const noCards = [...regionIds].filter(r => !byRegion[r]);
if (noCards.length) warns.push("Regions with 0 cards: " + noCards.join(", "));

if (warns.length) { console.log("\nWARNINGS (" + warns.length + "):"); warns.forEach(w => console.log("  ⚠ " + w)); }
if (errs.length) { console.log("\nERRORS (" + errs.length + "):"); errs.forEach(e => console.log("  ✗ " + e)); process.exitCode = 1; }
else console.log("\n✓ 0 errors");
