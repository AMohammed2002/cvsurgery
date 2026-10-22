/* Shared provenance registry for the core Question Bank.
   `citation` remains useful offline; `url` is an optional online primary-source link. */
window.QUESTION_SOURCES = Object.freeze({
  "cohn-5e": {
    type: "textbook",
    citation: "Cohn LH, Adams DH, eds. Cardiac Surgery in the Adult. 5th ed.",
    version: "5th edition",
    reviewed: "2026-07-20"
  },
  "key-questions-2e": {
    type: "textbook",
    citation: "Key Questions in Cardiac Surgery. 2nd ed.",
    version: "2nd edition",
    reviewed: "2026-07-20"
  },
  "cardiac-surgery-primer": {
    type: "course-reference",
    citation: "A Primer for the Student Joining the Adult Cardiac Surgery Service.",
    version: "local course edition",
    reviewed: "2026-07-20"
  },
  "acc-aha-revasc-2021": {
    type: "guideline",
    citation: "2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization.",
    version: "2021",
    url: "https://www.acc.org/Guidelines/Guidelines/2021/12/09/18/18/Coronary-Artery-Revascularization",
    reviewed: "2026-07-20"
  },
  "acc-aha-vhd-2020": {
    type: "guideline",
    citation: "2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease.",
    version: "2020",
    url: "https://www.acc.org/-/media/Non-Clinical/Files-PDFs-Excel-MS-Word-etc/Guidelines/2020/VHD-Guidelines-Made-Simple-Tool-gl-vhd.pdf",
    reviewed: "2026-07-20"
  },
  "acc-aha-aortic-2022": {
    type: "guideline",
    citation: "2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
    version: "2022",
    url: "https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2022/11/01/12/17/2022-guideline-on-aortic-disease-1-gl-ad",
    reviewed: "2026-07-20"
  },
  "eacts-sts-aortic-2024": {
    type: "guideline",
    citation: "EACTS/STS Guidelines for Diagnosing and Treating Acute and Chronic Syndromes of the Aortic Organ.",
    version: "2024",
    url: "https://academic.oup.com/ejcts/article/65/2/ezad426/7614462",
    reviewed: "2026-07-20"
  },
  "acc-aha-af-2023": {
    type: "guideline",
    citation: "2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation.",
    version: "2023",
    url: "https://www.acc.org/Guidelines/Guidelines/2023/11/30/12/05/Atrial-Fibrillation-2023-Guideline",
    reviewed: "2026-07-20"
  },
  "sts-poaf-2026": {
    type: "guideline",
    citation: "STS Clinical Practice Guidelines for Prevention and Treatment of New-Onset Postoperative Atrial Fibrillation After Cardiac Surgery.",
    version: "2026",
    url: "https://www.sts.org/news/new-sts-clinical-practice-guidelines-advance-evidence-based-care-postoperative-atrial-fibrillation",
    reviewed: "2026-07-20"
  },
  "eacts-cpb-2019": {
    type: "guideline",
    citation: "2019 EACTS/EACTA/EBCP Guidelines on Cardiopulmonary Bypass in Adult Cardiac Surgery.",
    version: "2019",
    url: "https://academic.oup.com/ejcts/article/57/2/210/5579823",
    reviewed: "2026-07-20"
  },
  "eacts-pbm-2024": {
    type: "guideline",
    citation: "2024 EACTS/EACTAIC Guidelines on Patient Blood Management in Adult Cardiac Surgery with EBCP.",
    version: "2024",
    url: "https://academic.oup.com/ejcts/article/67/5/ezae352/7815985",
    reviewed: "2026-07-20"
  },
  "ishlt-mcs-2023": {
    type: "guideline",
    citation: "2023 ISHLT Guidelines for Mechanical Circulatory Support: A 10-Year Update.",
    version: "2023",
    url: "https://www.ishlt.org/education-and-publications/standards-guidelines-detail/the-2023-ishlt-guidelines-for-mechanical-circulatory-support-a-10--year-update",
    reviewed: "2026-07-20"
  },
  "acc-aha-hf-2022": {
    type: "guideline",
    citation: "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure.",
    version: "2022",
    url: "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2022/03/29/19/53/2022-aha-acc-hfsa-heart-failure-guideline-gl-hf",
    reviewed: "2026-07-20"
  },
  "freedom": {
    type: "trial",
    citation: "FREEDOM: Strategies for Multivessel Revascularization in Patients with Diabetes. N Engl J Med. 2012.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/23121323/",
    reviewed: "2026-07-20"
  },
  "syntax": {
    type: "trial",
    citation: "SYNTAX: PCI versus CABG for Severe Coronary Artery Disease. N Engl J Med. 2009.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/19228612/",
    reviewed: "2026-07-20"
  },
  "coapt-mitrafr": {
    type: "trial",
    citation: "COAPT and MITRA-FR trials of transcatheter repair for secondary mitral regurgitation. 2018.",
    version: "primary trials",
    url: "https://pubmed.ncbi.nlm.nih.gov/30280640/",
    reviewed: "2026-07-20"
  },
  "trics-iii": {
    type: "trial",
    citation: "TRICS III: Restrictive or Liberal Red-Cell Transfusion for Cardiac Surgery. N Engl J Med. 2017.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/29130845/",
    reviewed: "2026-07-20"
  },
  "excel-noble": {
    type: "trial",
    citation: "EXCEL and NOBLE randomized trials of PCI versus CABG for left-main coronary disease. N Engl J Med. 2019; Lancet. 2020.",
    version: "5-year primary reports",
    url: "https://pubmed.ncbi.nlm.nih.gov/31562798/",
    reviewed: "2026-07-20"
  },
  "stiches": {
    type: "trial",
    citation: "Velazquez EJ et al. Coronary-Artery Bypass Surgery in Patients with Ischemic Cardiomyopathy (STICHES). N Engl J Med. 2016.",
    version: "10-year follow-up",
    url: "https://pubmed.ncbi.nlm.nih.gov/27040723/",
    reviewed: "2026-07-20"
  },
  "ischemia": {
    type: "trial",
    citation: "Maron DJ et al. Initial Invasive or Conservative Strategy for Stable Coronary Disease (ISCHEMIA). N Engl J Med. 2020.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/32227755/",
    reviewed: "2026-07-20"
  },
  "partner-3": {
    type: "trial",
    citation: "Mack MJ et al. Transcatheter Aortic-Valve Replacement with a Balloon-Expandable Valve in Low-Risk Patients (PARTNER 3). N Engl J Med. 2019.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/30883058/",
    reviewed: "2026-07-20"
  },
  "partner-1b": {
    type: "trial",
    citation: "Leon MB et al. Transcatheter Aortic-Valve Implantation for Aortic Stenosis in Patients Who Cannot Undergo Surgery (PARTNER 1B). N Engl J Med. 2010.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/20961243/",
    reviewed: "2026-07-20"
  },
  "evolut-low-risk": {
    type: "trial",
    citation: "Popma JJ et al. Transcatheter Aortic-Valve Replacement with a Self-Expanding Valve in Low-Risk Patients (Evolut Low Risk). N Engl J Med. 2019.",
    version: "primary trial",
    url: "https://doi.org/10.1056/NEJMoa1816885",
    reviewed: "2026-07-20"
  },
  "momentum-3": {
    type: "trial",
    citation: "Mehra MR et al. A Fully Magnetically Levitated Left Ventricular Assist Device—Final Report (MOMENTUM 3). N Engl J Med. 2019.",
    version: "2-year final report",
    url: "https://pubmed.ncbi.nlm.nih.gov/30883052/",
    reviewed: "2026-07-20"
  },
  "iabp-shock-ii": {
    type: "trial",
    citation: "Thiele H et al. Intraaortic Balloon Support for Myocardial Infarction with Cardiogenic Shock (IABP-SHOCK II). N Engl J Med. 2012.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/22920912/",
    reviewed: "2026-07-20"
  },
  "proact": {
    type: "trial",
    citation: "Puskas J et al. Reduced Anticoagulation after On-X Mechanical Aortic Valve Replacement (PROACT). J Thorac Cardiovasc Surg. 2014.",
    version: "primary randomized report",
    url: "https://pubmed.ncbi.nlm.nih.gov/24512654/",
    reviewed: "2026-07-20"
  },
  "re-align": {
    type: "trial",
    citation: "Eikelboom JW et al. Dabigatran versus Warfarin in Patients with Mechanical Heart Valves (RE-ALIGN). N Engl J Med. 2013.",
    version: "primary trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/23991661/",
    reviewed: "2026-07-20"
  }
});
