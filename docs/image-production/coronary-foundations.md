# Surgical image production: sternotomy, CPB, CABG, OPCAB

Generation mode: built-in `image_gen`, one call per asset. No textbook image was supplied as an input or used as a reference. Each candidate was opened and visually inspected. Final PNG dimensions were read from the files. Review is editorial and anatomical screening by AI; it is not clinician certification.

## Source material checked

- Redo re-entry and CT planning: [re-entry injury study](https://pubmed.ncbi.nlm.nih.gov/25009210/) and [CT meta-analysis](https://academic.oup.com/icvts/article/22/4/472/2363355).
- Sternal fixation: [randomized comparison of rigid plates with wire cerclage](https://pubmed.ncbi.nlm.nih.gov/27923485/) and [randomized reinforcing-weave trial](https://pubmed.ncbi.nlm.nih.gov/19022005/). These support the distinct constructions, not a universal superiority claim.
- CPB cannulation, myocardial management, and separation: [2024 EACTS/EACTAIC/EBCP CPB guideline](https://academic.oup.com/ejcts/article/67/2/ezae354/8011475).
- CABG conduit origins and routes: [2021 ACC/AHA/SCAI coronary revascularization guideline](https://www.ahajournals.org/doi/abs/10.1161/cir.0000000000001038).
- OPCAB shunt and anaortic concepts for future attempts: [original operative technique](https://pmc.ncbi.nlm.nih.gov/articles/PMC6179773/) and [anaortic total arterial operative report](https://pmc.ncbi.nlm.nih.gov/articles/PMC8691864/).

## Sternotomy

### Retrosternal anatomy — accepted

Target block: “Start here — the mediastinal anatomy you forgot.” Final file: `site/assets/surgery-generated/sternotomy/retrosternal-anatomy-v1.png` (1536 × 1024). Review: internal thoracic vessels lie beside the sternum; transverse blue vein lies under manubrium; lower heart is immediately posterior to sternum in the sagittal inset. No in-image words or misleading grafts.

Full prompt:

```text
Use case: scientific-educational
Asset type: medical illustration within a surgical education article
Primary request: Original three-quarter cutaway showing the layers behind the intact midline sternum before a primary median sternotomy. Show manubrium, sternal body and xiphoid as translucent bone; right ventricle directly posterior to the lower sternum; ascending aorta deeper behind upper central sternum; left brachiocephalic vein crossing deep to upper manubrium; internal thoracic arteries running vertically inside the anterior chest wall on either side of sternum. A small inset sagittal slice may clarify anterior-to-posterior depth.
Style/medium: precise atlas-quality medical illustration, clean muted palette, crisp white background, no photorealistic gore.
Composition/framing: large landscape readable anatomy, no decorative details.
Text: no text or letters inside image; separate HTML caption will explain labels.
Constraints: preserve realistic relative anatomy; transparent cutaway rather than showing surgically divided sternum. No duplicated vessels, no additional graft, no watermark, no textbook imitation.
```

### Redo-entry adhesions — accepted

Target block: “Indications and pre-operative planning — first-time versus hostile re-entry.” Final file: `site/assets/surgery-generated/sternotomy/redo-entry-adhesions-v1.png` (1774 × 887). Review: sagittal side-by-side cutaways show preserved versus obliterated retrosternal plane; separate graft and heart are close to posterior table in redo panel; saw stops at bone. This is a conceptual risk comparison, not a CT measurement.

Full prompt:

```text
Use case: scientific-educational
Asset type: redo median sternotomy article figure
Primary request: Original two-panel educational illustration contrasting safe retrosternal clearance with hostile sternal re-entry. Left panel: sagittal cutaway of sternum with a visible fat/pericardial separation before the right ventricle. Right panel: sagittal cutaway after prior surgery, dense fibrous adhesions tethering the right ventricular free wall and a patent bypass conduit immediately behind the posterior sternal table. Show a small saw approaching bone but not entering the heart. Make the teaching point the reduced margin of safety.
Style/medium: precise medical atlas illustration, clean pale background, natural anatomical colors, no gore.
Composition/framing: side-by-side same scale, spacious landscape.
Text: no text or letters in bitmap; HTML caption supplies labels.
Constraints: graft is a distinct vessel and RV is a chamber; no vessel entering the sternum, no invented organs, no watermark, no imitation of published textbook art.
```

### Sternal closure methods — accepted

Target block: “Closure — wires, weaves and plates, and what makes a sternum mechanically stable.” Final file: `site/assets/surgery-generated/sternotomy/sternal-closure-methods-v1.png` (1536 × 1024). Review: three distinct fixation approaches are visually separable; plate screws stay in plates/bone, wires encircle hemisternums. The drawing is a method comparison, not device instructions.

Full prompt:

```text
Use case: scientific-educational
Asset type: sternotomy closure comparison article figure
Primary request: Original three-panel medical illustration of the anterior sternum after median division, comparing simple transverse peristernal wire closure, a longitudinal reinforcing wire weave with transverse wire closure, and low-profile rigid plates crossing the midline. Each panel should clearly show two reapproximated hemisternums with symmetric bone stock, no gap, and its distinct fixation method. Focus on mechanical configuration rather than brands.
Style/medium: clean surgical technical illustration, realistic bone and metal, neutral background.
Composition/framing: aligned three columns, frontal view, generous whitespace.
Text: no text or letters in bitmap; HTML caption supplies labels.
Constraints: screws only in plates, wires wrap or pass through bone rather than cutting through heart, no impossible hardware, no watermark or textbook imitation.
```

## Cardiopulmonary bypass

All three generated candidates were rejected and excluded from article data. The three intended target blocks remain “Cannulation — getting blood safely out and back in,” “Cross-clamp and cardioplegia — protecting the arrested heart,” and “Failure to separate — name the phenotype before you escalate.”

### Cannulation configurations — rejected

Candidate: `/Users/aymanmohammed/.codex/generated_images/01a15f40-4ee9-7ea0-b855-fcdf787ca2ad/exec-61ce6dcf-067c-4bcf-abf2-1ae3d834e03f.png`. Review: the femoral panel shows an arterial-flow arrow toward the leg, conflicting with the intended retrograde return. Revision needed: remove bitmap arrows and present unambiguous cannula endpoints in a simplified diagram.

Full prompt:

```text
Use case: scientific-educational
Asset type: cardiopulmonary bypass cannulation article figure
Primary request: Original medical illustration comparing three common heart-lung machine cannulation layouts in three side-by-side panels. Panel 1 central ascending aortic arterial cannula and a two-stage venous cannula entering right atrium toward inferior vena cava. Panel 2 central ascending aortic arterial cannula and two separate venous cannulas in superior and inferior vena cavae, with snares encircling each cava. Panel 3 peripheral femoral artery arterial cannula with flow rising retrograde toward aorta, plus femoral vein venous cannula advanced toward right atrium. Color arterial return red and venous drainage blue, with clearly visible external tubing.
Style/medium: educational surgical atlas, accurate simplified human anatomy, cream background.
Composition/framing: three matched schematic panels, landscape.
Text: no text inside image; HTML caption names panels.
Constraints: do not connect arterial line to a vein or vice versa; no extra cannulas, no nonsensical loop, no watermark, no textbook imitation.
```

### Cardioplegia routes — rejected

Candidate: `/Users/aymanmohammed/.codex/generated_images/01a15f40-4ee9-7ea0-b855-fcdf787ca2ad/exec-8d57b72b-ca0b-4813-8b2d-4289a23a57b0.png`. Review: anatomic cutaway incorrectly adds chordae beneath the aortic valve, and route arrows are confusing. Revision needed: reduce to a schematic coronary tree and coronary sinus, omit valve interior.

Full prompt:

```text
Use case: scientific-educational
Asset type: cardioplegia delivery article figure
Primary request: Original paired surgical cutaway showing two routes of cardioplegia into the arrested heart after aortic cross-clamping. Left: antegrade cardioplegia enters a cannula in the ascending aortic root distal to cross-clamp and flows into left and right coronary ostia, then coronary arteries. Right: retrograde cardioplegia enters via a catheter in the coronary sinus from right atrium and flows backward through the coronary venous system to myocardium. Show aortic root, aortic valve plane, right atrium, coronary sinus, and myocardium with color-coded directional arrows.
Style/medium: clean teaching illustration, precise heart section, subdued surgical colors.
Composition/framing: two comparable panels landscape, enough whitespace.
Text: no text or letters in image; HTML caption explains arrows.
Constraints: clamp is on ascending aorta above root; coronary sinus is venous posterior structure connected to right atrium, not an artery; avoid fabricated flow route or watermark.
```

### Failure-to-separate phenotypes — rejected

Candidate: `/Users/aymanmohammed/.codex/generated_images/01a15f40-4ee9-7ea0-b855-fcdf787ca2ad/exec-8bbbe9c2-ce3c-4659-877b-27a17f4c6831.png`. Review: the systemic venous/pulmonary panels contain misplaced organ beds and the intended comparison is visually ambiguous. Revision needed: split into simpler single-phenotype figures or use a precise code-native flow diagram only if the user changes the raster requirement.

Full prompt:

```text
Use case: scientific-educational
Asset type: separation from cardiopulmonary bypass article figure
Primary request: Original three-panel conceptual illustration of distinct hemodynamic patterns during a trial off bypass. Panel one: left ventricular systolic failure with visibly dilated poorly contracting left ventricle and pulmonary congestion. Panel two: right ventricular failure with distended right ventricle and systemic venous congestion. Panel three: vasoplegia with normally sized contracting ventricles and unusually dilated peripheral resistance vessels. This is a conceptual comparison, not patient imaging. Make contrast visually clear with anatomically coherent hearts and simple adjacent vascular-bed motifs.
Style/medium: professional medical education diagram, muted blue/red, cream background.
Composition/framing: three wide matched panels.
Text: no text or letters inside image; HTML caption identifies the patterns.
Constraints: no pumps or monitors that contain fake readings; no implied single diagnostic sign; no watermark or textbook imitation.
```

## CABG

### LITA and free-graft connections — rejected

Candidate: `/Users/aymanmohammed/.codex/generated_images/01a15f40-4ee9-7ea0-b855-fcdf787ca2ad/exec-c6164631-ca0b-4736-8a42-125dce5b6d2c.png`. Review: although the LITA arises near the left subclavian, its depicted target is lateral rather than the mid-LAD, while a blue free conduit runs to the anterior target. This reverses the intended teaching. Revision needed: two simplified, separately framed graft paths with clear target grooves.

Full prompt:

```text
Use case: scientific-educational
Asset type: coronary bypass anatomy article figure
Primary request: Original clean three-dimensional medical schematic of two bypass graft paths on the anterior heart. An in-situ left internal thoracic artery descends from the left subclavian artery and joins the mid left anterior descending coronary artery on anterior interventricular groove beyond a narrowed proximal LAD segment. A separate free saphenous vein conduit begins at the ascending aorta and ends on a lateral obtuse marginal coronary artery beyond narrowing. Distinct graft paths and correct inflow origins are the only teaching focus.
Style/medium: clean non-graphic medical atlas model, muted realistic colors, light background.
Composition/framing: three-quarter anterior heart and upper great vessels, generous margin, landscape.
Text: absolutely no letters or text in bitmap; caption names structures.
Constraints: LITA remains connected to left subclavian artery, never originates from aorta; vein graft originates from ascending aorta; do not draw anastomoses into heart chambers; no watermark, no textbook imitation.
```

### End-to-side anastomosis — accepted

Target block: “The operation, step by step.” Final file: `site/assets/surgery-generated/cabg/end-to-side-anastomosis-v1.png` (1536 × 1024). Review: two views show a beveled conduit end joined to the side of the native coronary; the distal lumen remains open. Fine suture placement is schematic and not an operative template.

Full prompt:

```text
Use case: scientific-educational
Asset type: coronary end-to-side anastomosis article figure
Primary request: Original enlarged cutaway schematic of a bypass graft end sewn into a longitudinal opening in the side of a native coronary artery. Show the graft's beveled distal end as an elongated elliptical mouth, a smooth heel and toe, a single fine suture line around the joined openings, and an open native lumen continuing distally. Use two adjacent views: external oblique perspective and simplified longitudinal cross-section. Anatomy is stylized and bloodless.
Style/medium: crisp surgical educational illustration, precise vessel walls, warm neutral background.
Composition/framing: close-up landscape, two large views.
Text: no letters or text in bitmap.
Constraints: do not connect end-to-end; native artery lumen remains continuous downstream; no obstructing flap or stitch crossing lumen; no watermark or textbook imitation.
```

### Graft routing — accepted

Target block: “Target selection, routing and the technical details that matter.” Final file: `site/assets/surgery-generated/cabg/graft-routing-v1.png` (1774 × 887). Review: the three grafts maintain aortic inflow and surface coronary outflow; a gentle arc, sharp kink, and taut course are visually distinct. Same-scale panels make this a conceptual geometry comparison.

Full prompt:

```text
Use case: scientific-educational
Asset type: coronary graft routing article figure
Primary request: Original three-panel simplified medical illustration of a long bypass conduit travelling from ascending aorta to a distal coronary artery over the heart. First path has a gentle untwisted curve and reaches target without tension. Second path is sharply kinked at an acute bend. Third path is stretched taut across the cardiac surface, illustrating excessive tension. Same anterior cardiac silhouette and inflow and target locations in each panel. Use visual geometry only.
Style/medium: clear non-graphic surgical schematic, elegant muted tones, clean background.
Composition/framing: three aligned panels, wide landscape.
Text: no text or letters in bitmap; HTML caption identifies each path.
Constraints: graft remains external to heart and joins a surface coronary vessel, never a chamber; no impossible disconnected ends; no watermark or textbook imitation.
```

## OPCAB and remaining work

The three planned OPCAB concepts (stabilizer versus positioner, intracoronary shunt, anaortic composite graft) were not generated because the built-in generation limit was reached. No placeholder or non-original asset was added. Across these four articles, 5 of 12 planned images are accepted and integrated; 7 remain. Three of those seven have no imagegen call yet, and four require regeneration after failed visual review.

The coronary and bypass article prose contains some claims that should be separately reviewed by a clinician; this image task did not rewrite those articles. The rejected figure claims above were not integrated.
