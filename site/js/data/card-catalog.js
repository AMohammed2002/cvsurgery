/* Canonical cloze-card catalog and many-to-many learning-source connections. */
"use strict";

(function buildCardCatalog() {
  const sourceMap = new Map();
  const cardsById = new Map();
  const circuits = window.DAY_ECOSYSTEMS || [];
  const TYPE_ORDER = ["lesson", "anatomy", "surgery", "evidence", "physiology", "exercise", "angiography", "crisis", "viva"];
  const TYPE_LABELS = {
    lesson: "Lessons", anatomy: "Anatomy", surgery: "Operations", evidence: "Evidence",
    physiology: "Physiology labs", exercise: "Exercises", angiography: "Angiography",
    crisis: "Crisis simulations", viva: "Vivas"
  };
  const LAB_DAYS = {
    "cpb-console": [2], cardioplegia: [2],
    "oxygen-delivery": [2], "pv-loop": [3], valve: [4], "cpb-surgery": [2], cannulation: [2],
    iabp: [10], "teg-rotem": [11], ecg: [12], pacing: [12], shock: [13]
  };
  const EXERCISE_DAY_FIXES = {
    "ex-ischemic-cascade": 3, "ex-onto-bypass": 2, "ex-off-bypass": 2,
    "ex-cabg-sequence": 7
  };
  const CRISIS_DAYS = {
    "cannulation-dissection": [2], protamine: [11], "rv-failure": [13],
    "ic-looks-fine": [14], "ic-breathing-kidneys": [14], "ic-rhythm": [14], "ic-fine-yesterday": [14]
  };

  function canonicalType(type) { return type === "daily-case" ? "case" : type; }
  function key(type, id) { return canonicalType(type) + ":" + id; }
  function safeId(value) {
    return String(value == null ? "part" : value).toLowerCase().replace(/<[^>]+>/g, " ")
      .replace(/&[a-z0-9#]+;/gi, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "part";
  }
  function days(values) {
    return Array.from(new Set((Array.isArray(values) ? values : [values]).map(Number)
      .filter(day => Number.isInteger(day) && day >= 1 && day <= 14))).sort((a, b) => a - b);
  }
  function routeFor(type, id) {
    if (type === "lesson") return "#/lesson/" + encodeURIComponent(id);
    if (type === "anatomy") return "#/anatomy/" + encodeURIComponent(id);
    if (type === "surgery") return "#/surgery/" + encodeURIComponent(id);
    if (type === "evidence") return "#/trials/" + encodeURIComponent(id);
    if (type === "physiology") return "#/physiology/" + encodeURIComponent(id);
    if (type === "exercise") return "#/exercise/" + encodeURIComponent(id);
    if (type === "angiography") return "#/angiography";
    if (type === "crisis") return "#/crisis/" + encodeURIComponent(id);
    if (type === "viva") return "#/viva/" + encodeURIComponent(id);
    return "#/cards/source/" + encodeURIComponent(type) + "/" + encodeURIComponent(id);
  }
  function registerSource(record, owner) {
    if (!record || !record.type || !record.id) return null;
    record = Object.assign({}, record, { type: canonicalType(record.type) });
    const id = String(record.id), mapKey = key(record.type, id);
    const prior = sourceMap.get(mapKey);
    const merged = Object.assign({}, prior || {}, record, {
      id: id,
      linkedDays: days((prior && prior.linkedDays || []).concat(record.linkedDays || [])),
      route: record.route || (prior && prior.route) || routeFor(record.type, id),
      title: record.title || (prior && prior.title) || id,
      partIds: Array.from(new Set((prior && prior.partIds || []).concat(record.partIds || [])))
    });
    sourceMap.set(mapKey, merged);
    if (owner && typeof owner === "object") {
      owner.linkedDays = merged.linkedDays.slice();
      owner.cardSource = { type: merged.type, id: merged.id };
    }
    return merged;
  }
  function circuitDays(type, id) {
    return circuits.filter(c => c[type] && c[type].id === id).map(c => c.day);
  }

  /* Register every learner-facing source and give its content parts stable IDs. */
  Object.values(window.LESSONS || {}).forEach(lesson => {
    const seenParts = new Set();
    (lesson.chunks || []).forEach((chunk, index) => {
      let part = safeId(chunk.title || chunk.q || "chunk-" + (index + 1));
      if (seenParts.has(part)) part += "-" + String(index + 1).padStart(2, "0");
      seenParts.add(part);
      chunk.partId = part;
      if (!chunk.id) chunk.id = lesson.id + ":" + part;
    });
    registerSource({ type: "lesson", id: lesson.id, title: lesson.title, linkedDays: [lesson.day], partIds: (lesson.chunks || []).map(chunk => chunk.id) }, lesson);
  });

  (window.ANATOMY && window.ANATOMY.regions || []).forEach(region => {
    (region.sections || []).forEach((section, index) => {
      section.partId = "section:" + String(index + 1).padStart(2, "0");
      if (!section.id) section.id = region.id + "-section-" + String(index + 1).padStart(2, "0") + "-" + safeId(section.heading);
    });
    registerSource({ type: "anatomy", id: region.id, title: region.title,
      linkedDays: (region.linkedDays || []).concat(circuitDays("anatomy", region.id)), partIds: (region.sections || []).map(section => section.partId) }, region);
  });

  (window.SURGERY && window.SURGERY.sections || []).forEach(section => {
    (section.blocks || []).forEach((block, index) => {
      block.partId = "block:" + String(index + 1).padStart(2, "0");
      if (!block.id) block.id = section.id + "-block-" + String(index + 1).padStart(2, "0") + "-" + safeId(block.title);
    });
    section.stepPartIds = (section.steps || []).map((step, index) => "step:" + String(index + 1).padStart(2, "0"));
    section.stepIds = (section.steps || []).map((step, index) => section.id + "-step-" + String(index + 1).padStart(2, "0") + "-" + safeId(typeof step === "string" ? step : step.title));
    registerSource({ type: "surgery", id: section.id, title: section.title,
      linkedDays: (section.linkedDays || []).concat(section.day || [], circuitDays("surgery", section.id)),
      partIds: (section.blocks || []).map(block => block.partId).concat(section.stepPartIds) }, section);
  });

  (window.TRIALS && window.TRIALS.trials || []).forEach(trial => {
    trial.partIds = ["population", "result", "tradeoff", "limitation"];
    registerSource({
      type: "evidence", id: trial.id, title: trial.name,
      linkedDays: (trial.linkedDays || []).concat(trial.day || [], circuitDays("evidence", trial.id)),
      partIds: trial.partIds
    }, trial);
  });

  (window.VIVA || []).forEach(viva => {
    (viva.beats || []).forEach((beat, index) => { beat.partId = "beat:" + String(index + 1).padStart(2, "0"); });
    viva.partIds = (viva.beats || []).map(beat => beat.partId);
    registerSource({
      type: "viva", id: viva.id, title: viva.topic || viva.title,
      linkedDays: (viva.linkedDays || []).concat(viva.day || []), partIds: viva.partIds
    }, viva);
  });

  (window.CSLab && window.CSLab.all ? window.CSLab.all() : []).forEach(lab => {
    const equations = lab.teach && Array.isArray(lab.teach.equations) ? lab.teach.equations : [];
    lab.partIds = ["concept"]
      .concat((lab.objectives || []).map((objective, index) => "objective:" + String(index + 1).padStart(2, "0")))
      .concat(equations.map((equation, index) => "equation:" + String(index + 1).padStart(2, "0")));
    registerSource({
      type: "physiology", id: lab.id, title: lab.title || lab.id,
      linkedDays: (lab.linkedDays || []).concat(LAB_DAYS[lab.id] || []), partIds: lab.partIds,
      alwaysAvailable: lab.alwaysAvailable === true
    }, lab);
  });

  (window.EXERCISES || []).forEach(exercise => {
    if (EXERCISE_DAY_FIXES[exercise.id]) exercise.day = EXERCISE_DAY_FIXES[exercise.id];
    (exercise.steps || []).forEach((step, index) => { /* stable IDs live alongside string steps */ });
    exercise.partIds = exercise.type === "order"
      ? (exercise.steps || []).map((step, index) => exercise.id + "-step-" + String(index + 1).padStart(2, "0") + "-" + safeId(step))
      : (exercise.targets || []).map(target => exercise.id + "-target-" + safeId(target.zone || target.label));
    registerSource({ type: "exercise", id: exercise.id, title: exercise.title, linkedDays: [exercise.day], partIds: exercise.partIds }, exercise);
  });

  (window.CS_ADVANCED && window.CS_ADVANCED.crises || []).forEach(crisis => registerSource({
    type: "crisis", id: crisis.id, title: crisis.title,
    linkedDays: (crisis.linkedDays || []).concat(CRISIS_DAYS[crisis.id] || [], crisis.day || [])
  }, crisis));

  if (window.ANGIOGRAPHY) {
    (window.ANGIOGRAPHY.chapters || []).forEach(chapter => (chapter.sections || []).forEach((section, index) => {
      if (!section.id) section.id = chapter.id + "-section-" + String(index + 1).padStart(2, "0");
    }));
    const angioPartIds = [];
    (window.ANGIOGRAPHY.chapters || []).forEach(chapter => (chapter.sections || []).forEach(section => {
      angioPartIds.push("section:" + chapter.id + ":" + section.id);
    }));
    (window.ANGIOGRAPHY.cases || []).forEach(item => angioPartIds.push("case:" + item.id));
    registerSource({ type: "angiography", id: "coronary-angiography",
      title: (window.ANGIOGRAPHY.meta && window.ANGIOGRAPHY.meta.title) || "Coronary Angiography Intensive",
      linkedDays: [5], partIds: angioPartIds }, window.ANGIOGRAPHY.meta || window.ANGIOGRAPHY);
  }

  function inferSource(raw, hint) {
    if (raw && raw.source && typeof raw.source === "object" && raw.source.type && raw.source.id) return Object.assign({}, raw.source, { type: canonicalType(raw.source.type) });
    if (raw && raw.origin && raw.origin.type && raw.origin.id) return Object.assign({}, raw.origin, { type: canonicalType(raw.origin.type) });
    if (raw && raw.sourceRef && raw.sourceRef.type && raw.sourceRef.id) return Object.assign({}, raw.sourceRef, { type: canonicalType(raw.sourceRef.type) });
    if (raw && raw.lesson) return { type: "lesson", id: raw.lesson, partId: raw.partId || raw.sourceChunk };
    if (raw && raw.region) return { type: "anatomy", id: raw.region, partId: raw.partId };
    if (raw && (raw.section || raw.surgery)) return { type: "surgery", id: raw.section || raw.surgery, partId: raw.partId };
    if (raw && raw.sourceType && raw.sourceId) {
      if (raw.sourceType === "angiography") return { type: "angiography", id: "coronary-angiography", partId: raw.sourceId + ":" + (raw.partId || "part") };
      return { type: canonicalType(raw.sourceType), id: raw.sourceId, partId: raw.partId };
    }
    return hint || null;
  }
  function stripTags(html) { return String(html || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(); }
  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function normalizeSourceRef(value, fallback) {
    if (!value || typeof value !== "object") return fallback || null;
    if (!value.type || !value.id) return fallback || null;
    return {
      type: canonicalType(String(value.type)),
      id: String(value.id),
      partId: value.partId ? String(value.partId) : undefined,
      citationId: value.citationId ? String(value.citationId) : undefined,
      locator: value.locator ? String(value.locator) : undefined
    };
  }
  function recoverCloze(raw) {
    if (raw.cloze && /\{\{c\d+::/.test(raw.cloze)) return raw.cloze;
    if (raw.text && /\{\{c\d+::/.test(raw.text)) return raw.text;
    const answers = [];
    String(raw.back || "").replace(/<(?:b|span) class="(?:cloze-answer|cloze-fill|sx-clz-fill)"[^>]*>([\s\S]*?)<\/(?:b|span)>/gi,
      (_, answer) => { answers.push(stripTags(answer)); return _; });
    let index = 0;
    const recovered = String(raw.front || "").replace(/<span class="(?:cloze-blank|cloze|sx-clz-blank)"[^>]*>[\s\S]*?<\/span>/gi, () => {
      const answer = answers[index] || "answer"; index += 1;
      return "{{c" + index + "::" + answer + "}}";
    });
    return answers.length ? recovered : "";
  }
  function renderFront(cloze, explicitHint, keepHintHidden) {
    return String(cloze).replace(/\{\{c\d+::(.+?)(?:::(.+?))?\}\}/g,
      (_, answer, hint) => '<span class="cloze-blank" aria-label="hidden answer">[' + escapeHTML(keepHintHidden ? "…" : (hint || explicitHint || "…")) + "]</span>");
  }
  function renderV2Front(raw, cloze) {
    const embedded = String(cloze).match(/\{\{c\d+::.+?::(.+?)\}\}/);
    const hint = String(raw.hint || (embedded && embedded[1]) || "").trim();
    const prompt = '<div class="cloze-prompt">' + renderFront(cloze, null, true) + "</div>" +
      (hint ? '<details class="cloze-hint"><summary>Hint</summary><span>' + escapeHTML(hint) + "</span></details>" : "");
    if (!raw.image || !raw.image.src) return prompt;
    const caption = raw.image.caption ? "<figcaption>" + escapeHTML(raw.image.caption) + "</figcaption>" : "";
    return '<figure class="fc-image"><img src="' + escapeHTML(raw.image.src) + '" alt="' + escapeHTML(raw.image.alt || "Teaching image") + '" loading="lazy" decoding="async">' + caption + "</figure>" + prompt;
  }
  function renderBack(cloze) {
    return String(cloze).replace(/\{\{c\d+::(.+?)(?:::.+?)?\}\}/g, '<b class="cloze-answer">$1</b>');
  }
  function citationText(raw) {
    const citation = raw.citation;
    const pieces = [];
    if (typeof citation === "string" && citation.trim()) pieces.push(citation.trim());
    else if (citation && typeof citation === "object") {
      if (citation.label) pieces.push(citation.label);
      else if (citation.title) pieces.push(citation.title);
      else if (citation.sourceId) pieces.push(citation.sourceId);
      if (citation.locator) pieces.push(citation.locator);
    }
    if (raw.guideline && typeof raw.guideline === "object") {
      const organization = raw.guideline.organization || raw.guideline.sourceId;
      const year = raw.guideline.year;
      if (organization || year) pieces.push([organization, year].filter(Boolean).join(" "));
    }
    return Array.from(new Set(pieces.map(piece => String(piece).trim()).filter(Boolean))).join(" · ");
  }
  function renderV2Back(raw, cloze) {
    const explanation = String(raw.explanation || "").trim();
    const citation = citationText(raw);
    const details = [];
    if (explanation) details.push('<p class="cloze-explanation">' + escapeHTML(explanation) + "</p>");
    if (citation) details.push('<p class="cloze-citation">' + escapeHTML(citation) + "</p>");
    return '<div class="cloze-reveal">' + renderBack(cloze) + "</div>" +
      (details.length ? '<details class="cloze-detail"><summary>Explanation &amp; source</summary>' + details.join("") + "</details>" : "");
  }
  function add(raw, hint) {
    if (!raw || !raw.id) return;
    const origin = inferSource(raw, hint);
    if (!origin || !origin.type || !origin.id) return;
    /* Case simulations teach through branching decisions and debriefs. Keep
       both retired legacy cases and Crisis Rooms out of the shared SRS even if
       a stale or future source pack adds cards. */
    if (origin.type === "crisis" || origin.type === "case") return;
    const record = sourceMap.get(key(origin.type, origin.id)) || registerSource({
      type: origin.type, id: origin.id, title: raw.topic || origin.id, linkedDays: raw.linkedDays || raw.day || []
    });
    const cloze = recoverCloze(raw);
    if (!cloze || !/\{\{c\d+::[^}]+\}\}/.test(cloze)) return;
    const citation = typeof raw.source === "string" ? raw.source : raw.citation;
    const source = { type: origin.type, id: String(origin.id), partId: origin.partId || raw.partId || "legacy-" + raw.id };
    const sourceRefs = (Array.isArray(raw.sourceRefs) ? raw.sourceRefs : [source])
      .map(ref => normalizeSourceRef(ref, null)).filter(Boolean);
    if (!sourceRefs.some(ref => key(ref.type, ref.id) === key(source.type, source.id) && ref.partId === source.partId)) sourceRefs.unshift(source);
    const linkedDays = days(sourceRefs.reduce((allDays, ref) => {
      const linked = sourceMap.get(key(ref.type, ref.id));
      return allDays.concat(linked && linked.linkedDays || []);
    }, []).concat(raw.linkedDays || [], raw.day || [], record && record.linkedDays || []));
    const tags = Array.from(new Set((Array.isArray(raw.tags) ? raw.tags : [])
      .concat([origin.type, String(origin.id)], linkedDays.map(day => "day-" + day))
      .map(tag => String(tag).trim()).filter(Boolean)));
    const front = raw.front || (raw.schemaVersion === 2 ? renderV2Front(raw, cloze) : renderFront(cloze));
    /* The revealed answer stays concise. Explanation, citation/version and
       review status live in a collapsed details panel so useful context is
       available without becoming automatic answer leakage. */
    const back = raw.back || (raw.schemaVersion === 2 ? renderV2Back(raw, cloze) : renderBack(cloze));
    const normalized = Object.assign({}, raw, {
      id: String(raw.id), kind: "cloze", cloze: cloze, source: source, citation: citation,
      sourceRefs: sourceRefs,
      topic: raw.topic || (record && record.title) || origin.id,
      tags: tags,
      linkedDays: linkedDays, day: linkedDays[0] || raw.day || null,
      front: front, back: back,
      integration: origin.type !== "lesson" || !!raw.integration
    });
    if (origin.type === "lesson") normalized.lesson = origin.id;
    if (origin.type === "surgery") normalized.surgery = origin.id;
    sourceRefs.forEach(ref => {
      const linked = sourceMap.get(key(ref.type, ref.id));
      if (linked && ref.partId && !linked.partIds.includes(ref.partId)) linked.partIds.push(ref.partId);
    });
    cardsById.set(normalized.id, normalized);
  }

  (window.FLASHCARDS || []).forEach(card => add(card));
  (window.LESSON_CLOZE_CARDS || []).forEach(card => add(card));
  (window.ANATOMY && window.ANATOMY.cards || []).forEach(card => add(card, { type: "anatomy", id: card.region, partId: card.partId }));
  (window.SURGERY && window.SURGERY.cards || []).forEach(card => add(card, { type: "surgery", id: card.section, partId: card.partId }));
  (window.MODULE_CLOZE_CARDS || []).forEach(card => add(card));

  /* A rebuilt source replaces its legacy active catalog without touching its
     localStorage schedule. Equivalent v2 targets can reuse the old immutable
     id; non-equivalent legacy schedules simply become archived records. */
  const rebuiltSources = new Set((window.RETRIEVAL_SOURCE_REBUILDS || []).map(source => key(source.type, source.id)));
  if (rebuiltSources.size) {
    Array.from(cardsById.entries()).forEach(([id, card]) => {
      if (card.schemaVersion !== 2 && rebuiltSources.has(key(card.source.type, card.source.id))) cardsById.delete(id);
    });
  }
  (window.RETIRED_CARD_IDS || []).forEach(id => cardsById.delete(String(id)));
  (window.RETRIEVAL_CARDS || []).forEach(card => add(card));

  function all() { return Array.from(cardsById.values()); }
  function forSource(type, id) {
    const wantedType = canonicalType(type), wantedId = String(id);
    return all().filter(card => (card.sourceRefs || [card.source]).some(ref => ref.type === wantedType && ref.id === wantedId));
  }
  function forDay(day) { return all().filter(card => card.linkedDays.includes(+day)); }
  function sourcesForDay(day) {
    const target = +day;
    return Array.from(sourceMap.values()).filter(source => source.linkedDays.includes(target) && forSource(source.type, source.id).length)
      .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.title.localeCompare(b.title));
  }
  function source(type, id) { return sourceMap.get(key(type, String(id))) || null; }
  function forClaim(claimId) {
    return all().filter(card => Array.isArray(card.claimIds) && card.claimIds.includes(claimId));
  }
  function claimsForSource(type, id) {
    const wanted = key(type, id);
    return (window.FLASHCARD_CLAIMS || []).filter(claim => (claim.sourceRefs || []).some(ref => key(ref.type, ref.id) === wanted));
  }
  function guidelineNumberCards() {
    return all().filter(card => card.archetype === "numeric-guideline" || card.category === "number" || card.category === "guideline" || !!card.numeric || !!card.guideline);
  }
  function ctaHTML(type, id) {
    const record = source(type, id);
    const count = forSource(type, id).length;
    if (!record || !count) return "";
    const sourceCards = forSource(type, id);
    const nativeAllowed = typeof cardGateUnlocked !== "function" || sourceCards.some(card => cardGateUnlocked(card));
    let pacingAllowed = true;
    if (window.Pacing && typeof window.Pacing.canAccessSource === "function") {
      try {
        const result = window.Pacing.canAccessSource(type, id, "full-deck");
        pacingAllowed = typeof result === "object" ? result.allowed !== false : result !== false;
      } catch (error) { pacingAllowed = true; }
    }
    const deckAction = nativeAllowed && pacingAllowed
      ? '<a class="btn sm" href="#/cards/source/' + encodeURIComponent(type) + "/" + encodeURIComponent(id) + '">Study all ' + count + "</a>"
      : '<span class="btn sm secondary pacing-locked-card" aria-disabled="true">Deck locked</span>';
    const dayLinks = record.linkedDays.map(day => {
      let allowed = true;
      if (window.Pacing && typeof window.Pacing.canAccessCoreDay === "function") {
        try {
          const result = window.Pacing.canAccessCoreDay(day);
          allowed = typeof result === "object" ? result.allowed !== false : result !== false;
        } catch (error) { allowed = true; }
      }
      return allowed ? '<a class="btn sm secondary" href="#/day/' + day + '">Day ' + day + " circuit</a>"
        : '<span class="btn sm secondary pacing-locked-card" aria-disabled="true">Day ' + day + " paused</span>";
    }).join("");
    return '<div class="daily-bridge card-source-cta"><span class="eyebrow">CONNECTED CLOZE DECK</span><p><b>' + count + " cards</b> cover " + escapeHTML(record.title) +
      ".</p>" + deckAction + dayLinks + "</div>";
  }

  window.CardCatalog = Object.freeze({
    all: all, forSource: forSource, forDay: forDay, sourcesForDay: sourcesForDay, source: source, ctaHTML: ctaHTML,
    forClaim: forClaim, claimsForSource: claimsForSource, guidelineNumberCards: guidelineNumberCards,
    activeIds: function () { return all().map(card => card.id); },
    claims: function () { return (window.FLASHCARD_CLAIMS || []).slice(); },
    types: TYPE_ORDER.slice(), typeLabels: Object.assign({}, TYPE_LABELS),
    count: function (type, id) { return forSource(type, id).length; }
  });
  window.FLASHCARDS = all();
})();
