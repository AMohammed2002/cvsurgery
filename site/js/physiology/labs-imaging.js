/* Catheter imaging trainer: drive the C-arm around the patient and open the plate.
   Plates, label hotspots and view names are extracted from the Cath Slides deck by
   tools/extract-cath-slides.py — see tools/cath-slides-index.json. */
(function () {
  "use strict";
  const requestAnimationFrame = fn => window.CSLab.raf(fn), cancelAnimationFrame = id => window.CSLab.cancelRaf(id);
  if (!window.CSLab) return;

  const ASSETS = "assets/cath-projections/";
  /* Sign convention, used everywhere below:
       rot  negative = RAO (detector over the patient's right), positive = LAO
       tilt negative = caudal (detector toward the feet), positive = cranial
     Both rigs are drawn the way the standard angulation diagrams are drawn:
     detector above the patient, tube below the table. */
  const ROT_LIMIT = 60, TILT_LIMIT = 40;
  const LOCK = 8;    /* degrees on each axis inside which a named view opens */
  const DETENT = 3;  /* magnetic snap so a locked view does not drift under the cursor */

  const TARGETS = [
    { id: "lca", label: "Left coronary", injection: "LCA injection", vocab: ["LM", "LAD", "LCX", "Diag", "OM", "SPs"] },
    { id: "rca", label: "Right coronary", injection: "RCA injection", vocab: ["RCA", "Conus", "AMB", "PDA", "PLVB"] },
    { id: "lv", label: "LV gram", injection: "Left ventriculogram", vocab: ["Anterobasal", "Anterior", "Apical", "Inferior", "Inferobasal", "Basal septal", "Apical septal", "Basal lateral", "Apical lateral", "Apex"] }
  ];

  const GLOSSARY = {
    LM: "left main", LAD: "left anterior descending", LCX: "circumflex", Diag: "diagonal branch",
    OM: "obtuse marginal", SPs: "septal perforators", RCA: "right coronary artery",
    Conus: "conus branch", AMB: "acute marginal branch", PDA: "posterior descending artery",
    PLVB: "posterior left ventricular branch"
  };

  const PLATES = [
    {
      target: "lca", id: "lca-rao-caudal", name: "RAO caudal", rot: -30, tilt: -25,
      file: "cath-lca-rao-caudal.jpg", w: 970, h: 851,
      note: "Follows the circumflex down the AV groove and separates it from the obtuse marginals. The LAD is foreshortened here — do not grade it on this frame.",
      labels: [{ t: "LAD", x: 76.7, y: 24.03, lx: 83.63, ly: 22.89 }, { t: "LCX", x: 24.44, y: 20.46, lx: 18.71, ly: 22.78 }, { t: "OM", x: 38.35, y: 47.94, lx: 46.22, ly: 47.69 }, { t: "Diag", x: 39.48, y: 15.52, lx: 38.2, ly: 22.37 }, { t: "LM", x: 16.62, y: 7.56, lx: 8.35, ly: 5.88 }, { t: "SPs", x: 56.41, y: 14.53, lx: 61.94, ly: 7.26 }]
    },
    {
      target: "lca", id: "lca-ap-caudal", name: "AP caudal", rot: 0, tilt: -30,
      file: "cath-lca-ap-caudal.jpg", w: 973, h: 873,
      note: "A shallow caudal look that pulls the left main clear of the LAD and circumflex origins when RAO caudal still overlaps them.",
      labels: [{ t: "LAD", x: 49.94, y: 33.23, lx: 57.04, ly: 34.1 }, { t: "LCX", x: 29.06, y: 38.05, lx: 27.52, ly: 45.24 }, { t: "OM", x: 58.17, y: 55.77, lx: 50.17, ly: 58.19 }, { t: "Diag", x: 61.31, y: 18.52, lx: 63.93, ly: 10.87 }, { t: "LM", x: 18.91, y: 21.33, lx: 10.64, ly: 19.68 }, { t: "SPs", x: 28.62, y: 17.27, lx: 20.67, ly: 8.99 }]
    },
    {
      target: "lca", id: "lca-lao-caudal", name: "LAO caudal (spider)", rot: 45, tilt: -25,
      file: "cath-lca-lao-caudal.jpg", w: 969, h: 793,
      note: "The spider view: the single best look at the distal left main and the origins of the LAD and circumflex. Everything distal is foreshortened, so read the bifurcation and move on.",
      labels: [{ t: "LAD", x: 47.98, y: 29.25, lx: 55.09, ly: 22.27 }, { t: "LCX", x: 39.48, y: 51.9, lx: 37.54, ly: 59.99 }, { t: "OM", x: 69.5, y: 44.83, lx: 72.44, ly: 37.55 }, { t: "LM", x: 26.9, y: 32.93, lx: 21.5, ly: 21.63 }, { t: "SPs", x: 13.49, y: 68.69, lx: 10.64, ly: 60.78 }]
    },
    {
      target: "lca", id: "lca-lao-cranial", name: "LAO cranial", rot: 40, tilt: 25,
      file: "cath-lca-lao-cranial.jpg", w: 954, h: 938,
      note: "Separates the LAD from its diagonals and shows septal orientation — the working view for mid-LAD disease and for planning the LIMA target.",
      labels: [{ t: "LAD", x: 43.69, y: 77.34, lx: 50.8, ly: 78.14 }, { t: "LCX", x: 35.9, y: 25.42, lx: 29.6, ly: 27.27 }, { t: "Diag", x: 56.59, y: 34.73, lx: 58.29, ly: 43.52 }, { t: "LM", x: 30.39, y: 11.61, lx: 29.36, ly: 6.44 }, { t: "SPs", x: 24.84, y: 39.07, lx: 16.89, ly: 31.51 }]
    },
    {
      target: "lca", id: "lca-ap-cranial", name: "AP cranial", rot: 0, tilt: 35,
      file: "cath-lca-ap-cranial.jpg", w: 956, h: 763,
      note: "Elongates the mid and distal LAD with the circumflex displaced away from it. Good for LAD bifurcation lesions that overlap in every oblique.",
      labels: [{ t: "LAD", x: 61.66, y: 76.21, lx: 53.39, ly: 79.13 }, { t: "LCX", x: 67.79, y: 10.41, lx: 75.44, ly: 7.98 }, { t: "Diag", x: 76.08, y: 32.4, lx: 90.76, ly: 36.21 }, { t: "LM", x: 41.03, y: 13.55, lx: 39.99, ly: 7.17 }, { t: "SPs", x: 46.84, y: 36.7, lx: 37.86, ly: 34.09 }, { t: "OM", x: 77.31, y: 20.61, lx: 83.64, ly: 17.94 }]
    },
    {
      target: "lca", id: "lca-rao-cranial", name: "RAO cranial", rot: -25, tilt: 30,
      file: "cath-lca-rao-cranial.jpg", w: 952, h: 782,
      note: "Elongates the proximal and mid LAD and throws the diagonals clear of the septals, with the circumflex displaced high out of the way.",
      labels: [{ t: "LAD", x: 71.43, y: 55.82, lx: 62.12, ly: 58.65 }, { t: "LCX", x: 42.79, y: 10.4, lx: 50.31, ly: 7.75 }, { t: "Diag", x: 70.39, y: 19.23, lx: 74.74, ly: 13.15 }, { t: "LM", x: 32.41, y: 16.32, lx: 26.71, ly: 13.62 }, { t: "SPs", x: 85.49, y: 48.13, lx: 90.21, ly: 37.57 }, { t: "OM", x: 47.97, y: 36.43, lx: 39.75, ly: 41.01 }]
    },
    {
      target: "rca", id: "rca-lao-straight", name: "LAO straight", rot: 45, tilt: 0,
      file: "cath-rca-lao-straight.jpg", w: 964, h: 908,
      note: "Lays the right coronary out as its characteristic C, from ostium through the acute margin. The workhorse first look at the RCA.",
      labels: [{ t: "RCA", x: 18.35, y: 44.52, lx: 17.86, ly: 39.99 }, { t: "Conus", x: 25.48, y: 31.75, lx: 25.56, ly: 26.26 }, { t: "PLVB", x: 54.82, y: 63.59, lx: 57.8, ly: 55.48 }, { t: "PDA", x: 56.25, y: 80.45, lx: 56.8, ly: 87.19 }, { t: "AMB", x: 15.43, y: 63.07, lx: 14.95, ly: 69.31 }]
    },
    {
      target: "rca", id: "rca-ap-lao-cranial", name: "AP–LAO cranial", rot: 20, tilt: 25,
      file: "cath-rca-ap-lao-cranial.jpg", w: 955, h: 747,
      note: "Opens the crux: the distal bifurcation into the posterior descending and posterolateral branches separates instead of stacking. Needed before you can call dominance or plan a distal target.",
      labels: [{ t: "RCA", x: 9.02, y: 22.59, lx: 8.53, ly: 17.13 }, { t: "Conus", x: 14.91, y: 12.41, lx: 11.88, ly: 7.98 }, { t: "PLVB", x: 43.1, y: 33.24, lx: 49.45, ly: 18.29 }, { t: "PDA", x: 41.67, y: 62.59, lx: 42.12, ly: 71.09 }, { t: "AMB", x: 11.09, y: 70.28, lx: 10.95, ly: 77.91 }]
    },
    {
      target: "rca", id: "rca-rao-straight", name: "RAO straight", rot: -30, tilt: 0,
      file: "cath-rca-rao-straight.jpg", w: 858, h: 602,
      note: "Shows the mid RCA and the acute marginal in profile, but the crux branches overlap — a flat RAO alone cannot assign the distal bifurcation.",
      labels: [{ t: "RCA", x: 28.26, y: 39.63, lx: 20.12, ly: 35.43 }, { t: "Conus", x: 32.95, y: 20.48, lx: 22.18, ly: 17.19 }, { t: "PLVB", x: 52.15, y: 51.8, lx: 66.13, ly: 44.16 }, { t: "PDA", x: 53.81, y: 77.46, lx: 57.62, ly: 88.45 }, { t: "AMB", x: 30.74, y: 69.88, lx: 20, ly: 76.82 }]
    },
    {
      target: "lv", id: "lv-rao-cranial", name: "RAO cranial", rot: -30, tilt: 15,
      file: "cath-lv-rao-cranial.jpg", w: 951, h: 816,
      note: "The standard ventriculogram: anterior, apical and inferior walls in profile for ejection fraction and for grading mitral regurgitation.",
      labels: [{ t: "Inferior", x: 56.19, y: 80.15, lx: 52.64, ly: 86.05 }, { t: "Anterobasal", x: 60.17, y: 19.01, lx: 62.01, ly: 11.48 }, { t: "Anterior", x: 76.31, y: 30.82, lx: 78.57, ly: 22.9 }, { t: "Inferobasal", x: 28.08, y: 65.44, lx: 22.27, ly: 72.24 }, { t: "Apical", x: 85.6, y: 80.95, lx: 83.9, ly: 88.59 }]
    },
    {
      target: "lv", id: "lv-lao-cranial", name: "LAO cranial", rot: 60, tilt: 20,
      file: "cath-lv-lao-cranial.jpg", w: 523, h: 434,
      note: "The complementary ventriculogram: septal and lateral walls, which the RAO projection superimposes.",
      labels: [{ t: "Basal lateral", x: 57.38, y: 40.84, lx: 60.17, ly: 33.82 }, { t: "Apical lateral", x: 60.48, y: 70.32, lx: 65.71, ly: 77.52 }, { t: "Apex", x: 40.42, y: 85.36, lx: 40.23, ly: 92.59 }, { t: "Basal septal", x: 23.17, y: 41.24, lx: 21.35, ly: 33.32 }, { t: "Apical septal", x: 23.57, y: 72.93, lx: 17.93, ly: 80.8 }]
    }
  ];

  /* Eight clinical goals, each solved by driving both rigs into one view's lock zone. */
  const DRILLS = [
    { target: "lca", plate: "lca-lao-caudal", goal: "A left main looks hazy on the first shot. Open the distal left main and the origins of the LAD and circumflex before you commit to a bifurcation strategy." },
    { target: "lca", plate: "lca-rao-cranial", goal: "You are planning the LIMA anastomosis. Elongate the proximal and mid LAD and throw the diagonals clear of the septal branches." },
    { target: "lca", plate: "lca-rao-caudal", goal: "The circumflex disappears behind the left main. Follow it down the AV groove and separate it from the obtuse marginals." },
    { target: "lca", plate: "lca-lao-cranial", goal: "A mid-LAD lesion sits right at a diagonal origin. Separate the LAD from its diagonals and show the septal orientation." },
    { target: "rca", plate: "rca-lao-straight", goal: "First look at the right coronary. Lay the vessel out as its full C from ostium to acute margin." },
    { target: "rca", plate: "rca-ap-lao-cranial", goal: "You cannot tell whether the posterior descending arises from the RCA. Open the crux so the distal bifurcation separates." },
    { target: "lv", plate: "lv-rao-cranial", goal: "You need an ejection fraction and a mitral regurgitation grade. Put the anterior, apical and inferior walls in profile." },
    { target: "lv", plate: "lv-lao-cranial", goal: "The RAO ventriculogram superimposes the septum and the lateral wall. Open the view that separates them." }
  ];

  const QUIZ_TOTAL = 8;
  const DRILL_TOTAL = DRILLS.length;

  const esc = window.CSLab.esc;
  const clamp = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); };
  const platesFor = function (target) { return PLATES.filter(function (p) { return p.target === target; }); };
  const plateById = function (id) { return PLATES.filter(function (p) { return p.id === id; })[0]; };
  const targetById = function (id) { return TARGETS.filter(function (t) { return t.id === id; })[0]; };

  const rotWord = function (rot) { return rot < -1 ? "RAO " + Math.abs(rot) + "°" : rot > 1 ? "LAO " + rot + "°" : "AP"; };
  const tiltWord = function (tilt) { return tilt < -1 ? "caudal " + Math.abs(tilt) + "°" : tilt > 1 ? "cranial " + tilt + "°" : "straight"; };

  /* ------------------------------------------------------------------ rigs */

  const VIEW_W = 300, VIEW_H = 250, CX = 150, CY = 132;

  function gantry(axis) {
    /* Image intensifier above the patient, tube below the table, joined by the C.
       The whole group is rotated about the isocenter, so the beam always points
       through the heart no matter which angle is dialled. */
    return '<g class="cath-gantry" data-gantry="' + axis + '" role="slider" tabindex="0"' +
        ' aria-label="' + (axis === "rot" ? "Detector rotation, RAO to LAO" : "Detector tilt, caudal to cranial") + '"' +
        ' aria-valuemin="' + (axis === "rot" ? -ROT_LIMIT : -TILT_LIMIT) + '" aria-valuemax="' + (axis === "rot" ? ROT_LIMIT : TILT_LIMIT) + '"' +
        ' aria-valuenow="0" aria-valuetext="AP">' +
        '<path class="cath-c" d="M150 32 A100 100 0 0 0 150 232" />' +
        '<path class="cath-c" d="M150 32 A100 100 0 0 1 150 232" />' +
        '<polygon class="cath-beam" points="132,196 168,196 186,66 114,66" />' +
        '<g class="cath-detector"><rect x="112" y="30" width="76" height="34" rx="7"/><rect x="130" y="18" width="40" height="14" rx="5"/><line x1="150" y1="64" x2="150" y2="76"/></g>' +
        '<g class="cath-tube"><rect x="126" y="200" width="48" height="30" rx="6"/><circle cx="150" cy="232" r="15"/><line x1="150" y1="188" x2="150" y2="200"/></g>' +
      '</g>';
  }

  function protractor(axis) {
    const limit = axis === "rot" ? ROT_LIMIT : TILT_LIMIT;
    let ticks = "";
    for (let a = -limit; a <= limit; a += 10) {
      /* Positive rot swings the detector to the image right; positive tilt swings
         it to the image left (toward the head), so the arc mirrors per axis. */
      const deg = (axis === "rot" ? a : -a) * Math.PI / 180;
      const r1 = a % 20 === 0 ? 88 : 92, r2 = 98;
      const sx = CX + Math.sin(deg) * r1, sy = CY - Math.cos(deg) * r1;
      const ex = CX + Math.sin(deg) * r2, ey = CY - Math.cos(deg) * r2;
      ticks += '<line class="cath-tick' + (a === 0 ? " zero" : "") + '" x1="' + sx.toFixed(1) + '" y1="' + sy.toFixed(1) + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '"/>';
    }
    return '<g class="cath-protractor" aria-hidden="true">' + ticks + '<g data-detents="' + axis + '"></g></g>';
  }

  function rotRig() {
    /* Axial section seen from the foot of the table: the patient's right is on
       the image left, so a detector swung left is RAO. */
    return '<figure class="cath-rig" data-rig="rot">' +
      '<figcaption><b>Rotation</b><span>viewed from the foot of the table</span></figcaption>' +
      '<svg viewBox="0 0 ' + VIEW_W + ' ' + VIEW_H + '" data-rig-svg="rot">' +
        '<text class="cath-side" x="26" y="130">PATIENT<tspan x="26" dy="12">RIGHT</tspan></text>' +
        '<text class="cath-side end" x="274" y="130">PATIENT<tspan x="274" dy="12">LEFT</tspan></text>' +
        protractor("rot") +
        '<g class="cath-patient">' +
          '<rect class="cath-table" x="76" y="158" width="148" height="7" rx="3"/>' +
          '<ellipse class="cath-torso" cx="150" cy="132" rx="56" ry="30"/>' +
          '<path class="cath-lung" d="M112 120c-9 6-11 22-3 30 9 5 20 2 24-6 3-9-2-24-9-27-4-2-9-1-12 3z"/>' +
          '<path class="cath-lung" d="M188 120c9 6 11 22 3 30-9 5-20 2-24-6-3-9 2-24 9-27 4-2 9-1 12 3z"/>' +
          '<path class="cath-heart" d="M150 122c-7-9-22-4-20 8 2 11 20 21 20 21s18-10 20-21c2-12-13-17-20-8z"/>' +
          '<circle class="cath-spine" cx="150" cy="153" r="6"/>' +
          '<line class="cath-sternum" x1="138" y1="107" x2="162" y2="107"/>' +
        '</g>' +
        gantry("rot") +
      '</svg>' +
      '<p class="cath-rig-read"><output data-read="rot">AP</output><small data-hint="rot">Drag the gantry, or focus it and use the arrow keys</small></p>' +
    '</figure>';
  }

  function tiltRig() {
    /* Sagittal view from the patient's left, head to the image left, so a
       detector leaning toward the head is cranial. */
    return '<figure class="cath-rig" data-rig="tilt">' +
      '<figcaption><b>Tilt</b><span>viewed from the patient’s left side</span></figcaption>' +
      '<svg viewBox="0 0 ' + VIEW_W + ' ' + VIEW_H + '" data-rig-svg="tilt">' +
        '<text class="cath-side" x="26" y="130">HEAD<tspan x="26" dy="12">CRANIAL</tspan></text>' +
        '<text class="cath-side end" x="274" y="130">FEET<tspan x="274" dy="12">CAUDAL</tspan></text>' +
        protractor("tilt") +
        '<g class="cath-patient">' +
          '<rect class="cath-table" x="40" y="158" width="220" height="7" rx="3"/>' +
          '<circle class="cath-torso" cx="72" cy="140" r="15"/>' +
          '<path class="cath-torso" d="M86 138c14-6 28-9 44-9 30 0 54 4 76 9 18 4 34 7 48 7v13c-16 0-34-3-52-6-22-4-44-7-72-7-16 0-31 2-44 6z"/>' +
          '<path class="cath-heart" d="M138 132c-7-9-22-4-20 8 2 11 20 20 20 20s18-9 20-20c2-12-13-17-20-8z"/>' +
          '<line class="cath-sternum" x1="112" y1="130" x2="170" y2="130"/>' +
        '</g>' +
        gantry("tilt") +
      '</svg>' +
      '<p class="cath-rig-read"><output data-read="tilt">straight</output><small data-hint="tilt">Drag the gantry, or focus it and use the arrow keys</small></p>' +
    '</figure>';
  }

  /* --------------------------------------------------------- projection map */

  const MAP_W = 260, MAP_H = 200, MAP_PAD = 26;
  const mapX = function (rot) { return MAP_PAD + (rot + ROT_LIMIT) / (ROT_LIMIT * 2) * (MAP_W - MAP_PAD * 2); };
  const mapY = function (tilt) { return MAP_PAD + (TILT_LIMIT - tilt) / (TILT_LIMIT * 2) * (MAP_H - MAP_PAD * 2); };

  function mapHTML(target) {
    let grid = "";
    for (let r = -ROT_LIMIT; r <= ROT_LIMIT; r += 15) grid += '<line class="cath-map-grid" x1="' + mapX(r).toFixed(1) + '" y1="' + MAP_PAD + '" x2="' + mapX(r).toFixed(1) + '" y2="' + (MAP_H - MAP_PAD) + '"/>';
    for (let t = -TILT_LIMIT; t <= TILT_LIMIT; t += 10) grid += '<line class="cath-map-grid" x1="' + MAP_PAD + '" y1="' + mapY(t).toFixed(1) + '" x2="' + (MAP_W - MAP_PAD) + '" y2="' + mapY(t).toFixed(1) + '"/>';
    const marks = platesFor(target).map(function (p) {
      const x = mapX(p.rot).toFixed(1), y = mapY(p.tilt).toFixed(1);
      return '<g class="cath-map-target" data-map-plate="' + p.id + '">' +
        '<rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="10" height="10" transform="rotate(45 ' + x + ' ' + y + ')"/>' +
        '<text x="' + x + '" y="' + (y - 9) + '">' + esc(p.name) + '</text></g>';
    }).join("");
    return '<svg class="cath-map" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '" role="img" aria-label="Projection map of the named views for this injection">' +
      grid +
      '<line class="cath-map-axis" x1="' + MAP_PAD + '" y1="' + mapY(0).toFixed(1) + '" x2="' + (MAP_W - MAP_PAD) + '" y2="' + mapY(0).toFixed(1) + '"/>' +
      '<line class="cath-map-axis" x1="' + mapX(0).toFixed(1) + '" y1="' + MAP_PAD + '" x2="' + mapX(0).toFixed(1) + '" y2="' + (MAP_H - MAP_PAD) + '"/>' +
      '<text class="cath-map-axis-label" x="' + MAP_PAD + '" y="' + (MAP_H - 8) + '">RAO</text>' +
      '<text class="cath-map-axis-label end" x="' + (MAP_W - MAP_PAD) + '" y="' + (MAP_H - 8) + '">LAO</text>' +
      '<text class="cath-map-axis-label mid" x="' + mapX(0).toFixed(1) + '" y="14">CRANIAL</text>' +
      '<text class="cath-map-axis-label mid" x="' + mapX(0).toFixed(1) + '" y="' + (MAP_H - 8) + '">CAUDAL</text>' +
      marks +
      '<circle class="cath-map-you" data-map-you cx="' + mapX(0) + '" cy="' + mapY(0) + '" r="5"/>' +
    '</svg>';
  }

  /* --------------------------------------------------------------- the lab */

  window.CSLab.register({
    id: "cath-projections",
    code: "IMG 01",
    title: "Cath Lab Projections & C-arm Geometry",
    category: "Catheter imaging",
    minutes: 30,
    linkedDays: [5],
    subtitle: "Drive the C-arm around a patient on the table across both angulation axes, lock each named projection, and read what every view opens and what it hides before you commit to a target.",
    objectives: [
      "State what rotation and tilt each do to the coronary tree: RAO/LAO changes overlap, cranial/caudal changes foreshortening.",
      "Reach every standard left-system, right-system and ventriculographic projection from the two angulation axes alone.",
      "Name the structure each named view is acquired to answer, and the structure it deliberately sacrifices.",
      "Identify the named vessels and ventricular walls on a real frame in each projection.",
      "Explain why a single flat projection cannot settle a distal bifurcation or a left-main bifurcation."
    ],
    sourceSections: [
      "Sachdev S, Omar B, Awan GM, Eyrich G. Coronary Angiography: Basic Views. Cardiofel Newslet 2018;1(5):27–38",
      "Angiography module ch. 4 Projection Geometry and View Selection",
      "Angiography module ch. 5–6 Left-system and right-system labs"
    ],
    teach: {
      concept: "A coronary angiogram is a shadow, and every shadow depends on where you stand. The C-arm has exactly two degrees of freedom: it rotates around the patient (RAO to LAO) and it tilts along the head-to-foot axis (caudal to cranial). Rotation decides which vessels overlap each other; tilt decides which vessels are foreshortened into a stump. A named view is not a ritual — it is a question asked of the anatomy. The spider view exists to open the left-main bifurcation; the AP-LAO cranial RCA view exists to open the crux; the LAO cranial left view exists to peel the diagonals off the LAD. Choose the view that answers your question, and accept what that view throws away.",
      how: "Pick an injection, then drag either C-arm — or focus it and drive it with the arrow keys — until both axes fall inside a named view's lock zone and the real frame opens on the film. Read the note that says what the view buys and what it costs. Turn the labels on to check your vessel identification, then run the vessel quiz on the frame. Work the projection drills: each gives you a clinical question and you must reach the view that answers it.",
      equations: [
        "Rotation (RAO ↔ LAO) → which vessels overlap",
        "Tilt (caudal ↔ cranial) → which vessels foreshorten",
        "View = the question you are asking the anatomy"
      ]
    },

    /* Exposed for tools/test-cath-projections.js, which checks that every plate
       file exists and that no two views of one injection overlap their lock
       zones — the way the cannulation lab exposes its presets. */
    plates: PLATES,
    targets: TARGETS,
    drills: DRILLS,
    lockDegrees: LOCK,
    assetRoot: ASSETS,

    render: function (ui) {
      const state = {
        target: "lca",
        rot: 0,
        tilt: 0,
        locked: null,          /* plate id currently open, or null */
        labels: false,
        quiz: null,            /* {plate, answer, options, asked} while a question is live */
        quizScore: 0, quizAsked: 0, quizSeen: {},
        drill: 0, drillScore: 0, drillDone: false, drillMiss: false
      };

      const body = [
        '<div class="cath-primer">',
          '<span class="eyebrow">TWO AXES, ONE SHADOW</span>',
          '<h2>Rotation changes overlap. Tilt changes foreshortening.</h2>',
          '<p>The C-arm has two degrees of freedom and nothing else. Everything a named projection buys you — an open left main, a separated crux, an elongated LAD — comes from combining those two angles, and every one of them sacrifices something in exchange. Drive the gantry until a view locks, then read what you gained and what you gave up.</p>',
        '</div>',
        '<div class="cath-workbench">',
          '<aside class="cath-console" aria-label="C-arm positioning">',
            '<div class="cath-console-head"><span>C-ARM</span><b>Position the detector</b></div>',
            rotRig(),
            tiltRig(),
            '<button type="button" class="cath-reset" data-cath-reset>Return to AP straight</button>',
          '</aside>',
          '<section class="cath-stage">',
            '<div class="cath-toolbar">',
              '<div class="cath-targets" role="group" aria-label="Injection">',
                TARGETS.map(function (t) { return '<button type="button" class="cath-chip" data-target="' + t.id + '" aria-pressed="' + (t.id === "lca") + '">' + esc(t.label) + '</button>'; }).join(""),
              '</div>',
              '<div class="cath-toolbar-actions">',
                '<button type="button" class="cath-toggle" data-cath-labels aria-pressed="false">Show labels</button>',
                '<button type="button" class="cath-toggle" data-cath-quiz>Quiz me</button>',
              '</div>',
            '</div>',
            '<div class="cath-film" data-cath-film></div>',
            '<div class="cath-status" data-cath-status aria-live="polite"></div>',
          '</section>',
        '</div>',
        '<section class="cath-drills card">',
          '<div class="cath-drill-head"><div><span class="eyebrow">PROJECTION DRILLS</span><h3>Reach the view that answers the question</h3></div><div class="cath-drill-score"><strong data-drill-score>0</strong><span>/ ' + (DRILL_TOTAL + QUIZ_TOTAL) + ' points</span></div></div>',
          '<div data-cath-drill></div>',
        '</section>'
      ].join("");

      ui.main().innerHTML = ui.frame(ui.lab, body);

      const root = ui.main();
      const film = root.querySelector("[data-cath-film]");
      const status = root.querySelector("[data-cath-status]");
      const drillHost = root.querySelector("[data-cath-drill]");
      const scoreEl = root.querySelector("[data-drill-score]");
      const labelBtn = root.querySelector("[data-cath-labels]");
      const quizBtn = root.querySelector("[data-cath-quiz]");

      /* ------------------------------------------------------- view solving */

      function matchPlate() {
        const candidates = platesFor(state.target).filter(function (p) {
          return Math.abs(p.rot - state.rot) <= LOCK && Math.abs(p.tilt - state.tilt) <= LOCK;
        });
        if (!candidates.length) return null;
        return candidates.sort(function (a, b) {
          return (Math.abs(a.rot - state.rot) + Math.abs(a.tilt - state.tilt)) - (Math.abs(b.rot - state.rot) + Math.abs(b.tilt - state.tilt));
        })[0];
      }

      function detentFor(axis, value) {
        let best = null, bestGap = DETENT + 0.001;
        platesFor(state.target).forEach(function (p) {
          const target = axis === "rot" ? p.rot : p.tilt;
          const gap = Math.abs(target - value);
          if (gap < bestGap) { bestGap = gap; best = target; }
        });
        return best === null ? value : best;
      }

      /* ------------------------------------------------------------ drawing */

      function paintGantries() {
        ["rot", "tilt"].forEach(function (axis) {
          const value = axis === "rot" ? state.rot : state.tilt;
          const group = root.querySelector('[data-gantry="' + axis + '"]');
          if (!group) return;
          /* SVG rotate() is clockwise: LAO swings the detector to the image
             right, cranial swings it to the image left. */
          group.setAttribute("transform", "rotate(" + (axis === "rot" ? value : -value) + " " + CX + " " + CY + ")");
          group.setAttribute("aria-valuenow", value);
          group.setAttribute("aria-valuetext", axisText(axis));
          const read = root.querySelector('[data-read="' + axis + '"]');
          if (read) read.textContent = axisText(axis);
        });
      }

      function axisText(axis) {
        const word = axis === "rot" ? rotWord(state.rot) : tiltWord(state.tilt);
        const plate = state.locked ? plateById(state.locked) : null;
        return plate ? word + " — locked, " + plate.name : word;
      }

      function paintDetents() {
        ["rot", "tilt"].forEach(function (axis) {
          const host = root.querySelector('[data-detents="' + axis + '"]');
          if (!host) return;
          const seen = {};
          host.innerHTML = platesFor(state.target).map(function (p) {
            const a = axis === "rot" ? p.rot : p.tilt;
            if (seen[a]) return "";
            seen[a] = 1;
            const deg = (axis === "rot" ? a : -a) * Math.PI / 180;
            const x = CX + Math.sin(deg) * 104, y = CY - Math.cos(deg) * 104;
            const tour = window.StaffTour?.state();
            const target = tour?.stop === "carm" && tour.phase === "task" ? (tour.task.spider ? (axis === "rot" ? 40 : 25) : (axis === "rot" ? 45 : -25)) : null;
            return '<rect class="cath-detent' + (a === target ? ' staff-carm-target' : '') + '" x="' + (x - 3.5).toFixed(1) + '" y="' + (y - 3.5).toFixed(1) + '" width="7" height="7" transform="rotate(45 ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
          }).join("");
        });
      }

      function labelsHTML(plate) {
        const lines = plate.labels.map(function (l) {
          return '<line x1="' + l.lx + '" y1="' + l.ly + '" x2="' + l.x + '" y2="' + l.y + '" vector-effect="non-scaling-stroke"/>';
        }).join("");
        const nodes = plate.labels.map(function (l, i) {
          const caption = state.quiz ? String(i + 1) : l.t;
          return '<span class="cath-dot' + (state.quiz && state.quiz.index === i ? " asked" : "") + '" style="left:' + l.x + '%;top:' + l.y + '%"></span>' +
            '<span class="cath-cap' + (state.quiz ? " numbered" : "") + '" style="left:' + l.lx + '%;top:' + l.ly + '%">' + esc(caption) + '</span>';
        }).join("");
        return '<div class="cath-labels" aria-hidden="true">' +
          '<svg viewBox="0 0 100 100" preserveAspectRatio="none">' + lines + '</svg>' + nodes + '</div>';
      }

      function paintFilm() {
        const plate = state.locked ? plateById(state.locked) : null;
        if (!plate) {
          film.innerHTML = '<div class="cath-film-empty">' + mapHTML(state.target) +
            '<p><b>No view locked.</b> Keep moving the gantry — the diamonds mark the named projections for this injection.</p></div>';
          paintYou();
          return;
        }
        const showLabels = state.labels || !!state.quiz;
        film.innerHTML = '<figure class="cath-plate">' +
            '<div class="cath-plate-stage" style="aspect-ratio:' + plate.w + '/' + plate.h + '">' +
              '<img src="' + ASSETS + plate.file + '" alt="' + esc(targetById(plate.target).injection + ", " + plate.name + " projection") + '" loading="lazy">' +
              (showLabels ? labelsHTML(plate) : "") +
            '</div>' +
            '<figcaption><b>' + esc(targetById(plate.target).injection) + ' · ' + esc(plate.name) + '</b><span>' + esc(plate.note) + '</span></figcaption>' +
          '</figure>';
      }

      function paintYou() {
        const you = film.querySelector("[data-map-you]");
        if (!you) return;
        you.setAttribute("cx", mapX(state.rot).toFixed(1));
        you.setAttribute("cy", mapY(state.tilt).toFixed(1));
      }

      function paintStatus() {
        const plate = state.locked ? plateById(state.locked) : null;
        status.innerHTML = '<span class="cath-status-angles">' + esc(rotWord(state.rot)) + ' · ' + esc(tiltWord(state.tilt)) + '</span>' +
          (plate
            ? '<span class="cath-status-lock locked">LOCKED — ' + esc(plate.name) + '</span>'
            : '<span class="cath-status-lock">not locked</span>');
      }

      /* ------------------------------------------------------------- update */

      function update(force) {
        ui.publish({"Rotation (degrees)":state.rot,"Cranial/caudal tilt (degrees)":state.tilt,"Target":state.target});
        const found = matchPlate();
        const id = found ? found.id : null;
        const changed = force === true || id !== state.locked;
        state.locked = id;
        paintGantries();
        paintStatus();
        if (changed) {
          /* Rebuilding the film swaps the <img>, so only do it when the open
             plate actually changes — otherwise every pointermove would reload. */
          if (state.quiz && (!id || state.quiz.plate !== id)) state.quiz = null;
          paintFilm();
          syncQuizButton();
          if (id) checkDrill(id);
        } else {
          paintYou();
        }
      }

      function setAxis(axis, value, snap) {
        const limit = axis === "rot" ? ROT_LIMIT : TILT_LIMIT;
        let next = clamp(Math.round(value), -limit, limit);
        if (snap) next = clamp(detentFor(axis, next), -limit, limit);
        if (axis === "rot") state.rot = next; else state.tilt = next;
        const previous = state.locked;
        update();
        if (state.locked && state.locked !== previous) {
          window.StaffTour?.record("carm:locked", { id: state.locked });
          paintDetents();
        }
      }

      /* ---------------------------------------------------------- dragging */

      function bindRig(axis) {
        const svg = root.querySelector('[data-rig-svg="' + axis + '"]');
        const group = root.querySelector('[data-gantry="' + axis + '"]');
        if (!svg || !group) return;
        const limit = axis === "rot" ? ROT_LIMIT : TILT_LIMIT;
        let dragging = false;

        function angleAt(event) {
          const rect = svg.getBoundingClientRect();
          if (!rect.width || !rect.height) return null;
          const ux = (event.clientX - rect.left) / rect.width * VIEW_W - CX;
          const uy = (event.clientY - rect.top) / rect.height * VIEW_H - CY;
          if (Math.abs(ux) < 4 && Math.abs(uy) < 4) return null;
          /* Measured from straight up; positive is the direction the detector
             travels for a positive value on this axis. */
          let a = Math.atan2(axis === "rot" ? ux : -ux, -uy) * 180 / Math.PI;
          /* Grabbing the tube below the table drives the same axis. */
          if (a > 90) a -= 180; else if (a < -90) a += 180;
          return clamp(a, -limit, limit);
        }

        function onDown(event) {
          const a = angleAt(event);
          if (a === null) return;
          dragging = true;
          svg.setPointerCapture(event.pointerId);
          svg.classList.add("dragging");
          event.preventDefault();
          setAxis(axis, a, false);
        }
        function onMove(event) {
          if (!dragging) return;
          const a = angleAt(event);
          if (a !== null) setAxis(axis, a, false);
        }
        function onUp(event) {
          if (!dragging) return;
          dragging = false;
          if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
          svg.classList.remove("dragging");
          /* Snap on release so a locked view does not drift a degree at a time. */
          setAxis(axis, axis === "rot" ? state.rot : state.tilt, true);
        }
        function onWheel(event) {
          event.preventDefault();
          setAxis(axis, (axis === "rot" ? state.rot : state.tilt) + (event.deltaY < 0 ? 1 : -1), false);
        }
        function onKey(event) {
          const current = axis === "rot" ? state.rot : state.tilt;
          let next = current;
          if (event.key === "ArrowUp" || event.key === "ArrowRight") next = current + 1;
          else if (event.key === "ArrowDown" || event.key === "ArrowLeft") next = current - 1;
          else if (event.key === "PageUp") next = current + 10;
          else if (event.key === "PageDown") next = current - 10;
          else if (event.key === "Home") next = -limit;
          else if (event.key === "End") next = limit;
          else return;
          event.preventDefault();
          setAxis(axis, next, event.key === "PageUp" || event.key === "PageDown");
        }

        svg.addEventListener("pointerdown", onDown);
        svg.addEventListener("pointermove", onMove);
        svg.addEventListener("pointerup", onUp);
        svg.addEventListener("pointercancel", onUp);
        svg.addEventListener("wheel", onWheel, { passive: false });
        group.addEventListener("keydown", onKey);
        ui.cleanup(function () {
          svg.removeEventListener("pointerdown", onDown);
          svg.removeEventListener("pointermove", onMove);
          svg.removeEventListener("pointerup", onUp);
          svg.removeEventListener("pointercancel", onUp);
          svg.removeEventListener("wheel", onWheel);
          group.removeEventListener("keydown", onKey);
        });
      }

      /* ------------------------------------------------------- vessel quiz */

      function syncQuizButton() {
        quizBtn.disabled = !state.locked || state.quizAsked >= QUIZ_TOTAL;
        quizBtn.textContent = state.quizAsked >= QUIZ_TOTAL ? "Quiz complete" : state.quiz ? "Cancel quiz" : "Quiz me";
      }

      function startQuiz() {
        const plate = state.locked ? plateById(state.locked) : null;
        if (!plate || state.quizAsked >= QUIZ_TOTAL) return;
        const seen = state.quizSeen[plate.id] || [];
        const pool = plate.labels.map(function (l, i) { return i; }).filter(function (i) { return seen.indexOf(i) === -1; });
        const choice = (pool.length ? pool : plate.labels.map(function (l, i) { return i; }))[Math.floor(Math.random() * (pool.length || plate.labels.length))];
        const answer = plate.labels[choice].t;
        const vocab = targetById(plate.target).vocab.filter(function (v) { return v !== answer; });
        const options = [answer];
        while (options.length < 4 && vocab.length) options.push(vocab.splice(Math.floor(Math.random() * vocab.length), 1)[0]);
        options.sort(function () { return Math.random() - 0.5; });
        state.quiz = { plate: plate.id, index: choice, answer: answer, options: options, resolved: false };
        state.quizSeen[plate.id] = seen.concat([choice]);
        paintFilm();
        paintQuizPrompt();
        syncQuizButton();
      }

      function paintQuizPrompt() {
        if (!state.quiz) { drawDrill(); return; }
        const q = state.quiz;
        drillHost.innerHTML = '<div class="cath-quiz">' +
          '<p class="cath-quiz-stem">On this frame, which structure is marked <b>' + (q.index + 1) + '</b>?</p>' +
          '<div class="cath-quiz-options">' + q.options.map(function (o) {
            return '<button type="button" data-quiz-option="' + esc(o) + '">' + esc(o) + (GLOSSARY[o] ? ' <em>' + esc(GLOSSARY[o]) + '</em>' : "") + '</button>';
          }).join("") + '</div>' +
          '<div class="cath-quiz-feedback" data-quiz-feedback></div>' +
        '</div>';
        drillHost.querySelectorAll("[data-quiz-option]").forEach(function (button) {
          button.addEventListener("click", function () {
            if (state.quiz.resolved) return;
            state.quiz.resolved = true;
            const picked = button.dataset.quizOption, right = picked === q.answer;
            state.quizAsked++;
            if (right) state.quizScore++;
            drillHost.querySelectorAll("[data-quiz-option]").forEach(function (b) {
              b.disabled = true;
              if (b.dataset.quizOption === q.answer) b.classList.add("right");
              else if (b === button) b.classList.add("wrong");
            });
            const full = GLOSSARY[q.answer] ? q.answer + " — " + GLOSSARY[q.answer] : q.answer;
            drillHost.querySelector("[data-quiz-feedback]").innerHTML =
              '<b class="' + (right ? "ok" : "no") + '">' + (right ? "Correct." : "Not this one.") + '</b> Marker ' + (q.index + 1) + ' is the ' + esc(full) + '.' +
              '<button type="button" class="cath-quiz-next" data-quiz-next>' + (state.quizAsked >= QUIZ_TOTAL ? "Back to drills" : "Next question") + '</button>';
            paintScore();
            drillHost.querySelector("[data-quiz-next]").addEventListener("click", function () {
              state.quiz = null;
              paintFilm();
              syncQuizButton();
              if (state.quizAsked >= QUIZ_TOTAL) drawDrill(); else startQuiz();
            });
          });
        });
      }

      /* ------------------------------------------------------------ drills */

      function checkDrill(lockedId) {
        if (state.drillDone || state.quiz) return;
        const task = DRILLS[state.drill];
        if (!task || task.target !== state.target) return;
        if (lockedId === task.plate) {
          /* The point is for naming the answering view, not for finding it by
             sweeping — so a wrong lock on the way there costs the mark. */
          const clean = !state.drillMiss;
          if (clean) state.drillScore++;
          state.drill++;
          state.drillMiss = false;
          if (state.drill >= DRILLS.length) state.drillDone = true;
          paintScore();
          drawDrill(clean ? "clean" : "detour");
        } else if (lockedId) {
          state.drillMiss = true;
          drawDrill(false, plateById(lockedId));
        }
      }

      function drawDrill(solved, wrongPlate) {
        if (state.quiz) return;
        if (state.drillDone) {
          const total = state.drillScore + state.quizScore;
          drillHost.innerHTML = '<div class="cath-drill-done"><b>Drills complete — ' + state.drillScore + '/' + DRILL_TOTAL + ' reached first time.</b>' +
            '<p>' + (state.quizAsked >= QUIZ_TOTAL
              ? "You have finished both tracks. Lock any view again to review the frames and their trade-offs."
              : "Lock a view and use <b>Quiz me</b> to finish the " + (QUIZ_TOTAL - state.quizAsked) + " remaining vessel-identification points.") + '</p>' +
            '<button type="button" class="cath-quiz-next" data-drill-reset>Repeat the drills</button></div>';
          drillHost.querySelector("[data-drill-reset]").addEventListener("click", function () {
            state.drill = 0; state.drillScore = 0; state.drillDone = false; state.drillMiss = false;
            paintScore(); drawDrill();
          });
          ui.complete("cath-projections", total, DRILL_TOTAL + QUIZ_TOTAL);
          return;
        }
        const task = DRILLS[state.drill];
        const solvedPlate = solved ? plateById(DRILLS[state.drill - 1].plate) : null;
        const wrongTarget = task.target !== state.target;
        drillHost.innerHTML = '<div class="cath-drill">' +
          '<div class="cath-drill-progress"><span>Drill ' + (state.drill + 1) + ' of ' + DRILL_TOTAL + '</span><i><em style="width:' + Math.round(100 * state.drill / DRILL_TOTAL) + '%"></em></i></div>' +
          '<p class="cath-drill-goal">' + esc(task.goal) + '</p>' +
          '<p class="cath-drill-hint">' + (wrongTarget
            ? 'Switch the injection to <b>' + esc(targetById(task.target).label) + '</b>, then drive both axes until the view locks.'
            : 'Drive both axes until the answering view locks on the film.') + '</p>' +
          (solved === "clean" ? '<p class="cath-drill-flash ok">Locked — that was the ' + esc(solvedPlate.name) + ' view. Point scored.</p>' : "") +
          (solved === "detour" ? '<p class="cath-drill-flash no">Locked — that was the ' + esc(solvedPlate.name) + ' view, but you opened a wrong view first, so no point this time.</p>' : "") +
          (wrongPlate ? '<p class="cath-drill-flash no">' + esc(wrongPlate.name) + ' is locked, but it does not answer this question. Keep moving.</p>' : "") +
        '</div>';
      }

      function paintScore() {
        scoreEl.textContent = String(state.drillScore + state.quizScore);
        if (state.drillDone || state.quizAsked >= QUIZ_TOTAL) {
          ui.complete("cath-projections", state.drillScore + state.quizScore, DRILL_TOTAL + QUIZ_TOTAL);
        }
      }

      /* ------------------------------------------------------------ wiring */

      root.querySelectorAll("[data-target]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.target = button.dataset.target;
          state.quiz = null;
          root.querySelectorAll("[data-target]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === button)); });
          paintDetents();
          update(true);   /* the new injection always needs a fresh film */
          drawDrill();
        });
      });

      labelBtn.addEventListener("click", function () {
        state.labels = !state.labels;
        labelBtn.setAttribute("aria-pressed", String(state.labels));
        labelBtn.textContent = state.labels ? "Hide labels" : "Show labels";
        paintFilm();
      });

      quizBtn.addEventListener("click", function () {
        if (state.quiz) { state.quiz = null; paintFilm(); syncQuizButton(); drawDrill(); return; }
        startQuiz();
      });

      root.querySelector("[data-cath-reset]").addEventListener("click", function () {
        state.rot = 0; state.tilt = 0;
        update();
      });

      bindRig("rot");
      bindRig("tilt");
      window.CathTour = {
        root: root,
        refreshTourTargets: paintDetents,
        position: function (file) {
          const targetPlate = PLATES.find(function (item) { return item.file === file; });
          if (!targetPlate) return false;
          if (state.target !== targetPlate.target) {
            const choice = root.querySelector('[data-target="' + targetPlate.target + '"]');
            if (choice) choice.click();
          }
          state.rot = targetPlate.rot;
          state.tilt = targetPlate.tilt;
          update(true);
          return true;
        }
      };
      ui.cleanup(function () { if (window.CathTour && window.CathTour.root === root) delete window.CathTour; });
      paintDetents();
      update(true);
      drawDrill();
    }
  });
})();
