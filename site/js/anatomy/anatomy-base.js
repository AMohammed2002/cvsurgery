/* ============================================================================
   CardiacSchool — STANDALONE ANATOMY MODULE (isolated data root)
   This file MUST load before regions-*.js / cards-*.js (which push into it)
   and before anatomy.js (which reads it). It is completely independent of the
   14-day plan: no day gating, no shared SRS store, no XP/streak/quests.
   ============================================================================ */
"use strict";

window.ANATOMY = {
  /* Top-level grouping shown as headers on the Anatomy Review hub. */
  categories: [
    { id: "coronary",   title: "Coronary Arteries & Veins",    blurb: "Left main, LAD, circumflex, RCA and their branches; coronary venous drainage via the coronary sinus; dominance patterns." },
    { id: "chambers",   title: "Cardiac Chambers & Pericardium", blurb: "Right and left atria and ventricles, the ventricular septum, pericardial layers and sinuses, and cardiac embryology." },
    { id: "valves",     title: "Cardiac Valves",               blurb: "Aortic, pulmonary, mitral and tricuspid valve anatomy, leaflets, papillary muscles, chordae tendineae and annular geometry." },
    { id: "conduction", title: "Conduction System",            blurb: "SA node, internodal tracts, AV node, bundle of His, bundle branches, Purkinje fibres, and the triangle of Koch." },
    { id: "vessels",    title: "Great Vessels & Surgical Conduits", blurb: "Ascending aorta, aortic arch, descending thoracic aorta, pulmonary trunk, femoral vessels, saphenous vein, LIMA, radial artery, axillary artery and phrenic nerve." }
  ],
  /* Region review pages — pushed by regions-<cat>.js
     { id, category, title, short, blurb, diagram?:"ADG.x"|"DG.x",
       sections:[{heading, html}], pearls:[ "..." ] } */
  regions: [],
  /* Cloze flashcards — pushed by cards-<cat>.js
     { id:"a-<region>-NN", region, category, subtype, text:"... {{c1::answer}} ..." }
     subtype in structures | arterial | venous | lymphatic | nerves | surgical */
  cards: []
};
