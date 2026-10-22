/* Validate the modular physiology training center. Run: node tools/validate-physiology.js */
const fs = require("fs"), path = require("path"), vm = require("vm"), childProcess = require("child_process");
const root = path.join(__dirname, "..");
const files = [
  "js/physiology/models.js",
  "js/physiology/lab-core.js",
  "js/physiology/labs-foundations.js",
  "js/physiology/ecg-engine.js",
  "js/physiology/labs-rhythm.js",
  "js/physiology/labs-cpb.js",
  "js/physiology/labs-strategy.js",
  "js/physiology/labs-support.js",
  "js/physiology/labs-imaging.js",
  "js/physiology/labs-or-monitor.js"
];
const styles = [
  "css/physiology/foundation-labs.css",
  "css/physiology/rhythm-labs.css",
  "css/physiology/cpb-labs.css",
  "css/physiology/strategy-labs.css",
  "css/physiology/support-labs.css",
  "css/physiology/imaging-labs.css",
  "css/physiology/or-monitor.css",
  "css/studio.css"
];
const errors = [], context = { console };
context.window = context;
vm.createContext(context);
files.forEach(file => {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { errors.push("Missing lab script: " + file); return; }
  try { vm.runInContext(fs.readFileSync(full, "utf8"), context, { filename: file }); }
  catch (error) { errors.push(file + " failed to load: " + error.message); }
});
styles.forEach(file => { if (!fs.existsSync(path.join(root, file))) errors.push("Missing lab stylesheet: " + file); });
const labs = context.CSLab ? context.CSLab.all() : [];
const required = ["pv-loop","oxygen-delivery","valve","shock","ecg","pacing","cpb-console","cpb-surgery","cannulation","cardioplegia","iabp","teg-rotem","cath-projections","or-monitor"];
const ids = new Set();
labs.forEach(lab => {
  if (!lab.id || ids.has(lab.id)) errors.push("Bad or duplicate lab id: " + lab.id);
  ids.add(lab.id);
  if (!lab.title || lab.title.length < 12) errors.push(lab.id + " has thin title");
  if (!lab.subtitle || lab.subtitle.length < 70) errors.push(lab.id + " has thin subtitle");
  if (!lab.category) errors.push(lab.id + " missing category");
  if (!lab.minutes || lab.minutes < 15) errors.push(lab.id + " minutes must reflect a substantial trainer");
  if (!Array.isArray(lab.objectives) || lab.objectives.length < 4) errors.push(lab.id + " needs at least 4 objectives");
  if (!Array.isArray(lab.sourceSections) || lab.sourceSections.length < 2) errors.push(lab.id + " needs guide source anchors");
  if (typeof lab.render !== "function") errors.push(lab.id + " missing render function");
});
required.forEach(id => { if (!ids.has(id)) errors.push("Required lab missing: " + id); });
const source = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file), "utf8")]));
const css = Object.fromEntries(styles.map(file => [file, fs.readFileSync(path.join(root, file), "utf8")]));
function requires(haystack, needles, label) {
  needles.forEach(needle => { if (!haystack.includes(needle)) errors.push(label + " missing interaction contract: " + needle); });
}
requires(source["js/physiology/lab-core.js"], ["const knob", "data-knob-input", "pointermove", "wheel", "ArrowUp", "aria-valuenow"], "shared rotary controls");
requires(source["js/physiology/ecg-engine.js"], ["intervalModel", "limbProjection", "STANDARD_LAYOUT", "paperScale", "captureFailure", "AF_RR_FACTORS"], "physiologic ECG engine");
requires(source["js/physiology/labs-rhythm.js"], ["drawLiveECG", "requestAnimationFrame", "cancelAnimationFrame", "rhythm-live-speed", "Freeze monitor", "Capture 12-lead", "drawPacingMonitor", "Calibration pulse: 1 mV"], "dynamic rhythm labs");
requires(source["js/physiology/labs-cpb.js"], ["data-rotary-for", "cpb-rotary", "setPointerCapture", "wheel", "ArrowUp", "cpb-native-range", "cpb-impeller", "cpb-reservoir"], "physical CPB console");
requires(css["css/physiology/cpb-labs.css"], [".cpb-native-range", "opacity:0!important", ".cpb-rotary", ".cpb-impeller", ".cpb-fluid"], "CPB machine styling");
requires(css["css/studio.css"], ["studio-guidance", "studio-specimen", "prefers-reduced-motion", "or-numeric-column"], "shared studio system");
requires(source["js/physiology/labs-support.js"], ["Continuously moving ECG", "iabp-pause", "iabp-speed", "CLOT EVOLUTION", "teg-pause", "teg-replay"], "dynamic support labs");
requires(source["js/physiology/labs-strategy.js"], ["strategy-rotary", "deliveryPaths", "myo-route", "cannula"], "strategy lab physical models");
requires(source["js/physiology/labs-imaging.js"], ["cath-gantry", "setPointerCapture", "Math.atan2", "wheel", "ArrowUp", "aria-valuetext", "role=\"slider\""], "draggable C-arm rigs");
requires(css["css/physiology/imaging-labs.css"], [".cath-film", ".cath-gantry", ".cath-labels", "touch-action:none"], "catheter imaging lab styling");
requires(source["js/physiology/labs-or-monitor.js"], ["CSORMonitorModel", "or_monitor_progress", "reperfusion-vf", "complete-block", "requestAnimationFrame", "ResizeObserver", "alwaysAvailable: true", "flashcards: false"], "integrated OR monitor");
requires(css["css/physiology/or-monitor.css"], ["aspect-ratio:1456/839", "grid-template-columns:minmax(760px,3fr)", ".or-step-rail", "prefers-reduced-motion"], "OR monitor layout");
const shellCss = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
const appSource = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
requires(shellCss, ["grid-template-columns:252px minmax(0,1fr)", "#main.physiology-page", "#main:has(.trainer-hero)", "max-width:none", "container-name:physiology"], "full-width physiology shell");
requires(appSource, ["main.classList.toggle(\"physiology-page\"", "parts[0] === \"physiology\""], "physiology route sizing");
requires(css["css/physiology/cpb-labs.css"], ["container-type:inline-size", "@container (max-width:1100px)", "@container (max-width:780px)"], "CPB container reflow");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const metadata=fs.readFileSync(path.join(root,"js/physiology/lab-metadata.js"),"utf8");
files.forEach(file => { if (!index.includes(file)&&!metadata.includes(file)) errors.push("No eager or lazy loading route for " + file); });
styles.forEach(file => { if (!index.includes(file)) errors.push("index.html does not load " + file); });
const ecgTest = childProcess.spawnSync(process.execPath, [path.join(__dirname, "test-ecg-physiology.js")], { encoding: "utf8" });
if (ecgTest.status !== 0) errors.push("ECG physiology tests failed:\n" + (ecgTest.stdout || "") + (ecgTest.stderr || ""));
else if (ecgTest.stdout) console.log(ecgTest.stdout.trim());
const ecgRendererTest = childProcess.spawnSync(process.execPath, [path.join(__dirname, "test-ecg-renderer.js")], { encoding: "utf8" });
if (ecgRendererTest.status !== 0) errors.push("ECG renderer tests failed:\n" + (ecgRendererTest.stdout || "") + (ecgRendererTest.stderr || ""));
else if (ecgRendererTest.stdout) console.log(ecgRendererTest.stdout.trim());
const cathTest = childProcess.spawnSync(process.execPath, [path.join(__dirname, "test-cath-projections.js")], { encoding: "utf8" });
if (cathTest.status !== 0) errors.push("Cath projection tests failed:\n" + (cathTest.stdout || "") + (cathTest.stderr || ""));
else if (cathTest.stdout) console.log(cathTest.stdout.trim());
const orMonitorTest = childProcess.spawnSync(process.execPath, [path.join(__dirname, "test-or-monitor.js")], { encoding: "utf8" });
if (orMonitorTest.status !== 0) errors.push("OR monitor model tests failed:\n" + (orMonitorTest.stdout || "") + (orMonitorTest.stderr || ""));
else if (orMonitorTest.stdout) console.log(orMonitorTest.stdout.trim());
console.log("Physiology labs:", labs.length);
console.log("Lab ids:", labs.map(x => x.id).join(", "));
console.log("Source anchors:", labs.reduce((n, x) => n + (x.sourceSections || []).length, 0));
console.log("Objectives:", labs.reduce((n, x) => n + (x.objectives || []).length, 0));
console.log("Interaction gates: rotary controls, live ECG/pacing, physical CPB, live IABP/TEG, routed cannulation/cardioplegia, full-case OR monitoring");
console.log("Layout gates: full-width physiology shell, shrinkable app grid, CPB container reflow, shared studio layouts");
console.log("Errors:", errors.length);
errors.forEach(error => console.log("  ✗ " + error));
process.exit(errors.length ? 1 : 0);
