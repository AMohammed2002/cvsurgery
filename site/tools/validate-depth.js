/* Depth validator — the Sequence-1 measurement harness for DAY_CONTENT_UPGRADE_PLAN.md.
 *
 * It cannot judge medical truth. It judges the STRUCTURAL SIGNATURE of PGY-5 depth, which is exactly
 * the shape the rejected pass lacked: a Level-4 "Senior Reasoning" lesson layer and a Level-5
 * "Mastery" set per day; a floor of decision-type items (when-not-to / complication-rescue /
 * dosed-algorithm); evidence items carrying population/endpoint/effect/limitation (not just a trial
 * name); and four-part quantitative items (number + condition + exception + resolver), not naked
 * numbers.
 *
 * Runs:
 *   node tools/validate-depth.js            group the real per-day data by its `day` field and audit.
 *                                           Exits non-zero while content is still shallow — that is
 *                                           the POINT (it proves the gate discriminates). Days flip to
 *                                           PASS as they are upgraded.
 *   node tools/validate-depth.js --selftest load ONLY the deep synthetic fixture and confirm a fully
 *                                           upgraded day PASSES. Exits 0 iff the fixture passes. This
 *                                           proves the validator can tell deep from shallow, not just
 *                                           fail everything.
 *   node tools/validate-depth.js --json     machine-readable per-day report to stdout.
 *
 * New optional fields it reads are documented in DEPTH_SCHEMA.md. All fields are optional, so the
 * four existing validators are unaffected.
 */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "js/data");

const SELFTEST = process.argv.includes("--selftest");
const JSON_OUT = process.argv.includes("--json");

const KIND_ENUM = new Set([
  "recall", "quantitative", "evidence", "operative-step",
  "complication-rescue", "when-not-to", "dosed-algorithm", "reconcile-discordant",
  // "cloze" is a legitimate flashcard delivery format (fill-in-the-blank), orthogonal to the
  // decision taxonomy above; it is recognized here so cloze decks validate, but it counts toward
  // no depth floor.
  "cloze"
]);
const DECISION_KINDS = new Set(["when-not-to", "complication-rescue", "dosed-algorithm"]);
const RESCUE_KINDS = new Set(["complication-rescue", "dosed-algorithm"]);
const QUANT_KEYS = ["number", "condition", "exception", "resolver"];
const EVIDENCE_KEYS = ["population", "endpoint", "effect", "limitation", "source"];

/* Per-day floors. Derived from the per-day PGY-5 specs in Part 3 of the plan. A content day passes
 * only when all of its floors are met. Day 14 is the mock exam (no lessons): it must instead carry a
 * re-weighted band of L4/L5 questions.
 *   l4/l5         require a Senior (L4) and Mastery (L5) lesson chunk on that day
 *   whenNotTo     min questions with kind "when-not-to"
 *   rescue        min questions with kind "complication-rescue" OR "dosed-algorithm"
 *   quantFour     min four-part quantitative items (flashcards + questions)
 *   evidence      min well-formed evidence items (questions) — trial-leaning days only
 *   operative     min operative-step items (questions) — days coupling an operation
 *   l45Questions  (day 14 only) min questions tagged level >= 4
 */
const DAY_REQ = {
  1:  { theme: "Cardiac & Mediastinal Anatomy",           l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 2, evidence: 0, operative: 1 },
  2:  { theme: "Cardiopulmonary Bypass & Cardioplegia",   l4: true, l5: true, whenNotTo: 1, rescue: 2, quantFour: 4, evidence: 0, operative: 1 },
  3:  { theme: "Coronary Physiology & Ischemia",          l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 3, evidence: 1, operative: 0 },
  4:  { theme: "Valvular Pathology & Hemodynamics",       l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 4, evidence: 1, operative: 0 },
  5:  { theme: "Cardiac Imaging & Interpretation",        l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 2, evidence: 0, operative: 0 },
  6:  { theme: "Preoperative Evaluation & Risk",          l4: true, l5: true, whenNotTo: 2, rescue: 0, quantFour: 2, evidence: 1, operative: 0 },
  7:  { theme: "CABG: Indications & Evidence",            l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 2, evidence: 2, operative: 2 },
  8:  { theme: "Valve Surgery: SAVR, Mitral & Tricuspid", l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 3, evidence: 2, operative: 2 },
  9:  { theme: "Aortic Surgery & Pericardial Disease",    l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 2, evidence: 1, operative: 1 },
  10: { theme: "Mechanical Circulatory Support",          l4: true, l5: true, whenNotTo: 1, rescue: 2, quantFour: 2, evidence: 1, operative: 0 },
  11: { theme: "Hemostasis, Transfusion & Coagulation",   l4: true, l5: true, whenNotTo: 1, rescue: 2, quantFour: 3, evidence: 0, operative: 0 },
  12: { theme: "Pacing & Conduction Disturbances",        l4: true, l5: true, whenNotTo: 1, rescue: 1, quantFour: 2, evidence: 0, operative: 0 },
  13: { theme: "Cardiac ICU & Postoperative Complications", l4: true, l5: true, whenNotTo: 1, rescue: 2, quantFour: 3, evidence: 0, operative: 0 },
  14: { theme: "Cumulative Synthesis & Written Exam",      exam: true, l45Questions: 15 }
};

/* ---- load data into an isolated window ---- */
function loadWindow(files, baseDir) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of files) {
    const p = path.join(baseDir, f);
    if (!fs.existsSync(p)) continue;
    vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f });
  }
  return ctx.window;
}

let W, structuralErrs = [];
if (SELFTEST) {
  const fixture = path.join(__dirname, "fixtures", "depth-fixture.js");
  if (!fs.existsSync(fixture)) { console.error("FATAL: missing fixture " + fixture); process.exit(2); }
  W = loadWindow(["depth-fixture.js"], path.join(__dirname, "fixtures"));
} else {
  const files = fs.readdirSync(dataDir).filter(f => /^(lessons|flashcards|questions)-d\d+\.js$/.test(f));
  files.push("curriculum.js", "flashcards-cloze-plan.js");
  W = loadWindow(files, dataDir);
}

const lessons = Object.values(W.LESSONS || {});
const cards = W.FLASHCARDS || [];
const questions = W.QUESTIONS || [];

/* ---- structural validation of the new optional fields (runs in every mode) ---- */
function checkLevel(v, tag) {
  if (v === undefined) return;
  if (!Number.isInteger(v) || v < 1 || v > 5) structuralErrs.push(tag + ": level must be an integer 1-5 (got " + JSON.stringify(v) + ")");
}
function checkItem(it, tag) {
  checkLevel(it.level, tag);
  const kind = it.depthKind || it.kind;
  if (kind !== undefined && !KIND_ENUM.has(kind)) structuralErrs.push(tag + ": unknown kind '" + kind + "'");
  if (it.level >= 4 && kind === "recall") structuralErrs.push(tag + ": a level>=4 item cannot be kind 'recall' (naked-recall tell)");
  if (kind === "quantitative") {
    const q = it.quant;
    if (!q || QUANT_KEYS.some(k => !q[k] || String(q[k]).trim() === ""))
      structuralErrs.push(tag + ": kind 'quantitative' requires a full quant{" + QUANT_KEYS.join(",") + "} (naked-number tell)");
  }
  if (kind === "evidence") {
    const e = it.evidence;
    if (!e || EVIDENCE_KEYS.some(k => !e[k] || String(e[k]).trim() === ""))
      structuralErrs.push(tag + ": kind 'evidence' requires a full evidence{" + EVIDENCE_KEYS.join(",") + "} (name-drop tell)");
  }
}
for (const c of cards) checkItem(c, "card " + (c.id || "?"));
for (const q of questions) checkItem(q, "question " + (q.id || "?"));

/* is a quant object complete (four non-empty parts)? */
function fourPart(it) {
  return (it.depthKind || it.kind) === "quantitative" && it.quant && QUANT_KEYS.every(k => it.quant[k] && String(it.quant[k]).trim() !== "");
}
function goodEvidence(it) {
  return (it.depthKind || it.kind) === "evidence" && it.evidence && EVIDENCE_KEYS.every(k => it.evidence[k] && String(it.evidence[k]).trim() !== "");
}

/* ---- aggregate per day (by the authoritative `day` field, never by filename) ---- */
function blankDay() {
  return { l4: 0, l5: 0, whenNotTo: 0, rescue: 0, quantFour: 0, evidence: 0, operative: 0, l45Questions: 0,
           lessons: 0, cards: 0, questions: 0 };
}
const days = {};
for (let d = 1; d <= 14; d++) days[d] = blankDay();

for (const l of lessons) {
  const d = l.day; if (!days[d]) continue;
  days[d].lessons++;
  for (const ch of (l.chunks || [])) {
    if (ch && ch.level === 4) days[d].l4++;
    if (ch && ch.level === 5) days[d].l5++;
    checkLevel(ch && ch.level, "lesson " + l.id + " chunk");
  }
}
for (const c of cards) {
  const d = c.day; if (!days[d]) continue;
  days[d].cards++;
  if (fourPart(c)) days[d].quantFour++;
}
for (const q of questions) {
  const d = q.day; if (!days[d]) continue;
  days[d].questions++;
  if (fourPart(q)) days[d].quantFour++;
  if (goodEvidence(q)) days[d].evidence++;
  if (q.kind === "operative-step") days[d].operative++;
  if (q.kind === "when-not-to") days[d].whenNotTo++;
  if (RESCUE_KINDS.has(q.kind)) days[d].rescue++;
  if (q.level >= 4) days[d].l45Questions++;
}

/* ---- evaluate each day against its floors ---- */
function evalDay(d) {
  const req = DAY_REQ[d], got = days[d], fails = [];
  if (req.exam) {
    if (got.l45Questions < req.l45Questions) fails.push(`mock exam needs >=${req.l45Questions} L4/L5 questions (has ${got.l45Questions})`);
    return fails;
  }
  if (req.l4 && got.l4 < 1) fails.push("no Level-4 Senior Reasoning lesson layer (needs >=1 chunk tagged level:4)");
  if (req.l5 && got.l5 < 1) fails.push("no Level-5 Mastery lesson layer (needs >=1 chunk tagged level:5)");
  if (got.whenNotTo < req.whenNotTo) fails.push(`when-not-to items ${got.whenNotTo}/${req.whenNotTo}`);
  if (got.rescue < req.rescue) fails.push(`complication-rescue/dosed-algorithm items ${got.rescue}/${req.rescue}`);
  if (got.quantFour < req.quantFour) fails.push(`four-part quantitative items ${got.quantFour}/${req.quantFour}`);
  if (got.evidence < req.evidence) fails.push(`well-formed evidence items ${got.evidence}/${req.evidence}`);
  if (got.operative < req.operative) fails.push(`operative-step items ${got.operative}/${req.operative}`);
  return fails;
}

const report = {};
let passCount = 0;
for (let d = 1; d <= 14; d++) report[d] = evalDay(d);
for (let d = 1; d <= 14; d++) if (report[d].length === 0) passCount++;

/* ---- output ---- */
if (JSON_OUT) {
  console.log(JSON.stringify({ mode: SELFTEST ? "selftest" : "content", structuralErrs, days, report }, null, 2));
} else {
  console.log("=== validate-depth.js" + (SELFTEST ? "  [SELFTEST — deep fixture]" : "  [content]") + " ===");
  console.log(`Loaded: ${lessons.length} lessons, ${cards.length} flashcards, ${questions.length} questions\n`);
  const col = (s, n) => String(s).padEnd(n);
  console.log(col("Day", 4) + col("PASS", 6) + col("L4", 4) + col("L5", 4) + col("wNot", 6) + col("resc", 6) + col("q4", 4) + col("evid", 6) + col("oper", 6) + "theme");
  for (let d = 1; d <= 14; d++) {
    const g = days[d], ok = report[d].length === 0;
    const line = col(d, 4) + col(ok ? "  ✓" : "  ✗", 6) + col(g.l4, 4) + col(g.l5, 4) +
      col(g.whenNotTo, 6) + col(g.rescue, 6) + col(g.quantFour, 4) + col(g.evidence, 6) +
      col(g.operative, 6) + (DAY_REQ[d].theme || "");
    console.log(line);
    if (!ok) report[d].forEach(f => console.log("        ✗ " + f));
  }
  console.log(`\nDays passing: ${passCount}/14`);
  if (structuralErrs.length) {
    console.log(`\n--- STRUCTURAL ERRORS in new depth fields (${structuralErrs.length}) ---`);
    structuralErrs.forEach(e => console.log("  ✗ " + e));
  }
}

/* ---- exit semantics ---- */
if (SELFTEST) {
  // Only the day(s) the fixture actually populates must pass — the fixture models one fully-upgraded
  // day, not all fourteen. Passing it proves the validator accepts deep content (not just rejects
  // shallow content).
  const present = [];
  for (let d = 1; d <= 14; d++) if (days[d].lessons || days[d].cards || days[d].questions) present.push(d);
  const ok = structuralErrs.length === 0 && present.length > 0 && present.every(d => report[d].length === 0);
  console.log("\nFixture populates day(s): " + present.join(", "));
  if (ok) { console.log("✓ SELFTEST PASSED — the deep fixture clears every floor for its day(s), so the validator discriminates deep from shallow."); process.exit(0); }
  console.log("✗ SELFTEST FAILED — the deep fixture should pass all floors for its day(s) but did not (see above).");
  process.exit(1);
}
/* Content mode: non-zero while any day is still shallow OR any new field is malformed. Expected to
 * fail today (pre-upgrade) — that is the discrimination proof. */
if (structuralErrs.length || passCount < 14) {
  console.log("\nNote: a non-zero exit here is EXPECTED until the days are upgraded. Days flip to ✓ as content lands.");
  process.exit(1);
}
if (!JSON_OUT) console.log("\n✓ All 14 days clear the depth floors.");
process.exit(0);
