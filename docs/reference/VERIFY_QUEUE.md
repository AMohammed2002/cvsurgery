# VERIFY_QUEUE.md — the running medical-review queue

Every `<!-- VERIFY: ... -->` marker an author places in the content is logged here with the claim, the
best source the author found, and the specific uncertainty. **A number does not ship un-flagged unless
it is sourced to Appendix E of `DAY_CONTENT_UPGRADE_PLAN.md` or a fresh citation the author records.**
A VERIFY flag is a *strength*, not a weakness — it is the mechanism that lets content ship honest while
a human closes the loop. A day with ten well-placed VERIFY flags and no fabrications is stronger than a
day with zero flags and three confident inventions.

## Workflow (wired to the authoring loop — Part 5 of the plan)
1. **At research time** (Part 5.2), any figure the author cannot verify is written with the qualitative
   claim intact and an inline `<!-- VERIFY: <claim> | source-tried: <src> | uncertainty: <what> -->`
   marker — *not* patched in later.
2. **At self-audit** (Part 5.6), every new VERIFY marker is copied as a row into the table below before
   the day is submitted.
3. **Scan to reconcile:** run `node site/tools/scan-verify.js` to list every `<!-- VERIFY -->` marker
   currently in the content and cross-check it against this queue (it flags markers not yet logged, and
   logged rows whose marker has been removed).
4. **Human medical-review pass** resolves each row: confirm the number against a primary/guideline
   source, correct it, or keep the qualitative claim. On resolution, set Status → `resolved`, record the
   closing source, and remove the inline marker from the content.
5. **Acceptance gate (Sequence 5):** the rebuild is not "done" until this queue is empty or every row is
   `resolved` with a recorded source.

## Marker format (copy into the content verbatim, then log the row)
```
<!-- VERIFY: LIMA-LAD 10-year patency figure | source-tried: cs_guide.txt M6 | uncertainty: exact % vs >90% -->
```

## Queue

| # | Day | Lesson / item id | Claim to verify | Best source tried | Specific uncertainty | Status |
|---|-----|------------------|-----------------|-------------------|----------------------|--------|
| 1 | 1 | d1-conduction (L4) | Complete heart block / PPM ~3–6% after isolated SAVR (early ~4% by 30d), higher with calcification/RBBB/small or bicuspid annulus/root abscess | Netherlands Heart Registration (PMC8518121) ~4% at 30d; reviews cite 3–6% CHB | Exact pooled % and per-risk-factor stratification | sourced |
| 2 | 1 | d1-conduction (L5) | PPM device-dependent: PARTNER 3 balloon-expandable ~6.5% at 30d (vs SAVR ~4%); Evolut self-expanding ~20%+ cumulative | PARTNER 3 / Evolut Low Risk reports (PMC7044101; JACC 2021) | Exact Evolut 5-year cumulative PPM % (stated as ~20%+) | sourced |
| 3 | 1 | d1-valves-anat (L4) | Coronary ostial-obstruction danger cutoff ~<12 mm (LM ostium <~11 mm); typical ostial heights ~13–15 mm | TAVR CT literature / ACR TAVR root measurements; JSCAI LM-protection review | Typical mean heights vary by series; 12 mm is a risk cutoff not a mean | sourced |
| 4 | 2 | d10-circuit (L4) | On-pump indexed DO₂ nadir ~270–300 mL O₂/min/m² below which AKI/organ-injury risk rises | Standard perfusion references (Appendix C [CPB]) | Exact nadir varies by study/definition (goal-directed perfusion literature) | sourced |
| 5 | 2 | d10-cardioplegia (L4) | del Nido single-dose interval up to ~90 min in the adult heart | del Nido composition/interval reviews (Appendix C [DN]) | Adult single-dose interval commonly cited 60–90 min; shorter with LVH/long clamp | sourced |
| 6 | 3 | d2-ischemia (L4) | LGE transmurality < 50% predicts functional recovery after revascularisation | Viability-imaging literature (Appendix C) | Threshold is probabilistic, not absolute; segment-dependent | sourced |
| 7 | 3 | d2-angina (L5) | ISCHEMIA-EXTEND CV death 6.4% vs 8.6% (HR ~0.78), non-CV 5.6% vs 4.4% (HR ~1.44), median ~5.7y, no all-cause difference | ISCHEMIA-EXTEND (Eur Heart J Suppl 2023; SCAI) — web-confirmed | Exact percentages/CIs from the interim report | sourced |
| 8 | 4 | d3-ar (L4) | 2020 ACC/AHA AR: surgery for EF ≤55% (I); LVESD >50 mm or indexed >25 mm/m² (IIa) | 2020 ACC/AHA VHD guideline — web-confirmed | Confirmed vs local guide (which cited 2021); thresholds current | sourced |
| 9 | 4 | d3-mr (L4) | 2020 ACC/AHA primary MR: intervene at EF ≤60% or LVESD ≥40 mm (I); early repair (IIa) at experienced centre | 2020 ACC/AHA VHD guideline — web-confirmed | Current thresholds confirmed | sourced |
| 10 | 4 | d3-mr (L5) | COAPT mean EROA ~0.41 cm² (smaller LV); MITRA-FR mean EROA ~0.31 cm² (dilated LV) | COAPT/MITRA-FR proportionate–disproportionate framework — web-confirmed | Exact trial mean EROAs (approximate values) | sourced |
| 11 | 5 | d4-cath (L4) | IVUS left-main minimal lumen area ~6 mm² significance threshold | Interventional imaging literature | Threshold range (~4.5–6 mm²) varies by study/population | sourced |
| 12 | 5 | d4-ct (L5) | AV calcium-score thresholds for severe AS ~>2000 AU (men) / >1200 AU (women) | 2020 ACC/AHA VHD guideline / local d3-as lesson | Sex-specific AU cutoffs; consistent with existing content | sourced |
| 13 | 6 | d5-heartteam (L5) / fc-d5-23 | 2020 ACC/AHA aortic prosthesis: mechanical favored <50 y, bioprosthetic favored >65 y, 50–65 shared decision; SAVR favored <65, TAVR >80 | 2020 ACC/AHA VHD guideline (ACC Key Perspectives) — web-confirmed | Age bands confirmed current | sourced |
| 14 | 6 | d5-risk (L4) / fc-d5-22 | EuroSCORE II better calibrated than logistic EuroSCORE I, which over-predicted mortality ~2–3× observed in high-risk cases | EuroSCORE II derivation + calibration literature — web-confirmed | Over-prediction magnitude approximate, varies by cohort | sourced |
| 15 | 7 | d6-indications (L5) / q-d7-01 | FREEDOM 5-y composite (death/MI/stroke) 26.6% PCI vs 18.7% CABG (ARR 7.9%); more early stroke with CABG; mortality benefit emerges y4–5 | FREEDOM (NEJM 2012; JACC long-term) — web-confirmed | Exact percentages/CI confirmed | sourced |
| 16 | 7 | d6-indications (L5) / q-d7-09 | EXCEL 5-y all-cause mortality 9.9% CABG vs 13.0% PCI; SCAI/CK-MB procedural-MI definition inflated surgical count; NOBLE 5-y MACCE ~19% CABG vs ~28% PCI (excl. periproc MI); both industry-sponsored | EXCEL/NOBLE (NEJM 2019; medscape/tctmd MI-definition coverage) — web-confirmed | Definitions/percentages confirmed | sourced |
| 17 | 7 | d6-conduits (L4) / fc-d6-22 | LIMA-to-LAD patency >90% at 10 y (>85% at 20 y); ART no BIMA ITT survival benefit HR≈0.96 (~40% crossover, 22% radial) | Existing d6-conduits content + ART reports | Patency ranges series-dependent; ART HR from 10-y report | sourced |
| 18 | 8 | d7-savr (L5) / fc-d7-33 | Patient-prosthesis mismatch: EOAi <0.85 cm²/m² moderate, <0.65 cm²/m² severe; matters most in small/active/low-EF patient | 2020 ACC/AHA VHD guideline; VARC-3 definitions | EOAi cut-points standard; clinical-impact modifiers qualitative | sourced |
| 19 | 8 | d7-prosthetics (L4) / fc-d7-34 / q-d8-33 | Mechanical INR: aortic 2.0–3.0 (≈2.5), mitral/any 2.5–3.5; On-X aortic 1.5–2.0 + ASA (PROACT); DOACs contraindicated (RE-ALIGN) | 2020 ACC/AHA VHD guideline; PROACT; RE-ALIGN (NEJM 2013) | Position/risk targets standard; On-X lower target trial-specific | sourced |
| 20 | 8 | d7-mitral (L5) / fc-d7-35 | Asymptomatic primary MR operate at LVEF ≤60% or LVESD ≥40 mm; early repair beats watchful waiting at expert centre | 2020 ACC/AHA VHD guideline (Class I/IIa) | Thresholds current-guideline; repair-centre caveat qualitative | sourced |
| 21 | 8 | d7-tavr (L4 evidence) / q-d8-12,14 | PARTNER 1B TAVR vs medical ~50%→30% 1-y mortality (inoperable); PARTNER 3 1-y composite 8.5% TAVR vs 15.1% SAVR (low-risk), convergence by 5 y | PARTNER 1B (NEJM 2010); PARTNER 3 (NEJM 2019 / 5-y 2023) | Exact 1-y composite percentages confirmed vs published | sourced |
| 22 | 9 | d8-aneurysm (L4) / fc-d8-17 | Ascending aneurysm elective repair ~5.5 cm; ~5.0/4.5 cm for Marfan/Loeys-Dietz/bicuspid/FHx dissection/growth >0.5 cm/yr/pre-pregnancy; ≥4.5 cm at concomitant surgery | 2022 ACC/AHA Aortic Disease guideline | Thresholds current-guideline; body-size indexing method varies | sourced |
| 23 | 9 | d8-dissection (L5) / fc-d8-18 / q-d9-15 | Untreated acute type-A mortality ≈1–2%/hr first 24–48 h (~50% by 48 h); IRAD medical mgmt ~50–60% in-hospital mortality | IRAD (JAMA 2000; registry reports); classic Hirst series | Per-hour figure is classic estimate; registry mortality has selection bias | sourced |
| 24 | 10 | d9-ecmo/d9-vad (L4/L5) / q-d10-03 / fc-d9-25 | IABP-SHOCK II: no 30-day mortality benefit (~40% both arms), no benefit to 6 y (~66–67% both); IABP CO gain ~0.5–1.0 L/min | IABP-SHOCK II (NEJM 2012; 6-y Lancet 2018) | 30-day/6-y percentages web-confirmed; CO-gain figure is classic physiology estimate | sourced |
| 25 | 10 | d9-vad (L5) / q-d10 MCS set | MOMENTUM 3: HeartMate 3 vs HM II 2-y primary (survival free of disabling stroke/reop) 76.9% vs 64.8%; overall survival 82.8% vs 76.2%; pump thrombosis/reop far lower | MOMENTUM 3 (NEJM 2019, 2-y full cohort) | 2-y composite and survival web-confirmed | sourced |
| 26 | 11 | d11-coag (L5) / fc-d11-22 | Protamine reversal ~1 mg per 100 U heparin, titrated to ACT; excess protamine is itself anticoagulant; Type III reaction = pulmonary vasoconstriction/RV failure | Standard cardiac-anesthesia texts; guideline heparin-management statements | Ratio is a titration anchor, not a fixed dose; titrate to ACT | sourced |
| 27 | 11 | d11-bleeding (L4) / fc-d11-23 | Rate-based re-exploration triggers ~>400 mL/hr ×1 h, >300 ×2–3 h, >200 ×4 h; fibrinogen target ~>1.5–2 g/L in bleeding patient | STS/EACTS blood-conservation guidelines | Thresholds are widely-cited conventions, institution-variable | sourced |
| 28 | 12 | d12-pacing/d12-block (L4/L5) / fc-d12-22 | Post-op AV block PPM observation window ~5–7 d; new persistent LBBB with HV >~70 ms predicts non-recovery; output ~2–3× capture threshold | ACC/AHA/HRS pacing guideline; post-TAVR conduction literature | Window and HV cutoff are guideline-informed conventions | sourced |
| 29 | 13 | d13-vaso/d13-lcos (L4/L5) / fc-d13-27,28,29 | LCOS = CI <~2.0–2.2 L/min/m²; vasoplegia ladder norepi→vasopressin 0.03–0.04 U/min→methylene blue 1.5–2 mg/kg→hydroxocobalamin ~5 g→angiotensin II (post-hoc ATHOS-3) | ATHOS-3 cardiac-surgery post-hoc (JCVA 2020); vasoplegia reviews | Vasopressin dose and ATHOS-3 post-hoc nature web-confirmed; doses are standard ranges | sourced |
| 30 | 4 | q-d4-26 (L5, kind:evidence) — Seq-5 Day-4 evidence-gap fix | COAPT (n=614, mean EROA ~0.41 cm²): HF hospitalization 35.8% vs 67.9% per pt-yr (HR ~0.53), all-cause death 29.1% vs 46.1% at 2 y (NNT ~6). MITRA-FR (n=304, mean EROA ~0.31 cm²): composite death/HF-hosp ~54.6% vs 51.3% at 1 y (no difference). Proportionate–disproportionate reconciliation | COAPT (Stone, NEJM 2018); MITRA-FR (Obadia, NEJM 2018); 2020 ACC/AHA VHD guideline | Figures match the trials as published (same framework verified in Seq-2 rows 1–12); NNT is approximate | sourced |

**Status legend:** `open` (needs review) · `sourced` (author found a citation, awaiting human sign-off) ·
`resolved` (confirmed/corrected + inline marker removed).

## Standing rules
- Teach the **current guideline statement**; where `cardiac_surgery_guide_v3.pdf` disagrees with the
  2020 VHD / 2021 revascularization / 2022 aortic guidelines, the guideline wins and the content notes
  the change.
- Never invent statistics or trial results. Where an exact figure is not in the local source or
  Appendix C, state the established qualitative result and flag the number here.
- When a newer authoritative figure than Appendix C carries is found, use the newer one and add a row
  noting the update so Appendix C can be refreshed.
