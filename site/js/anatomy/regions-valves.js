/* Cardiac Anatomy — Cardiac valve regions */
"use strict";
if (!window.ANATOMY.regions) window.ANATOMY.regions = [];
window.ANATOMY.regions.push(

  {
    id: "val-aortic",
    category: "valves",
    title: "Aortic Valve",
    short: "Cusps, sinuses of Valsalva, fibrous skeleton",
    blurb: "<p>The <b>aortic valve</b> guards the LVOT-aortic junction and its detailed anatomy is essential for valve repair, replacement, and root surgery including the Ross procedure.</p>",
    sections: [
      {
        heading: "Leaflet Anatomy",
        html: "<p>The aortic valve has three semilunar leaflets: the <b>right coronary cusp (RCC)</b>, the <b>left coronary cusp (LCC)</b>, and the <b>non-coronary (posterior) cusp (NCC)</b>. Each leaflet has a fibrous core thickened centrally at its free edge, forming the <b>nodule of Arantius</b>, which aids coaptation and valve sealing. Leaflets coapt at three <b>commissures</b> on the aortic wall.</p>"
      },
      {
        heading: "Competence and Root Components",
        html: "<p>Aortic valve competence depends on: the valve leaflets, the <b>sinuses of Valsalva</b> (right, left, non-coronary), the <b>sinotubular junction</b>, the anatomical ventriculo-arterial junction, and the basal ring. The sinuses allow leaflets to fall back during systole without occluding the coronary ostia. Dilation of the sinotubular junction alone can cause aortic regurgitation despite normal leaflets.</p><p>The haemodynamic boundary between ventricle and aorta is marked by the crown-shaped line of <b>leaflet attachments</b>, not the anatomical junction — creating triangles of arterial wall on the ventricular side.</p>"
      },
      {
        heading: "Surgical Relations",
        html: "<ul><li><b>NCC</b>: abuts the interatrial septum and AV node region</li><li><b>RCC</b>: adjacent to the RV and membranous septum (bundle of His lies just below the RCC-NCC commissure)</li><li><b>LCC</b>: adjacent to the left main and circumflex coronary territory</li></ul>"
      }
    ],
    pearls: [
      "The bundle of His lies beneath the commissure between the RCC and NCC — sutures here risk heart block during AVR.",
      "Dilation of the sinotubular junction causes AR even with normal leaflets (type I AR in Carpentier classification).",
      "The Ross procedure uses the pulmonary autograft to replace the aortic root — harvest risks injury to the first septal perforator."
    ]
  },

  {
    id: "val-pulmonary",
    category: "valves",
    title: "Pulmonary Valve",
    short: "Leaflets, sinuses, Ross procedure relevance",
    blurb: "<p>The <b>pulmonary valve</b> is structurally homologous to the aortic valve but no coronary arteries arise from its sinuses. It is used as an autograft in the Ross procedure.</p>",
    sections: [
      {
        heading: "Anatomy",
        html: "<p>The pulmonary valve has three semilunar leaflets: <b>right cusp</b>, <b>left cusp</b>, and <b>anterior cusp</b>. Competence depends on the same structures as the aortic valve: leaflets, sinuses, commissures, and the sinotubular junction. The pulmonary root is the structural blueprint used in the Ross procedure.</p>"
      },
      {
        heading: "Ross Procedure Risk",
        html: "<p>During pulmonary autograft harvest, the <b>first septal perforator of the LAD</b> is at risk because it lies immediately beneath the RVOT and pulmonary valve. Injury can cause anterior septal ischaemia or infarction.</p>"
      }
    ],
    pearls: [
      "No cusps are named 'coronary' in the pulmonary valve — no coronary arteries arise from pulmonary sinuses normally.",
      "First septal perforator risk is the key surgical hazard during Ross autograft harvest.",
      "The pulmonary autograft has excellent long-term haemodynamics in the aortic position due to growth potential."
    ]
  },

  {
    id: "val-mitral",
    category: "valves",
    title: "Mitral Valve",
    short: "Leaflets, annulus, papillary muscles, chordae",
    blurb: "<p>The <b>mitral valve</b> has two leaflets with complex sub-valvular anatomy. Its detailed structure is central to mitral valve repair, one of the most anatomically demanding operations in cardiac surgery.</p>",
    diagram: "ADG.mitral_valve",
    sections: [
      {
        heading: "Leaflets",
        html: "<p>The mitral valve has two leaflets:</p><ul><li><b>Anterior (aortic) leaflet</b>: shares fibrous continuity with the aortic valve (aortic-mitral curtain). Takes up ~two-thirds of the valve orifice cross-sectional area.</li><li><b>Posterior (mural) leaflet</b>: subdivided by clefts into scallops <b>P1</b> (anterolateral), <b>P2</b> (middle), and <b>P3</b> (posteromedial), with corresponding A1, A2, A3 areas on the anterior leaflet. P2 prolapse is the most common cause of degenerative MR.</li></ul>"
      },
      {
        heading: "Annulus",
        html: "<p>The mitral annulus is <b>kidney-shaped</b>. The posterior annulus accounts for <b>two-thirds</b> of the circumference; the anterior annulus (fibrous, part of the central fibrous body) accounts for <b>one-third</b>. The annulus contracts by <b>20–40%</b> in systole, aiding competence. Annuloplasty rings restore this function.</p>"
      },
      {
        heading: "Papillary Muscles and Chordae",
        html: "<p>Two papillary muscles arise from the LV free wall:</p><ul><li><b>Anterolateral PM</b>: single head, dual blood supply from the circumflex artery (and diagonal branches) — more resistant to ischaemia</li><li><b>Posteromedial PM</b>: multiple heads, single blood supply from the RCA — vulnerable to RCA occlusion, causing papillary muscle rupture and acute MR</li></ul><p>Chordae tendineae connect the PMs to the leaflets:</p><ul><li><b>Primary (marginal) chordae</b>: to the free edge of the leaflets</li><li><b>Secondary (intermediate) chordae</b>: to the roughened zone on the ventricular surface</li><li><b>Tertiary (basal) chordae</b>: from PM or ventricular wall to the base of the leaflets</li></ul>"
      }
    ],
    pearls: [
      "P2 prolapse is the most common surgically correctable cause of degenerative MR.",
      "Posteromedial PM has single RCA supply — most vulnerable in inferior MI, causing acute MR/papillary rupture.",
      "Chordal preservation during MVR maintains LV geometry and preserves systolic function."
    ]
  },

  {
    id: "val-tricuspid",
    category: "valves",
    title: "Tricuspid Valve",
    short: "Leaflets, papillary muscles, conduction risk",
    blurb: "<p>The <b>tricuspid valve</b> guards the right AV junction. Its septal leaflet lies adjacent to the conduction system, making tricuspid surgery a risk for heart block.</p>",
    sections: [
      {
        heading: "Leaflets",
        html: "<p>The tricuspid valve has three leaflets:</p><ul><li><b>Anterior leaflet</b>: the largest and most important surgically</li><li><b>Septal leaflet</b>: the most important from a conduction system risk perspective</li><li><b>Posterior (mural) leaflet</b>: the smallest, sometimes multiple</li></ul>"
      },
      {
        heading: "Papillary Muscles",
        html: "<ul><li><b>Anterior PM</b> (largest): arises from the moderator band (septomarginal trabeculation); supports the anterior leaflet and the anterior-posterior zone of apposition</li><li><b>Medial PM of Lancisi</b>: supports the septal leaflet and septal-anterior zone of apposition; the <b>right bundle branch passes through it</b> — injury risks RBBB or complete heart block</li><li><b>Posterior PM</b> (smallest, sometimes indistinct): supports the posterior leaflet and posterior-septal zone of apposition</li></ul>"
      },
      {
        heading: "Conduction System Relations",
        html: "<p>During tricuspid valve surgery, the conduction system is at most risk near the <b>septal leaflet hinge</b> and the <b>anteroseptal commissure</b>, where the bundle of His is closest to the valve. Sutures placed here can cause complete heart block.</p>"
      }
    ],
    pearls: [
      "The AV node lies in the triangle of Koch, just superior to the septal TV leaflet hinge.",
      "The medial papillary muscle of Lancisi carries the right bundle branch — injury causes RBBB.",
      "Tricuspid annuloplasty rings avoid the septal leaflet zone to protect the conduction system."
    ]
  }

);
