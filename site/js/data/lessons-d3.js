window.LESSONS = window.LESSONS || {};

window.LESSONS["d3-as"] = {
  id: "d3-as",
  day: 4,
  ord: 1,
  title: "Aortic Stenosis",
  short: "AorticSten",
  minutes: 18,
  chunks: [
    {
      title: "Pressure Overload: The Core Concept",
      html: "<p>Every valve lesion hands the ventricle one of two problems: a <b>pressure</b> problem or a <b>volume</b> problem. Aortic stenosis is the textbook <b>pressure overload</b> — the exit door has narrowed, so the left ventricle has to shove blood out against a much higher resistance, like trying to force water through a kinked hose. Hold that single idea and the entire disease unfolds from it.</p><p>The LV responds the way any muscle does when made to lift heavier loads every day — it <b>bulks up</b>. This is <b>concentric hypertrophy</b>: the walls thicken inward while the cavity stays the same size or even shrinks, exactly like a weightlifter's thickening biceps. For years this works, and the patient sails along symptom-free. But the adaptation carries a hidden bill, and every complication of AS is really that bill coming due:</p><ul><li>Thick, stiff walls no longer relax to fill easily → <b>diastolic dysfunction</b> (the ventricle needs a full, unhurried filling period and an atrial kick).</li><li>The overgrown muscle outgrows its own blood supply → <b>subendocardial ischemia and angina even with clean coronaries</b>.</li><li>When the muscle can no longer keep up, contraction itself fails → <b>systolic dysfunction and heart failure</b>.</li></ul><p>Cohn sharpens the middle rung of this ladder in a way worth holding onto. As the LV hypertrophies it grows <b>less compliant</b>, so its end-diastolic pressure climbs <i>without the chamber dilating</i> — the stiff, thick-walled ventricle is a small, high-pressure box, not a big floppy one. That single fact explains why the AS ventricle becomes so utterly <b>dependent on the atrial kick</b>: a normal ventricle fills passively, but this one needs the atrium to actively cram in the last of its volume against high resistance. Lose that kick — new atrial fibrillation, a junctional rhythm — and the patient can <b>decompensate within minutes</b>. And the angina is genuinely ischemic even with pristine coronaries: Cohn attributes it to a triple squeeze — the hypertrophied muscle's raised oxygen demand, high diastolic pressure <b>compressing the coronaries and cutting flow reserve</b>, and a prolonged ejection time that <b>steals from diastolic perfusion time</b>. A last sobering note: severe LVH is only <b>partly reversed</b> by valve replacement and independently predicts worse long-term survival even after a technically perfect operation — the muscle remembers the years of overload.</p>"
    },
    {
      title: "Pathophysiology of AS",
      html: "<p>The normal aortic valve area (AVA) is about 3–4 cm² (Cohn). Crucially, the valve can lose a lot of that area before anything happens hemodynamically: narrowing from 3–4 cm² down to roughly <b>1.5–2 cm²</b> causes little disturbance, and only <em>past</em> that point does significant LV-outflow obstruction develop, with a rising LV pressure and a lengthening ejection time. Severe AS is an AVA <b>&lt;1.0 cm²</b>. The three etiologies split cleanly by age and mechanism: <b>degenerative calcification</b> (the commonest, an active disease process along the leaflet flexion lines sharing risk factors with atherosclerosis) in the elderly; a <b>calcific bicuspid valve</b> (present in ~1–2% of the population, stenosing earlier because its abnormal architecture generates turbulent shear that accelerates fibrosis and calcification) in younger patients; and <b>rheumatic disease</b> (commissural fusion) which progresses more slowly and rarely occurs without mitral involvement.</p><p>In early AS, concentric hypertrophy maintains forward flow at the cost of diastolic dysfunction. Patients may remain asymptomatic for decades. When hypertrophy becomes inadequate, or when diastolic filling is further compromised (e.g., loss of the atrial kick in new AF), symptoms emerge. At the molecular level Cohn notes the hypertrophy is not benign remodeling but a <b>fibrotic, renin-angiotensin-driven</b> process (upregulated collagen I/II and fibronectin, with a role for myocyte apoptosis) — which is exactly why it only partly regresses after AVR and leaves a stiffer, scarred ventricle behind.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>The <b>Gorlin formula</b> calculates AVA = cardiac output / (constant × heart rate × systolic ejection period × &radic;mean gradient). In clinical practice, echo-derived planimetry and the continuity equation are used. The formula reveals that AVA is <i>flow-dependent</i> — low cardiac output reduces the calculated gradient even across a critically stenotic valve.</div>"
    },
    {
      type: "checkpoint",
      q: "Which compensatory mechanism does the LV use in response to aortic stenosis?",
      options: [
        "Concentric LV hypertrophy",
        "Eccentric hypertrophy (cavity dilation with proportional wall thickening)",
        "Sarcomere loss and cavity enlargement",
        "Right ventricular hypertrophy"
      ],
      answer: 0,
      explain: "AS imposes pressure overload. The LV responds with concentric hypertrophy — the wall thickens to normalize wall stress (Laplace's law: stress = pressure × radius / 2 × wall thickness). The cavity size stays normal or decreases. Eccentric hypertrophy (dilation) is the response to volume overload (AR, MR)."
    },
    {
      title: "Severity Classification",
      html: "<p>The ACC/AHA guidelines classify AS severity based on three parameters: valve area, mean gradient, and peak aortic jet velocity. All three must be considered together because each depends on flow conditions. The valve-area number itself comes from the <b>continuity equation</b>, which rests on one simple conservation idea Cohn spells out: the stroke volume passing through the LV outflow tract must equal the stroke volume squeezing through the valve, so AVA = (LVOT area × LVOT velocity) ÷ AV jet velocity. This \"effective\" AVA is slightly smaller than the true anatomic orifice but is the more reliable predictor of outcome. The catheter-based <b>Gorlin formula</b> gives the same information from flow and gradient — and carries the same warning: because it is driven by cardiac output, it <b>underestimates the valve area in low-output states</b>, the trap that sets up the low-flow scenario below.</p><table><tr><th>Severity</th><th>AVA (cm²)</th><th>Mean Gradient (mmHg)</th><th>Peak Velocity (m/s)</th></tr><tr><td>Mild</td><td>&gt;1.5</td><td>&lt;25</td><td>&lt;3.0</td></tr><tr><td>Moderate</td><td>1.0–1.5</td><td>25–40</td><td>3.0–4.0</td></tr><tr><td>Severe</td><td>&lt;1.0</td><td>&gt;40</td><td>&gt;4.0</td></tr><tr><td>Very Severe</td><td>&lt;1.0</td><td>&gt;40</td><td>&gt;5.0</td></tr></table><p>Because a single measurement can mislead, a fourth number cross-checks the other three: the <b>dimensionless index</b> (DVI) — the ratio of the LVOT velocity-time integral to the AV velocity-time integral. It is elegant because it is <em>flow-independent</em>: it compares the valve to the outflow tract in the <em>same</em> beat, so it does not care whether cardiac output is high or low. A DVI ≤ 0.25 signals severe AS and rescues the reading when body size makes LVOT measurement error large or when flow is abnormal.</p><p>A critical concept is <b>low-flow, low-gradient severe AS</b>: when EF is reduced (&lt;50%), cardiac output falls, and even a critically stenotic valve may generate a mean gradient &lt;40 mmHg because insufficient flow is driving the gradient. AVA &lt;1.0 cm² with mean gradient &lt;40 mmHg and low EF = low-flow, low-gradient severe AS. A trickier variant is <b>paradoxical</b> low-flow, low-gradient severe AS — a small, stiff, over-hypertrophied ventricle with a <em>preserved</em> EF but such a small stroke volume that it, too, cannot generate a high gradient across a genuinely tight valve — a reminder that a normal EF does not guarantee normal flow.</p>"
    },
    {
      title: "Diagnosing Low-Flow, Low-Gradient AS",
      html: "<p>Distinguishing true severe AS from pseudosevere AS (moderate stenosis with low cardiac output) in the low-flow, low-gradient scenario is clinically critical — the former requires intervention, the latter does not. The problem is baked into the physics of the last chunk: gradient is <b>flow-dependent</b>, so a genuinely critical valve can generate an innocent-looking gradient below 40 mmHg simply because a weak ventricle is not pushing enough blood across it. The whole diagnostic task is to ask what the valve does when you <em>restore</em> the flow.</p><p>Two approaches resolve this diagnostic dilemma:</p><ul><li><b>Low-dose dobutamine stress echo (DSE):</b> Dobutamine increases cardiac output. In true severe AS, the AVA remains small (the calcified leaflets cannot open further) and the gradient rises. In pseudosevere AS, the AVA increases (leaflets open more with better flow) as the gradient may or may not rise.</li><li><b>CT aortic valve calcium scoring:</b> Aortic valve calcium score &gt;2000 AU in men (&gt;1200 AU in women) is highly specific for truly severe AS, regardless of flow. This is the fallback when DSE is indeterminate — it grades the anatomic burden of calcium directly and does not care about flow at all.</li></ul><p>The dobutamine study also yields a second, prognostically vital number: <b>contractile reserve</b>, defined as a rise in stroke volume of &gt;20% during the infusion. Its absence (a ventricle that cannot augment output at all) marks a much higher operative risk and a worse prognosis whether or not the valve is replaced — so DSE in this setting answers two questions at once: <i>is the valve truly severe</i>, and <i>does this ventricle still have any reserve to survive an operation</i>.</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div>Do not rely solely on mean gradient to rule out severe AS in a patient with reduced EF. A gradient of 30 mmHg can coexist with a critically stenotic AVA of 0.6 cm² if cardiac output is severely reduced.</div>"
    },
    {
      type: "checkpoint",
      q: "A 72-year-old man with EF 30% has AVA 0.85 cm² and mean gradient 28 mmHg. What is the next best diagnostic step?",
      options: [
        "Low-dose dobutamine stress echo",
        "Repeat echo in 6 months",
        "Cardiac MRI for viability",
        "Right heart catheterization alone"
      ],
      answer: 0,
      explain: "This is classic low-flow, low-gradient AS with reduced EF. Low-dose dobutamine stress echocardiography is the next step: true severe AS retains a small valve area as flow and gradient rise, whereas pseudo-severe AS opens with increased flow. CT aortic-valve calcium scoring is particularly useful when DSE remains indeterminate or there is no contractile reserve."
    },
    {
      title: "The Classic Symptom Triad and Prognosis",
      html: "<p>The natural history of AS is a long asymptomatic phase followed by a precipitous decline once symptoms appear. Cohn quantifies both halves of that curve: while the patient is asymptomatic, sudden death is rare (~<b>1% per year</b>), but the moment symptoms begin, untreated mortality leaps to about <b>25% per year</b>. That step-change is the entire argument for operating at symptom onset rather than waiting. The classic triad and their survival data:</p><ul><li><b>Angina</b> (present in ~35% at presentation): ~50% 5-year survival without surgery — subendocardial ischemia from the demand/supply squeeze described earlier.</li><li><b>Syncope</b> (~15% at presentation): ~50% 3-year survival. Cohn's mechanism is elegant: on exertion the fixed orifice caps stroke volume, so when exercise dilates the peripheral arteries the blood pressure has no way to keep up — it drops, and the brain is transiently underperfused. A baroreceptor/vasodepressor response to the high LV pressure contributes.</li><li><b>Heart failure (dyspnea):</b> mean survival ~2 years — the most ominous; CHF presentation carries a 1-year survival of only ~60%.</li></ul><p>One more association worth recognising: severe AS can cause <b>gastrointestinal bleeding from angiodysplasia</b> (Heyde syndrome), because the turbulent high-shear jet shreds the large von Willebrand factor multimers needed for platelet plugging — an acquired coagulopathy that <b>corrects after AVR</b>.</p><p>The physical exam maps neatly onto the same physiology and is worth carrying as the bedside counterpart to the echo. AS produces a <b>crescendo–decrescendo (ejection) systolic murmur</b>, loudest at the right upper sternal border and radiating to the carotids. Two signs specifically track <em>severity</em>: a <b>soft, delayed, or single S2</b> (the stiff, slowly-closing calcified aortic leaflets stop contributing an audible A2, and the prolonged ejection delays it — sometimes into paradoxical splitting), and a <b>pulsus parvus et tardus</b> — a carotid upstroke that is both small and slow-rising because the fixed orifice caps and delays the ejection. When you feel a weak, late carotid pulse and hear a quiet single S2 under a long ejection murmur, the exam is telling you the valve is critical before the echo confirms it.</p><div class='kbox mnemonic'><div class='kbox-tag'>MNEMONIC</div><b>A-S-D</b> (Angina-Syncope-Dyspnea): survival halves at 5-3-2 years respectively. The moment AS becomes symptomatic, the window for safe surgical timing has arrived — do not delay.</div>"
    },
    {
      title: "Intervention Thresholds (2021 ACC/AHA)",
      html: "<p>The timing of aortic valve replacement (AVR) in AS is driven by symptoms and objective markers of LV impairment. Once the symptomatic threshold is crossed, the risk of sudden death and rapid hemodynamic deterioration mandates action — recall the natural-history numbers: ~1%/year sudden death while asymptomatic versus ~25%/year mortality once symptoms appear. The objective (asymptomatic) triggers all encode the same idea: intervene at the first sign the ventricle is beginning to <b>lose the compensation battle</b> — a falling EF, a very tight/rapidly progressing valve — rather than waiting for irreversible myocardial damage that a technically perfect valve cannot undo. Which prosthesis follows is a separate, shared decision: <b>TAVR vs surgical AVR</b> is chosen by age, surgical risk, anatomy, and life expectancy, not by AS severity itself.</p><p><b>Class I indications (should be done):</b></p><ul><li>Severe AS + any symptom from the classic triad → AVR</li><li>Severe AS + any other cardiac surgery being performed</li><li>Severe AS + EF &lt;50% (even if asymptomatic)</li></ul><p><b>Class IIa (reasonable):</b></p><ul><li>Asymptomatic severe AS with very rapid progression (peak V increase &ge;0.3 m/s/year)</li><li>Very severe AS (peak V &gt;5 m/s) even if asymptomatic</li><li>Exercise testing revealing symptoms or &ge;20 mmHg BP drop</li></ul><p>Two decisions sit downstream of \"the valve needs replacing.\" The first is <b>how</b>: TAVR vs surgical AVR is chosen chiefly by surgical risk, age/life-expectancy, and anatomy (annular size, coronary height, femoral access, and whether there is <em>concomitant</em> disease — significant CAD needing bypass or another valve lesion pushes toward surgery, where it can all be addressed in one operation). Bicuspid anatomy and a heavily calcified LVOT complicate TAVR sizing and are part of that conversation. The second decision is <b>when it is too late</b>: the objective triggers exist precisely so you intervene <em>before</em> the ventricle decompensates, because an EF that has already fallen, or a heavily fibrosed hypertrophied myocardium, may never fully recover even after a perfect valve — the reason a falling EF (&lt;50%) is itself a Class I indication in asymptomatic patients. Exercise testing is used to \"unmask\" symptoms a sedentary patient has hidden by simply slowing down, and an abnormal blood-pressure response (a fall) is the fixed-orifice physiology laid bare on a treadmill.</p>"
    },
    {
      title: "Hemodynamic Management of the AS Patient",
      html: "<p>Understanding the hemodynamic goals in AS is essential for anesthesiologists, intensivists, and anyone managing these patients perioperatively. The hypertrophied, non-compliant LV has specific vulnerabilities that differ markedly from other valve lesions.</p><p>The AS patient tolerates several conditions very poorly:</p><ul><li><b>Hypotension:</b> Reduces coronary perfusion pressure in the hypertrophied LV → subendocardial ischemia. Vasodilators (including nitrates) are dangerous.</li><li><b>Tachycardia:</b> Reduces diastolic filling time; the stiff, non-compliant LV is highly preload-dependent.</li><li><b>Loss of sinus rhythm:</b> AF removes the atrial kick — can cause acute decompensation in a preload-dependent LV.</li><li><b>Bradycardia:</b> Reduces cardiac output (fixed stroke volume → CO = HR × SV).</li></ul><p>This is why induction of anesthesia and neuraxial blockade are such high-risk moments in AS: the sympatholysis and vasodilation of a spinal or a propofol induction can drop SVR precipitously in a patient who cannot compensate by increasing an already-fixed stroke volume. A <b>slowly titrated spinal is generally avoided in favour of a controlled general or a carefully dosed technique</b>, with a phenylephrine infusion ready before, not after, the pressure falls. The unifying logic is that the AS ventricle sits on a knife-edge of coronary supply and demand, and a vicious spiral is always one insult away: hypotension → less coronary perfusion of the thick muscle → ischemia → worse contraction → lower output → deeper hypotension. That is why the vasodilation of an epidural or a bolus of a GTN is so feared here, and why the pressor of choice when the pressure drops is a <b>pure alpha-agonist (phenylephrine)</b> — it restores the aortic diastolic perfusion pressure <em>without</em> the tachycardia an agent like ephedrine would add. Because stroke volume is relatively fixed across the tight valve, cardiac output becomes rate-dependent within a narrow band, so both extremes hurt: tachycardia steals filling time, bradycardia drops output outright.</p><div class='kbox study'><div class='kbox-tag'>STUDY</div><b>Ideal hemodynamics for AS — \"full, slow, tight, and in sinus\":</b> Normal sinus rhythm (keep the atrial kick), HR 60–80, normal-to-high preload, maintain SVR (preserve coronary diastolic perfusion pressure), avoid tachycardia and vasodilation. Think: the LV needs time to fill and adequate perfusion pressure to prevent ischemia. Treat hypotension early and aggressively with phenylephrine — the spiral is hard to reverse once it starts.</div>"
    },
    {
      type: "checkpoint",
      q: "Which hemodynamic change is MOST dangerous in a patient with severe aortic stenosis?",
      options: [
        "Heart rate of 72 bpm",
        "Mild increase in SVR",
        "Normal sinus rhythm with P-R 180 ms",
        "Systemic vasodilation"
      ],
      answer: 3,
      explain: "The hypertrophied LV in AS depends on adequate aortic diastolic pressure to perfuse the subendocardium. Systemic vasodilation drops aortic diastolic pressure → coronary perfusion pressure falls → subendocardial ischemia in the already oxygen-starved hypertrophied muscle. Nitrates and other vasodilators can be catastrophic. HR 72 and mild SVR increase are not dangerous; normal sinus rhythm is actually preferred."
    }
  ]
};

window.LESSONS["d3-ar"] = {
  id: "d3-ar",
  day: 4,
  ord: 2,
  title: "Aortic Regurgitation",
  short: "AorticReg",
  minutes: 15,
  chunks: [
    {
      title: "Pathophysiology of Chronic AR",
      html: "<p>If aortic stenosis is a pressure problem, aortic regurgitation is a <b>volume</b> problem — the exit door no longer seals, so every time the LV relaxes, a portion of the blood it just ejected sloshes straight back in. The ventricle now has to handle its normal filling from the left atrium <i>plus</i> this returning regurgitant volume, beat after beat. Think of it as a leaking bucket that the heart keeps overfilling to compensate.</p><p>The bookkeeping matters: total LV stroke volume = the forward stroke volume that actually reaches the body + the regurgitant volume that leaks back, and the <b>regurgitant fraction</b> = (regurgitant volume / total SV) &times; 100%. To cope, the LV does the opposite of what it does in AS — it undergoes <b>eccentric hypertrophy</b>, adding sarcomeres in series so both the cavity and the wall enlarge, letting the chamber swell to hold the extra volume without the filling pressure shooting up. Over years the LV can become truly enormous — the classic &ldquo;cor bovinum&rdquo; (ox heart).</p><p>Because the LV ejects a huge total stroke volume into the aorta and then a chunk of it immediately drains back, the arterial system swings between a high systolic peak and a low diastolic trough — a <b>wide pulse pressure</b>. This is the engine behind the famous parade of eponymous peripheral signs, all of which are just the same bounding, collapsing (&ldquo;water-hammer&rdquo;) pulse showing up in different body parts:</p><ul><li><b>Corrigan's pulse</b> — a visibly bounding, collapsing carotid.</li><li><b>de Musset's sign</b> — the head bobs with each beat.</li><li><b>Quincke's sign</b> — capillary pulsations visible in the nail bed.</li><li><b>Traube's sign</b> — &ldquo;pistol-shot&rdquo; sounds over the femoral artery.</li><li><b>Duroziez's sign</b> — a to-and-fro murmur over the compressed femoral artery.</li><li><b>Müller's sign</b> — the uvula pulsates.</li></ul><ul><li>Patients can tolerate severe chronic AR for 10–15 years without symptoms</li><li>Eventually, excessive LV dilation → rising wall stress → systolic dysfunction</li><li>EF decline is a late sign — EF &lt;55% suggests significant myocardial damage</li></ul><div class='kbox mnemonic'><div class='kbox-tag'>MNEMONIC</div>Every AR peripheral sign is one wide, collapsing pulse in a different place: <b>Corrigan</b> (neck) &middot; <b>de Musset</b> (head-bob) &middot; <b>Quincke</b> (nails) &middot; <b>Traube</b> (femoral pistol-shot) &middot; <b>Duroziez</b> (femoral to-and-fro) &middot; <b>Müller</b> (uvula). Remember the theme, not a list: <b>water-hammer pulse, head to toe.</b></div>"
    },
    {
      title: "Acute AR: A Cardiac Emergency",
      html: "<p>Acute AR (from aortic dissection, infective endocarditis, or trauma) presents a fundamentally different and far more dangerous scenario. The LV has had no time to dilate and develop eccentric hypertrophy.</p><p>Cohn puts the mechanism in sharp numbers. Because a ventricle cannot dilate acutely, the LVEDV only rises about <b>20–30%</b> — nowhere near enough to accommodate the regurgitant volume at a low pressure — so the LVEDP shoots up instead, driving LA and pulmonary venous pressures up and flooding the lungs. The rise is <b>worst in exactly the ventricle least able to take it</b>: a stiff, concentrically hypertrophied LV (from pre-existing AS or hypertension) has almost no diastolic give, so the pressure spike is even steeper. The body's only immediate defences are the two the failing heart can least sustain — a Frank-Starling boost in contractility and a reflex tachycardia — which is why acute severe AR so often outruns compensation and collapses. A classic finding is <b>premature closure of the mitral valve</b> on echo: LVEDP climbs so high it exceeds LA pressure <em>before</em> the next systole, snapping the mitral valve shut early — a protective mechanism that nonetheless signals hemodynamic crisis.</p><p>Management follows straight from that physiology and is mostly a list of traps to avoid while the OR is readied. The compensations keeping the patient alive are <b>tachycardia</b> (shortening diastolic regurgitant time) and <b>Frank-Starling contractility</b> — so anything that blocks them is dangerous: a <b>beta-blocker</b>, instinctive for a wide-complex-looking crash or for a dissection, will here remove the protective tachycardia and can precipitate collapse (a genuine caution when the cause is dissection and rate control is otherwise wanted). Afterload reduction (nitroprusside) and a chronotrope/inotrope help forward flow, an <b>intra-aortic balloon pump is contraindicated</b> (diastolic augmentation feeds the leak), and none of it substitutes for the definitive fix.</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div>Acute severe AR from aortic dissection or endocarditis can cause rapid cardiovascular collapse. The patient may have a <i>narrow</i> pulse pressure (unlike chronic AR) because the LV cannot accommodate the volume. Emergency surgical consultation is mandatory — medical stabilization is a bridge only.</div>"
    },
    {
      type: "checkpoint",
      q: "Why can patients with chronic severe AR tolerate the condition for many years while acute severe AR causes rapid hemodynamic collapse?",
      options: [
        "Chronic AR causes concentric hypertrophy which is more effective than eccentric hypertrophy",
        "Chronic AR permits compensatory LV dilation and greater compliance",
        "Acute AR always has a smaller regurgitant fraction",
        "Chronic AR patients have better coronary perfusion"
      ],
      answer: 1,
      explain: "In chronic AR, years of volume overload allow the LV to dilate progressively and increase its compliance through eccentric hypertrophy, accommodating large volumes at acceptable filling pressures. In acute AR, the LV is of normal size and compliance — sudden flooding raises LVEDP dramatically, causing pulmonary edema and potential cardiogenic shock."
    },
    {
      title: "Severity Criteria and Intervention Thresholds",
      html: "<p>Quantification of AR severity relies on echo-derived parameters. Severe AR is defined by:</p><ul><li>Regurgitant volume &ge;60 mL/beat</li><li>Regurgitant fraction &ge;50%</li><li>EROA &ge;0.3 cm²</li></ul><p>Those numbers connect back to the physiology: the regurgitant orifice area is simply the regurgitant volume divided by the regurgitant-jet velocity-time integral, and the whole point of tracking LV dimensions is that the LVESD threshold is a <b>surrogate for the ventricle beginning to fail</b>. Cohn's natural-history data show that the strongest predictors of a poor postoperative result — persistent LV dilation and death — are a <b>greater preoperative LVESD and end-diastolic dimension</b>. That is the crux of AR timing: the eccentric hypertrophy compensates beautifully for years, but once <b>afterload mismatch</b> sets in (preload reserve exhausted, EF falling) the myocardium is already sliding toward maladaptive fibrosis, and a valve replaced too late leaves a permanently dilated, dysfunctional ventricle.</p><p>Two echo signs make the severity call more robust than any single number. <b>Holodiastolic flow reversal in the descending (or abdominal) aorta</b> is a specific marker of severe AR — if enough blood is running backward across the valve to reverse flow all the way out in the aorta throughout diastole, the leak is large. And a short <b>pressure half-time (&lt;200 ms)</b> means the aortic and LV diastolic pressures are equalizing quickly, which only happens when a wide-open regurgitant orifice lets them rush together — again, severe. On the treatment side, remember that in <em>acute</em> severe AR the only true therapy is emergency surgery; vasodilators and an inotrope/chronotrope are a bridge, and — from the AS/AR contrast — an <b>intra-aortic balloon pump is contraindicated</b> because its diastolic augmentation feeds the regurgitation.</p><p><b>Surgery indications (2021 ACC/AHA):</b></p><ul><li><b>Class I:</b> Severe symptomatic AR; Severe AR + EF &lt;55%; Severe AR + LVESD &gt;50 mm (or indexed &gt;25 mm/m²); Severe AR + another cardiac surgery</li><li><b>Class IIa:</b> Asymptomatic severe AR with progressive LV dilation (LVEDD &gt;65 mm) or rapidly declining EF</li></ul><p>The key principle: once the LV begins to fail (EF falls, chamber dilates excessively), surgery must not be delayed — the damage may be irreversible.</p>"
    },
    {
      title: "Hemodynamic Management of AR",
      html: "<p>The hemodynamic goals in AR are the mirror image of AS management. Understanding the rationale for each goal prevents dangerous errors.</p><p>In AR, regurgitation occurs during <b>diastole</b>. The longer diastole lasts, the more blood regurgitates back into the LV. Cohn makes the corollary explicit: <b>forward stroke volume in AR is increased by anything that lowers afterload or raises heart rate</b> — a faster rate shortens diastole and therefore the regurgitant-flow time, while a lower SVR tilts each ejection toward the aorta rather than back through the leaky valve. This is not a mnemonic, it is the actual physiology the body already uses: the peripheral vasodilation and tachycardia of exercise are precisely how an AR patient augments forward output, and they are the reason vasodilator therapy helps while bradycardia and negative chronotropes are harmful. Therefore:</p><ul><li><b>Favor tachycardia (HR 80–100):</b> Faster heart rate shortens diastole → less time for regurgitation per cycle → reduces regurgitant fraction per beat. This is the opposite of AS.</li><li><b>Reduce afterload:</b> Lower SVR favors forward flow over regurgitation. Vasodilators (nitroprusside, hydralazine) are beneficial — again the opposite of AS.</li><li><b>Avoid bradycardia:</b> Prolonged diastole worsens regurgitation dramatically.</li><li><b>Avoid high preload:</b> Already at risk for pulmonary edema from elevated LVEDP.</li></ul><p>A note on chronic medical therapy versus the acute goals above: it is tempting to assume that if afterload reduction acutely improves AR, chronic vasodilators must slow the disease — but the trials did <em>not</em> bear this out, and vasodilator therapy is <b>not</b> recommended to delay surgery in asymptomatic patients with normal blood pressure. Their real role is narrower: controlling coexisting <b>hypertension</b> (which genuinely worsens the regurgitant fraction) and bridging the symptomatic patient who is awaiting or unsuitable for surgery. The definitive treatment for severe AR remains the valve, and — as the timing chunk stressed — the LVESD/EF thresholds exist so it is replaced before the dilated ventricle is beyond recovery.</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div><b>IABP is relatively contraindicated in severe AR.</b> The IABP inflates during diastole, augmenting diastolic aortic pressure. In AR, regurgitant flow is driven by the aorta-to-LV pressure gradient during diastole. Increasing aortic diastolic pressure with the IABP worsens this gradient and increases regurgitant volume — the opposite of the intended benefit.</div>"
    },
    {
      type: "checkpoint",
      q: "In a patient with severe chronic aortic regurgitation, which of the following hemodynamic targets is correct?",
      options: [
        "Heart rate 55 bpm, high SVR, avoid vasodilators",
        "Heart rate 60 bpm, high preload, normal SVR",
        "IABP insertion for hemodynamic support",
        "Heart rate near 90 with reduced SVR"
      ],
      answer: 3,
      explain: "In AR, regurgitation occurs during diastole. A faster heart rate (80–100) shortens diastole and reduces regurgitant fraction. Reduced SVR (afterload reduction) promotes forward flow. Vasodilators are beneficial. IABP is relatively contraindicated because it augments diastolic aortic pressure, worsening the aorta-to-LV gradient that drives regurgitation."
    }
  ]
};

window.LESSONS["d3-ms"] = {
  id: "d3-ms",
  day: 4,
  ord: 3,
  title: "Mitral Stenosis",
  short: "MitralSten",
  minutes: 14,
  chunks: [
    {
      title: "Pathophysiology of MS",
      html: "<p>Mitral stenosis is almost always the long-delayed bill for a childhood rheumatic fever: the immune scarring slowly fuses the mitral commissures and thickens the leaflets until the valve opening shrinks from its normal 4–6 cm² into a stiff, buttonhole &ldquo;fish-mouth.&rdquo; The mitral valve is the doorway between the left atrium and the left ventricle, and here the doorway has narrowed to a crack — so during diastole, when blood should pour freely from LA to LV, a pressure gradient builds up behind the obstruction.</p><p>The whole clinical picture of MS is that pressure backing up, like water rising behind a partly closed sluice gate. To keep pushing blood through the narrow valve, <b>left atrial pressure must climb</b> — and because the LA sits directly upstream of the lungs, that pressure floods backward through the pulmonary veins into the lungs. This is why MS is fundamentally a <em>lung</em> disease dressed up as a valve lesion:</p><ul><li>The chronically pressured LA <b>dilates</b> — stretching its wall (setting up atrial fibrillation) and, when huge, pressing on neighbours: the recurrent laryngeal nerve (<b>Ortner's syndrome</b> — hoarseness) and the esophagus (dysphagia).</li><li>Pulmonary venous congestion causes <b>exertional dyspnea, orthopnea, and hemoptysis</b> (from rupture of engorged bronchial veins).</li><li>Sustained back-pressure drives <b>pulmonary arterial hypertension</b> — reactive at first, then fixed — and eventually <b>right heart failure</b>.</li></ul><p>Two points from Cohn reframe how you think about the ventricle and the lungs. First, the low cardiac output of MS is <b>not LV pump failure</b> — the LV is simply <b>underfilled</b> by the obstruction upstream of it, so LVEDP is typically <em>low</em> and the ventricle is small. (Confusingly, ~25–50% of severe-MS patients do have some LV systolic dysfunction, but from associated rheumatic myocarditis, reduced preload, and reflex afterload rise — not from the stenosis loading the LV.) Second, the transmitral gradient is <b>flow- and rate-dependent</b>: at a valve area of 1–2 cm² the mean gradient runs about <b>5–10 mmHg at a normal heart rate</b>, but anything that raises flow or shortens diastole (exercise, fever, AF) drives it up sharply — which is why symptoms track the heart rate, not just the anatomy. The pulmonary story is a staged cascade Cohn lays out: passive transmission of high LA pressure → <b>reactive pulmonary arteriolar vasoconstriction</b> (initially protective, shielding the capillaries) → fixed obliterative vascular remodeling → RV failure and secondary tricuspid regurgitation. Once mean LA pressure exceeds ~30 mmHg (above oncotic pressure), fluid transudes into the interstitium and frank pulmonary edema follows; a PA systolic pressure above ~60 mmHg markedly impedes RV emptying.</p>"
    },
    {
      title: "Atrial Fibrillation and Thrombus Risk in MS",
      html: "<p>The dilated, high-pressure left atrium combined with the low-flow state in MS creates a pro-thrombotic milieu. Cohn adds a physiologic detail that makes the AF especially costly here: in sinus rhythm the MS left atrium already leans hard on a <b>prominent a wave</b> — coordinated atrial contraction is doing real work to force blood across the narrowed valve — so losing it to AF removes an active pump the stenotic valve was depending on. Three critical consequences follow:</p><ol><li><b>Atrial fibrillation</b> is very common in MS — present in <b>more than half</b> of patients with pure or mixed MS. Chronic high pressure drives LA hypertrophy, dilatation, and fibrosis; the disorganized atrial muscle develops inhomogeneous conduction and refractoriness that eventually tips into AF (older age and larger LA diameter are the main determinants). AF is both a consequence and an accelerant of MS hemodynamics.</li><li><b>Left atrial thrombus</b> — particularly in the left atrial appendage (LAA) — forms due to stasis. The LAA is the most common site, and LAA thrombus carries a very high stroke risk. Cohn's numbers make the stakes concrete: systemic thromboembolism occurs in about <b>20% of MS patients and may be the very first symptom of the disease</b>, recurs in ~25%, and lodges in the <b>cerebral circulation ~40%</b> of the time. Risk is amplified by low cardiac output, LA dilatation, AF, an existing LA thrombus, and spontaneous echo contrast (\"smoke\") — the visible marker of stagnant flow.</li><li><b>Anticoagulation is mandatory</b> in MS with AF (and should be considered even in sinus rhythm with significant MS). Note this is a setting where a vitamin-K antagonist, not a DOAC, is the evidence-based agent (rheumatic MS was excluded from the DOAC trials).</li></ol><div class='kbox danger'><div class='kbox-tag'>DANGER</div>Before performing percutaneous mitral balloon commissurotomy (PMBC), a TEE to exclude LAA thrombus is mandatory. Attempting PMBC with an LAA thrombus risks systemic embolization.</div>"
    },
    {
      type: "checkpoint",
      q: "A patient with severe MS develops rapid atrial fibrillation. What is the immediate hemodynamic consequence and the priority intervention?",
      options: [
        "Increased cardiac output; no immediate intervention needed",
        "Abrupt fall in cardiac output; urgent rate control",
        "Acute AR worsens; start nitroprusside",
        "Increased LV preload; give IV fluids"
      ],
      answer: 1,
      explain: "In MS, the stenotic mitral valve is the flow-limiting bottleneck. Flow across it depends on diastolic filling time. Rapid AF dramatically shortens diastole (less time for flow across the stenotic valve) AND removes the atrial kick, causing a precipitous drop in cardiac output, rising LA pressure, and pulmonary edema. Immediate rate control (IV metoprolol, diltiazem, or digoxin) is the first intervention. Cardioversion if hemodynamically unstable."
    },
    {
      title: "Severity Classification and Intervention",
      html: "<p>MS severity is classified by mitral valve area and the downstream hemodynamic consequences. The Wilkins score (based on leaflet mobility, thickening, calcification, and subvalvular thickening) determines suitability for percutaneous intervention — it is essentially a scorecard for how <em>pliable</em> the valve still is, and therefore how well it will split rather than tear at a balloon.</p><p><b>Severe MS:</b> MVA &le;1.5 cm², mean gradient &gt;10 mmHg, pulmonary artery systolic pressure &gt;50 mmHg at rest. Two of those thresholds are really staging the disease's downstream damage rather than the valve itself: the gradient is flow-dependent (Cohn: ~5–10 mmHg at a valve area of 1–2 cm², climbing as the orifice approaches ~1 cm² and symptoms become pronounced), and the pulmonary pressure marks how far the passive-then-reactive pulmonary vascular cascade has progressed. Because the pulmonary changes can become <b>fixed</b>, a key aim of intervention is to relieve the obstruction <em>before</em> irreversible obliterative remodeling and RV failure set in.</p><p><b>Intervention options:</b></p><ul><li><b>Percutaneous mitral balloon commissurotomy (PMBC):</b> First-line for suitable anatomy — pliable, non-calcified leaflets, minimal MR, no LAA thrombus, no significant subvalvular disease. Wilkins score &le;8 favors PMBC.</li><li><b>Surgery (MVR or surgical commissurotomy):</b> For anatomy unsuitable for PMBC (calcified, rigid leaflets), significant MR, LAA thrombus, or failed prior PMBC.</li></ul><p>The valve area itself is most reliably read from the <b>diastolic pressure half-time</b> — the time for the transmitral gradient to fall by half — which lengthens as the orifice tightens (a tighter valve empties the LA more slowly). It is the mitral counterpart to the AS continuity equation, and like every MS gradient it is confounded by heart rate and by coexisting AR, so it is cross-checked against direct planimetry of the orifice. One deciding factor tips PMBC vs surgery beyond the Wilkins score: <b>more than mild MR is a contraindication to balloon commissurotomy</b>, because splitting the commissures in an already-regurgitant valve tends to worsen the leak — such a valve needs to go to the operating room.</p>"
    },
    {
      title: "Hemodynamic Management of MS",
      html: "<p>The hemodynamic management of MS centers on one principle: protect diastolic filling time across the stenotic valve. Any increase in heart rate is the enemy of MS hemodynamics — and Cohn's exercise physiology shows why in the cleanest possible terms. When an MS patient exerts, the heart rate climbs but the shorter diastole gives the fixed orifice <em>less</em> time to fill the LV, so end-diastolic volume actually falls and cardiac output <b>blunts or even drops</b> instead of rising. This is the mirror image of a normal heart, and it is why MS patients describe a hard ceiling on exertion. The same mechanism makes any tachycardic stress — fever, sepsis, pain, hyperthyroidism, pregnancy — a potential trigger for acute decompensation and flash pulmonary edema.</p><ul><li><b>Keep HR 60–80:</b> Tachycardia dramatically worsens MS. As HR increases, diastolic filling period per cycle falls precipitously — less time for blood to cross the stenotic orifice → LV underfilling → low cardiac output + rising LA pressure. Rate control in AF is critical.</li><li><b>Maintain sinus rhythm if possible:</b> Loss of organized atrial activity worsens hemodynamics in MS.</li><li><b>Avoid any cause of tachycardia:</b> Exercise, fever, sepsis, and pregnancy all increase HR and can cause acute decompensation.</li><li><b>Cautious with vasodilators:</b> Fixed cardiac output + reduced SVR → hypotension without benefit.</li></ul><p>When rate control is needed for AF — the common trigger for decompensation — the agents of choice are the negative-chronotropes that buy back diastolic filling time: a <b>beta-blocker or a non-dihydropyridine calcium blocker (diltiazem)</b>, with digoxin as an adjunct, and <b>urgent synchronized cardioversion</b> if the fast AF is causing hemodynamic collapse. Crucially, unlike almost every other pulmonary-edema patient, the MS patient in \"heart failure\" does <em>not</em> primarily need aggressive preload reduction — the LV is underfilled, not overloaded, so overzealous diuresis or venodilation can drop an already-marginal cardiac output. The real fix is slowing the rate and, ultimately, relieving the valve.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>Pregnancy is a high-risk period for MS. The combined increase in heart rate and blood volume of pregnancy can precipitate acute decompensation in a woman with previously compensated severe MS. Early referral for PMBC during pregnancy is sometimes necessary.</div>"
    },
    {
      type: "checkpoint",
      q: "Which statement best describes why tachycardia is especially dangerous in mitral stenosis?",
      options: [
        "Tachycardia causes more regurgitation across the stenotic valve",
        "Tachycardia causes paradoxical septal motion",
        "Tachycardia increases LV afterload disproportionately in MS",
        "Tachycardia shortens diastolic flow across the mitral valve"
      ],
      answer: 3,
      explain: "In MS, the stenotic valve restricts flow during diastole. Flow across the mitral valve depends on the diastolic filling period and the transmitral pressure gradient. As heart rate increases, diastole shortens markedly — there is less time for the fixed, reduced orifice to allow blood across. To maintain the same cardiac output, LA pressure must rise, causing pulmonary venous congestion and edema."
    }
  ]
};

window.LESSONS["d3-mr"] = {
  id: "d3-mr",
  day: 4,
  ord: 4,
  title: "Mitral Regurgitation",
  short: "MitralReg",
  minutes: 17,
  chunks: [
    {
      title: "Pathophysiology and Carpentier Classification",
      html: "<p>Mitral regurgitation (MR) is the most common valvular lesion worldwide. The mitral valve apparatus — leaflets, annulus, chordae tendineae, and papillary muscles — must work in concert. Dysfunction of any component causes regurgitation. The first fork is <b>primary (organic)</b> versus <b>secondary (functional)</b> MR, because they are almost different diseases. In <b>primary</b> MR the leaflets/chordae themselves are diseased — Cohn distinguishes <b>fibroelastic deficiency</b> (thin, weak tissue that ruptures a single chord, typically in older patients) from <b>Barlow's disease</b> (young patients, thick, redundant, myxomatous leaflets with excess spongy tissue and bileaflet prolapse). In <b>secondary/functional</b> MR the leaflets are structurally normal and the culprit is the ventricle: a dilated or ischemic LV displaces the papillary muscles, tethering otherwise-healthy leaflets so they cannot coapt — which is why fixing the muscle (revascularization, reverse-remodeling, CRT) can reduce the leak and why the regurgitant orifice in functional MR is <b>dynamic</b>, shrinking when the chamber is made smaller.</p><p>The <b>Carpentier functional classification</b> describes MR by leaflet motion and directly guides surgical repair strategy:</p><ul><li><b>Type I (normal leaflet motion):</b> Annular dilation or leaflet perforation (e.g., infective endocarditis)</li><li><b>Type II (excessive leaflet motion / prolapse):</b> Myxomatous degeneration (Barlow's disease, fibroelastic deficiency), chordal elongation or rupture, papillary muscle rupture</li><li><b>Type IIIa (restricted motion — systolic and diastolic):</b> Rheumatic disease with thickened, retracted leaflets</li><li><b>Type IIIb (restricted motion — systolic only):</b> Ischemic/dilated cardiomyopathy — leaflets are tethered by displaced papillary muscles</li></ul><div class='kbox study'><div class='kbox-tag'>STUDY</div>Classification drives repair: Type II (prolapse) → chordal repair, leaflet resection, or artificial neochords. Type IIIb (functional/ischemic) → ring annuloplasty to reduce annular size and relieve leaflet tethering.</div>"
    },
    {
      title: "Hemodynamics of Chronic MR",
      html: "<p>The defining trick of MR is that the leaky valve gives the LV an <b>easy back door</b>. Every systole, instead of ejecting only into the high-pressure aorta, the ventricle can also dump blood backward into the low-pressure left atrium — the path of least resistance. It is like a pressurized pipe with a leak into an open tank beside it: the pump's job feels easy because some of its output escapes the moment it squeezes. This is the &ldquo;pop-off effect,&rdquo; and its consequences all flow from that unloaded, deceptively comfortable ventricle:</p><ul><li>The LA and pulmonary veins absorb the escaping volume → LA enlargement, pulmonary venous hypertension, eventual pulmonary edema.</li><li>The LV handles a large total volume → volume overload and eccentric hypertrophy (as in AR).</li><li><b>The EF reads falsely reassuring.</b> Because the ventricle empties partly into the low-resistance atrium, ejection <em>looks</em> vigorous even as the muscle quietly fails — so a &ldquo;normal&rdquo; or supranormal EF can hide real dysfunction.</li></ul><p>Cohn's energetics explain <em>why</em> the ventricle tolerates this for so long. Because a chunk of each beat escapes into the low-impedance atrium, LV <b>afterload (systolic wall stress) is normal or reduced</b>, so contractile energy is spent on fiber <b>shortening</b> rather than tension development — and since shortening is a far weaker driver of oxygen consumption than pressure work, chronic MR raises myocardial oxygen demand only slightly. The ventricle adapts by adding sarcomeres <b>in series</b> (eccentric remodeling toward a more spherical shape), and tellingly the LV-mass-to-volume ratio stays <em>normal</em> — the opposite of pressure-overload hypertrophy. This same physiology is the rationale for medical therapy: because the regurgitant orifice depends on LV size and afterload, <b>vasodilators and afterload/volume reduction shrink the effective regurgitant orifice and regurgitant volume</b> (and dobutamine reduces functional MR by making the chamber smaller). The catch is that all of this comfort is bought against slowly accumulating, ultimately irreversible contractile dysfunction — the reason the EF and LVESD thresholds are set deliberately early.</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div>In chronic MR, EF &lt;60% (not 55% as in other conditions) signals significant myocardial dysfunction. An EF of 58% in severe MR may indicate irreversible damage. The ACC/AHA guideline threshold for surgery in asymptomatic severe MR is EF &le;60% or LVESD &ge;40 mm — recognizing that EF looks better than it truly is.</div>"
    },
    {
      type: "checkpoint",
      q: "A patient with chronic severe MR has EF of 58%. Which statement is most accurate?",
      options: [
        "This is normal EF; surgery can safely be deferred indefinitely",
        "EF of 58% is reassuring in MR; no surgical threshold has been reached",
        "EF of 58% in MR may represent significant dysfunction",
        "This EF meets the Class I threshold for surgery in severe MR (EF 55%) and is concerning"
      ],
      answer: 2,
      explain: "In chronic MR, the LV ejects into the low-resistance LA ('pop-off'), artificially elevating EF. An EF of 58–60% in severe MR may mask significant underlying myocardial dysfunction. The ACC/AHA threshold for Class I surgery in asymptomatic severe MR is EF at or below 60% OR LVESD at or above 40 mm — not the usual 55% threshold used in other conditions."
    },
    {
      title: "Acute MR: Surgical Emergency",
      html: "<p>Acute MR — from papillary muscle rupture (complication of inferior MI), chordal rupture, or acute endocarditis — presents very differently from the chronic form. The LA has not had time to dilate and become compliant. The classic MI association is worth understanding mechanistically: the <b>posteromedial papillary muscle</b> ruptures far more often than the anterolateral one because it has a <b>single blood supply</b> (usually the PDA), whereas the anterolateral muscle is dual-supplied (LAD and circumflex) — so a single inferior/posterior infarct is enough to kill it, and rupture typically strikes a modest-sized MI a few days out, not a massive one.</p><p>Sudden flooding of a small, non-compliant LA causes a dramatic rise in LA pressure, transmitted directly to the pulmonary circulation → flash pulmonary edema → cardiogenic shock. Furthermore, the LV has not developed the eccentric hypertrophy that allows it to maintain stroke volume in chronic MR — it has none of the adaptive dilation Cohn describes accruing over years, so the entire regurgitant volume shows up as pressure, not accommodated volume.</p><p>Key clinical distinction: in acute MR, the murmur may be <b>soft or even absent</b>, and the reason is physiologic — the LA pressure rises so high, so fast, that the LV-to-LA pressure gradient driving the regurgitant jet is small and equalizes early in systole (Cohn notes LA pressure can stay elevated even at end-diastole, sometimes producing a transient functional transmitral gradient). So the loudness of the murmur runs <em>inverse</em> to the danger here: the sickest patient may have the quietest heart, and a soft murmur in a crashing patient after an inferior MI should raise, not lower, your suspicion of papillary-muscle rupture.</p><p>The bridging strategy exploits the mirror-image physiology of chronic MR: because forward flow competes with the leak, <b>aggressive afterload reduction</b> (IV nitroprusside) and an <b>intra-aortic balloon pump</b> both divert blood forward across the aortic valve instead of backward into the LA — and here the IABP is genuinely <em>helpful</em> (the opposite of its role in AR), buying time and lowering the regurgitant fraction. But this is explicitly a <b>bridge to the operating room</b>, not a treatment: a ruptured papillary muscle will not heal, and delay to trade \"stabilization\" for a lower-risk operation usually costs more lives than it saves. Contrast this with acute AR, where the IABP is contraindicated — the same device helps one acute valve emergency and harms the other, decided entirely by which phase of the cycle the leak occurs in.</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div>Acute MR from papillary muscle rupture after MI requires emergency surgery. Temporizing measures (nitroprusside to reduce afterload, IABP for hemodynamic support) may briefly stabilize the patient, but definitive surgical repair or replacement is the only cure.</div>"
    },
    {
      title: "Severity Criteria and Intervention Thresholds",
      html: "<p>Severe primary MR is defined by quantitative echo parameters:</p><ul><li>Regurgitant volume &ge;60 mL/beat</li><li>Regurgitant fraction &ge;50%</li><li>EROA &ge;0.4 cm² (note: higher than AR threshold of 0.3 cm²)</li><li>Vena contracta width &ge;0.7 cm</li><li>LA and LV dilation</li></ul><p>Two caveats keep these numbers honest. First, they are <b>load-dependent</b>: because the regurgitant orifice grows with LV size, afterload, and preload, a single measurement taken under anesthesia or with a low blood pressure can understate the true burden — the same lesion looks milder when the ventricle is smaller. Second, the <b>thresholds differ for secondary (functional) MR</b>, where a smaller EROA (≥0.2 cm²) already carries prognostic weight, because in a failing, dilated ventricle even a modest leak signals advanced disease. This is exactly why the two populations behave so differently in the trials: fixing a structurally normal valve tethered by a sick ventricle (functional MR) is a fundamentally different proposition from repairing a diseased leaflet on a good ventricle (primary MR).</p><p><b>Intervention thresholds:</b></p><ul><li><b>Class I:</b> Severe MR + symptoms; Severe MR + EF &le;60% or LVESD &ge;40 mm (even if asymptomatic)</li><li><b>Class IIa:</b> Asymptomatic severe MR with preserved EF and &gt;95% likelihood of durable repair by experienced surgeon; new AF or PASP &gt;50 mmHg</li><li><b>Secondary MR:</b> Treat underlying cardiomyopathy first; MitraClip (transcatheter repair) for refractory severe secondary MR — COAPT trial (2018) showed MitraClip reduced hospitalizations and mortality in selected HF patients.</li></ul><p>The workhorse quantitative method behind these numbers is <b>PISA</b> (proximal isovelocity surface area): as blood converges on the leak it forms hemispheric velocity shells, and measuring one shell lets you back-calculate the effective regurgitant orifice and regurgitant volume. It is powerful but assumes a single, round, static orifice — which is why it is unreliable for the eccentric, crescentic, dynamic jets of functional MR and must be read alongside vena contracta width and the pulmonary-vein flow pattern (systolic flow reversal being a specific sign of severe MR). The recurring theme: no single echo number is trusted alone in MR, because the ventricle's loading conditions move all of them.</p>"
    },
    {
      title: "Repair vs. Replacement and Hemodynamic Goals",
      html: "<p>Mitral <b>repair</b> is strongly preferred over replacement when feasible. Repair preserves the subvalvular apparatus (chordae and papillary muscles), which maintains LV geometry and function. Removing the subvalvular apparatus during mitral valve replacement disrupts LV architecture and impairs systolic function — even a technically successful replacement has worse outcomes than repair in most patients. The mechanism is not sentimental: the chordae are not just tethers for the leaflets, they are <b>structural struts that anchor the papillary muscles to the annulus</b>, and this continuity is part of how the ventricle contracts efficiently. Cut it, and the LV loses the geometric scaffold that lets it shorten normally — hence the modern discipline of <b>chordal-sparing replacement</b> when repair truly is not possible. There is also a timing payoff that ties back to the pop-off physiology: repairing before the EF/LVESD thresholds are crossed removes the low-impedance leak and restores normal afterload, unmasking (and sometimes worsening) the true LV function that the regurgitation had been flattering — which is exactly why operating <em>early</em>, before that hidden dysfunction becomes fixed, produces the best ventricles.</p><p>Repair advantages: lower operative mortality, better long-term LV function, avoids need for anticoagulation (vs. mechanical prosthesis), and superior durability at high-volume centers.</p><p><b>Hemodynamic goals in MR (for anesthetic management):</b></p><ul><li>Maintain HR 80–100: reduces regurgitant fraction (shorter diastole, less time for backflow — similar rationale to AR)</li><li>Reduce SVR: promotes forward flow, less regurgitation</li><li>Avoid increases in SVR: hypertension worsens regurgitation fraction</li><li>Maintain preload to support LV filling</li></ul>"
    },
    {
      type: "checkpoint",
      q: "Why is mitral valve repair preferred over replacement in primary MR whenever feasible?",
      options: [
        "Repair avoids the need for cardiopulmonary bypass",
        "Preservation of subvalvular continuity and LV geometry",
        "Replacement carries higher anticoagulation requirements only",
        "Repair has lower risk only in elderly patients"
      ],
      answer: 1,
      explain: "Repair preserves the chordae tendineae and papillary muscles — the subvalvular apparatus. This continuity is critical for maintaining LV geometry, wall motion, and systolic function. Disrupting these structures during replacement impairs LV function even if the new valve works perfectly. Repair also has lower operative mortality, better long-term EF preservation, and avoids anticoagulation (if bioprosthesis would have been used)."
    }
  ]
};

window.LESSONS["d3-tr"] = {
  id: "d3-tr",
  day: 4,
  ord: 5,
  title: "Tricuspid & Pulmonary Disease",
  short: "TricuspPulm",
  minutes: 13,
  chunks: [
    {
      title: "Tricuspid Regurgitation: Pathophysiology",
      html: "<p>The key to tricuspid regurgitation is that the valve is usually <b>a victim, not a villain</b>: most TR is <b>functional</b> (secondary), meaning the leaflets themselves are perfectly normal and the problem is the frame they hang on. As left-sided disease drives up RV pressure and volume, the RV dilates and stretches its tricuspid annulus like the rim of a drum being pulled wider — and normal-sized leaflets simply can no longer stretch far enough to meet across the widened gap. The tricuspid, in effect, pays for the mitral's sins. Worse, the leak feeds itself: TR volume-loads the RV, which dilates further, which stretches the annulus more, which worsens the TR — a self-reinforcing spiral.</p><p>Primary causes of TR include infective endocarditis (especially in intravenous drug users), rheumatic disease, carcinoid syndrome (which deposits fibrous tissue on right-sided valves), radiation-induced valve disease, and Ebstein anomaly (congenital apical displacement of the septal and posterior tricuspid leaflets).</p><ul><li>Functional TR: annular dilation from RV dilation/pressure overload</li><li>Primary TR: direct leaflet or chordal pathology</li><li>RV volume overload from TR → RV dilation → further annular dilation → more TR (progressive cycle)</li></ul><p>Cohn adds an anatomic detail that explains <em>where</em> the annulus fails and why surgeons repair it the way they do. The tricuspid annulus does not dilate uniformly: the <b>septal leaflet is anchored between the fibrous trigones and essentially cannot lengthen</b>, so dilation occurs almost entirely along the <b>anterior and posterior</b> leaflet attachments. As the RV enlarges, the chordal-papillary complex becomes <em>functionally shortened</em>, tethering the leaflets down and away from the annular plane just as the annulus is stretching away from them — a double failure of coaptation. This is precisely why annuloplasty (cinching the dilated anterior/posterior segments back toward the fixed septal portion) is the workhorse repair, and why the same secondary mechanism arises from any driver of RV dilation: mitral disease, Eisenmenger/primary pulmonary hypertension, RV infarction, or late biventricular dilated cardiomyopathy.</p>"
    },
    {
      title: "Hemodynamic Consequences and Clinical Features of TR",
      html: "<p>TR imposes volume overload on the right ventricle, which dilates over time. The right-sided circulation backs up, causing elevated central venous pressure and its systemic consequences. Unlike left-sided lesions, TR can be tolerated for years before overt right heart failure develops — the thin-walled, compliant RV is built to accommodate volume, so it stretches quietly rather than generating symptoms early. That very tolerance is the trap: by the time congestive signs appear, the RV has often dilated enough to worsen the annular dilation driving the leak, and the self-perpetuating cycle (TR → RV volume overload → more RV/annular dilation → more TR) is already well advanced. There is also a hidden systemic cost the venous congestion inflicts long before frank failure — a passively congested, high-pressure liver (\"cardiac cirrhosis\" over time) and congested kidneys, which is why severe TR independently worsens outcomes even when the lungs are clear.</p><p>Clinical signs of significant TR:</p><ul><li>Elevated JVP with prominent v waves (systolic venous pulsation)</li><li>Hepatomegaly, congestive hepatopathy, ascites</li><li>Peripheral edema</li><li>Pulsatile liver on palpation (systolic hepatic pulsation)</li><li>Holosystolic murmur at the left lower sternal border, louder with inspiration (Carvallo sign)</li></ul><p>Two of these signs are worth reading as physiology rather than a list. The <b>prominent v wave</b> in the JVP is regurgitant blood being driven backward into the right atrium and great veins <em>during systole</em> — in severe TR the normally modest v wave can fuse the whole waveform into a single large systolic surge (the \"CV\" or ventricularized wave), and that same pressure wave is what makes the liver visibly <b>pulsate</b>. The <b>Carvallo sign</b> — a right-sided murmur getting louder on inspiration — is simply the universal rule for right-heart events: inspiration drops intrathoracic pressure, augments systemic venous return to the right heart, and so transiently increases the regurgitant volume and the murmur. Recognising that inspiratory accentuation at the bedside is often the fastest way to tell a tricuspid murmur from a mitral one.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>In patients undergoing left-sided valve surgery, concomitant tricuspid annuloplasty is performed for moderate-to-severe TR (or significant annular dilation &ge;40 mm even with mild TR) because functional TR often worsens after left-sided correction if the annulus is left untreated.</div>"
    },
    {
      type: "checkpoint",
      q: "Which of the following is the most common underlying mechanism of tricuspid regurgitation seen in cardiac surgery patients?",
      options: [
        "Rheumatic fever causing tricuspid leaflet thickening and fusion",
        "Carcinoid syndrome",
        "Secondary functional TR",
        "Ebstein anomaly"
      ],
      answer: 2,
      explain: "Functional (secondary) TR is by far the most common form seen in cardiac surgery patients. Left-sided disease (mitral valve disease, cardiomyopathy) or pulmonary hypertension causes RV enlargement, which dilates the tricuspid annulus. The leaflets themselves are normal but cannot coapt across the enlarged annulus. Rheumatic, carcinoid, and Ebstein etiologies are less common."
    },
    {
      title: "Tricuspid Stenosis",
      html: "<p>Tricuspid stenosis (TS) is rare and almost always rheumatic in origin — and when present, is typically accompanied by mitral stenosis. The stenotic tricuspid valve obstructs RV filling, raising right atrial pressure.</p><p>Hemodynamic consequences of TS:</p><ul><li>Elevated right atrial pressure → systemic venous hypertension</li><li>Reduced cardiac output (restricted RV filling)</li><li>Marked jugular venous distension with prominent a wave</li><li>Low transmitral gradient compared to MS (lower pressures on the right side)</li></ul><p>Severe TS is defined as mean gradient &gt;5 mmHg or valve area &lt;1.0 cm² by analogy with left-sided criteria. Two features flow from the low-pressure right side and are worth holding onto. First, a <b>mean gradient of just ~5 mmHg is already \"severe\" for the tricuspid</b> — trivial next to the &gt;10 mmHg that defines severe MS — because the entire right heart operates at a fraction of left-sided pressures, so it takes only a small obstruction to congest the systemic veins behind it. Second, because it almost never travels alone (it rides along with rheumatic MS), TS is easy to miss: the mitral lesion dominates the picture, and the added tricuspid obstruction quietly caps cardiac output and drives the prominent jugular <b>a wave</b>, hepatomegaly, and refractory peripheral edema. The clinical tell is a patient with \"MS\" whose right-sided congestion seems out of proportion to their pulmonary findings. Treatment: percutaneous balloon valvuloplasty or surgical repair/replacement — and because a mechanical prosthesis in the low-flow tricuspid position thromboses readily, a <b>bioprosthesis is generally preferred</b> when the valve must be replaced.</p>"
    },
    {
      title: "Pulmonary Valve Disease",
      html: "<p>The pulmonary valve is the least frequently diseased of the four cardiac valves in adults. Pulmonary <b>stenosis</b> (PS) in adults is almost always congenital (valvular PS in Noonan syndrome, tetralogy of Fallot repairs). Pulmonary <b>regurgitation</b> (PR) is the most common long-term complication after repair of tetralogy of Fallot and can lead to progressive RV dilation and failure if severe. The two lesions map cleanly onto the pressure-vs-volume framework used across this day: PS is a <b>pressure</b> load that drives RV concentric hypertrophy (the right-sided mirror of AS), while PR is a <b>volume</b> load that dilates the RV (the mirror of AR). The reason PR dominates the adult congenital picture is iatrogenic-by-necessity: relieving the RV outflow obstruction in tetralogy repair often leaves the pulmonary valve incompetent, trading a pressure problem the surgeon had to fix for a slow-burning volume problem that surfaces decades later — which is exactly why these patients need lifelong surveillance of RV size and function.</p><p>Pressure overload in PS:</p><ul><li>RV concentric hypertrophy → diastolic dysfunction → RV failure</li><li>Severe PS: peak gradient &gt;64 mmHg (peak velocity &gt;4 m/s by echo)</li><li>Treatment: percutaneous balloon valvuloplasty (first-line for pliable valves); surgical valvotomy or replacement for complex anatomy</li></ul><p>Volume overload in PR (post-TOF repair):</p><ul><li>Progressive RV dilation → RV dysfunction → exercise intolerance, arrhythmia</li><li>Pulmonary valve replacement (PVR) indicated when RV indexed end-diastolic volume &gt;150 mL/m² or RV EF &lt;45%</li></ul><p>Notice how the PVR trigger differs in kind from every left-sided threshold in this day: it is driven by <b>volumetric imaging of the RV</b> (cardiac MRI), not by a gradient or an EF cut-off, because the danger in chronic PR is silent RV dilation, and the RV's complex geometry defeats the simple linear dimensions used for the LV. The timing principle, though, is identical to the AR and MR lessons — replace <em>before</em> the dilated ventricle passes the point of recovery, since an RV allowed to enlarge too far will not remodel back even after the valve is competent, leaving the patient with exercise intolerance and atrial/ventricular arrhythmias for life. That is the whole rationale for lifelong imaging surveillance of the repaired-tetralogy patient.</p>"
    },
    {
      title: "Right Heart Failure: The Shared Endpoint",
      html: "<p>Whether from functional TR, severe pulmonary hypertension, pulmonary stenosis, or chronic pulmonary regurgitation, the common endpoint of right-sided valvular disease is RV failure. The right ventricle is a thin-walled, compliant chamber well-suited to handle volume but poorly adapted to sustained pressure overload.</p><p>The reason the RV fails where the LV would soldier on comes back to its architecture: it is a thin-walled, crescent-shaped <b>volume pump</b>, with roughly a sixth of the LV's muscle mass, exquisitely sensitive to afterload. Load it acutely with pressure — a pulmonary embolus, a spike in pulmonary vascular resistance, a fresh transplant meeting a recipient's high PVR — and it dilates and fails fast, because it was never built to generate high pressure. Worse, RV dilation triggers two vicious loops at once: it stretches the tricuspid annulus (functional TR, which volume-loads it further), and it bows the interventricular septum leftward, impairing <b>LV</b> filling so that right-sided failure drags down the left (ventricular interdependence within the stiff pericardium).</p><p>Perioperative RV failure is a dreaded complication after cardiac surgery, particularly after left ventricular assist device (LVAD) implantation or heart transplantation, where the suddenly increased pulmonary blood flow can overwhelm an unprepared RV.</p><div class='kbox study'><div class='kbox-tag'>STUDY</div><b>RV failure management principles:</b> optimize preload (RV needs adequate filling volume), reduce pulmonary vascular resistance (inhaled nitric oxide, sildenafil, prostacyclins), maintain RV perfusion pressure (avoid systemic hypotension — RV is perfused in systole AND diastole), consider inotropes (dobutamine, milrinone) for RV contractility support.</div>"
    },
    {
      type: "checkpoint",
      q: "When performing mitral valve surgery, under what condition should concomitant tricuspid annuloplasty be strongly considered?",
      options: [
        "Moderate-severe TR or a dilated annulus",
        "Only if TR is severe (Grade 4+) and symptomatic",
        "Only in patients with carcinoid syndrome",
        "TR always requires full replacement not annuloplasty"
      ],
      answer: 0,
      explain: "Functional TR may persist or progress after left-sided correction when annular and right-ventricular remodeling is already established. Concomitant tricuspid repair is considered for severe TR and, depending on the guideline and clinical context, for lesser TR with significant annular dilation or other progression-risk features; normalization of pulmonary pressure does not itself cause TR to worsen."
    }
  ]
};

/* ==== Senior (L4) and Mastery (L5) layers merged into the existing Day-4 (Valvular) lessons ==== */

window.LESSONS["d3-as"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the AS pressure-volume loop and the flow-dependence of every gradient",
    html: `<p>On the pressure–volume loop, AS is a <b>tall, narrow</b> loop: the LV generates very high systolic pressure to eject across the fixed orifice, and concentric hypertrophy shifts the end-diastolic pressure–volume relation up and left (a stiff, small cavity). That geometry is why the AS ventricle is <b>preload- and rate-dependent</b> and tolerates hypotension and tachycardia poorly.</p>
<p>The severe-AS thresholds — mean ≥ 40 mmHg, Vmax ≥ 4 m/s, AVA ≤ 1.0 cm², dimensionless index ≤ 0.25 — are all <b>flow-dependent</b> because gradient varies with the square of transvalvular flow. Hold each as a four-part fact: the number, the condition (normal flow), the exception (a failing or under-filled ventricle drops the gradient across a genuinely tiny valve), and the resolver (dimensionless index, CT calcium score, dobutamine challenge).</p>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Never read the mean gradient alone. In a low-EF or small-hypertrophied-cavity patient, a "reassuring" 28 mmHg can sit on a 0.6 cm² valve — the number is telling you about flow, not just the valve.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: pseudo-severe AS — when NOT to replace the valve",
    html: `<p><b>Viva-grade decision.</b> On dobutamine stress echo, contractile reserve (a rise in stroke volume) sorts the two low-gradient states:</p>
<ul>
  <li><b>True severe AS:</b> the gradient <b>climbs</b> while the AVA <b>stays fixed at ≤ 1.0 cm²</b> — the valve is the problem → proceed toward AVR (and the presence of reserve predicts better operative survival).</li>
  <li><b>Pseudo-severe AS:</b> the AVA <b>opens well past 1.0 cm²</b> as flow rises with little gradient change — the low output reflects the <b>cardiomyopathy</b>, not the valve → <b>do not operate on the valve</b>; treat the myocardium and reassess.</li>
</ul>
<p>The senior defends this against an examiner pushing to "just replace it": replacing a valve that opens to 1.4 cm² under flow exposes the patient to operative risk without fixing the pump, and the absence of contractile reserve itself flags a prohibitive operative risk that changes the whole plan (toward medical therapy or, in selected cases, TAVR).</p>
<div class="kbox danger">
  <div class="kbox-tag">WHEN NOT TO OPERATE</div>
  <p>Low EF + low gradient + AVA that opens past 1.0 cm² under dobutamine = pseudo-severe AS. The wrong move is a valve replacement; the right move is treating the cardiomyopathy.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "On dobutamine echo, stroke volume rises, the mean gradient stays ~28 mmHg, and the AVA opens from 0.9 to 1.3 cm². What is the correct decision?",
    options: [
      "Urgent SAVR for true severe low-flow AS",
      "Immediate TAVR regardless of the dobutamine result",
      "Balloon valvuloplasty as destination therapy",
      "Treat the cardiomyopathy; this is pseudo-severe AS"
    ],
    answer: 3,
    explain: "When the AVA opens well past 1.0 cm² as flow rises and the gradient barely changes, the valve is not the dominant problem — pseudo-severe AS. Do not operate on the valve; treat the myocardium. True severe low-flow AS with reserve would show the gradient climb while the AVA stays at or below 1.0 cm²."
  }
);

window.LESSONS["d3-ar"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the AR loop and why EF over-reads systolic function",
    html: `<p>Chronic AR is <b>combined volume and pressure overload</b>: the regurgitant volume returns in diastole (volume load) and the total stroke volume must be ejected against the systemic circulation (pressure load), so the PV loop is <b>wide and shifted right</b> with eccentric hypertrophy. Afterload is deceptively tolerated for years by a compliant, dilating ventricle — which is exactly why the EF looks preserved until late.</p>
<p>Because the EF over-reads true systolic function in a volume-overloaded ventricle, the operative triggers rely on <b>dimension</b>, not EF alone:</p>
<ul>
  <li><b>Symptoms</b> (Class I).</li>
  <li><b>EF ≤ 55%</b> (Class I).</li>
  <li><b>LVESD > 50 mm</b>, or indexed <b>> 25 mm/m²</b>, even while asymptomatic (Class IIa). <!-- VERIFY: 2020 ACC/AHA AR surgery: EF ≤55 (I), LVESD >50 or indexed >25 mm/m2 (IIa) --></li>
</ul>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: placing the operation on the AR natural-history curve",
    html: `<p><b>Viva summit:</b> <i>"Severe asymptomatic AR, LV end-systolic diameter creeping toward 50 mm, preserved EF — do you operate, on exactly which number, and what is your evidence that waiting harms this ventricle irreversibly?"</i></p>
<p>The senior names the number and the mechanism: intervene as the LVESD reaches <b>~50 mm</b> (or indexed ~25 mm/m²) or the EF falls to <b>55%</b>, because beyond those dimensions the volume-overloaded ventricle enters <b>irreversible remodelling</b> and post-operative recovery of function and survival falls off. The argument against "wait for symptoms" is that by the time severe AR is symptomatic, the end-systolic dimension has usually already crossed the point of no full recovery.</p>
<div class="kbox pearl">
  <div class="kbox-tag">THE DEFENCE</div>
  <p>You are operating on a <b>dimension to protect a ventricle</b>, before the symptom that would confirm you waited too long. Index the threshold to body size in the small or tall patient, and use CMR when the echo volumes are discordant.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "An asymptomatic patient with chronic severe AR has a preserved EF but an LV end-systolic diameter now measured at 51 mm. What is the appropriate management?",
    options: [
      "Continue surveillance until symptoms develop",
      "Start a beta-blocker and repeat the echo in 2 years",
      "Proceed to AVR because LVESD exceeds 50 mm",
      "Surgery is only indicated once the EF falls below 40%"
    ],
    answer: 2,
    explain: "In chronic severe AR, an LVESD above ~50 mm (or indexed >25 mm/m²) is an indication for surgery even without symptoms or a fallen EF, because beyond that dimension the ventricle begins irreversible remodelling and post-operative recovery declines. Waiting for symptoms usually means waiting past that point."
  }
);

window.LESSONS["d3-mr"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the MR loop, the EF illusion, and two different diseases",
    html: `<p>In chronic MR the regurgitant orifice is a <b>low-impedance path</b>: the ventricle unloads part of its stroke volume backward into the low-pressure left atrium during systole, so the loop loses its vertical isovolumic-contraction border and afterload is deceptively low. Total (angiographic) stroke volume is large — so the EF looks preserved or high — while the <b>forward</b> output falls. That is the EF illusion, and it is why the primary-MR triggers use chamber size: intervene at <b>EF ≤ 60%</b> or <b>LVESD ≥ 40 mm</b> in asymptomatic severe primary MR. <!-- VERIFY: 2020 ACC/AHA primary MR: EF ≤60% or LVESD ≥40 mm (I); early repair 2a at experienced centre --></p>
<p><b>Primary and secondary MR are two different diseases:</b></p>
<ul>
  <li><b>Primary (degenerative):</b> the leaflet/chord itself is the problem (prolapse, flail) — <b>fix the valve</b>, and repair beats replacement for survival and durability when the anatomy allows.</li>
  <li><b>Secondary (functional):</b> LV remodelling tethers structurally normal leaflets — the leak is a <b>marker of a failing pump</b>, so fixing the valve may not fix the disease.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">THE POST-REPAIR TRAP</div>
  <p>Closing the leak <b>raises afterload</b> and can unmask a weak ventricle: a "normal" pre-op EF does not guarantee a normal EF after repair. Pre-position inotropic and afterload-reducing support.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: COAPT vs MITRA-FR — proportionate vs disproportionate MR",
    html: `<p><b>Viva-grade reconciliation.</b> Two transcatheter edge-to-edge repair trials in <b>secondary</b> MR disagreed, and the framework decides who you refer:</p>
<ul>
  <li><b>COAPT</b> was <b>positive</b> (fewer HF hospitalisations, lower mortality) because it enrolled <b>disproportionate</b> MR — severe regurgitation (mean EROA ~0.41 cm²) relative to a <i>smaller</i> ventricle, where the leak drives the heart failure, so fixing it helps. <!-- VERIFY: COAPT mean EROA ~0.41 cm2, smaller LV volumes; MITRA-FR mean EROA ~0.31 cm2 --></li>
  <li><b>MITRA-FR</b> was <b>neutral</b> because it enrolled <b>proportionate</b> MR (mean EROA ~0.31 cm²) relative to a <i>more dilated</i> ventricle, where the leak marks an already-failing pump.</li>
</ul>
<p>So for the secondary-MR patient on optimised guideline-directed therapy, the senior asks whether the MR is <b>disproportionate to the LV size</b> (COAPT-like → refer for transcatheter repair) or <b>proportionate to a dilated failing ventricle</b> (MITRA-FR-like → the valve is not the fix). This split is why the guidelines raised the severe-secondary-MR thresholds (EROA ≥ 0.4 cm² / regurgitant volume ≥ 60 mL) and restricted the indication toward COAPT-like anatomy.</p>`
  },
  {
    type: "checkpoint",
    q: "Two secondary-MR patients on optimal GDMT: A has EROA 0.42 cm² with a relatively small LV; B has EROA 0.30 cm² with a markedly dilated LV. Who is more likely to benefit from transcatheter edge-to-edge repair?",
    options: [
      "Patient A: disproportionate, COAPT-like MR",
      "Patient B — the larger ventricle means more to gain",
      "Neither can benefit from transcatheter repair",
      "Both benefit equally regardless of ventricular size"
    ],
    answer: 0,
    explain: "Patient A has disproportionate MR (COAPT-like): a severe leak relative to a smaller ventricle, where fixing the regurgitation improves outcomes. Patient B has proportionate MR (MITRA-FR-like): the leak marks an already-failing dilated ventricle, so repair does not change the trajectory."
  }
);

window.LESSONS["d3-ms"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: rheumatic MS and the balloon-vs-surgery decision",
    html: `<p>Rheumatic mitral stenosis is a <b>fixed diastolic obstruction</b>: the transmitral gradient and the pulmonary pressures rise with anything that shortens diastole (tachycardia, AF with rapid ventricular response, exercise, pregnancy), which is why rate control is central and why new AF can decompensate an otherwise stable patient.</p>
<p>For severe MS (MVA ≤ 1.5 cm², very severe ≤ 1.0 cm²), the intervention decision turns on <b>anatomy</b>: <b>percutaneous balloon mitral valvuloplasty (PBMV)</b> is preferred for favourable anatomy (a low Wilkins score — pliable, minimally calcified, non-thickened leaflets and subvalvular apparatus). PBMV is <b>contraindicated</b> by a <b>left-atrial thrombus</b> or <b>more-than-mild MR</b>, and unfavourable/calcified anatomy or concomitant disease pushes toward <b>surgical commissurotomy or mitral valve replacement</b>.</p>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Read the pre-procedure TEE for LA/appendage thrombus and grade the MR before offering PBMV — either finding sends the patient to surgery instead. And beware the pressure-half-time caveat: it is unreliable immediately after valvuloplasty or with significant AR.</p>
</div>`
  }
);

window.LESSONS["d3-tr"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: functional TR and the ring at the time of left-sided surgery",
    html: `<p>Most tricuspid regurgitation in surgical patients is <b>functional</b>: left-sided disease or pulmonary hypertension dilates the RV and the tricuspid annulus, and structurally normal leaflets fail to coapt. It is chronically <b>under-treated</b>, and unaddressed significant TR at the time of left-sided surgery predicts worse late outcomes and difficult reoperation.</p>
<p>The senior decision at mitral (or other left-sided) surgery: <b>add a tricuspid annuloplasty ring</b> when there is <b>severe TR</b>, or when there is a <b>dilated tricuspid annulus (≥ 40 mm, or ~21 mm/m² indexed)</b> even with lesser TR, because the annulus will keep dilating after the left-sided lesion is fixed. Reoperating on the tricuspid alone later carries a substantially higher mortality than adding the ring the first time.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE UNDER-TREATMENT TRAP</div>
  <p>"The TR will improve once we fix the mitral" is often wrong when the annulus is already dilated — it keeps progressing. Address it concurrently with a ring rather than accepting a difficult isolated tricuspid reoperation down the line.</p>
</div>`
  }
);

/* ---- Infective endocarditis (Ch15 Key Questions) — merged into Day-4 valve pathology ---- */
window.LESSONS["d3-mr"].chunks.push(
  {
    title: "Infective Endocarditis: Classification & Microbiology",
    html: `<p><b>Infective endocarditis (IE)</b> is microbial infection of the endocardial surface — valve leaflets, mural endocardium, or prosthetic material. Normal endothelium resists infection; the initiating lesion is a <b>platelet–fibrin thrombus</b> laid down on disrupted endothelium or on the low-pressure side of a regurgitant/turbulent jet, which is then seeded during transient bacteraemia to form a vegetation that can destroy the valve, invade the annulus (abscess), or embolise.</p>
<p>Classified by <b>tempo</b> — <b>acute</b> (fulminant over days, virulent organism e.g. <i>Staph aureus</i>, metastatic infection) vs <b>subacute</b> (indolent over weeks–months, low-virulence organism e.g. viridans <i>Streptococcus</i>) — and by the ESC scheme: <b>location/prosthetic material</b> (left- vs right-sided, native vs prosthetic, device-related), <b>mode of acquisition</b> (community, healthcare-associated, IVDU), activity, and recurrence.</p>
<ul>
  <li><b>Incidence:</b> native-valve IE ~2–4 / 100,000 / year; prosthetic-valve IE risk ~0.5–1% per year after valve surgery.</li>
  <li><b>Site:</b> usually <b>left-sided</b> (mitral &gt; aortic); tricuspid ~5% (classically IVDU); pulmonary valve rarely.</li>
  <li><b>Native-valve organisms:</b> viridans/other <i>Streptococcus</i> (~45%), <i>Staphylococcus</i> aureus/epidermidis (~35%), <i>Enterococcus faecalis</i> (~10%), then HACEK, Coxiella (Q fever), fungi.</li>
  <li><b>Early prosthetic (&lt;2 months):</b> staphylococci (45–50%, incl. coagulase-negative), Gram-negative bacilli, fungi. <b>Late prosthetic (&gt;2 months):</b> resembles native-valve flora (viridans strep, staph, enterococcus).</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">HACEK</div>
  <p>Fastidious Gram-negative bacilli needing prolonged culture in 10% CO₂: <b>H</b>aemophilus, <b>A</b>ctinobacillus actinomycetemcomitans, <b>C</b>ardiobacterium hominis, <b>E</b>ikenella corrodens, <b>K</b>ingella. A classic cause of <b>culture-negative</b> IE (with prior antibiotics, Coxiella, Bartonella, Brucella, Legionella, fungi).</p>
</div>
<div class="kbox">
  <div class="kbox-tag">MIMICS</div>
  <p><b>Non-infective (marantic) endocarditis:</b> mucinous adenocarcinoma (pancreas/lung/GI), lymphoma, antiphospholipid (Hughes) syndrome, acute rheumatic fever, and <b>Libman–Sacks</b> (SLE/scleroderma). Consider these when cultures stay negative.</p>
</div>`
  },
  {
    title: "Diagnosis: Modified Duke Criteria & Echo",
    html: `<p>Diagnosis uses the <b>modified Duke criteria</b> (ESC 2015), graded <b>definite / possible / rejected</b>. Over-diagnosis means needless prolonged antibiotics; missing it can be fatal.</p>
<p><b>Major criteria:</b></p>
<ul>
  <li><b>Positive blood cultures</b> — typical organism (viridans strep, <i>S. gallolyticus</i>, HACEK, community-acquired <i>S. aureus</i> or enterococci) from 2 separate cultures; or persistently positive cultures (≥2 drawn &gt;12 h apart, or majority of ≥3–4 drawn ≥1 h apart); or single positive/high IgG titre for <i>Coxiella burnetii</i>.</li>
  <li><b>Imaging evidence of endocardial involvement</b> — vegetation, abscess/pseudoaneurysm/fistula, valve perforation/aneurysm, new prosthetic dehiscence, new valvular regurgitation; or abnormal PET/CT activity around a prosthesis implanted &gt;3 months.</li>
</ul>
<p><b>Minor criteria:</b> predisposing heart condition or IVDU; fever &gt;38 °C; vascular phenomena (arterial emboli, septic pulmonary infarcts, mycotic aneurysm, intracranial/conjunctival haemorrhage, <b>Janeway lesions</b>); immunologic phenomena (glomerulonephritis, <b>Osler's nodes</b>, <b>Roth spots</b>, rheumatoid factor); microbiological evidence not meeting a major criterion.</p>
<ul>
  <li><b>Definite:</b> pathology of a vegetation/abscess; or 2 major; or 1 major + 3 minor; or 5 minor.</li>
  <li><b>Possible:</b> 1 major + 1 minor; or 3 minor.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">CULTURES BEFORE ANTIBIOTICS</div>
  <p>Take <b>≥3 sets of blood cultures</b>, ideally ≥30 min apart, with sterile technique, <b>before</b> starting antibiotics — otherwise the organism is often never identified and targeted therapy is impossible. Do not wait for a fever spike. ~⅓ of IE stays culture-negative, most commonly from prior antibiotics.</p>
</div>
<div class="kbox pearl">
  <div class="kbox-tag">TTE vs TOE</div>
  <p>TTE is first-line but insensitive; <b>TOE</b> is recommended whenever suspicion is high (and in most patients even with a positive TTE). Sensitivity for vegetations — native valve: <b>TTE ~70% vs TOE ~96%</b>; prosthetic valve: <b>TTE ~50% vs TOE ~92%</b>. Repeat in ~1 week if initial studies are negative but suspicion persists.</p>
</div>`
  },
  {
    title: "Antibiotic Therapy",
    html: `<p>Goal: <b>eradicate the organism with bactericidal drugs</b> (organisms inside a vegetation are shielded from host defences, so bacteriostatic agents fail), with surgery as adjunct to remove infected material. Choose therapy from cultured organism; until then treat the most likely organisms with microbiology input.</p>
<ul>
  <li><b>Empiric, organism unknown:</b> benzylpenicillin + gentamicin (to cover streptococci), or vancomycin + gentamicin if staphylococcus is suspected. Native/late-prosthetic acute: ampicillin + flucloxacillin + gentamicin (vancomycin + gentamicin if penicillin-allergic).</li>
  <li><b>Viridans <i>Streptococcus</i>:</b> penicillin G / ampicillin / ceftriaxone × 6 weeks (or ampicillin + gentamicin × 2 weeks if uncomplicated); vancomycin if beta-lactam allergic.</li>
  <li><b>Staphylococcus:</b> flucloxacillin (MSSA); vancomycin or daptomycin × 4–6 weeks for MRSA / penicillin allergy.</li>
  <li><b>Enterococcus:</b> synergistic combination (ampicillin + ceftriaxone, or vancomycin + gentamicin) for ≥6 weeks — intrinsically tolerant of single agents.</li>
  <li><b>HACEK:</b> often beta-lactamase producing → <b>ceftriaxone</b>.</li>
  <li><b>Prosthetic-valve IE:</b> vancomycin ≥6 weeks + gentamicin × 2 weeks + <b>rifampicin</b> (penetrates device biofilm). Fungal IE almost always needs surgical removal plus prolonged/lifelong antifungals.</li>
</ul>
<div class="kbox">
  <div class="kbox-tag">PERSISTENT FEVER ON TREATMENT</div>
  <p>Reconsider: wrong antibiotic, wrong diagnosis, <b>spread of infection</b> (paravalvular/intracardiac abscess, mycotic aneurysm, metastatic focus), a secondary infection (line/chest), or antibiotic hypersensitivity. Persisting positive cultures after 7–10 days (some say 48–72 h) of appropriate therapy is an indication to operate.</p>
</div>`
  },
  {
    level: 4,
    title: "Senior decision: when to operate on active endocarditis, and how urgently",
    html: `<p>About <b>half</b> of IE patients need surgery. Operating during active infection carries high mortality, so it is reserved for three ESC/AHA indication families — and the harder judgement is <b>timing</b> (emergency = &lt;24 h; urgent = within a few days; elective = after 1–2 weeks of antibiotics).</p>
<ul>
  <li><b>1. Heart failure (the strongest, most urgent):</b> severe acute AR or MR (chordal rupture, flail, leaflet perforation, or a vegetation preventing coaptation), obstruction, or a fistula causing refractory pulmonary oedema or cardiogenic shock → <b>emergency/urgent</b>. Heart failure is the leading indication and the leading driver of operative mortality.</li>
  <li><b>2. Uncontrolled infection:</b> locally invasive disease (<b>abscess</b>, false aneurysm, fistula, enlarging vegetation — commonest with aortic-valve or prosthetic IE and with <i>S. aureus</i>); infection by fungi or multiresistant organisms; persisting positive cultures despite appropriate therapy; prosthetic IE from staphylococci or non-HACEK Gram-negatives → <b>urgent</b>.</li>
  <li><b>3. Prevention of embolism:</b> persistent vegetation <b>&gt;10 mm</b> after ≥1 embolic event despite antibiotics; vegetation &gt;10 mm with severe valve dysfunction and low operative risk; isolated very large vegetation <b>&gt;15 mm</b> (or &gt;30 mm) even without other indication. Embolic risk is highest in the first days of therapy and with large/mobile vegetations, prior embolism, AF, or <i>S. aureus</i>.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PRINCIPLES & OUTCOMES</div>
  <p>Surgery = <b>total débridement of all infected material</b> + reconstruction; <b>repair the native valve when feasible</b> (better than replacement). When replacement is unavoidable, tissue vs mechanical prostheses show <b>no material difference in reinfection</b>. Mortality is substantial: overall 10–25%; native-valve operative mortality 5–15%; <b>prosthetic-valve 20–40%</b>. After a stroke without haemorrhage, surgery need not be delayed; after major haemorrhagic stroke, wait ~4 weeks if stable.</p>
</div>
<div class="kbox">
  <div class="kbox-tag">PROPHYLAXIS (highest-risk only)</div>
  <p>Antibiotic prophylaxis is now limited to <b>highest-risk patients</b> (prosthetic valve/repair material incl. TAVI, previous IE, specified congenital lesions) undergoing <b>high-risk dental procedures</b> (manipulating gingiva/periapical region or perforating oral mucosa): amoxicillin/ampicillin 2 g (clindamycin 600 mg if penicillin-allergic) 30–60 min before. It is no longer recommended for GI/GU, respiratory-mucosa, TOE, or skin procedures. Good dental hygiene matters more than any single prophylactic dose.</p>
</div>`
  }
);
