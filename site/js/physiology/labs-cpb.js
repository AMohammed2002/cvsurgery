/* CardiacSchool CPB trainers: educational console and staged surgery rehearsal. */
(function () {
  "use strict";
  const requestAnimationFrame = fn => window.CSLab.raf(fn), cancelAnimationFrame = id => window.CSLab.cancelRaf(id);

  if (!window.CSLab) return;

  const BSA = 1.9;
  const TARGET_FLOW = 2.4 * BSA;

  function n(value, digits) {
    return Number(value).toFixed(digits == null ? 0 : digits);
  }

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function setText(id, value) {
    const el = document.querySelector("#" + id);
    if (el) el.textContent = value;
  }

  function setHTML(id, value) {
    const el = document.querySelector("#" + id);
    if (el) el.innerHTML = value;
  }

  function range(id, label, min, max, value, step, unit, hint) {
    const pct = ((value - min) / (max - min)) * 100;
    const turn = -135 + pct * 2.7;
    const occluder = /venous|suction|vent/.test(id) ? " occluder" : "";
    return '<div class="cpb-knob' + occluder + '" data-rotary-for="' + id + '">' +
      '<div class="cpb-control-label"><b id="label-' + id + '">' + label + '</b><output id="out-' + id + '">' + value + (unit || "") + '</output></div>' +
      '<div class="cpb-dial-row"><div class="cpb-dial-scale" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="cpb-rotary" role="slider" tabindex="0" aria-labelledby="label-' + id + '" aria-describedby="hint-' + id + '" aria-valuemin="' + min + '" aria-valuemax="' + max + '" aria-valuenow="' + value + '" style="--turn:' + turn + 'deg;--arc:' + (pct * 2.7) + 'deg"><span class="cpb-rotary-cap"><i></i></span></div>' +
      '<div class="cpb-dial-limits" aria-hidden="true"><span>' + min + '</span><span>' + max + '</span></div></div>' +
      '<input class="cpb-native-range" id="' + id + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '" step="' + step + '" tabindex="-1" aria-hidden="true">' +
      '<small id="hint-' + id + '">' + hint + '</small></div>';
  }

  function initializeRotaries(root, onChange) {
    (root || document).querySelectorAll("[data-rotary-for]").forEach(function (module) {
      const input = document.querySelector("#" + module.dataset.rotaryFor);
      const dial = module.querySelector(".cpb-rotary");
      if (!input || !dial || dial.dataset.bound) return;
      dial.dataset.bound = "true";
      let dragging = false;
      let startY = 0;
      let startValue = 0;

      function decimals() {
        const raw = String(input.step || "1");
        return raw.indexOf(".") < 0 ? 0 : raw.split(".")[1].length;
      }

      function sync(value, notify) {
        const min = +input.min;
        const max = +input.max;
        const step = +input.step || 1;
        const snapped = clamp(Math.round((clamp(value, min, max) - min) / step) * step + min, min, max);
        input.value = snapped.toFixed(decimals());
        const pct = ((snapped - min) / (max - min)) * 100;
        dial.style.setProperty("--arc", (pct * 2.7) + "deg");
        dial.style.setProperty("--turn", (-135 + pct * 2.7) + "deg");
        dial.setAttribute("aria-valuenow", input.value);
        const exact = module.querySelector('.studio-number');
        if (exact && document.activeElement !== exact) exact.value = input.value;
        if (notify) {
          input.dispatchEvent(new Event("input", { bubbles: true }));
          if (onChange) onChange(input);
        }
      }

      module._syncRotary = function () { sync(+input.value, false); };
      input.addEventListener('input', function () { sync(+input.value, false); });
      dial.addEventListener("pointerdown", function (event) {
        dragging = true;
        startY = event.clientY;
        startValue = +input.value;
        dial.setPointerCapture(event.pointerId);
        dial.classList.add("turning");
        event.preventDefault();
      });
      dial.addEventListener("pointermove", function (event) {
        if (!dragging) return;
        const sensitivity = (+input.max - +input.min) / 180;
        sync(startValue + (startY - event.clientY) * sensitivity, true);
      });
      function stop(event) {
        if (!dragging) return;
        dragging = false;
        dial.classList.remove("turning");
        if (event && dial.hasPointerCapture(event.pointerId)) dial.releasePointerCapture(event.pointerId);
      }
      dial.addEventListener("pointerup", stop);
      dial.addEventListener("pointercancel", stop);
      dial.addEventListener("wheel", function (event) {
        event.preventDefault();
        sync(+input.value + (event.deltaY < 0 ? 1 : -1) * (+input.step || 1), true);
      }, { passive: false });
      dial.addEventListener("keydown", function (event) {
        let delta = 0;
        const step = +input.step || 1;
        if (event.key === "ArrowUp" || event.key === "ArrowRight") delta = step;
        if (event.key === "ArrowDown" || event.key === "ArrowLeft") delta = -step;
        if (event.key === "PageUp") delta = step * 10;
        if (event.key === "PageDown") delta = -step * 10;
        if (event.key === "Home") { sync(+input.min, true); event.preventDefault(); return; }
        if (event.key === "End") { sync(+input.max, true); event.preventDefault(); return; }
        if (delta) { sync(+input.value + delta, true); event.preventDefault(); }
      });
      sync(+input.value, false);
    });
  }

  function syncRotaries(root) {
    (root || document).querySelectorAll("[data-rotary-for]").forEach(function (module) {
      if (module._syncRotary) module._syncRotary();
    });
  }

  function metric(id, label, unit, tone) {
    return '<div class="cpb-metric ' + (tone || "") + '" id="metric-' + id + '"><span>' + label + '</span><strong id="' + id + '">—</strong><small>' + unit + '</small></div>';
  }

  function button(action, label, tone) {
    return '<button class="cpb-action ' + (tone || "") + '" type="button" data-cpb-action="' + action + '">' + label + '</button>';
  }

  const COMMAND_LABELS = ["Heparin & ACT", "Check the circuit", "Go on bypass", "Clamp & protect", "Cool to 32°C", "Redose cardioplegia", "Rewarm slowly", "Ventilate & de-air", "Prepare separation", "Come off bypass", "Reverse heparin", "Decannulate"];
  const COMMAND_LANES = [0, 0, 1, 2, 1, 2, 1, 2, 1, 1, 0, 0];

  function trackHTML(surgery) {
    return '<section class="cpb-command-track" aria-label="Surgeon procedure command track"><div class="cpb-track-current">' +
      (surgery ? '' : '<span class="cpb-track-eyebrow">OR INTERCOM · FREE PRACTICE</span><h2>Your circuit. Your controls.</h2><p>Explore the console, or respond to the surgeon through a complete bypass case.</p><a class="cpb-track-start" href="#/physiology/cpb-surgery">Begin surgeon commands →</a>') +
      '</div><div class="cpb-track-screen"><header><span><i></i> SURGEON COMMAND TRACK</span><b id="cpb-track-progress">PREVIEW · 12 STEPS</b></header><div class="cpb-highway"><div class="cpb-track-hit"><span>RESPOND HERE</span></div><div class="cpb-track-lanes"><span>PREPARE</span><span>PERFUSE</span><span>PROTECT</span></div><div class="cpb-track-notes" id="cpb-track-notes"></div></div><footer><span id="cpb-track-cue">Set the console → verify → confirm</span><span>UPCOMING COMMANDS ←</span></footer></div></section>';
  }

  function updateTrack(stage, score, finished) {
    setText('cpb-track-progress', finished ? 'CASE COMPLETE · ' + score + '/12 FIRST PASS' : String(stage + 1).padStart(2, '0') + ' / 12 · ' + score + ' FIRST PASS');
    setHTML('cpb-track-notes', COMMAND_LABELS.map(function (label, i) {
      const offset = i - stage;
      if (offset < 0 || offset > 3 || finished) return '';
      return '<div class="cpb-track-note lane-' + COMMAND_LANES[i] + (offset === 0 ? ' current' : '') + '" style="--slot:' + offset + ';--lane:' + COMMAND_LANES[i] + '"><span>' + String(i + 1).padStart(2, '0') + '</span><b>' + label + '</b></div>';
    }).join('') + (finished ? '<div class="cpb-track-complete">✓ &nbsp; PROCEDURE COMPLETE</div>' : ''));
  }

  // Both existing simulations share a single desktop instrument layout.
  function mountWorkstation(surgery) {
    const body = document.querySelector('.trainer-frame-body');
    const shell = body.querySelector(surgery ? '.cpb-surgery-shell' : '.cpb-command-deck');
    const nav = body.querySelector('.cpb-mode-links');
    nav.insertAdjacentHTML('afterbegin', '<a class="cpb-exit" href="#/physiology" aria-label="Back to physiology labs">← Labs</a><span class="cpb-wordmark">CARDIAC<span>SCHOOL</span><small>PERFUSION STUDIO</small></span>');
    nav.insertAdjacentHTML('beforeend', '<span class="cpb-nav-caption">HLM–01 <i></i> EDUCATIONAL WORKSTATION</span>');
    body.classList.add('cpb-workstation');
    body.classList.toggle('is-surgery', surgery);
    shell.insertAdjacentHTML('afterbegin', trackHTML(surgery));
    if (surgery) {
      const current = shell.querySelector('.cpb-track-current');
      current.append(shell.querySelector('.cpbs-command-card'));
      const bank = shell.querySelector('.cpbs-machine');
      const center = shell.querySelector('.cpbs-scenario');
      const metrics = bank.querySelector('.cpbs-mini-metrics');
      const monitor = center.querySelector('.cpbs-monitor-row');
      const temp = document.createElement('div');
      temp.innerHTML = consoleHTML();
      const circuit = temp.querySelector('.cpb-circuit');
      circuit.querySelectorAll('[id]').forEach(el => el.id = el.id.replace(/^cpb-/, 'cpbs-live-'));
      circuit.id = 'cpbs-live-circuit';
      circuit.querySelector('.cpb-cpg').remove();
      circuit.querySelector('.cpb-aux-module').remove();
      const bezel = temp.querySelector('.cpb-machine-bezel');
      center.replaceChildren(bezel, circuit, metrics, monitor);
      bank.querySelector('.cpbs-mini-circuit').remove();
      const head = bank.querySelector('.cpbs-machine-head');
      head.insertAdjacentHTML('beforeend', '<span class="cpb-case-label">CABG ×3 · BSA 1.90 m² · RCA chronic total occlusion</span>');
      shell.querySelector('.cpbs-case-banner').replaceWith(head);
      const actions = bank.querySelector('.cpbs-action-grid');
      shell.append(actions);
      const transcript = shell.querySelector('.cpbs-transcript-panel');
      const dialog = document.createElement('dialog');
      dialog.className = 'cpb-notes-dialog';
      dialog.innerHTML = '<form method="dialog"><button class="cpb-action">Close notes ×</button></form>';
      dialog.append(transcript);
      shell.append(dialog);
      nav.insertAdjacentHTML('beforeend', '<button class="cpb-notes-open" type="button">Case notes</button>');
      nav.querySelector('.cpb-notes-open').addEventListener('click', () => dialog.showModal());
      const knobs = document.createElement('div');
      knobs.className = 'cpb-surgery-knobs';
      Array.from(bank.children).forEach(el => knobs.append(el));
      bank.append(knobs);
    } else {
      const faultBank = shell.querySelector('.cpb-fault-bank');
      shell.append(faultBank);
      const select = document.createElement('select');
      select.id = 'cpb-fault-select';
      select.setAttribute('aria-label', 'Select circuit fault');
      select.innerHTML = FAULTS.map(f => '<option value="' + f.id + '">' + f.label + '</option>').join('');
      faultBank.prepend(select);
      select.addEventListener('change', () => shell.querySelector('[data-cpb-fault="' + select.value + '"]').click());
      const notes = shell.querySelector('.cpb-lower-grid');
      const dialog = document.createElement('dialog');
      dialog.className = 'cpb-notes-dialog';
      dialog.innerHTML = '<form method="dialog"><button class="cpb-action">Close notes ×</button></form>';
      dialog.append(notes);
      shell.append(dialog);
      nav.insertAdjacentHTML('beforeend', '<button class="cpb-notes-open" type="button">Lab notes</button>');
      nav.querySelector('.cpb-notes-open').addEventListener('click', () => dialog.showModal());
    }
    shell.insertAdjacentHTML('beforeend', '<div class="cpb-workstation-foot"><span><i></i> SIMULATION · Educational relationships, not clinical dosing</span><span>DRAG DIALS ↕ &nbsp; · &nbsp; ARROW KEYS TO FINE-TUNE</span></div>');
    updateTrack(0, 0, false);
    if (!surgery) setText('cpb-track-progress', 'FREE PRACTICE · CASE PREVIEW');
  }

  function derive(s) {
    const flow = s.pumpRunning ? s.flow : 0;
    const flowIndex = flow / BSA;
    const venousReturn = Math.max(0, (s.venous / 100) * 5.4 - (s.venousObstruction || 0));
    const pao2 = clamp(35 + 475 * s.fio2 * s.oxygenator, 30, 520);
    const sao2 = CSModels.saturation(pao2) * 100;
    const paco2 = clamp(40 * (3.5 / Math.max(0.5, s.sweep)) * (TARGET_FLOW / Math.max(1, flow || TARGET_FLOW)), 20, 90);
    const cao2 = CSModels.oxygenContent(s.hb, sao2 / 100, pao2);
    const do2 = flow * cao2 * 10;
    const do2i = do2 / BSA;
    const vo2 = 235 * Math.pow(1.07, s.temperature - 37);
    const oxygen = CSModels.oxygen({flow:flow,hb:s.hb,sat:sao2/100,po2:pao2,demand:vo2});
    const svo2 = oxygen.svo2;
    const arterialOutlet = s.temperature + (s.heater - s.temperature) * .75;
    const linePressure = flow > 0 ? 55 + flow * 31 * s.lineResistance : 0;
    const map = CSModels.meanPressure(flow, s.svr, s.cvp == null ? 5 : s.cvp);
    const hct = s.hb * 3;
    const drainageMargin = venousReturn - flow;
    return {
      flow: flow, flowIndex: flowIndex, venousReturn: venousReturn, pao2: pao2, sao2: sao2,
      paco2: paco2, cao2: cao2, do2: do2, do2i: do2i, svo2: svo2,
      linePressure: linePressure, map: map, hct: hct, drainageMargin: drainageMargin, arterialOutlet:arterialOutlet, oxygen:oxygen
    };
  }

  function alarms(s, d) {
    const list = [];
    if (s.air) list.push({ level: "critical", title: "ARTERIAL AIR", detail: "Stop arterial flow, clamp the arterial line, announce the event, and follow the local air-management pathway." });
    if (s.act < 480 && s.pumpRunning) list.push({ level: "critical", title: "ACT BELOW CPB THRESHOLD", detail: "Circuit thrombosis and systemic embolization are possible. Give heparin and recheck ACT." });
    if (s.reservoir < 0.35 && s.pumpRunning) list.push({ level: "critical", title: "RESERVOIR CRITICALLY LOW", detail: "Reduce flow before the reservoir entrains air; communicate, restore venous return, and find the volume loss." });
    else if (s.reservoir < 0.65 && s.pumpRunning) list.push({ level: "warning", title: "RESERVOIR FALLING", detail: "Drainage is not matching arterial return. Trend level, inspect cannula/lines, and coordinate volume." });
    if (d.linePressure > 300) list.push({ level: "critical", title: "HIGH ARTERIAL LINE PRESSURE", detail: "Reduce flow and exclude kink, clamp, malposition, small cannula, or arterial obstruction before restoring target flow." });
    if (d.pao2 < 150 && s.pumpRunning) list.push({ level: "critical", title: "OXYGENATOR OUTLET HYPOXEMIA", detail: "Maximize oxygen fraction, verify gas supply and connections, obtain post-oxygenator gas, and prepare oxygenator change-out if failure persists." });
    if (d.do2i < 280 && s.pumpRunning) list.push({ level: "warning", title: "LOW INDEXED OXYGEN DELIVERY", detail: "DO₂i is low. Integrate flow, hemoglobin, saturation, temperature, and expected oxygen consumption rather than treating one number." });
    if (d.map < 55 && s.pumpRunning) list.push({ level: "warning", title: "LOW PERFUSION PRESSURE", detail: "Check flow adequacy first, then distinguish low vascular tone from mechanical inflow/outflow problems." });
    if (d.arterialOutlet >= 37) list.push({ level: "critical", title: "CEREBRAL HYPERTHERMIA RISK", detail: "Stop active warming and verify all temperature sites. Avoid overshoot during rewarming." });
    if (d.drainageMargin < -0.7 && s.pumpRunning) list.push({ level: "warning", title: "VENOUS DRAINAGE DEFICIT", detail: "Pump demand exceeds venous return. Reduce flow and correct volume, cannula position, line obstruction, air lock, or excessive negative pressure." });
    if (s.suction > 80) list.push({ level: "warning", title: "HIGH CARDIOTOMY SUCTION", detail: "Excess suction increases blood trauma, hemolysis, air–blood interface, and microembolic load. Use only what the field requires." });
    return list;
  }

  window.CSCPBModel={derive:derive,alarms:alarms};
  const FAULTS = [
    { id: "baseline", label: "Stable full bypass", brief: "Normal reference state", apply: { flow: 4.6, venous: 92, reservoir: 1.25, fio2: 0.7, sweep: 3.5, hb: 8.8, act: 525, oxygenator: 1, lineResistance: 1, svr: 1000, temperature: 34, heater: 34, air: false, suction: 35, venousObstruction: 0 }, goal: "Explain why a normal-looking pump flow is not enough: verify ACT, pressure, gas transfer, reservoir, DO₂i, and temperature together." },
    { id: "drainage", label: "Venous chatter", brief: "Poor drainage with a falling reservoir", apply: { flow: 5.1, venous: 48, reservoir: 0.55, venousObstruction: 1.1 }, goal: "Reduce arterial flow first, then improve venous drainage. Do not respond by simply increasing pump speed." },
    { id: "reservoir", label: "Rapid reservoir loss", brief: "Return exceeds drainage", apply: { flow: 5.4, venous: 35, reservoir: 0.28, venousObstruction: 1.5 }, goal: "Prevent air entrainment: reduce/stop flow, announce the loss, search for obstruction or surgical volume loss, and restore a safe level." },
    { id: "arterial", label: "High line pressure", brief: "Outflow obstruction", apply: { flow: 5.2, lineResistance: 2.1, reservoir: 1.1 }, goal: "Reduce flow and identify a kink, clamp, cannula malposition, small cannula, or arterial pathology before returning to target flow." },
    { id: "oxygenator", label: "Oxygenator failure", brief: "Low post-oxygenator PO₂", apply: { oxygenator: 0.18, fio2: 0.45, sweep: 3.5 }, goal: "Increase FiO₂, verify gas source and sampling, obtain a post-oxygenator gas, and prepare for change-out if oxygen transfer remains inadequate." },
    { id: "co2", label: "CO₂ retention", brief: "Sweep gas too low", apply: { sweep: 0.7, fio2: 0.7 }, goal: "Increase sweep to improve CO₂ removal. FiO₂ predominantly controls oxygenation; sweep predominantly controls CO₂ clearance." },
    { id: "hemodilution", label: "Low DO₂i", brief: "Severe hemodilution plus marginal flow", apply: { hb: 5.8, flow: 3.5, fio2: 0.7, oxygenator: 1 }, goal: "Restore indexed oxygen delivery by integrating flow and oxygen content; consider the cause, temperature, bleeding, and local transfusion strategy." },
    { id: "act", label: "ACT drift", brief: "Inadequate anticoagulation on bypass", apply: { act: 360 }, goal: "Administer heparin, communicate, and repeat ACT. A target above 480 seconds is used in this guide; follow the local protocol clinically." },
    { id: "heat", label: "Rewarming overshoot", brief: "Arterial outlet above 37°C", apply: { temperature: 38.2, heater: 39 }, goal: "Stop active warming, reduce heat-exchanger set point, compare temperature sites, and avoid cerebral hyperthermia." },
    { id: "vasoplegia", label: "Vasoplegia", brief: "Adequate flow with low MAP", apply: { flow: 4.8, svr: 560, reservoir: 1.1 }, goal: "Confirm flow and circuit integrity; recognize low vascular tone rather than reflexively driving excessive pump flow." },
    { id: "air", label: "Arterial air alarm", brief: "Catastrophic air hazard", apply: { air: true }, goal: "Stop the arterial pump, clamp the arterial line, announce the event, identify the source, and follow the local de-airing/emergency pathway." }
  ];

  function consoleState() {
    return {
      flow: 4.6, venous: 92, reservoir: 1.25, fio2: 0.7, sweep: 3.5, heater: 34,
      temperature: 34, hb: 8.8, act: 525, oxygenator: 1, lineResistance: 1,
      svr: 1000, suction: 35, vent: 30, venousObstruction: 0, air: false,
      pumpRunning: true, cardioplegia: false, cardioplegiaRoute: "antegrade",
      currentFault: "baseline", acknowledged: false, events: []
    };
  }

  function consoleHTML() {
    const faultButtons = FAULTS.map(function (f) {
      return '<button type="button" class="cpb-fault" data-cpb-fault="' + f.id + '"><b>' + f.label + '</b><small>' + f.brief + '</small></button>';
    }).join("");
    return '<div class="cpb-mode-links" aria-label="CPB lab modes"><a class="active" href="#/physiology/cpb-console">Console lab</a><a href="#/physiology/cpb-surgery">Surgery command mode</a></div>' +
      '<section class="cpb-command-deck" aria-label="Heart-lung machine training console">' +
        '<div class="cpb-deck-top"><div><span class="cpb-status-dot" id="cpb-status-dot"></span><b id="cpb-pump-status">PUMP RUNNING</b><small>Adult teaching circuit · BSA 1.90 m² · target flow ≈ 4.56 L/min</small></div>' +
          '<div class="cpb-deck-actions">' + button("pump", "Stop pump", "danger") + button("volume", "+250 mL reservoir") + button("heparin", "Give heparin") + button("ack", "Acknowledge alarms", "muted") + '</div></div>' +
        '<div class="cpb-alarm-strip" id="cpb-alarm-strip" role="status" aria-live="polite"></div>' +
        '<div class="cpb-console-grid">' +
          '<aside class="cpb-control-bank"><h2>Pump & drainage</h2>' +
            range("cpb-flow", "Pump flow", 0, 6.5, 4.6, 0.1, " L/min", "Target is individualized; 2.2–2.6 L/min/m² is a common teaching range.") +
            range("cpb-venous", "Venous occluder / drainage", 0, 100, 92, 1, "%", "Opening drainage increases venous return; excessive assisted drainage can chatter or entrain air.") +
            range("cpb-suction", "Cardiotomy suction", 0, 100, 35, 1, "%", "Use enough for the field while limiting blood trauma and air–blood contact.") +
            range("cpb-vent", "LV / root vent", 0, 100, 30, 1, "%", "Venting supports decompression and de-airing; excessive suction can entrain air or injure tissue.") +
            '<h2>Gas blender</h2>' +
            range("cpb-fio2", "Oxygenator FiO₂", 0.21, 1, 0.7, 0.01, "", "Primarily changes post-oxygenator oxygen tension and arterial oxygen content.") +
            range("cpb-sweep", "Sweep gas", 0.5, 10, 3.5, 0.1, " L/min", "Primarily changes CO₂ clearance across the membrane oxygenator.") +
            '<h2>Heat & vascular tone</h2>' +
            range("cpb-heater", "Heat-exchanger set point", 20, 39, 34, 0.1, "°C", "Change temperature gradually and compare perfusate, nasopharyngeal, and core sites.") +
            range("cpb-svr", "Patient SVR", 400, 1800, 1000, 20, " dyn·s/cm⁵", "A model control for vascular tone: low SVR lowers MAP despite adequate flow.") +
          '</aside>' +
          '<section class="cpb-machine-stage">' +
            '<div class="cpb-machine-bezel"><div class="cpb-bezel-label"><b>CARDIACSCHOOL HLM / EDUCATIONAL WORKSTATION</b><span>Relationship trainer · not a certified medical device</span></div><div class="cpb-annunciators"><i class="green"></i><i class="amber"></i><i class="red"></i><span>POWER&nbsp;&nbsp; CAUTION&nbsp;&nbsp; ALARM</span></div></div>' +
            '<div class="cpb-circuit" id="cpb-circuit" aria-label="Animated heart-lung machine circuit. Blood drains from the patient to a venous reservoir, passes through the oxygenator and centrifugal pump, then returns through the arterial filter.">' +
              '<div class="cpb-patient"><span>OPERATIVE FIELD / PATIENT</span><strong id="cpb-patient-map">MAP —</strong><small>venous drainage ↓ &nbsp; arterial return ↑</small></div>' +
              '<div class="cpb-tube venous" id="cpb-tube-venous"><i></i></div><div class="cpb-tube arterial" id="cpb-tube-arterial"><i></i></div><div class="cpb-tube circuit-link one"><i></i></div><div class="cpb-tube circuit-link two"><i></i></div>' +
              '<div class="cpb-component reservoir" id="cpb-reservoir"><span class="cpb-fluid" id="cpb-fluid"><i></i></span><span class="cpb-level-scale" aria-hidden="true">2.0<br>1.5<br>1.0<br>0.5<br>0</span><b>VENOUS RESERVOIR</b><strong id="cpb-reservoir-value">—</strong><small>level sensor · low-level interlock</small><em class="cpb-clamp-indicator">OCCLUDER</em></div>' +
              '<div class="cpb-component oxygenator" id="cpb-oxygenator"><span class="cpb-oxygenator-core" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><b>MEMBRANE OXYGENATOR</b><strong id="cpb-gas-value">—</strong><small>integrated heat exchanger</small><div class="cpb-gas-ports"><span>O₂ IN</span><span>CO₂ OUT</span><span>WATER</span></div></div>' +
              '<div class="cpb-component pump" id="cpb-pump"><span class="cpb-pump-housing"><span class="cpb-impeller" aria-hidden="true"></span></span><b>CENTRIFUGAL PUMP</b><strong id="cpb-pump-value">—</strong><small>preload / afterload sensitive</small></div>' +
              '<div class="cpb-component filter"><span class="cpb-filter-mesh" aria-hidden="true"></span><b>ARTERIAL FILTER</b><strong id="cpb-line-value">—</strong><small>bubble detector armed</small></div>' +
              '<div class="cpb-gas-module"><b>GAS BLENDER</b><div><span>FiO₂</span><strong id="cpb-blender-fio2">—</strong></div><div><span>SWEEP</span><strong id="cpb-blender-sweep">—</strong></div><small>fresh gas → oxygenator</small></div>' +
              '<div class="cpb-heat-module"><b>HEATER–COOLER</b><span class="cpb-thermometer"><i id="cpb-heat-column"></i></span><strong id="cpb-hx-display">—</strong><small>set / patient</small></div>' +
              '<div class="cpb-cpg"><b>CARDIOPLEGIA / MYOCARDIAL PROTECTION</b><label>Delivery route <select id="cpb-cpg-route"><option value="antegrade">Antegrade</option><option value="retrograde">Retrograde</option><option value="combined">Combined</option></select></label>' + button("cpg", "Start cardioplegia", "cold") + '<small id="cpb-cpg-status">Standby · verify pressure, temperature, dose, route and redose interval</small></div>' +
              '<div class="cpb-aux-module"><b>FIELD SUCTION / VENT</b><span><i class="suction"></i>Cardiotomy</span><span><i class="vent"></i>Root / LV vent</span><small>Use minimum effective negative pressure</small></div>' +
            '</div>' +
            '<div class="cpb-wave-console" aria-label="Live simulated circuit trends"><div><span>ARTERIAL PRESSURE</span><svg viewBox="0 0 600 54" preserveAspectRatio="none"><path class="cpb-gridline" d="M0 13.5H600M0 27H600M0 40.5H600"></path><path id="cpb-wave-pressure" class="cpb-wave pressure" d=""></path></svg></div><div><span>VENOUS RETURN / FLOW</span><svg viewBox="0 0 600 54" preserveAspectRatio="none"><path class="cpb-gridline" d="M0 13.5H600M0 27H600M0 40.5H600"></path><path id="cpb-wave-flow" class="cpb-wave flow" d=""></path></svg></div></div>' +
            '<div class="cpb-readout-grid">' + metric("cpb-m-flow", "Flow index", "L/min/m²") + metric("cpb-m-map", "MAP", "mmHg") + metric("cpb-m-line", "Arterial line", "mmHg") + metric("cpb-m-drain", "Venous return", "L/min") + metric("cpb-m-hb", "Hb / Hct", "g/dL / %") + metric("cpb-m-sao2", "SaO₂ / SvO₂", "%") + metric("cpb-m-gas", "PaO₂ / PaCO₂", "mmHg") + metric("cpb-m-act", "ACT", "seconds") + metric("cpb-m-temp", "Core / arterial outlet", "°C") + metric("cpb-m-do2", "DO₂i", "mL/min/m²", "feature") + '</div>' +
            '<div class="cpb-formula"><b>Live oxygen-delivery calculation</b><div id="cpb-formula"></div><p>CaO₂ = 1.34 × Hb × SaO₂ + 0.003 × PaO₂. DO₂ = pump flow × CaO₂ × 10; DO₂i = DO₂ / BSA. This simplified model teaches relationships, not clinical dosing.</p></div>' +
          '</section>' +
          '<aside class="cpb-fault-bank"><h2>Fault injection</h2><p>Load a state, read the coupled signals, intervene, then test your correction.</p><div class="cpb-fault-list">' + faultButtons + '</div><h2>Corrective actions</h2><div class="cpb-intervention-list" id="cpb-intervention-list">' +
            button("fix-drainage", "Inspect/reposition venous cannula") + button("fix-arterial", "Remove arterial obstruction") +
            button("replace-oxygenator", "Verify gas / replace oxygenator") + button("restore-hb", "Correct severe hemodilution") +
            button("treat-tone", "Coordinate vasopressor support") + button("clear-air", "Clamp / de-air arterial circuit", "danger") +
          '</div><button class="btn" id="cpb-evaluate" type="button">Evaluate correction</button><div id="cpb-challenge-result" class="cpb-challenge-result" aria-live="polite"></div></aside>' +
        '</div>' +
        '<div class="cpb-lower-grid">' +
          '<article class="cpb-learning-card"><span class="cpb-card-kicker">PERFUSION MENTAL MODEL</span><h2>Read the machine as one circulation</h2><ol><li><b>Safety gate:</b> adequate anticoagulation, no air, sufficient reservoir volume.</li><li><b>Flow path:</b> drainage and preload must support the pump; line pressure must permit safe return.</li><li><b>Gas exchange:</b> FiO₂ changes oxygenation; sweep changes CO₂ clearance.</li><li><b>Organ delivery:</b> MAP alone is not oxygen delivery. Integrate flow, Hb, SaO₂, temperature, and DO₂i.</li><li><b>Myocardial protection:</b> cross-clamp time, temperature, delivery route, redose interval, and coronary anatomy all matter.</li></ol></article>' +
          '<article class="cpb-learning-card"><span class="cpb-card-kicker">ALARM DISCIPLINE</span><h2>First response is containment</h2><p>A low reservoir, arterial air, high line pressure, or inadequate ACT can become catastrophic faster than a perfect diagnosis can be made. Make the circuit safe, say the problem out loud, coordinate with the surgeon and anesthesia team, then correct the mechanism.</p><div id="cpb-event-log" class="cpb-event-log"><div><time>Ready</time><span>Console initialized in stable full bypass.</span></div></div></article>' +
          '<article class="cpb-learning-card"><span class="cpb-card-kicker">CARDIOPLEGIA PEARL</span><h2>Route follows coronary anatomy</h2><p>Antegrade delivery follows the coronary arterial tree and may miss territories distal to severe stenoses. Retrograde delivery through the coronary sinus broadens distribution but protects the RV incompletely because much RV venous return bypasses the coronary sinus. Complex multivessel disease commonly prompts combined delivery and down-the-graft dosing.</p></article>' +
        '</div>' +
      '</section>';
  }

  function bindConsole(api, s) {
    const ids = ["cpb-flow", "cpb-venous", "cpb-suction", "cpb-vent", "cpb-fio2", "cpb-sweep", "cpb-heater", "cpb-svr"];
    let timer = null;
    let phase = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function waveform(base, amplitude, speed, pulse) {
      const points = [];
      for (let x = 0; x <= 600; x += 6) {
        const t = (x / 600) * Math.PI * speed + phase;
        let y = base + Math.sin(t) * amplitude;
        if (pulse) {
          const beat = ((x + phase * 22) % 92) / 92;
          y = base - (beat < 0.08 ? beat / 0.08 * amplitude * 1.8 : beat < 0.18 ? (1 - (beat - 0.08) / 0.1) * amplitude * 1.8 : Math.sin(t) * amplitude * 0.18);
        }
        points.push((x ? "L" : "M") + x + " " + clamp(y, 3, 51).toFixed(1));
      }
      return points.join(" ");
    }

    function log(message, level) {
      s.events.unshift({ time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), message: message, level: level || "" });
      s.events = s.events.slice(0, 8);
      setHTML("cpb-event-log", s.events.map(function (e) { return '<div class="' + e.level + '"><time>' + e.time + '</time><span>' + e.message + '</span></div>'; }).join(""));
    }

    function readControls() {
      ids.forEach(function (id) {
        const el = document.querySelector("#" + id);
        if (!el) return;
        const key = id.replace("cpb-", "");
        s[key] = +el.value;
      });
      const route = document.querySelector("#cpb-cpg-route");
      if (route) s.cardioplegiaRoute = route.value;
    }

    function writeControls() {
      ids.forEach(function (id) {
        const key = id.replace("cpb-", "");
        const el = document.querySelector("#" + id);
        if (el && s[key] != null) el.value = s[key];
      });
      syncRotaries(document.querySelector(".cpb-command-deck"));
    }

    function update() {
      if (!document.querySelector("#cpb-flow")) { if (timer) cancelAnimationFrame(timer); return; }
      readControls();
      const d = derive(s);
      const activeAlarms = alarms(s, d);
      syncRotaries(document.querySelector('.cpb-command-deck'));
      api.publish({model:d,measurements:{"Flow index":d.flowIndex.toFixed(2)+" L/min/m²","MAP":d.map.toFixed(1)+" mmHg","CaO₂":d.cao2.toFixed(2)+" mL/dL","DO₂i":d.do2i.toFixed(1)+" mL/min/m²","SaO₂":d.sao2.toFixed(1)+"%","SvO₂":d.svo2.toFixed(1)+"%","Patient core":s.temperature.toFixed(1)+" °C","Arterial outlet":d.arterialOutlet.toFixed(1)+" °C","Heater water":s.heater.toFixed(1)+" °C"}});
      const units = { flow: " L/min", venous: "%", suction: "%", vent: "%", fio2: "", sweep: " L/min", heater: "°C", svr: " dyn·s/cm⁵" };
      ids.forEach(function (id) {
        const key = id.replace("cpb-", "");
        const out = document.querySelector("#out-" + id);
        if (out) out.textContent = (key === "fio2" ? n(s[key], 2) : n(s[key], key === "flow" || key === "sweep" || key === "heater" ? 1 : 0)) + units[key];
      });
      setText("cpb-pump-status", s.pumpRunning ? "PUMP RUNNING" : "PUMP STOPPED");
      const pumpSwitch = document.querySelector('.cpb-command-deck [data-cpb-action="pump"]');
      if (pumpSwitch) { pumpSwitch.textContent = s.pumpRunning ? 'Stop pump' : 'Start pump'; pumpSwitch.setAttribute('aria-pressed', String(s.pumpRunning)); }
      const statusDot = document.querySelector("#cpb-status-dot");
      if (statusDot) statusDot.className = "cpb-status-dot " + (activeAlarms.some(function (a) { return a.level === "critical"; }) ? "critical" : activeAlarms.length ? "warning" : "ok");
      const pump = document.querySelector("#cpb-pump");
      if (pump) pump.classList.toggle("stopped", !s.pumpRunning);
      const circuit = document.querySelector("#cpb-circuit");
      if (circuit) {
        circuit.classList.toggle("flowing", s.pumpRunning && d.flow > 0);
        circuit.classList.toggle("air-event", s.air);
        circuit.style.setProperty("--flow-duration", clamp(3.2 - d.flow * 0.38, 0.65, 3.2) + "s");
      }
      setText("cpb-reservoir-value", n(s.reservoir, 2) + " L");
      const fluid = document.querySelector("#cpb-fluid");
      if (fluid) fluid.style.height = clamp(s.reservoir / 2 * 100, 0, 100) + "%";
      setText("cpb-gas-value", "O₂ " + n(d.pao2) + " / CO₂ " + n(d.paco2));
      setText("cpb-pump-value", n(d.flow, 1) + " L/min");
      setText("cpb-line-value", n(d.linePressure) + " mmHg");
      setText("cpb-patient-map", "MAP " + n(d.map) + " mmHg");
      setText("cpb-blender-fio2", n(s.fio2, 2));
      setText("cpb-blender-sweep", n(s.sweep, 1) + " L/min");
      setText("cpb-hx-display", n(s.heater, 1) + " / " + n(s.temperature, 1) + "°C");
      const heatColumn = document.querySelector("#cpb-heat-column");
      if (heatColumn) heatColumn.style.height = clamp((s.heater - 20) / 19 * 100, 0, 100) + "%";
      const pressureWave = document.querySelector("#cpb-wave-pressure");
      const flowWave = document.querySelector("#cpb-wave-flow");
      if (pressureWave) pressureWave.setAttribute("d", waveform(30, s.pumpRunning ? 0.6 : 0, 10, false));
      if (flowWave) flowWave.setAttribute("d", waveform(27, s.pumpRunning ? clamp(Math.abs(d.drainageMargin) * 4 + 2, 2, 12) : 0.4, 18, false));
      setText("cpb-m-flow", n(d.flowIndex, 2));
      setText("cpb-m-map", n(d.map));
      setText("cpb-m-line", n(d.linePressure));
      setText("cpb-m-drain", n(d.venousReturn, 1));
      setText("cpb-m-hb", n(s.hb, 1) + " / " + n(d.hct));
      setText("cpb-m-sao2", n(d.sao2) + " / " + n(d.svo2));
      setText("cpb-m-gas", n(d.pao2) + " / " + n(d.paco2));
      setText("cpb-m-act", n(s.act));
      setText("cpb-m-temp", n(s.temperature, 1) + " / " + n(d.arterialOutlet, 1));
      setText("cpb-m-do2", n(d.do2i));
      setHTML("cpb-formula", '<span>CaO₂ <b>' + n(d.cao2, 1) + ' mL/dL</b></span><span>DO₂ <b>' + n(d.do2) + ' mL/min</b></span><span>DO₂i <b>' + n(d.do2i) + ' mL/min/m²</b></span>');
      const alarmHTML = activeAlarms.length ? activeAlarms.map(function (a) { return '<div class="' + a.level + '"><b>' + a.title + '</b><span>' + a.detail + '</span></div>'; }).join("") : '<div class="clear"><b>NO ACTIVE ALARMS</b><span>Continue trending; a quiet alarm panel does not replace circuit surveillance.</span></div>';
      setHTML("cpb-alarm-strip", alarmHTML);
      ["cpb-m-map", "cpb-m-line", "cpb-m-act", "cpb-m-do2", "cpb-m-temp"].forEach(function (id) { const el = document.querySelector("#metric-" + id); if (el) el.classList.remove("bad", "warn"); });
      function tone(id, cls) { const el = document.querySelector("#metric-" + id); if (el) el.classList.add(cls); }
      if (d.map < 55) tone("cpb-m-map", "warn");
      if (d.linePressure > 300) tone("cpb-m-line", "bad");
      if (s.act < 480) tone("cpb-m-act", "bad");
      if (d.do2i < 280) tone("cpb-m-do2", "warn");
      if (d.arterialOutlet >= 37) tone("cpb-m-temp", "bad");
    }

    function tick() {
      if (!document.querySelector("#cpb-flow")) { cancelAnimationFrame(timer); return; }
      readControls();
      const d = derive(s);
      if (s.pumpRunning) s.reservoir = clamp(s.reservoir + (d.venousReturn - d.flow) / 60, 0, 2);
      s.temperature += (s.heater - s.temperature) * 0.025;
      if (!reducedMotion) phase += 0.42;
      update();
    }

    initializeRotaries(document.querySelector(".cpb-command-deck"));
    ids.forEach(function (id) { const el = document.querySelector("#" + id); if (el) el.addEventListener("input", update); });
    const route = document.querySelector("#cpb-cpg-route");
    if (route) route.addEventListener("change", update);

    document.querySelectorAll("[data-cpb-action]").forEach(function (el) {
      el.addEventListener("click", function () {
        const action = el.dataset.cpbAction;
        if (action === "pump") {
          s.pumpRunning = !s.pumpRunning;
          el.textContent = s.pumpRunning ? "Stop pump" : "Start pump";
          log(s.pumpRunning ? "Arterial pump restarted after circuit safety check." : "Arterial pump stopped; flow to patient is zero.", s.pumpRunning ? "" : "critical");
        } else if (action === "volume") {
          s.reservoir = clamp(s.reservoir + 0.25, 0, 2);
          log("250 mL added to the modeled reservoir. Reassess the reason volume was needed.");
        } else if (action === "heparin") {
          s.act = clamp(s.act + 150, 0, 700);
          log("Heparin administered in the model; repeat ACT is required before relying on the value.");
        } else if (action === "ack") {
          s.acknowledged = true;
          log("Alarms acknowledged. Acknowledgment silences nothing physiologic; correct each cause.");
        } else if (action === "cpg") {
          s.cardioplegia = !s.cardioplegia;
          el.textContent = s.cardioplegia ? "Stop cardioplegia" : "Start cardioplegia";
          setText("cpb-cpg-status", s.cardioplegia ? s.cardioplegiaRoute + " delivery active" : "Standby");
          log((s.cardioplegia ? "Started " : "Stopped ") + s.cardioplegiaRoute + " cardioplegia delivery.");
        } else if (action === "fix-drainage") {
          s.venousObstruction = 0;
          s.venous = Math.max(s.venous, 92);
          const control = document.querySelector("#cpb-venous"); if (control) control.value = s.venous;
          log("Venous line inspected and cannula repositioned; obstruction/chatter resolved in the model.", "pass");
        } else if (action === "fix-arterial") {
          s.lineResistance = 1;
          log("Arterial line traced from pump to cannula; modeled kink/clamp obstruction removed.", "pass");
        } else if (action === "replace-oxygenator") {
          s.oxygenator = 1;
          log("Gas source and blender verified; modeled oxygenator change-out completed with team coordination.", "pass");
        } else if (action === "restore-hb") {
          s.hb = Math.max(s.hb, 7.5);
          log("Severe hemodilution corrected in the model after integrating bleeding, DO₂i, temperature, and the local blood strategy.", "pass");
        } else if (action === "treat-tone") {
          s.svr = Math.max(s.svr, 850);
          const control = document.querySelector("#cpb-svr"); if (control) control.value = s.svr;
          log("Low vascular tone communicated and modeled vasopressor support coordinated without excessive pump flow.", "pass");
        } else if (action === "clear-air") {
          s.pumpRunning = false;
          s.air = false;
          const pumpButton = document.querySelector('[data-cpb-action="pump"]'); if (pumpButton) pumpButton.textContent = "Start pump";
          log("Arterial flow stopped, line clamped, event announced, and modeled circuit de-airing pathway completed.", "critical");
        }
        update();
      });
    });

    document.querySelectorAll("[data-cpb-fault]").forEach(function (el) {
      el.addEventListener("click", function () {
        const fault = FAULTS.find(function (f) { return f.id === el.dataset.cpbFault; });
        if (!fault) return;
        const baseline = FAULTS[0].apply;
        Object.keys(baseline).forEach(function (key) { s[key] = baseline[key]; });
        Object.keys(fault.apply).forEach(function (key) { s[key] = fault.apply[key]; });
        s.pumpRunning = true;
        s.currentFault = fault.id;
        writeControls();
        document.querySelectorAll(".cpb-fault").forEach(function (b) { b.classList.toggle("selected", b.dataset.cpbFault === fault.id); });
        setHTML("cpb-challenge-result", '<div class="prompt"><b>Your objective</b><p>' + fault.goal + '</p></div>');
        log("FAULT LOADED — " + fault.label + ": " + fault.brief, fault.id === "baseline" ? "" : "warning");
        update();
      });
    });

    const evaluate = document.querySelector("#cpb-evaluate");
    if (evaluate) evaluate.addEventListener("click", function () {
      readControls();
      const d = derive(s);
      let pass = false;
      if (s.currentFault === "baseline") pass = s.pumpRunning && d.flowIndex >= 2.2 && d.flowIndex <= 2.6 && d.do2i >= 280 && s.act >= 480;
      if (s.currentFault === "drainage") pass = d.drainageMargin > -0.4 && s.reservoir >= 0.45;
      if (s.currentFault === "reservoir") pass = (!s.pumpRunning || d.flow <= d.venousReturn + 0.3) && s.reservoir >= 0.35;
      if (s.currentFault === "arterial") pass = d.flow <= 3 && d.linePressure < 300;
      if (s.currentFault === "oxygenator") pass = s.oxygenator >= 0.9 && d.pao2 >= 150;
      if (s.currentFault === "co2") pass = d.paco2 >= 35 && d.paco2 <= 45;
      if (s.currentFault === "hemodilution") pass = d.do2i >= 280 && s.hb >= 7.5;
      if (s.currentFault === "act") pass = s.act >= 480;
      if (s.currentFault === "heat") pass = s.heater < 37 && d.arterialOutlet < 37 && s.temperature <= 37;
      if (s.currentFault === "vasoplegia") pass = d.flowIndex >= 2.2 && d.flowIndex <= 2.8 && d.map >= 55 && s.svr >= 800;
      if (s.currentFault === "air") pass = !s.pumpRunning && !s.air;
      const f = FAULTS.find(function (item) { return item.id === s.currentFault; });
      setHTML("cpb-challenge-result", '<div class="' + (pass ? "pass" : "retry") + '"><b>' + (pass ? "Immediate correction accepted" : "Circuit is not yet safe") + '</b><p>' + (pass ? "You contained the modeled threat. Now verbalize the mechanism, team communication, confirmatory test, and criteria for restoring full support." : (f ? f.goal : "Reassess the coupled signals.")) + '</p></div>');
      if (pass) { api.complete("cpb-console", 1, 1); log("Challenge contained: " + (f ? f.label : "CPB state") + ".", "pass"); }
      update();
    });

    log("Console initialized in stable full bypass.");
    update();
    let lastTick = 0;
    function circuitFrame(now) { if (now - lastTick >= 1000) { lastTick = now; tick(); } timer = requestAnimationFrame(circuitFrame); }
    timer = requestAnimationFrame(circuitFrame);
    api.cleanup(function () { if (timer) cancelAnimationFrame(timer); });
  }

  const SURGERY_STAGES = [
    { role: "Surgeon", command: "Heparin in. Let me know when the ACT is safe for cannulation.", task: "Administer heparin and obtain an ACT above the lab threshold before allowing circuit exposure.", check: function (s) { return s.act >= 480; }, consequence: "Proceeding with inadequate anticoagulation risks oxygenator/circuit thrombosis and systemic embolization.", success: "ACT is above 480 seconds; communicate the exact value and proceed under the local protocol." },
    { role: "Surgeon", command: "Aortic and venous cannulas are in. Confirm the circuit is ready.", task: "Complete the pre-bypass line check: clamps/occluders, gas supply, reservoir, pressure line, air detector, and cannula connections.", check: function (s) { return s.linesChecked; }, consequence: "An unrecognized clamp, reversed connection, air, or inadequate reservoir can cause immediate catastrophe at initiation.", success: "Circuit and cannula connections are verbally confirmed; the team shares the initiation plan." },
    { role: "Surgeon", command: "Go on bypass. Drain the heart and take us to full flow.", task: "Start the pump and advance deliberately to 2.2–2.6 L/min/m² while maintaining a safe reservoir.", check: function (s, d) { return s.pumpRunning && d.flowIndex >= 2.2 && d.flowIndex <= 2.6 && s.reservoir >= 0.5; }, consequence: "Too little flow risks hypoperfusion; outrunning venous return collapses the reservoir and risks air entrainment.", success: "Full indexed flow is established with matched drainage, acceptable line pressure, MAP, and reservoir level." },
    { role: "Surgeon", command: "Vent is on. Cross-clamp. Give antegrade cold blood cardioplegia.", task: "Confirm the vent, apply the cross-clamp state, select antegrade delivery, and deliver the first dose.", check: function (s) { return s.ventOn && s.clamped && s.cardioplegia && s.cpgRoute === "antegrade"; }, consequence: "Cross-clamping without prompt effective cardioplegia exposes the myocardium to global ischemia; an ineffective vent permits distension.", success: "The heart is decompressed and protected with antegrade arrest; observe arrest quality and delivery pressure." },
    { role: "Surgeon", command: "Cool to 32 degrees. Maintain perfusion while I work distally.", task: "Set 32°C and keep full indexed flow, MAP at least 55 mmHg, and DO₂i at least 280 mL/min/m².", check: function (s, d) { return s.temperature >= 31.5 && s.temperature <= 32.5 && d.flowIndex >= 2.2 && d.flowIndex <= 2.7 && d.map >= 55 && d.do2i >= 280; }, consequence: "Cooling without adequate flow/oxygen delivery can hide progressive global malperfusion; excessive gradients or overcooling add risk.", success: "Moderate cooling is stable, and flow, pressure, oxygen content, and venous saturation tell a coherent perfusion story." },
    { role: "Surgeon", command: "We are 25 minutes from the last dose. Redose—use retrograde as well; the RCA is chronically occluded.", task: "Select combined delivery and administer the redose while maintaining systemic support.", check: function (s) { return s.cardioplegia && s.cpgRoute === "combined" && s.redosed; }, consequence: "Antegrade delivery alone may not protect myocardium distal to severe stenoses; retrograde alone incompletely protects the RV.", success: "Combined delivery broadens protection. Plan down-the-graft delivery to the RCA territory after the graft is complete." },
    { role: "Surgeon", command: "Last distal is done. Start rewarming—slowly. Do not overshoot.", task: "Set 36.5–37.0°C, preserve flow, and avoid a heat-exchanger target above 37.5°C.", check: function (s, d) { return s.temperature >= 36.5 && s.temperature <= 37 && d.flowIndex >= 2.2 && s.temperature <= 37.5; }, consequence: "Inadequate rewarming promotes coagulopathy and arrhythmia; overshoot risks cerebral hyperthermia and worsened neurologic injury.", success: "Rewarming target is appropriate. Confirm nasopharyngeal and core sites and anticipate postoperative afterdrop." },
    { role: "Surgeon", command: "Root is closed. Resume ventilation and help me de-air. TEE, watch the LV and aortic root.", task: "Resume ventilation, activate vent/de-airing, and explicitly confirm TEE de-airing before unclamping.", check: function (s) { return s.ventilation && s.ventOn && s.deaired; }, consequence: "Residual left-sided air can embolize to the coronary or cerebral circulation after clamp removal.", success: "Ventilation, root venting, positioning, and TEE confirmation are coordinated before reperfusion." },
    { role: "Surgeon", command: "Cross-clamp off. Rhythm is back. Prepare to separate—fill the heart and come down gradually.", task: "Stop cardioplegia, release the clamp, confirm rhythm/TEE readiness, then reduce pump flow to 1.0–2.0 L/min.", check: function (s) { return !s.cardioplegia && !s.clamped && s.rhythmChecked && s.flow >= 1 && s.flow <= 2; }, consequence: "Abrupt withdrawal can unmask underfilling, RV/LV failure, ischemia, valve dysfunction, or vasoplegia without time to diagnose.", success: "Partial support is maintained while the heart accepts preload and TEE confirms rhythm, function, valves, and absence of new regional dysfunction." },
    { role: "Surgeon", command: "Hemodynamics are stable. Come off bypass and clamp the venous line.", task: "Bring pump flow to zero and stop the pump only after the separation checklist is complete.", check: function (s) { return !s.pumpRunning && s.flow === 0 && s.rhythmChecked; }, consequence: "Stopping support before rhythm, temperature, electrolytes, filling, TEE, and perfusion are acceptable may precipitate collapse and urgent return to bypass.", success: "The patient is separated with a supported rhythm and acceptable physiology; keep the circuit available until stability is secure." },
    { role: "Surgeon", command: "We are fully off and stable. Give protamine slowly.", task: "Confirm the cross-clamp is off and pump is stopped, then administer protamine and verify ACT normalization.", check: function (s) { return s.protamine && s.act <= 140 && !s.pumpRunning && !s.clamped; }, consequence: "Premature protamine can clot an active circuit. Rapid protamine can cause hypotension, pulmonary vasoconstriction, anaphylaxis, and acute RV failure.", success: "Heparin reversal occurs only after separation; monitor pressure, PA pressure/RV response, ACT, and later heparin rebound." },
    { role: "Surgeon", command: "ACT is back to baseline. We can decannulate.", task: "Confirm reversal and a safe, stable circuit state, then mark arterial and venous decannulation complete.", check: function (s) { return s.decannulated && s.act <= 140 && !s.pumpRunning; }, consequence: "Decannulation before adequate reversal and coordinated control risks major bleeding, air, or loss of rescue access.", success: "Decannulation is coordinated. The educational run ends with hemostasis, perfusion, rhythm, and rescue readiness still under surveillance." }
  ];

  function surgeryState() {
    return {
      stage: 0, score: 0, attempts: [], transcript: [], act: 110, linesChecked: false,
      pumpRunning: false, flow: 0, reservoir: 1.4, venous: 90, fio2: 0.7, sweep: 3.5,
      temperature: 36.8, heater: 36.8, hb: 8.8, oxygenator: 1, lineResistance: 1,
      svr: 1000, suction: 30, venousObstruction: 0, air: false, ventOn: false,
      clamped: false, cardioplegia: false, cpgRoute: "antegrade", redosed: false,
      ventilation: false, deaired: false, rhythmChecked: false, protamine: false,
      decannulated: false, feedback: "Awaiting the first command.", finished: false
    };
  }

  function surgeryHTML() {
    return '<div class="cpb-mode-links" aria-label="CPB lab modes"><a href="#/physiology/cpb-console">Console lab</a><a class="active" href="#/physiology/cpb-surgery">Surgery command mode</a></div>' +
      '<section class="cpb-surgery-shell">' +
        '<header class="cpbs-case-banner"><div><span class="cpb-live">LIVE TEACHING SCENARIO</span><h2>CABG ×3 with RCA chronic total occlusion</h2><p>Adult patient · BSA 1.90 m² · anticipated cross-clamp 85 min · combined myocardial-protection plan</p></div><div class="cpbs-progress"><strong id="cpbs-stage-count">1 / ' + SURGERY_STAGES.length + '</strong><span>commands completed</span></div></header>' +
        '<div class="cpbs-layout">' +
          '<aside class="cpbs-machine">' +
            '<div class="cpbs-machine-head"><span class="cpb-status-dot" id="cpbs-dot"></span><div><b id="cpbs-pump-label">PUMP STOPPED</b><small>Teaching HLM-01</small></div></div>' +
            '<div class="cpbs-mini-circuit" id="cpbs-mini-circuit" aria-label="Compact heart-lung machine status"><div class="mini-reservoir"><i id="cpbs-res-level"></i><span>RES</span></div><div class="mini-oxygenator"><i></i><span>OXY</span></div><div class="mini-pump"><i></i><span>PUMP</span></div><div class="mini-filter"><i></i><span>FILTER</span></div><b class="mini-line venous"></b><b class="mini-line arterial"></b></div>' +
            '<div class="cpbs-mini-metrics">' + metric("cpbs-flow-i", "Flow index", "L/min/m²") + metric("cpbs-map", "MAP", "mmHg") + metric("cpbs-res", "Reservoir", "L") + metric("cpbs-do2i", "DO₂i", "mL/min/m²") + metric("cpbs-act", "ACT", "sec") + metric("cpbs-temp", "Temperature", "°C") + '</div>' +
            range("cpbs-flow", "Pump flow", 0, 6.5, 0, 0.1, " L/min", "Advance or reduce flow in response to the operative phase.") +
            range("cpbs-venous", "Venous drainage", 0, 100, 90, 1, "%", "Coordinate venous return with pump demand and reservoir level.") +
            range("cpbs-fio2", "Oxygenator FiO₂", 0.21, 1, 0.7, 0.01, "", "Adjust oxygen transfer; inspect PaO₂ and oxygen content.") +
            range("cpbs-sweep", "Sweep gas", 0.5, 10, 3.5, 0.1, " L/min", "Adjust CO₂ clearance.") +
            range("cpbs-temperature", "Heat-exchanger target", 20, 39, 36.8, 0.1, "°C", "Cool and rewarm deliberately; avoid overshoot.") +
            '<label class="cpb-knob" for="cpbs-route"><span><b>Cardioplegia route</b></span><select id="cpbs-route"><option value="antegrade">Antegrade</option><option value="retrograde">Retrograde</option><option value="combined">Combined</option></select><small>Choose a route based on coronary anatomy and phase.</small></label>' +
            '<div class="cpbs-action-grid">' + button("heparin", "Give heparin") + button("check-lines", "Complete line check") + button("pump", "Start pump") + button("vent", "Root / LV vent") + button("clamp", "Cross-clamp") + button("cpg", "Cardioplegia") + button("redose", "Record redose") + button("ventilate", "Resume ventilation") + button("deair", "TEE de-air confirmed") + button("rhythm", "Rhythm / TEE ready") + button("protamine", "Give protamine", "danger") + button("decannulate", "Decannulate", "danger") + '</div>' +
          '</aside>' +
          '<section class="cpbs-scenario">' +
            '<div class="cpbs-room"><div class="cpbs-overhead-light"></div><div class="cpbs-team surgeon"><span>S</span><b>Surgeon</b></div><div class="cpbs-team anesthesia"><span>A</span><b>Anesthesia / TEE</b></div><div class="cpbs-team perfusion"><span>P</span><b>You: perfusion</b></div><div class="cpbs-field" id="cpbs-field"><span class="heart-beat" aria-hidden="true">♥</span><small>Open cardiac field</small></div><div class="cpbs-circuit-connection"><i></i><span>arterial</span><i></i><span>venous</span></div></div>' +
            '<article class="cpbs-command-card" aria-live="polite"><div class="cpbs-radio-head"><span class="cpbs-radio-led"></span><b>OR INTERCOM / PERFUSION CHANNEL</b><small>LIVE</small></div><div class="cpbs-command-meta"><span id="cpbs-role">SURGEON COMMAND</span><span id="cpbs-command-number">01</span></div><blockquote id="cpbs-command"></blockquote><div class="cpbs-task"><b>Your response</b><p id="cpbs-task"></p></div><button class="btn cpbs-commit" id="cpbs-commit" type="button">Confirm and carry out command</button><div class="cpbs-feedback" id="cpbs-feedback" role="status"></div></article>' +
            '<div class="cpbs-monitor-row">' + metric("cpbs-pao2", "Post-O₂ PaO₂", "mmHg") + metric("cpbs-paco2", "PaCO₂", "mmHg") + metric("cpbs-line", "Arterial line", "mmHg") + metric("cpbs-svo2", "SvO₂", "%") + '<div class="cpbs-monitor-wave" aria-label="Simulated arterial pressure waveform"><span></span><span></span><span></span><span></span><span></span></div></div>' +
          '</section>' +
          '<aside class="cpbs-transcript-panel"><h2>Operative transcript</h2><p>Every response and consequence is recorded for debrief.</p><div class="cpbs-transcript" id="cpbs-transcript" aria-live="polite"></div><div class="cpbs-separation-check"><b>Separation checklist</b><ul><li>Rewarmed without overshoot</li><li>Rhythm and electrolytes acceptable</li><li>De-airing confirmed by TEE</li><li>Ventricular and valve function assessed</li><li>Volume, MAP, and perfusion acceptable</li><li>Rescue circuit remains available</li></ul></div></aside>' +
        '</div>' +
      '</section>';
  }

  function bindSurgery(api, s) {
    const ids = ["flow", "venous", "fio2", "sweep", "temperature"];

    function addTranscript(role, message, tone) {
      s.transcript.push({ role: role, message: message, tone: tone || "" });
      setHTML("cpbs-transcript", s.transcript.slice().reverse().map(function (entry) { return '<div class="' + entry.tone + '"><b>' + entry.role + '</b><p>' + entry.message + '</p></div>'; }).join(""));
    }

    function read() {
      ids.forEach(function (key) { const el = document.querySelector("#cpbs-" + key); if (el) s[key] = +el.value; });
      s.heater = s.temperature;
      const route = document.querySelector("#cpbs-route");
      if (route) s.cpgRoute = route.value;
    }

    function write() {
      ids.forEach(function (key) { const el = document.querySelector("#cpbs-" + key); if (el) el.value = s[key]; });
      syncRotaries(document.querySelector(".cpb-surgery-shell"));
    }

    function updateMetrics() {
      read();
      const d = derive(s);
      const outUnits = { flow: " L/min", venous: "%", fio2: "", sweep: " L/min", temperature: "°C" };
      ids.forEach(function (key) { setText("out-cpbs-" + key, (key === "fio2" ? n(s[key], 2) : n(s[key], key === "venous" ? 0 : 1)) + outUnits[key]); });
      setText("cpbs-flow-i", n(d.flowIndex, 2));
      setText("cpbs-map", n(d.map));
      setText("cpbs-res", n(s.reservoir, 2));
      setText("cpbs-do2i", n(d.do2i));
      setText("cpbs-act", n(s.act));
      setText("cpbs-temp", n(s.temperature, 1));
      setText("cpbs-pao2", n(d.pao2));
      setText("cpbs-paco2", n(d.paco2));
      setText("cpbs-line", n(d.linePressure));
      setText("cpbs-svo2", n(d.svo2));
      setText("cpbs-live-reservoir-value", n(s.reservoir, 2) + " L");
      setText("cpbs-live-gas-value", "O₂ " + n(d.pao2) + " / CO₂ " + n(d.paco2));
      setText("cpbs-live-pump-value", n(d.flow, 1) + " L/min");
      setText("cpbs-live-line-value", n(d.linePressure) + " mmHg");
      setText("cpbs-live-patient-map", "MAP " + n(d.map) + " mmHg");
      setText("cpbs-live-blender-fio2", n(s.fio2, 2));
      setText("cpbs-live-blender-sweep", n(s.sweep, 1) + " L/min");
      setText("cpbs-live-hx-display", n(s.temperature, 1) + " °C");
      const liveCircuit = document.querySelector('#cpbs-live-circuit');
      if (liveCircuit) liveCircuit.classList.toggle('flowing', s.pumpRunning && d.flow > 0);
      const livePump = document.querySelector('#cpbs-live-pump');
      if (livePump) livePump.classList.toggle('stopped', !s.pumpRunning || !d.flow);
      const liveFluid = document.querySelector('#cpbs-live-fluid');
      if (liveFluid) liveFluid.style.height = clamp(s.reservoir / 2 * 100, 0, 100) + '%';
      setText("cpbs-pump-label", s.pumpRunning ? "PUMP RUNNING" : "PUMP STOPPED");
      const dot = document.querySelector("#cpbs-dot");
      if (dot) dot.className = "cpb-status-dot " + (s.pumpRunning ? "ok" : "");
      const mini = document.querySelector("#cpbs-mini-circuit");
      if (mini) {
        mini.classList.toggle("flowing", s.pumpRunning && d.flow > 0);
        mini.style.setProperty("--flow-duration", clamp(3.1 - d.flow * 0.38, 0.7, 3.1) + "s");
      }
      const resLevel = document.querySelector("#cpbs-res-level");
      if (resLevel) resLevel.style.height = clamp(s.reservoir / 2 * 100, 0, 100) + "%";
      const field = document.querySelector("#cpbs-field");
      if (field) field.classList.toggle("arrested", s.clamped && s.cardioplegia);
      const actionStates = {
        pump: s.pumpRunning, vent: s.ventOn, clamp: s.clamped, cpg: s.cardioplegia,
        redose: s.redosed, ventilate: s.ventilation, deair: s.deaired,
        rhythm: s.rhythmChecked, protamine: s.protamine, decannulate: s.decannulated,
        heparin: s.act >= 480, "check-lines": s.linesChecked
      };
      Object.keys(actionStates).forEach(function (action) {
        const control = document.querySelector('.cpb-surgery-shell [data-cpb-action="' + action + '"]');
        if (!control) return;
        control.classList.toggle("engaged", !!actionStates[action]);
        control.setAttribute("aria-pressed", String(!!actionStates[action]));
      });
    }

    function renderStage() {
      if (s.finished) return renderDebrief();
      const stage = SURGERY_STAGES[s.stage];
      updateTrack(s.stage, s.score, false);
      setText("cpbs-stage-count", s.stage + 1 + " / " + SURGERY_STAGES.length);
      setText("cpbs-role", stage.role.toUpperCase() + " COMMAND");
      setText("cpbs-command-number", String(s.stage + 1).padStart(2, "0"));
      setText("cpbs-command", "“" + stage.command + "”");
      setText("cpbs-task", stage.task);
      setHTML("cpbs-feedback", '<div class="neutral"><b>Think before touching the console.</b><p>Predict what each control will change, then verify the whole circuit after acting.</p></div>');
      addTranscript(stage.role, stage.command, "command");
      updateMetrics();
    }

    function renderDebrief() {
      const firstPass = s.attempts.filter(function (a) { return a.correct && a.tryNumber === 1; }).length;
      const score = s.score;
      updateTrack(s.stage, score, true);
      setText('cpbs-command', 'Case complete. The patient is separated from bypass.');
      setText('cpbs-task', 'Review your first-pass score and the case notes, or repeat the procedure.');
      const completedCommit = document.querySelector('#cpbs-commit');
      if (completedCommit) { completedCommit.disabled = true; completedCommit.textContent = 'All 12 commands complete'; }
      api.complete("cpb-surgery", score, SURGERY_STAGES.length);
      const rows = SURGERY_STAGES.map(function (stage, i) {
        const attempts = s.attempts.filter(function (a) { return a.stage === i; });
        return '<div><span>' + String(i + 1).padStart(2, "0") + '</span><p><b>' + stage.command + '</b><br>' + stage.success + '<small>' + attempts.length + ' attempt' + (attempts.length === 1 ? '' : 's') + '</small></p></div>';
      }).join("");
      const main = document.querySelector(".cpbs-scenario");
      if (main) main.innerHTML = '<div class="cpbs-debrief"><span class="cpb-live complete">CASE DEBRIEF</span><h2>' + score + ' / ' + SURGERY_STAGES.length + ' first-pass commands</h2><p>You completed the modeled CPB run. ' + firstPass + ' commands were handled correctly without a retry. Review the consequences, then repeat until anticoagulation, initiation, protection, rewarming, de-airing, separation, and reversal form one coherent sequence.</p><div class="cpbs-debrief-list">' + rows + '</div><div class="cpbs-debrief-actions"><button class="btn" id="cpbs-retry" type="button">Repeat the case</button><a class="btn secondary" href="#/physiology/cpb-console">Open free console</a></div></div>';
      const retry = document.querySelector("#cpbs-retry");
      if (retry) retry.addEventListener("click", function () { window.CSLab.render('cpb-surgery'); });
    }

    initializeRotaries(document.querySelector(".cpb-surgery-shell"));
    ids.forEach(function (key) { const el = document.querySelector("#cpbs-" + key); if (el) el.addEventListener("input", updateMetrics); });
    const route = document.querySelector("#cpbs-route");
    if (route) route.addEventListener("change", updateMetrics);

    document.querySelectorAll("[data-cpb-action]").forEach(function (el) {
      el.addEventListener("click", function () {
        const action = el.dataset.cpbAction;
        let message = "";
        let tone = "action";
        if (action === "heparin") { s.act = 525; message = "Heparin given; modeled repeat ACT is 525 seconds."; }
        if (action === "check-lines") { s.linesChecked = true; message = "Pre-bypass circuit, gas, pressure, reservoir, detector, clamps, and cannula connections checked aloud."; }
        if (action === "pump") {
          if (s.pumpRunning) { s.pumpRunning = false; s.flow = 0; write(); message = "Arterial pump stopped."; el.textContent = "Start pump"; }
          else if (s.act < 480) { message = "Pump start blocked: ACT is below the training threshold."; tone = "wrong"; }
          else { s.pumpRunning = true; message = "Arterial pump started at the selected flow."; el.textContent = "Stop pump"; }
        }
        if (action === "vent") { s.ventOn = !s.ventOn; message = s.ventOn ? "Root/LV vent active; monitor decompression and air entrainment." : "Root/LV vent stopped."; }
        if (action === "clamp") {
          if (!s.pumpRunning) { message = "Cross-clamp action blocked: establish safe bypass support first."; tone = "wrong"; }
          else { s.clamped = !s.clamped; message = s.clamped ? "Aortic cross-clamp state active; coronary flow now depends on cardioplegia." : "Cross-clamp released; reperfusion phase begins."; }
        }
        if (action === "cpg") {
          s.cardioplegia = !s.cardioplegia;
          message = s.cardioplegia ? s.cpgRoute + " cardioplegia delivery started." : "Cardioplegia delivery stopped.";
        }
        if (action === "redose") { s.redosed = true; s.cardioplegia = true; message = "Cardioplegia redose recorded via " + s.cpgRoute + " delivery."; }
        if (action === "ventilate") { s.ventilation = true; message = "Lung ventilation resumed in coordination with field and de-airing."; }
        if (action === "deair") { s.deaired = true; message = "TEE confirmation of de-airing documented; continue surveillance during unclamping."; }
        if (action === "rhythm") { s.rhythmChecked = true; message = "Rhythm, ventricular/valve function, electrolytes, temperature, and filling readiness reviewed."; }
        if (action === "protamine") {
          if (s.pumpRunning || s.clamped) { message = "Protamine blocked: the pump is running or the cross-clamp remains on. Premature reversal can clot the circuit."; tone = "wrong"; }
          else { s.protamine = true; s.act = 125; message = "Protamine administered slowly; modeled ACT is 125 seconds. Watch for hypotension, pulmonary hypertension, and RV failure."; }
        }
        if (action === "decannulate") {
          if (!s.protamine || s.act > 140) { message = "Decannulation blocked: confirm separation and heparin reversal first."; tone = "wrong"; }
          else { s.decannulated = true; message = "Arterial and venous decannulation marked complete with surgical control coordinated."; }
        }
        s.feedback = message;
        addTranscript("Perfusion", message, tone);
        setHTML("cpbs-feedback", '<div class="' + (tone === "wrong" ? "retry" : "neutral") + '"><b>' + (tone === "wrong" ? "Unsafe sequence prevented" : "Console action") + '</b><p>' + message + '</p></div>');
        updateMetrics();
      });
    });

    const commit = document.querySelector("#cpbs-commit");
    if (commit) commit.addEventListener("click", function () {
      read();
      const stage = SURGERY_STAGES[s.stage];
      const d = derive(s);
      const priorAttempts = s.attempts.filter(function (a) { return a.stage === s.stage; }).length;
      const correct = stage.check(s, d);
      s.attempts.push({ stage: s.stage, correct: correct, tryNumber: priorAttempts + 1 });
      if (!correct) {
        setHTML("cpbs-feedback", '<div class="retry"><b>Command not safely completed</b><p>' + stage.consequence + '</p><small>Re-read the command, correct the machine state, and submit again.</small></div>');
        addTranscript("Consequence", stage.consequence, "wrong");
        return;
      }
      if (priorAttempts === 0) s.score++;
      setHTML("cpbs-feedback", '<div class="pass"><b>Command completed</b><p>' + stage.success + '</p></div>');
      addTranscript("Team confirmation", stage.success, "pass");
      commit.disabled = true;
      window.setTimeout(function () {
        if (!commit.isConnected) return;
        s.stage++;
        commit.disabled = false;
        if (s.stage >= SURGERY_STAGES.length) { s.finished = true; renderDebrief(); }
        else renderStage();
      }, 650);
    });

    renderStage();
  }

  window.CSLab.register({
    id: "cpb-console",
    code: "CPB-01",
    title: "Perfusionist CPB Console Lab",
    subtitle: "Operate a coupled educational heart–lung machine, calculate indexed oxygen delivery, inject circuit faults, and make the machine safe before solving the mechanism.",
    category: "Perfusion & bypass",
    minutes: 35,
    objectives: [
      "Trace blood through venous drainage, reservoir, membrane oxygenator/heat exchanger, pump, arterial filter, and arterial return.",
      "Couple pump flow, indexed flow, reservoir balance, arterial line pressure, MAP, hemoglobin, saturation, SvO₂, and indexed oxygen delivery.",
      "Separate FiO₂ control of oxygenation from sweep-gas control of carbon dioxide removal.",
      "Recognize and contain at least eight CPB fault states before pursuing definitive troubleshooting.",
      "Explain how ACT, temperature, suction, vents, and cardioplegia route change bypass safety and myocardial protection."
    ],
    sourceSections: ["Cardiac Surgery Guide v3 Module 10.1–10.6", "Module 11 hemostasis", "Modules 13–14 perfusion and shock", "Educational thresholds require local-protocol verification"],
    teach: {
      concept: "The heart–lung machine is one circulation you operate as a system. A safety gate comes first — anticoagulation, no air, a safe reservoir. Then flow depends on venous drainage and a safe arterial line pressure; FiO₂ sets oxygenation while sweep gas sets CO₂ clearance; and organ delivery is flow × oxygen content, never MAP alone. When a fault appears, the reflex is containment first — make the circuit safe and say it out loud — then solve the mechanism.",
      how: "Turn the dials and read the coupled metrics and the live DO₂i calculation. Inject a fault, recognise the pattern from the alarms and readouts, make the machine safe with the corrective actions, then press Evaluate to test your correction. A quiet alarm panel never replaces trending the whole circuit.",
      equations: ["FiO₂ → oxygenation · Sweep → CO₂ clearance", "DO₂i = flow × CaO₂ × 10 / BSA", "Contain first, diagnose second"]
    },
    render: function (api) {
      const s = consoleState();
      api.main().innerHTML = api.frame(api.lab, consoleHTML());
      mountWorkstation(false);
      bindConsole(api, s);
    }
  });

  window.CSLab.register({
    id: "cpb-surgery",
    code: "CPB-02",
    title: "Surgeon Command / CPB Surgery Mode",
    subtitle: "Run a staged on-pump CABG from heparinization to decannulation while surgeon commands, machine state, myocardial protection, and separation physiology evolve together.",
    category: "Perfusion simulation",
    minutes: 30,
    objectives: [
      "Sequence anticoagulation, line checks, cannulation readiness, initiation, full-flow bypass, cross-clamping, and cardioplegia without violating safety gates.",
      "Maintain adequate flow, perfusion pressure, gas exchange, reservoir balance, and indexed oxygen delivery during cooling and the cross-clamp period.",
      "Choose a combined cardioplegia strategy when coronary stenoses limit antegrade distribution and retrograde delivery incompletely protects the RV.",
      "Coordinate rewarming, ventilation, de-airing, rhythm/TEE assessment, gradual weaning, heparin reversal, and decannulation.",
      "Use the transcript and consequence debrief to identify unsafe sequencing and repeat the complete mental model."
    ],
    sourceSections: ["Cardiac Surgery Guide v3 Module 10 CPB & cardioplegia", "Module 10.6 weaning", "Module 11 anticoagulation and bleeding", "Modules 13–14 post-bypass shock"],
    teach: {
      concept: "Running a case on pump is a sequence where every step gates the next: heparin and a safe ACT before cannulation, a completed line check before going on, full indexed flow with matched drainage, cross-clamp only with prompt effective cardioplegia, deliberate cooling and rewarming without overshoot, TEE-confirmed de-airing before unclamping, partial support before separation, and protamine only once fully off bypass. Skipping or reordering a step is where catastrophes live.",
      how: "Respond to each surgeon command by setting the machine and pressing the console actions in a safe order, then commit the command. Unsafe sequences — pump before ACT, cross-clamp before bypass, protamine on-pump — are blocked and explained. The transcript records every consequence for a debrief scored on first-pass commands.",
      equations: ["ACT ≥ 480 s before bypass", "Cardioplegia the moment you cross-clamp", "Protamine only fully off pump"]
    },
    render: function (api) {
      const s = surgeryState();
      api.main().innerHTML = api.frame(api.lab, surgeryHTML());
      mountWorkstation(true);
      bindSurgery(api, s);
    }
  });
})();
