/* ============================================================================
   CardiacSchool — STANDALONE "SURGERIES" MODULE (isolated data root)
   A deep, ground-up reference on the core adult cardiac OPERATIONS. Written for
   a trainee who has "forgotten everything": every article re-derives the
   anatomy, physiology and pathophysiology from scratch, then teaches the
   operation step by step and ramps to senior-resident / PGY-5 depth, with a
   per-operation MCQ self-test covering every pimping question and an optional
   cloze flashcard deck.

   Fully separate from the 14-day plan: its own cs_surgery_* store, no
   XP/streak/quests, does not touch window.QUESTIONS or the 14-day cs_srs.
   Loads before the surgery-<id>.js content files (which push into it) and
   before surgery.js (which reads it). Remove the js/surgery/ folder + its host
   hooks (index.html tags, 1 router branch) and the rest of the app is
   completely unaffected.
   ============================================================================ */
"use strict";

window.SURGERY = {
  /* Hub grouping headers (a section's `category` must match one of these ids). */
  categories: [
    { id: "foundational", title: "Foundational Skills",
      blurb: "Access and bypass — the median sternotomy and the controlled handoffs of going on and coming off cardiopulmonary bypass. Every case in this catalog is built on these." },
    { id: "coronary", title: "Coronary",
      blurb: "Surgical revascularization — on-pump and off-pump coronary artery bypass grafting: conduit biology, target selection, the distal anastomosis and the evidence that decides who gets an operation." },
    { id: "valve", title: "Valve",
      blurb: "The aortic and atrioventricular valves — replacement and repair of the aortic, mitral and tricuspid valves: annular anatomy, the conduction axis, coaptation geometry and prosthesis choice." },
    { id: "aorta", title: "Aortic & Root",
      blurb: "The aortic root, ascending aorta and arch — root replacement and valve-sparing, hemiarch and total arch under circulatory arrest, and the emergency of acute type A dissection." },
    { id: "mcs", title: "Mechanical Circulatory Support",
      blurb: "Durable support — implantation of a continuous-flow left ventricular assist device: patient selection, inflow/outflow geometry, right-heart risk and the physiology of a non-pulsatile circulation." },
    { id: "rhythm", title: "Arrhythmia Surgery",
      blurb: "Surgical treatment of atrial fibrillation — the Cox-Maze lesion set, ablation energy sources and left atrial appendage management: how scar lines are used to redirect atrial conduction without injuring the nodes or the coronary arteries." }
  ],

  /* Reading sections — one per operation, pushed by surgery-<id>.js. Each article
     opens with a plain-language "Start here" block and ramps to PGY-5 depth.
     Schema:
     { id, category, title, subtitle, readMins, day (optional int for day-integration),
       blocks: [ { title, html } ],    // html is TRUSTED rich teaching HTML
                                        // (kbox/table classes ok; no backtick, no ${ )
       steps: [ "step text", ... ] }   // OPTIONAL ordered operative steps for the
                                        // "Order-the-Steps" game (#/surgery/order/<id>):
                                        // 14-20 plain strings in canonical operative
                                        // order, no backtick / no ${ . Isolated best
                                        // scores in cs_surgery_order (no XP/streak). */
  sections: [],

  /* MCQ bank — per-operation self-test (>=25 per section for this app). Pushed by
     surgery-<id>.js. Schema: { id, section:<sectionId>, category, topic, q,
     options:[…], answer:<0-based>, explain } */
  questions: [],

  /* Cloze flashcard bank — per operation (>=20 when a section ships them). Spaced
     repetition lives in an isolated cs_surgery_* store handled by surgery.js — no
     XP/streak coupling. Schema: { id, section:<sectionId>, category, topic, text }
     where text holds Anki-style cloze: {{c1::answer}} or {{c1::answer::hint}}. */
  cards: []
};
