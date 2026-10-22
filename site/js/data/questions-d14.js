window.QUESTIONS = window.QUESTIONS || [];
(() => {
  /*
   * Every item is authored with the correct option first. The frozen permutations below were
   * generated with a cryptographic shuffle, then checked for a 9/9/8/9 A/B/C/D split, a maximum
   * run of two, and all 16 ordered transitions. Freezing them keeps question review and saved
   * attempts stable; the 75-question mock applies a fresh constrained random permutation per run.
   */
  const PERMUTATIONS = [
    [0,1,2,3], [3,2,0,1], [3,2,1,0], [3,2,1,0], [0,1,3,2],
    [3,0,2,1], [1,2,0,3], [2,1,0,3], [0,2,3,1], [2,0,1,3],
    [1,0,3,2], [0,3,2,1], [3,0,2,1], [3,2,1,0], [2,1,3,0],
    [2,1,0,3], [0,1,2,3], [3,2,1,0], [3,0,1,2], [3,2,0,1],
    [0,1,3,2], [0,3,1,2], [3,0,1,2], [3,0,2,1], [0,3,1,2],
    [3,1,0,2], [1,0,3,2], [2,3,0,1], [1,2,3,0], [2,0,1,3],
    [2,3,1,0], [2,1,0,3], [0,1,2,3], [3,1,2,0], [3,2,1,0]
  ];

  const ITEMS = [
    {
      lesson: "d1-coronaries", topic: "Anatomy", kind: "operative-step", level: 5,
      stem: "A 68-year-old patient requires redo aortic valve surgery nine years after CABG. CT shows a patent in-situ LITA-to-LAD graft lying 2 mm behind the left upper hemisternum with no safe dissection plane. Which re-entry plan best preserves a rescue route?",
      options: [
        "Establish peripheral CPB before a CT-guided controlled re-entry because no safe graft-sternum plane exists",
        "Perform a routine oscillating-saw sternotomy first, then obtain central access only if major bleeding occurs",
        "Dissect and clamp the graft blindly through the upper sternotomy before establishing any bypass access",
        "Occlude the graft percutaneously and rely on native LAD flow throughout the valve replacement"
      ],
      explain: "The mapped graft-to-sternum relationship creates simultaneous risks of exsanguination and anterior myocardial ischemia. Prepared peripheral access—and, when the graft or right ventricle is inseparable from the sternum, CPB before re-entry—preserves a rescue route while the sternum is opened under direct control. The exact cannulation site follows aortic and peripheral anatomy. Routine re-entry without rescue access and intentional sacrifice of a functioning LITA both remove critical safety margins."
    },
    {
      lesson: "d1-conduction", topic: "Anatomy", kind: "complication-rescue", level: 5,
      stem: "A patient with normal preoperative conduction develops complete AV block immediately when a tricuspid annuloplasty ring is tied. Temperature, electrolytes, de-airing, and ventricular function are satisfactory. What is the most appropriate operative response?",
      options: [
        "Temporarily pace, then release and re-site deep septal sutures near the triangle of Koch",
        "Complete protamine reversal and observe for recovery before examining the annuloplasty sutures",
        "Increase catecholamines and accept ventricular pacing without checking for a mechanical cause",
        "Revise the anterior free-wall annulus because the AV node lies closest to that ring segment"
      ],
      explain: "The immediate relation to ring tying makes direct conduction-system injury or compression by a deep septal suture the reversible diagnosis to address first. The AV node and penetrating His bundle lie beside the septal annulus in and beyond the triangle of Koch. Temporary pacing protects output while suspect sutures are released and re-sited. Waiting until after protamine may convert a correctable intraoperative problem into permanent block."
    },
    {
      lesson: "d2-o2", topic: "Coronary", kind: "quantitative", level: 4,
      stem: "Thirty minutes after CABG, a patient develops atrial fibrillation at 150/min, MAP 54 mm Hg, hemoglobin 68 g/L, diffuse ST depression, and SvO₂ 47%. TEE shows a small hyperdynamic LV without a new regional wall-motion abnormality; graft flows were satisfactory at closure. Which immediate strategy best addresses the leading mechanism while preserving surveillance for graft failure?",
      options: [
        "Support diastolic pressure, cardiovert unstable AF, transfuse red cells, then repeat ECG, TEE, and graft assessment",
        "Return directly to bypass for empiric revision of every graft before correcting rate, pressure, or oxygen content",
        "Escalate inotropy to raise cardiac index even if tachycardia and myocardial oxygen demand increase",
        "Begin nitrate vasodilation to reduce wall stress despite the already low diastolic coronary pressure"
      ],
      quant: {
        number: "Heart rate 150/min, MAP 54 mm Hg, hemoglobin 68 g/L, and SvO2 47%",
        condition: "Post-CABG diffuse ischemia without a territorial wall-motion abnormality",
        exception: "A new territorial abnormality or persistently poor graft evidence would accelerate invasive graft assessment",
        resolver: "Correct supply-demand determinants and repeat ECG, TEE, and graft-specific assessment",
        value: "150; 54; 68; 47",
        unit: "beats/min; mm Hg; g/L; percent",
        context: "Post-CABG diffuse supply-demand ischemia without a territorial wall-motion abnormality",
        consequence: "Correct rhythm, coronary pressure, and oxygen content, then repeat graft-specific assessment"
      },
      explain: "The signals converge on inadequate myocardial oxygen supply relative to demand: anemia lowers arterial oxygen content, rapid AF raises demand and shortens diastole, and hypotension reduces coronary perfusion. The absence of a territorial wall-motion change makes immediate empiric revision less compelling, but does not eliminate graft failure. Correct the reversible supply-demand crisis promptly, then use serial ECG, TEE, and graft evidence to decide on angiography or re-exploration."
    },
    {
      lesson: "d3-as", topic: "Valvular", kind: "complication-rescue", level: 5,
      stem: "During induction for urgent noncardiac surgery, a patient with critical aortic stenosis develops new atrial fibrillation at 165/min, MAP 40 mm Hg, and diffuse subendocardial ST depression. There is no evidence of hemorrhage or anaphylaxis. What is the best immediate response?",
      options: [
        "Synchronize cardioversion and restore diastolic pressure with a vasoconstrictor",
        "Give an amiodarone infusion alone and tolerate MAP 40 mm Hg while awaiting chemical conversion",
        "Administer rapid beta-blockade before supporting arterial pressure to slow ventricular ejection",
        "Escalate inotropy to force more flow across the fixed valve despite the rapid ventricular rate"
      ],
      explain: "Critical AS makes the hypertrophied ventricle dependent on diastolic pressure, filling time, and atrial contribution. This patient is unstable from rapid AF and requires synchronized cardioversion while vasoconstrictor support restores coronary perfusion. A slow drug infusion is too delayed for profound hypotension with ischemia. Unopposed rate slowing before pressure support may worsen collapse, and additional inotropy increases oxygen demand without removing the fixed obstruction."
    },
    {
      lesson: "d4-echo", topic: "Imaging", kind: "complication-rescue", level: 5,
      stem: "After a P2 repair, TEE at representative preload and afterload shows a broad eccentric residual MR jet, a large vena contracta, systolic flow reversal in two pulmonary veins, and a new flail segment beside the resection. LV function is preserved. What is the best next step?",
      options: [
        "Return to CPB, define the failed repair mechanism, and revise it before leaving the OR",
        "Accept the repair because eccentric jets generally overestimate the severity of residual MR",
        "Reverse heparin and repeat transthoracic imaging after the patient reaches the ICU",
        "Insert an IABP to reduce regurgitation without correcting the structural repair failure"
      ],
      explain: "No single Doppler sign is perfect immediately after bypass, so loading should be normalized and multiple parameters reconciled. Here, vena contracta, pulmonary-vein reversal, and a visible flail segment all identify severe structural residual MR. Localize the mechanism and revise the repair while CPB remains available. Protamine and delayed imaging surrender the safest correction window, and afterload reduction cannot repair a flail leaflet."
    },
    {
      lesson: "d5-risk", topic: "Preop", kind: "when-not-to", level: 4,
      stem: "A 66-year-old low-risk patient has symptomatic severe bicuspid aortic stenosis and a 5.8-cm ascending aortic aneurysm. Transfemoral access and annular dimensions are suitable for TAVR, and meaningful life expectancy exceeds ten years. Which Heart-Team recommendation best addresses the complete disease?",
      options: [
        "SAVR with ascending replacement, extending to the root or arch only if their pathology requires it",
        "Transfemoral TAVR followed by staged open ascending replacement after recovery",
        "SAVR with mandatory Bentall and total-arch replacement regardless of root or arch anatomy",
        "SAVR alone with interval CT surveillance of the untreated 5.8-cm ascending aneurysm"
      ],
      explain: "Access suitability is not the whole decision. This patient has a surgical aortic disease process that includes a large ascending aneurysm requiring treatment; isolated TAVR leaves the major aortic hazard untouched. In a low-risk patient with substantial life expectancy, SAVR plus ascending replacement addresses both lesions and supports a durable lifetime strategy. Ascending endografting is not routine definitive therapy here, and balloon valvuloplasty treats neither lesion durably."
    },
    {
      lesson: "d6-indications", topic: "CABG", kind: "evidence", level: 4,
      stem: "A 63-year-old patient with diabetes has diffuse complex three-vessel CAD including proximal LAD disease, LVEF 35%, persistent angina despite guideline-directed therapy, graftable distal targets, and no prohibitive operative risk. PCI could treat several focal segments but would leave substantial residual disease. What is the best revascularization strategy?",
      options: [
        "CABG with LITA-to-LAD and additional grafts directed toward durable complete revascularization",
        "Physiology-guided multivessel PCI, accepting residual diffuse disease to avoid surgical risk",
        "Hybrid LITA-to-LAD plus PCI of every non-LAD target despite diffuse distal anatomy",
        "Guideline-directed therapy alone, reserving revascularization for a future acute coronary syndrome"
      ],
      evidence: {
        population: "Patients with diabetes and complex multivessel coronary disease suitable for either strategy",
        endpoint: "Major cardiovascular events, death, myocardial infarction, and repeat revascularization",
        effect: "CABG generally provides more durable event reduction than PCI when complete surgical revascularization is feasible",
        limitation: "Individual anatomy, conduit and target quality, operative risk, and patient preference still require Heart-Team review",
        source: "FREEDOM trial and contemporary coronary-revascularization guideline synthesis"
      },
      explain: "Diabetes, complex diffuse anatomy, a proximal LAD target, and the inability of PCI to achieve durable complete revascularization favor CABG when operative risk is acceptable. Reduced LVEF increases perioperative risk but is not itself a reason to choose incomplete PCI; it heightens the importance of assessing targets, myocardial substrate, and long-term benefit. Medical therapy remains essential but does not replace indicated revascularization in this symptomatic anatomy."
    },
    {
      lesson: "d7-prosthetics", topic: "ValveSurgery", kind: "operative-step", level: 5,
      stem: "A 63-year-old active patient with severe AS, body surface area 1.9 m², and long life expectancy declines lifelong anticoagulation after informed discussion. At SAVR, the native annulus accepts a 19-mm sizer, and the projected indexed effective orifice area of the proposed tissue valve predicts severe patient-prosthesis mismatch. Which plan is most appropriate?",
      options: [
        "Choose a higher-EOA tissue strategy and enlarge the annulus or root if needed to avoid severe mismatch",
        "Implant the 19-mm tissue valve without modification because normally moving leaflets exclude mismatch",
        "Implant a mechanical valve despite the informed anticoagulation preference because age alone determines prosthesis type",
        "Abandon surgery for TAVR solely because the surgical annulus is small, without considering coronary or lifetime anatomy"
      ],
      explain: "Prosthesis type and prosthesis size are separate decisions. The informed preference supports a tissue valve, but knowingly accepting severe mismatch risks persistent gradients, limited regression of hypertrophy, and worse functional recovery. Annular or root enlargement, or another hemodynamically suitable surgical strategy, should be considered while preserving future valve-in-valve and coronary-access options. A mechanical valve should not be imposed by age alone."
    },
    {
      lesson: "d8-dissection", topic: "Aortic", kind: "complication-rescue", level: 5,
      stem: "A 59-year-old patient presents with abrupt chest pain. CT shows an acute ascending aortic dissection extending into the arch. The right leg is cool with reduced pulses, but motor and sensory function are intact, lactate is 2.0 mmol/L, and there is no abdominal pain or organ-failure syndrome. What is the best operative priority?",
      options: [
        "Perform emergency proximal repair, then immediately reassess and treat persistent limb ischemia",
        "Perform an isolated femoral bypass first and defer proximal aortic repair until the leg has recovered",
        "Begin anticoagulation and thrombolysis, then repeat imaging after the limb pulse improves",
        "Treat the descending thoracic aorta with TEVAR and leave the ascending lesion untreated"
      ],
      explain: "This is acute type A dissection with limb malperfusion but no established malperfusion syndrome. Emergency proximal repair treats the lethal rupture and tamponade risk and often restores distal true-lumen flow; limb perfusion must be reassessed immediately and treated if it remains compromised. A different sequence may be considered for selected stable patients with advanced mesenteric malperfusion syndrome at expert centres, but that exception is absent here."
    },
    {
      lesson: "d9-ecmo", topic: "MCS", kind: "complication-rescue", level: 5,
      stem: "After mechanical AVR, a patient cannot separate from bypass and is placed on peripheral VA-ECMO. In the ICU the LV enlarges, pulmonary edema worsens, spontaneous echo contrast appears, and the mechanical aortic prosthesis rarely opens despite adequate systemic perfusion. Which unloading strategy is most appropriate?",
      options: [
        "Use a surgical left-atrial or LV vent and reduce ECMO flow to the minimum that maintains perfusion",
        "Insert a transaortic microaxial pump through the mechanical prosthesis to provide active LV unloading",
        "Increase retrograde ECMO flow until arterial pressure is normal regardless of LV size",
        "Expand intravascular volume until the mechanical prosthesis opens on every beat"
      ],
      explain: "Peripheral VA-ECMO raises LV afterload; failure of aortic-valve opening causes distension, pulmonary edema, and stasis. The ventricle needs active unloading while ECMO flow is balanced against systemic perfusion. A transaortic microaxial pump cannot cross a mechanical aortic prosthesis, so a surgical LV or left-atrial vent is the appropriate route here. More retrograde flow or volume worsens the mechanism."
    },
    {
      lesson: "d10-cardioplegia", topic: "CPB", kind: "complication-rescue", level: 5,
      stem: "After cross-clamping for surgery on acute severe aortic regurgitation, antegrade cardioplegia is infused through the aortic root. Root pressure appears adequate, but the LV rapidly distends, electrical activity persists, and myocardial cooling is poor. What should the surgeon do next?",
      options: [
        "Stop root infusion, decompress the LV, and switch to direct ostial or effective retrograde cardioplegia",
        "Increase root cardioplegia pressure until the regurgitant valve closes and the heart arrests",
        "Continue systemic cooling alone because electrical activity does not affect myocardial oxygen use",
        "Defibrillate repeatedly while maintaining the same cardioplegia route and infusion pressure"
      ],
      explain: "Severe AR diverts root-delivered cardioplegia into the LV, producing distension while failing to protect the coronaries adequately. Persisting electrical activity and poor cooling confirm ineffective arrest. Stop the harmful infusion, decompress the LV, and use a route that bypasses the incompetent valve—direct ostial and/or retrograde delivery according to coronary and venous anatomy. Higher root pressure worsens regurgitant volume; defibrillation does not restore protection."
    },
    {
      lesson: "d11-bleeding", topic: "Hemostasis", kind: "complication-rescue", level: 4,
      stem: "After CABG, diffuse microvascular bleeding is 250 mL over 15 minutes. Temperature and pH are corrected, ACT has returned to baseline, EXTEM clotting time is normal, platelet count is 135 × 10⁹/L, EXTEM A5 is 25 mm, and FIBTEM A5 is 4 mm. Which targeted therapy should be given first while the team continues to exclude a surgical source?",
      options: [
        "Give targeted fibrinogen concentrate or cryoprecipitate, then repeat clinical and viscoelastic assessment",
        "Additional protamine because any postoperative bleeding should be treated as residual heparin",
        "Give empiric platelets for low EXTEM clot strength despite the adequate count and isolated FIBTEM deficit",
        "Prothrombin complex concentrate because a normal EXTEM clotting time indicates factor depletion"
      ],
      explain: "A very low FIBTEM A5 identifies inadequate fibrin contribution to clot strength. With heparin reversal, temperature, and pH corrected, targeted fibrinogen replacement is the logical first therapy, followed by clinical and viscoelastic reassessment. Platelets may be needed if the residual EXTEM-minus-FIBTEM contribution is poor, but the demonstrated dominant deficit is fibrin. Persistent focal or high-volume bleeding still requires surgical inspection."
    },
    {
      lesson: "d12-block", topic: "Pacing", kind: "complication-rescue", level: 4,
      stem: "A patient with baseline right bundle-branch block develops new PR prolongation and recurrent complete AV block after TAVR. Potassium, acid-base status, and temperature are normal, and the patient remains intermittently pacing-dependent 24 hours later. What is the most appropriate plan?",
      options: [
        "Maintain temporary pacing and arrange a permanent pacemaker after reversible causes are excluded",
        "Remove pacing access and discharge with routine follow-up because the block is procedure-related",
        "Treat with amiodarone to suppress atrial activity and improve AV nodal conduction",
        "Implant cardiac resynchronization therapy solely because a new conduction abnormality is present"
      ],
      explain: "Baseline RBBB plus new post-TAVR conduction disease signals injury near the His-Purkinje system. Recurrent complete block with ongoing pacing dependence after reversible causes are corrected carries a substantial risk of sudden recurrence and warrants reliable temporary support followed by permanent pacing. Amiodarone may worsen bradyconductive disease. Resynchronization requires specific ventricular-function and electrical criteria."
    },
    {
      lesson: "d13-lcos", topic: "ICU", kind: "complication-rescue", level: 5,
      stem: "On postoperative day 1 after CABG, a patient initially treated for vasoplegia becomes obtunded and anuric. Lactate is 7 mmol/L, CI 1.5 L/min/m², CVP 18 mm Hg, and SVR 2700 dyn·s·cm⁻⁵. TEE now shows severe new anteroseptal hypokinesis and troponin has risen sharply. What is the best next strategy?",
      options: [
        "Support low output and obtain immediate graft imaging if transportable; otherwise return directly for re-exploration",
        "Escalate norepinephrine because the original postoperative diagnosis of vasoplegia should remain fixed",
        "Give repeated fluid boluses until CVP exceeds 22 mm Hg before investigating myocardial ischemia",
        "Observe the troponin trend because biomarker elevation and regional dysfunction are expected after CABG"
      ],
      explain: "The phenotype has changed: low CI, high SVR, organ hypoperfusion, a sharp biomarker rise, and a new territorial wall-motion abnormality now indicate ischemic low-output syndrome, with graft failure until proved otherwise. Resuscitation may include inotropy or mechanical support, but must run in parallel with definitive graft assessment and a rapid path to revision. Treating the old label with more vasoconstrictor increases afterload and delays correction."
    },
    {
      lesson: "d1-valves-anat", topic: "Anatomy", kind: "complication-rescue", level: 5,
      stem: "An elderly patient with a small LV and severe posterior mitral annular calcification undergoes mitral valve replacement. Shortly after separation from CPB, brisk bleeding appears in the posterior atrioventricular groove with rapid hemodynamic collapse. What is the most likely lesion and operative response?",
      options: [
        "Return to CPB, decompress, and perform definitive patch-supported repair of a type I AV-groove rupture",
        "Isolated circumflex coronary occlusion; complete protamine reversal and transfer directly for PCI",
        "Coronary-sinus cannulation injury; pack the groove externally while the beating LV remains loaded",
        "Left-atrial appendage tear; oversew the appendage without returning to bypass or inspecting the annulus"
      ],
      explain: "Posterior AV-groove disruption after MVR is the classic type I LV rupture, especially with a small LV, annular calcification, aggressive decalcification, or deep sutures. The loaded beating heart propagates the tear, so immediate return to CPB and decompression are essential. Internal inspection permits patch-reinforced repair and correction of the annular injury; blind external packing or protamine before control can worsen hemorrhage."
    },
    {
      lesson: "d2-ischemia", topic: "Coronary", kind: "reconcile-discordant", level: 5,
      stem: "Angiography suggests a 55% left-main stenosis. FFR measured from the aorta to the distal LAD is 0.83, but there is severe serial mid-LAD disease and diffuse microvascular dysfunction, both of which may limit hyperemic flow. Before deferring left-main revascularization, what is the best next test?",
      options: [
        "Use left-main IVUS to resolve anatomy independently of the compromised hyperemic response",
        "Defer revascularization because any FFR above 0.80 excludes important left-main disease regardless of downstream anatomy",
        "Repeat the pressure ratio without hyperemia and accept whichever measurement is numerically lower",
        "Proceed to CABG solely because visual estimation calls the lesion 55%, without obtaining clarifying data"
      ],
      explain: "FFR depends on sufficient hyperemic flow. Severe serial downstream disease and microvascular dysfunction can blunt flow and make a left-main gradient appear falsely reassuring. IVUS supplies an anatomic assessment independent of that response and is the appropriate resolver before committing to deferral or revascularization. Neither an isolated visual estimate nor a resting repeat resolves this discordance."
    },
    {
      lesson: "d3-mr", topic: "Valvular", kind: "reconcile-discordant", level: 4,
      stem: "An asymptomatic low-risk patient has severe degenerative MR, LVEF 58%, LVESD 42 mm, normal coronary arteries, and a greater than 95% likelihood of durable repair at an experienced centre. Exercise capacity is self-reported as normal. What is the best recommendation?",
      options: [
        "Proceed with mitral valve repair before further LV remodeling occurs",
        "Continue surveillance until LVEF falls below 50% or overt heart-failure symptoms develop",
        "Choose transcatheter edge-to-edge repair because the absence of symptoms makes surgery inappropriate",
        "Use diuretic and afterload-reduction therapy as definitive treatment for the structural lesion"
      ],
      explain: "In chronic severe MR, the LV ejects partly into the low-impedance left atrium, so an EF of 58% is not reassuringly normal. LVEF at or below 60% and LVESD at or above 40 mm indicate early LV decompensation and support surgery when durable repair is highly likely and risk is low. Waiting for EF below 50% risks irreversible dysfunction; transcatheter repair is not preferred over a highly repairable lesion in a low-risk patient."
    },
    {
      lesson: "d4-ct", topic: "Imaging", kind: "complication-rescue", level: 5,
      stem: "A patient with abrupt chest pain has crescentic hyperattenuating thickening of the ascending aortic wall on the noncontrast CT phase. The contrast phase shows no flowing false lumen and no visible intimal flap, but the abnormality extends from the root into the proximal arch. What is the best interpretation and management?",
      options: [
        "Acute type A intramural hematoma requiring prompt operative repair",
        "Stable aortic atherosclerosis suitable for discharge once pain is controlled",
        "Uncomplicated type B dissection best treated with descending TEVAR alone",
        "Ascending aortic mural thrombus requiring immediate systemic anticoagulation"
      ],
      explain: "Intramural hematoma is an acute aortic syndrome caused by hemorrhage within the wall and may lack a flowing false lumen or visible flap. Involvement of the ascending aorta is managed with the same urgency as other type A syndromes because of progression, rupture, tamponade, and branch complications. The noncontrast phase is decisive because acute blood is hyperattenuating. Anticoagulation or descending-only treatment would expose the patient to catastrophic proximal progression."
    },
    {
      lesson: "d5-optimize", topic: "Preop", kind: "when-not-to", level: 4,
      stem: "A 68-year-old patient with stable coronary symptoms is scheduled for CABG in 18 days. Hemoglobin is 102 g/L, MCV 77 fL, ferritin 42 µg/L, and transferrin saturation 11%. There is no active bleeding or anemia-related instability. What is the most appropriate preoperative plan?",
      options: [
        "Investigate the iron-deficiency source and give IV iron now, then reassess without prophylactic red-cell transfusion",
        "Transfuse two red-cell units immediately to normalize hemoglobin despite the absence of instability or active bleeding",
        "Proceed without iron treatment because bypass transfusion can replace the red-cell deficit at the point of care",
        "Postpone surgery for months of oral iron without reconsidering the coronary risk created by a long delay"
      ],
      explain: "Iron deficiency is a modifiable transfusion risk. With surgery less than three weeks away, IV iron offers a more reliable response than oral therapy while the cause is investigated. Prophylactic red-cell transfusion is not justified in a stable patient, and a long unexamined delay may create coronary risk. Reassess the response and timing rather than treating either the operation or the anemia in isolation."
    },
    {
      lesson: "d6-conduits", topic: "CABG", kind: "operative-step", level: 5,
      stem: "A 61-year-old patient has a 90% proximal LAD lesion, an 85% large OM1 lesion, and a 55% RCA lesion with FFR 0.86. Left-subclavian inflow is normal, radial assessment is satisfactory, and advanced CKD is absent. Which graft plan best balances durability and competitive flow?",
      options: [
        "Use LITA to LAD and radial artery to OM1; do not graft the FFR-negative RCA",
        "Use LITA to LAD and radial artery to the moderate RCA; leave OM1 for medical therapy",
        "Use vein grafts to LAD and OM1, reserving both arterial conduits for future reoperation",
        "Use LITA to LAD and vein grafts to both OM1 and RCA, accepting RCA competitive flow"
      ],
      explain: "LITA-to-LAD is the durability anchor. A radial graft is well suited to the severely stenosed second target, while grafting a physiologically negative RCA risks competitive flow and unnecessary conduit use. The anatomy, conduit assessment, and physiology agree here; if the RCA measurement were unreliable or the lesion progressed, the target decision would need reassessment."
    },
    {
      lesson: "d7-mitral", topic: "ValveSurgery", kind: "complication-rescue", level: 5,
      stem: "During separation from bypass after P2 repair and annuloplasty, blood pressure falls to 68/38 mm Hg. TEE shows a small hyperdynamic LV, anterior leaflet movement into the LVOT, a late-peaking 65-mm Hg gradient, and posteriorly directed MR. What is the best immediate treatment bundle?",
      options: [
        "Restore preload and afterload first, then stop inotropy and add short-acting beta blockade as pressure permits",
        "Increase epinephrine; add nitrates and diuresis to reduce ventricular filling",
        "Insert an IABP; reduce SVR and maintain tachycardia to promote forward flow",
        "Proceed directly to mitral replacement before testing a hemodynamic rescue"
      ],
      explain: "SAM is intensified by underfilling, reduced afterload, and hypercontractility. Restore preload and arterial pressure first, withdraw inotropy, and add short-acting beta blockade only as pressure permits; then reassess the gradient, MR, and perfusion under representative loading. Persistent severe SAM despite optimization warrants return to bypass and repair revision. Immediate replacement before testing reversible physiology may sacrifice a repair unnecessarily."
    },
    {
      lesson: "d8-pericardium", topic: "Aortic", kind: "reconcile-discordant", level: 5,
      stem: "On postoperative day 1 after CABG, a patient develops hypotension, rising CVP, and oliguria. TTE shows no circumferential effusion or RV collapse, but TEE demonstrates a posterior organized clot compressing the left atrium with impaired transmitral filling. What is the best next step?",
      options: [
        "Return urgently for surgical evacuation of the posterior clot",
        "Perform anterior pericardiocentesis and observe the posterior collection",
        "Treat with fluids and vasopressors because absent RV collapse excludes tamponade",
        "Give systemic thrombolysis to dissolve the organized postoperative clot"
      ],
      explain: "Postoperative tamponade may be regional and compress the left atrium without classic right-sided collapse. The physiology and TEE finding override the reassuring but incomplete TTE pattern. An organized posterior clot is unlikely to drain through an anterior needle and requires urgent operative evacuation. Fluids and vasopressors may bridge to control but must not delay it."
    },
    {
      lesson: "d9-iabp", topic: "MCS", kind: "when-not-to", level: 4,
      stem: "A patient with postcardiotomy low output has moderate-to-severe aortic regurgitation on TEE. The team considers an intra-aortic balloon pump. Which mechanism makes this device inappropriate?",
      options: [
        "Diastolic inflation increases the aorta-to-LV gradient and regurgitant volume",
        "Systolic deflation increases LV afterload and impairs ejection across the aortic valve",
        "Balloon inflation diverts systemic venous return away from the right atrium and lungs",
        "Counterpulsation directly drains blood from the LV and worsens systolic underfilling"
      ],
      explain: "IABP inflation raises aortic pressure during diastole. With an incompetent aortic valve, that increases the reverse pressure gradient, regurgitant volume, and LV loading rather than unloading the ventricle. The support choice must instead match the shock phenotype and valve anatomy. Systolic deflation normally reduces afterload; the balloon neither diverts venous return nor directly drains the LV."
    },
    {
      lesson: "d10-weaning", topic: "CPB", kind: "operative-step", level: 5,
      stem: "During attempted separation from CPB after AVR, the well-filled LV becomes globally hypokinetic without a regional wall-motion abnormality. Core temperature is 34.2°C, potassium 6.2 mmol/L, and arterial pH 7.19. What should the team do first?",
      options: [
        "Resume full CPB, complete rewarming, correct potassium and pH, then reassess",
        "Continue separation and increase epinephrine until the ventricle begins to eject",
        "Give protamine during partial bypass to reverse heparin-related vasodilation",
        "Re-cross-clamp immediately because global hypokinesis proves failed cardioplegia"
      ],
      explain: "Hypothermia, hyperkalemia, and acidosis are major reversible impediments to contractility and rhythm. Restore full support while correcting them before judging myocardial recovery or escalating to mechanical rescue. Inotropy during a metabolically hostile separation increases demand without correcting the cause. Re-cross-clamping becomes relevant only if reassessment identifies inadequate protection or a surgical problem."
    },
    {
      lesson: "d11-coag", topic: "Hemostasis", kind: "complication-rescue", level: 4,
      stem: "After unfractionated heparin 400 U/kg, ACT rises from 112 to only 330 seconds; the institutional CPB target is 480 seconds. Antithrombin activity is 38%, platelet count is normal, and there is no clinical suspicion for HIT. What is the most direct next step?",
      options: [
        "Give antithrombin concentrate, then re-dose heparin and confirm an adequate ACT",
        "Give protamine, then repeat the ACT to test whether residual heparin was present",
        "Start CPB at the measured ACT because anticoagulation will increase with cooling",
        "Switch immediately to bivalirudin despite absent HIT or heparin hypersensitivity"
      ],
      explain: "Heparin requires antithrombin. Markedly reduced antithrombin with a poor ACT response identifies antithrombin-mediated heparin resistance; replace it, re-dose heparin, and verify adequate anticoagulation before CPB. Protamine moves anticoagulation in the wrong direction. Bivalirudin is valuable for specific heparin contraindications, not the first response to demonstrated antithrombin deficiency."
    },
    {
      lesson: "d12-pacing", topic: "Pacing", kind: "complication-rescue", level: 5,
      stem: "After AVR, a temporary ventricular pacemaker is set to demand pacing. Intrinsic R waves measure 5 mV, but ventricular sensitivity is set at 10 mV. Pacing spikes intermittently fall within native QRS complexes and T waves despite a stable capture threshold. Which adjustment addresses the primary malfunction?",
      options: [
        "Lower the ventricular sensitivity setting to about 2 mV and verify sensing",
        "Raise ventricular output because capture failure causes the inappropriate spikes",
        "Increase the sensitivity setting above 10 mV to detect smaller intrinsic signals",
        "Disable pacing immediately because a spike within a QRS proves wire fracture"
      ],
      explain: "The device is undersensing because a 5-mV R wave does not cross a 10-mV sensing threshold. On temporary pacemakers, lowering the displayed mV setting increases sensitivity and permits inhibition by intrinsic beats. Confirm sensing across respiratory and positional changes while maintaining an adequate capture margin. Output changes treat capture, not sensing."
    },
    {
      lesson: "d13-complications", topic: "ICU", kind: "complication-rescue", level: 4,
      stem: "Nine days after bilateral internal thoracic artery CABG, an obese patient with diabetes develops fever, purulent drainage, sternal instability, and sepsis. CT shows retrosternal fluid and gas. What is the safest definitive management?",
      options: [
        "Urgent debridement with deep cultures and IV antibiotics, followed by staged wound closure",
        "Culture the superficial drainage and use oral antibiotics while waiting for spontaneous sternal stabilization",
        "Rewire the sternum immediately without removing infected or devitalized tissue",
        "Treat with bedside drainage alone because postoperative mediastinal gas excludes deep infection"
      ],
      explain: "Sternal instability, deep purulence, sepsis, and retrosternal fluid identify deep sternal wound infection with mediastinitis. Source control requires urgent debridement of infected and devitalized tissue, deep cultures, and broad IV antibiotics narrowed to results. Negative-pressure therapy and flap or delayed closure are planned according to tissue and stability. Antibiotics, superficial drainage, or rewiring without debridement leave the source in place."
    },
    {
      lesson: "d1-valves-anat", topic: "Anatomy", kind: "operative-step", level: 4,
      stem: "During mitral replacement for noninfective rheumatic disease in a patient with LV dysfunction, the posterior chordal apparatus can be retained, but bulky anterior tissue would obstruct the chosen prosthesis. Which operative strategy best balances ventricular preservation with prosthetic function?",
      options: [
        "Preserve posterior chordal continuity and selectively resect or transpose tissue that would obstruct the prosthesis",
        "Excise both leaflets and every chord because any retained subvalvular tissue destabilizes the sewing ring",
        "Preserve all anterior and posterior tissue even when it restricts leaflet or disc motion",
        "Retain only free-edge anterior chordae because posterior continuity does not support LV geometry"
      ],
      explain: "Chordal preservation maintains annulo-papillary continuity, limits adverse spherical remodeling, and supports postoperative LV systolic function. Preservation is not absolute: tissue that obstructs the prosthesis or creates LVOT obstruction must be resected, folded, or transposed. The plan therefore preserves safe posterior continuity while confirming unrestricted prosthetic motion before leaving bypass."
    },
    {
      lesson: "d2-angina", topic: "Coronary", kind: "reconcile-discordant", level: 5,
      stem: "Two hours after CABG, a patient develops inferior ST elevation, hypotension, and a new inferior wall-motion abnormality. Urgent angiography shows a patent RCA graft with diffuse native and graft spasm that resolves after intracoronary nitroglycerin. What is the best subsequent strategy?",
      options: [
        "Continue coronary vasodilators while supporting pressure, correcting triggers, and reassessing flow",
        "Revise the patent RCA graft because any postoperative ST elevation proves technical failure",
        "Give systemic thrombolysis for acute graft thrombosis despite the angiographic findings",
        "Escalate catecholamines because higher coronary pressure is definitive antispasm therapy"
      ],
      explain: "Reversible diffuse narrowing with a patent anastomosis identifies vasospasm rather than a fixed technical defect. Continue carefully titrated vasodilator therapy, correct provoking factors, support systemic pressure, and reassess ischemia and flow. Revision becomes appropriate if a mechanical defect emerges; thrombolysis is not supported by a patent, responsive graft. Excess catecholamine may intensify spasm and demand."
    },
    {
      lesson: "d3-ar", topic: "Valvular", kind: "complication-rescue", level: 5,
      stem: "A patient with active aortic-valve endocarditis develops acute severe AR, pulmonary edema, and MAP 55 mm Hg. The LV is nondilated and hyperdynamic with EF 70%. Which strategy is definitive?",
      options: [
        "Begin stabilization and antimicrobials in parallel while proceeding to emergency valve surgery; avoid IABP",
        "Complete six weeks of antibiotics before surgery despite pulmonary edema and shock",
        "Use IABP with aggressive beta blockade until the LV dilates enough for replacement",
        "Wait for serial LV dilation or EF decline because 70% indicates adequate compensation"
      ],
      explain: "Acute severe AR overwhelms a nondilated LV; a hyperdynamic EF does not indicate durable compensation. Pulmonary edema and shock require emergency surgery, with hemodynamic stabilization and antimicrobial therapy performed in parallel rather than used to delay source control. IABP raises the diastolic regurgitant gradient, and marked bradycardia lengthens regurgitant time. Waiting for chronic remodeling permits further collapse."
    },
    {
      lesson: "d4-cath", topic: "Imaging", kind: "complication-rescue", level: 5,
      stem: "During selective left coronary angiography, the aortic pressure trace abruptly becomes low-amplitude and ventricularized immediately after ostial engagement. The patient remains initially stable. What is the safest immediate action?",
      options: [
        "Withhold contrast and disengage until the normal aortic waveform returns",
        "Inject forcefully to distinguish true left-main stenosis from catheter damping",
        "Advance the catheter deeper so its side holes sit beyond the ostial lesion",
        "Ignore the waveform while the ECG and systemic pressure remain initially stable"
      ],
      explain: "Ventricularization or damping means the catheter is obstructing the ostium or has encountered severe ostial disease or spasm. Contrast injection can cause ischemia or dissection; disengage first, restore the waveform, then reassess catheter choice and anatomy. Initial stability does not make an occlusive catheter position safe. Deeper engagement increases rather than resolves the hazard."
    },
    {
      lesson: "d5-heartteam", topic: "Preop", kind: "when-not-to", level: 5,
      stem: "An 82-year-old patient has symptomatic severe AS and technically favorable transfemoral anatomy. He also has severe frailty unlikely to improve and metastatic cancer with an estimated six-month survival; much of his functional decline is noncardiac. What should the Heart Team recommend?",
      options: [
        "Recommend goal-concordant palliation rather than routine valve replacement",
        "Offer transfemoral TAVR because anatomic feasibility overrides noncardiac prognosis",
        "Offer SAVR because a surgical prosthesis provides the longest possible durability",
        "Decline every treatment solely because age above 80 years contraindicates intervention"
      ],
      explain: "Technical feasibility does not establish meaningful benefit. When predicted survival is under one year or meaningful quality-of-life improvement is unlikely, shared decision-making should favor symptom-focused, goal-concordant care rather than routine intervention. Age alone is not the exclusion; prognosis, frailty, attribution of symptoms, and patient goals are. Palliative care remains active treatment, not abandonment."
    },
    {
      lesson: "d6-technique", topic: "CABG", kind: "operative-step", level: 5,
      stem: "After LITA-to-LAD grafting, TEE shows a new anterior wall-motion abnormality. At stable pressure and heart rate, transit-time flow measurement shows mean flow 7 mL/min, pulsatility index 8, and diastolic filling 35%. What is the best response?",
      options: [
        "Inspect and revise the graft, then repeat flow measurement and TEE before closure",
        "Close because graft flow commonly rises only after recovery from general anesthesia",
        "Increase vasopressor alone until pressure overcomes the mechanical obstruction",
        "Give intracoronary thrombolysis before examining conduit lie or anastomosis"
      ],
      explain: "Very low flow, high pulsatility index, poor diastolic filling, and a matching new wall-motion abnormality are concordant evidence of graft dysfunction. Inspect the conduit lie, anastomosis, and target; correct spasm or revise a technical defect, then document normalized physiology before closure. Pressure manipulation alone cannot reliably overcome a kink or anastomotic problem."
    },
    {
      lesson: "d7-savr", topic: "ValveSurgery", kind: "complication-rescue", level: 5,
      stem: "Immediately after SAVR, TEE shows a rocking prosthesis with a large eccentric paravalvular jet and holodiastolic flow reversal. The patient is still fully heparinized and cannulated. What is the best next step?",
      options: [
        "Return to CPB to inspect, reseat, or reconstruct the annulus before leaving the OR",
        "Accept the leak because early paravalvular jets usually seal after protamine",
        "Complete closure and arrange percutaneous repair later despite the fresh annular defect",
        "Treat with diuresis because prosthesis fixation cannot be reassessed intraoperatively"
      ],
      explain: "Rocking and a large paravalvular leak indicate inadequate seating, dehiscence, or annular disruption. This is an unacceptable intraoperative result and should be corrected while immediate surgical rescue remains available. Protamine does not restore fixation, diuresis does not repair the annulus, and delayed percutaneous rescue is not a substitute for correcting a fresh operative defect."
    },
    {
      lesson: "d11-coag", topic: "Hemostasis", kind: "when-not-to", level: 5,
      stem: "A patient with critical left-main NSTEMI requires urgent CABG and cannot safely wait. On day 6 of unfractionated heparin, platelets fall by 58% and a new proximal DVT develops; PF4 immunoassay and serotonin-release assay are positive. Which CPB anticoagulation strategy is most appropriate?",
      options: [
        "Use bivalirudin under an experienced CPB protocol and prevent circuit stasis",
        "Use standard high-dose heparin because the CPB dose overwhelms platelet-activating antibodies",
        "Substitute low-molecular-weight heparin because it does not cross-react with HIT antibodies",
        "Run CPB without systemic anticoagulation until the platelet count has recovered"
      ],
      explain: "This is acute HIT with thrombosis, and urgent surgery precludes waiting for the antibodies to clear. Bivalirudin is an established non-heparin CPB strategy at experienced centres; its metabolism requires meticulous circuit planning and avoidance of stagnant blood. When surgery can safely wait, delay to a later HIT phase is preferable. Standard or low-molecular-weight heparin can amplify thrombosis, and anticoagulant-free CPB is unsafe."
    }
  ];

  ITEMS.forEach((item, index) => {
    const id = "q-d14-" + String(index + 1).padStart(2, "0");
    const order = PERMUTATIONS[index];
    if (!order) throw new Error("Missing Day-14 option permutation for " + id);
    const question = {
      id,
      day: 14,
      lesson: item.lesson,
      topic: item.topic,
      stem: "<span>" + item.stem + "</span>",
      options: order.map(optionIndex => item.options[optionIndex]),
      answer: order.indexOf(0),
      explain: "<p>" + item.explain + "</p>",
      kind: item.kind,
      level: item.level
    };
    if (item.quant) question.quant = item.quant;
    if (item.evidence) question.evidence = item.evidence;
    window.QUESTIONS.push(question);
  });
})();

/* Dedicated capstone-integration set. These are deliberately new synthesis decisions, not copies of linked lesson items. */
(() => {
  const rows = [
    ["A 72-year-old patient needs redo SAVR after prior CABG. CT shows a patent LITA-LAD graft densely adherent to the sternum, severe iliofemoral disease, and a suitable right axillary artery. Which plan best integrates re-entry and cerebral-perfusion risk?",["Establish controlled axillary access before CT-guided re-entry and preserve the LITA while planning valve replacement","Open the sternum routinely, then seek peripheral access only after graft injury","Occlude the LITA preoperatively and rely on the stenosed native LAD","Use blind femoral cannulation despite severe iliofemoral disease"],0,"The CT hazard map should determine the rescue route before the sternum is opened. Right axillary access can provide controlled arterial inflow and an antegrade cerebral-perfusion option while the adherent LITA and right ventricle are dissected. The exact venous and aortic strategy remains individualized. Routine entry without rescue access, intentional sacrifice of a functioning LITA, and diseased femoral inflow each discard an available safety margin.","operative-step",5],
    ["Thirty minutes after CABG, MAP falls, CVP rises, chest drainage stops, and inferior ST elevation appears. TEE shows a posterior clot compressing the right atrium and no new regional wall-motion abnormality. What should occur first?",["Urgent surgical decompression of tamponade with graft reassessment during re-exploration","Immediate RCA graft revision without evacuating the posterior clot","Aggressive diuresis because rising CVP proves volume excess","Therapeutic anticoagulation for presumed graft thrombosis"],0,"The stopped drainage, rising CVP, and directly visualized regional clot establish obstructive tamponade. Compression can lower coronary perfusion and cause secondary ischemic ECG changes even without a new territorial wall-motion abnormality. Evacuate the clot urgently, identify the bleeding source, and reassess graft lie and flow in the same operation. Anticoagulation or isolated graft revision before decompression would worsen or ignore the dominant mechanism.","complication-rescue",5],
    ["A 66-year-old patient has symptomatic severe AS, complex left-main bifurcation disease, diabetes, low operative risk, and an ascending aorta measuring 5.6 cm. Which Heart-Team strategy addresses the full anatomy?",["SAVR with CABG and ascending-aortic replacement tailored to root and arch findings","TAVR plus left-main PCI while leaving the aneurysm untreated","Balloon valvuloplasty followed by medical therapy for coronary disease","Isolated ascending replacement without treating the valve or coronaries"],0,"The decision must solve three durable surgical problems: severe valve obstruction, complex prognostically important coronary disease, and a large ascending aneurysm. Combined SAVR, CABG, and ascending replacement provides one coherent operation when risk is acceptable, with root or arch extension only if anatomy requires it. A transcatheter valve and PCI leave the aneurysm, while partial surgical strategies fail to address symptomatic valve and coronary disease.","reconcile-discordant",5],
    ["A patient with acute type A dissection becomes hypotensive with a moderate pericardial effusion, severe AR, and a cool right leg but intact motor function and lactate 1.8 mmol/L. What is the priority?",["Proceed to emergency proximal aortic repair, then reassess persistent limb malperfusion","Perform routine pericardiocentesis and delay aortic surgery","Treat the leg with thrombolysis before controlling the ascending dissection","Use IABP to stabilize severe AR before transfer"],0,"Type A dissection carries immediate rupture, tamponade, coronary, and acute-AR risk. With limb malperfusion but no established malperfusion syndrome, proximal repair is prioritized and often restores true-lumen flow; the limb is reassessed immediately and treated if ischemia persists. Uncontrolled pericardiocentesis can precipitate fatal hemorrhage, thrombolysis magnifies rupture risk, and IABP is unsafe in both dissection and significant AR.","dosed-algorithm",5],
    ["After mitral repair, separation from CPB produces hypotension, a small hyperdynamic LV, a late-peaking LVOT gradient, and posterior MR. Filling pressure is low and epinephrine is running. Which sequence is most appropriate?",["Restore preload and afterload, stop epinephrine, add short-acting beta blockade as pressure permits, and reassess repair geometry","Increase epinephrine and begin nitrates to improve forward ejection","Insert an IABP before correcting loading and contractility","Return directly for valve replacement without testing reversible physiology"],0,"The integrated TEE and hemodynamic pattern is systolic anterior motion with dynamic obstruction, not primary pump failure. Correct underfilling and low afterload first, withdraw beta stimulation, and slow the heart when pressure permits. Reassess MR and gradient under representative loading; persistent severe SAM then warrants repair revision. Epinephrine, nitrates, and IABP-related afterload reduction can intensify the physiology, while immediate replacement may sacrifice a salvageable repair.","dosed-algorithm",5],
    ["A patient with a mechanical mitral valve presents with dyspnea, INR 1.4, rising transvalvular gradient, and restricted leaflet motion on fluoroscopy. TEE shows a large obstructive thrombus and pulmonary edema. What is the next principle?",["Stabilize and obtain urgent multidisciplinary surgical-versus-fibrinolytic assessment based on obstruction, thrombus, and operative risk","Increase warfarin dose and arrange routine clinic follow-up","Treat with diuresis alone because gradients do not reflect prosthetic obstruction","Perform cardioversion because leaflet restriction is caused by atrial fibrillation"],0,"Subtherapeutic anticoagulation, restricted mechanical leaflet motion, a large mass, rising gradient, and pulmonary edema define obstructive prosthetic thrombosis. This is an emergency requiring stabilization and expert selection of urgent surgery or carefully protocolized fibrinolysis based on valve position, thrombus burden, hemodynamics, embolic and bleeding risk, and local expertise. Outpatient warfarin adjustment and diuresis do not relieve mechanical obstruction.","complication-rescue",5],
    ["During attempted separation from CPB, the LV is globally weak. Temperature is 34°C, potassium 6.4 mmol/L, pH 7.17, and TEE shows no regional abnormality or air. What should happen before mechanical-support escalation?",["Resume full bypass, complete rewarming and metabolic correction, optimize rhythm and loading, then reassess ventricular reserve","Continue separation while escalating epinephrine through severe acidosis","Give protamine before restoring stable circulation","Revise every bypass graft despite absent territorial evidence"],0,"Hypothermia, hyperkalemia, and acidemia impair conduction, calcium handling, vascular responsiveness, and contractility. Return to full support and correct these reversible barriers before declaring failure to wean. Rhythm, preload, afterload, de-airing, protection, and regional function are reassessed systematically. Inotropy during hostile metabolism raises demand, protamine removes the safety of immediate CPB, and empiric graft revision lacks the expected territorial signal.","operative-step",5],
    ["Before CPB, heparin 400 U/kg raises ACT only to 320 seconds. Antithrombin activity is 35%, there is no HIT history, and the institutional target is 480 seconds. What is the most direct response?",["Replace antithrombin, re-dose heparin, and verify adequate anticoagulation before bypass","Start bypass because cooling will prolong ACT later","Give protamine to correct heparin resistance","Use platelet transfusion as a substitute for antithrombin"],0,"Heparin requires antithrombin to inhibit thrombin and factor Xa. A low antithrombin level with inadequate ACT response identifies heparin resistance that can be corrected with concentrate or plasma according to protocol, followed by repeat heparin and verification. Proceeding under-anticoagulated risks circuit thrombosis. Protamine neutralizes heparin, and platelets cannot replace the missing anticoagulant cofactor.","complication-rescue",4],
    ["Ten minutes after protamine, pulmonary artery pressure doubles, the RV acutely dilates, LV filling collapses, and MAP falls to 35 mm Hg. Which rescue bundle is best?",["Stop protamine, support RV coronary pressure and oxygenation, add inhaled pulmonary vasodilation, and return to bypass if needed","Complete the protamine dose rapidly and give isolated nitroprusside","Treat as LV volume overload with aggressive diuresis","Administer more heparin without supporting the failing RV"],0,"This is a type III protamine reaction causing abrupt pulmonary vasoconstriction and RV failure. Stop exposure, restore systemic pressure for RV coronary perfusion, correct hypoxia and acidemia, use selective pulmonary vasodilation, and re-establish CPB or mechanical support if collapse persists. Rapid protamine and systemic vasodilation worsen the pressure mismatch; diuresis further reduces LV filling during acute RV obstruction.","dosed-algorithm",5],
    ["A patient on peripheral VA-ECMO after mechanical AVR develops pulmonary edema, a closed mechanical prosthesis, LV spontaneous echo contrast, and rising PCWP. Which unloading option is anatomically appropriate?",["Use a surgical left-atrial or LV vent while balancing ECMO flow against systemic perfusion","Place a transvalvular Impella through the mechanical aortic prosthesis","Increase retrograde ECMO flow until the prosthesis opens","Give repeated volume boluses to wash out the LV"],0,"Peripheral arterial return raises LV afterload. The closed prosthesis, congestion, and stasis show that systemic perfusion is being maintained at the cost of dangerous left-heart distension. A transvalvular microaxial pump cannot cross a mechanical aortic valve, making a surgical LV or left-atrial vent the logical route. More retrograde flow or volume worsens afterload, pulmonary edema, and thrombus risk.","complication-rescue",5],
    ["A continuous-flow LVAD patient has melena, hemoglobin 68 g/L, stable pump power, and no hemolysis. Endoscopy shows small-bowel angiodysplasia. What mechanism best links device support to bleeding?",["High shear causes acquired von Willebrand multimer loss while low pulsatility promotes angiodysplasia","Pump thrombosis raises von Willebrand multimers and seals vascular lesions","The driveline directly erodes the small bowel","Aortic-valve opening mechanically tears intestinal vessels"],0,"Continuous-flow support creates high shear that cleaves the largest von Willebrand multimers, impairing platelet adhesion, while reduced pulsatility favors gastrointestinal angiodysplasia. Management balances resuscitation, endoscopic therapy, anticoagulation and antiplatelet risk, pump settings, and recurrent-bleeding strategies. Stable power and absent hemolysis argue against pump thrombosis, and the external driveline does not contact bowel mucosa.","reconcile-discordant",4],
    ["After SAVR, complete AV block persists for seven days despite normalized temperature, electrolytes, ischemia assessment, and drug withdrawal. The patient remains pacing dependent. What is the next step?",["Proceed with permanent-pacemaker evaluation after confirming persistent conduction injury","Remove temporary pacing to force native recovery","Give adenosine to reopen the His bundle","Implant an ICD solely because ventricular pacing is required"],0,"Aortic-valve surgery can injure or compress the conduction axis near the membranous septum. Although early edema-related block can recover, persistent high-grade block with dependence after an appropriate observation period and no reversible cause supports permanent pacing. Adenosine suppresses AV nodal conduction, and an ICD addresses ventricular tachyarrhythmic risk rather than isolated postoperative AV block.","complication-rescue",4],
    ["A patient develops AF 60 hours after CABG. Stroke risk is high, but mediastinal drainage has increased and hemoglobin is falling. The ventricular rate is controlled and the patient is stable. What is the best immediate plan?",["Investigate and control bleeding, defer full anticoagulation temporarily, and reassess stroke and rhythm strategy promptly","Start therapeutic anticoagulation immediately because AF duration overrides hemorrhage","Give thrombolysis to prevent left-atrial thrombus","Declare anticoagulation permanently contraindicated"],0,"AF duration and stroke risk favor anticoagulation, but active postoperative bleeding creates an immediate competing hazard. Stabilize and identify the bleeding source, defer therapeutic anticoagulation while hemorrhage is active, and revisit the decision as soon as hemostasis improves. Rate, symptoms, recurrence, and cardioversion plans still matter. Neither automatic anticoagulation nor permanent refusal reflects the dynamic balance.","when-not-to",5],
    ["A patient with confirmed acute HIT and left-main ischemia requires CABG before antibodies can clear. Which CPB plan is most appropriate at an experienced center?",["Use a bivalirudin-specific protocol that avoids circuit stasis and anticipates absent reversal","Give standard heparin because CPB doses overwhelm HIT antibodies","Use low-molecular-weight heparin because it never cross-reacts","Run bypass without systemic anticoagulation"],0,"Urgent surgery prevents waiting for a later HIT phase. Bivalirudin directly inhibits thrombin and can support CPB, but perfusion and surgical teams must use a dedicated protocol because there is no protamine reversal and stagnant blood can clot as local drug activity falls. Standard and low-molecular-weight heparin can amplify HIT thrombosis, while anticoagulant-free CPB is unsafe.","operative-step",5],
    ["After prolonged vasoplegic shock, a patient has abdominal pain out of proportion, rising lactate, and preserved global cardiac output. What complication and response are most appropriate?",["Suspect mesenteric ischemia and obtain urgent vascular imaging and surgical consultation while optimizing perfusion","Diagnose constipation and await peritoneal signs","Increase alpha-vasoconstrictors without evaluating regional flow","Begin enteral feeding to test bowel viability"],0,"Global output can look adequate while intense vasoconstriction or earlier low flow causes regional mesenteric ischemia. Disproportionate pain and lactate warrant urgent CT angiography and specialist assessment before peritonitis marks advanced necrosis. Resuscitation should optimize flow and avoid unnecessary vasoconstrictor burden. Observation or feeding consumes the rescue window and can worsen injured bowel.","complication-rescue",5],
    ["Two hours after plasma transfusion, hypoxemia and bilateral infiltrates develop. MAP is normal, JVP is not elevated, echo filling pressures are low-normal, and there is no response to diuresis. What is most likely?",["TRALI causing noncardiogenic permeability edema","TACO causing hydrostatic congestion","Acute hemolysis presenting only as lung edema","Anaphylaxis without rash, wheeze, or hypotension"],0,"The timing after a plasma-rich component and absence of circulatory overload favor transfusion-related acute lung injury. Stop the transfusion, notify the blood bank, provide lung-protective respiratory support, and exclude competing causes. TACO more often produces elevated filling pressures, hypertension, venous congestion, and diuretic response. Hemolysis and anaphylaxis have different systemic signatures.","reconcile-discordant",4],
    ["CABG planning shows 90% proximal LAD disease, 85% large OM disease, and a 55% RCA lesion with FFR 0.87. LITA and radial conduit assessments are favorable. Which graft plan best limits competitive flow?",["Use LITA-LAD and radial-OM, and do not graft the physiologically negative RCA","Use the radial artery on the moderate RCA and leave the severe OM untreated","Use vein to every vessel regardless of lesion physiology","Graft the RCA with LITA and treat the LAD medically"],0,"LITA-LAD is the durability anchor, and a radial conduit performs best on a severely stenosed target such as the large OM. Grafting the FFR-negative RCA risks competitive native flow and arterial-graft failure without demonstrated ischemic benefit. The plan integrates conduit durability, target importance, and physiology; unreliable FFR or different distal anatomy would require reassessment rather than an automatic rule.","operative-step",5],
    ["After P2 mitral repair, representative loading reveals an eccentric MR jet, pulmonary-vein systolic reversal, a large vena contracta, and a new flail segment. What should the surgeon do?",["Return to CPB, localize the repair failure, and revise it before leaving the operating room","Accept the jet because eccentric MR is always overestimated","Reverse protamine and wait for outpatient imaging","Use IABP alone to correct the flail segment"],0,"Multiple concordant findings under representative loading establish severe structural residual MR. The visible flail segment identifies a failed repair mechanism that should be revised while cannulation and operative access remain available. Eccentricity can make jet area misleading, but vena contracta, pulmonary-vein reversal, and anatomy overcome that limitation. Loading manipulation or counterpulsation cannot repair a flail leaflet.","complication-rescue",5],
    ["A stable patient with acute type A dissection has renal malperfusion on CT, but urine output continues and lactate is normal. Which sequence is most appropriate?",["Perform emergency proximal repair and reassess renal perfusion immediately afterward","Delay aortic repair for several days of renal optimization","Perform renal thrombolysis before controlling the ascending tear","Treat only with TEVAR of the descending aorta"],0,"Imaging malperfusion without established organ-failure syndrome often improves after proximal repair restores true-lumen pressure. The ascending rupture and tamponade risk remains immediate, so emergency repair is prioritized with direct postoperative reassessment and branch intervention if ischemia persists. Selected advanced mesenteric malperfusion syndromes may require a different expert-center sequence, but that exception is not present here.","when-not-to",5],
    ["A postoperative patient has oliguria, creatinine rise, CVP 22 mm Hg, severe RV failure, and a plethoric IVC. MAP is 72 mm Hg. Which renal-protection strategy best addresses the mechanism?",["Treat venous congestion and RV failure while maintaining adequate renal perfusion pressure","Give repeated fluid boluses because every AKI is preload responsive","Increase PEEP to raise CVP further","Use loop diuretic as proof that tubular injury is reversed"],0,"Renal filtration depends on the arterial-to-venous pressure gradient, not MAP alone. Severe RV failure and venous congestion raise renal backpressure and can worsen AKI despite an acceptable MAP. Optimize RV perfusion and contractility, lower PVR, remove excess volume when tolerated, and avoid nephrotoxins. Blind fluid loading intensifies congestion, while diuresis manages volume but does not prove renal recovery.","reconcile-discordant",5],
    ["A patient with active aortic-valve endocarditis develops acute severe AR, pulmonary edema, hypotension, and a new annular abscess with complete heart block. What is definitive management?",["Stabilize and give antibiotics in parallel with emergency surgery for valve and infected-root source control","Complete six weeks of antibiotics before considering surgery","Use IABP and beta blockade until the LV dilates","Implant a pacemaker and discharge because conduction is the only urgent issue"],0,"Acute severe AR with shock, heart failure, and annular extension is a surgical emergency. Complete block supports periannular invasion and may require radical debridement and root reconstruction; antibiotics and cultures proceed in parallel rather than delaying source control. IABP worsens diastolic regurgitation, and isolated pacing treats rate but neither pulmonary edema nor destructive infection.","complication-rescue",5],
    ["After arch surgery, a patient awakens with aphasia and right hemiplegia. Glucose and temperature are normal. What should happen next?",["Activate the stroke pathway with urgent noncontrast and vascular imaging while considering thrombectomy","Wait until tomorrow because postoperative sedation explains focal deficits","Give systemic thrombolysis before excluding hemorrhage","Lower perfusion pressure aggressively without brain imaging"],0,"A persistent focal deficit is acute stroke until proven otherwise. Brain imaging distinguishes hemorrhage from ischemia and vascular imaging identifies a large-vessel occlusion that may be amenable to thrombectomy despite recent surgery. Sternotomy and anticoagulation complicate systemic thrombolysis, making empiric lysis unsafe. Delay sacrifices potentially salvageable brain tissue.","complication-rescue",5],
    ["After CPB, MAP is 48 mm Hg, CI 3.2 L/min/m², SVR 500 dyn·s/cm⁵, CVP 20 mm Hg, and TEE shows a dilated weak RV. Which plan best treats the mixed physiology?",["Restore vascular tone while supporting RV perfusion and contractility and reducing PVR without indiscriminate volume","Give dobutamine alone and ignore severe vasodilation","Give repeated fluid boluses until CVP reaches 30 mm Hg","Use nitroprusside to lower systemic resistance further"],0,"The high output and low SVR identify vasoplegia, while the elevated CVP and abnormal RV show concurrent right-sided failure. Norepinephrine with a complementary agent can restore coronary and systemic pressure; oxygenation, acid-base correction, selective pulmonary vasodilation, rhythm, and cautious inotropy support the RV. Volume is guided by response because further distension worsens septal shift. Treating only one component leaves the other lethal.","reconcile-discordant",5],
    ["A ventilated postoperative patient suddenly becomes hypotensive with high airway pressures, absent right breath sounds, rising CVP, and a small underfilled LV on echo. What is the immediate action?",["Decompress the right chest for tension pneumothorax before transport or prolonged imaging","Give rapid crystalloid until the LV appears normal","Increase PEEP to recruit the right lung","Start anticoagulation for presumed pulmonary embolism"],0,"The clinical, ventilator, and echo findings converge on obstructive shock from tension pneumothorax. Immediate decompression followed by definitive tube thoracostomy restores venous return and RV output; formal imaging follows stabilization when needed. Fluid cannot overcome rising intrathoracic pressure, higher PEEP accelerates collapse, and anticoagulation delays the mechanical rescue while increasing postoperative bleeding risk.","complication-rescue",5]
  ];

  rows.forEach((row, index) => window.QUESTIONS.push({
    id: `q-d14-${String(36 + index).padStart(2, "0")}`, day: 14, lesson: "d14-integration", topic: "Integration",
    stem: `<p>${row[0]}</p>`, options: row[1], answer: row[2], explain: `<p>${row[3]}</p>`,
    kind: row[4], level: row[5]
  }));

  const strip = value => String(value || "").replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
  const clip = (value, count = 14) => strip(value).split(/\s+/).slice(0, count).join(" ");
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
  window.QUESTIONS.filter(q => /^q-d14-/.test(q.id)).forEach(q => {
    if (!q.kind) q.kind = /next|response|management|treatment|should|plan|strategy|priority/i.test(strip(q.stem)) ? "complication-rescue" : "reconcile-discordant";
    if (!q.level) q.level = 4;
    q.refs = Array.isArray(q.refs) && q.refs.length ? q.refs : ["cohn-5e", "key-questions-2e"];
    q.objective = q.objective || `Integrate ${clip(q.options[q.answer], 13)} with operative, imaging, hemodynamic, and postoperative evidence.`;
    const alternatives = q.options.filter((_, i) => i !== q.answer).map(option => `“${esc(clip(option, 10))}” leaves the dominant mechanism or an immediate hazard untreated.`).join(" ");
    q.explain = String(q.explain || "").replace(/<\/p>\s*$/, "") + `</p><p><strong>Why the other approaches fail:</strong> ${alternatives} <strong>Educational takeaway:</strong> In a capstone case, rank threats by immediacy, reconcile anatomy with physiology, and choose the intervention that controls the dominant reversible mechanism without creating a second hazard.</p>`;
  });

  const cueRevisions = {
    "q-d14-36": "Controlled axillary access before CT-guided redo entry",
    "q-d14-37": "Urgent tamponade decompression with graft reassessment",
    "q-d14-38": "Combined SAVR, CABG, and ascending-aortic replacement",
    "q-d14-39": "Emergency proximal repair followed by limb-perfusion reassessment",
    "q-d14-40": "Fill, constrict, stop epinephrine, and reassess SAM",
    "q-d14-41": "Urgent prosthetic-thrombosis surgery or fibrinolysis assessment",
    "q-d14-42": "Resume bypass and correct reversible metabolic causes",
    "q-d14-43": "Replace antithrombin and verify heparinization",
    "q-d14-44": "Stop protamine and rescue acute RV failure",
    "q-d14-45": "Surgical left-atrial or LV venting",
    "q-d14-46": "Shear-related vWF loss with low-pulsatility angiodysplasia",
    "q-d14-47": "Permanent-pacemaker evaluation for persistent block",
    "q-d14-48": "Control bleeding, defer anticoagulation, and reassess promptly",
    "q-d14-49": "Bivalirudin CPB protocol with continuous circuit flow",
    "q-d14-50": "Urgent imaging and consultation for mesenteric ischemia",
    "q-d14-53": "Return to CPB and revise the failed repair",
    "q-d14-55": "Treat RV failure and renal venous congestion",
    "q-d14-56": "Emergency valve and infected-root surgery with parallel antibiotics"
  };
  window.QUESTIONS.filter(q => cueRevisions[q.id]).forEach(q => { q.options[q.answer] = cueRevisions[q.id]; });
})();
