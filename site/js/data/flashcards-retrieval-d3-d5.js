/* Authored retrieval-v2 packs for every lesson in lessons-d3.js through lessons-d5.js. */
"use strict";

(function registerDayThreeToFiveRetrieval() {
  if (!window.FlashcardSchema) throw new Error("flashcard-schema.js must load before d3-d5 retrieval packs");

  const REVIEWER = "assistant-editorial-review";
  const REVIEWED_AT = "2026-07-31";
  const REVIEW_BY = "2027-07-31";
  const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
  const generatedIds = new Set();

  function safeId(value) {
    return String(value == null ? "part" : value).toLowerCase().replace(/<[^>]+>/g, " ")
      .replace(/&[a-z0-9#]+;/gi, " ").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "").slice(0, 72) || "part";
  }

  function opaqueId(seed) {
    let left = 0x811c9dc5;
    let right = 0x9e3779b9;
    for (let index = 0; index < seed.length; index += 1) {
      left = Math.imul(left ^ seed.charCodeAt(index), 0x01000193);
      right = Math.imul(right ^ (seed.charCodeAt(index) + index), 0x85ebca6b);
    }
    let body = "";
    for (let index = 0; index < 26; index += 1) {
      left = Math.imul(left ^ (left >>> 15) ^ index, 0x2c1b3c6d);
      right = Math.imul(right ^ (right >>> 13) ^ left, 0x297a2d39);
      body += ALPHABET[((left ^ right) >>> 0) % ALPHABET.length];
    }
    const id = "fc2_" + body;
    if (generatedIds.has(id)) throw new Error("Opaque retrieval ID collision for " + seed);
    generatedIds.add(id);
    return id;
  }

  function atomic(cloze, explanation, legacyId) {
    return { archetype: "atomic-concept", cloze, explanation, legacyId };
  }
  function mechanism(cloze, explanation, legacyId) {
    return { archetype: "mechanism-decision", cloze, explanation, legacyId };
  }
  function bounded(cloze, explanation, answerCount) {
    return { archetype: "bounded-set", cloze, explanation, answerCount, ordered: false };
  }
  function mapping(cloze, explanation, answerCount) {
    return { archetype: "mapping-set", cloze, explanation, answerCount, ordered: false };
  }
  function numeric(cloze, explanation, metadata, legacyId) {
    return { archetype: "numeric-guideline", cloze, explanation, numeric: metadata, legacyId };
  }
  function formula(cloze, explanation) {
    return { archetype: "formula", cloze, explanation };
  }
  function sequence(cloze, explanation, answerCount) {
    return { archetype: "ordered-sequence", cloze, explanation, answerCount, ordered: true };
  }
  function contrast(cloze, explanation, legacyId) {
    return { archetype: "contrast", cloze, explanation, legacyId };
  }
  function spec(title, tier, category, statement, card, rationale) {
    return { title, tier, category, statement, card, rationale: rationale || "This is a distinct must-know retrieval target for the teaching chunk." };
  }
  function support(title, category, statement, rationale) {
    return spec(title, "enrichment", category, statement, null, rationale);
  }

  const PACKS = {
    "d3-as": [
      spec("Pressure Overload: The Core Concept", "core", "mechanism",
        "Aortic stenosis produces chronic LV pressure overload and compensatory concentric hypertrophy.",
        mechanism("Chronic aortic stenosis produces pressure overload, so the LV adapts with {{c1::concentric hypertrophy}}.",
          "The thickened, stiff LV becomes dependent on diastolic filling time and atrial contraction.")),
      spec("Pathophysiology of AS", "core", "number",
        "An aortic valve area at or below 1.0 cm2 supports severe aortic stenosis.",
        numeric("Severe aortic stenosis by valve area is {{c1::≤1.0 cm2}}.",
          "Valve area is flow-dependent and must be reconciled with velocity, mean gradient, and clinical context.",
          { comparator: "at most", value: 1.0, unit: "cm2", condition: "aortic valve area in suspected severe AS", precision: "institution-dependent" })),
      spec("Severity Classification", "core", "number",
        "A dimensionless velocity index at or below 0.25 supports severe aortic stenosis.",
        numeric("In discordant aortic stenosis, a dimensionless index of {{c1::≤0.25}} supports severe disease.",
          "The ratio avoids squaring an uncertain LVOT diameter, but it still belongs in a multiparameter assessment.",
          { comparator: "at most", value: 0.25, unit: "dimensionless", condition: "dimensionless velocity index in suspected severe AS", precision: "institution-dependent" })),
      spec("Diagnosing Low-Flow, Low-Gradient AS", "applied-core", "comparison",
        "Dobutamine distinguishes fixed true-severe AS from pseudosevere AS that opens as flow increases.",
        mapping("Dobutamine stress in low-flow AS maps as {{c1::true severe → AVA stays fixed; pseudosevere → AVA increases}}.",
          "CT valve-calcium scoring is the anatomic fallback when stress findings remain indeterminate.", 2)),
      spec("The Classic Symptom Triad and Prognosis", "core", "bounded-set",
        "Angina, syncope, and heart failure are the classic symptomatic transition in aortic stenosis.",
        bounded("The classic symptomatic triad of aortic stenosis is {{c1::angina; syncope; heart failure}}.",
          "Symptoms mark a sharp change in untreated prognosis and trigger evaluation for valve replacement.", 3)),
      spec("Intervention Thresholds (2021 ACC/AHA)", "applied-core", "rescue",
        "Symptomatic severe aortic stenosis generally requires aortic valve replacement unless intervention is futile.",
        mechanism("Symptomatic severe aortic stenosis generally requires {{c1::aortic valve replacement}}.",
          "The choice between transcatheter and surgical replacement depends on anatomy, concomitant disease, life expectancy, risk, and patient goals.")),
      spec("Hemodynamic Management of the AS Patient", "applied-core", "bounded-set",
        "Severe-AS management protects rhythm, preload, heart rate, and arterial pressure.",
        bounded("Perioperative severe-AS management protects four conditions: {{c1::sinus rhythm; adequate preload; controlled heart rate; maintained arterial pressure}}.",
          "A fixed stroke volume makes hypotension, tachycardia, bradycardia, and loss of atrial contraction poorly tolerated.", 4)),
      spec("Senior reasoning: the AS pressure-volume loop and the flow-dependence of every gradient", "applied-core", "mechanism",
        "A low transvalvular gradient cannot exclude severe AS when flow is low.",
        mechanism("A low mean gradient cannot exclude severe AS because the gradient depends on {{c1::transvalvular flow}}.",
          "Resolve discordance with the complete echo dataset, dimensionless index, dobutamine response, or CT calcium burden.")),
      spec("PGY-5 mastery: pseudo-severe AS — when NOT to replace the valve", "applied-core", "rescue",
        "When valve area increases substantially with restored flow, cardiomyopathy rather than fixed valve obstruction is the treatment target.",
        mechanism("When dobutamine opens the AVA past 1.0 cm2 with little gradient change, management should target the {{c1::cardiomyopathy}}.",
          "This pseudosevere pattern argues against exposing the patient to valve replacement that will not fix the low-output ventricle."))
    ],

    "d3-ar": [
      spec("Pathophysiology of Chronic AR", "core", "mechanism",
        "Chronic aortic regurgitation causes LV volume overload, eccentric hypertrophy, and a wide pulse pressure.",
        mechanism("Chronic aortic regurgitation causes volume overload, so the LV adapts with {{c1::eccentric hypertrophy}}.",
          "Series sarcomere addition enlarges the chamber and initially accommodates regurgitant volume at a lower filling pressure.")),
      spec("Acute AR: A Cardiac Emergency", "applied-core", "rescue",
        "Acute severe AR requires urgent surgery, and diastolic balloon augmentation worsens the leak.",
        mechanism("In acute severe aortic regurgitation, diastolic augmentation makes {{c1::IABP}} contraindicated.",
          "Afterload reduction and inotropic or chronotropic support are bridges to emergency surgical correction, not definitive therapy.")),
      spec("Severity Criteria and Intervention Thresholds", "core", "number",
        "A regurgitant fraction at or above 50% supports severe aortic regurgitation.",
        numeric("Severe aortic regurgitation includes a regurgitant fraction of {{c1::≥50%}}.",
          "Severity should be integrated with regurgitant volume, EROA, flow reversal, chamber response, and image quality.",
          { comparator: "at least", value: 50, unit: "%", condition: "regurgitant fraction in suspected severe AR", precision: "institution-dependent" })),
      spec("Hemodynamic Management of AR", "applied-core", "bounded-set",
        "Aortic-regurgitation management favors forward flow by shortening diastole and lowering afterload while avoiding IABP.",
        bounded("For severe aortic regurgitation during anesthesia, the preferred profile is {{c1::faster heart rate; lower afterload; preserved contractility; no IABP}}.",
          "Bradycardia lengthens regurgitant time, whereas lower systemic resistance favors forward ejection.", 4)),
      spec("Senior reasoning: the AR loop and why EF over-reads systolic function", "applied-core", "number",
        "LV end-systolic dimension near 50 mm is a key adverse-remodeling trigger in severe chronic AR.",
        numeric("In severe chronic AR, the lesson's LVESD trigger is approximately {{c1::50 mm}}.",
          "Index the dimension to body size and reconcile it with symptoms, EF trend, volumes, and image quality.",
          { comparator: "approximately", value: 50, unit: "mm", condition: "LVESD in severe chronic AR", precision: "institution-dependent" })),
      spec("PGY-5 mastery: placing the operation on the AR natural-history curve", "applied-core", "mechanism",
        "The operation is timed before symptoms when progressive LV remodeling threatens irreversible dysfunction.",
        mechanism("The reason to operate before late symptoms in severe AR is to prevent {{c1::irreversible LV remodeling}}.",
          "Preserved EF can overstate myocardial health in a volume-loaded ventricle, so dimension and trajectory matter."))
    ],

    "d3-ms": [
      spec("Pathophysiology of MS", "core", "mechanism",
        "Mitral stenosis restricts LV filling, producing low output from underfilling rather than primary LV pump failure.",
        mechanism("In isolated mitral stenosis, low cardiac output primarily reflects {{c1::LV underfilling}}.",
          "The upstream obstruction raises left-atrial and pulmonary pressures while the LV remains small and relatively normal.")),
      spec("Atrial Fibrillation and Thrombus Risk in MS", "applied-core", "rescue",
        "Mitral stenosis with atrial fibrillation creates left-atrial stasis and requires anticoagulation.",
        mechanism("Mitral stenosis complicated by atrial fibrillation requires {{c1::anticoagulation}}.",
          "A dilated, poorly emptying left atrium promotes appendage thrombus and systemic embolism.")),
      spec("Severity Classification and Intervention", "core", "number",
        "A mitral valve area at or below 1.5 cm2 supports severe mitral stenosis.",
        numeric("Severe mitral stenosis by valve area is {{c1::≤1.5 cm2}}.",
          "Mean gradient varies with heart rate and flow, so anatomy, symptoms, pulmonary pressure, and rhythm must also be considered.",
          { comparator: "at most", value: 1.5, unit: "cm2", condition: "mitral valve area in suspected severe MS", precision: "institution-dependent" })),
      spec("Hemodynamic Management of MS", "applied-core", "bounded-set",
        "Mitral-stenosis management protects slow filling time, sinus rhythm, and adequate but not excessive preload.",
        bounded("For severe mitral stenosis during anesthesia, the preferred profile is {{c1::slow heart rate; sinus rhythm; adequate preload}}.",
          "Tachycardia shortens diastole, atrial fibrillation removes atrial contribution, and excess volume worsens pulmonary congestion.", 3)),
      spec("Senior reasoning: rheumatic MS and the balloon-vs-surgery decision", "applied-core", "bounded-set",
        "Left-atrial thrombus, more-than-mild MR, and unfavorable calcified anatomy argue against balloon commissurotomy.",
        bounded("Before balloon commissurotomy, the major exclusion findings are {{c1::left-atrial thrombus; more-than-mild MR; unfavorable calcified anatomy}}.",
          "TEE defines thrombus and MR, while valve morphology and concomitant disease determine whether surgery is preferable.", 3))
    ],

    "d3-mr": [
      spec("Pathophysiology and Carpentier Classification", "core", "comparison",
        "Primary MR arises from valve pathology, whereas secondary MR arises from ventricular or annular geometry.",
        mapping("The initial mechanism split for mitral regurgitation maps as {{c1::primary → leaflet pathology; secondary → ventricular geometry}}.",
          "This first fork determines whether durable repair or treatment of the ventricle is the central strategy.", 2)),
      spec("Hemodynamics of Chronic MR", "core", "mechanism",
        "A normal total EF in chronic MR can conceal reduced forward stroke volume.",
        mechanism("In chronic mitral regurgitation, a normal total EF can mask reduced {{c1::forward stroke volume}}.",
          "The LV ejects into both the aorta and the lower-pressure left atrium, so total ejection can look preserved while systemic output falls.")),
      spec("Acute MR: Surgical Emergency", "applied-core", "rescue",
        "Acute severe MR from papillary or chordal failure needs urgent operative correction after brief stabilization.",
        mechanism("Papillary-muscle rupture causing acute severe MR requires {{c1::urgent surgery}} after stabilization.",
          "Afterload reduction and mechanical support can bridge pulmonary edema and shock but cannot repair disrupted tissue.")),
      spec("Severity Criteria and Intervention Thresholds", "core", "number",
        "An EF at or below 60% in severe primary MR represents LV dysfunction and is an intervention trigger.",
        numeric("In severe primary MR, LV dysfunction begins at an EF of {{c1::≤60%}}.",
          "The apparently high cutoff reflects the low-impedance regurgitant outlet; LVESD and repair feasibility also matter.",
          { comparator: "at most", value: 60, unit: "%", condition: "LVEF in severe primary MR", precision: "institution-dependent" })),
      spec("Repair vs. Replacement and Hemodynamic Goals", "core", "comparison",
        "Durable mitral repair is preferred to replacement for suitable primary MR anatomy.",
        atomic("When durable anatomy permits, primary MR is treated preferentially by mitral {{c1::repair}}.",
          "Repair preserves the subvalvular apparatus and avoids prosthesis-related thrombosis, anticoagulation, and structural degeneration.",
          "fc-d3-mr-repair-1edw8ar")),
      spec("Senior reasoning: the MR loop, the EF illusion, and two different diseases", "applied-core", "mechanism",
        "Eliminating the low-pressure regurgitant outlet raises effective LV afterload and can expose latent dysfunction.",
        mechanism("Correcting severe mitral regurgitation {{c1::raises afterload}} and may unmask LV dysfunction.",
          "A normal preoperative EF therefore does not guarantee normal ventricular function after repair.",
          "fc-d3-mr-raises-afterload-1y74spa")),
      spec("PGY-5 mastery: COAPT vs MITRA-FR — proportionate vs disproportionate MR", "applied-core", "comparison",
        "Selected patients with secondary MR disproportionate to LV dilation may benefit from edge-to-edge repair after optimized therapy.",
        mechanism("After optimized heart-failure therapy, TEER benefit is most plausible in {{c1::disproportionate secondary MR}}.",
          "The framework explains why a severe leak relative to ventricular size behaved differently from MR proportional to advanced cardiomyopathy.")),
      spec("Infective Endocarditis: Classification & Microbiology", "core", "sequence",
        "Endocarditis begins with endothelial injury, sterile thrombus formation, and bacteremic seeding of a vegetation.",
        sequence("The initiating sequence for infective endocarditis is {{c1::endothelial injury; platelet-fibrin thrombus; bacteremic seeding}}.",
          "The resulting vegetation can destroy leaflets, invade the annulus, or embolize.", 3)),
      spec("Diagnosis: Modified Duke Criteria & Echo", "core", "bounded-set",
        "Typical positive blood cultures and imaging evidence of endocardial involvement are the two major diagnostic domains.",
        bounded("The two major Duke diagnostic domains are {{c1::typical positive cultures; imaging endocardial involvement}}.",
          "TEE is more sensitive than TTE for vegetations and perivalvular complications, especially with prosthetic material.", 2)),
      spec("Antibiotic Therapy", "applied-core", "sequence",
        "Endocarditis therapy proceeds from cultures to empiric bactericidal treatment and then organism-directed therapy.",
        sequence("Suspected endocarditis treatment proceeds as {{c1::draw blood cultures; begin bactericidal therapy; tailor to organism}}.",
          "Device involvement, resistance, allergy, renal function, and surgical source control determine the final regimen.", 3)),
      spec("Senior decision: when to operate on active endocarditis, and how urgently", "applied-core", "bounded-set",
        "Heart failure, uncontrolled infection, and embolism prevention are the three families of surgical indications in active endocarditis.",
        bounded("Active-endocarditis surgery has three indication families: {{c1::heart failure; uncontrolled infection; embolism prevention}}.",
          "Urgency depends on hemodynamic collapse, invasive infection, persistent bacteremia, organism, vegetation behavior, and neurologic complications.", 3))
    ],

    "d3-tr": [
      spec("Tricuspid Regurgitation: Pathophysiology", "core", "mechanism",
        "Most surgical TR is functional, caused by RV and annular dilation despite structurally normal leaflets.",
        mechanism("Most tricuspid regurgitation in surgical patients is {{c1::functional}} rather than primary leaflet disease.",
          "RV enlargement dilates the anterior and posterior annulus and tethers otherwise normal leaflets.",
          "fc-d3-tr-functional-1e6vu3c")),
      spec("Hemodynamic Consequences and Clinical Features of TR", "core", "bounded-set",
        "Severe TR produces systolic venous signs and systemic congestion.",
        bounded("Three bedside signs that support severe TR are {{c1::prominent JVP v waves; pulsatile liver; inspiratory murmur augmentation}}.",
          "Each reflects systolic regurgitant flow into the right atrium and systemic veins.", 3)),
      spec("Tricuspid Stenosis", "core", "number",
        "A mean tricuspid gradient above 5 mmHg supports severe tricuspid stenosis.",
        numeric("Severe tricuspid stenosis includes a mean gradient of {{c1::more than 5 mmHg}}.",
          "Because right-sided pressures are low, a modest gradient can produce major systemic venous congestion.",
          { comparator: "greater than", value: 5, unit: "mmHg", condition: "mean gradient across the tricuspid valve", precision: "institution-dependent" })),
      spec("Pulmonary Valve Disease", "core", "comparison",
        "Pulmonary stenosis pressure-loads the RV, whereas pulmonary regurgitation volume-loads it.",
        mapping("The primary RV loading effects of pulmonary-valve lesions map as {{c1::stenosis → RV pressure overload; regurgitation → RV volume overload}}.",
          "Adult PS is usually congenital, while chronic PR commonly follows repaired tetralogy of Fallot.", 2)),
      spec("Right Heart Failure: The Shared Endpoint", "applied-core", "bounded-set",
        "Perioperative RV failure management balances preload, pulmonary afterload, systemic pressure, and contractility.",
        bounded("The initial four-domain response to perioperative RV failure addresses {{c1::optimized preload; reduced pulmonary resistance; maintained systemic pressure; supported contractility}}.",
          "The thin-walled RV is highly afterload-sensitive and depends on systemic pressure for coronary perfusion.", 4)),
      spec("Senior reasoning: functional TR and the ring at the time of left-sided surgery", "applied-core", "number",
        "A tricuspid annular diameter at or above 40 mm supports concomitant ring repair during left-sided surgery even with lesser TR.",
        numeric("During left-sided valve surgery, a tricuspid annulus of {{c1::≥40 mm}} supports concomitant ring repair.",
          "An already dilated annulus often continues to enlarge after the left-sided lesion is corrected, making late isolated reoperation hazardous.",
          { comparator: "at least", value: 40, unit: "mm", condition: "tricuspid annular diameter during left-sided valve surgery", precision: "institution-dependent" }))
    ],
    "d4-echo": [
      spec("ECG in Cardiac Surgery: The Systematic Approach", "core", "bounded-set",
        "A surgical ECG is read systematically through rate, rhythm, axis, intervals, and waveform or ST-T morphology.",
        bounded("A systematic perioperative ECG read covers {{c1::rate; rhythm; axis; intervals; P-QRS-ST-T morphology}}.",
          "The fixed sequence prevents an obvious rhythm from distracting the reader from conduction, ischemia, or chamber clues.", 5)),
      spec("MI Localization and Post-Surgery ECG Changes", "applied-core", "mechanism",
        "Posterior infarction produces reciprocal anterior changes and should be confirmed with posterior leads.",
        mechanism("Posterior myocardial infarction appears anteriorly as {{c1::ST depression with tall R waves}} in V1-V2.",
          "Posterior leads V7-V9 reveal the corresponding ST elevation and help separate infarction from expected postoperative change.")),
      spec("TTE: Standard Windows and Key Parameters", "core", "bounded-set",
        "The four standard TTE window families are parasternal, apical, subcostal, and suprasternal.",
        bounded("The standard TTE window families are {{c1::parasternal; apical; subcostal; suprasternal}}.",
          "Each window offers complementary chamber, valve, great-vessel, pericardial, and Doppler information.", 4)),
      spec("Interpreting Key Echo Parameters", "core", "formula",
        "LV ejection fraction is stroke volume divided by end-diastolic volume.",
        formula("LV ejection fraction is calculated as {{c1::(EDV - ESV) / EDV}}.",
          "EF must be interpreted with image quality, loading conditions, chamber geometry, and regional wall motion.")),
      spec("Diastolic Function Assessment", "core", "mechanism",
        "The E/e-prime relationship is used as an estimate of LV filling pressure.",
        mechanism("In diastolic assessment, an elevated E/e-prime ratio suggests elevated {{c1::LV filling pressure}}.",
          "Transmitral inflow, tissue Doppler, atrial size, TR velocity, and clinical context must be integrated rather than read in isolation.")),
      spec("TEE: The Intraoperative Standard", "core", "definition",
        "The midesophageal four-chamber view surveys all chambers and both atrioventricular valves.",
        atomic("The intraoperative TEE view that surveys all chambers plus mitral and tricuspid valves is the {{c1::midesophageal 4-chamber}}.",
          "A complete examination then adds multiplane valve, great-vessel, and transgastric ventricular views.",
          "fc-d4-echo-midesophageal-4-chamber-1povzjn")),
      spec("Critical Post-Bypass TEE Checklist", "applied-core", "bounded-set",
        "Post-bypass TEE must reassess ventricular function, ischemia, the repair or prosthesis, de-airing, and aortic or pericardial complications.",
        bounded("The critical post-bypass TEE domains are {{c1::biventricular function; regional ischemia; repair/prosthesis result; de-airing; aorta/pericardium}}.",
          "A structured pass prevents a technically important finding from being missed before decannulation and closure.", 5)),
      spec("Senior reasoning: the intraoperative TEE as a structured checklist", "applied-core", "mechanism",
        "Post-bypass TEE findings must be interpreted under known preload, afterload, rhythm, and inotropic conditions.",
        mechanism("Before judging a post-bypass repair, TEE interpretation must account for {{c1::loading conditions}}.",
          "Residual regurgitation, gradients, and systolic anterior motion can change substantially with preload, afterload, rhythm, and inotropes.")),
      spec("PGY-5 mastery: the post-bypass finding that sends you back on pump", "applied-core", "rescue",
        "A significant structural residual lesion after repair or prosthesis implantation requires correction before leaving the operating room.",
        mechanism("After mitral repair, {{c1::significant residual MR}} is a structural reason to return to bypass.",
          "First distinguish a fixed repair failure from load-dependent SAM, which may resolve with volume, afterload, rate control, and less inotropy.",
          "fc-d4-echo-significant-residual-mr-15jdtlp"))
    ],

    "d4-cath": [
      spec("What the Cath Report Tells the Surgeon", "core", "bounded-set",
        "A surgical cath summary must identify coronary anatomy, lesion severity, flow, distal targets, and ventricular or hemodynamic context.",
        bounded("A surgeon-ready cath summary includes {{c1::anatomy/dominance; lesion severity; TIMI flow; distal targets; ventricular/hemodynamic context}}.",
          "The summary should state what changes the operation rather than merely repeating every angiographic observation.", 5)),
      spec("Interpreting Stenosis Severity and Planning Bypass", "core", "number",
        "A left-main diameter stenosis at or above 50% is treated as prognostically significant in the lesson.",
        numeric("The lesson's angiographic threshold for significant left-main stenosis is {{c1::≥50%}} diameter narrowing.",
          "Ambiguous left-main disease should be confirmed with orthogonal views and objective intravascular or physiologic assessment.",
          { comparator: "at least", value: 50, unit: "% diameter stenosis", condition: "angiographic left-main assessment", precision: "institution-dependent" })),
      spec("Reading Left Main and Multivessel Disease", "applied-core", "comparison",
        "Complex multivessel CAD with diabetes often favors CABG because surgical grafts bypass diffuse proximal disease.",
        atomic("For complex multivessel CAD with diabetes, revascularization often favors {{c1::CABG}} over PCI.",
          "The Heart Team must still integrate anatomy, operative risk, conduit options, ventricular function, and patient preference.")),
      spec("Right Heart Catheterization: Hemodynamic Data", "core", "formula",
        "Pulmonary vascular resistance is the transpulmonary gradient divided by cardiac output.",
        formula("Pulmonary vascular resistance is calculated as {{c1::(mPAP - PCWP) / CO}}.",
          "Interpret the result with waveform quality, respiratory phase, cardiac output method, and the units used.")),
      spec("Senior reasoning: describing a lesion completely, and grading the ambiguous one", "applied-core", "number",
        "An FFR at or below 0.80 supports physiologic significance of an intermediate coronary lesion.",
        numeric("An intermediate coronary lesion is physiologically significant at FFR {{c1::≤0.80}}.",
          "Pressure-wire physiology answers a different question from visual diameter stenosis and is especially useful for discordant intermediate lesions.",
          { comparator: "at most", value: 0.80, unit: "dimensionless", condition: "FFR during maximal hyperemia", precision: "institution-dependent" })),
      spec("PGY-5 mastery: don't commit on a foreshortened left main, and drive discordance to a test", "applied-core", "bounded-set",
        "An ambiguous left main should be adjudicated with intravascular imaging or pressure-wire physiology rather than a single foreshortened view.",
        bounded("Objective adjudication of an ambiguous left main uses {{c1::intravascular imaging; pressure-wire physiology}}.",
          "The high consequence of over- or under-calling left-main disease justifies an objective resolver.", 2)),
      support("Continue in the angiography reading room", "definition",
        "The angiography reading room is a linked practice environment for projection, branch, lesion, flow, and target interpretation.",
        "This chunk is navigation to an existing interactive drill rather than a new factual retrieval objective.")
    ],

    "d4-ct": [
      spec("Cardiac CT: Pre-TAVR Workup", "core", "bounded-set",
        "Pre-TAVR CT defines annular dimensions, coronary heights, root geometry, calcium distribution, and vascular access.",
        bounded("A pre-TAVR CT must define {{c1::annular dimensions; coronary heights; root geometry; calcium distribution; vascular access}}.",
          "These measurements select valve size, predict obstruction or rupture, and determine whether transfemoral delivery is feasible.", 5)),
      spec("CT for Aortic Disease and Calcium Scoring", "core", "comparison",
        "Stanford type A includes the ascending aorta, whereas type B is confined distal to the left subclavian artery.",
        mapping("Stanford dissection types map as {{c1::type A → ascending involved; type B → descending only}}.",
          "The classification is determined by aortic segments involved, not simply by the tear's point of origin.", 2)),
      spec("Cardiac MRI: Viability and Tissue Characterization", "core", "definition",
        "Late gadolinium enhancement identifies myocardial scar and its distribution.",
        atomic("Cardiac MRI identifies myocardial scar with {{c1::late gadolinium enhancement (LGE)}}.",
          "Scar pattern and transmural extent help distinguish ischemic from nonischemic injury and estimate viability.",
          "fc-d4-ct-late-gadolinium-enhancement-lge-0te4393")),
      spec("Chest Radiography in Cardiac Surgery", "core", "bounded-set",
        "A postoperative chest radiograph requires a technical check and systematic review of devices, lungs, pleura, mediastinum, and cardiac silhouette.",
        bounded("A postoperative CXR review covers {{c1::technical quality; lines/tubes; lungs/pleura; mediastinum; cardiac silhouette}}.",
          "A fixed sequence detects malposition, collapse, edema, effusion, pneumothorax, bleeding, and interval change.", 5)),
      spec("Integrating Imaging Modalities: The Cardiac Surgeon's Approach", "core", "comparison",
        "TTE, TEE, CT, and CMR answer complementary hemodynamic, anatomic, and tissue questions.",
        mapping("The four complementary strengths of major cardiac-imaging modalities map as {{c1::TTE → valve hemodynamics; TEE → intraoperative detail; CT → aorta/calcification; CMR → tissue/volumes}}.",
          "Choose the modality that resolves the decision rather than ordering every test indiscriminately.", 4)),
      spec("Senior reasoning: the measurement-error catalog every number carries", "applied-core", "bounded-set",
        "Doppler alignment, LVOT measurement, low flow, and pressure recovery are recurring causes of misleading valve measurements.",
        bounded("Four common valve-measurement traps are {{c1::Doppler misalignment; LVOT diameter error; low flow; pressure recovery}}.",
          "Every discordant number should be paired with its likely error direction and an independent resolver.", 4)),
      spec("PGY-5 mastery: adjudicating the discordant valve with the calcium score", "applied-core", "comparison",
        "Discordant low-gradient AS is resolved with dobutamine when EF is reduced and CT calcium scoring when flow testing is unhelpful or EF is preserved.",
        mapping("For low-gradient aortic stenosis, objective discordance resolvers map as {{c1::reduced EF → dobutamine echo; preserved EF → CT calcium}}.",
          "The stress study tests valve opening with restored flow, while calcium scoring provides a flow-independent anatomic measure.", 2))
    ],
    "d5-risk": [
      spec("Why Risk Stratification Matters", "core", "model",
        "Risk adjustment makes outcomes comparable and turns a population estimate into structured shared decision support.",
        mechanism("Comparing surgical outcomes fairly requires {{c1::risk adjustment}} for baseline patient complexity.",
          "The estimate supports consent, quality improvement, and strategy selection but does not measure benefit or patient goals.")),
      spec("STS Predicted Risk Score", "core", "bounded-set",
        "The STS model reports operative mortality and major morbidity outcomes rather than mortality alone.",
        bounded("Standard STS outcome estimates include {{c1::operative mortality; stroke; renal failure; prolonged ventilation; reoperation}}.",
          "The model combines patient, disease, and procedure variables and must be recalculated for the operation actually proposed.", 5)),
      spec("EuroSCORE II", "core", "definition",
        "EuroSCORE II is the recalibrated European cardiac-surgical risk model.",
        atomic("The recalibrated European operative-risk model is {{c1::EuroSCORE II}}.",
          "Calibration varies by population, era, and procedure mix, so local performance matters.",
          "fc-d5-risk-euroscore-ii-1cjvfb2")),
      spec("Limitations of Risk Models", "core", "mechanism",
        "Common surgical risk models incompletely capture frailty, hostile anatomy, cognition, and social or functional reserve.",
        mechanism("STS and EuroSCORE may understate risk because they poorly capture {{c1::frailty}}.",
          "A model can be statistically valid yet miss decisive individual hazards outside its input variables.",
          "fc-d5-risk-frailty-041hz84")),
      spec("Applying Risk Scores in Clinical Practice", "applied-core", "model",
        "Risk scores inform but do not replace multidisciplinary shared decision-making.",
        mechanism("An operative-risk estimate should inform, not replace, {{c1::shared decision-making}}.",
          "The final recommendation integrates expected benefit, alternatives, anatomy, frailty, goals, and local expertise.")),
      spec("Senior reasoning: quantify the risk two ways, then name what the number cannot see", "applied-core", "bounded-set",
        "Senior risk assessment names the modeled estimate and the major unmodeled hazards.",
        bounded("Important unmodeled surgical hazards include {{c1::frailty; porcelain aorta; hostile chest; cognitive/functional reserve}}.",
          "Naming these limitations prevents false precision from a reassuring percentage.", 4)),
      spec("PGY-5 mastery: the low score that lies — porcelain aorta and the hostile chest", "applied-core", "mechanism",
        "Porcelain aorta and hostile re-entry anatomy can make a low mortality score misleading by adding stroke and access hazards.",
        mechanism("A low calculated risk can be misleading when CT reveals a {{c1::porcelain aorta}}.",
          "The score may not represent cannulation, cross-clamp, embolic, or redo-entry hazards that change the operation.")),
      spec("Anaesthetic Preoperative Assessment: ASA & Airway", "core", "bounded-set",
        "Preoperative airway assessment should document mouth opening, Mallampati class, neck mobility, thyromental distance, and dentition.",
        bounded("A focused preoperative airway exam includes {{c1::mouth opening; Mallampati class; neck mobility; thyromental distance; dentition}}.",
          "The ASA class summarizes systemic illness but does not replace a specific airway and cardiopulmonary plan.", 5))
    ],

    "d5-optimize": [
      spec("The Goal of Preoperative Optimization", "core", "bounded-set",
        "Preoperative optimization targets reversible hematologic, metabolic, renal, nutritional, and functional risks.",
        bounded("Major reversible preoperative targets include {{c1::anemia; glycemic control; renal insults; malnutrition; deconditioning/smoking}}.",
          "Optimization should change a measurable risk before an elective operation rather than become an indefinite delay.", 5)),
      spec("Aspirin and P2Y12 Inhibitors", "applied-core", "number",
        "The lesson uses a five-day preoperative interruption for clopidogrel before elective cardiac surgery.",
        numeric("Before elective cardiac surgery, the lesson's clopidogrel hold is {{c1::5 days}}.",
          "Urgency, stent age, ischemic indication, platelet testing, and local protocol can change the plan; aspirin is often continued.",
          { comparator: "equal to", value: 5, unit: "days", condition: "elective cardiac surgery after clopidogrel", precision: "institution-dependent" })),
      spec("Anticoagulation Management: Warfarin", "applied-core", "mechanism",
        "Perioperative warfarin bridging is determined by thrombotic risk rather than anticoagulant use alone.",
        mechanism("The decision to bridge interrupted warfarin is governed by underlying {{c1::thrombotic risk}}.",
          "High-risk mechanical valves or recent embolic events differ from lower-risk indications in which bridging may add bleeding without benefit.")),
      spec("Anticoagulation Management: DOACs and Heparin", "applied-core", "mechanism",
        "Renal impairment most strongly prolongs preoperative interruption of dabigatran because renal clearance dominates its elimination.",
        mechanism("Renal impairment most prolongs preoperative interruption for {{c1::dabigatran}}.",
          "The exact hold depends on renal function, bleeding risk, urgency, and the local reversal strategy.",
          "fc-d5-optimize-dabigatran-0nvu6kd")),
      spec("Heparin-Induced Thrombocytopenia (HIT)", "applied-core", "mechanism",
        "Immune HIT is an antibody-mediated prothrombotic reaction to heparin-PF4 complexes.",
        mechanism("Immune HIT is driven by IgG against the {{c1::heparin-PF4 complex}}.",
          "Use clinical timing and the 4Ts assessment to guide testing, stop heparin, and begin an appropriate non-heparin anticoagulant when indicated.",
          "fc-d5-optimize-heparin-pf4-complex-1igrik0")),
      spec("Endocarditis Pre-operative Workup", "applied-core", "number",
        "At least three blood-culture sets should be collected before antibiotics in stable suspected endocarditis.",
        numeric("Before antibiotics in stable suspected endocarditis, obtain at least {{c1::3 culture sets}}.",
          "The broader workup defines valve destruction, abscess, embolic complications, coronary disease, dental source, nutrition, and neurologic timing.",
          { comparator: "at least", value: 3, unit: "blood-culture sets", condition: "stable suspected infective endocarditis before antibiotics", precision: "institution-dependent" })),
      spec("High-Risk Surgical Markers to Identify", "applied-core", "bounded-set",
        "Severe pulmonary hypertension, carotid disease, COPD, renal dysfunction, and prior mediastinal radiation are major surgical-planning hazards.",
        bounded("Five high-risk preoperative markers are {{c1::pulmonary hypertension; carotid disease; severe COPD; renal dysfunction; mediastinal radiation}}.",
          "Each marker changes counseling, preparation, access, organ-protection, or postoperative planning beyond the headline risk score.", 5))
    ],

    "d5-heartteam": [
      spec("Frailty: The Variable Risk Models Miss", "core", "bounded-set",
        "The Fried frailty phenotype comprises slowness, weakness, low activity, exhaustion, and unintentional weight loss.",
        bounded("The Fried frailty phenotype includes {{c1::slowness; weakness; low activity; exhaustion; weight loss}}.",
          "Frailty measures physiologic reserve independently of age and adds prognostic information beyond a surgical risk score.", 5)),
      spec("Frailty Assessment Tools", "core", "comparison",
        "The Essential Frailty Toolset is validated for TAVR, while the Clinical Frailty Scale is commonly used in general cardiac surgery.",
        mapping("Common objective frailty tools by cardiac-surgery setting map as {{c1::TAVR → Essential Frailty Toolset; general surgery → Clinical Frailty Scale}}.",
          "Gait speed, grip strength, cognition, hemoglobin, albumin, and functional dependence provide complementary objective data.", 2)),
      spec("The Heart Team Concept", "core", "bounded-set",
        "A comprehensive Heart Team combines procedural, anesthetic, imaging, geriatric, and goal-of-care perspectives.",
        bounded("A comprehensive Heart Team includes {{c1::cardiac surgery; interventional cardiology; cardiac anesthesia; imaging; geriatrics/palliative care}}.",
          "Membership expands to match the decision, while the patient and support system remain central participants.", 5)),
      spec("Informed Consent in Cardiac Surgery", "core", "bounded-set",
        "Cardiac-surgical consent addresses the procedure, expected benefit, material risks, alternatives, and recovery or long-term consequences.",
        bounded("A complete cardiac-surgery consent covers {{c1::proposed procedure; expected benefits; material risks; alternatives; recovery/long-term tradeoffs}}.",
          "Consent is a shared decision process, not merely a signed form, and must include functional outcomes important to the patient.", 5)),
      spec("Senior reasoning: the frailty-and-futility read that redirects a borderline patient", "applied-core", "bounded-set",
        "Objective frailty assessment combines gait, nutrition, daily function, and cognition to redirect borderline treatment choices.",
        bounded("A senior preoperative frailty screen samples four objective domains: {{c1::gait speed; nutrition/weight loss; ADL dependence; cognition}}.",
          "Severe measured frailty can redirect an open operation toward transcatheter therapy, rehabilitation, or goal-concordant palliation.", 4)),
      spec("PGY-5 mastery: the mechanical-versus-tissue conversation, and when the right operation is none", "applied-core", "comparison",
        "Mechanical and tissue prostheses trade durability and anticoagulation against structural degeneration and reintervention.",
        mapping("The two prosthesis families and their central tradeoffs map as {{c1::mechanical → durability/warfarin; tissue → less anticoagulation/reintervention}}.",
          "Age provides context, but values, bleeding risk, pregnancy plans, adherence, anatomy, life expectancy, and future valve-in-valve options drive the choice.", 2)),
      spec("Evidence & Biostatistics for the Cardiac Surgeon", "core", "evidence",
        "Sensitivity protects against false negatives, while specificity protects against false positives.",
        mapping("Diagnostic-test characteristics and their bedside interpretations map as {{c1::sensitivity → rules out when negative; specificity → rules in when positive}}.",
          "Pretest probability and likelihood ratios still determine how much either result changes the probability of disease.", 2)),
      spec("Equity of Care and Shared Decision-Making", "core", "evidence",
        "Revascularization decisions should follow clinical indication and patient goals rather than sex, race, or ethnicity.",
        mechanism("Equitable revascularization decisions are based on {{c1::clinical indication}} rather than sex, race, or ethnicity.",
          "Shared decisions must also account for health literacy, cultural beliefs, social determinants, support, and sufficient time for consent.")),
      spec("Risk Prediction: STS Score and the Limits of SYNTAX", "core", "comparison",
        "STS estimates patient-level operative risk, whereas SYNTAX characterizes coronary anatomic complexity.",
        mapping("The major preoperative risk scores answer different questions: {{c1::STS → operative clinical risk; SYNTAX → anatomic complexity}}.",
          "Neither score replaces Heart Team judgment when anatomy, comorbidity, feasibility, and patient goals conflict.", 2)),
      spec("Special Populations (1): CKD, Older Adults, and Noncardiac Surgery", "applied-core", "rescue",
        "Stable non-left-main CAD should not be revascularized solely to reduce events before noncardiac surgery.",
        mechanism("Prophylactic coronary revascularization solely to clear noncardiac surgery is {{c1::not recommended}}.",
          "Treat the coronary indication on its own merits while minimizing renal injury and integrating cognition, life expectancy, and patient preference.")),
      spec("Special Populations (2): Arrhythmia, SCAD, Pregnancy, and Cardiac Allograft", "applied-core", "rescue",
        "SCAD is generally managed conservatively unless instability or ongoing ischemia demands revascularization.",
        mechanism("Without instability or ongoing ischemia, spontaneous coronary dissection favors {{c1::conservative management}}.",
          "Routine instrumentation can extend the fragile dissection; revascularization is reserved for selected high-risk presentations."))
    ]
  };

  function registerLesson(lessonId, authoredSpecs) {
    const lesson = window.LESSONS && window.LESSONS[lessonId];
    if (!lesson || !Array.isArray(lesson.chunks)) throw new Error("Missing authored lesson " + lessonId);
    const byTitle = new Map(authoredSpecs.map(item => [item.title, item]));
    const claims = [];
    const cards = [];

    lesson.chunks.forEach((chunk, chunkIndex) => {
      if (!chunk || chunk.type === "checkpoint") return;
      const partId = safeId(chunk.title || chunk.q || "chunk-" + (chunkIndex + 1));
      chunk.partId = partId;
      const sourceRef = { type: "lesson", id: lessonId, partId };
      let authored = byTitle.get(chunk.title);
      if (!authored) throw new Error(lessonId + " has no authored claim for teaching chunk " + partId);
      byTitle.delete(chunk.title);

      const claimId = lessonId + "." + partId;
      let cardRecord = null;
      if (authored.card) {
        const raw = authored.card;
        const cardId = raw.legacyId || opaqueId(claimId);
        cardRecord = {
          schemaVersion: 2,
          id: cardId,
          claimIds: [claimId],
          archetype: raw.archetype,
          tier: authored.tier,
          category: authored.category,
          cloze: raw.cloze,
          explanation: raw.explanation,
          source: sourceRef,
          sourceRefs: [sourceRef]
        };
        if (raw.legacyId) cardRecord.identityDisposition = "equivalent-rewrite";
        if (raw.answerCount != null) cardRecord.answerCount = raw.answerCount;
        if (raw.ordered != null) cardRecord.ordered = raw.ordered;
        if (raw.numeric) {
          cardRecord.numeric = raw.numeric;
          cardRecord.citation = sourceRef;
          cardRecord.reviewedAt = null;
          cardRecord.reviewBy = null;
        }
        cards.push(cardRecord);
      }

      const claimRecord = {
        claimId,
        sourceRefs: [sourceRef],
        tier: authored.tier,
        category: authored.category,
        statement: authored.statement,
        required: authored.tier !== "enrichment",
        cardIds: cardRecord ? [cardRecord.id] : [],
        disposition: cardRecord ? "carded" : "supporting-context",
        rationale: authored.rationale,
        reviewer: REVIEWER,
        reviewedAt: REVIEWED_AT
      };
      if (rawNumeric(authored.card)) claimRecord.numeric = authored.card.numeric;
      claims.push(claimRecord);
    });

    if (byTitle.size) throw new Error(lessonId + " specs do not resolve: " + Array.from(byTitle.keys()).join(", "));
    window.FlashcardSchema.registerPack({
      source: { type: "lesson", id: lessonId },
      claims,
      cards,
      rebuild: true,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      reviewBy: REVIEW_BY,
      citation: { type: "lesson", id: lessonId }
    });
  }

  function rawNumeric(card) {
    return !!(card && card.numeric);
  }

  Object.keys(PACKS).forEach(lessonId => registerLesson(lessonId, PACKS[lessonId]));
})();
