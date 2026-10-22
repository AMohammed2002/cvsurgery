/* Teaching Question Bank quality gate — run with: node tools/validate-assessment-quality.js */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, ".."), ctx = { window: {}, console, Math, Uint32Array };
vm.createContext(ctx);
const errors = [], warnings = [];
function run(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { errors.push(`Missing ${rel}`); return; }
  try { vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: rel }); }
  catch (error) { errors.push(`${rel}: runtime error: ${error.message}`); }
}
for (let day = 1; day <= 14; day++) run(`js/data/lessons-d${day}.js`);
run("js/data/question-sources.js");
for (let day = 1; day <= 14; day++) run(`js/data/questions-d${day}.js`);
run("js/question-bank.js");

const questions = ctx.window.QUESTIONS || [], lessons = Object.values(ctx.window.LESSONS || {});
const sources = ctx.window.QUESTION_SOURCES || {};
const kinds = new Set(["recall", "quantitative", "evidence", "operative-step", "complication-rescue", "when-not-to", "dosed-algorithm", "reconcile-discordant"]);
const strip = value => String(value || "").replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
const words = value => strip(value).split(/\s+/).filter(Boolean).length;
const normalized = value => strip(value).toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/[^a-z# ]/g, " ").replace(/\s+/g, " ").trim();
const tokens = value => new Set(normalized(value).split(" ").filter(token => token.length > 3));
const jaccard = (left, right) => {
  let overlap = 0;
  for (const token of left) if (right.has(token)) overlap++;
  return overlap / Math.max(1, left.size + right.size - overlap);
};
const idNumber = q => Number((/-(\d+)$/.exec(q.id || "") || [])[1] || Number.MAX_SAFE_INTEGER);
const contextual = q => /(patient|man|woman|year-old|undergo|postoperative|after |during |presents|develops|shows|finds|requires|scheduled|telemetry|echo|tee|ecg|catheter|bypass|surgery|cabg|valve|pressure|flow|gradient|output|imaging|ct |mri|waveform|operating room|intensive care|chest tube)/i.test(strip(q.stem));
const groups = (key) => questions.reduce((map, question) => {
  const label = String(question[key] == null ? "(missing)" : question[key]);
  (map[label] ||= []).push(question); return map;
}, {});
const seenIds = new Set(), exactStems = new Map();

if (questions.length !== 1056) errors.push(`Expected exactly 1056 questions, found ${questions.length}`);
if (lessons.length !== 44) errors.push(`Expected 44 lessons, found ${lessons.length}`);
Object.entries(sources).forEach(([id, source]) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) errors.push(`Source ${id}: id must be a stable lowercase slug`);
  if (!source || !strip(source.citation)) errors.push(`Source ${id}: missing bibliographic citation`);
  if (!source || !strip(source.type)) errors.push(`Source ${id}: missing source type`);
  if (!source || !strip(source.version)) errors.push(`Source ${id}: missing version or year`);
  if (!source || !/^\d{4}-\d{2}-\d{2}$/.test(String(source.reviewed || ""))) errors.push(`Source ${id}: reviewed date must use YYYY-MM-DD`);
  if (source && source.url && !/^https:\/\//.test(String(source.url))) errors.push(`Source ${id}: URL must use HTTPS`);
});

for (const q of questions) {
  const label = q.id || "question without id";
  const match = /^q-d([1-9]|1[0-4])-(\d{2,})$/.exec(q.id || "");
  if (!match) errors.push(`${label}: invalid id format`);
  else if (Number(match[1]) !== q.day) errors.push(`${label}: id day does not match data day ${q.day}`);
  if (seenIds.has(q.id)) errors.push(`${label}: duplicate id`); else seenIds.add(q.id);
  const stemKey = normalized(q.stem);
  if (!stemKey) errors.push(`${label}: missing stem`);
  else if (exactStems.has(stemKey)) errors.push(`${label}: duplicate normalized stem (also ${exactStems.get(stemKey)})`);
  else exactStems.set(stemKey, label);
  if (!Number.isInteger(q.day) || q.day < 1 || q.day > 14) errors.push(`${label}: invalid day`);
  if (!q.lesson || !(ctx.window.LESSONS || {})[q.lesson]) errors.push(`${label}: invalid lesson ${q.lesson || "(missing)"}`);
  if (!q.topic) errors.push(`${label}: missing topic`);
  if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${label}: must have exactly four options`);
  else if (q.options.some(option => !strip(option))) errors.push(`${label}: contains an empty option`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${label}: invalid answer index`);
  if (words(q.stem) < 8) errors.push(`${label}: stem is too short (${words(q.stem)} words)`);
  const explanationWords = words(q.explain);
  if (explanationWords < 60) errors.push(`${label}: explanation has ${explanationWords} words; minimum is 60`);
  if (explanationWords > 220) warnings.push(`${label}: explanation has ${explanationWords} words; review for concision`);
  const objectiveWords = words(q.objective);
  if (objectiveWords < 10 || objectiveWords > 30) errors.push(`${label}: objective has ${objectiveWords} words; required 10-30`);
  if (!Number.isInteger(q.level) || q.level < 2 || q.level > 5) errors.push(`${label}: level must be an integer from 2 to 5`);
  if (!kinds.has(q.kind)) errors.push(`${label}: invalid or missing kind ${q.kind || "(missing)"}`);
  if (q.level >= 4 && q.kind === "recall") errors.push(`${label}: L4/L5 item cannot be recall`);
  if (!Array.isArray(q.refs) || !q.refs.length) errors.push(`${label}: refs must contain at least one source id`);
  else q.refs.forEach(ref => { if (!sources[ref]) errors.push(`${label}: unresolved source id ${ref}`); });
  if (/\b(?:option|choice|answer)\s+[A-D]\b/i.test(strip(q.explain))) errors.push(`${label}: explanation refers to a fixed answer letter`);
  if (/<\s*[0-9]/.test(String(q.explain || ""))) errors.push(`${label}: explanation contains an unescaped numeric comparison`);
  if (q.kind === "evidence" && (!q.evidence || !q.evidence.population || !q.evidence.endpoint || !q.evidence.effect || !q.evidence.limitation || !q.evidence.source)) errors.push(`${label}: evidence item lacks complete evidence metadata`);
  if (q.kind === "quantitative" && (!q.quant || !q.quant.value || !q.quant.unit || !q.quant.context || !q.quant.consequence)) errors.push(`${label}: quantitative item lacks complete quant metadata`);
  (q.options || []).forEach(option => {
    const text = strip(option).toLowerCase();
    const raw = String(option || "");
    if (/^(all|none) of the above/.test(text)) errors.push(`${label}: all/none-of-the-above option is not allowed`);
    if (/while maintaining appropriate monitoring|with final decision based|interpreted together|followed by targeted reassessment|does not account for full clinical pattern/.test(text)) errors.push(`${label}: option contains filler language`);
    if ((raw.match(/\s[—–]\s/g) || []).length > 1 || /[—–]\s+(?:a |an )?(?:localization|mechanism|interpretation|conclusion|explanation|proposed|candidate).{0,100}(?:stated|expected|operative|resulting|adjacent|named)/i.test(raw)) {
      errors.push(`${label}: option uses an appended cue-balancing clause instead of a concise clinical alternative`);
    }
  });
}

const byLesson = groups("lesson"), byDay = groups("day"), byTopic = groups("topic");
for (const lesson of lessons) {
  const lessonQs = byLesson[lesson.id] || [];
  if (lessonQs.length !== 24) errors.push(`${lesson.id}: expected exactly 24 questions, found ${lessonQs.length}`);
  const advanced = lessonQs.filter(q => q.level >= 4).length;
  if (lessonQs.length && advanced / lessonQs.length < 0.5) errors.push(`${lesson.id}: only ${advanced}/24 questions are L4/L5; minimum is 12`);
}
const advanced = questions.filter(q => q.level >= 4).length;
if (questions.length && advanced / questions.length < 0.60) errors.push(`Only ${advanced}/${questions.length} questions are L4/L5; minimum is 60%`);
const recall = questions.filter(q => q.kind === "recall").length;
if (questions.length && recall / questions.length > 0.20) errors.push(`${recall}/${questions.length} questions are recall; maximum is 20%`);
const contextualCount = questions.filter(contextual).length;
if (questions.length && contextualCount / questions.length < 0.80) errors.push(`Only ${contextualCount}/${questions.length} stems are clinical/operative/data-context items; minimum is 80%`);

function distribution(label, list, limits) {
  const slots = [0, 0, 0, 0]; let longest = 0, shortest = 0, extreme = 0;
  list.slice().sort((a, b) => idNumber(a) - idNumber(b) || String(a.id).localeCompare(String(b.id))).forEach(q => {
    slots[q.answer]++;
    const lengths = q.options.map(option => strip(option).length), correct = lengths[q.answer];
    const max = Math.max(...lengths), min = Math.min(...lengths);
    if (correct === max && lengths.filter(length => length === max).length === 1) longest++;
    if (correct === min && lengths.filter(length => length === min).length === 1) shortest++;
    const distractors = lengths.filter((_, index) => index !== q.answer).sort((a, b) => a - b);
    if (distractors[1] && correct / distractors[1] >= 1.5) extreme++;
  });
  const spread = Math.max(...slots) - Math.min(...slots), n = list.length || 1;
  if (spread > limits.spread) errors.push(`${label}: answer-position spread ${spread} exceeds ${limits.spread} [${slots.join(", ")}]`);
  if (longest / n > limits.longest) errors.push(`${label}: uniquely-longest correct rate ${(100 * longest / n).toFixed(1)}% exceeds ${(100 * limits.longest).toFixed(0)}%`);
  if (extreme / n > limits.extreme) errors.push(`${label}: correct >=1.5x median distractor rate ${(100 * extreme / n).toFixed(1)}% exceeds ${(100 * limits.extreme).toFixed(0)}%`);
  if (shortest / n > 0.30) warnings.push(`${label}: uniquely-shortest correct rate ${(100 * shortest / n).toFixed(1)}% may be a cue`);
  return { slots, longest, shortest, extreme };
}
const global = distribution("Global", questions, { spread: 0, longest: 0.25, extreme: 0.15 });
if (global.slots.some(count => count !== 264)) errors.push(`Global: expected exact A/B/C/D 264/264/264/264, found ${global.slots.join("/")}`);
Object.entries(byLesson).forEach(([label, list]) => distribution(`Lesson ${label}`, list, { spread: 0, longest: 0.25, extreme: 0.20 }));
Object.entries(byDay).forEach(([label, list]) => distribution(`Day ${label}`, list, { spread: 1, longest: 0.30, extreme: 0.20 }));
Object.entries(byTopic).forEach(([label, list]) => distribution(`Topic ${label}`, list, { spread: 1, longest: 0.30, extreme: 0.20 }));

for (const [day, list] of Object.entries(byDay)) {
  const sorted = list.slice().sort((a, b) => idNumber(a) - idNumber(b) || String(a.id).localeCompare(String(b.id)));
  let previous = null, runLength = 0;
  sorted.forEach(q => {
    runLength = q.answer === previous ? runLength + 1 : 1;
    if (runLength > 2) errors.push(`Day ${day}: answer run exceeds two at ${q.id}`);
    previous = q.answer;
  });
}

/* Global lexical duplicate gate and softer author-review diagnostics. */
const tokenSets = questions.map(q => tokens(q.stem));
const objectiveSets = questions.map(q => tokens(q.objective));
const explanationSets = questions.map(q => tokens(q.explain));
const objectiveReview = [], explanationReview = [];
let reviewPairs = 0;
for (let i = 0; i < questions.length; i++) {
  for (let j = i + 1; j < questions.length; j++) {
    const similarity = jaccard(tokenSets[i], tokenSets[j]);
    if (similarity >= 0.72) errors.push(`Near-duplicate stems ${questions[i].id}/${questions[j].id} (${similarity.toFixed(2)})`);
    else if (similarity >= 0.62 && reviewPairs < 30) { warnings.push(`Review similar stems ${questions[i].id}/${questions[j].id} (${similarity.toFixed(2)})`); reviewPairs++; }
    const objectiveSimilarity = jaccard(objectiveSets[i], objectiveSets[j]);
    if (objectiveSimilarity >= 0.80) objectiveReview.push([objectiveSimilarity, questions[i].id, questions[j].id]);
    const explanationSimilarity = jaccard(explanationSets[i], explanationSets[j]);
    if (explanationSimilarity >= 0.78) explanationReview.push([explanationSimilarity, questions[i].id, questions[j].id]);
  }
}
objectiveReview.sort((a, b) => b[0] - a[0]);
explanationReview.sort((a, b) => b[0] - a[0]);

console.log(`Questions: ${questions.length}; lessons: ${lessons.length}; L4/L5: ${advanced}; recall: ${recall}; contextual: ${contextualCount}`);
console.log(`Global A/B/C/D: ${global.slots.join("/")}; longest=${global.longest}; extreme=${global.extreme}; shortest=${global.shortest}`);
console.log(`Similarity review: ${objectiveReview.length} objective pair(s), ${explanationReview.length} explanation pair(s) above manual-review thresholds`);
objectiveReview.slice(0, 10).forEach(([score, left, right]) => console.log(`  ↳ Objective ${left}/${right} (${score.toFixed(2)})`));
explanationReview.slice(0, 10).forEach(([score, left, right]) => console.log(`  ↳ Explanation ${left}/${right} (${score.toFixed(2)})`));
console.log(`Warnings: ${warnings.length}; Errors: ${errors.length}`);
warnings.slice(0, 80).forEach(warning => console.log(`  ⚠ ${warning}`));
if (warnings.length > 80) console.log(`  … ${warnings.length - 80} additional warnings`);
errors.slice(0, 250).forEach(error => console.log(`  ✗ ${error}`));
if (errors.length > 250) console.log(`  … ${errors.length - 250} additional errors`);
process.exit(errors.length ? 1 : 0);
