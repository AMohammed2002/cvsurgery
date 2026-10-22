# DAY 1 — Cardiac & Mediastinal Anatomy — COMPETENCY MAP & AUTHORING CHECKLIST

**Lessons:** `d1-chambers` · `d1-coronaries` · `d1-conduction` · `d1-valves-anat`
**Coupled assets:** median-sternotomy / redo-entry module (`js/surgery/surgery-sternotomy.js`); layered
anatomy diagrams + surgical-danger label drill (`js/data/diagrams.js`, `exercises.js`).
**Depth floors (validate-depth.js):** L4 ≥1, L5 ≥1, when-not-to ≥1, rescue ≥1, four-part quant ≥2,
evidence ≥0, operative-step ≥1.

## L5 objectives (viva summits — write these FIRST, sourced)
1. **Read the reoperative-sternotomy hazard map off a gated CT** and modify the plan: name the danger
   threshold (any structure adherent to or within a few mm of the posterior sternal table), the
   decision to expose/cannulate a femoral or axillary vessel *before* opening, the oscillating-saw
   single-table-then-lift strategy, and the catastrophic-injury rescues (RV laceration → finger
   control, pack, peripheral bypass, repair on a decompressed heart; patent-graft avulsion → the
   territory it feeds + on-pump repair; aortic entry → control, cool, arrest).
   → hinges on numbers [coronary ostial heights: LM ~13–15 mm, RCA ~15–17 mm; circumflex within a few
   mm of the P1 annulus] and trials [none — anatomy day].
2. **Own the conduction-axis decisions that change suture technique** across SAVR (stay superficial at
   the nadir of the non-/right-coronary commissure and the membranous septum), VSD closure (buttress
   on the RV side away from the His), tricuspid annuloplasty (AV node at the apex of Koch's triangle),
   and septal myectomy — and teach *why* the standard protective teachings are necessary but not
   sufficient.

**Viva bar:** *"Reoperative sternotomy for a redo AVR in a patient with a patent LIMA-to-LAD graft —
walk me through how the CT changes your plan and exactly what you do if you enter the RV on opening."*

## Ladder coverage
- [ ] **L1 entry** — chambers, valves, great vessels, the heart on a chest film; every term defined at first use.
- [ ] **L2 floor** — orientation to the OR field, what sits behind the sternum, cannulation/clamp landmarks.
- [ ] **L3 working spine** — coronary tree with dominance defined operationally (right-dominant ~85–90%, left ~7–8%; whoever gives the PDA supplies inferior wall + AV node); grooves as landmarks; the conduction axis in 3D (SA node cavoatrial junction, AV node in Koch's triangle bounded by tendon of Todaro / coronary sinus os / septal TV annulus, His at the membranous septum); the aortic root as a unit (virtual basal ring, three sinuses, ostial heights, STJ, commissures, aortomitral curtain).
- [ ] **L4 senior reasoning** — 3D surgical relationships and the redo entry; transverse/oblique sinuses for cannulation and clamping; the millimeter circumflex-to-P1 relationship and how dominance changes it; low-RCA-button hazard in root replacement; phrenic on the pericardium/LIMA and the recurrent laryngeal under the arch.
- [ ] **L5 mastery** — the two objectives above, delivered as viva prompts + operative-step + rescue items.

## Quantitative floor (each item four-part per §2.5 / DEPTH_SCHEMA §3)
- [ ] Coronary ostial heights (number · normal-root condition · low-ostium-under-prosthesis exception · gated-CT + button/graft resolver).
- [ ] Circumflex-to-P1-annulus distance (number · left-dominant condition · deep-lateral-bite exception · superficial-bite + post-bypass-TEE resolver).
- [ ] No naked numbers survive (failure tell #1 cleared).

## Evidence granularity
- [ ] Not a trial-heavy day (evidence floor 0); any evidence item invoked carries full population/endpoint/effect/limitation/source.

## Operative granularity (couples the sternotomy / redo-entry module)
- [ ] Redo entry narratable with tissue planes, the pre-open peripheral-cannulation decision, single-table-then-lift, and the three catastrophic injuries at the step they arise, each with a rescue.
- [ ] No "sewn-in valve"/summarized-operation sentences survive (failure tell #3 cleared).

## Judgment content
- [ ] when-not-to: when NOT to make a standard central redo entry (adherence within mm of the table → peripheral bypass first).
- [ ] rescue: the RV-laceration / graft-avulsion / aortic-entry dosed-ordered rescue.
- [ ] No complication-as-a-noun survives (failure tell #4 cleared).

## Self-audit
- [ ] Answered the viva-bar question using ONLY this day's content, three levels deep.
- [ ] Read the day against all four failure tells and cleared each.
- [ ] VERIFY flags triaged into `VERIFY_QUEUE.md`.
- [ ] validate.js / validate-anatomy.js / validate-trials.js / validate-advanced.js / validate-depth.js at zero for Day 1.
- [ ] Submitted for human calibration spot-check.
