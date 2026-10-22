/* ============================================================================
   CardiacSchool — Valve Disease Trials
   Pushes into window.TRIALS.trials (populated by trials-base.js first).
   ============================================================================ */
"use strict";

window.TRIALS = window.TRIALS || { categories: [], trials: [] };

window.TRIALS.trials.push(

  /* --------------------------------------------------------------- PARTNER 1 */
  {
    id: "partner1",
    category: "valve",
    name: "PARTNER 1",
    full: "Placement of Aortic Transcatheter Valves — Cohort A and B",
    year: 2011,
    journal: "N Engl J Med",
    topic: "TAVR in severe aortic stenosis (high-risk or inoperable)",
    question: "In patients with severe aortic stenosis who are inoperable (Cohort B) or high surgical risk (Cohort A), does TAVR with a balloon-expandable valve improve outcomes compared with standard therapy or SAVR?",
    design: "Randomised controlled trial (two parallel cohorts)",
    population: "Cohort B: inoperable patients with severe AS. Cohort A: high surgical risk (STS score approximately 11%) with severe AS.",
    intervention: "Transcatheter aortic valve replacement (TAVR) with balloon-expandable valve (SAPIEN)",
    comparator: "Cohort B: standard medical therapy (including balloon aortic valvuloplasty). Cohort A: surgical AVR (SAVR).",
    outcome: "Cohort B: TAVR dramatically reduced 1-year all-cause mortality vs standard therapy (approximately 30% vs 50%). Cohort A: TAVR was non-inferior to SAVR for 1-year mortality. TAVR had higher stroke and vascular complication rates; SAVR had higher atrial fibrillation rates.",
    bottomLine: "PARTNER 1 established TAVR as the standard of care for inoperable patients with severe AS, and as a valid alternative to SAVR in high surgical risk patients.",
    pearls: [
      "PARTNER 1 Cohort B: TAVR vs standard therapy in inoperable AS — landmark trial establishing TAVR benefit.",
      "PARTNER 1 Cohort A: TAVR non-inferior to SAVR at 1 year in high-risk patients.",
      "Stroke was higher with TAVR (particularly early, likely embolic); paravalvular leak also more common.",
      "Vascular complications (from large-bore femoral access) were a key limitation of early-generation TAVR.",
      "Cohort A used the transfemoral approach when feasible; transapical for non-femoral candidates."
    ],
    citation: "Leon MB et al. N Engl J Med 2010;363:1597-1607 (Cohort B). Smith CR et al. N Engl J Med 2011;364:2187-2198 (Cohort A).",
    mcqs: [
      {
        q: "PARTNER 1 Cohort B compared TAVR with which control treatment in inoperable patients with severe AS?",
        options: ["Surgical AVR","Mitral valve repair","Transcatheter mitral valve replacement","Medical therapy +/- balloon valvuloplasty"],
        answer: 3,
        explain: "PARTNER 1 Cohort B compared TAVR with standard medical therapy (including balloon aortic valvuloplasty) in patients deemed inoperable, demonstrating a dramatic reduction in mortality with TAVR."
      },
      {
        q: "Compared with SAVR in PARTNER 1 Cohort A (high surgical risk), TAVR had significantly higher rates of:",
        options: ["Stroke and major vascular complications","Atrial fibrillation and bleeding requiring transfusion","Acute kidney injury and renal replacement therapy","Pacemaker implantation and heart block"],
        answer: 0,
        explain: "TAVR in PARTNER 1 was associated with significantly higher rates of stroke (likely embolic) and major vascular complications from large-bore femoral access, compared with SAVR."
      },
      {
        q: "The overall conclusion of PARTNER 1 for the treatment of severe symptomatic aortic stenosis was:",
        options: ["TAVR should replace SAVR in all patients with severe AS","Effective when inoperable; non-inferior to SAVR at high risk","TAVR should be reserved only for patients with EF <30%","SAVR remains superior in high-risk patients due to lower stroke rates"],
        answer: 1,
        explain: "PARTNER 1 established TAVR as the standard of care for inoperable severe AS (Cohort B) and demonstrated non-inferiority to SAVR in high surgical risk patients (Cohort A), launching the TAVR revolution."
      }
    ]
  },

  /* --------------------------------------------------------------- PARTNER 2 */
  {
    id: "partner2",
    category: "valve",
    name: "PARTNER 2",
    full: "Placement of Aortic Transcatheter Valves — Intermediate Risk",
    year: 2016,
    journal: "N Engl J Med",
    topic: "TAVR vs SAVR in intermediate surgical risk severe AS",
    question: "In intermediate surgical risk patients (STS score 4-8%) with severe aortic stenosis, is TAVR non-inferior to SAVR?",
    design: "Randomised controlled trial",
    population: "Patients with severe AS at intermediate surgical risk (STS score approximately 5-6%)",
    intervention: "TAVR with second-generation SAPIEN XT valve (transfemoral or transthoracic approach)",
    comparator: "Surgical AVR",
    outcome: "TAVR was non-inferior to SAVR for the composite of death or disabling stroke at 2 years. In transfemoral access patients, TAVR was superior to SAVR. Paravalvular leak and permanent pacemaker rates remained higher with TAVR. SAVR had higher rates of atrial fibrillation and acute kidney injury.",
    bottomLine: "TAVR is non-inferior to SAVR in intermediate-risk patients with severe AS. The transfemoral subgroup had superior outcomes with TAVR, supporting TF-TAVR as the preferred approach when anatomy is suitable.",
    pearls: [
      "PARTNER 2 extended TAVR indication from high-risk to intermediate-risk patients.",
      "Transfemoral TAVR was superior to SAVR within the intermediate-risk cohort.",
      "Paravalvular leak (even mild) after TAVR remains associated with worse long-term outcomes.",
      "SAVR had more early atrial fibrillation and kidney injury; TAVR had more paravalvular leak and pacemakers.",
      "The SURTAVI trial (Medtronic CoreValve) reached similar non-inferiority conclusions in intermediate-risk patients."
    ],
    citation: "Leon MB et al. N Engl J Med 2016;374:1609-1620.",
    mcqs: [
      {
        q: "PARTNER 2 expanded TAVR indications to which new risk group compared with PARTNER 1?",
        options: ["Low surgical risk (STS <4%)","Very high surgical risk (STS >15%)","Intermediate surgical risk (STS 4-8%)","Inoperable patients only"],
        answer: 2,
        explain: "PARTNER 2 enrolled intermediate surgical risk patients (STS score approximately 4-8%), expanding the evidence for TAVR beyond the high-risk and inoperable populations studied in PARTNER 1."
      },
      {
        q: "In the transfemoral access subgroup of PARTNER 2, outcomes with TAVR were:",
        options: ["Significantly inferior to SAVR","Non-inferior but not superior to SAVR","No different from transapical TAVR","Superior to SAVR"],
        answer: 3,
        explain: "Within the transfemoral access subgroup of PARTNER 2, TAVR was actually superior to SAVR for the composite endpoint, strongly supporting TF-TAVR as the preferred strategy when femoral access is anatomically feasible."
      },
      {
        q: "Compared with SAVR, TAVR in PARTNER 2 had significantly higher rates of:",
        options: ["Paravalvular leak and permanent pacemaker implantation","Atrial fibrillation and acute kidney injury","Haemorrhagic stroke and bleeding","In-hospital mortality and heart failure"],
        answer: 0,
        explain: "TAVR in PARTNER 2 was associated with higher rates of paravalvular leak and need for permanent pacemaker implantation compared with SAVR, while SAVR had more atrial fibrillation and acute kidney injury."
      }
    ]
  },

  /* --------------------------------------------------------------- PARTNER 3 */
  {
    id: "partner3",
    category: "valve",
    name: "PARTNER 3",
    full: "Transcatheter Aortic Valve Replacement in Low-Risk Patients",
    year: 2019,
    journal: "N Engl J Med",
    topic: "TAVR vs SAVR in low surgical risk severe AS",
    question: "In low surgical risk patients (STS score <4%) with severe aortic stenosis, does TAVR with a balloon-expandable valve produce superior outcomes to SAVR at 1 year?",
    design: "Randomised controlled trial",
    population: "Patients with severe AS at low surgical risk (STS score less than 4%, mean approximately 1.9%)",
    intervention: "Transfemoral TAVR with SAPIEN 3 valve",
    comparator: "Surgical AVR",
    outcome: "TAVR was superior to SAVR for the composite of death, stroke, or re-hospitalisation at 1 year. At 2 years, outcomes remained better with TAVR. Pacemaker rates and paravalvular leak remained higher with TAVR. SAVR had more new-onset atrial fibrillation.",
    bottomLine: "PARTNER 3 demonstrated superiority of TAVR over SAVR in low-risk patients at 1 year, representing a paradigm shift supporting TAVR as a first-line option across all surgical risk categories in suitable anatomy.",
    pearls: [
      "PARTNER 3 and Evolut Low Risk (Medtronic) together established TAVR in low-risk patients in 2019.",
      "Mean STS score in PARTNER 3 was approximately 1.9%, far lower than earlier TAVR trials.",
      "Short- and medium-term superiority of TAVR is partly driven by lower procedural morbidity (less AF, less AKI).",
      "Long-term data on structural valve deterioration of TAVR vs tissue SAVR in young low-risk patients are still maturing.",
      "Paravalvular leak and pacemaker need remain higher with TAVR even with third-generation devices."
    ],
    citation: "Mack MJ et al. N Engl J Med 2019;380:1695-1705.",
    mcqs: [
      {
        q: "Compared with prior PARTNER trials, PARTNER 3 enrolled patients with which characteristic?",
        options: ["Inoperable status","Low surgical risk (mean STS about 1.9%)","High surgical risk (STS >8%)","Intermediate risk with bicuspid aortic valve"],
        answer: 1,
        explain: "PARTNER 3 enrolled low surgical risk patients with an average STS score of approximately 1.9%, representing younger, healthier patients than prior PARTNER trials — a major expansion of the TAVR indication."
      },
      {
        q: "What was the overall finding of PARTNER 3 at 1 year?",
        options: ["TAVR was non-inferior but not superior to SAVR","SAVR was superior to TAVR in low-risk patients","TAVR lowered the 1-year composite endpoint","Both strategies had identical composite outcomes"],
        answer: 2,
        explain: "PARTNER 3 demonstrated that TAVR was superior to SAVR for the composite of death, stroke, or re-hospitalisation at 1 year, marking a pivotal moment in expanding TAVR to low-risk patients."
      },
      {
        q: "The major outstanding concern for TAVR in young low-risk patients after PARTNER 3 is:",
        options: ["High early stroke rates with TAVR","TAVR is associated with more peri-procedural atrial fibrillation","TAVR has unacceptably high 30-day mortality in this population","Long-term structural valve deterioration data are still maturing"],
        answer: 3,
        explain: "While PARTNER 3 showed superior short-term outcomes, the key unresolved question is long-term structural valve durability of TAVR compared with surgical bioprostheses, which is critical in younger low-risk patients who may outlive their valve."
      }
    ]
  },

  /* ----------------------------------------------------------------- SURTAVI */
  {
    id: "surtavi",
    category: "valve",
    name: "SURTAVI",
    full: "Surgical Replacement and Transcatheter Aortic Valve Implantation — Intermediate Risk",
    year: 2017,
    journal: "N Engl J Med",
    topic: "CoreValve TAVR vs SAVR in intermediate surgical risk severe AS",
    question: "In intermediate surgical risk patients with severe aortic stenosis, is self-expanding CoreValve TAVR non-inferior to SAVR for death or disabling stroke at 2 years?",
    design: "Randomised controlled trial",
    population: "Intermediate surgical risk patients with severe AS (STS score approximately 4-5%)",
    intervention: "TAVR with self-expanding CoreValve or Evolut R system",
    comparator: "Surgical AVR",
    outcome: "TAVR was non-inferior to SAVR for the composite of death or disabling stroke at 2 years. Pacemaker implantation was significantly higher with the self-expanding TAVR valve. SAVR had more atrial fibrillation and acute kidney injury.",
    bottomLine: "SURTAVI corroborated PARTNER 2: TAVR is non-inferior to SAVR in intermediate-risk patients using a self-expanding valve. The higher pacemaker rate of self-expanding devices remains an important consideration.",
    pearls: [
      "SURTAVI used the self-expanding CoreValve/Evolut R (Medtronic), complementing PARTNER 2 which used balloon-expandable SAPIEN.",
      "Permanent pacemaker rates were notably higher with CoreValve TAVR (approximately 25% vs 6% with SAVR).",
      "The high pacemaker rate reflects the deeper implant depth of the self-expanding valve and proximity to the conduction system.",
      "Both PARTNER 2 and SURTAVI confirmed TAVR non-inferiority at intermediate risk across different valve platforms.",
      "Heart block requiring pacemaker is a class-specific complication; bicuspid anatomy and calcified LVOT increase risk."
    ],
    citation: "Reardon MJ et al. N Engl J Med 2017;376:1321-1331.",
    mcqs: [
      {
        q: "SURTAVI evaluated which TAVR valve system, distinguishing it from the PARTNER 2 trial?",
        options: ["Self-expanding CoreValve/Evolut R","Balloon-expandable SAPIEN XT","Mechanically expandable LOTUS valve","Sutureless Perceval valve"],
        answer: 0,
        explain: "SURTAVI used the self-expanding CoreValve/Evolut R (Medtronic), while PARTNER 2 used the balloon-expandable SAPIEN XT (Edwards). Both showed TAVR non-inferiority in intermediate-risk patients but with different complication profiles."
      },
      {
        q: "Which complication was significantly more frequent with TAVR in SURTAVI compared with SAVR?",
        options: ["Stroke or transient ischemic attack","Permanent pacemaker implantation","New-onset atrial fibrillation","Major or life-threatening bleeding"],
        answer: 1,
        explain: "Permanent pacemaker implantation was approximately four times more frequent with CoreValve TAVR than SAVR in SURTAVI (approximately 25% vs 6%), reflecting the deeper subannular implant depth of the self-expanding system near the conduction system."
      },
      {
        q: "What was the overall conclusion of SURTAVI regarding TAVR vs SAVR in intermediate-risk patients?",
        options: ["TAVR was superior to SAVR at 2 years","TAVR was inferior to SAVR for death and disabling stroke","Non-inferior for death or disabling stroke at 2 years","No significant difference was detectable due to underpowering"],
        answer: 2,
        explain: "SURTAVI demonstrated that self-expanding TAVR was non-inferior to SAVR for the composite of death or disabling stroke at 2 years in intermediate-risk patients, confirming the PARTNER 2 findings with a different valve platform."
      }
    ]
  },

  /* --------------------------------------------------------- Evolut Low Risk */
  {
    id: "evolut-lowrisk",
    category: "valve",
    name: "Evolut Low Risk",
    full: "Evolut Low Risk Trial — Self-Expanding TAVR in Low Surgical Risk Patients",
    year: 2019,
    journal: "N Engl J Med",
    topic: "Self-expanding TAVR vs SAVR in low surgical risk severe AS",
    question: "In low surgical risk patients with severe aortic stenosis, is self-expanding TAVR non-inferior to SAVR for death or disabling stroke at 2 years?",
    design: "Randomised controlled trial",
    population: "Low surgical risk patients with severe AS (STS score <3%, mean approximately 1.9%)",
    intervention: "TAVR with self-expanding Evolut R or Evolut PRO valve",
    comparator: "Surgical AVR",
    outcome: "Self-expanding TAVR was non-inferior to SAVR for the Bayesian composite of death or disabling stroke at 24 months. TAVR had significantly higher paravalvular leak and pacemaker rates. TAVR also produced larger effective orifice areas (better haemodynamics) at 30 days.",
    bottomLine: "Evolut Low Risk, together with PARTNER 3, established TAVR as a valid option for low surgical risk patients with severe AS using a self-expanding valve. Superior haemodynamics of TAVR early post-procedure are promising but long-term durability remains to be defined.",
    pearls: [
      "Evolut Low Risk used a Bayesian statistical framework (unusual for RCTs) to demonstrate non-inferiority.",
      "TAVR produced superior aortic valve haemodynamics (larger effective orifice area) vs surgical bioprostheses at 30 days.",
      "Permanent pacemaker rates were significantly higher with Evolut TAVR (approximately 18% vs 6% SAVR).",
      "Paravalvular leak, even mild, is associated with worse long-term outcomes and was more common with TAVR.",
      "Together with PARTNER 3, these trials expanded TAVR to low-risk patients in 2019 ACC/AHA guidelines."
    ],
    citation: "Popma JJ et al. N Engl J Med 2019;380:1706-1715.",
    mcqs: [
      {
        q: "What statistical method, unusual in cardiovascular RCTs, was used in the Evolut Low Risk trial?",
        options: ["Frequentist superiority testing","Adaptive platform trial design","Sequential monitoring with alpha spending","Bayesian non-inferiority framework"],
        answer: 3,
        explain: "The Evolut Low Risk trial used a Bayesian statistical framework to demonstrate non-inferiority of TAVR versus SAVR, which is uncommon in large cardiovascular RCTs and allows incorporation of prior knowledge."
      },
      {
        q: "One haemodynamic advantage of TAVR over surgical bioprostheses demonstrated in the Evolut Low Risk trial was:",
        options: ["Larger effective orifice area at 30 days","Lower mean aortic valve gradient at 1 year","Lower rate of patient-prosthesis mismatch at 2 years","Higher stroke volume index at 6 months"],
        answer: 0,
        explain: "TAVR with the Evolut system produced significantly larger effective orifice areas compared with surgical bioprostheses at 30 days, reflecting superior haemodynamics — though whether this translates to long-term benefit is still being studied."
      },
      {
        q: "In the Evolut Low Risk trial, which complication was approximately three times more frequent with TAVR than SAVR?",
        options: ["Stroke or transient ischemic attack","Permanent pacemaker implantation","Acute kidney injury requiring dialysis","Major or life-threatening bleeding"],
        answer: 1,
        explain: "Permanent pacemaker implantation was approximately 17-18% with Evolut TAVR versus approximately 6% with SAVR in the low-risk trial, consistent with the self-expanding valve's proximity to the conduction system."
      }
    ]
  },

  /* --------------------------------------------------------------- EVEREST II */
  {
    id: "everest2",
    category: "valve",
    name: "EVEREST II",
    full: "Endovascular Valve Edge-to-Edge Repair Study II",
    year: 2011,
    journal: "N Engl J Med",
    topic: "MitraClip vs mitral valve surgery for mitral regurgitation",
    question: "In patients with moderate-to-severe or severe mitral regurgitation (primarily degenerative), is percutaneous mitral valve repair (MitraClip) non-inferior to mitral valve surgery?",
    design: "Randomised controlled trial",
    population: "Patients with moderate-to-severe (3+) or severe (4+) MR meeting anatomical criteria (predominantly degenerative/primary MR); surgical risk low to moderate",
    intervention: "Percutaneous mitral valve repair with MitraClip (edge-to-edge leaflet approximation)",
    comparator: "Mitral valve surgery (repair or replacement) per surgeon discretion",
    outcome: "Surgery was superior to MitraClip for the composite primary endpoint (freedom from death, surgery for MV dysfunction, and grade 3+ MR) at 12 months. However, MitraClip had significantly fewer major adverse events at 30 days. MR reduction was less complete with MitraClip but procedural safety was better.",
    bottomLine: "MitraClip was less effective than surgery at reducing MR and achieving the primary endpoint, but was safer in the procedural period. Subsequent experience has refined patient selection: MitraClip is now most validated in high-risk/inoperable patients with functional (secondary) MR via COAPT.",
    pearls: [
      "EVEREST II enrolled predominantly degenerative (primary) MR — different pathophysiology from COAPT which studied functional MR.",
      "Surgery was superior for the primary efficacy endpoint; MitraClip was safer procedurally.",
      "Approximately 20% of MitraClip patients required surgery within 12 months for residual MR.",
      "EVEREST II established proof of concept for percutaneous mitral repair but did not support routine use over surgery in operable patients.",
      "Patient selection (leaflet anatomy, coaptation depth) is critical for MitraClip success."
    ],
    citation: "Feldman T et al. N Engl J Med 2011;364:1395-1406.",
    mcqs: [
      {
        q: "In EVEREST II, which treatment was superior for the primary composite efficacy endpoint (freedom from death, surgery for MV dysfunction, or MR >=3+) at 12 months?",
        options: ["MitraClip","Both were equivalent — non-inferiority was met","Surgical mitral valve repair or replacement","Results were stratified by MR aetiology only"],
        answer: 2,
        explain: "Surgical mitral valve repair or replacement was superior to MitraClip for the primary composite efficacy endpoint at 12 months in EVEREST II, driven by more complete MR reduction with surgery."
      },
      {
        q: "In what way did MitraClip demonstrate superiority over surgery in EVEREST II?",
        options: ["Lower 12-month all-cause mortality","Greater reduction in MR severity","Lower rate of new-onset atrial fibrillation","Fewer 30-day major adverse events"],
        answer: 3,
        explain: "MitraClip had significantly fewer major adverse events (death, MI, stroke, non-elective cardiovascular surgery, renal failure, blood transfusions) at 30 days, demonstrating its procedural safety advantage over open surgery."
      },
      {
        q: "The predominantly enrolled MR aetiology in EVEREST II was:",
        options: ["Degenerative (primary) MR due to mitral valve prolapse","Functional (secondary) MR due to dilated cardiomyopathy","Rheumatic mitral stenosis with MR","Ischaemic MR after prior myocardial infarction"],
        answer: 0,
        explain: "EVEREST II enrolled patients predominantly with degenerative (primary) MR, most commonly mitral valve prolapse with leaflet flail or prolapse, contrasting with COAPT which studied functional (secondary) MR."
      }
    ]
  },

  /* ------------------------------------------------------------------ COAPT */
  {
    id: "coapt",
    category: "valve",
    name: "COAPT",
    full: "Cardiovascular Outcomes Assessment of the MitraClip Percutaneous Therapy for Heart Failure Patients with Functional Mitral Regurgitation",
    year: 2018,
    journal: "N Engl J Med",
    topic: "MitraClip for functional MR in heart failure",
    question: "In patients with heart failure and moderate-to-severe or severe functional (secondary) MR who remain symptomatic despite guideline-directed medical therapy, does MitraClip reduce hospitalisation and mortality?",
    design: "Randomised controlled trial",
    population: "Patients with heart failure, LVEF 20-50%, moderate-to-severe or severe functional MR, symptomatic despite optimised GDMT, and anatomically eligible for MitraClip",
    intervention: "MitraClip device plus guideline-directed medical therapy",
    comparator: "Guideline-directed medical therapy alone",
    outcome: "MitraClip significantly reduced the rate of hospitalisation for heart failure at 24 months (primary endpoint). All-cause mortality was also significantly reduced. The number needed to treat was low for both endpoints. Quality of life was markedly improved.",
    bottomLine: "COAPT established MitraClip as the standard of care for carefully selected patients with heart failure and severe functional MR who remain symptomatic despite optimised GDMT. Strict eligibility criteria (including true residual MR after GDMT optimisation) are critical to reproducing these results.",
    pearls: [
      "COAPT used rigorous patient selection: MR had to persist and be at least moderate-severe despite optimised GDMT.",
      "Both hospitalisation for heart failure AND all-cause mortality were significantly reduced — rare dual endpoint benefit.",
      "The MITRA-FR trial (France, similar concept) was negative — difference attributed to less strict patient selection in MITRA-FR.",
      "COAPT eligibility criteria: LVEF 20-50%, LVEDD <=70 mm, MR >=3+, symptomatic despite GDMT.",
      "Patient selection using the COAPT criteria (not MR alone) determines benefit from the procedure."
    ],
    citation: "Stone GW et al. N Engl J Med 2018;379:2307-2318.",
    mcqs: [
      {
        q: "The primary finding of COAPT was that MitraClip significantly reduced which outcome compared with GDMT alone?",
        options: ["30-day procedural mortality","24-month heart-failure hospitalisation","New-onset atrial fibrillation","Progression to end-stage renal disease"],
        answer: 1,
        explain: "The primary endpoint of COAPT — hospitalisation for heart failure at 24 months — was significantly reduced with MitraClip plus GDMT compared with GDMT alone, with a strikingly low number needed to treat."
      },
      {
        q: "How did COAPT differ in patient selection from the contemporaneous negative MITRA-FR trial?",
        options: ["COAPT enrolled patients with primary (degenerative) MR only","COAPT excluded patients with EF <30%","Stricter selection for severe MR despite optimal GDMT","MITRA-FR used a different MitraClip device generation"],
        answer: 2,
        explain: "COAPT required rigorous optimisation of GDMT before enrolment and strict anatomical eligibility, ensuring patients had true severe residual functional MR. MITRA-FR had less stringent criteria and included patients with proportionate MR or inadequately optimised therapy, likely explaining its negative result."
      },
      {
        q: "Which statement best describes the type of mitral regurgitation studied in COAPT?",
        options: ["Primary (degenerative) MR due to flail leaflet","Rheumatic MR with commissural fusion","Ischaemic MR after acute MI requiring emergency repair","Secondary MR with reduced-EF heart failure"],
        answer: 3,
        explain: "COAPT studied functional (secondary) MR — MR that develops as a consequence of LV dilation/dysfunction in heart failure, rather than primary leaflet pathology — which is a different mechanism from degenerative MR studied in EVEREST II."
      }
    ]
  }

); // end push — valve trials
