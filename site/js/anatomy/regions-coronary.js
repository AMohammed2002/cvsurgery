/* Cardiac Anatomy — Coronary artery and vein regions */
"use strict";
if (!window.ANATOMY.regions) window.ANATOMY.regions = [];
window.ANATOMY.regions.push(

  {
    id: "cor-leftmain",
    category: "coronary",
    title: "Left Main Coronary Artery",
    short: "Origin, course and bifurcation",
    blurb: "<p>The <b>left main coronary artery (LMCA)</b> arises from the left coronary ostium in the left coronary sinus of Valsalva and is one of the most surgically critical vessels in the heart.</p>",
    diagram: "ADG.coronary_overview",
    sections: [
      {
        heading: "Origin and Course",
        html: "<p>The LMCA originates from the <b>left coronary ostium</b>, which sits just above the left aortic valve leaflet within the left coronary sinus of Valsalva. It courses <b>anteriorly and inferiorly</b>, passing between the pulmonary trunk anteriorly and the left atrial appendage posteriorly, before bifurcating.</p><p>It typically measures <b>10–40 mm</b> in length. In rare cases it may be absent, with separate LAD and circumflex ostia in the left sinus.</p>"
      },
      {
        heading: "Bifurcation and Variants",
        html: "<p>The LMCA typically <b>bifurcates</b> into the <b>left anterior descending (LAD)</b> and <b>circumflex (Cx)</b> arteries. In some patients it <b>trifurcates</b>, giving rise to an additional <b>ramus intermedius (intermediate branch)</b>, which supplies the lateral LV wall like an obtuse marginal or diagonal artery.</p><ul><li>No branches normally arise before bifurcation.</li><li>Disease at the LMCA ostium is particularly dangerous given the territory at risk.</li></ul>"
      }
    ],
    pearls: [
      "The LMCA passes between the pulmonary trunk and left atrial appendage — important during valve surgery to avoid injury.",
      "An absent left main = two separate ostia in the left coronary sinus.",
      "Trifurcation with a ramus intermedius occurs in a significant minority of patients."
    ]
  },

  {
    id: "cor-lad",
    category: "coronary",
    title: "Left Anterior Descending Artery",
    short: "LAD segments, diagonal and septal branches",
    blurb: "<p>The <b>LAD (anterior interventricular artery)</b> is the most important coronary artery for LV systolic function, supplying the anterior wall, apex and the anterior two-thirds of the interventricular septum.</p>",
    sections: [
      {
        heading: "Course and Segments",
        html: "<p>The LAD courses <b>anteriorly and inferiorly</b> in the <b>anterior interventricular groove</b> toward the cardiac apex. It is divided into three segments:</p><ul><li><b>Proximal third</b>: origin to the first septal perforator</li><li><b>Middle third</b>: first septal to last diagonal artery</li><li><b>Distal third</b>: last diagonal to the apex</li></ul><p>Occasionally the LAD wraps around the apex to supply part of the posterior interventricular groove, replacing or supplementing the PDA (wrap-around LAD, left-dominant variant).</p>"
      },
      {
        heading: "Diagonal Branches",
        html: "<p>Usually <b>2–6 diagonal branches</b> arise from the LAD and course obliquely across the free wall to supply the <b>anterolateral LV wall</b>. They are key bypass targets in mid-LAD disease.</p>"
      },
      {
        heading: "Septal Perforator Arteries",
        html: "<p>Usually <b>3–5 septal perforators</b> arise perpendicularly from the LAD and supply the <b>anterior two-thirds of the interventricular septum</b>. The <b>first septal perforator</b> is the largest and runs toward the medial papillary muscle of the tricuspid valve.</p><p>In <b>4%</b> of patients the LAD bifurcates proximally, continuing as two parallel equal-sized vessels down the groove (dual LAD variant).</p>"
      }
    ],
    pearls: [
      "Proximal LAD disease carries the highest risk — largest territory at stake.",
      "The first septal perforator is at risk during the Ross procedure (lies under RVOT/pulmonary valve).",
      "LAD = anterior interventricular artery — synonymous terms used interchangeably."
    ]
  },

  {
    id: "cor-circumflex",
    category: "coronary",
    title: "Circumflex Coronary Artery",
    short: "Course, obtuse marginals and dominance",
    blurb: "<p>The <b>circumflex artery (Cx)</b> courses in the left atrioventricular groove and supplies the lateral LV wall, left atrium and (in left-dominant systems) the inferior LV and AV node.</p>",
    sections: [
      {
        heading: "Course and Termination",
        html: "<p>The Cx runs in the <b>left atrioventricular groove</b>. In <b>85–90%</b> of patients (right-dominant anatomy) it terminates before reaching the posterior interventricular groove. In <b>10–15%</b> (left-dominant) it continues as the <b>posterior descending artery (PDA)</b>.</p>"
      },
      {
        heading: "Branches",
        html: "<ul><li><b>Obtuse marginal (OM) branches</b>: supply the lateral LV wall including the anterolateral papillary muscle. Key bypass targets.</li><li><b>Left atrial branches</b></li><li><b>SA nodal artery</b>: from Cx in 45% of patients (from RCA in 55%)</li><li><b>AV nodal artery</b>: from Cx in 10–15% (from RCA in 85–90%)</li><li><b>Posterior descending artery</b>: from Cx in 10–15% (left-dominant)</li></ul>"
      }
    ],
    pearls: [
      "Left dominance is slightly more common in males and patients with a bicuspid aortic valve.",
      "In left-dominant patients, circumflex occlusion causes AV block as well as posterior MI.",
      "OM branches are the principal surgical targets in circumflex territory disease."
    ]
  },

  {
    id: "cor-rca",
    category: "coronary",
    title: "Right Coronary Artery",
    short: "Course, branches and dominance",
    blurb: "<p>The <b>RCA</b> supplies the right heart, the inferior LV (in right-dominant systems) and the SA and AV nodes in the majority of patients.</p>",
    sections: [
      {
        heading: "Course",
        html: "<p>The RCA originates from the <b>right coronary ostium</b> in the right coronary sinus. It courses <b>anteriorly and laterally</b> into the <b>right atrioventricular groove</b>, descending inferiorly to the <b>acute margin of the RV</b>. After the acute margin it continues posteriorly to the <b>crux cordis</b>, where it gives off the AV nodal artery, then terminates as the <b>PDA</b> and <b>posterior LV artery</b>.</p>"
      },
      {
        heading: "Branches",
        html: "<ul><li><b>Infundibular (conus) branch</b>: first branch, courses over the RVOT</li><li><b>SA nodal artery</b>: from RCA in 55% of patients</li><li><b>Acute marginal branch</b>: marks the right heart border</li><li><b>Anterior right ventricular branches</b></li><li><b>AV nodal artery</b>: from RCA in 85–90%; arises at the crux cordis</li><li><b>Posterior descending artery (PDA)</b>: in 85–90% (right-dominant)</li><li><b>Posterior LV artery</b>: supplies the posterior LV surface</li></ul>"
      },
      {
        heading: "Coronary Dominance",
        html: "<p>Dominance is defined by the artery from which the <b>PDA</b> originates. Right-dominant in <b>80–85%</b>, left-dominant in <b>10–15%</b>, codominant in ~<b>5%</b>. The PDA is the defining vessel because it supplies the AV node and posterior third of the septum.</p>"
      }
    ],
    pearls: [
      "RCA occlusion = inferior MI plus potential AV block (85-90%) and posteromedial PM rupture.",
      "The conus branch is often the first RCA branch — can be a collateral source to the LAD.",
      "Mnemonic for RCA branches: Some Important Arteries Are Very Pretty Little things."
    ]
  },

  {
    id: "cor-veins",
    category: "coronary",
    title: "Coronary Venous Drainage",
    short: "Coronary sinus, cardiac veins",
    blurb: "<p>Most myocardial venous blood drains into the <b>coronary sinus</b>, which empties into the right atrium. Some veins drain directly into cardiac chambers via anterior cardiac veins and Thebesian veins.</p>",
    sections: [
      {
        heading: "Coronary Sinus",
        html: "<p>The coronary sinus is a continuation of the <b>great cardiac vein</b>, running in the <b>left atrioventricular groove</b> alongside the circumflex artery. The transition is marked by the <b>valve of Vieussens</b> and the entry of the <b>oblique vein of the left atrium (vein of Marshall)</b> — an electrophysiologically important structure (AF triggers).</p><p>The coronary sinus ostium opens into the right atrium, guarded by the Thebesian valve.</p>"
      },
      {
        heading: "Cardiac Veins",
        html: "<ul><li><b>Great cardiac vein</b>: runs in the anterior interventricular groove alongside the LAD, then into the left AV groove alongside the Cx; drains to the coronary sinus</li><li><b>Middle cardiac vein</b>: runs in the posterior interventricular groove alongside the PDA; used for retrograde cardioplegia delivery</li><li><b>Small cardiac vein</b>: runs in the right AV groove alongside the RCA; drains to the right end of the coronary sinus</li><li><b>Anterior cardiac veins and Thebesian veins</b>: drain directly into the right atrium, bypassing the coronary sinus</li></ul>"
      }
    ],
    pearls: [
      "The middle cardiac vein is used for retrograde cardioplegia delivery via the coronary sinus.",
      "The vein of Marshall (oblique vein of LA) is a source of AF triggers — targeted in ablation.",
      "Thebesian veins are the reason retrograde cardioplegia does not perfectly protect all myocardium."
    ]
  }

);
