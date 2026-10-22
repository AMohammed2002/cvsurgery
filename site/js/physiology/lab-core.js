/* Shared registry and UI primitives for CardiacSchool physiology trainers. */
(function () {
  "use strict";

  const registry = {};
  let activeCleanup = [];
  let activeClock = null, activeModel = null, activeBaseline = null, loadToken = 0;
  const esc = function (value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };
  const main = function () { return document.querySelector("#main"); };
  const guideIcon = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
  const header = function (lab) {
    return '<div class="lab-topbar">' +
        '<a class="btn sm secondary lab-back" href="#/physiology">← Labs</a>' +
        '<div class="lab-topbar-id"><span class="lab-code-chip">' + esc(lab.code || "LAB") + '</span><h1>' + esc(lab.title) + '</h1></div>' +
        '<div class="lab-topbar-meta"><span class="pill cyan">' + esc(lab.category || "Physiology") + '</span><span class="lab-min">' + esc(lab.minutes || 15) + ' min</span>' +
        '<button type="button" class="lab-guide-btn" data-lab-guide aria-haspopup="dialog">' + guideIcon + '<span>Lesson</span></button></div>' +
      '</div>';
  };
  const lesson = function (lab) {
    const t = lab.teach || {};
    const concept = t.concept || lab.subtitle || "";
    const how = t.how || "Change one control at a time. Predict the effect before you move it, then read how the coupled signals respond together. Jump to a preset or scenario to see a classic pattern, and commit an answer in each challenge to lock in the reasoning.";
    const eqs = t.equations || [];
    return '<div class="lab-lesson" data-lab-lesson hidden><div class="lab-lesson-scrim" data-lab-lesson-close></div>' +
      '<div class="lab-lesson-card" role="dialog" aria-modal="true" aria-label="Lesson: ' + esc(lab.title) + '">' +
        '<button type="button" class="lab-lesson-x" data-lab-lesson-close aria-label="Close lesson">×</button>' +
        '<span class="lab-lesson-eyebrow">LESSON · ' + esc(lab.code || "") + '</span>' +
        '<h2>' + esc(lab.title) + '</h2>' +
        '<div class="lab-lesson-body">' +
          '<section class="lab-lesson-idea"><h3>The idea</h3><p>' + esc(concept) + '</p>' + (eqs.length ? '<div class="lab-lesson-eq">' + eqs.map(function (e) { return '<code>' + esc(e) + '</code>'; }).join("") + '</div>' : "") + '</section>' +
          '<section><h3>What you’ll master</h3><ul>' + (lab.objectives || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></section>' +
          '<section><h3>How to practise</h3><p>' + esc(how) + '</p></section>' +
          (lab.sourceSections && lab.sourceSections.length ? '<section class="lab-lesson-src"><h3>Sources &amp; guide anchors</h3><p>' + esc(lab.sourceSections.join(" · ")) + '</p></section>' : "") +
        '</div>' +
        '<div class="lab-lesson-foot"><label class="lab-lesson-skip"><input type="checkbox" data-lab-lesson-hide> Don’t auto-open this lesson</label><button type="button" class="btn lab-lesson-start" data-lab-lesson-start>Start practising →</button></div>' +
      '</div></div>';
  };
  const frame = function (lab, body) {
    const cards = window.CardCatalog ? window.CardCatalog.ctaHTML("physiology", lab.id) : "";
    const atlas = window.Figures && typeof window.Figures.atlas === "function"
      ? (window.Figures.atlas("physiology", lab.id, { kicker: "Reference atlas", heading: "Illustrated figure atlas" }) || "")
      : "";
    return '<div class="studio-lab" data-lab-id="'+esc(lab.id)+'">'+header(lab) + lesson(lab) + '<div id="studio-guidance"></div><div id="studio-workspace-tools" class="studio-workspace-tools"></div><div class="trainer-frame-body">' + body + '</div><div id="studio-comparison"></div><details class="studio-reference" id="studio-references"><summary>Model, equations &amp; references</summary><div class="studio-reference-body" id="studio-source-notes"></div>'+cards+atlas+'</details></div>';
  };
  function wireLesson(lab) {
    const overlay = document.querySelector("[data-lab-lesson]");
    if (!overlay) return;
    const store = (typeof Store !== "undefined") ? Store : null;
    const hidden = store ? store.get("physiology_lesson_hidden", {}) : {};
    let returnFocus = null;
    let focusFrame = 0;
    function focusables() {
      return Array.from(overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
    }
    function open(event) {
      const guide = document.querySelector("[data-lab-guide]");
      returnFocus = (event && event.currentTarget) || guide || document.activeElement;
      overlay.hidden = false;
      document.body.classList.add("lab-lesson-open");
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(function () {
        if (overlay.hidden) return;
        const start = overlay.querySelector("[data-lab-lesson-start]");
        if (start) start.focus({ preventScroll: true });
      });
    }
    function close() {
      cancelAnimationFrame(focusFrame);
      overlay.hidden = true;
      document.body.classList.remove("lab-lesson-open");
      const target = returnFocus;
      returnFocus = null;
      if (target && target.isConnected && typeof target.focus === "function") {
        target.focus({ preventScroll: true });
      }
    }
    document.querySelectorAll("[data-lab-guide]").forEach(function (b) { b.addEventListener("click", open); });
    overlay.querySelectorAll("[data-lab-lesson-close]").forEach(function (b) { b.addEventListener("click", close); });
    const start = overlay.querySelector("[data-lab-lesson-start]");
    if (start) start.addEventListener("click", function () {
      const cb = overlay.querySelector("[data-lab-lesson-hide]");
      if (cb && cb.checked && store) { hidden[lab.id] = true; store.set("physiology_lesson_hidden", hidden); }
      close();
    });
    function onKey(e) {
      if (overlay.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1], active = document.activeElement;
      if (e.shiftKey && (active === first || !overlay.contains(active))) { e.preventDefault(); last.focus({ preventScroll: true }); }
      else if (!e.shiftKey && (active === last || !overlay.contains(active))) { e.preventDefault(); first.focus({ preventScroll: true }); }
    }
    document.addEventListener("keydown", onKey);
    activeCleanup.push(function () { cancelAnimationFrame(focusFrame); document.removeEventListener("keydown", onKey); document.body.classList.remove("lab-lesson-open"); });
    // Teaching starts in the working surface; the full lesson remains available on demand.
  }
  const range = function (id, label, min, max, value, step, unit) {
    return '<label class="trainer-control"><span><b>' + esc(label) + '</b><output id="out-' + esc(id) + '">' + esc(value) + esc(unit || "") + '</output></span><input id="' + esc(id) + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '" step="' + step + '"></label>';
  };
  const knob = function (id, label, min, max, value, step, unit, tone) {
    return '<div class="trainer-control trainer-knob-control"><span><b>' + esc(label) + '</b><output id="out-' + esc(id) + '">' + esc(value) + esc(unit || "") + '</output></span><div class="trainer-knob ' + esc(tone || "") + '" data-knob-input="' + esc(id) + '" role="slider" tabindex="0" aria-label="' + esc(label) + '" aria-valuemin="' + min + '" aria-valuemax="' + max + '" aria-valuenow="' + value + '"><div class="trainer-knob-face"><i></i><span class="trainer-knob-ticks" aria-hidden="true"></span></div><small>MIN</small><small>MAX</small></div><input class="trainer-knob-native" id="' + esc(id) + '" tabindex="-1" aria-hidden="true" type="range" min="' + min + '" max="' + max + '" value="' + value + '" step="' + step + '"></div>';
  };
  const select = function (id, label, options) {
    return '<label class="trainer-select"><span>' + esc(label) + '</span><select id="' + esc(id) + '">' + options.map(function (o) { return '<option value="' + esc(o.value) + '">' + esc(o.label) + '</option>'; }).join("") + '</select></label>';
  };
  const bind = function (ids, eventName, fn) {
    ids.forEach(function (id) { const el = document.querySelector("#" + id); if (el) el.addEventListener(eventName || "input", fn); });
  };
  const value = function (id) { const el = document.querySelector("#" + id); return el ? +el.value : 0; };
  const text = function (id, value) { const el = document.querySelector("#" + id); if (el) el.textContent = value; };
  const html = function (id, value) { const el = document.querySelector("#" + id); if (el) el.innerHTML = value; };
  const clamp = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); };
  const complete = function (id, score, total) {
    const prior = Store.get("physiology_lab_scores", {});
    const first = !prior[id];
    prior[id] = { score: Math.max(score, prior[id] ? prior[id].score : 0), total: total, at: Date.now() };
    Store.set("physiology_lab_scores", prior);
    if (first && typeof addXP === "function") { addXP(50); if (typeof bumpStreak === "function") bumpStreak(); }
  };

  function initKnobs() {
    document.querySelectorAll("[data-knob-input]").forEach(function (dial) {
      const input = document.querySelector("#" + dial.dataset.knobInput);
      if (!input || dial.dataset.bound) return;
      dial.dataset.bound = "1";
      const min = +input.min, max = +input.max, step = +input.step || 1;
      const precision = String(step).includes(".") ? String(step).split(".")[1].length : 0;
      function sync() {
        const ratio = (+input.value - min) / (max - min || 1);
        dial.style.setProperty("--knob-angle", (-135 + ratio * 270) + "deg");
        dial.style.setProperty("--knob-fill", (ratio * 75) + "%");
        dial.setAttribute("aria-valuenow", input.value);
      }
      function commit(next) {
        const snapped = Math.round((Math.max(min, Math.min(max, next)) - min) / step) * step + min;
        input.value = snapped.toFixed(precision);
        sync();
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      let startY = 0, startValue = 0;
      dial.addEventListener("pointerdown", function (event) {
        startY = event.clientY; startValue = +input.value; dial.setPointerCapture(event.pointerId); dial.classList.add("adjusting"); event.preventDefault();
      });
      dial.addEventListener("pointermove", function (event) {
        if (!dial.hasPointerCapture(event.pointerId)) return;
        commit(startValue + (startY - event.clientY) / 120 * (max - min));
      });
      function release(event) { if (dial.hasPointerCapture(event.pointerId)) dial.releasePointerCapture(event.pointerId); dial.classList.remove("adjusting"); }
      dial.addEventListener("pointerup", release); dial.addEventListener("pointercancel", release);
      dial.addEventListener("wheel", function (event) { event.preventDefault(); commit(+input.value + (event.deltaY < 0 ? step : -step)); }, { passive: false });
      dial.addEventListener("keydown", function (event) {
        let next = +input.value;
        if (event.key === "ArrowUp" || event.key === "ArrowRight") next += step;
        else if (event.key === "ArrowDown" || event.key === "ArrowLeft") next -= step;
        else if (event.key === "PageUp") next += step * 10;
        else if (event.key === "PageDown") next -= step * 10;
        else if (event.key === "Home") next = min;
        else if (event.key === "End") next = max;
        else return;
        event.preventDefault(); commit(next);
      });
      input.addEventListener("input", sync); sync();
    });
  }

  function register(lab) {
    if (!lab || !lab.id || typeof lab.render !== "function") throw new Error("Invalid physiology lab registration");
    if (registry[lab.id] && !registry[lab.id].implementation) throw new Error("Duplicate physiology lab id: " + lab.id);
    registry[lab.id] = lab;
  }

  function teardown() {
    loadToken++;
    if(activeClock)activeClock.destroy();
    activeClock=null;activeModel=null;activeBaseline=null;
    activeCleanup.splice(0).forEach(function (fn) { try { fn(); } catch (_) {} });
  }

  function createClock(){
    let queue=new Map(),next=0,frame=0,last=null,time=0,speed=1,paused=false,destroyed=false;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');paused=motion.matches;
    function schedule(){if(!frame&&!destroyed&&!paused&&!document.hidden&&queue.size)frame=window.requestAnimationFrame(tick);}
    function run(){const batch=Array.from(queue.values());queue.clear();batch.forEach(fn=>fn(time));}
    function tick(now){frame=0;if(destroyed||paused||document.hidden){last=null;return;}time+=last===null?0:Math.min(100,now-last)*speed;last=now;run();schedule();}
    function stop(){if(frame)window.cancelAnimationFrame(frame);frame=0;last=null;}
    function visibility(){stop();schedule();}
    document.addEventListener('visibilitychange',visibility);
    return {raf(fn){const id=++next;queue.set(id,fn);schedule();return id;},cancel(id){queue.delete(id);if(!queue.size)stop();},pause(value){paused=value;stop();if(!value)schedule();},get paused(){return paused;},get time(){return time;},speed(value){speed=value;},seek(value){time=Math.max(0,value);stop();run();schedule();},destroy(){destroyed=true;stop();queue.clear();document.removeEventListener('visibilitychange',visibility);},get pending(){return queue.size;}};
  }

  const implementations=new Map();
  function loadImplementation(file){
    if(implementations.has(file))return implementations.get(file);
    const promise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=file+'?v=launch-1';script.onload=resolve;script.onerror=()=>{implementations.delete(file);script.remove();reject(new Error('Lab implementation unavailable'));};document.head.append(script);});implementations.set(file,promise);return promise;
  }
  function registerMetadata(lab){if(!registry[lab.id])registry[lab.id]=lab;}

  function render(id) {
    const lab = registry[id];
    if (!lab) return false;
    teardown();
    if(typeof lab.render!=='function'){
      const token=loadToken;
      main().innerHTML='<div class="studio-loading" role="status"><span class="eyebrow">Preparing your workspace</span><h1>'+esc(lab.title)+'</h1><p>Loading the model and its controls…</p></div>';
      loadImplementation(lab.implementation).then(()=>{if(token===loadToken)render(id);}).catch(error=>{if(token!==loadToken)return;main().innerHTML='<div class="studio-empty"><h1>This lab could not load</h1><p>Reconnect once to finish downloading this workspace, then it is available offline.</p><button id="studio-retry" class="btn">Try again</button></div>';document.querySelector('#studio-retry').onclick=()=>render(id);});return true;
    }
    activeClock=createClock();
    lab.render({
      lab: lab, main: main, esc: esc, frame: frame, range: range, knob: knob, select: select,
      bind: bind, value: value, text: text, html: html, clamp: clamp, complete: complete,
      cleanup: function (fn) { if (typeof fn === "function") activeCleanup.push(fn); },
      publish: function(model){activeModel=model.measurements?model:{measurements:model};if(window.LabStudio)window.LabStudio.modelChanged(activeModel);},
      baseline: function(){return activeBaseline;}
    });
    initKnobs();
    wireLesson(lab);
    if(window.LabStudio)window.LabStudio.mount(lab,{cleanup:fn=>activeCleanup.push(fn),clock:activeClock,model:()=>activeModel,baseline:()=>activeBaseline,capture:()=>{activeBaseline=activeModel;return activeBaseline;},clearBaseline:()=>{activeBaseline=null;},reset:()=>render(id)});
    return true;
  }

  window.CSLab = {
    register: register,
    registerMetadata: registerMetadata,
    render: render,
    teardown: teardown,
    all: function () { return Object.keys(registry).map(function (id) { return registry[id]; }); },
    get: function (id) { return registry[id]; },
    esc: esc
  };
  window.CSLab.raf=fn=>activeClock?activeClock.raf(fn):window.requestAnimationFrame(fn);
  window.CSLab.cancelRaf=id=>activeClock?activeClock.cancel(id):window.cancelAnimationFrame(id);
  window.CSLab.onCleanup=fn=>activeCleanup.push(fn);
  window.CSLab.snapshot=()=>activeModel;
  window.CSLab.clock=()=>activeClock;
})();
