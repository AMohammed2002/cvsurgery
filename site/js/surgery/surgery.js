/* ============================================================================
   CardiacSchool — STANDALONE "SURGERIES" ENGINE
   Renders the Surgeries hub (#/surgery), reading articles (#/surgery/<id>) and
   a per-scope MCQ runner. No flashcards in this module.

   Routes:
     #/surgery                       hub
     #/surgery/<sectionId>           reading article
     #/surgery/quiz                  all-surgeries MCQ quiz
     #/surgery/quiz/<categoryId>     category MCQ quiz
     #/surgery/quiz/s/<sectionId>    single-operation MCQ quiz

   State (read-tracking + quiz stats) lives in an ISOLATED namespace
   (st_surgery_*). Reuses only PURE globals from app.js — esc, shuffle, Store,
   IC — and never calls addXP / bumpStreak / bumpDaily / checkAchievements, nor
   touches window.QUESTIONS or the 14-day st_srs, so the 14-day plan is
   completely unaffected.
   ============================================================================ */
(function () {
  "use strict";
  if (!window.SURGERY) return; // data missing → inert, host app unaffected

  const SX = window.SURGERY;
  const PASS = 0.7;
  const $m = () => document.querySelector("#main");

  /* ---------- isolated store: reading + quiz ---------- */
  function readMap() { return Store.get("surgery_read", {}); }
  function qStats() { return Store.get("surgery_qstats", {}); }
  function quizBest() { return Store.get("surgery_quizbest", {}); }
  function isRead(id) { return !!readMap()[id]; }
  function toggleRead(id) {
    const m = readMap();
    const first = !m[id];
    if (m[id]) delete m[id]; else m[id] = Date.now();
    Store.set("surgery_read", m);
    if (first && typeof addXP === "function") addXP(50);
    if (first && typeof bumpStreak === "function") bumpStreak();
    if (first && typeof logActivity === "function") logActivity(2);
  }
  function recordQ(id, ok) {
    const s = qStats(); const p = s[id] || { seen: 0, ok: 0 };
    p.seen++; if (ok) p.ok++; s[id] = p; Store.set("surgery_qstats", s);
  }
  function recordQuiz(scopeKey, correct, total) {
    const b = quizBest(); const prev = b[scopeKey];
    const pct = Math.round(100 * correct / total);
    if (!prev || correct > prev.best) b[scopeKey] = { best: correct, total: total, pct: pct, ts: Date.now() };
    Store.set("surgery_quizbest", b);
  }

  /* ---------- isolated store: Order-the-Steps game best scores ---------- */
  function orderBest() { return Store.get("surgery_order", {}); }
  function recordOrder(id, correct, total, secs, passed) {
    const b = orderBest(); const prev = b[id];
    secs = Math.round(secs);
    if (!prev || correct > prev.best || (correct === prev.best && secs < prev.secs)) {
      b[id] = { best: correct, total: total, secs: secs, passed: !!passed || !!(prev && prev.passed), ts: Date.now() };
    } else if (passed && prev && !prev.passed) {
      prev.passed = true;
    }
    Store.set("surgery_order", b);
  }

  /* ---------- shared flashcard SRS ---------- */
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
    return s[card.id].due <= Date.now() + 15 * 60000;
  }
  function ivlPreview(card, r) {
    const c = schedule(stateOf(card.id) || blankCard(), r, Date.now());
    const delta = c.due - Date.now();
    if (delta < 55 * 60000) return Math.max(1, Math.round(delta / 60000)) + " min";
    if (delta < 86400000 * 1.4) return "1 d";
    const d = Math.round(delta / 86400000);
    return d < 30 ? d + " d" : (d / 30).toFixed(1) + " mo";
  }

  /* ---------- cloze rendering (surgery-namespaced classes) ---------- */
  const CLOZE = /\{\{c\d+::(.+?)(?:::(.+?))?\}\}/g;
  function clozeFront(t) { return String(t).replace(CLOZE, (_, ans, hint) => `<span class="sx-clz-blank">[${hint ? esc(hint) : "&hellip;"}]</span>`); }
  function clozeBack(t) { return String(t).replace(CLOZE, (_, ans) => `<span class="sx-clz-fill">${esc(ans)}</span>`); }

  /* ---------- helpers ---------- */
  function sectionById(id) { return SX.sections.find(s => s.id === id); }
  function sectionsIn(cat) { return SX.sections.filter(s => s.category === cat); }
  function nextInCat(s) { const l = sectionsIn(s.category); const i = l.findIndex(x => x.id === s.id); return i >= 0 && i < l.length - 1 ? l[i + 1] : null; }
  function figureSlot(targetId, anchor, phase) {
    return window.Figures && typeof window.Figures.slot === "function"
      ? (window.Figures.slot("surgery", targetId, anchor, phase || "content") || "")
      : "";
  }
  function figureEscape(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  }
  function sectionFigures(block) {
    if (!Array.isArray(block.figures)) return "";
    return block.figures.map(figure => `<figure class="sx-figure">
      <button type="button" class="sx-figure-open" data-sx-figure="${figureEscape(figure.id)}" aria-label="View illustration at full size: ${figureEscape(figure.alt)}">
        <img src="${figureEscape(figure.src)}" alt="${figureEscape(figure.alt)}" width="${figureEscape(figure.width)}" height="${figureEscape(figure.height)}" loading="lazy" decoding="async">
        <span class="sx-figure-cue" aria-hidden="true">View full size</span>
      </button>
      <figcaption>${figureEscape(figure.caption)}</figcaption>
    </figure>`).join("");
  }
  function randomizedQuestion(q) {
    const options = q.options.map((text, index) => ({ text, correct: index === q.answer }));
    const mixed = shuffle(options);
    return Object.assign({}, q, { options: mixed.map(x => x.text), answer: mixed.findIndex(x => x.correct) });
  }
  function pacingAccess(id, purpose) {
    const p = window.Pacing;
    if (!p || typeof p.canAccessSource !== "function") return { allowed: true };
    try {
      const result = p.canAccessSource("surgery", id, purpose || "browse");
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
        const reason = p.lockReason("surgery", id, purpose || "browse");
        if (typeof reason === "string" && reason) return reason;
      } catch (_) {}
    }
    return "This operation is temporarily locked while you complete your active catch-up day.";
  }
  function renderPacingLock(id, label, purpose, backHash) {
    const access = pacingAccess(id, purpose);
    if (access.allowed !== false) return false;
    const reason = pacingLockReason(id, purpose, access);
    $m().innerHTML = `<div class="card empty pacing-lock-screen" role="alert" tabindex="-1" data-pacing-lock>
      <div class="lock-mark">${IC("lock")}</div><h1>${esc(label || "Operation locked")}</h1>
      <p class="muted">${esc(reason)}</p>
      <a class="btn" href="#/">Return to Today</a>
      <a class="btn secondary" href="${pacingAttr(backHash || "#/surgery")}">Back to surgeries</a></div>`;
    const panel = $m().querySelector("[data-pacing-lock]");
    if (panel) panel.focus();
    return true;
  }
  function renderCompletionHandoff(label) {
    $m().innerHTML = `<div class="card center celebrate finale" role="status" tabindex="-1" data-completion-handoff>
      <div class="finale-ico">${IC("check")}</div><h1>Article complete</h1>
      <p class="muted">${esc(label)} has been credited. Your recovery circuit has advanced.</p>
      <div class="mt action-row"><a class="btn" href="#/">Continue on Today</a>
      <a class="btn secondary" href="#/surgery">All surgeries</a></div></div>`;
    const panel = $m().querySelector("[data-completion-handoff]");
    if (panel) panel.focus();
  }
  function cardSource(card) {
    if (card && card.source && typeof card.source === "object" && card.source.id) {
      return { type: card.source.type || "surgery", id: card.source.id };
    }
    if (card && card.sourceType && card.sourceId) return { type: card.sourceType, id: card.sourceId };
    return card && card.section ? { type: "surgery", id: card.section } : null;
  }
  function fallbackCardAllowed(card, mode) {
    const source = cardSource(card);
    if (!source || source.type !== "surgery") return true;
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
  function questionAllowed(q) { return !q || !q.section || sourceAllowed(q.section, "practice"); }
  function filterQuestions(pool) { return (pool || []).filter(questionAllowed); }
  function lockedSourceCard(className, title, body, reason) {
    return `<div class="${className} pacing-locked-card locked" role="link" aria-disabled="true" tabindex="-1" title="${pacingAttr(reason)}">
      <div class="${body.topClass}"><span class="${body.titleClass}">${esc(title)}</span><span class="pill amber">${IC("lock")} Catch-up lock</span></div>
      ${body.subtitle || ""}
      <div class="${body.footClass}">${esc(reason)}</div>
    </div>`;
  }

  /* ---- printable pocket card (B5.9): a one-pager of steps + dangers + pearls ---- */
  function extractKbox(blocks, cls) {
    const div = document.createElement("div"); const out = [];
    blocks.forEach(b => {
      div.innerHTML = b.html || "";
      div.querySelectorAll(".kbox." + cls).forEach(k => {
        const c = k.cloneNode(true); const tag = c.querySelector(".kbox-tag"); if (tag) tag.remove();
        let t = (c.textContent || "").replace(/\s+/g, " ").trim();
        if (t.length > 150) t = t.slice(0, 147) + "…";
        if (t) out.push(t);
      });
    });
    return out;
  }
  function printPocket(s) {
    const blocks = s.blocks || [];
    const steps = Array.isArray(s.steps) ? s.steps : [];
    const dangers = extractKbox(blocks, "danger").slice(0, 5);
    const pearls = extractKbox(blocks, "pearl").slice(0, 4);
    let h = "<h1>" + esc(s.title) + "</h1>";
    if (s.subtitle) h += '<div class="pk-sub">' + esc(s.subtitle) + "</div>";
    if (steps.length) h += "<h2>Operative steps</h2><ol>" + steps.map(x => "<li>" + esc(x) + "</li>").join("") + "</ol>";
    if (dangers.length || pearls.length) {
      h += '<div class="pk-cols">';
      if (dangers.length) h += "<h2>Danger structures &amp; pitfalls</h2><ul>" + dangers.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>";
      if (pearls.length) h += "<h2>Pearls</h2><ul>" + pearls.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>";
      h += "</div>";
    }
    h += '<div class="pk-foot">CardiacSchool · pocket card · ' + esc(s.title) + "</div>";
    let host = document.getElementById("pocket-print");
    if (!host) { host = document.createElement("div"); host.id = "pocket-print"; document.body.appendChild(host); }
    host.innerHTML = h;
    document.body.classList.add("printing-pocket");
    const done = () => { document.body.classList.remove("printing-pocket"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
    setTimeout(done, 800);
  }
  function questionsIn(cat) { return SX.questions.filter(q => q.category === cat); }
  function questionsForSection(id) { return SX.questions.filter(q => q.section === id); }
  function cardsIn(cat) { return (SX.cards || []).filter(c => c.category === cat); }
  function cardsForSection(id) { return (SX.cards || []).filter(c => c.section === id); }
  function readCount() { const ids = new Set(SX.sections.map(s => s.id)); return Object.keys(readMap()).filter(id => ids.has(id)).length; }

  /* ============================== HUB ============================== */
  function renderHub() {
    const totalQ = SX.questions.length, totalCards = (SX.cards || []).length;
    const reviewCards = pacingCards(SX.cards || [], "review");
    const due = dueCards(reviewCards).length, fresh = newCards(reviewCards).length;
    const best = quizBest().all;

    let html = `<div class="page-head"><div>
      <h1>Surgeries</h1>
      <p>The core adult cardiac operations, taught from the ground up for a mind wiped clean: each article
      re-derives the anatomy, physiology and pathophysiology, then walks the operation step by step and ramps
      to senior-resident / PGY-5 depth — with a per-operation MCQ self-test of every question you can get
      pimped on, plus a cloze flashcard deck. Every operation is connected to one or more daily circuits.</p></div></div>`;

    html += `<div class="sx-stats card">
      <div class="stat"><div class="v">${SX.sections.length}</div><div class="l">Operations</div></div>
      <div class="stat"><div class="v">${readCount()}</div><div class="l">Read</div></div>
      <div class="stat"><div class="v">${totalQ}</div><div class="l">MCQs</div></div>
      ${totalCards ? `<div class="stat"><div class="v">${totalCards}</div><div class="l">Flashcards</div></div>` : ""}
      <div class="stat"><div class="v">${best ? best.pct + "%" : "—"}</div><div class="l">Best score</div></div></div>`;

    const stepOps = sectionsWithSteps().length;
    html += `<div class="sx-cta-row">
      <div class="sx-cta card">
        <div class="sx-cta-txt"><h2>${IC("target")} Surgeries MCQs</h2>
          <p class="muted small">${totalQ} single-best-answer questions across every operation — the high-yield pimping favourites.</p></div>
        <button class="btn" id="sx-quiz-all"${totalQ ? "" : " disabled"}>Start all-surgeries quiz ${IC("chevR")}</button></div>
      ${stepOps ? `<div class="sx-cta card">
        <div class="sx-cta-txt"><h2>${IC("clock")} Order-the-Steps Challenge</h2>
          <p class="muted small">Rebuild ${stepOps} operations from scrambled steps against a 60-second clock — fast-recall drill.</p></div>
        <a class="btn" href="#/surgery/order">Beat the clock ${IC("chevR")}</a></div>` : ""}
      ${totalCards ? `<div class="sx-cta card">
        <div class="sx-cta-txt"><h2>${IC("cards")} Flashcards</h2>
          <p class="muted small">${totalCards} cloze cards with spaced repetition across the operations. ${due} due, ${fresh} new.</p></div>
        <a class="btn" href="#/surgery/cards">Open deck ${IC("chevR")}</a></div>` : ""}
    </div>`;

    SX.categories.forEach(cat => {
      const list = sectionsIn(cat.id);
      if (!list.length) return;
      html += `<section class="sx-cat">
        <div class="sx-cat-head"><div><h2>${esc(cat.title)}</h2><p class="muted small">${esc(cat.blurb)}</p></div></div>
        <div class="sx-grid">` +
        list.map(s => {
          const nq = questionsForSection(s.id).length, nc = cardsForSection(s.id).length;
          const access = pacingAccess(s.id, "browse");
          if (access.allowed === false) {
            return lockedSourceCard("sx-card", s.title, {
              topClass: "sc-top", titleClass: "sc-title",
              subtitle: s.subtitle ? `<div class="sc-sub muted small">${esc(s.subtitle)}</div>` : "",
              footClass: "sc-foot small"
            }, pacingLockReason(s.id, "browse", access));
          }
          return `<a class="sx-card${isRead(s.id) ? " read" : ""}" href="#/surgery/${encodeURIComponent(s.id)}">
            <div class="sc-top"><span class="sc-title">${esc(s.title)}</span>${isRead(s.id) ? `<span class="sc-check">${IC("check")}</span>` : ""}</div>
            ${s.subtitle ? `<div class="sc-sub muted small">${esc(s.subtitle)}</div>` : ""}
            <div class="sc-foot small">${(s.blocks || []).length} topics · ${nq} MCQs${nc ? " · " + nc + " cards" : ""} ${IC("chevR")}</div>
          </a>`;
        }).join("") +
        `</div></section>`;
    });

    if (!SX.sections.length) html += `<div class="card empty">${IC("book")}<h2>No surgery content loaded yet</h2><p class="muted">Operation article files have not been added.</p></div>`;
    $m().innerHTML = html;
    const ab = $m().querySelector("#sx-quiz-all");
    if (ab && totalQ) ab.onclick = () => { location.hash = "#/surgery/quiz"; };
  }

  /* ---------- cross-module SRS registration (Rounds reads due cards and grades
     via rate() above, so every write stays inside st_surgery_*) ---------- */
  if (typeof registerSrsModule === "function") registerSrsModule({
    id: "surgery", label: "Surgeries", icon: "scalpel", route: "#/surgery/cards",
    dueCards: () => dueCards(pacingCards(SX.cards || [], "review")),
    faces: c => {
      const sec = sectionById(c.section);
      return { front: `<div class="sx-clz-text">${clozeFront(c.text)}</div>`,
               back: `<div class="sx-clz-text">${clozeBack(c.text)}</div>`,
               topic: c.topic || "", sub: sec ? sec.title : "" };
    },
    ivl: ivlPreview,
    grade: rate
  });

  /* ============================== ARTICLE PAGE ============================== */
  function renderSection(id) {
    const s = sectionById(id);
    if (!s) { location.hash = "#/surgery"; return; }
    if (renderPacingLock(s.id, s.title, "browse", "#/surgery")) return;
    const cat = SX.categories.find(c => c.id === s.category);
    const blocks = s.blocks || [];
    const nq = questionsForSection(s.id).length, nc = cardsForSection(s.id).length;

    let html = `<div class="player-top">
        <a class="btn sm secondary" href="#/surgery">${IC("chevL")} Surgeries</a>
        <span class="small muted">${cat ? esc(cat.title) : ""}</span>
      </div>
      <div class="page-head"><div>
        <h1>${esc(s.title)}</h1>
        ${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}
        <div class="sx-meta">${s.readMins ? `<span class="pill cyan">${s.readMins} min read</span>` : ""}
          <span class="small muted">${blocks.length} topics</span>
          ${isRead(s.id) ? `<span class="pill green">Read</span>` : ""}
          ${window.Bridge ? Bridge.backlinkHTML("surgery", s.id) : ""}</div>
      </div></div>`;

    if (window.Daily) html += Daily.bridgeHTML("surgery", s.id);
    html += figureSlot(s.id, "overview", "content");

    if (blocks.length > 1) {
      html += `<nav class="sx-toc card"><div class="toc-h small muted">On this page</div><ol>` +
        blocks.map((b, i) => `<li><button type="button" data-sx-blk="${i}">${esc(b.title)}</button></li>`).join("") + `</ol></nav>`;
    }

    html += blocks.map((b, i) => {
      const anchor = b.partId || b.id || "block:" + String(i + 1).padStart(2, "0");
      return `<section class="sx-block" id="blk-${i}">
        <h2>${esc(b.title)}</h2>${b.html || ""}${sectionFigures(b)}${figureSlot(s.id, anchor, "content")}</section>`;
    }).join("");

    html += `<dialog class="sx-figure-dialog" aria-label="Expanded surgical illustration">
      <div class="sx-figure-dialog-bar"><button type="button" class="sx-figure-size">Actual size</button><button type="button" class="sx-figure-close" aria-label="Close illustration">Close</button></div>
      <div class="sx-figure-dialog-viewport"><img alt=""></div>
    </dialog>`;

    const next = nextInCat(s);
    html += `<div class="sx-foot article-funnel">
      <button class="btn ${isRead(s.id) ? "secondary" : ""}" id="sx-mark">${isRead(s.id) ? IC("refresh") + " Mark unread" : IC("check") + " Mark as read"}</button>
      ${nq ? `<a class="btn" href="#/surgery/quiz/s/${encodeURIComponent(s.id)}">${IC("target")} Quiz me on this (${nq})</a>` : ""}
      ${(Array.isArray(s.steps) && s.steps.length >= 2) ? `<a class="btn" href="#/surgery/order/${encodeURIComponent(s.id)}">${IC("clock")} Order the steps (${s.steps.length})</a>` : ""}
      ${nc ? `<a class="btn secondary" href="#/surgery/cards/s/${encodeURIComponent(s.id)}">${IC("cards")} Study these cards (${nc})</a>` : ""}
      ${(Array.isArray(s.steps) && s.steps.length) ? `<button class="btn secondary" id="sx-pocket">${IC("download")} Print pocket card</button>` : ""}
      ${next ? `<a class="btn secondary" href="#/surgery/${encodeURIComponent(next.id)}">Next in ${esc(cat ? cat.title : "category")} ${IC("chevR")}</a>` : `<a class="btn secondary" href="#/surgery">Back to surgeries</a>`}</div>`;

    $m().innerHTML = html;
    const figureDialog = $m().querySelector(".sx-figure-dialog");
    const figureImage = figureDialog.querySelector("img");
    const figureSize = figureDialog.querySelector(".sx-figure-size");
    const figures = new Map(blocks.flatMap(block => Array.isArray(block.figures) ? block.figures.map(figure => [figure.id, figure]) : []));
    let figureOpener = null;
    $m().querySelectorAll("[data-sx-figure]").forEach(button => button.onclick = () => {
      const figure = figures.get(button.dataset.sxFigure);
      if (!figure) return;
      figureOpener = button;
      figureImage.src = figure.src;
      figureImage.alt = figure.alt;
      figureDialog.classList.remove("sx-figure-actual");
      figureSize.textContent = "Actual size";
      figureDialog.showModal();
      figureDialog.querySelector(".sx-figure-close").focus();
    });
    figureSize.onclick = () => {
      const actual = figureDialog.classList.toggle("sx-figure-actual");
      figureSize.textContent = actual ? "Fit to screen" : "Actual size";
    };
    figureDialog.querySelector(".sx-figure-close").onclick = () => figureDialog.close();
    figureDialog.addEventListener("close", () => {
      figureImage.removeAttribute("src");
      if (figureOpener && figureOpener.isConnected) figureOpener.focus();
    });
    const mb = $m().querySelector("#sx-mark");
    if (mb) mb.onclick = () => {
      if (renderPacingLock(s.id, s.title, "browse", "#/surgery")) return;
      const completing = !isRead(s.id);
      toggleRead(s.id);
      if (completing && !sourceAllowed(s.id, "browse")) { renderCompletionHandoff(s.title); return; }
      renderSection(id);
    };
    const pk = $m().querySelector("#sx-pocket");
    if (pk) pk.onclick = () => printPocket(s);
    if (typeof trackArticleLocation === "function")
      trackArticleLocation("#/surgery/" + encodeURIComponent(s.id), s.title, ".sx-block");
    if (typeof installReadingProgress === "function") installReadingProgress(".sx-block", ".sx-toc");
    if (window.Notes) window.Notes.attach($m(), { module: "surgery", sectionId: s.id, sectionTitle: s.title, routeBase: "#/surgery/" + encodeURIComponent(s.id), blockSel: ".sx-block" });
    $m().querySelectorAll("[data-sx-blk]").forEach(button => button.onclick = () => {
      const target = $m().querySelector("#blk-" + button.dataset.sxBlk);
      if (target) target.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  /* ============================== MCQ RUNNER ============================== */
  const Q = { pool: null, scopeKey: null, label: null, i: 0, correct: 0, answered: null, sure: true };

  function startQuiz(scope) {
    let pool, scopeKey, label;
    if (scope.type === "section") {
      const s = sectionById(scope.id);
      if (!s) { location.hash = "#/surgery"; return; }
      if (renderPacingLock(s.id, s.title + " quiz", "practice", "#/surgery")) return;
      pool = questionsForSection(scope.id); scopeKey = "sec:" + scope.id;
      label = s.title;
    } else if (scope.type === "cat") {
      const cat = SX.categories.find(c => c.id === scope.id);
      if (!cat) { location.hash = "#/surgery"; return; }
      pool = questionsIn(scope.id); scopeKey = "cat:" + scope.id;
      label = cat.title;
    } else {
      pool = SX.questions.slice(); scopeKey = "all"; label = "All-surgeries";
    }
    const hadQuestions = pool.length > 0;
    pool = filterQuestions(pool);
    if (!pool.length && hadQuestions && window.Pacing) {
      $m().innerHTML = `<div class="card empty pacing-lock-screen" role="status" tabindex="-1" data-pacing-lock>
        <div class="lock-mark">${IC("lock")}</div><h1>No surgery questions available</h1>
        <p class="muted">Complete your active catch-up day to reopen questions from locked operations.</p>
        <a class="btn" href="#/">Return to Today</a>
        <a class="btn secondary" href="#/surgery">Back to surgeries</a></div>`;
      const panel = $m().querySelector("[data-pacing-lock]"); if (panel) panel.focus();
      return;
    }
    if (!pool.length) { location.hash = "#/surgery"; return; }
    Q.pool = shuffle(pool).map(randomizedQuestion); Q.scopeKey = scopeKey; Q.label = label; Q.scope = scope;
    Q.i = 0; Q.correct = 0; Q.answered = null; Q.sure = true;
    renderQuiz();
  }

  function revalidateQuizTail() {
    if (!Q.pool || Q.answered !== null) return;
    const completed = Q.pool.slice(0, Q.i);
    Q.pool = completed.concat(filterQuestions(Q.pool.slice(Q.i)));
  }
  function renderQuiz() {
    if (!Q.pool) { location.hash = "#/surgery"; return; }
    if (Q.scope && Q.scope.type === "section" && Q.answered === null) {
      const section = sectionById(Q.scope.id);
      if (section && renderPacingLock(section.id, section.title + " quiz", "practice", "#/surgery")) return;
    }
    revalidateQuizTail();
    const qs = Q.pool;
    if (!qs.length) {
      $m().innerHTML = `<div class="card empty pacing-lock-screen" role="status"><div class="lock-mark">${IC("lock")}</div><h1>No surgery questions available</h1>
        <p class="muted">Complete your active catch-up day to reopen this quiz.</p>
        <a class="btn" href="#/">Return to Today</a></div>`;
      return;
    }
    if (Q.i >= qs.length) {
      recordQuiz(Q.scopeKey, Q.correct, qs.length);
      const pct = Math.round(100 * Q.correct / qs.length), pass = Q.correct / qs.length >= PASS;
      $m().innerHTML = `<div class="card center celebrate finale">
        <div class="confetti">${pass ? "🫀" : "📊"}</div>
        <h1>${Q.correct} / ${qs.length} correct</h1>
        <p class="muted">${pass ? "Strong retrieval on this operation. Now defend the decisions in its connected case and viva." : "Re-read the article and run it again."} (${pct}%)</p>
        <div class="mt action-row">
          <button class="btn" id="sx-retry">${IC("refresh")} Retry</button>
          <a class="btn secondary" href="#/surgery">Back to surgeries</a></div></div>`;
      const rb = $m().querySelector("#sx-retry"); if (rb) rb.onclick = () => startQuiz(Q.scope);
      return;
    }
    const q = qs[Q.i], picked = Q.answered;
    $m().innerHTML = `
      <div class="player-top">
        <a class="btn sm secondary" href="#/surgery">${IC("chevL")} Exit</a>
        <div class="bar"><span style="width:${Math.round(100 * Q.i / qs.length)}%"></span></div>
        <span class="small muted" style="font-variant-numeric:tabular-nums">${Q.i + 1}/${qs.length}</span>
      </div>
      <p class="muted small" style="margin:0 0 6px"><b>${esc(Q.label)}</b> · surgery self-test${q.topic ? " · " + esc(q.topic) : ""}</p>
      <div class="card sx-q"><div class="sq-stem">${esc(q.q)}</div>
        ${picked === null && typeof confidenceHTML === "function" ? confidenceHTML(Q.sure) : ""}
        <div class="sq-opts">${q.options.map((o, k) => {
          let cls = "sq-opt";
          if (picked !== null) { if (k === q.answer) cls += " correct"; else if (k === picked) cls += " wrong"; else cls += " dim"; }
          return `<button class="${cls}" data-opt="${k}"${picked !== null ? " disabled" : ""}><span class="sq-key">${String.fromCharCode(65 + k)}</span>${esc(o)}</button>`;
        }).join("")}</div>
        ${picked !== null ? `<div class="sq-explain ${picked === q.answer ? "ok" : "no"}"><b>${picked === q.answer ? "Correct." : "Not quite."}</b> ${esc(q.explain || "")}</div>` : ""}
      </div>
      ${picked !== null ? `<div class="sx-foot"><button class="btn" id="sq-next">${Q.i === qs.length - 1 ? "See score" : "Next question"} ${IC("chevR")}</button></div>` : ""}`;
    if (picked === null) {
      if (typeof wireConfidence === "function") wireConfidence($m(), Q);
      $m().querySelectorAll(".sq-opt").forEach(b => b.onclick = () => {
        if (!questionAllowed(q)) { Q.answered = null; renderQuiz(); return; }
        Q.answered = +b.dataset.opt;
        const ok = Q.answered === q.answer;
        if (ok) Q.correct++;
        recordQ(q.id, ok);
        if (typeof logMCQ === "function") logMCQ({ m: "surgery", qid: q.id, topic: q.topic || q.section || "", ok: ok, sure: Q.sure });
        renderQuiz();
      });
    } else {
      const nx = $m().querySelector("#sq-next");
      if (nx) nx.onclick = () => {
        if (Q.scope && Q.scope.type === "section" && !sourceAllowed(Q.scope.id, "practice")) {
          const section = sectionById(Q.scope.id);
          renderPacingLock(Q.scope.id, (section ? section.title : Q.label) + " quiz", "practice", "#/surgery");
          return;
        }
        Q.i++; Q.answered = null; Q.sure = true; renderQuiz();
      };
    }
  }

  /* ============================== FLASHCARD DECK ============================== */
  function renderCardsMenu() {
    const all = pacingCards(SX.cards || [], "review");
    let html = `<div class="player-top">
        <a class="btn sm secondary" href="#/surgery">${IC("chevL")} Surgeries</a>
        <span class="small muted">Flashcards</span></div>
      <div class="page-head"><div>
        <h1>Surgery Flashcards</h1>
        <p>Spaced-repetition recall over the cardiac operations in the shared CardiacSchool scheduler. Use the full operative deck here or a focused set from its connected day.</p></div></div>`;

    const due = dueCards(all).length, fresh = newCards(all).length, weak = weakCards(all).length;
    html += `<div class="sx-stats card">
      <div class="stat"><div class="v">${all.length}</div><div class="l">Total</div></div>
      <div class="stat"><div class="v">${due}</div><div class="l">Due now</div></div>
      <div class="stat"><div class="v">${fresh}</div><div class="l">New</div></div>
      <div class="stat"><div class="v">${weak}</div><div class="l">Lapsed</div></div></div>`;

    html += `<div class="sx-deck-actions">
      <button class="btn" data-study="all"${all.length ? "" : " disabled"}>${IC("zap")} Study all due + new</button>
      ${weak ? `<button class="btn secondary" data-study="weak">${IC("target")} Drill lapsed cards</button>` : ""}
    </div>`;

    SX.categories.forEach(cat => {
      const list = sectionsIn(cat.id).filter(s => cardsForSection(s.id).length);
      if (!list.length) return;
      html += `<h2 class="sx-deck-h">${esc(cat.title)}</h2>`;
      list.forEach(s => {
        const access = pacingAccess(s.id, "full-deck");
        const pool = pacingCards(cardsForSection(s.id), "full-deck");
        const cdue = dueCards(pool).length, cnew = newCards(pool).length;
        if (access.allowed === false) {
          const reason = pacingLockReason(s.id, "full-deck", access);
          html += `<button class="sx-deck-row pacing-locked-card locked" type="button" disabled aria-disabled="true" title="${pacingAttr(reason)}">
            <div><div class="sdr-title">${esc(s.title)}</div><div class="muted small">${cardsForSection(s.id).length} cards</div></div>
            <div class="sdr-meta small">${IC("lock")} Catch-up lock</div>
          </button>`;
          return;
        }
        html += `<button class="sx-deck-row" data-study="sec:${esc(s.id)}">
            <div><div class="sdr-title">${esc(s.title)}</div><div class="muted small">${pool.length} cards</div></div>
            <div class="sdr-meta small">${cdue} due · ${cnew} new ${IC("chevR")}</div>
          </button>`;
      });
    });
    if (!all.length) html += (SX.cards || []).length
      ? `<div class="card empty pacing-locked-card" role="status">${IC("lock")}<h2>No surgery cards available right now</h2><p class="muted">Complete your active catch-up day to reopen new cards from locked operations.</p></div>`
      : `<div class="card empty">${IC("cards")}<h2>No flashcards loaded yet</h2><p class="muted">The operation files ship the cloze deck.</p></div>`;
    $m().innerHTML = html;
    $m().querySelectorAll("[data-study]").forEach(b => b.onclick = () => {
      const v = b.dataset.study;
      if (v === "all") startSession({ kind: "all", label: "All surgery cards" });
      else if (v === "weak") startSession({ kind: "weak", label: "Lapsed cards" });
      else if (v.startsWith("sec:")) { const id = v.slice(4); const s = sectionById(id); startSession({ kind: "section", id, label: s ? s.title : id }); }
    });
  }

  /* ---------- study session ---------- */
  const S = { queue: [], i: 0, flipped: false, done: 0, again: 0, label: "", mode: "review", spec: null };
  function poolFor(f) {
    let pool;
    if (f.kind === "section") pool = cardsForSection(f.id);
    else if (f.kind === "cat") pool = cardsIn(f.id);
    else if (f.kind === "weak") pool = weakCards(SX.cards || []);
    else pool = SX.cards || [];
    return pacingCards(pool, (f.kind === "all" || f.kind === "weak") ? "review" : "full-deck");
  }
  function startSession(f) {
    if (f.kind === "section") {
      const section = sectionById(f.id);
      if (section && renderPacingLock(section.id, section.title + " flashcards", "full-deck", "#/surgery/cards")) return;
    }
    const pool = poolFor(f);
    const due = shuffle(dueCards(pool));
    const fresh = (f.kind === "weak") ? [] : shuffle(newCards(pool));
    let queue = due.concat(fresh);
    if (!queue.length && f.kind === "section") queue = shuffle(pool); // allow on-demand browse of an operation's deck
    S.queue = queue; S.i = 0; S.flipped = false; S.done = 0; S.again = 0; S.label = f.label;
    S.mode = (f.kind === "all" || f.kind === "weak") ? "review" : "full-deck";
    S.spec = Object.assign({}, f);
    if (location.hash !== "#/surgery/cards/study") location.hash = "#/surgery/cards/study";
    else renderSession();
  }
  function revalidateCardTail() {
    if (!S.queue.length || S.flipped) return;
    const completed = S.queue.slice(0, S.i);
    S.queue = completed.concat(pacingCards(S.queue.slice(S.i), S.mode));
  }
  function renderSession() {
    if (S.spec && S.spec.kind === "section" && !S.flipped) {
      const section = sectionById(S.spec.id);
      if (section && renderPacingLock(section.id, section.title + " flashcards", "full-deck", "#/surgery/cards")) return;
    }
    revalidateCardTail();
    if (!S.queue.length) { location.hash = "#/surgery/cards"; return; }
    if (S.i >= S.queue.length) {
      $m().innerHTML = `<div class="card center celebrate finale">
        <div class="confetti">🧠</div><h1>Session complete</h1>
        <p class="muted">${S.done} card${S.done === 1 ? "" : "s"} reviewed${S.again ? `, ${S.again} still in learning (back in minutes)` : ""}.</p>
        <div class="mt action-row">
          <a class="btn" href="#/surgery/cards">Flashcard deck</a>
          <a class="btn secondary" href="#/surgery">Back to surgeries</a></div></div>`;
      return;
    }
    const c = S.queue[S.i];
    const sec = sectionById(c.section);
    $m().innerHTML = `
      <div class="player-top">
        <a class="btn sm secondary" href="#/surgery/cards">${IC("chevL")} Exit</a>
        <div class="bar"><span style="width:${Math.round(100 * S.i / S.queue.length)}%"></span></div>
        <span class="small muted" style="font-variant-numeric:tabular-nums">${S.i + 1}/${S.queue.length}</span>
      </div>
      <div class="fc-count">${c.topic ? `<span class="pill cyan">${esc(c.topic)}</span>` : ""}<span>${sec ? esc(sec.title) : ""}</span></div>
      <div class="fc-stage">
        <div class="fc-card ${S.flipped ? "flipped" : ""}" id="sx-fc" role="button" tabindex="0" aria-label="Flashcard — press to flip">
          <div class="fc-face"><span class="fc-topic pill cyan">Cloze</span><div class="sx-clz-text">${clozeFront(c.text)}</div><div class="small muted" style="font-weight:500">tap / space to flip</div></div>
          <div class="fc-face back"><span class="fc-topic pill green">Answer</span><div class="sx-clz-text">${clozeBack(c.text)}</div></div>
        </div>
      </div>
      ${S.flipped ? `<div class="fc-rate">
        <button class="fc-again" data-q="0">Again<span class="ivl">${ivlPreview(c, 0)}</span></button>
        <button class="fc-hard" data-q="1">Hard<span class="ivl">${ivlPreview(c, 1)}</span></button>
        <button class="fc-good" data-q="2">Good<span class="ivl">${ivlPreview(c, 2)}</span></button>
        <button class="fc-easy" data-q="3">Easy<span class="ivl">${ivlPreview(c, 3)}</span></button>
      </div><p class="small muted center mt">1 · 2 · 3 · 4 also work. Honest grading keeps the scheduler accurate.</p>`
        : `<button class="btn" style="width:100%" id="sx-flip">Show answer</button>`}`;
    const flip = () => {
      if (!pacingCards([S.queue[S.i]], S.mode).length) {
        S.queue.splice(S.i, 1); S.flipped = false; renderSession(); return;
      }
      S.flipped = !S.flipped; renderSession();
    };
    $m().querySelector("#sx-fc").onclick = flip;
    const fb = $m().querySelector("#sx-flip"); if (fb) fb.onclick = flip;
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
    if (location.hash !== "#/surgery/cards/study" || !S.queue.length || S.i >= S.queue.length) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!pacingCards([S.queue[S.i]], S.mode).length) {
        S.queue.splice(S.i, 1); S.flipped = false; renderSession(); return;
      }
      S.flipped = !S.flipped; renderSession();
    }
    if (S.flipped && ["1", "2", "3", "4"].includes(e.key)) rateAdvance(+e.key - 1);
  });

  /* ============================== ORDER-THE-STEPS GAME ============================== */
  /* Tap-to-sequence: shuffled step chips -> tap to build the operative order against a
     SOFT 60s clock. You can run over 60s, but finishing over time FAILS the attempt.
     Pass = perfect order within 60s. Isolated best scores in st_surgery_order. */
  const LIMIT = 60; // soft time limit, seconds
  const O = { sec: null, canonical: [], pool: [], placed: [], start: 0, timer: null, graded: false };

  function sectionsWithSteps() { return SX.sections.filter(s => Array.isArray(s.steps) && s.steps.length >= 2); }
  function clearTimer() { if (O.timer) { clearInterval(O.timer); O.timer = null; } }
  function fmtClock(s) { const m = Math.floor(s / 60), ss = s % 60; return m + ":" + (ss < 10 ? "0" : "") + ss; }

  function renderOrderMenu() {
    clearTimer();
    const list = sectionsWithSteps();
    const best = orderBest();
    let html = `<div class="player-top">
        <a class="btn sm secondary" href="#/surgery">${IC("chevL")} Surgeries</a>
        <span class="small muted">Order-the-Steps</span></div>
      <div class="page-head"><div>
        <h1>Order-the-Steps Challenge</h1>
        <p>Rebuild each operation from memory: the steps appear scrambled — tap them into the correct
        operative sequence before the 60-second clock runs out. Finish in time with a perfect order to
        pass. Pure recall drill, separate from your 14-day plan and worth no XP.</p></div></div>`;

    if (!list.length) {
      html += `<div class="card empty">${IC("target")}<h2>No step sequences loaded yet</h2><p class="muted">Operations need a steps list to play.</p></div>`;
      $m().innerHTML = html; return;
    }

    SX.categories.forEach(cat => {
      const inCat = list.filter(s => s.category === cat.id);
      if (!inCat.length) return;
      html += `<h2 class="sx-deck-h">${esc(cat.title)}</h2>`;
      inCat.forEach(s => {
        const b = best[s.id];
        const tag = b ? (b.passed ? `<span class="pill green">Passed</span>` : `<span class="pill cyan">Best ${b.best}/${b.total}</span>`) : `<span class="muted small">Not tried</span>`;
        const access = pacingAccess(s.id, "practice");
        if (access.allowed === false) {
          const reason = pacingLockReason(s.id, "practice", access);
          html += `<div class="sx-deck-row pacing-locked-card locked" role="link" aria-disabled="true" tabindex="-1" title="${pacingAttr(reason)}">
            <div><div class="sdr-title">${esc(s.title)}</div><div class="muted small">${s.steps.length} steps</div></div>
            <div class="sdr-meta small">${IC("lock")} Catch-up lock</div>
          </div>`;
          return;
        }
        html += `<a class="sx-deck-row" href="#/surgery/order/${encodeURIComponent(s.id)}">
            <div><div class="sdr-title">${esc(s.title)}</div><div class="muted small">${s.steps.length} steps</div></div>
            <div class="sdr-meta small">${tag} ${IC("chevR")}</div>
          </a>`;
      });
    });
    $m().innerHTML = html;
  }

  function startOrder(id) {
    const s = sectionById(id);
    if (!s || !Array.isArray(s.steps) || s.steps.length < 2) { location.hash = "#/surgery/order"; return; }
    if (renderPacingLock(s.id, s.title + " step challenge", "practice", "#/surgery/order")) {
      clearTimer(); return;
    }
    O.sec = s;
    const sample = window.StaffTour?.isSurgerySample() && id === "cabg";
    O.canonical = sample ? [1, 2, 3, 5].map(i => s.steps[i]) : s.steps.slice();
    O.pool = shuffle(O.canonical.map((t, i) => ({ i: i, t: t })));
    O.placed = [];
    if (!sample && window.StaffTour?.isSurgerySecond()) {
      const first = O.pool.find(item => item.i === 0);
      if (first) O.placed = [first];
    }
    O.start = Date.now();
    O.graded = false;
    clearTimer();
    if (!window.StaffTour?.isSurgerySample()) O.timer = setInterval(() => { const el = document.querySelector("#sx-ord-clock"); if (el) paintClock(el); else clearTimer(); }, 1000);
    if (location.hash !== "#/surgery/order/" + encodeURIComponent(id)) location.hash = "#/surgery/order/" + encodeURIComponent(id);
    else renderOrder();
  }

  function elapsed() { return Math.floor((Date.now() - O.start) / 1000); }
  function paintClock(el) {
    if (window.StaffTour?.isSurgerySample()) { el.className = "sx-ord-clock"; el.textContent = "Four-milestone preview · no timer"; return; }
    const e = elapsed(), over = e >= LIMIT;
    el.className = "sx-ord-clock" + (over ? " over" : (e >= LIMIT - 10 ? " danger" : ""));
    el.innerHTML = over
      ? `${IC("clock")} OVERTIME +${fmtClock(e - LIMIT)}`
      : `${IC("clock")} ${fmtClock(LIMIT - e)} left`;
  }

  function renderOrder() {
    if (!O.sec) { location.hash = "#/surgery/order"; return; }
    if (O.graded) return; // results screen owns the DOM
    if (renderPacingLock(O.sec.id, O.sec.title + " step challenge", "practice", "#/surgery/order")) {
      clearTimer(); return;
    }
    const total = O.canonical.length;
    let html = `<div class="player-top">
        <a class="btn sm secondary" href="#/surgery/order">${IC("chevL")} Exit</a>
        <span class="sx-ord-clock" id="sx-ord-clock"></span>
        <span class="small muted" style="font-variant-numeric:tabular-nums">${O.placed.length}/${total}</span>
      </div>
      <p class="muted small" style="margin:0 0 8px"><b>${esc(O.sec.title)}</b> · ${window.StaffTour?.isSurgerySample() ? "place four selected milestones in operative order" : "tap the steps into operative order"}</p>`;

    html += `<div class="sx-ord-placed">`;
    for (let k = 0; k < total; k++) {
      const p = O.placed[k];
      html += `<div class="sx-ord-slot${p ? " filled" : ""}"${p ? ` data-pop="${k}"` : ""}>
        <span class="sx-ord-num">${k + 1}</span>
        <span class="sx-ord-txt">${p ? esc(p.t) : "&nbsp;"}</span>
        ${p ? `<span class="sx-ord-x" aria-label="remove">&times;</span>` : ""}</div>`;
    }
    html += `</div>`;

    const remaining = O.pool.filter(c => !O.placed.some(p => p && p.i === c.i));
    html += `<div class="sx-ord-poolhead small muted">${remaining.length ? "Steps to place — tap in order:" : "All placed — grade when ready."}</div>
      <div class="sx-ord-pool">` +
      remaining.map(c => `<button class="sx-ord-chip" data-add="${c.i}">${esc(c.t)}</button>`).join("") +
      `</div>`;

    html += `<div class="sx-foot">
      <button class="btn" id="sx-ord-grade"${O.placed.length && (!window.StaffTour?.isSurgerySample() || O.placed.length === total) ? "" : " disabled"}>${IC("check")} Grade my order</button>
      <a class="btn secondary" href="#/surgery/order">Pick another operation</a></div>`;

    $m().innerHTML = html;
    const clk = $m().querySelector("#sx-ord-clock"); if (clk) paintClock(clk);
    $m().querySelectorAll("[data-add]").forEach(b => b.onclick = () => {
      const i = +b.dataset.add; const card = O.pool.find(c => c.i === i);
      if (card) { O.placed.push(card); renderOrder(); }
    });
    $m().querySelectorAll("[data-pop]").forEach(b => b.onclick = () => {
      O.placed.splice(+b.dataset.pop, 1); renderOrder();
    });
    const g = $m().querySelector("#sx-ord-grade"); if (g) g.onclick = gradeOrder;
  }

  function gradeOrder() {
    clearTimer();
    if (!O.sec || renderPacingLock(O.sec.id, (O.sec ? O.sec.title : "Operation") + " step challenge", "practice", "#/surgery/order")) return;
    const secs = (Date.now() - O.start) / 1000;
    const sample = !!window.StaffTour?.isSurgerySample();
    const overtime = !sample && secs > LIMIT;
    const total = O.canonical.length;
    let correct = 0;
    for (let k = 0; k < total; k++) if (O.placed[k] && O.placed[k].i === k) correct++;
    const perfect = correct === total;
    const passed = perfect && !overtime;
    O.graded = true;
    if (!sample) recordOrder(O.sec.id, correct, total, secs, passed);

    let html = `<div class="card center celebrate finale">
      <div class="confetti">${passed ? "🏆" : "⏱️"}</div>
      <h1 class="sx-ord-verdict ${passed ? "pass" : "fail"}">${passed ? "PASS" : "FAIL"}</h1>
      <p class="muted">${correct} / ${total} steps in the right place${sample ? " · untimed preview" : " · " + fmtClock(Math.round(secs)) + (overtime ? " — over the 1-minute limit" : "")}.</p>
      <p class="muted small">${sample ? "Compare your sequence with the operative milestones below. The full CABG rehearsal is available after the preview." : passed ? "Perfect order, inside the clock — you can run this operation in your head." : overtime && perfect ? "Right order, but too slow — speed it up and pass." : "Re-read the operation and run it again."}</p>
      <div class="mt action-row">
        <button class="btn" id="sx-ord-retry">${IC("refresh")} Retry</button>
        <a class="btn secondary" href="#/surgery/${encodeURIComponent(O.sec.id)}">Read the operation</a>
        <a class="btn secondary" href="#/surgery/order">Other operations</a></div></div>`;

    html += `<h2 class="sx-deck-h">Correct order</h2><ol class="sx-ord-answer">` +
      O.canonical.map((t, k) => {
        const got = O.placed[k];
        const ok = got && got.i === k;
        const cls = ok ? "ok" : "bad";
        return `<li class="${cls}"><span class="sx-ord-mark">${ok ? "✓" : "✗"}</span><span>${esc(t)}</span></li>`;
      }).join("") + `</ol>`;

    $m().innerHTML = html;
    if (sample) window.StaffTour?.record("surgery:graded", { correct, total });
    const r = $m().querySelector("#sx-ord-retry"); if (r) r.onclick = () => startOrder(O.sec.id);
  }

  window.StaffTourSurgery = { restartSample() { if (window.StaffTour?.isSurgerySample()) startOrder("cabg"); } };

  document.addEventListener("keydown", e => {
    if (!/^#\/surgery\/order\//.test(location.hash) || !O.sec || O.graded) return;
    if (e.key === "Enter" && O.placed.length && (!window.StaffTour?.isSurgerySample() || O.placed.length === O.canonical.length)) { e.preventDefault(); gradeOrder(); }
  });

  /* ============================== ROUTER API ============================== */
  window.Surgery = {
    render(parts) {
      const sub = parts[1];
      if (sub === "quiz") {
        if (parts[2] === "s" && parts[3]) startQuiz({ type: "section", id: parts[3] });
        else if (parts[2]) startQuiz({ type: "cat", id: parts[2] });
        else startQuiz({ type: "all" });
        return;
      }
      if (sub === "order") {
        if (parts[2]) startOrder(decodeURIComponent(parts[2]));
        else { clearTimer(); renderOrderMenu(); }
        return;
      }
      if (sub === "cards") {
        if (parts[2] === "study") renderSession();
        else if (parts[2] === "s" && parts[3]) { const s = sectionById(parts[3]); startSession({ kind: "section", id: parts[3], label: s ? s.title : parts[3] }); }
        else if (parts[2] === "cat" && parts[3]) { const cat = SX.categories.find(c => c.id === parts[3]); startSession({ kind: "cat", id: parts[3], label: cat ? cat.title : parts[3] }); }
        else renderCardsMenu();
        return;
      }
      if (sub) renderSection(sub);
      else renderHub();
    },
    teardown() { clearTimer(); }
  };

  // Deep-link / refresh onto a surgery route: app.js ran its initial route()
  // before this script loaded, so re-render now if we're already on one.
  if (/^#\/surgery/.test(location.hash) && typeof route === "function") route();
})();
