/* Schema-v2 retrieval cards for the CPB circuit calibration pack. */
"use strict";

(function registerCpbCircuitCards() {
  if (!window.FlashcardSchema) throw new Error("flashcard-schema.js must load before the CPB retrieval pack");

  const ref = partId => ({ type: "lesson", id: "d10-circuit", partId: partId });
  const P = Object.freeze({
    PURPOSE: "why-cpb-exists-replacing-heart-and-lungs",
    VENOUS: "venous-drainage-bicaval-vs-two-stage-cannulation",
    RESERVOIR: "the-venous-reservoir",
    OXYGENATOR: "the-oxygenator-and-heat-exchanger",
    PUMPS: "roller-pumps-vs-centrifugal-pumps",
    ARTERIAL: "the-arterial-line-filter-and-arterial-cannulation",
    HEPARIN: "heparin-and-act-before-cannulation",
    DELIVERY: "flow-targets-do2-and-map-goals-on-bypass",
    GAS: "alpha-stat-vs-ph-stat-blood-gas-management",
    HEMODILUTION: "hemodilution-hematocrit-and-modified-ultrafiltration",
    TROUBLESHOOT: "pump-troubleshooting-high-line-pressure-low-venous-return-air-lock",
    VENT: "the-left-heart-vent-and-cardiotomy-suction",
    SENIOR: "senior-reasoning-perfusion-is-delivery-not-pressure",
    RESCUE: "pgy-5-mastery-the-abnormal-arterial-trace-is-a-dissection-and-the-air-em"
  });

  function card(config) {
    const refs = config.partIds.map(ref);
    const record = {
      schemaVersion: 2,
      id: config.id,
      claimIds: config.claimIds,
      archetype: config.archetype,
      tier: config.tier,
      category: config.category,
      cloze: config.cloze,
      explanation: config.explanation,
      source: refs[0],
      sourceRefs: refs
    };
    [
      "hint", "numeric", "guideline", "citation", "reviewedAt", "reviewBy",
      "answerCount", "ordered", "identityDisposition"
    ].forEach(field => {
      if (Object.prototype.hasOwnProperty.call(config, field)) record[field] = config[field];
    });
    return record;
  }

  const cards = [
    card({
      id: "fc2_emix7arlj42nm4zpc1hzyx1677",
      claimIds: ["cpb.circuit.flow-path"],
      archetype: "ordered-sequence", tier: "core", category: "sequence",
      cloze: "Main systemic CPB flow after venous drainage is {{c1::venous reservoir; oxygenator/heat exchanger; arterial pump; arterial filter; patient}}.",
      explanation: "This is the main systemic loop; cardioplegia and suction/vent blood travel in separate parallel loops.",
      partIds: [P.PURPOSE], answerCount: 5, ordered: true
    }),
    card({
      id: "fc2_8m9b321j5xpgr5nvvcl0ylgha8",
      claimIds: ["cpb.circuit.parallel-loops"],
      archetype: "bounded-set", tier: "core", category: "bounded-set",
      cloze: "The complete CPB setup contains three independently controlled loops: {{c1::systemic loop; cardioplegia loop; suction/vent loop}}.",
      explanation: "Each loop has its own pump or control because it must be started, stopped, and titrated independently.",
      partIds: [P.PURPOSE], answerCount: 3, ordered: false
    }),
    card({
      id: "fc-d10-circuit-anticoagulation-0l5052h",
      claimIds: ["cpb.circuit.anticoagulation-prerequisite"],
      archetype: "atomic-concept", tier: "core", category: "mechanism",
      cloze: "Blood contacting the synthetic CPB circuit requires full {{c1::anticoagulation}} before bypass.",
      explanation: "Without heparinization, contact activation rapidly produces circuit thrombus and systemic microemboli.",
      partIds: [P.PURPOSE], identityDisposition: "equivalent-rewrite"
    }),

    card({
      id: "fc-d10-circuit-single-two-stage-venous-cannula-0h5nlj4",
      claimIds: ["cpb.circuit.venous-cannulation-selection"],
      archetype: "atomic-concept", tier: "core", category: "comparison",
      cloze: "When the right atrium remains closed, venous drainage usually uses a {{c1::two-stage venous cannula}}.",
      explanation: "A two-stage cannula drains the IVC and right atrium through one right-atrial entry site, making it suitable for CABG and other closed-RA operations.",
      partIds: [P.VENOUS], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc-d10-circuit-bicaval-cannulation-1uszybm",
      claimIds: ["cpb.circuit.venous-cannulation-selection"],
      archetype: "atomic-concept", tier: "core", category: "comparison",
      cloze: "When the right atrium must be opened, venous drainage requires {{c1::bicaval cannulation}} with caval snares.",
      explanation: "Separate SVC and IVC cannulae isolate the right atrium while maintaining drainage and limiting air entrainment.",
      partIds: [P.VENOUS], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc2_1xrv766yv6beqendvgmqm1h3qf",
      claimIds: ["cpb.circuit.venous-drainage-failure"],
      archetype: "mechanism-decision", tier: "applied-core", category: "rescue",
      cloze: "A falling reservoir with venous-line chatter first suggests {{c1::impaired venous drainage}}.",
      explanation: "Check cannula kink or malposition, lost siphon, excessive vacuum, and true volume loss before reflexively giving fluid.",
      partIds: [P.VENOUS, P.TROUBLESHOOT]
    }),
    card({
      id: "fc2_301wa9g3jv9msqzrvu3zxwed7r",
      claimIds: ["cpb.circuit.vavd-tradeoff"],
      archetype: "contrast", tier: "applied-core", category: "comparison",
      cloze: "Compared with gravity drainage, excessive VAVD increases micro-air aspiration and {{c1::hemolysis}}.",
      explanation: "VAVD helps small or long venous cannulae, but negative pressure also creates reservoir-pressure and air-entry hazards.",
      partIds: [P.VENOUS]
    }),
    card({
      id: "fc-d10-circuit-persistent-left-svc-plsvc-1thbpx2",
      claimIds: ["cpb.circuit.plsvc-hazard"],
      archetype: "mechanism-decision", tier: "applied-core", category: "rescue",
      cloze: "A small innominate vein plus a dilated coronary sinus should suggest {{c1::persistent left SVC}}.",
      explanation: "PLSVC can flood the field and compromise retrograde cardioplegia; an inadequate innominate vein makes blind snaring unsafe and may require direct drainage.",
      partIds: [P.VENOUS], identityDisposition: "equivalent-rewrite"
    }),

    card({
      id: "fc2_5mflhjec83ely7d7yk4l6jgrcb",
      claimIds: ["cpb.circuit.reservoir-empty-emergency"],
      archetype: "mechanism-decision", tier: "core", category: "rescue",
      cloze: "When the venous reservoir nears empty, the immediate action is to {{c1::reduce or stop pump flow}}.",
      explanation: "Continuing arterial flow can entrain reservoir air and deliver it to the cerebral and coronary circulations.",
      partIds: [P.RESERVOIR]
    }),
    card({
      id: "fc2_7bwvz6m9qbol509zjriaur3v1d",
      claimIds: ["cpb.circuit.reservoir-design-comparison"],
      archetype: "contrast", tier: "core", category: "comparison",
      cloze: "Compared with an open hard-shell reservoir, a closed soft bag reduces blood-air contact but cannot provide {{c1::vacuum-assisted drainage}}.",
      explanation: "The open design offers capacity, visibility, and VAVD; the closed bag reduces inflammatory and gaseous exposure and collapses as it empties.",
      partIds: [P.RESERVOIR]
    }),
    card({
      id: "fc2_cv5cjupr6xmxn2efuf297xs1j9",
      claimIds: ["cpb.circuit.cardiotomy-gas-embolism", "cpb.circuit.cardiotomy-suction-trauma"],
      archetype: "atomic-concept", tier: "applied-core", category: "mechanism",
      cloze: "Within a membrane-oxygenator circuit, the largest routine source of gaseous microemboli is the {{c1::cardiotomy reservoir}}.",
      explanation: "Field-suction blood also carries more hemolysis, debris, and activated clotting factors than venous-return blood.",
      partIds: [P.RESERVOIR, P.VENT]
    }),

    card({
      id: "fc2_aqhg44nej377byfjjy4e5fex61",
      claimIds: ["cpb.circuit.oxygenator-gas-controls"],
      archetype: "mapping-set", tier: "core", category: "comparison",
      cloze: "Membrane-oxygenator gas controls map as {{c1::FiO2 → oxygenation; sweep flow → CO2 removal}}.",
      explanation: "FiO2 functions like inspired oxygen, whereas sweep flow functions like minute ventilation.",
      partIds: [P.OXYGENATOR], answerCount: 2, ordered: false
    }),
    card({
      id: "fc-d10-circuit-hollow-fiber-membrane-oxygenator-1c8g6oz",
      claimIds: ["cpb.circuit.membrane-oxygenator-advantage"],
      archetype: "atomic-concept", tier: "core", category: "comparison",
      cloze: "Modern CPB limits direct blood-gas contact with a {{c1::hollow-fiber membrane oxygenator}}.",
      explanation: "Separating gas from blood reduces the hemolysis, protein injury, and gaseous microemboli produced by older bubble oxygenators.",
      partIds: [P.OXYGENATOR], identityDisposition: "equivalent-rewrite"
    }),

    card({
      id: "fc2_7ld9iu23f0kgq49cily70z2q64",
      claimIds: ["cpb.circuit.roller.variables"],
      archetype: "bounded-set", tier: "core", category: "bounded-set",
      cloze: "Roller-pump delivered flow is set by four variables: {{c1::tubing internal diameter; RPM; compression-raceway length; roller occlusion}}.",
      explanation: "Together these determine displaced volume per revolution and how completely the tubing is compressed.",
      partIds: [P.PUMPS], answerCount: 4, ordered: false
    }),
    card({
      id: "fc-d10-circuit-roller-pump-0ren6td",
      claimIds: ["cpb.circuit.roller.afterload-independence"],
      archetype: "contrast", tier: "core", category: "comparison",
      cloze: "Unlike a centrifugal pump, the {{c1::roller pump}} delivers flow largely independent of downstream afterload.",
      explanation: "Rotor speed and tubing displacement set roller flow, so obstruction raises pressure rather than automatically reducing flow.",
      partIds: [P.PUMPS], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc2_crkz9h6f39g2qior0suw9ppsp6",
      claimIds: ["cpb.circuit.roller.obstruction-response", "cpb.circuit.troubleshoot-high-pressure"],
      archetype: "mechanism-decision", tier: "applied-core", category: "mechanism",
      cloze: "With arterial-line obstruction, a roller pump maintains set flow while {{c1::line pressure rises dangerously}}.",
      explanation: "Stop and exclude a kink, closed clamp, cannula malposition, or cannulation-site dissection rather than forcing more flow.",
      partIds: [P.PUMPS, P.TROUBLESHOOT]
    }),
    card({
      id: "fc2_93eejpsw9adghrkgx64ple5v1a",
      claimIds: ["cpb.circuit.roller.occlusion-calibration"],
      archetype: "numeric-guideline", tier: "core", category: "number",
      cloze: "Roller occlusion is tuned against standing-column back pressure of about {{c1::45–75 mmHg}}.",
      explanation: "The lesson describes barely non-occlusive adjustment: tighter settings increase trauma, while looser settings permit backflow.",
      partIds: [P.PUMPS],
      numeric: { comparator: "range", value: [45, 75], unit: "mmHg", condition: "standing-column roller-occlusion calibration", precision: "approximate" },
      citation: ref(P.PUMPS), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_3waqmsdimeoio54u5c0w4liu4b",
      claimIds: ["cpb.circuit.roller.occlusion-errors"],
      archetype: "mapping-set", tier: "applied-core", category: "comparison",
      cloze: "The main roller-occlusion errors map as {{c1::too tight → hemolysis/tubing wear; too loose → backflow}}.",
      explanation: "Occlusion must be tight enough to limit retrograde flow without unnecessarily crushing blood and tubing.",
      partIds: [P.PUMPS], answerCount: 2, ordered: false
    }),
    card({
      id: "fc-d10-circuit-spallation-13q1x2i",
      claimIds: ["cpb.circuit.roller.spallation"],
      archetype: "atomic-concept", tier: "applied-core", category: "mechanism",
      cloze: "Repeated roller compression can shed tubing microparticles called {{c1::spallation}}.",
      explanation: "Spallation is accompanied by tubing wear and is one reason roller pumps are less favored for the main arterial line.",
      partIds: [P.PUMPS], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc-d10-circuit-sucker-systems-and-cardioplegia-delivery-1dtyakx",
      claimIds: ["cpb.circuit.roller.current-use"],
      archetype: "atomic-concept", tier: "core", category: "definition",
      cloze: "Modern roller pumps are used mainly for {{c1::sucker systems and cardioplegia delivery}} rather than the arterial line.",
      explanation: "Centrifugal pumps are commonly favored for main-circuit flow because their output falls as resistance rises.",
      partIds: [P.PUMPS], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc2_dfz1dxb4xcmwtujd3ymyh64xbx",
      claimIds: ["cpb.circuit.centrifugal-resistance-response"],
      archetype: "contrast", tier: "core", category: "comparison",
      cloze: "Unlike a roller pump, centrifugal-pump flow falls when afterload rises or {{c1::preload falls}}.",
      explanation: "A centrifugal pump therefore needs a flow probe because RPM alone does not establish delivered flow.",
      partIds: [P.PUMPS]
    }),
    card({
      id: "fc2_ep55uva3jni82ods5kq3mgcst8",
      claimIds: ["cpb.circuit.centrifugal-stop-backflow"],
      archetype: "mechanism-decision", tier: "applied-core", category: "rescue",
      cloze: "If a centrifugal arterial pump stops, immediately {{c1::clamp the arterial line}} to prevent aortic backflow.",
      explanation: "The non-occlusive pump head cannot prevent retrograde flow when it is stationary.",
      partIds: [P.PUMPS]
    }),

    card({
      id: "fc-d10-circuit-ascending-aorta-05ez9vx",
      claimIds: ["cpb.circuit.arterial-cannulation-selection"],
      archetype: "atomic-concept", tier: "applied-core", category: "comparison",
      cloze: "For a primary operation with a clean aorta, the standard arterial return site is the {{c1::ascending aorta}}.",
      explanation: "Central cannulation is short, direct, high-flow, and antegrade; palpation or epiaortic ultrasound must confirm a safe landing zone.",
      partIds: [P.ARTERIAL], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc2_elevikhyglogdg1i6oaf60ufl7",
      claimIds: ["cpb.circuit.arterial-cannulation-selection"],
      archetype: "atomic-concept", tier: "applied-core", category: "comparison",
      cloze: "Before hazardous redo sternotomy or during crash access, arterial return may use the {{c1::femoral artery}}.",
      explanation: "Femoral access is rapid and remote from the chest, but retrograde flow can mobilize aortic atheroma and the cannula can threaten limb perfusion.",
      partIds: [P.ARTERIAL]
    }),
    card({
      id: "fc2_aupf9erk18f28ocsmtu1e7q4ue",
      claimIds: ["cpb.circuit.arterial-cannulation-selection"],
      archetype: "atomic-concept", tier: "applied-core", category: "comparison",
      cloze: "For arch work or a porcelain aorta requiring antegrade flow, arterial return often uses the {{c1::axillary/subclavian artery}}.",
      explanation: "A side graft can support antegrade systemic and cerebral perfusion, with tradeoffs including plexus injury and arterial thrombosis.",
      partIds: [P.ARTERIAL]
    }),

    card({
      id: "fc2_8daxcd8dakagvmesiek1sn697b",
      claimIds: ["cpb.circuit.heparin-initial-dose"],
      archetype: "numeric-guideline", tier: "core", category: "number",
      cloze: "Before adult CPB, the usual initial IV heparin bolus is approximately {{c1::300–400 U/kg}}.",
      explanation: "Confirm the institution's protocol and verify anticoagulant effect with ACT before initiating bypass.",
      partIds: [P.HEPARIN],
      numeric: { comparator: "range", value: [300, 400], unit: "U/kg", condition: "initial adult IV bolus before CPB", precision: "approximate" },
      citation: ref(P.HEPARIN), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_dtunvwf2plf3bm1wtvs50raic9",
      claimIds: ["cpb.circuit.act-minimum"],
      archetype: "numeric-guideline", tier: "core", category: "number",
      cloze: "The generally accepted minimum ACT before adult CPB is {{c1::at least 400 seconds}}.",
      explanation: "Many programs use a higher threshold; the local protocol governs the hard stop before bypass.",
      partIds: [P.HEPARIN],
      numeric: { comparator: "at least", value: 400, unit: "seconds", condition: "before adult CPB", precision: "institution-dependent" },
      citation: ref(P.HEPARIN), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_1biroixmm3dc2tx9qjfuuws99b",
      claimIds: ["cpb.circuit.act-common-target"],
      archetype: "numeric-guideline", tier: "core", category: "number",
      cloze: "Many adult CPB programs require ACT of {{c1::at least 480 seconds}} before initiating flow.",
      explanation: "This is a common program target rather than a universal rule; verify the local protocol before clinical use.",
      partIds: [P.HEPARIN],
      numeric: { comparator: "at least", value: 480, unit: "seconds", condition: "before initiating adult CPB in programs using this target", precision: "institution-dependent" },
      citation: ref(P.HEPARIN), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_7btv1f1rcd3h6rktr4hx24vk0d",
      claimIds: ["cpb.circuit.heparin-resistance"],
      archetype: "mechanism-decision", tier: "applied-core", category: "rescue",
      cloze: "Failure of ACT to rise after adequate heparin most strongly suggests {{c1::antithrombin deficiency}}.",
      explanation: "Because heparin depends on antithrombin, treatment is antithrombin replacement with concentrate or plasma according to protocol rather than unlimited heparin escalation.",
      partIds: [P.HEPARIN]
    }),

    card({
      id: "fc2_ch8hxk247omepsbhcnc9h4jvze",
      claimIds: ["cpb.circuit.normothermic-flow-index"],
      archetype: "numeric-guideline", tier: "core", category: "number",
      cloze: "At 35–37 C with hematocrit near 25%, adult pump-flow index is about {{c1::2.4 L/min/m2}}.",
      explanation: "The condition matters: cooling reduces metabolic demand, while deeper hemodilution can require more flow to preserve oxygen delivery.",
      partIds: [P.DELIVERY],
      numeric: { comparator: "approximately", value: 2.4, unit: "L/min/m2", condition: "adult CPB at 35–37 C with hematocrit about 25%", precision: "approximate" },
      citation: ref(P.DELIVERY), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_6385zkx3mndd36qqnnfqmsimp5",
      claimIds: ["cpb.circuit.do2-formula"],
      archetype: "formula", tier: "core", category: "formula",
      cloze: "On CPB, indexed oxygen delivery is calculated as {{c1::CaO2 × pump-flow index × 10}}.",
      explanation: "The factor of 10 converts oxygen content in mL/dL and flow in L/min/m2 into mL/min/m2.",
      partIds: [P.DELIVERY, P.SENIOR]
    }),
    card({
      id: "fc2_a5gsj064rey8103vftp2skds7c",
      claimIds: ["cpb.circuit.do2-levers"],
      archetype: "bounded-set", tier: "core", category: "bounded-set",
      cloze: "Low CPB oxygen delivery has two direct corrective levers: {{c1::pump flow; hematocrit}}.",
      explanation: "Flow changes the volume delivered, while hematocrit changes the hemoglobin-bound oxygen carried in each unit of blood.",
      partIds: [P.DELIVERY], answerCount: 2, ordered: false
    }),
    card({
      id: "fc2_d1kqzlwvzb9822jrufn1i1ym42",
      claimIds: ["cpb.circuit.map-target-vasculopathy"],
      archetype: "numeric-guideline", tier: "applied-core", category: "number",
      cloze: "Older or vasculopathic adults on CPB are commonly perfused toward MAP {{c1::70–80 mmHg}}.",
      explanation: "This lesson target is population- and institution-dependent; pressure must still be interpreted alongside flow, hematocrit, SvO2, and lactate.",
      partIds: [P.DELIVERY],
      numeric: { comparator: "range", value: [70, 80], unit: "mmHg", condition: "older or vasculopathic adult on CPB", precision: "institution-dependent" },
      citation: ref(P.DELIVERY), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_e7zo30wblhczmuxzg3iyffq045",
      claimIds: ["cpb.circuit.low-map-differential"],
      archetype: "bounded-set", tier: "applied-core", category: "bounded-set",
      cloze: "Low MAP during CPB should prompt four checks before reflex volume: {{c1::pump flow; aortic dissection; measurement artifact; vasoplegia}}.",
      explanation: "The correct response follows the cause; a vasopressor does not repair inadequate flow, false-lumen perfusion, or a bad measurement.",
      partIds: [P.DELIVERY], answerCount: 4, ordered: false
    }),

    card({
      id: "fc2_4lgv9s6n2e1kfun20jujh4h2pa",
      claimIds: ["cpb.circuit.do2-injury-threshold"],
      archetype: "numeric-guideline", tier: "applied-core", category: "number",
      cloze: "CPB organ-injury risk rises when indexed DO2 falls below roughly {{c1::270–300 mL/min/m2}}.",
      explanation: "Treat this as an approximate risk band, not a stand-alone transfusion trigger; interpret it with flow, hematocrit, SvO2, and lactate.",
      partIds: [P.SENIOR],
      numeric: { comparator: "range", value: [270, 300], unit: "mL/min/m2", condition: "indexed DO2 injury-threshold band during CPB", precision: "approximate" },
      citation: ref(P.SENIOR), reviewedAt: null, reviewBy: null
    }),
    card({
      id: "fc2_43n64v5ukscqqbkdrr3edr4it5",
      claimIds: ["cpb.circuit.cao2-formula"],
      archetype: "formula", tier: "core", category: "formula",
      cloze: "Arterial oxygen content on CPB is {{c1::(1.34 × Hb × SaO2) + (0.003 × PaO2)}}.",
      explanation: "The hemoglobin-bound term dominates, so PaO2 alone cannot compensate for severe hemodilution.",
      partIds: [P.SENIOR]
    }),
    card({
      id: "fc2_cdnc8hjaeebnfogpp0zrwrcri4",
      claimIds: ["cpb.circuit.delivery-adequacy-markers"],
      archetype: "bounded-set", tier: "applied-core", category: "bounded-set",
      cloze: "Adequate CPB oxygen delivery is trended with {{c1::mixed venous saturation; lactate trajectory}}.",
      explanation: "A falling SvO2 or rising lactate can expose inadequate delivery despite an apparently acceptable MAP.",
      partIds: [P.SENIOR], answerCount: 2, ordered: false
    }),
    card({
      id: "fc2_53rpychree47q9fue2s1pev7ka",
      claimIds: ["cpb.circuit.pressure-not-delivery"],
      archetype: "atomic-concept", tier: "core", category: "model",
      cloze: "A normal CPB MAP does not by itself prove adequate {{c1::oxygen delivery}}.",
      explanation: "Low pump flow, low hematocrit, or oxygenator failure can all reduce DO2 while pressure remains normal.",
      partIds: [P.SENIOR]
    }),

    card({
      id: "fc2_718fjc0oloyglbx6ie63v8kfw7",
      claimIds: ["cpb.circuit.blood-gas-strategy-selection"],
      archetype: "atomic-concept", tier: "core", category: "comparison",
      cloze: "Routine adult hypothermic CPB outside deep arrest generally uses {{c1::alpha-stat}} to preserve autoregulation.",
      explanation: "Alpha-stat interprets gases at the 37 C reference and keeps cerebral flow coupled more closely to metabolism.",
      partIds: [P.GAS]
    }),
    card({
      id: "fc-d10-circuit-ph-stat-1yqyz4r",
      claimIds: ["cpb.circuit.blood-gas-strategy-selection"],
      archetype: "atomic-concept", tier: "core", category: "comparison",
      cloze: "Cooling for deep hypothermic circulatory arrest often uses {{c1::pH-stat}} to increase cerebral blood flow.",
      explanation: "Temperature correction and added carbon dioxide promote more uniform cooling, at the cost of reduced flow-metabolism coupling.",
      partIds: [P.GAS], identityDisposition: "equivalent-rewrite"
    }),

    card({
      id: "fc-d10-circuit-25-30-087fee7",
      claimIds: ["cpb.circuit.hematocrit-target"],
      archetype: "numeric-guideline", tier: "applied-core", category: "number",
      cloze: "Most adult CPB programs target hematocrit around {{c1::25–30%}}.",
      explanation: "The target is institution- and patient-dependent and should be interpreted through oxygen delivery rather than used as an isolated transfusion trigger.",
      partIds: [P.HEMODILUTION],
      numeric: { comparator: "range", value: [25, 30], unit: "%", condition: "adult CPB", precision: "institution-dependent" },
      citation: ref(P.HEMODILUTION), reviewedAt: null, reviewBy: null,
      identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc2_dfal26hj3ntglhx1mfcwl54dl3",
      claimIds: ["cpb.circuit.muf-mechanism"],
      archetype: "mechanism-decision", tier: "applied-core", category: "mechanism",
      cloze: "Modified ultrafiltration raises hematocrit by removing {{c1::plasma water}} while retaining cells and factors.",
      explanation: "The hemoconcentrator also reduces some accumulated inflammatory mediators and is used especially in pediatric and selected adult cases.",
      partIds: [P.HEMODILUTION]
    }),

    card({
      id: "fc2_3x8f8fkypdqq5o0vo9cqbowd54",
      claimIds: ["cpb.circuit.troubleshoot-air-lock"],
      archetype: "mechanism-decision", tier: "applied-core", category: "rescue",
      cloze: "Sudden venous-return loss despite adequate volume and an air-filled line suggests {{c1::venous air lock}}.",
      explanation: "The trapped air interrupts siphon drainage and must be cleared before normal venous return can resume.",
      partIds: [P.TROUBLESHOOT]
    }),

    card({
      id: "fc2_95ti7ak0rk7agjnz5eytnzudy1",
      claimIds: ["cpb.circuit.lv-vent-indication"],
      archetype: "mechanism-decision", tier: "core", category: "mechanism",
      cloze: "During arrest, ongoing bronchial and thebesian return requires an {{c1::LV vent}} to prevent distension.",
      explanation: "A non-ejecting LV otherwise accumulates blood, raising wall tension and worsening subendocardial ischemia.",
      partIds: [P.VENT]
    }),
    card({
      id: "fc-d10-circuit-tee-0arvomy",
      claimIds: ["cpb.circuit.lv-distension-monitoring"],
      archetype: "atomic-concept", tier: "applied-core", category: "definition",
      cloze: "During cross-clamp, occult LV distension is monitored most reliably with {{c1::TEE}} or direct left-sided pressure.",
      explanation: "Inspection and palpation can miss progressive distension from bronchial, thebesian, or regurgitant return.",
      partIds: [P.VENT], identityDisposition: "equivalent-rewrite"
    }),

    card({
      id: "fc-d10-circuit-stop-01e9lsa",
      claimIds: ["cpb.circuit.dissection-recognition"],
      archetype: "mechanism-decision", tier: "applied-core", category: "rescue",
      cloze: "At bypass initiation, rising line pressure plus a flat trace and expanding aorta requires {{c1::stopping the pump}}.",
      explanation: "Treat the pattern as false-lumen cannulation or iatrogenic aortic dissection until proven otherwise; never push more flow.",
      partIds: [P.RESCUE], identityDisposition: "equivalent-rewrite"
    }),
    card({
      id: "fc2_do7kskbzg1gqie6kmg8pwt6cj8",
      claimIds: ["cpb.circuit.dissection-rescue-sequence"],
      archetype: "ordered-sequence", tier: "applied-core", category: "sequence",
      cloze: "After suspected cannulation dissection, the rescue sequence is {{c1::stop flow; re-cannulate true lumen; cool and arrest; open aortic repair}}.",
      explanation: "True-lumen access may use axillary, innominate, or guided central cannulation before hypothermic open repair.",
      partIds: [P.RESCUE], answerCount: 4, ordered: true
    }),
    card({
      id: "fc2_bfx7a62i1d3lne29quvapukr7d",
      claimIds: ["cpb.circuit.air-embolism-rescue-sequence"],
      archetype: "ordered-sequence", tier: "applied-core", category: "sequence",
      cloze: "For massive arterial air on CPB, the immediate sequence is {{c1::stop flow; steep Trendelenburg; de-air line and aorta}}.",
      explanation: "Retrograde cerebral perfusion and deep hypothermia are conditional adjuncts after the mandatory first actions.",
      partIds: [P.RESCUE], answerCount: 3, ordered: true
    })
  ];

  window.FlashcardSchema.registerPack({
    source: { type: "lesson", id: "d10-circuit" },
    claims: [],
    cards: cards,
    rebuild: true,
    reviewer: "retrieval-calibration-audit",
    reviewedAt: "2026-07-31",
    workloadJustification: "This 48-card calibration replaces sentence sampling with full must-know coverage across 19 CPB teaching chunks; cards are short and role-specific, and the count includes nine pump-family calibration cards plus crisis, formula, comparison, and numeric targets that should not be collapsed without losing distinct retrieval decisions."
  });
})();
