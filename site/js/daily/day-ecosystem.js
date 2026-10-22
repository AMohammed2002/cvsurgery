/* CardiacSchool daily learning circuits.
   Every day deliberately closes the loop: anatomy -> operation -> evidence ->
   Crisis Room -> viva -> focused retrieval cards. */
"use strict";

(function () {
  function circuit(day, anatomy, surgery, evidence, focus, _legacyCaseTitle, _legacyBrief, _legacyDecisions) {
    return {
      day: day,
      anatomy: { id: anatomy[0], title: anatomy[1], focus: focus.anatomy },
      surgery: { id: surgery[0], title: surgery[1], focus: focus.surgery },
      evidence: { id: evidence[0], title: evidence[1], focus: focus.evidence },
      viva: { id: "viva-d" + day, title: "Day " + day + " viva", focus: focus.viva }
    };
  }

  window.DAY_ECOSYSTEMS = [
    circuit(1,
      ["cham-pericardial-access", "Sternotomy, Pericardial Access & Re-entry Planes"],
      ["sternotomy", "Median Sternotomy"], ["art", "ART"],
      {
        anatomy: "Orient the sternum, RV, innominate vein, pericardial reflections and graft danger zones before the first incision.",
        surgery: "Build the entry plan from positioning through safe re-entry and stable closure.",
        evidence: "Connect internal thoracic artery harvest to sternal perfusion, conduit strategy and wound risk.",
        viva: "Defend a redo-entry plan when a patent LIMA crosses behind the sternum."
      },
      "The hostile re-entry", "A prior-CABG patient needs redo mitral surgery. CT shows the RV and a patent LIMA immediately behind the sternum.", [
        { prompt: "What must be established before skin incision?", options: ["Preplanned peripheral rescue access", "Rapid sternotomy without peripheral access", "Central cannulation only after cardiac exposure"], answer: 0, why: "The imaging changes the access plan; rescue bypass must be possible before the hazardous re-entry begins.", wrong: "Re-entry injury occurs before central access is available, forcing uncontrolled rescue." },
        { prompt: "The posterior table is nearly divided. What is the safest next move?", options: ["Force the retractor through remaining adhesions", "Controlled posterior-table dissection", "Advance the saw deeply into the mediastinum"], answer: 1, why: "Controlled posterior-table division limits blind injury to adherent RV or grafts.", wrong: "Blind force converts a predictable adhesion into chamber or graft injury." },
        { prompt: "The LIMA is lacerated and anterior ischemia appears. What is the priority?", options: ["Close and transfer for delayed coronary intervention", "Reverse heparin before controlling hemorrhage", "Control bleeding, start bypass and restore LAD flow"], answer: 2, why: "Immediate control, perfusion and repair or re-grafting address both hemorrhage and acute LAD ischemia.", wrong: "Delay compounds exsanguination and anterior myocardial ischemia." }
      ]),

    circuit(2,
      ["ves-caval-cannulation", "Venae Cavae & Venous Cannulation Anatomy"],
      ["bypass", "Going On and Coming Off CPB"], ["rooby", "ROOBY / ROOBY-FS"],
      {
        anatomy: "Trace venous drainage, cannula position and the structures compressed by snares or malposition.",
        surgery: "Rehearse circuit checks, cannulation, myocardial protection and separation from bypass.",
        evidence: "Use the on-pump/off-pump comparison to examine what CPB enables and what technical completeness costs.",
        viva: "Troubleshoot a heart that will not arrest after antegrade cardioplegia."
      },
      "The pump will not fill", "Minutes after initiating CPB, venous return falls, the reservoir level drops and the right atrium looks tense.", [
        { prompt: "What is the best first response?", options: ["Increase flow despite the falling reservoir", "Reduce flow and inspect the venous-drainage pathway", "Give protamine before checking the circuit"], answer: 1, why: "Protect the reservoir while systematically finding inadequate drainage or obstruction.", wrong: "Running the reservoir empty risks massive air entrainment into the arterial circuit." },
        { prompt: "The venous line chatters and improves when the cannula is withdrawn 1 cm. What was most likely?", options: ["Cannula side holes abutted the atrial or caval wall", "Oxygenator failure obstructed arterial outflow", "An incomplete cross-clamp reduced venous return"], answer: 0, why: "Excessive insertion can occlude side holes against tissue and create position-dependent chatter.", wrong: "Changing unrelated circuit components delays correction of a mechanical drainage problem." },
        { prompt: "Before restoring full flow, what confirms recovery?", options: ["A higher MAP without checking reservoir volume", "A colder venous temperature without circuit inspection", "Stable reservoir, drainage and circuit pressures"], answer: 2, why: "Flow is safe only when drainage and circuit pressures are stable together.", wrong: "A single downstream number cannot prove adequate venous return or circuit integrity." }
      ]),

    circuit(3,
      ["cor-territories-targets", "Coronary Territories & Bypass Target Map"],
      ["cabg", "On-Pump CABG"], ["stich", "STICH"],
      {
        anatomy: "Map ischemic ECG and wall-motion territories back to graft targets and likely technical failures.",
        surgery: "Connect conduit selection, target quality and anastomotic geometry to flow.",
        evidence: "Understand the long-term CABG signal in ischemic cardiomyopathy without treating viability as a treatment-effect selector.",
        viva: "Explain graft failure by timing, conduit and competitive flow."
      },
      "Inferior ischemia after CABG", "After separation from bypass, the patient develops inferior ST elevation, hypotension and new RV dysfunction.", [
        { prompt: "Which graft territory deserves immediate attention?", options: ["The LIMA-to-LAD graft alone", "The RCA or posterior-descending graft", "A diagonal graft without inferior supply"], answer: 1, why: "Inferior ischemia with RV dysfunction localizes to the RCA/PDA territory until proven otherwise.", wrong: "Ignoring the territory delays correction of a potentially reversible technical graft problem." },
        { prompt: "TEE shows new inferior hypokinesis. What is the next operative priority?", options: ["Accept routine reperfusion stunning", "Increase afterload and close without assessment", "Inspect graft flow and anastomotic geometry"], answer: 2, why: "A new regional abnormality after grafting is a technical problem until the graft is demonstrated to be satisfactory.", wrong: "Treating the pressure without investigating the graft preserves the cause of ischemia." },
        { prompt: "Flow is low in a graft to a mildly stenosed native vessel. What mechanism fits?", options: ["Competitive native coronary flow", "Coronary-sinus steal from normal venous drainage", "Acute thrombosis of an unrelated valve prosthesis"], answer: 0, why: "A modest native stenosis reduces the pressure gradient that would otherwise drive graft flow.", wrong: "The graft-native pressure relationship, not an unrelated valve problem, explains the low-flow pattern." }
      ]),

    circuit(4,
      ["val-fibrous-skeleton", "Fibrous Skeleton & Aorto-Mitral Continuity"],
      ["savr", "Surgical Aortic Valve Replacement"], ["partner1", "PARTNER 1"],
      {
        anatomy: "See how valve annuli, fibrous continuity and the conduction axis constrain intervention.",
        surgery: "Translate stenosis physiology into annular debridement, sizing and prosthesis strategy.",
        evidence: "Place surgical and transcatheter valve therapy in the risk-specific evidence arc.",
        viva: "Defend when a gradient reflects flow, obstruction or prosthesis-patient mismatch."
      },
      "Severe AS with a small annulus", "A symptomatic patient has severe aortic stenosis, a small annulus and a predicted small indexed effective orifice area after standard SAVR.", [
        { prompt: "What is the central operative risk of accepting an undersized prosthesis?", options: ["Postoperative coronary vasospasm", "Residual prosthesis-patient mismatch", "New isolated tricuspid regurgitation"], answer: 1, why: "An inadequate indexed effective orifice area leaves a clinically important residual obstruction.", wrong: "The unaddressed annular-prosthesis relationship preserves pressure overload." },
        { prompt: "Which strategy directly addresses that risk?", options: ["Annular enlargement or a higher-flow prosthesis strategy", "Routine reduction of bypass flow during implantation", "Creation of an intentional paravalvular leak"], answer: 0, why: "The solution is to improve the effective orifice area relative to body size.", wrong: "Changing pump management cannot correct a fixed postoperative orifice." },
        { prompt: "After implantation, TEE shows a high gradient with low stroke volume. What should happen first?", options: ["Diagnose mismatch from the gradient alone", "Ignore the gradient because flow is reduced", "Integrate flow, motion, contour and indexed orifice area"], answer: 2, why: "Gradients are flow dependent; diagnosis requires an integrated hemodynamic assessment.", wrong: "A single Doppler number can misclassify low-flow or technical states." }
      ]),

    circuit(5,
      ["cham-surface-orientation", "Surface Anatomy & Cardiac Orientation"],
      ["mitral-repair", "Degenerative Mitral Valve Repair"], ["excel", "EXCEL"],
      {
        anatomy: "Orient imaging planes to the structures the surgeon will expose and repair.",
        surgery: "Use TEE mechanism, segment localization and ventricular geometry to plan repair.",
        evidence: "Connect anatomic complexity and imaging adjudication to revascularization decisions.",
        viva: "Resolve a discordant imaging dataset instead of anchoring on one measurement."
      },
      "Discordant aortic stenosis", "Echo reports an aortic valve area of 0.8 cm² but a mean gradient of 28 mmHg with reduced LVEF.", [
        { prompt: "What is the correct framing?", options: ["Severe AS is excluded by a gradient below 40 mmHg", "The discordant examination should be discarded", "Possible low-flow, low-gradient aortic stenosis"], answer: 2, why: "Valve area and gradient can disagree when forward flow is reduced.", wrong: "A fixed gradient threshold without flow context can miss true severe disease." },
        { prompt: "Which next test can distinguish true-severe from pseudo-severe AS when appropriate?", options: ["Dobutamine stress echocardiography", "Routine posteroanterior chest radiography", "Ambulatory rhythm monitoring without imaging"], answer: 0, why: "Flow augmentation can reveal whether valve area remains fixed while gradient rises.", wrong: "The alternative test does not interrogate valve behavior during increased flow." },
        { prompt: "Contractile reserve is absent and uncertainty remains. What additional evidence is useful?", options: ["Serum troponin without structural imaging", "CT aortic-valve calcium assessment", "Repeat blood pressure without flow data"], answer: 1, why: "CT calcium burden provides flow-independent support for stenosis severity.", wrong: "A nonspecific marker cannot resolve the valve-severity mechanism." }
      ]),

    circuit(6,
      ["ves-femoral", "Femoral Vessels"],
      ["sternotomy", "Median Sternotomy"], ["syntax", "SYNTAX"],
      {
        anatomy: "Plan peripheral access and recognize how vascular disease changes rescue options.",
        surgery: "Turn risk assessment into positioning, access, blood and re-entry preparation.",
        evidence: "Use anatomic complexity as one component of Heart-Team judgment rather than a stand-alone verdict.",
        viva: "Defend optimization decisions when bleeding and ischemic risks conflict."
      },
      "The high-risk elective CABG", "A frail patient with chronic kidney disease and recent ticagrelor exposure is referred for elective CABG.", [
        { prompt: "What is the best first planning step?", options: ["Proceed immediately because every delay is harmful", "Integrated Heart-Team benefit-risk assessment", "Cancel solely because the calculated score is high"], answer: 1, why: "No isolated variable substitutes for a multidisciplinary benefit-risk assessment.", wrong: "A single-factor decision either accepts avoidable bleeding or denies potentially beneficial surgery." },
        { prompt: "For non-emergency surgery, what ticagrelor interruption is supported by current cardiac-surgery guidance?", options: ["At least 3 days", "Exactly 10 days", "No interruption under any circumstance"], answer: 0, why: "Current guidance supports postponing non-emergency open-heart surgery at least 3 days after ticagrelor discontinuation.", wrong: "The selected strategy misstates the drug-specific recovery window or ignores bleeding risk." },
        { prompt: "How should a high calculated risk score be used?", options: ["As an automatic contraindication to surgery", "As proof that PCI is always superior", "As an estimate supplemented by anatomy, frailty and goals"], answer: 2, why: "Risk models inform rather than replace individualized judgment.", wrong: "Turning a population model into an absolute decision hides factors the model does not capture." }
      ]),

    circuit(7,
      ["ves-lima", "Left Internal Mammary Artery (LIMA)"],
      ["cabg", "On-Pump CABG"], ["freedom", "FREEDOM"],
      {
        anatomy: "Trace LIMA course, harvest hazards and its relationship to LAD targeting.",
        surgery: "Build a complete conduit and target plan for multivessel disease.",
        evidence: "Use FREEDOM to defend CABG for diabetes with multivessel coronary disease.",
        viva: "Defend conduit choice and complete revascularization under follow-up questioning."
      },
      "Diabetes and three-vessel disease", "A patient with diabetes has diffuse three-vessel CAD, preserved targets and no prohibitive surgical risk.", [
        { prompt: "Which revascularization strategy has the strongest long-term evidence in this pattern?", options: ["CABG as part of Heart-Team decision-making", "Culprit-only balloon angioplasty", "Medical therapy regardless of symptoms and anatomy"], answer: 0, why: "FREEDOM supports CABG over PCI for major long-term outcomes in diabetes with multivessel disease.", wrong: "The alternative does not match the evidence or the extent of disease." },
        { prompt: "Which conduit-target pairing is the anchor of the operation?", options: ["Saphenous vein to a mildly stenosed diagonal", "LIMA to the LAD", "Radial artery to an ungraftable vessel"], answer: 1, why: "LIMA-LAD provides the most durable and prognostically important single graft.", wrong: "The proposed pairing sacrifices durability or ignores target suitability." },
        { prompt: "A radial graft is planned. What target feature matters?", options: ["Only the target vessel name", "A native stenosis mild enough to preserve competitive flow", "A sufficiently severe stenosis to minimize competitive flow"], answer: 2, why: "Arterial grafts are especially vulnerable to competitive flow when native stenosis is modest.", wrong: "Ignoring lesion severity can condemn a technically sound arterial graft to low flow." }
      ]),

    circuit(8,
      ["val-mitral", "Mitral Valve"],
      ["mitral-repair", "Degenerative Mitral Valve Repair"], ["everest2", "EVEREST II"],
      {
        anatomy: "Relate leaflet segments, chordae, papillary muscles and annular geometry to repair maneuvers.",
        surgery: "Move from mechanism to resection/resuspension, ring selection and post-repair testing.",
        evidence: "Contrast surgical repair durability with transcatheter edge-to-edge repair in selected patients.",
        viva: "Recognize and rescue systolic anterior motion after repair."
      },
      "SAM after mitral repair", "After repair of a large posterior-leaflet prolapse, TEE shows systolic anterior motion, LVOT obstruction and posteriorly directed MR.", [
        { prompt: "What mechanism best unifies the findings?", options: ["Anteriorly displaced mitral coaptation causing SAM", "Acute dissection compromising a coronary ostium", "Isolated RV infarction without an LVOT mechanism"], answer: 0, why: "Excess posterior leaflet height and a small hyperdynamic ventricle move coaptation anteriorly and drag the anterior leaflet into the LVOT.", wrong: "The alternative does not explain simultaneous LVOT obstruction and posterior MR." },
        { prompt: "What is the best initial physiologic response?", options: ["Increase inotropy while deliberately reducing afterload", "Increase preload and afterload; reduce inotropy", "Reduce preload with aggressive diuresis and venodilation"], answer: 1, why: "A larger LV cavity and lower contractility reduce SAM; afterload supports forward flow.", wrong: "The chosen maneuver makes the ventricle smaller or more hyperdynamic and worsens obstruction." },
        { prompt: "SAM remains severe despite correction of loading. What follows?", options: ["Accept severe obstruction and close without correction", "Treat persistent mechanical SAM with pacing alone", "Return to bypass and revise repair geometry"], answer: 2, why: "Persistent important SAM is a repair problem and should be corrected before leaving the operating room.", wrong: "Leaving a major technical lesion converts a correctable intraoperative problem into postoperative shock." }
      ]),

    circuit(9,
      ["ves-ascending-arch", "Ascending Aorta & Aortic Arch"],
      ["type-a", "Acute Type A Dissection Repair"], ["instead-xl", "INSTEAD-XL"],
      {
        anatomy: "Map arch branches, true and false lumen flow, cannulation options and cerebral perfusion routes.",
        surgery: "Plan emergency access, proximal control, distal extent and malperfusion management.",
        evidence: "Separate evidence for uncomplicated chronic type B dissection from emergency type A surgery.",
        viva: "Defend cannulation and cerebral-protection choices in acute dissection."
      },
      "Type A dissection with malperfusion", "A patient with acute type A dissection has a cool right arm, rising lactate and a compressed true lumen on CT.", [
        { prompt: "What is the immediate strategic priority?", options: ["Delay repair until every malperfused bed normalizes", "Emergency proximal repair with true-lumen perfusion", "Use chronic antihypertensives without proximal repair"], answer: 1, why: "The proximal tear remains the lethal driver; cannulation and repair must restore effective true-lumen perfusion.", wrong: "Delay leaves rupture, tamponade and ongoing malperfusion unchecked." },
        { prompt: "Which access site may provide antegrade systemic and cerebral perfusion when anatomy permits?", options: ["Right axillary artery", "A false-lumen femoral cannula without imaging", "Left atrial appendage"], answer: 0, why: "Axillary access can support antegrade flow and cerebral perfusion while avoiding a dissected ascending aorta.", wrong: "The alternative risks false-lumen pressurization or is not an arterial inflow site." },
        { prompt: "After repair, lactate continues to rise and the abdomen is tense. What now?", options: ["Assume proximal repair corrected every branch vessel", "Defer reassessment until routine postoperative imaging", "Urgently treat persistent mesenteric malperfusion"], answer: 2, why: "Dynamic flow may improve after proximal repair, but fixed branch obstruction can persist and requires immediate treatment.", wrong: "Persistent end-organ ischemia is time critical and cannot be inferred away." }
      ]),

    circuit(10,
      ["cham-ventricles", "Ventricles & Ventricular Septum"],
      ["lvad", "Continuous-flow LVAD Implantation"], ["momentum3", "MOMENTUM 3"],
      {
        anatomy: "Relate septal position, RV geometry and LV inflow orientation to device performance.",
        surgery: "Connect patient selection, inflow/outflow geometry and RV reserve to implantation.",
        evidence: "Understand why HeartMate 3 changed pump-thrombosis and reoperation outcomes.",
        viva: "Troubleshoot low LVAD flow using preload, afterload and pump-device interactions."
      },
      "Low flow after LVAD implantation", "Soon after LVAD activation, flow falls, CVP rises, the septum shifts left and the LV becomes very small.", [
        { prompt: "What physiology is most likely?", options: ["Isolated LV volume overload with preserved RV delivery", "Acute RV failure limiting LVAD preload", "Systemic hypertension with a persistently full LV"], answer: 1, why: "High CVP, a small LV and leftward septal shift indicate inadequate delivery through the RV to the LVAD.", wrong: "The alternative does not fit the preload-starved LV and venous congestion." },
        { prompt: "What is the best immediate strategy?", options: ["Support the RV and reassess pump speed", "Increase LVAD speed despite the underfilled ventricle", "Clamp the outflow graft to treat inadequate preload"], answer: 0, why: "The pump cannot create preload; RV support and careful speed adjustment restore balanced flow.", wrong: "More speed can worsen suction and septal shift when preload is inadequate." },
        { prompt: "TEE shows repeated inflow-cannula contact with the LV wall. What must be considered?", options: ["Anemia without a device-heart interaction", "Systemic infection without a mechanical cause", "LV suction or inflow-cannula malposition"], answer: 2, why: "Wall contact is a mechanical clue to suction and possibly adverse inflow orientation.", wrong: "Ignoring the device-heart geometry allows recurrent low-flow and arrhythmia." }
      ]),

    circuit(11,
      ["cham-pericardium", "Pericardium & Pericardial Sinuses"],
      ["bypass", "Going On and Coming Off CPB"], ["fibres", "FIBRES"],
      {
        anatomy: "Use pericardial spaces and drain position to reason about retained blood and localized tamponade.",
        surgery: "Reconstruct heparin, protamine and bypass-related coagulopathy before treating the bleeding field.",
        evidence: "Apply FIBRES to goal-directed fibrinogen replacement without losing sight of surgical bleeding.",
        viva: "Interpret a bleeding pattern and defend product, drug or re-exploration choices."
      },
      "The chest that keeps filling", "After CPB, chest-tube output is brisk. ACT is normalized, the field has diffuse microvascular ooze and viscoelastic testing shows weak clot amplitude with low fibrinogen contribution.", [
        { prompt: "What is the best first interpretation?", options: ["A fibrinogen/platelet contribution problem after CPB", "Isolated residual heparin despite a normalized ACT", "A reason to ignore the surgical field"], answer: 0, why: "The pattern indicates impaired clot strength; testing should guide component or factor replacement while the field is inspected.", wrong: "Treating an unsupported mechanism delays targeted hemostasis." },
        { prompt: "Which evidence-consistent fibrinogen strategy is reasonable where available?", options: ["No replacement under any circumstance", "Targeted fibrinogen concentrate", "Empiric fibrinogen for every bypass patient"], answer: 1, why: "FIBRES supports fibrinogen concentrate as a noninferior replacement option in the studied bleeding population.", wrong: "The alternative either withholds indicated therapy or generalizes beyond the trial population." },
        { prompt: "Bleeding remains focal and brisk after correction. What is next?", options: ["Continue blind transfusion indefinitely", "Close and observe", "Return to direct surgical-source control"], answer: 2, why: "Persistent focal bleeding is surgical until proven otherwise and must be corrected mechanically.", wrong: "Blood products cannot close an arterial or suture-line defect." }
      ]),

    circuit(12,
      ["cond-operative-danger-zones", "Conduction System: Operative Danger Zones"],
      ["maze", "Cox-Maze Surgical Ablation"], ["surtavi", "SURTAVI"],
      {
        anatomy: "Map the AV node, His bundle and bundle branches to valve sutures and septal structures.",
        surgery: "Place every maze lesion against named anatomy: box the pulmonary veins, spare the sinus node at the cavoatrial junction and use cryoablation where a line reaches an atrioventricular groove.",
        evidence: "Use transcatheter-versus-surgical evidence to discuss conduction and pacemaker tradeoffs.",
        viva: "Troubleshoot temporary pacing failure without treating the pacemaker as a black box."
      },
      "Temporary pacing fails to capture", "A postoperative SAVR patient develops complete heart block. The epicardial pacer is firing but no QRS follows each spike.", [
        { prompt: "What does this tracing show?", options: ["Failure to sense", "Failure to capture", "Normal AV conduction"], answer: 1, why: "Pacing artifacts without subsequent depolarization define failure to capture.", wrong: "Mislabeling the malfunction leads to the wrong control adjustment." },
        { prompt: "What should be checked immediately?", options: ["Pacing connections and capture threshold", "Only the lower rate limit", "Only the patient's temperature"], answer: 0, why: "Capture depends on an intact circuit, adequate output and excitable myocardium.", wrong: "A single setting cannot exclude disconnection, lead failure or a high threshold." },
        { prompt: "Capture remains unreliable in an unstable patient. What is the escalation?", options: ["Turn the pacer off", "Wait for spontaneous recovery without backup", "Secure reliable backup pacing"], answer: 2, why: "Hemodynamic instability requires dependable pacing, often transvenous or another immediately available backup.", wrong: "An unstable patient cannot safely wait with unreliable ventricular activation." }
      ]),

    circuit(13,
      ["ves-pulmonary", "Pulmonary Arteries & Veins"],
      ["lvad", "Continuous-flow LVAD Implantation"], ["trics3", "TRICS III"],
      {
        anatomy: "Use pulmonary and right-heart anatomy to interpret RV afterload and left-sided filling.",
        surgery: "Recognize how ventricular interaction drives separation and postoperative support.",
        evidence: "Use TRICS III to frame transfusion as a physiologic strategy rather than a reflex number.",
        viva: "Separate pump failure, vasoplegia, tamponade and RV failure from coupled signals."
      },
      "Shock in the ICU", "Four hours after surgery, MAP is 48, CVP has risen from 10 to 19, pulse pressure is narrow and chest-tube output has abruptly stopped.", [
        { prompt: "Which diagnosis deserves immediate exclusion?", options: ["Uncomplicated vasodilation", "Localized postoperative tamponade", "Isolated anemia without bleeding"], answer: 1, why: "Rising filling pressure, low output and abruptly reduced drainage are classic for retained blood and tamponade.", wrong: "Treating pressure alone can delay relief of mechanical obstruction." },
        { prompt: "What is the best next diagnostic action while resuscitation begins?", options: ["Focused bedside echo/TEE", "Routine outpatient CT", "Delay imaging until morning rounds"], answer: 0, why: "Postoperative tamponade can be localized; urgent focused imaging and surgical assessment are required.", wrong: "Time lost to nonurgent evaluation worsens obstructive shock." },
        { prompt: "Imaging shows a posterior collection compressing the left atrium. What is definitive management?", options: ["More vasopressor alone", "Red-cell transfusion solely because hemoglobin is 8 g/dL", "Urgent surgical decompression and control of the source"], answer: 2, why: "Mechanical compression requires mechanical relief; transfusion thresholds do not treat obstruction.", wrong: "Supportive therapy cannot remove the compressive collection." }
      ]),

    circuit(14,
      ["val-aortic-root-geometry", "Aortic Root Geometry for Repair & Replacement"],
      ["bentall", "Bentall Root Replacement"], ["noble", "NOBLE"],
      {
        anatomy: "Integrate root, coronary-button, valve, conduction and arch relationships in one operative map.",
        surgery: "Run the complete indication-to-rescue sequence for composite root replacement.",
        evidence: "Use a trial limitation and endpoint structure to defend a nuanced Heart-Team recommendation.",
        viva: "Synthesize mechanism, evidence and exception across the entire curriculum."
      },
      "The capstone deterioration", "After complex root replacement, the patient has new inferior ST elevation, rising CVP, falling LV filling and increasing vasopressor requirement.", [
        { prompt: "What unifying technical diagnosis must be considered first?", options: ["Right coronary button compromise causing RV ischemia", "Isolated distributive shock with no technical cause", "Expected postoperative physiology"], answer: 0, why: "Inferior ischemia plus acute RV failure after root work localizes to right coronary-button obstruction, kink or tension.", wrong: "Calling this vasoplegia delays correction of a time-critical coronary technical problem." },
        { prompt: "What should happen immediately?", options: ["Close the chest and trend troponin", "Reinspect button geometry and flow on bypass if needed", "Treat only with inhaled pulmonary vasodilator"], answer: 1, why: "The suspected lesion is mechanical and requires immediate inspection and restoration of coronary perfusion.", wrong: "Supportive therapy cannot unkink or revise a compromised coronary button." },
        { prompt: "After revision, RV function remains poor. What completes the rescue?", options: ["Ignore loading and rhythm", "Maximize LVAD speed despite no LVAD", "Optimize the RV and reassess ischemia"], answer: 2, why: "Once flow is restored, the injured RV still needs a coordinated physiologic recovery strategy.", wrong: "A single unsupported intervention misses the coupled determinants of RV output." }
      ])
  ];

  /* Optional deep modules sit beside a day's five-station circuit without
     changing the established /5 completion contract used by every day. */
  const imagingDay = window.DAY_ECOSYSTEMS.find(item => item.day === 5);
  if (imagingDay) imagingDay.modules = [
    {
      id: "coronary-angiography",
      title: "Coronary Angiography Intensive",
      route: "#/angiography",
      focus: "Read the coronary tree projection by projection, interrogate lesions and flow, then translate the angiogram into a surgical target and revascularization plan."
    }
  ];
})();
