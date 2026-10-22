# Day 5 Angiography Module - Source Map

## Purpose and scope

This map records the provenance of the Day 5 coronary angiography module, including every raster asset extracted from the supplied slide deck and the relevant teaching ranges paraphrased from *Key Questions in Cardiac Surgery*. It is intended to make future content review, re-extraction, and source verification reproducible.

The module is attached to Day 5 (Imaging) and links back to lesson `d4-cath`. Its coronary images come only from the user-supplied angiography deck. The cardiac-surgery textbook contributes paraphrased teaching, thresholds, and operative consequences; no textbook figure was copied into the module.

## Source documents

| Source key | File | Bibliographic/source detail | Use |
|---|---|---|---|
| `ANGIO-DECK` | `/Users/aymanmohammed/Downloads/Basic-Coronary-Angiography_All-Slides (1).pdf` | David Shavelle, *Basic Coronary Angiography*, 55-slide PowerPoint export, 2017 | All extracted coronary angiograms, projection diagrams, and the deck's core teaching sequence |
| `KQCS2` | `Key Questions in Cardiac Surgery (2nd edition).pdf` | Narain Moorjani, *Key Questions in Cardiac Surgery*, 2nd edition, 666-page PDF | Paraphrased catheterisation, angiographic interpretation, physiology, revascularisation, graft-target, and surgical-planning context |
| `ESC-CCS-2024` | Official guideline | *2024 ESC Guidelines for the management of chronic coronary syndromes*, doi:10.1093/eurheartj/ehae177 | Current conceptual cross-check for functional adjudication, complex multivessel Heart Team reasoning, and shared decision-making |
| `ACC-REVASC-2021` | Official guideline | *2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization*, doi:10.1161/CIR.0000000000001038 | Current cross-check for physiology thresholds and for qualifying physiology-guided CABG claims |

For `KQCS2`, the tables below list both the PDF viewer page and the page number printed in the book. This avoids ambiguity caused by the front matter. For example, PDF page 186 is printed page 165.

## Angiography deck topic map

| Slides | Deck topic | Module use | Extracted assets |
|---|---|---|---|
| 1 | Title | Module identity only | None |
| 2-3 | Take-home points: anatomy, projections, disease severity, bypass/LIMA imaging, TIMI flow, myocardial blush, collaterals, ventriculography | Learning objectives and interpretation framework | None |
| 4 | First selective coronary angiogram | Historical orientation | `history-first-coronary-frame.jpg`; `history-first-angiography-lab.jpg` |
| 5-7 | RCA origin, course, branches, supply, and catheter engagement | Normal RCA anatomy and safe engagement | None |
| 8-10 | Left main, LAD, LCx anatomy; catheter choice; damping warning; optimal views | Normal left-system anatomy and ostial safety | None |
| 11 | Coronary dominance | Dominance and inferior-wall supply | None |
| 12-14 | Manifold versus automatic injection; manifold workflow; pressure check before injection | Procedure, contrast delivery, and engagement safety | None |
| 15 | Example of ventricularized pressure and unsafe injection | Pressure-safety chapter and case reasoning | `pressure-ventricularization-waveform.png` |
| 16-17 | Cranial/caudal and RAO/LAO geometry | Projection fundamentals | `cranial-caudal-angulation.png`; `rao-lao-angulation.png` |
| 18-19 | Standard left and right coronary views, plus supplemental views | Projection-selection matrix | None |
| 20 | RAO caudal left-system projection | LCx/LM/LAD projection teaching | `projection-rao-caudal-tree.png`; `projection-rao-caudal-geometry.png` |
| 21 | LAO cranial left-system projection | LAD/diagonal/septal projection teaching | `projection-lao-cranial-tree.png` |
| 22 | Steep LAO projection | Left-system tree orientation | `projection-steep-lao-tree.png` |
| 23 | True lateral projection and LIMA-LAD insertion view | Graft insertion and lateral geometry | `projection-true-lateral-tree.png`; `projection-true-lateral-geometry.png` |
| 24 | LAO cranial RCA projection | RCA course and characteristic C shape | `projection-rca-lao-cranial.png` |
| 25 | RAO RCA projection | PDA bifurcation and septal orientation | `projection-rca-rao-cranial.png` |
| 26-30 | Labelled left coronary angiograms: LAO cranial, RAO cranial, spider, elongated RAO cranial, RAO caudal | Atlas, projection comparison, overlap/foreshortening teaching, cases | Five `angiogram-left-*.jpg` assets listed below |
| 31-33 | Labelled RCA angiograms: LAO cranial proximal/distal and RAO | Atlas, PDA/PLV differentiation, cases | Three `angiogram-rca-*.jpg` assets listed below |
| 34-39 | Three view-identification challenges and answer reveals | Three-stage case pattern and view-recognition drills | `challenge-left-rao-caudal.jpg`; `challenge-left-lao-cranial.jpg`; `challenge-left-ramus.jpg` |
| 40 | AHA type A/B/C lesion classification | Lesion morphology and procedural-complexity chapter, reconstructed as accessible text from the complete slide | Four `aha-lesion-*.png` PowerPoint shape fragments retained but excluded from display |
| 41 | Ulcerated plaque | Irregular-contour characterization and target-quality case; the extracted legacy filename is not treated as evidence of calcium | `angiogram-calcified-plaque.jpg` |
| 42 | Coronary thrombus | Source-labelled thrombus frame, with the limitation that an isolated clinical still still needs cine/procedural context | `angiogram-coronary-thrombus.jpg` |
| 43 | Air-versus-thrombus embolization comparison | Filling-defect differential and injection safety; the individual comparison panel is not definitively keyed | `angiogram-air-embolism.jpg` |
| 44 | Myocardial bridging | Dynamic-versus-static limitation, systolic compression, surgical relevance | `myocardial-bridge-mechanism.jpg`; title/cross-section overlay exclusions documented below |
| 45-47 | Coronary fistula, LAD-to-PA example, and haemodynamic-significance question | Fistula recognition, shunt assessment, operative consequence | `angiogram-lad-pa-fistula.jpg` |
| 48-50 | Anomalous coronary origins and anomalous LCx from the right cusp/proximal RCA | Anomaly recognition and preoperative hazard mapping | Three origin photographs plus `anomalous-lcx-angiogram.jpg`; two blank/background composition layers retained but excluded |
| 51 | Coronary collateral pathways | Collateral interpretation and chronic-occlusion planning | `coronary-collateral-pathways.jpg` |
| 52 | Coronary artery aneurysm | Definition, causes, and management implications | `angiogram-coronary-aneurysm.jpg` |
| 53 | TIMI 0-3 flow grade | Flow grading and quiz cases | None |
| 54 | TIMI myocardial perfusion grade (TMPG) 0-3 | Tissue-level entry/washout distinction; explicitly separated from the different density-based myocardial blush grade (MBG) system | None |
| 55 | Closing slide | No module content | None |

## Extracted asset ledger

The stable extraction recipe is `site/tools/extract-angiography-assets.py`. Image index refers to the zero-based embedded-image index used by that script, not visual left-to-right order. All paths below are relative to `site/`.

| Slide | Image index | Module asset |
|---:|---:|---|
| 4 | 0 | `assets/angiography/history-first-coronary-frame.jpg` |
| 4 | 1 | `assets/angiography/history-first-angiography-lab.jpg` |
| 15 | 0 | `assets/angiography/pressure-ventricularization-waveform.png` |
| 16 | 0 | `assets/angiography/cranial-caudal-angulation.png` |
| 17 | 0 | `assets/angiography/rao-lao-angulation.png` |
| 20 | 0 | `assets/angiography/projection-rao-caudal-tree.png` |
| 20 | 1 | `assets/angiography/projection-rao-caudal-geometry.png` |
| 21 | 0 | `assets/angiography/projection-lao-cranial-tree.png` |
| 22 | 0 | `assets/angiography/projection-steep-lao-tree.png` |
| 23 | 0 | `assets/angiography/projection-true-lateral-tree.png` |
| 23 | 1 | `assets/angiography/projection-true-lateral-geometry.png` |
| 24 | 0 | `assets/angiography/projection-rca-lao-cranial.png` |
| 25 | 0 | `assets/angiography/projection-rca-rao-cranial.png` |
| 26 | 0 | `assets/angiography/angiogram-left-lao-cranial.jpg` |
| 27 | 0 | `assets/angiography/angiogram-left-rao-cranial.jpg` |
| 28 | 0 | `assets/angiography/angiogram-left-spider.jpg` |
| 29 | 0 | `assets/angiography/angiogram-left-rao-cranial-long.jpg` |
| 30 | 0 | `assets/angiography/angiogram-left-rao-caudal.jpg` |
| 31 | 0 | `assets/angiography/angiogram-rca-lao-cranial.jpg` |
| 32 | 0 | `assets/angiography/angiogram-rca-lao-cranial-distal.jpg` |
| 33 | 0 | `assets/angiography/angiogram-rca-rao.jpg` |
| 34 | 0 | `assets/angiography/challenge-left-rao-caudal.jpg` |
| 36 | 0 | `assets/angiography/challenge-left-lao-cranial.jpg` |
| 38 | 0 | `assets/angiography/challenge-left-ramus.jpg` |
| 40 | 0 | `assets/angiography/aha-lesion-type-a.png` |
| 40 | 1 | `assets/angiography/aha-lesion-type-b.png` |
| 40 | 2 | `assets/angiography/aha-lesion-type-b2.png` |
| 40 | 3 | `assets/angiography/aha-lesion-type-c.png` |
| 41 | 0 | `assets/angiography/angiogram-calcified-plaque.jpg` |
| 42 | 0 | `assets/angiography/angiogram-coronary-thrombus.jpg` |
| 43 | 0 | `assets/angiography/angiogram-air-embolism.jpg` |
| 44 | 0 | `assets/angiography/myocardial-bridge-cross-sections.png` |
| 44 | 1 | `assets/angiography/myocardial-bridge-systolic-sequence.png` |
| 44 | 2 | `assets/angiography/myocardial-bridge-mechanism.jpg` |
| 46 | 0 | `assets/angiography/angiogram-lad-pa-fistula.jpg` |
| 48 | 0 | `assets/angiography/anomaly-normal-origins.jpg` |
| 48 | 1 | `assets/angiography/anomaly-left-main-from-right-cusp.jpg` |
| 48 | 2 | `assets/angiography/anomaly-rca-from-left-cusp.jpg` |
| 50 | 0 | `assets/angiography/anomalous-lcx-course.png` |
| 50 | 1 | `assets/angiography/anomalous-lcx-coronary-frame.png` |
| 50 | 2 | `assets/angiography/anomalous-lcx-angiogram.jpg` |
| 51 | 0 | `assets/angiography/coronary-collateral-pathways.jpg` |
| 52 | 0 | `assets/angiography/angiogram-coronary-aneurysm.jpg` |

### Intentional asset exclusions

Direct PDF extraction also exposes PowerPoint's internal composition layers. Those layers are retained so the extraction is reproducible, but the learner module does not display fragments that carry no useful clinical image:

- `aha-lesion-type-a.png`, `aha-lesion-type-b.png`, `aha-lesion-type-b2.png`, and `aha-lesion-type-c.png` are transparent/empty shape fragments. The complete slide's AHA type A/B/C morphology content is reconstructed as accessible text and a comparison table.
- `anomalous-lcx-course.png` is a blank composition canvas and `anomalous-lcx-coronary-frame.png` is a background-gradient layer. The actual `anomalous-lcx-angiogram.jpg` is displayed and the course is explained in text.
- `myocardial-bridge-systolic-sequence.png` is only the slide's “Intramyocardial Segment” title overlay. `myocardial-bridge-cross-sections.png` is a 2166 x 127 strip below the module's 140-pixel height gate. The clean `myocardial-bridge-mechanism.jpg` preserves the usable figure.
- `myocardial-bridge-angiogram.jpg` is a byte-identical legacy filename for `myocardial-bridge-mechanism.jpg`; displaying both would duplicate the same figure.

The validator records these nine files as documented warnings rather than orphaned clinical assets.

## *Key Questions in Cardiac Surgery* map

No prose below is intended as a verbatim reproduction. Module teaching is paraphrased and reorganized around angiographic interpretation and the downstream decisions a cardiac-surgery learner must make.

| PDF pages | Printed pages | Chapter/questions | Concepts used in the module |
|---:|---:|---|---|
| 186-190 | 165-169 | Chapter 6, Q1-Q4 | Definition and conduct of coronary angiography; catheter/access workflow; standard left and right coronary projections |
| 191-193 | 170-172 | Chapter 6, Q5-Q9 | LV views; indications; relative contraindications; complications; systematic inventory of left main, LAD/diagonal/septal, LCx/OM, RCA/PDA/PLV, dominance, collaterals, LV function, and valve/aortic findings |
| 194-197 | 173-176 | Chapter 6, Q10-Q14 | Sellers MR/AR grading; ventriculographic function and wall motion; diameter-versus-area stenosis; the chapter's >60% non-left-main and >50% left-main definitions; multi-view assessment; FFR/iFR; TIMI flow |
| 198-201 | 177-180 | Chapter 6, Q15-Q20 | Qp:Qs and cardiac-output logic; haemodynamic assessment of a fistula; IVUS; intracoronary pressure-wire/FFR interpretation. Gorlin valve-area material is acknowledged but not duplicated in this coronary-focused module |
| 202-203 | 181-182 | Chapter 6, Q21 and reading list | Constrictive-pericarditis catheter waveforms and chapter references; retained as wider catheterisation context rather than a core angiography lesson |
| 446-448 | 425-427 | Chapter 17, Q9-Q10 | CABG indications; a different context-specific significance definition (>50% plus abnormal physiology, or >90% anatomy); concomitant-valve thresholds; acute and stable revascularisation decisions; PCI-versus-CABG factors; left-main/multivessel disease and SYNTAX-informed Heart Team reasoning |
| 451-453 | 430-432 | Chapter 17, Q13-Q15 | Porcelain-aorta/no-touch implications; urgency; CABG sequence; distal target arteriotomy and anastomosis; flow assessment; conduit orientation and avoidance of kinking |
| 456-461 | 435-440 | Chapter 17, Q22-Q30 | Conduit alternatives and patency context; radial target-stenosis implications; LIMA-LAD rationale; bilateral mammary and off-pump considerations; small, intramuscular, or calcified target limitations |
| 467-473 | 446-452 | Chapter 17, Q40-Q46 | SYNTAX, EXCEL, NOBLE, RAPCO, and ISCHEMIA context used to frame anatomy-driven revascularisation discussion, not to turn a single angiographic frame into a treatment mandate |
| 629-630 | 608-609 | Appendix IV | Standard coronary angiographic views and vessel visibility by projection |

## Static-frame and interpretation limitations

The supplied deck is a PDF, so its angiograms are static raster frames rather than original DICOM cine loops. The module can teach anatomy, projection recognition, apparent lesion morphology, branch relationships, and a disciplined reporting sequence from those frames. It cannot directly demonstrate or reliably grade:

- catheter movement, transient pressure damping, or injection timing;
- frame-counted contrast transit and true TIMI-flow kinetics;
- TMPG tissue contrast entry/washout;
- systolic-versus-diastolic calibre change in myocardial bridging;
- dynamic collateral filling direction;
- lesion behaviour across a complete orthogonal acquisition;
- quantitative coronary analysis calibrated to the original acquisition;
- real-time complications or response to intracoronary therapy.

Where the source slide labels a dynamic diagnosis, the module presents it as source-identified teaching material and explicitly explains what additional cine, pressure, or physiologic evidence would be needed clinically. Learners should not infer that a single still frame independently proves severity or determines revascularisation.

## Textbook-figure policy

No figure from `KQCS2` is embedded, cropped, or redistributed in the module. In particular, the textbook's standard-view, Sellers-grade, stenosis-area, IVUS, operative, conduit, and trial figures remain in the source PDF only. The module uses paraphrased concepts and the angiography deck's extracted images, with source attribution attached to every displayed figure and case image.
