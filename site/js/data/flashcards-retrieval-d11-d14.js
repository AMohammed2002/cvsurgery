/* Authored retrieval-v2 lesson packs: Days 11-14.
   Claims are deliberately explicit so every teaching chunk remains traceable,
   including material classified as supporting context rather than a card. */
"use strict";

(function registerDay11To14RetrievalPacks() {
  if (!window.FlashcardSchema) throw new Error("FlashcardSchema must load before Day 11-14 retrieval packs.");

  const REVIEWED_AT = "2026-07-31";
  const NUMERIC_REVIEW_BY = "2028-07-31";
  const GUIDELINE_REVIEW_BY = "2027-07-31";
  const REVIEWER = "assistant-editorial-review";

  function C(key, partId, tier, category, statement, disposition, rationale, sourceRefs) {
    const categoryAliases = { contrast: "comparison", "mapping-set": "comparison", sequence: "rescue" };
    return {
      key: key,
      partId: partId,
      tier: tier,
      category: categoryAliases[category] || category,
      statement: statement,
      /* Cross-source reuse is expressed by sourceRefs. The validator reserves
         shared-card for a single card mapped to multiple claimIds. */
      disposition: disposition === "shared-card" ? "carded" : (disposition || "carded"),
      rationale: rationale || "A concise retrieval target changes recognition or management.",
      sourceRefSpecs: sourceRefs || null
    };
  }
  function K(id, claimKeys, archetype, cloze, hint, explanation, extra) {
    const singleTargetArchetype = ["rescue", "bounded-set", "mapping-set", "ordered-sequence", "contrast"].includes(archetype)
      ? "mechanism-decision" : archetype;
    /* A hyphen between positive numbers is parsed as a minus sign by the
       numeric release gate; use a typographic range dash in learner text. */
    cloze = String(cloze).replace(/(\d)-(\d)/g, "$1–$2");
    return Object.assign({
      id: id,
      claimKeys: Array.isArray(claimKeys) ? claimKeys : [claimKeys],
      archetype: singleTargetArchetype,
      cloze: cloze,
      hint: hint,
      explanation: explanation,
      identityDisposition: /^fc2_[a-z0-9]{26}$/.test(id) ? "new-target" : "equivalent-rewrite"
    }, extra || {});
  }
  function N(comparator, value, unit, condition, precision) {
    return {
      numeric: { comparator: Array.isArray(value) ? "range" : comparator, value: value, unit: unit, condition: condition, precision: precision },
      reviewBy: NUMERIC_REVIEW_BY,
      medicalReviewRequired: true,
      reviewReason: "Decision-changing numeric threshold or device setting requires clinician confirmation."
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
      reviewReason: reason || "High-stakes treatment or rescue target requires clinician and local-protocol confirmation."
    };
  }
  function registerLesson(sourceId, title, claimSpecs, cardSpecs) {
    const claimPrefix = "claim_" + sourceId.replace(/-/g, "_") + "_";
    const claimIds = new Map();
    const claims = claimSpecs.map(spec => {
      const claimId = claimPrefix + spec.key;
      claimIds.set(spec.key, claimId);
      const refs = (spec.sourceRefSpecs || [[sourceId, spec.partId]]).map(ref => ({
        type: "lesson", id: ref[0], partId: ref[1]
      }));
      return {
        claimId: claimId,
        tier: spec.tier,
        category: spec.category,
        statement: spec.statement,
        disposition: spec.disposition,
        rationale: spec.rationale,
        sourceRefs: refs
      };
    });
    const cards = cardSpecs.map(spec => {
      const record = Object.assign({}, spec, {
        claimIds: spec.claimKeys.map(key => {
          const claimId = claimIds.get(key);
          if (!claimId) throw new Error(sourceId + " card references unknown claim " + key);
          return claimId;
        })
      });
      delete record.claimKeys;
      return record;
    });
    window.FlashcardSchema.registerPack({
      source: { type: "lesson", id: sourceId },
      citation: "CardiacSchool lesson: " + title,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      workloadJustification: "This complete-source rebuild separates atomic concepts, decisions, thresholds, and rescue actions so lesson coverage is preserved without multi-sentence or oversized cloze prompts.",
      claims: claims,
      cards: cards
    });
  }

  /* ---------------- Day 11: Coagulation, heparin, protamine ---------------- */
  registerLesson("d11-coag", "Coagulation, Heparin & Protamine", [
    C("platelet_function", "why-cardiac-surgery-causes-coagulopathy", "core", "mechanism", "CPB may leave a near-normal platelet count but impaired platelet function."),
    C("fibrinogen_dilution", "why-cardiac-surgery-causes-coagulopathy", "core", "mechanism", "Crystalloid prime dilutes coagulation factors, with fibrinogen often depleted earliest."),
    C("thrombin_consumption", "why-cardiac-surgery-causes-coagulopathy", "applied-core", "mechanism", "Continuous thrombin generation drives consumptive coagulopathy during extracorporeal circulation."),
    C("heparin_rebound", "why-cardiac-surgery-causes-coagulopathy", "applied-core", "mechanism", "Tissue-bound heparin can redistribute after reversal and cause delayed anticoagulant effect."),
    C("storm_context", "why-cardiac-surgery-causes-coagulopathy", "enrichment", "model", "The post-CPB coagulopathy is a stacked interaction among dilution, consumption, fibrinolysis, temperature, medications, and surgical bleeding.", "supporting-context", "The integrative model supports the atomic mechanism cards without adding another list card."),

    C("cold_labs", "hypothermia-and-preoperative-medications", "core", "mechanism", "Coagulation assays warmed to 37 degrees Celsius underestimate coagulopathy in a hypothermic patient."),
    C("ticagrelor_stop", "hypothermia-and-preoperative-medications", "applied-core", "guideline", "The lesson teaches a typical three-day ticagrelor interruption before non-emergency open-heart surgery."),
    C("clopidogrel_stop", "hypothermia-and-preoperative-medications", "applied-core", "guideline", "The lesson teaches a typical five-day clopidogrel interruption before non-emergency open-heart surgery."),
    C("prasugrel_stop", "hypothermia-and-preoperative-medications", "applied-core", "guideline", "The lesson teaches a typical seven-day prasugrel interruption before non-emergency open-heart surgery."),
    C("act_trap", "hypothermia-and-preoperative-medications", "applied-core", "mechanism", "Thrombocytopenia can falsely prolong ACT after heparin reversal."),
    C("medication_context", "hypothermia-and-preoperative-medications", "enrichment", "evidence", "Aspirin pharmacology, DOAC interruption, and platelet-function testing modify case-specific planning.", "supporting-context", "These details need medication-specific and patient-specific interpretation rather than isolated recall."),

    C("r_time", "teg-and-rotem-viscoelastic-point-of-care-testing", "core", "definition", "R-time or CT measures initiation of fibrin formation and is prolonged by factor deficiency or anticoagulant effect."),
    C("alpha", "teg-and-rotem-viscoelastic-point-of-care-testing", "core", "definition", "A low alpha angle indicates impaired fibrinogen contribution or polymerization."),
    C("ma", "teg-and-rotem-viscoelastic-point-of-care-testing", "core", "definition", "Low MA or MCF with adequate fibrinogen indicates inadequate platelet number or function."),
    C("lysis", "teg-and-rotem-viscoelastic-point-of-care-testing", "core", "definition", "Elevated LY30 or excessive lysis indicates hyperfibrinolysis."),
    C("normal_trace", "teg-and-rotem-viscoelastic-point-of-care-testing", "applied-core", "rescue", "Ongoing brisk bleeding with a normal viscoelastic trace points toward a surgical source.", "shared-card", "This discriminator is shared with later bleeding lessons.", [
      ["d11-coag", "teg-and-rotem-viscoelastic-point-of-care-testing"],
      ["d11-reexplore", "surgical-vs-coagulopathic-bleeding-the-critical-distinction"],
      ["d13-complications", "post-operative-bleeding-thresholds-and-the-surgical-vs-coagulopathic-dis"]
    ]),
    C("teg_context", "teg-and-rotem-viscoelastic-point-of-care-testing", "enrichment", "evidence", "TEG and ROTEM mechanics, parallel terminology, and heterogeneous outcome evidence contextualize interpretation.", "supporting-context", "Instrument mechanics and secondary outcome caveats are useful context but not separate retrieval targets."),

    C("heparinase", "teg-guided-transfusion-algorithms", "applied-core", "mechanism", "Correction of clotting time in a heparinase channel identifies residual heparin and directs protamine."),
    C("fibtem", "teg-guided-transfusion-algorithms", "applied-core", "mechanism", "Low FIBTEM amplitude isolates inadequate fibrinogen contribution and directs fibrinogen replacement."),
    C("algorithm_context", "teg-guided-transfusion-algorithms", "enrichment", "evidence", "F1.2, D-dimer, DDAVP, and assay limitations refine specialized transfusion algorithms.", "supporting-context", "The specialized markers are secondary context and require local assay availability."),

    C("hat", "heparin-induced-thrombocytopenia-hit-pathophysiology", "core", "contrast", "Early mild non-immune heparin-associated thrombocytopenia differs from immune HIT."),
    C("hit_thrombosis", "heparin-induced-thrombocytopenia-hit-pathophysiology", "core", "mechanism", "Immune HIT causes platelet activation and thrombin generation, making thrombosis the defining hazard."),
    C("hit_context", "heparin-induced-thrombocytopenia-hit-pathophysiology", "enrichment", "number", "Post-CPB antibody prevalence, historical HITT incidence, and antibody persistence provide epidemiologic context.", "supporting-context", "Population estimates are not needed as standalone treatment decisions and need contemporary review."),

    C("hit_stop", "hit-diagnosis-and-management", "core", "rescue", "When HIT is sufficiently suspected, all heparin sources must be stopped without waiting for confirmatory testing."),
    C("hit_anticoagulate", "hit-diagnosis-and-management", "core", "rescue", "Stopping heparin alone is insufficient; start a non-heparin anticoagulant."),
    C("hit_argatroban", "hit-diagnosis-and-management", "applied-core", "comparison", "Argatroban is hepatically cleared and is useful when renal failure limits other agents."),
    C("hit_bivalirudin", "hit-diagnosis-and-management", "applied-core", "rescue", "Bivalirudin is the lesson's bypass anticoagulant for urgent CPB with circulating HIT antibodies."),
    C("hit_warfarin", "hit-diagnosis-and-management", "applied-core", "guideline", "Delay vitamin K antagonist therapy until platelet recovery above 150,000 per microliter."),
    C("hit_assay_context", "hit-diagnosis-and-management", "enrichment", "evidence", "ELISA is sensitive and SRA is a highly specific functional confirmation assay.", "supporting-context", "Assay characteristics support the clinical-action cards without another comparison card."),

    C("protamine_mechanism", "pgy-5-mastery-the-evolving-bleeding-chest-and-the-catastrophic-protamine", "core", "mechanism", "A catastrophic type III protamine reaction causes pulmonary vasoconstriction, acute RV pressure overload, and collapse."),
    C("protamine_stop", "pgy-5-mastery-the-evolving-bleeding-chest-and-the-catastrophic-protamine", "core", "rescue", "The first action in catastrophic protamine reaction is to stop protamine."),
    C("protamine_bypass", "pgy-5-mastery-the-evolving-bleeding-chest-and-the-catastrophic-protamine", "applied-core", "rescue", "If the RV is arresting from a protamine reaction, re-heparinize and return to CPB."),
    C("bleeding_trend_context", "pgy-5-mastery-the-evolving-bleeding-chest-and-the-catastrophic-protamine", "enrichment", "model", "Drainage, ACT, temperature, calcium, pH, fibrinogen, platelets, TEG, and hemodynamics must be trended together.", "supporting-context", "The monitoring bundle supports decisions but is too broad for one cloze.")
  ], [
    K("fc-d11-coag-platelet-dysfunction-1r2o0u1", "platelet_function", "mechanism-decision", "After uncomplicated CPB, a near-normal count can still conceal {{c1::platelet dysfunction}}.", "Count can mislead", "Circuit contact and thrombin activation impair platelet function even when platelet number is preserved."),
    K("fc2_q7m10000000000000000000001", "fibrinogen_dilution", "atomic-concept", "The coagulation substrate often depleted earliest by CPB prime is {{c1::fibrinogen}}.", "Clot-strength substrate", "Hemodilution lowers all factors, but fibrinogen commonly becomes the earliest critical quantitative deficit."),
    K("fc-d11-coag-thrombin-0n23jxt", "thrombin_consumption", "mechanism-decision", "The main engine of consumptive coagulopathy during extracorporeal circulation is {{c1::continuous thrombin generation}}.", "Consumption driver", "Thrombin activation consumes clotting proteins and platelets while also promoting fibrinolysis."),
    K("fc2_q7m10000000000000000000002", "heparin_rebound", "mechanism-decision", "Delayed anticoagulant effect after protamine may reflect {{c1::heparin rebound}} from tissue redistribution.", "Delayed after reversal", "Tissue-bound heparin can re-enter the circulation hours after apparently adequate reversal."),
    K("fc-d11-coag-under-report-08qhg5l", "cold_labs", "mechanism-decision", "At 34-35 degrees Celsius, assays run at 37 degrees Celsius {{c1::underestimate in-vivo coagulopathy}}.", "Warm tube, cold patient", "Rewarm and interpret the tracing, field, and laboratory values together before product decisions."),
    K("fc2_q7m10000000000000000000003", "ticagrelor_stop", "numeric-guideline", "A typical minimum preoperative interruption for ticagrelor is {{c1::3 days}}.", "Shortest P2Y12 interval", "Urgent cases still require individualized ischemic-versus-bleeding assessment.", Object.assign({}, N("=", 3, "days", "Typical minimum ticagrelor interruption before non-emergency open-heart surgery", "exact"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_q7m10000000000000000000004", "clopidogrel_stop", "numeric-guideline", "A typical minimum preoperative interruption for clopidogrel is {{c1::5 days}}.", "Middle P2Y12 interval", "Urgent cases still require individualized ischemic-versus-bleeding assessment.", Object.assign({}, N("=", 5, "days", "Typical minimum clopidogrel interruption before non-emergency open-heart surgery", "exact"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_q7m10000000000000000000005", "prasugrel_stop", "numeric-guideline", "A typical minimum preoperative interruption for prasugrel is {{c1::7 days}}.", "Longest P2Y12 interval", "Urgent cases still require individualized ischemic-versus-bleeding assessment.", Object.assign({}, N("=", 7, "days", "Typical minimum prasugrel interruption before non-emergency open-heart surgery", "exact"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_q7m10000000000000000000006", "act_trap", "mechanism-decision", "After heparin reversal, thrombocytopenia can make ACT appear {{c1::falsely prolonged}}.", "Do not reflex protamine", "A high ACT must be interpreted with platelet count, temperature, and the operative field."),
    K("fc2_q7m10000000000000000000007", "r_time", "atomic-concept", "A prolonged TEG R-time or ROTEM CT indicates impaired {{c1::clot initiation}}.", "First fibrin strands", "The differential includes factor deficiency and residual anticoagulant effect."),
    K("fc2_q7m10000000000000000000008", "alpha", "mechanism-decision", "A low alpha angle directs attention to {{c1::fibrinogen replacement}}.", "Clot-build rate", "The alpha angle reflects fibrinogen function and fibrin polymerization."),
    K("fc2_q7m10000000000000000000009", "ma", "mechanism-decision", "Low MA with adequate fibrinogen directs treatment toward {{c1::platelets}}.", "Peak clot strength", "Once fibrinogen contribution is adequate, low maximum amplitude indicates platelet number or function."),
    K("fc2_q7m10000000000000000000010", "lysis", "mechanism-decision", "Elevated LY30 identifies {{c1::hyperfibrinolysis}} and supports antifibrinolytic therapy.", "Clot dissolves early", "Excess lysis after maximum amplitude is the viscoelastic signature of pathologic fibrinolysis."),
    K("fc2_q7m10000000000000000000011", "normal_trace", "mechanism-decision", "Brisk bleeding with a normal viscoelastic trace is {{c1::surgical bleeding}} until proven otherwise.", "Field, not factors", "Products do not close an anatomic bleeding source; prompt surgical control is required."),
    K("fc-d11-coag-protamine-16kxlmk", "heparinase", "mechanism-decision", "If clotting time corrects with heparinase, treat residual heparin with {{c1::protamine}}.", "HEPTEM correction", "Heparinase distinguishes residual heparin from a true factor deficit."),
    K("fc2_q7m10000000000000000000012", "fibtem", "mechanism-decision", "A low FIBTEM amplitude directs therapy toward {{c1::fibrinogen replacement}} rather than platelets.", "Platelets inhibited", "FIBTEM isolates the fibrin-based contribution to clot strength."),
    K("fc-d11-coag-heparin-associated-thrombocytopenia-hat-0ohufu9", "hat", "contrast", "A mild platelet fall within three days without antibodies is {{c1::heparin-associated thrombocytopenia}} rather than HIT.", "Benign early fall", "HAT is an early, non-immune effect; immune HIT is delayed and prothrombotic."),
    K("fc2_q7m10000000000000000000013", "hit_thrombosis", "mechanism-decision", "The defining clinical danger of immune HIT is {{c1::thrombosis}}, not bleeding.", "White-clot syndrome", "PF4-heparin IgG complexes activate platelets and generate thrombin despite thrombocytopenia."),
    K("fc2_q7m10000000000000000000014", "hit_stop", "ordered-sequence", "With sufficiently suspected HIT, immediately stop {{c1::all heparin sources}}.", "Flushes count too", "Do not wait for confirmatory testing before removing heparin exposure."),
    K("fc2_q7m10000000000000000000015", "hit_anticoagulate", "mechanism-decision", "After stopping heparin for HIT, start a {{c1::non-heparin anticoagulant}}.", "Cessation alone fails", "Platelet activation and thrombosis risk persist after heparin is removed."),
    K("fc2_q7m10000000000000000000016", "hit_argatroban", "mapping-set", "For HIT with renal failure, the hepatically cleared option is {{c1::argatroban}}.", "Liver-cleared DTI", "Agent choice follows clearance; liver disease instead requires caution with argatroban."),
    K("fc2_q7m10000000000000000000017", "hit_bivalirudin", "mapping-set", "For urgent CPB with circulating HIT antibodies, the lesson selects {{c1::bivalirudin}}.", "Non-heparin bypass", "Continuous circuit flow is essential because stagnant blood can clot during bivalirudin bypass.", Object.assign({}, G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "not-stated-in-lesson", "not-stated-in-lesson"), { reviewReason: "Urgent-CPB anticoagulation in HIT requires perfusion and hematology review." })),
    K("fc2_q7m10000000000000000000018", "hit_warfarin", "numeric-guideline", "In HIT, defer warfarin until platelets recover above {{c1::150,000 per microliter}}.", "Avoid protein-C crash", "Starting warfarin earlier can precipitate limb gangrene or skin necrosis.", Object.assign({}, N(">", 150000, "platelets/microliter", "Platelet recovery before vitamin K antagonist initiation in HIT", "exact"), G("ash-hit-guideline", "American Society of Hematology", 2018, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_q7m10000000000000000000019", "protamine_mechanism", "mechanism-decision", "Type III protamine reaction causes pulmonary vasoconstriction and acute {{c1::RV pressure overload}}.", "Collapse within minutes", "The abrupt rise in pulmonary afterload can produce severe RV failure and circulatory collapse."),
    K("fc2_q7m10000000000000000000020", "protamine_stop", "ordered-sequence", "The first action in catastrophic protamine reaction is {{c1::stop protamine}}.", "Remove the trigger", "Giving more protamine for presumed rebound heparin worsens this reaction."),
    K("fc2_q7m10000000000000000000021", "protamine_bypass", "rescue", "If protamine-induced RV collapse progresses to arrest, {{c1::re-heparinize and resume CPB}}.", "Mechanical rescue", "Bypass supports circulation while the pulmonary vascular reaction abates.", { medicalReviewRequired: true, reviewBy: NUMERIC_REVIEW_BY, reviewReason: "Catastrophic protamine-reaction rescue sequence requires local protocol and clinician review." })
  ]);

  /* ---------------- Day 11: Blood conservation and transfusion ---------------- */
  registerLesson("d11-bleeding", "Post-op Bleeding & Transfusion", [
    C("preop_anemia", "blood-conservation-the-multi-modal-approach", "applied-core", "number", "The lesson targets preoperative hemoglobin above 130 g/L when correcting elective-surgery anemia."),
    C("cell_saver", "blood-conservation-the-multi-modal-approach", "core", "definition", "Cell salvage washes shed blood and returns packed red cells."),
    C("rap", "blood-conservation-the-multi-modal-approach", "core", "mechanism", "Retrograde autologous priming displaces crystalloid circuit prime with the patient's blood to reduce hemodilution."),
    C("conservation_context", "blood-conservation-the-multi-modal-approach", "enrichment", "evidence", "Risk prediction, minimally invasive access, topical agents, and multidisciplinary programs support a multimodal conservation strategy.", "supporting-context", "These program-level details are preserved as context rather than fragmented into low-yield cards."),

    C("txa_mechanism", "tranexamic-acid-evidence-and-adverse-effects", "core", "mechanism", "TXA is a lysine analogue that blocks plasminogen binding to fibrin and impairs fibrinolysis."),
    C("txa_seizure", "tranexamic-acid-evidence-and-adverse-effects", "core", "mechanism", "Postoperative seizure is the major dose-dependent adverse effect of high-dose TXA."),
    C("txa_guideline", "tranexamic-acid-evidence-and-adverse-effects", "applied-core", "guideline", "The lesson describes TXA as a Class I recommended blood-conservation intervention."),
    C("txa_context", "tranexamic-acid-evidence-and-adverse-effects", "enrichment", "evidence", "ATACAS, EACA dosing, aprotinin history, and topical antifibrinolytics contextualize TXA use.", "supporting-context", "Historical comparisons and secondary dosing details need periodic specialist review."),

    C("rbc_threshold", "transfusion-thresholds-rbc-and-platelets", "applied-core", "number", "TRICS III used a restrictive hemoglobin threshold of 7.5 g/dL in the operating room and ICU."),
    C("rbc_context", "transfusion-thresholds-rbc-and-platelets", "enrichment", "evidence", "TRICC, TRACS, TITRe2, hypothermic bypass hematocrit, ischemia, and reserve modify transfusion context.", "supporting-context", "Trial history and exceptions support but should not overload the primary threshold card."),
    C("platelet_50", "transfusion-thresholds-rbc-and-platelets", "applied-core", "number", "Active bleeding with platelet count below 50,000 per microliter supports platelet transfusion."),
    C("platelet_100", "transfusion-thresholds-rbc-and-platelets", "applied-core", "number", "Active bleeding with platelet dysfunction and count below 100,000 per microliter supports platelet transfusion."),

    C("ffp", "transfusion-thresholds-ffp-and-cryoprecipitate", "applied-core", "number", "Active bleeding with factor deficiency or INR above about 1.5-1.6 supports FFP."),
    C("cryo", "transfusion-thresholds-ffp-and-cryoprecipitate", "applied-core", "number", "Active bleeding with fibrinogen below about 150-200 mg/dL supports fibrinogen replacement."),
    C("pcc", "transfusion-thresholds-ffp-and-cryoprecipitate", "applied-core", "comparison", "PCC rapidly replaces vitamin-K-dependent factors with less volume than FFP."),
    C("ddavp", "transfusion-thresholds-ffp-and-cryoprecipitate", "applied-core", "mechanism", "DDAVP raises von Willebrand factor and can help uremic or antiplatelet-exposed platelet dysfunction."),
    C("factor_context", "transfusion-thresholds-ffp-and-cryoprecipitate", "enrichment", "evidence", "Cryoprecipitate composition, fibrinogen concentrate, rFVIIa evidence, and allogeneic-product harms provide escalation context.", "supporting-context", "These high-risk rescue details should remain visible but not become routine-action cards."),

    C("trace_product", "senior-reasoning-read-the-product-off-the-tracing-and-separate-surgical-", "core", "mapping-set", "Viscoelastic deficits should direct a specific product rather than an empiric transfusion panel.", "shared-card", "The mapping is shared with the coagulation and later complication lessons.", [
      ["d11-bleeding", "senior-reasoning-read-the-product-off-the-tracing-and-separate-surgical-"],
      ["d13-complications", "post-operative-bleeding-thresholds-and-the-surgical-vs-coagulopathic-dis"]
    ]),
    C("bloodless_context", "senior-reasoning-read-the-product-off-the-tracing-and-separate-surgical-", "enrichment", "model", "Patients declining products require pre-incision anemia optimization, cell salvage, RAP, antifibrinolysis, and an agreed threshold.", "supporting-context", "This is a planning bundle rather than a single atomic recall target.")
  ], [
    K("fc2_r8n20000000000000000000001", "preop_anemia", "numeric-guideline", "For elective cardiac surgery, the lesson's preoperative hemoglobin target is above {{c1::130 g/L}}.", "Optimize red-cell mass", "Treating anemia before incision is a central blood-conservation intervention.", Object.assign({}, N(">", 130, "g/L", "Preoperative hemoglobin target during elective cardiac-surgery anemia optimization", "exact"), G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc-d11-bleeding-cell-saver-autotransfusion-1fwwds5", "cell_saver", "atomic-concept", "Collecting, washing, and returning shed red cells is {{c1::cell salvage}}.", "Autologous return", "Cell salvage reduces exposure to allogeneic red-cell transfusion."),
    K("fc2_r8n20000000000000000000002", "rap", "mechanism-decision", "Replacing crystalloid circuit prime with the patient's blood is {{c1::retrograde autologous priming}}.", "Reduce hemodilution", "RAP lowers the dilutional hit when bypass begins."),
    K("fc-d11-bleeding-lysine-analogues-0tz5624", "txa_mechanism", "mechanism-decision", "TXA and EACA reduce fibrinolysis because they are {{c1::lysine analogues}}.", "Block plasminogen binding", "They occupy plasminogen lysine-binding sites and limit attachment to fibrin."),
    K("fc2_r8n20000000000000000000003", "txa_seizure", "mechanism-decision", "The major dose-dependent adverse effect of high-dose TXA is {{c1::postoperative seizure}}.", "CNS glycine antagonism", "Dose-related antagonism of inhibitory glycine receptors is the proposed mechanism."),
    K("fc2_r8n20000000000000000000004", "txa_guideline", "mechanism-decision", "The lesson's Class I antifibrinolytic for cardiac-surgery blood conservation is {{c1::tranexamic acid}}.", "Standard lysine analogue", "Use remains dose- and patient-specific because seizure risk rises with exposure.", G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "Class I", "not-stated-in-lesson")),
    K("fc2_r8n20000000000000000000005", "rbc_threshold", "numeric-guideline", "TRICS III used an OR/ICU restrictive transfusion threshold of {{c1::7.5 g/dL}}.", "Restrictive hemoglobin", "The strategy was non-inferior to a liberal threshold for the trial's composite outcome.", N("<", 7.5, "g/dL", "TRICS III restrictive red-cell threshold in the operating room or ICU", "exact")),
    K("fc2_r8n20000000000000000000006", "platelet_50", "numeric-guideline", "With active bleeding, platelet count below {{c1::50,000 per microliter}} supports transfusion.", "Bleeding plus thrombocytopenia", "The count must be interpreted with platelet function and the operative field.", Object.assign({}, N("<", 50000, "platelets/microliter", "Platelet transfusion threshold with active bleeding", "exact"), G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_r8n20000000000000000000007", "platelet_100", "numeric-guideline", "With active bleeding and low MA, count below {{c1::100,000 per microliter}} supports platelets.", "Function plus count", "This higher threshold applies when viscoelastic testing demonstrates platelet dysfunction.", Object.assign({}, N("<", 100000, "platelets/microliter", "Platelet threshold with active bleeding and viscoelastic platelet dysfunction", "exact"), G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_r8n20000000000000000000008", "ffp", "numeric-guideline", "During active bleeding, FFP is supported when INR exceeds about {{c1::1.5-1.6}}.", "Replace multiple factors", "FFP treats demonstrated factor deficiency; it should not be given only to normalize a number.", Object.assign({}, N(">", [1.5, 1.6], "INR", "Approximate INR range supporting FFP when active bleeding is present", "range"), G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_r8n20000000000000000000009", "cryo", "numeric-guideline", "During active bleeding, replace fibrinogen below {{c1::150-200 mg/dL}}.", "Cryo or concentrate", "Cryoprecipitate or fibrinogen concentrate addresses the measured substrate deficit.", Object.assign({}, N("<", [150, 200], "mg/dL", "Fibrinogen range supporting replacement during active bleeding", "range"), G("sts-sca-pbm-2021", "STS/SCA/AmSECT/SABM", 2021, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_r8n20000000000000000000010", "pcc", "contrast", "For rapid warfarin reversal with less volume than plasma, choose {{c1::PCC}}.", "Vitamin-K-dependent factors", "PCC concentrates factors II, VII, IX, and X and avoids the volume burden of FFP."),
    K("fc2_r8n20000000000000000000011", "ddavp", "mapping-set", "For uremic or antiplatelet-exposed platelet dysfunction, consider {{c1::desmopressin}}.", "Raise von Willebrand factor", "DDAVP improves platelet adhesion but is not routine therapy for every post-CPB ooze."),
    K("fc2_r8n20000000000000000000012", "trace_product", "mapping-set", "In active bleeding, transfuse the demonstrated {{c1::viscoelastic deficit}} rather than a product panel.", "One defect, one fix", "Targeted therapy reduces unnecessary exposure and keeps a surgical source visible.")
  ]);

  /* ---------------- Day 11: Re-exploration and surgical bleeding ---------------- */
  registerLesson("d11-reexplore", "Re-exploration & Surgical Bleeding", [
    C("rate_400", "indications-for-surgical-re-exploration", "applied-core", "number", "The lesson's rate ladder considers re-exploration above 400 mL/h for one hour."),
    C("rate_300", "indications-for-surgical-re-exploration", "applied-core", "number", "The lesson's rate ladder considers re-exploration above 300 mL/h for two to three hours."),
    C("rate_200", "indications-for-surgical-re-exploration", "applied-core", "number", "The lesson's rate ladder considers re-exploration above 200 mL/h for four hours."),
    C("instability_override", "indications-for-surgical-re-exploration", "core", "rescue", "Tamponade or hemodynamic instability can mandate re-exploration regardless of drainage totals."),
    C("rate_context", "indications-for-surgical-re-exploration", "enrichment", "evidence", "Persistent lower drainage, serial chest radiography, and procedure-specific context modify threshold interpretation.", "supporting-context", "The rate ladder is a guide; the broader context is not another rigid threshold."),

    C("normal_teg_shared", "surgical-vs-coagulopathic-bleeding-the-critical-distinction", "core", "contrast", "Normal viscoelastic coagulation with ongoing brisk bleeding identifies a surgical source.", "shared-card", "This repeats the shared surgical-versus-coagulopathic discriminator."),
    C("microvascular", "surgical-vs-coagulopathic-bleeding-the-critical-distinction", "core", "contrast", "Diffuse microvascular ooze with little chest-tube clot suggests coagulopathic bleeding."),
    C("product_context", "surgical-vs-coagulopathic-bleeding-the-critical-distinction", "enrichment", "model", "Warming, calcium, pressure control, PEEP, antifibrinolysis, and deficit-directed products support coagulopathic management.", "supporting-context", "This is a multimodal treatment context rather than one cloze target."),

    C("tamponade_clot", "tamponade-after-cardiac-surgery-atypical-presentation", "core", "mechanism", "Post-surgical tamponade is often loculated clot that selectively compresses a chamber."),
    C("tamponade_treatment", "tamponade-after-cardiac-surgery-atypical-presentation", "core", "rescue", "Clot-mediated post-surgical tamponade requires surgical decompression rather than pericardiocentesis.", "shared-card", "This rescue principle is shared with the LCOS lesson.", [
      ["d11-reexplore", "tamponade-after-cardiac-surgery-atypical-presentation"],
      ["d13-lcos", "the-atypical-post-surgical-tamponade"]
    ]),
    C("echo_limit", "tamponade-after-cardiac-surgery-atypical-presentation", "applied-core", "evidence", "A negative echocardiogram cannot exclude loculated post-surgical tamponade.", "shared-card", "The imaging limitation is shared with the LCOS lesson.", [
      ["d11-reexplore", "tamponade-after-cardiac-surgery-atypical-presentation"],
      ["d13-lcos", "the-atypical-post-surgical-tamponade"]
    ]),
    C("resternotomy_time", "tamponade-after-cardiac-surgery-atypical-presentation", "applied-core", "number", "The lesson considers resternotomy after 5-10 minutes without ROSC, especially when tamponade is suspected."),
    C("tamponade_context", "tamponade-after-cardiac-surgery-atypical-presentation", "enrichment", "evidence", "Selective chamber collapse, pressure equalization, pulsus paradoxus, and ICU arrest outcomes contextualize recognition.", "supporting-context", "Multiple imaging and physiologic signs support, but no single sign rules tamponade in or out."),

    C("tube_stop", "clotted-chest-tubes-and-retained-hemothorax", "core", "rescue", "Abrupt loss of drainage with rising CVP and falling MAP means tube obstruction and tamponade until proven otherwise."),
    C("no_stripping", "clotted-chest-tubes-and-retained-hemothorax", "applied-core", "rescue", "Clotted tubes may be repositioned gently but should not be vigorously stripped."),
    C("hemothorax_context", "clotted-chest-tubes-and-retained-hemothorax", "enrichment", "evidence", "Retained hemothorax volume estimates, VATS evacuation, empyema, fibrothorax, and bedside tray readiness provide escalation context.", "supporting-context", "The precise imaging-volume threshold is institution- and modality-dependent and needs clinician review.")
  ], [
    K("fc2_s9p30000000000000000000001", "rate_400", "numeric-guideline", "Consider re-exploration when drainage exceeds {{c1::400 mL/h for 1 hour}}.", "Top rung", "Hemodynamic compromise or tamponade overrides any numeric ladder.", N(">", 400, "mL/h for 1 hour", "Chest-tube drainage prompting consideration of re-exploration", "institution-dependent")),
    K("fc2_s9p30000000000000000000002", "rate_300", "numeric-guideline", "Consider re-exploration when drainage exceeds {{c1::300 mL/h for 2-3 hours}}.", "Middle rung", "Correct demonstrated coagulopathy while mobilizing for surgical control.", N(">", 300, "mL/h for 2-3 hours", "Chest-tube drainage prompting consideration of re-exploration", "institution-dependent")),
    K("fc2_s9p30000000000000000000003", "rate_200", "numeric-guideline", "Consider re-exploration when drainage exceeds {{c1::200 mL/h for 4 hours}}.", "Lower sustained rung", "Clinical trajectory and hemodynamics remain more important than a single threshold.", N(">", 200, "mL/h for 4 hours", "Chest-tube drainage prompting consideration of re-exploration", "institution-dependent")),
    K("fc2_s9p30000000000000000000004", "instability_override", "mechanism-decision", "With tamponade or hemorrhagic instability, {{c1::do not wait for a volume threshold}}.", "Trajectory overrides totals", "Escalating support or obstructive physiology can demand immediate re-exploration."),
    K("fc2_s9p30000000000000000000005", "normal_teg_shared", "contrast", "Normal TEG plus brisk drainage indicates {{c1::surgical bleeding}}.", "A suture, not a factor", "An intact coagulation system cannot explain continued focal blood loss."),
    K("fc2_s9p30000000000000000000006", "microvascular", "contrast", "Diffuse wound-edge ooze with little tube clot suggests {{c1::coagulopathic bleeding}}.", "Weeping everywhere", "Correct temperature, calcium, fibrinolysis, and the demonstrated factor or platelet deficit."),
    K("fc2_s9p30000000000000000000007", "tamponade_clot", "mechanism-decision", "Post-surgical tamponade often comes from {{c1::loculated clot}} compressing one chamber.", "Beck triad may fail", "Selective RA or RV compression can produce low output without classic four-chamber pressure equalization."),
    K("fc2_s9p30000000000000000000008", "tamponade_treatment", "rescue", "Clot-mediated tamponade in a deteriorating post-sternotomy patient requires {{c1::surgical decompression}}.", "A needle cannot remove clot", "Pericardiocentesis is unreliable because the collection is commonly organized blood."),
    K("fc-d13-lcos-cannot-rule-it-out-1evw1t9", "echo_limit", "mechanism-decision", "In a deteriorating post-sternotomy patient, a negative echocardiogram {{c1::cannot exclude post-surgical tamponade}}.", "Loculated clot hides", "A convincing deteriorating physiology should prompt TEE or exploration despite a nondiagnostic surface study."),
    K("fc-d11-reexplore-5-10-minutes-1piuics", "resternotomy_time", "numeric-guideline", "With suspected tamponade and no ROSC, consider resternotomy by {{c1::5-10 minutes}}.", "Postoperative arrest window", "Opening the chest permits clot evacuation, source control, graft assessment, and internal massage.", N("between", [5, 10], "minutes", "Time without ROSC prompting resternotomy consideration in postoperative arrest with suspected tamponade", "institution-dependent")),
    K("fc2_s9p30000000000000000000009", "tube_stop", "mechanism-decision", "Suddenly quiet drains plus rising CVP and falling MAP mean {{c1::clotted-tube tamponade}}.", "Silence is not hemostasis", "Blood can continue accumulating behind an obstructed drain."),
    K("fc2_s9p30000000000000000000010", "no_stripping", "rescue", "For a suspected clotted chest tube, use gentle repositioning and avoid {{c1::vigorous stripping}}.", "Avoid extreme suction", "Aggressive stripping can generate dangerous negative intrathoracic pressure.")
  ]);

  /* ---------------- Day 12: Postoperative atrial fibrillation ---------------- */
  registerLesson("d12-af", "Postoperative AF & Arrhythmias", [
    C("peak", "post-operative-atrial-fibrillation-incidence-and-risk", "core", "number", "POAF peaks on postoperative days two to three as inflammation crests."),
    C("atrial_kick", "post-operative-atrial-fibrillation-incidence-and-risk", "core", "mechanism", "Loss of AV synchrony can destabilize a stiff, preload-dependent ventricle."),
    C("poaf_context", "post-operative-atrial-fibrillation-incidence-and-risk", "enrichment", "evidence", "Incidence by procedure, inflammatory biomarkers, risk factors, stroke association, and natural history contextualize POAF.", "supporting-context", "These estimates vary by cohort and support the decision cards without adding epidemiology burden."),

    C("unstable", "poaf-management-rate-rhythm-and-anticoagulation", "core", "rescue", "Hemodynamically unstable POAF requires immediate synchronized cardioversion.", "shared-card", "This management principle is shared with the Day 13 complication lesson.", [
      ["d12-af", "poaf-management-rate-rhythm-and-anticoagulation"],
      ["d13-complications", "post-operative-atrial-fibrillation"]
    ]),
    C("reversible", "poaf-management-rate-rhythm-and-anticoagulation", "core", "bounded-set", "Stable POAF management starts by correcting electrolytes, hypoxia, pain, fever, anemia, and volume problems.", "shared-card", "The trigger-correction objective is shared with the Day 13 complication lesson.", [
      ["d12-af", "poaf-management-rate-rhythm-and-anticoagulation"],
      ["d13-complications", "post-operative-atrial-fibrillation"]
    ]),
    C("rate_control", "poaf-management-rate-rhythm-and-anticoagulation", "core", "guideline", "IV beta-blockade is first-line rate control for stable POAF when tolerated."),
    C("anticoag_48", "poaf-management-rate-rhythm-and-anticoagulation", "applied-core", "guideline", "POAF persisting beyond 48 hours prompts anticoagulation assessment against surgical bleeding risk.", "shared-card", "The duration threshold is shared with the Day 13 complication lesson.", [
      ["d12-af", "poaf-management-rate-rhythm-and-anticoagulation"],
      ["d13-complications", "post-operative-atrial-fibrillation"]
    ]),
    C("management_context", "poaf-management-rate-rhythm-and-anticoagulation", "enrichment", "evidence", "Specific metoprolol, ibutilide, amiodarone, cardioversion, warfarin, and bridging regimens provide local-protocol context.", "supporting-context", "Detailed dosing and anticoagulant selection require current local and clinician review."),

    C("beta_prophylaxis", "poaf-prophylaxis-evidence-based-strategies", "core", "guideline", "Continuation or early restart of beta-blockers is the highest-evidence POAF prevention strategy.", "shared-card", "The guideline objective is shared with the Day 13 secondary-prevention chunk.", [
      ["d12-af", "poaf-prophylaxis-evidence-based-strategies"],
      ["d13-complications", "post-operative-atrial-fibrillation"],
      ["d13-complications", "postoperative-atrial-fibrillation-beta-blocker-and-amiodarone-prophylaxi"]
    ]),
    C("beta_contra", "poaf-prophylaxis-evidence-based-strategies", "applied-core", "bounded-set", "Active inotropic support, hemodynamic compromise, and significant AV block are contraindications to reflex beta-blockade."),
    C("electrolyte_targets", "poaf-prophylaxis-evidence-based-strategies", "applied-core", "number", "The lesson targets potassium above 4.0 and magnesium above 2.0 during POAF prevention."),
    C("prophylaxis_context", "poaf-prophylaxis-evidence-based-strategies", "enrichment", "evidence", "PAPABEAR, COPPS-2, atorvastatin, sotalol, and detailed prophylactic regimens provide evidence context.", "supporting-context", "Secondary trials and dosing regimens should not displace the beta-blocker priority card."),

    C("nsvt", "ventricular-arrhythmias-after-cardiac-surgery", "core", "mechanism", "Brief tolerated NSVT usually prompts correction of reversible causes rather than reflex antiarrhythmic therapy."),
    C("sustained_vt", "ventricular-arrhythmias-after-cardiac-surgery", "core", "rescue", "Sustained or unstable ventricular arrhythmia requires electrical treatment and urgent evaluation for ischemia."),
    C("vt_context", "ventricular-arrhythmias-after-cardiac-surgery", "enrichment", "evidence", "Air embolism, graft failure, QT prolongation, drug dosing, and reperfusion timing refine the ventricular-arrhythmia differential.", "supporting-context", "These etiologies and drug details support urgent evaluation but are not one atomic card.")
  ], [
    K("fc-d12-af-days-2-3-0vmr2xs", "peak", "numeric-guideline", "Postoperative atrial fibrillation most often peaks on days {{c1::2-3}}.", "Inflammation crest", "The timing matches the peak of postoperative inflammatory and adrenergic triggers.", N("between", [2, 3], "postoperative days", "Typical peak timing of POAF", "range")),
    K("fc2_t2q40000000000000000000001", "atrial_kick", "mechanism-decision", "AF can crash a stiff ventricle by removing {{c1::AV synchrony}}.", "Loss of atrial top-off", "Hypertrophied or noncompliant ventricles depend heavily on the timed atrial contribution to filling."),
    K("fc2_t2q40000000000000000000002", "unstable", "rescue", "Hemodynamically unstable POAF requires immediate {{c1::synchronized cardioversion}}.", "Shock first", "Do not delay electrical treatment for rate-control loading in an unstable patient."),
    K("fc2_t2q40000000000000000000003", "reversible", "mechanism-decision", "Before drugs for stable POAF, first correct {{c1::reversible precipitants}}.", "Electrolytes, oxygen, pain", "Potassium, magnesium, hypoxia, fever, pain, anemia, and volume status can sustain the arrhythmia."),
    K("fc2_t2q40000000000000000000004", "rate_control", "mechanism-decision", "First-line rate control for stable POAF is an IV {{c1::beta-blocker}} when tolerated.", "Adrenergic control", "Amiodarone or diltiazem may be alternatives when physiology or ventricular function limits beta-blockade.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "not-stated-in-lesson", "not-stated-in-lesson")),
    K("fc2_t2q40000000000000000000005", "anticoag_48", "numeric-guideline", "POAF persisting beyond {{c1::48 hours}} prompts anticoagulation assessment.", "Balance stroke and bleeding", "The surgeon must weigh thromboembolic risk against fresh postoperative bleeding risk.", Object.assign({}, N(">", 48, "hours", "Duration of POAF prompting anticoagulation assessment in the lesson", "exact"), G("poaf-anticoagulation-guidance", "ACC/AHA/HRS", 2023, "not-stated-in-lesson", "not-stated-in-lesson"), { reviewReason: "POAF anticoagulation duration and agent selection are evolving and require clinician review." })),
    K("fc2_t2q40000000000000000000006", "beta_prophylaxis", "mechanism-decision", "The highest-evidence POAF prevention strategy is early {{c1::beta-blocker continuation or restart}}.", "Avoid withdrawal", "Resume as soon as hemodynamics, inotrope requirements, and conduction permit.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "Class I", "B-R")),
    K("fc2_t2q40000000000000000000007", "beta_contra", "bounded-set", "Do not reflexively start POAF beta-blockade during active inotropy, instability, or {{c1::significant AV block}}.", "Check pressure and conduction", "These states can turn prophylaxis into bradycardia or hemodynamic collapse."),
    K("fc2_t2q40000000000000000000008", "electrolyte_targets", "numeric-guideline", "For POAF prevention, target K above 4.0 and Mg above {{c1::2.0 mg/dL}}.", "Reduce atrial irritability", "Electrolyte replacement is additive but does not replace hemodynamic and rhythm assessment.", N(">", 2.0, "mg/dL magnesium", "Magnesium target paired with potassium above 4.0 mEq/L for POAF prevention", "institution-dependent")),
    K("fc2_t2q40000000000000000000009", "nsvt", "mechanism-decision", "Brief tolerated postoperative NSVT is treated first by correcting {{c1::reversible triggers}}.", "K, Mg, oxygen, ischemia", "Minimize catecholamines and correct electrolytes, hypoxia, temperature, and ischemia before reflex antiarrhythmics."),
    K("fc2_t2q40000000000000000000010", "sustained_vt", "rescue", "Sustained unstable VT or VF requires immediate electricity and evaluation for {{c1::ongoing ischemia}}.", "Graft failure until checked", "Defibrillate VF or unstable VT, obtain urgent imaging, and investigate graft or coronary compromise.")
  ]);

  /* ---------------- Day 12: Temporary epicardial pacing ---------------- */
  registerLesson("d12-pacing", "Temporary Epicardial Pacing", [
    C("mode_order", "epicardial-pacing-wires-placement-and-rationale", "core", "sequence", "When conduction permits, atrial pacing is preferred to AV-sequential pacing, which is preferred to ventricular pacing."),
    C("wire_backup", "epicardial-pacing-wires-placement-and-rationale", "core", "rescue", "If epicardial wires fail in a dependent patient, escalate to transvenous or PA-catheter pacing, using pads only as a bridge."),
    C("wire_removal", "epicardial-pacing-wires-placement-and-rationale", "applied-core", "number", "Temporary wires are commonly removed on postoperative days three to five with anticoagulation and monitoring precautions."),
    C("wire_context", "epicardial-pacing-wires-placement-and-rationale", "enrichment", "model", "Wire placement sites, bradycardia-output coupling, and ventricular-pacing limitations contextualize mode choice.", "supporting-context", "Anatomic placement and background physiology support rather than duplicate mode cards."),

    C("nbg", "nbg-pacemaker-code-the-first-three-positions", "core", "sequence", "The first three NBG positions specify chamber paced, chamber sensed, and response to sensing."),
    C("vdd", "nbg-pacemaker-code-the-first-three-positions", "core", "definition", "VDD paces the ventricle while sensing both chambers."),
    C("dvi", "nbg-pacemaker-code-the-first-three-positions", "core", "definition", "DVI paces both chambers while sensing only the ventricle."),
    C("doo", "nbg-pacemaker-code-the-first-three-positions", "applied-core", "mechanism", "DOO is an asynchronous dual-chamber mode used when cautery interference must not inhibit pacing."),
    C("nbg_context", "nbg-pacemaker-code-the-first-three-positions", "enrichment", "definition", "AAI, VVI, DDD, rate response, and CRT nomenclature complete the NBG mode vocabulary.", "supporting-context", "The primary decoding rule and decision modes are carded; the full catalog remains reference context."),

    C("ddd_av", "ddd-vs-vvi-hemodynamic-consequences-of-mode-choice", "core", "mechanism", "DDD preserves AV synchrony in AV block with an intact sinus node."),
    C("vvi_syndrome", "ddd-vs-vvi-hemodynamic-consequences-of-mode-choice", "core", "mechanism", "VVI can cause pacemaker syndrome through lost AV synchrony and retrograde atrial contraction."),
    C("av_delay", "ddd-vs-vvi-hemodynamic-consequences-of-mode-choice", "applied-core", "number", "The lesson uses 150-200 ms as a starting AV delay for DDD pacing."),
    C("kick_context", "ddd-vs-vvi-hemodynamic-consequences-of-mode-choice", "enrichment", "number", "Atrial contribution and alternative ventricular pacing sites contextualize the hemodynamic cost of VVI.", "supporting-context", "Exact atrial-kick percentages vary with physiology and are not a universal target."),

    C("capture_output", "pacing-thresholds-troubleshooting-and-wire-removal", "core", "rescue", "Failure to capture is treated first by raising output above threshold and checking the circuit."),
    C("cathode", "pacing-thresholds-troubleshooting-and-wire-removal", "applied-core", "mechanism", "Capture threshold is lowest when the negative terminal or cathode connects to the heart."),
    C("undersensing", "pacing-thresholds-troubleshooting-and-wire-removal", "core", "rescue", "Undersensing is corrected by lowering the mV value to increase sensitivity."),
    C("oversensing", "pacing-thresholds-troubleshooting-and-wire-removal", "core", "rescue", "Oversensing is corrected by raising the mV value to decrease sensitivity."),
    C("ront", "pacing-thresholds-troubleshooting-and-wire-removal", "core", "rescue", "Undersensing can permit a pacing spike on the T wave and trigger R-on-T VF."),
    C("output_margin", "pacing-thresholds-troubleshooting-and-wire-removal", "applied-core", "number", "Temporary pacing output is set about two to three times measured capture threshold."),
    C("threshold_context", "pacing-thresholds-troubleshooting-and-wire-removal", "enrichment", "model", "Fibrosis, edema, electrolytes, drugs, battery, connections, and conductor integrity alter temporary-wire performance.", "supporting-context", "The troubleshooting causes support the directed dial changes without a long list card."),

    C("senior_capture", "senior-reasoning-program-the-box-to-the-problem-not-by-rote", "core", "mapping-set", "Pacing faults should be identified from the tracing and corrected at the matching dial."),
    C("block_window", "senior-reasoning-program-the-box-to-the-problem-not-by-rote", "applied-core", "number", "Edema-related postoperative block is observed for about five to seven days before permanent-device commitment.", "shared-card", "The observation-window objective is shared with the conduction-block lesson.", [
      ["d12-pacing", "senior-reasoning-program-the-box-to-the-problem-not-by-rote"],
      ["d12-block", "post-operative-complete-heart-block-recognition-and-management"],
      ["d13-complications", "heart-block-sternal-wound-infection-and-mediastinitis"]
    ])
  ], [
    K("fc2_u3r50000000000000000000001", ["mode_order", "senior_capture"], "ordered-sequence", "When feasible, prefer atrial, then AV-sequential, then {{c1::ventricular pacing}}.", "Preserve physiologic activation", "Each step down sacrifices more AV synchrony or ventricular activation quality."),
    K("fc-d12-pacing-if-the-wires-fail-17x6fi2", "wire_backup", "rescue", "If epicardial wires fail in a dependent patient, escalate to {{c1::transvenous pacing}}.", "Pads are only a bridge", "A pacing PA catheter is another internal option while definitive access is arranged."),
    K("fc2_u3r50000000000000000000002", "wire_removal", "numeric-guideline", "Temporary epicardial wires are commonly removed on postoperative days {{c1::3-5}}.", "After rhythm risk falls", "Hold anticoagulation per local protocol and monitor after removal for tamponade.", N("between", [3, 5], "postoperative days", "Typical temporary epicardial-wire removal timing", "institution-dependent")),
    K("fc-d12-pacing-pace-middot-sense-middot-response-1viocgj", "nbg", "ordered-sequence", "Read the first three NBG positions as Pace, Sense, and {{c1::Response}}.", "Third letter action", "The sequence states where the device paces, what it senses, and how it responds."),
    K("fc-d12-pacing-vdd-1x52aeu", "vdd", "atomic-concept", "The mode that paces the ventricle but senses both chambers is {{c1::VDD}}.", "Tracks intrinsic atrium", "VDD can synchronize ventricular pacing to a sensed atrial rhythm."),
    K("fc-d12-pacing-dvi-09g3hp3", "dvi", "atomic-concept", "The mode that paces both chambers but senses only the ventricle is {{c1::DVI}}.", "Dual pace, ventricular sense", "The first two positions encode paced and sensed chambers."),
    K("fc2_u3r50000000000000000000003", "doo", "mechanism-decision", "For a pacing-dependent patient during cautery, use asynchronous {{c1::DOO}} mode.", "Ignore electromagnetic noise", "Asynchronous pacing prevents electrocautery oversensing from inhibiting output.", { medicalReviewRequired: true, reviewBy: NUMERIC_REVIEW_BY, reviewReason: "Perioperative device programming requires anesthesia/electrophysiology and local-protocol confirmation." }),
    K("fc2_u3r50000000000000000000004", "ddd_av", "mechanism-decision", "For AV block with an intact sinus node, choose {{c1::DDD}} to preserve synchrony.", "Track P waves", "DDD senses atrial activity and delivers ventricular pacing after the programmed AV delay."),
    K("fc2_u3r50000000000000000000005", "vvi_syndrome", "mechanism-decision", "Pulsatile neck veins and hypotension during VVI pacing suggest {{c1::pacemaker syndrome}}.", "Atria contract against closed valves", "Loss of AV synchrony and retrograde VA conduction make VVI hemodynamically costly."),
    K("fc2_u3r50000000000000000000006", "av_delay", "numeric-guideline", "A reasonable starting AV delay for DDD pacing is {{c1::150-200 ms}}.", "Then optimize output", "Too short truncates atrial emptying; too long mistimes the atrial contribution.", N("between", [150, 200], "ms", "Starting AV delay in temporary DDD pacing", "institution-dependent")),
    K("fc2_u3r50000000000000000000007", "capture_output", "mechanism-decision", "A pacing spike without depolarization is failure to capture; first {{c1::raise output}}.", "Current below threshold", "Then check connections, polarity, displacement, battery, electrolytes, and drugs."),
    K("fc2_u3r50000000000000000000008", "cathode", "atomic-concept", "For the lowest capture threshold, connect the heart wire to the {{c1::negative terminal}}.", "Cathode to myocardium", "Reversed polarity raises the energy required for capture."),
    K("fc2_u3r50000000000000000000009", "undersensing", "mechanism-decision", "To correct undersensing, lower the mV number to {{c1::increase sensitivity}}.", "Lower number sees more", "The device must detect smaller intrinsic signals so it does not pace through native beats."),
    K("fc2_u3r50000000000000000000010", "oversensing", "mechanism-decision", "To correct oversensing, raise the mV number to {{c1::decrease sensitivity}}.", "Higher number sees less", "This prevents noise or myopotentials from inappropriately inhibiting pacing."),
    K("fc-d12-pacing-r-on-t-ventricular-fibrillation-1quwngd", "ront", "mechanism-decision", "The lethal rhythm risk of pacing during an unsensed T wave is {{c1::R-on-T ventricular fibrillation}}.", "Undersensing hazard", "Confirm sensing so pacing spikes do not land during vulnerable repolarization."),
    K("fc2_u3r50000000000000000000011", "output_margin", "numeric-guideline", "Set temporary pacing output about {{c1::2-3 times capture threshold}}.", "Allow threshold drift", "The safety margin protects capture as edema and fibrosis raise threshold over time.", N("between", [2, 3], "times measured threshold", "Temporary epicardial pacing output safety margin", "institution-dependent")),
    K("fc2_u3r50000000000000000000012", "block_window", "numeric-guideline", "Observe potentially edema-related postoperative heart block for about {{c1::5-7 days}}.", "Recovery window", "Persistent block without recovery or a reversible cause then favors permanent pacing.", Object.assign({}, N("between", [5, 7], "days", "Observation window for potentially transient postoperative AV block", "approximate"), G("acc-aha-hrs-bradycardia-2018", "ACC/AHA/HRS", 2018, "not-stated-in-lesson", "not-stated-in-lesson")))
  ]);

  /* ---------------- Day 12: Conduction block and permanent pacing ---------------- */
  registerLesson("d12-block", "Conduction Blocks & Permanent Pacing", [
    C("sa_location", "conduction-system-anatomy-surgical-vulnerability", "core", "definition", "The sinus node lies at the SVC-right atrial junction and is vulnerable to nearby cannulation or incision."),
    C("av_location", "conduction-system-anatomy-surgical-vulnerability", "core", "definition", "The AV node lies at the apex of Koch's triangle."),
    C("his_location", "conduction-system-anatomy-surgical-vulnerability", "core", "definition", "The His bundle crosses the membranous septum beneath the noncoronary-right coronary cusp commissure."),
    C("anatomy_context", "conduction-system-anatomy-surgical-vulnerability", "enrichment", "mechanism", "Transseptal mitral access, traction, ischemia, abscess, myocardial protection, and operation-specific anatomy modify conduction risk.", "supporting-context", "The principal surgical landmarks are carded; secondary mechanisms remain traceable context."),

    C("junctional_escape", "post-operative-complete-heart-block-recognition-and-management", "applied-core", "number", "A junctional escape in complete block typically runs at 40-60 bpm."),
    C("vent_escape", "post-operative-complete-heart-block-recognition-and-management", "applied-core", "number", "A ventricular escape in complete block typically runs at 20-40 bpm."),
    C("chb_manage", "post-operative-complete-heart-block-recognition-and-management", "core", "rescue", "Secure an adequate ventricular rate with temporary pacing and correct reversible causes."),
    C("permanent_window", "post-operative-complete-heart-block-recognition-and-management", "applied-core", "guideline", "Persistent complete heart block beyond the recovery window without a reversible cause supports permanent pacing."),
    C("block_context", "post-operative-complete-heart-block-recognition-and-management", "enrichment", "model", "AV-block grades, atropine responsiveness, edema, ischemia, electrolytes, and drug effects contextualize management.", "supporting-context", "The grade ladder and causal list support, but do not replace, the management targets."),

    C("tavi_device", "tavi-and-conduction-lbbb-and-complete-heart-block", "core", "mechanism", "Self-expanding TAVI frames exert more sustained septal radial force and carry more conduction risk than balloon-expandable frames."),
    C("tavi_rbbb", "tavi-and-conduction-lbbb-and-complete-heart-block", "core", "mechanism", "Pre-existing RBBB is the strongest lesson predictor of complete heart block after TAVI."),
    C("tavi_monitor", "tavi-and-conduction-lbbb-and-complete-heart-block", "applied-core", "guideline", "New LBBB after TAVI requires at least 24-48 hours of continuous rhythm monitoring."),
    C("hv", "tavi-and-conduction-lbbb-and-complete-heart-block", "applied-core", "guideline", "An HV interval above 70 ms indicates marked infra-Hisian delay and high complete-block risk."),
    C("tavi_context", "tavi-and-conduction-lbbb-and-complete-heart-block", "enrichment", "evidence", "CHOICE and PARTNER pacemaker rates, LBBB incidence, and implantation depth contextualize device-specific risk.", "supporting-context", "Trial-specific percentages should remain evidence context rather than treatment thresholds."),

    C("mechanical_tv", "permanent-pacemaker-indications-and-lead-approach", "applied-core", "mechanism", "A mechanical tricuspid prosthesis prevents a transvenous RV lead and forces an epicardial approach."),
    C("ddd_mode", "permanent-pacemaker-indications-and-lead-approach", "core", "mapping-set", "DDD or DDDR is preferred for AV block with intact sinus-node function."),
    C("vvi_mode", "permanent-pacemaker-indications-and-lead-approach", "core", "mapping-set", "VVI or VVIR is appropriate for bradycardia with chronic AF and no organized atrium to track."),
    C("ppm_context", "permanent-pacemaker-indications-and-lead-approach", "enrichment", "guideline", "Class I indications, lead routes, infection timing, and AV nodal artery ischemia provide permanent-device context.", "supporting-context", "Device implantation requires EP assessment and current guideline confirmation."),

    C("vvi_to_ddd", "pgy-5-mastery-av-synchrony-in-the-stiff-ventricle-and-when-block-will-no", "core", "rescue", "A paced-but-hypotensive stiff post-AVR ventricle may improve by switching VVI to DDD."),
    C("nonrecovery", "pgy-5-mastery-av-synchrony-in-the-stiff-ventricle-and-when-block-will-no", "applied-core", "bounded-set", "Persistent complete block, prolonged-HV LBBB, and alternating bundle block predict non-recovery."),
    C("torsades", "pgy-5-mastery-av-synchrony-in-the-stiff-ventricle-and-when-block-will-no", "applied-core", "rescue", "Pause-dependent torsades is treated with magnesium, electrolyte correction, removal of QT drugs, and overdrive pacing."),
    C("mastery_context", "pgy-5-mastery-av-synchrony-in-the-stiff-ventricle-and-when-block-will-no", "enrichment", "model", "AV synchrony, heavy annular calcium, device-dependent TAVI risk, and unstable-rhythm algorithms integrate the pacing decision.", "supporting-context", "The scenario synthesis is preserved without duplicating its atomic cards.")
  ], [
    K("fc2_v4s60000000000000000000001", "sa_location", "atomic-concept", "The conduction structure at the SVC-right atrial junction is the {{c1::sinus node}}.", "Cannulation danger", "Bicaval cannulation, right atrial incisions, and SVC surgery can injure this structure."),
    K("fc-d12-block-av-node-1w9pwki", "av_location", "atomic-concept", "The conduction structure at the apex of Koch's triangle is the {{c1::AV node}}.", "Triangle landmark", "The tricuspid annulus, tendon of Todaro, and coronary sinus ostium bound the triangle."),
    K("fc-d12-block-bundle-of-his-187q86e", "his_location", "atomic-concept", "The conduction structure traversing the membranous septum is the {{c1::bundle of His}}.", "Below the aortic annulus", "This location explains injury during AVR, septal work, and TAVI."),
    K("fc2_v4s60000000000000000000002", "junctional_escape", "numeric-guideline", "A junctional escape in complete block usually runs at {{c1::40-60 bpm}}.", "Higher escape focus", "A junctional focus is faster and more reliable than a ventricular escape.", N("between", [40, 60], "bpm", "Typical junctional escape rate in complete AV block", "range")),
    K("fc2_v4s60000000000000000000003", "vent_escape", "numeric-guideline", "A ventricular escape in complete block usually runs at {{c1::20-40 bpm}}.", "Lower escape focus", "This slow escape may be inadequate for organ perfusion and demands reliable pacing.", N("between", [20, 40], "bpm", "Typical ventricular escape rate in complete AV block", "range")),
    K("fc2_v4s60000000000000000000004", "chb_manage", "ordered-sequence", "For postoperative complete block, first secure rate with {{c1::temporary pacing}}.", "Then seek reversibility", "Check electrolytes, ischemia, and rate-slowing drugs while maintaining perfusion."),
    K("fc2_v4s60000000000000000000005", "permanent_window", "numeric-guideline", "Postoperative complete heart block beyond {{c1::5-7 days}} favors permanent pacing.", "No recovery or reversible cause", "Prolonged temporary-wire dependence adds infection and lead-complication risk.", Object.assign({}, N(">", [5, 7], "days", "Persistent postoperative complete heart block without recovery", "approximate"), G("acc-aha-hrs-bradycardia-2018", "ACC/AHA/HRS", 2018, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_v4s60000000000000000000006", "tavi_device", "contrast", "The TAVI frame with greater sustained conduction pressure is {{c1::self-expanding}}.", "Tall nitinol frame", "Its radial force and implant depth increase septal compression compared with balloon-expandable valves."),
    K("fc2_v4s60000000000000000000007", "tavi_rbbb", "mechanism-decision", "The strongest pre-TAVI predictor of complete block is {{c1::pre-existing RBBB}}.", "New left injury completes block", "A new left-sided conduction injury then removes the remaining bundle pathway."),
    K("fc2_v4s60000000000000000000008", "tavi_monitor", "numeric-guideline", "New LBBB after TAVI requires at least {{c1::24-48 hours of ECG monitoring}}.", "Delayed block risk", "Even an asymptomatic patient may progress to complete heart block after the procedure.", Object.assign({}, N("between", [24, 48], "hours", "Continuous ECG monitoring after new LBBB following TAVI", "range"), G("acc-tavr-conduction-2020", "American College of Cardiology", 2020, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_v4s60000000000000000000009", "hv", "numeric-guideline", "After TAVI, HV interval above {{c1::70 ms}} signals high infra-Hisian block risk.", "EP risk marker", "The lesson notes this may support prophylactic permanent pacing even without symptoms.", Object.assign({}, N(">", 70, "ms", "HV interval indicating marked infra-Hisian delay after TAVI", "exact"), G("acc-tavr-conduction-2020", "American College of Cardiology", 2020, "not-stated-in-lesson", "not-stated-in-lesson"))),
    K("fc2_v4s60000000000000000000010", "mechanical_tv", "mechanism-decision", "A mechanical tricuspid prosthesis requires an {{c1::epicardial pacing lead}}.", "Do not cross the valve", "A transvenous RV lead cannot safely traverse the mechanical prosthesis."),
    K("fc2_v4s60000000000000000000011", "ddd_mode", "mapping-set", "For AV block with intact sinus-node function, select {{c1::DDD or DDDR}}.", "Track the organized atrium", "Dual-chamber pacing preserves AV synchrony and rate response when appropriate."),
    K("fc2_v4s60000000000000000000012", "vvi_mode", "mapping-set", "For bradycardia with chronic AF, select {{c1::VVI or VVIR}}.", "No atrium to track", "Ventricular demand pacing fits a rhythm without organized atrial activity."),
    K("fc-d12-block-ddd-1ou7anr", "vvi_to_ddd", "mechanism-decision", "A hypotensive stiff post-AVR ventricle paced VVI may improve after switching to {{c1::DDD}}.", "Restore atrial kick", "The problem can be lost AV synchrony rather than new pump failure."),
    K("fc2_v4s60000000000000000000013", "nonrecovery", "bounded-set", "Alternating bundle block after valve work predicts {{c1::conduction non-recovery}}.", "Alongside persistent CHB", "Persistent complete block and prolonged-HV LBBB are other warning features."),
    K("fc2_v4s60000000000000000000014", "torsades", "rescue", "Pause-dependent torsades is suppressed with magnesium and {{c1::overdrive pacing}}.", "Prevent the next pause", "Correct potassium and magnesium and stop QT-prolonging drugs while raising the pacing rate.")
  ]);

  /* ---------------- Day 13: Hemodynamics and low-output syndrome ---------------- */
  registerLesson("d13-lcos", "Cardiac ICU: Hemodynamics & Low-Output Syndrome", [
    C("handoff", "the-first-hour-in-the-icu", "core", "bounded-set", "The initial ICU handoff uses SBAR and explicitly transfers operative, hemodynamic, device, laboratory, and anticipated-needs information."),
    C("arrival_targets", "the-first-hour-in-the-icu", "applied-core", "number", "Typical initial perfusion goals are MVO2 near 60%, MAP above 65 mmHg, and cardiac index above 2 L/min/m2, individualized to the patient."),
    C("hypothermia", "the-first-hour-in-the-icu", "applied-core", "number", "An arriving temperature at or below 35 degrees Celsius warrants active rewarming because hypothermia increases oxygen demand, SVR, arrhythmias, and coagulopathy."),
    C("arrival_context", "the-first-hour-in-the-icu", "enrichment", "model", "Line, drain, pacing-wire, ventilator, infusion, and laboratory verification accompanies the first-hour physiologic targets.", "supporting-context", "The safety sweep is preserved as handoff context rather than split into many low-information cards."),

    C("lcos_definition", "defining-lcos-and-the-determinants-of-output-framework", "core", "number", "LCOS requires cardiac index below about 2.0-2.2 L/min/m2 plus clinical end-organ hypoperfusion."),
    C("co_framework", "defining-lcos-and-the-determinants-of-output-framework", "core", "formula", "Cardiac output equals heart rate times stroke volume, and stroke volume depends on preload, afterload, and contractility."),
    C("cvp_limit", "defining-lcos-and-the-determinants-of-output-framework", "core", "mechanism", "Except when very low, CVP alone is an unreliable surrogate for LV end-diastolic volume."),
    C("wedge_target", "defining-lcos-and-the-determinants-of-output-framework", "applied-core", "number", "A PCWP near 15 mmHg is often an adequate left-sided filling estimate when mitral stenosis is absent, though the target is individualized."),
    C("third_space", "defining-lcos-and-the-determinants-of-output-framework", "applied-core", "mechanism", "A patient may be intravascularly underfilled despite a positive operative fluid balance because much of the gain is extravascular."),
    C("lcos_context", "defining-lcos-and-the-determinants-of-output-framework", "enrichment", "evidence", "Historical incidence estimates and the broader oxygen-carrying-capacity framework contextualize LCOS.", "supporting-context", "Incidence estimates do not independently change the bedside differential and need contemporary review."),

    C("hypovolemia_profile", "preload-problems-hypovolemia-tamponade-and-pneumothorax", "core", "comparison", "Hypovolemia produces low CVP, low PCWP, low output, and compensatory high SVR."),
    C("volume_challenge", "preload-problems-hypovolemia-tamponade-and-pneumothorax", "applied-core", "number", "Suspected early postoperative underfilling is tested with a cautious roughly 250 mL volume challenge followed by reassessment."),
    C("tension_pneumo", "preload-problems-hypovolemia-tamponade-and-pneumothorax", "core", "rescue", "Hemodynamic collapse with rising airway pressure and unilateral absent breath sounds requires immediate tension-pneumothorax decompression without waiting for imaging."),
    C("preload_context", "preload-problems-hypovolemia-tamponade-and-pneumothorax", "enrichment", "mechanism", "Rewarming vasodilation, chest-tube loss, brisk diuresis, and RV fluid intolerance make serial reassessment essential.", "supporting-context", "These modifiers explain why the carded small-challenge strategy is safer than a fixed-volume prescription."),

    C("localized_tamponade", "the-atypical-post-surgical-tamponade", "core", "mechanism", "Loculated postoperative clot may compress one chamber without Beck's triad, pulsus paradoxus, or four-chamber pressure equalization."),
    C("tamponade_equal", "the-atypical-post-surgical-tamponade", "applied-core", "number", "CVP and PCWP converging within about 5 mmHg supports postoperative tamponade when the clinical trajectory fits."),
    C("tube_stop", "the-atypical-post-surgical-tamponade", "core", "rescue", "Abrupt cessation of previously active chest-tube drainage with rising filling pressures and falling output suggests a clotted tube with tamponade."),
    C("inotrope_creep", "the-atypical-post-surgical-tamponade", "applied-core", "mechanism", "A steadily rising inotrope requirement to maintain the same pressure is an early warning of postoperative tamponade."),
    C("tamponade_imaging", "the-atypical-post-surgical-tamponade", "enrichment", "rescue", "Repeat chest radiography after initially high drainage subsides can reveal retained blood, widening mediastinum, or hemothorax.", "supporting-context", "The imaging caveat supplements the shared negative-echo and surgical-exploration cards authored in Day 11."),

    C("vasoplegia_profile", "afterload-problems-vasoplegia", "core", "number", "Post-CPB vasoplegia is low MAP around 60-65 mmHg and SVR below about 800 dyn-s/cm5 despite normal or high output and adequate filling.", "shared-card", "The hemodynamic discriminator is reused in the vasoactive-drug algorithm.", [
      ["d13-lcos", "afterload-problems-vasoplegia"],
      ["d13-vaso", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b"]
    ]),
    C("vasoplegia_mechanism", "afterload-problems-vasoplegia", "core", "mechanism", "CPB inflammation and inducible nitric oxide cause catecholamine-resistant vascular smooth-muscle relaxation."),
    C("pressor_prereq", "afterload-problems-vasoplegia", "applied-core", "sequence", "Use vasopressors for vasoplegia after confirming adequate volume and preserved pump function."),
    C("alpha_harm", "afterload-problems-vasoplegia", "applied-core", "mechanism", "Escalating alpha agonists can provoke coronary-graft spasm and peripheral ischemia."),
    C("vasoplegia_context", "afterload-problems-vasoplegia", "enrichment", "model", "Long CPB, ACE inhibitors, ARBs, amiodarone, advanced heart failure, calcium-channel blockers, and sedatives increase vasoplegia risk.", "supporting-context", "The risk-factor list changes suspicion but not the defining hemodynamic profile."),

    C("rv_profile", "rv-failure-vs-lv-failure-reading-the-numbers", "core", "comparison", "Isolated RV failure produces high CVP with normal or low PCWP and low output."),
    C("lv_profile", "rv-failure-vs-lv-failure-reading-the-numbers", "core", "comparison", "LV or biventricular failure raises both CVP and PCWP, usually with PCWP rising more, while output falls and SVR rises."),
    C("svr_formula", "rv-failure-vs-lv-failure-reading-the-numbers", "core", "formula", "SVR equals (MAP minus CVP) divided by cardiac output, multiplied by 80."),
    C("padp_limit", "rv-failure-vs-lv-failure-reading-the-numbers", "applied-core", "mechanism", "PA diastolic pressure can approximate PCWP only when pulmonary vascular resistance is normal."),
    C("profiles_context", "rv-failure-vs-lv-failure-reading-the-numbers", "enrichment", "model", "Filling pressures, flow, and calculated resistance must be interpreted as a pattern rather than as isolated values.", "supporting-context", "The individual profile cards instantiate this general interpretive rule."),

    C("rv_cycle", "rv-failure-mechanism-and-the-vicious-cycle", "core", "sequence", "RV afterload causes dilation, leftward septal shift, reduced LV filling and systemic pressure, and then impaired RV coronary perfusion."),
    C("d_shaped", "rv-failure-mechanism-and-the-vicious-cycle", "core", "mechanism", "A D-shaped LV with high CVP and low-normal PCWP supports RV pressure overload and failure."),
    C("pvr_triggers", "rv-failure-mechanism-and-the-vicious-cycle", "applied-core", "bounded-set", "Hypoxia, hypercarbia, acidosis, hypothermia, excessive PEEP, and alpha-mediated vasoconstriction increase PVR."),
    C("rv_context", "rv-failure-mechanism-and-the-vicious-cycle", "enrichment", "mechanism", "RV geometry and ventricular interdependence explain why excessive volume or pulmonary afterload can worsen both ventricles.", "supporting-context", "The mechanism is represented by the causal-cycle and profile cards."),

    C("rv_reduce_afterload", "managing-acute-rv-failure", "core", "rescue", "Acute RV failure management first reduces PVR with inhaled pulmonary vasodilators and, when pressure permits, milrinone."),
    C("rv_perfusion", "managing-acute-rv-failure", "core", "rescue", "Maintain systemic diastolic pressure, often with norepinephrine, to preserve RV coronary perfusion."),
    C("rv_preload", "managing-acute-rv-failure", "core", "rescue", "Optimize RV preload cautiously because both underfilling and overdistension reduce forward flow."),
    C("rv_escalate", "managing-acute-rv-failure", "applied-core", "rescue", "Refractory RV failure despite afterload, pressure, preload, and rhythm optimization warrants mechanical support."),
    C("rv_management_context", "managing-acute-rv-failure", "enrichment", "model", "AV synchrony, ventilation, acid-base status, oxygenation, and temperature are parallel RV-support levers.", "supporting-context", "These levers are retained as context to the three management objectives."),

    C("perfusion_close", "putting-the-profile-together", "core", "number", "Urine output above 0.5 mL/kg/hr with falling lactate supports improving organ perfusion."),
    C("mvo2_target", "putting-the-profile-together", "applied-core", "number", "An MVO2 around 60% is a practical postoperative oxygen-delivery target, with vasoplegia as a high or normal MVO2 exception."),
    C("profile_synthesis", "putting-the-profile-together", "enrichment", "model", "Serial CVP, PCWP, output, SVR, MVO2, urine, and lactate trends close the loop between monitor correction and tissue perfusion.", "supporting-context", "The synthesis is deliberately traceable without another long multi-variable card."),

    C("mixed_shock", "pgy-5-mastery-reading-mixed-post-op-shock-and-the-bedside-reopening-deci", "core", "model", "Fresh postoperative shock may combine vasoplegia, pump failure, tamponade, and ongoing bleeding, so the leading diagnosis is treated while alternatives remain covered."),
    C("reopen_before_arrest", "pgy-5-mastery-reading-mixed-post-op-shock-and-the-bedside-reopening-deci", "applied-core", "rescue", "Convincing refractory tamponade or arrest-imminent postoperative instability warrants bedside reopening before arrest rather than after."),
    C("pump_mcs", "pgy-5-mastery-reading-mixed-post-op-shock-and-the-bedside-reopening-deci", "applied-core", "rescue", "When intrinsic pump failure rather than compression is dominant, escalate to mechanism-matched mechanical circulatory support."),
    C("mixed_context", "pgy-5-mastery-reading-mixed-post-op-shock-and-the-bedside-reopening-deci", "enrichment", "evidence", "TEE or direct exploration remains appropriate when a convincing localized-tamponade picture persists despite nondiagnostic TTE.", "supporting-context", "The negative-echo target is already shared from the Day 11 surgical-bleeding pack."),

    C("trends", "the-pre-rounding-daily-checklist-walking-into-rounds-with-a-mental-model", "core", "model", "Pre-rounding prioritizes trajectory over isolated snapshots and ends by naming the day's single most important action."),
    C("preround_domains", "the-pre-rounding-daily-checklist-walking-into-rounds-with-a-mental-model", "enrichment", "bounded-set", "The daily sweep covers overnight events, vital and hemodynamic trends, respiratory support, drains and lines, labs, medications, wounds, and perfusion.", "supporting-context", "The domain list is preserved without forcing a long cloze that tests enumeration instead of reasoning."),
    C("potassium_context", "the-pre-rounding-daily-checklist-walking-into-rounds-with-a-mental-model", "enrichment", "number", "The lesson suggests a cardiac-patient potassium target of 4.0-4.5 mmol/L.", "supporting-context", "This local-practice electrolyte target requires clinician review before promotion to a card.")
  ], [
    K("fc2_w5t70000000000000000000001", "handoff", "bounded-set", "The structured transition from OR to cardiac ICU uses {{c1::SBAR}}.", "Prevent information loss", "Situation, Background, Assessment, and Recommendations transfer the operation, present physiology, and anticipated needs."),
    K("fc2_w5t70000000000000000000002", "arrival_targets", "numeric-guideline", "A typical initial cardiac-ICU cardiac-index goal is above {{c1::2 L/min/m2}}.", "Individualize the minimum", "Pair flow with MAP, venous saturation, lactate, urine output, and the patient's pressure requirements.", N(">", 2, "L/min/m2", "Typical initial postoperative cardiac-index target", "approximate")),
    K("fc2_w5t70000000000000000000003", "hypothermia", "numeric-guideline", "Active rewarming is indicated when arrival temperature is at or below {{c1::35 C}}.", "Cold raises demand and resistance", "Hypothermia worsens shivering, arrhythmias, vascular resistance, coagulopathy, and extubation delay.", N("<=", 35, "degrees Celsius", "Postoperative arrival hypothermia requiring active rewarming", "approximate")),
    K("fc-d13-lcos-2-0-2-2-l-min-02is03j", "lcos_definition", "numeric-guideline", "With clinical hypoperfusion, LCOS requires CI below about {{c1::2.0-2.2 L/min/m2}}.", "Number plus organs", "Oliguria, rising lactate, altered mentation, or cool extremities distinguish a syndrome from an isolated low reading.", N("<", [2.0, 2.2], "L/min/m2", "Cardiac index with end-organ hypoperfusion defining LCOS", "approximate")),
    K("fc2_w5t70000000000000000000004", "co_framework", "formula", "At the bedside, cardiac output uses CO = {{c1::HR x SV}}.", "Then dissect stroke volume", "Preload, afterload, and contractility determine stroke volume and organize the LCOS differential.", { formula: { expression: "CO = HR x SV", variables: { CO: "cardiac output", HR: "heart rate", SV: "stroke volume" } } }),
    K("fc2_w5t70000000000000000000005", "cvp_limit", "mechanism-decision", "Except when very low, CVP alone is {{c1::an unreliable LV preload estimate}}.", "Many causes raise CVP", "RV failure, valve regurgitation, pulmonary hypertension, obstruction, and ventilation can all elevate CVP."),
    K("fc-d13-lcos-15-mmhg-0mg7btc", "wedge_target", "numeric-guideline", "Without significant mitral stenosis, PCWP near {{c1::15 mmHg}} is often adequate.", "Individualize filling", "Many postoperative patients need a different pressure, so test the flow and perfusion response rather than chase a fixed wedge.", N("~", 15, "mmHg", "Often-adequate left-sided filling estimate without significant mitral stenosis", "approximate")),
    K("fc2_w5t70000000000000000000006", "third_space", "mechanism-decision", "A positive operative fluid balance can coexist with {{c1::intravascular underfilling}}.", "Much gain is third-spaced", "Extravascular edema does not guarantee adequate circulating volume during rewarming and ongoing losses."),
    K("fc2_w5t70000000000000000000007", "hypovolemia_profile", "mapping-set", "Low CVP, low PCWP, low output, and high SVR indicate {{c1::hypovolemia}}.", "Empty, clamped circulation", "Compensatory vasoconstriction raises resistance while both filling pressures and flow remain low."),
    K("fc2_w5t70000000000000000000008", "volume_challenge", "numeric-guideline", "Test suspected early underfilling with about {{c1::250 mL, then reassess}}.", "Small reversible step", "Large empiric boluses can dilate a stressed RV and worsen LV filling through septal shift.", N("~", 250, "mL", "Cautious postoperative volume challenge followed by reassessment", "approximate")),
    K("fc2_w5t70000000000000000000009", "tension_pneumo", "mechanism-decision", "Collapse with high airway pressure and unilateral absent sounds requires {{c1::immediate chest decompression}}.", "Do not await imaging", "Tension physiology mechanically obstructs venous return and can progress rapidly to arrest."),
    K("fc2_w5t70000000000000000000010", "localized_tamponade", "contrast", "Post-surgical tamponade may be caused by {{c1::loculated clot}} without classic pressure equalization.", "One chamber may be compressed", "Beck's triad and pulsus paradoxus can be absent when clot selectively compresses the right or left heart."),
    K("fc-d13-lcos-5-mmhg-11ygenb", "tamponade_equal", "numeric-guideline", "CVP and PCWP converging within about {{c1::5 mmHg}} supports tamponade.", "Use the whole trajectory", "This is suggestive only when paired with low output, rising pressures, or suddenly quiet drainage.", N("<=", 5, "mmHg difference", "Near-equalization of CVP and PCWP in suspected postoperative tamponade", "approximate")),
    K("fc2_w5t70000000000000000000011", "tube_stop", "mechanism-decision", "Suddenly quiet drains plus rising CVP and falling output suggest {{c1::clotted-tube tamponade}}.", "Silence may mean obstruction", "A drainage stop is not reassuring when blood may instead be accumulating in the chest."),
    K("fc2_w5t70000000000000000000012", "inotrope_creep", "mechanism-decision", "Needing more inotrope to hold the same pressure can herald {{c1::postoperative tamponade}}.", "Rising pharmacologic price", "Compression may quietly impair filling before frank collapse or classic signs appear."),
    K("fc-d13-lcos-60-65-mmhg-1httm3v", "vasoplegia_profile", "numeric-guideline", "With preserved output and SVR below 800, vasoplegic MAP is below about {{c1::60-65 mmHg}}.", "Warm low-resistance shock", "Pump failure instead has low output; adding inotropy does not correct lost vascular tone.", N("<", [60, 65], "mmHg MAP", "Vasoplegic hypotension with SVR below about 800 dyn-s/cm5 and preserved output", "approximate")),
    K("fc2_w5t70000000000000000000013", "vasoplegia_mechanism", "mechanism-decision", "Post-CPB vasoplegia is driven partly by excess {{c1::nitric oxide}}.", "Inflammatory vasodilation", "Inducible nitric oxide signaling relaxes vascular smooth muscle and blunts catecholamine responsiveness."),
    K("fc2_w5t70000000000000000000014", "pressor_prereq", "ordered-sequence", "Before treating vasoplegia with pressors, confirm adequate volume and {{c1::preserved pump function}}.", "Pipes, not pump", "Stacking vasoconstrictors on low-output pump failure raises afterload and can worsen flow."),
    K("fc2_w5t70000000000000000000015", "alpha_harm", "mechanism-decision", "Escalating alpha agonists can cause graft spasm and {{c1::peripheral ischemia}}.", "Inspect ECG and extremities", "A higher MAP can conceal coronary, graft, digit, or limb vasoconstriction."),
    K("fc2_w5t70000000000000000000016", "rv_profile", "mapping-set", "High CVP with normal-low PCWP and low output indicates {{c1::isolated RV failure}}.", "Right-left pressure dissociation", "The RV cannot deliver enough blood forward to raise left-sided filling pressure."),
    K("fc2_w5t70000000000000000000017", "lv_profile", "contrast", "Low output with both CVP and PCWP elevated indicates {{c1::LV or biventricular failure}}.", "Wedge usually rises more", "Left-sided congestion raises wedge pressure while compensatory vasoconstriction increases SVR."),
    K("fc2_w5t70000000000000000000018", "svr_formula", "formula", "For hemodynamic profiling, calculate SVR = {{c1::(MAP - CVP) / CO x 80}}.", "Pressure gradient over flow", "A faulty cardiac-output measurement will therefore produce a misleading calculated resistance.", { formula: { expression: "SVR = (MAP - CVP) / CO x 80", variables: { SVR: "systemic vascular resistance", MAP: "mean arterial pressure", CVP: "central venous pressure", CO: "cardiac output" } } }),
    K("fc2_w5t70000000000000000000019", "padp_limit", "mechanism-decision", "PA diastolic pressure substitutes for PCWP only when {{c1::PVR is normal}}.", "Pulmonary hypertension breaks shortcut", "Elevated pulmonary resistance separates PA diastolic and wedge pressures."),
    K("fc2_w5t70000000000000000000020", "rv_cycle", "ordered-sequence", "RV dilation shifts the septum left, reducing LV filling and then {{c1::RV coronary perfusion}}.", "Systemic pressure falls", "This feedback loop makes an afterload-stressed RV deteriorate rapidly."),
    K("fc-d13-lcos-cvp-0p8p1x6", "d_shaped", "mechanism-decision", "A D-shaped LV with high CVP and low-normal PCWP suggests {{c1::RV failure}}.", "Septal pressure overload", "The overloaded RV pushes the septum leftward and impairs LV filling."),
    K("fc-d13-lcos-pvr-090gbg8", "pvr_triggers", "bounded-set", "Hypoxia, hypercarbia, and acidosis all {{c1::raise PVR}}.", "Also cold and excess PEEP", "Correct reversible pulmonary vasoconstrictors before escalating RV support."),
    K("fc2_w5t70000000000000000000021", ["rv_reduce_afterload", "rv_perfusion", "rv_preload"], "ordered-sequence", "Acute RV failure: lower PVR, preserve systemic pressure, then {{c1::optimize preload cautiously}}.", "Three linked objectives", "Inhaled pulmonary vasodilators reduce afterload, norepinephrine may protect RV coronary pressure, and excess volume worsens septal shift."),
    K("fc2_w5t70000000000000000000022", "rv_escalate", "mechanism-decision", "Refractory RV failure after physiologic optimization warrants {{c1::mechanical support}}.", "Do not endlessly add drugs", "Choose support according to whether isolated RV, biventricular, or cardiorespiratory failure dominates."),
    K("fc-d13-lcos-0-5-ml-0osckhe", "perfusion_close", "numeric-guideline", "Improving perfusion includes urine output above {{c1::0.5 mL/kg/hr}} and falling lactate.", "Organs close the loop", "Monitor correction is not success unless tissue-delivery markers improve.", N(">", 0.5, "mL/kg/hr", "Bedside urine-output marker of adequate postoperative kidney perfusion", "approximate")),
    K("fc2_w5t70000000000000000000023", "mvo2_target", "numeric-guideline", "A practical postoperative MVO2 target is around {{c1::60%}}.", "Vasoplegia may be high", "Interpret the value with output, lactate, hemoglobin, temperature, and oxygen demand.", N("~", 60, "%", "Practical postoperative mixed venous oxygen saturation target", "approximate")),
    K("fc2_w5t70000000000000000000024", "mixed_shock", "mechanism-decision", "In mixed postoperative shock, treat the leading mechanism while {{c1::hedging the others}}.", "Several processes can coexist", "Correcting coagulopathy, preparing imaging or exploration, and supporting pump and tone may proceed in parallel."),
    K("fc2_w5t70000000000000000000025", "reopen_before_arrest", "mechanism-decision", "Convincing refractory tamponade physiology warrants bedside reopening {{c1::before arrest}}.", "Timing determines rescue", "Prepare the sternotomy tray while confirming rapidly; do not let nondiagnostic TTE delay decompression."),
    K("fc-d13-lcos-the-pump-itself-is-the-problem-0m06wrd", "pump_mcs", "mechanism-decision", "If intrinsic pump failure dominates, rescue with {{c1::mechanical circulatory support}} rather than reopening.", "Choose the right road", "IABP, Impella, or ECMO is selected to match LV, biventricular, or cardiorespiratory failure."),
    K("fc-d13-lcos-trends-not-snapshots-17ox5tn", "trends", "contrast", "During cardiac-surgery pre-rounding, interpret hemodynamics as {{c1::trends, not snapshots}}.", "Trajectory changes meaning", "A target MAP is concerning when it is falling despite an escalating pressor; end with today's single priority.")
  ]);

  /* ---------------- Day 13: Inotropes, pressors, and weaning ---------------- */
  registerLesson("d13-vaso", "Inotropes, Vasopressors & Weaning", [
    C("drug_axes", "a-framework-for-drug-selection", "core", "model", "Vasoactive selection starts by naming whether the problem is pump contractility, systemic vascular tone, or pulmonary vascular resistance."),
    C("fix_levers_first", "a-framework-for-drug-selection", "core", "sequence", "Optimize preload, afterload, and rate or rhythm before adding an inotrope for residual contractile failure."),
    C("minimize_drugs", "a-framework-for-drug-selection", "applied-core", "rescue", "Use the lowest effective vasoactive exposure and plan to wean because inotropes increase myocardial demand and arrhythmia risk."),
    C("framework_context", "a-framework-for-drug-selection", "enrichment", "comparison", "No vasoactive drug is intrinsically best; its systemic, cardiac, pulmonary, and clearance effects must match the measured profile.", "supporting-context", "The agent-specific cards instantiate this selection framework."),

    C("dobutamine_mech", "dobutamine-the-default-lv-inotrope", "core", "mechanism", "Dobutamine stimulates beta-1 and beta-2 receptors, increasing contractility while lowering systemic and pulmonary resistance."),
    C("dobutamine_use", "dobutamine-the-default-lv-inotrope", "core", "comparison", "Dobutamine fits low-output LV failure with high SVR when arterial pressure can tolerate vasodilation."),
    C("dobutamine_pressure", "dobutamine-the-default-lv-inotrope", "applied-core", "rescue", "If dobutamine improves flow but worsens hypotension, pair it with a vasopressor rather than ignoring the pressure cost."),
    C("dobutamine_blunting", "dobutamine-the-default-lv-inotrope", "applied-core", "mechanism", "Beta blockade or receptor downregulation can blunt dobutamine response."),
    C("dobutamine_context", "dobutamine-the-default-lv-inotrope", "enrichment", "evidence", "Its short half-life makes dobutamine readily titratable, while tachyarrhythmia and oxygen-demand penalties limit exposure.", "supporting-context", "These pharmacokinetic and adverse-effect details support the selection cards."),

    C("milrinone_mech", "milrinone-the-preferred-rv-inotrope", "core", "mechanism", "Milrinone inhibits PDE3 and raises cAMP without relying on beta receptors, producing inotropy plus systemic and pulmonary vasodilation."),
    C("milrinone_use", "milrinone-the-preferred-rv-inotrope", "core", "comparison", "Milrinone is especially useful for RV failure or pulmonary hypertension when systemic pressure can tolerate an inodilator."),
    C("milrinone_half", "milrinone-the-preferred-rv-inotrope", "applied-core", "number", "Milrinone has a roughly 2.5-hour half-life that is prolonged by renal dysfunction."),
    C("milrinone_bolus", "milrinone-the-preferred-rv-inotrope", "applied-core", "rescue", "In a marginally hypotensive postoperative patient, omit the milrinone loading bolus and pair infusion with pressor support if needed."),
    C("milrinone_context", "milrinone-the-preferred-rv-inotrope", "enrichment", "evidence", "Lower myocardial oxygen cost, renal clearance, arrhythmias, and thrombocytopenia contextualize milrinone selection.", "supporting-context", "The central mechanism, RV indication, and hypotension response are carded separately."),

    C("epi_mech", "epinephrine-the-powerful-non-selective-agent", "core", "mechanism", "Epinephrine stimulates beta-1, beta-2, and alpha-1 receptors, giving strong inotropy with increasing vasoconstriction at higher doses."),
    C("epi_lactate", "epinephrine-the-powerful-non-selective-agent", "applied-core", "mechanism", "Epinephrine can raise lactate through beta-2-driven aerobic glycolysis without proving worsening tissue hypoxia."),
    C("epi_monitor", "epinephrine-the-powerful-non-selective-agent", "applied-core", "sequence", "When epinephrine raises lactate, interpret perfusion using MAP, urine output, mentation, venous saturation, and the full trajectory."),
    C("epi_context", "epinephrine-the-powerful-non-selective-agent", "enrichment", "comparison", "Tachyarrhythmia, myocardial oxygen demand, hyperglycemia, and splanchnic effects make epinephrine a powerful but costly rescue agent.", "supporting-context", "The adverse-effect profile informs escalation but need not become several isolated clozes."),

    C("norepi", "norepinephrine-and-vasopressin", "core", "mechanism", "Norepinephrine is predominantly alpha-1 with modest beta-1 effect and restores systemic tone in vasoplegia."),
    C("vasopressin", "norepinephrine-and-vasopressin", "core", "mechanism", "Vasopressin recruits non-adrenergic V1 vasoconstriction and is relatively pulmonary-vascular-sparing compared with escalating catecholamines."),
    C("vasopressin_early", "norepinephrine-and-vasopressin", "applied-core", "sequence", "Add vasopressin early when norepinephrine alone is inadequate rather than forcing one adrenergic pathway to high doses."),
    C("pressor_context", "norepinephrine-and-vasopressin", "enrichment", "model", "Norepinephrine also supports systemic diastolic pressure in RV failure, while excessive vasoconstriction risks ischemia.", "supporting-context", "The lesson's context is preserved without implying that one pressor suits every shock profile."),

    C("vasoplegia_ladder", "vasoplegia-the-treatment-ladder", "core", "sequence", "Refractory vasoplegia is treated by sequentially adding norepinephrine, vasopressin, methylene blue, and hydroxocobalamin, with case-specific adjuncts."),
    C("mb_mechanism", "vasoplegia-the-treatment-ladder", "core", "mechanism", "Methylene blue interrupts nitric-oxide to cGMP signaling."),
    C("mb_contra", "vasoplegia-the-treatment-ladder", "applied-core", "bounded-set", "G6PD deficiency and serotonergic medications are major safety checks before methylene blue."),
    C("mb_oximeter", "vasoplegia-the-treatment-ladder", "applied-core", "mechanism", "Methylene blue can artifactually lower pulse-oximetry saturation, so ABG co-oximetry should guide oxygen assessment."),
    C("hydroxo_mech", "vasoplegia-the-treatment-ladder", "applied-core", "mechanism", "Hydroxocobalamin scavenges nitric oxide and is a rescue option for refractory vasoplegia."),
    C("ladder_context", "vasoplegia-the-treatment-ladder", "enrichment", "evidence", "Steroids, angiotensin II, drug-specific adverse effects, and the lesson's severe-renal-failure caution require case-specific review.", "supporting-context", "These heterogeneous adjuncts and contraindications should not be flattened into one universal algorithm card."),

    C("inodilator_pressure", "inodilators-and-the-dopamine-legacy", "core", "mechanism", "Dobutamine and milrinone combine inotropy with vasodilation, so their benefit in high-SVR failure becomes a liability in hypotension."),
    C("dopamine_low", "inodilators-and-the-dopamine-legacy", "applied-core", "number", "Below about 5 mcg/kg/min, dopamine predominantly stimulates dopaminergic receptors."),
    C("dopamine_mid", "inodilators-and-the-dopamine-legacy", "applied-core", "number", "Around 5-10 mcg/kg/min, dopamine has predominantly beta-1 inotropic effects."),
    C("dopamine_high", "inodilators-and-the-dopamine-legacy", "applied-core", "number", "Above about 10 mcg/kg/min, dopamine becomes predominantly alpha-1 vasoconstrictive."),
    C("renal_dopamine", "inodilators-and-the-dopamine-legacy", "core", "evidence", "Low-dose renal dopamine may increase urine flow but does not protect kidneys or improve renal recovery."),
    C("dopamine_context", "inodilators-and-the-dopamine-legacy", "enrichment", "comparison", "Dose-dependent receptor switching and arrhythmogenicity make dopamine less predictable than mechanism-specific agents.", "supporting-context", "The dose bands and lack of renal protection are the carded decisions."),

    C("mcs_trigger", "mechanical-escalation-and-weaning-vasoactive-support", "core", "rescue", "Multiple escalating vasoactive agents with rising lactate and no hemodynamic improvement should trigger mechanical-support assessment."),
    C("mcs_map", "mechanical-escalation-and-weaning-vasoactive-support", "core", "comparison", "IABP offers modest ischemic-LV support, Impella actively unloads the LV, and VA-ECMO supports biventricular or cardiorespiratory failure."),
    C("wean_one", "mechanical-escalation-and-weaning-vasoactive-support", "applied-core", "sequence", "Wean vasoactive support one agent at a time while watching flow and organ-perfusion trends."),
    C("rhythm_inotrope", "mechanical-escalation-and-weaning-vasoactive-support", "applied-core", "rescue", "Correcting bradycardia and restoring AV synchrony can improve output before another infusion is added."),
    C("wean_context", "mechanical-escalation-and-weaning-vasoactive-support", "enrichment", "model", "The highest-burden agent is often weaned first, but the sequence follows the patient's dominant physiology and recovery.", "supporting-context", "A universal drug-off sequence would overstate the lesson; one-at-a-time reassessment is the transferable target."),

    C("lcos_order", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b", "core", "sequence", "The lesson's LCOS sequence is preload, afterload, contractility, rate or rhythm, then exclusion of tamponade and ischemia with mechanical escalation."),
    C("vaso_dose", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b", "applied-core", "number", "A lesson vasopressin dose for refractory vasoplegia is about 0.03-0.04 units/min."),
    C("mb_dose", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b", "applied-core", "number", "A lesson methylene-blue rescue dose is about 1.5-2 mg/kg."),
    C("hydroxo_dose", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b", "applied-core", "number", "A lesson hydroxocobalamin rescue dose is about 5 g."),
    C("angiotensin_evidence", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b", "applied-core", "evidence", "Angiotensin II evidence in cardiac-surgery vasoplegia is presented as a post-hoc ATHOS-3 signal rather than a dedicated trial."),
    C("mastery_context", "senior-reasoning-the-lcos-algorithm-in-order-and-the-vasoplegia-ladder-b", "enrichment", "model", "Before climbing the vasoplegia ladder, prove low resistance with normal-high flow and venous saturation rather than pump failure.", "supporting-context", "The shared vasoplegia-profile card from the LCOS pack supplies this discriminator.")
  ], [
    K("fc2_x6u80000000000000000000001", "drug_axes", "bounded-set", "Choose vasoactive drugs across pump, systemic tone, and {{c1::PVR}}.", "Three physiologic axes", "An agent that helps LV flow may lower pressure or worsen the pulmonary circulation, so all three effects matter."),
    K("fc2_x6u80000000000000000000002", "fix_levers_first", "ordered-sequence", "Before adding an inotrope, optimize preload, afterload, and {{c1::rate or rhythm}}.", "Fix cheaper levers first", "Residual low output after these corrections is more likely to represent contractile failure."),
    K("fc2_x6u80000000000000000000003", "minimize_drugs", "mechanism-decision", "Once perfusion recovers, reduce to the {{c1::lowest effective vasoactive exposure}}.", "Demand and arrhythmia cost", "Every unnecessary inotrope dose adds myocardial work and rhythm risk.", H()),
    K("fc-d13-vaso-dobutamine-1sj4s2y", "dobutamine_mech", "mechanism-decision", "The beta-1 and beta-2 inodilator is {{c1::dobutamine}}.", "Contractility plus vasodilation", "It raises LV contractility while lowering systemic and pulmonary resistance."),
    K("fc2_x6u80000000000000000000004", "dobutamine_use", "mapping-set", "Low-output LV failure with high SVR favors {{c1::dobutamine}} when pressure allows.", "Unload and squeeze", "Its short action is readily titrated, but beta-2 vasodilation can worsen hypotension.", H("Inotrope selection requires bedside hemodynamic and clinician confirmation.")),
    K("fc2_x6u80000000000000000000005", "dobutamine_pressure", "mechanism-decision", "If dobutamine improves flow but drops MAP, add a {{c1::vasopressor}}.", "Support tone separately", "The inodilator's beta-2 effect cannot be separated from its contractile benefit.", H("Combined inotrope-pressor management requires bedside clinician confirmation.")),
    K("fc2_x6u80000000000000000000006", "dobutamine_blunting", "mechanism-decision", "A weak dobutamine response may reflect {{c1::beta blockade}}.", "Receptor-dependent drug", "Chronic receptor downregulation can similarly limit the expected beta-agonist effect."),
    K("fc-d13-vaso-milrinone-08r8x96", "milrinone_mech", "mechanism-decision", "The beta-independent PDE3 inodilator is {{c1::milrinone}}.", "Raises intracellular cAMP", "It increases contractility while dilating both systemic and pulmonary vascular beds."),
    K("fc2_x6u80000000000000000000007", "milrinone_use", "mapping-set", "RV failure with pulmonary hypertension often favors {{c1::milrinone}} when MAP allows.", "Lower PVR and add inotropy", "Systemic vasodilation may require concurrent pressor support.", H("RV inotrope selection requires bedside hemodynamic and clinician confirmation.")),
    K("fc2_x6u80000000000000000000008", "milrinone_half", "numeric-guideline", "Milrinone's half-life is about {{c1::2.5 hours}} and lengthens in renal failure.", "Not rapidly reversible", "Renal clearance makes hypotension and arrhythmia harder to correct when kidney function is impaired.", N("~", 2.5, "hours", "Approximate milrinone elimination half-life before renal prolongation", "approximate")),
    K("fc2_x6u80000000000000000000009", "milrinone_bolus", "mechanism-decision", "With marginal MAP, start milrinone without a {{c1::loading bolus}}.", "Avoid abrupt vasodilation", "Use a pressor when needed and remember that renal dysfunction prolongs the infusion's effects.", H("Milrinone loading and pressor support require local ICU dosing review.")),
    K("fc-d13-vaso-epinephrine-0ts8938", "epi_mech", "mechanism-decision", "The beta-1, beta-2, and alpha-1 rescue inotrope is {{c1::epinephrine}}.", "Powerful but costly", "Its strong contractility and dose-related vasoconstriction come with tachycardia and oxygen-demand penalties."),
    K("fc2_x6u80000000000000000000010", "epi_lactate", "mechanism-decision", "Epinephrine can raise lactate through {{c1::beta-2 aerobic glycolysis}}.", "Not automatically tissue hypoxia", "Use other organ-perfusion markers before interpreting the rise as treatment failure."),
    K("fc2_x6u80000000000000000000011", "epi_monitor", "bounded-set", "On epinephrine, judge perfusion with MAP, urine, mentation, and {{c1::venous saturation}}.", "Do not read lactate alone", "The trajectory across several markers separates pharmacologic lactate from ongoing shock."),
    K("fc-d13-vaso-norepinephrine-1ap304a", "norepi", "mechanism-decision", "The predominantly alpha-1 vasopressor for vasoplegia is {{c1::norepinephrine}}.", "Some beta-1 support", "It restores systemic vascular tone and can preserve diastolic pressure for RV coronary perfusion."),
    K("fc2_x6u80000000000000000000012", "vasopressin", "mechanism-decision", "The non-adrenergic V1 vasopressor is {{c1::vasopressin}}.", "Relatively PVR-sparing", "It recruits a second pathway when adrenergic responsiveness is blunted."),
    K("fc-d13-vaso-vasopressin-0ac88yb", "vasopressin_early", "ordered-sequence", "If norepinephrine is inadequate in vasoplegia, add {{c1::vasopressin early}}.", "Do not force one receptor", "An additive V1 mechanism can reduce escalating catecholamine exposure.", H("Refractory vasoplegia sequencing requires local protocol and clinician review.")),
    K("fc-d13-vaso-methylene-blue-0xswxc1", "vasoplegia_ladder", "ordered-sequence", "After norepinephrine and vasopressin, the next lesson rung is {{c1::methylene blue}}.", "Then hydroxocobalamin", "Each rung recruits a different pathway rather than endlessly escalating catecholamines.", H("Vasoplegia rescue sequencing requires clinician and local-protocol confirmation.")),
    K("fc2_x6u80000000000000000000013", "mb_mechanism", "mechanism-decision", "Methylene blue treats vasoplegia by inhibiting {{c1::NO-cGMP signaling}}.", "Restore vascular tone", "This mechanism targets the inflammatory vasodilatory pathway rather than adrenergic receptors."),
    K("fc2_x6u80000000000000000000014", "mb_contra", "bounded-set", "Before methylene blue, check G6PD status and {{c1::serotonergic medications}}.", "Hemolysis and serotonin risk", "The drug is a pro-oxidant and monoamine-oxidase inhibitor.", H("Methylene-blue contraindications require medication reconciliation and clinician review.")),
    K("fc2_x6u80000000000000000000015", "mb_oximeter", "mechanism-decision", "After methylene blue, an abrupt low SpO2 may be {{c1::measurement artifact}}.", "Confirm with ABG co-oximetry", "The dye interferes with pulse oximetry and can create a falsely low reading."),
    K("fc2_x6u80000000000000000000016", "hydroxo_mech", "mechanism-decision", "Hydroxocobalamin treats refractory vasoplegia by {{c1::scavenging nitric oxide}}.", "Alternative NO-pathway rescue", "Use is case-specific after adequate volume and conventional pressors fail.", H("Hydroxocobalamin rescue use requires clinician and local-protocol confirmation.")),
    K("fc2_x6u80000000000000000000017", "inodilator_pressure", "contrast", "In a hypotensive patient, inodilator vasodilation becomes a {{c1::liability}}.", "Benefit flips with pressure", "Pair dobutamine or milrinone with a pressor or select a different mechanism."),
    K("fc2_x6u80000000000000000000018", "dopamine_low", "numeric-guideline", "Predominantly dopaminergic dopamine effects occur below about {{c1::5 mcg/kg/min}}.", "Lowest dose band", "Urine flow may increase, but this does not establish kidney protection.", N("<", 5, "mcg/kg/min", "Lesson dopamine dose band with predominantly dopaminergic activity", "approximate")),
    K("fc2_x6u80000000000000000000019", "dopamine_mid", "numeric-guideline", "Predominantly beta-1 dopamine effects occur at about {{c1::5-10 mcg/kg/min}}.", "Middle dose band", "The receptor mix shifts with dose, making titration less predictable than a mechanism-specific agent.", N("between", [5, 10], "mcg/kg/min", "Lesson dopamine dose band with predominantly beta-1 activity", "approximate")),
    K("fc2_x6u80000000000000000000020", "dopamine_high", "numeric-guideline", "Predominantly alpha-1 dopamine effects occur above about {{c1::10 mcg/kg/min}}.", "Highest dose band", "Arrhythmogenicity and receptor switching contribute to its reduced modern role.", N(">", 10, "mcg/kg/min", "Lesson dopamine dose band with predominantly alpha-1 activity", "approximate")),
    K("fc2_x6u80000000000000000000021", "renal_dopamine", "contrast", "Low-dose dopamine may increase urine but provides {{c1::no renal protection}}.", "Flow is not recovery", "It does not improve nephron recovery and adds arrhythmia risk."),
    K("fc2_x6u80000000000000000000022", "mcs_trigger", "mechanism-decision", "Escalating multiple drugs with rising lactate should trigger {{c1::mechanical-support assessment}}.", "Pharmacology has limits", "Match IABP, Impella, or ECMO to the failed ventricular or cardiorespiratory physiology.", H("Mechanical-circulatory-support escalation requires immediate senior clinician review.")),
    K("fc2_x6u80000000000000000000023", "mcs_map", "mapping-set", "For active LV unloading beyond IABP support, choose {{c1::Impella}}.", "ECMO supports both sides", "IABP provides modest ischemic-LV assistance; VA-ECMO fits biventricular or cardiorespiratory failure.", H("Temporary mechanical-support selection requires a shock-team decision.")),
    K("fc2_x6u80000000000000000000024", "wean_one", "ordered-sequence", "During recovery from postcardiotomy shock, wean vasoactive support {{c1::one agent at a time}}.", "Preserve causal feedback", "After each change, reassess output, pressure, urine, lactate, mentation, and venous saturation."),
    K("fc-d13-vaso-rate-rhythm-1yf63pi", "rhythm_inotrope", "mechanism-decision", "In low output with inappropriate bradycardia, first correct {{c1::rate and AV synchrony}}.", "The cheapest inotrope", "Pacing an inappropriate bradycardia or restoring atrial contribution may raise output immediately."),
    K("fc2_x6u80000000000000000000025", "lcos_order", "ordered-sequence", "LCOS sequence: preload, afterload, contractility, then {{c1::rate or rhythm}}.", "Then surgical causes and MCS", "The fixed order prevents reflex inotropy before filling, resistance, and synchrony are corrected."),
    K("fc2_x6u80000000000000000000026", "vaso_dose", "numeric-guideline", "A lesson vasopressin dose for refractory vasoplegia is {{c1::0.03-0.04 units/min}}.", "Non-adrenergic second rung", "Dose and sequencing must follow local protocol and patient-specific ischemic risk.", N("between", [0.03, 0.04], "units/min", "Lesson vasopressin dose in refractory postcardiotomy vasoplegia", "approximate")),
    K("fc2_x6u80000000000000000000027", "mb_dose", "numeric-guideline", "A lesson methylene-blue rescue dose is {{c1::1.5-2 mg/kg}}.", "NO-cGMP rung", "Screen for G6PD deficiency and serotonergic drugs before use.", N("between", [1.5, 2], "mg/kg", "Lesson methylene-blue dose in refractory postcardiotomy vasoplegia", "approximate")),
    K("fc-d13-vaso-hydroxocobalamin-5-g-06zbd4o", "hydroxo_dose", "numeric-guideline", "A lesson hydroxocobalamin rescue dose is about {{c1::5 g}}.", "NO-scavenging rung", "Use after conventional measures according to local refractory-vasoplegia protocol.", N("~", 5, "g", "Lesson hydroxocobalamin dose in refractory postcardiotomy vasoplegia", "approximate")),
    K("fc2_x6u80000000000000000000028", "angiotensin_evidence", "contrast", "Cardiac-surgery evidence for angiotensin II is {{c1::post-hoc ATHOS-3 evidence}}.", "Not a dedicated trial", "Treat the signal as conditional support rather than proof of universal benefit.")
  ]);

  /* ---------------- Day 13: Complications, orders, and secondary prevention ---------------- */
  registerLesson("d13-complications", "Postoperative Complications & Orders", [
    C("abcde", "the-structured-approach-to-deterioration", "core", "bounded-set", "A rapid postoperative deterioration sweep covers Airway, Bleeding, Cardiac causes, Drains and devices, and Everything else."),
    C("rerun", "the-structured-approach-to-deterioration", "core", "sequence", "Falling mixed venous saturation or rising lactate without a unifying cause should prompt the entire structured sweep again for a second process."),
    C("deterioration_context", "the-structured-approach-to-deterioration", "enrichment", "model", "Bleeding, hypovolemia, tamponade, arrhythmia, ventricular failure, and vasoplegia may coexist and drive one another.", "supporting-context", "The coexistence model explains why the carded sweep must be repeated rather than why one isolated value is treated."),

    C("bleeding_shared", "post-operative-bleeding-thresholds-and-the-surgical-vs-coagulopathic-dis", "enrichment", "model", "Rate thresholds, instability, surgical-versus-coagulopathic discrimination, viscoelastic interpretation, and targeted products are covered by the shared Day 11 bleeding cards.", "supporting-context", "This chunk is fully referenced by shared Day 11 claims, avoiding duplicate targets while preserving traceability."),

    C("medullary_aki", "acute-kidney-injury-mechanisms", "core", "mechanism", "The renal outer medulla is vulnerable to CPB low-flow and nonpulsatile perfusion because its oxygen demand is high and reserve is limited."),
    C("hemolysis_aki", "acute-kidney-injury-mechanisms", "core", "mechanism", "CPB hemolysis releases free hemoglobin that precipitates in renal tubules and directly injures them."),
    C("embolic_aki", "acute-kidney-injury-mechanisms", "applied-core", "mechanism", "Microemboli and inflammatory endothelial injury impair renal microcirculation after CPB."),
    C("pump_map", "acute-kidney-injury-mechanisms", "applied-core", "number", "The lesson suggests maintaining CPB MAP around 65-70 mmHg while minimizing bypass time and nephrotoxins to reduce AKI risk."),
    C("aki_context", "acute-kidney-injury-mechanisms", "enrichment", "evidence", "Historical incidence, dialysis mortality, and creatinine-stratified risks establish severity but do not provide current patient-specific predictions.", "supporting-context", "The historical estimates require contemporary cohort review and are not standalone treatment targets."),

    C("oliguria_assess", "managing-established-aki-avoiding-the-furosemide-reflex", "core", "sequence", "The first response to postoperative oliguria is hemodynamic assessment of MAP, output, filling, and volume rather than reflex furosemide."),
    C("furosemide_limit", "managing-established-aki-avoiding-the-furosemide-reflex", "core", "evidence", "Furosemide may produce urine or manage overload but does not improve renal recovery or mortality in established AKI."),
    C("rrt_indications", "managing-established-aki-avoiding-the-furosemide-reflex", "core", "bounded-set", "RRT indications include refractory hyperkalemia, severe acidosis, pulmonary-edema fluid overload, and symptomatic uremia."),
    C("crrt", "managing-established-aki-avoiding-the-furosemide-reflex", "applied-core", "comparison", "CRRT is preferred to intermittent dialysis when hemodynamic instability requires gradual fluid and solute removal."),
    C("aki_uo", "managing-established-aki-avoiding-the-furosemide-reflex", "applied-core", "number", "Urine output above 0.5 mL/kg/hr without diuretic distortion is a practical bedside renal-perfusion goal."),
    C("aki_timing", "managing-established-aki-avoiding-the-furosemide-reflex", "applied-core", "evidence", "STARRT-AKI supports initiating RRT for clinical indications rather than an arbitrary creatinine threshold."),
    C("aki_management_context", "managing-established-aki-avoiding-the-furosemide-reflex", "enrichment", "model", "Early post-CPB brisk diuresis can coexist with injury, and no listed pharmacologic agent is convincingly renoprotective.", "supporting-context", "This context prevents false reassurance without adding historical urine-rate and drug-list cards."),

    C("stroke_patterns", "neurological-complications-stroke", "core", "comparison", "Focal embolic stroke after aortic manipulation differs from watershed injury caused by global hypoperfusion."),
    C("epiaortic", "neurological-complications-stroke", "applied-core", "evidence", "Epiaortic ultrasound is more sensitive than TEE for ascending-aortic atheroma before cannulation or clamping."),
    C("stroke_ct", "neurological-complications-stroke", "core", "sequence", "A new postoperative focal deficit requires immediate stroke activation and noncontrast head CT to exclude hemorrhage."),
    C("no_lysis", "neurological-complications-stroke", "applied-core", "rescue", "Fresh major surgery generally precludes intravenous thrombolysis because of catastrophic surgical-site bleeding risk."),
    C("thrombectomy", "neurological-complications-stroke", "applied-core", "rescue", "Selected large-vessel occlusion after cardiac surgery may still be treated with mechanical thrombectomy."),
    C("stroke_context", "neurological-complications-stroke", "enrichment", "evidence", "Historical procedure-specific stroke incidence and mortality contextualize risk but need current registry confirmation.", "supporting-context", "Older epidemiologic percentages are not carded as contemporary predictions."),

    C("poaf_shared", "post-operative-atrial-fibrillation", "enrichment", "model", "Timing, reversible triggers, stability-based treatment, rate control, cardioversion, and anticoagulation assessment are covered by shared Day 12 POAF cards.", "supporting-context", "Shared source references preserve this chunk without duplicating its core retrieval targets."),
    C("poaf_electrolytes", "post-operative-atrial-fibrillation", "applied-core", "number", "The lesson suggests maintaining potassium above 4.0 mmol/L and magnesium above 2.0 mg/dL during the postoperative AF-risk period."),

    C("block_shared", "heart-block-sternal-wound-infection-and-mediastinitis", "enrichment", "model", "The complete-block recovery window and permanent-pacing decision are covered by shared Day 12 pacing cards.", "supporting-context", "Shared source references avoid a duplicate heart-block target."),
    C("mediastinitis", "heart-block-sternal-wound-infection-and-mediastinitis", "core", "contrast", "Deep sternal wound infection involves sternum or mediastinum, unlike superficial skin and subcutaneous infection."),
    C("mediastinitis_treat", "heart-block-sternal-wound-infection-and-mediastinitis", "core", "rescue", "Mediastinitis requires urgent surgical debridement plus culture-directed antibiotics and wound-management or reconstruction; antibiotics alone are insufficient."),
    C("sternal_context", "heart-block-sternal-wound-infection-and-mediastinitis", "enrichment", "bounded-set", "Sternal instability, purulent deep drainage, positive tissue culture, or compatible CT and sepsis support mediastinitis, with diabetes, obesity, bilateral IMA harvest, and prolonged support increasing risk.", "supporting-context", "The diagnostic and risk lists remain traceable context to the distinction and rescue cards."),

    C("mesenteric", "gi-complications-and-prolonged-ventilation", "core", "bounded-set", "Pain out of proportion, unexplained lactate, or feeding intolerance after low output should trigger urgent evaluation for mesenteric ischemia."),
    C("stress_prophylaxis", "gi-complications-and-prolonged-ventilation", "applied-core", "rescue", "Mechanically ventilated cardiac-surgery patients receive stress-ulcer prophylaxis when not contraindicated."),
    C("shock_liver", "gi-complications-and-prolonged-ventilation", "applied-core", "number", "Ischemic hepatitis after profound low output produces a sharp transaminase rise that often peaks within 24-72 hours and improves with hemodynamics."),
    C("sbt", "gi-complications-and-prolonged-ventilation", "core", "sequence", "A spontaneous breathing trial with acceptable rapid-shallow-breathing and gas-exchange performance supports extubation readiness."),
    C("vent_context", "gi-complications-and-prolonged-ventilation", "enrichment", "model", "Prolonged ventilation is usually multifactorial across mechanics, gas exchange, cardiac output, pain, sedation, nutrition, diaphragm function, and secretions.", "supporting-context", "The domain list supports a structured evaluation without becoming a long enumeration card."),

    C("orders_framework", "a-standard-post-operative-orders-framework", "core", "model", "A systems-based postoperative order set mirrors the deterioration sweep and prevents omission of entire care domains."),
    C("orders_electrolytes", "a-standard-post-operative-orders-framework", "applied-core", "number", "The lesson's order framework targets potassium above 4.0 mmol/L and magnesium above 2.0 mg/dL for AF prevention."),
    C("glucose", "a-standard-post-operative-orders-framework", "applied-core", "number", "The lesson's postoperative glucose target is roughly 140-180 mg/dL with an insulin protocol."),
    C("mobilize", "a-standard-post-operative-orders-framework", "applied-core", "number", "The lesson encourages early mobilization around postoperative day one or two when safe."),
    C("orders_context", "a-standard-post-operative-orders-framework", "enrichment", "bounded-set", "Monitoring, respiratory, cardiovascular, fluids and electrolytes, hematology, renal, infection, analgesia and delirium, and GI and nutrition domains complete the order set.", "supporting-context", "The domains are preserved for completeness while the card tests why the checklist exists."),

    C("presentation_sequence", "presenting-the-cardiac-surgery-patient-two-scripts", "core", "sequence", "A cardiac-surgery presentation compresses patient and operation, baseline risk, operative course, current trajectory, and today's decision in that order."),
    C("presentation_numbers", "presenting-the-cardiac-surgery-patient-two-scripts", "applied-core", "bounded-set", "STS-predicted mortality and cross-clamp plus CPB times frame preoperative risk and operative insult."),
    C("presentation_context", "presenting-the-cardiac-surgery-patient-two-scripts", "enrichment", "model", "Floor presentations emphasize recovery and disposition, whereas ICU presentations front-load ventilation, hemodynamics, drains, labs, and active issues.", "supporting-context", "The setting-specific scripts are preserved as context to the transferable sequence."),

    C("postop_beta_shared", "postoperative-atrial-fibrillation-beta-blocker-and-amiodarone-prophylaxi", "enrichment", "guideline", "Early postoperative beta-blocker initiation for POAF prevention is covered by the shared Day 12 AF guideline card.", "supporting-context", "The shared card carries the COR 1 and LOE B-R metadata."),
    C("preop_beta", "postoperative-atrial-fibrillation-beta-blocker-and-amiodarone-prophylaxi", "applied-core", "guideline", "Preoperative beta-blockers are reasonable without contraindication to reduce POAF, taught as COR 2a."),
    C("preop_amio", "postoperative-atrial-fibrillation-beta-blocker-and-amiodarone-prophylaxi", "applied-core", "guideline", "Preoperative amiodarone is reasonable to reduce POAF, taught as COR 2a."),
    C("poaf_guideline_context", "postoperative-atrial-fibrillation-beta-blocker-and-amiodarone-prophylaxi", "enrichment", "evidence", "Benefits of beta-blockers for perioperative ischemia, stroke, AKI, ventricular arrhythmia, and short-term mortality remain less certain than POAF prevention.", "supporting-context", "The uncertainty prevents overgeneralizing a firm POAF-prevention recommendation."),

    C("aspirin", "antiplatelet-and-risk-factor-therapy-after-revascularization", "core", "guideline", "After CABG, aspirin 100-325 mg should begin within six hours and continue indefinitely, taught as COR 1 LOE A."),
    C("dapt_cabg", "antiplatelet-and-risk-factor-therapy-after-revascularization", "applied-core", "guideline", "In selected CABG patients, DAPT for one year may improve saphenous-vein graft patency, taught as COR 2b."),
    C("dapt_pci", "antiplatelet-and-risk-factor-therapy-after-revascularization", "applied-core", "guideline", "Selected PCI patients may transition after one to three months of DAPT to P2Y12 monotherapy to reduce bleeding, taught as COR 2a."),
    C("no_beta", "antiplatelet-and-risk-factor-therapy-after-revascularization", "core", "guideline", "Routine lifelong beta blockade provides no event-reduction benefit after complete revascularization in stable ischemic disease with normal LV function, taught as COR 3 No Benefit."),
    C("risk_control", "antiplatelet-and-risk-factor-therapy-after-revascularization", "core", "bounded-set", "High-intensity statin, blood-pressure and diabetes control, and lifestyle change remain foundational after revascularization."),

    C("rehab", "cardiac-rehabilitation-smoking-cessation-and-psychological-care", "core", "guideline", "Comprehensive cardiac rehabilitation should be prescribed before discharge or at the first outpatient visit, taught as COR 1 LOE A."),
    C("smoking", "cardiac-rehabilitation-smoking-cessation-and-psychological-care", "core", "guideline", "Smoking cessation combines behavioral therapy with pharmacotherapy and at least one month of follow-up, taught as COR 1 LOE A."),
    C("psych", "cardiac-rehabilitation-smoking-cessation-and-psychological-care", "applied-core", "guideline", "Patients with depression, anxiety, or stress should receive psychological or pharmacologic care, taught as COR 1."),
    C("psych_screen", "cardiac-rehabilitation-smoking-cessation-and-psychological-care", "enrichment", "guideline", "Depression screening is taught as reasonable, COR 2b.", "supporting-context", "Screening is preserved as context while treatment of identified illness remains the actionable card."),

    C("registry", "revascularization-outcomes-registries-quality-and-volume", "core", "guideline", "Cardiac-surgery and PCI programs should participate in clinical registries and receive risk-adjusted outcome reports, taught as COR 1."),
    C("quality", "revascularization-outcomes-registries-quality-and-volume", "applied-core", "guideline", "Programs should routinely review institutional and operator outcomes with peer and random-case review, taught as COR 2a."),
    C("volume", "revascularization-outcomes-registries-quality-and-volume", "applied-core", "guideline", "Smaller-volume programs may affiliate with a high-volume center, taught as COR 2b."),
    C("outcomes_context", "revascularization-outcomes-registries-quality-and-volume", "enrichment", "evidence", "Risk adjustment compares expected with observed outcomes and closes the loop between preoperative prediction and quality improvement.", "supporting-context", "The accountability concept supports the three program-level recommendation cards.")
  ], [
    K("fc2_y7v90000000000000000000001", "abcde", "bounded-set", "A rapid deterioration sweep uses {{c1::A-B-C-D-E}}.", "Airway through Everything else", "Check Airway, Bleeding, Cardiac causes, Drains or devices, and Everything else before anchoring."),
    K("fc2_y7v90000000000000000000002", "rerun", "ordered-sequence", "Falling MVO2 or rising lactate without explanation means {{c1::repeat the full sweep}}.", "Look for a second process", "Postoperative problems often coexist, so enlarging the last intervention may miss the linked cause."),
    K("fc2_y7v90000000000000000000003", "medullary_aki", "mechanism-decision", "CPB low-flow particularly threatens the renal {{c1::outer medulla}}.", "High demand, low reserve", "Nonpulsatile perfusion compounds an already narrow oxygen-delivery margin."),
    K("fc2_y7v90000000000000000000004", "hemolysis_aki", "mechanism-decision", "CPB hemolysis injures tubules through filtered {{c1::free hemoglobin}}.", "Dark urine warning", "Pigment can precipitate in tubular lumens and cause direct injury."),
    K("fc2_y7v90000000000000000000005", "embolic_aki", "mechanism-decision", "Aortic microemboli and inflammation injure the renal {{c1::microcirculation}}.", "Cannulation and CPB effects", "Endothelial injury and impaired autoregulation add to low-output renal hypoxia."),
    K("fc-d13-complications-65-70-mmhg-1kveq54", "pump_map", "numeric-guideline", "The lesson's CPB kidney-protection MAP is about {{c1::65-70 mmHg}}.", "Also shorten pump time", "Avoid nephrotoxins and individualize perfusion pressure to baseline vascular disease.", N("between", [65, 70], "mmHg", "Lesson CPB MAP range used within an AKI-risk-reduction bundle", "approximate")),
    K("fc2_y7v90000000000000000000006", "oliguria_assess", "ordered-sequence", "The first response to postoperative oliguria is {{c1::hemodynamic assessment}}.", "Do not reflex furosemide", "Review MAP, cardiac output, filling pressures, and volume before removing preload."),
    K("fc2_y7v90000000000000000000007", "furosemide_limit", "contrast", "Furosemide can manage overload but does {{c1::not improve AKI recovery}}.", "Urine is not nephron rescue", "It also does not reduce mortality and may worsen low-output underfilling."),
    K("fc2_y7v90000000000000000000008", "rrt_indications", "bounded-set", "RRT treats refractory hyperkalemia, acidosis, overload, or {{c1::symptomatic uremia}}.", "Clinical indications, not creatinine", "Pulmonary-edema fluid overload must also be refractory to appropriate diuretic management."),
    K("fc2_y7v90000000000000000000009", "crrt", "mapping-set", "For unstable patients needing dialysis, prefer {{c1::CRRT}}.", "Slower fluid and solute removal", "Continuous therapy limits the abrupt hemodynamic shifts of intermittent dialysis.", H("Renal-replacement modality requires nephrology and ICU review.")),
    K("fc2_y7v90000000000000000000010", "aki_uo", "numeric-guideline", "A practical undistorted renal-perfusion goal is urine above {{c1::0.5 mL/kg/hr}}.", "Interpret without diuretic manufacture", "Pair output with hemodynamics and creatinine trajectory rather than treating the number alone.", N(">", 0.5, "mL/kg/hr", "Lesson bedside urine-output target in postoperative AKI management", "approximate")),
    K("fc2_y7v90000000000000000000011", "aki_timing", "contrast", "STARRT-AKI supports RRT for clinical indications, not an {{c1::arbitrary creatinine threshold}}.", "Accelerated initiation lacked benefit", "Hyperkalemia, acidosis, overload, or uremia should drive the decision."),
    K("fc2_y7v90000000000000000000012", "stroke_patterns", "contrast", "Territorial focal deficits suggest embolism; diffuse watershed injury suggests {{c1::global hypoperfusion}}.", "Mechanism changes prevention", "Aortic manipulation produces emboli, whereas sustained low flow injures border zones."),
    K("fc2_y7v90000000000000000000013", "epiaortic", "contrast", "For ascending-aortic atheroma, epiaortic ultrasound is more sensitive than {{c1::TEE}}.", "Direct probe avoids blind spot", "Detecting plaque before manipulation can change cannulation and clamp strategy."),
    K("fc2_y7v90000000000000000000014", "stroke_ct", "ordered-sequence", "A new postoperative focal deficit first requires {{c1::stroke activation and noncontrast CT}}.", "Exclude hemorrhage rapidly", "Parallel vascular imaging and specialist assessment determine whether an occlusion is treatable.", H("Postoperative stroke response requires the institutional stroke pathway.")),
    K("fc2_y7v90000000000000000000015", "no_lysis", "mechanism-decision", "Fresh major cardiac surgery generally precludes {{c1::intravenous thrombolysis}}.", "Surgical-site hemorrhage risk", "This does not eliminate evaluation for endovascular treatment.", H("Thrombolysis eligibility after surgery requires immediate stroke-specialist review.")),
    K("fc2_y7v90000000000000000000016", "thrombectomy", "mechanism-decision", "Selected postoperative large-vessel occlusion may receive {{c1::mechanical thrombectomy}}.", "No systemic lytic required", "Eligibility depends on imaging, timing, anatomy, baseline function, and specialist assessment.", H("Mechanical-thrombectomy eligibility requires immediate stroke-specialist review.")),
    K("fc2_y7v90000000000000000000017", "poaf_electrolytes", "numeric-guideline", "The lesson's POAF electrolyte goals are K above 4.0 and {{c1::Mg above 2.0 mg/dL}}.", "Local-protocol targets", "Correcting deficits is useful, but avoid unsafe over-replacement in renal dysfunction.", N(">", 2.0, "mg/dL magnesium", "Lesson postoperative electrolyte target with potassium above 4.0 mmol/L", "institution-dependent")),
    K("fc2_y7v90000000000000000000018", "mediastinitis", "contrast", "Deep sternal infection involves the sternum or {{c1::mediastinum}}.", "Not just skin and fat", "Instability, deep purulence, positive tissue culture, or compatible CT and sepsis raise concern."),
    K("fc2_y7v90000000000000000000019", "mediastinitis_treat", "ordered-sequence", "Deep postoperative mediastinitis requires urgent source control with {{c1::debridement plus antibiotics}}.", "Antibiotics alone fail", "VAC therapy, delayed closure, or flap reconstruction follows according to tissue loss and stability.", H("Deep sternal infection management requires urgent surgical and infectious-disease review.")),
    K("fc2_y7v90000000000000000000020", "mesenteric", "bounded-set", "Pain out of proportion with unexplained lactate suggests {{c1::mesenteric ischemia}}.", "Feeding intolerance also warns", "After low output or prolonged bypass, obtain urgent imaging or surgical consultation before bowel necrosis."),
    K("fc2_y7v90000000000000000000021", "stress_prophylaxis", "mechanism-decision", "While mechanically ventilated, provide {{c1::stress-ulcer prophylaxis}} when appropriate.", "Reassess when risk resolves", "Agent and duration should follow bleeding risk, enteral intake, and local ICU protocol.", H("Stress-ulcer prophylaxis requires contraindication and local-protocol review.")),
    K("fc2_y7v90000000000000000000022", "shock_liver", "numeric-guideline", "After profound low output, ischemic-hepatitis transaminases often peak within {{c1::24-72 hours}}.", "Restore hemodynamics", "A falling trajectory after perfusion recovery supports shock liver; other causes still require consideration.", N("between", [24, 72], "hours", "Typical lesson timing of peak transaminases in ischemic hepatitis", "range")),
    K("fc2_y7v90000000000000000000023", "sbt", "ordered-sequence", "Extubation readiness is tested with a {{c1::spontaneous breathing trial}}.", "Then read breathing pattern", "Gas exchange, mechanics, hemodynamics, mentation, secretion handling, pain, and sedation must also be acceptable."),
    K("fc2_y7v90000000000000000000024", "orders_framework", "mechanism-decision", "A systems-based order set prevents {{c1::whole-domain omissions}}.", "Mirror the bedside sweep", "Standard domains still require patient-specific targets and daily review."),
    K("fc2_y7v90000000000000000000025", "orders_electrolytes", "numeric-guideline", "The lesson's order-set goals are K above 4.0 and {{c1::Mg above 2.0 mg/dL}}.", "AF-prevention practice", "Renal function, current level, and local replacement protocol determine safe dosing.", N(">", 2.0, "mg/dL magnesium", "Lesson order-set electrolyte target with potassium above 4.0 mmol/L", "institution-dependent")),
    K("fc2_y7v90000000000000000000026", "glucose", "numeric-guideline", "The lesson's postoperative glucose target is about {{c1::140-180 mg/dL}}.", "Avoid tight-control hypoglycemia", "Use the institutional insulin protocol and individualize for instability and nutritional state.", N("between", [140, 180], "mg/dL", "Lesson postoperative ICU glucose target", "institution-dependent")),
    K("fc2_y7v90000000000000000000027", "mobilize", "numeric-guideline", "When safe, begin mobilization around postoperative day {{c1::1-2}}.", "Prevent deconditioning and delirium", "Hemodynamics, lines, wounds, and respiratory support determine readiness.", N("between", [1, 2], "postoperative days", "Lesson timing for early postoperative mobilization when safe", "institution-dependent")),
    K("fc2_y7v90000000000000000000028", "presentation_sequence", "ordered-sequence", "Present patient and operation, baseline risk, operative course, then {{c1::trajectory and today's decision}}.", "A compressed argument", "ICU presentations front-load active physiology; floor presentations emphasize recovery and disposition."),
    K("fc2_y7v90000000000000000000029", "presentation_numbers", "bounded-set", "Always have STS mortality and {{c1::cross-clamp plus CPB times}} ready.", "Risk and operative insult", "These numbers frame preoperative risk and the duration of myocardial and extracorporeal stress."),
    K("fc-d13-complications-preoperative-beta-blockers-cor-2a-15w4a0u", "preop_beta", "mechanism-decision", "Without contraindication, preoperative beta-blockers for POAF are {{c1::COR 2a}}.", "Reasonable, not mandatory", "The lesson distinguishes this from firm COR 1 early postoperative beta-blocker use.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 2a", "not-stated-in-lesson")),
    K("fc2_y7v90000000000000000000030", "preop_amio", "mechanism-decision", "Preoperative amiodarone to reduce POAF is {{c1::COR 2a}}.", "Reasonable prophylaxis", "It may be considered when beta-blockers are insufficient or contraindicated.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 2a", "not-stated-in-lesson")),
    K("fc-d13-complications-100-325-mg-1weukno", "aspirin", "numeric-guideline", "After CABG, the recommended early aspirin regimen is {{c1::100-325 mg within 6 hours}}.", "Continue indefinitely", "The lesson grades this COR 1 LOE A to reduce SVG closure and cardiovascular events.", Object.assign({}, N("between", [100, 325], "mg", "Aspirin initiated within 6 hours after CABG and continued indefinitely", "range"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 1", "A"))),
    K("fc2_y7v90000000000000000000031", "dapt_cabg", "numeric-guideline", "Selected CABG patients may receive DAPT for {{c1::1 year}} to improve vein-graft patency.", "COR 2b", "This is conditional rather than a universal requirement and must be balanced against bleeding.", Object.assign({}, N("=", 1, "year", "Selected CABG patients considered for DAPT to improve vein-graft patency", "exact"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 2b", "not-stated-in-lesson"))),
    K("fc2_y7v90000000000000000000032", "dapt_pci", "numeric-guideline", "Selected PCI patients may switch after {{c1::1-3 months of DAPT}} to P2Y12 monotherapy.", "Reduce bleeding", "Ischemic and bleeding risk determine whether the shorter strategy applies.", Object.assign({}, N("between", [1, 3], "months", "Selected PCI patients transitioning from DAPT to P2Y12 monotherapy", "range"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 2a", "not-stated-in-lesson"))),
    K("fc2_y7v90000000000000000000033", "no_beta", "contrast", "After complete revascularization with normal LV function, routine lifelong beta blockade is {{c1::COR 3: No Benefit}}.", "Stable ischemic disease context", "Separate this from beta-blockers for POAF prevention, prior MI, reduced EF, or another indication.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 3: No Benefit", "not-stated-in-lesson")),
    K("fc-d13-complications-risk-factor-control-1t15hmj", "risk_control", "bounded-set", "Revascularization does not replace high-intensity statin and {{c1::risk-factor control}}.", "Treat the patient beyond the graft", "Blood pressure, diabetes, smoking, activity, and nutrition remain long-term disease-modifying targets."),
    K("fc2_y7v90000000000000000000034", "rehab", "mechanism-decision", "Before discharge after coronary revascularization, prescribe comprehensive {{c1::cardiac rehabilitation}}.", "Before discharge or first visit", "The lesson grades this COR 1 LOE A for mortality, readmission, and quality-of-life benefit.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 1", "A")),
    K("fc2_y7v90000000000000000000035", "smoking", "numeric-guideline", "Smoking cessation combines behavior plus medication with follow-up for at least {{c1::1 month}}.", "Start during hospitalization", "The lesson grades the combined intervention COR 1 LOE A.", Object.assign({}, N(">=", 1, "month", "Supportive smoking-cessation follow-up after discharge", "exact"), G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 1", "A"))),
    K("fc2_y7v90000000000000000000036", "psych", "mechanism-decision", "Treat identified depression, anxiety, or stress with {{c1::psychological or pharmacologic care}}.", "Not just screening", "The lesson grades treatment COR 1 and allows CBT, counseling, medication, or an appropriate combination.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 1", "not-stated-in-lesson")),
    K("fc2_y7v90000000000000000000037", "registry", "mechanism-decision", "Cardiac programs should participate in {{c1::risk-adjusted clinical registries}}.", "COR 1 quality strategy", "Periodic outcome reports compare observed performance with expected risk.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 1", "not-stated-in-lesson")),
    K("fc-d13-complications-quality-improvement-program-cor-2a-0ykb3n4", "quality", "mechanism-decision", "Routine outcome and peer review is a {{c1::COR 2a quality-improvement program}}.", "Include random case review", "Institutional and operator-level review turns registry data into corrective action.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 2a", "not-stated-in-lesson")),
    K("fc-d13-complications-volume-cor-2b-1qq209e", "volume", "mechanism-decision", "Low-volume programs may affiliate with high-volume centers: {{c1::COR 2b}}.", "System-level option", "The recommendation is conditional and aims to improve care through shared expertise and systems.", G("acc-aha-scai-revascularization-2021", "ACC/AHA/SCAI", 2021, "COR 2b", "not-stated-in-lesson"))
  ]);

  /* ---------------- Day 14: Capstone integration ---------------- */
  registerLesson("d14-integration", "Capstone Synthesis: Read the Whole Patient", [
    C("method", "the-day-14-method", "core", "sequence", "The capstone method locates anatomy, names physiology, identifies operation-specific failure, applies evidence in context, and chooses an action that preserves rescue."),
    C("problem_rep", "the-day-14-method", "core", "bounded-set", "A useful one-sentence problem representation includes operation and timing, dominant physiology, decisive change, and immediate threat."),
    C("baseline", "the-day-14-method", "core", "model", "The working diagnosis should explain the change from this patient's baseline after this specific operation."),
    C("method_context", "the-day-14-method", "enrichment", "model", "A disciplined sequence counters anchoring on the loudest isolated clue.", "supporting-context", "The method, representation, and baseline-change cards carry the actionable reasoning."),

    C("pressure_flow", "build-a-coupled-hemodynamic-model", "core", "mechanism", "A norepinephrine-supported MAP may normalize pressure while cardiac output and tissue flow remain inadequate."),
    C("cvp_nonspecific", "build-a-coupled-hemodynamic-model", "core", "comparison", "High CVP alone cannot distinguish RV failure, volume overload, tamponade, or elevated intrathoracic pressure."),
    C("pump_profile", "build-a-coupled-hemodynamic-model", "core", "comparison", "Pump failure produces low output with impaired contraction and rising filling pressure."),
    C("vaso_profile", "build-a-coupled-hemodynamic-model", "core", "comparison", "Vasoplegia produces low pressure from low vascular tone with preserved or high flow after adequate filling."),
    C("obstruction_profile", "build-a-coupled-hemodynamic-model", "core", "comparison", "Mechanical obstruction lowers flow by limiting filling or ejection, as in tamponade, tension physiology, prosthetic obstruction, or dynamic LVOT obstruction."),
    C("regional_profile", "build-a-coupled-hemodynamic-model", "core", "comparison", "New ECG and wall-motion changes localizing to one territory suggest regional coronary, graft, or button ischemia."),
    C("coupled_context", "build-a-coupled-hemodynamic-model", "enrichment", "model", "Pressure, flow, filling, ventricular geometry, tissue markers, and support settings must tell one coherent story.", "supporting-context", "The individual pattern cards instantiate the coupled-signal rule."),

    C("cabg_map", "interrogate-the-operation", "core", "mechanism", "After CABG, new regional ischemia is a graft-flow problem until demonstrated otherwise."),
    C("root_map", "interrogate-the-operation", "core", "mechanism", "After aortic-root replacement, new RV ischemia raises concern for right-coronary-button compromise."),
    C("mitral_map", "interrogate-the-operation", "core", "mechanism", "After mitral repair, hypotension with LVOT obstruction and posterior MR suggests systolic anterior motion."),
    C("lvad_map", "interrogate-the-operation", "core", "mechanism", "After LVAD implantation, a small LV with leftward septal shift and high CVP suggests inadequate RV delivery or excessive pump speed."),
    C("operation_context", "interrogate-the-operation", "enrichment", "rescue", "The urgent question is which correctable technical lesion becomes irreversible if imaging or re-exploration is delayed.", "supporting-context", "The four operation-specific cards preserve the concrete failure mappings."),

    C("evidence_frame", "use-evidence-without-hiding-behind-it", "core", "bounded-set", "Before applying a trial, state its population, comparator, main result, and a relevant limitation."),
    C("freedom", "use-evidence-without-hiding-behind-it", "applied-core", "evidence", "FREEDOM supports CABG for diabetes with multivessel coronary disease but does not make every patient with diabetes an automatic surgical candidate."),
    C("momentum", "use-evidence-without-hiding-behind-it", "applied-core", "evidence", "MOMENTUM 3 supports advantages of a magnetically levitated LVAD platform but does not eliminate RV failure, bleeding, or infection."),
    C("conditional", "use-evidence-without-hiding-behind-it", "core", "model", "Evidence applies conditionally when the patient, anatomy, comparator, endpoint, and assumptions match the studied question."),
    C("evidence_context", "use-evidence-without-hiding-behind-it", "enrichment", "evidence", "Trial names are shorthand, not substitutes for matching design boundaries to the bedside decision.", "supporting-context", "The framework and two examples capture this limitation."),

    C("preserve_rescue", "preserve-the-rescue-route", "core", "rescue", "The next action should treat the leading mechanism while keeping a fallback route available if the diagnosis is wrong."),
    C("trigger", "preserve-the-rescue-route", "core", "sequence", "State an objective escalation trigger before deterioration, such as worsening lactate, failed loading response, persistent regional dysfunction, refractory pacing, or ongoing bleeding."),
    C("defensible_plan", "preserve-the-rescue-route", "core", "sequence", "A defensible integration plan states mechanism, action, monitoring response, and escalation threshold."),
    C("rescue_context", "preserve-the-rescue-route", "enrichment", "model", "Peripheral rescue access before redo sternotomy, bypass readiness during coronary evaluation, and simultaneous surgical-source search during coagulopathy correction exemplify preserved options.", "supporting-context", "Examples are retained without duplicating operation-specific procedural cards.")
  ], [
    K("fc2_z8w00000000000000000000001", "method", "ordered-sequence", "Capstone sequence: anatomy, physiology, operation-specific failure, evidence, then {{c1::rescue-preserving action}}.", "Use the same order", "The discipline reduces anchoring on the loudest number or most common generic diagnosis."),
    K("fc2_z8w00000000000000000000002", "problem_rep", "bounded-set", "A problem representation includes operation, timing, physiology, change, and {{c1::immediate threat}}.", "One compressed sentence", "This format exposes the working mechanism better than a disconnected list of values."),
    K("fc-d14-integration-change-from-this-patient-s-own-baseline-1jp009m", "baseline", "mechanism-decision", "Prefer the diagnosis explaining the {{c1::change from this patient's baseline}}.", "Operation supplies the prior", "Postoperative timing and procedure-specific failure modes determine which explanation is coherent."),
    K("fc2_z8w00000000000000000000003", "pressure_flow", "contrast", "A norepinephrine-restored MAP does not prove adequate {{c1::flow}}.", "Pressure can hide low output", "Persistent lactate rise, oliguria, narrow pulse pressure, or low venous saturation demands reassessment."),
    K("fc2_z8w00000000000000000000004", "cvp_nonspecific", "contrast", "In postoperative hemodynamic diagnosis, high CVP alone is {{c1::nondiagnostic}}.", "Cross-examine other signals", "RV failure, volume overload, tamponade, and high intrathoracic pressure can all raise it."),
    K("fc-d14-integration-pump-failure-1gm2t1n", "pump_profile", "mapping-set", "Low output, impaired contraction, and rising filling pressure indicate {{c1::pump failure}}.", "Weak pump, backed-up volume", "The pattern differs from low-resistance preserved-flow vasoplegia."),
    K("fc-d14-integration-vasoplegia-08l7wcd", "vaso_profile", "mapping-set", "Low vascular tone with preserved-high flow indicates {{c1::vasoplegia}}.", "Confirm adequate filling", "A vasopressor treats this pattern, whereas it may worsen a high-afterload failing ventricle."),
    K("fc2_z8w00000000000000000000005", "obstruction_profile", "mapping-set", "Low flow from mechanically limited filling or ejection indicates {{c1::obstruction}}.", "Think tamponade or LVOT", "Tension physiology and prosthetic obstruction are other operation-specific causes."),
    K("fc2_z8w00000000000000000000006", "regional_profile", "mapping-set", "Territorial ECG plus wall-motion change indicates {{c1::regional ischemia}}.", "Localize graft or button", "A global pump explanation should not erase a new regional signal."),
    K("fc-d14-integration-cabg-1pugevz", "cabg_map", "mechanism-decision", "After CABG, new regional ischemia is a {{c1::graft-flow problem}} until disproven.", "Operation changes the prior", "Urgent graft assessment preserves myocardium before regional injury becomes irreversible."),
    K("fc2_z8w00000000000000000000007", "root_map", "mechanism-decision", "After root replacement, new RV ischemia suggests {{c1::right-coronary-button compromise}}.", "Interrogate the reimplantation", "The operation makes a correctable button lesion more likely than a generic shock label."),
    K("fc2_z8w00000000000000000000008", "mitral_map", "mechanism-decision", "After mitral repair, LVOT obstruction plus posterior MR suggests {{c1::systolic anterior motion}}.", "Dynamic operation-specific lesion", "Supportive treatment that ignores the mechanism can worsen obstruction."),
    K("fc2_z8w00000000000000000000009", "lvad_map", "mechanism-decision", "Small LV, leftward septum, and high CVP after LVAD suggest {{c1::RV underdelivery or excess speed}}.", "Pump may be over-emptying", "Evaluate RV function, preload, afterload, and device speed together."),
    K("fc2_z8w00000000000000000000010", "evidence_frame", "bounded-set", "Apply a trial only after stating population, comparator, result, and {{c1::limitation}}.", "Four-part evidence frame", "Then test whether the patient's anatomy and decision endpoint match the study."),
    K("fc-d14-integration-freedom-04baei5", "freedom", "contrast", "The trial supporting CABG in diabetes with multivessel disease is {{c1::FREEDOM}}.", "Population matters", "It does not make every individual with diabetes an automatic surgical candidate."),
    K("fc2_z8w00000000000000000000011", "momentum", "contrast", "Magnetically levitated LVAD benefits were established by {{c1::MOMENTUM 3}}.", "Complications still remain", "The trial did not eliminate RV failure, bleeding, or infection."),
    K("fc2_z8w00000000000000000000012", "conditional", "mechanism-decision", "A senior evidence answer is often {{c1::conditional on matching assumptions}}.", "Match patient and endpoint", "Discordance may reflect a population, comparator, or outcome that differs from today's decision."),
    K("fc2_z8w00000000000000000000013", "preserve_rescue", "mechanism-decision", "Choose an action that treats the mechanism while {{c1::preserving a fallback route}}.", "Keep the rope attached", "Prepare rescue access, bypass, re-exploration, or alternate support before the patient loses that option."),
    K("fc2_z8w00000000000000000000014", "trigger", "ordered-sequence", "Before acting, state the objective {{c1::escalation trigger}}.", "A plan needs a threshold", "Use a trajectory or failed response that will prompt imaging, exploration, pacing rescue, or mechanical support."),
    K("fc2_z8w00000000000000000000015", "defensible_plan", "ordered-sequence", "A defensible plan is mechanism, action, monitor, then {{c1::escalate}}.", "Close the feedback loop", "This structure makes reassessment and rescue explicit instead of relying on hope.")
  ]);
})();
