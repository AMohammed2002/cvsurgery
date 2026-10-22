# CardiacSchool: Visual Polish Plan (October 2026)

**Status:** plan only, not started
**Lenses:** taste skill (anti-slop layout, colour, shape and copy rules) + Emil Kowalski design engineering (motion decisions, how interaction feels, small details)
**Evidence:** `docs/plans/visual-audit-2026-10/*.png`: 22 screenshots of the live build at 1440×900, light and dark, taken 2026-10-20 with `_shoot.js` (Playwright + `python3 -m http.server 8765` from `site/`)
**Scope:** `site/css/**`, the view templates in `site/js/app.js`, `academy-story.js`, `experience.js`, `staff-tour.js`. **No content, SRS, gating, scoring or validator changes.**

---

## 0. Design read and dials

> **Reading this as:** a desktop study workstation for surgical trainees, built in a warm, friendly-academic style (coral / navy / saffron, Figtree). This is a **redesign that preserves** the current look and pulls it together into one native-CSS token system.

This is the third visual plan. Neither of the first two was implemented: `CINEMATIC_UI_UPGRADE_PLAN.md`, and the "Archive" plan (whose `visual_overhaul.md` no longer exists). The live app has since moved to a newer **coral/navy/saffron "academy"** look (Sep–Oct: `experience.css`, `academy-story.css`, `staff-tour.css`). **This plan does not add a fourth style.** The current look is decent. The visual debt comes from four older style layers still sitting underneath it, and that debt is what this plan pays down.

| Surface | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY | Why |
|---|---|---|---|---|
| Study surfaces (lesson, cards, MCQ, exam) | 3 | 3 | 5 | Opened 100+ times a day. Should be calm, fast and predictable. |
| Hubs (plan, day circuit, surgeries, anatomy, trials, crisis, extras, progress) | 5 | 4 | 5 | Navigation pages. Hierarchy matters more than decoration. |
| Home story / labs gallery | 7 | 6 | 3 | Seen rarely, so they can carry some personality. |

**Scope note on the taste skill.** It is written for landing pages and explicitly excludes dense product UI. Only the home story page gets its landing-page rules (hero stack, CTA intent, scroll cues). Every surface gets its universal rules: colour lock, shape lock, theme lock, eyebrow budget, no emoji, no fake-precision chrome. **Medical lesson prose is out of scope for the em-dash ban.** Changing it would fight the content validators. The ban applies to UI chrome strings only.

---

## 1. What the audit found

### 1.1 Four token layers fight over `:root` (root cause of most visual debt)

| File | Palette it declares | Where it still leaks into the live app |
|---|---|---|
| `style.css` | terracotta `#a84435` / brass `#d5a642` / cream `#f7f2e9` | fallback values; `--study`, `--mnem` violet, `--override` violet |
| `studio.css` | teal `#087f83` / dark `#66dcc8` | **teal lesson progress bar in dark mode** (`04-lesson-dark`) |
| `experience.css` | coral `#de4968` / navy `#202c46` / cobalt `#465ccb` | this is the live brand |
| `academy-story.css`, `staff-tour.css` | own namespaces `--story-*`, `--staff-*` with near-duplicates (`#ed536f`, `#d83f60`, `#de4968`: three corals) | home, arrival gate |

Measured: **1,010 distinct hex colours**, **334 `!important`**, ~30 distinct `border-radius` values (5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 55px, 99px, 999px…), 9 different `cubic-bezier`s, ~20 distinct durations.

Visible results:
- **Question Bank hero is lavender/violet** (`06-quiz`) on an otherwise coral app.
- **Day-circuit station kickers come in four colours**: teal Anatomy, orange Operations, violet Evidence, navy Crisis (`03-day1`).
- **The CPB workstation is its own terracotta "Perfusion Studio" world** (`13-cpb-light`), with its own wordmark ("CARDIACSCHOOL PERFUSION STUDIO") and buttons in yet another red.

### 1.2 Brand colour and "danger/incorrect" share a hue (a correctness problem in a medical trainer)
Primary CTA = coral-red `#de4968`. Wrong MCQ option = pink-red. DANGER callout = pink-red. "Educational objective" callout = pink with a coral bar. Flashcard empty-state ✓ = coral (`05-cards`, `21b-quiz-answered`, `04b-lesson-scrolled`). In the answered-question screen, the **wrong answer, the learning objective and the Next button are all one colour family.** Feedback must never depend on brand colour.

### 1.3 Theme lock is broken
- `01-today-dark` matches `01-today-light` pixel for pixel. **The home story ignores dark mode**, header included.
- `13-cpb-dark`: the header flips to navy and the whole workstation stays cream. You get two themes on one screen.

### 1.4 Hub pages are all one template
Surgeries, Anatomy, Trials, Progress and Question Bank all open with the same stack: H1 → paragraph → **row of equal stat tiles with a gradient left stripe** → equal card grid. On first run the tiles say `0`, `0`, `—`, `0` (`07-surgery`, `12-progress`). They take ~180px and give no information.
- **Grids leave orphans:** Extras 3+3+2, Trials 4+3, Anatomy 5+2 (taste: N items → N cells, no gap at the end).
- **The same icon-in-grey-circle + chevron** appears on every card (Extras, Question Bank).
- **Intros run long.** The Surgeries intro is 62 words and includes "a mind wiped clean… PGY-5 depth… every question you can get pimped on", which goes against the roadmap rule to drop rank language.
- **Course Override** (an admin password box with a 🔐 emoji) sits at the top of the 14-Day Plan, above Day 1 (`02-plan`).
- **Plan rows are walls of chips.** Day 2 has 11 equal-weight pills mixing lessons, labs, surgeries and crises.

### 1.5 Eyebrows, numbering and micro-labels everywhere
`THE SCHOOL OF CARDIAC SURGERY`, `DAY 1 · CONNECTED CIRCUIT`, `CONNECTED CLOZE DECK`, `ASSESS`, `REHEARSE FAILURE BEFORE IT IS REAL`, `EXTENDED TRAINING`, `OR INTERCOM · FREE PRACTICE`, `HLM-01 • EDUCATIONAL WORKSTATION`, `01 Build the mechanism / 02 Close the clinical loop`, `CR-01…CR-14`, `01 — 14`, `MOVE TO EXPLORE · SELECT TO ENTER`. Nearly every page header has one. Taste budget: at most 1 per 3 sections. Numbered-section eyebrows and code labels are banned outright.

### 1.6 Home story page
- **The hero carries ~9 text elements** (budget is 4): eyebrow, 3-line headline, 2-line sub, two CTAs, `• 14-DAY COURSE` dot strip, `SCROLL TO FIND YOUR FLOW` scroll cue, `14 LABS. COUNTLESS CONNECTIONS.` strip, "Go beyond the textbook" sticker, a floating ↗ button.
- **The same CTA intent appears 5 times:** "Continue learning" (nav + hero), "Pick up your lesson", "View the 14-day course", "Find your next discovery".
- **The pinned chapter section is a ~2,000px empty saffron block** whenever the JS scene isn't driving it (`01b-today-full`). It is driven by `addEventListener('scroll')` (`academy-story.js:113`), which the taste skill bans. Use scroll-driven CSS / IntersectionObserver instead.
- **Product question:** a returning learner lands every day on a marketing hero ("Learn it. Feel it. Know it.") and not on *today's work*. See Decision D1.

### 1.7 Study surfaces (highest frequency, so highest return)
- **No `scroll-padding-top` for the fixed 88px header.** After answering, the question stem scrolls *under* the header (`21b`). The "Achievement unlocked" toast covers the header CTA.
- **Lesson reader:** the 780px content card sits in a 1,216px column, leaving dead gutters. The reading-progress hairline sits 250px above the text. The pink "Connected cloze deck" banner is the loudest thing on the page and it sits *above* the lesson.
- **The answer explanation is one grey box of dense text.** "✗ The best answer is…" uses a text glyph, and the verdict, explanation, decision rule and objective have no structure.
- **Flashcard empty state:** the "All clear! 🧠" heading is **left-aligned while everything else is centred** (alignment bug), uses an emoji, and has a coral ✓.
- **Global `body{letter-spacing:-.015em}`** (`experience.css:4`) tightens 15–17px body text. Negative tracking belongs on display sizes only.

### 1.8 Motion
- **The physiology gallery entrance is still mid-flight at 1.3s** (`08-physiology`). Cards are scattered, the title is blurred and covered by cards, and there is a "Replay entrance" control. It plays on every visit.
- 162 `:hover` rules but only 1 `@media (hover:hover)` gate. Lower priority on a desktop-first app, but cheap to fix.
- Overshoot curves (`cubic-bezier(.34,1.56,.64,1)`, `(.2,.9,.3,1.25)`) are mixed with flat ones. There is no motion token set, so every file invents its own.
- Good, keep: `spring.js`, the swipe-to-grade flashcards, the delegated `.pressing` press feedback, reduced-motion blocks in 15 files.

---

## 2. Before / After (Emil review format)

| Before | After | Why |
|---|---|---|
| 4 `:root` layers (style → studio → experience → story/staff) | One `css/tokens.css` loaded first; other files only *consume* tokens | Every new page inherits the brand instead of whichever layer won |
| `--primary` coral and `--danger` red in the same hue family | Brand coral stays for CTAs/nav; `--danger` → deep crimson **plus** ✕ icon + "Incorrect" label + 3px left bar; objective/pearl callouts move to navy/saffron tints | Correct/incorrect must not depend on hue alone, and never on the brand colour |
| ~30 radius values | `--r-xs 6` (inputs, chips) · `--r-sm 10` (buttons-in-cards, options) · `--r 16` (cards, panels) · `--r-pill 999` (primary CTAs, filters) | Shape lock: one documented rule |
| 351 ad-hoc `box-shadow`s | `--shadow-1` (resting) / `--shadow-2` (raised, popovers), tinted navy `rgb(32 44 70 / …)` | Shadow tinted to the background, no grey-black |
| 9 cubic-beziers, ~20 durations | `--ease-out: cubic-bezier(.23,1,.32,1)` · `--ease-in-out: cubic-bezier(.77,0,.175,1)` · `--ease-drawer: cubic-bezier(.32,.72,0,1)`; `--dur-press 120ms` · `--dur-fast 160ms` · `--dur-base 220ms` · `--dur-slow 360ms` | One motion personality; UI stays under 300ms |
| Gallery entrance > 1.3s, title covered, replays every visit | Cards rise from `translateY(12px) scale(.96); opacity:0`, 40ms stagger, whole scene readable by **≤ 650ms**; title never covered; plays once per session (`sessionStorage`), "Replay" stays | Seen rarely, so it can delight, but it must not block reading |
| `addEventListener('scroll', …)` driving the home chapter | `animation-timeline: view()` with an IntersectionObserver class-toggle fallback; section collapses to static content when unsupported | No main-thread scroll work; no empty saffron block |
| Answer reveal scrolls the stem under the header | `html{scroll-padding-top:calc(var(--header-h) + 16px)}`; `--header-h:72px` | The question being explained stays in view |
| Toast drops in over the header CTA | Toast anchored `top: calc(var(--header-h) + 12px); right: 24px`, enters `translateY(-8px) → 0` 220ms `--ease-out`, exits 160ms opacity only | Doesn't cover controls; exit is faster than enter |
| Keyboard grade (1–4 / Space) runs the same spring as a swipe | Keyboard path: ≤ 150ms opacity/translate commit, or none; spring stays for pointer drags | Emil: never animate keyboard actions repeated hundreds of times a day |
| `body{letter-spacing:-.015em}` | `body` 0; `h1 -.028em`, `h2 -.02em`, `h3 -.01em` | Tight tracking belongs on display type only |
| Stat-tile rows of `0 / — / 0` | One inline status line ("13 operations · 0 read · 367 MCQs") or a single *next action* panel | No empty dashboard chrome on first run |
| `:hover` transforms ungated | Wrap transform/elevation hovers in `@media (hover:hover) and (pointer:fine)` | No sticky hover on touch laptops/iPad |
| "All clear! 🧠" left-aligned, coral ✓ | Centred, no emoji, `--ok` check, one line of next-step copy + one button | Alignment bug, emoji policy, semantic colour |

---

## 3. Decisions for the user (blocking only where noted)

- **D1 — Home for returning learners (blocks Phase 6).** *Recommended:* students land on a **Today desk** (current day, next lesson, cards due, today's station progress), and the story page becomes the first-visit/staff-preview route (`#/welcome`). Alternative: keep the story as home and only trim it.
- **D2 — Lab workstations in dark mode (blocks Phase 2b).** *Recommended:* CPB console / OR monitor become **always-dark "stage" surfaces** using the existing `--stage-*` tokens in `studio.css`. A monitor looks like a monitor in both themes, and this is a documented exception to theme lock. Alternative: give them full light/dark variants.
- **D3 — Course Override placement.** *Recommended:* move it to the bottom of Progress (or behind a `⋯` settings menu), never above Day 1.

---

## 4. Phased plan

Run phases in order. Phases 3–5 can fan out to parallel subagents with **disjoint file lists**. Each subagent follows a "use tokens only, report missing tokens, don't invent" rule.

### Phase 0 — Guardrails (serial, ~0.5 day)
1. `git init` + baseline commit (the repo is still unversioned. Today the only safety net is `backups/`).
2. Move `docs/plans/visual-audit-2026-10/_shoot.js` → `site/tools/screenshot.js`. Extend it to 15 routes × 2 themes, plus an "unlocked Day 1" pass (seed `cs_done`) and a 1280px pass. Commit the baseline PNGs.
3. Record validator status (`node tools/validate*.js`) so "zero new failures" can be checked later.

### Phase 1 — Token consolidation (serial, ~1.5 days, biggest lift)
1. Create `site/css/tokens.css` and load it **first** in `index.html`. Contents: colour (brand coral, navy ink, saffron, cobalt as a *secondary illustration colour only*, neutrals, semantic ok/warn/danger/info with `-bg`/`-border`), radius, shadow, motion, type scale, `--header-h`, and a z-index scale (`--z-header 300`, `--z-toast 1000`, `--z-modal 1050`, `--z-arrival 1100`, replacing literal 1000/1030/1040/1050/1100).
2. Delete the `:root` / `[data-theme=dark]` palette blocks from `style.css`, `studio.css`, `experience.css`. Alias `--story-*` / `--staff-*` to the core tokens instead of new hexes.
3. **Separate semantic colour from brand colour** (§2 row 2). Retint the `.callout.danger / .pearl / .objective / .mnem` family so none use coral.
4. Collapse the four station-kicker colours into one ink colour with a distinct **icon** per station type. The Question Bank hero loses violet.
5. Sweep radii to the 4-step scale. Target: under 60 hard-coded hexes outside `tokens.css` (from 1,010), and `!important` cut by half (each removal checked in the screenshot diff).

### Phase 2 — Theme lock (serial, ~1 day)
- **2a:** dark variants for the home story (`academy-story.css`) and the header there. Saffron fields become deep navy with a saffron accent. Never invert one section only.
- **2b:** per D2, convert `cpb-workstation.css`, `or-monitor.css` and `cpb-labs.css` to `--stage-*` tokens. Remove the "Perfusion Studio" sub-wordmark and use the app header + a plain "CPB console" title.
- Fix `meta theme-color` to follow the theme.

### Phase 3 — Shell and hub pages (parallel, ~2 days)
- **Page header component** in `components.css`: H1 + one sentence ≤ 25 words, `max-width:65ch`. Drop all hub eyebrows; the only one kept is the "Day N" eyebrow on day pages. Rewrite the Surgeries / Trials / Anatomy intros. Remove rank language.
- **Replace stat-tile rows** on Surgeries, Anatomy, Trials, Question Bank, Progress with an inline `.stat-line` (tabular numerals, `·` once per line max) or hide them until non-zero.
- **Fix the grids:** Extras 8 → 2 featured wide tiles (Surgeries, Physiology Labs) + 6 in a 3×2. Trials/Anatomy switch to `repeat(auto-fill,minmax(260px,1fr))` so rows fill naturally, or move to a dense list for >8 items. Drop the icon-in-grey-circle and use one line icon inline with the title.
- **Remove** `01/02` section numerals, `CR-0x` codes, `01 — 14` pagination, `MOVE TO EXPLORE · SELECT TO ENTER`, `HLM-01 • EDUCATIONAL WORKSTATION` and `•` decorative dots.
- **14-Day Plan:** Course Override moves (D3). Each day row shows *Lessons* (named links) and one *Practice* line ("2 labs · 1 operation · 1 crisis") that expands, in place of 11 equal pills. The current day gets a coral marker, locked days drop to 55% ink, done days get an `--ok` tick.
- **Header:** 88 → 72px; single-line "CardiacSchool" wordmark; the search icon gets a visible label/`⌘K` hint.

### Phase 4 — Study surfaces (parallel, ~2 days)
- **Global:** `scroll-padding-top`, toast anchoring (§2), body tracking fix.
- **Lesson reader:** content column `max-width:72ch` centred, no dead card chrome (card → plain surface with a 1px border, or no card). Sticky slim progress bar under the header carrying the lesson title + `3/12`. The cloze-deck banner moves to the **end** of the lesson as the "what's next" step, with a one-line lock status at the top if needed. Callouts get icon + label + tint (danger crimson, pearl saffron, mnemonic cobalt).
- **MCQ answered state:** verdict row (icon + "Correct"/"Incorrect" + chosen vs best answer), then explanation, **Decision rule** as a highlighted 1–2 line rule, objective as a quiet footnote. Options: correct = `--ok` border + ✓, chosen-wrong = `--danger` border + ✕, the rest fade to 60%. Rows get no extra animation beyond the existing one-shot reveal.
- **Flashcards:** empty state fix (§2). Check the card face uses `--r` and `--shadow-2`, and that front/back type sizes follow the scale. Keyboard grade path per §2.
- **Exam:** check the flag/timer chrome uses tokens; no new motion.

### Phase 5 — Motion pass (parallel with 4, ~1 day)
Follow Emil's frequency table:
| Surface | Frequency | Treatment |
|---|---|---|
| Card grade (keyboard), MCQ option select, nav | 100+/day | none or ≤ 150ms; `.pressing` scale .97 stays |
| Page transition (`pagein`) | tens/day | cut to 160ms opacity + 4px rise, `--ease-out`; no scale |
| Dropdown menus (Learn/Practice/Library) | tens/day | 160ms, `transform-origin` at trigger, from `scale(.97) translateY(-4px)`; instant swap when moving between open menus |
| Toast, dialogs, tour box | occasional | 220ms enter / 160ms exit; tour box scales from its anchor |
| Physiology gallery, home story, level-up | rare | delight allowed; ≤ 650ms to readable; once per session |
- Replace all overshoot curves on UI elements. Keep bounce only on the correct-answer `optpop` (≤ 0.15 bounce) and swipe-dismiss.
- Gate hover transforms behind `(hover:hover) and (pointer:fine)`.
- Under reduced motion, keep opacity fades and drop translate/scale. Test every new piece.

### Phase 6 — Home (after D1, ~1.5 days)
- **If Today desk:** the left column holds the current day title and the next-lesson CTA (the *only* "Continue learning" on the page). The right column holds cards due today plus the 5-station progress for the day. Below that sits a compact 14-day strip. Story moves to `#/welcome`.
- **Story page either way:** hero trimmed to eyebrow-or-nothing + headline + ≤ 20-word sub + one primary + one secondary CTA. Remove the scroll cue, dot strip, label strip, floating ↗ and sticker. The pinned chapter moves to scroll-driven CSS (§2). Drop the giant watermark word. One CTA label per intent across nav/hero/footer.

### Phase 7 — Verification (serial, ~0.5 day)
- Re-run `site/tools/screenshot.js`; review each route's light/dark pair side by side against the baseline.
- Check contrast: every text/background token pair ≥ 4.5:1 (AA), CTA text on coral and on dark pink `#f58ca3`, locked-state text at 55%.
- Validators: zero new failures vs Phase 0.
- Bump cache-busters (`?v=` in `index.html`, `CACHE` in `sw.js`); do a cold-offline smoke test.
- Review the motion the next day at 0.25× speed in DevTools Animations (Emil).

---

## 5. Pre-flight checklist (run before calling any phase done)
- [ ] One `:root` palette; no new hex outside `tokens.css`
- [ ] Brand coral never used to mean danger/incorrect; feedback carries icon + label
- [ ] Radii ∈ {6, 10, 16, 999}; shadows ∈ {shadow-1, shadow-2}
- [ ] Every route identical in structure between light and dark; no half-themed screens (stage surfaces excepted per D2)
- [ ] Eyebrows ≤ 1 per 3 sections; no numbered/code labels; no decorative dots; no emoji in chrome; no em-dash in chrome strings
- [ ] No orphaned grid cells; no all-zero stat rows
- [ ] One CTA label per intent per page
- [ ] UI motion ≤ 300ms, custom ease-out, nothing on keyboard actions, reduced-motion verified
- [ ] No `addEventListener('scroll')` for visuals
- [ ] Fixed header never covers focused/scrolled-to content
- [ ] Validators unchanged; cache-busters bumped

## 6. Out of scope
Content and medical prose, SRS/gating/scoring logic, mobile layouts (roadmap: desktop-first; keep mobile functional only), the CINEMATIC "performance climate" engine, and the Archive style. If either of those comes back, it should build on Phase 1's `tokens.css`.
