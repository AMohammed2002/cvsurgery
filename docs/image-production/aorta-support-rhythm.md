# Original image production: Bentall, arch, type A dissection, LVAD, Maze

Built-in imagegen mode. All accepted images are original outputs; no removed textbook image was supplied as input. Review is an editorial anatomy check, not clinician certification. Generated PNG originals remain in the built-in output directory; accepted copies are in the workspace.

## References checked

- **bentall:** [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248904/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248919/), [source](https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004)
- **arch:** [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC3791205/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC9622409/), [source](https://www.eacts.org/clinical-practice-guideline/eacts-sts-guidelines-for-diagnosing-and-treating-acute-and-chronic-syndromes-of-the-aortic-organ/)
- **type-a:** [source](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8690294/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8980967/)

## Accepted and rejected generation attempts

### bentall-root-anatomy

- Article block: Start here — the aortic root you forgot
- Outcome: Accepted: three cusps and distinct coronary ostia arise above valve; no text artifacts.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-0748902c-83cf-45e6-bc45-c8cfdd50e9a5.png
- Final workspace path: site/assets/surgery-generated/bentall/root-anatomy.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248904/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248919/), [source](https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original figure for a cardiac surgery training article about aortic root replacement
Primary request: Create a clear medically accurate cutaway of the native aortic root, showing the annulus at the base, three valve cusps, three sinuses of Valsalva, sinotubular junction, and right and left coronary ostia. The noncoronary sinus has no ostium.
Style/medium: refined surgical textbook-style medical illustration, original composition, clean soft colors, high anatomical clarity
Composition/framing: large single root cutaway against plain light background; slight anterior oblique view so both coronary ostia and all three sinus regions can be understood; crop with generous margins
Text: no in-image labels or text; HTML caption will supply labels
Constraints: Aortic root rises from left ventricle into ascending aorta; both coronary arteries emerge from separate sinuses above valve; three cusps, not two or four; no decorative elements, no watermark.
``

### bentall-composite-graft

- Article block: The operation, step by step — the modified Bentall
- Outcome: Accepted for schematic depiction: proximal and distal sutures and two coronary buttons shown; metallic valve below graft.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-b5a9ba51-03b4-4407-ad62-e73686b6e82b.png
- Final workspace path: site/assets/surgery-generated/bentall/composite-graft.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248904/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248919/), [source](https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original figure for cardiac surgery training article on the modified Bentall operation
Primary request: Show the completed modified Bentall root replacement in one cutaway: a composite Dacron ascending aortic graft containing a prosthetic aortic valve at its base, left and right coronary arteries reimplanted as separate circular coronary buttons into the graft wall, and a distal graft-to-native-aorta anastomosis. Show four distinct suture lines by visible fine stitching.
Style/medium: high-quality surgical medical illustration, believable anatomy, uncluttered soft neutral background
Composition/framing: tall three-quarter anterior cutaway, display full root from left ventricular outflow to distal ascending aorta
Text: no labels, no lettering; HTML caption will explain
Constraints: both coronary arteries remain patent and exit the graft wall, neither drawn as a free-floating vessel; graft connects to native aorta distally and valve annulus proximally; no extra vessels, no watermark.
``

### bentall-david-yacoub

- Article block: Valve-sparing root replacement — David versus Yacoub
- Outcome: Accepted: paired native valve views clearly distinguish circumferential annular support from scalloped remodeling; two coronary button origins per panel.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-3c68f478-33ed-48ea-99c4-c782af60c990.png
- Final workspace path: site/assets/surgery-generated/bentall/david-yacoub.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248904/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10248919/), [source](https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004)

**Full prompt**

```text
Use case: scientific-educational
Asset type: paired comparison figure for cardiac surgical training
Primary request: Show two side-by-side cutaway schematic aortic roots AFTER valve-sparing reconstruction. LEFT: David reimplantation, the native three-leaflet valve and annular base are enclosed within the base of a full cylindrical woven graft. RIGHT: Yacoub remodeling, a scalloped three-tongue graft follows the outline of the reconstructed sinuses while the native annulus remains outside and below the graft without a circumferential supporting cuff. In both, native leaflets remain present and both coronary buttons are reimplanted into the graft.
Style/medium: clean original surgical medical illustration, restrained anatomy-focused rendering, equal scale for two panels, light background
Composition/framing: symmetric two panels with ample white gap; no letters or labels within image
Constraints: three native valve cusps per panel, no prosthetic valve, no invented coronary arteries, no extra aortic branches, no watermark; differences in graft geometry and annular support must be legible.
``

### arch-branch-anatomy

- Article block: Start here — the arch and its branches
- Outcome: Accepted: three separate arch origins in correct proximal-distal sequence; brachiocephalic bifurcation visible.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-f38a3d85-4a5e-4317-9f98-1743ca28a980.png
- Final workspace path: site/assets/surgery-generated/arch/branch-anatomy.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC3791205/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC9622409/), [source](https://www.eacts.org/clinical-practice-guideline/eacts-sts-guidelines-for-diagnosing-and-treating-acute-and-chronic-syndromes-of-the-aortic-organ/)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original surgical anatomy figure for aortic arch article
Primary request: Show the thoracic aortic arch in anterior oblique view with exactly three superior branches in order from proximal to distal: brachiocephalic trunk bifurcating into right common carotid and right subclavian; left common carotid; left subclavian. Include ascending aorta, arch curvature, descending thoracic aorta, and a subtle pulmonary artery below for orientation.
Style/medium: precise original medical illustration with realistic but simplified vessel surfaces, plain pale background
Composition/framing: wide horizontal view, uncluttered
Text: no in-image text or labels; HTML caption supplies names
Constraints: exactly three separate arch origins, right subclavian comes from brachiocephalic trunk, left carotid and left subclavian separate; no fourth arch branch, no watermark.
``

### arch-cerebral-perfusion

- Article block: Cerebral protection strategies — antegrade and retrograde perfusion, and NIRS
- Outcome: REJECTED after independent review: venous and arterial circuitry are visually conflated, making cerebral perfusion anatomy misleading. Figure metadata and workspace PNG removed.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-6d0b377d-75f8-495f-b022-890d910c2a5e.png
- Final workspace path: Rejected; workspace PNG and figure metadata removed
- Revision history: Initial attempt rejected; replacement pending imagegen availability.
- References: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC3791205/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC9622409/), [source](https://www.eacts.org/clinical-practice-guideline/eacts-sts-guidelines-for-diagnosing-and-treating-acute-and-chronic-syndromes-of-the-aortic-organ/)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original surgical comparison figure for cerebral protection in aortic arch surgery
Primary request: Two equal side-by-side simplified vascular schematics. Left panel: during an open aortic arch reconstruction, oxygenated blood flows antegrade from an arterial perfusion cannula inserted in the right axillary artery through right subclavian to brachiocephalic/right carotid, with cerebral circulation supplied; arrows point toward brain. Right panel: retrograde cerebral perfusion via a superior vena cava cannula with arrows moving upward through cerebral venous drainage during circulatory arrest. The aortic arch and three head vessel origins remain visible as orientation.
Style/medium: restrained original medical infographic, realistic vessel shapes with clean colored arrows, white background
Composition/framing: paired panels with clear gap
Text: no labels, no letters, no watermark
Constraints: arteries red, veins blue; left arrows arterial antegrade toward brain; right arrows venous retrograde toward brain; no suggestion the two strategies run simultaneously; no invented branches.
``

### arch-elephant-trunk

- Article block: Extending the repair — elephant trunk and frozen elephant trunk
- Outcome: Accepted: free woven sleeve versus expanded stented distal component correctly positioned in descending aorta.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-623d557e-ef44-465d-b1c1-65af225026fe.png
- Final workspace path: site/assets/surgery-generated/arch/elephant-trunk.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC3791205/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC9622409/), [source](https://www.eacts.org/clinical-practice-guideline/eacts-sts-guidelines-for-diagnosing-and-treating-acute-and-chronic-syndromes-of-the-aortic-organ/)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original paired comparison of aortic arch reconstruction
Primary request: Show two equally sized anterior oblique aortic arches after total arch replacement. Left: conventional elephant trunk, woven fabric arch graft continuing as a loose fabric sleeve hanging freely into proximal descending aortic lumen. Right: frozen elephant trunk, fabric arch graft joined to a covered stent-graft that expands against the upper descending aortic wall. Head vessels are reconnected to the arch graft in both panels.
Style/medium: polished surgical medical illustration with cutaway descending aorta, neutral background
Composition/framing: paired panels, same view and scale, visually distinguish loose fabric sleeve from expanded stented segment
Text: no in-image labels or text
Constraints: descending extension travels downstream into descending aorta, never into ascending aorta; exactly three head-vessel connections on each; no watermark.
``

### type-a-wall-lumens

- Article block: Start here — the aortic wall and why it splits
- Outcome: Accepted: tear begins in ascending aorta; cross section shows flap dividing true and false channels within continuous outer wall; no labels.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-ae776a7f-19f1-456c-bdae-b07ed6884815.png
- Final workspace path: site/assets/surgery-generated/type-a/wall-lumens.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8690294/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8980967/)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original medical schematic for acute type A aortic dissection
Primary request: Show ascending aorta and arch with a visible intimal entry tear in the ascending segment, a thin intimal flap separating a smaller true lumen continuous with the left ventricular outflow and a larger false lumen within the aortic wall, propagating toward the arch. Include one magnified circular cross-section inset of the same segment showing the true lumen, false lumen, and intact outer adventitial layer.
Style/medium: clean, non-graphic anatomy schematic with precise tissue layers and subtle blue-red shading, plain white background
Composition/framing: aorta at left, one large cross-sectional inset at right; uncluttered
Text: no in-image words or letters; HTML caption supplies terminology
Constraints: flap lies within aortic wall, not outside it; false lumen does not connect to left ventricle; outer aortic wall remains continuous; no blood splash, no gore, no watermark.
``

### type-a-complications

- Article block: The lethal complications you are racing against
- Outcome: Accepted as a conceptual three-panel figure: retrograde root arrow, contained pericardial effusion, and narrowed coronary origin visible. Captions avoid unsupported clinical precision.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-876d3503-75e6-4bf2-89e0-5bb2a4b81891.png
- Final workspace path: site/assets/surgery-generated/type-a/complications.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8690294/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8980967/)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original multi-panel teaching schematic for proximal aortic dissection
Primary request: Three separate concise clinical mechanism panels using the same simplified heart and ascending aorta orientation. Panel 1: dissection extends into the aortic root so valve leaflets fail to coapt, with a single subtle backward arrow toward the left ventricle. Panel 2: aortic root rupture spills a small contained effusion within the pericardial sac compressing the heart. Panel 3: an intimal flap narrows the right coronary artery opening from the right sinus, compromising coronary flow.
Style/medium: clean, non-graphic medical illustration with restrained color and no dramatic tissue detail
Composition/framing: three equally sized panels, ample whitespace
Text: no text or labels; caption explains each panel
Constraints: pericardial fluid stays within sac, coronary ostium emerges from sinus above aortic valve, regurgitation arrow points from aorta to left ventricle; no gore, no watermark.
``

### type-a-malperfusion

- Article block: Malperfusion — the problem that persists after the central repair
- Outcome: Accepted: left flap impinges on branch origin, right flap/thrombus lies within branch; comparison communicates dynamic versus static mechanisms.
- Built-in output: /Users/aymanmohammed/.codex/generated_images/01a15f40-740c-7150-9e37-44f7f16a832b/exec-b85604ce-36b4-4cec-8caf-d36445d3f662.png
- Final workspace path: site/assets/surgery-generated/type-a/malperfusion.png
- Revision history: Initial attempt accepted; no revision.
- References: [source](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8690294/), [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8980967/)

**Full prompt**

```text
Use case: scientific-educational
Asset type: original side-by-side medical schematic comparing two mechanisms of branch-vessel malperfusion in aortic dissection
Primary request: Two equal transverse schematic views of an aortic branch origin with true and false lumens separated by intimal flap. LEFT dynamic obstruction: false lumen pressure pushes mobile flap across the ostium of a branch arising from the true lumen, narrowing its entrance while branch wall itself is intact. RIGHT static obstruction: the dissection flap extends into the branch artery, narrowing its true lumen within the branch with localized thrombus in the branch false channel.
Style/medium: highly simplified original surgical anatomy illustration, clean cutaway with blue-gray flap and red arterial flow, white background
Composition/framing: paired panels identical perspective and scale
Text: no in-image text or lettering; captions explain mechanisms
Constraints: left mechanism occurs at moving branch ostium, right mechanism is inside branch itself; no extraneous branches, no gore, no watermark.
``

## Remaining planned images

- Arch cerebral protection comparison: 1 replacement needed; first attempt rejected for incorrect perfusion circuitry.
- LVAD: device connections, adequate filling versus suction, and aortic-regurgitation recirculation: 3 images not yet generated.
- Maze: atrial anatomy, biatrial lesion set, and complete versus incomplete conduction block: 3 images not yet generated.

Image generation paused at the built-in tool quota. These seven images have no accepted asset or article figure metadata.
