# LEVEL_RUBRIC.md — the frozen calibration standard

**Purpose.** This is the single sheet every content author (human or agent) keeps open while
writing a day. It is the product of Sequence 1 of `DAY_CONTENT_UPGRADE_PLAN.md`. It exists for one
reason: the previous upgrade pass was rejected because the level bar was set **two rungs too low and
every rung was mislabeled.** Read this file before writing a single sentence of any day, and re-read
it at the start of every day — calibration is *not* durable across days; the drift back toward the
"interested medical student" level is silent and happens precisely when you feel confident.

**The one-sentence standard to keep on the wall.**

> If a strong, interested fourth-year medical student could say your "PGY-5" sentence after reading
> one good textbook chapter, it is **not** a PGY-5 sentence — the real one sits two levels above it,
> in operative judgment, quantitative intraoperative reasoning, trial-design command, or the dosed
> management of a rare lethal event.

Everything below exists to enforce that sentence.

---

## PART A — THE FOUR FAILURE TELLS (how the rejected pass failed; how *this* pass will fail if calibration drifts)

`validate-depth.js` is built to detect the structural signature of exactly these. If a day exhibits
any of them in its Level-4/5 layers, it is the rejected pass wearing new prose, and it goes back.

1. **The naked number.** A threshold stated without its conditions or exceptions — "severe AS is a
   mean gradient ≥ 40 mmHg," full stop. A senior never holds a threshold as a bare fact; they hold
   it as a *flow-dependent relationship* with the discordant cases and the resolving test attached.
   A day full of naked numbers is a flashcard deck wearing a lab coat.
   → **The fix:** every quantitative item carries **number + condition + exception + resolver** (the
   four-part rule, Part D below).

2. **The name-drop trial.** A landmark study invoked by name and one-line conclusion — "FREEDOM
   showed CABG is better in diabetics" — with none of the design, effect size, tradeoff, or
   criticism that lets a senior *use* the trial to defend a decision against someone arguing the
   other side. A name is recall; a defended trial is Level 5.
   → **The fix:** every L4/5 trial carries population · comparison · endpoint-as-defined · effect
   (direction + rough magnitude) · principal tradeoff · one limitation/criticism · guideline effect.

3. **The sewn-in valve.** An operation *summarized* rather than *narrated* — "the valve is excised
   and the prosthesis is sewn in." That is a Level-1 sentence. The senior narrates the
   decalcification without perforating the annulus, the suture technique and where it must avoid the
   conduction axis, the sizing decision and the mismatch it prevents, the de-airing ritual, and the
   three things that can go wrong *at that step* with their rescues.
   → **The fix:** operations are narratable 14–20 steps with tissue planes, sutures by type, target
   numbers, and the three likeliest complications mapped to the step where they arise, each with a
   rescue.

4. **The complication as a noun.** Listing "heart block, paravalvular leak, coronary obstruction" as
   risks without the recognition pattern, the intraoperative decision that prevents each, and the
   dosed algorithm that rescues it when it happens anyway. A senior does not have a *list* of
   complications; they have a *response* to each.
   → **The fix:** every named complication carries recognition → prevention → dosed rescue.

---

## PART B — THE BEFORE / AFTER (the shape of a real fix)

Every day's mastery layer should read like the "after," not the "before."

**Rejected ("PGY-5") version, Day 8 (Valve Surgery):**
> "Know that patient-prosthesis mismatch is a risk of aortic valve replacement and that a larger
> valve is better."

**Target Level-5 version, Day 8:**
> "Predict patient-prosthesis mismatch before the incision from the indexed effective orifice area
> the chosen prosthesis will deliver for this patient's body surface area — moderate mismatch below
> roughly 0.85 cm²/m² and severe below roughly 0.65 cm²/m² — recognize that mismatch matters most in
> the small, active, or low-EF patient, and know the intraoperative decision tree when the annulus
> measures smaller than the valve you sized for: accept the mismatch, choose a supra-annular or a
> modern externally-mounted leaflet valve to buy an effective-orifice size, or perform an annular
> enlargement (Nicks / Manouguian posterior enlargement, or aortoventriculoplasty for the truly
> small root) — and defend which of those you would do in a 62-year-old active patient with a 19 mm
> annulus, against an examiner arguing you should just have placed the smaller valve and moved on."

What changed: the naked risk became a *quantified prediction* with the index and its thresholds; the
"bigger is better" folk rule became a *named set of technical options* with the anatomy that selects
among them; and the whole thing became a *defended decision under adversarial questioning.* That is
the two-rung climb, made concrete.

**The test to run on every "PGY-5" sentence you write:** *"Could a well-read fourth-year say this
after one chapter?"* If yes → it is a foundation objective, and the real PGY-5 objective sits two
levels above it.

---

## PART C — THE FIVE-LEVEL LADDER

Every day must span this ladder — a genuine Level-1 entry to a genuine Level-5 exit. Author to the
top first, then build the on-ramp down. Every authored item is tagged with exactly one `level`.

**Level 1 — Medical student, novice (the honest entry point).** Finished pre-clinical cardiology.
Names chambers, valves, great vessels; knows systole from diastole; recognizes "stenosis,"
"regurgitation," "ischemia," "bypass," "ejection fraction"; reads a normal vs grossly abnormal ECG;
has never seen a sternotomy. Learns by narrative, analogy, one clean diagram at a time. **Each day
must start here. Do not skip it — the on-ramp is what makes the climb credible.**

**Level 2 — Sub-intern / PGY-1 intern (floor and orders competence).** Pre-rounds, collects and
presents post-op data, writes the routine order set, manages chest tubes / pacing wires / lines /
drains and removes them, doses the common drips at a starting rate, recognizes the sick patient and
escalates, first-assists (retract, cut suture, follow the case, harvest vein under supervision).
Does **not** yet make operative decisions or run a crisis alone.

**Level 3 — Junior resident (PGY-2 → early PGY-3; conceptual operative fluency).** Understands
operative flow of the common cases, performs defined portions (open/close, cannulate, come off bypass
with the attending's hand nearby). Reasons the physiology conceptually *and* quantitatively at the
level of "why," knows guideline indications and headline trials by name and conclusion, runs a
routine ICU, recognizes common complications early. Can teach a student. Still needs the attending
for the hard intraoperative call and the rare crisis.

**Level 4 — Senior resident (PGY-4 → PGY-5; near-independent judgment).** Runs the routine major
cases as operating surgeon under supervision, makes and states the intraoperative decisions, modifies
technique for difficult anatomy, anticipates and manages the intraoperative complication *before it
declares*, runs the unit including the deteriorating patient, commands the evidence at trial-design /
subgroup / criticism level. Teaches juniors. **This is the working definition of "senior resident
competence" — and it is largely absent in the current app; it is the bulk of the new writing.**

**Level 5 — PGY-5 exit / chief / early fellow (the target ceiling of every day).** The near-graduate.
Narrates and reasons the operation as though about to do it as primary surgeon: exposure, tissue
planes, specific sutures and bite depths, sizing, bailouts, conversions, intraoperative surprises and
their rescues. Reasons in curves and equations, not sentences — *derives* the physiology rather than
recalling it. Commands the evidence to enrollment criteria, endpoint definitions, absolute vs relative
effect sizes, safety tradeoffs, follow-up limitations, and the live controversies and how they moved
the guidelines. Manages the rare lethal events with a specific, ordered, **dosed** algorithm. Knows
when **not** to operate, when to abort, when to convert. Defends every decision three levels deep
(mechanism → evidence → exception) under adversarial questioning, and teaches all of it.

**The through-line across every worked ladder below: the Level-5 rung is never a *fact* — it is a
*defended decision under adversarial questioning, grounded in mechanism, evidence at design level,
and the exception.* Author every day's mastery layer to that rung.**

---

## PART D — THE FOUR-PART QUANTITATIVE RULE (the countermeasure to the naked number)

A quantitative item is not complete until it carries all four of:

1. **the number** — the threshold, dose, pressure, flow, time, or size;
2. **the condition** — under which the number holds;
3. **the exception** — that breaks it;
4. **the resolver** — the test or maneuver that resolves the exception.

*Worked example (FFR):* "FFR ≤ 0.80 defines a physiologically significant stenosis" is **one
quarter** of an item. The complete item also carries the *condition* (measured at maximal hyperemia,
so adenosine or an equivalent must be on board and adequate), the *exception* (microvascular disease
and severe LVH uncouple FFR from the epicardial lesion; iFR offers a hyperemia-free alternative near a
0.89 cutoff), and the *resolver* (if the hyperemic response is doubtful, confirm with iFR or repeat
with a documented adequate hyperemic stimulus).

Every quantitative flashcard and MCQ you write must be reducible to that four-part shape, and is
tagged `kind: "quantitative"` with a populated `quant` object. `validate-depth.js` counts four-part
items and fails a day whose quantitative items are mostly one-part naked numbers.

---

## PART E — THE FIVE WORKED CALIBRATION LADDERS (the anti-underestimation vaccine)

Study these until the two-rung gap is reflexive. Ladders A and B are from Part 1 of the plan; C, D,
and E are from Appendix A. Every author reads all five *before writing a word.*

### Ladder A (anatomy / technique) — "Complete heart block after aortic valve replacement"

- **L1 (med student):** "The heart's electrical wiring can be bruised during valve surgery, and the
  patient may need a pacemaker for a while."
- **L2 (intern):** Recognizes the new wide-complex escape or AV dissociation on the monitor, connects
  the epicardial wires and sets a safe backup mode and rate, checks capture and sensing thresholds
  each shift, keeps the patient paced and AV-synchronous, orders the EP/PPM consult, manages the
  practical logistics (isolation of the pacing box, anticoagulation implications).
- **L3 (junior):** Knows the incidence after isolated SAVR (~3–7%, higher with heavy annular
  calcification, pre-existing RBBB, a small or bicuspid annulus, endocarditis with root abscess), the
  anatomic mechanism at tissue level, and that intraoperative block may be transient from edema and
  may recover over days — hence the observation window before a permanent device.
- **L4 (senior):** Intraoperatively chooses suture technique to stay off the conduction axis —
  respects the nadir of the non-/right-coronary commissure and the membranous septum, controls the
  depth and angle of the subannular bites, decalcifies the septal annulus without gouging. Predicts
  pre-operatively which patient is high-risk and counsels them about PPM likelihood. Manages the paced
  patient's hemodynamics knowing the stiff, hypertrophied, previously pressure-overloaded LV is
  exquisitely preload- and AV-synchrony-dependent, so ventricular-only pacing that loses atrial kick
  can drop cardiac output sharply.
- **L5 (PGY-5 exit):** All of the above, plus command of the *decision architecture*: the specific
  conduction patterns and their recovery probabilities; the evidence-informed timing of PPM
  implantation (a typical ~5–7 day observation window for potentially recoverable block, weighed
  against the cost of prolonged temporary pacing); the comparison to the TAVR conduction literature —
  PPM rate markedly higher and device-dependent (~6.5% at 30 days for the balloon-expandable valve in
  PARTNER 3 vs ~20–27% for the supra-annular self-expanding valve in Evolut Low Risk) and how that
  higher TAVR pacemaker burden informs a lifetime-management conversation with a borderline
  SAVR-vs-TAVR candidate; the technical choice of pacing system in a patient who will also need
  durable AV synchrony; and the ability to teach the whole chain — anatomy, technique, recovery
  biology, device decision — to a junior and defend it to an examiner.

*The rejected pass's "PGY-5" objective for this topic sat at L3 at best. That is the two-rung error.*

### Ladder B (evidence / operation) — "Conduit choice in CABG"

- **L1:** "Surgeons use spare blood vessels — often a leg vein or a chest artery — to bypass the
  blockage."
- **L2:** Harvests the saphenous vein and preps conduit on the back table under supervision; knows the
  LIMA is the "best" graft and goes to the LAD; performs the Allen's test before radial harvest.
- **L3:** Knows LIMA-to-LAD patency exceeds ~90% at 10 years and drives the survival benefit; knows
  radial and BIMA are additional arterial options; can name RADIAL, ART, and the on/off-pump trials
  by conclusion.
- **L4:** Chooses the conduit strategy for the specific patient and target — assesses target quality
  and runoff, weighs radial vs vein against the severity of the target stenosis (competitive-flow risk
  in a moderate lesion), factors the sternal-wound risk of BIMA in the diabetic or obese patient, and
  handles the conduit technically (skeletonized vs pedicled harvest, spasm prophylaxis, no-touch vein).
- **L5:** Designs the complete revascularization for the anatomy in front of them and defends it
  against the alternatives with the trial evidence *at design level* — the ART trial's
  intention-to-treat–negative result at 10 years (no BIMA survival benefit, HR ≈ 0.96) and *why* it
  may be negative (~40% crossover from bilateral to single grafting, 22% radial use diluting the
  comparison, high background GDMT), so that BIMA is defended on the mechanistic patency argument and
  the as-treated signal rather than on an intention-to-treat result that does not exist; the RADIAL
  pooled analysis showing the radial graft's advantage over vein driven by fewer repeat
  revascularizations and better patency; the competitive-flow physiology that makes an arterial graft
  to a *moderately* stenosed vessel a worse choice than a vein; the inflow decisions (in-situ vs free,
  composite Y/T grafts, single vs double aortic clamp); the anastomotic geometry that determines
  patency; and the individualized lifetime-graft plan for a 52-year-old vs a 78-year-old. Knows when
  off-pump or a hybrid approach genuinely changes the calculus and when it is dogma.

### Ladder C (physiology) — "Why the ejection fraction misleads in mitral regurgitation"

- **L1 (med student):** "A leaky mitral valve lets blood go backward, so the heart has to pump more."
  Recognizes the holosystolic murmur radiating to the axilla; knows MR causes volume overload.
- **L2 (intern):** Knows that in chronic MR the EF is often reported as "preserved" or even high, and
  the patient can still be in trouble; presents the echo report and flags a dilating ventricle.
- **L3 (junior):** Explains *why* EF over-reads systolic function: the regurgitant orifice is a
  low-impedance path, so the ventricle unloads part of its stroke volume backward into the
  low-pressure LA during systole. Total (angiographic) stroke volume is large, so EF looks fine, but
  the *forward* (effective) stroke volume — what reaches the body — is falling. Knows the
  operative-window triggers therefore rely on chamber size and LV end-systolic dimension, not EF
  alone, and that an EF drifting toward 60% in severe primary MR already signals contractile injury
  (hence LVEF ≤ 60% and LVESD ≥ 40 mm triggers).
- **L4 (senior):** Reasons it on the pressure-volume loop: MR abolishes true isovolumic contraction
  because the mitral valve is incompetent from the moment LV pressure rises, so the loop loses its
  vertical left border and shifts leftward as the LV empties into the LA before the aortic valve
  opens. Afterload is deceptively low (the LV ejects part of its volume against LA pressure, not
  aortic pressure), which flatters both EF and apparent contractility; correcting the MR *raises*
  afterload and can unmask a weak ventricle post-repair. Uses this to counsel that a "normal" pre-op
  EF does not guarantee a normal EF after the leak is closed, and to set the operate-early threshold
  in asymptomatic severe primary MR with repairable anatomy.
- **L5 (PGY-5 exit):** Integrates the loop physiology into the operative and peri-operative plan:
  predicts the post-repair afterload-mismatch drop in EF and pre-positions inotropic and
  afterload-reducing support; distinguishes this primary-MR physiology from secondary/functional MR
  where the ventricle is the primary problem and closing the valve does not fix the pump (the
  COAPT-vs-MITRA-FR reconciliation, disproportionate vs proportionate MR); recognizes on the
  post-bypass TEE the difference between a competent repair with a transiently stunned ventricle and a
  failing repair, and defends the decision to accept, revise, or replace. Can derive the whole chain —
  regurgitant fraction, effective vs total stroke volume, loop geometry, the afterload transfer at
  repair — at a whiteboard for a junior and defend the timing of surgery to an examiner three levels
  deep.

### Ladder D (critical care) — "The hypotensive patient two hours out from bypass"

- **L1 (med student):** "Their blood pressure is low; they might be bleeding or the heart might be
  weak; call for help." Knows the vital signs and that this is an emergency.
- **L2 (intern):** Runs the immediate reflex — check the arterial line and cuff for accuracy, look at
  the CVP and chest-tube output, ensure the pacing wires are capturing and AV-synchronous, give a
  small fluid bolus, escalate. Starts a pressor at a starting dose and calls the values out.
- **L3 (junior):** Frames it as the ordered low-cardiac-output differential — preload, afterload,
  contractility, rate/rhythm, tamponade, ischemia, mechanical — and reads the Swan-Ganz profile to
  localize it (low CVP/PCWP + low CI = hypovolemia; high filling pressures + low CI = pump failure;
  low SVR + high CI = vasoplegia; equalized diastolic pressures = tamponade). Titrates the appropriate
  agent to the identified problem rather than reflexively.
- **L4 (senior):** Recognizes the *mixed* and the *deceptive* pictures: the localized posterior clot
  that tamponades with chest tubes that have suddenly gone quiet and an echo that can look
  unimpressive; the RV failure with a high CVP but an underfilled LV; the post-CPB vasoplegia that
  mimics hypovolemia until the SVR is measured. Executes the vasoplegia escalation ladder with
  mechanism (norepinephrine → vasopressin → methylene blue → hydroxocobalamin → angiotensin II) and
  knows when a Swan is misleading rather than diagnostic. Decides when the answer is volume and when
  volume is the trap.
- **L5 (PGY-5 exit):** Makes and owns the reopen-the-chest-at-the-bedside decision — the specific
  triggers (sudden drop in previously brisk drainage with rising and converging filling pressures and
  falling CI, refractory to the algorithm), the sterile bedside reopening, and the judgment to do it
  *before* arrest rather than after; distinguishes at the bedside, under a mixed and evolving trace,
  tamponade from RV failure from vasoplegia from surgical bleeding and acts on the leading diagnosis
  while hedging the others; escalates to mechanical support at the right rung when the pump is the
  problem; and debriefs the team on which signals were discriminating and which were noise.
  Viva-grade: can defend the reopen decision, or the decision *not* to reopen, against an examiner
  pushing both ways.

### Ladder E (evidence) — "TAVR versus SAVR in the low-risk 65-year-old"

- **L1 (med student):** "TAVR replaces the valve with a catheter instead of open surgery; it avoids a
  big incision." Knows TAVR exists and is less invasive.
- **L2 (intern):** Knows TAVR was first for high-risk/inoperable patients and has expanded to lower
  risk; presents the patient's STS score and the Heart Team's plan.
- **L3 (junior):** Names PARTNER 3 and Evolut Low Risk and their headline conclusion (TAVR
  non-inferior — and on some short-term composites favorable — to SAVR in selected low-risk patients),
  and knows the durability and lifetime-management arguments that keep SAVR in play for the young.
- **L4 (senior):** Commands the trials at design level — the enrollment criteria (age skew with a mean
  in the early-to-mid 70s even in the "low-risk" trials, so the data are thin for a *true* 65-year-old;
  bicuspid excluded; anatomic CT screening), the primary endpoint *as composited*
  (death/stroke/rehospitalization) and its follow-up horizon (short-term composites do not settle
  10–15-year durability), the device-dependent pacemaker rate and the paravalvular-leak and
  valve-thrombosis tradeoffs of TAVR at 5 years, and the coronary-access and valve-in-valve
  consequences of putting a transcatheter valve in first. Uses this to frame a genuine
  lifetime-management conversation rather than defaulting to "less invasive is better."
- **L5 (PGY-5 exit):** Individualizes and defends the decision for *this* 65-year-old against
  adversarial questioning: weighs the durability uncertainty and the future re-intervention pathway
  (TAVR-in-TAVR feasibility, coronary re-access after a supra-annular device, the annular anatomy that
  forecloses options), the bicuspid and small-annulus caveats the trials excluded, the pacemaker and
  PVL burden against the sternotomy and its recovery, and the patient's own values — and can argue the
  *opposite* choice equally well, because at this level the answer is "it depends, and here is exactly
  on what." Knows where each trial is vulnerable and what the next generation of evidence still has to
  prove.

**The through-line across all five ladders (A–E):** the Level-5 rung is never a *fact* — it is a
*defended decision under adversarial questioning, grounded in mechanism, evidence at design level,
and the exception.* Author every day's mastery layer to that rung.

---

## PART F — THE AUTHORING DISCIPLINE (write top-down)

For **every** topic on **every** day: write the Level-5 objective **first** — the real one, the one
that would survive a viva — then build the on-ramp *downward* to Level 1 beneath it. The content
between them is the day. Writing bottom-up makes you stop when you run out of easy material, which is
exactly the interested-student level. Writing from the L5 objective down forces every lower layer to
*serve the summit.*

If you cannot articulate a genuine Level-5 objective for a topic, you do not understand it well
enough to teach it — go read the source (`cardiac_surgery_guide_v3.pdf`, the primer, the current
2020 VHD / 2021 revascularization / 2022 aortic guidelines, the primary trial literature, and
Appendix C of the plan) *before* drafting anything. See Part 5 of `DAY_CONTENT_UPGRADE_PLAN.md` for
the full authoring workflow, and each day's competency map (`COMPETENCY_MAPS/DAY_NN_*.md`) for the
concrete floors that day is audited against.
