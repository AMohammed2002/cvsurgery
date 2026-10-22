# COMPETENCY_MAPS — the 14 per-day contracts

One file per curriculum day (`DAY_01_*.md` … `DAY_14_*.md`), rendered from the Appendix-D template of
`DAY_CONTENT_UPGRADE_PLAN.md` and the per-day PGY-5 specs in Part 3. Each map is the artifact its day
is audited against: it fixes the day's Level-5 viva summits (written **first**, per the top-down
authoring discipline), the lesson IDs to author into, the coupled operation / crisis / lab assets, and
the concrete numeric floors that `site/tools/validate-depth.js` enforces.

**Read `LEVEL_RUBRIC.md` first, then this day's map, then Part 5 of the plan (the authoring workflow),
before writing any content for a day.**

## Day → theme → lesson IDs → validate-depth floors

The authoritative day is the item's `day` field (matches `curriculum.js`). Lesson IDs keep a legacy
`dN-` prefix and filenames use mixed legacy numbering — see `DEPTH_SCHEMA.md`. Floors below mirror the
`DAY_REQ` table in `validate-depth.js` (`L4`/`L5` = a Senior and a Mastery lesson chunk;
`wNot` = when-not-to items; `resc` = complication-rescue/dosed-algorithm items; `q4` = four-part
quantitative items; `evid` = well-formed evidence items; `oper` = operative-step items).

| Day | Theme | Lesson IDs | L4 | L5 | wNot | resc | q4 | evid | oper |
|----|-------|-----------|----|----|------|------|----|------|------|
| 1  | Cardiac & Mediastinal Anatomy | d1-chambers, d1-coronaries, d1-conduction, d1-valves-anat | 1 | 1 | 1 | 1 | 2 | 0 | 1 |
| 2  | Cardiopulmonary Bypass & Cardioplegia | d10-circuit, d10-cardioplegia, d10-weaning | 1 | 1 | 1 | 2 | 4 | 0 | 1 |
| 3  | Coronary Physiology & Ischemia | d2-o2, d2-ischemia, d2-angina | 1 | 1 | 1 | 1 | 3 | 1 | 0 |
| 4  | Valvular Pathology & Hemodynamics | d3-as, d3-ar, d3-ms, d3-mr, d3-tr | 1 | 1 | 1 | 1 | 4 | 1 | 0 |
| 5  | Cardiac Imaging & Interpretation | d4-echo, d4-cath, d4-ct | 1 | 1 | 1 | 1 | 2 | 0 | 0 |
| 6  | Preoperative Evaluation & Risk | d5-risk, d5-optimize, d5-heartteam | 1 | 1 | 2 | 0 | 2 | 1 | 0 |
| 7  | CABG: Indications & Evidence | d6-indications, d6-conduits, d6-technique | 1 | 1 | 1 | 1 | 2 | 2 | 2 |
| 8  | Valve Surgery: SAVR, Mitral & Tricuspid | d7-savr, d7-tavr, d7-mitral, d7-prosthetics | 1 | 1 | 1 | 1 | 3 | 2 | 2 |
| 9  | Aortic Surgery & Pericardial Disease | d8-aneurysm, d8-dissection, d8-pericardium | 1 | 1 | 1 | 1 | 2 | 1 | 1 |
| 10 | Mechanical Circulatory Support | d9-iabp, d9-ecmo, d9-vad | 1 | 1 | 1 | 2 | 2 | 1 | 0 |
| 11 | Hemostasis, Transfusion & Coagulation | d11-coag, d11-bleeding, d11-reexplore | 1 | 1 | 1 | 2 | 3 | 0 | 0 |
| 12 | Pacing & Conduction Disturbances | d12-af, d12-pacing, d12-block | 1 | 1 | 1 | 1 | 2 | 0 | 0 |
| 13 | Cardiac ICU & Postoperative Complications | d13-lcos, d13-vaso, d13-complications | 1 | 1 | 1 | 2 | 3 | 0 | 0 |
| 14 | Mock Royal College Exam (integration) | — (no lessons) | — | — | — | — | — | — | — |

Day 14 has no lessons; its floor is ≥ 15 questions tagged `level >= 4` (re-weighted toward the L4/L5
`kind`s). The floors are deliberately conservative structural minimums — meeting them is necessary,
not sufficient; the human calibration spot-check against the Part-1 yardstick is the real gate.
