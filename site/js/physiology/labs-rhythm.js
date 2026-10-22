/* CardiacSchool rhythm physiology trainers: ECG interpretation and temporary epicardial pacing. */
(function () {
  "use strict";
  const requestAnimationFrame = fn => window.CSLab.raf(fn), cancelAnimationFrame = id => window.CSLab.cancelRaf(id);

  if (!window.CSLab) throw new Error("CSLab core must load before rhythm labs");
  if (!window.CSECG) throw new Error("CSECG engine must load before rhythm labs");

  const ECG = window.CSECG;

  const ECG_CASES = [
    {
      id: "sinus-baseline", label: "Pre-operative baseline", level: "Foundation", postop: "Pre-operative CABG assessment",
      context: "A 64-year-old with stable three-vessel coronary disease has no chest pain during the tracing.", vitals: "BP 132/76 · SpO₂ 97% · K 4.2 mmol/L",
      rate: 76, atrialRate: 76, rhythm: "sinus", axis: "normal", conduction: "normal", territory: "none", priority: "compare",
      p: true, pDuration: 100, pr: 168, qrs: 92, qtc: 422, qrsAxis: 55, description: "Regular sinus rhythm, normal axis and intervals, without an acute territorial ST pattern.",
      clues: ["P wave before every QRS", "Constant PR interval", "Narrow QRS", "No contiguous territorial ST shift"],
      action: "Use this as the comparison tracing. In perioperative practice, always compare with the pre-operative ECG before labeling a change as new."
    },
    {
      id: "poaf", label: "POD 2 · monitor alarm", level: "Core", postop: "Post-CABG day 2",
      context: "The monitor alarms after chest physiotherapy. The patient reports palpitations; extremities are warm and mentation is normal.", vitals: "BP 108/68 · SpO₂ 95% · K 3.7 · Mg 1.7",
      rate: 136, atrialRate: 420, rhythm: "af", axis: "normal", conduction: "narrow", territory: "none", priority: "poaf-stable",
      p: false, pr: null, qrs: 94, qtc: 451, qrsAxis: 55, irregular: true, description: "Atrial fibrillation with rapid ventricular response: no organized P waves and an irregularly irregular narrow-complex rhythm.",
      clues: ["Irregularly irregular R–R intervals", "No reproducible P waves", "Narrow QRS favors supraventricular origin", "POD 2–3 is the peak POAF window"],
      action: "Assess stability first, then correct triggers such as pain, hypoxia, volume disturbance, potassium and magnesium. Stable POAF generally begins with rate control; synchronized cardioversion is prioritized when instability is attributable to AF. Anticoagulation requires individualized bleeding/thromboembolic assessment after recent surgery."
    },
    {
      id: "complete-block", label: "Post-AVR · profound bradycardia", level: "Core", postop: "Six hours after surgical AVR",
      context: "Atrial activity marches through the tracing, but the arterial pressure falls when backup pacing is paused.", vitals: "BP 74/42 · cool peripheries · K 4.4 · Mg 2.1",
      rate: 32, atrialRate: 88, rhythm: "complete-block", axis: "left", conduction: "complete-avb", territory: "none", priority: "pace",
      p: true, pDuration: 100, pr: null, qrs: 154, qtc: 482, qrsAxis: -50, description: "Complete AV block with AV dissociation and a slow wide ventricular escape rhythm.",
      clues: ["P–P and R–R intervals are regular but unrelated", "No fixed PR relationship", "Slow wide escape suggests an infra-Hisian/ventricular focus", "AVR can injure tissue near the membranous septum/His bundle"],
      action: "Treat inadequate escape immediately with functioning temporary epicardial pacing while correcting reversible causes and assessing ischemia. Persistent postoperative block is monitored for recovery; lack of recovery over the usual 5–7 day window prompts permanent pacing evaluation."
    },
    {
      id: "tavi-lbbb", label: "Post-TAVI · new broad QRS", level: "Core", postop: "Twenty-four hours after TAVI",
      context: "The patient feels well, but the QRS was 96 ms before the valve procedure and the PR was 180 ms.", vitals: "BP 120/80 · SpO₂ 98% · no presyncope",
      rate: 78, atrialRate: 78, rhythm: "sinus", axis: "left", conduction: "lbbb", territory: "limited", priority: "monitor-conduction",
      p: true, pDuration: 102, pr: 220, qrs: 160, qtc: 478, qrsAxis: -42, lbbb: true, description: "Sinus rhythm with new first-degree AV delay and new LBBB after TAVI; repolarization is secondarily abnormal and ischemia interpretation is limited.",
      clues: ["Broad QRS ≥120 ms", "Predominantly negative V1 with broad/notched lateral R waves", "PR has lengthened from baseline", "New LBBB after TAVI warns of possible progression to high-grade block"],
      action: "Continue monitored conduction surveillance and escalate according to the local post-TAVI pathway; symptoms, pauses or progression to high-grade AV block require urgent action. Do not use this simplified tracing to exclude ischemia in LBBB."
    },
    {
      id: "inferior-injury", label: "Post-CABG · new hypotension", level: "Advanced", postop: "Forty minutes after CABG separation",
      context: "New hypotension and inferior ST change develop after transfer to the ICU. The right ventricle looks newly impaired on bedside imaging.", vitals: "BP 82/50 · CVP 17 · CI 1.8 L/min/m²",
      rate: 58, atrialRate: 58, rhythm: "sinus", axis: "right", conduction: "first-degree", territory: "inferior", priority: "urgent-ischemia",
      p: true, pDuration: 104, pr: 224, qrs: 108, qtc: 436, qrsAxis: 105, stVector: { axis: 110, amplitude: 0.325 }, description: "Sinus bradycardia with inferior injury pattern and reciprocal high-lateral depression; proximal RCA/right-graft compromise must be considered in this context.",
      clues: ["ST elevation in contiguous II, III and aVF", "Reciprocal ST depression in I/aVL", "III greater than II plus RV dysfunction supports proximal RCA involvement", "Inferior ischemia may accompany AV nodal conduction disturbance"],
      action: "This is an urgent postoperative graft/coronary assessment problem, not a watch-and-repeat exercise. Correlate immediately with hemodynamics, TEE/echo wall motion and graft/coronary evaluation while the surgical team prepares definitive rescue."
    },
    {
      id: "anterior-injury", label: "Post-CABG · rising support", level: "Advanced", postop: "Two hours after CABG",
      context: "The patient develops rising vasoactive requirements and a new anterior regional wall-motion abnormality.", vitals: "BP 88/54 · CI 1.7 L/min/m² · lactate rising",
      rate: 104, atrialRate: 104, rhythm: "sinus", axis: "normal", conduction: "normal", territory: "anterior", priority: "urgent-ischemia",
      p: true, pDuration: 92, pr: 154, qrs: 104, qtc: 462, qrsAxis: 55, stVector: { axis: -90, amplitude: 0.08 }, st: { V1: 1.5, V2: 3.4, V3: 3.8, V4: 2.7 }, description: "Sinus tachycardia with contiguous anterior ST elevation (V1–V4), concerning for acute LAD-territory ischemia in this postoperative context.",
      clues: ["Contiguous V1–V4 injury pattern", "New anterior wall-motion change supports true ischemia", "Tachycardia may worsen supply–demand balance but does not explain territorial elevation", "A new graft-territory pattern demands urgent evaluation"],
      action: "Activate urgent assessment of graft patency, coronary flow, air/technical obstruction and ventricular function. A postoperative ECG must be integrated with TEE and hemodynamics; it does not identify the surgical mechanism by itself."
    },
    {
      id: "monomorphic-vt", label: "ICU · sudden collapse", level: "Crisis", postop: "Post-CABG day 1",
      context: "A sudden broad-complex rhythm appears with loss of the arterial waveform and decreasing consciousness.", vitals: "No palpable pulse · arterial line flat · K pending",
      rate: 178, atrialRate: null, rhythm: "vt", axis: "extreme", conduction: "ventricular", territory: "none", priority: "pulseless-vt",
      p: false, pr: null, qrs: 176, qt: 296, qtc: null, qrsAxis: -135, description: "Regular monomorphic wide-complex tachycardia; in this clinical context treat as pulseless VT.",
      clues: ["Regular broad complexes", "No consistent preceding P waves", "QRS morphology is uniform beat to beat", "The clinical pulse check determines the resuscitation branch"],
      action: "Start the pulseless-arrest pathway with immediate defibrillation-quality resuscitation while rapidly seeking reversible postoperative causes such as ischemia/graft failure, electrolytes, hypoxia, tamponade and severe ventricular dysfunction."
    },
    {
      id: "ventricular-paced", label: "Post-MVr · new waveform", level: "Core", postop: "Post-mitral repair day 1",
      context: "The epicardial generator is set to VVI 70. The arterial waveform is stable but the patient reports neck pulsations.", vitals: "BP 96/62 · CVP cannon waves · generator VVI 70",
      rate: 70, atrialRate: 82, rhythm: "ventricular-paced", axis: "left", conduction: "paced", territory: "limited", priority: "assess-av-sync",
      p: true, pDuration: 100, pr: null, qrs: 168, qtc: 490, qrsAxis: -55, paced: true, pacingRate: 70, description: "Ventricular-paced rhythm with pacing spikes followed by broad captured QRS complexes and AV dissociation.",
      clues: ["Narrow pacing spike before each broad QRS", "Each spike is followed by a ventricular complex: capture present", "Atrial activity is not synchronized with paced ventricles", "Cannon waves/low output can reflect pacemaker syndrome"],
      action: "Confirm electrical and mechanical capture, then assess whether AV sequential pacing can safely restore synchrony when atrial rhythm and wires permit. ST analysis is limited in a paced ventricular pattern."
    },
    {
      id: "failure-capture", label: "ICU · intermittent pulses", level: "Crisis", postop: "Twelve hours after CABG",
      context: "The patient is pacing-dependent. Every second generator spike is no longer followed by an arterial upstroke.", vitals: "BP intermittent · ventricular output 4 mA · K 3.3 · Mg 1.5",
      rate: 36, atrialRate: 82, rhythm: "failure-capture", axis: "left", conduction: "paced-failure", territory: "limited", priority: "restore-capture",
      p: true, pDuration: 100, pr: null, qrs: 166, qt: 520, qtc: null, qrsAxis: -55, paced: true, pacingRate: 72, captureFailure: true, description: "Intermittent failure to capture: pacing stimuli at 72/min alternate between captured broad complexes and stimuli without a following QRS, producing an effective ventricular rate near 36/min.",
      clues: ["Some pacing spikes have no subsequent QRS", "Electrical capture must be paired with an arterial pulse/mechanical response", "Low potassium/magnesium and postoperative edema can raise capture threshold", "Connection, wire integrity and generator failure must be checked"],
      action: "In a pacing-dependent patient, call for help and maintain a rescue pacing strategy while checking connections, raising output to restore capture, testing the alternate wire/generator and correcting reversible causes. Arrange transvenous pacing if reliable epicardial capture cannot be secured; transcutaneous pacing is an emergency bridge, not dependable definitive support."
    },
    {
      id: "hyperkalemia", label: "ICU · metabolic conduction change", level: "Advanced", postop: "Postoperative AKI",
      context: "The QRS has widened over two hours and the T waves are newly tall. There is no territorial wall-motion abnormality.", vitals: "BP 102/64 · K 6.7 mmol/L · creatinine rising",
      rate: 52, atrialRate: 52, rhythm: "sinus", axis: "normal", conduction: "metabolic-wide", territory: "none", priority: "hyperk",
      p: true, pDuration: 112, pScale: 0.55, pr: 218, qrs: 132, qt: 300, qtc: null, qrsAxis: 55, peakedT: true, description: "Sinus bradycardia with attenuated P waves, PR prolongation, QRS widening and diffuse narrow-based peaked T waves, concerning for hyperkalemic conduction toxicity.",
      clues: ["Diffuse rather than territorial T-wave change", "Progressive P attenuation with PR/QRS prolongation", "Laboratory potassium supports the mechanism", "This is a representative toxicity phenotype; a normal-looking ECG does not exclude dangerous hyperkalemia"],
      action: "Treat severe hyperkalemia urgently according to the critical-care pathway while stabilizing the myocardium and shifting/removing potassium. Continue rhythm monitoring and reassess the tracing as potassium is corrected."
    }
  ];

  const ECG_OPTIONS = {
    rhythm: [
      ["", "Choose rhythm"], ["sinus", "Sinus rhythm"], ["af", "Atrial fibrillation"], ["complete-block", "Complete AV block"],
      ["vt", "Monomorphic ventricular tachycardia"], ["ventricular-paced", "Ventricular-paced rhythm"], ["failure-capture", "Pacing with failure to capture"]
    ],
    axis: [["", "Choose axis"], ["normal", "Normal"], ["left", "Left deviation"], ["right", "Right deviation"], ["extreme", "Extreme axis"]],
    conduction: [
      ["", "Choose conduction"], ["normal", "Normal intervals"], ["narrow", "Narrow supraventricular conduction"], ["first-degree", "First-degree AV delay"],
      ["complete-avb", "Third-degree / complete AV block"], ["lbbb", "Left bundle branch block"], ["ventricular", "Ventricular-origin QRS"],
      ["paced", "Ventricular paced / captured"], ["paced-failure", "Intermittent failure to capture"], ["metabolic-wide", "Diffuse metabolic conduction delay"]
    ],
    territory: [["", "Choose territory"], ["none", "No acute territorial pattern"], ["inferior", "Inferior (II, III, aVF)"], ["anterior", "Anterior (V1–V4)"], ["limited", "ST interpretation limited"]],
    priority: [
      ["", "Choose immediate priority"], ["compare", "Compare with baseline / routine context"], ["poaf-stable", "Assess triggers and control stable POAF rate"],
      ["pace", "Urgent reliable temporary pacing"], ["monitor-conduction", "Monitored post-TAVI conduction surveillance"], ["urgent-ischemia", "Urgent graft/coronary and imaging assessment"],
      ["pulseless-vt", "Pulseless VT resuscitation/defibrillation pathway"], ["assess-av-sync", "Confirm capture and restore AV synchrony if suitable"],
      ["restore-capture", "Restore reliable capture with rescue pacing ready"], ["hyperk", "Emergency hyperkalemia treatment pathway"]
    ]
  };

  const LEADS = ECG.LEADS;

  const PACING_CASES = [
    {
      id: "sinus-brady", label: "Sinus bradycardia after CABG", level: "Core", procedure: "CABG · POD 0",
      context: "Sinus bradycardia at 44/min with intact AV conduction, MAP 55 and functioning atrial and ventricular wires.",
      intrinsicA: 44, intrinsicV: 44, aAmp: 3.2, vAmp: 8.5, aThreshold: 2.0, vThreshold: 3.0, noise: 0.2, avIntact: true, wireA: true, wireV: true,
      goal: { modes: ["AAI", "DDD"], rate: [75, 90], aOut: [4, 20], vOut: [6, 20], aSense: [0.5, 3], vSense: [1, 7], av: [140, 220] },
      question: "What is the safest programming concept while the bradycardia is causing low pressure?",
      choices: ["Use VVI 40 so ventricular pacing rarely occurs despite hypotension", "Select asynchronous DOO indefinitely without reassessing intrinsic rhythm or competitive pacing", "Provide AAI or DDD rate support after confirming thresholds and AV conduction", "Lower output below capture threshold to test pacing dependence during hypotension"], answer: 2,
      debrief: "Rate support is needed because the slow sinus rhythm is hemodynamically inadequate. AAI preserves intrinsic ventricular activation when AV conduction is reliable; DDD is reasonable if dual-chamber support is desired. Output should provide a safety margin above measured threshold, with electrical and mechanical capture confirmed."
    },
    {
      id: "complete-heart-block", label: "Complete block after AVR", level: "Core", procedure: "Surgical AVR · POD 0",
      context: "P waves at 86/min are dissociated from a ventricular escape at 28/min. The hypertrophied LV is preload and AV-synchrony dependent.",
      intrinsicA: 86, intrinsicV: 28, aAmp: 2.8, vAmp: 7.6, aThreshold: 2.5, vThreshold: 4.0, noise: 0.2, avIntact: false, wireA: true, wireV: true,
      goal: { modes: ["DDD"], rate: [75, 90], aOut: [5, 20], vOut: [8, 20], aSense: [0.5, 2.5], vSense: [1, 6], av: [150, 200] },
      question: "Which setup best restores rate and AV synchrony?",
      choices: ["Use DDD with adequate atrial/ventricular outputs, confirmed capture and a physiologic AV delay", "Use AAI because atrial capture ensures ventricular conduction despite complete block", "Program VVI 40 despite the slow escape and low cardiac output", "Set DOO below the escape rate without confirming electrical or mechanical capture"], answer: 0,
      debrief: "DDD can track or pace the atrium and then pace the ventricle after the programmed AV delay, restoring coordinated filling. AAI is unsafe when AV conduction is absent. Reversible contributors—electrolytes, ischemia and medications—still require assessment."
    },
    {
      id: "poaf", label: "New postoperative AF", level: "Core", procedure: "Mitral repair · POD 3",
      context: "Irregular atrial activity is 380/min, ventricular response 112/min, BP 118/70. Atrial tracking would be undesirable.",
      intrinsicA: 380, intrinsicV: 112, aAmp: 0.6, vAmp: 8.1, aThreshold: 3.0, vThreshold: 3.5, noise: 0.3, avIntact: false, wireA: true, wireV: true, af: true,
      goal: { modes: ["VVI"], rate: [50, 80], aOut: [0, 20], vOut: [7, 20], aSense: [0.5, 5], vSense: [1, 7], av: [120, 240] },
      question: "What should the pacing console accomplish in stable POAF?",
      choices: ["Track each chaotic atrial event in DDD to maximize ventricular rate support", "Use AAI at 120 to overdrive the fibrillating atrium while assuming intact AV conduction", "Use fixed DOO pacing for the entire admission without reassessing rhythm", "Provide ventricular backup without tracking AF; manage the arrhythmia separately"], answer: 3,
      debrief: "The console is not the treatment for stable AF. Ventricular demand backup avoids atrial tracking, while the clinical team evaluates triggers, rate/rhythm strategy and anticoagulation in the context of fresh surgery. If instability is caused by AF, synchronized cardioversion becomes the priority."
    },
    {
      id: "pacemaker-syndrome", label: "VVI with loss of AV synchrony", level: "Advanced", procedure: "AVR · POD 1",
      context: "VVI 70 captures, but the patient has cannon A waves, dizziness, rising CVP and a sinus rate of 82/min. Both wires function.",
      intrinsicA: 82, intrinsicV: 34, aAmp: 3.5, vAmp: 9.0, aThreshold: 2.0, vThreshold: 3.0, noise: 0.2, avIntact: false, wireA: true, wireV: true,
      goal: { modes: ["DDD"], rate: [70, 90], aOut: [4, 20], vOut: [6, 20], aSense: [0.5, 3], vSense: [1, 7], av: [150, 200] },
      question: "What console change addresses the likely hemodynamic mechanism?",
      choices: ["Increase VVI output despite reliable capture and persistent AV dissociation", "Use AV-sequential DDD pacing, confirm capture and optimize the AV delay for output", "Lower the backup rate to 30 while cardiac output remains inadequate", "Disable ventricular pacing and observe despite the slow complete-block escape"], answer: 1,
      debrief: "Electrical ventricular capture does not guarantee optimal hemodynamics. VVI can dissociate atrial contraction from the ventricle, producing pacemaker syndrome. With usable atrial activity and both wires, DDD restores AV sequence; AV delay is then optimized against blood pressure/output and filling."
    },
    {
      id: "atrial-undersensing", label: "Atrial undersensing in DDD", level: "Advanced", procedure: "CABG · POD 1",
      context: "P waves measure 1.2 mV. Atrial sensitivity is set to 4.0 mV, so some P waves are not tracked; wire continuity is intact.",
      intrinsicA: 74, intrinsicV: 32, aAmp: 1.2, vAmp: 8.2, aThreshold: 2.5, vThreshold: 3.0, noise: 0.2, avIntact: false, wireA: true, wireV: true,
      goal: { modes: ["DDD"], rate: [65, 85], aOut: [5, 20], vOut: [6, 20], aSense: [0.5, 1.1], vSense: [1, 7], av: [150, 200] },
      question: "How do you make the atrial channel more sensitive?",
      choices: ["Lower the atrial mV setting below the measured P-wave amplitude while avoiding noise sensing", "Increase the mV setting to make the atrial channel less responsive", "Reduce ventricular output despite a problem confined to atrial sensing", "Select AAI even though AV conduction is absent and unreliable"], answer: 0,
      debrief: "On typical temporary generators, a lower mV number is more sensitive. The sensing threshold must sit below the intrinsic signal with a margin, but not so low that noise is detected. If adjustment fails, check connections, wire integrity and signal amplitude rather than turning knobs indefinitely."
    },
    {
      id: "ventricular-noncapture", label: "Ventricular failure to capture", level: "Crisis", procedure: "CABG · ICU hour 12",
      context: "The patient is pacing-dependent. Ventricular threshold has risen to 7 mA with edema and K 3.2; current output is 4 mA.",
      intrinsicA: 78, intrinsicV: 24, aAmp: 3.0, vAmp: 6.8, aThreshold: 2.5, vThreshold: 7.0, noise: 0.2, avIntact: false, wireA: true, wireV: true,
      goal: { modes: ["DDD", "VVI"], rate: [70, 90], aOut: [5, 20], vOut: [14, 20], aSense: [0.5, 2.5], vSense: [1, 6], av: [140, 220] },
      question: "What is the immediate safe troubleshooting sequence?",
      choices: ["Lower output to preserve the battery while waiting for spontaneous capture", "Change sensitivity alone because it determines both stimulus energy and mechanical capture in a pacing-dependent patient", "Call for help, restore capture, check connections, and prepare alternate pacing", "Wait for electrolyte correction before providing any temporary rate support"], answer: 2,
      debrief: "Capture failure in a dependent patient is time-critical. Stabilize first: external/rescue pacing readiness, connections and generator, sufficient output, alternate epicardial wire, correction of potassium/magnesium and urgent transvenous pacing if reliable capture cannot be secured. Sensitivity governs sensing, not stimulus strength."
    },
    {
      id: "cautery-oversensing", label: "Electrocautery oversensing", level: "Crisis", procedure: "Return to OR · re-exploration",
      context: "A pacemaker-dependent patient has demand pacing inhibited whenever monopolar cautery is activated. Continuous expert monitoring is present.",
      intrinsicA: 72, intrinsicV: 22, aAmp: 2.4, vAmp: 7.0, aThreshold: 2.5, vThreshold: 4.0, noise: 9.0, avIntact: false, wireA: true, wireV: true, emi: true,
      goal: { modes: ["DOO"], rate: [80, 100], aOut: [5, 20], vOut: [8, 20], aSense: [0.5, 5], vSense: [1, 10], av: [150, 200] },
      question: "Why is temporary asynchronous pacing considered during cautery?",
      choices: ["Increase sensitivity to detect cautery signals and synchronize pacing to them", "Prevent EMI-related inhibition while monitoring for competitive pacing", "Treat complete heart block permanently by disabling all sensing functions", "Eliminate the need for defibrillation or external rescue pacing during surgery"], answer: 1,
      debrief: "DOO disables sensing so EMI cannot inhibit pacing. It is a temporary, monitored OR strategy—not a default ward mode. Asynchronous stimuli can compete with intrinsic beats and land in the vulnerable period, so return to an appropriate demand mode when interference ends."
    },
    {
      id: "competitive-pacing", label: "Asynchronous competitive pacing", level: "Advanced", procedure: "Post-CABG · stable ICU",
      context: "Cautery is over. Sinus rhythm is now 92/min, but DOO remains at 70/min and pacing spikes fall unpredictably near intrinsic QRS/T waves.",
      intrinsicA: 92, intrinsicV: 92, aAmp: 3.4, vAmp: 9.2, aThreshold: 2.0, vThreshold: 3.0, noise: 0.2, avIntact: true, wireA: true, wireV: true,
      goal: { modes: ["DDD", "VVI", "AAI"], rate: [45, 80], aOut: [4, 20], vOut: [6, 20], aSense: [0.5, 3], vSense: [1, 8], av: [140, 220] },
      question: "What is the correct principle once EMI has stopped?",
      choices: ["Leave DOO active indefinitely even after reliable intrinsic rhythm returns", "Increase DOO to 150 without reassessing hemodynamics, intrinsic rhythm, or competitive pacing risk", "Disable sensitivity while continuing asynchronous pacing throughout recovery", "Return to an appropriate demand mode and verify sensing, capture, and backup rate"], answer: 3,
      debrief: "Asynchronous pacing is no longer justified after EMI ends. A demand mode can inhibit pacing when intrinsic beats are present, reducing competitive stimuli and R-on-T risk. Confirm both sensing and capture after the transition and choose a backup rate consistent with the clinical plan."
    }
  ];

  function optionMarkup(options) {
    return options.map(function (item) { return '<option value="' + item[0] + '">' + item[1] + '</option>'; }).join("");
  }

  function mod(n, d) { return ((n % d) + d) % d; }
  function gauss(x, center, width) { const z = (x - center) / width; return Math.exp(-0.5 * z * z); }

  const canvasSizes=new WeakMap();
  function sizeCanvas(canvas){
    let box=canvasSizes.get(canvas);
    if(!box){box={dirty:true};canvasSizes.set(canvas,box);const invalidate=()=>{box.dirty=true;};if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(invalidate);observer.observe(canvas);window.CSLab.onCleanup?.(()=>observer.disconnect());}else{window.addEventListener?.('resize',invalidate);window.CSLab.onCleanup?.(()=>window.removeEventListener?.('resize',invalidate));}}
    const ratio=Math.min(window.devicePixelRatio||1,2);
    if(box.dirty||box.ratio!==ratio){const rect=canvas.getBoundingClientRect();box.width=Math.max(100,Math.round(rect.width));box.height=Math.max(150,Math.round(rect.height));box.ratio=ratio;box.g=canvas.getContext('2d');if(canvas.width!==Math.round(box.width*ratio)||canvas.height!==Math.round(box.height*ratio)){canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);}box.g.setTransform(ratio,0,0,ratio,0,0);box.dirty=false;}
    return box;
  }
  function drawMonitorGrid(g, width, height, paper, pixelsPerMm) {
    g.fillStyle = paper ? "#fffafb" : "#06120f"; g.fillRect(0, 0, width, height);
    const small = Math.max(paper ? 1 : 4, pixelsPerMm || (paper ? 4 : 5));
    g.lineWidth = 1;
    for (let line = 0, x = 0; x <= width; line += 1, x = line * small) {
      g.strokeStyle = paper ? (line % 5 === 0 ? "rgba(214,54,95,.24)" : "rgba(214,54,95,.09)") : (line % 5 === 0 ? "rgba(52,211,153,.10)" : "rgba(52,211,153,.045)");
      g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, height); g.stroke();
    }
    for (let line = 0, y = 0; y <= height; line += 1, y = line * small) {
      g.strokeStyle = paper ? (line % 5 === 0 ? "rgba(214,54,95,.24)" : "rgba(214,54,95,.09)") : (line % 5 === 0 ? "rgba(52,211,153,.10)" : "rgba(52,211,153,.045)");
      g.beginPath(); g.moveTo(0, y + .5); g.lineTo(width, y + .5); g.stroke();
    }
  }
  function drawPacingMarkers(g, ecg, lead, cache, start, end, left, baseline, scale, color) {
    g.save(); g.strokeStyle = color; g.lineWidth = 1;
    const amplitude = ECG.stimulusAmplitude(lead);
    cache.spikes.forEach(function (event) {
      if (event.time < start || event.time > end) return;
      const x = left + (event.time - start) * scale.pixelsPerSecond;
      g.beginPath(); g.moveTo(x, baseline); g.lineTo(x, baseline - amplitude * scale.pixelsPerMv); g.stroke();
    });
    g.restore();
  }
  function drawLiveECG(canvas, ecg, lead, elapsed, speed, gain) {
    const box = sizeCanvas(canvas); const g = box.g; const w = box.width; const h = box.height;
    const scale = ECG.paperScale(speed, gain * 10, 5);
    drawMonitorGrid(g, w, h, false, scale.pixelsPerMm);
    const seconds = w / scale.pixelsPerSecond;
    const start = elapsed - seconds;
    const cache = ECG.events(ecg, start - 0.8, elapsed + 0.8);
    const center = h * .58;
    g.strokeStyle = "#55f7ae"; g.shadowColor = "rgba(85,247,174,.62)"; g.shadowBlur = 6; g.lineWidth = 2.2; g.lineJoin = "round";
    g.beginPath();
    for (let t = start; t <= elapsed; t += 0.004) {
      const x = (t - start) * scale.pixelsPerSecond;
      const y = center - ECG.sample(ecg, lead, t, cache) * scale.pixelsPerMv;
      if (t === start) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke(); g.shadowBlur = 0;
    drawPacingMarkers(g, ecg, lead, cache, start, elapsed, 0, center, scale, "#f8c96b");
    g.strokeStyle = "rgba(190,255,226,.8)"; g.lineWidth = 1; g.beginPath(); g.moveTo(w - 1, 0); g.lineTo(w - 1, h); g.stroke();
    g.fillStyle = "#65ffc0"; g.font = "800 15px system-ui"; g.fillText(lead, 14, 24);
    g.fillStyle = "#7aa496"; g.font = "700 10px system-ui"; g.fillText(speed + " mm/s · " + (gain * 10) + " mm/mV", 14, 41);
  }
  function drawTwelveLead(canvas, ecg, speed, gain, captureStart) {
    const box = sizeCanvas(canvas); const g = box.g; const w = box.width; const h = box.height;
    const marginMm = 14, traceMm = 250, pxPerMm = w / (traceMm + marginMm);
    const scale = ECG.paperScale(speed, gain * 10, pxPerMm);
    const traceLeft = marginMm * pxPerMm, traceWidth = traceMm * pxPerMm;
    const cellW = traceWidth / 4, cellH = h / 4;
    const totalSeconds = traceMm / speed, cellSeconds = totalSeconds / 4;
    const started = Number.isFinite(captureStart) ? captureStart : 0;
    const cache = ECG.events(ecg, started - 0.8, started + totalSeconds + 0.8);
    drawMonitorGrid(g, w, h, true, pxPerMm);

    ECG.STANDARD_LAYOUT.forEach(function (leadRow, row) {
      leadRow.forEach(function (lead, col) {
        const left = traceLeft + col * cellW;
        const top = row * cellH;
        const mid = top + cellH * .55;
        const segmentStart = started + col * cellSeconds;
        g.save(); g.beginPath(); g.rect(left, top, cellW, cellH); g.clip();
        g.strokeStyle = "#18232b"; g.lineWidth = 1.35; g.lineJoin = "round"; g.beginPath();
        const segmentEnd = segmentStart + cellSeconds;
        for (let t = segmentStart; t <= segmentEnd; t += 0.002) {
          const x = (t - segmentStart) * scale.pixelsPerSecond;
          const y = mid - ECG.sample(ecg, lead, t, cache) * scale.pixelsPerMv;
          if (t === segmentStart) g.moveTo(left + x, y); else g.lineTo(left + x, y);
        }
        g.stroke();
        drawPacingMarkers(g, ecg, lead, cache, segmentStart, segmentEnd, left, mid, scale, "#18232b");
        g.restore();
        g.fillStyle = "#c72553"; g.font = "800 11px system-ui"; g.fillText(lead, left + 5, top + 15);
      });
    });

    const rhythmTop = cellH * 3, rhythmMid = rhythmTop + cellH * .56;
    g.save(); g.beginPath(); g.rect(traceLeft, rhythmTop, traceWidth, cellH); g.clip();
    g.strokeStyle = "#18232b"; g.lineWidth = 1.35; g.lineJoin = "round"; g.beginPath();
    for (let t = started; t <= started + totalSeconds; t += 0.002) {
      const x = (t - started) * scale.pixelsPerSecond;
      const y = rhythmMid - ECG.sample(ecg, "II", t, cache) * scale.pixelsPerMv;
      if (t === started) g.moveTo(traceLeft + x, y); else g.lineTo(traceLeft + x, y);
    }
    g.stroke();
    drawPacingMarkers(g, ecg, "II", cache, started, started + totalSeconds, traceLeft, rhythmMid, scale, "#18232b");
    g.restore();
    g.fillStyle = "#c72553"; g.font = "800 11px system-ui"; g.fillText("II", traceLeft + 5, rhythmTop + 15);

    const calX = pxPerMm * 1.2, calWidth = speed * 0.2 * pxPerMm;
    const calBase = rhythmMid, calHeight = gain * 10 * pxPerMm;
    g.strokeStyle = "#18232b"; g.lineWidth = 1.35; g.beginPath();
    g.moveTo(calX, calBase); g.lineTo(calX + pxPerMm, calBase); g.lineTo(calX + pxPerMm, calBase - calHeight);
    g.lineTo(calX + pxPerMm + calWidth, calBase - calHeight); g.lineTo(calX + pxPerMm + calWidth, calBase);
    g.lineTo(traceLeft - pxPerMm, calBase); g.stroke();
    g.fillStyle = "#6b4350"; g.font = "9px system-ui"; g.fillText("1 mV", calX, Math.max(rhythmTop + 10, calBase - calHeight - 4));
    g.fillText("Calibrated teaching model · " + speed + " mm/s · " + (gain * 10) + " mm/mV", traceLeft, h - 5);
  }

  function buildPrimer() {
    return '<details class="rhythm-primer"><summary><span>Primer</span> The cardiac-surgery ECG pass</summary>' +
      '<div class="rhythm-primer-grid"><ol class="rhythm-step-list">' +
      '<li><b>Rate:</b> atrial and ventricular; note discrepancy.</li><li><b>Rhythm:</b> regularity, P morphology and P:QRS relationship.</li>' +
      '<li><b>Axis:</b> normal −30° to +90°; identify meaningful shifts.</li><li><b>P/PR:</b> P width/morphology; PR 120–200 ms.</li>' +
      '<li><b>QRS:</b> narrow &lt;120 ms; localize bundle or ventricular origin when broad.</li><li><b>QT/JT:</b> report the correction method; a wide QRS lengthens QT, so interpret JT and context.</li>' +
      '<li><b>ST/T/Q:</b> contiguous leads, reciprocal changes, mimics and baseline comparison.</li><li><b>Post-op context:</b> graft territory, valve/conduction risk, electrolytes and pacing.</li>' +
      '<li><b>Mechanical correlation:</b> ECG capture is not enough—confirm pulse/arterial waveform.</li><li><b>Priority:</b> stability and reversible catastrophe outrank perfect labeling.</li></ol>' +
      '<div class="rhythm-territory-map" aria-label="Coronary territory quick map"><b>Territory map</b><span><i>Inferior</i> II, III, aVF · usually RCA</span><span><i>Anterior</i> V1–V4 · LAD</span><span><i>Lateral</i> I, aVL, V5–V6 · LCx/diagonal</span><span><i>Posterior</i> dominant R + ST depression V1–V3; confirm V7–V9</span><span><i>RV</i> inferior pattern with RV clues; confirm V3R–V4R</span><p>New LBBB after AVR/TAVI is a conduction warning. A ventricular-paced or LBBB pattern limits routine ST interpretation.</p></div></div></details>';
  }

  function ecgCaseButtons(active, scores) {
    return ECG_CASES.map(function (c, i) {
      const done = scores[c.id] != null ? '<span aria-label="scored">' + scores[c.id] + '/6</span>' : '<span>new</span>';
      return '<button type="button" class="rhythm-case-button' + (i === active ? " is-active" : "") + '" data-ecg-case="' + i + '" aria-pressed="' + (i === active) + '"><b>' + (i + 1) + '. ' + c.label + '</b><small>' + c.level + '</small>' + done + '</button>';
    }).join("");
  }

  function traceAccessibleSummary(c, lead) {
    const details = ["Synthetic " + (lead || "twelve-lead") + " tracing", "ventricular rate about " + c.rate + " per minute"];
    if (c.rhythm === "af") details.push("irregular R-R intervals with no consistent P waves and a fine variable baseline");
    else if (c.rhythm === "complete-block") details.push("regular atrial deflections and slower regular broad ventricular complexes with changing relationships");
    else if (c.rhythm === "vt") details.push("regular repeated monomorphic broad complexes without consistent preceding P waves");
    else if (c.paced && c.captureFailure) details.push("regular stimulus artifacts with alternate artifacts not followed by a ventricular complex; independent atrial deflections continue");
    else if (c.paced) details.push("stimulus artifacts followed by broad ventricular complexes while independent atrial deflections continue");
    else details.push("one P wave before each QRS with a constant configured PR interval");
    details.push("QRS duration " + c.qrs + " milliseconds");
    if (c.lbbb) details.push("predominantly negative V1 and broad notched positive lateral complexes with opposite ST-T direction");
    if (c.territory === "inferior") details.push("J-point elevation in II, III and aVF with reciprocal depression in I and aVL");
    if (c.territory === "anterior") details.push("J-point elevation from V1 through V4 with inferior reciprocal depression");
    if (c.peakedT) details.push("attenuated P waves and diffuse tall narrow-based T waves");
    return details.join("; ") + ".";
  }

  function renderECGLab(ctx) {
    let current = 0;
    const scores = {};
    let liveLead = "II", liveSpeed = 25, liveGain = 1, frozen = false, frozenElapsed = 0, caseStarted = window.CSLab.clock().time, animationFrame = 0;
    let redrawNeeded = true, lastDraw = 0, captureSpec = null, resizeObserver = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = buildPrimer() +
      '<div class="rhythm-lab-layout rhythm-ecg-layout" id="rhythm-ecg-root">' +
        '<aside class="rhythm-case-rail" aria-label="ECG scenarios"><div class="rhythm-section-kicker">10 clinical presets</div><div id="rhythm-ecg-cases">' + ecgCaseButtons(current, scores) + '</div></aside>' +
        '<section class="rhythm-workbench">' +
          '<header class="rhythm-case-head"><div><span class="rhythm-level" id="rhythm-ecg-level"></span><h2 id="rhythm-ecg-name"></h2><p id="rhythm-ecg-context"></p></div><div class="rhythm-vitals" id="rhythm-ecg-vitals"></div></header>' +
          '<div class="rhythm-monitor rhythm-live-station" id="rhythm-live-station"><div class="rhythm-monitor-top"><span><i class="rhythm-live-dot"></i> <b id="rhythm-live-state">LIVE 10-ELECTRODE PREVIEW</b></span><span id="rhythm-ecg-procedure"></span></div>' +
            '<div class="rhythm-monitor-readouts"><div><small>HR</small><strong id="rhythm-live-rate">—</strong><em>bpm</em></div><div><small>Lead</small><strong id="rhythm-live-lead-label">II</strong></div><div><small>Sweep</small><strong id="rhythm-live-speed-label">25</strong><em>mm/s</em></div><div><small>Gain</small><strong id="rhythm-live-gain-label">10</strong><em>mm/mV</em></div><div class="rhythm-monitor-warning">CALIBRATED SYNTHETIC PREVIEW · NOT PATIENT DATA</div></div>' +
            '<div class="rhythm-live-screen"><canvas id="rhythm-live-ecg" class="rhythm-live-canvas" role="img" aria-label="Continuously moving calibrated synthetic ECG preview"></canvas></div>' +
            '<div class="rhythm-monitor-controls"><fieldset><legend>Live lead</legend>' + LEADS.map(function (lead) { return '<button type="button" class="rhythm-lead-button' + (lead === "II" ? ' is-active' : '') + '" data-live-lead="' + lead + '" aria-pressed="' + (lead === "II") + '">' + lead + '</button>'; }).join("") + '</fieldset>' +
              '<label>Paper speed<select id="rhythm-live-speed"><option value="25">25 mm/s</option><option value="50">50 mm/s</option></select></label><label>Gain<select id="rhythm-live-gain"><option value="0.5">5 mm/mV</option><option value="1" selected>10 mm/mV</option><option value="2">20 mm/mV</option></select></label>' +
              '<button type="button" class="btn secondary rhythm-freeze" id="rhythm-live-freeze" aria-pressed="false">Freeze monitor</button><button type="button" class="btn" id="rhythm-capture-12" aria-controls="rhythm-twelve-panel" aria-expanded="false">Capture 12-lead</button></div></div>' +
          '<section class="rhythm-twelve-panel" id="rhythm-twelve-panel" hidden><div class="rhythm-twelve-head"><div><span>CAPTURED DIAGNOSTIC FORMAT</span><h3>Synthetic 12-lead review</h3></div><p>One time-coherent acquisition is displayed in the conventional 3 × 4 sequence with a continuous lead II rhythm strip.</p></div><div class="rhythm-paper-scroll" tabindex="0" role="region" aria-label="Scrollable twelve-lead ECG paper"><canvas id="rhythm-twelve-canvas" class="rhythm-twelve-canvas" role="img" aria-label="Captured calibrated synthetic twelve-lead ECG"></canvas></div><div class="rhythm-paper-key"><span id="rhythm-paper-boxes"></span><span>Calibration pulse: 1 mV</span><span id="rhythm-paper-duration"></span><span id="rhythm-paper-pacing" hidden>Pacing artifact marks show detected timing, not generator output.</span><span id="rhythm-paper-gain-note" hidden>High gain can clip large complexes; use 10 mm/mV to review full amplitude.</span></div></section>' +
          '<section class="rhythm-interpret"><div class="rhythm-section-title"><div><span>Commit before reveal</span><h3>Structured interpretation</h3></div><div class="rhythm-score" id="rhythm-ecg-score" aria-live="polite">0 / 60 points</div></div>' +
            '<div class="rhythm-rate-block"><label for="rhythm-rate-answer"><b>1 · Ventricular rate</b><span>Estimate to the nearest 10 beats/min</span></label><input id="rhythm-rate-answer" type="number" min="20" max="240" step="1" inputmode="numeric" placeholder="bpm"><span>bpm</span></div>' +
            '<div class="rhythm-answer-grid">' +
              '<label><span>2 · Rhythm</span><select id="rhythm-rhythm-answer">' + optionMarkup(ECG_OPTIONS.rhythm) + '</select></label>' +
              '<label><span>3 · Axis</span><select id="rhythm-axis-answer">' + optionMarkup(ECG_OPTIONS.axis) + '</select></label>' +
              '<label><span>4 · Conduction / QRS</span><select id="rhythm-conduction-answer">' + optionMarkup(ECG_OPTIONS.conduction) + '</select></label>' +
              '<label><span>5 · Ischemic territory</span><select id="rhythm-territory-answer">' + optionMarkup(ECG_OPTIONS.territory) + '</select></label>' +
            '</div>' +
            '<label class="rhythm-priority-select"><span>6 · Immediate clinical priority</span><select id="rhythm-priority-answer">' + optionMarkup(ECG_OPTIONS.priority) + '</select></label>' +
            '<div class="rhythm-action-row"><button type="button" class="btn" id="rhythm-check-ecg">Check interpretation</button><button type="button" class="btn secondary" id="rhythm-next-ecg">Next scenario</button><span id="rhythm-ecg-progress">0 of 10 attempted</span></div>' +
          '</section>' +
          '<div id="rhythm-ecg-feedback" class="rhythm-feedback" aria-live="polite"></div>' +
        '</section>' +
      '</div>';
    ctx.main().innerHTML = ctx.frame(ctx.lab, body);

    function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
    function totalScore() { return Object.keys(scores).reduce(function (sum, key) { return sum + scores[key]; }, 0); }
    function renderCase() {
      const c = ECG_CASES[current];
      ctx.publish({"Rate (bpm)":c.rate,"Rhythm":c.rhythm,"QRS (ms)":c.qrs,"PR (ms)":c.pr==null?"Not measurable":c.pr});
      document.getElementById("rhythm-ecg-cases").innerHTML = ecgCaseButtons(current, scores);
      setText("rhythm-ecg-level", c.level);
      setText("rhythm-ecg-name", c.label);
      setText("rhythm-ecg-context", c.context);
      setText("rhythm-ecg-vitals", c.vitals);
      setText("rhythm-ecg-procedure", c.postop);
      caseStarted = window.CSLab.clock().time; frozenElapsed = 0; frozen = false;
      setText("rhythm-live-rate", "—"); setText("rhythm-live-lead-label", liveLead); setText("rhythm-live-state", "LIVE 10-ELECTRODE PREVIEW");
      document.getElementById("rhythm-live-station").classList.remove("is-frozen");
      document.getElementById("rhythm-live-ecg").setAttribute("aria-label", traceAccessibleSummary(c, liveLead));
      const freezeButton = document.getElementById("rhythm-live-freeze"); freezeButton.textContent = "Freeze monitor"; freezeButton.setAttribute("aria-pressed", "false");
      document.getElementById("rhythm-twelve-panel").hidden = true;
      document.getElementById("rhythm-capture-12").setAttribute("aria-expanded", "false");
      captureSpec = null; redrawNeeded = true;
      ["rhythm-rate-answer", "rhythm-rhythm-answer", "rhythm-axis-answer", "rhythm-conduction-answer", "rhythm-territory-answer", "rhythm-priority-answer"].forEach(function (id) { document.getElementById(id).value = ""; });
      document.getElementById("rhythm-ecg-feedback").innerHTML = "";
      setText("rhythm-ecg-score", totalScore() + " / 60 points");
      setText("rhythm-ecg-progress", Object.keys(scores).length + " of 10 attempted");
      bindCaseButtons();
    }
    function bindCaseButtons() {
      document.querySelectorAll("[data-ecg-case]").forEach(function (button) {
        button.addEventListener("click", function () { current = +button.getAttribute("data-ecg-case"); renderCase(); });
      });
    }
    document.getElementById("rhythm-check-ecg").addEventListener("click", function () {
      const c = ECG_CASES[current];
      const enteredRate = +document.getElementById("rhythm-rate-answer").value;
      const results = [
        { name: "Rate", ok: enteredRate > 0 && Math.abs(enteredRate - c.rate) <= 10, expected: c.rate + " bpm" },
        { name: "Rhythm", ok: document.getElementById("rhythm-rhythm-answer").value === c.rhythm, expected: c.description.split(":")[0] },
        { name: "Axis", ok: document.getElementById("rhythm-axis-answer").value === c.axis, expected: c.axis + " axis" },
        { name: "Conduction", ok: document.getElementById("rhythm-conduction-answer").value === c.conduction, expected: c.qrs + " ms QRS" },
        { name: "Territory", ok: document.getElementById("rhythm-territory-answer").value === c.territory, expected: c.territory === "none" ? "no acute territorial pattern" : c.territory },
        { name: "Priority", ok: document.getElementById("rhythm-priority-answer").value === c.priority, expected: (ECG_OPTIONS.priority.find(function (item) { return item[0] === c.priority; }) || ["", c.priority])[1] }
      ];
      const score = results.filter(function (r) { return r.ok; }).length;
      setText("rhythm-live-rate", c.rate);
      scores[c.id] = Math.max(scores[c.id] || 0, score);
      ctx.complete("ecg", totalScore(), ECG_CASES.length * 6);
      const modeledIntervals = ECG.intervals(c);
      const qtcText = c.qtc == null ? "QTc not reported" : (c.rhythm === "af" ? "representative multi-beat QTcF model " : "QTcF model ") + c.qtc + " ms";
      const intervalParts = [c.pr == null ? "PR not fixed" : "PR " + c.pr + " ms", "QRS " + c.qrs + " ms", "modeled QT " + Math.round(modeledIntervals.qt * 1000) + " ms", qtcText];
      if (c.qrs >= 120) intervalParts.push("JT " + Math.round((modeledIntervals.qt - modeledIntervals.qrs) * 1000) + " ms; ordinary QTc interpretation is limited by the wide QRS");
      const interval = intervalParts.join(" · ");
      document.getElementById("rhythm-ecg-feedback").innerHTML =
        '<div class="rhythm-feedback-head ' + (score >= 5 ? "is-good" : "is-review") + '"><div><span>Debrief · ' + score + '/6 interpretation</span><h3>' + ctx.esc(c.description) + '</h3></div><strong>' + (results[5].ok ? "Priority matched" : "Reconsider priority") + '</strong></div>' +
        '<div class="rhythm-result-row">' + results.map(function (r) { return '<span class="' + (r.ok ? "is-correct" : "is-wrong") + '"><b>' + (r.ok ? "✓ " : "→ ") + r.name + '</b><small>' + ctx.esc(r.expected) + '</small></span>'; }).join("") + '</div>' +
        '<div class="rhythm-debrief-grid"><div><b>Intervals</b><p>' + ctx.esc(interval) + '</p><b>Discriminating clues</b><ul>' + c.clues.map(function (x) { return '<li>' + ctx.esc(x) + '</li>'; }).join("") + '</ul></div><div class="rhythm-priority-box"><b>Clinical integration</b><p>' + ctx.esc(c.action) + '</p><span>Educational synthesis—verify current resuscitation, post-TAVI, ischemia and pacing pathways locally.</span></div></div>';
      renderCaseButtonsOnly();
      setText("rhythm-ecg-score", totalScore() + " / 60 points");
      setText("rhythm-ecg-progress", Object.keys(scores).length + " of 10 attempted");
    });
    function renderCaseButtonsOnly() {
      document.getElementById("rhythm-ecg-cases").innerHTML = ecgCaseButtons(current, scores);
      bindCaseButtons();
    }
    document.getElementById("rhythm-next-ecg").addEventListener("click", function () { current = (current + 1) % ECG_CASES.length; renderCase(); });
    document.querySelectorAll("[data-live-lead]").forEach(function (button) {
      button.addEventListener("click", function () {
        liveLead = button.getAttribute("data-live-lead"); setText("rhythm-live-lead-label", liveLead);
        document.getElementById("rhythm-live-ecg").setAttribute("aria-label", traceAccessibleSummary(ECG_CASES[current], liveLead));
        document.querySelectorAll("[data-live-lead]").forEach(function (b) { const on = b === button; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
        redrawNeeded = true;
      });
    });
    document.getElementById("rhythm-live-speed").addEventListener("change", function (event) { liveSpeed = +event.target.value; setText("rhythm-live-speed-label", liveSpeed); redrawNeeded = true; });
    document.getElementById("rhythm-live-gain").addEventListener("change", function (event) { liveGain = +event.target.value; setText("rhythm-live-gain-label", liveGain * 10); redrawNeeded = true; });
    document.getElementById("rhythm-live-freeze").addEventListener("click", function () {
      if (!frozen) frozenElapsed = (window.CSLab.clock().time - caseStarted) / 1000; else caseStarted = window.CSLab.clock().time - frozenElapsed * 1000;
      frozen = !frozen; this.textContent = frozen ? "Resume monitor" : "Freeze monitor"; this.setAttribute("aria-pressed", String(frozen));
      setText("rhythm-live-state", frozen ? "FROZEN REVIEW" : "LIVE 10-ELECTRODE PREVIEW");
      document.getElementById("rhythm-live-station").classList.toggle("is-frozen", frozen);
      redrawNeeded = true;
    });
    function paintCapture() {
      if (!captureSpec) return;
      const canvas = document.getElementById("rhythm-twelve-canvas");
      if (!canvas || !canvas.isConnected) return;
      drawTwelveLead(canvas, captureSpec.ecg, captureSpec.speed, captureSpec.gain, captureSpec.start);
      canvas.setAttribute("aria-label", traceAccessibleSummary(captureSpec.ecg, "twelve-lead"));
    }
    document.getElementById("rhythm-capture-12").addEventListener("click", function () {
      const panel = document.getElementById("rhythm-twelve-panel"); panel.hidden = false;
      const elapsed = frozen ? frozenElapsed : (window.CSLab.clock().time - caseStarted) / 1000;
      const duration = 250 / liveSpeed;
      captureSpec = { ecg: ECG_CASES[current], speed: liveSpeed, gain: liveGain, start: elapsed - duration };
      paintCapture();
      setText("rhythm-paper-boxes", "1 small box = " + Math.round(1000 / liveSpeed) + " ms × " + (1 / (liveGain * 10)).toFixed(2) + " mV");
      setText("rhythm-paper-duration", duration + "-second acquisition · 3 × 4 + long lead II");
      document.getElementById("rhythm-paper-pacing").hidden = !ECG_CASES[current].paced;
      document.getElementById("rhythm-paper-gain-note").hidden = liveGain !== 2;
      this.setAttribute("aria-expanded", "true");
      document.querySelector(".rhythm-paper-scroll").focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    });
    function animate(now) {
      const root = document.getElementById("rhythm-ecg-root");
      if (!root || !root.isConnected) { cancelAnimationFrame(animationFrame); if (resizeObserver) resizeObserver.disconnect(); return; }
      const frameInterval = reducedMotion ? Infinity : 33;
      if (redrawNeeded || (!frozen && now - lastDraw >= frameInterval)) {
        const elapsed = reducedMotion ? 0 : (frozen ? frozenElapsed : (now - caseStarted) / 1000);
        drawLiveECG(document.getElementById("rhythm-live-ecg"), ECG_CASES[current], liveLead, elapsed, liveSpeed, liveGain);
        lastDraw = now; redrawNeeded = false;
      }
      animationFrame = requestAnimationFrame(animate);
    }
    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(function () {
        const root = document.getElementById("rhythm-ecg-root");
        if (!root || !root.isConnected) { resizeObserver.disconnect(); return; }
        redrawNeeded = true; paintCapture();
      });
      resizeObserver.observe(document.querySelector(".rhythm-live-screen"));
      resizeObserver.observe(document.querySelector(".rhythm-paper-scroll"));
    }
    renderCase();
    animationFrame = requestAnimationFrame(animate);
    ctx.cleanup(function () { cancelAnimationFrame(animationFrame); if (resizeObserver) resizeObserver.disconnect(); });
  }

  function pacingPrimer() {
    return '<details class="rhythm-primer"><summary><span>Primer</span> Read the box before touching the knobs</summary>' +
      '<div class="rhythm-primer-grid"><div class="rhythm-mode-table"><b>NBG essentials</b><dl><dt>AAI</dt><dd>Atrial pace/sense, inhibited by sensed A; needs intact AV conduction.</dd><dt>VVI</dt><dd>Ventricular demand backup; no AV synchrony.</dd><dt>DDD</dt><dd>Dual pace/sense; tracks atrium through AV delay and preserves sequence.</dd><dt>DOO</dt><dd>Asynchronous dual pacing; temporary EMI strategy with competitive pacing risk.</dd></dl></div>' +
      '<ol class="rhythm-step-list"><li><b>Identify dependence and instability.</b> Have rescue pacing ready before threshold testing.</li><li><b>Check the patient and pulse,</b> not only monitor spikes.</li><li><b>Inspect connections:</b> atrial/ventricular leads, polarity, cable and generator.</li><li><b>Capture:</b> output must exceed measured threshold; confirm electrical plus mechanical capture.</li><li><b>Sensing:</b> intrinsic signal must exceed the selected mV threshold. Lower mV = more sensitive.</li><li><b>Choose mode:</b> match atrial rhythm, AV conduction and EMI context.</li><li><b>Optimize rate/AV delay</b> against hemodynamics, not a universal number.</li><li><b>Correct causes:</b> ischemia, edema, K/Mg, drugs and wire problems.</li></ol></div></details>';
  }

  function pacingCaseButtons(active, scores) {
    return PACING_CASES.map(function (c, i) {
      const done = scores[c.id] != null ? '<span>' + scores[c.id] + '/6</span>' : '<span>new</span>';
      return '<button type="button" class="rhythm-case-button' + (i === active ? " is-active" : "") + '" data-pacing-case="' + i + '" aria-pressed="' + (i === active) + '"><b>' + (i + 1) + '. ' + c.label + '</b><small>' + c.level + '</small>' + done + '</button>';
    }).join("");
  }

  function pacingState(c, settings) { return window.CSModels.pacing(c, settings); }

  function knobMarkup(id, label, min, max, step, value, unit) {
    return '<label class="rhythm-knob" for="' + id + '"><span><b>' + label + '</b><output id="rhythm-out-' + id.replace("rhythm-pacing-", "") + '">' + value + ' ' + unit + '</output></span><div class="rhythm-knob-face" data-knob-for="' + id + '"><i></i><div class="rhythm-knob-cap"><span></span></div></div><small>' + min + '<em>' + unit + '</em>' + max + '</small><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" aria-label="' + label + ' ' + unit + '"></label>';
  }
  function drawPacingMonitor(canvas, c, s, state, elapsed) {
    const box = sizeCanvas(canvas), g = box.g, w = box.width, h = box.height;
    drawMonitorGrid(g, w, h, false);
    const seconds = 5, start = elapsed - seconds, aY = h * .32, vY = h * .73;
    g.strokeStyle = "rgba(101,255,192,.13)"; g.beginPath(); g.moveTo(0, aY); g.lineTo(w, aY); g.moveTo(0, vY); g.lineTo(w, vY); g.stroke();
    const period=16, end=8+mod(elapsed,period),begin=end-seconds;
    const events=state.events.filter(e=>e.t>=begin-.5&&e.t<=end+.5);
    ['A','V'].forEach(function(chamber){const y0=chamber==='A'?aY:vY;
      g.strokeStyle=chamber==='A'?'#66dcc8':'#ff8a78';g.lineWidth=2;g.beginPath();
      for(let x=0;x<w;x+=1){const t=begin+x/w*seconds;let sample=chamber==='A'&&c.af?.07*Math.sin(t*49)+.04*Math.sin(t*67):0;
        events.forEach(function(e){if(chamber==='A'&&(e.type==='AS'||e.type==='AC'))sample+=.42*gauss(t,e.t+.035,.022);if(chamber==='V'&&(e.type==='VS'||e.type==='VC'))sample+=1.05*gauss(t,e.t+.025,.018)-.42*gauss(t,e.t+.06,.024)+.18*gauss(t,e.t+.25,.06);});
        const y=y0-sample*(chamber==='A'?27:34);if(!x)g.moveTo(x,y);else g.lineTo(x,y);
      }g.stroke();
    });
    events.forEach(function(e){const x=(e.t-begin)/seconds*w;if(e.type==='AP'||e.type==='VP'){const y=e.type==='AP'?aY:vY;g.strokeStyle='#f3c56a';g.beginPath();g.moveTo(x,y+8);g.lineTo(x,y-35);g.stroke();g.fillStyle='#f3c56a';g.font='600 11px Figtree, sans-serif';g.fillText(e.type,x+3,y-25);}if(e.type==='pulse'){g.fillStyle='#7da8ff';g.fillRect(x,h-13,4,5);}});
    if (c.emi) { g.fillStyle = "rgba(255,189,89,.75)"; g.font = "800 11px system-ui"; g.fillText("⚡ EMI / CAUTERY NOISE", w - 142, 20); }
    g.fillStyle = "#6ee7ff"; g.font = "800 12px system-ui"; g.fillText("A", 10, aY - 12); g.fillStyle = "#55f7ae"; g.fillText("V", 10, vY - 12);
  }

  function within(value, pair) { return value >= pair[0] && value <= pair[1]; }

  function renderPacingLab(ctx) {
    let current = 0;
    const scores = {};
    let animationFrame = 0;
    let latestState = null;
    let latestSettings = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pacingStarted = window.CSLab.clock().time;
    const body = pacingPrimer() +
      '<div class="rhythm-lab-layout" id="rhythm-pacing-root">' +
        '<aside class="rhythm-case-rail" aria-label="Pacing scenarios"><div class="rhythm-section-kicker">8 console presets</div><div id="rhythm-pacing-cases">' + pacingCaseButtons(current, scores) + '</div></aside>' +
        '<section class="rhythm-workbench"><header class="rhythm-case-head"><div><span class="rhythm-level" id="rhythm-pacing-level"></span><h2 id="rhythm-pacing-name"></h2><p id="rhythm-pacing-context"></p></div><div class="rhythm-vitals" id="rhythm-pacing-procedure"></div></header>' +
          '<div class="rhythm-console" aria-label="Temporary epicardial pacing console educational model">' +
            '<div class="rhythm-console-brand"><div><span>EPICARDIAL TRAINER</span><b>Dual-channel temporary pacing</b></div><div class="rhythm-console-status" id="rhythm-console-status" aria-live="polite"></div></div>' +
            '<div class="rhythm-console-screen"><canvas id="rhythm-pacing-wave" class="rhythm-pacing-canvas" role="img" aria-label="Moving atrial and ventricular pacing event monitor"></canvas><div class="rhythm-screen-readouts"><span><small>Mode</small><b id="rhythm-screen-mode">DDD</b></span><span><small>Rate</small><b id="rhythm-screen-rate">80</b></span><span><small>A signal</small><b id="rhythm-screen-a">—</b></span><span><small>V signal</small><b id="rhythm-screen-v">—</b></span></div></div>' +
            '<div class="rhythm-console-controls">' +
              '<label class="rhythm-console-select"><span>Mode</span><select id="rhythm-pacing-mode"><option>AAI</option><option>VVI</option><option selected>DDD</option><option>DOO</option></select></label>' +
              knobMarkup("rhythm-pacing-rate", "Rate", 40, 120, 1, 80, "bpm") +
              knobMarkup("rhythm-pacing-aout", "A output", 0, 20, .5, 6, "mA") +
              knobMarkup("rhythm-pacing-vout", "V output", 0, 20, .5, 8, "mA") +
              knobMarkup("rhythm-pacing-asense", "A sensitivity", .5, 10, .5, 1, "mV") +
              knobMarkup("rhythm-pacing-vsense", "V sensitivity", 1, 20, .5, 2, "mV") +
              knobMarkup("rhythm-pacing-av", "AV delay", 80, 300, 10, 170, "ms") +
            '</div><div class="rhythm-sensitivity-rule"><b>Remember:</b> lower mV setting = more sensitive. Output (mA) controls stimulus strength; sensitivity (mV) controls what the box detects.</div>' +
          '</div>' +
          '<div class="rhythm-threshold-board"><div><span>Atrial intrinsic signal</span><b id="rhythm-a-signal"></b></div><div><span>Atrial capture threshold</span><b id="rhythm-a-threshold"></b></div><div><span>Ventricular intrinsic signal</span><b id="rhythm-v-signal"></b></div><div><span>Ventricular capture threshold</span><b id="rhythm-v-threshold"></b></div></div>' +
          '<section class="rhythm-challenge"><div class="rhythm-section-title"><div><span>Test the setup</span><h3 id="rhythm-pacing-question"></h3></div><div class="rhythm-score" id="rhythm-pacing-score" aria-live="polite">0 / 48 points</div></div><fieldset id="rhythm-pacing-choices" class="rhythm-choice-list"><legend class="sr-only">Choose the safest pacing action</legend></fieldset><div class="rhythm-action-row"><button type="button" class="btn" id="rhythm-test-pacing">Analyze settings</button><button type="button" class="btn secondary" id="rhythm-next-pacing">Next scenario</button><span id="rhythm-pacing-progress">0 of 8 attempted</span></div></section>' +
          '<div id="rhythm-pacing-feedback" class="rhythm-feedback" aria-live="polite"></div>' +
        '</section>' +
      '</div>';
    ctx.main().innerHTML = ctx.frame(ctx.lab, body);

    const ids = { mode: "rhythm-pacing-mode", rate: "rhythm-pacing-rate", aOut: "rhythm-pacing-aout", vOut: "rhythm-pacing-vout", aSense: "rhythm-pacing-asense", vSense: "rhythm-pacing-vsense", av: "rhythm-pacing-av" };
    function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
    function settings() { return { mode: document.getElementById(ids.mode).value, rate: +document.getElementById(ids.rate).value, aOut: +document.getElementById(ids.aOut).value, vOut: +document.getElementById(ids.vOut).value, aSense: +document.getElementById(ids.aSense).value, vSense: +document.getElementById(ids.vSense).value, av: +document.getElementById(ids.av).value }; }
    function totalScore() { return Object.keys(scores).reduce(function (sum, key) { return sum + scores[key]; }, 0); }
    function updateConsole() {
      const c = PACING_CASES[current];
      const s = settings();
      const state = pacingState(c, s);
      setText("rhythm-out-rate", s.rate + " bpm"); setText("rhythm-out-aout", s.aOut.toFixed(1) + " mA"); setText("rhythm-out-vout", s.vOut.toFixed(1) + " mA");
      setText("rhythm-out-asense", s.aSense.toFixed(1) + " mV"); setText("rhythm-out-vsense", s.vSense.toFixed(1) + " mV"); setText("rhythm-out-av", s.av + " ms");
      setText("rhythm-screen-mode", s.mode); setText("rhythm-screen-rate", Math.round(state.rate));
      setText("rhythm-screen-a", state.oversenseA ? "NOISE" : (state.aSense ? "SENSE" : "MISS")); setText("rhythm-screen-v", state.oversenseV ? "NOISE" : (state.vSense ? "SENSE" : "MISS"));
      const status = document.getElementById("rhythm-console-status"); status.textContent = state.status; status.className = "rhythm-console-status is-" + state.tone;
      latestState = state; latestSettings = s;
      ctx.publish({"Ventricular rate (bpm)":state.rate,"AV delay (ms)":s.av,"A output (mA)":s.aOut,"V output (mA)":s.vOut,"Status":state.status});
      if (true) drawPacingMonitor(document.getElementById("rhythm-pacing-wave"), c, s, state, 0);
      Object.keys(ids).forEach(function (key) {
        if (key === "mode") return;
        const input = document.getElementById(ids[key]); const face = document.querySelector('[data-knob-for="' + ids[key] + '"] .rhythm-knob-cap');
        const fraction = (+input.value - +input.min) / (+input.max - +input.min);
        if (face) face.style.transform = "rotate(" + (-135 + fraction * 270) + "deg)";
      });
    }
    function bindCaseButtons() {
      document.querySelectorAll("[data-pacing-case]").forEach(function (button) { button.addEventListener("click", function () { current = +button.getAttribute("data-pacing-case"); renderCase(); }); });
    }
    function renderCase() {
      const c = PACING_CASES[current];
      document.getElementById("rhythm-pacing-cases").innerHTML = pacingCaseButtons(current, scores); bindCaseButtons();
      setText("rhythm-pacing-level", c.level); setText("rhythm-pacing-name", c.label); setText("rhythm-pacing-context", c.context); setText("rhythm-pacing-procedure", c.procedure);
      setText("rhythm-a-signal", c.aAmp.toFixed(1) + " mV"); setText("rhythm-a-threshold", c.aThreshold.toFixed(1) + " mA"); setText("rhythm-v-signal", c.vAmp.toFixed(1) + " mV"); setText("rhythm-v-threshold", c.vThreshold.toFixed(1) + " mA");
      setText("rhythm-pacing-question", c.question);
      document.getElementById("rhythm-pacing-choices").innerHTML = c.choices.map(function (choice, i) { return '<label class="rhythm-choice"><input type="radio" name="rhythm-pacing-choice" value="' + i + '"><span><b>' + String.fromCharCode(65 + i) + '</b>' + ctx.esc(choice) + '</span></label>'; }).join("");
      document.getElementById("rhythm-pacing-feedback").innerHTML = "";
      setText("rhythm-pacing-score", totalScore() + " / 48 points"); setText("rhythm-pacing-progress", Object.keys(scores).length + " of 8 attempted");
      updateConsole();
    }
    Object.keys(ids).forEach(function (key) { document.getElementById(ids[key]).addEventListener(key === "mode" ? "change" : "input", updateConsole); });
    document.querySelectorAll(".rhythm-knob input").forEach(function (input) {
      input.addEventListener("wheel", function (event) { event.preventDefault(); const step = +input.step || 1; const next = +input.value + (event.deltaY < 0 ? step : -step); input.value = Math.max(+input.min, Math.min(+input.max, next)); input.dispatchEvent(new Event("input", { bubbles: true })); }, { passive: false });
    });
    document.getElementById("rhythm-test-pacing").addEventListener("click", function () {
      const c = PACING_CASES[current]; const s = settings(); const state = pacingState(c, s); const picked = document.querySelector('input[name="rhythm-pacing-choice"]:checked');
      const checks = [
        { label: "Mode", ok: c.goal.modes.indexOf(s.mode) !== -1, detail: c.goal.modes.join(" or ") },
        { label: "Rate", ok: within(s.rate, c.goal.rate), detail: c.goal.rate[0] + "–" + c.goal.rate[1] + " bpm" },
        { label: "Output / capture", ok: (!state.aPaced || state.aCapture) && (!state.vPaced || state.vCapture) && (!state.vPaced || s.vOut >= c.vThreshold * 2 || c.id === "competitive-pacing"), detail: "capture with an appropriate safety margin" },
        { label: "Sensing", ok: (s.mode === "DOO") || ((!state.oversenseA || s.mode === "VVI") && !state.oversenseV && (state.vSense || s.mode === "AAI")), detail: "detect intrinsic signal without noise inhibition" },
        { label: "AV delay", ok: s.mode !== "DDD" || within(s.av, c.goal.av), detail: c.goal.av[0] + "–" + c.goal.av[1] + " ms starting range" },
        { label: "Clinical action", ok: !!picked && +picked.value === c.answer, detail: "match the safe troubleshooting priority" }
      ];
      const score = checks.filter(function (x) { return x.ok; }).length;
      scores[c.id] = Math.max(scores[c.id] || 0, score);
      ctx.complete("pacing", totalScore(), PACING_CASES.length * 6);
      const warnings = [];
      if (state.vPaced && !state.vCapture) warnings.push("Ventricular stimulus does not capture at this output.");
      if (state.oversenseA || state.oversenseV) warnings.push("Noise exceeds the selected sensing threshold and may inhibit demand pacing.");
      if (s.mode === "DOO" && c.intrinsicV > s.rate) warnings.push("Asynchronous stimuli compete with intrinsic ventricular activity.");
      if (!warnings.length) warnings.push("The event display is internally coherent; now judge whether the mode matches the patient.");
      document.getElementById("rhythm-pacing-feedback").innerHTML =
        '<div class="rhythm-feedback-head ' + (score >= 5 ? "is-good" : "is-review") + '"><div><span>Console debrief · ' + score + '/6</span><h3>' + ctx.esc(state.status) + '</h3></div><strong>' + (score >= 5 ? "Safe setup concept" : "Revise the setup") + '</strong></div>' +
        '<div class="rhythm-result-row">' + checks.map(function (x) { return '<span class="' + (x.ok ? "is-correct" : "is-wrong") + '"><b>' + (x.ok ? "✓ " : "→ ") + x.label + '</b><small>' + ctx.esc(x.detail) + '</small></span>'; }).join("") + '</div>' +
        '<div class="rhythm-debrief-grid"><div><b>What the model sees</b><ul>' + warnings.map(function (x) { return '<li>' + ctx.esc(x) + '</li>'; }).join("") + '</ul><p><b>Thresholds:</b> A ' + c.aThreshold.toFixed(1) + ' mA / V ' + c.vThreshold.toFixed(1) + ' mA. <b>Signals:</b> A ' + c.aAmp.toFixed(1) + ' mV / V ' + c.vAmp.toFixed(1) + ' mV.</p></div><div class="rhythm-priority-box"><b>Clinical reasoning</b><p>' + ctx.esc(c.debrief) + '</p><span>Exact threshold method, safety margin, wire checks and escalation follow the current local protocol and specific generator manual under supervision.</span></div></div>';
      document.getElementById("rhythm-pacing-cases").innerHTML = pacingCaseButtons(current, scores); bindCaseButtons();
      setText("rhythm-pacing-score", totalScore() + " / 48 points"); setText("rhythm-pacing-progress", Object.keys(scores).length + " of 8 attempted");
    });
    document.getElementById("rhythm-next-pacing").addEventListener("click", function () { current = (current + 1) % PACING_CASES.length; renderCase(); });
    function animate(now) {
      const root = document.getElementById("rhythm-pacing-root");
      if (!root || !root.isConnected) { cancelAnimationFrame(animationFrame); return; }
      if (latestState && latestSettings) drawPacingMonitor(document.getElementById("rhythm-pacing-wave"), PACING_CASES[current], latestSettings, latestState, (now - pacingStarted) / 1000);
      animationFrame = requestAnimationFrame(animate);
    }
    renderCase();
    animationFrame = requestAnimationFrame(animate);
    ctx.cleanup(function () { if (animationFrame) cancelAnimationFrame(animationFrame); });
  }

  window.CSECGRenderer = Object.freeze({ drawLiveECG: drawLiveECG, drawTwelveLead: drawTwelveLead });

  window.CSLab.register({
    id: "ecg", code: "ECG", category: "Rhythm & ischemia", minutes: 35,
    title: "ECG Interpretation & Postoperative Rhythm Lab",
    subtitle: "Read synthetic 12-lead tracings systematically, localize postoperative threats, recognize pacing clues and commit to the next clinical priority.",
    objectives: [
      "Apply a fixed rate–rhythm–axis–interval–ST/T/Q sequence to every tracing.",
      "Localize inferior and anterior injury patterns, apply the lateral territory map, and recognize when posterior or right-sided leads are required.",
      "Recognize POAF, complete AV block, monomorphic VT, new LBBB and metabolic conduction change in postoperative context.",
      "Distinguish pacing capture from failure to capture and pair electrical events with mechanical output.",
      "Escalate unstable rhythms and new graft-territory ischemia without overclaiming what an ECG alone proves."
    ],
    sourceSections: ["AHA/ACCF/HRS ECG standardization Parts I, III, IV and VI", "ACC/AHA standard 25 mm/s and 10 mm/mV display", "PhysioNet ECGSYN timing model", "Cardiac Surgery Guide v3 §4.1 and §12.1–12.6"],
    primer: "Ten-step systematic ECG pass with coronary territory and postoperative correlation.", presets: ECG_CASES,
    teach: {
      concept: "A postoperative ECG is safest read the same way every time: rate, rhythm, axis, intervals, then ST/T/Q against a baseline. In cardiac surgery each finding maps to a threat — a new territorial ST change to a graft or coronary problem, a new broad QRS after a valve to conduction injury, pacing artefacts to a capture question, diffuse peaked T waves to a metabolic emergency. The tracing narrows the problem; the pulse, echo and clinical context decide the action.",
      how: "Read the live monitor, capture a 12-lead, then commit rate, rhythm, axis, conduction, ischaemic territory and the immediate priority for each of the ten scenarios. Check your interpretation to reveal the intervals, discriminating clues and clinical integration, and use the level tags to climb from foundation to crisis cases.",
      equations: ["Normal axis: −30° to +90°", "PR 120–200 ms · QRS < 120 ms", "Inferior II/III/aVF · Anterior V1–V4 · Lateral I/aVL/V5–6"]
    },
    render: renderECGLab
  });

  window.CSLab.register({
    id: "pacing", code: "PACE", category: "Conduction & devices", minutes: 40,
    title: "Temporary Epicardial Pacing Console Lab",
    subtitle: "Operate a dual-channel educational console, expose sensing and capture faults, preserve AV synchrony and rehearse safe escalation when pacing becomes unreliable.",
    objectives: [
      "Decode AAI, VVI, DDD and DOO using paced, sensed and response chambers.",
      "Set rate, atrial/ventricular output, sensitivity and AV delay from measured signals and thresholds.",
      "Explain why a lower mV sensitivity setting detects smaller signals and why output controls capture rather than sensing.",
      "Recognize undersensing, oversensing, noncapture, pacemaker syndrome and asynchronous competitive pacing.",
      "Use a patient-first troubleshooting sequence with immediate rescue pacing when the patient is dependent."
    ],
    sourceSections: ["Cardiac Surgery Guide v3 §12.2 (epicardial wires)", "§12.3 (NBG modes/programming)", "§12.4 (complete heart block)", "Module 12 Exercises 12.1–12.2", "Module 14 §14.5 and pacing-wire troubleshooting Q10"],
    primer: "NBG modes, output-versus-sensitivity, threshold checks and safe troubleshooting sequence.", presets: PACING_CASES,
    teach: {
      concept: "A temporary epicardial generator does three separable jobs — set a rate, capture (output in mA must exceed the threshold), and sense (the box only reacts to signals larger than its mV setting, and a lower mV number is more sensitive). The mode — AAI, VVI, DDD, DOO — must match the atrial rhythm, AV conduction and any electrical interference. Most 'pacing failures' are really a mismatch between one of these settings and the patient in front of you.",
      how: "For each scenario read the intrinsic signals and thresholds, then program mode, rate, output, sensitivity and AV delay and watch the event monitor show capture, sensing, oversensing or competition. Pick the safest action and analyse the setup — the debrief scores mode, capture margin, sensing and AV delay separately.",
      equations: ["Output (mA) → capture · Sensitivity (mV) → sensing", "Lower mV = more sensitive", "AAI needs intact AV conduction · DDD restores AV synchrony"]
    },
    render: renderPacingLab
  });
})();
