/* Deterministic model tests for the integrated Cardiac OR monitor lab. */
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = { console };
context.window = context;
vm.createContext(context);
["js/physiology/lab-core.js", "js/physiology/ecg-engine.js", "js/physiology/labs-or-monitor.js"].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const model = context.CSORMonitorModel;
assert.ok(model, "OR monitor model is exported for deterministic validation");
const cases = model.cases;
assert.deepStrictEqual(Object.keys(cases), ["cabg", "avr", "mvr", "bentall"]);

function elapsed(minute, start, end) {
  if (minute < start) return 0;
  return Math.max(0, Math.min(minute, end) - start);
}

Object.values(cases).forEach(caseItem => {
  assert.ok(caseItem.steps.length >= 17, `${caseItem.id} has a full operative timeline`);
  assert.ok(caseItem.cpbStart < caseItem.clampStart, `${caseItem.id} starts CPB before cross-clamping`);
  assert.ok(caseItem.clampStart < caseItem.clampEnd, `${caseItem.id} clamp interval is ordered`);
  assert.ok(caseItem.clampEnd <= caseItem.cpbEnd, `${caseItem.id} unclamps before completing CPB`);

  const ids = new Set();
  let priorMinute = -1;
  let priorCpb = -1;
  let priorClamp = -1;
  caseItem.steps.forEach(step => {
    assert.ok(!ids.has(step.id), `${caseItem.id} step IDs are unique: ${step.id}`);
    ids.add(step.id);
    assert.ok(step.minute > priorMinute, `${caseItem.id} milestones are strictly ordered at ${step.id}`);
    const cpb = elapsed(step.minute, caseItem.cpbStart, caseItem.cpbEnd);
    const clamp = elapsed(step.minute, caseItem.clampStart, caseItem.clampEnd);
    assert.ok(cpb >= priorCpb, `${caseItem.id} CPB time is monotonic`);
    assert.ok(clamp >= priorClamp, `${caseItem.id} clamp time is monotonic`);
    priorMinute = step.minute;
    priorCpb = cpb;
    priorClamp = clamp;

    const branchIds = new Set();
    step.branches.forEach(branch => {
      assert.ok(!branchIds.has(branch.id), `${caseItem.id}/${step.id} branch IDs are unique`);
      branchIds.add(branch.id);
      assert.ok(branch.action && branch.physiology && branch.warning, `${branch.id} has complete teaching content`);
    });
  });
});

model.allStates().forEach(item => {
  model.requiredKeys.forEach(key => assert.ok(Object.prototype.hasOwnProperty.call(item.state, key), `${item.caseId}/${item.stepId} includes ${key}`));
  Object.keys(item.state).filter(key => key !== "rhythm").forEach(key => assert.ok(Number.isFinite(item.state[key]), `${item.caseId}/${item.stepId}.${key} is finite`));
  assert.ok(item.state.map >= 0 && item.state.sbp >= item.state.dbp, `${item.caseId}/${item.stepId} has ordered pressures`);
  if (item.state.rhythm === "arrest") assert.strictEqual(item.state.hr, 0, `${item.stepId} electrical arrest has zero HR`);
  if (!item.state.pulseValid) assert.strictEqual(item.state.pulseRate, 0, `${item.stepId} invalid pulsatility has no pulse rate`);
  if (item.state.rhythm === "af") assert.ok(item.state.pulseRate < item.state.hr, `${item.stepId} AF explicitly models pulse deficit`);
  if (item.state.rhythm === "complete-block") assert.ok(item.state.hr <= 40, `${item.stepId} complete block uses a slow escape`);
});

Object.values(cases).forEach(caseItem => {
  const cpb = caseItem.steps.find(step => step.id === "cpb");
  const arrest = caseItem.steps.find(step => step.id === "cross-clamp" || step.id === "arrest");
  const separation = caseItem.steps.find(step => step.id === "separate");
  assert.ok(cpb && arrest && separation, `${caseItem.id} includes bypass, arrest and separation states`);
  assert.strictEqual(cpb.state.artValid, 1, `${caseItem.id} retains pump arterial pressure on CPB`);
  assert.strictEqual(cpb.state.pulseValid, 0, `${caseItem.id} invalidates pleth on full non-pulsatile CPB`);
  assert.strictEqual(cpb.state.spo2Valid, 0, `${caseItem.id} invalidates pulse-derived SpO2 on CPB`);
  assert.strictEqual(cpb.state.ventilation, 0, `${caseItem.id} stops ventilation on full CPB`);
  assert.notStrictEqual(cpb.state.rhythm, "arrest", `${caseItem.id} ECG persists before cardioplegic arrest`);
  assert.strictEqual(arrest.state.rhythm, "arrest", `${caseItem.id} becomes electrically silent after cardioplegia`);
  assert.strictEqual(separation.state.ventilation, 1, `${caseItem.id} resumes ventilation before separation`);
  assert.strictEqual(separation.state.pulseValid, 1, `${caseItem.id} restores pulsatility during separation`);
  assert.strictEqual(separation.state.spo2Valid, 1, `${caseItem.id} restores pleth-derived SpO2 during separation`);
  assert.ok(separation.state.etco2 > 20, `${caseItem.id} restores capnography with pulmonary blood flow`);
  assert.ok(separation.state.temp >= 35.5, `${caseItem.id} is rewarmed before separation`);
});

const branches = model.allStates().filter(item => item.branch);
const branchIds = new Set(branches.map(item => item.stepId.split(":")[1]));
[
  "complete-block", "af-pulse-deficit", "reperfusion-vf", "rca-graft-ischaemia",
  "circumflex-injury", "button-ischaemia", "protamine-reaction",
  "failure-to-separate", "tamponade", "cannulation-dissection"
].forEach(id => assert.ok(branchIds.has(id), `required complication branch exists: ${id}`));

const avrBlock = branches.find(item => item.stepId.endsWith(":complete-block")).state;
assert.strictEqual(avrBlock.rhythm, "complete-block");
const vf = branches.find(item => item.stepId.endsWith(":reperfusion-vf")).state;
assert.strictEqual(vf.rhythm, "vf");
assert.strictEqual(vf.artValid, 1, "VF on bypass retains pump arterial pressure");
const protamine = branches.find(item => item.stepId.endsWith(":protamine-reaction")).state;
assert.ok(protamine.map < 55 && protamine.cvp > 15, "protamine reaction models hypotension with acute RV-loading cue");
const tamponade = branches.find(item => item.stepId.endsWith(":tamponade")).state;
assert.ok(tamponade.cvp > 15 && tamponade.map < 75, "tamponade models rising CVP and falling output");

const lab = context.CSLab.get("or-monitor");
assert.ok(lab && lab.alwaysAvailable === true, "lab is explicitly always available");
assert.strictEqual(lab.flashcards, false, "lab explicitly opts out of generated flashcards");
assert.ok(Array.isArray(lab.linkedDays) && lab.linkedDays.length === 0, "lab remains unassigned to curriculum days");

console.log(`OR monitor tests passed: 4 cases, ${Object.values(cases).reduce((n, item) => n + item.steps.length, 0)} normal milestones, ${branches.length} complication branches.`);
