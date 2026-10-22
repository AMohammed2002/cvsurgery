/* Canvas-contract checks for the ECG renderer. Run: node tools/test-ecg-renderer.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const context = { console };
context.window = context;
vm.createContext(context);
["js/physiology/lab-core.js", "js/physiology/ecg-engine.js", "js/physiology/labs-rhythm.js"].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const Renderer = context.CSECGRenderer;
const cases = context.CSLab.get("ecg").presets;
const failures = [];
let assertions = 0;
function check(condition, message) { assertions += 1; if (!condition) failures.push(message); }
function close(actual, expected, tolerance, message) { check(Math.abs(actual - expected) <= tolerance, message + " (got " + actual + ", expected " + expected + ")"); }
function byId(id) { return cases.find(item => item.id === id); }

function recordingCanvas(width, height, ratio) {
  const record = { rects: [], paths: [], labels: [], transforms: [], backingSets: 0, current: [] };
  const g = {
    setTransform(...args) { record.transforms.push(args); },
    fillRect() {}, clearRect() {}, save() {}, restore() {}, clip() {},
    beginPath() { record.current = []; },
    moveTo(x, y) { record.current.push({ cmd: "M", x, y }); },
    lineTo(x, y) { record.current.push({ cmd: "L", x, y }); },
    rect(x, y, w, h) { record.rects.push({ x, y, w, h }); },
    stroke() { record.paths.push(record.current.slice()); },
    fillText(text, x, y) { record.labels.push({ text: String(text), x, y }); }
  };
  let backingWidth = 0, backingHeight = 0;
  const canvas = {
    getBoundingClientRect() { return { width, height }; },
    getContext() { return g; },
    get width() { return backingWidth; },
    set width(value) { backingWidth = value; record.backingSets += 1; },
    get height() { return backingHeight; },
    set height(value) { backingHeight = value; record.backingSets += 1; }
  };
  context.devicePixelRatio = ratio || 1;
  return { canvas, record, width, height };
}

const paper = recordingCanvas(800, 480, 1.25);
Renderer.drawTwelveLead(paper.canvas, byId("sinus-baseline"), 25, 1, 0);
check(paper.record.rects.length === 13, "Renderer must clip 12 standard leads plus one rhythm strip");
const cellH = paper.height / 4;
paper.record.rects.slice(0, 12).forEach((rect, index) => {
  close(rect.y, Math.floor(index / 4) * cellH, 1e-9, "Lead clip row " + index);
  close(rect.h, cellH, 1e-9, "Lead clip height " + index);
});
close(paper.record.rects[12].y, 3 * cellH, 1e-9, "Rhythm-strip clip row");
close(paper.record.rects[12].h, cellH, 1e-9, "Rhythm-strip clip height");
const expectedLabels = ["I", "aVR", "V1", "V4", "II", "aVL", "V2", "V5", "III", "aVF", "V3", "V6"];
check(JSON.stringify(paper.record.labels.slice(0, 12).map(item => item.text)) === JSON.stringify(expectedLabels), "Renderer must preserve conventional 3 by 4 lead order");
check(paper.record.labels[12].text === "II", "Renderer must add a continuous lead II rhythm strip");

const calibration = paper.record.paths[paper.record.paths.length - 1];
check(calibration.length === 6, "Calibration pulse must be a six-point square pulse");
const pxPerMm = paper.width / 264;
close(Math.abs(calibration[2].y - calibration[1].y) / pxPerMm, 10, 0.01, "Standard calibration height in millimetres");
close(Math.abs(calibration[3].x - calibration[2].x) / pxPerMm, 5, 0.01, "25 mm/s calibration pulse width in millimetres");

const backingAfterFirstDraw = paper.record.backingSets;
Renderer.drawTwelveLead(paper.canvas, byId("sinus-baseline"), 25, 1, 0);
check(paper.record.backingSets === backingAfterFirstDraw, "Fractional DPR must not reset the backing store on every draw");
close(paper.canvas.width, Math.round(800 * 1.25), 0, "Rounded fractional-DPR backing width");
close(paper.canvas.height, Math.round(480 * 1.25), 0, "Rounded fractional-DPR backing height");

const fastHighGain = recordingCanvas(800, 480, 1);
Renderer.drawTwelveLead(fastHighGain.canvas, byId("sinus-baseline"), 50, 2, 0);
const highGainCal = fastHighGain.record.paths[fastHighGain.record.paths.length - 1];
close(Math.abs(highGainCal[2].y - highGainCal[1].y) / pxPerMm, 20, 0.01, "20 mm/mV calibration height");
close(Math.abs(highGainCal[3].x - highGainCal[2].x) / pxPerMm, 10, 0.01, "50 mm/s calibration pulse width");

const pacedPaper = recordingCanvas(800, 480, 1);
Renderer.drawTwelveLead(pacedPaper.canvas, byId("ventricular-paced"), 25, 1, 0);
const markerCandidates = pacedPaper.record.paths.filter(points => points.length === 2 && Math.abs(points[0].x - points[1].x) < 1e-9 && Math.abs(points[1].y - points[0].y) > 2 && Math.abs(points[1].y - points[0].y) < 200);
check(markerCandidates.some(points => points[1].y < points[0].y), "Pacing markers must include upright lead-aware artifacts");
check(markerCandidates.some(points => points[1].y > points[0].y), "Pacing markers must include inverted lead-aware artifacts");

console.log("Renderer assertions:", assertions);
console.log("Failures:", failures.length);
failures.forEach(failure => console.log("  ✗ " + failure));
process.exit(failures.length ? 1 : 0);
