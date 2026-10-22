# Valve article image production log

Mode: built-in imagegen, one separate call per concept. All prompts below are the exact submitted prompt text. No removed textbook image was supplied as an input or style reference. Captions are original HTML copy in the article metadata.

## Review basis and limits

Articles: `surgery-savr.js`, `surgery-mvr.js`, `surgery-mitral-repair.js`, and `surgery-tvr.js`. Image claims were checked against the relevant article block and broad valve-surgery anatomy. Primary publication links for clinical context: [2020 ACC/AHA valvular heart disease guideline](https://doi.org/10.1161/CIR.0000000000000923) and [2025 ESC/EACTS valvular heart disease guideline landing page](https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/valvular-heart-disease/). The former was blocked by the web fetcher and the latter supplied a landing page rather than full text; therefore these links do **not** constitute verified figure-level source review. Neither publication's artwork was used to generate these images. AI inspection is not clinician certification.

## 1. savr-root

- Article/block: `savr` — The aortic root — anatomy you must know cold before you touch it
- Result: Accepted
- Final workspace path: `site/assets/surgery-generated/savr/aortic-root-anatomy.png`
- QA: At full size: three cusps, three sinus pockets, two coronary ostia; no text or watermark. Caption revised to describe only visible anatomy; conduction axis remains in article prose. Figure is stylized and should not be used to locate the conduction bundle.

**Prompt (verbatim):**

```text
Use case: scientific-educational
Asset type: original medical illustration for a cardiac surgery learning article about surgical aortic valve replacement
Primary request: detailed cutaway of the human aortic root from a surgeon's oblique view. Show three semilunar aortic cusps attached in a crown-shaped annulus, three bulging sinuses of Valsalva, right and left coronary ostia arising from their corresponding sinuses, sinotubular junction above the sinuses, and the membranous septum / conduction region near the right–noncoronary commissure. This is one clean illustration, not a copied textbook figure.
Style/medium: accurate contemporary medical illustration, precise but visually approachable, restrained red, blue, ivory palette, white background.
Composition/framing: landscape, close anatomical cutaway, generous clear margins, no clutter. Render enough of the LV outflow tract and ascending aorta to show orientation.
Constraints: The noncoronary sinus has NO coronary artery. Show exactly three cusps and two coronary ostia. No incision, prosthesis, or sutures. No letters, words, labels, numbers, legend, watermark, or decorative elements. Anatomical coherence is more important than photorealism.
```

## 2. savr-ar

- Article/block: `savr` — Aortic regurgitation — the other lesion, and why it behaves nothing like stenosis
- Result: Accepted
- Final workspace path: `site/assets/surgery-generated/savr/stenosis-and-regurgitation.png`
- QA: At full size: distinct small thick-walled AS ventricle, dilated chronic AR ventricle, and smaller acute AR ventricle; directional arrows were checked. The acute panel is a conceptual contrast rather than a scale drawing.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: original illustration for surgical aortic valve replacement education. Primary request: three side-by-side equally sized cutaway hearts comparing pressure-loaded aortic stenosis (small left-ventricular cavity with concentrically thickened LV wall and stiff narrowed calcified aortic cusps), chronic severe aortic regurgitation (dilated left ventricle with eccentric wall growth and incompletely coapting aortic cusps), and acute severe aortic regurgitation (normal-sized non-dilated left ventricle with incompletely coapting cusps). Show accurate anatomy and subtle red flow arrows where necessary, with no numbers or words. Style: contemporary editorial medical illustration, clear distinct panels on white, restrained warm colors, landscape. Constraints: three panels only; no coronary anomalies, no misleading shunts, no text, watermark, or legend. The ventricular chamber size differences must be visually unmistakable.
```

## 3. savr-sequence-v1

- Article/block: `savr` — The operation, step by step
- Result: Rejected by imagegen output safety filter
- Final workspace path: None
- QA: No image returned. Reissued a simplified non-graphic schematic prompt.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: procedural illustration for a surgical aortic valve replacement article. Primary request: three sequential close-up surgical views of the same aortic root: opened ascending aorta exposing three diseased calcified native cusps; native cusps excised with a clean annular rim and individually placed annular sutures; a properly seated circular prosthetic tissue valve attached to the annulus, with the coronary ostia remaining open above it. Style: original accurate medical illustration with warm surgical colors, clean white background, landscape triptych. Constraints: no labels or text, no impossible instruments, no cutting of the aortomitral curtain, no distorted coronary anatomy, no watermark. Show anatomical continuity across panels.
```

## 4. savr-sequence-v2

- Article/block: `savr` — The operation, step by step
- Result: Accepted revision
- Final workspace path: `site/assets/surgery-generated/savr/replacement-sequence.png`
- QA: At full size: three panels show diseased three-cusp valve, cleared annulus with sutures, and seated three-leaflet tissue valve. Two coronary openings remain outside the sewing ring. Diagram omits many operative details deliberately.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: original schematic surgical illustration for aortic valve replacement. Primary request: a clean three-panel sequence focused tightly on one aortic valve ring: panel one, three stiff diseased aortic cusps seen from above; panel two, the cusps removed to leave a circular annular rim with evenly spaced sutures; panel three, a circular three-leaflet tissue valve seated within that rim. Show coronary openings outside the valve seating area in all panels. Style: simplified anatomical watercolor diagram on white, restrained red and ivory, landscape. Constraints: no blood, no gore, no exposed body, no surgical instruments, no words, letters, numbers, legend, or watermark. Exactly three valve leaflets in first and third panels.
```

## 5. mvr-anatomy

- Article/block: `mvr` — Start here — the mitral apparatus you forgot
- Result: Rejected after independent review
- Final workspace path: None
- QA: Two papillary groups were visible, but chordae appeared to supply only the ipsilateral leaflet. Both papillary groups normally supply both leaflets. Removed the provisional workspace asset and article metadata.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: original anatomy illustration for mitral valve replacement article. Primary request: one cutaway human left heart showing left atrium above, two mitral leaflets, anterior and posterior leaflet edges, branching chordae tendineae, and exactly two left-ventricular papillary muscle groups anchoring the chordae; show continuity of the posterior leaflet and chordae to the ventricular wall. Style: contemporary precise medical illustration, clean cross-sectional view, white background, moderate realism, landscape. Constraints: the mitral valve has two leaflets and exactly two papillary groups; chordae connect leaflet free edges to papillary muscles, not to the aortic wall. No text, labels, watermark, surgical tools, prosthesis, or irrelevant anatomy.
```

## 6. mvr-chordal

- Article/block: `mvr` — Subvalvular preservation and the left ventricular rupture it prevents
- Result: Accepted
- Final workspace path: `site/assets/surgery-generated/mvr/chordal-preservation.png`
- QA: At full size: left panel retains native leaflet/chordal connection from sewing ring to two papillary muscles; right panel lacks chordae. Mechanical mitral prosthesis placement appears coherent. The figure illustrates continuity, not a recommendation to remove chordae.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: original medical illustration for mitral valve replacement. Primary request: two side-by-side cross-sectional diagrams comparing a mitral prosthesis with posterior leaflet and chordal apparatus preserved versus a mitral prosthesis with all native chordae removed. In preserved panel, clear intact fibrous connection from retained posterior leaflet through chordae to papillary muscles; in removed panel no chordae below sewing ring. Keep the ventricular wall shape constant to isolate the surgical difference. Style: precise, understated anatomical illustration, white background, landscape. Constraints: one circular mitral prosthesis per panel, anatomical continuity of chordae to papillary muscle, no aortic prosthesis, no words or labels, no watermark.
```

## 7. mvr-pvl

- Article/block: `mvr` — Complications and how to manage them
- Result: Accepted
- Final workspace path: `site/assets/surgery-generated/mvr/paravalvular-leak.png`
- QA: At full size: single red jet tracks around the outside of the prosthetic cuff through an annular gap into the atrium, while central occluders remain intact.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: original medical illustration for mitral valve replacement complication. Primary request: close-up cutaway of a circular mitral valve prosthesis sewn into the mitral annulus, seen from the left atrial side; show a single small gap between the prosthetic sewing cuff and native annulus, with a narrow red regurgitant flow path travelling around the OUTSIDE of the prosthesis from left ventricle into left atrium. Show intact central valve leaflets to distinguish paravalvular from transvalvular flow. Style: high-clarity medical illustration, white background, landscape. Constraints: one defect only, one flow path outside cuff only, no flow through valve center, no words, labels, watermark, or gore.
```

## 8. mitral-repair-carpentier

- Article/block: `mitral-repair` — The Carpentier functional classification and the degenerative spectrum
- Result: Rejected after visual review
- Final workspace path: None
- QA: The intended annular-dilation panel appeared to coapt. Its distinction from normal motion was unclear, so no article reference or workspace asset was created.

**Prompt (verbatim):**

```text
Use case: scientific-educational. Asset type: original comparative medical illustration for mitral valve repair article. Primary request: three evenly spaced schematic cross-sectional mitral valves during systole: normal leaflet motion but inadequate coaptation because annulus is enlarged; excessive leaflet motion with one posterior leaflet segment prolapsing above annular plane due to elongated chord; restricted leaflet motion with tethered leaflets pulled toward left ventricle by displaced papillary muscles. Show consistent left atrium above and left ventricle below. Style: crisp editorial medical diagram, ivory leaflets, red myocardium, white background, landscape. Constraints: three panels, each shows only one mechanism, no words, labels, numbers, watermark; avoid extra leaflets or extra valves.
```

## Remaining coverage

Five accepted valve images are integrated: three in SAVR and two in MVR. Seven of the planned twelve remain ungenerated or unaccepted: replacement MVR apparatus, three mitral-repair figures, and three tricuspid figures. Generation stopped when the available imagegen quota was exhausted. The rejected images were not integrated. Existing Y-incision and SAM prose contradictions were not illustrated.
