/* Cardiac Anatomy — Cardiac chambers and pericardium regions */
"use strict";
if (!window.ANATOMY.regions) window.ANATOMY.regions = [];
window.ANATOMY.regions.push(

  {
    id: "cham-pericardium",
    category: "chambers",
    title: "Pericardium & Pericardial Sinuses",
    short: "Layers, oblique and transverse sinuses",
    blurb: "<p>The <b>pericardium</b> is a fibroserous sac enclosing the heart and the proximal great vessels. Its sinuses are critical surgical landmarks during cardiac operations.</p>",
    sections: [
      {
        heading: "Layers",
        html: "<p>The pericardium has two components:</p><ul><li><b>Fibrous pericardium</b>: tough outer layer, fused to the central tendon of the diaphragm inferiorly and the great vessels superiorly</li><li><b>Serous pericardium</b>: has a parietal layer (adherent to the fibrous pericardium) and a visceral layer (adherent to the epicardium). The potential space between them is the <b>pericardial cavity</b>, normally containing <b>5–10 mL</b> of clear fluid secreted by mesothelial cells.</li></ul><p>More than 250 mL constitutes a pericardial effusion; over 1 L can cause tamponade depending on acuity of accumulation.</p>"
      },
      {
        heading: "Pericardial Sinuses",
        html: "<ul><li><b>Transverse sinus</b>: lies <b>behind the aorta and pulmonary trunk</b>, in front of the SVC and left atrial appendage. Used to pass a clamp around both great arteries together (relevant during cross-clamping).</li><li><b>Oblique sinus</b>: lies <b>posterior to the left atrium</b>, between the four pulmonary veins medially and the IVC. It is a cul-de-sac — a finger inserted cannot pass through.</li></ul>"
      }
    ],
    pearls: [
      "The transverse sinus is used to pass the aortic cross-clamp and to identify the aorta from the PA during re-do sternotomies.",
      "The oblique sinus is a blind pouch — blood can accumulate here after cardiac surgery.",
      "Referred shoulder-tip pain can occur with pericardial irritation via the phrenic nerve."
    ]
  },

  {
    id: "cham-atria",
    category: "chambers",
    title: "Atria & Interatrial Septum",
    short: "Right and left atria, fossa ovalis, atrial septum",
    blurb: "<p>The two atria receive venous return and deliver blood to the ventricles. The interatrial septum, the fossa ovalis, and the right atrial landmarks are fundamental to cannulation and valve surgery.</p>",
    sections: [
      {
        heading: "Right Atrium",
        html: "<p>The right atrium receives blood from the SVC superiorly, the IVC inferiorly, and the coronary sinus posteriorly. Key landmarks include the <b>crista terminalis</b> (a muscular ridge separating the smooth posterior wall from the trabeculated anterior wall), the <b>terminal groove (sulcus terminalis)</b> externally, and the <b>right atrial appendage</b>. The SA node lies just lateral to the SVC-RA junction at the superior end of the sulcus terminalis.</p>"
      },
      {
        heading: "Interatrial Septum and Fossa Ovalis",
        html: "<p>The interatrial septum features the <b>fossa ovalis</b> — the adult remnant of the foramen ovale, representing the site of the ostium secundum. A <b>patent foramen ovale (PFO)</b> persists in ~25% of the population. The <b>septum primum</b> and <b>septum secundum</b> form during embryology.</p>"
      },
      {
        heading: "Left Atrium",
        html: "<p>The left atrium is the most posterior cardiac chamber. It receives the four pulmonary veins (two on each side) and leads to the mitral valve via the mitral annulus. The left atrial appendage (LAA) is a common source of thrombus in atrial fibrillation.</p>"
      }
    ],
    pearls: [
      "The non-coronary cusp of the aortic valve abuts the interatrial septum — disease here can affect the AV node.",
      "PFO is present in ~25% of the population and is a route for paradoxical embolism.",
      "SVC and IVC cannulas are placed to encircle the SVC above and IVC below the right atrium for cardiopulmonary bypass."
    ]
  },

  {
    id: "cham-ventricles",
    category: "chambers",
    title: "Ventricles & Ventricular Septum",
    short: "LV, RV, muscular and membranous septum",
    blurb: "<p>The ventricles are the main pumping chambers. The ventricular septum separates them and carries the conduction bundle. Understanding its anatomy is critical in VSD surgery and aortic valve procedures.</p>",
    sections: [
      {
        heading: "Left Ventricle",
        html: "<p>The LV is ellipsoidal with thick muscular walls (8–12 mm). It has an inflow tract (mitral valve to apex) and an outflow tract (LVOT, below the aortic valve). The LVOT is bordered anteroseptally by the ventricular septum and posterolaterally by the anterior mitral valve leaflet — hence the term aortic-mitral continuity.</p>"
      },
      {
        heading: "Right Ventricle",
        html: "<p>The RV is crescentic in cross-section, wrapping around the LV. It has a trabeculated inflow tract (tricuspid valve to apex) and a smooth infundibulum (RVOT) leading to the pulmonary valve. The <b>moderator band (septomarginal trabeculation)</b> crosses the RV cavity carrying the right bundle branch to the anterior papillary muscle.</p>"
      },
      {
        heading: "Ventricular Septum",
        html: "<p>The septum has two parts:</p><ul><li><b>Muscular septum</b>: large, formed from the ventricular myocardium of both ventricles during embryogenesis</li><li><b>Membranous septum</b>: small, thin, superior portion; formed from the fusion of endocardial cushions and descending truncal cushions. The bundle of His penetrates the central fibrous body here. Perimembranous VSDs are the most common type.</li></ul>"
      }
    ],
    pearls: [
      "The bundle of His lies on the crest of the muscular septum just below the commissure between the right and non-coronary cusps of the aortic valve.",
      "The moderator band carries the right bundle branch — injury during RV surgery risks RBBB.",
      "The membranous septum lies just superior to the triangle of Koch."
    ]
  },

  {
    id: "cham-embryology",
    category: "chambers",
    title: "Cardiac Embryology",
    short: "Heart tube, septation, endocardial cushions",
    blurb: "<p>The heart is the first organ to form and function in the embryo. Understanding cardiac embryology explains the basis of congenital heart defects encountered in cardiac surgery.</p>",
    sections: [
      {
        heading: "Heart Tube Formation",
        html: "<p>The heart tube forms from fusion of the two <b>ventral aortae</b>, originating from the mesodermal layer of the yolk sac. After longitudinal growth and rotation, it divides into three regions: the <b>conus truncus</b> (gives rise to the aorta and pulmonary artery), the <b>bulbus cordis</b>, and the <b>sinus venosus</b>.</p>"
      },
      {
        heading: "Septation",
        html: "<p><b>Endocardial cushions</b> partition the atrioventricular canal, forming the mitral and tricuspid valves. Endocardial cushion defects cause AV septal defects (AVSDs).</p><p>The <b>atrial septum</b> forms from the septum primum and septum secundum, leaving a small opening — the foramen ovale — which normally closes after birth. The <b>muscular ventricular septum</b> forms from ventricular myocardium; the <b>membranous septum</b> from endocardial cushions and descending truncal cushions.</p>"
      }
    ],
    pearls: [
      "AVSDs arise from endocardial cushion defects — common in Down syndrome.",
      "Perimembranous VSDs are the most common VSD type, located at the membranous septum near the bundle of His.",
      "PFO results from incomplete fusion of septum primum and secundum after birth (~25% of the population)."
    ]
  }

);
