# DAY 2 — Cardiopulmonary Bypass & Cardioplegia — COMPETENCY MAP & AUTHORING CHECKLIST

**Lessons:** `d10-circuit` · `d10-cardioplegia` · `d10-weaning`
**Coupled assets:** going-on/off-bypass module (`js/surgery/surgery-bypass.js`); CPB oxygen-delivery
lab → "perfusion cockpit" (`js/physiology/labs-cpb.js`); dissection-on-cannulation crisis
(`js/advanced/advanced-data.js`); clickable CPB-circuit component map (`diagrams.js`).
**Depth floors:** L4 ≥1, L5 ≥1, when-not-to ≥1, rescue ≥2, four-part quant ≥4, evidence ≥0, operative-step ≥1.

## L5 objectives (viva summits — write these FIRST, sourced)
1. **The flat/blunted arterial trace on initiating bypass = aortic dissection until proven otherwise** —
   immediate stop-pump, re-cannulation strategy (switch to true lumen, often axillary/innominate), and
   the cool-and-arrest decision.
2. **The six-domain "won't come off pump" differential** — residual ischemia/incomplete
   revascularization, unaddressed or new valve lesion, RV failure, arrhythmia, air down the RCA, and
   tamponade/vasoplegia — narrowed at the table in three minutes with TEE + filling pressures + direct
   inspection.
3. **Perfusion-emergency algorithms** — venous air lock and massive arterial air embolism (stop,
   Trendelenburg, de-air, retrograde cerebral perfusion for massive arterial air); oxygenator failure.
   → hinges on numbers [ACT >400–480 s; flow index ~2.2–2.5 L/min/m²; MAP ~50–80; Hct >21–24%; DO₂
   nadir ~270–300 mL/min/m²; del Nido 1:4, single dose up to ~90 min] and evidence anchors [CaO₂/DO₂
   derivation; alpha-stat vs pH-stat selection].

**Viva bar:** *"You cannot separate from bypass after a straightforward AVR — give me the ordered
six-domain differential and how you distinguish the causes at the table in the next three minutes."*

## Ladder coverage
- [ ] **L1** — the machine takes over heart and lungs.
- [ ] **L2** — the roles at the table; cannulation and going on/off in normal trajectory.
- [ ] **L3** — the circuit drawn from memory (reservoir, roller vs centrifugal pump, membrane oxygenator, heat exchanger, arterial-line filter, cardioplegia delivery, LV/root vents, suckers, safety sensors); numbers-with-conditions (ACT, heparin ~300–400 u/kg, flow index, MAP, Hct, temperature strategies 32–34 °C → DHCA ~18 °C; alpha-stat vs pH-stat and *when each*); antegrade vs retrograde cardioplegia and the physiologic reason retrograde protects the hypertrophied / ostially-obstructed / AI heart.
- [ ] **L4** — the DO₂ derivation (CaO₂ = 1.34·Hb·SaO₂ + 0.003·PaO₂; indexed DO₂ = CaO₂ × CI × 10), the injury threshold and SvO₂/lactate readout; myocardial protection by pathology (del Nido vs 4:1 blood re-dosed q15–20 min; hot-shot; topical cooling; LV venting for AI); troubleshooting differentials (high arterial-line pressure; low venous return; the "won't arrest" heart).
- [ ] **L5** — the three objectives above as crisis runs + operative-step + dosed-algorithm items.

## Quantitative floor (four-part each) — needs ≥4
- [ ] On-pump targets bundle (ACT / flow / MAP / Hct with conditions, demand-shift exception, SvO₂-lactate-DO₂ resolver).
- [ ] del Nido interval (1:4 single dose ~90 min · adult reasonable clamp times condition · long clamp / heavy LVH exception · monitor electrical activity + re-dose resolver).
- [ ] MAP-is-not-perfusion (target · condition · exception in low-Hct/low-flow · DO₂/SvO₂ resolver).
- [ ] alpha-stat vs pH-stat (which/when · adult routine vs deep-hypothermia pediatric arrest condition · exception · resolver).

## Operative granularity (couples the on/off-bypass module)
- [ ] Cannulation → on-bypass → cross-clamp → protection → wean narratable with the numbers and the failure at each step + rescue.
- [ ] Circuit component map: purpose / monitored variable / failure / rescue per component.

## Judgment content
- [ ] when-not-to: when NOT to proceed to arrest / when to abort onto peripheral bypass (dissection on cannulation).
- [ ] rescue (≥2): the dissection-on-initiation algorithm AND the massive-arterial-air / venous-air-lock algorithm.

## Self-audit
- [ ] Viva-bar answered from this day's content, three levels deep · four failure tells cleared · VERIFY triaged · all five validators at zero for Day 2 · submitted for spot-check.
