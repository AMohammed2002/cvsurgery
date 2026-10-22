/* Cardiac Anatomy — operative depth layer.
   Adds surgery-style chapters and an explicit theatre application to every legacy region. */
"use strict";
if (!window.ANATOMY || !window.ANATOMY.regions) throw new Error("ANATOMY base must load first");

window.ANATOMY.regions.push(
  {
    id: "cham-surface-orientation", category: "chambers",
    title: "Surface Anatomy & Cardiac Orientation",
    short: "What you see after sternotomy and how the chambers are arranged",
    blurb: "<p>The heart is not a symmetric box: the right ventricle faces the sternum, the left atrium hides posteriorly, and the great arteries spiral around one another. A reliable three-dimensional map is the first step in every cardiac operation.</p>",
    sections: [
      { heading: "Start here — orient the heart in the chest", html: "<p>The cardiac long axis runs from the right shoulder toward the left hip. The <b>right ventricle</b> forms most of the anterior or sternocostal surface; the <b>left ventricle</b> forms the left border, apex, and most of the diaphragmatic surface; the <b>right atrium</b> forms the right border; and the <b>left atrium</b> forms the posterior base. This explains why a midline sternotomy exposes the RV and ascending aorta immediately but not the mitral valve or posterior descending artery.</p><p>The apex is normally formed by the LV and lies near the left fifth intercostal space at the midclavicular line. The inferior surface rests on the diaphragm and is supplied mainly by the artery that gives rise to the PDA.</p>" },
      { heading: "The operative view after the pericardium opens", html: "<p>With the pericardium suspended, the surgeon sees the right atrial appendage to the right, the ascending aorta centrally, the pulmonary trunk to its left, and the RVOT sweeping toward the pulmonary valve. The LAD marks the anterior interventricular groove and separates the RV from the LV. The right and left atrioventricular grooves mark the junctions between atria and ventricles and carry the RCA and circumflex systems.</p><div class=\"kbox pearl\"><span class=\"kbox-tag\">Pearl</span> When chamber borders are distorted by cardiomegaly or adhesions, coronary grooves remain dependable orientation lines.</div>" },
      { heading: "Mobilizing the heart — what moves and what does not", html: "<p>The apex and ventricular free walls can be elevated, but the great veins and atrial attachments tether the base. Lifting the heart to expose the obtuse marginal or PDA territory can kink the venae cavae, reduce venous return, compress the RV, and cause abrupt hypotension—especially during off-pump CABG. A deep pericardial traction suture improves exposure but must not injure the phrenic nerve.</p>" },
      { heading: "How surface anatomy guides the operation", html: "<p>Anterior targets such as the LAD are usually accessible with little displacement. Lateral circumflex targets require the apex to be elevated and rotated rightward; inferior RCA/PDA targets require cephalad displacement. The surface map therefore predicts both technical exposure and the haemodynamic price of obtaining it.</p>" }
    ],
    pearls: ["The RV, not the LV, is the chamber immediately behind the lower sternum.", "The LAD is the most useful anterior landmark separating the two ventricles.", "The left atrium is the most posterior chamber and is approached through an atrial groove or septum, not from the front.", "Sudden hypotension during cardiac displacement is anatomy until proved otherwise: release the heart and restore filling."]
  },
  {
    id: "cham-pericardial-access", category: "chambers",
    title: "Sternotomy, Pericardial Access & Re-entry Planes",
    short: "Layers from skin to heart, safe opening, adhesions and structures at risk",
    blurb: "<p>Safe access is an anatomy operation before it is a heart operation. The essential question is what lies beneath the sternum now—not only in a normal chest, but after previous surgery.</p>",
    sections: [
      { heading: "From skin to mediastinum", html: "<p>A median sternotomy passes through skin, subcutaneous tissue, sternal periosteum and sternum into anterior mediastinal tissue. The paired internal thoracic arteries run roughly 1–2 cm lateral to the sternal edges. Inferiorly, the RV may lie only millimetres behind the sternum; superiorly, the left brachiocephalic vein crosses behind the manubrium and in front of the arch branches.</p>" },
      { heading: "Opening the pericardium", html: "<p>The pericardium is usually opened longitudinally several centimetres <b>anterior to the right phrenic nerve</b>, from near the diaphragm toward the aortic reflection. Stay sutures retract the edges and create the operative well. Opening too lateral risks the phrenic nerve and pericardiophrenic vessels; opening too close to the great vessels can compromise later cannulation or closure.</p>" },
      { heading: "Redo sternotomy — anatomy has changed", html: "<p>After prior surgery, the RV, aorta, vein grafts, or right internal thoracic artery may be adherent to the posterior sternum. Preoperative CT identifies the structure closest to each sternal level and whether peripheral cannulation should be established before re-entry. The most dangerous phase is the final division of the posterior table, when an adherent cardiac structure can be opened before control is available.</p>" },
      { heading: "The bailout map", html: "<p>Femoral or axillary arterial access and femoral venous access provide routes to cardiopulmonary bypass before or during a difficult re-entry. Knowledge of prior graft routing is crucial: an intact LIMA often crosses near the left upper mediastinum and injury can produce immediate LAD ischaemia.</p><div class=\"kbox danger\"><span class=\"kbox-tag\">Red flag</span> Never assume the retrosternal plane is empty in a redo chest; CT anatomy should drive the access plan.</div>" }
    ],
    pearls: ["Open the pericardium anterior to the right phrenic nerve.", "The RV is the cardiac chamber most vulnerable during lower sternal re-entry.", "The left brachiocephalic vein is a key hazard behind the upper sternum.", "Map a patent LIMA and vein grafts before redo sternotomy."]
  },
  {
    id: "cor-territories-targets", category: "coronary",
    title: "Coronary Territories & Bypass Target Map",
    short: "Match angiography to the vessel on the epicardial surface",
    blurb: "<p>CABG planning converts an angiogram into a surface map: which vessel is diseased, what myocardium it protects, where a usable distal target lies, and how the conduit can reach it without tension or competitive flow.</p>",
    sections: [
      { heading: "Start here — translate artery into myocardium", html: "<p>The LAD supplies the anterior LV, apex and anterior two-thirds of the septum through diagonal and septal branches. The circumflex supplies the lateral and posterolateral LV through obtuse marginal branches. The RCA supplies the RV and, in right dominance, the inferior LV, posterior septum and AV node through the PDA and posterolateral branches. Dominance changes the inferior map and must be stated before target selection.</p>" },
      { heading: "Name the surgical target correctly", html: "<p>Targets are described by the branch actually opened: LAD, diagonal, OM, PDA, or posterolateral branch—not merely by the parent coronary system. A suitable site is distal to important stenosis, usually at least about 1.5 mm in calibre, and has a relatively healthy wall with useful runoff. The angiographic target and the visible epicardial vessel may differ because fat, myocardial bridging, calcification, and intramyocardial segments obscure the course.</p>" },
      { heading: "Exposure and conduit routing", html: "<p>The LAD is approached anteriorly and usually receives the in-situ LIMA. Diagonals lie on the anterolateral LV. OM branches require rightward rotation and elevation of the apex. The PDA lies in the posterior interventricular groove and is exposed by elevating the inferior heart. Conduit length is judged with the heart filled and in its final position; a graft that is perfect on an empty arrested heart can kink after separation from bypass.</p>" },
      { heading: "The anatomy of a durable anastomosis", html: "<p>The arteriotomy should enter true lumen in a segment with acceptable wall quality. Heavy calcification prevents a clean needle bite; diffuse distal disease creates poor runoff; and grafting a mildly stenosed vessel creates competitive flow. Each problem is an anatomical reason for early failure even when the suture line appears technically neat.</p>" }
    ],
    pearls: ["Dominance is defined by the PDA origin and changes the inferior-wall target map.", "Target the named distal branch, not a vague coronary territory.", "Good runoff matters as much as proximal stenosis.", "Judge graft lie after the heart refills and returns to its normal position."]
  },
  {
    id: "cor-coronary-variants", category: "coronary",
    title: "Coronary Variants & Operative Hazards",
    short: "Anomalous origins, intramural courses, myocardial bridges and dual LAD",
    blurb: "<p>Coronary variants are common enough to expect and occasionally dangerous enough to redesign the operation. The key is not simply naming the anomaly but understanding its course relative to the aorta, pulmonary artery, myocardium, and planned incision.</p>",
    sections: [
      { heading: "Separate ostia, ramus and dual LAD", html: "<p>The left main may be absent, with separate LAD and circumflex ostia. A ramus intermedius arises when the left main trifurcates and supplies the lateral wall. Dual-LAD patterns include a short LAD ending high in the groove and a long LAD reaching the distal groove by an unusual course. These variants alter cardioplegia delivery, graft counting, and target identification.</p>" },
      { heading: "Anomalous aortic origin", html: "<p>An anomalous coronary arising from the opposite sinus may travel between the aorta and pulmonary artery, within the aortic wall, behind the aorta, in front of the pulmonary artery, or through the septum. High-risk features include an intramural segment, slit-like ostium, acute take-off angle, and interarterial course. Repair strategy may involve unroofing, reimplantation, pulmonary-artery translocation, or selective bypass depending on the exact anatomy.</p>" },
      { heading: "Intramyocardial and bridged vessels", html: "<p>A myocardial bridge covers an epicardial coronary segment, most often the LAD. During CABG, an intramyocardial LAD can be difficult to locate and careless dissection risks entering the RV because the anterior septum may be thin beneath the groove. Angiography and epicardial ultrasound can help define the buried segment.</p>" },
      { heading: "Cardioplegia implications", html: "<p>Separate or anomalous ostia may not receive reliable antegrade root cardioplegia. After the aorta is opened, direct ostial cardioplegia must be delivered deliberately and without traumatic cannulation. Retrograde cardioplegia can supplement protection but is less reliable for the RV and does not remove the need to understand coronary origin.</p>" }
    ],
    pearls: ["An absent left main means separate LAD and circumflex ostia, not missing left-coronary supply.", "An intramural course is a key high-risk feature of anomalous aortic origin.", "A buried LAD can sit close to the RV cavity.", "Coronary-origin variants change the cardioplegia plan before they change the graft plan."]
  },
  {
    id: "val-aortic-root-geometry", category: "valves",
    title: "Aortic Root Geometry for Repair & Replacement",
    short: "Annulus, virtual basal ring, commissures, sinuses and coronary buttons",
    blurb: "<p>The aortic root is a functional unit, not simply three cusps in a tube. Competence depends on the relationship among cusp tissue, commissural height, the sinuses, sinotubular junction, and basal support.</p>",
    sections: [
      { heading: "Build the root from the bottom up", html: "<p>The <b>virtual basal ring</b> connects the nadirs of the three cusp insertions and is the practical annular plane used for sizing. Cusp attachments rise in a crown shape to three commissures. Between this haemodynamic junction and the anatomic ventriculoarterial junction are muscular and fibrous triangles that explain why part of the root is ventricular myocardium and part is fibrous continuity with the mitral valve.</p>" },
      { heading: "What makes the valve competent", html: "<p>Each cusp must have adequate geometric height and effective height, meet its neighbours centrally, and coapt over a sufficient vertical length. Root or sinotubular-junction dilatation pulls commissures apart and can cause regurgitation despite normal cusps. Conversely, a restricted, calcified, or fenestrated cusp can fail within a normal-sized root.</p>" },
      { heading: "Coronary and conduction relations", html: "<p>The left and right coronary ostia arise from their respective sinuses, usually below the sinotubular junction. The noncoronary sinus relates to the interatrial septum. The membranous septum and penetrating His bundle lie beneath the right–noncoronary commissural region, making deep annular sutures there a cause of postoperative heart block.</p>" },
      { heading: "How anatomy changes the operation", html: "<p>Valve replacement requires annular debridement without entering the aortic-mitral curtain, ventricular septum, or coronary ostia. Valve-sparing root replacement preserves the cusps but restores basal and sinotubular dimensions. Root replacement mobilizes the coronaries as buttons; inadequate mobilization, tension, twisting, or a low reimplantation site risks coronary malperfusion.</p>" }
    ],
    pearls: ["The virtual basal ring joins cusp nadirs; the cusp insertion line is crown-shaped.", "Root dilatation can cause regurgitation with structurally normal cusps.", "Deep sutures near the right–noncoronary commissure risk the His bundle.", "A coronary button must lie without tension, twist, or kinking."]
  },
  {
    id: "val-fibrous-skeleton", category: "valves",
    title: "Fibrous Skeleton & Aorto-Mitral Continuity",
    short: "Central fibrous body, trigones, intervalvular fibrosa and surgical planes",
    blurb: "<p>The fibrous skeleton links the valve annuli, electrically insulates atria from ventricles, and provides the strongest suture-bearing tissue in the heart. It is also the crossroads where valve surgery can injure conduction tissue or adjacent chambers.</p>",
    sections: [
      { heading: "The load-bearing frame", html: "<p>The right and left fibrous trigones and the central fibrous body connect the aortic and mitral annuli. The anterior mitral leaflet is continuous with the left and noncoronary aortic cusps through the <b>intervalvular fibrosa</b>, also called the aorto-mitral curtain. This curtain forms the roof of the LVOT and transmits force between the two valves.</p>" },
      { heading: "Electrical insulation and the one normal bridge", html: "<p>Fibrous tissue electrically separates atrial from ventricular myocardium. The AV node and penetrating bundle of His form the normal electrical connection through this barrier near the central fibrous body. Accessory pathways are abnormal muscular bridges around the annuli that bypass this insulation.</p>" },
      { heading: "Neighbouring danger zones", html: "<p>The left atrium lies behind the aorto-mitral curtain, the membranous septum and conduction axis lie near its right side, and the circumflex artery courses close to the posterior mitral annulus—especially near the anterolateral commissural region. Deep or misplaced sutures can therefore create atrial perforation, heart block, or circumflex injury.</p>" },
      { heading: "When the skeleton is destroyed", html: "<p>Endocarditis can produce an intervalvular fibrosa abscess, pseudoaneurysm, or aorto-atrial fistula. Reconstruction may require radical debridement and patch rebuilding of the curtain before one or both valves can be implanted. The anatomy determines whether a standard valve operation is possible or a complex double-valve reconstruction is required.</p>" }
    ],
    pearls: ["The aorto-mitral curtain joins the anterior mitral leaflet to the left and noncoronary aortic cusps.", "The fibrous skeleton electrically insulates atria from ventricles.", "The His bundle crosses near the central fibrous body.", "Posterior mitral-annular sutures can injure the circumflex artery."]
  },
  {
    id: "cond-operative-danger-zones", category: "conduction",
    title: "Conduction System: Operative Danger Zones",
    short: "Where sutures, incisions and prostheses produce heart block",
    blurb: "<p>Postoperative conduction injury is predictable when the three-dimensional conduction axis is placed over the planned suture line. This chapter maps the vulnerable zones operation by operation.</p>",
    sections: [
      { heading: "The conduction axis in one continuous line", html: "<p>The SA node lies subepicardially at the superior cavoatrial junction. Atrial activation reaches the compact AV node at the apex of the triangle of Koch. The penetrating His bundle crosses the central fibrous body, reaches the membranous septum, and divides into right and left bundle branches along the ventricular septum.</p>" },
      { heading: "Aortic and root procedures", html: "<p>The His bundle is closest to the aortic annulus beneath the right–noncoronary commissural region. Aggressive debridement, deep sutures, an oversized prosthesis, septal haematoma, or local oedema can cause new bundle-branch block or complete AV block. The risk is higher when calcification extends into the membranous septum.</p>" },
      { heading: "Mitral and tricuspid procedures", html: "<p>At the tricuspid valve, protect the apex of the triangle of Koch and the anteroseptal commissural region; annuloplasty bites along the septal annulus should be shallow and anatomically deliberate. At the mitral valve, the conduction axis is less immediately adjacent, but sutures near the right fibrous trigone and central fibrous body can still injure it.</p>" },
      { heading: "Septal and congenital procedures", html: "<p>Perimembranous VSD closure is dangerous because the conduction bundle runs along the posteroinferior rim of the defect. The precise relation varies with defect anatomy, so the surgeon places sutures on the right-ventricular side with awareness that a normal-looking rim may contain the bundle.</p><div class=\"kbox danger\"><span class=\"kbox-tag\">Red flag</span> New complete heart block after valve or septal surgery is often an anatomic injury, compression, or oedema at one of these predictable sites.</div>" }
    ],
    pearls: ["Aortic danger zone: beneath the right–noncoronary commissure.", "Tricuspid danger zone: apex of Koch and anteroseptal commissure.", "Perimembranous VSD danger zone: posteroinferior rim.", "The moderator band carries the right bundle branch to the anterior papillary muscle."]
  },
  {
    id: "ves-ascending-arch", category: "vessels",
    title: "Ascending Aorta & Aortic Arch",
    short: "Segments, branch vessels, recurrent laryngeal nerve and cerebral perfusion",
    blurb: "<p>Aortic surgery depends on a segment-by-segment map: where safe tissue begins and ends, which branches feed the brain, and which nerves and veins cross the operative field.</p>",
    sections: [
      { heading: "Root, ascending aorta and arch", html: "<p>The root extends from the virtual basal ring to the sinotubular junction. The tubular ascending aorta continues to the origin of the brachiocephalic artery. The arch curves posteriorly and leftward over the left main bronchus and becomes descending aorta near the ligamentum arteriosum. The proximal descending segment just beyond the left subclavian artery is the isthmus.</p>" },
      { heading: "Arch branches and common variants", html: "<p>The usual order is brachiocephalic, left common carotid, and left subclavian artery. A common origin of the brachiocephalic and left common carotid arteries is frequent. A separate left vertebral artery may arise between the left common carotid and left subclavian. Branch pattern matters when choosing cannulation, clamp, stent-graft, and selective cerebral-perfusion sites.</p>" },
      { heading: "Structures crossing the field", html: "<p>The left brachiocephalic vein crosses anterior to the arch branches. The right pulmonary artery lies behind the ascending aorta. The left recurrent laryngeal nerve loops beneath the arch beside the ligamentum arteriosum; injury causes left vocal-cord paralysis. The thoracic duct approaches the left venous angle near the subclavian region and can be injured during extensive branch-vessel dissection.</p>" },
      { heading: "Cerebral perfusion anatomy", html: "<p>Right axillary or innominate cannulation directs antegrade flow into the right carotid and right vertebral systems. Whether unilateral perfusion protects the left hemisphere depends on the circle of Willis and collateral pathways. Bilateral selective perfusion adds a left-carotid cannula when anatomy or monitoring suggests inadequate cross-filling.</p>" }
    ],
    pearls: ["The right pulmonary artery lies immediately behind the ascending aorta.", "The left recurrent laryngeal nerve loops under the arch near the ligamentum arteriosum.", "Arch-branch variants must be defined before cerebral-perfusion planning.", "The aortic isthmus begins just distal to the left subclavian artery."]
  },
  {
    id: "ves-pulmonary", category: "vessels",
    title: "Pulmonary Arteries & Veins",
    short: "Hilar relations, branch pulmonary arteries and left-atrial entry",
    blurb: "<p>The pulmonary vessels form the posterior and superior boundaries of many operative planes. Their thin walls and close relation to bronchi, atria, and the ascending aorta make small anatomic errors consequential.</p>",
    sections: [
      { heading: "Pulmonary trunk and bifurcation", html: "<p>The pulmonary trunk arises from the RVOT, lies left and initially anterior to the ascending aorta, and bifurcates beneath the concavity of the arch. The right pulmonary artery passes horizontally behind the ascending aorta and SVC and in front of the right main bronchus. The left pulmonary artery passes over the left main bronchus and connects to the arch through the ligamentum arteriosum.</p>" },
      { heading: "The hilar map", html: "<p>At the right hilum the pulmonary artery is generally anterior to the bronchus; at the left hilum it is superior to the bronchus—remember RALS: Right Anterior, Left Superior. Pulmonary veins lie anterior and inferior at both hila and have thinner walls than the arteries.</p>" },
      { heading: "Pulmonary veins and left atrium", html: "<p>Four pulmonary veins usually enter the posterior LA, with right and left superior and inferior veins. Variants include a common left venous trunk and additional right middle-lobe veins. The veins form the lateral boundaries of the oblique pericardial sinus and are the key landmarks for left-atrial ablation and transplant anastomoses.</p>" },
      { heading: "Operative hazards", html: "<p>Dissection behind the ascending aorta can injure the right pulmonary artery. A clamp or suture at the ligamentum region can injure the left recurrent laryngeal nerve. Pulmonary-vein cannulation or ablation too deep can create stenosis; too proximal an ablation line may leave arrhythmogenic venous myocardium connected.</p>" }
    ],
    pearls: ["RALS: right pulmonary artery anterior to bronchus, left pulmonary artery superior.", "The right pulmonary artery is behind the ascending aorta and SVC.", "Pulmonary veins form the lateral boundaries of the oblique sinus.", "Define pulmonary-vein variants before ablation, transplant, or complex left-atrial surgery."]
  },
  {
    id: "ves-caval-cannulation", category: "vessels",
    title: "Venae Cavae & Venous Cannulation Anatomy",
    short: "SVC, IVC, right atrium, bicaval control and femoral venous drainage",
    blurb: "<p>Venous cannulation succeeds when the cannula follows the anatomy without obstructing a tributary, entering the wrong chamber, or injuring the atrial wall. The required exposure depends on whether the right heart must be opened.</p>",
    sections: [
      { heading: "Caval entry into the right atrium", html: "<p>The SVC enters the superior right atrium without a valve. The IVC enters inferiorly and is partly guarded by the Eustachian valve. The coronary sinus enters posteroinferiorly near the septal tricuspid annulus and may have a Thebesian valve. These landmarks become visible when the right atrium is opened.</p>" },
      { heading: "Two-stage versus bicaval cannulation", html: "<p>A two-stage cannula placed through the right atrial appendage drains the IVC through its distal basket and the RA/SVC through a proximal stage; it is efficient when the right heart stays closed. Separate SVC and IVC cannulas with caval tapes provide bicaval isolation for tricuspid, atrial septal, congenital, and many mitral procedures.</p>" },
      { heading: "Where injury occurs", html: "<p>High SVC dissection risks the right phrenic nerve and SA-node artery near the cavoatrial junction. Deep IVC cannulation can enter a hepatic vein; a poorly positioned cannula can obstruct venous return or crowd the atrial septum. Purse-string bites that are too deep can tear fragile atrial tissue when the cannula is secured.</p>" },
      { heading: "Femoral venous route", html: "<p>A femoral venous cannula passes through the external and common iliac veins into the IVC and ideally reaches the SVC under transoesophageal echocardiographic or fluoroscopic guidance. Iliocaval tortuosity, thrombus, filters, and congenital interruption can prevent safe passage. Vacuum assistance improves drainage but magnifies the consequences of malposition or air entrainment.</p>" }
    ],
    pearls: ["Use bicaval control when the right atrium must be opened.", "The SA node and nodal artery are close to the SVC–RA junction.", "TEE confirms the course and tip of a long femoral venous cannula.", "An IVC cannula can unintentionally enter a hepatic vein."]
  }
);

/* Give every pre-existing review page the same clinically oriented ending used in the surgery tab. */
const operativeApplications = {
  "cham-pericardium": "Pericardial reflections define the transverse and oblique sinuses used for clamping, cannulation, and posterior atrial exposure. During reoperation these spaces may be obliterated by adhesions, so the normal map remains the reference even when the plane is no longer visible.",
  "cham-atria": "Right-atrial anatomy determines cannulation, atriotomy and septal exposure. On the left, the posterior position and proximity of the oesophagus explain why mitral exposure, ablation and transoesophageal imaging all share the same hazards.",
  "cham-ventricles": "The thin, anterior RV is vulnerable during re-entry and cannulation; the thick LV tolerates pressure but not a poorly placed vent. Septal incision or suturing must be planned around the His-Purkinje system and coronary septal supply.",
  "cham-embryology": "Embryology becomes operative anatomy when a defect shifts the conduction axis, valve attachments, or great-artery relationship. Name the developmental lesion, then redraw the structures the surgeon will actually encounter.",
  "cond-sanode": "Place SVC cannulation, snares and atriotomies with the subepicardial SA node and its variable artery in mind. Injury may present as junctional rhythm or persistent sinus-node dysfunction after an otherwise uncomplicated operation.",
  "cond-avnode": "The triangle of Koch is a no-guessing zone: identify the coronary-sinus ostium, tendon of Todaro and septal tricuspid hinge before placing sutures near its apex.",
  "cond-his-bundle": "The penetrating bundle is vulnerable at the membranous septum in AVR, root surgery and VSD closure. New postoperative AV block should be interpreted against the precise site of debridement and suturing.",
  "cor-leftmain": "Before root cardioplegia or coronary-button mobilization, identify ostial height, left-main length and bifurcation. A short left main leaves less margin between an ostial instrument and the bifurcation.",
  "cor-lad": "During CABG, trace the LAD beyond the obstructive lesion and avoid mistaking a large diagonal for the main vessel. An intramyocardial segment may require ultrasound or careful distal-to-proximal dissection.",
  "cor-circumflex": "The circumflex is both a graft system and a structure at risk during mitral surgery. Deep posterior-annular sutures can distort or occlude it, particularly in left-dominant anatomy.",
  "cor-rca": "The RCA is exposed in the right AV groove but its PDA and posterolateral targets lie inferiorly. Proximal injury can affect RV perfusion and both nodal arteries; distal consequences depend on dominance.",
  "cor-veins": "The coronary sinus is the route for retrograde cardioplegia and a landmark for the triangle of Koch. Cannula depth and pressure matter: malposition gives incomplete protection, while excessive pressure can injure the sinus.",
  "val-aortic": "Read aortic-valve anatomy as a root unit: cusp quality, commissural height, annular support, sinuses and sinotubular junction. The mechanism of failure determines whether repair, isolated replacement or root surgery is anatomically sound.",
  "val-pulmonary": "Pulmonary-root dissection is deceptively close to the LAD septal branches and left main region. In a Ross procedure, the autograft must be harvested with enough muscle for integrity but not enough depth to injure coronary supply.",
  "val-mitral": "A repair is a geometric diagnosis: identify the diseased scallop, chordal lesion, annular distortion and ventricular mechanism before selecting resection, neochordae or annuloplasty. Preserve leaflet tissue and subvalvular continuity whenever possible.",
  "val-tricuspid": "The septal annulus is fixed and closely related to the conduction axis, while the anterior and posterior annulus dilate. Ring sutures therefore require unequal confidence: generous remodeling laterally, deliberate shallow bites septally.",
  "ves-aorta": "Aortic anatomy sets the cannulation, clamp and cerebral-protection plan. Disease at one segment may force inflow or occlusion into another, so imaging must be read from root through the access vessels rather than at the aneurysm alone.",
  "ves-femoral": "Access the common femoral artery over the femoral head, below the inguinal ligament and above the profunda bifurcation. Too high risks retroperitoneal bleeding; too low risks small-vessel injury and limb ischaemia.",
  "ves-saphenous": "Mark the vein before incision, preserve orientation, avoid high-pressure distension and protect the accompanying nerve. Once removed, check for branches, varicosity and calibre before treating it as a conduit.",
  "ves-lima": "LIMA harvest balances conduit length against chest-wall perfusion. Control branches close to the artery without thermal injury, protect the phrenic nerve, and confirm a tension-free lie to the LAD after lung inflation.",
  "ves-radial": "Preoperative assessment must prove adequate ulnar collateral flow and exclude dialysis needs or forearm disease. During harvest, prevent spasm, protect superficial sensory nerves and preserve the artery's endothelial surface.",
  "ves-phrenic": "Keep pericardiotomy and traction sutures anterior to the nerve, avoid direct cautery near the pericardiophrenic bundle, and remember that cold injury can occur even without transection.",
  "ves-axillary": "A side graft to the right axillary artery often provides controlled inflow and antegrade cerebral perfusion. Dissection stays close to the artery to reduce brachial-plexus injury, and distal limb perfusion must remain part of the plan."
};
window.ANATOMY.regions.forEach(function (region) {
  const html = operativeApplications[region.id];
  if (html) region.sections.push({ heading: "Why this anatomy matters in theatre", html: "<p>" + html + "</p>" });
});
