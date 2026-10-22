/* ============================================================================
   CardiacSchool — Coronary Artery Disease Trials
   Pushes into window.TRIALS.trials (populated by trials-base.js first).
   ============================================================================ */
"use strict";

window.TRIALS = window.TRIALS || { categories: [], trials: [] };

window.TRIALS.trials.push(

  /* ------------------------------------------------------------------ SYNTAX */
  {
    id: "syntax",
    category: "coronary",
    name: "SYNTAX",
    full: "SYNergy between percutaneous coronary intervention with TAXUS and cardiac surgery",
    year: 2009,
    journal: "N Engl J Med",
    topic: "CABG vs PCI in complex CAD",
    question: "In patients with left main or three-vessel CAD, is PCI with a paclitaxel-eluting stent non-inferior to CABG?",
    design: "Randomised controlled trial",
    population: "Patients with de novo three-vessel or left main CAD (SYNTAX score assessed for all)",
    intervention: "PCI with paclitaxel-eluting stent",
    comparator: "CABG",
    outcome: "At 12 months, MACCE (death, stroke, MI, repeat revascularisation) was significantly higher with PCI. At 5 years PCI remained inferior; benefit of CABG was greatest in high SYNTAX score (>32). Left main disease showed no significant difference.",
    bottomLine: "CABG is preferred over PCI for three-vessel disease with intermediate or high SYNTAX scores. PCI is an acceptable alternative for low-complexity (low SYNTAX score) three-vessel or isolated left main disease.",
    pearls: [
      "SYNTAX score quantifies coronary complexity; higher score = more benefit from CABG.",
      "Primary endpoint was MACCE; driven mainly by repeat revascularisation in the PCI arm.",
      "Left main subgroup: comparable 5-year outcomes between CABG and PCI at low/intermediate SYNTAX scores.",
      "Stroke rate was higher with CABG at 1 year but this advantage diminished by 5 years."
    ],
    citation: "Serruys PW et al. N Engl J Med 2009;360:961-972. (SYNTAX 5-year: Mohr FW et al. Lancet 2013;381:629-638.)",
    mcqs: [
      {
        q: "In the SYNTAX trial, which subgroup derived the clearest benefit from CABG over PCI?",
        options: ["Patients with a low SYNTAX score (0-22)","Patients with a high SYNTAX score (>32)","Patients with isolated left main disease","Patients with single-vessel disease"],
        answer: 1,
        explain: "CABG was significantly superior to PCI in patients with high SYNTAX scores (>32), reflecting complex, diffuse coronary disease where complete surgical revascularisation is most advantageous."
      },
      {
        q: "What was the primary endpoint of the SYNTAX trial?",
        options: ["All-cause mortality at 5 years","Target vessel revascularisation at 30 days","The 12-month MACCE composite","Freedom from angina at 1 year"],
        answer: 2,
        explain: "The primary endpoint was MACCE at 12 months. PCI had a significantly higher MACCE rate, driven predominantly by repeat revascularisation."
      },
      {
        q: "In the SYNTAX trial, what was the main driver of the higher MACCE rate in the PCI arm?",
        options: ["Higher stroke rate","Higher myocardial infarction rate","Higher all-cause mortality","Higher repeat revascularisation rate"],
        answer: 3,
        explain: "Repeat revascularisation was the predominant driver of the higher MACCE rate in the PCI arm, reflecting in-stent restenosis and incomplete revascularisation."
      }
    ]
  },

  /* ----------------------------------------------------------------- FREEDOM */
  {
    id: "freedom",
    category: "coronary",
    name: "FREEDOM",
    full: "Future REvascularization Evaluation in patients with Diabetes mellitus: Optimal management of Multivessel disease",
    year: 2012,
    journal: "N Engl J Med",
    topic: "CABG vs PCI in diabetics with multivessel CAD",
    question: "In diabetic patients with multivessel CAD, does CABG improve outcomes compared with PCI using drug-eluting stents?",
    design: "Randomised controlled trial",
    population: "Patients with diabetes mellitus and multivessel CAD (no left main disease)",
    intervention: "CABG",
    comparator: "PCI with drug-eluting stents",
    outcome: "CABG significantly reduced the composite of death, non-fatal MI, or non-fatal stroke at 5 years. All-cause mortality and MI rates were lower with CABG. Stroke rate was higher in the CABG arm.",
    bottomLine: "In diabetics with multivessel CAD, CABG reduces death and MI compared with PCI, at the cost of a modestly higher stroke rate. CABG is the preferred revascularisation strategy in this population.",
    pearls: [
      "FREEDOM is the landmark trial establishing CABG superiority in diabetics with multivessel disease.",
      "Benefit of CABG was consistent regardless of SYNTAX score in this diabetic population.",
      "Stroke rate was higher with CABG (approximately 5% vs 2% at 5 years).",
      "The survival benefit of CABG emerged after ~2 years and widened over time.",
      "IMA use in CABG and complete revascularisation are key to the long-term benefit."
    ],
    citation: "Farkouh ME et al. N Engl J Med 2012;367:2375-2384.",
    mcqs: [
      {
        q: "The FREEDOM trial compared CABG vs PCI in which specific patient population?",
        options: ["Diabetics with multivessel CAD (no left main)","Non-diabetics with three-vessel disease","Diabetics with isolated left main stenosis","Patients with prior CABG needing reoperation"],
        answer: 0,
        explain: "FREEDOM enrolled diabetic patients with multivessel CAD without left main disease, directly addressing the most common high-risk revascularisation scenario in this population."
      },
      {
        q: "What was the main trade-off of CABG vs PCI found in the FREEDOM trial?",
        options: ["CABG had lower mortality but longer hospital stay","CABG reduced death and MI but had a higher stroke rate","CABG reduced stroke but increased MI rates","CABG improved angina relief but not survival"],
        answer: 1,
        explain: "CABG reduced the composite of death, MI, and stroke overall, driven by large reductions in death and MI, but at the cost of a modestly higher stroke rate compared with PCI."
      },
      {
        q: "Regarding the timing of CABG benefit in FREEDOM, the survival advantage over PCI:",
        options: ["Was present at 30 days and remained constant","Was only seen in patients with SYNTAX score >32","Emerged after approximately 2 years and widened over time","Disappeared after 3 years of follow-up"],
        answer: 2,
        explain: "The survival benefit of CABG over PCI in diabetics emerged at approximately 2 years and continued to widen over the 5-year follow-up, consistent with the long-term patency advantage of arterial grafts."
      }
    ]
  },

  /* ------------------------------------------------------------------ EXCEL */
  {
    id: "excel",
    category: "coronary",
    name: "EXCEL",
    full: "Evaluation of XIENCE versus Coronary Artery Bypass Surgery for Effectiveness of Left Main Revascularization",
    year: 2016,
    journal: "N Engl J Med",
    topic: "CABG vs PCI for left main disease",
    question: "In patients with left main CAD and low-intermediate SYNTAX scores, is PCI with an everolimus-eluting stent non-inferior to CABG?",
    design: "Randomised controlled trial",
    population: "Patients with significant left main CAD and SYNTAX score 32 or less (low or intermediate complexity)",
    intervention: "PCI with everolimus-eluting stent",
    comparator: "CABG",
    outcome: "At 3 years, the composite endpoint of death, stroke, or MI was similar between PCI and CABG (non-inferiority met). At longer follow-up (5 years), all-cause mortality was numerically higher with PCI, though driven partly by non-cardiovascular deaths.",
    bottomLine: "PCI is a reasonable alternative to CABG for left main disease with low-to-intermediate anatomical complexity. Long-term follow-up raised questions about late mortality with PCI, keeping CABG as the default for suitable surgical candidates.",
    pearls: [
      "EXCEL used a low-intermediate SYNTAX score cutoff (<=32) for enrollment.",
      "Primary endpoint at 3 years was met (non-inferiority); late mortality signal at 5 years generated controversy.",
      "Controversy arose over MI definition (peri-procedural vs spontaneous).",
      "Both Heart Team evaluation and patient preference are central to left main decision-making.",
      "NOBLE trial (contemporaneous, similar population) found CABG superior to PCI at 5 years."
    ],
    citation: "Stone GW et al. N Engl J Med 2016;375:2223-2235.",
    mcqs: [
      {
        q: "Which patients were enrolled in the EXCEL trial?",
        options: ["Left main CAD with any SYNTAX score","Three-vessel disease without left main involvement","Left main CAD with SYNTAX score >33 only","Left main CAD with low or intermediate SYNTAX score (<=32)"],
        answer: 3,
        explain: "EXCEL enrolled patients with significant left main CAD and SYNTAX score 32 or less, selecting relatively lower-complexity anatomy where PCI is most anatomically feasible."
      },
      {
        q: "What was the major point of controversy in the long-term EXCEL results?",
        options: ["A late PCI mortality signal and the MI definition used","Higher stroke rates with PCI at 5 years","Excess renal failure with CABG","Non-inferiority margin was not pre-specified"],
        answer: 0,
        explain: "At 5-year follow-up, all-cause mortality was numerically higher with PCI. Critics also raised concerns about the MI definition used, which affected the apparent parity of the primary composite endpoint."
      },
      {
        q: "The NOBLE trial, which studied a similar left main population contemporaneously with EXCEL, found:",
        options: ["PCI was superior to CABG at 5 years","CABG was superior to PCI at 5 years","No difference between PCI and CABG at 5 years","Both strategies had equivalent all-cause mortality"],
        answer: 1,
        explain: "NOBLE found CABG superior to PCI for left main disease at 5 years (lower MACCE), contrasting with EXCEL's non-inferiority result and contributing to ongoing debate about PCI in left main disease."
      }
    ]
  },

  /* ------------------------------------------------------------------ NOBLE */
  {
    id: "noble",
    category: "coronary",
    name: "NOBLE",
    full: "Nordic-Baltic-British Left Main Revascularization Study",
    year: 2016,
    journal: "Lancet",
    topic: "CABG vs PCI for left main disease",
    question: "In patients with left main CAD, is PCI non-inferior to CABG for major adverse cardiac or cerebrovascular events at 5 years?",
    design: "Randomised controlled trial (non-inferiority design)",
    population: "Patients with significant left main CAD (mixed SYNTAX scores; complex bifurcation lesions excluded at operator discretion)",
    intervention: "PCI with biolimus-eluting stent",
    comparator: "CABG",
    outcome: "PCI failed to meet non-inferiority versus CABG at 5 years; CABG had significantly fewer MACCE events driven by lower rates of non-procedural MI and repeat revascularisation. Stroke was more common after CABG early on.",
    bottomLine: "Unlike EXCEL, NOBLE found CABG superior to PCI for left main disease at 5 years. Together these trials support CABG as the preferred strategy for left main disease in patients with acceptable surgical risk.",
    pearls: [
      "NOBLE used a different stent (biolimus) and different primary endpoint construction from EXCEL.",
      "Non-procedural MI and repeat revascularisation drove CABG superiority in NOBLE.",
      "Stroke was more common after CABG in the early peri-operative period.",
      "Discordance between NOBLE and EXCEL highlights the importance of individual patient anatomy and Heart Team discussion.",
      "Both trials excluded patients unfit for CABG."
    ],
    citation: "Makikallio T et al. Lancet 2016;388:2743-2752.",
    mcqs: [
      {
        q: "The NOBLE trial differed from EXCEL primarily in that NOBLE:",
        options: ["Excluded patients with low SYNTAX scores","Used an everolimus-eluting stent","Found CABG superior to PCI at 5 years","Enrolled only diabetic patients"],
        answer: 2,
        explain: "NOBLE found CABG superior to PCI for left main disease (non-inferiority not met), in contrast to EXCEL which met non-inferiority at 3 years, creating ongoing debate about the optimal strategy."
      },
      {
        q: "Which components of MACCE drove the superior outcomes of CABG over PCI in NOBLE?",
        options: ["Lower CABG stroke rate and lower mortality","Lower procedural MI and lower hospital stay with CABG","Lower atrial fibrillation and lower renal failure with CABG","Lower non-procedural MI and lower repeat revascularisation with CABG"],
        answer: 3,
        explain: "In NOBLE, the advantage of CABG over PCI was driven by lower rates of non-procedural MI and repeat revascularisation, consistent with the durability of surgical grafting over stenting in complex left main disease."
      },
      {
        q: "What was the early adverse event more common after CABG than PCI in NOBLE?",
        options: ["Stroke","Myocardial infarction","Acute kidney injury","Repeat revascularisation"],
        answer: 0,
        explain: "Stroke was more frequent in the early peri-operative period after CABG compared with PCI in NOBLE, which is a recognised trade-off of surgical revascularisation."
      }
    ]
  },

  /* ------------------------------------------------------------------- STICH */
  {
    id: "stich",
    category: "coronary",
    name: "STICH",
    full: "Surgical Treatment for Ischemic Heart Failure",
    year: 2011,
    journal: "N Engl J Med",
    topic: "CABG vs medical therapy in ischaemic cardiomyopathy",
    question: "In patients with coronary artery disease and reduced ejection fraction (EF <=35%), does CABG added to medical therapy improve outcomes compared with medical therapy alone?",
    design: "Randomised controlled trial (two hypotheses: CABG vs medical therapy; and SVR sub-study)",
    population: "Patients with CAD amenable to CABG and left ventricular ejection fraction 35% or less",
    intervention: "CABG plus optimal medical therapy",
    comparator: "Optimal medical therapy alone",
    outcome: "At 10 years (STICHES extension), CABG plus medical therapy significantly reduced all-cause mortality compared with medical therapy alone. The early hazard of surgery was offset by sustained long-term benefit. The SVR sub-study showed adding surgical ventricular reconstruction did not improve outcomes over CABG alone.",
    bottomLine: "CABG improves long-term survival in patients with ischaemic cardiomyopathy (EF <=35%) when added to optimal medical therapy. The benefit is realised over the long term (5-10 years), requiring careful patient selection.",
    pearls: [
      "Primary analysis at 5 years did not reach statistical significance; the 10-year STICHES extension showed clear mortality benefit.",
      "The SVR (surgical ventricular reconstruction) sub-study: adding LV reconstruction to CABG did not reduce death or hospitalisation for cardiac causes.",
      "Viability testing (nuclear imaging, echo) did not predict differential benefit from CABG in the STICH imaging sub-study.",
      "CABG is preferred over PCI in ischaemic cardiomyopathy given survival data and completeness of revascularisation.",
      "Patients must be fit enough to survive the early operative risk to reap the long-term benefit."
    ],
    citation: "Velazquez EJ et al. N Engl J Med 2011;364:1607-1616. (STICHES 10-year: Velazquez EJ et al. N Engl J Med 2016;374:1511-1520.)",
    mcqs: [
      {
        q: "What ejection fraction threshold was used to enrol patients in the STICH trial?",
        options: ["EF <=25%","EF <=35%","EF <=40%","EF <=50%"],
        answer: 1,
        explain: "STICH enrolled patients with CAD and LVEF 35% or less, defining the ischaemic cardiomyopathy population in whom surgical revascularisation was being evaluated."
      },
      {
        q: "When did the survival benefit of CABG over medical therapy become statistically significant in the STICH/STICHES programme?",
        options: ["At 30 days post-operatively","At 2 years of follow-up","At 10 years (STICHES extension)","At 5 years (primary endpoint)"],
        answer: 2,
        explain: "The 5-year primary analysis did not reach statistical significance. The STICHES 10-year extension demonstrated a significant reduction in all-cause mortality with CABG plus medical therapy, confirming the long-term benefit."
      },
      {
        q: "What was the key finding of the Surgical Ventricular Reconstruction (SVR) sub-study within STICH?",
        options: ["SVR improved survival over CABG alone","SVR reduced hospitalisation for heart failure compared with CABG alone","SVR was superior in patients with EF <25%","No reduction in death or cardiac hospitalisation versus CABG alone"],
        answer: 3,
        explain: "The SVR sub-study found that adding surgical ventricular reconstruction to CABG did not reduce the composite of death or hospitalisation for cardiac causes compared with CABG alone, despite reducing LV end-systolic volume index."
      }
    ]
  },

  /* -------------------------------------------------------------------- ART */
  {
    id: "art",
    category: "coronary",
    name: "ART",
    full: "Arterial Revascularisation Trial",
    year: 2016,
    journal: "N Engl J Med",
    topic: "Bilateral vs single internal mammary artery CABG",
    question: "In patients undergoing CABG, does bilateral internal mammary artery (BIMA) grafting reduce mortality compared with single IMA (SIMA) plus vein grafting?",
    design: "Randomised controlled trial",
    population: "Patients undergoing first-time elective or urgent CABG requiring at least two bypass grafts",
    intervention: "Bilateral internal mammary artery (BIMA) grafting",
    comparator: "Single internal mammary artery (SIMA) plus saphenous vein graft",
    outcome: "At 10 years, BIMA did not significantly reduce all-cause mortality or the composite of death, MI, or stroke compared with SIMA. BIMA was associated with a higher rate of sternal wound complications, including deep sternal wound infection, particularly in diabetics.",
    bottomLine: "BIMA did not demonstrate a statistically significant survival benefit over SIMA at 10 years in this trial. While observational data support BIMA, ART suggests the absolute benefit may be modest and must be weighed against higher sternal wound complication risk.",
    pearls: [
      "ART is the largest randomised trial of BIMA vs SIMA grafting.",
      "Deep sternal wound infection was approximately twice as frequent with BIMA.",
      "The risk of sternal complications is highest in obese and diabetic patients; BIMA should be used with caution in these groups.",
      "ART was underpowered for mortality; observational registries suggest BIMA provides long-term patency advantages.",
      "Skeletonised IMA harvesting may reduce sternal wound complications compared with pedicled technique."
    ],
    citation: "Taggart DP et al. N Engl J Med 2016;375:2540-2549.",
    mcqs: [
      {
        q: "What was the primary finding of the ART trial regarding bilateral IMA grafting at 10 years?",
        options: ["BIMA did not significantly reduce all-cause mortality vs SIMA","BIMA significantly reduced all-cause mortality vs SIMA","BIMA increased stroke risk significantly","BIMA improved graft patency but not clinical outcomes"],
        answer: 0,
        explain: "ART found no statistically significant reduction in all-cause mortality or the composite endpoint with BIMA versus SIMA at 10 years, though the trial may have been underpowered to detect a modest difference."
      },
      {
        q: "Which patient characteristic is most associated with increased sternal wound complications after BIMA in ART?",
        options: ["Advanced age (>75 years)","Diabetes mellitus and obesity","Prior myocardial infarction","Female sex"],
        answer: 1,
        explain: "Diabetes mellitus and obesity were the strongest risk factors for sternal wound complications with BIMA in ART. Deep sternal wound infection was approximately twice as common with BIMA overall."
      },
      {
        q: "Which IMA harvesting technique may reduce sternal wound complications associated with BIMA?",
        options: ["Pedicled harvesting with electrocautery","Endoscopic saphenous vein harvest instead","Skeletonised IMA harvesting","Using the right IMA as a free graft only"],
        answer: 2,
        explain: "Skeletonised IMA harvesting preserves the sternal blood supply compared with pedicled harvesting and is associated with lower rates of sternal wound complications, making it preferable when BIMA is used."
      }
    ]
  },

  /* ------------------------------------------------------------------ ROOBY */
  {
    id: "rooby",
    category: "coronary",
    name: "ROOBY / ROOBY-FS",
    full: "Randomized On/Off Bypass trial and Follow-up Study",
    year: 2009,
    journal: "N Engl J Med",
    topic: "Off-pump vs on-pump CABG",
    question: "In patients undergoing CABG, does off-pump (beating-heart) surgery improve outcomes compared with conventional on-pump (cardiopulmonary bypass) CABG?",
    design: "Randomised controlled trial with 5-year follow-up study (ROOBY-FS)",
    population: "Veterans undergoing first-time or redo CABG at VA medical centres in the USA",
    intervention: "Off-pump CABG (OPCAB)",
    comparator: "On-pump CABG with cardiopulmonary bypass",
    outcome: "Off-pump CABG was associated with worse composite outcomes (death, repeat revascularisation, or non-fatal MI) at 30 days and at 1 year. At 5 years (ROOBY-FS), off-pump CABG had significantly worse survival and higher rates of composite adverse outcomes. Graft patency was lower with off-pump surgery.",
    bottomLine: "In the ROOBY population (largely male veterans, experienced cardiac surgery centres), off-pump CABG produced inferior short- and long-term outcomes compared with on-pump CABG, driven by worse graft patency. Off-pump CABG may be preferred in very high-risk patients (severe aortic disease, renal failure) but should not be used routinely.",
    pearls: [
      "ROOBY-FS (5-year follow-up) showed significantly worse survival and more composite adverse events with off-pump CABG.",
      "Graft patency was significantly lower with off-pump CABG at 1-year angiographic follow-up (a sub-study finding).",
      "Off-pump CABG may still benefit selected patients: severe aortic calcification, renal impairment, or high neurological risk from bypass.",
      "Surgeon experience with off-pump technique is critical; ROOBY enrolled surgeons at varying experience levels.",
      "The CORONARY trial (larger, international) showed similar early outcomes between off-pump and on-pump at 30 days."
    ],
    citation: "Shroyer AL et al. N Engl J Med 2009;361:1827-1837. (ROOBY-FS: Shroyer AL et al. N Engl J Med 2012;367:2477-2485.)",
    mcqs: [
      {
        q: "What was the key finding of ROOBY-FS (5-year follow-up) regarding off-pump vs on-pump CABG?",
        options: ["Off-pump CABG had significantly better survival at 5 years","No difference in survival between off-pump and on-pump at 5 years","Off-pump CABG reduced stroke but increased MI rates","Off-pump CABG had significantly worse survival and composite outcomes at 5 years"],
        answer: 3,
        explain: "ROOBY-FS demonstrated that off-pump CABG was associated with significantly worse survival and higher rates of the composite adverse endpoint at 5 years, largely attributed to inferior graft patency."
      },
      {
        q: "What mechanism best explains the inferior outcomes of off-pump CABG in ROOBY?",
        options: ["Lower graft patency from greater technical difficulty","Higher rates of intra-operative myocardial infarction","Greater use of saphenous vein rather than IMA grafts","Higher post-operative atrial fibrillation rates"],
        answer: 0,
        explain: "Off-pump CABG in ROOBY was associated with lower graft patency rates compared with on-pump, likely reflecting the technical challenges of constructing coronary anastomoses on a beating, moving heart without perfect stillness."
      },
      {
        q: "In which clinical scenario might off-pump CABG be most appropriately preferred over on-pump CABG?",
        options: ["Young patients requiring multiple grafts with good targets","Porcelain aorta when clamping is hazardous","Diabetics with multivessel disease and LVEF >50%","Patients with prior sternotomy and patent IMA graft"],
        answer: 1,
        explain: "Off-pump CABG avoids aortic clamping and cardiopulmonary bypass, making it most beneficial when the ascending aorta is severely calcified (porcelain aorta), where cross-clamping carries extreme stroke risk."
      }
    ]
  }

); // end push — coronary trials
