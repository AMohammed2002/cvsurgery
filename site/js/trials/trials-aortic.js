/* ============================================================================
   CardiacSchool — Aortic Disease Trials
   Pushes into window.TRIALS.trials (populated by trials-base.js first).
   ============================================================================ */
"use strict";

window.TRIALS = window.TRIALS || { categories: [], trials: [] };

window.TRIALS.trials.push(

  /* ---------------------------------------------------------- INSTEAD-XL */
  {
    id: "instead-xl",
    category: "aortic",
    name: "INSTEAD-XL",
    full: "Investigation of STEnt Grafts in Aortic Dissection with Extended Follow-up",
    year: 2013,
    journal: "Circulation",
    topic: "TEVAR vs medical therapy in stable type B aortic dissection",
    question: "In patients with stable uncomplicated type B aortic dissection, does TEVAR (thoracic endovascular aortic repair) added to optimal medical therapy improve aortic remodelling and long-term survival compared with medical therapy alone?",
    design: "Randomised controlled trial with 5-year follow-up (INSTEAD-XL extension of INSTEAD)",
    population: "Patients with stable, uncomplicated type B aortic dissection (DeBakey type III) within 2 weeks of onset",
    intervention: "TEVAR plus optimal medical therapy (anti-impulse therapy)",
    comparator: "Optimal medical therapy alone (anti-impulse therapy targeting heart rate and blood pressure)",
    outcome: "At 2 years (INSTEAD), TEVAR did not improve survival over medical therapy alone. At 5 years (INSTEAD-XL), TEVAR significantly improved aorta-specific survival and reduced adverse aortic events. TEVAR promoted false lumen thrombosis and aortic remodelling (true lumen expansion, false lumen shrinkage) compared with medical therapy.",
    bottomLine: "In stable uncomplicated type B dissection, TEVAR does not improve early survival versus medical therapy, but promotes aortic remodelling and reduces late adverse aortic events at 5 years. Whether pre-emptive TEVAR in uncomplicated type B dissection improves all-cause survival remains debated.",
    pearls: [
      "The INSTEAD trial showed no early mortality benefit of TEVAR at 2 years; INSTEAD-XL at 5 years showed improved aorta-related outcomes.",
      "Type B aortic dissection (DeBakey III, Stanford B) does NOT involve the ascending aorta.",
      "Medical therapy with anti-impulse treatment (beta-blockers first, target SBP <120 mmHg, HR <60 bpm) is the cornerstone for uncomplicated type B.",
      "Complicated type B dissection (malperfusion, rupture, rapid expansion, refractory pain) is an indication for urgent TEVAR.",
      "False lumen thrombosis after TEVAR is a marker of successful remodelling and better long-term outcomes."
    ],
    citation: "Nienaber CA et al. Circulation 2013;128:S175-S184. (INSTEAD: Nienaber CA et al. Circulation 2009;120:S234-S241.)",
    mcqs: [
      {
        q: "INSTEAD randomized stable patients 2–52 weeks after onset. Which dissection type did it study?",
        options: ["Uncomplicated Stanford type B aortic dissection","Acute type A (Stanford A) aortic dissection","Chronic type B (Stanford B) dissection with malperfusion","Intramural haematoma of the aortic arch"],
        answer: 0,
        explain: "INSTEAD enrolled stable patients with uncomplicated Stanford type B dissection 2–52 weeks after onset, excluding malperfusion, rupture, refractory pain, and rapid expansion. INSTEAD-XL extended follow-up of that randomized cohort."
      },
      {
        q: "At the 5-year follow-up of INSTEAD-XL, TEVAR compared with medical therapy demonstrated:",
        options: ["No difference in any aortic or survival outcome","Better aorta-specific survival and aortic remodelling","Improved all-cause survival but worse aortic remodelling","Higher early mortality but lower late mortality"],
        answer: 1,
        explain: "INSTEAD-XL showed that at 5 years, TEVAR significantly improved aorta-specific survival and reduced adverse aortic events, and was associated with superior aortic remodelling (false lumen thrombosis, true lumen expansion) compared with medical therapy."
      },
      {
        q: "Which feature of type B aortic dissection is considered an indication for urgent TEVAR rather than medical therapy alone?",
        options: ["Stable dissection with controlled blood pressure on two oral agents","Dissection flap visible on CT without branch vessel involvement","Malperfusion syndrome causing limb or visceral ischaemia","Uncomplicated dissection in a patient younger than 50 years"],
        answer: 2,
        explain: "Complicated type B dissection — defined by malperfusion (limb, renal, mesenteric, or spinal cord), rupture, refractory pain, or rapidly expanding aorta — is an urgent indication for TEVAR, not medical therapy alone."
      }
    ]
  },

  /* ------------------------------------------------------- Aortic Aneurysm Size Thresholds */
  {
    id: "aortic-size-thresholds",
    category: "aortic",
    name: "Aortic Aneurysm Size Guidelines",
    full: "Guideline-based Size Thresholds for Elective Aortic Aneurysm Repair (ACC/AHA, ESC)",
    year: 2022,
    journal: "J Am Coll Cardiol / Eur Heart J",
    topic: "Size thresholds for elective repair of thoracic and abdominal aortic aneurysms",
    question: "At what aortic diameter does elective repair of thoracic aortic aneurysm (TAA) or abdominal aortic aneurysm (AAA) become recommended to prevent rupture?",
    design: "Systematic review and expert consensus informing guideline recommendations (ACC/AHA 2022 Aortic Guidelines, ESC 2014/2024)",
    population: "Patients with asymptomatic thoracic or abdominal aortic aneurysm",
    intervention: "Elective surgical or endovascular aortic repair",
    comparator: "Watchful waiting (serial imaging surveillance)",
    outcome: "For sporadic root or ascending thoracic aneurysm, intervention is generally recommended at >=5.5 cm, with selected lower thresholds in expert aortic centers and disease-specific thresholds for heritable aortopathy or concomitant valve surgery. Rapid growth is >=0.5 cm in 1 year or >=0.3 cm/year across 2 consecutive years for sporadic/nsHTAD disease; >=0.3 cm/year is used for Marfan syndrome and bicuspid aortopathy. Abdominal and descending-aortic decisions use separate segment-specific criteria.",
    bottomLine: "Do not apply one diameter or growth rule to every aortic segment and phenotype. Match the threshold to location, body size, valve status, genetic syndrome, family history, measured growth and center expertise.",
    pearls: [
      "Ascending aortic aneurysm repair: standard threshold 5.5 cm; lower threshold 5.0 cm for Marfan syndrome, bicuspid AV, family history of dissection/rupture.",
      "Bicuspid aortic valve is the most common congenital cardiac anomaly and is associated with accelerated aortic dilation and dissection at smaller diameters.",
      "Rapid root/ascending growth is >=0.5 cm in 1 year or >=0.3 cm/year over 2 consecutive years for sporadic/nsHTAD disease; Marfan and BAV use >=0.3 cm/year.",
      "Descending TAA: TEVAR preferred over open surgery; size threshold approximately 5.5-6.0 cm.",
      "AAA: repair at >=5.5 cm in men, >=5.0 cm in women (women have higher rupture risk at smaller diameters).",
      "Connective tissue disorders (Marfan, Loeys-Dietz, vascular Ehlers-Danlos) warrant lower thresholds and earlier repair due to higher dissection risk."
    ],
    citation: "Isselbacher EM et al. J Am Coll Cardiol 2022;80:e223-e393. (2022 ACC/AHA Guidelines for Diagnosis and Management of Aortic Disease.)",
    mcqs: [
      {
        q: "At what ascending aortic diameter is elective surgical repair generally recommended in an average-risk patient without connective tissue disease or bicuspid AV, per current guidelines?",
        options: ["4.0 cm","4.5 cm","5.0 cm","5.5 cm"],
        answer: 3,
        explain: "For average-risk patients without Marfan syndrome, bicuspid AV, or family history of dissection, elective repair of ascending aortic aneurysm is recommended at a diameter of 5.5 cm or greater, where operative risk becomes acceptable relative to natural rupture/dissection risk."
      },
      {
        q: "In which patient with an ascending aortic aneurysm is a LOWER size threshold of 5.0 cm for elective repair most appropriate?",
        options: ["A 35-year-old with Marfan syndrome","A 70-year-old hypertensive male with a tricuspid aortic valve","A 60-year-old with moderate aortic stenosis","A 50-year-old with hypertension and prior CABG"],
        answer: 0,
        explain: "A lower size threshold of 5.0 cm (or even smaller in some centres) is recommended in patients with Marfan syndrome, Loeys-Dietz syndrome, bicuspid AV with risk factors, or a family history of aortic dissection, as these patients have a higher risk of dissection at smaller diameters."
      },
      {
        q: "Which definition matches rapid growth of a sporadic root or ascending thoracic aortic aneurysm in the 2022 ACC/AHA guideline?",
        options: ["0.2 cm/year once or 0.1 cm/year twice","0.5 cm/year once or 0.3 cm/year twice","0.8 cm/year once or 0.5 cm/year twice","1.0 cm/year once or 0.8 cm/year twice"],
        answer: 1,
        explain: "For sporadic root/ascending aneurysm and nonsyndromic heritable thoracic aortic disease, rapid growth is >=0.5 cm in one year or >=0.3 cm/year across two consecutive years. Marfan syndrome and bicuspid aortopathy use >=0.3 cm/year."
      }
    ]
  },

  /* ------------------------------------------------- ADSORB (Type B / TEVAR) */
  {
    id: "adsorb",
    category: "aortic",
    name: "ADSORB",
    full: "Acute Dissection Stent grafting OR Best Medical Therapy",
    year: 2014,
    journal: "Eur J Cardiothorac Surg",
    topic: "TEVAR vs medical therapy in uncomplicated acute type B aortic dissection",
    question: "In uncomplicated acute type B aortic dissection, does TEVAR within 14 days produce better aortic remodelling than best medical therapy alone?",
    design: "Randomised controlled trial",
    population: "Patients with uncomplicated acute type B aortic dissection enrolled within 14 days of onset (no malperfusion or rupture)",
    intervention: "TEVAR plus best medical therapy (anti-impulse therapy)",
    comparator: "Best medical therapy alone",
    outcome: "TEVAR produced significantly better aortic remodelling at 1 year (higher rates of complete false lumen thrombosis and aortic diameter regression). No significant difference in 1-year mortality. TEVAR was safe with no significant increase in early adverse events.",
    bottomLine: "In uncomplicated acute type B dissection, TEVAR significantly improves aortic remodelling compared with medical therapy alone, with acceptable procedural safety. Long-term survival benefit remains to be proven; TEVAR may prevent late aortic complications by favouring remodelling.",
    pearls: [
      "ADSORB enrolled patients within 14 days of type B dissection onset (acute phase).",
      "False lumen thrombosis after TEVAR is associated with improved outcomes in type B dissection.",
      "No early mortality difference between TEVAR and medical therapy in uncomplicated type B dissection.",
      "ADSORB complements INSTEAD-XL: both support a role for TEVAR in remodelling, but mortality benefit at 1-2 years is not demonstrated.",
      "The clinical significance of remodelling (and whether it translates to survival benefit) is the central ongoing research question."
    ],
    citation: "Brunkwall J et al. Eur J Cardiothorac Surg 2014;46:e120-e127.",
    mcqs: [
      {
        q: "The primary benefit of TEVAR over medical therapy demonstrated in the ADSORB trial at 1 year was:",
        options: ["Significantly improved 1-year all-cause survival","Significant reduction in late open surgical conversions","More favourable aortic remodelling at one year","Elimination of residual intimal tear in all TEVAR patients"],
        answer: 2,
        explain: "ADSORB showed TEVAR produced significantly better aortic remodelling at 1 year — specifically higher rates of complete false lumen thrombosis and aortic diameter regression — compared with medical therapy, without a significant difference in 1-year mortality."
      },
      {
        q: "False lumen thrombosis after TEVAR for type B aortic dissection is considered:",
        options: ["A sign of TEVAR failure requiring re-intervention","Clinically irrelevant to long-term outcomes","An indication for urgent conversion to open surgical repair","Favourable remodelling associated with better outcomes"],
        answer: 3,
        explain: "False lumen thrombosis after TEVAR is a desired endpoint and marker of successful aortic remodelling. Complete false lumen thrombosis is associated with better long-term outcomes including reduced aortic expansion and fewer late adverse events."
      },
      {
        q: "What was the timing of TEVAR relative to dissection onset in the ADSORB trial?",
        options: ["Within 14 days of symptom onset (acute phase)","Within 48 hours of symptom onset (hyperacute phase)","Between 6 weeks and 3 months (subacute phase)","Greater than 3 months after dissection (chronic phase)"],
        answer: 0,
        explain: "ADSORB enrolled patients within 14 days of type B dissection onset, defining the acute phase of the disease. This timing is important because remodelling potential may be higher in the acute phase when the false lumen is not yet organised."
      }
    ]
  }

); // end push — aortic trials
