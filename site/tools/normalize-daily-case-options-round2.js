/* Second focused pass over daily-case options: equalize phrasing while keeping
   every clinical key and rationale unchanged. */
"use strict";
const fs = require("fs"), path = require("path");
const file = path.join(__dirname, "../js/daily/day-ecosystem.js");
let source = fs.readFileSync(file, "utf8"), changed = 0;
const replacements = [
  ['["Anterior displacement of the coaptation point into a small hyperdynamic LVOT", "Acute aortic dissection", "Isolated right-ventricular infarction"]', '["Anteriorly displaced mitral coaptation causing SAM", "Acute dissection compromising a coronary ostium", "Isolated RV infarction without an LVOT mechanism"]'],
  ['["Increase inotropy and reduce afterload", "Restore preload, reduce inotropy and increase afterload", "Start aggressive diuresis"]', '["Increase inotropy while deliberately reducing afterload", "Increase preload and afterload; reduce inotropy", "Reduce preload with aggressive diuresis and venodilation"]'],
  ['["Accept severe obstruction", "Treat only with pacing", "Return to bypass and revise the repair geometry"]', '["Accept severe obstruction and close without correction", "Treat persistent mechanical SAM with pacing alone", "Return to bypass and revise repair geometry"]'],
  ['["Delay until every malperfusion bed normalizes", "Emergency proximal aortic repair with a perfusion strategy that restores true-lumen flow", "Treat only with long-term oral antihypertensives"]', '["Delay repair until every malperfused bed normalizes", "Emergency proximal repair with true-lumen perfusion", "Use chronic antihypertensives without proximal repair"]'],
  ['["Assume repair corrected every branch vessel", "Wait until the next clinic visit", "Urgently reassess persistent mesenteric malperfusion and pursue branch-vessel rescue"]', '["Assume proximal repair corrected every branch vessel", "Defer reassessment until routine postoperative imaging", "Urgently treat persistent mesenteric malperfusion"]'],
  ['["Isolated LV volume overload", "Acute RV failure causing inadequate LVAD preload", "Systemic hypertension with a full LV"]', '["Isolated LV volume overload with preserved RV delivery", "Acute RV failure limiting LVAD preload", "Systemic hypertension with a persistently full LV"]'],
  ['["Optimize RV preload, reduce PVR, support RV contractility and reassess speed", "Increase LVAD speed maximally", "Clamp the outflow graft"]', '["Support the RV and reassess pump speed", "Increase LVAD speed despite the underfilled ventricle", "Clamp the outflow graft to treat inadequate preload"]'],
  ['["Only anemia", "Only systemic infection", "Suction from speed/preload imbalance or inflow malposition"]', '["Anemia without a device-heart interaction", "Systemic infection without a mechanical cause", "LV suction or inflow-cannula malposition"]']
];
for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error("Expected option set not found: " + before);
  source = source.replace(before, after); changed++;
}
fs.writeFileSync(file, source);
console.log("Normalized", changed, "additional daily-case option sets.");
