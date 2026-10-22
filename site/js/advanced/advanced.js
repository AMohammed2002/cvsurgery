/* CardiacSchool advanced learning engines. Loaded before app.js; called after app boot. */
(function () {
  "use strict";
  if (!window.CS_ADVANCED) return;

  const D = window.CS_ADVANCED;
  const main = function () { return document.querySelector("#main"); };
  const opById = function (id) { return D.operations.find(function (o) { return o.id === id; }); };
  const crisisById = function (id) { return D.crises.find(function (c) { return c.id === id; }); };
  const safe = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  const doneOps = function () { return Store.get("surgery_read", {}); };
  const opScores = function () { return Store.get("surgery_checks", {}); };
  const crisisScores = function () { return Store.get("crisis_scores", {}); };
  const completedCrises = function () { return Store.get("crisis_done", {}); };
  const pacingAllowed = function (type, id, purpose) {
    if (!window.Pacing || typeof window.Pacing.canAccessSource !== "function") return true;
    try {
      const result = window.Pacing.canAccessSource(type, id, purpose || "browse");
      return typeof result === "object" ? result.allowed !== false : result !== false;
    } catch (error) { return true; }
  };
  const pacingLock = function (message) {
    if (typeof window.renderPacingLock === "function") window.renderPacingLock({ reason: message });
    else if (typeof renderPacingLock === "function") renderPacingLock({ reason: message });
  };
  const wordCount = function (op) {
    const text = [op.orientation, op.indication, op.anatomy, op.evidence]
      .concat(op.preop, op.numbers, op.complications, op.postop, op.viva)
      .concat(op.steps.map(function (s) { return s.title + " " + s.text + " " + s.why; })).join(" ");
    return text.trim().split(/\s+/).length;
  };

  function safetyNote() {
    return '';
  }

  function figureSlot(surface, targetId, anchor, phase) {
    return window.Figures && typeof window.Figures.slot === "function"
      ? (window.Figures.slot(surface, targetId, anchor, phase) || "")
      : "";
  }

  function sectionHead(eyebrow, title, text) {
    return '<div class="advanced-head"><span class="eyebrow">' + safe(eyebrow) + '</span><h1>' + safe(title) + '</h1><p>' + safe(text) + '</p></div>';
  }

  function renderSurgeryHub() {
    const done = doneOps();
    const groups = {};
    D.operations.forEach(function (op) { (groups[op.category] = groups[op.category] || []).push(op); });
    let html = sectionHead("Operative intelligence", "Surgeries", "Learn each case from indication to ICU handover, then prove you can defend the plan and recognize failure.");
    html += safetyNote();
    html += '<div class="resident-banner"><div><span class="pill green">Integrated practice</span><h2>Read → narrate → decide → rescue</h2><p>Every flagship case integrates anatomy, physiology, technique, complications, evidence and a read-check that unlocks its application practice.</p></div><div class="resident-score"><strong>' + Object.keys(done).length + '</strong><span>/ ' + D.operations.length + ' articles complete</span></div></div>';
    html += '<div class="evidence-links"><b>Current evidence anchors</b><a href="https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2021/12/08/21/19/2021-guideline-for-revascularization-gl-revasc" target="_blank" rel="noopener">Coronary revascularization · 2021</a><a href="https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2020/12/16/21/58/2020-acc-aha-vhd-gl-pt-1-gl-vhd" target="_blank" rel="noopener">Valve disease · 2020</a><a href="https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2022/11/01/12/21/2022-Guideline-on-Aortic-Disease-2-gl-ad" target="_blank" rel="noopener">Aortic disease · 2022</a><span>Content last reviewed ' + safe(D.reviewed) + '</span></div>';
    Object.keys(groups).forEach(function (group) {
      html += '<section class="op-group"><div class="op-group-head"><h2>' + safe(group) + '</h2><span>' + groups[group].length + ' module' + (groups[group].length === 1 ? '' : 's') + '</span></div><div class="op-grid">';
      html += groups[group].map(function (op) {
        const complete = !!done[op.id];
        return '<a class="op-card ' + (complete ? 'complete' : '') + '" href="#/surgery/' + encodeURIComponent(op.id) + '"><div class="op-card-top"><span class="op-index">' + safe(op.category.slice(0, 2).toUpperCase()) + '</span><span class="pill ' + (complete ? 'green' : 'cyan') + '">' + (complete ? 'Article complete' : safe(op.difficulty)) + '</span></div><h3>' + safe(op.title) + '</h3><p>' + safe(op.orientation) + '</p><div class="op-meta"><span>' + op.minutes + ' min</span><span>' + wordCount(op) + ' words</span><span>' + op.questions.length + ' decisions</span></div><span class="op-open">Open case →</span></a>';
      }).join("");
      html += '</div></section>';
    });
    main().innerHTML = html;
  }

  function itemList(items, cls) {
    return '<ul class="clinical-list ' + (cls || '') + '">' + items.map(function (x) { return '<li>' + safe(x) + '</li>'; }).join('') + '</ul>';
  }

  function renderOperation(id) {
    const op = opById(id);
    if (!op) { location.hash = "#/surgery"; return; }
    const complete = !!doneOps()[op.id];
    const nav = ["orientation", "indication", "anatomy", "preop", "steps", "numbers", "failure", "icu", "evidence", "viva", "practice"];
    const labels = ["Orientation", "Indication", "Anatomy", "Pre-op", "Operation", "Numbers", "Failure", "First 24 h", "Evidence", "Viva", "Practice"];
    let html = '<div class="player-top"><a class="btn sm secondary" href="#/surgery">← Surgeries</a><span class="pill ' + (complete ? 'green' : 'cyan') + '">' + (complete ? 'Article complete' : safe(op.difficulty)) + '</span><span class="small muted">' + op.minutes + ' min · reviewed ' + D.reviewed + '</span></div>';
    html += '<article class="op-article"><aside class="step-rail" aria-label="Article sections"><b>Case rail</b>' + nav.map(function (n, i) { return '<a href="#op-' + n + '"><span>' + (i + 1) + '</span>' + labels[i] + '</a>'; }).join('') + '</aside><div class="op-content">';
    html += '<header class="op-hero" id="op-orientation"><span class="eyebrow">' + safe(op.category) + ' · Day ' + op.day + '</span><h1>' + safe(op.title) + '</h1><p class="op-orientation">' + safe(op.orientation) + '</p><div class="op-hero-stats"><span>' + wordCount(op) + ' words</span><span>' + op.steps.length + ' operative steps</span><span>' + op.flashcards.length + ' cards</span><span>' + op.questions.length + ' judgment MCQs</span></div></header>';
    html += safetyNote();
    html += '<section class="op-section" id="op-indication"><span class="section-no">01</span><div><h2>The problem and who gets this operation</h2><p>' + safe(op.indication) + '</p></div></section>';
    html += '<section class="op-section" id="op-anatomy"><span class="section-no">02</span><div><h2>Anatomy that changes the operation</h2><p>' + safe(op.anatomy) + '</p><a class="text-link" href="#/anatomy">Open linked anatomy review →</a></div></section>';
    html += '<section class="op-section" id="op-preop"><span class="section-no">03</span><div><h2>Preoperative brief</h2>' + itemList(op.preop, "checklist") + '</div></section>';
    html += '<section class="op-section op-steps-wrap" id="op-steps"><span class="section-no">04</span><div><h2>The operation, step by step</h2><p class="muted">At each step, separate the action from the physiologic or anatomic reason. That is the difference between reciting and operating.</p><div class="operative-steps">';
    html += op.steps.map(function (s, i) { return '<details class="operative-step" ' + (i < 2 ? 'open' : '') + '><summary><span>' + (i + 1) + '</span><b>' + safe(s.title) + '</b><small>expand</small></summary><div class="step-body"><p>' + safe(s.text) + '</p><div class="surgeon-eye"><b>Surgeon’s-eye reasoning</b><p>' + safe(s.why) + '</p></div></div></details>'; }).join('');
    html += '</div></div></section>';
    html += '<section class="op-section" id="op-numbers"><span class="section-no">05</span><div><h2>The numbers and thresholds</h2><div class="number-grid">' + op.numbers.map(function (x, i) { return '<div><span>0' + (i + 1) + '</span><p>' + safe(x) + '</p></div>'; }).join('') + '</div></div></section>';
    html += '<section class="op-section danger-section" id="op-failure"><span class="section-no">06</span><div><h2>What goes wrong</h2>' + itemList(op.complications, "danger-list") + '</div></section>';
    html += '<section class="op-section" id="op-icu"><span class="section-no">07</span><div><h2>The first 24 hours</h2>' + itemList(op.postop, "icu-list") + '</div></section>';
    html += '<section class="op-section" id="op-evidence"><span class="section-no">08</span><div><h2>Evidence and controversy</h2><p>' + safe(op.evidence) + '</p><div class="source-strip"><b>Source trail</b>' + op.sources.map(function (s) { return '<span>' + safe(s) + '</span>'; }).join('') + '</div></div></section>';
    html += '<section class="op-section" id="op-viva"><span class="section-no">09</span><div><h2>How to sound like a senior resident</h2><p>Answer each aloud in one crisp opening sentence, then defend mechanism, evidence and exception.</p><ol class="viva-list">' + op.viva.map(function (q) { return '<li>' + safe(q) + '</li>'; }).join('') + '</ol></div></section>';
    html += '<section class="op-section practice-section" id="op-practice"><span class="section-no">10</span><div><h2>Article check and linked practice</h2><p>' + (complete ? 'Your read-check is complete. Surgery cards and judgment MCQs are now active in the unified practice queues.' : 'Pass a three-decision read-check to unlock this operation’s cards and judgment MCQs.') + '</p><div class="practice-actions"><button class="btn" id="op-check">' + (complete ? 'Repeat read-check' : 'Start read-check') + '</button>' + (complete ? '<a class="btn secondary" href="#/cards/surgery">Review surgery cards</a><a class="btn secondary" href="#/quiz/topic/' + encodeURIComponent(op.title) + '">Run judgment MCQs</a>' : '') + '</div><div id="op-check-stage"></div></div></section>';
    html += '</div></article>';
    main().innerHTML = html;
    document.querySelector("#op-check").onclick = function () { startOpCheck(op); };
  }

  const opCheck = { op: null, index: 0, score: 0, answered: null };
  function startOpCheck(op) { opCheck.op = op; opCheck.index = 0; opCheck.score = 0; opCheck.answered = null; renderOpCheck(); }
  function renderOpCheck() {
    const op = opCheck.op, qs = op.questions.slice(0, 3), stage = document.querySelector("#op-check-stage");
    if (!stage) return;
    if (opCheck.index >= qs.length) {
      const pass = opCheck.score >= 2;
      if (pass) {
        const done = doneOps(), first = !done[op.id]; done[op.id] = Date.now(); Store.set("surgery_done", done);
        const scores = opScores(); scores[op.id] = Math.max(scores[op.id] || 0, opCheck.score); Store.set("surgery_checks", scores);
        if (first) { addXP(90); bumpStreak(); logActivity(5); }
        renderNav();
      }
      stage.innerHTML = '<div class="check-result ' + (pass ? 'pass' : 'retry') + '"><b>' + (pass ? 'Article check passed' : 'Article check incomplete') + '</b><p>' + opCheck.score + '/3 correct. ' + (pass ? 'Cards and MCQs for this operation are now unlocked.' : 'Review the failure and numbers sections, then try again.') + '</p><button class="btn sm secondary" id="check-again">Run again</button></div>';
      document.querySelector("#check-again").onclick = function () { startOpCheck(op); };
      return;
    }
    const q = qs[opCheck.index];
    stage.innerHTML = '<div class="read-check"><div class="read-check-top"><span>Decision ' + (opCheck.index + 1) + ' of 3</span><div class="bar"><span style="width:' + Math.round(100 * opCheck.index / 3) + '%"></span></div></div><h3>' + safe(q.stem) + '</h3>' + q.options.map(function (o, i) {
      let cls = "q-opt";
      if (opCheck.answered !== null) { if (i === q.answer) cls += " correct"; else if (i === opCheck.answered) cls += " wrong"; }
      return '<button class="' + cls + '" data-opt="' + i + '" ' + (opCheck.answered !== null ? 'disabled' : '') + '><span class="opt-key">' + "ABCD"[i] + '</span><span>' + safe(o) + '</span></button>';
    }).join('') + (opCheck.answered !== null ? '<div class="explain">' + safe(q.explain) + '</div><button class="btn sm" id="check-next">' + (opCheck.index === 2 ? 'See result' : 'Next decision') + '</button>' : '') + '</div>';
    stage.querySelectorAll(".q-opt").forEach(function (b) { b.onclick = function () { opCheck.answered = +b.dataset.opt; if (opCheck.answered === q.answer) opCheck.score++; renderOpCheck(); }; });
    const next = document.querySelector("#check-next");
    if (next) next.onclick = function () { opCheck.index++; opCheck.answered = null; renderOpCheck(); };
  }

  function labPreview(id) {
    const grid = '<path class="preview-grid" d="M0 20H240M0 40H240M0 60H240M0 80H240M30 0V100M70 0V100M110 0V100M150 0V100M190 0V100M230 0V100"/>';
    let trace = '<path class="trace" d="M0 65H35Q43 45 50 65H62L70 74L78 14L86 84L94 65H117Q132 38 147 65H240"/>';
    let label = 'Rhythm · time';
    if(id === 'pv-loop') {trace='<path d="M70 80V42Q120 6 184 23V72Q123 85 70 80Z" fill="#66dcc815" stroke="#66dcc8" stroke-width="2"/><path d="M58 92L115 5" stroke="#aec2c8" stroke-dasharray="4 4" fill="none"/><circle cx="184" cy="23" r="3" fill="#ff8a78"/>';label='Pressure · volume';}
    else if(id==='teg-rotem'){trace='<path class="trace" d="M0 50H30Q53 50 73 25T150 15Q195 17 235 25M0 50H30Q53 50 73 75T150 85Q195 83 235 75"/>';label='Clot · time';}
    else if(['oxygen-delivery','cpb-console','cpb-surgery','cannulation','cardioplegia'].includes(id)){trace='<path class="trace" d="M30 30H195Q220 30 220 50T195 70H30Q5 70 5 50T30 30" stroke-dasharray="0"/><circle cx="65" cy="30" r="15" fill="#0d2029" stroke="#7da8ff" stroke-width="2"/><circle cx="160" cy="70" r="15" fill="#0d2029" stroke="#ff8a78" stroke-width="2"/><path d="M62 25L70 30L62 35M156 65L164 70L156 75" stroke="#aec2c8" fill="none"/>';label='Flow · circuit';}
    else if(id==='valve'){trace='<path class="trace" d="M0 85H18Q34 15 65 10Q86 33 100 85H135Q151 15 182 10Q204 33 218 85H240"/>';label='Velocity · time';}
    else if(id==='cath-projections'){trace='<circle cx="120" cy="50" r="38" fill="none" stroke="#35515d"/><path d="M50 90L120 18L190 90M35 50H205" stroke="#7da8ff" fill="none"/><path class="trace" d="M120 18V47L89 73M120 47L153 64M105 58L101 83M135 55L164 47"/>';label='Orientation · projection';}
    return '<div class="lab-preview" aria-hidden="true"><svg viewBox="0 0 240 100">'+grid+trace+'</svg><small>'+label+'</small></div>';
  }
  function renderLabsHub() {
    if(window.Experience)return window.Experience.renderLabs();
    if (window.CSLab) window.CSLab.teardown();
    const labs = window.CSLab && window.CSLab.all().length ? window.CSLab.all() : D.labs;
    const scores=Store.get("physiology_lab_scores",{}), guided=Store.get("physiology_guided_v1",{});
    const groups={'pv-loop':'Foundations','oxygen-delivery':'Foundations','valve':'Foundations','shock':'Foundations','ecg':'Rhythm & support','pacing':'Rhythm & support','iabp':'Rhythm & support','teg-rotem':'Rhythm & support','cpb-console':'Perfusion & surgery','cpb-surgery':'Perfusion & surgery','cannulation':'Perfusion & surgery','cardioplegia':'Perfusion & surgery','or-monitor':'Imaging & integration','cath-projections':'Imaging & integration'};
    const titles={'pv-loop':'Pressure–volume loops','oxygen-delivery':'Oxygen delivery','valve':'Valve hemodynamics','shock':'Post-bypass shock','ecg':'ECG & postoperative rhythm','pacing':'Temporary pacing','iabp':'Balloon counterpulsation','teg-rotem':'Viscoelastic hemostasis','cpb-console':'The perfusion console','cpb-surgery':'Surgeon command','cannulation':'Cannulation strategy','cardioplegia':'Myocardial protection','or-monitor':'The cardiac OR monitor','cath-projections':'Cath lab projections'};
    main().innerHTML='<header class="studio-page-head"><div><span class="eyebrow">The physiology studio</span><h1>Make the mechanism visible.</h1><p>Follow a guided experiment. Connect the signals. Then explore what changes when you take the controls.</p></div><div class="studio-total"><b>'+labs.filter(l=>scores[l.id]).length+' <span style="font-size:1rem;color:var(--fg-soft)">/ '+labs.length+'</span></b>labs practiced</div></header><div class="studio-filterbar"><input type="search" id="lab-search" placeholder="Find a lab or concept…" aria-label="Search physiology labs"><select id="lab-category" aria-label="Filter labs by category"><option value="">All disciplines</option>'+Array.from(new Set(Object.values(groups))).map(g=>'<option>'+g+'</option>').join('')+'</select><span class="studio-count" id="lab-count" role="status"></span></div><div class="lab-grid lab-grid-expanded" id="studio-labs"></div>';
    function draw(){const query=document.querySelector('#lab-search').value.toLowerCase().trim(), group=document.querySelector('#lab-category').value;const found=labs.filter(l=>(!group||groups[l.id]===group)&&(!query||[l.title,l.subtitle,l.category,groups[l.id]].join(' ').toLowerCase().includes(query)));
      document.querySelector('#lab-count').textContent=found.length+' labs';
      document.querySelector('#studio-labs').innerHTML=found.map(function(lab){const allowed=pacingAllowed('physiology',lab.id,'browse'),done=scores[lab.id],started=guided[lab.id],tag=allowed?'a':'div';return '<'+tag+' class="lab-card '+(done?'complete':'')+'" '+(allowed?'href="#/physiology/'+lab.id+'"':'aria-disabled="true"')+'>'+labPreview(lab.id)+'<div class="lab-card-copy"><span class="eyebrow">'+safe(groups[lab.id]||lab.category)+'</span><h2>'+safe(titles[lab.id]||lab.title)+'</h2><p>'+safe(lab.subtitle)+'</p><div class="op-meta"><span>'+lab.minutes+' min</span><span>'+(done?'Best '+done.score+'/'+done.total:started&&started.complete?'Exploration unlocked':started?'Lesson in progress':'Guided + exploration')+'</span></div><span class="op-open">'+(allowed?(started?'Continue lab':'Begin guided lesson'):'Recovery locked')+'<span aria-hidden="true">↗</span></span></div></'+tag+'>';}).join('')||'<p class="studio-empty">No labs match. Try another concept or discipline.</p>';
    }document.querySelector('#lab-search').addEventListener('input',draw);document.querySelector('#lab-category').addEventListener('change',draw);draw();
  }

  function slider(id, label, min, max, value, step, unit) {
    return '<label class="lab-control"><span><b>' + label + '</b><output id="out-' + id + '">' + value + unit + '</output></span><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '" step="' + step + '"></label>';
  }

  function labFrame(title, subtitle, controls, stage, presets) {
    return '<div class="player-top"><a class="btn sm secondary" href="#/physiology">← Labs</a><span class="pill cyan">Interactive model</span></div><div class="lab-head"><span class="eyebrow">PHYSIOLOGY LAB</span><h1>' + safe(title) + '</h1><p>' + safe(subtitle) + '</p></div>' + safetyNote() + '<div class="lab-layout"><aside class="lab-panel"><h2>Controls</h2>' + controls + (presets || '') + '</aside><section class="lab-stage">' + stage + '</section></div>';
  }

  function bindRanges(ids, update) {
    ids.forEach(function (id) { const el = document.querySelector("#" + id); if (el) el.addEventListener("input", update); });
    update();
  }

  function canvasSetup(canvas) {
    const ratio = window.devicePixelRatio || 1, rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(300, rect.width) * ratio; canvas.height = Math.max(260, rect.height) * ratio;
    const ctx = canvas.getContext("2d"); ctx.scale(ratio, ratio); return { ctx: ctx, w: canvas.width / ratio, h: canvas.height / ratio };
  }

  function renderPVLab() {
    const presets = '<div class="preset-row"><span>Presets</span><button data-preset="normal">Normal</button><button data-preset="as">AS</button><button data-preset="ar">AR</button><button data-preset="mr">MR</button><button data-preset="tamponade">Tamponade</button></div>';
    const controls = slider("preload", "Preload", 40, 160, 110, 5, " mL") + slider("afterload", "Afterload", 50, 180, 95, 5, " mmHg") + slider("contractility", "Contractility", 40, 160, 100, 5, "%") + slider("compliance", "Compliance", 40, 140, 100, 5, "%");
    const stage = '<canvas id="phys-canvas" class="phys-canvas" aria-label="Pressure volume loop"></canvas><div class="lab-readouts" id="pv-readouts"></div><div class="model-explain" id="pv-explain"></div>';
    main().innerHTML = labFrame("Pressure–Volume Loop Lab", "A simplified teaching model of how loading, contractility and compliance reshape the loop. Use the disease presets, then reverse-engineer them.", controls, stage, presets);
    const values = function () { return { pre: +document.querySelector("#preload").value, aft: +document.querySelector("#afterload").value, con: +document.querySelector("#contractility").value, comp: +document.querySelector("#compliance").value }; };
    function update() {
      if (!document.querySelector("#preload") || !document.querySelector("#phys-canvas")) return;
      const v = values(); ["preload", "afterload", "contractility", "compliance"].forEach(function (id) { document.querySelector("#out-" + id).textContent = document.querySelector("#" + id).value + (id === "preload" ? " mL" : id === "afterload" ? " mmHg" : "%"); });
      const esv = Math.max(18, 45 + (v.aft - 95) * .18 - (v.con - 100) * .34); const edv = Math.max(esv + 15, v.pre * (.65 + .35 * v.comp / 100)); const sv = Math.max(10, edv - esv); const ef = Math.round(100 * sv / edv); const pmax = Math.max(45, v.aft + (v.con - 100) * .22);
      const canvas = document.querySelector("#phys-canvas"), c = canvasSetup(canvas), ctx = c.ctx, w = c.w, h = c.h; ctx.clearRect(0, 0, w, h);
      const css = getComputedStyle(document.documentElement); const fg = css.getPropertyValue("--fg-soft"), grid = css.getPropertyValue("--border"), primary = css.getPropertyValue("--primary"), accent = css.getPropertyValue("--g2");
      const m = { l: 52, r: 22, t: 24, b: 42 }, x = function (vol) { return m.l + (vol / 190) * (w - m.l - m.r); }, y = function (p) { return h - m.b - (p / 210) * (h - m.t - m.b); };
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.font = "12px Figtree"; ctx.fillStyle = fg;
      [0, 50, 100, 150, 200].forEach(function (p) { ctx.beginPath(); ctx.moveTo(m.l, y(p)); ctx.lineTo(w - m.r, y(p)); ctx.stroke(); ctx.fillText(p, 15, y(p) + 4); });
      [0, 50, 100, 150].forEach(function (vol) { ctx.beginPath(); ctx.moveTo(x(vol), m.t); ctx.lineTo(x(vol), h - m.b); ctx.stroke(); ctx.fillText(vol, x(vol) - 8, h - 16); });
      ctx.fillText("LV pressure (mmHg)", 8, 14); ctx.fillText("LV volume (mL)", w - 100, h - 7);
      const pts = [[edv, 8], [edv, pmax], [esv, pmax * .78], [esv, 12], [edv, 8]];
      ctx.beginPath(); pts.forEach(function (p, i) { if (i === 0) ctx.moveTo(x(p[0]), y(p[1])); else ctx.lineTo(x(p[0]), y(p[1])); }); ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, w, h); grad.addColorStop(0, primary); grad.addColorStop(1, accent); ctx.strokeStyle = grad; ctx.lineWidth = 4; ctx.stroke(); ctx.globalAlpha = .13; ctx.fillStyle = primary; ctx.fill(); ctx.globalAlpha = 1;
      document.querySelector("#pv-readouts").innerHTML = '<div><span>EDV</span><b>' + Math.round(edv) + ' mL</b></div><div><span>ESV</span><b>' + Math.round(esv) + ' mL</b></div><div><span>SV</span><b>' + Math.round(sv) + ' mL</b></div><div><span>EF</span><b>' + ef + '%</b></div>';
      let explain = "The model predicts "; explain += v.aft > 125 ? "a taller, narrower loop from high afterload. " : v.aft < 70 ? "lower ejection pressure and easier emptying. " : "a mid-range ejection pressure. "; explain += v.con < 75 ? "Reduced contractility raises end-systolic volume." : v.con > 125 ? "Increased contractility lowers end-systolic volume." : "Contractility is near baseline."; document.querySelector("#pv-explain").textContent = explain;
    }
    document.querySelectorAll("[data-preset]").forEach(function (b) { b.onclick = function () { const map = { normal:[110,95,100,100], as:[135,170,105,60], ar:[165,70,110,120], mr:[170,55,120,120], tamponade:[65,90,125,45] }, p = map[b.dataset.preset]; ["preload","afterload","contractility","compliance"].forEach(function (id, i) { document.querySelector("#" + id).value = p[i]; }); update(); }; });
    bindRanges(["preload", "afterload", "contractility", "compliance"], update); window.addEventListener("resize", update, { once: true });
  }

  function renderOxygenLab() {
    const controls = slider("flow", "Pump flow", 2, 7, 4.8, .1, " L/min") + slider("hb", "Hemoglobin", 5, 14, 8, .5, " g/dL") + slider("sat", "SaO₂", 70, 100, 98, 1, "%") + slider("bsa", "BSA", 1.2, 2.6, 1.9, .1, " m²");
    const stage = '<div class="do2-visual"><div class="do2-meter"><span id="do2-fill"></span><b id="do2-value">—</b><small>DO₂ index mL/min/m²</small></div><div class="formula-card"><span>CaO₂</span><b id="cao2">—</b><code>1.34 × Hb × SaO₂ + dissolved O₂</code></div></div><div class="signal-grid" id="do2-signals"></div><div class="model-explain" id="do2-explain"></div>';
    main().innerHTML = labFrame("CPB Oxygen Delivery Lab", "A pressure can look acceptable while organ oxygen delivery is inadequate. Manipulate the components and identify the safest lever.", controls, stage);
    function update() {
      const flow = +document.querySelector("#flow").value, hb = +document.querySelector("#hb").value, sat = +document.querySelector("#sat").value / 100, bsa = +document.querySelector("#bsa").value;
      document.querySelector("#out-flow").textContent = flow.toFixed(1) + " L/min"; document.querySelector("#out-hb").textContent = hb.toFixed(1) + " g/dL"; document.querySelector("#out-sat").textContent = Math.round(sat * 100) + "%"; document.querySelector("#out-bsa").textContent = bsa.toFixed(1) + " m²";
      const cao2 = 1.34 * hb * sat + .3; const do2 = flow * 10 * cao2; const idx = Math.round(do2 / bsa); const pct = Math.min(100, Math.max(5, idx / 5));
      document.querySelector("#cao2").textContent = cao2.toFixed(1) + " mL/dL"; document.querySelector("#do2-value").textContent = idx; document.querySelector("#do2-fill").style.height = pct + "%";
      const state = idx < 240 ? "low" : idx < 280 ? "borderline" : "supported"; document.querySelector("#do2-signals").innerHTML = '<div class="signal ' + state + '"><span>Model status</span><b>' + state + '</b></div><div class="signal"><span>Total DO₂</span><b>' + Math.round(do2) + ' mL/min</b></div><div class="signal"><span>Flow index</span><b>' + (flow / bsa).toFixed(2) + ' L/min/m²</b></div>';
      document.querySelector("#do2-explain").textContent = idx < 280 ? "In this teaching model, inspect flow, hemoglobin and saturation together; raising MAP alone does not guarantee oxygen delivery." : "The modeled oxygen-delivery index is supported. Continue to interpret it with temperature, metabolic demand, venous saturation, lactate and organ signals.";
    }
    bindRanges(["flow", "hb", "sat", "bsa"], update);
  }

  function renderValveLab() {
    const controls = slider("velocity", "Peak velocity", 1, 6, 4, .1, " m/s") + slider("lvot", "LVOT diameter", 1.5, 2.8, 2.1, .1, " cm") + slider("lvotvti", "LVOT VTI", 8, 35, 20, 1, " cm") + slider("avvti", "Aortic VTI", 20, 140, 80, 2, " cm");
    const stage = '<div class="equation-hero"><span>ΔP = 4v²</span><b id="gradient">—</b><small>simplified peak gradient</small></div><div class="valve-orifice"><span id="valve-disc"></span></div><div class="signal-grid" id="valve-signals"></div><div class="model-explain" id="valve-explain"></div>';
    main().innerHTML = labFrame("Valve Hemodynamics Lab", "Link Doppler velocity, simplified Bernoulli and the continuity equation. Then explain when discordant data demand a flow-state check.", controls, stage);
    function update() {
      const v = +document.querySelector("#velocity").value, d = +document.querySelector("#lvot").value, lv = +document.querySelector("#lvotvti").value, av = +document.querySelector("#avvti").value;
      document.querySelector("#out-velocity").textContent = v.toFixed(1) + " m/s"; document.querySelector("#out-lvot").textContent = d.toFixed(1) + " cm"; document.querySelector("#out-lvotvti").textContent = lv + " cm"; document.querySelector("#out-avvti").textContent = av + " cm";
      const grad = Math.round(4 * v * v), area = Math.PI * Math.pow(d / 2, 2) * lv / av, index = lv / av;
      document.querySelector("#gradient").textContent = grad + " mmHg"; document.querySelector("#valve-disc").style.transform = "scale(" + Math.max(.25, Math.min(1, area / 2.5)) + ")";
      document.querySelector("#valve-signals").innerHTML = '<div class="signal"><span>Calculated AVA</span><b>' + area.toFixed(2) + ' cm²</b></div><div class="signal"><span>Dimensionless index</span><b>' + index.toFixed(2) + '</b></div><div class="signal ' + (v >= 4 ? 'low' : 'supported') + '"><span>Velocity band</span><b>' + (v >= 4 ? 'severe range' : 'below high-gradient severe range') + '</b></div>';
      document.querySelector("#valve-explain").textContent = "Do not grade AS from one number. Reconcile velocity, mean gradient, area, dimensionless index, stroke volume, blood pressure, rhythm and image quality.";
    }
    bindRanges(["velocity", "lvot", "lvotvti", "avvti"], update);
  }

  function renderShockLab() {
    const controls = slider("sv", "Stroke volume", 20, 110, 55, 5, " mL") + slider("hr", "Heart rate", 40, 150, 90, 5, "/min") + slider("svr", "SVR", 300, 2000, 900, 50, " dyn·s/cm⁵") + slider("cvp", "CVP", 2, 24, 10, 1, " mmHg");
    const presets = '<div class="preset-row"><span>Phenotypes</span><button data-shock="normal">Stable</button><button data-shock="vasoplegia">Vasoplegia</button><button data-shock="lv">LV failure</button><button data-shock="rv">RV failure</button><button data-shock="tamponade">Tamponade</button></div>';
    const stage = '<div class="monitor"><div class="monitor-line" aria-hidden="true"></div><div class="monitor-grid" id="shock-signals"></div></div><div class="model-explain" id="shock-explain"></div><div class="decision-box"><b>Resident prompt</b><p id="shock-prompt"></p></div>';
    main().innerHTML = labFrame("Post-bypass Shock Cockpit", "Use coupled hemodynamics to name the dominant phenotype before selecting a treatment. The model is intentionally simplified.", controls, stage, presets);
    function update() {
      const sv = +document.querySelector("#sv").value, hr = +document.querySelector("#hr").value, svr = +document.querySelector("#svr").value, cvp = +document.querySelector("#cvp").value, co = sv * hr / 1000, map = Math.round(cvp + co * svr / 80);
      document.querySelector("#out-sv").textContent = sv + " mL"; document.querySelector("#out-hr").textContent = hr + "/min"; document.querySelector("#out-svr").textContent = svr + " dyn·s/cm⁵"; document.querySelector("#out-cvp").textContent = cvp + " mmHg";
      document.querySelector("#shock-signals").innerHTML = '<div><span>MAP</span><b>' + map + '</b><small>mmHg</small></div><div><span>CO</span><b>' + co.toFixed(1) + '</b><small>L/min</small></div><div><span>CVP</span><b>' + cvp + '</b><small>mmHg</small></div><div><span>SVR</span><b>' + svr + '</b><small>dyn·s/cm⁵</small></div>';
      let phenotype = svr < 600 && co > 4 ? "vasoplegic/distributive profile" : cvp > 16 && co < 4 ? "right-sided congestion or obstructive profile" : co < 3.5 ? "low-output pump profile" : "supported profile";
      document.querySelector("#shock-explain").textContent = "The coupled signals suggest a " + phenotype + ". Confirm with TEE, filling pressures, rhythm, surgical result, perfusion and trajectory.";
      document.querySelector("#shock-prompt").textContent = "Before choosing a drip, state what additional signal would distinguish volume, LV failure, RV failure, tamponade and vasoplegia.";
    }
    document.querySelectorAll("[data-shock]").forEach(function (b) { b.onclick = function () { const map = { normal:[65,80,900,8], vasoplegia:[75,105,350,8], lv:[28,115,1400,14], rv:[35,110,1100,20], tamponade:[30,120,1500,22] }, p = map[b.dataset.shock]; ["sv","hr","svr","cvp"].forEach(function (id, i) { document.querySelector("#" + id).value = p[i]; }); update(); }; });
    bindRanges(["sv", "hr", "svr", "cvp"], update);
  }

  function renderLab(id) {
    if (!pacingAllowed("physiology", id, "practice")) { pacingLock("This physiology lab is outside the current recovery buffer."); return; }
    if (window.CSLab && window.CSLab.render(id)) return;
    if (id === "pv-loop") renderPVLab(); else if (id === "oxygen-delivery") renderOxygenLab(); else if (id === "valve") renderValveLab(); else if (id === "shock") renderShockLab(); else location.hash = "#/physiology";
  }

  /* ---- Crisis Room: 14 branching decision-graph cases, one per plan day. ----
     Each case is a graph of decision nodes ({q, v?, opts:[{a,to,k,r}]}) and
     terminal outcomes ({end, t, r}). k = good | ok | bad | fail. Wrong moves
     branch to pitfalls/recoveries; several nodes have more than one acceptable
     route to the good ending. The debrief closes with a summary + key points. */
  function crisisDecisionNodes(c) { return Object.keys(c.nodes).filter(function (id) { return c.nodes[id].opts; }); }
  function crisisSpineLen(c) {
    let id = c.start, n = 0, guard = 0; const seen = {};
    while (c.nodes[id] && c.nodes[id].opts && guard++ < 60) {
      const node = c.nodes[id], gi = node.opts.findIndex(function (o) { return o.k === "good"; });
      if (gi < 0) break; n++; if (seen[id]) break; seen[id] = 1; id = node.opts[gi].to;
    }
    return n;
  }
  function crisisBestScore(c) { const s = crisisScores()[c.id]; if (s == null) return null; return typeof s === "object" ? s.score : s; }
  function vitalsStrip(v) {
    return '<div class="vitals-strip">' + (v || []).slice(0, 4).map(function (p) {
      return '<div><span>' + safe(p[0]) + '</span><b>' + safe(p[1]) + '</b></div>';
    }).join('') + '</div>';
  }

  function crisisCard(c) {
    const best = crisisBestScore(c), dec = crisisSpineLen(c), complete = !!completedCrises()[c.id];
    const allowed = pacingAllowed("crisis", c.id, "browse");
    const inner = '<div class="crisis-code">CR-' + String(c.day).padStart(2, "0") + '</div><span class="pill red">Day ' + c.day + '</span><h2>' + safe(c.title) + '</h2><p>' + safe(c.brief) + '</p><div class="op-meta"><span>' + dec + '+ decisions · branched</span><span>' + (complete ? 'Complete' + (best != null ? ' · best ' + best + ' clean' : '') : best != null ? 'Best ' + best + ' clean' : allowed ? 'Unattempted' : 'Recovery locked') + '</span></div><span class="op-open">' + (allowed ? 'Enter scenario →' : 'Recovery locked') + '</span>';
    return allowed ? '<a class="crisis-card" href="#/crisis/' + c.id + '">' + inner + '</a>'
      : '<div class="crisis-card pacing-locked-card" aria-disabled="true">' + inner + '</div>';
  }
  function renderCrisisHub() {
    const list = D.crises.slice().sort(function (a, b) { return a.day - b.day; });
    let html = sectionHead("Rehearse failure before it is real", "Crisis Room", "One branching emergency for every day of the 14-day plan. Read the trajectory, name the physiology and make the next move under pressure — wrong moves branch to pitfalls you must recover from, and each case debriefs with a summary and key points.");
    html += safetyNote() + '<div class="crisis-grid">' + list.map(crisisCard).join('') + '</div>';
    main().innerHTML = html;
  }

  const crisisState = { item: null, nodeId: null, picked: null, good: 0, faced: 0, trail: [] };
  function renderCrisis(id) {
    const c = crisisById(id); if (!c) { location.hash = "#/crisis"; return; }
    if (!pacingAllowed("crisis", c.id, "practice")) { pacingLock("This Crisis Room is outside the active recovery circuit."); return; }
    crisisState.item = c; crisisState.nodeId = c.start; crisisState.picked = null;
    crisisState.good = 0; crisisState.faced = 0; crisisState.trail = [];
    renderCrisisNode();
  }
  const consequenceTone = {
    good: ["good", "The trace stabilizes."], ok: ["good", "It holds — not the cleanest move, but the patient is safe."],
    bad: ["bad", "The patient slips — you have lost ground."], fail: ["bad", "The patient deteriorates."]
  };
  function renderCrisisNode() {
    const c = crisisState.item;
    if (!c || !pacingAllowed("crisis", c.id, "practice")) { pacingLock("Recovery status changed before the next Crisis Room decision."); return; }
    const node = c.nodes[crisisState.nodeId];
    if (!node) { location.hash = "#/crisis"; return; }
    if (node.end) return renderCrisisDebrief(node);
    const picked = crisisState.picked;
    const cta = window.CardCatalog && CardCatalog.ctaHTML ? CardCatalog.ctaHTML("crisis", c.id) : "";
    let html = '<div class="crisis-shell"><div class="crisis-top"><a href="#/crisis">Exit scenario</a><div class="crisis-timer"><span></span>LIVE</div><b>' + safe(c.setting) + '</b></div>' + cta
      + vitalsStrip(node.v || c.vitals)
      + '<div class="crisis-brief"><span class="eyebrow">EVOLVING CASE · DECISION ' + (crisisState.faced + 1) + '</span><h1>' + safe(c.title) + '</h1><p>' + safe(c.brief) + '</p>' + (crisisState.nodeId === c.start ? figureSlot("crisis", c.id, "overview", "prompt") : "") + '</div>'
      + '<div class="crisis-decision"><h2>' + safe(node.q) + '</h2>'
      + figureSlot("crisis", c.id, crisisState.nodeId, "prompt")
      + node.opts.map(function (o, i) {
          let cls = "crisis-option";
          if (picked !== null) { if (i === picked) cls += (o.k === "good" || o.k === "ok") ? " correct" : " wrong"; else cls += " dim"; }
          return '<button class="' + cls + '" data-opt="' + i + '" ' + (picked !== null ? 'disabled' : '') + '><span>' + String.fromCharCode(65 + i) + '</span>' + safe(o.a) + '</button>';
        }).join('');
    if (picked !== null) {
      const o = node.opts[picked], tone = consequenceTone[o.k] || consequenceTone.bad;
      const terminalNext = c.nodes[o.to] && c.nodes[o.to].end;
      html += '<div class="crisis-consequence ' + tone[0] + '"><b>' + safe(tone[1]) + '</b><p>' + safe(o.r) + '</p></div>'
        + figureSlot("crisis", c.id, crisisState.nodeId, "consequence")
        + '<button class="btn" id="crisis-next">' + (terminalNext ? 'See outcome' : 'Continue') + '</button>';
    }
    html += '</div></div>';
    main().innerHTML = html;
    document.querySelectorAll(".crisis-option").forEach(function (btn) {
      btn.onclick = function () {
        if (!pacingAllowed("crisis", c.id, "practice")) { pacingLock("Recovery status changed before this decision was saved."); return; }
        const i = +btn.dataset.opt, o = node.opts[i];
        crisisState.picked = i; crisisState.faced++;
        if (o.k === "good") crisisState.good++;
        crisisState.trail.push({ q: node.q, a: o.a, k: o.k, r: o.r });
        renderCrisisNode();
      };
    });
    const nextBtn = document.querySelector("#crisis-next");
    if (nextBtn) nextBtn.onclick = function () {
      if (!pacingAllowed("crisis", c.id, "practice")) { pacingLock("Recovery status changed before the next decision."); return; }
      crisisState.nodeId = node.opts[crisisState.picked].to; crisisState.picked = null; renderCrisisNode();
    };
  }
  const outcomeHead = {
    good: ["🫀", "Clean save", "You held the optimal line the whole way through."],
    alive: ["🧭", "Patient survived", "You reached a safe outcome, but the run was not clean — tighten the detours."],
    harm: ["⚠️", "Avoidable harm", "The patient came through with damage that a better sequence would have prevented."],
    dead: ["🕯️", "The patient died", "A wrong turn crossed a point of no return — study the path and run it again."],
    bad: ["⚠️", "Poor outcome", "The sequence broke down — review the consequences and repeat until it is automatic."]
  };
  function renderCrisisDebrief(term) {
    const c = crisisState.item, outcome = term.end;
    const clean = outcome === "good" && crisisState.good === crisisState.faced;
    const scores = crisisScores(), prevBest = crisisBestScore(c), first = scores[c.id] == null;
    if (prevBest == null || crisisState.good > prevBest) {
      scores[c.id] = { score: crisisState.good, faced: crisisState.faced, outcome: outcome, ts: Date.now() };
    } else if (typeof scores[c.id] !== "object") {
      scores[c.id] = { score: prevBest, faced: crisisState.faced, outcome: outcome, ts: Date.now() };
    }
    Store.set("crisis_scores", scores);
    if (first) { addXP(70); if (typeof bumpStreak === "function") bumpStreak(); if (typeof logActivity === "function") logActivity(4); }
    const head = outcomeHead[outcome] || outcomeHead.bad;
    const trailHTML = crisisState.trail.map(function (t, i) {
      const cls = t.k === "good" ? "ok" : t.k === "ok" ? "warn" : "bad";
      return '<div class="crisis-trail-row ' + cls + '"><span>' + String(i + 1).padStart(2, "0") + '</span><p><b>' + safe(t.q) + '</b><br>You chose: ' + safe(t.a) + '<br><i>' + safe(t.r) + '</i></p></div>';
    }).join('');
    const keyHTML = (c.keyPoints || []).map(function (k) { return '<li>' + safe(k) + '</li>'; }).join('');
    const linkHTML = (c.links || []).map(function (l) { return '<a class="btn sm secondary" href="' + l[1] + '">' + safe(l[0]) + '</a>'; }).join('');
    const cta = window.CardCatalog && CardCatalog.ctaHTML ? CardCatalog.ctaHTML("crisis", c.id) : "";
    const alreadyComplete = !!completedCrises()[c.id];
    main().innerHTML = '<div class="crisis-result"><span class="eyebrow">DEBRIEF · DAY ' + c.day + '</span><h1>' + head[0] + ' ' + safe(head[1]) + '</h1>' + cta
      + '<div class="crisis-score">' + crisisState.good + '<small>/' + crisisState.faced + ' clean decisions</small></div>'
      + '<p>' + safe(clean ? head[2] + " Clean run — every call was optimal." : head[2]) + '</p>'
      + '<div class="crisis-trail">' + trailHTML + '</div>'
      + '<div class="crisis-summary"><span class="eyebrow">SUMMARY</span><p>' + safe(c.summary) + '</p></div>'
      + figureSlot("crisis", c.id, "overview", "debrief")
      + '<div class="crisis-keypoints"><span class="eyebrow">KEY POINTS</span><ul>' + keyHTML + '</ul></div>'
      + (linkHTML ? '<div class="crisis-links"><span class="eyebrow">CONNECTED TO THIS DAY</span><div class="crisis-link-row">' + linkHTML + '</div></div>' : "")
      + '<div class="practice-actions"><button class="btn" id="crisis-complete"' + (alreadyComplete ? ' disabled' : '') + '>' + (alreadyComplete ? 'Completed ✓' : 'Mark as complete') + '</button><button class="btn secondary" id="crisis-retry">Run it again</button><a class="btn secondary" href="#/day/' + c.day + '">Day circuit</a><a class="btn secondary" href="#/crisis">All crisis rooms</a></div></div>';
    const completeBtn = document.querySelector("#crisis-complete");
    completeBtn.onclick = function () {
      if (!pacingAllowed("crisis", c.id, "practice")) { pacingLock("Recovery status changed before completion was saved."); return; }
      const completed = completedCrises();
      completed[c.id] = Date.now();
      Store.set("crisis_done", completed);
      completeBtn.textContent = "Completed ✓";
      completeBtn.disabled = true;
      if (typeof toast === "function") toast("Crisis Room marked complete");
    };
    document.querySelector("#crisis-retry").onclick = function () { renderCrisis(c.id); };
  }

  function masteryHTML() {
    const done = doneLessons(), q = qStats(), opDone = doneOps(), cr = crisisScores();
    const domains = [
      ["Anatomy", [1], ["sternotomy"]], ["Coronary", [2,6], ["cabg"]], ["Valves", [3,7], ["savr","mitral-repair"]], ["Aorta", [8], ["type-a"]], ["CPB", [10], ["bypass"]], ["MCS", [9], []], ["Hemostasis", [11], []], ["Rhythm", [12], []], ["ICU", [13], []]
    ];
    const lessonTotal = window.ALL_LESSONS || [];
    return '<div class="mastery-map">' + domains.map(function (d) {
      const ls = lessonTotal.filter(function (l) { return d[1].includes(l.day); }); const lp = ls.length ? ls.filter(function (l) { return done[l.id]; }).length / ls.length : 0;
      const qs = (window.QUESTIONS || []).filter(function (x) { return d[1].includes(x.day) && q[x.id]; }); const qp = qs.length ? qs.reduce(function (a, x) { return a + q[x.id].ok / q[x.id].seen; }, 0) / qs.length : 0;
      const opP = d[2].length ? d[2].filter(function (id) { return opDone[id]; }).length / d[2].length : 0; let pct = Math.round(100 * (.5 * lp + .3 * qp + .2 * opP)); if (d[0] === "ICU" && Object.keys(cr).length) pct = Math.min(100, pct + 10);
      const rank = pct >= 85 ? "Integrated" : pct >= 70 ? "Applied" : pct >= 45 ? "Developing" : "Foundation";
      return '<div class="mastery-row"><div><b>' + d[0] + '</b><span>' + rank + '</span></div><div class="mastery-track"><span style="width:' + pct + '%"></span></div><strong>' + pct + '</strong></div>';
    }).join('') + '</div>';
  }

  function render(parts) {
    if (parts[0] === "surgery") { if (parts[1]) renderOperation(parts[1]); else renderSurgeryHub(); }
    else if (parts[0] === "physiology") { if (parts[1]) renderLab(parts[1]); else renderLabsHub(); }
    else if (parts[0] === "crisis") { if (parts[1]) renderCrisis(parts[1]); else renderCrisisHub(); }
  }

  window.Advanced = { render: render, masteryHTML: masteryHTML, doneOps: doneOps, crisisScores: crisisScores };
})();
