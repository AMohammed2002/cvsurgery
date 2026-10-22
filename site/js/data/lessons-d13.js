window.LESSONS = window.LESSONS || {};

window.LESSONS["d13-lcos"] = {
  id: "d13-lcos",
  day: 13,
  ord: 1,
  title: "Cardiac ICU: Hemodynamics & Low-Output Syndrome",
  short: "LCOS",
  minutes: 20,
  chunks: [
    {
      title: "The First Hour in the ICU",
      html: `<p>The transition from the operating room to the cardiac surgery ICU is one of the highest-risk periods in the entire post-operative course. Rewarming continues, anesthetic agents wear off, multiple infusions are being titrated simultaneously, and any surgical complication that was subclinical in the controlled OR environment can declare itself the moment the patient is moved and re-monitored. A structured handoff exists specifically to prevent information loss at exactly the moment information matters most.</p>
<p>The standard cardiac surgery handoff follows an SBAR structure: Situation (procedure performed, CPB and cross-clamp times, number of grafts or valves, any intraoperative complications such as difficult weaning or significant bleeding); Background (pre-operative EF, valve disease, coronary anatomy, comorbidities); Assessment (current rhythm, HR, MAP, CVP, PA pressures and CI if a PA catheter is in place, vasoactive infusions and doses, ventilator settings, pacing status, temperature, most recent labs and ABG, chest tube output); and Recommendations (anticipated needs — electrolyte repletion, warming, blood products, pacing adjustments, extubation timing).</p>
<p>Underlying every handoff item is a single goal that Cohn states plainly: maintain adequate oxygen delivery to vital tissues in a way that avoids unnecessary demand on a heart recovering from bypass, ischemia, and surgery. That translates into reasonable minimum targets for most patients — a mixed venous saturation (MVO₂) around 60%, a MAP above 65 mmHg, and a cardiac index above 2 L/min/m² — which are then individualized: a patient with long-standing hypertension or peripheral vascular disease is run at a higher pressure, while a patient who is bleeding or has suture lines in fragile tissue is kept deliberately tighter. Note what is <em>not</em> a goal — strategies engineered to drive a supra-normal CI or MVO₂ have repeatedly failed to show any survival advantage, so chasing numbers above target buys demand without benefit.</p>
<p>The other silent threat of the first hour is temperature. A patient who arrives hypothermic (≤35 °C) is set up for delayed extubation, shivering that sharply raises peripheral oxygen consumption, atrial and ventricular arrhythmias, a rising SVR that masquerades as hypertension, and worsened coagulopathy — so active rewarming, and anticipation of the labile hemodynamics that accompany it (best treated with volume rather than reflexive vasodilators), belongs on the arrival checklist alongside the lines and drains.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>On arrival, confirm every drain, pacing wire, and infusion line is correctly connected and labeled before making any management changes. A pacing wire connected backward (atrial lead into the ventricular port) can cost precious minutes during a rhythm emergency.</p>
</div>`
    },
    {
      title: "Defining LCOS and the Determinants-of-Output Framework",
      html: `<p>Low cardiac output syndrome (LCOS) is defined as a cardiac index below approximately 2.0–2.2 L/min/m² accompanied by clinical evidence of inadequate end-organ perfusion — oliguria, rising lactate, altered mental status, or cool extremities. It occurs in roughly 5–10% of cardiac surgery patients and carries a disproportionately high mortality, particularly when recognition is delayed and the patient is treated empirically rather than diagnostically.</p>
<p>Because cardiac output equals heart rate multiplied by stroke volume, and stroke volume is itself determined by preload, afterload, and contractility, every cause of LCOS can be organized under one of these four headings. This is not an academic exercise — it is the fastest way to generate a correct differential at the bedside: is the problem rate and rhythm, preload, afterload, or contractility? Each has a distinct hemodynamic signature and a distinct treatment, and treating the wrong one actively worsens the patient.</p>
<p>Cohn frames the same determinants slightly more completely, and each maps onto a monitored number the resident should read critically. <b>Preload</b> is estimated invasively but with caveats: CVP, unless it is very low, is an unreliable surrogate for left ventricular end-diastolic volume — it rises with volume overload, RV failure, tricuspid or mitral regurgitation, pulmonary hypertension, tamponade, tension pneumothorax, and PE, so a "normal" CVP tells you little on its own. PCWP gives the most accurate left-sided filling estimate (absent significant mitral stenosis), and a wedge near 15 mmHg is generally adequate though many patients need higher. <b>Afterload</b> (vascular tone), <b>pump function</b>, <b>rate and rhythm</b>, and <b>oxygen-carrying capacity</b> round out the list — inadequate output can come from any one, and the value of the framework is that it forces you to check all of them rather than anchoring on the first abnormal number.</p>
<p>One structural trap is worth flagging early: most patients leave the operating room with a large net positive fluid balance, yet much of that excess is extravascular (third-space and pleural accumulation), so the patient is frequently <em>intravascularly underfilled</em> despite looking grossly volume-overloaded — which is why ongoing volume requirements in the first hours are the rule, not a red flag.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>CO = HR &times; SV, and SV = f(preload, afterload, contractility).</b> Every LCOS differential collapses into: is this a rate/rhythm problem, a preload problem, an afterload problem, or a contractility problem?</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "LCOS is defined by which combination of findings in the post-cardiac surgery patient?",
      options: [
        "Any cardiac index below normal, regardless of clinical findings",
        "Cardiac index under about 2.2 with clinical hypoperfusion",
        "MAP below 65 mmHg regardless of cardiac index",
        "Any requirement for vasoactive medications after surgery"
      ],
      answer: 1,
      explain: "LCOS requires both a low cardiac index (below approximately 2.0-2.2 L/min/m2) AND clinical evidence of inadequate end-organ perfusion. A low CI alone without perfusion compromise, or vasoactive support alone without a low CI, does not define LCOS. This distinction matters because it keeps the diagnosis tied to actual physiologic compromise rather than a number in isolation."
    },
    {
      title: "Preload Problems: Hypovolemia, Tamponade, and Pneumothorax",
      html: `<p>Hypovolemia is common early after surgery: rewarming causes peripheral vasodilation that expands the effective vascular space and absorbs circulating volume, while ongoing chest tube losses compound the deficit. The hemodynamic signature is low CVP, low PCWP, low cardiac output, and elevated SVR (compensatory vasoconstriction). Treatment is cautious, incremental volume — small challenges of roughly 250 mL followed by reassessment — because excessive fluid administration causes RV dilation that, through ventricular interdependence and leftward septal shift, can paradoxically impair LV filling and worsen output.</p>
<p>Cardiac tamponade is a preload problem by mechanism: external compression of the cardiac chambers prevents adequate diastolic filling regardless of intravascular volume. Tension pneumothorax must also remain in the differential for any sudden post-operative hemodynamic collapse, particularly after chest closure or central line placement — high airway pressures, tracheal deviation, and absent breath sounds with hemodynamic collapse demand immediate needle or tube decompression without waiting for imaging confirmation.</p>
<p>The reason hypovolemia is so easy to miss is that the filling numbers can mislead in both directions. A patient can carry a "reassuring" CVP and still be intravascularly dry, because much of the large net fluid gain from the OR sits in the extravascular space; brisk post-CPB diuresis (often 200–300 mL/hr) and continued chest-tube losses then drain the intravascular compartment further. This is why the response to labile, rewarming-driven hypotension is usually <em>volume</em> rather than a vasoconstrictor — you are refilling a tank that monitoring makes look fuller than it is. The small, reassess-after-each-challenge approach matters because the same patient can flip to fluid-intolerant the moment the RV is stressed.</p>
<p>Tension pneumothorax deserves its reputation as the great mimic: it drives the CVP up by mechanically obstructing venous return exactly as tamponade does, so an isolated high filling pressure with collapse does not distinguish the two. What separates it is the airway and the chest — rising peak airway pressures on the ventilator, a hyperresonant hemithorax with absent breath sounds, and tracheal deviation — and because the fix (needle or finger decompression) is fast and the alternative is arrest, it is one of the few ICU diagnoses made and treated before any film returns.</p>`
    },
    {
      title: "The Atypical Post-Surgical Tamponade",
      html: `<p>Classic teaching describes tamponade as Beck's triad — hypotension, elevated JVP, and muffled heart sounds — but in the post-cardiac surgery patient this triad is unreliable and frequently incomplete, and waiting for all three components before acting is a dangerous strategy. The post-surgical pericardium is often occupied by clot rather than free-flowing liquid blood, and loculated clot can selectively compress a single chamber — most commonly the right atrium or right ventricle — without producing the equalization of pressures across all four chambers that classically defines tamponade physiology.</p>
<p>A patient with isolated RA or RV compression will show low cardiac output and elevated CVP, but PCWP may not be dramatically elevated and pulsus paradoxus may be entirely absent if the left heart is not compressed. Chest tubes that are draining well can also mask tamponade physiology by continuously decompressing the pericardial space — right up until they clot, at which point the patient deteriorates abruptly rather than gradually. Suspect post-surgical tamponade whenever there is unexplained low output with rising filling pressures, near-equalization of CVP and PCWP (within roughly 5 mmHg), or an abrupt cessation of previously active chest tube output.</p>
<p>Cohn's list of findings that should raise the alarm is broader than the classic triad and worth carrying verbatim: hypotension, tachycardia, elevated filling pressures, a <em>rising inotrope requirement</em> (the patient who needs more drug every hour to hold the same pressure), pulsus paradoxus, and equalization of right- and left-atrial pressures. The inotrope-creep is a particularly practical early sign — tamponade physiology quietly raises the pharmacologic price of the same blood pressure before it produces frank collapse.</p>
<p>Two imaging caveats decide how the tests are used. First, an echocardiogram may support the diagnosis but <b>cannot rule it out</b> — a loculated posterior clot compressing the RA can be invisible on a hurried transthoracic study, so a negative echo never buys reassurance in a deteriorating patient. Second, the chest X-ray is not optional: it looks for a widening mediastinum or hemothorax, and Cohn is explicit that a CXR should be <em>repeated on every patient whose initially high chest-tube output later subsides</em>, precisely to catch the tube that has clotted off while bleeding continues into the chest.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Do not attempt pericardiocentesis for post-surgical tamponade — the effusion is almost always clot, not liquid, and a needle will not evacuate it. Management is surgical re-exploration; every cardiac ICU should have a bedside sternotomy protocol for the acutely decompensating patient.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient two hours post-CABG has previously brisk chest tube output that abruptly drops from 120 mL/hr to 5 mL/hr, with CVP rising from 10 to 19 and MAP falling from 78 to 58. What is the most likely explanation and the correct next step?",
      options: [
        "Clotted-tube tamponade; urgent TEE and preparation for re-exploration",
        "The bleeding has stopped and this is reassuring — continue routine monitoring",
        "Vasoplegia — start norepinephrine and vasopressin",
        "Heparin rebound — give additional protamine"
      ],
      answer: 0,
      explain: "The combination of abruptly reduced chest tube output with rising CVP and falling MAP is a classic pattern for tamponade from clotted chest tubes — the drop in output reflects tube obstruction, not hemostasis, and blood is accumulating in the pericardium instead of draining externally. This requires urgent evaluation (bedside TEE) and preparation for re-exploration; falling chest tube output should never by itself be interpreted as reassuring in this clinical context."
    },
    {
      title: "Afterload Problems: Vasoplegia",
      html: `<p>Vasoplegia is the case where the <b>pump is fine but the pipes have fallen wide open</b>. After a long pump run, the pipes (arterioles) lose their tone and dilate everywhere at once, so pressure collapses even though the heart is pumping plenty of blood — the classic "warm shock." Formally: hypotension (MAP below ~60–65 mmHg, SVR below ~800 dyn·s/cm⁵) <em>despite</em> a normal or even high cardiac output and full filling pressures. It shows up more after prolonged CPB and in patients primed for it by pre-op ACE inhibitors, ARBs, amiodarone, or advanced heart failure.</p>
<p>The mechanism is inflammatory: CPB activates complement and pro-inflammatory cytokines (IL-6, IL-8, TNF-alpha) and upregulates inducible nitric oxide synthase, producing excess nitric oxide that causes vascular smooth muscle relaxation largely refractory to catecholamines. The hemodynamic signature — high cardiac output, low SVR, warm periphery, normal-to-low filling pressures — is the critical distinguishing feature that separates vasoplegia from every form of cardiogenic shock, where cardiac output is low rather than high.</p>
<p>Cohn frames the management target in one line: pressors are for the vasodilated patient who has <em>normal pump function</em> and has already been shown to be unresponsive to volume — which is exactly the vasoplegic phenotype. The mainstay agents are the α-agonists (phenylephrine) and vasopressin, with methylene blue held for genuinely pressor-resistant hypotension. The book also widens the list of what primes a patient for it: on top of the CPB inflammatory hit, preoperative and perioperative ACE inhibitors, calcium-channel blockers, and sedatives all lower the vascular starting tone.</p>
<p>The one non-obvious hazard is what those pressors cost. Restoring tone by clamping down every arteriole also clamps the arterial <em>conduits and native coronaries</em> — high-dose α-agonists can provoke coronary and graft vasospasm and frank peripheral (digit and limb) ischemia. That is why the patient on escalating vasopressors needs the extremities and the ECG watched actively, not just the MAP: you can buy a number on the monitor at the price of a graft or a fingertip.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>High CO with low SVR is the signature that rules IN vasoplegia and rules OUT cardiogenic failure. Adding an inotrope to a vasoplegic patient does not address the problem — the pump is working; the pipes have lost their tone.</p>
</div>`
    },
    {
      title: "RV Failure vs. LV Failure: Reading the Numbers",
      html: `<p>Distinguishing RV failure from LV failure at the bedside depends on recognizing the dissociation — or lack of dissociation — between right- and left-sided filling pressures. In LV failure, the LV cannot eject effectively, so pressure backs up through the pulmonary circulation: both CVP and PCWP tend to rise together (though PCWP typically rises more), cardiac output falls, and SVR rises as a compensatory response. In isolated RV failure, the RV cannot generate adequate forward flow into the pulmonary circuit, so CVP rises substantially while PCWP remains normal or low — the RV simply is not delivering enough volume downstream to raise left-sided filling pressures.</p>
<p>This CVP/PCWP dissociation is the single most useful discriminator at the bedside: elevated CVP with normal-to-low PCWP points to RV failure; elevation of both together points to LV or biventricular failure; and near-equalization of CVP and PCWP (both elevated to a similar value) points to tamponade rather than either isolated ventricular failure.</p>
<table>
<tr><th>Finding</th><th>Interpretation</th></tr>
<tr><td>Low CO, high SVR, low CVP/PCWP</td><td>Hypovolemia</td></tr>
<tr><td>Low CO, high SVR, high PCWP, normal/low CVP</td><td>LV failure</td></tr>
<tr><td>Low CO, normal/low PCWP, high CVP</td><td>RV failure</td></tr>
<tr><td>High CO, low SVR, normal/high filling pressures</td><td>Vasoplegia</td></tr>
<tr><td>Low CO, equalized high CVP and PCWP</td><td>Tamponade</td></tr>
</table>
<p>Two technical points make these numbers trustworthy rather than decorative. SVR is not measured but calculated — SVR = (MAP − CVP)/CO × 80 — so it moves with whatever CO you feed it; a falsely low thermodilution cardiac output will invent a high SVR and vice versa, and the number is only as good as the output measurement behind it. And PA-diastolic pressure can substitute for PCWP as a continuous left-filling estimate, but <em>only when PVR is normal</em>: in the RV-failure or pulmonary-hypertension patient the two diverge, so the shortcut fails in exactly the situation where you most want to read left-sided filling.</p>
<p>The bedside upshot is that no single number is diagnostic — it is the <em>pattern</em> across CVP, PCWP, CO/CI, and SVR read together that names the lesion. A high CVP alone is compatible with hypervolemia, RV failure, tamponade, tension pneumothorax, and PE; it is the company it keeps — what the PCWP and cardiac output are doing alongside it — that separates them.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient arrives to the ICU after CABG with MAP 55, CI 0.9, CVP 18, PCWP 22, SVR 1900. What is the physiology and the appropriate first-line treatment?",
      options: [
        "Vasoplegia — start norepinephrine and vasopressin",
        "High-SVR LV failure; start an inotrope",
        "Isolated RV failure — start inhaled nitric oxide",
        "Hypovolemia — give a large volume bolus"
      ],
      answer: 1,
      explain: "Low cardiac index with high CVP AND high PCWP (both elevated together) and high SVR is the signature of LV failure with compensatory peripheral vasoconstriction. Adding a vasopressor would further increase afterload on an already-failing LV and worsen output. The correct treatment is inotropic support (dobutamine or epinephrine) to improve contractility, not a vasopressor — SVR is already pathologically high, working against the failing ventricle."
    },
    {
      title: "RV Failure: Mechanism and the Vicious Cycle",
      html: `<p>RV failure earns its own lesson because it kills by a <b>death spiral</b>, not a single blow — and the manoeuvre that saves an LV can push an RV further down the drain. The RV is a thin, crescent-shaped bellows built to move large volumes against <em>low</em> pressure; it has almost no reserve for a sudden rise in afterload. So when pulmonary vascular resistance jumps — from pulmonary hypertension that has not yet come down after valve surgery, from hypoxia, hypercarbia, or acidosis, or from CPB lung injury — the RV cannot generate the pressure to push through, and it balloons out.</p>
<p>As the RV dilates, wall stress rises (by LaPlace's law), oxygen demand increases, and because RV coronary perfusion is driven by the pressure gradient between aortic diastolic pressure and RV pressure throughout the cardiac cycle, RV ischemia begins to develop. The dilating RV pushes the interventricular septum leftward — producing the characteristic D-shaped LV on short-axis echocardiographic view — which impairs LV filling and drops systemic cardiac output further. Falling systemic pressure then reduces RV coronary perfusion pressure, worsening RV ischemia and completing a self-reinforcing cycle.</p>
<p>What makes the spiral vicious rather than merely additive is that RV coronary perfusion changes character as the RV fails. In a normal low-pressure RV the muscle is perfused throughout the whole cardiac cycle; but once RV systolic pressure climbs toward systemic levels, perfusion becomes dependent on the aortic-diastolic-to-RV pressure gradient — the RV starts behaving like the LV, perfused mainly in diastole — so any fall in systemic diastolic pressure now directly starves an RV that is simultaneously working harder. Each rung (dilation → wall stress → demand up, perfusion pressure down → ischemia → weaker contraction → more dilation) reinforces the next.</p>
<p>Because the trigger is almost always a jump in RV afterload, the reversible levers are the PVR-raising insults, and they should be memorized as a checklist to <em>subtract</em>: hypoxia, hypercarbia, acidosis, hypothermia, excessive PEEP, and α-adrenergic pulmonary vasoconstriction all raise PVR and can each be corrected at the bedside. Fixing ventilator and metabolic derangements is not adjunctive here — it is often the fastest afterload reduction available to a failing RV.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>A D-shaped LV on echo with elevated CVP and low-normal PCWP is RV failure until proven otherwise. Excessive fluid administration in this setting worsens RV dilation and further impairs LV filling via septal shift — more volume is not automatically the answer to low output.</p>
</div>`
    },
    {
      title: "Managing Acute RV Failure",
      html: `<p>Management of RV failure requires three simultaneous objectives, and neglecting any one of them undermines the other two. First, reduce RV afterload: inhaled nitric oxide and inhaled epoprostenol are preferred because they selectively vasodilate the pulmonary circulation without causing systemic hypotension, while milrinone provides simultaneous RV inotropy and pulmonary vasodilation, making it an especially well-suited RV agent. All factors that raise PVR — hypoxia, hypercarbia, acidosis, excessive PEEP, hypothermia, and alpha-adrenergic pulmonary vasoconstriction — should be avoided.</p>
<p>Second, maintain RV coronary perfusion pressure: norepinephrine is the preferred vasopressor because it raises systemic (and therefore aortic diastolic) pressure without meaningfully increasing PVR at clinical doses, preserving the pressure gradient that drives RV myocardial perfusion. This is the counterintuitive core principle of RV failure management — a systemic vasopressor may be needed not to treat classic cardiogenic shock but specifically to prevent RV infarction from inadequate coronary perfusion pressure.</p>
<p>Third, optimize RV preload cautiously: a modestly failing RV can be preload-responsive at low filling volumes, but a severely dilated RV sits on the descending limb of the Starling curve, where additional volume worsens dilation and further compromises LV filling through septal shift — volume administration in RV failure must be titrated carefully rather than given reflexively for a low cardiac output number.</p>
<p>When these three levers are maximized and the RV is still failing, the next step is mechanical rather than a fourth infusion: an RV assist device or veno-arterial ECMO offloads the ventricle and buys time for the pulmonary vasculature and myocardium to recover, and Cohn's temporary-MCS chapter positions VA-ECMO as the fallback for biventricular or refractory RV failure. Maintaining AV synchrony matters too — the failing, stiff RV is unusually dependent on a well-timed atrial kick, so atrial or atrioventricular pacing is preferred to ventricular pacing whenever the rhythm needs support.</p>
<p>The single principle that ties the whole approach together is that the RV is far more <em>afterload-sensitive</em> than the LV: it tolerates pressure loads poorly and rewards afterload reduction disproportionately. So the instinct that serves you in LV failure — push volume, add a pressor, accept a higher afterload for a higher pressure — is precisely inverted here, which is why RV failure is the classic trap for a resident managing "low output" by reflex.</p>`
    },
    {
      type: "checkpoint",
      q: "Why is norepinephrine, a systemic vasopressor, considered a first-line agent in the management of acute RV failure?",
      options: [
        "It directly reduces pulmonary vascular resistance",
        "It is the only agent that increases RV contractility",
        "It reduces RV preload directly",
        "Raise systemic pressure to preserve RV coronary perfusion"
      ],
      answer: 3,
      explain: "RV coronary perfusion is driven by the gradient between aortic diastolic pressure and RV pressure. In a dilated, hypertensive, ischemic RV, systemic hypotension worsens this gradient and perpetuates RV ischemia. Norepinephrine raises systemic and aortic diastolic pressure, restoring RV coronary perfusion pressure, and does so without significantly raising PVR at clinical doses — unlike agents with stronger pulmonary vasoconstrictor effects. This is why it is used not merely to raise blood pressure but specifically to protect a failing, ischemic RV."
    },
    {
      title: "Putting the Profile Together",
      html: `<p>The ability to read a hemodynamic profile at the bedside — CVP, PCWP, cardiac output/index, and SVR together — is the practical synthesis of everything in this lesson, and it should become close to reflexive. Hypovolemia shows low filling pressures with high SVR; LV failure shows high filling pressures (both CVP and PCWP) with high SVR; RV failure shows a dissociation between high CVP and normal-to-low PCWP; vasoplegia shows high cardiac output with low SVR and normal-to-low filling pressures; and tamponade shows equalized, elevated CVP and PCWP with low output.</p>
<p>The two discriminators worth memorizing explicitly: the difference between tamponade and biventricular failure is equalization — a CVP-PCWP difference under roughly 5 mmHg strongly suggests pericardial constraint over primary ventricular failure. The difference between RV failure and tamponade is that RV failure spares the left-sided pressures (low-normal PCWP) while tamponade compresses all four chambers and elevates both.</p>
<p>One number integrates the whole profile and is worth reading first: the mixed venous oxygen saturation (MVO₂). Because it reflects the balance between oxygen delivery and consumption, it falls whenever cardiac output is inadequate for demand — so a low MVO₂ (below the ~60% target) is an early, sensitive alarm for a failing pump across hypovolemia, LV failure, RV failure, and tamponade alike. The telling exception is vasoplegia, where a <em>high or normal</em> MVO₂ sits alongside hypotension: delivery is fine and the tissues are simply being over-perfused at low pressure, which is another way the "warm shock" profile announces itself.</p>
<p>Downstream perfusion markers close the loop and keep the numbers honest: a urine output above 0.5 mL/kg/hr and a falling (not rising) lactate confirm that a profile you have "corrected" on the monitor is actually delivering to the organs. When the hemodynamic numbers look adequate but urine output and lactate say otherwise, believe the organs — the monitored pressures are a means, and end-organ perfusion is the end.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>Equalized pressures = think pericardium (tamponade). Dissociated pressures (high CVP, normal PCWP) = think RV. Both elevated together = think LV or biventricular failure.</b></p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Which single finding best distinguishes cardiac tamponade from isolated right ventricular failure in a hypotensive post-cardiac surgery patient with elevated CVP?",
      options: [
        "Heart rate — tamponade always causes tachycardia and RV failure does not",
        "PCWP: near CVP in tamponade but low or normal in isolated RV failure",
        "SVR — tamponade always shows low SVR",
        "Cardiac output — RV failure always preserves normal cardiac output"
      ],
      answer: 1,
      explain: "Tamponade compresses all four cardiac chambers, so both CVP and PCWP rise together and tend to equalize (within about 5 mmHg of each other). RV failure, by contrast, produces a dissociation: CVP rises because the RV cannot eject adequately, but PCWP stays normal or low because the RV is not generating enough forward flow to raise left-sided (pulmonary venous) pressure. This CVP/PCWP relationship is the key bedside discriminator between the two."
    }
  ]
};

window.LESSONS["d13-vaso"] = {
  id: "d13-vaso",
  day: 13,
  ord: 2,
  title: "Inotropes, Vasopressors & Weaning",
  short: "Vasoactives",
  minutes: 19,
  chunks: [
    {
      title: "A Framework for Drug Selection",
      html: `<p>Strip away the drug names and there are really only two jobs a vasoactive agent can do: <b>make the pump squeeze harder</b> (an inotrope) or <b>make the pipes clamp tighter</b> (a vasopressor) — some do both. Picture the circulation as a pump pushing fluid through a set of pipes: if the pump is weak you strengthen the pump; if the pipes have gone slack you tighten the pipes; using the wrong lever fixes nothing. Too often the choice is made blind ("start levophed, add an inotrope if it doesn't hold"), but a resident who knows each drug's receptor profile picks the right lever on the first try.</p>
<p>There is a crucial <b>third axis</b> that separates the good intensivist from the reflexive one: what the drug does to the <em>pulmonary</em> pipes (PVR). Whenever the right ventricle is struggling, an agent that tightens the lung's vessels can tip a failing RV over the edge even while it props up the systemic pressure — so PVR is not an afterthought, it is a make-or-break consideration.</p>
<p>Matching the agent to the physiology identified in the previous lesson — LV failure, RV failure, vasoplegia — is the entire task. Using an inotrope in vasoplegia, or a pure vasopressor as monotherapy in a failing, high-afterload LV, actively worsens the patient even though both scenarios present with "low blood pressure."</p>
<p>Cohn nails the sequencing that keeps this disciplined: inotropes are indicated only when low cardiac output <em>persists despite</em> optimization of preload, afterload, and rate/rhythm — not as a first reflex for a low number. Pressors are for the vasodilated patient with a normal pump who has not responded to volume; vasodilators are for the hypertensive patient, or the normotensive patient with a poor pump who needs afterload taken off. Reaching for the fourth lever before you have pulled the first three is how patients end up on drugs that fight each other.</p>
<p>There is also a "less is more" principle the book is emphatic about. Because perioperative beta-blockade improves mortality and morbidity after cardiac surgery, the gratuitous use of inotropes — which raise myocardial oxygen demand and are arrhythmogenic — works against the patient, and every vasoactive agent should be weaned as rapidly as the physiology allows once it is no longer needed. The goal is not to find the right cocktail and hold it; it is to get off the drugs.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Two questions before choosing any agent: (1) Is the problem pump function (inotrope) or vascular tone (vasopressor) — or both? (2) Does this patient's RV need help, meaning does the agent's effect on PVR matter?</p>
</div>`
    },
    {
      title: "Dobutamine: The Default LV Inotrope",
      html: `<p>Dobutamine is a selective beta-1 and beta-2 agonist that increases myocardial contractility while simultaneously reducing systemic and pulmonary vascular resistance through its beta-2 vasodilatory effect. This combination makes it the most commonly used first-line inotrope for LCOS from LV dysfunction, particularly when SVR is already elevated (as is typical in compensated LV failure) — the vasodilatory component is a feature here, not a side effect, because it reduces the afterload the failing LV must eject against.</p>
<p>Its principal limitation follows directly from the same mechanism: because dobutamine lowers SVR, it is hazardous as a sole agent when MAP is already low or borderline, since it can drop pressure further before the improvement in contractility and forward flow compensates. In that scenario, dobutamine is typically paired with a vasopressor rather than withheld. Dobutamine is also arrhythmogenic and can provoke tachycardia, both of which increase myocardial oxygen demand and can offset some of its benefit in ischemic myocardium.</p>
<p>It helps to hold dobutamine and milrinone side by side, because Cohn groups them together as inotropes that both raise cardiac output by the same two-part mechanism — more contractility <em>and</em> less afterload from peripheral vasodilation. What separates them is the practical profile: dobutamine is shorter-acting and easier to titrate (its effect comes and goes within minutes), while milrinone achieves its output gain at a lower myocardial oxygen cost. For minute-to-minute control in a patient whose pressure you may need to walk up or down, dobutamine's titratability is the deciding advantage.</p>
<p>The mechanism also defines dobutamine's blind spot. Because it works through the beta-adrenergic receptor, its effect depends on that receptor being available and responsive — in chronic heart failure or after prolonged catecholamine exposure the beta-receptors are downregulated, and in a patient on a beta-blocker they are occupied, so dobutamine can underperform exactly when the failing heart most needs help. That is the setting where a non-adrenergic inotrope becomes the better tool, which is the bridge to milrinone.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Dobutamine's vasodilation is a deliberate afterload-reduction strategy in LV failure with high SVR — but if MAP is already marginal, pair it with a vasopressor from the start rather than watching pressure fall further while waiting for contractility to improve.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why is dobutamine considered hazardous as a sole agent in a patient with LV failure and a borderline-low MAP?",
      options: [
        "Beta-2 vasodilation may further lower an already marginal MAP",
        "Dobutamine has no effect on contractility at low doses",
        "Dobutamine always causes severe bradycardia",
        "Dobutamine increases pulmonary vascular resistance dangerously"
      ],
      answer: 0,
      explain: "Dobutamine's beta-2 agonism produces peripheral and pulmonary vasodilation alongside its beta-1-mediated inotropic effect. In a patient with already borderline or low MAP, this vasodilation can drop pressure further in the short term, before improved contractility and cardiac output compensate. In this setting, dobutamine should be paired with a vasopressor rather than used alone, rather than waiting to see if pressure recovers on its own."
    },
    {
      title: "Milrinone: The Preferred RV Inotrope",
      html: `<p>Milrinone is a phosphodiesterase-3 inhibitor that increases intracellular cAMP independently of the beta-adrenergic receptor pathway — a mechanistically distinct route to inotropy that remains effective even when beta-receptors are downregulated, as occurs in chronic heart failure or with prolonged prior catecholamine exposure, and even in patients maintained on beta-blockers. Because cAMP elevation occurs in both cardiac myocytes (inotropy) and vascular smooth muscle (vasodilation, including pulmonary vasodilation), milrinone functions as both an inotrope and a systemic and pulmonary vasodilator simultaneously.</p>
<p>This dual action — inotropy plus pulmonary vasodilation — makes milrinone particularly well suited to RV failure and pulmonary hypertension, where reducing RV afterload is just as important as improving RV contractility. Its major practical limitation is a prolonged half-life (roughly 2.5 hours, longer still in renal impairment), meaning that significant hypotension after a bolus or loading dose can persist for an extended period and is difficult to titrate away from quickly — many centers avoid a loading bolus entirely and start directly with a maintenance infusion for this reason.</p>
<p>Milrinone's headline advantage over dobutamine is metabolic: Cohn notes it achieves its rise in cardiac output at a <em>lower myocardial oxygen consumption</em>, which is why it is attractive in a heart that is ischemic or marginally perfused. That efficiency is not free of the class liabilities, though — like all inotropes it is arrhythmogenic and can exacerbate coronary ischemia, so it is not a "safe" inotrope, only a differently balanced one.</p>
<p>The vasodilation that makes it a good pulmonary agent is also its main hazard at the systemic end. Because cAMP relaxes vascular smooth muscle everywhere, milrinone can drop systemic pressure, and its long half-life means that drop is slow to reverse — so in a patient with a marginal MAP it is typically run <em>with</em> a vasopressor (often norepinephrine) from the outset rather than added and then rescued. In the RV-failure/pulmonary-hypertension patient it also pairs naturally with an inhaled selective pulmonary vasodilator (nitric oxide or epoprostenol), combining systemic-sparing pulmonary vasodilation with the inotropy the RV needs.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>Milrinone = inotrope + pulmonary vasodilator in one drug</b> — the reason it is the preferred single agent for RV failure and pulmonary hypertension, but its long half-life means hypotension, once started, is slow to resolve.</p>
</div>`
    },
    {
      title: "Epinephrine: The Powerful, Non-Selective Agent",
      html: `<p>Epinephrine acts on beta-1, beta-2, and alpha-1 receptors, producing powerful inotropy and, at higher doses, significant vasoconstriction. It is reserved for severe LCOS with concurrent hypotension, or as a component of refractory cardiac arrest management, because its potency comes bundled with meaningful liabilities: it is strongly tachycardic and arrhythmogenic, both of which raise myocardial oxygen demand in a heart that may already be ischemic or stunned.</p>
<p>A subtler but clinically important effect is that epinephrine raises serum lactate through beta-2-mediated stimulation of aerobic glycolysis in skeletal muscle — a metabolic effect entirely separate from tissue hypoperfusion. This means that in a patient on an epinephrine infusion, lactate is no longer a reliable marker of perfusion adequacy, and trending it to guide resuscitation can be misleading unless this confounder is recognized.</p>
<p>Epinephrine's receptor profile shifts with dose, and knowing the shift is what lets you use it deliberately rather than as a blunt instrument. At lower infusion rates the beta effects dominate — potent inotropy and chronotropy — while the alpha (vasoconstrictor) contribution climbs as the dose rises, so the same drug is a near-pure inotrope low and an inopressor high. This is why it is a workhorse for separating a struggling heart from bypass and for severe LCOS with hypotension: a single agent delivers contractility and pressure together. Norepinephrine shares the β+α combination but is weighted far toward alpha, which is why the two are used for opposite problems despite their chemical kinship.</p>
<p>The cost of that potency is demand. Epinephrine is the most tachycardic and arrhythmogenic of the common inotropes, and every extra beat and every rise in contractility raises myocardial oxygen consumption in a heart that may be stunned or ischemic — so it buys output at a demand price the myocardium may not be able to afford, which is the reason it is a reserve agent rather than a first choice.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Do not use a rising lactate as proof of inadequate perfusion in a patient on epinephrine — beta-2-mediated aerobic glycolysis raises lactate independent of tissue oxygen delivery. Use trends in MAP, urine output, mental status, and mixed venous saturation instead.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient on an epinephrine infusion for severe LCOS has a rising serum lactate. What is the most important consideration before interpreting this as worsening tissue hypoperfusion?",
      options: [
        "Lactate is never useful once any vasoactive medication is started",
        "Rising lactate on epinephrine always indicates mesenteric ischemia",
        "Epinephrine can raise lactate through aerobic beta-2 glycolysis",
        "Lactate should be checked only from arterial, never venous, samples on epinephrine"
      ],
      answer: 2,
      explain: "Epinephrine's beta-2 agonism stimulates aerobic glycolysis in skeletal muscle, generating lactate as a normal metabolic byproduct of this pathway rather than as a marker of anaerobic metabolism from hypoperfusion. This confounds the use of lactate trends to assess perfusion adequacy while epinephrine is running — other markers (MAP trend, urine output, mental status, mixed venous saturation) should be weighted more heavily during epinephrine therapy."
    },
    {
      title: "Norepinephrine and Vasopressin",
      html: `<p>Norepinephrine acts predominantly on alpha-1 receptors (with modest beta-1 activity), making it primarily a vasopressor with a small inotropic contribution. It is the first-line agent for vasoplegia, septic-physiology shock, and — as established in the previous lesson — RV failure, where its ability to raise aortic diastolic pressure without significantly increasing PVR makes it uniquely suited to preserving RV coronary perfusion pressure.</p>
<p>Vasopressin acts on V1 receptors on vascular smooth muscle through a mechanism entirely independent of the adrenergic pathway, which is precisely why it remains effective when catecholamine receptors have become downregulated or when the adrenergic system is otherwise saturated — a common scenario in prolonged or severe vasoplegia. It is typically dosed at a fixed rate (not titrated up and down like a catecholamine) and, importantly, does not significantly increase PVR the way high-dose norepinephrine or other alpha-agonists can — making it a valuable second agent when RV function is precarious and a rise in PVR would be poorly tolerated.</p>
<p>The trade-off that governs norepinephrine dosing is the same peripheral cost seen with any α-agonist: it restores pressure by constricting the systemic bed, but push the dose high enough and that constriction reaches the coronary conduits and the digits, risking graft vasospasm and peripheral ischemia. This ceiling is part of why vasopressin is added early rather than simply dialing norepinephrine ever higher — a second, non-adrenergic mechanism recruits fresh vasoconstriction instead of forcing one receptor system past its safe range.</p>
<p>Vasopressin also earns its place through a scarcity mechanism: in prolonged shock, endogenous vasopressin stores become <em>depleted</em>, so a fixed low-dose infusion is partly replacing a hormone the patient has run out of, not just adding a drug. Combined with its neutrality toward PVR, that makes it the natural partner for norepinephrine in vasoplegia with a vulnerable RV — and when even the two together fail, the problem has moved past adrenergic and V1 signaling to the nitric-oxide cascade itself, which is where methylene blue and the rest of the ladder take over.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient with vasoplegia and known reduced RV function is escalating on norepinephrine without adequate response. Why is vasopressin a particularly good choice as the second agent in this scenario?",
      options: [
        "Vasopressin has potent inotropic effects that improve RV contractility",
        "V1 vasoconstriction remains effective without materially increasing PVR",
        "Vasopressin is a pulmonary vasodilator that directly treats RV failure",
        "Vasopressin replaces the need for norepinephrine entirely"
      ],
      answer: 1,
      explain: "Vasopressin's V1-receptor mechanism is independent of adrenergic signaling, so it remains effective in catecholamine-refractory vasoplegia where adrenergic receptors may be downregulated. Critically, unlike escalating doses of norepinephrine or other alpha-agonists, vasopressin does not significantly raise pulmonary vascular resistance — an important property when the RV is already vulnerable and cannot tolerate additional afterload."
    },
    {
      title: "Vasoplegia: The Treatment Ladder",
      html: `<p>Refractory vasoplegia is managed with a stepwise escalation, and understanding why each step is added — rather than simply memorizing the order — clarifies when to move to the next rung. Norepinephrine is first-line. Vasopressin is added early (not held in reserve) for norepinephrine-refractory cases, since its non-adrenergic mechanism provides genuinely additive rather than redundant coverage.</p>
<p>Methylene blue is the next step for vasopressor-refractory vasoplegia: it inhibits both nitric oxide synthase (reducing the excess NO production driving the vasodilation) and guanylate cyclase (blocking the downstream signaling cascade even for NO that is still produced), breaking the pathologic cascade at two points simultaneously. It carries important contraindications: G6PD deficiency (methylene blue is a pro-oxidant that can precipitate acute hemolytic crisis), serotonergic medication use (it has MAO-inhibitor activity and can precipitate serotonin syndrome with SSRIs, SNRIs, tramadol, or linezolid), and severe renal failure. It also factitiously depresses pulse oximetry readings by absorbing light at the wavelength used by the sensor — rely on ABG-measured SaO2 rather than SpO2 while it is active.</p>
<p>Hydroxocobalamin, a vitamin B12 analogue, acts as a direct nitric oxide scavenger and represents an emerging option for refractory post-CPB vasoplegia, with accumulating evidence supporting benefit over placebo in this setting. Low-dose hydrocortisone is also considered in select patients with suspected relative adrenal insufficiency after prolonged bypass or pre-operative steroid exposure.</p>
<p>Cohn's own framing keeps the ladder anchored: the α-agents and vasopressin are the pressors of first resort for the vasodilated, volume-unresponsive patient, and methylene blue is named specifically for <em>pressor-resistant</em> hypotension — a rescue for the case that has already defeated adequate norepinephrine and vasopressin, not an early add-on. The dosing point that trips people up is that methylene blue's benefit is front-loaded: it works best given relatively early in refractory vasoplegia, before the vascular smooth muscle becomes irreversibly unresponsive, so "refractory" should be recognized promptly rather than after hours of futile catecholamine escalation.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>Vasoplegia ladder: norepinephrine &rarr; add vasopressin early &rarr; methylene blue &rarr; hydroxocobalamin</b> (+/- steroids if adrenal insufficiency is suspected). Each step targets a different point in the NO-mediated vasodilation cascade.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient with refractory vasoplegia on norepinephrine and vasopressin is being considered for methylene blue. What must be checked before administration, and why?",
      options: [
        "Serum potassium — methylene blue causes severe hyperkalemia",
        "ACT — methylene blue interferes with heparin activity",
        "Chest X-ray — methylene blue is contraindicated with pleural effusion",
        "Check G6PD deficiency and serotonergic drugs"
      ],
      answer: 3,
      explain: "Methylene blue is a pro-oxidant that can precipitate acute hemolytic crisis in G6PD-deficient patients, and it has monoamine oxidase inhibitor activity that can precipitate serotonin syndrome when combined with serotonergic medications (SSRIs, SNRIs, tramadol, linezolid). Both must be checked before administration. It also factitiously lowers pulse oximetry readings, so SaO2 from ABG should be used to assess oxygenation while it is active."
    },
    {
      title: "Inodilators and the Dopamine Legacy",
      html: `<p>Agents that combine inotropy with vasodilation — dobutamine and milrinone — are sometimes grouped under the term "inodilator," reflecting the fact that they improve forward flow through two simultaneous mechanisms: increased contractility and reduced afterload (systemic for dobutamine; systemic and pulmonary for milrinone). This dual action is advantageous specifically in failure states where afterload is elevated, but becomes a liability, as discussed, when systemic pressure is already inadequate.</p>
<p>Dopamine remains worth understanding for its dose-dependent receptor pharmacology even though it has been largely supplanted by norepinephrine as a vasopressor: at low doses (below roughly 5 mcg/kg/min) it is predominantly dopaminergic (DA-1) and renal-vasodilatory; at moderate doses (roughly 5–10 mcg/kg/min) it is predominantly beta-1 inotropic; and at higher doses (above roughly 10 mcg/kg/min) it becomes predominantly alpha-1 vasoconstrictive. This single-drug, dose-dependent shift across three distinct pharmacologic profiles makes it harder to titrate precisely than agents with a single dominant mechanism, and it is more arrhythmogenic than norepinephrine — the primary reasons for its decline in modern practice.</p>
<p>The "inodilator" label also carries a warning about where these agents help and where they hurt: the afterload reduction that makes dobutamine and milrinone so useful in a high-SVR failing ventricle becomes a liability the moment systemic pressure is inadequate, because you cannot separate the inotropy from the vasodilation — they are one mechanism. In a hypotensive patient the vasodilating inotrope must be leashed to a vasopressor, or a different agent chosen.</p>
<p>Dopamine's decline is worth understanding beyond its clumsy titration. The old practice of "renal-dose" dopamine — running a low infusion specifically to protect the kidneys — has been abandoned: Cohn is explicit that beyond optimizing hemodynamics and avoiding nephrotoxins, there is no convincing evidence that dopamine (or mannitol, fenoldopam, nesiritide, or diuretics) is genuinely renoprotective. Low-dose dopamine may promote urine flow, but urine flow is not renal protection, and chasing it exposes the patient to dopamine's arrhythmogenicity for no proven benefit.</p>`
    },
    {
      title: "Mechanical Escalation and Weaning Vasoactive Support",
      html: `<p>Pharmacologic therapy has real limits, and recognizing when a patient has exceeded them — rather than continuing to escalate doses indefinitely — is a critical judgment. Escalating requirements for multiple high-dose vasoactive agents without hemodynamic improvement, rising lactate despite adequate MAP, or a hemodynamic profile that mechanical support would address more effectively than any further pharmacologic titration (severe LV failure not responding to inotropes, biventricular failure) are signals to escalate to mechanical circulatory support rather than adding a fourth infusion. The same MCS ladder introduced for failure to wean from bypass applies here: IABP for afterload reduction and modest augmentation in ischemic LV failure; Impella for active LV unloading when more substantial support is needed; ECMO for combined cardiorespiratory failure or biventricular failure requiring full support.</p>
<p>Once the underlying physiology has resolved — the stunned myocardium has recovered, the inflammatory vasoplegic state has settled, the RV has adapted to its new loading conditions — vasoactive agents are weaned in a stepwise, one-agent-at-a-time fashion, watching hemodynamics and perfusion markers (urine output, lactate trend, mental status) closely with each reduction. Weaning the agent with the greatest side-effect burden first (often the highest-dose or most arrhythmogenic agent) while maintaining the others is a common and reasonable approach, though the exact sequence should be individualized to the patient's dominant physiology.</p>
<p>One lever is easy to forget precisely because it costs nothing: rate and rhythm. Within a normal range cardiac output rises almost linearly with heart rate, so a patient who is inappropriately bradycardic on functioning epicardial wires can often have output improved by pacing before any drug is touched — and the atrial kick is worth protecting, so atrial pacing is preferred to AV pacing, which is preferred to ventricular pacing. Optimizing the rhythm is frequently the cheapest inotrope in the room.</p>
<p>Weaning, finally, is not an afterthought but part of the therapeutic goal. Because perioperative beta-blockade improves survival and inotropes carry a demand-and-arrhythmia penalty, the aim is to come off vasoactive support as rapidly as the recovering physiology tolerates, reintroducing the beta-blocker as the drips come down — the endpoint of good ICU hemodynamic management is a patient on no vasoactive drugs, not a patient stably balanced on three.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Escalating doses of multiple vasoactive agents without improvement is itself a data point — it suggests the physiology has outstripped what pharmacology alone can fix, and mechanical support should be considered before adding yet another infusion.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient in the cardiac ICU is on maximal doses of three vasoactive agents with persistently rising lactate and no hemodynamic improvement over several hours. What does this pattern most strongly suggest?",
      options: [
        "The patient needs a fourth vasoactive agent added",
        "The lactate elevation is definitely an artifact of epinephrine and can be ignored",
        "Escalate early to mechanical circulatory support",
        "The patient should be weaned off all vasoactive agents immediately"
      ],
      answer: 2,
      explain: "Escalating requirements for multiple vasoactive agents without hemodynamic improvement, combined with a rising lactate suggesting inadequate perfusion, indicates the underlying physiology (severe LV failure, RV failure, or refractory shock) has outstripped what pharmacologic titration alone can correct. This is the point at which mechanical circulatory support (IABP, Impella, or ECMO depending on the specific physiology) should be considered rather than continuing to escalate medical therapy indefinitely."
    }
  ]
};

window.LESSONS["d13-complications"] = {
  id: "d13-complications",
  day: 13,
  ord: 3,
  title: "Postoperative Complications & Orders",
  short: "Post-op Complications",
  minutes: 21,
  chunks: [
    {
      title: "The Structured Approach to Deterioration",
      html: `<p>The single most dangerous habit in the post-cardiac surgery ICU is treating a number before treating a patient — reflexively bolusing fluid, escalating a vasopressor, or cardioverting an arrhythmia without first establishing a unifying diagnosis. The post-cardiac surgery patient is uniquely susceptible to several simultaneous processes at once, and treating one in isolation while missing a concurrent, causally related process can be fatal.</p>
<p>A structured, systems-based framework applied at the bedside in under two minutes prevents this: <b>A</b>irway and ventilator (adequate oxygenation and ventilation; new pneumothorax, malpositioned ETT, mucus plug); <b>B</b>leeding (hourly and cumulative chest tube output, coagulopathy, mediastinal widening, need for re-exploration); <b>C</b>ardiac (is this low output, and from what mechanism — tamponade, RV failure, LV failure, arrhythmia; new wall motion abnormality on echo); <b>D</b>rains and devices (are chest tubes patent, are pacing wires functioning, are monitoring lines giving reliable data); <b>E</b>verything else (metabolic derangements, medication and sedation changes, temperature, glucose).</p>
<p>The reason this discipline pays off is that the post-cardiac-surgery patient rarely deteriorates from a single cause. Tamponade, hypovolemia, a fresh arrhythmia, evolving RV failure, and vasoplegia can coexist, and — worse — they are often causally linked: bleeding both drops preload and, as it accumulates, produces tamponade; a low-output state provokes the atrial fibrillation that then worsens the low output. Treat one in isolation and you can drive the linked process harder, which is how a "correct" intervention makes the patient worse.</p>
<p>Two integrating numbers keep the sweep honest and belong in the same two-minute pass. A falling mixed venous saturation says delivery is losing to demand somewhere in the A-B-C-D-E list even before any single vital sign looks alarming, and a rising lactate says the tissues are already paying for it. When either is drifting the wrong way and no individual number explains it, the answer is to re-run the framework looking for the second, hidden process — not to make the last intervention bigger.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>A-B-C-D-E for post-cardiac surgery deterioration:</b> Airway/ventilator, Bleeding, Cardiac, Drains/devices, Everything else. This prevents anchoring on one abnormal number while a related, causal process goes unaddressed.</p>
</div>`
    },
    {
      title: "Post-Operative Bleeding: Thresholds and the Surgical-vs-Coagulopathic Distinction",
      html: `<p>Post-operative bleeding complicates a meaningful proportion of cardiac surgery cases, and roughly half of re-explorations for bleeding find a discrete surgical source — the remainder are coagulopathic. Distinguishing between these two categories drives management, and getting it wrong in either direction has serious consequences: taking a purely coagulopathic patient back to the OR delays correction of the actual problem, while treating true surgical bleeding with empiric factor replacement delays a definitive fix and allows ongoing blood loss toward tamponade.</p>
<p>Standard re-exploration thresholds include chest tube output exceeding roughly 400–500 mL in the first hour, sustained output of roughly 200–300 mL/hr for 2–4 consecutive hours, a sudden increase in output after a period of slowing (suggesting a dislodged clot re-bleeding), hemodynamic compromise attributable to blood loss, or a rapidly widening mediastinal silhouette on CXR. These are guides rather than rigid rules — a patient with a falling cardiac index, rising lactate, and falling CVP at only 180 mL/hr may need to go back sooner than a hemodynamically stable patient with a single hour of 250 mL.</p>
<p>Surgical bleeding is bright red, brisk, and sustained, continues or worsens despite correction of coagulation parameters, and tends to localize on imaging — it requires prompt re-exploration, not empiric transfusion. Coagulopathic bleeding is darker, slower, and more diffuse, corrects with appropriate factor and platelet replacement, and is accompanied by abnormal coagulation labs. Common coagulopathic causes: heparin rebound (delayed anticoagulant recurrence hours after protamine, prolonged aPTT out of proportion to other parameters, treated with additional protamine), platelet dysfunction from CPB-related receptor injury (treated with platelet transfusion targeting a count above roughly 100 x10^9/L in the actively bleeding patient), dilutional/consumptive coagulopathy (treated with FFP for PT/aPTT prolongation and cryoprecipitate for fibrinogen below roughly 150-200 mg/dL), and hyperfibrinolysis (identified by short lysis time on TEG/ROTEM). Point-of-care viscoelastic testing (TEG or ROTEM) is now standard of care at high-volume centers, guiding targeted factor replacement rather than empiric transfusion and reducing total blood product use.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient returns from CABG with 450 mL chest tube output in the first hour, HR 105, MAP 72 on norepinephrine, and normal coagulation labs. What is the correct management?",
      options: [
        "Give empiric FFP and platelets and observe for another hour",
        "Urgent surgical re-exploration for likely focal bleeding",
        "Increase the norepinephrine dose and monitor chest tube output for another 2 hours",
        "This is within normal limits and requires no action"
      ],
      answer: 1,
      explain: "Output of 450 mL in the first hour meets standard re-exploration thresholds, and normal coagulation parameters argue against a coagulopathic cause — pointing strongly toward a discrete surgical source (anastomotic site, cannulation hole, inadequately ligated side branch). Empiric factor or platelet replacement does not address a surgical source and only delays definitive treatment, increasing risk of hemodynamic collapse or tamponade. Urgent re-exploration is indicated."
    },
    {
      title: "Acute Kidney Injury: Mechanisms",
      html: `<p>AKI is among the most consequential complications after cardiac surgery, occurring in a substantial minority of patients by standard staging criteria, with a smaller fraction requiring renal replacement therapy. It independently predicts in-hospital mortality and long-term cardiovascular events, making its prevention and early recognition a priority rather than an afterthought.</p>
<p>The kidney is uniquely vulnerable to the physiologic insults of CPB through several converging mechanisms. Ischemia-reperfusion injury is central: non-pulsatile flow reduces renal medullary perfusion, and the outer medulla already operates near the edge of its oxygen delivery reserve because the countercurrent-concentrating mechanism in the thick ascending limb is metabolically demanding while medullary blood supply is comparatively sparse. Hemolysis from mechanical red cell lysis (roller pump, cardiotomy suction) releases free hemoglobin that is filtered at the glomerulus and precipitates in the tubular lumen, causing direct tubular injury — the dark, port-wine urine of significant hemolysis is a visible marker of this hemoglobin load. Atherosclerotic and air microemboli mobilized during cannulation and clamping lodge in the renal microvasculature, and the systemic inflammatory response to CPB (complement, cytokines, neutrophils) causes direct endothelial injury and impairs renal microvascular autoregulation. Any state of reduced cardiac output further compounds this by activating the renin-angiotensin-aldosterone system and causing compensatory afferent arteriolar vasoconstriction, worsening the medullary oxygen supply-demand balance.</p>
<p>The numbers explain why this complication earns priority attention. In the STS database, acute renal failure complicated 3.14% of CABG patients and 0.87% required dialysis — but the mortality attached to that dialysis-requiring group is staggering: in Chertow's 43,642-patient VA cohort, patients who needed dialysis had a 63.7% mortality versus 4.3% in those without ARF. Preoperative renal function is the dominant predictor, with ARF risk climbing stepwise with baseline creatinine (roughly 0.5%, 0.8%, 1.8%, and 4.9% for creatinine <1, 1.0–1.4, 1.5–1.9, and 2.0–2.9 mg/dL). Patients already on chronic dialysis carry an 11.4% operative mortality and a 73% complication rate — context that reframes "a little bump in creatinine" as an ominous signal rather than a nuisance lab.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Modifiable protective factors for post-CPB AKI: maintain MAP above roughly 65-70 mmHg on bypass, minimize total CPB duration, and avoid nephrotoxins (aminoglycosides, vancomycin, NSAIDs, recent contrast). No pharmacologic agent has demonstrated convincing AKI-prevention efficacy despite decades of study.</p>
</div>`
    },
    {
      title: "Managing Established AKI: Avoiding the Furosemide Reflex",
      html: `<p>The single most common management error in post-operative AKI is reaching for furosemide to treat oliguria without first determining whether that oliguria is pre-renal. Furosemide does not treat AKI, does not improve renal recovery, and does not reduce mortality in established AKI — and in a patient whose oliguria reflects low cardiac output, furosemide actively worsens the situation by reducing preload and further impairing renal perfusion. The correct first response to oliguria is always hemodynamic assessment: what is the MAP, the cardiac index, the filling pressures, and the clinical volume status?</p>
<p>Once pre-renal causes are excluded or optimized, management of established intrinsic tubular injury is supportive — maintain adequate perfusion, avoid further nephrotoxin exposure, and manage the metabolic consequences (hyperkalemia, acidosis, fluid overload) while awaiting recovery. Indications for renal replacement therapy include life-threatening hyperkalemia refractory to medical management, severe metabolic acidosis not corrected by hemodynamic optimization, fluid overload causing respiratory failure refractory to diuretics, and symptomatic uremia. Continuous RRT is preferred in hemodynamically unstable patients because it allows gradual fluid and solute removal without the hemodynamic swings of intermittent dialysis, and evidence indicates RRT should be initiated for clinical indications rather than at an arbitrary creatinine threshold — the <b>STARRT-AKI</b> trial found no benefit to an accelerated versus standard initiation strategy in critically ill patients with severe AKI, reinforcing that accelerated initiation at lower severity thresholds has not been shown to improve outcomes.</p>
<p>Cohn states the positive goal in one measurable line: maintain an adequate renal perfusion pressure and a urine output above 0.5 mL/kg/hr, and treat that urine output — <em>independent of diuretics</em> — as the best available bedside measure of kidney perfusion. That last qualifier is the whole point of avoiding the furosemide reflex: a diuretic can manufacture urine that looks reassuring while renal perfusion is actually falling, disconnecting your best monitor from the physiology it is meant to report.</p>
<p>It is also worth knowing that brisk diuresis (200–300 mL/hr) is normal in the hours right after CPB, so early good urine output is not proof the kidneys are safe. And the evidence bar is blunt: beyond optimizing hemodynamics and removing nephrotoxins, no agent — not furosemide, mannitol, dopamine, fenoldopam, or nesiritide — has convincing renoprotective effect. They may promote diuresis and help you avoid dialysis for volume or potassium, but they do not protect nephrons or change renal recovery, and using them as if they did is the error the "furosemide reflex" names.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient is oliguric on post-operative day 1 with a low cardiac index and elevated filling pressures. What is the most appropriate first step?",
      options: [
        "Correct the low-output hemodynamics before using diuresis",
        "Administer IV furosemide immediately to improve urine output",
        "Start renal replacement therapy immediately",
        "Restrict all IV fluids regardless of hemodynamic status"
      ],
      answer: 0,
      explain: "Furosemide does not treat established AKI, does not improve renal recovery, and reduces mortality benefit is not established — and in oliguria driven by low cardiac output, it worsens renal perfusion by further reducing preload. The correct approach is to identify and correct the underlying hemodynamic cause first (here, low cardiac output with elevated filling pressures suggests LV failure requiring inotropic support), rather than reflexively treating the urine output number."
    },
    {
      title: "Neurological Complications: Stroke",
      html: `<p>Perioperative stroke is among the most feared complications of cardiac surgery and a major determinant of long-term quality of life, arising through two principal mechanisms. Embolic stroke is most common and most often traced to aortic atherosclerosis — manipulation of the ascending aorta during cannulation, cross-clamping, partial-occlusion clamping for proximal anastomoses, or decannulation mobilizes atherosclerotic debris that embolizes to the cerebral circulation. Watershed or hemodynamic stroke occurs when systemic hypoperfusion during CPB causes infarction of border-zone territories between major cerebral arterial distributions, particularly in patients with limited collateral reserve from pre-existing intracranial or carotid disease.</p>
<p>Epiaortic ultrasound — a probe placed directly on the ascending aorta intraoperatively — identifies significant atheroma before manipulation and is more sensitive than TEE for this purpose. When severe plaque ("shaggy aorta") is found, surgical strategy is modified to avoid aortic manipulation: off-pump technique, fibrillatory arrest to avoid the cross-clamp, or hypothermic circulatory arrest to allow direct aortic inspection and replacement.</p>
<p>A new focal neurological deficit at extubation is a stroke until proven otherwise. Urgent non-contrast CT excludes hemorrhage before any anticoagulation decision, and diffusion-weighted MRI confirms and characterizes ischemic infarct. Permissive hypertension (maintaining MAP at the upper end of normal) is appropriate for acute ischemic stroke to preserve perfusion to the ischemic penumbra, and systemic thrombolysis is relatively contraindicated within roughly 14 days of major surgery given bleeding risk.</p>
<p>The epidemiology sharpens the stakes: stroke after cardiac surgery runs 1–4% depending on the procedure, and in a 19,224-patient New York series the post-CABG stroke rate was 1.4% with a 24.8% mortality in that group — one in four. The independent predictors read like a preoperative screening checklist — calcified aorta, prior stroke, age, carotid disease, CPB duration, renal failure, peripheral vascular disease, smoking, and diabetes — and the intraoperative mechanisms span macroemboli (air, debris, thrombus), microemboli (leukocyte/platelet/fibrin aggregates), and nonpulsatile cerebral hypoperfusion.</p>
<p>The acute-management specifics matter because the usual stroke playbook is constrained here. These patients are <em>not</em> candidates for IV thrombolytics given fresh surgical bleeding risk; the option is endovascular thrombectomy in selected embolic occlusions within roughly 6–8 hours (up to 24 hours for posterior-circulation strokes), and a CT angiogram is required first to define the occlusion. Beyond focal stroke, subtler injury is far more common: a pooled analysis found a measurable cognitive deficit in 22.5% of patients at two months, and delirium affects up to 50% — for which sedation with dexmedetomidine causes less delirium and better outcomes than benzodiazepines, a cheap, modifiable lever on a common problem.</p>`
    },
    {
      type: "checkpoint",
      q: "Why is epiaortic ultrasound preferred over TEE for identifying ascending aortic atherosclerosis before aortic manipulation?",
      options: [
        "Epiaortic ultrasound is less invasive than TEE",
        "TEE cannot be used once the chest is open",
        "More sensitive imaging of ascending-aortic atheroma",
        "Epiaortic ultrasound requires no additional equipment"
      ],
      answer: 2,
      explain: "Epiaortic ultrasound, performed with a probe placed directly on the ascending aortic surface, provides superior resolution of the ascending aorta compared to TEE (which images the aorta from the esophagus, at a distance, with some blind spots). Its greater sensitivity for atheroma detection directly changes intraoperative strategy — severe plaque prompts avoidance of cannulation, clamping, or proximal anastomotic manipulation at that site, or a switch to off-pump or circulatory arrest technique to reduce embolic stroke risk."
    },
    {
      title: "Post-Operative Atrial Fibrillation",
      html: `<p>POAF is the single most common complication after cardiac surgery, occurring in a substantial proportion of patients after isolated CABG and at even higher rates after combined CABG-plus-valve procedures. It characteristically peaks on post-operative days 2–3, driven by pericardial inflammation from surgical manipulation, atrial stretch from volume loading, electrolyte derangements (hypokalemia and hypomagnesemia are the most immediately correctable triggers), sympathetic activation, and the electrical remodeling that follows CPB.</p>
<p>POAF matters for three reasons: it causes hemodynamic compromise in patients dependent on atrial contribution to ventricular filling (diastolic dysfunction, hypertrophied ventricles, reduced EF); it carries a meaningfully increased risk of in-hospital stroke during the acute episode, particularly in the first 24-48 hours; and it prolongs hospitalization. Prevention is the most cost-effective strategy — beta-blockers, continued or restarted as early as possible post-operatively, are the most evidence-supported preventive measure, and maintaining potassium above 4.0 mEq/L and magnesium above 2.0 mg/dL throughout the post-operative period is essential.</p>
<p>Management of established POAF begins with correcting reversible precipitants (electrolytes, pain, fever, hypoxia, anemia, hypovolemia), which may terminate the arrhythmia without further intervention. For rate control, IV metoprolol is first-line; amiodarone is used when beta-blockers are contraindicated or ineffective and has the added benefit of potentially converting AF to sinus rhythm. Hemodynamically unstable POAF requires immediate synchronized electrical cardioversion regardless of duration. POAF lasting beyond 48 hours warrants consideration of anticoagulation, balancing thromboembolic risk against post-surgical bleeding risk; most POAF reverts to sinus rhythm within 6-8 weeks of surgery.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Beta-blockers are the single most evidence-supported POAF prevention strategy and should be restarted as early as safely possible after surgery. Maintaining K+ above 4.0 and Mg above 2.0 mg/dL throughout the post-operative course is a low-cost, high-yield habit.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "What is the most evidence-supported strategy for preventing post-operative atrial fibrillation after cardiac surgery?",
      options: [
        "Prophylactic electrical cardioversion on post-operative day 1",
        "Withholding all analgesia to reduce sympathetic tone",
        "Routine prophylactic anticoagulation starting immediately after surgery",
        "Continue beta-blockade and maintain potassium and magnesium"
      ],
      answer: 3,
      explain: "Beta-blockers, continued perioperatively and restarted as early as possible after surgery, are the most evidence-supported pharmacologic strategy for reducing POAF incidence. Maintaining potassium above 4.0 mEq/L and magnesium above 2.0 mg/dL addresses the most immediately correctable electrophysiologic triggers. Prophylactic cardioversion and routine early anticoagulation are not standard prevention strategies, and pain control (not withholding analgesia) reduces the sympathetic activation that contributes to POAF."
    },
    {
      title: "Heart Block, Sternal Wound Infection, and Mediastinitis",
      html: `<p>New high-degree AV block after cardiac surgery indicates injury to the conduction system, with risk concentrated after AVR (calcium disruption injuring the His bundle beneath the non-coronary cusp), mitral valve surgery (sutures near the triangle of Koch), and septal myectomy (left bundle branch injury along the LVOT septum). Temporary epicardial pacing wires bridge the patient while conduction recovers, which occurs in most cases within 5–7 days as peri-operative edema and inflammation subside; persistent complete heart block beyond this window is a strong indication for permanent pacemaker implantation, and delaying this decision only increases lead-related complication and infection risk from prolonged temporary wire dependency.</p>
<p>Sternal wound complications exist on a spectrum. Superficial sternal wound infection involves skin and subcutaneous tissue only, presenting with erythema, warmth, and drainage roughly 5-14 days post-operatively, and is treated with wound opening, debridement, and culture-directed antibiotics. Deep sternal wound infection (mediastinitis) is a surgical emergency with substantial mortality even with treatment, diagnosed by purulent mediastinal drainage, positive mediastinal tissue culture, sternal instability with fever, or CT evidence of mediastinal widening with sepsis. Risk factors include bilateral IMA harvest (devascularizes the sternum, whose dominant blood supply is the IMA), diabetes, obesity, prolonged CPB, prolonged vasopressor support, and prolonged ventilation. Treatment requires surgical debridement of all infected tissue — antibiotics alone are never sufficient — followed by vacuum-assisted closure, delayed primary closure, or flap reconstruction for extensive tissue loss, plus prolonged culture-directed IV antibiotics.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Persistent complete heart block beyond 5-7 days post-operatively should prompt permanent pacemaker referral rather than continued observation — the window for spontaneous recovery narrows substantially after this point, and prolonged temporary wire dependence carries its own risks.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "What distinguishes deep sternal wound infection (mediastinitis) from superficial sternal wound infection, and what is the essential first step in treatment?",
      options: [
        "Mediastinitis is diagnosed purely by fever; treatment is IV antibiotics alone",
        "Superficial infection always requires sternal rewiring while mediastinitis does not",
        "There is no clinically meaningful distinction between the two",
        "Deep infection involves sternum or mediastinum and requires urgent debridement"
      ],
      answer: 3,
      explain: "Deep sternal wound infection (mediastinitis) involves the sternum and deeper structures, diagnosed by purulent drainage from the sternum/mediastinum, organisms cultured from mediastinal tissue, sternal instability with fever, or mediastinal widening with sepsis on CT — versus superficial infection limited to skin and subcutaneous tissue. Mediastinitis is a surgical emergency requiring debridement of all infected and devitalized tissue as the essential first step; it cannot be managed with antibiotics alone, unlike superficial infection which may resolve with local wound care and antibiotics."
    },
    {
      title: "GI Complications and Prolonged Ventilation",
      html: `<p>Gastrointestinal complications after cardiac surgery are less common than cardiac, renal, or pulmonary complications but carry disproportionately high mortality when they occur, largely because low-flow states during and after CPB place the splanchnic circulation — already operating with less physiologic reserve than the coronary or cerebral circulation — at particular risk. Mesenteric ischemia is the most feared GI complication: it should be suspected in any post-operative patient with abdominal pain out of proportion to exam findings, unexplained lactic acidosis, or feeding intolerance in the setting of a low cardiac output state or a prolonged, complicated bypass run. Early recognition is critical because mesenteric ischemia progresses rapidly from a reversible low-flow insult to transmural bowel necrosis, and diagnostic delay is the single largest driver of its high mortality.</p>
<p>Other recognized GI complications include stress-related mucosal bleeding (routine stress ulcer prophylaxis with a proton pump inhibitor or H2-blocker is standard in mechanically ventilated cardiac surgery patients), post-operative ileus (common after prolonged surgery and opioid use, generally managed supportively), and hepatic dysfunction or "shock liver" from a period of profound low cardiac output — recognized by a sharp transaminase rise that typically peaks within 24-72 hours and improves as hemodynamics normalize.</p>
<p>Prolonged mechanical ventilation — generally defined as ventilator dependence extending well beyond the early extubation window most patients achieve — is one of the most common reasons for extended ICU stay and is usually multifactorial rather than attributable to a single cause. Systematic evaluation addresses respiratory mechanics and muscle strength, adequacy of gas exchange, adequacy of cardiac output (poor perfusion impairs respiratory muscle function), pain and sedation burden, nutritional status, diaphragm function (phrenic nerve injury), and secretion management. A spontaneous breathing trial with a low Rapid Shallow Breathing Index identifies patients ready for extubation, and each additional day of mechanical ventilation compounds the risk of ventilator-associated pneumonia, delirium, and further deconditioning.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Abdominal pain out of proportion to exam findings, unexplained lactic acidosis, or feeding intolerance after a low cardiac output episode should immediately raise concern for mesenteric ischemia — a low threshold for imaging or surgical consultation saves bowel and saves lives.</p>
</div>`
    },
    {
      title: "A Standard Post-Operative Orders Framework",
      html: `<p>Every cardiac surgery ICU patient benefits from a consistent, systems-based order set that mirrors the A-B-C-D-E assessment framework — building orders around organ systems rather than writing them ad hoc reduces the chance that an entire category is simply forgotten on a busy handoff. A representative framework:</p>
<ul>
  <li><b>Monitoring:</b> Continuous ECG/telemetry, arterial line, CVP (and PA catheter if placed), continuous pulse oximetry, hourly vital signs and chest tube output, temperature probe.</li>
  <li><b>Respiratory:</b> Ventilator settings with lung-protective tidal volumes, extubation criteria and SBT protocol, incentive spirometry once extubated, chest physiotherapy as needed.</li>
  <li><b>Cardiovascular:</b> Target MAP and rationale (higher after aortic surgery), vasoactive infusion titration parameters, pacing wire settings and backup mode, target rhythm.</li>
  <li><b>Fluids and electrolytes:</b> Maintenance fluid rate, potassium and magnesium replacement protocols (target K+ above 4.0, Mg above 2.0 for AF prevention), glucose target (roughly 140-180 mg/dL) with insulin protocol.</li>
  <li><b>Hematology:</b> Chest tube output monitoring with defined re-exploration thresholds, scheduled coagulation labs, TEG/ROTEM if available, DVT prophylaxis once bleeding risk is acceptable.</li>
  <li><b>Renal:</b> Strict input/output monitoring, daily weights, creatinine trending, avoidance of nephrotoxins.</li>
  <li><b>Infection prevention:</b> Peri-operative antibiotic duration, sternal wound care protocol, line and drain care, temperature monitoring for early infection signs.</li>
  <li><b>Pain, sedation, and delirium prevention:</b> Multimodal analgesia (scheduled acetaminophen, cautious NSAID use, opioids as needed), minimizing benzodiazepines in favor of propofol or dexmedetomidine, delirium screening, day-night cycle preservation, early mobilization on post-operative day 1-2.</li>
  <li><b>GI prophylaxis and nutrition:</b> Stress ulcer prophylaxis while mechanically ventilated, early enteral nutrition once feasible.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>A systems-based order set (monitoring, respiratory, cardiovascular, fluids/lytes, hematology, renal, infection prevention, pain/sedation/delirium, GI/nutrition) mirrors the A-B-C-D-E deterioration framework — the same categories you assess are the same categories you should be ordering for.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why is organizing post-operative orders around organ systems (monitoring, respiratory, cardiovascular, fluids/electrolytes, hematology, renal, infection prevention, pain/sedation) preferable to writing orders ad hoc?",
      options: [
        "It is required by regulatory bodies for all ICU admissions",
        "It eliminates the need for a physician to review orders daily",
        "A systems checklist prevents omission of whole care domains",
        "It is faster to write than any other format regardless of patient complexity"
      ],
      answer: 2,
      explain: "A systems-based order set mirrors the structured A-B-C-D-E framework used for bedside assessment, so the same mental checklist used to evaluate a deteriorating patient is the same checklist used to build their standing orders. This reduces the risk that an entire domain of care — such as magnesium repletion for AF prevention, delirium-prevention measures, or DVT prophylaxis timing — is simply forgotten because it wasn't top-of-mind at the moment orders were written."
    }
  ]
};

/* ---------------- Sequence 4 depth merge (Day 13 — Cardiac ICU & Complications) ---------------- */

window.LESSONS["d13-vaso"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the LCOS algorithm in order, and the vasoplegia ladder by mechanism",
    html: "<p>Low cardiac output syndrome (cardiac index &lt; ~2.0–2.2 L/min/m² with rising lactate, oliguria, cool clamped-down periphery) is worked <b>in a fixed order</b>, because reaching for contractility before you have fixed preload and rhythm treats the wrong lever:</p><ol><li><b>Preload</b> — fill to an optimal filling pressure (and rule out the tamponade/pneumothorax that masquerade as it).</li><li><b>Afterload</b> — a clamped-down high-SVR ventricle is unloaded, not vasoconstricted further.</li><li><b>Contractility</b> — dobutamine or epinephrine for the LV, milrinone for the RV, dosed to effect.</li><li><b>Rate/rhythm</b> — restore rate and AV synchrony (pace, cardiovert).</li><li><b>Tamponade → ischemia → mechanical support</b> — exclude the surgical/coronary cause, then escalate to IABP/Impella/ECMO when pharmacology is maxed.</li></ol><p><b>Vasoplegia is a different disease</b> — low SVR with a <i>high or normal</i> cardiac index and a high SvO₂ — and its ladder is climbed by mechanism, each rung a different pathway so that failure of one is a reason to add the next, not to keep pushing the first:</p><ul><li><b>Norepinephrine</b> first-line (α-adrenergic tone).</li><li><b>Vasopressin ~0.03–0.04 units/min</b> — V1-receptor, catecholamine-sparing, works where acidosis has blunted adrenergic response.</li><li><b>Methylene blue ~1.5–2 mg/kg</b> — inhibits the NO–cGMP pathway driving the vasodilation.</li><li><b>Hydroxocobalamin ~5 g</b> — an NO-scavenging rescue for the refractory case.</li><li><b>Angiotensin II</b> — for catecholamine-refractory vasoplegia, recognizing the cardiac-surgery evidence is a <i>post-hoc</i> ATHOS-3 signal, not a dedicated trial.</li></ul><div class='kbox kbox-study'><div class='kbox-tag'>STUDY</div><p>Before you climb the vasopressor ladder, prove it is vasoplegia: low SVR, <i>high/normal</i> CI, high SvO₂. If the CI is <i>low</i>, you are staring at pump failure, and stacking vasoconstrictors on a failing ventricle raises afterload and buries it.</p></div>"
  }
);

window.LESSONS["d13-lcos"].chunks.push(
  {
    level: 5,
    title: "PGY-5 mastery: reading mixed post-op shock and the bedside-reopening decision",
    html: "<p><b>Real post-op shock rarely respects one box.</b> The deteriorating fresh post-op patient is often <i>mixed</i> — some vasoplegia, some ventricular dysfunction, a little tamponade, an ongoing surgical bleed — and the senior's skill is to <b>act on the leading diagnosis while hedging the others</b>. The discriminators: a <b>low SVR with high SvO₂</b> leans vasoplegia; <b>high filling pressures with low SvO₂ and global hypokinesis</b> lean pump failure; <b>equalizing, rising filling pressures with a narrowing pulse pressure and a suddenly quiet chest tube</b> lean tamponade; <b>a rate-positive bleed with falling hematocrit</b> leans surgical. Because a transthoracic echo can <b>miss a localized posterior clot</b> compressing the left atrium, a convincing tamponade picture with a non-diagnostic surface echo is not reassurance — it is an indication for TEE or direct exploration.</p><p><b>The reopening decision is a timing decision.</b> The mortality of a bedside sternotomy for tamponade or arrest-imminent instability is dominated by <i>how late</i> it is done. Reopen the chest <b>at the bedside before the arrest</b> — profound tamponade physiology refractory to volume/pressors, or a peri-arrest instability you cannot explain — rather than after, when a coded patient with an open chest has a far worse outcome. Every cardiac ICU keeps a sternotomy tray at the bedside for exactly this. Distinguish this from the case where <b>the pump itself is the problem</b>: there the answer is mechanical support (IABP/Impella/ECMO), not a knife. The judgment is choosing which of those two roads you are on, fast, from a mixed picture.</p><div class='kbox kbox-danger'><div class='kbox-tag'>VIVA</div><p><i>\"Fresh post-CABG, cardiac index 1.8, CVP and PA-diastolic rising and converging, chest tubes that dropped from 200 to 20 mL/hr, falling pressure — leading diagnosis, fastest confirmation, next five minutes?\"</i> Answer: clot-mediated tamponade (converging filling pressures + the sudden drainage stop is the tell); confirm with bedside echo/TEE but do not let a non-diagnostic surface study delay you; ready the sternotomy tray and re-explore/decompress at the bedside before arrest, correcting coagulopathy in parallel.</p></div>"
  }
);

/* ---------------- Rotation-readiness merge: pre-rounding daily checklist (from guide front matter) ---------------- */

window.LESSONS["d13-lcos"].chunks.push(
  {
    title: "The pre-rounding daily checklist: walking into rounds with a mental model",
    html: `<p>The SBAR handoff gets the patient <i>into</i> the ICU; the daily pre-round is how you keep a mental model current every morning after. Go through the same checklist systematically for each patient so you arrive at rounds knowing each patient's status, trajectory, and the single decision that needs to be made today. The habit is to read <b>trends, not snapshots</b> — a MAP of 65 means something different if it is falling on rising pressor.</p>
<ul>
  <li><b>Overnight events:</b> Did anything change — a new vitals trend, new labs, a nursing note, a call to the team?</li>
  <li><b>Vital signs (trend):</b> HR and rhythm (in sinus? new arrhythmia?); BP and MAP (target met? widened pulse pressure suggesting tamponade?); temperature (febrile, or hypothermic from low output?); SpO₂ and FiO₂ — calculate the <b>P/F ratio</b> if ventilated.</li>
  <li><b>Hemodynamics:</b> vasopressor and inotrope doses and their trend (weaning or escalating?); if a PA catheter is in, CO/CI, SVR, PCWP, SvO₂; urine output over the last 4 hours and the day's total — is the patient making urine?</li>
  <li><b>Respiratory:</b> vent mode and settings (or, if extubated, work of breathing and O₂ requirement); chest-tube drainage volume and character (sanguinous, serosanguinous, serous); bilateral breath sounds?</li>
  <li><b>Drains and lines:</b> chest tube output last shift and any sudden increase; Foley output; central and arterial lines — site appearance and days in (infection risk); pacing wires sensing and capturing appropriately?</li>
  <li><b>Labs:</b> CBC (Hgb/Hct trend, platelets); BMP (Cr trending vs baseline, <b>K⁺ targeted 4.0–4.5</b> in cardiac patients, glucose); coagulation (INR, PTT, TEG/ROTEM if available); lactate (rising or clearing?); BNP or troponin if indicated.</li>
  <li><b>Medications:</b> anticoagulation and whether it is dosed for renal function; DVT prophylaxis ordered? beta-blocker and statin on board? sedation — is today an extubation candidate?</li>
  <li><b>Wound and exam:</b> sternal wound (erythema, drainage, instability?); leg wound if there was vein harvest; extremity perfusion if on IABP or peripheral cannulation.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Close every patient's pre-round with one sentence: <b>what is the single most important thing that needs to happen for this patient today?</b> That answer is what you lead with on rounds.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "On morning pre-round a post-op patient has a MAP of 66 mmHg. Which observation should most change your assessment?",
    options: [
      "MAP fell from 78 while norepinephrine doubled",
      "The MAP is a single number within the target range, so no further context is needed",
      "The patient's roommate was extubated overnight",
      "The MAP was measured with a cuff rather than an arterial line"
    ],
    answer: 0,
    explain: "Pre-rounding is about trends, not snapshots. A MAP of 66 that is falling while the vasopressor requirement is climbing signals a patient heading in the wrong direction — the trajectory matters far more than whether a single value sits inside the target range. Reading the trend is what lets you walk into rounds with an accurate mental model and a specific plan."
  }
);

/* ---------------- Rotation-readiness merge: patient presentation scripts (from guide front matter) ---------------- */

window.LESSONS["d13-complications"].chunks.push(
  {
    title: "Presenting the cardiac surgery patient: two scripts",
    html: `<p>A good presentation is a compressed argument: it tells the listener who the patient is, what was done, how they are trending, and the one decision on the table today — in that order. Cardiac surgery presentations have a predictable shape, and following it makes you sound organized even on a patient you picked up an hour ago. The two settings below cover most of what you will present as a student.</p>
<p><b>Post-operative floor / step-down patient.</b> Lead with the identifier and operation, then the pre-operative indication and risk, then the operative details, then the post-op course and today's plan:</p>
<div class="kbox study">
  <div class="kbox-tag">FLOOR / STEP-DOWN SCRIPT</div>
  <p>"[Name] is a [age]-year-old [M/F] with [relevant comorbidities] who underwent [procedure] on [date], now <b>post-operative day [#]</b>. Pre-operatively [he/she] presented with [indication — e.g. 'critical three-vessel CAD with preserved EF' or 'severe symptomatic AS, valve area 0.7 cm²']; the <b>STS-predicted mortality was [X]%</b>. The operation was [on/off pump]; <b>cross-clamp time [X] min, bypass time [X] min</b>, with [relevant intraoperative events — e.g. 'TEE showed good valve function before chest closure']. Post-operatively [he/she] was extubated on POD [#], is now on [room air / X L O₂], in [rhythm], HR [X], BP [X/X]. Overnight: [events]. Today's plan: [specific action items — wound check, imaging, med changes, PT/OT, anticipated discharge]."</p>
</div>
<p><b>ICU patient, post-operative day 1.</b> The ICU presentation front-loads the hemodynamics and the active issues, mirroring the SBAR handoff structure:</p>
<div class="kbox study">
  <div class="kbox-tag">ICU (POD-1) SCRIPT</div>
  <p>"[Name] is a POD-[#] [age]-year-old following [procedure], currently intubated on [AC/SIMV/PSV] at [rate/TV/PEEP/FiO₂], SpO₂ [X]. Hemodynamics: HR [X] in [rhythm], MAP [X] on [vasopressor/inotrope at dose], urine output last 4 hours [X mL/hr]. Chest-tube output [X] mL last shift, currently [character]; drains [in/out]. Labs notable for Hgb [X] (baseline [X]), Cr [X] (baseline [X]), K [X], lactate [X], INR [X]. Key issues today: [1, 2, 3 — e.g. 'slowly weaning vasopressors,' 'oliguria — reassess after diuresis trial,' 'extubation candidate this morning if criteria met.']"</p>
</div>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Two numbers make a cardiac presentation sound competent: the <b>STS-predicted mortality</b> (frames the pre-op risk) and the <b>cross-clamp / bypass times</b> (frame the operative insult and the myocardial-protection concern). Always have both ready.</p>
</div>`
  }
);

/* ============================================================================
   2021 REVASCULARIZATION GUIDELINE — PHARMACOTHERAPY AFTER REVASCULARIZATION,
   POAF PROPHYLAXIS, SECONDARY PREVENTION & OUTCOMES (Sections 13.3, 14, 15, 16).
   Merged into Day-13 (Cardiac ICU / Postoperative) lesson d13-complications.
   ============================================================================ */

window.LESSONS["d13-complications"].chunks.push(
  {
    title: "Postoperative Atrial Fibrillation: Beta-Blocker and Amiodarone Prophylaxis",
    html: `<p>Postoperative atrial fibrillation (POAF) complicates roughly a third of CABG cases and is associated with stroke, longer stay, and worse outcomes. The 2021 guideline is specific about preventing it.</p>
<ul>
  <li><b>Beta-blockers after CABG — COR 1 (LOE B-R):</b> start <b>as soon as possible</b> postoperatively to reduce the incidence or clinical sequelae of POAF.</li>
  <li><b>Preoperative beta-blockers — COR 2a:</b> in patients without contraindication, giving beta-blockers before surgery can reduce POAF.</li>
  <li><b>Preoperative amiodarone — COR 2a:</b> reasonable to reduce POAF, useful when beta-blockers alone are insufficient or contraindicated.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>The guideline is careful about what beta-blockers do <b>not</b> reliably prevent: their role in reducing postoperative myocardial ischemia, stroke, AKI, or ventricular arrhythmia is <b>uncertain</b> (COR 2b), and any effect on in-hospital/30-day mortality is only COR 2b. The firm, COR 1 indication is <b>POAF prevention</b>.</p>
</div>`
  },
  {
    title: "Antiplatelet and Risk-Factor Therapy After Revascularization",
    html: `<p>Every revascularized patient needs a secondary-prevention regimen; the guideline separates what protects the grafts/stents from what protects the patient long-term.</p>
<ul>
  <li><b>Aspirin after CABG — COR 1 (LOE A):</b> 100–325 mg within 6 h, continued indefinitely, to reduce SVG closure and cardiovascular events; DAPT for 1 year may improve vein-graft patency (COR 2b).</li>
  <li><b>Shorter DAPT after PCI — COR 2a:</b> 1–3 months then P2Y12 monotherapy in selected patients to reduce bleeding.</li>
  <li><b>Risk-factor control:</b> guideline-directed medical therapy — high-intensity statin, blood-pressure and diabetes control, and lifestyle change — is the backbone that revascularization does not replace.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>In patients with SIHD and normal LV function, routine chronic oral beta-blockers are not beneficial to reduce cardiovascular events after complete revascularization (COR 3: No Benefit).</b> Beta-blockers remain indicated for POAF prevention after CABG, for reduced-EF patients, and post-MI — but not as reflexive lifelong therapy in the normal-EF, completely revascularized patient.</p>
</div>`
  },
  {
    title: "Cardiac Rehabilitation, Smoking Cessation, and Psychological Care",
    html: `<p>The guideline devotes an entire section (15) to what happens <b>after</b> the stent or graft — and grades several of these interventions COR 1 (LOE A), as strong as any procedural recommendation.</p>
<ul>
  <li><b>Cardiac rehabilitation — COR 1 (LOE A):</b> prescribe a comprehensive program (home- or center-based) before discharge or at the first outpatient visit — it reduces deaths and readmissions and improves quality of life. Patient education about CVD risk factors is COR 1.</li>
  <li><b>Smoking cessation — COR 1 (LOE A):</b> combine behavioral intervention <b>plus</b> pharmacotherapy; begin during hospitalization with supportive follow-up for at least 1 month after discharge.</li>
  <li><b>Psychological care — COR 1:</b> in patients with depression, anxiety, or stress, treat with cognitive behavioral therapy, counseling, and/or pharmacotherapy to improve quality of life and cardiac outcomes; screening for depression is reasonable (COR 2b).</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Cardiac rehabilitation is one of the most under-prescribed COR 1 (LOE A) interventions in all of cardiology. A revascularization is not "finished" at extubation or at the femoral/radial closure — the referral to rehab, the cessation plan, and the mood screen are part of the standard of care.</p>
</div>`
  },
  {
    title: "Revascularization Outcomes: Registries, Quality, and Volume",
    html: `<p>The final section ties individual care to system accountability.</p>
<ul>
  <li><b>Participate in clinical data registries — COR 1:</b> cardiac surgery and PCI programs should participate in state/regional/national registries (e.g., the STS database, NCDR) and receive periodic risk-adjusted outcome reports as a quality strategy.</li>
  <li><b>Quality-improvement program — COR 2a:</b> routinely review institutional and individual-operator outcomes, provide peer review of complicated cases, and perform random case reviews.</li>
  <li><b>Volume — COR 2b:</b> smaller-volume programs may consider affiliating with a high-volume center to improve care.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Risk-adjusted registry participation is how the STS score you calculate preoperatively closes the loop: predicted risk is compared with observed outcomes, letting programs (and individual operators) see whether they are performing as expected on funnel/VLAD plots.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A 62-year-old with normal LV function has undergone complete revascularization with CABG and is ready for discharge. Which post-revascularization intervention is a COR 1 (LOE A) recommendation that is frequently under-prescribed?",
    options: [
      "Lifelong chronic beta-blockade for cardiovascular event reduction",
      "Routine annual coronary angiography surveillance",
      "Referral to a comprehensive cardiac rehabilitation program",
      "Prophylactic ICD implantation"
    ],
    answer: 2,
    explain: "Comprehensive cardiac rehabilitation (home- or center-based) is COR 1 (LOE A) after revascularization to reduce deaths and readmissions and improve quality of life — and it is one of the most under-prescribed strong recommendations in cardiology. In contrast, routine chronic beta-blockers in a normal-EF, completely revascularized SIHD patient are COR 3: No Benefit for event reduction (though beta-blockers are still used to prevent postoperative atrial fibrillation after CABG)."
  }
);
