/* Validate the standalone Day 5 coronary angiography module.
   Run from the site directory with: node tools/validate-angiography.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const siteRoot = path.join(__dirname, "..");
const dataFile = path.join(siteRoot, "js", "angiography", "angiography-data.js");
const assetDir = path.join(siteRoot, "assets", "angiography");
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }
function clean(value) {
  return String(value == null ? "" : value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function hasText(value) {
  if (Array.isArray(value)) return value.some(hasText);
  if (value && typeof value === "object") return Object.values(value).some(hasText);
  return clean(value).length > 0;
}

if (!fs.existsSync(dataFile)) {
  console.error("FATAL: missing js/angiography/angiography-data.js");
  process.exit(1);
}

const context = { window: {}, console };
vm.createContext(context);
try {
  vm.runInContext(fs.readFileSync(dataFile, "utf8"), context, { filename: dataFile });
} catch (error) {
  console.error("FATAL: angiography-data.js failed to load: " + error.message);
  process.exit(1);
}

const A = context.window.ANGIOGRAPHY;
if (!A || typeof A !== "object") {
  console.error("FATAL: window.ANGIOGRAPHY is not defined");
  process.exit(1);
}

const chapters = Array.isArray(A.chapters) ? A.chapters : [];
const cases = Array.isArray(A.cases) ? A.cases : [];
const questions = Array.isArray(A.questions) ? A.questions : [];
const sources = Array.isArray(A.sources) ? A.sources : [];
const sections = chapters.flatMap(chapter => Array.isArray(chapter.sections) ? chapter.sections : []);

if (!A.meta || A.meta.day !== 5) fail("meta.day must be the number 5");
if (!A.meta || A.meta.linkedLesson !== "d4-cath") fail("meta.linkedLesson must be d4-cath");
const lessonFile = path.join(siteRoot, "js", "data", "lessons-d4.js");
if (!fs.existsSync(lessonFile)) fail("Linked-lesson source js/data/lessons-d4.js is missing");
else {
  const lessonContext = { window: {} };
  vm.createContext(lessonContext);
  try {
    vm.runInContext(fs.readFileSync(lessonFile, "utf8"), lessonContext, { filename: lessonFile });
    const linked = lessonContext.window.LESSONS && lessonContext.window.LESSONS["d4-cath"];
    if (!linked || linked.id !== "d4-cath" || linked.day !== 5) fail("linkedLesson d4-cath does not resolve to the Day 5 catheterisation lesson");
  } catch (error) {
    fail("Could not validate linkedLesson d4-cath: " + error.message);
  }
}
if (chapters.length < 10) fail(`Expected at least 10 chapters; found ${chapters.length}`);
if (sections.length < 40) fail(`Expected at least 40 sections; found ${sections.length}`);
if (cases.length < 12) fail(`Expected at least 12 cases; found ${cases.length}`);
if (questions.length < 30) fail(`Expected at least 30 questions; found ${questions.length}`);

/* IDs are deliberately global: a route or progress key must never be ambiguous. */
const allIds = new Map();
function registerId(id, kind) {
  const value = clean(id);
  if (!value) { fail(`${kind} is missing an id`); return; }
  if (allIds.has(value)) fail(`Duplicate id ${value} (${allIds.get(value)} and ${kind})`);
  else allIds.set(value, kind);
}

registerId(A.meta && A.meta.id, "module meta");
sources.forEach((source, index) => {
  if (source && typeof source === "object" && source.id) registerId(source.id, `source ${index + 1}`);
  if (!hasText(source)) fail(`Source ${index + 1} is empty`);
});
chapters.forEach((chapter, chapterIndex) => {
  const label = `chapter ${chapterIndex + 1}`;
  registerId(chapter && chapter.id, label);
  if (!clean(chapter && chapter.title)) fail(`${label} is missing a title`);
  if (!Array.isArray(chapter && chapter.sections) || !chapter.sections.length) fail(`${label} has no sections`);
  (chapter && Array.isArray(chapter.sections) ? chapter.sections : []).forEach((section, sectionIndex) => {
    const sectionLabel = `section ${chapter.id || chapterIndex + 1}/${sectionIndex + 1}`;
    registerId(section && section.id, sectionLabel);
    if (!clean(section && section.title)) fail(`${sectionLabel} is missing a title`);
    if (!hasText(section && [section.body, section.bullets, section.steps, section.table, section.pearl, section.caution])) {
      fail(`${sectionLabel} has no teaching content`);
    }
  });
});
cases.forEach((item, index) => registerId(item && item.id, `case ${index + 1}`));
questions.forEach((item, index) => registerId(item && item.id, `question ${index + 1}`));

const chapterIds = new Set(chapters.map(chapter => clean(chapter && chapter.id)).filter(Boolean));
const sourceIds = new Set(sources.map(source => clean(source && typeof source === "object" ? source.id : "")).filter(Boolean));
function checkChapterReference(item, label) {
  if (!chapterIds.has(clean(item && item.chapterId))) {
    fail(`${label} references unknown chapterId ${clean(item && item.chapterId) || "(missing)"}`);
  }
}
function checkOptionalReferences(value, label) {
  if (!value || typeof value !== "object") return;
  const refs = [
    ["sourceId", sourceIds], ["chapterId", chapterIds],
    ["relatedChapterIds", chapterIds]
  ];
  refs.forEach(([key, known]) => {
    if (!(key in value) || key === "chapterId") return;
    const values = Array.isArray(value[key]) ? value[key] : [value[key]];
    values.forEach(ref => {
      if (!known.has(clean(ref))) fail(`${label}.${key} references unknown id ${clean(ref) || "(missing)"}`);
    });
  });
}
chapters.forEach(chapter => {
  checkOptionalReferences(chapter, `chapter ${chapter.id || "?"}`);
  (chapter.sections || []).forEach(section => checkOptionalReferences(section, `section ${section.id || "?"}`));
});

/* Lightweight, dependency-free PNG/JPEG dimension readers. */
function imageDimensions(buffer, filename) {
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length >= 24 && buffer.subarray(0, 8).toString("hex") === pngSignature) {
    if (buffer.subarray(12, 16).toString("ascii") !== "IHDR") throw new Error("PNG has no IHDR header");
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), type: "PNG" };
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    let offset = 2;
    while (offset + 3 < buffer.length) {
      while (offset < buffer.length && buffer[offset] !== 0xff) offset++;
      while (offset < buffer.length && buffer[offset] === 0xff) offset++;
      if (offset >= buffer.length) break;
      const marker = buffer[offset++];
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 1 >= buffer.length) break;
      const length = buffer.readUInt16BE(offset);
      if (length < 2 || offset + length > buffer.length) break;
      if (sofMarkers.has(marker)) {
        if (length < 7) break;
        return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3), type: "JPEG" };
      }
      offset += length;
    }
    throw new Error("JPEG has no supported SOF marker");
  }
  throw new Error(`unsupported format for ${filename}; only PNG and JPEG are allowed`);
}

const referencedAssets = new Set();
const validatedPaths = new Set();
const imageMetadata = new Map();
function normalizeImagePath(src) {
  let relative = clean(src).replace(/\\/g, "/").replace(/^file:\/\//i, "");
  relative = relative.replace(/^\/+/, "").replace(/^site\//, "").replace(/^\.\//, "");
  return relative;
}
function validateImage(image, label) {
  if (!image || typeof image !== "object" || Array.isArray(image)) {
    fail(`${label} must be an image object with src, alt, caption, and source`);
    return;
  }
  const src = normalizeImagePath(image.src);
  if (!src) { fail(`${label} is missing src`); return; }
  if (!imageMetadata.has(src)) imageMetadata.set(src, image);
  if (clean(image.alt).length < 8) fail(`${label} has missing or incomplete alt text`);
  if (clean(image.caption).length < 8) fail(`${label} has missing or incomplete caption`);
  if (clean(image.source).length < 5) fail(`${label} has missing or incomplete source attribution`);
  const fullPath = path.resolve(siteRoot, src);
  const relativeFromSite = path.relative(siteRoot, fullPath).replace(/\\/g, "/");
  if (relativeFromSite.startsWith("../") || path.isAbsolute(relativeFromSite)) {
    fail(`${label} points outside site/: ${image.src}`);
    return;
  }
  referencedAssets.add(relativeFromSite);
  if (!fs.existsSync(fullPath)) { fail(`${label} image does not exist under site/: ${src}`); return; }
  const stat = fs.statSync(fullPath);
  if (!stat.isFile() || stat.size === 0) { fail(`${label} image is empty or not a file: ${src}`); return; }
  if (validatedPaths.has(fullPath)) return;
  validatedPaths.add(fullPath);
  try {
    const dimensions = imageDimensions(fs.readFileSync(fullPath), src);
    if (dimensions.width < 250 || dimensions.height < 140) {
      fail(`${src} is ${dimensions.width}x${dimensions.height}; minimum is 250x140`);
    }
  } catch (error) {
    fail(`${src} could not be inspected: ${error.message}`);
  }
}

chapters.forEach(chapter => (chapter.sections || []).forEach(section => {
  if (section.image) validateImage(section.image, `section ${section.id || "?"} image`);
  if (section.images != null && !Array.isArray(section.images)) fail(`section ${section.id || "?"}.images must be an array`);
  (Array.isArray(section.images) ? section.images : []).forEach((image, index) => {
    validateImage(image, `section ${section.id || "?"} image ${index + 1}`);
  });
}));

cases.forEach((item, index) => {
  const label = `case ${item.id || index + 1}`;
  checkChapterReference(item, label);
  checkOptionalReferences(item, label);
  if (!clean(item.title)) fail(`${label} is missing a title`);
  validateImage(item.image, `${label} image`);
  if (!item.stage1 || typeof item.stage1 !== "object") fail(`${label} is missing stage1`);
  else {
    if (!clean(item.stage1.label)) fail(`${label}.stage1 is missing a label`);
    if (!clean(item.stage1.prompt)) fail(`${label}.stage1 is missing a prompt`);
    if (!Array.isArray(item.stage1.tasks) || !item.stage1.tasks.some(hasText)) fail(`${label}.stage1 needs tasks`);
  }
  if (!item.stage2 || typeof item.stage2 !== "object") fail(`${label} is missing stage2`);
  else {
    if (!clean(item.stage2.label)) fail(`${label}.stage2 is missing a label`);
    if (!Array.isArray(item.stage2.findings) || !item.stage2.findings.some(hasText)) fail(`${label}.stage2 needs findings`);
    if (!clean(item.stage2.reasoning)) fail(`${label}.stage2 is missing reasoning`);
  }
  if (!item.stage3 || typeof item.stage3 !== "object") fail(`${label} is missing stage3`);
  else {
    if (!clean(item.stage3.label)) fail(`${label}.stage3 is missing a label`);
    if (!clean(item.stage3.diagnosis)) fail(`${label}.stage3 is missing a diagnosis`);
    if (!clean(item.stage3.synthesis)) fail(`${label}.stage3 is missing synthesis`);
    if (!clean(item.stage3.surgicalConsequence)) fail(`${label}.stage3 is missing surgicalConsequence`);
  }
});

const metadataImages = Array.from(imageMetadata.values());
const vesselMetadataCount = metadataImages.filter(image => clean(image.vessel || image.artery || image.territory)).length;
const projectionMetadataCount = metadataImages.filter(image => clean(image.projection || image.view)).length;
if (vesselMetadataCount < 20) fail(`Atlas metadata is too sparse: only ${vesselMetadataCount} unique images have vessel/territory metadata`);
if (projectionMetadataCount < 10) fail(`Atlas metadata is too sparse: only ${projectionMetadataCount} unique images have projection/view metadata`);

/* Every extracted asset should be used, unless its deliberate exclusion is documented here. */
/* The nine unused slide fragments (AHA lesion-type shapes, anomalous LCx layers,
   myocardial-bridge strips/duplicates) were removed from assets/ for launch on
   2026-10-21; they remain in git history. Add new deliberate exclusions here. */
const intentionalExclusions = new Map([]);
if (!fs.existsSync(assetDir)) fail("Missing assets/angiography directory");
else {
  const extracted = fs.readdirSync(assetDir)
    .filter(filename => /\.(?:png|jpe?g)$/i.test(filename))
    .map(filename => `assets/angiography/${filename}`)
    .sort();
  extracted.forEach(asset => {
    if (referencedAssets.has(asset)) return;
    if (intentionalExclusions.has(asset)) warn(`Intentionally excluded ${asset}: ${intentionalExclusions.get(asset)}`);
    else fail(`Extracted asset is not referenced by a section or case: ${asset}`);
  });
  intentionalExclusions.forEach((reason, asset) => {
    if (!extracted.includes(asset)) warn(`Documented exclusion is not present: ${asset} (${reason})`);
    if (referencedAssets.has(asset)) fail(`Intentionally excluded asset is referenced: ${asset}`);
  });
}

const answers = [];
questions.forEach((question, index) => {
  const label = `question ${question.id || index + 1}`;
  checkChapterReference(question, label);
  checkOptionalReferences(question, label);
  if (!clean(question.stem)) fail(`${label} is missing a stem`);
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    fail(`${label} must have exactly four options`);
  } else {
    const normalized = question.options.map(option => clean(option).toLowerCase());
    normalized.forEach((option, optionIndex) => { if (!option) fail(`${label} option ${optionIndex + 1} is empty`); });
    if (new Set(normalized).size !== normalized.length) fail(`${label} has duplicate options`);
  }
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    fail(`${label} answer must be a zero-based integer from 0 to 3`);
  } else answers.push(question.answer);
  if (clean(question.explanation).length < 20) fail(`${label} has a missing or thin explanation`);
  if (!clean(question.teachingPoint)) fail(`${label} is missing a teachingPoint`);
  if (question.caseId && !cases.some(item => clean(item.id) === clean(question.caseId))) fail(`${label} references unknown caseId ${clean(question.caseId)}`);
});

const visualQuestions = questions.filter(question => question.image || question.imageId || question.caseId);
if (visualQuestions.length < 10) fail(`Rapid-recognition pool needs at least 10 image-linked questions; found ${visualQuestions.length}`);

const slots = [0, 0, 0, 0];
answers.forEach(answer => slots[answer]++);
if (answers.length && Math.max(...slots) - Math.min(...slots) > 1) {
  fail(`Answer positions are imbalanced [${slots.join(", ")}]; each slot must differ by no more than one`);
}
let longestRun = 0;
let currentRun = 0;
let previousAnswer = null;
answers.forEach(answer => {
  currentRun = answer === previousAnswer ? currentRun + 1 : 1;
  longestRun = Math.max(longestRun, currentRun);
  previousAnswer = answer;
});
if (longestRun > 3) fail(`Maximum same-answer run is ${longestRun}; limit is 3`);
let uniquelyLongestCorrect = 0;
questions.forEach(question => {
  if (!Array.isArray(question.options) || question.options.length !== 4 || !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) return;
  const lengths = question.options.map(option => clean(option).length);
  const max = Math.max(...lengths);
  if (lengths[question.answer] === max && lengths.filter(length => length === max).length === 1) uniquelyLongestCorrect++;
});
const longestBias = questions.length ? uniquelyLongestCorrect / questions.length : 0;
if (longestBias > 0.35) fail(`Uniquely-longest correct-answer rate is ${(longestBias * 100).toFixed(1)}%; limit is 35%`);

/* Content coverage: these concepts are jointly required by the slide deck and source text. */
const corpus = clean(JSON.stringify(A)).toLowerCase();
const coverage = [
  ["Sones and the first selective coronary angiogram", /mason\s+sones|first selective coronary angiogram/],
  ["right coronary artery anatomy", /right coronary artery|\brca\b/],
  ["left main anatomy", /left main|left coronary (?:artery|system)|\blmca\b/],
  ["LAD anatomy", /left anterior descending|\blad\b/],
  ["circumflex anatomy", /circumflex|\blcx\b/],
  ["diagonal and septal branches", /diagonal[^.]{0,160}septal|septal[^.]{0,160}diagonal/],
  ["obtuse marginal or ramus anatomy", /obtuse marginal|ramus intermedius|\bramus\b/],
  ["PDA/posterolateral anatomy", /posterior descending|posterolateral|\bpda\b|\bplv\b/],
  ["coronary dominance", /coronary dominance|right[- ]dominant|left[- ]dominant|codomin/],
  ["radial/femoral access", /radial[^.]{0,160}femoral|femoral[^.]{0,160}radial/],
  ["manifold or automatic contrast injection", /manifold|automatic injection|power inject/],
  ["safe ostial engagement", /engag(?:e|ement|ing)[^.]{0,180}(?:osti|coronary|catheter)|(?:osti|coronary|catheter)[^.]{0,180}engag/],
  ["pressure damping/ventricularization", /pressure damp|damped pressure|ventriculari[sz]ation/],
  ["RAO/LAO geometry", /\brao\b[^.]{0,200}\blao\b|right anterior oblique[^.]{0,200}left anterior oblique/],
  ["cranial/caudal angulation", /cranial[^.]{0,200}caudal|caudal[^.]{0,200}cranial/],
  ["spider view", /spider view|lao.{0,40}caudal/],
  ["overlap and foreshortening", /overlap[^.]{0,180}foreshorten|foreshorten[^.]{0,180}overlap/],
  ["stenosis estimation in multiple views", /stenosis[^.]{0,220}(?:multiple|several|orthogonal) views|(?:multiple|several|orthogonal) views[^.]{0,220}stenosis/],
  ["AHA lesion morphology", /aha lesion|type a[^.]{0,240}type b[^.]{0,240}type c/],
  ["FFR and iFR", /\bffr\b[^.]{0,220}\bifr\b|fractional flow reserve[^.]{0,220}instantaneous wave/],
  ["IVUS", /\bivus\b|intravascular ultrasound/],
  ["TIMI flow", /timi (?:flow|grade)|thrombolysis in myocardial infarction/],
  ["myocardial blush/perfusion grade", /myocardial (?:blush|perfusion) grade|blush grade/],
  ["TMPG distinguished from MBG", /\btmpg\b[^.]{0,350}\bmbg\b|\bmbg\b[^.]{0,350}\btmpg\b/],
  ["calcification", /calcifi/],
  ["thrombus versus air embolism", /thrombus[^.]{0,220}air embol|air embol[^.]{0,220}thrombus/],
  ["collateral pathways", /collateral/],
  ["myocardial bridging", /myocardial bridg|intramyocardial segment/],
  ["coronary fistula and shunt assessment", /fistula[^.]{0,260}(?:qp.?qs|shunt|haemodynamic|hemodynamic)|(?:qp.?qs|shunt)[^.]{0,260}fistula/],
  ["anomalous coronary origins", /anomalous (?:coronary|origin)|coronary anomal/],
  ["coronary aneurysm", /coronary (?:artery )?aneurysm/],
  ["ventriculography/wall motion", /ventriculograph|regional wall motion/],
  ["angiographic valve regurgitation", /sellers|angiograph[^.]{0,180}(?:mitral|aortic) regurg/],
  ["CABG and graft-target planning", /cabg|bypass graft|graft target/],
  ["distal target/runoff", /distal target|target vessel|runoff|run-off/],
  ["competitive flow", /competitive flow/],
  ["completeness/SYNTAX/Heart Team", /complete revasculari[sz]ation|syntax score|heart team/],
  ["conduit/LIMA implications", /\blima\b|internal mammary|conduit selection/]
];
coverage.forEach(([topic, pattern]) => { if (!pattern.test(corpus)) fail(`Required topic not covered: ${topic}`); });

["source-basic-angio", "source-key-questions", "source-esc-ccs-2024", "source-acc-revascularization-2021"].forEach(id => {
  if (!sourceIds.has(id)) fail(`Required source record missing: ${id}`);
});

console.log("Angiography module");
console.log(`  chapters=${chapters.length} sections=${sections.length} cases=${cases.length} questions=${questions.length}`);
console.log(`  images=${validatedPaths.size} referenced-assets=${referencedAssets.size}`);
console.log(`  atlas-metadata=vessel:${vesselMetadataCount} projection:${projectionMetadataCount} visual-drills:${visualQuestions.length}`);
console.log(`  A/B/C/D=${slots.join("/")} max-run=${longestRun} longest-correct=${(longestBias * 100).toFixed(1)}%`);
console.log(`  required-topics=${coverage.length}`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach(message => console.log("  ! " + message));
}
if (errors.length) {
  console.log(`\nAngiography validation: FAIL (${errors.length} errors)`);
  errors.forEach(message => console.log("  x " + message));
  process.exit(1);
}
console.log("\nAngiography validation: PASS");
