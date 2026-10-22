/* ============================================================================
   CardiacSchool — STANDALONE "TRIALS" ENGINE
   Renders the Trials hub (#/trials), trial pages (#/trials/<id>) and an inline
   per-trial MCQ runner. Scoring lives in an ISOLATED namespace (st_trials_*).
   Reuses only pure globals from app.js — esc, shuffle, Store, IC, todayStr —
   and never calls addXP / bumpStreak / bumpDaily / checkAchievements, nor
   touches window.QUESTIONS, so the 14-day plan is completely unaffected.
   ============================================================================ */
(function () {
  "use strict";
  if (!window.TRIALS) return; // data missing → inert, host app unaffected

  const T = window.TRIALS;
  const PASS = 0.7;
  const $m = () => document.querySelector("#main");

  /* ---------- isolated store ---------- */
  function scores() { return Store.get("trials_scores", {}); }
  function done() { return Store.get("trials_done", {}); }
  function recordResult(id, correct, total) {
    const s = scores(); const prev = s[id] || { best: 0, total: total };
    s[id] = { best: Math.max(prev.best, correct), total: total, ts: Date.now() };
    Store.set("trials_scores", s);
    if (correct / total >= PASS) {
      const d = done(), first = !d[id]; d[id] = Date.now(); Store.set("trials_done", d);
      if (first && typeof addXP === "function") addXP(40);
      if (typeof bumpStreak === "function") bumpStreak();
      if (typeof logActivity === "function") logActivity(2);
    }
  }

  /* ---------- helpers ---------- */
  const CAT_ACCENT = { coronary: "accent-coral", valve: "accent-violet", aortic: "accent-cyan", support: "accent-teal", perioperative: "accent-amber" };
  function trialById(id) { return T.trials.find(t => t.id === id); }
  function trialsIn(cat) { return T.trials.filter(t => t.category === cat); }
  function passedCount() { return Object.keys(done()).length; }
  function figureSlot(targetId, anchor, phase) {
    return window.Figures && typeof window.Figures.slot === "function"
      ? (window.Figures.slot("trials", targetId, anchor, phase || "content") || "")
      : "";
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
      const result = p.canAccessSource("evidence", id, purpose || "browse");
      if (result === false) return { allowed: false };
      if (result && typeof result === "object" && result.allowed === false) return result;
      return { allowed: true };
    } catch (_) {
      return { allowed: true };
    }
  }
  function pacingAttr(value) { return esc(value).replace(/"/g, "&quot;"); }
  function pacingLockReason(id, purpose, access) {
    if (access && typeof access.reason === "string" && access.reason) return access.reason;
    const p = window.Pacing;
    if (p && typeof p.lockReason === "function") {
      try {
        const reason = p.lockReason("evidence", id, purpose || "browse");
        if (typeof reason === "string" && reason) return reason;
      } catch (_) {}
    }
    return "This trial is temporarily locked while you complete your active catch-up day.";
  }
  function renderPacingLock(id, label, purpose, backHash) {
    const access = pacingAccess(id, purpose);
    if (access.allowed !== false) return false;
    const reason = pacingLockReason(id, purpose, access);
    $m().innerHTML = `<div class="card empty pacing-lock-screen" role="alert" tabindex="-1" data-pacing-lock>
      <div class="lock-mark">${IC("lock")}</div><h1>${esc(label || "Trial locked")}</h1>
      <p class="muted">${esc(reason)}</p>
      <a class="btn" href="#/">Return to Today</a>
      <a class="btn secondary" href="${pacingAttr(backHash || "#/trials")}">Back to trials</a></div>`;
    const panel = $m().querySelector("[data-pacing-lock]");
    if (panel) panel.focus();
    return true;
  }

  /* ============================== HUB ============================== */
  function renderHub() {
    let html = `<div class="page-head"><div>
      <h1>Landmark Trials</h1>
      <p>The practice-changing coronary, valve and aortic trials — each reduced to the clinical question,
      design, result, limitation and decision it should change.</p></div></div>`;

    html += `<div class="trials-stats card">
      <div class="stat"><div class="v" data-count="${T.trials.length}">0</div><div class="l">Trials</div></div>
      <div class="stat"><div class="v" data-count="${passedCount()}">0</div><div class="l">Quizzes passed</div></div>
      <div class="stat"><div class="v" data-count="${T.categories.length}">0</div><div class="l">Specialties</div></div></div>`;

    const statsFigures = figureSlot("trials", "overview", "content");
    if (statsFigures) {
      html += `<section class="trials-cat trials-primer">
        <div class="trials-cat-head"><h2>Reading the evidence</h2>
        <p class="muted small">A quick visual primer on the plots and statistics used across these trials.</p></div>
        ${statsFigures}</section>`;
    }

    const d = done();
    T.categories.forEach(cat => {
      const list = trialsIn(cat.id);
      if (!list.length) return;
      const era = list.slice().sort((a, b) => (a.year || 0) - (b.year || 0));
      const timeline = era.length > 2 ? `<div class="trial-timeline" aria-label="${esc(cat.title)} trials by year">` +
        era.map(t => {
          const access = pacingAccess(t.id, "browse");
          if (access.allowed === false) {
            const reason = pacingLockReason(t.id, "browse", access);
            return `<span class="tl-node pacing-locked-card locked" role="link" aria-disabled="true" tabindex="-1" title="${pacingAttr(reason)}">
              <span class="tl-dot" aria-hidden="true"></span><b>${t.year || "—"}</b><span class="tl-name">${esc(t.name)} ${IC("lock")}</span></span>`;
          }
          return `<a class="tl-node${d[t.id] ? " passed" : ""}" href="#/trials/${encodeURIComponent(t.id)}" title="${esc(t.name)}${t.year ? " · " + t.year : ""}">
            <span class="tl-dot" aria-hidden="true"></span><b>${t.year || "—"}</b><span class="tl-name">${esc(t.name)}</span></a>`;
        }).join("") + `</div>` : "";
      html += `<section class="trials-cat ${CAT_ACCENT[cat.id] || ""}">
        <div class="trials-cat-head"><h2>${esc(cat.title)}</h2><p class="muted small">${esc(cat.blurb)}</p></div>
        ${timeline}
        <div class="trials-grid">` +
        list.map(t => {
          const access = pacingAccess(t.id, "browse");
          if (access.allowed === false) {
            const reason = pacingLockReason(t.id, "browse", access);
            return `<div class="trial-card pacing-locked-card locked" role="link" aria-disabled="true" tabindex="-1" title="${pacingAttr(reason)}">
              <div class="tc-top"><span class="trial-name">${esc(t.name)}</span><span class="pill amber">${IC("lock")} Catch-up lock</span></div>
              <div class="tc-topic muted small">${esc(t.topic || "")}</div>
              <div class="tc-foot small">${esc(reason)}</div>
            </div>`;
          }
          return `<a class="trial-card${d[t.id] ? " passed" : ""}" href="#/trials/${encodeURIComponent(t.id)}">
              <div class="tc-top"><span class="trial-name">${esc(t.name)}</span>${d[t.id] ? `<span class="tc-check">${IC("check")}</span>` : ""}</div>
              <div class="tc-topic muted small">${esc(t.topic || "")}</div>
              <div class="tc-foot small">${esc(t.journal || "")} ${t.year || ""} · ${(t.mcqs || []).length} MCQs ${IC("chevR")}</div>
            </a>`;
        }).join("") +
        `</div></section>`;
    });
    if (!T.trials.length) html += `<div class="card empty">${IC("scope")}<h2>No trials loaded yet</h2><p class="muted">Trial files have not been added.</p></div>`;
    $m().innerHTML = html;
    if (typeof countUpAll === "function") countUpAll();
  }

  /* ============================== TRIAL PAGE ==============================
     Four movements: what was asked → who/what was compared (PICO grid) →
     what happened (verdict panel) → what you do differently (pearls + CTA). */
  function renderTrial(id) {
    const t = trialById(id);
    if (!t) { location.hash = "#/trials"; return; }
    if (renderPacingLock(t.id, t.name, "browse", "#/trials")) return;
    const cat = T.categories.find(c => c.id === t.category);
    const s = scores()[t.id];
    const passed = !!done()[t.id];
    const n = (t.mcqs || []).length;

    let html = `<div class="trial-page ${CAT_ACCENT[t.category] || ""}">
      <div class="feature-hero trial-hero">
        <div class="fh-body">
          <a class="fh-back" href="#/trials">${IC("chevL")} Landmark trials</a>
          <span class="eyebrow">${cat ? esc(cat.title) : "Landmark trial"}</span>
          <h1>${esc(t.name)}</h1>
          ${t.full ? `<p class="fh-sub">${esc(t.full)}</p>` : ""}
          <div class="fh-meta">
            ${t.topic ? `<span class="pill cyan">${esc(t.topic)}</span>` : ""}
            ${t.design ? `<span class="pill">${esc(t.design)}</span>` : ""}
            ${n ? `<span class="pill">${n} MCQs</span>` : ""}
            ${passed ? `<span class="pill solid-green">${IC("check")} passed</span>` : s ? `<span class="pill green">Best ${s.best}/${s.total}</span>` : ""}
          </div>
        </div>
        <div class="fh-side">
          <div class="fh-medallion">${t.year || "—"}</div>
          ${t.journal ? `<span class="fh-medallion-sub">${esc(t.journal)}</span>` : ""}
        </div>
      </div>`;

    if (t.question) html += `<div class="viva-stem trial-question"><span class="kbox-tag">${IC("quiz")} Clinical question</span>${esc(t.question)}</div>`;
    if (window.CardCatalog) html += CardCatalog.ctaHTML("evidence", t.id);
    html += figureSlot(t.id, "overview", "content");

    // Design rides in the hero as a pill (it is always one line), so the grid
    // stays a clean P/I/C triplet rather than orphaning a fourth card.
    const pico = [["P", "Population", t.population], ["I", "Intervention", t.intervention], ["C", "Comparator", t.comparator]].filter(x => x[2]);
    if (pico.length) html += `<div class="pico-grid">` + pico.map(([k, label, val]) =>
      `<div class="pico-card"><span class="pico-tile" aria-hidden="true">${k}</span><div><b>${label}</b><span>${esc(val)}</span></div></div>`).join("") + `</div>`;

    if (t.outcome) html += `<div class="trial-verdict"><span class="kbox-tag">${IC("chart")} Key result</span><p>${esc(t.outcome)}</p></div>`;
    html += figureSlot(t.id, "summary", "content");

    if (t.bottomLine) html += `<div class="kbox pearl"><span class="kbox-tag">Bottom line</span>${esc(t.bottomLine)}</div>`;
    if (t.pearls && t.pearls.length) html += `<div class="kbox mnemonic"><span class="kbox-tag">Exam pearls</span><ul>${t.pearls.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>`;
    if (t.citation) html += `<p class="trial-cite small muted">${esc(t.citation)}</p>`;

    html += `<div class="daily-bridge trial-bridge">
      <p><b>Lock it in.</b> ${n ? `${n} self-test question${n === 1 ? "" : "s"} on the design, the result and the decision it should change.` : "Self-test questions for this trial are on the way."}</p>
      <button class="btn" id="trial-quiz-start"${n ? "" : " disabled"}>${IC("target")} Test yourself</button>
      <a class="btn secondary" href="#/trials">All trials</a></div></div>`;
    $m().innerHTML = html;
    const sb = $m().querySelector("#trial-quiz-start");
    if (sb && n) sb.onclick = () => {
      if (renderPacingLock(t.id, t.name + " quiz", "practice", "#/trials")) return;
      startQuiz(t);
    };
  }

  /* ============================== MCQ RUNNER ============================== */
  const Q = { trial: null, i: 0, correct: 0, answered: null };
  function startQuiz(t) {
    if (renderPacingLock(t.id, t.name + " quiz", "practice", "#/trials")) return;
    Q.trial = Object.assign({}, t, { mcqs: (t.mcqs || []).map(randomizedQuestion) });
    Q.i = 0; Q.correct = 0; Q.answered = null; renderQuiz();
  }
  function renderQuiz() {
    const t = Q.trial;
    if (!t) { location.hash = "#/trials"; return; }
    if (Q.answered === null && renderPacingLock(t.id, t.name + " quiz", "practice", "#/trials")) return;
    const qs = t.mcqs;
    if (Q.i >= qs.length) {
      if (renderPacingLock(t.id, t.name + " quiz", "practice", "#/trials")) return;
      recordResult(t.id, Q.correct, qs.length);
      const pct = Math.round(100 * Q.correct / qs.length), pass = Q.correct / qs.length >= PASS;
      $m().innerHTML = `<div class="card center celebrate finale ${CAT_ACCENT[t.category] || ""}">
        <div class="finale-ico">${IC(pass ? "trophy" : "chart")}</div>
        <h1>${Q.correct} / ${qs.length} correct</h1>
        <p class="muted">${pass ? "Passed — you know this trial." : "Review the summary and try again."} (${pct}%)</p>
        <div class="mt action-row">
          <button class="btn" id="trial-retry">${IC("refresh")} Retry</button>
          <a class="btn secondary" href="#/trials/${encodeURIComponent(t.id)}">Review trial</a>
          <a class="btn secondary" href="#/trials">All trials</a></div></div>`;
      const rb = $m().querySelector("#trial-retry"); if (rb) rb.onclick = () => startQuiz(t);
      return;
    }
    const q = qs[Q.i], picked = Q.answered;
    $m().innerHTML = `
      <div class="player-top">
        <a class="btn sm secondary" href="#/trials/${encodeURIComponent(t.id)}">${IC("chevL")} Exit</a>
        <div class="bar"><span style="width:${Math.round(100 * Q.i / qs.length)}%"></span></div>
        <span class="small muted tabular">${Q.i + 1}/${qs.length}</span>
      </div>
      <p class="kicker"><b>${esc(t.name)}</b> · self-test</p>
      <div class="card trial-q"><div class="tq-stem">${esc(q.q)}</div>
        <div class="tq-opts">${q.options.map((o, k) => {
          let cls = "tq-opt";
          if (picked !== null) { if (k === q.answer) cls += " correct"; else if (k === picked) cls += " wrong"; else cls += " dim"; }
          return `<button class="${cls}" data-opt="${k}"${picked !== null ? " disabled" : ""}><span class="tq-key">${String.fromCharCode(65 + k)}</span>${esc(o)}</button>`;
        }).join("")}</div>
        ${picked !== null ? `<div class="tq-explain ${picked === q.answer ? "ok" : "no"}"><b>${picked === q.answer ? "Correct." : "Not quite."}</b> ${esc(q.explain || "")}</div>` : ""}
      </div>
      ${picked !== null ? `<div class="trial-foot"><button class="btn" id="tq-next">${Q.i === qs.length - 1 ? "See score" : "Next question"} ${IC("chevR")}</button></div>` : ""}`;
    if (picked === null) {
      $m().querySelectorAll(".tq-opt").forEach(b => b.onclick = () => {
        if (renderPacingLock(t.id, t.name + " quiz", "practice", "#/trials")) return;
        Q.answered = +b.dataset.opt;
        if (Q.answered === q.answer) Q.correct++;
        renderQuiz();
      });
    } else {
      const nx = $m().querySelector("#tq-next");
      if (nx) nx.onclick = () => {
        if (renderPacingLock(t.id, t.name + " quiz", "practice", "#/trials")) return;
        Q.i++; Q.answered = null; renderQuiz();
      };
    }
  }

  /* ============================== ROUTER API ============================== */
  window.Trials = {
    render(parts) { if (parts[1]) renderTrial(parts[1]); else renderHub(); }
  };

  // Deep-link / refresh onto a trials route: app.js ran its initial route()
  // before this script loaded, so re-render now if we're already on one.
  if (/^#\/trials/.test(location.hash) && typeof route === "function") route();
})();
