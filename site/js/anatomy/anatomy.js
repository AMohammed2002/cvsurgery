/* ============================================================================
   CardiacSchool — STANDALONE ANATOMY ENGINE
   Renders the Anatomy Review hub + region pages (#/anatomy, #/anatomy/<id>)
   and the Anatomy Flashcards deck (#/anat-cards…) with full spaced repetition
   in an ISOLATED localStorage namespace (st_anat_*). It reuses only the PURE
   global helpers from app.js — schedule(), blankCard(), esc(), shuffle(),
   Store, IC — and never calls addXP / bumpStreak / bumpDaily / checkAchievements,
   so anatomy activity has zero effect on the 14-day plan or its gamification.
   ============================================================================ */
(function () {
  "use strict";
  if (!window.ANATOMY) return; // data missing → stay fully inert, host app unaffected

  const A = window.ANATOMY;
  const SUBTYPES = {
    structures: { label: "Structures & relations", pill: "cyan" },
    arterial:   { label: "Arterial supply",        pill: "red" },
    venous:     { label: "Venous drainage",        pill: "violet" },
    lymphatic:  { label: "Lymphatic drainage",     pill: "green" },
    nerves:     { label: "Innervation",            pill: "amber" },
    surgical:   { label: "Surgical landmark",      pill: "cyan" }
  };
  /* ---------- shared SRS store ---------- */
  function srs() { return Store.get("srs", {}); }
  function saveSrs(d) { Store.set("srs", d); }
  function stateOf(id) { const c = srs()[id]; return c ? Object.assign(blankCard(), c) : null; }
  function dueCards(pool) { const s = srs(), now = Date.now(); return pool.filter(c => s[c.id] && s[c.id].due <= now); }
  function newCards(pool) { const s = srs(); return pool.filter(c => !s[c.id]); }
  function weakCards(pool) { const s = srs(); return pool.filter(c => s[c.id] && (s[c.id].lapses > 0 || s[c.id].st === "rel")); }

  function rate(card, r) {
    const s = srs();
    s[card.id] = schedule(stateOf(card.id) || blankCard(), r, Date.now());
    saveSrs(s);
    Store.set("revCount", Store.get("revCount", 0) + 1);
    if (typeof bumpDaily === "function") bumpDaily("rev");
    if (typeof logActivity === "function") logActivity();
    return s[card.id].due <= Date.now() + 15 * 60000; // requeue this session?
  }
  function ivlPreview(card, r) {
    const c = schedule(stateOf(card.id) || blankCard(), r, Date.now());
    const delta = c.due - Date.now();
    if (delta < 55 * 60000) return Math.max(1, Math.round(delta / 60000)) + " min";
    if (delta < 86400000 * 1.4) return "1 d";
    const d = Math.round(delta / 86400000);
    return d < 30 ? d + " d" : (d / 30).toFixed(1) + " mo";
  }

  /* ---------- cloze rendering ---------- */
  // Syntax: {{c1::answer}} or {{c1::answer::hint}}. ALL deletions on a card are
  // hidden on the front and revealed on the back (single occlusion per object).
  const CLOZE = /\{\{c\d+::(.+?)(?:::(.+?))?\}\}/g;
  function clozeFront(t) { return String(t).replace(CLOZE, (_, ans, hint) => `<span class="cloze-blank">[${hint ? esc(hint) : "&hellip;"}]</span>`); }
  function clozeBack(t) { return String(t).replace(CLOZE, (_, ans) => `<span class="cloze-fill">${ans}</span>`); }

  /* ---------- helpers ---------- */
  const CAT_ACCENT = { coronary: "accent-coral", chambers: "accent-cyan", valves: "accent-violet", conduction: "accent-amber", vessels: "accent-teal", operative: "accent-coral" };
  const $m = () => document.querySelector("#main");
  function regionsIn(cat) { return A.regions.filter(r => r.category === cat); }
  function cardsForRegion(id) { return A.cards.filter(c => c.region === id); }
  function cardsForCategory(cat) { return A.cards.filter(c => c.category === cat); }
  function completedRegions() { return Store.get("anatomy_done", {}); }
  function regionComplete(id) { return !!completedRegions()[id]; }
  function enabledCards(pool) { return pool.filter(card => regionComplete(card.region)); }
  function setRegionComplete(id, complete) {
    const state = completedRegions();
    if (complete) state[id] = Date.now();
    else delete state[id];
    Store.set("anatomy_done", state);
  }
  function resolveDiagram(key) {
    if (!key) return "";
    const [ns, name] = String(key).split(".");
    const lib = ns === "DG" ? window.DG : window.ADG;
    return (lib && lib[name]) || "";
  }
  function figureSlot(targetId, anchor, phase) {
    return window.Figures && typeof window.Figures.slot === "function"
      ? (window.Figures.slot("anatomy", targetId, anchor, phase || "content") || "")
      : "";
  }
  function pacingAccess(id, purpose) {
    const p = window.Pacing;
    if (!p || typeof p.canAccessSource !== "function") return { allowed: true };
    try {
      const result = p.canAccessSource("anatomy", id, purpose || "browse");
      if (result === false) return { allowed: false };
      if (result && typeof result === "object" && result.allowed === false) return result;
      return { allowed: true };
    } catch (_) {
      return { allowed: true };
    }
  }
  function pacingAttr(value) { return esc(value).replace(/"/g, "&quot;"); }
  function sourceAllowed(id, purpose) { return pacingAccess(id, purpose).allowed !== false; }
  function pacingLockReason(id, purpose, access) {
    if (access && typeof access.reason === "string" && access.reason) return access.reason;
    const p = window.Pacing;
    if (p && typeof p.lockReason === "function") {
      try {
        const reason = p.lockReason("anatomy", id, purpose || "browse");
        if (typeof reason === "string" && reason) return reason;
      } catch (_) {}
    }
    return "This anatomy region is temporarily locked while you complete your active catch-up day.";
  }
  function renderPacingLock(id, label, purpose, backHash) {
    const access = pacingAccess(id, purpose);
    if (access.allowed !== false) return false;
    const reason = pacingLockReason(id, purpose, access);
    $m().innerHTML = `<div class="card empty pacing-lock-screen" role="alert" tabindex="-1" data-pacing-lock>
      <div class="lock-mark">${IC("lock")}</div><h1>${esc(label || "Anatomy locked")}</h1>
      <p class="muted">${esc(reason)}</p>
      <a class="btn" href="#/">Return to Today</a>
      <a class="btn secondary" href="${pacingAttr(backHash || "#/anatomy")}">Back to anatomy</a></div>`;
    const panel = $m().querySelector("[data-pacing-lock]");
    if (panel) panel.focus();
    return true;
  }
  function renderCompletionHandoff(label) {
    $m().innerHTML = `<div class="card center celebrate finale" role="status" tabindex="-1" data-completion-handoff>
      <div class="finale-ico">${IC("check")}</div><h1>Article complete</h1>
      <p class="muted">${esc(label)} has been credited. Your recovery circuit has advanced.</p>
      <div class="mt action-row"><a class="btn" href="#/">Continue on Today</a>
      <a class="btn secondary" href="#/anatomy">All anatomy regions</a></div></div>`;
    const panel = $m().querySelector("[data-completion-handoff]");
    if (panel) panel.focus();
  }
  function cardSource(card) {
    if (card && card.source && typeof card.source === "object" && card.source.id) {
      return { type: card.source.type || "anatomy", id: card.source.id };
    }
    if (card && card.sourceType && card.sourceId) return { type: card.sourceType, id: card.sourceId };
    return card && card.region ? { type: "anatomy", id: card.region } : null;
  }
  function fallbackCardAllowed(card, mode) {
    const source = cardSource(card);
    if (!source || source.type !== "anatomy") return true;
    if (sourceAllowed(source.id, mode === "review" ? "review" : "full-deck")) return true;
    if (mode !== "review") return false;
    const state = srs()[card.id];
    return !!(state && (state.st === "rel" || state.due <= Date.now()));
  }
  function pacingCards(cards, mode) {
    const pool = Array.isArray(cards) ? cards : [];
    const p = window.Pacing;
    if (!p) return pool;
    if (typeof p.filterCards === "function") {
      try {
        const filtered = p.filterCards(pool, mode);
        if (Array.isArray(filtered)) return filtered;
      } catch (_) {}
    }
    return pool.filter(card => fallbackCardAllowed(card, mode));
  }

  /* ============================== REVIEW HUB ============================== */
  function renderHub() {
    const totalCards = A.cards.length, totalRegions = A.regions.length;
    const completeN = A.regions.filter(region => regionComplete(region.id)).length;
    let html = `<div class="page-head"><div>
      <h1>Anatomy Review</h1>
      <p>Surgical anatomy by region — complete an article to add its cards to the shared retrieval scheduler.</p></div>
      <a class="btn" href="#/anat-cards">${IC("cards")} Anatomy flashcards</a></div>`;

    html += `<div class="anat-stats card"><div class="stat"><div class="v" data-count="${totalRegions}">0</div><div class="l">Regions</div></div>
      <div class="stat"><div class="v" data-count="${totalCards}">0</div><div class="l">Cloze cards</div></div>
      <div class="stat"><div class="v" data-count="${completeN}">0</div><div class="l">Articles complete</div></div></div>`;

    A.categories.forEach(cat => {
      const regs = regionsIn(cat.id);
      if (!regs.length) return;
      html += `<section class="anat-cat ${CAT_ACCENT[cat.id] || ""}">
        <div class="anat-cat-head"><h2>${esc(cat.title)}</h2><p class="muted small">${esc(cat.blurb)}</p></div>
        <div class="anat-grid">` +
        regs.map(r => {
          const access = pacingAccess(r.id, "browse");
          if (access.allowed === false) {
            const reason = pacingLockReason(r.id, "browse", access);
            return `<div class="anat-region-card pacing-locked-card locked" role="link" aria-disabled="true" tabindex="-1" title="${pacingAttr(reason)}">
              <div class="arc-title">${esc(r.title)} <span class="pill amber">${IC("lock")} Catch-up lock</span></div>
              <div class="arc-sub muted small">${esc(r.short || "")}</div>
              <div class="arc-foot small">${esc(reason)}</div>
            </div>`;
          }
          return `<a class="anat-region-card${regionComplete(r.id) ? " complete" : ""}" href="#/anatomy/${encodeURIComponent(r.id)}">
              <div class="arc-title">${esc(r.title)}${regionComplete(r.id) ? ` <span class="pill solid-green">${IC("check")} complete</span>` : ""}</div>
              <div class="arc-sub muted small">${esc(r.short || "")}</div>
              <div class="arc-foot small">${cardsForRegion(r.id).length} cards ${IC("chevR")}</div>
            </a>`;
        }).join("") +
        `</div></section>`;
    });
    if (!totalRegions) html += `<div class="card empty">${IC("book")}<h2>No anatomy content loaded yet</h2><p class="muted">Region files have not been added.</p></div>`;
    $m().innerHTML = html;
    if (typeof countUpAll === "function") countUpAll();
  }

  function renderRegion(id) {
    const r = A.regions.find(x => x.id === id);
    if (!r) { location.hash = "#/anatomy"; return; }
    if (renderPacingLock(r.id, r.title, "browse", "#/anatomy")) return;
    const cat = A.categories.find(c => c.id === r.category);
    const dia = resolveDiagram(r.diagram);
    const cardN = cardsForRegion(r.id).length;
    const sections = r.sections || [];
    const complete = regionComplete(r.id);

    let html = `<div class="anat-page ${CAT_ACCENT[r.category] || ""}">
      <div class="feature-hero anat-hero">
        <div class="fh-body">
          <a class="fh-back" href="#/anatomy">${IC("chevL")} Anatomy review</a>
          <span class="eyebrow">${cat ? esc(cat.title) : "Surgical anatomy"}</span>
          <h1>${esc(r.title)}</h1>
          ${r.blurb ? `<p class="fh-sub">${r.blurb}</p>` : ""}
          <div class="fh-meta">
            ${sections.length ? `<span class="pill">${sections.length} section${sections.length === 1 ? "" : "s"}</span>` : ""}
            ${cardN ? `<span class="pill cyan">${IC("cards")} ${cardN} cloze cards</span>` : ""}
            ${complete ? `<span class="pill solid-green">${IC("check")} article complete</span>` : ""}
          </div>
        </div>
        ${dia ? `<div class="fh-side"><div class="anat-hero-dia">${dia}</div></div>` : ""}
      </div>`;

    if (window.Daily) html += Daily.bridgeHTML("anatomy", r.id);
    html += figureSlot(r.id, "overview", "content");

    // TOC scrolls via JS: a real #sec-N href would be swallowed by the hash router.
    if (sections.length > 1) {
      html += `<div class="chip-row anat-toc" aria-label="On this page">` +
        sections.map((s, i) => `<button class="chip" type="button" data-goto="sec-${i + 1}">${esc(s.heading)}</button>`).join("") + `</div>`;
    }

    sections.forEach((s, index) => {
      const anchor = s.partId || s.id || "section:" + String(index + 1).padStart(2, "0");
      html += `<section class="anat-section card" id="sec-${index + 1}">
        <div class="section-title"><span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <div><h2>${esc(s.heading)}</h2></div></div>
        <div class="anat-prose">${s.html}</div>${figureSlot(r.id, anchor, "content")}</section>`;
    });

    if (r.pearls && r.pearls.length) {
      html += `<div class="kbox pearl"><span class="kbox-tag">Surgical pearls</span><ul>` +
        r.pearls.map(p => `<li>${p}</li>`).join("") + `</ul></div>`;
    }
    html += `<div class="daily-bridge region-cta">
      <p><b>${complete ? "Article complete." : "Finished reading?"}</b> ${complete
        ? `${cardN} cloze card${cardN === 1 ? "" : "s"} from this region are now active in your flashcard decks.`
        : `Mark this article complete to activate its ${cardN} cloze card${cardN === 1 ? "" : "s"}.`}</p>
      <button class="btn${complete ? " secondary" : ""}" type="button" data-anatomy-complete aria-pressed="${complete}">${complete ? `${IC("check")} Mark incomplete` : `${IC("check")} Mark article complete`}</button>
      <button class="btn" data-drill="${esc(r.id)}"${cardN && complete ? "" : " disabled"}>${IC("cards")} Drill this region</button>
      <a class="btn secondary" href="#/anatomy">All regions</a></div></div>`;
    $m().innerHTML = html;
    const completeButton = $m().querySelector("[data-anatomy-complete]");
    if (completeButton) completeButton.onclick = () => {
      if (renderPacingLock(r.id, r.title, "browse", "#/anatomy")) return;
      setRegionComplete(r.id, !complete);
      if (typeof renderNav === "function") renderNav();
      if (typeof toast === "function") toast(complete ? "Anatomy cards removed from review" : `${cardN} anatomy cards added to review`);
      if (!complete && !sourceAllowed(r.id, "browse")) { renderCompletionHandoff(r.title); return; }
      renderRegion(r.id);
    };
    const drill = $m().querySelector("[data-drill]");
    if (drill && cardN && complete) drill.onclick = () => {
      if (renderPacingLock(r.id, r.title + " flashcards", "full-deck", "#/anatomy")) return;
      startSession({ kind: "region", id: r.id, label: r.title });
    };
    $m().querySelectorAll("[data-goto]").forEach(b => b.onclick = () => {
      const target = document.getElementById(b.dataset.goto);
      if (target) target.scrollIntoView({ behavior: window.prefersReducedMotion && window.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    });
  }

  /* ============================ FLASHCARD DECK ============================ */
  function renderCardsMenu() {
    const enabled = enabledCards(A.cards);
    const all = pacingCards(enabled, "review");
    let html = `<div class="page-head"><div>
        <h1>Anatomy Flashcards</h1>
        <p>Only cards from anatomy articles you have marked complete appear here and in the shared scheduler.</p></div>
        <a class="btn secondary" href="#/anatomy">${IC("book")} Anatomy review</a></div>`;

    const due = dueCards(all).length, fresh = newCards(all).length, weak = weakCards(all).length;
    html += `<div class="anat-stats card">
      <div class="stat"><div class="v" data-count="${all.length}">0</div><div class="l">Total</div></div>
      <div class="stat"><div class="v" data-count="${due}">0</div><div class="l">Due now</div></div>
      <div class="stat"><div class="v" data-count="${fresh}">0</div><div class="l">New</div></div>
      <div class="stat"><div class="v" data-count="${weak}">0</div><div class="l">Lapsed</div></div></div>`;

    html += `<div class="anat-deck-actions">
      <button class="btn" data-study="all"${all.length ? "" : " disabled"}>${IC("zap")} Study all due + new</button>
      ${weak ? `<button class="btn secondary" data-study="weak">${IC("target")} Drill lapsed cards</button>` : ""}
    </div>`;

    if (!all.length) html += enabled.length
      ? `<div class="card empty pacing-locked-card" role="status">${IC("lock")}<h2>No anatomy cards available right now</h2><p class="muted">Complete your active catch-up day to reopen new cards from locked regions.</p></div>`
      : `<div class="card empty">${IC("lock")}<h2>No anatomy cards active</h2><p class="muted">Open an anatomy article and mark it complete to add that region's cards.</p></div>`;

    html += `<h2 class="anat-h2">By category</h2>`;
    A.categories.forEach(cat => {
      const pool = pacingCards(enabledCards(cardsForCategory(cat.id)), "full-deck");
      if (!pool.length) return;
      const cdue = dueCards(pool).length, cnew = newCards(pool).length;
      html += `<button class="anat-deck-row" data-study="cat:${cat.id}">
          <div><div class="adr-title">${esc(cat.title)}</div><div class="muted small">${pool.length} cards</div></div>
          <div class="adr-meta small">${cdue} due · ${cnew} new ${IC("chevR")}</div>
        </button>`;
    });
    $m().innerHTML = html;
    if (typeof countUpAll === "function") countUpAll();
    $m().querySelectorAll("[data-study]").forEach(b => b.onclick = () => {
      const v = b.dataset.study;
      if (v === "all") startSession({ kind: "all", label: "All anatomy" });
      else if (v === "weak") startSession({ kind: "weak", label: "Lapsed cards" });
      else if (v.startsWith("cat:")) { const id = v.slice(4); const c = A.categories.find(x => x.id === id); startSession({ kind: "cat", id, label: c ? c.title : id }); }
    });
  }

  /* ---------- session ---------- */
  const S = { queue: [], i: 0, flipped: false, done: 0, again: 0, label: "", mode: "review", spec: null };
  function poolFor(f) {
    let pool;
    if (f.kind === "region") pool = enabledCards(cardsForRegion(f.id));
    else if (f.kind === "cat") pool = enabledCards(cardsForCategory(f.id));
    else if (f.kind === "weak") pool = weakCards(enabledCards(A.cards));
    else pool = enabledCards(A.cards);
    return pacingCards(pool, (f.kind === "all" || f.kind === "weak") ? "review" : "full-deck");
  }
  function startSession(f) {
    if (f.kind === "region") {
      const region = A.regions.find(r => r.id === f.id);
      if (region && renderPacingLock(region.id, region.title + " flashcards", "full-deck", "#/anat-cards")) return;
    }
    const pool = poolFor(f);
    const due = shuffle(dueCards(pool));
    const fresh = (f.kind === "weak") ? [] : shuffle(newCards(pool));
    let queue = due.concat(fresh);
    if (!queue.length && (f.kind === "region" || f.kind === "cat")) queue = shuffle(pool); // let user browse on demand
    S.queue = queue; S.i = 0; S.flipped = false; S.done = 0; S.again = 0; S.label = f.label;
    S.mode = (f.kind === "all" || f.kind === "weak") ? "review" : "full-deck";
    S.spec = Object.assign({}, f);
    if (location.hash !== "#/anat-cards/study") { location.hash = "#/anat-cards/study"; }
    else renderSession();
  }
  function revalidateCardTail() {
    if (!S.queue.length || S.flipped) return;
    const completed = S.queue.slice(0, S.i);
    S.queue = completed.concat(pacingCards(S.queue.slice(S.i), S.mode));
  }
  function renderSession() {
    if (S.spec && S.spec.kind === "region" && !S.flipped) {
      const region = A.regions.find(r => r.id === S.spec.id);
      if (region && renderPacingLock(region.id, region.title + " flashcards", "full-deck", "#/anat-cards")) return;
    }
    revalidateCardTail();
    if (!S.queue.length) { location.hash = "#/anat-cards"; return; }
    if (S.i >= S.queue.length) {
      $m().innerHTML = `<div class="card center celebrate finale">
        <div class="finale-ico">${IC("cards")}</div><h1>Session complete</h1>
        <p class="muted">${S.done} card${S.done === 1 ? "" : "s"} reviewed${S.again ? `, ${S.again} still in learning (back in minutes)` : ""}.</p>
        <div class="mt action-row">
          <a class="btn" href="#/anat-cards">Anatomy deck</a>
          <a class="btn secondary" href="#/anatomy">Review</a></div></div>`;
      return;
    }
    const c = S.queue[S.i];
    const reg = A.regions.find(r => r.id === c.region);
    const st = SUBTYPES[c.subtype] || { label: c.subtype || "", pill: "cyan" };
    $m().innerHTML = `
      <div class="player-top">
        <a class="btn sm secondary" href="#/anat-cards">${IC("chevL")} Exit</a>
        <div class="bar"><span style="width:${Math.round(100 * S.i / S.queue.length)}%"></span></div>
        <span class="small muted tabular">${S.i + 1}/${S.queue.length}</span>
      </div>
      <div class="fc-count"><span class="pill ${st.pill}">${esc(st.label)}</span><span>${reg ? esc(reg.title) : ""}</span></div>
      <div class="fc-stage">
        <div class="fc-card ${S.flipped ? "flipped" : ""}" id="anat-fc" role="button" tabindex="0" aria-label="Flashcard — press to flip">
          <div class="fc-face"><span class="fc-topic pill cyan">Cloze</span><div class="cloze-text">${clozeFront(c.text)}</div><div class="small muted" style="font-weight:500">tap / space to flip</div></div>
          <div class="fc-face back"><span class="fc-topic pill green">Answer</span><div class="cloze-text">${clozeBack(c.text)}</div></div>
        </div>
      </div>
      ${S.flipped ? `<div class="fc-rate">
        <button class="fc-again" data-q="0">Again<span class="ivl">${ivlPreview(c, 0)}</span></button>
        <button class="fc-hard" data-q="1">Hard<span class="ivl">${ivlPreview(c, 1)}</span></button>
        <button class="fc-good" data-q="2">Good<span class="ivl">${ivlPreview(c, 2)}</span></button>
        <button class="fc-easy" data-q="3">Easy<span class="ivl">${ivlPreview(c, 3)}</span></button>
      </div><p class="small muted center mt">1 · 2 · 3 · 4 also work. Honest grading keeps the scheduler accurate.</p>`
        : `<button class="btn" style="width:100%" id="anat-flip">Show answer</button>`}`;
    const flip = () => {
      if (!pacingCards([S.queue[S.i]], S.mode).length) {
        S.queue.splice(S.i, 1); S.flipped = false; renderSession(); return;
      }
      S.flipped = !S.flipped; renderSession();
    };
    $m().querySelector("#anat-fc").onclick = flip;
    const fb = $m().querySelector("#anat-flip"); if (fb) fb.onclick = flip;
    $m().querySelectorAll(".fc-rate button").forEach(b => b.onclick = () => rateAdvance(+b.dataset.q));
  }
  function rateAdvance(r) {
    if (!pacingCards([S.queue[S.i]], S.mode).length) {
      S.queue.splice(S.i, 1); S.flipped = false; renderSession(); return;
    }
    const requeue = rate(S.queue[S.i], r);
    S.done++;
    if (requeue) { S.again++; S.queue.push(S.queue[S.i]); }
    S.i++; S.flipped = false; renderSession();
  }
  document.addEventListener("keydown", e => {
    if (location.hash !== "#/anat-cards/study" || !S.queue.length || S.i >= S.queue.length) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!pacingCards([S.queue[S.i]], S.mode).length) {
        S.queue.splice(S.i, 1); S.flipped = false; renderSession(); return;
      }
      S.flipped = !S.flipped; renderSession();
    }
    if (S.flipped && ["1", "2", "3", "4"].includes(e.key)) rateAdvance(+e.key - 1);
  });

  /* ============================== ROUTER API ============================== */
  window.Anatomy = {
    render(parts) { // #/anatomy , #/anatomy/<regionId>
      if (parts[1]) renderRegion(parts[1]); else renderHub();
    },
    renderCards(parts) { // #/anat-cards , #/anat-cards/study
      if (parts[1] === "study") renderSession(); else renderCardsMenu();
    }
  };

  // Deep-link / refresh onto an anatomy route: app.js ran its initial route()
  // before this script loaded, so re-render now if we're already on one.
  if (/^#\/(anatomy|anat-cards)/.test(location.hash) && typeof route === "function") route();
})();
