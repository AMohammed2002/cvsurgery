# Visual polish: shared brief for every implementation agent

Read this whole file first, then `docs/plans/VISUAL_POLISH_PLAN_2026-10.md` (the plan the user approved).
Evidence screenshots of the app before any change: `docs/plans/visual-audit-2026-10/baseline/*.png` (route × light/dark, all 14 labs).

## User decisions (final)
- **D1:** returning students land on a **Today desk** at `#/`. The story page moves to `#/welcome` (first visit + staff preview).
- **D2:** lab instrument surfaces (CPB console, OR monitor, scopes, plots) are **always-dark "stage" surfaces** in both themes. The user also asked that **all 14 physiology labs be refined to look professional and clean.**
- **D3:** Course Override moves off the 14-Day Plan to the bottom of Progress.
- Product: desktop-first workstation (1280–1600px). Keep mobile working but don't design for it.

## The app
Zero-build static PWA in `site/` (vanilla JS + CSS, no bundler, no new dependencies, no network fonts). Routes are hash-based (`route()` in `js/app.js`). The store prefix is `cs_`.
A static server is already running: `http://127.0.0.1:8765/` (served from `site/`). **Do not kill it.** If it's down, run `cd site && python3 -m http.server 8765 --bind 127.0.0.1 &`.

## Foundation already landed (Phase 1). Build on it, don't redo it
`site/css/tokens.css` is loaded first and is the **only** place a palette may be declared. Read it. Key tokens:
- neutrals `--bg --surface --surface-2 --muted --fg --fg-soft --fg-faint --border --border-strong`
- brand `--primary` (#cc3354, AA with white) `--primary-hover --primary-bright` (illustration only) `--primary-soft --on-primary --cobalt --saffron --saffron-ink --navy`
- feedback `--ok/-bg/-border --warn/… --danger/… --info/…`; callouts `--pearl* --mnem* --study*` already map onto these
- stage (always dark) `--stage --stage-panel --stage-raised --stage-border --stage-fg --stage-muted --stage-faint`; signals `--sig-ecg --sig-art --sig-cvp --sig-spo2 --sig-pa --sig-flow`
- shape `--r-xs 6 · --r-sm 10 · --r 16 · --r-pill 999`; elevation `--shadow-1 --shadow-2` only
- type `--font --font-mono`; motion `--ease-out --ease-in-out --ease-drawer --dur-press 120 --dur-fast 160 --dur-base 220 --dur-slow 360`
- `--header-h` (currently 88px; the Shell agent changes it to 72px) and the z-index scale `--z-*`
- `html{scroll-padding-top}` is already set from `--header-h`.

## Non-negotiable rules
1. **Colour:** no new hex/rgb literals outside `tokens.css`. Replace literals in your files with tokens. (Inside canvas/SVG drawing code, read tokens via `getComputedStyle(document.documentElement).getPropertyValue('--sig-ecg')` or use the stage/signal tokens. If a needed token is missing, **report it, don't invent one**, then use the nearest existing token.)
2. **Brand coral never means danger or incorrect.** No coral/pink tinted backgrounds for decoration (cards, banners, heroes, callouts). Feedback always carries an icon or a word ("Correct", "Incorrect", "Danger").
3. **No violet/purple and no teal as UI colours** (leftovers from old palettes). Cobalt is the only secondary colour. Teal/green belongs only to `--ok` and to monitor signal traces.
4. **Shape:** radii only from the 4 tokens (50% is fine for true circles/dots). Shadows only `--shadow-1/2`. No gradient left-border "stripes" on tiles.
5. **Theme lock:** every screen must look intentional in both `[data-theme=dark]` and light. Never a half-themed screen. Stage surfaces are the one sanctioned exception (always dark).
6. **Chrome copy:** no emoji in UI chrome; no em-dash (—) in UI chrome strings you touch (labels, buttons, headers, empty states). Medical/lesson prose and data files are **out of scope**: don't edit content. Eyebrows (small uppercase tracked labels) max 1 per 3 sections. Remove numbered-section labels (`01/02`), code labels (`CR-01`, `HLM-01`), pagination like `01 — 14`, decorative dots, scroll cues.
7. **Motion (Emil Kowalski rules):**
   - Ask "how often is this seen?" Seen 100+ times a day (keyboard grading, option select, nav): no animation, or ≤150ms. Tens of times a day (page change, menus, hovers): ≤200ms. Occasional (toast, dialog): 200–250ms enter, faster exit. Rare (gallery entrance, celebration): delight allowed, but **readable within 650ms**, once per session, skippable.
   - Use `--ease-out` for enter/exit, `--ease-in-out` for on-screen movement, never `ease-in`. Never animate from `scale(0)` (start at ≥0.95 + opacity). Popovers scale from their trigger (`transform-origin`), modals from centre.
   - Animate only `transform`/`opacity` (and `clip-path`). Never `transition: all`; list the properties.
   - Prefer CSS transitions (interruptible) over keyframes for anything that can retrigger.
   - Gate hover *transform/elevation* effects behind `@media (hover:hover) and (pointer:fine)`. Pressables keep `:active{transform:scale(.97)}` (the delegated `.pressing` class in app.js already does this for many elements).
   - `prefers-reduced-motion`: keep opacity fades, drop translate/scale. **No `window.addEventListener('scroll', …)` for visuals.** Use IntersectionObserver or CSS `animation-timeline`.
8. **Typography:** Figtree only. Negative tracking only on display sizes (h1 ≈ -.028em, h2 -.02em, h3 -.01em). Body tracking stays 0. Numbers in readouts/stats: `font-variant-numeric: tabular-nums`. Line length for prose ≤ 72ch.
9. **Taste rules for layout:** no all-zero stat-tile rows, no grids with orphan cells (N items → layout that fills; prefer `repeat(auto-fill,minmax(…,1fr))` or deliberate featured+rest), no icon-in-grey-circle on every card, cards only where elevation means something (otherwise group with spacing/dividers). One CTA label per intent per page.

## Shared-file protocol (several agents work at the same time)
- Shared files: `js/app.js`, `css/style.css`, `css/components.css`, `css/studio.css`, `css/experience.css`, `js/experience.js`, `js/advanced/advanced.js`, `js/surgery/surgery.js`, `js/anatomy/anatomy.js`, `js/trials/trials.js`.
  Edit **only** the functions/selectors your assignment names. Use the Edit tool with small, unique `old_string`s. **Never use Write on an existing shared file, never reformat/re-minify/reorder it.** If an Edit fails because the file changed, Read the relevant region again and retry.
- Files you **own** exclusively are listed in your assignment. You may restructure those freely.
- New CSS that belongs to your area goes in a file you own, or in a clearly labelled section appended to `components.css` (`/* ===== <your area> (polish 2026-10) ===== */`). If you create a new CSS/JS file, **tell me in your report**. Don't edit `index.html` yourself except where your assignment says so. I wire new files in and bump cache-busters at the end.
- **Do not `git commit`, `git add`, `git checkout` or `git stash`.** The orchestrator commits. (`git diff` / `git status` are fine.)
- Don't edit data/content files: `js/data/*`, `*-data.js`, `cards-*.js`, `regions-*.js`, `trials-*.js` (except `trials.js`), `surgery-<op>.js`, `lab-metadata.js` (generated).

## Verify your own work
- Screenshots: `cd site && SHOT_PLAYWRIGHT=/Users/aymanmohammed/.npm/_npx/e41f203b7505f1fb/node_modules/playwright node tools/screenshot.js <your-scratch-dir> <core|labs|study|all> [nameFilter]`. Then **look at the PNGs** (Read tool), light and dark, and compare with `docs/plans/visual-audit-2026-10/baseline/`. Iterate until it looks clean.
- For interaction states the tool doesn't capture, write a throwaway Playwright script in your scratch dir (same `SHOT_PLAYWRIGHT` path). The app opens on a role gate: click `[data-staff-choice="student"]`. Theme = `document.documentElement.dataset.theme` + localStorage `cs_theme`. Unlock Day 1 = seed `cs_done` with Day-1 lesson ids (see `tools/screenshot.js`).
- Tests that must stay as they are (baseline: these pass): `node tools/validate.js`, `validate-physiology.js`, `validate-surgery.js`, `validate-anatomy.js`, `validate-trials.js`, `validate-advanced.js`, `validate-angiography.js`, `validate-day-ecosystem.js`, `test-*.js` (non-Playwright ones). Playwright tests: `CPB_PLAYWRIGHT=<pw> node tools/test-cpb-workstation.js`, `STAFF_TOUR_PLAYWRIGHT=<pw> node tools/test-staff-tour.js`, where `<pw>` = `/Users/aymanmohammed/.npm/_npx/e41f203b7505f1fb/node_modules/playwright`. Run the ones that touch your area before reporting. If a test asserts on a selector or copy you intentionally changed, update the test minimally and say so.
- Check the browser console for page errors (the screenshot tool prints them).

## Report back (keep it under ~40 lines)
Files changed (owned vs shared), what changed per surface, new files created, tokens you needed but didn't have, tests run and results, before/after screenshot paths, and anything you deliberately left undone.
