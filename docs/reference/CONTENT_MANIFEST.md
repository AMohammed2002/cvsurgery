# CardiacSchool — CONTENT MANIFEST (shared coordination spec)

All content agents MUST follow this manifest exactly so flashcards/questions cross-link to real lesson IDs and days/topics line up. **Read BUILD_GUIDE.md PART 5 (schemas) and PART 18 (authoring rules) before writing.** Primary source: `/tmp/cs_guide.txt` (171-pp guide, 14 modules), supplement `/tmp/cs_primer.txt`.

## Brand
- Name: **CardiacSchool** · Sub: "14-Day Cardiac Surgery Trainer"

## CRITICAL ENGINE CHANGE — lesson-completion gating
Flashcards and questions unlock ONLY when their linked lesson is completed (`st_done`), NOT by calendar day.
- **Every flashcard MUST have a `lesson` field** = a valid lesson id below.
- **Every question MUST have a `lesson` field** = a valid lesson id below.
- Keep the `day` field too (used for plan placement & sorting), but gating is by `lesson`.

## 14-Day Curriculum (mapped to PDF modules)
| Day | Theme | Topic tag | Source module |
|---|---|---|---|
| 1 | Cardiac & Mediastinal Anatomy | Anatomy | M1 |
| 2 | Coronary Physiology & Ischemia | Coronary | M2 |
| 3 | Valvular Pathology & Hemodynamics | Valvular | M3 |
| 4 | Cardiac Imaging & Interpretation | Imaging | M4 |
| 5 | Preoperative Evaluation & Risk | Preop | M5 |
| 6 | CABG: Indications & Evidence | CABG | M6 |
| 7 | Valve Surgery: SAVR/TAVR/Mitral | ValveSurgery | M7 |
| 8 | Aortic Surgery & Pericardial Disease | Aortic | M8 |
| 9 | Mechanical Circulatory Support | MCS | M9 |
| 10 | Cardiopulmonary Bypass & Cardioplegia | CPB | M10 |
| 11 | Hemostasis, Transfusion & Coagulation | Hemostasis | M11 |
| 12 | Pacing & Conduction Disturbances | Pacing | M12 |
| 13 | Cardiac ICU & Postoperative Complications | ICU | M13+M14 |
| 14 | Mock Exam (no lessons) | — | Integration cases |

## Lesson IDs (author exactly these; ord = order within day)
**Day 1 (Anatomy):** d1-chambers (Chambers, Surfaces & Mediastinum) · d1-coronaries (Coronary Arterial Tree & Dominance) · d1-conduction (Conduction System & Cardiac Skeleton) · d1-valves-anat (Valve & Annular Anatomy)
**Day 2 (Coronary):** d2-o2 (Myocardial O2 Supply & Demand) · d2-ischemia (Ischemic Cascade & ACS) · d2-angina (Stable Angina: Workup & Medical Mgmt)
**Day 3 (Valvular):** d3-as (Aortic Stenosis) · d3-ar (Aortic Regurgitation) · d3-ms (Mitral Stenosis) · d3-mr (Mitral Regurgitation) · d3-tr (Tricuspid & Pulmonary Disease)
**Day 4 (Imaging):** d4-echo (Echocardiography Essentials) · d4-cath (Cath & Coronary Angiography) · d4-ct (CXR, CT & Cross-sectional Imaging)
**Day 5 (Preop):** d5-risk (Risk Stratification: STS & EuroSCORE) · d5-optimize (Preoperative Optimization) · d5-heartteam (Frailty, Consent & Heart Team)
**Day 6 (CABG):** d6-indications (CABG Indications & Evidence) · d6-conduits (Conduits: LIMA, Vein, Radial) · d6-technique (On-pump vs Off-pump & Technique)
**Day 7 (ValveSurgery):** d7-savr (Surgical AVR & Prosthesis Choice) · d7-tavr (TAVR & the Heart Team) · d7-mitral (Mitral Repair vs Replacement) · d7-prosthetics (Prosthetic Valves & Anticoagulation)
**Day 8 (Aortic):** d8-aneurysm (Thoracic Aortic Aneurysm & Root) · d8-dissection (Acute Aortic Dissection) · d8-pericardium (Pericardial Disease: Tamponade & Constriction)
**Day 9 (MCS):** d9-iabp (IABP & Temporary Support) · d9-ecmo (ECMO: VA & VV) · d9-vad (Durable LVAD & Transplant)
**Day 10 (CPB):** d10-circuit (The CPB Circuit & Cannulation) · d10-cardioplegia (Myocardial Protection & Cardioplegia) · d10-weaning (Going On & Coming Off Bypass)
**Day 11 (Hemostasis):** d11-coag (Coagulation, Heparin & Protamine) · d11-bleeding (Post-op Bleeding & Transfusion) · d11-reexplore (Re-exploration & Surgical Bleeding)
**Day 12 (Pacing):** d12-af (Postoperative AF & Arrhythmias) · d12-pacing (Temporary Epicardial Pacing) · d12-block (Conduction Blocks & Permanent Pacing)
**Day 13 (ICU):** d13-lcos (Cardiac ICU: Hemodynamics & Low-Output Syndrome) · d13-vaso (Inotropes, Vasopressors & Weaning) · d13-complications (Postoperative Complications & Orders)

Total: 43 lessons. Each lesson: 12–21 chunks, mechanism-first prose, checkpoint every 2–4 chunks (0-based `answer` + `explain`).

## POD MODEL — one file per day, self-initialising (order-independent)
Each day N has THREE files in `site/js/data/`:
- `lessons-dN.js`  — starts with `window.LESSONS = window.LESSONS || {};` then assigns each lesson by id.
- `flashcards-dN.js` — starts with `window.FLASHCARDS = window.FLASHCARDS || [];` then `window.FLASHCARDS.push( ...cards );`
- `questions-dN.js` — starts with `window.QUESTIONS = window.QUESTIONS || [];` then `window.QUESTIONS.push( ...questions );`
A "pod" agent owns a set of days and writes all three files for each of its days, so flashcards/questions cross-link to lesson ids it just authored.

## Flashcards (~6–9 per lesson, ~300 total)
id format `fc-dN-NN` (e.g. fc-d1-01). Each card: {id, day:N, lesson:"<lesson id>", topic:"<topic tag>", front:"HTML", back:"HTML"}. EVERY card MUST have a valid `lesson`.

## Questions (~5–6 per lesson, ~235 total)
id format `q-dN-NN`. Each: {id, day:N, lesson:"<lesson id>", topic:"<topic tag>", stem:"HTML vignette", options:[3–5 strings], answer:<0-based int>, explain:"HTML teaching text"}. EVERY question MUST have a valid `lesson`. Exam-style single-best-answer vignettes.

## Exercises (~13) — `exercises.js` window.EXERCISES=[...]
Order builders (≥4 steps): scrubbing/gowning, going on bypass, coming off bypass, CABG operative sequence, sternotomy closure, tamponade response, massive transfusion. Label drills (zones must match data-zone in window.DG): coronary tree, cardiac chambers, CPB circuit, aortic root, mediastinum.

## Diagrams (`diagrams.js`, window.DG={}) — theme-aware SVGs with data-zone
Required keys referenced by exercises/lessons: coronaries, chambers, cpbcircuit, aorticroot, mediastinum, conduction. Use var(--fg)/var(--primary)/var(--secondary). No backticks/${ inside.

## Anatomy module (isolated) — from /tmp/anatomy_cloze_dump.txt (124 cloze) + prose regions
Categories: coronary, chambers, valves, conduction, great-vessels, mediastinum. Region schema + cloze card schema per BUILD_GUIDE PART 14 & OPTIONAL MODULE A.

## Trials module (isolated) — landmark cardiac trials
CABG/PCI: SYNTAX, FREEDOM, EXCEL, NOBLE, STICH, ART, ROOBY/ROOBY-FS. Valve: PARTNER 1/2/3, SURTAVI, EVEREST II, COAPT, AVATAR/RECOVERY (AS). Each: question/design/population/intervention/comparator/outcome/bottomLine/pearls/citation + 2–3 self-test MCQs (0-based answer).

## AUTHORING RULES (non-negotiable, from PART 18)
1. NEVER put a backtick or `${` inside html/front/back content.
2. Real HTML only (`<b>`,`<ul><li>`,`<table>`,`<p>`), no markdown.
3. Balanced tags.
4. Teaching chunks lead with 1–2 narrative `<p>` before any list/table/kbox.
5. kbox classes: `kbox mnemonic|pearl|danger|study`, each opens with `<div class="kbox-tag">Label</div>`.
6. 0-based answer indices everywhere; always include explain.
7. Unique ids across all files.
8. Medical accuracy from the PDF; do not invent statistics.
