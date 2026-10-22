/* Days 6-9 retrieval-v2 claim ledger and cards.
   This rebuild replaces canonical active membership for its lesson sources;
   existing scheduling records are not deleted or rewritten. */
"use strict";

(function registerDaysSixThroughNineRetrieval() {
  if (!window.FlashcardSchema) {
    throw new Error("Days 6-9 retrieval cards require flashcard-schema.js");
  }

  const REVIEWER = "assistant-editorial-review";
  const REVIEWED_AT = "2026-07-31";
  const REVIEW_BY = "2026-10-31";

  function safeId(value) {
    return String(value == null ? "part" : value).toLowerCase().replace(/<[^>]+>/g, " ")
      .replace(/&[a-z0-9#]+;/gi, " ").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "").slice(0, 72) || "part";
  }

  function hash(value, seed) {
    let result = seed >>> 0;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
      result ^= text.charCodeAt(index);
      result = Math.imul(result, 16777619) >>> 0;
      result = (result ^ (result >>> 13)) >>> 0;
    }
    return result.toString(36).padStart(7, "0");
  }

  function opaqueId(claimId) {
    const payload = [
      hash(claimId, 2166136261), hash(claimId, 2246822519),
      hash(claimId, 3266489917), hash(claimId, 668265263)
    ].join("").slice(0, 22);
    return "fc2_d6d9" + payload;
  }

  function meta(comparator, value, unit, condition, precision) {
    return { comparator, value, unit, condition, precision };
  }

  function guideline(sourceId, organization, year, recommendationClass, evidenceLevel) {
    return {
      sourceId, organization, year, recommendationClass, evidenceLevel,
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY
    };
  }

  function item(key, tier, category, statement, archetype, cloze, explanation, extra) {
    return {
      key, tier, category, statement,
      card: Object.assign({ archetype, cloze, explanation }, extra || {})
    };
  }

  function atomic(key, tier, category, statement, cloze, explanation, extra) {
    return item(key, tier, category, statement, "atomic-concept", cloze, explanation, extra);
  }
  function mechanism(key, tier, category, statement, cloze, explanation, extra) {
    return item(key, tier, category, statement, "mechanism-decision", cloze, explanation, extra);
  }
  function bounded(key, tier, category, statement, count, cloze, explanation, extra) {
    return item(key, tier, category, statement, "bounded-set", cloze, explanation,
      Object.assign({ answerCount: count, ordered: false }, extra || {}));
  }
  function mapping(key, tier, category, statement, count, cloze, explanation, extra) {
    return item(key, tier, category, statement, "mapping-set", cloze, explanation,
      Object.assign({ answerCount: count, ordered: false }, extra || {}));
  }
  function ordered(key, tier, statement, count, cloze, explanation, extra) {
    return item(key, tier, "sequence", statement, "ordered-sequence", cloze, explanation,
      Object.assign({ answerCount: count, ordered: true }, extra || {}));
  }
  function contrast(key, tier, category, statement, cloze, explanation, extra) {
    return item(key, tier, category, statement, "contrast", cloze, explanation, extra);
  }
  function numeric(key, tier, statement, cloze, explanation, numericMeta, extra) {
    return item(key, tier, "number", statement, "numeric-guideline", cloze, explanation,
      Object.assign({ numeric: numericMeta, reviewBy: REVIEW_BY }, extra || {}));
  }
  function guide(key, tier, statement, archetype, cloze, explanation, guideMeta, extra) {
    return item(key, tier, "guideline", statement, archetype, cloze, explanation,
      Object.assign({ guideline: guideMeta, reviewBy: REVIEW_BY }, extra || {}));
  }
  function guideNumeric(key, tier, statement, cloze, explanation, numericMeta, guideMeta, extra) {
    return guide(key, tier, statement, "numeric-guideline", cloze, explanation, guideMeta,
      Object.assign({ numeric: numericMeta }, extra || {}));
  }

  function unit(title, entries) { return { title, entries }; }

  function promptWordCount(value) {
    return (String(value || "").replace(/<[^>]+>/g, " ").match(/[A-Za-z0-9]+(?:[.'’-][A-Za-z0-9]+)*/g) || []).length;
  }

  function polishCard(rawCard) {
    const card = Object.assign({}, rawCard);
    let cloze = String(card.cloze || "");
    let match = cloze.match(/\{\{c1::([^{}]+)\}\}/);
    if (!match) return card;
    let prefix = cloze.slice(0, match.index).trim();
    if (promptWordCount(prefix) < 2) {
      cloze = "In this clinical setting, " + cloze.charAt(0).toLowerCase() + cloze.slice(1);
      match = cloze.match(/\{\{c1::([^{}]+)\}\}/);
    }
    let visible = cloze.replace(match[0], " ");
    if (promptWordCount(visible) < 5) {
      cloze = cloze.replace(/([.!?])$/, " in the stated clinical setting$1");
    }
    card.cloze = cloze;
    return card;
  }

  const REVASC = () => guideline(
    "2021-ACC-AHA-SCAI-coronary-revascularization", "ACC/AHA/SCAI", 2021, "see-card", "see-card"
  );
  const VALVE = () => guideline(
    "2020-ACC-AHA-valvular-heart-disease", "ACC/AHA", 2020, "see-card", "see-card"
  );
  const AORTA = () => guideline(
    "2022-ACC-AHA-aortic-disease", "ACC/AHA", 2022, "see-card", "see-card"
  );

  const authored = {
    "d6-indications": [
      unit("The Decision Framework for Revascularization", [
        bounded("framework", "core", "bounded-set",
          "Revascularization strategy integrates anatomy, physiology, ventricular function, and patient context.", 4,
          "The Heart Team integrates {{c1::anatomy; physiology; LV function; patient context}} when selecting revascularization.",
          "No single score replaces convergence among lesion complexity, ischemic significance, ventricular reserve, comorbidity, and patient goals."),
        mapping("stenosis-thresholds", "applied-core", "model",
          "Hemodynamic significance begins at different diameter stenoses in left-main and other coronary disease.", 2,
          "Anatomic significance maps as {{c1::non-left-main → at least 70%; left main → at least 50%}}.",
          "The left main supplies so much myocardium that a smaller percentage narrowing is clinically important."),
        mapping("risk-tools", "core", "comparison",
          "STS estimates operative clinical risk, whereas SYNTAX describes coronary anatomic complexity.", 2,
          "Revascularization risk tools map as {{c1::STS → operative risk; SYNTAX → anatomic complexity}}.",
          "SYNTAX omits clinical variables and has interobserver variability, so it complements rather than replaces Heart Team judgment.")
      ]),
      unit("Class I CABG Indications", [
        bounded("cabg-indication-set", "core", "bounded-set",
          "CABG is favored for prognostically important anatomy, instability, and diabetes-associated diffuse disease.", 5,
          "Major CABG-favoring settings include {{c1::left-main disease; complex multivessel disease; viable low-EF myocardium; unstable failed PCI; diabetic multivessel disease}}.",
          "The common thread is a large jeopardized territory or diffuse disease that a distal bypass can protect more completely."),
        mechanism("hibernating-myocardium", "applied-core", "mechanism",
          "Viable hibernating myocardium may regain contractility after coronary blood flow is restored.",
          "In ischemic low-EF hearts, viable muscle supports CABG because {{c1::hibernating myocardium can recover}}.",
          "A weak ventricle with viable ischemic tissue is a reason to consider revascularization, not automatically a contraindication."),
        numeric("stich-ef", "enrichment",
          "STICH enrolled patients with an ejection fraction below 35 percent.",
          "The STICH low-EF population had LVEF {{c1::below 35%}}.",
          "Interpret its early neutral trend with the crossover and longer-term evidence rather than using EF alone to deny surgery.",
          meta("less-than", 35, "%", "STICH enrollment LVEF", "exact"))
      ]),
      unit("The SYNTAX Trial (2009, 5-year follow-up 2013)", [
        numeric("high-score", "applied-core",
          "A SYNTAX score of 33 or greater identifies high-complexity anatomy favoring CABG in the lesson framework.",
          "In the SYNTAX framework, high complexity begins at {{c1::33 points}}.",
          "High complexity magnifies CABG's advantage in myocardial infarction and repeat revascularization.",
          meta("greater-than-or-equal", 33, "points", "high SYNTAX complexity", "exact")),
        numeric("low-score", "applied-core",
          "A SYNTAX score of 22 or less identifies low-complexity anatomy in the lesson framework.",
          "In the SYNTAX framework, low complexity ends at {{c1::22 points}}.",
          "Low-complexity left-main anatomy may permit PCI when both strategies are technically suitable.",
          meta("less-than-or-equal", 22, "points", "low SYNTAX complexity", "exact")),
        numeric("intermediate-score", "enrichment",
          "The intermediate SYNTAX score range is 23 through 32.",
          "The intermediate SYNTAX band is {{c1::23–32 points}}.",
          "This range requires individualized interpretation rather than a score-only procedure choice.",
          meta("range", [23, 32], "points", "intermediate SYNTAX complexity", "exact")),
        mechanism("diffuse-disease", "core", "mechanism",
          "CABG gains advantage in diffuse disease because graft inflow lands beyond proximal and evolving lesions.",
          "As coronary disease becomes diffuse, CABG gains because {{c1::grafts bypass the diseased segments}}.",
          "PCI treats discrete lesions, whereas a graft protects a distal vascular territory despite proximal progression."),
        contrast("tradeoff", "core", "comparison",
          "CABG pays more early stroke risk, whereas PCI pays more later repeat-revascularization risk.",
          "Compared with PCI, CABG trades {{c1::more early stroke for fewer repeat procedures}}.",
          "Aortic manipulation drives much of the early surgical stroke penalty; lesion recurrence drives the later PCI penalty.")
      ]),
      unit("FREEDOM Trial (2012): Diabetes and Multivessel CAD", [
        numeric("primary-endpoint", "core",
          "FREEDOM reported a five-year composite rate of 26.6 percent with PCI and 18.7 percent with CABG.",
          "FREEDOM's five-year composite was {{c1::26.6% PCI versus 18.7% CABG}}.",
          "CABG's advantage was driven by fewer deaths and myocardial infarctions, with more early stroke.",
          meta("comparison", "26.6% PCI versus 18.7% CABG", "%", "five-year death/MI/stroke composite", "exact")),
        mechanism("diabetes-biology", "core", "mechanism",
          "Diffuse progressive diabetic atherosclerosis favors distal bypass over focal stenting.",
          "Diabetes favors CABG because coronary disease is {{c1::diffuse, small-vessel, and progressive}}.",
          "A durable distal graft keeps supplying the territory as native disease progresses around focal stents."),
        guide("diabetes-lad", "applied-core",
          "For diabetes with multivessel disease involving the LAD, CABG with a LIMA-to-LAD is recommended over PCI.",
          "mechanism-decision",
          "For diabetes with multivessel LAD disease, the preferred strategy is {{c1::CABG with LIMA-to-LAD}}.",
          "The 2021 guideline assigns this recommendation Class 1, Level A; PCI remains an alternative when surgical risk is prohibitive.",
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "A" }))
      ]),
      unit("EXCEL and NOBLE Trials: Left Main Disease", [
        contrast("mi-definitions", "core", "evidence",
          "EXCEL and NOBLE reached different composite conclusions partly because they defined myocardial infarction differently.",
          "EXCEL counted procedural enzyme events, whereas NOBLE {{c1::excluded periprocedural myocardial infarction}}.",
          "Different endpoint definitions changed the event balance and explain much of the apparently conflicting headline."),
        numeric("excel-mortality", "enrichment",
          "EXCEL reported five-year all-cause mortality of 9.9 percent with CABG and 13.0 percent with PCI.",
          "EXCEL five-year mortality was {{c1::9.9% CABG versus 13.0% PCI}}.",
          "The hard mortality endpoint favored CABG despite the trial's early noninferiority composite.",
          meta("comparison", "9.9% CABG versus 13.0% PCI", "%", "EXCEL five-year all-cause mortality", "exact")),
        numeric("noble-macce", "enrichment",
          "NOBLE reported five-year MACCE of approximately 28 percent with PCI and 19 percent with CABG.",
          "NOBLE five-year MACCE was about {{c1::28% PCI versus 19% CABG}}.",
          "More spontaneous infarction and repeat revascularization after PCI drove the surgical advantage.",
          meta("comparison", "28% PCI versus 19% CABG", "%", "NOBLE five-year MACCE", "approximate"))
      ]),
      unit("Emergency CABG and Carotid Disease", [
        bounded("emergency-indications", "applied-core", "bounded-set",
          "Emergency CABG addresses failed PCI with instability, unsuitable anatomy, mechanical infarct complications, or refractory shock.", 4,
          "Emergency CABG triggers include {{c1::unstable failed PCI; PCI-unsuitable anatomy; mechanical MI complications; refractory cardiogenic shock}}.",
          "The operation restores flow or repairs anatomy when catheter treatment cannot stabilize the threatened myocardium."),
        mechanism("stroke-source", "core", "mechanism",
          "Most perioperative CABG strokes originate from emboli released by ascending-aortic manipulation.",
          "Most CABG strokes arise from {{c1::embolization during aortic manipulation}}.",
          "Carotid stenosis is often a marker of diffuse vascular disease rather than the direct source of the event."),
        guideNumeric("symptomatic-carotid", "enrichment",
          "Combined coronary-carotid revascularization may be considered for symptomatic carotid stenosis of at least 50 percent.",
          "For symptomatic carotid disease, the lesson's intervention threshold is {{c1::at least 50% stenosis}}.",
          "Timing is individualized according to whether neurologic or coronary instability poses the more urgent threat.",
          meta("greater-than-or-equal", 50, "%", "symptomatic carotid stenosis with CABG", "exact"),
          Object.assign(REVASC(), { recommendationClass: "2a", evidenceLevel: "B-NR" }))
      ]),
      unit("PGY-5 mastery: defending CABG vs PCI at the level of the trials themselves", [
        mapping("trial-map", "core", "evidence",
          "FREEDOM, EXCEL/NOBLE, ART, and RADIAL answer different coronary-surgery questions.", 4,
          "Coronary evidence maps as {{c1::FREEDOM → diabetic multivessel; EXCEL/NOBLE → left main; ART → bilateral IMA; RADIAL → radial conduit}}.",
          "A defensible recommendation names the relevant population, endpoint, limitation, and mechanism rather than merely naming a trial."),
        contrast("left-main-synthesis", "applied-core", "comparison",
          "PCI is more competitive in low-complexity left-main disease, whereas CABG gains with complexity.",
          "For left-main disease, PCI competes at low complexity, whereas {{c1::CABG gains as complexity rises}}.",
          "This synthesis reconciles the discordant trial headlines without ignoring their endpoint-definition problems.")
      ]),
      unit("The 2021 Guideline in One Page: Top 10 Take-Home Messages", [
        guide("heart-team", "core",
          "When the optimal revascularization strategy is unclear, a multidisciplinary Heart Team should use shared decision-making.",
          "mechanism-decision",
          "When revascularization strategy is unclear, the decision belongs to a {{c1::multidisciplinary Heart Team}}.",
          "The team integrates anatomy, operative risk, physiology, patient values, health literacy, and treatment feasibility.",
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "C-EO" })),
        guide("left-main-choice", "core",
          "CABG improves survival in significant left-main disease; PCI is reasonable when complexity is low-to-medium and both approaches are suitable.",
          "contrast",
          "For significant left-main disease, CABG improves survival, whereas {{c1::PCI fits selected low-complexity anatomy}}.",
          "The choice requires technical equipoise and a Heart Team rather than anatomy-free extrapolation.",
          Object.assign(REVASC(), { recommendationClass: "1 CABG / 2a PCI", evidenceLevel: "B-R" })),
        guide("nonculprit-shock", "applied-core",
          "Routine nonculprit PCI during STEMI cardiogenic shock is harmful, whereas staged PCI after stabilization can improve outcomes.",
          "contrast",
          "In STEMI, staged nonculprit PCI may help, whereas immediate multivessel PCI during shock is {{c1::harmful}}.",
          "Shock changes the balance because longer multivessel intervention adds contrast, ischemic time, and procedural stress.",
          Object.assign(REVASC(), { recommendationClass: "3 Harm in shock", evidenceLevel: "B-R" })),
        mapping("score-roles", "core", "comparison",
          "The guideline uses STS for surgical risk and treats SYNTAX as an imperfect anatomy aid.", 2,
          "Guideline score roles map as {{c1::STS → surgical risk; SYNTAX → anatomy aid}}.",
          "Neither score substitutes for feasibility, frailty, renal function, cognition, or patient preference.")
      ]),
      unit("When CABG Is Preferred: Complex Disease and Diabetes", [
        bounded("preferred-settings", "core", "bounded-set",
          "CABG is preferred for high-complexity left-main disease, diffuse multivessel disease, diabetic LAD disease, or inability to maintain DAPT.", 4,
          "CABG-favoring settings are {{c1::complex left main; diffuse multivessel disease; diabetes with LAD disease; inability to take DAPT}}.",
          "Each setting weakens focal PCI durability, safety, or feasibility."),
        guide("complex-multivessel", "applied-core",
          "CABG is reasonable over PCI for complex or diffuse multivessel disease to confer a survival advantage.",
          "mechanism-decision",
          "For complex diffuse multivessel disease, the guideline favors {{c1::CABG over PCI}}.",
          "The 2021 recommendation is Class 2a and is illustrated by a SYNTAX score above 33.",
          Object.assign(REVASC(), { recommendationClass: "2a", evidenceLevel: "B-R" })),
        guide("dapt-adherence", "applied-core",
          "When a patient cannot access, tolerate, or adhere to DAPT, CABG is reasonable over PCI.",
          "mechanism-decision",
          "If prolonged DAPT is not feasible, revascularization should favor {{c1::CABG over PCI}}.",
          "A coronary graft does not depend on prolonged dual-antiplatelet adherence to prevent stent thrombosis.",
          Object.assign(REVASC(), { recommendationClass: "2a", evidenceLevel: "B-NR" }))
      ]),
      unit("When PCI Is Preferred: Previous CABG", [
        guide("patent-lima", "applied-core",
          "With a patent LIMA-to-LAD and feasible anatomy, PCI is reasonable over redo CABG for repeat revascularization.",
          "mechanism-decision",
          "After CABG with a patent LIMA-to-LAD, feasible repeat revascularization favors {{c1::PCI}}.",
          "Redo sternotomy endangers the functioning mammary graft and carries higher operative risk.",
          Object.assign(REVASC(), { recommendationClass: "2a", evidenceLevel: "B-NR" })),
        guide("lad-redo", "applied-core",
          "For refractory LAD angina after prior CABG, redo CABG is reasonable when an internal mammary conduit is available.",
          "mechanism-decision",
          "After prior CABG, refractory LAD disease with available IMA favors {{c1::redo CABG}}.",
          "A new internal-mammary graft can provide durable inflow when PCI cannot adequately treat the LAD territory.",
          Object.assign(REVASC(), { recommendationClass: "2a", evidenceLevel: "B-NR" })),
        mechanism("redo-hazard", "core", "rescue",
          "A patent LIMA crossing the midline can be lacerated during repeat sternotomy.",
          "During redo entry, the catastrophic graft hazard is {{c1::lacerating a patent LIMA}}.",
          "Preoperative imaging and a re-entry plan must map the graft before the posterior sternal table is divided.")
      ])
    ],

    "d6-conduits": [
      unit("Why Conduit Choice Determines CABG Durability", [
        mapping("durability-hierarchy", "core", "model",
          "CABG conduit durability ranks internal mammary artery first, radial artery second, and saphenous vein last.", 3,
          "Conduit durability ranks as {{c1::IMA → highest; radial → intermediate; saphenous vein → lowest}}.",
          "Arterial conduits tolerate systemic pressure and resist intimal hyperplasia better than vein grafts."),
        numeric("lima-ten-year", "core",
          "LIMA-to-LAD patency is approximately 95 percent at ten years.",
          "At ten years, LIMA-to-LAD patency is about {{c1::95%}}.",
          "The most durable conduit is therefore assigned to the highest-value LAD territory.",
          meta("approximately", 95, "%", "LIMA-to-LAD patency at ten years", "approximate")),
        numeric("vein-decline", "enrichment",
          "Saphenous-vein patency falls from roughly 61 percent at ten years to 32 percent at fifteen years.",
          "SVG patency falls from about {{c1::61% at 10 years versus 32% at 15}}.",
          "This late decline explains why arterial revascularization improves lifetime durability.",
          meta("comparison", "61% at 10 years to 32% at 15 years", "%", "saphenous-vein graft patency", "approximate"))
      ]),
      unit("LIMA to LAD: The Gold Standard", [
        bounded("protective-biology", "core", "bounded-set",
          "The internal mammary artery resists thrombosis and atherosclerosis through protective wall and endothelial biology.", 4,
          "LIMA durability reflects {{c1::nitric oxide; prostacyclin; intact elastic lamina; low smooth-muscle proliferation}}.",
          "These features reduce platelet activation, intimal hyperplasia, vasospasm, and atherosclerosis."),
        guide("lima-lad", "applied-core",
          "An internal mammary artery should be used for LAD bypass when feasible.",
          "mechanism-decision",
          "When the LAD is bypassed, the conduit of choice is the {{c1::internal mammary artery}}.",
          "The guideline assigns Class 1 because this strategy improves survival and reduces recurrent ischemia.",
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "B-NR" })),
        numeric("lima-twenty-year", "enrichment",
          "LIMA-to-LAD patency remains above 85 percent at twenty years.",
          "At twenty years, LIMA-to-LAD patency remains {{c1::above 85%}}.",
          "Few other conduits retain comparable long-term function.",
          meta("greater-than", 85, "%", "LIMA-to-LAD patency at twenty years", "approximate"))
      ]),
      unit("Right Internal Mammary Artery (RIMA) and Bilateral IMA Grafting", [
        mechanism("sternal-risk", "core", "mechanism",
          "Bilateral pedicled mammary harvest increases deep sternal infection by reducing sternal blood supply.",
          "Bilateral pedicled IMA harvest raises wound risk by {{c1::devascularizing the sternum}}.",
          "The risk is greatest in patients with diabetes or obesity."),
        contrast("skeletonization", "applied-core", "comparison",
          "Skeletonized IMA harvest preserves more sternal perfusion than pedicled harvest.",
          "Compared with pedicled harvest, skeletonization {{c1::preserves more sternal blood supply}}.",
          "It also provides additional conduit length and is preferred when bilateral mammaries are selected."),
        numeric("art-crossover", "enrichment",
          "Approximately 40 percent crossover diluted the ART trial's bilateral-versus-single IMA comparison.",
          "The ART intention-to-treat result was diluted by about {{c1::40% crossover}}.",
          "The neutral headline does not erase the biological durability advantage of a second arterial conduit.",
          meta("approximately", 40, "%", "ART trial treatment crossover", "approximate"))
      ]),
      unit("Radial Artery", [
        mechanism("spasm", "core", "mechanism",
          "The radial artery's thick muscular media makes it prone to conduit spasm.",
          "Radial-graft spasm reflects its {{c1::thick muscular arterial media}}.",
          "Gentle harvest and vasodilator therapy are therefore essential."),
        numeric("competitive-flow", "applied-core",
          "Radial graft occlusion was 5.9 percent with greater-than-90-percent targets versus 11.8 percent with 70-to-89-percent targets.",
          "Radial occlusion was {{c1::5.9% versus 11.8%}} for tighter versus moderate targets.",
          "The radial artery should be assigned to a severely stenosed target to avoid competitive native flow.",
          meta("comparison", "5.9% versus 11.8%", "%", "radial occlusion by target stenosis", "exact")),
        guide("radial-best-practices", "applied-core",
          "Radial harvest requires adequate ulnar compensation and should avoid instrumented or future-dialysis arms.",
          "bounded-set",
          "Radial-conduit safeguards are {{c1::confirm ulnar flow; avoid prior radial access; preserve dialysis access; use a tight target}}.",
          "The guideline also advises an oral calcium-channel blocker during the first postoperative year.",
          Object.assign(REVASC(), { recommendationClass: "Best practice", evidenceLevel: "C-EO" }),
          { answerCount: 4, ordered: false })
      ]),
      unit("Greater Saphenous Vein (GSV): Pros and Cons", [
        mapping("failure-phases", "core", "model",
          "Vein-graft disease progresses from early intimal hyperplasia to later accelerated atherosclerosis.", 2,
          "SVG failure phases map as {{c1::years 1–2 → intimal hyperplasia; after years 3–5 → atherosclerosis}}.",
          "Arterial pressure first provokes wall remodeling, then the injured vein develops aggressive lipid disease."),
        mechanism("no-touch", "applied-core", "mechanism",
          "No-touch vein harvest improves durability by preserving endothelium and perivascular tissue.",
          "No-touch SVG harvest improves patency by {{c1::avoiding endothelial and wall injury}}.",
          "Forceps trauma, stretching, and overdistension seed thrombosis and later intimal hyperplasia."),
        numeric("no-touch-patency", "enrichment",
          "No-touch saphenous-vein patency was 90 percent versus 76 percent after conventional harvest at 8.5 years.",
          "At 8.5 years, no-touch versus conventional SVG patency was {{c1::90% versus 76%}}.",
          "The result approaches arterial-graft durability when the vein is handled without trauma.",
          meta("comparison", "90% versus 76%", "%", "SVG patency at 8.5 years", "exact"))
      ]),
      unit("Post-CABG Aspirin and SVG Patency Evidence", [
        guideNumeric("aspirin-dose-time", "applied-core",
          "After CABG, aspirin 100 to 325 milligrams should begin within six hours and continue indefinitely.",
          "Post-CABG aspirin is {{c1::100–325 mg within 6 hours}}.",
          "Early irreversible platelet inhibition protects the fresh vein-graft anastomosis and reduces SVG closure.",
          meta("range", [100, 325], "mg", "post-CABG aspirin started within six hours", "exact"),
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "A" })),
        numeric("prevent-iv", "enrichment",
          "PREVENT IV found that approximately 40 percent of saphenous-vein grafts failed by one year.",
          "By one year in PREVENT IV, about {{c1::40% of SVGs}} had failed.",
          "Many failures were asymptomatic, reinforcing early antiplatelet therapy and durable conduit selection.",
          meta("approximately", 40, "%", "SVG failure by one year in PREVENT IV", "approximate")),
        contrast("drug-timing", "core", "comparison",
          "Aspirin targets early thrombosis, whereas statins target later lipid-driven vein-graft disease.",
          "In SVG protection, aspirin acts early, whereas statins target {{c1::later atherosclerotic failure}}.",
          "The therapies are complementary because they act on different phases of graft disease.")
      ]),
      unit("Senior reasoning: reading the coronary map and designing the operation", [
        numeric("target-caliber", "applied-core",
          "A graftable coronary target generally exceeds 1.5 millimeters and supplies viable myocardium with usable runoff.",
          "A coronary target is generally graftable above {{c1::1.5 mm diameter}}.",
          "Caliber alone is insufficient; the distal vessel must also be viable, non-diffusely diseased, and have runoff.",
          meta("greater-than", 1.5, "mm", "graftable coronary target diameter", "approximate")),
        mechanism("string-sign", "core", "mechanism",
          "Native competitive flow can collapse the gradient across an arterial graft and cause string-sign failure.",
          "A moderately stenosed native vessel can occlude an arterial graft through {{c1::competitive flow}}.",
          "Low trans-graft flow promotes spasm, stringing, and eventual occlusion."),
        mapping("inflow-options", "core", "model",
          "In-situ, composite, and sequential grafting solve different inflow and conduit-length problems.", 3,
          "CABG inflow options map as {{c1::in-situ → native inflow; Y/T composite → anaortic reach; sequential → multiple targets}}.",
          "Sequential grafts conserve conduit but share proximal inflow jeopardy.")
      ]),
      unit("The Guideline's Conduit Recommendations and Best Practices", [
        guide("conduit-hierarchy", "core",
          "The guideline prioritizes IMA-to-LAD, radial-to-second target, and selected bilateral mammary grafting.",
          "mapping-set",
          "Guideline conduit roles map as {{c1::IMA → LAD; radial → second target; BIMA → selected patients}}.",
          "Durability is matched to myocardial importance while wound and competitive-flow risks are controlled.",
          Object.assign(REVASC(), { recommendationClass: "1 / 1 / 2a", evidenceLevel: "B-NR / B-R / B-NR" }),
          { answerCount: 3, ordered: false }),
        guide("radial-avoid", "applied-core",
          "The radial artery should be avoided after transradial instrumentation and when future dialysis access is likely.",
          "bounded-set",
          "Guideline radial-conduit exclusions are {{c1::prior radial catheterization; likely future dialysis access}}.",
          "Both situations jeopardize conduit quality or consume an artery needed for an arteriovenous fistula.",
          Object.assign(REVASC(), { recommendationClass: "Best practice", evidenceLevel: "C-EO" }),
          { answerCount: 2, ordered: false }),
        guide("harvest-practice", "applied-core",
          "Skeletonized mammary harvest reduces sternal risk, while no-touch vein harvest improves graft durability when wound risk permits.",
          "contrast",
          "For conduit harvest, skeletonization protects the sternum, whereas {{c1::no-touch technique protects the vein}}.",
          "Technique is chosen according to sternal-wound risk and the need to preserve graft endothelium.",
          Object.assign(REVASC(), { recommendationClass: "Best practice", evidenceLevel: "C-EO" }))
      ]),
      unit("Hybrid Coronary Revascularization", [
        mapping("hybrid-plan", "core", "model",
          "Hybrid revascularization combines minimally invasive LIMA-to-LAD grafting with PCI of non-LAD vessels.", 2,
          "Hybrid revascularization maps as {{c1::LAD → LIMA graft; non-LAD vessels → PCI}}.",
          "It preserves the most durable graft where it matters most while avoiding vein grafts and aortic manipulation."),
        mechanism("hybrid-selection", "applied-core", "mechanism",
          "Hybrid revascularization is attractive when a durable LIMA-to-LAD is desired and non-LAD anatomy suits PCI.",
          "A calcified aorta can favor hybrid treatment because it {{c1::avoids proximal aortic graft work}}.",
          "Evidence remains less robust than for conventional CABG, so selection requires a Heart Team and local expertise.")
      ])
    ],

    "d6-technique": [
      unit("On-Pump CABG: The Standard Approach", [
        contrast("benefit-cost", "core", "comparison",
          "On-pump CABG creates a still protected field but adds inflammatory, embolic, hemodilution, and coagulation injury.",
          "On-pump CABG improves technical precision, but adds {{c1::circuit and aortic-manipulation injury}}.",
          "The balance favors CPB when complete durable revascularization outweighs the patient's circuit or aortic risk."),
        numeric("heparin-dose", "applied-core",
          "The lesson uses approximately 300 units per kilogram of heparin before bypass cannulation.",
          "Before CABG cannulation, heparin is about {{c1::300 U/kg}}.",
          "Anticoagulation must be confirmed by the institutional ACT target before cannulation.",
          meta("approximately", 300, "U/kg", "pre-CPB heparin dose", "institution-dependent")),
        numeric("act-target", "applied-core",
          "The lesson targets an activated clotting time above 450 seconds for full bypass.",
          "Before full CPB, ACT should exceed {{c1::450 seconds}}.",
          "ACT confirms sufficient anticoagulation before cannulation and full circuit flow.",
          meta("greater-than", 450, "seconds", "full-CPB anticoagulation", "institution-dependent")),
        numeric("pump-flow", "core",
          "Typical indexed bypass flow is approximately 2.4 liters per minute per square meter.",
          "Typical full-bypass flow is about {{c1::2.4 L/min/m²}}.",
          "Flow is individualized to temperature, metabolic demand, venous saturation, pressure, and organ perfusion.",
          meta("approximately", 2.4, "L/min/m²", "adult full-CPB flow", "institution-dependent"))
      ]),
      unit("Off-Pump CABG (OPCAB)", [
        bounded("candidate-set", "core", "bounded-set",
          "Off-pump CABG is selectively useful for a calcified aorta, severe aortic atheroma, pulmonary hypertension, or prior radiation.", 4,
          "Selective off-pump candidates include {{c1::porcelain aorta; shaggy aorta; severe pulmonary hypertension; prior mediastinal radiation}}.",
          "The technique should be used by experienced teams when bypass or aortic manipulation is the dominant hazard."),
        mechanism("technical-trade", "core", "mechanism",
          "Off-pump CABG avoids circuit injury but increases technical difficulty and incomplete-revascularization risk.",
          "Off-pump CABG trades circuit injury for {{c1::greater anastomotic technical difficulty}}.",
          "Its benefit disappears if graft quality or completeness is sacrificed."),
        numeric("ttf-flow", "applied-core",
          "The lesson considers transit-time graft flow above 15 milliliters per minute acceptable.",
          "Acceptable graft mean flow is {{c1::above 15 mL/min}}.",
          "Low flow requires interpretation with pulsatility, diastolic fraction, target quality, and hemodynamics.",
          meta("greater-than", 15, "mL/min", "CABG transit-time mean graft flow", "institution-dependent")),
        numeric("ttf-pi", "applied-core",
          "The lesson considers a transit-time pulsatility index below five acceptable.",
          "Acceptable graft pulsatility index is {{c1::below 5}}.",
          "A high index with low flow should prompt inspection for a technical obstruction or poor runoff.",
          meta("less-than", 5, "dimensionless", "CABG transit-time pulsatility index", "institution-dependent")),
        numeric("ttf-diastolic", "applied-core",
          "The lesson expects a left-sided graft diastolic fraction above 50 percent.",
          "A left-sided graft should have diastolic fraction {{c1::above 50%}}.",
          "A diastolic-dominant waveform supports unobstructed coronary graft flow.",
          meta("greater-than", 50, "%", "left-sided CABG graft diastolic fraction", "institution-dependent"))
      ]),
      unit("CORONARY Trial (2012): A Contrasting View", [
        contrast("experience", "core", "evidence",
          "CORONARY used experienced off-pump teams, whereas ROOBY allowed much less operator experience.",
          "CORONARY required experienced operators, whereas ROOBY included {{c1::lower-volume off-pump surgeons}}.",
          "Operator and center volume explain much of the discordance between the trial results."),
        numeric("crash-conversion", "applied-core",
          "Emergency crash conversion from off-pump to bypass carries approximately 6 to 15 percent mortality.",
          "Crash conversion to bypass carries about {{c1::6–15% mortality}}.",
          "A controlled elective conversion is safer than persisting until profound hemodynamic collapse.",
          meta("range", [6, 15], "%", "emergency OPCAB-to-CPB conversion mortality", "approximate")),
        contrast("outcome-synthesis", "core", "evidence",
          "Off-pump CABG reduces early transfusion and kidney injury but has no established mortality advantage.",
          "Compared with on-pump CABG, off-pump reduces early morbidity but {{c1::does not improve survival}}.",
          "Any short-term physiologic benefit must not come at the cost of incomplete revascularization or lower graft patency.")
      ]),
      unit("Current Consensus on Off-Pump CABG", [
        contrast("selection", "core", "comparison",
          "Off-pump CABG suits aortic or circuit hazards, whereas on-pump CABG suits complex complete revascularization.",
          "Off-pump suits pump-related hazards, whereas on-pump suits {{c1::complex complete revascularization}}.",
          "Technique is matched to the patient's dominant risk and the team's expertise."),
        mechanism("beating-heart-middle", "applied-core", "mechanism",
          "On-pump beating-heart CABG provides circulatory support without cross-clamp or cardioplegic arrest.",
          "In a severely impaired LV, on-pump beating-heart CABG can {{c1::support circulation without arrest}}.",
          "It is an intermediate option when the heart will not tolerate positioning but cross-clamp arrest is undesirable.")
      ]),
      unit("CABG Operative Sequence: Overview", [
        ordered("sequence-first", "core",
          "Early CABG steps establish access, conduits, anticoagulation, cannulation, and bypass.", 5,
          "The first CABG phases are {{c1::sternotomy; conduit harvest; heparinization; cannulation; establish bypass}}.",
          "Teams may harvest conduits in parallel, but bypass cannot begin until access, anticoagulation, and cannulation are secure."),
        ordered("sequence-second", "core",
          "Later CABG steps construct grafts, reperfuse, separate from bypass, reverse heparin, and close.", 5,
          "The later CABG phases are {{c1::distal grafts; proximal grafts; reperfuse and wean; protamine and hemostasis; closure}}.",
          "Distal graft quality determines revascularization; hemostasis is reassessed after reversal before final closure."),
        numeric("arteriotomy-length", "applied-core",
          "The coronary arteriotomy is made at least 1.5 times the target lumen diameter.",
          "CABG arteriotomy length is at least {{c1::1.5 times target diameter}}.",
          "Adequate length creates a generous landing zone while avoiding plaque that could force endarterectomy.",
          meta("greater-than-or-equal", 1.5, "times target diameter", "coronary arteriotomy length", "approximate")),
        contrast("graft-order", "applied-core", "comparison",
          "The most ischemic territory is grafted early, whereas LITA-to-LAD is commonly sewn last to protect it from disruption.",
          "The most ischemic territory is grafted first, whereas LITA-to-LAD is {{c1::usually sewn last}}.",
          "Completed early grafts can deliver cardioplegia; delaying LITA-to-LAD reduces traction on the key anastomosis.")
      ]),
      unit("PGY-5 mastery: the intraoperative surprises and their rescues", [
        mapping("surprise-rescue", "applied-core", "rescue",
          "A porcelain aorta requires anaortic conversion, while a new regional wall-motion abnormality requires graft interrogation.", 2,
          "CABG surprises map as {{c1::porcelain aorta → anaortic strategy; new RWMA → interrogate graft}}.",
          "Both situations demand correction of a mechanical hazard rather than persevering with the original plan."),
        mechanism("rwma-response", "applied-core", "rescue",
          "A new territory-specific wall-motion abnormality after bypass separation is a graft problem until proven otherwise.",
          "After CABG, a new regional wall-motion abnormality requires {{c1::graft assessment before more inotrope}}.",
          "Check transit-time flow, graft lie, de-airing, spasm, and the anastomosis; revise or return to bypass when needed.")
      ]),
      unit("Before you scrub for a CABG case: the six things to know", [
        bounded("precase-one", "core", "bounded-set",
          "CABG preparation begins with the coronary map, ventricular function, and conduit plan.", 3,
          "Before CABG, know the {{c1::coronary targets; LV function; conduit plan}}.",
          "These facts determine graft count, support strategy, myocardial protection, and harvest."),
        bounded("precase-two", "core", "bounded-set",
          "CABG preparation also requires antithrombotic timing, renal function, and case urgency.", 3,
          "Before CABG, also know the {{c1::antithrombotic history; renal function; operative urgency}}.",
          "They determine bleeding risk, contrast and kidney risk, timing, and the consent conversation.")
      ]),
      unit("Perioperative Programs and CPB Decisions (2021 Guideline)", [
        guide("system-set", "core",
          "Guideline CABG systems include enhanced recovery, concomitant revascularization, epiaortic imaging, and anaortic technique for calcification.",
          "bounded-set",
          "CABG system recommendations include {{c1::enhanced recovery; concomitant CABG; epiaortic ultrasound; anaortic technique}}.",
          "The operation's quality depends on perioperative systems and deliberate avoidance of atheroembolic hazards.",
          Object.assign(REVASC(), { recommendationClass: "1 / 1 / 2a / 2a", evidenceLevel: "B-R / C-LD" }),
          { answerCount: 4, ordered: false }),
        guide("pulmonary-offpump", "applied-core",
          "For significant pulmonary disease, experienced teams may use off-pump CABG to reduce perioperative risk.",
          "mechanism-decision",
          "With significant pulmonary disease, an experienced team may select {{c1::off-pump CABG}}.",
          "This is a targeted Class 2b option, not a universal claim that off-pump surgery is superior.",
          Object.assign(REVASC(), { recommendationClass: "2b", evidenceLevel: "B-R" }))
      ]),
      unit("Glycemic Control and Sternal Wound Prevention", [
        guideNumeric("glucose-target", "applied-core",
          "Continuous insulin should maintain perioperative glucose below 180 milligrams per deciliter while avoiding hypoglycemia.",
          "CABG glucose control targets {{c1::below 180 mg/dL}}.",
          "The goal reduces deep sternal wound infection without exposing patients to unnecessarily tight control.",
          meta("less-than", 180, "mg/dL", "intraoperative and early postoperative CABG glucose", "exact"),
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "B-R" })),
        contrast("tight-target", "applied-core", "guideline",
          "The evidence-based target is below 180 milligrams per deciliter, whereas targeting below 140 has uncertain usefulness.",
          "For CABG glycemia, target below 180, whereas below 140 is {{c1::not routinely justified}}.",
          "Tighter treatment increases hypoglycemia risk without established added benefit.",
          { guideline: Object.assign(REVASC(), { recommendationClass: "2b", evidenceLevel: "B-R" }), reviewBy: REVIEW_BY })
      ]),
      unit("Antiplatelet Management Around CABG", [
        guide("elective-p2y12", "applied-core",
          "Before elective CABG, clopidogrel, ticagrelor, and prasugrel require different washout intervals.",
          "mapping-set",
          "Elective CABG washout maps as {{c1::clopidogrel → 5 days; ticagrelor → 3 days; prasugrel → 7 days}}.",
          "The timing balances platelet recovery against ongoing ischemic risk.",
          Object.assign(REVASC(), { recommendationClass: "2a", evidenceLevel: "B-NR" }),
          { answerCount: 3, ordered: false }),
        guideNumeric("urgent-p2y12", "applied-core",
          "For urgent CABG, clopidogrel and ticagrelor should be stopped for at least 24 hours when feasible.",
          "Before urgent CABG, clopidogrel or ticagrelor should stop for {{c1::at least 24 hours}}.",
          "This reduces major bleeding while avoiding a prolonged delay in urgent revascularization.",
          meta("greater-than-or-equal", 24, "hours", "urgent CABG P2Y12 discontinuation", "exact"),
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "B-NR" })),
        guideNumeric("postop-aspirin", "applied-core",
          "After CABG, aspirin 100 to 325 milligrams should start within six hours and continue indefinitely.",
          "After CABG, aspirin should be {{c1::100–325 mg within 6 hours}}.",
          "Early treatment reduces saphenous-vein graft closure.",
          meta("range", [100, 325], "mg", "post-CABG aspirin within six hours", "exact"),
          Object.assign(REVASC(), { recommendationClass: "1", evidenceLevel: "A" })),
        contrast("preop-aspirin", "core", "guideline",
          "Existing aspirin is continued to CABG, whereas immediate preoperative aspirin should not be newly started in aspirin-naive elective patients.",
          "Before elective CABG, continue existing aspirin, whereas aspirin-naive patients should {{c1::not start it immediately preoperatively}}.",
          "The latter strategy adds bleeding without benefit; postoperative aspirin is the proven graft-protective intervention.",
          { guideline: Object.assign(REVASC(), { recommendationClass: "1 / 3 No Benefit", evidenceLevel: "B-R" }), reviewBy: REVIEW_BY })
      ])
    ],

    "d7-savr": [
      unit("The Landscape of Aortic Valve Replacement", [
        contrast("two-decisions", "core", "comparison",
          "Aortic-valve treatment separates the access decision from the prosthesis-material decision.",
          "SAVR versus TAVR chooses delivery, whereas mechanical versus tissue chooses {{c1::durability versus anticoagulation}}.",
          "Keeping these questions separate makes age, anatomy, concomitant disease, and patient preference easier to integrate."),
        ordered("mechanical-evolution", "enrichment",
          "Mechanical valves evolved from obstructive ball-and-cage designs to tilting discs and then bileaflet valves.", 3,
          "Mechanical-valve design evolved as {{c1::ball-and-cage; tilting disc; bileaflet valve}}.",
          "Modern bileaflet designs provide more central flow, lower gradients, and lower thrombogenicity than earlier designs."),
        contrast("prosthesis-trade", "core", "model",
          "Mechanical valves provide indefinite durability but require warfarin, whereas tissue valves deteriorate without lifelong anticoagulation.",
          "Mechanical valves last but require warfarin, whereas tissue valves {{c1::avoid warfarin but deteriorate}}.",
          "The patient's expected lifespan, bleeding risk, and willingness to accept reintervention determine which burden is preferable.")
      ]),
      unit("Factors Favoring SAVR Over TAVR", [
        bounded("savr-factors", "core", "bounded-set",
          "Young age, bicuspid anatomy, unsuitable transcatheter anatomy, concomitant surgery, and a small annulus favor SAVR.", 5,
          "SAVR-favoring factors include {{c1::young age; bicuspid valve; unsuitable TAVR anatomy; concomitant cardiac surgery; small annulus}}.",
          "Open surgery permits leaflet excision, annular enlargement, coronary bypass, root work, and other valve procedures."),
        numeric("coronary-height", "applied-core",
          "A left-main coronary height below approximately 10 to 12 millimeters raises TAVR obstruction concern.",
          "TAVR coronary-obstruction concern rises below {{c1::10–12 mm}} coronary height.",
          "A displaced native leaflet may curtain a low ostium during transcatheter deployment.",
          meta("range", [10, 12], "mm", "left-main height from TAVR annular plane", "approximate")),
        mechanism("small-annulus", "applied-core", "mechanism",
          "SAVR can prevent small-annulus prosthesis mismatch by enlarging the annulus or choosing a supra-annular prosthesis.",
          "A small annulus favors surgery because SAVR can {{c1::enlarge the annulus directly}}.",
          "TAVR cannot perform a Nicks or Manouguian enlargement when the projected effective orifice is inadequate.")
      ]),
      unit("Mechanical Valves: Durability with a Cost", [
        mechanism("thrombogenicity", "core", "mechanism",
          "Synthetic surfaces and hinge turbulence make mechanical valves intrinsically thrombogenic.",
          "Mechanical valves require lifelong warfarin because {{c1::synthetic surfaces activate coagulation}}.",
          "The modern prosthesis rarely wears out; stable anticoagulation determines long-term safety."),
        mapping("position-inr", "applied-core", "comparison",
          "Mechanical-valve anticoagulation targets are higher in the mitral than the aortic position.", 2,
          "Mechanical-valve INR maps as {{c1::aortic → 2.0–3.0; mitral → 2.5–3.5}}.",
          "Lower velocity and greater stasis around a mitral prosthesis increase thrombosis risk.",
          { numeric: meta("mapping", "aortic 2.0–3.0 / mitral 2.5–3.5", "INR", "mechanical-valve position", "institution-dependent"), reviewBy: REVIEW_BY }),
        guideNumeric("onx-inr", "enrichment",
          "Selected On-X mechanical aortic valves may use an INR target of 1.5 to 2.0 with aspirin after the initial period.",
          "The selected On-X aortic target is {{c1::INR 1.5–2.0}} with aspirin.",
          "This lower target is unique to selected On-X aortic prostheses used with aspirin after initial therapy.",
          meta("range", [1.5, 2], "INR", "selected On-X mechanical aortic valve", "exact"),
          Object.assign(VALVE(), { recommendationClass: "2b", evidenceLevel: "B-R" })),
        mechanism("variability", "core", "mechanism",
          "Mechanical-valve events cluster during INR instability rather than during stable anticoagulation.",
          "For mechanical valves, the strongest anticoagulation hazard is {{c1::INR variability}}.",
          "Home testing and careful transitions reduce time outside the therapeutic range.")
      ]),
      unit("Bioprosthetic Valves: Freedom from Anticoagulation", [
        mechanism("svd-biology", "core", "mechanism",
          "Glutaraldehyde fixation prevents tissue repair and promotes progressive bioprosthetic leaflet calcification.",
          "Bioprosthetic deterioration occurs because fixation {{c1::kills cells and prevents repair}}.",
          "The leaflets progressively calcify, stiffen, tear, or perforate over time."),
        numeric("svd-twelve-year", "enrichment",
          "Contemporary surgical tissue valves provide approximately 90 percent freedom from structural deterioration at 12 years.",
          "At 12 years, freedom from tissue-valve SVD is about {{c1::90%}}.",
          "The curve worsens later and declines faster in younger patients.",
          meta("approximately", 90, "%", "freedom from surgical bioprosthetic SVD at 12 years", "approximate")),
        numeric("reoperation-fifteen", "enrichment",
          "Freedom from bioprosthetic reoperation is approximately 70 percent at 15 years in the lesson data.",
          "At 15 years, freedom from tissue-valve reoperation is about {{c1::70%}}.",
          "The late decline makes a tissue valve more likely to require another intervention in younger patients.",
          meta("approximately", 70, "%", "freedom from bioprosthetic reoperation at 15 years", "approximate")),
        contrast("age-trade", "core", "comparison",
          "Older patients often outlive tissue-valve durability, whereas younger patients face substantial lifetime reintervention risk.",
          "Tissue valves fit older patients, whereas younger patients face {{c1::higher lifetime reintervention risk}}.",
          "Age informs but does not replace shared decisions about bleeding, pregnancy, lifestyle, and future valve-in-valve feasibility.")
      ]),
      unit("The Age Threshold Debate and Valve-in-Valve TAVR", [
        guide("age-bands", "applied-core",
          "Aortic prosthesis choice generally favors mechanical valves below 50, tissue valves above 65, and shared decision-making between.",
          "mapping-set",
          "Aortic prosthesis age bands map as {{c1::under 50 → mechanical; 50–65 → individualized; over 65 → tissue}}.",
          "Age is a proxy for valve lifetime; anticoagulation suitability and future intervention anatomy remain decisive.",
          Object.assign(VALVE(), { recommendationClass: "1 shared decision", evidenceLevel: "C-LD" }),
          { answerCount: 3, ordered: false,
            numeric: meta("mapping", "under 50 / 50–65 / over 65", "years", "aortic prosthesis selection", "approximate") }),
        mechanism("valve-in-valve-gradient", "core", "mechanism",
          "Valve-in-valve TAVR can leave a high residual gradient when nested inside a small surgical prosthesis.",
          "A small surgical valve can undermine valve-in-valve TAVR through {{c1::prosthesis-patient mismatch}}.",
          "The initial surgeon should implant the largest suitable tissue valve and enlarge the annulus when necessary."),
        contrast("lifetime-strategy", "core", "comparison",
          "Mechanical SAVR avoids reintervention, whereas tissue SAVR accepts a future valve-in-valve sequence.",
          "Mechanical SAVR is durable once, whereas tissue SAVR plans {{c1::a future valve-in-valve pathway}}.",
          "The tissue strategy only works when annular size and coronary anatomy permit safe nested valves.")
      ]),
      unit("Senior reasoning: narrating SAVR step-by-step with the hazard at each step", [
        ordered("savr-sequence", "core",
          "SAVR proceeds through aortotomy, leaflet excision, controlled decalcification, sizing, and prosthesis seating before de-airing.", 5,
          "Core SAVR steps are {{c1::aortotomy; excise leaflets; decalcify annulus; size prosthesis; seat and secure valve}}.",
          "Each step protects adjacent structures and prepares a stable, unobstructed sewing plane."),
        mechanism("conduction-zone", "applied-core", "rescue",
          "Deep sutures near the right-noncoronary commissure can injure the His bundle and cause complete heart block.",
          "At the right-noncoronary commissure, shallow bites protect the {{c1::His bundle}}.",
          "The membranous septum and conduction axis lie immediately beneath this annular region."),
        mapping("ppm-thresholds", "applied-core", "model",
          "Indexed effective-orifice thresholds define moderate and severe aortic prosthesis-patient mismatch.", 2,
          "Aortic PPM maps as {{c1::moderate → below 0.85 cm²/m²; severe → below 0.65 cm²/m²}}.",
          "Projected indexed EOA should be checked before accepting a small prosthesis.",
          { numeric: meta("mapping", "below 0.85 / below 0.65", "cm²/m²", "moderate/severe aortic PPM", "approximate"), reviewBy: REVIEW_BY }),
        mechanism("right-coronary-air", "applied-core", "rescue",
          "Residual air preferentially enters the anterior right coronary ostium and can cause inferior dysfunction and RV distension.",
          "After SAVR, inferior dysfunction should prompt concern for {{c1::right-coronary air embolism}}.",
          "Root venting, lung inflation, table positioning, and TEE guide complete de-airing before separation.")
      ]),
      unit("PGY-5 mastery: the small annulus and the valve larger than the root", [
        mapping("enlargement-map", "applied-core", "model",
          "Nicks, Manouguian, and Konno enlargements extend through different structures for progressively greater upsizing.", 3,
          "Annular enlargement maps as {{c1::Nicks → noncoronary sinus; Manouguian → anterior mitral leaflet; Konno → ventricular septum}}.",
          "The anatomy and required upsizing determine which enlargement is justified."),
        mechanism("avoid-mismatch", "applied-core", "mechanism",
          "An active patient with a small annulus should receive a larger effective orifice rather than severe residual mismatch.",
          "For a small active patient, avoid severe mismatch using {{c1::supra-annular sizing or root enlargement}}.",
          "Accepting a very small prosthesis leaves a fixed residual obstruction for the life of the valve.")
      ]),
      unit("Before you scrub for a valve case: the five things to know", [
        bounded("precase-five", "core", "bounded-set",
          "Valve-case preparation requires pathology, echo severity, operative plan, concomitant coronary disease, and anticipated protection time.", 5,
          "Before valve surgery, know the {{c1::valve pathology; echo severity; repair-or-replace plan; concomitant coronary disease; anticipated clamp time}}.",
          "These facts frame every decision about exposure, prosthesis, additional procedures, and myocardial protection.")
      ])
    ],

    "d7-tavr": [
      unit("The TAVR Revolution: Evidence Across Risk Strata", [
        mapping("device-map", "core", "model",
          "SAPIEN is a short balloon-expandable intra-annular valve, whereas Evolut is a tall self-expanding supra-annular valve.", 2,
          "TAVR platforms map as {{c1::SAPIEN → balloon-expandable; Evolut → self-expanding}}.",
          "Frame height, radial force, and deployment mechanics shape leak, conduction, and positioning risks."),
        mechanism("self-expanding-conduction", "core", "mechanism",
          "A deeper, taller self-expanding frame compresses the conduction axis more than a short balloon-expandable frame.",
          "Self-expanding TAVR causes more pacing because its frame {{c1::extends deeper along the septum}}.",
          "The His-Purkinje system lies immediately below the right-noncoronary annular region."),
        contrast("trial-design", "core", "evidence",
          "Most TAVR trials demonstrated noninferiority, whereas PARTNER 3 demonstrated short-term superiority.",
          "Most TAVR trials showed noninferiority, whereas PARTNER 3 showed {{c1::one-year superiority}}.",
          "A noninferiority result means not unacceptably worse within a margin, not proof that TAVR is better.")
      ]),
      unit("TAVR Evidence: High-Risk and Inoperable Patients", [
        numeric("partner1-mortality", "enrichment",
          "PARTNER 1 reported one-year mortality of 24.2 percent with TAVR and 26.8 percent with SAVR.",
          "PARTNER 1 one-year mortality was {{c1::24.2% TAVR versus 26.8% SAVR}}.",
          "The trial established TAVR as noninferior in high-risk surgical candidates.",
          meta("comparison", "24.2% TAVR versus 26.8% SAVR", "%", "PARTNER 1 one-year mortality", "exact")),
        numeric("partner1b-mortality", "core",
          "PARTNER 1B reduced one-year mortality from 50 percent with medical therapy to 30 percent with TAVR.",
          "PARTNER 1B mortality fell from {{c1::50% to 30%}} with TAVR.",
          "This superiority result established TAVR for patients considered inoperable.",
          meta("comparison", "50% to 30%", "%", "PARTNER 1B one-year mortality", "exact")),
        contrast("complication-trade", "core", "comparison",
          "Early TAVR caused more vascular injury, stroke, and paravalvular leak, whereas SAVR caused more bleeding and atrial fibrillation.",
          "Early TAVR caused more vascular complications, whereas SAVR caused {{c1::more bleeding and atrial fibrillation}}.",
          "Newer delivery systems reduced but did not erase the mechanistic differences between catheter and open approaches.")
      ]),
      unit("TAVR Evidence: Intermediate and Low-Risk Patients", [
        mapping("trial-hierarchy", "core", "evidence",
          "PARTNER 2 and SURTAVI studied intermediate risk; PARTNER 3 and Evolut Low Risk studied low risk.", 4,
          "TAVR risk trials map as {{c1::PARTNER 2 → intermediate; SURTAVI → intermediate; PARTNER 3 → low; Evolut → low}}.",
          "The program moved outward from inoperable to progressively healthier populations."),
        mapping("sts-bands", "applied-core", "model",
          "The lesson defines low, intermediate, and high surgical-risk trial bands by STS predicted mortality.", 3,
          "TAVR trial risk bands map as {{c1::low → below 4%; intermediate → 4–8%; high → at least 8%}}.",
          "Risk score does not replace anatomy, frailty, concomitant disease, or expected valve lifetime.",
          { numeric: meta("mapping", "below 4 / 4–8 / at least 8", "% STS", "TAVR trial surgical-risk strata", "approximate"), reviewBy: REVIEW_BY }),
        contrast("persistent-signals", "core", "evidence",
          "TAVR produces more pacemakers and paravalvular leak, whereas SAVR produces more bleeding, kidney injury, and atrial fibrillation.",
          "Across lower-risk trials, TAVR had more pacing, whereas SAVR had {{c1::more bleeding, AKI, and AF}}.",
          "Short follow-up and exclusion of many young bicuspid patients limit lifetime extrapolation.")
      ]),
      unit("TAVR Complications: The Essential Six", [
        bounded("complications-one", "core", "bounded-set",
          "TAVR can cause stroke, paravalvular leak, and conduction block requiring pacing.", 3,
          "Three major TAVR complications are {{c1::embolic stroke; paravalvular leak; permanent pacemaker requirement}}.",
          "They arise from manipulating calcified leaflets and seating a frame beside the annulus and conduction axis."),
        bounded("complications-two", "core", "bounded-set",
          "TAVR can also cause coronary obstruction, annular rupture, and vascular access injury.", 3,
          "Three additional TAVR complications are {{c1::coronary obstruction; annular rupture; vascular access injury}}.",
          "Gated CT anticipates coronary height, annular calcium, and iliofemoral access hazards."),
        mapping("pacemaker-rates", "enrichment", "comparison",
          "The lesson reports higher pacemaker rates with self-expanding than balloon-expandable valves.", 2,
          "TAVR pacemaker rates map as {{c1::self-expanding → 20–25%; balloon-expandable → 5–8%}}.",
          "Frame depth and platform design explain why pacemaker rates differ across devices.",
          { numeric: meta("mapping", "20–25 / 5–8", "%", "TAVR pacemaker rates by platform", "approximate"), reviewBy: REVIEW_BY }),
        mechanism("rbbb-risk", "applied-core", "mechanism",
          "Pre-existing right bundle-branch block makes left-sided conduction injury capable of producing complete heart block.",
          "After TAVR, pre-existing RBBB is dangerous because {{c1::new left-bundle injury completes the block}}.",
          "This anatomy explains intensive post-deployment rhythm monitoring and a low threshold for pacing.")
      ]),
      unit("Valve Durability: The Unsettled Question for TAVR", [
        mechanism("durability-window", "core", "mechanism",
          "Reassuring five-to-eight-year TAVR data do not answer durability in a young patient expected to live decades.",
          "TAVR durability remains uncertain because current follow-up {{c1::does not span a young lifetime}}.",
          "Surgical tissue valves also look durable early and deteriorate later, so short follow-up cannot settle the comparison."),
        contrast("lifetime-options", "core", "comparison",
          "Repeated tissue-valve nesting risks smaller effective orifices, whereas mechanical SAVR avoids structural reintervention.",
          "Tissue strategies permit valve-in-valve treatment, whereas mechanical SAVR offers {{c1::indefinite structural durability}}.",
          "The first valve must be chosen with annular size, coronary access, and the feasibility of future implants in mind.")
      ]),
      unit("The Heart Team in TAVR Decision-Making", [
        bounded("decision-factors", "core", "bounded-set",
          "The TAVR Heart Team integrates operative risk, frailty, CT anatomy, concomitant disease, and patient goals.", 5,
          "The TAVR Heart Team integrates {{c1::operative risk; frailty; CT feasibility; concomitant disease; patient preferences}}.",
          "No single specialty or score can fully resolve the access, durability, and procedural trade-offs."),
        mapping("access-map", "applied-core", "model",
          "Transfemoral is first-choice access; hostile iliofemoral anatomy prompts axillary, carotid, or direct aortic alternatives.", 4,
          "TAVR access maps as {{c1::favorable vessels → transfemoral; hostile femoral → axillary; selected anatomy → carotid; surgical access → transaortic}}.",
          "The chosen route should deliver the valve safely without creating a greater vascular or neurologic hazard.")
      ])
    ],

    "d7-mitral": [
      unit("Why Mitral Repair is the Gold Standard", [
        mechanism("chordal-continuity", "core", "mechanism",
          "Preserving chordae and papillary muscles maintains ventricular geometry and systolic efficiency.",
          "Mitral repair preserves LV function by maintaining {{c1::annular-papillary continuity}}.",
          "Removing the subvalvular apparatus converts the ventricle from a supported cone toward a less efficient sphere."),
        numeric("repairability", "enrichment",
          "Approximately 95 percent of degenerative mitral valves are repairable at experienced centers.",
          "Experienced centers repair about {{c1::95% of degenerative valves}}.",
          "Repairability is therefore an expected quality outcome rather than an exceptional technical achievement.",
          meta("approximately", 95, "%", "degenerative mitral repairability at experienced centers", "approximate")),
        bounded("repair-advantages", "core", "bounded-set",
          "Mitral repair lowers operative mortality, avoids prosthesis complications and anticoagulation, and preserves ventricular function.", 4,
          "Mitral-repair advantages include {{c1::lower operative mortality; preserved LV geometry; no prosthesis complications; no lifelong anticoagulation}}.",
          "These benefits depend on a durable repair performed by an experienced team.")
      ]),
      unit("Surgical Repair Techniques", [
        mapping("carpentier-map", "core", "model",
          "Carpentier Type I has normal motion, Type II excessive motion, and Type III restricted motion.", 3,
          "Carpentier motion maps as {{c1::Type I → normal; Type II → excessive; Type III → restricted}}.",
          "Functional motion classification links the observed lesion directly to a repair strategy."),
        mapping("lesion-technique", "applied-core", "model",
          "Posterior prolapse, anterior prolapse, annular dilation, and rheumatic fusion require different repair techniques.", 4,
          "Mitral lesions map as {{c1::posterior prolapse → resection; anterior prolapse → neochordae; annular dilation → ring; rheumatic fusion → commissurotomy}}.",
          "Repairs often combine leaflet correction with an annuloplasty ring."),
        ordered("repair-workflow", "core",
          "Degenerative mitral repair follows analysis, leaflet correction, annuloplasty, saline testing, and post-bypass TEE.", 5,
          "The mitral-repair workflow is {{c1::segmental analysis; leaflet repair; annuloplasty ring; saline test; post-bypass TEE}}.",
          "A repair is not complete until residual regurgitation, gradient, and systolic anterior motion are excluded.")
      ]),
      unit("Mitral Valve Replacement: When Repair Is Not Feasible", [
        bounded("replacement-indications", "core", "bounded-set",
          "Replacement is reserved for irreparable rheumatic disease, failed repair, annular destruction, or inadequate leaflet tissue.", 4,
          "Mitral-replacement indications include {{c1::irreparable rheumatic disease; failed prior repair; annular destruction; insufficient leaflet tissue}}.",
          "The decision should reflect true repair infeasibility rather than limited local repair expertise."),
        mechanism("chordal-sparing", "applied-core", "mechanism",
          "Chordal-sparing replacement preserves ventricular geometry and reduces atrioventricular-groove disruption.",
          "During mitral replacement, preserving chordae prevents {{c1::LV dilation and groove rupture}}.",
          "Posterior leaflet and chordal continuity should be retained or reconstructed whenever possible."),
        mapping("annular-hazards", "applied-core", "model",
          "Mitral annular sutures threaten the circumflex artery laterally, conduction tissue septally, and the aortic valve anteriorly.", 3,
          "Mitral annular hazards map as {{c1::lateral → circumflex; septal → AV node; anterior → aortic valve}}.",
          "Suture depth and prosthesis orientation must respect each adjacent structure.")
      ]),
      unit("Transcatheter Mitral Repair: MitraClip and COAPT", [
        mechanism("edge-to-edge", "core", "mechanism",
          "MitraClip approximates anterior and posterior leaflets to create a double-orifice valve and reduce regurgitation.",
          "MitraClip reduces MR by creating an {{c1::edge-to-edge double orifice}}.",
          "The trade-off is a higher transmitral gradient, so baseline valve area must be adequate."),
        numeric("coapt-hospitalization", "enrichment",
          "COAPT reduced heart-failure hospitalization from 67.9 to 35.8 percent per patient-year.",
          "COAPT HF hospitalization fell from {{c1::67.9% to 35.8%}} per patient-year.",
          "The trial selected symptomatic patients with severe secondary MR despite optimized medical therapy.",
          meta("comparison", "67.9% to 35.8%", "% per patient-year", "COAPT heart-failure hospitalization", "exact")),
        numeric("coapt-mortality", "enrichment",
          "COAPT reduced two-year all-cause mortality from 46.1 percent to 29.1 percent.",
          "COAPT two-year mortality fell from {{c1::46.1% to 29.1%}}.",
          "This was a landmark mortality signal for intervention in carefully selected secondary MR.",
          meta("comparison", "46.1% to 29.1%", "%", "COAPT two-year all-cause mortality", "exact")),
        contrast("coapt-mitrafr", "core", "evidence",
          "COAPT selected disproportionate MR, whereas MITRA-FR included more proportionate MR in severely dilated ventricles.",
          "COAPT treated valve-dominant disease, whereas MITRA-FR enrolled {{c1::ventricle-dominant proportionate MR}}.",
          "Correcting the valve helps most when regurgitation is a driver rather than merely a marker of end-stage cardiomyopathy.")
      ]),
      unit("Results of Repair and Timing of Surgery", [
        guideNumeric("ef-trigger", "applied-core",
          "Asymptomatic severe primary MR reaches a surgery trigger when LVEF is 60 percent or less.",
          "In asymptomatic severe primary MR, the LVEF trigger is {{c1::60% or less}}.",
          "The threshold is high because chronic regurgitation provides a low-impedance ejection path that flatters EF.",
          meta("less-than-or-equal", 60, "%", "asymptomatic severe primary MR surgery trigger", "exact"),
          Object.assign(VALVE(), { recommendationClass: "1", evidenceLevel: "B-NR" })),
        guideNumeric("lvesd-trigger", "applied-core",
          "Asymptomatic severe primary MR reaches a surgery trigger when LV end-systolic diameter is 40 millimeters or greater.",
          "In asymptomatic severe primary MR, LVESD trigger is {{c1::40 mm or greater}}.",
          "Waiting beyond this dimension risks irreversible ventricular dysfunction despite later correction of regurgitation.",
          meta("greater-than-or-equal", 40, "mm", "asymptomatic severe primary MR surgery trigger", "exact"),
          Object.assign(VALVE(), { recommendationClass: "1", evidenceLevel: "B-NR" })),
        mechanism("popoff-ef", "core", "mechanism",
          "Chronic MR makes ejection fraction appear preserved because the LV ejects into a low-pressure left atrium.",
          "In severe MR, an apparently normal EF is misleading because {{c1::regurgitation lowers effective afterload}}.",
          "Closing the low-impedance leak reveals the ventricle's true contractile reserve."),
        numeric("repair-durability", "enrichment",
          "Posterior leaflet repair provides approximately 85 to 90 percent freedom from reoperation at 20 years.",
          "At 20 years, posterior repair freedom from reoperation is {{c1::85–90%}}.",
          "This durability supports early surgery when a high-quality repair is strongly expected.",
          meta("range", [85, 90], "%", "posterior mitral repair freedom from reoperation at 20 years", "approximate"))
      ]),
      unit("Senior reasoning: systematic degenerative mitral repair, segment by segment", [
        ordered("segment-workflow", "core",
          "Systematic degenerative repair maps segments, identifies motion, corrects the lesion, stabilizes the annulus, and tests the result.", 5,
          "Systematic mitral repair proceeds through {{c1::map segments; classify motion; repair lesion; implant ring; pressure-test result}}.",
          "Post-bypass TEE then confirms no significant residual MR, stenosis, or systolic anterior motion."),
        mechanism("circumflex-hazard", "applied-core", "rescue",
          "Deep lateral annuloplasty sutures can kink or ligate the circumflex artery and cause a new lateral wall-motion abnormality.",
          "After mitral repair, new lateral hypokinesis should trigger concern for {{c1::circumflex suture injury}}.",
          "The offending annular suture may need to be removed or revised immediately.")
      ]),
      unit("PGY-5 mastery: the valve conference and the post-repair SAM rescue", [
        ordered("sam-rescue", "applied-core",
          "Initial SAM treatment fills the ventricle, raises afterload, stops inotropes, slows the heart, and then revises if persistent.", 5,
          "Post-repair SAM rescue is {{c1::give volume; raise afterload; stop inotropes; slow heart rate; revise if persistent}}.",
          "These steps enlarge the LV cavity and move coaptation away from the outflow tract."),
        mechanism("sam-inotrope", "applied-core", "rescue",
          "Inotropes worsen systolic anterior motion by making the small LV more hypercontractile and obstructive.",
          "In post-repair SAM, an inotrope is harmful because it {{c1::intensifies dynamic LVOT obstruction}}.",
          "Persistent SAM requires repair revision such as reducing posterior height or choosing a larger ring.")
      ])
    ],

    "d7-prosthetics": [
      unit("The Prosthetic Valve Landscape", [
        contrast("core-trade", "core", "model",
          "Mechanical valves trade lifelong warfarin for durability, whereas bioprostheses trade future deterioration for freedom from warfarin.",
          "Mechanical valves trade anticoagulation for durability, whereas tissue valves trade {{c1::durability for anticoagulation freedom}}.",
          "Neither option is universally superior; patient values and expected lifetime determine the preferable burden."),
        mechanism("tissue-fixation", "core", "mechanism",
          "Glutaraldehyde makes tissue valves less antigenic but prevents cellular repair and permits calcification.",
          "Bioprosthetic fixation creates later failure because it {{c1::kills reparative leaflet cells}}.",
          "Structural deterioration then presents as leaflet stiffening, tearing, or perforation."),
        mapping("design-families", "enrichment", "model",
          "Modern mechanical, stented tissue, stentless, and homograft valves solve different durability and field problems.", 4,
          "Valve designs map as {{c1::bileaflet → mechanical standard; stented tissue → common bioprosthesis; stentless → larger EOA; homograft → infected field}}.",
          "Design selection is shaped by thrombosis, annular size, infection, and expected lifetime.")
      ]),
      unit("Mechanical Valve Anticoagulation by Position", [
        mapping("inr-map", "applied-core", "comparison",
          "Mechanical-valve INR targets depend on valve position and are higher for mitral or double valves.", 3,
          "Mechanical-valve INR maps as {{c1::aortic → 2.0–3.0; mitral → 2.5–3.5; double valves → 2.5–3.5}}.",
          "Valve position and prosthesis thrombogenicity explain the different target ranges.",
          { numeric: meta("mapping", "2.0–3.0 / 2.5–3.5 / 2.5–3.5", "INR", "mechanical-valve position", "institution-dependent"), reviewBy: REVIEW_BY }),
        mechanism("mitral-stasis", "core", "mechanism",
          "Lower-velocity mitral flow creates more prosthetic stasis and thrombosis risk than high-velocity aortic flow.",
          "Mechanical mitral valves need more anticoagulation because of {{c1::greater low-velocity blood stasis}}.",
          "The mitral position is also the classic high-risk prosthesis considered for procedural bridging."),
        guideNumeric("onx-target", "enrichment",
          "Selected On-X mechanical aortic valves may use an INR target of 1.5 to 2.0 with aspirin.",
          "A selected On-X aortic valve may target {{c1::INR 1.5–2.0}}.",
          "This exception applies only to eligible On-X aortic valves after the initial postoperative period.",
          meta("range", [1.5, 2], "INR", "selected On-X mechanical aortic valve", "exact"),
          Object.assign(VALVE(), { recommendationClass: "2b", evidenceLevel: "B-R" }))
      ]),
      unit("Why DOACs Cannot Be Used with Mechanical Heart Valves", [
        atomic("warfarin-rule", "core", "definition",
          "Mechanical heart valves require vitamin K antagonist anticoagulation rather than a direct oral anticoagulant.",
          "For a mechanical heart valve, the required oral anticoagulant is {{c1::warfarin}}.",
          "DOACs are contraindicated because randomized trials showed excess thrombosis and bleeding."),
        mechanism("broad-inhibition", "core", "mechanism",
          "Warfarin suppresses multiple vitamin-K-dependent factors, whereas a DOAC blocks only one cascade target.",
          "Mechanical-valve thrombogenicity requires warfarin's {{c1::broad multi-factor coagulation suppression}}.",
          "Artificial-surface and hinge activation proved inadequately controlled by single-target dabigatran or apixaban strategies."),
        contrast("realign", "enrichment", "evidence",
          "RE-ALIGN found more thromboembolism and bleeding with dabigatran than warfarin in mechanical-valve patients.",
          "Compared with warfarin, RE-ALIGN stopped dabigatran early for {{c1::more thrombosis and bleeding}}.",
          "The prohibition applies to mechanical valves; a separate atrial-fibrillation indication may permit a DOAC with a tissue valve.")
      ]),
      unit("Bioprosthetic Valve Anticoagulation and Monitoring", [
        numeric("endothelialization-window", "applied-core",
          "The early thrombogenic period after bioprosthetic implantation lasts approximately three to six months.",
          "Bioprosthetic endothelialization takes about {{c1::3–6 months}}.",
          "Valve position, rhythm, and bleeding risk determine antithrombotic strategy during this window.",
          meta("range", [3, 6], "months", "early post-bioprosthetic thrombogenic window", "approximate")),
        contrast("bridging", "core", "comparison",
          "A tissue valve in sinus rhythm usually does not require bridging, whereas high-risk mechanical valves may.",
          "For procedures, tissue valves usually avoid bridging, whereas high-risk mechanical valves may require {{c1::heparin bridging}}.",
          "The indication is prosthesis thrombogenicity and patient risk, not merely the presence of any prosthetic valve."),
        contrast("galileo", "enrichment", "evidence",
          "GALILEO found harm with routine low-dose rivaroxaban after TAVR compared with antiplatelet-based care.",
          "After TAVR, routine rivaroxaban was harmful, whereas antiplatelet-based care avoided {{c1::excess death and bleeding}}.",
          "Subclinical leaflet thrombosis does not justify routine anticoagulation without another indication.")
      ]),
      unit("Structural Valve Deterioration: Recognition and Management", [
        mapping("failure-phenotype", "core", "model",
          "Bioprosthetic calcification causes stenosis, while leaflet tear or perforation causes regurgitation.", 2,
          "Bioprosthetic failure maps as {{c1::calcific stiffening → stenosis; leaflet tear → regurgitation}}.",
          "Mixed structural deterioration can produce both lesions."),
        mapping("surveillance", "applied-core", "model",
          "The lesson uses annual echo beyond ten years and six-month echo once early deterioration appears.", 2,
          "SVD surveillance maps as {{c1::after 10 years → annual echo; early SVD → every 6 months}}.",
          "Progressive gradients, regurgitation, or leaflet changes shorten the surveillance interval.",
          { numeric: meta("mapping", "10 years / 6 months", "time", "bioprosthetic SVD surveillance", "institution-dependent"), reviewBy: REVIEW_BY }),
        bounded("failure-drivers", "core", "bounded-set",
          "Younger age, mitral position, and prosthesis-patient mismatch accelerate tissue-valve deterioration.", 3,
          "Faster bioprosthetic SVD is associated with {{c1::younger age; mitral position; prosthesis-patient mismatch}}.",
          "Surveillance should identify progression before symptoms or ventricular dysfunction make reintervention hazardous.")
      ])
    ],

    "d8-aneurysm": [
      unit("What Is a Thoracic Aortic Aneurysm?", [
        numeric("definition-ratio", "core",
          "An aneurysm is a permanent aortic diameter at least 1.5 times the expected normal diameter.",
          "An aortic aneurysm is at least {{c1::1.5 times normal diameter}}.",
          "Body size and the expected diameter for the specific segment refine interpretation.",
          meta("greater-than-or-equal", 1.5, "times expected diameter", "formal aneurysm definition", "exact")),
        numeric("thoracic-practical", "enrichment",
          "A thoracic aortic diameter near four centimeters is practically considered dilated in the lesson.",
          "Practical thoracic-aortic dilation begins around {{c1::4.0 cm}}.",
          "Segment, body size, genetics, growth, and symptoms determine clinical significance.",
          meta("approximately", 4, "cm", "practical thoracic aortic dilation", "approximate")),
        item("laplace", "core", "formula",
          "Aortic wall tension rises as pressure or radius increases.", "formula",
          "For a cylindrical aorta, wall tension is proportional to {{c1::pressure × radius}}.",
          "A larger aneurysm therefore experiences greater tension at the same blood pressure, promoting further enlargement."),
        mapping("segment-map", "core", "model",
          "Thoracic aortic disease is described by ascending, arch, descending, and thoracoabdominal segments.", 4,
          "Aortic segments map as {{c1::ascending → valve-to-innominate; arch → great-vessel origins; descending → subclavian-to-diaphragm; TAAA → crosses diaphragm}}.",
          "The segment determines exposure, cerebral protection, spinal-cord risk, and endovascular feasibility."),
        mechanism("stj-ai", "applied-core", "mechanism",
          "Sinotubular-junction dilation splays aortic commissures and creates central aortic insufficiency.",
          "Ascending-root dilation causes central AI by {{c1::pulling the commissures apart}}.",
          "Restoring sinotubular geometry can restore leaflet coaptation when the cusps remain normal.")
      ]),
      unit("Indications for Elective Repair", [
        guideNumeric("sporadic-threshold", "applied-core",
          "Elective repair is indicated at an ascending or root diameter of 5.5 centimeters in average-risk sporadic aneurysm.",
          "The standard sporadic ascending-aorta threshold is {{c1::5.5 cm}}.",
          "Earlier surgery can be reasonable at expert centers or with rapid growth, symptoms, family history, or concomitant surgery.",
          meta("greater-than-or-equal", 5.5, "cm", "sporadic root or ascending aneurysm repair", "exact"),
          Object.assign(AORTA(), { recommendationClass: "1", evidenceLevel: "B-NR" })),
        guideNumeric("growth-threshold", "applied-core",
          "The lesson uses growth above 0.5 centimeters per year as a repair trigger.",
          "Rapid aneurysm growth exceeds {{c1::0.5 cm/year}}.",
          "Modern guidance also considers sustained growth over serial imaging; measurement technique must be consistent.",
          meta("greater-than", 0.5, "cm/year", "thoracic aneurysm rapid growth", "exact"),
          Object.assign(AORTA(), { recommendationClass: "1", evidenceLevel: "C-LD" })),
        mechanism("symptomatic", "applied-core", "rescue",
          "Symptoms attributable to an aneurysm prompt repair regardless of diameter because they may signal expansion or impending rupture.",
          "A symptomatic thoracic aneurysm requires repair because symptoms may indicate {{c1::impending aortic failure}}.",
          "The operation is not deferred merely because a size threshold has not been reached."),
        mapping("heritable-thresholds", "enrichment", "guideline",
          "The lesson presents earlier diameter thresholds for Marfan and Loeys-Dietz aortopathy than for sporadic aneurysm.", 2,
          "Lesson heritable thresholds map as {{c1::Marfan → about 4.5 cm; Loeys-Dietz → about 4.2 cm}}.",
          "Thresholds move earlier as gene-specific risk, family history, and rapid growth accumulate.",
          { guideline: Object.assign(AORTA(), { recommendationClass: "risk-feature dependent", evidenceLevel: "C-LD" }),
            numeric: meta("mapping", "Marfan about 4.5 / Loeys-Dietz about 4.2", "cm", "lesson heritable-aortopathy thresholds", "approximate"),
            reviewBy: REVIEW_BY })
      ]),
      unit("Aortic Root Procedures: Bentall vs. David", [
        mapping("root-options", "core", "model",
          "Bentall replaces valve and root, David preserves the native valve within a graft, and supracoronary replacement preserves a normal root.", 3,
          "Root procedures map as {{c1::Bentall → valve-plus-root; David → valve-sparing root; supracoronary → ascending tube graft}}.",
          "Leaflet integrity, root pathology, age, and anticoagulation preference determine the choice."),
        contrast("david-yacoub", "applied-core", "comparison",
          "David reimplantation supports the annulus, whereas Yacoub remodeling leaves the annulus unsupported.",
          "David supports the annulus, whereas Yacoub remodeling {{c1::leaves it able to redilate}}.",
          "Reimplantation is therefore more durable in aortoannular ectasia and connective-tissue disease."),
        atomic("cabrol", "enrichment", "definition",
          "A Cabrol interposition graft connects a coronary button that cannot reach the root graft without tension.",
          "A coronary button that cannot reach safely may require a {{c1::Cabrol interposition graft}}.",
          "The short conduit prevents tension or kinking during complex root reconstruction.")
      ]),
      unit("Crawford Classification of TAAA", [
        mapping("crawford-map", "core", "model",
          "Crawford extents I through IV describe progressively different thoracoabdominal involvement.", 4,
          "Crawford extents map as {{c1::I → descending-to-celiac; II → entire thoracoabdominal; III → distal-descending-plus-abdominal; IV → abdominal only}}.",
          "The Safi Type V modification covers distal descending and proximal abdominal aorta."),
        mechanism("type-two-risk", "applied-core", "mechanism",
          "Crawford Type II has the greatest spinal-cord risk because it excludes the longest segmental-artery territory.",
          "Crawford Type II has highest paraplegia risk because it {{c1::sacrifices the longest collateral segment}}.",
          "Protection must preserve subclavian and hypogastric inflow, distal perfusion, and spinal-cord perfusion pressure."),
        numeric("adamkiewicz", "core",
          "The artery of Adamkiewicz most often arises between thoracic eight and lumbar two.",
          "The artery of Adamkiewicz usually arises from {{c1::T8–L2}}.",
          "This lower thoracic and upper lumbar segmental territory is prioritized during extensive repair.",
          meta("vertebral-range", "T8–L2", "vertebral levels", "typical Adamkiewicz origin", "approximate"))
      ]),
      unit("TEVAR and Spinal Cord Protection", [
        bounded("cord-protection", "core", "bounded-set",
          "Spinal-cord protection combines CSF drainage, distal perfusion, staged coverage, pressure augmentation, and intercostal preservation.", 5,
          "Cord-protection measures include {{c1::CSF drainage; distal aortic perfusion; staged repair; permissive hypertension; critical intercostal reimplantation}}.",
          "The strategy maintains a collateral network rather than relying on one segmental artery."),
        item("scpp-formula", "core", "formula",
          "Spinal-cord perfusion pressure equals mean arterial pressure minus cerebrospinal-fluid pressure.", "formula",
          "Spinal-cord perfusion pressure = {{c1::MAP − CSF pressure}}.",
          "Protection can therefore improve perfusion by raising arterial pressure or lowering CSF pressure."),
        numeric("csf-target", "applied-core",
          "High-risk descending repair commonly targets cerebrospinal-fluid pressure below 10 millimeters of mercury.",
          "During high-risk aortic repair, CSF pressure targets {{c1::below 10 mmHg}}.",
          "Drainage is rate-limited to prevent intracranial hypotension and hemorrhage.",
          meta("less-than", 10, "mmHg", "high-risk thoracoabdominal repair CSF pressure", "institution-dependent")),
        numeric("map-target", "applied-core",
          "The lesson targets mean arterial pressure above 80 to 90 millimeters of mercury after extensive repair.",
          "Post-repair cord protection targets MAP {{c1::above 80–90 mmHg}}.",
          "Pressure augmentation is especially urgent when delayed weakness or paraplegia appears.",
          meta("range", [80, 90], "mmHg", "post-TEVAR spinal-cord perfusion MAP", "institution-dependent")),
        numeric("landing-zone", "applied-core",
          "TEVAR generally requires approximately two centimeters of healthy proximal and distal landing zone.",
          "A durable TEVAR seal usually needs about {{c1::2 cm landing zone}}.",
          "Short necks may require intentional branch coverage or surgical debranching.",
          meta("approximately", 2, "cm", "healthy TEVAR proximal and distal landing zone", "approximate")),
        numeric("oversizing", "enrichment",
          "The lesson recommends approximately 10 to 15 percent TEVAR graft oversizing.",
          "TEVAR graft oversizing is about {{c1::10–15%}}.",
          "Excessive or inadequate oversizing risks wall injury, migration, or endoleak and is device-specific.",
          meta("range", [10, 15], "%", "TEVAR graft oversizing", "institution-dependent")),
        mapping("endoleaks", "core", "model",
          "TEVAR endoleaks arise at seal zones, from branch backflow, or at component junctions.", 3,
          "TEVAR endoleaks map as {{c1::Type I → seal zone; Type II → branch backflow; Type III → graft junction}}.",
          "A persistent leak keeps the aneurysm sac pressurized and requires surveillance or intervention.")
      ])
    ],

    "d8-dissection": [
      unit("Pathophysiology of Aortic Dissection", [
        mechanism("false-lumen", "core", "mechanism",
          "An intimal tear lets pressurized blood split the media and create a false lumen.",
          "Aortic dissection begins when blood enters the media through an {{c1::intimal tear}}.",
          "The false lumen can propagate proximally or distally and compromise branches or rupture."),
        numeric("hourly-mortality", "applied-core",
          "Untreated acute Type A dissection mortality rises approximately one to two percent per hour early after presentation.",
          "Untreated acute Type A mortality rises about {{c1::1–2% per hour}}.",
          "Diagnostic or transfer delays should not postpone definitive surgery once the diagnosis is established.",
          meta("range", [1, 2], "% per hour", "untreated acute Type A dissection early mortality", "approximate")),
        bounded("failure-modes", "core", "bounded-set",
          "Dissection kills through malperfusion, external rupture, or retrograde root and coronary involvement.", 3,
          "Lethal dissection mechanisms are {{c1::branch malperfusion; external rupture; root-or-coronary extension}}.",
          "These mechanisms produce ischemia, tamponade, hemorrhagic shock, acute regurgitation, or infarction."),
        numeric("imh-frequency", "enrichment",
          "Intramural hematoma accounts for approximately 10 to 20 percent of suspected dissections.",
          "Intramural hematoma accounts for about {{c1::10–20%}} of suspected dissections.",
          "It can progress or rupture without ever showing a classic intimal flap.",
          meta("range", [10, 20], "%", "intramural hematoma among suspected dissection", "approximate"))
      ]),
      unit("Stanford and DeBakey Classification", [
        mapping("stanford", "core", "model",
          "Stanford A involves the ascending aorta and requires surgery; Stanford B remains distal and is initially medical if uncomplicated.", 2,
          "Stanford dissection maps as {{c1::Type A → ascending and surgery; Type B → distal and medical-first}}.",
          "Ascending involvement determines the immediate risk of tamponade, coronary injury, and aortic regurgitation."),
        mapping("debakey", "core", "model",
          "DeBakey I includes ascending and descending aorta, II only ascending, and III only descending.", 3,
          "DeBakey anatomy maps as {{c1::I → ascending-plus-descending; II → ascending only; III → descending only}}.",
          "Types I and II are Stanford A; Type III is Stanford B."),
        mapping("timing", "enrichment", "definition",
          "Aortic dissection timing is described as acute, subacute, or chronic.", 3,
          "Dissection timing maps as {{c1::acute → under 2 weeks; subacute → 2 weeks–2 months; chronic → beyond 2 months}}.",
          "Timing influences tissue behavior and urgency but does not make ascending involvement benign.",
          { numeric: meta("mapping", "under 2 weeks / 2 weeks–2 months / beyond 2 months", "time", "aortic dissection chronicity", "approximate"), reviewBy: REVIEW_BY })
      ]),
      unit("Anti-Impulse Therapy for Type B Dissection", [
        numeric("hr-target", "applied-core",
          "Anti-impulse therapy targets a heart rate below 60 beats per minute.",
          "In acute dissection, target heart rate is {{c1::below 60 bpm}}.",
          "Controlling heart rate first reduces the rate of pressure rise and propagation force.",
          meta("less-than", 60, "bpm", "acute aortic dissection anti-impulse therapy", "institution-dependent")),
        numeric("sbp-target", "applied-core",
          "The lesson's initial systolic-pressure target for Type B dissection is approximately 100 to 120 millimeters of mercury.",
          "Type B anti-impulse therapy targets SBP about {{c1::100–120 mmHg}}.",
          "The lowest pressure preserving organ perfusion minimizes wall stress without worsening malperfusion.",
          meta("range", [100, 120], "mmHg", "acute Type B dissection anti-impulse therapy", "institution-dependent")),
        ordered("drug-order", "applied-core",
          "Anti-impulse treatment controls pain and heart rate before adding a vasodilator for residual hypertension.", 3,
          "Acute Type B drug order is {{c1::give analgesia; beta-block heart rate; add vasodilator if needed}}.",
          "Vasodilation before rate control can provoke reflex tachycardia and increase dP/dt."),
        mechanism("nitroprusside-harm", "core", "mechanism",
          "Unopposed vasodilation can worsen dissection propagation through reflex tachycardia and higher dP/dt.",
          "Nitroprusside monotherapy is dangerous because it causes {{c1::reflex tachycardia and higher dP/dt}}.",
          "A titratable beta-blocker should own the heart rate before pressure is lowered further.")
      ]),
      unit("Surgical Approach to Type A Dissection", [
        bounded("axillary-benefits", "core", "bounded-set",
          "Right axillary cannulation provides antegrade true-lumen flow, avoids the diseased ascending aorta, and enables cerebral perfusion.", 3,
          "Axillary cannulation provides {{c1::antegrade true-lumen flow; ascending-aorta avoidance; antegrade cerebral perfusion}}.",
          "Femoral retrograde return may pressurize the false lumen and worsen malperfusion."),
        ordered("typea-sequence", "core",
          "Type A repair establishes safe inflow, cools, arrests circulation for arch inspection, excises the tear, and reconstructs the aorta.", 5,
          "Core Type A steps are {{c1::establish true-lumen inflow; cool and arrest heart; inspect arch; resect entry tear; reconstruct aorta}}.",
          "Root and arch extent are then tailored to the actual tear and tissue destruction."),
        numeric("arch-tear", "enrichment",
          "The arch contains the primary tear in approximately 30 percent of acute Type A cases in the lesson.",
          "The acute Type A arch is torn in about {{c1::30%}} of cases.",
          "Most patients therefore receive a hemiarch rather than routine total-arch replacement.",
          meta("approximately", 30, "%", "acute Type A cases with arch tear", "approximate"))
      ]),
      unit("Aortic Valve in Type A Dissection", [
        mechanism("ar-mechanism", "core", "mechanism",
          "Acute Type A regurgitation usually results from commissural detachment rather than diseased leaflets.",
          "Type A dissection causes acute AR by {{c1::detaching aortic commissures}}.",
          "Normal cusps can often be preserved by restoring root and sinotubular geometry."),
        mapping("root-decision", "applied-core", "model",
          "Commissural resuspension, David repair, and Bentall replacement fit increasing root and leaflet destruction.", 3,
          "Type A root options map as {{c1::normal root → resuspend; suitable diseased root → David; destroyed root-or-leaflets → Bentall}}.",
          "Direct inspection and post-repair TEE determine whether preservation is durable."),
        numeric("valve-sparing", "enrichment",
          "The lesson reports native-valve preservation in approximately 85 percent of acute Type A cases.",
          "Acute Type A surgery preserves the native valve in about {{c1::85%}}.",
          "This is possible because the usual lesion is root support failure rather than primary cusp disease.",
          meta("approximately", 85, "%", "native aortic valve preservation in acute Type A", "approximate"))
      ]),
      unit("Cerebral Protection During Aortic Arch Surgery", [
        numeric("normothermic-window", "core",
          "The brain tolerates only approximately four to six minutes of normothermic circulatory arrest.",
          "Normothermic cerebral ischemic tolerance is about {{c1::4–6 minutes}}.",
          "Hypothermia and direct cerebral perfusion are therefore mandatory for arch work.",
          meta("range", [4, 6], "minutes", "normothermic cerebral ischemic tolerance", "approximate")),
        contrast("acp-rcp", "core", "comparison",
          "Antegrade cerebral perfusion delivers oxygenated arterial blood, whereas retrograde perfusion mainly cools and flushes emboli.",
          "ACP directly oxygenates the brain, whereas RCP mainly {{c1::cools and flushes debris}}.",
          "ACP therefore supports longer work at moderate hypothermia more reliably."),
        numeric("acp-pressure", "applied-core",
          "The lesson targets an antegrade cerebral-perfusion pressure of 50 to 70 millimeters of mercury.",
          "ACP perfusion pressure targets {{c1::50–70 mmHg}}.",
          "Bilateral NIRS and institutional flow protocols guide adequacy and symmetry.",
          meta("range", [50, 70], "mmHg", "antegrade cerebral perfusion pressure", "institution-dependent")),
        numeric("moderate-temperature", "applied-core",
          "Moderate hypothermia with antegrade cerebral perfusion commonly uses 24 to 28 degrees Celsius.",
          "ACP arch repair commonly cools to {{c1::24–28°C}}.",
          "Temperature, arrest time, perfusion strategy, and center protocol are inseparable.",
          meta("range", [24, 28], "°C", "moderate hypothermic arch repair with ACP", "institution-dependent"))
      ]),
      unit("Related Acute Aortic Syndromes", [
        mapping("syndrome-mechanism", "core", "model",
          "Intramural hematoma is medial bleeding without a visible tear, whereas penetrating ulcer is plaque erosion into the media.", 2,
          "Acute aortic syndromes map as {{c1::IMH → vasa-vasorum medial bleed; PAU → plaque ulcer into media}}.",
          "Either lesion can progress to dissection, pseudoaneurysm, or rupture."),
        mapping("location-management", "applied-core", "model",
          "Ascending acute aortic syndromes require surgery, while uncomplicated descending disease begins with medical or endovascular management.", 2,
          "Acute aortic syndrome management maps as {{c1::ascending involvement → emergency surgery; descending involvement → medical-first or TEVAR}}.",
          "Absence of an intimal flap does not make an ascending intramural hematoma safe."),
        numeric("cta-performance", "enrichment",
          "CT angiography sensitivity and specificity for acute aortic syndrome are approximately 90 to 100 percent.",
          "CTA performance for acute aortic syndrome is about {{c1::90–100%}}.",
          "TEE is the rapid bedside alternative when transport is unsafe; imaging must assess branch and root complications.",
          meta("range", [90, 100], "%", "CTA sensitivity and specificity for acute aortic syndrome", "approximate"))
      ]),
      unit("Senior reasoning: the type-A operative strategy, decision by decision", [
        ordered("four-decisions", "core",
          "Senior Type A planning chooses inflow, cerebral protection, arch extent, and root management in order.", 4,
          "Type A strategy owns {{c1::true-lumen cannulation; arrest-and-cerebral plan; arch extent; root strategy}}.",
          "Each decision is matched to the tear, perfusion pattern, tissue quality, and patient substrate."),
        mapping("arch-extent", "applied-core", "model",
          "Hemiarch repair fits an ascending tear without arch disease, while total arch fits an arch tear, aneurysm, or extensive distal disease.", 2,
          "Arch extent maps as {{c1::ascending tear only → hemiarch; arch tear-or-aneurysm → total arch}}.",
          "Frozen elephant trunk may extend treatment into significant distal disease at the cost of a larger acute operation.")
      ]),
      unit("PGY-5 mastery: running the 2 a.m. type-A and rescuing its surprises", [
        mapping("malperfusion-clues", "applied-core", "model",
          "Inferior ST elevation suggests right-coronary malperfusion, while a cold leg suggests iliofemoral malperfusion.", 2,
          "Type A clues map as {{c1::inferior ST elevation → RCA malperfusion; cold leg → iliofemoral malperfusion}}.",
          "Both findings influence inflow strategy and the need for branch intervention after central repair."),
        contrast("dynamic-static", "applied-core", "comparison",
          "Dynamic malperfusion resolves when central repair restores true-lumen pressure, whereas static branch obstruction persists.",
          "Dynamic malperfusion improves after central repair, whereas static obstruction {{c1::needs directed branch intervention}}.",
          "Fenestration, branch stenting, or bypass is selected when perfusion does not recover."),
        mechanism("no-pericardiocentesis", "applied-core", "rescue",
          "Pericardiocentesis in Type A tamponade can remove the pressure limiting rupture and provoke fatal hemorrhage.",
          "Type A tamponade should not be needled because drainage can {{c1::release aortic rupture tamponade}}.",
          "The definitive decompression is controlled surgical repair in the operating room.")
      ])
    ],

    "d8-pericardium": [
      unit("Acute Pericarditis", [
        bounded("diagnostic-criteria", "core", "bounded-set",
          "Acute pericarditis is diagnosed by at least two of pleuritic pain, rub, diffuse ECG changes, or effusion.", 4,
          "Pericarditis criteria are {{c1::pleuritic chest pain; pericardial rub; diffuse ST-or-PR change; new effusion}}.",
          "At least two are required after excluding competing dangerous diagnoses."),
        mapping("ecg-contrast", "core", "comparison",
          "Pericarditis produces diffuse concave ST elevation and PR depression, whereas STEMI produces regional convex changes with reciprocity.", 2,
          "ECG patterns map as {{c1::pericarditis → diffuse concave ST-plus-PR depression; STEMI → regional convex ST-plus-reciprocity}}.",
          "Clinical context and serial biomarkers or imaging still matter when patterns overlap."),
        contrast("treatment", "applied-core", "comparison",
          "NSAID plus colchicine reduces pericarditis symptoms and recurrence, whereas routine corticosteroids increase recurrence.",
          "Treat uncomplicated pericarditis with NSAID plus colchicine, whereas steroids are {{c1::reserved for selected indications}}.",
          "Post-MI cases use aspirin; autoimmune disease or genuine first-line failure may justify corticosteroids."),
        numeric("postpericardiotomy", "enrichment",
          "Post-pericardiotomy syndrome occurs in approximately five to 30 percent after cardiac surgery in the lesson.",
          "Post-pericardiotomy syndrome occurs in about {{c1::5–30%}} after cardiac surgery.",
          "The wide estimate depends on definition, ascertainment, and operative population.",
          meta("range", [5, 30], "%", "post-pericardiotomy syndrome after cardiac surgery", "approximate"))
      ]),
      unit("Cardiac Tamponade: Pathophysiology", [
        mechanism("rate-not-volume", "core", "mechanism",
          "Tamponade depends more on accumulation rate than absolute effusion volume because acute pericardial compliance is low.",
          "Pericardial fluid becomes dangerous when it accumulates {{c1::faster than the sac can stretch}}.",
          "Rapid pressure rise first collapses the low-pressure right atrium and ventricle."),
        numeric("acute-volume", "applied-core",
          "Approximately 100 milliliters of rapidly accumulated pericardial blood can be lethal.",
          "Rapid tamponade may occur with only about {{c1::100 mL}}.",
          "A slowly expanding sac may accommodate more than a liter before equivalent compression develops.",
          meta("approximately", 100, "mL", "rapid acute pericardial accumulation", "approximate")),
        mechanism("low-pressure", "applied-core", "mechanism",
          "Hypovolemia can reveal low-pressure tamponade by lowering chamber filling pressure below modest pericardial pressure.",
          "Low-pressure tamponade emerges when hypovolemia {{c1::drops intracardiac filling pressure}}.",
          "Near-normal venous pressure can therefore coexist with hemodynamically important compression.")
      ]),
      unit("Clinical Recognition of Tamponade", [
        bounded("beck-triad", "core", "bounded-set",
          "Beck triad comprises hypotension, elevated jugular venous pressure, and muffled heart sounds.", 3,
          "Beck's tamponade triad is {{c1::hypotension; elevated JVP; muffled heart sounds}}.",
          "The triad is often incomplete, especially after surgery, so unexplained deterioration requires echocardiography."),
        numeric("pulsus", "core",
          "Pulsus paradoxus is an inspiratory systolic-pressure fall greater than 10 millimeters of mercury.",
          "Tamponade pulsus paradoxus exceeds {{c1::10 mmHg}}.",
          "It may be absent with severe aortic regurgitation, ASD, LV dysfunction, or RV hypertrophy.",
          meta("greater-than", 10, "mmHg", "inspiratory systolic-pressure fall", "exact")),
        mapping("echo-signs", "core", "model",
          "Tamponade echo progression includes right-atrial systolic collapse, right-ventricular diastolic collapse, IVC plethora, and respiratory inflow variation.", 4,
          "Tamponade echo signs map as {{c1::RA → systolic collapse; RV → diastolic collapse; IVC → plethora; Doppler → respiratory variation}}.",
          "Right-atrial collapse is sensitive, whereas right-ventricular diastolic collapse is more specific."),
        atomic("pressure-equalization", "applied-core", "definition",
          "Tamponade equalizes right-atrial, right-ventricular diastolic, and wedge pressures with pericardial pressure.",
          "The invasive tamponade hallmark is {{c1::equalized diastolic filling pressures}}.",
          "The catheter pattern must be interpreted with the clinical and echocardiographic context.")
      ]),
      unit("Treatment of Tamponade and Post-Operative Special Case", [
        contrast("drainage-choice", "applied-core", "rescue",
          "Free liquid tamponade can be drained percutaneously, whereas loculated postoperative clot requires surgical re-exploration.",
          "Liquid tamponade permits pericardiocentesis, whereas postoperative clot usually requires {{c1::surgical re-exploration}}.",
          "A needle cannot reliably reach or evacuate organized posterior or right-heart clot."),
        ordered("needle-technique", "enrichment",
          "Echo-guided subxiphoid pericardiocentesis advances a needle, confirms position, passes a wire, and leaves a pigtail drain.", 4,
          "Pericardiocentesis proceeds through {{c1::echo-guided needle; confirm pericardial return; pass guidewire; place pigtail catheter}}.",
          "A surgical window is preferred for loculated, recurrent, malignant, or purulent collections."),
        numeric("late-incidence", "enrichment",
          "Late post-cardiac-surgery tamponade occurs in approximately 0.5 to six percent of patients in the lesson.",
          "Late postoperative tamponade occurs in about {{c1::0.5–6%}}.",
          "It is strongly associated with anticoagulation and often presents after discharge.",
          meta("range", [0.5, 6], "%", "late tamponade after cardiac surgery", "approximate")),
        numeric("late-timing", "enrichment",
          "Late postoperative tamponade presents on average around three weeks after surgery.",
          "Late postoperative tamponade presents around {{c1::3 weeks}}.",
          "By then the collection is usually liquefied and may respond to pericardiocentesis.",
          meta("approximately", 3, "weeks", "late post-cardiac-surgery tamponade presentation", "approximate"))
      ]),
      unit("Constrictive Pericarditis: Pathophysiology", [
        contrast("constraint", "core", "comparison",
          "Constriction imposes a fixed volume limit after rapid early filling, whereas tamponade imposes pressure throughout filling.",
          "Constriction is a volume limit, whereas tamponade is a {{c1::continuous pressure constraint}}.",
          "This distinction produces different waveforms, physical signs, and definitive treatments."),
        mechanism("square-root", "core", "mechanism",
          "Constrictive ventricles fill rapidly early in diastole and then stop abruptly against a rigid shell.",
          "The constrictive square-root sign reflects {{c1::rapid filling followed by abrupt halt}}.",
          "The same physiology produces a prominent y descent and septal bounce."),
        mapping("filling-fraction", "enrichment", "model",
          "Constriction crowds most diastolic filling into the earliest portion of diastole.", 2,
          "Constrictive filling maps as {{c1::first 25–30% of diastole → 70–80% of filling; remainder → abrupt plateau}}.",
          "The fixed pericardial volume is reached early despite elevated filling pressures.",
          { numeric: meta("mapping", "25–30% time / 70–80% filling", "%", "constrictive early-diastolic filling", "approximate"), reviewBy: REVIEW_BY })
      ]),
      unit("Clinical and Hemodynamic Distinction: Constriction vs. Tamponade", [
        mapping("bedside-map", "core", "model",
          "Tamponade features pulsus paradoxus and a blunted y descent, while constriction features Kussmaul sign and a prominent y descent.", 4,
          "Pericardial signs map as {{c1::tamponade → pulsus paradoxus; tamponade → blunted y descent; constriction → Kussmaul sign; constriction → prominent y descent}}.",
          "Both can elevate venous pressure, so respiratory physiology distinguishes them."),
        mechanism("discordance", "core", "mechanism",
          "A rigid constrictive shell forces reciprocal respiratory changes in right- and left-ventricular systolic pressure.",
          "Constrictive ventricular discordance occurs because ventricles {{c1::compete within a fixed volume}}.",
          "With inspiration, RV systolic pressure rises while LV systolic pressure falls."),
        numeric("discordance-performance", "enrichment",
          "The lesson reports ventricular discordance as approximately 100 percent sensitive and 95 percent specific for constriction.",
          "Ventricular discordance is about {{c1::100% sensitive and 95% specific}}.",
          "Diagnostic performance varies by technique and study; interpret it with tissue Doppler and imaging.",
          meta("comparison", "100% sensitive and 95% specific", "%", "ventricular discordance for constriction", "approximate"))
      ]),
      unit("Pericardiectomy and Recovery", [
        ordered("resection-extent", "core",
          "Radical pericardiectomy frees the anterior, diaphragmatic, caval, and pulmonary-venous surfaces while protecting coronaries and phrenic nerves.", 4,
          "Complete pericardiectomy releases {{c1::phrenic-to-phrenic anterior shell; diaphragmatic surface; caval reflections; pulmonary-vein reflections}}.",
          "A residual constricting rim can preserve the pathologic physiology."),
        numeric("operative-mortality", "enrichment",
          "Pericardiectomy operative mortality is approximately five to 10 percent at experienced centers.",
          "Pericardiectomy mortality is about {{c1::5–10%}}.",
          "Radiation-associated myocardial and coronary disease raises risk beyond the technical stripping itself.",
          meta("range", [5, 10], "%", "pericardiectomy operative mortality", "approximate")),
        numeric("convalescence", "applied-core",
          "Low output during the first 24 to 72 hours after pericardiectomy may reflect expected myocardial convalescence.",
          "Post-pericardiectomy low output may persist {{c1::24–72 hours}}.",
          "Cautious filling and inotropic support allow chronically constrained myocardium time to recover.",
          meta("range", [24, 72], "hours", "early pericardiectomy convalescence", "approximate")),
        mechanism("waffle", "applied-core", "rescue",
          "A waffle procedure incises constricting visceral epicardium when parietal pericardiectomy alone cannot release the heart.",
          "Visceral constriction may require a waffle procedure to {{c1::let epicardial islands expand}}.",
          "Crosshatched incisions relieve a non-strippable epicardial shell without removing the myocardium beneath it.")
      ]),
      unit("Senior reasoning: constriction versus restriction, and the operation each selects", [
        mapping("constriction-restriction", "core", "comparison",
          "Constriction has preserved medial e-prime and respiratory interdependence; restriction has low e-prime and stiff myocardium.", 4,
          "Hemodynamics map as {{c1::constriction → preserved medial e′; constriction → ventricular discordance; restriction → low e′; restriction → little interdependence}}.",
          "Both can show elevated equalized diastolic pressure and a dip-and-plateau."),
        contrast("treatment-selection", "applied-core", "comparison",
          "Constrictive pericarditis is treated surgically, whereas restrictive cardiomyopathy is treated medically or by disease-specific therapy.",
          "Constriction selects pericardiectomy, whereas restriction selects {{c1::medical myocardial treatment}}.",
          "Operating on restriction does not remove the stiff substrate because the disease lies in muscle, not pericardium.")
      ]),
      unit("Cardiac Tumours", [
        numeric("secondary-frequency", "core",
          "Secondary cardiac tumors are approximately 30 times more common than primary cardiac tumors.",
          "Secondary cardiac tumors are about {{c1::30 times more common}} than primary tumors.",
          "They reach the heart by blood, lymphatics, direct invasion, or transvenous extension.",
          meta("approximately", 30, "times", "secondary versus primary cardiac tumor frequency", "approximate")),
        mapping("tumor-map", "core", "model",
          "Myxoma, fibroelastoma, rhabdomyoma, and angiosarcoma have characteristic age and anatomic patterns.", 4,
          "Cardiac tumors map as {{c1::myxoma → adult atrium; fibroelastoma → valve; rhabdomyoma → child; angiosarcoma → right atrium}}.",
          "The pattern helps prioritize obstruction, embolic risk, syndromic association, and malignant staging."),
        bounded("myxoma-triad", "core", "bounded-set",
          "Atrial myxoma presents through intracardiac obstruction, systemic embolism, or constitutional inflammation.", 3,
          "Myxoma presentation includes {{c1::intracardiac obstruction; systemic embolism; constitutional symptoms}}.",
          "A mobile tumor can also damage the atrioventricular valve through a wrecking-ball effect."),
        numeric("left-atrial-origin", "enrichment",
          "Approximately 75 percent of myxomas arise from the left atrial interatrial septum.",
          "About {{c1::75% of myxomas}} arise in the left atrium.",
          "Bicaval control and minimal manipulation reduce the risk of systemic tumor embolization.",
          meta("approximately", 75, "%", "myxomas arising in left atrium", "approximate")),
        ordered("myxoma-operation", "applied-core",
          "Myxoma surgery establishes bicaval control, avoids manipulation, excises with a septal margin, irrigates, and assesses the valve.", 5,
          "Myxoma resection proceeds through {{c1::bicaval control; minimal manipulation; en-bloc septal excision; cavity irrigation; valve assessment}}.",
          "Tumor-field suction should not return potential cells through the pump or cell saver.")
      ]),
      unit("Cardiac Trauma", [
        mapping("trauma-map", "core", "model",
          "Blunt injury causes contusion and structural tears; penetrating injury causes tamponade or laceration; deceleration injures the isthmus.", 3,
          "Cardiac trauma maps as {{c1::blunt → contusion-or-rupture; penetrating → laceration-or-tamponade; deceleration → aortic isthmus tear}}.",
          "ATLS priorities and rapid focused imaging determine whether monitoring, sternotomy, or resuscitative thoracotomy is required."),
        numeric("ed-thoracotomy", "applied-core",
          "Resuscitative thoracotomy may be considered after penetrating trauma with loss of output within approximately 10 minutes of PEA.",
          "Penetrating-trauma ED thoracotomy uses an arrest window near {{c1::10 minutes}}.",
          "Candidacy depends on witnessed signs of life, injury mechanism, arrest duration, and available resources.",
          meta("approximately", 10, "minutes", "penetrating-trauma loss of output before ED thoracotomy", "institution-dependent")),
        numeric("isthmus-location", "core",
          "Approximately 80 to 90 percent of traumatic aortic ruptures occur at the isthmus.",
          "Traumatic aortic rupture occurs at the isthmus in {{c1::80–90%}} of cases.",
          "The segment is tethered just distal to the left subclavian artery at the ligamentum arteriosum.",
          meta("range", [80, 90], "%", "traumatic aortic rupture at isthmus", "approximate")),
        numeric("clamp-time", "applied-core",
          "Open clamp-and-sew repair carries increasing paraplegia risk when aortic clamp time exceeds 30 minutes.",
          "Clamp-and-sew cord risk rises beyond {{c1::30 minutes}}.",
          "A Gott shunt or left-heart bypass maintains distal perfusion when a longer open repair is expected.",
          meta("greater-than", 30, "minutes", "traumatic descending-aortic cross-clamp time", "institution-dependent"))
      ])
    ],

    "d9-iabp": [
      unit("Rationale for Mechanical Circulatory Support", [
        bounded("mcs-goals", "core", "bounded-set",
          "Mechanical circulatory support maintains perfusion, unloads a failing ventricle, and creates time for recovery or definitive therapy.", 3,
          "MCS goals are {{c1::maintain systemic perfusion; unload the ventricle; bridge to recovery-or-decision}}.",
          "Device selection depends on whether the patient needs flow augmentation, active unloading, oxygenation, or biventricular support."),
        contrast("passive-active", "core", "comparison",
          "IABP passively augments the circulation, whereas Impella actively removes blood from the left ventricle.",
          "IABP passively augments flow, whereas Impella provides {{c1::active LV unloading}}.",
          "Active unloading lowers LVEDP and wall stress more directly than counterpulsation."),
        mapping("escalation-triggers", "applied-core", "model",
          "The lesson defines low-output escalation by cardiac index, pressure, filling pressure, and inotrope burden.", 4,
          "MCS escalation triggers map as {{c1::CI → below 2.2; SBP → below 90; filling pressure → above 20; inotropes → at least two}}.",
          "The complete picture is persistent hypoperfusion despite adequate diagnosis and pharmacologic support.",
          { numeric: meta("mapping", "CI below 2.2 / SBP below 90 / filling pressure above 20 / at least two inotropes", "mixed", "lesson MCS escalation triggers", "institution-dependent"), reviewBy: REVIEW_BY }),
        mechanism("correctable-first", "applied-core", "rescue",
          "TEE should exclude tamponade, papillary-muscle rupture, or VSD before escalating to a support device.",
          "Before MCS escalation, TEE must exclude a {{c1::surgically correctable shock cause}}.",
          "Repairing the lesion may eliminate the need for a pump and prevents support from masking the true emergency.")
      ]),
      unit("IABP Mechanism: Counterpulsation", [
        mapping("counterpulsation", "core", "model",
          "IABP inflation augments diastolic coronary pressure, while pre-systolic deflation reduces left-ventricular afterload.", 2,
          "IABP timing maps as {{c1::diastolic inflation → coronary augmentation; pre-systolic deflation → afterload reduction}}.",
          "The balloon does not pump blood independently; it improves the ventricle's supply-demand balance."),
        numeric("output-gain", "core",
          "IABP increases cardiac output by approximately 0.5 to one liter per minute.",
          "IABP output augmentation is about {{c1::0.5–1.0 L/min}}.",
          "This modest support is insufficient as sole therapy for profound refractory shock.",
          meta("range", [0.5, 1], "L/min", "IABP cardiac-output augmentation", "approximate")),
        numeric("afterload-drop", "enrichment",
          "Counterpulsation reduces peak systolic wall stress by approximately 14 to 19 percent.",
          "IABP lowers peak systolic wall stress by about {{c1::14–19%}}.",
          "The reduced wall stress lowers myocardial oxygen demand when timing is correct.",
          meta("range", [14, 19], "%", "IABP peak systolic wall-stress reduction", "approximate")),
        numeric("balloon-volume", "applied-core",
          "Standard adult IABP balloons hold approximately 30 to 40 milliliters.",
          "A standard adult IABP balloon is about {{c1::30–40 mL}}.",
          "It is positioned just distal to the left subclavian artery and should nearly occlude the aorta when inflated.",
          meta("range", [30, 40], "mL", "standard adult IABP balloon volume", "approximate"))
      ]),
      unit("IABP Timing Errors", [
        mapping("timing-errors", "core", "model",
          "Each IABP timing error has a distinct hemodynamic penalty.", 4,
          "IABP errors map as {{c1::early inflation → systolic obstruction; late inflation → lost augmentation; early deflation → lost unloading; late deflation → raised afterload}}.",
          "Inflation belongs at the dicrotic notch, and deflation belongs just before the next systolic upstroke."),
        mechanism("late-deflation", "applied-core", "rescue",
          "Late IABP deflation is most dangerous because the inflated balloon obstructs the next ventricular ejection.",
          "Late IABP deflation is dangerous because it {{c1::increases systolic afterload}}.",
          "The failing LV must eject against an inflated aortic obstruction, increasing oxygen demand and reducing stroke volume."),
        mapping("trigger-ratios", "enrichment", "model",
          "Regular rhythms permit beat-to-beat triggering, while tachycardia may require every-other-beat assistance.", 2,
          "IABP trigger ratios map as {{c1::regular rhythm → 1:1; tachycardia → often 1:2}}.",
          "Chaotic rhythms degrade timing and may require pacing or an asynchronous fallback mode.",
          { numeric: meta("mapping", "1:1 / 1:2", "assist ratio", "IABP rhythm triggering", "institution-dependent"), reviewBy: REVIEW_BY })
      ]),
      unit("IABP Indications and Contraindications", [
        bounded("indications", "core", "bounded-set",
          "IABP can bridge ischemic shock, refractory angina, post-cardiotomy low output, high-risk PCI, or mechanical infarct complications.", 5,
          "IABP indications include {{c1::ischemic cardiogenic shock; refractory unstable angina; post-cardiotomy low output; high-risk PCI; mechanical MI complications}}.",
          "The device is most useful when modest support and coronary augmentation match the failure mode."),
        bounded("contraindications", "applied-core", "bounded-set",
          "Severe aortic regurgitation, dissection, aneurysm, and severe peripheral arterial disease contraindicate IABP use.", 4,
          "IABP contraindications include {{c1::severe aortic regurgitation; aortic dissection; severe aortic aneurysm; severe peripheral arterial disease}}.",
          "Each condition converts balloon pulsation or vascular access into additional harm."),
        numeric("shockii-mortality", "enrichment",
          "IABP-SHOCK II reported 30-day mortality of 39.7 percent with IABP and 41.3 percent without it.",
          "IABP-SHOCK II mortality was {{c1::39.7% versus 41.3%}}.",
          "Routine IABP did not reduce mortality in infarct-related cardiogenic shock treated with early revascularization.",
          meta("comparison", "39.7% versus 41.3%", "%", "IABP-SHOCK II 30-day mortality", "exact")),
        mechanism("ar-harm", "core", "mechanism",
          "Diastolic balloon inflation worsens aortic regurgitation by raising the pressure driving blood back into the left ventricle.",
          "Severe AR contraindicates IABP because diastolic inflation {{c1::increases regurgitant volume}}.",
          "Dissection and aneurysm are unsafe because the pulsating balloon can injure the diseased aortic wall.")
      ]),
      unit("The Impella Device Family", [
        mapping("device-flow", "core", "model",
          "Impella 2.5, CP, and 5.0 or 5.5 provide progressively greater left-ventricular support.", 3,
          "Impella support maps as {{c1::2.5 → 2.5 L/min; CP → about 4 L/min; 5.0-or-5.5 → about 5 L/min}}.",
          "The larger device requires surgical or axillary access but can approach full support.",
          { numeric: meta("mapping", "2.5 / 4 / 5", "L/min", "Impella model support flow", "approximate"), reviewBy: REVIEW_BY }),
        numeric("inlet-depth", "applied-core",
          "The Impella inlet is positioned approximately 3.5 centimeters below the aortic annulus.",
          "The Impella inlet sits about {{c1::3.5 cm below the annulus}}.",
          "Echo, fluoroscopy, and console position signals confirm that the inlet remains in the LV and the outlet in the aorta.",
          meta("approximately", 3.5, "cm", "Impella inlet depth below aortic annulus", "institution-dependent")),
        contrast("iabp-impella", "core", "comparison",
          "Impella directly moves blood from LV to aorta, whereas IABP only counterpulsates within the aorta.",
          "Impella actively pumps LV-to-aorta, whereas IABP {{c1::only augments counterpulsation}}.",
          "Impella therefore reduces LV preload and LVEDP more directly."),
        mechanism("preload-dependence", "core", "mechanism",
          "Impella flow falls when right-heart failure, low volume, or high pulmonary resistance prevents left-ventricular filling.",
          "Impella output is limited by {{c1::adequate LV preload}}.",
          "A left-sided pump cannot deliver flow that the right heart and lungs do not supply.")
      ]),
      unit("Impella Management Priorities", [
        ordered("suction-response", "applied-core",
          "An Impella suction alarm is managed by reducing speed, checking position, assessing volume, assessing the RV, and excluding tamponade.", 5,
          "Impella suction response is {{c1::reduce speed; confirm position; assess volume; assess RV function; exclude tamponade}}.",
          "Increasing speed against an underfilled ventricle worsens tissue ingestion, hemolysis, and arrhythmia."),
        numeric("act-target", "applied-core",
          "The lesson targets an activated clotting time of 160 to 180 seconds during Impella support.",
          "Impella systemic anticoagulation targets ACT {{c1::160–180 seconds}}.",
          "The purge solution and systemic anticoagulation are managed together according to bleeding and thrombosis risk.",
          meta("range", [160, 180], "seconds", "Impella systemic anticoagulation", "institution-dependent")),
        bounded("contraindication-set", "core", "bounded-set",
          "Moderate or severe aortic regurgitation, a mechanical aortic valve, LV thrombus, and severe peripheral disease contraindicate Impella.", 4,
          "Impella contraindications include {{c1::moderate-or-severe AR; mechanical aortic valve; LV thrombus; severe peripheral arterial disease}}.",
          "The catheter crosses the aortic valve and draws directly from the ventricular cavity."),
        bounded("hemolysis-monitoring", "core", "bounded-set",
          "Impella hemolysis surveillance uses plasma-free hemoglobin, LDH, haptoglobin, and urine hemoglobin.", 4,
          "Impella hemolysis monitoring includes {{c1::plasma-free hemoglobin; LDH; haptoglobin; urine hemoglobin}}.",
          "Malposition, high speed, or repeated suction can produce clinically significant shear injury.")
      ])
    ],

    "d9-ecmo": [
      unit("VA-ECMO: Mechanism and Hemodynamics", [
        mechanism("afterload-paradox", "core", "mechanism",
          "Peripheral VA-ECMO restores systemic flow but retrograde arterial return increases left-ventricular afterload.",
          "Femoral VA-ECMO can distend the LV because retrograde flow {{c1::raises aortic afterload}}.",
          "A failing ventricle may stop opening the aortic valve, causing high LVEDP, pulmonary edema, and stasis."),
        mapping("gas-controls", "core", "model",
          "ECMO sweep gas controls carbon-dioxide removal, whereas oxygenator FiO2 controls oxygenation.", 2,
          "ECMO gas controls map as {{c1::sweep flow → CO₂ clearance; circuit FiO₂ → oxygenation}}.",
          "The two gas-exchange variables can be adjusted independently."),
        numeric("flow", "core",
          "Typical VA-ECMO flow is approximately four to six liters per minute.",
          "Typical VA-ECMO flow is {{c1::4–6 L/min}}.",
          "Flow is titrated to perfusion while minimizing hemolysis and left-ventricular afterload.",
          meta("range", [4, 6], "L/min", "adult VA-ECMO circuit flow", "institution-dependent")),
        numeric("rpm", "enrichment",
          "The lesson describes typical centrifugal-pump speed of 3000 to 3200 revolutions per minute.",
          "Typical ECMO pump speed is about {{c1::3000–3200 rpm}}.",
          "Delivered flow remains afterload-dependent and must be measured rather than inferred from speed alone.",
          meta("range", [3000, 3200], "rpm", "adult ECMO centrifugal-pump speed", "institution-dependent")),
        mechanism("stagnant-lv", "applied-core", "rescue",
          "A non-ejecting left ventricle on VA-ECMO accumulates stagnant blood and intracardiac thrombus.",
          "On VA-ECMO, a closed aortic valve creates a {{c1::stagnant thrombus-prone LV}}.",
          "Persistent distension requires active unloading and adequate anticoagulation rather than more retrograde circuit flow.")
      ]),
      unit("North-South Syndrome (Harlequin Syndrome)", [
        mechanism("watershed", "core", "mechanism",
          "North-South syndrome occurs when recovering native output from injured lungs supplies the upper body above the ECMO mixing point.",
          "Harlequin syndrome occurs when the native heart ejects {{c1::poorly oxygenated pulmonary blood}}.",
          "Retrograde femoral ECMO blood then oxygenates the lower body while coronaries and brain remain hypoxic."),
        mapping("saturation-map", "applied-core", "model",
          "Right-radial saturation reflects proximal native output, while foot saturation reflects retrograde femoral ECMO output.", 2,
          "Peripheral VA-ECMO oximetry maps as {{c1::right hand → upper-body native blood; foot → lower-body circuit blood}}.",
          "A normal foot saturation can therefore coexist with cerebral and coronary hypoxia."),
        ordered("treatment", "applied-core",
          "Differential hypoxia treatment escalates through lung optimization, more ECMO flow, hybrid venous return, and central or axillary return.", 4,
          "Harlequin rescue proceeds through {{c1::optimize native lungs; increase circuit flow; add oxygenated venous return; move arterial return centrally}}.",
          "The goal is to oxygenate native ejection or move the mixing point proximally enough to protect the arch vessels.")
      ]),
      unit("VA-ECMO Indications and Complications", [
        bounded("indications-one", "core", "bounded-set",
          "VA-ECMO supports refractory cardiogenic shock, cardiac arrest, post-cardiotomy shock, massive pulmonary embolism, and fulminant myocarditis.", 5,
          "VA-ECMO indications include {{c1::refractory cardiogenic shock; ECPR; post-cardiotomy shock; massive PE collapse; severe myocarditis}}.",
          "Biventricular or combined cardiorespiratory failure requires support beyond an isolated LV device."),
        bounded("complications", "core", "bounded-set",
          "VA-ECMO complications include limb ischemia, bleeding, thrombosis, hemolysis, and infection or circuit failure.", 5,
          "VA-ECMO complications include {{c1::limb ischemia; major bleeding; thromboembolism; hemolysis; infection-or-circuit failure}}.",
          "Frequent limb, neurologic, renal, hematologic, and oxygenator surveillance is essential."),
        numeric("distal-cannula", "applied-core",
          "A distal superficial-femoral perfusion cannula is commonly eight to 10 French in the lesson.",
          "Femoral VA-ECMO distal perfusion commonly uses {{c1::8–10F}}.",
          "The cannula must remain patent, and venous obstruction can still threaten the limb despite arterial perfusion.",
          meta("range", [8, 10], "French", "distal limb perfusion cannula on femoral VA-ECMO", "institution-dependent")),
        numeric("thirty-day-survival", "enrichment",
          "The lesson's historical series reported approximately 38 percent survival at 30 days after ECLS.",
          "Historical ECLS 30-day survival was about {{c1::38%}}.",
          "Outcome is dominated by the underlying catastrophe and early end-organ injury.",
          meta("approximately", 38, "%", "historical ECLS survival at 30 days", "approximate"))
      ]),
      unit("VV-ECMO vs. VA-ECMO", [
        mapping("configuration", "core", "model",
          "VV-ECMO returns oxygenated blood to veins for respiratory support, while VA-ECMO returns to arteries for cardiorespiratory support.", 2,
          "ECMO configurations map as {{c1::VV → respiratory support only; VA → cardiac-plus-respiratory support}}.",
          "VV requires adequate native cardiac output and does not impose the same LV afterload."),
        mechanism("recirculation", "core", "mechanism",
          "VV recirculation occurs when oxygenated return blood is immediately re-aspirated into the drainage cannula.",
          "VV-ECMO efficiency falls when circuit blood undergoes {{c1::venous recirculation}}.",
          "Cannula separation and directed dual-lumen flow reduce this wasted loop."),
        mechanism("conversion", "applied-core", "rescue",
          "A VV-ECMO patient who develops cardiogenic shock or severe RV failure requires arterial or right-heart support.",
          "VV-ECMO becomes insufficient when the patient develops {{c1::cardiac pump failure}}.",
          "Conversion to VA or addition of an RV-specific device matches the new failure mode.")
      ]),
      unit("Managing the ECMO-LV Interaction", [
        bounded("distension-signs", "core", "bounded-set",
          "VA-ECMO LV distension appears as absent aortic-valve opening, rising wedge pressure, LV enlargement, or pulmonary edema.", 4,
          "VA-ECMO LV-distension signs are {{c1::closed aortic valve; rising PCWP; enlarging LV; worsening pulmonary edema}}.",
          "Systemic pressure can look adequate while left-heart congestion and thrombosis risk worsen."),
        mapping("unloading-options", "applied-core", "rescue",
          "Impella, surgical venting, IABP, and atrial septostomy provide different degrees of left-heart decompression.", 4,
          "VA-ECMO unloading maps as {{c1::Impella → active LV unloading; surgical vent → direct drainage; IABP → modest afterload reduction; septostomy → LA decompression}}.",
          "Direct LV unloading is more effective than merely shaving afterload."),
        mechanism("reduce-flow", "applied-core", "rescue",
          "Reducing VA-ECMO flow to the minimum that preserves perfusion can lower the retrograde afterload imposed on the LV.",
          "During LV distension, circuit flow should fall because ECMO flow itself {{c1::creates LV afterload}}.",
          "Flow reduction is paired with an unloading strategy and close systemic-perfusion monitoring.")
      ]),
      unit("Senior reasoning: match the device to the failure mode, and the VA-ECMO afterload paradox", [
        mapping("device-match", "core", "model",
          "Mechanical-support selection follows the failing chamber and whether gas exchange is needed.", 4,
          "Failure modes map as {{c1::isolated LV → Impella-or-IABP; isolated RV → RVAD; biventricular-plus-lung → VA-ECMO; isolated lung → VV-ECMO}}.",
          "Selecting the strongest device without matching physiology can worsen the unsupported chamber."),
        bounded("weaning-markers", "applied-core", "bounded-set",
          "VA-ECMO recovery is shown by maintained perfusion, arterial pulsatility, and aortic-valve opening during a flow-reduction trial.", 3,
          "VA-ECMO weaning requires {{c1::maintained perfusion; preserved pulsatility; opening aortic valve}} during reduced flow.",
          "Recovery is demonstrated by a monitored trial rather than inferred from elapsed time."),
        mechanism("limb-protection", "applied-core", "rescue",
          "The femoral arterial return cannula can obstruct the limb and requires distal superficial-femoral perfusion.",
          "A cold VA-ECMO leg first suggests {{c1::failed distal limb perfusion}}.",
          "The cannula may be absent, kinked, thrombosed, or inadequate, and requires immediate assessment.")
      ]),
      unit("Acute Pulmonary Embolism: Classification & Surgical Embolectomy", [
        mapping("risk-groups", "core", "model",
          "Acute pulmonary embolism is high risk with shock, intermediate risk with RV injury but normal pressure, and low risk without either.", 3,
          "PE risk maps as {{c1::high → shock-or-hypotension; intermediate → RV injury without hypotension; low → no RV strain}}.",
          "Hemodynamic compromise and right-ventricular response matter more than anatomic clot volume alone."),
        mapping("high-risk-threshold", "applied-core", "model",
          "The lesson defines high-risk PE by low systolic pressure or a sustained large pressure drop.", 2,
          "High-risk PE pressure criteria map as {{c1::SBP → below 90 mmHg; drop → over 40 mmHg for over 15 minutes}}.",
          "Shock, collapse, or arrest also places the patient in the high-risk group.",
          { numeric: meta("mapping", "SBP below 90 / drop over 40 for over 15 minutes", "mmHg and minutes", "high-risk pulmonary embolism", "exact"), reviewBy: REVIEW_BY }),
        mechanism("rv-cascade", "core", "mechanism",
          "Pulmonary obstruction raises RV afterload, shifts the septum leftward, and reduces LV filling and systemic output.",
          "Massive PE causes shock when RV pressure overload {{c1::reduces LV preload}}.",
          "Vasoactive mediators amplify mechanical obstruction and can open a PFO for right-to-left hypoxemia."),
        bounded("embolectomy-indications", "applied-core", "bounded-set",
          "Surgical embolectomy is considered for failed or contraindicated thrombolysis, accessible central clot, right-heart thrombus, or impending paradoxical embolism.", 4,
          "Surgical PE indications include {{c1::failed-or-contraindicated lysis; accessible central clot; free right-heart thrombus; impending paradoxical embolism}}.",
          "Persistent postoperative RV failure may require RVAD or ECMO support."),
        ordered("embolectomy-sequence", "enrichment",
          "Surgical pulmonary embolectomy establishes bypass, opens the pulmonary artery, extracts visible clot, and reassesses the RV.", 4,
          "Pulmonary embolectomy proceeds through {{c1::bicaval CPB; pulmonary arteriotomy; visible-clot extraction; RV reassessment}}.",
          "Blind instrumentation of fragile distal pulmonary arteries risks perforation.")
      ])
    ],

    "d9-vad": [
      unit("Durable LVAD: Design and Physiology", [
        mechanism("continuous-flow", "core", "mechanism",
          "Continuous-flow LVAD physiology can eliminate a palpable pulse and make cuff pressure and pulse oximetry unreliable.",
          "In a continuous-flow LVAD patient, perfusion assessment relies on {{c1::Doppler pressure and device flow}}.",
          "Absence of a palpable pulse alone does not diagnose arrest."),
        mapping("pump-design", "core", "model",
          "HeartMate II is an axial extracardiac pump, whereas HeartMate 3 is a magnetically levitated centrifugal intrapericardial pump.", 2,
          "Durable LVAD designs map as {{c1::HeartMate II → axial flow; HeartMate 3 → centrifugal flow}}.",
          "Magnetic levitation reduces rotor contact and pump thrombosis."),
        numeric("flow-target", "core",
          "Durable LVAD speed is commonly set to provide approximately four to six liters per minute while preserving some aortic-valve opening.",
          "Typical durable LVAD flow is {{c1::4–6 L/min}}.",
          "Adequacy also requires ventricular unloading without suction, RV failure, or permanent aortic-valve closure.",
          meta("range", [4, 6], "L/min", "durable continuous-flow LVAD output", "institution-dependent")),
        numeric("map-target", "applied-core",
          "The lesson's continuous-flow LVAD mean arterial-pressure target is approximately 60 to 80 millimeters of mercury.",
          "Cohn's LVAD MAP target is about {{c1::60–80 mmHg}}.",
          "Afterload control preserves pump flow and reduces stroke and aortic-insufficiency risk.",
          meta("range", [60, 80], "mmHg", "continuous-flow LVAD mean arterial pressure", "institution-dependent")),
        mechanism("afterload-flow", "core", "mechanism",
          "At fixed speed, continuous-flow LVAD output falls as the pressure gradient across the pump rises.",
          "LVAD flow falls with hypertension because continuous pumps are {{c1::afterload-sensitive}}.",
          "Treating pressure is often more effective than increasing speed against a high outflow pressure.")
      ]),
      unit("MCS Strategy: BTR, BTT, and Destination Therapy", [
        mapping("strategy-map", "core", "model",
          "Bridge to recovery supports reversible disease, bridge to transplant supports listed candidates, and destination therapy supports non-transplant candidates long term.", 3,
          "MCS strategies map as {{c1::BTR → myocardial recovery; BTT → await transplant; destination therapy → permanent support}}.",
          "The intended endpoint shapes device duration, patient selection, and escalation decisions."),
        numeric("rematch", "enrichment",
          "REMATCH reported an approximately 48 percent mortality reduction with destination LVAD support versus medical therapy.",
          "REMATCH reduced mortality by about {{c1::48%}} with destination LVAD therapy.",
          "The trial established durable support for transplant-ineligible end-stage heart failure.",
          meta("approximately", 48, "%", "REMATCH all-cause mortality reduction", "approximate")),
        contrast("momentum", "core", "evidence",
          "MOMENTUM 3 found less pump thrombosis, stroke, and gastrointestinal bleeding with HeartMate 3 than HeartMate II.",
          "Compared with HeartMate II, HeartMate 3 produced {{c1::fewer major device complications}}.",
          "The magnetically levitated pump became the contemporary durable-device standard."),
        mapping("intermacs-survival", "enrichment", "evidence",
          "The lesson reports declining INTERMACS survival over one, two, and four years of continuous-flow support.", 3,
          "Historical CF-LVAD survival maps as {{c1::1 year → 80%; 2 years → 69%; 4 years → 47%}}.",
          "These historical registry estimates vary with era, device, patient profile, and implant timing.",
          { numeric: meta("mapping", "80 / 69 / 47", "%", "historical INTERMACS CF-LVAD survival", "approximate"), reviewBy: REVIEW_BY })
      ]),
      unit("LVAD Complications: GI Bleeding and Stroke", [
        mechanism("gi-bleeding", "core", "mechanism",
          "Continuous flow promotes GI angiodysplasia and shear-mediated loss of large von Willebrand multimers.",
          "LVAD GI bleeding combines angiodysplasia with {{c1::acquired von Willebrand disease}}.",
          "Anticoagulation adds a third hemostatic burden to the nonpulsatile and shear mechanisms."),
        numeric("bleeding-incidence", "enrichment",
          "Nonsurgical bleeding occurs in approximately 18 to 30 percent of continuous-flow LVAD patients.",
          "Nonsurgical CF-LVAD bleeding occurs in about {{c1::18–30%}}.",
          "GI sources account for most episodes and often recur despite endoscopic treatment.",
          meta("range", [18, 30], "%", "nonsurgical bleeding with continuous-flow LVAD", "approximate")),
        mapping("stroke-incidence", "enrichment", "evidence",
          "The lesson reports LVAD stroke incidence of approximately 11 percent at one year and 17 percent at two years.", 2,
          "LVAD stroke incidence maps as {{c1::1 year → 11%; 2 years → 17%}}.",
          "Events are divided between ischemic embolism and intracranial hemorrhage.",
          { numeric: meta("mapping", "11 / 17", "%", "LVAD stroke incidence", "approximate"), reviewBy: REVIEW_BY }),
        numeric("stroke-map", "applied-core",
          "The lesson targets mean arterial pressure of 70 to 90 millimeters of mercury to reduce LVAD neurologic events.",
          "LVAD stroke prevention targets MAP {{c1::70–90 mmHg}}.",
          "Blood-pressure control is the most consistently modifiable neurologic-risk factor in the cited data.",
          meta("range", [70, 90], "mmHg", "LVAD neurologic-event prevention", "institution-dependent")),
        contrast("stroke-types", "core", "comparison",
          "Under-anticoagulation promotes pump thrombus and embolic stroke, whereas over-anticoagulation promotes hemorrhagic stroke.",
          "Low anticoagulation favors embolism, whereas excessive anticoagulation favors {{c1::hemorrhagic stroke}}.",
          "Blood pressure, device function, and anticoagulation must be managed together within a narrow safety window.")
      ]),
      unit("Pump Thrombosis and Driveline Infection", [
        bounded("thrombosis-signs", "core", "bounded-set",
          "LVAD pump thrombosis presents with hemolysis markers, low-flow alarms, power spikes, or worsening heart failure.", 4,
          "Pump-thrombosis clues include {{c1::hemolysis; low-flow alarms; power spikes; hemodynamic deterioration}}.",
          "The combination requires urgent device interrogation and laboratory evaluation."),
        numeric("free-hgb", "applied-core",
          "The lesson uses plasma-free hemoglobin above 40 milligrams per deciliter as a hemolysis threshold.",
          "LVAD hemolysis concern rises above plasma-free hemoglobin {{c1::40 mg/dL}}.",
          "Trend interpretation is paired with LDH, urine color, pump power, and the clinical state.",
          meta("greater-than", 40, "mg/dL", "LVAD suspected pump-thrombosis hemolysis", "institution-dependent")),
        numeric("ldh", "applied-core",
          "The lesson uses LDH above 600 international units per liter as a suspected-thrombosis signal.",
          "LVAD thrombosis concern rises above LDH {{c1::600 IU/L}}.",
          "LDH is often the more sensitive early marker and should be interpreted relative to baseline and laboratory limits.",
          meta("greater-than", 600, "IU/L", "LVAD suspected pump thrombosis", "institution-dependent")),
        mapping("infection-incidence", "enrichment", "evidence",
          "The lesson reports driveline infection in 19 percent by one year and approximately one quarter by two years.", 2,
          "Driveline infection maps as {{c1::1 year → 19%; 2 years → about 25%}}.",
          "The permanent skin breach makes meticulous anchoring, dressing, and early treatment essential.",
          { numeric: meta("mapping", "19 / about 25", "%", "LVAD driveline infection by implant duration", "approximate"), reviewBy: REVIEW_BY }),
        ordered("thrombosis-treatment", "applied-core",
          "Pump-thrombosis treatment escalates from parenteral anticoagulation to thrombolysis and then definitive device exchange or transplant.", 3,
          "Pump-thrombosis escalation is {{c1::IV anticoagulation; selected thrombolysis; pump exchange-or-transplant}}.",
          "Hemodynamic collapse or refractory hemolysis should not be observed indefinitely on medical therapy.")
      ]),
      unit("Right Heart Failure After LVAD", [
        mechanism("rv-failure", "core", "mechanism",
          "LVAD unloading increases transpulmonary flow and shifts the septum leftward, which can overwhelm a marginal right ventricle.",
          "After LVAD implantation, RV failure reflects increased preload plus {{c1::loss of septal support}}.",
          "The failing RV then cannot fill the LV or the device, producing low pump flow despite adequate settings."),
        numeric("rvf-incidence", "enrichment",
          "Post-LVAD right-heart failure occurs in approximately 15 to 30 percent of recipients.",
          "Post-LVAD RV failure occurs in about {{c1::15–30%}}.",
          "Preoperative RV dysfunction, high venous pressure, pulmonary vascular disease, and severe TR increase risk.",
          meta("range", [15, 30], "%", "right-heart failure after LVAD", "approximate")),
        numeric("rv-support", "enrichment",
          "Approximately eight to 10 percent of LVAD recipients require mechanical right-ventricular support in the lesson.",
          "Mechanical RV support is needed in about {{c1::8–10%}} after LVAD.",
          "Early recognition permits planned rather than crash RVAD deployment.",
          meta("range", [8, 10], "%", "mechanical RV support after LVAD", "approximate")),
        bounded("rv-treatment", "applied-core", "bounded-set",
          "Post-LVAD RV failure treatment uses inotropy, diuresis, pulmonary vasodilation, and mechanical RV support when needed.", 4,
          "Post-LVAD RV support includes {{c1::RV inotropy; volume restraint; pulmonary vasodilators; temporary RVAD}}.",
          "Sinus rhythm and atrioventricular synchrony are also protected."),
        mechanism("speed-pitfall", "applied-core", "rescue",
          "Increasing LVAD speed can worsen RV failure by pulling the septum farther leftward.",
          "During post-LVAD RV failure, higher pump speed can {{c1::worsen septal leftward shift}}.",
          "Low flow from inadequate RV delivery is not solved by asking the LV pump to suction harder.")
      ]),
      unit("Aortic Insufficiency and the LVAD Patient in Cardiac Arrest", [
        mechanism("ai-loop", "core", "mechanism",
          "LVAD-associated aortic insufficiency creates a closed loop from pump to aorta, through the valve, and back into the LV.",
          "Severe LVAD aortic insufficiency causes {{c1::ineffective recirculation through the LV}}.",
          "Displayed pump flow may look adequate while effective systemic forward flow is poor."),
        ordered("arrest-assessment", "applied-core",
          "An unresponsive LVAD patient is assessed by pump sound, controller power and alarms, Doppler flow, and then CPR only if no flow exists.", 4,
          "LVAD arrest assessment is {{c1::listen for pump hum; inspect controller; check Doppler flow; start CPR only without flow}}.",
          "Pulselessness and unreadable oximetry are expected in continuous flow and cannot define arrest alone."),
        atomic("no-compressions", "applied-core", "rescue",
          "Chest compressions are withheld when an LVAD is running and Doppler flow confirms perfusion.",
          "With pump hum and Doppler flow, the immediate CPR action is {{c1::withhold chest compressions}}.",
          "Compressions can disrupt the apical inflow cannula or outflow graft and cause catastrophic bleeding."),
        mechanism("mechanical-av", "applied-core", "mechanism",
          "A mechanical aortic prosthesis is unsafe with durable LVAD support because infrequent opening promotes thrombosis and embolism.",
          "During LVAD implantation, a mechanical aortic valve must be {{c1::surgically excluded or replaced}}.",
          "A bioprosthesis or closure strategy avoids a stagnant mechanical prosthesis in a rarely opening valve position.")
      ]),
      unit("PGY-5 mastery: the escalation ladder and the distending LV on VA-ECMO", [
        ordered("shock-escalation", "core",
          "Shock support escalates through reversible-cause correction, pharmacology, temporary mechanical support, and durable support or transplant.", 4,
          "The shock escalation ladder is {{c1::correct reversible causes; optimize drugs; add temporary MCS; bridge to durable therapy}}.",
          "Each rung has a physiologic trigger rather than an arbitrary time threshold."),
        ordered("ecmo-venting", "applied-core",
          "A distending LV on peripheral VA-ECMO is unloaded by Impella, IABP, septostomy, or surgical vent according to availability and severity.", 4,
          "VA-ECMO LV-venting options are {{c1::Impella; IABP; atrial septostomy; surgical LV vent}}.",
          "Circuit flow is simultaneously reduced to the minimum that maintains systemic perfusion."),
        mechanism("rv-loop", "applied-core", "mechanism",
          "After LVAD implantation, restored transpulmonary flow and leftward septal shift can precipitate right-heart failure.",
          "Post-LVAD RV failure is treated as a right-sided problem, not a {{c1::pump-speed deficit}}.",
          "Inotropy, pulmonary vasodilation, volume restraint, and RVAD support address the actual failure mode.")
      ])
    ]
  };

  window.FLASHCARD_MEDICAL_REVIEW_FLAGS_D6_D9 = [
    {
      scope: "d6-indications,d6-conduits,d6-technique",
      issue: "Reconcile all 2021 coronary-revascularization classes, evidence levels, carotid thresholds, and perioperative antiplatelet intervals against the newest guideline before clinical release.",
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY, status: "clinician-review-required"
    },
    {
      scope: "d6-technique",
      issue: "Confirm CPB heparin, ACT, flow, cardioplegia, and transit-time-flow thresholds against local perfusion and surgical protocols.",
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY, status: "clinician-review-required"
    },
    {
      scope: "d7-savr,d7-tavr,d7-mitral,d7-prosthetics",
      issue: "Verify valve age bands, prosthesis INR targets, On-X exception, TAVR platform event rates, antithrombotic strategy, and intervention thresholds against current valve guidance.",
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY, status: "clinician-review-required"
    },
    {
      scope: "d8-aneurysm,d8-dissection",
      issue: "Resolve internally inconsistent heritable-aortopathy thresholds and validate dissection, cerebral-perfusion, TEVAR, CSF-drainage, and spinal-cord protection targets.",
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY, status: "clinician-review-required"
    },
    {
      scope: "d8-pericardium",
      issue: "Validate invasive thresholds, post-operative tamponade rates, pericardiectomy outcomes, trauma windows, and tumor epidemiology before clinical release.",
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY, status: "clinician-review-required"
    },
    {
      scope: "d9-iabp,d9-ecmo,d9-vad",
      issue: "Validate device-era flows, positions, anticoagulation targets, alarm thresholds, outcome rates, pressure targets, cannula sizing, and emergency algorithms.",
      reviewedAt: REVIEWED_AT, reviewBy: REVIEW_BY, status: "clinician-review-required"
    }
  ];

  Object.entries(authored).forEach(([lessonId, units]) => {
    const lesson = window.LESSONS && window.LESSONS[lessonId];
    if (!lesson || !Array.isArray(lesson.chunks)) {
      throw new Error("Missing authored lesson " + lessonId);
    }
    const byTitle = new Map(units.map(record => [record.title, record.entries]));
    const claims = [];
    const cards = [];

    lesson.chunks.forEach((chunk, chunkIndex) => {
      if (!chunk || chunk.type === "checkpoint") return;
      const title = chunk.title || chunk.q || "chunk-" + (chunkIndex + 1);
      const partId = safeId(title);
      chunk.partId = partId;
      if (!chunk.id) chunk.id = lessonId + ":" + partId;
      const sourceRef = { type: "lesson", id: lessonId, partId: chunk.id };
      const entries = byTitle.get(title);
      if (!Array.isArray(entries) || !entries.length) {
        throw new Error(lessonId + " has no authored retrieval claims for " + chunk.id);
      }
      byTitle.delete(title);

      entries.forEach(record => {
        const claimId = lessonId + "." + partId + "." + record.key;
        const cardId = opaqueId(claimId);
        claims.push({
          claimId,
          sourceRefs: [sourceRef],
          tier: record.tier,
          category: record.category,
          statement: record.statement,
          required: record.tier === "core" || record.tier === "applied-core",
          cardIds: [cardId],
          disposition: "carded",
          rationale: "Authored retrieval objective preserving a distinct lesson claim.",
          reviewer: REVIEWER,
          reviewedAt: REVIEWED_AT
        });
        cards.push(Object.assign({
          id: cardId,
          claimIds: [claimId],
          source: sourceRef,
          sourceRefs: [sourceRef]
        }, polishCard(record.card)));
      });
    });

    if (byTitle.size) {
      throw new Error(lessonId + " has unmatched authored units: " + Array.from(byTitle.keys()).join(", "));
    }

    window.FlashcardSchema.registerPack({
      source: { type: "lesson", id: lessonId },
      claims,
      cards,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      reviewBy: REVIEW_BY,
      citation: { type: "lesson", id: lessonId },
      rebuild: true,
      workloadJustification: cards.length > 40
        ? "Dense surgical lesson requires distinct retrieval of core decisions, procedural sequences, and safety thresholds."
        : undefined
    });
  });
})();
