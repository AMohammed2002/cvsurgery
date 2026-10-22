/* CardiacSchool advanced resident-layer content: operations, physiology and crises. */
"use strict";

(function () {
  const operations = [
    {
      id: "sternotomy", title: "Median Sternotomy", category: "Foundational skill", day: 1,
      difficulty: "Foundation", minutes: 18,
      orientation: "A median sternotomy divides the sternum in the midline to create rapid, extensile access to the heart, great vessels and both pleural spaces.",
      indication: "Use it when broad central access, cardiopulmonary bypass, multivessel coronary exposure or complex aortic work is required. The incision is simple; the judgment is in preventing injury during entry and achieving a stable, infection-resistant closure.",
      anatomy: "The sternum overlies the anterior mediastinum. Immediately deep are variable thymic fat, the left brachiocephalic vein superiorly, pericardium, right ventricular free wall and—after prior surgery—adhesed grafts or cardiac chambers. The internal thoracic arteries run roughly 1 to 2 cm lateral to the sternal edge. On re-entry, the right ventricle or an anterior vein graft can be millimetres from the posterior table.",
      preop: ["Review prior operative notes and cross-sectional imaging for redo entry.", "Confirm antibiotics, positioning, defibrillator pads and blood availability.", "Mark the midline from sternal notch to xiphoid; pad pressure points and keep the neck neutral.", "For a hostile redo chest, agree on peripheral access and a rescue bypass plan before incision."],
      steps: [
        { title: "Position and prepare", text: "Supine, arms tucked, shoulders near the table break. Prep widely from chin to knees when conduit harvest or femoral rescue access may be needed.", why: "A narrow prep converts an unexpected cannulation problem into a delay." },
        { title: "Skin and fascia", text: "Incise in the midline from below the notch toward the xiphoid. Divide presternal fascia cleanly and control perforators.", why: "A true midline plane improves cosmesis and helps the saw remain centered." },
        { title: "Develop the endpoints", text: "Open the interclavicular ligament superiorly and expose the xiphoid inferiorly. Free the underside only enough to admit the saw safely.", why: "Blind deep dissection can injure the brachiocephalic vein or diaphragm." },
        { title: "Divide the sternum", text: "Ventilate briefly as agreed, then pass the saw from xiphoid to notch or notch to xiphoid according to local technique, staying vertical and centered.", why: "Lateral drift creates an unstable hemisternum; deep plunge risks the right ventricle." },
        { title: "Hemostasis", text: "Separate the halves gradually. Control marrow bleeding and internal thoracic branches without indiscriminate cautery near future graft harvest planes.", why: "Early control improves visibility and reduces transfusion without damaging conduit." },
        { title: "Open the mediastinum", text: "Divide thymic tissue in the midline, identify the brachiocephalic vein, then open pericardium under direct vision and suspend it with stay sutures.", why: "The pericardial cradle improves exposure while protecting both phrenic nerves." },
        { title: "Close the sternum", text: "After hemostasis and correct drain/wire placement, approximate stable bone with the service's wire or plate strategy; inspect each wire before tightening.", why: "Symmetric load sharing and preserved bone are the mechanical basis of union." },
        { title: "Layered closure", text: "Close fascia, deep dermis and skin without dead space; document any fracture, poor bone or alternative fixation.", why: "Sternal instability and dead space amplify infection risk." }
      ],
      numbers: ["Keep the saw centered; there is no safe posterior margin in a redo chest.", "Antibiotic timing and redosing follow local policy and case duration.", "Assess closure mechanically before leaving the operating room; a visibly rocking sternum is not an acceptable endpoint."],
      complications: ["Right ventricular or graft injury during redo entry: stop, compress, expose and initiate the preplanned rescue strategy.", "Internal thoracic artery injury: obtain proximal and distal control while preserving usable conduit when possible.", "Sternal fracture or off-midline division: modify fixation rather than forcing standard wires through poor purchase.", "Deep sternal wound infection: prevention starts with glucose control, tissue handling, stability and appropriate antimicrobial prophylaxis."],
      postop: ["Inspect drainage and hemodynamics for occult mediastinal bleeding.", "Use multimodal analgesia and pulmonary hygiene so pain does not become atelectasis.", "Treat clicking, drainage, fever or instability as a diagnostic problem, not a reassurance exercise."],
      evidence: "Technique varies by surgeon and patient. Rigid fixation, cable systems and conventional wires all have roles; patient bone quality, fracture pattern, infection risk and institutional expertise should drive selection.",
      viva: ["What structures are most endangered on redo entry?", "How does CT change the re-entry plan?", "Why does an off-midline cut matter?", "How do you manage an injured right ventricle?", "What makes a closure biologically and mechanically sound?"],
      sources: ["Local operative standard and adult cardiac surgery reference set"]
    },
    {
      id: "bypass", title: "Going On and Coming Off CPB", category: "Foundational skill", day: 2,
      difficulty: "Core resident", minutes: 28,
      orientation: "Cardiopulmonary bypass temporarily takes over circulation and gas exchange; initiation and separation are controlled handoffs in which communication matters as much as cannula position.",
      indication: "Most open intracardiac and arrested-heart operations require CPB. The resident must understand the circuit, anticipate each verbal check, recognize inadequate drainage or malperfusion, and diagnose failure to separate before simply adding drugs.",
      anatomy: "Arterial return commonly enters the distal ascending aorta. Venous drainage enters the right atrium with a two-stage cannula or the cavae separately. The aortic root and coronary sinus provide cardioplegia routes; the right superior pulmonary vein or pulmonary artery may accept a vent. Every cannula can dissect, perforate, obstruct or entrain air.",
      preop: ["Team brief: cannulation, vent, cardioplegia and rescue plan.", "Confirm circuit, blood availability, TEE, pacing/defibrillation capability and baseline laboratory values.", "Inspect aortic imaging for calcification or dissection and choose the safest inflow site.", "State separation goals before reperfusion: temperature, rhythm, ventilation, electrolytes, filling and surgical result."],
      steps: [
        { title: "Heparinize and verify", text: "Give weight-based heparin and confirm the service-specific ACT target before cannulation.", why: "Cannulating an inadequately anticoagulated patient can thrombose the circuit or embolize clot." },
        { title: "Arterial cannulation", text: "Place purse strings on healthy aorta, enter under controlled pressure, de-air the cannula and connect securely. Watch the arterial line and aorta as flow begins.", why: "A sudden high line pressure, loss of pulse contour or blue expanding aorta suggests malposition or dissection." },
        { title: "Venous cannulation", text: "Insert the planned atrial or bicaval cannula, secure it and confirm unobstructed drainage without caval injury.", why: "Poor venous return can reflect position, air lock, low volume or caval obstruction—not a pump problem alone." },
        { title: "Initiate bypass", text: "Perfusion increases flow while anesthesia and surgery confirm MAP, drainage, oxygenation, face color, line pressures and an emptying heart.", why: "The handoff is gradual so malperfusion is detected before full support." },
        { title: "Clamp and protect", text: "Once stable on full flow, apply the cross-clamp and deliver the agreed cardioplegia. Confirm electrical arrest, myocardial cooling and venting.", why: "A motionless heart is not proof of uniform myocardial protection." },
        { title: "Prepare to separate", text: "Rewarm, ventilate, correct major electrolyte and acid-base problems, de-air with TEE, restore rhythm, verify pacing and inspect the repair.", why: "Separation fails when reversible prerequisites are ignored." },
        { title: "Dynamic trial off", text: "Reduce venous drainage and pump flow stepwise while assessing biventricular filling, contractility, valve function, MAP and pulmonary pressures on TEE and monitors.", why: "The response to loading distinguishes empty heart, LV failure, RV failure, obstruction and vasoplegia." },
        { title: "Diagnose before escalating", text: "If unstable, name the phenotype: preload, pump, rhythm, afterload, surgical result or mechanical obstruction. Correct the cause and return to support early when needed.", why: "Multiple empiric boluses can hide the diagnosis and worsen RV or LV loading." },
        { title: "Protamine and decannulate", text: "Only after stable separation, administer protamine slowly with readiness for reaction. Reassess, remove cannulae and secure purse strings.", why: "Protamine can cause systemic hypotension, pulmonary hypertension or collapse; loss of bypass access too early removes the rescue route." }
      ],
      numbers: ["ACT and heparin/protamine targets are institution- and circuit-specific; confirm them aloud.", "Typical indexed pump flow is commonly around 2.2 to 2.5 L/min/m², adjusted to temperature, oxygen delivery and patient factors.", "Oxygen delivery depends on flow and arterial oxygen content, not MAP alone.", "Normothermia, adequate ventilation and a reversible rhythm are separation prerequisites."],
      complications: ["Aortic dissection on arterial inflow: stop flow, announce it, confirm true-lumen perfusion and change cannulation strategy.", "Venous air lock or poor drainage: reduce dangerous suction, inspect position and volume, and correct the mechanical cause.", "Failure to separate: use TEE and physiology to identify LV, RV, valve, ischemic, obstructive or vasoplegic causes.", "Protamine reaction: stop exposure, support circulation and pulmonary pressure, and be ready to re-heparinize and resume CPB."],
      postop: ["Trend perfusion, lactate, urine output and neurologic status for occult malperfusion.", "Review the separation phenotype in handover; the first ICU decisions depend on whether the problem was preload, RV, LV, vasoplegia or ischemia.", "Document cannulation difficulty, repair concerns, pacing dependence and residual lesions."],
      evidence: "No single MAP or flow number is universally correct. Modern perfusion uses patient-specific oxygen delivery, temperature and cerebral/organ monitoring alongside pressure.",
      viva: ["What are your prerequisites for coming off bypass?", "How do you diagnose RV failure during separation?", "What does high arterial line pressure mean?", "Why can a normal MAP still coexist with inadequate oxygen delivery?", "What are the major protamine reaction phenotypes?"],
      sources: ["Adult CPB reference set", "STS/SCA/AmSECT/SABM patient blood management guideline, 2021"]
    },
    {
      id: "cabg", title: "On-Pump CABG", category: "Coronary", day: 7,
      difficulty: "Senior resident", minutes: 36,
      orientation: "Coronary artery bypass grafting routes arterial blood around obstructive coronary disease using durable conduits selected for each target.",
      indication: "The operation is chosen through patient-centred Heart Team reasoning, not a stenosis count alone. Significant left-main disease, diabetes with multivessel disease, complex anatomy, impaired ventricular function and the ability to achieve durable complete revascularization often favor CABG; symptoms, anatomy, comorbidity, life expectancy and patient preference remain decisive.",
      anatomy: "The left main divides into LAD and circumflex; the LAD runs in the anterior interventricular groove, the circumflex in the left AV groove, and the RCA in the right AV groove before giving the PDA according to dominance. The LIMA lies on the posterior chest wall with paired veins and the phrenic nerve nearby. Target quality, distal runoff, competitive native flow and conduit lie determine graft behavior.",
      preop: ["Display the angiogram and identify every target, stenosis, collateral and ungrafted territory.", "Confirm antiplatelet plan, conduit assessment and any radial/vein mapping.", "Review aortic disease, ventricular function, valve lesions and need for concomitant procedures.", "Agree on graft plan, pump strategy and contingency for an unusable target or conduit."],
      steps: [
        { title: "Access and conduit harvest", text: "Perform sternotomy while harvesting LIMA and additional conduit with atraumatic technique. Inspect caliber, injury and flow before commitment.", why: "Conduit biology and handling determine long-term patency." },
        { title: "Plan targets", text: "Correlate the angiogram with epicardial anatomy. Choose a healthy distal landing zone with adequate runoff and a tension-free conduit path.", why: "A technically perfect anastomosis to a poor or mismatched target still fails." },
        { title: "Cannulate and protect", text: "Heparinize, establish CPB, vent as planned, cross-clamp and deliver cardioplegia with repeated assessment of myocardial protection.", why: "Hypertrophied or ischemic hearts may need tailored delivery and redosing." },
        { title: "Open the coronary", text: "Stabilize and incise the selected target beyond significant disease. Assess wall quality, diameter and back-bleeding.", why: "Extending into plaque or choosing a tiny diffusely diseased segment compromises the result." },
        { title: "Distal anastomosis", text: "Create a precise end-to-side anastomosis with fine polypropylene, avoiding heel/toe narrowing, purse-stringing and adventitial bites.", why: "Geometry and atraumatic intimal apposition prevent early thrombosis." },
        { title: "Route the graft", text: "Lay each conduit without twist, tension, compression or excessive length through the full range of cardiac filling.", why: "A graft that looks acceptable on an empty heart may kink after filling." },
        { title: "Proximal work and reperfusion", text: "Construct proximal anastomoses using the selected clamp strategy, meticulously de-air, remove the cross-clamp and allow controlled reperfusion.", why: "Aortic manipulation drives embolic risk; air can preferentially enter the RCA." },
        { title: "Verify the operation", text: "Inspect hemodynamics, regional wall motion and graft lie; use transit-time flow or another local verification method when available.", why: "The operating room is the safest place to revise a questionable graft." },
        { title: "Separate and close", text: "Wean from CPB by physiology, reverse heparin, achieve hemostasis, place drains/wires and close a stable sternum.", why: "Post-bypass ischemia, bleeding and low output must be explained before leaving." }
      ],
      numbers: ["LIMA-to-LAD is the anchor graft because of durable patency and clinical benefit.", "Radial artery is preferred over saphenous vein for the next most important severely stenosed target in the 2021 ACC/AHA/SCAI guideline.", "Assess target size, stenosis and runoff; competitive flow can jeopardize arterial grafts.", "Use local standards for ACT, cardioplegia, transit-time flow and pulsatility index rather than memorizing a single universal cutoff."],
      complications: ["New regional dysfunction or ST change: consider air, spasm, graft twist, poor anastomosis or incomplete revascularization and investigate immediately.", "LIMA injury or spasm: protect the conduit, correct mechanical problems and use the service's vasodilator strategy.", "Aortic injury or embolization: minimize manipulation and change strategy when the aorta is diseased.", "Low output after separation: distinguish ischemia from global stunning, volume, RV failure, valve disease and vasoplegia."],
      postop: ["Trend rhythm, drainage, perfusion and ischemic evidence; postoperative AF and bleeding are common but not automatically benign.", "Continue secondary prevention and antiplatelet therapy according to the operative plan and local protocol.", "Unexpected ischemia or shock needs an anatomic explanation; involve the operating team early."],
      evidence: "The 2021 ACC/AHA/SCAI guideline emphasizes Heart Team decision-making, survival benefit for CABG in significant left-main disease, CABG for diabetes with triple-vessel disease when operable, and radial artery preference for the second target. Guideline controversy and patient selection should be taught explicitly rather than reduced to slogans.",
      viva: ["Why LIMA to LAD?", "Who with left-main disease should still receive PCI?", "How do you choose a radial target?", "What makes a distal anastomosis fail early?", "How do you approach new anterior ST elevation after CABG?"],
      sources: ["2021 ACC/AHA/SCAI Coronary Revascularization Guideline", "SYNTAX, FREEDOM, STICH, ART and ROOBY trial summaries"]
    },
    {
      id: "savr", title: "Surgical Aortic Valve Replacement", category: "Valve", day: 8,
      difficulty: "Senior resident", minutes: 34,
      orientation: "SAVR excises a diseased aortic valve and implants a prosthesis that restores forward flow while preserving the root, coronaries and conduction system.",
      indication: "Operate for guideline-defined severe disease when symptoms, ventricular dysfunction, very severe obstruction, abnormal exercise response, concomitant surgery or other high-risk features justify intervention. SAVR versus TAVI is a lifetime-management decision incorporating age, life expectancy, anatomy, access, surgical risk, durability, coronary access and patient goals.",
      anatomy: "The aortic root includes annulus, sinuses, coronary ostia, commissures and sinotubular junction. The membranous septum and conduction axis lie beneath the noncoronary/right-coronary commissural region. The aortomitral curtain forms fibrous continuity posteriorly. Aggressive debridement can injure conduction tissue, annulus, mitral curtain or adjacent structures.",
      preop: ["Confirm severity, ventricular response and symptom attribution on imaging.", "Review coronary anatomy, annular/root dimensions, calcium distribution and aortopathy.", "Complete shared decision-making for mechanical versus bioprosthetic valve and anticoagulation implications.", "Plan for small annulus, root enlargement, concomitant CABG or aortic replacement before entering the room."],
      steps: [
        { title: "Establish exposure and CPB", text: "Perform sternotomy, open the pericardium, cannulate appropriately, place vent/cardioplegia routes and achieve protected arrest.", why: "Regurgitation, coronary disease or aortic pathology can change the protection plan." },
        { title: "Aortotomy", text: "Open the aorta at a site that provides exposure and preserves enough tissue for secure closure.", why: "A low or poorly planned incision can limit visualization and complicate closure." },
        { title: "Inspect and excise", text: "Identify leaflets, commissures and ostia; excise diseased tissue while controlling debris.", why: "Calcium embolization and ostial injury are preventable technical hazards." },
        { title: "Debride the annulus", text: "Remove obstructive calcium carefully until sutures can seat on healthy tissue; avoid deep injury near the membranous septum and aortomitral curtain.", why: "Too little debridement causes leak; too much causes rupture or conduction injury." },
        { title: "Size strategically", text: "Measure the annulus and projected effective orifice area in the context of body size and future valve-in-valve options.", why: "The largest valve is not always the correct valve, but severe mismatch is a preventable lifetime burden." },
        { title: "Place sutures", text: "Place evenly spaced annular sutures with consistent depth and orientation, protecting coronary ostia and conduction tissue.", why: "Skipped, shallow or tangled sutures cause paravalvular leak or mal-seating." },
        { title: "Seat and inspect", text: "Lower the prosthesis without trapping sutures, confirm unobstructed leaflets and coronary ostia, then secure knots symmetrically.", why: "A single looped suture or obstructed leaflet can be catastrophic." },
        { title: "Close, de-air and assess", text: "Close the aortotomy, de-air under TEE, reperfuse and assess gradient, seating, leak, ventricular function and coronaries before separation.", why: "Air and ostial compromise often declare as new RV or LV dysfunction." },
        { title: "Pacing and closure", text: "Place functioning pacing wires, reverse heparin, control root bleeding and close with the rhythm plan explicit.", why: "Conduction injury may be transient, progressive or immediately pacing-dependent." }
      ],
      numbers: ["Severe high-gradient AS is typically Vmax at least 4.0 m/s or mean gradient at least 40 mmHg, interpreted with valve area, flow and clinical context.", "2020 ACC/AHA guidance generally favors SAVR under age 65 or life expectancy over 20 years; transfemoral TAVI is generally favored over age 80 or life expectancy under 10 years when appropriate.", "Indexed effective orifice area and body size matter when evaluating patient-prosthesis mismatch.", "Use local ACT, cardioplegia and pacing protocols."],
      complications: ["Complete heart block: confirm wire capture, correct reversible contributors and plan rhythm surveillance/EP input.", "Paravalvular leak: define location and mechanism on TEE; significant technical leak should be addressed before leaving.", "Coronary ostial obstruction or air: suspect with new regional dysfunction, especially RV failure.", "Annular/root injury: control bleeding, define extent and escalate reconstruction rather than placing blind sutures."],
      postop: ["Monitor conduction continuously and communicate pacing dependence.", "Confirm expected prosthetic hemodynamics and absence of significant leak.", "Manage the hypertrophied LV thoughtfully; diastolic dysfunction makes both underfilling and overload poorly tolerated."],
      evidence: "The 2020 ACC/AHA valve guideline frames SAVR versus TAVI by symptoms, age, life expectancy, anatomy, access, risk and shared decision-making. A binary age slogan cannot replace lifetime planning.",
      viva: ["Why does AVR cause heart block?", "How do you avoid patient-prosthesis mismatch?", "What favors SAVR over TAVI?", "What causes new RV failure after unclamping?", "How do you assess a paravalvular leak?"],
      sources: ["2020 ACC/AHA Valvular Heart Disease Guideline", "PARTNER and SURTAVI trial summaries"]
    },
    {
      id: "mitral-repair", title: "Degenerative Mitral Valve Repair", category: "Valve", day: 8,
      difficulty: "Senior resident", minutes: 38,
      orientation: "Mitral repair restores leaflet coaptation and annular geometry while preserving the native subvalvular apparatus and ventricular function.",
      indication: "For severe primary degenerative MR, durable repair is preferred when the anatomy and centre expertise make a high-quality result likely. Timing integrates symptoms, LV function/dimensions, atrial fibrillation, pulmonary pressure, flail anatomy and the probability of repair—not regurgitation grade alone.",
      anatomy: "The anterior leaflet has A1-A3 segments and the posterior P1-P3; the anterolateral and posteromedial papillary muscles support chordae. The circumflex can run close to the posterior annulus, especially near P1. The coronary sinus, conduction tissue, aortic valve and LV outflow tract constrain ring and leaflet strategy.",
      preop: ["Define the mechanism using Carpentier motion classification and segmental TEE analysis.", "Assess LV/RV function, pulmonary pressures, coronary disease and tricuspid annulus.", "Predict repairability and plan resection, neochords, ring type/size and bailout replacement.", "State how the team will test competence and screen for systolic anterior motion."],
      steps: [
        { title: "Exposure", text: "Establish CPB and arrest, then expose through the interatrial groove or selected approach with careful atrial retraction.", why: "Poor exposure causes imprecise leaflet analysis and dangerous annular bites." },
        { title: "Valve analysis", text: "Inspect each segment, chord, commissure and annulus; use saline testing and traction to reproduce the mechanism.", why: "Repair the lesion, not the echocardiographic label." },
        { title: "Correct leaflet pathology", text: "Use limited resection, folding, sliding plasty or neochords according to lesion and tissue; preserve mobility and adequate coaptation height.", why: "Over-resection trades MR for stenosis and increases tension." },
        { title: "Respect danger structures", text: "Take annular bites under direct vision, particularly along the posterior annulus, avoiding deep circumflex injury and adjacent aortic structures.", why: "New lateral-wall ischemia after repair may be iatrogenic circumflex compromise." },
        { title: "Annuloplasty", text: "Size and implant a complete or selected ring/band that restores geometry without forcing an undersized anterior-posterior dimension.", why: "The ring stabilizes the repair but can provoke stenosis or SAM if poorly chosen." },
        { title: "Test the repair", text: "Fill the ventricle and inspect the coaptation line, residual jets and leaflet symmetry; revise visible defects before atrial closure.", why: "A marginal saline test rarely improves after bypass." },
        { title: "TEE challenge", text: "After separation, assess residual MR, transmitral gradient, regional function and SAM across physiologic loading conditions.", why: "SAM is dynamic; an empty hypercontractile ventricle exaggerates it." },
        { title: "Treat SAM by mechanism", text: "Reduce inotropy, restore preload and increase afterload first; if significant obstruction/MR persists, revise the repair.", why: "More inotrope worsens anterior leaflet-septal interaction." },
        { title: "Close with a repair statement", text: "Handover the exact lesion, repair components, residual findings and rhythm plan.", why: "Postoperative imaging and management require knowing what was changed." }
      ],
      numbers: ["Primary MR timing uses symptoms, LV function/dimensions and other triggers; verify current guideline thresholds in the full valve guideline.", "A competent repair needs a broad, stable coaptation surface without important stenosis.", "Transmitral gradient must be interpreted at the measured heart rate and flow.", "SAM management follows physiology: volume, afterload and less inotropy before revision when appropriate."],
      complications: ["Residual MR: localize the jet and mechanism; technical lesions should be revised.", "SAM/LVOT obstruction: correct loading and inotropy, then reassess repair geometry.", "Circumflex injury: suspect with new lateral dysfunction or ischemia; diagnose and restore flow urgently.", "Mitral stenosis: recognize an undersized ring, restricted leaflet or high gradient in context."],
      postop: ["Maintain rhythm and loading compatible with the repaired valve and ventricle.", "Document baseline postoperative gradient, residual MR and ventricular function.", "New ischemia, hemolysis or pulmonary edema requires early repair-focused imaging."],
      evidence: "Repair quality and institutional durability matter. Guidelines favour repair over replacement for severe degenerative primary MR when a successful durable repair is expected.",
      viva: ["Describe Carpentier type II disease.", "How do you manage SAM after repair?", "Why can the circumflex be injured?", "What makes a repair durable?", "When should a technically imperfect repair be revised?"],
      sources: ["2020 ACC/AHA Valvular Heart Disease Guideline", "EVEREST II and contemporary repair literature summaries"]
    },
    {
      id: "type-a", title: "Acute Type A Dissection Repair", category: "Aorta", day: 9,
      difficulty: "Chief resident", minutes: 42,
      orientation: "Acute type A dissection is a tear involving the ascending aorta; emergency surgery removes or excludes the proximal tear, prevents rupture and restores true-lumen organ perfusion.",
      indication: "Ascending involvement defines type A and ordinarily mandates immediate operative repair, including when renal, mesenteric or limb malperfusion is present. The operation is individualized to entry tear, root destruction, valve pathology, arch disease, malperfusion and patient condition.",
      anatomy: "Dissection creates true and false lumens within the aortic media. It may compromise coronary ostia, cause aortic regurgitation, rupture into pericardium or obstruct head, visceral, renal or limb vessels. The root, sinotubular junction, arch branches and distal true lumen determine cannulation, cerebral protection and reconstruction.",
      preop: ["Activate the aortic, anesthesia, perfusion, blood bank and ICU teams immediately.", "Review gated CT of the entire aorta for entry tear, root/arch involvement, branch-vessel perfusion and access.", "Control impulse and pain without delaying surgery; use invasive monitoring appropriate to perfusion concerns.", "Plan cannulation, temperature, cerebral protection, root strategy and extent before incision while preserving flexibility."],
      steps: [
        { title: "Safe inflow", text: "Choose axillary, central or femoral inflow according to anatomy and expertise, with a method to confirm true-lumen perfusion.", why: "False-lumen perfusion can worsen malperfusion or rupture." },
        { title: "Establish CPB and cool", text: "Obtain venous drainage, vent the heart and cool to the cerebral-protection strategy while monitoring organ perfusion.", why: "Cooling buys ischemic tolerance but adds coagulopathy and rewarming burden." },
        { title: "Protect the heart", text: "Control the proximal aorta as feasible and deliver cardioplegia by a route that actually reaches both coronaries.", why: "Coronary dissection or severe AR can make routine root delivery ineffective." },
        { title: "Open and define", text: "Inspect the root and ascending aorta, identify the primary tear when possible, and assess coronary ostia, valve commissures and tissue integrity.", why: "The reconstruction must treat the lesion rather than merely replace a convenient segment." },
        { title: "Cerebral protection", text: "At circulatory arrest, institute the planned antegrade cerebral perfusion or alternative strategy and verify delivery.", why: "Cannula presence is not proof of cerebral perfusion." },
        { title: "Open distal repair", text: "Resect diseased ascending aorta and perform an open distal anastomosis, extending to hemiarch or more when the tear/pathology demands it.", why: "The 2022 guideline recommends an open distal anastomosis in type A repair." },
        { title: "Root decision", text: "Resuspend a structurally normal valve when feasible; replace the root when destruction, root aneurysm or genetic disease makes preservation unsafe.", why: "The operation balances immediate survival with durability and coronary/root complexity." },
        { title: "Restore flow and rewarm", text: "De-air, re-establish antegrade systemic perfusion, rewarm carefully and reassess all previously malperfused territories.", why: "Central repair may restore dynamic obstruction, but static branch compromise can persist." },
        { title: "Hemostasis and separation", text: "Correct surgical bleeding, temperature, coagulation and ventricular dysfunction systematically; avoid blind sutures into fragile tissue.", why: "Coagulopathy and tissue failure are expected hazards, not surprises." }
      ],
      numbers: ["Every ascending-aorta dissection is Stanford type A regardless of distal extent.", "2022 ACC/AHA guidance recommends immediate operative repair, including with renal, mesenteric or lower-extremity malperfusion.", "Temperature and cerebral-perfusion flow targets are protocol-specific and must be stated in the team brief.", "Post-repair surveillance commonly uses CT or MRI at 1, 6 and 12 months, then annually if stable when residual disease remains."],
      complications: ["Persistent malperfusion: reassess true-lumen expansion and branch anatomy; central repair may not resolve static obstruction.", "Coronary malperfusion: identify ostial disruption or false-lumen compression and repair/revascularize promptly.", "Neurologic injury: verify cerebral perfusion, temperature, embolic protection and postoperative neurologic assessment.", "Refractory bleeding: distinguish anastomotic bleeding from diffuse coagulopathy and correct both without delay."],
      postop: ["Perform and document an early neurologic and limb/abdominal perfusion examination.", "Control blood pressure according to the repair and residual dissection strategy.", "Trend lactate, renal function, liver markers and pulses for persistent malperfusion.", "Create an explicit lifelong surveillance and family/genetic evaluation plan where indicated."],
      evidence: "The 2022 ACC/AHA aortic guideline recommends immediate repair for acute type A dissection, open distal anastomosis, valve resuspension when leaflets are suitable, and root replacement when destruction, aneurysm or genetic disease requires it.",
      viva: ["How do you confirm true-lumen perfusion?", "When is valve resuspension preferred?", "Why perform an open distal anastomosis?", "What if mesenteric malperfusion persists after central repair?", "How do you protect the brain?"],
      sources: ["2022 ACC/AHA Aortic Disease Guideline", "Adult aortic surgery reference set"]
    }
  ];

  const practice = {
    sternotomy: {
      cards: [
        ["What is the deepest structure most vulnerable during primary sternotomy?", "The right ventricular free wall lies immediately behind the lower sternum; adhesions make it even more vulnerable in re-entry."],
        ["Why review CT before redo sternotomy?", "To map the distance from posterior sternum to RV, aorta and grafts and to plan peripheral rescue access."],
        ["Why does a midline saw cut matter?", "Equal hemisternums distribute closure force; a lateral cut weakens bone and promotes instability."],
        ["Where are the internal thoracic arteries?", "They run vertically just lateral to the sternal edge and can be injured by lateral dissection or closure."],
        ["What makes sternal closure high quality?", "Stable symmetric approximation, sound bone purchase, correct drain/wire position, hemostasis and minimal dead space."],
        ["What should happen before a hostile redo incision?", "The team agrees on rescue cannulation, blood, monitoring and how bypass will be established if entry causes injury."]
      ],
      questions: [
        ["During redo sternotomy, brisk dark bleeding occurs as the posterior table is divided. What is the best immediate response?", ["Continue the saw rapidly, then inspect once exposure is complete", "Stop, compress, communicate and activate the rescue pathway", "Pack the skin incision and transfer without defining the injury", "Give protamine immediately before surgical control"], 1, "Uncontrolled continuation enlarges a likely RV or venous injury. Compression, communication and the planned rescue route come first."],
        ["The saw drifts markedly left of midline. Why does this matter most?", ["It lengthens the skin scar and makes later dressing difficult", "It creates unequal hemisternums and compromises stable closure", "It guarantees injury to a previously harvested mammary artery", "It prevents safe opening of the pericardium later in the case"], 1, "Mechanical stability depends on adequate bone on both sides."],
        ["Which preoperative finding most changes redo entry planning?", ["Sinus rhythm with a normal PR interval on the preoperative ECG", "A patent graft plastered against the posterior sternum", "Mild anemia that has already been typed and crossmatched", "A small stable pleural effusion without respiratory compromise"], 1, "A graft on the sternum is a direct entry hazard and may require peripheral control/support planning."],
        ["A sternal half fractures during closure. What is the best principle?", ["Tighten the usual wires harder until the fragments stop moving", "Modify fixation to achieve stable load distribution", "Accept mobility because soft-tissue closure will provide stability", "Remove all drains so no device crosses the unstable closure"], 1, "Forcing wires through fractured bone worsens cut-through; fixation must match bone quality."],
        ["Why is wide prep important for cardiac sternotomy?", ["It improves scar cosmesis by changing the resting skin tension", "It preserves conduit harvest and emergency access options", "It lowers the required heparin dose before cannulation", "It replaces antibiotic redosing during a prolonged operation"], 1, "Wide preparation preserves rescue and conduit options."]
      ]
    },
    bypass: {
      cards: [
        ["What are the six causes of failure to separate from CPB?", "Preload, pump function, rhythm, afterload, surgical result and mechanical obstruction; classify before escalating therapy."],
        ["What can high arterial line pressure after starting CPB mean?", "Cannula malposition, obstruction, small cannula, kink or aortic dissection; reduce flow and investigate."],
        ["Why is MAP alone insufficient on CPB?", "Organ oxygen delivery also depends on pump flow, hemoglobin and saturation."],
        ["What must be complete before aortic cannulation?", "Systemic heparinization and confirmation of the local ACT target."],
        ["What suggests post-bypass RV failure?", "Dilated poorly contracting RV, high CVP, low LV filling, rising pulmonary pressures and hypotension."],
        ["What is the safe response to severe protamine collapse?", "Stop protamine, call it out, support circulation/pulmonary pressure and prepare to re-heparinize and resume CPB."]
      ],
      questions: [
        ["During initiation of CPB, arterial line pressure abruptly rises and the ascending aorta becomes blue and tense. What next?", ["Increase pump flow until the target indexed flow is reached", "Stop flow and assess cannula position and aortic dissection", "Give protamine to reverse the anticoagulation immediately", "Apply the cross-clamp distal to the expanding blue segment"], 1, "This is a malperfusion/dissection signal; more flow can extend injury."],
        ["TEE during separation shows a small hyperdynamic LV and underfilled RV. Which first move best fits the physiology?", ["Add inotrope to increase already vigorous ventricular contraction", "Restore venous return and reassess filling", "Insert an IABP before correcting the loading condition", "Administer protamine before separation is physiologically stable"], 1, "The primary phenotype is underfilling, not contractile failure."],
        ["After separation, the RV dilates while LV filling falls and PA pressure rises. What is the key diagnosis?", ["Isolated vasoplegia with preserved biventricular filling", "RV failure with high pulmonary afterload", "Simple hypovolemia without ventricular pressure overload", "Dynamic LVOT obstruction with an overfilled left ventricle"], 1, "The coupled TEE and pressure findings identify RV-pulmonary vascular failure."],
        ["Why correct temperature before separation?", ["Temperature changes the tensile strength of every cardiac suture", "Hypothermia impairs rhythm, coagulation and response", "Normothermia prevents every form of post-bypass vasoplegia", "Rewarming alone guarantees a normal potassium concentration"], 1, "Normothermia is a prerequisite, not a cosmetic endpoint."],
        ["Severe pulmonary hypertension and collapse begin during protamine. Best first action?", ["Finish the remaining protamine rapidly to complete reversal", "Stop protamine and activate the rescue pathway", "Remove pacing wires to prevent ventricular irritability", "Give more heparin silently before alerting the operative team"], 1, "Stop the trigger, support circulation and prepare for CPB rescue."]
      ]
    },
    cabg: {
      cards: [
        ["Why is LIMA-to-LAD the anchor graft?", "It combines favorable endothelial biology and excellent long-term patency with survival benefit."],
        ["What factors define a good distal target?", "Significant upstream stenosis, adequate diameter, healthy landing zone, good distal runoff and viable myocardium."],
        ["Why can an arterial graft fail from competitive flow?", "Native flow through a moderate stenosis reduces graft flow and can lead to spasm or closure."],
        ["What must be checked before leaving after CABG?", "Regional wall motion, graft lie without twist/tension, hemodynamics and graft flow by the local verification method."],
        ["What favors CABG in diabetes?", "Operable patients with diabetes and triple-vessel disease generally benefit from surgical revascularization in guideline decision-making."],
        ["What causes new ST elevation after CABG?", "Air, graft twist/kink, spasm, technical anastomotic failure, coronary injury or incomplete revascularization until proven otherwise."]
      ],
      questions: [
        ["A radial graft is planned to a 50% RCA lesion. What is the main concern?", ["Excessive ACT", "Competitive flow and graft failure", "Mitral stenosis", "Venous air lock"], 1, "Arterial grafts need sufficiently severe native stenosis to avoid competitive flow."],
        ["After filling the heart, a vein graft bends sharply near the RV. Best response?", ["Ignore it because it was straight when empty", "Revise the length or route before leaving", "Increase inotrope", "Give protamine first"], 1, "Graft geometry must be assessed on the filled beating heart."],
        ["Which conduit is guideline-preferred for the second most important severely stenosed target?", ["Radial artery", "Any vein regardless of quality", "Synthetic graft", "Femoral vein"], 0, "The 2021 ACC/AHA/SCAI guideline prefers radial artery over saphenous vein in this setting."],
        ["New inferior ischemia appears immediately after unclamping. Which mechanism is especially plausible?", ["Air entering the RCA", "Sternal infection", "Late vein degeneration", "Pericarditis"], 0, "Root air can preferentially enter the right coronary ostium and cause acute RV/inferior ischemia."],
        ["A patient with significant left-main disease and complex anatomy is operable. Which principle is strongest?", ["Heart Team review with CABG for survival benefit", "PCI is always mandatory", "Medical therapy always replaces revascularization", "Age alone decides"], 0, "Guidelines support CABG for significant left-main disease while patient anatomy and preferences remain central."]
      ]
    },
    savr: {
      cards: [
        ["Why can SAVR cause complete heart block?", "The conduction axis runs beneath the noncoronary/right-coronary commissural region near the membranous septum."],
        ["What is patient-prosthesis mismatch?", "The implanted valve's effective orifice is too small for the patient's body size, leaving an excessive gradient."],
        ["What generally favors SAVR in the 2020 ACC/AHA framework?", "Age under 65 or life expectancy over 20 years, non-transfemoral anatomy, or anatomy/indications better treated surgically."],
        ["Why debride annular calcium carefully?", "Too little promotes leak; too deep risks annular rupture, conduction injury or aortomitral curtain damage."],
        ["What can cause new RV failure after unclamping in SAVR?", "Air or obstruction at the right coronary ostium, ischemia, inadequate protection or pulmonary/RV loading problems."],
        ["What must TEE confirm after SAVR?", "Valve seating and motion, gradient, absence of significant paravalvular leak, coronary/ventricular function and de-airing."]
      ],
      questions: [
        ["After SAVR the patient is pacing-dependent with no AV conduction. What structure was most likely injured?", ["The sinoatrial node at the superior vena cava-right atrial junction", "The conduction axis by the membranous septum", "The left phrenic nerve along the lateral pericardium", "The coronary sinus within the posterior atrioventricular groove"], 1, "The AV bundle is vulnerable under the non/right commissural region."],
        ["TEE shows a major paravalvular jet immediately after implantation. Best principle?", ["Accept the leak if systemic pressure is temporarily maintained", "Define the mechanism and revise important technical leak", "Increase afterload alone and avoid inspecting the prosthesis", "Remove the pacing wires before repeat imaging of the valve"], 1, "Important technical PVL should be corrected in the operating room."],
        ["A fit 58-year-old with severe AS asks about TAVI. Which factor favors SAVR?", ["Longevity beyond 20 years", "Transfemoral access", "Age over 80", "Prohibitive surgery risk"], 0, "The 2020 guideline generally favors SAVR in younger patients with long life expectancy."],
        ["The prosthesis appears seated but one leaflet is immobile. What next?", ["Leave the operating room because seating alone confirms function", "Inspect and correct a trapped suture or obstruction", "Give a loop diuretic and repeat imaging after extubation", "Ignore leaflet motion if the current mean arterial pressure is normal"], 1, "Mechanical leaflet obstruction is immediately dangerous and correctable."],
        ["Why can an empty hyperdynamic LV mislead post-SAVR assessment?", ["It exaggerates dynamic gradients", "It always causes PVL", "It lowers ACT", "It proves coronary obstruction"], 0, "Loading and flow conditions alter gradients and must be normalized for interpretation."]
      ]
    },
    "mitral-repair": {
      cards: [
        ["What does Carpentier type II mean?", "Excess leaflet motion or prolapse, commonly from chordal elongation or rupture."],
        ["What are the first physiologic treatments for SAM?", "Increase preload, increase afterload and reduce inotropy; then reassess the repair."],
        ["Which coronary artery is at risk near the posterior mitral annulus?", "The circumflex, particularly near the lateral/P1 region depending on dominance and anatomy."],
        ["Why use an annuloplasty ring?", "To restore and stabilize annular geometry and protect leaflet repair durability."],
        ["What makes a good repair on TEE?", "Minimal residual MR, acceptable gradient, broad coaptation, no SAM, preserved ventricular and coronary function."],
        ["Why avoid over-resection of posterior leaflet?", "It reduces tissue/coaptation, increases tension and can create stenosis or poor geometry."]
      ],
      questions: [
        ["After repair, hypotension worsens with inotrope; TEE shows SAM and LVOT obstruction. Best first strategy?", ["More inotrope", "Volume, afterload and less inotropy", "Immediate protamine", "IABP inflation in systole"], 1, "SAM is intensified by a small hypercontractile ventricle and low afterload."],
        ["New lateral LV dysfunction appears after posterior annular sutures. What must be excluded?", ["Circumflex injury", "Aortic dissection only", "Sternal fracture", "Venous air lock"], 0, "The circumflex may lie close to the posterior annulus."],
        ["What should guide repair technique?", ["MR grade alone", "Segmental mechanism and tissue analysis", "Surgeon preference without valve analysis", "Ring size alone"], 1, "Repair the lesion identified by systematic analysis."],
        ["A high transmitral gradient is seen at a heart rate of 130. What is the correct interpretation principle?", ["Gradient is flow and rate dependent", "It always proves severe fixed stenosis", "Heart rate is irrelevant", "It proves circumflex injury"], 0, "Rate and flow must be considered before judging the repair."],
        ["Saline testing shows a large residual central gap. Best next step?", ["Close the atrium and hope", "Correct the repair mechanism", "Give vasopressor", "Remove the ring without analysis"], 1, "A visible mechanical defect should be corrected while exposure is available."]
      ]
    },
    "type-a": {
      cards: [
        ["What defines Stanford type A dissection?", "Any involvement of the ascending aorta, regardless of distal extent."],
        ["Why does arterial cannulation site matter?", "Inflow must perfuse the true lumen; false-lumen flow can worsen malperfusion or rupture."],
        ["When is valve resuspension preferred?", "When leaflets are suitable and there is no major root destruction, aneurysm or genetic indication for replacement."],
        ["Why use an open distal anastomosis?", "It permits resection/inspection of diseased distal tissue and is recommended in acute type A repair."],
        ["What if malperfusion persists after central repair?", "Reassess for static branch obstruction or inadequate true-lumen expansion and treat the residual lesion urgently."],
        ["What are the first postoperative priorities?", "Neurologic assessment, bleeding, perfusion of every threatened organ, blood pressure control and residual-dissection planning."]
      ],
      questions: [
        ["CTA shows dissection from the root to iliacs with renal malperfusion. Classification and strategy?", ["Type B disease treated first with anti-impulse therapy alone", "Type A disease requiring immediate repair and malperfusion planning", "Isolated intramural hematoma suitable for discharge without surveillance", "Chronic aneurysm for routine elective clinic review in several months"], 1, "Ascending involvement makes it type A; malperfusion does not remove the need for immediate repair."],
        ["After femoral inflow begins, radial pressures fall and TEE shows a compressed true lumen. Best response?", ["Increase femoral flow until the radial arterial trace returns", "Stop and restore true-lumen perfusion", "Give protamine immediately while the circuit remains connected", "Close the chest and reassess organ perfusion in the intensive care unit"], 1, "This is likely false-lumen perfusion; higher flow can extend it."],
        ["The root is intact and valve leaflets are normal but commissures are detached. Guideline-consistent root strategy?", ["Valve resuspension when feasible", "Mandatory mechanical root replacement in every patient", "Transcatheter valve implantation across the dissected root", "No valve or commissural repair before completing the graft"], 0, "Valve resuspension is preferred when leaflets are suitable and root destruction is absent."],
        ["Why can mesenteric ischemia persist after ascending repair?", ["A static branch-vessel obstruction may remain", "Central repair reliably cures both dynamic and static obstruction", "The bypass ACT remains high during the early postoperative period", "The open sternum mechanically restricts mesenteric arterial inflow"], 0, "Dynamic obstruction may improve, while fixed branch dissection/thrombosis can persist."],
        ["Which postoperative plan is essential with residual dissection?", ["No imaging when pain and pulse examination have normalized", "Structured cross-sectional surveillance and pressure control", "End all aortic follow-up after the index hospital discharge", "Use exercise testing alone to monitor false-lumen remodeling"], 1, "Residual aortic disease requires lifelong surveillance." ]
      ]
    }
  };

  let questionOrdinal = 0;
  operations.forEach(function (op) {
    const p = practice[op.id];
    op.flashcards = p.cards;
    op.questions = p.questions.map(function (q) {
      const target = questionOrdinal++ % q[1].length;
      const shift = (q[2] - target + q[1].length) % q[1].length;
      const options = q[1].slice(shift).concat(q[1].slice(0, shift));
      return { stem: q[0], options: options, answer: target, explain: q[3] };
    });
  });

  window.CS_ADVANCED = {
    reviewed: "2026-07-09",
    operations: operations,
    labs: [
      { id: "pv-loop", title: "Pressure–Volume Loop Lab", subtitle: "Manipulate preload, afterload and contractility; compare AS, AR, MR and tamponade." },
      { id: "oxygen-delivery", title: "CPB Oxygen Delivery Lab", subtitle: "See why pump flow, hemoglobin and saturation matter more than MAP alone." },
      { id: "valve", title: "Valve Hemodynamics Lab", subtitle: "Use Bernoulli and continuity relationships to reason through gradients and valve area." },
      { id: "shock", title: "Post-bypass Shock Cockpit", subtitle: "Separate pump failure, vasoplegia, RV failure and tamponade using coupled signals." }
    ],
    crises: /* 14 branched crisis-room cases — one per day of the plan. Node schema:
         { q, v?, opts:[{a,to,k,r}] } for a decision or { end,t,r } for an outcome.
         k = good | ok | bad | fail. Optimal (all-good) path >= 7 decisions; wrong
         picks branch to pitfalls/recoveries. Data shaped by tools/pipeline; see
         DAY plan wiring in card-catalog.js and app.js. */
      [
        {
          "id": "cr-d1",
          "day": 1,
          "title": "The Hostile Re-entry",
          "setting": "OR · redo sternotomy for redo mitral surgery",
          "brief": "A prior-CABG patient is draped for redo mitral surgery. The CT is on the screen and the saw is in your hand.",
          "vitals": [
            [
              "HR",
              "78"
            ],
            [
              "BP",
              "118/70"
            ],
            [
              "Rhythm",
              "SR"
            ],
            [
              "Temp",
              "36.4"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "Before you touch the sternum, which CT finding most reshapes the entry?",
              "v": [
                [
                  "HR",
                  "78"
                ],
                [
                  "BP",
                  "118/70"
                ],
                [
                  "Rhythm",
                  "SR"
                ],
                [
                  "Prep",
                  "chest"
                ]
              ],
              "opts": [
                {
                  "a": "LIMA and RV behind the sternum",
                  "to": "n2",
                  "k": "good",
                  "r": "You name the adherent graft and RV as the re-entry hazard — the plan now begins before the skin."
                },
                {
                  "a": "A 3.4 cm ascending aorta",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A worth-noting number, but it is not the structure that will bleed the instant the saw goes through here."
                },
                {
                  "a": "Mild bilateral pleural effusions",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Effusions do not change how you get safely through a hostile posterior table."
                }
              ]
            },
            "n1b": {
              "q": "The scrub nurse asks how you want the groin. What is the real question you have missed?",
              "opts": [
                {
                  "a": "Nothing — proceed with a standard re-entry and deal with problems as they arise",
                  "to": "eDead",
                  "k": "fail",
                  "r": "The saw enters the RV with no bypass available; exsanguination outpaces improvised cannulation."
                },
                {
                  "a": "Whether peripheral vessels are exposed and ready for rescue bypass before you divide bone",
                  "to": "n2",
                  "k": "good",
                  "r": "Correct — you catch the omission. In a hostile chest, the rescue route must exist before the injury can."
                }
              ]
            },
            "n2": {
              "q": "What must be established BEFORE the sternal wire cuts begin?",
              "opts": [
                {
                  "a": "Full heparinisation now, then open",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Heparin before you control the field turns any entry bleed into a catastrophe."
                },
                {
                  "a": "External defibrillator pads on and cross-matched blood in the room",
                  "to": "n3",
                  "k": "ok",
                  "r": "Sensible and necessary, but it is the pre-positioned peripheral access that actually saves a torn RV."
                },
                {
                  "a": "Expose femoral vessels for rescue cannulation",
                  "to": "s1",
                  "k": "good",
                  "r": "The rescue circuit is prepared. If the RV is torn on entry, you can be on bypass in a minute."
                }
              ]
            },
            "n3b": {
              "q": "You are heparinised and the sternum is not yet open. What now?",
              "opts": [
                {
                  "a": "Rush the sternotomy to get access before the heparin peaks",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Haste plus anticoagulation is exactly the combination that kills on re-entry."
                },
                {
                  "a": "Slow down, expose the groin and keep the divided posterior table under direct vision",
                  "to": "n4",
                  "k": "good",
                  "r": "You regain a margin of safety despite the anticoagulation."
                }
              ]
            },
            "n3": {
              "q": "How do you divide the posterior table over an adherent RV?",
              "opts": [
                {
                  "a": "Drive the standard saw fully through in one pass to be quick",
                  "to": "eDead",
                  "k": "fail",
                  "r": "A single deep pass lacerates the RV and the graft at once."
                },
                {
                  "a": "Saw anteriorly; dissect the posterior table under vision",
                  "to": "n4",
                  "k": "good",
                  "r": "Controlled division keeps the blade off the adherent chamber."
                },
                {
                  "a": "Lever the retractor open hard to break the adhesions",
                  "to": "n3c",
                  "k": "bad",
                  "r": "Blind force starts to avulse the RV off the sternum."
                }
              ]
            },
            "n3c": {
              "q": "Dark blood wells up from behind the sternum. First move?",
              "opts": [
                {
                  "a": "Pack and keep prying the sternum apart to see better",
                  "to": "eDead",
                  "k": "fail",
                  "r": "You extend the tear while the patient exsanguinates."
                },
                {
                  "a": "Compress, alert, and start peripheral bypass",
                  "to": "n5",
                  "k": "good",
                  "r": "Tamponade the hole, mobilise the pump and repair on a decompressed heart."
                }
              ]
            },
            "n4": {
              "q": "The heart is exposed. Adhesions still tether the RV and a graft crosses the field. Dissection principle?",
              "opts": [
                {
                  "a": "Dissect on bone and identify the LIMA",
                  "to": "s2",
                  "k": "good",
                  "r": "Keeping on bone and finding the pedicle protects both the chamber and the anterior circulation."
                },
                {
                  "a": "Sweep adhesions bluntly and quickly to save time",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Blunt sweeping tents the RV and threatens the unseen graft."
                },
                {
                  "a": "Cauterise widely through the adhesions",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Diathermy near an unidentified LIMA risks occluding the anterior supply."
                }
              ]
            },
            "n4b": {
              "q": "The anterior wall shows a new dusky patch — the LIMA territory. What happened and what now?",
              "opts": [
                {
                  "a": "Press on with the mitral exposure and reassess later",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Ignoring an injured LIMA leaves the anterior wall to infarct."
                },
                {
                  "a": "Start bypass and restore anterior coronary flow",
                  "to": "n5",
                  "k": "good",
                  "r": "You recognise iatrogenic anterior ischaemia and rescue the graft."
                }
              ]
            },
            "n5": {
              "q": "You are safely on bypass with the field controlled. Final anatomical checkpoint before the mitral work?",
              "opts": [
                {
                  "a": "Verify LIMA integrity and cannula clearance",
                  "to": "eGood",
                  "k": "good",
                  "r": "A clean, protected field — you earned the operation you came to do."
                },
                {
                  "a": "Assume all grafts are fine now that bleeding has stopped",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "You proceed and the patient survives, but an unverified graft is a gap you should not leave."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Clean re-entry",
              "r": "You anticipated the hazard, pre-positioned rescue perfusion, entered under control and protected the LIMA. The mitral operation begins on a safe field."
            },
            "eAlive": {
              "end": "alive",
              "t": "Survived, with loose ends",
              "r": "The patient is on bypass and stable, but you left the field with assumptions rather than confirmation. Recognition of the hazard came late."
            },
            "eHarm": {
              "end": "harm",
              "t": "Avoidable anterior infarct",
              "r": "The re-entry itself was survived, but an unprotected LIMA cost the anterior wall. The injury was in the entry plan, not the mitral valve."
            },
            "eDead": {
              "end": "dead",
              "t": "Exsanguination on entry",
              "r": "The lethal event of a redo sternotomy is uncontrolled entry into an adherent chamber with no rescue circuit ready. That decision was made before the skin was cut."
            },
            "s1": {
              "q": "You brief the team on the danger zone. What is the single most useful thing to say?",
              "opts": [
                {
                  "a": "RV and LIMA behind sternum; prepare groin rescue",
                  "to": "n3",
                  "k": "good",
                  "r": "A shared mental model of exactly where the hazard is prevents a blind, hurried entry."
                },
                {
                  "a": "Nothing specific — the team will see the anatomy once the chest is open",
                  "to": "n1b",
                  "k": "bad",
                  "r": "By the time the chest is open, an unbriefed team is reacting to an injury instead of preventing it."
                },
                {
                  "a": "That blood loss is unlikely, so no need to check the cross-match",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Assuming a hostile redo will not bleed is exactly how an unprepared team loses the patient."
                }
              ]
            },
            "s2": {
              "q": "Dissection is done and you are ready to cannulate. What confirms the peripheral vessels are usable right now?",
              "opts": [
                {
                  "a": "Direct exposure and inspection of the femoral vessels you prepared before incision",
                  "to": "n5",
                  "k": "good",
                  "r": "The rescue route is only real once you have confirmed the vessels are actually accessible and adequate."
                },
                {
                  "a": "Assume they are fine because you planned for them earlier",
                  "to": "n4b",
                  "k": "bad",
                  "r": "A planned access site is not a confirmed one; unexamined vessels can be diseased or small."
                }
              ]
            }
          },
          "summary": "Redo sternotomy kills at the moment of entry, not during the planned repair. Cross-sectional imaging tells you what is stuck to the back of the sternum; a patent graft and the right ventricle millimetres from the saw demand that peripheral rescue access exist before you divide bone. Enter under vision, find and protect the LIMA, and only then do the operation you came to do.",
          "keyPoints": [
            "Read the redo CT for what touches the posterior sternal table — RV, aorta, patent grafts — before any incision.",
            "In a hostile chest, expose femoral vessels for rescue bypass BEFORE dividing the sternum.",
            "Divide the anterior table with the oscillating saw, then lift and cut the posterior table under direct vision.",
            "Identify and protect the LIMA pedicle before dividing or cauterising adhesions.",
            "If a chamber is torn: finger control, go on the prepared peripheral bypass, repair decompressed — do not pry for exposure."
          ],
          "links": [
            [
              "Day 1 circuit",
              "#/day/1"
            ],
            [
              "Median sternotomy module",
              "#/surgery/sternotomy"
            ],
            [
              "Pericardial access & re-entry anatomy",
              "#/anatomy/cham-pericardial-access"
            ]
          ]
        },
        {
          "id": "cr-d2",
          "day": 2,
          "title": "The Pump Will Not Fill",
          "setting": "OR · minutes after initiating CPB",
          "brief": "You have just gone onto bypass. The venous return falls, the reservoir level is dropping and the perfusionist calls out low volume.",
          "vitals": [
            [
              "Pump flow",
              "4.2 L/m"
            ],
            [
              "Reservoir",
              "falling"
            ],
            [
              "MAP",
              "58"
            ],
            [
              "SvO2",
              "72"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "The reservoir is emptying. What is the first response?",
              "v": [
                [
                  "Flow",
                  "4.2 L/m"
                ],
                [
                  "Reservoir",
                  "low"
                ],
                [
                  "MAP",
                  "58"
                ],
                [
                  "CVP",
                  "rising"
                ]
              ],
              "opts": [
                {
                  "a": "Increase arterial flow to keep the MAP up",
                  "to": "eAir",
                  "k": "fail",
                  "r": "Pumping out of an emptying reservoir entrains massive air into the arterial line."
                },
                {
                  "a": "Give volume from the cell-saver blindly and press on",
                  "to": "n1b",
                  "k": "bad",
                  "r": "You buy seconds, but the mechanical cause is still unaddressed and the reservoir keeps falling."
                },
                {
                  "a": "Reduce arterial pump flow and inspect the venous drainage pathway",
                  "to": "n2",
                  "k": "good",
                  "r": "You protect the reservoir from running dry while you find the drainage problem."
                }
              ]
            },
            "n1b": {
              "q": "Volume did not fix it — the reservoir is still low. Now what?",
              "opts": [
                {
                  "a": "Reduce flow and inspect venous return",
                  "to": "n2",
                  "k": "good",
                  "r": "You return to the disciplined drainage check that should have come first."
                },
                {
                  "a": "Keep transfusing to outrun the leak",
                  "to": "eAir",
                  "k": "fail",
                  "r": "You never find the kink, and the reservoir empties into the arterial line."
                }
              ]
            },
            "n2": {
              "q": "What is the differential for poor venous return this early?",
              "opts": [
                {
                  "a": "Oxygenator failure",
                  "to": "n2b",
                  "k": "bad",
                  "r": "An oxygenator problem shows as gas-exchange failure, not an empty reservoir; you are looking in the wrong place."
                },
                {
                  "a": "Line kink, cannula malposition or side-holes against the caval wall, air-lock, or the table/heart position obstructing drainage",
                  "to": "s1",
                  "k": "good",
                  "r": "A complete mechanical differential — now you can work through it."
                },
                {
                  "a": "Protamine reaction",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Protamine is given coming OFF bypass, not going on — this cannot be it."
                }
              ]
            },
            "n2b": {
              "q": "That lead went nowhere and the reservoir is still low. Refocus on what?",
              "opts": [
                {
                  "a": "Check the venous cannula and line",
                  "to": "n3",
                  "k": "good",
                  "r": "You get back to the actual mechanical drainage problem."
                },
                {
                  "a": "Change the oxygenator mid-run",
                  "to": "eDead",
                  "k": "fail",
                  "r": "You disrupt a working circuit chasing a phantom while the patient is under-perfused."
                }
              ]
            },
            "n3": {
              "q": "The venous line chatters and the return improves when the cannula is withdrawn 1 cm. What was it?",
              "opts": [
                {
                  "a": "The patient was simply hypovolaemic",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Hypovolaemia would not resolve with a 1 cm cannula pull — the position was the problem."
                },
                {
                  "a": "Cannula side-holes against the wall",
                  "to": "s2",
                  "k": "good",
                  "r": "Over-insertion occluded the side-holes — the classic position-dependent chatter."
                }
              ]
            },
            "n3b": {
              "q": "You treated it as hypovolaemia and it recurs the moment you restore flow. Reconsider?",
              "opts": [
                {
                  "a": "Reposition and secure the cannula",
                  "to": "n4",
                  "k": "good",
                  "r": "You accept the mechanical explanation the response to withdrawal already proved."
                },
                {
                  "a": "No — keep loading volume and push flow up",
                  "to": "eAir",
                  "k": "fail",
                  "r": "The positional obstruction returns and the reservoir empties dangerously."
                }
              ]
            },
            "n4": {
              "q": "Drainage is restored. Before you go back to full flow, what confirms it is safe?",
              "opts": [
                {
                  "a": "A single higher MAP reading",
                  "to": "n4b",
                  "k": "bad",
                  "r": "One downstream number cannot prove the venous side is actually draining."
                },
                {
                  "a": "A colder venous temperature",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Temperature tells you nothing about whether the reservoir will stay full at full flow."
                },
                {
                  "a": "Stable reservoir level with stable venous drainage and circuit line pressures together",
                  "to": "n5",
                  "k": "good",
                  "r": "Flow is only safe when drainage and circuit pressures are stable as a set."
                }
              ]
            },
            "n4b": {
              "q": "You restored full flow on that single sign and the reservoir dips again. Lesson?",
              "opts": [
                {
                  "a": "Verify reservoir and circuit stability",
                  "to": "n5",
                  "k": "good",
                  "r": "You adopt the multi-signal check that actually confirms recovery."
                },
                {
                  "a": "Keep pushing flow and hope it settles",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Intermittent low drainage at high flow risks air and under-perfusion."
                }
              ]
            },
            "n5": {
              "q": "Now stable at full flow. The surgeon asks for the arrest. What is the myocardial-protection priority?",
              "opts": [
                {
                  "a": "Assume the arrest is fine because the cardioplegia is running",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "It works out, but not confirming distribution is how a warm, contracting region is missed."
                },
                {
                  "a": "Cross-clamp, deliver cardioplegia, and confirm arrest and even cooling before proceeding",
                  "to": "eGood",
                  "k": "good",
                  "r": "Protection is confirmed, not assumed — the case is safely on bypass."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Bypass under control",
              "r": "You protected the reservoir, worked a proper mechanical differential, fixed a positional cannula and confirmed safe drainage before restoring flow and arresting the heart."
            },
            "eAlive": {
              "end": "alive",
              "t": "Ran, but on assumptions",
              "r": "Bypass is stable and the arrest holds, but you trusted single signals more than once. The margin was thinner than it needed to be."
            },
            "eAir": {
              "end": "harm",
              "t": "Air in the arterial line",
              "r": "Chasing MAP by pumping an emptying reservoir drove air into the systemic circuit — a preventable embolic hazard born of ignoring the reservoir."
            },
            "eDead": {
              "end": "dead",
              "t": "Circuit catastrophe",
              "r": "Abandoning the disciplined drainage check for a phantom or for brute flow lost the reservoir and the patient. Going-on-bypass problems are mechanical until proven otherwise."
            },
            "s1": {
              "q": "You start the mechanical differential. What do you inspect first and fastest?",
              "opts": [
                {
                  "a": "Send an urgent blood gas and wait for the result",
                  "to": "n2b",
                  "k": "bad",
                  "r": "A gas does not restore drainage; the reservoir is emptying while you wait."
                },
                {
                  "a": "Deepen anaesthesia in case it is awareness",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Anaesthetic depth has nothing to do with venous drainage into the reservoir."
                },
                {
                  "a": "Trace the venous line for obstruction",
                  "to": "n3",
                  "k": "good",
                  "r": "The commonest, quickest-to-fix causes are external and mechanical — check them before touching the cannula."
                }
              ]
            },
            "s2": {
              "q": "Drainage improved on withdrawal. Before you trust it, how do you secure the cannula?",
              "opts": [
                {
                  "a": "Leave it loose so you can keep adjusting it",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A loose cannula drifts; the positional obstruction returns at the worst moment."
                },
                {
                  "a": "Re-seat and secure at best drainage",
                  "to": "n4",
                  "k": "good",
                  "r": "An un-secured cannula will migrate back to the obstructing position under the drapes."
                }
              ]
            }
          },
          "summary": "Falling venous return just after going on bypass is a mechanical problem — protect the reservoir first by coming down on flow, then work a structured differential (kink, cannula malposition, side-holes on the caval wall, air-lock, heart position). Position-dependent chatter that improves on withdrawal is the classic over-insertion sign. Never restore full flow on a single downstream number; confirm reservoir, drainage and circuit pressures together.",
          "keyPoints": [
            "Emptying reservoir on CPB: reduce arterial flow first — never pump out of a dry reservoir (air embolism).",
            "Poor early venous return is mechanical: kink, malposition, side-holes on the wall, air-lock, or heart position.",
            "Chatter relieved by withdrawing the cannula 1 cm = over-insertion occluding the side-holes.",
            "Confirm recovery with reservoir + drainage + circuit pressures as a set, not one number.",
            "Only once drainage is proven do you restore full flow, cross-clamp and confirm even cardioplegic arrest."
          ],
          "links": [
            [
              "Day 2 circuit",
              "#/day/2"
            ],
            [
              "Going on & off CPB",
              "#/surgery/bypass"
            ],
            [
              "Cannulation lab",
              "#/physiology/cannulation"
            ],
            [
              "ROOBY / ROOBY-FS",
              "#/trials/rooby"
            ]
          ]
        },
        {
          "id": "cr-d3",
          "day": 3,
          "title": "Inferior Ischaemia After CABG",
          "setting": "OR · just separated from bypass after 3-vessel CABG",
          "brief": "Grafts are LIMA-LAD, SVG-OM and SVG-PDA. Minutes off pump, the inferior leads rise, the pressure falls and the RV looks sluggish on TEE.",
          "vitals": [
            [
              "MAP",
              "56"
            ],
            [
              "HR",
              "92"
            ],
            [
              "ST",
              "II/III/aVF ↑"
            ],
            [
              "RV",
              "sluggish"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "New inferior ST elevation with RV dysfunction localises to which graft territory?",
              "v": [
                [
                  "MAP",
                  "56"
                ],
                [
                  "ST",
                  "inferior ↑"
                ],
                [
                  "RV",
                  "hypokinetic"
                ],
                [
                  "CVP",
                  "14"
                ]
              ],
              "opts": [
                {
                  "a": "The LIMA-to-LAD graft",
                  "to": "n1b",
                  "k": "bad",
                  "r": "The LAD graft feeds the anterior wall — it does not explain an inferior, RV pattern."
                },
                {
                  "a": "The SVG to the PDA / RCA territory",
                  "to": "s1",
                  "k": "good",
                  "r": "Inferior leads and RV dysfunction map to the right/posterior-descending supply until proven otherwise."
                },
                {
                  "a": "Diffuse demand ischaemia — treat with a pressor and move on",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Calling a territory-specific change 'demand' abandons a reversible graft problem."
                }
              ]
            },
            "n1b": {
              "q": "You raised the pressure but the inferior ST elevation persists. Reframe?",
              "opts": [
                {
                  "a": "Add more pressor and close",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Raising afterload on an ischaemic RV worsens demand and the wall fails."
                },
                {
                  "a": "Check the RCA/PDA graft",
                  "to": "n2",
                  "k": "good",
                  "r": "You return to the graft that actually supplies the ischaemic wall."
                }
              ]
            },
            "n2": {
              "q": "Before opening anything, what is the fastest reversible cause to consider and exclude?",
              "opts": [
                {
                  "a": "Exclude air in the fresh RCA graft",
                  "to": "n3",
                  "k": "good",
                  "r": "You watch briefly for the air pattern to clear while preparing to interrogate the graft."
                },
                {
                  "a": "Prosthetic valve thrombosis",
                  "to": "n2b",
                  "k": "bad",
                  "r": "There is no valve prosthesis here; this is a coronary supply problem."
                },
                {
                  "a": "Simply accept reperfusion stunning and close",
                  "to": "n2b",
                  "k": "bad",
                  "r": "You cannot assume benign stunning while the wall is akinetic and the pressure is falling."
                }
              ]
            },
            "n2b": {
              "q": "The wall stays akinetic and the MAP keeps drifting down. What now?",
              "opts": [
                {
                  "a": "Keep waiting for spontaneous recovery",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Waiting on an evolving infarct converts a fixable graft into dead muscle."
                },
                {
                  "a": "Check graft flow and geometry",
                  "to": "n3",
                  "k": "good",
                  "r": "A persisting deficit with instability is technical until proven otherwise."
                }
              ]
            },
            "n3": {
              "q": "The change persists. What is the operative priority?",
              "opts": [
                {
                  "a": "Inspect the PDA graft flow and anastomotic geometry directly",
                  "to": "n4",
                  "k": "good",
                  "r": "A new regional wall-motion abnormality after grafting is technical until the graft is shown to be good."
                },
                {
                  "a": "Increase afterload and close without assessment",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Treating the pressure while the graft fails preserves the cause of ischaemia."
                }
              ]
            },
            "n4": {
              "q": "Graft flow to the PDA is low, and the native PDA has only a mild stenosis. What mechanism fits?",
              "opts": [
                {
                  "a": "Competitive native flow",
                  "to": "n5",
                  "k": "good",
                  "r": "A modest native stenosis competes with the graft — low measured flow without a technical defect."
                },
                {
                  "a": "Coronary-sinus steal from normal venous drainage",
                  "to": "n4b",
                  "k": "bad",
                  "r": "That is not a real mechanism; you are about to revise a graft that may be fine."
                },
                {
                  "a": "Acute thrombosis of the LIMA",
                  "to": "n4b",
                  "k": "bad",
                  "r": "The LIMA feeds the anterior wall and is not implicated in this inferior pattern."
                }
              ]
            },
            "n4b": {
              "q": "You are about to needlessly revise the graft. The flow probe and geometry look technically sound. Pause?",
              "opts": [
                {
                  "a": "Recognise competitive flow; avoid revision",
                  "to": "n5",
                  "k": "good",
                  "r": "You correctly attribute low flow to competition, not a defect."
                },
                {
                  "a": "Revise the technically-good anastomosis anyway",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but you took down a sound graft chasing a physiological, not technical, finding."
                }
              ]
            },
            "n5": {
              "q": "If instead the geometry were the problem — a kinked, over-long vein graft — what is the principle for the fix?",
              "opts": [
                {
                  "a": "Leave it — it may open with time and pressure",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "A kinked graft does not remodel open; the territory infarcts."
                },
                {
                  "a": "Revise the geometry so the graft lies without kink or tension",
                  "to": "n6",
                  "k": "good",
                  "r": "Anastomotic geometry determines patency; a kinked graft is corrected, not tolerated."
                }
              ]
            },
            "n6": {
              "q": "Flow to the inferior wall is now restored but the RV is still stunned. What completes the rescue?",
              "opts": [
                {
                  "a": "Support the stunned RV",
                  "to": "eGood",
                  "k": "good",
                  "r": "With flow restored, the injured RV needs a coordinated recovery strategy, not more afterload."
                },
                {
                  "a": "Load the RV hard with volume against a high PVR",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The RV tolerates it and recovers, but over-distending a stunned RV risks tipping it into failure."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Territory rescued",
              "r": "You localised the inferior pattern to the RCA/PDA graft, excluded transient air, found and corrected the real problem, avoided a needless revision for competitive flow, and supported the stunned RV."
            },
            "eAlive": {
              "end": "alive",
              "t": "Recovered, with cost",
              "r": "The inferior wall is reperfused and the patient survives, but a sound graft was revised or a stunned RV over-distended. The reasoning drifted from physiology."
            },
            "eHarm": {
              "end": "harm",
              "t": "Inferior infarct",
              "r": "Treating an evolving, territory-specific ischaemia as demand or stunning let a correctable graft problem become dead muscle."
            },
            "s1": {
              "q": "While you localise the territory, what do you do about the falling pressure right now?",
              "opts": [
                {
                  "a": "Drive the MAP up hard with a pure vasoconstrictor",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Raising afterload on an ischaemic RV increases demand and can worsen the failure."
                },
                {
                  "a": "Support coronary perfusion without excess afterload",
                  "to": "n2",
                  "k": "good",
                  "r": "Buy the ischaemic RV time with perfusion and rate — not with afterload that worsens its oxygen demand."
                }
              ]
            }
          },
          "summary": "A new, territory-specific ischaemic pattern after CABG is a technical graft problem until the graft is proven good — not diffuse demand and not to be medicated away with a pressor. Inferior ST elevation plus RV dysfunction maps to the RCA/PDA graft. Exclude transient air in a fresh vein graft, then interrogate flow and geometry: kinks and tension are revised, while low flow across a technically sound graft to a mildly stenosed native vessel is competitive flow, not a defect.",
          "keyPoints": [
            "Inferior ST elevation + RV dysfunction post-CABG = RCA/PDA graft territory until proven otherwise.",
            "A new regional wall-motion abnormality after grafting is technical until the graft is demonstrated to be good.",
            "Air in a fresh RCA vein graft stuns the inferior wall and recovers over minutes — watch briefly while preparing to interrogate.",
            "Low flow in a good graft to a mildly stenosed native vessel = competitive flow; do not revise a sound anastomosis.",
            "A kinked or over-long graft is revised so it lies without tension; then support the stunned RV rather than raising afterload."
          ],
          "links": [
            [
              "Day 3 circuit",
              "#/day/3"
            ],
            [
              "On-pump CABG module",
              "#/surgery/cabg"
            ],
            [
              "Pressure-volume loop lab",
              "#/physiology/pv-loop"
            ],
            [
              "STICH trial",
              "#/trials/stich"
            ]
          ]
        },
        {
          "id": "cr-d4",
          "day": 4,
          "title": "The Small Aortic Root",
          "setting": "OR · SAVR for severe aortic stenosis in a small patient",
          "brief": "A symptomatic patient with severe AS has a small annulus. A standard prosthesis is predicted to leave a small indexed effective orifice area.",
          "vitals": [
            [
              "BSA",
              "1.9"
            ],
            [
              "Annulus",
              "19 mm"
            ],
            [
              "EF",
              "55%"
            ],
            [
              "Gradient",
              "52 mmHg"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "What is the central operative risk of accepting an undersized prosthesis here?",
              "v": [
                [
                  "Annulus",
                  "19 mm"
                ],
                [
                  "Predicted iEOA",
                  "low"
                ],
                [
                  "EF",
                  "55%"
                ],
                [
                  "BSA",
                  "1.9"
                ]
              ],
              "opts": [
                {
                  "a": "Postoperative coronary vasospasm",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Vasospasm is not the mechanism of an undersized valve; you are solving the wrong problem."
                },
                {
                  "a": "New tricuspid regurgitation",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Sizing of the aortic prosthesis does not produce isolated TR."
                },
                {
                  "a": "Prosthesis-patient mismatch",
                  "to": "s1",
                  "k": "good",
                  "r": "An inadequate indexed effective orifice area leaves clinically important residual pressure overload."
                }
              ]
            },
            "n1b": {
              "q": "You have named the wrong risk. The physiology you should fear is what?",
              "opts": [
                {
                  "a": "Nothing — implant the small valve and close",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "You leave the ventricle chronically pressure-loaded behind an obstructing prosthesis."
                },
                {
                  "a": "Residual obstruction from a small valve",
                  "to": "n2",
                  "k": "good",
                  "r": "You reframe onto prosthesis-patient mismatch — the true hazard here."
                }
              ]
            },
            "n2": {
              "q": "Which strategy directly addresses the mismatch risk?",
              "opts": [
                {
                  "a": "Routinely reduce bypass flow during implantation",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Pump flow has nothing to do with a fixed postoperative orifice."
                },
                {
                  "a": "Enlarge the annulus or use a supra-annular valve",
                  "to": "s2",
                  "k": "good",
                  "r": "You improve the orifice area relative to body size — attacking the mechanism directly."
                },
                {
                  "a": "Create a small intentional paravalvular leak to 'offload' the gradient",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "A deliberate leak is haemolysis and regurgitation, not a solution to obstruction."
                }
              ]
            },
            "n2b": {
              "q": "Flow management will not fix a fixed orifice. What actually enlarges the effective area?",
              "opts": [
                {
                  "a": "Just accept the small valve",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but you knowingly left avoidable mismatch in a patient it will burden."
                },
                {
                  "a": "Annular enlargement or a higher-flow prosthesis strategy",
                  "to": "n3",
                  "k": "good",
                  "r": "You settle on a real orifice-area solution."
                }
              ]
            },
            "n3": {
              "q": "You perform an annular enlargement. What is the added technical hazard to respect?",
              "opts": [
                {
                  "a": "Conduction injury and patch-line bleeding",
                  "to": "n4",
                  "k": "good",
                  "r": "Root enlargement trades orifice area for a more demanding, bleeding-prone reconstruction near the conduction system."
                },
                {
                  "a": "There is no added risk; enlargement is free",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Underestimating the enlargement is how conduction injury and suture-line bleeding are missed."
                }
              ]
            },
            "n3b": {
              "q": "After enlargement the patient is in complete heart block and the root suture line oozes. Recognise the cost?",
              "opts": [
                {
                  "a": "Ignore the rhythm and close over the ooze",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Unaddressed block and a bleeding root reconstruction end badly off the table."
                },
                {
                  "a": "Pace and secure the root suture line",
                  "to": "n4",
                  "k": "good",
                  "r": "You manage the predictable complications of the maneuver you chose."
                }
              ]
            },
            "n4": {
              "q": "Off bypass, TEE shows a high transvalvular gradient with a LOW stroke volume. How do you read it?",
              "opts": [
                {
                  "a": "Diagnose severe mismatch from the gradient alone and re-replace the valve",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Acting on the gradient in isolation risks a needless re-do in a low-flow, not obstructed, ventricle."
                },
                {
                  "a": "Ignore the gradient because flow is low",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Dismissing it outright can miss a genuinely obstructing prosthesis."
                },
                {
                  "a": "Integrate flow, LV function, valve motion, contour and indexed orifice area before calling it mismatch",
                  "to": "n5",
                  "k": "good",
                  "r": "Gradients are flow-dependent; a single Doppler number can misclassify a low-flow state."
                }
              ]
            },
            "n4b": {
              "q": "You dismissed the gradient. The stroke volume then normalises and the gradient stays high. Reconsider?",
              "opts": [
                {
                  "a": "Continue to ignore the persistent gradient",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "You leave a truly obstructing valve behind."
                },
                {
                  "a": "Reassess the prosthesis for obstruction",
                  "to": "n5",
                  "k": "good",
                  "r": "With flow corrected, the gradient now means what it says."
                }
              ]
            },
            "n5": {
              "q": "At restored flow the indexed orifice area is now adequate and the gradient is acceptable. Final check before leaving?",
              "opts": [
                {
                  "a": "Check leak, rhythm, and haemostasis",
                  "to": "eGood",
                  "k": "good",
                  "r": "You verified the result across all the ways this operation can fail."
                },
                {
                  "a": "Call it done on the gradient alone",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The valve is fine, but you did not confirm the leak, rhythm and suture line you put at risk."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Right-sized and verified",
              "r": "You named prosthesis-patient mismatch, enlarged the orifice appropriately, respected the conduction and bleeding risks of the maneuver, and interpreted the exit gradient in its flow context."
            },
            "eAlive": {
              "end": "alive",
              "t": "Adequate, not confirmed",
              "r": "The valve works, but you either accepted avoidable mismatch or left the leak, rhythm and root unverified after a demanding reconstruction."
            },
            "eHarm": {
              "end": "harm",
              "t": "Wrong lever pulled",
              "r": "Either an obstructing small valve was left in, or a low-flow gradient was misread as mismatch and the valve needlessly re-replaced. The number was read without its physiology."
            },
            "eDead": {
              "end": "dead",
              "t": "Ignored the maneuver's cost",
              "r": "Root enlargement solved the orifice but its conduction and bleeding complications were ignored — and that is what killed the patient."
            },
            "s1": {
              "q": "How do you quantify the mismatch risk before committing to a strategy?",
              "opts": [
                {
                  "a": "Judge it by the annulus diameter alone",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Raw annulus size without indexing to the patient does not tell you the functional result."
                },
                {
                  "a": "Predict indexed effective orifice area",
                  "to": "n2",
                  "k": "good",
                  "r": "Mismatch is defined by indexed effective orifice area — predict it rather than discovering it off-pump."
                }
              ]
            },
            "s2": {
              "q": "You commit to enlarging the root. What preparation most reduces the added risk?",
              "opts": [
                {
                  "a": "Plan the patch line and pacing backup",
                  "to": "n3",
                  "k": "good",
                  "r": "Anticipating the specific complications of enlargement — bleeding and block — is how you survive the maneuver."
                },
                {
                  "a": "Proceed without changing anything about the plan",
                  "to": "n3b",
                  "k": "bad",
                  "r": "An unprepared enlargement is how the conduction injury and suture-line bleeding catch you out."
                }
              ]
            }
          },
          "summary": "Severe AS in a small annulus forces a choice: accept prosthesis-patient mismatch (chronic residual obstruction indexed to body size) or enlarge the effective orifice area by annular enlargement or a higher-performance prosthesis. Enlargement buys area at the cost of conduction risk and a bleeding-prone suture line near the aorto-mitral curtain. And every exit gradient must be read with its flow: a high gradient at low stroke volume is not automatically mismatch — integrate flow, function, motion and indexed orifice area.",
          "keyPoints": [
            "The hazard of an undersized aortic valve is prosthesis-patient mismatch — residual pressure overload indexed to body size.",
            "Fix it by increasing effective orifice area: annular enlargement or a higher-performance/supra-annular prosthesis.",
            "Annular enlargement risks conduction injury (block) and a bleeding root suture line near the aorto-mitral curtain.",
            "A high gradient at LOW stroke volume may be flow-dependent — integrate flow, LV function, motion and indexed orifice area.",
            "Never re-replace on a gradient alone, and never dismiss one alone; confirm the result at restored flow."
          ],
          "links": [
            [
              "Day 4 circuit",
              "#/day/4"
            ],
            [
              "Surgical aortic valve replacement",
              "#/surgery/savr"
            ],
            [
              "Valve hemodynamics lab",
              "#/physiology/valve"
            ],
            [
              "PARTNER 1 trial",
              "#/trials/partner1"
            ]
          ]
        },
        {
          "id": "cr-d5",
          "day": 5,
          "title": "The Numbers Disagree",
          "setting": "Echo lab · pre-operative assessment",
          "brief": "The echo reports an aortic valve area of 0.8 cm2 (severe) but a mean gradient of 28 mmHg (not severe), with a reduced LVEF of 35%.",
          "vitals": [
            [
              "AVA",
              "0.8 cm2"
            ],
            [
              "Mean grad",
              "28"
            ],
            [
              "EF",
              "35%"
            ],
            [
              "SVi",
              "low"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "A small valve area but a low gradient with poor LV function — what is the correct framing?",
              "v": [
                [
                  "AVA",
                  "0.8"
                ],
                [
                  "Grad",
                  "28"
                ],
                [
                  "EF",
                  "35%"
                ],
                [
                  "Flow",
                  "low"
                ]
              ],
              "opts": [
                {
                  "a": "Severe AS is excluded because the gradient is under 40 mmHg",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A fixed gradient threshold ignores that gradient falls when flow is low — you may miss true severe disease."
                },
                {
                  "a": "Possible low-flow, low-gradient severe aortic stenosis",
                  "to": "s1",
                  "k": "good",
                  "r": "Valve area and gradient disagree exactly when forward flow is reduced."
                },
                {
                  "a": "The study is unreliable and should be discarded",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Discarding a discordant study throws away the very pattern that signals low-flow AS."
                }
              ]
            },
            "n1b": {
              "q": "You nearly dismissed severe AS. Why can the gradient be low despite a small valve?",
              "opts": [
                {
                  "a": "Low flow produces a low gradient",
                  "to": "n2",
                  "k": "good",
                  "r": "You recover the core principle: gradient is flow-dependent."
                },
                {
                  "a": "The valve must actually be mild",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "You wrongly clear a patient who may have severe, operable AS."
                }
              ]
            },
            "n2": {
              "q": "First, is this even a low-flow state? What do you check?",
              "opts": [
                {
                  "a": "Just the ejection fraction",
                  "to": "n2b",
                  "k": "bad",
                  "r": "EF alone can mislead; small hyperdynamic ventricles and errors both distort it."
                },
                {
                  "a": "Indexed stroke volume",
                  "to": "n3",
                  "k": "good",
                  "r": "You verify the flow state instead of assuming it, avoiding a measurement trap."
                }
              ]
            },
            "n2b": {
              "q": "EF alone left you unsure. What single measure best defines the flow state?",
              "opts": [
                {
                  "a": "Indexed stroke volume",
                  "to": "n3",
                  "k": "good",
                  "r": "You anchor on the flow measure that actually defines low-flow AS."
                },
                {
                  "a": "Systemic blood pressure",
                  "to": "n2b2",
                  "k": "bad",
                  "r": "Systemic pressure does not tell you transvalvular flow."
                }
              ]
            },
            "n2b2": {
              "q": "Still guessing at the flow. Commit to the right measurement?",
              "opts": [
                {
                  "a": "Proceed to surgery without settling the question",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Operating on an unresolved severity question is how a non-severe valve gets replaced — or a severe one missed."
                },
                {
                  "a": "Indexed stroke volume it is",
                  "to": "n3",
                  "k": "good",
                  "r": "You finally use the flow-defining number."
                }
              ]
            },
            "n3": {
              "q": "Flow is confirmed low. Which test distinguishes TRUE-severe from PSEUDO-severe AS?",
              "opts": [
                {
                  "a": "Low-dose dobutamine stress echocardiography",
                  "to": "s2",
                  "k": "good",
                  "r": "Augmenting flow reveals whether the valve area stays fixed while the gradient rises."
                },
                {
                  "a": "Ambulatory rhythm monitoring",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A Holter does not interrogate the valve during increased flow."
                },
                {
                  "a": "Posteroanterior chest radiograph",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A chest film cannot resolve valve-severity mechanism."
                }
              ]
            },
            "n3b": {
              "q": "That test cannot answer the question. What actually probes the valve under higher flow?",
              "opts": [
                {
                  "a": "Repeat the resting echo unchanged",
                  "to": "n3b2",
                  "k": "bad",
                  "r": "Repeating the same low-flow study reproduces the same ambiguity."
                },
                {
                  "a": "Dobutamine stress echo",
                  "to": "n4",
                  "k": "good",
                  "r": "You choose the flow-augmentation test."
                }
              ]
            },
            "n3b2": {
              "q": "Same study, same ambiguity. Now the right test?",
              "opts": [
                {
                  "a": "Dobutamine stress echo",
                  "to": "n4",
                  "k": "good",
                  "r": "Correct at last."
                },
                {
                  "a": "Give up and treat medically",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "You may deny an operation to a patient with true severe, operable AS."
                }
              ]
            },
            "n4": {
              "q": "On dobutamine there is NO contractile reserve, so the test is inconclusive. What flow-independent evidence helps?",
              "opts": [
                {
                  "a": "CT aortic-valve calcium scoring",
                  "to": "n5",
                  "k": "good",
                  "r": "Calcium burden supports stenosis severity independent of flow."
                },
                {
                  "a": "Serum troponin",
                  "to": "n4b",
                  "k": "bad",
                  "r": "A nonspecific marker cannot resolve valve severity."
                },
                {
                  "a": "Repeat blood pressure",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Pressure without flow data adds nothing to the severity question."
                }
              ]
            },
            "n4b": {
              "q": "That does not settle severity. What flow-independent structural test does?",
              "opts": [
                {
                  "a": "CT aortic-valve calcium score",
                  "to": "n5",
                  "k": "good",
                  "r": "You reach the flow-independent answer."
                },
                {
                  "a": "Proceed on the ambiguous data",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "An unresolved severity call drives the wrong operative decision."
                }
              ]
            },
            "n5": {
              "q": "The calcium score is high, consistent with true-severe AS. How do you present the decision?",
              "opts": [
                {
                  "a": "As proven by the calcium score alone",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "You reach the right patient decision, but leaning on one number is the same error that started the case."
                },
                {
                  "a": "Integrate all severity evidence",
                  "to": "eGood",
                  "k": "good",
                  "r": "You honour the honest limit: a static image at one flow state cannot settle a flow-dependent question alone."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Severity resolved honestly",
              "r": "You recognised discordance as possible low-flow AS, confirmed the flow state, used dobutamine and then calcium scoring when reserve was absent, and integrated the evidence rather than trusting any single value."
            },
            "eAlive": {
              "end": "alive",
              "t": "Right call, shaky method",
              "r": "The patient is correctly identified as severe, but the reasoning leaned on a single number — the very trap the case was built to expose."
            },
            "eHarm": {
              "end": "harm",
              "t": "Misclassified valve",
              "r": "Trusting a threshold or abandoning the workup misclassified the stenosis, risking a denied operation for severe AS or an unnecessary one for mild disease."
            },
            "s1": {
              "q": "Before any further test, what is the very first data-quality question?",
              "opts": [
                {
                  "a": "Verify LVOT and Doppler measurements",
                  "to": "n2",
                  "k": "good",
                  "r": "The continuity equation squares the LVOT radius, so a measurement error is magnified — verify the data before trusting the discordance."
                },
                {
                  "a": "None — accept the reported numbers as printed",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Accepting unverified numbers is how a measurement artefact gets treated as real disease."
                }
              ]
            },
            "s2": {
              "q": "You order the dobutamine study. What are you specifically watching for?",
              "opts": [
                {
                  "a": "Only whether the heart rate increases",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A rising heart rate confirms the drug is working, not whether the valve is truly severe."
                },
                {
                  "a": "Valve-area response during dobutamine",
                  "to": "n4",
                  "k": "good",
                  "r": "The discriminating finding is how area and gradient move together as flow increases."
                }
              ]
            }
          },
          "summary": "Discordant severe-area / low-gradient AS with a weak ventricle is the classic low-flow, low-gradient trap. Gradient is flow-dependent, so first confirm the flow state (indexed stroke volume), then use low-dose dobutamine stress echo to separate true-severe from pseudo-severe. When contractile reserve is absent, CT aortic-valve calcium provides flow-independent support. No single number decides — the call integrates the dimensionless index, calcium score, dobutamine response and the clinical picture.",
          "keyPoints": [
            "Small valve area + low gradient + low EF = suspect low-flow, low-gradient severe AS; do not clear it on the gradient.",
            "Gradient depends on flow — confirm a genuinely low indexed stroke volume before invoking low-flow AS.",
            "Dobutamine stress echo distinguishes true-severe (fixed area, rising gradient) from pseudo-severe AS.",
            "No contractile reserve? Use CT aortic-valve calcium as flow-independent evidence of severity.",
            "A static image at one flow state cannot settle a flow-dependent question — integrate multiple data, trust no single number."
          ],
          "links": [
            [
              "Day 5 circuit",
              "#/day/5"
            ],
            [
              "Valve hemodynamics lab",
              "#/physiology/valve"
            ],
            [
              "Coronary angiography intensive",
              "#/angiography"
            ],
            [
              "EXCEL trial",
              "#/trials/excel"
            ]
          ]
        },
        {
          "id": "cr-d6",
          "day": 6,
          "title": "The Frail Referral",
          "setting": "Clinic / Heart Team · elective CABG referral",
          "brief": "A frail patient with chronic kidney disease and recent ticagrelor for an ACS is referred for elective multivessel CABG. The calculated risk score is high.",
          "vitals": [
            [
              "eGFR",
              "34"
            ],
            [
              "Ticagrelor",
              "day 1"
            ],
            [
              "STS",
              "high"
            ],
            [
              "Hb",
              "10.8"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "What is the best first planning step?",
              "v": [
                [
                  "Frailty",
                  "high"
                ],
                [
                  "CKD",
                  "yes"
                ],
                [
                  "Antiplatelet",
                  "recent"
                ],
                [
                  "Urgency",
                  "elective"
                ]
              ],
              "opts": [
                {
                  "a": "Proceed to surgery immediately because any delay is harmful",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Rushing an anticoagulated, frail patient into elective surgery courts avoidable bleeding."
                },
                {
                  "a": "Cancel surgery outright because the score is high",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A single high score is not a contraindication — you may deny a beneficial operation."
                },
                {
                  "a": "An integrated Heart-Team benefit-risk assessment",
                  "to": "s1",
                  "k": "good",
                  "r": "No single variable substitutes for a multidisciplinary benefit-risk judgment."
                }
              ]
            },
            "n1b": {
              "q": "A one-factor decision is unsafe here. What actually governs the plan?",
              "opts": [
                {
                  "a": "Whichever single number is most extreme",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Letting one number decide either bleeds the patient or denies needed surgery."
                },
                {
                  "a": "Net benefit after bleeding and frailty",
                  "to": "n2",
                  "k": "good",
                  "r": "You return decision-making to an integrated assessment."
                }
              ]
            },
            "n2": {
              "q": "For this NON-emergency operation, how should recent ticagrelor be managed?",
              "opts": [
                {
                  "a": "Operate today; the antiplatelet effect is irrelevant",
                  "to": "eBleed",
                  "k": "fail",
                  "r": "Operating on-drug drives major bleeding, transfusion and re-exploration."
                },
                {
                  "a": "Postpone open-heart surgery at least 3 days after stopping ticagrelor",
                  "to": "s2",
                  "k": "good",
                  "r": "Current cardiac-surgery guidance supports at least a 3-day interruption for non-emergency surgery."
                },
                {
                  "a": "Wait exactly 10 days regardless",
                  "to": "n2b",
                  "k": "bad",
                  "r": "An arbitrary long delay overstates the drug's window and needlessly exposes the patient to ongoing ischaemia."
                }
              ]
            },
            "n2b": {
              "q": "Ten days is longer than the evidence requires. What is the supported interval?",
              "opts": [
                {
                  "a": "No preoperative interruption",
                  "to": "eBleed",
                  "k": "fail",
                  "r": "Zero interruption is the bleeding-catastrophe option."
                },
                {
                  "a": "Ticagrelor stopped at least 3 days",
                  "to": "n3",
                  "k": "good",
                  "r": "You match the interruption to the drug-specific recovery window."
                }
              ]
            },
            "n3": {
              "q": "During the wait, how do you use the high calculated risk score?",
              "opts": [
                {
                  "a": "Estimate plus anatomy, frailty, and goals",
                  "to": "n4",
                  "k": "good",
                  "r": "Risk models inform rather than replace individualised judgment."
                },
                {
                  "a": "As an automatic contraindication to surgery",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Turning a population model into an absolute verdict hides factors it never captured."
                },
                {
                  "a": "As proof that PCI must be superior",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A surgical risk score says nothing about the comparative durability of PCI here."
                }
              ]
            },
            "n3b": {
              "q": "You are letting the score decide by itself. What does it actually represent?",
              "opts": [
                {
                  "a": "The definitive final answer",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "A model used as a verdict denies or imposes surgery against the individual picture."
                },
                {
                  "a": "Estimate, not verdict",
                  "to": "n4",
                  "k": "good",
                  "r": "You put the number back in its proper, supporting role."
                }
              ]
            },
            "n4": {
              "q": "You optimise the modifiable factors. Which package best reduces this patient's real risk?",
              "opts": [
                {
                  "a": "Washout, renal protection, and blood conservation",
                  "to": "n5",
                  "k": "good",
                  "r": "You address the specific, modifiable drivers of this patient's morbidity."
                },
                {
                  "a": "Transfuse to a high haemoglobin now for reserve",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Liberal transfusion is not benign and is not the optimisation this patient needs."
                }
              ]
            },
            "n4b": {
              "q": "Reflexive transfusion is the wrong optimisation. What matters instead?",
              "opts": [
                {
                  "a": "Keep transfusing to a fixed target",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient reaches surgery, but exposed to the risks of unnecessary transfusion."
                },
                {
                  "a": "Targeted perioperative optimisation",
                  "to": "n5",
                  "k": "good",
                  "r": "You choose targeted optimisation over a reflexive number."
                }
              ]
            },
            "n5": {
              "q": "The Heart Team confirms CABG offers meaningful benefit. How is the recommendation framed to the patient?",
              "opts": [
                {
                  "a": "Shared decision with residual risk",
                  "to": "eGood",
                  "k": "good",
                  "r": "You present an honest, individualised benefit-risk conversation."
                },
                {
                  "a": "As a directive: the team decided, so proceed",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The plan is medically sound, but bypassing shared decision-making misses the point of the Heart Team."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Optimised and shared",
              "r": "You resisted single-factor decisions, timed the antiplatelet washout correctly, used the risk score as an estimate, optimised the modifiable risks and framed the operation as a shared decision."
            },
            "eAlive": {
              "end": "alive",
              "t": "Sound plan, thin process",
              "r": "The patient reaches an appropriate operation, but somewhere the process leaned on a reflexive number or skipped genuine shared decision-making."
            },
            "eBleed": {
              "end": "harm",
              "t": "Bled on antiplatelet",
              "r": "Operating without an adequate ticagrelor washout drove major bleeding and re-exploration — a complication that was entirely in the pre-operative plan."
            },
            "eHarm": {
              "end": "harm",
              "t": "One number, wrong call",
              "r": "Letting a single score or reflex decide either denied a beneficial operation or imposed one against the individual picture."
            },
            "s1": {
              "q": "Who needs to be at the table for this decision?",
              "opts": [
                {
                  "a": "Just the operating surgeon, to keep the decision quick",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A single-specialty decision is the one the Heart-Team model exists to prevent."
                },
                {
                  "a": "Multidisciplinary Heart Team",
                  "to": "n2",
                  "k": "good",
                  "r": "The benefit-risk balance in a frail, anticoagulated patient is exactly what multidisciplinary review exists for."
                }
              ]
            },
            "s2": {
              "q": "During the antiplatelet washout, how do you monitor for a change that would force your hand?",
              "opts": [
                {
                  "a": "Monitor for ischaemia or instability",
                  "to": "n3",
                  "k": "good",
                  "r": "The washout plan holds only while the patient stays stable; instability changes the risk calculus."
                },
                {
                  "a": "Stop monitoring — the plan is fixed once made",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A fixed plan blind to deterioration is how a patient crashes during an avoidable delay."
                }
              ]
            }
          },
          "summary": "Pre-operative risk is a Heart-Team judgment, not a single number. A high score is an estimate to be supplemented by anatomy, frailty and goals — never an automatic contraindication or a claim that PCI wins. Recent ticagrelor before non-emergency surgery warrants at least a 3-day interruption; operating on-drug drives bleeding and re-exploration. Optimise the modifiable risks specifically, and frame the final recommendation as a shared decision.",
          "keyPoints": [
            "No single variable decides operability — use an integrated Heart-Team benefit-risk assessment.",
            "Postpone non-emergency open-heart surgery at least 3 days after stopping ticagrelor.",
            "A high risk score is a population estimate to supplement with anatomy, frailty and goals — not a verdict.",
            "Optimise the specific modifiable risks (washout timing, renal protection, blood conservation), not a reflexive transfusion target.",
            "Frame the operative recommendation as an individualised shared decision."
          ],
          "links": [
            [
              "Day 6 circuit",
              "#/day/6"
            ],
            [
              "Median sternotomy & access",
              "#/surgery/sternotomy"
            ],
            [
              "SYNTAX trial",
              "#/trials/syntax"
            ]
          ]
        },
        {
          "id": "cr-d7",
          "day": 7,
          "title": "She Was Fine Yesterday",
          "setting": "Cardiac ICU · POD1 after CABG (LIMA-LAD, SVG-OM, SVG-PDA) in a diabetic with 3-vessel disease",
          "brief": "Stable overnight. Now abrupt new inferior ST elevation, the MAP falls to 50, and the inferior wall goes akinetic on bedside echo.",
          "vitals": [
            [
              "MAP",
              "50"
            ],
            [
              "HR",
              "104"
            ],
            [
              "ST",
              "II/III/aVF ↑"
            ],
            [
              "Wall",
              "inferior akinetic"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "Why was CABG the right index operation in this diabetic with diffuse 3-vessel disease?",
              "v": [
                [
                  "DM",
                  "yes"
                ],
                [
                  "Disease",
                  "3-vessel"
                ],
                [
                  "Targets",
                  "good"
                ],
                [
                  "POD",
                  "1"
                ]
              ],
              "opts": [
                {
                  "a": "Because stents are never used in diabetics",
                  "to": "n1b",
                  "k": "bad",
                  "r": "An overstatement — the point is the outcome advantage of CABG in this specific pattern, not an absolute rule."
                },
                {
                  "a": "CABG's long-term outcome advantage",
                  "to": "n2",
                  "k": "good",
                  "r": "The evidence base for the operation frames why complete surgical revascularisation was chosen."
                },
                {
                  "a": "It was arbitrary; either strategy is equivalent",
                  "to": "n1b",
                  "k": "bad",
                  "r": "FREEDOM showed CABG is not equivalent to PCI here for major long-term outcomes."
                }
              ]
            },
            "n1b": {
              "q": "Set the dogma aside. What is the actual evidentiary basis?",
              "opts": [
                {
                  "a": "CABG outcome benefit",
                  "to": "n2",
                  "k": "good",
                  "r": "You state the evidence precisely."
                },
                {
                  "a": "No demonstrated outcome advantage",
                  "to": "n2",
                  "k": "bad",
                  "r": "There is — but the graft in front of you now matters more, so move to the emergency."
                }
              ]
            },
            "n2": {
              "q": "Now the emergency: new territory-specific inferior ST elevation the morning after CABG — leading mechanism?",
              "opts": [
                {
                  "a": "RCA/PDA graft failure",
                  "to": "s1",
                  "k": "good",
                  "r": "An early, territory-specific change is a mechanical graft problem, not diffuse ischaemia."
                },
                {
                  "a": "Diffuse demand ischaemia — give fluid and a pressor",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Territory-specific ST elevation is not demand; you are masking a graft failure."
                },
                {
                  "a": "Post-operative pericarditis",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Pericarditis is diffuse and does not make a wall akinetic with shock."
                }
              ]
            },
            "n2b": {
              "q": "Your treatment did not touch the inferior ST elevation. Reframe?",
              "opts": [
                {
                  "a": "Interrogate the RCA/PDA graft",
                  "to": "n3",
                  "k": "good",
                  "r": "You localise to the graft that supplies the failing wall."
                },
                {
                  "a": "Escalate pressors and observe",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Raising demand on an infarcting inferior wall accelerates the arrest."
                }
              ]
            },
            "n3": {
              "q": "How do you distinguish transient air-in-the-graft from mechanical graft failure?",
              "opts": [
                {
                  "a": "You cannot tell at the bedside, so do nothing",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Passivity while a graft fails wastes salvageable myocardium."
                },
                {
                  "a": "Wait for the next troponin to decide",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Serial troponin lags far behind the evolving infarct and the shock."
                },
                {
                  "a": "Transient graft air or fixed mechanical failure",
                  "to": "n4",
                  "k": "good",
                  "r": "You do not assume recovery — you watch briefly while preparing to interrogate and revise."
                }
              ]
            },
            "n3b": {
              "q": "The deficit is fixed and the patient is unstable. Commit?",
              "opts": [
                {
                  "a": "Interrogate and revise the graft",
                  "to": "n4",
                  "k": "good",
                  "r": "Fixed deficit plus instability equals a surgical/interventional problem."
                },
                {
                  "a": "Continue observation without graft assessment",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Waiting past the salvage window loses the inferior wall and the patient."
                }
              ]
            },
            "n4": {
              "q": "The deficit persists and the patient is unstable. Best step?",
              "opts": [
                {
                  "a": "Medicate around it with more pressor",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Raising pressure alone raises demand on an already ischaemic territory."
                },
                {
                  "a": "Interrogate and revise the graft",
                  "to": "n5",
                  "k": "good",
                  "r": "A failing graft with haemodynamic compromise is a mechanical problem to be corrected."
                },
                {
                  "a": "Give systemic thrombolysis",
                  "to": "eBleed",
                  "k": "fail",
                  "r": "Lysis on POD1 after sternotomy is a bleeding catastrophe and does not fix a kink."
                }
              ]
            },
            "n5": {
              "q": "In the OR the SVG-PDA graft is kinked from excess length. Principle for the fix?",
              "opts": [
                {
                  "a": "Correct graft kink or tension",
                  "to": "n6",
                  "k": "good",
                  "r": "Anastomotic geometry determines patency; a kinked graft is revised, not tolerated."
                },
                {
                  "a": "Leave it — it may open with time",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "A kinked graft does not remodel open; the territory infarcts."
                }
              ]
            },
            "n6": {
              "q": "Flow is restored but the inferior wall and RV remain stunned. What completes the rescue?",
              "opts": [
                {
                  "a": "Wean all support immediately now that the graft is fixed",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but pulling support off freshly reperfused, stunned muscle risks a second dip."
                },
                {
                  "a": "Support rhythm, preload, PVR and the RV while the stunned muscle recovers",
                  "to": "eGood",
                  "k": "good",
                  "r": "With flow restored the injured territory needs coordinated physiological support."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Graft rescued in time",
              "r": "You grounded the operation in the evidence, recognised early territory-specific ischaemia as a graft problem, did not assume the air would clear, revised the kinked geometry and supported the stunned myocardium."
            },
            "eAlive": {
              "end": "alive",
              "t": "Salvaged, then hurried",
              "r": "The graft is revised and the wall reperfused, but weaning support too fast off stunned muscle left an avoidable risk."
            },
            "eHarm": {
              "end": "harm",
              "t": "Territory lost",
              "r": "Medicating around a failing graft, or tolerating a kink, converted a correctable technical problem into an established infarct."
            },
            "eBleed": {
              "end": "harm",
              "t": "Catastrophic bleeding",
              "r": "Thrombolysis on POD1 after sternotomy caused surgical-site haemorrhage and did nothing for a mechanical graft kink."
            },
            "eDead": {
              "end": "dead",
              "t": "Waited too long",
              "r": "Passive observation or pressor escalation on an infarcting inferior wall crossed the salvage window into arrest."
            },
            "s1": {
              "q": "Before you interrogate the graft, what bedside data sharpens the localisation?",
              "opts": [
                {
                  "a": "Focused echo and 12-lead ECG",
                  "to": "n3",
                  "k": "good",
                  "r": "Pinning the deficit to a wall and a territory tells you which graft to interrogate first."
                },
                {
                  "a": "Routine chest radiograph only",
                  "to": "n2b",
                  "k": "bad",
                  "r": "A chest film will not localise an acutely failing graft."
                }
              ]
            }
          },
          "summary": "CABG in diabetic multivessel disease rests on a demonstrated long-term outcome advantage (FREEDOM) — but the morning-after emergency is mechanical. New territory-specific ST elevation after CABG is a graft problem (air, kink/tension, occlusion), not diffuse ischaemia and not something to medicate around. Air in a fresh RCA graft stuns and recovers in minutes; a fixed deficit with instability is mechanical failure that must be interrogated and revised, then the stunned myocardium supported.",
          "keyPoints": [
            "CABG beats PCI for long-term outcomes in diabetic multivessel disease (FREEDOM) — the evidentiary basis for the operation.",
            "New territory-specific ST elevation after CABG = a graft problem in that territory, not diffuse demand ischaemia.",
            "Air in a fresh RCA graft stuns the inferior wall and recovers in minutes; a fixed deficit with instability is mechanical failure.",
            "A failing graft with haemodynamic compromise is interrogated and revised — not medicated around, and never lysed after sternotomy.",
            "A kinked/over-long graft is revised to lie without tension; then support the stunned wall rather than raising demand."
          ],
          "links": [
            [
              "Day 7 circuit",
              "#/day/7"
            ],
            [
              "On-pump CABG module",
              "#/surgery/cabg"
            ],
            [
              "FREEDOM trial",
              "#/trials/freedom"
            ]
          ]
        },
        {
          "id": "cr-d8",
          "day": 8,
          "title": "SAM After the Repair",
          "setting": "OR · weaning from bypass after degenerative mitral repair",
          "brief": "After repair of a large posterior-leaflet prolapse, TEE shows systolic anterior motion of the mitral valve, LVOT obstruction and a posteriorly-directed jet of MR. The MAP is falling.",
          "vitals": [
            [
              "MAP",
              "54"
            ],
            [
              "LVOT",
              "obstructed"
            ],
            [
              "MR",
              "posterior jet"
            ],
            [
              "LV",
              "small/hyperdynamic"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "What single mechanism unifies SAM, LVOT obstruction and a posterior MR jet?",
              "v": [
                [
                  "SAM",
                  "yes"
                ],
                [
                  "LVOTO",
                  "yes"
                ],
                [
                  "MR",
                  "posterior"
                ],
                [
                  "Volume",
                  "under-filled"
                ]
              ],
              "opts": [
                {
                  "a": "Acute dissection compromising a coronary ostium",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Dissection does not explain simultaneous LVOT obstruction and a posterior MR jet."
                },
                {
                  "a": "Isolated RV infarction",
                  "to": "n1b",
                  "k": "bad",
                  "r": "RV infarction has no LVOT mechanism and would not create a posterior mitral jet."
                },
                {
                  "a": "Anterior coaptation causing SAM, LVOTO and posterior MR",
                  "to": "s1",
                  "k": "good",
                  "r": "Excess posterior-leaflet height in a small hyperdynamic ventricle moves coaptation anteriorly and produces all three findings."
                }
              ]
            },
            "n1b": {
              "q": "Those do not fit. What actually links the three findings?",
              "opts": [
                {
                  "a": "Anterior coaptation causes SAM and LVOTO",
                  "to": "n2",
                  "k": "good",
                  "r": "You settle on the true mechanism of post-repair SAM."
                },
                {
                  "a": "Call it unexplained and give an inotrope",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Inotropy worsens the dynamic obstruction you have failed to name."
                }
              ]
            },
            "n2": {
              "q": "What is the best INITIAL physiological response to dynamic LVOT obstruction from SAM?",
              "opts": [
                {
                  "a": "Increase inotropy while deliberately reducing afterload",
                  "to": "eCrash",
                  "k": "fail",
                  "r": "A smaller, more hyperdynamic ventricle with less afterload makes SAM and the obstruction far worse."
                },
                {
                  "a": "Increase preload and afterload, and reduce inotropy",
                  "to": "n3",
                  "k": "good",
                  "r": "A larger, less hyperdynamic ventricle with more afterload pulls the leaflet out of the LVOT."
                },
                {
                  "a": "Aggressively diurese and venodilate to reduce preload",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Reducing preload shrinks the cavity and worsens SAM — the opposite of what is needed."
                }
              ]
            },
            "n2b": {
              "q": "The obstruction worsened as the ventricle emptied. Correct the loading how?",
              "opts": [
                {
                  "a": "Fill the LV, raise afterload, and reduce inotropy",
                  "to": "n3",
                  "k": "good",
                  "r": "You reverse the loading toward a larger, calmer ventricle."
                },
                {
                  "a": "Add an inotrope to 'push through' the obstruction",
                  "to": "eCrash",
                  "k": "fail",
                  "r": "Inotropy intensifies the dynamic obstruction and the MAP collapses."
                }
              ]
            },
            "n3": {
              "q": "Which specific drug maneuver helps a hyperdynamic, SAM-prone ventricle?",
              "opts": [
                {
                  "a": "An inodilator to increase contractility and drop SVR",
                  "to": "eCrash",
                  "k": "fail",
                  "r": "That is precisely the combination that worsens SAM."
                },
                {
                  "a": "Use esmolol with preload and afterload support for SAM",
                  "to": "s2",
                  "k": "good",
                  "r": "Slowing the hyperdynamic ventricle reduces the systolic anterior motion."
                }
              ]
            },
            "n4": {
              "q": "You reload and calm the ventricle. TEE now shows only mild SAM and trivial MR. What next?",
              "opts": [
                {
                  "a": "Verify resolution then wean carefully on corrected loading",
                  "to": "n5",
                  "k": "good",
                  "r": "If loading fixes it, the repair stands — verify and proceed."
                },
                {
                  "a": "Return to bypass despite resolution with corrected loading",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Revising a repair whose SAM resolves with loading is an unnecessary second pump run."
                }
              ]
            },
            "n4b": {
              "q": "Before an unnecessary revision — is resolved-with-loading SAM a repair failure?",
              "opts": [
                {
                  "a": "Revise the repair despite loading resolution",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but a second bypass run was imposed for SAM that loading had already fixed."
                },
                {
                  "a": "Optimise loading and proceed off bypass",
                  "to": "n5",
                  "k": "good",
                  "r": "You avoid a needless revision for a physiologically-corrected problem."
                }
              ]
            },
            "n5": {
              "q": "In a DIFFERENT scenario the SAM stays severe despite full loading correction. What follows?",
              "opts": [
                {
                  "a": "Return to bypass and revise the repair geometry",
                  "to": "eGood",
                  "k": "good",
                  "r": "Persistent mechanical SAM is a repair problem and is corrected before leaving the OR."
                },
                {
                  "a": "Accept the severe obstruction and close",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Leaving severe LVOT obstruction converts a correctable lesion into post-operative shock."
                },
                {
                  "a": "Treat persistent mechanical SAM with pacing alone",
                  "to": "eHarm",
                  "k": "fail",
                  "r": "Pacing does not fix a fixed geometric cause of SAM."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "SAM controlled or corrected",
              "r": "You named the mechanism, loaded and calmed the ventricle first, avoided a needless revision when loading worked, and returned to bypass to fix the geometry when SAM was truly refractory."
            },
            "eAlive": {
              "end": "alive",
              "t": "Fixed, but over-treated",
              "r": "The patient does well, but a second bypass run was imposed for SAM that loading had already resolved."
            },
            "eCrash": {
              "end": "harm",
              "t": "Provoked the obstruction",
              "r": "Inotropy, afterload reduction or preload dumping made a small hyperdynamic ventricle worse and the LVOT obstruction collapsed the pressure."
            },
            "eHarm": {
              "end": "harm",
              "t": "Wrong tool for SAM",
              "r": "Pacing or an inodilator cannot correct a geometric cause of SAM; the obstruction persisted."
            },
            "eDead": {
              "end": "dead",
              "t": "Left severe obstruction",
              "r": "Closing over severe, refractory LVOT obstruction turned a correctable intra-operative problem into fatal post-operative shock."
            },
            "s1": {
              "q": "What at the time of repair predisposed this ventricle to SAM?",
              "opts": [
                {
                  "a": "An oversized annuloplasty ring that made the orifice too large",
                  "to": "n1b",
                  "k": "bad",
                  "r": "SAM after repair is classically an under-sized/over-tightened, not over-sized, geometry problem."
                },
                {
                  "a": "Tall posterior leaflet and a small hyperdynamic LV shift coaptation anteriorly",
                  "to": "n2",
                  "k": "good",
                  "r": "Recognising the substrate — tall posterior leaflet, small LV — tells you both the mechanism and the fix."
                }
              ]
            },
            "s2": {
              "q": "You have loaded and slowed the ventricle. How soon do you reassess the LVOT?",
              "opts": [
                {
                  "a": "Reassess LVOT gradient and MR with TEE now",
                  "to": "n4",
                  "k": "good",
                  "r": "Reassessing at once tells you whether physiology fixed it or whether a return to bypass is truly needed."
                },
                {
                  "a": "Wait until chest closure to repeat imaging",
                  "to": "eCrash",
                  "k": "fail",
                  "r": "Closing over uncharacterised LVOT obstruction risks shock you can no longer easily reverse."
                }
              ]
            }
          },
          "summary": "Post-repair SAM is anterior displacement of mitral coaptation dragging the anterior leaflet into the LVOT in a small, hyperdynamic ventricle — producing SAM, dynamic LVOT obstruction and a posterior MR jet together. Treat physiology first: fill the ventricle, raise afterload, reduce inotropy and slow it (esmolol). If loading resolves it, the repair stands. Only truly refractory, mechanical SAM warrants returning to bypass to revise the geometry — and it is never left uncorrected.",
          "keyPoints": [
            "SAM + dynamic LVOT obstruction + posterior MR jet = anteriorly-displaced coaptation in a small, hyperdynamic LV.",
            "First response: increase preload and afterload, reduce inotropy, slow the ventricle (e.g. esmolol).",
            "Inotropy, afterload reduction or diuresis all WORSEN SAM — they shrink or energise the ventricle.",
            "If SAM resolves with loading, the repair stands — do not impose a needless second bypass run.",
            "Refractory mechanical SAM is a repair problem: return to bypass and revise the geometry; never close over severe obstruction."
          ],
          "links": [
            [
              "Day 8 circuit",
              "#/day/8"
            ],
            [
              "Degenerative mitral repair",
              "#/surgery/mitral-repair"
            ],
            [
              "EVEREST II trial",
              "#/trials/everest2"
            ]
          ]
        },
        {
          "id": "cr-d9",
          "day": 9,
          "title": "Type A With Malperfusion",
          "setting": "ED / OR · acute type A aortic dissection",
          "brief": "A patient with acute type A dissection has a cool, pulseless right arm, a rising lactate and a compressed true lumen on CT. There is a small pericardial effusion.",
          "vitals": [
            [
              "BP",
              "150/60 (L arm)"
            ],
            [
              "R arm",
              "pulseless"
            ],
            [
              "Lactate",
              "4.6 ↑"
            ],
            [
              "Pericard",
              "small effusion"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "What is the immediate strategic priority?",
              "v": [
                [
                  "Dissection",
                  "type A"
                ],
                [
                  "Malperf",
                  "arm + rising lactate"
                ],
                [
                  "True lumen",
                  "compressed"
                ],
                [
                  "Tamponade",
                  "threatening"
                ]
              ],
              "opts": [
                {
                  "a": "Emergency proximal repair restoring effective true-lumen flow",
                  "to": "s1",
                  "k": "good",
                  "r": "The proximal tear is the lethal driver — rupture, tamponade and ongoing malperfusion — and must be addressed now."
                },
                {
                  "a": "Delay repair until every malperfused bed normalises",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Delay leaves rupture and tamponade unchecked while you chase branch perfusion."
                },
                {
                  "a": "Manage with chronic antihypertensives and admit",
                  "to": "eRupture",
                  "k": "fail",
                  "r": "Medical therapy alone for type A dissection ends in rupture and death."
                }
              ]
            },
            "n1b": {
              "q": "You cannot wait out the malperfusion. What kills first in type A?",
              "opts": [
                {
                  "a": "Repair proximal rupture/tamponade first",
                  "to": "n2",
                  "k": "good",
                  "r": "You reprioritise to the proximal lethal lesion."
                },
                {
                  "a": "Treat the cold, pulseless arm as the first lethal threat",
                  "to": "eRupture",
                  "k": "fail",
                  "r": "Fixating on the limb while the proximal aorta ruptures is fatal."
                }
              ]
            },
            "n2": {
              "q": "That small pericardial effusion — the patient becomes hypotensive during induction. What must you avoid?",
              "opts": [
                {
                  "a": "Immediately place a large pericardial drain to relieve tamponade",
                  "to": "eRupture",
                  "k": "fail",
                  "r": "Uncontrolled decompression restores forward ejection against the dissected root and can complete the rupture."
                },
                {
                  "a": "Avoid uncontrolled pericardial decompression until bypass support is established",
                  "to": "n3",
                  "k": "good",
                  "r": "Controlled pericardial management with surgical/bypass readiness prevents provoking rupture."
                }
              ]
            },
            "n3": {
              "q": "Which arterial access can provide antegrade systemic and cerebral perfusion when anatomy permits?",
              "opts": [
                {
                  "a": "Right axillary artery",
                  "to": "n4",
                  "k": "good",
                  "r": "Axillary inflow supports antegrade flow and cerebral perfusion while avoiding the dissected ascending aorta."
                },
                {
                  "a": "Femoral cannulation into the false lumen without imaging",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Blind femoral access risks pressurising the false lumen and worsening malperfusion."
                },
                {
                  "a": "Direct cannulation of the ascending aorta at the tear",
                  "to": "eRupture",
                  "k": "fail",
                  "r": "Cannulating the dissected ascending aorta risks extending the dissection and false-lumen perfusion."
                }
              ]
            },
            "n3b": {
              "q": "The femoral line may be perfusing the false lumen — the true lumen looks worse. Correct course?",
              "opts": [
                {
                  "a": "Increase femoral pump flow despite false-lumen perfusion",
                  "to": "eRupture",
                  "k": "fail",
                  "r": "More false-lumen flow extends the dissection and starves the true lumen."
                },
                {
                  "a": "Confirm true-lumen flow or change to axillary inflow now",
                  "to": "n4",
                  "k": "good",
                  "r": "You verify or convert to a true-lumen, antegrade strategy."
                }
              ]
            },
            "n4": {
              "q": "For the open distal anastomosis under circulatory arrest, what protects the brain?",
              "opts": [
                {
                  "a": "Use hypothermic arrest with antegrade cerebral perfusion",
                  "to": "s2",
                  "k": "good",
                  "r": "Cerebral protection is planned deliberately, not improvised."
                },
                {
                  "a": "Use normothermic arrest without cerebral perfusion",
                  "to": "n4b",
                  "k": "bad",
                  "r": "No cerebral protection during arrest risks global brain injury."
                }
              ]
            },
            "n4b": {
              "q": "Unprotected arrest threatens the brain. Adjust?",
              "opts": [
                {
                  "a": "Proceed rapidly without cerebral protection",
                  "to": "eStroke",
                  "k": "fail",
                  "r": "Speed bought at the cost of cerebral protection causes a devastating stroke."
                },
                {
                  "a": "Cool and use antegrade cerebral perfusion",
                  "to": "n5",
                  "k": "good",
                  "r": "You restore an appropriate cerebral-protection strategy."
                }
              ]
            },
            "n5": {
              "q": "After the proximal repair, the lactate keeps rising and the abdomen becomes tense. What now?",
              "opts": [
                {
                  "a": "Assume the proximal repair reperfused every branch vessel",
                  "to": "eBowel",
                  "k": "fail",
                  "r": "Assuming resolution lets mesenteric ischaemia progress to bowel infarction."
                },
                {
                  "a": "Urgently treat persistent mesenteric malperfusion",
                  "to": "n6",
                  "k": "good",
                  "r": "Dynamic obstruction may improve after proximal repair, but fixed branch obstruction persists and is time-critical."
                },
                {
                  "a": "Defer reassessment until routine post-operative imaging",
                  "to": "eBowel",
                  "k": "fail",
                  "r": "Waiting on an evolving mesenteric malperfusion is fatal delay."
                }
              ]
            },
            "n6": {
              "q": "The right arm is now warm but the leg is cool. What confirms adequate reperfusion before you leave?",
              "opts": [
                {
                  "a": "Close and trend lactate without direct limb reassessment",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but leaving with unverified limb perfusion risks a missed compartment/limb threat."
                },
                {
                  "a": "Confirm distal perfusion and treat residual malperfusion",
                  "to": "eGood",
                  "k": "good",
                  "r": "You verify end-organ and limb perfusion rather than assuming it."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Repaired and reperfused",
              "r": "You prioritised the proximal lethal lesion, managed tamponade and cannulation without provoking rupture, protected the brain, and hunted down persistent branch malperfusion rather than assuming the proximal repair fixed everything."
            },
            "eAlive": {
              "end": "alive",
              "t": "Survived, incompletely verified",
              "r": "The proximal repair and cerebral protection went well, but you left with distal perfusion unconfirmed."
            },
            "eRupture": {
              "end": "dead",
              "t": "Completed rupture",
              "r": "Delay, medical-only management, uncontrolled pericardial decompression or false-lumen cannulation extended or completed the dissection — the proximal lesion was the killer all along."
            },
            "eStroke": {
              "end": "harm",
              "t": "Cerebral catastrophe",
              "r": "Circulatory arrest without cerebral protection traded minutes for a devastating neurological injury."
            },
            "eBowel": {
              "end": "dead",
              "t": "Mesenteric infarction",
              "r": "Assuming the proximal repair reperfused every branch let fixed mesenteric malperfusion progress to bowel death and refractory acidosis."
            },
            "s1": {
              "q": "What is the immediate medical priority while you mobilise for surgery?",
              "opts": [
                {
                  "a": "Start anti-impulse HR and BP control",
                  "to": "n2",
                  "k": "good",
                  "r": "Beta-blockade-first anti-impulse therapy limits propagation while the team prepares for repair."
                },
                {
                  "a": "Aggressive fluid loading to raise the blood pressure",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Raising blood pressure and impulse worsens wall stress and can extend the dissection."
                }
              ]
            },
            "s2": {
              "q": "As you cool for arrest, how deep and how do you confirm readiness?",
              "opts": [
                {
                  "a": "Begin the arrest as soon as the pump is cold enough for your liking",
                  "to": "eStroke",
                  "k": "fail",
                  "r": "An arrest begun before adequate protection risks the very cerebral injury you were guarding against."
                },
                {
                  "a": "Confirm target temperature and EEG readiness before starting circulatory arrest",
                  "to": "n5",
                  "k": "good",
                  "r": "Confirmed cooling and neuromonitoring bound the safe arrest window rather than guessing."
                }
              ]
            }
          },
          "summary": "In acute type A dissection the proximal tear is the killer — rupture, tamponade and malperfusion — so emergency proximal repair with true-lumen perfusion comes first, not a chase after every ischaemic bed. Manage a threatening effusion and cannulation without provoking rupture (axillary antegrade inflow when anatomy permits; avoid blind false-lumen femoral access), protect the brain during arrest, and remember that proximal repair does not guarantee branch reperfusion: persistent malperfusion is time-critical and must be treated, not assumed away.",
          "keyPoints": [
            "Type A dissection: emergency proximal repair restoring true-lumen perfusion is the priority — never medical-only, never wait out malperfusion.",
            "Avoid uncontrolled pericardial decompression before bypass — restoring ejection against the tear can complete the rupture.",
            "Right axillary cannulation gives antegrade systemic + cerebral perfusion; avoid blind false-lumen femoral access.",
            "Protect the brain during circulatory arrest (hypothermia + antegrade cerebral perfusion).",
            "Proximal repair may not reperfuse every branch — persistent (e.g. mesenteric) malperfusion is time-critical and treated, not assumed resolved."
          ],
          "links": [
            [
              "Day 9 circuit",
              "#/day/9"
            ],
            [
              "Acute type A dissection repair",
              "#/surgery/type-a"
            ],
            [
              "INSTEAD-XL trial",
              "#/trials/instead-xl"
            ]
          ]
        },
        {
          "id": "cr-d10",
          "day": 10,
          "title": "Low Flow After LVAD",
          "setting": "OR · soon after activating a continuous-flow LVAD",
          "brief": "Moments after the pump starts, the flow reads low, the CVP climbs, the septum shifts toward the LV and the left ventricle becomes very small.",
          "vitals": [
            [
              "LVAD flow",
              "low"
            ],
            [
              "CVP",
              "20 ↑"
            ],
            [
              "Septum",
              "shifted L"
            ],
            [
              "LV",
              "small"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "What physiology is most likely?",
              "v": [
                [
                  "Flow",
                  "low"
                ],
                [
                  "CVP",
                  "20"
                ],
                [
                  "Septum",
                  "L shift"
                ],
                [
                  "LV",
                  "underfilled"
                ]
              ],
              "opts": [
                {
                  "a": "Isolated LV volume overload with preserved RV delivery",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A small, underfilled LV is the opposite of volume overload — you have the mechanism backwards."
                },
                {
                  "a": "Systemic hypertension with a persistently full LV",
                  "to": "n1b",
                  "k": "bad",
                  "r": "The LV is small, not full; hypertension is not the driver here."
                },
                {
                  "a": "Acute RV failure limiting LVAD preload",
                  "to": "n2",
                  "k": "good",
                  "r": "High CVP, a small underfilled LV and a leftward septal shift mean the RV cannot deliver enough blood to the pump."
                }
              ]
            },
            "n1b": {
              "q": "The LV is under-filled with a high CVP. What does that combination mean?",
              "opts": [
                {
                  "a": "Raise pump speed to fill the underfilled LV",
                  "to": "eSuction",
                  "k": "fail",
                  "r": "Speeding up an already under-filled LV causes suction events, not more flow."
                },
                {
                  "a": "RV failure limits preload delivery to the LVAD",
                  "to": "n2",
                  "k": "good",
                  "r": "You correctly read the RV as the limiting chamber."
                }
              ]
            },
            "n2": {
              "q": "What is the best immediate strategy?",
              "opts": [
                {
                  "a": "Increase LVAD speed to raise the low flow",
                  "to": "eSuction",
                  "k": "fail",
                  "r": "More speed on an underfilled ventricle worsens suction and the leftward septal shift."
                },
                {
                  "a": "Support the RV, lower PVR and reassess LVAD pump speed",
                  "to": "s1",
                  "k": "good",
                  "r": "The pump cannot create preload; supporting the RV and adjusting speed restores balanced flow."
                },
                {
                  "a": "Clamp the outflow graft to treat inadequate preload",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Clamping the outflow stops LVAD output entirely — a catastrophic misstep."
                }
              ]
            },
            "n3": {
              "q": "How does excessive pump speed interact with the failing RV via the septum?",
              "opts": [
                {
                  "a": "Pump speed does not alter septal position or RV geometry",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Ignoring ventricular interdependence is how the septal shift is driven further."
                },
                {
                  "a": "Excess speed shifts the septum left and impairs the RV",
                  "to": "s2",
                  "k": "good",
                  "r": "The septal interaction means naive speed increases make RV failure worse."
                }
              ]
            },
            "n3b": {
              "q": "The septum bows further left as you raise speed. Recognise the interaction?",
              "opts": [
                {
                  "a": "Reduce pump speed and support the failing RV",
                  "to": "n4",
                  "k": "good",
                  "r": "You break the speed-driven septal-shift cycle."
                },
                {
                  "a": "Keep pump speed high to preserve flow output",
                  "to": "eSuction",
                  "k": "fail",
                  "r": "Chasing a flow number drives suction and RV collapse."
                }
              ]
            },
            "n4": {
              "q": "Despite optimisation the RV still cannot support LVAD filling. What is the next escalation?",
              "opts": [
                {
                  "a": "Accept persistent low LVAD flow without RV escalation",
                  "to": "eDead",
                  "k": "fail",
                  "r": "Leaving an under-supported LVAD with a failing RV ends in end-organ hypoperfusion and arrest."
                },
                {
                  "a": "Escalate to temporary RVAD/ECMO support",
                  "to": "n5",
                  "k": "good",
                  "r": "When the RV cannot be optimised medically, mechanical RV support restores delivery."
                }
              ]
            },
            "n5": {
              "q": "On support, TEE shows the inflow cannula repeatedly touching the LV wall with suction alarms. What must you consider?",
              "opts": [
                {
                  "a": "Systemic infection",
                  "to": "n5b",
                  "k": "bad",
                  "r": "Infection does not cause acute inflow-wall contact on TEE in the OR."
                },
                {
                  "a": "Anaemia without a mechanical device-heart interaction",
                  "to": "n5b",
                  "k": "bad",
                  "r": "Anaemia is not the cause of a suction event with cannula-wall contact."
                },
                {
                  "a": "LV suction or inflow-cannula malposition",
                  "to": "n6",
                  "k": "good",
                  "r": "Wall contact is a mechanical clue to suction and possibly adverse inflow orientation."
                }
              ]
            },
            "n5b": {
              "q": "That does not explain repeated wall contact. What does?",
              "opts": [
                {
                  "a": "Dismiss repeated wall contact as a monitor artefact",
                  "to": "eSuction",
                  "k": "fail",
                  "r": "Ignoring recurrent suction invites arrhythmia and further low flow."
                },
                {
                  "a": "Correct LV suction and reassess inflow-cannula position",
                  "to": "n6",
                  "k": "good",
                  "r": "You address the mechanical device-heart geometry."
                }
              ]
            },
            "n6": {
              "q": "Flow and filling are now balanced with RV support and a corrected speed. Final principle before leaving?",
              "opts": [
                {
                  "a": "Confirm septal position, RV output and stable inflow",
                  "to": "eGood",
                  "k": "good",
                  "r": "You verify the whole coupled system rather than one flow number."
                },
                {
                  "a": "Wean RV support before confirming RV recovery or inflow stability",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but pulling RV support too early risks recurrent low flow."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Balanced biventricular support",
              "r": "You read the low flow as RV failure limiting preload, supported the RV, respected the septal interaction with pump speed, escalated to mechanical RV support when needed and corrected inflow suction."
            },
            "eAlive": {
              "end": "alive",
              "t": "Supported, then rushed",
              "r": "Flow is restored, but weaning RV support too quickly left a recurrent-low-flow risk."
            },
            "eSuction": {
              "end": "harm",
              "t": "Suction spiral",
              "r": "Chasing the flow number with more pump speed on an underfilled LV drove suction events, a worsening septal shift and RV collapse."
            },
            "eDead": {
              "end": "dead",
              "t": "Pump without preload",
              "r": "Clamping the outflow, or accepting low flow with an unsupported RV, left the LVAD unable to deliver — the pump cannot manufacture the preload the failing RV will not provide."
            },
            "s1": {
              "q": "What is your first specific move to lower the RV afterload?",
              "opts": [
                {
                  "a": "Give a systemic vasoconstrictor to raise the blood pressure",
                  "to": "eSuction",
                  "k": "fail",
                  "r": "A systemic pressor does not unload the RV and can worsen the pulmonary-to-systemic balance."
                },
                {
                  "a": "Correct hypoxia/acidosis and lower PVR",
                  "to": "n3",
                  "k": "good",
                  "r": "The fastest wins on RV afterload are ventilation, acid-base and selective pulmonary vasodilation."
                }
              ]
            },
            "s2": {
              "q": "How do you titrate pump speed while the RV recovers?",
              "opts": [
                {
                  "a": "Titrate speed to a midline septum and balanced LV filling on TEE",
                  "to": "n4",
                  "k": "good",
                  "r": "Speed is set by septal position and filling, not by chasing the highest flow number."
                },
                {
                  "a": "Set the highest speed the console allows for maximum flow",
                  "to": "eSuction",
                  "k": "fail",
                  "r": "Maximum speed on a poorly-filled LV drives suction and a worse septal shift."
                }
              ]
            }
          },
          "summary": "Low flow just after LVAD activation with a high CVP, small LV and leftward septum is RV failure limiting pump preload — the pump cannot create preload. Support the RV (inotropy, lower PVR, volume, rhythm) and adjust speed rather than reflexively speeding up, which pulls the septum left and worsens RV output. Escalate to temporary mechanical RV support when medical optimisation fails, and treat recurrent inflow-wall contact as a mechanical suction/malposition problem.",
          "keyPoints": [
            "Low LVAD flow + high CVP + small LV + leftward septum = RV failure limiting preload.",
            "The pump cannot create preload — support the RV and adjust speed; do not reflexively increase speed.",
            "Over-speeding pulls the septum left, distorts RV geometry and worsens RV output (ventricular interdependence).",
            "When the RV cannot be optimised medically, escalate to temporary mechanical RV support (RVAD/ECMO).",
            "Recurrent inflow-cannula wall contact/suction is a mechanical device-heart problem — correct filling/speed and cannula orientation."
          ],
          "links": [
            [
              "Day 10 circuit",
              "#/day/10"
            ],
            [
              "Continuous-flow LVAD implantation",
              "#/surgery/lvad"
            ],
            [
              "IABP & support lab",
              "#/physiology/iabp"
            ],
            [
              "MOMENTUM 3 trial",
              "#/trials/momentum3"
            ]
          ]
        },
        {
          "id": "cr-d11",
          "day": 11,
          "title": "The Chest That Keeps Filling",
          "setting": "OR / ICU · after separation from CPB",
          "brief": "Chest-tube output is brisk. The ACT has normalised, the field shows diffuse microvascular ooze, and viscoelastic testing shows weak clot amplitude with a low fibrinogen contribution.",
          "vitals": [
            [
              "Chest tube",
              "brisk"
            ],
            [
              "ACT",
              "normalised"
            ],
            [
              "Field",
              "diffuse ooze"
            ],
            [
              "Fibrinogen",
              "low"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "First, the protamine has just been given and the MAP suddenly falls with rising PA pressure and an acutely dilating RV. What is this?",
              "v": [
                [
                  "MAP",
                  "38 ↓"
                ],
                [
                  "PA",
                  "rising"
                ],
                [
                  "RV",
                  "dilating"
                ],
                [
                  "Trigger",
                  "protamine"
                ]
              ],
              "opts": [
                {
                  "a": "Hypovolaemia from surgical blood loss with low filling pressures",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Hypovolaemia does not raise PA pressure and dilate the RV as protamine goes in."
                },
                {
                  "a": "Protamine pulmonary hypertension with RV failure",
                  "to": "n2",
                  "k": "good",
                  "r": "The temporal link to protamine, rising PA pressure and a dilating RV identify the reaction phenotype."
                },
                {
                  "a": "Expected post-bypass physiology",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A sharp MAP fall with acute pulmonary hypertension on protamine is not 'expected'."
                }
              ]
            },
            "n1b": {
              "q": "The picture is a protamine reaction. What is the immediate coordinated action?",
              "opts": [
                {
                  "a": "Stop protamine and prepare to resume CPB",
                  "to": "n2",
                  "k": "good",
                  "r": "Stop the trigger and preserve the bypass rescue path."
                },
                {
                  "a": "Push protamine faster to finish reversal",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Accelerating the trigger deepens pulmonary hypertension and arrests the RV."
                }
              ]
            },
            "n2": {
              "q": "The reaction settles. Now the bleeding: how do you read the weak clot with low fibrinogen contribution?",
              "opts": [
                {
                  "a": "Target the measured clot deficit while inspecting the operative field",
                  "to": "s1",
                  "k": "good",
                  "r": "The pattern indicates impaired clot strength; target the deficit and inspect the surgical field together."
                },
                {
                  "a": "Residual heparin despite a normalised ACT — give more protamine",
                  "to": "n2b",
                  "k": "bad",
                  "r": "A normalised ACT argues against residual heparin; more protamine can itself impair platelets."
                },
                {
                  "a": "A reason to ignore the surgical field",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Coagulopathy and a surgical source can coexist — never stop inspecting the field."
                }
              ]
            },
            "n2b": {
              "q": "Empiric protamine did not help and the ooze continues. Reframe?",
              "opts": [
                {
                  "a": "Replace the measured deficits and inspect the field",
                  "to": "n3",
                  "k": "good",
                  "r": "You return to targeted, test-guided haemostasis."
                },
                {
                  "a": "Continue empiric protamine despite a normalised ACT",
                  "to": "eDIC",
                  "k": "fail",
                  "r": "Excess protamine worsens platelet function and the coagulopathy deepens."
                }
              ]
            },
            "n3": {
              "q": "Which evidence-consistent fibrinogen strategy is reasonable where available?",
              "opts": [
                {
                  "a": "Empiric fibrinogen for every bypass patient regardless of bleeding",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Blanket replacement generalises beyond the trial's actively-bleeding population."
                },
                {
                  "a": "No fibrinogen replacement under any circumstance",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Withholding indicated fibrinogen in a bleeding, hypofibrinogenaemic patient is harmful."
                },
                {
                  "a": "Use fibrinogen concentrate for measured hypofibrinogenaemia",
                  "to": "s2",
                  "k": "good",
                  "r": "FIBRES supports fibrinogen concentrate as a noninferior replacement option in this bleeding population."
                }
              ]
            },
            "n3b": {
              "q": "The extreme options are both wrong. What is the measured approach?",
              "opts": [
                {
                  "a": "Replace measured fibrinogen with concentrate or cryoprecipitate",
                  "to": "n4",
                  "k": "good",
                  "r": "You target replacement to the actual, tested deficit."
                },
                {
                  "a": "Transfuse fixed ratios without reassessing the measured clot deficit",
                  "to": "eDIC",
                  "k": "fail",
                  "r": "Blind fixed-ratio transfusion without targeting the deficit prolongs the coagulopathy."
                }
              ]
            },
            "n4": {
              "q": "You correct fibrinogen and platelets, but a focal, brisk, pulsatile stream now stands out from the diffuse ooze. What does that change?",
              "opts": [
                {
                  "a": "Continue product despite a focal pulsatile source",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Blood products cannot close an arterial or suture-line defect."
                },
                {
                  "a": "Treat the focal pulsatile bleed as a surgical source",
                  "to": "s3",
                  "k": "good",
                  "r": "A focal, brisk bleed on a corrected profile is a suture line or vessel, not coagulopathy."
                }
              ]
            },
            "n4b": {
              "q": "More product is not stopping a focal pulsatile bleed. Now?",
              "opts": [
                {
                  "a": "Control the surgical bleeding source now",
                  "to": "n5",
                  "k": "good",
                  "r": "Persistent focal bleeding is corrected mechanically."
                },
                {
                  "a": "Continue blind transfusions indefinitely",
                  "to": "eExsang",
                  "k": "fail",
                  "r": "Transfusing around a surgical bleeder exsanguinates the patient."
                }
              ]
            },
            "n5": {
              "q": "The profile is corrected and the field is dry after surgical control. What decides between more observation and re-exploration if output climbs again?",
              "opts": [
                {
                  "a": "Use a fixed haemoglobin threshold without output trend or repeat testing",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient does well, but a haemoglobin number does not tell you whether there is a surgical source to control."
                },
                {
                  "a": "Use drain-output trend plus repeat viscoelastic testing",
                  "to": "eGood",
                  "k": "good",
                  "r": "You use the coupled trend, not a single value, to make the re-exploration call."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Bleeding controlled logically",
              "r": "You recognised and stopped the protamine reaction, treated the tested coagulopathy rather than empiric protamine, used fibrinogen appropriately, and switched to surgical control the moment a focal source declared itself."
            },
            "eAlive": {
              "end": "alive",
              "t": "Dry, but decided on one number",
              "r": "The bleeding is controlled, but leaning on a haemoglobin threshold for the re-exploration decision is a thin substitute for the output trend and coagulation profile."
            },
            "eArrest": {
              "end": "dead",
              "t": "Protamine-driven arrest",
              "r": "Pushing the trigger on an evolving protamine reaction deepened the pulmonary hypertension and arrested the RV."
            },
            "eDIC": {
              "end": "harm",
              "t": "Deepened coagulopathy",
              "r": "Blind protamine or fixed-ratio transfusion without targeting the tested deficit prolonged the bleeding."
            },
            "eExsang": {
              "end": "dead",
              "t": "Exsanguination",
              "r": "Transfusing around a focal surgical bleeder cannot close a vessel — the patient exsanguinated while the products flowed."
            },
            "s1": {
              "q": "What confirms the coagulopathy pattern before you commit product?",
              "opts": [
                {
                  "a": "Confirm the clot deficit with viscoelastic testing",
                  "to": "n3",
                  "k": "good",
                  "r": "The trace tells you which component is deficient so replacement is targeted, not scattergun."
                },
                {
                  "a": "Use a single haematocrit to define the clot defect",
                  "to": "n2b",
                  "k": "bad",
                  "r": "A haematocrit says nothing about which arm of the coagulation profile is failing."
                }
              ]
            },
            "s2": {
              "q": "You give targeted fibrinogen. How do you know it worked?",
              "opts": [
                {
                  "a": "Assume correction without repeat testing or drain reassessment",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Assuming correction is how a persisting surgical bleed hides behind 'treated' coagulopathy."
                },
                {
                  "a": "Repeat viscoelastic testing and trend clot amplitude with drain output",
                  "to": "n4",
                  "k": "good",
                  "r": "Re-testing plus the clinical trend confirms the deficit is corrected rather than assuming it."
                }
              ]
            },
            "s3": {
              "q": "How do you tell that focal stream apart from the diffuse ooze at the bedside?",
              "opts": [
                {
                  "a": "A focal pulsatile source despite a corrected clot profile",
                  "to": "n5",
                  "k": "good",
                  "r": "A focal, pulsatile, disproportionate bleed on a corrected profile reads as surgical, not medical."
                },
                {
                  "a": "Treat focal and diffuse bleeding as indistinguishable and keep transfusing",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Failing to separate surgical from medical bleeding delays the only fix a vessel needs."
                }
              ]
            }
          },
          "summary": "The bleeding chest after CPB demands you separate causes and treat each in its own currency. A sudden MAP fall with pulmonary hypertension and RV dilation on protamine is a protamine reaction — stop the trigger and protect the bypass route. Diffuse ooze with weak clot and low fibrinogen is a coagulopathy to be corrected by test-guided replacement (fibrinogen concentrate is a noninferior option in active bleeding), not by empiric protamine. And a focal, brisk bleed on a corrected profile is surgical — blood products cannot close a vessel.",
          "keyPoints": [
            "Sudden MAP fall + pulmonary hypertension + RV dilation on protamine = protamine reaction: stop it, support, be ready to resume CPB.",
            "A normalised ACT argues against residual heparin — more protamine can itself impair platelets.",
            "Diffuse ooze with weak clot / low fibrinogen: correct the tested deficit; fibrinogen concentrate is a noninferior option (FIBRES) in active bleeding.",
            "A focal, brisk bleed on a corrected coagulation profile is surgical — products cannot close a suture line or vessel.",
            "Decide re-exploration on the output rate/trend and repeat viscoelastic testing, not a single haemoglobin value."
          ],
          "links": [
            [
              "Day 11 circuit",
              "#/day/11"
            ],
            [
              "TEG / ROTEM lab",
              "#/physiology/teg-rotem"
            ],
            [
              "Going on & off CPB",
              "#/surgery/bypass"
            ],
            [
              "FIBRES trial",
              "#/trials/fibres"
            ]
          ]
        },
        {
          "id": "cr-d12",
          "day": 12,
          "title": "The Rhythm Keeps Changing",
          "setting": "Cardiac ICU · POD2 after combined aortic + mitral valve surgery",
          "brief": "Runs of AF at 150 alternate with pauses; then a wide escape at 38 with AV dissociation appears. The MAP swings between 45 and 80. Epicardial wires are in place.",
          "vitals": [
            [
              "Rhythm",
              "AF 150 / CHB 38"
            ],
            [
              "MAP",
              "45-80"
            ],
            [
              "Wires",
              "present"
            ],
            [
              "POD",
              "2"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "AF at 150 with a MAP of 45 and cool peripheries — first move?",
              "v": [
                [
                  "Rhythm",
                  "AF 150"
                ],
                [
                  "MAP",
                  "45"
                ],
                [
                  "Perfusion",
                  "cool"
                ],
                [
                  "Stability",
                  "unstable"
                ]
              ],
              "opts": [
                {
                  "a": "Use IV diltiazem for rate control despite shock",
                  "to": "eShock",
                  "k": "fail",
                  "r": "A calcium-channel blocker can drop an already low MAP further in unstable AF."
                },
                {
                  "a": "Synchronised cardioversion for unstable AF",
                  "to": "n2",
                  "k": "good",
                  "r": "An unstable tachyarrhythmia is cardioverted, not slowly rate-controlled."
                },
                {
                  "a": "Digoxin load and wait",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Digoxin is far too slow for an unstable patient at a MAP of 45."
                }
              ]
            },
            "n1b": {
              "q": "The patient is unstable and getting worse while you wait. Escalate?",
              "opts": [
                {
                  "a": "Cardiovert synchronously now",
                  "to": "n2",
                  "k": "good",
                  "r": "You act on the instability rather than waiting for a slow drug."
                },
                {
                  "a": "Keep waiting for the digoxin",
                  "to": "eShock",
                  "k": "fail",
                  "r": "Waiting on digoxin in unstable AF lets the MAP collapse."
                }
              ]
            },
            "n2": {
              "q": "A wide escape at 38 with AV dissociation follows — the conduction axis sits near the aortic/mitral annulus. Action?",
              "opts": [
                {
                  "a": "Use AV-sequential epicardial pacing",
                  "to": "s1",
                  "k": "good",
                  "r": "Complete block after valve surgery near the membranous septum needs immediate pacing, and the stiff post-op LV needs the atrial kick."
                },
                {
                  "a": "Atropine and observe",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Atropine is unreliable for infranodal block after valve surgery and wastes time with wires in place."
                },
                {
                  "a": "Use isoproterenol alone without securing the rhythm",
                  "to": "n2b",
                  "k": "bad",
                  "r": "A chronotropic infusion is a poor substitute for available epicardial pacing in surgical CHB."
                }
              ]
            },
            "n2b": {
              "q": "The drug approach is not securing the rhythm and wires are sitting right there. Use them?",
              "opts": [
                {
                  "a": "Use the epicardial wires for AV-sequential pacing",
                  "to": "n3",
                  "k": "good",
                  "r": "You use the immediate, reliable pacing option."
                },
                {
                  "a": "Use escalating drugs rather than epicardial wires",
                  "to": "eShock",
                  "k": "fail",
                  "r": "Chasing drugs in surgical CHB with wires available loses precious time and pressure."
                }
              ]
            },
            "n3": {
              "q": "On VVI the MAP is worse than on DDD. Why?",
              "opts": [
                {
                  "a": "VVI is too fast to permit adequate ventricular filling",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Rate is not the issue — the loss of atrial contribution is."
                },
                {
                  "a": "Assume wire fracture despite consistent ventricular capture",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A fracture would show as loss of capture, not a DDD-versus-VVI MAP difference."
                },
                {
                  "a": "Loss of atrial kick lowers output in the stiff LV",
                  "to": "s2",
                  "k": "good",
                  "r": "Ventricular-only pacing that loses AV synchrony markedly reduces output in the post-AVR ventricle."
                }
              ]
            },
            "n3b": {
              "q": "You are troubleshooting the wrong thing. What restores the MAP?",
              "opts": [
                {
                  "a": "Restore AV synchrony with DDD pacing and atrial kick",
                  "to": "n4",
                  "k": "good",
                  "r": "You restore the atrial contribution the stiff LV depends on."
                },
                {
                  "a": "Continue VVI despite loss of AV synchrony and output",
                  "to": "eLowOutput",
                  "k": "fail",
                  "r": "Leaving a synchrony-dependent ventricle on VVI sustains a low-output state."
                }
              ]
            },
            "n4": {
              "q": "The pacer spikes are now present but no QRS follows some of them. What is this and what do you check?",
              "opts": [
                {
                  "a": "Failure to sense despite visible pacing spikes",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Spikes without capture is a capture problem, not a sensing one; you are adjusting the wrong control."
                },
                {
                  "a": "Check capture, output and electrolytes",
                  "to": "n5",
                  "k": "good",
                  "r": "Pacing artefacts without depolarisation define failure to capture; capture needs an intact circuit, adequate output and excitable myocardium."
                },
                {
                  "a": "Normal pacing",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Spikes not followed by a QRS are never normal capture."
                }
              ]
            },
            "n4b": {
              "q": "Mislabelling the malfunction sent you to the wrong knob. Re-read the tracing?",
              "opts": [
                {
                  "a": "Raise output and check the pacing circuit for capture failure",
                  "to": "n5",
                  "k": "good",
                  "r": "You correct the diagnosis and the control you adjust."
                },
                {
                  "a": "Keep adjusting sensitivity despite spikes without QRS capture",
                  "to": "eLowOutput",
                  "k": "fail",
                  "r": "Adjusting sensitivity does nothing for a capture problem; the patient stays under-paced."
                }
              ]
            },
            "n5": {
              "q": "Capture is unreliable and the patient is unstable while you correct reversible causes. What is the escalation?",
              "opts": [
                {
                  "a": "Turn pacing off and await recovery despite instability",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Withdrawing pacing from a dependent patient in CHB risks asystole."
                },
                {
                  "a": "Use reliable backup pacing while correcting reversible causes",
                  "to": "n6",
                  "k": "good",
                  "r": "An unstable patient cannot wait on unreliable ventricular activation — secure dependable pacing."
                }
              ]
            },
            "n6": {
              "q": "Block persists past several days with a new LBBB and a prolonged HV interval. Decision?",
              "opts": [
                {
                  "a": "Keep temporary pacing indefinitely",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient is paced and alive, but indefinite temporary wires carry infection and dislodgement risk when a device is indicated."
                },
                {
                  "a": "Plan permanent pacing after the observation window",
                  "to": "eGood",
                  "k": "good",
                  "r": "Post-valve block that has not recovered in the ~5-7 day window, with persistent CHB/new LBBB and long HV, predicts non-recovery."
                },
                {
                  "a": "Remove wires despite persistent high-risk conduction disease",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Removing pacing from persistent post-valve CHB risks a fatal pause."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Rhythm secured, device planned",
              "r": "You cardioverted unstable AF, paced AV-sequentially for surgical CHB, restored the atrial kick the stiff LV needed, correctly diagnosed failure to capture, secured reliable backup pacing and recognised non-recovery warranting a permanent device."
            },
            "eAlive": {
              "end": "alive",
              "t": "Paced, decision deferred",
              "r": "The patient is stable on pacing, but leaving indefinite temporary wires instead of a device when block will not recover carries avoidable risk."
            },
            "eShock": {
              "end": "harm",
              "t": "Rate control crashed the pressure",
              "r": "Treating unstable AF with a nodal-blocking drug or a slow agent dropped an already marginal MAP toward collapse."
            },
            "eLowOutput": {
              "end": "harm",
              "t": "Sustained low output",
              "r": "Leaving a synchrony-dependent ventricle on VVI, or mis-adjusting the pacer, kept the patient in a low-output state."
            },
            "eArrest": {
              "end": "dead",
              "t": "Pacing withdrawn",
              "r": "Turning off or removing pacing from a pacing-dependent patient in complete heart block precipitated asystole."
            },
            "s1": {
              "q": "You start epicardial pacing. What do you set first to make it safe?",
              "opts": [
                {
                  "a": "The lowest possible output to save the battery",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Pacing at the minimum output risks loss of capture in a dependent patient."
                },
                {
                  "a": "Set safe output, rate and lead selection",
                  "to": "n3",
                  "k": "good",
                  "r": "Safe pacing starts with confirmed capture margin, correct lead selection and a backup rate."
                }
              ]
            },
            "s2": {
              "q": "With DDD restored, how do you optimise the atrioventricular delay?",
              "opts": [
                {
                  "a": "Optimise AV delay to support LV filling",
                  "to": "n4",
                  "k": "good",
                  "r": "Tuning the AV delay recovers the atrial kick the pressure-overloaded LV depends on."
                },
                {
                  "a": "Leave the AV delay at a random default and ignore it",
                  "to": "n3b",
                  "k": "bad",
                  "r": "An untuned AV delay squanders the atrial contribution you switched to DDD to regain."
                }
              ]
            }
          },
          "summary": "Post-valve conduction disease demands rapid, correct rhythm management. Unstable AF is cardioverted, not slowly rate-controlled with nodal blockers that drop the pressure. Complete heart block after aortic/mitral surgery needs immediate pacing — AV-sequential (DDD), because the stiff, pressure-overloaded ventricle depends on the atrial kick, so VVI underperforms. Read pacer malfunction precisely (spikes without capture = failure to capture), secure reliable backup, and move to a permanent device when block persists beyond the recovery window with a new LBBB and prolonged HV.",
          "keyPoints": [
            "Haemodynamically unstable AF = synchronised cardioversion; avoid nodal blockers that drop a marginal MAP.",
            "Complete heart block after valve surgery needs immediate pacing — AV-sequential (DDD), not ventricular-only.",
            "The stiff post-valve LV is AV-synchrony dependent; VVI loses the atrial kick and drops output — restore DDD.",
            "Pacing spikes without a following QRS = failure to capture: check circuit, output/threshold and electrolytes (not sensitivity).",
            "Persistent post-valve block beyond ~5-7 days with new LBBB / long HV predicts non-recovery — implant a permanent pacemaker."
          ],
          "links": [
            [
              "Day 12 circuit",
              "#/day/12"
            ],
            [
              "Pacing lab",
              "#/physiology/pacing"
            ],
            [
              "ECG interpretation lab",
              "#/physiology/ecg"
            ],
            [
              "SURTAVI trial",
              "#/trials/surtavi"
            ]
          ]
        },
        {
          "id": "cr-d13",
          "day": 13,
          "title": "He Looks Fine But the Numbers Are Terrible",
          "setting": "Cardiac ICU · 3 h post-CABG",
          "brief": "The patient is awake, warm and chatting. But the cardiac index is 1.7, lactate has climbed 2.1 to 3.4, the pulse pressure is narrowing, and chest-tube output just fell from 120 mL/h to almost nothing.",
          "vitals": [
            [
              "CI",
              "1.7 ↓"
            ],
            [
              "Lactate",
              "3.4 ↑"
            ],
            [
              "Pulse press",
              "narrow"
            ],
            [
              "Drains",
              "stopped"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "The reassuring exam versus the failing numbers — which leads?",
              "v": [
                [
                  "Exam",
                  "warm, awake"
                ],
                [
                  "CI",
                  "1.7"
                ],
                [
                  "Lactate",
                  "3.4"
                ],
                [
                  "Drains",
                  "quiet"
                ]
              ],
              "opts": [
                {
                  "a": "Trust the comfortable exam; recheck labs in an hour",
                  "to": "n1b",
                  "k": "bad",
                  "r": "A flattering exam over failing numbers is exactly how a compensated patient is missed until arrest."
                },
                {
                  "a": "Act on the coupled low-output physiology",
                  "to": "s1",
                  "k": "good",
                  "r": "Warmth and conversation reflect catecholamine-driven compensation, not adequacy; the coupled numbers lead."
                },
                {
                  "a": "Sedate for presumed agitation",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Sedating away the compensatory drive on a failing circulation can precipitate collapse."
                }
              ]
            },
            "n1b": {
              "q": "You almost waited an hour. What tips the decision back to acting now?",
              "opts": [
                {
                  "a": "Act on concordant CI, lactate, pulse-pressure and drain trends",
                  "to": "n2",
                  "k": "good",
                  "r": "The convergence of coupled signals overrides the comfortable exam."
                },
                {
                  "a": "Defer action because the bedside exam still appears reassuring",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Anchoring on the exam lets the compensated state decompensate to arrest."
                }
              ]
            },
            "n2": {
              "q": "The chest-tube output fell sharply as filling pressures rose and converged. Leading diagnosis?",
              "opts": [
                {
                  "a": "Localised tamponade from retained clot",
                  "to": "s2",
                  "k": "good",
                  "r": "A sudden fall in previously brisk drainage with rising, converging filling pressures is tamponade until proven otherwise."
                },
                {
                  "a": "The bleeding has resolved — reassure the family",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Abruptly quiet drains with a failing CI is retained blood, not resolution."
                },
                {
                  "a": "Vasoplegia",
                  "to": "n2b",
                  "k": "bad",
                  "r": "Vasoplegia gives a low SVR and wide pulse pressure — the opposite of this converging, narrow-pulse picture."
                }
              ]
            },
            "n2b": {
              "q": "That framing does not fit converging pressures and quiet drains. Reconsider?",
              "opts": [
                {
                  "a": "Localised tamponade from a retained clot",
                  "to": "n3",
                  "k": "good",
                  "r": "You correctly read the obstructive physiology."
                },
                {
                  "a": "Keep treating it as vasoplegia with more vasopressor",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Pouring in vasopressor for tamponade delays the only fix — decompression."
                }
              ]
            },
            "n3": {
              "q": "Bedside TTE shows no large circumferential effusion. Now what?",
              "opts": [
                {
                  "a": "Exclude tamponade because TTE lacks a circumferential effusion",
                  "to": "n3b",
                  "k": "bad",
                  "r": "A negative TTE does not exclude a localised posterior collection."
                },
                {
                  "a": "Give 2 L of crystalloid and wait",
                  "to": "n3b",
                  "k": "bad",
                  "r": "Volume is a temporising crutch, not treatment, and delays decompression."
                },
                {
                  "a": "Pursue TEE or act on suspected localised tamponade",
                  "to": "s3",
                  "k": "good",
                  "r": "TTE can miss a loculated posterior clot compressing the LA/RA; the evolving physiology drives the call, not a clean surface echo."
                }
              ]
            },
            "n3b": {
              "q": "The physiology keeps worsening despite the 'reassuring' TTE. What overrides the image?",
              "opts": [
                {
                  "a": "Let worsening obstructive physiology override the surface echo now",
                  "to": "n4",
                  "k": "good",
                  "r": "You let the coupled physiology, not a limited image, lead."
                },
                {
                  "a": "Continue observing because the surface echo appears reassuring",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Trusting a TTE that cannot see the clot lets the tamponade progress to arrest."
                }
              ]
            },
            "n4": {
              "q": "Before you commit, how do you separate this from the other post-op low-output causes at the bedside?",
              "opts": [
                {
                  "a": "Assume pump failure and escalate inotropy without checking obstructive or RV patterns",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Escalating inotropes for obstructive tamponade treats the wrong mechanism."
                },
                {
                  "a": "Use coupled filling-pressure, ventricular, SVR and drain patterns",
                  "to": "n5",
                  "k": "good",
                  "r": "Reading the pattern of coupled signals distinguishes the four shock phenotypes."
                }
              ]
            },
            "n4b": {
              "q": "Inotropes are not moving an obstructive process. What does the pattern actually show?",
              "opts": [
                {
                  "a": "Converging pressures plus quiet drains indicate tamponade",
                  "to": "n5",
                  "k": "good",
                  "r": "You re-read the coupled signals to the obstructive answer."
                },
                {
                  "a": "Continue inotropes and pressors despite an obstructive pattern",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Chemical support cannot relieve a compressive clot; the patient arrests."
                }
              ]
            },
            "n5": {
              "q": "The CI is now 1.4, MAP 52, refractory to fluid and pressor. Best action?",
              "opts": [
                {
                  "a": "Reopen the chest before arrest",
                  "to": "eGood",
                  "k": "good",
                  "r": "The senior owns the reopen-before-arrest decision when converging pressures, a falling CI and quiet drains resist the algorithm."
                },
                {
                  "a": "Escalate to three pressors and observe",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Stacking pressors on obstructive shock delays the only definitive move."
                },
                {
                  "a": "Transport to the CT scanner to confirm first",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Moving a crashing tamponade patient to CT before decompression courts arrest in the scanner."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Reopened before the arrest",
              "r": "You trusted the coupled numbers over a flattering exam, read tamponade despite a clean TTE, distinguished it from the other shock phenotypes and reopened the chest before the arrest rather than after."
            },
            "eAlive": {
              "end": "alive",
              "t": "Rescued late",
              "r": "Decompression happened, but only after the physiology had deteriorated further than it needed to."
            },
            "eArrest": {
              "end": "dead",
              "t": "Arrested on the algorithm",
              "r": "Trusting the exam or a negative TTE, or stacking chemical support on obstructive shock, let a relievable tamponade progress to cardiac arrest."
            },
            "s1": {
              "q": "What do you do in the next minutes while you work out the cause?",
              "opts": [
                {
                  "a": "Escalate monitoring, resuscitate and alert senior/OR teams now",
                  "to": "n2",
                  "k": "good",
                  "r": "A compensated low-output patient can crash fast; mobilise help and resources before the diagnosis is certain."
                },
                {
                  "a": "Wait quietly for the next set of numbers before telling anyone",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Silence and delay are how a compensated patient decompensates unwitnessed."
                }
              ]
            },
            "s2": {
              "q": "What single bedside sign best supports tamponade over the alternatives here?",
              "opts": [
                {
                  "a": "Warm vasoplegia with widened pulse pressure and active drain output",
                  "to": "n2b",
                  "k": "bad",
                  "r": "That pattern points to vasoplegia, not the obstructive physiology of tamponade."
                },
                {
                  "a": "Converging pressures, narrow pulse pressure and quiet drains",
                  "to": "n3",
                  "k": "good",
                  "r": "Convergence of filling pressures with quiet drains is the fingerprint of a compressive collection."
                }
              ]
            },
            "s3": {
              "q": "You call for TEE but it will take time. What do you do meanwhile?",
              "opts": [
                {
                  "a": "Resuscitate and prepare to reopen without waiting for TEE",
                  "to": "n4",
                  "k": "good",
                  "r": "A crashing tamponade is treated on the physiology; imaging confirms, it does not gate, the rescue."
                },
                {
                  "a": "Delay all intervention until TEE confirms the suspected obstruction",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Waiting on imaging in a crashing obstructive shock lets the patient arrest first."
                }
              ]
            }
          },
          "summary": "The dangerous post-op patient is the one who looks well while the coupled numbers fail — warmth and conversation are catecholamine compensation, not adequacy. A sharp fall in previously brisk drainage with rising, converging filling pressures is localised tamponade until proven otherwise, and a clean TTE does not exclude a posterior loculated clot. Distinguish the four low-output phenotypes by their coupled signals, and when a falling CI resists fluid and pressor, reopen the chest before the arrest, not after.",
          "keyPoints": [
            "A compensated low-output state can look deceptively well — trust the coupled numbers (CI, lactate, pulse pressure, drain trend) over a flattering exam.",
            "Sudden fall in brisk drainage + rising, converging filling pressures = localised tamponade until proven otherwise.",
            "A negative TTE does NOT exclude a posterior/loculated clot — get TEE or act on the physiology.",
            "Separate tamponade, RV failure, vasoplegia and pump failure by their coupled signals, not a single number.",
            "Refractory falling CI with quiet drains = reopen the chest before arrest, not after — the senior owns that call."
          ],
          "links": [
            [
              "Day 13 circuit",
              "#/day/13"
            ],
            [
              "Post-bypass shock lab",
              "#/physiology/shock"
            ],
            [
              "TRICS III trial",
              "#/trials/trics3"
            ]
          ]
        },
        {
          "id": "cr-d14",
          "day": 14,
          "title": "The Capstone Deterioration",
          "setting": "OR / ICU · after a complex composite aortic root replacement (Bentall)",
          "brief": "After root replacement with coronary-button re-implantation, the patient develops new inferior ST elevation, a rising CVP, falling LV filling, an unstable rhythm and, soon after, a filling chest drain. Every system you have studied is now in play at once.",
          "vitals": [
            [
              "MAP",
              "52"
            ],
            [
              "CVP",
              "18 ↑"
            ],
            [
              "ST",
              "inferior ↑"
            ],
            [
              "Rhythm",
              "unstable"
            ]
          ],
          "start": "n1",
          "nodes": {
            "n1": {
              "q": "New inferior ST elevation with acute RV strain after a Bentall — what unifying TECHNICAL diagnosis comes first?",
              "v": [
                [
                  "ST",
                  "inferior ↑"
                ],
                [
                  "RV",
                  "strained"
                ],
                [
                  "CVP",
                  "18"
                ],
                [
                  "Op",
                  "Bentall"
                ]
              ],
              "opts": [
                {
                  "a": "Isolated distributive shock with no technical cause",
                  "to": "n1b",
                  "k": "bad",
                  "r": "Calling a territory-specific change 'distributive' delays correcting a time-critical coronary problem."
                },
                {
                  "a": "Right coronary-button compromise causing inferior/RV ischaemia",
                  "to": "n2",
                  "k": "good",
                  "r": "Inferior ischaemia plus acute RV failure after root work localises to the right coronary button until proven otherwise."
                },
                {
                  "a": "Expected post-operative physiology",
                  "to": "n1b",
                  "k": "bad",
                  "r": "New inferior ST elevation with RV strain after a Bentall is never 'expected'."
                }
              ]
            },
            "n1b": {
              "q": "You nearly explained away a coronary catastrophe. What does the inferior/RV pattern after a Bentall mean?",
              "opts": [
                {
                  "a": "Inspect urgently for right coronary-button compromise",
                  "to": "n2",
                  "k": "good",
                  "r": "You localise to the reimplanted right button."
                },
                {
                  "a": "Treat as vasoplegia and escalate vasopressors further",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Vasopressor raises demand on an ischaemic RV while the button stays obstructed."
                }
              ]
            },
            "n2": {
              "q": "What should happen immediately?",
              "opts": [
                {
                  "a": "Reassess button geometry and coronary flow on bypass",
                  "to": "s1",
                  "k": "good",
                  "r": "The suspected lesion is mechanical and needs immediate inspection and restoration of coronary perfusion."
                },
                {
                  "a": "Close the chest and trend troponin",
                  "to": "eInfarct",
                  "k": "fail",
                  "r": "Trending troponin while the RV infarcts wastes the salvage window."
                },
                {
                  "a": "Treat RV strain only with inhaled pulmonary vasodilation",
                  "to": "n2b",
                  "k": "bad",
                  "r": "A pulmonary vasodilator does not unkink an obstructed coronary button."
                }
              ]
            },
            "n2b": {
              "q": "The vasodilator did not touch the ischaemia. Commit to the mechanical fix?",
              "opts": [
                {
                  "a": "Inspect button geometry and flow on bypass",
                  "to": "n3",
                  "k": "good",
                  "r": "You go to the mechanical source."
                },
                {
                  "a": "Continue medical therapy without evaluating coronary-button flow",
                  "to": "eInfarct",
                  "k": "fail",
                  "r": "Medical therapy cannot reperfuse a kinked button; the RV infarcts."
                }
              ]
            },
            "n3": {
              "q": "The button is kinked from tension. What is the principle for the fix?",
              "opts": [
                {
                  "a": "Leave the kink and support pressure pharmacologically",
                  "to": "eInfarct",
                  "k": "fail",
                  "r": "A tense button does not open with pressure; the territory infarcts."
                },
                {
                  "a": "Revise coronary-button geometry to eliminate kink and tension",
                  "to": "n4",
                  "k": "good",
                  "r": "Anastomotic geometry determines patency; a tense button is revised, not tolerated."
                }
              ]
            },
            "n4": {
              "q": "Flow is restored but the RV is still failing, with a high CVP and a small underfilled LV. Draw on Day 10 and Day 13 — what is the RV strategy?",
              "opts": [
                {
                  "a": "Optimise rhythm/preload, lower PVR and support RV contractility",
                  "to": "n5",
                  "k": "good",
                  "r": "The injured RV needs a coordinated recovery strategy, not more afterload — the same physiology as the LVAD-preload and post-bypass RV cases."
                },
                {
                  "a": "Load the RV hard with volume against a high PVR",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Over-distending a failing RV against high afterload worsens it — the Day 10/13 lesson."
                },
                {
                  "a": "Maximise nonexistent LVAD support instead of treating the failing RV",
                  "to": "n4b",
                  "k": "bad",
                  "r": "Reaching for a device that is not in the field wastes time the RV does not have."
                }
              ]
            },
            "n4b": {
              "q": "That worsened or wasted time on the RV. What actually helps a failing, ischaemic RV?",
              "opts": [
                {
                  "a": "Persist off pump with an overloaded RV and untreated high PVR",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "An unsupported failing RV spirals into ischaemia and dilation."
                },
                {
                  "a": "Lower PVR and optimise RV preload, rhythm and contractile support",
                  "to": "n5",
                  "k": "good",
                  "r": "You apply the coupled RV-support strategy from the earlier days."
                }
              ]
            },
            "n5": {
              "q": "The rhythm now shows complete heart block near the aortic annulus. Applying Day 12 — what do you do?",
              "opts": [
                {
                  "a": "Use VVI despite lower output from loss of AV synchrony",
                  "to": "n5b",
                  "k": "bad",
                  "r": "VVI loses the atrial kick the pressure-overloaded LV depends on."
                },
                {
                  "a": "Give atropine and wait",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "Atropine is unreliable for infranodal surgical block and wastes time with wires in place."
                },
                {
                  "a": "Restore AV synchrony with DDD epicardial pacing",
                  "to": "n6",
                  "k": "good",
                  "r": "Surgical CHB near the annulus needs immediate AV-sequential pacing, not ventricular-only or drugs."
                }
              ]
            },
            "n5b": {
              "q": "The MAP is worse on VVI. Fix it how?",
              "opts": [
                {
                  "a": "Leave VVI despite loss of AV synchrony and lower MAP",
                  "to": "eArrest",
                  "k": "fail",
                  "r": "A synchrony-dependent ventricle in a crashing patient cannot tolerate VVI."
                },
                {
                  "a": "Switch to DDD for AV synchrony",
                  "to": "n6",
                  "k": "good",
                  "r": "You recover the atrial contribution and the pressure improves."
                }
              ]
            },
            "n6": {
              "q": "Now the chest drain fills briskly. Viscoelastic testing shows low fibrinogen; the ACT is normal. Applying Day 11 — what do you do?",
              "opts": [
                {
                  "a": "Give empiric protamine despite a normal ACT and measured fibrinogen deficit",
                  "to": "n6b",
                  "k": "bad",
                  "r": "A normal ACT argues against residual heparin, and excess protamine impairs platelets."
                },
                {
                  "a": "Replace measured clot deficits and inspect for a surgical source",
                  "to": "n7",
                  "k": "good",
                  "r": "Treat the measured coagulopathy and look for a surgical bleeder together — not empiric protamine."
                },
                {
                  "a": "Transfuse blindly in fixed ratios and close",
                  "to": "n6b",
                  "k": "bad",
                  "r": "Blind product without targeting the deficit or finding the source prolongs bleeding."
                }
              ]
            },
            "n6b": {
              "q": "The bleeding continues and a focal, brisk stream now stands out near the root suture line. What does that change?",
              "opts": [
                {
                  "a": "Continue product therapy despite a focal root suture-line bleed",
                  "to": "eBleed",
                  "k": "fail",
                  "r": "Transfusing around a surgical root bleeder exsanguinates the patient."
                },
                {
                  "a": "Control the focal root surgical source directly",
                  "to": "n7",
                  "k": "good",
                  "r": "A focal, brisk bleed on a root reconstruction is surgical; products cannot close it."
                }
              ]
            },
            "n7": {
              "q": "Ischaemia corrected, RV supported, rhythm paced, bleeding controlled. Before leaving, how do you decide the patient is truly stable?",
              "opts": [
                {
                  "a": "Verify coronary, RV, rhythm and haemostasis together",
                  "to": "eGood",
                  "k": "good",
                  "r": "The capstone lesson: synthesise every system at once and verify the whole coupled state before you trust it."
                },
                {
                  "a": "Judge stability from MAP alone despite unresolved coupled systems",
                  "to": "eAlive",
                  "k": "ok",
                  "r": "The patient survives, but a single number cannot confirm four simultaneously-repaired systems."
                }
              ]
            },
            "eGood": {
              "end": "good",
              "t": "Every system integrated",
              "r": "You localised the coronary-button catastrophe, revised the geometry, supported the ischaemic RV with the physiology from earlier days, restored AV synchrony for surgical block and controlled the bleeding by mechanism — then verified the whole coupled state. This is the synthesis the whole plan was building toward."
            },
            "eAlive": {
              "end": "alive",
              "t": "Survived on a thin margin",
              "r": "All four problems were addressed, but judging stability on a single number after simultaneous multi-system repair leaves an avoidable blind spot."
            },
            "eInfarct": {
              "end": "harm",
              "t": "RV infarct",
              "r": "Trending troponin or medicating around a kinked coronary button let a correctable mechanical lesion become an established RV infarct."
            },
            "eArrest": {
              "end": "dead",
              "t": "Overwhelmed by the cascade",
              "r": "Explaining away the coronary lesion, over-loading the failing RV, or leaving surgical block unpaced let the multi-system cascade progress to arrest — each error was one you had already learned to avoid on an earlier day."
            },
            "eBleed": {
              "end": "dead",
              "t": "Exsanguination at the root",
              "r": "Transfusing around a focal surgical bleeder at the root reconstruction cannot close a suture line; the patient exsanguinated."
            },
            "s1": {
              "q": "As you go back on bypass to inspect the button, what protects the heart meanwhile?",
              "opts": [
                {
                  "a": "Inspect the button on the beating, ejecting heart under load",
                  "to": "eInfarct",
                  "k": "fail",
                  "r": "Working on a coronary button under full load risks worsening the ischaemia you are trying to fix."
                },
                {
                  "a": "Use bypass and myocardial protection during button inspection",
                  "to": "n3",
                  "k": "good",
                  "r": "Bypass support and myocardial protection buy the ischaemic territory time during the inspection and revision."
                }
              ]
            }
          },
          "summary": "The capstone forces you to run the whole curriculum at once. A new inferior/RV ischaemic pattern after a Bentall is a right coronary-button problem — mechanical, time-critical, revised not medicated. The failing RV then needs the same coupled support you learned for the LVAD-preload and post-bypass cases; surgical complete heart block needs immediate AV-sequential pacing for the atrial-kick-dependent ventricle; and a bleeding root is treated by tested deficit plus surgical-source control, not empiric protamine. Every error here is one an earlier day already taught you to avoid — and stability is confirmed on the coupled picture, never a single number.",
          "keyPoints": [
            "Inferior ST elevation + RV strain after a Bentall = right coronary-button compromise: inspect and revise geometry, do not medicate around it.",
            "Support the ischaemic RV with rhythm, preload, low PVR and contractility — never over-load it against high afterload (Day 10/13 physiology).",
            "Surgical complete heart block near the annulus = immediate AV-sequential (DDD) pacing for the atrial-kick-dependent LV (Day 12).",
            "A bleeding root with low fibrinogen and normal ACT = correct the tested deficit and find the surgical source — not empiric protamine (Day 11).",
            "Synthesis is the skill: integrate coronary, RV, rhythm and bleeding at once, and confirm stability on the coupled picture, not a single number."
          ],
          "links": [
            [
              "Day 14 circuit",
              "#/day/14"
            ],
            [
              "Bentall root replacement",
              "#/surgery/bentall"
            ],
            [
              "Post-bypass shock lab",
              "#/physiology/shock"
            ],
            [
              "NOBLE trial",
              "#/trials/noble"
            ]
          ]
        }
      ]
  };

  /* Surgery practice content is now owned by the standalone Surgeries engine
     (js/surgery/, isolated cs_surgery_* store, >=25 MCQs + >=20 cloze cards per
     operation). The thin per-operation cards/MCQs are no longer injected into the
     unified 14-day pools; CS_ADVANCED.operations remains only as lightweight
     day-integration metadata (title/day/link) for the dashboard and day view. */
})();
