# ScalpelSchool — Complete Description & Build Manual

*A full, self-contained specification of the ScalpelSchool web app: what it is, exactly how every part works, and a step-by-step recipe to rebuild the identical website for ANY medical rotation from a source PDF/curriculum. This document is written so that a less powerful model (e.g. Haiku) can follow it literally, file by file, and produce a working, error-free clone.*

---

## PART 0 — TABLE OF CONTENTS

1. What the website is (the elevator pitch and design philosophy)
2. The technology stack and "zero-build" architecture
3. The exact file tree
4. How the app boots and routes (the engine, line by line)
5. The data model — every object schema, exactly
6. The flashcard system (Anki-style spaced repetition)
7. The MCQ / question-bank system
8. The mock exam engine
9. The lesson player
10. The interactive exercises (sequence + click-the-anatomy)
11. Progress tracking (heatmap, rings, stats, per-topic accuracy)
12. Gamification (XP, levels, streaks, achievements, daily quests)
13. The UI / interface / dashboard, screen by screen
14. The three standalone, isolated modules (Anatomy, Anatomy Flashcards, Trials)
15. The design system / CSS tokens
16. The validators
17. **HOW TO BUILD THIS FOR A NEW ROTATION** — the full recipe
18. Content authoring rules that must never be broken
19. Final checklist

---

## PART 1 — WHAT THE WEBSITE IS

**ScalpelSchool** is a single-page study web application that trains a medical student to exam level in a defined window of days (the original is a **14-day General Surgery trainer**, with extra depth in breast and thoracic surgery, aimed at Royal College exam standard). It bundles, in one cohesive product:

- A **day-by-day curriculum** (a "spiral" plan that interleaves core topics first, then subspecialties, with built-in review days).
- **Micro-lessons** ("textbook-esque" teaching split into short chunks, each ≤350 words, with embedded knowledge-check "checkpoints").
- **Spaced-repetition flashcards** using a faithful re-implementation of the Anki scheduler (learning steps → graduated intervals → ease factor → lapse handling).
- A **single-best-answer MCQ question bank** in exam style, with teaching explanations and immediate feedback.
- A **timed mock exam** (75 questions, 90 minutes, no feedback until submission, with a per-topic performance breakdown afterwards).
- **Interactive exercises**: "sequence builders" (put operative steps in order) and "click-the-anatomy" labelling drills on inline SVG diagrams.
- A full **gamification layer**: XP, 10 levels, daily streaks, a study-activity heatmap, 21 achievements/badges, daily quests, level-up confetti, and floating "+XP" chips.
- A **progress dashboard** with completion rings, stat counters, a contribution-style heatmap, per-day curriculum bars, and per-topic MCQ accuracy.
- Three **fully isolated bonus modules** that can be deleted without touching the core app: an **Anatomy review** library, an **Anatomy cloze-flashcard** deck (its own separate spaced-repetition store), and a **landmark Trials** section (trial summaries + self-test MCQs).

The pedagogy is deliberate and stated to the user on the dashboard: it is built on **chunking** (short lessons), **retrieval practice** (checkpoints + MCQs), **spaced repetition** (flashcards), and **dual coding** (diagrams + mnemonics).

**Design philosophy in one line:** zero-build, zero-dependency, zero-server. It is plain HTML + CSS + vanilla JavaScript. You open `index.html` directly in a browser (or serve the folder statically, e.g. `python3 -m http.server`) and everything works. **All progress is stored in the browser's `localStorage`** under keys prefixed with `st_`. There is no backend, no account, no network call except loading Google Fonts.

---

## PART 2 — TECHNOLOGY STACK & "ZERO-BUILD" ARCHITECTURE

- **No frameworks.** No React/Vue/Svelte, no bundler, no npm install, no package.json required to run. The only Node usage is the optional command-line **validators** (`tools/validate*.js`) which structurally check the data files.
- **Loading model:** `index.html` loads, in order, (1) the CSS, (2) every data file as a plain `<script>` that assigns to a `window.*` global, then (3) the engine `js/app.js`, then (4) the isolated modules. Because each data file just does `window.LESSONS["id"] = {...}` or `window.QUESTIONS.push(...)`, load order matters and is fixed in `index.html`.
- **Rendering model:** a **hash router**. The engine reads `location.hash` (e.g. `#/quiz/day/3`), splits it, and calls a `viewX()` function that sets `document.querySelector("#main").innerHTML = ...` to a freshly built HTML string. There is no virtual DOM — every view is a template literal that is dropped into `#main`, then event handlers (`onclick`) are wired up immediately after.
- **State model:** a tiny `Store` wrapper over `localStorage` with JSON serialization. Every key is namespaced `st_`. There is no reactive state; after any state change the relevant `viewX()` is re-run or a small helper (`renderNav()`, `renderXP()`) is called to repaint just that piece.

---

## PART 3 — THE EXACT FILE TREE

```
/ (project root — open index.html here)
├── index.html                      ← the only HTML file; loads everything
├── css/
│   ├── style.css                   ← the entire design system + every component
│   ├── anatomy.css                 ← styles for the isolated Anatomy module
│   └── trials.css                  ← styles for the isolated Trials module
├── js/
│   ├── app.js                      ← THE ENGINE: router, scheduler, all views, gamification
│   ├── data/
│   │   ├── curriculum.js           ← window.CURRICULUM (the 14 days)
│   │   ├── diagrams.js             ← window.DG (themable inline SVGs, clickable zones)
│   │   ├── lessons-foundations.js  ← append to window.LESSONS
│   │   ├── lessons-abdomen.js      ← append to window.LESSONS
│   │   ├── lessons-gi.js           ← append to window.LESSONS
│   │   ├── lessons-breast.js       ← append to window.LESSONS
│   │   ├── lessons-thoracic.js     ← append to window.LESSONS
│   │   ├── lessons-endocrine-trauma.js ← append to window.LESSONS
│   │   ├── flashcards.js           ← window.FLASHCARDS = [...]
│   │   ├── flashcards2.js          ← more FLASHCARDS (push/concat)
│   │   ├── flashcards3.js          ← more FLASHCARDS
│   │   ├── questions.js            ← window.QUESTIONS = [...]
│   │   ├── questions2.js           ← more QUESTIONS
│   │   ├── questions3.js           ← more QUESTIONS
│   │   ├── questions4.js           ← more QUESTIONS
│   │   └── exercises.js            ← window.EXERCISES = [...]
│   ├── anatomy/   (ISOLATED module — safe to delete)
│   │   ├── anatomy-base.js         ← window.ANATOMY = {categories,regions,cards}
│   │   ├── diagrams.js             ← window.ADG (anatomy SVGs)
│   │   ├── regions-<cat>.js  ×8    ← push regions
│   │   ├── cards-<cat>.js    ×8    ← push cloze cards
│   │   ├── anatomy.js              ← window.Anatomy engine (render, renderCards, isolated SRS)
│   │   └── _SPEC.md                ← authoring spec for new anatomy content
│   └── trials/    (ISOLATED module — safe to delete)
│       ├── trials-base.js          ← window.TRIALS = {categories,trials}
│       ├── trials-gensurg.js       ← push trials
│       ├── trials-breast.js        ← push trials
│       ├── trials-thoracic.js      ← push trials
│       ├── trials.js               ← window.Trials engine (render, inline MCQ runner)
│       └── _SPEC.md
└── tools/
    ├── validate.js                 ← validates the core data files (node)
    ├── validate-anatomy.js         ← validates the anatomy module
    └── validate-trials.js          ← validates the trials module
```

The original folder also contains the source `General_Surgery_Rotation_Manual.pdf` (the content the lessons/cards/questions were authored from) and a `slate.md` project log.

---

## PART 4 — HOW THE APP BOOTS AND ROUTES

### 4.1 index.html structure

`index.html` contains a fixed shell:

```html
<div id="app-shell">
  <aside id="sidebar">
    <div class="brand">…logo + "ScalpelSchool" + "14-Day Surgery Trainer"…</div>
    <div id="xp-widget"></div>      <!-- filled by renderXP() -->
    <nav id="main-nav"></nav>       <!-- filled by renderNav() -->
    <div class="sidebar-foot"><button id="theme-toggle"></button></div>
  </aside>
  <main id="main" tabindex="-1"></main>   <!-- every view renders here -->
  <nav id="bottom-nav"></nav>             <!-- mobile tab bar -->
</div>
```

The `<head>` preconnects to Google Fonts and loads three families — **Figtree** (body), **Noto Sans** (fallback/CJK), and **Sora** (display headings) — plus the three CSS files. The favicon is an inline SVG data-URI of the ⚕ symbol.

After the shell, scripts load in this exact order (DO NOT reorder): `curriculum.js`, `diagrams.js`, the six `lessons-*.js`, the three `flashcards*.js`, the four `questions*.js`, `exercises.js`, then **`app.js`**, then the anatomy module scripts, then the trials module scripts.

### 4.2 The boot sequence (bottom of app.js)

```js
(function init() {
  window.ALL_LESSONS = Object.values(window.LESSONS || {})
      .sort((a, b) => a.day - b.day || a.ord - b.ord);   // flatten + order lessons
  const savedTheme = Store.get("theme", null);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");
  $("#theme-toggle").onclick = () => { /* flip data-theme, persist, renderNav() */ };
  getStartDate();                       // records day-1 date on first run
  window.addEventListener("hashchange", route);
  route();                              // render the current hash
})();
```

`window.ALL_LESSONS` is the single sorted array the whole app reads from (lessons are *stored* in an object keyed by id for easy lookup, then flattened to an array sorted by `day` then `ord`).

### 4.3 The router

```js
function route() {
  const h = location.hash || "#/";
  const parts = h.slice(2).split("/").map(decodeURIComponent);  // "#/quiz/day/3" → ["quiz","day","3"]
  // page-in animation, then dispatch:
  if (h === "#/" || h === "") viewDashboard();
  else if (parts[0] === "plan") viewPlan();
  else if (parts[0] === "lesson") viewLesson(parts[1]);
  else if (parts[0] === "cards") viewCards();
  else if (parts[0] === "quiz" && parts[1] === "day")   startQuiz(QUESTIONS.filter(q=>q.day===+parts[2]), "Day "+parts[2]+" set");
  else if (parts[0] === "quiz" && parts[1] === "topic") startQuiz(QUESTIONS.filter(q=>q.topic===parts[2]), parts[2]);
  else if (parts[0] === "quiz" && parts[1] === "weak")  startQuiz(/* every missed question */, "Weakness drill");
  else if (parts[0] === "quiz") viewQuizMenu();
  else if (parts[0] === "exam") viewExamIntro();
  else if (parts[0] === "exercises") viewExerciseList();
  else if (parts[0] === "exercise") viewExercise(parts[1]);
  else if (parts[0] === "progress") viewProgress();
  else if (parts[0] === "awards") viewAwards();
  else if (parts[0] === "anatomy"   && window.Anatomy) window.Anatomy.render(parts);
  else if (parts[0] === "anat-cards"&& window.Anatomy) window.Anatomy.renderCards(parts);
  else if (parts[0] === "trials"    && window.Trials)  window.Trials.render(parts);
  else viewDashboard();
  renderNav();
  $("#main").focus({ preventScroll: true });   // accessibility: move focus to content
}
```

The three isolated modules are guarded with `&& window.Anatomy` / `&& window.Trials`, so if those folders are removed the routes simply fall through to the dashboard and the app is unaffected.

### 4.4 The storage layer

```js
const Store = {
  get(k, d) { const v = localStorage.getItem("st_" + k); return v===null ? d : JSON.parse(v); },
  set(k, v) { localStorage.setItem("st_" + k, JSON.stringify(v)); }
};
```

Every persisted key:
`st_startDate, st_done, st_exdone, st_streak, st_activity, st_daily, st_questsDone, st_xp, st_ach, st_srs, st_revCount, st_newToday, st_qstats, st_perfectQuiz, st_bestCombo, st_flawlessEx, st_examPass, st_theme` (plus isolated module keys `st_anat_srs, st_anat_newToday, st_anat_revCount, st_trials_scores, st_trials_done`).

The "day of the plan" is computed from `st_startDate`: `planDay() = clamp(1..14, floor((today - startDate)/86400000) + 1)`. So the plan auto-advances one day per calendar day from first launch; content unlocks accordingly.

---

## PART 5 — THE DATA MODEL (EXACT SCHEMAS)

These schemas are mandatory. The validators enforce them. Copy them precisely.

### 5.1 Curriculum (`curriculum.js`)

```js
window.CURRICULUM = [
  { day: 1, theme: "Surgical Foundations I",
    tagline: "Fluids, electrolytes, acid–base and shock — the physiology every answer is built on." },
  // … exactly 14 entries, day 1..14 …
];
```

Rules: exactly 14 objects (validator hard-checks `length === 14`). Each has `day` (1–14), `theme` (short title shown as the day heading), `tagline` (one-sentence hook).

### 5.2 Lessons (`lessons-*.js`)

Each lessons file begins with `window.LESSONS = window.LESSONS || {};` then assigns lessons by id:

```js
window.LESSONS["d1-fluids"] = {
  id: "d1-fluids", day: 1, ord: 1,
  title: "Fluids & Electrolytes", short: "Fluids", minutes: 45,
  chunks: [
    { title: "The physiology: where water actually lives", html: `<p>…mechanism-first prose…</p>` },
    { type: "checkpoint", q: "Maintenance rate for an 80 kg man?",
      options: ["80 mL/h","100 mL/h","120 mL/h","160 mL/h"], answer: 2,
      explain: "4×10 + 2×10 + 1×60 = 120 mL/h. Shortcut: weight + 40." },
    // … 12–21 chunks total …
  ]
};
```

Lesson fields: `id` (unique, convention `d<day>-<slug>`), `day` (1–13; day 14 is exam day, no lessons), `ord` (order within the day), `title`, `short` (chip label), `minutes` (estimated read time), `chunks` (array, length 12–21).

A **chunk** is one of two shapes:
- **Teaching chunk:** `{ title?, html }` — `title` optional; `html` is a template-literal string of real HTML.
- **Checkpoint chunk:** `{ type:"checkpoint", q, options[], answer, explain }` — `answer` is the 0-based index of the correct option.

### 5.3 Flashcards (`flashcards*.js`)

```js
window.FLASHCARDS = [
  { id: "f-d1-01", day: 1, lesson: "d1-fluids", topic: "Foundations",
    front: "In a 70 kg adult, how is total body water distributed?",
    back: "<b>60% = TBW (~42 L)</b><br><ul><li>40% intracellular…</li></ul>" },
  // …
];
```

Fields: `id` (unique; id-prefix convention `f-`, then `f2-`, `f3-` per batch), `day` (the curriculum day it unlocks on — a card only enters the deck once `planDay() >= card.day`), `lesson` (optional link to a lesson id, used for the "N flashcards now in your deck" message), `topic` (grouping label), `front` (HTML), `back` (HTML). Later files (`flashcards2.js`, `flashcards3.js`) push/concat onto the same array.

### 5.4 Questions (`questions*.js`)

```js
window.QUESTIONS = [
  { id: "q-d1-01", day: 1, topic: "Foundations",
    stem: "A 24 kg child kept NPO overnight… what hourly maintenance rate?",
    options: ["48 mL/h","96 mL/h","64 mL/h","80 mL/h"],
    answer: 2,
    explain: "The 4-2-1 rule gives … 64 mL/h. 48 and 96 come from misapplying a single multiplier…" },
  // …
];
```

Fields: `id` (unique, prefix `q-`/`q2-`/`q3-`/`q4-`), `day` (unlock day; topics lock in the quiz menu until `planDay()` reaches the lowest day in that topic), `topic` (used to group the quiz menu and the per-topic progress bars), `stem` (the vignette), `options[]` (3–5 strings), `answer` (0-based index), `explain` (teaching text shown after answering and in mock-exam review). Validator requires ≥3 options and an in-range answer.

### 5.5 Exercises (`exercises.js`)

Two types share one array.

**Order (sequence builder):**
```js
{ id:"ex-abdo-exam", day:3, type:"order", title:"The Abdominal Exam, In Order", short:"Abdo exam",
  intro:"Build the abdominal examination in the proper sequence.",
  steps:[ "Wash hands, introduce, position…", "General inspection…", /* ≥4 steps in correct order */ ] }
```

**Label (click-the-anatomy):**
```js
{ id:"ex-biliary-label", day:4, type:"label", title:"Click the Biliary Tree", short:"Biliary anatomy",
  caption:"The anatomy of every lap chole — and every bile-duct-injury question.",
  svg: window.DG.biliary,
  targets:[
    { zone:"gallbladder", label:"Gallbladder", hint:"the pear-shaped sac under the liver" },
    { zone:"cystic-duct", label:"Cystic duct", hint:"connects gallbladder to the main duct" },
    /* … each zone string MUST exist as data-zone="…" inside the svg … */
  ] }
```

The validator hard-checks that every `target.zone` literally appears as `data-zone="<zone>"` in `e.svg`.

### 5.6 Diagrams (`diagrams.js`)

```js
window.DG = {};
window.DG.fluids = `
<svg viewBox="0 0 460 230" role="img" aria-label="…">
  <style>.dgt{font:600 12px Figtree;fill:var(--fg)} …</style>
  <rect … fill="rgba(8,145,178,.25)" stroke="var(--primary)"/>
  <path data-zone="gallbladder" … />   <!-- clickable zones for label exercises -->
</svg>`;
```

Diagrams are **theme-aware**: they use `fill:var(--fg)`, `stroke:var(--primary)`, etc., so they automatically recolor in dark mode. Clickable regions carry `data-zone="<id>"`. Lessons embed a diagram by writing `<div class="diagram">` + window.DG.fluids + `</div>` inside a chunk's html string.

---

## PART 6 — THE FLASHCARD SYSTEM (SPACED REPETITION)

This is a faithful re-implementation of the **Anki** algorithm. Three card states: `"lrn"` (learning steps), `"rev"` (graduated review), `"rel"` (relearning after a lapse). Four ratings on each review: **0 = Again, 1 = Hard, 2 = Good, 3 = Easy**.

### 6.1 Constants
```js
const LEARN_STEPS   = [1, 10];   // minutes
const RELEARN_STEPS = [10];      // minutes
const GRAD_IVL = 1, EASY_IVL = 4, MAX_IVL = 365;   // days
const NEW_LIMIT = 25;            // new cards introduced per day
```

### 6.2 Per-card stored state
```js
function blankCard(){ return { st:"lrn", step:0, ef:2.5, iv:0, reps:0, lapses:0, due:0 }; }
```
`st`=state, `step`=index into the learning steps, `ef`=ease factor (starts 2.5, floor 1.3), `iv`=interval in days, `reps`, `lapses`, `due`=epoch ms when next due. All cards' states live in `Store.get("srs", {})` keyed by card id.

### 6.3 The scheduler (`schedule(card, rating, now)`)

- **Learning / relearning state:**
  - Again (0): reset to step 0, due in `steps[0]` minutes.
  - Hard (1): due in `steps[currentStep] × 1.5` minutes.
  - Good (2): advance one step; if past the last step, **graduate** → state `"rev"`, `iv = GRAD_IVL (1d)` (or keep ≥1 if relearning), due in `iv` days.
  - Easy (3): immediately graduate → `"rev"`, `iv = EASY_IVL (4d)`.
- **Review state:**
  - Again (0): a **lapse** — `lapses++`, `ef -= 0.2` (floor 1.3), `iv = max(1, round(iv×0.25))`, state → `"rel"`, due in 10 minutes.
  - Hard (1): `ef -= 0.15`, `iv = max(iv+1, round(iv×1.2))`.
  - Good (2): `iv = max(iv+1, round(iv×ef))`.
  - Easy (3): `ef += 0.15`, `iv = max(iv+1, round(iv×ef×1.3))`.
  - Then `iv = min(iv, MAX_IVL)`, add ±5% random "fuzz" for intervals >2 days, set `due = now + iv days`.

`previewIvl(card, rating)` runs the scheduler hypothetically to show the user the next interval on each of the four rating buttons ("Again 1 min · Hard … · Good … · Easy …").

### 6.4 Building a session queue

```js
function buildQueue() {
  const due = shuffle(dueCards());                                   // unlocked cards past their due time
  const slots = Math.max(0, NEW_LIMIT - newToday());                 // remaining new-card budget today
  const fresh = shuffle(newCards()).slice(0, slots);                 // never-seen unlocked cards
  fc.queue = due.concat(fresh);                                      // due first, then new
}
```
- `unlockedCards()` = FLASHCARDS where `card.day <= planDay()`.
- `dueCards()` = unlocked cards that have an SRS entry whose `due <= now`.
- `newCards()` = unlocked cards with no SRS entry yet.
- New cards are capped at **25/day** (`st_newToday` counter, resets each calendar day).

### 6.5 Rating a card
`rateCard(card, rating)` runs the scheduler, saves the new state, increments `st_revCount`, bumps streak + activity + daily quest counter, awards XP (2 for Again, 5 otherwise), and returns `true` if the card is due again within 15 minutes (so it gets re-queued into the same session — that's how learning-step cards reappear "in minutes").

### 6.6 The flashcard UI
A flip card (`.fc-card` with a `.flipped` class toggling a CSS 3D transform). Front shows the question + a state pill ("🔵 New", "🟢 Review · ivl Nd", "🟠 Learning/Relearning") and topic; press space / tap to flip; once flipped, four rating buttons appear (keyboard 1/2/3/4 also work) each labelled with its predicted next interval. A top progress bar shows position in the queue. When the queue empties, a "Session complete" celebration screen reports how many were reviewed and how many are still in learning. When nothing is due, an "All clear!" empty state explains how many cards are tracked and in learning.

---

## PART 7 — THE MCQ / QUESTION-BANK SYSTEM

`viewQuizMenu()` renders the bank: two big link-cards ("Today's set" = day-filtered, "Weakness drill" = every question ever answered wrong), a **by-topic list** (each topic shows question count + your accuracy %, locked with reduced opacity until the topic's earliest day unlocks), and a card promoting the mock exam.

`startQuiz(questionArray, title)` shuffles, **slices to 15 questions**, and runs them one at a time with **immediate feedback**:
- Options render as `.q-opt` buttons keyed A–E.
- On click, the chosen option turns green (correct) or red (wrong) and the correct one is highlighted; the `explain` text appears in an `.explain` box; a "Next question" button appears.
- Correct answers grow a **combo**: base 10 XP + a bonus (up to +8) once the combo ≥3; a `🔥 ×N` chip shows at combo ≥3; `st_bestCombo` is tracked (feeds the "Combo ×10" achievement). A wrong answer resets the combo to 0.
- Every answer is recorded in `st_qstats` (`{ qid: {seen, ok} }`) which powers accuracy stats, the weakness drill, and achievements.
- The results screen shows `score/total (pct%)`, a tiered message, confetti at ≥80%, and sets `st_perfectQuiz` if 100% on ≥10 questions.

Routes: `#/quiz` (menu), `#/quiz/day/<n>`, `#/quiz/topic/<topic>`, `#/quiz/weak`.

---

## PART 8 — THE MOCK EXAM ENGINE

`#/exam` → intro screen → on start: shuffle the whole `QUESTIONS` bank, take **75**, set a **90-minute** countdown (`exam.end = now + 90×60000`), render one question at a time **with a clickable question-navigator grid** (each cell shows answered/current state) and **no feedback**. A live `setInterval` timer ticks each second, turns red under 5 minutes, and auto-submits at zero. Submit warns about blanks via `confirm()`.

On finish: record every answer into `qstats`, compute score, set `st_examPass` if ≥70%, award **+150 XP (+100 bonus for a pass)**, confetti on pass. The results screen shows the score, a **per-topic performance breakdown sorted weakest-first** (bars go green at ≥70%), and a **full review of every missed question** (your answer vs. correct + explanation).

---

## PART 9 — THE LESSON PLAYER

`viewLesson(id)` walks the lesson's `chunks` one at a time (`player = {id, idx, answered}`). Teaching chunks render `title` + `html`. Checkpoint chunks render the question + A–E option buttons; after answering, the correct/wrong colors and the `explain` appear, and "Next" unlocks (you cannot skip a checkpoint without answering). A top bar shows progress `i+1 / n`. The last "Next" says "Finish lesson". On completion: `markLessonDone(id)` records it (`st_done`), awards **+40 XP** (first time only), fires confetti the first time, tells you how many flashcards on this topic just entered your deck, and offers the next lesson / flashcards / dashboard.

---

## PART 10 — INTERACTIVE EXERCISES

`#/exercises` lists them (locked until their `day`). Two engines:

- **Order:** shuffles the step indices; shows already-placed steps numbered, then a pool of remaining steps as buttons. Clicking the correct next step places it; a wrong click shakes the button (`.shake` animation) and increments an error count. Finishing with **zero errors** = "Flawless!", sets `st_flawlessEx`, +45 XP; otherwise +30 XP.
- **Label:** shows the SVG (`e.svg`) and prompts "Click on: <label>" for each target in turn. Clicking the element whose `data-zone` matches advances and turns it green; a wrong click flashes red and toasts the hint. Same flawless/error XP logic.

---

## PART 11 — PROGRESS TRACKING

`#/progress` shows:
- A completion **ring** (lessons done / total).
- A **stat row**: cards in rotation, mature cards (`iv ≥ 21`), cards in learning, MCQ accuracy %.
- A **study-activity heatmap** — a 12-week, GitHub-contributions-style grid. `logActivity()` increments `st_activity[today]` on every review/answer/lesson; cells color into 5 levels by count (`0, <5, <15, <30, ≥30`).
- A **per-day curriculum** progress (one bar per day, green when fully done).
- A **per-topic MCQ accuracy** map (bars green ≥70%).
- A **danger zone**: a double-confirm "Reset all progress" that wipes every `st_`-prefixed key.

---

## PART 12 — GAMIFICATION

- **XP & levels.** `LEVELS` is 10 thresholds: 0 / 120 / 300 / 600 / 1000 / 1600 / 2400 / 3400 / 4600 / 6000 XP, titled Med Student → Clerkship Star → Sub-Intern → Intern → Junior Resident → Senior Resident → Chief Resident → Fellow → Attending → Consultant Surgeon. `addXP(n)` saves XP, floats a "+N XP" chip, repaints the XP widget, and triggers a **level-up overlay + confetti** when a threshold is crossed.
- **Streaks.** `bumpStreak()` increments a day counter if yesterday was the last active day, resets to 1 otherwise; shown as a 🔥 with a count in the sidebar widget.
- **Daily quests.** Three per day: "Review 20 flashcards" (+25), "Get 10 MCQs right" (+25), "Finish today's lessons" (+30). Progress bars on the dashboard; completing one toasts and awards its XP. Tracked in `st_questsDone[today]`.
- **Achievements.** 21 badges, each `{id, icon, title, desc, check()}` where `check()` reads stats (lessons done, streak length, review count, questions answered, accuracy, perfect quiz, combo, flawless exercise, exam pass, time-of-day, level). `checkAchievements()` runs after every meaningful action; newly-met badges fire an "ACHIEVEMENT UNLOCKED" toast and are stored with a timestamp in `st_ach`.
- **Awards page** (`#/awards`): the 10-rank ladder (showing reached/current/future) + the 21-badge grid (unlocked badges show their icon + date; locked show 🔒).
- **Micro-feedback:** floating +XP chips, toasts, confetti bursts (80 colored particles), and a level-up modal.

---

## PART 13 — THE UI / DASHBOARD, SCREEN BY SCREEN

**Layout:** a CSS grid `#app-shell` = a 252px sticky glass **sidebar** + a fluid `#main`. The sidebar holds: brand (scalpel logo + name), the **XP widget** (level badge, title, XP, progress bar, streak flame), the **nav** (Today, 14-Day Plan, Flashcards [with a red "due count" badge], Question Bank, Interactive, Anatomy Review, Anatomy Flashcards, Trials, Progress, Awards [with a gold unlocked-count badge]), and a **dark/light theme toggle**. On screens ≤860px the sidebar hides and a `#bottom-nav` tab bar appears (a curated subset of tabs).

**Dashboard (`#/`):** a **hero** card (gradient glow) with "Day N of 14 · <theme>", a greeting ("Good morning, future surgeon."), the day's tagline, an inline level bar, and a completion ring. Then a **stat row** (cards due, day streak, lessons done, questions answered — animated count-up). Then **Daily quests**, then **"Today's mission"** (a task list auto-built from today's lessons, exercises, the spaced-repetition session, the daily MCQ set, the weakness drill from day 3, and — on day 14 — the mock exam pinned to the top), then a **"How to use your remaining days"** study-method card.

**14-Day Plan (`#/plan`):** every day as a row (numbered, themed, with chips linking to each lesson/exercise/the mock exam), styled current / done / locked.

The visual language: cyan→violet gradients, glassmorphism surfaces in dark mode, the Sora display font, ambient radial gradient "blobs" behind everything, soft shadows, rounded 16px cards, shimmer/glow on interactive elements.

---

## PART 14 — THE THREE ISOLATED MODULES

These are the template for "bonus depth without risk." Each lives in its own folder, its own CSS, its own validator, and its own `localStorage` keys, and is wired into the host with only: (a) `<script>`/`<link>` tags in index.html, (b) one or two NAV entries, and (c) one or two **guarded** router branches (`… && window.Anatomy`). Remove the folder → routes fall through → app unaffected.

- **Anatomy Review** (`#/anatomy`, `#/anatomy/<regionId>`): 8 categories, 36 regions, prose + themable diagrams. Region schema: `{id, category, title, short, blurb, diagram?, sections[{heading,html}], pearls[]}`.
- **Anatomy Flashcards** (`#/anat-cards`, `#/anat-cards/study`): **cloze** cards `{{c1::answer}}` / `{{c1::answer::hint}}`, with a FULL but **separate** spaced-repetition store (`st_anat_srs`, `st_anat_newToday`, `st_anat_revCount`). It reuses only pure helpers (`schedule`, `blankCard`, `esc`, `shuffle`, `Store`, `IC`) and **never** calls the gamification functions, so it cannot affect 14-day XP/streak. Card schema: `{id:"a-<region>-NN", region, category, subtype, text}`, subtype ∈ structures|arterial|venous|lymphatic|nerves|surgical.
- **Trials** (`#/trials`, `#/trials/<trialId>`): landmark trials grouped by specialty, each a structured summary (question/design/population/intervention/comparator/outcome/bottomLine/pearls/citation) + a self-contained inline MCQ runner (pass ≥70% marks ✓ in `st_trials_done`). `window.QUESTIONS` is never touched; no XP coupling. Trial schema includes `mcqs:[{q,options,answer,explain}]`.

When building a clone you can **omit these entirely** at first and add them later using the exact same isolation pattern.

---

## PART 15 — THE DESIGN SYSTEM (CSS TOKENS)

`css/style.css` defines everything via CSS custom properties on `:root` and `[data-theme="dark"]`. The key tokens (light mode):

```css
:root{
  --g1:#0891B2; --g2:#7C3AED;             /* decorative gradient (cyan→violet) */
  --btn-g1:#0E7490; --btn-g2:#6D28D9;     /* darker gradient for white-text buttons (contrast) */
  --primary:#0891B2; --secondary:#22D3EE; --accent:#059669;
  --bg:#F3F7FB; --surface:#FFFFFF; --surface-2:#EEF4F9;
  --fg:#10293B; --fg-soft:#4A6A7E; --border:#D4E2EC;
  --danger:#DC2626; --warn:#D97706; --ok:#059669;
  --r:16px; --r-sm:10px;
  --font:'Figtree','Noto Sans',system-ui,sans-serif;
  --font-display:'Sora','Figtree',sans-serif;
  /* kbox themes: --mnem* (mnemonic/violet), --pearl* (amber), --danger* (red), --study* (cyan) */
}
[data-theme="dark"]{ /* brighter cyan/violet, near-black --bg:#070D1A, glass surfaces, etc. */ }
```

Dark mode is toggled by setting `document.documentElement.dataset.theme = "dark"|"light"` (persisted in `st_theme`, defaulting to the OS preference). Because diagrams and every component reference these variables, the whole app — including SVGs — recolors instantly.

**Component classes that lesson HTML and the engine depend on (must exist in CSS):**
- `kbox` + a modifier: `kbox mnemonic` / `kbox pearl` / `kbox danger` / `kbox study`, each containing a `<div class="kbox-tag">Label</div>`.
- Flow/algorithm classes: `flow`, `flow-box`, `flow-box q`, `flow-box stop`, `flow-box go`, `flow-arrow`, `flow-split`.
- `diagram` (wraps SVGs), `q-opt` + `.opt-key` + `.correct`/`.wrong` (option buttons), `explain` (feedback box), `bar` + `.green` (progress bars), `ring` (SVG progress ring), `pill` + color (`cyan`/`green`/`red`), `task`/`t-icon`/`t-body`/`t-title`/`t-sub`/`t-go`, `card`, `stat`/`v`/`l`, `fc-card`/`fc-face`/`fc-rate`, `quest`, `badge`, `rank-row`, `heatmap`/`hm-cell l0..l4`, `xp-chip`, `ach-toast`, `levelup-overlay`, `confetti-burst`, `toast`, `btn`/`btn secondary`/`btn outline`.

Icons are inline Lucide-style SVGs via the `IC(name, cls)` helper (a dictionary of `<path>` strings for home/map/book/cards/quiz/puzzle/chart/check/flame/target/trophy/etc.).

---

## PART 16 — THE VALIDATORS

`tools/validate.js` loads each data file into a sandboxed `vm` context (so `window` is faked), then checks: CURRICULUM has 14 days; every lesson has id/title/day/non-empty chunks; each checkpoint has a question, ≥2 options, an in-range answer, and warns if no explain; each teaching chunk has html and balanced `<div>`/`</div>`; flashcards have id/front/back/day/topic and unique ids (warns on unknown lesson refs); questions have id/stem/≥3 options/in-range answer/unique ids; label-exercise zones all exist in their SVG; order-exercises have ≥4 steps. It prints counts + warnings + errors and exits non-zero on any error. **Run it after every content edit.** (`validate-anatomy.js` and `validate-trials.js` do the same for those modules.)

---

## PART 17 — HOW TO BUILD THIS FOR A NEW ROTATION (THE RECIPE)

Suppose you are handed, say, an **Internal Medicine** (or Pediatrics, OB/GYN, Psychiatry, Emergency Medicine, …) rotation PDF and asked to produce the identical website. Follow these phases **in order**. The fastest, lowest-risk path is to **copy the existing project folder and replace the content**, because the entire engine (app.js, CSS, validators, all UI/gamification) is content-agnostic and needs almost no change.

### Phase A — Recreate the skeleton from the embedded source (do this first, change no logic)

> **You do not need the original project files.** The complete, verbatim source of every content-agnostic engine file is embedded in **PART 20** at the end of this guide. Recreate each file at the exact path shown (the path is the header above each code block), copying the contents **byte-for-byte**. Do not paraphrase or "improve" them. Then author your content data files (Phases B–C).

1. Recreate, byte-for-byte from PART 20: `index.html`, `css/style.css`, `js/app.js`, `tools/validate.js` (this is the minimum for a working site). Optionally also recreate the isolated-module files (`css/anatomy.css`, `css/trials.css`, `js/anatomy/*`, `js/trials/*`, `tools/validate-anatomy.js`, `tools/validate-trials.js`) — also in PART 20. These engine files do not care what specialty the content is; the engine reads only the `window.*` globals.
2. In `index.html`, change only: the `<title>`, the `<meta name="description">`, the `.brand-name` ("ScalpelSchool" → your name), and the `.brand-sub` ("14-Day Surgery Trainer" → e.g. "14-Day Internal Medicine Trainer"). Optionally swap the brand SVG logo. **Leave the `<script>`/`<link>` load order intact.**
3. Decide your **N-day plan length**. The original hardcodes 14 in a few spots. To change N you must edit: `curriculum.js` (have N entries), and in `app.js` the `planDay()` clamp `Math.min(14, …)` and the two literals in `viewDashboard` ("Day X of 14", "remaining days" math `15 - day`) and the `for (let d=1; d<=13; …)` lesson-day loop in the validator, plus the day-14 mock-exam special case. **If you keep N=14, you change nothing in app.js.** (Recommended for a first clone: keep 14 days.)

### Phase B — Extract and plan the content from the PDF

4. Read the source PDF thoroughly. Produce a **content map**: a 14-day spiral curriculum where core/high-yield topics come first, subspecialty depth in the middle, and review/exam days at the end. For each day write the `theme` and `tagline`. This becomes `curriculum.js`.
5. For each day, list **2–4 lessons** (topics). Target ~38 lessons total across days 1–13 (day 14 is exam day).
6. For each lesson, plan **12–21 chunks**: mostly teaching chunks with a checkpoint every 2–4 chunks.
7. Plan the **flashcard deck**: ~8–25 cards per lesson, ~300 total, each tagged with the day it unlocks and a topic.
8. Plan the **question bank**: ~235 MCQs, distributed across days/topics (e.g. 14–22 per day).
9. Plan **~13 interactive exercises** (order sequences for procedures/algorithms; label drills for any anatomy/imaging you can draw as SVG).

### Phase C — Author the data files (the bulk of the work)

10. Write `curriculum.js` (exactly N entries).
11. Write `diagrams.js` — only the SVGs you actually reference. Each SVG must use theme variables (`var(--fg)`, `var(--primary)`, …) and put `data-zone="…"` on any clickable region. If your rotation has little anatomy, you may include few or zero diagrams (lessons can be all prose).
12. Write the **lessons** files. You can keep the six topic-named files or rename them to your rotation's groupings — **but** they must be loaded in `index.html` and listed in `tools/validate.js`'s `files` array, and **each must begin with `window.LESSONS = window.LESSONS || {};`**. Follow the lesson + chunk schema exactly (Part 5.2). Obey the prose rules in Part 18.
13. Write the **flashcards** files (`window.FLASHCARDS = [...]`, later files concat). Follow the schema (Part 5.3). Unique ids; choose an id prefix per batch (`f-`, `f2-`, …).
14. Write the **questions** files (`window.QUESTIONS = [...]`). Follow the schema (Part 5.4). Unique ids; 3–5 options; correct 0-based `answer`; a teaching `explain`.
15. Write `exercises.js` (`window.EXERCISES = [...]`). For every `label` exercise, ensure each `target.zone` string exactly matches a `data-zone="…"` in the referenced `window.DG.*` SVG.

### Phase D — Wire, validate, smoke-test

16. Make sure every data file you created is referenced by a `<script>` tag in `index.html` (in the correct order: curriculum → diagrams → lessons → flashcards → questions → exercises → app.js) **and** listed in `tools/validate.js`'s `files` array.
17. Run `node tools/validate.js`. Fix every ✗ error and ideally every ⚠ warning until it prints `ERRORS (0)`.
18. Open `index.html` in a browser. Click through: dashboard, plan, open a lesson (answer a checkpoint), run a flashcard session (flip + rate), run a day quiz, the weakness drill, an exercise, the progress page, the awards page, and toggle dark mode. There must be **zero console errors**.
19. (Optional) Add the isolated **Anatomy** and **Trials** modules later using their `_SPEC.md` files and separate validators — they bolt on without touching the core.

### Phase E — Tune the rotation-specific numbers (optional)

20. The level titles in `LEVELS`, the achievement copy in `ACHIEVEMENTS`, the quest labels, the mock-exam size (75) and pass mark (70%), and the new-card limit (25/day) are all editable constants near the top of `app.js`. Re-theme the names to your specialty if you like (e.g. medicine ranks instead of surgical ranks). None of these are required for a functioning clone.

---

## PART 18 — CONTENT AUTHORING RULES THAT MUST NEVER BE BROKEN

These are the rules that keep the build error-free. A weaker model **must** follow them mechanically.

1. **Template-literal hygiene (critical).** Lesson/diagram html is stored inside backtick template literals. **Never put a backtick `` ` `` or the sequence `${` *inside* the content of a string.** Use straight HTML tags and plain text. (This is the single most common cause of a file failing to parse.)
2. **Write real HTML, not markdown.** Inside `html`/`front`/`back` use `<b>`, `<ul><li>…</li></ul>`, `<table>…</table>`, `<p>…</p>`. No `**bold**`, no markdown lists.
3. **Balanced tags.** Every `<div>` needs a `</div>` (the validator warns on mismatches). Same for `<ul>`, `<table>`, etc.
4. **Mechanism-first prose.** Every teaching chunk must **lead with one or two narrative `<p>` paragraphs explaining the WHY/HOW** before any list/table/kbox. Never open a teaching chunk with a bare `<ul>`/`<table>`/`<div class="kbox">`. ("Recap in 20 seconds" summary chunks may be bullet lists by design.) Keep teaching chunks ≤350 words.
5. **kbox usage.** Highlight boxes are `<div class="kbox mnemonic">`, `kbox pearl`, `kbox danger`, or `kbox study`, each opening with `<div class="kbox-tag">Label</div>` then the content.
6. **Checkpoints.** `answer` is a 0-based index into `options`; it must be in range; always include an `explain`.
7. **Unique ids.** Every lesson/card/question/exercise id must be unique across all files. Use a consistent prefix per batch.
8. **`answer` indices are 0-based everywhere** (checkpoints, questions, trial MCQs).
9. **Exercise zones must exist in the SVG.** Every `label` target's `zone` must appear verbatim as `data-zone="<zone>"`.
10. **Lessons object init.** Each lessons file starts with `window.LESSONS = window.LESSONS || {};`. Flashcards/questions files assign or push to their arrays. Never redefine a global that an earlier file created (only the FIRST flashcards/questions file should do `= [...]`; later ones must concat/push).
11. **Day fields drive unlocking.** A card/question/exercise with `day: 5` only becomes available once `planDay()` reaches 5. Distribute content so each day has something to do.
12. **Run the validator after every edit.** `node tools/validate.js` must end with 0 errors before you consider a step done.
13. **Medical accuracy.** Author from the source PDF/established evidence. Do not invent statistics. For the Trials module, prefer well-established headline findings over precise numbers you cannot verify.

---

## PART 19 — FINAL CHECKLIST (DONE = ALL TRUE)

- [ ] `index.html` loads all data files in the correct order, then `app.js`, then (optional) isolated modules.
- [ ] `curriculum.js` has exactly N (=14) days, each with `day/theme/tagline`.
- [ ] ~38 lessons across days 1–13; each 12–21 chunks; every teaching chunk leads with prose; every checkpoint has a valid 0-based `answer` + `explain`.
- [ ] ~300 flashcards; unique ids; correct `day`/`topic`; HTML front/back; no backticks/`${` inside content.
- [ ] ~235 questions; unique ids; 3–5 options; valid `answer`; teaching `explain`; spread across days/topics.
- [ ] ~13 exercises; order steps ≥4; label zones all present in their SVG.
- [ ] `node tools/validate.js` → `ERRORS (0)` (warnings ideally 0).
- [ ] Browser smoke-test: dashboard, plan, lesson + checkpoint, flashcard flip/rate, day quiz, weakness drill, exercise, progress, awards, dark/light toggle — **zero console errors**.
- [ ] Gamification visibly works: XP chip on a correct answer, level bar moves, a quest can be completed, an achievement toast fires, the heatmap lights a square, the streak flame shows.
- [ ] (Optional) Anatomy + Trials modules added per their `_SPEC.md`, validated by their own validators, and the core `validate.js` counts are unchanged.

---

### Appendix — Why this architecture is ideal for a weaker model to reproduce

Every hard part (the scheduler, router, gamification, all rendering, all CSS) is **already written and content-agnostic** in `app.js` + `css/style.css` + `tools/*.js`. To clone the site for a new rotation you **copy those files unchanged** and only **author plain-data JS files** that follow rigid, validator-checked schemas. The validator catches structural mistakes before they reach the browser, and the smoke-test catches the rest. There is no build step, no dependency resolution, and no server configuration to get wrong. Follow Parts 17–19 literally and the result is a working, error-free clone.

---

## PART 20 — COMPLETE VERBATIM ENGINE SOURCE

Everything below is the exact, content-agnostic engine. Recreate each file at the path shown in its header, copying the code block **byte-for-byte**. These files contain NO medical content — they are the same for every rotation. Author your rotation-specific content separately (Parts 5, 17–18).

NOTE on `index.html`: the `<script src="js/data/...">` tags below list the ORIGINAL surgery content files. When you build a new rotation, replace that block of data `<script>` tags with one tag per content file you actually create (keep the order: curriculum → diagrams → lessons → flashcards → questions → exercises → app.js → optional modules). Change only the title/brand/data-tags; never touch the load order pattern.

The four CORE files (required): `index.html`, `css/style.css`, `js/app.js`, `tools/validate.js`. The rest are the OPTIONAL isolated Anatomy and Trials modules — include them only if you want those bonus sections.

### CORE FILE 1 of 4 — `index.html`

````html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ScalpelSchool — 14-Day General Surgery Trainer</title>
<meta name="description" content="A 14-day evidence-based trainer for general surgery, breast and thoracic surgery: micro-lessons, spaced repetition, MCQs and interactive anatomy.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/anatomy.css">
<link rel="stylesheet" href="css/trials.css">
<link rel="icon" href="data:image/svg+xml,&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'&gt;&lt;text y='80' font-size='80'&gt;&#x2695;&lt;/text&gt;&lt;/svg&gt;">
</head>
<body>
<div id="app-shell">
  <aside id="sidebar" aria-label="Main navigation">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l9-9"/><path d="M12.2 12.2c3.5-3.5 7.3-8.2 8.8-9.7.4 1.5-1.2 6.3-8.8 9.7z" fill="currentColor" stroke="none"/><path d="M3 21c1.5-.3 3.2-1 4.5-2.5"/></svg>
      </div>
      <div>
        <div class="brand-name">ScalpelSchool</div>
        <div class="brand-sub">14-Day Surgery Trainer</div>
      </div>
    </div>
    <div id="xp-widget"></div>
    <nav id="main-nav"></nav>
    <div class="sidebar-foot">
      <button id="theme-toggle" class="ghost-btn" aria-label="Toggle dark mode"></button>
    </div>
  </aside>
  <main id="main" tabindex="-1"></main>
  <nav id="bottom-nav" aria-label="Mobile navigation"></nav>
</div>
<script src="js/data/curriculum.js"></script>
<script src="js/data/diagrams.js"></script>
<script src="js/data/lessons-foundations.js"></script>
<script src="js/data/lessons-abdomen.js"></script>
<script src="js/data/lessons-gi.js"></script>
<script src="js/data/lessons-breast.js"></script>
<script src="js/data/lessons-thoracic.js"></script>
<script src="js/data/lessons-endocrine-trauma.js"></script>
<script src="js/data/flashcards.js"></script>
<script src="js/data/flashcards2.js"></script>
<script src="js/data/flashcards3.js"></script>
<script src="js/data/questions.js"></script>
<script src="js/data/questions2.js"></script>
<script src="js/data/questions3.js"></script>
<script src="js/data/questions4.js"></script>
<script src="js/data/exercises.js"></script>
<script src="js/app.js"></script>
<!-- Standalone Anatomy section (isolated — safe to remove without affecting the app) -->
<script src="js/anatomy/anatomy-base.js"></script>
<script src="js/anatomy/diagrams.js"></script>
<script src="js/anatomy/regions-abdomen.js"></script>
<script src="js/anatomy/regions-git.js"></script>
<script src="js/anatomy/regions-hpb.js"></script>
<script src="js/anatomy/regions-breast.js"></script>
<script src="js/anatomy/regions-thorax.js"></script>
<script src="js/anatomy/regions-neck.js"></script>
<script src="js/anatomy/regions-vascular.js"></script>
<script src="js/anatomy/regions-neuro.js"></script>
<script src="js/anatomy/cards-abdomen.js"></script>
<script src="js/anatomy/cards-git.js"></script>
<script src="js/anatomy/cards-hpb.js"></script>
<script src="js/anatomy/cards-breast.js"></script>
<script src="js/anatomy/cards-thorax.js"></script>
<script src="js/anatomy/cards-neck.js"></script>
<script src="js/anatomy/cards-vascular.js"></script>
<script src="js/anatomy/cards-neuro.js"></script>
<script src="js/anatomy/anatomy.js"></script>
<!-- Standalone Trials section (isolated — safe to remove without affecting the app) -->
<script src="js/trials/trials-base.js"></script>
<script src="js/trials/trials-gensurg.js"></script>
<script src="js/trials/trials-breast.js"></script>
<script src="js/trials/trials-thoracic.js"></script>
<script src="js/trials/trials.js"></script>
</body>
</html>

````

### CORE FILE 2 of 4 — `css/style.css`

````css
/* ============ ScalpelSchool design system v2 — "OR neon" ============
   Cyan→violet gradient system, glass surfaces in dark mode, Sora display type.
   Every selector from v1 is preserved (lesson HTML + app.js depend on them). */

:root{
  /* gradient stops (decorative: rings, bars, badges) */
  --g1:#0891B2; --g2:#7C3AED;
  /* gradient for filled controls — darker for 4.5:1 white-text contrast */
  --btn-g1:#0E7490; --btn-g2:#6D28D9;
  --primary:#0891B2; --on-primary:#fff; --secondary:#22D3EE; --accent:#059669;
  --bg:#F3F7FB; --surface:#FFFFFF; --surface-2:#EEF4F9; --fg:#10293B; --fg-soft:#4A6A7E;
  --muted:#E6EEF5; --border:#D4E2EC; --danger:#DC2626; --warn:#D97706; --ok:#059669;
  --gold:#B45309; --gold-bg:#FEF3C7;
  --ring:#0891B2;
  --shadow:0 1px 2px rgba(16,41,59,.06),0 8px 24px rgba(16,41,59,.07);
  --shadow-lg:0 12px 40px rgba(16,41,59,.16);
  --glow:0 4px 18px rgba(8,145,178,.25);
  --r:16px; --r-sm:10px;
  --font:'Figtree','Noto Sans',system-ui,-apple-system,sans-serif;
  --font-display:'Sora','Figtree',system-ui,sans-serif;
  --mnem:#7C3AED; --mnem-bg:#F3EEFF; --mnem-border:#D9CCFA;
  --pearl-bg:#FFF7E6; --pearl-border:#F3DFAE; --pearl:#92600A;
  --danger-bg:#FEF1F1; --danger-border:#F5C8C8;
  --ok-bg:#EAF7F0; --ok-border:#BFE5D2;
  --study:#0E7490; --study-bg:#E7F6FA; --study-border:#BBE4EE;
  --blob-a:rgba(8,145,178,.07); --blob-b:rgba(124,58,237,.06);
  --glass:rgba(255,255,255,.82);
}
[data-theme="dark"]{
  --g1:#22D3EE; --g2:#A78BFA;
  --btn-g1:#22D3EE; --btn-g2:#A78BFA;
  --primary:#22D3EE; --on-primary:#071420; --secondary:#0891B2; --accent:#34D399;
  --bg:#070D1A; --surface:#101A2BDD; --surface-2:#0C1524; --fg:#E5EFF8; --fg-soft:#93AAC0;
  --muted:#16243A; --border:#23344E; --danger:#F87171; --warn:#FBBF24; --ok:#34D399;
  --gold:#FCD34D; --gold-bg:#3A2E10;
  --ring:#22D3EE;
  --shadow:0 1px 3px rgba(0,0,0,.5),0 10px 30px rgba(0,0,0,.35);
  --shadow-lg:0 14px 50px rgba(0,0,0,.6);
  --glow:0 0 22px rgba(34,211,238,.28);
  --mnem:#C4B5FD; --mnem-bg:#241A3F; --mnem-border:#41327A;
  --pearl-bg:#2C2410; --pearl-border:#5C4A1B; --pearl:#F3CE7A;
  --danger-bg:#341A1A; --danger-border:#5C2B2B;
  --ok-bg:#11302A; --ok-border:#1F5247;
  --study:#7DD3FC; --study-bg:#0E2A38; --study-border:#1E4A5C;
  --blob-a:rgba(34,211,238,.10); --blob-b:rgba(139,92,246,.12);
  --glass:rgba(13,21,36,.72);
}

*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
body{margin:0;font-family:var(--font);background:var(--bg);color:var(--fg);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
/* ambient glow blobs behind everything */
body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:radial-gradient(620px 420px at 8% -4%,var(--blob-a),transparent 70%),
             radial-gradient(700px 520px at 104% 38%,var(--blob-b),transparent 70%),
             radial-gradient(540px 420px at 38% 112%,var(--blob-a),transparent 72%)}
h1,h2,h3,h4{line-height:1.25;margin:0 0 .5em;font-weight:700;font-family:var(--font-display);letter-spacing:-.015em}
h1{font-size:1.7rem}h2{font-size:1.28rem}h3{font-size:1.08rem}
p{margin:.4em 0}
a{color:var(--primary)}
button{font-family:var(--font);cursor:pointer}
:focus-visible{outline:3px solid var(--ring);outline-offset:2px;border-radius:4px}
::selection{background:var(--secondary);color:#06262E}
::-webkit-scrollbar{width:11px;height:11px}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:99px;border:3px solid var(--bg)}
::-webkit-scrollbar-track{background:transparent}

.grad-text{background:linear-gradient(120deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}

/* ---- layout ---- */
#app-shell{display:grid;grid-template-columns:252px 1fr;min-height:100dvh}
#sidebar{position:sticky;top:0;height:100dvh;display:flex;flex-direction:column;gap:14px;padding:20px 14px;
  background:var(--glass);backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);
  border-right:1px solid var(--border)}
#main{padding:28px clamp(16px,4vw,48px) 90px;max-width:1060px;width:100%;margin:0 auto;outline:none}
.page-anim{animation:pagein .3s ease}
@keyframes pagein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.brand{display:flex;gap:10px;align-items:center;padding:4px 8px 14px;border-bottom:1px solid var(--border)}
.brand-mark{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--btn-g1),var(--btn-g2));color:#fff;display:grid;place-items:center;flex:none;box-shadow:var(--glow)}
[data-theme="dark"] .brand-mark{color:#071420}
.brand-mark svg{width:20px;height:20px}
.brand-name{font-weight:800;font-size:1.02rem;letter-spacing:-.01em;font-family:var(--font-display)}
.brand-sub{font-size:.7rem;color:var(--fg-soft);font-weight:600;text-transform:uppercase;letter-spacing:.07em}
#main-nav{display:flex;flex-direction:column;gap:2px;flex:1}
.nav-link{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:11px;color:var(--fg-soft);text-decoration:none;font-weight:600;font-size:.95rem;border:none;background:none;transition:background .18s,color .18s,transform .12s;min-height:44px}
.nav-link svg{width:19px;height:19px;flex:none}
.nav-link:hover{background:var(--muted);color:var(--fg)}
.nav-link:active{transform:scale(.98)}
.nav-link.active{background:linear-gradient(120deg,var(--btn-g1),var(--btn-g2));color:#fff;box-shadow:var(--glow)}
[data-theme="dark"] .nav-link.active{color:#071420}
.nav-badge{margin-left:auto;background:var(--danger);color:#fff;font-size:.7rem;font-weight:700;border-radius:99px;padding:1px 7px;min-width:20px;text-align:center}
.nav-badge.gold{background:linear-gradient(120deg,#F59E0B,#D97706);color:#221502}
.nav-link.active .nav-badge{background:rgba(255,255,255,.3);color:inherit}
.sidebar-foot{border-top:1px solid var(--border);padding-top:10px}
.ghost-btn{display:flex;align-items:center;gap:9px;width:100%;padding:10px 12px;border:none;background:none;border-radius:10px;color:var(--fg-soft);font-weight:600;font-size:.9rem;min-height:44px;transition:background .18s,color .18s}
.ghost-btn:hover{background:var(--muted);color:var(--fg)}
.ghost-btn svg{width:18px;height:18px}
#bottom-nav{display:none}
@media (max-width:860px){
  #app-shell{grid-template-columns:1fr}
  #sidebar{display:none}
  #main{padding:18px 16px 96px}
  #bottom-nav{position:fixed;bottom:0;left:0;right:0;display:flex;background:var(--glass);backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);border-top:1px solid var(--border);padding:6px 4px calc(6px + env(safe-area-inset-bottom));z-index:100}
  #bottom-nav .nav-link{flex:1;flex-direction:column;gap:3px;font-size:.62rem;padding:7px 2px;justify-content:center;text-align:center;position:relative;border-radius:10px}
  #bottom-nav .nav-link svg{width:21px;height:21px}
  #bottom-nav .nav-badge{position:absolute;top:2px;right:18%;margin:0}
}

/* ---- XP widget (sidebar) ---- */
#xp-widget{border:1px solid var(--border);border-radius:var(--r-sm);padding:12px;background:var(--surface-2);display:flex;flex-direction:column;gap:9px}
.xp-top{display:flex;align-items:center;gap:10px}
.xp-meta{flex:1;min-width:0}
.xp-title{font-weight:800;font-size:.86rem;font-family:var(--font-display);letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.xp-sub{font-size:.72rem;color:var(--fg-soft);font-weight:600;font-variant-numeric:tabular-nums}
.xp-flame{display:flex;align-items:center;gap:3px;font-size:.85rem;font-weight:800;color:var(--fg-soft);flex:none}
.xp-flame svg{width:17px;height:17px}
.xp-flame.lit{color:#F59E0B;filter:drop-shadow(0 0 6px rgba(245,158,11,.55))}

/* level badge */
.lvl-badge{width:42px;height:42px;flex:none;display:grid;place-items:center;border-radius:13px;
  background:linear-gradient(135deg,var(--btn-g1),var(--btn-g2));color:#fff;
  font-weight:800;font-size:1.05rem;font-family:var(--font-display);box-shadow:var(--glow)}
[data-theme="dark"] .lvl-badge{color:#071420}
.lvl-badge.sm{width:32px;height:32px;border-radius:10px;font-size:.85rem}
.lvl-badge.big{width:76px;height:76px;border-radius:22px;font-size:1.9rem;margin:0 auto 10px}
.lvl-badge.ghost{background:var(--muted);color:var(--fg-soft);box-shadow:none}

/* ---- generic components ---- */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px 22px;box-shadow:var(--shadow)}
.card+.card{margin-top:16px}
.card h2{display:flex;align-items:center;gap:9px}
.card h2 svg{width:20px;height:20px;color:var(--primary)}
.link-card{display:block;text-decoration:none;color:var(--fg);transition:transform .16s,border-color .16s,box-shadow .16s}
.link-card:hover{transform:translateY(-3px);border-color:var(--primary);box-shadow:var(--shadow-lg)}
.link-card:active{transform:translateY(-1px) scale(.99)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media (max-width:760px){.grid-2,.grid-3{grid-template-columns:1fr}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:linear-gradient(120deg,var(--btn-g1),var(--btn-g2));background-size:150% 150%;
  color:var(--on-primary);border:none;padding:12px 22px;border-radius:12px;font-weight:700;font-size:.97rem;min-height:46px;
  transition:background-position .25s,transform .12s,box-shadow .2s;text-decoration:none;box-shadow:var(--glow)}
.btn:hover{background-position:90% 50%;box-shadow:var(--glow),0 6px 18px rgba(109,40,217,.22)}
.btn:active{transform:scale(.97)}
.btn.secondary{background:var(--muted);color:var(--fg);box-shadow:none}
.btn.secondary:hover{background:var(--border)}
.btn.success{background:var(--accent);color:#fff;box-shadow:none}
.btn.outline{background:transparent;border:1.5px solid var(--border);color:var(--fg);box-shadow:none}
.btn.sm{padding:8px 14px;min-height:38px;font-size:.86rem;border-radius:10px}
.btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.btn svg{width:17px;height:17px}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:.74rem;font-weight:700;padding:3px 11px;border-radius:99px;background:var(--muted);color:var(--fg-soft);text-transform:uppercase;letter-spacing:.04em}
.pill svg{width:13px;height:13px}
.pill.cyan{background:color-mix(in srgb,var(--primary) 14%,transparent);color:var(--primary)}
.pill.green{background:var(--ok-bg);color:var(--ok)}
.pill.red{background:var(--danger-bg);color:var(--danger)}
.pill.amber{background:var(--pearl-bg);color:var(--pearl)}
.muted{color:var(--fg-soft)}
.small{font-size:.85rem}
.page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:20px;flex-wrap:wrap}
.page-head p{color:var(--fg-soft);margin:.2em 0 0}
hr.sep{border:none;border-top:1px solid var(--border);margin:16px 0}

/* progress ring + bars */
.ring{position:relative;width:92px;height:92px;flex:none}
.ring svg{transform:rotate(-90deg)}
.ring .track{stroke:var(--muted)}
.ring .meter{stroke:var(--primary);stroke-linecap:round;transition:stroke-dashoffset .6s ease;filter:drop-shadow(0 0 5px color-mix(in srgb,var(--g1) 55%,transparent))}
.ring .ring-label{position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:1.15rem;font-family:var(--font-display)}
.bar{height:9px;background:var(--muted);border-radius:99px;overflow:hidden;position:relative}
.bar>span{display:block;height:100%;background:linear-gradient(90deg,var(--g1),var(--g2));border-radius:99px;transition:width .4s ease;position:relative;overflow:hidden}
.bar>span::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.45) 50%,transparent 70%);background-size:220% 100%;animation:shimmer 2.4s linear infinite}
@keyframes shimmer{from{background-position:160% 0}to{background-position:-60% 0}}
.bar.green>span{background:var(--accent)}
.bar.sm{height:6px}
.xp-bar{height:7px}

/* ---- dashboard hero ---- */
.hero{position:relative;overflow:hidden;display:flex;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;
  background:linear-gradient(120deg,color-mix(in srgb,var(--g1) 13%,var(--surface)),var(--surface) 55%,color-mix(in srgb,var(--g2) 11%,var(--surface)));
  border:1px solid var(--border);border-radius:var(--r);padding:26px 28px;box-shadow:var(--shadow);margin-bottom:18px}
.hero-glow{position:absolute;top:-70px;right:-50px;width:300px;height:300px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,color-mix(in srgb,var(--g2) 26%,transparent),transparent 70%);
  animation:heropulse 7s ease-in-out infinite alternate}
@keyframes heropulse{from{transform:scale(1);opacity:.7}to{transform:scale(1.25);opacity:1}}
.hero-body{position:relative;flex:1;min-width:240px}
.hero h1{margin-bottom:4px;background:linear-gradient(110deg,var(--fg) 40%,var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero .ring{position:relative}
.hero-level{display:flex;align-items:center;gap:12px;margin-top:16px;max-width:380px}
.stat-row{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0}
.stat{flex:1;min-width:130px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:13px 16px;box-shadow:var(--shadow);position:relative;overflow:hidden}
.stat::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(var(--g1),var(--g2));border-radius:0 3px 3px 0}
.stat .v{font-size:1.45rem;font-weight:800;line-height:1.15;font-family:var(--font-display);font-variant-numeric:tabular-nums}
.stat .l{font-size:.74rem;color:var(--fg-soft);font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.task{display:flex;align-items:center;gap:13px;padding:13px 14px;border:1px solid var(--border);border-radius:12px;margin-top:9px;background:var(--surface-2);text-decoration:none;color:var(--fg);transition:border-color .18s,transform .12s,box-shadow .18s}
.task:hover{border-color:var(--primary);transform:translateX(3px);box-shadow:var(--shadow)}
.task:active{transform:scale(.99)}
.task .t-icon{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:color-mix(in srgb,var(--primary) 13%,transparent);color:var(--primary);flex:none}
.task .t-icon svg{width:19px;height:19px}
.task.done .t-icon{background:var(--ok-bg);color:var(--ok)}
.task.done .t-title{text-decoration:line-through;opacity:.7}
.task .t-body{flex:1;min-width:0}
.task .t-title{font-weight:700;font-size:.96rem}
.task .t-sub{font-size:.8rem;color:var(--fg-soft)}
.task .t-go{color:var(--fg-soft);flex:none;transition:transform .15s}
.task:hover .t-go{transform:translateX(3px);color:var(--primary)}
.task .t-go svg{width:18px;height:18px}

/* xp reward tag + floating chips + combo */
.xp-tag{flex:none;font-size:.7rem;font-weight:800;padding:3px 9px;border-radius:99px;letter-spacing:.03em;
  background:linear-gradient(120deg,color-mix(in srgb,var(--g1) 18%,transparent),color-mix(in srgb,var(--g2) 18%,transparent));
  color:var(--primary);border:1px solid color-mix(in srgb,var(--g1) 35%,transparent);font-variant-numeric:tabular-nums}
#xp-lane{position:fixed;right:26px;bottom:110px;z-index:400;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none}
.xp-chip{font-weight:800;font-size:.95rem;font-family:var(--font-display);padding:7px 15px;border-radius:99px;
  background:linear-gradient(120deg,var(--btn-g1),var(--btn-g2));color:var(--on-primary);box-shadow:var(--glow);
  animation:chipfloat 1.6s ease forwards}
@keyframes chipfloat{0%{opacity:0;transform:translateY(14px) scale(.8)}15%{opacity:1;transform:none}70%{opacity:1}100%{opacity:0;transform:translateY(-46px)}}
.combo-chip{font-weight:800;font-size:.82rem;padding:4px 12px;border-radius:99px;flex:none;
  background:linear-gradient(120deg,#F59E0B,#EF4444);color:#fff;box-shadow:0 0 14px rgba(239,68,68,.4);
  animation:combopulse 1s ease-in-out infinite alternate;font-variant-numeric:tabular-nums}
@keyframes combopulse{from{transform:scale(1)}to{transform:scale(1.08)}}

/* ---- daily quests ---- */
.quest{display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid var(--border);border-radius:12px;margin-top:9px;background:var(--surface-2)}
.quest-ico{font-size:1.25rem;width:38px;height:38px;flex:none;display:grid;place-items:center;border-radius:11px;background:color-mix(in srgb,var(--g2) 12%,transparent)}
.quest-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}
.quest-label{font-weight:700;font-size:.9rem}
.quest-val{font-size:.8rem;font-weight:700;color:var(--fg-soft);font-variant-numeric:tabular-nums;flex:none}
.quest.done{border-color:var(--ok-border);background:var(--ok-bg)}
.quest.done .quest-label{color:var(--ok)}
.quest.done .quest-ico{background:transparent}

/* ---- plan ---- */
.day-row{display:flex;gap:14px;align-items:flex-start;padding:15px 4px;border-bottom:1px solid var(--border)}
.day-row:last-child{border-bottom:none}
.day-num{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font-weight:800;flex:none;background:var(--muted);color:var(--fg-soft);font-family:var(--font-display)}
.day-row.current .day-num{background:linear-gradient(135deg,var(--btn-g1),var(--btn-g2));color:#fff;box-shadow:var(--glow)}
[data-theme="dark"] .day-row.current .day-num{color:#071420}
.day-row.done .day-num{background:var(--ok-bg);color:var(--ok)}
.day-row.locked{opacity:.55}
.day-title{font-weight:700}
.day-theme{font-size:.8rem;color:var(--fg-soft);margin-bottom:6px}
.chip-row{display:flex;flex-wrap:wrap;gap:7px}
.chip{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;font-weight:600;padding:6px 12px;border-radius:99px;border:1px solid var(--border);background:var(--surface);color:var(--fg);text-decoration:none;min-height:32px;transition:border-color .15s,transform .12s}
.chip:hover{border-color:var(--primary);transform:translateY(-1px)}
.chip.done{background:var(--ok-bg);border-color:var(--ok-border);color:var(--ok)}
.chip svg{width:13px;height:13px}

/* ---- lesson player ---- */
.player-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.player-top .bar{flex:1}
.chunk{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:26px clamp(18px,4vw,34px);box-shadow:var(--shadow);animation:slidein .28s ease}
@keyframes slidein{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.chunk h2{font-size:1.25rem}
.chunk ul{padding-left:22px;margin:.5em 0}
.chunk li{margin:.45em 0}
.chunk td,.chunk th{padding:8px 11px;border:1px solid var(--border);text-align:left;font-size:.92rem;vertical-align:top}
.chunk table{border-collapse:collapse;margin:.7em 0;width:100%}
.chunk th{background:var(--surface-2)}
.chunk strong{color:var(--primary)}
.kbox{border-radius:13px;padding:14px 17px;margin:14px 0;border:1.5px solid}
.kbox .kbox-tag{display:flex;align-items:center;gap:7px;font-size:.74rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
.kbox .kbox-tag svg{width:15px;height:15px}
.kbox.mnemonic{background:var(--mnem-bg);border-color:var(--mnem-border)}
.kbox.mnemonic .kbox-tag{color:var(--mnem)}
.kbox.mnemonic strong{color:var(--mnem)}
.kbox.pearl{background:var(--pearl-bg);border-color:var(--pearl-border)}
.kbox.pearl .kbox-tag,.kbox.pearl strong{color:var(--pearl)}
.kbox.danger{background:var(--danger-bg);border-color:var(--danger-border)}
.kbox.danger .kbox-tag,.kbox.danger strong{color:var(--danger)}
.kbox.study{background:var(--study-bg);border-color:var(--study-border)}
.kbox.study .kbox-tag,.kbox.study strong{color:var(--study)}
.player-nav{display:flex;justify-content:space-between;gap:10px;margin-top:18px}
.diagram{background:var(--surface-2);border:1px solid var(--border);border-radius:13px;padding:10px;margin:12px 0;text-align:center}
.diagram svg{max-width:100%;height:auto}
.dg-label{font-size:12px;font-weight:600}
.flow{display:flex;flex-direction:column;align-items:center;gap:0;margin:14px 0}
.flow-box{border:1.5px solid var(--border);background:var(--surface);border-radius:11px;padding:9px 16px;font-size:.88rem;font-weight:600;text-align:center;max-width:480px}
.flow-box.q{background:color-mix(in srgb,var(--primary) 11%,var(--surface));border-color:var(--primary)}
.flow-box.go{background:var(--ok-bg);border-color:var(--ok-border)}
.flow-box.stop{background:var(--danger-bg);border-color:var(--danger-border)}
.flow-arrow{color:var(--fg-soft);font-size:.78rem;font-weight:700;padding:5px;display:flex;flex-direction:column;align-items:center;line-height:1.2}
.flow-arrow::after{content:"↓";font-size:1.05rem}
.flow-split{display:flex;gap:18px;align-items:flex-start;justify-content:center;flex-wrap:wrap}
.flow-split>div{display:flex;flex-direction:column;align-items:center}

/* checkpoint / quiz options */
.q-opt{display:flex;gap:11px;align-items:flex-start;width:100%;text-align:left;background:var(--surface-2);border:1.5px solid var(--border);border-radius:12px;padding:13px 15px;margin-top:9px;font-size:.95rem;color:var(--fg);font-weight:500;transition:border-color .15s,background .15s,transform .1s;min-height:46px}
.q-opt:hover:not(:disabled){border-color:var(--primary);transform:translateX(2px)}
.q-opt:active:not(:disabled){transform:scale(.99)}
.q-opt .opt-key{font-weight:800;color:var(--fg-soft);flex:none}
.q-opt.correct{background:var(--ok-bg);border-color:var(--ok);color:var(--fg);animation:optpop .3s ease}
@keyframes optpop{0%{transform:scale(1)}40%{transform:scale(1.015)}100%{transform:scale(1)}}
.q-opt.wrong{background:var(--danger-bg);border-color:var(--danger);animation:shake .3s}
.q-opt:disabled{cursor:default}
.explain{margin-top:13px;padding:13px 16px;border-radius:12px;background:var(--surface-2);border:1px dashed var(--border);font-size:.92rem;animation:slidein .25s ease}
.explain b:first-child{display:block;margin-bottom:3px}

/* ---- flashcards ---- */
.fc-stage{perspective:1200px;margin:14px 0}
.fc-card{position:relative;width:100%;min-height:300px;transform-style:preserve-3d;transition:transform .45s cubic-bezier(.3,.7,.3,1);cursor:pointer}
.fc-card.flipped{transform:rotateX(180deg)}
.fc-face{position:absolute;inset:0;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow);padding:28px clamp(16px,5vw,44px);font-size:1.12rem;font-weight:600;overflow:auto}
.fc-face::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--g1),var(--g2));border-radius:3px 3px 0 0}
.fc-face.back{transform:rotateX(180deg);font-weight:500;font-size:1.02rem}
.fc-face .fc-topic{position:absolute;top:13px;left:16px}
.fc-face ul{text-align:left;font-weight:500;font-size:.97rem;margin:.3em 0;padding-left:20px}
.fc-rate{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:14px}
.fc-rate button{border:none;border-radius:12px;padding:11px 6px;font-weight:700;font-size:.92rem;color:#fff;min-height:54px;transition:transform .12s,filter .15s,box-shadow .15s}
.fc-rate button:hover{filter:brightness(1.1);box-shadow:var(--shadow)}
.fc-rate button:active{transform:scale(.95)}
.fc-rate .ivl{display:block;font-size:.7rem;font-weight:600;opacity:.85;font-variant-numeric:tabular-nums}
.fc-again{background:linear-gradient(135deg,#DC2626,#B91C1C)}
.fc-hard{background:linear-gradient(135deg,#D97706,#B45309)}
.fc-good{background:linear-gradient(135deg,#0891B2,#0E7490)}
.fc-easy{background:linear-gradient(135deg,#059669,#047857)}
.fc-count{display:flex;gap:14px;justify-content:center;font-size:.84rem;color:var(--fg-soft);font-weight:600;flex-wrap:wrap}
.fc-count b{color:var(--fg)}

/* ---- exercises ---- */
.ex-step{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:12px 15px;margin-top:8px;font-weight:600;font-size:.93rem;color:var(--fg);transition:border-color .15s,opacity .2s,transform .1s;min-height:46px}
.ex-step:hover:not(:disabled):not(.placed){border-color:var(--primary);transform:translateX(2px)}
.ex-step.placed{background:var(--ok-bg);border-color:var(--ok-border);cursor:default}
.ex-step.shake{animation:shake .3s}
.ex-step .step-no{width:26px;height:26px;border-radius:8px;background:var(--ok);color:#fff;display:grid;place-items:center;font-size:.8rem;font-weight:800;flex:none}
@keyframes shake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.label-svg [data-zone]{cursor:pointer;transition:opacity .15s}
.label-svg [data-zone]:hover{opacity:.75}
.label-svg .zone-found{pointer-events:none}
.ex-prompt{font-size:1.05rem;font-weight:700;text-align:center;padding:10px;background:var(--surface-2);border-radius:11px;margin-bottom:8px}

/* exam */
.exam-timer{font-variant-numeric:tabular-nums;font-weight:800;font-size:1.05rem;font-family:var(--font-display)}
.exam-grid{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.exam-grid button{width:36px;height:36px;border-radius:9px;border:1.5px solid var(--border);background:var(--surface);font-weight:700;font-size:.8rem;color:var(--fg);transition:border-color .12s,transform .1s}
.exam-grid button:hover{border-color:var(--primary)}
.exam-grid button:active{transform:scale(.94)}
.exam-grid button.answered{background:var(--muted)}
.exam-grid button.cur{border-color:var(--primary);background:color-mix(in srgb,var(--primary) 15%,var(--surface));box-shadow:var(--glow)}
.exam-grid button.right{background:var(--ok-bg);border-color:var(--ok);color:var(--ok)}
.exam-grid button.wrongr{background:var(--danger-bg);border-color:var(--danger);color:var(--danger)}

/* ---- heatmap ---- */
.heatmap{display:grid;grid-template-rows:repeat(7,12px);grid-auto-columns:12px;grid-auto-flow:column;gap:3px;margin:12px 0 8px;overflow-x:auto;padding-bottom:4px}
.hm-cell{width:12px;height:12px;border-radius:3px;background:var(--muted)}
.hm-cell.l1{background:color-mix(in srgb,var(--g1) 30%,var(--muted))}
.hm-cell.l2{background:color-mix(in srgb,var(--g1) 65%,var(--muted))}
.hm-cell.l3{background:var(--g1)}
.hm-cell.l4{background:var(--g2);box-shadow:0 0 6px color-mix(in srgb,var(--g2) 60%,transparent)}
.hm-legend{display:flex;align-items:center;gap:4px}
.hm-legend .hm-cell{display:inline-block;width:11px;height:11px}

/* ---- awards: rank ladder + badges ---- */
.rank-row{display:flex;align-items:center;gap:12px;padding:9px 10px;border-radius:11px;margin-top:6px}
.rank-row:not(.reached):not(.future){background:linear-gradient(120deg,color-mix(in srgb,var(--g1) 13%,transparent),color-mix(in srgb,var(--g2) 13%,transparent));border:1px solid color-mix(in srgb,var(--g1) 35%,transparent)}
.rank-row.future{opacity:.5}
.rank-title{flex:1;font-weight:700;font-size:.92rem}
.rank-row.reached .rank-title{color:var(--ok)}
.rank-row .muted{font-variant-numeric:tabular-nums}
.badge-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(126px,1fr));gap:10px;margin-top:6px}
.badge{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;padding:14px 8px;border-radius:13px;border:1px solid var(--border);background:var(--surface-2);transition:transform .15s,box-shadow .15s}
.badge.got{border-color:color-mix(in srgb,var(--g2) 45%,transparent);background:linear-gradient(160deg,color-mix(in srgb,var(--g1) 9%,var(--surface-2)),color-mix(in srgb,var(--g2) 12%,var(--surface-2)))}
.badge.got:hover{transform:translateY(-3px);box-shadow:var(--glow)}
.badge.locked{opacity:.55;filter:grayscale(.8)}
.badge-ico{font-size:1.7rem;line-height:1.2;filter:drop-shadow(0 2px 6px rgba(0,0,0,.18))}
.badge-title{font-weight:800;font-size:.8rem;font-family:var(--font-display);letter-spacing:-.01em}
.badge-desc{font-size:.7rem;color:var(--fg-soft);line-height:1.35}
.badge-date{font-size:.66rem;font-weight:700;color:var(--g2);margin-top:2px}

/* ---- achievement toast ---- */
.ach-toast{position:fixed;top:18px;right:18px;z-index:450;display:flex;align-items:center;gap:12px;
  padding:13px 18px;border-radius:14px;max-width:320px;
  background:var(--glass);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border:1px solid color-mix(in srgb,#F59E0B 50%,transparent);box-shadow:var(--shadow-lg),0 0 24px rgba(245,158,11,.25);
  animation:achin .45s cubic-bezier(.2,.9,.3,1.2),achout .4s ease 4s forwards}
@keyframes achin{from{opacity:0;transform:translateX(60px) scale(.9)}to{opacity:1;transform:none}}
@keyframes achout{to{opacity:0;transform:translateY(-14px)}}
.ach-ico{font-size:1.7rem;flex:none}
.ach-txt{display:flex;flex-direction:column;line-height:1.35}
.ach-txt b{font-size:.66rem;letter-spacing:.1em;color:#F59E0B;font-family:var(--font-display)}
.ach-txt span{font-weight:700;font-size:.95rem}
@media (max-width:560px){.ach-toast{left:18px;max-width:none}}

/* ---- level-up overlay ---- */
.levelup-overlay{position:fixed;inset:0;z-index:500;display:grid;place-items:center;padding:20px;
  background:rgba(5,10,22,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fadein .25s ease}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.levelup-card{position:relative;text-align:center;padding:38px 42px;border-radius:24px;max-width:420px;width:100%;
  background:var(--surface);border:1px solid transparent;box-shadow:var(--shadow-lg);
  background-image:linear-gradient(var(--surface),var(--surface)),linear-gradient(135deg,var(--g1),var(--g2));
  background-origin:border-box;background-clip:padding-box,border-box;
  animation:lvlpop .5s cubic-bezier(.2,.9,.3,1.25)}
@keyframes lvlpop{from{opacity:0;transform:scale(.7) translateY(30px)}to{opacity:1;transform:none}}
.levelup-card h1{font-size:2rem;letter-spacing:.06em;background:linear-gradient(120deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent;margin:.2em 0}
.levelup-card p{color:var(--fg-soft);margin-bottom:18px}
.levelup-card p b{color:var(--fg)}

/* ---- confetti ---- */
.confetti-burst{position:fixed;inset:0;z-index:600;pointer-events:none;overflow:hidden}
.confetti-burst i{position:absolute;top:-14px;display:block;animation:confall linear forwards}
@keyframes confall{0%{transform:translateY(0) rotate(0) translateX(0)}25%{transform:translateY(26vh) rotate(200deg) translateX(26px)}50%{transform:translateY(52vh) rotate(380deg) translateX(-22px)}75%{transform:translateY(78vh) rotate(560deg) translateX(20px)}100%{transform:translateY(108vh) rotate(740deg) translateX(-12px);opacity:.6}}
.celebrate{animation:celebratepop .45s cubic-bezier(.2,.9,.3,1.2)}
@keyframes celebratepop{from{opacity:0;transform:scale(.94) translateY(16px)}to{opacity:1;transform:none}}

/* misc */
.empty{padding:42px 18px;text-align:center;color:var(--fg-soft)}
.empty svg{width:42px;height:42px;margin-bottom:8px;color:var(--primary)}
.confetti{font-size:2.6rem;text-align:center}
.center{text-align:center}
.mt{margin-top:14px}
.toast{position:fixed;bottom:84px;left:50%;transform:translateX(-50%);background:var(--fg);color:var(--bg);padding:11px 20px;border-radius:99px;font-weight:600;font-size:.9rem;box-shadow:var(--shadow-lg);z-index:300;animation:slidein .25s ease;max-width:calc(100vw - 32px)}
@media (min-width:861px){.toast{bottom:30px}}

````

### CORE FILE 3 of 4 — `js/app.js`

````javascript
/* ============ ScalpelSchool engine v2 — Anki scheduler + gamification ============ */
"use strict";

/* ---------- storage ---------- */
const Store = {
  get(k, d) { try { const v = localStorage.getItem("st_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { localStorage.setItem("st_" + k, JSON.stringify(v)); }
};
const DAY_MS = 86400000;
const todayStr = () => new Date().toISOString().slice(0, 10);

function getStartDate() {
  let s = Store.get("startDate", null);
  if (!s) { s = todayStr(); Store.set("startDate", s); }
  return s;
}
function planDay() {
  const diff = Math.floor((new Date(todayStr()) - new Date(getStartDate())) / DAY_MS);
  return Math.min(14, Math.max(1, diff + 1));
}
function doneLessons() { return Store.get("done", {}); }
function exDone() { return Store.get("exdone", {}); }
function bumpStreak() {
  const s = Store.get("streak", { count: 0, last: null });
  const t = todayStr();
  if (s.last === t) return;
  const yest = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
  s.count = (s.last === yest) ? s.count + 1 : 1;
  s.last = t; Store.set("streak", s);
  checkAchievements();
}
function streakCount() {
  const s = Store.get("streak", { count: 0, last: null });
  if (!s.last) return 0;
  const yest = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
  return (s.last === todayStr() || s.last === yest) ? s.count : 0;
}

/* ---------- activity log (heatmap) ---------- */
function logActivity(n) {
  const a = Store.get("activity", {});
  a[todayStr()] = (a[todayStr()] || 0) + (n || 1);
  Store.set("activity", a);
}

/* ---------- daily counters + quests ---------- */
function daily() {
  const d = Store.get("daily", {});
  return d.date === todayStr() ? d : { date: todayStr(), rev: 0, qok: 0, les: 0 };
}
function bumpDaily(k) {
  const d = daily(); d[k] = (d[k] || 0) + 1; Store.set("daily", d);
  checkQuests();
}
function questDefs() {
  const dayLessons = Math.max(1, lessonsForDay(planDay()).length);
  return [
    { id: "rev20", icon: "🧠", label: "Review 20 flashcards", target: 20, val: Math.min(20, daily().rev), xp: 25 },
    { id: "mcq10", icon: "🎯", label: "Get 10 MCQs right", target: 10, val: Math.min(10, daily().qok), xp: 25 },
    { id: "les", icon: "📚", label: "Finish " + dayLessons + " lesson" + (dayLessons === 1 ? "" : "s"), target: dayLessons, val: Math.min(dayLessons, daily().les), xp: 30 }
  ];
}
function questsDoneToday() {
  const all = Store.get("questsDone", {});
  return all[todayStr()] || {};
}
function checkQuests() {
  const all = Store.get("questsDone", {});
  const key = todayStr();
  all[key] = all[key] || {};
  questDefs().forEach(q => {
    if (!all[key][q.id] && q.val >= q.target) {
      all[key][q.id] = true; Store.set("questsDone", all);
      toast("⚡ Quest complete: " + q.label);
      addXP(q.xp);
    }
  });
  Store.set("questsDone", all);
}

/* ---------- XP + levels ---------- */
const LEVELS = [
  { xp: 0, title: "Med Student" },
  { xp: 120, title: "Clerkship Star" },
  { xp: 300, title: "Sub-Intern" },
  { xp: 600, title: "Intern" },
  { xp: 1000, title: "Junior Resident" },
  { xp: 1600, title: "Senior Resident" },
  { xp: 2400, title: "Chief Resident" },
  { xp: 3400, title: "Fellow" },
  { xp: 4600, title: "Attending" },
  { xp: 6000, title: "Consultant Surgeon" }
];
function xpTotal() { return Store.get("xp", 0); }
function levelInfo(xp) {
  let li = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) li = i;
  const cur = LEVELS[li], next = LEVELS[li + 1];
  return {
    n: li + 1, title: cur.title, max: !next,
    pct: next ? Math.round(100 * (xp - cur.xp) / (next.xp - cur.xp)) : 100,
    toNext: next ? next.xp - xp : 0
  };
}
function addXP(n) {
  const before = levelInfo(xpTotal());
  Store.set("xp", xpTotal() + n);
  const after = levelInfo(xpTotal());
  xpChip(n);
  renderXP();
  if (after.n > before.n) levelUp(after);
  checkAchievements();
}
function xpChip(n) {
  let lane = document.getElementById("xp-lane");
  if (!lane) { lane = document.createElement("div"); lane.id = "xp-lane"; document.body.appendChild(lane); }
  const c = document.createElement("div"); c.className = "xp-chip"; c.textContent = "+" + n + " XP";
  lane.appendChild(c); setTimeout(() => c.remove(), 1600);
}
function levelUp(info) {
  confettiBurst();
  const o = document.createElement("div"); o.className = "levelup-overlay";
  o.innerHTML = `<div class="levelup-card">
    <div class="lvl-badge big">${info.n}</div>
    <h1>LEVEL UP</h1>
    <p>You are now <b>${info.title}</b></p>
    <button class="btn" id="lvl-ok">Keep operating</button></div>`;
  document.body.appendChild(o);
  o.querySelector("#lvl-ok").onclick = () => o.remove();
  o.addEventListener("click", e => { if (e.target === o) o.remove(); });
}

/* ---------- achievements ---------- */
const ACHIEVEMENTS = [
  { id: "first-lesson", icon: "🔪", title: "First Incision", desc: "Complete your first lesson", check: () => Object.keys(doneLessons()).length >= 1 },
  { id: "five-lessons", icon: "🩺", title: "Rounding Resident", desc: "Complete 5 lessons", check: () => Object.keys(doneLessons()).length >= 5 },
  { id: "twenty-lessons", icon: "📖", title: "Page Turner", desc: "Complete 20 lessons", check: () => Object.keys(doneLessons()).length >= 20 },
  { id: "all-lessons", icon: "👑", title: "Curriculum Conqueror", desc: "Complete every lesson", check: () => window.ALL_LESSONS.length && Object.keys(doneLessons()).length >= window.ALL_LESSONS.length },
  { id: "streak-3", icon: "🔥", title: "On Call", desc: "3-day study streak", check: () => streakCount() >= 3 },
  { id: "streak-7", icon: "⚡", title: "Week-One Warrior", desc: "7-day study streak", check: () => streakCount() >= 7 },
  { id: "streak-14", icon: "🛡️", title: "Iron Surgeon", desc: "14-day study streak", check: () => streakCount() >= 14 },
  { id: "cards-50", icon: "🧠", title: "Memory Bank", desc: "50 flashcard reviews", check: () => Store.get("revCount", 0) >= 50 },
  { id: "cards-250", icon: "🌀", title: "Spaced-Rep Machine", desc: "250 flashcard reviews", check: () => Store.get("revCount", 0) >= 250 },
  { id: "cards-600", icon: "🐘", title: "Hippocampus Hypertrophy", desc: "600 flashcard reviews", check: () => Store.get("revCount", 0) >= 600 },
  { id: "q-50", icon: "🎯", title: "Vignette Hunter", desc: "Answer 50 MCQs", check: () => totalAnswered() >= 50 },
  { id: "q-200", icon: "💣", title: "Bank Breaker", desc: "Answer 200 MCQs", check: () => totalAnswered() >= 200 },
  { id: "acc-80", icon: "🔬", title: "Sharp Scalpel", desc: "80%+ accuracy over 50+ answers", check: () => { const t = totalAnswered(); return t >= 50 && totalCorrect() / t >= 0.8; } },
  { id: "quiz-perfect", icon: "💎", title: "Flawless Vignettes", desc: "Score 100% on a quiz of 10+", check: () => Store.get("perfectQuiz", false) },
  { id: "combo-10", icon: "🌟", title: "Combo ×10", desc: "10 correct answers in a row", check: () => Store.get("bestCombo", 0) >= 10 },
  { id: "ex-flawless", icon: "🤲", title: "Steady Hands", desc: "Finish an interactive with zero misses", check: () => Store.get("flawlessEx", false) },
  { id: "exam-pass", icon: "🏆", title: "Royal College Ready", desc: "Pass the mock exam (≥70%)", check: () => Store.get("examPass", false) },
  { id: "night-owl", icon: "🦉", title: "Night Shift", desc: "Study between midnight and 5 a.m.", check: () => { const h = new Date().getHours(); return h >= 0 && h < 5; } },
  { id: "early-bird", icon: "🌅", title: "Pre-Rounds", desc: "Study before 7 a.m.", check: () => { const h = new Date().getHours(); return h >= 5 && h < 7; } },
  { id: "level-5", icon: "🎖️", title: "Halfway to the Top", desc: "Reach level 5", check: () => levelInfo(xpTotal()).n >= 5 },
  { id: "level-10", icon: "⚜️", title: "Consultant Surgeon", desc: "Reach level 10", check: () => levelInfo(xpTotal()).n >= 10 }
];
function achState() { return Store.get("ach", {}); }
let achChecking = false;
function checkAchievements() {
  if (achChecking) return; achChecking = true;
  try {
    const st = achState(); let changed = false;
    ACHIEVEMENTS.forEach(a => {
      if (!st[a.id] && a.check()) { st[a.id] = Date.now(); changed = true; achToast(a); }
    });
    if (changed) { Store.set("ach", st); }
  } finally { achChecking = false; }
}
function achToast(a) {
  const t = document.createElement("div"); t.className = "ach-toast";
  t.innerHTML = `<span class="ach-ico">${a.icon}</span><span class="ach-txt"><b>ACHIEVEMENT UNLOCKED</b><span>${a.title}</span></span>`;
  document.body.appendChild(t); setTimeout(() => t.remove(), 4500);
}

/* ---------- confetti ---------- */
function confettiBurst() {
  const colors = ["#22D3EE", "#8B5CF6", "#F59E0B", "#10B981", "#F472B6", "#60A5FA"];
  const wrap = document.createElement("div"); wrap.className = "confetti-burst"; wrap.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (1.7 + Math.random() * 1.6) + "s";
    p.style.animationDelay = (Math.random() * 0.4) + "s";
    p.style.width = p.style.height = (5 + Math.random() * 6) + "px";
    if (i % 3 === 0) p.style.borderRadius = "50%";
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3600);
}

/* ---------- icons (Lucide-style inline SVG) ---------- */
const IC = (name, cls) => {
  const paths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    map: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 4v5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M20 17v5H6.5a2.5 2.5 0 0 1 0-5"/>',
    cards: '<rect x="2" y="6" width="16" height="13" rx="2"/><path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/>',
    quiz: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><circle cx="12" cy="17.5" r=".5" fill="currentColor"/>',
    puzzle: '<path d="M14 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3H7a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3v2a1 1 0 0 0 1 1h3v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-3V8a1 1 0 0 0-1-1z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    flame: '<path d="M12 22c4.4 0 8-3.6 8-8 0-3.5-2.5-6.3-4.5-8.5C14 3.9 13 2.5 13 2c-1 2-2 3.5-3.5 5C7.5 9 6 11 6 14c0 4.4 3.6 8 6 8z"/><path d="M12 22c-2 0-3.5-1.6-3.5-3.5 0-1.7 1.2-2.8 2-3.8.7-.8 1.3-1.6 1.5-2.7 1.4 1.3 3.5 3.2 3.5 6.5 0 1.9-1.5 3.5-3.5 3.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    scope: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/>',
    grad: '<path d="M22 9 12 4 2 9l10 5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v6"/>',
    trophy: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M17 5h3a1 1 0 0 1 1 1c0 2-1.5 3.5-4 4M7 5H4a1 1 0 0 0-1 1c0 2 1.5 3.5 4 4"/>',
    zap: '<path d="M13 2 3 14h7l-1 8 11-13h-8z"/>'
  };
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
};

/* ---------- Anki scheduler ----------
   States: "lrn" (learning steps), "rev" (graduated review), "rel" (relearning after lapse).
   Ratings: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy. */
const LEARN_STEPS = [1, 10];     // minutes
const RELEARN_STEPS = [10];      // minutes
const GRAD_IVL = 1, EASY_IVL = 4, MAX_IVL = 365;

function srsData() { return Store.get("srs", {}); }
function saveSrs(d) { Store.set("srs", d); }
function blankCard() { return { st: "lrn", step: 0, ef: 2.5, iv: 0, reps: 0, lapses: 0, due: 0 }; }
function getCardState(id) {
  const c = srsData()[id];
  if (!c) return null;
  if (!c.st) return Object.assign(blankCard(), c, { st: c.iv > 0 ? "rev" : "lrn" }); // migrate v1 SM-2 data
  return Object.assign(blankCard(), c);
}
function schedule(c0, r, now) {
  const c = Object.assign(blankCard(), c0);
  const MIN = 60000;
  if (c.st === "lrn" || c.st === "rel") {
    const steps = c.st === "lrn" ? LEARN_STEPS : RELEARN_STEPS;
    if (r === 0) { c.step = 0; c.due = now + steps[0] * MIN; }
    else if (r === 1) { c.due = now + Math.round(steps[Math.min(c.step, steps.length - 1)] * 1.5) * MIN; }
    else if (r === 2) {
      c.step++;
      if (c.step >= steps.length) {
        c.iv = c.st === "lrn" ? GRAD_IVL : Math.max(1, c.iv);
        c.st = "rev"; c.step = 0; c.reps++; c.due = now + c.iv * DAY_MS;
      } else c.due = now + steps[c.step] * MIN;
    } else {
      c.iv = c.st === "lrn" ? EASY_IVL : Math.max(2, c.iv + 1);
      c.st = "rev"; c.step = 0; c.reps++; c.due = now + c.iv * DAY_MS;
    }
  } else { // review
    if (r === 0) {
      c.lapses++; c.ef = Math.max(1.3, c.ef - 0.2);
      c.iv = Math.max(1, Math.round(c.iv * 0.25));
      c.st = "rel"; c.step = 0; c.due = now + RELEARN_STEPS[0] * MIN;
    } else {
      if (r === 1) { c.ef = Math.max(1.3, c.ef - 0.15); c.iv = Math.max(c.iv + 1, Math.round(c.iv * 1.2)); }
      else if (r === 2) { c.iv = Math.max(c.iv + 1, Math.round(c.iv * c.ef)); }
      else { c.ef += 0.15; c.iv = Math.max(c.iv + 1, Math.round(c.iv * c.ef * 1.3)); }
      c.iv = Math.min(c.iv, MAX_IVL); c.reps++;
      const fuzz = c.iv > 2 ? (Math.random() * 0.1 - 0.05) : 0;
      c.due = now + Math.round(c.iv * (1 + fuzz)) * DAY_MS;
    }
  }
  return c;
}
function previewIvl(card, r) {
  const c = schedule(getCardState(card.id) || blankCard(), r, Date.now());
  const delta = c.due - Date.now();
  if (delta < 55 * 60000) return Math.max(1, Math.round(delta / 60000)) + " min";
  if (delta < DAY_MS * 1.4) return "1 d";
  const d = Math.round(delta / DAY_MS);
  return d < 30 ? d + " d" : (d / 30).toFixed(1) + " mo";
}
function rateCard(card, r) {
  const srs = srsData();
  const wasNew = !srs[card.id];
  const c = schedule(getCardState(card.id) || blankCard(), r, Date.now());
  srs[card.id] = c; saveSrs(srs);
  if (wasNew) addNewToday(1);
  Store.set("revCount", Store.get("revCount", 0) + 1);
  bumpStreak(); logActivity(); bumpDaily("rev");
  addXP(r === 0 ? 2 : 5);
  return c.due <= Date.now() + 15 * 60000; // true → requeue this session
}
function unlockedCards() {
  const day = planDay();
  return (window.FLASHCARDS || []).filter(c => c.day <= day);
}
function dueCards() {
  const srs = srsData(), now = Date.now();
  return unlockedCards().filter(c => srs[c.id] && srs[c.id].due <= now);
}
function newCards() {
  const srs = srsData();
  return unlockedCards().filter(c => !srs[c.id]);
}
function newToday() {
  const nt = Store.get("newToday", { date: todayStr(), n: 0 });
  return nt.date === todayStr() ? nt.n : 0;
}
function addNewToday(n) { Store.set("newToday", { date: todayStr(), n: newToday() + n }); }
const NEW_LIMIT = 25;

/* ---------- quiz stats ---------- */
function qStats() { return Store.get("qstats", {}); }
function totalAnswered() { return Object.values(qStats()).reduce((a, b) => a + b.seen, 0); }
function totalCorrect() { return Object.values(qStats()).reduce((a, b) => a + b.ok, 0); }
function recordAnswer(qid, ok) {
  const s = qStats(); const e = s[qid] || { seen: 0, ok: 0 };
  e.seen++; if (ok) e.ok++; s[qid] = e; Store.set("qstats", s);
  bumpStreak(); logActivity();
  if (ok) bumpDaily("qok");
}

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
}
function ring(pct, size) {
  size = size || 96; const r = size / 2 - 7, c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px" role="img" aria-label="${pct}% complete">
    <svg width="${size}" height="${size}"><defs><linearGradient id="ringgrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="var(--g1)"/><stop offset="100%" stop-color="var(--g2)"/></linearGradient></defs>
    <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="9" fill="none"/>
    <circle class="meter" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="9" fill="none" stroke="url(#ringgrad)" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg>
    <div class="ring-label">${pct}%</div></div>`;
}
function countUpAll() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const end = +el.dataset.count; if (!end) { return; }
    const t0 = performance.now(), dur = 700;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
function lessonById(id) { return (window.ALL_LESSONS || []).find(l => l.id === id); }
function lessonsForDay(d) { return (window.ALL_LESSONS || []).filter(l => l.day === d); }
function exercisesForDay(d) { return (window.EXERCISES || []).filter(e => e.day === d); }
function markLessonDone(id) {
  const d = doneLessons();
  if (!d[id]) {
    d[id] = Date.now(); Store.set("done", d);
    bumpStreak(); logActivity(); bumpDaily("les");
    addXP(40);
  }
}

/* ---------- navigation shell ---------- */
const NAV = [
  ["#/", "home", "Today"],
  ["#/plan", "map", "14-Day Plan"],
  ["#/cards", "cards", "Flashcards"],
  ["#/quiz", "quiz", "Question Bank"],
  ["#/exercises", "puzzle", "Interactive"],
  ["#/anatomy", "book", "Anatomy Review"],
  ["#/anat-cards", "cards", "Anatomy Flashcards"],
  ["#/trials", "scope", "Trials"],
  ["#/progress", "chart", "Progress"],
  ["#/awards", "trophy", "Awards"]
];
function renderNav() {
  const due = dueCards().length;
  const route = location.hash || "#/";
  const unlockedAch = Object.keys(achState()).length;
  const link = ([href, icon, label]) => {
    const active = href === "#/" ? (route === "#/" || route === "") : route.startsWith(href);
    let badge = "";
    if (href === "#/cards" && due > 0) badge = `<span class="nav-badge">${due}</span>`;
    if (href === "#/awards" && unlockedAch > 0) badge = `<span class="nav-badge gold">${unlockedAch}</span>`;
    return `<a class="nav-link ${active ? "active" : ""}" href="${href}">${IC(icon)}<span>${label}</span>${badge}</a>`;
  };
  $("#main-nav").innerHTML = NAV.map(link).join("");
  $("#bottom-nav").innerHTML = NAV.filter(n => n[0] !== "#/awards" && n[0] !== "#/anat-cards" && n[0] !== "#/trials").map(link).join("");
  const dark = document.documentElement.dataset.theme === "dark";
  $("#theme-toggle").innerHTML = `${IC(dark ? "sun" : "moon")}<span>${dark ? "Light mode" : "Dark mode"}</span>`;
  renderXP();
}
function renderXP() {
  const w = $("#xp-widget"); if (!w) return;
  const xp = xpTotal(), li = levelInfo(xp), st = streakCount();
  w.innerHTML = `
    <div class="xp-top">
      <div class="lvl-badge">${li.n}</div>
      <div class="xp-meta">
        <div class="xp-title">${li.title}</div>
        <div class="xp-sub">${xp.toLocaleString()} XP${li.max ? "" : " · " + li.toNext + " to next"}</div>
      </div>
      <div class="xp-flame ${st > 0 ? "lit" : ""}" title="${st}-day streak">${IC("flame")}<b>${st}</b></div>
    </div>
    <div class="bar xp-bar"><span style="width:${li.pct}%"></span></div>`;
}

/* ---------- dashboard ---------- */
function viewDashboard() {
  const day = planDay();
  const dayInfo = window.CURRICULUM[day - 1];
  const done = doneLessons();
  const lessons = lessonsForDay(day);
  const exs = exercisesForDay(day);
  const due = dueCards().length;
  const fresh = Math.min(newCards().length, Math.max(0, NEW_LIMIT - newToday()));
  const allDone = Object.keys(done).length;
  const pct = Math.round(100 * allDone / (window.ALL_LESSONS.length || 1));
  const greet = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const li = levelInfo(xpTotal());
  const qd = questsDoneToday();

  const taskRow = (href, icon, title, sub, isDone, xpTag) => `
    <a class="task ${isDone ? "done" : ""}" href="${href}">
      <span class="t-icon">${IC(isDone ? "check" : icon)}</span>
      <span class="t-body"><span class="t-title">${title}</span><br><span class="t-sub">${sub}</span></span>
      ${xpTag && !isDone ? `<span class="xp-tag">+${xpTag} XP</span>` : ""}
      <span class="t-go">${IC("chevR")}</span></a>`;

  let tasks = lessons.map(l => taskRow("#/lesson/" + l.id, "book", l.title, `Lesson · ~${l.minutes} min · ${l.chunks.length} micro-chunks`, !!done[l.id], 40)).join("");
  tasks += exs.map(e => taskRow("#/exercise/" + e.id, "puzzle", e.title, e.type === "order" ? "Interactive · put the steps in order" : "Interactive · click the anatomy", !!exDone()[e.id], 30)).join("");
  if (due + fresh > 0) tasks += taskRow("#/cards", "cards", "Spaced repetition", `${due} due review${due === 1 ? "" : "s"} · ${fresh} new card${fresh === 1 ? "" : "s"} — never skip this`, false, 0);
  if ((window.QUESTIONS || []).some(q => q.day === day)) tasks += taskRow("#/quiz/day/" + day, "quiz", "Daily MCQ set", "Test yourself on today's topics (retrieval practice)", false, 0);
  if (day >= 3) tasks += taskRow("#/quiz/weak", "target", "Weakness drill", "Re-attempts questions you have missed before", false, 0);
  if (day === 14) tasks = taskRow("#/exam", "grad", "MOCK ROYAL COLLEGE EXAM", "75 questions across all topics — your final boss", false, 250) + tasks;

  const questRows = questDefs().map(q => {
    const doneQ = !!qd[q.id] || q.val >= q.target;
    return `<div class="quest ${doneQ ? "done" : ""}">
      <span class="quest-ico">${doneQ ? "✅" : q.icon}</span>
      <span class="quest-body"><span class="quest-label">${q.label}</span>
      <span class="bar sm"><span style="width:${Math.round(100 * q.val / q.target)}%"></span></span></span>
      <span class="quest-val">${q.val}/${q.target}</span>
      <span class="xp-tag">+${q.xp}</span></div>`;
  }).join("");

  $("#main").innerHTML = `
    <div class="hero">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="hero-body">
        <span class="pill cyan">Day ${day} of 14 · ${esc(dayInfo.theme)}</span>
        <h1 style="margin-top:8px">${greet}, future surgeon.</h1>
        <p class="muted">${esc(dayInfo.tagline)}</p>
        <div class="hero-level">
          <div class="lvl-badge">${li.n}</div>
          <div style="flex:1;min-width:120px">
            <div class="xp-title">${li.title} · ${xpTotal().toLocaleString()} XP</div>
            <div class="bar xp-bar"><span style="width:${li.pct}%"></span></div>
          </div>
        </div>
      </div>
      ${ring(pct)}
    </div>
    <div class="stat-row">
      <div class="stat"><div class="v" data-count="${due}">0</div><div class="l">Cards due</div></div>
      <div class="stat"><div class="v">${streakCount()} ${streakCount() > 0 ? "🔥" : ""}</div><div class="l">Day streak</div></div>
      <div class="stat"><div class="v">${allDone}/${window.ALL_LESSONS.length}</div><div class="l">Lessons done</div></div>
      <div class="stat"><div class="v" data-count="${totalAnswered()}">0</div><div class="l">Questions answered</div></div>
    </div>
    <div class="card">
      <h2>${IC("zap")} Daily quests</h2>
      ${questRows}
    </div>
    <div class="card">
      <h2>${IC("target")} Today's mission</h2>
      <p class="muted small">Built on what works: <b>chunking</b> (short lessons), <b>retrieval practice</b> (checkpoints &amp; MCQs), <b>spaced repetition</b> (flashcards), and <b>dual coding</b> (diagrams + mnemonics).</p>
      ${tasks}
    </div>
    <div class="card">
      <h2>${IC("bulb")} How to use your ${15 - day} remaining day${15 - day === 1 ? "" : "s"}</h2>
      <ol class="small muted" style="padding-left:20px;margin:6px 0">
        <li><b>Flashcards first</b> — clear your due reviews before anything new. This is non-negotiable for retention.</li>
        <li><b>Lessons</b> — short chunks with checkpoints. Answer every checkpoint from memory before peeking.</li>
        <li><b>Interactives + MCQs</b> — same-day testing roughly doubles retention vs re-reading.</li>
        <li><b>Done early?</b> Hit the weakness drill, not new material.</li>
      </ol>
    </div>`;
  countUpAll();
}

function viewPlan() {
  const day = planDay(), done = doneLessons(), ex = exDone();
  const rows = window.CURRICULUM.map(d => {
    const ls = lessonsForDay(d.day), exs = exercisesForDay(d.day);
    const allDone = ls.length && ls.every(l => done[l.id]);
    const cls = d.day === day ? "current" : allDone ? "done" : d.day > day ? "locked" : "";
    const chips = ls.map(l => `<a class="chip ${done[l.id] ? "done" : ""}" href="#/lesson/${l.id}">${done[l.id] ? IC("check") : IC("book")} ${esc(l.short || l.title)}</a>`).join("") +
      exs.map(e => `<a class="chip ${ex[e.id] ? "done" : ""}" href="#/exercise/${e.id}">${ex[e.id] ? IC("check") : IC("puzzle")} ${esc(e.short || e.title)}</a>`).join("") +
      (d.day === 14 ? `<a class="chip" href="#/exam">${IC("grad")} Mock exam</a>` : "");
    return `<div class="day-row ${cls}">
      <div class="day-num">${d.day}</div>
      <div style="flex:1;min-width:0">
        <div class="day-title">${esc(d.theme)}</div>
        <div class="day-theme">${esc(d.tagline)}</div>
        <div class="chip-row">${chips}</div>
      </div></div>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>The 14-Day Plan</h1>
    <p>Interleaved + spiral curriculum: core surgery first, then your subspecialty focus (breast, thoracic), with built-in review days. Everything stays alive through the flashcard scheduler. You can open future days early, but trust the pacing.</p></div></div>
    <div class="card">${rows}</div>`;
}

/* ---------- lesson player ---------- */
const player = { id: null, idx: 0, answered: {} };
function viewLesson(id) {
  const l = lessonById(id);
  if (!l) { location.hash = "#/"; return; }
  if (player.id !== id) { player.id = id; player.idx = 0; player.answered = {}; }
  renderChunk();
}
function renderChunk() {
  const l = lessonById(player.id);
  const n = l.chunks.length, i = player.idx;
  if (i >= n) { return lessonComplete(l); }
  const ch = l.chunks[i];
  const pct = Math.round(100 * i / n);
  let body = "";
  if (ch.type === "checkpoint") {
    const a = player.answered[i];
    body = `<span class="pill cyan">${IC("target")} Checkpoint — answer from memory</span>
      <h2 style="margin-top:10px">${ch.q}</h2>
      ${ch.options.map((o, oi) => {
        let cls = "", dis = a !== undefined ? "disabled" : "";
        if (a !== undefined) { if (oi === ch.answer) cls = "correct"; else if (oi === a) cls = "wrong"; }
        return `<button class="q-opt ${cls}" ${dis} data-opt="${oi}"><span class="opt-key">${"ABCDE"[oi]}</span><span>${o}</span></button>`;
      }).join("")}
      ${a !== undefined ? `<div class="explain"><b>${a === ch.answer ? "✓ Correct." : "✗ Not quite — the answer is " + "ABCDE"[ch.answer] + "."}</b> ${ch.explain}</div>` : ""}`;
  } else {
    body = (ch.title ? `<h2>${ch.title}</h2>` : "") + ch.html;
  }
  const canNext = ch.type !== "checkpoint" || player.answered[i] !== undefined;
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="#/plan" aria-label="Exit lesson">${IC("chevL")} Exit</a>
      <div class="bar" aria-label="Lesson progress"><span style="width:${pct}%"></span></div>
      <span class="small muted" style="font-variant-numeric:tabular-nums">${i + 1}/${n}</span>
    </div>
    <p class="muted small" style="margin:0 0 8px"><b>${esc(l.title)}</b> · Day ${l.day}</p>
    <div class="chunk">${body}</div>
    <div class="player-nav">
      <button class="btn secondary" id="prev-chunk" ${i === 0 ? "disabled" : ""}>${IC("chevL")} Back</button>
      <button class="btn" id="next-chunk" ${canNext ? "" : "disabled"}>${i === n - 1 ? "Finish lesson" : "Next"} ${IC("chevR")}</button>
    </div>`;
  $("#prev-chunk").onclick = () => { player.idx--; renderChunk(); window.scrollTo(0, 0); };
  $("#next-chunk").onclick = () => { player.idx++; renderChunk(); window.scrollTo(0, 0); };
  document.querySelectorAll(".q-opt").forEach(b => b.onclick = () => {
    const pick = +b.dataset.opt;
    player.answered[i] = pick;
    if (pick === ch.answer) addXP(5);
    logActivity();
    renderChunk();
  });
}
function lessonComplete(l) {
  const first = !doneLessons()[l.id];
  markLessonDone(l.id);
  checkAchievements();
  if (first) confettiBurst();
  const newCount = (window.FLASHCARDS || []).filter(c => c.lesson === l.id).length;
  const nextL = lessonsForDay(l.day).find(x => !doneLessons()[x.id]);
  $("#main").innerHTML = `<div class="card center celebrate" style="padding:46px 20px">
    <div class="confetti">🎉</div>
    <h1>Lesson complete${first ? " · +40 XP" : ""}</h1>
    <p class="muted">${esc(l.title)} is in the bank.${newCount ? ` <b>${newCount} flashcards</b> on this topic are now in your spaced-repetition deck.` : ""}</p>
    <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      ${nextL ? `<a class="btn" href="#/lesson/${nextL.id}">Next lesson ${IC("chevR")}</a>` : ""}
      <a class="btn ${nextL ? "secondary" : ""}" href="#/cards">Review flashcards</a>
      <a class="btn secondary" href="#/">Dashboard</a>
    </div></div>`;
  player.id = null;
  renderNav();
}

/* ---------- flashcards ---------- */
const fc = { queue: [], i: 0, flipped: false, done: 0, again: 0 };
function buildQueue() {
  const due = shuffle(dueCards());
  const slots = Math.max(0, NEW_LIMIT - newToday());
  const fresh = shuffle(newCards()).slice(0, slots);
  fc.queue = due.concat(fresh); fc.i = 0; fc.flipped = false; fc.done = 0; fc.again = 0;
}
function viewCards() {
  buildQueue();
  if (!fc.queue.length) {
    const total = unlockedCards().length;
    const learning = Object.values(srsData()).filter(c => c.st === "lrn" || c.st === "rel").length;
    $("#main").innerHTML = `<div class="page-head"><div><h1>Flashcards</h1><p>True Anki scheduling: learning steps (1 min → 10 min), graduated intervals, ease factor, and lapse handling. Cards come back right before you'd forget them.</p></div></div>
    <div class="card empty">${IC("check")}<h2>All clear! 🧠</h2>
    <p>No cards due right now. ${total ? `You're tracking <b>${total}</b> unlocked cards — more unlock each curriculum day.` : "Cards unlock as you progress through the days."}${learning ? ` <b>${learning}</b> are still in their learning steps and will reappear within minutes.` : ""}</p>
    <p class="small muted">Come back later today or tomorrow — the scheduler knows when you're about to forget.</p>
    <a class="btn mt" href="#/">Back to dashboard</a></div>`;
    return;
  }
  renderCard();
}
function cardStatePill(c) {
  const s = getCardState(c.id);
  if (!s) return "🔵 New card";
  if (s.st === "rev") return "🟢 Review · ivl " + s.iv + "d";
  return s.st === "rel" ? "🟠 Relearning" : "🟠 Learning";
}
function renderCard() {
  if (fc.i >= fc.queue.length) {
    $("#main").innerHTML = `<div class="card center celebrate" style="padding:46px 20px">
      <div class="confetti">🧠</div><h1>Session complete</h1>
      <p class="muted">${fc.done} card${fc.done === 1 ? "" : "s"} reviewed${fc.again ? `, ${fc.again} in learning (they'll return in minutes)` : ""}.</p>
      <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <a class="btn" href="#/">Dashboard</a>
        <button class="btn secondary" onclick="viewCards()">Check for more</button>
      </div></div>`;
    return;
  }
  const c = fc.queue[fc.i];
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="#/">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * fc.i / fc.queue.length)}%"></span></div>
      <span class="small muted" style="font-variant-numeric:tabular-nums">${fc.i + 1}/${fc.queue.length}</span>
    </div>
    <div class="fc-count"><span>${cardStatePill(c)}</span><span>Topic: <b>${esc(c.topic)}</b></span></div>
    <div class="fc-stage">
      <div class="fc-card ${fc.flipped ? "flipped" : ""}" id="fc-card" role="button" tabindex="0" aria-label="Flashcard — press to flip">
        <div class="fc-face"><span class="fc-topic pill cyan">Q</span><div>${c.front}</div><div class="small muted" style="font-weight:500">tap / space to flip</div></div>
        <div class="fc-face back"><span class="fc-topic pill green">A</span><div>${c.back}</div></div>
      </div>
    </div>
    ${fc.flipped ? `<div class="fc-rate">
      <button class="fc-again" data-q="0">Again<span class="ivl">${previewIvl(c, 0)}</span></button>
      <button class="fc-hard" data-q="1">Hard<span class="ivl">${previewIvl(c, 1)}</span></button>
      <button class="fc-good" data-q="2">Good<span class="ivl">${previewIvl(c, 2)}</span></button>
      <button class="fc-easy" data-q="3">Easy<span class="ivl">${previewIvl(c, 3)}</span></button>
    </div><p class="small muted center mt">1 · 2 · 3 · 4 on the keyboard work too. Be honest — the algorithm only works if you are.</p>`
      : `<button class="btn" style="width:100%" id="flip-btn">Show answer</button>`}`;
  const flip = () => { fc.flipped = !fc.flipped; renderCard(); };
  $("#fc-card").onclick = flip;
  if ($("#flip-btn")) $("#flip-btn").onclick = flip;
  document.querySelectorAll(".fc-rate button").forEach(b => b.onclick = () => rateAndAdvance(+b.dataset.q));
}
function rateAndAdvance(r) {
  const requeue = rateCard(fc.queue[fc.i], r);
  fc.done++;
  if (requeue) { fc.again++; fc.queue.push(fc.queue[fc.i]); }
  fc.i++; fc.flipped = false; renderCard(); renderNav();
}
document.addEventListener("keydown", e => {
  if (!location.hash.startsWith("#/cards") || !fc.queue.length || fc.i >= fc.queue.length) return;
  if (e.key === " ") { e.preventDefault(); fc.flipped = !fc.flipped; renderCard(); }
  if (fc.flipped && ["1", "2", "3", "4"].includes(e.key)) rateAndAdvance(+e.key - 1);
});

/* ---------- quiz ---------- */
const quiz = { qs: [], i: 0, score: 0, answered: null, title: "", combo: 0 };
function topicList() {
  const map = {};
  (window.QUESTIONS || []).forEach(q => { (map[q.topic] = map[q.topic] || []).push(q); });
  return map;
}
function viewQuizMenu() {
  const stats = qStats(), day = planDay();
  const map = topicList();
  const rows = Object.entries(map).map(([topic, qs]) => {
    const seen = qs.filter(q => stats[q.id]);
    const acc = seen.length ? Math.round(100 * seen.reduce((a, q) => a + (stats[q.id].ok / stats[q.id].seen), 0) / seen.length) : null;
    const locked = Math.min(...qs.map(q => q.day)) > day;
    return `<a class="task" style="${locked ? "opacity:.55" : ""}" href="#/quiz/topic/${encodeURIComponent(topic)}">
      <span class="t-icon">${IC("quiz")}</span>
      <span class="t-body"><span class="t-title">${esc(topic)}</span><br>
      <span class="t-sub">${qs.length} questions · ${seen.length ? `accuracy ${acc}%` : "not attempted"}${locked ? " · unlocks day " + Math.min(...qs.map(q => q.day)) : ""}</span></span>
      <span class="t-go">${IC("chevR")}</span></a>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>Question Bank</h1><p>${(window.QUESTIONS || []).length} single-best-answer MCQs in Royal College style, with teaching explanations. Immediate feedback mode — answer, learn, move on. Chain correct answers for combo XP.</p></div></div>
    <div class="grid-2">
      <a class="card link-card" href="#/quiz/day/${day}"><h2>${IC("clock")} Today's set</h2><p class="muted small">Mixed questions from Day ${day} topics.</p></a>
      <a class="card link-card" href="#/quiz/weak"><h2>${IC("target")} Weakness drill</h2><p class="muted small">Re-attempts every question you've ever missed.</p></a>
    </div>
    <div class="card mt"><h2>${IC("book")} By topic</h2>${rows}</div>
    <div class="card mt center"><h2 style="justify-content:center">${IC("grad")} Mock Royal College Exam</h2>
      <p class="muted small">75 questions, 90 minutes, no feedback until the end. Save it for Day 14 (or a dress rehearsal on Day 13).</p>
      <a class="btn" href="#/exam">Start mock exam</a></div>`;
}
function startQuiz(qs, title) {
  if (!qs.length) { toast("No questions available yet."); location.hash = "#/quiz"; return; }
  quiz.qs = shuffle(qs).slice(0, 15); quiz.i = 0; quiz.score = 0; quiz.answered = null; quiz.title = title; quiz.combo = 0;
  renderQuiz();
}
function renderQuiz() {
  if (quiz.i >= quiz.qs.length) {
    const pct = Math.round(100 * quiz.score / quiz.qs.length);
    if (pct === 100 && quiz.qs.length >= 10) { Store.set("perfectQuiz", true); }
    if (pct >= 80) confettiBurst();
    checkAchievements();
    $("#main").innerHTML = `<div class="card center celebrate" style="padding:46px 20px">
      <div class="confetti">${pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📚"}</div>
      <h1>${quiz.score}/${quiz.qs.length} (${pct}%)</h1>
      <p class="muted">${pct >= 80 ? "Consultant-level. Keep it warm with the flashcards." : pct >= 60 ? "Passing territory — drill the ones you missed." : "Below the bar today — that's data, not failure. Revisit the lesson, then re-drill."}</p>
      <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <a class="btn" href="#/quiz/weak">Drill my misses</a>
        <a class="btn secondary" href="#/quiz">Question bank</a>
        <a class="btn secondary" href="#/">Dashboard</a>
      </div></div>`;
    return;
  }
  const q = quiz.qs[quiz.i], a = quiz.answered;
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="#/quiz">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * quiz.i / quiz.qs.length)}%"></span></div>
      ${quiz.combo >= 3 ? `<span class="combo-chip">🔥 ×${quiz.combo}</span>` : ""}
      <span class="small muted" style="font-variant-numeric:tabular-nums">${quiz.i + 1}/${quiz.qs.length}</span>
    </div>
    <p class="muted small" style="margin:0 0 8px"><b>${esc(quiz.title)}</b> · ${esc(q.topic)}</p>
    <div class="chunk">
      <h2 style="font-size:1.1rem">${q.stem}</h2>
      ${q.options.map((o, oi) => {
        let cls = "", dis = a !== null ? "disabled" : "";
        if (a !== null) { if (oi === q.answer) cls = "correct"; else if (oi === a) cls = "wrong"; }
        return `<button class="q-opt ${cls}" ${dis} data-opt="${oi}"><span class="opt-key">${"ABCDE"[oi]}</span><span>${o}</span></button>`;
      }).join("")}
      ${a !== null ? `<div class="explain"><b>${a === q.answer ? "✓ Correct." : "✗ The answer is " + "ABCDE"[q.answer] + "."}</b> ${q.explain}</div>` : ""}
    </div>
    ${a !== null ? `<div class="player-nav"><span></span><button class="btn" id="next-q">${quiz.i === quiz.qs.length - 1 ? "See results" : "Next question"} ${IC("chevR")}</button></div>` : ""}`;
  document.querySelectorAll(".q-opt").forEach(b => b.onclick = () => {
    quiz.answered = +b.dataset.opt;
    const ok = quiz.answered === q.answer;
    if (ok) {
      quiz.score++; quiz.combo++;
      if (quiz.combo > Store.get("bestCombo", 0)) Store.set("bestCombo", quiz.combo);
      addXP(10 + (quiz.combo >= 3 ? Math.min(quiz.combo, 8) : 0));
    } else quiz.combo = 0;
    recordAnswer(q.id, ok);
    checkAchievements();
    renderQuiz();
  });
  if ($("#next-q")) $("#next-q").onclick = () => { quiz.i++; quiz.answered = null; renderQuiz(); window.scrollTo(0, 0); };
}

/* ---------- mock exam ---------- */
const exam = { qs: [], answers: [], i: 0, end: 0, timer: null, finished: false };
function viewExamIntro() {
  $("#main").innerHTML = `<div class="card center" style="padding:40px 22px">
    <h1>${IC("grad", "")} Mock Royal College Exam</h1>
    <p class="muted" style="max-width:560px;margin:8px auto">75 single-best-answer questions drawn from the whole curriculum (weighted to general surgery, breast and thoracic). 90 minutes. No feedback until you submit — just like the real thing. You can flag and jump between questions.</p>
    <p class="small muted">Pass benchmark: <b>70%</b> · Reward: <b>+150 XP</b> (+100 bonus for a pass)</p>
    <button class="btn" id="start-exam">Begin exam</button></div>`;
  $("#start-exam").onclick = () => {
    exam.qs = shuffle(window.QUESTIONS || []).slice(0, 75);
    exam.answers = new Array(exam.qs.length).fill(null);
    exam.i = 0; exam.finished = false;
    exam.end = Date.now() + 90 * 60000;
    clearInterval(exam.timer);
    exam.timer = setInterval(() => {
      const el = $("#exam-clock");
      if (!el) return;
      const left = exam.end - Date.now();
      if (left <= 0) { finishExam(); return; }
      const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
      el.textContent = `${m}:${String(s).padStart(2, "0")}`;
      if (left < 5 * 60000) el.style.color = "var(--danger)";
    }, 1000);
    renderExam();
  };
}
function renderExam() {
  if (exam.finished) return renderExamResults();
  const q = exam.qs[exam.i];
  const grid = exam.qs.map((_, gi) =>
    `<button data-g="${gi}" class="${gi === exam.i ? "cur" : exam.answers[gi] !== null ? "answered" : ""}" aria-label="Question ${gi + 1}">${gi + 1}</button>`).join("");
  $("#main").innerHTML = `
    <div class="player-top">
      <span class="pill cyan">MOCK EXAM</span>
      <div class="bar"><span style="width:${Math.round(100 * exam.answers.filter(a => a !== null).length / exam.qs.length)}%"></span></div>
      <span class="exam-timer" id="exam-clock">--:--</span>
    </div>
    <div class="exam-grid">${grid}</div>
    <div class="chunk">
      <p class="muted small" style="margin:0">Question ${exam.i + 1} of ${exam.qs.length} · ${esc(q.topic)}</p>
      <h2 style="font-size:1.1rem">${q.stem}</h2>
      ${q.options.map((o, oi) => `<button class="q-opt ${exam.answers[exam.i] === oi ? "correct" : ""}" data-opt="${oi}"><span class="opt-key">${"ABCDE"[oi]}</span><span>${o}</span></button>`).join("")}
    </div>
    <div class="player-nav">
      <button class="btn secondary" id="ex-prev" ${exam.i === 0 ? "disabled" : ""}>${IC("chevL")} Prev</button>
      <button class="btn outline" id="ex-submit">Submit exam</button>
      <button class="btn" id="ex-next" ${exam.i === exam.qs.length - 1 ? "disabled" : ""}>Next ${IC("chevR")}</button>
    </div>`;
  document.querySelectorAll(".exam-grid button").forEach(b => b.onclick = () => { exam.i = +b.dataset.g; renderExam(); });
  document.querySelectorAll(".q-opt").forEach(b => b.onclick = () => { exam.answers[exam.i] = +b.dataset.opt; if (exam.i < exam.qs.length - 1) exam.i++; renderExam(); });
  $("#ex-prev").onclick = () => { exam.i--; renderExam(); };
  $("#ex-next").onclick = () => { exam.i++; renderExam(); };
  $("#ex-submit").onclick = () => {
    const blank = exam.answers.filter(a => a === null).length;
    if (blank && !confirm(`${blank} unanswered question${blank === 1 ? "" : "s"}. Submit anyway?`)) return;
    finishExam();
  };
}
function finishExam() {
  clearInterval(exam.timer); exam.finished = true;
  exam.qs.forEach((q, i) => recordAnswer(q.id, exam.answers[i] === q.answer));
  const score = exam.qs.reduce((a, q, i) => a + (exam.answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round(100 * score / exam.qs.length);
  if (pct >= 70) { Store.set("examPass", true); }
  addXP(150 + (pct >= 70 ? 100 : 0));
  checkAchievements();
  renderExamResults();
}
function renderExamResults() {
  const score = exam.qs.reduce((a, q, i) => a + (exam.answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round(100 * score / exam.qs.length);
  if (pct >= 70) confettiBurst();
  const byTopic = {};
  exam.qs.forEach((q, i) => {
    const t = byTopic[q.topic] = byTopic[q.topic] || { n: 0, ok: 0 };
    t.n++; if (exam.answers[i] === q.answer) t.ok++;
  });
  const topicRows = Object.entries(byTopic).sort((a, b) => (a[1].ok / a[1].n) - (b[1].ok / b[1].n)).map(([t, v]) =>
    `<div style="margin-top:10px"><div style="display:flex;justify-content:space-between" class="small"><b>${esc(t)}</b><span class="muted">${v.ok}/${v.n}</span></div>
     <div class="bar ${v.ok / v.n >= .7 ? "green" : ""}"><span style="width:${Math.round(100 * v.ok / v.n)}%"></span></div></div>`).join("");
  const review = exam.qs.map((q, i) => {
    if (exam.answers[i] === q.answer) return "";
    return `<div class="chunk" style="margin-top:12px"><p class="muted small" style="margin:0">Q${i + 1} · ${esc(q.topic)}</p>
      <h3>${q.stem}</h3>
      <p class="small"><span class="pill red">Your answer</span> ${exam.answers[i] === null ? "<i>blank</i>" : q.options[exam.answers[i]]}</p>
      <p class="small"><span class="pill green">Correct</span> ${q.options[q.answer]}</p>
      <div class="explain">${q.explain}</div></div>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="card center celebrate" style="padding:36px 20px">
      <div class="confetti">${pct >= 70 ? "🏆" : "📚"}</div>
      <h1>${score}/${exam.qs.length} — ${pct}%</h1>
      <p class="muted"><b>${pct >= 70 ? "PASS — you'd walk into that exam with a smile." : "Below the 70% bar — the topic breakdown below tells you exactly where to spend tonight."}</b></p>
    </div>
    <div class="card mt"><h2>${IC("chart")} Performance by topic (weakest first)</h2>${topicRows}</div>
    ${review ? `<h2 class="mt">Review your misses</h2>${review}` : ""}
    <div class="mt center"><a class="btn" href="#/">Back to dashboard</a></div>`;
  window.scrollTo(0, 0);
}

/* ---------- exercises ---------- */
function viewExerciseList() {
  const day = planDay(), done = exDone();
  const rows = (window.EXERCISES || []).map(e => {
    const locked = e.day > day;
    return `<a class="task ${done[e.id] ? "done" : ""}" style="${locked ? "opacity:.55" : ""}" href="#/exercise/${e.id}">
      <span class="t-icon">${IC(done[e.id] ? "check" : e.type === "order" ? "puzzle" : "scope")}</span>
      <span class="t-body"><span class="t-title">${esc(e.title)}</span><br>
      <span class="t-sub">${e.type === "order" ? "Sequence builder" : "Click-the-anatomy"} · Day ${e.day}${locked ? " · locked until day " + e.day : ""}</span></span>
      <span class="t-go">${IC("chevR")}</span></a>`;
  }).join("");
  $("#main").innerHTML = `<div class="page-head"><div><h1>Interactive Lab</h1>
    <p>Anatomy you click and operations you assemble step-by-step. Active reconstruction beats passive review — these are your "hands" for the next two weeks.</p></div></div>
    <div class="card">${rows}</div>`;
}
const ex = { id: null, next: 0, errors: 0, order: [] };
function viewExercise(id) {
  const e = (window.EXERCISES || []).find(x => x.id === id);
  if (!e) { location.hash = "#/exercises"; return; }
  ex.id = id; ex.next = 0; ex.errors = 0;
  if (e.type === "order") { ex.order = shuffle(e.steps.map((_, i) => i)); renderOrderEx(e); }
  else renderLabelEx(e);
}
function renderOrderEx(e) {
  const placed = e.steps.slice(0, ex.next);
  if (ex.next >= e.steps.length) return exComplete(e);
  $("#main").innerHTML = `
    <div class="player-top"><a class="btn sm secondary" href="#/exercises">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * ex.next / e.steps.length)}%"></span></div>
      <span class="small muted">${ex.next}/${e.steps.length}</span></div>
    <div class="card">
      <h2>${IC("puzzle")} ${esc(e.title)}</h2>
      <p class="muted small">${e.intro || "Click the steps in the correct order. Wrong picks shake — and teach."}</p>
      ${placed.map((s, i) => `<div class="ex-step placed"><span class="step-no">${i + 1}</span>${s}</div>`).join("")}
      <hr class="sep">
      <p class="small muted" style="margin:4px 0"><b>Which step comes next?</b></p>
      ${ex.order.filter(i => i >= ex.next).map(i => `<button class="ex-step" data-i="${i}">${e.steps[i]}</button>`).join("")}
    </div>`;
  document.querySelectorAll("button.ex-step").forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    if (i === ex.next) { ex.next++; renderOrderEx(e); }
    else { ex.errors++; b.classList.add("shake"); setTimeout(() => b.classList.remove("shake"), 350); }
  });
}
function renderLabelEx(e) {
  if (ex.next >= e.targets.length) return exComplete(e);
  const t = e.targets[ex.next];
  $("#main").innerHTML = `
    <div class="player-top"><a class="btn sm secondary" href="#/exercises">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * ex.next / e.targets.length)}%"></span></div>
      <span class="small muted">${ex.next}/${e.targets.length}</span></div>
    <div class="card">
      <h2>${IC("scope")} ${esc(e.title)}</h2>
      <div class="ex-prompt">Click on: <span style="color:var(--primary)">${t.label}</span></div>
      <div class="diagram label-svg" id="label-stage">${e.svg}</div>
      <p class="small muted center">${e.caption || ""}</p>
    </div>`;
  const stage = $("#label-stage");
  e.targets.slice(0, ex.next).forEach(done => {
    const el = stage.querySelector(`[data-zone="${done.zone}"]`);
    if (el) { el.style.fill = "var(--ok)"; el.style.opacity = ".55"; el.classList.add("zone-found"); }
  });
  stage.querySelectorAll("[data-zone]").forEach(z => z.addEventListener("click", () => {
    if (z.dataset.zone === t.zone) { ex.next++; renderLabelEx(e); }
    else {
      ex.errors++;
      z.style.fill = "var(--danger)";
      setTimeout(() => { z.style.fill = ""; }, 350);
      toast("Not that one — " + (t.hint || "look again."));
    }
  }));
}
function exComplete(e) {
  const d = exDone();
  const first = !d[e.id];
  d[e.id] = true; Store.set("exdone", d);
  bumpStreak(); logActivity();
  if (first) addXP(ex.errors === 0 ? 45 : 30);
  if (ex.errors === 0) { Store.set("flawlessEx", true); confettiBurst(); }
  checkAchievements();
  const acc = e.type === "order" ? e.steps.length : e.targets.length;
  $("#main").innerHTML = `<div class="card center celebrate" style="padding:46px 20px">
    <div class="confetti">${ex.errors === 0 ? "🎯" : "✅"}</div>
    <h1>${ex.errors === 0 ? "Flawless!" : "Complete"}</h1>
    <p class="muted">${esc(e.title)} — ${acc} items, ${ex.errors} miss${ex.errors === 1 ? "" : "es"}.${ex.errors > 2 ? " Run it again tomorrow; sequences need repetition too." : ""}</p>
    <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn secondary" onclick="viewExercise('${e.id}')">Retry</button>
      <a class="btn" href="#/exercises">More interactives</a>
      <a class="btn secondary" href="#/">Dashboard</a></div></div>`;
}

/* ---------- heatmap ---------- */
function heatmapHTML() {
  const a = Store.get("activity", {});
  const weeks = 12, cells = [];
  const today = new Date(todayStr());
  const start = new Date(today.getTime() - (weeks * 7 - 1) * DAY_MS);
  // align to Sunday
  start.setDate(start.getDate() - start.getDay());
  let html = "";
  for (let w = 0; w < weeks + 1; w++) {
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
      if (dt > today) continue;
      const key = dt.toISOString().slice(0, 10);
      const n = a[key] || 0;
      const lvl = n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
      html += `<i class="hm-cell l${lvl}" style="grid-column:${w + 1};grid-row:${d + 1}" title="${key}: ${n} action${n === 1 ? "" : "s"}"></i>`;
    }
  }
  return `<div class="heatmap" role="img" aria-label="Study activity heatmap">${html}</div>
    <div class="hm-legend small muted">Less <i class="hm-cell l0"></i><i class="hm-cell l1"></i><i class="hm-cell l2"></i><i class="hm-cell l3"></i><i class="hm-cell l4"></i> More</div>`;
}

/* ---------- progress ---------- */
function viewProgress() {
  const done = doneLessons(), stats = qStats(), srs = srsData();
  const lessonsPct = Math.round(100 * Object.keys(done).length / window.ALL_LESSONS.length);
  const tracked = Object.keys(srs).length;
  const mature = Object.values(srs).filter(c => c.iv >= 21).length;
  const learning = Object.values(srs).filter(c => c.st === "lrn" || c.st === "rel" || (!c.st && c.iv === 0)).length;
  const totalQ = totalAnswered(), okQ = totalCorrect();
  const dayRows = window.CURRICULUM.map(d => {
    const ls = lessonsForDay(d.day);
    const n = ls.filter(l => done[l.id]).length;
    return `<div style="margin-top:10px"><div style="display:flex;justify-content:space-between" class="small"><b>Day ${d.day} — ${esc(d.theme)}</b><span class="muted">${n}/${ls.length}</span></div>
      <div class="bar ${n === ls.length && ls.length ? "green" : ""}"><span style="width:${ls.length ? Math.round(100 * n / ls.length) : 0}%"></span></div></div>`;
  }).join("");
  const map = topicList();
  const topicRows = Object.entries(map).map(([t, qs]) => {
    const att = qs.filter(q => stats[q.id]);
    if (!att.length) return "";
    const acc = Math.round(100 * att.reduce((a, q) => a + stats[q.id].ok / stats[q.id].seen, 0) / att.length);
    return `<div style="margin-top:10px"><div style="display:flex;justify-content:space-between" class="small"><b>${esc(t)}</b><span class="muted">${acc}%</span></div>
      <div class="bar ${acc >= 70 ? "green" : ""}"><span style="width:${acc}%"></span></div></div>`;
  }).join("") || `<p class="muted small">Answer some MCQs to see your accuracy map.</p>`;
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>Progress</h1><p>What gets measured gets retained.</p></div>${ring(lessonsPct)}</div>
    <div class="stat-row">
      <div class="stat"><div class="v" data-count="${tracked}">0</div><div class="l">Cards in rotation</div></div>
      <div class="stat"><div class="v" data-count="${mature}">0</div><div class="l">Mature (≥21d)</div></div>
      <div class="stat"><div class="v" data-count="${learning}">0</div><div class="l">In learning</div></div>
      <div class="stat"><div class="v">${totalQ ? Math.round(100 * okQ / totalQ) + "%" : "—"}</div><div class="l">MCQ accuracy</div></div>
    </div>
    <div class="card"><h2>${IC("flame")} Study activity</h2>
      <p class="muted small" style="margin-top:0">Every review, answer and lesson lights a square. Don't break the chain.</p>
      ${heatmapHTML()}</div>
    <div class="grid-2 mt">
      <div class="card"><h2>${IC("map")} Curriculum</h2>${dayRows}</div>
      <div class="card"><h2>${IC("target")} MCQ accuracy by topic</h2>${topicRows}</div>
    </div>
    <div class="card mt">
      <h2>${IC("alert")} Danger zone</h2>
      <p class="muted small">Wipes lessons, XP, achievements, scheduler history, and stats. There is no undo.</p>
      <button class="btn outline" id="reset-all" style="color:var(--danger);border-color:var(--danger)">Reset all progress</button>
    </div>`;
  countUpAll();
  $("#reset-all").onclick = () => {
    if (confirm("Really wipe ALL progress? This cannot be undone.") && confirm("Last chance — wipe everything?")) {
      Object.keys(localStorage).filter(k => k.startsWith("st_")).forEach(k => localStorage.removeItem(k));
      toast("Progress reset."); route();
    }
  };
}

/* ---------- awards ---------- */
function viewAwards() {
  const st = achState();
  const unlocked = Object.keys(st).length;
  const li = levelInfo(xpTotal());
  const ranks = LEVELS.map((l, i) => `
    <div class="rank-row ${li.n > i ? "reached" : li.n === i + 1 ? "" : "future"}">
      <div class="lvl-badge sm ${li.n >= i + 1 ? "" : "ghost"}">${i + 1}</div>
      <span class="rank-title">${l.title}</span>
      <span class="muted small">${l.xp.toLocaleString()} XP</span>
    </div>`).join("");
  const badges = ACHIEVEMENTS.map(a => {
    const got = st[a.id];
    return `<div class="badge ${got ? "got" : "locked"}">
      <span class="badge-ico">${got ? a.icon : "🔒"}</span>
      <span class="badge-title">${a.title}</span>
      <span class="badge-desc">${a.desc}</span>
      ${got ? `<span class="badge-date">${new Date(got).toLocaleDateString()}</span>` : ""}
    </div>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>Awards</h1><p>${unlocked}/${ACHIEVEMENTS.length} achievements unlocked · each badge is worth bragging rights and the XP that got you there.</p></div></div>
    <div class="grid-2">
      <div class="card"><h2>${IC("grad")} Rank ladder</h2>${ranks}</div>
      <div class="card"><h2>${IC("trophy")} Achievements</h2><div class="badge-grid">${badges}</div></div>
    </div>`;
}

/* ---------- router ---------- */
function route() {
  const h = location.hash || "#/";
  const parts = h.slice(2).split("/").map(decodeURIComponent);
  window.scrollTo(0, 0);
  const main = $("#main");
  main.classList.remove("page-anim"); void main.offsetWidth; main.classList.add("page-anim");
  if (h === "#/" || h === "") viewDashboard();
  else if (parts[0] === "plan") viewPlan();
  else if (parts[0] === "lesson") viewLesson(parts[1]);
  else if (parts[0] === "cards") viewCards();
  else if (parts[0] === "quiz" && parts[1] === "day") startQuiz((window.QUESTIONS || []).filter(q => q.day === +parts[2]), "Day " + parts[2] + " set");
  else if (parts[0] === "quiz" && parts[1] === "topic") startQuiz((window.QUESTIONS || []).filter(q => q.topic === parts[2]), parts[2]);
  else if (parts[0] === "quiz" && parts[1] === "weak") {
    const s = qStats();
    startQuiz((window.QUESTIONS || []).filter(q => s[q.id] && s[q.id].ok < s[q.id].seen), "Weakness drill");
  }
  else if (parts[0] === "quiz") viewQuizMenu();
  else if (parts[0] === "exam") viewExamIntro();
  else if (parts[0] === "exercises") viewExerciseList();
  else if (parts[0] === "exercise") viewExercise(parts[1]);
  else if (parts[0] === "progress") viewProgress();
  else if (parts[0] === "awards") viewAwards();
  else if (parts[0] === "anatomy" && window.Anatomy) window.Anatomy.render(parts);
  else if (parts[0] === "anat-cards" && window.Anatomy) window.Anatomy.renderCards(parts);
  else if (parts[0] === "trials" && window.Trials) window.Trials.render(parts);
  else viewDashboard();
  renderNav();
  $("#main").focus({ preventScroll: true });
}

/* ---------- boot ---------- */
(function init() {
  window.ALL_LESSONS = Object.values(window.LESSONS || {}).sort((a, b) => a.day - b.day || a.ord - b.ord);
  const savedTheme = Store.get("theme", null);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");
  $("#theme-toggle").onclick = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; Store.set("theme", next); renderNav();
  };
  getStartDate();
  window.addEventListener("hashchange", route);
  route();
})();

````

### CORE FILE 4 of 4 — `tools/validate.js`

````javascript
/* Structural validator — run with: node tools/validate.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
const files = [
  "curriculum.js", "diagrams.js",
  "lessons-foundations.js", "lessons-abdomen.js", "lessons-gi.js",
  "lessons-breast.js", "lessons-thoracic.js", "lessons-endocrine-trauma.js",
  "flashcards.js", "flashcards2.js", "flashcards3.js", "questions.js", "questions2.js", "questions3.js", "questions4.js", "exercises.js"
];
let errs = [], warns = [];
for (const f of files) {
  const p = path.join(root, "js/data", f);
  if (!fs.existsSync(p)) { warns.push("MISSING FILE: " + f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f }); }
  catch (e) { errs.push("RUNTIME ERROR in " + f + ": " + e.message); }
}
const W = ctx.window;

/* curriculum */
if (!W.CURRICULUM || W.CURRICULUM.length !== 14) errs.push("CURRICULUM must have 14 days");

/* lessons */
const lessons = Object.values(W.LESSONS || {});
console.log("Lessons:", lessons.length);
const expectDays = {};
for (const l of lessons) {
  if (!l.id || !l.title || !l.day || !Array.isArray(l.chunks) || !l.chunks.length) errs.push("Bad lesson: " + (l.id || "?"));
  expectDays[l.day] = (expectDays[l.day] || 0) + 1;
  l.chunks.forEach((c, i) => {
    if (c.type === "checkpoint") {
      if (!c.q || !Array.isArray(c.options) || c.options.length < 2) errs.push(l.id + " chunk " + i + ": bad checkpoint");
      else if (typeof c.answer !== "number" || c.answer < 0 || c.answer >= c.options.length) errs.push(l.id + " chunk " + i + ": answer out of range");
      if (!c.explain) warns.push(l.id + " chunk " + i + ": checkpoint missing explain");
    } else {
      if (!c.html) errs.push(l.id + " chunk " + i + ": teaching chunk missing html");
      else {
        const open = (c.html.match(/<div/g) || []).length, close = (c.html.match(/<\/div>/g) || []).length;
        if (open !== close) warns.push(l.id + " chunk " + i + ": div mismatch (" + open + " open / " + close + " close)");
      }
    }
  });
}
for (let d = 1; d <= 13; d++) if (!expectDays[d]) errs.push("No lessons for day " + d);

/* flashcards */
const cards = W.FLASHCARDS || [];
console.log("Flashcards:", cards.length);
const cardIds = new Set();
for (const c of cards) {
  if (!c.id || !c.front || !c.back || !c.day || !c.topic) errs.push("Bad card: " + JSON.stringify(c).slice(0, 60));
  if (cardIds.has(c.id)) errs.push("Duplicate card id: " + c.id);
  cardIds.add(c.id);
  if (c.lesson && !(W.LESSONS || {})[c.lesson]) warns.push("Card " + c.id + " references unknown lesson " + c.lesson);
}

/* questions */
const qs = W.QUESTIONS || [];
console.log("Questions:", qs.length);
const qIds = new Set(), qDays = {};
for (const q of qs) {
  if (!q.id || !q.stem || !Array.isArray(q.options) || q.options.length < 3) errs.push("Bad question: " + (q.id || "?"));
  else if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) errs.push(q.id + ": answer out of range");
  if (!q.explain) warns.push(q.id + ": missing explain");
  if (qIds.has(q.id)) errs.push("Duplicate question id: " + q.id);
  qIds.add(q.id); qDays[q.day] = (qDays[q.day] || 0) + 1;
}
console.log("Questions by day:", JSON.stringify(qDays));

/* exercises: zones must exist in their svg */
for (const e of W.EXERCISES || []) {
  if (e.type === "label") {
    for (const t of e.targets) {
      if (!e.svg.includes('data-zone="' + t.zone + '"')) errs.push(e.id + ": zone not in svg: " + t.zone);
    }
  } else if (e.type === "order") {
    if (!Array.isArray(e.steps) || e.steps.length < 4) errs.push(e.id + ": too few steps");
  }
}
console.log("Exercises:", (W.EXERCISES || []).length);

console.log("\n--- WARNINGS (" + warns.length + ") ---"); warns.forEach(w => console.log("  ⚠ " + w));
console.log("--- ERRORS (" + errs.length + ") ---"); errs.forEach(e => console.log("  ✗ " + e));
process.exit(errs.length ? 1 : 0);

````

### OPTIONAL MODULE A — Anatomy (review + isolated cloze flashcards)

Include all five files below **plus** author your own `js/anatomy/regions-*.js` and `js/anatomy/cards-*.js` content files per `_SPEC.md`. `anatomy-base.js` and `diagrams.js` below still contain the original surgical category list / SVGs — treat them as TEMPLATES: keep the `window.ANATOMY = { categories:[...], regions:[], cards:[] }` shape and the `window.ADG = {}` pattern, but replace the categories and diagrams with your own. The engine (`anatomy.js`), CSS, and validator are content-agnostic — copy them verbatim.

#### `css/anatomy.css`

````css
/* ============================================================================
   Standalone Anatomy section — additive styles only.
   Reuses the core design tokens (--g1/--g2, --surface, --border, --fg-soft,
   --r-sm, --shadow) and existing .card/.btn/.pill/.stat/.fc-* classes.
   ============================================================================ */

/* venous-drainage pill colour (others reuse existing .pill.* variants) */
.pill.violet { background: var(--mnem-bg); color: var(--mnem); }

/* hub stats strip */
.anat-stats { display: flex; gap: 12px; flex-wrap: wrap; }
.anat-stats .stat { flex: 1; min-width: 110px; }

/* category sections */
.anat-cat { margin-top: 26px; }
.anat-cat-head h2 { margin: 0 0 2px; }
.anat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 12px; }

.anat-region-card {
  display: flex; flex-direction: column; gap: 4px;
  padding: 15px 16px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); box-shadow: var(--shadow); text-decoration: none; color: var(--fg);
  transition: transform .12s, border-color .18s, box-shadow .18s;
}
.anat-region-card:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
.arc-title { font-weight: 800; font-family: var(--font-display); }
.arc-foot { display: flex; align-items: center; gap: 4px; color: var(--fg-soft); font-weight: 600; margin-top: 4px; }
.arc-foot svg { width: 14px; height: 14px; }

/* region page */
.anat-diagram { display: flex; justify-content: center; padding: 18px; }
.anat-diagram svg { max-width: 100%; height: auto; }
.anat-section { margin-top: 16px; }
.anat-section h2 { margin: 0 0 10px; }
.anat-prose p { margin: 0 0 .7em; line-height: 1.6; }
.anat-prose ul, .anat-prose ol { margin: .4em 0 .8em; padding-left: 1.25em; line-height: 1.55; }
.anat-prose li { margin: .25em 0; }
.anat-region-foot { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px; }
.anat-h2 { margin: 26px 0 12px; }

/* deck menu */
.anat-deck-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
.anat-deck-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%;
  padding: 13px 16px; margin-top: 10px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); box-shadow: var(--shadow); color: var(--fg); cursor: pointer; text-align: left;
  transition: transform .12s, border-color .18s;
}
.anat-deck-row:hover { transform: translateY(-2px); border-color: var(--primary); }
.adr-title { font-weight: 700; }
.adr-meta { display: flex; align-items: center; gap: 5px; color: var(--fg-soft); font-weight: 600; white-space: nowrap; }
.adr-meta svg { width: 14px; height: 14px; }

/* cloze styling inside the flashcard */
.cloze-text { font-size: 1.12rem; line-height: 1.6; }
.cloze-blank {
  display: inline-block; min-width: 2.4em; padding: 0 .35em; margin: 0 .1em;
  border-bottom: 2px solid var(--primary); color: var(--primary);
  font-weight: 700; background: color-mix(in srgb, var(--primary) 10%, transparent); border-radius: 5px 5px 0 0;
}
.cloze-fill {
  padding: 0 .25em; font-weight: 800; color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent); border-radius: 5px;
}

````

#### `js/anatomy/anatomy-base.js` (TEMPLATE — edit the categories list for your topic)

````javascript
/* ============================================================================
   ScalpelSchool — STANDALONE ANATOMY MODULE (isolated data root)
   This file MUST load before regions-*.js / cards-*.js (which push into it)
   and before anatomy.js (which reads it). It is completely independent of the
   14-day plan: no day gating, no shared SRS store, no XP/streak/quests.
   ============================================================================ */
"use strict";

window.ANATOMY = {
  /* Top-level grouping shown as headers on the Anatomy Review hub. */
  categories: [
    { id: "abdomen",  title: "Abdominal Wall & Inguinal",   blurb: "Layers, inguinal & femoral canals, hernia anatomy, peritoneum & retroperitoneum." },
    { id: "git",      title: "GI Tract",                     blurb: "Esophagus, stomach, small bowel & mesentery, colon, rectum & anal canal." },
    { id: "hpb",      title: "Hepatobiliary, Pancreas & Spleen", blurb: "Liver segments, biliary tree & Calot's triangle, pancreas, spleen, portal system." },
    { id: "breast",   title: "Breast & Axilla",              blurb: "Ducts & lobules, blood supply, axillary levels & nodes, lymphatic drainage." },
    { id: "thorax",   title: "Thorax, Lungs & Mediastinum",  blurb: "Chest wall, diaphragm, lung lobes & segments, pleura, mediastinum, great vessels." },
    { id: "neck",     title: "Neck — Thyroid & Parathyroid", blurb: "Thyroid, parathyroids, trachea, neck triangles and surgical relations." },
    { id: "vascular", title: "Vascular & Lymphatic",         blurb: "Aorta & branches, celiac/SMA/IMA, venous return, thoracic duct & lymphatics." },
    { id: "neuro",    title: "Surgical Nervous System",      blurb: "Vagus, recurrent laryngeal, phrenic, sympathetic chain and other nerves at risk in surgery." }
  ],
  /* Region review pages — pushed by regions-<cat>.js
     { id, category, title, short, blurb, diagram?:"ADG.x"|"DG.x",
       sections:[{heading, html}], pearls:[ "..." ] } */
  regions: [],
  /* Cloze flashcards — pushed by cards-<cat>.js
     { id:"a-<region>-NN", region, category, subtype, text:"... {{c1::answer}} ..." }
     subtype ∈ structures | arterial | venous | lymphatic | nerves | surgical */
  cards: []
};

````

#### `js/anatomy/diagrams.js` (TEMPLATE — replace SVGs with your own; `window.ADG = {}` is the contract)

````javascript
/* Anatomy diagram library — themable inline SVG (mirrors window.DG conventions).
   Regions reference these by key, e.g. diagram:"ADG.inguinal". Region.diagram is
   OPTIONAL — regions without a diagram simply render prose. Reuse window.DG keys
   (e.g. "DG.biliary") where a suitable diagram already exists. */
window.ADG = {};

/* ---- Inguinal canal / Hesselbach's triangle ---- */
window.ADG.inguinal = `
<svg viewBox="0 0 460 260" role="img" aria-label="Inguinal canal and Hesselbach's triangle">
  <style>.adt{font:600 12px Figtree,sans-serif;fill:var(--fg);pointer-events:none}.ads{font:600 10.5px Figtree,sans-serif;fill:var(--fg-soft);pointer-events:none}</style>
  <line x1="40" y1="60" x2="420" y2="60" stroke="var(--fg-soft)" stroke-width="2"/>
  <text x="40" y="50" class="ads">Anterior abdominal wall (deep surface)</text>
  <path d="M120 60 Q130 130 150 200" stroke="var(--primary)" stroke-width="3" fill="none"/>
  <text x="60" y="150" class="ads">inferior epigastric a.</text>
  <line x1="150" y1="200" x2="320" y2="200" stroke="var(--accent)" stroke-width="3"/>
  <text x="200" y="218" class="ads">inguinal ligament</text>
  <line x1="320" y1="200" x2="320" y2="60" stroke="var(--fg-soft)" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="326" y="130" class="ads">rectus (lateral border)</text>
  <polygon data-zone="hesselbach" points="320,60 320,200 150,200" fill="rgba(124,58,237,.22)" stroke="var(--mnem)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="250" y="160" class="ads" style="fill:var(--mnem)">▲ Hesselbach (direct)</text>
  <circle data-zone="deep-ring" cx="120" cy="95" r="12" fill="rgba(8,145,178,.3)" stroke="var(--primary)" stroke-width="2"/>
  <text x="95" y="85" class="ads">deep ring (indirect)</text>
</svg>`;

/* ---- Axillary nodal levels (relative to pectoralis minor) ---- */
window.ADG.axilla = `
<svg viewBox="0 0 460 240" role="img" aria-label="Axillary lymph node levels">
  <style>.adt{font:600 12px Figtree,sans-serif;fill:var(--fg);pointer-events:none}.ads{font:600 10.5px Figtree,sans-serif;fill:var(--fg-soft);pointer-events:none}</style>
  <path d="M150 40 Q210 30 250 70" stroke="var(--fg-soft)" stroke-width="3" fill="none"/>
  <text x="150" y="30" class="ads">axillary vein</text>
  <polygon points="200,90 290,90 260,150 230,150" fill="rgba(124,58,237,.18)" stroke="var(--mnem)" stroke-width="1.5"/>
  <text x="222" y="125" class="ads" style="fill:var(--mnem)">pec minor</text>
  <rect data-zone="level1" x="300" y="80" width="120" height="44" rx="8" fill="rgba(8,145,178,.22)" stroke="var(--primary)" stroke-width="2"/>
  <text x="360" y="106" text-anchor="middle" class="adt">Level I (lateral)</text>
  <rect data-zone="level2" x="205" y="80" width="80" height="44" rx="8" fill="rgba(5,150,105,.22)" stroke="var(--accent)" stroke-width="2"/>
  <text x="245" y="106" text-anchor="middle" class="ads">Level II</text>
  <rect data-zone="level3" x="90" y="80" width="100" height="44" rx="8" fill="rgba(217,119,6,.25)" stroke="#D97706" stroke-width="2"/>
  <text x="140" y="106" text-anchor="middle" class="ads">Level III (medial)</text>
</svg>`;

````

#### `js/anatomy/anatomy.js` (ENGINE — copy verbatim)

````javascript
/* ============================================================================
   ScalpelSchool — STANDALONE ANATOMY ENGINE
   Renders the Anatomy Review hub + region pages (#/anatomy, #/anatomy/<id>)
   and the Anatomy Flashcards deck (#/anat-cards…) with full spaced repetition
   in an ISOLATED localStorage namespace (st_anat_*). It reuses only the PURE
   global helpers from app.js — schedule(), blankCard(), esc(), shuffle(),
   Store, IC — and never calls addXP / bumpStreak / bumpDaily / checkAchievements,
   so anatomy activity has zero effect on the 14-day plan or its gamification.
   ============================================================================ */
(function () {
  "use strict";
  if (!window.ANATOMY) return; // data missing → stay fully inert, host app unaffected

  const A = window.ANATOMY;
  const SUBTYPES = {
    structures: { label: "Structures & relations", pill: "cyan" },
    arterial:   { label: "Arterial supply",        pill: "red" },
    venous:     { label: "Venous drainage",        pill: "violet" },
    lymphatic:  { label: "Lymphatic drainage",     pill: "green" },
    nerves:     { label: "Innervation",            pill: "amber" },
    surgical:   { label: "Surgical landmark",      pill: "cyan" }
  };
  const ANAT_NEW_LIMIT = 40;

  /* ---------- isolated SRS store ---------- */
  function srs() { return Store.get("anat_srs", {}); }
  function saveSrs(d) { Store.set("anat_srs", d); }
  function stateOf(id) { const c = srs()[id]; return c ? Object.assign(blankCard(), c) : null; }
  function newToday() { const n = Store.get("anat_newToday", { date: todayStr(), n: 0 }); return n.date === todayStr() ? n.n : 0; }
  function addNewToday(k) { Store.set("anat_newToday", { date: todayStr(), n: newToday() + k }); }

  function dueCards(pool) { const s = srs(), now = Date.now(); return pool.filter(c => s[c.id] && s[c.id].due <= now); }
  function newCards(pool) { const s = srs(); return pool.filter(c => !s[c.id]); }
  function weakCards(pool) { const s = srs(); return pool.filter(c => s[c.id] && (s[c.id].lapses > 0 || s[c.id].st === "rel")); }

  function rate(card, r) {
    const s = srs(); const wasNew = !s[card.id];
    s[card.id] = schedule(stateOf(card.id) || blankCard(), r, Date.now());
    saveSrs(s);
    if (wasNew) addNewToday(1);
    Store.set("anat_revCount", Store.get("anat_revCount", 0) + 1);
    return s[card.id].due <= Date.now() + 15 * 60000; // requeue this session?
  }
  function ivlPreview(card, r) {
    const c = schedule(stateOf(card.id) || blankCard(), r, Date.now());
    const delta = c.due - Date.now();
    if (delta < 55 * 60000) return Math.max(1, Math.round(delta / 60000)) + " min";
    if (delta < 86400000 * 1.4) return "1 d";
    const d = Math.round(delta / 86400000);
    return d < 30 ? d + " d" : (d / 30).toFixed(1) + " mo";
  }

  /* ---------- cloze rendering ---------- */
  // Syntax: {{c1::answer}} or {{c1::answer::hint}}. ALL deletions on a card are
  // hidden on the front and revealed on the back (single occlusion per object).
  const CLOZE = /\{\{c\d+::(.+?)(?:::(.+?))?\}\}/g;
  function clozeFront(t) { return String(t).replace(CLOZE, (_, ans, hint) => `<span class="cloze-blank">[${hint ? esc(hint) : "&hellip;"}]</span>`); }
  function clozeBack(t) { return String(t).replace(CLOZE, (_, ans) => `<span class="cloze-fill">${ans}</span>`); }

  /* ---------- helpers ---------- */
  const $m = () => document.querySelector("#main");
  function regionsIn(cat) { return A.regions.filter(r => r.category === cat); }
  function cardsForRegion(id) { return A.cards.filter(c => c.region === id); }
  function cardsForCategory(cat) { return A.cards.filter(c => c.category === cat); }
  function resolveDiagram(key) {
    if (!key) return "";
    const [ns, name] = String(key).split(".");
    const lib = ns === "DG" ? window.DG : window.ADG;
    return (lib && lib[name]) || "";
  }

  /* ============================== REVIEW HUB ============================== */
  function renderHub() {
    const totalCards = A.cards.length, totalRegions = A.regions.length;
    let html = `<div class="page-head"><div>
      <h1>Anatomy Review</h1>
      <p>A standalone surgical-anatomy reference — structures, blood supply, lymphatics and nerves,
      grouped by region. Completely separate from your 14-day plan.</p></div>
      <a class="btn" href="#/anat-cards">${IC("cards")} Anatomy flashcards</a></div>`;

    html += `<div class="anat-stats card"><div class="stat"><div class="v">${totalRegions}</div><div class="l">Regions</div></div>
      <div class="stat"><div class="v">${totalCards}</div><div class="l">Cloze cards</div></div>
      <div class="stat"><div class="v">${A.categories.length}</div><div class="l">Categories</div></div></div>`;

    A.categories.forEach(cat => {
      const regs = regionsIn(cat.id);
      if (!regs.length) return;
      html += `<section class="anat-cat">
        <div class="anat-cat-head"><h2>${esc(cat.title)}</h2><p class="muted small">${esc(cat.blurb)}</p></div>
        <div class="anat-grid">` +
        regs.map(r => `<a class="anat-region-card" href="#/anatomy/${encodeURIComponent(r.id)}">
            <div class="arc-title">${esc(r.title)}</div>
            <div class="arc-sub muted small">${esc(r.short || "")}</div>
            <div class="arc-foot small">${cardsForRegion(r.id).length} cards ${IC("chevR")}</div>
          </a>`).join("") +
        `</div></section>`;
    });
    if (!totalRegions) html += `<div class="card empty">${IC("book")}<h2>No anatomy content loaded yet</h2><p class="muted">Region files have not been added.</p></div>`;
    $m().innerHTML = html;
  }

  function renderRegion(id) {
    const r = A.regions.find(x => x.id === id);
    if (!r) { location.hash = "#/anatomy"; return; }
    const cat = A.categories.find(c => c.id === r.category);
    const dia = resolveDiagram(r.diagram);
    const cardN = cardsForRegion(r.id).length;
    let html = `<div class="player-top">
        <a class="btn sm secondary" href="#/anatomy">${IC("chevL")} Anatomy</a>
        <span class="small muted">${cat ? esc(cat.title) : ""}</span>
      </div>
      <div class="page-head"><div><h1>${esc(r.title)}</h1>${r.blurb ? `<p>${r.blurb}</p>` : ""}</div></div>`;
    if (dia) html += `<div class="anat-diagram card">${dia}</div>`;
    (r.sections || []).forEach(s => {
      html += `<section class="anat-section card"><h2>${esc(s.heading)}</h2><div class="anat-prose">${s.html}</div></section>`;
    });
    if (r.pearls && r.pearls.length) {
      html += `<div class="kbox pearl"><span class="kbox-tag">Surgical pearls</span><ul>` +
        r.pearls.map(p => `<li>${p}</li>`).join("") + `</ul></div>`;
    }
    html += `<div class="anat-region-foot">
      <button class="btn" data-drill="${esc(r.id)}">${IC("cards")} Drill this region (${cardN} cards)</button>
      <a class="btn secondary" href="#/anatomy">Back to regions</a></div>`;
    $m().innerHTML = html;
    const drill = $m().querySelector("[data-drill]");
    if (drill) drill.onclick = () => startSession({ kind: "region", id: r.id, label: r.title });
  }

  /* ============================ FLASHCARD DECK ============================ */
  function renderCardsMenu() {
    const all = A.cards;
    let html = `<div class="page-head"><div>
        <h1>Anatomy Flashcards</h1>
        <p>True spaced repetition over surgical anatomy — kept in its own deck, entirely separate
        from your 14-day flashcards. Cloze-deletion style: recall the blanked structure.</p></div>
        <a class="btn secondary" href="#/anatomy">${IC("book")} Anatomy review</a></div>`;

    const due = dueCards(all).length, fresh = newCards(all).length, weak = weakCards(all).length;
    html += `<div class="anat-stats card">
      <div class="stat"><div class="v">${all.length}</div><div class="l">Total</div></div>
      <div class="stat"><div class="v">${due}</div><div class="l">Due now</div></div>
      <div class="stat"><div class="v">${fresh}</div><div class="l">New</div></div>
      <div class="stat"><div class="v">${weak}</div><div class="l">Lapsed</div></div></div>`;

    html += `<div class="anat-deck-actions">
      <button class="btn" data-study="all">${IC("zap")} Study all due + new</button>
      ${weak ? `<button class="btn secondary" data-study="weak">${IC("target")} Drill lapsed cards</button>` : ""}
    </div>`;

    html += `<h2 class="anat-h2">By category</h2>`;
    A.categories.forEach(cat => {
      const pool = cardsForCategory(cat.id);
      if (!pool.length) return;
      const cdue = dueCards(pool).length, cnew = newCards(pool).length;
      html += `<button class="anat-deck-row" data-study="cat:${cat.id}">
          <div><div class="adr-title">${esc(cat.title)}</div><div class="muted small">${pool.length} cards</div></div>
          <div class="adr-meta small">${cdue} due · ${cnew} new ${IC("chevR")}</div>
        </button>`;
    });
    $m().innerHTML = html;
    $m().querySelectorAll("[data-study]").forEach(b => b.onclick = () => {
      const v = b.dataset.study;
      if (v === "all") startSession({ kind: "all", label: "All anatomy" });
      else if (v === "weak") startSession({ kind: "weak", label: "Lapsed cards" });
      else if (v.startsWith("cat:")) { const id = v.slice(4); const c = A.categories.find(x => x.id === id); startSession({ kind: "cat", id, label: c ? c.title : id }); }
    });
  }

  /* ---------- session ---------- */
  const S = { queue: [], i: 0, flipped: false, done: 0, again: 0, label: "" };
  function poolFor(f) {
    if (f.kind === "region") return cardsForRegion(f.id);
    if (f.kind === "cat") return cardsForCategory(f.id);
    if (f.kind === "weak") return weakCards(A.cards);
    return A.cards;
  }
  function startSession(f) {
    const pool = poolFor(f);
    const due = shuffle(dueCards(pool));
    const slots = Math.max(0, ANAT_NEW_LIMIT - newToday());
    const fresh = (f.kind === "weak") ? [] : shuffle(newCards(pool)).slice(0, slots);
    let queue = due.concat(fresh);
    if (!queue.length && (f.kind === "region" || f.kind === "cat")) queue = shuffle(pool); // let user browse on demand
    S.queue = queue; S.i = 0; S.flipped = false; S.done = 0; S.again = 0; S.label = f.label;
    if (location.hash !== "#/anat-cards/study") { location.hash = "#/anat-cards/study"; }
    else renderSession();
  }
  function renderSession() {
    if (!S.queue.length) { location.hash = "#/anat-cards"; return; }
    if (S.i >= S.queue.length) {
      $m().innerHTML = `<div class="card center celebrate" style="padding:46px 20px">
        <div class="confetti">🧠</div><h1>Session complete</h1>
        <p class="muted">${S.done} card${S.done === 1 ? "" : "s"} reviewed${S.again ? `, ${S.again} still in learning (back in minutes)` : ""}.</p>
        <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a class="btn" href="#/anat-cards">Anatomy deck</a>
          <a class="btn secondary" href="#/anatomy">Review</a></div></div>`;
      return;
    }
    const c = S.queue[S.i];
    const reg = A.regions.find(r => r.id === c.region);
    const st = SUBTYPES[c.subtype] || { label: c.subtype || "", pill: "cyan" };
    $m().innerHTML = `
      <div class="player-top">
        <a class="btn sm secondary" href="#/anat-cards">${IC("chevL")} Exit</a>
        <div class="bar"><span style="width:${Math.round(100 * S.i / S.queue.length)}%"></span></div>
        <span class="small muted" style="font-variant-numeric:tabular-nums">${S.i + 1}/${S.queue.length}</span>
      </div>
      <div class="fc-count"><span class="pill ${st.pill}">${esc(st.label)}</span><span>${reg ? esc(reg.title) : ""}</span></div>
      <div class="fc-stage">
        <div class="fc-card ${S.flipped ? "flipped" : ""}" id="anat-fc" role="button" tabindex="0" aria-label="Flashcard — press to flip">
          <div class="fc-face"><span class="fc-topic pill cyan">Cloze</span><div class="cloze-text">${clozeFront(c.text)}</div><div class="small muted" style="font-weight:500">tap / space to flip</div></div>
          <div class="fc-face back"><span class="fc-topic pill green">Answer</span><div class="cloze-text">${clozeBack(c.text)}</div></div>
        </div>
      </div>
      ${S.flipped ? `<div class="fc-rate">
        <button class="fc-again" data-q="0">Again<span class="ivl">${ivlPreview(c, 0)}</span></button>
        <button class="fc-hard" data-q="1">Hard<span class="ivl">${ivlPreview(c, 1)}</span></button>
        <button class="fc-good" data-q="2">Good<span class="ivl">${ivlPreview(c, 2)}</span></button>
        <button class="fc-easy" data-q="3">Easy<span class="ivl">${ivlPreview(c, 3)}</span></button>
      </div><p class="small muted center mt">1 · 2 · 3 · 4 also work. Honest grading keeps the scheduler accurate.</p>`
        : `<button class="btn" style="width:100%" id="anat-flip">Show answer</button>`}`;
    const flip = () => { S.flipped = !S.flipped; renderSession(); };
    $m().querySelector("#anat-fc").onclick = flip;
    const fb = $m().querySelector("#anat-flip"); if (fb) fb.onclick = flip;
    $m().querySelectorAll(".fc-rate button").forEach(b => b.onclick = () => rateAdvance(+b.dataset.q));
  }
  function rateAdvance(r) {
    const requeue = rate(S.queue[S.i], r);
    S.done++;
    if (requeue) { S.again++; S.queue.push(S.queue[S.i]); }
    S.i++; S.flipped = false; renderSession();
  }
  document.addEventListener("keydown", e => {
    if (location.hash !== "#/anat-cards/study" || !S.queue.length || S.i >= S.queue.length) return;
    if (e.key === " ") { e.preventDefault(); S.flipped = !S.flipped; renderSession(); }
    if (S.flipped && ["1", "2", "3", "4"].includes(e.key)) rateAdvance(+e.key - 1);
  });

  /* ============================== ROUTER API ============================== */
  window.Anatomy = {
    render(parts) { // #/anatomy , #/anatomy/<regionId>
      if (parts[1]) renderRegion(parts[1]); else renderHub();
    },
    renderCards(parts) { // #/anat-cards , #/anat-cards/study
      if (parts[1] === "study") renderSession(); else renderCardsMenu();
    }
  };

  // Deep-link / refresh onto an anatomy route: app.js ran its initial route()
  // before this script loaded, so re-render now if we're already on one.
  if (/^#\/(anatomy|anat-cards)/.test(location.hash) && typeof route === "function") route();
})();

````

#### `tools/validate-anatomy.js` (copy verbatim)

````javascript
/* Structural validator for the STANDALONE anatomy data.
   Run with: node tools/validate-anatomy.js
   Independent of tools/validate.js — does not touch the 14-day data. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);

const dir = path.join(root, "js/anatomy");
// base must load first; then any region/card data files; engine (anatomy.js) is skipped (DOM code).
const dataFiles = ["anatomy-base.js", "diagrams.js"]
  .concat(fs.readdirSync(dir).filter(f => /^(regions|cards)-.*\.js$/.test(f)).sort());

let errs = [], warns = [];
for (const f of dataFiles) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { warns.push("MISSING FILE: " + f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f }); }
  catch (e) { errs.push("RUNTIME ERROR in " + f + ": " + e.message); }
}

const A = ctx.window.ANATOMY;
const ADG = ctx.window.ADG || {};
const SUBTYPES = ["structures", "arterial", "venous", "lymphatic", "nerves", "surgical"];

if (!A) { console.error("FATAL: window.ANATOMY not defined"); process.exit(1); }

const catIds = new Set(A.categories.map(c => c.id));
const regionIds = new Set();

/* regions */
for (const r of A.regions) {
  if (!r.id || !r.title || !r.category) { errs.push("Bad region: " + (r.id || "?")); continue; }
  if (regionIds.has(r.id)) errs.push("Duplicate region id: " + r.id);
  regionIds.add(r.id);
  if (!catIds.has(r.category)) errs.push("Region " + r.id + " has unknown category: " + r.category);
  if (!Array.isArray(r.sections) || !r.sections.length) warns.push("Region " + r.id + " has no sections");
  if (r.diagram) {
    const [ns, name] = String(r.diagram).split(".");
    const ok = ns === "ADG" ? !!ADG[name] : ns === "DG"; // DG lives in app data, not loaded here
    if (ns === "ADG" && !ok) errs.push("Region " + r.id + " references missing ADG." + name);
    if (ns !== "ADG" && ns !== "DG") errs.push("Region " + r.id + " bad diagram ref: " + r.diagram);
  }
}

/* cards */
const ids = new Set();
const byCat = {}, bySub = {}, byRegion = {};
const cloze = /\{\{c\d+::.+?\}\}/;
for (const c of A.cards) {
  if (!c.id || !c.region || !c.category || !c.subtype || !c.text) { errs.push("Bad card: " + (c.id || "?")); continue; }
  if (ids.has(c.id)) errs.push("Duplicate card id: " + c.id);
  ids.add(c.id);
  if (!catIds.has(c.category)) errs.push("Card " + c.id + " unknown category: " + c.category);
  if (!regionIds.has(c.region)) errs.push("Card " + c.id + " unknown region: " + c.region);
  if (!SUBTYPES.includes(c.subtype)) errs.push("Card " + c.id + " bad subtype: " + c.subtype);
  if (!cloze.test(c.text)) errs.push("Card " + c.id + " has no {{cN::...}} cloze deletion");
  byCat[c.category] = (byCat[c.category] || 0) + 1;
  bySub[c.subtype] = (bySub[c.subtype] || 0) + 1;
  byRegion[c.region] = (byRegion[c.region] || 0) + 1;
}

console.log("Categories:", A.categories.length);
console.log("Regions:", A.regions.length);
console.log("Cards:", A.cards.length);
console.log("By category:", JSON.stringify(byCat));
console.log("By subtype:", JSON.stringify(bySub));
const noCards = [...regionIds].filter(r => !byRegion[r]);
if (noCards.length) warns.push("Regions with 0 cards: " + noCards.join(", "));

if (warns.length) { console.log("\nWARNINGS (" + warns.length + "):"); warns.forEach(w => console.log("  ⚠ " + w)); }
if (errs.length) { console.log("\nERRORS (" + errs.length + "):"); errs.forEach(e => console.log("  ✗ " + e)); process.exitCode = 1; }
else console.log("\n✓ 0 errors");

````

### OPTIONAL MODULE B — Trials (landmark trials + per-trial self-test MCQs)

Include the three files below **plus** author your own `js/trials/trials-*.js` content files per `_SPEC.md`. `trials-base.js` contains the original specialty category list — edit its `categories` array for your topic, keep the `window.TRIALS = { categories:[...], trials:[] }` shape. The engine (`trials.js`), CSS, and validator are content-agnostic — copy them verbatim.

#### `css/trials.css`

````css
/* ============================================================================
   Standalone Trials section — additive styles only. Reuses core design tokens
   (--g1/--g2, --surface, --border, --fg-soft, --r-sm, --shadow) and the
   existing .card/.btn/.pill/.stat/.kbox classes.
   ============================================================================ */

.trials-stats { display: flex; gap: 12px; flex-wrap: wrap; }
.trials-stats .stat { flex: 1; min-width: 110px; }

.trials-cat { margin-top: 26px; }
.trials-cat-head h2 { margin: 0 0 2px; }
.trials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-top: 12px; }

.trial-card {
  display: flex; flex-direction: column; gap: 4px;
  padding: 15px 16px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); box-shadow: var(--shadow); text-decoration: none; color: var(--fg);
  transition: transform .12s, border-color .18s, box-shadow .18s;
}
.trial-card:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
.trial-card.passed { border-color: color-mix(in srgb, var(--accent) 55%, var(--border)); }
.tc-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.trial-name { font-weight: 800; font-family: var(--font-display); }
.tc-check { color: var(--accent); display: inline-flex; }
.tc-check svg { width: 18px; height: 18px; }
.tc-foot { display: flex; align-items: center; gap: 4px; color: var(--fg-soft); font-weight: 600; margin-top: 4px; }
.tc-foot svg { width: 14px; height: 14px; }

/* trial page */
.trial-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
.trial-summary { padding: 4px 18px; }
.trial-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; padding: 13px 0; border-bottom: 1px solid var(--border); }
.trial-row:last-child { border-bottom: none; }
.tr-label { font-weight: 700; color: var(--fg-soft); font-size: .82rem; text-transform: uppercase; letter-spacing: .04em; }
.tr-val { line-height: 1.55; }
@media (max-width: 620px) { .trial-row { grid-template-columns: 1fr; gap: 3px; } }
.trial-cite { margin-top: 14px; font-style: italic; }
.trial-foot { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px; }

/* MCQ runner */
.trial-q { padding: 20px; }
.tq-stem { font-size: 1.08rem; font-weight: 600; line-height: 1.5; margin-bottom: 16px; }
.tq-opts { display: flex; flex-direction: column; gap: 10px; }
.tq-opt {
  display: flex; align-items: flex-start; gap: 10px; width: 100%; text-align: left;
  padding: 13px 15px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); color: var(--fg); font: inherit; cursor: pointer;
  transition: border-color .15s, background .15s, transform .1s;
}
.tq-opt:not([disabled]):hover { border-color: var(--primary); transform: translateY(-1px); }
.tq-key { flex: none; width: 24px; height: 24px; border-radius: 7px; display: grid; place-items: center; font-weight: 800; font-size: .8rem; background: var(--surface-2); color: var(--fg-soft); }
.tq-opt.correct { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
.tq-opt.correct .tq-key { background: var(--accent); color: #fff; }
.tq-opt.wrong { border-color: var(--danger); background: color-mix(in srgb, var(--danger) 12%, transparent); }
.tq-opt.wrong .tq-key { background: var(--danger); color: #fff; }
.tq-opt.dim { opacity: .55; }
.tq-explain { margin-top: 14px; padding: 12px 14px; border-radius: var(--r-sm); line-height: 1.55; border-left: 3px solid var(--primary); background: var(--surface-2); }
.tq-explain.ok { border-left-color: var(--accent); }
.tq-explain.no { border-left-color: var(--danger); }

````

#### `js/trials/trials-base.js` (TEMPLATE — edit the categories list for your topic)

````javascript
/* ============================================================================
   ScalpelSchool — STANDALONE "TRIALS" MODULE (isolated data root)
   Landmark surgical trials with per-trial self-test MCQs. Fully separate from
   the 14-day plan: its own st_trials_* store, no XP/streak/quests, does not
   touch window.QUESTIONS. Loads before trials-<cat>.js (which push into it)
   and before trials.js (which reads it).
   ============================================================================ */
"use strict";

window.TRIALS = {
  /* Hub grouping headers. */
  categories: [
    { id: "general",  title: "General & Trauma / Critical Care", blurb: "Practice-defining trials in acute care, trauma resuscitation, colorectal, hernia and metabolic surgery." },
    { id: "breast",   title: "Breast Surgery",                   blurb: "The trials that built modern breast-conserving and axillary management." },
    { id: "thoracic", title: "Thoracic Surgery",                 blurb: "Lung cancer screening & resection and esophageal/GEJ multimodality trials." }
  ],
  /* Trial objects — pushed by trials-<cat>.js. Schema:
     { id, category, name, full, year, journal, topic,
       question, design, population, intervention, comparator, outcome, bottomLine,
       pearls:[…], citation,
       mcqs:[ { q, options:[…], answer:<0-based index>, explain } ]  // 3–5 each } */
  trials: []
};

````

#### `js/trials/trials.js` (ENGINE — copy verbatim)

````javascript
/* ============================================================================
   ScalpelSchool — STANDALONE "TRIALS" ENGINE
   Renders the Trials hub (#/trials), trial pages (#/trials/<id>) and an inline
   per-trial MCQ runner. Scoring lives in an ISOLATED namespace (st_trials_*).
   Reuses only pure globals from app.js — esc, shuffle, Store, IC, todayStr —
   and never calls addXP / bumpStreak / bumpDaily / checkAchievements, nor
   touches window.QUESTIONS, so the 14-day plan is completely unaffected.
   ============================================================================ */
(function () {
  "use strict";
  if (!window.TRIALS) return; // data missing → inert, host app unaffected

  const T = window.TRIALS;
  const PASS = 0.7;
  const $m = () => document.querySelector("#main");

  /* ---------- isolated store ---------- */
  function scores() { return Store.get("trials_scores", {}); }
  function done() { return Store.get("trials_done", {}); }
  function recordResult(id, correct, total) {
    const s = scores(); const prev = s[id] || { best: 0, total: total };
    s[id] = { best: Math.max(prev.best, correct), total: total, ts: Date.now() };
    Store.set("trials_scores", s);
    if (correct / total >= PASS) { const d = done(); d[id] = Date.now(); Store.set("trials_done", d); }
  }

  /* ---------- helpers ---------- */
  function trialById(id) { return T.trials.find(t => t.id === id); }
  function trialsIn(cat) { return T.trials.filter(t => t.category === cat); }
  function passedCount() { return Object.keys(done()).length; }

  /* ============================== HUB ============================== */
  function renderHub() {
    let html = `<div class="page-head"><div>
      <h1>Landmark Trials</h1>
      <p>The practice-changing trials of general, breast and thoracic surgery — a structured summary of
      each, then a quick self-test. Standalone and separate from your 14-day plan.</p></div></div>`;

    html += `<div class="trials-stats card">
      <div class="stat"><div class="v">${T.trials.length}</div><div class="l">Trials</div></div>
      <div class="stat"><div class="v">${passedCount()}</div><div class="l">Quizzes passed</div></div>
      <div class="stat"><div class="v">${T.categories.length}</div><div class="l">Specialties</div></div></div>`;

    const d = done();
    T.categories.forEach(cat => {
      const list = trialsIn(cat.id);
      if (!list.length) return;
      html += `<section class="trials-cat">
        <div class="trials-cat-head"><h2>${esc(cat.title)}</h2><p class="muted small">${esc(cat.blurb)}</p></div>
        <div class="trials-grid">` +
        list.map(t => `<a class="trial-card${d[t.id] ? " passed" : ""}" href="#/trials/${encodeURIComponent(t.id)}">
            <div class="tc-top"><span class="trial-name">${esc(t.name)}</span>${d[t.id] ? `<span class="tc-check">${IC("check")}</span>` : ""}</div>
            <div class="tc-topic muted small">${esc(t.topic || "")}</div>
            <div class="tc-foot small">${esc(t.journal || "")} ${t.year || ""} · ${(t.mcqs || []).length} MCQs ${IC("chevR")}</div>
          </a>`).join("") +
        `</div></section>`;
    });
    if (!T.trials.length) html += `<div class="card empty">${IC("scope")}<h2>No trials loaded yet</h2><p class="muted">Trial files have not been added.</p></div>`;
    $m().innerHTML = html;
  }

  /* ============================== TRIAL PAGE ============================== */
  function row(label, value) {
    if (!value) return "";
    return `<div class="trial-row"><div class="tr-label">${esc(label)}</div><div class="tr-val">${value}</div></div>`;
  }
  function renderTrial(id) {
    const t = trialById(id);
    if (!t) { location.hash = "#/trials"; return; }
    const cat = T.categories.find(c => c.id === t.category);
    const s = scores()[t.id];
    let html = `<div class="player-top">
        <a class="btn sm secondary" href="#/trials">${IC("chevL")} Trials</a>
        <span class="small muted">${cat ? esc(cat.title) : ""}</span>
      </div>
      <div class="page-head"><div>
        <h1>${esc(t.name)}</h1>
        ${t.full ? `<p>${esc(t.full)}</p>` : ""}
        <div class="trial-meta">${t.topic ? `<span class="pill cyan">${esc(t.topic)}</span>` : ""}
          <span class="small muted">${esc(t.journal || "")} ${t.year || ""}</span>
          ${s ? `<span class="pill green">Best ${s.best}/${s.total}</span>` : ""}</div>
      </div></div>`;

    html += `<section class="card trial-summary">
      ${row("Clinical question", esc(t.question))}
      ${row("Design", esc(t.design))}
      ${row("Population", esc(t.population))}
      ${row("Intervention", esc(t.intervention))}
      ${row("Comparator", esc(t.comparator))}
      ${row("Key result", esc(t.outcome))}
    </section>`;

    if (t.bottomLine) html += `<div class="kbox pearl"><span class="kbox-tag">Bottom line</span>${esc(t.bottomLine)}</div>`;
    if (t.pearls && t.pearls.length) html += `<div class="kbox mnemonic"><span class="kbox-tag">Exam pearls</span><ul>${t.pearls.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>`;
    if (t.citation) html += `<p class="trial-cite small muted">${esc(t.citation)}</p>`;

    const n = (t.mcqs || []).length;
    html += `<div class="trial-foot">
      <button class="btn" id="trial-quiz-start"${n ? "" : " disabled"}>${IC("target")} Test yourself${n ? ` (${n})` : ""}</button>
      <a class="btn secondary" href="#/trials">Back to trials</a></div>`;
    $m().innerHTML = html;
    const sb = $m().querySelector("#trial-quiz-start");
    if (sb && n) sb.onclick = () => startQuiz(t);
  }

  /* ============================== MCQ RUNNER ============================== */
  const Q = { trial: null, i: 0, correct: 0, answered: null };
  function startQuiz(t) { Q.trial = t; Q.i = 0; Q.correct = 0; Q.answered = null; renderQuiz(); }
  function renderQuiz() {
    const t = Q.trial, qs = t.mcqs;
    if (Q.i >= qs.length) {
      recordResult(t.id, Q.correct, qs.length);
      const pct = Math.round(100 * Q.correct / qs.length), pass = Q.correct / qs.length >= PASS;
      $m().innerHTML = `<div class="card center celebrate" style="padding:42px 20px">
        <div class="confetti">${pass ? "🏆" : "📊"}</div>
        <h1>${Q.correct} / ${qs.length} correct</h1>
        <p class="muted">${pass ? "Passed — you know this trial." : "Review the summary and try again."} (${pct}%)</p>
        <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn" id="trial-retry">${IC("refresh")} Retry</button>
          <a class="btn secondary" href="#/trials/${encodeURIComponent(t.id)}">Review trial</a>
          <a class="btn secondary" href="#/trials">All trials</a></div></div>`;
      const rb = $m().querySelector("#trial-retry"); if (rb) rb.onclick = () => startQuiz(t);
      return;
    }
    const q = qs[Q.i], picked = Q.answered;
    $m().innerHTML = `
      <div class="player-top">
        <a class="btn sm secondary" href="#/trials/${encodeURIComponent(t.id)}">${IC("chevL")} Exit</a>
        <div class="bar"><span style="width:${Math.round(100 * Q.i / qs.length)}%"></span></div>
        <span class="small muted" style="font-variant-numeric:tabular-nums">${Q.i + 1}/${qs.length}</span>
      </div>
      <p class="muted small" style="margin:0 0 6px"><b>${esc(t.name)}</b> · self-test</p>
      <div class="card trial-q"><div class="tq-stem">${esc(q.q)}</div>
        <div class="tq-opts">${q.options.map((o, k) => {
          let cls = "tq-opt";
          if (picked !== null) { if (k === q.answer) cls += " correct"; else if (k === picked) cls += " wrong"; else cls += " dim"; }
          return `<button class="${cls}" data-opt="${k}"${picked !== null ? " disabled" : ""}><span class="tq-key">${String.fromCharCode(65 + k)}</span>${esc(o)}</button>`;
        }).join("")}</div>
        ${picked !== null ? `<div class="tq-explain ${picked === q.answer ? "ok" : "no"}"><b>${picked === q.answer ? "Correct." : "Not quite."}</b> ${esc(q.explain || "")}</div>` : ""}
      </div>
      ${picked !== null ? `<div class="trial-foot"><button class="btn" id="tq-next">${Q.i === qs.length - 1 ? "See score" : "Next question"} ${IC("chevR")}</button></div>` : ""}`;
    if (picked === null) {
      $m().querySelectorAll(".tq-opt").forEach(b => b.onclick = () => {
        Q.answered = +b.dataset.opt;
        if (Q.answered === q.answer) Q.correct++;
        renderQuiz();
      });
    } else {
      const nx = $m().querySelector("#tq-next");
      if (nx) nx.onclick = () => { Q.i++; Q.answered = null; renderQuiz(); };
    }
  }

  /* ============================== ROUTER API ============================== */
  window.Trials = {
    render(parts) { if (parts[1]) renderTrial(parts[1]); else renderHub(); }
  };

  // Deep-link / refresh onto a trials route: app.js ran its initial route()
  // before this script loaded, so re-render now if we're already on one.
  if (/^#\/trials/.test(location.hash) && typeof route === "function") route();
})();

````

#### `tools/validate-trials.js` (copy verbatim)

````javascript
/* Structural validator for the STANDALONE Trials data.
   Run with: node tools/validate-trials.js
   Independent of tools/validate.js — does not touch the 14-day data. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);

const dir = path.join(root, "js/trials");
const dataFiles = ["trials-base.js"]
  .concat(fs.readdirSync(dir).filter(f => /^trials-(?!base).*\.js$/.test(f)).sort());

let errs = [], warns = [];
for (const f of dataFiles) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { warns.push("MISSING FILE: " + f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f }); }
  catch (e) { errs.push("RUNTIME ERROR in " + f + ": " + e.message); }
}

const T = ctx.window.TRIALS;
if (!T) { console.error("FATAL: window.TRIALS not defined"); process.exit(1); }

const catIds = new Set(T.categories.map(c => c.id));
const ids = new Set();
const byCat = {};
const req = ["id", "category", "name", "year", "journal", "topic", "question", "design", "outcome", "bottomLine", "citation"];

for (const t of T.trials) {
  const tag = t.id || t.name || "?";
  for (const k of req) if (!t[k]) errs.push("Trial " + tag + " missing field: " + k);
  if (t.id && ids.has(t.id)) errs.push("Duplicate trial id: " + t.id);
  if (t.id) ids.add(t.id);
  if (t.category && !catIds.has(t.category)) errs.push("Trial " + tag + " unknown category: " + t.category);
  if (!Array.isArray(t.mcqs) || t.mcqs.length < 3 || t.mcqs.length > 5)
    errs.push("Trial " + tag + " must have 3-5 mcqs (has " + (t.mcqs ? t.mcqs.length : 0) + ")");
  (t.mcqs || []).forEach((m, i) => {
    const mt = tag + " mcq#" + (i + 1);
    if (!m.q) errs.push(mt + " missing q");
    if (!Array.isArray(m.options) || m.options.length < 3) errs.push(mt + " needs >=3 options");
    if (typeof m.answer !== "number" || !m.options || m.answer < 0 || m.answer >= m.options.length)
      errs.push(mt + " answer index out of range");
    if (!m.explain) warns.push(mt + " has no explain");
  });
  if (t.category) byCat[t.category] = (byCat[t.category] || 0) + 1;
}

console.log("Categories:", T.categories.length);
console.log("Trials:", T.trials.length);
console.log("By category:", JSON.stringify(byCat));
console.log("Total MCQs:", T.trials.reduce((a, t) => a + (t.mcqs ? t.mcqs.length : 0), 0));

if (warns.length) { console.log("\nWARNINGS (" + warns.length + "):"); warns.forEach(w => console.log("  ⚠ " + w)); }
if (errs.length) { console.log("\nERRORS (" + errs.length + "):"); errs.forEach(e => console.log("  ✗ " + e)); process.exitCode = 1; }
else console.log("\n✓ 0 errors");

````


---

## PART 21 — MINIMAL VALIDATING CONTENT SKELETON (start here, then expand)

After recreating the engine (Part 20), create these minimal content files so `node tools/validate.js` passes immediately. Then grow each one to the target volumes in Part 17. All schemas are in Part 5; the rules in Part 18 are mandatory.

### The data `<script>` block for a fresh `index.html`
Replace the original surgery data-`<script>` tags (the block between the brand comment and `app.js`) with one tag per content file you create, in THIS order:

````html
<script src="js/data/curriculum.js"></script>
<script src="js/data/diagrams.js"></script>
<script src="js/data/lessons-1.js"></script>   <!-- add as many lessons-*.js as you need -->
<script src="js/data/flashcards.js"></script>   <!-- FIRST flashcards file uses = [...] -->
<script src="js/data/flashcards2.js"></script>  <!-- later ones push/concat -->
<script src="js/data/questions.js"></script>    <!-- FIRST questions file uses = [...] -->
<script src="js/data/questions2.js"></script>   <!-- later ones push/concat -->
<script src="js/data/exercises.js"></script>
<script src="js/app.js"></script>
````
Also update the `files` array in `tools/validate.js` to list exactly the data files you created (same names).

### `js/data/curriculum.js` — exactly 14 entries (edit themes/taglines for your topic)

````javascript
/* N-day spiral curriculum (must have exactly 14 entries; day 14 = exam day, no lessons) */
window.CURRICULUM = [
  { day: 1,  theme: "Topic Day 1 Title",  tagline: "One-sentence hook for day 1." },
  { day: 2,  theme: "Topic Day 2 Title",  tagline: "One-sentence hook for day 2." },
  { day: 3,  theme: "Topic Day 3 Title",  tagline: "..." },
  { day: 4,  theme: "Topic Day 4 Title",  tagline: "..." },
  { day: 5,  theme: "Topic Day 5 Title",  tagline: "..." },
  { day: 6,  theme: "Topic Day 6 Title",  tagline: "..." },
  { day: 7,  theme: "Topic Day 7 Title",  tagline: "..." },
  { day: 8,  theme: "Topic Day 8 Title",  tagline: "..." },
  { day: 9,  theme: "Topic Day 9 Title",  tagline: "..." },
  { day: 10, theme: "Topic Day 10 Title", tagline: "..." },
  { day: 11, theme: "Topic Day 11 Title", tagline: "..." },
  { day: 12, theme: "Topic Day 12 Title", tagline: "..." },
  { day: 13, theme: "Topic Day 13 Title", tagline: "..." },
  { day: 14, theme: "Exam Day Simulation", tagline: "Mock exam, weakness drilling, final-pass flashcards." }
];
````

### `js/data/diagrams.js` — must exist; `window.DG = {}` is the contract
If you have no anatomy/figures, this one line is enough. Add themable SVGs only for `label` exercises (each clickable region needs `data-zone="..."`; use `var(--fg)`, `var(--primary)` etc. so they recolor in dark mode).

````javascript
window.DG = {};
/* Example themable, clickable SVG (only needed for click-the-anatomy exercises):
window.DG.example = `
<svg viewBox="0 0 200 120" role="img" aria-label="Example diagram">
  <rect data-zone="part-a" x="10" y="10" width="80" height="80" rx="8"
        fill="rgba(8,145,178,.25)" stroke="var(--primary)" stroke-width="2"/>
  <text x="50" y="55" text-anchor="middle" fill="var(--fg)" font-size="11">Part A</text>
</svg>`;
*/
````

### `js/data/lessons-1.js` — minimal lesson (grow to ~38 lessons across days 1-13)

````javascript
window.LESSONS = window.LESSONS || {};   /* EVERY lessons file must start with this line */

window.LESSONS["d1-intro"] = {
  id: "d1-intro", day: 1, ord: 1, title: "Lesson Title", short: "Short", minutes: 20,
  chunks: [
    { title: "Mechanism first", html: `
      <p>Lead every teaching chunk with one or two narrative paragraphs explaining the WHY/HOW before any list, table, or kbox. Keep each teaching chunk under 350 words. Write real HTML — never markdown, never a backtick or a dollar-brace inside the content.</p>
      <ul><li>Then add lists,</li><li>tables,</li><li>or highlight boxes as needed.</li></ul>
      <div class="kbox pearl"><div class="kbox-tag">Exam pearl</div>High-yield fact goes here.</div>` },
    { type: "checkpoint", q: "A knowledge-check question answered from memory?",
      options: ["Wrong A", "Correct B", "Wrong C", "Wrong D"], answer: 1,
      explain: "Why B is right and the others are not." }
    /* ...grow to 12-21 chunks; a checkpoint every 2-4 chunks... */
  ]
};
````

### `js/data/flashcards.js` — FIRST flashcards file uses `= [...]`

````javascript
window.FLASHCARDS = [
  { id: "f-d1-01", day: 1, lesson: "d1-intro", topic: "TopicName",
    front: "Question shown on the card front (HTML allowed)?",
    back: "<b>Answer</b><br>Supporting detail. Real HTML, no markdown, no backticks/dollar-brace." }
  /* ...grow to ~300 cards; unique ids; `day` = the curriculum day it unlocks on... */
];
/* A SECOND file (flashcards2.js) must NOT redefine the array — it concatenates:
   window.FLASHCARDS = window.FLASHCARDS.concat([ {…}, {…} ]); */
````

### `js/data/questions.js` — FIRST questions file uses `= [...]`

````javascript
window.QUESTIONS = [
  { id: "q-d1-01", day: 1, topic: "TopicName",
    stem: "A single-best-answer clinical vignette ending in a question?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 2,
    explain: "Why C is correct, and ideally why a key distractor is wrong." }
  /* ...grow to ~235 questions across days/topics; 3-5 options; 0-based answer... */
];
/* A SECOND file (questions2.js) concatenates:
   window.QUESTIONS = window.QUESTIONS.concat([ {…} ]); */
````

### `js/data/exercises.js` — both interactive types (optional; can start empty)

````javascript
window.EXERCISES = [
  /* "order" = sequence builder (>=4 steps in the CORRECT order) */
  { id: "ex-seq-1", day: 2, type: "order", title: "Put the steps in order", short: "Sequence",
    intro: "Build the sequence correctly.",
    steps: [ "First step", "Second step", "Third step", "Fourth step" ] },

  /* "label" = click-the-anatomy; every target.zone MUST exist as data-zone in the svg */
  { id: "ex-label-1", day: 4, type: "label", title: "Click the structure", short: "Label",
    caption: "Optional caption.",
    svg: window.DG.example,   /* requires the example SVG to be defined in diagrams.js */
    targets: [ { zone: "part-a", label: "Part A", hint: "the cyan box" } ] }
];
/* To start with NO exercises, use: window.EXERCISES = []; */
````

Once these parse, run `node tools/validate.js` (expect 0 errors), open `index.html`, smoke-test every screen, then expand content to the Part 17 targets — re-running the validator after each batch.
