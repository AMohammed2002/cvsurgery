/* Retrieval-card v2 contract and append-only registries.
   Data packs remain plain scripts so CardiacSchool still works offline. */
"use strict";

(function initializeRetrievalSchema() {
  const TIERS = Object.freeze(["core", "applied-core", "enrichment"]);
  const CATEGORIES = Object.freeze([
    "model", "definition", "mechanism", "bounded-set", "comparison", "number",
    "guideline", "formula", "sequence", "rescue", "evidence", "image"
  ]);
  const ARCHETYPES = Object.freeze([
    "atomic-concept", "mechanism-decision", "bounded-set", "mapping-set",
    "numeric-guideline", "formula", "ordered-sequence", "contrast",
    "image-identification"
  ]);
  const DISPOSITIONS = Object.freeze(["carded", "shared-card", "supporting-context"]);
  const PRECISIONS = Object.freeze(["exact", "range", "approximate", "institution-dependent"]);

  window.FLASHCARD_CLAIMS = Array.isArray(window.FLASHCARD_CLAIMS) ? window.FLASHCARD_CLAIMS : [];
  window.RETRIEVAL_CARDS = Array.isArray(window.RETRIEVAL_CARDS) ? window.RETRIEVAL_CARDS : [];
  window.RETRIEVAL_SOURCE_REBUILDS = Array.isArray(window.RETRIEVAL_SOURCE_REBUILDS)
    ? window.RETRIEVAL_SOURCE_REBUILDS : [];
  window.RETIRED_CARD_IDS = Array.isArray(window.RETIRED_CARD_IDS) ? window.RETIRED_CARD_IDS : [];
  window.CARD_ID_ALIASES = window.CARD_ID_ALIASES && typeof window.CARD_ID_ALIASES === "object"
    ? window.CARD_ID_ALIASES : {};
  window.FLASHCARD_WORKLOAD_REVIEWS = window.FLASHCARD_WORKLOAD_REVIEWS && typeof window.FLASHCARD_WORKLOAD_REVIEWS === "object"
    ? window.FLASHCARD_WORKLOAD_REVIEWS : {};

  function appendUnique(target, records, idField) {
    const seen = new Set(target.map(record => record && record[idField]).filter(Boolean));
    (Array.isArray(records) ? records : []).forEach(record => {
      if (!record || !record[idField] || seen.has(record[idField])) return;
      target.push(record);
      seen.add(record[idField]);
    });
    return target;
  }

  function sourceKey(source) {
    if (!source || !source.type || !source.id) return "";
    return String(source.type) + ":" + String(source.id);
  }

  function referenceFor(source, partId) {
    const ref = { type: String(source.type), id: String(source.id) };
    if (partId) ref.partId = String(partId);
    return ref;
  }

  function registerPack(pack) {
    if (!pack || !pack.source || !sourceKey(pack.source)) return { claims: [], cards: [] };
    const source = { type: String(pack.source.type), id: String(pack.source.id) };
    const claimRecords = (pack.claims || []).map(claim => {
      const refs = Array.isArray(claim.sourceRefs) && claim.sourceRefs.length
        ? claim.sourceRefs : [referenceFor(source, claim.partId)];
      const normalized = Object.assign({
        sourceRefs: refs,
        required: claim.tier !== "enrichment",
        cardIds: [],
        disposition: "carded",
        rationale: "Authored retrieval objective.",
        reviewer: pack.reviewer || "content-team",
        reviewedAt: pack.reviewedAt || null
      }, claim);
      delete normalized.partId;
      return normalized;
    });
    const claimMap = new Map(claimRecords.map(claim => [claim.claimId, claim]));
    const cardRecords = (pack.cards || []).map(card => {
      const claimIds = Array.isArray(card.claimIds) ? card.claimIds.slice() : [];
      const lead = claimMap.get(claimIds[0]) || {};
      const refs = Array.isArray(card.sourceRefs) && card.sourceRefs.length
        ? card.sourceRefs : (lead.sourceRefs || [referenceFor(source, card.partId)]);
      const normalized = Object.assign({
        schemaVersion: 2,
        claimIds: claimIds,
        tier: lead.tier,
        category: lead.category,
        source: referenceFor(source, card.partId || (refs[0] && refs[0].partId)),
        sourceRefs: refs,
        citation: pack.citation,
        reviewedAt: pack.reviewedAt || null,
        reviewBy: pack.reviewBy || null,
        reviewer: pack.reviewer || "content-team"
      }, card);
      delete normalized.partId;
      return normalized;
    });
    claimRecords.forEach(claim => {
      if (Array.isArray(claim.cardIds) && claim.cardIds.length) return;
      claim.cardIds = cardRecords.filter(card => card.claimIds.includes(claim.claimId)).map(card => card.id);
      if (!claim.cardIds.length && claim.disposition === "carded") claim.disposition = "supporting-context";
    });
    appendUnique(window.FLASHCARD_CLAIMS, claimRecords, "claimId");
    appendUnique(window.RETRIEVAL_CARDS, cardRecords, "id");
    const defaultQueueCount = cardRecords.filter(card => card.tier === "core" || card.tier === "applied-core").length;
    if (defaultQueueCount > 40 && typeof pack.workloadJustification === "string" && pack.workloadJustification.trim()) {
      window.FLASHCARD_WORKLOAD_REVIEWS[sourceKey(source)] = {
        count: defaultQueueCount,
        rationale: pack.workloadJustification.trim(),
        reviewer: pack.reviewer || null,
        reviewedAt: pack.reviewedAt || null
      };
    }
    if (pack.rebuild !== false) {
      const key = sourceKey(source);
      if (!window.RETRIEVAL_SOURCE_REBUILDS.some(item => sourceKey(item) === key)) {
        window.RETRIEVAL_SOURCE_REBUILDS.push(source);
      }
    }
    return { claims: claimRecords, cards: cardRecords };
  }

  window.FlashcardSchema = Object.freeze({
    version: 2,
    tiers: TIERS,
    categories: CATEGORIES,
    archetypes: ARCHETYPES,
    dispositions: DISPOSITIONS,
    precisions: PRECISIONS,
    sourceKey: sourceKey,
    registerPack: registerPack,
    appendClaims(records) {
      return appendUnique(window.FLASHCARD_CLAIMS, records, "claimId");
    },
    appendCards(records) {
      return appendUnique(window.RETRIEVAL_CARDS, records, "id");
    },
    markSourcesRebuilt(sources) {
      const seen = new Set(window.RETRIEVAL_SOURCE_REBUILDS.map(sourceKey));
      (Array.isArray(sources) ? sources : []).forEach(source => {
        const key = sourceKey(source);
        if (!key || seen.has(key)) return;
        window.RETRIEVAL_SOURCE_REBUILDS.push({ type: String(source.type), id: String(source.id) });
        seen.add(key);
      });
    },
    retireCards(ids) {
      const seen = new Set(window.RETIRED_CARD_IDS.map(String));
      (Array.isArray(ids) ? ids : []).forEach(id => {
        id = String(id || "");
        if (!id || seen.has(id)) return;
        window.RETIRED_CARD_IDS.push(id);
        seen.add(id);
      });
    }
  });
})();
