# DEPTH_SCHEMA.md — the optional depth fields `validate-depth.js` reads

This is Sequence 1, Task 4 of `DAY_CONTENT_UPGRADE_PLAN.md`: *"Extend the schemas minimally."* Every
field below is **optional** so all existing content still validates unchanged under `validate.js`,
`validate-anatomy.js`, `validate-trials.js`, and `validate-advanced.js` (which only check their own
required fields and ignore unknown keys). But **every newly-authored Level-4/5 item MUST carry them**,
and `validate-depth.js` enforces that: it reads these fields to tell a structurally-deep day from the
shallow rejected pass.

The existing base schemas are unchanged and still authoritative — see `CONTENT_MANIFEST.md` and
`BUILD_GUIDE.md`. This file documents only the *additions*.

> **Day grouping note.** The authoritative curriculum day for any item is its own `day` field (1–14),
> which matches `curriculum.js`. Filenames use mixed legacy numbering (e.g. `lessons-d10.js` holds the
> Day-2 CPB lessons; `flashcards-d2.js` holds Day-3 cards) — never group by filename. Lesson IDs also
> keep a legacy `dN-` prefix (e.g. `d10-circuit` is a Day-2 lesson). Always trust the `day` field.

---

## 1. Lesson chunks — the `level` field (marks the Senior and Mastery layers)

Each lesson is `{ id, title, day, chunks: [...] }`. Teaching chunks are `{ html }` (or
`{ type:"checkpoint", q, options, answer, explain }`). Add an optional `level` (1–5) to a teaching
chunk to declare which rung of the four-layer climb it delivers:

```js
{
  html: "<h4>Senior reasoning: the reoperative-sternotomy hazard map</h4> ...",
  level: 4          // 1–2 Orientation · 3 Working Competence · 4 Senior Reasoning · 5 PGY-5 Mastery
}
```

- A day's **Senior layer (L4)** is present when ≥1 of its lesson chunks carries `level: 4`.
- A day's **Mastery layer (L5)** is present when ≥1 of its lesson chunks carries `level: 5`.
- Chunks with no `level` are treated as Orientation/Working (L1–L3) and are fine — the on-ramp does
  not need tagging. Only the senior and mastery layers must be explicitly declared, because those are
  what the rejected pass lacked and what the validator must find.

The four layers are a *single continuous climb* in the prose (Part 2.1 of the plan); the `level` tag
is discrete only so the validator and assessment engine can address each rung.

---

## 2. Questions and flashcards — `level` and `kind`

Base question: `{ id, day, lesson, topic, stem, options, answer, explain }`.
Base flashcard: `{ id, day, lesson, topic, front, back }`.

Add to any item:

```js
level: 5,                      // 1–5, the ladder rung this item tests/teaches
kind:  "reconcile-discordant"  // one of the KIND enum below
```

**`kind` enum** (exactly these strings):

| kind                   | what it tests                                                              |
|------------------------|----------------------------------------------------------------------------|
| `recall`               | plain fact recall (L1–L3 only — never tag an L4/5 item `recall`)            |
| `quantitative`         | a four-part number item (requires a `quant` object — §3)                    |
| `evidence`             | a trial used at design level (requires an `evidence` object — §4)           |
| `operative-step`       | a step of an operation with its hazard/technique                           |
| `complication-rescue`  | recognition → response to an intraoperative/post-op complication           |
| `when-not-to`          | when NOT to operate / abort / stage / convert                              |
| `dosed-algorithm`      | an ordered, dosed management algorithm for a lethal event                  |
| `reconcile-discordant` | resolving conflicting data (discordant echo, mixed shock picture) to a plan|

**Rules `validate-depth.js` enforces on tagged items:**
- `level` must be an integer 1–5; `kind` must be in the enum.
- An item with `level >= 4` must **not** have `kind: "recall"` (failure tell #1/#2 in card form).
- `kind: "quantitative"` requires a populated `quant` object (§3).
- `kind: "evidence"` requires a populated `evidence` object (§4).

**Counting note.** Four-part quantitative items are counted across **both** flashcards and questions.
Decision-type items (`when-not-to`, `complication-rescue`, `dosed-algorithm`) and `operative-step` /
`evidence` items are counted from **questions** (they are the graded assessment surface).

---

## 3. The `quant` object (the four-part quantitative rule — Part 2.5 of the plan)

Required whenever `kind: "quantitative"`. All four keys must be non-empty strings:

```js
kind: "quantitative",
level: 3,
quant: {
  number:    "Mean gradient ≥ 40 mmHg / Vmax ≥ 4 m/s / AVA ≤ 1.0 cm² defines severe AS",
  condition: "holds at normal transvalvular flow",
  exception: "low-flow states (low EF, or a small hypertrophied cavity) let a genuinely severe valve show a low gradient",
  resolver:  "dimensionless index ≤ 0.25, AVA, CT calcium score, and a dobutamine challenge separating true-severe (gradient rises, AVA stays ≤ 1.0) from pseudo-severe (AVA opens past 1.0)"
}
```

A `quant` item missing any of the four keys is counted as a **naked number** (failure tell #1) and
does **not** count toward the day's four-part floor. `source` (§4) may optionally be added to point
into Appendix E of the plan.

---

## 4. The `evidence` object (trial-at-design-level — the countermeasure to the name-drop tell)

Required whenever `kind: "evidence"`. Mirrors the fixed Appendix-C dossier format. Required keys:
`population`, `endpoint`, `effect`, `limitation`, plus a `source` pointer into Appendix E of the plan
(the bracketed tags, e.g. `[FRE]`). `trial` and `tradeoff` are recommended.

```js
kind: "evidence",
level: 5,
evidence: {
  trial:      "FREEDOM",
  population:  "diabetics with multivessel coronary disease",
  comparison:  "CABG vs PCI with drug-eluting stents",            // recommended
  endpoint:    "composite of all-cause death, MI, or stroke at ~5 years",
  effect:      "CABG superior — lower composite driven by fewer deaths and MIs",
  tradeoff:    "higher early stroke rate with CABG",              // recommended
  limitation:  "enrolled before current-generation DES and physiology-guided complete-revascularization PCI",
  source:      "[FRE]"                                            // → Appendix E of DAY_CONTENT_UPGRADE_PLAN.md
}
```

An `evidence` item missing any required key is a **name-drop trial** (failure tell #2) and is
reported as an error, not merely uncounted.

---

## 5. Backward compatibility & the VERIFY convention

- All fields are optional; untagged legacy content validates exactly as before under the four
  existing validators. `validate-depth.js` is the *only* consumer of these fields, and it is a
  **new, separate** gate.
- Any number/dose/trial figure the author cannot re-verify at authoring time ships with the
  qualitative claim intact and an inline `<!-- VERIFY: ... -->` marker, and is logged to
  `VERIFY_QUEUE.md`. A VERIFY flag is a strength, not a weakness — it is how content ships *honest*
  while a human closes the loop.

---

## 6. Minimal worked item set (copy-paste starting points)

```js
// Four-part quantitative flashcard (Day 3 — Coronary Physiology)
{
  id: "fc-d3-ffr", day: 3, lesson: "d2-o2", topic: "Coronary",
  level: 3, kind: "quantitative",
  front: "<p>FFR ≤ 0.80 defines a significant lesion — under what condition, what breaks it, and what resolves it?</p>",
  back:  "<p>...</p>",
  quant: {
    number:    "FFR ≤ 0.80 (iFR ≤ 0.89) = physiologically significant epicardial stenosis",
    condition: "FFR requires adequate maximal hyperemia (adenosine or equivalent on board)",
    exception: "microvascular disease and severe LVH uncouple FFR from the epicardial stenosis",
    resolver:  "ensure adequate hyperemia, or use the hyperemia-free iFR near a 0.89 cutoff",
    source:    "[REV]"
  }
}

// Dosed-algorithm MCQ (Day 13 — ICU)
{
  id: "q-d13-vaso5", day: 13, lesson: "d13-vaso", topic: "ICU",
  level: 5, kind: "dosed-algorithm",
  stem: "<p>Fresh post-CABG: CI 1.6, MAP 55, SVR 480, CVP 8, PCWP 10, SvO₂ 72%, rising lactate, on norepinephrine 0.2 µg/kg/min. Physiology and next agent?</p>",
  options: ["Vasoplegia — add vasopressin, then methylene blue if refractory", "Hypovolemia — 2 L crystalloid", "LV failure — inotrope + IABP", "Tamponade — reopen the chest"],
  answer: 0,
  explain: "<p>Low SVR with a high-normal SvO₂ and low-normal filling pressures is distributive shock...</p>"
}

// Evidence MCQ (Day 7 — CABG)
{
  id: "q-d7-freedom", day: 7, lesson: "d6-indications", topic: "CABG",
  level: 5, kind: "evidence",
  stem: "<p>Why weight FREEDOM heavily for a diabetic with three-vessel disease, and where is it vulnerable?</p>",
  options: ["...", "...", "...", "..."], answer: 0,
  explain: "<p>...</p>",
  evidence: {
    trial: "FREEDOM", population: "diabetics with multivessel disease",
    comparison: "CABG vs PCI with DES", endpoint: "death/MI/stroke composite at ~5 years",
    effect: "CABG superior, driven by fewer deaths and MIs", tradeoff: "more early stroke with CABG",
    limitation: "predates current-generation DES and complete-revascularization PCI", source: "[FRE]"
  }
}
```
