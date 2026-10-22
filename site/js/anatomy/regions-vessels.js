/* Cardiac Anatomy — Great vessels and surgical conduit regions */
"use strict";
if (!window.ANATOMY.regions) window.ANATOMY.regions = [];
window.ANATOMY.regions.push(

  {
    id: "ves-aorta",
    category: "vessels",
    title: "Thoracic Aorta",
    short: "Ascending aorta, arch, descending thoracic aorta",
    blurb: "<p>The <b>thoracic aorta</b> comprises the aortic root, ascending aorta, arch, and descending thoracic aorta. Knowledge of its branches and hiatal passage is essential for aortic surgery and cannulation strategy.</p>",
    sections: [
      {
        heading: "Descending Thoracic Aorta",
        html: "<p>The descending thoracic aorta commences just distal to the origin of the <b>left subclavian artery</b>, as a continuation of the aortic arch. It lies initially <b>to the left of the thoracic vertebrae</b>, gradually moving medially to lie anterior to the vertebral column as it descends. It terminates by passing through the <b>aortic hiatus at T12</b> alongside the thoracic duct and azygos vein, to continue as the abdominal aorta.</p><p>Key level mnemonics: IVC hiatus T8, oesophageal hiatus T10, aortic hiatus T12.</p>"
      },
      {
        heading: "Branches of the Descending Thoracic Aorta",
        html: "<ul><li>Pericardial branches</li><li><b>Bronchial arteries</b></li><li><b>Oesophageal branches</b></li><li>Mediastinal branches</li><li><b>Posterior intercostal arteries</b> (3rd–11th spaces arise directly from the descending aorta)</li><li>Subcostal arteries</li><li><b>Superior phrenic arteries</b></li></ul>"
      }
    ],
    pearls: [
      "Aortic hiatus T12 (aorta, azygos vein, thoracic duct) — the lowest of the three major diaphragmatic openings.",
      "The descending thoracic aorta lies to the left — relevant during left thoracotomy approach for descending aortic surgery.",
      "The isthmus (just distal to the left subclavian origin) is the commonest site for traumatic aortic rupture."
    ]
  },

  {
    id: "ves-femoral",
    category: "vessels",
    title: "Femoral Vessels",
    short: "Common femoral artery and vein, femoral sheath",
    blurb: "<p>The <b>femoral vessels</b> are the primary access site for intra-aortic balloon pump placement and femoral cardiopulmonary bypass cannulation. Precise knowledge of their anatomy reduces access complications.</p>",
    sections: [
      {
        heading: "Common Femoral Artery",
        html: "<p>The common femoral artery (CFA) is a continuation of the <b>external iliac artery</b>, commencing just beneath the <b>inguinal ligament</b>. It is located at the <b>mid-inguinal point</b> — halfway between the anterior superior iliac spine (ASIS) and the symphysis pubis. It gives off the <b>deep femoral artery (profunda femoris)</b> laterally, then continues as the superficial femoral artery. Femoral cannulation should be proximal to the profunda origin to allow adequate retrograde perfusion.</p>"
      },
      {
        heading: "Femoral Sheath Contents",
        html: "<p>Within the femoral sheath (from lateral to medial): <b>N</b>erve, <b>A</b>rtery, <b>V</b>ein, empty lymphatic compartment — NAVel. The femoral nerve lies lateral to the artery but <b>outside</b> the femoral sheath. The femoral vein lies <b>medial</b> to the artery.</p>"
      },
      {
        heading: "Common Femoral Vein",
        html: "<p>The common femoral vein forms from the confluence of the deep and superficial femoral veins and continues as the <b>external iliac vein</b> when it passes under the inguinal ligament. The long saphenous vein joins at the <b>saphenofemoral junction</b>, 3 cm inferior and 3 cm medial to the femoral arterial pulse.</p>"
      }
    ],
    pearls: [
      "Mid-inguinal point (CFA) = halfway between ASIS and symphysis pubis. Distinguish from mid-point of inguinal ligament (deep ring).",
      "IABP and femoral CPB cannulation should be proximal to the profunda origin.",
      "NAVel mnemonic: Nerve (lateral, outside sheath), Artery, Vein, empty compartment."
    ]
  },

  {
    id: "ves-saphenous",
    category: "vessels",
    title: "Saphenous Veins",
    short: "Long saphenous vein, short saphenous vein, harvest anatomy",
    blurb: "<p>The <b>long saphenous vein (LSV)</b> is the most commonly harvested conduit for coronary artery bypass grafting. Precise knowledge of its course prevents nerve injury and ensures a useful conduit.</p>",
    sections: [
      {
        heading: "Long Saphenous Vein",
        html: "<p>The LSV commences just <b>anterior and superior to the medial malleolus</b>. It continues up the medial aspect of the lower leg with the <b>saphenous nerve</b>, turns slightly posteriorly at the superior aspect of the gastrocnemius, then passes medial to the knee joint (<b>5 cm posterior to the medial aspect of the patella</b>). From the knee it continues up the <b>medial thigh</b> to join the common femoral vein at the <b>saphenofemoral junction</b> (3 cm inferior and 3 cm medial to the femoral pulse).</p>"
      },
      {
        heading: "Short Saphenous Vein",
        html: "<p>The short saphenous vein (SSV) starts <b>2 cm posterior to the lateral malleolus</b>, courses superiorly superficial to the <b>gastrocnemius</b> in the midline of the posterior calf, running with the <b>sural nerve</b> (risk of lateral foot numbness during harvest), and terminates by draining into the <b>popliteal vein</b> just below the knee.</p>"
      },
      {
        heading: "Nerve Injury During Harvest",
        html: "<p>The <b>saphenous nerve</b> (a branch of the femoral nerve) travels with the LSV throughout its course. Injury causes sensory loss over the <b>medial aspect of the leg and foot</b> — the most common neurological complication of LSV harvest. The <b>sural nerve</b> accompanies the SSV; injury causes lateral foot numbness.</p>"
      }
    ],
    pearls: [
      "LSV starts anterior to the medial malleolus — the most consistent landmark for harvest initiation.",
      "Saphenous nerve injury during LSV harvest causes medial leg and foot numbness.",
      "Endoscopic vein harvest reduces wound morbidity while maintaining conduit patency."
    ]
  },

  {
    id: "ves-lima",
    category: "vessels",
    title: "Left Internal Mammary Artery (LIMA)",
    short: "Origin, course, branches, phrenic nerve risk",
    blurb: "<p>The <b>LIMA (left internal thoracic artery)</b> is the conduit of choice for coronary artery bypass to the LAD due to its excellent long-term patency. Its harvest requires understanding of the neurovascular plane and branch anatomy.</p>",
    diagram: "ADG.lima_course",
    sections: [
      {
        heading: "Origin and Course",
        html: "<p>The LIMA originates from the <b>first part of the subclavian artery</b>, medial to scalenus anterior. It lies in the neurovascular plane between the <b>transversus thoracis muscle</b> and the <b>internal intercostal muscle</b> layers. It courses <b>approximately 2 cm lateral to the left sternal edge</b> down the posterior chest wall, accompanied by left internal mammary veins on either side.</p>"
      },
      {
        heading: "Branches",
        html: "<ul><li><b>Intercostal branches</b></li><li><b>Perforating branches</b>: supply overlying pectoralis major</li><li><b>Sternal branches</b></li><li><b>Pericardiophrenic artery</b>: supplies the phrenic nerve and lateral pericardium — the reason phrenic nerve injury can occur during LIMA harvest</li></ul>"
      },
      {
        heading: "Termination",
        html: "<p>The LIMA terminates around the <b>6th intercostal space</b> by dividing into:<ul><li><b>Superior epigastric artery</b>: supplies the superior anterior abdominal wall and rectus abdominis</li><li><b>Musculophrenic artery</b>: supplies 6th–10th intercostal spaces; can occasionally be used as a conduit</li></ul></p>"
      }
    ],
    pearls: [
      "Pericardiophrenic artery branches from the LIMA — LIMA harvest can injure the phrenic nerve, causing left hemidiaphragm paralysis.",
      "LIMA-to-LAD bypass has the best long-term patency of any CABG conduit (~90% at 10 years).",
      "Bilateral IMA harvest in diabetics increases risk of sternal wound dehiscence."
    ]
  },

  {
    id: "ves-radial",
    category: "vessels",
    title: "Radial Artery",
    short: "Origin, course, harvest anatomy, nerve risks",
    blurb: "<p>The <b>radial artery</b> is the second most commonly used arterial conduit for CABG. Pre-harvest Allen's test confirms adequacy of ulnar collateral supply to the hand.</p>",
    sections: [
      {
        heading: "Origin and Course",
        html: "<p>The radial artery commences as one of the two terminal branches of the <b>brachial artery</b>, medial to the biceps tendon. It is divided into three parts:<ul><li><b>Proximal</b>: origin to distal antecubital fossa</li><li><b>Middle</b>: antecubital fossa to the origins of brachioradialis and ECRL/ECRB tendons</li><li><b>Distal</b>: those tendons to the wrist crease</li></ul>During its course it lies under the cover of the <b>brachioradialis</b> muscle, which must be laterally retracted during harvest.</p>"
      },
      {
        heading: "Termination and Branches",
        html: "<p>The radial artery terminates at the <b>radial styloid process</b> and continues as the <b>deep palmar artery</b>, which anastomoses with the superficial palmar arch from the ulnar artery. Branches include the <b>recurrent radial artery</b>, superficial palmar artery, and muscular branches.</p>"
      },
      {
        heading: "Nerves at Risk During Harvest",
        html: "<ul><li><b>Lateral cutaneous nerve of the forearm</b> (C5–6): sensory to the lateral forearm</li><li><b>Superficial radial nerve</b> (C7–8): crosses the anatomical snuffbox; damage causes numbness over the dorsum of the thumb base and thenar eminence</li></ul>"
      }
    ],
    pearls: [
      "Allen's test must confirm adequate ulnar collateral supply before radial artery harvest.",
      "Superficial radial nerve crosses the anatomical snuffbox — damage causes thumb-base numbness.",
      "Radial artery spasm during harvest is minimised by papaverine or diltiazem perfusion."
    ]
  },

  {
    id: "ves-phrenic",
    category: "vessels",
    title: "Phrenic Nerve",
    short: "Origin, course, relations to IMA and pericardium",
    blurb: "<p>The <b>phrenic nerve</b> innervates the diaphragm and is at risk during LIMA harvest, pericardiotomy, and mediastinal dissection. Injury causes ipsilateral hemidiaphragm paralysis.</p>",
    sections: [
      {
        heading: "Origin and Course",
        html: "<p>The phrenic nerve originates from nerve roots <b>C3, C4, and C5</b> (mnemonic: C3, 4, 5 keeps the diaphragm alive). It courses down through the neck lying <b>anterior to scalenus anterior</b>, passes <b>posterior to the subclavian artery</b>, and then <b>medial to the internal mammary artery</b> to lie on the lateral surface of the pericardium. This medial relationship to the IMA explains why IMA harvest risks phrenic nerve injury.</p>"
      },
      {
        heading: "Diaphragmatic Entry",
        html: "<p>The <b>right phrenic nerve</b> passes through the <b>inferior vena caval opening</b> at the level of T8. The <b>left phrenic nerve pierces the muscular part</b> of the left hemi-diaphragm.</p>"
      },
      {
        heading: "Function",
        html: "<p>The phrenic nerve supplies:</p><ul><li><b>Motor</b>: to the diaphragm</li><li><b>Sensory</b>: to the diaphragm and anterior chest and abdominal wall</li></ul><p>Referred pain to the <b>shoulder tip</b> can occur with diaphragmatic or pericardial irritation via the phrenic nerve.</p>"
      }
    ],
    pearls: [
      "C3, 4, 5 keeps the diaphragm alive — mnemonic for phrenic nerve root origin.",
      "Phrenic nerve runs medial to the IMA on the pericardium — topical ice for myocardial protection can also injure it.",
      "Left phrenic nerve palsy post CABG worsens respiratory function — important in patients with borderline pulmonary reserve."
    ]
  },

  {
    id: "ves-axillary",
    category: "vessels",
    title: "Axillary Artery",
    short: "Parts, branches, alternate cannulation site",
    blurb: "<p>The <b>axillary artery</b> is an important alternate cannulation site in aortic surgery, particularly when femoral cannulation is contraindicated due to aortic disease or significant peripheral vascular disease.</p>",
    sections: [
      {
        heading: "Course and Parts",
        html: "<p>The axillary artery is a direct continuation of the <b>subclavian artery</b> commencing at the <b>outer edge of the 1st rib</b>. It terminates at the <b>lower border of teres major</b>, continuing as the brachial artery. It is divided into three parts by <b>pectoralis minor</b>: the 1st part lies above, the 2nd part behind, and the 3rd part below the muscle (Rule of 1-2-3: 1 branch in part 1, 2 in part 2, 3 in part 3).</p>"
      },
      {
        heading: "Branches",
        html: "<ul><li>Part 1: highest thoracic artery</li><li>Part 2: thoracoacromial artery, lateral thoracic artery</li><li>Part 3: subscapular artery (largest branch), anterior and posterior humeral circumflex arteries</li></ul>"
      }
    ],
    pearls: [
      "Right axillary artery cannulation provides antegrade cerebral perfusion during arch surgery.",
      "The axillary artery lies within the brachial plexus sheath — excessive retraction risks brachial plexus injury.",
      "Rule of 1-2-3 for axillary artery branches relative to pectoralis minor."
    ]
  }

);
