# Question Bank 1,056 Validation Record

**Validation date:** 2026-07-20  
**Scope:** `site/js/data/questions-d1.js` through `questions-d14.js`, shared delivery logic, tutor feedback, mock review, and offline data loading.

## Focused Question Bank gates

The release commands for this upgrade are:

```text
node site/tools/validate-assessment-quality.js
node site/tools/test-question-bank.js
node site/tools/validate-depth.js
node site/tools/scan-verify.js
```

Final focused results:

- **1,056/1,056 unique questions**, with all **44 lessons represented by exactly 24** items.
- **1,052 (99.6%) Level 4–5** questions; **4 (0.4%) recall** questions; **977 (92.5%) contextual/interpretive** stems.
- Canonical keys are exactly **264 A / 264 B / 264 C / 264 D**; lesson and day/topic spreads and answer runs pass.
- Uniquely-longest correct choices: **166/1,056 (15.7%)**. Correct choices at least 1.5× the median distractor: **59/1,056 (5.6%)**. Both global and subgroup gates pass.
- Every item has four options, a 60+ word consolidated teaching explanation, a 10–30 word objective, level/kind metadata and resolved internal references. Quantitative and evidence metadata gates pass.
- `test-question-bank.js` passes delivery blocks of 1, 3, 15, 40 and 75 items, including balance, remapping, canonical immutability, scoring, weakness drills and persisted-statistics compatibility.
- `validate-depth.js` and its self-test pass; `scan-verify.js` passes with all 18 inline verification markers covered by the 30-row queue.
- The similarity report retains 85 objective pairs and four near-stem warnings for manual review; no explanation pair crosses its review threshold and no duplicate-stem error remains.

Browser smoke confirmed the rendered **1,056** count, completion-gated unlocking of **24** lesson questions, and immediate correct/incorrect tutor feedback with rationale and educational objective. The broader cold-offline, theme/keyboard, and full 75-item review journey was stopped when the user requested wrap-up and is not claimed as completed here.

## Unrelated pre-existing full-suite blocker

`node site/tools/validate.js` reaches `validate-lesson-cloze-coverage.js` and reports exactly **31 existing flashcard-grounding failures**. This Question Bank upgrade does not change, suppress, reclassify, or weaken that validator. The affected additive flashcard IDs are recorded separately here so they are not mistaken for Question Bank regressions:

1. `fc-d1-chambers-150-200-ml-0cy3rxs`
2. `fc-d1-chambers-15-50-ml-0ur3drp`
3. `fc-d1-chambers-bicaval-cannulation-0eh1u73`
4. `fc-d1-chambers-ligamentum-arteriosum-0x2nbm0`
5. `fc-d1-coronaries-2-7-days-0kcqrb9`
6. `fc-d1-coronaries-5-7-07ogary`
7. `fc-d1-coronaries-diagonals-d1-d2-1l1hjjy`
8. `fc-d1-coronaries-in-left-dominant-systems-8-10-14ba0ma`
9. `fc-d1-coronaries-diagonal-branches-d1-d2-1s3ztiq`
10. `fc-d1-coronaries-left-coronary-sinus-1kpnga3`
11. `fc-d1-conduction-1-3-01791n8`
12. `fc-d1-conduction-permanent-pacemaker-0miv7tj`
13. `fc-d1-conduction-koch-s-triangle-saves-you-0nah0cr`
14. `fc-d1-conduction-right-atrial-incisions-1i84a8l`
15. `fc-d1-conduction-all-valve-cases-1jc7xi5`
16. `fc-d1-valves-anat-10-12-mm-1atoiyj`
17. `fc-d1-valves-anat-adjacent-to-the-lcc-left-coronary-cusp-0256wzx`
18. `fc-d1-valves-anat-triangle-of-koch-077iirf`
19. `fc-d10-circuit-2-2-2-4-l-min-m2-00q6gkt`
20. `fc-d10-circuit-axillary-artery-0ykkdr2`
21. `fc-d10-circuit-single-two-stage-venous-cannula-1r0jbrp`
22. `fc-d10-cardioplegia-20-30-minutes-0tpl6ej`
23. `fc-d10-cardioplegia-blood-cardioplegia-most-commonly-used-1qggemh`
24. `fc-d10-cardioplegia-crystalloid-cardioplegia-1oy8ap7`
25. `fc-d2-o2-40-50-0swk7my`
26. `fc-d3-as-pressure-overload-19tiagf`
27. `fc-d3-ms-4-6-cm2-0kpl2qt`
28. `fc-d3-mr-low-impedance-escape-route-057hqdn`
29. `fc-d3-tr-functional-1x45rs3`
30. `fc-d9-vad-20-30-1qlfep6`
31. `fc-d13-lcos-60-65-mmhg-0eb5u5t`

All 31 failures have the same pre-existing reason: the generated explanation is not grounded verbatim in its linked lesson chunk.
