/* Retrieval-v2 rebuild for the imported cardiac-anatomy deck.
   Every legacy cloze target becomes one atomic card with a new opaque ID.
   The old schedules remain stored under their old IDs; none is copied to a
   child card because splitting or cue normalization changes retrieval identity. */
"use strict";

(function registerAnatomyRetrievalV2() {
  if (!window.FlashcardSchema) throw new Error("flashcard-schema.js must load before the anatomy retrieval pack");
  if (!window.ANATOMY || !Array.isArray(window.ANATOMY.regions) || !Array.isArray(window.ANATOMY.cards)) {
    throw new Error("The complete anatomy source must load before the anatomy retrieval pack");
  }

  const REVIEWER = "assistant-editorial-review";
  const REVIEWED_AT = "2026-07-31";
  const REVIEW_BY = "2027-07-31";
  const TARGET_MARKER = "ANATOMYTARGETMARKER";
  const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
  const knownCardIds = new Set((window.RETRIEVAL_CARDS || []).map(card => String(card && card.id || "")));
  const STOPWORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in", "into", "is",
    "it", "its", "of", "on", "or", "that", "the", "their", "this", "to", "was", "which", "with"
  ]);
  const ANSWER_OVERRIDES = Object.freeze({
    "a-ves-saphenous-02#3": "5 cm posteromedial to the patella",
    "a-val-aortic-04#1": "vein of Marshall",
    "a-cond-avnode-03#1": "septal tricuspid leaflet hinge",
    "a-ves-phrenic-03#2": "diaphragm and anterior thoracoabdominal wall sensation",
    "acomp-cond-avnode-s01-01#1": "septal tricuspid leaflet hinge",
    "acomp-val-fibrous-skeleton-s01-02#1": "both trigones and central fibrous body"
  });

  function normalizeSpace(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function decodeEntities(value) {
    return String(value == null ? "" : value)
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, "\"")
      .replace(/&#39;|&apos;/gi, "'");
  }

  function stripHTML(value) {
    return normalizeSpace(decodeEntities(String(value == null ? "" : value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, " ")));
  }

  function safeId(value) {
    return stripHTML(value).toLowerCase().replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "").slice(0, 80) || "part";
  }

  function words(value) {
    return stripHTML(value).match(/[\p{L}\p{N}]+(?:[’'\/-][\p{L}\p{N}]+)*/gu) || [];
  }

  function wordCount(value) { return words(value).length; }

  function normalizeComparable(value) {
    return stripHTML(value).toLowerCase().normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[–—−]/g, "-")
      .replace(/[^a-z0-9]+/g, " ")
      .trim().replace(/\s+/g, " ");
  }

  function opaqueId(seed) {
    let left = 0x811c9dc5;
    let right = 0x9e3779b9;
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
    if (knownCardIds.has(id)) throw new Error("Opaque anatomy retrieval ID collision for " + seed);
    knownCardIds.add(id);
    return id;
  }

  function clozeMatches(value) {
    const pattern = /\{\{c([1-9]\d*)::([^{}]*?)(?:::(.*?))?\}\}/g;
    return Array.from(String(value == null ? "" : value).matchAll(pattern));
  }

  function hintFrom(card) {
    const match = String(card.text || "").match(/<span[^>]*class=["']hint["'][^>]*>([\s\S]*?)<\/span>/i);
    return match ? stripHTML(match[1]) : "";
  }

  function mainText(card) {
    return String(card.text || "")
      .replace(/<br\s*\/?>\s*<span[^>]*class=["']hint["'][^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<span[^>]*class=["']hint["'][^>]*>[\s\S]*?<\/span>/gi, "");
  }

  function normalizedAnswer(cardId, targetIndex, rawAnswer) {
    const override = ANSWER_OVERRIDES[cardId + "#" + targetIndex];
    return normalizeSpace(stripHTML(override || rawAnswer)
      .replace(/>/g, " more than ")
      .replace(/</g, " less than ")
      .replace(/[{}]/g, ""));
  }

  function sectionTokens(value) {
    return normalizeComparable(value).split(" ")
      .filter(token => token.length > 2 && !STOPWORDS.has(token));
  }

  function chooseSection(region, card, filledText) {
    const sections = Array.isArray(region.sections) ? region.sections : [];
    if (!sections.length) throw new Error("Anatomy region has no authored sections: " + region.id);
    if (card.partId) {
      const direct = sections.find(section => section.partId === card.partId);
      if (direct) return direct;
    }
    const targetTokens = new Set(sectionTokens(filledText + " " + (card.subtype || "")));
    let winner = sections[0];
    let winningScore = -1;
    sections.forEach(section => {
      let score = 0;
      sectionTokens(section.heading).forEach(token => { if (targetTokens.has(token)) score += 4; });
      sectionTokens(section.html).forEach(token => { if (targetTokens.has(token)) score += 1; });
      if (/theatre|operative|surg/i.test(section.heading || "") && card.subtype === "surgical") score += 8;
      if (score > winningScore) {
        winner = section;
        winningScore = score;
      }
    });
    return winner;
  }

  function oneSentence(value, fallback) {
    let text = normalizeSpace(stripHTML(value || fallback || ""));
    text = text.replace(/(\d)\.(\d)/g, "$1DECIMALMARKER$2")
      .replace(/[.!?]+/g, "; ")
      .replace(/DECIMALMARKER/g, ".")
      .replace(/\s*;+\s*/g, "; ")
      .replace(/^[,;:\s]+|[,;:\s]+$/g, "");
    const tokens = words(text);
    if (tokens.length > 55) {
      const cutoff = tokens.slice(0, 55).join(" ");
      text = cutoff;
    }
    return (text || "Authored anatomy context retained from the imported source") + ".";
  }

  function explanationFor(card, region, section) {
    const hint = hintFrom(card);
    if (hint) return oneSentence(hint);
    return oneSentence("This target is grounded in " + section.heading + " within " + region.title + " anatomy");
  }

  function removeUnrelatedParentheses(value) {
    let text = String(value || "");
    let prior;
    do {
      prior = text;
      text = text.replace(/\([^()]*\)/g, match => match.includes(TARGET_MARKER) ? match : " ");
    } while (text !== prior);
    return text;
  }

  function isolateSentence(value) {
    const text = normalizeSpace(value);
    const index = text.indexOf(TARGET_MARKER);
    if (index < 0) return text;
    let start = 0;
    let end = text.length;
    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      if (/[!?]/.test(text[cursor]) || (text[cursor] === "." && /\s/.test(text[cursor + 1] || ""))) {
        start = cursor + 1;
        break;
      }
    }
    for (let cursor = index + TARGET_MARKER.length; cursor < text.length; cursor += 1) {
      if (/[!?]/.test(text[cursor]) || (text[cursor] === "." && (cursor === text.length - 1 || /\s/.test(text[cursor + 1] || "")))) {
        end = cursor + 1;
        break;
      }
    }
    return normalizeSpace(text.slice(start, end));
  }

  function cleanPromptText(value) {
    let text = stripHTML(value);
    text = removeUnrelatedParentheses(text);
    text = text.replace(/[“”"']/g, "")
      .replace(/[!?]+/g, ",")
      .replace(/\.(?!\d)/g, ",")
      .replace(/[;:]+/g, ",")
      .replace(/[()\[\]]/g, " ")
      .replace(/\s*,\s*/g, ", ")
      .replace(/(?:,\s*){2,}/g, ", ")
      .replace(/^[,\s]+|[,\s]+$/g, "");
    return normalizeSpace(text);
  }

  function comparableLeaks(prompt, answer) {
    const visible = String(prompt).replace(/\{\{c1::[^{}]*\}\}/g, " ");
    const answerComparable = normalizeComparable(answer);
    const visibleComparable = normalizeComparable(visible);
    return !!answerComparable && (" " + visibleComparable + " ").includes(" " + answerComparable + " ");
  }

  function removeLeakTokens(items, answer) {
    const span = leakSpan(items, answer);
    return span ? items.slice(0, span[0]).concat(items.slice(span[1] + 1)) : items;
  }

  function trimAtLeak(items, answer, isAfterTarget) {
    const span = leakSpan(items, answer);
    if (!span) return items;
    return isAfterTarget ? items.slice(0, span[0]) : items.slice(span[1] + 1);
  }

  function leakSpan(items, answer) {
    const wanted = normalizeComparable(answer);
    if (!wanted) return null;
    const wantedWords = wanted.split(" ").length;
    for (let start = 0; start < items.length; start += 1) {
      for (let end = start; end < items.length && end < start + wantedWords + 3; end += 1) {
        const candidate = normalizeComparable(items.slice(start, end + 1).join(" "));
        if (candidate === wanted) return [start, end];
        if (candidate.split(" ").filter(Boolean).length > wantedWords) break;
      }
    }
    return null;
  }

  function leadFor(region, answer) {
    const full = "In " + stripHTML(region.title) + ",";
    if (!comparableLeaks(full + " {{c1::" + answer + "}}.", answer)) return full;
    const categoryLead = {
      coronary: "In coronary anatomy,",
      chambers: "In cardiac chamber anatomy,",
      valves: "In cardiac valve anatomy,",
      conduction: "In conduction-system anatomy,",
      vessels: "In great-vessel anatomy,"
    }[region.category] || "In cardiac anatomy,";
    return comparableLeaks(categoryLead + " {{c1::" + answer + "}}.", answer) ? "In regional anatomy," : categoryLead;
  }

  function trimDangling(items, fromEnd) {
    const dangling = /^(?:a|an|and|as|at|by|for|from|in|into|of|on|or|the|to|with|its)$/i;
    const copy = items.slice();
    if (fromEnd) {
      while (copy.length && dangling.test(String(copy[copy.length - 1]).replace(/[^A-Za-z]/g, ""))) copy.pop();
    } else {
      while (copy.length && /^(?:and|or|but|then|while|whereas)$/i.test(String(copy[0]).replace(/[^A-Za-z]/g, ""))) copy.shift();
    }
    return copy;
  }

  function compactPrompt(markedText, answer, region, section, limit) {
    let clean = cleanPromptText(isolateSentence(markedText));
    if (!clean.includes(TARGET_MARKER)) clean = cleanPromptText(markedText);
    const parts = clean.split(TARGET_MARKER);
    let before = normalizeSpace(parts.shift() || "");
    let after = normalizeSpace(parts.join(" "));
    const lead = leadFor(region, answer);
    let beforeWords = before.split(/\s+/).filter(Boolean).slice(-18);
    let afterWords = after.split(/\s+/).filter(Boolean).slice(0, 18);
    beforeWords = removeLeakTokens(trimAtLeak(beforeWords, answer, false), answer);
    afterWords = removeLeakTokens(trimAtLeak(afterWords, answer, true), answer);

    function assemble() {
      beforeWords = trimDangling(beforeWords, true);
      afterWords = trimDangling(afterWords, false);
      const contextBefore = beforeWords.join(" ").replace(/^(?:and|or|but|then|while|whereas)\b[,\s]*/i, "");
      const contextAfter = afterWords.join(" ").replace(/[,\s]+$/g, "");
      return normalizeSpace(lead + " " + contextBefore + " {{c1::" + answer + "}} " + contextAfter)
        .replace(/\s+([,])/g, "$1").replace(/,+\s*$/g, "") + ".";
    }

    let prompt = assemble();
    let reductions = 0;
    while ((wordCount(prompt.replace(/\{\{c1::([^{}]*)\}\}/, "$1")) > limit || comparableLeaks(prompt, answer)) &&
        (beforeWords.length || afterWords.length) && reductions < 30) {
      const priorLength = beforeWords.length + afterWords.length;
      if (comparableLeaks(prompt, answer)) {
        beforeWords = removeLeakTokens(beforeWords, answer);
        afterWords = removeLeakTokens(afterWords, answer);
        if (beforeWords.length + afterWords.length === priorLength) {
          if (afterWords.length) afterWords.pop();
          else if (beforeWords.length) beforeWords.shift();
        }
      } else if (afterWords.length >= beforeWords.length && afterWords.length) {
        afterWords.pop();
      } else if (beforeWords.length) {
        beforeWords.shift();
      }
      prompt = assemble();
      reductions += 1;
    }
    if (comparableLeaks(prompt, answer)) {
      const headingWords = removeLeakTokens(stripHTML(section.heading || region.short || "regional anatomy").split(/\s+/), answer).slice(0, 8);
      prompt = leadFor(region, answer) + " the " + (headingWords.join(" ") || "anatomy") +
        " relationship identifies {{c1::" + answer + "}}.";
    }
    while (wordCount(prompt.replace(/\{\{c1::([^{}]*)\}\}/, "$1")) > limit && afterWords.length) {
      afterWords.pop();
      prompt = assemble();
    }
    return prompt;
  }

  function siblingPlaceholder(answer) {
    if (/\d/.test(answer)) return "companion value";
    if (/\b(?:anterior|posterior|superior|inferior|medial|lateral|left|right|proximal|distal)\b/i.test(answer)) {
      return "companion relation";
    }
    return "related structure";
  }

  function promptFor(card, targetIndex, matches, answer, region, section, archetype) {
    const pattern = /\{\{c([1-9]\d*)::([^{}]*?)(?:::(.*?))?\}\}/g;
    let seen = 0;
    const marked = mainText(card).replace(pattern, function replaceTarget(match, clozeIndex, siblingAnswer) {
      seen += 1;
      const normalizedSibling = normalizedAnswer(card.id, seen, siblingAnswer);
      return seen === targetIndex ? TARGET_MARKER : siblingPlaceholder(normalizedSibling);
    });
    const limit = archetype === "mechanism-decision" ? 36 : archetype === "numeric-guideline" ? 32 : 30;
    const sentence = cleanPromptText(isolateSentence(stripHTML(marked)));
    let prompt = sentence.replace(TARGET_MARKER, "{{c1::" + answer + "}}");
    if (!/[.!?]$/.test(prompt)) prompt += ".";
    const filled = prompt.replace(/\{\{c1::([^{}]*)\}\}/, "$1");
    const visibleWords = wordCount(prompt.replace(/\{\{c1::[^{}]*\}\}/, " "));
    const prefixWords = wordCount(prompt.slice(0, prompt.indexOf("{{c1::")));
    const prefix = normalizeSpace(prompt.slice(0, prompt.indexOf("{{c1::")));
    const cueContent = prefix.toLowerCase().split(/[^a-z0-9]+/).filter(token => token && !new Set([
      "a", "an", "and", "answer", "best", "correct", "factor", "feature", "following", "for", "in", "is",
      "key", "main", "most", "of", "on", "the", "to", "with"
    ]).has(token));
    if (matches.length > 1 || !prompt.includes("{{c1::") || wordCount(filled) > Math.min(limit, 28) || visibleWords < 5 ||
        prefixWords < 2 || /^(?:this|that|these|those|it|they|he|she|which|what)\b/i.test(prefix) ||
        !cueContent.length || comparableLeaks(prompt, answer)) {
      prompt = compactPrompt(marked, answer, region, section, limit);
    }
    return prompt;
  }

  function unitFor(answer) {
    const text = answer.toLowerCase();
    if (/%/.test(text)) return "%";
    if (/\bmm\b/.test(text)) return "mm";
    if (/\bcm\b/.test(text)) return "cm";
    if (/\bml\b/.test(text)) return "mL";
    if (/\bhours?\b/.test(text)) return "hours";
    if (/\bminutes?\b/.test(text)) return "minutes";
    if (/\bintercostal space\b/.test(text)) return "intercostal-space level";
    if (/\bscallop|\bp[123]\b/.test(text)) return "Carpentier scallop designation";
    if (/\bc\d/.test(text)) return "cervical-root designation";
    if (/\bt\d/.test(text) || /aortic hiatus/.test(text)) return "vertebral level";
    if (/\brib\b/.test(text)) return "rib level";
    if (/branch pattern/.test(text)) return "branch-count pattern";
    return "dimensionless";
  }

  function numericMetadata(answer, region, section) {
    const values = (answer.match(/-?\d[\d,]*(?:\.\d+)?/g) || [])
      .map(value => Number(value.replace(/,/g, ""))).filter(Number.isFinite);
    const hasRange = values.length === 2 && /\d(?:st|nd|rd|th)?\s*[–—−-]\s*(?:[a-z])?\d/i.test(answer);
    let comparator = "equal to";
    let value = values[0];
    if (hasRange) {
      comparator = "range";
      value = [Math.min(values[0], values[1]), Math.max(values[0], values[1])];
    } else if (values.length > 1) {
      comparator = "pattern";
      value = answer;
    } else if (/\b(?:about|approximately|roughly|around)\b|~/.test(answer)) {
      comparator = "approximately";
    } else if (/\bmore than\b|≥/.test(answer)) {
      comparator = "at least";
    } else if (/\bless than\b|≤/.test(answer)) {
      comparator = "at most";
    }
    return {
      comparator: comparator,
      value: value == null ? answer : value,
      unit: unitFor(answer),
      condition: "Imported anatomy target in " + section.heading + " of " + region.title,
      precision: /%|\b(?:about|approximately|roughly|around)\b|~|\b(?:mm|cm|mL|hours?|minutes?)\b/i.test(answer)
        ? "approximate" : "exact"
    };
  }

  function classification(card, answer, markedText) {
    const numeric = /\d/.test(answer);
    const hazard = card.subtype === "surgical" || card.subtype === "nerves" ||
      /\b(?:avoid|injur|risk|protect|hazard|danger|prevent|complication|bleed|ischaem|ischemi|rupture|damage)\b/i.test(markedText);
    if (numeric) return { archetype: "numeric-guideline", category: "number", tier: hazard ? "applied-core" : "core" };
    if (hazard || wordCount(answer) > 8) {
      return { archetype: "mechanism-decision", category: hazard ? "rescue" : "mechanism", tier: "applied-core" };
    }
    return { archetype: "atomic-concept", category: "definition", tier: "core" };
  }

  function sectionStatement(region, section) {
    const text = stripHTML(section.html || section.heading);
    const first = normalizeSpace(text.split(/(?<=[.!?])\s+(?=[A-Z\d])/)[0] || text);
    return oneSentence(first || (section.heading + " is retained as authored anatomy context for " + region.title));
  }

  const legacyCards = window.ANATOMY.cards.slice();
  const regionById = new Map(window.ANATOMY.regions.map(region => [region.id, region]));
  let legacyMultiCloze = 0;
  let legacyTargets = 0;
  let sectionCount = 0;
  let numericCount = 0;
  let appliedCount = 0;
  let promptCompactions = 0;
  let newCardCount = 0;
  let equivalentSharedTargets = 0;
  const regionCounts = {};

  window.ANATOMY.regions.forEach(region => {
    const source = { type: "anatomy", id: region.id };
    const sections = Array.isArray(region.sections) ? region.sections : [];
    const claims = [];
    const cards = [];
    const cardByFilledPrompt = new Map();

    sections.forEach((section, sectionIndex) => {
      section.partId = section.partId || "section:" + String(sectionIndex + 1).padStart(2, "0");
      const sourceRef = { type: "anatomy", id: region.id, partId: section.partId };
      claims.push({
        claimId: "anatomy." + safeId(region.id) + ".section." + String(sectionIndex + 1).padStart(2, "0") + ".context",
        sourceRefs: [sourceRef],
        tier: "enrichment",
        category: "definition",
        statement: sectionStatement(region, section),
        required: false,
        cardIds: [],
        disposition: "supporting-context",
        rationale: "This section-level ledger entry preserves authored context; its discrete recall targets are represented by target claims linked to the same source section.",
        reviewer: REVIEWER,
        reviewedAt: REVIEWED_AT
      });
      sectionCount += 1;
    });

    const sourceLegacyCards = legacyCards.filter(card => card.region === region.id);
    sourceLegacyCards.forEach(card => {
      const matches = clozeMatches(mainText(card));
      const openings = String(mainText(card)).match(/\{\{c\d+::/g) || [];
      if (!matches.length || openings.length !== matches.length) throw new Error("Malformed legacy anatomy cloze: " + card.id);
      if (matches.length > 1) legacyMultiCloze += 1;
      legacyTargets += matches.length;
      const fullyFilled = mainText(card).replace(/\{\{c([1-9]\d*)::([^{}]*?)(?:::(.*?))?\}\}/g,
        function fillLegacy(match, clozeIndex, answer) { return normalizedAnswer(card.id, Number(clozeIndex), answer); });
      const section = chooseSection(region, card, stripHTML(fullyFilled));
      const sourceRef = { type: "anatomy", id: region.id, partId: section.partId };

      matches.forEach((match, matchIndex) => {
        const targetIndex = matchIndex + 1;
        const answer = normalizedAnswer(card.id, targetIndex, match[2]);
        let markedSeen = 0;
        const markedText = stripHTML(mainText(card).replace(/\{\{c([1-9]\d*)::([^{}]*?)(?:::(.*?))?\}\}/g,
          function markTarget(token, clozeIndex, siblingAnswer) {
            markedSeen += 1;
            return markedSeen === targetIndex ? TARGET_MARKER : normalizedAnswer(card.id, markedSeen, siblingAnswer);
          }));
        const kind = classification(card, answer, markedText);
        const prompt = promptFor(card, targetIndex, matches, answer, region, section, kind.archetype);
        const legacyFilledWords = wordCount(stripHTML(fullyFilled));
        const newFilledWords = wordCount(prompt.replace(/\{\{c1::([^{}]*)\}\}/, "$1"));
        if (newFilledWords < legacyFilledWords) promptCompactions += 1;
        const claimId = "anatomy." + safeId(region.id) + "." + safeId(card.id) + ".target-" + String(targetIndex).padStart(2, "0");
        const explanation = explanationFor(card, region, section);
        const targetNumeric = kind.archetype === "numeric-guideline" ? numericMetadata(answer, region, section) : null;
        const filledKey = normalizeComparable(prompt.replace(/\{\{c1::([^{}]*)\}\}/, "$1"));
        let cardRecord = cardByFilledPrompt.get(filledKey);
        let cardId;
        let disposition = "carded";
        if (cardRecord) {
          cardId = cardRecord.id;
          disposition = "shared-card";
          equivalentSharedTargets += 1;
          cardRecord.claimIds.push(claimId);
          cardRecord.migrations = cardRecord.migrations || [cardRecord.migration];
          cardRecord.migrations.push({ legacyId: card.id, legacyTarget: targetIndex, inheritedSchedule: false });
          if (!cardRecord.sourceRefs.some(ref => ref.type === sourceRef.type && ref.id === sourceRef.id && ref.partId === sourceRef.partId)) {
            cardRecord.sourceRefs.push(sourceRef);
          }
          if (kind.tier === "core" && cardRecord.tier !== "core") {
            cardRecord.tier = "core";
            appliedCount -= 1;
          }
          claims.forEach(existingClaim => {
            if (existingClaim.cardIds.includes(cardId)) existingClaim.disposition = "shared-card";
          });
        } else {
          cardId = opaqueId("anatomy-retrieval-v2|" + region.id + "|" + card.id + "|" + targetIndex);
          cardRecord = {
            schemaVersion: 2,
            id: cardId,
            claimIds: [claimId],
            archetype: kind.archetype,
            tier: kind.tier,
            category: kind.category,
            cloze: prompt,
            explanation: explanation,
            source: sourceRef,
            sourceRefs: [sourceRef],
            identityDisposition: "new-target",
            migration: { legacyId: card.id, legacyTarget: targetIndex, inheritedSchedule: false }
          };
          if (targetNumeric) {
            cardRecord.numeric = targetNumeric;
            cardRecord.citation = sourceRef;
            cardRecord.reviewedAt = null;
            cardRecord.reviewBy = null;
            numericCount += 1;
          }
          if (kind.tier === "applied-core") appliedCount += 1;
          cards.push(cardRecord);
          cardByFilledPrompt.set(filledKey, cardRecord);
        }

        const claimRecord = {
          claimId: claimId,
          sourceRefs: [sourceRef],
          tier: kind.tier,
          category: kind.category,
          statement: normalizeSpace(prompt.replace(/\{\{c1::([^{}]*)\}\}/, "$1")),
          required: true,
          cardIds: [cardId],
          disposition: disposition,
          rationale: disposition === "shared-card"
            ? "This target is semantically identical to another imported target and shares one new retrieval card; no legacy schedule is copied."
            : "This atomic target was split from legacy card " + card.id + "; its new ID intentionally receives no inherited schedule because the retrieval cue or target scope changed.",
          reviewer: REVIEWER,
          reviewedAt: REVIEWED_AT
        };
        if (targetNumeric) claimRecord.numeric = targetNumeric;
        claims.push(claimRecord);
      });
    });

    regionCounts[region.id] = { legacyCards: sourceLegacyCards.length, cards: cards.length, sections: sections.length };
    newCardCount += cards.length;
    window.FlashcardSchema.registerPack({
      source: source,
      claims: claims,
      cards: cards,
      rebuild: true,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      reviewBy: REVIEW_BY,
      citation: source,
      workloadJustification: cards.length > 40
        ? "This source exceeds 40 cards because every distinct imported anatomy target is retained while multi-cloze notes are split into single retrieval decisions; collapsing these targets would recreate the cue overload and information loss this rebuild corrects."
        : undefined
    });
  });

  legacyCards.forEach(card => {
    if (!regionById.has(card.region)) throw new Error("Legacy anatomy card references unknown region: " + card.id);
  });

  window.ANATOMY_RETRIEVAL_MIGRATION_AUDIT = Object.freeze({
    legacyCards: legacyCards.length,
    legacyMultiClozeCards: legacyMultiCloze,
    legacyTargets: legacyTargets,
    newCards: newCardCount,
    preservedLegacyIds: 0,
    newOpaqueIds: newCardCount,
    equivalentTargetsSharingCards: equivalentSharedTargets,
    copiedSchedules: 0,
    regionsCovered: window.ANATOMY.regions.length,
    authoredSectionsCovered: sectionCount,
    targetClaims: legacyTargets,
    supportingContextClaims: sectionCount,
    totalClaims: legacyTargets + sectionCount,
    numericCardsPendingReview: numericCount,
    appliedCoreCards: appliedCount,
    imageIdentificationCards: 0,
    promptCompactions: promptCompactions,
    regionCounts: Object.freeze(regionCounts),
    identityDecision: "All active cards use new IDs because splitting or cue normalization changes retrieval identity; exact duplicate targets share one new card, and legacy schedules remain stored but are never copied to children."
  });
})();
