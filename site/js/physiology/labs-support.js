/* CardiacSchool advanced support physiology trainers: IABP and TEG/ROTEM. */
(function () {
  "use strict";
  const requestAnimationFrame = fn => window.CSLab.raf(fn), cancelAnimationFrame = id => window.CSLab.cancelRaf(id);

  if (!window.CSLab) throw new Error("CSLab core must load before support labs");

  const IABP_CASES = [
    { id: "optimal", label: "Reference timing", tag: "Core", inflation: 40, deflation: 93, trigger: "ecg", ratio: "1:1", hr: 74, ar: false,
      story: "Sinus rhythm after high-risk CABG. The dicrotic notch is crisp and the arterial signal is reliable.",
      ask: "Which waveform finding confirms effective counterpulsation?", choices: ["Diastolic augmentation exceeds native systole while assisted systole falls", "Inflation starts before aortic valve closure and visibly interrupts late ventricular ejection", "Assisted systole exceeds the unassisted pressure on every supported beat", "Diastolic augmentation fades while end-diastolic pressure rises"], answer: 0,
      correction: "Inflate at the dicrotic notch and fully deflate immediately before the next systolic upstroke." },
    { id: "early-inflation", label: "Early inflation", tag: "Timing fault", inflation: 27, deflation: 93, trigger: "ecg", ratio: "1:1", hr: 70, ar: false,
      story: "Inflation begins before aortic valve closure. The balloon opposes late LV ejection.",
      ask: "What is the principal physiologic harm?", choices: ["An isolated fall in venous return with no change in LV ejection", "Excess reduction of preload from diastolic balloon emptying", "Higher LV afterload, impaired ejection and greater myocardial oxygen demand", "Reduced coronary perfusion from failure to inflate during systole"], answer: 2,
      correction: "Move inflation later to the dicrotic notch; verify that the unassisted systolic downstroke is not interrupted." },
    { id: "late-inflation", label: "Late inflation", tag: "Timing fault", inflation: 58, deflation: 93, trigger: "pressure", ratio: "1:1", hr: 76, ar: false,
      story: "The balloon inflates well after the dicrotic notch and misses early diastole.",
      ask: "What benefit is predominantly lost?", choices: ["Loss of right-ventricular preload during mechanical systole", "Loss of diastolic coronary perfusion augmentation", "Loss of blood oxygenation across the native pulmonary circuit", "Loss of platelet preservation from reduced balloon contact time"], answer: 1,
      correction: "Advance inflation toward the dicrotic notch to capture the full diastolic pressure area." },
    { id: "early-deflation", label: "Early deflation", tag: "Timing fault", inflation: 40, deflation: 74, trigger: "ecg", ratio: "1:1", hr: 68, ar: false,
      story: "The balloon empties too early in diastole; aortic pressure returns to baseline long before systole.",
      ask: "Which expected IABP effect becomes suboptimal?", choices: ["Arterial oxygen content during the presystolic pressure trough", "Coronary sinus drainage from the unsupported right ventricle", "Native heart-rate control through beat-to-beat trigger selection", "Afterload reduction from the presystolic pressure trough"], answer: 3,
      correction: "Delay deflation until immediately before systole while preserving complete emptying before ejection." },
    { id: "late-deflation", label: "Late deflation", tag: "Critical fault", inflation: 40, deflation: 108, trigger: "ecg", ratio: "1:1", hr: 72, ar: false,
      story: "The balloon remains inflated into the next systole and the assisted upstroke meets a filled balloon.",
      ask: "What is the immediate concern?", choices: ["Excessive preload unloading before the next assisted ejection", "A spuriously low CVP caused by balloon inflation in diastole", "A dangerous rise in LV afterload with impaired ejection against the inflated balloon", "Higher pulmonary compliance despite a persistently inflated balloon"], answer: 2,
      correction: "Advance deflation urgently so the balloon is empty before the next systolic upstroke." },
    { id: "af-trigger", label: "Irregular rhythm", tag: "Trigger fault", inflation: 51, deflation: 103, trigger: "ecg", ratio: "1:2", hr: 132, ar: false, irregular: true,
      story: "Rapid atrial fibrillation produces variable R–R intervals; the ECG trigger is intermittently mistiming assistance while the arterial upstroke remains visible.",
      ask: "What is the best console-level response to test?", choices: ["Try pressure triggering and reassess each assisted beat", "Increase balloon volume without retiming", "Ignore the waveform if MAP is adequate", "Switch permanently to internal pacing trigger without evaluation"], answer: 0,
      correction: "Select the most reliable trigger for the actual signal, often pressure when ECG timing is unstable; then retime and reassess." },
    { id: "severe-ar", label: "Severe AR", tag: "Contraindication", inflation: 40, deflation: 93, trigger: "pressure", ratio: "1:1", hr: 88, ar: true,
      story: "A patient in shock has severe aortic regurgitation and pulmonary edema. The timing trace itself looks technically ideal.",
      ask: "Why should technically good timing not reassure you?", choices: ["The device directly pumps excessive blood into the LV during systole", "Deflation forces the mitral valve closed and raises left atrial pressure", "The balloon diverts coronary flow away from the myocardium in diastole", "Diastolic augmentation increases the regurgitant gradient and volume"], answer: 3,
      correction: "Do not optimize around a firm contraindication. Stop and escalate for an alternative support strategy." },
    { id: "limb-risk", label: "Access alarm", tag: "Device safety", inflation: 40, deflation: 93, trigger: "ecg", ratio: "1:1", hr: 80, ar: false, limb: true,
      story: "Two hours after femoral insertion, the ipsilateral foot is cool with a lost Doppler signal despite effective waveform timing.",
      ask: "What takes priority?", choices: ["Increase augmentation before investigating the new distal perfusion change", "Urgent limb-perfusion and catheter/access assessment", "Change ECG leads and continue support if the pressure waveform is effective", "Accept the cool foot because counterpulsation timing remains effective"], answer: 1,
      correction: "Treat new limb ischemia as a device/access emergency and involve the responsible team immediately." }
  ];

  const IABP_CHALLENGES = [
    { q: "The augmented diastolic peak is lower than the native systolic peak and inflation starts after the notch. Best timing change?", choices: ["Earlier inflation", "Later inflation", "Earlier deflation"], a: 0, why: "Late inflation loses the highest-value portion of diastole." },
    { q: "Assisted end-diastolic pressure is higher than unassisted end-diastolic pressure. What fault is most likely?", choices: ["Early inflation", "Late inflation", "Late deflation"], a: 2, why: "Failure to create a presystolic trough implies the balloon has not emptied in time." },
    { q: "Which condition is a firm physiology-based contraindication?", choices: ["Left-main coronary disease without severe AR", "Severe AR with greater diastolic regurgitant flow", "Post-cardiotomy low-output syndrome"], a: 1, why: "Higher diastolic aortic pressure drives more regurgitant volume into the LV." },
    { q: "Which statement accurately describes IABP support?", choices: ["It alters pressure by counterpulsation, not direct pumping", "It routinely supplies 4–5 L/min of forward systemic flow independent of native rhythm", "It continuously drains the LV into the descending aorta"], a: 0, why: "Expected cardiac-output gain is modest; timing changes pressure and LV work." }
  ];

  function svgPath(points) {
    return points.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
  }

  function gaussian(x, mean, spread) {
    const z = (x - mean) / spread;
    return Math.exp(-z * z);
  }

  function rotary(id, label, min, max, value, step, unit) {
    return '<label class="support-rotary" for="' + id + '"><span>' + label + '</span><span class="support-dial" id="dial-' + id + '" style="--dial-angle:-135deg"><i></i><em></em><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '" step="' + step + '" aria-label="' + label + '"></span><output id="' + id.replace("iabp-", "iabp-") + '-out">' + value + unit + '</output><small>' + min + '—' + max + unit + '</small></label>';
  }

  function syncRotary(id) {
    const input = document.getElementById(id), dial = document.getElementById("dial-" + id);
    if (!input || !dial) return;
    const fraction = (+input.value - +input.min) / (+input.max - +input.min || 1);
    dial.style.setProperty("--dial-angle", (-135 + fraction * 270) + "deg");
  }

  function iabpWave(inflation, deflation, ratio, irregular, hr, trigger) {
    const m=window.CSModels.iabp({inflation,deflation,ratio,irregular,hr,trigger});
    const path=fn=>svgPath(m.points.map((p,i)=>[i,fn(p)]));
    return {model:m,arterial:path(p=>190-(p.pressure-50)*1.55),native:path(p=>190-(p.native-50)*1.55),ecg:path(p=>248-48*gaussian(p.phase,.015,.013)+15*gaussian(p.phase,.05,.02)-13*gaussian(p.phase,.28,.07)),balloon:path(p=>p.balloon?282:304),bpm:hr};
  }

  function registerIabp() {
    window.CSLab.register({
      id: "iabp", code: "IABP", title: "IABP Timing & Counterpulsation Lab", subtitle: "Time inflation and deflation against live ECG and arterial pressure, recognize dangerous faults, and connect each waveform change to coronary perfusion and LV work.", category: "Mechanical support", minutes: 24,
      sourceSections: ["Cardiac Surgery Guide v3 · Module 9.2", "Figure 9.1 · IABP arterial waveform"],
      objectives: ["Identify the dicrotic notch and presystolic deflation point on an arterial waveform.", "Predict how early or late inflation and deflation alter diastolic augmentation, LV afterload and oxygen demand.", "Select ECG versus pressure triggering and assist ratios in changing rhythms.", "Recognize contraindications and access complications that override technically effective timing.", "Use assisted-to-unassisted beat comparison to verify benefit."],
      teach: {
        concept: "The balloon pump does not pump blood forward — it counterpulses. Inflating at the dicrotic notch in diastole augments aortic root pressure and coronary perfusion; deflating just before systole drops aortic impedance and unloads the left ventricle. Timing is everything: early or late inflation and deflation each harm in a specific way, and even perfect timing is wrong when the physiology (severe AR) or the access (limb ischaemia) makes the device unsafe.",
        how: "Load a case, inspect the ECG and arterial trace, and commit a prediction before you retime inflation and deflation and watch augmentation and afterload change. Compare assisted with unassisted beats to verify benefit, and answer the transfer challenges. Some cases are about stopping the device, not optimising it.",
        equations: ["Inflate at the dicrotic notch → ↑ coronary perfusion", "Deflate before systole → ↓ LV afterload & MVO₂", "Counterpulsation, not forward pumping"]
      },
      render: function (ctx) {
        let current = 0, score = 0, attempts = {}, challengeDone = {};
        const caseButtons = IABP_CASES.map(function (c, i) { return '<button class="support-case' + (i === 0 ? ' active' : '') + '" data-iabp-case="' + i + '"><span>' + (i + 1) + '</span><b>' + ctx.esc(c.label) + '</b><small>' + ctx.esc(c.tag) + '</small></button>'; }).join("");
        const challenges = IABP_CHALLENGES.map(function (c, i) { return '<article class="support-quiz" data-iabp-challenge="' + i + '"><b>' + (i + 1) + '. ' + ctx.esc(c.q) + '</b><div>' + c.choices.map(function (x, j) { return '<button data-answer="' + j + '">' + ctx.esc(x) + '</button>'; }).join("") + '</div><p aria-live="polite"></p></article>'; }).join("");
        const body = '<section class="support-intro"><div><span>COUNTERPULSATION WORKSTATION</span><h2>See timing as ventricular work</h2><p>Compare assisted and unassisted beats. Optimize the pressure trace, but stop when anatomy or access makes the device unsafe.</p></div><div class="support-principle"><b>Inflate at the notch</b><span>↑ aortic diastolic pressure → ↑ coronary perfusion</span><b>Deflate before systole</b><span>↓ aortic impedance → ↓ LV afterload and MVO₂</span></div></section>' +
          '<nav class="support-cases" aria-label="IABP scenarios">' + caseButtons + '</nav>' +
          '<div class="support-main"><aside class="support-console"><div class="support-panel-title"><span>IABP</span><div><b>Timing console</b><small id="iabp-trigger-status">ECG · 1:1 assist</small></div></div>' +
          '<label><span>Trigger source</span><select id="iabp-trigger"><option value="ecg">ECG trigger</option><option value="pressure">Arterial pressure trigger</option></select></label>' +
          '<label><span>Assist ratio</span><select id="iabp-ratio"><option>1:1</option><option>1:2</option><option>1:3</option></select></label>' +
          '<div class="support-dial-bank" role="group" aria-label="Balloon timing controls">' +
            rotary("iabp-inflation", "INFLATION", 20, 68, 40, 1, "%").replace('id="iabp-inflation-out"','id="iabp-inf-out"') +
            rotary("iabp-deflation", "DEFLATION", 68, 112, 93, 1, "%").replace('id="iabp-deflation-out"','id="iabp-def-out"') +
          '</div>' +
          '<button class="btn primary" id="iabp-check">Commit prediction</button><div class="support-console-note" id="iabp-assessment" aria-live="polite">Read the case, inspect the timing markers, then predict the physiology.</div></aside>' +
          '<section class="support-workbench"><header><div><span id="iabp-tag">CORE</span><h2 id="iabp-title">Reference timing</h2><p id="iabp-story"></p></div><div class="support-pulse"><small>HEART RATE</small><b id="iabp-hr">74</b><span>bpm</span></div></header>' +
          '<div class="iabp-monitor" role="img" aria-label="Continuously moving ECG, arterial pressure and balloon inflation waveform"><div class="iabp-screen-head"><span>LIVE ARTERIAL PRESSURE + ECG</span><div class="support-playback"><button id="iabp-pause" type="button" aria-pressed="false">Pause</button><label>Speed <select id="iabp-speed"><option value="1.2">0.8×</option><option value="1" selected>1×</option><option value=".67">1.5×</option><option value=".5">2×</option></select></label></div><b id="iabp-screen-mode">ECG TRIGGER · 1:1</b></div><svg viewBox="0 0 840 320" preserveAspectRatio="none"><defs><linearGradient id="iabpPressure" x1="0" x2="1"><stop stop-color="#22d3ee"/><stop offset="1" stop-color="#818cf8"/></linearGradient></defs><g class="iabp-grid">' + Array.from({length: 10}, function (_,i) { return '<path d="M ' + (i*84) + ' 0 V 320"/>'; }).join("") + Array.from({length: 5}, function(_,i){ return '<path d="M 0 ' + (i*64) + ' H 840"/>'; }).join("") + '</g><g id="iabp-scroll" class="iabp-scroll"><g><path id="iabp-native" class="iabp-native"/><path id="iabp-pressure" class="iabp-pressure"/><path id="iabp-ecg" class="iabp-ecg"/><path id="iabp-balloon" class="iabp-balloon"/><g id="iabp-markers"></g></g><g transform="translate(840 0)"><path id="iabp-native-copy" class="iabp-native"/><path id="iabp-pressure-copy" class="iabp-pressure"/><path id="iabp-ecg-copy" class="iabp-ecg"/><path id="iabp-balloon-copy" class="iabp-balloon"/><g id="iabp-markers-copy"></g></g></g><g class="iabp-labels"><text x="10" y="22">ART</text><text x="10" y="230">ECG</text><text x="10" y="296">BALLOON</text></g><line class="iabp-sweep" x1="760" y1="0" x2="760" y2="320"/></svg><div class="iabp-legend"><span><i class="assisted"></i>Generated assisted pressure</span><span><i class="native"></i>Native reference</span><span><i class="inflate"></i>Balloon inflated</span></div></div>' +
          '<div class="support-metrics"><div><small>DIASTOLIC AUGMENTATION</small><b id="iabp-aug">+24 mmHg</b><span id="iabp-aug-label">effective</span></div><div><small>ASSISTED SYS / AFTERLOAD</small><b id="iabp-after">−9 mmHg</b><span id="iabp-after-label">reduced</span></div><div><small>CORONARY–MVO₂ BALANCE</small><b id="iabp-balance">Improved</b><span>conceptual estimate</span></div></div>' +
          '<section class="support-prediction"><span>PREDICT BEFORE ADJUSTING</span><h3 id="iabp-question"></h3><fieldset id="iabp-choices"></fieldset></section></section></div>' +
          '<details class="support-primer"><summary>Mechanism, trigger and safety primer</summary><div><article><b>Diastolic inflation</b><p>Inflation at aortic valve closure displaces blood toward the aortic root. The trace should show a sharp augmented diastolic rise beginning at the dicrotic notch.</p></article><article><b>Presystolic deflation</b><p>Rapid balloon emptying just before ejection creates a lower end-diastolic aortic pressure and reduces LV impedance. Late deflation can markedly increase afterload.</p></article><article><b>Trigger choice</b><p>ECG is often stable in regular rhythms; pressure triggering can be more reliable when ECG morphology or rhythm is problematic. Always judge the resulting pressure waveform beat by beat.</p></article><article><b>Do not normalize danger</b><p>Moderate-to-severe AR, aortic dissection and major aortoiliac disease can make IABP harmful. Monitor limb perfusion and insertion-related complications.</p></article></div></details>' +
          '<section class="support-challenges"><div class="support-section-head"><div><span>TRANSFER TEST</span><h2>Clinical challenges</h2></div><strong id="iabp-score">0 / 12</strong></div><div>' + challenges + '</div></section>' +
          '';
        ctx.main().innerHTML = ctx.frame(ctx.lab, body);

        function finishIfReady() {
          if (Object.keys(attempts).length === IABP_CASES.length && Object.keys(challengeDone).length === IABP_CHALLENGES.length) ctx.complete("iabp", score, 12);
        }
        function renderChoices(c) {
          ctx.html("iabp-choices", c.choices.map(function (x, i) { return '<label><input type="radio" name="iabp-predict" value="' + i + '"><span><b>' + String.fromCharCode(65+i) + '</b>' + ctx.esc(x) + '</span></label>'; }).join(""));
        }
        function update() {
          const c = IABP_CASES[current], inf = +document.querySelector("#iabp-inflation").value, def = +document.querySelector("#iabp-deflation").value;
          const trigger = document.querySelector("#iabp-trigger").value, ratio = document.querySelector("#iabp-ratio").value;
          const wave = iabpWave(inf, def, ratio, c.irregular, c.hr, trigger);
          document.querySelector(".iabp-monitor").style.setProperty("--sweep-duration", (180 / c.hr).toFixed(2) + "s");
          ["iabp-pressure","iabp-pressure-copy"].forEach(function(id){document.querySelector("#"+id).setAttribute("d",wave.arterial);}); ["iabp-native","iabp-native-copy"].forEach(function(id){document.querySelector("#"+id).setAttribute("d",wave.native);}); ["iabp-ecg","iabp-ecg-copy"].forEach(function(id){document.querySelector("#"+id).setAttribute("d",wave.ecg);}); ["iabp-balloon","iabp-balloon-copy"].forEach(function(id){document.querySelector("#"+id).setAttribute("d",wave.balloon);});
          const aug=Math.round(wave.model.augmentation),unload=-Math.round(wave.model.systolicDelta);
          ctx.publish({"Diastolic augmentation (mmHg)":aug,"Systolic pressure change (mmHg)":-unload,"Inflation (% RR)":inf,"Deflation (% RR)":def,"Heart rate (bpm)":c.hr});
          ctx.text("iabp-inf-out", inf + "%"); ctx.text("iabp-def-out", def + "%"); syncRotary("iabp-inflation"); syncRotary("iabp-deflation"); ctx.text("iabp-trigger-status", trigger.toUpperCase() + " · " + ratio + " assist"); ctx.text("iabp-screen-mode", trigger.toUpperCase() + " TRIGGER · " + ratio);
          ctx.text("iabp-aug", "+" + aug + " mmHg"); ctx.text("iabp-aug-label", inf < 34 ? "inflating before closure" : inf > 50 ? "late / attenuated" : "effective");
          ctx.text("iabp-after", (unload >= 0 ? "−" : "+") + Math.abs(unload) + " mmHg"); ctx.text("iabp-after-label", unload > 6 ? "afterload reduced" : unload >= 0 ? "limited unloading" : "afterload increased");
          let balance = c.ar ? "AR worsened" : (inf >= 35 && inf <= 47 && def >= 86 && def <= 99 ? "Improved" : (inf < 34 || def > 100 ? "Harmful" : "Suboptimal")); ctx.text("iabp-balance", balance);
          const m=wave.model,markerHtml=m.windows.map(function(w){return [[w.start,'INFLATE','iabp-inf-marker'],[w.end,'DEFLATE','iabp-def-marker']].map(function(e){const x=(e[0]-m.begin)/(m.end-m.begin)*840;return x>=0&&x<=840?'<g class="'+e[2]+'"><path d="M '+x+' 30 V 215"/><text x="'+(x+4)+'" y="45">'+e[1]+'</text></g>':'';}).join('');}).join('');ctx.html('iabp-markers',markerHtml);ctx.html('iabp-markers-copy',markerHtml);
          document.querySelector('.iabp-monitor').setAttribute('aria-label','Arterial pressure model: diastolic augmentation '+aug+' mmHg; systolic change '+(-unload)+' mmHg. Balloon state and timing markers use the same beat events.');

        }
        function loadCase(i) {
          current = i; const c = IABP_CASES[i];
          document.querySelectorAll("[data-iabp-case]").forEach(function (b) { b.classList.toggle("active", +b.dataset.iabpCase === i); });
          document.querySelector("#iabp-inflation").value = c.inflation; document.querySelector("#iabp-deflation").value = c.deflation; document.querySelector("#iabp-trigger").value = c.trigger; document.querySelector("#iabp-ratio").value = c.ratio;
          ctx.text("iabp-tag", c.tag.toUpperCase()); ctx.text("iabp-title", c.label); ctx.text("iabp-story", c.story); ctx.text("iabp-hr", c.hr); ctx.text("iabp-question", c.ask); renderChoices(c); ctx.text("iabp-assessment", attempts[c.id] ? "Scenario scored. Adjust the console and watch the physiology change." : "Select a prediction, then commit it before correcting the timing."); update();
        }
        document.querySelectorAll("[data-iabp-case]").forEach(function (b) { b.addEventListener("click", function () { loadCase(+b.dataset.iabpCase); }); });
        ["iabp-inflation","iabp-deflation","iabp-trigger","iabp-ratio"].forEach(function(id){ document.querySelector("#"+id).addEventListener("input", update); });
        document.querySelector("#iabp-pause").addEventListener("click",function(){const monitor=document.querySelector(".iabp-monitor"),paused=monitor.classList.toggle("paused");this.textContent=paused?"Resume":"Pause";this.setAttribute("aria-pressed",String(paused));});
        document.querySelector("#iabp-speed").addEventListener("change",function(){document.querySelector(".iabp-monitor").style.setProperty("--sweep-scale",this.value);});
        document.querySelector("#iabp-check").addEventListener("click", function () {
          const c = IABP_CASES[current], picked = document.querySelector('input[name="iabp-predict"]:checked');
          if (!picked) { ctx.text("iabp-assessment", "Choose a prediction before committing."); return; }
          const right = +picked.value === c.answer;
          if (!attempts[c.id]) { attempts[c.id] = true; if (right) score += 1; document.querySelector('[data-iabp-case="'+current+'"]').classList.add("done"); }
          ctx.html("iabp-assessment", '<b>' + (right ? "Correct." : "Not quite.") + '</b> ' + ctx.esc(c.correction)); ctx.text("iabp-score", score + " / 12"); finishIfReady();
        });
        document.querySelectorAll("[data-iabp-challenge]").forEach(function(card){ card.querySelectorAll("button").forEach(function(btn){ btn.addEventListener("click",function(){ const i=+card.dataset.iabpChallenge, c=IABP_CHALLENGES[i], right=+btn.dataset.answer===c.a; if(challengeDone[i]) return; challengeDone[i]=true; if(right) score+=1; btn.classList.add(right?"right":"wrong"); card.querySelectorAll("button")[c.a].classList.add("right"); card.querySelector("p").textContent=(right?"Correct. ":"Review: ")+c.why; ctx.text("iabp-score",score+" / 12"); finishIfReady(); }); }); });
        loadCase(0);
      }
    });
  }

  const TEG_CASES = [
    { id:"normal", label:"Normal post-protamine", tag:"Reference", r:6, k:1.8, alpha:68, ma:62, ly:1, hepR:5.8, bleed:"coag-ok", therapy:"observe", story:"Low chest-tube output and stable hemodynamics after uncomplicated CPB.", lesson:"A balanced tracing does not justify empiric products; keep evaluating the patient." },
    { id:"heparin", label:"Residual heparin", tag:"Anticoagulant", r:17, k:3.4, alpha:48, ma:58, ly:1, hepR:6.5, bleed:"coagulopathic", therapy:"protamine", story:"Diffuse oozing after CPB; the non-heparinase CT/R is markedly prolonged but corrects in the heparinase channel.", lesson:"Correction with heparinase supports residual heparin effect; follow the local protamine pathway and avoid blind over-reversal." },
    { id:"factors", label:"Factor deficiency", tag:"Initiation", r:16, k:3.8, alpha:43, ma:55, ly:2, hepR:15.2, bleed:"coagulopathic", therapy:"factors", story:"Prolonged CPB and dilution produce slow clot initiation that does not correct with heparinase.", lesson:"Persistent R/CT prolongation suggests factor deficiency or non-heparin anticoagulation; use the relevant assay and local factor-replacement pathway." },
    { id:"fibrinogen", label:"Low fibrinogen", tag:"Propagation", r:7, k:5.5, alpha:31, ma:43, ly:2, hepR:6.8, bleed:"coagulopathic", therapy:"fibrinogen", story:"Clot initiation is near normal, but kinetics are slow, alpha is shallow, and clot strength is reduced.", lesson:"Poor propagation points toward low fibrinogen contribution; confirm with functional fibrinogen/FIBTEM and treat to local thresholds." },
    { id:"platelets", label:"Platelet dysfunction", tag:"Strength", r:6.5, k:2.5, alpha:61, ma:35, ly:1, hepR:6.1, bleed:"coagulopathic", therapy:"platelets", story:"After long CPB, the platelet count is near normal but diffuse microvascular oozing persists and MA/MCF is low.", lesson:"MA/MCF integrates platelets and fibrinogen. A preserved fibrin-specific channel with low whole-clot strength supports platelet dysfunction." },
    { id:"lysis", label:"Hyperfibrinolysis", tag:"Breakdown", r:7, k:2, alpha:66, ma:59, ly:22, hepR:6.7, bleed:"coagulopathic", therapy:"antifibrinolytic", story:"The clot forms and reaches reasonable strength, then rapidly narrows over 30 minutes.", lesson:"High LY30/maximum lysis indicates clot breakdown; follow the antifibrinolytic and surgical bleeding pathway." },
    { id:"mixed", label:"Mixed post-CPB", tag:"Combined", r:13, k:5.2, alpha:35, ma:34, ly:8, hepR:9.2, bleed:"coagulopathic", therapy:"algorithm", story:"Massive transfusion, hypothermia and prolonged bypass produce abnormalities across initiation, propagation, strength and lysis.", lesson:"Treat reversible physiology and use a sequence guided by the dominant validated abnormality; indiscriminate product stacking adds harm." },
    { id:"surgical", label:"Surgical bleeder", tag:"Return to OR", r:6, k:1.7, alpha:70, ma:64, ly:1, hepR:5.9, bleed:"surgical", therapy:"surgery", story:"Bright red output remains brisk at 450 mL in the first ICU hour despite a balanced tracing and hemodynamic deterioration.", lesson:"A normal tracing cannot exclude a mechanical source. Continued brisk bleeding and compromise demand urgent surgical assessment, not empiric products." },
    { id:"rebound", label:"Heparin rebound", tag:"Delayed", r:14, k:3.1, alpha:51, ma:54, ly:2, hepR:6.2, bleed:"coagulopathic", therapy:"protamine", story:"Bleeding rises again four hours after initial hemostasis; R/CT is prolonged and corrects with heparinase.", lesson:"Delayed heparin redistribution can produce rebound anticoagulation; confirm the pattern and follow the local protamine strategy." }
  ];

  const TEG_BLEED = [["","Choose bleeding phenotype"],["coag-ok","No demonstrated coagulation target"],["coagulopathic","Coagulopathic / microvascular"],["surgical","Surgical / mechanical source"]];
  const TEG_THERAPY = [["","Choose next action"],["observe","No empiric hemostatic product; reassess"],["protamine","Protocol-guided additional protamine"],["factors","Factor replacement pathway (e.g. plasma/PCC per protocol)"],["fibrinogen","Fibrinogen replacement pathway"],["platelets","Platelet-directed therapy"],["antifibrinolytic","Antifibrinolytic pathway"],["algorithm","Correct temperature/pH and follow multidefect algorithm"],["surgery","Urgent surgical re-exploration assessment"]];

  function options(items) { return items.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join(""); }

  function tegTrace(c,width,height,maxT) {
    const m=window.CSModels.teg(c),center=165,top=[],bottom=[];
    for(let i=0;i<=500;i++){const t=i/500*maxT,x=i/500*width,a=m.amplitude(t)*1.5;top.push([x,center-a]);bottom.unshift([x,center+a]);}
    return svgPath(top.concat(bottom))+' Z';
  }
  // Independent synthetic INTEM / HEPTEM examples, in seconds. These are
  // not a patient-result conversion from TEG, and thresholds are assay-specific.
  const ROTEM_PRESETS=[[180,100,62,1,175],[620,180,58,1,185],[580,200,55,2,555],[210,330,43,2,205],[195,150,35,1,190],[210,110,59,22,200],[460,310,34,8,290],[180,100,64,1,178],[510,170,54,2,190]];

  function registerTeg() {
    window.CSLab.register({
      id:"teg-rotem", code:"VET", title:"TEG / ROTEM Hemostasis Lab", subtitle:"Read the entire viscoelastic story—from clot initiation through breakdown—compare heparinase channels, and choose targeted responses without missing a surgical bleeder.", category:"Hemostasis", minutes:26,
      sourceSections:["Cardiac Surgery Guide v3 · Modules 11.1–11.6", "Figure 11.1 · TEG/ROTEM tracing parameters", "Module 14.3 · Post-operative bleeding"],
      objectives:["Map R/CT, K/CFT, alpha, MA/MCF and LY30/ML to initiation, propagation, clot strength and fibrinolysis.", "Differentiate residual heparin from factor deficiency using a paired heparinase channel.", "Select targeted hemostatic therapy while recognizing that thresholds and products are protocol-specific.", "Distinguish brisk surgical bleeding from diffuse coagulopathic bleeding using waveform and clinical context.", "Avoid empiric transfusion when the trace does not demonstrate a correctable deficit."],
      teach: {
        concept: "A viscoelastic tracing tells a story in order — initiation (R/CT), propagation (K/CFT and alpha), clot strength (MA/MCF) and breakdown (LY30/ML) — each mapping to a different fixable defect. Pairing the standard channel with a heparinase channel separates residual heparin from factor deficiency. The most important lesson is restraint: a balanced trace does not justify empiric product, and a normal trace never excuses missing a surgical bleeder.",
        how: "Work through each case, reading the shape and the heparinase comparison, then classify the bleeding phenotype and choose a targeted next action. The sliders are for experimentation; scoring uses your interpretation of the loaded scenario. Watch for the case that is bleeding surgically despite a completely normal trace.",
        equations: ["R/CT → initiation · K/α → propagation", "MA/MCF → clot strength · LY30 → lysis", "Heparinase correction ⇒ residual heparin"]
      },
      render:function(ctx){
        let current=0,score=0,done={};
        const caseButtons=TEG_CASES.map(function(c,i){return '<button class="support-case'+(i===0?' active':'')+'" data-teg-case="'+i+'"><span>'+(i+1)+'</span><b>'+ctx.esc(c.label)+'</b><small>'+ctx.esc(c.tag)+'</small></button>';}).join("");
        const body='<section class="support-intro teg-intro"><div><span>WHOLE-BLOOD HEMOSTASIS</span><h2>Read shape before reaching for product</h2><p>Move through initiation, propagation, strength and lysis. Pair the trace with bleeding rate, temperature, heparin exposure and operative context.</p></div><div class="support-principle"><b>Trace → mechanism</b><span>Identify the dominant physiologic defect</span><b>Mechanism → targeted response</b><span>Use local validated assays and algorithms</span></div></section>'+
          '<nav class="support-cases" aria-label="TEG and ROTEM scenarios">'+caseButtons+'</nav>'+
          '<div class="support-main teg-layout"><aside class="support-console teg-console"><div class="support-panel-title"><span>VET</span><div><b>Tracing controls</b><small>Assay-specific labels and units</small></div></div>'+
          '<label>Assay<select id="teg-assay"><option value="teg">Kaolin TEG + heparinase</option><option value="rotem">INTEM + HEPTEM (ROTEM)</option></select></label><label><span><b id="teg-r-label">R</b> <output id="teg-r-out">6 min</output></span><input id="teg-r" type="range" min="3" max="22" step="0.5"></label><label><span><b id="teg-k-label">K</b> <output id="teg-k-out">1.8 min</output></span><input id="teg-k" type="range" min="0.8" max="7" step="0.1"></label><label><span>α (derived) <output id="teg-alpha-out">68°</output></span><input id="teg-alpha" disabled type="range" min="20" max="82"></label><label><span><b id="teg-ma-label">MA</b> <output id="teg-ma-out">62 mm</output></span><input id="teg-ma" type="range" min="10" max="78"></label><label><span><b id="teg-ly-label">LY30</b> <output id="teg-ly-out">1%</output></span><input id="teg-ly" type="range" min="0" max="35"></label>'+
          '<label class="teg-toggle"><input type="checkbox" id="teg-heparinase" checked><span><b>Overlay heparinase channel</b><small>Compare untreated R/CT with heparin-neutralized sample</small></span></label><button class="btn secondary" id="teg-reset">Reset scenario trace</button><div class="support-console-note" id="teg-live" aria-live="polite"></div></aside>'+
          '<section class="support-workbench"><header><div><span id="teg-tag">REFERENCE</span><h2 id="teg-title">Normal post-protamine</h2><p id="teg-story"></p></div><div class="support-pulse"><small>SCENARIO</small><b id="teg-number">1/9</b><span>whole-blood tracing</span></div></header>'+
          '<div class="teg-monitor playing"><div class="iabp-screen-head"><span><span id="teg-time-label">CLOT EVOLUTION · TIME IN MINUTES</span></span><div class="support-playback"><button id="teg-pause" type="button" aria-pressed="false">Pause</button><button id="teg-replay" type="button">Replay</button><label>Speed <select id="teg-speed"><option value="1.6">0.6×</option><option value="1" selected>1×</option><option value=".55">1.8×</option></select></label></div><b>STANDARD + HEPARINASE</b></div><svg viewBox="0 0 840 330" preserveAspectRatio="none" role="img" aria-label="Animated viscoelastic clot formation and lysis with heparinase comparison"><g class="iabp-grid">'+Array.from({length:10},function(_,i){return '<path d="M '+(i*84)+' 0 V 330"/>';}).join("")+Array.from({length:7},function(_,i){return '<path d="M 0 '+(i*55)+' H 840"/>';}).join("")+'</g><g class="teg-trace-layer"><path id="teg-trace" class="teg-trace"/><path id="teg-hep-trace" class="teg-hep-trace"/></g><line class="teg-cursor" x1="0" y1="0" x2="0" y2="330"/><path class="teg-axis" d="M0 165 H840"/><g class="teg-labels"><text x="10" y="22">+ AMPLITUDE</text><text x="10" y="317">− AMPLITUDE</text><text x="610" y="30">Solid: standard</text><text x="610" y="49">Dashed: heparinase</text></g></svg><div class="teg-hep-compare"><div><small><span id="teg-standard-label">STANDARD R</span></small><b id="teg-standard-r">6.0 min</b></div><span>→</span><div><small><span id="teg-hep-label">HEPARINASE R</span></small><b id="teg-hep-r">5.8 min</b></div><div class="teg-delta"><small>CORRECTION</small><b id="teg-delta">0.2 min</b><em id="teg-hep-call">No meaningful heparin effect</em></div></div><div class="teg-parameter-strip"><span><b>R / CT</b> initiation</span><span><b>K / CFT + α</b> propagation</span><span><b>MA / MCF</b> strength</span><span><b>LY30 / ML</b> breakdown</span></div></div>'+
          '<div class="support-metrics teg-metrics"><div id="teg-init"><small>INITIATION</small><b>Normal</b><span>Factors / anticoagulant</span></div><div id="teg-prop"><small>PROPAGATION</small><b>Normal</b><span>Fibrinogen contribution</span></div><div id="teg-strength"><small>CLOT STRENGTH</small><b>Normal</b><span>Platelets + fibrin</span></div><div id="teg-lysis"><small>LYSIS</small><b>Normal</b><span>Clot breakdown</span></div></div>'+
          '<section class="teg-decision"><span>COMMIT YOUR INTERPRETATION</span><h3>Classify the bleeding and choose the most defensible next response.</h3><div><label>Bleeding phenotype<select id="teg-bleed">'+options(TEG_BLEED)+'</select></label><label>Targeted next action<select id="teg-therapy">'+options(TEG_THERAPY)+'</select></label><button class="btn primary" id="teg-submit">Score decision</button></div><p id="teg-feedback" aria-live="polite">The tracing is one part of the decision. Use the clinical bleeding pattern too.</p></section></section></div>'+
          '<details class="support-primer"><summary>Parameter-to-physiology map</summary><div><article><b>R-time / CT</b><p>Time to initial fibrin formation. Prolongation suggests factor deficiency or anticoagulant effect. A correction in the heparinase channel supports residual heparin.</p></article><article><b>K / CFT and alpha</b><p>Speed of clot build-up. A long K/CFT and shallow alpha indicate impaired fibrin polymerization, often requiring a fibrin-specific assay before replacement.</p></article><article><b>MA / MCF</b><p>Maximum whole-clot strength. Platelets usually dominate, with a meaningful fibrinogen contribution; interpret alongside functional fibrinogen/FIBTEM.</p></article><article><b>LY30 / ML</b><p>Loss of firmness after maximum strength. Excess lysis suggests hyperfibrinolysis, but assay definitions and thresholds differ between platforms.</p></article></div></details>'+
          '<section class="teg-surgery"><div><span>SURGICAL VS COAGULOPATHIC</span><h2>Never let a normal trace delay source control</h2></div><div><article><b>Surgical pattern</b><p>Bright, brisk, sustained output; localized source or sudden rebleeding; persistence despite corrected coagulation; hemodynamic compromise or retained-clot/tamponade concern.</p></article><article><b>Coagulopathic pattern</b><p>Diffuse microvascular ooze, abnormal targeted testing and response to mechanism-specific correction. Recheck temperature, pH, ionized calcium and residual heparin.</p></article><article><b>Guide thresholds are context, not autopilot</b><p>Examples include 400–500 mL in hour one, 200–300 mL/h for 2–4 hours, a sudden increase, or hemodynamic compromise. Escalate earlier when physiology deteriorates.</p></article></div></section>'+
          '<div class="support-debrief"><div><span>PROGRESS</span><h2>Complete all nine interpretations</h2><p>Each case awards one point for mechanism classification and one for the targeted response. Changing the sliders is for experimentation; scoring uses your selected interpretation of the loaded clinical scenario.</p></div><strong id="teg-score">0 / 18</strong></div>'+
          '';
        ctx.main().innerHTML=ctx.frame(ctx.lab,body);

        function assay(){return document.querySelector('#teg-assay').value;}
        function scenario(){const c=TEG_CASES[current];if(assay()==='teg')return c;const p=ROTEM_PRESETS[current];return Object.assign({},c,{r:p[0]/60,k:p[1]/60,ma:p[2],ly:p[3],hepR:p[4]/60});}
        function state(){const factor=assay()==='rotem'?60:1;return {r:+document.querySelector('#teg-r').value/factor,k:+document.querySelector('#teg-k').value/factor,ma:+document.querySelector('#teg-ma').value,ly:+document.querySelector('#teg-ly').value};}
        function isDirty(){const c=scenario(),s=state();return ['r','k','ma','ly'].some(k=>Math.abs(c[k]-s[k])>.001);}
        function draw(){const s=state(),c=scenario(),m=window.CSModels.teg(s),rot=assay()==='rotem',factor=rot?60:1,unit=rot?' s':' min',dirty=isDirty(),maxT=Math.max(50,Math.ceil(m.end/10)*10),overlay=document.querySelector('#teg-heparinase').checked&&!dirty;
          document.querySelector('#teg-trace').setAttribute('d',tegTrace(s,840,300,maxT));document.querySelector('#teg-hep-trace').setAttribute('d',overlay?tegTrace(Object.assign({},s,{r:c.hepR}),840,300,maxT):'');
          [['teg-r-out',(s.r*factor).toFixed(rot?0:1)+unit],['teg-k-out',m.k===null?'Not reached':(s.k*factor).toFixed(rot?0:1)+unit],['teg-alpha-out',m.alphaDerived===null?'Not defined':m.alphaDerived.toFixed(0)+'°'],['teg-ma-out',s.ma+' mm'],['teg-ly-out',s.ly+'%']].forEach(x=>ctx.text(x[0],x[1]));
          document.querySelector('#teg-alpha').value=m.alphaDerived||20;
          const labels=rot?['CT','CFT','MCF','ML at end']:['R','K','MA','LY30'];['r','k','ma','ly'].forEach((k,i)=>ctx.text('teg-'+k+'-label',labels[i]));ctx.text('teg-standard-label',rot?'INTEM CT':'KAOLIN R');ctx.text('teg-hep-label',rot?'HEPTEM CT':'HEPARINASE R');
          ctx.text('teg-time-label','0–'+maxT+' min · maximum at '+m.tma.toFixed(1)+' min · lysis assessed at '+m.end.toFixed(1)+' min');
          const init=rot?(s.r*60>240?'Prolonged':s.r*60<100?'Short':'Reference range'):(s.r>10?'Prolonged':s.r<4?'Short':'Reference range');
          [['teg-init',init],['teg-prop',m.k===null?'20 mm not reached':s.k>(rot?110/60:3)?'Slow':'Reference range'],['teg-strength',s.ma<50?'Low':s.ma>72?'High':'Reference range'],['teg-lysis',s.ly>(rot?15:7)?'Excess':'Low']].forEach(x=>{const el=document.querySelector('#'+x[0]);el.querySelector('b').textContent=x[1];el.dataset.state=x[1].toLowerCase();});
          const delta=(s.r-c.hepR)*factor;ctx.text('teg-standard-r',(s.r*factor).toFixed(rot?0:1)+unit);ctx.text('teg-hep-r',dirty?'Not modeled':(c.hepR*factor).toFixed(rot?0:1)+unit);ctx.text('teg-delta',dirty?'—':delta.toFixed(rot?0:1)+unit);ctx.text('teg-hep-call',dirty?'Reset to restore paired sample':c.r/c.hepR>1.25?'Correction supports heparin effect':'No substantial correction');
          ctx.text('teg-live',dirty?'Exploration: the paired sample is hidden because its response to arbitrary edits is not modeled. Reset the scenario before scoring.':(rot?'INTEM / HEPTEM synthetic paired assays. CT/CFT use seconds; MCF uses mm. ML is maximum loss through the stated observation endpoint.':'Kaolin TEG synthetic paired assays. R/K use minutes; MA is full trace width in mm; LY30 is loss 30 minutes after MA.')+' Reference ranges illustrate this assay; use local validated intervals.');
          ctx.publish({Assay:rot?'INTEM / HEPTEM':'Kaolin TEG', [labels[0]+unit]:s.r*factor,[labels[1]+unit]:m.k===null?'Not reached':s.k*factor,[labels[2]+' (mm)']:s.ma,[labels[3]+' (%)']:s.ly,'Maximum at (min)':m.tma});
          document.querySelector('.teg-monitor svg').setAttribute('aria-label',(rot?'INTEM':'Kaolin TEG')+' trace, initiation '+(s.r*factor).toFixed(1)+unit+', maximum full width '+s.ma+' mm, '+s.ly+' percent loss at '+m.end.toFixed(1)+' minutes.');
        }
        function load(i){current=i;const c=scenario(),factor=assay()==='rotem'?60:1;document.querySelectorAll("[data-teg-case]").forEach(function(b){b.classList.toggle("active",+b.dataset.tegCase===i);}); [["teg-r",c.r*factor],["teg-k",c.k*factor],["teg-alpha",c.alpha||60],["teg-ma",c.ma],["teg-ly",c.ly]].forEach(function(x){document.querySelector("#"+x[0]).value=x[1];});ctx.text("teg-tag",c.tag.toUpperCase());ctx.text("teg-title",c.label);ctx.text("teg-story",c.story);ctx.text("teg-number",(i+1)+"/"+TEG_CASES.length);document.querySelector("#teg-bleed").value="";document.querySelector("#teg-therapy").value="";ctx.text("teg-feedback",done[c.id]?"This scenario is already scored. Continue experimenting or load another case.":"Interpret the tracing together with the bleeding story, then commit both selections.");draw();replayTeg();}
        document.querySelector('#teg-assay').addEventListener('change',function(){const rot=assay()==='rotem';[['r',rot?30:3,rot?1320:22,rot?5:.5],['k',rot?20:.8,rot?420:7,rot?5:.1]].forEach(x=>{const e=document.querySelector('#teg-'+x[0]);e.min=x[1];e.max=x[2];e.step=x[3];});load(current);});
        ["teg-r","teg-k","teg-alpha","teg-ma","teg-ly","teg-heparinase"].forEach(function(id){document.querySelector("#"+id).addEventListener("input",draw);});
        document.querySelectorAll("[data-teg-case]").forEach(function(b){b.addEventListener("click",function(){load(+b.dataset.tegCase);});});
        document.querySelector("#teg-reset").addEventListener("click",function(){load(current);});
        function replayTeg(){const monitor=document.querySelector(".teg-monitor");monitor.classList.remove("playing","paused");void monitor.offsetWidth;monitor.classList.add("playing");document.querySelector("#teg-pause").textContent="Pause";document.querySelector("#teg-pause").setAttribute("aria-pressed","false");}
        document.querySelector("#teg-replay").addEventListener("click",replayTeg);
        document.querySelector("#teg-pause").addEventListener("click",function(){const monitor=document.querySelector(".teg-monitor"),paused=monitor.classList.toggle("paused");this.textContent=paused?"Resume":"Pause";this.setAttribute("aria-pressed",String(paused));});
        document.querySelector("#teg-speed").addEventListener("change",function(){document.querySelector(".teg-monitor").style.setProperty("--teg-scale",this.value);replayTeg();});
        document.querySelector("#teg-submit").addEventListener("click",function(){if(isDirty()){ctx.text("teg-feedback","Reset the scenario trace before scoring its clinical interpretation.");return;}const c=TEG_CASES[current],bleed=document.querySelector("#teg-bleed").value,therapy=document.querySelector("#teg-therapy").value;if(!bleed||!therapy){ctx.text("teg-feedback","Choose both the bleeding phenotype and a targeted next action.");return;}if(done[c.id]){ctx.text("teg-feedback","Already scored: "+c.lesson);return;}const bRight=bleed===c.bleed,tRight=therapy===c.therapy;score+=(bRight?1:0)+(tRight?1:0);done[c.id]=true;document.querySelector('[data-teg-case="'+current+'"]').classList.add("done");ctx.html("teg-feedback",'<b>'+(bRight&&tRight?'Both decisions are sound.':(bRight||tRight?'One of two decisions is sound.':'Rebuild the interpretation.'))+'</b> '+ctx.esc(c.lesson));ctx.text("teg-score",score+" / 18");if(Object.keys(done).length===TEG_CASES.length)ctx.complete("teg-rotem",score,18);});
        load(0);
      }
    });
  }

  registerIabp();
  registerTeg();
})();
