/* Structural validator — run with: node tools/validate.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {console};ctx.window=ctx;ctx.self=ctx;
vm.createContext(ctx);
let errs=[],warns=[];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),m=>m[1].split('?')[0]);
for(const f of files){
  if(!/^(js\/data\/|js\/anatomy\/(anatomy-base|regions-|cards-)|js\/trials\/trials-(base|coronary|valve|aortic|general)|js\/physiology\/(lab-core|lab-metadata|ecg-engine)|js\/surgery\/(surgery-base|surgery-|cards-comprehensive)|js\/advanced\/advanced-data|js\/angiography\/angiography-data|js\/daily\/day-ecosystem)/.test(f))continue;
  try{vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});}catch(e){errs.push('RUNTIME ERROR in '+f+': '+e.message);}
  if(f==='js/data/card-catalog.js')break;
}
const W = ctx.window;

/* curriculum */
if (!W.CURRICULUM || W.CURRICULUM.length !== 14) errs.push("CURRICULUM must have 14 days");

/* lessons */
const lessons = Object.values(W.LESSONS || {});
console.log("Lessons:", lessons.length);
const expectDays = {};
for (const l of lessons) {
  if (!l.id || !l.title || !l.day || !Array.isArray(l.chunks) || !l.chunks.length) errs.push("Bad lesson: " + (l.id || "?"));
  expectDays[l.day] = (expectDays[l.day] || 0) + 1;
  l.chunks.forEach((c, i) => {
    if (c.type === "checkpoint") {
      if (!c.q || !Array.isArray(c.options) || c.options.length < 2) errs.push(l.id + " chunk " + i + ": bad checkpoint");
      else if (typeof c.answer !== "number" || c.answer < 0 || c.answer >= c.options.length) errs.push(l.id + " chunk " + i + ": answer out of range");
      if (!c.explain) warns.push(l.id + " chunk " + i + ": checkpoint missing explain");
    } else {
      if (!c.html) errs.push(l.id + " chunk " + i + ": teaching chunk missing html");
      else {
        const open = (c.html.match(/<div/g) || []).length, close = (c.html.match(/<\/div>/g) || []).length;
        if (open !== close) warns.push(l.id + " chunk " + i + ": div mismatch (" + open + " open / " + close + " close)");
      }
    }
  });
}
for (let d = 1; d <= 14; d++) if (!expectDays[d]) errs.push("No lessons for day " + d);

/* flashcards */
const cards = W.FLASHCARDS || [];
console.log("Flashcards:", cards.length);
const cardIds = new Set(), cardsByDay = {}, cardsByLesson = {};
for (const c of cards) {
  if (!c.id || !c.front || !c.back || !c.linkedDays || !c.topic) errs.push("Bad card: " + JSON.stringify(c).slice(0, 60));
  if (cardIds.has(c.id)) errs.push("Duplicate card id: " + c.id);
  cardIds.add(c.id);
  if (!c.lesson && !c.surgery && !c.unlockDay && !(c.source && c.source.type)) errs.push("Card " + c.id + " missing lesson/surgery gate");
  else if (c.lesson && !(W.LESSONS || {})[c.lesson]) errs.push("Card " + c.id + " references unknown lesson " + c.lesson);
  if ((!c.source || c.source.type!=="anatomy") && !c.surgery) {
    cardsByDay[c.day] = (cardsByDay[c.day] || 0) + 1;
    if (c.lesson) cardsByLesson[c.lesson] = (cardsByLesson[c.lesson] || 0) + 1;
    if (c.kind !== "cloze" || !/cloze-blank/.test(c.front) || !/cloze-answer/.test(c.back)) errs.push("Card " + c.id + " is not a rendered cloze card");
    const promptContext = c.front.replace(/<[^>]+>/g, "").replace("[…]", "").trim();
    if (promptContext.length < 12) errs.push("Card " + c.id + " has too little cloze context");
  }
}
// Counts are diagnostic only. Retrieval-v2 coverage is claim-ledger based; it
// deliberately has no sentence-derived per-day or per-lesson quota.
console.log("Cloze cards by day:", JSON.stringify(cardsByDay));

/* questions */
const qs = W.QUESTIONS || [];
console.log("Questions:", qs.length);
const qIds = new Set(), qDays = {};
for (const q of qs) {
  if (!q.id || !q.stem || !Array.isArray(q.options) || q.options.length < 3) errs.push("Bad question: " + (q.id || "?"));
  else if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) errs.push(q.id + ": answer out of range");
  if (!q.lesson && !q.surgery) errs.push(q.id + " missing lesson/surgery gate");
  else if (q.lesson && !(W.LESSONS || {})[q.lesson]) errs.push(q.id + " references unknown lesson " + q.lesson);
  if (!q.explain) warns.push(q.id + ": missing explain");
  if (qIds.has(q.id)) errs.push("Duplicate question id: " + q.id);
  qIds.add(q.id); qDays[q.day] = (qDays[q.day] || 0) + 1;
}
console.log("Questions by day:", JSON.stringify(qDays));

/* exercises: zones must exist in their svg */
for (const e of W.EXERCISES || []) {
  if (e.type === "label") {
    for (const t of e.targets) {
      if (!e.svg.includes('data-zone="' + t.zone + '"')) errs.push(e.id + ": zone not in svg: " + t.zone);
    }
  } else if (e.type === "order") {
    if (!Array.isArray(e.steps) || e.steps.length < 4) errs.push(e.id + ": too few steps");
  }
}
console.log("Exercises:", (W.EXERCISES || []).length);

console.log("\n--- WARNINGS (" + warns.length + ") ---"); warns.forEach(w => console.log("  ⚠ " + w));
console.log("--- ERRORS (" + errs.length + ") ---"); errs.forEach(e => console.log("  ✗ " + e));
if (errs.length) process.exit(1);

const teachingImages = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-image-policy.js")],
  { stdio: "inherit" }
);
if (teachingImages.status) process.exit(teachingImages.status);

const surgeryImages = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-surgery-images.js")],
  { stdio: "inherit" }
);
if (surgeryImages.status) process.exit(surgeryImages.status);

const moduleCards = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-module-flashcards.js")],
  { stdio: "inherit" }
);
if (moduleCards.status) process.exit(moduleCards.status);

const canonicalRuntime = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-canonical-runtime.js")],
  { stdio: "inherit" }
);
if (canonicalRuntime.status) process.exit(canonicalRuntime.status);

const retrievalCards = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-retrieval-cards.js")],
  { stdio: "inherit" }
);
if (retrievalCards.status) process.exit(retrievalCards.status);

const retrievalCatalog = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "test-retrieval-catalog.js")],
  { stdio: "inherit" }
);
if (retrievalCatalog.status) process.exit(retrievalCatalog.status);

const progressTransfer = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "test-progress-transfer.js")],
  { stdio: "inherit" }
);
if (progressTransfer.status) process.exit(progressTransfer.status);

const retrievalRelease = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "test-retrieval-release.js")],
  { stdio: "inherit" }
);
if (retrievalRelease.status) process.exit(retrievalRelease.status);

const offlineShell = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "test-offline-shell.js")],
  { stdio: "inherit" }
);
if (offlineShell.status) process.exit(offlineShell.status);

const unlimitedQueues = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-unlimited-card-queues.js")],
  { stdio: "inherit" }
);
if (unlimitedQueues.status) process.exit(unlimitedQueues.status);

const anatomy = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-anatomy.js")],
  { stdio: "inherit" }
);
if (anatomy.status) process.exit(anatomy.status);

const surgery = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-surgery.js")],
  { stdio: "inherit" }
);
if (surgery.status) process.exit(surgery.status);

const trials = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-trials.js")],
  { stdio: "inherit" }
);
if (trials.status) process.exit(trials.status);

const advanced = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-advanced.js")],
  { stdio: "inherit" }
);
if (advanced.status) process.exit(advanced.status);

const physiology = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-physiology.js")],
  { stdio: "inherit" }
);
if (physiology.status) process.exit(physiology.status);

const assessment = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-assessment-quality.js")],
  { stdio: "inherit" }
);
if (assessment.status) process.exit(assessment.status);

const dailyCircuit = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-day-ecosystem.js")],
  { stdio: "inherit" }
);
if (dailyCircuit.status) process.exit(dailyCircuit.status);

const angiography = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-angiography.js")],
  { stdio: "inherit" }
);
if (angiography.status) process.exit(angiography.status);

const altText = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-alt-text.js")],
  { stdio: "inherit" }
);
if (altText.status) process.exit(altText.status);
const linkTargets = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "check-links.js")],
  { stdio: "inherit" }
);
if (linkTargets.status) process.exit(linkTargets.status);
const allAssessments = require("child_process").spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-all-assessment-quality.js")],
  { stdio: "inherit" }
);
process.exit(allAssessments.status || 0);
