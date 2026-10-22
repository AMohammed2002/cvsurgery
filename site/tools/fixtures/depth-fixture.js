/* depth-fixture.js — a SYNTHETIC, fully-upgraded Day 1 used only by:
 *     node tools/validate-depth.js --selftest
 *
 * It is not shipped content and is never loaded by the app. Its only job is to prove that
 * validate-depth.js PASSES a structurally-deep day (Senior + Mastery lesson layers, decision-type
 * items, four-part quantitative items, an operative-step item, and a well-formed evidence item) — so
 * the gate demonstrably tells deep from shallow, rather than merely failing everything.
 *
 * It models Day 1 (Cardiac & Mediastinal Anatomy) floors: L4>=1, L5>=1, whenNotTo>=1, rescue>=1,
 * quantFour>=2, operative>=1, evidence>=0. (An evidence item is included anyway to exercise that path.)
 * The medical content is intentionally terse — this file certifies STRUCTURE, not teaching quality.
 */
window.LESSONS = window.LESSONS || {};
window.LESSONS["fixt-d1-anat"] = {
  id: "fixt-d1-anat", day: 1, title: "[fixture] Anatomy climb",
  chunks: [
    { html: "<p>L1 orientation: the four chambers, four valves, and great vessels.</p>" },
    { html: "<p>L3 working spine: coronary dominance and the conduction axis in Koch's triangle.</p>", level: 3 },
    { html: "<h4>Senior reasoning: the reoperative-sternotomy hazard map read off a gated CT — RV, patent grafts, and a dilated aorta against the posterior sternal table, and the maneuver each threatens.</h4>", level: 4 },
    { html: "<h4>PGY-5 mastery: redo AVR with a patent LIMA-LAD — peripheral cannulation before opening, the oscillating-saw single-table-then-lift strategy, and the RV-laceration rescue.</h4>", level: 5 }
  ]
};

window.FLASHCARDS = window.FLASHCARDS || [];
window.FLASHCARDS.push(
  {
    id: "fixt-fc-1", day: 1, lesson: "fixt-d1-anat", topic: "Anatomy",
    level: 3, kind: "quantitative",
    front: "<p>Coronary ostial heights — number, condition, exception, resolver?</p>",
    back: "<p>...</p>",
    quant: {
      number: "left main ostium ~13-15 mm and right ~15-17 mm above the annulus",
      condition: "in the normal root before any prosthesis is seated",
      exception: "a low ostium under a bulky prosthesis or during root work risks ostial obstruction",
      resolver: "measure ostial height on gated CT and choose button reimplantation or a graft when the ostium sits low",
      source: "[AO]"
    }
  },
  {
    id: "fixt-fc-2", day: 1, lesson: "fixt-d1-anat", topic: "Anatomy",
    level: 4, kind: "quantitative",
    front: "<p>Circumflex-to-P1-annulus distance — number, condition, exception, resolver?</p>",
    back: "<p>...</p>",
    quant: {
      number: "the circumflex runs within a few millimeters of the posterior (P1) mitral annulus, closest laterally",
      condition: "and is closest and most vulnerable in the left-dominant heart",
      exception: "deep lateral annuloplasty bites can snare or kink it",
      resolver: "keep lateral annular bites superficial and read a new lateral wall-motion abnormality on post-bypass TEE as capture"
    }
  }
);

window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(
  {
    id: "fixt-q-1", day: 1, lesson: "fixt-d1-anat", topic: "Anatomy",
    level: 5, kind: "operative-step",
    stem: "<p>Redo sternotomy, patent LIMA-LAD on CT adherent to the posterior table. Correct opening step?</p>",
    options: ["Expose and cannulate a peripheral vessel first, then divide the outer table and lift", "Standard midline saw through both tables", "Open fast to minimize time", "Start central cannulation after the chest is open"],
    answer: 0,
    explain: "<p>Peripheral access before opening lets you get on bypass and decompress if the RV or graft is entered.</p>"
  },
  {
    id: "fixt-q-2", day: 1, lesson: "fixt-d1-anat", topic: "Anatomy",
    level: 5, kind: "complication-rescue",
    stem: "<p>The saw enters the RV on redo opening. Ordered rescue?</p>",
    options: ["Finger control, pack, get on peripheral bypass, repair on a decompressed heart", "Immediate cross-clamp", "Reverse heparin", "Close the chest"],
    answer: 0,
    explain: "<p>Control-pack-bypass-repair on a decompressed heart is the sequence.</p>"
  },
  {
    id: "fixt-q-3", day: 1, lesson: "fixt-d1-anat", topic: "Anatomy",
    level: 4, kind: "when-not-to",
    stem: "<p>CT shows the aorta densely adherent to the sternum with a patent graft crossing the midline. When do you NOT proceed with a standard central redo entry?</p>",
    options: ["When adherence is within millimeters of the table — establish peripheral bypass first", "Never — always central", "Only if the patient is unstable", "When the aorta is normal caliber"],
    answer: 0,
    explain: "<p>Adherence to the posterior table mandates peripheral cannulation before opening.</p>"
  },
  {
    id: "fixt-q-4", day: 1, lesson: "fixt-d1-anat", topic: "Anatomy",
    level: 5, kind: "evidence",
    stem: "<p>[fixture] evidence-path item.</p>",
    options: ["a", "b", "c"], answer: 0,
    explain: "<p>...</p>",
    evidence: {
      trial: "PARTNER 3", population: "low-surgical-risk severe symptomatic AS, tricuspid anatomy",
      comparison: "balloon-expandable TAVR vs SAVR", endpoint: "death/stroke/rehospitalization composite at 1 year",
      effect: "TAVR superior at 1 year; death and stroke similar by 5 years",
      tradeoff: "higher pacemaker and paravalvular-leak burden with TAVR",
      limitation: "short follow-up for the durability question; bicuspid excluded", source: "[P3]"
    }
  }
);
