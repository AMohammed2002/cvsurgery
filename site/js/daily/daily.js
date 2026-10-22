/* Daily circuit registry backed by the canonical CardCatalog. */
"use strict";

(function () {
  const circuits = window.DAY_ECOSYSTEMS || [];
  const coreTypes = ["anatomy", "surgery", "evidence", "crisis", "viva"];
  const typeLabel = Object.assign({
    lesson: "Lesson", anatomy: "Anatomy", surgery: "Operation", evidence: "Evidence",
    physiology: "Physiology lab", exercise: "Exercise", angiography: "Angiography",
    crisis: "Crisis Room", viva: "Viva"
  }, window.CardCatalog ? window.CardCatalog.typeLabels : {});
  const typeIcon = {
    lesson: "book", anatomy: "book", surgery: "scalpel", evidence: "scope",
    physiology: "activity", exercise: "puzzle", angiography: "scope",
    crisis: "shield", viva: "grad"
  };
  const safe = value => String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function pacingAllowed(type, id, purpose) {
    if (!window.Pacing || typeof window.Pacing.canAccessSource !== "function") return true;
    const result = window.Pacing.canAccessSource(type, id, purpose || "browse");
    return typeof result === "object" ? result.allowed !== false : result !== false;
  }
  function sourceAction(type, id, href, label, purpose) {
    return pacingAllowed(type, id, purpose)
      ? `<a class="btn sm${purpose === "full-deck" ? " secondary" : ""}" href="${safe(href)}">${safe(label)}</a>`
      : `<span class="btn sm secondary pacing-locked-card" aria-disabled="true" title="Available after the active recovery circuit">${typeof IC === "function" ? IC("lock") : "🔒"} Recovery locked</span>`;
  }
  function pacingScore(day) {
    if (!window.Pacing || typeof window.Pacing.dayProgress !== "function") return 0;
    try {
      const progress = window.Pacing.dayProgress(day);
      const raw = Number(progress && (progress.score != null ? progress.score : progress.pct));
      return Number.isFinite(raw) ? Math.round(raw <= 1 ? raw * 100 : raw) : 0;
    } catch (error) { return 0; }
  }

  function byDay(day) { return circuits.find(c => c.day === +day); }
  function crisisForDay(day) {
    return ((window.CS_ADVANCED && window.CS_ADVANCED.crises) || []).find(crisis => +crisis.day === +day) || null;
  }
  function coreItem(c, type) {
    if (!c) return null;
    if (type === "crisis") {
      const crisis = crisisForDay(c.day);
      return crisis ? {
        id: crisis.id,
        title: crisis.title,
        focus: crisis.brief || crisis.summary || "Run the branching emergency and debrief every decision."
      } : null;
    }
    return c[type] || null;
  }
  function cardsFor(day, type) {
    const cards = window.CardCatalog ? CardCatalog.forDay(+day) : [];
    let selected = type && type !== "all" ? cards.filter(card => card.source.type === type) : cards;
    if (typeof cardGateUnlocked === "function") {
      selected = selected.filter(card => cardGateUnlocked(card));
    }
    return window.Pacing && typeof window.Pacing.filterCards === "function"
      ? window.Pacing.filterCards(selected, "study") : selected;
  }
  function allCardsFor(day) { return cardsFor(day, "all"); }
  function sourceCards(type, id) { return window.CardCatalog ? CardCatalog.forSource(type, id) : []; }
  function sourcesForDay(day) { return window.CardCatalog ? CardCatalog.sourcesForDay(+day) : []; }
  function crisisSourcesForDay(day) {
    return ((window.CS_ADVANCED && window.CS_ADVANCED.crises) || [])
      .filter(crisis => +crisis.day === +day)
      .map(crisis => window.CardCatalog ? CardCatalog.source("crisis", crisis.id) : {
        type: "crisis", id: crisis.id, title: crisis.title, route: "#/crisis/" + encodeURIComponent(crisis.id)
      })
      .filter(Boolean);
  }
  function coreSource(c, type) {
    const item = coreItem(c, type);
    return item && item.id ? CardCatalog.source(type, item.id) : null;
  }
  function sourceDeck(type, id) { return "#/cards/source/" + encodeURIComponent(type) + "/" + encodeURIComponent(id); }

  function componentDone(c, type) {
    if (typeof Store === "undefined") return false;
    if (type === "anatomy") {
      return !!Store.get("anatomy_done", {})[c.anatomy.id];
    }
    if (type === "surgery") return !!Store.get("surgery_read", {})[c.surgery.id];
    if (type === "evidence") return !!Store.get("trials_done", {})[c.evidence.id];
    if (type === "crisis") {
      const crisis = crisisForDay(c.day);
      return !!(crisis && Store.get("crisis_done", {})[crisis.id]);
    }
    if (type === "viva") return !!Store.get("vivastats", {})[c.viva.id];
    return false;
  }
  function progress(c) { return coreTypes.filter(type => componentDone(c, type)).length; }
  function completionState(dayOrCircuit) {
    const c = typeof dayOrCircuit === "object" ? dayOrCircuit : byDay(dayOrCircuit);
    if (!c) return null;
    const lessons = (window.ALL_LESSONS || []).filter(lesson => +lesson.day === +c.day);
    const done = typeof doneLessons === "function" ? doneLessons() : (typeof Store !== "undefined" ? Store.get("done", {}) : {});
    const lessonCompleted = lessons.filter(lesson => !!done[lesson.id]).length;
    const coreCompleted = progress(c);
    return {
      day: c.day,
      lessons: { completed: lessonCompleted, total: lessons.length },
      core: { completed: coreCompleted, total: coreTypes.length },
      allLessonsComplete: lessons.length > 0 && lessonCompleted === lessons.length,
      coreComplete: coreCompleted === coreTypes.length,
      voicePromptUnlocked: lessons.length > 0 && lessonCompleted === lessons.length && coreCompleted === coreTypes.length
    };
  }

  function voicePromptHTML(c, completion) {
    const lessonRemaining = Math.max(0, completion.lessons.total - completion.lessons.completed);
    const coreRemaining = Math.max(0, completion.core.total - completion.core.completed);
    if (!completion.voicePromptUnlocked) {
      const requirements = [];
      if (lessonRemaining) requirements.push(lessonRemaining + " lesson" + (lessonRemaining === 1 ? "" : "s"));
      if (coreRemaining) requirements.push(coreRemaining + " core station" + (coreRemaining === 1 ? "" : "s"));
      return `<section id="voice-prompt" class="voice-prompt-card card is-locked" aria-labelledby="voice-prompt-title">
        <div class="voice-prompt-lock" aria-hidden="true">${typeof IC === "function" ? IC("lock") : "🔒"}</div>
        <div class="voice-prompt-copy"><span class="eyebrow">COMPLETION REWARD</span>
          <h2 id="voice-prompt-title">ChatGPT Voice Pimping Session</h2>
          <p>Finish every lesson and all five core stations to unlock a detailed Day ${c.day} oral-review prompt.</p>
          <div class="voice-requirements" aria-label="Unlock progress"><span>${completion.lessons.completed}/${completion.lessons.total} lessons</span><span>${completion.core.completed}/${completion.core.total} core stations</span></div>
          <p class="small muted">Still required: ${safe(requirements.join(" and ") || "completion data") }.</p>
        </div></section>`;
    }
    const prompt = window.VoicePrompts ? VoicePrompts.build(c.day) : "";
    return `<section id="voice-prompt" class="voice-prompt-card card is-unlocked" aria-labelledby="voice-prompt-title">
      <div class="voice-prompt-celebration" aria-hidden="true">${typeof IC === "function" ? IC("grad") : "🎓"}</div>
      <div class="voice-prompt-copy"><span class="eyebrow">UNLOCKED · DAY ${c.day}</span>
        <h2 id="voice-prompt-title">ChatGPT Voice Pimping Session</h2>
        <p>Your completion reward is a source-aligned oral examination that starts easy, adapts to each answer and targets gaps.</p>
        <ol class="voice-steps"><li>Copy the complete prompt.</li><li>Paste it into a new ChatGPT conversation.</li><li>Start Voice and answer one question at a time.</li></ol>
        <div class="voice-prompt-actions"><button class="btn" type="button" data-voice-copy>Copy complete prompt</button>
          <span class="voice-copy-status small" data-voice-status role="status" aria-live="polite"></span></div>
        <details class="voice-prompt-preview" open><summary>Review the complete Day ${c.day} prompt</summary>
          <pre tabindex="0">${safe(prompt)}</pre></details>
      </div></section>`;
  }

  function copyFallback(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.className = "voice-copy-fallback";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    if (copied === false) throw new Error("Copy command was blocked");
  }

  function bindVoicePrompt(day, completion) {
    const main = document.querySelector("#main");
    const canQuery = main && typeof main.querySelector === "function";
    const jump = canQuery ? main.querySelector("[data-voice-jump]") : null;
    const card = canQuery ? main.querySelector("#voice-prompt") : null;
    if (jump && card) jump.onclick = () => {
      const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    };
    if (!completion.voicePromptUnlocked || !card) return;
    const button = card.querySelector("[data-voice-copy]");
    const status = card.querySelector("[data-voice-status]");
    if (!button || !status) return;
    button.onclick = async () => {
      const prompt = window.VoicePrompts ? VoicePrompts.build(day) : "";
      try {
        if (!prompt) throw new Error("Prompt unavailable");
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(prompt);
        else copyFallback(prompt);
        status.textContent = "Prompt copied to clipboard.";
      } catch (error) {
        status.textContent = "Copy was blocked. Select the prompt text manually.";
      }
      window.setTimeout(() => { if (status) status.textContent = ""; }, 3200);
    };
  }

  function summaryHTML(day) {
    const c = byDay(day);
    if (!c) return "";
    const total = allCardsFor(c.day).length;
    return `<section class="daily-summary card">
      <div class="daily-summary-copy"><span class="eyebrow">CONNECTED DAY ${c.day}</span>
        <h2>Complete the whole clinical circuit</h2>
        <p>Every card-bearing source contributes its complete cloze bank; the Crisis Room remains a core station without rote case cards.</p></div>
      <div class="daily-summary-progress"><b>${progress(c)}/5</b><span>core stations closed · pacing ${pacingScore(c.day)}%</span></div>
      <a class="btn" href="#/day/${c.day}">${total} connected cards ${typeof IC === "function" ? IC("chevR") : "→"}</a>
    </section>`;
  }

  function renderHub(day) {
    const c = byDay(day);
    if (!c) { location.hash = "#/plan"; return; }
    const info = window.CURRICULUM && window.CURRICULUM[c.day - 1];
    const lessons = (window.ALL_LESSONS || []).filter(lesson => lesson.day === c.day);
    const done = typeof doneLessons === "function" ? doneLessons() : {};
    const lessonRows = lessons.map((lesson, index) => {
      const count = sourceCards("lesson", lesson.id).length;
      return `<div class="circuit-lesson ${done[lesson.id] ? "done" : ""}">
        <a href="#/lesson/${encodeURIComponent(lesson.id)}"><span>${done[lesson.id] ? "✓" : "0" + (index + 1)}</span><div><b>${safe(lesson.title)}</b><small>${lesson.minutes || 0} min · ${lesson.chunks.length} chunks · ${count} cards</small></div><i>→</i></a>
        <a class="btn sm secondary" href="${sourceDeck("lesson", lesson.id)}">Study ${count}</a></div>`;
    }).join("");

    const coreKeys = new Set(coreTypes.map(type => {
      const source = coreSource(c, type);
      return source ? source.type + ":" + source.id : "";
    }));
    const stations = coreTypes.map(type => {
      const item = coreItem(c, type), source = coreSource(c, type);
      if (!item || !source) return "";
      const count = sourceCards(type, item.id).length;
      const doneNow = componentDone(c, type);
      return `<article class="circuit-station ${type} ${doneNow ? "done" : ""}">
        <div class="station-kicker">${typeof IC === "function" ? IC(typeIcon[type]) : ""}<span>${safe(typeLabel[type])}</span>${doneNow ? "<b>Complete</b>" : ""}</div>
        <h3>${safe(item.title)}</h3><p>${safe(item.focus)}</p>
        <div class="station-actions">${sourceAction(type, item.id, source.route, "Open session", "browse")}
          ${count ? sourceAction(type, item.id, sourceDeck(type, item.id), count + " linked cards", "full-deck") : ""}</div>
      </article>`;
    }).join("");

    const additionalByKey = new Map();
    sourcesForDay(c.day).concat(crisisSourcesForDay(c.day)).forEach(source => {
      const key = source.type + ":" + source.id;
      if (source.type !== "lesson" && !coreKeys.has(key)) additionalByKey.set(key, source);
    });
    const additional = Array.from(additionalByKey.values());
    const additionalHTML = additional.length ? `<section class="circuit-stations connected-modules">
      <div class="section-title"><span>03</span><div><h2>Additional connected learning</h2><p>Every scheduled lab, exercise, operation, imaging module and crisis remains connected to this day; only card-bearing sources join the retrieval union.</p></div></div>
      <div class="station-grid">${additional.map(source => {
        const count = sourceCards(source.type, source.id).length;
        return `<article class="circuit-station ${source.type}"><div class="station-kicker">${typeof IC === "function" ? IC(typeIcon[source.type] || "cards") : ""}<span>${safe(typeLabel[source.type] || source.type)}</span></div>
          <h3>${safe(source.title)}</h3><p>${source.type === "crisis" ? "Branching emergency simulation · no flashcards" : count + " source-grounded cloze cards"}</p><div class="station-actions">
          ${sourceAction(source.type, source.id, source.route, "Open module", "browse")}${count ? sourceAction(source.type, source.id, sourceDeck(source.type, source.id), "Study all " + count, "full-deck") : ""}</div></article>`;
      }).join("")}</div></section>` : "";

    const total = allCardsFor(c.day).length;
    const completion = completionState(c);
    const n = completion.core.completed;
    document.querySelector("#main").innerHTML = `
      <div class="daily-hero"><div><a class="small muted" href="#/plan">← 14-Day Plan</a><span class="eyebrow">DAY ${c.day} · CONNECTED CIRCUIT</span>
        <h1>${safe(info ? info.theme : "Day " + c.day)}</h1><p>${safe(info ? info.tagline : "")}</p></div>
        <div class="daily-score"><strong>${n}/5</strong><span>core stations closed<br>Required-day pacing ${pacingScore(c.day)}%</span>
          ${completion.voicePromptUnlocked ? `<button class="voice-unlocked-jump" type="button" data-voice-jump>${typeof IC === "function" ? IC("grad") : ""} Voice prompt unlocked</button>` : ""}</div></div>
      <div class="circuit-layout"><section class="circuit-lessons card"><div class="section-title"><span>01</span><div><h2>Build the mechanism</h2><p>Each lesson's full card bank is included in the connected total.</p></div></div>${lessonRows}</section>
      <section class="circuit-stations"><div class="section-title"><span>02</span><div><h2>Close the clinical loop</h2><p>The five core stations retain their own progress; card-bearing stations use complete source decks.</p></div></div><div class="station-grid">${stations}</div></section></div>
      ${additionalHTML}
      <section class="circuit-deck card"><div><span class="eyebrow">COMPLETE RETRIEVAL UNION</span><h2>All Day ${c.day} connected cards</h2>
        <p>${total} unique cards from ${sourcesForDay(c.day).length} connected learning items. No daily maximum is applied.</p></div>
        <a class="btn" href="#/cards/day/${c.day}/all">Run all ${total} cards</a></section>
      ${voicePromptHTML(c, completion)}`;
    bindVoicePrompt(c.day, completion);
  }

  function bridgeHTML(type, id) {
    const source = window.CardCatalog && CardCatalog.source(type, id);
    if (!source || !source.linkedDays.length) return "";
    const count = sourceCards(type, id).length;
    return source.linkedDays.map(day => {
      const c = byDay(day);
      const item = coreItem(c, type);
      const focus = item && item.id === id ? item.focus : "This complete source deck is included in the day's connected retrieval union.";
      return `<div class="daily-bridge"><span class="eyebrow">DAY ${day} CONNECTION</span><p>${safe(focus)}</p>
        <a class="btn sm secondary" href="${sourceDeck(type, id)}">${count} source cards</a><a class="btn sm secondary" href="#/day/${day}">Day ${day} circuit</a></div>`;
    }).join("");
  }

  function typesForDay(day) {
    const present = new Set(allCardsFor(day).map(card => card.source.type));
    return (window.CardCatalog ? CardCatalog.types : coreTypes).filter(type => present.has(type));
  }

  window.Daily = {
    get: byDay, cardsFor: cardsFor, allCardsFor: allCardsFor, sourceCards: sourceCards,
    sourcesForDay: sourcesForDay, typesForDay: typesForDay, summaryHTML: summaryHTML, bridgeHTML: bridgeHTML,
    completion: completionState,
    render(parts) {
      const day = +parts[1];
      if (parts[2] === "case") {
        const crisis = crisisForDay(day);
        location.hash = crisis ? "#/crisis/" + encodeURIComponent(crisis.id) : "#/crisis";
      } else renderHub(day);
    },
    cardIds(day, type) { return cardsFor(day, type).map(card => card.id); },
    types: window.CardCatalog ? CardCatalog.types.slice() : coreTypes.slice(), typeLabel: typeLabel
  };
})();
