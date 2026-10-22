/* Deterministic physiology checks for the calibrated ECG engine. Run: node tools/test-ecg-physiology.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const context = { console };
context.window = context;
vm.createContext(context);
["js/physiology/lab-core.js", "js/physiology/ecg-engine.js", "js/physiology/labs-rhythm.js"].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const ECG = context.CSECG;
const cases = context.CSLab.get("ecg").presets;
const failures = [];
let assertions = 0;

function check(condition, message) {
  assertions += 1;
  if (!condition) failures.push(message);
}
function close(actual, expected, tolerance, message) {
  check(Math.abs(actual - expected) <= tolerance, message + " (got " + actual + ", expected " + expected + " ± " + tolerance + ")");
}
function byId(id) {
  const found = cases.find(item => item.id === id);
  if (!found) throw new Error("Missing ECG case " + id);
  return found;
}
function inWindow(items, start, end) { return items.filter(item => item.time >= start && item.time < end); }

const sinus = byId("sinus-baseline");
const af = byId("poaf");
const block = byId("complete-block");
const lbbb = byId("tavi-lbbb");
const inferior = byId("inferior-injury");
const anterior = byId("anterior-injury");
const vt = byId("monomorphic-vt");
const paced = byId("ventricular-paced");
const noncapture = byId("failure-capture");
const hyperk = byId("hyperkalemia");

/* Declared intervals are real waveform fiducials, not display-only labels. */
cases.forEach(item => {
  const intervals = ECG.intervals(item);
  close(intervals.qrs * 1000, item.qrs, 0.001, item.id + " QRS duration");
  if (item.pr != null) close(intervals.pr * 1000, item.pr, 0.001, item.id + " PR interval");
  check(intervals.qt > intervals.qrs + 0.1, item.id + " QT must extend beyond depolarization");
  check(intervals.tOnset >= intervals.qrsOffset, item.id + " T onset must not precede QRS offset");
  check(intervals.tPeak >= intervals.tOnset && intervals.tOffset >= intervals.tPeak, item.id + " repolarization fiducials must be ordered");
});
close(ECG.intervals(sinus).pDuration * 1000, 100, 0.001, "Sinus P duration");

/* Rate and rhythm event clocks. */
const afEvents = ECG.events(af, 0, 60);
const afQRS = inWindow(afEvents.qrs, 0, 60);
close(afQRS.length, 136, 2, "AF mean ventricular rate over 60 seconds");
const afRR = afQRS.slice(1).map((event, index) => event.time - afQRS[index].time);
check(Math.max(...afRR) - Math.min(...afRR) > 0.25, "AF RR intervals must be irregular");
check(inWindow(afEvents.p, 0, 60).length === 0, "AF must not generate organized P waves");

const blockEvents = ECG.events(block, 0, 60);
close(inWindow(blockEvents.qrs, 0, 60).length, 32, 1, "Complete block ventricular escape rate");
close(inWindow(blockEvents.p, 0, 60).length, 88, 1, "Complete block atrial rate");
const blockQRS = inWindow(blockEvents.qrs, 2, 20).slice(0, 6);
const blockP = inWindow(blockEvents.p, 1, 20);
const apparentPR = blockQRS.map(qrs => {
  const preceding = blockP.filter(p => p.time < qrs.time).pop();
  return preceding ? +(qrs.time - preceding.time).toFixed(3) : 0;
});
check(new Set(apparentPR).size >= 4, "Complete block must have changing apparent PR relationships");

const pacedEvents = ECG.events(paced, 0, 60);
close(inWindow(pacedEvents.spikes, 0, 60).length, 70, 1, "Ventricular pacing stimulus rate");
close(inWindow(pacedEvents.qrs, 0, 60).length, 70, 1, "Ventricular paced capture rate");
close(inWindow(pacedEvents.p, 0, 60).length, 82, 1, "Independent sinus P waves during VVI pacing");
inWindow(pacedEvents.spikes, 2, 10).forEach(spike => {
  const captured = pacedEvents.qrs.find(qrs => Math.abs(qrs.time - spike.time - 0.012) < 0.0001);
  check(!!captured, "Every successful pacing stimulus must precede a QRS by 12 ms");
});

const failureEvents = ECG.events(noncapture, 0, 60);
close(inWindow(failureEvents.spikes, 0, 60).length, 72, 1, "Noncapture stimulus rate");
close(inWindow(failureEvents.qrs, 0, 60).length, 36, 1, "Noncapture effective ventricular rate");
const failedSpikes = inWindow(failureEvents.spikes, 2, 12).filter(spike => !spike.captured);
failedSpikes.forEach(spike => {
  check(!failureEvents.qrs.some(qrs => qrs.time > spike.time && qrs.time < spike.time + 0.2), "Failed pacing stimulus must have no following QRS within 200 ms");
});

const vtEvents = inWindow(ECG.events(vt, 0, 60).qrs, 0, 60);
close(vtEvents.length, 178, 1, "VT rate");
check(ECG.events(vt, 0, 10).p.length === 0, "VT must not generate sinus P waves");
check(Math.abs(ECG.qrsValue(vt, "V1", 0.4)) > 0.5 && ECG.qrsValue(vt, "V1", 1.05) === 0, "VT must contain discrete broad complexes rather than a continuous sine wave");

/* Every limb waveform is derived from two independent signals. */
cases.forEach(item => {
  const cache = ECG.events(item, -1, 4);
  for (let time = 0; time <= 3; time += 0.017) {
    const I = ECG.sample(item, "I", time, cache), II = ECG.sample(item, "II", time, cache), III = ECG.sample(item, "III", time, cache);
    const aVR = ECG.sample(item, "aVR", time, cache), aVL = ECG.sample(item, "aVL", time, cache), aVF = ECG.sample(item, "aVF", time, cache);
    close(II, I + III, 1e-9, item.id + " Einthoven identity");
    close(aVR, -(I + II) / 2, 1e-9, item.id + " aVR identity");
    close(aVL, I - II / 2, 1e-9, item.id + " aVL identity");
    close(aVF, II - I / 2, 1e-9, item.id + " aVF identity");
  }
});

/* Normal polarity and horizontal-plane R-wave progression. */
const sinusEvents = ECG.events(sinus, 0, 2);
const firstP = sinusEvents.p.find(event => event.time > 0);
const pTime = firstP.time + firstP.duration * 0.5;
const pCache = ECG.events(sinus, pTime - 1, pTime + 1);
check(ECG.sampleComponents(sinus, "II", pTime, pCache).p > 0, "Sinus P must be positive in II");
check(ECG.sampleComponents(sinus, "aVR", pTime, pCache).p < 0, "Sinus P must be negative in aVR");
check(ECG.dominantQRS(sinus, "V1") < 0 && ECG.dominantQRS(sinus, "V2") < 0, "V1-V2 must be predominantly negative in the normal template");
check(ECG.dominantQRS(sinus, "V3") > 0 && ECG.dominantQRS(sinus, "V4") > 0, "Precordial transition must occur around V3-V4");
check(ECG.dominantQRS(sinus, "V5") > ECG.dominantQRS(sinus, "V4") && ECG.dominantQRS(sinus, "V6") > 0, "R-wave progression must peak around V5 then remain positive in V6");

/* LBBB / paced broad morphology and secondary repolarization are discordant. */
check(ECG.dominantQRS(lbbb, "V1") < -0.7, "LBBB V1 must be predominantly negative");
check(ECG.dominantQRS(lbbb, "V6") > 0.7, "LBBB V6 must have a broad positive R");
check(ECG.qrsValue(lbbb, "V6", 0.58) < ECG.qrsValue(lbbb, "V6", 0.38) && ECG.qrsValue(lbbb, "V6", 0.58) < ECG.qrsValue(lbbb, "V6", 0.78), "LBBB lateral R must be notched");
const lbbbEvent = ECG.events(lbbb, 0, 2).qrs.find(event => event.time > 0);
const lbbbIntervals = ECG.intervals(lbbb);
const lbbbCache = ECG.events(lbbb, lbbbEvent.time - 1, lbbbEvent.time + 1);
const lbbbTTime = lbbbEvent.time + lbbbIntervals.tPeak;
check(ECG.sampleComponents(lbbb, "V1", lbbbTTime, lbbbCache).t > 0, "LBBB V1 T wave must be discordant and positive");
check(ECG.sampleComponents(lbbb, "V6", lbbbTTime, lbbbCache).t < 0, "LBBB V6 T wave must be discordant and negative");
check(ECG.stAmplitude(lbbb, "V1") > 0 && ECG.stAmplitude(lbbb, "V6") < 0, "LBBB secondary ST shift must be discordant");

/* Injury vectors and metabolic changes are rendered in millivolts. */
check(ECG.stAmplitude(inferior, "III") > ECG.stAmplitude(inferior, "II"), "Inferior injury must have III greater than II");
check(ECG.stAmplitude(inferior, "II") > 0.18 && ECG.stAmplitude(inferior, "III") > 0.30, "Inferior contiguous ST elevation must meet the modeled threshold");
check(ECG.stAmplitude(inferior, "I") < -0.09 && ECG.stAmplitude(inferior, "aVL") < -0.12, "Inferior injury must have reciprocal high-lateral depression");
close(ECG.stAmplitude(anterior, "V1"), 0.15, 0.001, "Anterior V1 ST elevation");
close(ECG.stAmplitude(anterior, "V2"), 0.34, 0.001, "Anterior V2 ST elevation");
close(ECG.stAmplitude(anterior, "V3"), 0.38, 0.001, "Anterior V3 ST elevation");
close(ECG.stAmplitude(anterior, "V4"), 0.27, 0.001, "Anterior V4 ST elevation");
check(ECG.stAmplitude(anterior, "II") < 0 && ECG.stAmplitude(anterior, "aVF") < 0, "Anterior injury must have inferior reciprocal depression");
check(ECG.dominantQRS(hyperk, "V1") < 0 && ECG.dominantQRS(hyperk, "V5") > 0, "Hyperkalemic widening must preserve diffuse QRS progression rather than mimic LBBB");
function ventricularVoltage(item, lead, eventTime, offset, cache) {
  const parts = ECG.sampleComponents(item, lead, eventTime + offset, cache);
  return parts.qrs + parts.st + parts.t;
}
[[inferior, "III"], [anterior, "V3"], [lbbb, "V6"]].forEach(([item, lead]) => {
  const event = ECG.events(item, 0, 2).qrs.find(entry => entry.time > 0);
  const model = ECG.intervals(item), cache = ECG.events(item, event.time - 1, event.time + 1);
  const epsilon = 0.00001;
  close(ventricularVoltage(item, lead, event.time, model.qrsOffset - epsilon, cache), ventricularVoltage(item, lead, event.time, model.qrsOffset + epsilon, cache), 0.006, item.id + " QRS-to-ST continuity in " + lead);
  close(ventricularVoltage(item, lead, event.time, model.tOnset - epsilon, cache), ventricularVoltage(item, lead, event.time, model.tOnset + epsilon, cache), 0.006, item.id + " ST-to-T continuity in " + lead);
});
const anteriorEvent = ECG.events(anterior, 0, 2).qrs.find(entry => entry.time > 0);
const anteriorCache = ECG.events(anterior, anteriorEvent.time - 1, anteriorEvent.time + 1);
const anteriorJ = ECG.sampleComponents(anterior, "V3", anteriorEvent.time + ECG.intervals(anterior).qrsOffset + 0.001, anteriorCache);
close(anteriorJ.st, 0.38, 0.01, "Sampled anterior V3 J-point elevation");
const normalAt52 = Object.assign({}, sinus, { rate: 52 });
const hyperIntervals = ECG.intervals(hyperk), normal52Intervals = ECG.intervals(normalAt52);
check(hyperIntervals.tOnset - hyperIntervals.qrsOffset < normal52Intervals.tOnset - normal52Intervals.qrsOffset, "Hyperkalemia must abbreviate the post-QRS ST interval");
check(hyperk.qtc == null, "Hyperkalemia case must not claim a precise QTc");
const afCacheLong = ECG.events(af, 0, 22);
let afRepeatDifference = 0;
for (let time = 1; time < 10; time += 0.37) {
  afRepeatDifference += Math.abs(ECG.sampleComponents(af, "V1", time, afCacheLong).baseline - ECG.sampleComponents(af, "V1", time + 10, afCacheLong).baseline);
}
check(afRepeatDifference > 0.1, "AF fibrillatory baseline must not repeat as a short fixed sinusoidal loop");

const stimulusI = ECG.stimulusAmplitude("I"), stimulusII = ECG.stimulusAmplitude("II"), stimulusIII = ECG.stimulusAmplitude("III");
close(stimulusII, stimulusI + stimulusIII, 1e-9, "Pacing artifact limb-lead identity");

/* Paper speed and gain share one physical transform. */
const standard = ECG.paperScale(25, 10, 5);
close(standard.smallBoxSeconds * 1000, 40, 1e-9, "25 mm/s small-box time");
close(standard.smallBoxMv, 0.1, 1e-9, "10 mm/mV small-box voltage");
close(standard.pixelsPerMv / standard.pixelsPerMm, 10, 1e-9, "One mV spans ten boxes at standard gain");
close(ECG.paperScale(50, 10, 5).smallBoxSeconds * 1000, 20, 1e-9, "50 mm/s small-box time");
close(ECG.paperScale(25, 5, 5).smallBoxMv, 0.2, 1e-9, "5 mm/mV small-box voltage");
close(ECG.paperScale(25, 20, 5).smallBoxMv, 0.05, 1e-9, "20 mm/mV small-box voltage");

console.log("ECG cases:", cases.length);
console.log("Physiology assertions:", assertions);
console.log("Failures:", failures.length);
failures.forEach(failure => console.log("  ✗ " + failure));
process.exit(failures.length ? 1 : 0);
