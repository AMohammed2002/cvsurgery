window.LESSONS = window.LESSONS || {};

window.LESSONS["d5-risk"] = {
  id: "d5-risk",
  day: 6,
  ord: 1,
  title: "Risk Stratification: STS & EuroSCORE",
  short: "STS/Euro",
  minutes: 15,
  chunks: [
    {
      title: "Why Risk Stratification Matters",
      html: "<p>Before a big operation, everyone in the room is really asking one question — <em>what are the odds this goes well?</em> A risk score is the attempt to answer it with data instead of gut feeling. Think of it as an <b>actuary's table for the operating room</b>: feed in a patient's clinical profile and it returns a predicted probability of death or major complication, drawn from what happened to thousands of similar patients before. That number is the mathematical backbone of an honest consent conversation and of the Heart Team's decision to operate, stent, or stand down.</p><p>Two tables dominate practice, and they are essentially the same idea calibrated on two different populations: the <b>STS Predicted Risk Score</b> (built on a huge North American registry) and <b>EuroSCORE II</b> (a European multinational dataset). Knowing both — and, just as importantly, knowing what neither can see — is core literacy for the whole team.</p><p>The idea sits inside a bigger quality framework. In the 1960s Donabedian proposed judging care in three domains &mdash; <b>structure</b> (is the right ICU, case volume, and database in place?), <b>process</b> (were the evidence-based steps done — internal mammary use, antiplatelet at discharge?), and <b>outcome</b> (mortality, stroke, renal failure, mediastinitis?) &mdash; and defined quality itself as the <em>improvement in a patient's status after accounting for their severity of illness and comorbidity</em>. A raw mortality rate is uninterpretable without that adjustment: a surgeon who operates on sicker patients looks worse until the numbers are <b>risk-adjusted</b>. That adjustment is exactly what a risk model performs &mdash; it is the statistical machinery that lets you compare a 3% death rate in frail redo valves against a 1% rate in young elective CABG and say which is actually the better care.</p><p>One caveat belongs up front, because it shapes how the team should use the number: <b>safety is only half the decision.</b> A procedure that can be done safely but offers the patient little benefit is, in the textbook's own words, poor treatment. So the score answers &ldquo;how likely is this to go wrong?&rdquo; but the Heart Team must also ask &ldquo;and how much will it actually help?&rdquo; &mdash; a question increasingly answered with patient-reported outcomes and quality-of-life data, not mortality alone.</p>"
    },
    {
      title: "STS Predicted Risk Score",
      html: "<p>The STS score's great strength is that it does not hand you one blunt number — it breaks the risk apart into its separate pieces. Built on the STS National Database (the largest cardiac-surgery registry in the world, millions of operations deep), it reports a <em>separate</em> predicted probability for each of the ways an operation can go wrong, so you can counsel a patient on the specific hazard they care about rather than a single lumped figure:</p><ul><li><b>Operative mortality</b></li><li><b>Major morbidity or mortality</b> (composite endpoint)</li><li><b>Prolonged ventilation</b></li><li><b>Renal failure</b></li><li><b>Stroke</b></li><li><b>Deep sternal wound infection</b></li><li><b>Reoperation for bleeding</b></li></ul><p>Key input variables include age, sex, BMI, ejection fraction, creatinine, prior cardiac surgery (redo status), urgency (elective/urgent/emergent), procedure type, and comorbidities such as diabetes, hypertension, COPD, peripheral vascular disease, prior stroke, dialysis dependence, and endocarditis.</p><p>The scale behind it is worth appreciating: the STS published <b>27 risk models</b> covering <b>nine endpoints across three procedure groups</b> &mdash; isolated CABG, isolated valve, and valve+CABG &mdash; originally scored with a Bayesian algorithm and now with logistic and hierarchical regression on a registry millions of operations deep. The benchmarks are concrete: in the STS database, 30-day mortality runs about <b>2.3% for isolated CABG, 3.2% for AVR, 5.7% for MV replacement, and 1.6% for MV repair</b>, with combined <b>CABG+valve highest at ~6.8%</b> (MVR+CABG ~11.6%). The composite &ldquo;mortality or major morbidity&rdquo; endpoint is roughly 14% for CABG and 18&ndash;30% for valve and combined cases.</p><p>Because these models also drive public reporting, the STS composite is the National Quality Forum&ndash;endorsed quality metric, built from <b>six risk-adjusted outcome measures</b> (mortality, stroke, renal failure, prolonged ventilation, deep sternal wound infection, reoperation) plus <b>five process measures</b> (including internal mammary artery use and antiplatelet/statin/beta-blocker at discharge). One honest limit on the number: an institution should trust the STS-PROM to predict its <em>own</em> results only if its observed/expected ratio sits within one standard deviation of the STS average &mdash; the calculator describes the average program, not necessarily yours.</p>"
    },
    {
      type: "checkpoint",
      q: "How should an STS-PROM estimate of 4.5% be used when choosing a cardiac intervention?",
      options: [
        "Integrate it with anatomy, frailty, life expectancy, and patient goals",
        "As an automatic indication for transcatheter treatment",
        "As proof that surgery is contraindicated",
        "As a replacement for procedure-specific clinical judgment"
      ],
      answer: 0,
      explain: "STS-PROM is a population-level, procedure-specific estimate, not a stand-alone treatment rule. Historical trial strata used overlapping thresholds, so a value such as 4.5% should be integrated with anatomy, frailty, comorbidity, life expectancy, technical feasibility, institutional outcomes, and the patient's goals in Heart Team decision-making."
    },
    {
      title: "EuroSCORE II",
      html: "<p>EuroSCORE II was developed in Europe from a multinational dataset and predicts 30-day in-hospital mortality. It replaced the older additive and logistic EuroSCORE, which was known to overestimate risk in high-risk patients, leading to over-caution in cases that were actually manageable.</p><p>The variable set is similar to the STS score but uses different statistical weighting, reflecting European patient demographics and practice patterns. EuroSCORE II is used widely in Europe and in international publications but is less commonly the primary tool in North American practice, where STS dominates.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div><p>When reading European valve trials (e.g., PARTNER 2, SURTAVI), risk stratification is often reported using EuroSCORE II. When reading American trials or guidelines, STS is the standard. Know both to interpret the literature accurately.</p></div><p>Under the hood, EuroSCORE assembles <b>17 risk factors</b> (patient, cardiac, and operative) and has evolved through three versions worth distinguishing. The original <b>additive</b> model summed points and had a characteristic flaw &mdash; it <em>overestimated</em> mortality in low-risk patients and <em>underestimated</em> it in high-risk ones. The <b>logistic</b> model fixed the additivity but still tended to over-predict across many groups (its strength was combined CABG+valve). <b>EuroSCORE II</b> is the recalibrated current version, tuned to modern, lower mortality. The old logistic EuroSCORE I is the cautionary tale: it over-predicted so badly (often 2&ndash;3&times; observed) that it drove inappropriate turn-downs of operable patients.</p><p>A practical difference from STS: EuroSCORE reports <b>mortality only</b> (30-day and in-hospital), whereas STS returns a menu of morbidity endpoints alongside death. Since the two are derived on different populations and weighted differently, running <em>both</em> is deliberate &mdash; concordance is reassuring, and a wide divergence is a flag to look harder at what one model is missing.</p><p>The two also weight different variables, which is part of why they can diverge. Both count age, sex, LV function, renal and lung disease, peripheral vascular disease, prior cardiac surgery, and urgency. But <b>STS</b> uniquely captures race, body-surface area, and diabetes; <b>EuroSCORE</b> uniquely weights <b>preoperative IABP or inotrope dependence</b> and active endocarditis. STS also demands considerably more data entry for its richer output &mdash; the trade-off for reporting a menu of morbidity endpoints rather than mortality alone.</p>"
    },
    {
      title: "Limitations of Risk Models",
      html: "<p>Both STS and EuroSCORE II are population-level prediction tools calibrated on large databases. They produce a group-level probability, not a guarantee for any individual patient. Recognizing their structural blind spots is as important as knowing how to use them.</p><ul><li>Neither model captures <b>frailty</b> well—a frail patient with an STS of 2% may do far worse than predicted</li><li>They do not account for technical surgical factors: hostile mediastinum from prior surgery or radiation, a calcified or porcelain aorta, or a heavily calcified LVOT</li><li>They may underperform in very elderly patients (> 85 years) or in extremely complex reoperations where experience and institutional factors matter more than variables in the model</li></ul><div class='kbox danger'><div class='kbox-tag'>DANGER</div><p>Never quote a risk score to a patient without contextualizing it. A predicted mortality of 3% means 97 out of 100 similar patients survive—but frailty, anatomy, and the specific surgeon's experience can shift the actual risk dramatically.</p></div><p>The deepest limitation is structural: these models are built from <b>retrospective, observational registry data</b>, where patients were not randomised to their treatment. That embeds <b>selection bias</b> &mdash; a clinician chose this operation for this patient for reasons the database never recorded &mdash; and it is why a model can predict the <em>average</em> outcome of a thousand similar patients yet be wrong for the one in front of you. Adding ever more variables barely helps: the Toronto model uses just <b>five predictors</b> and performs about as well as the STS model's many, because most of the predictive power lives in a handful of factors. Risk factors also drift over time, so a model can quietly fall out of calibration.</p><p>Two blind spots matter most at the bedside. First, <b>procedure-specific impediments</b> the score has no variable for &mdash; a porcelain ascending aorta, a patent arterial graft adherent to the posterior sternum, prior mediastinal radiation, a tracheostomy. Second, <b>frailty</b>. And a subtler warning for anyone reading &ldquo;outcomes&rdquo; report cards: simulations show that even with good risk adjustment, sensitivity for detecting a genuinely poor provider is under 20% and the false-outlier rate exceeds 50% &mdash; much of the spread between &ldquo;good&rdquo; and &ldquo;bad&rdquo; programs is random variation, not quality.</p>"
    },
    {
      type: "checkpoint",
      q: "Which of the following is a known limitation of both STS and EuroSCORE II models?",
      options: [
        "Frailty and technical complexity are underrepresented",
        "They are not validated in any patient population",
        "They fail to predict stroke outcomes",
        "They cannot be used for valvular surgery"
      ],
      answer: 0,
      explain: "Both STS and EuroSCORE II are population-level models that do not capture frailty, technical factors such as hostile mediastinum or calcified aorta, or individual surgical expertise. These are their most clinically significant limitations, particularly for borderline-risk patients where these unmeasured factors may dominate the actual risk."
    },
    {
      title: "Applying Risk Scores in Clinical Practice",
      html: "<p>Risk scores are most powerful when used as a structured input to Heart Team discussion, not as a standalone decision-making tool. The STS score guides the initial classification—low, intermediate, or high risk—and feeds directly into guideline-based treatment selection, particularly for aortic stenosis management.</p><p>For aortic stenosis, the traditional threshold of STS ≥ 8% defined surgical high risk and was the entry criterion for the PARTNER 1 trial that established TAVR. Subsequent trials (PARTNER 2, SURTAVI) validated TAVR in intermediate-risk patients (STS 4–8%). PARTNER 3 extended TAVR to low-risk patients (STS &lt; 4%). Today, TAVR is FDA-approved across all risk strata, and the STS score is one input among many in the TAVR-vs-SAVR decision.</p><div class='kbox study'><div class='kbox-tag'>STUDY</div><p>Risk threshold summary: STS &lt; 1% = low; 1–3% = intermediate; &gt; 3% = high. For TAVR, traditional high-risk threshold was STS ≥ 8%; intermediate is 3–8%; low is &lt; 4% (note slight overlap by trial definition).</p></div><p>Guidelines turn the score into a four-tier gate, and the logic of the gate is worth learning: a patient is <b>low risk only if they meet ALL</b> the low-risk criteria, but <b>intermediate, high, or prohibitive if they meet ANY ONE</b> criterion in that column. The columns combine four inputs, not just the number: <b>STS-PROM</b> (&lt;4% / 4&ndash;8% / &gt;8%), <b>frailty</b> (none / one index / two or more), <b>major organ-system compromise not correctable by surgery</b> (none / one / no more than two / three or more), and <b>procedure-specific impediments</b> (none through severe). <b>Prohibitive risk</b> is defined as a predicted risk of death or major morbidity exceeding <b>50% at one year</b> &mdash; the zone where the honest recommendation may be no operation.</p><p>This is also why the score never travels alone. The Heart Team that weighs it is a <b>Class I</b> recommendation in the valve guidelines and is <em>required for TAVR reimbursement</em> in the United States &mdash; the health system has encoded the principle that a single percentage must be integrated with frailty, anatomy, and the patient's goals through shared decision-making before anyone commits to a valve.</p>"
    }
  ]
};

window.LESSONS["d5-optimize"] = {
  id: "d5-optimize",
  day: 6,
  ord: 2,
  title: "Preoperative Optimization",
  short: "PreopOpt",
  minutes: 18,
  chunks: [
    {
      title: "The Goal of Preoperative Optimization",
      html: "<p>Preoperative optimization means modifying reversible risk factors before surgery to reduce operative morbidity and mortality. This includes antiplatelet and anticoagulation management, correction of metabolic derangements, cardiopulmonary optimization, and addressing infections that could seed a new prosthesis. Good preoperative optimization is as surgically important as the operation itself.</p><p>Think of optimization as working a <b>ledger of reversible risk</b> in the window before an elective case &mdash; every lever pulled is measurable risk removed. The high-yield entries:</p><ul><li><b>Anaemia</b> &mdash; iron studies and IV iron repletion; both preoperative anaemia and the transfusion used to treat it independently worsen outcome, so building red-cell mass beforehand is protective.</li><li><b>Glycaemic control</b> &mdash; strict perioperative glucose control lowers operative mortality and the rate of mediastinitis, and an elevated HbA1c predicts deep sternal wound infection &mdash; a risk magnified when both internal mammary arteries are harvested.</li><li><b>Pulmonary preparation</b> &mdash; smoking cessation, treating COPD flares with bronchodilators and steroids, and <b>intensive inspiratory-muscle training</b>, which is shown to prevent postoperative pulmonary complications in high-risk patients.</li><li><b>Antithrombotic timing</b> &mdash; reconcile each agent's washout against stent age and indication (below).</li><li><b>Source control</b> &mdash; carotid work-up in the symptomatic, and <b>dental clearance before any valve implant</b> to remove an oral bacteraemic source that could seed the prosthesis.</li></ul><p>The governing rule is logistical: the whole pre-pump workup &mdash; echo, angiography, carotids where indicated, dental, and cross-sectional imaging for redo or aortic disease &mdash; must be <b>complete before the day of surgery</b>, not discovered on the table.</p><div class='kbox pearl'><div class='kbox-tag'>PEARL</div><p>Optimization changes the <em>category</em>, not just the number. A patient whose anaemia, glycaemia, and pulmonary status are corrected, and whose stent-DAPT window has cleared, can move from &ldquo;high&rdquo; toward &ldquo;intermediate&rdquo; risk &mdash; sometimes the difference between being offered an operation and being turned down. The corollary: an <em>irreversible</em> impediment (porcelain aorta, fixed pulmonary hypertension, advanced frailty) is the one the clinic visit cannot fix, and it should redirect the plan early rather than be met on the day of surgery.</p></div>"
    },
    {
      title: "Aspirin and P2Y12 Inhibitors",
      html: "<p>Every antiplatelet decision before surgery is a <b>tug-of-war between clot and bleed</b>. Pull too far one way and you leave a fresh coronary stent unprotected and it thromboses; pull too far the other and you open a chest that will not stop oozing. The whole art is timing the release of the rope — holding each drug just long enough for platelet function to recover, but no longer than the ischemic risk allows. The exact wait depends on how each drug binds: an <em>irreversible</em> blocker (aspirin, clopidogrel, prasugrel) poisons the platelet for its whole lifespan, so you must wait for the marrow to make new ones; a <em>reversible</em> one (ticagrelor) simply washes out.</p><p><b>Aspirin:</b> Generally continued through surgery in most cardiac surgical cases. Evidence shows continuing aspirin reduces early graft thrombosis—specifically saphenous vein graft (SVG) occlusion—without a significant increase in bleeding. The ATACAS trial (2016) found no additional benefit from giving aspirin immediately pre-operatively, but the rationale for continuing pre-existing aspirin therapy is strong.</p><ul><li><b>Clopidogrel</b> (irreversible P2Y12 inhibitor): Hold <b>5 days</b> before non-emergency open-heart surgery</li><li><b>Ticagrelor</b> (reversible P2Y12 inhibitor): Hold at least <b>3 days</b> before non-emergency open-heart surgery</li><li><b>Prasugrel</b> (potent irreversible P2Y12 inhibitor): Hold <b>7 days</b> before non-emergency open-heart surgery</li></ul><p>Urgent surgery requires an individualized ischemic-versus-bleeding assessment; platelet-function testing or bridging may be considered in selected high-thrombotic-risk patients.</p><div class='kbox mnemonic'><div class='kbox-tag'>MNEMONIC</div><p><b>P-C-T = 7-5-3:</b> Prasugrel 7 days, Clopidogrel 5 days, Ticagrelor 3 days.</p></div><p>The pharmacology explains the schedule. Aspirin <b>acetylates cyclo-oxygenase-1 and -2</b>, shutting down thromboxane-A&sup2; for the platelet's whole life; its own plasma half-life is only ~15&ndash;20 minutes, but the effect lasts until the marrow makes new platelets &mdash; which is why the guideline says it is reasonable to stop aspirin preoperatively <em>only</em> in purely elective patients without an acute coronary syndrome. The P2Y12 agents block the ADP receptor and so prevent GP IIb/IIIa activation; clopidogrel, prasugrel, and ticlopidine bind <b>irreversibly</b> (you wait for new platelets) while ticagrelor is a <b>reversible allosteric</b> antagonist that simply washes out (half-lives ~6&ndash;7 h; ticlopidine ~13 h).</p><p>Two refinements matter in practice. <b>Point-of-care platelet-function testing</b> can identify clopidogrel <em>non-responders</em>, who may safely proceed to surgery without the full waiting period &mdash; the wait is about residual platelet inhibition, not the calendar. And unfractionated <b>heparin is the exception</b> to all of this: it is the one antithrombotic that can be stopped shortly before the case, or not at all.</p>"
    },
    {
      type: "checkpoint",
      q: "A patient on prasugrel for a drug-eluting stent placed 8 months ago needs elective CABG. How many days before surgery should prasugrel be held?",
      options: [
        "3 days",
        "5 days",
        "7 days",
        "10 days"
      ],
      answer: 2,
      explain: "Prasugrel is a potent irreversible P2Y12 inhibitor and is held for 7 days before non-emergency open-heart surgery. The corresponding minimum intervals are 5 days for clopidogrel and 3 days for ticagrelor."
    },
    {
      title: "Anticoagulation Management: Warfarin",
      html: "<p>Warfarin (a vitamin K antagonist) must be stopped before cardiac surgery to allow the INR to normalize. The target is an INR &lt; 1.5 for cardiac surgery, which typically requires holding warfarin for approximately 5 days.</p><p>Whether to bridge with heparin depends on the underlying thrombotic risk. A patient with AF and a low CHA2DS2-VASc score may not need bridging. A patient with a mechanical mitral valve—which carries the highest thrombotic risk of any anticoagulation indication—must be bridged with continuous intravenous unfractionated heparin (IV UFH) while warfarin is held. Heparin can then be stopped 4–6 hours before the case and reversed easily with protamine intraoperatively.</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div><p>Mechanical mitral valve patients require IV UFH bridging. Stopping anticoagulation without bridging in this population risks catastrophic prosthetic valve thrombosis. Resume anticoagulation post-op as soon as bleeding risk allows—INR target 2.5–3.5 for mechanical mitral.</p></div><p>The mechanism sets the timeline. Warfarin blocks hepatic synthesis of the <b>vitamin-K&ndash;dependent factors II, VII, IX and X</b> (and proteins C and S); with a long half-life of ~20&ndash;60 hours and reliance on clearing already-circulating factors, the INR takes roughly <b>5 days</b> to drift below the 1.5 target. Reversal for a truly urgent case is not protamine (that reverses heparin) but <b>vitamin K plus a prothrombin complex concentrate or FFP</b>, which replace the missing factors directly.</p><p>Bridging is a risk-stratified decision, not a reflex. The <b>mechanical mitral valve carries the highest thrombotic risk</b> of any indication and mandates a continuous IV unfractionated-heparin bridge; a bileaflet <b>mechanical aortic</b> valve without other risk factors sits lower and often needs no bridge; and atrial fibrillation is bridged by <b>CHA&sup2;DS&sup2;-VASc</b> &mdash; a low score may need nothing. UFH is chosen for the bridge precisely because it can be stopped 4&ndash;6 hours preoperatively and reversed instantly with protamine on the table. One subtlety when <em>restarting</em>: because proteins C and S fall first, warfarin is transiently <b>procoagulant</b> at initiation, so it is overlapped with heparin until the INR is therapeutic.</p>"
    },
    {
      title: "Anticoagulation Management: DOACs and Heparin",
      html: "<p>Direct oral anticoagulants (DOACs) have more predictable kinetics than warfarin, making their perioperative management more straightforward for most patients—but renal function is critical for dosing the washout period.</p><ul><li><b>Apixaban, rivaroxaban:</b> Hold 48–72 hours before elective surgery in normal renal function</li><li><b>Dabigatran</b> (renally cleared): Normal renal function: hold 48–72 hours; CrCl 30–50: hold 72–96 hours; CrCl &lt; 30: hold 5 days</li><li>No routine bridging is needed for most DOAC indications</li><li><b>Reversal agents:</b> Idarucizumab reverses dabigatran emergently; andexanet alfa reverses factor Xa inhibitors (apixaban, rivaroxaban)</li></ul><p>Systemic UFH is used during CPB at high dose targeting ACT &gt; 400–480 seconds. Reversal after CPB: protamine sulfate at approximately 1 mg per 100 units of heparin administered.</p><p>The washout follows each drug's mechanism and clearance. <b>Dabigatran</b> is a direct thrombin inhibitor (half-life ~12&ndash;17 h) that is <em>renally cleared</em> &mdash; which is why its hold lengthens as creatinine clearance falls, out to ~5 days below 30 mL/min. The <b>factor Xa inhibitors</b> apixaban (~12 h), rivaroxaban (~5&ndash;9 h) and edoxaban (~6&ndash;11 h) block the conversion of prothrombin to thrombin and are less renally dependent, so a 48&ndash;72 h hold suffices in normal renal function. Their predictable kinetics are the reason routine bridging is unnecessary for most DOAC indications.</p><p>Intraoperatively the logic inverts &mdash; heparin is <em>given</em>, not held. UFH works by complexing with <b>antithrombin III and accelerating its thrombin-inactivating action 1000- to 4000-fold</b>; its short (~1.5 h) half-life makes it controllable, and CPB demands an ACT above ~<b>400&ndash;480 seconds</b>. A patient who will not reach target despite large doses may be <b>antithrombin-deficient</b> (true &ldquo;heparin resistance&rdquo;), treated with antithrombin concentrate or plasma. Protamine then neutralises it at ~1 mg per 100 units &mdash; but it is not benign: rapid administration causes hypotension and pulmonary vasoconstriction, and anaphylaxis is a risk in patients with prior exposure, NPH-insulin use, or fish allergy.</p>"
    },
    {
      title: "Heparin-Induced Thrombocytopenia (HIT)",
      html: "<p>HIT is one of medicine's great double-crosses: the blood <em>thinner</em> triggers massive <em>clotting</em>. The immune system makes IgG antibodies against a heparin–PF4 complex, and those antibodies then latch onto and <b>activate</b> platelets — friendly fire that spawns clots everywhere even as the platelet count falls (the platelets are being consumed into thrombi, not bleeding out). So the paradox to hold onto is: <b>low platelets, but the danger is clotting, not bleeding.</b> In cardiac surgery this is especially treacherous, because the one drug CPB cannot do without — high-dose heparin — is the very poison you must now avoid.</p><p>Suspect HIT when platelet count drops more than 50% or falls below 100,000 after heparin exposure. Confirm with: 4T score assessment, PF4 antibody (ELISA), and if high probability, serotonin release assay (SRA—gold standard).</p><div class='kbox danger'><div class='kbox-tag'>DANGER</div><p>Never give platelet transfusions in HIT—platelets are the substrate for the thrombotic process. Switch immediately to a direct thrombin inhibitor: argatroban for most clinical contexts, bivalirudin for CPB (documented use but technically challenging due to its short half-life in the bypass circuit).</p></div><p>Two distinctions keep the diagnosis honest. Benign <b>heparin-associated thrombocytopenia</b> is a nonimmune 5&ndash;15% platelet dip within hours to 3 days &mdash; not the disease. True immune HIT (and its thrombotic form, HITT) is driven by IgG against the <b>heparin&ndash;PF4 complex</b>, and the timing is diagnostic: antibodies appear <b>5&ndash;15 days</b> after exposure and circulate for ~3&ndash;6 months. The thrombosis stops being a paradox once you know that activated platelet granules dump thrombin, factor V, fibrinogen and von Willebrand factor into the blood &mdash; the same platelets falling in number are generating clot.</p><p>Cardiac surgery amplifies everything: after CPB's massive heparin dose, <b>~50% of patients carry anti-PF4 antibodies, ~2% develop immune HIT, and ~1% develop HITT</b>. Because the antibodies are transient, a repeat heparin exposure well beyond 6 months is usually safe &mdash; the danger is re-exposing a patient while antibodies still circulate. Practically: a preoperative <b>&ge;50% platelet drop to under 150,000</b> within 5&ndash;15 days of heparin is a stop sign for elective surgery, and after CPB a count under <b>80,000</b> should trigger stopping <em>all</em> heparin (including flushes), a 4T-score assessment, and a thrombosis hunt.</p>"
    },
    {
      type: "checkpoint",
      q: "A patient on heparin drip develops a platelet count drop from 220,000 to 90,000 over 5 days. HIT is suspected. What is the next immediate step?",
      options: [
        "Transfuse platelets to maintain count above 100,000",
        "Switch to low-molecular-weight heparin",
        "Increase heparin dose to prevent clotting",
        "Stop heparin and start a non-heparin anticoagulant"
      ],
      answer: 3,
      explain: "HIT is a thrombotic emergency. Immediate management requires: (1) discontinuing ALL forms of heparin, and (2) starting a non-heparin anticoagulant such as argatroban or bivalirudin. Platelet transfusion is contraindicated as it fuels the thrombotic process. LMWH cross-reacts with HIT antibodies and must also be avoided."
    },
    {
      title: "Endocarditis Pre-operative Workup",
      html: "<p>Infective endocarditis (IE) requires cardiac surgery in approximately 25–30% of cases during the index hospitalization. The pre-operative workup is extensive because surgery on an infected, inflamed heart carries unique risks: septic emboli, intracranial hemorrhage with full CPB anticoagulation, and seeding of a new prosthesis by an untreated extracardiac source.</p><ul><li><b>Echocardiography:</b> TTE first; TEE is mandatory for prosthetic valve IE, perivalvular complications, or when TTE is non-diagnostic. TEE sensitivity for perivalvular abscess is approximately 90% (vs. ~50% for TTE)</li><li><b>Blood cultures:</b> Minimum 3 sets before antibiotics. Identify organism and sensitivities</li><li><b>Dental evaluation:</b> Panoramic X-ray at minimum; dental extraction/treatment before cardiac surgery if time allows</li><li><b>CT/MRI brain:</b> Screen for septic emboli. Recent major stroke (&lt; 2 weeks) = increased risk of hemorrhagic transformation with CPB anticoagulation; ideally delay surgery 2–4 weeks</li><li><b>Abdominal CT:</b> Evaluate for splenic abscess—must be treated (splenectomy) before cardiac surgery to prevent seeding of the new valve</li><li><b>Coronary angiogram:</b> In patients &gt; 40 years old or with risk factors—concomitant CAD may require simultaneous CABG</li><li><b>Nutrition screen:</b> Albumin, prealbumin, BMI—malnourished patients have very high post-op infection risk</li></ul><p>Two threads run through this workup: <em>define the anatomy precisely</em> and <em>find every reason to wait or not wait</em>. On imaging, TTE detects vegetations with only 50&ndash;90% sensitivity, whereas <b>TEE reaches 90&ndash;100%</b> and is far better at the complications that decide the operation &mdash; perivalvular abscess, pseudoaneurysm, fistula, and prosthetic dehiscence. Vegetation features predict embolism and push toward earlier surgery: <b>size &gt;10 mm</b> (left-sided) with excessive mobility, and especially <b>&gt;15 mm</b> or growth despite antibiotics.</p><p>The guideline names the findings that make surgery <b>Class I even during the index admission</b>: valve dysfunction causing <b>heart failure</b>, infection by <b>S. aureus, fungi, or resistant organisms</b>, <b>heart block</b>, an <b>annular or aortic abscess</b>, and destructive penetrating lesions. Set against those are the reasons to pause &mdash; a recent large ischaemic stroke risks <b>haemorrhagic transformation</b> under full CPB anticoagulation, and an untreated extracardiac source (splenic abscess, oral sepsis) must be cleared first so it cannot seed the new valve. The workup is really an adjudication of those competing clocks.</p>"
    },
    {
      type: "checkpoint",
      q: "A patient with mitral-valve endocarditis had a nonhemorrhagic ischemic stroke 5 days ago and now has heart failure with persistent high embolic risk. The patient is not comatose, and CT/MRI excludes intracranial hemorrhage. When should indicated valve surgery be performed?",
      options: [
        "Proceed without delay",
        "Only after a fixed 2–4-week delay",
        "Only after blood cultures have been sterile for 14 days",
        "Never during the index admission"
      ],
      answer: 0,
      explain: "Current infective-endocarditis guidance recommends surgery without delay after nonhemorrhagic ischemic stroke when heart failure, uncontrolled infection, abscess, or persistent high embolic risk provides a surgical indication, provided coma is absent and intracranial hemorrhage has been excluded. Neurologic severity and imaging still require multidisciplinary assessment; hemorrhagic stroke follows a different timing pathway."
    },
    {
      title: "High-Risk Surgical Markers to Identify",
      html: "<p>Beyond the formal risk score, several specific findings dramatically increase operative risk and should be identified pre-operatively to inform planning, consent, and strategy.</p><ul><li><b>Severe pulmonary hypertension</b> (PA systolic &gt; 70 mmHg): The RV may be irreversibly damaged; significantly increases valve surgery mortality</li><li><b>Bilateral carotid stenosis or prior stroke:</b> Risk of perioperative stroke; carotid endarterectomy may be considered before or concurrent with cardiac surgery for bilateral significant stenosis (&gt; 70–80%)</li><li><b>Severe COPD</b> (FEV1 &lt; 50% predicted): Risk of prolonged ventilation and pulmonary complications; optimize with bronchodilators, steroids, and pulmonologist input pre-op</li><li><b>Renal dysfunction</b> (Cr &gt; 2.0 or dialysis): Significantly increases mortality, bleeding, and infection risk; minimize nephrotoxins pre-op; plan for potential post-op dialysis</li><li><b>Prior mediastinal radiation:</b> Hostile mediastinum—fibrotic pericardium, calcified coronary arteries, potentially non-usable radiated internal mammary artery; substantially elevated surgical risk</li></ul><p>The registry puts numbers on how much these shift risk. <b>Age:</b> octogenarians carry nearly double the operative mortality of younger patients (~4.1% vs 2.3%) and more than 60% have at least one non-fatal complication &mdash; yet carefully selected nonagenarians still achieve ~95% 30-day survival, so it is physiology, not the birthday, that counts. <b>Renal dysfunction</b> is one of the most powerful and underweighted markers: even <em>mild</em> impairment (creatinine ~1.47&ndash;2.25 mg/dL) raises 30-day mortality with an odds ratio around <b>3.7</b> and 1-year mortality around <b>4.6</b>.</p><p><b>Prior mediastinal radiation</b> follows a dose gradient &mdash; extensive exposure (Hodgkin's disease, thymoma, testicular cancer) is far worse than tangential breast radiation, with hospital mortality of roughly <b>13% vs 2.4%</b> and 4-year survival ~64% vs 80%. And <b>reoperation</b>, historically higher-risk because of sternal re-entry, adhesions, and in-situ grafts, now approaches primary-CABG mortality <em>when</em> a preoperative gated CT maps the retrosternal anatomy. The single highest-risk category on the STS benchmarks remains <b>combined valve + CABG</b> (mortality ~6.8%, mortality-or-major-morbidity ~30%) &mdash; stacking two operations stacks their risks.</p>"
    }
  ]
};

window.LESSONS["d5-heartteam"] = {
  id: "d5-heartteam",
  day: 6,
  ord: 3,
  title: "Frailty, Consent & Heart Team",
  short: "HeartTeam",
  minutes: 13,
  chunks: [
    {
      title: "Frailty: The Variable Risk Models Miss",
      html: "<p>Think of physiologic reserve as a <b>savings account</b> the body draws on to survive a major stress like cardiac surgery. Frailty means the account is nearly empty — so when the big withdrawal comes, there is nothing to cushion it. Crucially, frailty is <em>not</em> the same as being old or having many diagnoses; it is a distinct biological syndrome of accumulated deficit, and it predicts bad outcomes <b>on top of</b> whatever the STS score already saw. Frail patients have higher 30-day mortality, longer time on the ventilator, more acute kidney injury, a lower chance of going home rather than to a nursing facility, and worse quality of life at a year — even after their formal risk score is accounted for.</p><p>The critical clinical message: a patient can have a low STS score but be profoundly frail. Without formal frailty assessment, this risk is invisible to the standard model.</p><p>Frailty has a biology, which is why it behaves like its own disease rather than a proxy for age. It reflects <b>systemic dysregulation</b> of the immune, hormonal, and endocrine systems &mdash; up-regulated inflammatory cytokines, falling testosterone, insulin resistance &mdash; driving a catabolic state that erodes muscle mass and strength (<b>sarcopenia</b>). Depending on the population and the tool, 10 to 60% of cardiac-surgery candidates meet criteria. Most instruments target the five domains of the <b>Fried frailty phenotype</b>: slowness, weakness, low physical activity, exhaustion, and shrinking (unintentional weight loss).</p><p>The evidence that this is not academic comes from the Frailty ABCs study: a slow <b>5-metre gait speed</b> (&gt;6 seconds) was associated with a <b>threefold</b> increase in postoperative mortality or major morbidity and, crucially, added predictive value <em>on top of</em> the STS score. Combine the two and the stratification is stark &mdash; a patient with slow gait <em>and</em> a high risk score had a <b>43%</b> rate of death or major morbidity, versus <b>6%</b> for normal gait with a low-to-intermediate score. The number and the walk, together, see what neither sees alone.</p>"
    },
    {
      title: "Frailty Assessment Tools",
      html: "<p>Several validated tools are available. Different tools are used in different settings—knowing which tool to reach for in a given context matters.</p><ul><li><b>Clinical Frailty Scale (CFS):</b> A 9-point scale from very fit (1) to terminally ill (9). CFS ≥ 4 (vulnerable) signals increased post-op risk; CFS ≥ 5–6 indicates high risk. Rapid to administer, clinically intuitive</li><li><b>Essential Frailty Toolset (EFT):</b> Specifically developed and validated for TAVR populations. Includes chair stand test (functional muscle strength), cognitive testing (MMSE), hemoglobin, and albumin. An EFT score ≥ 4 = high frailty, predicting poor post-TAVR outcomes</li><li><b>Five-meter walk test:</b> Time to walk 5 meters. &gt; 6 seconds = frail; associated with increased post-cardiac surgery mortality</li><li><b>Grip strength:</b> Measured with dynamometer; low grip strength = sarcopenia and frailty</li></ul><div class='kbox study'><div class='kbox-tag'>STUDY</div><p>For TAVR cases, the Essential Frailty Toolset (EFT) is the validated frailty metric. For general cardiac surgery, the Clinical Frailty Scale (CFS) is most widely used. In frail patients, frailty may tip the decision toward TAVR over SAVR, or toward a goals-of-care discussion.</p></div><p>The recommended tools attach hard cut-offs to each domain. <b>Gait speed</b> is graded in bands &mdash; slow &lt;0.83 m/s (&gt;6 s over 5 m), very slow &lt;0.65 m/s (&gt;7.7 s), extremely slow &lt;0.50 m/s (&gt;10 s) &mdash; each step down predicting worse outcomes. <b>Handgrip weakness</b> by dynamometer is defined as &lt;30 kg in men and &lt;20 kg in women, and a <b>serum albumin &le;3.3 g/dL</b> flags the nutritional failure that tracks sarcopenia. Composite scales such as the <b>Fried phenotype</b> and the <b>Short Physical Performance Battery</b>, and the <b>Katz activities-of-daily-living</b> index, bundle these together.</p><p>The counter-intuitive lesson from the data: the elaborate multi-item batteries do not clearly beat the simplest single measures. A <b>5-metre gait speed</b> &mdash; and to a lesser extent grip strength &mdash; often <em>out-performs</em> the longer scores while taking seconds to administer. So the practical move is to time a walk and check an albumin on every borderline elderly candidate, rather than reserve frailty testing for a formal geriatrics consult that may never happen.</p>"
    },
    {
      type: "checkpoint",
      q: "A 79-year-old patient has an STS predicted mortality of 2.8% but has a 5-meter walk time of 9 seconds and an albumin of 2.9 g/dL. How does this change your assessment?",
      options: [
        "STS 2.8% is reassuring; proceed with standard risk counseling",
        "Frailty only matters for TAVR decisions, not SAVR",
        "Frailty raises risk beyond the STS estimate",
        "These findings would lower the STS score if re-entered"
      ],
      answer: 2,
      explain: "A 5-meter walk time > 6 seconds and low albumin (marker of malnutrition/sarcopenia) are objective frailty markers that predict poor cardiac surgical outcomes independent of STS score. Frailty captures physiologic reserve and nutritional status that the STS model does not. This patient is functionally frail, and actual risk is likely higher than 2.8%. Heart Team discussion is appropriate."
    },
    {
      title: "The Heart Team Concept",
      html: "<p>The Heart Team is a multidisciplinary panel specifically designed to integrate all the information that no single risk score can capture: formal risk scores, frailty assessment, cardiac anatomy, patient goals, cognitive status, social support, and procedural expertise. It emerged from the recognition that complex revascularization and valve decisions require perspectives that span specialties.</p><p>A complete Heart Team includes: cardiac surgery, interventional cardiology, cardiac anesthesia, geriatrics (when frailty is a concern), and palliative care (when life expectancy or goals of care are uncertain). Imaging specialists (echocardiographer, cardiac CT radiologist) often participate remotely or via report.</p><ul><li>For <b>multivessel CAD</b>: Heart Team determines CABG vs. PCI, often using SYNTAX score as input</li><li>For <b>aortic stenosis</b>: Heart Team determines TAVR vs. SAVR based on anatomy, access, frailty, comorbidities, and patient preference</li><li>For <b>complex valve surgery</b>: Discussion of repair vs. replacement, timing, and concomitant procedures</li></ul><p>The concept is not aspirational &mdash; it emerged directly from two landmark trials that <em>built</em> a team into the protocol: <b>SYNTAX</b> (PCI vs CABG for multivessel/left-main disease) and <b>PARTNER</b> (TAVR vs surgery for aortic stenosis). Both paired an interventional cardiologist with a cardiac surgeon, and membership has since expanded to imaging, neurology, pulmonology, anaesthesia, geriatrics, palliative care, and social work. Its authority is formal: a <b>Class I</b> recommendation in the valve guidelines and a <em>requirement for TAVR reimbursement</em> in the United States.</p><p>What the team actually delivers is measurable. Its goals are better <b>patient selection</b>, use of <b>synergistic procedural skill sets</b>, <b>standardised peri- and post-procedural pathways</b>, and structured follow-up &mdash; and the documented outputs include reduced decisional conflict, greater guideline adherence, lower readmission rates, shorter length of stay, and faster time to decision. It also operationalises <b>shared decision-making</b>: contrary to the assumption that patients want the doctor to decide, roughly <b>70%</b> prefer a shared role &mdash; so the team's job is not only to pick the right procedure but to hand the patient a genuine, informed choice.</p>"
    },
    {
      title: "Informed Consent in Cardiac Surgery",
      html: "<p>Informed consent in cardiac surgery goes beyond signing a form. It is a process of shared decision-making in which the surgeon ensures the patient understands the proposed procedure, its likely benefits, its specific risks, alternatives (including medical management), and the expected recovery trajectory.</p><p>Key elements that must be addressed in a cardiac surgical consent conversation:</p><ul><li><b>Procedural risks:</b> Mortality (quoted from risk score), stroke, myocardial infarction, renal failure, bleeding requiring reoperation, wound infection, prolonged ventilation</li><li><b>Benefits and alternatives:</b> What does surgery offer beyond medical therapy? Is PCI or TAVR an option?</li><li><b>Recovery expectations:</b> ICU stay, typical hospital length of stay, return-to-function timeline</li><li><b>Long-term considerations:</b> Anticoagulation requirements, valve durability, need for re-intervention</li></ul><div class='kbox pearl'><div class='kbox-tag'>PEARL</div><p>For frail elderly patients, the goals-of-care conversation must explicitly address <i>quality</i> of life outcomes—not just survival. Studies show that frail patients who survive cardiac surgery often do not return home and do not regain prior functional status. This must be part of the consent discussion.</p></div><p>At the far end of consent sits <b>futility</b>, which the textbook defines two ways: a <em>lack of medical efficacy</em> (the therapy is unlikely to produce its intended clinical result, judged by the physician) <b>or</b> a <em>lack of meaningful survival</em> (judged by the personal values of the patient). The rise of TAVR made this concrete &mdash; it extended treatment to patients once denied surgery, but experience showed some die soon after or gain little in quality of life or function. Naming that possibility honestly is part of consent, and the crucial framing is that a decision <em>not</em> to offer an invasive procedure <b>does not equal abandonment</b>: goal-concordant medical and palliative care is an active plan.</p><p>Done well, consent is a <b>therapeutic relationship</b>, not a signature. Structured decision aids &mdash; the Ottawa repository, the Mayo Shared Decision Making resources, Option Grids &mdash; help lay out benefits, risks, and alternatives in a form the patient can weigh, but their real purpose is to make the patient comfortable enough to express an <em>informed preference</em>. For the frail elderly, that means the conversation must center on the functional trajectory and the outcomes that matter to <em>them</em>, not on survival statistics alone.</p>"
    },
    {
      type: "checkpoint",
      q: "Which of the following is the primary purpose of the Heart Team in cardiac surgery decision-making?",
      options: [
        "To minimize the role of the cardiac surgeon in decision-making",
        "To serve as a regulatory body approving or denying surgical procedures",
        "To replace the need for individual informed consent",
        "Multidisciplinary integration of anatomy, risk, frailty, and patient goals"
      ],
      answer: 3,
      explain: "The Heart Team exists to synthesize information from multiple disciplines—cardiology, surgery, anesthesia, geriatrics, palliative care—to make holistic treatment recommendations that no single risk score or specialty can provide alone. It integrates anatomy (SYNTAX score, TAVR feasibility), formal risk (STS/EuroSCORE), frailty, and patient preferences. It does not replace individual consent but informs the recommendation that the surgeon then discusses with the patient."
    }
  ]
};

/* ============================================================================
   PGY-5 DEPTH LAYER (Sequence 3, Day 6) — merged into the existing topic-lessons
   as a continuous climb from working knowledge to the operating consultant's
   reasoning. Appended as level:4 (Senior Reasoning) and level:5 (Mastery) chunks.
   ============================================================================ */

window.LESSONS["d5-risk"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: quantify the risk two ways, then name what the number cannot see",
    html: `<p>The junior quotes a single percentage. The senior <b>builds the case for operation</b>: assembles the indication, quantifies the risk <i>two independent ways</i>, lists the modifiable factors, and writes the one-paragraph <i>"why we are operating and why now."</i></p>
<p><b>Two scores, on purpose.</b> The STS-PROM and EuroSCORE II are derived on different populations and weighted differently, so concordance between them is reassuring and a wide divergence is a flag to look harder. EuroSCORE II is <b>better calibrated</b> than the old logistic EuroSCORE I, which systematically <b>over-predicted</b> mortality (often 2–3× observed) in high-risk cases and drove inappropriate turn-downs. STS reports as a percent 30-day mortality plus a menu of morbidity endpoints (stroke, renal failure, prolonged ventilation, deep sternal wound infection, reoperation); EuroSCORE II reports mortality only. Neither is calibrated to <i>your</i> patient — they describe the outcomes of similar patients in a registry.</p>
<p><b>The modifiable ledger — the levers that actually move the number.</b> Before a truly elective case, the senior works a checklist of reversible risk:</p>
<ul>
  <li><b>Preoperative anemia</b> — iron studies and IV iron repletion; anemia and perioperative transfusion both independently worsen outcome.</li>
  <li><b>Glycemic control</b> — an elevated HbA1c predicts deep sternal wound infection, especially with BIMA harvest.</li>
  <li><b>Smoking cessation</b> and <b>prehabilitation</b> (inspiratory muscle training, mobility) in the frail or deconditioned.</li>
  <li><b>DAPT-interruption logistics</b> after a recent stent — reconcile the washout against the stent age and indication (see the P2Y12 timing).</li>
  <li><b>Carotid disease work-up</b> in the symptomatic or high-risk; <b>dental clearance</b> before any valve implant to remove an oral bacteremic source.</li>
</ul>
<p>The pre-pump workup — echo, angiography, carotids where indicated, dental, cross-sectional imaging for redo or aortic disease — must be <b>complete before the day of surgery</b>, not discovered on the table.</p>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the low score that lies — porcelain aorta and the hostile chest",
    html: `<p><b>Viva bar:</b> <i>"Your STS says 1.8% but you are worried — name the three things the score is blind to in this patient and show me how each one changes your recommendation."</i></p>
<p>The dangerous score is not the high one; it is the <b>reassuringly low one that is wrong</b>. The models are blind, by construction, to several lethal realities:</p>
<ul>
  <li><b>Porcelain aorta.</b> The frail octogenarian with severe AS and a circumferentially calcified ascending aorta may carry an STS of 2%, but that number does not know that <b>cross-clamping and cannulating a porcelain aorta is a stroke-generating maneuver</b>. Here the defensible answer is <b>transfemoral TAVR after Heart-Team review — not SAVR</b>. The score would have sent you to the wrong operation.</li>
  <li><b>Hostile chest.</b> Prior mediastinal radiation, a patent LIMA-to-LAD adherent to the posterior sternum on redo, dense adhesions — the model has no variable for a re-entry that can lacerate the RV or a graft. This is why redo cases image the retrosternal space and often expose femoral/axillary vessels <b>before</b> the saw touches bone.</li>
  <li><b>Systemic reserve the score omits</b> — cirrhosis (a Child-Pugh B liver predicts coagulopathy and mortality far beyond its STS weight), and profound frailty with sarcopenia and hypoalbuminemia.</li>
</ul>
<p>The move that separates the consultant: state the number, then say <i>"and here is what it cannot see,"</i> and let the unseen factor — not the digit — drive the recommendation toward TAVR, toward a modified operative plan, or toward <b>no operation at all</b>.</p>
<div class='kbox danger'><div class='kbox-tag'>DANGER</div><p>A porcelain aorta with a low STS is the classic trap. Reading only the score sends a stroke-prone patient to a cross-clamp. The imaging (gated CT, epiaortic scan) — not the calculator — makes this call.</p></div>`
  }
);

window.LESSONS["d5-heartteam"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the frailty-and-futility read that redirects a borderline patient",
    html: `<p>Formal frailty testing exists to make the invisible risk auditable. The senior does not just note that a patient "looks frail" — they measure it and let it move the decision:</p>
<ul>
  <li><b>Gait speed</b> — a 5-metre walk taking <b>&gt; 6 seconds</b> independently predicts operative mortality, prolonged ventilation, AKI, and failure to return home.</li>
  <li><b>Serum albumin &lt; 3.5 g/dL</b> and unintentional weight loss — nutritional failure and sarcopenia.</li>
  <li><b>Dependence in activities of daily living</b> and cognitive impairment — the reserve to survive a complication.</li>
</ul>
<p>A borderline patient whose objective frailty is high is often better served by a <b>transcatheter therapy</b> (redirecting from SAVR to TAVR) or by <b>palliation</b> than by the highest-risk open option. Frailty is also where the antithrombotic reconciliation lives: the specific stent type, its age, and the indication behind it dictate whether the P2Y12 inhibitor can be safely interrupted, and a recent stent in a frail patient can itself argue for delay or a less invasive path.</p>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the mechanical-versus-tissue conversation, and when the right operation is none",
    html: `<p>Prosthesis choice is a <b>shared decision</b>, not a reflex. The 2020 ACC/AHA framing gives the age scaffold, but the conversation is about values.</p>
<ul>
  <li><b>Mechanical valve favored &lt; 50 years</b> — durability, at the price of <b>lifelong warfarin</b> (INR target and bleeding/thrombosis risk).</li>
  <li><b>Bioprosthetic favored &gt; 65 years</b> — no lifelong anticoagulation, accepting structural valve degeneration and a probable future reintervention.</li>
  <li><b>Ages 50–65: genuine shared decision.</b> For the 55-year-old who does not want lifelong anticoagulation, the honest tradeoff is <b>durability versus freedom from warfarin</b>, and the age threshold favoring tissue has been <b>shrinking</b> as valve-in-valve TAVR makes a future bioprosthetic failure more manageable — provided the first valve is implanted with the <b>coronary-access consequences</b> of a later valve-in-valve in mind.</li>
</ul>
<p>And the hardest mastery point: <b>knowing when the right operation is no operation.</b> The profoundly frail patient with severe AS but advanced metastatic disease, or dementia with no prospect of meaningful functional recovery, is not served by a valve — transcatheter or surgical. Goal-concordant medical and palliative care is an <b>active plan</b>, not abandonment. The viva answer names the goals, the likely functional trajectory, and why intervention would not change the outcome that matters to the patient.</p>
<div class='kbox pearl'><div class='kbox-tag'>PEARL</div><p>The 50–65 "gray zone" is deliberately unresolved by guideline: it is a values conversation. Document the patient's stated priority (durability vs. no warfarin) — that documentation <i>is</i> the reasoning.</p></div>`
  }
);

/* ---- Anaesthetic preoperative assessment (Ch22 Key Questions) — merged into Day-6 preop ---- */
window.LESSONS["d5-risk"].chunks.push(
  {
    title: "Anaesthetic Preoperative Assessment: ASA & Airway",
    html: `<p>Alongside the cardiac risk score, the anaesthetic assessment grades the whole patient and the airway.</p>
<p>The <b>ASA physical-status classification</b> (American Society of Anesthesiologists) grades systemic disease:</p>
<ul>
  <li><b>ASA I</b> — a normal healthy patient.</li>
  <li><b>ASA II</b> — mild systemic disease, no functional limitation.</li>
  <li><b>ASA III</b> — moderate/severe systemic disease with definite functional limitation.</li>
  <li><b>ASA IV</b> — severe systemic disease that is a constant threat to life.</li>
  <li><b>ASA V</b> — moribund, not expected to survive 24 h with or without the operation. (An <b>E</b> suffix denotes an emergency.)</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">AIRWAY: PREDICT vs FIND</div>
  <p><b>Mallampati</b> is the <i>pre-operative bedside prediction</i> (mouth open, tongue out): I = faucial pillars + soft palate + uvula; II = pillars + soft palate; III = only soft palate; IV = none visible. The <b>Cormack–Lehane laryngoscopy grade</b> is the <i>actual view at intubation</i>: I = cords fully seen; II = cords partially seen; III = only epiglottis; IV = neither cords nor epiglottis. A high Cormack–Lehane grade documented in the notes warns the next anaesthetist of a difficult airway.</p>
</div>`
  }
);

/* ---- Biostatistics & evidence (Ch24 Key Questions) — merged into Day-6 heart-team/evidence ---- */
window.LESSONS["d5-heartteam"].chunks.push(
  {
    title: "Evidence & Biostatistics for the Cardiac Surgeon",
    html: `<p>Reading the trials that drive heart-team decisions requires a working grasp of study design and statistics.</p>
<p><b>Framing & design.</b> A focused question is built with <b>PICO</b> (Population, Intervention, Comparison, Outcome). Studies are <b>observational</b> (the investigator only watches — cross-sectional for prevalence, case-control for rare diseases [prone to recall bias], cohort for incidence over time) or <b>experimental</b> (the investigator intervenes — the <b>RCT</b>). Randomisation removes allocation bias and balances confounders; <b>double-blinding</b> (neither patient nor investigator knows the arm) further removes observer bias. <b>Intention-to-treat</b> analyses patients in their assigned group regardless of what they received, preserving that balance. <b>Non-inferiority</b> trials (e.g., TAVI vs SAVR) ask only that the new treatment is not meaningfully worse.</p>
<p><b>Inference.</b> The <b>null hypothesis</b> is "no difference"; a <b>p-value</b> &lt;0.05 means &lt;5% probability the observed difference arose by chance if the null were true. A <b>type I error</b> = rejecting a true null (false positive); a <b>type II error</b> = failing to reject a false null (false negative). <b>Power</b> = probability of detecting a real difference (rises with sample size, effect size, and a looser significance threshold); a power calculation sets the required sample size. A <b>95% confidence interval</b> is the range likely to contain the true value.</p>
<p><b>Effect measures.</b> <b>Relative risk</b> (RR) and <b>odds ratio</b> (OR — used in case-control where total exposed is unknown) and <b>hazard ratio</b> (HR — time-to-event): &gt;1 harm, =1 no effect, &lt;1 benefit. <b>NNT</b> = number needed to treat to prevent one event. Survival is shown on a <b>Kaplan–Meier</b> curve (censoring marks; compared by log-rank).</p>
<div class="kbox pearl">
  <div class="kbox-tag">DIAGNOSTIC TEST METRICS</div>
  <p><b>Sensitivity</b> = TP/(TP+FN) — detects disease (a sensitive test rules OUT when negative). <b>Specificity</b> = TN/(TN+FP) — a specific test rules IN when positive. <b>PPV</b> = TP/(TP+FP); <b>NPV</b> = TN/(TN+FN) — and both move with disease prevalence. A <b>ROC curve</b> plots sensitivity vs (1−specificity); the AUC (0.5 = useless, 1.0 = perfect) summarises discrimination.</p>
</div>
<div class="kbox">
  <div class="kbox-tag">CHOOSING A TEST</div>
  <p><b>Parametric</b> tests (t-test, ANOVA) assume normal data and have more power; <b>non-parametric</b> equivalents (Mann–Whitney U, Wilcoxon, Kruskal–Wallis) are used for skewed/small data. Match to the design: unpaired t-test / Mann–Whitney for two independent groups; paired tests for before-vs-after in the same patient; <b>chi-squared</b> (or Fisher's exact when any expected cell &lt;5) for categorical outcomes. Cardiac-surgery outcome monitoring uses the risk-adjusted <b>VLAD</b> plot and <b>funnel</b> plots to flag outlier performance against a model such as EuroSCORE II.</p>
</div>`
  }
);

/* ============================================================================
   2021 REVASCULARIZATION GUIDELINE — EQUITY, SHARED DECISION-MAKING, HEART
   TEAM, STS RISK (Sections 2, 3), AND SPECIAL POPULATIONS (Section 9).
   Merged into Day-6 (Preop / Heart Team) lesson d5-heartteam.
   ============================================================================ */

window.LESSONS["d5-heartteam"].chunks.push(
  {
    title: "Equity of Care and Shared Decision-Making",
    html: `<p>The guideline opens — deliberately — not with anatomy but with <b>equity</b> and <b>shared decision-making</b>, because these shape whether the right operation reaches the right patient.</p>
<ul>
  <li><b>Equity — COR 1:</b> revascularization decisions should be based on <b>clinical indication, regardless of sex, race, or ethnicity</b>; there is no evidence some groups benefit less, and efforts to reduce disparities are warranted. (Top-10 message #1.) Women and non-White patients are demonstrably <b>less likely</b> to receive reperfusion, invasive strategies, or revascularization, and have worse outcomes.</li>
  <li><b>Patient-centered decisions — COR 1:</b> decisions must consider the patient's preferences and goals, cultural beliefs, health literacy, and social determinants of health, made with their support system.</li>
  <li><b>Informed consent — COR 1:</b> give adequate information about benefits, risks, consequences, and alternatives, with sufficient time for informed decision-making.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Two of the guideline's Top-10 messages are not technical at all: <b>treat by indication regardless of sex/race/ethnicity</b>, and <b>use a Heart Team with shared decision-making when the strategy is unclear</b>. They are graded COR 1 — as strong as any anatomic recommendation in the document.</p>
</div>`
  },
  {
    title: "Risk Prediction: STS Score and the Limits of SYNTAX",
    html: `<p>The guideline names which numbers to trust for which decision.</p>
<ul>
  <li><b>STS Predicted Risk of Mortality — COR 1:</b> calculate the Society of Thoracic Surgeons risk score for every patient considered for CABG to stratify operative risk (Top-10 message #10). It integrates clinical variables the anatomic scores ignore.</li>
  <li><b>SYNTAX score — COR 2b, with a caveat:</b> assessing anatomic complexity may guide revascularization, but its usefulness is <b>less clear</b> because of interobserver variability in its calculation and its absence of clinical variables.</li>
  <li><b>Heart Team — COR 1:</b> when the optimal strategy is unclear, a team including interventional cardiology, cardiac surgery, and clinical cardiology improves outcomes.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>The division of labor: the <b>STS score answers "how risky is the operation for this patient?"</b> (a clinical-risk question), while the <b>SYNTAX score answers "how complex is the anatomy?"</b> (an anatomy question the Heart Team weighs, not obeys). Neither replaces the Heart Team's judgment.</p>
</div>`
  },
  {
    title: "Special Populations (1): CKD, Older Adults, and Noncardiac Surgery",
    html: `<p>Section 9 tailors revascularization to specific populations. The recurring theme: <b>match the aggressiveness of the strategy to the true risk–benefit for that patient.</b></p>
<ul>
  <li><b>Chronic kidney disease:</b> minimize contrast to prevent contrast-induced AKI (COR 1); in <b>STEMI + CKD</b>, angiography and revascularization are recommended with AKI-protective measures (COR 1); in <b>high-risk NSTE-ACS + CKD</b> it is reasonable (COR 2a); in <b>low-risk NSTE-ACS + CKD</b>, weigh risk vs benefit (COR 2a).</li>
  <li><b>Older adults — COR 1:</b> as in all patients, base the strategy on individual preferences, cognitive function, and life expectancy — not age alone.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>In asymptomatic stable CAD with CKD and no compelling indication, routine angiography/revascularization is not recommended (COR 3: No Benefit)</b> — ISCHEMIA-CKD showed no benefit of an invasive strategy over medical therapy. And <b>in patients with non–left-main, non-complex CAD undergoing noncardiac surgery, routine coronary revascularization solely to reduce perioperative cardiovascular events is not recommended (COR 3: No Benefit)</b> — CARP trial. Do not "clear" a patient for noncardiac surgery by prophylactically stenting them.</p>
</div>`
  },
  {
    title: "Special Populations (2): Arrhythmia, SCAD, Pregnancy, and Cardiac Allograft",
    html: `<p>The remaining special situations each carry a specific "do" and, importantly, several "do-nots."</p>
<ul>
  <li><b>Ventricular arrhythmia — COR 1:</b> in patients with VF, polymorphic VT, or cardiac arrest, revascularize significant CAD to improve survival.</li>
  <li><b>Spontaneous coronary artery dissection (SCAD):</b> revascularization <b>may be considered</b> only if hemodynamic instability or ongoing ischemia despite conservative therapy (COR 2b).</li>
  <li><b>Pregnancy:</b> for STEMI not caused by SCAD, primary PCI is the preferred strategy (COR 2a); for NSTE-ACS, an invasive strategy is reasonable if medical therapy fails to control life-threatening complications (COR 2a).</li>
  <li><b>Cardiac allograft vasculopathy — COR 2a:</b> PCI is reasonable for severe, proximal, discrete lesions.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>Routine revascularization for SCAD should not be performed (COR 3: Harm)</b> — most spontaneous dissections heal with conservative management, and instrumenting the dissected, fragile vessel frequently extends it. Similarly, <b>revascularization is not recommended for the sole purpose of preventing recurrent scar-mediated monomorphic VT (COR 3: No Benefit)</b> — that VT arises from established scar, not active ischemia, and is treated by ablation/ICD, not a graft.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A young peripartum woman presents with an NSTEMI; angiography shows a type 2 spontaneous coronary artery dissection (SCAD) with TIMI 3 flow and no ongoing ischemia or instability. What does the 2021 guideline recommend?",
    options: [
      "Immediate PCI with stenting of the entire dissected segment",
      "Conservative management while stable",
      "Emergency CABG of the dissected vessel",
      "Thrombolysis to restore flow"
    ],
    answer: 1,
    explain: "Most SCAD lesions heal spontaneously, and instrumenting the fragile, dissected vessel often propagates the dissection. The 2021 guideline makes routine revascularization for SCAD COR 3: Harm, and reserves revascularization (COR 2b, if feasible) for patients with hemodynamic instability or ongoing ischemia despite conservative therapy. With TIMI 3 flow and no ischemia or instability, conservative management is correct."
  },
  {
    type: "checkpoint",
    q: "A patient with stable, non-complex two-vessel CAD (no left main) is scheduled for elective hip replacement. The surgeon asks cardiology to 'revascularize first to protect him through surgery.' What does the guideline advise?",
    options: [
      "Prophylactic PCI of both vessels before the hip surgery",
      "Proceed without prophylactic coronary revascularization",
      "Prophylactic CABG before the hip surgery",
      "Cancel the hip surgery indefinitely"
    ],
    answer: 1,
    explain: "For patients with non–left-main, non-complex CAD undergoing noncardiac surgery, routine coronary revascularization solely to reduce perioperative cardiovascular events is COR 3: No Benefit (CARP trial showed no benefit of prophylactic revascularization before major vascular surgery). Revascularization should be reserved for its own independent indications, not performed to 'clear' a patient for noncardiac surgery."
  }
);
