# Content Upgrade — 14-Day Plan (2026-07-16)

**Goal:** deepen every lesson page with meaningful sourced content, explain every image, and grow
the question bank per day. Source of truth for content: the PDFs in the project root.

**Decisions taken (2026-07-16):**
- **Questions:** no fixed per-day target. Validator changes from `=== 35` to a `>= 35` **floor**;
  each day grows by as many genuinely good questions as its content supports (uneven counts OK).
- **Image explanations:** authored as **prose in the lesson chunk**, not as a new data field.
- **Cloze cards:** **do not add any** (user instruction, 2026-07-16). Figure chunks are tagged
  `figure: true` to exempt them from the per-chunk card quota.
- **Sequencing:** **Days 1–5 first** as a reviewable batch, then 6–9, then 10–14.

## STATUS (2026-07-16)

| Step | State |
|---|---|
| 0. PDF decoder | ✅ **done + verified.** 0/31,521 lines scrambled; 308/310 figure captions. |
| 2. Question validator → floor | ✅ **done.** `!== 35` → `< 35`. |
| 3. **Day 1** | ✅ **done + browser-verified.** 24 figure chunks, 24 single-figure slots, 35→45 questions. |
| 4. Days 2–5 (figures/questions) | ⬜ still open — resume here. Full instructions in `master_slate.md`. |
| **Lesson readability/depth pass, Days 1–5** | ✅ **done 2026-07-20** (separate track, see below). |
| **Lesson readability/depth pass, Days 6–10** | ✅ **done 2026-07-20** (same track; d5/d6/d7/d8/d9 files). |
| **Lesson readability/depth pass, Days 11–14** | ✅ **done 2026-07-20** — COMPLETES all 14 days (d11/d12/d13/d14 files). |
| Days 6–14 (figures/questions track) | ⬜ not started (separate from the readability track above). |

**Lesson readability/depth pass (2026-07-20, separate from the figure/question track):** On user
instruction, rewrote the basic teaching chunks of all 18 curriculum Day 1–5 lessons into the
**Surgeries-tab narrative voice** — mechanism-first prose, plain-language analogies, and well-known
mnemonics (AS→SAD, AR peripheral-sign eponyms, Stanford A/B, alpha-/pH-stat, concentric-vs-eccentric,
S-H-I stunned/hibernating/infarcted, etc.) — deepening **in place** (no chunks added/removed, no
`level`/`kind`/`quant`/`evidence` metadata touched, no new cloze cards). Files: `lessons-d1.js`,
`lessons-d10.js`, `lessons-d2.js`, `lessons-d3.js`, `lessons-d4.js`. `validate-depth` 14/14 and
`validate-card-catalog`/`-image-placements`/`-anatomy`/`-day-ecosystem` all PASS. **Accepted collateral
(user: "don't worry about the cloze cards"):** ~24 lesson-cloze cards now fail
`validate-lesson-cloze-coverage`'s verbatim-grounding check because their quoted source prose was
reworded. L4/L5 and `figure:true` chunks left as-is (already in-voice). Cache →
`cardiac-school-v27-lesson-readability`. Not yet browser-verified.

**Also fixed en route (pre-existing bug):** `validate-image-placements.js` had been *crashing* since
the 07-15 atlas work — it never learned the `groups:[{title,imageIds}]` placement shape. Taught it
both shapes via a `placementIds()` helper.

**Still open, pre-existing, NOT from this work:** `validate-new-card-quality` fails with 45 errors
(duplicate cards in d10-cardioplegia/d10-weaning/d3-ar; answer leaks in `sxcomp-*` cards).

---

## 0. Foundation — unlock the source text (do this first)

`Key Questions in Cardiac Surgery (2nd ed.)` (666 pp) is the origin of all 314 figures, but its
text is **font-scrambled** — this is why past passes leaned on one-line captions.

**Cracked during planning.** Two substitution ciphers, both confirmed against real pages:
- **Body cipher** (`AkzidenzGrotesk-*`): `byte = ascii + 29` (skipping `0x7F`), byte rendered as
  **MacRoman**. Decodes page 158 to clean prose.
- **Display cipher** (`CenturyGothic-*`): `byte = ascii − 29`, plain ASCII.

Font family alone does **not** predict which cipher a span uses (both appear inside CenturyGothic),
and many spans are plain. The extractor therefore classifies **per span** using five rules — see
memory `key-questions-pdf-decoder.md` for the full contract. Result: **0/31,521 lines** residually
scrambled, 308/310 figure captions.

**Build `tools/extract-key-questions-text.py` →**
1. `build_assets/key_questions.txt` — full decoded text, page-numbered.
2. `build_assets/key_questions_figures.json` — per-figure record keyed by the **existing image IDs**
   (`ch01_fig1_p022_...`), carrying the figure's caption, its legend/abbreviation expansion, and the
   surrounding Q&A section text. This is the evidence base for explaining each image.

Already-extracted sources reusable as-is: `build_assets/cs_guide.txt`, `build_assets/cs_primer.txt`,
`build_assets/anatomy_cloze_dump.txt`, plus the Lawton 2021 revascularization guideline (already folded in).

*Gate: spot-check ~10 decoded pages against the rendered PDF before authoring anything.*

---

## 1. Deepen the lesson pages

Days 1–5 = **18 lessons** (day1:4, day2:3, day3:3, day4:5, day5:3). Note the **file→day offset** —
`lessons-dN.js` does not map to day N. **Always grep the `day:` field, never trust the filename.**

Per lesson, working from the decoded source:
- Expand thin chunks into mechanism-first prose matching the existing house style
  (`<p>`/`<ul>`/`<table>`, `kbox pearl|danger|study` callouts, HTML-escaped comparisons).
- Append new teaching chunks where the source supports a genuine gap — **lessons/chunks are uncapped**,
  so this is the non-destructive way to add material.
- Add `type:"checkpoint"` chunks alongside new teaching (4 options, `answer` index, real `explain`).
- Where a chunk carries L4/L5 depth, it must satisfy `validate-depth`: `level` 1–5, a `kind` from the
  enum, and — for `quantitative`/`evidence` kinds — the **complete** `quant{}` / `evidence{}` object
  (partial objects are hard-failed as "naked-number"/"name-drop" tells).

## 2. Explain every image

**The real problem, precisely:** 314 images / 242 placements, but explanation today is a one-line
caption (`"Coronary artery system."`). Worse, placements dump **up to 10 figures at a single anchor**
(e.g. `d4-echo` / `interpreting-key-echo-parameters`), so figures arrive as a wall with no reading.

**Approach (per the prose-in-chunk decision):** split the dumps and narrate each figure inline.
- Re-anchor multi-image lesson galleries from one bulk anchor into **per-figure anchors** in
  `image-placements.js` (data move; no new schema).
- In the chunk HTML, author a short **"what you're looking at → what to notice → why it matters
  surgically"** passage adjacent to each figure, sourced from `key_questions_figures.json`.
- Scope for this batch: the **lesson** surface for Days 1–5. The other surfaces (surgery 47,
  anatomy 24, angiography 13, crisis 14, integration 14, physiology 12) stay untouched here.

> **Tradeoff, confirmed on Day 1:** prose lives in the lesson, so an explanation does **not** travel
> with a figure reused on another surface, and no validator can enforce that a placed figure was
> explained — coverage is checked by eye. A `teach` field on `image-registry.js` would fix both.
> In practice Day 1 was fine (the per-figure chunk/anchor pairing makes gaps visually obvious), so
> the approach carries forward unchanged.

**Day 1 pattern to copy.** One figure per anchor; each figure gets a `figure: true` chunk titled
`"Figure: <what it shows>"` whose prose runs **What you are looking at → What to notice → Why it
matters surgically**. Rebuild the day's placements as single-figure slots, and *assert the flattened
image-id set is unchanged* so no figure is silently dropped.

## 3. Grow the question bank

- `tools/validate-assessment-quality.js:65` — change `dayQs.length !== 35` → `dayQs.length < 35`
  (floor, message reworded). **This is the only cap; every other quality gate stays exactly as-is.**
- Author new questions for Days 1–5 that hold the existing bar, which the validator enforces:
  exactly 4 options · unique normalized stem · `stem` ≥8 words · `explain` ≥8 words · no filler
  options · ids match `q-d{day}-*` and agree with the `day` field · escaped numeric comparisons.
- **Statistical gates are the tricky part** (they are per-day *rates*, so new questions shift them):
  A/B/C/D answer-slot balance · uniquely-longest-correct ≤35% · correct ≥1.5× median distractor ≤35%
  · **≥60% clinical/operative context stems**. Author answer positions and option lengths deliberately,
  then rebalance — `tools/rebalance-*-answer-positions.js` are the existing precedent.

## 4. Cloze cards — OUT OF SCOPE

**Do not add cloze cards** (user instruction, 2026-07-16). The old 25/day ceiling is gone
(`validate.js` = "≥15/day, no upper limit"), so growth is *possible* — but it is not wanted.

This matters because the quota is **coupled to chunk count**: floor = `max(12, teachingChunks*2)` in
BOTH `validate-lesson-cloze-coverage.js` and `validate-card-catalog.js`, and additions must equal it
*exactly*. Adding 24 prose chunks on Day 1 therefore demanded 48 cards. The resolution: tag
figure-reading chunks **`figure: true`**, which exempts them from the quota in both validators, on the
grounds that they explain one image each and their facts belong to the prose chunks beside them.
`validate-lesson-cloze-coverage.js` also hard-codes totals (`additions !== 270`, base 475, sum 745) —
any future card growth must update those too.

---

## 5. Verification (run from `site/`, all must exit 0)

Full suite, unchanged expectations except the question floor:

```
node tools/validate.js                     # lessons/cards/questions structure
node tools/validate-assessment-quality.js  # the edited floor + all quality rates
node tools/validate-depth.js               # must stay 14/14 days
node tools/validate-lesson-cloze-coverage.js
node tools/validate-anatomy.js  validate-trials.js  validate-advanced.js
node tools/validate-surgery.js  validate-physiology.js  validate-image-placements.js
node tools/scan-verify.js
```

Then **browser-verify** (`cd site && python3 -m http.server`): Day 1–5 lessons render, figures sit
beside their prose, checkpoints grade, and the new questions unlock only when their lesson is done
(the `cs_` gating feature).

**Cache:** bump `?v=` in `index.html` **and** `CACHE` in `sw.js` — required whenever media/data files
change or the service worker serves stale content.

**Medical accuracy:** new claims sourced from the PDFs get `<!-- VERIFY -->` markers and rows appended
to `docs/reference/VERIFY_QUEUE.md`, consistent with the existing 30-row clinician queue. This pass
does **not** close that human-review gate — it adds to it.

---

## 6. Order of work

| # | Step | Output |
|---|---|---|
| 1 | Build + spot-check the PDF decoder | `key_questions.txt`, `key_questions_figures.json` |
| 2 | Flip the question validator to a floor | `validate-assessment-quality.js` |
| 3 | **Day 1** end-to-end (prose, figures, questions, cards) | reviewable template |
| 4 | Days 2–5 on the approved pattern | Days 1–5 batch complete |
| 5 | Full validator suite + browser verify + cache bump | all green |
| 6 | Log to `docs/ongoing_memory.md`; update `plan.md` | history current |

Days 6–9 and 10–14 follow as separate batches after this one is reviewed.
