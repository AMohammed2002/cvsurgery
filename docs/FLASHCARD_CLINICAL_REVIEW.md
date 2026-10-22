# Retrieval-v2 clinical review queue

Status: **editorially rebuilt; not yet clinically signed off**.

The technical validator accepts editorial drafts so the rebuild can be tested. The production gate is stricter: every learning-point ledger record must have a `reviewer` beginning with `clinician:` and a valid `reviewedAt` date. Run:

```sh
node site/tools/validate-release.js
```

That command must remain red until a qualified reviewer has checked every lesson/source ledger and all time-sensitive claims. Clinical sign-off must never be inferred from an assistant review date.

## Priority review families

1. **Acute coronary syndrome cards.** The Day 2 lesson labels several recommendations as the 2021 revascularization guideline. A 2025 ACC/AHA/ACEP/NAEMSP/SCAI acute-coronary-syndromes guideline now combines and updates STEMI/NSTE-ACS guidance. Review every acute-reperfusion, invasive-timing, nonculprit, access, thrombectomy, antithrombotic, and DAPT card against the 2025 document. If the required answer, class, evidence level, population, exception, or timing changes, issue a new card ID; do not preserve the old schedule.

   Primary source: https://www.jacc.org/doi/10.1016/j.jacc.2024.11.009

2. **Cardiopulmonary bypass and cardioplegia numbers.** Review heparin/ACT, pump-flow, oxygen-delivery, MAP, haematocrit, temperature, gas-management, occlusion-setting, cardioplegia-pressure/flow, redose, and separation targets against the 2024 EACTS/EACTAIC/EBCP CPB guideline and the local perfusion protocol. Preserve `approximate` or `institution-dependent` qualifiers.

   Primary source: https://academic.oup.com/icvts/article/40/2/ivaf002/8011481

3. **Bleeding, transfusion, and re-exploration.** Review antithrombotic interruption, viscoelastic treatment mappings, transfusion triggers, protamine dosing, chest-drain thresholds, and re-exploration rules against the 2024 EACTS/EACTAIC/EBCP patient-blood-management guideline. The guideline emphasizes combined haemodynamic/clinical assessment and notes that universal chest-tube timing/output evidence is limited; historical numeric rules must not be presented as universal mandates.

   Primary source: https://academic.oup.com/ejcts/article/67/5/ezae352/7815985

4. **Perioperative medication.** Review aspirin, P2Y12 interruption/restart, postoperative atrial-fibrillation treatment, RAAS/SGLT2 therapy, beta-blockers, lipids, glucose, antibiotics, and related exceptions against the 2024 EACTS perioperative-medication guideline. Keep emergency/urgent exceptions visible.

   Primary source: https://academic.oup.com/ejcts/article/67/1/ezae355/7815986

5. **Institution-dependent rescue and device settings.** Local review is required for pacing outputs/observation windows, vasoplegia rescue dosing, MCS escalation, ECMO/IABP settings, ventilation, electrolyte targets, and drug contraindications. A guideline citation does not replace the institution's current protocol.

## Explicit source-content flags already identified

- A source checklist described widened pulse pressure as suggesting tamponade. This was not carded; tamponade classically narrows pulse pressure and the source sentence requires correction.
- “Severe renal failure” as a methylene-blue contraindication requires specialist verification before release.
- Roller-pump standing-column calibration at 45–75 mmHg is preserved as an approximate lesson target and remains pending perfusionist review.
- Numeric values that are descriptive epidemiology, historical trial results, or device-specific context should remain enrichment/supporting context unless the reviewer confirms an independent retrieval objective.

## Sign-off procedure

For each source:

1. Compare the claim ledger with every authored source part and confirm no core/applied objective is missing.
2. Verify each active answer, qualifier, population, exception, unit, and polarity.
3. Verify source organization, edition/year, recommendation class, and evidence level for guideline claims.
4. Confirm numeric precision and whether the value is exact, approximate, a range, or institution-dependent.
5. Record `reviewer: "clinician:<name or governed reviewer ID>"` and `reviewedAt`.
6. Set `reviewBy` no later than 12 months for guideline cards and 24 months for dosing/device-setting cards.
7. Run the production release gate. Any changed clinical target receives a new immutable card ID; the old SRS record remains archived.
