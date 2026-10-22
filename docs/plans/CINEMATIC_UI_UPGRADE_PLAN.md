# CardiacSchool — Clinical-Cinematic UI/UX Upgrade (Red Atmosphere Edition)

**Status:** planning · not started · awaiting confirmation
**Scope:** `site/` visual + shell + study-workflow layer only. No content, SRS math, scoring, gating, XP, or curriculum changes.
**Platform:** DESKTOP-ONLY. Mobile (`#bottom-nav`, sub-1024px layouts) is explicitly out of scope for this pass — do not spend effort there, do not let mobile regressions block a desktop win. Keep mobile *functional* (don't break it) but do not design for it.

---

## 0. Principles & hard constraints

1. **Evolve, don't replace.** Base palette stays the dark cyan/teal/violet clinical-workstation look (`--primary:#0E7490`, dark `--primary:#22D3EE`). The only new hue introduced is the **arterial-red performance atmosphere**, kept in its own token namespace so it never collides with `--danger`.
2. **Red = mastery/aliveness, not alarm.** The performance atmosphere is a single red-warmth dial. Strong sustained performance makes the workstation glow arterial red ("the field comes alive"). Weak performance lets it recede to a cold, dark, dormant base. **No blue is introduced anywhere.** Cobalt/venous-blue from the earlier draft is dropped entirely.
3. **Direct feedback stays conventional.** Green = correct, `--danger` red = incorrect, per answer. The red *atmosphere* is a slow background layer only and must never be mistakable for per-answer correctness. It is de-saturated, low-alpha, radial, and multi-second-damped.
4. **Zero-build, offline, `cs_` store.** No bundler, no new network dependency, no new fonts/icons. New JS files are plain `<script>` tags added to `index.html`. New storage keys use the `cs_` prefix.
5. **Validator baseline is frozen.** The pre-existing 40 lesson-grounding failures and 45 new-card-quality failures are content debt outside this pass. This pass must introduce **zero** new validator failures (it touches shell/CSS/JS only, so content validators should be untouched — verify anyway).
6. **No correctness inference.** Every performance signal comes from an explicit hook in a grading handler. Never infer correctness from XP, streaks, or storage writes.

---

## 1. Performance Climate Engine (red-only)

A single global controller that turns graded outcomes into a slow, red-warmth background atmosphere plus a text momentum indicator.

### 1.1 Public API — `js/climate/performance-climate.js` (new file)

```
window.PerformanceClimate = {
  record({ kind, result, src }),   // one graded micro-outcome (card grade, single MCQ, viva item)
  recordBlock({ correct, total, src }), // one aggregate outcome (exam, trials set, surgery quiz, crisis, lab, case)
  snapshot(),        // { balance, intensity, tone, evidenceCount, label, enabled }
  setEnabled(bool),  // user toggle; persists; when false, layers fade to 0 and updates stop mutating visuals
  suspend(),         // freeze updates + freeze rendered vars (exam in progress)
  resume(),          // unfreeze
  undoLast(),        // pop the most recent event (flashcard undo integration)
  reset()            // wipe history to neutral
}
```

Load order in `index.html`: **before `js/app.js`** and before any module that will call it, i.e. immediately after `js/lib/spring.js`. It has no dependencies except `Store` (define a tiny local get/set fallback so it is import-order-safe).

### 1.2 Persisted state — key `cs_performanceClimateV1`

```
{
  v: 1,
  enabled: true,
  lastActive: <epoch ms>,
  events: [ { t:<ms>, w:<number in [-1,1]>, src:<string> }, ... ]  // newest last, max 50
}
```

- On every `record`/`recordBlock`: push, then trim to the newest 50, set `lastActive = now`, persist, recompute, emit event, re-render CSS vars.
- **Corruption recovery:** parse inside try/catch; if shape invalid (not object, `v` missing, `events` not an array), `reset()` to a fresh neutral object. Never throw into a caller.
- **Multi-tab sync:** `window.addEventListener('storage', …)` on key `cs_performanceClimateV1` → reload state, recompute, re-render. Writes are last-write-wins; acceptable for an ambient signal.

### 1.3 Per-event signal weight `w ∈ [-1, +1]`

| Source | Mapping |
|---|---|
| MCQ (`recordAnswer`) | correct `+1`, incorrect `−1` |
| Flashcard (`rateCard`) | Again `−1`, Hard `−0.35`, Good `+0.65`, Easy `+1` |
| Viva item | nailed `+1`, shaky `0`, missed `−1` → **one** event per case, `w = mean(item weights)` |
| Any block (`recordBlock`) | `w = 2·(correct/total) − 1` → **one** event |

Blocks (exam, trials set, surgery quiz, surgery order-game, op sign-off, crisis run, physiology lab, daily case) submit **exactly one** event so a multi-question activity cannot spray the atmosphere or leak per-answer correctness.

### 1.4 Recency-weighted balance (the trend)

Index events newest→oldest, `i = 0` newest. Decay `k_i = 0.5^(i / HALF)`, `HALF = 30` (influence halves after ~30 newer outcomes).

```
balance      = Σ(k_i · w_i) / Σ(k_i)          // ∈ [-1, +1]
effectiveN   = Σ(k_i)                          // recency-weighted evidence count
```

### 1.5 Intensity gate (why one answer can't flip it)

```
confidence = clamp((effectiveN − 5) / 15, 0, 1)   // neutral until 5 effective outcomes, full by ~20
daysIdle   = (now − lastActive) / 86400000
freshness  = clamp(1 − max(0, daysIdle − 7) / 7, 0, 1)  // full ≤7 idle days, fades to 0 by day 14
intensity  = confidence · freshness               // ∈ [0,1]
```

Three independent dampers guarantee "one answer never flips the atmosphere": (a) balance is a recency-weighted mean over up to 50 events, so a single new `w` moves it by at most `k_0/Σk`, tiny once `effectiveN>10`; (b) `intensity` ramps in only over the first ~20 outcomes; (c) the CSS layers transition over multiple seconds (§1.7).

### 1.6 Red-only tone mapping (emitted as CSS custom properties on `:root`)

```
warm = clamp(balance, 0, 1) · intensity     // arterial-red glow strength
dim  = clamp(-balance, 0, 1) · intensity     // dormancy: darken/desaturate, NO hue
```

Set on `document.documentElement.style`:
- `--climate-red`  = `warm`   (0..1)
- `--climate-dim`  = `dim`    (0..1)

`tone = balance >= 0 ? 'warm' : 'dormant'`. There is deliberately no blue branch — negative balance only *removes* red and cools toward the existing dark base.

### 1.7 Rendering — CSS layers (in `css/style.css`, behind `#app-shell`)

Two fixed, `pointer-events:none`, non-interactive layers under all content (below the existing decorative blob background at `style.css:78-80`, above `--bg`):

```css
.climate-layer{position:fixed;inset:0;z-index:0;pointer-events:none;transition:opacity 2.4s ease}
.climate-red{
  background:
    radial-gradient(70% 55% at 82% -8%, color-mix(in srgb, #E23A2E 60%, transparent), transparent 60%),
    radial-gradient(60% 50% at 12% 108%, color-mix(in srgb, #C21F16 55%, transparent), transparent 62%);
  mix-blend-mode:screen;                 /* additive arterial glow on dark bg */
  opacity:calc(var(--climate-red, 0) * .22);   /* MAX 0.22 — subtle */
}
.climate-dim{
  background:radial-gradient(120% 120% at 50% 50%, transparent, #04070C 90%);
  opacity:calc(var(--climate-dim, 0) * .14);
}
```

- App content (`#app-shell`) sits at `z-index:1+`. Verify existing stacking still wins.
- Respect `prefers-reduced-motion`: drop the 2.4s transition to an instant set (still fine — the *value* changes slowly anyway).
- Respect `prefers-reduced-transparency` / forced-colors / the user's "performance atmosphere OFF" toggle: layers set `opacity:0 !important` and updates stop touching visuals.
- When `enabled === false` or during `suspend()`, freeze `--climate-red`/`--climate-dim` at their current values (suspend) or 0 (disabled).

### 1.8 Momentum text indicator

A compact chip (in the sidebar foot near `#theme-toggle`, and echoed on the Progress page). Label from `snapshot()`:

- `intensity === 0` → "Momentum: gathering signal" (neutral, no color)
- `balance ≥ +0.33` → "Momentum: warming" (strong)
- `−0.33 < balance < +0.33` → "Momentum: balanced"
- `balance ≤ −0.33` → "Momentum: cooling" (dormant)

Includes an info affordance ("Reflects your recent graded work across the app; slow by design") and a disable toggle wired to `setEnabled(false)` (also mirrored in the Settings panel, item 15).

### 1.9 Event contract

`document.dispatchEvent(new CustomEvent('cs:climatechange', { detail: { balance, intensity, tone, evidenceCount } }))` after every recompute. The shell (momentum chip) and Progress page subscribe. No other module reads climate internals.

### 1.10 Exam / block leak protection

- `viewExamIntro` "Begin exam" / "Resume" (`app.js:1373`) → `PerformanceClimate.suspend()`.
- Exam submit/grade (~`app.js:1380+`, the finish path) → `PerformanceClimate.resume()` then one `recordBlock({correct, total, src:'exam'})`.
- Because suspend freezes the rendered vars, the background cannot drift while a cumulative exam is in progress, and it receives exactly one aggregate update afterward.

### 1.11 Flashcard undo (the one deliberate SRS touch)

Before `rateCard(card, r)` writes (`app.js:309`), snapshot `{ prevCardState: getCardState(card.id), climateLen: events.length }`. `undoLast()`:
1. `PerformanceClimate.undoLast()` pops the last climate event (guarded to the snapshot length).
2. Restore the prior SRS card state for that card id.
3. Re-render the cockpit counts.

This is the single place item 9 crosses into SRS state; handle it explicitly and reversibly. No scheduler math changes — it only restores a prior snapshot.

### 1.12 Result-hook wiring table (exact insertion points)

| # | File:line | Function | Call to add |
|---|---|---|---|
| 1 | `js/app.js:309` | `rateCard(card, r)` | `PerformanceClimate.record({kind:'card', result:r, src:'card'})` (after schedule write) + undo snapshot before |
| 2 | `js/app.js:365` | `recordAnswer(qid, ok)` | `PerformanceClimate.record({kind:'mcq', result:ok, src:'mcq'})` |
| 3 | `js/app.js:1373` / submit | exam begin / finish | `suspend()` on begin; `resume()` + `recordBlock({...,src:'exam'})` on submit |
| 4 | `js/app.js:1627` | `recordViva(caseId, grades)` | one `record`/`recordBlock` from mean of nailed/shaky/missed, `src:'viva'` |
| 5 | `js/trials/trials.js:20` | `recordResult(id, correct, total)` | `recordBlock({correct, total, src:'trials'})` |
| 6 | `js/surgery/surgery.js:45` | `recordQuiz(scope, correct, total)` | `recordBlock({correct, total, src:'surgery'})` |
| 7 | `js/surgery/surgery.js:54` | `recordOrder(id, correct, total, …)` | `recordBlock({correct, total, src:'surgery-order'})` |
| 8 | `js/advanced/advanced.js:91` | op sign-off finish (`opCheck.score`/3) | `recordBlock({correct:opCheck.score, total:3, src:'op-check'})` |
| 9 | `js/advanced/advanced.js:315` | crisis finish (`crisisState.good`/`faced`) | `recordBlock({correct:good, total:faced, src:'crisis'})` |
| 10 | `js/physiology/lab-core.js:120` | `complete(id, score, total)` | `recordBlock({correct:score, total, src:'physiology'})` |
| 11 | `js/daily/daily.js:158` | case finish (`caseState.score`/decisions) | `recordBlock({correct:score, total:decisions.length, src:'case'})` |

Guard every call site with `if (window.PerformanceClimate)` so module isolation is preserved (any module remains removable without breaking).

---

## 2. Semantic design-token system

Layer named roles on top of the current palette in `css/style.css` (light `:root` @5, dark override @~50). **Reuse existing values; do not invent new hues except climate.**

| Token | Value source | Role |
|---|---|---|
| `--action` / `--on-action` | existing `--btn-g1`/`--btn-g2`, `--on-primary` | primary filled controls |
| `--route-surgery` | `#e76f51` (already `style.css:41`) | Surgeries identity |
| `--route-anatomy` | `#2a9d8f` | Anatomy identity |
| `--route-evidence` | `#8b5cf6` | Trials/Evidence identity |
| `--route-case` | `#d97706` | Daily case identity |
| `--route-viva` | `#0891b2` | Viva identity |
| `--route-physiology` | existing physiology accent | Physiology identity |
| `--completion` | `--ok` | done/mastered states |
| `--warning` | `--warn` / `--danger` | clinical warning callouts |
| `--climate-red`, `--climate-dim` | runtime (item 1) | performance atmosphere ONLY |

Deliverable: a single `Gradient roles` comment block replacing scattered ad-hoc `linear-gradient(...)` decorations with `var(--...)` references. Audit `grep -n "gradient" css/*.css` and reclass each into: action / route-identity / atmosphere / completion / warning. No visual change intended beyond consistency.

---

## 3. The fifteen upgrades (desktop-only)

### 3.1 Cumulative performance atmosphere
Item 1, above. Fixed red radial layers + momentum chip. Ships behind Phase-3 flag.

### 3.2 Disciplined gradient system
Item 2, above. Semantic roles; kill decorative one-offs.

### 3.3 Unified page hierarchy
Standardize the three header archetypes so Surgeries / Trials / Anatomy / Physiology / Questions / connected-day pages share type scale, spacing, stat row, and action placement. Extract a `pageHead({title, sub, stats, actions, accent})` helper (there's already a `.page-head` class at `app.js:891`; generalize it and route the module hubs through it). Route accent driven by `--route-*`.

### 3.4 Grouped navigation
Rework `NAV` (`app.js:451`) and `renderNav()` (`app.js:460`) from a flat 7-item list into 4 labeled groups, **preserving every route**:
- **Learn:** Today (`#/`), 14-Day Plan (`#/plan`), Anatomy (`#/anatomy`)
- **Practice:** Flashcards (`#/cards`), Question Bank (`#/quiz`), Interactive (`#/exercises`)
- **Simulate:** Surgeries (`#/surgery`), Physiology Labs (`#/physiology`), Crisis Rooms (`#/crisis`), Viva (`#/viva`), Trials (`#/trials`)
- **Track:** Progress (`#/progress`), Awards (`#/awards`)

Retire the `#/extras` catch-all screen (`viewExtras`, `app.js:534`) — its cards migrate into the groups. Keep the `#/extras` route as a redirect to `#/` for any stale deep link. **Remove the duplicated Trials destination** (Trials currently appears in both `EXTRA_ROUTE_PREFIXES` @459 and `viewExtras` @540 — collapse to one nav entry; verify no deep link depends on the removed copy). Update `EXTRA_ROUTE_PREFIXES` active-state logic to the new group model. (Mobile `#bottom-nav` subset @476 stays as-is — leave functional, don't redesign.)

### 3.5 Global command palette
`Cmd/Ctrl+K` overlay searching lessons, operations, anatomy regions, trials, labs, simulations, and major pages, with arrow-key nav + recent destinations (stored `cs_recentDest`).
- **Prerequisite (own task):** build a **search registry** `js/climate/../search-index.js` (or `js/search-index.js`) that assembles `{label, sub, hash, group}[]` from `window.LESSONS`, `window.ADVANCED.operations/labs/crises`, anatomy regions, `window.TRIALS`, and the static route list. No new data — it reads existing globals at load.
- New file + `<script>` tag; overlay is a single appended DOM node, focus-trapped, `Esc` closes, restores focus. Reduced-motion friendly.

### 3.6 Next-best-action dashboard
In the Today view (`viewHome`/`taskRow` area, `app.js:~600-680`), promote ONE primary action by priority: due cards → resumable work (exam draft, in-progress lesson) → incomplete current-day lesson → incomplete core station → current-day questions → weakness drill. Demote the long mission list into a secondary "Everything for today" expandable (`<details>`). No change to what tasks exist — only ordering + one hero CTA.

### 3.7 Cleaner 14-day timeline
In the plan view (`app.js:~700-730`, the chip wall @711-718): collapse non-current days to compact progress rows (lesson% + connected-station%), auto-expand the current day, keep the card include/exclude toggle (@728), drop the chip wall for non-current days.

### 3.8 Assessment focus mode
During flashcards / quiz / viva / cases / exams, collapse the sidebar to an icon rail (desktop). Keep Exit, progress, question position, and primary controls sticky/visible. Toggle a `body.focus-mode` class on entering those routes in the router; CSS narrows `#sidebar`. No route changes.

### 3.9 Flashcard cockpit
Enhance `viewCards` (`app.js:884`) + `rateAndAdvance` (`app.js:1073`): show due / new / relearning counts, session accuracy distribution, shortcut legend (already hinted @947), clearer rating-button hierarchy, estimated time remaining, and **one-step undo** (item 1.11). No scheduler math change beyond snapshot-restore undo.

### 3.10 Question-block builder
Before starting a set, let learner pick domain, day, difficulty, status (unanswered/missed/flagged), block length, and tutor-vs-exam feedback. Build on the existing quiz menu (`viewQuizMenu`, `app.js:1122`) and `question-bank.js` selection. Reads existing `qStats()` (@363) for status filters. No new question data.

### 3.11 Source-linked remediation
After an incorrect MCQ, render: the misconception, a link to the source lesson/operation anchor (lessons carry a mandatory `lesson` field; anchors are chunk-title slugs), relevant cards (`#/cards/source/lesson/<id>`), and a "retry later" action that flags the qid into the existing weakness pool. Extend the answer-feedback block in the quiz renderer.

### 3.12 Long-form reader tools
In lesson view (`viewLesson`, `app.js:~753-822`): sticky section outline from chunk titles, readable-width mode, chunk progress, exact-position resume (`cs_lessonPos`), bookmarks (`cs_bookmarks`), and visually consistent Numbers / Evidence / Danger / Surgical-Pearl callouts (map to `--route-*`/`--warning`/`--completion`). No content edits — presentation only.

### 3.13 Actionable progress view
`viewProgress` (`#/progress`): lead with the three weakest domains, recent trend (from `PerformanceClimate.snapshot()` + `qStats()`), the evidence behind each score, and direct drill links (`#/quiz/weak`, domain sets). Keep language educational (no competence/credential claims). Echo the momentum chip here.

### 3.14 Clinical media viewer
Make anatomy / angiography / evidence images expandable: lightbox with zoom, pan, caption, source, keyboard controls (arrows, +/−, Esc), on a consistent light image surface inside dark mode. One shared component (`js/media/lightbox.js`) wired into the existing figure/atlas renderers (`js/media/figures.js`, angiography). Uses existing images only.

### 3.15 State & accessibility overhaul + Settings
Standardize locked / empty / completion / offline / update-ready states, each with a clear next action. Add a **Settings** panel (new `#/settings` route or sidebar-foot popover) exposing: theme, **performance atmosphere on/off + intensity cap**, text size, reading width, motion. Retain/verify reduced-transparency, forced-colors, contrast, keyboard support. Wire the atmosphere toggle to `PerformanceClimate.setEnabled`.

---

## 4. Implementation sequence

**Phase 0 — Foundation (safe, no behavior change)**
1. Semantic tokens + gradient audit (item 2).
2. `pageHead()` helper + unified headers (item 3).
3. Grouped nav + retire `#/extras` screen + de-dupe Trials (item 4).
4. Settings scaffold + state/a11y baseline (item 15, minus atmosphere toggle which needs Phase 3).

**Phase 1 — Study-workflow wins (each independently shippable)**
5. Next-best-action dashboard (item 6) + collapsed timeline (item 7).
6. Focus mode (item 8) + flashcard cockpit sans-undo (item 9).
7. Question-block builder (item 10) + source-linked remediation (item 11).
8. Reader tools (item 12) + clinical media viewer (item 14).

**Phase 2 — Infra**
9. Search registry (prerequisite) → command palette (item 5).
10. Actionable progress view (item 13) using real graded history.

**Phase 3 — Red atmosphere (flagged, default-OFF first ship)**
11. `performance-climate.js` engine + persistence + events (item 1 core).
12. Wire the 11 result hooks (§1.12), each guarded by `if (window.PerformanceClimate)`.
13. Red CSS layers + momentum chip + Settings atmosphere toggle + undo integration (items 1.7–1.11, 9-undo, 15-toggle).

**Phase 4 — Ship**
14. Bump SW cache `cardiac-school-v43-day13-deep-sourced` → `v44-cinematic-ui` (`sw.js:1`); bump each touched CSS/JS `?v=` query in `index.html`; verify SW re-caches the new shell.

---

## 5. Verification matrix

**Climate engine (unit-ish, in-page console harness):**
- First 5 effective outcomes → `--climate-red`/`--climate-dim` stay 0 (neutral).
- 20 consecutive `+1` → `--climate-red` climbs monotonically toward ~cap; never overshoots 0.22 opacity.
- 20 consecutive `−1` → red stays 0, `--climate-dim` rises; **no blue anywhere** (assert no blue hue in computed layers).
- One `−1` after a long positive streak → balance moves < a small epsilon; visible hue change over one event is imperceptible (assert delta).
- 50-event trim holds; 51st push drops the oldest.
- `lastActive` 8 / 14 days ago → freshness fades to partial / 0.
- Corrupt `cs_performanceClimateV1` → auto-reset, no throw.
- `setEnabled(false)` → layers → 0, updates stop mutating visuals; re-enable restores.
- Two tabs → `storage` event re-syncs both.
- Exam: background frozen from Begin → Submit, then exactly one aggregate update.
- Flashcard: click / swipe / keyboard grade each records exactly one event; undo pops exactly one and restores SRS state.

**Shell / UX:**
- Every old route still resolves (including `#/extras` → redirect); no dead nav.
- Trials reachable from exactly one nav entry; old deep links work.
- Focus mode toggles only on assessment routes; Exit always visible.
- Command palette: keyboard-only open/navigate/select/close; focus restored.

**A11y / visual:** keyboard, focus order, screen-reader labels, contrast, reduced-motion, reduced-transparency, forced-colors, light/dark, visual-regression at **1280×720 and 1440×900** (desktop only).

**Offline:** after clean SW install (`v44`), cold-offline smoke-test dashboard, cards, questions, daily circuit, physiology, angiography.

**Regression guard:** run all content validators from `site/`; confirm the 40 lesson-grounding + 45 new-card-quality failures are unchanged and **no new failures** appear. Confirm no SRS/scoring/gating/XP behavior changed.

---

## 6. Risk register

| Risk | Mitigation |
|---|---|
| Red atmosphere read as "danger" | Low-alpha (≤0.22), de-saturated, radial, slow; direct feedback stays green/red; ships default-OFF with a labeled toggle; momentum chip explains it. |
| Climate leaks per-answer correctness | Blocks submit one aggregate event; exam suspends; 3 dampers make single events imperceptible. |
| 11 module hooks drift / break isolation | Every call `if (window.PerformanceClimate)`-guarded; modules stay independently removable. |
| Undo mutates SRS wrongly | Snapshot-restore only, no scheduler recompute; covered by explicit test. |
| Nav regroup breaks deep links | Preserve all routes; `#/extras` redirect; de-dupe verified against grep of hrefs. |
| SW cache stale after ship | Bump cache token + every touched `?v=`; verify re-cache in verification. |
| Command palette has no data source | Search-registry built as an explicit prerequisite task from existing globals. |

---

## 7. New files added

- `js/climate/performance-climate.js` — engine (loaded right after `spring.js`).
- `js/search-index.js` — command-palette registry (Phase 2).
- `js/media/lightbox.js` — shared media viewer (item 14).
- CSS: new blocks appended to `css/style.css` (climate layers, tokens, focus-mode, reader tools) and `css/components.css` (shared page-head, settings, palette, lightbox) — no new stylesheet files unless a block exceeds ~150 lines.

All added to `index.html` as plain `<script>`/`<link>` tags with `?v=` query strings.
