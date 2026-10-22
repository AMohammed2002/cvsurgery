/* Day 5 coronary angiography learning module. */
"use strict";

(function () {
  const assetRoot = "assets/angiography/";
  function inferFigureMeta(file, alt, caption) {
    const text = `${file} ${alt} ${caption}`.toLowerCase();
    let projection = "";
    if (text.includes("steep lao")) projection = "Steep LAO";
    else if (text.includes("lao caudal") || text.includes("spider")) projection = "LAO caudal (spider)";
    else if (text.includes("lao cranial")) projection = "LAO cranial";
    else if (text.includes("rao caudal")) projection = "RAO caudal";
    else if (text.includes("rao cranial")) projection = "RAO cranial";
    else if (text.includes("true lateral")) projection = "True lateral";
    /* The Cath Slides plates add the straight-tilt and AP-rotation corners that
       the original slide deck never named. */
    else if (text.includes("ap caudal")) projection = "AP caudal";
    else if (text.includes("ap cranial")) projection = "AP cranial";
    else if (text.includes("ap-lao cranial") || text.includes("ap - lao cranial")) projection = "AP–LAO cranial";
    else if (text.includes("lao straight")) projection = "LAO straight";
    else if (text.includes("rao straight")) projection = "RAO straight";
    else if (text.includes("rao versus lao") || text.includes("cranial versus caudal")) projection = "Projection geometry";

    let vessel = "";
    if (text.includes("anomalous-lcx")) vessel = "LCx";
    else if (text.includes("anomaly-")) vessel = "Coronary origins";
    else if (text.includes("lima")) vessel = "LIMA-LAD";
    else if (text.includes("lad-pa-fistula") || text.includes("lad-to-pulmonary")) vessel = "LAD / fistula";
    else if (text.includes("myocardial-bridge")) vessel = "LAD";
    else if (text.includes("collateral")) vessel = "Collateral circulation";
    else if (text.includes("angiogram-rca") || text.includes("projection-rca") || text.includes("right coronary")) vessel = "RCA";
    else if (text.includes("angiogram-left") || text.includes("challenge-left") || text.includes("left coronary") || text.includes("left-system") || text.includes("left main") || text.includes("ramus")) vessel = "Left coronary system";
    else if (text.includes("pressure-ventricularization")) vessel = "Coronary ostium";
    else if (text.includes("plaque") || text.includes("thrombus") || text.includes("embolism") || text.includes("aneurysm")) vessel = "Coronary pathology";

    return {
      ...(projection ? { projection: projection } : {}),
      ...(vessel ? { vessel: vessel } : {}),
      tags: file.replace(/\.[^.]+$/, "").split("-")
    };
  }
  /* Intrinsic pixel size of every asset in assets/angiography (sips -g pixelWidth -g pixelHeight).
     Rendered as width/height attributes so the browser reserves space before the image loads (no CLS). */
  const FIGURE_DIMS = {
    "angiogram-air-embolism.jpg": [464, 421],
    "angiogram-calcified-plaque.jpg": [426, 445],
    "angiogram-coronary-aneurysm.jpg": [664, 687],
    "angiogram-coronary-thrombus.jpg": [419, 399],
    "angiogram-lad-pa-fistula.jpg": [687, 552],
    "angiogram-left-lao-cranial.jpg": [512, 512],
    "angiogram-left-rao-caudal.jpg": [512, 512],
    "angiogram-left-rao-cranial-long.jpg": [512, 512],
    "angiogram-left-rao-cranial.jpg": [512, 512],
    "angiogram-left-spider.jpg": [512, 512],
    "angiogram-rca-lao-cranial-distal.jpg": [512, 512],
    "angiogram-rca-lao-cranial.jpg": [512, 512],
    "angiogram-rca-rao.jpg": [512, 512],
    "anomalous-lcx-angiogram.jpg": [307, 142],
    "anomaly-left-main-from-right-cusp.jpg": [296, 166],
    "anomaly-normal-origins.jpg": [296, 166],
    "anomaly-rca-from-left-cusp.jpg": [296, 166],
    "challenge-left-lao-cranial.jpg": [512, 512],
    "challenge-left-ramus.jpg": [512, 512],
    "challenge-left-rao-caudal.jpg": [512, 512],
    "coronary-collateral-pathways.jpg": [826, 702],
    "cranial-caudal-angulation.png": [1224, 811],
    "history-first-angiography-lab.jpg": [555, 564],
    "history-first-coronary-frame.jpg": [500, 380],
    "myocardial-bridge-mechanism.jpg": [766, 431],
    "pressure-ventricularization-waveform.png": [1207, 382],
    "projection-lao-cranial-tree.png": [1638, 815],
    "projection-rao-caudal-geometry.png": [419, 508],
    "projection-rao-caudal-tree.png": [862, 807],
    "projection-rca-lao-cranial.png": [828, 811],
    "projection-rca-rao-cranial.png": [812, 790],
    "projection-steep-lao-tree.png": [912, 887],
    "projection-true-lateral-geometry.png": [737, 392],
    "projection-true-lateral-tree.png": [914, 856],
    "rao-lao-angulation.png": [1200, 532]
  };
  const figure = (file, alt, caption, source, metadata) => Object.assign({
    src: assetRoot + file,
    alt: alt,
    caption: caption,
    source: source
  }, FIGURE_DIMS[file] ? { width: FIGURE_DIMS[file][0], height: FIGURE_DIMS[file][1] } : {},
    inferFigureMeta(file, alt, caption), metadata || {});

  window.ANGIOGRAPHY = {
    meta: {
      id: "day-5-coronary-angiography",
      day: 5,
      linkedLesson: "d4-cath",
      title: "Coronary Angiography: From Projection to Bypass Plan",
      shortTitle: "Angiography Lab",
      eyebrow: "Imaging Day - interactive coronary angiography",
      version: "1.0.0",
      estimatedMinutes: 180,
      audience: "Clerks, residents, cardiac surgery trainees, and learners preparing for cath conference or the operating room",
      description: "A systematic, image-led module that begins with safe coronary engagement, teaches projection and vessel recognition, separates anatomic narrowing from physiologic significance, and ends with a surgeon-ready revascularization map.",
      learningContract: "For every angiogram, state the system, projection, image adequacy, anatomy and dominance, lesion morphology and severity, epicardial flow and tissue perfusion, collateral or graft information, and the surgical consequence. Never let a single percent stenosis replace that sequence.",
      objectives: [
        "Recognize the left and right coronary systems and determine dominance from the artery supplying the crux and posterior descending artery.",
        "Select and identify standard RAO, LAO, cranial, and caudal projections, including views that open the left main bifurcation, LAD, LCx, distal RCA, and LIMA-to-LAD insertion.",
        "Describe coronary engagement and contrast injection as a pressure-verified safety sequence.",
        "Describe a lesion by location, reference segment, geometry, length, contour, calcification, thrombus, bifurcation involvement, and distal bed rather than by a percentage alone.",
        "Keep anatomic severity separate from physiologic significance and choose among FFR, iFR, IVUS, and CT coronary angiography when angiography is insufficient.",
        "Recognize ulcerated plaque, calcification, intraluminal filling defects, air or thrombus embolization, myocardial bridging, fistulae, anomalies, collaterals, and aneurysm.",
        "Define TIMI 0-3 epicardial flow and TIMI myocardial perfusion grade (TMPG) 0-3 while respecting the need for cine to grade time-dependent behavior.",
        "Translate the angiogram into a CABG plan that names targets, landing zones, distal runoff, conduit considerations, competitive flow risk, and possible mechanisms of graft failure."
      ],
      interpretationChecklist: [
        "1. Confirm patient, study timing, indication, and whether the study is native-only, graft-only, or complete.",
        "2. Name the injected coronary system and projection before naming a lesion.",
        "3. Judge engagement, opacification, motion, overlap, foreshortening, and whether orthogonal views exist.",
        "4. Trace every major vessel from ostium to distal bed and establish dominance.",
        "5. Localize and describe each lesion in at least two suitable views.",
        "6. Separate visual diameter stenosis from evidence that the lesion limits flow.",
        "7. Grade epicardial flow, then comment separately on myocardial perfusion when cine allows.",
        "8. Look for collaterals, anomalous courses, aneurysm, fistula, bridging, thrombus, air, dissection, and grafts.",
        "9. End with viable territory, target quality, runoff, and the practical surgical consequence."
      ],
      sourceLimitations: [
        "The supplied angiography PDF contains static single frames, not cine loops. Static images cannot establish TIMI transit speed, myocardial-perfusion washout, systolic bridge compression, or dynamic graft filling.",
        "The clinical frames are mostly 512 x 512 JPEGs. They are intentionally displayed at teaching-card scale; aggressive enlargement or sharpening could invent apparent edges or stenoses.",
        "The source deck is from 2017. Its lesion type A/B/C table is presented as a legacy morphology vocabulary, and its epidemiologic percentages are attributed to the source rather than treated as timeless constants.",
        "The source labels neither panel of its air-versus-thrombus comparison definitively. The module therefore teaches the differential and the acquisition clues, not an invented panel answer.",
        "The thrombus versus air embolism differential is resolved with procedural context, cine behavior, system inspection, and repeat geometry rather than a single still frame.",
        "Acute management depends on clinical context and local protocols. This module teaches recognition, communication, and operative translation rather than a dated treatment algorithm."
      ],
      excludedSourceMaterial: [
        "Slide 55 contains personal closing photographs and is intentionally excluded.",
        "The narrow myocardial-bridge text overlays are excluded because they are not clinical figures; the clean mechanism illustration is used instead."
      ]
    },

    chapters: [
      {
        id: "orientation",
        number: 1,
        title: "Orientation, History, and the Reading Contract",
        kicker: "Learn a reproducible method before learning isolated pictures",
        summary: "Coronary angiography is a moving, projection-dependent map. The disciplined reader names what was acquired, tests whether it is adequate, traces anatomy, and only then interprets disease.",
        objectives: [
          "Place selective coronary angiography in historical and technical context.",
          "Use a fixed nine-part interpretation sequence.",
          "State what a static teaching frame can and cannot prove."
        ],
        sections: [
          {
            id: "orientation-history",
            title: "From Sones to a projection-based map",
            body: [
              "The source opens with F. Mason Sones and the first selective coronary arteriogram on October 30, 1958. The lasting conceptual advance was not merely injecting contrast: it was selectively opacifying a coronary ostium so the arterial tree could be studied in deliberately chosen projections.",
              "Modern angiography still obeys that geometry. A vessel is a three-dimensional, moving tube displayed as a two-dimensional shadow. The same lesion may look severe, mild, long, short, or invisible depending on overlap, foreshortening, eccentric plaque, and the phase of motion. A useful interpretation therefore begins with projection and image adequacy, not a percentage."
            ],
            pearl: "Every frame answers a geometric question. Before asking what disease is present, ask what this view was designed to separate.",
            images: [
              figure("history-first-coronary-frame.jpg", "Historical black-and-white frame from the first selective coronary angiography era.", "Historical selective coronary angiography frame used to introduce projection-based coronary imaging.", "Basic Coronary Angiography, slide 4"),
              figure("history-first-angiography-lab.jpg", "Historical photograph of F. Mason Sones in an early cardiac catheterization laboratory.", "F. Mason Sones and the early catheterization laboratory context.", "Basic Coronary Angiography, slide 4")
            ]
          },
          {
            id: "orientation-practice",
            title: "Why comfort requires deliberate repetition",
            body: [
              "The deck explicitly frames angiography as a learned visual language, suggesting that comfort develops across roughly a fellowship year and about one hundred deliberately reviewed angiograms. The exact count is less important than the method: passive exposure is not enough.",
              "Deliberate review means first committing to an answer, then checking projection, anatomy, and the reason the image succeeds or fails. The highest-yield practice is comparison: cranial versus caudal, RAO versus LAO, good versus poor distal separation, and an angiographic impression versus physiologic or intravascular adjudication."
            ],
            steps: [
              "Name the system and projection without labels.",
              "Trace the vessel continuously rather than jumping to the brightest lesion.",
              "State one limitation of the frame.",
              "Write a one-sentence synthesis and compare it with the reveal.",
              "Revisit missed images after a delay, not immediately only."
            ],
            pearl: "The training unit is not an image. It is an image plus a committed interpretation plus corrective feedback."
          },
          {
            id: "orientation-sequence",
            title: "The nine-part angiographic read",
            body: [
              "A complete report is built in layers. Start with context and acquisition, then anatomy, then disease, then physiology and surgical meaning. This sequence prevents two common errors: calling a lesion in a foreshortened segment and allowing one dramatic abnormality to hide an incomplete study.",
              "Use neutral descriptive language before causal language. For example: 'There is an eccentric intraluminal filling defect in the mid RCA, seen in two views, with distal flow preserved' is stronger than 'there is thrombus' when air, overlap, or artifact has not been excluded."
            ],
            table: {
              headers: ["Layer", "Question", "Minimum output"],
              rows: [
                ["Context", "Why and when was the study done?", "Indication, native/graft study, relevant prior operation"],
                ["Projection", "What was injected and from what angle?", "Left/right/graft plus RAO/LAO and cranial/caudal"],
                ["Quality", "Can this frame answer the question?", "Engagement, contrast, motion, overlap, foreshortening"],
                ["Anatomy", "What branches and dominance are present?", "Ostia to distal bed, PDA origin, variants"],
                ["Lesion", "What exactly is abnormal?", "Segment, geometry, length, morphology, distal vessel"],
                ["Physiology", "Does it limit flow?", "TIMI, TMPG, FFR/iFR when appropriate"],
                ["Surgery", "What would be grafted and why?", "Target, landing zone, runoff, conduit and uncertainty"]
              ]
            },
            caution: "A polished percentage without projection, reference segment, and distal target information is an incomplete surgical report."
          },
          {
            id: "orientation-static-boundary",
            title: "Static-frame discipline",
            body: [
              "The supplied deck contains no cine. That matters because several coronary diagnoses are temporal. TIMI grade depends on the speed and completeness of distal filling. TIMI myocardial perfusion grade depends on tissue entry, persistence, and washout. Myocardial bridging depends on systolic narrowing with diastolic relaxation. A still frame can illustrate anatomy or a possible morphology but cannot display those time courses.",
              "Static teaching remains valuable when the claim matches the evidence. A still frame can support projection recognition, branch tracing, a filling-defect differential, or an aneurysmal contour. It should not be used to claim normal washout, transient air, dynamic systolic compression, or microvascular reperfusion."
            ],
            bullets: [
              "Use 'suggests' or 'raises the differential' for a morphology that needs temporal confirmation.",
              "Use cine or paired systolic/diastolic frames for dynamic diagnoses.",
              "Use at least two projections for eccentric stenosis and ambiguous overlap.",
              "Treat image quality as part of the finding, not as a footnote."
            ],
            caution: "Never grade transit, washout, or systolic change from one still image."
          }
        ]
      }
    ].sort((a, b) => a.number - b.number),

    cases: [
      {
        id: "case-pressure-ventricularization",
        chapterId: "safe-acquisition",
        title: "The waveform removes permission to inject",
        difficulty: "Core safety",
        image: figure("pressure-ventricularization-waveform.png", "Aortic pressure trace that becomes ventricularized after coronary engagement before an unsafe injection.", "Identify the pressure change before reading the source's annotation.", "Basic Coronary Angiography, slide 15"),
        stage1: {
          label: "Observe",
          prompt: "The catheter has just engaged a coronary ostium. Read the waveform before considering the image.",
          tasks: [
            "Describe how systolic amplitude and diastolic contour change.",
            "Decide whether a full contrast injection is permitted.",
            "Name two catheter-related and one patient-related explanation."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The aortic waveform becomes ventricularized, indicating functional isolation of the catheter tip from the aorta.",
            "Deep seating, non-coaxial wall contact, or an oversized curve can obstruct the ostium.",
            "True ostial or proximal disease can also damp pressure and must be distinguished after withdrawal."
          ],
          reasoning: "The waveform is a real-time safety monitor. Contrast injected against an obstructed ostium can worsen ischemia, extend dissection, or deliver a forceful bolus into a small trapped segment."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Catheter-induced ventricularization until proven otherwise.",
          synthesis: "Do not inject. Withdraw into the aortic root until a normal waveform returns, aspirate and flush if air or clot is possible, then re-engage coaxially or change catheter strategy. If abnormal pressure recurs despite a safe position, evaluate for true ostial disease.",
          surgicalConsequence: "A catheter-induced ostial injury or air event can create acute left-main or RCA ischemia and emergency surgical consultation; the preventable step is recognizing the waveform before injection."
        }
      },
      {
        id: "case-left-rao-caudal",
        chapterId: "left-system-lab",
        title: "Name the left-system view before the vessels",
        difficulty: "Foundation",
        image: figure("challenge-left-rao-caudal.jpg", "Unlabelled left coronary angiogram used as a projection-recognition challenge.", "Projection challenge from the source question-and-answer pair.", "Basic Coronary Angiography, slides 34-35"),
        stage1: {
          label: "Observe",
          prompt: "Identify the injected system and projection without using a memorized silhouette.",
          tasks: [
            "Find the left main and trace LAD and LCx.",
            "Decide whether the LCx lies high or low.",
            "State which part of the tree this view is designed to open."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The LCx runs low and is relatively elongated in the AV groove.",
            "The left main and proximal-to-distal circumflex system are displayed more clearly than in a cranial view.",
            "The LAD is present but is not the only geometric priority."
          ],
          reasoning: "Caudal tilt brings the circumflex low and opens the left-main/LCx relationship; RAO rotation profiles the LCx course and obtuse marginal branches."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Left coronary angiography in RAO caudal projection.",
          synthesis: "This is a strong view for the left main and proximal, mid, and distal LCx. It should be paired with a suitably separated projection before assigning stenosis severity.",
          surgicalConsequence: "For CABG planning, this view helps map LCx/OM targets and landing zones; a foreshortened LAD conclusion should be deferred to a cranial or orthogonal view."
        }
      },
      {
        id: "case-left-lao-cranial",
        chapterId: "left-system-lab",
        title: "The LAD-diagonal fan",
        difficulty: "Foundation",
        image: figure("challenge-left-lao-cranial.jpg", "Unlabelled left coronary angiogram used to identify an LAO cranial projection.", "LAO cranial view-recognition challenge.", "Basic Coronary Angiography, slides 36-37"),
        stage1: {
          label: "Observe",
          prompt: "Trace the vessel that reaches the apex and inspect how its side branches separate.",
          tasks: [
            "Identify LAD, diagonals, and septal branches by course.",
            "Locate the LCx relative to the LAD.",
            "Name the projection that best explains the branch separation."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The LAD is elongated toward the apex.",
            "Diagonals fan laterally while septals project toward the interventricular septum.",
            "The LCx is relatively high, consistent with cranial tilt."
          ],
          reasoning: "LAO cranial geometry separates the LAD from diagonal branches and makes their origin and disease easier to assess."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Left coronary angiography in LAO cranial projection.",
          synthesis: "The source answer is LAO cranial. Use the view to describe proximal and mid LAD plus diagonals, while confirming left-main and LCx disease in caudal views.",
          surgicalConsequence: "The view helps select LAD versus diagonal targets and avoid mistaking an overlapping diagonal for the distal LAD when planning LIMA placement."
        }
      },
      {
        id: "case-left-ramus",
        chapterId: "left-system-lab",
        title: "A third branch at the left-main division",
        difficulty: "Intermediate",
        image: figure("challenge-left-ramus.jpg", "Unlabelled left coronary angiogram with a third major branch arising between LAD and LCx.", "View-and-vessel challenge featuring a ramus intermedius.", "Basic Coronary Angiography, slides 38-39"),
        stage1: {
          label: "Observe",
          prompt: "At the left-main division, determine whether there are two major daughter branches or three.",
          tasks: [
            "Trace LAD and LCx first.",
            "Identify the branch whose origin lies between them.",
            "Name the projection and the branch using formal nomenclature."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The caudal geometry opens the left-main division.",
            "A distinct branch arises between LAD and LCx and supplies an anterolateral territory.",
            "It is not a diagonal or OM simply because it travels laterally."
          ],
          reasoning: "A true ramus intermedius arises directly from a trifurcating left main. Branch identity comes from origin and course, not only destination."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "LAO caudal left-system view with a ramus intermedius.",
          synthesis: "The source's informal phrase is normalized to ramus intermedius. Report its caliber, disease, territory, and relationship to the left-main trifurcation.",
          surgicalConsequence: "A large diseased ramus can be an independent bypass target; confusing it with a diagonal or OM can produce an incomplete or duplicated graft plan."
        }
      },
      {
        id: "case-left-rao-cranial-trace",
        chapterId: "left-system-lab",
        title: "Trace septals before calling the projection",
        difficulty: "Intermediate",
        image: figure("angiogram-left-rao-cranial-long.jpg", "RAO cranial left coronary angiogram showing an elongated LAD with diagonal and septal branches.", "RAO cranial left-system tracing case.", "Basic Coronary Angiography, slide 29"),
        stage1: {
          label: "Observe",
          prompt: "Identify the longest vessel and classify branches as septal or diagonal by direction.",
          tasks: [
            "Trace the LAD from left main to distal vessel.",
            "Mark a septal and a diagonal branch.",
            "Explain where the LCx should appear in this tilt."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The LAD is elongated by cranial angulation.",
            "Septals dive toward the septum and diagonals cross the anterolateral surface.",
            "The LCx is relatively high and compressed compared with a caudal view."
          ],
          reasoning: "The combination of LAD elongation, septal/diagonal separation, and high LCx supports RAO cranial geometry."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "RAO cranial left coronary angiogram.",
          synthesis: "Use this frame for LAD length and branch relationships, then use a caudal view to assess left-main and LCx ostia without overlap.",
          surgicalConsequence: "It helps identify whether a usable mid-distal LAD exists beyond diffuse disease and whether a substantial diagonal requires a second target."
        }
      },
      {
        id: "case-rca-distal-bifurcation",
        chapterId: "right-and-graft-lab",
        title: "PDA or posterolateral branch?",
        difficulty: "Intermediate",
        image: figure("angiogram-rca-lao-cranial-distal.jpg", "LAO cranial right coronary angiogram with a well-separated distal bifurcation.", "Distal RCA case with PDA and posterolateral branches displayed.", "Basic Coronary Angiography, slide 32"),
        stage1: {
          label: "Observe",
          prompt: "At the crux, trace both distal branches and identify the one in the posterior interventricular groove.",
          tasks: [
            "Follow the RCA continuously to the crux.",
            "Look for septal perforators from one distal branch.",
            "State the dominance pattern supported by the frame."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The PDA runs toward the apex along the floor and gives septal branches.",
            "Posterolateral branches turn over the inferior-lateral LV.",
            "The PDA arises from the RCA, supporting right dominance."
          ],
          reasoning: "Branch course and septal perforators are more reliable than simply selecting the lowest branch."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Right-dominant RCA in LAO cranial projection with PDA and posterolateral separation.",
          synthesis: "The view is adequate for distal branch naming because the bifurcation is open and the PDA groove course is visible.",
          surgicalConsequence: "PDA and posterolateral branches may be separate bypass targets; their caliber, stenosis, and runoff should be reported individually rather than as 'distal RCA disease.'"
        }
      },
      {
        id: "case-rca-suboptimal",
        chapterId: "right-and-graft-lab",
        title: "When the right answer is 'the view is inadequate'",
        difficulty: "Core judgment",
        image: figure("angiogram-rca-rao.jpg", "RAO right coronary angiogram in which the distal RCA branches overlap because cranial separation is limited.", "Suboptimal distal-RCA projection challenge.", "Basic Coronary Angiography, slide 33"),
        stage1: {
          label: "Observe",
          prompt: "Try to name PDA and posterolateral branches, then decide whether the frame earns that confidence.",
          tasks: [
            "Identify the proximal and mid RCA.",
            "Describe the distal overlap.",
            "Choose the detector change that would improve the question."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The proximal and mid RCA are visible in RAO projection.",
            "The distal branches are superimposed and their groove courses are not confidently separable.",
            "Additional cranial angulation would separate the PDA bifurcation."
          ],
          reasoning: "Naming a branch from a compressed endpoint risks swapping PDA and posterolateral supply and misrepresenting the posterior bypass map."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "RAO RCA view inadequate for confident distal-branch assignment.",
          synthesis: "Acquire RAO cranial, LAO cranial, or another tailored distal-RCA projection. The expert conclusion is not a guessed branch label but a stated geometric limitation.",
          surgicalConsequence: "Incorrectly identifying the PDA can direct a graft to the wrong branch or omit a viable posterolateral target; request a better view before final operative planning."
        }
      },
      {
        id: "case-calcified-ulcerated-plaque",
        chapterId: "pathology-artifacts",
        title: "Irregular contour: do not invent calcium",
        difficulty: "Advanced morphology",
        image: figure("angiogram-calcified-plaque.jpg", "Coronary angiogram showing an irregular luminal contour labelled ulcerated plaque by the source deck.", "Ulcerated-plaque morphology case with annotation withheld; this frame does not reliably demonstrate calcium.", "Basic Coronary Angiography, slide 41"),
        stage1: {
          label: "Observe",
          prompt: "Describe the luminal contour before accepting the source label or assigning plaque composition.",
          tasks: [
            "Describe any crater, shoulder, or irregular outpouching.",
            "State whether this still independently proves calcium or ulceration.",
            "List two mimics that another view should exclude."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The deck labels the frame 'ulcerated plaque,' and the lumen has an irregular contour compatible with that teaching diagnosis.",
            "The supplied still does not reliably demonstrate radiopaque coronary calcium; calcium must not be invented from the slide title or filename.",
            "A branch origin, overlap, dissection, or motion can mimic a crater in one projection.",
            "The external plaque burden cannot be measured from the contrast silhouette alone."
          ],
          reasoning: "Angiography defines the lumen; orthogonal views test whether the irregularity is real, and intravascular imaging can characterize wall and plaque geometry when it matters."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Source-labelled ulcerated plaque with an irregular luminal contour; plaque composition and calcium are not established by this still.",
          synthesis: "Confirm the contour in another view and describe location, lesion length, flow, distal vessel, and the limits of the frame. Use intravascular imaging if wall or plaque geometry will change intervention.",
          surgicalConsequence: "An ulcerated or heavily diseased planned landing zone may be unsuitable for arteriotomy and suturing; the surgeon needs a healthier distal segment and should know whether embolic material is suspected."
        }
      },
      {
        id: "case-filling-defect",
        chapterId: "pathology-artifacts",
        title: "The deck labels thrombus; interrogate the still",
        difficulty: "Advanced differential",
        image: figure("angiogram-coronary-thrombus.jpg", "Coronary angiogram showing a circular intraluminal filling defect labelled thrombus by the source deck.", "Source-labelled thrombus frame; an isolated still still requires procedural and cine context.", "Basic Coronary Angiography, slide 42"),
        stage1: {
          label: "Observe",
          prompt: "The deck labels this frame thrombus. Describe the evidence before accepting the mechanism.",
          tasks: [
            "State location, margin, persistence, and effect on distal flow.",
            "State the slide's label and the critical air-embolus differential for a new procedural defect.",
            "Identify the immediately relevant equipment check."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "Slide 42 is explicitly titled 'THROMBUS'; slide 43 separately introduces the air-versus-thrombus comparison.",
            "Thrombus and air can both create an intraluminal contrast defect and distal embolization.",
            "Air is often sharply marginated, mobile, and temporally related to an injection; thrombus may be irregular or persistent and associated with underlying plaque.",
            "A still frame cannot show mobility, disappearance, or persistence."
          ],
          reasoning: "Procedural timing, de-airing history, cine behavior, another projection, ECG/hemodynamics, and underlying lesion context are needed to narrow the differential."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Source-labelled coronary thrombus frame; when encountered without its title, retain an air-versus-thrombus differential until cine and procedural context support the mechanism.",
          synthesis: "Stop routine injection, inspect the manifold and catheter for air, maintain hemodynamic awareness, and review cine plus orthogonal imaging. Do not invent certainty from the circular shape.",
          surgicalConsequence: "Persistent embolic obstruction, ongoing ischemia, dissection, or retained material can require urgent catheter-based or surgical rescue; operative planning depends on the actual mechanism and downstream bed."
        }
      },
      {
        id: "case-embolization-comparison",
        chapterId: "pathology-artifacts",
        title: "Do not over-read an unlabeled comparison panel",
        difficulty: "Epistemic discipline",
        image: figure("angiogram-air-embolism.jpg", "Coronary angiographic embolization frame from an air-versus-thrombus comparison whose panel identity is not specified by the source.", "Unlabeled embolization comparison frame.", "Basic Coronary Angiography, slide 43"),
        stage1: {
          label: "Observe",
          prompt: "The source asks air versus thrombus but does not label this panel. What can be stated safely?",
          tasks: [
            "Describe the abrupt contrast abnormality and distal filling.",
            "State which temporal features would favor air.",
            "State which contextual features would favor thrombus."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The frame shows an embolic or filling abnormality but no temporal sequence.",
            "Air may change rapidly after a de-airing failure; thrombus may persist and coexist with plaque or thrombogenic equipment.",
            "The source itself does not supply a definitive panel key."
          ],
          reasoning: "A teaching module should preserve source uncertainty. The transferable skill is constructing the differential and identifying the next discriminating observation."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Embolization pattern of indeterminate material on the supplied static panel.",
          synthesis: "Review injection sequence, manifold integrity, catheter aspiration, prior frames, persistence, and distal migration. State 'air versus thrombus' until evidence distinguishes them.",
          surgicalConsequence: "If distal perfusion remains compromised or a structural complication is present, urgent revascularization or surgical support may be required; the safe pathway starts by not repeating the provoking injection."
        }
      },
      {
        id: "case-myocardial-bridge",
        chapterId: "pathology-artifacts",
        title: "A dynamic lesion in a static deck",
        difficulty: "Intermediate",
        image: figure("myocardial-bridge-mechanism.jpg", "Illustration of an LAD segment tunneling through myocardium and being compressed during systole.", "Myocardial-bridge mechanism; patient cine would be needed for diagnosis.", "Basic Coronary Angiography, slide 44; underlying figure credited on the slide to Tarantini et al., JACC 2016"),
        stage1: {
          label: "Observe",
          prompt: "Use the mechanism illustration to predict what cine should show.",
          tasks: [
            "Identify the tunneled coronary segment.",
            "Contrast the expected systolic and diastolic appearances.",
            "State why one still cannot establish hemodynamic significance."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The intramyocardial segment is compressed during systole and relaxes in diastole.",
            "The LAD is the usual vessel in the source.",
            "Most bridges are incidental; symptoms and objective ischemia must be correlated."
          ],
          reasoning: "Dynamic narrowing is necessary for angiographic diagnosis, while clinically important flow limitation depends on more than the presence of a bridge."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Myocardial bridging mechanism, most commonly involving the LAD.",
          synthesis: "On real cine, demonstrate systolic compression and diastolic release, then assess symptoms and objective ischemia before attributing causality.",
          surgicalConsequence: "Routine bypass of an incidental bridge is inappropriate and competitive native flow may jeopardize a graft; only selected clinically significant anatomy enters a surgical discussion."
        }
      },
      {
        id: "case-lad-pa-fistula",
        chapterId: "variants-structural",
        title: "Fistula anatomy is not the same as shunt significance",
        difficulty: "Advanced synthesis",
        image: figure("angiogram-lad-pa-fistula.jpg", "Coronary angiogram showing a fistulous vessel arising near the LAD and coursing toward the pulmonary artery.", "LAD-to-pulmonary-artery fistula case.", "Basic Coronary Angiography, slides 46-47"),
        stage1: {
          label: "Observe",
          prompt: "Trace the abnormal vessel from origin to its likely termination.",
          tasks: [
            "Name origin, course, and drainage site.",
            "Look for aneurysmal change or steal-related runoff.",
            "List the evidence needed to call the fistula hemodynamically important."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The source shows an LAD-region fistula to the pulmonary artery.",
            "Anatomic presence does not quantify Qp:Qs, chamber volume load, or ischemic steal.",
            "Symptoms, chamber size, oxygen saturation step-up, shunt calculation, ischemia, and cross-sectional anatomy may all matter."
          ],
          reasoning: "The unanswered source question is resolved by integrating anatomy with hemodynamics and clinical consequence rather than assuming every fistula requires closure."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "LAD-to-pulmonary-artery coronary fistula.",
          synthesis: "Map inflow and termination, assess aneurysm, quantify shunt when relevant, and evaluate ischemia or coronary steal before deciding significance.",
          surgicalConsequence: "If closure is considered, the plan must preserve normal coronary branches, define all feeding channels, and determine whether concomitant CABG or aneurysm treatment is required."
        }
      },
      {
        id: "case-anomalous-lcx",
        chapterId: "variants-structural",
        title: "The missing LCx is on the right",
        difficulty: "Advanced anatomy",
        image: figure("anomalous-lcx-angiogram.jpg", "Small angiographic frame showing an anomalous circumflex arising from the right coronary sinus or proximal RCA.", "Anomalous LCx from the right side.", "Basic Coronary Angiography, slides 49-50"),
        stage1: {
          label: "Observe",
          prompt: "The left injection does not reveal an expected LCx. Search the right side and define more than the origin.",
          tasks: [
            "Identify the anomalous vessel's takeoff.",
            "Predict its usual course relative to the aortic root.",
            "Explain why CTCA may add essential information."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The LCx arises from the right sinus or proximal RCA.",
            "The usual course is retroaortic, generally considered a lower-risk course than an interarterial course.",
            "The vessel can lie close to the mitral annulus and aortic root."
          ],
          reasoning: "Anomaly risk and operative hazard depend on the three-dimensional course; invasive angiography may show origin but CTCA defines spatial relationships more clearly."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Anomalous LCx arising from the right side with a usually retroaortic course.",
          synthesis: "Document origin, proximal course, disease, and supplied territory. Use CTCA if the course or relationship to operative structures is not certain.",
          surgicalConsequence: "During mitral or aortic surgery, an unrecognized retroaortic LCx can be injured or compressed by annular sutures, rings, or root work; the anomaly must be on the operative map."
        }
      },
      {
        id: "case-collateral-map",
        chapterId: "variants-structural",
        title: "The donor vessel supplies two territories",
        difficulty: "Advanced synthesis",
        image: figure("coronary-collateral-pathways.jpg", "Diagram of common collateral channels between conus, septal, atrial, and posterior coronary branches.", "Collateral pathway map.", "Basic Coronary Angiography, slide 51"),
        stage1: {
          label: "Observe",
          prompt: "Choose one collateral pathway and narrate blood flow from donor to recipient bed.",
          tasks: [
            "Name donor and recipient vessels.",
            "Identify the likely chronically obstructed segment.",
            "State what collaterals do not prove about the distal target."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "Collaterals reflect a pressure gradient and often chronic severe disease.",
            "They can opacify a distal vessel beyond a total occlusion.",
            "They do not prove adequate caliber, viable myocardium, or good distal runoff."
          ],
          reasoning: "The donor artery may support its native territory plus a second collateral-dependent bed, so donor stenosis can create double jeopardy."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Collateral-dependent coronary territory with an alternate donor-to-recipient route.",
          synthesis: "Report donor, recipient, direction, distal filling, and target visibility. Integrate viability and target quality before recommending grafting.",
          surgicalConsequence: "A graftable distal vessel beyond a chronic occlusion may become an important bypass target, while donor-vessel disease may increase the urgency and completeness required."
        }
      },
      {
        id: "case-coronary-aneurysm",
        chapterId: "variants-structural",
        title: "The lumen may be smaller than the aneurysm",
        difficulty: "Advanced morphology",
        image: figure("angiogram-coronary-aneurysm.jpg", "Coronary angiogram showing focal aneurysmal dilation of a coronary artery.", "Coronary aneurysm recognition case.", "Basic Coronary Angiography, slide 52"),
        stage1: {
          label: "Observe",
          prompt: "Compare the dilated segment with adjacent reference vessel and inspect distal flow.",
          tasks: [
            "Decide whether dilation is focal or diffuse.",
            "Look for filling defects that could reflect mural thrombus.",
            "List branch and landing-zone questions relevant to surgery."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "The source uses a diameter greater than 1.5 times the adjacent segment as the aneurysm definition.",
            "Angiography displays only the opacified lumen and may miss mural thrombus or true external diameter.",
            "Location, branch origins, distal bed, embolization, and etiology affect significance."
          ],
          reasoning: "Cross-sectional imaging or intravascular imaging may be needed to define wall, thrombus, and external dimensions before a structural plan."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "Coronary artery aneurysm by source definition, with mural thrombus not excluded.",
          synthesis: "Describe size relative to reference, shape, branches, distal flow, and suspected thrombus. Management is individualized rather than dictated by the still image.",
          surgicalConsequence: "If surgery is selected, the plan may require exclusion or ligation, preservation or bypass of distal branches, and a graft target beyond the diseased segment."
        }
      },
      {
        id: "case-true-lateral-lima",
        chapterId: "right-and-graft-lab",
        title: "Choose the view for the graft insertion",
        difficulty: "Operative projection",
        image: figure("projection-true-lateral-tree.png", "Schematic true lateral projection showing the anterior relationship of a LIMA graft to its LAD insertion.", "True lateral map for LIMA-to-LAD insertion.", "Basic Coronary Angiography, slide 23"),
        stage1: {
          label: "Observe",
          prompt: "A prior LIMA-to-LAD anastomosis is difficult to profile in standard oblique views. Which geometry is designed for the insertion?",
          tasks: [
            "Identify the graft and LAD relationship in the diagram.",
            "Name the detector orientation.",
            "State what the complete graft study still must include."
          ]
        },
        stage2: {
          label: "Interrogate",
          findings: [
            "A true lateral projection near 90 degrees can profile the LIMA-to-LAD insertion.",
            "The arms and detector must be positioned safely and image collision avoided.",
            "One insertion view does not replace imaging the subclavian origin, graft body, anastomosis, and distal LAD runoff."
          ],
          reasoning: "Projection selection is driven by the specific unresolved segment; the insertion is an anterior structure that can be foreshortened or overlapped in standard views."
        },
        stage3: {
          label: "Resolve",
          diagnosis: "True lateral supplemental projection for LIMA-to-LAD insertion assessment.",
          synthesis: "Use the lateral view to profile anastomotic geometry, then complete the conduit from origin to distal bed in additional projections.",
          surgicalConsequence: "A focal insertion stenosis, kink, or poor distal LAD runoff changes whether the graft can be revised, treated percutaneously, or supplemented with another bypass."
        }
      }
    ],

    additionalChapters: [
      {
        id: "lesion-assessment",
        number: 7,
        title: "Lesion Description, Stenosis Geometry, and Physiologic Significance",
        kicker: "Anatomic severity and physiologic significance are related, not interchangeable",
        summary: "Angiography outlines a contrast-filled lumen. It does not directly display the arterial wall, plaque burden, or the pressure and flow consequence of every intermediate narrowing.",
        objectives: [
          "Describe stenosis geometry and understand diameter-to-area relationships.",
          "Use a complete lesion morphology vocabulary, including the legacy type A/B/C framework.",
          "Choose objective physiology or intravascular imaging when visual anatomy is uncertain."
        ],
        sections: [
          {
            id: "lesion-geometry",
            title: "Diameter loss is not area loss",
            body: [
              "Angiographic percent stenosis is usually a diameter comparison between the narrowest lumen and an assumed reference diameter. Because cross-sectional area is proportional to radius squared, diameter loss magnifies area loss: a 50% diameter reduction corresponds to a 75% area reduction; 70% diameter reduction corresponds to about 91% area reduction; and 90% diameter reduction corresponds to about 99% area reduction.",
              "This geometry explains why apparently modest changes in diameter can substantially change residual lumen area. It does not, by itself, prove ischemia. Flow consequence also depends on lesion length, serial disease, reference-vessel size, microvascular resistance, supplied territory, collateral flow, and demand."
            ],
            table: {
              headers: ["Diameter reduction", "Residual diameter", "Approximate area reduction", "Interpretive caution"],
              rows: [
                ["50%", "50%", "75%", "Intermediate anatomy often needs physiologic or intravascular adjudication"],
                ["70%", "30%", "91%", "Usually severe anatomy, but still describe territory, length, distal bed, and context"],
                ["90%", "10%", "99%", "Critical residual lumen; assess flow, collaterals, and target beyond the lesion"]
              ]
            },
            pearl: "The squared radius relationship explains area loss; it does not turn visual angiography into a direct flow measurement."
          },
          {
            id: "lesion-complete-description",
            title: "Describe the lesion before grading it",
            body: [
              "A useful lesion description includes vessel and segment, reference caliber, visual diameter reduction, length, concentric or eccentric geometry, contour, calcification, ostial or bifurcation involvement, angulation and tortuosity, thrombus or ulceration, baseline flow, and the condition of the distal vessel. Serial lesions and diffuse disease should be mapped rather than collapsed into one maximum percentage.",
              "Visual error is greatest in the intermediate range and when the reference segment is diseased. Estimate stenosis in multiple orthogonal views before committing to severity because an eccentric lesion may appear mild in one projection and severe in another. Diffuse negative remodeling can make every segment look similarly narrow, producing an artificially reassuring reference."
            ],
            steps: [
              "Localize: ostial, proximal, mid, distal, branch, bifurcation, graft body, or anastomosis.",
              "Characterize: focal/discrete, tubular, diffuse, eccentric/concentric, smooth/irregular/ulcerated.",
              "Add complexity: calcification, tortuosity, angle, chronic occlusion, branch jeopardy, thrombus.",
              "Describe downstream anatomy: caliber, diffuse disease, runoff, competitive flow, collaterals, and viable territory.",
              "State uncertainty and the best adjudicating test."
            ],
            caution: "Do not report '80% LAD' without saying where, in which views, with what reference, and what the distal LAD looks like."
          },
          {
            id: "lesion-legacy-abc",
            title: "Legacy ACC/AHA type A, B, and C morphology",
            body: [
              "The source teaches the historical type A/B/C lesion-complexity vocabulary. It remains useful for describing technical features, but it should be presented as a legacy morphology taxonomy rather than a complete contemporary risk model.",
              "The AHA lesion morphology vocabulary progresses from type A to type B to type C as anatomic complexity, tortuosity, calcification, chronic occlusion, and branch jeopardy increase.",
              "Type A features are discrete, concentric, accessible, smooth, minimally calcified, non-ostial, free of major side-branch involvement, and without thrombus. Type B includes tubular or eccentric disease, moderate tortuosity or angulation, irregular contour, moderate-to-heavy calcification, recent total occlusion, ostial or bifurcation location, or thrombus. Type C includes diffuse disease, excessive tortuosity, extreme angulation, older chronic occlusion, inability to protect a major side branch, or a degenerated saphenous vein graft."
            ],
            caution: "Do not convert the type A/B/C label into an acute-treatment algorithm. Use it as descriptive vocabulary and integrate current anatomy, physiology, patient factors, and Heart Team judgment."
          },
          {
            id: "lesion-anatomy-physiology",
            title: "The anatomy-physiology firewall",
            body: [
              "Anatomic severity answers how narrow the contrast-filled lumen appears. Physiologic significance asks whether the lesion limits pressure or flow enough to produce ischemia in the supplied myocardium. The two often align at extremes but can diverge in intermediate disease, serial lesions, diffuse disease, large or small territories, collaterals, severe LV hypertrophy, and microvascular dysfunction.",
              "Current chronic-coronary guidance supports invasive functional assessment with FFR or iFR for intermediate stenoses when the result will change revascularization. FFR compares distal coronary pressure with aortic pressure during maximal hyperemia; a value <=0.80 is generally treated as physiologically significant. iFR is a resting diastolic pressure ratio; a value <=0.89 is generally treated as significant. These are decision aids, not substitutes for clinical context or technically sound measurement."
            ],
            table: {
              headers: ["Question", "Best tool", "What it adds", "Important limitation"],
              rows: [
                ["Does an intermediate focal lesion limit pressure?", "FFR or iFR", "Lesion-level physiology", "Technique, drift, serial disease, and microvascular context matter"],
                ["What is the lumen/plaque geometry?", "IVUS", "Cross-sectional lumen and vessel wall, calcium, plaque burden", "Anatomic, not a direct ischemia measurement"],
                ["Can obstructive CAD be excluded noninvasively?", "CTCA", "High-resolution coronary anatomy and plaque map", "Heavy calcium, motion, small stents, and renal/contrast issues can limit interpretation"],
                ["Is myocardium ischemic or viable?", "Functional imaging/CMR as appropriate", "Territory-level consequence", "Does not directly show every epicardial lesion"]
              ]
            },
            pearl: "State both conclusions: 'anatomically intermediate' and 'physiologically significant or not significant.' Never use one phrase as the other.",
            caution: "Exact book thresholds for visual stenosis are source-specific. Intermediate left-main disease deserves objective assessment because both overcalling and undercalling have major consequences."
          }
        ]
      },
      {
        id: "pathology-artifacts",
        number: 8,
        title: "Calcification, Plaque Morphology, Filling Defects, and Bridging",
        kicker: "Describe what the lumen does before naming the mechanism",
        summary: "Angiographic pathology is often a silhouette. Calcification, ulceration, thrombus, air, dissection, spasm, and artifact require multiple views, temporal behavior, and procedural context.",
        objectives: [
          "Recognize calcification and ulcerated plaque without overclaiming plaque composition.",
          "Build a safe differential for an intraluminal filling defect.",
          "Explain the dynamic definition and usual significance of myocardial bridging."
        ],
        sections: [
          {
            id: "pathology-calcification-ulceration",
            title: "Calcification and ulcerated contour",
            body: [
              "Coronary calcium may be visible before contrast as radiopaque densities that move with the coronary artery. Mild calcium is seen only with cardiac motion; severe calcium can outline both sides of the vessel. Calcium predicts technical complexity, can obscure lumen edges, and may signal a rigid target or challenging anastomotic landing zone.",
              "Ulcerated plaque appears as an irregular outpouching or crater communicating with the lumen. A static contour can suggest ulceration but should be confirmed in another view and distinguished from branch origin, overlap, dissection, or motion artifact. Angiography shows the lumen surface, whereas IVUS or other intravascular imaging better characterizes wall and plaque geometry.",
              "The supplied slide 41 is titled 'ULCERATED PLAQUE.' Its frame supports deliberate inspection of an irregular contour but does not reliably show calcium. Calcium is therefore taught here as a general angiographic concept, not claimed as an image finding in that source frame."
            ],
            image: figure("angiogram-calcified-plaque.jpg", "Unlabelled coronary frame used to inspect an irregular contour labelled ulcerated plaque by the source.", "Ulcerated-plaque teaching frame; this still is not presented as evidence of coronary calcium.", "Basic Coronary Angiography, slide 41"),
            caution: "Do not infer that a visually calcified lesion is physiologically significant solely because it is calcified, or that an uncalcified lesion is low risk."
          },
          {
            id: "pathology-filling-defect",
            title: "Circular filling defect: thrombus, air, or something else?",
            body: [
              "Slide 42 is explicitly titled 'THROMBUS' and shows a circular intraluminal filling defect. Slide 43 separately raises the air-versus-thrombus embolism differential without identifying its panel definitively. In clinical use, a single isolated still cannot settle a newly appearing defect: thrombus may be irregular, layered, persistent, and associated with plaque or impaired flow, whereas air is often sharply marginated, mobile, temporally linked to injection, and may change rapidly. Both can embolize and both matter immediately.",
              "Other considerations include dissection flap, plaque, spasm, branch overlap, streaming from non-coaxial injection, catheter material, or imaging artifact. The correct first move is not to name the circle. It is to stop further unsafe injection, preserve hemodynamic and ECG awareness, inspect the system for air, and compare cine and another projection."
            ],
            images: [
              figure("angiogram-coronary-thrombus.jpg", "Coronary angiogram with a circular intraluminal filling defect labelled thrombus by the source deck.", "Source-labelled thrombus frame; morphology should still be described before mechanism is asserted in an unlabeled clinical still.", "Basic Coronary Angiography, slide 42"),
              figure("angiogram-air-embolism.jpg", "Second coronary angiographic frame used in the source's embolization comparison without a definitive panel label.", "Embolization comparison frame; the source does not definitively label the panel as air or thrombus.", "Basic Coronary Angiography, slide 43")
            ],
            caution: "Preserve the provenance: slide 42 is labelled thrombus, while slide 43's comparison panel is not definitively keyed. The module does not transfer slide 43's uncertainty backward onto slide 42."
          },
          {
            id: "pathology-bridging",
            title: "Myocardial bridging: a dynamic narrowing",
            body: [
              "A myocardial bridge is an epicardial coronary segment that tunnels through myocardium, most often involving the LAD. The angiographic sign is systolic compression with diastolic relaxation, producing the classic 'milking' behavior on cine. A single still may show the segment or a narrowed phase but cannot establish the dynamic diagnosis.",
              "The source quotes a prevalence of 5% to 12% and emphasizes that most bridges are not hemodynamically significant or the cause of chest pain. Significance depends on depth and length, tachycardia, persistent diastolic narrowing, proximal plaque, symptoms, and objective ischemia. The operative consequence is usually none; selected clinically important bridges require specialist evaluation rather than reflex grafting, because competitive native flow can compromise a bypass."
            ],
            image: figure("myocardial-bridge-mechanism.jpg", "Illustration showing an LAD segment tunneling through myocardium and narrowing during systolic contraction.", "Mechanism of myocardial bridging; cine is required to demonstrate actual systolic compression and diastolic release in a patient.", "Basic Coronary Angiography, slide 44; underlying figure credited on the slide to Tarantini et al., JACC 2016"),
            pearl: "Bridging is a temporal diagnosis. Pair symptoms and objective ischemia with the dynamic finding before assigning causality."
          },
          {
            id: "pathology-complications",
            title: "Iatrogenic and acute angiographic complications",
            body: [
              "Important procedural complications include access-site bleeding or occlusion, contrast-associated kidney injury, allergic reaction, arrhythmia, myocardial ischemia or infarction, stroke, coronary dissection or perforation, tamponade, equipment loss, and air or thrombotic embolization. The Key Questions reference also highlights the rare need for emergency surgery for tamponade, dissection, retained equipment, or ongoing ischemia.",
              "Recognition begins with changes during the study: new pain, ST shift, bradycardia or tachyarrhythmia, hypotension, loss of pressure waveform, contrast staining, abrupt vessel cutoff, pericardial silhouette change, or failure of distal filling. The response is context-dependent and team-based; the timeless first actions are to stop the provoking maneuver, maintain perfusion, call the complication explicitly, and define the anatomy without compounding it."
            ],
            bullets: [
              "Dissection: look for an intimal flap, double lumen, staining, or abrupt loss of flow; avoid forceful reinjection.",
              "Perforation: look for extravasation and hemodynamic change; assess for pericardial accumulation.",
              "Air: inspect and isolate the delivery system; do not continue routine injections.",
              "Thrombus/embolus: distinguish new material from pre-existing disease and assess downstream flow.",
              "Catheter-induced ischemia: withdraw from the ostium and restore aortic pressure immediately."
            ],
            caution: "This module deliberately avoids a one-size-fits-all acute-treatment algorithm. Complication management depends on anatomy, stability, available expertise, and local emergency pathways."
          }
        ]
      },
      {
        id: "variants-structural",
        number: 9,
        title: "Fistulae, Anomalies, Collaterals, and Aneurysm",
        kicker: "Unusual anatomy becomes safe when origin, course, termination, and consequence are explicit",
        summary: "Variants should not be reduced to names. The interpreter traces where a vessel starts, how it travels, where it ends, what territory it supplies, and whether the anatomy changes ischemic or operative risk.",
        objectives: [
          "Describe coronary fistula origin, drainage, hemodynamic significance, and complications.",
          "Differentiate a usually benign anomalous retroaortic LCx from potentially high-risk courses.",
          "Interpret collaterals and aneurysm as findings with both diagnostic and operative implications."
        ],
        sections: [
          {
            id: "variants-fistula",
            title: "Coronary fistula: map the shunt, do not stop at the arrow",
            body: [
              "A coronary artery fistula is an abnormal communication between a coronary artery and a cardiac chamber or great vessel. The source states that about half arise from the RCA and lists drainage to RV, RA, pulmonary artery, LV, and rarely SVC, with an LAD-to-pulmonary-artery example. These percentages are source-attributed and should not replace patient-specific anatomy.",
              "Hemodynamic significance depends on fistula size, resistance, runoff, chamber or vessel of termination, coronary steal, volume load, symptoms, ischemia, aneurysmal change, and complications such as heart failure, endocarditis, or rupture. The source asks how to assess significance but does not supply an answer; a complete evaluation integrates symptoms, chamber size, shunt quantification when relevant, ischemia testing, CT or other anatomic imaging, and invasive hemodynamics."
            ],
            image: figure("angiogram-lad-pa-fistula.jpg", "Coronary angiogram showing an abnormal fistulous vessel from the LAD region toward the pulmonary artery.", "LAD-to-pulmonary-artery fistula example; assess origin, course, termination, and hemodynamic consequence.", "Basic Coronary Angiography, slides 46-47"),
            pearl: "The angiogram proves a connection; it does not alone prove a clinically important shunt or ischemic steal."
          },
          {
            id: "variants-anomalies",
            title: "Anomalous origin: origin is only the first sentence",
            body: [
              "The deck compares normal coronary origins with left main from the right cusp and RCA from the left cusp, then highlights two often benign variants: LCx arising from the right sinus or proximal RCA with a retroaortic course, and a high anterior RCA origin above the sinotubular ridge.",
              "Risk depends on the proximal course, not just the opposite-sinus label. An interarterial or intramural course, slit-like ostium, acute takeoff, and dynamic compression can be high-risk features. A retroaortic LCx is usually different in risk but matters enormously in mitral or aortic surgery because it may run close to the annulus or root. CT coronary angiography is particularly useful for three-dimensional course definition when invasive projections are ambiguous."
            ],
            images: [
              figure("anomaly-normal-origins.jpg", "Small diagram showing normal left and right coronary origins from their usual aortic sinuses.", "Normal coronary origins for comparison with opposite-sinus anomalies.", "Basic Coronary Angiography, slide 48"),
              figure("anomaly-left-main-from-right-cusp.jpg", "Small diagram showing a left main coronary artery arising from the right coronary cusp.", "Opposite-sinus left-main origin; the proximal course determines risk.", "Basic Coronary Angiography, slide 48"),
              figure("anomaly-rca-from-left-cusp.jpg", "Small diagram showing a right coronary artery arising from the left coronary cusp.", "Opposite-sinus RCA origin; define ostial morphology and proximal course.", "Basic Coronary Angiography, slide 48"),
              figure("anomalous-lcx-angiogram.jpg", "Small coronary angiographic frame showing an anomalous circumflex arising from the right side and coursing behind the aortic root.", "Anomalous LCx from the right sinus or proximal RCA, usually with a retroaortic course.", "Basic Coronary Angiography, slides 49-50")
            ],
            caution: "Do not call every opposite-sinus origin malignant and do not call it benign before the proximal course is defined."
          },
          {
            id: "variants-collaterals",
            title: "Collaterals: evidence of time, pressure gradients, and an alternate route",
            body: [
              "Coronary collaterals are pre-existing or recruited channels that enlarge in response to a chronic pressure gradient. They may connect conus to LAD, septal to septal, atrial branches, RV branches, PDA or posterolateral branches, or other epicardial pathways. Their presence often suggests chronic severe stenosis or occlusion, but their absence does not prove acuity.",
              "Report donor vessel, recipient vessel, direction and completeness of filling, and whether the distal target is visualized. Collaterals may reveal a bypassable vessel beyond a chronic total occlusion, but they do not guarantee target caliber, viability, or adequate runoff. They can also create donor-vessel jeopardy: a lesion in the donor may threaten both its native bed and the collateral-dependent bed."
            ],
            image: figure("coronary-collateral-pathways.jpg", "Multi-panel line diagram showing common coronary collateral pathways between right and left coronary branches.", "Common collateral pathways, including conal, septal, atrial, and posterior connections.", "Basic Coronary Angiography, slide 51"),
            pearl: "A collateralized occlusion is not a vessel that no longer matters. It may be a viable territory dependent on a vulnerable donor artery."
          },
          {
            id: "variants-aneurysm",
            title: "Coronary aneurysm: define, map, and look for thrombus",
            body: [
              "The source defines a coronary aneurysm as a localized diameter greater than 1.5 times the adjacent reference segment and quotes a broad incidence range of 0.15% to 4.9%, with left-main involvement rare. Listed causes include atherosclerosis, Kawasaki disease, prior PCI, inflammatory disease, trauma, and connective-tissue disorders.",
              "Angiography shows the contrast-filled lumen but may underestimate the true aneurysm size when mural thrombus is present. The report should describe location, maximal luminal dimension, adjacent reference, saccular or fusiform shape, thrombus suspicion, branch involvement, distal flow, embolic or ischemic features, and relation to a planned bypass or other operation. Observation, covered stent, coil/occlusion strategies, and surgery are among the source's options, but choice is individualized."
            ],
            image: figure("angiogram-coronary-aneurysm.jpg", "Coronary angiogram showing a focal aneurysmal dilation of a coronary artery.", "Coronary artery aneurysm teaching frame; angiography may underrepresent mural thrombus and true external size.", "Basic Coronary Angiography, slide 52"),
            caution: "Do not select management from diameter alone. Symptoms, growth, thrombus, embolization, branch anatomy, concomitant disease, and feasibility all matter."
          }
        ]
      },
      {
        id: "flow-perfusion",
        number: 10,
        title: "TIMI Epicardial Flow and TIMI Myocardial Perfusion Grade",
        kicker: "An open artery and a reperfused tissue bed are different observations",
        summary: "TIMI flow grade describes epicardial contrast transit; TIMI myocardial perfusion grade (TMPG) describes tissue-level contrast entry and washout. The two should be reported separately and both require temporal cine evidence.",
        objectives: [
          "Define TIMI grades 0 through 3 precisely.",
          "Define TMPG grades 0 through 3 using tissue entry and washout, and distinguish TMPG from myocardial blush grade (MBG).",
          "Explain why normal epicardial flow can coexist with impaired microvascular perfusion."
        ],
        sections: [
          {
            id: "flow-timi",
            title: "TIMI 0-3: speed and completeness in the epicardial vessel",
            body: [
              "TIMI flow grading describes antegrade passage of contrast beyond an obstruction. Grade 0 is no antegrade flow beyond the occlusion. Grade 1 is penetration beyond the obstruction without complete filling of the distal bed. Grade 2 is delayed or sluggish flow that nevertheless completely fills the distal vessel. Grade 3 is normal, brisk filling and clearance of the distal bed.",
              "The distinction between grades 1, 2, and 3 is temporal. A single fully opacified still could have arrived late and therefore cannot distinguish TIMI 2 from TIMI 3. Compare with an uninvolved vessel when appropriate, watch distal branches, and ensure injection and catheter position are adequate."
            ],
            table: {
              headers: ["TIMI grade", "Antegrade penetration", "Distal-bed filling", "Timing"],
              rows: [
                ["0", "None beyond occlusion", "None", "No antegrade transit"],
                ["1", "Faint penetration", "Incomplete", "Contrast fails to fully opacify the distal bed"],
                ["2", "Present", "Complete", "Delayed or sluggish compared with normal"],
                ["3", "Present", "Complete", "Normal brisk filling and clearance"]
              ]
            },
            caution: "Do not call TIMI 3 from a static frame. Complete filling without normal speed is TIMI 2."
          },
          {
            id: "flow-blush",
            title: "TMPG 0-3: tissue entry and washout",
            body: [
              "The deck's slide 54 uses TIMI myocardial perfusion grade (TMPG), a tissue-kinetics system. TMPG 0 is absent or minimal tissue contrast. TMPG 1 is slow entry without effective exit, with persistent staining into the next injection. TMPG 2 shows delayed entry and exit, with strongly persistent contrast after about three cardiac cycles. TMPG 3 resembles normal tissue: brisk entry and visible clearance, with only mild or moderate persistence after three cycles.",
              "TMPG should not be relabelled as myocardial blush grade (MBG). Classic MBG is a separate system based primarily on relative myocardial contrast density. Technique matters for either system: selective injection, stable exposure, comparable views, and cine long enough to see washout are required. Overlap, motion, collaterals, venous structures, and repeat injections can simulate staining."
            ],
            table: {
              headers: ["TMPG", "Entry", "Exit/washout", "Core interpretation"],
              rows: [
                ["0", "Minimal or absent", "No meaningful tissue phase", "No visible microvascular perfusion"],
                ["1", "Slow", "Little or no exit; persists to next injection", "Contrast enters but is trapped"],
                ["2", "Delayed", "Delayed; strongly persistent after three cycles", "Impaired but present tissue perfusion"],
                ["3", "Normal", "Clears or visibly diminishes after three cycles", "Normal tissue-level entry and exit"]
              ]
            },
            pearl: "TMPG is a movie of tissue contrast kinetics. If a source instead uses MBG, name that distinct density-based system explicitly."
          },
          {
            id: "flow-discordance",
            title: "TIMI-TMPG discordance and no-reflow reasoning",
            body: [
              "A vessel can have TIMI 3 epicardial flow while the supplied myocardium has a poor TMPG. This pattern suggests that the large conduit is open but microvascular perfusion remains impaired, as can occur with distal embolization, endothelial injury, edema, reperfusion injury, microvascular spasm, or extensive necrosis.",
              "The reverse apparent pattern should trigger a technique check: tissue staining despite incomplete epicardial filling may reflect collateral delivery, residual prior contrast, overlap, or an incorrectly identified culprit territory. Report both grades and the acquisition quality rather than forcing one composite label."
            ],
            bullets: [
              "TIMI answers: did contrast traverse the epicardial artery, completely and at normal speed?",
              "TMPG answers: did contrast enter and leave the downstream myocardial microcirculation normally?",
              "Good TIMI with poor TMPG is not a contradiction; it identifies different levels of the circulation.",
              "Collaterals can alter distal filling and tissue appearance and must be acknowledged.",
              "Clinical and ECG/hemodynamic response remain part of reperfusion assessment."
            ],
            caution: "Do not infer microvascular reperfusion solely from an open epicardial lumen."
          },
          {
            id: "flow-static-practice",
            title: "How to study flow from a static PDF responsibly",
            body: [
              "Because the supplied PDF contains no cine, this module teaches TIMI flow and TMPG through definitions, sequencing prompts, and written scenarios. The source frames may illustrate distal anatomy or a filling defect, but they cannot be scored for transit time or tissue washout.",
              "When a real cine loop becomes available, apply a three-pass method: first watch antegrade epicardial filling, then watch distal branch completion and clearance, then replay while focusing on myocardial tissue contrast entry and washout. Only after those passes assign separate TIMI and TMPG grades."
            ],
            steps: [
              "Pass 1: identify the frame of first distal penetration.",
              "Pass 2: determine whether and when the complete distal bed fills.",
              "Pass 3: observe tissue entry, peak myocardial contrast, and washout over at least three cycles.",
              "Compare with a non-culprit territory when exposure and projection permit.",
              "Document limiting factors such as short acquisition, repeat injection, motion, or overlap."
            ],
            pearl: "A responsible 'cannot grade from this still' is more expert than a confident invented TIMI or TMPG score."
          }
        ]
      },
      {
        id: "cath-adjuncts",
        number: 11,
        title: "LVgram, Hemodynamics, FFR/iFR, IVUS, and CTCA",
        kicker: "Choose the measurement that answers the unresolved question",
        summary: "Coronary angiography is one component of cardiac catheterization. Ventriculography, pressure measurements, physiology, intravascular imaging, and CT each answer different anatomic or functional questions.",
        objectives: [
          "Interpret the purpose and limitations of RAO/LAO left ventriculography.",
          "Link pressure and flow measurements to the clinical question.",
          "Select FFR/iFR, IVUS, or CTCA rather than treating them as interchangeable."
        ],
        sections: [
          {
            id: "adjuncts-lvgram",
            title: "Left ventriculography: chamber silhouette, motion, and regurgitation",
            body: [
              "The Key Questions reference describes RAO ventriculography for global function and anterobasal, anterior, apical, inferior, and inferobasal regional motion. LAO ventriculography profiles lateral, septal, and inferior regions. Comparison of end-diastolic and end-systolic silhouettes permits an EF estimate and classification of regional segments as normal, hypokinetic, akinetic, dyskinetic, or aneurysmal.",
              "A ventriculogram can also show mitral regurgitant opacification of the left atrium, and aortography can grade aortic regurgitation. These visual grades are load-, injection-, rhythm-, and projection-dependent and have largely complementary rather than automatic primacy over echocardiography or CMR. The supplied angiography deck lists ventriculography as a goal but includes no actual LVgram frames."
            ],
            table: {
              headers: ["View", "Regions emphasized", "Common interpretive issue"],
              rows: [
                ["RAO LVgram", "Anterobasal, anterior, apex, inferior, inferobasal", "Ectopy and foreshortening distort EF and wall motion"],
                ["LAO LVgram", "Lateral, septal, inferior", "Overlap and projection can obscure the true chamber border"],
                ["Aortography", "Aortic root and LV opacification from regurgitation", "Injection and hemodynamics affect apparent grade"]
              ]
            },
            bullets: [
              "Source-dated Sellers MR I: incomplete left-atrial opacification that clears with each beat; MR II: complete left-atrial opacification that does not clear with each beat.",
              "Sellers MR III: complete left-atrial opacification with density similar to the LV; MR IV: complete opacification in one beat, progressive density with subsequent beats, and pulmonary-vein reflux.",
              "Source-dated Sellers AR 1+: a small regurgitant jet without LV opacification; AR 2+: a jet with faint LV opacification.",
              "Sellers AR 3+: dense LV opacification, usually without a distinct jet; AR 4+: LV opacification denser than the aorta.",
              "These qualitative angiographic grades depend on injection, loading, rhythm, and projection. Contemporary valve severity is integrated with echocardiography or CMR rather than inferred from a single contrast grade."
            ],
            caution: "No LVgram image is present in the supplied slide deck; the section incorporates the Key Questions content without pretending a source frame exists."
          },
          {
            id: "adjuncts-hemodynamics",
            title: "Hemodynamics: pressures, gradients, output, and shunts",
            body: [
              "Cardiac catheterization can directly measure aortic, LV, right atrial, RV, pulmonary artery, and wedge pressures. Simultaneous or carefully timed pressure measurements can evaluate valve gradients, ventricular filling, pulmonary vascular load, and constrictive or restrictive patterns. Cardiac output may be estimated by Fick or thermodilution approaches, each with technical assumptions.",
              "For a coronary fistula or suspected intracardiac shunt, stepwise oxygen saturations and the Fick principle can estimate pulmonary-to-systemic flow (Qp:Qs). For valve area, the Key Questions reference describes Gorlin-type calculations based on transvalvular flow, ejection or filling period, and mean gradient. These calculations are flow-dependent and can mislead when output, regurgitation, timing, or pressure measurement is wrong."
            ],
            bullets: [
              "Correlate pressure waveforms with ECG and verify zero/reference level.",
              "Confirm that gradients are simultaneous or account for beat-to-beat variation.",
              "Use true mixed venous blood for Fick assumptions when accuracy matters.",
              "Recognize that wedge pressure estimates left atrial pressure only when the tracing and zone conditions are valid.",
              "For a fistula, anatomy plus shunt and ischemic consequence is stronger than anatomy alone."
            ],
            pearl: "Every hemodynamic number has a waveform, timing, calibration, and assumption behind it."
          },
          {
            id: "adjuncts-physiology",
            title: "FFR and iFR: lesion-level pressure physiology",
            body: [
              "FFR is the ratio of mean distal coronary pressure to aortic pressure during adequate maximal hyperemia. iFR is a resting pressure ratio measured during a diastolic wave-free period without pharmacologic hyperemia. Common decision thresholds are FFR <=0.80 and iFR <=0.89 for physiologic significance in appropriate lesions.",
              "Good technique requires equalizing the wire, positioning the sensor distal to the lesion, ensuring a stable aortic trace, inducing adequate hyperemia for FFR, avoiding pressure damping, and checking for wire drift on pullback. Serial or diffuse disease benefits from pullback mapping because one distal number represents the cumulative pressure loss. Microvascular dysfunction may blunt hyperemic flow and complicate interpretation; physiology must be integrated with symptoms, territory, and other testing."
            ],
            table: {
              headers: ["Feature", "FFR", "iFR"],
              rows: [
                ["State", "Maximal hyperemia", "Resting diastolic wave-free period"],
                ["Common threshold", "<=0.80", "<=0.89"],
                ["Strength", "Well-validated hyperemic lesion assessment", "Avoids adenosine and permits resting pullback"],
                ["Quality threats", "Inadequate hyperemia, damping, drift, serial/diffuse disease", "Drift, damping, rhythm variability, serial/diffuse disease"]
              ]
            },
            caution: "A pressure ratio does not tell the surgeon whether the distal artery is graftable, whether the myocardium is viable, or which conduit will have durable flow."
          },
          {
            id: "adjuncts-ivus-ctca",
            title: "IVUS and CTCA: lumen, wall, and three-dimensional course",
            body: [
              "IVUS advances an ultrasound transducer over a coronary wire to image the lumen and vessel wall in cross-section. It can reveal plaque burden, calcium distribution, remodeling, reference dimensions, stent expansion, and an ambiguous left-main lumen that angiography foreshortens or overlaps. It is an anatomic measurement: local validated criteria and the full clinical context should be used rather than one universal area cutoff.",
              "CT coronary angiography provides a noninvasive three-dimensional map with high value for excluding obstructive disease in suitable patients and for defining anomalous origin and course, aortic-root relationships, calcification, and selected graft anatomy. Motion, high or irregular heart rate, obesity, renal function, contrast allergy, heavy calcium blooming, very small vessels, and some stents can limit it. CTCA shows anatomy; stress imaging or invasive physiology may still be needed to establish ischemic significance."
            ],
            bullets: [
              "Ambiguous left main: IVUS often provides the most direct lumen and plaque geometry; physiology may help in suitable anatomy.",
              "Anomalous coronary: CTCA is excellent for defining interarterial, intramural, retroaortic, or prepulmonic course.",
              "Heavy calcium: angiography may underestimate plaque and CT blooming may overestimate lumen loss; intravascular imaging can resolve geometry.",
              "Grafts: CTCA may map origin and course in stable patients, while invasive angiography offers dynamic selective assessment and intervention when required.",
              "Intermediate stenosis: anatomy and physiology answer different questions and may both be needed."
            ],
            pearl: "Select the adjunct by the unresolved question: wall/lumen geometry for IVUS, three-dimensional noninvasive course for CTCA, and lesion-level pressure consequence for FFR/iFR."
          }
        ]
      },
      {
        id: "surgical-translation",
        number: 12,
        title: "From Angiogram to CABG Map and Graft-Failure Diagnosis",
        kicker: "The final report should change what happens in the operating room",
        summary: "A surgical read identifies prognosis-changing anatomy, graftable targets, healthy landing zones, distal runoff, conduit competition, and the likely mechanism when a graft or territory fails.",
        objectives: [
          "Convert branch-level angiography into a target-by-target bypass plan.",
          "Integrate lesion significance, target quality, territory, and conduit behavior.",
          "Diagnose early, intermediate, and late graft failure without assuming every postoperative ischemic event has the same mechanism."
        ],
        sections: [
          {
            id: "surgery-map",
            title: "Build the target map before naming the operation",
            body: [
              "The surgeon needs more than 'three-vessel disease.' For each territory, state the lesion that justifies revascularization, the best distal target, target caliber and wall quality, runoff, collateral dependence, competitive native flow, and whether viable myocardium is likely present. Note any ungraftable segment and the reason.",
              "Key Questions does not use one universal stenosis rule across every context. Its catheterization chapter calls greater than 60% diameter loss significant in a non-left-main artery and greater than 50% in the left main. Its CABG chapter frames significance as greater than 50% plus abnormal physiology, or greater than 90% anatomy, while its concomitant valve-surgery discussion distinguishes greater than 70% from the 50% to 70% range. Treat these as context-specific, source-dated definitions rather than interchangeable thresholds.",
              "In contemporary practice, intermediate lesions should be adjudicated with validated physiology or intravascular imaging when the result will change revascularization, while the final plan also integrates symptoms, ischemic territory, myocardial viability, anatomy, target quality, completeness, conduit strategy, comorbidity, and patient goals. Complex multivessel anatomy, particularly with diabetes, may favor CABG over PCI, but the decision remains a Heart Team and shared-decision process rather than an anatomy-only reflex."
            ],
            steps: [
              "Name left-main disease and whether it is protected or unprotected.",
              "List LAD/diagonal, LCx/OM, and RCA/PDA/PL targets separately.",
              "For each target, state stenosis, physiology if available, caliber, landing zone, distal disease, and runoff.",
              "Identify collateral-dependent beds and donor-vessel jeopardy.",
              "Link each proposed target to viable myocardial territory and expected completeness of revascularization.",
              "Document uncertainty that may change the operation and the test needed to resolve it."
            ],
            caution: "Do not equate vessel count with graft count. One diseased system may have several useful targets, and a severe lesion may have no safe distal landing zone."
          },
          {
            id: "surgery-target-conduit",
            title: "Target quality, runoff, and competitive flow",
            body: [
              "A favorable target has a meaningful viable territory, adequate caliber, a relatively healthy and accessible distal wall, and good runoff beyond the anastomosis. Diffuse calcification, tiny caliber, distal occlusion, severe distal disease, or a poor bed can defeat an otherwise perfect anastomosis.",
              "Competitive flow occurs when native antegrade flow through a modest stenosis competes with graft inflow. Low graft utilization can produce poor flow, arterial-graft spasm or stringing, and eventual closure. This is especially relevant when matching an arterial conduit to an intermediate lesion. Physiology may inform Heart Team target selection and competitive-flow risk, but evidence for physiology-guided CABG target selection is less established than for PCI; anatomy, viable territory, completeness, conduit choice, and distal target quality remain central."
            ],
            table: {
              headers: ["Angiographic feature", "CABG question", "Possible consequence"],
              rows: [
                ["Severe proximal lesion, healthy distal vessel", "Is there a clean landing zone with good runoff?", "Usually favorable target"],
                ["Moderate lesion, normal physiology", "Will native flow outcompete an arterial graft?", "String sign or graft closure"],
                ["Diffuse distal disease/calcification", "Can a safe arteriotomy and durable anastomosis be made?", "Poor flow, technical difficulty, early failure"],
                ["Collateralized chronic occlusion", "Is the distal vessel visible, viable, and graftable?", "Potentially valuable target despite absent antegrade flow"],
                ["Small branch with limited territory", "Does benefit justify conduit and operative complexity?", "May not merit grafting despite severe stenosis"]
              ]
            },
            pearl: "A graft needs both a reason to carry flow and somewhere healthy for that flow to go."
          },
          {
            id: "surgery-graft-failure",
            title: "Graft failure by timing and mechanism",
            body: [
              "Very early graft dysfunction is often technical or thrombotic: anastomotic narrowing, kink, twist, tension, poor lie after the heart fills, spasm, dissection, air, poor target, inadequate runoff, or competitive flow. Intraoperative transit-time flow and TEE regional wall motion can identify a problem while revision is still possible.",
              "Over weeks to months, intimal hyperplasia becomes important, especially in vein grafts. Over years, accelerated atherosclerosis and degeneration dominate vein-graft failure, while native disease also progresses. Arterial grafts are more durable but can fail from technical issues, competitive flow, spasm, or disease.",
              "Postoperative ischemia should be localized: new inferior changes suggest RCA/PDA territory, lateral changes suggest LCx/OM, and anterior changes suggest LAD/LIMA. Urgent angiography or operative reassessment is selected according to stability and local pathways. Do not medicate around a new territorial wall-motion abnormality without investigating the graft and native supply."
            ],
            table: {
              headers: ["Timing", "Dominant mechanisms", "Angiographic questions"],
              rows: [
                ["Hours to days", "Technical fault, thrombosis, kink/twist, spasm, air, poor runoff", "Is the graft continuous and patent? Is the anastomosis narrowed? How is the distal bed filled?"],
                ["Weeks to months", "Intimal hyperplasia, evolving technical stenosis", "Focal graft-body or anastomotic narrowing? Competitive flow?"],
                ["Years", "Vein-graft atherosclerosis/degeneration, native progression", "Diffuse friable disease, aneurysm, thrombus, new native targets, arterial-graft status"]
              ]
            },
            caution: "Distal native filling does not prove graft patency. It may arrive through another graft, native antegrade flow, or collaterals."
          },
          {
            id: "surgery-integrated-report",
            title: "The surgeon-ready synthesis",
            body: [
              "A high-quality synthesis is short because the underlying review was complete. It names dominance, major anatomy, lesion severity and uncertainty, physiology, flow, distal targets, grafts, and the operative consequence. It also states what cannot be concluded from the available study.",
              "Example: 'Right-dominant circulation. Short left main with an intermediate eccentric distal lesion that remains ambiguous in caudal views; IVUS or validated physiology is required before committing to left-main revascularization. Proximal LAD has severe calcified disease with a 2 mm, relatively preserved mid-distal target and TIMI 3 flow. Large OM1 has severe focal disease and good runoff. RCA has a chronic mid occlusion with septal collaterals filling a graftable PDA. This anatomy could support LIMA-LAD plus additional OM and posterior targets, subject to Heart Team review and confirmation of left-main significance.'"
            ],
            bullets: [
              "Projection and quality: enough views to trust each major conclusion.",
              "Anatomy: dominance, variants, branch-level map, collaterals.",
              "Disease: lesion location, morphology, calcification, distal bed.",
              "Physiology: FFR/iFR or rationale for further adjudication.",
              "Flow/perfusion: TIMI flow and TMPG only when cine supports grading.",
              "Operation: target, landing zone, runoff, conduit competition, and graft status.",
              "Uncertainty: one explicit next test or conference question."
            ],
            pearl: "End every read with the consequence: what becomes more likely, less likely, unsafe, or unresolved in the operating room?"
          }
        ]
      },
      {
        id: "safe-acquisition",
        number: 2,
        title: "Procedure, Engagement, and Injection Safety",
        kicker: "A normal pressure waveform is the permission to inject",
        summary: "Angiography begins before cine. Access, catheter choice, flushing, coaxial engagement, pressure confirmation, and a small test injection create the conditions for diagnostic images without turning the catheter into an occlusive plug.",
        objectives: [
          "Describe the procedural arc from arterial access to hemostasis.",
          "Explain common RCA and LCA engagement concepts without reducing them to blind maneuvers.",
          "Respond correctly to damping or ventricularization before contrast injection."
        ],
        sections: [
          {
            id: "safe-procedure-arc",
            title: "The procedure from access to final check",
            body: [
              "Coronary angiography uses arterial access to advance preformed catheters to the aortic root, selectively engage each coronary ostium, and record contrast-filled cine in several projections. Radial and femoral access are common contemporary routes; the source also lists brachial and ulnar access. Choice depends on anatomy, prior grafts, vascular disease, urgency, operator skill, and local practice.",
              "The procedure may also include aortic pressure, left ventricular pressure, ventriculography, valve gradients, right-heart pressures, cardiac output, shunt calculation, pressure-wire physiology, or intravascular imaging. These are distinct measurements. A complete cath study is not automatically synonymous with a complete coronary-only angiogram.",
              "Key Questions lists chronic stable angina requiring anatomic definition, acute coronary syndromes, abnormal ischemia testing, ischemic cardiomyopathy, selected preoperative valve or aortic surgery, cardiac-arrest survivors, and selected high-risk occupations as teaching indications. These are source-dated categories, not automatic mandates: contemporary test selection depends on presentation, pretest likelihood, prior noninvasive imaging, procedural risk, and whether an invasive result will change care."
            ],
            bullets: [
              "Source-listed relative contraindications include acute type A aortic dissection, aortic-valve infective endocarditis with vegetation, decompensated heart failure or acute pulmonary edema, active infection, renal dysfunction, and radiographic-contrast hypersensitivity.",
              "'Relative' means weigh urgency, alternative imaging, stabilization, renal protection, allergy planning, and the consequence of delay; it does not mean every item is managed identically.",
              "Before a graft study, confirm the operative report and expected graft origins so an incomplete search is not mistaken for an occluded graft."
            ],
            steps: [
              "Confirm indication, consent, renal and bleeding risk, allergy history, and the planned access/graft study.",
              "Obtain arterial access and administer the locally specified antithrombotic and vasodilator regimen.",
              "Advance the catheter over a wire to the aortic root; remove the wire only when the catheter is safely positioned and aspirated/flushed.",
              "Engage coaxially, confirm pressure, test inject, position the detector, and acquire the planned orthogonal views.",
              "Review the study before ending: both systems, dominance, lesion orthogonality, distal beds, grafts if present, complications, and unanswered questions.",
              "Remove the sheath and obtain hemostasis with access-specific monitoring."
            ],
            caution: "Procedure details such as fasting, sedation, anticoagulation, and closure strategy are patient- and institution-specific; use the local protocol rather than memorizing a dated recipe."
          },
          {
            id: "safe-engagement",
            title: "RCA and LCA engagement as coaxial alignment",
            body: [
              "The source presents JR4 with controlled clockwise rotation as a usual RCA starting catheter and JL4 as a usual left-coronary starting catheter, with Amplatz, Williams, or other shapes selected for aortic-root and ostial anatomy. The number is not the principle. The principle is to align the catheter tip coaxially with the ostium while avoiding deep intubation, scraping, or forceful advancement.",
              "The RCA often arises lower from the right sinus. The left main usually arises high in the left sinus just below the sinotubular ridge. A short left main, separate LAD and LCx ostia, root dilation, high takeoff, or anomalous origin can make a standard curve unsafe or non-diagnostic. Catheter behavior and pressure are data: repeated deep seating or damping is a reason to change the approach, not a challenge to inject harder."
            ],
            bullets: [
              "RCA: size the catheter to the aorta; rotate under fluoroscopy; avoid advancing the tip down the vessel.",
              "LCA: approach the left cusp, allow the curve to form, and watch for deep seating in a short left main or separate ostia.",
              "Non-coaxial engagement can produce ostial injury, misleading contrast streaming, or inadequate opacification.",
              "An ostial stenosis and catheter-induced damping can mimic one another; withdraw, normalize pressure, and reassess."
            ],
            pearl: "The safest catheter is the one whose shape matches the root and reaches the ostium without force while preserving a normal pressure waveform."
          },
          {
            id: "safe-manifold-sequence",
            title: "Manifold and injection sequence",
            body: [
              "Whether contrast is delivered through a manual manifold or an automatic injector, the safety sequence is the same: exclude air, confirm pressure, engage, reconfirm pressure, test, then acquire. The source describes holding a contrast-filled manifold at roughly 30 to 40 degrees, but the transferable lesson is continuous visual and tactile control of a completely de-aired system.",
              "The small test injection is not a ceremonial step. It confirms selective filling, detects deep or non-coaxial seating, identifies an unexpected ostium or proximal lesion, and gives the operator a chance to withdraw before a full injection. The detector should be positioned close enough for image quality without colliding with the patient or equipment."
            ],
            steps: [
              "Aspirate and flush the catheter; remove all visible air from catheter, tubing, and manifold.",
              "Confirm a high-fidelity aortic pressure trace before engagement.",
              "Engage under fluoroscopy and recheck that the waveform remains normal.",
              "Make a small test injection while watching the ostium and catheter tip.",
              "Position the image receptor and repeat a brief fluoroscopic check for table, detector, and breath-hold geometry.",
              "Acquire cine with controlled injection, then refill and reset without introducing air.",
              "Between views, keep pressure and catheter position visible; do not assume a previously safe position remains safe."
            ],
            caution: "A forceful injection through an occlusive or deeply seated catheter can extend dissection, create ischemia, or deliver air."
          },
          {
            id: "safe-pressure",
            title: "Damping and ventricularization: stop before contrast",
            body: [
              "A normal aortic trace has an arterial systolic upstroke, dicrotic notch, and diastolic pressure. Damping means loss of pulse amplitude and lower pressure. Ventricularization produces a ventricular-like contour because the catheter tip has functionally isolated a small coronary segment from the aorta. Both mean that the catheter may be obstructing flow or sitting against the vessel wall.",
              "The immediate response is to stop, do not inject, and withdraw until the normal aortic waveform returns. Then consider deep seating, non-coaxial contact, catheter size, air in the line, spasm, or true proximal/ostial disease. The source's 'hit and run' trace is a memorable failure: contrast was injected despite ventricularization. The durable rule is simpler - no normal pressure, no injection."
            ],
            bullets: [
              "Recognize the abnormal trace before cine starts.",
              "Withdraw to the aortic root and confirm full waveform recovery.",
              "Re-aspirate and flush if air or clot is possible.",
              "Change catheter shape or size if safe coaxial engagement cannot be maintained.",
              "If ostial disease remains possible, use nonselective imaging, careful alternative engagement, intravascular imaging, or other objective assessment as appropriate."
            ],
            caution: "Do not inject into a damped or ventricularized waveform. A single unsafe injection can turn a diagnostic study into left-main or RCA ischemia, dissection, arrhythmia, or air embolism.",
            image: figure("pressure-ventricularization-waveform.png", "Hemodynamic trace showing a normal aortic waveform followed by catheter-induced ventricularization and an unsafe contrast injection event.", "Pressure waveform challenge: ventricularization occurs before the source's labelled unsafe 'hit and run' injection.", "Basic Coronary Angiography, slide 15")
          }
        ]
      },
      {
        id: "coronary-anatomy",
        number: 3,
        title: "Coronary Anatomy, Branches, Territories, and Dominance",
        kicker: "Trace from ostium to crux before counting lesions",
        summary: "Projection recognition becomes reliable when the learner understands where each vessel runs in three dimensions and which myocardial territory each branch supplies.",
        objectives: [
          "Trace RCA, LM, LAD, and LCx with their major branches.",
          "Link branches to myocardial territories and operative targets.",
          "Define right, left, and codominance using the crux and posterior circulation."
        ],
        sections: [
          {
            id: "anatomy-rca",
            title: "RCA: right AV groove to the crux",
            body: [
              "The right coronary artery arises from the right aortic sinus, commonly lower than the left coronary origin, and courses in the right atrioventricular groove toward the crux. In a right-dominant circulation it gives the posterior descending artery and continues as one or more posterolateral branches. The source estimates that the RCA supplies roughly one quarter to one third of LV myocardium, but territory varies substantially with dominance.",
              "Proximal branches may include a conus artery and the sinoatrial nodal artery. Acute marginal or right ventricular marginal branches run toward the RV free wall. Near the crux, an AV nodal branch may arise. The PDA runs in the posterior interventricular groove and gives septal perforators; the posterolateral system spreads across the inferior-lateral LV."
            ],
            bullets: [
              "Conus branch: may arise separately from the right sinus and can participate in collateral pathways.",
              "SA nodal branch: commonly from the RCA but can arise from LCx.",
              "Acute marginal branches: important RV free-wall supply.",
              "PDA: follows the 'floor' toward the apex and gives septal branches.",
              "Posterolateral branches: turn across the inferior-lateral LV rather than staying in the interventricular groove."
            ],
            pearl: "Do not call dominance from vessel size. Call it from the artery that reaches the crux and gives the PDA, then describe large posterolateral supply."
          },
          {
            id: "anatomy-left-main-lad",
            title: "Left main and LAD: the anterior interventricular axis",
            body: [
              "The left main arises high in the left aortic sinus just below the sinotubular ridge. It may be short, and some patients have separate LAD and LCx ostia. A short left main magnifies the danger of deep catheter seating and makes ostial or bifurcation disease especially projection-sensitive.",
              "The LAD leaves the distal left main and descends in the anterior interventricular groove, usually reaching or wrapping the apex. Septal perforators dive into the interventricular septum; diagonal branches run over the anterolateral LV. The source notes that an LAD can be relatively short and that a ramus intermedius may arise between LAD and LCx. LAD distribution often represents the largest single LV territory."
            ],
            bullets: [
              "Proximal LAD: from the left-main bifurcation to the first major septal/diagonal landmarks, according to the reporting convention used.",
              "Septal perforators: intramyocardial septal supply and useful orientation clues in cranial views.",
              "Diagonals: epicardial anterolateral targets; number, size, and naming vary.",
              "Ramus intermedius: a third branch of a trifurcating left main, not a diagonal or obtuse marginal by default.",
              "Distal LAD: assess whether it reaches the apex, wraps inferiorly, is diffusely diseased, or is suitable for LIMA landing."
            ],
            caution: "A foreshortened proximal LAD can hide lesion length or make the left-main bifurcation look deceptively simple."
          },
          {
            id: "anatomy-lcx",
            title: "LCx and obtuse marginals: follow the left AV groove",
            body: [
              "The circumflex arises from the distal left main and runs in the left atrioventricular groove. Obtuse marginal branches leave the groove and sweep over the lateral or posterolateral LV. In left dominance, the LCx continues to the crux and supplies the PDA; its share of LV myocardium therefore expands markedly.",
              "Projection is essential because the LCx can overlap the left main, LAD, or spine and is often foreshortened. The deck's recognition rule is useful: in cranial left-coronary views the LCx tends to appear high, while in caudal views it drops low and the AV-groove course opens."
            ],
            bullets: [
              "Proximal LCx: inspect the ostium and left-main bifurcation in caudal views.",
              "Obtuse marginals: describe their number, caliber, disease, and distal runoff rather than assuming OM1 is always the same branch.",
              "Posterolateral branches: distinguish from a dominant PDA by course and septal branches.",
              "SA nodal branch: may arise from LCx and travel posteriorly.",
              "Surgical translation: a large OM with a soft landing zone and healthy distal bed is different from a tiny diffusely diseased branch despite identical proximal stenosis."
            ],
            pearl: "If the LCx is hard to follow, change the projection. Do not fill a geometric gap with certainty."
          },
          {
            id: "anatomy-dominance",
            title: "Dominance and the posterior circulation",
            body: [
              "The primary angiographic definition of dominance asks which artery reaches the crux and gives the PDA. Right dominance means RCA supplies the PDA; left dominance means LCx supplies it. Codominance is used when the posterior circulation is meaningfully shared, often with the PDA arising from RCA and a large posterolateral contribution from LCx.",
              "Dominance changes the meaning of an occlusion and the bypass map. A proximal dominant LCx can jeopardize lateral, inferior, and posterior septal territories; a proximal dominant RCA can threaten RV, inferior LV, AV nodal, PDA, and posterolateral supply. The operative report should therefore state the posterior branches and territories, not merely 'right dominant.'"
            ],
            table: {
              headers: ["Pattern", "PDA origin", "Posterolateral contribution", "Surgical implication"],
              rows: [
                ["Right dominant", "RCA", "Usually RCA predominant", "Distal RCA/PDA/PL targets may represent a broad inferior territory"],
                ["Left dominant", "LCx", "LCx", "Proximal LCx disease carries a larger territory and may create multiple lateral/posterior targets"],
                ["Codominant", "Usually RCA PDA", "Substantial LCx posterolateral supply", "Name each target and territory; one label cannot replace branch-level planning"]
              ]
            },
            caution: "Dominance is an anatomic description, not a direct measure of physiologic importance or target quality."
          }
        ]
      },
      {
        id: "projection-geometry",
        number: 4,
        title: "Projection Geometry and View Selection",
        kicker: "Move the detector to separate the structure you need to judge",
        summary: "RAO/LAO rotation changes vessel overlap; cranial/caudal tilt changes the apparent relationship of the LAD, LCx, bifurcation, and distal RCA. View selection is an intervention against ambiguity.",
        objectives: [
          "Explain RAO/LAO and cranial/caudal detector geometry.",
          "Use the four standard left-coronary corners and standard RCA views.",
          "Select supplemental views to solve overlap, foreshortening, or graft questions."
        ],
        sections: [
          {
            id: "geometry-axes",
            title: "Two axes, one moving three-dimensional tree",
            body: [
              "RAO and LAO describe rotation of the detector around the patient. Cranial and caudal describe tilt toward the head or feet. Combining the axes changes which coronary segments lie parallel to the detector and which separate from one another.",
              "A helpful mental model is to imagine looking around the heart while also tilting above or below it. Cranial angulation generally elongates the LAD and separates diagonals and septals. Caudal angulation generally opens the left-main bifurcation and LCx course. These are tendencies, not substitutes for watching the actual vessel."
            ],
            images: [
              figure("cranial-caudal-angulation.png", "Line diagram showing cranial and caudal angulation of the angiographic detector around a supine patient.", "Detector tilt: cranial versus caudal angulation.", "Basic Coronary Angiography, slide 16"),
              figure("rao-lao-angulation.png", "Line diagram showing right anterior oblique and left anterior oblique rotation around a supine patient.", "Detector rotation: RAO versus LAO.", "Basic Coronary Angiography, slide 17"),
              figure("projection-rao-caudal-geometry.png", "C-arm geometry inset demonstrating a right anterior oblique projection with caudal angulation.", "RAO caudal acquisition geometry paired with its coronary-tree projection.", "Basic Coronary Angiography, slide 20")
            ],
            pearl: "Name both axes. 'LAO' alone is incomplete when cranial versus caudal tilt changes the structure being opened."
          },
          {
            id: "geometry-left-corners",
            title: "The four standard left-system corners",
            body: [
              "The source organizes left-coronary acquisition into four recurring combinations. Exact angles are starting points that must be adjusted for body habitus, cardiac orientation, root anatomy, and the lesion being interrogated. The purpose of the view matters more than reproducing a number.",
              "A complete lesion assessment usually needs at least two suitably separated projections. Orthogonality reduces the chance that an eccentric lesion, overlap, or foreshortening drives a false visual estimate."
            ],
            table: {
              headers: ["Starting projection", "Best opening question", "Structures emphasized"],
              rows: [
                ["LAO 40 / cranial 20", "How do LAD and diagonals separate?", "LAD, diagonals, septal orientation"],
                ["LAO 40 / caudal 20", "Can I open the distal left main?", "Left-main bifurcation, proximal LAD, proximal LCx; spider view"],
                ["RAO 20 / caudal 20", "Can I follow the LCx in the AV groove?", "LM and proximal-to-distal LCx, obtuse marginals"],
                ["RAO 10 / cranial 40", "Can I elongate the proximal and mid LAD?", "LAD, septals, diagonals with LCx displaced high"]
              ]
            },
            images: [
              figure("projection-lao-cranial-tree.png", "Schematic left coronary tree in LAO cranial projection with LAD and diagonal branches separated.", "LAO cranial projection map for LAD and diagonal separation.", "Basic Coronary Angiography, slide 21"),
              figure("projection-rao-caudal-tree.png", "Schematic left coronary tree in RAO caudal projection with left main and circumflex course displayed.", "RAO caudal projection map for the left main and LCx system.", "Basic Coronary Angiography, slide 20")
            ]
          },
          {
            id: "geometry-supplemental",
            title: "Supplemental views are problem-solving views",
            body: [
              "The deck lists AP cranial for LAD, AP caudal for left main and LCx, steep LAO, true lateral, and additional distal-RCA views. These are not decorative extras. They are selected when a standard corner leaves a clinical question unresolved.",
              "Steep LAO can profile the left-main origin and bifurcation but may increase radiation and overlap depending on the patient. True lateral at about 90 degrees, with arms positioned safely, can display the LIMA-to-LAD insertion and clarify anterior-posterior relationships. The best supplemental view is the one that changes uncertainty into a traceable segment."
            ],
            bullets: [
              "AP/cranial 30 to 40: elongates LAD and may separate septal/diagonal branches.",
              "AP/caudal: opens the left-main and proximal LCx region in selected anatomy.",
              "Steep LAO greater than 60 degrees: profiles left-main geometry in selected patients.",
              "True lateral near 90 degrees: useful for LIMA-to-LAD insertion and anterior graft relationships.",
              "LAO 50 / cranial 30 or AP cranial: can improve distal RCA bifurcation separation."
            ],
            images: [
              figure("projection-steep-lao-tree.png", "Schematic left coronary tree in a steep LAO projection.", "Steep LAO supplemental projection for left-main and left-system geometry.", "Basic Coronary Angiography, slide 22"),
              figure("projection-true-lateral-tree.png", "Schematic coronary and LIMA-to-LAD relationship in a true lateral projection.", "True lateral projection used to profile the LIMA-to-LAD insertion.", "Basic Coronary Angiography, slide 23")
            ]
          },
          {
            id: "geometry-errors",
            title: "Overlap, foreshortening, parallax, and false confidence",
            body: [
              "Foreshortening compresses a vessel's length into the imaging plane, making a long lesion appear short and obscuring landing zones. Overlap superimposes branches or calcium. Parallax makes catheter and ostial alignment appear different as the detector moves. Cardiac and respiratory motion can blur a borderline narrowing.",
              "The correction is active: change projection, ask for a breath-hold if safe, reduce motion, optimize contrast, and compare an orthogonal view. Quantitative tools can measure only the image supplied to them; they do not rescue a foreshortened or poorly opacified reference segment."
            ],
            bullets: [
              "A lesion that disappears in an orthogonal view may be overlap, but eccentric disease can also change apparent severity.",
              "An ostial lesion needs a view that separates the ostium from catheter and aortic cusp.",
              "Bifurcation disease needs both branches opened and the carina distinguished from plaque.",
              "Diffuse disease can make the 'normal' reference segment abnormal, underestimating true plaque burden.",
              "Severe calcification can obscure lumen edges and degrade CTCA and angiographic estimates in different ways."
            ],
            caution: "Do not solve poor geometry by averaging guesses. Acquire the view that answers the question or use an adjunct."
          }
        ]
      },
      {
        id: "left-system-lab",
        number: 5,
        title: "Left Coronary Projection and Vessel Lab",
        kicker: "Use branch direction and vessel position to name the view",
        summary: "Left-system recognition becomes predictable when the learner follows the left main into LAD and LCx, then uses diagonal, septal, obtuse marginal, and ramus branch directions to confirm the projection.",
        objectives: [
          "Recognize LAO cranial, LAO caudal, RAO cranial, and RAO caudal left-system images.",
          "Trace LM, LAD, LCx, diagonals, septals, OMs, and ramus intermedius.",
          "Explain why cranial and caudal views move the apparent LCx position."
        ],
        sections: [
          {
            id: "left-lao-cranial",
            title: "LAO cranial: LAD and diagonal separation",
            body: [
              "In LAO cranial projection, the LAD is elongated and its diagonals fan away, while septal perforators dive toward the septum. This is a useful view for proximal-to-mid LAD and diagonal relationships, although the left-main bifurcation or LCx ostium may be less open than in a caudal view.",
              "Begin at the catheter tip and trace the left main. At the bifurcation, identify the long vessel descending toward the apex as LAD. Branches running laterally over the LV are diagonals; shorter branches diving medially are septals. The LCx appears relatively high in cranial views."
            ],
            image: figure("angiogram-left-lao-cranial.jpg", "Unlabelled left coronary angiogram in LAO cranial projection showing left main, LAD, diagonal branches, and circumflex.", "LAO cranial left coronary angiogram for branch tracing.", "Basic Coronary Angiography, slide 26"),
            pearl: "Do not identify LAD by brightness. Identify it by continuous descent toward the apex and its septal/diagonal branch pattern."
          },
          {
            id: "left-spider",
            title: "LAO caudal spider: open the distal left main",
            body: [
              "The LAO caudal or 'spider' view spreads the left main, proximal LAD, and proximal LCx around the bifurcation. It is particularly valuable for distal left-main and ostial branch disease, provided the catheter does not obscure the ostium and the anatomy is not excessively foreshortened.",
              "The LAD descends from the center of the bifurcation, while the LCx courses around the left AV groove and obtuse marginals extend laterally. A third substantial branch between LAD and LCx is a ramus intermedius. Name it by origin and course rather than by the source deck's informal mnemonic."
            ],
            image: figure("angiogram-left-spider.jpg", "Unlabelled left coronary angiogram in LAO caudal spider projection showing the distal left main bifurcation.", "LAO caudal spider view for distal left-main, proximal LAD, proximal LCx, and obtuse marginal relationships.", "Basic Coronary Angiography, slide 28"),
            caution: "Spider view is valuable but not infallible. Left-main disease still requires orthogonal views and objective adjudication when intermediate or foreshortened."
          },
          {
            id: "left-rao-cranial-caudal",
            title: "RAO cranial versus RAO caudal",
            body: [
              "RAO cranial tends to elongate the LAD and display septal and diagonal branches, with the LCx displaced high. RAO caudal drops the LCx low and follows its atrioventricular-groove course, often separating obtuse marginals and revealing proximal-to-distal LCx disease.",
              "A productive comparison is to ignore labels and watch the same two systems change position. The LAD remains the vessel heading toward the apex; the LCx moves from a high, compressed appearance in cranial tilt to a lower, more open course in caudal tilt. That high/low rule is a clue, not a standalone diagnosis of projection."
            ],
            images: [
              figure("angiogram-left-rao-cranial.jpg", "Unlabelled left coronary angiogram in RAO cranial projection showing elongated LAD with diagonal and septal branches.", "RAO cranial left-system image: LAD emphasized and LCx positioned high.", "Basic Coronary Angiography, slides 27 and 29"),
              figure("angiogram-left-rao-caudal.jpg", "Unlabelled left coronary angiogram in RAO caudal projection showing an opened circumflex and obtuse marginal system.", "RAO caudal left-system image: LCx positioned low and followed through the AV groove.", "Basic Coronary Angiography, slide 30")
            ],
            pearl: "Cranial separates LAD branches; caudal opens the LCx and left-main bifurcation. Verify with the whole tree."
          },
          {
            id: "left-system-tracing",
            title: "A branch-by-branch tracing routine",
            body: [
              "Labeling is safest when it is continuous. Start at the ostium, trace the left main to its division, then trace LAD and every major diagonal/septal branch to the distal bed. Return to the bifurcation and trace LCx, obtuse marginals, and any posterolateral continuation. If a ramus is present, trace it independently.",
              "For each potential bypass target, add the information a surgeon needs: size relative to adjacent branches, disease at and beyond the proposed landing zone, calcification, distal runoff, competitive native flow, and whether the territory appears viable or collateralized."
            ],
            steps: [
              "Ostium and left-main shaft: length, catheter overlap, damping, plaque, bifurcation angle.",
              "LAD: proximal, mid, distal/apical course; septals; diagonals; diffuse disease.",
              "LCx: ostium, AV-groove segment, OMs, posterolateral branches, dominance.",
              "Ramus: origin between LAD and LCx, caliber, territory, and disease.",
              "Distal beds: caliber, filling, collaterals, and a plausible disease-free landing zone."
            ],
            caution: "Branch names are communication tools. When numbering is ambiguous, describe origin and territory rather than forcing a misleading label."
          }
        ]
      },
      {
        id: "right-and-graft-lab",
        number: 6,
        title: "RCA, Posterior Circulation, and Graft View Lab",
        kicker: "The distal bifurcation tells you whether the view is doing its job",
        summary: "RCA interpretation depends on following the AV-groove course to the crux, separating PDA from posterolateral branches, and recognizing when cranial angulation or a graft-specific projection is needed.",
        objectives: [
          "Recognize standard LAO and RAO RCA projections.",
          "Differentiate PDA, posterolateral, acute marginal, and nodal branches.",
          "Select graft views and identify why a native-only study may be surgically incomplete."
        ],
        sections: [
          {
            id: "right-lao",
            title: "LAO cranial RCA: the C-shaped course",
            body: [
              "In the source's LAO 40 / cranial 20 starting view, the RCA often forms a recognizable C. This view profiles proximal and mid RCA and, with sufficient cranial tilt, can separate the distal bifurcation at the crux.",
              "Trace from the ostium along the right AV groove. Acute marginal branches travel toward the RV free wall. At the crux, the PDA turns along the posterior interventricular groove toward the apex, while posterolateral branches continue over the inferior-lateral LV."
            ],
            images: [
              figure("projection-rca-lao-cranial.png", "Schematic right coronary artery in LAO cranial projection forming a C-shaped course.", "LAO cranial RCA projection map and the 'C' recognition rule.", "Basic Coronary Angiography, slide 24"),
              figure("angiogram-rca-lao-cranial.jpg", "Unlabelled right coronary angiogram in LAO cranial projection showing proximal, mid, and distal RCA.", "LAO cranial RCA angiogram for continuous vessel tracing.", "Basic Coronary Angiography, slide 31")
            ],
            pearl: "The C shape is a projection clue. Dominance still comes from the PDA and posterior circulation, not from the shape alone."
          },
          {
            id: "right-rao-distal",
            title: "RAO RCA: separate the PDA from posterolateral branches",
            body: [
              "An RAO view profiles proximal and mid RCA from another axis, but a flat RAO image may overlap the distal bifurcation. Adding cranial angulation lifts and separates the branches. The PDA tends to run along the 'floor' of the heart and gives septal perforators; posterolateral branches spread across the inferior-lateral surface.",
              "If the PDA and posterolateral system cannot be named confidently, state that limitation. The correct response is an improved projection, not a confident label based on where a branch seems to point in one compressed frame."
            ],
            images: [
              figure("projection-rca-rao-cranial.png", "Schematic right coronary artery in RAO projection with cranial separation of distal branches.", "RAO RCA map: cranial angulation helps separate PDA and posterolateral branches.", "Basic Coronary Angiography, slide 25"),
              figure("angiogram-rca-rao.jpg", "Unlabelled right coronary angiogram in RAO projection without enough cranial separation of the distal bifurcation.", "Suboptimal RAO RCA frame in which PDA and posterolateral branches overlap.", "Basic Coronary Angiography, slide 33")
            ],
            caution: "A distal branch without clearly seen septals or groove course should not be declared the PDA from a single overlapped still."
          },
          {
            id: "graft-projections",
            title: "Graft angiography is a separate acquisition task",
            body: [
              "A post-CABG study is incomplete if it images only native coronaries. Each graft must be found, engaged or nonselectively visualized, followed from origin to distal anastomosis, and assessed for body, valves or clips, kinks, competitive flow, anastomotic stenosis, and distal runoff.",
              "The supplied angiography deck lists SVG and LIMA angiography as objectives but contains no true graft angiograms. It does note that a true lateral view can profile the LIMA-to-LAD insertion. In practice, projection selection depends on graft origin, operative note, clips, conduit course, and the suspected failure mechanism."
            ],
            bullets: [
              "LIMA: follow subclavian origin, mammary course, pedicle clips, distal anastomosis, and LAD runoff; true lateral can profile the insertion.",
              "Aortocoronary vein or radial graft: identify the proximal marker/origin, graft body, distal anastomosis, native target, and retrograde/antegrade filling.",
              "Composite Y/T graft: trace the inflow limb before interpreting a branch as independently occluded.",
              "Sequential graft: assess every side-to-side and terminal anastomosis; distal filling can hide a proximal segment problem.",
              "Competitive flow: compare graft filling with native antegrade flow; a patent native vessel can reduce arterial-graft opacification without a discrete anastomotic lesion."
            ],
            image: figure("projection-true-lateral-geometry.png", "Geometry inset showing a true lateral angiographic projection used for the anterior LIMA-to-LAD relationship.", "True lateral geometry for evaluating the LIMA-to-LAD insertion.", "Basic Coronary Angiography, slide 23"),
            caution: "The deck does not supply graft cine. This section teaches the acquisition and reporting framework, not a claim that the source image demonstrates graft patency."
          },
          {
            id: "right-quality",
            title: "Image adequacy before RCA or graft diagnosis",
            body: [
              "RCA and graft studies fail in recognizable ways: ostial streaming from nonselective injection, incomplete distal filling, overlap at the crux, catheter damping, respiratory motion, and failure to image the conduit origin or distal anastomosis. A high-quality report names these limitations.",
              "For an RCA lesion, confirm the stenosis in at least two views and inspect distal PDA/PL runoff. For a graft, confirm the entire conduit rather than inferring patency from distal native filling, which may arrive through collaterals or another graft."
            ],
            table: {
              headers: ["Question", "Adequate evidence", "Common trap"],
              rows: [
                ["Is the RCA ostium diseased?", "Coaxial non-occlusive view with normal pressure and ostium separated from catheter", "Catheter-induced damping or streaming"],
                ["Which branch is PDA?", "Groove course plus septal branches in a separated distal view", "Calling the lowest overlapped branch PDA"],
                ["Is a graft patent?", "Origin-to-anastomosis opacification with distal runoff", "Inferring patency from target-vessel filling"],
                ["Is low graft flow technical?", "Anatomic study integrated with pressure/flow, competitive flow, and distal bed", "Calling every faint graft an occlusion"]
              ]
            },
            pearl: "Before diagnosing graft failure, name where the graft begins, where it ends, and how the distal bed is being filled."
          }
        ]
      }
    ],

    questions: [
      {
        id: "angio-q01",
        chapterId: "safe-acquisition",
        level: 2,
        stem: "The pressure trace becomes ventricularized immediately after left-main engagement. What is the safest next action?",
        options: [
          "Inject a small full-strength cine run while leaving the catheter seated to decide whether the pressure change is merely transducer artifact",
          "Do not inject; withdraw until a normal aortic waveform returns, then reassess engagement",
          "Advance the catheter farther so the tip cannot move during injection",
          "Ignore the waveform if the patient has no chest pain"
        ],
        answer: 1,
        explanation: "Ventricularization means the catheter may be obstructing the ostium or sitting against the wall. Contrast must not be injected until the catheter is withdrawn and a normal aortic waveform is restored. Persistent abnormality after safe withdrawal raises concern for true ostial disease or another problem.",
        teachingPoint: "No normal pressure waveform, no coronary injection."
      },
      {
        id: "angio-q02",
        chapterId: "safe-acquisition",
        level: 3,
        stem: "A patient has separate LAD and LCx ostia and the usual JL catheter repeatedly seats deeply in the LAD with damping. Which principle should guide the next step?",
        options: [
          "Use a larger contrast volume to opacify the LCx from the LAD ostium",
          "Leave the catheter deeply seated because separate ostia routinely produce a damped waveform and the LCx will fill through collaterals",
          "Rotate blindly until both vessels fill during one forceful injection",
          "Change catheter size or shape and selectively image each ostium with normal pressure"
        ],
        answer: 3,
        explanation: "Separate ostia require deliberate, non-occlusive engagement of each vessel. Repeated deep seating and damping are reasons to change catheter strategy, not to inject more forcefully or accept an obstructive position.",
        teachingPoint: "Catheter choice follows root and ostial anatomy; the goal is coaxial engagement with preserved pressure."
      },
      {
        id: "angio-q03",
        chapterId: "coronary-anatomy",
        level: 1,
        stem: "Which finding establishes right coronary dominance?",
        options: [
          "The posterior descending artery arises from the RCA at the crux",
          "The proximal RCA is larger than the left main and supplies more contrast-filled branches in the selected projection",
          "The conus branch arises from a separate ostium",
          "The sinoatrial nodal artery arises from the RCA"
        ],
        answer: 0,
        explanation: "Dominance is defined primarily by which artery reaches the crux and supplies the PDA. Vessel size, conus origin, and SA nodal origin do not establish dominance.",
        teachingPoint: "Call dominance from the posterior circulation, not proximal vessel caliber."
      },
      {
        id: "angio-q04",
        chapterId: "right-and-graft-lab",
        level: 2,
        stem: "In a well-separated distal RCA view, which clue most strongly supports that a branch is the PDA rather than a posterolateral branch?",
        options: [
          "It is the brightest and most completely opacified distal branch on the final frame of the injection",
          "It has the largest proximal diameter",
          "It follows the posterior interventricular groove and gives septal perforators",
          "It always points to the patient's left"
        ],
        answer: 2,
        explanation: "The PDA travels in the posterior interventricular groove toward the apex and gives septal branches. Apparent brightness, size, and screen direction vary with injection and projection.",
        teachingPoint: "Use groove course and septal branches to identify the PDA."
      },
      {
        id: "angio-q05",
        chapterId: "projection-geometry",
        level: 2,
        stem: "Which starting projection is most useful for opening the distal left main, proximal LAD, and proximal LCx bifurcation?",
        options: [
          "RAO cranial",
          "LAO caudal spider view",
          "Flat RAO RCA view",
          "True lateral without caudal tilt"
        ],
        answer: 1,
        explanation: "LAO caudal geometry spreads the distal left main and proximal branches in the classic spider view. Orthogonal confirmation remains necessary, especially for intermediate left-main disease.",
        teachingPoint: "Caudal views open the left-main/LCx relationship; cranial views emphasize LAD branches."
      },
      {
        id: "angio-q06",
        chapterId: "left-system-lab",
        level: 2,
        stem: "How should the LCx usually change when comparing RAO cranial with RAO caudal left-coronary images?",
        options: [
          "It disappears in cranial views because the detector tilt prevents contrast from entering the circumflex ostium",
          "It changes from a right-coronary to a left-coronary branch",
          "It becomes the vessel giving septal perforators in caudal tilt",
          "It appears relatively high in cranial tilt and lower/more open in caudal tilt"
        ],
        answer: 3,
        explanation: "The source's practical recognition rule is that the LCx appears high in cranial left-system views and low in caudal views, where its AV-groove course is more open.",
        teachingPoint: "LCx high in cranial, low in caudal - then verify with the full tree."
      },
      {
        id: "angio-q07",
        chapterId: "right-and-graft-lab",
        level: 2,
        stem: "Which supplemental projection is specifically useful for profiling a LIMA-to-LAD insertion?",
        options: [
          "True lateral near 90 degrees",
          "Flat AP only",
          "LAO caudal spider view because opening the left-main bifurcation also profiles every LIMA insertion",
          "RAO caudal LCx view"
        ],
        answer: 0,
        explanation: "The source notes that a true lateral projection can profile the LIMA-to-LAD insertion. A complete graft study still must show the origin, graft body, anastomosis, and distal runoff.",
        teachingPoint: "Use a graft-specific view for the unresolved segment, not one universal graft projection."
      },
      {
        id: "angio-q08",
        chapterId: "right-and-graft-lab",
        level: 3,
        stem: "A flat RAO RCA frame shows proximal and mid RCA well but the distal branches overlap. What is the best response?",
        options: [
          "Call the lowest branch PDA and finish the study",
          "Call both branches posterolateral because no septal perforators are visible in this compressed frame and dominance is already known",
          "Add cranial angulation or another tailored view before naming PDA and posterolateral branches",
          "Infer the branch names from dominance reported on a prior study"
        ],
        answer: 2,
        explanation: "The frame is inadequate for distal branch assignment. Cranial angulation often separates the bifurcation so branch course and septal perforators can be evaluated.",
        teachingPoint: "Image inadequacy is a finding that should trigger a better projection, not a guess."
      },
      {
        id: "angio-q09",
        chapterId: "lesion-assessment",
        level: 2,
        stem: "A perfectly circular artery has a 50% reduction in luminal diameter. Approximately how much cross-sectional area has been lost?",
        options: [
          "50%",
          "75%",
          "25%",
          "90%"
        ],
        answer: 1,
        explanation: "Area is proportional to radius squared. Halving the diameter leaves one quarter of the original area, which means 75% area loss.",
        teachingPoint: "Diameter reduction magnifies area reduction, but geometry alone still does not prove ischemia."
      },
      {
        id: "angio-q10",
        chapterId: "lesion-assessment",
        level: 3,
        stem: "Which report most completely describes a coronary lesion for operative planning?",
        options: [
          "Severe CAD in the left system",
          "Eighty percent stenosis, recommend bypass",
          "Critical LAD disease involving the main anterior territory, so surgery should proceed without a distal-vessel description",
          "Eccentric calcified proximal LAD lesion seen in two views, with preserved mid-distal target and good runoff"
        ],
        answer: 3,
        explanation: "The complete description gives segment, geometry, morphology, confirmation in more than one view, and the condition of the distal target. A percentage or vessel label alone is not enough for CABG planning.",
        teachingPoint: "Describe location, morphology, view quality, and distal bed before the surgical consequence."
      },
      {
        id: "angio-q11",
        chapterId: "lesion-assessment",
        level: 2,
        stem: "Which feature belongs to the source's legacy type C lesion morphology?",
        options: [
          "Diffuse disease with excessive tortuosity or extreme angulation",
          "Discrete concentric lesion with a smooth contour",
          "Non-ostial lesion without calcification or thrombus",
          "Readily accessible short lesion without side-branch involvement"
        ],
        answer: 0,
        explanation: "Legacy type C features include diffuse disease, excessive tortuosity, extreme angulation, older chronic occlusion, unprotectable major side branch, or a degenerated SVG. The other options describe type A features.",
        teachingPoint: "Use type A/B/C as historical morphology vocabulary, not as a modern treatment algorithm."
      },
      {
        id: "angio-q12",
        chapterId: "lesion-assessment",
        level: 3,
        stem: "Two patients each have a visually estimated 60% proximal LAD stenosis. What is the most accurate interpretation?",
        options: [
          "Both lesions are physiologically significant because matching visual percentages guarantee the same pressure loss despite differences in territory",
          "Neither lesion can cause ischemia until visual stenosis exceeds 70%",
          "Anatomic appearance is intermediate; lesion physiology and clinical context may differ",
          "The larger myocardial territory automatically makes both FFR values abnormal"
        ],
        answer: 2,
        explanation: "Visual diameter stenosis and physiologic significance are related but not identical. Territory, lesion length, serial/diffuse disease, microvasculature, collaterals, and technical factors can produce different pressure and flow consequences.",
        teachingPoint: "Keep anatomic severity and physiologic significance in separate sentences."
      },
      {
        id: "angio-q13",
        chapterId: "cath-adjuncts",
        level: 3,
        stem: "An intermediate focal coronary lesion has FFR 0.76 during adequate maximal hyperemia with no pressure drift. How should the lesion-level result be described?",
        options: [
          "Anatomically mild and therefore irrelevant",
          "Physiologically significant by the usual FFR threshold",
          "Normal because FFR is valid only below 0.50",
          "Indeterminate unless the visual estimate exceeds 90%, because pressure-wire ratios cannot adjudicate lesions that appear intermediate"
        ],
        answer: 1,
        explanation: "FFR <=0.80 is generally considered physiologically significant when the measurement is technically valid. The result should still be integrated with anatomy, territory, symptoms, and the revascularization decision.",
        teachingPoint: "FFR measures distal-to-aortic pressure ratio during hyperemia; it does not grade graftability."
      },
      {
        id: "angio-q14",
        chapterId: "cath-adjuncts",
        level: 3,
        stem: "A patient cannot tolerate adenosine. Which lesion-level index can be measured at rest during a specific diastolic period?",
        options: [
          "TIMI myocardial perfusion grade",
          "Gorlin valve area",
          "Sellers regurgitation grade derived from contrast persistence during a resting diastolic wave-free interval",
          "iFR"
        ],
        answer: 3,
        explanation: "iFR is a resting diastolic pressure ratio that does not require pharmacologic hyperemia. A common significance threshold is <=0.89, provided technique is sound.",
        teachingPoint: "iFR answers lesion-level pressure physiology without adenosine."
      },
      {
        id: "angio-q15",
        chapterId: "cath-adjuncts",
        level: 3,
        stem: "A foreshortened 45% to 55% distal left-main lesion remains ambiguous in several angiographic views. Which adjunct most directly displays lumen and plaque geometry?",
        options: [
          "IVUS",
          "Chest radiography",
          "TIMI myocardial perfusion grading",
          "Pulmonary artery thermodilution"
        ],
        answer: 0,
        explanation: "IVUS directly images the left-main lumen, vessel wall, plaque burden, calcium, and reference dimensions. Validated physiology may also help in suitable anatomy, but angiographic guessing is inappropriate.",
        teachingPoint: "Use IVUS when the unresolved question is lumen and wall geometry."
      },
      {
        id: "angio-q16",
        chapterId: "cath-adjuncts",
        level: 3,
        stem: "Invasive angiography shows an RCA arising from the left cusp but cannot define whether its proximal course is interarterial or benign. What test best maps the three-dimensional course?",
        options: [
          "Repeat the same invasive view with more contrast",
          "Resting ECG alone",
          "CCTA",
          "TIMI flow grading"
        ],
        answer: 2,
        explanation: "CTCA is well suited to defining anomalous origin and the spatial relationship of the proximal vessel to the aorta and pulmonary artery. Origin alone does not determine risk.",
        teachingPoint: "Use CTCA for a three-dimensional anomalous-course question."
      },
      {
        id: "angio-q17",
        chapterId: "pathology-artifacts",
        level: 2,
        stem: "A coronary lesion is heavily calcified on fluoroscopy. Which statement is most accurate?",
        options: [
          "Calcification proves the lesion is physiologically significant",
          "Calcification adds technical complexity but does not itself prove flow limitation",
          "Calcification makes the distal target unsuitable for bypass even when a soft disease-free landing zone exists beyond it",
          "Calcification can be ignored if TIMI flow is 3"
        ],
        answer: 1,
        explanation: "Calcium can impair lumen assessment and make PCI or surgical landing zones technically challenging, but physiologic significance still requires the appropriate evidence. Distal suitability depends on where and how extensively calcium and disease are distributed.",
        teachingPoint: "Calcification is morphology and technical information, not a physiology result."
      },
      {
        id: "angio-q18",
        chapterId: "pathology-artifacts",
        level: 4,
        stem: "A sharply marginated circular filling defect appears immediately after an injection. What is the best initial interpretation from one still frame?",
        options: [
          "Definite thrombus because circular defects represent organized clot whenever they are sharply marginated after contrast administration",
          "Definite air because it appeared after injection",
          "A harmless artifact that needs no further review",
          "An intraluminal filling defect with air-versus-thrombus differential requiring cine and system review"
        ],
        answer: 3,
        explanation: "The supplied source emphasizes thrombus versus air and does not permit a definitive diagnosis from one still. Timing, persistence, mobility, underlying plaque, manifold integrity, another view, and distal flow are needed.",
        teachingPoint: "Describe the filling defect and gather discriminating evidence before naming its material."
      },
      {
        id: "angio-q19",
        chapterId: "pathology-artifacts",
        level: 2,
        stem: "What angiographic behavior defines myocardial bridging?",
        options: [
          "Systolic compression of an intramyocardial segment with diastolic relaxation",
          "Persistent total occlusion in systole and diastole with no change in caliber across the entire cardiac cycle",
          "Aneurysmal dilation that fills only in systole",
          "A circular air bubble that disappears after injection"
        ],
        answer: 0,
        explanation: "A myocardial bridge produces dynamic systolic narrowing and diastolic release, usually in an LAD segment. A static frame cannot establish that time-dependent pattern.",
        teachingPoint: "Bridging is a cine diagnosis and is often incidental."
      },
      {
        id: "angio-q20",
        chapterId: "pathology-artifacts",
        level: 4,
        stem: "During angiography, new hypotension and contrast staining appear after a forceful injection into a damped ostium. Which interpretation best fits?",
        options: [
          "Normal contrast washout from an ostial injection, because temporary hypotension and vessel staining are expected when opacification is complete",
          "Expected TMPG 3 myocardial perfusion",
          "An iatrogenic coronary complication such as dissection requiring immediate recognition and stabilization",
          "Benign myocardial bridging"
        ],
        answer: 2,
        explanation: "A damped ostium followed by forceful injection, hypotension, and persistent staining is concerning for catheter-induced dissection or related injury. The provoking injection should stop, perfusion should be supported, and the complication should be defined without compounding it.",
        teachingPoint: "Pressure, clinical change, and persistent staining are complication signals, not image noise."
      },
      {
        id: "angio-q21",
        chapterId: "variants-structural",
        level: 3,
        stem: "An LAD-to-pulmonary-artery fistula is visible. Which finding most directly helps determine hemodynamic importance?",
        options: [
          "The fistula is visible in LAO projection",
          "Evidence of a meaningful shunt, chamber load, ischemia, or coronary steal",
          "The source states that many fistulae arise from the RCA, so origin frequency alone establishes the hemodynamic importance of this LAD fistula",
          "The patient has a right-dominant coronary system"
        ],
        answer: 1,
        explanation: "Anatomic presence alone does not establish clinical importance. Symptoms, chamber effects, shunt quantification when relevant, ischemia/steal, aneurysmal change, and complications determine significance.",
        teachingPoint: "Map origin and termination, then measure consequence."
      },
      {
        id: "angio-q22",
        chapterId: "variants-structural",
        level: 3,
        stem: "An LCx arises from the right sinus and passes behind the aortic root. Which statement is most accurate?",
        options: [
          "Every opposite-sinus coronary has the same high-risk course",
          "The vessel can be ignored during mitral surgery because its right-sided origin keeps every retroaortic segment away from annular sutures",
          "The anomaly proves the LCx is nondominant",
          "A retroaortic LCx is often lower risk but is important near the mitral annulus and aortic root"
        ],
        answer: 3,
        explanation: "Anomalous LCx from the right side usually has a retroaortic course, which differs from an interarterial course in risk. Its proximity to the mitral annulus and root creates an operative injury or compression hazard.",
        teachingPoint: "For anomalies, report origin, three-dimensional course, termination, and operative relationship."
      },
      {
        id: "angio-q23",
        chapterId: "variants-structural",
        level: 3,
        stem: "A severe LAD lesion supplies septal collaterals to an occluded RCA. Why is the LAD lesion especially consequential?",
        options: [
          "The LAD is a donor vessel supporting its own bed and a collateral-dependent RCA territory",
          "Collaterals prove the RCA territory is nonviable",
          "A donor lesion cannot affect collateral flow",
          "Septal collaterals automatically make the system left dominant"
        ],
        answer: 0,
        explanation: "A stenosis in a collateral donor can jeopardize both the donor's native territory and the recipient bed. Collaterals often imply chronicity but do not prove nonviability or change the definition of dominance.",
        teachingPoint: "Collateral donor disease can create double jeopardy."
      },
      {
        id: "angio-q24",
        chapterId: "variants-structural",
        level: 3,
        stem: "Why can angiography underestimate the true size of a coronary aneurysm?",
        options: [
          "The detector always reduces all dimensions by half",
          "Aneurysms do not contain contrast",
          "Mural thrombus can occupy the sac while only the residual lumen opacifies",
          "PDA dominance masks the external aneurysm wall"
        ],
        answer: 2,
        explanation: "Angiography silhouettes the contrast-filled lumen. Mural thrombus may fill part of the aneurysm, so cross-sectional or intravascular imaging can reveal a larger external dimension and plaque/thrombus burden.",
        teachingPoint: "The opacified lumen is not always the external aneurysm boundary."
      },
      {
        id: "angio-q25",
        chapterId: "flow-perfusion",
        level: 2,
        stem: "Contrast faintly passes beyond an occlusion but never completely fills the distal bed. What is the TIMI grade?",
        options: [
          "TIMI 0",
          "TIMI 1",
          "TIMI 2",
          "TIMI 3"
        ],
        answer: 1,
        explanation: "TIMI 1 is penetration beyond the obstruction without complete opacification of the distal bed. TIMI 0 has no antegrade passage; TIMI 2 and 3 both achieve complete distal filling but differ in speed.",
        teachingPoint: "TIMI 1 penetrates but does not complete the distal bed."
      },
      {
        id: "angio-q26",
        chapterId: "flow-perfusion",
        level: 2,
        stem: "The distal vessel fills completely, but much later than an uninvolved artery. Which TIMI grade best fits?",
        options: [
          "TIMI 0 because filling is delayed",
          "TIMI 1 because any delay means incomplete flow",
          "TIMI 3 because the final still shows the whole vessel",
          "TIMI 2 because filling is complete but abnormally slow"
        ],
        answer: 3,
        explanation: "TIMI 2 produces complete distal opacification with delayed or sluggish transit. TIMI 3 requires normal brisk filling and clearance, which cannot be established from the final still alone.",
        teachingPoint: "Complete does not equal normal speed."
      },
      {
        id: "angio-q27",
        chapterId: "flow-perfusion",
        level: 2,
        stem: "Dye enters the culprit myocardial territory slowly and remains stained into the next injection without effective exit. What TIMI myocardial perfusion grade is described?",
        options: [
          "TMPG 1",
          "TMPG 3",
          "TIMI grade 1",
          "TMPG 0"
        ],
        answer: 0,
        explanation: "TMPG 1 is slow entry with poor or absent exit and persistent staining. TMPG 2 has delayed entry and exit; TMPG 3 has normal entry and visible clearance. These kinetics are TMPG, not the separate density-based myocardial blush grade system.",
        teachingPoint: "TMPG follows tissue entry and washout, not epicardial lumen filling."
      },
      {
        id: "angio-q28",
        chapterId: "flow-perfusion",
        level: 3,
        stem: "After opening a culprit artery, cine shows TIMI 3 epicardial flow but TMPG 0 tissue perfusion. What is the best interpretation?",
        options: [
          "The grades are mutually exclusive, so one must be a clerical error",
          "The artery is still totally occluded",
          "Epicardial flow is restored but microvascular perfusion remains severely impaired",
          "Normal tissue perfusion is guaranteed by TIMI 3 flow"
        ],
        answer: 2,
        explanation: "TIMI flow and TMPG measure different levels of the circulation. An open epicardial artery can coexist with microvascular obstruction or no-reflow, so both observations should be reported separately.",
        teachingPoint: "Epicardial patency does not guarantee tissue reperfusion."
      },
      {
        id: "angio-q29",
        chapterId: "cath-adjuncts",
        level: 2,
        stem: "Which regional wall segments are classically profiled in an RAO left ventriculogram?",
        options: [
          "Only the right ventricular free wall",
          "Anterobasal, anterior, apical, inferior, and inferobasal LV regions",
          "Only lateral and septal LV regions",
          "Only the left atrium and pulmonary veins"
        ],
        answer: 1,
        explanation: "The Key Questions reference maps RAO LVgram to anterobasal, anterior, apical, inferior, and inferobasal regions. LAO emphasizes lateral, septal, and inferior regions.",
        teachingPoint: "Ventriculography is projection-dependent just like coronary angiography."
      },
      {
        id: "angio-q30",
        chapterId: "cath-adjuncts",
        level: 3,
        stem: "A large coronary fistula is suspected of causing a left-to-right shunt. Which cath-lab approach best quantifies this consequence?",
        options: [
          "Measure only the visual fistula diameter",
          "Assign a TIMI grade to the fistula",
          "Perform an LVgram and infer the shunt from EF",
          "Fick Qp:Qs"
        ],
        answer: 3,
        explanation: "Stepwise saturations can detect an oxygen step-up, and Fick principles can estimate Qp:Qs. This hemodynamic measurement complements the anatomic fistula map.",
        teachingPoint: "Anatomy identifies the connection; hemodynamics quantify the shunt."
      },
      {
        id: "angio-q31",
        chapterId: "surgical-translation",
        level: 3,
        stem: "Which angiographic target is most favorable for bypass grafting?",
        options: [
          "Viable myocardium with a good target and runoff",
          "A tiny diffusely calcified distal branch with no runoff",
          "A mildly narrowed vessel with normal physiology and strong native flow",
          "An aneurysmal segment containing suspected thrombus as the anastomotic site"
        ],
        answer: 0,
        explanation: "A favorable target needs a reason for graft flow, adequate caliber, a healthier landing zone, good distal runoff, and viable territory. Severe proximal stenosis alone cannot rescue a poor distal bed.",
        teachingPoint: "A graft needs both demand for flow and a usable distal destination."
      },
      {
        id: "angio-q32",
        chapterId: "surgical-translation",
        level: 3,
        stem: "Why is an arterial graft to a vessel with only moderate, physiologically non-significant stenosis at risk?",
        options: [
          "The target automatically develops an aneurysm",
          "The graft will always cause acute left-main dissection",
          "Native competitive flow can reduce graft flow and promote stringing or closure",
          "Moderate stenosis prevents any distal coronary flow"
        ],
        answer: 2,
        explanation: "When native resistance remains low, antegrade native flow competes with graft inflow. Low graft utilization is especially problematic for arterial conduits and can lead to a string sign or occlusion.",
        teachingPoint: "Physiology may inform competitive-flow risk, but CABG target selection still integrates anatomy, territory, completeness, conduit, and distal target quality."
      },
      {
        id: "angio-q33",
        chapterId: "surgical-translation",
        level: 4,
        stem: "Minutes after CABG, TEE shows a new inferior wall-motion abnormality and the RCA graft has low, non-diastolic flow. Which mechanism should be prioritized?",
        options: [
          "Late vein-graft atherosclerosis",
          "Early graft failure",
          "Normal postoperative adaptation that needs no investigation",
          "Isolated chronic LCx disease"
        ],
        answer: 1,
        explanation: "Very early graft dysfunction is commonly technical, thrombotic, spasmodic, embolic, or related to target/runoff. A new territorial abnormality should prompt immediate graft and native-supply interrogation while revision remains possible.",
        teachingPoint: "A new regional wall-motion abnormality after bypass is a graft/territory problem until evaluated."
      },
      {
        id: "angio-q34",
        chapterId: "surgical-translation",
        level: 3,
        stem: "Ten years after CABG, an SVG is diffusely irregular and friable with focal aneurysmal degeneration. Which mechanism best fits the timing?",
        options: [
          "Immediate catheter damping",
          "Congenital myocardial bridging",
          "Acute failure to de-air the manifold",
          "Late vein-graft atherosclerosis and degeneration"
        ],
        answer: 3,
        explanation: "Late SVG failure is dominated by accelerated atherosclerosis and graft degeneration, sometimes with thrombus or aneurysmal change. Early failure has a different technical/thrombotic profile.",
        teachingPoint: "Classify graft failure by timing before selecting the likely mechanism."
      },
      {
        id: "angio-q35",
        chapterId: "surgical-translation",
        level: 4,
        stem: "Which closing statement is most useful in a surgeon-ready angiography report?",
        options: [
          "Targets, runoff, and unresolved anatomy",
          "Triple-vessel disease; clinical correlation advised",
          "Multiple severe stenoses; consider revascularization",
          "Abnormal angiogram with no further details"
        ],
        answer: 0,
        explanation: "The surgeon-ready synthesis maps branch-level targets, target quality, flow/physiology, and uncertainty. Vessel count alone does not define graft count, feasibility, or completeness.",
        teachingPoint: "End with targets, runoff, competitive-flow risk, and the one uncertainty that could change the operation."
      },
      {
        id: "angio-q36",
        chapterId: "surgical-translation",
        level: 4,
        stem: "A short left main appears 50% narrowed in one foreshortened view and 30% in another. Symptoms are stable. What is the best next step before committing to CABG or PCI?",
        options: [
          "Average the two visual estimates and report 40%",
          "Choose the more severe estimate because left-main disease is high risk",
          "Obtain objective adjudication with IVUS and/or validated physiology in suitable anatomy",
          "Ignore the lesion because one view was below 50%"
        ],
        answer: 2,
        explanation: "Intermediate left-main angiography is prone to foreshortening, overlap, and reference error. IVUS directly measures lumen/plaque geometry, and validated physiology may help in suitable anatomy. The decision should not rest on averaging visual guesses.",
        teachingPoint: "The highest-stakes intermediate lesion deserves objective anatomy or physiology before revascularization."
      }
    ],

    sources: [
      {
        id: "source-basic-angio",
        title: "Basic Coronary Angiography",
        citation: "David Shavelle. Basic Coronary Angiography. 55-slide teaching deck, PDF created January 5, 2017.",
        scope: "Slides 2-54 provide the module's history, coronary anatomy, engagement and injection safety, projection geometry, image-recognition labs, lesion morphology, uncommon findings, TIMI flow, and TIMI myocardial perfusion grade content.",
        note: "All clinical assets in this module were extracted from the supplied PDF. Slide 55 was excluded. Static frames are never presented as cine evidence."
      },
      {
        id: "source-key-questions",
        title: "Key Questions in Cardiac Surgery, 2nd edition",
        citation: "Narain Moorjani et al. Key Questions in Cardiac Surgery. 2nd edition. Chapter 6: Cardiac catheterisation; Chapter 17: Coronary artery disease; Appendix IV: Standard coronary angiographic views.",
        scope: "Adds indications and relative contraindications, procedural framing, left/right coronary and LV projection maps, Sellers regurgitation grades, hemodynamics, diameter-to-area geometry, FFR/iFR, IVUS, stenosis interpretation, and the surgical coronary-disease context.",
        note: "The source's exact visual stenosis cutoffs and historical classifications are labelled as source-specific; the module separates them from physiologic significance."
      },
      {
        id: "source-esc-ccs-2024",
        title: "2024 ESC Guidelines for chronic coronary syndromes",
        citation: "Vrints C, Andreotti F, Koskinas KC, et al. 2024 ESC Guidelines for the management of chronic coronary syndromes. European Heart Journal. doi:10.1093/eurheartj/ehae177.",
        scope: "Cross-checks the module's use of FFR/iFR for intermediate stenoses, functional testing to guide revascularization, Heart Team reasoning for complex multivessel disease, and shared decision-making.",
        note: "Only high-level current concepts are paraphrased. The module intentionally avoids reproducing acute-treatment algorithms or claiming that one anatomy pattern dictates one procedure for every patient."
      },
      {
        id: "source-acc-revascularization-2021",
        title: "2021 ACC/AHA/SCAI Coronary Revascularization Guideline",
        citation: "Lawton JS, Tamis-Holland JE, Bangalore S, et al. 2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization. Circulation. 2022;145:e18-e114. doi:10.1161/CIR.0000000000001038.",
        scope: "Cross-checks physiology thresholds, revascularization decision framing, and the distinction between physiology-guided PCI evidence and less-established physiology-guided CABG target selection.",
        note: "The module uses this guideline to qualify claims, not to turn an educational still frame into a patient-specific treatment recommendation."
      },
      {
        id: "source-local-cabg-layer",
        title: "Cardiac Surgery Training operative CABG reference layer",
        citation: "Local files: site/js/surgery/surgery-cabg.js; site/js/data/lessons-d6.js; site/js/data/flashcards-d6.js.",
        scope: "Supplies the operative translation from angiographic target to landing zone, distal runoff, conduit behavior, intraoperative graft assessment, and early/intermediate/late graft-failure mechanisms.",
        note: "This source is used to align the angiography module with the app's established clinically oriented, operative teaching style."
      }
    ]
  };

  window.ANGIOGRAPHY.chapters = window.ANGIOGRAPHY.chapters
    .concat(window.ANGIOGRAPHY.additionalChapters)
    .sort((a, b) => a.number - b.number);
  const visualCaseByQuestion = {
    "angio-q01": "case-pressure-ventricularization",
    "angio-q04": "case-rca-distal-bifurcation",
    "angio-q06": "case-left-rao-caudal",
    "angio-q07": "case-true-lateral-lima",
    "angio-q08": "case-rca-suboptimal",
    "angio-q18": "case-embolization-comparison",
    "angio-q19": "case-myocardial-bridge",
    "angio-q20": "case-pressure-ventricularization",
    "angio-q21": "case-lad-pa-fistula",
    "angio-q22": "case-anomalous-lcx",
    "angio-q23": "case-collateral-map",
    "angio-q24": "case-coronary-aneurysm"
  };
  window.ANGIOGRAPHY.questions.forEach(question => {
    if (visualCaseByQuestion[question.id]) question.caseId = visualCaseByQuestion[question.id];
  });
  delete window.ANGIOGRAPHY.additionalChapters;
})();
