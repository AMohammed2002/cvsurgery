# Desktop visual direction — 6 September 2026

Scope for this pass: desktop web visuals and interaction. The user explicitly stopped mobile design work and physiological model work. No deployment.

## Reference translation

- Process Academy, https://process-academy.org/en/ — inspected live at the opening, yellow learning section, blue learning section, illustrated transitions and expanded navigation. Applied full-width cream/yellow artwork, changing yellow/coral/cobalt scroll scenes, oversized background words, layered illustrations, rounded controls and the sliding mega menu. Original cardiac artwork replaces the reference's astronaut and phone imagery.
- Inkwell, https://inkwell.tech/ — inspected its scattered gallery, aligned cards, circular formation and spatial response. The physiology collection uses fourteen original illustrated cards, unfolding before gathering into a line and then a circle. The entrance runs on navigation, rather than depending on scroll as in the reference.

## Implemented desktop behavior

- Home: new original SVG heart, organic two-color background, parallax artwork, prominent real continuation action and direct access to the learner's training desk.
- Pinned learning scene: normal scrolling changes Understand / Remember / Explore, background, artwork, active tab, oversized backdrop word and header colors. Chapter controls provide direct access without requiring the full scroll sequence.
- Training desk: existing course timeline, progress, pacing gates, recovery notices, quests and task nodes are preserved and reparented into the new composition.
- Labs: fourteen deep-linked poster cards; scatter → line → ring; pointer parallax, drag rotation, selected-card enlargement and contextual label; card-to-lab transition; replay, pause and a searchable directory with a sliding active-tab indicator.
- Global navigation: sliding grouped menu, command search and existing route URLs. Unused earlier signature-diagram JavaScript removed. Lab toolbar class repaired so the shared toolbar styling actually applies.
- Motion uses transforms and one scheduled frame per scroll/pointer update. The idle ring now stops requesting frames after settling. Visibility/unmount cleanup and reduced-motion branches are present. No scroll interception or smooth-scroll dependency.
- Static/lazy asset queries updated together. Service-worker shell is v59-story and continues to require explicit update acceptance.

## Observed browser checks

At desktop dimensions (1280×720 and 1440×900):

- Reviewed the new home opening, all three pinned chapters, changing header, and the training desk. No page-level horizontal overflow observed in these scenes.
- Chapter controls select the matching scene; direct training-desk control reaches the live dashboard, with fourteen day links and seven current task links in this learner state.
- Reviewed expanded desktop Practice menu.
- Ring contains fourteen accessible lab deep links. Drag changed the first card's transform. Hover selected Pressure–volume and increased its scale from 1 to approximately 1.24. Paused ring transform remained unchanged after a drag.
- Rhythm & support directory filter showed ECG, pacing, IABP and TEG/ROTEM. Text search reduced the directory. Command search found both a cannulation lesson and its lab; Escape closed it.
- Card-to-PV navigation reached the functioning lab. No console errors or warnings were observed in the reviewed scenes.
- Existing midnight course reconciliation occurred during review and rebuilt the home for the new course day, retaining the new structure.

## Automated checks

Passed during this visual pass:

- JavaScript syntax checks for experience.js, academy-story.js and studio-ui.js.
- Offline shell / explicit update guard.
- Progress transfer and course override guards.
- Course pacing tests.
- Existing numerical family suite: 3,423 assertions.
- Existing physiology validator: 0 errors, including ECG 7,193 assertions, ECG renderer 39 assertions, cath 338 assertions and OR case checks.

Limits: this is a visual implementation review, not an independent clinical review or a CSS Design Awards assessment. A full all-route accessibility/performance audit, browser automation of reduced-motion mode, and exported screenshot/video artifacts have not been completed in this pass. The earlier full content validator's unrelated numeric retrieval-card editorial failure remains recorded in full-validator.txt; it was not suppressed.
