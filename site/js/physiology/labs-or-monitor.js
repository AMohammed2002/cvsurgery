/* Integrated cardiac operating-room monitor and full-case physiology lab. */
(function () {
  "use strict";
  const requestAnimationFrame = fn => window.CSLab.raf(fn), cancelAnimationFrame = id => window.CSLab.cancelRaf(id);

  if (!window.CSLab) throw new Error("CSLab core must load before the OR monitor lab");
  if (!window.CSECG) throw new Error("CSECG engine must load before the OR monitor lab");

  const ECG = window.CSECG;
  const NUMERIC_KEYS = ["hr", "pulseRate", "sbp", "dbp", "map", "cvp", "spo2", "etco2", "fico2", "rr", "temp", "etO2", "fiO2", "ppv", "cpb", "arrest", "ventilation", "pulseValid", "spo2Valid", "artValid", "stII", "stV5", "staVL"];
  const REQUIRED_KEYS = NUMERIC_KEYS.concat(["rhythm"]);

  function merge(base, changes) { return Object.assign({}, base, changes || {}); }

  const BASE = {
    hr: 83, pulseRate: 86, sbp: 122, dbp: 77, map: 96, cvp: 10, spo2: 100,
    etco2: 33, fico2: 1, rr: 15, temp: 35.3, etO2: 93, fiO2: 99,
    ppv: 0.04, cpb: 0, arrest: 0, ventilation: 1, pulseValid: 1,
    spo2Valid: 1, artValid: 1, rhythm: "sinus", stII: -0.1, stV5: -0.2, staVL: 0
  };
  const CALM = merge(BASE, { hr: 76, pulseRate: 77, sbp: 118, dbp: 70, map: 87, cvp: 8, temp: 35.1, stII: 0, stV5: -0.1 });
  const STIMULUS = merge(BASE, { hr: 98, pulseRate: 99, sbp: 158, dbp: 86, map: 110, cvp: 12, etco2: 36, temp: 35.4, ppv: 0.05, stII: -0.3, stV5: -0.8, staVL: -0.1 });
  const CANNULATED = merge(BASE, { hr: 80, pulseRate: 81, sbp: 126, dbp: 74, map: 91, cvp: 9, etco2: 34, temp: 34.8 });
  const CPB_BEATING = merge(BASE, { hr: 72, pulseRate: 0, sbp: 68, dbp: 62, map: 65, cvp: 3, spo2: 100, etco2: 4, fico2: 0, rr: 0, temp: 34.2, ppv: 0, cpb: 1, arrest: 0, ventilation: 0, pulseValid: 0, spo2Valid: 0 });
  const ARRESTED = merge(CPB_BEATING, { hr: 0, sbp: 64, dbp: 59, map: 62, etco2: 1, temp: 33.5, arrest: 1, rhythm: "arrest", stII: 0, stV5: 0, staVL: 0 });
  const REWARMING = merge(ARRESTED, { sbp: 70, dbp: 64, map: 67, temp: 35.6 });
  const REPERFUSION = merge(CPB_BEATING, { hr: 62, sbp: 72, dbp: 64, map: 68, temp: 35.8, arrest: 0, rhythm: "sinus", stII: -0.2, stV5: -0.3 });
  const SEPARATING = merge(BASE, { hr: 86, pulseRate: 84, sbp: 104, dbp: 62, map: 76, cvp: 11, spo2: 99, etco2: 37, rr: 12, temp: 36.1, etO2: 91, ppv: 0.08, cpb: 0.15, arrest: 0, ventilation: 1, pulseValid: 1, spo2Valid: 1, rhythm: "sinus", stII: -0.2, stV5: -0.3 });
  const STABLE_OFF = merge(BASE, { hr: 84, pulseRate: 84, sbp: 112, dbp: 66, map: 81, cvp: 9, etco2: 35, rr: 13, temp: 36.4, stII: -0.1, stV5: -0.2 });
  const CLOSED = merge(STABLE_OFF, { hr: 88, pulseRate: 88, sbp: 118, dbp: 70, map: 86, cvp: 10, etco2: 34, temp: 36.5 });

  const COMPLICATIONS = {
    demand: {
      id: "demand-ischaemia", label: "Demand ischaemia", severity: "urgent",
      action: "Pause the stimulus and report the new ST trend while correcting tachycardia and hypertension.",
      physiology: "Tachycardia shortens diastolic coronary perfusion time while hypertension raises wall stress and myocardial oxygen demand. A new territorial trend needs confirmation and treatment, not dismissal as surgical stimulation.",
      warning: "New horizontal or downsloping ST depression with a haemodynamic trigger is ischaemia until proven otherwise.",
      state: merge(STIMULUS, { hr: 112, pulseRate: 112, sbp: 172, dbp: 92, map: 119, stII: -1.2, stV5: -2.0, staVL: -0.8 })
    },
    cannulationBleed: {
      id: "cannulation-bleeding", label: "Aortic cannulation bleeding", severity: "critical",
      action: "Call the pressure loss, control the cannulation site, restore circulating volume, and prepare rapid institution of bypass if the cannula is secure.",
      physiology: "Acute blood loss lowers venous return, filling pressure and stroke volume. Tachycardia, a narrowing pulse pressure, respiratory variation and falling ETCO₂ reflect reduced forward flow.",
      warning: "A falling MAP and CVP at cannulation can be external bleeding or occult aortic injury; inspect the field and use TEE.",
      state: merge(BASE, { hr: 118, pulseRate: 116, sbp: 82, dbp: 48, map: 59, cvp: 2, spo2: 97, etco2: 25, temp: 34.6, ppv: 0.22, stII: -0.6, stV5: -1.1 })
    },
    dissection: {
      id: "cannulation-dissection", label: "Cannulation dissection", severity: "critical",
      action: "Stop arterial flow, announce suspected dissection, confirm true-lumen perfusion with TEE/epiaortic imaging, and move inflow to a safe site.",
      physiology: "A false-lumen cannula can produce high line pressure with inadequate systemic delivery. The bedside arterial pressure may collapse despite an apparently running pump.",
      warning: "Never answer low patient pressure during new arterial inflow by blindly increasing pump flow.",
      state: merge(CPB_BEATING, { sbp: 42, dbp: 38, map: 40, cvp: 4, etco2: 2, hr: 92, stII: -0.8, stV5: -1.0 })
    },
    vf: {
      id: "reperfusion-vf", label: "Reperfusion ventricular fibrillation", severity: "urgent",
      action: "Maintain CPB support, correct temperature/electrolytes, de-air and defibrillate when the myocardium is ready.",
      physiology: "After cross-clamp removal, heterogeneous reperfusion can generate chaotic ventricular activation. Pump pressure remains present because systemic perfusion still comes from CPB; the ECG rhythm is not producing the arterial flow.",
      warning: "Do not confuse a pump-generated arterial pressure with effective native cardiac output.",
      state: merge(REPERFUSION, { hr: 0, rhythm: "vf", stII: 0, stV5: 0, staVL: 0 })
    },
    failSeparate: {
      id: "failure-to-separate", label: "Failure to separate from bypass", severity: "critical",
      action: "Return to adequate pump support and systematically assess rhythm/rate, preload, LV and RV function, afterload, surgical result, air and obstruction with TEE.",
      physiology: "As pump flow falls, a stunned or mechanically compromised heart cannot generate enough stroke volume. Pulsatility shrinks, MAP and ETCO₂ fall, and filling pressure may rise.",
      warning: "More inotrope is not a diagnosis. Exclude a correctable surgical problem before accepting escalating support.",
      state: merge(SEPARATING, { hr: 110, pulseRate: 102, sbp: 78, dbp: 52, map: 61, cvp: 18, spo2: 96, etco2: 24, ppv: 0.16, stII: -0.5, stV5: -0.9 })
    },
    protamine: {
      id: "protamine-reaction", label: "Protamine reaction", severity: "critical",
      action: "Stop protamine, call the reaction, support systemic pressure and RV function, and prepare to re-heparinize and return to CPB if collapse persists.",
      physiology: "Protamine can cause bradycardia and systemic hypotension; severe pulmonary vasoconstriction acutely loads the RV, raising CVP while systemic output falls.",
      warning: "Sudden hypotension with a rising CVP during protamine is not simple vasodilation until acute RV failure is excluded.",
      state: merge(STABLE_OFF, { hr: 54, pulseRate: 52, sbp: 66, dbp: 38, map: 47, cvp: 21, spo2: 92, etco2: 21, ppv: 0.18, stII: -0.5, stV5: -0.8 })
    },
    tamponade: {
      id: "tamponade", label: "Tamponade during closure", severity: "critical",
      action: "Ask the surgeon to release closure/compression immediately and assess the mediastinum and ventricles with direct inspection and TEE.",
      physiology: "External compression limits diastolic filling. CVP rises while stroke volume, pulse pressure, MAP and ETCO₂ fall; tachycardia attempts to preserve cardiac output.",
      warning: "A rising CVP with falling MAP during closure is mechanical obstruction until proven otherwise.",
      state: merge(CLOSED, { hr: 122, pulseRate: 120, sbp: 82, dbp: 62, map: 69, cvp: 20, spo2: 97, etco2: 25, ppv: 0.16, stII: -0.4, stV5: -0.7 })
    }
  };

  function step(id, phase, minute, label, action, physiology, state, changes, warning, branches) {
    return { id: id, phase: phase, minute: minute, label: label, action: action, physiology: physiology, state: merge(state, changes), warning: warning || "", branches: branches || [] };
  }

  const CASES = {
    cabg: {
      id: "cabg", short: "CABG", title: "On-pump CABG", patient: "Three-vessel coronary disease · preserved LV function · sinus rhythm",
      cpbStart: 54, clampStart: 62, clampEnd: 126, cpbEnd: 151,
      steps: [
        step("baseline", "Preparation", 0, "Post-induction reference", "Confirm ECG leads II and V5, invasive arterial pressure, central venous pressure, capnography, pulse oximetry, temperature, TEE and the pre-bypass baseline.", "This is the reference against which every later change is judged. The displayed pulse rate is independently averaged from the pulsatile signal and need not equal the ECG rate at every instant.", BASE),
        step("sternotomy", "Exposure", 14, "Sternotomy and pericardiotomy", "Open the sternum and pericardium while conduit harvest proceeds in parallel.", "Noxious stimulation may increase sympathetic tone. Once the chest is open, pulse-pressure variation is no longer a validated fluid-responsiveness test.", STIMULUS, null, "Protect the unrevascularized myocardium from tachycardia and hypertension.", [COMPLICATIONS.demand]),
        step("heparin", "Cannulation", 36, "Heparin and ACT confirmation", "Give systemic heparin and confirm the institutional ACT target before any circuit cannula is exposed to blood.", "Anticoagulation itself should not create a dramatic monitor change; instability at this point needs another explanation.", CALM),
        step("aortic-cannula", "Cannulation", 43, "Arterial cannulation", "Cannulate a disease-free ascending-aortic site under controlled pressure and confirm secure arterial inflow.", "The patient remains on native circulation. A sudden pressure loss is not an expected consequence of uncomplicated cannulation.", CANNULATED, null, "Confirm cannula position and line freedom before accepting bypass flow.", [COMPLICATIONS.cannulationBleed, COMPLICATIONS.dissection]),
        step("venous-cannula", "Cannulation", 49, "Right-atrial venous cannulation", "Place the two-stage right-atrial cannula, connect the venous line and confirm unobstructed drainage.", "Atrial manipulation may produce brief ectopy, but stable filling and pressure should return before bypass.", CANNULATED, { hr: 84, pulseRate: 84 }),
        step("cpb", "Bypass", 54, "Initiate cardiopulmonary bypass", "Open venous drainage and increase pump flow with closed-loop confirmation; stop ventilation once full support and decompression are established.", "Systemic pressure becomes pump generated and largely non-pulsatile. CVP falls with venous drainage, the pleth loses pulsatility, SpO₂ becomes invalid and ETCO₂ falls when pulmonary ventilation/perfusion cease.", CPB_BEATING),
        step("cross-clamp", "Bypass", 62, "Cross-clamp and cardioplegic arrest", "Apply the aortic cross-clamp and deliver cardioplegia until electrical and mechanical arrest are established.", "The ECG becomes electrically silent only after arrest. Pump-generated arterial pressure remains, while the lungs remain outside the gas-exchange circuit.", ARRESTED),
        step("lima-lad", "Revascularization", 78, "LIMA–LAD distal anastomosis", "Open the LAD beyond significant disease and construct the LIMA end-to-side anastomosis on the arrested heart.", "The bedside monitor remains in the arrested CPB state; adequacy of myocardial protection is judged with arrest, myocardial temperature, ventricular distension and redosing strategy rather than native vital signs.", ARRESTED, { temp: 33.2 }),
        step("other-distals", "Revascularization", 94, "Remaining distal anastomoses", "Construct the planned obtuse-marginal and PDA/right-coronary grafts with appropriate exposure and conduit lie.", "The pump maintains organ perfusion while the heart is manipulated. A change in systemic pump pressure does not represent native cardiac output.", ARRESTED, { temp: 33.0 }),
        step("proximals", "Revascularization", 112, "Proximal anastomoses and rewarming", "Complete proximal aortic or composite graft anastomoses and begin controlled rewarming.", "Temperature rises while the heart remains arrested. Oxygen demand rises with rewarming, so flow and oxygen delivery must remain adequate.", REWARMING, { temp: 35.1 }),
        step("deair", "Reperfusion", 121, "De-air under TEE", "Fill the heart gradually, ventilate the lungs and remove intracardiac/aortic-root air before clamp release.", "Ventilation may restart before native ejection; capnography begins to return only as pulmonary blood flow returns.", REWARMING, { ventilation: 1, rr: 10, etco2: 5 }),
        step("unclamp", "Reperfusion", 126, "Release the cross-clamp", "Release the clamp and reperfuse the grafts and native coronaries while remaining on CPB support.", "Electrical activity returns before effective mechanical output is required. Pulse oximetry remains invalid while flow is non-pulsatile.", REPERFUSION, null, "Expect transient reperfusion rhythms, but treat persistent VF and exclude air or ischemia.", [COMPLICATIONS.vf]),
        step("rhythm", "Reperfusion", 132, "Restore a perfusing rhythm", "Correct electrolytes and temperature, defibrillate if needed, and test atrial and ventricular pacing wires.", "A stable sinus or paced rhythm restores coordinated filling; arterial pulsatility still depends on native ejection and pump-flow reduction.", REPERFUSION, { hr: 80, rhythm: "sinus" }),
        step("graft-flow", "Assessment", 138, "Assess every graft", "Use transit-time flow measurement and inspect any graft with poor mean flow, high pulsatility index or abnormal diastolic filling.", "Normal ECG and pressure do not exclude a technical graft problem. Flow measurement and TEE add information the bedside monitor cannot supply.", REPERFUSION),
        step("separate", "Separation", 145, "Trial off and separate from CPB", "Resume ventilation, optimize rate/rhythm, preload and afterload, then reduce pump flow while reading TEE and the returning native signals.", "Pulsatility, pleth and ETCO₂ return with effective native output. A coherent separation has pressure, flow, filling and imaging all telling the same story.", SEPARATING, null, "A falling MAP with rising filling pressure requires diagnosis before more support.", [COMPLICATIONS.failSeparate]),
        step("post-tee", "Assessment", 151, "Post-bypass TEE and graft review", "Confirm biventricular function, regional wall motion, de-airing and the absence of a new surgical problem.", "Stable surface numbers are necessary but insufficient; new regional dysfunction or territorial ST change localizes a coronary/graft problem.", STABLE_OFF, null, "New inferior injury with RV dysfunction suggests RCA air or graft compromise.", [{
          id: "rca-graft-ischaemia", label: "RCA graft/air compromise", severity: "critical",
          action: "Call the inferior injury pattern, return to support as needed, assess RV wall motion and the RCA graft/coronary flow, and correct the mechanical cause.",
          physiology: "Acute inferior ischemia can slow the sinus/AV node, impair the RV, raise CVP and reduce LV preload and systemic output.",
          warning: "Do not treat a new post-CABG territorial pattern with vasopressor alone.",
          state: merge(STABLE_OFF, { hr: 58, pulseRate: 56, sbp: 82, dbp: 50, map: 61, cvp: 17, etco2: 26, stII: 2.4, stV5: -0.4, staVL: -1.4 })
        }]),
        step("protamine", "Hemostasis", 158, "Protamine, decannulation and hemostasis", "Stop cardiotomy suction, administer protamine slowly, confirm reversal, decannulate and inspect every graft and cannulation site.", "A slow infusion minimizes haemodynamic effects. Protamine overdose can worsen coagulation rather than improve it.", STABLE_OFF, { sbp: 108, dbp: 64, map: 78 }, "Keep a route back to CPB until reversal makes it unsafe.", [COMPLICATIONS.protamine]),
        step("closure", "Closure", 181, "Drains, wires and chest closure", "Place drains and pacing wires, reassess the filled heart as the sternum approximates, then transfer with explicit rhythm, support and bleeding information.", "Closing the chest can change ventricular filling and graft lie. Recheck pressure, CVP, ETCO₂ and TEE before accepting the final state.", CLOSED, null, "Reassess any rising CVP/falling MAP during closure immediately.", [COMPLICATIONS.tamponade])
      ]
    },
    avr: {
      id: "avr", short: "AVR", title: "Surgical aortic valve replacement", patient: "Severe calcific aortic stenosis · concentric LVH · sinus rhythm",
      cpbStart: 48, clampStart: 56, clampEnd: 119, cpbEnd: 142,
      steps: [
        step("baseline", "Preparation", 0, "Severe-AS baseline", "Confirm the valve diagnosis, LV/RV function, coronary anatomy and a sinus-rhythm haemodynamic baseline with TEE.", "The hypertrophied, stiff LV depends on adequate preload, diastolic pressure and atrial contribution. Avoid tachycardia, hypotension and abrupt vasodilation.", merge(BASE, { hr: 68, pulseRate: 68, sbp: 132, dbp: 76, map: 94, cvp: 11, etco2: 34, stII: -0.2, stV5: -0.5 })),
        step("exposure", "Exposure", 15, "Sternotomy and pericardial exposure", "Open the sternum and expose the ascending aorta, right atrium and aortic root.", "A controlled pressure and sinus rhythm preserve coronary perfusion in severe AS.", STIMULUS, { hr: 84, pulseRate: 84, sbp: 150, dbp: 84, map: 106, stV5: -0.6 }),
        step("heparin", "Cannulation", 31, "Heparin and ACT confirmation", "Heparinize and confirm the ACT before cannulation.", "No major monitor change is expected from adequate anticoagulation alone.", CALM, { hr: 70, pulseRate: 70, cvp: 10 }),
        step("cannulation", "Cannulation", 40, "Aortic and two-stage venous cannulation", "Cannulate the distal ascending aorta and right atrium and confirm safe inflow and drainage paths.", "The patient remains on native circulation until bypass begins.", CANNULATED, { hr: 72, pulseRate: 72 }, "Use TEE when placement, decompression or aortic integrity is uncertain.", [COMPLICATIONS.cannulationBleed, COMPLICATIONS.dissection]),
        step("cpb", "Bypass", 48, "Initiate CPB", "Establish full flow, drain the heart and stop ventilation after support is confirmed.", "Arterial pressure becomes pump generated; CVP and pulsatile signals fall as the heart empties.", CPB_BEATING, { temp: 34.4 }),
        step("arrest", "Bypass", 56, "Vent, cross-clamp and cardioplegia", "Place an LV vent, clamp the aorta and deliver cardioplegia with attention to the valve lesion and coronary delivery.", "Electrical silence follows adequate arrest. The vent prevents LV distension while the aorta is open.", ARRESTED, { temp: 33.8 }, "Persistent electrical activity or LV distension demands immediate correction.", [{
          id: "lv-distension", label: "Inadequate protection / LV distension", severity: "critical",
          action: "Stop and improve venting and cardioplegia delivery; inspect coronary ostial/retrograde strategy and myocardial temperature.",
          physiology: "Inadequate decompression raises LV wall tension and myocardial oxygen demand while poor cardioplegia distribution permits electrical activity.",
          warning: "Do not proceed with a distending or electrically active heart under clamp.",
          state: merge(ARRESTED, { hr: 38, arrest: 0, rhythm: "junctional", cvp: 5, sbp: 68, dbp: 61, map: 64 })
        }]),
        step("aortotomy", "Valve replacement", 66, "Aortotomy and valve exposure", "Open the aorta above the sinotubular junction and expose all three cusps and coronary ostia.", "Systemic perfusion remains fully pump dependent.", ARRESTED),
        step("excise", "Valve replacement", 75, "Excise diseased cusps", "Sharply remove the calcified cusps close to the annulus while controlling debris.", "The monitor remains unchanged; embolic prevention and annular anatomy are the active safety problems.", ARRESTED, { temp: 33.4 }),
        step("debride", "Valve replacement", 84, "Debride the annulus", "Remove calcium with controlled shallow bites while protecting the aortomitral curtain and conduction axis.", "The conduction system near the noncoronary-right commissure explains the later risk of AV block.", ARRESTED, { temp: 33.2 }),
        step("size", "Valve replacement", 94, "Size and assess mismatch", "Size the annulus, predict indexed effective orifice area and decide whether enlargement is required.", "This is an anatomic and flow decision; bedside pressure cannot reveal future patient–prosthesis mismatch.", ARRESTED),
        step("implant", "Valve replacement", 104, "Implant the prosthesis", "Place annular sutures, parachute the prosthesis and secure it in the correct orientation.", "Maintain protection and avoid excessively long unplanned ischemic time.", ARRESTED, { temp: 34.0 }),
        step("check-close", "Valve replacement", 111, "Check seating and close the aortotomy", "Confirm free leaflet/occluder motion, coronary-ostial clearance and complete aortic closure while rewarming.", "The heart remains arrested while temperature approaches the separation target.", REWARMING, { temp: 35.2 }),
        step("deair-unclamp", "Reperfusion", 119, "De-air and release the clamp", "Ventilate, fill and de-air under TEE, then release the clamp and reperfuse.", "Electrical activity returns on pump support; capnography only returns meaningfully with pulmonary blood flow.", REPERFUSION, { ventilation: 1, rr: 10, etco2: 6 }),
        step("rhythm", "Reperfusion", 126, "Restore rhythm and test pacing wires", "Treat reperfusion rhythm, confirm atrial and ventricular wire capture and protect AV synchrony.", "The conduction axis lies close to the aortic annulus, so new complete block after AVR is a recognized surgical complication.", REPERFUSION, { hr: 74 }, "A slow escape with AV dissociation needs reliable temporary pacing.", [{
          id: "complete-block", label: "Complete AV block", severity: "critical",
          action: "Confirm electrical and mechanical capture and institute AV-sequential temporary pacing while assessing reversible causes and ischemia.",
          physiology: "Atrial activity continues independently, but a slow wide ventricular escape produces inadequate output. In a stiff LV, loss of rate and AV synchrony is especially poorly tolerated.",
          warning: "Atrial pacing alone cannot conduct through complete AV block.",
          state: merge(REPERFUSION, { hr: 32, rhythm: "complete-block", cvp: 13 })
        }, {
          id: "ddd-paced", label: "DDD pacing restored", severity: "resolved",
          action: "Track/sense the atrium and pace the ventricle after a physiologic AV delay, with output safely above threshold.",
          physiology: "AV-sequential pacing restores rate and coordinated filling; confirm every electrical event produces an arterial upstroke.",
          warning: "Continue surveillance because postoperative conduction can evolve.",
          state: merge(REPERFUSION, { hr: 82, rhythm: "paced", cvp: 10 })
        }]),
        step("separate", "Separation", 135, "Rewarm and trial off bypass", "Resume full ventilation and reduce pump flow while optimizing sinus or paced rate, filling and vascular tone.", "Native pulsatility, pleth and ETCO₂ return as the LV ejects through the new prosthesis.", SEPARATING, { hr: 82, pulseRate: 82, cvp: 12 }, "A hypertrophied LV may need careful filling but not indiscriminate volume.", [COMPLICATIONS.failSeparate]),
        step("tee", "Assessment", 142, "TEE prosthesis assessment", "Confirm leaflet motion, gradients at the measured flow/rate, paravalvular regurgitation, coronary flow and biventricular function.", "A stable bedside monitor cannot exclude a paravalvular leak or prosthetic obstruction; the result is an imaging diagnosis.", STABLE_OFF, { hr: 82, pulseRate: 82, cvp: 11 }, "More than trivial unexpected paravalvular regurgitation requires a surgical decision.", [{
          id: "paravalvular-leak", label: "Important paravalvular leak", severity: "urgent",
          action: "Correlate the TEE jet with prosthesis seating and haemodynamics and return to support for revision when significant.",
          physiology: "Acute regurgitant volume can lower forward output despite superficially acceptable pressure; TEE provides the decisive evidence.",
          warning: "Do not call an important new leak acceptable because the monitor numerics look stable.",
          state: merge(STABLE_OFF, { hr: 102, pulseRate: 100, sbp: 94, dbp: 48, map: 64, cvp: 14, etco2: 29 })
        }]),
        step("protamine", "Hemostasis", 150, "Protamine and decannulation", "Reverse heparin slowly, decannulate and secure the aortic/atrial sites and aortotomy.", "Watch for systemic hypotension, pulmonary vasoconstriction and RV failure during reversal.", STABLE_OFF, { hr: 80, pulseRate: 80 }, null, [COMPLICATIONS.protamine]),
        step("closure", "Closure", 174, "Wires, drains and closure", "Place pacing wires and drains, reassess the prosthesis and filling with chest approximation, then transfer.", "The final rhythm and mechanical result must remain stable after geometry changes with closure.", CLOSED, { hr: 84, pulseRate: 84 }, null, [COMPLICATIONS.tamponade])
      ]
    },
    mvr: {
      id: "mvr", short: "MVR", title: "Mitral valve replacement", patient: "Severe primary MR · dilated LV/LA · mild pulmonary hypertension",
      cpbStart: 50, clampStart: 58, clampEnd: 121, cpbEnd: 145,
      steps: [
        step("baseline", "Preparation", 0, "Severe-MR baseline", "Confirm mechanism/severity, LV/RV function, pulmonary pressure, repair feasibility and baseline rhythm with TEE.", "Chronic MR unloads the LV into the low-pressure atrium, so a preserved preoperative EF can overstate forward contractile reserve.", merge(BASE, { hr: 78, pulseRate: 79, sbp: 118, dbp: 64, map: 82, cvp: 11, etco2: 34, stII: 0, stV5: -0.1 }), null, "Record whether rhythm is sinus or AF; it changes filling and pulse interpretation.", [{
          id: "af-pulse-deficit", label: "AF with pulse deficit", severity: "urgent",
          action: "Assess haemodynamic stability and correct triggers; distinguish the ECG ventricular rate from mechanically perfusing beats.",
          physiology: "Irregular filling produces variable stroke volume. Early complexes may create an ECG QRS without a strong arterial upstroke, so pulse rate can be lower than electrical rate.",
          warning: "Treat the patient and perfusing rhythm, not the ECG number alone.",
          state: merge(BASE, { hr: 132, pulseRate: 106, rhythm: "af", sbp: 96, dbp: 58, map: 71, cvp: 15, etco2: 29, ppv: 0.12 })
        }]),
        step("sternotomy", "Exposure", 14, "Sternotomy and pericardiotomy", "Expose the aorta, right atrium and caval junctions.", "Avoid excessive tachycardia and preserve RV function in the presence of pulmonary vascular load.", STIMULUS, { hr: 94, pulseRate: 94, sbp: 144, dbp: 78, map: 100, cvp: 13, stV5: -0.3 }),
        step("heparin", "Cannulation", 32, "Heparin and ACT confirmation", "Anticoagulate fully before cannulation.", "Stable haemodynamics should be maintained while preparing bicaval isolation.", CALM, { hr: 76, pulseRate: 76, cvp: 11 }),
        step("cannulation", "Cannulation", 41, "Aortic and bicaval cannulation", "Cannulate the aorta and both cavae, place snares and verify drainage and line position.", "Bicaval control isolates the right heart for atrial access. Atrial manipulation can cause transient ectopy.", CANNULATED, { cvp: 11 }, null, [COMPLICATIONS.cannulationBleed, COMPLICATIONS.dissection]),
        step("cpb", "Bypass", 50, "Initiate CPB and snare the cavae", "Establish full flow, drain both cavae and stop ventilation after decompression.", "CVP and pulsatility fall; oxygenation is now managed by the oxygenator rather than inferred from a non-pulsatile finger signal.", CPB_BEATING, { temp: 34.1 }),
        step("arrest", "Bypass", 58, "Cross-clamp and cardioplegic arrest", "Clamp, arrest and protect the heart with appropriate venting.", "The electrically silent, decompressed heart permits left-atrial exposure while systemic perfusion remains pump dependent.", ARRESTED, { temp: 33.6 }),
        step("atriotomy", "Valve replacement", 68, "Open the left atrium", "Enter through Sondergaard's groove or the planned trans-septal route and expose the valve.", "The monitor stays in the arrested CPB state; exposure and atrial anatomy determine safety.", ARRESTED),
        step("inspect", "Valve replacement", 76, "Confirm replacement is required", "Inspect leaflets, annulus, chordae and papillary muscles and confirm that durable repair is not appropriate.", "Replacement should follow a deliberate valve decision rather than convenience.", ARRESTED, { temp: 33.3 }),
        step("posterior", "Valve replacement", 84, "Preserve posterior leaflet/chordae", "Retain posterior apparatus against the annulus to preserve annulo-ventricular continuity.", "Chordal preservation supports LV geometry and systolic function after the low-resistance MR pathway is removed.", ARRESTED, { temp: 33.1 }),
        step("anterior", "Valve replacement", 92, "Excise diseased anterior leaflet", "Remove only what is necessary and relocate usable chordae when feasible.", "Avoid creating LVOT obstruction while preserving ventricular support.", ARRESTED),
        step("annular", "Valve replacement", 101, "Place annular sutures", "Place circumferential pledgeted sutures, staying shallow posterolaterally near the circumflex artery.", "Circumflex injury may not declare itself until reperfusion, when lateral ST change and LV dysfunction appear.", ARRESTED, { temp: 33.5 }),
        step("seat", "Valve replacement", 109, "Size, orient and seat the prosthesis", "Parachute the valve and orient struts/posts away from the LVOT; confirm free occluder or leaflet motion.", "Correct orientation prevents prosthetic dysfunction and outflow obstruction.", ARRESTED, { temp: 34.3 }),
        step("close-deair", "Valve replacement", 116, "Close the atrium and de-air", "Close the atriotomy, ventilate, fill the heart and remove left-sided air under TEE while rewarming.", "Left atrial surgery creates substantial air risk; monitor signals cannot prove adequate de-airing.", REWARMING, { temp: 35.4, ventilation: 1, rr: 10, etco2: 5 }),
        step("unclamp", "Reperfusion", 121, "Release the cross-clamp", "Reperfuse while inspecting rhythm and regional wall motion.", "Electrical recovery occurs before pump flow is withdrawn.", REPERFUSION, null, "New lateral ST change after posterior annular suturing suggests circumflex compromise.", [{
          id: "circumflex-injury", label: "Circumflex injury", severity: "critical",
          action: "Return to support, call the lateral injury pattern, assess new lateral wall-motion abnormality and inspect/revascularize the circumflex mechanism.",
          physiology: "Circumflex compromise reduces lateral LV contraction, lowers output and produces ST elevation/depression in lateral leads such as V5 and aVL.",
          warning: "A new regional pattern after mitral annular work is a surgical coronary problem until proven otherwise.",
          state: merge(REPERFUSION, { hr: 104, stII: -0.5, stV5: 2.6, staVL: 2.0, cvp: 12 })
        }]),
        step("rhythm", "Reperfusion", 129, "Restore rhythm and assess pacing", "Treat reperfusion rhythm and use temporary pacing when rate or AV synchrony is inadequate.", "A junctional rhythm loses atrial contribution and can reduce output, particularly in a preload-sensitive post-bypass heart.", REPERFUSION, { hr: 72 }, null, [{
          id: "junctional", label: "Junctional rhythm / AV dyssynchrony", severity: "urgent",
          action: "Confirm atrial activity and wire function; use atrial or AV-sequential pacing when conduction and wires permit.",
          physiology: "Regular narrow ventricular activation without coordinated atrial contraction raises filling pressure and reduces stroke volume.",
          warning: "Electrical rate alone can look acceptable while AV synchrony is haemodynamically poor.",
          state: merge(REPERFUSION, { hr: 58, rhythm: "junctional", cvp: 17 })
        }, {
          id: "paced", label: "AV-sequential pacing restored", severity: "resolved",
          action: "Confirm electrical and mechanical capture and optimize AV timing against pressure and TEE filling.",
          physiology: "Coordinated atrial then ventricular activation restores filling and output.",
          warning: "Reassess intrinsic rhythm and thresholds; pacing settings are not set-and-forget.",
          state: merge(REPERFUSION, { hr: 82, rhythm: "paced", cvp: 11 })
        }]),
        step("separate", "Separation", 138, "Separate from bypass", "Resume full ventilation, fill judiciously and reduce pump flow while evaluating the new loading condition.", "After replacement, the LV ejects entirely into the higher-impedance aorta; previously hidden contractile dysfunction may appear as afterload mismatch.", SEPARATING, { hr: 88, pulseRate: 86, cvp: 13 }, null, [COMPLICATIONS.failSeparate, {
          id: "afterload-mismatch", label: "LV afterload mismatch", severity: "critical",
          action: "Return to support, confirm a competent/non-obstructive prosthesis, exclude circumflex injury and air, and support the LV based on TEE physiology.",
          physiology: "Eliminating MR removes the low-resistance atrial outlet, exposing impaired forward contractile reserve. Forward stroke volume and ETCO₂ fall despite a closed competent valve.",
          warning: "Do not assume all low output after MVR is simple hypovolaemia.",
          state: merge(SEPARATING, { hr: 112, pulseRate: 108, sbp: 76, dbp: 50, map: 59, cvp: 19, etco2: 22, ppv: 0.14 })
        }]),
        step("tee", "Assessment", 145, "TEE prosthesis and ventricular assessment", "Confirm prosthesis motion, gradient at the measured rate/flow, paravalvular leak, LVOT patency and biventricular function.", "TEE distinguishes valve obstruction, leak, LV/RV failure and regional ischemia that share similar surface numerics.", STABLE_OFF, { hr: 86, pulseRate: 86, cvp: 12 }),
        step("protamine", "Hemostasis", 153, "Protamine and decannulation", "Reverse heparin slowly, release snares, decannulate and inspect atrial and cannulation suture lines.", "Monitor for systemic/pulmonary reaction and ongoing surgical bleeding.", STABLE_OFF, { hr: 84, pulseRate: 84 }, null, [COMPLICATIONS.protamine]),
        step("closure", "Closure", 178, "Drains, wires and closure", "Place drains and wires, reassess filling and prosthesis function during sternal approximation, and transfer.", "A compressed or failing RV may first declare itself during closure with rising CVP and falling output.", CLOSED, { cvp: 11 }, null, [COMPLICATIONS.tamponade])
      ]
    },
    bentall: {
      id: "bentall", short: "Bentall", title: "Modified Bentall root replacement", patient: "Aortic-root aneurysm with severe AR · preserved biventricular function",
      cpbStart: 52, clampStart: 61, clampEnd: 148, cpbEnd: 174,
      steps: [
        step("baseline", "Preparation", 0, "Aneurysmal-root/AR baseline", "Confirm root dimensions, valve pathology, coronary origins, ventricular function and the arterial cannulation strategy with multimodality imaging.", "Severe AR creates a wide pulse pressure and low diastolic coronary perfusion pressure. Avoid bradycardia and abrupt afterload elevation.", merge(BASE, { hr: 88, pulseRate: 88, sbp: 146, dbp: 52, map: 83, cvp: 9, etco2: 34, stII: -0.1, stV5: -0.2 })),
        step("exposure", "Exposure", 16, "Sternotomy and root exposure", "Open the pericardium and expose the root and ascending aorta without injuring the aneurysmal wall.", "Maintain forward rate and coronary perfusion while preparing a safe inflow site.", STIMULUS, { hr: 96, pulseRate: 96, sbp: 164, dbp: 58, map: 94 }),
        step("heparin", "Cannulation", 34, "Heparin and ACT confirmation", "Anticoagulate fully and confirm the bypass/rescue plan before manipulating the aorta.", "No large monitor shift is expected from uncomplicated anticoagulation.", CALM, { hr: 84, pulseRate: 84, sbp: 138, dbp: 54, map: 82 }),
        step("cannulation", "Cannulation", 43, "Safe arterial inflow and venous cannulation", "Cannulate a verified safe ascending-aortic or alternative inflow site and the right atrium.", "Aneurysmal or dissected tissue raises the stakes of inflow selection; pressure alone cannot confirm true-lumen perfusion.", CANNULATED, { hr: 86, pulseRate: 86, sbp: 142, dbp: 56, map: 85 }, "Use TEE/epiaortic imaging to verify aortic integrity and cannula position.", [COMPLICATIONS.cannulationBleed, COMPLICATIONS.dissection]),
        step("cpb", "Bypass", 52, "Initiate CPB", "Establish full flow and decompression, then stop ventilation.", "Pressure becomes pump generated, CVP falls and pulsatile monitoring becomes invalid.", CPB_BEATING, { temp: 34.0 }),
        step("arrest", "Bypass", 61, "Cross-clamp and cardioplegia", "Clamp and arrest with a delivery strategy that accounts for aortic regurgitation and coronary anatomy.", "Direct ostial or retrograde delivery may be needed because severe AR can make root cardioplegia ineffective and distend the LV.", ARRESTED, { temp: 33.4 }),
        step("open-root", "Root replacement", 72, "Open the aneurysmal root", "Open the diseased ascending aorta and inspect root, leaflets and coronary ostia.", "The monitor remains fully pump dependent while anatomy drives the operation.", ARRESTED, { temp: 33.1 }),
        step("excise", "Root replacement", 82, "Excise diseased root and valve", "Remove the diseased wall to near the annulus and excise unsuitable native leaflets.", "Four future suture lines must ultimately be hemostatic: proximal, two buttons and distal.", ARRESTED, { temp: 32.9 }),
        step("buttons", "Root replacement", 92, "Mobilize coronary buttons", "Create left and right coronary buttons with enough tissue and mobility for a tension-free lie.", "Button geometry determines later coronary flow; monitor changes cannot appear until reperfusion.", ARRESTED),
        step("size", "Root replacement", 101, "Size the composite conduit", "Size the annulus and select the mechanical or biological valve-graft chosen preoperatively.", "The conduit must seat without obstruction or mismatch and accommodate button geometry.", ARRESTED, { temp: 33.2 }),
        step("proximal", "Root replacement", 112, "Implant the proximal valve-graft", "Secure the prosthetic valve component to the annulus with circumferential pledgeted sutures.", "Protect the conduction system and establish a hemostatic proximal line.", ARRESTED, { temp: 33.8 }),
        step("left-button", "Root replacement", 122, "Reimplant the left coronary button", "Cut the graft opening and sew the left button without twist, tension or redundancy.", "Left-main compromise can produce catastrophic global/LV ischemia after unclamping.", ARRESTED, { temp: 34.4 }),
        step("right-button", "Root replacement", 130, "Reimplant the right coronary button", "Sew the right button with correct height and rotational orientation.", "Right-button compromise commonly presents with inferior ST change, RV dysfunction and arrhythmia.", ARRESTED, { temp: 34.9 }),
        step("button-lie", "Root replacement", 135, "Inspect both button lies", "Check mobility, orientation and tension; use a Cabrol interposition only when direct implantation cannot lie safely.", "A technically perfect suture line can still obstruct if the reimplanted coronary kinks after filling.", REWARMING, { temp: 35.2 }),
        step("distal", "Root replacement", 141, "Complete the distal anastomosis", "Trim the graft and join it to the native ascending aorta or planned arch segment while rewarming.", "The distal line completes systemic continuity; inspect all lines as pressure is restored.", REWARMING, { temp: 35.6 }),
        step("deair", "Reperfusion", 145, "De-air the root and heart", "Ventilate, fill and remove intracardiac/root air under TEE before clamp release.", "Coronary buttons and the root are especially vulnerable to retained air.", REWARMING, { ventilation: 1, rr: 10, etco2: 5 }),
        step("unclamp", "Reperfusion", 148, "Release clamp and inspect four suture lines", "Reperfuse while increasing pressure gradually and inspect proximal, left-button, right-button and distal lines.", "Electrical activity returns while CPB still maintains systemic pressure. Bleeding and coronary flow must be assessed directly and with TEE.", REPERFUSION, null, "New ST change or ventricular arrhythmia demands immediate button assessment.", [COMPLICATIONS.vf, {
          id: "button-bleeding", label: "Coronary-button bleeding", severity: "urgent",
          action: "Maintain support, identify the exact button suture-line source, correct coagulopathy and repair persistent surgical bleeding.",
          physiology: "Blood loss and reduced reservoir volume can narrow systemic pressure while the pump initially masks the loss of native preload.",
          warning: "Persistent focal bleeding is surgical even when laboratory coagulopathy coexists.",
          state: merge(REPERFUSION, { sbp: 60, dbp: 54, map: 57, cvp: 2, temp: 35.7 })
        }]),
        step("rhythm", "Reperfusion", 157, "Restore a perfusing rhythm", "Treat reperfusion arrhythmia, correct electrolytes and test pacing wires while assessing regional wall motion.", "A rhythm can be electrically organized yet mechanically inadequate if a coronary button is compromised.", REPERFUSION, { hr: 82 }),
        step("separate", "Separation", 168, "Separate with TEE coronary assessment", "Reduce pump flow while confirming prosthetic valve function, biventricular function, implanted coronary flow and regional wall motion.", "Pulsatility, pleth and ETCO₂ should return together. Button kinking can evolve with filling and later with chest closure.", SEPARATING, { hr: 88, pulseRate: 86, cvp: 12 }, "Treat new regional ischemia as a mechanical button problem until proven otherwise.", [COMPLICATIONS.failSeparate, {
          id: "button-ischaemia", label: "Kinked right coronary button", severity: "critical",
          action: "Return to CPB support, call the inferior/RV pattern, evaluate button flow and revise the kink, twist or tension.",
          physiology: "Right-coronary obstruction impairs RV output, raises CVP, reduces LV filling and creates inferior injury with possible ventricular arrhythmia.",
          warning: "Inotrope alone cannot correct a mechanically obstructed coronary button.",
          state: merge(SEPARATING, { hr: 118, pulseRate: 96, rhythm: "vt", sbp: 76, dbp: 48, map: 57, cvp: 22, etco2: 21, stII: 2.8, stV5: -0.5, staVL: -1.6 })
        }]),
        step("post-tee", "Assessment", 174, "Post-bypass result", "Confirm valve function, gradients, button flow, regional motion, de-airing and aortic integrity after full separation.", "TEE assessment continues after bypass because coronary distortion can emerge as geometry changes.", STABLE_OFF, { hr: 86, pulseRate: 86, sbp: 110, dbp: 64, map: 79, cvp: 11 }),
        step("protamine", "Hemostasis", 184, "Protamine and four-line hemostasis", "Reverse heparin slowly and inspect the proximal, both button and distal suture lines systematically.", "Long bypass time and multiple lines produce both coagulopathic and surgical bleeding; the distinction requires inspection and targeted testing.", STABLE_OFF, { hr: 86, pulseRate: 86 }, null, [COMPLICATIONS.protamine]),
        step("closure", "Closure", 214, "Wires, drains and closure", "Place wires/drains and reassess button flow, wall motion and filling during sternal approximation before transfer.", "A button can kink and the RV can become compressed during closure even after an initially acceptable separation.", CLOSED, { hr: 90, pulseRate: 90 }, null, [COMPLICATIONS.tamponade])
      ]
    }
  };

  function allStates(caseItem) {
    const states = [];
    caseItem.steps.forEach(function (item) {
      states.push({ caseId: caseItem.id, stepId: item.id, state: item.state, branch: false, minute: item.minute });
      item.branches.forEach(function (branch) { states.push({ caseId: caseItem.id, stepId: item.id + ":" + branch.id, state: branch.state, branch: true, minute: item.minute }); });
    });
    return states;
  }

  window.CSORMonitorModel = Object.freeze({
    cases: CASES,
    mechanicalEvent: mechanicalEvent, arterialSample: arterialSample, plethSample: plethSample, cvpSample: cvpSample,
    requiredKeys: REQUIRED_KEYS.slice(),
    allStates: function () { return Object.keys(CASES).reduce(function (out, id) { return out.concat(allStates(CASES[id])); }, []); }
  });

  function esc(value) { return window.CSLab.esc(value); }
  function fmt(value, digits) { return Number.isFinite(value) ? Number(value).toFixed(digits == null ? 0 : digits) : "---"; }
  function clockText(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) return "—";
    return String(Math.floor(minutes / 60)).padStart(2, "0") + ":" + String(Math.round(minutes % 60)).padStart(2, "0");
  }
  function timerValue(caseItem, stepItem, start, end) {
    if (stepItem.minute < start) return null;
    return Math.max(0, Math.min(stepItem.minute, end) - start);
  }
  function gaussian(x, mean, spread) { const d = x - mean; return Math.exp(-(d * d) / (2 * spread * spread)); }
  function fraction(value) { return value - Math.floor(value); }

  function ecgObject(state) {
    const common = { rate: Math.max(20, state.hr || 60), atrialRate: Math.max(20, state.hr || 60), p: true, pDuration: 100, pr: 168, qrs: 92, qtc: 430, qrsAxis: 55, rhythm: "sinus", st: { II: state.stII, V5: state.stV5, aVL: state.staVL } };
    if (state.rhythm === "af") return merge(common, { rhythm: "af", p: false, atrialRate: 420, qrs: 94, pr: null });
    if (state.rhythm === "complete-block") return merge(common, { rhythm: "complete-block", rate: Math.max(20, state.hr), ventricularRate: Math.max(20, state.hr), atrialRate: 88, p: true, pr: null, qrs: 154, qrsAxis: -50 });
    if (state.rhythm === "paced") return merge(common, { rhythm: "ventricular-paced", paced: true, pacingRate: Math.max(20, state.hr), atrialRate: Math.max(72, state.hr), p: true, pr: null, qrs: 168, qrsAxis: -55 });
    if (state.rhythm === "vt") return merge(common, { rhythm: "vt", p: false, rate: Math.max(110, state.hr), atrialRate: null, pr: null, qrs: 176, qrsAxis: -135 });
    if (state.rhythm === "junctional") return merge(common, { rhythm: "sinus", p: false, pr: null, qrs: 96 });
    return common;
  }

  function ecgSample(state, lead, time) {
    if (state.rhythm === "arrest" || state.arrest > 0.72) return 0.002 * Math.sin(time * 17);
    if (state.rhythm === "vf") return 0.20 * Math.sin(time * 31.7) + 0.13 * Math.sin(time * 47.2 + 1.1) + 0.08 * Math.sin(time * 73.1 + 0.4);
    return ECG.sample(ecgObject(state), lead, time);
  }

  const mechanicalCache={key:'',from:0,to:0,events:[]};
  function mechanicalEvent(state,time){
    const key=state.rhythm+':'+Math.round(state.hr);
    if(key!==mechanicalCache.key||time<mechanicalCache.from||time>mechanicalCache.to){mechanicalCache.key=key;mechanicalCache.from=time-.1;mechanicalCache.to=time+1;mechanicalCache.events=ECG.events(ecgObject(state),time-3,time+3).qrs;}
    const beats=mechanicalCache.events;let event=null,next=null;
    for(let i=0;i<beats.length;i++){if(beats[i].time+.1<=time){event=beats[i];next=beats[i+1];}else break;}
    if(!event)return {phase:0,strength:0};const rr=next?next.time-event.time:60/Math.max(20,state.hr);
    const fraction=state.pulseRate/Math.max(1,state.hr),weak=state.rhythm==='af'&&((event.index*0.61803398875)%1+1)%1>fraction;
    return {phase:Math.max(0,(time-event.time-.1)/rr),strength:weak?.08:state.rhythm==='af'?Math.max(.5,Math.min(1.15,event.rr/(60/state.hr))):1};
  }
  function arterialSample(state, cardiacPhase, respiratoryPhase, time) {
    const mix = Math.max(0, 1 - state.cpb);
    if (!state.artValid) return 0;
    if (mix < 0.08) return state.map + 0.8 * Math.sin(cardiacPhase * Math.PI * 5.6);
    const event=mechanicalEvent(state,time==null?cardiacPhase*60/Math.max(20,state.hr):time);
    const p = event.phase;
    let shape;
    if (p < 0.04) shape = 0;
    else if (p < 0.18) shape = 0.5 - 0.5 * Math.cos(Math.PI * ((p - 0.04) / 0.14));
    else if (p < 0.34) shape = 1 - 0.42 * ((p - 0.18) / 0.16);
    else if (p < 0.41) shape = 0.58 - 0.16 * Math.sin(Math.PI * ((p - 0.34) / 0.07));
    else shape = 0.55 * Math.exp(-2.6 * ((p - 0.41) / 0.59));
    const swing = 1 - state.ppv * Math.sin(2 * Math.PI * respiratoryPhase);
    return state.dbp + (state.sbp - state.dbp) * shape * swing * event.strength;
  }

  function cvpSample(state, cardiacPhase, respiratoryPhase) {
    const p = fraction(cardiacPhase);
    const rhythmScale = state.rhythm === "af" ? 0 : state.rhythm === "junctional" ? 1.5 : 1;
    const a = 2.5 * gaussian(p, 0.28, 0.045) * rhythmScale;
    const c = 1.2 * gaussian(p, 0.47, 0.03);
    const vWave = 1.9 * gaussian(p, 0.82, 0.06);
    const resp = state.ventilation > 0.4 ? -1.25 * Math.sin(2 * Math.PI * respiratoryPhase) : 0;
    return state.cvp + a + c + vWave - 1.4 + resp;
  }

  function plethSample(state, cardiacPhase, respiratoryPhase, time) {
    if (state.pulseValid < 0.5 || state.spo2Valid < 0.5) return 0;
    const event=mechanicalEvent(state,(time==null?cardiacPhase*60/Math.max(20,state.hr):time)-.06);
    const p=event.phase;
    let shape;
    if (p < 0.04) shape = 0.02;
    else if (p < 0.24) shape = 0.5 - 0.5 * Math.cos(Math.PI * ((p - 0.04) / 0.2));
    else if (p < 0.42) shape = 1 - 0.35 * ((p - 0.24) / 0.18);
    else shape = 0.65 * Math.exp(-2.2 * ((p - 0.42) / 0.58));
    return 0.05 + shape * (1 - (0.1 + state.ppv * 0.65) * Math.sin(2 * Math.PI * respiratoryPhase)) * 0.9 * event.strength;
  }

  function co2Sample(state, respiratoryPhase) {
    if (state.ventilation < 0.5 || state.rr < 1) return 0;
    const p = fraction(respiratoryPhase), et = state.etco2, fi = state.fico2;
    if (p < 0.02) return fi;
    if (p < 0.08) return fi + (et * 0.93 - fi) * (0.5 - 0.5 * Math.cos(Math.PI * ((p - 0.02) / 0.06)));
    if (p < 0.62) return et * (0.93 + 0.07 * ((p - 0.08) / 0.54));
    if (p < 0.69) return fi + (et - fi) * (0.5 + 0.5 * Math.cos(Math.PI * ((p - 0.62) / 0.07)));
    return fi;
  }

  function monitorHTML() {
    const softkeys = ["Alarms Setup", "Monitor Setup", "Procedures", "Data & Pages", "Trends", "Print Waveforms"];
    return '<section class="or-monitor" aria-label="Live intraoperative physiologic monitor">' +
      '<div class="or-monitor-top"><div><b>FMCANES-OR7-9</b><b>CARDIAC</b></div><div class="or-monitor-icons" aria-hidden="true">♟　▣　⌘</div><time id="or-clock">9:02</time></div>' +
      '<div class="or-monitor-main">' +
        '<div class="or-wave-column">' +
          waveRow("ii", "II", "Monitor filter<br>Pacer off", "#38c95b", "ecg", '<i class="or-cal"></i><small>1 mV</small>') +
          waveRow("v5", "V5", "", "#38c95b", "ecg", '<i class="or-cal"></i>') +
          waveRow("art", "Art 1", "", "#d95b60", "pressure", '<span class="or-ticks"><i>160</i><i>80</i><i>0</i></span>') +
          waveRow("cvp", "CVP 3", "", "#4cc8ea", "cvp", '<span class="or-ticks"><i>30</i><i>15</i><i>0</i></span>') +
          waveRow("pleth", "Pleth", "", "#cccf55", "pleth", "") +
          waveRow("co2", "CO2", "", "#b8c2d6", "co2", '<span class="or-ticks two"><i>40</i><i>0</i></span>') +
        '</div>' +
        '<div class="or-numeric-column">' +
          '<div class="or-num-block or-hr"><div class="or-num-head"><span>HR</span><small>/min</small><span>ST</span></div><div class="or-hr-grid"><div><small class="green">ECG</small><b class="green" id="or-hr">83</b><small class="red">PR<br>Art 1</small><strong class="red" id="or-pr">86</strong></div><div><small>ST</small><b class="green" id="or-st-main">-0.2</b><small>mm (V5)</small></div></div></div>' +
          '<div class="or-num-block or-st"><div class="or-num-head"><span>ST</span><small>mm</small></div><div class="or-st-grid"><div><small class="green">II</small><b class="green" id="or-st-ii">-0.1</b></div><div><small class="blue">V5</small><b class="blue" id="or-st-v5">-0.2</b></div><div><small class="yellow">aVL</small><b class="yellow" id="or-st-avl">0.0</b></div><div><small class="green">V5</small><b class="green" id="or-st-v5b">-0.2</b></div></div></div>' +
          '<div class="or-num-block"><div class="or-num-head"><span>Art 1</span><small>mmHg</small></div><div class="or-art-number red"><b id="or-art">122/77</b><strong id="or-map">(96)</strong></div></div>' +
          '<div class="or-num-block"><div class="or-num-head"><span class="blue">CVP 3</span><small>mmHg</small></div><div class="or-cvp-number blue" id="or-cvp">(10)</div></div>' +
          '<div class="or-num-block"><div class="or-num-head"><span class="yellow">SpO2</span><small>%</small></div><div class="or-spo-number yellow"><span>∗<br>∗<br>∗</span><b id="or-spo2">100</b><small>PR<strong id="or-spo-pr">86</strong></small></div></div>' +
          '<div class="or-num-block or-co2-number"><div class="or-num-head"><span>CO2</span><small>mmHg</small><span>Apnea deact</span></div><div><span><small>ET</small><b id="or-etco2">33</b></span><span><small>FI</small><b id="or-fico2">1</b></span><span><small>RR</small><b id="or-rr">15</b></span></div></div>' +
          '<div class="or-gases"><div class="or-num-head"><span>Gases</span><small>%</small><span>Ext (A)</span></div><div class="or-gas-grid"><span></span><b>O2</b><b class="blue">N2O</b><b>AA</b><small>ET</small><strong id="or-eto2">93</strong><strong class="blue">0</strong><strong>---</strong><small>FI</small><strong id="or-fio2">99</strong><strong class="blue">0</strong><strong>---</strong></div><div class="or-num-head"><span>MAC</span><small>%</small><span>Ext (A)</span></div><div class="or-gas-grid"><span></span><b class="blue">N2O</b><b>AA</b><span></span><small>ET</small><strong class="blue">0</strong><strong>---</strong><span></span><small>FI</small><strong class="blue">0</strong><strong>---</strong><span></span></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="or-monitor-lower">' +
        '<div class="or-nibp"><div><span>NIBP　 mmHg　<b>Adult</b></span><small>SYS　　　　　　　　　DIA</small><strong id="or-nibp">--- / ---</strong><em id="or-nibp-map">(---)　 Manual</em></div></div>' +
        '<div class="or-temp"><span>T3　 <b>°C</b></span><small>T3</small><strong id="or-temp">35.3</strong></div>' +
        '<div class="or-lower-spacer"></div>' +
      '</div>' +
      '<div class="or-softkeys"><button type="button" class="or-home" data-or-home aria-label="Return to first case step">⌂</button>' + softkeys.map(function (label) { return '<button type="button" aria-disabled="true">' + label.replace(" ", "<br>") + '</button>'; }).join("") + '<button type="button" data-or-freeze>Freeze/<br>Snapshot</button><button type="button" data-or-nibp>NIBP<br>Start</button><button type="button" data-or-nibp>NIBP Auto<br>Start</button><button type="button" data-or-zero>Zero All<br>Pressures</button><button type="button" data-or-pacer>Pacer</button></div>' +
      '<div class="or-freeze-badge" id="or-freeze-badge" hidden>FROZEN</div><div class="or-zero-badge" id="or-zero-badge" hidden>ZEROING PRESSURES</div>' +
    '</section>';
  }

  function waveRow(id, label, sub, color, kind, overlay) {
    return '<div class="or-wave-row or-wave-' + kind + '" style="--trace:' + color + '"><canvas id="or-wave-' + id + '" aria-label="' + esc(label) + ' live waveform"></canvas><div class="or-wave-label"><b>' + label + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div><div class="or-wave-overlay">' + overlay + '</div></div>';
  }

  function selectorHTML() {
    return '<div class="or-case-strip" role="tablist" aria-label="Select operation">' + Object.keys(CASES).map(function (id) {
      const item = CASES[id];
      return '<button type="button" role="tab" data-or-case="' + id + '" aria-selected="' + (id === "cabg" ? "true" : "false") + '"><span>' + item.short + '</span><small>' + item.title + '</small></button>';
    }).join("") + '<div class="or-case-status"><i></i><span>LIVE PHYSIOLOGY</span></div></div>';
  }

  function railShellHTML() {
    return '<aside class="or-step-rail" aria-label="Operative timeline"><div id="or-rail"></div></aside>';
  }

  function renderRail(caseItem, selectedKey, progress) {
    const visited = progress.cases[caseItem.id] || [];
    const phases = [];
    caseItem.steps.forEach(function (item) { if (phases.indexOf(item.phase) < 0) phases.push(item.phase); });
    const selected = findSelection(caseItem, selectedKey);
    const current = selected.branch || selected.step;
    const cpb = timerValue(caseItem, selected.step, caseItem.cpbStart, caseItem.cpbEnd);
    const clamp = timerValue(caseItem, selected.step, caseItem.clampStart, caseItem.clampEnd);
    const index = caseItem.steps.indexOf(selected.step);
    const state = current.state;
    const monitorChange = monitorSummary(state);
    return '<div class="or-rail-head"><span class="or-rail-eyebrow">' + esc(caseItem.patient) + '</span><h2>' + esc(caseItem.title) + '</h2><div class="or-timers"><span><small>CASE</small><b>' + clockText(selected.step.minute) + '</b></span><span><small>CPB</small><b>' + (cpb == null ? "—" : clockText(cpb)) + '</b></span><span><small>X-CLAMP</small><b>' + (clamp == null ? "—" : clockText(clamp)) + '</b></span></div><div class="or-progress"><span style="width:' + Math.round(100 * visited.length / caseItem.steps.length) + '%"></span></div><small>' + visited.length + '/' + caseItem.steps.length + ' normal steps explored</small></div>' +
      '<div class="or-step-list">' + phases.map(function (phase) {
        return '<section><h3>' + esc(phase) + '</h3>' + caseItem.steps.filter(function (item) { return item.phase === phase; }).map(function (item) {
          const active = selected.step.id === item.id && !selected.branch;
          const done = visited.indexOf(item.id) >= 0;
          return '<button type="button" class="or-step ' + (active ? "active " : "") + (done ? "visited" : "") + '" data-or-step="' + item.id + '"><span>' + String(caseItem.steps.indexOf(item) + 1).padStart(2, "0") + '</span><b>' + esc(item.label) + '</b><small>' + clockText(item.minute) + '</small></button>' +
            (item.branches.length ? '<div class="or-branches">' + item.branches.map(function (branch) {
              const branchKey = item.id + ":" + branch.id;
              return '<button type="button" class="or-branch ' + (selectedKey === branchKey ? "active " : "") + (branch.severity === "resolved" ? "resolved" : "") + '" data-or-branch="' + branchKey + '"><span>!</span>' + esc(branch.label) + '</button>';
            }).join("") + '</div>' : '');
        }).join("") + '</section>';
      }).join("") + '</div>' +
      '<article class="or-step-detail ' + (selected.branch ? "is-complication" : "") + '"><div class="or-detail-kicker"><span>' + (selected.branch ? "COMPLICATION BRANCH" : "CURRENT STEP") + '</span><b>' + String(index + 1).padStart(2, "0") + '</b></div><h2>' + esc(current.label) + '</h2><section><h3>What happens</h3><p>' + esc(current.action) + '</p></section><section><h3>What the monitor should do</h3><p>' + esc(monitorChange) + '</p></section><section><h3>Why</h3><p>' + esc(current.physiology) + '</p></section>' + (current.warning ? '<aside><b>Red flag</b><p>' + esc(current.warning) + '</p></aside>' : '') + '<div class="or-detail-nav"><button type="button" data-or-prev ' + (index === 0 ? "disabled" : "") + '>← Previous</button><button type="button" data-or-next ' + (index === caseItem.steps.length - 1 ? "disabled" : "") + '>Next →</button></div></article>' +
      '<div class="or-source-note"><b>Representative teaching model</b><p>Targets illustrate coherent trends, not universal treatment thresholds. Pair monitor changes with the field, TEE, perfusion data and local protocol.</p></div>' +
      '<div class="sr-only" id="or-live-summary" aria-live="polite">' + esc(caseItem.short + ", " + current.label + ". " + monitorChange) + '</div>';
  }

  function findSelection(caseItem, key) {
    const parts = String(key || caseItem.steps[0].id).split(":");
    const selectedStep = caseItem.steps.find(function (item) { return item.id === parts[0]; }) || caseItem.steps[0];
    const selectedBranch = parts[1] ? selectedStep.branches.find(function (branch) { return branch.id === parts[1]; }) : null;
    return { step: selectedStep, branch: selectedBranch || null };
  }

  function monitorSummary(state) {
    const parts = [];
    if (state.rhythm === "arrest") parts.push("ECG electrically silent after cardioplegia");
    else if (state.rhythm === "vf") parts.push("chaotic ventricular-fibrillation ECG");
    else if (state.rhythm === "complete-block") parts.push("AV dissociation with a slow wide escape");
    else if (state.rhythm === "af") parts.push("irregular AF with a pulse deficit");
    else if (state.rhythm === "paced") parts.push("ventricular-paced complexes with mechanical capture");
    else if (state.rhythm === "vt") parts.push("broad ventricular tachycardia");
    else if (state.rhythm === "junctional") parts.push("regular junctional rhythm without coordinated P waves");
    else parts.push("sinus rhythm near " + fmt(state.hr) + "/min");
    if (state.cpb > 0.7) parts.push("pump-generated near-non-pulsatile arterial pressure around MAP " + fmt(state.map));
    else parts.push("arterial pressure about " + fmt(state.sbp) + "/" + fmt(state.dbp) + " (MAP " + fmt(state.map) + ")");
    parts.push("CVP " + fmt(state.cvp));
    parts.push(state.spo2Valid > 0.5 ? "SpO₂ " + fmt(state.spo2) + "% with pleth" : "pleth/SpO₂ invalid without pulsatile flow");
    parts.push(state.ventilation > 0.5 ? "ETCO₂ " + fmt(state.etco2) + " at RR " + fmt(state.rr) : "capnogram absent while ventilation is stopped");
    parts.push("temperature " + fmt(state.temp, 1) + "°C");
    return parts.join("; ") + ".";
  }

  function renderLab(ctx) {
    const primer = '<span class="eyebrow">OPERATIVE PHYSIOLOGY</span><h2>Follow the operation through the monitor</h2><p>Select a case, then move freely through cannulation, bypass, arrest, reperfusion, separation and closure. Open the red branches to see how a complication changes several signals at once.</p>';
    ctx.main().innerHTML = ctx.frame(ctx.lab, '<div class="orlab-shell">' + primer + selectorHTML() + '<div class="orlab-workspace"><div class="or-monitor-viewport">' + monitorHTML() + '</div>' + railShellHTML() + '</div></div>');

    let caseId = "cabg";
    let selectedKey = CASES[caseId].steps[0].id;
    let frozen = false;
    let zeroing = false;
    let nibp = null;
    let nibpTimer = 0, zeroTimer = 0;
    let raf = 0;
    let last = window.CSLab.clock().time;
    let uiAccumulator = 0;
    let clockTimer = 0;
    let progress = Store.get("or_monitor_progress", { cases: {} });
    if (!progress || typeof progress !== "object") progress = { cases: {} };
    if (!progress.cases || typeof progress.cases !== "object") progress.cases = {};

    let current = merge({}, CASES[caseId].steps[0].state);
    let target = merge({}, current);
    let targetRhythm = current.rhythm;
    const phase = { cardiac: 0, respiratory: 0, time: 0, x: 0, fraction: 0, width: 0 };
    const canvases = {};
    const channels = [
      { id: "ii", min: -1.6, max: 1.8, color: "#38c95b", sample: function (v, c, r, t) { return ecgSample(v, "II", t); } },
      { id: "v5", min: -1.6, max: 1.8, color: "#38c95b", sample: function (v, c, r, t) { return ecgSample(v, "V5", t); } },
      { id: "art", min: 0, max: 180, color: "#d95b60", sample: function (v, c, r, t) { return arterialSample(v, c, r, t); } },
      { id: "cvp", min: 0, max: 30, color: "#4cc8ea", sample: function (v, c, r) { return cvpSample(v, c, r); } },
      { id: "pleth", min: 0, max: 1.1, color: "#cccf55", sample: function (v, c, r, t) { return plethSample(v, c, r, t); } },
      { id: "co2", min: 0, max: 45, color: "#b8c2d6", sample: function (v, c, r) { return co2Sample(v, r); } }
    ];

    function markVisited(item) {
      const seen = Array.isArray(progress.cases[caseId]) ? progress.cases[caseId].slice() : [];
      if (seen.indexOf(item.id) < 0) seen.push(item.id);
      progress.cases[caseId] = seen;
      Store.set("or_monitor_progress", progress);
      const completed = Object.keys(CASES).filter(function (id) {
        const count = Array.isArray(progress.cases[id]) ? progress.cases[id].length : 0;
        return count >= CASES[id].steps.length;
      }).length;
      if (completed) ctx.complete(ctx.lab.id, completed, 4);
    }

    function selection() { return findSelection(CASES[caseId], selectedKey); }

    function setTarget(state) {
      target = merge({}, state);
      targetRhythm = state.rhythm;
      if (!frozen) current.rhythm = targetRhythm;
      if(window.CSLab.clock().paused){current=merge({},target);primeCanvases();}
      nibp = null;
      updateNumerics();
    }

    function chooseStep(key, shouldFocus) {
      const caseItem = CASES[caseId];
      const found = findSelection(caseItem, key);
      selectedKey = found.step.id + (found.branch ? ":" + found.branch.id : "");
      if (!found.branch) markVisited(found.step);
      setTarget((found.branch || found.step).state);
      drawRail();
      if (shouldFocus) {
        const selector = found.branch ? '[data-or-branch="' + selectedKey + '"]' : '[data-or-step="' + found.step.id + '"]';
        const button = document.querySelector(selector);
        if (button) button.focus({ preventScroll: true });
      }
    }

    function drawRail() {
      const rail = document.querySelector("#or-rail");
      if (!rail) return;
      rail.innerHTML = renderRail(CASES[caseId], selectedKey, progress);
      wireRail();
    }

    function wireRail() {
      document.querySelectorAll("[data-or-step]").forEach(function (button) { button.addEventListener("click", function () { chooseStep(button.dataset.orStep, false); }); });
      document.querySelectorAll("[data-or-branch]").forEach(function (button) { button.addEventListener("click", function () { chooseStep(button.dataset.orBranch, false); }); });
      const previous = document.querySelector("[data-or-prev]");
      const next = document.querySelector("[data-or-next]");
      if (previous) previous.addEventListener("click", function () { navigate(-1); });
      if (next) next.addEventListener("click", function () { navigate(1); });
    }

    function navigate(delta) {
      const caseItem = CASES[caseId], item = selection().step;
      const index = Math.max(0, Math.min(caseItem.steps.length - 1, caseItem.steps.indexOf(item) + delta));
      chooseStep(caseItem.steps[index].id, true);
    }

    function chooseCase(nextId) {
      if (!CASES[nextId]) return;
      caseId = nextId;
      selectedKey = CASES[caseId].steps[0].id;
      document.querySelectorAll("[data-or-case]").forEach(function (button) {
        const active = button.dataset.orCase === caseId;
        button.setAttribute("aria-selected", active ? "true" : "false");
      });
      chooseStep(selectedKey, false);
      document.querySelector(".or-step-rail").scrollTop = 0;
    }

    function setupCanvases() {
      channels.forEach(function (channel) {
        const canvas = document.querySelector("#or-wave-" + channel.id);
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(20, Math.round(rect.width * dpr));
        canvas.height = Math.max(20, Math.round(rect.height * dpr));
        const context = canvas.getContext("2d");
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, rect.width, rect.height);
        context.strokeStyle = channel.color;
        context.lineWidth = 1.35;
        context.lineJoin = "round";
        canvases[channel.id] = { canvas: canvas, context: context, width: rect.width, height: rect.height, lastX: null, lastY: null };
      });
      const first = canvases.ii;
      phase.width = first ? Math.floor(first.width) : 0;
      phase.x = 0;
      primeCanvases();
    }

    function primeCanvases() {
      if (phase.width < 2) return;
      const effectiveHr = Math.max(18, current.rhythm === "vf" ? 180 : current.hr || 60);
      const effectiveRr = Math.max(4, current.rr || 12);
      const seconds = 8 / phase.width;
      channels.forEach(function (channel) { if (canvases[channel.id]) { canvases[channel.id].lastX = null; canvases[channel.id].lastY = null; } });
      for (let x = 0; x < phase.width; x += 1) {
        phase.cardiac += seconds * effectiveHr / 60;
        phase.respiratory += seconds * effectiveRr / 60;
        phase.time += seconds;
        phase.x = x;
        channels.forEach(function (channel) { plotChannel(channel, x, x === 0); });
      }
      phase.x = phase.width - 1;
    }

    function plotChannel(channel, x, wrapped) {
      const store = canvases[channel.id];
      if (!store || store.width < 4) return;
      const value = channel.sample(current, phase.cardiac, phase.respiratory, phase.time);
      const normalized = (value - channel.min) / (channel.max - channel.min);
      const y = store.height - 3 - Math.max(-0.12, Math.min(1.12, normalized)) * (store.height - 6);
      const gap = Math.max(12, Math.floor(store.width * 0.018));
      store.context.clearRect(x + 1, 0, gap, store.height);
      if (wrapped || store.lastY == null) { store.lastX = x; store.lastY = y; return; }
      store.context.beginPath();
      store.context.moveTo(store.lastX, store.lastY);
      store.context.lineTo(x, y);
      store.context.stroke();
      store.lastX = x; store.lastY = y;
    }

    function updateNumerics() {
      function text(id, value) { const element = document.querySelector("#" + id); if (element) element.textContent = value; }
      const v = current;
      ctx.publish({"ECG rate (bpm)":Math.round(v.hr),"Pulse rate (bpm)":v.pulseValid>.5?Math.round(v.pulseRate):"No reliable pulse","MAP (mmHg)":Math.round(v.map),"CVP (mmHg)":Math.round(v.cvp),"Temperature (°C)":v.temp.toFixed(1),"Rhythm":v.rhythm});
      const pulseValid = v.pulseValid > 0.5;
      const spoValid = v.spo2Valid > 0.5;
      const artValid = v.artValid > 0.5;
      const arrested = v.rhythm === "arrest" || v.arrest > 0.72;
      text("or-hr", arrested || v.rhythm === "vf" ? "---" : fmt(v.hr));
      text("or-pr", pulseValid ? fmt(v.pulseRate) : "---");
      text("or-st-main", arrested || v.rhythm === "vf" || v.rhythm === "vt" ? "---" : fmt(v.stV5, 1));
      text("or-st-ii", arrested || v.rhythm === "vf" ? "---" : fmt(v.stII, 1));
      text("or-st-v5", arrested || v.rhythm === "vf" ? "---" : fmt(v.stV5, 1));
      text("or-st-v5b", arrested || v.rhythm === "vf" ? "---" : fmt(v.stV5, 1));
      text("or-st-avl", arrested || v.rhythm === "vf" ? "---" : fmt(v.staVL, 1));
      text("or-art", zeroing ? "0/0" : artValid ? fmt(v.sbp) + "/" + fmt(v.dbp) : "---/---");
      text("or-map", zeroing ? "(0)" : artValid ? "(" + fmt(v.map) + ")" : "(---)");
      text("or-cvp", zeroing ? "(0)" : "(" + fmt(v.cvp) + ")");
      text("or-spo2", spoValid ? fmt(v.spo2) : "---");
      text("or-spo-pr", pulseValid ? fmt(v.pulseRate) : "---");
      text("or-etco2", v.ventilation > 0.5 ? fmt(v.etco2) : "---");
      text("or-fico2", v.ventilation > 0.5 ? fmt(v.fico2) : "---");
      text("or-rr", v.ventilation > 0.5 ? fmt(v.rr) : "---");
      text("or-temp", fmt(v.temp, 1));
      text("or-eto2", fmt(v.etO2));
      text("or-fio2", fmt(v.fiO2));
      text("or-nibp", nibp ? nibp.sbp + " / " + nibp.dbp : "--- / ---");
      text("or-nibp-map", nibp ? "(" + nibp.map + ")　 Manual" : "(---)　 Manual");
    }

    function animate(now) {
      raf = requestAnimationFrame(animate);
      let dt = Math.min(0.12, Math.max(0, (now - last) / 1000));
      last = now;
      if (frozen) return;
      const ease = 1 - Math.exp(-dt / 2.4);
      NUMERIC_KEYS.forEach(function (key) { current[key] += (target[key] - current[key]) * ease; });
      current.rhythm = targetRhythm;
      const effectiveHr = Math.max(18, current.rhythm === "vf" ? 180 : current.hr || 60);
      const effectiveRr = Math.max(4, current.rr || 12);

      phase.fraction += (Math.max(1, phase.width) / 8) * dt;
      let steps = Math.min(400, Math.floor(phase.fraction));
      phase.fraction -= steps;
      for (let i = 0; i < steps; i += 1) {
        const seconds = 8 / Math.max(1, phase.width);
        phase.time += seconds;
        phase.cardiac += seconds * effectiveHr / 60;
        phase.respiratory += seconds * effectiveRr / 60;
        phase.x += 1;
        let wrapped = false;
        if (phase.x >= phase.width) { phase.x = 0; wrapped = true; }
        channels.forEach(function (channel) { plotChannel(channel, phase.x, wrapped); });
      }
      uiAccumulator += dt;
      if (uiAccumulator > 0.35) { uiAccumulator = 0; updateNumerics();updateClock(); }
    }

    function updateClock() {
      const date = new Date();
      const element = document.querySelector("#or-clock");
      if (element) element.textContent = date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");
    }

    document.querySelectorAll("[data-or-case]").forEach(function (button) { button.addEventListener("click", function () { chooseCase(button.dataset.orCase); }); });
    document.querySelector("[data-or-home]").addEventListener("click", function () { chooseStep(CASES[caseId].steps[0].id, true); });
    document.querySelector("[data-or-freeze]").addEventListener("click", function (event) {
      frozen = !frozen;
      event.currentTarget.classList.toggle("active", frozen);
      const badge = document.querySelector("#or-freeze-badge");
      if (badge) badge.hidden = !frozen;
      if (!frozen) current.rhythm = targetRhythm;
    });
    document.querySelectorAll("[data-or-nibp]").forEach(function (button) { button.addEventListener("click", function () {
      window.clearTimeout(nibpTimer);
      nibp = null; updateNumerics();
      button.classList.add("active");
      nibpTimer = window.setTimeout(function () {
        button.classList.remove("active");
        if (current.pulseValid > 0.5) nibp = { sbp: Math.round(current.sbp - 2), dbp: Math.round(current.dbp + 1), map: Math.round(current.map) };
        updateNumerics();
      }, 1300);
    }); });
    document.querySelector("[data-or-zero]").addEventListener("click", function () {
      zeroing = true; document.querySelector("#or-zero-badge").hidden = false; updateNumerics();
      window.clearTimeout(zeroTimer);
      zeroTimer = window.setTimeout(function () { zeroing = false; const badge = document.querySelector("#or-zero-badge"); if (badge) badge.hidden = true; updateNumerics(); }, 900);
    });
    document.querySelector("[data-or-pacer]").addEventListener("click", function () {
      const currentCase = CASES[caseId];
      const rhythmStep = currentCase.steps.find(function (item) { return item.id === "rhythm"; });
      if (rhythmStep) chooseStep(rhythmStep.id, true);
    });

    const resizeObserver = typeof ResizeObserver!=="undefined"?new ResizeObserver(setupCanvases):null;
    if(resizeObserver)resizeObserver.observe(document.querySelector(".or-wave-column"));else window.addEventListener("resize",setupCanvases);
    setupCanvases();
    drawRail();
    markVisited(CASES.cabg.steps[0]);
    drawRail();
    updateNumerics();
    updateClock();

    raf = requestAnimationFrame(animate);

    ctx.cleanup(function () {
      cancelAnimationFrame(raf);
      if(resizeObserver)resizeObserver.disconnect();else window.removeEventListener("resize",setupCanvases);
      window.clearTimeout(zeroTimer);
      window.clearInterval(clockTimer);
      window.clearTimeout(nibpTimer);
    });
  }

  window.CSLab.register({
    id: "or-monitor",
    code: "14",
    title: "Cardiac OR Monitor & Full-Case Physiology Lab",
    category: "Integrated operative physiology",
    minutes: 45,
    alwaysAvailable: true,
    flashcards: false,
    linkedDays: [],
    subtitle: "Follow CABG, AVR, MVR and Bentall operations through a live anesthesia monitor, from cannulation and bypass to reperfusion, separation, complications and closure.",
    objectives: [
      "Predict how ECG, arterial pressure, CVP, plethysmography and capnography change across CPB.",
      "Relate detailed CABG, AVR, MVR and Bentall operative milestones to the monitor.",
      "Distinguish expected bypass transitions from cannulation, rhythm, ischemic, protamine and tamponade emergencies.",
      "Use coupled monitor trends with TEE, perfusion data and the operative field rather than interpreting one number alone."
    ],
    sourceSections: [
      "2024 EACTS/EACTAIC/EBCP cardiopulmonary bypass guideline",
      "ASE intraoperative TEE surgical decision-making guideline",
      "2021 ACC/AHA/SCAI coronary revascularization guideline",
      "2020 ACC/AHA valvular heart disease guideline",
      "2022 ACC/AHA aortic disease guideline"
    ],
    teach: {
      concept: "The meaning of a signal changes as circulation moves from the native heart to the pump and back again. During full non-pulsatile CPB, arterial pressure remains a pump-flow signal while plethysmography and pulse-derived SpO₂ become invalid; ECG may persist until cardioplegic arrest, and capnography disappears when ventilation and pulmonary blood flow stop.",
      how: "Choose a case and predict each transition before selecting the next step. Read ECG, arterial pressure, CVP, pleth and capnogram together, then open optional red branches to compare an expected phase with a complication. Values are representative teaching profiles, not universal treatment targets.",
      equations: ["CPP ≈ aortic diastolic pressure − LVEDP", "CO = HR × SV", "MAP ≈ CVP + CO × SVR / 80"]
    },
    render: renderLab
  });
})();
