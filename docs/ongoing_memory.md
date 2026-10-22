# CardiacSchool — Ongoing Build Memory

## 2026-08-03 — Cox-Maze operative article added + made Day 12's core operation

Added the **13th standalone Surgeries article**: `site/js/surgery/surgery-maze.js` (`id: "maze"`), grounded in *Key Questions in Cardiac Surgery* Chapter 19 (Arrhythmia surgery, pp. 520–532) decoded from `build_assets/key_questions.txt`.

- **New hub category `rhythm`** ("Arrhythmia Surgery") in `surgery-base.js` — categories are fully data-driven, so no CSS or `surgery.js` change was needed.
- **Content:** 7 blocks (atrial anatomy for the lesion set · triggers/substrate/two mechanisms · CHA2DS2-VASc + HAS-BLED + indications · the Cox-Maze lesion set a–j · energy sources · the left atrial appendage · complications/outcomes/flutter), **18 operative steps**, **26 MCQs**, **24 cloze cards**, plus **21 `sxcomp-maze-*` comprehensive cards** (3 per block) in `cards-comprehensive.js`.
- **Source numbers carried:** AF 300–500 bpm; 30% CO loss; RF 350 kHz–1 MHz / 70–80 °C / 1 min / 3–6 mm; cryo N2O −60 °C / 2 min / iceball; cryo (not RF) for AV-groove lesions; surgical 75–80% vs catheter 60%; LA >5 cm and AF >5 y predict failure; LAA holds thrombus in up to 90% of AF strokes; internal suture exclusion incomplete in up to 50%; stump <1 cm; **LAAOS III** 4770 pts, 4.8% vs 7.0% at 3.8 y; cavotricuspid isthmus for flutter.
- **Images (8, all pre-existing assets):** 5 new `surface: "surgery" / targetId: "maze"` placements — `ch01_fig8`+`ch01_fig9` (block:01), `ch19_fig1`+`ch19_fig3` (block:02), `ch19_fig4` parts 1&2 = the left/right lesion sets (block:04), `ch19_fig2` cryo iceball (block:05), `ch19_fig5` flutter isthmus (block:07). Required adding **`maze: 7` to `SURGERY_BLOCKS`** in `validate-image-placements.js` (hardcoded map — any new op must be registered there or its placements are rejected) and a `d("surgery","maze")` destination on Chapter-19 crosswalk row 21.
- **Connected circuit — Day 12** (`day-ecosystem.js`): the surgery station moved from `savr` (a duplicate of Day 4's) to **`maze`**, matching the day's theme ("Pacing & Conduction Disturbances — Postoperative AF…") and its conduction-anatomy station. To keep the Day 12 Crisis Room (post-SAVR complete heart block) supported, `surgery-savr.js` gained **`linkedDays: [12]`**, so the SAVR deck stays on Day 12 under "Additional connected learning". Day 12 now: 169 unique cards from 10 sources. The `/5` core-station contract is untouched.
- **Gates:** 23 of 29 validators/tests PASS, unchanged from the pre-existing baseline. The 6 that were already red stayed red with **no new error classes**: depth 11, new-card-quality 29, release 430, retrieval-cards 1 unchanged; `validate-card-catalog` 354→372 and `validate-comprehensive-cards` 199→217, both **+18 identical "missing a card for step:NN" errors**. ⚠ That rule is stale, not a content defect: `cards-comprehensive.js` states per-operative-step cards "were removed by request", and the rule already fires for **all 13 operations** (215 total = 197 pre-existing + 18 maze). Fixing those two validators (they also hardcode 781/512 surgery-card totals against an actual 605/336) remains open backlog.

## 2026-07-12 — "Key Questions in Cardiac Surgery" (2nd ed.) gap-fill pass — content merged into existing lessons

Went through the full 666-page *Key Questions in Cardiac Surgery* PDF (24 chapters) and added everything not already in the app to **existing** lessons/flashcards (no new lessons, per directive). Same merge pattern as the v3-guide pass.

- **PDF decode gotcha (reusable):** the book's body text is rendered in a symbol font, so `PyMuPDF get_text()` returns a **uniform +29 ASCII Caesar cipher** (spaces→`=`, digits/upper/punct shift into ASCII, lowercase b–z show as accented glyphs `Ä Å Ç É…`, `a`→`~`). Decoder in scratchpad: map the accented lowercase set + `chr(ord(c)-29)` for chars in ASCII 61–119; treat a line as ciphered if it has ≥2 accented glyphs. Decoded chapters + `questions_index.txt` are in the session scratchpad.
- **Coverage method:** decoded all chapters, extracted the 233 question headers as a topic index, then grep-scanned the app for each candidate topic. App was already comprehensive (built from the v3 guide) — only genuine 0-hit / thin topics were added. Confirmed non-gaps by multi-pass term grep (DHCA/ACP-RCP, del Nido/Buckberg, alpha/pH-stat, Gorlin, PISA, CHA2DS2, Marfan, radial-harvest nerves, Swan values all already present). Deliberately did NOT add Wells/Geneva PE scores or MI Universal Types 1–5 — **this book doesn't use them** (stayed faithful to source).
- **Net-new content added (10 lesson chunks + 17 flashcards; questions untouched to keep the exact-35/day + slot-balance gates green):**
  - **Infective endocarditis (Ch15)** → Day 4 `d3-mr` (4 chunks: classification/microbiology incl. HACEK, modified Duke criteria + TTE/TOE sensitivities, antibiotics, level-4 surgical-indication/timing/outcomes/prophylaxis) + `flashcards-d3` fc-d3-19…23. Was only mentioned in passing before; no Duke/HACEK/surgical-indication content existed.
  - **Cardiac tumours + cardiac trauma (Ch20)** → Day 9 `d8-pericardium` (Cardiac Tumours: myxoma/Carney/fibroelastoma/angiosarcoma; Cardiac Trauma: blunt/penetrating/Beck's/resuscitative thoracotomy/traumatic aortic isthmus rupture) + `flashcards-d8` fc-d8-19…22. Fibroelastoma & trauma were 0-hit.
  - **Acute pulmonary embolism (Ch21)** → Day 10 `d9-ecmo` (massive/submassive/low-risk classification, path, thrombolysis vs surgical embolectomy indications & principles, ECG/echo clues) + `flashcards-d9` fc-d9-27/28.
  - **ASA + airway (Ch22)** → Day 6 `d5-risk` (ASA I–V, Mallampati vs Cormack–Lehane) + fc-d5-24/25. All 0-hit.
  - **Biostatistics primer (Ch24)** → Day 6 `d5-heartteam` (PICO, study designs, RCT/blinding/ITT, power/type I-II, p/CI, OR/RR/HR/NNT, KM, sens/spec/PPV/NPV, parametric vs non-parametric, VLAD/funnel) + fc-d5-26/27/28. PICO/non-inferiority were 0-hit.
  - **CCS angina classification (Ch17)** → Day 3 `d2-angina` (CCS I–IV) + fc-d2-28. Was 0-hit.
- **Gates:** all 8 validators exit 0 (validate 0 err — 44 lessons / 490 q; assessment-quality PASS; depth 14/14; anatomy/trials/advanced/surgery/physiology 0). All edited files `node --check` clean; no duplicate flashcard ids; every new card gated to a valid lesson/day. Bumped `sw.js` CACHE → `cardiac-school-v11-keyquestions` (SW is network-first, so online users get fresh data regardless).
- **One self-corrected slip:** an errant Edit briefly renamed existing `fc-d2-27`; reverted in the same turn and verified the id is intact/unique.

## 2026-07-12 — Viva Circuit built (Seq-5 task 2 — the standalone "defend three levels deep" UI)

Built the dedicated viva-circuit route that Seq-5 flagged as NOT done. This closes Seq-5 task 2; task 3 (image/calc/operation-narration stations) and task 6 (human L5 sign-off) remain.

- **`js/data/viva.js`** — new self-initializing data bank `window.VIVA` (14 cases, one per day, 42 beats). Each case = a clinical stem + 3 escalating beats: **Mechanism → Evidence → Exception**, each with a model answer that IS the self-grading yardstick. Content drawn from the L5 viva summits already authored/verified in Seq-2/3/4 (e.g. Day 7 = FREEDOM/EXCEL-NOBLE at design level + porcelain-aorta anaortic rescue; Day 9 = type-A malperfusion static-vs-dynamic; Day 13/14 = LCOS-vs-tamponade "mechanical problem needs a mechanical solution"). No new figures introduced — reuses verified VERIFY_QUEUE numbers.
- **`js/app.js`** — added: `vivaUnlocked(day)` (gates each day's viva behind that day's lessons being in `st_`/`cs_` done; Day 14 capstone unlocks when all 13 others do — consistent with the app's lesson-gating philosophy); `viewViva()` hub with per-case locked/attempted/defended badges, a "defence log" readiness card (per-level Mechanism/Evidence/Exception self-grade bars via `vivaReadinessHTML`), and a "Run full circuit" shuffle; the player `viewVivaCase`/`renderVivaBeat` (reveal-then-self-grade, 3-way grade 😬/🤔/✅) and `vivaComplete` (XP 60/40, confetti ≥75%, persists to `vivastats`). Wired NAV entry (`#/viva`, grad icon, between Interactive and Anatomy Review) + route branches. `vivaStats/recordViva/vivaScore` store helpers.
- **CSS** — appended `.viva-*` block to `css/style.css` (stem card, level chips lv-0/1/2 cyan→violet→danger, model-answer box, grade buttons, readiness bars). Reuses existing `.chunk/.task/.pill/.bar/.player-top` idiom.
- **Cache** — bumped `index.html` app.js `?v=8-cloze`→`?v=9-viva`, added `viva.js` script tag; `sw.js` CACHE→`v9-viva` + added viva.js to CORE precache; sw registration `?v=6-layout`→`?v=9-viva`. (SW is network-first so online users get fresh assets regardless.)
- **Verification** — all validators still green (validate.js 0 err + assessment PASS, validate-depth 14/14 ✓, anatomy/trials/advanced 0). Data-integrity self-check PASS (14 cases/42 beats, level order + non-trivial model answers). **End-to-end headless-Chrome (CDP) smoke test PASS**: nav entry present; Day-1 viva correctly locked with 0 lessons done, unlocks after its 4 lessons marked done; hub renders 14 rows + locked-dimming + circuit button; player walks all 3 beats with reveal + 3 grade buttons; completion shows defended/celebrate and persists score=1.0; revisiting hub shows defended badge + readiness bars.

**NEXT (still open from Seq-5):** task 3 image/calc/operation-narration stations; task 6 clinician sign-off of every day's L5 layer against the Part-1 yardstick.

## 2026-07-12 — Sequence 5 COMPLETE (Day 14 assessment + cross-day certification) — **14/14 depth ✓**

Built Sequence 5 (integration, assessment, PGY-5 certification). All 14 days now pass `validate-depth.js` (exit 0) and the flagged Day-4 evidence caveat is closed. Every content + harness validator exits 0.

- **Day 14 written-capstone re-weight (Seq-5 task 4)** — `questions-d14.js`: added `kinds`/`levels` maps and applied them in the generation IIFE (answer order untouched). **18 of 35** mock-exam questions now tagged `level>=4` (floor is 15): rows 0,1,3,4,5,7,8,9,10,15,16,19,22,23,29,31,34 → operative-step ×1, complication-rescue ×12, when-not-to ×2, reconcile-discordant ×3; L5 on the residual-MR/dissection/SAM/graft/PVL/AR/tamponade beats. Depth Day 14: wNot 2 / resc 12 / oper 1 / **l45=18** ✓.
- **Day-4 evidence gap FIXED (was the standing Seq-4 caveat)** — converted `q-d4-26` (a pure Carpentier-IIIb recall card, ans=0) **in place** into a COAPT-vs-MITRA-FR **evidence-kind L5** question, answer index preserved (slot balance intact), with a full `evidence{population,endpoint,effect,limitation,source}` object. A distractor is the longest option so uniquely-longest stays 34.3% (<35%). Day 4 depth: evidence 0→1 ✓; assessment-quality still PASS.
- **Four integration cases (Seq-5 task 1)** — authored into `js/advanced/advanced-data.js` `D.crises` as branched cases reusing the existing beat engine (zero engine rewrite): `ic-looks-fine` ("He Looks Fine But the Numbers Are Terrible" — occult localized tamponade, reopen-before-arrest), `ic-breathing-kidneys` ("She's Breathing Fast and Her Kidneys Are Going" — failed mitral repair → cardiorenal, back to OR), `ic-rhythm` ("The Rhythm Keeps Changing" — unstable AF→CHB, DDD vs VVI, PPM window), `ic-fine-yesterday` ("She Was Fine Yesterday" — territory-specific graft failure → revise). 4 beats each, options run optimal→harmful, `why` links each error to the repairing day/ladder. `crisis simulations: 7`, validate-advanced 0.
- **Crisis Room + Day-14 wiring** — `advanced.js`: split `renderCrisisHub` into "Crisis Room" (3 OR crises, CR-##/red) and "Day 14 · Integration Cases" (4 cases, IC-##/cyan); guarded the hardcoded OR vitals-strip so integration cases show a neutral "Integration" chip, not protamine numbers. `app.js` viewDashboard: Day-14 task list now surfaces the 4 integration cases (link `#/crisis/<id>`, +70 XP each) above the mock exam.
- **Multi-dimensional readiness reporting (Seq-5 task 5)** — `app.js renderExamResults`: added `examDimension(q)` + `EXAM_DIMS`; results now show a "Readiness by competency" card (Core knowledge / Interpretation & evidence / Operative sequencing / Judgment when-not-to / Crisis recognition & rescue) derived from question `kind`, alongside the existing by-topic breakdown. So a learner strong on facts but weak in crises is now visible.
- **Harness fix** — `validate-depth.js` KIND_ENUM did not include `"cloze"`; the Seq-5 capstone deck `flashcards-d14.js` (20 unlock-after-exam cloze cards, built by the parallel process) tripped 20 false-positive structural errors. Added `cloze` as a recognized non-decision card kind (counts toward no floor). Depth now exits 0 clean.
- **Gates (all green, exit 0):** validate (0 err; 43 lessons, **323 fc**, 490 q, 35/day), validate-anatomy/trials/advanced/surgery/physiology/assessment-quality all 0/PASS, validate-depth **14/14 ✓** + `--selftest` PASS, scan-verify covered (**30 rows**, added row 30 for the COAPT/MITRA-FR figures, status `sourced`). All edited JS `node --check` clean.
- **NOT done (needs browser + product decision, flagged):** a dedicated viva-circuit route and image/calc/operation-narration stations (Seq-5 tasks 2–3) were not built as new UI — the viva prompts live in the lesson L5 chunks and the mock exam now carries the L4/L5 decision weight, but a standalone rapid-fire "defend three levels deep" screen and the station drills remain. Task 6's human medical-review sign-off of every day's L5 layer is also still pending (the structural gate passes; a clinician still owns the yardstick pass).

## 2026-07-12 — Sequence 4 COMPLETE (Days 10–13 built) — MERGED into existing lessons

Finished Sequence 4 (support / hemostasis / rhythm / critical care). Days 10–13 now flip `validate-depth.js` to ✓ → **Days passing 12/14** (Days 1–3, 5–13 ✓; Day 4 fails on evidence — see caveat; Day 14 = Seq-5 mock exam, untouched). Same merge pattern as Days 1–9: L4/L5 chunks appended into EXISTING topic-lessons via `.chunks.push`; four-part quant added as new flashcards; questions tagged **in place** (answer indices untouched, so assessment-quality stays PASS).

File mapping (legacy numbering): Day 10 = lessons-d9.js + flashcards-d9.js + questions-d10.js; Day 11 = lessons-d11/flashcards-d11/questions-d11; Day 12 = lessons-d12/flashcards-d12/questions-d12; Day 13 = lessons-d13/flashcards-d13/questions-d13.

- **Day 10 (MCS)** — lessons-d9.js: +1×L4 on d9-ecmo (device-to-failure-mode match; VA-ECMO afterload paradox/venting; north-south; distal-perfusion cannula) +1×L5 on d9-vad (one-rung-at-a-time escalation ladder with triggers; distending-LV venting order ECpella→IABP→septostomy→surgical vent; post-LVAD RV failure). flashcards-d9: +fc-d9-25 (IABP ~0.5–1.0 L/min four-part) +fc-d9-26 (VA-ECMO 3–6 L/min + distension four-part). questions-d10 tagged: q-d10-02 **when-not-to** L4 (IABP in AR); q-d10-03 **evidence** L4 (IABP-SHOCK II dossier); q-d10-04 & q-d10-09 **complication-rescue** L4/L5. Depth L4 1/L5 1/wNot 1/resc 2/q4 2/evid 1. ✓
- **Day 11 (Hemostasis)** — lessons-d11.js: +1×L4 on d11-bleeding (product-off-the-tracing TEG/ROTEM; surgical-vs-coagulopathic + rate-based re-exploration triggers; bloodless plan) +1×L5 on d11-coag (evolving bleeding chest; Type III protamine ordered algorithm stop→support RV→iNO→back-on-bypass). flashcards-d11: +fc-d11-22 (protamine 1 mg/100 U four-part), +fc-d11-23 (re-exploration thresholds four-part), +fc-d11-24 (fibrinogen >1.5–2 g/L four-part). questions-d11 tagged: q-d11-04 **complication-rescue** L5 (protamine Type III); q-d11-21 **complication-rescue** L4 (clotted-tube tamponade); q-d11-28 **when-not-to** L5 (empiric PCC → thrombosis). Depth L4 1/L5 1/wNot 1/resc 2/q4 3. ✓
- **Day 12 (Pacing)** — lessons-d12.js: +1×L4 on d12-pacing (program-to-the-fault: capture/sensing/oversensing/CHB→DDD; mV sensitivity direction; block-after-valve anatomy + 5–7 d window) +1×L5 on d12-block (why VVI kills the stiff post-AVR LV → DDD; non-recovery predictors persistent CHB/new LBBB+HV>70 ms; torsades overdrive pacing). flashcards-d12: +fc-d12-22 (PPM 5–7 d window four-part), +fc-d12-23 (output 2–3× threshold four-part). questions-d12 tagged via IIFE kinds/levels maps (idx 22/25/27 = q-d12-23 rescue, q-d12-26 when-not-to, q-d12-28 dosed-algorithm). Depth L4 1/L5 1/wNot 1/resc 2/q4 2. ✓
- **Day 13 (ICU)** — lessons-d13.js: +1×L4 on d13-vaso (ordered LCOS algorithm; vasoplegia ladder by mechanism norepi→vaso 0.03–0.04→MB 1.5–2 mg/kg→hydroxocobalamin 5 g→AT-II) +1×L5 on d13-lcos (mixed post-op shock discriminators; TTE misses posterior clot; reopen-at-bedside-before-arrest timing vs mechanical support). flashcards-d13: +fc-d13-27 (LCOS CI<2.0–2.2 four-part), +fc-d13-28 (vasoplegia ladder doses four-part), +fc-d13-29 (SvO₂<60% four-part). questions-d13 tagged via IIFE kinds/levels maps (idx 2/3/11/26 = q-d13-03 & 04 complication-rescue, q-d13-12 dosed-algorithm, q-d13-27 when-not-to). Depth L4 1/L5 1/wNot 1/resc 3/q4 3. ✓
- **Figures** web-verified: MOMENTUM 3 (76.9 vs 64.8% 2-y primary; 82.8 vs 76.2% survival); ATHOS-3 post-hoc + vasopressin 0.03 U/min. IABP-SHOCK II / protamine / re-exploration / PPM-window / vasoplegia doses cited to guidelines. Logged VERIFY_QUEUE rows **24–29** (status `sourced`).
- **Gates (all green):** validate.js 0 err (43 lessons, **323 flashcards**, 490 questions); validate-depth Days 10–13 ✓ (12/14); assessment-quality PASS (35/day preserved, indices untouched); anatomy/trials/advanced/surgery/physiology all 0; depth --selftest passes. All edited files `node --check` clean. NOTE: question files were reformatted by an external linter mid-session — my level/kind/evidence tags survived; re-validated after.
- **CAVEAT — Day 4 (Valvular, Seq-2 scope) regressed to ✗ on `evidence 0/1`, NOT caused by this work.** Day 4 = questions-d4.js (untouched by me; observed externally modified at 06:22). It has zero evidence-kind questions and no natural trial question to tag honestly; the fix is a proper COAPT/MITRA-FR evidence item — deferred as Seq-2 scope, flagged for user.
- **NEXT:** Sequence 5 (Day 14 mock-exam L4/L5 re-weight to ≥15 L4/L5 questions + integration) and resolve the Day-4 evidence gap.

## 2026-07-12 — Sequence 3 COMPLETE (Days 8 & 9 built) — MERGED into existing lessons

Finished the remainder of Sequence 3 (the decision/operative layer). Days 8 & 9 now flip `validate-depth.js` to ✓ → **Days passing 9/14** (Days 1–9 all ✓; Days 10–14 remain, they are Sequences 4–5). Same merge pattern as Days 1–7: L4/L5 chunks appended into the EXISTING topic-lessons via `.chunks.push`, questions tagged **in place** (no option/answer-index changes, so slot balance/longest-answer ratios untouched), and four-part quant added as new (uncounted) flashcards.

File mapping (mixed legacy numbering): Day 8 content = lessons-d7.js + flashcards-d7.js + questions-d8.js; Day 9 = lessons-d8.js + flashcards-d8.js + questions-d9.js.

- **Day 8 (Valve Surgery: SAVR, Mitral & Tricuspid)** — lessons-d7.js: +2×L4 (SAVR step-by-step with the hazard-per-step: decal→LVOT/curtain, conduction-axis nadir NCC/RCC, ostial protection, sizing/PPM, de-airing; systematic segmental mitral repair + circumflex-at-P1 + saline/TEE test) + 2×L5 (small-annulus/valve-larger-than-root decision tree Nicks/Manouguian/Konno; valve-conference + post-repair **SAM rescue** fill-constrict-slow-then-revise). flashcards-d7.js: +4 (fc-d7-33 PPM EOAi 0.85/0.65 four-part; fc-d7-34 mechanical-INR-by-position four-part; fc-d7-35 primary-MR LVEF≤60/LVESD≥40 four-part + EF-illusion; fc-d7-36 SAM rescue). questions-d8.js tagged: q-d8-11 **when-not-to** L5 (don't send the 58-y-old to TAVR on durability gap); q-d8-12 & q-d8-14 **evidence** (PARTNER 1B, PARTNER 3 dossiers); q-d8-19 & q-d8-24 **operative-step** (annuloplasty/circumflex); q-d8-22 **complication-rescue** L5 (SAM order). Depth: L4 2, L5 2, wNot 1, resc 1, q4 3, evid 2, oper 2. ✓
- **Day 9 (Aortic & Pericardial)** — lessons-d8.js: +1×L4 (type-A operative strategy: antegrade true-lumen cannulation axillary/central vs femoral-fallback, ACP + moderate hypothermia, hemiarch vs total-arch/FET by tear, resuspend-vs-Bentall root) + 1×L5 (the 2 a.m. type-A run + surprises: dynamic-vs-static malperfusion after proximal repair, RCA button/SVG, coagulopathic bleeding, new neuro deficit) + 1×L4 (constriction-vs-restriction discriminators e′/interdependence → pericardiectomy). flashcards-d8.js: +2 four-part quant (fc-d8-17 ascending 5.5 / 5.0–4.5 aortopathy thresholds; fc-d8-18 type-A ~1–2%/hr mortality). questions-d9.js tagged: q-d9-13 **when-not-to** L5 (don't drain the type-A tamponade — operate); q-d9-15 **evidence** (IRAD dossier); q-d9-31 **operative-step** L4 (Bentall coronary button); q-d9-26 **complication-rescue** L5 (loculated post-op tamponade → re-exploration). Depth: L4 2, L5 1, wNot 1, resc 1, q4 2, evid 1, oper 1. ✓
- **Figures** sourced to current guidelines/registries (2020 VHD, 2022 Aortic, IRAD, PARTNER 1B/3, RE-ALIGN, PROACT); logged VERIFY_QUEUE rows **18–23** (status `sourced`); scan-verify reconciled (23 rows, marker count covered).
- **Gates (all green):** validate.js 0 err (43 lessons, **313 flashcards**, 490 questions); validate-depth Days 1–9 ✓; validate-assessment-quality PASS (unchanged — questions tagged in place); anatomy/trials/advanced/surgery/physiology all 0. All 6 edited files `node --check` clean.
- **NEXT:** Sequence 4 (Days 10–13 MCS/Hemostasis/Pacing/ICU) then Sequence 5 (Day 14 mock exam L4/L5 re-weight + integration). Days 10–14 still fail depth as expected (untouched).

## 2026-07-12 — Sequence 3 (Days 6 & 7 only) PGY-5 build — MERGED into existing lessons

Per user: continue Seq-3 for Day 6 and Day 7 only, med-student→PGY-5 climb, same merge pattern as Days 1–5 (L4/L5 chunks appended into the EXISTING topic-lessons, not standalone lessons). Both days now flip `validate-depth.js` to ✓ (Days passing 7/14).

- **Day 6 (Preop & Risk)** — lessons-d5.js (day 6): appended 2×L4 + 2×L5 chunks (quantify-risk-two-ways + modifiable ledger; porcelain-aorta/hostile-chest "the low score that lies"; frailty-and-futility redirect; mechanical-vs-tissue shared decision + when-not-to-operate). flashcards-d5.js: +2 four-part quant cards (fc-d5-22 STS-PROM strata; fc-d5-23 mech<50/tissue>65 age bands). questions-d6.js: q-d6-04 rewritten → porcelain-aorta→TAVR **when-not-to** L5; q-d6-05 rewritten → EuroSCORE-II-calibration **evidence** dossier; q-d6-35 tagged when-not-to L5. Depth: L4 2, L5 2, wNot 2, q4 2, evid 1. ✓
- **Day 7 (CABG)** — lessons-d6.js (day 7): appended 1×L4 (reading the coronary map / conduit-to-target / competitive-flow / inflow strategy / TTFM numbers) + 2×L5 (CABG-vs-PCI at trial-design level; intra-op surprises + rescues). flashcards-d6.js: +2 four-part quant (fc-d6-22 LIMA-LAD >90%@10y; fc-d6-23 transit-time flow/PI). questions-d7.js: q-d7-01 → FREEDOM **evidence** L5; q-d7-09 → EXCEL/NOBLE **evidence** L5; q-d7-22 → competitive-flow **when-not-to** L4; q-d7-25 & q-d7-31 → **operative-step** L4/L5; q-d7-30 & q-d7-14 → **complication-rescue** L5. Depth: L4 1, L5 2, wNot 1, resc 2, q4 2, evid 2, oper 2. ✓
- **Assessment-quality FIXED for Days 6–7** (was FAIL): q-d7-06 unescaped `< 22` in explain → "below 22"; uniquely-longest-correct dropped from 45.7%→**31.4%** each day (11/35) by rebalancing option lengths without touching answer indices (slot balance/runs preserved). `validate-assessment-quality.js` now **PASS** globally.
- **Figures web-verified** (WebSearch): FREEDOM 26.6 vs 18.7% (ARR 7.9%, stroke↑ CABG, mortality benefit y4–5); EXCEL 5-y mortality 9.9 CABG vs 13.0 PCI + SCAI/CK-MB MI-definition controversy; NOBLE ~19 vs 28% MACCE; 2020 ACC/AHA prosthesis age bands (mech<50/tissue>65/shared 50–65, SAVR<65/TAVR>80); EuroSCORE-I over-prediction. Logged VERIFY_QUEUE rows **13–17** (status `sourced`); scan-verify reconciled (17 rows, marker count covered).
- **Gates:** validate.js 0 err (43 lessons, 307 flashcards, 490 questions); validate-depth Days 1–7 ✓ (7/14); assessment-quality PASS; anatomy/trials/advanced/surgery/physiology all 0. All 6 edited files `node --check` clean.
- **NEXT:** Days 8–9 (rest of Sequence 3), then Sequences 4–5. Days 8–14 still fail depth as expected (untouched).



**Manager:** Claude Opus 4.8 (orchestrator)
**Agents:** Sonnet only (per directive). Each reports progress; manager logs here.
**Started:** 2026-06-15
**Goal:** Rebuild ScalpelSchool as a 14-Day Cardiac Surgery Trainer (zero-build static site) with lesson-completion gating of flashcards & MCQs.

---

## Build Status Board

| Workstream | Owner | Status | Notes |
|---|---|---|---|
| Engine extraction (13 files, byte-exact via script) | Manager | ✅ DONE | All node --check pass |
| Lesson-completion gating mod (app.js + validator) | Manager | ✅ DONE | unlockedCards/unlockedQuestions require st_done[lesson]; quiz menu+routes+exam gated; lesson field now mandatory |
| curriculum.js | Manager | ✅ DONE | 14 days mapped to PDF modules |
| index.html rebrand + per-day script wiring | Manager | ✅ DONE | CardiacSchool + heart logo; lessons/flashcards/questions per day |
| Pod A — D1 Anatomy + D2 Coronary (lessons+cards+Qs) | Sonnet | LAUNCHING | src lines 274–831 |
| Pod B — D3 Valvular + D4 Imaging | Sonnet | LAUNCHING | src 832–1409 |
| Pod C — D5 Preop + D6 CABG + D7 ValveSurg | Sonnet | LAUNCHING | src 1410–2113 |
| Pod D — D8 Aortic + D9 MCS + D10 CPB | Sonnet | LAUNCHING | src 2114–3222 |
| Pod E — D11 Hemostasis + D12 Pacing + D13 ICU/Complics | Sonnet | LAUNCHING | src 3223–5320 |
| Agent X — diagrams.js + exercises.js | Sonnet | ✅ DONE | 6 DG svgs (coronaries/chambers/cpbcircuit/aorticroot/mediastinum/conduction), 14 exercises (9 order+5 label); 0 zone/parse errors |
| Agent Anat — anatomy module (regions + 124 cloze) | Sonnet | LAUNCHING | from /tmp/anatomy_cloze_dump.txt |
| Agent Trials — trials module | Sonnet | LAUNCHING | SYNTAX/FREEDOM/EXCEL/PARTNER/STICH... |
| Pods A–E (lessons+cards+Qs) | Sonnet | ⚠ PARTIAL (session limit) | 37 lessons (11 days), 80 cards (7 days), 38 Qs (6 days). Missing: lessons d10/d13; flashcards d2,4,7,9,10,13; questions d2,4,7,9,10,12,13 |
| Agent Anat — anatomy module | Sonnet | ✅ DONE | 23 regions; cloze deck salvaged by manager (124 cards from apkg); validator 0 errors |
| Agent Trials — trials module | Sonnet | ✅ DONE | 17 trials, 51 MCQs; validator 0 errors |
| Validation + smoke test | Manager | ⚠ PARTIAL | All present content valid. Core validator: 0 warnings, 2 errors (= missing day10/13 lessons only). Anatomy+Trials: 0 errors. Site runs with 0 missing script refs. |

## ✅ CONTENT COMPLETE — all 13 days have lessons + flashcards + MCQs (2026-07-04)
Part 1 of UPGRADE_PLAN is done. Final tally (validate.js): 43 lessons, **285 flashcards, 192 questions**, all three validators at 0 errors / 0 warnings. Questions by day now cover every day 1–13 (previously missing 10 & 13). Mock exam bank can draw a full set.
- Day 10 (CPB/cardioplegia/weaning) and Day 13 (LCOS/vasoactives/complications) were the last stubs — authored flashcards-d10 (28 cards), questions-d10 (16), flashcards-d13 (26), questions-d13 (16) to PGY5 depth, grounded in the existing lessons-d10/d13.
- Remaining from plan (NOT started): Part 2 (unified single Flashcards tab + visual overhaul) and Part 3 (Surgery step-by-step + Physiology labs engines).

## ⛔ (historical) STOPPED at session limit — see master_slate.md.
Was remaining: author lessons-d10/d13, flashcards-d{2,4,7,9,10,13}, questions-d{2,4,7,9,10,12,13}. All now complete.

## Source module → line ranges in /tmp/cs_guide.txt
M1 Anatomy 274–549 · M2 Coronary 550–831 · M3 Valvular 832–1158 · M4 Imaging 1159–1409 · M5 Preop 1410–1657 · M6 CABG 1658–1878 · M7 ValveSurg 1879–2113 · M8 Aortic/Pericardial 2114–2539 · M9 MCS 2540–2875 · M10 CPB 2876–3222 · M11 Hemostasis 3223–3529 · M12 Pacing 3530–3822 · M13 ICU 3823–4160 · M14 Complications 4161–5320 · Common Orders 5325+ · Integration Cases 7013+

---

## ⚠️ CONTEXT-LIMIT HANDOFF PROTOCOL (standing instruction from user)
When the manager's context usage approaches **~90%**:
1. Message every still-running agent (SendMessage by id) to STOP and write a `slate-<name>.md` in project root capturing: files written so far, what's complete, what's mid-flight, exact next steps, and any blockers.
2. Manager writes a per-workstream slate for any completed agents (from their final reports) + its own engine/gating/validation state.
3. Compile all slates into a single **`master_slate.md`** at project root: a resume-from-here doc with the full status board, remaining TODOs in order, file inventory, validator status, and the exact commands/next actions so a fresh session can continue seamlessly.
4. `ongoing_memory.md` is the live log; `master_slate.md` is the clean handoff. Keep both current.

## Source Materials
- `cardiac_surgery_guide_v3.pdf` (171pp, 14 modules) → /tmp/cs_guide.txt — PRIMARY teaching source
- `A_Primer_for_the_Student_Joining_the_Adult_Cardiac.pdf` (23pp) → /tmp/cs_primer.txt
- `cardiac_anatomy.apkg` → 124 cloze cards → /tmp/anatomy_cloze_dump.txt (Anatomy Flashcards)
- `Cardiac_Surgery.apkg` → 20 image-heavy notes (low text reuse)
- `BUILD_GUIDE.md` → engine source (PART 20) + schemas (PART 5) + rules (PART 18)

---

## Progress Log (agents report ~every 5 min; manager appends)

- [init] Manager: surveyed folder, extracted PDFs + Anki decks, ran ui-ux-pro-max design-system pass (kept professional Sora/Figtree + cyan→violet engine system, applying WCAG checklist). Built scaffold under `site/`. Authored CONTENT_MANIFEST.md.
- [engine] Manager: extracted 13 engine files byte-exact via deterministic script from BUILD_GUIDE PART 20; all `node --check` pass. Applied lesson-completion gating to app.js (unlockedCards/unlockedQuestions + quiz menu/routes/exam now require st_done[lesson]; added lock+heart icons). Made `lesson` field mandatory in validator. Rebranded index.html → CardiacSchool (heart logo) and rewired to per-day data files. Authored curriculum.js (14 days).
- [dispatch] Manager: launched 8 background sonnet agents (reporting model = completion notifications; manager logs each here as it lands):
  - Pod A `a2aa582d…` → D1 Anatomy + D2 Coronary (lessons+flashcards+questions)
  - Pod B `aa0f03b5…` → D3 Valvular + D4 Imaging
  - Pod C `afa33c72…` → D5 Preop + D6 CABG + D7 ValveSurgery
  - Pod D `ad7d7dfc…` → D8 Aortic + D9 MCS + D10 CPB
  - Pod E `aa64a461…` → D11 Hemostasis + D12 Pacing + D13 ICU/Complications
  - Agent X `a804d534…` → diagrams.js + exercises.js
  - Agent Anat `a9362e99…` → anatomy module (5 categories, ~20 regions, 124 cloze cards)
  - Agent Trials `a56af689…` → trials module (coronary/valve/aortic landmark trials + MCQs)

## [fix] Storage isolation (post-handoff)
CardiacSchool shared the original ScalpelSchool localStorage namespace (`st_`), so it inherited Scalpel's `st_startDate` (→ showed Day 4) and could overwrite shared keys (st_xp/st_streak/etc.). Fixed by changing CardiacSchool's Store prefix `st_` → `cs_` in site/js/app.js (Store.get/set + reset filter). The two apps are now fully independent. ScalpelSchool source files were never modified by this build.

## 2026-07-10 — day-by-day content-upgrade plan (PLAN.md); reverted plan-page arc

- User rejected an earlier attempt that only added a med-student→PGY-5 "arc" to the 14-Day Plan *page* (curriculum.js/viewPlan/CSS). That change was fully reverted (curriculum.js, app.js viewPlan, style.css back to originals). The ask is to upgrade the actual per-day *content* to a true PGY-5 depth.
- Key calibration correction from user: the level bar was set far too low. What the earlier attempt called "Chief/PGY-5" was really "med student interested in the field." The real PGY-5 bar is much deeper (independent operative reasoning, quantitative intra-op judgment, evidence at trial-detail level, management of rare lethal events). See `DAY_CONTENT_UPGRADE_PLAN.md` for the recalibrated level definitions and the 5-sequence build plan.

## 2026-07-09 — resident-layer overhaul

- Delegation constraint: three initial audit agents were interrupted before use when the user specified Terra-only agents; the remaining work was completed in the primary thread because the delegation interface could not guarantee agent class.
- Added six integrated operative modules: median sternotomy, going on/off CPB, on-pump CABG, SAVR, degenerative mitral repair, and acute type A dissection repair. Each includes orientation, indication, surgical anatomy, pre-op brief, 8–9 expandable operative steps, quantitative decision frames, complications, first-24-hour plan, evidence, viva prompts, a read-check, six cards, and five judgment MCQs.
- Added four live physiology labs: pressure-volume loop, CPB oxygen delivery, valve hemodynamics, and post-bypass shock cockpit. Added three branching crisis simulations: protamine collapse, dissection on cannulation, and post-bypass RV failure.
- Unified anatomy cloze, curriculum, and signed-off surgery cards in the main SRS with All/Curriculum/Anatomy/Surgery filters. Surgery read-checks gate surgery cards/MCQs. Runtime deck now contains 448 cards when the 127 anatomy cloze cards are included; the main structural bank contains 321 cards and 222 MCQs.
- Integrated advanced modules into the relevant curriculum days, dashboard command center, progress readiness map, and Numbers & Decisions quick reference. Added PWA manifest/service worker and responsive bottom navigation.
- Visual overhaul: resident command-center dashboard, premium operative cards/articles, step rail, progressive disclosure, high-contrast dark/light surfaces, lab/control panels, crisis monitor surfaces, and mobile layouts.
- Evidence anchors reviewed against current ACC/AHA key-perspective sources for coronary revascularization (2021), valve disease (2020), and aortic disease (2022). Added explicit educational/supervision disclaimers.
- Quality gates: `validate.js`, `validate-anatomy.js`, `validate-trials.js`, and new `validate-advanced.js` all report zero errors. All JS parses. New surgery MCQ answer positions are 8/8/7/7; uniquely-longest correct answers are 6/30. Browser checks covered dashboard, six-operation hub, CABG read-check/unlock, unified surgery cards, all four labs, all three advanced route families, anatomy, trials, plan, progress, quick-reference filtering, dark/light themes, and 390px mobile layout with no horizontal overflow.

## 2026-07-10 — Sequence 1 built (depth harness; no day content yet)

Built the DAY_CONTENT_UPGRADE_PLAN.md Sequence-1 deliverables — the standard + measurement harness that gates all later content work. No per-day teaching content was written (that is Sequences 2–5).

- `LEVEL_RUBRIC.md` (project root): frozen calibration standard — the one-sentence rule, the four failure tells (naked number / name-drop trial / sewn-in valve / complication-as-noun), the Day-8 before/after, the five-level ladder, the four-part quantitative rule, and all five worked calibration ladders (A heart-block, B conduit, C EF-in-MR, D post-bypass hypotension, E TAVR-vs-SAVR).
- `DEPTH_SCHEMA.md` (root): documents the optional depth fields — lesson-chunk `level` (4=Senior, 5=Mastery); question/flashcard `level`+`kind` (8-value enum); `quant{number,condition,exception,resolver}`; `evidence{population,endpoint,effect,limitation,source,...}`. All optional; the four existing validators are unaffected.
- `site/tools/validate-depth.js` + `site/tools/fixtures/depth-fixture.js`: the depth gate. Groups items by the authoritative `day` field (NOT filename — filenames use mixed legacy numbering; e.g. lessons-d10.js = Day-2 CPB, flashcards-d2.js = Day-3). Per-day `DAY_REQ` floors (L4/L5 lesson layers, when-not-to, rescue, four-part quant, evidence, operative-step). `--selftest` loads the deep fixture and PASSES (exit 0); plain run over real content FAILS 0/14 (exit 1) — proving it discriminates deep from shallow. `--json` for machine output.
- `COMPETENCY_MAPS/` (root): README index + 14 per-day maps (DAY_01…DAY_14) rendered from Appendix D + the Part-3 per-day specs, each carrying the day's L5 viva summits, lesson IDs, coupled assets, floors, and the failure-tell checklist.
- `VERIFY_QUEUE.md` (root) + `site/tools/scan-verify.js`: the medical-review queue wired to the Part-5 authoring loop; scanner reconciles inline `<!-- VERIFY: ... -->` markers against logged rows.

Day↔lesson mapping (authoritative, from lesson `day` fields): D1 d1-*; D2(CPB) d10-*; D3(Coronary) d2-*; D4(Valvular) d3-*; D5(Imaging) d4-*; D6(Preop) d5-*; D7(CABG) d6-*; D8(ValveSurgery) d7-*; D9(Aortic) d8-*; D10(MCS) d9-*; D11(Hemostasis) d11-*; D12(Pacing) d12-*; D13(ICU) d13-*; D14 no lessons.

Verified: node v24; all new JS parses; validate-trials/advanced still 0 errors; scan-verify clean (0 markers, 0 rows). Content loaded by validate-depth: 43 lessons, 285 flashcards, 490 questions.

Next: Sequence 2 (Days 1–5 foundations) — author top-down from each map's L5 summits until validate-depth flips those days to ✓.

## 2026-07-11 — Sequence 2 (Days 1–5) PGY-5 rebuild — MERGED into existing lessons

Superseded the first Seq-2 pass (which bolted on standalone `*-senior`/`*-mastery` lessons and was too shallow). Per user: (1) merge L4/L5 into the EXISTING topic-lessons as one continuous climb, not separate lessons; (2) full PGY-5 depth per Part 3; (3) author-then-web-verify load-bearing figures; (4) STOP at Day 5 for review before Day 6+.

- **Structure fix:** deleted the 10 standalone lessons; merged deepened L4/L5 chunks into each existing topic-lesson via `window.LESSONS["id"].chunks.push({level:4|5,...})` appended at the end of each lessons file (so ALL_LESSONS/lessonsForDay pick them up by day+ord automatically; no curriculum.js change). Re-pointed the added flashcards off the deleted lesson ids onto the correct existing lessons.
- **Depth added (representative):** D1 dominance-operational + circumflex↔P1 mm + reoperative CT hazard-map + 3 catastrophic rescues + conduction-axis across SAVR/VSD/tricuspid/myectomy + aortic-root-as-a-unit/ostial heights/SAVR annulus step-by-step. D2 CaO₂/DO₂ derivation + DO₂ nadir + protection-by-pathology + alpha/pH-stat + dissection-on-bypass + air-embolism drill + six-domain wean + won't-arrest. D3 demand-levers/IABP + nitrate trap + viability(stunned/hibernating/infarcted, LGE<50%) + ISCHEMIA/EXTEND at design level. D4 PV loops + EF-illusion + pseudo-severe AS + AR/MR/primary-vs-secondary timing numbers + COAPT/MITRA-FR + rheumatic-MS balloon-vs-surgery + functional-TR ring. D5 TEE checklist/views + back-on-pump SAM/residual/PVL + lesion description/IVUS-LM + measurement-error catalog + calcium-score adjudication.
- **Figures web-verified** (WebSearch): SAVR PPM ~3–6% (early ~4%); PARTNER 3 PPM ~6.5% vs Evolut self-expanding ~20%+; coronary ostial danger <~12 mm (LM <~11); AR LVESD>50/indexed>25 & EF≤55; primary MR EF≤60/LVESD≥40; ISCHEMIA median 3.2y no diff, EXTEND median 5.7y CV death 6.4 vs 8.6% HR0.78 / non-CV 5.6 vs 4.4% HR1.44; COAPT/MITRA-FR proportionate–disproportionate. 12 VERIFY markers logged in VERIFY_QUEUE.md (rows 1–12, status `sourced`; scan-verify reconciled).
- **Gates (all green for Days 1–5):** validate.js Errors 0 (43 lessons, 303 flashcards, 490 questions); validate-depth all of Days 1–5 ✓; validate-anatomy/trials/advanced 0. Questions kept at exactly 35/day, slots 9/9/9/8, uniquely-longest 12/35 (34.3%) each — decision-questions converted in place preserving answer indices; quant floors met via appended four-part flashcards.
- **Pre-existing, NOT touched (Seq-3 scope):** the assessment-quality gate still fails on Day 6 & Day 7 (uniquely-longest 45.7%) and q-d7-06 (unescaped numeric comparison in explain). These files were never modified in this work; validate.js therefore still exits non-zero on days 6–7 only. Leave until Day 6+ is approved.

NEXT: awaiting user review of Days 1–5 content depth before proceeding to Day 6 (Sequence 3).

================================================================================
2026-07-16 — CONTENT UPGRADE, Day 1 of 14 (session stopped at user request)
================================================================================

ASK: "upgrade the content ... for each page of the lesson, add more meaningful content
... explain every image, and for each of the 14 day lessons, add more questions."

DECISIONS (user, locked): questions = a FLOOR not a fixed target; image explanations =
PROSE IN THE LESSON CHUNK (not a registry field); NO new cloze cards; sequence 1-5, 6-9, 10-14.
Working plan: docs/plans/CONTENT_UPGRADE_2026-07.md. Resume instructions: master_slate.md.

THE UNLOCK — the figure-source PDF is no longer unreadable.
"Key Questions in Cardiac Surgery (2nd ed).pdf" is the origin of all 314 figures, but its text
carries no ToUnicode map and TWO substitution ciphers, which is why every prior pass could only
use one-line captions. Decoded this session; new tool: site/tools/extract-key-questions-text.py.
  - body cipher (AkzidenzGrotesk-*): byte = ascii+29 (skip 0x7F), byte read as MacRoman
  - display cipher (CenturyGothic-*): byte = ascii-29, plain ASCII
Font family does NOT predict which; many spans are plain. Five rules make it exact (each was a
real bug): decode per SPAN not per line; any char >0x7F => body, decisively; any lowercase a-z
=> NOT display (display shifts a-z out of that range; it is a PARTIAL map, so left on plain prose
it mangles only capitals and still outscores the original); identity must be a candidate (else
plain text gets re-scrambled: "right atrial" -> "right=~tri~l"); and resolve no-vocabulary spans
from their line's neighbours — this one is MEDICAL, since PyMuPDF splits numbers into their own
spans and "MVR" is both a real abbreviation and a plausible "095". ~760 clinical values were
affected (URJVMB -> 85-90%). Scoring uses /usr/share/dict/words; a hand-written list is not
enough (it scores a perfect decode of "First septal perforator branch" at zero).
RESULT: 0/31,521 lines residually scrambled; 308/310 figure captions. Verified against rendered
pages (p112 text, p034 "85-90%"/"10-15%"). Outputs: build_assets/key_questions.txt and
build_assets/key_questions_figures.json (keyed by the site's existing image ids).

DONE — Day 1 (d1-chambers, d1-coronaries, d1-conduction, d1-valves-anat):
  - validate-assessment-quality.js:65 -> question FLOOR (`!== 35` becomes `< 35`).
  - 24 figure-reading chunks, one per figure, each `figure: true`, prose pattern
    "What you are looking at -> What to notice -> Why it matters surgically", sourced from the
    decoded text. Placements rebuilt 12 grouped slots -> 24 single-figure slots, with an assertion
    that the flattened image-id set is identical (no figure lost or added). lesson slots 110 -> 122.
  - Day 1 questions 35 -> 45 (q-d1-36..45). First run FAILED both statistical gates exactly as the
    plan predicted (slots [12,10,11,12]; uniquely-longest-correct 42.2% with 8/10 new questions
    tripping it). Fixed by moving two answers to continue the 0,1,2,3 id-order cycle and by
    LENGTHENING DISTRACTORS (never truncating correct answers). Final: n=45, 12/11/11/11, 33.3%.
  - Cache: index.html ?v= bumped for the 3 changed files; sw.js CACHE -> cardiac-school-v24-day1-figures.
  - BROWSER-VERIFIED (headless Chrome): 24/24 figure slots render an <img>, 45 questions load,
    0 page errors; screenshot confirms prose-then-figure layout.

VALIDATOR FIXES (bugs found, not caused, by this work):
  - validate-image-placements.js had been CRASHING since the 07-15 atlas work — it never learned the
    `groups:[{title,imageIds}]` placement shape (required an exact flat field set and read
    item.imageIds blindly). Taught it both shapes via a placementIds() helper + group validation.
  - The per-chunk cloze quota (floor = max(12, teachingChunks*2)) is duplicated in
    validate-lesson-cloze-coverage.js AND validate-card-catalog.js, so 24 new chunks silently
    demanded 48 cards. Since cards are out of scope, `figure: true` chunks are now exempt in both.

STATE: 17/17 validators pass. validate.js own checks: 0 errors (44 lessons, 475 flashcards,
500 questions).

STILL OPEN — PRE-EXISTING, NOT FROM THIS WORK:
  - validate-new-card-quality: 45 errors at baseline (duplicate/near-duplicate cards in
    d10-cardioplegia, d10-weaning, d3-ar; answer leaks in sxcomp-* surgery cards). Never green.
  - The docs' "all 9 validators exit 0" is stale: there are ~18.
  - Deferred by user instruction: the 24 Day-1 figure chunks carry no cloze cards (~48 would be
    owed). To add them later, drop the `figure: true` tag and author.
  - Source-vs-lesson conflict to watch: the book says SA nodal artery RCA 55%/Cx 45%; existing
    d1-conduction prose says 60/40. Sourced figure added with a <!-- VERIFY --> marker; existing
    prose left alone.

NEXT: Day 2 (curriculum day 2 = d10-circuit, d10-cardioplegia, d10-weaning — note the
lessons-dN.js -> day offset; grep the `day:` field). Worst remaining figure dumps: d4-echo (10 at
one anchor), d4-ct (7), d2-ischemia (6), d10-weaning (5).
