window.LESSONS = window.LESSONS || {};

window.LESSONS["d4-echo"] = {
  id: "d4-echo",
  day: 5,
  ord: 1,
  title: "Echocardiography Essentials",
  short: "EchoEssen",
  minutes: 18,
  chunks: [
    {
      title: "ECG in Cardiac Surgery: The Systematic Approach",
      html: "<p>The 12-lead ECG is a constant companion in cardiac surgery — in the preoperative evaluation, in the OR where ST changes signal ischemia, and in the ICU where arrhythmias and pacing capture are daily concerns. A systematic approach ensures nothing is missed.</p><p>The ten-step system (never skip steps):</p><ol><li><b>Rate:</b> Normal 60–100; bradycardia &lt;60; tachycardia &gt;100</li><li><b>Rhythm:</b> Regular or irregular? P waves before every QRS? PR interval consistent?</li><li><b>Axis:</b> Normal &minus;30&deg; to +90&deg;; LAD &minus;30&deg; to &minus;90&deg;; RAD +90&deg; to +180&deg;</li><li><b>P wave:</b> Normal &lt;120 ms; broad notched &ldquo;P mitrale&rdquo; = LA enlargement (MS/MR); peaked &ldquo;P pulmonale&rdquo; = RA enlargement; biphasic in V1 = LA abnormality</li><li><b>PR interval:</b> Normal 120–200 ms; prolonged = 1st-degree AV block; shortened = accessory pathway</li><li><b>QRS morphology:</b> Narrow &lt;120 ms = supraventricular; wide &ge;120 ms = BBB or ventricular origin; delta wave = WPW</li><li><b>QT interval:</b> QTc &gt;450 ms (men) or &gt;460 ms (women) = prolonged; risk for Torsades de Pointes</li><li><b>ST changes:</b> Elevation &gt;1 mm in 2 contiguous leads = STEMI equivalent; depression = subendocardial ischemia</li><li><b>T waves:</b> Inversions = ischemia/strain; peaked T = hyperkalemia</li><li><b>Q waves:</b> Pathological = &ge;40 ms wide OR &ge;25% of R wave amplitude in the same lead = prior full-thickness infarction</li></ol><p>Two habits separate a fluent read from a dangerous one. <b>Calibrate before you interpret:</b> confirm 25 mm/s paper speed and a 10 mm/mV gain box &mdash; a half-standardised tracing halves every voltage and can manufacture false low-voltage or talk you out of a real LVH. And get <b>rate</b> fast with the big-box rule: 300 divided by the number of large boxes between R waves (1&rarr;300, 2&rarr;150, 3&rarr;100, 4&rarr;75, 5&rarr;60); for an irregular rhythm count the QRS complexes in a 6-second strip and multiply by 10.</p><p>The axis and QRS steps are not academic in a cardiac-surgery patient. A leftward shift past &minus;45&deg; (qR in aVL, rS inferiorly) is <b>left anterior fascicular block</b>; a rightward shift (rS in I, qR in III) is <b>left posterior fascicular block</b>. These matter because the His bundle and its branches run through the membranous septum only millimetres from the aortic annulus and the base of the interventricular septum &mdash; the exact tissue put at risk during aortic valve replacement, septal myectomy, and VSD repair. A <em>new</em> fascicular block, new RBBB, or new first-degree AV block after such an operation is the ECG announcing conduction-system trauma, and the reason complete heart block with a need for permanent pacing is a recognised complication of those procedures.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>Read hyperkalaemia as a sequence, not a single sign: peaked T waves come first (~5.5&ndash;6.5 mmol/L), then the P wave flattens and the PR lengthens (~6.5&ndash;7.5), then the QRS widens and finally merges into a sine wave (&gt;8 mmol/L) &mdash; a pre-arrest pattern. In a fresh post-op patient washing out cardioplegia and receiving stored blood, a widening QRS with peaked Ts is potassium until proven otherwise.</div>"
    },
    {
      title: "MI Localization and Post-Surgery ECG Changes",
      html: "<p>Localizing MI by ECG territory allows identification of the culprit vessel and prediction of specific complications. This is critical in both preoperative assessment and postoperative monitoring.</p><table><tr><th>Territory</th><th>Leads</th><th>Culprit Vessel</th></tr><tr><td>Inferior</td><td>II, III, aVF</td><td>RCA (right-dominant system)</td></tr><tr><td>Anterior</td><td>V1–V4</td><td>LAD</td></tr><tr><td>Lateral</td><td>I, aVL, V5–V6</td><td>LCx/diagonal</td></tr><tr><td>Posterior</td><td>Dominant R in V1, ST depression V1–V2</td><td>RCA or LCx</td></tr><tr><td>RV MI</td><td>ST elevation V4R</td><td>Proximal RCA</td></tr></table><p>Post-cardiac surgery ECG changes to recognize: new LBBB after AVR (suggests septal injury); new Q waves (possible periprocedural MI); new ST elevation in a graft territory (urgent evaluation for graft failure).</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div>New LBBB + ST elevation in anterior leads after cardiac surgery should prompt urgent evaluation for proximal LAD territory ischemia or graft failure. Per Sgarbossa criteria, concordant ST changes in LBBB are diagnostic of MI.</div><p>Localisation is not trivia &mdash; the <em>territory</em> predicts the <em>mechanical complication</em>, and the surgeon is called for exactly these. An inferior (RCA) infarct is the one that ruptures a papillary muscle, because the <b>posteromedial papillary muscle has a single blood supply</b> from the posterior descending artery, whereas the anterolateral muscle is dual-fed by the LAD and circumflex; single-supply territory is single-fault territory, and the result is acute, poorly tolerated mitral regurgitation. Post-infarction <b>ventricular septal rupture</b> also follows territory: roughly 50&ndash;66% complicate anterior infarcts (rupturing the distal third of the septum) and the remainder inferior infarcts (rupturing the basal inferior septum) &mdash; the same map read for a different disaster.</p><p>Two ECG patterns are easy to miss and change management immediately. <b>Posterior infarction</b> shows no ST elevation on the standard leads; instead look for tall R waves and ST depression in V1&ndash;V2 (the mirror image), confirmed with posterior leads V7&ndash;V9. <b>Right-ventricular infarction</b> accompanies proximal-RCA inferior MIs: ST elevation in V4R, hypotension, clear lungs, and distended neck veins &mdash; giving a nitrate here can collapse a preload-dependent RV. Echo confirms it with a dilated, poorly contracting RV (TAPSE &lt;17 mm, tissue-Doppler S&prime; &lt;9.5 cm/s) and a plethoric IVC that fails to collapse.</p>"
    },
    {
      type: "checkpoint",
      q: "A post-CABG patient's ECG shows new ST elevation in leads II, III, and aVF. What is the most likely cause and most urgent concern?",
      options: [
        "Pericarditis — normal post-CABG finding",
        "RCA territory graft failure",
        "Left main disease with diffuse ST changes",
        "Anterior MI from LAD graft failure"
      ],
      answer: 1,
      explain: "ST elevation in II, III, aVF localizes to the inferior (RCA) territory. In a post-CABG patient, new inferior ST elevation should trigger urgent evaluation for failure of the RCA graft (SVG or if native RCA was not bypassed, native occlusion). Pericarditis typically causes diffuse saddle-shaped ST elevation. This requires emergent cath lab activation."
    },
    {
      title: "TTE: Standard Windows and Key Parameters",
      html: "<p>Echocardiography is the most important imaging modality in cardiac surgery. The transthoracic echo (TTE) provides multiple acoustic windows, each revealing different structures. Understanding what each view shows allows interpretation of echo reports at the bedside.</p><p><b>Standard TTE views:</b></p><ul><li><b>Parasternal long axis (PLAX):</b> LV, mitral valve, aortic valve, proximal ascending aorta, LA. Measures LVEDD, LVESD, aortic root diameter.</li><li><b>Parasternal short axis (PSAX):</b> Cross-sections at AV (commissures), MV (fish-mouth), and papillary muscle levels. Identifies regional wall motion.</li><li><b>Apical 4-chamber:</b> All four chambers. Volumes for EF by Simpson's biplane. Mitral and tricuspid valve assessment. LV apical thrombus.</li><li><b>Apical 5-chamber:</b> Adds LVOT and aortic valve — Doppler interrogation of aortic valve.</li><li><b>Subcostal:</b> Pericardial effusion, IVC size (estimates RAP), RV dimensions.</li></ul><p>Understanding <em>how</em> the image is built prevents mistaking artefact for pathology. Ultrasound reflects best off structures <b>perpendicular</b> to the beam, so a calcified leaflet returns a bright echo but also throws shadows and reverberations behind it. Sound crosses blood and muscle well and air poorly &mdash; which is exactly why TEE, sitting in the oesophagus with less tissue to cross and almost no interposed lung, out-resolves TTE. The three displays trade the same currency: <b>M-mode</b> gives the best temporal resolution (timing of events), <b>2D</b> the best spatial map, and <b>3D</b> the best rendering of spatial relationships.</p><p><b>Doppler</b> is how echo measures flow, and it is angle-dependent: the calculated velocity falls as the beam-to-flow angle widens, so the rule is to align the beam as parallel to flow as possible. Across a narrowing, velocity rises and the simplified Bernoulli equation converts it to a pressure gradient (<b>&Delta;P = 4 &times; velocity&sup2;</b>). The three modes answer different questions: <b>pulsed-wave (PW)</b> has fine spatial resolution and localises <em>where</em> a jet is but aliases at high velocity (~2 m/s); <b>continuous-wave (CW)</b> captures the highest velocity along the whole beam with no localisation; <b>colour flow</b> maps velocity and direction, but the colour of a regurgitant jet reflects the <em>velocity</em> of disturbed blood, not the <em>volume</em> of regurgitation &mdash; and it swells or shrinks with machine gain and driving pressure.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>Doppler gradients are load-dependent, and anaesthesia lowers blood pressure and flow. A regurgitant jet or a valve gradient can look milder on the intraoperative study than in clinic &mdash; so the <b>decision to operate is anchored to the preoperative (awake) values</b>, not to the numbers seen after induction.</div>"
    },
    {
      title: "Interpreting Key Echo Parameters",
      html: "<p>Reading an echo report requires understanding what each number means clinically. These parameters are reported on every standard echo and drive clinical decisions in cardiac surgery.</p><p><b>Ejection Fraction (EF):</b> Normal &ge;55%; mildly reduced 41–54%; moderately reduced 30–40%; severely reduced &lt;30%. Calculated by Simpson's biplane (most accurate) or M-mode. EF is load-dependent — artificially elevated in MR (reduced afterload) and may be falsely preserved in early dysfunction.</p><p><b>LV Dimensions:</b></p><ul><li>LVEDD (end-diastolic): Normal &le;55 mm (indexed &le;27 mm/m²). Increased = eccentric hypertrophy (AR, MR)</li><li>LVESD (end-systolic): Normal &le;40 mm — most important for timing MR surgery</li></ul><p><b>Wall Motion Abnormality (WMA):</b> 16- or 17-segment model. Normal (1), hypokinetic (2), akinetic (3), dyskinetic (4). RWMA in a specific territory = ischemia or infarct until proven otherwise.</p><div class='kbox mnemonic'><div class='kbox-tag'>MNEMONIC</div>The two hypertrophy patterns fall straight out of the two overloads — read the dimensions and you know the lesion: <b>Pressure → Pump harder → thick walls, small cavity (concentric; AS, hypertension)</b>. <b>Volume → Vast chamber → dilated cavity, normal walls (eccentric; AR, MR)</b>. So a big LVEDD with normal wall thickness is a leaking valve until proven otherwise.</div><p>Numbers earn their keep only against context. A &ldquo;normal&rdquo; ejection fraction of 55&ndash;70% means something different in mitral regurgitation, where the leaking valve unloads the LV into a low-pressure atrium and props the EF up: a <em>normal</em> EF in significant MR is actually about <b>70%</b>, so an EF that has drifted below 60% &mdash; or an end-systolic dimension over 40 mm &mdash; already signals the onset of true LV dysfunction and is a trigger to operate <em>before</em> the number looks abnormal.</p><p>Regional wall motion is scored segment-by-segment on a 16- or 17-segment model (the 17th is an apical cap for perfusion), each graded by how much the wall <em>thickens</em>: normal/hyperkinetic, hypokinetic (reduced thickening), akinetic (none), or dyskinetic (systolic bulging). The appearance also dates the injury: fresh ischaemia gives a hypo- or akinetic segment of normal thickness, whereas an old infarct scar is <b>thin, bright and akinetic</b>, and a true aneurysm is a thin segment that bulges outward in systole. This is why a resting regional wall-motion abnormality is ischaemia or infarction in that artery's territory until proven otherwise.</p><div class='kbox study'><div class='kbox-tag'>STUDY</div>To tell scar from sleeping muscle before revascularising a weak ventricle, use <b>low-dose dobutamine stress echo</b> and watch for the <em>biphasic response</em>: a viable, hibernating segment contracts <em>better</em> at low dose (2.5&ndash;10 mcg/kg/min), then worsens at high dose (20&ndash;40) as demand outstrips a fixed supply. A segment that never augments is scar and will not recover after a graft &mdash; and demonstrable viability predicts a survival benefit from revascularisation.</div>"
    },
    {
      type: "checkpoint",
      q: "An echo report notes LVEDD 71 mm, LVESD 53 mm, EF 44%, with normal wall thickness. Which pattern does this most suggest?",
      options: [
        "Concentric hypertrophy from longstanding aortic stenosis",
        "Hypertrophic cardiomyopathy",
        "Normal LV with technically limited views",
        "Eccentric hypertrophy from volume overload (AR or MR)"
      ],
      answer: 3,
      explain: "Eccentric hypertrophy is the pattern of volume overload (AR, MR): both the cavity and the wall enlarge, so LVEDD and LVESD are increased while wall thickness remains normal or mildly increased. Concentric hypertrophy (AS, hypertension) features increased wall thickness with a normal or small cavity. LVEDD 71 mm and LVESD 53 mm with EF 44% represents a markedly dilated, volume-overloaded LV."
    },
    {
      title: "Diastolic Function Assessment",
      html: "<p>Systole is the heart's contraction; diastole is its <em>relaxation and filling</em> — and a stiff ventricle can fail at filling long before it fails at squeezing. Assessing diastolic function is really asking one question: how hard is the atrium having to push to fill the ventricle? The Doppler numbers are just different ways of measuring that filling pressure. It matters most in exactly the hearts cardiac surgery deals with — the thick, stiff LV of aortic stenosis, and any ventricle recovering from bypass.</p><p>The trap to understand is that the filling pattern gets <em>worse, then briefly looks normal again, then worse still</em> — so the numbers move in a U-shape as disease progresses. Key parameters:</p><ul><li><b>E/A ratio:</b> E = early passive mitral inflow velocity; A = late atrial-kick velocity. Normal 0.8–1.5.</li><li><b>E/e' ratio:</b> e' = tissue Doppler velocity at mitral annulus (reflects relaxation speed). E/e' &gt;14 = elevated filling pressure.</li><li><b>Pulmonary vein flow pattern</b></li></ul><p>Grading diastolic dysfunction:</p><ul><li><b>Grade I (impaired relaxation):</b> E/A &lt;0.8, low E/e'. LVEDP usually normal.</li><li><b>Grade II (pseudonormal):</b> E/A 0.8–1.5, elevated E/e'. LVEDP elevated.</li><li><b>Grade III (restrictive filling):</b> E/A &gt;2, high E/e'. Markedly elevated LVEDP — worst prognosis.</li></ul><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>&ldquo;Pseudonormal&rdquo; filling (Grade II) can be unmasked by Valsalva maneuver: the E/A ratio drops to the impaired relaxation pattern, revealing the true Grade II dysfunction. E/e' remains elevated regardless.</div><p>The reason this matters in the operating room: diastolic dysfunction tracks the very hearts cardiac surgery treats. It is <em>most</em> pronounced in <b>low-flow, low-gradient aortic stenosis with a preserved ejection fraction</b> &mdash; typically an elderly patient with a small, thick, stiff LV cavity &mdash; where a mitral E/e&prime; &gt;15, an E-wave deceleration time &lt;150 ms, and an E/A &gt;2.5 mark a frankly restrictive filling pattern. The same stiff physiology explains why such a ventricle, and any heart coming off bypass, is exquisitely <b>preload- and atrial-kick-dependent</b>: lose sinus rhythm or run it dry and filling collapses even though contraction is intact.</p><p>Two supportive signs sharpen the read. A short deceleration time (&lt;160 ms) and blunting or <b>systolic reversal of pulmonary-vein flow</b> both point to a high, poorly compliant left atrium. And when a restrictive-looking mitral inflow raises the question of <b>constrictive pericarditis</b>, the discriminator is respiration: constriction shows exaggerated respiratory variation in mitral and tricuspid inflow (a &gt;25% inspiratory drop in mitral E and a &gt;40% rise in tricuspid E on the first beat) with a preserved or high tissue-Doppler e&prime;, whereas restrictive cardiomyopathy has a low e&prime; and no respiratory variation.</p>"
    },
    {
      title: "TEE: The Intraoperative Standard",
      html: "<p>Transesophageal echocardiography (TEE) provides superior image quality for posterior cardiac structures and is the standard intraoperative monitor in cardiac surgery. Its proximity to the heart (via the esophagus) eliminates chest wall and lung interference.</p><p><b>Key TEE views for cardiac surgery:</b></p><ul><li><b>Midesophageal 4-chamber:</b> All chambers, mitral and tricuspid valves</li><li><b>Midesophageal AV long/short axis:</b> Aortic valve morphology and root</li><li><b>Midesophageal bicaval:</b> IVC, SVC, atrial septum (ASD, patent foramen ovale)</li><li><b>Transgastric short axis (TG SAX) at mid-papillary level:</b> All LV walls visible simultaneously — the standard monitoring view for intraoperative ischemia. All three coronary territories (LAD anterior wall, LCx lateral wall, RCA inferior wall) are seen in a single view.</li><li><b>Deep transgastric:</b> LVOT and aortic valve Doppler</li><li><b>Midesophageal ascending aorta:</b> Assess for aortic disease before clamping</li></ul><p>TEE earns &ldquo;standard&rdquo; partly on its safety record: in a series of 7200 intraoperative studies the complication rate was about 0.2% with no TEE-related deaths, the commonest problem being odynophagia; serious events (upper-GI bleeding, dental injury, oesophageal perforation ~0.01%) are rare. The trade-off is real, so screen for it &mdash; <b>absolute contraindications</b> are a perforated viscus and prior oesophagectomy; <b>relative</b> ones include varices, strictures, diverticula and recent upper-GI bleeding &mdash; and when TEE is contraindicated a sterile-sheathed or epicardial probe on the open heart can substitute.</p><p>Two intraoperative jobs are almost unique to the surgical echo. Before aortic cannulation, <b>epiaortic scanning</b> grades atheroma in the ascending aorta (maximal plaque height, its location, and any mobile components) &mdash; and moving the cannulation or cross-clamp site away from significant plaque measurably reduces stroke, a call TEE alone cannot make because of its blind spot in the distal ascending aorta. Then, once the heart is closed and beating, TEE hunts <b>intracardiac air</b> in its favourite hiding places &mdash; the dome of the left atrium, the superior pulmonary veins, and the LV apex &mdash; where trapped bubbles throw bright comet-tail artefacts; finding and venting them shortens the time from cross-clamp removal to safe separation and lowers embolic morbidity.</p>"
    },
    {
      title: "Critical Post-Bypass TEE Checklist",
      html: "<p>After cardiopulmonary bypass, before separating from the machine, a systematic TEE assessment ensures the surgical result is adequate and no immediate life-threatening complications are present. This checklist must be completed before the chest is closed.</p><ol><li><b>LV function:</b> Global EF and regional wall motion — new RWMA may indicate periprocedural ischemia</li><li><b>Valve function:</b> Adequacy of repair or replacement — residual gradient, residual regurgitation</li><li><b>Intracardiac air:</b> Air must be fully evacuated from chambers before separation from bypass</li><li><b>Pericardial space:</b> Effusion or hemopericardium</li><li><b>Aortic cannulation site:</b> No evidence of aortic dissection</li><li><b>Aortic valve (in CABG cases):</b> Ensure no significant AR that would impede antegrade cardioplegia delivery</li></ol><div class='kbox study'><div class='kbox-tag'>STUDY</div>The TG SAX view is the most efficient single view for detecting new intraoperative ischemia — it simultaneously images all three coronary territories. A new wall motion abnormality in one territory during bypass weaning prompts immediate attention to the corresponding graft.</div><p>The checklist is really a hunt for the handful of findings that <em>reverse the decision to come off bypass</em>. After a <b>mitral repair</b>, the danger is <b>systolic anterior motion (SAM)</b>: a tall residual anterior leaflet or an over-small annuloplasty ring drags the leaflet into the LVOT, producing dynamic outflow obstruction and a posteriorly directed jet of new MR &mdash; often settled by loading the ventricle, slowing it, and stopping inotropes, but sometimes demanding a return to bypass to revise the repair. After any <b>valve replacement</b>, read the jets carefully: mechanical prostheses have brief, low-intensity <em>washing jets</em> by design (they keep the occluder clean), whereas a jet <em>outside</em> the sewing ring is a <b>paravalvular leak</b>, and a rising transvalvular gradient with restricted leaflet motion suggests entrapment or thrombus.</p><p>The residual lesion that is easy to accept and dangerous to leave is <b>aortic regurgitation</b> in a CABG case &mdash; it steals antegrade cardioplegia away from the coronaries and distends the arrested ventricle. And because anaesthesia lowers pressure and flow, a &ldquo;trivial&rdquo; post-bypass leak may be a real one under normal load: this is where surgeon and echocardiographer work as a two-way team, the imager predicting from the numbers and the surgeon feeding back what the repair actually looks like.</p>"
    },
    {
      type: "checkpoint",
      q: "Which single TEE view is most valuable for monitoring intraoperative ischemia during cardiac surgery, and why?",
      options: [
        "Midesophageal 4-chamber — shows all four valves",
        "Transgastric short axis at the mid-papillary level",
        "Midesophageal bicaval — shows the atrial septum clearly",
        "Deep transgastric — provides the best aortic valve Doppler"
      ],
      answer: 1,
      explain: "The transgastric short-axis (TG SAX) view at the mid-papillary level images the LV in cross-section, displaying the anterior wall (LAD territory), lateral wall (LCx territory), and inferior wall (RCA territory) simultaneously in one view. This efficiency makes it the standard intraoperative ischemia monitoring view — any new regional wall motion abnormality can be attributed immediately to its coronary territory."
    }
  ]
};

window.LESSONS["d4-cath"] = {
  id: "d4-cath",
  day: 5,
  ord: 2,
  title: "Cath & Coronary Angiography",
  short: "CathCoron",
  minutes: 14,
  chunks: [
    {
      title: "What the Cath Report Tells the Surgeon",
      html: "<p>If the echo tells the surgeon how the heart is <em>working</em>, the coronary angiogram is the <b>road map</b> for the operation — it shows exactly where the roadblocks are so the team can plan which detours (grafts) to build and where to land them. Coronary angiography is the definitive test for coronary disease, and reading its report fluently is as fundamental for a cardiac surgeon as reading the echo: it dictates the entire operative plan before the first incision.</p><p>A standard cath report includes:</p><ul><li><b>Coronary anatomy and dominance</b> (right dominant ~85%, left dominant ~8%, co-dominant ~7%)</li><li><b>Percent stenosis of each segment</b> — reported as diameter stenosis by visual assessment (e.g., &ldquo;90% stenosis of the proximal LAD&rdquo;)</li><li><b>TIMI flow grade:</b> 0 = no flow; 1 = trickle only; 2 = slow fill; 3 = normal flow</li><li><b>Left ventricular angiogram:</b> EF estimate, regional wall motion (though less precise than echo)</li><li><b>Hemodynamic data:</b> Filling pressures, cardiac output, valve gradients if measured during right heart catheterization</li></ul><p>Dominance is not a footnote &mdash; it defines whose territory is at stake. The <b>dominant artery is the one that gives off the posterior descending artery</b> and supplies the inferior wall, the AV node, and (via the PDA) the single-supply posteromedial papillary muscle. In a right-dominant heart a proximal RCA lesion therefore threatens the inferior wall <em>and</em> the conduction system; in the minority who are left-dominant, the circumflex carries that whole load, so left-sided disease jeopardises even more myocardium.</p><p><b>Percent stenosis</b> is a visual, diameter-based estimate and only part of the story: a 2D shadow of a 3D eccentric plaque can read very differently between two experienced angiographers. That is why physiologic testing exists &mdash; a pressure wire gives the <b>fractional flow reserve (FFR = distal coronary pressure &divide; aortic pressure during adenosine hyperaemia)</b>, and a Doppler wire gives <b>coronary flow (velocity) reserve</b>; an FFR at or below ~0.75&ndash;0.80, or a flow reserve under 2.0, marks a lesion that actually limits flow. The report also carries <b>TIMI flow</b> (0 = occluded, through 3 = brisk normal fill) and, on the ventriculogram, an EF and wall-motion estimate &mdash; useful, but less precise than echo.</p>"
    },
    {
      title: "Interpreting Stenosis Severity and Planning Bypass",
      html: "<p>The threshold for significant coronary stenosis that warrants surgical bypass is generally defined by lumen reduction. However, anatomic stenosis alone does not always reflect hemodynamic significance — functional assessment modifies decision-making.</p><p><b>Standard surgical thresholds:</b></p><ul><li>&ge;70% diameter stenosis in major coronary arteries (LAD, LCx, RCA, large diagonals, obtuse marginals)</li><li>&ge;50% diameter stenosis for the <b>left main coronary artery</b> (any left main disease changes urgency)</li><li>Fractional flow reserve (FFR) &lt;0.80 = hemodynamically significant — can reclassify visual 50–70% lesions</li></ul><p>The surgeon uses the cath report to: identify target vessels for bypass grafting; assess vessel quality <i>distal</i> to the stenosis (poor distal runoff = poor graft patency); identify left main disease (changes urgency and operative approach); confirm concomitant disease.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>A lesion can be visually 60% by angiography but functionally significant (FFR &lt;0.80) — or conversely, appear 80% but have preserved FFR. For intermediate lesions (50–70%), FFR-guided decision-making reduces unnecessary interventions.</div><p>The 70% threshold is not arbitrary &mdash; it is where geometry crosses physiology. Because flow through a tube falls with the <em>fourth power</em> of the radius, a stenosis expressed as <b>diameter</b> is far worse read as <b>cross-sectional area</b>: a 50% diameter narrowing is already about 75% area loss, and a 70% diameter lesion is roughly 90% area &mdash; the point at which even resting flow, not just flow reserve, begins to fail. Milder lesions blunt the ability to <em>augment</em> flow on demand (exertional angina) long before they limit resting supply, which is exactly the ambiguous 50&ndash;70% band where an FFR wire converts a picture into a decision.</p><p>Planning bypass is as much about the <em>landing zone</em> as the blockage. The surgeon reads the vessel <b>distal</b> to the stenosis: a soft, non-calcified target of at least ~1.5 mm with good run-off will hold a graft, whereas a diffusely diseased, heavily calcified, or tiny distal vessel predicts early graft failure no matter how tight the proximal lesion. Chronic total occlusions with well-developed collaterals, the quality of each target, and the burden of calcium at the planned anastomosis all feed the operative map &mdash; and routinely using FFR to justify grafting borderline vessels lowers adverse events and repeat procedures.</p>"
    },
    {
      type: "checkpoint",
      q: "A cath report shows 90% stenosis proximal LAD, 80% mid-RCA, 70% first OM, and a clean left main. How many grafts should be planned?",
      options: [
        "Three grafts",
        "One graft to the LAD only",
        "One graft to the left main",
        "Two grafts — LAD and RCA only; OM is borderline"
      ],
      answer: 0,
      explain: "This is three-vessel coronary artery disease (3VD). All three vessels have significant stenosis (90%, 80%, and 70% respectively) meeting the threshold for surgical bypass. Standard planned grafts: LIMA to the LAD (most important — LIMA has >90% patency at 10 years), plus SVG or radial artery to the first OM, plus SVG to the mid-RCA. This constitutes triple CABG."
    },
    {
      title: "Reading Left Main and Multivessel Disease",
      html: "<p>Left main coronary artery (LMCA) disease is the highest-urgency finding on a cath report. The LMCA supplies the left anterior descending and left circumflex arteries — together feeding the majority of LV myocardium in most patients.</p><p><b>Unprotected left main disease (&ge;50% stenosis) is a Class I indication for CABG</b> in most settings, particularly with intermediate to high SYNTAX scores. Key considerations:</p><ul><li>Left main &ge;50% is an angiographic emergency — even if electively discovered, semi-urgent surgical planning is required</li><li>In right-dominant systems, left main disease may jeopardize 70–80% of left ventricular myocardium</li><li>CABG is preferred over PCI for left main disease when SYNTAX score is intermediate (&gt;22) or high (&gt;32) — based on EXCEL and NOBLE trials</li></ul><div class='kbox danger'><div class='kbox-tag'>DANGER</div>A patient with unprotected left main disease should not undergo non-cardiac surgery without first addressing the coronary disease or at minimum having surgical or anesthetic precautions in place. Stress-induced ischemia from left main disease can precipitate ventricular fibrillation.</div><p>The <b>SYNTAX score</b> is how the Heart Team turns anatomy into a number: it grades each significant lesion for complexity &mdash; location, bifurcation involvement, calcification, tortuosity, length, and total occlusion &mdash; and sums them, so a low score (&le;22) describes disease a stent can handle well while intermediate (23&ndash;32) and high (&ge;33) scores describe disease where surgery pulls ahead. The logic is that CABG bypasses the <em>whole diseased segment and guards against future proximal lesions</em>, whereas a stent treats only the point it covers.</p><p>Two anatomic patterns push hard toward surgery. Multivessel disease <b>with diabetes</b> does better with CABG than PCI &mdash; the diffuse, small-vessel biology that defines diabetic coronaries is exactly what surgical grafting handles best. And a <b>&ldquo;left-main equivalent&rdquo;</b> &mdash; severe disease of both the proximal LAD and proximal circumflex &mdash; jeopardises the same myocardium as a left-main lesion and carries the same urgency. Threading through all of it is the most durable graft in cardiac surgery: the <b>LIMA to the LAD</b>, patent in over 90% of patients at 10 years, which is why the LAD is protected first in almost every operative plan.</p>"
    },
    {
      title: "Right Heart Catheterization: Hemodynamic Data",
      html: "<p>Right heart catheterization (RHC) using a Swan-Ganz pulmonary artery catheter provides direct hemodynamic measurements that complement angiographic data, particularly for valve disease assessment and heart failure staging.</p><p>Key RHC parameters:</p><ul><li><b>Right atrial pressure (RAP):</b> Normal &lt;8 mmHg; elevated in RV failure, TR, constrictive pericarditis</li><li><b>Pulmonary artery pressure (PAP):</b> Normal &lt;25/10 mmHg (mean &lt;20); pulmonary hypertension = mean &ge;25 mmHg</li><li><b>Pulmonary capillary wedge pressure (PCWP):</b> Approximates LAP; normal &lt;12 mmHg; elevated = left heart disease</li><li><b>Cardiac output (CO):</b> Thermodilution or Fick method</li><li><b>Valve gradients:</b> Simultaneous LV-to-aorta pullback gradient confirms AS severity when echo is discordant</li></ul><p>The numbers are only useful against their normal ranges: <b>RA pressure ~2&ndash;8 mmHg, PA ~25/10 (mean &lt;20), wedge ~6&ndash;12, cardiac index 2.2&ndash;4.4 L/min/m&sup2;, systemic vascular resistance ~800&ndash;1200 dyn&middot;s/cm&sup5;</b>, and mixed-venous saturation ~60&ndash;75%. Cardiac output is measured either by <b>thermodilution</b> (a cold bolus and a downstream temperature curve) or by the <b>Fick principle</b> (output = oxygen consumption &divide; arteriovenous oxygen difference) &mdash; and a falling mixed-venous saturation is an early alarm that delivery is not keeping up with demand.</p><p>Reading the waveforms adds a layer angiography cannot. The wedge tracing is a window onto the left atrium: a giant <b>v-wave</b> betrays significant mitral regurgitation, a prominent <b>a-wave</b> a stiff or obstructed left heart. Two caveats keep the surgeon honest &mdash; <b>CVP is an unreliable stand-in for LV preload</b> (it rises with RV failure, TR, tamponade, and PE regardless of left-sided filling), and <b>wedge overestimates the effective LV filling pressure in mitral stenosis</b>, where it reflects a high LA pressure the LV never sees. When echo and catheter disagree, a simultaneous LV-to-aorta pullback settles aortic-stenosis severity, and the <b>Gorlin equation</b> derives valve area from flow and mean gradient &mdash; remembering that at low output a modestly stenotic valve can post a small calculated area (the low-flow, low-gradient trap). Finally, the transpulmonary gradient and calculated <b>pulmonary vascular resistance</b> decide candidacy questions such as transplantation, where fixed pulmonary hypertension threatens the donor right ventricle.</p>"
    },
    {
      type: "checkpoint",
      q: "Which finding on a cath report most urgently changes surgical planning and elevates operative priority?",
      options: [
        "70% stenosis of the mid-RCA in a right-dominant system",
        "80% stenosis of the first diagonal branch",
        "Complete occlusion of a small obtuse marginal",
        "50% stenosis of the left main coronary artery"
      ],
      answer: 3,
      explain: "Left main stenosis ≥50% is the highest-urgency finding in coronary angiography. Even 50% left main stenosis (lower threshold than the 70% used for other vessels) triggers Class I recommendation for surgical revascularization. The left main supplies most of the LV myocardium — abrupt occlusion or ischemia can be immediately fatal. This finding changes the urgency, approach, and anesthetic planning of any concurrent surgery."
    }
  ]
};

window.LESSONS["d4-ct"] = {
  id: "d4-ct",
  day: 5,
  ord: 3,
  title: "CXR, CT & Cross-sectional Imaging",
  short: "CXR-CT-MRI",
  minutes: 16,
  chunks: [
    {
      title: "Cardiac CT: Pre-TAVR Workup",
      html: "<p>Cardiac CT (computed tomography) provides the anatomic detail that echo and fluoroscopy cannot — precise three-dimensional measurements of structures, calcium quantification, and vascular access planning. In cardiac surgery, CT has become indispensable for specific high-stakes decisions.</p><p>The most important application is the <b>pre-TAVR workup</b>. TAVR (transcatheter aortic valve replacement) requires meticulous sizing of the aortic annulus to select the correct valve size — too small causes paravalvular leak, too large causes annular rupture.</p><p>Pre-TAVR CT assessment includes:</p><ul><li><b>Annular sizing:</b> CT is the gold standard — measures annular perimeter and area to choose valve size</li><li><b>Coronary ostial heights:</b> Low coronary ostia (&lt;10 mm from annulus to LCA) risk ostial occlusion by the deployed valve</li><li><b>LVOT dimensions:</b> Assess for LVOT calcification that may complicate valve deployment</li><li><b>Aortic root and ascending aorta anatomy</b></li><li><b>Access planning:</b> Femoral artery diameter and calcification, iliac tortuosity; also axillary, transapical access sites</li></ul><p>What makes CT the reference for this job is <em>volumetric, motion-free</em> anatomy. The scanner rotates an x-ray tube around the patient, and because it must image faster than the heart beats, it is <b>ECG-gated</b> &mdash; reconstructing only a thin slice of the cardiac cycle (usually quiet mid-diastole, near 75% of the R-R interval), often with beta-blockade to slow and steady the rate. The payoff is sub-millimetre spatial resolution (&lt;0.5 mm) with no cardiac blur, which is exactly what annular sizing demands: the aortic <b>annulus is elliptical, not circular</b>, so a single echo diameter under-measures it whereas CT gives the true perimeter and area from a 3D dataset.</p><p>Every pre-TAVR measurement maps to a specific complication the team is trying to avoid. Undersize the valve and you get <b>paravalvular leak</b>; oversize it and you risk <b>annular rupture</b>. The <b>coronary ostial heights</b> and leaflet lengths are measured because a displaced native leaflet can occlude a low-lying ostium during deployment. CT also predicts the <b>optimal fluoroscopic projection</b> (the angle that lays the annular plane on edge), saving contrast and time in the lab, and it sizes the <b>ilio-femoral access</b> &mdash; diameter, calcification and tortuosity &mdash; because the delivery sheath is large and a hostile vessel forces an alternative (axillary, transapical, transcaval) route.</p>"
    },
    {
      title: "CT for Aortic Disease and Calcium Scoring",
      html: "<p>CT angiography is the definitive test for acute aortic syndromes and chronic aortic aneurysms. In the cardiac surgery context, two applications are particularly important: aortic dissection classification and calcium scoring.</p><p><b>Stanford Classification of Aortic Dissection:</b></p><ul><li><b>Type A:</b> Involves the ascending aorta, regardless of where the tear originated. This is a <b>surgical emergency</b> — can propagate retrograde to involve coronary ostia (MI), aortic valve (AR), or pericardium (tamponade). Immediate OR.</li><li><b>Type B:</b> Involves only the descending aorta (distal to left subclavian artery). Managed medically with anti-impulse therapy (IV beta-blockers to reduce HR and dP/dt) unless complicated by malperfusion, rupture, or rapid expansion.</li></ul><p><b>CT Calcium Scoring applications in cardiac surgery:</b></p><ul><li>Aortic valve calcium score: &gt;2000 AU (men) or &gt;1200 AU (women) = truly severe AS regardless of gradient</li><li>Coronary calcium score (CAC): risk stratification for asymptomatic patients; CAC = 0 has excellent prognosis</li><li>Pre-redo sternotomy: assess proximity of cardiac structures (RV, aorta) to posterior sternum — critical safety information before repeat sternotomy</li></ul><div class='kbox mnemonic'><div class='kbox-tag'>MNEMONIC</div><b>Stanford: A before B, and A = the OR.</b> Type <b>A</b> involves the <b>A</b>scending aorta → the surgeon's <b>A</b>xe (emergency surgery), because it can strangle the coronaries, wreck the aortic valve, or fill the pericardium. Type <b>B</b> <b>B</b>egins <b>B</b>eyond the left subclavian → <b>B</b>eta-blockers (medical anti-impulse therapy), unless it becomes complicated.</div><p>Behind these classifications is the reason CT owns aortic disease: it detects dissection and intramural haematoma with a sensitivity and specificity approaching <b>100%</b>, and ECG-gating now gives motion-free views of the <b>ascending aorta and root</b> &mdash; showing how far a Type A flap extends toward the coronary ostia and valve, which is precisely the information that shapes the repair. It measures the true <em>short-axis</em> diameter for aneurysm thresholds, separates a smooth crescentic <b>intramural haematoma</b> from a crater-like <b>penetrating ulcer</b>, and traces true and false lumens into the branch vessels &mdash; where loss of contrast enhancement in a kidney or the bowel flags malperfusion.</p><p>One under-appreciated role is a <b>non-contrast</b> scan purely for <b>calcium mapping</b> of the ascending aorta. A porcelain or heavily calcified segment is a stroke waiting to happen: cross-clamping or cannulating through it showers atheroemboli, so CT findings routinely move the clamp site, redirect the arterial cannula, or convert the plan to a &ldquo;no-touch&rdquo; or hypothermic-arrest strategy &mdash; a preoperative decision echo cannot make.</p>"
    },
    {
      type: "checkpoint",
      q: "A patient presents with sudden severe tearing chest pain radiating to the back. CT shows an intimal tear in the ascending aorta extending to the aortic arch. What is the Stanford classification and immediate management?",
      options: [
        "Stanford Type B — ICU anti-impulse therapy",
        "Stanford Type B — urgent TEVAR",
        "Stanford Type A — emergency surgical repair",
        "Stanford Type A — delayed medical stabilization"
      ],
      answer: 2,
      explain: "The ascending aorta is involved — this is Stanford Type A by definition (regardless of where the tear originated). Type A dissection is a surgical emergency. It can propagate retrograde to occlude coronary ostia (MI), involve the aortic valve (acute AR), or extend into the pericardium (tamponade) — any of which are immediately life-threatening. Medical management is only a brief bridge to the operating room."
    },
    {
      title: "Cardiac MRI: Viability and Tissue Characterization",
      html: "<p>Cardiac MRI is the modality that can tell you what the muscle is actually <em>made of</em> — not just how it moves, but whether it is living muscle, scar, swollen, or infiltrated. That tissue-level view answers the single question that decides whether surgery will help a weak heart: is this dysfunctional wall <b>dead scar or sleeping-but-salvageable muscle?</b> Grafting a territory of pure scar buys nothing; feeding hibernating muscle brings it back. CMR is how you tell them apart.</p><p><b>Late gadolinium enhancement (LGE)</b> is the trick that makes scar light up. Gadolinium is an inert contrast agent that washes quickly out of healthy muscle but gets stuck in the expanded spaces of dead, membrane-broken tissue — so on a delayed scan, <em>scar glows bright and living muscle stays dark</em>. Read it like a depth gauge:</p><ul><li>Gadolinium accumulates in areas of myocardial fibrosis or scar (damaged cells lose membrane integrity and retain more contrast)</li><li>Gold standard for myocardial viability: non-enhancing = viable (will recover after revascularization); transmural enhancement = scar (will not recover)</li><li>Key concept for CABG planning: patients with &gt;50% transmural LGE in a territory are unlikely to benefit from bypass of that territory</li></ul><p><b>Other CMR applications:</b></p><ul><li>Myocarditis: diffuse LGE in non-ischemic distribution + myocardial edema (T2 signal)</li><li>HCM, ARVC, cardiac amyloid: characteristic enhancement and tissue patterns</li><li>Accurate EF and volumes in patients with poor echo windows</li><li>Valvular regurgitation quantification by phase-contrast MRI</li></ul><p>A few practical anchors keep CMR in its lane. It is the <b>reference standard for ventricular volumes, mass, and ejection fraction</b> &mdash; not load-dependent and not reliant on a good acoustic window &mdash; which is why it settles the case when echo images are poor or the numbers do not add up. Its classic limitation is the mirror image of CT's strength: a <b>pacemaker or ICD</b> has traditionally been the contraindication that sends the patient to CT instead, and gadolinium is used cautiously in advanced renal failure. CMR is also relatively <b>insensitive to calcium</b>, so in suspected constrictive pericarditis it shows the thickened, tethered pericardium and abnormal septal motion but defers to CT for confirming calcification.</p><p>Read the transmural <em>depth</em> of late enhancement as a probability, not a switch: a territory with little or no LGE recovers reliably after revascularisation, one with 1&ndash;50% transmural scar is intermediate, and &gt;50% transmural enhancement predicts little functional gain from grafting that wall. That gradient is what lets CMR arbitrate the hardest CABG question &mdash; whether a weak, akinetic segment is worth a graft at all.</p>"
    },
    {
      title: "Chest Radiography in Cardiac Surgery",
      html: "<p>The chest X-ray (CXR) remains the first-line imaging tool at the bedside. In the cardiac surgery context, it provides rapid information about cardiac size, pulmonary vascularity, and post-procedural complications. Systematic interpretation prevents missed findings.</p><p><b>Key CXR findings in cardiac disease:</b></p><ul><li><b>Cardiomegaly:</b> Cardiothoracic ratio &gt;0.5 on PA view — suggests LV dilation (volume overload), pericardial effusion, or RV enlargement</li><li><b>Pulmonary venous congestion:</b> Cephalization of vessels, perihilar haziness, Kerley B lines, pleural effusions — elevated left heart filling pressures</li><li><b>Pulmonary arterial enlargement:</b> Prominent central pulmonary arteries with peripheral pruning — pulmonary arterial hypertension</li><li><b>Double density sign:</b> LA enlargement projecting on the right cardiac border (MS, MR)</li><li><b>Boot-shaped heart:</b> Small LA, upturned apex — tetralogy of Fallot</li></ul><div class='kbox study'><div class='kbox-tag'>STUDY</div>Post-CABG/valve surgery CXR checklist: mediastinal width (mediastinal hematoma if widening), pneumothorax, hemothorax, position of sternal wires, pacemaker leads, drains, ET tube, NG tube, and central lines. Bilateral pleural effusions are common postoperatively and usually not alarming.</div><p>Before naming any finding, run the technical checks, because a rotated or under-inspired film manufactures false disease: confirm <b>rotation</b> (clavicular heads equidistant from the spinous processes), <b>inspiration</b> (8&ndash;10 posterior ribs visible), <b>penetration</b> (vertebrae faintly seen behind the heart), and whether it is a <b>PA or AP</b> film &mdash; a portable AP magnifies the cardiac silhouette and invalidates the cardiothoracic ratio. Only then read the silhouette, the lungs, and the bones in a fixed order.</p><p>Pulmonary venous congestion progresses in a legible sequence as left-atrial pressure climbs: first <b>redistribution</b> (upper-lobe vessels enlarge), then <b>interstitial oedema</b> (peribronchial cuffing and Kerley B lines), then <b>alveolar oedema</b> (perihilar bat-wing haze and effusions). And the film screens for catastrophe: the constellation of a <b>widened mediastinum</b> with a hemothorax, pulmonary contusion, or left scapular fracture after blunt trauma raises <b>traumatic aortic injury</b> and mandates CT angiography &mdash; the CXR raises the question, CT answers it. Postoperatively the same widening flags a mediastinal haematoma and possible tamponade, which is why every post-op film is read for mediastinal width alongside line and tube position.</p>"
    },
    {
      type: "checkpoint",
      q: "Which imaging modality is the GOLD STANDARD for annular sizing in pre-TAVR planning?",
      options: [
        "Transthoracic echocardiography",
        "Cardiac CT",
        "Transesophageal echocardiography",
        "Cardiac MRI"
      ],
      answer: 1,
      explain: "Cardiac CT is the gold standard for TAVR annular sizing because it provides precise three-dimensional measurements of the aortic annulus perimeter and area, allowing accurate selection of prosthesis size. Echo underestimates annular dimensions because it captures only one dimension (diameter) rather than the full elliptical annulus. CT also provides coronary height assessment, LVOT anatomy, and access vessel planning — all essential for TAVR planning."
    },
    {
      title: "Integrating Imaging Modalities: The Cardiac Surgeon's Approach",
      html: "<p>No single imaging modality answers every clinical question. The cardiac surgeon integrates multiple modalities sequentially, each addressing what the previous one could not. Understanding the workflow prevents redundant testing and ensures critical information is not missed.</p><p><b>Standard preoperative imaging workflow for valve surgery:</b></p><ol><li><b>TTE:</b> First-line assessment of valve morphology, severity, LV function, and chamber sizes</li><li><b>TEE:</b> Superior resolution for posterior structures (mitral valve, LA, LA appendage); mandatory before cardioversion and PMBC</li><li><b>Coronary angiography:</b> Mandatory before valve surgery in men &gt;40 or women &gt;50 (or with risk factors) to exclude concomitant CAD</li><li><b>CT:</b> When TAVR is planned (annular sizing), when aortic dimensions need precise assessment, or before redo sternotomy</li><li><b>MRI:</b> When echo windows are poor, for viability assessment before high-risk revascularization, or for tissue characterization questions</li></ol><div class='kbox pearl'><div class='kbox-tag'>PEARL</div>In valve surgery, coronary angiography is performed preoperatively even if the patient has no symptoms of CAD — significant unsuspected CAD discovered intraoperatively cannot be grafted without added risk. Combining valve surgery and CABG in a single planned operation has lower mortality than either emergency grafting or a second planned operation.</div><p>The unifying principle is that each test is chosen to answer what the last one <em>could not</em>, and to be <b>cross-checked, not blindly trusted</b>. Echo owns real-time function and physiology; CT owns anatomy, calcium and access; MRI owns tissue characterisation and viability; angiography owns the coronary road map and pressure-wire physiology; the CXR owns the bedside screen. When two disagree, that discordance is itself the finding &mdash; a low-gradient aortic valve gets a dobutamine echo (contractile reserve) or a CT calcium score to declare it truly severe, and an ambiguous coronary lesion gets an FFR wire.</p><p>The workflow is also shifting. In patients with a <em>low</em> pre-test probability of coronary disease &mdash; the classic example being isolated repair of a degenerative mitral valve &mdash; a high negative-predictive-value <b>coronary CT angiogram can exclude significant CAD and spare an arterial puncture</b>, reserving invasive angiography for those likely to need catheter-based treatment. And every reoperation earns a preoperative gated CT: knowing whether a patent LIMA or the right ventricle is adherent to the back of the sternum changes roughly one in five redo plans &mdash; sometimes to instituting bypass <em>before</em> re-entry &mdash; because injuring a patent LIMA to the LAD carries a mortality near 50%.</p>"
    },
    {
      type: "checkpoint",
      q: "A 62-year-old postmenopausal woman with severe aortic stenosis is being evaluated for valve replacement. How should her coronary anatomy be assessed before the Heart Team finalizes the intervention?",
      options: [
        "CCTA if CAD likelihood is at most 50%; otherwise invasive angiography",
        "Skip coronary assessment unless she reports angina",
        "Use PET perfusion as the mandatory first test",
        "Defer all coronary assessment until after valve replacement"
      ],
      answer: 0,
      explain: "Coronary disease should be assessed before valve intervention because it can change the procedure and revascularization plan. Current valve guidance supports CCTA to exclude relevant CAD when pre-test likelihood is low or moderate (at most 50%); invasive angiography is used when likelihood is higher, CCTA is unsuitable or nondiagnostic, or invasive definition is otherwise needed. Age alone does not make invasive angiography the only acceptable study."
    }
  ]
};

/* ==== Senior (L4) and Mastery (L5) layers merged into the existing Day-5 (Imaging) lessons ==== */

window.LESSONS["d4-echo"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the intraoperative TEE as a structured checklist",
    html: `<p>The intraoperative TEE is a checklist run at two moments, and knowing <b>what each view is for</b> is the difference between watching and reading. The workhorse mid-oesophageal views (four-chamber, long-axis, aortic-valve short-axis, bicaval) show chamber function and valve anatomy; the <b>transgastric and deep-transgastric</b> views exist to <b>align Doppler with the aortic outflow</b> so the AS gradient can actually be measured.</p>
<p><b>Pre-bypass:</b> establish the baseline — ventricular function, the valve mechanism you are about to address, and any finding that changes the plan. <b>Post-bypass, before the chest closes:</b></p>
<ul>
  <li>Ventricular function off pump — and the RV specifically (TAPSE, tissue-Doppler S′).</li>
  <li>The repair/replacement result — residual regurgitation, gradient, leaflet motion.</li>
  <li>Completeness of <b>de-airing</b> (air collects in the anterosuperior structures — watch the RCA territory).</li>
  <li>Any <b>new regional wall-motion abnormality</b> (territory tells you the vessel: inferior→RCA air/graft, lateral→circumflex, anterior→LAD/LIMA).</li>
  <li><b>Paravalvular leak</b>, and <b>systolic anterior motion (SAM)</b> after mitral repair.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Pick the view for the question: a low AS gradient may simply be a malaligned Doppler beam — go to the deep transgastric view before you call the valve less severe than it is.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the post-bypass finding that sends you back on pump",
    html: `<p><b>Viva summit:</b> <i>"Post-mitral-repair TEE shows a 40 mmHg LVOT gradient and the anterior leaflet drifting into the outflow tract in systole — what is it, what caused it, what do you try medically first, and what do you do surgically before you leave the room?"</i></p>
<p><b>What it is:</b> systolic anterior motion (SAM) causing dynamic LVOT obstruction — usually a repair that left too much anterior-leaflet tissue or moved the coaptation point too far anteriorly (a tall posterior leaflet, an undersized ring).</p>
<p><b>Medical first</b> (it is load-dependent): give <b>volume</b>, raise <b>afterload</b>, <b>stop inotropes</b>, and <b>slow the rate</b> — this often abolishes the gradient. <b>Surgical if it persists:</b> go <b>back on pump</b> and correct the geometry with a <b>sliding leaflet plasty</b> (shorten the posterior leaflet) or a <b>larger ring</b> to move coaptation posteriorly.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE OTHER TWO RE-PUMP FINDINGS</div>
  <p><b>Significant residual MR</b> after repair and a <b>malseated or paravalvular-leaking prosthesis</b> also mandate returning to bypass before closing. Defending the re-pump to a team that wants to close is the senior act — a suboptimal result is far cheaper to fix now than after the chest is closed.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "After mitral repair the TEE shows SAM with a 40 mmHg LVOT gradient. What is the correct first response?",
    options: [
      "Immediately go back on bypass and replace the valve",
      "Start an inotrope to improve cardiac output",
      "Accept it and close, since SAM always resolves on its own",
      "Volume, afterload support, less inotropy, and rate control"
    ],
    answer: 3,
    explain: "SAM-mediated LVOT obstruction is dynamic and load-dependent, so volume, higher afterload, stopping inotropes, and a slower rate often abolish the gradient. If it persists, return to bypass for a sliding leaflet plasty or a larger ring. An inotrope worsens it, and closing over a significant gradient is unsafe."
  }
);

window.LESSONS["d4-cath"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: describing a lesion completely, and grading the ambiguous one",
    html: `<p>A complete description of a coronary lesion is <b>segment, % diameter stenosis, length, calcification, and TIMI flow</b>, read in the angiographic view that <b>opens</b> that vessel (e.g., the LAO-cranial for the LAD/diagonals, the RAO-caudal for the circumflex, the spider view for the left-main bifurcation) — because <b>foreshortening</b> makes an eyeballed percentage unreliable.</p>
<p>For the intermediate or ambiguous lesion, anatomy alone is not enough:</p>
<ul>
  <li><b>FFR ≤ 0.80 / iFR ≤ 0.89</b> grades physiologic significance of a 40–70% lesion.</li>
  <li><b>IVUS</b> measures the true lumen area and plaque burden when angiography is uncertain — the classic use is the <b>ambiguous left main</b>, where a minimal lumen area around <b>6 mm²</b> is a common significance threshold. <!-- VERIFY: IVUS left-main MLA ~6 mm2 significance threshold --></li>
</ul>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: don't commit on a foreshortened left main, and drive discordance to a test",
    html: `<p><b>Viva-grade judgment:</b> the highest-stakes eyeball error is the left main, where over-calling sends a patient to unnecessary surgery and under-calling misses a prognosis-changing lesion. When an angiogram suggests a 45–55% left-main stenosis and foreshortening makes it uncertain, the senior <b>does not decide</b> — they get an <b>objective measure (IVUS lumen area, or FFR/iFR in suitable anatomy)</b> before committing to CABG or PCI.</p>
<p>The same discipline applies to a discordant valve study: a small AVA with a low gradient is a <b>prompt for the next test</b>, not a diagnosis — a <b>dobutamine echo</b> separates true-severe from pseudo-severe, and a <b>CT aortic-valve calcium score</b> adjudicates severity independent of flow.</p>
<div class="kbox danger">
  <div class="kbox-tag">WHEN NOT TO DECIDE</div>
  <p>A foreshortened, ambiguous left main and a single discordant echo number are both moments to <b>get the objective measure first</b>. The senior names the discordance, names the resolving study, and says what they would do with each result — rather than committing on an eyeball.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "An angiogram suggests a 45–55% left-main stenosis but foreshortening makes it uncertain, and the patient is being considered for revascularisation. What is the correct next step before committing?",
    options: [
      "Proceed to CABG on the basis of the angiographic estimate",
      "Repeat the chest radiograph after nitroglycerin",
      "Left-main IVUS, with physiology when suitable",
      "Defer all evaluation and manage medically indefinitely"
    ],
    answer: 2,
    explain: "The stakes of over- or under-treating the left main are too high for an eyeballed, foreshortened estimate. IVUS directly measures the lumen area and plaque burden (a minimal lumen area around 6 mm² is a common threshold), and physiology can help in suitable anatomy. Get the objective measure before committing."
  }
);

window.LESSONS["d4-cath"].chunks.push({
  title: "Continue in the angiography reading room",
  html: `<p>The core lesson gives you the language. The <b>Coronary Angiography Intensive</b> now makes you use it on the source angiograms: identify the projection, trace every branch, grade the lesion and flow, then state what the surgeon needs to know about the distal target.</p>
  <div class="kbox study"><div class="kbox-tag">IMAGE LAB</div><p>The module contains a projection atlas, staged raw-image reveals, pathology and variant cases, physiology adjudication, a structured report builder and a cumulative assessment.</p></div>
  <p><a class="btn" href="#/angiography">Open the coronary angiography intensive →</a></p>`
});

window.LESSONS["d4-ct"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the measurement-error catalog every number carries",
    html: `<p>Numbers off an image are only as good as the geometry and alignment behind them. The senior keeps a catalog of how each misleads:</p>
<ul>
  <li><b>Continuity-equation AVA:</b> the LVOT diameter is <b>squared</b>, so a small measurement error is magnified — the single largest error term.</li>
  <li><b>Doppler malalignment</b> underestimates a gradient when the beam is off-axis.</li>
  <li><b>Pressure recovery</b> overestimates the true gradient in the small aorta.</li>
  <li><b>PISA</b> assumes a hemispheric geometry that fails with eccentric or multiple jets.</li>
  <li><b>Low-flow states</b> lower every gradient across a genuinely severe valve.</li>
  <li><b>CT motion artifact</b> and <b>angiographic foreshortening</b> distort dimensions and severity.</li>
</ul>
<p>Reading the failing post-op heart has its own traps: a <b>localized posterior clot</b> can tamponade a chamber while the transthoracic echo looks unimpressive (assess the RV directly and by TAPSE/S′), and LVOT obstruction from SAM after mitral repair can masquerade as pump failure.</p>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: adjudicating the discordant valve with the calcium score",
    html: `<p><b>Viva-grade move.</b> The discordant AS study — AVA ≤ 1.0 cm² with a mean gradient under 40 mmHg — is where the senior drives imaging to a decision. The gradient falls with low flow (low EF, or a small hypertrophied cavity), so:</p>
<ul>
  <li>A <b>dobutamine echo</b> separates true-severe (gradient rises, AVA stays ≤ 1.0) from pseudo-severe (AVA opens past 1.0).</li>
  <li>A <b>CT aortic-valve calcium score</b> adjudicates severity <b>independent of flow</b> — a high score (roughly &gt; 2000 AU in men, &gt; 1200 AU in women) supports truly severe AS. <!-- VERIFY: AV calcium-score thresholds ~2000 AU men / ~1200 AU women for severe AS --></li>
</ul>
<p>And the senior states the <b>honest limit</b>: a static image at one flow state cannot settle a flow-dependent question — which is exactly why the decision rests on the <i>integration</i> of the dimensionless index, the calcium score, the dobutamine response, and the clinical picture, not on any single number.</p>`
  },
  {
    type: "checkpoint",
    q: "A patient has AVA 0.9 cm² but a mean gradient of only 30 mmHg with preserved EF and a small, hypertrophied LV. Which test best adjudicates severity independent of flow?",
    options: [
      "Repeat the resting echo in 3 months",
      "Coronary angiography",
      "CT aortic-valve calcium scoring",
      "A treadmill exercise test"
    ],
    answer: 2,
    explain: "This is paradoxical low-flow/low-gradient AS. A CT aortic-valve calcium score grades severity independent of flow (roughly >2000 AU in men, >1200 AU in women supports severe AS), complementing the dimensionless index and a dobutamine study. A static resting echo repeat does not resolve the flow-dependence."
  }
);
