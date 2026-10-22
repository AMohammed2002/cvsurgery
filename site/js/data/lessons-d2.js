window.LESSONS = window.LESSONS || {};

window.LESSONS["d2-o2"] = {
  id: "d2-o2",
  day: 3,
  ord: 1,
  title: "Myocardial O2 Supply & Demand",
  short: "O2 Balance",
  minutes: 16,
  chunks: [
    {
      title: "The Fundamental Problem: A High-Extraction Organ",
      html: `<p>Most organs coast through daily life pulling only about a quarter of the oxygen out of the blood that passes through them — they keep a huge reserve in the tank, so when they suddenly need more, they simply extract more. The heart does not have that luxury. Even at rest it already strips <b>60–70%</b> of the oxygen out of every drop of coronary blood, running its extraction almost maxed out. Picture a factory that already unloads nearly every crate off each delivery truck: it cannot get more from a truck that is already almost empty. Its <em>only</em> way to get more oxygen is to send <b>more trucks</b> — that is, to <b>increase coronary blood flow</b>.</p>
<p>Cohn frames the same physiology from the flow side. Resting coronary blood flow is <b>slightly under 1 mL per gram of muscle per minute</b>, delivered through a capillary bed so dense there is roughly <b>one capillary per myocyte</b> (intercapillary distance ~17 μm at rest). When demand rises, the heart's answer is not more extraction — it is more flow: myocardial blood flow can climb to <b>three or four times normal</b>, achieved by dilating the resistance arterioles <em>and</em> recruiting capillaries that sit closed at rest, which also shortens the diffusion distance to each myocyte. The signalling molecule that couples the two is <b>adenosine</b>: it is generated whenever oxygen supply cannot keep ADP rephosphorylated to ATP, it relaxes arteriolar smooth muscle (A₂ receptors), and it fades the moment supply catches up — a near-perfect demand-follows-supply thermostat.</p>
<p>This single constraint is the seed of all ischemic heart disease. Because the heart cannot buy time by extracting more, anything that raises demand, drops supply, or (worst of all) does both at once drives the balance straight toward the ischemic threshold, with no extraction reserve to cushion the fall.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Heart: ~<b>60–70% O2 extraction</b> at rest (near-maximal). Most organs: ~25%. This means the heart cannot compensate for increased demand by extracting more O2 — it must increase <b>flow</b>. Resting flow ~1 mL/g/min; peak flow ~3–4× that (coronary flow reserve), via arteriolar vasodilation + capillary recruitment, coupled to demand by <b>adenosine</b>.</p>
</div>`
    },
    {
      title: "Determinants of Myocardial Oxygen Demand (MVO2)",
      html: `<p>Myocardial oxygen demand is determined by four factors, each representing a distinct therapeutic target when treating ischemia. Understanding each determinant tells you exactly why certain medications work and which clinical scenarios are most dangerous.</p>
<ol>
  <li><b>Heart rate</b> — the single most important determinant. Each contraction requires ATP. Tachycardia is doubly harmful: it increases demand AND shortens diastole (reducing supply — see next section). This is why rate control is the most powerful anti-ischemic strategy.</li>
  <li><b>Contractility (inotropy)</b> — more forceful contractions consume more ATP. Inotropic support in the cardiac ICU must be weighed against the ischemic cost of increased contractility.</li>
  <li><b>Wall stress</b> — governed by LaPlace's law: wall stress = (pressure × radius) / (2 × wall thickness). High afterload (hypertension) increases the pressure component; ventricular dilation increases the radius component. Both increase O2 demand.</li>
  <li><b>Preload</b> — contributes to wall stress via ventricular radius; excessive preload in a dilated ventricle increases demand.</li>
</ol>
<p>Cohn is emphatic about the hierarchy among these four: minute work (heart rate × stroke volume × developed pressure) is <em>not</em> the direct determinant of oxygen consumption — <b>wall tension is the primary determinant</b>. The proof is energetic: during <b>isovolumic contraction</b> the heart burns ATP building pressure while delivering <em>no</em> kinetic energy to the blood at all, and the cost of actually <em>ejecting</em> the blood is only about <b>20–30% of the isovolumic cost</b>. That is why <b>an increase in afterload demands more energy than an equivalent increase in volume ejected</b> — pressure work is metabolically far more expensive than flow work. It also explains the surgical relevance: excess systemic pressure loads a compromised ventricle punishingly, while an intra-aortic balloon pump helps precisely by shifting this balance (lower afterload, better coronary flow).</p>
<p>Two more numbers anchor the picture. Roughly <b>60–70% of the heart's ATP is spent on contraction</b> (another 10–15% just maintaining membrane ion gradients), so contraction dominates the energy budget — and the heart is a strikingly <em>inefficient</em> engine, converting only about <b>5–40%</b> of consumed oxygen into external work depending on whether it is doing pressure, volume, or velocity work. Dilation makes it worse: as cavity size grows, each ejection produces less reduction in wall stress, so efficiency falls exactly when the failing heart can least afford it.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p><b>LaPlace's Law</b>: Wall stress = (P × r) / (2h). LV hypertrophy (increased h) compensates for pressure overload by reducing wall stress per unit of muscle. But hypertrophied muscle itself increases total O2 demand. And because wall tension — not "work" — is the true driver, <b>afterload is the most oxygen-costly lever</b>: lowering it (vasodilators, IABP) buys demand relief cheaply.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "According to LaPlace's law, a patient develops LV hypertrophy in response to chronic hypertension. Which component of wall stress is being compensated, and what is the trade-off?",
      options: [
        "Radius is decreased; trade-off is reduced preload",
        "Pressure is reduced; trade-off is reduced contractility",
        "Greater wall thickness; trade-off is higher oxygen demand and diastolic stiffness",
        "Heart rate is reduced; trade-off is increased diastolic filling time"
      ],
      answer: 2,
      explain: "LaPlace's law: wall stress = (pressure x radius) / (2 x wall thickness). Concentric hypertrophy increases wall thickness (h), which reduces wall stress per unit of muscle — compensating for increased afterload. However, the increased myocardial mass as a whole consumes more total oxygen, narrows coronary flow reserve (subendocardial compression), and creates diastolic stiffness. This is the hemodynamic paradox of hypertrophic compensation."
    },
    {
      title: "Determinants of Myocardial Oxygen Supply",
      html: `<p>The supply side has one quirk that dominates everything else: <b>timing</b>. In most tissues, blood flows in whenever arterial pressure is high — during systole. The left coronary system is the exact opposite. When the LV squeezes in systole, it clamps down on the coronary vessels buried in its own wall like a fist closing around a garden hose, throttling flow at the very moment aortic pressure peaks. So the left ventricle can only <b>drink between beats</b>: it fills its own coronaries <em>during diastole</em>, the relaxation pause. Anything that steals that pause — above all a fast heart rate — starves the left heart of supply.</p>
<p>Cohn describes exactly why this happens layer by layer. The extravascular compressive force during systole is <b>greatest in the subendocardium — equal to or above intracavitary pressure — and falls off toward the subepicardium</b>. So during systole the subepicardial vessels are preferentially perfused while the subendocardial vessels are markedly hypoperfused, and toward end-systole flow actually <b>reverses</b> in the surface epicardial vessels. The net result: the <b>subendocardium is perfused essentially only in diastole</b>, whereas the subepicardium gets both phases. The right coronary artery is the instructive contrast — because RV intramural pressures are low and extravascular compression is nearly absent, <b>RCA flow is relatively constant across the whole cardiac cycle</b>, which is why the left ventricle, not the right, is the one held hostage to diastolic time.</p>
<p>The four determinants of myocardial oxygen supply:</p>
<ol>
  <li><b>Coronary blood flow</b> — driven by the diastolic driving pressure: aortic diastolic pressure minus left ventricular end-diastolic pressure (LVEDP). Both low aortic diastolic pressure (hypotension, aortic regurgitation) and elevated LVEDP (LV failure) reduce this gradient.</li>
  <li><b>Duration of diastole</b> — at higher heart rates, diastole shortens proportionally more than systole. At HR 150 bpm, diastolic filling time per minute is dramatically reduced.</li>
  <li><b>Oxygen content of blood</b> — arterial pO2 and hemoglobin concentration. Anemia lowers the ischemic threshold by reducing O2 carrying capacity per unit of flow.</li>
  <li><b>Coronary vascular tone</b> — regulated by endothelium (nitric oxide, prostacyclin), metabolic factors (adenosine, CO2, H+, hypoxia — all vasodilatory), neural factors, and myogenic responses.</li>
</ol>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>The right coronary system fills in both systole AND diastole (RV pressures are low). The <b>left</b> coronary system fills <b>primarily in diastole</b>. Tachycardia and low aortic diastolic pressure are the two greatest threats to left coronary supply.</p>
</div>`
    },
    {
      title: "The Ischemic Threshold and Clinical Scenarios",
      html: `<p>The ischemic threshold is the combination of supply and demand factors at which ischemia develops. It is not a fixed point — it shifts based on multiple concurrent physiological variables. The clinical implication is that multiple simultaneous perturbations are far more dangerous than any single factor in isolation.</p>
<p>There is also a fixed anatomic loser in this contest: the <b>subendocardium</b>. Cohn gives three converging reasons it is always the first territory to become ischemic — it faces the <b>greatest systolic compressive forces</b>, it has the <b>smallest remaining flow reserve</b> (its vessels sit near-maximally vasodilated even at baseline), and it carries the <b>greatest regional oxygen demand</b> from wall tension and segmental shortening. This vulnerability shows up in the autoregulation numbers: the subepicardium keeps flow constant down to a distal coronary pressure of about <b>40 mmHg</b>, but the subendocardium autoregulates only down to roughly <b>60–70 mmHg</b> — below that, subendocardial flow falls off linearly with pressure. And when LV end-diastolic pressure climbs to <b>25–35 mmHg</b>, the subendocardial vessels are compressed in <em>diastole too</em>, not just systole — which is why a stiff, failing, or hypertrophied ventricle poisons its own supply. <b>Aortic regurgitation</b> is the perfect storm: it simultaneously <em>lowers</em> diastolic aortic pressure (the driving head) and <em>raises</em> intraventricular diastolic pressure (the back-pressure), squeezing the subendocardium from both ends.</p>
<p>Factors that lower the ischemic threshold:</p>
<ul>
  <li>Tachycardia (increases demand, decreases supply simultaneously)</li>
  <li>Hypotension (decreases diastolic driving pressure)</li>
  <li>Anemia (reduces O2 content per unit flow)</li>
  <li>Hypertension (increases afterload and wall stress)</li>
  <li>LV hypertrophy (increases O2 demand, compresses subendocardial vessels)</li>
  <li>Elevated LVEDP (reduces diastolic driving pressure)</li>
  <li>Fixed coronary stenosis (limits flow augmentation)</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>A cardiac ICU patient with <b>HR 130 + MAP 55 + Hgb 7.0</b> has tachycardia (demand up, diastole short), hypotension (supply down), and anemia (O2 content down) — <b>triple threat</b>. Address all three simultaneously in a known CAD patient.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A post-cardiac surgery patient in the ICU has HR 130 (atrial fibrillation), MAP 58 mmHg, and Hgb 7.0 g/dL. Which of the following best explains why this combination is particularly dangerous for myocardial oxygen balance?",
      options: [
        "Tachycardia alone is sufficient to cause ischemia in any cardiac surgery patient",
        "The low hemoglobin causes coronary artery vasoconstriction",
        "Atrial fibrillation always causes complete coronary obstruction",
        "Higher demand, shorter diastole, lower coronary pressure, and less oxygen content"
      ],
      answer: 3,
      explain: "Each component independently worsens the oxygen balance: tachycardia (AF with RVR) increases demand through more contractions per minute AND reduces supply by shortening diastolic filling time. Hypotension reduces the diastolic driving pressure (AoDP - LVEDP) that perfuses the left coronary system. Anemia reduces the oxygen content of each milliliter of blood. Together these create a critical supply-demand mismatch that can cause ischemia or infarct extension even in arteries without critical stenoses."
    },
    {
      title: "Coronary Flow Reserve and Pressure-Wire Assessment",
      html: `<p>A healthy coronary artery keeps a large emergency capacity in reserve — Cohn puts it at <b>three to four times</b> resting flow (some texts quote 4–5×), <!-- VERIFY: Cohn 5th ed. states coronary flow can increase to "three or four times normal"; other sources cite 4–5× --> a capacity called the <b>coronary flow reserve (CFR)</b>. It is generated the same way maximal demand is met physiologically: dilation of the resistance arterioles plus recruitment of capillaries closed at rest. Think of a highway that runs one lane at rest but can open several extra lanes at rush hour. This reserve is exactly why a stenosis can hide: at rest, blood still trickles through until the narrowing passes ~70% diameter (~90% of the cross-sectional area), so a resting angiogram looks reassuring. But those extra "rush-hour" lanes are lost far earlier — hyperemic flow is already choked at a 40–50% stenosis — which is why stress testing exposes lesions that looked merely moderate on the picture. Remember, too, that the reserve is not evenly distributed: the subendocardium spends its reserve first (its vessels are already near-maximally dilated), so it is the layer where CFR is exhausted earliest as a lesion tightens.</p>
<p>This is the whole rationale for measuring pressure across a lesion. <b>Fractional Flow Reserve (FFR)</b> puts a wire past the stenosis and, under maximal hyperemia (IV adenosine forces all the lanes open), compares the pressure beyond the narrowing to the pressure in the aorta. An <b>FFR of 0.80</b> is read literally: this artery can muster only 80% of the flow a normal, unobstructed artery would deliver — the other 20% is being eaten by the stenosis.</p>
<ul>
  <li><b>FFR less than or equal to 0.80:</b> Hemodynamically significant stenosis — revascularization recommended (DEFER, FAME trials)</li>
  <li><b>FFR greater than 0.80:</b> Deferring intervention is safe — event rates equivalent to stenting</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p><b>iFR (instantaneous wave-free ratio)</b>: A resting index that correlates with FFR, avoids adenosine. Useful when adenosine is contraindicated. Threshold for significance: iFR less than or equal to 0.89.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "FFR-guided PCI was compared to angiography-guided PCI in the FAME trial. What was the key finding that changed clinical practice?",
      options: [
        "FFR guidance reduced events by avoiding PCI of nonischemic lesions",
        "FFR-guided PCI was inferior because it missed hemodynamically significant lesions",
        "FFR-guided PCI required more stents per patient than angiography-guided PCI",
        "The two strategies had equivalent outcomes, so angiography alone was confirmed as sufficient"
      ],
      answer: 0,
      explain: "The FAME trial (2009) demonstrated that FFR-guided multi-vessel PCI significantly reduced major adverse cardiovascular events (MACE) compared to angiography-guided PCI. The mechanism: angiography-guided PCI often stents lesions that appear significant but are not hemodynamically significant (FFR greater than 0.80). Stenting non-significant lesions adds procedural risk and restenosis without benefit. FFR-guided strategy avoids these unnecessary stents. The DEFER trial earlier established that deferring PCI when FFR is greater than 0.80 is safe."
    }
  ]
};

window.LESSONS["d2-ischemia"] = {
  id: "d2-ischemia",
  day: 3,
  ord: 2,
  title: "Ischemic Cascade & ACS",
  short: "Ischemia",
  minutes: 17,
  chunks: [
    {
      title: "The Ischemic Cascade: Order of Events",
      html: `<p>Ischemia does not announce itself with chest pain first — pain is nearly the <em>last</em> thing to happen. When supply falls short of demand, the myocardium fails in a fixed, predictable order, like a building's alarms tripping one after another: the most sensitive detector in the basement goes off long before anyone upstairs smells smoke. Knowing that order is what lets you catch ischemia early — on a Doppler trace or a TEE image — instead of waiting for the patient to clutch their chest, by which point you are already several steps down the cascade.</p>
<p>The events, from earliest-detectable to catastrophic:</p>
<ol>
  <li><b>Diastolic dysfunction (reduced LV relaxation)</b> — first detectable abnormality; E/A reversal on Doppler echo; develops within seconds of ischemia onset</li>
  <li><b>Regional wall motion abnormality (RWMA)</b> — the ischemic segment stops contracting normally; hypokinesis, akinesis, or dyskinesis detectable on echo or TEE</li>
  <li><b>ECG changes</b> — ST depression (subendocardial ischemia) or elevation (transmural ischemia); T-wave inversions; these appear AFTER RWMA</li>
  <li><b>Angina (chest pain)</b> — notably later in the cascade; some patients, especially those with diabetic autonomic neuropathy, experience no pain even with significant ischemia ("silent ischemia")</li>
  <li><b>Hemodynamic compromise</b> — significant ischemia eventually reduces cardiac output and blood pressure</li>
  <li><b>Cell death</b> — irreversible injury begins at 20–30 minutes of complete ischemia; full infarction by 4–6 hours</li>
</ol>
<p>Cohn's pathology puts hard timings on that last step, and they are the whole basis of "time is muscle." Irreversible injury begins at roughly <b>20–30 minutes</b> of complete ischemia; if flow is restored before that, infarction is <em>prevented</em> outright. After it, necrosis spreads as a <b>wavefront</b> — starting in the mid-subendocardium (and the papillary muscles farthest from collateral flow) and marching outward toward the subepicardium. About <b>50% of the "area at risk" is dead within 3–4 hours</b>, and the final transmural extent is fixed by <b>6–12 hours</b>. That descending curve of salvageable muscle is exactly why the practical limit for meaningful salvage is ~3–4 hours and why the clinical target is a <b>90-minute door-to-balloon time</b>: every minute inside the window converts area-at-risk back into living myocardium, and every minute past it is muscle traded for scar.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p><b>Intraoperative TEE</b> is more sensitive for detecting ischemia than ECG because RWMA appears BEFORE ECG changes in the cascade. A new RWMA in a specific territory after coming off bypass should immediately raise suspicion of a graft problem — even with no ECG changes yet.</p>
</div>`
    },
    {
      title: "The Role of TEE in Intraoperative Ischemia Detection",
      html: `<p>The clinical implication of the ischemic cascade ordering is that transesophageal echocardiography (TEE) is a more sensitive intraoperative monitor for ischemia than ECG. RWMA develops as step 2 of the cascade, while ECG changes are step 3. In the context of cardiac surgery, this distinction has immediate therapeutic implications.</p>
<p>The physiology behind that ordering is the same subendocardial vulnerability from the supply lesson: regional contraction depends most on the subendocardial layer, which is the first to lose flow reserve and the first to stop shortening — so a wall stops thickening on the screen before the surface ECG has integrated enough ischemic tissue to deflect the ST segment. The standard monitoring view is the <b>transgastric mid-papillary short-axis</b>, because a single cross-section there samples all three major coronary territories at once — the anterior/septal (LAD), lateral (LCx), and inferior (RCA) walls — so a new regional deficit is instantly mapped to a vessel. Grading runs from normal → hypokinesis (reduced thickening) → akinesis (none) → dyskinesis (paradoxical outward bulge), with loss of wall <em>thickening</em>, not just inward motion, the more reliable sign (tethering can drag a dead segment inward). The corollary is a discipline point: a <b>normal ECG never excludes ischemia</b> once TEE shows a new wall-motion deficit.</p>
<p>A new RWMA after separation from bypass should trigger the following differential:</p>
<ul>
  <li><b>Graft dysfunction</b> — technical error, graft kinking, spasm, or anastomotic problem</li>
  <li><b>Coronary spasm</b> — especially after internal mammary harvesting</li>
  <li><b>Air embolism</b> to a coronary ostium (particularly RCA, which is uppermost when the heart is deairing)</li>
  <li><b>Native vessel disease</b> in a non-bypassed territory</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>After coming off bypass: a new inferior-posterior RWMA suggests RCA/graft problem; new anterior RWMA suggests LAD/LIMA problem; new lateral RWMA suggests LCx/OM graft problem. Match the RWMA territory to the coronary anatomy.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient comes off cardiopulmonary bypass after three-vessel CABG. TEE shows a new inferior wall motion abnormality, but the ECG shows no changes. What is the most appropriate next step?",
      options: [
        "Urgently evaluate RCA graft flow and return to bypass if needed",
        "Reassure the team that the ECG is normal and proceed with chest closure",
        "Administer amiodarone for presumed arrhythmia",
        "Increase inotropic support and observe for 30 minutes"
      ],
      answer: 0,
      explain: "A new RWMA on TEE represents step 2 of the ischemic cascade and precedes ECG changes (step 3). A new inferior wall motion abnormality after CABG suggests dysfunction of the RCA/PDA graft territory — possibly graft kinking, anastomotic failure, spasm, or air embolism to the RCA (which is the most superior coronary ostium and vulnerable to residual air). The normal ECG is reassuring but does NOT exclude significant ischemia. Immediate evaluation including return to bypass if needed is the correct response."
    },
    {
      title: "Myocardial Stunning, Hibernation, and Infarction",
      html: `<p>Three distinct states of myocardial dysfunction occupy a spectrum from fully reversible to irreversible. Understanding which state a patient's dysfunctional territory represents determines whether revascularization will improve function and whether surgical risk is justified.</p>
<p><b>Myocardial Stunning — the dazed boxer.</b> Flow has already been restored, but the muscle is still reeling from the brief hit and refuses to contract properly for a while. The tissue is alive and well-perfused; it just needs time (and some inotropic propping-up) to shake it off. The mechanism is calcium overload and free-radical injury during reperfusion, and recovery takes hours to days. This is precisely the state of the whole heart after cardioplegic arrest — it comes off bypass "stunned," which is why temporary inotropes are so often needed before it finds its feet.</p>
<p><b>Myocardial Hibernation — the bear in winter.</b> Faced with a chronically poor food supply (chronic underperfusion), the muscle deliberately powers down, dialling its contraction back to match the meagre blood it is getting — trading function for survival. It is alive but idling, and like a bear in spring it will <b>wake up and work again once you restore the supply</b>. That is the entire physiological argument for offering CABG to a patient with a weak EF but viable myocardium: you are not repairing dead muscle, you are feeding starving muscle back to life.</p>
<p>Cohn sharpens the two reversible states. <b>Stunning</b> is defined as reversible post-ischemic dysfunction that persists <em>despite restored flow</em>, lasting hours to days after a brief ischemic hit — and it is not just a bypass phenomenon; the same stunning follows PCI, unstable angina, and even emotional/physical stress. <b>Hibernation</b> he pins to a specific triad: (1) a persistent wall-motion abnormality, (2) demonstrably <b>low myocardial blood flow</b>, and (3) <b>evidence of retained viability</b> in at least part of the segment. All three must be present — that triad is precisely what viability imaging (dobutamine echo, late-gadolinium MRI, PET) is trying to confirm before committing a high-risk patient to CABG, because hibernating tissue recovers when flow returns while scar never will.</p>
<p><b>Myocardial Infarction:</b> Irreversible cell death. Cohn's timeline: necrosis is invisible on routine histology under ~6 hours, myocytes are progressively replaced, and the infarct becomes a <b>dense collagenous scar mature by ~6–8 weeks</b>. Large infarctions cause adverse LV remodeling — the LV dilates and changes shape (eccentric hypertrophy), further impairing function. One surgery-specific extreme is worth knowing: after severe <em>global</em> ischemia (a badly protected cross-clamp), the LV can seize into a massive tetanic contraction — the dreaded <b>"stone heart."</b></p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>S-H-I Triangle:</b> <b>Stunned</b> = alive, flow restored, recovers with TIME. <b>Hibernating</b> = alive, flow chronically low, recovers with REVASCULARIZATION (triad: RWMA + low flow + viability). <b>Infarcted</b> = dead, replaced by SCAR. Only the first two benefit from intervention.</p>
</div>`
    },
    {
      title: "The STICH Trial: CABG in Reduced EF",
      html: `<p>The STICH (Surgical Treatment for Ischemic Heart Failure) trial directly addressed one of the most contested questions in cardiac surgery: does CABG benefit patients with severe LV dysfunction (EF less than or equal to 35%) and CAD? This question is practically important because these patients have high surgical risk, and the benefit of revascularization over medical therapy was debated for decades before STICH provided definitive data.</p>
<p>The physiologic premise is everything the previous chunks built toward: a low-EF ischemic ventricle is rarely all scar. It is a patchwork of infarcted muscle mixed with <b>hibernating</b> myocardium — viable tissue that has powered down to survive chronic hypoperfusion (Cohn's triad: persistent wall-motion abnormality + low flow + retained viability). Revascularizing that ventricle is a bet that enough hibernating muscle will wake up to justify the operative risk in a fragile patient. STICH was designed to test whether that bet pays off.</p>
<p>STICH compared CABG plus optimal medical therapy (OMT) vs. OMT alone in patients with CAD and EF less than or equal to 35%. Key results:</p>
<ul>
  <li>At 5 years: CABG reduced cardiovascular mortality but the primary endpoint (all-cause death) was not significant initially — a "negative" trial on first read.</li>
  <li><b>STICHES (10-year extension):</b> with longer follow-up, CABG significantly reduced all-cause mortality AND cardiovascular death/hospitalization — the benefit needed years to emerge because early operative risk is front-loaded while the survival gain accrues later.</li>
  <li><b>The viability paradox:</b> counterintuitively, the STICH viability substudy did <em>not</em> show that viability testing identified who got the survival benefit — so while hibernation is the mechanistic rationale, a positive viability scan is not a strict gate for offering surgery. Judgment, not a single test, drives the decision.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p><b>STICH/STICHES Takeaway:</b> CABG + OMT reduces all-cause mortality and hospitalizations in patients with EF less than or equal to 35% and CAD at 10 years. This is the evidence base for surgical revascularization in low-EF patients with viable or potentially viable myocardium.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A 66-year-old man has EF 28%, NYHA Class III dyspnea, and three-vessel CAD. Cardiac MRI with late gadolinium enhancement shows 60% of the LV territory is viable (hibernating) with 40% scar. What does the concept of hibernation predict about his response to CABG?",
      options: [
        "No benefit expected because scar represents 40% of the LV",
        "Viable hibernating myocardium may recover after revascularization",
        "Hibernating myocardium never recovers function because it is metabolically inactive",
        "Recovery depends entirely on the type of prosthesis used, not viability"
      ],
      answer: 1,
      explain: "Hibernating myocardium is viable but chronically dysfunctional tissue adapted to chronically reduced perfusion, so regional function may improve after revascularization. STICH/STICHES supports a long-term CABG survival benefit in appropriately selected patients with ischemic cardiomyopathy and EF less than or equal to 35%; however, the STICH viability substudy did not show that viability testing selected who received that survival benefit."
    },
    {
      title: "Reperfusion Injury and Cardioprotection",
      html: `<p>Here is one of the great paradoxes of cardiology: the moment you reopen a blocked artery — the very thing you have been racing to do — can itself inflict a second wave of damage. It is like throwing open the doors to rescue people from a smoke-filled room and having the sudden rush of oxygen flash the smouldering embers into open flame. The ischemic tissue has been sitting in a chemically primed, calcium-loaded state, and the abrupt return of oxygenated blood ignites a burst of destructive chemistry that was not happening during the quiet of the occlusion itself. This is <b>reperfusion injury</b>.</p>
<p>Mechanisms of reperfusion injury:</p>
<ul>
  <li><b>Calcium overload:</b> Damaged cell membranes allow massive calcium influx on reperfusion, activating destructive enzymes (proteases, phospholipases)</li>
  <li><b>Mitochondrial permeability transition pore (mPTP) opening:</b> A critical event that commits the cell to death; triggered by calcium, reactive oxygen species</li>
  <li><b>Oxygen free radical burst:</b> Restoration of O2 in metabolically dysregulated cells generates destructive reactive oxygen species</li>
  <li><b>Neutrophil activation:</b> Inflammatory cells recruited to reperfused tissue cause additional injury</li>
</ul>
<p>Cohn adds the histologic fingerprints that make reperfusion injury concrete rather than abstract. Reperfused myocardium characteristically shows <b>contraction bands</b> — transverse eosinophilic lines of hypercontracted sarcomeres, the direct anatomic signature of the calcium flood pouring in with the restored blood. It may also show <b>intramyocardial hemorrhage</b> from damaged microvasculature, and — critically — the <b>no-reflow phenomenon</b>: even after the epicardial artery is open, endothelial/interstitial edema and platelet–neutrophil plugs occlude the microvessels, so blood never actually reaches the tissue you thought you had rescued. That is why a "patent artery" on angiography does not guarantee a perfused myocardium.</p>
<p>Reperfusion injury accounts for up to 50% of final infarct size. In cardiac surgery, cardioplegia is specifically designed to minimize ischemia-reperfusion injury by arresting the heart at controlled temperature, pH, and calcium concentration — and the timing principle is the same one that governs PCI: reperfusion before the ~20–30-minute irreversible threshold prevents infarction outright, while later reperfusion only salvages the reversibly-injured myocytes still sitting outside the leading edge of the necrosis wavefront.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p><b>Remote Ischemic Preconditioning (RIPC)</b> — brief limb ischemia with a BP cuff before CPB — was studied as cardioprotection but large RCTs (ERICCA, RIPHeart) failed to show significant benefit in cardiac surgery patients. The related concept, <b>ischemic preconditioning</b> (brief ischemia making tissue tolerate a later longer insult), is real biology but has proven hard to convert into a bedside cardioprotective drug.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Which sequence correctly describes the ischemic cascade in order from first to last event?",
      options: [
        "ECG changes → chest pain → diastolic dysfunction → wall motion abnormality → hemodynamic compromise → cell death",
        "Cell death → diastolic dysfunction → wall motion abnormality → ECG changes → chest pain",
        "Chest pain → ECG changes → diastolic dysfunction → hemodynamic compromise → cell death",
        "Diastolic dysfunction → wall-motion change → ECG change → pain → hemodynamic failure → necrosis"
      ],
      answer: 3,
      explain: "The correct ischemic cascade order is: (1) Diastolic dysfunction — earliest detectable change, within seconds; (2) Regional wall motion abnormality — echo-detectable, before ECG changes; (3) ECG changes — ST depression or elevation; (4) Angina — notably late, absent in up to 30% with diabetic neuropathy; (5) Hemodynamic compromise — reduced CO/BP; (6) Cell death — begins at 20–30 minutes, complete infarction by 4–6 hours. This order explains why TEE is more sensitive than ECG for intraoperative ischemia detection."
    }
  ]
};

window.LESSONS["d2-angina"] = {
  id: "d2-angina",
  day: 3,
  ord: 3,
  title: "Stable Angina: Workup & Medical Management",
  short: "St.Angina",
  minutes: 14,
  chunks: [
    {
      title: "Stable Angina: Mechanism and Presentation",
      html: `<p>Stable angina is the symptom of a <em>fixed</em> narrowing — a road permanently down to one lane. At 3 a.m., with no traffic, that single lane is plenty and the patient feels nothing; the trouble only comes at rush hour, when demand surges (a flight of stairs, a cold wind, an argument) and the narrowed vessel simply cannot widen to let more blood through. Crucially, unlike the plaque rupture of ACS, this lesion is <b>not</b> breaking open — it is a stable bottleneck. That is why the hallmark of stable angina is its <b>predictability</b>: the same amount of exertion brings on the same pain, which then melts away with rest or nitroglycerin within a few minutes, every time.</p>
<p>Cohn puts the exact numbers on when a stenosis starts to bite, and they explain the whole clinical picture. Because a healthy artery has flow reserve to spare, myocardial perfusion stays adequate at rest until the lumen's cross-sectional area is cut by about <b>75%</b> — at which point flow can no longer keep up with the demand of <em>exertion</em> (exertional angina). Only when the reduction reaches about <b>90%</b> does flow become inadequate even <em>at rest</em> (rest angina, an ominous sign the lesion has crossed toward critical). A saving grace is that occlusions which develop <b>slowly stimulate collateral vessels</b> to grow, which is why one patient tolerates a 90% lesion with only mild symptoms while another with an abrupt occlusion infarcts — the difference is how much time the myocardium had to build detours. The plaque itself is a <b>lipid core capped by a collagen-rich fibrous cap</b>; in stable angina that cap is thick and intact, so the lesion narrows predictably rather than rupturing — the exact opposite of the thin-capped "vulnerable" plaque behind ACS, and the reason statins (which thicken and strengthen the cap) matter even when symptoms are controlled.</p>
<p>Understanding stable angina through the supply-demand framework established in the previous lessons makes the logic of every diagnostic and therapeutic step self-evident:</p>
<ul>
  <li><b>Typical angina:</b> Substernal pressure/tightness, radiation to left arm or jaw, precipitated by exertion or stress, relieved by rest or sublingual nitroglycerin within 3–5 minutes — all three criteria present.</li>
  <li><b>Atypical angina:</b> Two of three criteria. More common in women, diabetics, and elderly patients who may present with dyspnea, nausea, or fatigue as anginal equivalents.</li>
  <li><b>Non-cardiac chest pain:</b> One or zero of three criteria.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>In the cardiac surgery context, stable angina is the most common indication for coronary angiography and eventual CABG referral. The cardiologist's goal is to determine whether the burden of disease justifies revascularization over optimized medical therapy.</p>
</div>`
    },
    {
      title: "Diagnostic Workup: From Risk Stratification to Angiography",
      html: `<p>The workup of stable angina proceeds logically from non-invasive risk stratification to invasive coronary angiography, with the decision to proceed guided by the likelihood of high-risk anatomy that would benefit from revascularization. Not every patient with stable angina needs a catheterization — the goal is to identify those with anatomy where intervention changes outcomes, not just symptoms.</p>
<p>Two framing ideas make the menu below rational rather than a list to memorize. First, <b>pre-test probability</b> governs which test earns its keep: a low-probability patient is best served by a test with a high <em>negative</em> predictive value (coronary CT angiography, which reliably rules disease <em>out</em>), while an intermediate-probability patient benefits most from a functional test that quantifies <em>how much</em> ischemia is present. Second — and this is the through-line of the whole day — each stress modality simply <b>samples a different rung of the ischemic cascade</b>. Nuclear perfusion imaging detects the earliest supply–demand mismatch (a flow deficit); stress echo detects the <b>regional wall-motion abnormality</b> of cascade step 2; the exercise ECG detects the <b>ST-segment change</b> of step 3. That ordering is exactly why stress echo and perfusion imaging are more sensitive than the exercise ECG — they interrogate the cascade <em>before</em> the ECG has changed — and why a modality that also images wall motion can double as a viability test with low-dose dobutamine.</p>
<p>Non-invasive testing options:</p>
<ul>
  <li><b>Exercise ECG (ETT):</b> Most accessible; highest value when high Duke Treadmill Score. Limited by inability to exercise, LBBB, or baseline ECG changes (digoxin, LVH). High-risk features: ST depression at low workload, large territory of ischemia, hypotensive response, exercise-induced VT.</li>
  <li><b>Stress echocardiography:</b> Exercise or dobutamine; detects RWMA (step 2 of cascade). More sensitive and specific than ETT. Can assess viability with low-dose dobutamine protocol.</li>
  <li><b>Nuclear stress testing (myocardial perfusion imaging):</b> Adenosine or regadenoson pharmacologic stress; detects perfusion defects. Excellent for quantifying ischemic burden (perfusion territory).</li>
  <li><b>Coronary CT angiography (CCTA):</b> High negative predictive value for ruling out CAD; increasingly first-line for stable chest pain in low-to-intermediate risk patients (NICE guidelines).</li>
  <li><b>Invasive coronary angiography with FFR:</b> Gold standard; required before CABG; FFR used to assess functional significance of intermediate lesions.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p><b>ISCHEMIA Trial (2020):</b> In stable CAD with moderate-to-severe ischemia, initial invasive strategy did NOT reduce the primary composite MACE endpoint vs. conservative medical management at 3–4 years. Invasive strategy DID improve angina and quality of life. Left main disease and EF less than 35% were excluded.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "The ISCHEMIA trial compared initial invasive strategy vs. conservative medical therapy in stable CAD with moderate-to-severe ischemia. What was the key conclusion regarding mortality?",
      options: [
        "Invasive strategy significantly reduced all-cause mortality at 3–4 years",
        "Conservative medical therapy was superior for long-term survival",
        "The trial was terminated early due to overwhelming benefit in the invasive arm",
        "No mortality advantage, but better angina relief"
      ],
      answer: 3,
      explain: "ISCHEMIA (2020) randomized 5,179 patients with stable CAD and moderate-to-severe ischemia to invasive (angiography + revascularization) vs. conservative (OMT, angiography reserved for failure) strategy. The primary composite endpoint (CV death, MI, hospitalization for unstable angina, heart failure, or resuscitated cardiac arrest) was not significantly different at a median of 3.2 years. However, invasive strategy significantly improved angina frequency and quality of life. Patients with left main disease and EF less than 35% were excluded from the trial."
    },
    {
      title: "Medical Management of Stable Angina",
      html: `<p>Optimal medical therapy (OMT) for stable angina targets the supply-demand imbalance through multiple complementary mechanisms. Understanding the pharmacological rationale for each drug class connects directly to the physiological framework of the preceding lessons — every medication either reduces demand, increases supply, or prevents progression of the underlying atherosclerosis.</p>
<p><b>Anti-anginal medications (symptom relief and demand reduction):</b></p>
<ul>
  <li><b>Beta-blockers (first-line):</b> Reduce heart rate and contractility (reduce MVO2 on two axes simultaneously). Also increase diastolic filling time (improve supply). Goal HR at rest: 55–60 bpm. Do NOT abruptly discontinue — risk of rebound tachycardia and ischemia.</li>
  <li><b>Nitrates (sublingual for acute relief; long-acting for prevention):</b> Venodilators at low dose (reduce preload and wall stress) and coronary vasodilators. Sublingual NTG should relieve stable angina within 3–5 minutes. <b>Tolerance develops with continuous use</b> — require nitrate-free intervals (8–12 hours).</li>
  <li><b>Calcium channel blockers (CCBs):</b> Amlodipine (dihydropyridine) reduces afterload; diltiazem/verapamil (non-dihydropyridines) reduce HR and contractility. Useful when beta-blockers are contraindicated or as add-on therapy.</li>
  <li><b>Ranolazine:</b> Late sodium current inhibitor; reduces calcium overload. Add-on therapy for refractory angina, does not affect HR or BP.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Never combine a <b>non-dihydropyridine CCB</b> (diltiazem, verapamil) with a <b>beta-blocker</b> without careful monitoring — risk of complete heart block from combined AV nodal suppression. Dihydropyridine CCBs (amlodipine, nifedipine) can be safely combined with beta-blockers.</p>
</div>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p>Every anti-anginal wins the same battle — it either <b>lowers demand</b> or <b>raises supply</b>. Beta-blockers and non-DHP CCBs slow the rate (demand ↓ <em>and</em> a longer diastole for supply ↑); nitrates dilate veins and coronaries (wall stress ↓, supply ↑); ranolazine cuts calcium overload. Two "-DHPs" that both slow the node — <b>diltiazem + a beta-blocker = Double the block</b> — is the combination to fear.</p>
</div>`
    },
    {
      title: "Risk Modification and Secondary Prevention",
      html: `<p>Anti-anginal drugs relieve symptoms but do not reduce the risk of future MI or death — that is the role of secondary prevention medications, which target the underlying atherosclerotic disease process. Every patient with stable CAD requires these regardless of whether they undergo revascularization.</p>
<p>The single most important insight here comes straight from the plaque biology: the lesion that kills is usually not the tight, stable one causing the angina but a <b>non-obstructive, thin-capped "vulnerable" plaque</b> that ruptures without warning — which is why treating symptoms does nothing for prognosis, and why a therapy that <em>stabilizes the cap</em> does. Cohn is explicit that lipid lowering by diet or drugs <b>stabilizes plaque by increasing the thickness and strength of the fibrous cap</b> — the collagenous shell that, when it thins under the enzymatic attack of macrophage-derived matrix metalloproteinases, is what ruptures. This is the mechanistic reason high-intensity statins reduce hard events far beyond what their LDL number alone would predict: they are re-armoring the exact structure whose failure causes acute MI, and their anti-inflammatory effect blunts the inflammatory cascade driving cap degradation. Anti-anginals move the supply-demand line; secondary prevention changes the natural history of the disease.</p>
<p><b>Medications that reduce cardiovascular events (EVIDENCE-BASED):</b></p>
<ul>
  <li><b>Antiplatelet therapy:</b> Aspirin 75–100 mg daily — reduces MI risk by ~30% in CAD. Clopidogrel as an alternative if aspirin intolerant. Note: dual antiplatelet therapy (DAPT) is required after stenting but not for CABG beyond the perioperative period.</li>
  <li><b>Statins (high-intensity):</b> Atorvastatin 40–80 mg or rosuvastatin 20–40 mg. Reduce LDL and provide plaque-stabilizing effects beyond cholesterol lowering (anti-inflammatory). Goal LDL less than 70 mg/dL in established CAD, less than 55 mg/dL in very high risk.</li>
  <li><b>ACE inhibitors or ARBs:</b> Reduce cardiovascular events in CAD patients with EF less than 40% or diabetes. HOPE trial established benefit of ramipril in high-risk CAD patients.</li>
  <li><b>Beta-blockers (post-MI):</b> Reduce reinfarction and sudden cardiac death. Essential after any MI — the anti-ischemic benefit overlaps with anti-anginal benefit.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Pre-operative beta-blockers should be <b>continued</b> through cardiac surgery — abrupt discontinuation risks rebound tachycardia and hypertension. Statins should also be continued perioperatively; there is evidence they reduce post-operative AF incidence.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A 65-year-old man with stable angina and three-vessel CAD takes aspirin, atorvastatin, and sublingual NTG. He asks why he needs to take sublingual NTG within a specific time limit. What is the expected timeframe for resolution of stable angina after sublingual nitroglycerin?",
      options: [
        "Within 30–60 seconds",
        "Within 3–5 minutes",
        "Within 15–20 minutes",
        "Within 1 hour"
      ],
      answer: 1,
      explain: "Stable angina caused by a fixed coronary stenosis is characteristically relieved by sublingual nitroglycerin within 3–5 minutes. The mechanism: nitroglycerin causes systemic venodilation (reducing preload and wall stress) and direct coronary vasodilation, restoring the supply-demand balance. If chest pain does NOT resolve within 5 minutes of sublingual NTG (or after 2–3 doses), it should not be assumed to be stable angina — ACS must be considered and emergency evaluation is required."
    },
    {
      title: "From Medical Therapy to CABG: The Decision Framework",
      html: `<p>The decision to refer a patient with stable angina for CABG rather than continued medical management or PCI is the culmination of integrating anatomy (coronary territory at risk), physiology (degree of ischemia, LV function), and outcomes data (landmark trials). Understanding this framework is essential for anyone in the cardiac surgical team.</p>
<p>The unifying thread across the indications below is a single question: <b>how much viable myocardium is in jeopardy, and how complete/durable a fix does each option offer?</b> That is why the anatomic patterns that favour CABG all describe <em>large territories or diffuse, complex disease</em>. Diabetics are the sharpest example — their atherosclerosis is diffuse and progressive, so spot-stenting individual lesions leaves untreated segments primed to fail, whereas surgical grafts distal to the disease protect the whole downstream bed (the mechanistic reading of FREEDOM's CABG survival advantage). High SYNTAX-score three-vessel disease says the same thing in a score: many lesions, bifurcations, calcification, and chronic occlusions — anatomy where the durability and completeness of surgical revascularization outperform a percutaneous point-fix. And left main disease subtends so much myocardium that an interim event is catastrophic, which is why it anchors the Class I survival indications.</p>
<p><b>Indications favoring CABG over PCI or medical therapy alone:</b></p>
<ul>
  <li><b>Left main stenosis greater than or equal to 50%:</b> Strong Class I indication for revascularization; CABG preferred over PCI in most anatomical patterns (SYNTAX score, EXCEL, NOBLE trials)</li>
  <li><b>Three-vessel CAD with high SYNTAX score:</b> Complex anatomy with multiple, diffuse lesions; CABG demonstrates superior long-term outcomes (SYNTAX trial: 3-vessel disease with SYNTAX score greater than 22)</li>
  <li><b>Three-vessel CAD + EF less than or equal to 35%:</b> STICH/STICHES showed survival benefit of CABG over OMT at 10 years</li>
  <li><b>Diabetes + multivessel CAD:</b> FREEDOM trial: CABG superior to PCI in diabetics with multivessel disease (lower MACE, lower mortality at 5 years)</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>The Heart Team model: revascularization decisions for complex CAD are made jointly by an interventional cardiologist AND a cardiac surgeon, using the SYNTAX score and patient-specific factors. A patient referred for CABG should have had this discussion before you see them in the OR.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A 59-year-old diabetic woman with stable angina has three-vessel CAD (LAD, LCx, RCA) and a SYNTAX score of 32. Her cardiologist proposes PCI to all three vessels. The cardiac surgeon recommends CABG instead. Which trial evidence supports the surgeon's recommendation?",
      options: [
        "ISCHEMIA trial: shows invasive strategy reduces MACE in stable three-vessel CAD",
        "FAME 2 trial: FFR-guided PCI is superior to CABG in all patients with multivessel disease",
        "FREEDOM: CABG outperformed PCI in diabetic multivessel disease",
        "DEFER trial: deferring intervention is safe regardless of the number of vessels involved"
      ],
      answer: 2,
      explain: "The FREEDOM trial (2012) compared CABG vs. PCI (with drug-eluting stents) specifically in patients with diabetes mellitus and multivessel CAD. CABG was superior with significantly lower rates of major adverse cardiovascular events (MACE), death, MI, and stroke at 5 years. The SYNTAX trial further supports CABG for high-complexity anatomy (SYNTAX score greater than 22) regardless of diabetes. A diabetic patient with three-vessel disease and high SYNTAX score has the strongest evidence base favoring CABG."
    }
  ]
};

/* ==== Senior (L4) and Mastery (L5) layers merged into the existing Day-3 (Coronary) lessons ==== */

window.LESSONS["d2-o2"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the ordered bedside demand levers, and the balloon pump",
    html: `<p>Myocardial oxygen supply is delivered almost entirely in <b>diastole</b>, across the gradient (aortic diastolic pressure − LVEDP), and the LV subendocardium suffers first because it is perfused only in diastole and sits at the highest wall tension. That one fact gives the ordered bedside levers for an ischaemic heart, with their speed:</p>
<ul>
  <li><b>Slow the rate</b> — lengthens diastole (more perfusion time) <i>and</i> cuts demand. Fast and powerful.</li>
  <li><b>Raise the diastolic pressure</b> — restores the perfusion gradient.</li>
  <li><b>Correct anaemia and hypoxia</b> — restores oxygen-carrying capacity (each of these is a term in CaO₂).</li>
  <li><b>Reduce wall tension</b> — Laplace, T ∝ P·r/2h; treat distension and hypertension.</li>
</ul>
<p>The <b>intra-aortic balloon pump</b> is this physiology mechanised: it <b>inflates in diastole</b> (raising coronary perfusion pressure) and <b>deflates in systole</b> (dropping afterload and myocardial demand). Reading it off the gradient is why you can predict when it helps and when it cannot (e.g., it is contraindicated in significant AR, which it would worsen).</p>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Every lever is a term in the supply/demand equation. Name which term you are moving and how fast it acts, rather than reaching reflexively for one drug.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the fastest move in the ischaemic, tachycardic, anaemic, hypotensive patient",
    html: `<p><b>Viva scenario:</b> a post-op patient is ischaemic with HR 140 (AF), MAP 55, and Hb 7. What is the single fastest intervention for the oxygen balance?</p>
<p><b>Slow the rate, restore perfusion pressure, and transfuse.</b> Each works through the diastolic perfusion gradient: rate control lengthens diastole and cuts demand, pressure restores the driving gradient, transfusion raises oxygen content. The trap the senior avoids is the reflexive <b>nitrate</b>: in a <i>hypotensive</i> patient it lowers the diastolic pressure and <b>worsens the very gradient you need</b>. A beta-agonist inotrope similarly raises demand.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE TRAP</div>
  <p>Nitrates are for the ischaemic patient with adequate pressure. In the hypotensive ischaemic patient, they can drop the aortic diastolic pressure and drive the subendocardium further into ischaemia. Rate, pressure, and oxygen-carrying capacity come first.</p>
</div>
<p>Once you have decided to revascularise, <b>FFR ≤ 0.80 / iFR ≤ 0.89</b> then guides the <b>completeness</b> of revascularisation, target by target.</p>`
  },
  {
    type: "checkpoint",
    q: "A post-CABG patient is ischaemic with HR 140 (AF), MAP 55, Hb 7.0. What is the single most important immediate intervention for the myocardial oxygen balance?",
    options: [
      "Sublingual/IV nitrates to reduce afterload",
      "Rate control plus pressure and hemoglobin restoration",
      "A beta-agonist inotrope to raise contractility",
      "Immediate return to the operating room"
    ],
    answer: 1,
    explain: "All the levers work through the diastolic perfusion gradient. Rate control lengthens diastole and cuts demand, transfusion raises oxygen content, and restoring pressure rebuilds the gradient. A nitrate in a hypotensive patient lowers diastolic pressure and worsens the gradient; a beta-agonist raises demand."
  }
);

window.LESSONS["d2-ischemia"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: stunned vs hibernating vs infarcted — and why it changes the operation",
    html: `<p>Dysfunctional myocardium is not one thing, and the distinction decides whether revascularisation helps:</p>
<ul>
  <li><b>Stunned:</b> reperfused, transiently dysfunctional but alive — recovers <i>spontaneously</i> over hours to days. Support it; do not re-operate for it.</li>
  <li><b>Hibernating:</b> chronically hypoperfused, dysfunctional, still viable — recovers <i>after</i> revascularisation. This is the segment that justifies grafting a territory in a low-EF patient.</li>
  <li><b>Infarcted:</b> scar — will not recover no matter what you graft.</li>
</ul>
<p>You demonstrate hibernation before committing: PET perfusion–metabolism mismatch, dobutamine contractile reserve, or a late-gadolinium transmurality under <b>~50%</b> on CMR. A territory more than ~50% transmural scar is unlikely to benefit from a graft. <!-- VERIFY: LGE transmurality <50% predicts functional recovery after revascularisation --></p>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>"Low EF plus multivessel disease" is not automatically an operation. The question is how much of the dysfunction is <b>hibernating (recoverable) versus scar</b> — viability imaging turns a reflex into a decision.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: viability drives the revascularisation decision in the low-EF patient",
    html: `<p><b>Viva-grade reasoning:</b> for the patient with ischaemic cardiomyopathy and multivessel disease, the operative case is built on <b>viable, hibernating myocardium subtended by graftable targets</b>. The senior:</p>
<ul>
  <li>Maps the dysfunctional segments to their coronary territories and their targets' quality/runoff.</li>
  <li>Demonstrates viability (PET mismatch, dobutamine reserve, LGE transmurality &lt; 50%) in those segments — grafting a territory that is predominantly scar buys little functional recovery and adds operative risk.</li>
  <li>Weighs the incremental risk of surgery in a low-EF patient against the expected recovery of hibernating muscle and the survival benefit of revascularising a viable, ischaemic, multivessel-diseased ventricle.</li>
</ul>
<p>This is why "revascularise everyone with a low EF" and "medically manage everyone with a low EF" are both wrong: the answer is <b>individualised to the viability map</b>, and the senior can defend the specific plan segment by segment.</p>`
  },
  {
    type: "checkpoint",
    q: "A low-EF patient has an inferior territory that is ~70% transmural scar on CMR. What does grafting that territory achieve?",
    options: [
      "Full recovery of segmental function",
      "Guaranteed reversal of the wall-motion abnormality",
      "Predominantly scar, so little functional recovery",
      "Conversion of scar to hibernating myocardium"
    ],
    answer: 2,
    explain: "A territory more than ~50% transmural scar is unlikely to recover function after revascularisation. Viability imaging distinguishes hibernating (recoverable) from infarcted (scar) myocardium; grafting predominantly scarred muscle buys little functional benefit and adds risk."
  }
);

window.LESSONS["d2-angina"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the physiologic lesion, four parts at a time",
    html: `<p>The senior holds every coronary number as a four-part fact — the number, the condition, the exception, and the resolver:</p>
<ul>
  <li><b>Critical stenosis:</b> resting flow starts to fall at roughly <b>70% diameter</b> (~90% cross-sectional area), because coronary flow reserve (normally ~4–5×) is progressively exhausted — but diffuse disease, serial lesions, and collaterals distort the anatomic estimate, so a <b>physiologic</b> measure grades the ambiguous 40–70% lesion.</li>
  <li><b>FFR ≤ 0.80 / iFR ≤ 0.89</b> defines a physiologically significant epicardial lesion — but FFR requires <b>adequate maximal hyperaemia</b>, and <b>microvascular disease and severe LVH uncouple</b> FFR from the epicardial stenosis; the resolver is to ensure real hyperaemia or use the hyperaemia-free iFR.</li>
</ul>
<p>Completeness of revascularisation means grafting every vessel &gt; ~1.5 mm supplying viable myocardium; FFR/iFR is how you decide which intermediate lesions actually need it.</p>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: using ISCHEMIA without being trapped by it",
    html: `<p><b>Viva summit:</b> <i>"Stable three-vessel disease, preserved EF, FFR-positive LAD — what does ISCHEMIA let you offer, what does it explicitly not change, and where is the trial vulnerable?"</i></p>
<p><b>What it says:</b> in <i>stable</i> disease with moderate-to-severe ischaemia, an initial invasive strategy did <b>not</b> reduce the primary composite or all-cause mortality over a median <b>3.2 years</b> versus optimal medical therapy; invasive care improved angina quality of life and traded more periprocedural MI for fewer spontaneous MIs. Extended follow-up (<b>ISCHEMIA-EXTEND</b>, median ~5.7 years) showed <b>lower cardiovascular death</b> (about 6.4% vs 8.6%, adjusted HR ~0.78) but <b>higher non-cardiovascular death</b> (about 5.6% vs 4.4%, adjusted HR ~1.44), netting <b>no all-cause mortality difference</b>. <!-- VERIFY: ISCHEMIA-EXTEND CV death 6.4 vs 8.6% HR 0.78; non-CV 5.6 vs 4.4% HR 1.44; median 5.7y --></p>
<p><b>What it does not overturn:</b> the <b>surgical survival indications</b> ISCHEMIA never tested and deliberately excluded — <b>left main</b>, <b>multivessel with reduced EF</b>, and <b>diabetes with multivessel disease</b>.</p>
<div class="kbox danger">
  <div class="kbox-tag">WHERE IT IS VULNERABLE</div>
  <p>Enrolment was cut from a planned 8000 to 5179; event rates ran lower than powered for; follow-up was modest for a mortality question; and left main plus the sickest were excluded. So "just medically manage everyone" over-reads an underpowered, short trial that excluded the highest-risk anatomy.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "An examiner says 'ISCHEMIA proved revascularisation never improves survival — why operate on anyone?' What is the strongest rebuttal?",
    options: [
      "Agree; medical therapy is always sufficient",
      "ISCHEMIA excluded left main and other high-risk groups",
      "ISCHEMIA was a registry, so it shows nothing",
      "Revascularisation always improves survival regardless of anatomy"
    ],
    answer: 1,
    explain: "ISCHEMIA enrolled stable patients with moderate-to-severe ischaemia, excluded left main and the highest-risk patients, and was underpowered with modest follow-up. It supports OMT-first for stable, preserved-EF disease but does not overturn the survival indications for revascularisation in left main, low-EF multivessel, or diabetic multivessel disease."
  }
);

/* ---- CCS angina classification (Ch17 Key Questions) — merged into Day-3 coronary ---- */
window.LESSONS["d2-angina"].chunks.push(
  {
    title: "Grading Angina: the CCS Classification",
    html: `<p>Just as NYHA grades heart-failure functional limitation, the <b>Canadian Cardiovascular Society (CCS)</b> classification grades <b>angina</b> by the activity that provokes it — the shorthand used across trials and referrals to convey severity. The value of a common grade is that it turns a vague history into a portable number: a "CCS III" tells the next clinician, the trial database, and the operating surgeon the same thing about how much this patient's life is constrained, without re-taking the whole history.</p>
<ul>
  <li><b>CCS I</b> — no limitation of ordinary activity; angina only with strenuous, rapid, or prolonged exertion.</li>
  <li><b>CCS II</b> — slight limitation; angina precipitated by <b>vigorous</b> activity (e.g., walking uphill, climbing stairs rapidly, after meals, in cold).</li>
  <li><b>CCS III</b> — marked limitation; angina on <b>routine/ordinary</b> activity (walking one to two blocks on the level, one flight of stairs).</li>
  <li><b>CCS IV</b> — inability to carry out any activity without angina, or <b>angina at rest</b>.</li>
</ul>
<p>Read the ladder through the supply-demand framework and it becomes a rough <b>ischemic-threshold meter</b>: the exertion level that trips angina is the workload (heart rate × wall tension) at which a fixed stenosis can no longer keep up with demand. A patient descending from CCS II to III to IV over weeks is describing a threshold falling toward rest — the physiologic signature of a lesion tightening (or a stable plaque destabilizing), and a prompt to reassess rather than simply up-titrate anti-anginals. It maps loosely onto measured functional capacity: CCS I–II corresponds to tolerating roughly ordinary-to-vigorous activity (several METs), while CCS IV is a patient limited at near-zero workload. That translation matters preoperatively, because poor functional capacity is itself an independent perioperative-risk marker, quite apart from the coronary anatomy.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>CCS is about the <b>stable exertional threshold</b>. Angina that is new, crescendo, at rest, or nocturnal is by definition <b>unstable angina</b> — an acute coronary syndrome, not a CCS grade — and is managed on the ACS pathway, not as chronic stable angina. In other words, CCS grades a <em>stable</em> threshold; a <em>falling</em> threshold has already left the CCS system for the ACS pathway.</p>
</div>`
  }
);

/* ============================================================================
   2021 ACC/AHA/SCAI CORONARY REVASCULARIZATION GUIDELINE — ACUTE CORONARY
   SYNDROMES (Sections 5–6). Merged into Day-3 (Coronary) lesson d2-ischemia.
   Recommendations quoted by Class of Recommendation (COR) / Level of Evidence (LOE).
   ============================================================================ */

window.LESSONS["d2-ischemia"].chunks.push(
  {
    title: "STEMI: Revascularizing the Infarct Artery (2021 Guideline)",
    html: `<p>In ST-segment–elevation MI the infarct artery is occluded and myocardium is dying by the minute; the guiding principle is <b>reperfuse the infarct artery as fast as possible</b>. The urgency is not rhetorical — it is the necrosis-wavefront physiology from earlier in this lesson: irreversible injury starts at ~20–30 minutes, about <b>half the area at risk is dead within 3–4 hours</b>, and the transmural extent is fixed by 6–12 hours. Every minute of reperfusion delay converts salvageable myocardium into permanent scar, which is why the <b>90-minute door-to-balloon</b> target exists and why the recommendations below are graded so aggressively toward speed. The 2021 guideline codifies the indications by Class of Recommendation (COR).</p>
<ul>
  <li><b>Primary PCI, symptoms &lt;12 h — COR 1:</b> perform PCI of the infarct artery to improve survival.</li>
  <li><b>Cardiogenic shock or hemodynamic instability — COR 1:</b> PCI (or CABG when PCI is not feasible) is indicated <b>irrespective of time delay</b> from MI onset.</li>
  <li><b>Mechanical complications — COR 1:</b> for ventricular septal rupture, papillary-muscle rupture with acute MR, or free-wall rupture, <b>CABG is recommended at the time of the corrective surgery</b>.</li>
  <li><b>Failed fibrinolysis — COR 1:</b> rescue PCI of the infarct artery.</li>
  <li><b>Pharmacoinvasive — COR 2a:</b> after fibrinolytics, angiography within <b>3–24 h</b> with intent to perform PCI.</li>
  <li><b>Stable, 12–24 h after onset — COR 2a:</b> PCI is reasonable.</li>
  <li><b>PCI not feasible / large territory at risk — COR 2a:</b> emergency or urgent CABG can be an effective reperfusion strategy.</li>
</ul>
<p>Note the surgeon's two distinct roles here, because they answer different questions. As a <b>reperfusion strategy</b>, CABG is a fallback for when PCI cannot open a large-territory infarct artery — and its value decays on the same wavefront clock, so it is worth doing only while there is still salvageable muscle. As the fix for a <b>mechanical complication</b> — post-infarction ventricular septal rupture, papillary-muscle rupture with acute mitral regurgitation, or contained free-wall rupture — CABG is Class I not to salvage myocardium but because these lesions are surgical emergencies in their own right, and the bypass is done <em>at the time of the corrective repair</em>. Recognising which role applies changes the entire risk calculus of taking a fresh-infarct patient to the OR.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p>Two "do-not" statements: in an <b>asymptomatic, stable</b> patient with a <b>totally occluded infarct artery &gt;24 h</b> after onset and no severe ischemia, <b>PCI should not be performed</b> (COR 3: No Benefit — OAT trial). And <b>emergency CABG should not be performed after failed primary PCI</b> when there is no ischemia / no large territory at risk, or when there are poor distal targets or a no-reflow state (COR 3: Harm).</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A patient with an anterior STEMI undergoes primary PCI of the LAD complicated by no-reflow; the vessel remains poorly perfused despite a patent epicardial stent. There is no large additional territory at risk. Should emergency CABG be performed to 'rescue' the infarct?",
    options: [
      "Yes — emergency CABG is always indicated after failed PCI",
      "No—CABG cannot correct microvascular no-reflow",
      "Yes — CABG reliably reverses the no-reflow phenomenon",
      "Only if the patient is diabetic"
    ],
    answer: 1,
    explain: "No-reflow is failed microvascular reperfusion despite a patent epicardial artery; CABG cannot improve perfusion to microvascularly obstructed myocardium. The 2021 guideline lists emergency CABG after failed PCI as COR 3: Harm in the absence of ongoing ischemia or a large area of myocardium at risk, or when there is a no-reflow state or poor distal targets. It subjects the patient to the risk of surgery without benefit."
  },
  {
    title: "STEMI: The Non-Infarct Artery — Staged, Not in Shock",
    html: `<p>Most STEMI patients have additional (non-infarct / non-culprit) stenoses. Contemporary trials (COMPLETE, PRAMI, CvLPRIT, DANAMI-3-PRIMULTI) reshaped how these are handled, and the guideline separates the <b>stable</b> patient from the patient <b>in shock</b> — a split that only makes sense through the plaque and hemodynamic physiology. In a <b>stable</b> patient, those non-culprit stenoses are not innocent bystanders: STEMI is a marker of a systemically inflamed, plaque-unstable coronary tree, so a second lesion is more likely than average to be the <em>next</em> culprit — which is the rationale for completing revascularization (COMPLETE showed staged non-culprit PCI reduces death or MI). In a patient <b>in shock</b>, the calculus inverts completely: a failing ventricle has no reserve to survive the added contrast load, procedure time, and periprocedural injury of chasing extra vessels, so the physiology demands you fix only what is killing the patient right now.</p>
<ul>
  <li><b>Staged PCI of a significant non-infarct stenosis — COR 1:</b> in selected <b>hemodynamically stable</b> patients after successful primary PCI, staged PCI (in-hospital or after discharge) reduces death or MI (COMPLETE trial).</li>
  <li><b>Elective CABG for complex non-infarct disease — COR 2a:</b> reasonable after successful primary PCI.</li>
  <li><b>PCI of a non-infarct artery at the time of primary PCI — COR 2b:</b> may be considered only in stable patients with <b>low-complexity</b> non-infarct disease.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — CULPRIT-SHOCK</div>
  <p><b>In STEMI complicated by cardiogenic shock, routine PCI of a non-infarct artery at the time of primary PCI should NOT be performed (COR 3: Harm)</b> — it increases the risk of death or renal-replacement therapy. This is the CULPRIT-SHOCK trial: in shock, revascularize the <b>culprit only</b>, then reassess. This is one of the guideline's Top-10 messages.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A patient presents with STEMI and cardiogenic shock. Angiography shows an occluded culprit RCA plus significant stenoses in the LAD and LCx. What does the CULPRIT-SHOCK trial and the 2021 guideline recommend at the time of primary PCI?",
    options: [
      "Immediate complete multivessel PCI of all three arteries",
      "Defer all PCI and manage medically",
      "Emergency CABG of all three vessels before any PCI",
      "Culprit-only PCI; defer the nonculprit lesions"
    ],
    answer: 3,
    explain: "CULPRIT-SHOCK showed that routine immediate multivessel PCI in patients with acute MI and cardiogenic shock increased 30-day death or renal-replacement therapy compared with a culprit-lesion-only strategy. The 2021 guideline therefore makes routine non-culprit PCI at the time of primary PCI in shock a COR 3: Harm. Revascularize the culprit, stabilize, and stage any remaining disease if needed."
  },
  {
    title: "NSTE-ACS: The Invasive Strategy and Its Timing",
    html: `<p>In non–ST-elevation acute coronary syndromes the artery is usually not fully occluded, so the decision is <b>whether and how quickly</b> to take the patient to angiography with intent to revascularize, stratified by risk. The pathophysiology explains the difference from STEMI: NSTE-ACS is typically a plaque that has ruptured or eroded and thrown a <b>non-occlusive (or intermittently occlusive) thrombus</b> — enough to cause subendocardial ischemia and troponin release, but not the full-thickness, time-critical necrosis of a totally occluded vessel. That is why there is no "door-to-balloon" mandate here; the artery is not fully shut, so the payoff is in <b>risk-matched timing</b> rather than raw speed. The higher the ongoing thrombotic activity and myocardium at risk (rising troponin, dynamic ST changes, instability), the more the balance tips toward earlier angiography — which is precisely what the graded recommendations below encode.</p>
<ul>
  <li><b>Elevated-risk NSTE-ACS — COR 1:</b> an invasive strategy with intent to revascularize reduces cardiovascular events.</li>
  <li><b>Cardiogenic shock — COR 1:</b> emergency revascularization to reduce death.</li>
  <li><b>Refractory angina or hemodynamic/electrical instability — COR 1:</b> an <b>immediate</b> invasive strategy.</li>
  <li><b>Initially stabilized, high risk — COR 2a:</b> an <b>early</b> invasive strategy (within 24 h) is reasonable over a delayed strategy.</li>
  <li><b>Initially stabilized, intermediate/low risk — COR 2a:</b> an invasive strategy before discharge is reasonable.</li>
  <li><b>Failed PCI with ongoing ischemia / threatened large territory — COR 2a:</b> emergency CABG is reasonable.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p>As in STEMI, <b>in NSTE-ACS complicated by cardiogenic shock, routine multivessel PCI of non-culprit lesions in the same setting should not be performed (COR 3: Harm)</b>. Shock physiology overrides the appeal of "fixing everything at once."</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A hemodynamically stable NSTE-ACS patient is assessed as high-risk (rising troponin, dynamic ST depression, GRACE score elevated). What timing of invasive strategy does the 2021 guideline consider reasonable?",
    options: [
      "Early invasive angiography within 24 hours",
      "Immediate angiography within minutes regardless of stability",
      "Angiography only after 7 days of medical therapy",
      "No angiography unless symptoms recur"
    ],
    answer: 0,
    explain: "For initially stabilized, high-risk NSTE-ACS, the guideline gives COR 2a to an early invasive strategy (within 24 hours) over a delayed strategy to improve outcomes. Immediate (rather than early) invasive management is reserved for refractory angina or hemodynamic/electrical instability (COR 1). Intermediate/low-risk stabilized patients can reasonably have an invasive strategy before discharge (COR 2a)."
  }
);

/* ============================================================================
   2021 REVASCULARIZATION GUIDELINE — LESION SEVERITY, SIHD INDICATIONS,
   PCI PROCEDURE & PHARMACOTHERAPY, DAPT (Sections 4, 7, 10, 11, 14).
   Merged into Day-3 (Coronary) lesson d2-angina.
   ============================================================================ */

window.LESSONS["d2-angina"].chunks.push(
  {
    title: "Defining Lesion Severity: Anatomy, Physiology, and Imaging",
    html: `<p>Before choosing a revascularization strategy, the guideline requires that lesion severity be <b>defined</b> — anatomically, physiologically, and (for ambiguous left main) with intravascular imaging. The reason anatomy alone is not enough is a physiology point Cohn makes plainly: the angiographic extent and severity of luminal narrowing <b>poorly predicts</b> the onset and prognosis of ischemic events, because the plaques that rupture into an ACS are often <em>not</em> the most obstructive ones. Percent-stenosis and physiologic significance are simply two different questions. Anatomically, flow reserve is intact until roughly <b>75%</b> cross-sectional-area loss (exertional limitation) and rest flow fails near <b>90%</b> — but diffuse disease, serial lesions, tandem stenoses, and collaterals all distort that estimate, which is exactly why the ambiguous 40–70% lesion is graded by a <em>pressure</em> measurement, not by eyeballing the picture.</p>
<ul>
  <li><b>SYNTAX score — COR 2b:</b> in multivessel CAD, assessing anatomic complexity (e.g., the SYNTAX score) may help guide revascularization. Note the Top-10 caveat: its usefulness is limited by <b>interobserver variability</b> and its lack of clinical variables, so it supplements — not replaces — the Heart Team.</li>
  <li><b>FFR / iFR — COR 1:</b> for angiographically <b>intermediate</b> stenoses in patients with angina/ischemia, fractional flow reserve (FFR) or instantaneous wave-free ratio (iFR) is recommended to guide the decision to proceed with PCI.</li>
  <li><b>IVUS for intermediate left main — COR 2a:</b> intravascular ultrasound is reasonable to define severity of an intermediate left main stenosis.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>In stable patients with an intermediate stenosis and FFR &gt;0.80 or iFR &gt;0.89, PCI should not be performed (COR 3: No Benefit).</b> A lesion that is not physiologically significant does not benefit from a stent — deferring is as safe as stenting (DEFER, FAME).</p>
</div>`
  },
  {
    title: "Revascularization to Improve Survival in SIHD — the Nuanced Table",
    html: `<p>The most-scrutinized part of the 2021 guideline is how it grades <b>survival</b> benefit in stable ischemic heart disease (SIHD). Contemporary trials (ISCHEMIA and others) <b>downgraded</b> several older Class I indications. Before the table, hold onto <em>why</em> surgery earns a survival edge where stents often do not — it reframes every row. A stent treats a single stenosis at a single point; a <b>LIMA-to-LAD graft</b> does something categorically different: because the internal mammary is remarkably resistant to atherosclerosis, it delivers durable flow, and because it feeds the LAD <em>distal</em> to the whole proximal segment, it protects the myocardium against <b>future culprit lesions</b> anywhere upstream — exactly the non-obstructive vulnerable plaques that percent-stenosis fails to predict. That is the mechanistic reason the survival benefit concentrates in the highest-jeopardy anatomy: a large mass of viable myocardium at risk (left main, proximal multivessel, low EF) is where "protecting the whole vessel" pays off, and where the sickest ventricle has the least reserve to survive an interim event.</p>
<p>Contemporary trials (ISCHEMIA and others) downgraded several older Class I indications. Learn the table by ejection fraction and anatomy:</p>
<ul>
  <li><b>Multivessel CAD + severe LV dysfunction (EF &lt;35%) — CABG COR 1</b> (STICH).</li>
  <li><b>Multivessel CAD + mild-to-moderate LV dysfunction (EF 35%–50%) — CABG (with LIMA→LAD) COR 2a.</b></li>
  <li><b>Significant left main stenosis — CABG COR 1</b>; <b>PCI COR 2a</b> when it can provide equivalent revascularization (low-to-medium complexity).</li>
  <li><b>Three-vessel CAD, normal EF, anatomy suitable for CABG — CABG COR 2b</b> ("may be reasonable"). <b>PCI — survival benefit uncertain (COR 2b).</b> This is the notable downgrade from prior guidelines.</li>
  <li><b>Proximal LAD, normal EF — revascularization to improve survival is uncertain (COR 2b).</b></li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>1- or 2-vessel disease NOT involving the proximal LAD, normal EF — revascularization is not recommended to improve survival (COR 3: No Benefit).</b> And revascularizing a vessel that is <b>not</b> anatomically/functionally significant (&lt;70% stenosis, FFR &gt;0.80) with the sole intent to improve survival is <b>COR 3: Harm</b>.</p>
</div>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Beyond survival: in multivessel CAD suitable for CABG or PCI, <b>revascularization is reasonable to reduce cardiovascular events</b> (spontaneous MI, urgent revascularization, cardiac death) — COR 2a. And for <b>refractory angina</b> despite medical therapy with a lesion amenable to treatment, <b>revascularization to improve symptoms is COR 1 (LOE A)</b>. But with no anatomic/physiologic criterion, neither CABG nor PCI should be done (COR 3: Harm).</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A patient with SIHD, normal EF, and three-vessel CAD (no left main, no proximal-LAD-only disease) suitable for CABG asks whether bypass will help him live longer. How does the 2021 guideline grade CABG for survival here, and why the change?",
    options: [
      "COR 1 — CABG clearly prolongs survival in all three-vessel disease",
      "COR 3: Harm — CABG shortens survival in normal-EF three-vessel disease",
      "CABG is COR 2b for survival in normal-EF three-vessel disease",
      "Revascularization is contraindicated in three-vessel disease"
    ],
    answer: 2,
    explain: "In the 2021 guideline, three-vessel CAD with normal EF and CABG-suitable anatomy is CABG COR 2b ('may be reasonable to improve survival'), a downgrade reflecting contemporary evidence including ISCHEMIA. PCI's survival benefit in the same setting is graded 'uncertain' (COR 2b). Survival Class I is reserved for left main and for multivessel disease with EF <35%. Revascularization can still be offered COR 2a to reduce cardiovascular events and COR 1 to improve refractory symptoms."
  },
  {
    title: "General PCI Procedure: Access, Stents, Imaging, and Special Lesions",
    html: `<p>The guideline's procedural recommendations matter to surgeons because they define what the interventional alternative can and cannot deliver.</p>
<ul>
  <li><b>Radial access — COR 1 (LOE A):</b> in ACS <b>and</b> SIHD, a radial approach is preferred over femoral to reduce bleeding and vascular complications; in ACS it also <b>reduces mortality</b>. (A Top-10 message — distinct from using the radial artery as a bypass <i>conduit</i>.)</li>
  <li><b>Drug-eluting stents — COR 1 (LOE A):</b> DES over bare-metal stents to reduce restenosis, MI, and stent thrombosis.</li>
  <li><b>Intravascular imaging — COR 2a:</b> IVUS for procedural guidance (especially left main / complex), OCT a reasonable alternative except ostial left main; IVUS/OCT to determine the mechanism of stent failure.</li>
  <li><b>Calcified lesions — COR 2a:</b> rotational atherectomy to improve procedural success; orbital atherectomy, laser, or intravascular lithotripsy — COR 2b.</li>
  <li><b>Prior-CABG SVG disease — COR 2a:</b> embolic protection during SVG PCI when feasible; prefer PCI of the native vessel over a severely diseased SVG.</li>
  <li><b>In-stent restenosis — COR 1:</b> for clinical ISR needing repeat PCI, use a DES; for <b>recurrent, diffuse</b> ISR with an indication for revascularization, <b>CABG can be useful over repeat PCI (COR 2a)</b>; brachytherapy may be considered for recurrent ISR (COR 2b).</li>
  <li><b>Complex high-risk PCI — COR 2b:</b> elective hemodynamic support (e.g., Impella/IABP) may be reasonable in selected patients.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>Routine aspiration thrombectomy before primary PCI is not useful (COR 3: No Benefit, LOE A)</b> — routine thrombectomy did not improve outcomes and signaled stroke harm (TOTAL, TASTE). <b>Percutaneous revascularization of a chronically occluded SVG should not be performed (COR 3: No Benefit).</b> For a CTO, PCI to improve symptoms after treating non-CTO lesions is of <b>uncertain</b> benefit (COR 2b).</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "For a patient undergoing PCI for an acute coronary syndrome, which vascular access does the 2021 guideline recommend, and what is the unique added benefit in ACS?",
    options: [
      "Radial access; it reduces bleeding and mortality in ACS",
      "Femoral access, because it allows larger guide catheters",
      "Either access equally; there is no outcome difference",
      "Brachial access to preserve both radial arteries"
    ],
    answer: 0,
    explain: "Radial artery access is COR 1 (LOE A) for both SIHD and ACS to reduce access-site bleeding and vascular complications. In ACS specifically, the radial approach also reduces mortality compared with femoral access (MATRIX, RIVAL, RIFLE-STEACS). This is a distinct recommendation from using the radial artery as a surgical bypass conduit."
  },
  {
    title: "Antithrombotic Pharmacotherapy for PCI",
    html: `<p>PCI requires antiplatelet and anticoagulant therapy; the guideline specifies agent, timing, and cautions. The logic beneath the list is that balloon injury and stent placement create a raw, thrombogenic surface, so the procedure must be run under <b>two complementary blocks</b> at once: an <b>antiplatelet</b> block (aspirin plus a P2Y12 inhibitor) to stop the platelet-driven arterial "white clot," and an <b>anticoagulant</b> block (usually IV unfractionated heparin) to interrupt the thrombin-driven cascade during instrumentation. The two act on different arms of hemostasis, which is why both are needed and why <em>stacking</em> extra anticoagulants (e.g., adding UFH to recent therapeutic enoxaparin) simply multiplies bleeding without added benefit.</p>
<p>The P2Y12 agents are not interchangeable, and the differences are mechanistic. Clopidogrel and prasugrel are <b>thienopyridines</b> that bind the P2Y12 receptor <em>irreversibly</em> for the platelet's lifetime; clopidogrel is a prodrug with variable activation (hence slower, less predictable effect), while prasugrel is more reliably and potently converted. Ticagrelor is chemically different — a <b>reversible, direct</b> inhibitor with a faster on/offset. In ACS, where the ruptured plaque carries a high active clot burden, the guideline prefers the more <b>potent</b> agents (ticagrelor or prasugrel) over clopidogrel to cut ischemic events and stent thrombosis. The trade-off is bleeding, and it is not evenly distributed: prasugrel's potency becomes net <b>harm in a patient with prior stroke/TIA</b> (a bleeding-prone cerebral vasculature), which is why that specific history is a hard contraindication rather than a caution.</p>
<ul>
  <li><b>Aspirin — COR 1:</b> loading dose (162–325 mg) then daily maintenance (75–100 mg; &lt;100 mg with ticagrelor).</li>
  <li><b>Oral P2Y12 loading — COR 1:</b> in ACS a loading dose then daily; in SIHD, clopidogrel (load 600 mg) then daily.</li>
  <li><b>Potent P2Y12 in ACS — COR 2a:</b> ticagrelor (load 180 mg, 90 mg BID) or prasugrel (load 60 mg, 10 mg daily) preferred over clopidogrel to reduce ischemic events/stent thrombosis.</li>
  <li><b>IV cangrelor — COR 2b:</b> reasonable in P2Y12-naïve patients to reduce periprocedural ischemic events.</li>
  <li><b>GP IIb/IIIa inhibitors — COR 2a</b> selectively (large thrombus, no-reflow, slow flow); <b>routine use in SIHD — COR 3: No Benefit.</b></li>
  <li><b>Anticoagulation — COR 1:</b> IV unfractionated heparin; in heparin-induced thrombocytopenia use <b>bivalirudin or argatroban</b>. Bivalirudin is a reasonable alternative to reduce bleeding (COR 2b).</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>Prasugrel should not be given to a patient with prior stroke or TIA (COR 3: Harm)</b> — TRITON-TIMI 38 showed net harm. Use prasugrel with caution (lower dose) if age ≥75 or weight &lt;60 kg. And in a patient on therapeutic subcutaneous enoxaparin whose last dose was within 12 h, <b>UFH should not be added for PCI</b> (COR 3: Harm — stacking anticoagulants increases bleeding).</p>
</div>`
  },
  {
    title: "DAPT After Revascularization — Shorter, and Managing Atrial Fibrillation",
    html: `<p>The direction of travel in antiplatelet therapy after PCI is <b>less, not more</b> — enough to prevent stent thrombosis without excess bleeding. The whole strategy is a race between two clocks. A freshly implanted stent is a bare metal scaffold exposed to flowing blood, intensely thrombogenic until the body <b>re-endothelializes</b> its struts over the following weeks to months; during that window, platelet inhibition is what stands between the patient and an acute, often catastrophic <b>stent thrombosis</b>. But every day of dual inhibition also carries bleeding risk that accrues indefinitely. Modern trials found that the thrombosis clock runs out faster than we used to think — once the stent is largely endothelialized, a single potent agent suffices — so the bleeding clock, not the thrombosis clock, should govern the tail of therapy.</p>
<p>That is why the contemporary move is to keep <b>both</b> agents only through the vulnerable early window, then <b>drop the aspirin and continue the more potent P2Y12 inhibitor as monotherapy</b> — you retain the stronger of the two antiplatelet effects while shedding the bleeding cost of the combination. The CABG situation is different in kind: there is no intracoronary scaffold to protect, so the antiplatelet target is <b>vein-graft patency</b>. Aspirin started early keeps the vein grafts open (their endothelium is the vulnerable surface), while the arterial LIMA is far less dependent on it.</p>
<ul>
  <li><b>Shorter DAPT — COR 2a (LOE A):</b> in selected patients after PCI, <b>1–3 months of DAPT then transition to P2Y12-inhibitor monotherapy</b> (stopping aspirin) reduces bleeding without a clear ischemic penalty (TWILIGHT, STOPDAPT-2, SMART-CHOICE). A Top-10 message.</li>
  <li><b>After CABG — COR 1 (LOE A):</b> aspirin 100–325 mg started <b>within 6 h</b> postoperatively and continued indefinitely reduces SVG closure; DAPT (aspirin + ticagrelor or clopidogrel) for 1 year <b>may</b> improve vein-graft patency (COR 2b).</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY — PCI IN ATRIAL FIBRILLATION</div>
  <p>For a patient with atrial fibrillation on oral anticoagulation who undergoes PCI: <b>discontinue aspirin after 1–4 weeks while continuing a P2Y12 inhibitor plus the oral anticoagulant</b> ("drop the aspirin," moving from triple to dual therapy) — COR 1. And <b>prefer a non–vitamin-K oral anticoagulant (NOAC) over warfarin</b> to reduce bleeding — COR 2a (AUGUSTUS, PIONEER-AF, RE-DUAL PCI).</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A low-bleeding-tolerance patient has an uncomplicated DES to a single vessel for SIHD. Which contemporary DAPT strategy does the 2021 guideline endorse to reduce bleeding?",
    options: [
      "Lifelong dual antiplatelet therapy with aspirin plus a P2Y12 inhibitor",
      "Aspirin monotherapy from day one with no P2Y12 inhibitor",
      "One to three months of DAPT, then P2Y12-inhibitor monotherapy",
      "Triple therapy with aspirin, clopidogrel, and an anticoagulant"
    ],
    answer: 2,
    explain: "The guideline gives COR 2a (LOE A) to a shorter DAPT duration of 1–3 months followed by transition to P2Y12-inhibitor monotherapy in selected PCI patients, to reduce bleeding events without a clear increase in ischemic events (TWILIGHT, STOPDAPT-2, SMART-CHOICE). This 'de-escalation to monotherapy' is one of the guideline's Top-10 take-home messages."
  }
);
