/* Cardiac Anatomy — Conduction system regions */
"use strict";
if (!window.ANATOMY.regions) window.ANATOMY.regions = [];
window.ANATOMY.regions.push(

  {
    id: "cond-sanode",
    category: "conduction",
    title: "Sino-Atrial Node",
    short: "Location, structure, blood supply",
    blurb: "<p>The <b>SA node</b> is the primary cardiac pacemaker, initiating each heartbeat. Its subepicardial location and arterial supply are critical considerations during superior vena cava cannulation for cardiopulmonary bypass.</p>",
    sections: [
      {
        heading: "Location and Structure",
        html: "<p>The SA node is an <b>elliptical or horseshoe-shaped</b>, sub-epicardial structure lying just <b>lateral to the SVC-RA junction</b> at the roof of the right atrium, at the superior end of the <b>terminal groove (sulcus terminalis)</b>. It is sub-epicardial, not deeply embedded in the myocardium.</p>"
      },
      {
        heading: "Blood Supply",
        html: "<p>The <b>SA nodal artery</b> originates from the <b>RCA in 55%</b> of patients and from the <b>circumflex artery in 45%</b>. The nodal artery passes <b>anterior to the SVC-RA junction in 60%</b>, posterior in 33%, and around it (encircling) in 7% of patients. This variation is important during SVC cannulation to avoid nodal artery injury.</p>"
      },
      {
        heading: "Impulse Propagation",
        html: "<p>From the SA node, the impulse spreads through three <b>internodal tracts</b> (anterior, middle, and posterior) in the right atrium and via <b>Bachmann's bundle</b> (the interatrial pathway) to the left atrium, before reaching the AV node.</p>"
      }
    ],
    pearls: [
      "SA node is subepicardial — avoid excessive electrocautery at the SVC-RA junction during bypass cannulation.",
      "The SA nodal artery encircles the SVC-RA junction in 7% — at risk during snaring of the SVC.",
      "Bachmann's bundle is the principal interatrial pathway — disruption predisposes to atrial arrhythmias after cardiac surgery."
    ]
  },

  {
    id: "cond-avnode",
    category: "conduction",
    title: "AV Node & Triangle of Koch",
    short: "Triangle of Koch, AV node blood supply",
    blurb: "<p>The <b>AV node</b> lies within the triangle of Koch on the interatrial septum. This triangle is the most important landmark for conduction system protection during tricuspid and mitral valve surgery.</p>",
    diagram: "ADG.triangle_koch",
    sections: [
      {
        heading: "Triangle of Koch",
        html: "<p>The triangle of Koch is bounded by:</p><ul><li><b>Tendon of Todaro</b> (anterosuperior border)</li><li><b>Hinge of the septal leaflet of the tricuspid valve</b> (anteroinferior border)</li><li><b>Superior margin of the coronary sinus ostium</b> (posterior border)</li></ul><p>The AV node sits at the <b>apex</b> of the triangle, where all three borders converge, just superior to the coronary sinus ostium. The membranous septum lies just superior to the triangle of Koch, where the bundle of His penetrates.</p>"
      },
      {
        heading: "AV Node Blood Supply",
        html: "<p>The <b>AV nodal artery</b> arises from the <b>RCA in 85–90%</b> of patients and from the circumflex artery in 10–15%. It typically arises at the <b>crux cordis</b> — the posterior junction of the four cardiac chambers — in right-dominant systems.</p>"
      }
    ],
    pearls: [
      "The apex of the triangle of Koch = AV node position. Keep sutures away from this apex during tricuspid annuloplasty.",
      "AV nodal artery arises at the crux cordis — the posterior junction of all four chambers.",
      "Left-dominant patients risk AV block from circumflex occlusion (AV nodal artery from Cx in 10-15%)."
    ]
  },

  {
    id: "cond-his-bundle",
    category: "conduction",
    title: "Bundle of His & Bundle Branches",
    short: "Penetrating bundle, left/right bundle branches, moderator band",
    blurb: "<p>The <b>bundle of His</b> connects the AV node to the ventricular conduction system. Its course through the central fibrous body and along the ventricular septum makes it vulnerable during aortic and tricuspid valve surgery.</p>",
    sections: [
      {
        heading: "Bundle of His",
        html: "<p>The bundle of His penetrates the <b>central fibrous body</b> to reach the <b>membranous septum</b>, lying on the crest of the muscular ventricular septum just beneath the commissure between the <b>right and non-coronary cusps</b> of the aortic valve. This proximity explains why aortic valve surgery risks complete heart block if deep sutures are placed at the RCC-NCC commissure.</p>"
      },
      {
        heading: "Left Bundle Branch",
        html: "<p>The left bundle branch divides into <b>anterior and posterior fascicles</b>, which run sub-endocardially down the <b>septal surface of the left ventricle</b> to the apex. Left anterior fascicular block is common with LAD territory disease involving the proximal septum.</p>"
      },
      {
        heading: "Right Bundle Branch",
        html: "<p>The right bundle branch runs on the <b>right side of the ventricular septum</b> toward the base of the <b>medial papillary muscle of the tricuspid valve</b>, traversing the RV cavity through the <b>moderator band (septomarginal trabeculation)</b>. The moderator band is a key surgical landmark in the RV.</p>"
      }
    ],
    pearls: [
      "AV node to bundle of His: penetrates the central fibrous body, emerges beneath the RCC-NCC commissure.",
      "The moderator band carries the right bundle branch — RBBB is a risk during RV incisions or VSD closure.",
      "Left anterior fascicular block with LAD disease indicates involvement of the septal perforators."
    ]
  }

);
