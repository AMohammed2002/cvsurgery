/* Additional landmark studies needed to close the 14-day evidence circuit. */
"use strict";

window.TRIALS.trials.push(
  {
    id: "momentum3", category: "support", name: "MOMENTUM 3",
    full: "Multicenter Study of MagLev Technology in Patients Undergoing Mechanical Circulatory Support Therapy with HeartMate 3",
    year: 2019, journal: "NEJM", topic: "Durable LVAD support",
    question: "Does a fully magnetically levitated centrifugal-flow LVAD improve outcomes compared with an axial-flow pump?",
    design: "Randomized multicenter noninferiority trial with a prespecified superiority analysis",
    population: "Patients with advanced heart failure eligible for durable LVAD support",
    intervention: "HeartMate 3 magnetically levitated centrifugal-flow LVAD",
    comparator: "HeartMate II axial-flow LVAD",
    outcome: "At 2 years, survival free from disabling stroke or reoperation to replace or remove a malfunctioning device was higher with HeartMate 3, driven largely by much less pump thrombosis and reoperation.",
    bottomLine: "Pump design matters. A wide blood-flow path and magnetic levitation markedly reduced pump thrombosis and made HeartMate 3 the dominant durable LVAD platform.",
    pearls: [
      "The primary endpoint combines survival, disabling stroke and device reoperation.",
      "The largest treatment difference was freedom from pump replacement or removal for malfunction.",
      "The trial does not remove the need to manage RV failure, bleeding, infection and aortic insufficiency."
    ],
    citation: "Mehra MR et al. N Engl J Med. 2019;380:1618-1627. doi:10.1056/NEJMoa1900486.",
    mcqs: [
      { q: "Which device feature most directly distinguishes HeartMate 3 in MOMENTUM 3?", options: ["A pulsatile pneumatic chamber","An external counterpulsation balloon","A fully magnetically levitated centrifugal rotor","An axial rotor with mechanical bearings"], answer: 2, explain: "HeartMate 3 uses a fully magnetically levitated centrifugal rotor with wide blood-flow paths." },
      { q: "What primarily drove the superior 2-year composite outcome with HeartMate 3?", options: ["Elimination of driveline infection","Lower right-heart failure after implantation","No requirement for antithrombotic therapy","Fewer pump-thrombosis reoperations"], answer: 3, explain: "The major separation was the reduction in pump thrombosis and pump replacement/removal." },
      { q: "Which complication remains clinically important despite the HeartMate 3 result?", options: ["Right-ventricular failure","Only native-valve endocarditis","Only coronary vasospasm","Only acute limb ischemia"], answer: 0, explain: "Improved pump hemocompatibility does not eliminate patient-device complications such as RV failure, bleeding or infection." }
    ]
  },
  {
    id: "fibres", category: "perioperative", name: "FIBRES",
    full: "Fibrinogen Replenishment in Surgery",
    year: 2019, journal: "JAMA", topic: "Post-CPB fibrinogen replacement",
    question: "Is fibrinogen concentrate noninferior to cryoprecipitate for bleeding cardiac-surgery patients with acquired hypofibrinogenemia?",
    design: "Randomized, active-control, phase 3 noninferiority trial",
    population: "Adult cardiac-surgery patients with clinically significant bleeding and hypofibrinogenemia after cardiopulmonary bypass",
    intervention: "Fibrinogen concentrate",
    comparator: "Cryoprecipitate",
    outcome: "Fibrinogen concentrate was noninferior to cryoprecipitate for the number of allogeneic blood-component units transfused during the first 24 hours after bypass.",
    bottomLine: "Use a goal-directed fibrinogen-replacement strategy. Fibrinogen concentrate is a practical alternative where available; product choice does not replace surgical-source assessment.",
    pearls: [
      "The study addressed acquired hypofibrinogenemia with active bleeding, not empiric treatment of every post-CPB patient.",
      "The endpoint was total allogeneic components, not proof that one product prevents re-exploration.",
      "Persistent bleeding still demands inspection for a surgical source."
    ],
    citation: "Callum J et al. JAMA. 2019;322:1966-1976. doi:10.1001/jama.2019.17312.",
    mcqs: [
      { q: "What was the principal conclusion of FIBRES?", options: ["Cryoprecipitate eliminated re-exploration","Noninferior to cryoprecipitate for 24-hour transfusion","Empiric fibrinogen should be given before separation from bypass","Viscoelastic testing was inferior to conventional coagulation tests"], answer: 1, explain: "The trial demonstrated noninferiority for the number of allogeneic components transfused within 24 hours." },
      { q: "Which patient best matches the FIBRES population?", options: ["A dry patient before incision","A stable ward patient with chronic anemia","A bleeding post-CPB patient with low fibrinogen","A patient with isolated therapeutic warfarin effect"], answer: 2, explain: "FIBRES enrolled actively bleeding cardiac-surgery patients with acquired hypofibrinogenemia after CPB." },
      { q: "What must still occur when bleeding persists after fibrinogen correction?", options: ["Assume all bleeding is fibrinolytic","Give platelets without reassessment","Delay reassessment until the next morning","Evaluate for a surgical bleeding source"], answer: 3, explain: "Goal-directed component therapy never substitutes for identifying and correcting surgical bleeding." }
    ]
  },
  {
    id: "trics3", category: "perioperative", name: "TRICS III",
    full: "Transfusion Requirements in Cardiac Surgery III",
    year: 2017, journal: "NEJM", topic: "Cardiac-surgery transfusion thresholds",
    question: "Is a restrictive red-cell transfusion threshold noninferior to a liberal threshold in moderate-to-high-risk cardiac surgery?",
    design: "International randomized noninferiority trial",
    population: "Adults undergoing cardiac surgery with moderate-to-high predicted operative risk",
    intervention: "Restrictive red-cell transfusion strategy using a hemoglobin threshold below 7.5 g/dL",
    comparator: "Liberal strategy using higher stage-specific thresholds",
    outcome: "The restrictive strategy was noninferior for the composite of death, myocardial infarction, stroke or new dialysis-dependent renal failure, and substantially reduced red-cell exposure.",
    bottomLine: "A lower transfusion trigger can reduce exposure without worsening major outcomes in the studied population, but physiology and active bleeding still govern individual decisions.",
    pearls: [
      "TRICS III tested a strategy, not an instruction to ignore ischemia or ongoing hemorrhage.",
      "Restrictive-threshold patients received fewer red-cell transfusions.",
      "A hemoglobin number must be interpreted with oxygen delivery, bleeding trajectory and organ ischemia."
    ],
    citation: "Mazer CD et al. N Engl J Med. 2017;377:2133-2144. doi:10.1056/NEJMoa1711818.",
    mcqs: [
      { q: "Which threshold defined the restrictive arm in TRICS III?", options: ["Hemoglobin below 7.5 g/dL","Hemoglobin below 10 g/dL","Hemoglobin below 9 g/dL","Hemoglobin below 8.5 g/dL at every stage"], answer: 0, explain: "The restrictive strategy used a hemoglobin threshold below 7.5 g/dL." },
      { q: "What was the main clinical conclusion?", options: ["Liberal transfusion prevented all perioperative infarction","Noninferior major outcomes with less transfusion","Restrictive transfusion increased dialysis","Transfusion threshold had no effect on product exposure"], answer: 1, explain: "Restrictive transfusion was noninferior for the primary composite and reduced red-cell use." },
      { q: "Which factor can appropriately override a numeric threshold?", options: ["The desire to normalize every postoperative value","A routine preference for two units","Bleeding with impaired oxygen delivery or organ ischemia","The calendar day after surgery"], answer: 2, explain: "Thresholds support rather than replace physiologic and clinical judgment." }
    ]
  }
);
