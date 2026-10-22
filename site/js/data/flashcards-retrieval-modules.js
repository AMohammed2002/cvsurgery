/* Retrieval-v2 rebuild for supporting modules: evidence, vivas, physiology,
   angiography, and independent exercise objectives. */
"use strict";

(function registerSupportingModuleRetrieval() {
  if (!window.FlashcardSchema) throw new Error("Supporting-module retrieval requires flashcard-schema.js");

  const REVIEWER = "assistant-editorial-review";
  const REVIEWED_AT = "2026-07-31";
  const NUMERIC_REVIEW_BY = "2028-07-31";
  const GUIDELINE_REVIEW_BY = "2027-07-31";
  const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
  const generatedIds = new Set();

  function safeId(value) {
    return String(value == null ? "part" : value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "part";
  }
  function opaqueId(seed) {
    let left = 0x811c9dc5, right = 0x9e3779b9;
    for (let index = 0; index < seed.length; index += 1) {
      left = Math.imul(left ^ seed.charCodeAt(index), 0x01000193);
      right = Math.imul(right ^ (seed.charCodeAt(index) + index), 0x85ebca6b);
    }
    let body = "";
    for (let index = 0; index < 26; index += 1) {
      left = Math.imul(left ^ (left >>> 15) ^ index, 0x2c1b3c6d);
      right = Math.imul(right ^ (right >>> 13) ^ left, 0x297a2d39);
      body += ALPHABET[((left ^ right) >>> 0) % ALPHABET.length];
    }
    const id = "fc2_" + body;
    if (generatedIds.has(id)) throw new Error("Supporting-module opaque ID collision: " + seed);
    generatedIds.add(id);
    return id;
  }
  function N(comparator, value, unit, condition, precision) {
    return {
      numeric: { comparator: Array.isArray(value) ? "range" : comparator, value: value, unit: unit, condition: condition, precision: precision },
      reviewBy: NUMERIC_REVIEW_BY,
      medicalReviewRequired: true,
      reviewReason: "Decision-changing numeric target requires clinician confirmation."
    };
  }
  function G(sourceId, organization, year, recommendationClass, evidenceLevel) {
    return {
      guideline: {
        sourceId: sourceId,
        organization: organization,
        year: year,
        recommendationClass: recommendationClass,
        evidenceLevel: evidenceLevel,
        reviewedAt: REVIEWED_AT,
        reviewBy: GUIDELINE_REVIEW_BY
      },
      reviewBy: GUIDELINE_REVIEW_BY,
      medicalReviewRequired: true,
      reviewReason: "Guideline-dependent recommendation requires clinician confirmation and currency review."
    };
  }
  function H(reason) {
    return {
      reviewBy: NUMERIC_REVIEW_BY,
      medicalReviewRequired: true,
      reviewReason: reason || "High-stakes treatment target requires clinician and local-protocol confirmation."
    };
  }
  function A(cloze, explanation, legacyId, extra) {
    return Object.assign({ archetype: "atomic-concept", cloze: cloze, explanation: explanation, legacyId: legacyId || null }, extra || {});
  }
  function M(cloze, explanation, legacyId, extra) {
    return Object.assign({ archetype: "mechanism-decision", cloze: cloze, explanation: explanation, legacyId: legacyId || null }, extra || {});
  }
  function B(cloze, explanation, answerCount, legacyId, extra) {
    return Object.assign({ archetype: "bounded-set", cloze: cloze, explanation: explanation, answerCount: answerCount, ordered: false, legacyId: legacyId || null }, extra || {});
  }
  function MP(cloze, explanation, answerCount, legacyId, extra) {
    return Object.assign({ archetype: "mapping-set", cloze: cloze, explanation: explanation, answerCount: answerCount, ordered: false, legacyId: legacyId || null }, extra || {});
  }
  function SQ(cloze, explanation, answerCount, legacyId, extra) {
    return Object.assign({ archetype: "ordered-sequence", cloze: cloze, explanation: explanation, answerCount: answerCount, ordered: true, legacyId: legacyId || null }, extra || {});
  }
  function F(cloze, explanation, legacyId, extra) {
    return Object.assign({ archetype: "formula", cloze: cloze, explanation: explanation, legacyId: legacyId || null }, extra || {});
  }
  function Q(cloze, explanation, metadata, legacyId, extra) {
    return Object.assign({ archetype: "numeric-guideline", cloze: cloze, explanation: explanation, legacyId: legacyId || null }, metadata || {}, extra || {});
  }
  function IMG(cloze, explanation, image, legacyId, extra) {
    return Object.assign({ archetype: "image-identification", cloze: cloze, explanation: explanation, image: image, legacyId: legacyId || null }, extra || {});
  }
  function S(key, parts, tier, category, statement, card, disposition, rationale) {
    return {
      key: key,
      parts: Array.isArray(parts) ? parts : [parts],
      tier: tier,
      category: category,
      statement: statement,
      card: card || null,
      disposition: disposition || (card ? "carded" : "supporting-context"),
      rationale: rationale || (card ? "This is a distinct source-grounded retrieval target." : "This source detail supports a carded target without adding a separate retrieval burden.")
    };
  }
  function registerSource(type, id, title, specs, citation) {
    const prefix = "module." + type + "." + safeId(id) + ".";
    const claims = specs.map(spec => ({
      claimId: prefix + spec.key,
      sourceRefs: spec.parts.map(partId => ({ type: type, id: id, partId: partId })),
      tier: spec.tier,
      category: spec.category,
      statement: spec.statement,
      disposition: spec.disposition,
      rationale: spec.rationale
    }));
    const cards = specs.filter(spec => spec.card).map(spec => {
      const card = Object.assign({}, spec.card);
      const legacyId = card.legacyId;
      delete card.legacyId;
      card.id = legacyId || opaqueId(type + ":" + id + ":" + spec.key);
      card.identityDisposition = legacyId ? "equivalent-rewrite" : "new-target";
      card.claimIds = [prefix + spec.key];
      card.cloze = String(card.cloze).replace(/(\d)-(\d)/g, "$1–$2");
      return card;
    });
    window.FlashcardSchema.registerPack({
      source: { type: type, id: id },
      citation: citation || (title + " source module"),
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      workloadJustification: "This source rebuild separates population, interpretation, mechanism, action, limitation, and rescue targets instead of sampling paragraph clozes.",
      claims: claims,
      cards: cards
    });
  }

  /* ====================================================================
     LANDMARK EVIDENCE — population, result, tradeoff, and limitation.
     ==================================================================== */
  const TRIAL_SPECS = {
    syntax: [
      S("population", "population", "core", "evidence", "SYNTAX studied de novo left-main or three-vessel coronary disease.", A("SYNTAX studied left-main or {{c1::three-vessel coronary disease}}.", "Anatomic complexity was scored before PCI-versus-CABG interpretation.", "evidence-syntax-05")),
      S("result", "result", "core", "evidence", "PCI produced more MACCE than CABG, especially with high anatomic complexity.", M("In SYNTAX, high-complexity disease favored {{c1::CABG}} over PCI.", "Repeat revascularization drove much of the PCI disadvantage.", "evidence-syntax-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "CABG reduced later revascularization whereas early stroke was more frequent.", M("SYNTAX favored CABG durability but showed more early {{c1::stroke}}.", "The early neurologic tradeoff diminished over longer follow-up.", "evidence-syntax-03")),
      S("limitation", "limitation", "applied-core", "evidence", "SYNTAX used first-generation paclitaxel-eluting stents and requires era-aware interpretation.", M("A major SYNTAX-era limitation is its {{c1::first-generation PCI technology}}.", "Modern stents changed PCI performance, but complexity remains clinically important.", "evidence-syntax-08"))
    ],
    freedom: [
      S("population", "population", "core", "evidence", "FREEDOM enrolled patients with diabetes and multivessel coronary disease without left-main disease.", M("FREEDOM applies to diabetes with {{c1::multivessel coronary disease}}.", "Left-main disease was excluded from this comparison.", "evidence-freedom-05")),
      S("result", "result", "core", "evidence", "CABG reduced death and myocardial infarction versus drug-eluting-stent PCI.", M("In FREEDOM, the strategy reducing death and MI was {{c1::CABG}}.", "The benefit emerged over time and established the preferred strategy for suitable patients.", "evidence-freedom-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "CABG improved death and MI outcomes but caused more stroke.", M("FREEDOM favored CABG for death and MI but increased {{c1::stroke}}.", "The tradeoff belongs in shared decision-making rather than being hidden by the composite.", "evidence-freedom-03")),
      S("limitation", "limitation", "applied-core", "evidence", "FREEDOM should not be generalized to patients without diabetes or to left-main disease.", M("FREEDOM does not directly answer revascularization for {{c1::left-main disease}}.", "Its enrolled population had diabetes and multivessel disease without left-main involvement.", "evidence-freedom-08"))
    ],
    excel: [
      S("population", "population", "core", "number", "EXCEL studied left-main disease with low or intermediate anatomic complexity.", Q("EXCEL enrolled left-main disease with SYNTAX score {{c1::32 or less}}.", "The result should not be extrapolated to high-complexity left-main anatomy.", N("<=", 32, "SYNTAX points", "EXCEL left-main enrollment complexity", "exact"), "evidence-excel-05")),
      S("result", "result", "core", "evidence", "PCI met three-year noninferiority to CABG for death, stroke, or myocardial infarction.", M("At three years, EXCEL found PCI {{c1::noninferior to CABG}}.", "The endpoint combined death, stroke, and myocardial infarction.", "evidence-excel-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "PCI offered less invasive recovery whereas late mortality and repeat events raised concern.", M("EXCEL's early PCI result was tempered by a late {{c1::mortality signal}}.", "Five-year all-cause mortality was numerically higher with PCI.", "evidence-excel-03")),
      S("limitation", "limitation", "applied-core", "evidence", "The periprocedural myocardial-infarction definition generated major interpretive controversy.", M("EXCEL interpretation is limited by its disputed {{c1::MI definition}}.", "Endpoint construction partly explains disagreement with NOBLE.", "evidence-excel-08"))
    ],
    noble: [
      S("population", "population", "core", "evidence", "NOBLE studied significant left-main coronary disease in PCI-versus-CABG candidates.", A("NOBLE compared PCI with CABG for {{c1::left-main coronary disease}}.", "Both strategies were considered technically feasible at enrollment.", "evidence-noble-05")),
      S("result", "result", "core", "evidence", "PCI failed noninferiority and produced more five-year MACCE than CABG.", M("At five years, NOBLE favored {{c1::CABG}} over PCI.", "Nonprocedural MI and repeat revascularization drove the difference.", "evidence-noble-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "CABG reduced later events but caused more early stroke.", M("NOBLE favored CABG durability but showed more early {{c1::stroke}}.", "The timing and type of events matter when discussing the composite.", "evidence-noble-03")),
      S("limitation", "limitation", "applied-core", "evidence", "NOBLE used different stents and endpoint definitions from EXCEL.", M("NOBLE-EXCEL discordance partly reflects different {{c1::endpoint definitions}}.", "The trials cannot be compared from headlines alone.", "evidence-noble-08"))
    ],
    stich: [
      S("population", "population", "core", "number", "STICH enrolled CABG-amenable coronary disease with LVEF at or below 35 percent.", Q("STICH enrolled ischemic cardiomyopathy with LVEF {{c1::35% or less}}.", "Patients also needed coronary anatomy suitable for bypass.", N("<=", 35, "% LVEF", "STICH ischemic-cardiomyopathy population", "exact"), "evidence-stich-05")),
      S("result", "result", "core", "evidence", "At ten years CABG plus medical therapy reduced mortality versus medical therapy alone.", M("The STICHES ten-year survival strategy was {{c1::CABG plus medical therapy}}.", "The late benefit offset the early operative hazard.", "evidence-stich-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "CABG imposed early operative risk but produced long-term survival benefit.", M("STICH showed early surgical hazard but later {{c1::survival benefit}}.", "Patients must live long enough to realize the delayed advantage.", "evidence-stich-03")),
      S("limitation", "limitation", "applied-core", "evidence", "The five-year primary analysis was neutral and viability did not identify differential benefit.", M("In STICH, viability testing did not identify {{c1::differential CABG benefit}}.", "The clear mortality signal appeared in extended ten-year follow-up.", "evidence-stich-08"))
    ],
    art: [
      S("population", "population", "core", "evidence", "ART enrolled first-time CABG patients requiring at least two grafts.", M("ART studied first-time CABG requiring {{c1::at least two grafts}}.", "It compared bilateral with single internal mammary strategies.", "evidence-art-05")),
      S("result", "result", "core", "evidence", "Bilateral IMA grafting did not significantly reduce ten-year mortality versus single IMA.", M("At ten years, ART found no significant mortality advantage from {{c1::bilateral IMA grafting}}.", "The randomized result differed from favorable observational associations.", "evidence-art-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Bilateral IMA offered potential durability but increased sternal wound complications.", M("In ART, bilateral IMA increased {{c1::sternal wound complications}}.", "Risk was especially important in patients with diabetes or obesity.", "evidence-art-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Crossover and limited power for mortality complicated ART interpretation.", M("ART's mortality interpretation is weakened by {{c1::treatment crossover}}.", "Conduit expertise and harvesting technique also affect generalizability.", "evidence-art-08"))
    ],
    rooby: [
      S("population", "population", "core", "evidence", "ROOBY studied predominantly male veterans undergoing CABG in VA centers.", M("ROOBY mainly enrolled {{c1::male veterans}} undergoing CABG.", "That population constrains broad generalization.", "evidence-rooby-05")),
      S("result", "result", "core", "evidence", "Off-pump CABG produced worse patency and long-term outcomes than on-pump CABG.", M("ROOBY favored {{c1::on-pump CABG}} for durable outcomes.", "Lower off-pump graft patency contributed to the difference.", "evidence-rooby-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Routine off-pump surgery underperformed, but anaortic strategies may help selected aortic-risk patients.", M("ROOBY disfavors routine off-pump CABG but not {{c1::selected anaortic use}}.", "Severe aortic calcification can change the mechanism and choice.", "evidence-rooby-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Variable operator off-pump experience limits interpretation.", M("ROOBY is sensitive to differing {{c1::off-pump operator experience}}.", "Technical proficiency directly affects completeness and graft quality.", "evidence-rooby-08"))
    ],
    partner1: [
      S("population", "population", "core", "evidence", "PARTNER 1 enrolled inoperable or high-risk severe aortic stenosis.", B("PARTNER 1 populations were {{c1::inoperable severe AS; high-risk severe AS}}.", "Parallel cohorts compared TAVR with standard therapy or SAVR.", 2, "evidence-partner1-05")),
      S("result", "result", "core", "evidence", "TAVR improved survival in inoperable patients and was noninferior to SAVR at high risk.", MP("PARTNER 1 mapped as {{c1::inoperable → TAVR improved survival; high risk → TAVR matched SAVR}}.", "The trial established TAVR across two distinct high-risk settings.", 2, "evidence-partner1-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Early TAVR caused more stroke, leak, and vascular complications whereas SAVR caused more AF.", M("PARTNER 1 TAVR improved access to treatment but increased {{c1::vascular complications}}.", "Large early-generation delivery systems contributed to this tradeoff.", "evidence-partner1-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Early-generation devices and selected high-risk anatomy limit modern extrapolation.", M("PARTNER 1 used {{c1::early-generation TAVR devices}}.", "Modern access, valves, and patient selection differ substantially.", "evidence-partner1-08"))
    ],
    partner2: [
      S("population", "population", "core", "evidence", "PARTNER 2 enrolled intermediate-risk severe aortic stenosis.", M("PARTNER 2 studied severe AS at {{c1::intermediate surgical risk}}.", "The mean risk profile was lower than PARTNER 1.", "evidence-partner2-05")),
      S("result", "result", "core", "evidence", "TAVR was noninferior to SAVR for death or disabling stroke at two years.", M("PARTNER 2 found TAVR {{c1::noninferior to SAVR}}.", "The transfemoral subgroup showed an additional advantage.", "evidence-partner2-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "TAVR caused more leak and pacemakers whereas SAVR caused more AF and AKI.", MP("PARTNER 2 tradeoffs were {{c1::TAVR → leak/pacemaker; SAVR → AF/AKI}}.", "Device and surgical complications differed even when the composite was similar.", 2, "evidence-partner2-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Benefits were approach-dependent and long-term valve durability remained uncertain.", M("PARTNER 2's TAVR advantage was strongest with {{c1::transfemoral access}}.", "A transthoracic approach should not inherit the same conclusion.", "evidence-partner2-08"))
    ],
    partner3: [
      S("population", "population", "core", "evidence", "PARTNER 3 enrolled selected low-risk severe aortic stenosis suitable for transfemoral treatment.", M("PARTNER 3 studied selected {{c1::low-risk severe AS}} patients.", "Suitability for transfemoral balloon-expandable TAVR was essential.", "evidence-partner3-05")),
      S("result", "result", "core", "evidence", "TAVR reduced the one-year composite of death, stroke, or rehospitalization versus SAVR.", M("At one year, PARTNER 3 favored {{c1::TAVR}} over SAVR.", "Lower procedural morbidity contributed to the composite advantage.", "evidence-partner3-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "TAVR improved early recovery but caused more leak and pacing problems.", M("PARTNER 3 favored early TAVR outcomes but retained more {{c1::paravalvular leak}}.", "SAVR caused more new atrial fibrillation.", "evidence-partner3-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Long-term durability and coronary-access consequences remain incompletely defined in younger patients.", M("PARTNER 3 cannot yet settle long-term {{c1::valve durability}}.", "Lifetime valve and coronary-access planning remain necessary.", "evidence-partner3-08"))
    ]
  };

  Object.keys(TRIAL_SPECS).forEach(id => registerSource("evidence", id, id.toUpperCase(), TRIAL_SPECS[id], "Landmark trial source: " + id));

  const TRIAL_SPECS_2 = {
    surtavi: [
      S("population", "population", "core", "evidence", "SURTAVI studied intermediate-risk severe aortic stenosis.", M("SURTAVI studied severe AS at {{c1::intermediate surgical risk}}.", "It evaluated a self-expanding valve platform.", "evidence-surtavi-05")),
      S("result", "result", "core", "evidence", "Self-expanding TAVR was noninferior to SAVR for death or disabling stroke.", M("SURTAVI found self-expanding TAVR {{c1::noninferior to SAVR}}.", "The result corroborated intermediate-risk balloon-expandable evidence.", "evidence-surtavi-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "TAVR caused more pacemakers whereas SAVR caused more AF and AKI.", MP("SURTAVI tradeoffs were {{c1::TAVR → pacemaker; SAVR → AF/AKI}}.", "The conduction penalty was especially important with the self-expanding platform.", 2, "evidence-surtavi-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Platform-specific conduction effects limit extrapolation to all TAVR devices.", M("SURTAVI's high pacemaker burden was {{c1::device-platform dependent}}.", "Implant depth and frame interaction affect conduction risk.", "evidence-surtavi-08"))
    ],
    "evolut-lowrisk": [
      S("population", "population", "core", "evidence", "Evolut Low Risk enrolled low-risk severe aortic stenosis.", M("Evolut Low Risk studied {{c1::low-risk severe AS}} patients.", "The intervention used a self-expanding valve.", "evidence-evolut-lowrisk-05")),
      S("result", "result", "core", "evidence", "Self-expanding TAVR was noninferior to SAVR for death or disabling stroke.", M("Evolut Low Risk found TAVR {{c1::noninferior to SAVR}}.", "Early valve hemodynamics favored the supra-annular transcatheter platform.", "evidence-evolut-lowrisk-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "TAVR produced larger valve areas but more leak and pacemakers.", MP("Evolut tradeoffs were {{c1::TAVR → larger EOA; TAVR → more leak/pacemakers}}.", "Hemodynamic gain did not erase conduction and sealing complications.", 2, "evidence-evolut-lowrisk-03")),
      S("limitation", "limitation", "applied-core", "evidence", "Bayesian analysis and immature durability data constrain long-term interpretation.", M("Evolut Low Risk cannot yet define long-term {{c1::durability}}.", "Young low-risk patients require lifetime valve planning beyond early endpoints.", "evidence-evolut-lowrisk-08"))
    ],
    everest2: [
      S("population", "population", "core", "evidence", "EVEREST II primarily studied operable degenerative mitral regurgitation.", M("EVEREST II mainly enrolled {{c1::degenerative mitral regurgitation}}.", "This differs from COAPT's secondary-MR population.", "evidence-everest2-05")),
      S("result", "result", "core", "evidence", "Surgery was more effective than MitraClip for durable MR reduction.", M("In EVEREST II, the more effective MR treatment was {{c1::surgery}}.", "More clip patients had residual MR or needed later surgery.", "evidence-everest2-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "MitraClip was safer procedurally but less effective than surgery.", MP("EVEREST II mapped as {{c1::MitraClip → safer; surgery → more effective}}.", "The safety-efficacy tradeoff shaped later high-risk selection.", 2, "evidence-everest2-03")),
      S("limitation", "limitation", "applied-core", "evidence", "EVEREST II should not be used as direct evidence for COAPT-like secondary MR.", M("EVEREST II does not directly answer {{c1::secondary-MR heart failure}}.", "Its population was predominantly primary degenerative MR.", "evidence-everest2-08"))
    ],
    coapt: [
      S("population", "population", "core", "evidence", "COAPT enrolled symptomatic heart failure with severe secondary MR despite optimized therapy.", B("COAPT required {{c1::LVEF 20–50%; severe secondary MR; optimized GDMT}}.", "Strict residual-MR and anatomic selection are central to applying the result.", 3, "evidence-coapt-05", N("range", [20, 50], "% LVEF", "COAPT eligibility alongside severe secondary MR despite optimized GDMT", "exact"))),
      S("result", "result", "core", "evidence", "MitraClip reduced heart-failure hospitalization and mortality versus medical therapy alone.", B("COAPT MitraClip reduced {{c1::HF hospitalization; all-cause mortality}}.", "Both endpoints improved in carefully selected patients.", 2, "evidence-coapt-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Procedural treatment added device risk but improved symptoms and survival when MR remained disproportionate.", M("COAPT's device benefit requires MR persisting despite {{c1::optimized GDMT}}.", "Intervention before medical optimization does not reproduce the trial.", "evidence-coapt-03")),
      S("limitation", "limitation", "applied-core", "evidence", "MITRA-FR discordance demonstrates that broader selection does not guarantee benefit.", M("COAPT generalization is limited by its {{c1::strict selection criteria}}.", "MR severity, LV size, therapy optimization, and anatomy must match.", "evidence-coapt-08"))
    ],
    "instead-xl": [
      S("population", "population", "core", "evidence", "INSTEAD-XL studied stable uncomplicated type B aortic dissection.", M("INSTEAD-XL applies to stable {{c1::uncomplicated type B dissection}}.", "Rupture or malperfusion would define a different emergency population.", "evidence-instead-xl-05")),
      S("result", "result", "core", "evidence", "TEVAR improved remodeling and late aorta-specific outcomes without early survival benefit.", B("INSTEAD-XL TEVAR improved {{c1::aortic remodeling; late aortic outcomes}}.", "The early INSTEAD phase did not show a survival advantage.", 2, "evidence-instead-xl-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Preemptive TEVAR improved late aortic biology but added an early procedure without early survival gain.", M("INSTEAD-XL's remodeling benefit came without early {{c1::survival benefit}}.", "That timing tradeoff drives individualized selection.", "evidence-instead-xl-03")),
      S("limitation", "limitation", "applied-core", "evidence", "All-cause survival benefit remains uncertain in uncomplicated disease.", M("INSTEAD-XL does not prove improved {{c1::all-cause survival}}.", "Its strongest signal is aorta-specific remodeling and late events.", "evidence-instead-xl-08"))
    ],
    "aortic-size-thresholds": [
      S("population", "population", "core", "guideline", "Aortic size guidance applies to asymptomatic thoracic or abdominal aneurysm with phenotype-specific thresholds.", M("Aortic size guidance must first identify the {{c1::segment and phenotype}}.", "Root, ascending, descending, abdominal, genetic, and valve-associated disease differ.", "evidence-aortic-size-thresholds-05", G("acc-aha-aortic-disease-2022", "ACC/AHA", 2022, "not-stated-in-source", "not-stated-in-source"))),
      S("result", "result", "core", "guideline", "Sporadic root or ascending aneurysm repair is generally recommended at 5.5 cm.", Q("For sporadic root or ascending aneurysm, the standard repair threshold is {{c1::5.5 cm}}.", "Selected expert-center, genetic, growth, valve, and body-size contexts use lower thresholds.", Object.assign({}, N(">=", 5.5, "cm", "Standard sporadic root or ascending aortic aneurysm repair threshold", "exact"), G("acc-aha-aortic-disease-2022", "ACC/AHA", 2022, "not-stated-in-source", "not-stated-in-source")), "evidence-aortic-size-thresholds-02")),
      S("tradeoff", "tradeoff", "applied-core", "guideline", "Earlier repair reduces dissection risk but exposes patients to operative risk before a universal threshold.", M("Aneurysm repair balances rupture-dissection risk against {{c1::operative risk}}.", "Growth, genetics, family history, valve surgery, and center expertise shift that balance.", "evidence-aortic-size-thresholds-03", G("acc-aha-aortic-disease-2022", "ACC/AHA", 2022, "not-stated-in-source", "not-stated-in-source"))),
      S("limitation", "limitation", "applied-core", "guideline", "No single diameter applies to every aortic segment and phenotype.", M("The 5.5-cm rule must not be applied to {{c1::every aortic phenotype}}.", "Heritable disease, BAV, rapid growth, body size, and other segments require separate criteria.", "evidence-aortic-size-thresholds-08", G("acc-aha-aortic-disease-2022", "ACC/AHA", 2022, "not-stated-in-source", "not-stated-in-source")))
    ],
    adsorb: [
      S("population", "population", "core", "number", "ADSORB enrolled uncomplicated acute type B dissection within fourteen days.", Q("ADSORB enrolled uncomplicated type B dissection within {{c1::14 days}}.", "The trial addressed acute preemptive TEVAR rather than complicated emergency disease.", N("<=", 14, "days", "ADSORB enrollment after acute uncomplicated type B dissection", "exact"), "evidence-adsorb-05")),
      S("result", "result", "core", "evidence", "TEVAR improved false-lumen thrombosis and aortic remodeling at one year.", M("In ADSORB, TEVAR improved {{c1::aortic remodeling}}.", "Complete false-lumen thrombosis and diameter regression were more frequent.", "evidence-adsorb-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "TEVAR improved anatomy but did not improve one-year mortality.", M("ADSORB improved remodeling but not one-year {{c1::mortality}}.", "The clinical value of an anatomic surrogate requires longer follow-up.", "evidence-adsorb-03")),
      S("limitation", "limitation", "applied-core", "evidence", "The study was not sufficient to establish long-term survival benefit.", M("ADSORB cannot establish long-term {{c1::survival benefit}}.", "Its principal outcome was aortic remodeling.", "evidence-adsorb-08"))
    ],
    momentum3: [
      S("population", "population", "core", "evidence", "MOMENTUM 3 enrolled advanced heart failure eligible for durable LVAD support.", M("MOMENTUM 3 studied advanced heart failure needing {{c1::durable LVAD support}}.", "The comparison concerned pump platform rather than candidacy for support.", "evidence-momentum3-05")),
      S("result", "result", "core", "evidence", "HeartMate 3 improved survival free from disabling stroke or device reoperation.", M("MOMENTUM 3 favored the magnetically levitated {{c1::HeartMate 3}}.", "Much of the benefit came from markedly less pump thrombosis and reoperation.", "evidence-momentum3-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Magnetic levitation reduced thrombosis but did not eliminate major LVAD complications.", M("HeartMate 3 reduced pump thrombosis but not {{c1::all LVAD complications}}.", "RV failure, bleeding, infection, and aortic insufficiency remain important.", "evidence-momentum3-03")),
      S("limitation", "limitation", "applied-core", "evidence", "The composite endpoint can obscure which component drives benefit.", M("MOMENTUM 3's composite was driven largely by fewer {{c1::device reoperations}}.", "Read the component outcomes rather than only the headline composite.", "evidence-momentum3-08"))
    ],
    fibres: [
      S("population", "population", "core", "evidence", "FIBRES enrolled bleeding post-CPB patients with acquired hypofibrinogenemia.", B("FIBRES required {{c1::active bleeding; acquired hypofibrinogenemia; post-CPB state}}.", "It did not support empiric fibrinogen for every bypass patient.", 3, "evidence-fibres-05")),
      S("result", "result", "core", "evidence", "Fibrinogen concentrate was noninferior to cryoprecipitate for blood-component use.", M("FIBRES found fibrinogen concentrate {{c1::noninferior to cryoprecipitate}}.", "The endpoint was allogeneic component units within 24 hours.", "evidence-fibres-02")),
      S("tradeoff", "tradeoff", "applied-core", "evidence", "Concentrate offers rapid standardized dosing whereas cryoprecipitate availability and composition differ.", M("FIBRES supports concentrate as a practical {{c1::cryoprecipitate alternative}}.", "Product choice remains dependent on availability and protocol.", "evidence-fibres-03")),
      S("limitation", "limitation", "applied-core", "evidence", "The endpoint did not prove prevention of re-exploration or superiority.", M("FIBRES did not prove reduced {{c1::surgical re-exploration}}.", "Persistent bleeding still demands assessment for a mechanical source.", "evidence-fibres-08"))
    ],
    trics3: [
      S("population", "population", "core", "evidence", "TRICS III enrolled moderate-to-high-risk adults undergoing cardiac surgery.", M("TRICS III studied {{c1::moderate-to-high-risk cardiac surgery}}.", "It tested transfusion strategies rather than a single isolated laboratory value.", "evidence-trics3-05")),
      S("result", "result", "core", "evidence", "A restrictive transfusion strategy was noninferior and reduced red-cell exposure.", M("TRICS III found restrictive transfusion {{c1::noninferior to liberal transfusion}}.", "Death, MI, stroke, and new dialysis formed the composite.", "evidence-trics3-02")),
      S("tradeoff", "tradeoff", "applied-core", "number", "The restrictive 7.5-g/dL threshold reduced exposure without worsening the composite.", Q("TRICS III's restrictive hemoglobin threshold was {{c1::7.5 g/dL}}.", "Active bleeding, ischemia, and oxygen-delivery physiology still modify individual decisions.", N("<", 7.5, "g/dL", "TRICS III restrictive red-cell transfusion strategy", "exact"), "evidence-trics3-03")),
      S("limitation", "limitation", "applied-core", "evidence", "The trial does not justify ignoring ischemia or active hemorrhage.", M("TRICS III tested a strategy, not permission to ignore {{c1::active bleeding}}.", "A hemoglobin trigger must remain subordinate to physiology and trajectory.", "evidence-trics3-08"))
    ]
  };

  Object.keys(TRIAL_SPECS_2).forEach(id => registerSource("evidence", id, id.toUpperCase(), TRIAL_SPECS_2[id], "Landmark trial source: " + id));

  /* ====================================================================
     VIVA CIRCUIT — separate mechanism, evidence, nuance, and exception.
     ==================================================================== */
  const VIVA_SPECS = {
    "viva-d1": [
      S("mechanism", "beat:01", "core", "mechanism", "A retrosternal patent LIMA is the highest-stakes redo-entry structure because injury causes bleeding and LAD ischemia.", M("During redo entry, the graft most feared behind the sternum is the {{c1::patent LIMA}}.", "Its injury simultaneously causes major hemorrhage and acute anterior ischemia.", "viva-d1-card-1")),
      S("evidence", "beat:02", "applied-core", "bounded-set", "Redo setup maps graft location and prepares peripheral rescue before sternotomy.", B("Redo entry around a retrosternal LIMA requires {{c1::gated CT; peripheral rescue access; controlled saw depth}}.", "Each preparation makes graft injury less likely or more survivable.", 3, "viva-d1-card-2")),
      S("nuance", "beat:02", "enrichment", "mechanism", "The posterior sternal table should be divided under direct control rather than blindly.", M("During high-risk redo entry, divide the posterior table under {{c1::direct control}}.", "Lifting and controlled depth protect adherent grafts and RV.", null)),
      S("exception", "beat:03", "applied-core", "rescue", "LIMA laceration requires packing and immediate peripheral bypass before repair or LAD regrafting.", SQ("For LIMA laceration, proceed as {{c1::pack locally; start peripheral CPB; repair or re-graft}}.", "Pre-exposed access turns uncontrolled exsanguination into controlled rescue.", 3, "viva-d1-card-3", H()))
    ],
    "viva-d2": [
      S("mechanism", "beat:01", "core", "mechanism", "Aortic regurgitation prevents antegrade root cardioplegia from reaching coronary pressure.", M("A heart that will not arrest with antegrade cardioplegia should first raise concern for {{c1::aortic regurgitation}}.", "Regurgitant runoff prevents root pressurization and coronary delivery.", "viva-d2-card-1")),
      S("evidence", "beat:02", "applied-core", "rescue", "Ineffective antegrade delivery in AR is bypassed with retrograde or direct ostial cardioplegia.", B("When AR defeats antegrade cardioplegia, switch to {{c1::retrograde delivery; direct ostial delivery}}.", "Vent the LV while changing route to prevent distension.", 2, "viva-d2-card-2", H())),
      S("nuance", "beat:02", "core", "mechanism", "Antegrade cardioplegia depends on a competent aortic valve to build root pressure.", M("Antegrade root cardioplegia requires a {{c1::competent aortic valve}}.", "Without it, solution decompresses into the LV instead of the coronary ostia.", null)),
      S("exception", "beat:03", "applied-core", "rescue", "An arrested but distending LV requires immediate venting and correction of the filling source.", M("An arrested heart with LV distension requires immediate {{c1::LV decompression}}.", "Distension raises wall tension and worsens subendocardial ischemia.", "viva-d2-card-3", H()))
    ],
    "viva-d3": [
      S("mechanism", "beat:01", "core", "evidence", "ISCHEMIA tested an initial invasive strategy versus medical therapy in stable moderate-to-severe ischemia.", M("ISCHEMIA randomized stable ischemia to invasive strategy versus {{c1::medical therapy first}}.", "Revascularization remained available for medical-therapy failure.", "viva-d3-card-1")),
      S("evidence", "beat:02", "core", "evidence", "The initial invasive strategy did not reduce death or MI but improved angina.", M("In ISCHEMIA, upfront intervention improved angina but not {{c1::death or myocardial infarction}}.", "Early procedural MI was offset by fewer later spontaneous events.", "viva-d3-card-2")),
      S("nuance", "beat:02", "applied-core", "bounded-set", "Left-main disease, severe LV dysfunction, and diabetic multivessel evidence lie outside a universal ISCHEMIA conclusion.", B("ISCHEMIA should not erase separate evidence for {{c1::left main; low-EF multivessel; diabetic multivessel disease}}.", "These populations have distinct survival and revascularization data.", 3, null)),
      S("exception", "beat:03", "applied-core", "evidence", "Stable preserved-EF non-left-main disease may begin with optimized medical therapy and reserve revascularization for symptoms.", M("For stable non-left-main disease with preserved EF, ISCHEMIA supports {{c1::optimized medical therapy first}}.", "Anatomy, symptoms, diabetes, LV function, and patient preference still determine applicability.", "viva-d3-card-3"))
    ],
    "viva-d4": [
      S("mechanism", "beat:01", "core", "mechanism", "Low transvalvular flow can conceal severe fixed aortic stenosis by lowering gradient.", M("A low gradient can coexist with severe AS because gradient is {{c1::flow dependent}}.", "A weak ventricle may not generate a high gradient across a fixed small valve.", "viva-d4-card-1")),
      S("evidence", "beat:02", "applied-core", "comparison", "Dobutamine distinguishes fixed severe AS from pseudosevere AS by valve-area response.", MP("Dobutamine low-flow AS maps as {{c1::true severe → AVA stays fixed; pseudosevere → AVA increases}}.", "Rising flow unmasks whether the valve can open further.", 2, "viva-d4-card-2")),
      S("flow_threshold", "beat:02", "applied-core", "number", "Stroke-volume index below 35 mL/m2 defines low flow in this viva.", Q("In low-gradient AS, low flow is SVi below {{c1::35 mL/m2}}.", "This threshold triggers flow-state reconciliation rather than automatic relabeling as moderate AS.", N("<", 35, "mL/m2", "Low-flow state in aortic stenosis", "exact"), null)),
      S("exception", "beat:03", "applied-core", "rescue", "Absent contractile reserve raises procedural risk but does not negate intervention when severe AS is confirmed.", M("In confirmed severe low-flow AS, absent contractile reserve does not automatically preclude {{c1::valve replacement}}.", "It changes risk and modality discussion rather than making the valve moderate.", "viva-d4-card-3", H()))
    ],
    "viva-d5": [
      S("mechanism", "beat:01", "core", "mechanism", "LVOT diameter error is amplified because continuity-equation area squares the diameter.", M("The most amplified AS measurement error is inaccurate {{c1::LVOT diameter}}.", "A small diameter error produces a much larger calculated-area error.", "viva-d5-card-1")),
      S("evidence", "beat:02", "applied-core", "number", "Indexed EOA below 0.65 cm2/m2 defines severe prosthesis-patient mismatch in this viva.", Q("Severe prosthesis-patient mismatch is indexed EOA below {{c1::0.65 cm2/m2}}.", "Predict mismatch before implant and choose a larger-EOA prosthesis or root enlargement.", N("<", 0.65, "cm2/m2", "Severe prosthesis-patient mismatch", "exact"), "viva-d5-card-2")),
      S("nuance", "beat:02", "applied-core", "rescue", "A small annulus with predicted mismatch should prompt valve optimization or root enlargement.", B("To avoid severe mismatch, consider {{c1::larger-EOA prosthesis; supra-annular design; root enlargement}}.", "The choice should be made before committing to an undersized implant.", 3, null, H())),
      S("exception", "beat:03", "applied-core", "mechanism", "High calcium with low flow supports true severe AS after technical measurements are rechecked.", M("When low flow depresses gradient, a high CT calcium score supports {{c1::true severe AS}}.", "Recheck Doppler alignment and LVOT measurement before resolving discordance.", "viva-d5-card-3"))
    ],
    "viva-d6": [
      S("mechanism", "beat:01", "core", "bounded-set", "Risk scores omit anatomy, frailty, and hostile-chest or systemic hazards.", B("Major STS blind spots include {{c1::porcelain aorta; frailty; hostile chest/systemic disease}}.", "Each can change modality, feasibility, or expected recovery despite a low score.", 3, "viva-d6-card-1")),
      S("evidence", "beat:02", "applied-core", "bounded-set", "Operative risk is reconciled across STS-PROM, EuroSCORE II, and structured frailty.", B("A complete risk assessment combines {{c1::STS-PROM; EuroSCORE II; structured frailty}}.", "Discordance is a Heart-Team finding rather than a reason to trust one calculator.", 3, "viva-d6-card-2")),
      S("nuance", "beat:02", "core", "model", "A risk score is an input to shared decision-making rather than the decision itself.", M("An operative risk score should be treated as {{c1::one decision input}}.", "Anatomy, goals, cognition, function, and recovery potential remain outside the number.", null)),
      S("exception", "beat:03", "applied-core", "rescue", "When comorbidity or frailty prevents meaningful benefit, palliation may be the correct plan.", M("When intervention cannot deliver meaningful survival or function, choose {{c1::goal-concordant palliation}}.", "Recognizing futility is a senior shared-decision judgment.", "viva-d6-card-3", H()))
    ],
    "viva-d7": [
      S("mechanism", "beat:01", "core", "mechanism", "CABG protects downstream territory beyond focal lesions and offers durable arterial revascularization.", M("In diffuse diabetic CAD, CABG protects the entire {{c1::downstream coronary territory}}.", "PCI treats visible focal lesions while leaving future culprit segments exposed.", "viva-d7-card-1")),
      S("evidence", "beat:02", "core", "evidence", "FREEDOM favors CABG for diabetic multivessel disease.", M("The trial supporting CABG in diabetic multivessel disease is {{c1::FREEDOM}}.", "CABG reduced death and MI at the cost of more early stroke.", "viva-d7-card-2")),
      S("nuance", "beat:02", "applied-core", "evidence", "EXCEL and NOBLE disagreement depends partly on endpoint and MI definitions.", M("EXCEL-NOBLE disagreement requires inspection of {{c1::endpoint definitions}}.", "A trial headline is inseparable from how events were counted.", null)),
      S("exception", "beat:03", "applied-core", "rescue", "A porcelain aorta favors an anaortic off-pump arterial strategy or alternative inflow.", M("When the ascending aorta cannot be clamped, use an {{c1::anaortic revascularization strategy}}.", "In-situ arterial or composite grafting avoids clamp and side-bite embolic risk.", "viva-d7-card-3", H()))
    ],
    "viva-d8": [
      S("mechanism", "beat:01", "core", "model", "A fit younger patient with a small annulus needs lifetime valve and mismatch planning.", M("For a fit 68-year-old with a small annulus, decide using {{c1::lifetime valve planning}}.", "Durability, future coronary access, pacemaker risk, and indexed EOA all matter.", "viva-d8-card-1")),
      S("evidence", "beat:02", "core", "evidence", "Low-risk TAVR trials show similar early outcomes with device-specific tradeoffs and immature durability.", M("PARTNER 3 and Evolut Low Risk support TAVR for {{c1::selected low-risk patients}}.", "The trials do not eliminate device-dependent pacing, leak, or durability concerns.", "viva-d8-card-2")),
      S("nuance", "beat:02", "applied-core", "comparison", "Self-expanding TAVR has a larger conduction penalty whereas surgery has greater early morbidity.", MP("Low-risk valve tradeoffs include {{c1::TAVR → pacemaker/leak; SAVR → AF/AKI}}.", "Age, anatomy, durability, and future access decide whether the early balance applies.", 2, null)),
      S("exception", "beat:03", "applied-core", "rescue", "Predicted severe mismatch should prompt root enlargement or a larger-EOA prosthesis.", M("If indexed EOA predicts severe mismatch, perform {{c1::root enlargement}} or change prosthesis.", "Accepting an undersized valve is not the only option.", "viva-d8-card-3", H()))
    ],
    "viva-d9": [
      S("mechanism", "beat:01", "core", "mechanism", "Type A dissection can simultaneously impair coronary and distal true-lumen perfusion.", B("Type A dissection threatens {{c1::right-coronary perfusion; distal limb perfusion}}.", "One proximal false-lumen process can create two malperfusion territories.", 2, "viva-d9-card-1")),
      S("evidence", "beat:02", "applied-core", "rescue", "Antegrade true-lumen inflow is preferred when femoral retrograde perfusion may worsen false-lumen flow.", M("For type A dissection malperfusion, establish {{c1::antegrade true-lumen inflow}}.", "Axillary, innominate, or verified central cannulation can support cerebral strategy.", "viva-d9-card-2", H())),
      S("nuance", "beat:02", "core", "mechanism", "Cannulation is judged by true-lumen flow, cerebral delivery, and reversal of malperfusion.", M("A dissection cannulation plan must prove {{c1::true-lumen perfusion}}.", "Pressure alone cannot exclude false-lumen flow or regional malperfusion.", null)),
      S("exception", "beat:03", "applied-core", "rescue", "Persistent static distal obstruction may require fenestration, stenting, or peripheral bypass.", B("Persistent distal malperfusion may require {{c1::fenestration; branch stenting; peripheral bypass}}.", "Definitive repair must restore the threatened vascular bed, not only the proximal aorta.", 3, "viva-d9-card-3", H()))
    ],
    "viva-d10": [
      S("mechanism", "beat:01", "core", "mechanism", "IABP counterpulsation augments diastole and unloads systole but depends on native LV ejection.", M("IABP support depends on residual {{c1::native LV ejection}}.", "It counterpulses rather than pumping blood forward independently.", "viva-d10-card-1")),
      S("evidence", "beat:02", "core", "evidence", "IABP-SHOCK II found no mortality benefit from routine IABP in post-MI cardiogenic shock.", M("IABP-SHOCK II found no mortality benefit from {{c1::routine IABP use}}.", "The result does not mean every individual mechanical complication lacks a role for IABP.", "viva-d10-card-2")),
      S("nuance", "beat:02", "applied-core", "evidence", "A neutral routine-use trial does not prohibit mechanism-matched support in selected patients.", M("A neutral routine-IABP trial should not erase {{c1::mechanism-matched selection}}.", "Ischemic LV support, mechanical complications, and bridge strategies require individual judgment.", null)),
      S("exception", "beat:03", "applied-core", "comparison", "Impella fits isolated LV support whereas VA-ECMO fits biventricular or cardiorespiratory collapse.", MP("Escalation maps as {{c1::isolated LV failure → Impella; biventricular/cardiorespiratory failure → VA-ECMO}}.", "The failed physiology determines the support platform.", 2, "viva-d10-card-3", H()))
    ],
    "viva-d11": [
      S("mechanism", "beat:01", "core", "mechanism", "Catastrophic protamine reaction causes pulmonary vasoconstriction and acute RV collapse.", M("Catastrophic protamine hypotension with high PA pressure suggests {{c1::acute RV pressure overload}}.", "Type III reaction can rapidly progress to circulatory collapse.", "viva-d11-card-1")),
      S("evidence", "beat:02", "applied-core", "number", "The viva uses about 1 mg protamine per 100 units of heparin as a starting relationship.", Q("A lesson protamine starting relationship is {{c1::1 mg per 100 heparin units}}.", "Titrate to measured residual heparin and ACT because excess protamine impairs coagulation.", N("=", 1, "mg protamine per 100 heparin units", "Starting protamine-heparin relationship in the viva", "approximate"), "viva-d11-card-2")),
      S("nuance", "beat:02", "core", "mechanism", "Excess protamine can worsen platelet and coagulation function.", M("More protamine is not benign because excess drug can {{c1::worsen coagulopathy}}.", "Dose should follow residual heparin rather than habit alone.", null)),
      S("exception", "beat:03", "applied-core", "rescue", "Severe protamine reaction requires stopping infusion, supporting RV and PVR, and returning to CPB if needed.", SQ("For catastrophic protamine reaction: {{c1::stop protamine; support RV/lower PVR; resume CPB if needed}}.", "Re-heparinization and bypass may be lifesaving when collapse persists.", 3, "viva-d11-card-3", H()))
    ],
    "viva-d12": [
      S("mechanism", "beat:01", "core", "mechanism", "Valve and septal work threatens the AV node and His bundle near the membranous septum.", M("The conduction tissue most vulnerable near the membranous septum is the {{c1::AV node-His axis}}.", "This anatomy explains postoperative complete heart block after valve work.", "viva-d12-card-1")),
      S("evidence", "beat:02", "applied-core", "number", "Potentially transient postoperative complete heart block is observed for about five to seven days.", Q("The lesson's postoperative block recovery window is about {{c1::5-7 days}}.", "Persistent block without reversible cause then favors permanent pacing.", N("range", [5, 7], "days", "Observation window for potentially transient postoperative AV block", "approximate"), "viva-d12-card-2")),
      S("nuance", "beat:02", "applied-core", "number", "Temporary pacing output is set about two to three times measured capture threshold.", Q("Temporary pacing output is set about {{c1::2-3 times capture threshold}}.", "The margin protects capture as edema and thresholds change.", N("range", [2, 3], "times threshold", "Temporary epicardial pacing output safety margin", "institution-dependent"), null)),
      S("exception", "beat:03", "applied-core", "rescue", "Failed epicardial pacing in a dependent patient requires transvenous rescue and permanent-device planning.", SQ("When epicardial pacing fails in persistent block: {{c1::secure transvenous pacing; assess reversibility; implant permanent device}}.", "External pads bridge only until reliable internal pacing is available.", 3, "viva-d12-card-3", H()))
    ],
    "viva-d13": [
      S("mechanism", "beat:01", "core", "comparison", "Vasoplegia is warm low-resistance shock with preserved flow, unlike pump failure or tamponade.", M("Warm hypotension with low SVR and preserved output indicates {{c1::vasoplegia}}.", "Pump failure has low flow; tamponade has obstructed filling.", "viva-d13-card-1")),
      S("evidence", "beat:02", "applied-core", "rescue", "Refractory vasoplegia is treated with sequential nonredundant vasopressor mechanisms.", SQ("The lesson's vasoplegia ladder is {{c1::norepinephrine; vasopressin; methylene blue; hydroxocobalamin}}.", "Each rung recruits a different vascular pathway after adequate filling is confirmed.", 4, "viva-d13-card-2", H())),
      S("nuance", "beat:02", "core", "bounded-set", "Before escalating pressors, exclude pump failure, underfilling, and obstruction.", B("Before climbing the pressor ladder, exclude {{c1::pump failure; underfilling; mechanical obstruction}}.", "Treating the wrong shock profile can worsen output.", 3, null)),
      S("exception", "beat:03", "applied-core", "rescue", "Localized tamponade may evade TTE and requires TEE or surgical exploration when physiology is convincing.", M("Convincing localized-tamponade physiology despite nondiagnostic TTE requires {{c1::TEE or surgical exploration}}.", "A negative surface study cannot evacuate or exclude organized clot.", "viva-d13-card-3", H()))
    ],
    "viva-d14": [
      S("mechanism", "beat:01", "core", "mechanism", "Falling output, converging filling pressures, and abruptly quiet drains indicate loculated clot tamponade.", M("After cardiac surgery, abruptly quiet drains with rising pressures suggest {{c1::loculated clot tamponade}}.", "The drainage stop can mean obstruction rather than hemostasis.", "viva-d14-card-1")),
      S("evidence", "beat:02", "applied-core", "rescue", "Echo can support but cannot exclude localized postoperative tamponade.", M("A nondiagnostic echocardiogram cannot exclude {{c1::localized postoperative tamponade}}.", "Direct exploration should not be delayed when physiology is convincing.", "viva-d14-card-2", H())),
      S("nuance", "beat:02", "core", "mechanism", "The reopening decision should occur before arrest when refractory tamponade physiology is convincing.", M("For arrest-imminent tamponade, reopen the chest {{c1::before arrest}}.", "Rescue success falls when decompression waits for a code.", null, H())),
      S("exception", "beat:03", "applied-core", "model", "Mechanical postoperative problems require mechanical correction rather than endlessly escalating drugs.", M("A mechanical postoperative lesion requires {{c1::mechanical correction}}.", "Pressors cannot evacuate clot, restore graft flow, or repair obstruction.", "viva-d14-card-3", H()))
    ]
  };

  Object.keys(VIVA_SPECS).forEach(id => registerSource("viva", id, id.toUpperCase(), VIVA_SPECS[id], "CardiacSchool viva source: " + id));

  /* ====================================================================
     PHYSIOLOGY LABS — atomic concepts, mechanisms, formulas, and sets.
     Related objectives share a card only when they form one retrieval task.
     ==================================================================== */
  const PHYSIOLOGY_SPECS = {
    "pv-loop": [
      S("concept", "concept", "core", "model", "Pressure-volume loop width is stroke volume, while loop position and slope encode loading and contractility.", M("A pressure-volume loop's width represents {{c1::stroke volume}}.", "Loop position and slope add information about loading, compliance, and contractility.", "module-physiology-pv-loop-01")),
      S("phases", "objective:01", "core", "sequence", "The loop proceeds through filling, isovolumic contraction, ejection, and isovolumic relaxation with corresponding valve events.", SQ("The pressure-volume loop phase order is {{c1::filling; isovolumic contraction; ejection; isovolumic relaxation}}.", "Mitral closure ends filling; aortic opening begins ejection; aortic closure begins relaxation.", 4)),
      S("loading", "objective:02", "core", "comparison", "Preload, afterload, contractility, and compliance shift different loop coordinates.", MP("Pressure-volume loop shifts map as {{c1::preload up → EDV right; afterload up → ESV right; contractility up → ESV left; compliance down → filling pressure up}}.", "Changing one variable at a time links geometry to physiology.", 4)),
      S("clinical_transfer", ["objective:03", "objective:04"], "applied-core", "mechanism", "Regurgitation can preserve total EF despite low forward output, while post-repair SAM improves with filling and afterload rather than inotropy.", MP("Pressure-volume clinical traps map as {{c1::regurgitation → EF overstates forward flow; SAM → fill and raise afterload}}.", "Regurgitant ejection inflates total stroke volume; an underfilled hyperdynamic ventricle worsens SAM.", 2)),
      S("sv_formula", "equation:01", "core", "formula", "Stroke volume equals end-diastolic volume minus end-systolic volume.", F("Pressure-volume stroke volume is {{c1::SV = EDV − ESV}}.", "Loop width is the same volume difference.", "module-physiology-pv-loop-07")),
      S("ef_formula", "equation:02", "core", "formula", "Ejection fraction equals stroke volume divided by end-diastolic volume.", F("Pressure-volume ejection fraction is {{c1::EF = SV / EDV}}.", "EF is a fraction of total ejection and does not guarantee forward flow.", "module-physiology-pv-loop-08")),
      S("co_formula", "equation:03", "core", "formula", "Cardiac output equals heart rate multiplied by forward stroke volume.", F("Pressure-volume cardiac output is {{c1::CO = HR × forward SV}}.", "Use forward rather than total stroke volume in regurgitation.", "module-physiology-pv-loop-09"))
    ],
    "oxygen-delivery": [
      S("concept", "concept", "core", "model", "Oxygen delivery is blood flow multiplied by arterial oxygen content and must be interpreted against metabolic demand.", M("Systemic oxygen delivery couples pump flow with {{c1::arterial oxygen content}}.", "Pressure alone cannot establish adequate oxygen transport.", "module-physiology-oxygen-delivery-01")),
      S("cao2", ["objective:01", "equation:01"], "core", "formula", "Arterial oxygen content is dominated by hemoglobin-bound oxygen with a small dissolved component.", F("The arterial oxygen-content formula is {{c1::CaO₂ = 1.34·Hb·SaO₂ + 0.003·PaO₂}}.", "Hemoglobin and saturation dominate the dissolved-oxygen term.", "module-physiology-oxygen-delivery-07", H("The oxygen-content equation and coefficients require perfusion-clinician review."))),
      S("do2i", ["objective:01", "equation:02"], "core", "formula", "Indexed oxygen delivery multiplies flow index by arterial oxygen content and a unit-conversion factor.", F("Indexed oxygen delivery is {{c1::DO₂i = flow index × CaO₂ × 10}}.", "A low value can arise from inadequate flow, hemoglobin, or saturation.", "module-physiology-oxygen-delivery-08", H("The indexed oxygen-delivery equation requires perfusion-clinician review."))),
      S("pressure_boundary", "objective:02", "core", "mechanism", "A normal MAP can coexist with inadequate oxygen delivery because MAP does not encode flow or oxygen content.", M("A normal MAP cannot replace assessment of {{c1::oxygen delivery}}.", "Vascular tone can preserve pressure despite low flow or low hemoglobin.", null)),
      S("demand", ["objective:03", "equation:03"], "core", "formula", "Oxygen extraction is consumption divided by delivery, and warming raises demand that can lower venous saturation.", F("The oxygen-extraction relationship is {{c1::O₂ extraction = VO₂ / DO₂}}.", "Temperature, SvO2, lactate, and organ trends show whether demand exceeds delivery.", "module-physiology-oxygen-delivery-09")),
      S("safest_lever", "objective:04", "applied-core", "mechanism", "Low-delivery rescue should correct the limiting determinant rather than reflexively raising pump flow.", MP("Low-delivery corrections map as {{c1::low flow → fix drainage/flow; low Hb → address oxygen content; rewarming demand → slow warming}}.", "Choose the safest effective lever after identifying the dominant limitation.", 3, null, H()))
    ],
    valve: [
      S("concept", "concept", "core", "model", "Valve severity requires reconciliation of velocity, gradient, area, dimensionless index, and flow state.", M("Valve severity should be assigned from {{c1::concordant hemodynamic measurements}}.", "A single flow-dependent value can misclassify obstruction.", "module-physiology-valve-01")),
      S("bernoulli", ["objective:01", "equation:01"], "core", "formula", "The simplified Bernoulli relationship converts peak velocity to peak pressure gradient.", F("The simplified Bernoulli relationship is {{c1::peak ΔP = 4v²}}.", "Gradient rises with the square of velocity.", "module-physiology-valve-07")),
      S("continuity", ["objective:01", "equation:02"], "core", "formula", "Continuity conserves flow to estimate aortic valve area from LVOT area and VTIs.", F("The continuity equation is {{c1::AVA = LVOT CSA × LVOT VTI / AV VTI}}.", "LVOT diameter error is amplified because cross-sectional area squares diameter.", "module-physiology-valve-08")),
      S("dvi", ["objective:02", "equation:03"], "core", "formula", "Dimensionless velocity index divides LVOT VTI by aortic-valve VTI and avoids direct LVOT area measurement.", F("The dimensionless velocity index is {{c1::DVI = LVOT VTI / AV VTI}}.", "It still depends on accurate Doppler sampling and flow.", "module-physiology-valve-09")),
      S("discordance", ["objective:02", "objective:03"], "applied-core", "mechanism", "Low flow can blunt gradient, while LVOT error and prosthesis-patient mismatch can create discordant measurements.", B("For discordant valve data, reassess {{c1::flow state; Doppler alignment; LVOT measurement; prosthesis-body size match}}.", "Integrated review separates true obstruction from measurement and flow effects.", 4)),
      S("mitral_context", "objective:04", "applied-core", "mechanism", "A post-repair mitral gradient must be interpreted with heart rate, rhythm, and transmitral flow.", M("Before judging a post-repair mitral gradient, normalize {{c1::heart rate and flow}}.", "Tachycardia and high flow can elevate a gradient without fixed stenosis.", null))
    ],
    shock: [
      S("concept", "concept", "core", "model", "Post-bypass hypotension is classified by coupled rate, filling, biventricular function, vascular resistance, and mechanical findings.", M("Post-bypass hypotension requires naming the dominant {{c1::shock phenotype}}.", "A pressure value alone cannot distinguish pump, vascular, filling, or obstructive failure.", "module-physiology-shock-01")),
      S("phenotypes", "objective:01", "core", "bounded-set", "The lab distinguishes low-output, vasoplegic, RV, obstructive, and mixed shock profiles.", B("Post-bypass shock profiles include {{c1::low output; vasoplegia; RV failure; obstructive shock; mixed shock}}.", "Mixed physiology is common and requires more than one matched intervention.", 5)),
      S("filling_relation", ["objective:02", "equation:03"], "core", "formula", "An RV-failure pattern combines high CVP with low left-sided filling, but filling pressures are not infallible.", F("The RV-failure filling pattern is {{c1::high CVP + low LV filling}}.", "Trend pressure relationships alongside TEE and output.", "module-physiology-shock-09")),
      S("matched_action", "objective:03", "applied-core", "mechanism", "Each intervention should match the dominant physiology and be followed by immediate reassessment.", M("After a post-bypass intervention, the mandatory next step is {{c1::physiologic reassessment}}.", "The response tests the working diagnosis and limits treatment harm.", null, H())),
      S("surgical_problem", "objective:04", "applied-core", "rescue", "Residual surgical or mechanical problems require return to support or re-exploration rather than escalating drugs alone.", M("A residual surgical cause of post-bypass shock requires {{c1::mechanical correction}}.", "TEE, graft assessment, drainage, and the operative result guide return to support or exploration.", null, H())),
      S("co_formula", "equation:01", "core", "formula", "Cardiac output equals heart rate multiplied by stroke volume.", F("The shock-lab cardiac-output equation is {{c1::CO = HR × SV}}.", "A normal MAP can conceal a low calculated output.", "module-physiology-shock-07")),
      S("map_formula", "equation:02", "core", "formula", "Mean arterial pressure is approximated from CVP, cardiac output, and systemic vascular resistance.", F("The shock-lab pressure relation is {{c1::MAP ≈ CVP + CO × SVR / 80}}.", "This simplified relationship helps separate low flow from low vascular tone.", "module-physiology-shock-08"))
    ],
    "cpb-console": [
      S("concept", "concept", "core", "model", "Safe bypass couples venous drainage, reservoir volume, pump flow, arterial pressure, gas exchange, and patient perfusion.", M("Safe CPB management depends on reading the {{c1::circuit and patient together}}.", "A normal-looking pump-flow number cannot prove adequate perfusion.", "module-physiology-cpb-console-01")),
      S("circuit_trace", "objective:01", "core", "sequence", "The circuit is traced from venous drainage through reservoir, pump, oxygenator, arterial line, and patient.", SQ("The CPB circuit is traced as {{c1::venous drainage; reservoir; pump; oxygenator; arterial return}}.", "Following flow direction localizes a fault before controls are changed.", 5)),
      S("coupled_signals", "objective:02", "core", "bounded-set", "Pump flow must be reconciled with reservoir level, line pressure, MAP, hemoglobin, saturation, and indexed oxygen delivery.", B("Core CPB adequacy signals include {{c1::reservoir trend; line pressure; MAP; hemoglobin/saturation; DO₂i}}.", "No single console value establishes safe whole-patient perfusion.", 5)),
      S("gas_controls", ["objective:03", "equation:01"], "core", "comparison", "FiO2 predominantly changes oxygenation, while sweep gas predominantly changes carbon-dioxide clearance.", MP("Oxygenator gas controls map as {{c1::FiO₂ → oxygenation; sweep → CO₂ clearance}}.", "Changing the wrong control delays correction of the blood-gas problem.", 2, "module-physiology-cpb-console-08")),
      S("fault_rule", ["objective:04", "equation:03"], "applied-core", "rescue", "For reservoir loss, high line pressure, air, or gas failure, contain the immediate hazard before diagnosing the cause.", M("During an acute CPB fault, first {{c1::contain the immediate hazard}}.", "Reduce or stop flow, clamp, or secure the reservoir as the specific fault requires.", "module-physiology-cpb-console-10", H())),
      S("operative_inputs", "objective:05", "applied-core", "bounded-set", "ACT, temperature, suction, vents, and cardioplegia route are active components of safe bypass management.", B("Beyond flow, CPB management tracks {{c1::ACT; temperature; suction; vents; cardioplegia route}}.", "These inputs connect console decisions to the operative field.", 5)),
      S("do2_formula", "equation:02", "core", "formula", "Indexed oxygen delivery combines pump flow, arterial oxygen content, conversion, and body surface area.", F("The CPB indexed-delivery equation is {{c1::DO₂i = flow × CaO₂ × 10 / BSA}}.", "Interpret the result with temperature, extraction, lactate, and organ trends.", "module-physiology-cpb-console-09", H("The indexed oxygen-delivery equation requires perfusion-clinician review.")))
    ],
    "cpb-surgery": [
      S("concept", "concept", "core", "model", "Each bypass phase must meet its safety prerequisites before the next phase begins.", M("A CPB phase advances only after its {{c1::safety prerequisites}} are confirmed.", "Explicit commands and expected responses make transitions auditable.", "module-physiology-cpb-surgery-01")),
      S("on_sequence", "objective:01", "core", "sequence", "Going on bypass follows anticoagulation, line checks, cannulation, initiation, full flow, cross-clamp, and cardioplegia.", SQ("The early on-bypass sequence is {{c1::anticoagulate/check lines; cannulate; initiate CPB; confirm full flow; clamp and arrest}}.", "Each transition has an abort condition if drainage, pressure, or perfusion is unsafe.", 5)),
      S("act_threshold", "equation:01", "applied-core", "number", "The lab requires ACT at or above 480 seconds before bypass.", Q("Before CPB in this lab, ACT must be at least {{c1::480 seconds}}.", "Clinical practice follows the local anticoagulation protocol.", N(">=", 480, "seconds", "CardiacSchool CPB initiation threshold", "institution-dependent"), "module-physiology-cpb-surgery-08")),
      S("perfusion", "objective:02", "core", "model", "Adequate perfusion couples flow, pressure, reservoir, gas exchange, oxygen delivery, temperature, and the surgical field.", B("During CPB, adequacy requires trending {{c1::flow/pressure; reservoir; gas exchange; oxygen delivery; temperature/field}}.", "The perfusionist and surgeon share one physiologic system.", 5)),
      S("clamp_arrest", ["objective:03", "equation:02"], "applied-core", "sequence", "Cross-clamping should be followed immediately by planned cardioplegia delivery and confirmation of arrest.", SQ("At aortic cross-clamping: {{c1::announce clamp; deliver cardioplegia; confirm arrest/protection}}.", "Delay after clamping creates avoidable unprotected ischemia.", 3, "module-physiology-cpb-surgery-09", H())),
      S("wean", ["objective:04", "equation:03"], "applied-core", "sequence", "Separation requires rewarming, ventilation, rhythm, de-airing, repair assessment, a controlled wean, and protamine only after full separation.", SQ("The final CPB transition is {{c1::rewarm/de-air; assess repair and rhythm; wean with reassessment; confirm fully off pump; give protamine}}.", "Return to support early if the trial off bypass is unsafe.", 5, "module-physiology-cpb-surgery-10", H())),
      S("debrief", "objective:05", "core", "bounded-set", "A team debrief names the command, expected response, and abort condition for each transition.", B("A closed-loop CPB transition states {{c1::command; expected response; abort condition}}.", "This structure exposes uncertainty before it becomes a crisis.", 3))
    ],
    cannulation: [
      S("concept", "concept", "core", "model", "Cannulation sites determine flow direction, chamber access, decompression, and rescue options.", M("Cannulation strategy is determined by {{c1::operative anatomy and access needs}}.", "Inflow and drainage choices must be planned as one system.", "module-physiology-cannulation-01")),
      S("arterial", ["objective:01", "equation:01"], "core", "comparison", "Aortic disease changes the safest arterial inflow site and direction.", MP("Arterial inflow maps as {{c1::healthy ascending aorta → central; hostile aorta → axillary/alternative; diseased arch → verified true lumen}}.", "Flow direction and embolic risk matter more than habit.", 3, "module-physiology-cannulation-08")),
      S("venous", ["objective:02", "equation:02"], "core", "comparison", "Venous drainage is selected by which chambers must be opened or isolated.", MP("Venous drainage maps as {{c1::closed right atrium → two-stage; open right atrium → bicaval; minimal access → peripheral/augmented}}.", "The surgical exposure determines the required isolation and decompression.", 3, "module-physiology-cannulation-09")),
      S("adjuncts", "objective:03", "core", "bounded-set", "Vents and cardioplegia cannulae are chosen to decompress chambers and deliver protection.", B("Cannulation planning must also place {{c1::LV vent; root vent; antegrade line; retrograde line}}.", "Adjuncts prevent distension, remove air, and preserve myocardial protection routes.", 4)),
      S("failure", ["objective:04", "equation:03"], "applied-core", "rescue", "Venous chatter indicates excessive negative pressure, inadequate volume, or cannula obstruction and should not be treated by blindly raising suction.", B("Venous-line chatter should prompt checks for {{c1::excess suction; low volume; cannula malposition; line obstruction}}.", "Reduce the provoking condition while restoring safe drainage.", 4, "module-physiology-cannulation-10", H())),
      S("response", "objective:05", "applied-core", "rescue", "A cannulation failure response first protects flow and the patient, then confirms position, pressure, and organ perfusion.", SQ("For a cannulation fault: {{c1::reduce the hazard; verify position/pressure; restore flow; confirm organ perfusion}}.", "True-lumen flow and downstream perfusion must be demonstrated before proceeding.", 4, null, H()))
    ],
    cardioplegia: [
      S("concept", "concept", "core", "model", "Myocardial protection requires arrest plus uniform delivery, cooling, venting, and timely redosing.", M("Electrical arrest alone does not prove adequate {{c1::myocardial protection}}.", "Temperature, distribution, pressure, flow, and distension must also be followed.", "module-physiology-cardioplegia-01")),
      S("arrest", ["objective:01", "equation:01"], "core", "mechanism", "Hyperkalemia arrests the membrane near minus 60 mV and inactivates fast sodium channels.", M("Hyperkalemic cardioplegia arrests by inactivating {{c1::fast sodium channels}}.", "Depolarization near minus 60 mV produces rapid electrical silence.", "module-physiology-cardioplegia-08")),
      S("route", ["objective:02", "equation:03"], "applied-core", "comparison", "Antegrade, retrograde, and ostial delivery solve different anatomic problems, and retrograde delivery may underprotect the RV.", MP("Cardioplegia routes map as {{c1::root antegrade → competent valve; retrograde → bypass proximal obstruction; ostial → direct coronary delivery; retrograde-only → RV risk}}.", "Use combined routes when anatomy makes one route unreliable.", 4, "module-physiology-cardioplegia-10", H())),
      S("solution", "objective:03", "core", "comparison", "Blood, crystalloid, and del Nido-type solutions differ in oxygen carriage, dilution, dosing interval, and workflow.", B("Cardioplegia solution choice compares {{c1::oxygen carriage; hemodilution; redosing interval; operative workflow}}.", "No formulation compensates for poor delivery or inadequate monitoring.", 4)),
      S("q10", ["objective:04", "equation:02"], "applied-core", "number", "Cooling lowers myocardial metabolism by about half per 10 degrees Celsius in the lab's Q10 approximation.", Q("The lab's Q10 approximation lowers metabolism by {{c1::about 50% per 10°C}}.", "Temperature reduction extends protection but does not replace arrest and delivery.", N("~", "50% per 10°C", "metabolic-rate change", "CardiacSchool cardioplegia Q10 approximation", "approximate"), "module-physiology-cardioplegia-09")),
      S("adapt", "objective:05", "applied-core", "rescue", "Severe AR, left-main disease, a patent graft, or RV risk requires an adapted delivery and venting plan.", B("Cardioplegia plans require adaptation for {{c1::severe AR; left-main disease; patent graft; RV risk}}.", "Special anatomy changes distribution, washout, or distension risk.", 4, null, H()))
    ],
    iabp: [
      S("concept", "concept", "core", "mechanism", "IABP counterpulsation augments diastolic coronary pressure and reduces systolic LV afterload.", M("IABP works by timed {{c1::diastolic inflation and presystolic deflation}}.", "It depends on native ejection rather than pumping blood forward.", "module-physiology-iabp-01")),
      S("inflate", ["objective:01", "equation:01"], "core", "mechanism", "Inflation begins at the dicrotic notch after aortic-valve closure to augment diastolic coronary perfusion.", M("IABP inflation should begin at the {{c1::dicrotic notch}}.", "Inflating after aortic-valve closure raises diastolic pressure.", "module-physiology-iabp-08")),
      S("deflate", ["objective:01", "equation:02"], "core", "mechanism", "Deflation finishes before systole to lower LV afterload and oxygen demand.", M("IABP deflation must finish {{c1::before systolic ejection}}.", "Presystolic emptying lowers the pressure against which the LV ejects.", "module-physiology-iabp-09")),
      S("timing_faults", "objective:02", "applied-core", "comparison", "Early or late inflation and deflation create distinct waveform and loading consequences.", MP("IABP timing faults map as {{c1::early inflation → opposes ejection; late inflation → loses augmentation; early deflation → loses support; late deflation → raises afterload}}.", "Compare assisted with unassisted beats before changing timing.", 4)),
      S("trigger", "objective:03", "core", "model", "Trigger source and assist ratio must remain reliable as rate and rhythm change.", M("With irregular rhythm, IABP timing requires a reliable {{c1::trigger source}}.", "ECG and pressure triggers can fail differently, so verify every assisted beat.", null)),
      S("contraindication", "objective:04", "applied-core", "rescue", "Severe aortic regurgitation and limb ischemia can override technically effective counterpulsation.", MP("IABP safety problems map as {{c1::severe AR → avoid counterpulsation; pulseless limb → urgent access assessment}}.", "Diastolic augmentation worsens regurgitation, and femoral access can threaten limb perfusion.", 2, null, H())),
      S("verify", ["objective:05", "equation:03"], "core", "model", "Assisted-to-unassisted beat comparison verifies benefit because counterpulsation is not independent forward pumping.", M("IABP benefit is verified by comparing {{c1::assisted and unassisted beats}}.", "Look for better diastolic augmentation and lower assisted systolic pressure.", "module-physiology-iabp-10"))
    ],
    "teg-rotem": [
      S("concept", "concept", "core", "model", "Viscoelastic phases map clot initiation, propagation, strength, and breakdown to different defects.", M("A TEG or ROTEM trace should be read as a {{c1::sequence of clot phases}}.", "Treat the dominant validated defect rather than the graph's overall appearance.", "module-physiology-teg-rotem-01")),
      S("parameters", ["objective:01", "equation:01", "equation:02"], "core", "comparison", "R or CT maps initiation, K or alpha maps propagation, MA or MCF maps strength, and LY30 or ML maps lysis.", MP("Viscoelastic parameters map as {{c1::R/CT → initiation; K/alpha → propagation; MA/MCF → strength; LY30/ML → lysis}}.", "The phase identifies which component needs confirmation and targeted treatment.", 4, "module-physiology-teg-rotem-08")),
      S("heparinase", ["objective:02", "equation:03"], "applied-core", "mechanism", "Correction of prolonged initiation in the heparinase channel supports residual heparin effect.", M("Heparinase-channel correction supports {{c1::residual heparin}}.", "Failure to correct points toward factor deficiency or another anticoagulant effect.", "module-physiology-teg-rotem-10")),
      S("targeted", "objective:03", "applied-core", "comparison", "Therapy is targeted to initiation, fibrinogen contribution, platelet contribution, or lysis using local thresholds.", MP("Viscoelastic treatment targets map as {{c1::long R/CT → factors; weak fibrin → fibrinogen; low strength → platelets; high lysis → antifibrinolytic}}.", "Confirm the relevant channel and follow the local product pathway.", 4, null, H())),
      S("surgical", ["objective:04", "objective:05"], "applied-core", "rescue", "A balanced trace cannot exclude surgical bleeding and does not justify empiric transfusion.", M("Brisk bleeding with a balanced viscoelastic trace suggests {{c1::a surgical source}}.", "Urgent surgical assessment is safer than indiscriminate product stacking.", null, H()))
    ],
    ecg: [
      S("concept", "concept", "core", "model", "A systematic rate-to-ST-T ECG read localizes postoperative rhythm and ischemic problems before treatment.", M("A postoperative ECG should be read with a {{c1::fixed interpretation sequence}}.", "A disciplined sequence prevents a dramatic abnormality from hiding another diagnosis.", "module-physiology-ecg-01")),
      S("sequence", "objective:01", "core", "sequence", "The ECG sequence is rate, rhythm, axis, intervals, QRS morphology, and ST-T changes.", SQ("The compact postoperative ECG sequence is {{c1::rate/rhythm; axis; intervals; QRS morphology; ST-T changes}}.", "Compare with the preoperative tracing after completing the sequence.", 5)),
      S("territories", ["objective:02", "equation:03"], "core", "comparison", "Inferior, anterior, and lateral lead groups map myocardial territories and grafts.", MP("ECG territories map as {{c1::II/III/aVF → inferior; V1-V4 → anterior; I/aVL/V5-6 → lateral}}.", "New territorial changes after CABG should be linked to the corresponding graft and wall motion.", 3, "module-physiology-ecg-10")),
      S("rhythm", "objective:03", "core", "mechanism", "Rhythm diagnosis integrates P-wave behavior, atrioventricular relationship, QRS width, and regularity.", B("Postoperative rhythm diagnosis checks {{c1::P waves; AV relationship; QRS width; regularity}}.", "Rate alone cannot distinguish AF, block, paced rhythm, or ventricular tachycardia.", 4)),
      S("capture", "objective:04", "applied-core", "rescue", "Electrical pacing spikes must be followed by electrical depolarization and a mechanical pulse to prove capture.", M("A pacing spike proves capture only when followed by {{c1::depolarization and a pulse}}.", "Electrical and mechanical capture must both be assessed in an unstable patient.", null, H())),
      S("escalate", "objective:05", "applied-core", "rescue", "Unstable rhythm or new ischemic change requires patient-first stabilization and immediate cause-directed escalation.", M("For an unstable postoperative ECG finding, first {{c1::stabilize the patient}}.", "Then address ischemia, electrolytes, temperature, drugs, pacing, and the surgical result.", null, H())),
      S("axis", "equation:01", "core", "number", "The lab defines normal frontal QRS axis as minus 30 through plus 90 degrees.", Q("The ECG lab's normal QRS axis is {{c1::-30 to +90°}}.", "Axis is one step in the sequence, not a standalone diagnosis.", N("range", [-30, 90], "degrees", "CardiacSchool normal frontal QRS axis", "exact"), "module-physiology-ecg-08")),
      S("intervals", "equation:02", "core", "number", "The lab uses PR 120 to 200 milliseconds and QRS under 120 milliseconds as normal interval anchors.", Q("The ECG lab interval anchors are {{c1::PR 120–200ms and QRS under 120ms}}.", "Measure intervals before assigning a conduction diagnosis.", N("intervals", "PR 120–200 ms and QRS under 120 ms", "milliseconds", "CardiacSchool normal PR and QRS anchors", "exact"), "module-physiology-ecg-09"))
    ],
    pacing: [
      S("concept", "concept", "core", "model", "Temporary pacing separates rate, output for capture, and sensitivity for sensing.", M("Temporary pacing requires separate control of {{c1::rate, output, and sensitivity}}.", "Changing one setting cannot correct every sensing or capture fault.", "module-physiology-pacing-01")),
      S("modes", ["objective:01", "equation:03"], "core", "comparison", "AAI requires intact AV conduction, VVI supplies ventricular backup, and DDD restores AV synchrony.", MP("Temporary pacing modes map as {{c1::AAI → intact AV conduction; VVI → ventricular backup; DDD → AV synchrony}}.", "Choose the simplest mode that safely supports the patient's conduction physiology.", 3, "module-physiology-pacing-10")),
      S("settings", ["objective:02", "equation:01"], "core", "comparison", "Output controls capture while sensitivity controls sensing.", MP("Pacing controls map as {{c1::output mA → capture; sensitivity mV → sensing}}.", "Measure thresholds before adding a safety margin.", 2, "module-physiology-pacing-08")),
      S("sensitivity", ["objective:03", "equation:02"], "core", "mechanism", "A lower programmed millivolt value makes the pacemaker more sensitive to intrinsic signals.", M("For temporary pacing, a lower mV setting is {{c1::more sensitive}}.", "This inverse relationship is a common source of programming error.", "module-physiology-pacing-09")),
      S("faults", "objective:04", "applied-core", "bounded-set", "Pacing faults are classified as failure to pace, capture, sense, or inappropriate inhibition or triggering.", B("Temporary pacing faults include failure to {{c1::pace; capture; sense; avoid inappropriate inhibition}}.", "Connections, leads, thresholds, electrolytes, ischemia, and interference help localize the fault.", 4)),
      S("rescue", "objective:05", "applied-core", "rescue", "A pacing-dependent patient with failed epicardial support needs patient-first stabilization and reliable backup pacing.", SQ("For pacing-dependent noncapture: {{c1::support the patient; maximize/check system; apply external backup; secure transvenous pacing}}.", "Treat reversible metabolic or ischemic causes while obtaining reliable pacing.", 4, null, H()))
    ],
    "cath-projections": [
      S("concept", "concept", "core", "model", "The C-arm's two angulation axes degrade the image in different ways.", M("C-arm rotation changes vessel overlap, while C-arm tilt changes {{c1::vessel foreshortening}}.", "Rotation moves the detector between RAO and LAO; tilt moves it between caudal and cranial.")),
      S("axes", ["objective:01", "equation:01"], "core", "comparison", "Rotation maps onto overlap and tilt maps onto foreshortening.", MP("C-arm angulation maps as {{c1::RAO/LAO rotation → vessel overlap; caudal/cranial tilt → vessel foreshortening}}.", "Naming the artefact you are fighting tells you which axis to move.", 2)),
      S("reach", ["objective:02", "equation:02"], "core", "mechanism", "Every standard projection is reachable from the two angulation axes alone.", M("Every standard coronary projection is reached by combining {{c1::one rotation angle with one tilt angle}}.", "There are no further degrees of freedom, so every named view is one point on that two-axis map.")),
      S("views", "objective:03", "core", "comparison", "Each named view is acquired to answer one specific anatomic question.", MP("Named views map as {{c1::spider → left-main bifurcation; AP–LAO cranial → RCA crux; RAO ventriculogram → ejection fraction}}.", "Each also sacrifices something: the spider view foreshortens everything distal to the bifurcation.", 3)),
      S("vessel_id", "objective:04", "applied-core", "bounded-set", "The named left-system structures labelled on a standard frame.", B("Standard left-system labels are {{c1::left main; LAD; circumflex; diagonal; obtuse marginal}}.", "Identification depends on the projection: the same vessel moves between cranial and caudal views.", 5)),
      S("single_view_trap", ["objective:05", "equation:03"], "applied-core", "mechanism", "One projection cannot settle a bifurcation because overlap and foreshortening are projection artefacts, not anatomy.", M("One projection cannot settle a bifurcation because overlap and foreshortening are {{c1::artefacts of detector geometry, not anatomy}}.", "Confident reading of a single frame is a common source of a wrong distal target."))
    ]
  };

  Object.keys(PHYSIOLOGY_SPECS).forEach(id => registerSource("physiology", id, id, PHYSIOLOGY_SPECS[id], "CardiacSchool physiology lab: " + id));

  /* ====================================================================
     CORONARY ANGIOGRAPHY — one concise section target plus staged image
     interpretation and action targets for every case.
     ==================================================================== */
  const ANGIO_SECTION_TARGETS = [
    ["orientation-history", "projection-dependent coronary anatomy", "A two-dimensional frame changes with detector geometry."],
    ["orientation-practice", "committed reads with delayed feedback", "Active tracing and correction build visual fluency."],
    ["orientation-sequence", "acquisition before anatomy before consequence", "The fixed order prevents premature lesion labeling."],
    ["orientation-static-boundary", "cine for time-dependent findings", "Still frames cannot prove transit, washout, or systolic compression."],
    ["safe-procedure-arc", "risk review before selective acquisition", "Access, renal, allergy, anticoagulation, and radiation risks precede imaging."],
    ["safe-engagement", "normal pressure before injection", "A pressure-verified coaxial engagement is required before contrast."],
    ["safe-manifold-sequence", "de-air, pressure-check, engage, then acquire", "Damping or ventricularization removes permission to inject."],
    ["safe-pressure", "preserved aortic waveform morphology", "Loss of pulse amplitude or an LV-like contour signals unsafe engagement."],
    ["anatomy-rca", "right AV-groove course to the crux", "The RCA is traced from right sinus to distal branches."],
    ["anatomy-left-main-lad", "LAD course in the anterior interventricular groove", "Septals and diagonals are identified by origin and direction."],
    ["anatomy-lcx", "LCx course in the left AV groove", "Obtuse marginals supply lateral and posterolateral LV."],
    ["anatomy-dominance", "PDA origin at the crux", "The artery supplying the PDA defines dominance."],
    ["geometry-axes", "rotation plus cranial-caudal tilt", "RAO/LAO and cranial/caudal describe separate detector axes."],
    ["geometry-left-corners", "cranial LAD and caudal left-main separation", "Complementary views open different left-system relationships."],
    ["geometry-supplemental", "tailored views for the unanswered question", "AP and lateral projections supplement standard corners."],
    ["geometry-errors", "orthogonal views for overlap or foreshortening", "A second geometry tests whether apparent disease is real."],
    ["left-lao-cranial", "LAD-diagonal separation", "LAO cranial elongates the LAD and fans diagonals."],
    ["left-spider", "distal left-main bifurcation opening", "LAO caudal profiles proximal LAD and LCx but can foreshorten."],
    ["left-rao-cranial-caudal", "cranial LAD and caudal LCx profiling", "Tilt determines which left-system branch is elongated."],
    ["left-system-tracing", "continuous ostium-to-distal vessel tracing", "Continuous tracing prevents branch substitution."],
    ["right-lao", "cranial separation of distal RCA branches", "The open bifurcation distinguishes PDA from posterolateral branches."],
    ["right-rao-distal", "added cranial tilt for distal RCA", "A flat RAO view may superimpose the distal branches."],
    ["graft-projections", "origin-to-runoff graft imaging", "A graft study includes origin, body, anastomosis, and recipient bed."],
    ["right-quality", "state RCA acquisition limitations", "Streaming, incomplete filling, overlap, damping, and motion reduce confidence."],
    ["lesion-geometry", "reference-segment luminal comparison", "Lesion severity depends on an appropriate normal reference."],
    ["lesion-complete-description", "segment, morphology, flow, and distal target", "A percentage alone is not a surgical description."],
    ["lesion-legacy-abc", "historical morphology vocabulary", "The A/B/C scheme is not a complete modern risk model."],
    ["lesion-anatomy-physiology", "separate narrowing from ischemic significance", "Visible stenosis and flow limitation answer different questions."],
    ["pathology-calcification-ulceration", "describe contour without inventing composition", "One still cannot prove calcium or ulceration."],
    ["pathology-filling-defect", "air-thrombus-dissection-artifact differential", "Context, cine, and orthogonal views identify the mechanism."],
    ["pathology-bridging", "systolic compression with diastolic release", "Dynamic cine behavior is required to diagnose bridging."],
    ["pathology-complications", "recognize dissection, perforation, and embolization", "Pressure checks and de-airing prevent avoidable complications."],
    ["variants-fistula", "origin, course, termination, and shunt", "All channels and consequences must be defined before closure."],
    ["variants-anomalies", "three-dimensional proximal coronary course", "The proximal route determines risk and operative vulnerability."],
    ["variants-collaterals", "donor, recipient, and dependent territory", "Donor disease can endanger two myocardial beds."],
    ["variants-aneurysm", "cross-sectional definition of size and thrombus", "Angiography shows lumen but can underestimate external size."],
    ["flow-timi", "cine-dependent epicardial transit", "TIMI grade requires speed and completeness of distal filling."],
    ["flow-blush", "tissue entry and washout kinetics", "TMPG is distinct from epicardial flow."],
    ["flow-discordance", "open artery with impaired tissue perfusion", "TIMI 3 flow does not guarantee normal microvascular reperfusion."],
    ["flow-static-practice", "definitions only from static scenarios", "Transit and washout still require cine."],
    ["adjuncts-lvgram", "projection-specific ventricular wall motion", "RAO and LAO ventriculography profile different LV walls."],
    ["adjuncts-hemodynamics", "simultaneous pressures for physiologic relationships", "Direct pressures define gradients, filling, and pulmonary load."],
    ["adjuncts-physiology", "pressure ratios for lesion significance", "FFR uses hyperemia while iFR uses a resting wave-free period."],
    ["adjuncts-ivus-ctca", "wall imaging versus three-dimensional course", "IVUS and CTCA answer different angiographic uncertainties."],
    ["surgery-map", "territory-to-target operative mapping", "Each lesion ends in a target, landing zone, runoff, and consequence."],
    ["surgery-target-conduit", "viable target with healthy wall and runoff", "Native competitive flow can threaten an arterial graft."],
    ["surgery-graft-failure", "early technical or thrombotic dysfunction", "Flow measurement and wall motion can expose failure before closure."],
    ["surgery-integrated-report", "complete anatomy-to-operation synthesis", "The final report states dominance, disease, uncertainty, physiology, and targets."]
  ];
  const angiography = window.ANGIOGRAPHY || { chapters: [], cases: [] };
  const angioSections = new Map();
  (angiography.chapters || []).forEach(chapter => (chapter.sections || []).forEach(section => angioSections.set(section.id, { chapter: chapter, section: section })));
  const angioSpecs = ANGIO_SECTION_TARGETS.map(row => {
    const found = angioSections.get(row[0]);
    if (!found) throw new Error("Missing angiography section " + row[0]);
    return S("section_" + row[0].replace(/-/g, "_"), "section:" + found.chapter.id + ":" + row[0], "core", "model", row[1] + ". " + row[2], M("The " + found.section.title + " retrieval target is {{c1::" + row[1] + "}}.", row[2], "module-angiography-section-" + row[0] + "-1"));
  });
  const ANGIO_CASE_TARGETS = {
    "case-pressure-ventricularization": ["catheter-induced pressure ventricularization", "withdraw and do not inject"],
    "case-left-rao-caudal": ["RAO caudal left coronary view", "map LCx and obtain a cranial view"],
    "case-left-lao-cranial": ["LAO cranial left coronary view", "separate LAD and diagonal targets"],
    "case-left-ramus": ["left-main trifurcation with ramus", "treat the ramus as an independent target"],
    "case-left-rao-cranial-trace": ["RAO cranial LAD tracing view", "confirm distal LAD and diagonal targets"],
    "case-rca-distal-bifurcation": ["right-dominant distal RCA bifurcation", "report PDA and posterolateral targets separately"],
    "case-rca-suboptimal": ["inadequate distal RCA projection", "obtain a cranial or orthogonal view"],
    "case-calcified-ulcerated-plaque": ["irregular plaque contour of uncertain composition", "choose a healthier distal landing zone"],
    "case-filling-defect": ["coronary intraluminal filling defect", "differentiate air, thrombus, dissection, and artifact"],
    "case-embolization-comparison": ["indeterminate coronary embolic filling defect", "stop injections and inspect the system"],
    "case-myocardial-bridge": ["suspected dynamic myocardial bridge", "confirm cine behavior before considering surgery"],
    "case-lad-pa-fistula": ["LAD-to-pulmonary-artery fistula", "map channels while preserving normal branches"],
    "case-anomalous-lcx": ["retroaortic anomalous LCx", "warn the mitral and aortic surgeon"],
    "case-collateral-map": ["collateral-dependent recipient territory", "protect donor and graft viable recipient"],
    "case-coronary-aneurysm": ["coronary aneurysm with incompletely defined wall", "obtain cross-sectional size and thrombus definition"],
    "case-true-lateral-lima": ["true lateral LIMA-LAD view", "inspect graft origin through distal runoff"]
  };
  (angiography.cases || []).forEach(item => {
    const target = ANGIO_CASE_TARGETS[item.id];
    if (!target) throw new Error("Missing angiography case target " + item.id);
    const part = "case:" + item.id;
    angioSpecs.push(S("case_" + item.id.replace(/-/g, "_") + "_identify", part, "core", "image", "The staged case demonstrates " + target[0] + ".", IMG("The staged angiography case demonstrates {{c1::" + target[0] + "}}.", "Use projection, course, morphology, and acquisition quality before revealing the label.", item.image, "module-angiography-case-" + item.id + "-interpretation")));
    angioSpecs.push(S("case_" + item.id.replace(/-/g, "_") + "_act", part, "applied-core", "mechanism", "The operative or acquisition action is to " + target[1] + ".", M("For this angiography case, the next action is to {{c1::" + target[1] + "}}.", "The action follows the specific geometric or safety limitation in the staged case.", "module-angiography-case-" + item.id + "-consequence", H("Angiography acquisition and operative-translation actions require specialist review."))));
  });
  registerSource("angiography", "coronary-angiography", "Coronary Angiography", angioSpecs, "CardiacSchool coronary angiography source atlas");

  /* ====================================================================
     ORDER EXERCISES — only independent phase-order objectives are carded.
     Source steps remain stable ledger parts; concurrent work is grouped as
     a phase rather than falsely serialized.
     ==================================================================== */
  function catalogSafeId(value) {
    return String(value == null ? "part" : value).toLowerCase().replace(/<[^>]+>/g, " ")
      .replace(/&[a-z0-9#]+;/gi, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "part";
  }
  function exercisePart(exercise, index) {
    return exercise.id + "-step-" + String(index + 1).padStart(2, "0") + "-" + catalogSafeId(exercise.steps[index]);
  }
  function exercisePack(id, groups) {
    const exercise = (window.EXERCISES || []).find(item => item.id === id);
    if (!exercise) throw new Error("Missing exercise " + id);
    const specs = groups.map((group, groupIndex) => S(
      "phase_" + String(groupIndex + 1).padStart(2, "0"),
      group.indices.map(index => exercisePart(exercise, index)),
      group.tier || "core", "sequence", group.statement,
      SQ(group.cloze, group.explanation, group.count, null, group.high ? H() : null)
    ));
    registerSource("exercise", id, exercise.title, specs, "CardiacSchool order exercise: " + exercise.title);
  }
  exercisePack("ex-ischemic-cascade", [
    { indices:[0,1,2,3], count:4, statement:"Ischemia progresses from metabolic failure through ATP depletion to diastolic and then systolic dysfunction.", cloze:"The early ischemic cascade is {{c1::anaerobic metabolism; ATP depletion; diastolic dysfunction; regional systolic dysfunction}}.", explanation:"Mechanical dysfunction precedes surface ECG and symptoms." },
    { indices:[3,4,5,6], count:4, statement:"After wall-motion abnormality, ECG change and pain precede irreversible necrosis.", cloze:"The later ischemic cascade is {{c1::wall-motion abnormality; ECG change; anginal pain; irreversible necrosis}}.", explanation:"Pain is late, while persistent ischemia eventually causes cell death." }
  ]);
  exercisePack("ex-onto-bypass", [
    { indices:[0,1,2,3], count:4, statement:"Exposure and anticoagulation precede purse strings and arterial cannulation.", cloze:"Going onto CPB begins with {{c1::expose heart/vessels; heparinize and verify ACT; place purse strings; insert arterial cannula}}.", explanation:"Anticoagulation is confirmed before cannulation." },
    { indices:[3,4,5,6], count:4, statement:"Arterial and venous cannulation precede connection, de-airing, and gradual flow.", cloze:"CPB connection proceeds as {{c1::secure arterial cannula; secure venous cannula; connect and de-air; increase flow gradually}}.", explanation:"Drainage and arterial-line safety are checked during the handoff." },
    { indices:[6,7,8,9], count:4, statement:"Gradual flow reaches full bypass before cross-clamping and cardioplegia.", cloze:"The final on-bypass transition is {{c1::increase flow; confirm full bypass; apply cross-clamp; deliver cardioplegia}}.", explanation:"The heart is protected immediately after the clamp." }
  ]);
  exercisePack("ex-off-bypass", [
    { indices:[0,1,2,3], count:4, statement:"Repair confirmation, rewarming, de-airing, and unclamping begin separation preparation.", cloze:"Separation preparation starts with {{c1::confirm repair; rewarm; de-air with TEE; remove cross-clamp}}.", explanation:"Preparation is completed before asking the heart to carry output." },
    { indices:[3,4,5,6,7], count:5, statement:"Reperfusion is followed by rhythm, metabolic, pacing, and ventilation readiness.", cloze:"After unclamping, establish {{c1::coronary reperfusion; stable rhythm; corrected metabolism; tested pacing; effective ventilation}}.", explanation:"These are coupled readiness checks, not isolated rituals." },
    { indices:[7,8,9,10,11], count:5, statement:"Ventilation and a controlled flow reduction precede full separation, protamine, and decannulation.", cloze:"The final separation sequence is {{c1::resume ventilation; reduce CPB flow; confirm stable separation; reverse heparin; decannulate and secure}}.", explanation:"Protamine follows complete separation from bypass.", high:true }
  ]);
  exercisePack("ex-cabg-sequence", [
    { indices:[0,1,2,3], count:4, statement:"Conduit harvest and bypass establishment precede cross-clamp and arrest.", cloze:"On-pump CABG begins with {{c1::open and harvest LIMA; harvest other conduits; establish CPB; clamp and arrest}}.", explanation:"Conduits and support are ready before protected-heart work." },
    { indices:[3,4,5,6], count:4, statement:"Arrest is followed by planned distal grafting, redosing, and protected-heart completion.", cloze:"Protected-heart CABG proceeds as {{c1::arrest heart; construct distal grafts; redose cardioplegia; complete protected-heart work}}.", explanation:"Distal order follows the declared exposure and protection plan." },
    { indices:[6,7,8,9,10], count:5, statement:"Protected work ends with de-airing, reperfusion, graft assessment, reversal, drains, and closure.", cloze:"CABG completion proceeds as {{c1::de-air protected work; reperfuse; wean and assess grafts; reverse and secure hemostasis; drain and close}}.", explanation:"Deferred proximal grafts are completed according to the declared clamp strategy." }
  ]);
  exercisePack("ex-tamponade-response", [
    { indices:[0,1,2,3], count:4, statement:"Recognition triggers surgical mobilization while echo and bridge resuscitation occur only if circulation permits.", cloze:"Suspected postoperative tamponade requires {{c1::recognize shock pattern; mobilize reopening team; image only if stable; bridge circulation}}.", explanation:"Peri-arrest deterioration requires reopening without waiting for echo." , high:true},
    { indices:[3,4,5,6], count:4, statement:"Bridge resuscitation and safe location choice lead to reopening, clot evacuation, and source control.", cloze:"Tamponade source control proceeds as {{c1::bridge circulation; choose safe reopening location; reopen and evacuate; control bleeding source}}.", explanation:"Transfer must not delay decompression in an unstable patient.", high:true },
    { indices:[6,7,8,9], count:4, statement:"After source control, irrigation, reassessment, and hemodynamic stability determine immediate or delayed closure.", cloze:"After tamponade source control: {{c1::secure hemostasis; irrigate and reassess; delay closure if unstable; close when stable}}.", explanation:"Closure timing follows physiology rather than a fixed schedule.", high:true }
  ]);
  exercisePack("ex-massive-transfusion", [
    { indices:[0,1,2,3], count:4, statement:"Recognition and activation launch concurrent access, warmed blood, monitoring, and source-control work.", cloze:"Massive-hemorrhage response begins with {{c1::recognize life-threatening bleeding; activate MTP/source control; start warmed resuscitation; send serial tests}}.", explanation:"Testing and source control proceed concurrently with blood delivery.", high:true },
    { indices:[3,4,5,6], count:4, statement:"Serial tests guide balanced oxygen-carriage restoration, warming, calcium, and targeted hemostatic therapy.", cloze:"MTP refinement proceeds as {{c1::trend clot/physiology tests; restore oxygen carriage; warm and replace calcium; target hemostatic deficits}}.", explanation:"Local pathways define products and thresholds.", high:true },
    { indices:[6,7,8,9], count:4, statement:"Targeted therapy is repeatedly reassessed while urgent re-exploration controls persistent surgical bleeding.", cloze:"Definitive hemorrhage control is {{c1::target deficits; reassess continuously; re-explore persistent bleeding; secure source and recovery}}.", explanation:"Complete laboratory correction must not delay urgent surgical source control.", high:true }
  ]);
  exercisePack("ex-postop-af", [
    { indices:[0,1,2,3,4], count:5, statement:"AF confirmation and stability assessment branch to immediate cardioversion or stable rate/rhythm treatment while triggers are corrected.", cloze:"Early postoperative AF care is {{c1::confirm rhythm/stability; cardiovert if unstable; correct triggers; treat stable rate/rhythm; reassess response}}.", explanation:"Reversible-cause treatment continues in parallel with the stability branch.", high:true },
    { indices:[4,5,6,7,8], count:5, statement:"Persistent AF prompts cardioversion planning, duration-aware anticoagulation, individualized bleeding assessment, and follow-up.", cloze:"Persistent postoperative AF requires {{c1::reassess duration/recurrence; consider cardioversion; use duration-aware pathway; individualize anticoagulation; arrange follow-up}}.", explanation:"Stroke prevention is balanced against recent surgical bleeding.", high:true }
  ]);
  exercisePack("ex-sternotomy-closure", [
    { indices:[0,1,2,3], count:4, statement:"Hemostasis and irrigation precede drains, pericardial management, and sternal wiring.", cloze:"Sternotomy closure begins with {{c1::confirm hemostasis/irrigate; place drains; manage pericardium; wire sternum}}.", explanation:"Deep closure follows control of mediastinal bleeding and drainage." },
    { indices:[3,4,5,6,7], count:5, statement:"Sternal wiring is tested for stability before fascial, subcutaneous, and skin closure.", cloze:"After wiring the sternum: {{c1::test stability; close deep fascia; close subcutaneous layers; close skin; apply sterile dressing}}.", explanation:"Layered closure follows a stable bony construct." }
  ]);

})();
