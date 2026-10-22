# CardiacSchool Elevation Plan v3

## From a polished primer to a source-complete, clinically immersive cardiac surgery learning system

**Status:** implementation-ready master plan  
**Prepared:** 2026-07-09  
**Scope:** content depth, operative modules, physiology laboratories, cases and crises, source completeness, visual design, assessment, validation, and release sequencing  
**Primary local sources:** `cardiac_surgery_guide_v3.pdf`, `A_Primer_for_the_Student_Joining_the_Adult_Cardiac.pdf`, `Cardiac_Surgery.apkg`, `cardiac_anatomy.apkg`, and the extracted source files in `build_assets/`  
**Reference product:** the local `Surgery Training/` application, especially its surgery and case authoring contracts, content density, route structure, and validators

---

## 1. Executive directive

CardiacSchool should not compete with a textbook by becoming a textbook displayed inside a browser. It should outperform passive reading by combining the depth of a strong reference chapter with the advantages that a browser can provide: progressive disclosure, interactive physiology, decisions with consequences, repeated retrieval, visual anatomy, operative sequencing, longitudinal cases, rapid cross-linking, and feedback that identifies why the learner was wrong. The finished product should let a medical student arrive with little retained cardiac knowledge, rebuild the necessary foundations, and then climb toward the reasoning patterns of a capable resident. It should be useful before the rotation, during a case, after rounds, and when preparing for an oral examination.

The current app is a strong structural beginning. It is attractive, coherent, responsive, and technically validated. It contains 43 lessons, 321 core flashcards, 222 core questions, 127 anatomy cloze cards, 17 trial summaries with 51 questions, six operative modules, four physiology laboratories, and three crisis simulations. All four current validators pass. Those facts matter because the redesign should preserve the functioning learning system rather than discard it.

The present weakness is depth relative to the promise. The six operative modules contain approximately 602–721 teaching words each, eight or nine steps, six cards, five judgment questions, and five viva prompts. That is enough to orient a learner, but not enough to make the learner feel that the operation has been re-derived from first principles. The physiology laboratories are visually promising demonstrations, but they generally stop after a few controls, calculated readouts, and a short interpretation. The crisis room has three scenarios with three decisions each. The main curriculum contains 52,247 measured teaching/checkpoint words, but 17 of 43 lessons remain below 1,000 words and several source components from the 171-page guide are not represented as recognizable app experiences. The guide's service plan, pre-rounding checklist, OR preparation material, presentation scripts, four integration cases, many learning exercises, many pimping questions, figures, and explicit source trail do not currently appear as complete, traceable units.

The local `Surgery Training/` app demonstrates the expected standard more clearly than any abstract description. Its 29 operation files contain roughly 5,000–8,000 raw source words each, 14–19 explicit steps, and 22–33 MCQs per operation. Its case simulator contains 21 cases, 130 reachable decision nodes, and 389 choices, with branching consequences, optimal/acceptable/harmful grading, terminal outcomes, and debrief timelines. CardiacSchool does not have to copy that app's exact structure or inflate every page indiscriminately. It should, however, match its seriousness: foundational re-teaching, operative detail, management nuance, assessment density, and content validation.

This plan therefore sets five non-negotiable outcomes:

1. **Source completeness becomes measurable.** Every unique section, figure, exercise, pimping set, order framework, and integration case in `cardiac_surgery_guide_v3` will have a source ID and at least one visible destination in the app. Nothing will be considered "included" merely because a sentence resembling it exists somewhere.
2. **Every flagship operation becomes a true long-form operative curriculum.** The six existing modules will expand to a minimum of 4,500 high-information teaching words each, 14–20 steps, 20–30 questions, 20–30 cards, multiple diagrams, and explicit links to anatomy, physiology, evidence, complications, and ICU care. Additional guide-derived operations will follow the same contract.
3. **Physiology becomes an experimental environment.** Each lab will contain a concept primer, equations with units, prediction tasks, multiple presets, linked signals, staged challenges, clinical transfer cases, and a scored debrief. The lab should teach the learner to form and test a model, not merely move a slider.
4. **Cases become the principal synthesis layer.** The four guide integration cases will be reproduced faithfully as interactive cases, then expanded into a broader bank spanning preoperative clinic, OR decisions, CPB events, ICU deterioration, floor complications, and discharge planning. Branches will have consequences rather than simply reveal a right answer.
5. **The visual system becomes richer without becoming noisy.** More gradients, diagrams, data visualizations, timelines, procedural maps, layered cards, monitoring surfaces, and meaningful motion will be added. Decoration must clarify hierarchy, state, physiology, anatomy, risk, or progress. Visual richness will not be achieved by placing the same glow behind every card.

The project should be executed as a content-and-interaction rebuild inside the existing static architecture. The zero-build, offline-capable approach is an advantage and should remain. Data should be split into auditable files; renderers should remain reusable; local storage migrations should preserve progress; and each new content class should ship with structural and quality validators.

---

## 2. Evidence-based audit of the current application

### 2.1 What is already working

The app has a coherent 14-day spine. The curriculum sequence—anatomy, coronary physiology, valve disease, imaging, preoperative evaluation, CABG, valve surgery, aorta/pericardium, mechanical support, bypass/cardioplegia, hemostasis, pacing, ICU/complications, and an integrated exam—is logical for a short cardiac surgery rotation. The lesson-gating system connects reading to retrieval. The unified flashcard deck includes curriculum, anatomy, and surgery material. The dashboard exposes the advanced modules. The anatomy and trials modules are already modular. The app has dark/light themes, mobile navigation, a PWA manifest, and a reasonably mature design token system.

The current main curriculum is not empty or uniformly superficial. The measured 52,247 teaching/checkpoint words include several genuinely strong lessons. `d10-circuit` and `d13-complications` approach 3,000 words each. The ICU lessons explain hemodynamic profiles and RV failure mechanistically. The CABG indication lessons integrate major trials. The anatomy module contains 23 regions and 127 cloze cards. The trial module contains 17 recognizable landmark studies. The correct strategy is therefore not a bulk rewrite of every sentence. It is a completeness audit followed by targeted expansion, stronger cross-linking, and the addition of high-value interactive modes.

### 2.2 Where the content ceiling remains too low

The content ceiling varies widely. The shortest measured lessons are mitral stenosis at 664 words, aortic regurgitation at 688, catheterization at 707, and formal risk stratification at 741. Those lengths are not automatically unacceptable; a precise 700-word lesson can be excellent. The problem is that these topics contain enough pathophysiology, interpretation, thresholds, differential diagnosis, and management controversy that the current length frequently signals omitted depth. Seventeen lessons fall below 1,000 words, while the longest four exceed 2,000. The variability should be intentional rather than an artifact of how the first content pass was divided.

The operative layer is far below the reference standard. Approximate measured teaching words are:

| Operation | Teaching words | Steps | Viva prompts | Source labels |
|---|---:|---:|---:|---:|
| Median sternotomy | 653 | 8 | 5 | 1 |
| Going on/off CPB | 706 | 9 | 5 | 2 |
| On-pump CABG | 721 | 9 | 5 | 2 |
| SAVR | 658 | 9 | 5 | 2 |
| Degenerative mitral repair | 602 | 9 | 5 | 2 |
| Acute type A repair | 665 | 9 | 5 | 2 |

The visual hub currently advertises these as 18–42 minute modules and displays a word count of roughly 589–708 words. That mismatch damages trust. A learner cannot reasonably spend 36–42 meaningful minutes reading 650 words unless most of the promised learning is hidden in interaction, and currently it is not. Reading-time labels must be calculated from real content and expected interaction time, not used as aspirational badges.

The current operation renderer has good scaffolding: a sticky section rail, numbered sections, expandable steps, a numbers grid, complication lists, evidence, viva prompts, and linked practice. The data supplied to that renderer is simply too thin. The architecture can support depth if the schema is expanded beyond single-string fields and short arrays.

### 2.3 Where the interaction ceiling remains too low

The pressure-volume lab currently offers four controls—preload, afterload, contractility, and compliance—plus presets for normal, AS, AR, MR, and tamponade. It calculates EDV, ESV, SV, and EF and produces a short interpretation. This is an effective first demonstration, but it does not teach the loop's four phases, valve opening/closing points, ESPVR/EDPVR, pressure/volume coordinates, stroke work, or how a learner distinguishes a model artifact from clinical physiology. The learner is not required to predict a change before moving a control, identify a curve, solve a case, or defend an intervention.

The oxygen-delivery lab correctly emphasizes that flow, hemoglobin, and saturation matter more than MAP alone. It needs an explicit chain from pump flow to arterial oxygen content to indexed oxygen delivery, temperature-adjusted demand, extraction, venous saturation, lactate, and organ risk. The valve lab needs multiple linked equations, measurement error, low-flow states, prosthesis-patient mismatch, and post-repair assessment. The shock lab needs time-series trends, competing diagnoses, fluid/drug/ventilator interventions, and consequences.

The crisis room currently contains protamine collapse, cannulation dissection, and post-bypass RV failure. These are good choices, but each has only three decisions. Three questions can test recognition; they cannot simulate evolving physiology. The learner should see the monitor change, lose or preserve rescue options, and confront the consequences of delays. A crisis should include orientation, initial signal, information requests, immediate actions, diagnostic refinement, escalation, team communication, and post-event debrief.

### 2.4 What the source-completeness check already reveals

Direct phrase checks demonstrate that the following guide components do not currently appear as identifiable app units: the Day 1–7 on-service plan, the pre-rounding daily checklist, OR etiquette and scrub preparation, patient presentation scripts, the four named integration cases, and the standalone Common Orders With Rationale section. Some of their facts may be distributed across lessons, but that does not satisfy the requirement that all guide content show up. A learner looking for the guide's morning checklist or its case called "He Looks Fine But the Numbers Are Terrible" cannot find it.

The guide contains 15 annotated figures. The current app has six core SVG diagrams plus anatomy diagrams, but no explicit figure ledger showing which guide figure was redrawn, adapted, or replaced. The CPB circuit exists as an SVG, yet it is not transparently connected to Figure 10.1 or embedded throughout all relevant content. The same problem applies to the pressure-volume comparison, ischemic cascade, Carpentier classification, IABP waveform, Impella position, TEG/ROTEM tracing, pacing configurations, and shock classification matrix.

The guide also includes module-specific pimping questions, learning exercises, and takeaways for all fourteen modules. The app contains checkpoints, question-bank items, exercises, and flashcards, but there is no one-to-one ledger. It is therefore impossible to prove that every guide prompt is present, transformed, or deliberately consolidated. The new system must distinguish "source coverage" from "general topic coverage."

---

## 3. Product definition: what should replace passive textbook reading

The product should support four modes of use, each with a different interface and content density.

### 3.1 Rotation mode: what do I need for today?

Rotation mode is the existing 14-day plan, upgraded with the practical material from both PDFs. It answers: What should I read before tomorrow's case? What do I collect before rounds? How do I present? What should I look for in the OR? What numbers should I know? Each day should include a compact pre-round task, a core concept sequence, a linked visual, an application case, and a short retrieval set. Practical checklists should be pinnable and printable.

### 3.2 Operation mode: make me useful in this case

Operation mode begins with a patient and a decision, not an encyclopedic procedure description. It walks from disease and indication to preoperative planning, room setup, surgical anatomy, instruments, exposure, operative steps, bypass strategy, verification, complications, first 24 hours, and evidence. The learner can switch between a five-minute "scrub brief," the full long-form article, a visual step map, and a viva mode. A learner opening CABG the night before should be able to understand the angiogram, propose conduits and targets, anticipate each operative phase, recognize what can fail, and give a coherent postoperative handover.

### 3.3 Physiology mode: let me manipulate the mechanism

Physiology mode is a laboratory, not a set of animations. Every lab follows a cycle: predict, manipulate, observe, explain, apply, and retrieve. The learner should be asked to sketch or choose the expected direction of change before the visualization responds. Controls should expose the assumptions in the model. Presets should demonstrate disease, but challenge mode should remove labels and require reverse diagnosis. Clinical mode should present noisy, coupled signals rather than one variable at a time.

### 3.4 Case mode: make me decide under uncertainty

Case mode delivers information in fragments. The learner chooses what to ask, what to examine, which data to obtain, and what to do next. Not every suboptimal choice ends the case; some waste time, increase risk, or narrow future options. The debrief reconstructs the learner's path, compares it with an optimal path, explains acceptable alternatives, and links each error to the exact lesson, operation section, lab, trial, or card that repairs the misconception.

These modes should converge in mastery. Completing a lesson should not be confused with mastering a topic. Mastery should incorporate reading checks, card retention, question accuracy, case decisions, and time-separated performance. The app should make its claims carefully: it supports readiness and deliberate practice; it does not certify independent operative competence.

---

## 4. Source strategy and the source-completeness ledger

### 4.1 Source roles

`cardiac_surgery_guide_v3.pdf` is the primary coverage contract. Its 171 pages include the first-week plan, bedside checklists, OR preparation, presentation scripts, fourteen modules, module pimping questions, learning exercises, takeaways, common orders, four integration cases, and fifteen annotated figures. The extracted `build_assets/cs_guide.txt` contains approximately 75,752 words and supplies stable line ranges for auditing. The PDF itself remains necessary for figure placement, table structure, and visual context.

`A_Primer_for_the_Student_Joining_the_Adult_Cardiac.pdf` is the practical workflow supplement. Its 23 pages and roughly 15,863 extracted words emphasize clinic/consult preparation, postoperative data collection, rounding presentations, OR roles and layout, basic operative sequences, handoffs, and student expectations. It should strengthen the app's service-survival and workflow content rather than duplicate guide prose.

`Cardiac_Surgery.apkg` is a media-rich supplemental bank. It contains a collection database and numerous media objects. Before reuse, its note text, media mapping, source attribution, and licensing status must be audited. It may contribute image-based prompts, diagrams, or retrieval items, but no asset should be copied blindly into the production app.

`cardiac_anatomy.apkg` has already contributed the anatomy cloze material. The existing 127-card anatomy bank should be retained, deduplicated against future cards, and linked to the source ledger.

The local `Surgery Training/` app is a pedagogical and engineering reference, not a cardiac factual source. Its operation authoring specification, 29 long operation files, 749 surgery questions, 379 surgery cards, 14–19 step sequences, case graph schema, and validators establish a useful quality floor. Its content should not be transplanted into cardiac modules unless the topic is directly relevant and medically reverified.

### 4.2 Ledger structure

Create `site/js/data/source-ledger.js` and `site/tools/validate-source-coverage.js`. The ledger should contain one record per unique source unit:

```js
{
  id: "guide-m10-s10.1",
  source: "cardiac_surgery_guide_v3",
  pages: [74, 75],
  title: "The Cardiopulmonary Bypass Circuit",
  kind: "section",
  destinations: [
    { route: "#/lesson/d10-circuit", anchor: "circuit-components", role: "full" },
    { route: "#/physiology/oxygen-delivery", anchor: "circuit-context", role: "application" },
    { route: "#/surgery/bypass", anchor: "circuit-and-cannulation", role: "operative" }
  ],
  status: "covered",
  reviewer: "",
  notes: ""
}
```

Kinds should include `front-matter`, `section`, `subsection`, `figure`, `table`, `pimp-question`, `exercise`, `takeaway`, `order-framework`, `case`, and `answer-key`. A destination role can be `full`, `summary`, `application`, `assessment`, `visual`, or `duplicate-consolidated`. Every ledger record must resolve to a real route and, where supplied, a real anchor. `full` means the learner can obtain the complete instructional idea at that destination; `summary` alone cannot close a section-level requirement. Duplicate text in the source—such as the repeated Module 14 material in the extraction—should be represented once with a duplication note rather than counted twice.

### 4.3 Coverage rules

The source validator should fail when a source unit lacks a destination, when a destination route is invalid, when an anchor is missing, when a figure has no visual replacement, or when an integration case lacks both an interactive route and an answer-key/debrief mapping. It should warn when a section is marked covered by only a flashcard or question. It should print coverage by module, kind, and destination mode.

Content reviewers should work from the ledger rather than reread the entire PDF after every change. Each module author receives a slice of the ledger, maps existing coverage, fills gaps, and marks uncertain facts for review. The final release must report 100% of unique guide units mapped, 100% of front matter mapped, all fifteen figures mapped, all four integration cases interactive, and all module exercises/pimping prompts either represented or explicitly consolidated with a rationale.

### 4.4 Visible provenance

Learners should not see an ugly citation code after every paragraph, but they should be able to open a "Sources and coverage" drawer at lesson or operation level. The drawer should list the source title, relevant pages, guideline/trial references, review date, and whether content was adapted, expanded, or updated beyond the local guide. Where modern guidelines supersede a source statement, the app should teach the current statement and note that the source was updated. Local source completeness does not justify preserving outdated medicine.

## 5. Content architecture and authoring standard

### 5.1 Progressive depth instead of a single wall of text

Depth does not require forcing every learner through a 7,000-word page in one sitting. Every major topic should have four layers:

1. **Orientation:** a concise explanation of the problem, why it matters, and what the learner should be able to do.
2. **Core teaching:** mechanism-first prose, diagrams, thresholds, and common decisions appropriate to a clerk.
3. **Resident depth:** operative nuances, exceptions, controversies, quantitative frames, failure modes, and evidence.
4. **Performance:** viva questions, cases, calculations, sequencing, image interpretation, and spaced retrieval.

The interface should remember which sections are expanded and offer "Core only," "Full depth," and "Scrub brief" views. This is not a license to hide essential material. The source ledger decides what is essential; view modes decide how it is presented.

### 5.2 Minimum article standard

Long-form lessons and operations should use narrative paragraphs to explain mechanisms before tables or lists. A list can summarize after the model is clear; it should not substitute for explanation. Jargon must be defined at first use. Exact numbers require context: what is being measured, under what conditions, why the threshold matters, and what exceptions modify it. Every controversy should state the competing options, the evidence or physiology behind each, and the patient factors that change the answer.

Each advanced article should include:

- a short orientation and explicit learning objectives;
- prerequisite links rather than repeated foundational paragraphs;
- at least one annotated visual every 700–1,000 words where a visual genuinely helps;
- one or more "predict before reveal" prompts;
- tables for classifications, comparisons, thresholds, timelines, or troubleshooting;
- danger callouts tied to specific failure mechanisms;
- evidence callouts that describe population, comparison, primary result, limitation, and application;
- misconception callouts for common learner errors;
- a summary that reconstructs the model rather than repeating headings;
- linked cards, questions, cases, labs, and operations;
- a visible source/review drawer.

### 5.3 Data model changes

The current operation schema relies on single strings for indication, anatomy, evidence, and other sections. Replace it with blocks that can support headings, prose, tables, diagrams, calculations, callouts, branching prompts, and references. A simplified shape is:

```js
{
  id: "cabg",
  title: "On-Pump Coronary Artery Bypass Grafting",
  versions: { content: 2, reviewed: "2026-07-09" },
  sourceIds: ["guide-m6-s6.1", "primer-cabg-sequence"],
  objectives: [],
  scrubBrief: { patientQuestions: [], imagesToReview: [], numbers: [], sequence: [] },
  sections: [
    {
      id: "indication",
      title: "Why this patient needs CABG",
      core: [/* typed blocks */],
      advanced: [/* typed blocks */],
      sourceIds: []
    }
  ],
  steps: [
    {
      id: "distal-anastomosis",
      title: "Construct the distal anastomosis",
      action: [],
      purpose: [],
      anatomy: [],
      instruments: [],
      checks: [],
      failureModes: [],
      rescue: [],
      visuals: []
    }
  ],
  cards: [],
  questions: [],
  viva: [],
  references: []
}
```

Typed blocks should include `paragraph`, `list`, `table`, `diagram`, `equation`, `callout`, `checkpoint`, `comparison`, `timeline`, and `case-link`. The renderer should escape untrusted text and allow only controlled HTML generated from the schema. This reduces the current mix of large trusted HTML strings, inconsistent callout classes, and hard-to-audit markup.

### 5.4 Content floors and ceilings

For each of the six flagship operations, the minimum is 4,500 instructional words excluding questions and card answers. The target is 5,500–7,500 when the operation genuinely requires it. Word count is a proxy, not the goal; validators should also enforce section and concept coverage. Each operation requires 14–20 steps, 20–30 surgery cards, 20–30 questions, 12–20 viva prompts, 4–8 visuals, two or more integrated mini-cases, and a first-24-hour plan. At least half the questions should involve a patient, image, intraoperative event, or management decision rather than pure recall.

For core lessons, there should be no arbitrary universal minimum, but every lesson should pass a concept checklist derived from its source sections. Lessons below 1,000 words receive a mandatory depth audit. A concise lesson can remain concise if it demonstrably covers its ledger and has strong linked application. A topic like mitral stenosis or catheter interpretation will almost certainly need expansion.

For physiology labs, every lab requires a 700–1,500 word concept primer, explicit equations and assumptions where applicable, at least five presets, at least six prediction challenges, at least three clinical transfer cases, a scored debrief, and related cards/questions. For cases, the minimum is five decision nodes; flagship cases should have eight to twelve reachable nodes and more than one acceptable terminal pathway.

---

## 6. Curriculum expansion, day by day

### Day 1: cardiac and mediastinal anatomy

Map all six Module 1 subsections, its pimping set, exercises, takeaways, and Figures 1.1–1.4. Preserve the current chamber, coronary, valve, conduction, vessel, and mediastinal material, but expand the three-dimensional surgical relationships. The learner must understand what lies immediately behind the sternum, why redo entry changes the plan, how the transverse and oblique sinuses are used, where the brachiocephalic vein and phrenic nerves lie, and how the heart's oblique orientation changes the operative view.

Create a layered cardiac anatomy viewer with toggles for chambers, coronaries, veins, conduction tissue, valves/fibrous skeleton, great vessels, nerves, and operative danger zones. Add anterior, posterior, short-axis, aortic-root, and surgeon's-view orientations. Each layer should connect directly to cards and an operation step. A "what am I looking at?" mode should remove labels and require the learner to identify the structure and state why it matters surgically.

Add a surgical-anatomy danger module: RV and grafts in redo sternotomy; brachiocephalic vein in upper sternotomy; phrenic nerve during pericardiotomy/LIMA work; circumflex near the posterior mitral annulus; conduction axis near the membranous septum; coronary ostia and aortomitral curtain in SAVR; recurrent laryngeal nerve near the arch; and thoracic duct in upper mediastinal dissection. The end assessment should ask not merely for labels but for the maneuver that threatens and protects each structure.

### Day 2: coronary physiology and ischemia

Map all seven Module 2 subsections, the ischemic cascade figure, pimping questions, exercises, and takeaways. Expand coronary perfusion pressure, diastolic flow, autoregulation, flow reserve, critical stenosis, oxygen extraction, supply-demand balance, stunning, hibernation, infarction, steal, and reperfusion injury. Calculations should use units and show how heart rate, diastolic pressure, LVEDP, hemoglobin, saturation, wall stress, and contractility alter the balance.

Add a coronary supply-demand lab. The learner predicts ischemic risk, then changes heart rate, aortic diastolic pressure, LVEDP, hemoglobin, oxygen saturation, contractility, and stenosis severity. The display should show diastolic perfusion gradient, a conceptual coronary flow reserve, estimated oxygen supply/demand direction, and a synchronized ischemic cascade. Disease presets should include tachycardia with hypertrophy, anemia with left-main disease, post-bypass low diastolic pressure, IABP support, and coronary spasm. Clinical challenges should ask which single intervention provides the fastest benefit and why.

### Day 3: valvular pathology and hemodynamics

Map pressure versus volume overload, AS, AR, MS, MR, the PV-loop figure, Carpentier figure, pimping set, exercises, and takeaways. Expand staging, natural history, chamber remodeling, flow dependence, discordant measurements, and the trigger to intervene before irreversible ventricular injury. Separate primary and secondary MR. Teach why EF can appear preserved in regurgitant lesions despite declining forward performance.

The existing PV loop lab should become a full ventricular mechanics lab. Label all four phases and valve events. Plot or approximate ESPVR and EDPVR. Add stroke work, effective forward stroke volume, and the effects of regurgitant orifices. Include pressure-volume presets for AS, AR, MR, reduced contractility, concentric hypertrophy, restrictive physiology, tamponade, vasoplegia, and post-repair SAM. Each challenge begins with a prediction. A reverse-diagnosis mode shows a loop and asks the learner to name the lesion and expected bedside findings.

### Day 4: imaging and interpretation

Map ECG, echocardiography, coronary angiography, CT/MRI, the standard echo-window figure, pimping questions, exercises, and takeaways. The current text describes imaging but the learner needs read-out practice. Create an imaging lab with openly licensed or locally owned annotated stills and schematic clips. It should include standard TTE/TEE planes, post-bypass TEE checkpoints, coronary angiographic orientation, CT dissection signs, CXR line/drain checks, and basic Swan-derived profiles.

Every imaging item should have a three-stage view: unlabelled image, learner interpretation, then annotated explanation. Hotspots should ask the learner to point to a structure or lesion. Measurements should teach cursor placement and error: LVOT diameter error in the continuity equation, Doppler alignment error, pressure recovery, low-flow gradients, PISA assumptions, CT motion artifact, and angiographic foreshortening. The app should never pretend that a static schematic alone creates imaging competence; it should state when real supervised image review is required.

### Day 5: preoperative evaluation and risk

Map STS/EuroSCORE, frailty, antiplatelet/anticoagulant management, endocarditis workup, high-risk markers, pimping questions, exercises, and takeaways. Integrate the primer's clinic/consult tables, outside-record retrieval, focused history, medication reconciliation, imaging review, and presentation example.

Build a preoperative workbench. The learner receives a patient dossier and must identify missing tests, calculate or interpret risk, find modifiable factors, reconcile antithrombotics, select needed imaging, and write a concise recommendation. A transparent teaching calculator can demonstrate how variables affect risk, but it must not masquerade as the official STS calculator. Frailty, porcelain aorta, hostile chest, prior radiation, liver disease, renal dysfunction, pulmonary disease, carotid disease, anemia, infection, and patient goals should influence the plan. Add consent modules comparing CABG/PCI, SAVR/TAVR, and mechanical/bioprosthetic valves.

### Day 6: CABG indications, evidence, and technique

Map all four Module 6 subsections plus pimping, exercises, and takeaways. Expand the current indication and conduit lessons where the source ledger identifies omissions. Correct any oversimplified guideline labels or numerical claims during medical review. Build an interactive coronary map in which the learner identifies targets, grades target quality, selects conduits, chooses inflow, and explains competitive flow, runoff, sequential grafting, aortic manipulation, and completeness of revascularization.

Day 6 should connect directly to the expanded CABG operation, trials, angiography drills, anatomy, CPB, myocardial protection, bleeding, and the first guide integration case. The learner should leave able to defend CABG versus PCI for specific anatomy and comorbidity, not just repeat that diabetes favors surgery.

### Day 7: valve surgery

Map SAVR/TAVR, prosthesis choice, and mitral surgery plus the associated questions, exercises, and takeaways. Add lifetime valve planning, future coronary access, valve-in-valve implications, prosthesis-patient mismatch, anticoagulation realities, structural valve degeneration, endocarditis, annular/root anatomy, repair feasibility, and tricuspid considerations. Connect the day to the expanded SAVR and mitral repair operations.

Build a valve conference simulator. Six to ten patients should force different decisions: young bicuspid AS with aortopathy; older transfemoral TAVR candidate; small annulus; dialysis; pregnancy considerations; asymptomatic severe primary MR with repairable anatomy; ischemic secondary MR; and concomitant tricuspid regurgitation. Each decision should display the physiology, evidence, durability, and patient-preference tradeoffs.

### Day 8: aortic surgery and pericardial disease

Map aneurysm, dissection, ascending/arch repair, TEVAR, pericardial disease, evidence, Figure 8.1, pimping questions, exercises, and takeaways. Expand the anatomy of root, ascending aorta, arch zones, branch vessels, true/false lumen, malperfusion, and cerebral protection. Teach how connective tissue disease, bicuspid valve, family history, growth rate, body size, and concomitant valve surgery change thresholds.

Create an aortic planning board where the learner selects cannulation, temperature, cerebral protection, root strategy, distal extent, and malperfusion response. Add a pericardial physiology lab distinguishing free effusion, loculated postoperative clot, tamponade, constriction, and restriction. Connect this day to the type A operation and a longer emergency case.

### Day 9: mechanical circulatory support

Map physiologic rationale, IABP, Impella, VA-ECMO, durable LVAD, bridge strategies, Figures 9.1–9.2, pimping, exercises, and takeaways. Add device-specific pressure-flow effects, ventricular loading, contraindications, cannulation, complications, monitoring, and weaning. The learner should distinguish a device that unloads the LV from one that increases afterload and understand why VA-ECMO can distend the LV.

Build an MCS selection and escalation lab. Present isolated LV failure, RV failure, biventricular failure, hypoxemic respiratory failure, postcardiotomy shock, acute MR/VSD, and refractory arrest. The learner chooses support, predicts hemodynamic changes, adds venting when needed, and plans weaning. Include IABP timing waveform challenges, Impella position interpretation, ECMO differential hypoxemia, limb ischemia, hemolysis, anticoagulation, and LVAD suction events.

### Day 10: CPB and myocardial protection

Map all seven Module 10 subsections, the CPB figure, pimping questions, exercises, and takeaways. The existing CPB lessons are among the deepest and should be preserved, but they need visual and interactive integration. Create a labelled circuit that shows venous drainage, reservoir, pump, oxygenator, heat exchanger, arterial filter, sensors, suckers, vents, cardioplegia lines, and patient connections. Clicking a component should reveal purpose, monitored variables, common failures, and rescue actions.

Expand the oxygen-delivery lab into a perfusion cockpit. Controls should include indexed flow, hemoglobin/hematocrit, saturation, temperature, arterial pressure, venous saturation, and estimated metabolic demand. Display CaO2, indexed DO2, qualitative extraction, and warning trends. Challenges should include hemodilution, low venous return, high arterial line pressure, oxygenator failure, venous air, inadequate cooling, aortic dissection, and poor myocardial arrest. A separate cardioplegia lab should compare antegrade/retrograde delivery, blood/crystalloid strategies, dosing intervals, LV hypertrophy, coronary obstruction, AR, and right-heart protection.

### Day 11: hemostasis, transfusion, and re-exploration

Map coagulopathy mechanisms, TEG/ROTEM, conservation, transfusion thresholds, HIT, re-exploration, Figure 11.1, pimping, exercises, and takeaways. Build a viscoelastic testing lab in which the learner identifies delayed clot initiation, low fibrinogen contribution, platelet dysfunction, hyperfibrinolysis, and residual heparin. Product and drug choices should follow the displayed abnormality and local-policy framing.

Create a bleeding chest case with time-dependent drainage, temperature, ACT, labs, TEG/ROTEM, transfusions, hemodynamics, and signs of tamponade. The learner must decide when bleeding is likely surgical, when targeted correction is appropriate, and when delay becomes dangerous. Include blood conservation, cell salvage, antifibrinolytics, anemia, massive transfusion complications, and respectful planning for patients who decline blood products.

### Day 12: pacing and conduction

Map all six Module 12 subsections, pacing configuration figure, pimping questions, exercises, and takeaways. Expand wire placement, lead checks, NBG code, sensing, capture, thresholds, common modes, failure to sense/capture, oversensing, undersensing, removal, and progression to permanent pacing. Connect conduction anatomy directly to SAVR, mitral, tricuspid, and septal procedures.

Build a pacing-box simulator with atrial and ventricular electrograms, rate, output, sensitivity, AV delay, and modes. Cases should include sinus bradycardia, complete heart block, atrial fibrillation, junctional rhythm, intermittent capture, lead reversal, and R-on-T risk. The learner should adjust one variable at a time and see the resulting rhythm strip.

### Day 13: ICU management and postoperative complications

Map all Module 13 and 14 sections, Figures 13.1 and the hemodynamic profile table, all pimping sets, exercises, takeaways, and the common-orders section. Integrate the primer's postoperative tables, presentation template, handoff structure, drain/wound review, and common complication table.

Rebuild this day around an ICU cockpit. The learner receives a handoff, verifies lines and drains, trends values, identifies the dominant phenotype, chooses actions, and constructs an ICU plan. The cockpit should integrate ventilation, rhythm, pacing, preload, biventricular function, SVR/PVR, bleeding, renal function, temperature, glucose, sedation, delirium, pain, mobilization, and infection prevention. It should support both a guided first-hour reception checklist and a deteriorating-patient mode.

### Day 14: integration and readiness

Day 14 should no longer be only a randomized mock exam. It should contain the four faithful guide integration cases, an oral-viva circuit, an image station, a calculations station, an operation narration station, and a conventional question exam. Readiness reporting should separate knowledge, interpretation, operative sequencing, case management, and retention. A learner may be strong in facts but unsafe in crisis recognition; a single percentage obscures that distinction.

---

## 7. Flagship surgery overhaul

### 7.1 Universal surgery contract

Every operation begins with two entry points: a five-minute scrub brief and the full module. The scrub brief includes the diagnosis, indication, patient-specific concerns, imaging to review, key anatomy, equipment/conduits, planned sequence, bypass/cannulation strategy, three danger moments, expected ICU issues, and five questions the student should be ready to answer. It can be printed as a one-page pocket card.

The full module then contains: foundations; disease and natural history; indications and alternatives; patient selection; imaging and preoperative plan; consent; room setup and team roles; positioning/prep; surgical anatomy; instruments/materials; exposure; 14–20 operative steps; bypass and myocardial protection; verification; variations; failure modes and rescue; closure; immediate handoff; first 24 hours; early and late complications; evidence/controversy; viva; cards; questions; linked cases; and sources.

Each step must distinguish the action from the reason. It should show what the surgeon sees, what the assistant does, what must be protected, what confirms success, what can go wrong, and what the rescue is. Diagrams should include at least an orientation view, exposure view, key anatomy view, step sequence, and danger map. Where exact instrument or suture choices vary, teach the principle and label local variation rather than invent a universal rule.

### 7.2 Median sternotomy and re-entry

Expand beyond a simple primary sternotomy. Teach surface marking, positioning, wide preparation, interclavicular ligament, xiphoid handling, saw direction, ventilation coordination, midline control, marrow bleeding, thymic division, pericardiotomy, pericardial cradle, phrenic nerves, internal thoracic arteries, pleural entry, and closure mechanics. Add wire patterns, cable/plate concepts, osteoporotic bone, transverse fractures, off-midline division, drains, pacing wires, and layered soft-tissue closure.

The advanced half should focus on redo entry: CT review, RV/graft proximity, patent LIMA, peripheral exposure, rescue cannulation, oscillating saw depth, subxiphoid or cervical control options, catastrophic RV/graft/aortic injury, and infection. Include prevention and management of deep sternal wound infection, instability, nonunion, mediastinitis, and postoperative pain/pulmonary impairment. The step count target is 16–18. Cases should include hostile redo chest, right ventricular entry, fractured hemisternum, and infected unstable closure.

### 7.3 Going on and coming off cardiopulmonary bypass

Turn this into the bridge between the circuit lesson and every on-pump operation. Teach circuit checks, communication, heparin and ACT verification, aortic assessment, purse strings, arterial cannulation, de-airing and connection, venous strategies, vents, cardioplegia routes, initiation, full flow, cross-clamping, myocardial protection, monitoring, rewarming, de-airing, reperfusion, pacing, TEE review, dynamic filling, staged flow reduction, separation phenotypes, protamine, decannulation, and final checks.

Failure modes should include inadequate venous return, chatter, air lock, caval obstruction, high arterial line pressure, malposition, dissection, low MAP with adequate flow, inadequate oxygen delivery, poor arrest, ventricular distension, air, arrhythmia, LV/RV failure, SAM/LVOT obstruction, residual valve lesion, ischemia, vasoplegia, tamponade, and protamine reaction. The learner should be able to state the six-domain failure-to-separate differential and use TEE/hemodynamics to refine it. Target 18–20 steps, a full circuit visual, a separation algorithm, and at least four linked crisis cases.

### 7.4 On-pump CABG

The expanded CABG module should begin before the incision. Teach how to read the cath report and images, identify target territories, assess viability/runoff, decide whether CABG is indicated, and design a graft plan. Cover LIMA/RIMA, radial artery, saphenous vein, conduit assessment and handling, skeletonized versus pedicled harvest, spasm prevention, no-touch vein concepts, sequential/composite grafts, competitive flow, total arterial strategies, and patient factors that alter conduit choice.

The operative sequence should include room setup, sternotomy, conduit harvest, pericardial exposure, aortic assessment, cannulation, cardioplegia strategy, target identification, distal exposure, arteriotomy, distal anastomosis geometry, graft routing, proximal strategy, de-airing, reperfusion, flow verification, TEE, separation, hemostasis, drains/wires, and closure. Include technical details the learner can observe without pretending to teach independent performance: heel/toe geometry, intimal apposition, plaque avoidance, target mismatch, tension/twist, cardioplegia redosing, and assessment on a filled beating heart.

Evidence should integrate left-main and multivessel disease, diabetes, ventricular dysfunction, anatomic complexity, PCI alternatives, complete revascularization, on/off-pump evidence, radial versus vein, and BIMA controversy. Cases should include diabetic multivessel disease, porcelain aorta, poor targets, radial competitive flow, failed graft signaled by new regional dysfunction, and postoperative ischemia. Target 18–20 steps, 25–30 questions, and 25–30 cards.

### 7.5 Surgical aortic valve replacement

Begin with the valve/root anatomy, lesion severity, symptoms, ventricular response, and lifetime management decision. Compare medical surveillance, TAVR, SAVR, Ross/root procedures where relevant, and concomitant aortic/CABG needs. Cover mechanical versus bioprosthetic tradeoffs, annular/root size, calcium distribution, coronary heights, conduction risk, endocarditis, and small-annulus planning.

The operative sequence should include exposure, cannulation, venting, cardioplegia, aortotomy, inspection, leaflet excision, calcium control, annular debridement, sizing, suture placement, prosthesis seating, leaflet/strut inspection, coronary ostia, aortotomy closure, de-airing, reperfusion, TEE assessment, and closure. Add patient-prosthesis mismatch, root enlargement principles, paravalvular leak, annular/root injury, aortomitral curtain injury, coronary obstruction, heart block, embolization, prosthesis dysfunction, and new RV failure. Cases should force decisions about young versus old patients, small annulus, bicuspid aortopathy, dialysis, endocarditis, and unexpected postimplant findings.

### 7.6 Degenerative mitral valve repair

Re-derive annular, leaflet, chordal, papillary, ventricular, circumflex, coronary sinus, and conduction anatomy. Teach Carpentier mechanism, segmental nomenclature, degenerative phenotypes, TEE analysis, repairability, primary versus secondary MR, and the reasons repair is preferred when durable. Include when replacement is safer or more appropriate.

The operative sequence should include exposure, cannulation, atriotomy approach, systematic valve analysis, saline testing, lesion-specific repair choices, neochord/resection principles, commissural work, cleft closure when appropriate, annuloplasty sizing/placement, circumflex risk, repeat testing, atrial closure, de-airing, and post-bypass TEE. The module must deeply teach residual MR, stenosis/high gradient, systolic anterior motion, LVOT obstruction, circumflex injury, leaflet restriction, ring dehiscence, and ventricular effects. Cases should include P2 flail, bileaflet disease, annular calcification, ischemic MR, SAM after separation, and new lateral dysfunction.

### 7.7 Acute type A dissection repair

Begin with the biology and anatomy of dissection, true/false lumen, branch malperfusion, aortic insufficiency, tamponade, coronary involvement, and rupture. Teach emergency evaluation, anti-impulse therapy without delaying surgery, imaging review, neurologic/visceral/limb malperfusion, team activation, blood preparation, and the choices that must be made before incision.

The operative sequence should include access and rescue planning, cannulation options, sternotomy with tamponade risk, venous cannulation/venting, cooling, proximal control, cardioplegia, tear/root/coronary assessment, cerebral protection, circulatory arrest, distal repair/hemiarch, true-lumen reconstruction, proximal/root strategy, reperfusion, hemostasis, separation, and delayed chest options. Compare axillary, central, femoral, and other strategies without presenting one as universal. Teach unilateral/bilateral antegrade cerebral perfusion, temperature strategy, root resuspension versus replacement, hemiarch versus more extensive repair, persistent malperfusion, coagulopathy, stroke, renal/mesenteric injury, and postoperative surveillance. Cases should include tamponade, coronary malperfusion, neurologic deficit, visceral malperfusion, cannulation dissection, and refractory bleeding.

### 7.8 Second-wave operation catalog

The six flagships are the first quality gate, not the final catalog. The guide contains enough material to support additional procedural modules that make its content easier to use in the OR. The second wave should be added only after the flagship contract and renderer are stable. Each second-wave module should still meet the long-form standard when it represents a true operation; device insertions or focused procedures may use a shorter 2,500–4,000-word contract if their scope is genuinely narrower.

Recommended additions are: TAVR procedural planning and complication rescue; mitral valve replacement; tricuspid repair/replacement; ascending aortic and hemiarch replacement; aortic root replacement with Bentall and valve-sparing concepts; pericardial window and pericardiectomy; re-exploration for bleeding/tamponade; IABP insertion and management; central/peripheral VA-ECMO cannulation; temporary ventricular support; durable LVAD implantation overview; epicardial pacing wire placement/removal; chest drain placement/removal; and delayed sternal closure. These modules turn guide sections that are currently scattered across lessons into visible workflows without pretending that reading substitutes for supervised procedural training.

The catalog should be grouped by Foundational Access, Coronary, Valve, Aorta, Pericardium, Mechanical Support, and Rescue/Reoperation. Filters should include learner stage, urgency, anatomy region, bypass requirement, and related curriculum day. Each card should show actual content density, number of steps, cases, visuals, and whether the source review is current. Do not label a module “chief resident” merely for atmosphere; show the competencies it expects.

---

## 8. Physiology laboratory overhaul

### 8.1 Universal laboratory loop

Every lab should use the same cognitive cycle so the learner develops a repeatable method:

1. **Orient:** define the model, variables, units, clinical question, and limitations.
2. **Predict:** ask the learner to choose or sketch the expected direction of change before controls are active.
3. **Manipulate:** expose a small set of controls with clinically meaningful ranges.
4. **Observe:** update the visual, equations, derived variables, and linked bedside signals.
5. **Explain:** require a mechanism statement or select the best explanation.
6. **Apply:** move into a brief patient scenario with noise and competing data.
7. **Debrief:** compare the prediction, action, result, and ideal reasoning.
8. **Retrieve later:** create linked cards and questions from errors.

Controls need units, plausible ranges, keyboard accessibility, reset, preset, and “show assumptions” functions. Outputs need warning states that do not rely on color alone. Equations should show substituted values, not only a final number. Models must explicitly say when they are conceptual rather than clinically validated calculators.

### 8.2 Pressure-volume and ventricular mechanics laboratory

Expand the current PV loop from a single polygon into a labelled, teachable system. The default view should display end-diastolic and end-systolic points, isovolumic contraction, ejection, isovolumic relaxation, filling, mitral/aortic valve events, ESPVR, EDPVR, stroke volume, ejection fraction, and conceptual stroke work. Learners should be able to overlay normal and changed loops rather than relying on memory of the previous state.

Controls should include preload/venous return, arterial elastance/afterload, contractility, diastolic compliance, heart rate, and regurgitant severity. Disease presets should include AS, AR, MR, reduced EF, concentric hypertrophy, dilated cardiomyopathy, tamponade/pericardial constraint, vasoplegia, hypovolemia, and SAM/LVOT obstruction. Each preset needs a short pathophysiology explanation, expected exam/echo findings, and implications for anesthesia, bypass separation, or surgery.

Challenges should require the learner to predict loop width, height, EDV, ESV, SV, EF, and pressure changes; distinguish pressure from volume overload; identify why EF can mislead in MR/AR; choose an intervention for an underfilled hyperdynamic LV; and reason through SAM. A more advanced mode can expose ventricular-arterial coupling conceptually without claiming numerical precision.

### 8.3 CPB oxygen-delivery and perfusion laboratory

The lab should visibly derive arterial oxygen content from hemoglobin, saturation, and dissolved oxygen, then multiply by pump flow to show indexed delivery. Controls should include body surface area, indexed pump flow, hemoglobin/hematocrit, SaO2, PaO2, temperature, and estimated oxygen consumption. Outputs should include calculated CaO2, DO2i, qualitative extraction, predicted venous saturation direction, and organ-risk warnings. The learner should see why a normal MAP can coexist with low oxygen delivery and why pressure alone is not perfusion.

Presets should include routine normothermic bypass, hemodilution, anemia, low flow, hypoxemia/oxygenator problem, hypothermia, high metabolic demand during rewarming, and low venous return. Challenges should ask whether to change flow, oxygenation, hemoglobin, temperature, or mechanical obstruction. Add trends rather than single values so the learner learns trajectory. Link directly to renal injury, lactate, cerebral monitoring, transfusion decisions, and the relevant guide figure/sections.

### 8.4 Valve hemodynamics laboratory

Include the simplified Bernoulli relationship, mean versus peak gradients, the continuity equation, dimensionless index, stroke volume index, pressure half-time caveats, and regurgitation measures at an appropriate educational level. The learner should be able to modify velocity, flow, LVOT diameter/VTI, valve VTI, heart rate, anemia/high-output state, and ventricular function. The interface should demonstrate why gradients are flow dependent and why a small error in LVOT diameter is squared.

Presets should include high-gradient severe AS, low-flow low-gradient AS with reduced EF, paradoxical low-flow AS, high-flow pseudo-severity, prosthesis-patient mismatch, significant AR, primary MR, secondary MR, and a high post-repair mitral gradient at tachycardia. Cases should require the learner to reconcile discordant values and choose the next confirmatory test rather than blindly follow one threshold.

### 8.5 Post-bypass shock cockpit

Replace a static profile comparison with a time-evolving hemodynamic environment. Inputs and displays should include HR/rhythm, arterial pressure, CVP, PAP, PCWP, CO/CI, SVR, PVR, SvO2, lactate, urine output, temperature, ventilation, chest tube output, pacing, and simplified TEE findings. The learner should be able to request information and choose interventions: small volume challenge, vasopressor, inotrope, pulmonary vasodilator, pacing, ventilator adjustment, return to bypass, graft/valve reassessment, chest reopening, or MCS escalation.

Core phenotypes should include hypovolemia, LV failure, RV failure, vasoplegia, tamponade, tension pneumothorax, bleeding, ischemia/graft failure, dynamic LVOT obstruction, residual valve lesion, and mixed states. Some cases should be deliberately mixed because real postoperative shock rarely respects a single textbook box. The debrief must explain which signals were discriminating, which were nonspecific, and how an intervention changed the physiology.

### 8.6 Additional high-value laboratories

After the four core labs are rebuilt, add:

- **IABP timing lab:** inflation/deflation timing errors on arterial waveforms, coronary perfusion, afterload, and contraindications.
- **Temporary pacing lab:** mode, rate, output, sensitivity, AV delay, capture/sensing faults, and rhythm response.
- **TEG/ROTEM lab:** tracing interpretation and targeted therapy, with surgical-versus-coagulopathic bleeding cases.
- **Cardioplegia lab:** delivery route, pressure/flow, redosing, temperature, hypertrophy, AR, coronary obstruction, and inadequate arrest.
- **ECMO/LVAD interaction lab:** preload, afterload, LV distension, differential hypoxemia, venting, suction, and RV failure.
- **Ventilation-heart interaction lab:** PEEP, venous return, RV afterload, oxygenation, tamponade, and extubation readiness.
- **Renal perfusion/fluid lab:** flow/pressure, venous congestion, diuretics, fluid balance, nephrotoxins, and RRT triggers.
- **Valve timing/natural-history lab:** progressive chamber response and the cost of operating too early or too late.

---

## 9. Case and crisis system

### 9.1 Replace linear quizzes with a validated graph engine

Adopt the strongest ideas from the reference case simulator: stages, nodes, choices, consequences, graded quality, endings, and debrief. A cardiac case schema should add clinical time, vital/hemodynamic state, requested data, hidden state, and state transitions. A choice can advance time, change physiology, reveal data, close a rescue route, or modify risk. The engine should remain deterministic enough to validate and teach; it does not need a complex probabilistic simulator.

Each node should belong to a stage such as presentation, initial stabilization, history, examination, investigations, interpretation, operative planning, intervention, reassessment, disposition, or follow-up. Choices should be graded `optimal`, `reasonable`, `suboptimal`, or `harmful`, with an explanation and consequence. Multiple routes may be defensible. Validators must reject unreachable nodes, cycles without an explicit bounded loop, broken endings, empty rationales, missing optimal paths, and route links that do not exist.

The debrief should show a timeline of what the learner saw, chose, delayed, and caused. It should compare the route with one or more expert routes and show decision-specific remediation. Scoring should include recognition, prioritization, physiology, technical planning, communication, and avoidance of harm rather than a single raw total.

### 9.2 Faithful conversion of the four guide integration cases

The first release must include the four guide cases by their recognizable titles and preserve their core sequence and teaching points:

1. **He Looks Fine But the Numbers Are Terrible:** evolving post-CABG tamponade/low-output recognition using trends, rising and converging filling pressures, falling CI, rising SVR, altered drainage, exam, bedside TEE, attending activation, and immediate management.
2. **She's Breathing Fast and Her Kidneys Are Going:** integrate respiratory change, perfusion, renal trajectory, volume status, hemodynamics, investigation, and escalation rather than treating creatinine in isolation.
3. **The Rhythm Keeps Changing:** rhythm recognition, temporary wire assessment, electrolytes, hemodynamic impact, drug/pacing decisions, and progression to a stable plan.
4. **She Was Fine Yesterday:** delayed postoperative deterioration, disciplined reassessment, competing diagnoses, and the danger of anchoring on an initially uncomplicated course.

Each case should link its answer-key concepts to exact guide source IDs. The interactive adaptation may add branches, but it must not erase the original decision points or teaching summary. A "Read original structure" drawer can show the source scenario and answer-key outline in paraphrased, app-native form.

### 9.3 Case bank target

The mature first major release should contain at least 24 cases: six preoperative/Heart Team cases, six intraoperative operative-planning cases, six OR/CPB crises, and six ICU/floor cases. A reasonable roster is:

- left-main disease with competing PCI/CABG considerations;
- diabetes with multivessel disease and conduit planning;
- severe AS with age/lifetime-management tradeoff;
- repairable degenerative MR;
- bicuspid valve with ascending aortopathy;
- endocarditis with embolic/neurologic concerns;
- porcelain aorta CABG strategy;
- small annulus during SAVR;
- failed mitral repair assessment;
- acute type A with malperfusion;
- hostile redo sternotomy;
- severe RV dysfunction before LVAD/valve surgery;
- aortic dissection during cannulation;
- protamine pulmonary hypertensive collapse;
- failure to separate from CPB;
- post-bypass RV failure;
- air embolism/new regional dysfunction;
- massive bleeding with evolving coagulopathy;
- tamponade with suddenly quiet chest tubes;
- vasoplegia versus ventricular failure;
- postoperative AF with instability/anticoagulation decisions;
- pacing failure after valve surgery;
- respiratory failure with RV consequences;
- AKI with congestion and low output.

Each case should contain at least five reachable decision nodes; major cases should contain eight to twelve. Across the bank, every stage and major physiology should be represented. At least one all-optimal path and one reasonable alternative path should exist where clinically defensible. Harmful choices should be plausible errors, not cartoonish distractors.

### 9.4 Crisis-room presentation

The crisis room should feel distinct from ordinary cases: dark monitor surface, time pressure, changing vital strip, audible/visual urgency settings that respect reduced-motion and mute preferences, and concise team prompts. It should not use a fake countdown that punishes accessibility. Time can be represented by decision cost and physiologic deterioration rather than real-world seconds.

Each crisis has a pre-brief explaining what competence is being rehearsed, a cold start, six to ten decisions, an after-action report, and an immediate retry with altered parameters. The after-action report should emphasize recognition triggers, first declaration, first three actions, diagnostics that must not delay rescue, communication language, and post-crisis cleanup.

---

## 10. Visual and interaction overhaul

### 10.1 Design objective

The current dark command-center aesthetic is a good foundation but relies heavily on similar dark bordered rectangles. The next system should feel more dimensional, more visual, and more domain-specific. The goal is not maximal decoration. The goal is to make anatomy, sequence, urgency, evidence, physiology, and progress visually distinct at a glance.

Use gradients as semantic material. Cyan-to-violet can continue to represent learning/progression. Teal-to-blue can represent perfusion/physiology. Magenta-to-red can represent crisis or bleeding. Amber-to-red can represent risk and thresholds. Green-to-cyan can represent successful recovery or stable flow. These gradients should appear in hero bands, section markers, graphs, progress tracks, active states, and selected diagram layers. Text contrast must remain WCAG-compliant.

### 10.2 Page composition

Replace long stacks of same-weight cards with stronger page rhythms:

- full-width illustrated hero areas with a topic-specific schematic or waveform;
- asymmetric bento grids for dashboard entry points;
- section bands with distinct background tints and large numerical anchors;
- sticky reading rail plus a compact progress/minimap;
- edge-to-edge visual canvases for labs and anatomy;
- timeline rails for operations and cases;
- split-screen comparison panels for disease states, trials, or strategies;
- expandable evidence drawers and danger overlays;
- pocket-card and scrub-brief views optimized for fast scanning;
- end-of-section action clusters that connect reading to doing.

The dashboard should show more than feature links. Add today's patient-style mission, a waveform/physiology prompt, due reviews, weakest competency, next operation, case streak, source-coverage progress, and an "on service now" shortcut to pre-rounding/presentation tools. Keep the first screen scannable; deeper metrics belong below.

### 10.3 Operation visual language

Each operation needs a distinctive hero illustration or schematic built from themable SVG. Create a horizontal operation timeline that shows pre-op, access, bypass, repair/revascularization, verification, and ICU. Steps should have action, purpose, danger, and check tabs. Danger anatomy can glow or isolate on the associated diagram. Add instrument/material chips only when useful.

Use visual overlays for cannula position, graft route, valve/root structures, mitral segments, arch zones, cerebral perfusion, and sternal closure. Add "surgeon's view" and "anatomical view" toggles. Every diagram needs alt text, keyboard focus for interactive zones, clear labels, and a non-interactive text equivalent.

### 10.4 Physiology visual language

Labs should resemble clean teaching workstations rather than generic forms. Use a left control/assumption panel, central visualization, right interpretation/challenge panel on wide screens, collapsing into a logical vertical sequence on mobile. Displays should use gridlines, axes, units, legends, baseline overlays, and accessible patterns. Avoid decorative waveforms that look physiologic but encode no data.

Animate transitions between physiologic states, but provide reduced-motion behavior and a pause. Important change should be understandable from numbers and shape even without animation. Add snapshot comparison, reset, shareable preset hash, and "explain this state" buttons.

### 10.5 Case visual language

Cases should display a persistent patient header with postoperative day/procedure, key trends, elapsed clinical time, and current location. Information arrives as chart cards—nurse call, monitor, exam, lab, imaging, operative note—not one giant paragraph. The learner's path becomes a vertical timeline. Optimal, reasonable, and harmful consequences should use icons, borders, language, and color together.

The debrief should be one of the most polished screens in the app: performance radar or grouped bars, decision timeline, missed signals, closed rescue windows, expert route, linked remediation, and a one-sentence "next time" commitment. Avoid gamifying patient harm with celebratory animations.

### 10.6 Typography, spacing, and surfaces

Retain a highly legible sans-serif for body text and a confident display face for headings. Long-form articles need a 65–78 character measure, generous line height, clear paragraph spacing, and heading anchors. Tables need sticky headers on desktop, responsive card transformations or horizontal scroll on mobile, and visible units.

Expand the surface palette beyond `surface` and `surface-2`: add elevated glass, inset control, tinted teaching, tinted danger, monitor black, paper/reading, and diagram canvas surfaces. Shadows should indicate elevation consistently. Borders should become quieter where gradients or tonal separation already provide hierarchy.

### 10.7 Mobile and accessibility requirements

Mobile is not a compressed desktop. The step rail becomes a swipeable section strip; operation diagrams gain a zoomable full-screen view; lab controls sit immediately before the output they change; case vital strips wrap without hiding units; tables expose row headers; and bottom navigation does not cover actions. The app must pass at 320, 390, 768, 1024, and wide desktop viewports without horizontal overflow.

Keyboard navigation, visible focus, semantic headings, landmarks, skip links, accessible names, reduced motion, color contrast, screen-reader announcements for changing lab outputs, and non-color status indicators are release requirements. Interactive SVG zones need button semantics or equivalent controls. Do not make dense content accessible only through hover.

## 11. Learning, assessment, and mastery

### 11.1 Retrieval density

The content expansion must be accompanied by a proportional assessment expansion. A 6,000-word operation followed by five questions still produces weak retrieval. Each flagship operation should have 20–30 questions distributed across foundations, indication, planning, anatomy, sequence, technical judgment, failure/rescue, ICU, and evidence. Question sets should deliberately mix recognition, interpretation, calculation, next-step decisions, and oral defense. Explanations should address why the best distractor is wrong, not merely restate the correct option.

Answer-position balance and longest-answer bias should be validated across every bank and each meaningful subset. Distractors should be plausible within the same clinical frame. Avoid absolute language unless it is the actual point. No question should depend on a hidden institutional preference when multiple approaches are reasonable; either frame the local policy explicitly or accept multiple defensible paths in case mode.

### 11.2 Flashcards

Cards should preserve durable facts and compact decision frames, not fragment every sentence. Each flagship operation should contribute 20–30 cards, with a mix of cloze anatomy, thresholds, sequences, cause-effect pairs, failure patterns, and evidence applications. Cards must link back to the exact section that teaches the answer. When a card is repeatedly missed, the learner should be able to open the relevant paragraph, visual, or lab preset without searching.

The current unified SRS is valuable. Preserve user schedules during data migrations by versioning card IDs and using aliases when text is revised. Do not generate hundreds of near-duplicate cards from the guide. Deduplicate across curriculum, anatomy, surgery, labs, and trials by concept ID.

### 11.3 Viva and oral-board mode

Create a viva engine that presents an opening scenario, listens only if a future optional voice layer is intentionally added, and otherwise lets the learner reveal a model answer in stages. Each prompt should have a crisp opening sentence, required elements, follow-up probes, common weak answers, and an excellent answer. A user should be able to run a five-minute pre-case viva or a 30-minute mixed circuit.

Viva performance is self-assessed with anchored rubrics rather than falsely machine-certified. The rubric should ask whether the learner named the decision, explained mechanism, cited relevant evidence, stated exceptions, and proposed a safe next step. The app may track completion and confidence while clearly separating them from objectively scored questions.

### 11.4 Competency map

Replace a single generic progress percentage with domains: anatomy, physiology, diagnosis/interpretation, indication/evidence, operative sequence, technical danger/rescue, ICU management, and crisis response. Each activity contributes only to domains it actually tests. Reading contributes exposure, not mastery. Time-separated correct retrieval contributes more than same-session completion.

Readiness screens should show evidence: "You have retained 84% of coronary anatomy cards over two intervals," "You missed RV failure in two cases," or "You have not yet narrated CABG." This creates actionable feedback. Avoid labels implying licensure or unsupervised competence.

---

## 12. Engineering and file organization

Split the monolithic advanced data file before expanding it. Recommended structure:

```text
site/js/
  surgery/
    surgery-base.js
    surgery-renderer.js
    surgery-sternotomy.js
    surgery-bypass.js
    surgery-cabg.js
    surgery-savr.js
    surgery-mitral-repair.js
    surgery-type-a.js
    diagrams-foundations.js
    diagrams-coronary.js
    diagrams-valve.js
    diagrams-aorta.js
  physiology/
    physiology-base.js
    physiology-renderer.js
    model-pv.js
    model-do2.js
    model-valve.js
    model-shock.js
    challenges-*.js
  cases/
    cases-base.js
    cases-renderer.js
    cases-guide-integration.js
    cases-preop.js
    cases-or.js
    cases-icu.js
  data/
    source-ledger.js
    concept-registry.js
```

Use stable global registries consistent with the zero-build architecture, but isolate namespaces and validate load order. Create a concept registry so "RV failure," for example, has one concept ID referenced by lessons, operation sections, cards, questions, labs, and cases. This supports cross-linking and prevents inconsistent terminology.

Introduce content schema versions and local-storage migrations. Existing completion, SRS, question statistics, surgery sign-offs, and crisis results must survive. A migration should be idempotent and tested against representative old storage snapshots. New content should not silently mark itself complete because an older short module shared the same operation ID; preserve "reviewed v1" while requiring a v2 depth check.

Keep renderers independent from data and calculation models. Physiology model functions should be pure and unit-tested. Case graph state should be serializable. Diagrams should be registered assets rather than embedded repeatedly. Service-worker caching should version assets so learners do not receive mixed old/new schemas.

---

## 13. Validation and quality gates

The current green validators establish structural health but do not prove depth or source completeness. Add the following gates:

- `validate-source-coverage.js`: all guide units mapped, routes/anchors real, figures and cases represented.
- `validate-surgery-depth.js`: required sections, word floor, step count, step subfields, cards, questions, viva, visuals, references, and links.
- `validate-cases.js`: graph reachability, boundedness, paths, grading, rationales, endings, state transitions, and remediation links.
- `validate-physiology.js`: model metadata, units, ranges, presets, challenge count, cases, assumptions, and pure-function test vectors.
- `validate-medical-style.js`: unsupported absolutes, missing units, vague source labels, duplicate concepts, placeholder prose, malformed HTML, and outdated-review warnings.
- `validate-assessment-quality.js`: answer distribution, duplicate stems, longest-answer bias, option count, explanation presence, concept balance, and difficulty mix.
- `test-routes.js`: every generated route, deep link, anchor, and source destination resolves.
- `test-responsive.js`: critical screens at defined breakpoints with no overflow and accessible controls.

Each validator should print useful censuses, not only pass/fail. For example: words/steps/questions by operation; nodes/branches/endings by case; source completion by module/kind; challenge coverage by lab; answer-position distribution by bank and topic.

Medical quality requires a separate human review layer. Every advanced module needs an author pass, a clinical accuracy pass, a learner-readability pass, and a final source/consistency pass. Review metadata should be stored with the content. Statements likely to change—guidelines, device indications, anticoagulation, transfusion, thresholds—must show review dates and be easy to locate for refresh.

Visual QA requires rendered review, not CSS inspection alone. Capture dashboard, plan, shortest/longest lesson, each surgery hub/article, each lab, a case at multiple stages, cards, quiz, progress, quick reference, light/dark themes, reduced motion, and mobile breakpoints. Check clipping, sticky elements, long tables, focus states, canvas/SVG scaling, and empty/error states.

---

## 14. Phased execution plan

### Phase 0: freeze, inventory, and protect progress

Tag the current validated baseline and record its counts. Add storage fixtures and a migration test. Build the source ledger from all unique guide headings, figures, questions, exercises, takeaways, front matter, orders, and cases. Audit the primer and Anki media. Produce a concept registry and a route map. Completion gate: the ledger exists, all current content is mapped where possible, gaps are visible, and no learner progress is lost.

### Phase 1: content platform and visual primitives

Split `advanced-data.js`, implement typed blocks, expand the surgery schema, create the case graph engine, establish pure lab model contracts, and add the new visual primitives: richer hero, bento grid, timeline, diagram canvas, evidence drawer, scrub brief, case chart card, and debrief timeline. Do not author six giant operations against a moving schema. Completion gate: one exemplar operation, lab, and case render correctly on all breakpoints and validators can reject intentionally broken fixtures.

### Phase 2: CABG vertical slice

CABG is the best proof because it touches anatomy, cath interpretation, indication/evidence, conduits, CPB, cardioplegia, technical steps, flow verification, ICU, trials, and a guide integration case. Expand CABG to the full contract, build its diagrams, add 25–30 cards/questions, connect the coronary and oxygen-delivery labs, and convert Integration Case 1. Conduct medical and learner review. Completion gate: a learner can move from Day 6 to cath planning, full operation, lab, case, viva, and retained cards without dead ends.

### Phase 3: remaining five flagship operations

Expand sternotomy/re-entry and bypass first because all other operations depend on them. Then SAVR and mitral repair, followed by type A dissection. Author shared foundation blocks once and link them; do not paste the same CPB explanation into every article. Each operation passes the full depth gate and visual review before the next is considered complete.

### Phase 4: source-complete curriculum

Work module by module through the ledger. Restore the guide front matter as practical tools, map all figures, convert remaining guide exercises/pimping sets, add the common-orders tool, and convert all four integration cases. Expand underweight lessons based on concept gaps, not word count alone. Completion gate: 100% unique guide coverage with no unresolved high-priority gaps.

### Phase 5: laboratory and case bank expansion

Rebuild the four existing labs to the universal contract, then add pacing, TEG/ROTEM, IABP timing, and cardioplegia labs. Grow the case bank to 24 with balanced settings and physiologies. Add case-specific remediation and competency reporting. Completion gate: every major domain has at least one manipulative lab or branching case and no case is a disguised three-question quiz.

### Phase 6: visual polish, assessment hardening, and release

Complete the dashboard/plan/progress redesign, light/dark parity, mobile optimization, motion/accessibility, content search, quick reference, pocket cards, and service-worker versioning. Run all validators, browser routes, old-storage migration, accessibility checks, and a full manual content sample. Conduct a realistic learner journey: pre-round, prep for CABG, complete the operation, run a lab, manage a case, review cards, and read the debrief.

---

## 15. Definition of done

The elevation is complete only when all of the following are true:

- Every unique component of `cardiac_surgery_guide_v3` is mapped in the ledger to a visible, valid app destination.
- The guide's practical front matter, common orders, all fifteen figures, all four integration cases, module exercises, pimping sets, and takeaways are represented or explicitly consolidated.
- The primer's clinic, consult, rounding, handoff, OR-role, and postoperative workflow material is incorporated into practical tools with provenance.
- The six flagship operations each contain at least 4,500 instructional words, 14–20 meaningful steps, 20–30 cards, 20–30 questions, 12–20 viva prompts, 4–8 visuals, linked cases, and a source trail.
- Operation reading-time and activity counts are calculated honestly.
- The four core physiology labs implement predict–manipulate–observe–explain–apply–debrief, contain explicit assumptions/units, and include scored clinical challenges.
- At least 24 branching cases exist, including faithful interactive versions of the four guide cases; graph validation reports no broken, orphaned, or non-terminating paths.
- The visual system uses richer gradients, diagrams, timelines, comparison surfaces, and domain-specific layouts while maintaining contrast and readability.
- Dashboard, lessons, operations, labs, cases, cards, questions, trials, progress, and practical tools are coherent in light/dark themes and at all target breakpoints.
- Source, surgery, case, physiology, assessment, route, and existing validators all pass with zero errors.
- Answer-position and longest-answer bias checks pass for the complete bank and major subsets.
- Existing learner progress migrates safely and service-worker updates cannot mix schemas.
- A clinical reviewer has signed off the high-risk, threshold-heavy, and management content with a recorded date.
- A learner completing the app is repeatedly required to interpret, predict, choose, narrate, rescue, and retrieve—not merely click through prose.

The final standard is straightforward: a textbook may still contain more total pages, but CardiacSchool should produce more usable learning per hour. It should turn source material into an interconnected rehearsal environment. The learner should finish a section able to explain the mechanism, recognize it in data, apply it to a patient, anticipate the next operative step, and recover the knowledge later. That is the advantage the app must earn.
