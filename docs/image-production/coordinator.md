# Coordinator production log — original surgical illustrations

39 accepted figures across 13 articles. The three article-agent logs in this directory contain the first 18 accepted prompts and references. This log records the 21 coordinator-produced accepted figures and the rejected variants. All accepted captions and alternative text are stored in the corresponding article block metadata. Visual review was AI review of each generated output at full size, not clinician certification.

## Primary clinical references used for the coordinator batch

- [2024 EACTS/EACTAIC/EBCP cardiopulmonary bypass guideline](https://academic.oup.com/ejcts/article/67/2/ezae354/8011475) — cannulation and cardioplegia routes.
- [2021 ACC/AHA/SCAI coronary revascularization guideline](https://www.ahajournals.org/doi/abs/10.1161/cir.0000000000001038), [original OPCAB shunt technique](https://pmc.ncbi.nlm.nih.gov/articles/PMC6179773/), and [anaortic arterial-graft operative report](https://pmc.ncbi.nlm.nih.gov/articles/PMC8691864/) — graft origins and OPCAB tools.
- [2020 ACC/AHA valvular heart disease guideline](https://doi.org/10.1161/CIR.0000000000000923) and [2025 ESC/EACTS guideline](https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/valvular-heart-disease/) — broad valve context. The full figure-level guidance was not available to the agent; these are not clinician approval.
- [Open aortic arch replacement technique](https://pmc.ncbi.nlm.nih.gov/articles/PMC4557447/) and [2024 EACTS CPB guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC11826095/) — antegrade cerebral perfusion paths.
- [LVAD manufacturer IFU](https://imda.moh.gov.vn/documents/10182/62055241/upload_00004562_1733826968455.pdf?fileId=62101760&version=1.0), [LVAD suction review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7493560/), and [aortic-regurgitation recirculation review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11352546/) — pump topology, suction and regurgitation loop.
- [Surgeon-authored biatrial Maze description](https://pmc.ncbi.nlm.nih.gov/articles/PMC13244702/), [lesion rationale](https://pmc.ncbi.nlm.nih.gov/articles/PMC9938393/), and [operative technique](https://pmc.ncbi.nlm.nih.gov/articles/PMC3904342/) — atrial landmarks and lesion continuity.

## Accepted figures

### arch-cerebral-perfusion-v2

- Final asset: `site/assets/surgery-generated/arch/cerebral-perfusion-v2.png`
- Review: Confirmed right axillary inflow through brachiocephalic artery; optional direct left common carotid cannula; no venous route or unverified directional arrows.
- Prompt:

> Use case: scientific-educational. Asset type: original aortic arch surgery illustration. Make a clean flat anatomical schematic in two side-by-side panels, from an anterior viewpoint, limited to the ascending aorta, arch, the THREE aortic arch head-vessel origins, neck arteries and two simple cannula tubes. In both panels the first head vessel is the brachiocephalic trunk dividing into RIGHT subclavian and RIGHT common carotid; second is LEFT common carotid; third is LEFT subclavian. Left panel: a RED external perfusion cannula enters RIGHT axillary/subclavian artery only. Right panel: the same right axillary perfusion cannula PLUS a separate RED cannula directly into the LEFT common carotid artery. Show the distal arch open below the branch origins to indicate lower-body circulatory arrest. All illustrated vessels are ARTERIES colored red; no veins, blue vessels, brain, heart, cerebral sinuses or arrows. No text, labels, numerals, or watermark. Keep the branching topology crisp enough for surgical teaching; prioritize accuracy over realism.

### lvad-device

- Final asset: `site/assets/surgery-generated/lvad/device-connections.png`
- Review: Confirmed LV-apex inflow, ascending-aortic outflow, and separate electrical driveline.
- Prompt:

> Use case: scientific-educational. Asset type: original illustration for durable LVAD implantation article. Primary request: clean, non-graphic anatomical cutaway of adult torso showing a continuous-flow left ventricular assist device installed. A single inflow cannula enters the left ventricular apex, leads directly to the pump just inferior to the heart, and one outflow fabric graft curves to the ascending aorta. A separate thin electrical driveline leaves the pump through abdominal skin to an external controller with two batteries. Preserve native aortic valve and distinct right ventricle. Style: high clarity modern medical illustration, plausible spatial relationships, light neutral background. Composition: landscape, heart enlarged enough to trace all connections; external controller at lower side. Text: no labels, letters or numerals. Constraints: driveline contains no blood and must not connect to a vessel; outflow must not enter pulmonary artery; no extra cannulas, no manufacturer logo, no gore, no watermark.

### lvad-suction

- Final asset: `site/assets/surgery-generated/lvad/filling-and-suction.png`
- Review: Confirmed underfilled LV brings wall near the inflow opening without reversing pump flow.
- Prompt:

> Use case: scientific-educational. Asset type: original paired physiology illustration for LVAD article. Primary request: two matched cutaways of a left ventricle with an LVAD inflow cannula entering the apex from below. Left panel shows a well-filled LV cavity and cannula tip clear of the wall; right panel shows an underfilled, smaller LV cavity with the ventricular wall/septum approaching and partly obstructing the inflow opening, a suction event. The same simplified pump/outflow connection is present in both panels and orientation remains identical. Style: precise non-graphic medical schematic, soft red and ivory colors, white background, ample whitespace. Text: no in-image labels, words, or numbers. Constraints: inflow cannula is inside the LV cavity, not the RV; no pump thrombus depicted; do not show reversal of blood flow; no clinical thresholds or device brand.

### maze-lesion

- Final asset: `site/assets/surgery-generated/maze/biatrial-lesion-concept-v1.png`
- Review: Confirmed four pulmonary vein openings, connected posterior LA box, and representative RA lesions; caption explicitly states this is a simplified lesion concept.
- Prompt:

> Original educational surgical illustration, 3:2 landscape, no text or labels, no arrows. Two atrial cutaway panels depicting a simplified COMPLETE biatrial Cox-Maze IV lesion-set concept. Left panel posterior left atrium: four pulmonary vein openings organized as two pairs, continuous encircling scar lines around both pairs with a connecting line across posterior wall forming a posterior box; one separate line extending toward mitral annulus; left atrial appendage excluded at its base. Right panel opened right atrium: superior and inferior vena cava entrances, tricuspid annulus, right atrial appendage; continuous pale-scar lines linking SVC to IVC along atrial wall, right atrial appendage to tricuspid annulus, and separate tricuspid-annular lines, without cutting through valve orifices. Lesions are continuous solid pale ivory tracks against red atrial tissue. Anatomically plausible geometry, elegantly simplified linework, high clarity. Avoid invented chambers, extra pulmonary veins, dangling disconnected lesions, text, letters, arrows.

### maze-block

- Final asset: `site/assets/surgery-generated/maze/transmural-block-v1.png`
- Review: Confirmed transmural scar blocks conduction, whereas surviving myocardial bridge permits conduction.
- Prompt:

> Original educational medical illustration, landscape 3:2, two equally sized paired panels, NO text, NO labels, NO arrows. Show a flat rectangular cutaway strip of atrial myocardium from endocardial surface at top to epicardial surface at bottom, with a narrow vertical ablation scar band crossing the wall. Left panel: scar extends fully through tissue thickness from top to bottom, completely separating two healthy pink muscle halves; small teal electrical wavefront marks on left half stop at scar, none beyond. Right panel: scar stops halfway through the wall, with a visible continuous bridge of intact pink myocardium below it connecting left and right halves; subtle teal wavefront marks travel through that bridge to the right half. Very clear microscopic schematic; no real heart anatomy, no decorative details, no text or arrows. The image teaches transmural block versus incomplete lesion conduction.

### mvr-apparatus

- Final asset: `site/assets/surgery-generated/mvr/mitral-apparatus-v2.png`
- Review: Confirmed two papillary groups and chordal fans extending to both mitral leaflets; no chordae on aortic valve.
- Prompt:

> Original medical education illustration, landscape 3:2, no text, no letters, no arrows. Single clear cutaway of the LEFT atrium above LEFT ventricle and native mitral valve between them. Mitral valve has exactly TWO unequal leaflets, anterior and posterior; exactly TWO papillary muscle groups arise from left ventricular wall. Crucial: delicate chordae from EACH papillary muscle group fan to BOTH mitral leaflets, crossing in perspective, and no chordae attach to the aortic valve. Show coapting leaflet edges and annulus. Clean anatomical teaching plate on warm off-white background, simplified sufficiently to visually trace each chordal fan. No extra valve leaflets, no right ventricle, no labels.

### repair-carpentier

- Final asset: `site/assets/surgery-generated/mitral-repair/carpentier-motion-v2.png`
- Review: Confirmed visible central Type I coaptation gap, Type II prolapse above annular plane, and Type III restriction.
- Prompt:

> Original schematic medical teaching image in three equal side-by-side panels, landscape 3:2, no text or letters or arrows. Each panel shows ONLY a side-section of a native two-leaflet mitral valve between left atrium above and left ventricle below, with annulus and chordae. Panel 1: Type I normal leaflet motion but annulus dilated, leaflet tips fail to meet leaving obvious CENTRAL gap. Panel 2: Type II excessive leaflet motion, one posterior leaflet segment billows/prolapses ABOVE annular plane into left atrium while opposite leaflet remains normal. Panel 3: Type III restricted leaflet motion, thick shortened chordae tether BOTH leaflets down into ventricle so tips cannot meet. Use thin colored outline accent only: blue panel1, amber panel2, violet panel3, no words. Accurate simple valve mechanics; visibly different leaflet positions, no extra leaflets.

### repair-techniques

- Final asset: `site/assets/surgery-generated/mitral-repair/resection-vs-neochord-v1.png`
- Review: Confirmed reapproximated posterior leaflet resection and papillary-to-leaflet neochordae.
- Prompt:

> Original medical education illustration, landscape 3:2, two equal panels, no text, no letters, no arrows. Show the mitral valve from left-atrial surgical en-face view in each panel with anterior leaflet at top, posterior leaflet below, annular ring around edge. Left panel: triangular resection of a prolapsing MIDDLE POSTERIOR leaflet scallop, two cut edges being re-approximated with sutures; the leaflet remains continuous after repair. Right panel: two thin artificial neochordae from a left-ventricular papillary muscle to the free edge of the same middle posterior leaflet scallop, with intact leaflet tissue and no resection. The view may include a small cutaway into ventricle in right panel to show papillary origin. Crisp surgical atlas style, anatomically restrained, no impossible free-floating chordae, no labels.

### repair-sam

- Final asset: `site/assets/surgery-generated/mitral-repair/sam-outflow-v1.png`
- Review: Confirmed anterior mitral leaflet approaches LV outflow tract in affected panel and remains clear in paired panel.
- Prompt:

> Original clinically precise medical diagram, landscape 3:2, two side-by-side long-axis heart cutaways, no text, no labels, no arrows. Both show LV, mitral valve posterior-left, aortic valve and LV outflow tract anterior-right. Left panel after mitral repair: anterior mitral leaflet is drawn forward into the NARROW LV outflow tract during systole, nearly contacting septum; posterior leaflet and annular ring visible, with small leaflet coaptation gap toward left atrium. Right panel after correction: anterior leaflet stays away from septum, LV outflow tract open and wide, mitral leaflets coapt. Simplified realistic geometry, no invented valves or flow arrows, no dynamic blood jets.

### tv-anatomy

- Final asset: `site/assets/surgery-generated/tvr/right-atrial-anatomy-v1.png`
- Review: Confirmed caval entries, three tricuspid leaflets, coronary sinus ostium, and conduction axis near septal annulus.
- Prompt:

> Original surgical education illustration, landscape 3:2, no text, no letters, no arrows. Opened RIGHT atrium looking down on tricuspid valve from the surgeon's view. Show exactly THREE tricuspid leaflets around a triangular annulus. Superior vena cava enters upper right atrium and inferior vena cava lower right atrium; coronary sinus ostium sits near inferior-septal atrial wall. A fine yellow atrioventricular conduction axis hugs the septal annulus near the anteroseptal commissure, not across the valve leaflets. Include the thin septal leaflet adjacent to septum and two larger free-wall leaflets. Clean orientation with clear anatomy, medical teaching plate, avoid mitral two-leaflet appearance and extra openings.

### tv-functional

- Final asset: `site/assets/surgery-generated/tvr/functional-tr-v1.png`
- Review: Confirmed dilated right ventricle and annulus with intact but tethered leaflets and central gap.
- Prompt:

> Original medical teaching illustration, landscape 3:2, paired panels, no text, no arrows, no letters. Frontal cutaways of RIGHT atrium above and RIGHT ventricle below with TRICUSPID valve of exactly three leaflets. Left normal panel: modest annulus and leaflet tips coapt centrally. Right functional regurgitation panel: right ventricle and annulus visibly enlarged, papillary tethering pulls leaflets downward into ventricle and leaves an obvious CENTRAL coaptation gap while leaflet tissue itself is intact. Do not draw a torn leaflet or primary disease. Soft medical atlas colors, light background, highly legible paired comparison.

### cabg-map

- Final asset: `site/assets/surgery-generated/cabg/lita-and-vein-grafts-v2.png`
- Review: Confirmed in-situ internal thoracic artery retains subclavian origin and reaches LAD; free vein graft originates at ascending aorta and reaches lateral branch.
- Prompt:

> Original surgical anatomy illustration, landscape 3:2, no text, letters, arrows. Anterior human heart with clear coronary vessels. One IN-SITU LEFT INTERNAL THORACIC ARTERY originates from left subclavian artery, descends behind left chest wall and its distal free end connects to the LAD on anterior interventricular groove. A separate FREE SAPHENOUS VEIN graft originates at ASCENDING AORTA and curves to an obtuse marginal artery on lateral left ventricle. The in-situ artery must stay connected proximally to subclavian; only saphenous graft attaches to aorta. Two grafts distinctly colored warm red arterial and pale ivory vein, no other grafts, no extra connections, no labels. Surgical cutaway with enough chest wall to trace origins and destinations.

### opcab-tools

- Final asset: `site/assets/surgery-generated/opcab/stabilizer-vs-positioner-v1.png`
- Review: Confirmed paired stabilizer feet straddle local target; apical device repositions whole heart.
- Prompt:

> Original medical surgical teaching plate, landscape 3:2, two panels, no labels, letters, or arrows. Exposed beating human heart from anterior operative view. Left panel: an epicardial local suction stabilizer has TWO parallel footplates bracketing a small target coronary artery segment on ventricular surface, leaving the segment exposed between the feet for suturing. Right panel: a single apical suction positioner attaches to the APEX of the heart and lifts/reorients the WHOLE heart to expose lateral coronary surface; no footplates straddling coronary. Both devices have external flexible arms attached to table outside field. Crisp surgical illustration, no extra grafts or catheters.

### opcab-shunt

- Final asset: `site/assets/surgery-generated/opcab/intracoronary-shunt-v1.png`
- Review: Confirmed intraluminal shunt bridges both sides of coronary arteriotomy beneath graft suture line.
- Prompt:

> Original magnified surgical education illustration, landscape 3:2, no labels, text or letters, no arrows. Close-up of a native coronary artery on a beating heart, opened longitudinally with an arteriotomy. A tiny smooth flexible intracoronary shunt passes THROUGH the open arteriotomy with one end inside the upstream artery and its other end inside downstream artery, preserving the lumen while a graft is being sewn end-to-side over the arteriotomy. The shunt is within artery, not in the graft. Show only one coronary and one graft, and tiny sutures in progress. Use a small separate inset of the shunt alone if it improves clarity. Medically plausible scale, clean surgical macro illustration.

### opcab-anaortic

- Final asset: `site/assets/surgery-generated/opcab/anaortic-y-graft-v1.png`
- Review: Confirmed single Y-junction to in-situ internal thoracic artery and no aortic graft attachment.
- Prompt:

> Original cardiac surgery teaching illustration, landscape 3:2, no labels, text, arrows. Anterior heart with ascending aorta visually untouched and with NO graft attached. In-situ LEFT internal thoracic artery remains connected to left subclavian proximally, then runs down to LAD. A second FREE radial artery conduit makes a Y-junction to the side of the LEFT internal thoracic artery near midcourse, then curves laterally to an obtuse marginal branch on the left ventricular lateral wall. Show only these TWO coronary distal targets and exactly one Y-junction. Distinguish native aorta without clamps, holes, sutures or proximal grafts. Clear surgical anatomy on off-white background; no invented target arteries.

### maze-atria-v2

- Final asset: `site/assets/surgery-generated/maze/atrial-landmarks-v2.png`
- Review: Confirmed four pulmonary-vein openings and appendage on LA map; SVC, IVC and tricuspid orifice on RA map.
- Prompt:

> Professional flat VECTOR medical diagram on white background, landscape 3:2, no text, letters, arrows, photographs, or realism. Two abstract atrial chamber maps as gently colored outlined shapes. Left map is posterior left atrium: EXACTLY FOUR circular pulmonary-vein ports arranged in two vertical pairs, a small left-atrial-appendage lobe protrudes from upper-left rim, a mitral-orifice oval at bottom. Right map is opened right atrium: superior vena cava port at top, inferior vena cava port at bottom, an oval tricuspid orifice at lower right, and right-atrial-appendage lobe at upper right. Flat textbook-style colored shapes, no confusing extra holes. This is an orientation diagram, not a depiction of a body.

### lvad-ar-v3

- Final asset: `site/assets/surgery-generated/lvad/aortic-regurgitation-recirculation-v3.png`
- Review: Confirmed pump outflow joins ascending aorta above valve and regurgitant droplets descend from aortic root into LV.
- Prompt:

> Professional flat vector EDUCATIONAL CIRCULATION SCHEMATIC on white background, landscape 3:2, no text, letters or arrows. Draw exactly three main anatomical objects: a simple left ventricle chamber (pink) at lower left, a vertical ascending aorta (red) at upper center, and a small external LVAD pump (gray) at lower right. Three physically separate routes: (1) a gray inflow tube from LV APEX to pump, (2) a gray outflow tube from pump to SIDE OF ASCENDING AORTA above aortic valve, (3) a native aortic-valve orifice directly between LV upper outlet and aorta lower root. Place a small RED blood droplet stream descending through the leaky native aortic valve from aortic root back into LV, depicting recirculation. Do not show an arch or branch vessels, no extra conduits, no cross-connections, no directional arrows. Diagrammatic plumbing correctness is essential.

### tv-annuloplasty-v2

- Final asset: `site/assets/surgery-generated/tvr/ring-vs-de-vega-v2.png`
- Review: Confirmed one continuous partial band versus separate double-running suture along free-wall annulus; septal side spared.
- Prompt:

> Professional flat vector surgical education plate on off-white background, landscape 3:2, no text, letters, arrows, photographs. Two equal circular EN-FACE tricuspid-valve diagrams each with exactly three visible leaflets and a septal side at the LEFT. Left: ONE CONTINUOUS C-shaped prosthetic band on the right side of annulus, spanning anterior and posterior free-wall annulus with its two ends stopping before the septal side, secured by small sutures. Right: NO band or ring; only one continuous double-running blue De Vega suture, with small pledgets, follows the same anterior/posterior annular arc and cinches it narrower while septal side is spared. Keep diagrams sparse so methods are unmistakable.

### cpb-cannulation-v3

- Final asset: `site/assets/surgery-generated/bypass/two-stage-vs-bicaval-v3.png`
- Review: Confirmed single right-atrial two-stage venous cannula versus separate SVC/IVC cannulas with snares; both have separate aortic return.
- Prompt:

> Original medically accurate flat medical diagram on white, landscape 3:2. Show two side-by-side isolated HEARTS only, no external body or machine, no labels, text, letters, arrows. Both hearts have red ascending aorta, blue superior vena cava, blue inferior vena cava and blue right atrium. Left: one red arterial cannula in ascending aorta and ONE blue TWO-STAGE venous cannula entering right atrial appendage, with tip extending down into inferior vena cava, side holes within right atrium. Right: one red arterial cannula in ascending aorta and TWO SEPARATE blue venous cannulas, one inserted directly into superior vena cava and one inserted directly into inferior vena cava, each with a snare around the cava proximal to right atrium; no blue cannula in atrial wall. All cannula free ends lead OFF the lower edge of image without crossing or reconnecting. The comparison teaches single two-stage versus bicaval venous cannulation. Accurate number and destination of cannulas is paramount. No machine.

### cpb-cardioplegia-v2

- Final asset: `site/assets/surgery-generated/bypass/antegrade-vs-retrograde-v2.png`
- Review: Confirmed aortic-root catheter below cross-clamp and coronary-sinus route from right atrium.
- Prompt:

> Professional flat-vector medical teaching diagram on white background, landscape 3:2, two panels, no text, letters, arrows, realism. In each panel draw only a proximal ascending aorta, two coronary ostia branching near aortic root, and a simplified heart outline. Left panel: a horizontal CROSS CLAMP closes ascending aorta ABOVE the root; a small cardioplegia catheter enters the isolated aortic root THROUGH ITS SIDE BELOW THE CLAMP and ABOVE aortic valve, with colored solution traveling into both coronary ostia. Catheter must not pass through clamp. Right panel: a blue coronary sinus tube enters right atrial chamber from the side and connects to blue venous coronary network on heart; ascending aorta and coronary ostia are uninstrumented. No cannula in ventricle, no bypass circuit, clean teaching schematic.

### cpb-separate-v2

- Final asset: `site/assets/surgery-generated/bypass/weaning-phenotypes-v2.png`
- Review: Confirmed LV enlargement, RV enlargement with septal shift, and separate coronary-air phenotype; no extra bypass tubing.
- Prompt:

> Professional flat vector EDUCATIONAL comparison of post-bypass ventricular phenotypes, white background, landscape 3:2, three equal panels, no text, letters, arrows, external tubing, or body surface. Each panel is a simple four-chamber heart cross-section, LEFT VENTRICLE on viewer's right with thick wall and RIGHT VENTRICLE on viewer's left with thinner wall. Panel A: enlarged floppy LV with relatively normal RV. Panel B: enlarged RV bows septum toward small LV. Panel C: both ventricular chambers normal size but a tiny cluster of clear air bubbles lies in the proximal coronary-artery branch from aortic root, suggesting coronary air/ischemia. Keep geometry and color consistent across all panels. Prioritize unmistakable relative chamber enlargement; no purple LV, no extra valves.

## Rejected variants and revisions

### lvad-ar-loop — rejected

- Finding: Regurgitant panel drew an inflow-cannula arrow from pump toward LV, reversing required flow.
- Revision: Simplified the circulation topology and removed ambiguous arrows or valve detail.
- Prompt:

> Use case: scientific-educational. Asset type: original flow-mechanism illustration for LVAD article. Primary request: one anatomical cutaway of heart, LVAD and ascending aorta showing aortic-regurgitation recirculation. LV apical inflow connects to external pump; outflow graft connects to ascending aorta. A visibly incompetent native aortic valve leaves a central gap; one red flow path returns from aorta through the valve into LV and back through the pump. A separate forward systemic stream continues up the aorta. Style: restrained non-graphic medical diagram, white background, landscape. Text: no labels or numbers. Constraints: return loop crosses native aortic valve from aorta to LV, never through an atrial or septal defect; pump runs LV to aorta only; no coronary ostium obstruction, no wrong chamber connection, no watermark.

### lvad-ar-loop-v2 — rejected

- Finding: Aortic-valve depiction appeared double layered or four cusped; anatomical ambiguity prevented acceptance.
- Revision: Simplified the circulation topology and removed ambiguous arrows or valve detail.
- Prompt:

> Use case: scientific-educational. Asset type: original cardiac surgery teaching illustration. Create one simplified, non-graphic anatomical cutaway of the LEFT ventricle, native three-cusp aortic valve, ascending aorta, and durable LVAD. Show one cannula entering the LV apex, one pump outside the ventricle, and one fabric outflow graft attached to the ascending aorta. The native aortic valve has a visible coaptation gap in DIASTOLE to teach aortic regurgitation. There must be NO ARROWS anywhere, no text, no labels; the HTML caption will explain recirculation. Accurate topology is essential: inflow cannula in LV apex; outflow graft from pump to ascending aorta; no graft from pump into ventricle except inflow; no atrial connection, septal shunt, or pulmonary artery connection. Light background and generous margins.

### lvad-ar — rejected

- Finding: Pump outflow graft attached too far into arch rather than the ascending aorta.
- Revision: Simplified the circulation topology and removed ambiguous arrows or valve detail.
- Prompt:

> Create a medically accurate original surgical education diagram, landscape 3:2, no text, no letters, no labels, no arrows. Show one simplified left ventricle and LVAD circuit in cross section with four unambiguous connections: pulmonary venous blood enters left atrium and left ventricle; LVAD inflow cannula enters LV apex and attaches to pump; pump outflow graft joins ascending aorta above the aortic root; native aortic valve lies between LV and aorta. Depict severe aortic regurgitation as a single narrow red stream passing DOWN centrally through incompletely coapting native aortic valve cusps FROM aortic root into LV. Depict forward pump flow with red blood visible in LV-to-pump inflow and pump-to-aorta outflow tubes. Show valve as simple three-cusp line in longitudinal section, not a second valve. Clean editorial vector-like anatomy on off-white background with accurate chamber and vessel topology. Absolutely no flow arrows, no extra vessel connections, no second valve, no words.

### maze-atria — rejected

- Finding: Image-generation safety system rejected output; no asset returned.
- Revision: Changed to a flat atrial orientation map.
- Prompt:

> Create ONE original high-resolution medical teaching illustration, 3:2 landscape, no text or labels, no arrows. Surgical posterior-open view of a human left atrium beside an opened right atrium, as two clean anatomically faithful panels on warm off-white background. Left panel: left atrial posterior wall with exactly FOUR pulmonary vein ostia (two left, two right) entering its posterior aspect; left atrial appendage projecting laterally on anatomic left. A mitral valve orifice inferiorly. Right panel: opened right atrium showing superior vena cava entrance superiorly, inferior vena cava entrance inferiorly, tricuspid valve inferior-medially, and right atrial appendage superior-laterally. Use restrained red/pink tissue and subtle depth, clear negative space. Not a fantasy heart; no extra veins, no misplaced appendages, no lesion lines, no text. Designed for surgical trainees to recognize structures before a Cox-Maze procedure.

### tv-annuloplasty — rejected

- Finding: Partial ring appeared as two disconnected bands, a misleading repair depiction.
- Revision: Replaced the disconnected implant with one continuous partial band.
- Prompt:

> Original detailed yet simple two-panel surgical teaching plate, landscape 3:2, no text, no labels, no arrows. Both panels show atrial en-face view of a tricuspid annulus with exactly three native leaflets and a visibly narrowed posterior annular segment. Left: a curved partial prosthetic annuloplasty ring sewn along the ANTERIOR and POSTERIOR annulus, with septal conduction region intentionally spared; visible evenly spaced sutures. Right: De Vega suture annuloplasty with two concentric rows of pledgeted purse-string sutures along the anterior and posterior annulus narrowing its circumference, no prosthetic ring. Tricuspid three-leaflet anatomy remains visible in both. Clean medical diagram, no fourth leaflet, no ring crossing the septal conduction region.

### cpb-cannulation — rejected

- Finding: Image-generation safety system rejected output; no asset returned.
- Revision: Reduced the diagram to explicit isolated anatomy and fewer routes.
- Prompt:

> Original medical educational illustration, landscape 3:2, two panels, no text, letters, or arrows. Show cardiac surgery cannulation under median sternotomy. Left panel CENTRAL bypass: a large venous drainage cannula enters right atrial appendage and goes toward an external heart-lung machine at left; separate red arterial return cannula enters ascending aorta and comes from machine. Right panel PERIPHERAL bypass: blue venous drainage cannula enters femoral VEIN in groin and travels toward right atrium; red arterial return cannula enters femoral ARTERY and travels toward aorta. Use blue only for venous drainage, red only for arterial return. Keep cannula routes physically separate. Simplified anatomic cutaway of chest and groin, no aortic-valve interiors, no invented catheter crossing. Render as crisp schematic, not photorealistic.

### cpb-cannulation-v2 — rejected

- Finding: Peripheral panel also showed central atrial/aortic cannulas, making the alternative configuration misleading.
- Revision: Reduced the diagram to explicit isolated anatomy and fewer routes.
- Prompt:

> Professional flat-vector cardiac surgery education diagram, landscape 3:2, white background, no words, letters, arrows, realistic torso, or body surface. Two side-by-side minimalist plumbing panels. Each panel shows one heart silhouette with red ascending aorta and blue right atrium, plus a small square heart-lung machine located BELOW. In left panel, one BLUE tube connects right atrium to machine venous inlet and a separate RED tube connects machine arterial outlet to ascending aorta. In right panel, the same two machine tubes attach instead to two separated small LOWER-LIMB vessel icons: BLUE femoral vein icon connected to right atrium, RED femoral artery icon connected to aorta; never cross the two tubes. Use only red for arterial path and blue for venous path, physically distinct, no flow arrows, clean iconographic schematic.

### cpb-cardioplegia — rejected

- Finding: Root catheter appeared to traverse the cross-clamp.
- Revision: Reduced the diagram to explicit isolated anatomy and fewer routes.
- Prompt:

> Original surgical teaching diagram in two side-by-side panels, 3:2 landscape, no text, no letters, no arrows. Isolated simplified HEART and proximal GREAT VESSELS under cross-clamp. Left: red cardioplegia cannula in aortic root BETWEEN closed cross-clamp on ascending aorta and native aortic valve, solution filling root and entering both coronary ostia. Right: blue cardioplegia cannula in CORONARY SINUS through right atrium, solution distributed retrogradely through coronary venous system to myocardium. Show coronary ostia only at aortic root; coronary sinus opening only in right atrium. No direct cannula into a ventricle, no additional valve details. Clear color separation and medical textbook schematic style on off-white background.

### cpb-separate — rejected

- Finding: Extra bypass tubes and inconsistent chamber coloring made phenotypes difficult to interpret.
- Revision: Reduced the diagram to explicit isolated anatomy and fewer routes.
- Prompt:

> Original 3-panel medical teaching image, landscape 3:2, no text, letters, arrows. Each panel shows a simplified heart after cardiopulmonary bypass, with left ventricle thick-walled and right ventricle thin-walled, plus extracardiac pulmonary circuit suggested. Left: severely weak and enlarged left ventricle with poor wall tone, right ventricle relatively normal. Center: severely enlarged right ventricle and septum bowed toward small left ventricle, suggesting RV failure. Right: both ventricular sizes near normal but air bubbles are visible in coronary perfusion at aortic root after de-airing failure, indicating an ischemic/air issue rather than simple pump failure. Medical anatomical diagram, distinct phenotypes, no flow arrows or labels, no imagined organs.

Additional rejected arch-perfusion trials are recorded in the aorta agent log and coordinator review; one root candidate showed an incorrect blue/venous route, another used ambiguous flow arrows. The accepted revision isolates arterial cannulation without arrows.

## Article-text issues observed, not reproduced in images

The mitral-repair SAM block describes a “large ring that reduces the annulus aggressively” and later an undersized ring as a contributor. The SAM image depicts leaflet/outflow geometry without asserting either ring-size statement. The SAVR block has a Y-incision/root-enlargement description that would require a separate source-level reconciliation; no image was generated to resolve that disputed detail. These prose issues are outside this image-integration scope.

## Verification

`node site/tools/validate-surgery-images.js` confirms exactly 39 files, three per article, unique figure IDs, matching PNG dimensions, local paths, alt/caption metadata, and service-worker manifest coverage. `node site/tools/validate-surgery.js`, `node site/tools/validate-image-policy.js`, `node site/tools/test-offline-shell.js`, and `node site/tools/validate.js` also passed.

Desktop browser review showed three rendered figures and no horizontal overflow in every article in both light and dark themes. The Maze article was opened through a fresh local staff-preview session because the learner route was subject to the app's pacing lock. The full-size dialog opened in both themes; keyboard activation of Actual size and Escape worked, and focus returned to its trigger. After stopping the local server, the bypass article and its previously unloaded cannulation image opened and decoded from the service-worker cache. No mobile tests were run.
