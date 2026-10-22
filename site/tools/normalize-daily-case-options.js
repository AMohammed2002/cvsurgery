/* One-time semantic-preserving option tightening for the newly authored daily
   cases. Removes answer-length tells without changing keys or rationales. */
"use strict";
const fs = require("fs"), path = require("path");
const file = path.join(__dirname, "../js/daily/day-ecosystem.js");
let source = fs.readFileSync(file, "utf8"), changed = 0;
const replacements = [
  ['["A peripheral rescue cannulation plan based on the CT", "A plan to divide the sternum rapidly without peripheral access", "Routine central cannulation after the heart is exposed"]', '["Preplanned peripheral rescue access", "Rapid sternotomy without peripheral access", "Central cannulation only after cardiac exposure"]'],
  ['["Open the retractor fully to tear remaining attachments", "Complete the posterior table under controlled direct dissection", "Advance the saw deeply until the mediastinum opens"]', '["Force the retractor through remaining adhesions", "Controlled posterior-table dissection", "Advance the saw deeply into the mediastinum"]'],
  ['["Close the skin and transfer for PCI", "Give protamine before controlling bleeding", "Compress locally, institute the preplanned bypass strategy and restore LAD supply"]', '["Close and transfer for delayed coronary intervention", "Reverse heparin before controlling hemorrhage", "Control bleeding, establish bypass and restore LAD flow"]'],
  ['["Increase arterial pump flow despite an empty reservoir", "Reduce flow and inspect venous line, cannula position, volume and obstruction", "Give protamine immediately"]', '["Increase flow despite the falling reservoir", "Reduce flow and inspect the venous-drainage pathway", "Give protamine before checking the circuit"]'],
  ['["Cannula side holes were abutting the atrial or caval wall", "The oxygenator had failed", "The aortic cross-clamp was incomplete"]', '["Cannula side holes abutted the atrial or caval wall", "Oxygenator failure obstructed arterial outflow", "An incomplete cross-clamp reduced venous return"]'],
  ['["A higher MAP alone", "A colder venous temperature", "Stable reservoir level, nonchattering venous drainage and acceptable line pressures"]', '["A higher MAP without checking reservoir volume", "A colder venous temperature without circuit inspection", "Stable reservoir, drainage and circuit pressures"]'],
  ['["LIMA-to-LAD only", "A graft to the RCA or posterior descending territory", "A diagonal graft only"]', '["The LIMA-to-LAD graft alone", "The RCA or posterior-descending graft", "A diagonal graft without inferior supply"]'],
  ['["Accept the finding as reperfusion", "Increase afterload and close", "Inspect flow and the anastomosis for kink, twist, thrombosis or poor runoff"]', '["Accept routine reperfusion stunning", "Increase afterload and close without assessment", "Inspect graft flow and anastomotic geometry"]'],
  ['["Competitive native flow", "Obligatory coronary steal from the coronary sinus", "Acute prosthetic valve thrombosis"]', '["Competitive native coronary flow", "Coronary-sinus steal from normal venous drainage", "Acute thrombosis of an unrelated valve prosthesis"]'],
  ['["Coronary vasospasm", "Prosthesis-patient mismatch with residual gradient", "Isolated tricuspid regurgitation"]', '["Postoperative coronary vasospasm", "Residual prosthesis-patient mismatch", "New isolated tricuspid regurgitation"]'],
  ['["Annular/root enlargement or a prosthesis strategy with better hemodynamics", "Routine reduction of bypass flow", "Intentional paravalvular leak"]', '["Annular enlargement or a higher-flow prosthesis strategy", "Routine reduction of bypass flow during implantation", "Creation of an intentional paravalvular leak"]'],
  ['["Diagnose prosthesis-patient mismatch from gradient alone", "Ignore the gradient", "Integrate flow, prosthesis motion, Doppler contour and indexed effective orifice area"]', '["Diagnose mismatch from the gradient alone", "Ignore the gradient because flow is reduced", "Integrate flow, motion, contour and indexed orifice area"]'],
  ['["Severe AS is excluded because the gradient is below 40", "The study is uninterpretable and must be ignored", "This may be low-flow, low-gradient AS and needs flow-integrated assessment"]', '["Severe AS is excluded by a gradient below 40 mmHg", "The discordant examination should be discarded", "Possible low-flow, low-gradient aortic stenosis"]'],
  ['["Dobutamine stress echocardiography", "Routine chest radiography", "Holter monitoring alone"]', '["Dobutamine stress echocardiography", "Routine posteroanterior chest radiography", "Ambulatory rhythm monitoring without imaging"]'],
  ['["Serum troponin alone", "CT aortic-valve calcium assessment integrated with the full clinical picture", "A repeat blood pressure only"]', '["Serum troponin without structural imaging", "CT aortic-valve calcium assessment", "Repeat blood pressure without flow data"]'],
  ['["Proceed immediately because all delay is harmful", "Integrate urgency, coronary anatomy, antiplatelet timing, renal risk and frailty with the Heart Team", "Cancel surgery solely because the risk score is high"]', '["Proceed immediately because every delay is harmful", "Integrated Heart-Team benefit-risk assessment", "Cancel solely because the calculated score is high"]'],
  ['["As an automatic contraindication", "As proof that PCI is superior", "As a calibrated estimate supplemented by anatomy, frailty, goals and modifiable risk"]', '["As an automatic contraindication to surgery", "As proof that PCI is always superior", "As an estimate supplemented by anatomy, frailty and goals"]']
];
for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error("Expected option set not found: " + before);
  source = source.replace(before, after); changed++;
}
fs.writeFileSync(file, source);
console.log("Normalized", changed, "daily-case option sets.");
