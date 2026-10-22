/* CardiacSchool strategy physiology labs: cannulation and myocardial protection. */
(function () {
  "use strict";
  const requestAnimationFrame = fn => window.CSLab.raf(fn), cancelAnimationFrame = id => window.CSLab.cancelRaf(id);

  if (!window.CSLab) return;

  const CANNULATION_PRESETS = [
    {
      id: "cabg", label: "Routine CABG", operation: "Primary CABG · intact right atrium",
      brief: "A 64-year-old with three-vessel disease has a normal ascending aorta on epiaortic ultrasound and no aortic regurgitation.",
      arterial: ["aorta"], venous: ["two-stage"], vent: ["root", "lv"], plegia: ["root"],
      target: "Direct central drainage and antegrade systemic return create the shortest, most efficient circuit.",
      danger: "Palpate and image the aorta before purse strings; avoid plaque, the innominate origin, and an arterial cannula directed at the arch wall.",
      fault: "The reservoir level falls and the RA collapses when flow increases.",
      faultOptions: ["Mechanical obstruction in the arterial outflow limb of the circuit", "Excessive assisted venous drainage relative to venous return causing RA collapse", "Acute failure of oxygen transfer across the membrane oxygenator"], faultAnswer: 1,
      faultWhy: "A collapsing RA plus falling reservoir level is a venous-return problem. Reduce assisted drainage, restore volume, inspect venous tubing and cannula position, then increase flow only after the reservoir is safe."
    },
    {
      id: "mitral", label: "Open mitral case", operation: "Mitral repair · left atriotomy; RA and septum closed",
      brief: "A 58-year-old with severe degenerative MR requires left atrial exposure through an interatrial-groove atriotomy; the right atrium and septum will remain closed.",
      arterial: ["aorta"], venous: ["two-stage", "bicaval"], vent: ["lv"], plegia: ["root", "combined"],
      target: "Two-stage right-atrial or bicaval drainage is appropriate while the right atrium and septum remain closed; bicaval isolation is added when exposure or field return requires it. An LV vent improves exposure and prevents distension.",
      danger: "Place caval cannulae without injuring the SA-node region at the SVC-RA junction; snug caval tapes only when needed and avoid excessive traction.",
      fault: "With bicaval drainage selected and snares applied for exposure, blood continuously obscures the left atriotomy despite apparently adequate pump flow.",
      faultOptions: ["False-lumen arterial perfusion with systemic malperfusion signals", "Mechanical obstruction at the arterial filter or return cannula", "Incomplete caval isolation or bronchial/Thebesian return"], faultAnswer: 2,
      faultWhy: "Because this version already uses bicaval drainage and snares, check SVC/IVC cannula depth and caval control first. Some bronchial and Thebesian return persists and is managed with field suction, but brisk venous flooding suggests incomplete isolation or malposition. In a standard left atriotomy with the right atrium and septum closed, two-stage drainage can also be appropriate."
    },
    {
      id: "tricuspid", label: "Open right atrium", operation: "Tricuspid repair · right atriotomy",
      brief: "The surgeon must open the right atrium. The patient has normal peripheral vessels and a noncalcified ascending aorta.",
      arterial: ["aorta"], venous: ["bicaval"], vent: ["root"], plegia: ["root", "combined"],
      target: "Separate SVC and IVC drainage plus caval control creates a bloodless right atrium while preserving full systemic venous return.",
      danger: "An SVC cannula placed too high or manipulated aggressively can injure the SA node region; caval tapes can also injure thin atrial/caval tissue.",
      fault: "The SVC line chatters, cerebral venous pressure rises, and the face becomes plethoric.",
      faultOptions: ["SVC cannula obstruction or malposition causing impaired cerebral venous drainage", "An IVC cannula advanced beyond its intended drainage position", "Excess arterial flow without a corresponding drainage limitation"], faultAnswer: 0,
      faultWhy: "Head congestion localizes impaired SVC drainage. Reduce suction, inspect for a kink or side holes against the wall, and reposition under direct/echo guidance."
    },
    {
      id: "redo", label: "Hostile redo", operation: "Redo sternotomy · patent LIMA at risk",
      brief: "CT shows the RV and a patent LIMA immediately behind the sternum. Safe central access cannot be assumed before re-entry.",
      arterial: ["axillary", "femoral"], venous: ["femoral"], vent: ["root", "none"], plegia: ["root", "ostial"],
      target: "Peripheral access permits controlled decompression or rapid institution of bypass before dangerous re-entry; final site selection follows CT and vascular imaging.",
      danger: "Axillary access risks brachial plexus injury and limb hyperperfusion; femoral retrograde flow risks embolization and limb ischemia. Do not injure a patent LIMA during cooling or dissection.",
      fault: "Venous return is inadequate after femoral venous cannulation; TEE shows the cannula tip below the RA.",
      faultOptions: ["Increase arterial pump speed to overcome access-limited venous return", "Advance or reposition the venous cannula under TEE guidance", "Clamp the venous line until the reservoir level stabilizes"], faultAnswer: 1,
      faultWhy: "Long femoral venous cannulae must reach the RA/SVC region with unobstructed side holes. Pumping harder does not correct access-limited drainage and can empty the reservoir."
    },
    {
      id: "type-a", label: "Type A dissection", operation: "Acute Type A · arch involvement",
      brief: "CTA shows an ascending tear, compressed true lumen, and dynamic innominate malperfusion. The ascending aorta is unsafe for routine cannulation.",
      arterial: ["axillary", "true-lumen"], venous: ["two-stage", "femoral"], vent: ["lv"], plegia: ["ostial", "combined"],
      target: "Right axillary inflow supports antegrade systemic/cerebral perfusion; direct true-lumen central cannulation is an expert alternative when imaging and exposure permit.",
      danger: "Confirm true-lumen perfusion with TEE, pressure symmetry, NIRS and operative inspection. False-lumen flow can worsen cerebral, visceral, coronary, or limb malperfusion.",
      fault: "Immediately after initiating flow, right radial pressure and bilateral NIRS fall while line pressure rises.",
      faultOptions: ["Expected hemodilution during an otherwise uncomplicated transition to full bypass", "An isolated venous air lock without threatened cerebral perfusion", "Malperfusion or cannula obstruction: reduce flow and verify the lumen"], faultAnswer: 2,
      faultWhy: "Treat this as threatened cerebral malperfusion. Reduce/stop flow, announce the problem, verify cannula position and true-lumen expansion with TEE/epiaortic imaging, and change the inflow strategy if necessary."
    },
    {
      id: "arch", label: "Elective arch", operation: "Total arch replacement · circulatory arrest",
      brief: "A 61-year-old has a 6.2-cm arch aneurysm without dissection and needs antegrade cerebral perfusion during lower-body arrest.",
      arterial: ["axillary"], venous: ["two-stage"], vent: ["lv"], plegia: ["combined", "ostial"],
      target: "Axillary inflow naturally supports antegrade cerebral perfusion and keeps the diseased arch free of an initial arterial cannula.",
      danger: "Cerebral protection is a monitored system, not a cannula choice alone: observe NIRS, arterial pressure, temperature and arch-vessel anatomy continuously.",
      fault: "During unilateral antegrade cerebral perfusion, left-sided NIRS falls 25% from baseline.",
      faultOptions: ["Inadequate cross-flow: reassess and add left-sided cerebral perfusion", "Raise unilateral perfusion pressure without reassessing cannula position or head vessels", "Remove the LV vent to redirect systemic flow toward the arch vessels"], faultAnswer: 0,
      faultWhy: "A meaningful unilateral NIRS decline questions circle-of-Willis cross-flow. Verify head position/cannula/pressure, then institute bilateral antegrade cerebral perfusion when correction does not restore oxygenation."
    },
    {
      id: "porcelain", label: "Porcelain aorta", operation: "AVR · severely calcified ascending aorta",
      brief: "Epiaortic imaging shows circumferential ascending aortic calcium with no safe central cannulation or clamp site.",
      arterial: ["axillary", "femoral"], venous: ["two-stage"], vent: ["lv", "root"], plegia: ["ostial", "combined"],
      target: "Move inflow away from the diseased ascending aorta and plan the operation around a no-touch or modified clamping strategy.",
      danger: "Retrograde femoral flow can mobilize aortoiliac plaque; axillary access requires a healthy vessel and meticulous limb/plexus protection.",
      fault: "After femoral inflow begins, cerebral oximetry drops and TEE shows mobile arch debris.",
      faultOptions: ["Accept the signal as an expected consequence of cooling and hemodilution on bypass", "Suspect retrograde atheroembolization and stop or revise inflow", "Increase vacuum drainage until the cerebral oximetry normalizes"], faultAnswer: 1,
      faultWhy: "A new neurologic perfusion signal with visible debris is not benign. Reduce or stop the provoking flow, evaluate cerebral perfusion, and move to an antegrade strategy if feasible."
    },
    {
      id: "mini-mitral", label: "Minimally invasive mitral", operation: "Right mini-thoracotomy mitral repair",
      brief: "Limited access precludes conventional central cannulation. CTA confirms suitable iliofemoral vessels and no important aortic disease.",
      arterial: ["femoral"], venous: ["femoral"], vent: ["lv"], plegia: ["root", "combined"],
      target: "TEE-guided peripheral cannulation provides remote access; vacuum-assisted drainage and a long venous cannula support exposure.",
      danger: "Monitor distal limb perfusion and arterial line pressure. Retrograde dissection, embolization, cannula migration and excessive negative venous pressure are preventable hazards.",
      fault: "The venous line chatters at −70 mmHg and reservoir volume oscillates when the lung is retracted.",
      faultOptions: ["Cardioplegia overdose causing transient global myocardial dysfunction", "Cerebral hyperperfusion from excessive antegrade arterial flow", "Access-limited venous drainage worsened by position"], faultAnswer: 2,
      faultWhy: "Reduce vacuum, return the patient/heart to a neutral position, inspect tubing, confirm cannula tip and side-hole position with TEE, and restore volume before resuming target flow."
    }
  ];

  const CANNULATION_PRIMER = [
    ["Ascending aorta", "Standard antegrade return with low circuit length and direct inspection. Use epiaortic ultrasound to avoid plaque; the tip must not face the wall or obstruct an arch branch."],
    ["Right axillary", "Antegrade flow, useful when the ascending aorta is hostile and for antegrade cerebral perfusion. Requires vessel assessment and surveillance for limb/plexus injury."],
    ["Femoral artery", "Fast peripheral access and useful before redo entry or for minimally invasive work. Flow is retrograde; screen aortoiliac disease and protect the distal limb."],
    ["Direct true lumen", "Selected dissection strategy under direct and imaging confirmation. A wrong lumen is catastrophic; use TEE, pressure, NIRS, visual evidence and organ-perfusion signals."],
    ["Two-stage RA", "One cannula drains caval and atrial blood efficiently when the RA stays closed. Its position and preload determine drainage; excessive suction causes chatter/collapse."],
    ["Bicaval", "Separate SVC and IVC cannulae allow right atrial isolation for tricuspid, intracardiac and some mitral operations. Protect the SA-node region and thin caval tissue."],
    ["Femoral venous", "A long multistage cannula placed to the RA/SVC under TEE enables peripheral CPB. Drainage is position-sensitive and commonly needs carefully bounded assisted drainage."],
    ["Vents & access", "An LV vent prevents distension from bronchial/Thebesian return and AR; a root vent de-airs and decompresses the root. Root, direct ostial, retrograde and graft routes solve different cardioplegia problems."]
  ];

  function option(value, label) { return { value: value, label: label }; }

  function rotary(id, label, min, max, value, step, unit) {
    return '<label class="strategy-rotary" for="' + id + '"><span class="strategy-rotary-label">' + label + '</span><span class="strategy-dial" id="dial-' + id + '" style="--dial-angle:-135deg"><i></i><em></em><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '" step="' + step + '" aria-label="' + label + '"></span><output id="out-' + id + '">' + value + unit + '</output><small>' + min + '—' + max + unit + '</small></label>';
  }

  function syncRotary(id) {
    const input = document.getElementById(id), dial = document.getElementById("dial-" + id);
    if (!input || !dial) return;
    const fraction = (+input.value - +input.min) / (+input.max - +input.min || 1);
    dial.style.setProperty("--dial-angle", (-135 + fraction * 270) + "deg");
    dial.dataset.value = input.value;
  }

  function registerCannulation() {
    window.CSLab.register({
      id: "cannulation",
      code: "STRAT 01",
      category: "Operative strategy",
      minutes: 32,
      title: "Cannulation Strategy & Circuit Configuration",
      subtitle: "Build the bypass interface around the operation, anatomy and failure modes—then defend every cannula, vent and protection route.",
      objectives: [
        "Choose arterial inflow according to aortic pathology, direction of flow, cerebral strategy and access risk.",
        "Match two-stage, bicaval and peripheral venous drainage to the chamber being opened and the exposure required.",
        "Place LV/root vents and cardioplegia access as a coordinated myocardial-protection and de-airing system.",
        "Recognize drainage limitation, malposition, false-lumen perfusion and cerebral or limb malperfusion from coupled signals.",
        "State an immediate safe response before escalating pump flow or assisted drainage."
      ],
      sourceSections: ["Guide §1.6 Venous Drainage and Bypass Cannulation", "Guide §8.2–8.4 Aortic Dissection and Arch Strategy", "Guide §10.1 CPB Circuit", "Guide §10.5 Cardioplegia Delivery"],
      teach: {
        concept: "A cannulation plan is the operation in miniature: it fixes the direction of arterial flow, which chambers can be opened, whether the heart stays decompressed, how the myocardium is protected and which rescue routes remain available. Arterial inflow follows aortic pathology and cerebral strategy; venous drainage follows the chamber you must open; vents and cardioplegia access are a coupled protection-and-de-airing system. Every choice comes with a signal that would prove it is failing.",
        how: "For each operation build the circuit — arterial return, venous drainage, vent and cardioplegia — then commit your prediction before revealing whether it fits. Read the live schematic and the exposure/flow/distension signals, then diagnose the fault that appears under flow. The score rewards both a defensible configuration and correctly localising the fault.",
        equations: ["Aortic disease → inflow choice", "Chamber opened → drainage choice", "Never fix chatter by blindly raising suction"]
      },
      primers: CANNULATION_PRIMER,
      presets: CANNULATION_PRESETS,
      render: function (ui) {
        const state = { index: 0, attempted: {}, correct: {}, predicted: false };
        const body = [
          '<div class="strategy-intro">',
            '<div><span class="strategy-kicker">THE CONFIGURATION IS THE OPERATION</span><h2>Drain → protect → return</h2><p>A cannulation plan is not a shopping list. It establishes the direction of flow, which chambers can be opened, whether the heart stays decompressed, how the myocardium is protected, and which rescue routes remain available.</p></div>',
            '<div class="strategy-rule"><b>Before full flow</b><span>Anticoagulation confirmed</span><span>Lines traced and de-aired</span><span>Tips seen / pressures plausible</span><span>Reservoir has safe volume</span></div>',
          '</div>',
          '<nav class="strategy-presetbar" aria-label="Cannulation scenarios" id="strategy-can-presets"></nav>',
          '<div class="strategy-grid">',
            '<aside class="strategy-console" aria-label="Circuit configuration controls">',
              '<div class="strategy-panel-title"><span>01</span><div><b>Build the circuit</b><small>Choose before revealing the target</small></div></div>',
              ui.select("can-arterial", "Arterial return", [option("aorta", "Ascending aorta"), option("axillary", "Right axillary"), option("femoral", "Femoral artery"), option("true-lumen", "Direct central true lumen")]),
              ui.select("can-venous", "Venous drainage", [option("two-stage", "Two-stage right atrial"), option("bicaval", "Bicaval SVC + IVC"), option("femoral", "Femoral multistage")]),
              ui.select("can-vent", "Decompression / vent", [option("root", "Aortic root vent"), option("lv", "LV vent via RSPV"), option("none", "No vent initially")]),
              ui.select("can-plegia", "Cardioplegia access", [option("root", "Antegrade aortic root"), option("ostial", "Direct coronary ostia"), option("combined", "Antegrade + retrograde")]),
              '<label class="strategy-predict"><input id="can-predict" type="checkbox"><span><b>Prediction committed</b><small>I can state the flow direction, exposure benefit and first danger.</small></span></label>',
              '<button class="btn strategy-primary" id="can-check" type="button">Commit configuration</button>',
              '<div class="strategy-feedback" id="can-feedback" aria-live="polite"><b>Prediction gate</b><p>Read the brief, configure the circuit, and commit your reasoning before feedback appears.</p></div>',
            '</aside>',
            '<section class="strategy-workbench">',
              '<article class="strategy-case" id="can-case"></article>',
              '<div class="strategy-circuit" id="can-circuit" role="img" aria-label="Interactive bypass cannulation schematic"></div>',
              '<div class="strategy-signal-row" id="can-signals"></div>',
            '</section>',
          '</div>',
          '<section class="strategy-fault" id="can-fault"></section>',
          '<details class="strategy-primer"><summary><span>Deep primer</span> Access anatomy, purpose and danger</summary><div class="strategy-primer-grid">',
            CANNULATION_PRIMER.map(function (x) { return '<article><b>' + ui.esc(x[0]) + '</b><p>' + ui.esc(x[1]) + '</p></article>'; }).join(""),
          '</div></details>',
          '<section class="strategy-debrief" id="can-debrief"><div><span class="strategy-kicker">PROGRESS</span><h2>Build a defensible circuit</h2><p>Complete all eight configurations and fault diagnoses. Correctness matters, but the durable skill is identifying what signal would prove your plan is failing.</p></div><div class="strategy-score"><strong id="can-score">0</strong><span>/ 16 decisions</span></div></section>'
        ].join("");
        ui.main().innerHTML = ui.frame(ui.lab, body);

        function selected(id) { const el = document.getElementById(id); return el ? el.value : ""; }
        function isAllowed(actual, accepted) { return accepted.indexOf(actual) !== -1; }
        function scenario() { return CANNULATION_PRESETS[state.index]; }
        function score() { return Object.keys(state.correct).reduce(function (n, key) { return n + (state.correct[key] || 0); }, 0); }

        function drawCircuit() {
          const art = selected("can-arterial"), ven = selected("can-venous"), vent = selected("can-vent"), plegia = selected("can-plegia");
          const model=window.CSModels.cannulation({arterial:art,venous:ven,vent:vent,protection:plegia});
          ui.publish({"Arterial return":model.flowDirection,"Venous drainage":ven,"Caval isolation":model.cavalIsolation?"Available with caval control":"Not isolated","Vent":vent,"Protection route":plegia});
          const artLabel = { aorta: "ASCENDING AORTA", axillary: "RIGHT AXILLARY", femoral: "FEMORAL ARTERY", "true-lumen": "TRUE LUMEN" }[art];
          const venLabel = { "two-stage": "TWO-STAGE RA", bicaval: "SVC + IVC", femoral: "FEMORAL VEIN" }[ven];
          const flowDirection = art === "femoral" ? "RETROGRADE RETURN" : "ANTEGRADE RETURN";
          const ventText = vent === "lv" ? "LV VENT ACTIVE" : vent === "root" ? "ROOT VENT ACTIVE" : "NO VENT";
          const artRoute = art === "axillary" ? "M690 54 C615 54 558 64 475 91" : art === "femoral" ? "M686 328 C650 292 628 175 604 130 C560 83 520 78 475 91" : art === "true-lumen" ? "M518 28 C512 56 500 72 475 91" : "M604 82 C550 75 518 75 475 91";
          const artPort = art === "axillary" ? [690,54] : art === "femoral" ? [686,328] : art === "true-lumen" ? [518,28] : [604,82];
          const artText = art === "axillary" ? [680,36] : art === "femoral" ? [675,349] : art === "true-lumen" ? [530,20] : [605,58];
          const artCircuit = art === "axillary" ? "M589 280 C716 254 744 104 690 54" : art === "femoral" ? "M589 280 C625 300 650 321 686 328" : art === "true-lumen" ? "M589 280 C724 211 662 56 518 28" : "M589 280 C700 255 699 112 604 82";
          const venRoute = ven === "bicaval" ? '<path class="strategy-cannula venous" d="M92 30 C178 32 252 58 326 72"/><path class="strategy-cannula venous" d="M92 214 C184 210 252 185 326 172"/><circle class="strategy-port venous" cx="92" cy="30" r="9"/><circle class="strategy-port venous" cx="92" cy="214" r="9"/>' : ven === "femoral" ? '<path class="strategy-cannula venous" d="M70 328 C124 295 175 223 326 150"/><circle class="strategy-port venous" cx="70" cy="328" r="9"/>' : '<path class="strategy-cannula venous" d="M150 78 C224 80 276 95 326 105"/><circle class="strategy-port venous" cx="150" cy="78" r="9"/>';
          const venCircuit = ven === "bicaval" ? '<path class="strategy-tube venous" d="M92 30 C32 90 62 248 205 282"/><path class="strategy-tube venous" d="M92 214 C91 255 130 277 205 282"/>' : ven === "femoral" ? '<path class="strategy-tube venous" d="M70 328 C110 303 158 288 205 282"/>' : '<path class="strategy-tube venous" d="M150 78 C62 120 70 250 205 282"/>';
          const venText = ven === "bicaval" ? [72,122] : ven === "femoral" ? [60,349] : [70,55];
          const accessoryPath = vent === "lv" ? "M385 126 C392 183 468 191 497 222" : vent === "root" ? "M430 74 C448 135 482 174 497 222" : "";
          ui.html("can-circuit", '<div class="strategy-circuit-head"><span>LIVE SCHEMATIC</span><b>' + flowDirection + '</b></div>' +
            '<svg viewBox="0 0 760 360" aria-hidden="true">' +
              '<defs><linearGradient id="canBlue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#38bdf8"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient><linearGradient id="canRed" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fb7185"/><stop offset="1" stop-color="#be123c"/></linearGradient><filter id="canGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
              venCircuit +
              '<rect class="strategy-reservoir" x="205" y="242" width="110" height="74" rx="18"/><text x="260" y="272">VENOUS</text><text x="260" y="291">RESERVOIR</text>' +
              '<path class="strategy-tube venous" d="M315 280 H368"/><circle class="strategy-oxy" cx="416" cy="280" r="45"/><text x="416" y="276">OXYGENATOR</text><text x="416" y="294">+ HEAT</text>' +
              '<path class="strategy-tube arterial" d="M461 280 H524"/><circle class="strategy-pump" cx="558" cy="280" r="31"/><path class="pump-blade" d="M558 255v50M533 280h50M540 262l36 36M576 262l-36 36"/>' +
              '<path class="strategy-tube arterial" d="' + artCircuit + '"/>' +
              '<path class="strategy-body" d="M286 0 C250 58 246 132 274 219 L314 241 M486 0 C522 58 526 132 498 219 L458 241"/>' +
              '<path class="strategy-heart" d="M386 65c-38-51-109-15-100 43 8 52 100 108 100 108s92-56 100-108c9-58-62-94-100-43z"/>' +
              '<path class="strategy-aorta" d="M406 66c0-39 1-60 37-60 58 0 83 38 83 81v43"/><path class="strategy-cava" d="M326 16v76M326 164v75"/>' +
              '<path class="strategy-cannula arterial" d="' + artRoute + '"/>' + venRoute +
              (accessoryPath ? '<path class="strategy-access" d="' + accessoryPath + '"/><circle class="strategy-port accessory" cx="497" cy="222" r="8"/>' : '') +
              '<circle class="strategy-port arterial" cx="' + artPort[0] + '" cy="' + artPort[1] + '" r="9"/>' +
              '<text class="strategy-svg-label arterial-label" x="' + artText[0] + '" y="' + artText[1] + '">' + ui.esc(artLabel) + '</text><text class="strategy-svg-label venous-label" x="' + venText[0] + '" y="' + venText[1] + '">' + ui.esc(venLabel) + '</text><text class="strategy-svg-label" x="500" y="213">' + ui.esc(ventText) + '</text>' +
            '</svg>' +
            '<div class="strategy-flow-legend"><span class="venous">Systemic venous drainage</span><span class="arterial">Oxygenated arterial return</span><span class="accessory">' + ui.esc(plegia === "combined" ? "Combined protection access" : plegia === "ostial" ? "Direct ostial access" : "Root cardioplegia access") + '</span></div>');
          const drainage = ven === "bicaval" ? "RA can be opened" : ven === "two-stage" ? "RA must remain closed" : "Remote access / position-sensitive";
          const perfusion = art === "axillary" ? "Antegrade + cerebral route" : art === "femoral" ? "Retrograde systemic flow" : art === "true-lumen" ? "Imaging proof mandatory" : "Standard antegrade flow";
          const distension = vent === "lv" ? "Strong LV decompression" : vent === "root" ? "Root de-air / modest decompression" : "Distension risk depends on return + AR";
          ui.html("can-signals", '<div><small>EXPOSURE</small><b>' + drainage + '</b></div><div><small>FLOW</small><b>' + perfusion + '</b></div><div><small>DISTENSION</small><b>' + distension + '</b></div>');
        }

        function drawPresets() {
          ui.html("strategy-can-presets", CANNULATION_PRESETS.map(function (p, i) {
            return '<button type="button" class="strategy-preset ' + (i === state.index ? "active" : "") + ' ' + (state.attempted[p.id] ? "done" : "") + '" data-can-index="' + i + '" aria-pressed="' + (i === state.index) + '"><span>' + (i + 1) + '</span>' + ui.esc(p.label) + '</button>';
          }).join(""));
          document.querySelectorAll("[data-can-index]").forEach(function (btn) {
            btn.addEventListener("click", function () { state.index = +btn.dataset.canIndex; state.predicted = false; renderScenario(); });
          });
        }

        function drawFault(p) {
          ui.html("can-fault", '<div class="strategy-panel-title"><span>02</span><div><b>Troubleshoot under flow</b><small>Localize the fault before touching the pump</small></div></div><div class="strategy-fault-grid"><div class="strategy-alarm"><span>NEW SIGNAL</span><p>' + ui.esc(p.fault) + '</p></div><div class="strategy-answers">' + p.faultOptions.map(function (o, i) { return '<button type="button" data-can-fault="' + i + '">' + ui.esc(o) + '</button>'; }).join("") + '</div></div><div class="strategy-fault-feedback" id="can-fault-feedback" aria-live="polite">Choose the explanation that best localizes the problem.</div>');
          document.querySelectorAll("[data-can-fault]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              const right = +btn.dataset.canFault === p.faultAnswer;
              document.querySelectorAll("[data-can-fault]").forEach(function (b) { b.disabled = true; if (+b.dataset.canFault === p.faultAnswer) b.classList.add("right"); });
              btn.classList.add(right ? "right" : "wrong");
              state.correct[p.id + "-fault"] = right ? 1 : 0;
              ui.html("can-fault-feedback", '<b>' + (right ? "Correct localization." : "Reframe from the coupled signals.") + '</b> ' + ui.esc(p.faultWhy));
              updateProgress();
            });
          });
        }

        function renderScenario() {
          const p = scenario();
          drawPresets();
          ui.html("can-case", '<span class="strategy-kicker">SCENARIO ' + (state.index + 1) + ' / ' + CANNULATION_PRESETS.length + '</span><h2>' + ui.esc(p.operation) + '</h2><p>' + ui.esc(p.brief) + '</p><div class="strategy-prompt"><b>Say it before you build it:</b> Which direction will arterial blood travel? Must a chamber be isolated? How will you prevent distension, and what structure is most at risk?</div>');
          const checkbox = document.getElementById("can-predict"); if (checkbox) checkbox.checked = false;
          state.predicted = false;
          ui.html("can-feedback", '<b>Prediction gate</b><p>Read the brief, configure the circuit, and commit your reasoning before feedback appears.</p>');
          drawCircuit();
          drawFault(p);
        }

        function checkConfig() {
          const p = scenario();
          if (!document.getElementById("can-predict").checked) {
            ui.html("can-feedback", '<b>Commit the prediction first.</b><p>The learning effect comes from exposing your model before seeing the answer. State flow direction, exposure benefit and danger aloud.</p>');
            return;
          }
          const checks = [isAllowed(selected("can-arterial"), p.arterial), isAllowed(selected("can-venous"), p.venous), isAllowed(selected("can-vent"), p.vent), isAllowed(selected("can-plegia"), p.plegia)];
          const n = checks.filter(Boolean).length;
          state.attempted[p.id] = true;
          state.correct[p.id + "-config"] = n === 4 ? 1 : 0;
          ui.html("can-feedback", '<b>' + (n === 4 ? "Defensible configuration." : n + "/4 components fit the operative problem.") + '</b><p>' + ui.esc(p.target) + '</p><div class="strategy-danger"><span>ANATOMY / DANGER</span>' + ui.esc(p.danger) + '</div><div class="strategy-key"><span>Accepted</span><b>Arterial:</b> ' + ui.esc(p.arterial.join(" or ")) + ' · <b>Venous:</b> ' + ui.esc(p.venous.join(" or ")) + ' · <b>Vent:</b> ' + ui.esc(p.vent.join(" or ")) + ' · <b>Protection:</b> ' + ui.esc(p.plegia.join(" or ")) + '</div>');
          drawPresets(); updateProgress();
        }

        function updateProgress() {
          ui.text("can-score", score());
          const attempts = Object.keys(state.attempted).length;
          const faults = Object.keys(state.correct).filter(function (k) { return /-fault$/.test(k); }).length;
          if (attempts === CANNULATION_PRESETS.length && faults === CANNULATION_PRESETS.length) {
            ui.complete("cannulation", score(), 16);
            ui.html("can-debrief", '<div><span class="strategy-kicker">LAB COMPLETE</span><h2>' + (score() >= 13 ? "Circuit judgment is taking shape" : "Now run the misses again") + '</h2><p>The expert sequence is stable: define the operation and chamber exposure, exclude unsafe vessels, choose drainage, create decompression/protection access, then name the signal that would force a change.</p><div class="strategy-takeaways"><span>Never treat chatter by blindly increasing suction.</span><span>Never accept organ malperfusion as a pump-flow problem alone.</span><span>Never separate a cannula choice from imaging and monitoring.</span></div></div><div class="strategy-score"><strong>' + score() + '</strong><span>/ 16 decisions</span></div>');
          }
        }

        ["can-arterial", "can-venous", "can-vent", "can-plegia"].forEach(function (id) { document.getElementById(id).addEventListener("change", drawCircuit); });
        document.getElementById("can-check").addEventListener("click", checkConfig);
        renderScenario();
      }
    });
  }

  const CARDIOPLEGIA_PRESETS = [
    {
      id: "routine-avr", label: "Routine AVR", title: "Severe AS with concentric LVH",
      brief: "A 73-year-old with critical AS has a thick, high-demand LV and unobstructed coronaries. The aorta will be opened after arrest.",
      acceptedRoute: ["antegrade", "combined", "ostial"], acceptedSolution: ["blood", "delnido"], acceptedTemp: ["cold", "tepid"], interval: [20, 30], pressure: [50, 80],
      insight: "The hypertrophied ventricle has greater myocardial mass and shorter diffusion distance reserve. Obtain rapid, complete arrest; monitor myocardial cooling and redose deliberately. Once the aorta is open, direct ostial dosing maintains protection.",
      trap: "Assuming a large LV is protected because the initial electrical arrest looked prompt."
    },
    {
      id: "cabg-cto", label: "CABG + CTO", title: "Multivessel CABG with RCA chronic total occlusion",
      brief: "A 66-year-old has proximal LAD disease and an RCA CTO. Four distal anastomoses will make cross-clamp time long.",
      acceptedRoute: ["combined"], acceptedSolution: ["blood"], acceptedTemp: ["cold", "tepid"], interval: [20, 30], pressure: [40, 80],
      insight: "Antegrade flow may not cross severe stenoses. Combine antegrade arrest with retrograde maintenance, remember retrograde underprotects the RV, and deliver down completed grafts to reach revascularized territories.",
      trap: "Relying on retrograde alone and declaring the RV protected."
    },
    {
      id: "aortic-regurg", label: "Severe AR", title: "Aortic root replacement with severe AR",
      brief: "Severe aortic regurgitation allows root cardioplegia to run into and distend the LV rather than reliably entering both coronaries.",
      acceptedRoute: ["ostial", "retrograde", "combined"], acceptedSolution: ["blood", "delnido"], acceptedTemp: ["cold", "tepid"], interval: [20, 30], pressure: [30, 60],
      insight: "Avoid relying on root antegrade delivery. Vent the LV, arrest with retrograde or direct ostial cardioplegia after opening the aorta, and verify distribution rather than trusting the infused volume.",
      trap: "Increasing root pressure to overcome regurgitant runoff—this worsens LV distension."
    },
    {
      id: "left-main", label: "Left main disease", title: "Critical left main stenosis",
      brief: "A 59-year-old has 90% distal left main disease and unstable ischemia. The LAD and circumflex beds are both threatened distal to one lesion.",
      acceptedRoute: ["combined", "retrograde"], acceptedSolution: ["blood"], acceptedTemp: ["cold", "tepid"], interval: [15, 25], pressure: [40, 70],
      insight: "Root antegrade cardioplegia may preferentially enter the unobstructed RCA and underdeliver to most LV mass. Retrograde coverage plus early graft completion/down-graft dosing makes protection visible and territory-specific.",
      trap: "Equating root pressure with uniform myocardial delivery."
    },
    {
      id: "redo-lima", label: "Patent LIMA redo", title: "Redo AVR with a patent LIMA–LAD",
      brief: "A patent LIMA continues warm blood flow into the LAD territory during cross-clamping and can wash out cardioplegia.",
      acceptedRoute: ["combined", "ostial"], acceptedSolution: ["blood"], acceptedTemp: ["cold", "tepid"], interval: [15, 25], pressure: [40, 70],
      insight: "Plan how to control or account for LIMA flow. Watch regional temperature and electrical activity; combined or direct delivery helps overcome nonuniform washout without injuring the graft.",
      trap: "Interpreting recurrent activity as harmless while one territory is being rewarmed."
    },
    {
      id: "mini", label: "Long minimal access", title: "Minimally invasive complex mitral repair · del Nido-type plan",
      brief: "This case explicitly uses a cold del Nido-type strategy because repeated root access is cumbersome and predicted clamp time is 75 minutes; coronary anatomy is unobstructed.",
      acceptedRoute: ["antegrade", "combined"], acceptedSolution: ["delnido"], acceptedTemp: ["cold"], interval: [45, 60], pressure: [40, 80],
      insight: "This scenario deliberately tests a cold del Nido-type plan: monitor temperature, electrical activity and distribution continuously, and reassess for redosing by 45–60 minutes or earlier if protection signals deteriorate or clamp time extends.",
      trap: "Treating the longer reassessment window as permission to ignore electrical activity, warming, poor distribution or LV distension."
    },
    {
      id: "rv-risk", label: "RV at risk", title: "Proximal RCA occlusion with RV dysfunction",
      brief: "The RV is dilated and moderately dysfunctional. The proximal RCA is occluded and the PDA is supplied by collaterals.",
      acceptedRoute: ["combined"], acceptedSolution: ["blood"], acceptedTemp: ["cold", "tepid"], interval: [15, 25], pressure: [40, 70],
      insight: "Retrograde helps bypass arterial obstruction but incompletely protects the RV because anterior cardiac and Thebesian drainage may bypass the coronary sinus. Add antegrade/down-graft delivery and topical cooling with deliberate RV assessment.",
      trap: "Choosing retrograde-only protection because the RCA is occluded."
    },
    {
      id: "electrical", label: "Activity returns", title: "Electrical activity during a prolonged clamp",
      brief: "At 24 minutes after cold blood cardioplegia, fine ventricular activity returns and the myocardium is warming. Root pressure during the first dose was 35 mmHg.",
      acceptedRoute: ["combined", "antegrade", "retrograde"], acceptedSolution: ["blood"], acceptedTemp: ["cold"], interval: [15, 25], pressure: [40, 80],
      insight: "Electrical activity and warming are protection alarms: delivery may be inadequate or the dose has expired. Redose promptly, confirm line/cannula position and pressure, assess route-specific distribution, and add the complementary route when regional protection is uncertain.",
      trap: "Waiting for visible contraction or a fixed clock interval before responding."
    }
  ];

  const CARDIO_CHALLENGES = [
    { q: "Why does hyperkalemic cardioplegia produce diastolic arrest?", a: 1, o: ["It depletes intracellular potassium and abbreviates mechanical systole", "It depolarizes the membrane near −60 mV and inactivates fast sodium channels", "It permanently blocks calcium release from the sarcoplasmic reticulum during reperfusion"], why: "Elevated extracellular K+ depolarizes the resting membrane from about −90 toward −60 mV. Fast Na+ channels remain inactivated, propagation stops, and the myocardium rests with minimal crossbridge ATP consumption." },
    { q: "Retrograde cardioplegia is flowing well, but which territory still deserves special concern?", a: 2, o: ["The left atrial appendage because it drains outside the coronary sinus", "The anterior LV because LAD flow is entirely excluded by retrograde delivery", "The RV free wall and PDA territory because retrograde drainage coverage is incomplete"], why: "Much RV venous return drains through anterior cardiac and Thebesian veins rather than the coronary sinus, so retrograde-only delivery may underprotect the RV." },
    { q: "With severe AR, root cardioplegia causes LV distension. What is the best conceptual response?", a: 0, o: ["Vent the LV and switch to ostial or retrograde delivery", "Increase root pressure until cardioplegia crosses the regurgitant valve", "Remove the cross-clamp so the ventricle empties through the aorta"], why: "Regurgitant runoff defeats coronary delivery and distends the LV. Alternate routes plus active decompression address both problems." },
    { q: "Electrical activity returns before the planned redose. What does it mean?", a: 1, o: ["The myocardium has safely adapted to the ischemic interval", "Protection may be failing; reassess distribution and redose", "The potassium concentration is excessive and no action is needed"], why: "Mechanical or electrical activity consumes energy. Treat activity, warming or regional color change as a prompt to reassess distribution, temperature and elapsed time—not as a benign clock discrepancy." },
    { q: "Why can critical left main disease defeat root antegrade cardioplegia?", a: 2, o: ["The coronary sinus becomes obstructed whenever root pressure rises", "The RCA diverts all systemic pump flow away from the left ventricle", "One proximal stenosis limits both LAD and circumflex delivery"], why: "The infused root may have acceptable pressure while most LV myocardium is distal to the tight left-main lesion. Retrograde and down-graft routes make protection less dependent on native arterial patency." },
    { q: "Which observation best supports effective cardioplegia delivery?", a: 0, o: ["Prompt arrest, uniform cooling, and sustained quiescence", "A large infused volume despite implausible delivery pressure and uneven cooling", "High root pressure accompanied by progressive LV distension and warming"], why: "No single number proves protection. Effective arrest is a coupled pattern: prompt quiescence, plausible delivery pressure/flow, uniform cooling, lack of distension, and absence of regional electrical or thermal escape." }
  ];

  function registerCardioplegia() {
    window.CSLab.register({
      id: "cardioplegia",
      code: "STRAT 02",
      category: "Myocardial protection",
      minutes: 34,
      title: "Cardioplegia & Myocardial Protection",
      subtitle: "Protect myocardium as a dynamic oxygen-demand problem: choose a route, solution, temperature and redosing strategy, then detect when protection is failing.",
      objectives: [
        "Explain hyperkalemic diastolic arrest and hypothermic metabolic suppression without equating electrical silence with complete protection.",
        "Choose antegrade, retrograde, ostial and combined delivery based on regurgitation, coronary obstruction, RV coverage and operative access.",
        "Compare blood, crystalloid and del Nido strategies in terms of oxygen carriage, buffering, edema and redosing—not by brand preference.",
        "Use pressure, flow, arrest time, myocardial temperature, electrical activity and LV distension as a coupled protection monitor.",
        "Adapt dosing for LV hypertrophy, long clamp time, severe AR, coronary obstruction, patent graft flow and vulnerable RV myocardium."
      ],
      sourceSections: ["Guide §2.1–2.3 Coronary Supply–Demand and Ischemia", "Guide §10.4 Cardioplegia Principles", "Guide §10.5 Antegrade vs Retrograde", "Guide §10.6 Reperfusion and Weaning"],
      teach: {
        concept: "Myocardial protection is a dynamic oxygen-demand problem, not a single dose. Hyperkalaemia holds the membrane near −60 mV to stop electrical work; cold lowers metabolism through the Q10 effect; venting lowers wall tension. But arrest is only the beginning — delivery must reach every threatened territory, and route matters: antegrade fails past a tight stenosis or with AR, retrograde spares the RV, and returning electrical activity or regional warming is an alarm that protection is wearing off.",
        how: "Write a full prescription — route, carrier, temperature, redose interval and pressures — then test it against each scenario and watch the territory-distribution map respond. Run the cross-clamp clock to see the warning pattern evolve, and answer the six mechanism checks. The score rewards a plan that protects the specific vulnerable territory.",
        equations: ["K⁺ arrest ≈ −60 mV, fast Na⁺ channels off", "Q10: metabolism ↓ ~50% per 10°C", "Retrograde under-protects the RV"]
      },
      primers: [
        "Hyperkalemic diastolic arrest and sodium-channel inactivation",
        "Temperature-mediated metabolic suppression and Q10",
        "Blood, crystalloid and del Nido carrier concepts",
        "Antegrade, retrograde, direct ostial and down-graft delivery",
        "Severe AR, coronary obstruction, LVH and RV blind spots",
        "Pressure, flow, temperature, electrical activity and distension alarms"
      ],
      presets: CARDIOPLEGIA_PRESETS,
      challenges: CARDIO_CHALLENGES,
      render: function (ui) {
        const state = { index: 0, attempted: {}, challengeDone: {}, challengeCorrect: {}, elapsed: 0 };
        const body = [
          '<div class="strategy-intro protection">',
            '<div><span class="strategy-kicker">ARREST IS ONLY THE BEGINNING</span><h2>Lower demand. Preserve distribution. Reassess.</h2><p>Cross-clamping removes coronary inflow. Protection succeeds when electrical work stops, temperature falls, every threatened territory receives substrate and buffer, and distension is prevented until controlled reperfusion.</p></div>',
            '<div class="strategy-equation"><span>MYOCARDIAL O₂ DEMAND</span><b>Electrical + mechanical work</b><i>↓ K⁺ arrest</i><i>↓ temperature</i><i>↓ wall tension</i></div>',
          '</div>',
          '<nav class="strategy-presetbar" aria-label="Myocardial protection scenarios" id="strategy-cardio-presets"></nav>',
          '<div class="strategy-grid">',
            '<aside class="strategy-console" aria-label="Cardioplegia controls">',
              '<div class="strategy-panel-title"><span>01</span><div><b>Write the protection prescription</b><small>Route + solution + temperature + surveillance</small></div></div>',
              ui.select("cp-route", "Delivery route", [option("antegrade", "Antegrade root"), option("retrograde", "Retrograde coronary sinus"), option("combined", "Combined antegrade + retrograde"), option("ostial", "Direct coronary ostia")]),
              ui.select("cp-solution", "Carrier / formula", [option("blood", "Oxygenated blood cardioplegia"), option("crystalloid", "Crystalloid cardioplegia"), option("delnido", "del Nido-type strategy")]),
              ui.select("cp-temp", "Temperature strategy", [option("cold", "Cold 4–10°C"), option("tepid", "Tepid blood"), option("warm", "Warm continuous blood")]),
              '<div class="strategy-dial-bank" role="group" aria-label="Cardioplegia machine controls">',
                rotary("cp-redose", "Redose timer", 10, 90, 25, 5, " min"),
                rotary("cp-pressure", "Root pressure", 20, 100, 60, 5, " mmHg"),
                rotary("cp-cs-pressure", "CS pressure", 10, 60, 30, 5, " mmHg"),
              '</div>',
              '<label class="strategy-predict"><input id="cp-predict" type="checkbox"><span><b>Prediction committed</b><small>I predict distribution, arrest, cooling and the earliest failure clue.</small></span></label>',
              '<button class="btn strategy-primary" id="cp-check" type="button">Test prescription</button>',
              '<div class="strategy-feedback" id="cp-feedback" aria-live="polite"><b>Prediction gate</b><p>Build a complete protection strategy before revealing the guide.</p></div>',
            '</aside>',
            '<section class="strategy-workbench">',
              '<article class="strategy-case" id="cp-case"></article>',
              '<div class="strategy-heartmap" id="cp-heartmap" role="img" aria-label="Interactive myocardial protection distribution map"></div>',
              '<div class="strategy-protection-monitor" id="cp-monitor"></div>',
            '</section>',
          '</div>',
          '<section class="strategy-timeline"><div class="strategy-panel-title"><span>02</span><div><b>Run the cross-clamp clock</b><small>Observe how route, temperature and time change the warning pattern</small></div></div><div class="strategy-clock-controls"><button class="btn secondary sm" id="cp-minus" type="button">− 5 min</button><div><strong id="cp-time">0</strong><span>minutes clamped</span></div><button class="btn secondary sm" id="cp-plus" type="button">+ 5 min</button><button class="btn sm" id="cp-redose-now" type="button">Deliver / redose</button></div><div class="strategy-clock-track"><i id="cp-clock-fill"></i></div><div id="cp-clock-note" class="strategy-clock-note" aria-live="polite">Cross-clamp not yet applied. State your monitoring plan before advancing time.</div></section>',
          '<section class="strategy-challenges"><div class="strategy-panel-title"><span>03</span><div><b>Protection rounds</b><small>Six mechanism checks with immediate debrief</small></div></div><div id="cp-challenges"></div></section>',
          '<details class="strategy-primer"><summary><span>Deep primer</span> What each choice changes</summary><div class="strategy-primer-grid">',
            '<article><b>Diastolic arrest</b><p>Hyperkalemia holds the membrane near −60 mV, inactivating fast sodium channels. Electrical propagation and contraction stop, preserving ATP by minimizing crossbridge cycling.</p></article>',
            '<article><b>Temperature</b><p>Cold delivery uses the Q10 effect—metabolic rate falls roughly 50% per 10°C reduction. Deep cooling extends tolerance but alters enzyme kinetics, viscosity and reperfusion behavior.</p></article>',
            '<article><b>Blood carrier</b><p>Oxygen carriage, substrates, hemoglobin buffering and oncotic pressure favor physiologic recovery. Crystalloid is simpler but has no oxygen carriage and less buffering.</p></article>',
            '<article><b>del Nido concept</b><p>Lidocaine and magnesium supplement hyperkalemic arrest; mannitol supports osmotic/free-radical goals. A longer dosing interval is a strategy, never permission to stop monitoring.</p></article>',
            '<article><b>Antegrade</b><p>Follows the native coronary arterial tree. It is direct and efficient when the aortic valve is competent and proximal vessels are patent, but stenoses can create regional underdelivery.</p></article>',
            '<article><b>Retrograde</b><p>Travels from the coronary sinus through the venous network, bypassing proximal arterial obstruction. Coronary sinus pressure matters; the RV remains an important blind spot.</p></article>',
            '<article><b>Severe AR</b><p>Root infusion can regurgitate into the LV, creating distension and wall tension while coronary delivery remains poor. Decompress and change the route.</p></article>',
            '<article><b>Protection alarms</b><p>Delayed arrest, regional warming, recurring electrical activity, LV distension, unexpected pressure/flow, poor myocardial color and post-unclamp dysfunction all demand explanation.</p></article>',
          '</div></details>',
          '<section class="strategy-debrief" id="cp-debrief"><div><span class="strategy-kicker">PROGRESS</span><h2>Protection is repeated verification</h2><p>Complete eight prescriptions and six mechanism checks. The goal is not memorizing one formula—it is knowing when the chosen route can no longer protect a specific territory.</p></div><div class="strategy-score"><strong id="cp-score">0</strong><span>/ 14 decisions</span></div></section>'
        ].join("");
        ui.main().innerHTML = ui.frame(ui.lab, body);

        function selected(id) { const el = document.getElementById(id); return el ? el.value : ""; }
        function scenario() { return CARDIOPLEGIA_PRESETS[state.index]; }
        function between(value, range) { return value >= range[0] && value <= range[1]; }
        function includes(value, arr) { return arr.indexOf(value) !== -1; }
        function score() {
          const p = Object.keys(state.attempted).reduce(function (n, k) { return n + (state.attempted[k] || 0); }, 0);
          const c = Object.keys(state.challengeCorrect).reduce(function (n, k) { return n + (state.challengeCorrect[k] || 0); }, 0);
          return p + c;
        }

        function distribution(){return window.CSModels.cardioplegia({scenario:scenario().id,route:selected('cp-route'),pressure:ui.value('cp-pressure'),csPressure:ui.value('cp-cs-pressure')});}
        function levelClass(n){return n==='Expected'?'good':n==='Limited'?'watch':'danger';}
        function coverage(n){return n;}
        function coverageWidth(n){return n==='Expected'?85:n==='Limited'?55:25;}

        function drawHeart() {
          const d = distribution(), route = selected("cp-route"), temp = selected("cp-temp"), sol = selected("cp-solution");
          ui.publish({measurements:{"Delivery":route,"LV coverage":coverage(d.lv),"Septal coverage":coverage(d.septum),"RV coverage":coverage(d.rv),"Root pressure":ui.value("cp-pressure")+" mmHg","CS pressure":ui.value("cp-cs-pressure")+" mmHg"}});
          const deliveryPaths = route === "retrograde" ? '<path class="myo-route retro" d="M290 338 C290 292 277 249 250 210 M290 294 C337 278 382 231 414 183"/>' : route === "combined" ? '<path class="myo-route ante" d="M290 15v74M250 34c-47 28-60 64-73 99M330 34c47 28 60 64 73 99"/><path class="myo-route retro" d="M290 338 C290 292 277 249 250 210 M290 294 C337 278 382 231 414 183"/>' : route === "ostial" ? '<path class="myo-route ostial" d="M245 42 C210 70 188 105 177 143 M335 42 C370 70 392 105 403 143"/>' : '<path class="myo-route ante" d="M290 15v74M250 34c-47 28-60 64-73 99M330 34c47 28 60 64 73 99"/>';
          const rootP = ui.value("cp-pressure"), csP = ui.value("cp-cs-pressure");
          ui.html("cp-heartmap", '<div class="strategy-circuit-head"><span>DELIVERY & TERRITORY MONITOR</span><b>' + ui.esc(route.toUpperCase()) + ' DELIVERY · FLOWING</b></div><div class="strategy-cpg-machine"><div class="strategy-gauge" style="--gauge:' + (-120 + rootP / 100 * 240) + 'deg"><span>ROOT</span><i></i><b>' + rootP + '</b><small>mmHg</small></div><div class="strategy-cpg-pump"><i></i><b>CARDIOPLEGIA</b><small>' + ui.esc(sol.toUpperCase()) + ' · ' + ui.esc(temp.toUpperCase()) + '</small><em>DELIVERY ACTIVE</em></div><div class="strategy-gauge" style="--gauge:' + (-120 + csP / 60 * 240) + 'deg"><span>CORONARY SINUS</span><i></i><b>' + csP + '</b><small>mmHg</small></div></div><div class="strategy-myocardium">' +
            '<svg viewBox="0 0 590 360" aria-hidden="true"><defs><radialGradient id="myoGlow"><stop stop-color="#fb7185"/><stop offset="1" stop-color="#7f1d1d"/></radialGradient><filter id="myoBlur"><feGaussianBlur stdDeviation="7"/></filter></defs><path class="myo-heart" d="M290 323S83 209 77 103c-4-77 95-106 146-40 14 18 27 39 67 39s53-21 67-39c51-66 150-37 146 40-6 106-213 220-213 220z"/><path class="myo-septum ' + levelClass(d.septum) + '" d="M290 99c-22 56-28 131 0 222 28-91 22-166 0-222z"/><path class="myo-lv ' + levelClass(d.rv) + '" d="M278 115c-45-19-117-45-148 5-36 59 53 139 149 190-23-76-24-138-1-195z"/><path class="myo-rv ' + levelClass(d.lv) + '" d="M302 115c45-19 117-45 148 5 36 59-53 139-149 190 23-76 24-138 1-195z"/>' + deliveryPaths + '<circle class="myo-source" cx="290" cy="18" r="12"/><circle class="myo-source retro-source" cx="290" cy="338" r="10"/><text x="166" y="201">RV</text><text x="414" y="201">LV</text><text x="290" y="224">SEPTUM</text></svg>' +
            '<div class="myo-bars"><p class="small">Anterior teaching schematic · qualitative coverage</p><div><span>LV territory</span><i><em class="' + levelClass(d.lv) + '" style="width:' + coverageWidth(d.lv) + '%"></em></i><b>' + coverage(d.lv) + '</b></div><div><span>Septum</span><i><em class="' + levelClass(d.septum) + '" style="width:' + coverageWidth(d.septum) + '%"></em></i><b>' + coverage(d.septum) + '</b></div><div><span>RV territory</span><i><em class="' + levelClass(d.rv) + '" style="width:' + coverageWidth(d.rv) + '%"></em></i><b>' + coverage(d.rv) + '</b></div></div></div>');
          const csPressure = ui.value("cp-cs-pressure");
          const arrest = selected("cp-pressure") < 40 && route !== "retrograde" ? "Delayed / uncertain" : "Prompt if distribution is complete";
          const tempLabel = temp === "cold" ? "Strong metabolic suppression" : temp === "tepid" ? "Moderate suppression" : "Delivery must be uninterrupted";
          const carrier = sol === "blood" ? "O₂ + buffer + oncotic support" : sol === "delnido" ? "Long-interval membrane strategy" : "No oxygen carriage";
          const pressureSignal = route === "retrograde" ? (csPressure >= 20 && csPressure <= 40 ? "CS pressure plausible" : "CS pressure unsafe / ineffective") : route === "combined" ? (csPressure >= 20 && csPressure <= 40 ? "Root + CS monitored" : "Reassess CS pressure") : "Antegrade line monitored";
          ui.html("cp-monitor", '<div><small>ARREST</small><b>' + arrest + '</b></div><div><small>TEMPERATURE</small><b>' + tempLabel + '</b></div><div><small>PRESSURE</small><b>' + pressureSignal + '</b></div><div><small>CARRIER / RESERVE</small><b>' + carrier + '</b></div>');
        }

        function drawPresets() {
          ui.html("strategy-cardio-presets", CARDIOPLEGIA_PRESETS.map(function (p, i) { return '<button type="button" class="strategy-preset ' + (i === state.index ? "active" : "") + ' ' + (Object.prototype.hasOwnProperty.call(state.attempted, p.id) ? "done" : "") + '" data-cp-index="' + i + '" aria-pressed="' + (i === state.index) + '"><span>' + (i + 1) + '</span>' + ui.esc(p.label) + '</button>'; }).join(""));
          document.querySelectorAll("[data-cp-index]").forEach(function (btn) { btn.addEventListener("click", function () { state.index = +btn.dataset.cpIndex; state.elapsed = 0; renderScenario(); }); });
        }

        function renderScenario() {
          const p = scenario();
          drawPresets();
          ui.html("cp-case", '<span class="strategy-kicker">PROTECTION PROBLEM ' + (state.index + 1) + ' / ' + CARDIOPLEGIA_PRESETS.length + '</span><h2>' + ui.esc(p.title) + '</h2><p>' + ui.esc(p.brief) + '</p><div class="strategy-prompt"><b>Predict four things:</b> time to arrest, least-protected territory, expected temperature pattern, and the first clue that should trigger reassessment.</div>');
          const box = document.getElementById("cp-predict"); if (box) box.checked = false;
          state.elapsed = 0;
          ui.html("cp-feedback", '<b>Prediction gate</b><p>Build a complete protection strategy before revealing the guide.</p>');
          drawHeart(); drawClock();
        }

        function checkPrescription() {
          const p = scenario();
          if (!document.getElementById("cp-predict").checked) {
            ui.html("cp-feedback", '<b>Commit the prediction first.</b><p>Name the vulnerable territory and earliest failure clue aloud before testing the prescription.</p>'); return;
          }
          const route = selected("cp-route");
          const rootPressureOkay = between(ui.value("cp-pressure"), p.pressure);
          const csPressureOkay = between(ui.value("cp-cs-pressure"), [20, 40]);
          const pressureOkay = route === "retrograde" ? csPressureOkay : route === "combined" ? rootPressureOkay && csPressureOkay : rootPressureOkay;
          const checks = [includes(route, p.acceptedRoute), includes(selected("cp-solution"), p.acceptedSolution), includes(selected("cp-temp"), p.acceptedTemp), between(ui.value("cp-redose"), p.interval), pressureOkay];
          const n = checks.filter(Boolean).length;
          state.attempted[p.id] = n === 5 ? 1 : 0;
          ui.html("cp-feedback", '<b>' + (n === 5 ? "Protection plan fits the physiology." : n + "/5 prescription elements are defensible.") + '</b><p>' + ui.esc(p.insight) + '</p><div class="strategy-danger"><span>COGNITIVE TRAP</span>' + ui.esc(p.trap) + '</div><div class="strategy-key"><span>Accepted range</span><b>Route:</b> ' + ui.esc(p.acceptedRoute.join(" or ")) + ' · <b>Carrier:</b> ' + ui.esc(p.acceptedSolution.join(" or ")) + ' · <b>Temp:</b> ' + ui.esc(p.acceptedTemp.join(" or ")) + ' · <b>Reassess:</b> ' + p.interval[0] + '–' + p.interval[1] + ' min · <b>Antegrade:</b> ' + p.pressure[0] + '–' + p.pressure[1] + ' mmHg when used · <b>Coronary sinus:</b> 20–40 mmHg when used. Use current local protocols.</div>');
          drawPresets(); updateProgress();
        }

        function drawClock() {
          const planned = ui.value("cp-redose"), temp = selected("cp-temp"), route = selected("cp-route");
          ui.text("cp-time", state.elapsed);
          document.getElementById("cp-clock-fill").style.width = Math.min(100, state.elapsed / Math.max(planned, 1) * 100) + "%";
          let note = "Protection is fresh. Verify rapid arrest, pressure/flow, decompression and uniform cooling.";
          if (state.elapsed >= planned) note = "Planned reassessment point reached: do not let the clock substitute for electrical activity, myocardial temperature or regional delivery evidence.";
          else if (state.elapsed >= planned * 0.7) note = "Protection margin is narrowing. Ask what territory is least well served by " + route + " delivery and prepare the next dose.";
          if (temp === "warm" && state.elapsed > 0) note = "Warm protection depends on continuous, uninterrupted delivery. Any interruption is immediately consequential.";
          ui.text("cp-clock-note", note);
        }

        function drawChallenges() {
          ui.html("cp-challenges", CARDIO_CHALLENGES.map(function (c, i) {
            return '<article class="strategy-challenge"><header><span>' + (i + 1) + '</span><b>' + ui.esc(c.q) + '</b></header><div>' + c.o.map(function (o, oi) { return '<button type="button" data-challenge="' + i + '" data-answer="' + oi + '" ' + (state.challengeDone[i] ? "disabled" : "") + ' class="' + (state.challengeDone[i] && oi === c.a ? "right" : "") + '">' + ui.esc(o) + '</button>'; }).join("") + '</div><p id="challenge-feedback-' + i + '" aria-live="polite">' + (state.challengeDone[i] ? ui.esc(c.why) : "Choose an answer to reveal the mechanism.") + '</p></article>';
          }).join(""));
          document.querySelectorAll("[data-challenge]").forEach(function (btn) { btn.addEventListener("click", function () {
            const i = +btn.dataset.challenge, c = CARDIO_CHALLENGES[i], right = +btn.dataset.answer === c.a;
            state.challengeDone[i] = true; state.challengeCorrect[i] = right ? 1 : 0;
            drawChallenges();
            const feedback = document.getElementById("challenge-feedback-" + i); if (feedback) feedback.innerHTML = '<b>' + (right ? "Correct. " : "Rebuild the mechanism. ") + '</b>' + ui.esc(c.why);
            updateProgress();
          }); });
        }

        function updateProgress() {
          ui.text("cp-score", score());
          if (Object.keys(state.attempted).length === CARDIOPLEGIA_PRESETS.length && Object.keys(state.challengeDone).length === CARDIO_CHALLENGES.length) {
            ui.complete("cardioplegia", score(), 14);
            ui.html("cp-debrief", '<div><span class="strategy-kicker">LAB COMPLETE</span><h2>' + (score() >= 11 ? "You are monitoring protection, not merely dosing it" : "Re-run the vulnerable territories") + '</h2><p>A robust verbal plan always names: arrest route, maintenance route, carrier and temperature, redose/reassessment triggers, venting, least-protected territory, and the response to electrical or thermal escape.</p><div class="strategy-takeaways"><span>Root pressure does not prove distal distribution.</span><span>Retrograde delivery does not fully protect the RV.</span><span>Electrical activity and warming are action signals.</span></div></div><div class="strategy-score"><strong>' + score() + '</strong><span>/ 14 decisions</span></div>');
          }
        }

        ["cp-route", "cp-solution", "cp-temp", "cp-redose", "cp-pressure", "cp-cs-pressure"].forEach(function (id) {
          document.getElementById(id).addEventListener(id === "cp-redose" || id === "cp-pressure" || id === "cp-cs-pressure" ? "input" : "change", function () {
            ui.text("out-cp-redose", ui.value("cp-redose") + " min"); ui.text("out-cp-pressure", ui.value("cp-pressure") + " mmHg"); ui.text("out-cp-cs-pressure", ui.value("cp-cs-pressure") + " mmHg"); syncRotary("cp-redose"); syncRotary("cp-pressure"); syncRotary("cp-cs-pressure"); drawHeart(); drawClock();
          });
        });
        document.getElementById("cp-check").addEventListener("click", checkPrescription);
        document.getElementById("cp-minus").addEventListener("click", function () { state.elapsed = Math.max(0, state.elapsed - 5); drawClock(); });
        document.getElementById("cp-plus").addEventListener("click", function () { state.elapsed = Math.min(180, state.elapsed + 5); drawClock(); });
        document.getElementById("cp-redose-now").addEventListener("click", function () { state.elapsed = 0; drawClock(); ui.text("cp-clock-note", "Dose delivered. Reconfirm arrest, pressure/flow, LV decompression, myocardial temperature and uniform regional response."); });
        ["cp-redose", "cp-pressure", "cp-cs-pressure"].forEach(syncRotary);
        drawChallenges(); renderScenario();
      }
    });
  }

  registerCannulation();
  registerCardioplegia();
})();
