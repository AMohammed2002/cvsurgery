/* Day 1-2 retrieval-v2 claim ledger.
   Compact claims are expanded only when the paired retrieval-card pack loads. */
"use strict";

(function defineDayOneTwoClaims() {
  function part(title) {
    return String(title || "part").toLowerCase().replace(/<[^>]+>/g, " ")
      .replace(/&[a-z0-9#]+;/gi, " ").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "").slice(0, 72) || "part";
  }
  function claim(claimId, title, tier, category, statement, extra) {
    return Object.assign({ claimId, partId: part(title), tier, category, statement }, extra || {});
  }
  window.FLASHCARD_CLAIM_PACKS_D1_D2 = [
    {
      source: { type: "lesson", id: "d1-chambers" },
      claims: [
        claim("d1.chambers.mediastinum.layers", "Mediastinal Geography", "core", "model", "The anterior, middle, and posterior mediastinal compartments predict the structures encountered with increasing operative depth."),
        claim("d1.chambers.mediastinum.redo-rv", "Mediastinal Geography", "applied-core", "rescue", "The right ventricle is the first chamber endangered during redo sternotomy because it lies immediately behind the sternum."),
        claim("d1.chambers.pericardium.rate-compliance", "The Pericardium", "core", "mechanism", "The rate of pericardial fluid accumulation, rather than volume alone, determines whether tamponade develops."),
        claim("d1.chambers.pericardium.acute-volume", "The Pericardium", "applied-core", "number", "Acute hemopericardium of approximately 150–200 mL can cause tamponade."),
        claim("d1.chambers.orientation.map", "Cardiac Chambers: Orientation", "core", "model", "Cardiac rotation places the right ventricle anteriorly, the left atrium posteriorly, the right atrium at the right border, and the left ventricle posterior-left with the apex."),
        claim("d1.chambers.atrial.true-septum", "Cardiac Chambers: Orientation", "applied-core", "definition", "Only the floor of the fossa ovalis is a true interatrial septum suitable for a transseptal crossing."),
        claim("d1.chambers.mitral.sondergaard", "Cardiac Chambers: Orientation", "applied-core", "definition", "Sondergaard's groove provides surgical access to the left atrium for mitral exposure."),
        claim("d1.chambers.great-vessels.isthmus", "Aortic Root and Great Vessel Relationships", "applied-core", "mechanism", "The tethered aortic isthmus at the ligamentum arteriosum is the classic site of traumatic deceleration injury."),
        claim("d1.chambers.great-vessels.recurrent-nerve", "Aortic Root and Great Vessel Relationships", "applied-core", "mechanism", "Arch disease or dissection near the ligamentum arteriosum can injure the left recurrent laryngeal nerve and cause hoarseness."),
        claim("d1.chambers.great-vessels.phrenic", "Aortic Root and Great Vessel Relationships", "applied-core", "mechanism", "Internal mammary harvest and topical cardiac cooling can injure the phrenic nerve along the anterior pericardium."),
        claim("d1.chambers.cannulation.venous-choice", "Venous Cannulation and Bypass Access", "core", "comparison", "Whether the right atrium must be opened determines the choice between two-stage and bicaval venous cannulation."),
        claim("d1.chambers.cannulation.arterial-sites", "Venous Cannulation and Bypass Access", "core", "bounded-set", "Ascending-aortic, axillary, and femoral cannulation serve different arterial-return scenarios."),
        claim("d1.chambers.cardioplegia.retrograde", "Venous Cannulation and Bypass Access", "applied-core", "mechanism", "Coronary-sinus cannulation enables retrograde cardioplegia when antegrade delivery is ineffective."),
        claim("d1.chambers.redo.retro-sternal-hazards", "Senior reasoning: what is actually behind the sternum, and the redo read", "applied-core", "bounded-set", "Redo CT must identify a retrosternal right ventricle, patent graft, or dilated ascending aorta."),
        claim("d1.chambers.redo.sinuses", "Senior reasoning: what is actually behind the sternum, and the redo read", "applied-core", "comparison", "The transverse and oblique pericardial sinuses occupy different operative planes and may be obliterated by redo adhesions."),
        claim("d1.chambers.redo.preparation", "PGY-5 mastery: the reoperative hazard map and the three catastrophic rescues", "applied-core", "sequence", "High-risk redo entry is prepared by reviewing CT, exposing peripheral access, and dividing the posterior sternal table under vision."),
        claim("d1.chambers.redo.rescues", "PGY-5 mastery: the reoperative hazard map and the three catastrophic rescues", "applied-core", "rescue", "Right-ventricular injury, patent-LIMA avulsion, and aortic entry each require rapid control followed by bypass-based rescue."),
        claim("d1.chambers.or.tempo", "Scrubbing in: OR etiquette and conduct at the table", "core", "comparison", "Learners remain silent during critical operative phases and ask questions during low-intensity phases."),
        claim("d1.chambers.or.precase-five", "Before you scrub: the questions to answer for any case", "core", "bounded-set", "Every pre-case review covers diagnosis and operation, relevant anatomy, bypass plan, patient-specific risks, and planned conduit or prosthesis."),
      ]
    },
    {
      source: { type: "lesson", id: "d1-coronaries" },
      claims: [
        claim("d1.coronaries.origin.sinuses", "Origin and Left Main", "core", "model", "The left main and right coronary arteries arise from the left and right aortic sinuses, while the non-coronary sinus has no ostium."),
        claim("d1.coronaries.left-main.branches", "Origin and Left Main", "core", "bounded-set", "The left main normally divides into the LAD and circumflex, with a ramus intermedius when it trifurcates."),
        claim("d1.coronaries.left-main.threshold", "Origin and Left Main", "applied-core", "number", "A left-main diameter stenosis of approximately 50% is a decision-changing threshold for significant disease."),
        claim("d1.coronaries.lad.branch-map", "LAD and Its Branches", "core", "comparison", "LAD diagonal branches supply the anterolateral wall, while septal perforators enter the anterior septum."),
        claim("d1.coronaries.lad.proximal-territory", "LAD and Its Branches", "applied-core", "mechanism", "A proximal LAD occlusion endangers the anterior wall, anterior septum, and often the apex."),
        claim("d1.coronaries.branch-territories", "Left Circumflex and Right Coronary Artery", "core", "comparison", "Obtuse marginals, acute marginals, the PDA, and nodal branches connect coronary vessels to specific myocardial and conduction territories."),
        claim("d1.coronaries.inferior-mi.rv-management", "Left Circumflex and Right Coronary Artery", "applied-core", "rescue", "An RCA-territory inferior MI with right-ventricular involvement is preload dependent, so nitrates and diuretics can worsen shock."),
        claim("d1.coronaries.dominance.definition", "Coronary Dominance", "core", "definition", "Coronary dominance is defined by the artery that gives rise to the posterior descending artery."),
        claim("d1.coronaries.dominance.left-risk", "Coronary Dominance", "applied-core", "mechanism", "Left dominance places lateral, inferior, posterior, and AV-nodal territories at risk from a proximal circumflex lesion."),
        claim("d1.coronaries.dominance.prevalence", "Coronary Dominance", "enrichment", "number", "The lesson describes right dominance as common and left dominance as a minority pattern.", {
          required: false,
          disposition: "supporting-context",
          rationale: "The lesson gives internally inconsistent dominance percentages across text and figures; defer a numeric card until the source is reconciled."
        }),
        claim("d1.coronaries.papillary.supply", "Papillary Muscles: Dual vs. Single Supply", "core", "comparison", "The anterolateral papillary muscle has dual LAD-circumflex supply, while the posteromedial muscle usually has a single PDA supply."),
        claim("d1.coronaries.papillary.rupture-window", "Papillary Muscles: Dual vs. Single Supply", "applied-core", "number", "Posteromedial papillary-muscle rupture classically occurs 2–7 days after an inferior MI."),
        claim("d1.coronaries.cabg.target-map", "CABG Surgical Targets", "core", "comparison", "CABG planning maps the LIMA to LAD and other conduits to diagonal, obtuse-marginal, and inferior-wall targets."),
        claim("d1.coronaries.senior.dominance", "Senior reasoning: dominance is an operational fact, not a label", "applied-core", "mechanism", "The dominant artery owns both the inferior-wall PDA territory and usually the AV-nodal supply."),
        claim("d1.coronaries.senior.intramyocardial-lad", "Senior reasoning: dominance is an operational fact, not a label", "applied-core", "mechanism", "An intramyocardial LAD changes target localization and the safe site for coronary arteriotomy."),
        claim("d1.coronaries.mitral.lcx-distance", "PGY-5 mastery: the circumflex at the mitral annulus", "applied-core", "number", "The circumflex may lie approximately 3–4 mm from the lateral mitral annulus."),
        claim("d1.coronaries.mitral.lcx-rescue", "PGY-5 mastery: the circumflex at the mitral annulus", "applied-core", "rescue", "A new inferolateral wall-motion abnormality after mitral annuloplasty requires urgent evaluation and revascularization of possible circumflex injury."),
      ]
    },
    {
      source: { type: "lesson", id: "d1-conduction" },
      claims: [
        claim("d1.conduction.hazard.pacing-wires", "The Conduction System: A Surgical Hazard Map", "applied-core", "rescue", "Temporary epicardial pacing wires provide a bridge after valve surgery performed near conduction tissue."),
        claim("d1.conduction.sa.location", "SA Node: Location and Vulnerability", "core", "definition", "The SA node lies subepicardially at the superior terminal groove near the SVC-right-atrial junction."),
        claim("d1.conduction.sa.supply", "SA Node: Location and Vulnerability", "core", "comparison", "The SA nodal artery can arise from either the proximal RCA or circumflex."),
        claim("d1.conduction.koch.boundaries", "AV Node: The Triangle of Koch", "core", "bounded-set", "The septal tricuspid leaflet, tendon of Todaro, and coronary-sinus ostium bound the triangle of Koch."),
        claim("d1.conduction.koch.node-location", "AV Node: The Triangle of Koch", "applied-core", "mechanism", "The AV node and penetrating His bundle lie at the apex of Koch's triangle near septal valve sutures."),
        claim("d1.conduction.his.branch-geometry", "His Bundle and Bundle Branches", "core", "comparison", "The left bundle fans beneath the LV endocardium, while the right bundle remains a discrete cord entering the moderator band."),
        claim("d1.conduction.skeleton.functions", "The Cardiac Skeleton and Its Surgical Significance", "core", "bounded-set", "The cardiac skeleton anchors valve annuli and electrically insulates atria from ventricles."),
        claim("d1.conduction.skeleton.central-body", "The Cardiac Skeleton and Its Surgical Significance", "applied-core", "definition", "The central fibrous body is the convergence of valve fibrous structures and the crossing point of the His bundle."),
        claim("d1.conduction.operations.hazard-map", "Senior reasoning: the conduction axis as a surgical constraint across four operations", "applied-core", "comparison", "SAVR, VSD closure, tricuspid annuloplasty, and septal myectomy require different techniques to avoid the conduction axis."),
        claim("d1.conduction.savr.pacemaker-rate", "Senior reasoning: the conduction axis as a surgical constraint across four operations", "enrichment", "number", "Permanent pacing after isolated SAVR is reported in the lesson at approximately 3–6%.", {
          required: false,
          disposition: "supporting-context",
          rationale: "Device-era event rates are time-sensitive and require contemporary registry review before learner retrieval."
        }),
        claim("d1.conduction.recovery.observation", "PGY-5 mastery: recovery biology and the pacemaker decision, SAVR vs TAVR", "applied-core", "number", "Early postoperative complete heart block is commonly observed with temporary pacing for about 5–7 days before permanent-device decisions."),
        claim("d1.conduction.pacing.av-synchrony", "PGY-5 mastery: recovery biology and the pacemaker decision, SAVR vs TAVR", "applied-core", "mechanism", "A hypertrophied aortic-stenosis ventricle benefits from AV-synchronous pacing rather than ventricular-only pacing."),
        claim("d1.conduction.tavr.device-rates", "PGY-5 mastery: recovery biology and the pacemaker decision, SAVR vs TAVR", "enrichment", "number", "Pacemaker burden after TAVR varies substantially by valve platform.", {
          required: false,
          disposition: "supporting-context",
          rationale: "The quoted PARTNER 3 and Evolut rates are device- and era-dependent and need current specialist verification."
        }),
      ]
    },
    {
      source: { type: "lesson", id: "d1-valves-anat" },
      claims: [
        claim("d1.valves.root.components", "The Aortic Root: A Complex Structure", "core", "bounded-set", "The functional aortic root comprises the basal ring, cusps, sinuses, and sinotubular junction."),
        claim("d1.valves.root.stj-regurgitation", "The Aortic Root: A Complex Structure", "applied-core", "mechanism", "Sinotubular-junction dilation separates cusp coaptation and can cause aortic regurgitation despite normal leaflets."),
        claim("d1.valves.root.hazards", "The Aortic Root: A Complex Structure", "applied-core", "comparison", "The NCC-RCC region, aortic-mitral curtain, and left coronary sinus each carry a distinct operative hazard."),
        claim("d1.valves.tavr.ostial-height", "Coronary Ostia Heights and TAVR Safety", "applied-core", "number", "A left-main ostial height below approximately 12 mm increases TAVR coronary-obstruction risk."),
        claim("d1.valves.tavr.obstruction", "Coronary Ostia Heights and TAVR Safety", "applied-core", "rescue", "Sudden collapse immediately after TAVR deployment requires immediate evaluation for coronary ostial obstruction."),
        claim("d1.valves.mitral.apparatus", "The Mitral Valve Complex", "core", "bounded-set", "The mitral apparatus functions through the annulus, leaflets, chordae, and papillary muscles."),
        claim("d1.valves.mitral.annulus", "The Mitral Valve Complex", "core", "comparison", "The mitral annulus is fibrous anteriorly and muscular, dilation-prone posteriorly."),
        claim("d1.valves.mitral.adjacent-hazards", "The Mitral Valve Complex", "applied-core", "comparison", "Deep mitral annular sutures can injure the circumflex, coronary sinus, or conduction axis according to location."),
        claim("d1.valves.mitral.chordal-preservation", "The Mitral Valve Complex", "applied-core", "mechanism", "Preserving chordae and papillary muscles during mitral replacement maintains left-ventricular geometry and function."),
        claim("d1.valves.tricuspid.functional", "Tricuspid and Pulmonic Valve Anatomy", "applied-core", "mechanism", "Functional tricuspid regurgitation usually reflects annular and right-ventricular dilation rather than primary leaflet disease."),
        claim("d1.valves.tricuspid.septal-hazard", "Tricuspid and Pulmonic Valve Anatomy", "applied-core", "mechanism", "The septal tricuspid leaflet and annulus overlie the AV conduction axis, requiring shallow repair sutures."),
        claim("d1.valves.pulmonic.distinction", "Tricuspid and Pulmonic Valve Anatomy", "core", "definition", "The pulmonary valve is separated from other valves by muscle and lacks fibrous continuity with them."),
        claim("d1.valves.root.cusp-hazards", "Aortic Root Relationships and Surgical Access", "core", "comparison", "The non-coronary, right-coronary, and left-coronary cusp regions map to conduction and coronary hazards."),
        claim("d1.valves.root.measurements", "Senior reasoning: the aortic root as a single unit", "applied-core", "bounded-set", "Root planning integrates basal-ring size, sinuses and ostia, sinotubular junction, commissures, and the aortomitral curtain."),
        claim("d1.valves.savr.ppm-moderate", "PGY-5 mastery: the SAVR annulus, step by step, with its hazards", "applied-core", "number", "An indexed effective orifice area below approximately 0.85 cm²/m² defines moderate patient-prosthesis mismatch."),
        claim("d1.valves.savr.ppm-severe", "PGY-5 mastery: the SAVR annulus, step by step, with its hazards", "applied-core", "number", "An indexed effective orifice area below approximately 0.65 cm²/m² defines severe patient-prosthesis mismatch."),
        claim("d1.valves.savr.small-annulus-options", "PGY-5 mastery: the SAVR annulus, step by step, with its hazards", "applied-core", "bounded-set", "A small aortic annulus can be managed by accepting limited mismatch, choosing a higher-performance supra-annular valve, or enlarging the annulus."),
      ]
    },
    {
      source: { type: "lesson", id: "d2-o2" },
      claims: [
        claim("d2.o2.extraction.rest", "The Fundamental Problem: A High-Extraction Organ", "core", "number", "The myocardium extracts approximately 60–70% of delivered oxygen at rest."),
        claim("d2.o2.extraction.flow-response", "The Fundamental Problem: A High-Extraction Organ", "core", "mechanism", "Because resting extraction is near maximal, increased myocardial oxygen demand is met mainly by increasing coronary flow."),
        claim("d2.o2.flow-reserve", "The Fundamental Problem: A High-Extraction Organ", "core", "number", "Normal maximal coronary flow is approximately three to four times resting flow."),
        claim("d2.o2.demand.determinants", "Determinants of Myocardial Oxygen Demand (MVO2)", "core", "bounded-set", "Heart rate, contractility, wall stress, and preload determine myocardial oxygen demand."),
        claim("d2.o2.demand.laplace", "Determinants of Myocardial Oxygen Demand (MVO2)", "core", "formula", "Ventricular wall stress is proportional to pressure times radius divided by twice wall thickness."),
        claim("d2.o2.demand.pressure-work", "Determinants of Myocardial Oxygen Demand (MVO2)", "applied-core", "comparison", "Pressure generation and wall tension cost more myocardial oxygen than equivalent volume ejection."),
        claim("d2.o2.supply.gradient", "Determinants of Myocardial Oxygen Supply", "core", "formula", "Left-coronary diastolic driving pressure equals aortic diastolic pressure minus LVEDP."),
        claim("d2.o2.supply.determinants", "Determinants of Myocardial Oxygen Supply", "core", "bounded-set", "Coronary flow, diastolic duration, arterial oxygen content, and coronary tone determine myocardial oxygen supply."),
        claim("d2.o2.supply.lv-rv-flow", "Determinants of Myocardial Oxygen Supply", "core", "comparison", "Left-coronary flow is predominantly diastolic, whereas right-coronary flow persists through both phases."),
        claim("d2.o2.threshold.subendocardium", "The Ischemic Threshold and Clinical Scenarios", "core", "bounded-set", "The subendocardium becomes ischemic first because compression, demand, and exhausted flow reserve converge there."),
        claim("d2.o2.threshold.triple-threat", "The Ischemic Threshold and Clinical Scenarios", "applied-core", "rescue", "Tachycardia, hypotension, and anemia simultaneously worsen myocardial oxygen balance through different levers."),
        claim("d2.o2.threshold.autoregulation", "The Ischemic Threshold and Clinical Scenarios", "enrichment", "number", "Subendocardial autoregulation begins failing near a distal coronary pressure of 60–70 mmHg.", {
          required: false,
          disposition: "supporting-context",
          rationale: "This mechanistic range is useful context but is not a standalone bedside treatment threshold."
        }),
        claim("d2.o2.cfr.ffr", "Coronary Flow Reserve and Pressure-Wire Assessment", "applied-core", "number", "An FFR of 0.80 or less identifies a physiologically significant intermediate epicardial stenosis."),
        claim("d2.o2.cfr.ifr", "Coronary Flow Reserve and Pressure-Wire Assessment", "applied-core", "number", "An iFR of 0.89 or less identifies a physiologically significant intermediate epicardial stenosis."),
        claim("d2.o2.cfr.purpose", "Coronary Flow Reserve and Pressure-Wire Assessment", "core", "mechanism", "Pressure-wire physiology resolves intermediate lesions whose angiographic appearance does not establish functional significance."),
        claim("d2.o2.senior.levers", "Senior reasoning: the ordered bedside demand levers, and the balloon pump", "applied-core", "sequence", "Bedside oxygen-balance rescue prioritizes rate, diastolic pressure, oxygen content, and wall tension."),
        claim("d2.o2.senior.iabp", "Senior reasoning: the ordered bedside demand levers, and the balloon pump", "applied-core", "comparison", "IABP inflation in diastole raises coronary pressure, while systolic deflation lowers afterload."),
        claim("d2.o2.mastery.triple-response", "PGY-5 mastery: the fastest move in the ischaemic, tachycardic, anaemic, hypotensive patient", "applied-core", "rescue", "An ischemic patient with tachycardia, hypotension, and anemia needs simultaneous rate, pressure, and oxygen-content correction rather than reflex nitrate therapy."),
      ]
    },
    {
      source: { type: "lesson", id: "d2-ischemia" },
      claims: [
        claim("d2.ischemia.cascade.order", "The Ischemic Cascade: Order of Events", "core", "sequence", "Ischemia progresses from diastolic dysfunction through wall-motion and ECG changes to pain and hemodynamic compromise."),
        claim("d2.ischemia.cascade.irreversible", "The Ischemic Cascade: Order of Events", "applied-core", "number", "Irreversible myocardial injury begins after approximately 20–30 minutes of complete ischemia."),
        claim("d2.ischemia.cascade.door-balloon", "The Ischemic Cascade: Order of Events", "applied-core", "number", "Primary PCI systems target a 90-minute door-to-balloon interval for STEMI."),
        claim("d2.ischemia.tee.precedes-ecg", "The Role of TEE in Intraoperative Ischemia Detection", "applied-core", "mechanism", "A new regional wall-motion abnormality can reveal intraoperative ischemia before ECG change."),
        claim("d2.ischemia.tee.territories", "The Role of TEE in Intraoperative Ischemia Detection", "applied-core", "comparison", "TEE wall-motion territories map anterior-septal to LAD, lateral to circumflex, and inferior to RCA grafts."),
        claim("d2.ischemia.tee.differential", "The Role of TEE in Intraoperative Ischemia Detection", "applied-core", "bounded-set", "New post-bypass regional dysfunction prompts evaluation for graft failure, spasm, coronary air, and untreated native disease."),
        claim("d2.ischemia.states.map", "Myocardial Stunning, Hibernation, and Infarction", "core", "comparison", "Stunned, hibernating, and infarcted myocardium differ by perfusion state, viability, and expected recovery."),
        claim("d2.ischemia.hibernation.triad", "Myocardial Stunning, Hibernation, and Infarction", "core", "bounded-set", "Hibernating myocardium requires persistent dysfunction, low flow, and retained viability."),
        claim("d2.ischemia.stich.outcome", "The STICH Trial: CABG in Reduced EF", "applied-core", "evidence", "STICHES showed that CABG plus medical therapy improved long-term outcomes in ischemic cardiomyopathy despite front-loaded operative risk."),
        claim("d2.ischemia.stich.ef", "The STICH Trial: CABG in Reduced EF", "applied-core", "number", "STICH enrolled ischemic cardiomyopathy patients with an ejection fraction of 35% or less."),
        claim("d2.ischemia.stich.viability-paradox", "The STICH Trial: CABG in Reduced EF", "applied-core", "evidence", "The STICH viability substudy did not validate viability imaging as a strict gate to CABG survival benefit."),
        claim("d2.ischemia.reperfusion.mechanisms", "Reperfusion Injury and Cardioprotection", "core", "bounded-set", "Calcium overload, mitochondrial pore opening, reactive oxygen species, and inflammation mediate reperfusion injury."),
        claim("d2.ischemia.reperfusion.no-reflow", "Reperfusion Injury and Cardioprotection", "applied-core", "mechanism", "Microvascular no-reflow can prevent tissue perfusion despite an open epicardial artery."),
        claim("d2.ischemia.viability.lge", "Senior reasoning: stunned vs hibernating vs infarcted — and why it changes the operation", "applied-core", "number", "Myocardial segments with less than approximately 50% transmural LGE scar are more likely to recover after revascularization."),
        claim("d2.ischemia.viability.target-map", "PGY-5 mastery: viability drives the revascularisation decision in the low-EF patient", "applied-core", "mechanism", "CABG planning in ischemic cardiomyopathy maps viable dysfunctional segments to graftable coronary targets."),
        claim("d2.ischemia.stemi.primary-window", "STEMI: Revascularizing the Infarct Artery (2021 Guideline)", "applied-core", "guideline", "Primary PCI within 12 hours of STEMI symptom onset is a Class 1 recommendation."),
        claim("d2.ischemia.stemi.shock-any-time", "STEMI: Revascularizing the Infarct Artery (2021 Guideline)", "applied-core", "guideline", "Shock or hemodynamic instability warrants emergency culprit revascularization irrespective of elapsed time."),
        claim("d2.ischemia.stemi.mechanical-cabg", "STEMI: Revascularizing the Infarct Artery (2021 Guideline)", "applied-core", "guideline", "CABG is recommended during repair of post-MI septal rupture, papillary rupture, or free-wall rupture."),
        claim("d2.ischemia.stemi.pharmacoinvasive-window", "STEMI: Revascularizing the Infarct Artery (2021 Guideline)", "applied-core", "guideline", "After fibrinolysis, a pharmacoinvasive strategy performs angiography within 3–24 hours."),
        claim("d2.ischemia.stemi.late-occlusion", "STEMI: Revascularizing the Infarct Artery (2021 Guideline)", "applied-core", "guideline", "Routine PCI provides no benefit for an asymptomatic stable totally occluded infarct artery more than 24 hours after onset without severe ischemia."),
        claim("d2.ischemia.stemi.no-reflow-cabg", "STEMI: Revascularizing the Infarct Artery (2021 Guideline)", "applied-core", "guideline", "Emergency CABG should not be used to treat isolated microvascular no-reflow without ongoing large-territory ischemia or graftable targets."),
        claim("d2.ischemia.nonculprit.stable", "STEMI: The Non-Infarct Artery — Staged, Not in Shock", "applied-core", "guideline", "Stable selected STEMI patients benefit from staged treatment of significant nonculprit disease after successful culprit PCI."),
        claim("d2.ischemia.nonculprit.shock", "STEMI: The Non-Infarct Artery — Staged, Not in Shock", "applied-core", "guideline", "Cardiogenic shock calls for culprit-only PCI rather than routine immediate multivessel PCI."),
        claim("d2.ischemia.nste.timing-map", "NSTE-ACS: The Invasive Strategy and Its Timing", "applied-core", "guideline", "NSTE-ACS invasive timing escalates from before-discharge to early or immediate according to clinical risk and instability."),
        claim("d2.ischemia.nste.high-risk-window", "NSTE-ACS: The Invasive Strategy and Its Timing", "applied-core", "guideline", "Initially stabilized high-risk NSTE-ACS reasonably undergoes an early invasive strategy within 24 hours."),
      ]
    },
    {
      source: { type: "lesson", id: "d2-angina" },
      claims: [
        claim("d2.angina.stable.criteria", "Stable Angina: Mechanism and Presentation", "core", "bounded-set", "Typical stable angina has substernal discomfort, exertional provocation, and relief with rest or nitroglycerin."),
        claim("d2.angina.stable.plaque", "Stable Angina: Mechanism and Presentation", "core", "comparison", "Stable angina reflects a fixed, intact-capped lesion, unlike rupture-prone ACS plaque."),
        claim("d2.angina.stable.exertional-area", "Stable Angina: Mechanism and Presentation", "core", "number", "Exertional flow limitation begins near 75% loss of luminal cross-sectional area."),
        claim("d2.angina.stable.rest-area", "Stable Angina: Mechanism and Presentation", "applied-core", "number", "Resting flow becomes threatened near 90% loss of luminal cross-sectional area."),
        claim("d2.angina.testing.cascade-map", "Diagnostic Workup: From Risk Stratification to Angiography", "core", "comparison", "Perfusion imaging, stress echo, and exercise ECG interrogate progressively later stages of the ischemic cascade."),
        claim("d2.angina.testing.pretest", "Diagnostic Workup: From Risk Stratification to Angiography", "applied-core", "mechanism", "Pretest probability determines whether anatomic rule-out or functional ischemia testing is most informative."),
        claim("d2.angina.medications.map", "Medical Management of Stable Angina", "core", "comparison", "Beta-blockers, nitrates, calcium-channel blockers, and ranolazine improve angina through distinct supply-demand mechanisms."),
        claim("d2.angina.beta-blocker.hr", "Medical Management of Stable Angina", "applied-core", "number", "The lesson gives a resting heart-rate target of approximately 55–60 beats/min during beta-blocker therapy for stable angina."),
        claim("d2.angina.ntg.relief-window", "Medical Management of Stable Angina", "applied-core", "number", "Stable angina should improve within approximately 3–5 minutes after sublingual nitroglycerin."),
        claim("d2.angina.nitrate.free-window", "Medical Management of Stable Angina", "applied-core", "number", "Long-acting nitrate regimens require a daily nitrate-free interval of approximately 8–12 hours to limit tolerance."),
        claim("d2.angina.nodal-blockade", "Medical Management of Stable Angina", "applied-core", "rescue", "Combining a beta-blocker with verapamil or diltiazem can cause excessive AV-nodal blockade."),
        claim("d2.angina.prevention.classes", "Risk Modification and Secondary Prevention", "core", "bounded-set", "Antiplatelet therapy, high-intensity statin, indicated renin-angiotensin blockade, and post-MI beta-blockade reduce cardiovascular risk."),
        claim("d2.angina.prevention.aspirin-dose", "Risk Modification and Secondary Prevention", "applied-core", "number", "Chronic aspirin maintenance for established coronary disease is commonly 75–100 mg daily."),
        claim("d2.angina.prevention.ldl-established", "Risk Modification and Secondary Prevention", "applied-core", "number", "The lesson targets LDL below 70 mg/dL in established CAD."),
        claim("d2.angina.prevention.ldl-very-high", "Risk Modification and Secondary Prevention", "applied-core", "number", "The lesson targets LDL below 55 mg/dL in very-high-risk coronary disease."),
        claim("d2.angina.cabg.favoring-patterns", "From Medical Therapy to CABG: The Decision Framework", "applied-core", "bounded-set", "Left-main disease, complex three-vessel disease, low-EF multivessel disease, and diabetes with multivessel disease favor CABG."),
        claim("d2.angina.physiology.ffr", "Senior reasoning: the physiologic lesion, four parts at a time", "applied-core", "number", "Intermediate epicardial lesions are physiologically significant at an FFR of 0.80 or less."),
        claim("d2.angina.physiology.ifr", "Senior reasoning: the physiologic lesion, four parts at a time", "applied-core", "number", "Intermediate epicardial lesions are physiologically significant at an iFR of 0.89 or less."),
        claim("d2.angina.ischemia.boundaries", "PGY-5 mastery: using ISCHEMIA without being trapped by it", "applied-core", "evidence", "ISCHEMIA supports medical-therapy-first discussion in stable disease but excluded left main and other high-risk surgical groups."),
        claim("d2.angina.ccs.map", "Grading Angina: the CCS Classification", "core", "model", "CCS classes I through IV grade stable angina by the workload that provokes symptoms."),
        claim("d2.angina.lesion.ivus-left-main", "Defining Lesion Severity: Anatomy, Physiology, and Imaging", "applied-core", "guideline", "IVUS is reasonable to define the severity of an intermediate left-main stenosis."),
        claim("d2.angina.sihd.survival-map", "Revascularization to Improve Survival in SIHD — the Nuanced Table", "applied-core", "guideline", "CABG survival recommendations vary by left-main anatomy, multivessel disease, and ventricular function."),
        claim("d2.angina.sihd.no-benefit", "Revascularization to Improve Survival in SIHD — the Nuanced Table", "applied-core", "guideline", "Revascularization solely for survival is not recommended for normal-EF one- or two-vessel disease without proximal LAD involvement."),
        claim("d2.angina.pci.radial", "General PCI Procedure: Access, Stents, Imaging, and Special Lesions", "applied-core", "guideline", "Radial access is preferred for PCI and additionally reduces mortality in ACS."),
        claim("d2.angina.pci.des", "General PCI Procedure: Access, Stents, Imaging, and Special Lesions", "applied-core", "guideline", "Drug-eluting stents are preferred over bare-metal stents to reduce restenosis, MI, and stent thrombosis."),
        claim("d2.angina.pci.svg", "General PCI Procedure: Access, Stents, Imaging, and Special Lesions", "applied-core", "guideline", "SVG PCI favors embolic protection when feasible and native-vessel PCI over a severely diseased graft when possible."),
        claim("d2.angina.pci.thrombectomy", "General PCI Procedure: Access, Stents, Imaging, and Special Lesions", "applied-core", "guideline", "Routine aspiration thrombectomy before primary PCI provides no benefit and may add harm."),
        claim("d2.angina.p2y12.map", "Antithrombotic Pharmacotherapy for PCI", "core", "comparison", "Clopidogrel and prasugrel irreversibly inhibit P2Y12, while ticagrelor is a reversible direct inhibitor."),
        claim("d2.angina.prasugrel.stroke", "Antithrombotic Pharmacotherapy for PCI", "applied-core", "guideline", "Prasugrel should not be used in a patient with prior stroke or TIA."),
        claim("d2.angina.enoxaparin.ufh", "Antithrombotic Pharmacotherapy for PCI", "applied-core", "guideline", "Adding UFH during PCI soon after therapeutic enoxaparin increases bleeding and should be avoided."),
        claim("d2.angina.dapt.short", "DAPT After Revascularization — Shorter, and Managing Atrial Fibrillation", "applied-core", "guideline", "Selected PCI patients may transition after 1–3 months of DAPT to P2Y12-inhibitor monotherapy."),
        claim("d2.angina.cabg.aspirin-six", "DAPT After Revascularization — Shorter, and Managing Atrial Fibrillation", "applied-core", "guideline", "After CABG, aspirin should begin within 6 hours and continue indefinitely to reduce vein-graft closure."),
        claim("d2.angina.af.drop-aspirin", "DAPT After Revascularization — Shorter, and Managing Atrial Fibrillation", "applied-core", "guideline", "After PCI in atrial fibrillation, aspirin is generally stopped after 1–4 weeks while oral anticoagulation and a P2Y12 inhibitor continue."),
      ]
    }
  ];
})();
