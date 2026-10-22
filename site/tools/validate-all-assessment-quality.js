/* Cross-registry assessment diagnostics. Position balance is a hard gate.
   Longest-answer rates remain visible as a semantic-rewrite queue metric. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, ".."), ctx = { window: {} };
vm.createContext(ctx);
const errs = [], warnings = [];
function run(rel) { try { vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), ctx, { filename: rel }); } catch (e) { errs.push(rel + ": " + e.message); } }

run("js/surgery/surgery-base.js");
for (const f of fs.readdirSync(path.join(root, "js/surgery")).filter(f => /^surgery-(?!base).*\.js$/.test(f)).sort()) run("js/surgery/" + f);
run("js/trials/trials-base.js");
for (const f of fs.readdirSync(path.join(root, "js/trials")).filter(f => /^trials-(?!base).*\.js$/.test(f)).sort()) run("js/trials/" + f);
run("js/daily/day-ecosystem.js");

function stats(label, questions, slots) {
  const pos = Array(slots).fill(0); let longest = 0, extreme = 0, run = 0, maxRun = 0, last = null;
  questions.forEach(q => {
    if (!Array.isArray(q.options) || q.options.length !== slots || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= slots) { errs.push(label + " malformed item: " + (q.id || q.q || "?")); return; }
    pos[q.answer]++;
    const lens = q.options.map(x => String(x).replace(/<[^>]+>/g, "").trim().length), correct = lens[q.answer];
    if (correct === Math.max(...lens) && lens.filter(x => x === correct).length === 1) longest++;
    const distractors = lens.filter((_, i) => i !== q.answer).sort((a, b) => a - b), median = distractors[Math.floor(distractors.length / 2)] || 1;
    if (correct >= median * 1.5) extreme++;
    if (q.answer === last) run++; else { last = q.answer; run = 1; }
    maxRun = Math.max(maxRun, run);
  });
  const spread = Math.max(...pos) - Math.min(...pos);
  if (spread > 2) errs.push(label + " answer-position spread is " + spread + ": " + pos.join("/"));
  if (maxRun > 4) errs.push(label + " contains a run of " + maxRun + " identical answer positions");
  const rate = questions.length ? longest / questions.length : 0;
  if (rate > 0.45) warnings.push(label + " uniquely-longest correct rate " + (100 * rate).toFixed(1) + "% requires semantic option rewrite");
  console.log(label + ": n=" + questions.length + " positions=" + pos.join("/") + " longest=" + longest + " (" + (100 * rate).toFixed(1) + "%) extreme=" + extreme + " maxRun=" + maxRun);
}

stats("Surgery", ctx.window.SURGERY.questions || [], 4);
stats("Trials", (ctx.window.TRIALS.trials || []).flatMap(t => t.mcqs || []), 4);

const surgeryEngine = fs.readFileSync(path.join(root, "js/surgery/surgery.js"), "utf8");
const trialEngine = fs.readFileSync(path.join(root, "js/trials/trials.js"), "utf8");
if (!/map\(randomizedQuestion\)/.test(surgeryEngine)) errs.push("Surgery delivery no longer randomizes/remaps options");
if (!/map\(randomizedQuestion\)/.test(trialEngine)) errs.push("Trial delivery no longer randomizes/remaps options");

if (warnings.length) { console.log("\nSEMANTIC REVIEW QUEUE:"); warnings.forEach(w => console.log("  ⚠ " + w)); }
if (errs.length) { console.log("\nERRORS:"); errs.forEach(e => console.log("  ✗ " + e)); process.exit(1); }
console.log("\n✓ Cross-registry position balance and runtime option randomization pass.");
