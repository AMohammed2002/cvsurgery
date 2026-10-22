/* Comprehensive cloze pack for supporting modules.
   Load after trials, physiology, exercises, vivas,
   angiography and DAY_ECOSYSTEMS. The host ingests this immutable source pack
   into the shared scheduler; this file deliberately does not touch FLASHCARDS. */
"use strict";

(function () {
  const cards = [];

  const SOURCE_LABEL = {
    physiology: "Physiology",
    evidence: "Evidence",
    viva: "Viva",
    exercise: "Interactive exercise",
    angiography: "Angiography"
  };

  function text(value) {
    return String(value == null ? "" : value)
      .replace(/<br\s*\/?\s*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function firstStatement(value) {
    const marker = "\u00a7";
    let clean = text(value)
      .replace(/(\d)\.(\d)/g, "$1" + marker + "$2")
      .replace(/\b(e\.g|i\.e|vs|Dr|Mr|Ms|St)\./gi, match => match.replace(/\./g, marker));
    const boundary = clean.search(/[.!?]["')\]]?(?:\s+[A-Z0-9]|$)/);
    if (boundary >= 0) clean = clean.slice(0, boundary + 1);
    return clean.replace(new RegExp(marker, "g"), ".").trim();
  }

  function safeId(value) {
    return String(value == null ? "" : value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function dayList(value) {
    const list = Array.isArray(value) ? value : value == null ? [] : [value];
    return Array.from(new Set(list.map(Number).filter(day => day >= 1 && day <= 14))).sort((a, b) => a - b);
  }

  function add(id, cloze, sourceType, sourceId, partId, linkedDays, topic, explanation) {
    const card = {
      id: id,
      cloze: text(cloze),
      source: SOURCE_LABEL[sourceType] || sourceType,
      sourceType: sourceType,
      sourceId: sourceId,
      partId: partId,
      linkedDays: dayList(linkedDays),
      topic: text(topic || sourceId)
    };
    if (explanation) card.explanation = text(explanation);
    cards.push(card);
  }

  /* ----------------------------------------------------------------------
     PHYSIOLOGY LABS — registry lesson fields plus authored scenario anchors.
     Every lab receives exactly sixteen cards. */
  const LAB_DAYS = {
    "pv-loop": [3],
    "oxygen-delivery": [2],
    valve: [4],
    shock: [13],
    ecg: [12],
    pacing: [12],
    "cpb-console": [2],
    "cpb-surgery": [2],
    cannulation: [2],
    cardioplegia: [2],
    iabp: [10],
    "teg-rotem": [11],
    "cath-projections": [5]
  };

  const LAB_CORE = {
    "pv-loop": "loop width and position encode stroke volume, loading, compliance and contractility",
    "oxygen-delivery": "oxygen delivery is pump flow multiplied by arterial oxygen content, interpreted against metabolic demand",
    valve: "valve severity requires reconciliation of velocity, gradient, valve area, dimensionless index and flow state",
    shock: "coupled pressure, flow, filling and resistance signals identify the dominant post-bypass shock phenotype",
    ecg: "a systematic rate-to-ST-T read localizes postoperative rhythm and ischemic problems before treatment",
    pacing: "temporary pacing separates rate, output for capture and sensitivity for sensing",
    "cpb-console": "safe bypass couples reservoir volume, drainage, pump flow, line pressure, gas exchange and patient perfusion",
    "cpb-surgery": "each bypass phase must meet its safety prerequisites before the next phase begins",
    cannulation: "cannulation sites determine flow direction, chamber access, decompression and available rescue routes",
    cardioplegia: "myocardial protection requires arrest plus uniform delivery, cooling, venting and timely redosing",
    iabp: "diastolic inflation augments coronary pressure and presystolic deflation reduces LV afterload",
    "teg-rotem": "viscoelastic tracing phases map clot initiation, propagation, strength and breakdown to different defects",
    "cath-projections": "C-arm rotation decides which vessels overlap and C-arm tilt decides which vessels foreshorten, so each named view answers one anatomic question and sacrifices another"
  };

  const LAB_PRACTICE = {
    "pv-loop": "change one loading variable, predict the loop shift, then compare the observed EDV, ESV and stroke volume",
    "oxygen-delivery": "change flow, hemoglobin, saturation or temperature individually and predict DO2i before reading the display",
    valve: "reconcile discordant measurements instead of grading a valve from one number",
    shock: "name the phenotype from coupled signals before selecting a vasoactive or mechanical treatment",
    ecg: "commit to a systematic interpretation before revealing each case explanation",
    pacing: "measure sensing and capture thresholds before choosing mode, output and sensitivity",
    "cpb-console": "respond to each fault by protecting the reservoir and patient before restoring target flow",
    "cpb-surgery": "narrate the command, expected response and abort condition at every bypass transition",
    cannulation: "choose inflow, drainage, vents and rescue access for the operative anatomy before manipulating controls",
    cardioplegia: "choose route and dose for the lesion, then monitor arrest, temperature, pressure, flow and distension",
    iabp: "identify the timing fault on the waveform before moving inflation or deflation",
    "teg-rotem": "classify the tracing defect before choosing a targeted product or surgical re-exploration",
    "cath-projections": "state the question you need answered, predict the two angles that answer it, then drive the gantry there and name what the view gave up"
  };

  const LAB_EXTRA = {
    "pv-loop": [
      "The width of a pressure-volume loop is {{c1::stroke volume (EDV minus ESV)}}.",
      "A steeper end-systolic pressure-volume relationship represents {{c1::greater contractility}}.",
      "Increasing afterload generally leaves {{c1::more end-systolic volume and narrows useful stroke volume}}.",
      "Increasing preload generally moves EDV rightward and {{c1::widens stroke volume when contractile reserve permits}}.",
      "In MR or AR, a reassuring EF can conceal {{c1::reduced forward stroke volume because some ejection is regurgitant}}.",
      "For post-repair SAM with hypotension, move physiology toward {{c1::more preload and afterload with less inotropy}}.",
      "Acute tamponade constrains the loop by {{c1::limiting diastolic filling despite intravascular volume}}."
    ],
    "oxygen-delivery": [
      "Most arterial oxygen content is carried by {{c1::hemoglobin rather than dissolved oxygen}}.",
      "A normal MAP does not guarantee adequate perfusion because oxygen delivery depends on {{c1::flow multiplied by arterial oxygen content}}.",
      "During profound hemodilution, the principal limit on CaO2 is {{c1::low hemoglobin}}.",
      "Before simply increasing pump flow in a low-flow state, exclude {{c1::poor venous drainage, cannula malposition or mechanical obstruction}}.",
      "Rewarming can reduce SvO2 because it {{c1::raises metabolic oxygen demand}}.",
      "Low arterial saturation on CPB should prompt assessment of {{c1::oxygenator gas exchange, gas supply and sampling}}.",
      "Interpret DO2i with {{c1::SvO2, lactate, temperature, organ signals and trend}} rather than as an isolated number."
    ],
    valve: [
      "The simplified Bernoulli relationship used for valve jets is {{c1::delta P equals 4v squared}}.",
      "Continuity-derived valve area equals {{c1::LVOT area times LVOT VTI divided by valve VTI}}.",
      "Doppler velocity and gradient are {{c1::flow dependent}}.",
      "An LVOT diameter error is amplified because LVOT area depends on {{c1::the square of the diameter}}.",
      "Discordant low-gradient aortic stenosis requires reconciliation of {{c1::flow state, stroke volume, image quality and valve area}}.",
      "The dimensionless index avoids direct LVOT area calculation but remains {{c1::dependent on reliable Doppler sampling and flow}}.",
      "A post-repair mitral gradient must be interpreted with {{c1::heart rate and transmitral flow}}."
    ],
    shock: [
      "The simplified hemodynamic relationship is {{c1::MAP approximately CVP plus cardiac output times SVR divided by 80}}.",
      "Cardiac output is {{c1::heart rate multiplied by forward stroke volume}}.",
      "Vasoplegia classically couples hypotension with {{c1::low SVR and relatively preserved or high cardiac output}}.",
      "Post-bypass RV failure often couples high CVP with {{c1::a dilated RV and an underfilled LV}}.",
      "Tamponade is an obstructive filling problem that requires {{c1::urgent anatomic assessment rather than escalation of vasoactive drugs alone}}.",
      "TEE helps distinguish {{c1::LV failure, RV failure, hypovolemia, tamponade and a residual surgical lesion}}.",
      "Before selecting a drip, first {{c1::name the dominant shock phenotype from coupled signals and trajectory}}."
    ],
    ecg: [
      "A disciplined postoperative ECG read proceeds through {{c1::rate, rhythm, axis, intervals, QRS morphology and ST-T changes}}.",
      "A new territory-specific ST change after CABG should be mapped to {{c1::the corresponding graft and myocardial territory}}.",
      "Hemodynamically unstable tachyarrhythmia requires {{c1::synchronized cardioversion}}.",
      "AV dissociation with a slow wide escape is a pattern of {{c1::complete heart block}}.",
      "Atrial fibrillation is suggested by {{c1::an irregularly irregular ventricular response without consistent P waves}}.",
      "New postoperative rhythm or repolarization changes demand review of {{c1::ischemia, electrolytes, temperature, drugs and pacing status}}."
    ],
    pacing: [
      "Temporary epicardial pacing commonly uses separately placed {{c1::atrial and ventricular wires}}.",
      "Output must be set above the measured {{c1::capture threshold}}.",
      "Sensitivity controls whether the pacemaker {{c1::detects intrinsic cardiac signals}}.",
      "DDD pacing can preserve {{c1::AV synchrony and atrial contribution to ventricular filling}}.",
      "VVI pacing may worsen output in a stiff ventricle because it {{c1::loses AV synchrony and the atrial kick}}.",
      "Failure to capture requires checking {{c1::connections, lead position, output threshold, electrolytes and myocardial ischemia}}."
    ],
    "cpb-console": [
      "A falling venous reservoir requires the immediate response to {{c1::reduce pump flow and identify the drainage problem before air is entrained}}.",
      "Venous-line chatter suggests {{c1::excess negative pressure, inadequate volume or position-dependent cannula obstruction}}.",
      "A sudden high arterial-line pressure requires assessment for {{c1::kink, clamp, cannula malposition, obstruction or aortic dissection}}.",
      "Sweep gas principally controls {{c1::carbon-dioxide removal across the oxygenator}}.",
      "Oxygenator gas supply and FiO2 principally determine {{c1::arterial oxygenation}}.",
      "Visible arterial circuit air requires {{c1::an immediate stop, clamp and coordinated de-airing response}}."
    ],
    "cpb-surgery": [
      "Initiating CPB is a gradual handoff while confirming {{c1::venous drainage, reservoir volume, arterial pressure, line pressure and patient perfusion}}.",
      "Cross-clamping and cardioplegia follow confirmation of {{c1::stable full-flow bypass}}.",
      "Preparation for separation includes {{c1::rewarming, ventilation, rhythm, electrolytes, de-airing and repair assessment}}.",
      "TEE-guided de-airing is required before {{c1::meaningful ejection and separation from bypass}}.",
      "A stepwise trial off bypass should identify whether instability reflects {{c1::preload, LV, RV, rhythm, afterload, obstruction or the surgical result}}.",
      "When a separation trial is unsafe, the correct rescue is to {{c1::return to adequate bypass support early while correcting the cause}}."
    ],
    cannulation: [
      "Standard ascending-aortic return provides {{c1::antegrade flow with direct inspection and short circuit length}}.",
      "Right-axillary cannulation provides {{c1::antegrade systemic and potential cerebral perfusion when the ascending aorta is hostile}}.",
      "Femoral arterial cannulation produces {{c1::retrograde aortic flow and requires aortoiliac and limb-perfusion assessment}}.",
      "Direct true-lumen cannulation in dissection requires confirmation with {{c1::imaging, pressure and organ-perfusion signals}}.",
      "A two-stage right-atrial cannula is used when {{c1::the right atrium remains closed and caval plus atrial drainage is desired}}.",
      "Bicaval cannulation allows {{c1::right-atrial isolation for intracardiac or tricuspid work}}."
    ],
    cardioplegia: [
      "Hyperkalemic cardioplegia protects by producing {{c1::rapid diastolic electrical arrest}}.",
      "Electrical silence alone does not prove {{c1::uniform myocardial cooling and protection}}.",
      "With severe AR, root cardioplegia can distend the LV, so use {{c1::venting with ostial and/or retrograde delivery}}.",
      "Retrograde-only cardioplegia may underprotect {{c1::the RV because much RV venous drainage bypasses the coronary sinus}}.",
      "Critical left-main disease can limit antegrade delivery to {{c1::both LAD and circumflex territories}}.",
      "Effective delivery is supported by {{c1::prompt arrest, uniform cooling, sustained quiescence and absence of LV distension}}."
    ],
    iabp: [
      "IABP inflation should begin at {{c1::the dicrotic notch, immediately after aortic-valve closure}}.",
      "IABP deflation must finish {{c1::immediately before the next systolic upstroke}}.",
      "Early inflation harms the LV by {{c1::opposing late ejection and increasing afterload}}.",
      "Late deflation is dangerous because the balloon {{c1::remains inflated into systole and impedes ejection}}.",
      "Severe aortic regurgitation is a contraindication because diastolic augmentation {{c1::increases the backward gradient and regurgitant volume}}.",
      "A cool pulseless limb after femoral IABP insertion requires {{c1::urgent limb-perfusion and access assessment}}."
    ],
    "teg-rotem": [
      "On TEG/ROTEM, R or CT describes {{c1::clot initiation}}.",
      "K or CFT and the alpha angle describe {{c1::clot propagation}}.",
      "MA or MCF describes {{c1::overall clot strength}}.",
      "LY30 or maximum lysis describes {{c1::clot breakdown and fibrinolysis}}.",
      "Correction in the heparinase channel supports {{c1::residual heparin effect}}.",
      "A balanced viscoelastic trace does not exclude {{c1::a mechanical surgical source of brisk bleeding}}."
    ],
    "cath-projections": [
      "Rotating the C-arm between RAO and LAO changes {{c1::vessel overlap on the frame}}.",
      "Tilting the C-arm between caudal and cranial changes {{c1::vessel foreshortening on the frame}}.",
      "The LAO caudal spider view is acquired to open {{c1::the distal left main and the origins of the LAD and circumflex}}.",
      "The spider view is a poor view for distal vessels because {{c1::everything beyond the bifurcation is foreshortened}}.",
      "To separate the LAD from its diagonal branches, move to {{c1::a cranial view such as LAO cranial or RAO cranial}}.",
      "A flat RAO right-coronary view cannot settle the distal bifurcation because {{c1::the posterior descending and posterolateral branches overlap; cranial angulation opens the crux}}.",
      "The standard ventriculogram for ejection fraction and mitral regurgitation grading is {{c1::the RAO projection, which profiles the anterior, apical and inferior walls}}."
    ]
  };

  const labs = window.CSLab && typeof window.CSLab.all === "function" ? window.CSLab.all() : [];
  labs.forEach(lab => {
    if (lab.flashcards === false) return;
    const days = LAB_DAYS[lab.id] || [];
    const teach = lab.teach || {};
    let index = 1;
    const labAdd = (partId, cloze) => add(
      "module-physiology-" + lab.id + "-" + String(index++).padStart(2, "0"),
      cloze, "physiology", lab.id, partId, days, lab.title
    );
    labAdd("concept", lab.title + ": core concept — {{c1::" + LAB_CORE[lab.id] + "}}.");
    labAdd("practice", lab.title + ": deliberate practice — {{c1::" + LAB_PRACTICE[lab.id] + "}}.");
    (lab.objectives || []).forEach((objective, i) => labAdd("objective-" + (i + 1), lab.title + " objective: {{c1::" + text(objective) + "}}"));
    (teach.equations || []).forEach((equation, i) => labAdd("equation-" + (i + 1), lab.title + " equation anchor: {{c1::" + text(equation) + "}}"));
    (LAB_EXTRA[lab.id] || []).forEach((fact, i) => labAdd("scenario-anchor-" + (i + 1), fact));
  });

  /* ----------------------------------------------------------------------
     LANDMARK TRIALS — eight cards per trial. IDs 01-03 intentionally match
     the existing connected-circuit evidence cards. */
  const evidenceDays = {};
  (window.DAY_ECOSYSTEMS || []).forEach(day => {
    if (!day.evidence || !day.evidence.id) return;
    evidenceDays[day.evidence.id] = (evidenceDays[day.evidence.id] || []).concat(day.day);
  });
  const EVIDENCE_OUTCOME_ANCHORS = {
    noble: "CABG had fewer 5-year MACCE events than PCI, driven by less non-procedural MI and repeat revascularisation",
    "aortic-size-thresholds": "sporadic root or ascending aneurysm repair is generally recommended at 5.5 cm, with lower thresholds for selected disease and operative contexts",
    momentum3: "HeartMate 3 improved 2-year survival free from disabling stroke or device reoperation, largely by reducing pump thrombosis",
    trics3: "restrictive transfusion was noninferior for death, MI, stroke or new dialysis and reduced red-cell exposure"
  };
  const EVIDENCE_DECISION_ANCHORS = {
    rooby: "on-pump CABG remains preferred when complete, durable revascularisation is the goal",
    partner1: "TAVR became standard for inoperable severe AS and an alternative to SAVR in high-risk patients",
    partner3: "TAVR was superior to SAVR at 1 year in selected low-risk patients with suitable anatomy",
    "evolut-lowrisk": "self-expanding TAVR is a valid alternative to SAVR in selected low-risk severe AS",
    coapt: "MitraClip benefits selected symptomatic heart-failure patients with severe functional MR despite optimised GDMT",
    "instead-xl": "TEVAR improves remodelling and late aortic outcomes but not early survival in stable uncomplicated type B dissection",
    adsorb: "TEVAR improves aortic remodelling in uncomplicated acute type B dissection without an early mortality benefit",
    trics3: "restrictive transfusion reduces red-cell exposure without worsening major outcomes, but physiology and active bleeding govern individual decisions"
  };
  const EVIDENCE_BOUNDARY_ANCHORS = {
    "aortic-size-thresholds": "rapid root or ascending growth is at least 0.5 cm/year once or 0.3 cm/year over two years; Marfan and BAV use 0.3 cm/year"
  };
  const EVIDENCE_POPULATION_ANCHORS = {
    partner1: "inoperable and high-surgical-risk patients with severe aortic stenosis",
    coapt: "symptomatic heart-failure patients with LVEF 20-50%, severe functional MR despite optimised GDMT, and anatomy suitable for MitraClip"
  };
  const EVIDENCE_COMPARATOR_ANCHORS = {
    partner1: "standard therapy for inoperable patients and SAVR for high-surgical-risk patients"
  };
  const trials = window.TRIALS && window.TRIALS.trials || [];
  trials.forEach(trial => {
    const days = evidenceDays[trial.id] || [];
    const base = "evidence-" + trial.id + "-";
    const pearls = trial.pearls || [];
    const trialAdd = (number, partId, cloze) => add(base + String(number).padStart(2, "0"), cloze, "evidence", trial.id, partId, days, trial.name);
    trialAdd(1, "question", "Which trial asked, \"" + text(trial.question) + "\"? {{c1::" + trial.name + "}}.");
    trialAdd(2, "outcome", trial.name + " primary result: {{c1::" + (EVIDENCE_OUTCOME_ANCHORS[trial.id] || firstStatement(trial.outcome)) + "}}");
    trialAdd(3, "decision-boundary", trial.name + " clinical decision: {{c1::" + (EVIDENCE_DECISION_ANCHORS[trial.id] || firstStatement(trial.bottomLine)) + "}}" + (pearls[2] ? " Boundary: {{c2::" + (EVIDENCE_BOUNDARY_ANCHORS[trial.id] || firstStatement(pearls[2])) + "}}" : ""));
    trialAdd(4, "design", trial.name + " design: {{c1::" + text(trial.design) + "}}");
    trialAdd(5, "population", trial.name + " population: {{c1::" + (EVIDENCE_POPULATION_ANCHORS[trial.id] || firstStatement(trial.population)) + "}}");
    trialAdd(6, "comparison", trial.name + " compared {{c1::" + firstStatement(trial.intervention) + "}} with {{c2::" + (EVIDENCE_COMPARATOR_ANCHORS[trial.id] || firstStatement(trial.comparator)) + "}}.");
    trialAdd(7, "pearl-1", trial.name + " interpretation pearl: {{c1::" + firstStatement(pearls[0] || trial.bottomLine) + "}}");
    trialAdd(8, "limitation", trial.name + " limitation or nuance: {{c1::" + firstStatement(pearls[pearls.length - 1] || trial.citation) + "}}");
  });

  /* ----------------------------------------------------------------------
     VIVAS — five cards per viva. IDs 01-03 match the current beat cards. */
  const VIVA_ANCHORS = {
    "viva-d1": [
      "the patent LIMA, because injury causes hemorrhage and acute LAD ischemia",
      "gated CT, pre-exposed peripheral cannulation and controlled posterior-table division",
      "pack the injury, institute peripheral CPB, then repair the LIMA or re-graft the LAD"
    ],
    "viva-d2": [
      "aortic regurgitation, incomplete clamping or cannula malposition, coronary obstruction, or delivery-line failure",
      "AR decompresses root cardioplegia into the LV; switch to retrograde or direct ostial delivery and vent the LV",
      "decompress the LV immediately with a vent and correct the ineffective cardioplegia route"
    ],
    "viva-d3": [
      "an initial invasive strategy did not reduce death or MI in stable ischemia, although it improved angina",
      "no primary-composite difference; MI timing, crossover and lower-risk anatomy limit generalization",
      "significant left-main disease, low-EF multivessel disease and diabetic multivessel disease"
    ],
    "viva-d4": [
      "low transvalvular flow can produce a low gradient across a truly severe fixed valve",
      "SVi below 35 mL/m2 followed by dobutamine testing of valve area and gradient response",
      "absence of contractile reserve raises procedural risk but does not negate AVR benefit when severe AS is confirmed"
    ],
    "viva-d5": [
      "LVOT-diameter error, Doppler misalignment, wrong VTI sampling and unrecognized low flow",
      "predict indexed EOA, choose a larger-EOA prosthesis, or enlarge the root",
      "integrate flow state with CT calcium and recheck Doppler alignment and LVOT measurement"
    ],
    "viva-d6": [
      "porcelain aorta, frailty or futility, and hostile chest, radiation injury or cirrhosis",
      "STS-PROM plus EuroSCORE II plus structured frailty, reconciled by the Heart Team",
      "forego intervention when severe comorbidity or frailty prevents meaningful survival or functional benefit"
    ],
    "viva-d7": [
      "CABG protects downstream territory beyond diffuse disease and provides durable arterial-conduit revascularization",
      "FREEDOM favored CABG in diabetic multivessel disease; EXCEL-NOBLE discordance reflects endpoint definitions",
      "anaortic off-pump arterial grafting or alternative inflow that avoids aortic clamping and side-biting"
    ],
    "viva-d8": [
      "choose a lifetime valve strategy and avoid PPM with a large-EOA prosthesis or root enlargement",
      "similar early outcomes with TAVR, but pacemaker, PVL and uncertain durability favor SAVR in a younger fit patient",
      "perform Nicks or Manouguian enlargement or use a larger-EOA prosthesis rather than accept severe PPM"
    ],
    "viva-d9": [
      "right-coronary ostial malperfusion plus distal right iliac or femoral malperfusion",
      "antegrade true-lumen axillary, innominate or central cannulation with antegrade cerebral perfusion",
      "confirm static distal obstruction, then restore flow with fenestration, stenting or peripheral bypass"
    ],
    "viva-d10": [
      "diastolic inflation and presystolic deflation provide modest support that still depends on native LV ejection",
      "IABP-SHOCK II found no mortality benefit from routine IABP use in post-MI cardiogenic shock",
      "Impella or temporary LVAD for isolated LV failure; VA-ECMO for biventricular or cardiorespiratory collapse"
    ],
    "viva-d11": [
      "a type III protamine reaction causing pulmonary vasoconstriction, acute RV failure and systemic collapse",
      "about 1 mg protamine per 100 units heparin, titrated to ACT because excess protamine impairs coagulation and platelets",
      "stop protamine, support the RV, lower PVR and resume CPB if instability persists"
    ],
    "viva-d12": [
      "the AV node and His bundle lie near the membranous septum; use DDD pacing at two to three times capture threshold",
      "observe five to seven days; persistent LBBB, prolonged HV and pre-existing disease predict non-recovery",
      "secure transvenous temporary pacing and proceed to permanent pacemaker implantation"
    ],
    "viva-d13": [
      "vasoplegia: a warm low-SVR state after CPB that must be separated from pump failure and tamponade",
      "exclude mimics, then escalate norepinephrine, vasopressin, methylene blue, hydroxocobalamin and angiotensin II sequentially",
      "exclude localized tamponade with echo and a low threshold for surgical re-exploration"
    ],
    "viva-d14": [
      "localized clot tamponade causing falling cardiac index, rising filling pressures and abruptly stopped drains",
      "use echo when available, but reopen and evacuate the clot before arrest",
      "mechanical problems require mechanical correction rather than escalating pharmacology"
    ]
  };

  (window.VIVA || []).forEach(viva => {
    const days = [viva.day];
    const beat = viva.beats || [];
    const anchors = VIVA_ANCHORS[viva.id] || [];
    beat.slice(0, 3).forEach((item, i) => add(
      viva.id + "-card-" + (i + 1),
      viva.stem + " " + item.level + ": " + item.ask + " Answer anchor: {{c1::" + anchors[i] + "}}.",
      "viva", viva.id, "beat-" + (i + 1), days, viva.topic
    ));
    add(viva.id + "-card-4", viva.stem + " Opening mechanism: {{c1::" + anchors[0] + "}}.", "viva", viva.id, "stem-mechanism", days, viva.topic);
    add(viva.id + "-card-5", viva.stem + " Exception or rescue anchor: {{c1::" + anchors[2] + "}}.", "viva", viva.id, "stem-rescue", days, viva.topic);
  });

  /* Daily legacy cases and Crisis Rooms intentionally contribute no flashcards.
     Decision paths belong in the richer simulations and debriefs, not as rote
     step-recall cards. */

  /* ----------------------------------------------------------------------
     INTERACTIVE EXERCISES — label targets only.
     (Order-the-steps cards were removed by request: they tested rote recall of
     the sequence rather than understanding.) */
  (window.EXERCISES || []).forEach(exercise => {
    const days = [exercise.day];
    if (exercise.type === "label") {
      (exercise.targets || []).forEach((target, i) => add(
        "module-exercise-" + exercise.id + "-label-" + (safeId(target.zone) || String(i + 1).padStart(2, "0")),
        exercise.title + ": " + text(target.hint) + " This identifies {{c1::" + text(target.label) + "}}.",
        "exercise", exercise.id, "target-" + (target.zone || i + 1), days, exercise.title
      ));
    }
  });

  /* ----------------------------------------------------------------------
     ANGIOGRAPHY — two source-grounded facts per section and two per staged
     image case. Each deletion is a concise interpretation target; the source
     section or staged prompt remains visible as retrieval context. */
  const ANGIO_SECTION_ANCHORS = {
    "orientation-history": ["Mason Sones performed the first selective coronary arteriogram on October 30, 1958", "coronary anatomy must be interpreted projection by projection rather than as a static photograph"],
    "orientation-practice": ["deliberate review of many angiograms builds visual fluency", "active vessel tracing and structured reporting are more effective than passive exposure"],
    "orientation-sequence": ["context and acquisition, then anatomy, disease, physiology and surgical meaning", "finish each read with target quality, runoff and the operative consequence"],
    "orientation-static-boundary": ["static frames cannot show transit speed, tissue washout or systolic compression", "cine is required to grade TIMI flow, TMPG and other time-dependent findings"],
    "safe-procedure-arc": ["arterial access, selective ostial engagement and contrast cine in multiple projections", "confirm access, renal and allergy risk, anticoagulation and radiation planning before acquisition"],
    "safe-engagement": ["JR4 for the RCA and JL4 for the left system are starting shapes adjusted to root and ostial anatomy", "a normal aortic pressure waveform must be present before coronary injection"],
    "safe-manifold-sequence": ["de-air, confirm pressure, engage, reconfirm pressure, test, then acquire", "damping or ventricularization means withdraw and do not inject"],
    "safe-pressure": ["an arterial upstroke, dicrotic notch and preserved diastolic pressure", "damping lowers pulse amplitude; ventricularization creates an LV-like waveform"],
    "anatomy-rca": ["the RCA arises from the right sinus and follows the right AV groove toward the crux", "in right dominance the RCA gives the PDA and posterolateral branches"],
    "anatomy-left-main-lad": ["the left main arises from the left sinus just below the sinotubular ridge", "the LAD follows the anterior interventricular groove and gives septal and diagonal branches"],
    "anatomy-lcx": ["the LCx follows the left atrioventricular groove", "obtuse marginal branches supply the lateral and posterolateral LV"],
    "anatomy-dominance": ["dominance is defined by the artery that reaches the crux and supplies the PDA", "right dominance assigns the PDA to RCA; left dominance assigns it to LCx"],
    "geometry-axes": ["RAO and LAO describe detector rotation around the patient", "cranial and caudal describe detector tilt toward the head or feet"],
    "geometry-left-corners": ["LAO cranial separates the LAD and diagonal system", "caudal views open the distal left-main and proximal LCx relationships"],
    "geometry-supplemental": ["AP cranial emphasizes LAD, whereas AP caudal emphasizes left main and LCx", "true lateral can profile the anterior LIMA-to-LAD insertion"],
    "geometry-errors": ["foreshortening compresses vessel length and obscures landing zones", "overlap superimposes branches or calcium and requires an orthogonal view"],
    "left-lao-cranial": ["LAO cranial elongates the LAD and fans the diagonal branches", "a caudal view is usually better for the left-main bifurcation and LCx ostium"],
    "left-spider": ["LAO caudal spreads the distal left main, proximal LAD and proximal LCx", "catheter overlap and foreshortening can make the spider view misleading"],
    "left-rao-cranial-caudal": ["RAO cranial elongates LAD and separates septal and diagonal branches", "RAO caudal follows LCx and obtuse marginals through the AV groove"],
    "left-system-tracing": ["trace continuously from ostium to left main, LAD, LCx and every major distal branch", "continuous tracing prevents diagonals, marginals and distal LAD from being mislabeled"],
    "right-lao": ["LAO cranial commonly gives the RCA a recognizable C-shaped course", "sufficient cranial tilt separates the PDA and posterolateral bifurcation"],
    "right-rao-distal": ["RAO provides an alternate profile of proximal and mid RCA", "adding cranial angulation separates the distal PDA and posterolateral branches"],
    "graft-projections": ["image every graft from origin through body and anastomosis to distal runoff", "assess graft stenosis, kink, competitive flow and the native recipient bed"],
    "right-quality": ["ostial streaming, incomplete filling, overlap, damping and motion are recognizable quality failures", "state acquisition limitations explicitly before making an RCA or graft conclusion"],
    "lesion-geometry": ["diameter stenosis compares the narrowest lumen with an appropriate reference segment", "a 50 percent diameter reduction corresponds to about 75 percent area loss"],
    "lesion-complete-description": ["describe lesion segment, severity, length, geometry and reference caliber", "also report calcification, bifurcation involvement, flow and distal-vessel quality"],
    "lesion-legacy-abc": ["type A, B and C are a historical lesion-morphology vocabulary", "the A-B-C scheme is not a complete contemporary procedural-risk model"],
    "lesion-anatomy-physiology": ["anatomic severity describes visible luminal narrowing", "physiologic significance asks whether pressure or flow limitation produces ischemia"],
    "pathology-calcification-ulceration": ["coronary calcium may appear before contrast as radiopacity moving with the artery", "an irregular static contour alone cannot prove calcium or plaque ulceration"],
    "pathology-filling-defect": ["the differential includes thrombus, air, dissection and artifact", "procedural context, cine behavior and orthogonal views discriminate a filling defect"],
    "pathology-bridging": ["a myocardial bridge is a coronary segment, usually LAD, that tunnels through myocardium", "cine diagnosis requires systolic compression with diastolic relaxation"],
    "pathology-complications": ["coronary dissection or perforation can produce ischemia or tamponade", "system de-airing and pressure checks reduce preventable embolic complications"],
    "variants-fistula": ["a coronary fistula connects a coronary artery to a chamber or great vessel", "define origin, course, termination and shunt consequence before considering closure"],
    "variants-anomalies": ["opposite-sinus risk depends on the proximal three-dimensional course", "a retroaortic anomalous LCx is vulnerable during mitral and aortic root surgery"],
    "variants-collaterals": ["collaterals enlarge in response to a chronic pressure gradient", "donor-artery stenosis can jeopardize both native and collateral-dependent territories"],
    "variants-aneurysm": ["a coronary aneurysm is a localized diameter greater than 1.5 times the reference segment", "cross-sectional imaging better defines mural thrombus and external aneurysm size"],
    "flow-timi": ["TIMI 0 is no flow, 1 penetration, 2 delayed flow and 3 normal flow", "TIMI flow cannot be graded reliably from a single static frame"],
    "flow-blush": ["TMPG grades myocardial tissue contrast kinetics separately from epicardial flow", "TMPG 0 is absent tissue contrast; TMPG 3 has normal entry and washout"],
    "flow-discordance": ["TIMI 3 flow with poor TMPG indicates persistent microvascular perfusion failure", "an open epicardial conduit does not guarantee adequate tissue perfusion"],
    "flow-static-practice": ["static scenarios can teach flow definitions but cannot demonstrate transit time", "cine is required to judge contrast arrival, distal transit and tissue washout"],
    "adjuncts-lvgram": ["RAO ventriculography profiles anterior, apical and inferior wall motion", "LAO ventriculography profiles lateral, septal and inferior regions"],
    "adjuncts-hemodynamics": ["catheterization directly measures aortic, ventricular, atrial, pulmonary and wedge pressures", "simultaneous pressures can define valve gradients, filling patterns and pulmonary vascular load"],
    "adjuncts-physiology": ["FFR is distal coronary pressure divided by aortic pressure during maximal hyperemia", "iFR is a resting pressure ratio measured during the diastolic wave-free period"],
    "adjuncts-ivus-ctca": ["IVUS images coronary lumen and vessel wall in cross-section", "CTCA defines three-dimensional coronary origin, course and surrounding anatomy"],
    "surgery-map": ["map each territory's lesion, distal target, caliber, wall quality, runoff and viability", "finish angiographic interpretation with the practical operative consequence"],
    "surgery-target-conduit": ["a favorable target has viable territory, adequate caliber, healthy accessible wall and good runoff", "competitive native flow can jeopardize an arterial graft placed on a moderate lesion"],
    "surgery-graft-failure": ["very early graft dysfunction is usually technical or thrombotic", "transit-time flow and TEE wall motion can expose a graft problem before leaving the OR"],
    "surgery-integrated-report": ["report dominance, major anatomy, lesions, uncertainty, physiology, flow, targets and graft status", "a concise surgical synthesis depends on a complete systematic review"
    ]
  };

  const ANGIO_CASE_ACTIONS = {
    "case-pressure-ventricularization": "withdraw the catheter and do not inject until a normal aortic waveform returns",
    "case-left-rao-caudal": "map LCx and OM targets, then obtain an orthogonal cranial view before judging the LAD",
    "case-left-lao-cranial": "separate LAD from diagonal targets before planning LIMA placement",
    "case-left-ramus": "treat a large diseased ramus as an independent bypass target",
    "case-left-rao-cranial-trace": "confirm a usable mid-distal LAD and whether a substantial diagonal needs its own graft",
    "case-rca-distal-bifurcation": "report PDA and posterolateral branches separately as possible targets",
    "case-rca-suboptimal": "obtain a better cranial or orthogonal view before assigning distal branches",
    "case-calcified-ulcerated-plaque": "select a healthier distal landing zone and use intravascular imaging when plaque geometry matters",
    "case-filling-defect": "use context, cine and orthogonal views to distinguish air from thrombus and restore perfusion",
    "case-embolization-comparison": "stop repeat injection, inspect the system and restore distal perfusion",
    "case-myocardial-bridge": "avoid routine bypass of an incidental bridge and reserve surgery for selected ischemic anatomy",
    "case-lad-pa-fistula": "define every feeding and terminating channel while preserving normal coronary branches",
    "case-anomalous-lcx": "map the retroaortic LCx before mitral sutures, annuloplasty or aortic root work",
    "case-collateral-map": "graft a viable distal recipient while protecting the diseased collateral donor territory",
    "case-coronary-aneurysm": "define thrombus and branches before exclusion, ligation or distal bypass",
    "case-true-lateral-lima": "assess insertion stenosis, kink and runoff before choosing revision, PCI or another bypass"
  };
  const ANGIO_CASE_INTERPRETATIONS = {
    "case-filling-defect": "a source-labelled coronary thrombus frame that still requires an air-versus-thrombus differential until cine and procedural context identify the mechanism"
  };

  const angiography = window.ANGIOGRAPHY || {};
  const angioDays = angiography.meta && angiography.meta.day ? [angiography.meta.day] : [];
  (angiography.chapters || []).forEach(chapter => {
    (chapter.sections || []).forEach(section => {
      const anchors = ANGIO_SECTION_ANCHORS[section.id] || [];
      [0, 1].forEach(i => add(
        "module-angiography-section-" + section.id + "-" + (i + 1),
        chapter.title + " — " + section.title + ": {{c1::" + anchors[i] + "}}.",
        "angiography", section.id, "section-fact-" + (i + 1), angioDays, section.title
      ));
    });
  });
  (angiography.cases || []).forEach(item => {
    const stage1 = item.stage1 || {}, stage3 = item.stage3 || {};
    add("module-angiography-case-" + item.id + "-interpretation", text(stage1.prompt || item.title) + " Most specific interpretation: {{c1::" + (ANGIO_CASE_INTERPRETATIONS[item.id] || text(stage3.diagnosis)) + "}}.", "angiography", item.id, "case-interpretation", angioDays, item.title);
    add("module-angiography-case-" + item.id + "-consequence", item.title + " — " + text(stage3.diagnosis) + " Operative planning priority: {{c1::" + ANGIO_CASE_ACTIONS[item.id] + "}}.", "angiography", item.id, "case-consequence", angioDays, item.title);
  });

  window.MODULE_CLOZE_CARDS = cards;
})();
