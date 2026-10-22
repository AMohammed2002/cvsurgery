/* ============================================================================
   CardiacSchool — STANDALONE "TRIALS" MODULE (isolated data root)
   Landmark cardiac surgery trials with per-trial self-test MCQs. Fully separate
   from the 14-day plan: its own st_trials_* store, no XP/streak/quests, does not
   touch window.QUESTIONS. Loads before trials-<cat>.js (which push into it)
   and before trials.js (which reads it).
   ============================================================================ */
"use strict";

window.TRIALS = {
  /* Hub grouping headers. */
  categories: [
    { id: "coronary", title: "Coronary Artery Disease", blurb: "Landmark trials comparing CABG, PCI, and medical therapy in stable and complex CAD." },
    { id: "valve",    title: "Valve Disease",           blurb: "Pivotal trials that established TAVR, MitraClip, and modern surgical valve strategy." },
    { id: "aortic",   title: "Aortic Disease",          blurb: "Defining evidence for TEVAR vs open repair and aneurysm size-threshold guidelines." },
    { id: "support",  title: "Mechanical Support",      blurb: "Device trials that changed durable mechanical-circulatory-support practice." },
    { id: "perioperative", title: "Perioperative & Critical Care", blurb: "Transfusion, hemostasis and postoperative-care trials that shape the cardiac-surgery pathway." }
  ],
  /* Trial objects — pushed by trials-<cat>.js. Schema:
     { id, category, name, full, year, journal, topic,
       question, design, population, intervention, comparator, outcome, bottomLine,
       pearls:[...], citation,
       mcqs:[ { q, options:[...], answer:<0-based index>, explain } ]  // 3-5 each } */
  trials: []
};
