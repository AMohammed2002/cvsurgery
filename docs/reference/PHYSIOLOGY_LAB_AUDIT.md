# Physiology Lab Audit and Rebuild Record

## Executive diagnosis

The physiology curriculum had strong topic coverage but did not yet behave like a simulation center. Most labs rendered clinically themed forms around static illustrations. Learners could change numbers, but they were rarely required to operate a recognizable device, follow a continuously evolving signal, or distinguish a transient response from a captured diagnostic study. That gap made the labs feel easier to replace with a textbook page.

This rebuild uses four standards for every lab:

1. **Continuous physiology:** signals move, cycles progress, devices turn, and clot curves develop over time.
2. **Physical interaction:** machine variables use dials, switches, selectors, clamps, pump heads, and action buttons—not exposed browser sliders.
3. **Coupled consequences:** one action changes several related signals, alarms, and interpretations.
4. **Deliberate practice:** the learner predicts, operates, interprets, handles a fault or clinical command, and receives a mechanism-based debrief.

## Cross-lab problems identified

- Static ECG, pressure, Doppler, IABP, and viscoelastic traces conveyed no sweep speed, timing, beat-to-beat evolution, or monitor behavior.
- Controls had the visual language of a settings page. Range sliders were particularly damaging inside the CPB and pacing trainers.
- The CPB console lacked the physical hierarchy of a heart-lung machine: no convincing pump-head bank, reservoir/oxygenator relationship, tubing path, occluder logic, alarm stack, or separated gas, temperature, suction, and cardioplegia stations.
- Visuals frequently illustrated an answer after a number changed instead of functioning as the primary data source the learner must interpret.
- Alarm priority was weak. Advisory states, important cautions, and immediately dangerous faults looked too similar.
- Several labs had no obvious difference between live monitoring, paused review, and a diagnostic capture.
- The device and monitor styling was inconsistent between lab families, weakening transfer of learned interaction patterns.
- Presets were useful, but they could turn learning into label recognition unless paired with prediction and mechanism questions.
- Controls were densely stacked on narrow screens and lacked the spatial grouping found on real equipment.
- Animation lifecycle and reduced-motion behavior were not systematically handled when navigating between labs.
- Important variables were numerically coupled, but the physical circuit or anatomy producing that relationship was often invisible.
- Feedback emphasized calculated outputs more than trends, morphology, timing, and operational priorities.

## Lab-by-lab findings and target corrections

### 01 — Pressure-Volume and Ventricular Mechanics

**Problems:** The loop was a still snapshot; valve events were labeled but the learner could not see the cardiac cycle traverse them. Controls were generic sliders, and the relationship between instantaneous phase, loop geometry, and derived values was visually weak.

**Correction:** Add a continuously moving phase marker, rotary model controls, device-like readouts, and disease presets that visibly reshape the live loop while preserving prediction challenges.

### 02 — CPB Oxygen Delivery and Perfusion

**Problems:** This read as an equation dashboard rather than a perfusion circuit. Flow, hemoglobin, saturation, temperature, pressure, and demand changed numbers but did not feel physically connected to a patient, reservoir, pump, or oxygenator.

**Correction:** Add an animated venous-to-reservoir-to-pump-to-oxygenator-to-patient circuit, spinning pump head, moving blood lines, rotary controls, delivery gauge, extraction/SvO2 consequences, and pressure-without-flow failure states.

### 03 — Valve Hemodynamics

**Problems:** The orifice circle and solid vertical bar were too abstract to teach Doppler acquisition or spectral interpretation. The display did not sweep and could be mistaken for a decorative severity meter.

**Correction:** Present an animated spectral Doppler screen with scale, sweep cursor, changing envelope, en-face valve motion, coupled Bernoulli/continuity outputs, flow-state checks, and measurement-error presets.

### 04 — Post-bypass Shock

**Problems:** A decorative fixed waveform sat above numeric tiles. Interventions changed the model but the cockpit did not feel live, and the learner had limited visual support for trend recognition or alarm priority.

**Correction:** Use a continuously scrolling bedside trace, live-status hierarchy, rotary hemodynamic controls, phenotype presets, intervention response log, and coupled pressure/flow/filling-pressure consequences.

### 05 — ECG and Rhythm Interpretation

**Problems:** The original ECG was a still synthetic SVG. It did not scroll, lacked a believable monitor sweep, did not clearly implement 25/50 mm/s behavior, and made different rhythms feel like static diagrams rather than time-dependent electrical signals.

**Correction:** Rebuild it as a requestAnimationFrame-driven multi-lead monitor with fast continuous motion, selectable rhythm generators, rate/gain/speed controls, diagnostic freeze/capture, and morphology/rhythm challenges. Pausing must actually freeze the trace; resuming must continue it.

### 06 — Temporary Pacing

**Problems:** Pacing variables appeared as sliders and the interface did not resemble a temporary pulse generator. Capture, sensing, and timing were represented too weakly in the live signal.

**Correction:** Use rotary rate/output/sensitivity controls, chamber/mode selectors, generator status lights, and live atrial/ventricular traces that visibly demonstrate pacing spikes, capture, undersensing, oversensing, and loss of capture.

### 07 — CPB Console

**Problems:** The console was a flat dashboard made of range inputs. It lacked the topology, material language, and component grouping of a heart-lung machine. Important operational relationships—venous return, reservoir level, arterial pump, gas exchange, temperature, suction, venting, cardioplegia, pressure, and alarms—were insufficiently embodied.

**Correction:** Build a recognizable perfusion workstation with physical rotary knobs, occluders and toggles; a pump-head bank; animated tubing; reservoir and oxygenator; pressure, bubble, temperature and level alarms; gas blender; heater-cooler; suction/vent modules; cardioplegia module; and coupled failure states. Dials must support drag, wheel, and keyboard operation.

### 08 — CPB Surgery Mode

**Problems:** Surgery mode inherited the flat-console problem, so surgeon commands felt like quiz prompts adjacent to settings rather than tasks performed on a machine under pressure.

**Correction:** Run commands against the same physical console, require the correct sequence of machine actions, preserve evolving physiology and alarms between commands, and debrief both technical action and closed-loop communication.

### 09 — Cannulation Strategy

**Problems:** Strategy selection was present, but anatomy, line routing, drainage behavior, pressure consequences, and malposition/fault cues were not sufficiently physical or dynamic.

**Correction:** Strengthen animated venous/arterial routing, line color and flow direction, anatomy-specific drainage/pressure effects, cannula selection, vacuum/occlusion controls, malposition cues, and scenario-driven tradeoffs.

### 10 — Cardioplegia and Myocardial Protection

**Problems:** Delivery variables lacked a convincing cardioplegia station and visible distribution. Temperature, pressure, route, coronary pathology, redosing, LV distension, and electrical arrest needed clearer coupled consequences.

**Correction:** Add physical delivery controls and gauges, animated antegrade/retrograde distribution, myocardial temperature and arrest response, coronary-obstruction scenarios, redosing clock, and warnings for pressure, distension, inadequate distribution, and rewarming.

### 11 — IABP Timing

**Problems:** The arterial trace was static and controls were generic sliders. This undermined the entire purpose of a timing trainer because inflation and deflation must be judged against a moving cardiac cycle.

**Correction:** Generate a continuously moving arterial-pressure trace with balloon timing overlay, rotary timing/assist controls, beat markers, pause/review mode, and visible effects on diastolic augmentation and assisted end-diastolic pressure.

### 12 — TEG/ROTEM

**Problems:** The trace appeared fully formed rather than developing with time, making initiation, kinetics, clot strength, lysis, and treatment response look like labels on a finished picture.

**Correction:** Animate clot formation from the centerline outward, expose elapsed simulation time, add assay/sample controls and realistic selectors, and couple interventions to the evolving trace and parameter readouts.

## ECG physiologic-accuracy rebuild — 2026-07-11

The animated ECG shell was retained, but its waveform core was replaced after a physiology audit found that PR and QTc were display-only, QRS duration was not a true onset-to-offset interval, AF averaged the wrong ventricular rate, ventricular-paced cases suppressed independent atrial activity, alternate noncapture produced half the intended rate, VT was a continuous sinusoid, metabolic QRS widening was not rendered, and paper speed/gain labels were not calibrated to the grid.

The rebuilt lab now uses `js/physiology/ecg-engine.js` as a deterministic event-based signal model:

- Atrial depolarizations, ventricular depolarizations, and pacing stimuli have independent event clocks.
- PR, QRS, QT/JT, pacing latency, AF R–R variability, and capture patterns are explicit waveform fiducials.
- Limb leads are derived from two independent frontal-plane signals and satisfy Einthoven/Goldberger identities sample by sample.
- Precordial templates preserve sinus R-wave progression, LBBB/paced morphology, secondary ST–T discordance, injury-vector offsets, and representative hyperkalemic changes.
- QRS-to-J-point and ST-to-T transitions are continuous; VT repolarization cannot begin before QRS offset.
- The renderer maps seconds and millivolts through one physical transform. The 25/50 mm/s and 5/10/20 mm/mV settings now change the grid and signal together.
- The diagnostic capture uses a conventional 3 × 4 layout plus a continuous lead II strip, an explicit 1 mV calibration pulse, the actual frozen/live capture time, row clipping, responsive redraw, and keyboard-accessible horizontal paper review.
- Pacing stimulus artifacts are event-aware and lead-aware; failed stimuli are not followed by generated ventricular complexes.
- Freeze is a true stable frame, resume continues the same timeline, reduced-motion mode updates at a bounded cadence, and route/resize cleanup is guarded against removed canvases.

Regression gates are executable rather than substring-only: `tools/test-ecg-physiology.js` validates signal timing, rates, rhythm clocks, lead algebra, morphology, ST amplitude/continuity, and calibration; `tools/test-ecg-renderer.js` validates lead order, row clips, calibration-pulse geometry, pacing-marker polarity, and fractional-DPR backing-store stability. Both run from `tools/validate-physiology.js`.

The output remains a calibrated teaching model, not a clinical diagnostic tracing or a substitute for a patient ECG. Source contracts were taken from AHA/ACCF/HRS ECG standardization statements, ACC/AHA display standards, and the published PhysioNet ECGSYN timing model.

## Acceptance tests

- All 12 routes render without console errors or horizontal overflow at desktop and mobile widths.
- ECG paths change across animation frames, respond immediately to rhythm/rate/speed, freeze on pause, and resume cleanly.
- CPB console exposes no visible browser slider tracks. Primary machine settings appear as rotary dials, selectors, toggles, or occluders.
- CPB dial values can be changed by pointer drag, wheel, and keyboard; the physiological model updates from the same underlying control value.
- Navigating away cancels animation loops and does not leave duplicate timers or event work running.
- IABP motion makes inflation/deflation timing visually judgeable.
- TEG/ROTEM morphology visibly develops over simulated time.
- Presets and scenarios change multiple coherent signals, not only a label or isolated number.
- Reduced-motion preferences stop nonessential decorative movement while preserving readable simulation state.
- Keyboard focus is visible, controls have accessible names/values, and diagnostic displays have text-equivalent interpretation.
