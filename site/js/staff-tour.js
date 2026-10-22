/* A sequential, interaction-led staff preview. Preview state is tab scoped.
   The tour walks one continuous route: every move between screens is made by the visitor
   clicking the real link the tour highlights, never by the tour jumping pages.
   UI: a spotlight ring on the control to use, an anchored popover beside it, and a pill when
   minimised. No page scrim except a light dim behind the welcome card. */
(function () {
  "use strict";
  const KEY = "staff-tour-v4", $ = selector => document.querySelector(selector);
  const role = () => window.StaffPreview?.role() || null;
  /* First visible match, so header links fall back to the mobile menu button on small screens. */
  const visible = (...selectors) => {
    for (const selector of selectors) for (const el of document.querySelectorAll(selector)) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return el; }
    return null;
  };
  const menuOpen = () => !!$(".academy-header.menu-open");
  const menuLink = (key, href) => () => visible(".academy-header.menu-open .academy-menu-links a[href='" + href + "']") || visible("[data-academy-menu='" + key + "']", "#academy-mobile-menu");
  const labsLink = () => visible(".academy-labs-link") || menuLink("practice", "#/physiology")();
  const LESSON = "#/lesson/d1-coronaries";
  const stops = [
    { id: "welcome", chapter: "Welcome", path: "#/", center: true,
      title: "Welcome to CardiacSchool",
      detail: "This preview follows a student’s route: the landing page, the 14-day plan, a lesson, a practice question, flashcards, awards, then the live labs and an operation. You do each step yourself; the tour shows you where to click next.",
      primary: "Start the tour" },
    { id: "landing", chapter: "Welcome", path: "#/", task: true,
      title: "The student’s front door", instruction: "Scroll down the page. Each band introduces one way students learn.",
      doneTitle: "Understand, remember, explore", payoff: "Short lessons build the map, flashcards keep it, and the labs make it move. Below sits the student’s daily desk.",
      exit: "[data-tour-plan]", next: "Open “View the 14-day course”." },
    { id: "plan", chapter: "Course", path: "#/plan",
      title: "Fourteen days, one route", detail: "Each day builds from coronary anatomy toward operative and critical-care decisions. Every lesson, lab and case sits on a day.",
      exit: ".day-row[data-tour-day='1'] a.chip[href='" + LESSON + "']", next: "Open Day 1’s Coronaries lesson." },
    { id: "lesson", chapter: "Course", path: LESSON, task: true, spot: "#next-chunk",
      title: "A lesson, one idea at a time", detail: "Lessons arrive in short sections, with checkpoints along the way.",
      instruction: "Read the section, then press Next. Keep going until you reach a checkpoint." },
    { id: "question", chapter: "Course", path: LESSON, task: true, spot: () => $(".q-opt")?.parentElement,
      title: "A practice question", instruction: "Answer the checkpoint from memory.",
      doneTitle: "Recall, then feedback", payoff: "Every checkpoint explains its answer, so recall and correction happen together.",
      exit: ".card-source-cta a[href^='#/cards/source/lesson/']", next: "Open this lesson’s flashcards with “Study all”.", avoid: [".explain"] },
    { id: "cards", chapter: "Course", path: "#/cards/source/lesson/d1-coronaries", task: true,
      spot: () => saved?.task?.revealed ? $(".fc-rate") : $("#flip-btn"),
      title: "Flashcards from the same lesson", instruction: "Think of the answer, press Show answer, then rate your recall honestly.",
      doneTitle: "Review follows memory", payoff: "Each rating decides when the card comes back, so review time goes where memory is weakest.",
      exit: menuLink("library", "#/awards"), next: () => menuOpen() ? "Choose Achievements." : "Open Library, then Achievements.", avoid: ["#fc-card"] },
    { id: "awards", chapter: "Awards", path: "#/awards",
      title: "Effort becomes rank", detail: "Lessons, checkpoints and reviews earn XP that climbs the rank ladder. Badges mark milestones such as a first lesson or a seven-day streak.",
      exit: labsLink, next: () => menuOpen() ? "Choose Physiology labs." : "Open Physiology labs." },
    { id: "wheel", chapter: "Labs", path: "#/physiology",
      title: "Fourteen live labs", detail: "Every card opens a working model of one system.",
      exit: ".orbit-card[href='#/physiology/cpb-console']", next: "Open the Perfusion console." },
    { id: "cpb", chapter: "Labs", path: "#/physiology/cpb-console", task: true,
      spot: () => saved?.task?.flow ? $('[data-cpb-action="restore-hb"]') : ($('[data-rotary-for="cpb-flow"]') || $("#cpb-flow")),
      title: "Change the circuit, watch delivery", detail: "A low-delivery state is loaded for you.",
      instruction: "Adjust Pump flow and watch DO₂i.",
      doneTitle: "One number never tells the story", payoff: "Flow moves oxygen delivery, but low haemoglobin still caps it. Learners see linked consequences, not isolated values.",
      exit: labsLink, next: () => menuOpen() ? "Choose Physiology labs." : "Head back to Physiology labs to try another.",
      avoid: [".cpb-circuit", ".cpb-readout-grid", ".cpb-control-bank", ".cpb-fault-bank"] },
    { id: "wheel2", chapter: "Labs", path: "#/physiology",
      title: "Same idea, another system", detail: "Imaging works the same way: move the equipment and watch the anatomy change.",
      exit: ".orbit-card[href='#/physiology/cath-projections']", next: "Open Cath projections." },
    { id: "carm", chapter: "Labs", path: "#/physiology/cath-projections", task: true, spot: ".cath-console",
      title: "One artery, two views", detail: "Moving the C-arm changes which vessels overlap.",
      instruction: "Set rotation to LAO 45° and tilt to caudal 25° for the spider view.",
      doneTitle: "Same anatomy, complementary views", payoff: "The spider view opens the left main; LAO cranial lays out the LAD and its diagonals.",
      exit: menuLink("learn", "#/surgery"), next: () => menuOpen() ? "Choose Operative library." : "Open Learn, then Operative library.", avoid: [".cath-film"] },
    { id: "library", chapter: "Surgery", path: "#/surgery",
      title: "The operative library", detail: "Each operation runs from indication through technique, failure modes and rescue.",
      exit: "a.btn[href='#/surgery/order']", next: "Open “Beat the clock” to rehearse an operation." },
    { id: "order", chapter: "Surgery", path: "#/surgery/order",
      title: "Rebuild an operation", detail: "Every operation with a step list can be rebuilt from scrambled steps.",
      exit: ".sx-deck-row[href='#/surgery/order/cabg']", next: "Open On-Pump Coronary Artery Bypass Grafting." },
    { id: "surgery", chapter: "Surgery", path: "#/surgery/order/cabg", task: true, spot: ".sx-ord-pool",
      title: "Put the operation in order", detail: "An untimed sample with four operative milestones.",
      instruction: "Place the four milestones in order, then grade the sequence.",
      doneTitle: "Anatomy becomes operative order", payoff: "Sequencing asks learners to apply anatomy and physiology to the real steps of an operation.",
      primary: "Finish tour", avoid: [".sx-ord-slot", "#sx-ord-grade", ".celebrate", ".sx-ord-answer"] }
  ];
  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10.5 8.5 3.5 3.5-3.5 3.5"/></svg>',
    minimise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>'
  };
  let saved = read(), box = null, spot = null, badge = null, anchorEl = null, spotEl = null, lastSpot = null;
  let shownSpot = null, churnFrame = 0, side = "", shownKey = "", scrolledKey = "", frame = 0, settleUntil = 0, settleFrame = 0, wheelTimer = 0, hintTimer = 0, pulseTimer = 0, observer = null;
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = () => getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim() || "ease-out";
  const value = v => typeof v === "function" ? v() : v;
  function read() { try { const v = JSON.parse(sessionStorage.getItem(KEY)); return v?.version === 4 ? v : null; } catch (_) { return null; } }
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) {} }
  function current() { return stops[saved?.index] || null; }
  function firstPhase(item) { return item?.task ? "task" : "leave"; }
  function state() { return { role: role(), status: saved?.status || "new", index: saved?.index || 0, total: stops.length, stop: current()?.id || null, chapter: current()?.chapter || null, phase: saved?.phase || "task", task: saved?.task || {} }; }
  function resolve(ref) { if (!ref) return null; const el = typeof ref === "function" ? ref() : $(ref); return el && el.isConnected ? el : null; }

  function showArrival() {
    if ($(".staff-arrival")) return;
    if (!document.documentElement.dataset.theme) { try { const t = JSON.parse(localStorage.getItem("cs_theme")); document.documentElement.dataset.theme = t === "dark" ? "dark" : "light"; } catch (_) { document.documentElement.dataset.theme = "light"; } }
    const el = document.createElement("section"); el.className = "staff-arrival"; el.setAttribute("aria-label", "Choose how to explore CardiacSchool");
    el.innerHTML = '<div class="staff-arrival-card"><span class="staff-eyebrow">CARDIACSCHOOL</span><h1>How are you joining us?</h1><p>Choose your route into the 14-day cardiac surgery training environment.</p><div class="staff-arrival-actions"><button type="button" data-staff-choice="student" data-audience="student"><b>I’m a student</b><span>Continue learning →</span></button><button type="button" data-staff-choice="staff" data-audience="staff"><b>I’m a staff member</b><span>Try the guided preview</span></button></div><p class="staff-arrival-legal">Your progress stays in this browser. <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></p></div>';
    el.addEventListener("click", e => { const choice = e.target.closest("[data-staff-choice]"); if (choice) window.StaffPreview.choose(choice.dataset.staffChoice); });
    document.body.append(el); document.body.classList.add("staff-arrival-open");
  }
  function badgeUI() {
    if (badge || role() !== "staff") return;
    badge = document.createElement("div"); badge.className = "staff-tour-pill staff-preview-badge";
    badge.innerHTML = '<span>Staff preview</span><button type="button" data-tour-replay>Restart tour</button><button type="button" data-tour-switch>Switch audience</button>';
    badge.addEventListener("click", e => { if (e.target.closest("[data-tour-replay]")) start(); if (e.target.closest("[data-tour-switch]")) window.StaffPreview.choose("student"); });
    document.body.append(badge);
  }

  /* ---------- presentation ---------- */
  function removeSpot() { spotEl?.classList.remove("staff-tour-spotlit"); spot?.remove(); spot = null; spotEl = null; lastSpot = null; clearTimeout(pulseTimer); }
  /* Programmatic focus stays invisible until the user touches the keyboard (one ring: the spotlight). */
  function quietFocus(el) {
    if (!el) return;
    el.classList.add("tour-quiet-focus");
    el.addEventListener("blur", () => el.classList.remove("tour-quiet-focus"), { once: true });
    el.focus({ preventScroll: true });
  }
  function clearUI(animate) {
    const old = box; box = null; shownKey = ""; side = ""; anchorEl = null;
    if (old) {
      if (animate && old.animate) old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: ease(), fill: "forwards" }).finished.then(() => old.remove(), () => old.remove());
      else old.remove();
    }
    removeSpot(); observer?.disconnect();
    clearTimeout(hintTimer); hintTimer = 0;
    document.body.classList.remove("staff-tour-active");
  }
  function allowedPath(item) { return item && location.hash === item.path; }
  function instruction(item) {
    if (saved.phase === "leave") return value(item.next) || "";
    if (item.id === "cpb" && saved.task.flow) return "Flow changed. Now choose Correct severe hemodilution and watch DO₂i again.";
    if (item.id === "carm" && saved.task.spider) return "Spider view is open. Keep LAO near 40° and tilt to cranial 25° for the LAD.";
    if (item.id === "cards" && saved.task.revealed) return "Answer revealed. Choose the rating that matches your recall.";
    return item.instruction || "Try the highlighted control.";
  }
  /* What the ring marks and what the popover points at, for the current phase. */
  function targets(item) {
    if (saved.phase === "leave") { const exit = resolve(item.exit); return { anchor: exit, spot: exit }; }
    const el = resolve(item.spot);
    return { anchor: el, spot: el && el.getBoundingClientRect().height <= innerHeight * .6 ? el : null };
  }
  function landingProgress() {
    const desk = $("#training-desk"); if (!desk) return 0;
    const end = desk.getBoundingClientRect().top + scrollY - innerHeight * .5;
    return Math.max(0, Math.min(1, scrollY / Math.max(1, end)));
  }
  function content(item) {
    const n = saved.index + 1, leave = saved.phase === "leave", done = leave && item.task;
    const progress = '<div class="staff-tour-progress" aria-hidden="true"><span style="transform:scaleX(' + (n / stops.length).toFixed(3) + ')"></span></div>';
    const meta = '<div class="staff-tour-meta"><p>' + item.chapter + " · " + n + " of " + stops.length + '</p><button type="button" class="staff-tour-icon-button" data-tour-exit aria-label="Minimise tour" title="Minimise (Esc)">' + ICON.minimise + "</button></div>";
    let body = done ? '<p class="staff-tour-done">' + ICON.check + "Done</p>" : "";
    body += '<h2 id="staff-tour-title">' + (done ? item.doneTitle : item.title) + "</h2>";
    const text = done ? item.payoff : item.detail;
    if (text) body += "<p>" + text + "</p>";
    const say = instruction(item);
    if (say && (!leave || item.exit)) body += '<p class="staff-tour-instruction">' + ICON.go + "<span>" + say + "</span></p>";
    if (item.id === "landing" && !leave) body += '<div class="staff-tour-meter" aria-hidden="true"><span style="transform:scaleX(' + landingProgress().toFixed(3) + ')"></span></div>';
    if (item.id === "carm" && !leave) body += '<div class="staff-tour-targets" aria-label="C-arm target angles"><span>Rotation LAO ' + (saved.task.spider ? "40" : "45") + '°</span><span>Tilt ' + (saved.task.spider ? "cranial 25" : "caudal 25") + '°</span></div><p class="staff-tour-hint" hidden>Drag either C-arm rig, or focus it and use the arrow keys. A view locks when both angles are close.</p>';
    const primary = leave && !item.exit ? (item.primary || "Next") : "";
    const last = saved.index === stops.length - 1;
    const skip = leave && last ? "" : '<button type="button" class="staff-tour-text-button" data-tour-skip>' + (item.id === "welcome" ? "Not now" : "Skip") + "</button>";
    return '<span class="staff-tour-arrow" aria-hidden="true"></span>' + progress + meta + body +
      '<div class="staff-tour-actions">' + (skip || "<span></span>") + (primary ? '<button type="button" class="staff-tour-primary" data-tour-primary>' + primary + "</button>" : "") + "</div>";
  }
  function onBoxClick(e) {
    if (e.target.closest("[data-tour-skip]")) { if (current()?.id === "welcome") exit(); else go(saved.index + 1); }
    else if (e.target.closest("[data-tour-exit]")) exit();
    else if (e.target.closest("[data-tour-primary]")) go(saved.index + 1);
  }
  /* Work a step needs before the visitor can act (load the lab fault, reach the checkpoint). */
  function prepare(item) {
    if (item.id === "lesson" && $(".q-opt")) { go(saved.index + 1); return false; }
    if (item.id === "question" && !$(".q-opt") && !saved.task.answered) { window.StaffTourLesson?.jumpToFirstCheckpoint(); }
    if (item.id === "cpb" && saved.phase === "task" && !saved.task.loaded) { const fault = $("[data-cpb-fault='hemodilution']"); if (fault) { saved.task.loaded = true; persist(); fault.click(); } }
    return true;
  }
  function render() {
    if (role() !== "staff" || saved?.status !== "active") return;
    const item = current(); if (!allowedPath(item)) return;
    if (!prepare(item)) return;
    const key = item.id + ":" + saved.phase, fresh = !box || shownKey.split(":")[0] !== item.id;
    if (!box) {
      box = document.createElement("section"); box.className = "staff-tour-box";
      box.setAttribute("role", "dialog"); box.setAttribute("aria-labelledby", "staff-tour-title");
      box.addEventListener("click", onBoxClick); document.body.append(box);
    }
    const phaseChanged = shownKey !== key;
    box.dataset.tourId = item.id; box.dataset.tourPhase = saved.phase;
    if (phaseChanged && !fresh) box.setAttribute("aria-live", "polite"); else box.removeAttribute("aria-live");
    box.innerHTML = content(item);
    shownKey = key;
    document.body.classList.add("staff-tour-active");

    const t = targets(item);
    anchorEl = item.center ? null : t.anchor;
    if (spotEl && spotEl !== t.spot) spotEl.classList.remove("staff-tour-spotlit");
    spotEl = t.spot;
    if (spotEl) {
      spotEl.classList.add("staff-tour-spotlit");
      if (!spot) { spot = document.createElement("div"); spot.className = "staff-tour-spot"; spot.setAttribute("aria-hidden", "true"); document.body.append(spot); }
      spot.style.setProperty("--spot-radius", spotEl.closest(".academy-nav") ? "999px" : "calc(" + (getComputedStyle(spotEl).borderTopLeftRadius || "0px") + " + 4px)");
      if (spotEl !== lastSpot && !reduced()) { spot.classList.remove("is-pulse"); void spot.offsetWidth; spot.classList.add("is-pulse"); clearTimeout(pulseTimer); pulseTimer = setTimeout(() => spot?.classList.remove("is-pulse"), 700); }
      lastSpot = spotEl;
    } else removeSpot();
    if (phaseChanged || spotEl !== shownSpot) bringIntoView(item);
    shownSpot = spotEl;
    observeTargets();
    place();
    settle(spotEl?.matches(".orbit-card") ? Infinity : 700);
    if (fresh && box.animate) box.animate(reduced() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 200, easing: ease() });

    if (phaseChanged) {
      if (box.querySelector("[data-tour-primary]")) quietFocus(box.querySelector("[data-tour-primary]"));
      else if (saved.phase === "task") {
        const focus = { question: ".q-opt", cpb: "#cpb-flow", carm: '[data-gantry="rot"]', surgery: ".sx-ord-chip", cards: saved.task.revealed ? "#fc-card" : "#flip-btn" }[item.id];
        if (focus) quietFocus($(focus));
      } else if (item.id === "wheel" || item.id === "wheel2") focusWheelWhenReady();
      else if (spotEl && !spotEl.closest(".academy-header")) quietFocus(spotEl);
    }
    if (item.id === "carm" && saved.phase === "task") { window.CathTour?.refreshTourTargets(); clearTimeout(hintTimer); hintTimer = setTimeout(() => { box?.querySelector(".staff-tour-hint")?.removeAttribute("hidden"); place(); }, 20000); }
  }
  /* Scroll each new control into view once, unless the visitor is meant to read or scroll to it. */
  function bringIntoView(item) {
    if (saved.phase === "task" && (item.id === "lesson" || item.id === "landing")) return;
    const el = spotEl || (saved.phase === "task" ? { cpb: $("#cpb-flow"), cards: innerWidth <= 760 ? $("#flip-btn") : null }[item.id] : null);
    const key = item.id + ":" + saved.phase + ":" + (el?.className || ""); if (!el || scrolledKey === key) return; scrolledKey = key;
    if (el.closest(".academy-header")) return;
    const r = el.getBoundingClientRect(), top = headerBottom();
    if (r.top < top + 8 || r.bottom > innerHeight - 8) el.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
  }
  function observeTargets() {
    observer?.disconnect();
    if (!("ResizeObserver" in window)) return;
    observer = observer || new ResizeObserver(schedulePlace);
    [anchorEl, spotEl, box].filter(Boolean).forEach(el => observer.observe(el));
  }
  /* Menus and the lab collection move their items with transforms, which no observer reports. */
  function settle(ms) {
    settleUntil = ms === Infinity ? Infinity : performance.now() + ms;
    if (settleFrame) return;
    const tick = () => { settleFrame = 0; if (!box) return; place(); if (performance.now() < settleUntil) settleFrame = requestAnimationFrame(tick); };
    settleFrame = requestAnimationFrame(tick);
  }
  /* Header nav items fill the bar's full height; ring and arrow use the label instead. */
  function rectOf(el) {
    const r = el.getBoundingClientRect();
    if (!el.closest(".academy-nav")) return r;
    const range = document.createRange(); range.selectNodeContents(el);
    const t = range.getBoundingClientRect();
    return t.width ? { left: t.left - 10, right: t.right + 10, top: t.top - 6, bottom: t.bottom + 6, width: t.width + 20, height: t.height + 12 } : r;
  }
  function headerBottom() { const h = $(".academy-header"); const r = h && h.getBoundingClientRect(); return r && r.bottom > 0 ? r.bottom : 0; }
  function overlap(p, w, h, r) { return Math.max(0, Math.min(p.left + w, r.right) - Math.max(p.left, r.left)) * Math.max(0, Math.min(p.top + h, r.bottom) - Math.max(p.top, r.top)); }
  function unionRect(selector) {
    const rects = [...document.querySelectorAll(selector)].map(el => el.getBoundingClientRect()).filter(r => r.width > 0);
    if (!rects.length) return null;
    return { left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)), top: Math.min(...rects.map(r => r.top)), bottom: Math.max(...rects.map(r => r.bottom)), width: 1 };
  }
  function place() {
    if (!box) return;
    const vw = innerWidth, vh = innerHeight, pad = 12, gap = 14, top0 = headerBottom() + pad;
    if (spot && spotEl?.isConnected) {
      const r = rectOf(spotEl), o = 4, inHeader = !!spotEl.closest(".academy-header");
      spot.style.transform = "translate(" + Math.round(r.left - o) + "px," + Math.round(r.top - o) + "px)";
      spot.style.width = Math.round(r.width + o * 2) + "px"; spot.style.height = Math.round(r.height + o * 2) + "px";
      spot.hidden = r.width === 0 || (!inHeader && r.bottom < top0) || r.top > vh;
    }
    const meter = box.querySelector(".staff-tour-meter span"); if (meter) meter.style.transform = "scaleX(" + landingProgress().toFixed(3) + ")";
    const w = box.offsetWidth, h = box.offsetHeight;
    const item = current();
    if (item?.center) {
      side = "center"; box.dataset.side = "center";
      box.style.left = Math.round((vw - w) / 2) + "px"; box.style.top = Math.round(Math.max(top0, (vh - h) / 2)) + "px";
      box.style.setProperty("--tour-origin", "center"); return;
    }
    const a = anchorEl?.isConnected ? rectOf(anchorEl) : null;
    const inHeader = !!anchorEl?.closest(".academy-header");
    const visibleA = a && a.width > 0 && (inHeader || a.bottom > top0) && a.top < vh;
    const avoid = [visibleA ? a : null, spotEl?.isConnected ? rectOf(spotEl) : null]
      .concat((vw > 760 && saved?.phase === "task" && item?.avoid || []).map(unionRect))
      .concat(menuOpen() ? [$(".academy-menu")?.getBoundingClientRect()] : [])
      .filter(r => r && r.width > 0)
      .map(r => ({ left: r.left - 8, right: r.right + 8, top: r.top - 8, bottom: r.bottom + 8 }));
    const hits = p => avoid.reduce((sum, r) => sum + overlap(p, w, h, r), 0);
    const fits = p => p.left >= pad && p.top >= (inHeader ? pad : top0) && p.left + w <= vw - pad && p.top + h <= vh - pad;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    let sides = [];
    if (vw > 760 && visibleA) {
      const cy = clamp(a.top + a.height / 2 - h / 2, top0, vh - pad - h), cx = clamp(a.left + a.width / 2 - w / 2, pad, vw - pad - w);
      sides = [{ side: "right", left: a.right + gap, top: cy }, { side: "left", left: a.left - gap - w, top: cy }, { side: "bottom", left: cx, top: a.bottom + gap }, { side: "top", left: cx, top: a.top - gap - h }];
      if (inHeader) sides.unshift(sides.splice(2, 1)[0]);
      sides.sort((x, y) => (y.side === side) - (x.side === side));
    }
    const docks = vw > 760
      ? [{ side: "dock", left: vw - pad - w - 8, top: vh - pad - h - 8 }, { side: "dock", left: pad + 8, top: vh - pad - h - 8 }, { side: "dock", left: pad + 8, top: top0 }, { side: "dock", left: vw - pad - w - 8, top: top0 }]
      : [{ side: "dock", left: pad, top: vh - pad - h }, { side: "dock", left: pad, top: top0 }];
    const best = sides.find(p => fits(p) && hits(p) === 0) || docks.find(p => hits(p) === 0) || docks.slice().sort((x, y) => hits(x) - hits(y))[0];
    side = best.side; box.dataset.side = best.side;
    box.style.left = Math.round(best.left) + "px"; box.style.top = Math.round(Math.max(best.side === "bottom" && inHeader ? pad : top0, best.top)) + "px";
    if (best.side !== "dock" && a) {
      const along = best.side === "left" || best.side === "right";
      const arrow = along ? clamp(a.top + a.height / 2 - best.top, 18, h - 18) : clamp(a.left + a.width / 2 - best.left, 18, w - 18);
      box.style.setProperty("--arrow", Math.round(arrow) + "px");
      box.style.setProperty("--tour-origin", { right: "left " + Math.round(arrow) + "px", left: "right " + Math.round(arrow) + "px", bottom: Math.round(arrow) + "px top", top: Math.round(arrow) + "px bottom" }[best.side]);
    } else box.style.setProperty("--tour-origin", best.top > vh / 2 ? "center bottom" : "center top");
  }
  function schedulePlace() {
    if (current()?.id === "landing" && saved?.status === "active" && saved.phase === "task" && allowedPath(current()) && $("#training-desk")?.getBoundingClientRect().top < innerHeight * .55) { succeed(); return; }
    if (frame || !box) return; frame = requestAnimationFrame(() => { frame = 0; place(); });
  }
  function focusWheelWhenReady() {
    if (wheelTimer) return;
    const item = current();
    if ($(".orbit-experience.is-ready")) { quietFocus(resolve(item?.exit)); schedulePlace(); return; }
    wheelTimer = setTimeout(() => { wheelTimer = 0; if (/^wheel/.test(current()?.id || "") && saved?.status === "active") focusWheelWhenReady(); }, 250);
  }

  /* ---------- flow ---------- */
  function succeed() {
    if (!saved || saved.phase === "leave") return;
    const item = current(); if (!item) return;
    if (!saved.tried.includes(item.id)) saved.tried.push(item.id);
    saved.phase = "leave"; persist(); render();
  }
  function enter(index) { saved.index = Math.max(0, index); saved.phase = firstPhase(current()); saved.task = {}; persist(); }
  function go(index) {
    if (!saved) return;
    if (index >= stops.length) { saved.status = "complete"; persist(); clearUI(true); finish(); return; }
    enter(index); clearUI(false);
    const item = current(); if (location.hash !== item.path) location.hash = item.path; else render();
  }
  function record(action, detail) {
    if (role() !== "staff" || saved?.status !== "active" || saved.phase !== "task") return;
    const item = current(); if (!allowedPath(item)) return;
    if (action === "lesson:checkpoint" && (item.id === "question" || item.id === "lesson")) { if (item.id === "lesson") enter(saved.index + 1); saved.task.answered = true; succeed(); return; }
    if (item.id === "cpb") { if (action === "cpb:flow" && +detail?.value !== 3.5) saved.task.flow = true; if (action === "cpb:restore-hb") saved.task.hb = true; persist(); if (saved.task.flow && saved.task.hb) succeed(); else updateTask(); return; }
    if (item.id === "carm" && action === "carm:locked") { if (detail?.id === "lca-lao-caudal") saved.task.spider = true; if (saved.task.spider && detail?.id === "lca-lao-cranial") saved.task.cranial = true; persist(); if (saved.task.cranial) succeed(); else updateTask(); return; }
    if (item.id === "surgery" && action === "surgery:graded") { succeed(); return; }
    if (item.id === "cards") { if (action === "cards:revealed") saved.task.revealed = true; if (action === "cards:rated" && saved.task.revealed) saved.task.rated = true; persist(); if (saved.task.rated) succeed(); else updateTask(); }
  }
  function updateTask() {
    if (!box || saved.phase !== "task") return;
    const el = box.querySelector(".staff-tour-instruction span"); if (el) el.textContent = instruction(current());
    if (current()?.id === "cards" && saved.task.revealed && innerWidth <= 760) requestAnimationFrame(() => $(".fc-rate")?.scrollIntoView({ block: "center" }));
    if (current()?.id === "carm" && saved.task.spider) { const spans = box.querySelectorAll(".staff-tour-targets span"); if (spans.length === 2) { spans[0].textContent = "Rotation LAO 40°"; spans[1].textContent = "Tilt cranial 25°"; } $("[data-cath-labels][aria-pressed='false']")?.click(); }
    retarget();
  }
  /* The actionable control can change inside a step (flow, then haemoglobin; menu, then link). */
  function retarget() {
    const item = current(); if (!box || !item) return;
    const t = targets(item);
    const say = instruction(item), el = box.querySelector(".staff-tour-instruction span");
    if ((t.spot && t.spot !== spotEl) || (t.anchor && t.anchor !== anchorEl) || (el && el.textContent !== say)) render(); else schedulePlace();
  }
  /* Following the highlighted link moves the tour on before the next screen renders, so that
     screen opens in its tour state (single sample card, untimed operation). */
  function followLink(e) {
    if (role() !== "staff" || saved?.status !== "active" || saved.phase !== "leave") return;
    const link = e.target.closest("a[href]"), next = stops[saved.index + 1];
    if (!link || !next || link.getAttribute("href") !== next.path || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const from = location.hash, index = saved.index;
    enter(index + 1); clearUI(false);
    /* A drag on the lab collection cancels its navigation: step back so the highlight returns. */
    setTimeout(() => { if (saved?.status === "active" && saved.index === index + 1 && location.hash === from && !allowedPath(current())) { saved.index = index; saved.phase = "leave"; saved.task = {}; persist(); render(); } }, 2500);
  }
  function finish() {
    const panel = document.createElement("section"); panel.className = "staff-tour-complete"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-labelledby", "staff-tour-done-title");
    panel.innerHTML = '<div><h2 id="staff-tour-done-title">That is the preview</h2><p>You followed a student’s route: the plan, a lesson, a practice question, its flashcards, awards, two live labs and an operation. Everything stays open to explore at your own pace.</p><div class="staff-tour-actions"><span></span><button type="button" class="staff-tour-primary" data-tour-explore>Explore the app</button></div></div>';
    panel.addEventListener("click", e => { if (e.target.closest("[data-tour-explore]")) panel.remove(); });
    document.body.append(panel);
    if (panel.animate) panel.firstElementChild.animate(reduced() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: ease() });
    quietFocus(panel.querySelector("[data-tour-explore]"));
  }
  function showResume() {
    clearUI(true); if (saved?.status !== "paused") return;
    let button = $(".staff-tour-minimized");
    if (!button) { button = document.createElement("button"); button.type = "button"; button.className = "staff-tour-pill staff-tour-minimized"; button.dataset.tourResume = ""; button.onclick = resume; document.body.append(button); }
    const n = (saved.index || 0) + 1;
    button.innerHTML = "Tour " + n + "/" + stops.length + " · <b>Resume</b>";
    button.setAttribute("aria-label", "Resume staff tour, step " + n + " of " + stops.length + ", " + (current()?.chapter || "Welcome"));
  }
  function start() { if (role() !== "staff") return; badgeUI(); $(".staff-tour-complete")?.remove(); $(".staff-tour-minimized")?.remove(); saved = { version: 4, status: "active", index: 0, phase: "leave", task: {}, tried: [], skipped: [] }; persist(); go(0); }
  function startIfNeeded() { if (role() !== "staff") return; badgeUI(); if (!saved) start(); else if (saved.status === "active") { if (allowedPath(current())) render(); else { saved.status = "paused"; persist(); showResume(); } } else if (saved.status === "paused") showResume(); }
  function exit() { if (!saved) return; saved.status = "paused"; persist(); showResume(); }
  function resume() { if (role() !== "staff" || !saved) return; saved.status = "active"; enter(saved.index); $(".staff-tour-minimized")?.remove(); if (!allowedPath(current())) location.hash = current().path; else render(); }
  function onRoute() {
    if (role() !== "staff" || !saved || saved.status !== "active") return;
    if (allowedPath(current())) { render(); return; }
    const next = stops[saved.index + 1];
    if (saved.phase === "leave" && next && location.hash === next.path) { enter(saved.index + 1); clearUI(false); render(); return; }
    exit();
  }
  /* DOM churn (lab re-renders, lazy content, the landing story mounting): re-render if our targets changed, else re-place. */
  function schedule() {
    if (churnFrame) return;
    churnFrame = requestAnimationFrame(() => {
      churnFrame = 0;
      const item = current();
      if (saved?.status !== "active" || !allowedPath(item)) return;
      if (!box) { render(); return; }
      if (!prepare(item)) return;
      retarget();
    });
  }
  document.addEventListener("click", followLink, true);
  document.addEventListener("click", e => {
    if (saved?.status !== "active") return;
    if (saved.phase === "task" && current()?.id === "cpb" && e.target.closest('[data-cpb-action="restore-hb"]')) record("cpb:restore-hb");
    if (box) setTimeout(() => { schedule(); settle(500); }, 0);
  });
  document.addEventListener("input", e => { if (e.target?.id === "cpb-flow") record("cpb:flow", { value: e.target.value }); });
  document.addEventListener("keydown", e => {
    if (!["Shift", "Control", "Alt", "Meta"].includes(e.key)) document.querySelectorAll(".tour-quiet-focus").forEach(el => el.classList.remove("tour-quiet-focus"));
    if (saved?.status === "active" && e.key === "Escape" && box && !menuOpen()) { exit(); $(".staff-tour-minimized")?.focus({ preventScroll: true }); }
  });
  addEventListener("resize", schedulePlace);
  /* The spotlight and popover follow their target while the page scrolls (rAF-throttled, read-only layout). */
  addEventListener("scroll", schedulePlace, { passive: true, capture: true });
  document.addEventListener("DOMContentLoaded", () => { const main = $("#main"); if (main) new MutationObserver(schedule).observe(main, { childList: true, subtree: true }); if (role() === "staff") startIfNeeded(); });
  window.StaffTour = { role, state, record, choose: next => window.StaffPreview.choose(next), showArrival, start, startIfNeeded, exit, resume, onRoute, isCardSample: () => role() === "staff" && saved?.status === "active" && current()?.id === "cards", cardSampleIndex: () => 0, isSurgerySample: () => role() === "staff" && saved?.status === "active" && current()?.id === "surgery", isSurgerySecond: () => false, lessonIndex: () => 0 };
})();
