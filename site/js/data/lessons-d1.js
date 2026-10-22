window.LESSONS = window.LESSONS || {};

window.LESSONS["d1-chambers"] = {
  id: "d1-chambers",
  day: 1,
  ord: 1,
  title: "Chambers, Surfaces & Mediastinum",
  short: "Chambers",
  minutes: 15,
  chunks: [
    {
      title: "Mediastinal Geography",
      html: `<p>Before you ever touch the heart, you have to get to it — and the whole reason mediastinal anatomy matters to a surgeon is that the saw and the knife travel through it blind for the first few seconds of every case. Think of the mediastinum as a narrow luggage compartment packed front-to-back with structures that will not forgive a wrong plane: the sternum is the lid, the heart and great vessels are the bags stacked against it, and the esophagus and descending aorta line the far wall. Anatomists divide this compartment into three tiers, but the surgical point of the division is simple — it tells you, at any depth, what your instrument is about to meet next.</p>
<p>The <b>anterior mediastinum</b> — the thin slice directly behind the sternal bone — normally holds only the thymic remnant, fat, and lymphatics, which is exactly why a first-time sternotomy is safe: there is a forgiving cushion between bone and heart. That safety margin disappears in a <b>redo</b>. After a prior operation the <b>right ventricle</b>, which sits immediately behind the sternum, scars up against the bone, so the oscillating saw can drop straight into the RV before the chest is even open. This single fact drives redo strategy: peripheral (femoral) cannulation ready, an oscillating saw used with the pericardium tented up, and the surgeon fully prepared to go on bypass the moment blood appears.</p>
<ul>
  <li><b>Anterior mediastinum:</b> thymus remnant, fat, lymphatics. Clinically the empty front porch of the chest — and the reason the <b>RV is the first structure at risk in a redo sternotomy</b>.</li>
  <li><b>Middle mediastinum:</b> the heart itself, its pericardial sac, the ascending aorta and arch, SVC and IVC, the pulmonary trunk and veins, and the tracheal carina. This is the surgical field.</li>
  <li><b>Posterior mediastinum:</b> descending thoracic aorta, esophagus, thoracic duct, and azygos vein — the structures you are trying <em>not</em> to reach, injured only when a dissection goes too deep or too far back.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>The heart sits slightly <b>left of midline</b> with its apex pointing down and to the left. Because the <b>right ventricle faces forward</b>, it — not the left ventricle — is the first chamber you meet after opening the pericardium, and the first at risk on re-entry. The "left" heart is actually the back of the heart.</p>
</div>`
    },
    {
      title: "The Pericardium",
      html: `<p>The pericardium is a tough, fibrous sac wrapped around the heart, normally holding just 15–50 mL of lubricating fluid. The single most important property to understand is that <b>it does not stretch quickly</b>. Picture a leather bag with a fixed volume: pour fluid in slowly over months and the leather slowly gives and accommodates a surprising amount; pour the same fluid in over minutes and there is nowhere for it to go, so pressure inside the bag shoots up and squeezes the heart it surrounds. That difference in <em>rate</em> — not absolute volume — is the whole story of tamponade physiology.</p>
<p>This is why the numbers are so counter-intuitive. A rapid <b>150–200 mL</b> bleed after surgery or from a stab wound can arrest the heart, while a slowly building malignant or uremic effusion can exceed <b>1–2 litres</b> and be walked in from clinic. The pericardium's compliance curve is steep: once it is full, each additional millilitre raises intrapericardial pressure sharply, the thin-walled right atrium and right ventricle collapse in diastole, filling falls, and cardiac output follows.</p>
<p>In the operating room the surgeon opens this sac with a midline longitudinal incision and stitches its cut edges up to the sternal retractor — the <b>pericardial cradle</b> — which lifts the heart up into the wound and out of its deep pocket for exposure. At the end of the case, how (and whether) the pericardium is closed, and where the drains sit, is a deliberate decision aimed squarely at preventing the postoperative version of the problem above: a clot sitting over a drain hole, re-creating an acute tamponade.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>As little as <b>150–200 mL</b> of <em>acute</em> hemopericardium can cause tamponade, while the same volume in a chronic effusion is often silent — because the fibrous pericardium is inextensible on a short timescale. After cardiac surgery, a sudden drop in chest-tube output plus rising filling pressures and hypotension is tamponade until proven otherwise.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why does acute hemopericardium of 200 mL cause tamponade while a chronic effusion of 1 liter may be asymptomatic?",
      options: [
        "Acute blood is more viscous and increases resistance",
        "Chronic effusions are reabsorbed more rapidly",
        "Rapid accumulation outpaces acute pericardial compliance",
        "The heart beats faster in acute effusions, compensating"
      ],
      answer: 2,
      explain: "The pericardium is a fibrous, relatively inextensible sac. In the acute setting it cannot stretch, so even small volumes dramatically raise intrapericardial pressure and compress cardiac chambers. Chronic effusions develop over weeks to months, during which time pericardial compliance slowly increases, allowing much larger volumes before pressure rises critically."
    },
    {
      title: "Cardiac Chambers: Orientation",
      html: `<p>The single most useful mental correction a student can make is this: the heart is <b>not</b> a valentine sitting upright in the chest with "right" chambers on the right and "left" chambers on the left. It lies tipped on its side and rotated, so that the anatomical names describe the flow of blood, not the position in the body. Functionally, the "right" heart is really the <em>front</em> of the heart and the "left" heart is really the <em>back</em>. Once you internalise that rotation, the operative field, the chest X-ray silhouette, and the pattern of which chamber gets injured all fall into place.</p>
<ul>
  <li><b>Right ventricle — the front door.</b> It faces straight forward against the sternum, so it is the first chamber seen when the pericardium opens and the first wounded on redo re-entry. Its thin free wall is also why it tolerates pressure overload poorly.</li>
  <li><b>Left ventricle — the back and the tip.</b> It sits posteriorly and to the left, with its apex the one part that swings forward to the lower-left chest wall (the point where you feel the apex beat and listen for mitral sounds).</li>
  <li><b>Right atrium — the right border.</b> It forms the right edge of the cardiac shadow on a CXR; the SVC drops in from above and the IVC from below, which is exactly why it is the standard target for venous cannulation onto bypass.</li>
  <li><b>Left atrium — the deepest chamber.</b> It is the <b>most posterior</b> structure of the heart, lying directly on the esophagus. This intimacy explains two clinical signs: a dilated LA (e.g. in mitral stenosis) can cause dysphagia, and it is why a transesophageal echo probe — sitting in the esophagus — gets such a pristine view of the mitral valve.</li>
</ul>
<p>Open the right atrium and you meet its three parts (Cohn): the trabeculated <b>appendage</b>, the smooth-walled <b>venous component</b> that receives the SVC, IVC and coronary sinus, and the <b>vestibule</b> that funnels into the tricuspid valve. The appendage and venous component are separated externally by the <b>terminal groove</b> and internally by its ridge, the <b>terminal crest (crista terminalis)</b> — the landmark the standard atriotomy is placed parallel and anterior to. Pectinate muscles fan out from that crest around the whole parietal margin of the tricuspid orifice.</p>
<p>One anatomical truth reshapes how the septum is handled: the <b>only true wall between the two atria is the floor of the oval fossa (fossa ovalis)</b>. The prominent superior "septum secundum" rim is not septum at all but an <em>infolding</em> of the atrial walls between the caval veins and the right pulmonary veins — so a needle or dissection carried outside the oval fossa exits the heart to the epicardial fat rather than crossing into the left atrium. This is why a transseptal approach aims precisely for the fossa.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Because the left atrium is the back wall of the heart, surgeons reach the mitral valve <em>through</em> it, entering just behind the interatrial groove — the <b>groove of Sondergaard (Waterston's groove)</b>. Developing this plane lets the LA be opened without cutting across either atrium's body.</p>
</div>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Two "basic rules" from the cardiac short axis anchor everything else: each <b>atrium sits to the right of its own ventricle</b>, and the <b>right-sided chambers lie anterior to the left-sided ones</b>. And the <b>aortic valve is wedged dead-centre</b>, in fibrous continuity with the mitral valve and related to all four chambers — which is exactly why aortic-root disease and aortic-root operations reach out to threaten the mitral valve, the conduction axis, and both atria at once.</p>
</div>`
    },
    {
      title: "Aortic Root and Great Vessel Relationships",
      html: `<p>The aortic root is the central hub of the heart — it is wedged between the two ventricles, sits behind the right ventricular outflow tract, and is in fibrous continuity with the mitral valve, so almost every other structure is arranged around it. From the root the aorta climbs as the ascending aorta, arches over to the left and backward, and hands off to the descending aorta at a fixed tether point: the <b>ligamentum arteriosum</b>, the fibrous scar of the fetal ductus arteriosus, lying just distal to the left subclavian artery.</p>
<p>That tether is more than a landmark — it is a fault line. Because the arch is relatively mobile but the descending aorta is pinned down by the ligamentum and intercostals, sudden deceleration (a high-speed crash or a fall) whips the two segments in opposite directions and tears the aorta right at that junction, the <b>aortic isthmus</b>. This is the classic site of <em>traumatic aortic injury</em>. Wrapped around the very same ligamentum is the <b>left recurrent laryngeal nerve</b>, which hooks under the arch to run back up to the larynx; a mass, aneurysm, or careless dissection here paralyses the left vocal cord and produces hoarseness — the reason a new hoarse voice can be the first sign of arch pathology.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>The <b>phrenic nerves</b> run down the <em>front</em> of the pericardium, just lateral to the great vessels — a course worth memorising because two everyday manoeuvres threaten them. Cold injury from the ice slush used to cool the heart, and internal mammary artery harvest, both put the phrenic at risk; the result is a paralysed hemidiaphragm. One side is usually survivable but can stall a patient on the ventilator, so it is a real cause of failure to wean.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A surgeon opens the pericardium after sternotomy. Which cardiac chamber is the first structure encountered anteriorly?",
      options: [
        "Left atrium, the most posterior cardiac chamber",
        "Left ventricle",
        "Right ventricle",
        "Right atrium"
      ],
      answer: 2,
      explain: "The right ventricle faces anteriorly — it is the most 'frontal' chamber and the first structure encountered when opening the pericardium. This is why redo sternotomy carries higher risk: RV adhesions to the posterior sternum mean the oscillating saw can enter the RV before anyone realizes it."
    },
    {
      title: "Venous Cannulation and Bypass Access",
      html: `<p>Cardiopulmonary bypass is fundamentally a plumbing problem: to stop the heart and work inside it, the surgeon must first divert all the blood coming <em>back</em> to the heart out to the pump, and then return oxygenated blood to the body downstream. So the anatomy that matters is where blood enters and leaves. On the venous side, systemic blood arrives at the right atrium from two great veins (SVC from the head and arms, IVC from the abdomen and legs), while the heart's own venous blood returns through three smaller routes — the coronary sinus (the main drain, into the RA), the tiny thebesian veins (straight into the chambers), and the anterior cardiac veins.</p>
<p>Draining the venous side means putting cannulae into the right atrium, and the choice between two techniques comes down to one question — <b>does the right atrium itself need to be opened?</b></p>
<ul>
  <li><b>Single two-stage cannula:</b> one cannula slid in through the right atrial appendage, with a wide "basket" of holes sitting in the RA and a narrower tip reaching into the IVC. It drains everything from within the atrium at once. Simple and fast — the default for CABG and any case that leaves the RA closed.</li>
  <li><b>Bicaval cannulation:</b> a separate cannula in the SVC and another in the IVC, with tapes (snares) able to isolate the atrium completely. This is mandatory whenever the RA must be <em>opened</em> — tricuspid surgery, mitral surgery approached transseptally, ASD repair — because it keeps venous return flowing to the pump even with the atrium open and empty.</li>
</ul>
<p>The arterial return side has a clear pecking order: the <b>ascending aorta</b> is the standard cannulation site (short, direct, antegrade flow); the <b>femoral artery</b> is the fallback for emergencies and redos where the chest is not yet safe to open; and the <b>axillary artery</b> is often preferred for arch work and redos because it delivers antegrade flow to the brain and avoids pushing debris backward up a diseased aorta.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>The <b>coronary sinus</b> runs in the back of the AV groove and empties into the RA next to the tricuspid valve. Threading a catheter into it lets cardioplegia be given <em>backward</em> (retrograde) through the cardiac veins — the escape route when antegrade delivery down the coronaries fails, as in severe aortic regurgitation (where fluid pumped into the root just washes into the LV) or a tightly stenosed coronary.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Which cannulation strategy is preferred when the right atrium must be opened for valve surgery?",
      options: [
        "Separate SVC and IVC cannulae",
        "Single two-stage venous cannula",
        "Femoral venous cannulation",
        "Pulmonary artery cannulation"
      ],
      answer: 0,
      explain: "Bicaval cannulation uses separate cannulae in the SVC and IVC, allowing the right atrium to be opened without losing venous drainage. The single two-stage cannula drains from within the RA itself and cannot be used when the RA must be opened for tricuspid, atrial, or other intracardiac procedures."
    }
  ]
};

window.LESSONS["d1-coronaries"] = {
  id: "d1-coronaries",
  day: 1,
  ord: 2,
  title: "Coronary Arterial Tree & Dominance",
  short: "Coronaries",
  minutes: 18,
  chunks: [
    {
      title: "Origin and Left Main",
      html: `<p>The heart, despite being a pump full of blood, cannot feed itself from the blood inside its chambers — it needs its own dedicated delivery pipes, and those pipes are the coronary arteries. They branch off the aorta at the very first opportunity, from two of the three pockets (<b>sinuses of Valsalva</b>) that bulge out just above the aortic valve cusps. This "first-branch" position is elegant: it means the coronaries are fed at the highest pressure in the whole arterial tree, right at the aortic root. Every CABG operation is planned on this map, and calling a target vessel by the wrong name in the OR is not a trivia slip — it means grafting the wrong territory.</p>
<p>The <b>left coronary sinus</b> gives off the <b>left main (LM) coronary artery</b>, which then runs anteriorly, inferiorly and to the left in the groove <em>between the pulmonary trunk and the left atrial appendage</em> (Cohn). It is short — typically <b>10–20 mm</b>, though it can reach 40 mm — and in about <b>1% of people it is absent altogether</b>, the LAD and circumflex arising from two separate ostia in the left sinus (a variant that matters when you cannulate the ostia for cardioplegia or plan a root operation). <!-- VERIFY: Cohn 5e gives LM length 10-20mm (up to 40); some sources quote 5-15mm --> Despite its length it is the single highest-stakes segment of artery in the body, because it must carry the entire left-ventricular supply before it splits — into two branches of nearly equal calibre:</p>
<ul>
  <li><b>Left Anterior Descending (LAD):</b> dives into the anterior interventricular groove and runs down the front of the heart toward the apex — the front wall and the anterior septum.</li>
  <li><b>Left Circumflex (LCx):</b> peels off at roughly a right angle into the left atrioventricular groove and wraps around toward the back — the lateral wall.</li>
</ul>
<p>When the bifurcation is instead a <b>trifurcation</b>, the middle vessel is the <b>ramus intermedius</b> (a large first diagonal that took its own ostium off the stem) — it behaves as, and is grafted like, a diagonal.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Because the left main is a short trunk feeding two huge territories, a tight stenosis here endangers the <b>LAD and LCx at once</b> — the reason "left main disease" is treated with special urgency and a lower stenosis threshold (&gt;50%) than other vessels. Note the third sinus, the <b>non-coronary sinus, has NO coronary ostium</b> — a favourite exam point and a landmark in aortic valve surgery.</p>
</div>`
    },
    {
      title: "LAD and Its Branches",
      html: `<p>The LAD is the workhorse of the coronary tree and the most commonly bypassed vessel in cardiac surgery — so it earns close attention. As it runs down the front of the heart it throws off two families of branches, one heading <em>inward</em> and one heading <em>sideways</em>, and knowing which is which lets you read an anterior MI backward from the ECG to the exact blocked segment.</p>
<ul>
  <li><b>Septal perforators (heading inward):</b> Cohn counts <b>three to five</b>, branching <em>perpendicularly</em> into the septum; the <b>first is the largest</b> and takes off just beyond the first diagonal. They supply the <b>anterior two-thirds of the interventricular septum</b>. Two practical consequences: that perpendicular take-off is the angiographer's marker for identifying the LAD, and because the septum carries the bundle branches, an LAD occlusion can produce bundle-branch block and — if the infarcted septum ruptures — a post-MI ventricular septal defect. The RCA's septal perforators feed the same septum from below, so the LAD is an important <b>collateral source</b> across the septum.</li>
  <li><b>Diagonal branches (heading sideways):</b> Cohn notes there may be <b>two to six</b>, running across the anterolateral wall; the first diagonal is generally the largest and is a graft target in its own right (and, taken off the stem, is the ramus intermedius).</li>
  <li><b>Right ventricular branches</b> (not always present) supply the anterior RV surface.</li>
</ul>
<p>Two anatomical variants worth knowing: in about <b>4% of hearts the LAD bifurcates proximally into two parallel vessels</b> down the anterior groove, and in some hearts the LAD wraps around the apex to feed the distal posterior groove (occasionally replacing the inferior interventricular artery). Put the territory together and you see why a proximal LAD occlusion earns the nickname <b>"widowmaker"</b>: it takes out the front wall, the anterior septum, and often the apex at once — an anterior STEMI with a real risk of severe LV dysfunction, cardiogenic shock, and the mechanical catastrophes (septal or free-wall rupture) that follow a large infarct.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>LAD = "Left, Anterior, Down."</b> It runs on the <b>L</b>eft, in the <b>A</b>nterior groove, and <b>D</b>ives <b>D</b>own to the apex. Its two branch types: <b>S</b>eptal perforators feed the <b>S</b>eptum; <b>D</b>iagonals cover the <b>D</b>iagonal (anterolateral) wall.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "The LAD artery gives off septal perforators and diagonal branches. What territory do the diagonal branches supply?",
      options: [
        "Anterolateral LV wall",
        "Posterior interventricular septum",
        "Inferior LV wall",
        "RV free wall"
      ],
      answer: 0,
      explain: "Diagonal branches (D1, D2) arise from the LAD and supply the anterolateral LV wall. Septal perforators supply the anterior two-thirds of the interventricular septum and are critical for conduction system perfusion. The posterior septum is supplied by the PDA (from the RCA in right-dominant systems)."
    },
    {
      title: "Left Circumflex and Right Coronary Artery",
      html: `<p>If the LAD owns the front of the heart, the <b>Left Circumflex (LCx)</b> owns the side. It curls away from the left main into the AV groove and wraps around the posterolateral surface. Its importance is easy to underrate next to the glamorous LAD, but two facts keep it relevant: circumflex disease shows up on echo as a lateral-wall motion abnormality that a beginner can miss, and in the minority who are <em>left-dominant</em> the LCx also feeds the bottom of the heart, making it a very large territory.</p>
<ul>
  <li><b>Obtuse marginal (OM) branches:</b> the LCx's primary branches, supplying the lateral LV wall <em>including the posteromedial papillary muscle</em> — common vein- or radial-graft targets.</li>
  <li><b>Termination:</b> in <b>85–95%</b> the circumflex simply peters out near the obtuse margin; in <b>10–15%</b> it continues all the way around to the crux to give the inferior interventricular artery — that is <em>left dominance</em>, and in those hearts it also supplies the AV node.</li>
  <li><b>SA nodal artery:</b> in <b>40–50%</b> of hearts it comes off the proximal circumflex (Cohn) — so a proximal LCx lesion can cause sinus node problems, not just a lateral MI.</li>
</ul>
<p>The <b>Right Coronary Artery (RCA)</b> comes off the right coronary sinus, runs anteriorly then descends in the right AV groove, and curves posteriorly at the acute margin. It is the great supplier of the heart's electrical hardware and its inferior wall:</p>
<ul>
  <li><b>Acute marginal branches</b> to the anterior RV free wall (before the crux).</li>
  <li><b>SA nodal artery</b> from the <em>proximal</em> RCA in <b>50–60%</b> of hearts. <!-- VERIFY: Cohn 5e SA node from proximal RCA 50-60% / Cx 40-50% -->.</li>
  <li>At the <b>crux</b> (in the 85–90% who are right-dominant) the RCA makes a characteristic <b>U-turn</b> and bifurcates into the inferior interventricular artery and the right posterolateral artery. The <b>AV nodal artery arises from the mid-point of that U</b> — which is precisely why an inferior (RCA) MI threatens AV conduction.</li>
  <li><b>Inferior interventricular ("posterior descending") artery</b> supplies the inferior wall and, via its inferior septal perforators, the <em>inferior third</em> of the septum.</li>
</ul>
<p>The RCA is also the heart's collateral reservoir: its <b>conus (infundibular) branch</b> arches over the RV outflow and can feed the LAD, and <b>Kugel's artery</b> (an anastomosis between the proximal RCA and circumflex running through the atrial septum to the crux) can keep the AV node perfused when the main supply fails.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>An inferior MI is an RCA event, and the RCA's two special passengers explain its two signature complications: it feeds the <b>AV node</b> (so watch for <b>AV block/bradycardia</b>) and the <b>RV free wall</b> (so watch for <b>RV infarction</b> — check for ST elevation in the right-sided lead V4R). RV infarcts are <em>preload-dependent</em>: give fluids, and <b>avoid nitrates and diuretics</b>, which will drop the preload the failing RV cannot spare.</p>
</div>`
    },
    {
      title: "Coronary Dominance",
      html: `<p>"Dominance" sounds like it should mean the biggest or most important artery, but Cohn is explicit that it is a narrow, precise term: <b>dominance refers to which artery gives rise to the inferior interventricular (posterior descending) artery at the crux — <em>not</em> the absolute mass of myocardium each side perfuses</b>. It is the answer to a single question — "who paves the back road?" That vessel also, by rule, supplies the AV node.</p>
<ul>
  <li><b>Right-dominant (85–90%):</b> the RCA crosses the crux and gives the PDA. An RCA occlusion therefore packages together an inferior MI, conduction disease (AV block), and the risk of RV infarction.</li>
  <li><b>Left-dominant (10–15%):</b> the circumflex reaches the crux and gives the PDA — Cohn notes this is <em>slightly more common in males</em>. Now the circumflex supplies the lateral <em>and</em> the inferior wall <em>and</em> the AV node — a huge territory on one vessel.</li>
  <li><b>Co-dominant:</b> the posteroinferior LV is shared, its supply "quite variable" between RCA and circumflex branches.</li>
</ul>
<p>One venous corollary makes dominance clinically double-edged in the OR. The <b>coronary sinus drains ~85% of the heart's venous blood</b>, lies in the posterior AV groove, and empties into the RA at the lateral border of Koch's triangle (guarded by the thebesian valve). Because the coronary <em>veins</em> are richly collateralised and nearly valveless, cardioplegia can be pushed <b>backward</b> through them (retrograde delivery) to protect territories that a dominant, occluded artery can no longer reach antegradely.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Left dominance turns the circumflex into a super-vessel: a single proximal LCx occlusion can infarct the <b>lateral + inferior + posterior</b> walls <em>and</em> take out both the sinus and AV nodes at once — a far larger, more electrically dangerous territory than the typical right-dominant RCA occlusion. Always note dominance before drawing conclusions about how much myocardium a given lesion threatens.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "In a right-dominant system (85% of people), a patient presents with inferior STEMI, AV block, and hypotension. What secondary complication involving the right heart should you immediately suspect?",
      options: [
        "Right ventricular infarction",
        "Anterior wall free rupture",
        "Papillary muscle rupture of the anterolateral muscle",
        "Aortic dissection"
      ],
      answer: 0,
      explain: "The RCA supplies the acute marginal branches to the RV free wall in right-dominant systems. Inferior STEMI from RCA occlusion is complicated by RV infarction in up to 30–40% of cases. Classic findings: hypotension, clear lungs, elevated JVP. Diagnosed with ST elevation in V4R. Management: preload (IV fluids), avoid nitrates and diuretics."
    },
    {
      title: "Papillary Muscles: Dual vs. Single Supply",
      html: `<p>Here is a small anatomical asymmetry with an outsized clinical payoff. The mitral valve is held shut by two papillary muscles, and they have very different insurance policies on their blood supply — which is the whole reason inferior MIs rupture papillary muscles far more often than anterior MIs do.</p>
<ul>
  <li><b>Anterolateral papillary muscle (APM) — double-insured:</b> fed by both the LAD's diagonals <em>and</em> the LCx's obtuse marginals. Two independent sources means both must fail before it dies, so it is relatively protected.</li>
  <li><b>Posteromedial papillary muscle (PMPM) — single-insured:</b> fed by only one source, the PDA (RCA in most people, LCx if left-dominant). With no back-up supply, any inferior/posterior MI can starve and rupture it.</li>
</ul>
<p>Think of it as a bridge held by two cables versus one: cut either cable on the two-cable side and the bridge still stands; cut the single cable and it drops. That single-cable muscle is why the timeline "inferior MI → new harsh murmur and shock a few days later" should reflexively make you think papillary rupture.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p><b>Posteromedial papillary muscle rupture</b> is a surgical emergency: sudden torrential mitral regurgitation, flash pulmonary edema, and cardiogenic shock, classically <b>2–7 days</b> after an inferior (RCA-territory) MI. The fix is emergent mitral surgery — medical therapy alone is a losing battle against acute severe MR.</p>
</div>`
    },
    {
      title: "CABG Surgical Targets",
      html: `<p>All of the anatomy above exists, for a surgeon, to be turned into a plan. On the day of a CABG the team reads the angiogram, names each significant stenosis by its territory, and decides which conduit goes where — and the shorthand spoken over the table is exactly the branch vocabulary from this lesson. Learn to hear it as a sentence: each phrase is "this conduit, to this named target, protecting this wall."</p>
<p>The common target sites and their logic:</p>
<ul>
  <li><b>LAD:</b> grafted distal to the disease in the anterior groove. The <b>LIMA-to-LAD</b> is the single most important, most durable graft in all of cardiac surgery — the anchor of the operation.</li>
  <li><b>Diagonals (D1, D2):</b> named by their order off the LAD; grafted when a diagonal carries a large anterolateral territory.</li>
  <li><b>Obtuse marginals (OM1, OM2):</b> the LCx's marginals on the lateral wall, classically taken with a saphenous vein graft (or radial).</li>
  <li><b>PDA / mid-RCA:</b> the inferior-wall territory, named positionally from the angiogram ("the mid-RCA," "the PDA").</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Decode a real operative note: <b>"LIMA to LAD, SVG to OM1, SVG to PDA"</b> is a standard three-vessel CABG — arterial conduit to the most important vessel (the front), and vein grafts to the side (OM1) and the bottom (PDA). Each graft answers one angiographic stenosis in one named territory.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "During a CABG, the surgeon targets 'the second OM.' What LV territory does this graft protect?",
      options: [
        "Anterior and anteroseptal wall",
        "Lateral LV wall",
        "Inferior wall",
        "Anterior septum"
      ],
      answer: 1,
      explain: "The obtuse marginal (OM) branches arise from the Left Circumflex (LCx) and supply the lateral and posterolateral LV wall. OM1 and OM2 are numbered sequentially from the origin of the LCx. Bypassing an OM revascularizes the lateral wall territory at risk from LCx disease."
    }
  ]
};

window.LESSONS["d1-conduction"] = {
  id: "d1-conduction",
  day: 1,
  ord: 3,
  title: "Conduction System & Cardiac Skeleton",
  short: "Conduction",
  minutes: 14,
  chunks: [
    {
      title: "The Conduction System: A Surgical Hazard Map",
      html: `<p>A surgeon studies the conduction system for the opposite reason an electrophysiologist does: not to <em>treat</em> arrhythmias but to avoid <em>creating</em> one. The wiring of the heart is a set of thin, invisible cables buried in tissue you are constantly sewing through, and the tragedy is that the damage is silent at the moment it happens — a suture placed a millimetre too deep near the AV node produces a perfectly normal-looking field and a patient who needs a permanent pacemaker.</p>
<p>So treat this lesson as a <b>hazard map</b> rather than a physiology lecture. Where the cables run tells you which sutures are dangerous, which retractor is pulling too hard, and why a handful of operations carry an inbuilt risk of heart block that must be planned for in advance. The recurring theme: the conduction axis hugs the tricuspid annulus, the membranous septum, and the non-coronary cusp — exactly the real estate of valve surgery.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Temporary epicardial <b>pacing wires are placed at the end of essentially every valve case</b> — not as an afterthought but because the suture lines sit next to conduction tissue, and post-op heart block is common enough that you plan an escape route in advance. They are the safety net while you wait to see whether the block is transient (from edema) or permanent.</p>
</div>`
    },
    {
      title: "SA Node: Location and Vulnerability",
      html: `<p>The sinoatrial (SA) node is the heart's natural pacemaker, and its location is unfortunate for a surgeon: it is a <b>spindle-shaped</b> structure lying at the <em>anterior and superior</em> end of the terminal groove, right where the superior vena cava meets the atrial appendage (Cohn) — precisely where the SVC cannula goes and where atrial incisions begin. Its position is not perfectly constant: in about <b>10% of people the node is draped across the cavoatrial junction in a "horseshoe"</b>, straddling the very tissue an SVC cannula or a superior atriotomy disturbs.</p>
<p>It runs on a single small feeder, the <b>SA nodal artery</b>, which arises from the <b>RCA in ~55%</b> of individuals and from the <b>circumflex in the remaining ~45%</b>. <!-- VERIFY: Cohn 5e gives SA nodal artery RCA ~55% / Cx ~45%; older teaching quotes 60/40 --> Whatever its origin, it typically travels forward <em>within the atrial myocardium</em> along the anterior interatrial groove toward the cavoatrial junction — an intramural course that is exactly why it is so easily caught. Uncommonly it arises more distally and crosses the atrial appendage (at risk in a standard right atriotomy) or runs across the dome of the left atrium (at risk in a superior approach to the mitral valve). Cohn's advice is to identify these vessels by gross inspection and modify the incision accordingly.</p>
<p>The node is therefore threatened in several everyday ways:</p>
<ul>
  <li><b>An SVC cannula placed too high</b> can compress or bruise the node directly, leaving the patient in sinus bradycardia or sinus arrest after the case.</li>
  <li><b>Right atrial or superior mitral incisions</b> carried toward the cavoatrial junction can transect an aberrant nodal artery.</li>
  <li><b>Proximal RCA or circumflex disease</b> can render the nodal artery ischemic, producing sick sinus syndrome.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>In the ~45% whose SA nodal artery arises from the <b>circumflex</b>, a proximal circumflex lesion causes a two-for-one hit: the expected lateral-wall MI <em>plus</em> sinus node dysfunction (bradycardia, sinus arrest). Always ask where the nodal artery comes from before attributing new bradycardia to the RCA alone.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient develops sinus bradycardia and sick sinus syndrome after a proximal LCx occlusion. What is the anatomical explanation?",
      options: [
        "An LCx-origin SA nodal artery has become ischemic",
        "The LCx supplies the AV node in every patient",
        "The bundle of His runs alongside the proximal LCx",
        "LCx thrombosis mechanically compresses the coronary sinus"
      ],
      answer: 0,
      explain: "In approximately 40% of people, the SA nodal artery arises from the proximal LCx rather than the RCA. Occlusion of the proximal LCx in these individuals can cause SA nodal ischemia resulting in sinus bradycardia, sick sinus syndrome, and sinus arrest — in addition to the lateral wall territory infarction."
    },
    {
      title: "AV Node: The Triangle of Koch",
      html: `<p>The atrioventricular (AV) node is the only electrical doorway between the atria and the ventricles — every beat has to pass through it, because the fibrous cardiac skeleton insulates the two halves everywhere else. Damage it and you sever the heart's atria from its ventricles: complete heart block. Its position is described by the most important landmark in the whole operation, the <b>Triangle of Koch</b>, and a surgeon who can picture that triangle can steer sutures around the node instead of into it.</p>
<p>The triangle is drawn by three real structures you can see inside the right atrium (Cohn):</p>
<ul>
  <li><b>Septal leaflet of the tricuspid valve</b> — one side.</li>
  <li><b>Tendon of Todaro</b> — the other side: a fibrous cord formed by the <em>junction of the Eustachian valve (of the IVC) and the Thebesian valve (of the coronary sinus)</em>, running toward the central fibrous body.</li>
  <li><b>Coronary sinus ostium</b> — the base.</li>
</ul>
<p>The floor of the triangle is the atrial wall of the atrioventricular muscular "sandwich," and it contains the <b>entire atrial component of the conduction axis</b>. The AV node sits toward the <b>apex</b>, and the penetrating bundle of His pierces the central fibrous body <em>at that apex</em> before branching onto the crest of the ventricular septum. A useful surgical line: joining the <b>apex of Koch's triangle to the medial (conal) papillary muscle</b> traces the course of the AV conduction axis — sew shallow anywhere along it. Any operation working in that corner threatens the node: tricuspid valve surgery, aortic valve replacement (the axis lies deep to the commissure between the non-coronary and right cusps), septal myectomy, VSD closure, and slow-pathway ablation all live in or beside Koch's triangle.</p>
<p>A related trap: the region looks like solid septum but the "atrioventricular septum" is really that same <b>sandwich</b> of atrial and ventricular walls with AV-groove fat between them — not a plate you can safely cut through. The truly septal structure here is the <b>membranous septum</b>, itself divided by the attachment of the tricuspid septal leaflet into an atrioventricular part (between RA and LV) and an interventricular part.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>A suture bitten too deeply at the <b>non-coronary cusp annulus</b> during AVR can catch the AV node or His bundle and drop the patient into <b>complete heart block</b> — roughly <b>1–3% after surgical AVR</b>, and higher (<b>up to ~8–20%</b> depending on valve type) after TAVR, where the expanding frame presses on the same spot. This is why every AVR patient leaves with pacing wires.</p>
</div>`
    },
    {
      title: "His Bundle and Bundle Branches",
      html: `<p>Past the AV node, the signal travels down a single insulated cable — the <b>Bundle of His</b> — which pierces the central fibrous body at the apex of Koch's triangle and then runs along the crest of the muscular interventricular septum before splitting into the two bundle branches. Because it is forced to squeeze through dense fibrous tissue at a fixed point, it cannot dodge a suture; anything working on the membranous septum is working next to the His bundle.</p>
<p>Cohn's dissections locate the axis precisely: it descends on the <b>left-ventricular aspect of the muscular septum, just beneath the membranous septum</b>, running along the crest before dividing. Two consequences follow. First, the bundle is <em>subendocardial on the LV side</em> — so it is threatened from the aortic/left-sided approach (deep sub-commissural sutures) far more than most trainees expect. Second, the branches then diverge with very different geometry:</p>
<ul>
  <li><b>Left bundle branch:</b> fans out like a broad sheet just under the endocardium on the LV side of the septum — a wide target, which is why left-sided septal work (myectomy) tends to produce <em>left</em> bundle branch block.</li>
  <li><b>Right bundle branch:</b> stays a discrete, narrow cord and dives into the <b>septomarginal trabeculation (moderator band)</b> toward the RV's anterior papillary muscle. Being a thin, isolated cord makes it easy to interrupt with a single stitch — which is why aortic/right-cusp work and VSD closure classically produce <em>right</em> bundle branch block.</li>
</ul>
<p>Operations that put the axis at risk are the ones that cut or sew near the crest of the septum and the membranous septum: VSD repair (buttress sutures on the RV side, to the right of the crest), septal myectomy (the Morrow procedure for HOCM), and deep sutures at the non-coronary/right-coronary commissure at SAVR. The membranous septum is the shared landmark for all three — it is the roof over the penetrating bundle.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>The AV node lives in a triangle — remember its three walls as "Tricuspid, Todaro, Coronary sinus."</b> Tricuspid annulus, Tendon of Todaro, and the Coronary sinus ostium bound the Triangle of Koch, with the node at its apex. See those three, and you know exactly where <em>not</em> to place a deep stitch.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "During tricuspid valve repair, sutures are placed along the septal annulus just superior to the coronary sinus ostium. Which structure is most at risk?",
      options: [
        "SA node",
        "Right bundle branch in the moderator band",
        "Left bundle branch",
        "AV node"
      ],
      answer: 3,
      explain: "The AV node lies at the apex of the Triangle of Koch, just superior to the coronary sinus ostium and adjacent to the septal tricuspid annulus. Deep sutures in this posteroseptal danger zone can injure the AV node and cause heart block; the anterior annulus is not the relevant landmark."
    },
    {
      title: "The Cardiac Skeleton and Its Surgical Significance",
      html: `<p>The heart has no bones, but it does have a skeleton — a fibrous framework that does two jobs at once. First, it is the <b>anchor</b>: the four valve annuli are rings of this tough tissue, and every valve prosthesis is sewn into them because only the annulus will hold a stitch. Second, it is the <b>insulator</b>: it electrically separates the atria from the ventricles so completely that the AV node and His bundle are the only way current can cross. That dual role — mounting point <em>and</em> insulation — is why the skeleton is where valve surgery and conduction danger overlap.</p>
<p>Cohn's dissections show it is not a complete ring but a <b>limited fibrous scaffold</b>, and knowing its parts tells you where the tissue is strong enough to hold a stitch and where danger hides beneath. Its keystone is the <b>central fibrous body</b> — the point where the leaflets of the aortic, mitral <em>and</em> tricuspid valves all converge. It is built from two components: the <b>right fibrous trigone</b> (the thickened right end of the aortic–mitral fibrous continuity) and the <b>membranous septum</b>. Two thickenings, the <b>right and left fibrous trigones</b>, sit at the ends of the aortic–mitral curtain and are the strong points the mitral annulus actually hangs from. Everywhere else the "annulus" is far flimsier — which is exactly why annular dilation happens at the mural (posterior) mitral and the anteroposterior tricuspid, away from the trigones.</p>
<p>Three consequences for the operating surgeon:</p>
<ul>
  <li>Prosthesis sutures must engage <b>the annulus itself</b>, not the softer tissue around it — some of which is conduction tissue.</li>
  <li>The <b>aortic–mitral fibrous continuity</b> physically links the aortic valve (left and non-coronary cusps) to the anterior mitral leaflet, so a root operation can distort the mitral valve, and vice versa — the two valves are literally sewn to the same curtain of tissue.</li>
  <li>The <b>central fibrous body</b> is where the His bundle crosses — the most dangerous square millimetre in valve surgery.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Because the His bundle threads the <b>central fibrous body</b>, it is at risk in VSD repair, septal myectomy, and deep AVR sutures — and heart block from a divided His bundle does not recover, so it commits the patient to a <b>permanent pacemaker</b>. The transient block from local edema, by contrast, often resolves in days: the pacing wires buy you the time to tell them apart.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Cardiac surgeons routinely place temporary pacing wires at the end of all valve cases. What is the primary anatomical reason for this practice?",
      options: [
        "The anesthesia may cause prolonged sinus bradycardia",
        "Valve prostheses always cause tachyarrhythmias",
        "Valve sutures lie near the AV node and His bundle",
        "Pacing wires are required for hemostasis monitoring"
      ],
      answer: 2,
      explain: "The AV node sits in the Triangle of Koch, adjacent to the tricuspid annulus and coronary sinus ostium. The His bundle penetrates the central fibrous body immediately deep to the NCC of the aortic valve. Any valve suture placed too deeply in these regions risks AV nodal or His bundle injury with resulting heart block. Temporary pacing wires provide a bridge until it is clear whether permanent pacing will be needed."
    }
  ]
};

window.LESSONS["d1-valves-anat"] = {
  id: "d1-valves-anat",
  day: 1,
  ord: 4,
  title: "Valve & Annular Anatomy",
  short: "Valves",
  minutes: 16,
  chunks: [
    {
      title: "The Aortic Root: A Complex Structure",
      html: `<p>Calling the aortic root "the aortic valve" is like calling a doorway "the door" — it misses the frame that makes it work. The root is a functional unit with four parts working together, and aortic valve competence depends on all of them holding their shape. It is worth learning as a stack, from the ventricle up: the <b>annulus</b> (the base ring the cusps hang from), the three <b>cusps</b> themselves, the three bulging <b>sinuses of Valsalva</b> that house them, and the <b>sinotubular junction</b> at the top where the bulges flatten back into the tubular ascending aorta. This whole unit is the foundation of aortic surgery and the object every TAVR plan is built around.</p>
<ul>
  <li><b>Three sinuses of Valsalva:</b> right coronary sinus, left coronary sinus, and non-coronary sinus — pockets that catch backflow and swirl blood into the coronaries during diastole.</li>
  <li><b>Three cusps:</b> right coronary cusp (RCC), left coronary cusp (LCC), non-coronary cusp (NCC).</li>
  <li><b>Fibrous annulus:</b> the crown-shaped ring the cusps attach to and the anchor for any prosthesis.</li>
  <li><b>Sinotubular junction (STJ):</b> the ridge where sinuses become tube; dilate it (as in a root aneurysm) and the cusps are pulled apart, causing aortic regurgitation even with normal leaflets.</li>
</ul>
<p>The reason the aortic root is the crossroads of the heart is its <b>wedged, central position</b>: Cohn's short-axis dissections show the aortic valve related to <em>all four chambers</em>, in fibrous continuity with the anterior mitral leaflet through the two fibrous trigones, and sitting directly over the conduction axis. So the "annulus" is not a flat circle — it is a <b>crown-shaped (coronet) line of attachment</b>, and between the bases of adjacent cusps the wall thins into <b>interleaflet triangles</b> that are aortic wall, not ventricle. This geometry explains the operative hazards clockwise around the root: the <b>NCC–RCC commissure</b> overlies the membranous septum and His bundle (heart block), the region beneath the NCC and LCC is continuous with the <b>anterior mitral leaflet</b> (a root abscess or an oversized annular enlargement can distort the mitral valve), and the <b>left main</b> arises just above the left sinus.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>The <b>non-coronary sinus has NO coronary ostium</b> — a perennial exam point. Coronary ostia arise <em>only</em> from the right and left coronary sinuses. This is also the orientation trick in the OR: the sinus with no artery coming off it is the non-coronary one, and the AV node/His bundle sit behind the NCC–RCC commissure just beneath it.</p>
</div>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Because the mid-portion of the anterior mitral leaflet lies against the commissure between the <b>non- and left-coronary cusps</b>, an incision there can be carried down to <b>enlarge a small aortic annulus</b> (the Manouguian-type approach) — the same fibrous continuity that is a hazard in one operation is a deliberate door in another.</p>
</div>`
    },
    {
      title: "Coronary Ostia Heights and TAVR Safety",
      html: `<p>How high the coronary ostia sit above the valve is the sort of measurement that sounds like trivia until you realise a TAVR valve is deployed <em>inside</em> this space. The TAVR frame does not remove the diseased native leaflets — it crushes them outward against the sinus wall. If the ostia sit low, those shoved-aside calcified leaflets can slap up over a coronary opening like a curtain drawn across a window, cutting off the artery the instant the valve is released.</p>
<ul>
  <li><b>Right coronary ostium:</b> off the right sinus, typically <b>14–17 mm</b> above the annulus.</li>
  <li><b>Left main ostium:</b> off the left sinus, typically <b>12–17 mm</b> above the annulus.</li>
</ul>
<p>This is why every TAVR is planned on a gated CT that specifically measures the coronary ostial heights and the sinus width. A <b>low ostium (left main &lt; 10–12 mm)</b> plus <b>shallow sinuses</b> is the danger combination — little room for the displaced leaflet to fall away from the coronary — and it may push the team toward surgery, a different valve, or a protective "chimney" stent.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p><b>TAVR coronary obstruction</b> announces itself as <b>sudden hemodynamic collapse the moment the valve is deployed</b> — ST elevation, arrhythmia, and a crashing blood pressure. Prevention is the pre-op CT; rescue is an emergent coronary wire and stent already staged, with CABG as backup. Because the window to act is seconds, a high-risk anatomy is identified <em>before</em> the case, not during it.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient undergoing TAVR suddenly develops hemodynamic collapse immediately after valve deployment. What complication should be suspected first?",
      options: [
        "Ventricular fibrillation from pacing wire",
        "Aortic dissection from balloon predilation",
        "Complete heart block",
        "Coronary ostial obstruction"
      ],
      answer: 3,
      explain: "Coronary ostial obstruction is a feared TAVR complication that manifests as sudden hemodynamic collapse immediately after valve deployment. The TAVR frame, when positioned too low, can push the native calcified leaflets outward to block the coronary ostia. The right and left main coronary ostia are typically 12–17 mm above the annulus, and CT planning measures these heights to predict risk."
    },
    {
      title: "The Mitral Valve Complex",
      html: `<p>The mitral valve is not a flap but a machine — a coordinated apparatus of six moving parts working like a parachute: the leaflets are the canopy, the chordae are the cords, and the papillary muscles are the hands gripping the cords from below, all mounted on the annular ring. A parachute only works if canopy, cords, and hands all pull together; likewise, failure of <em>any</em> one mitral component leaks. This is exactly why surgeons fight to <b>repair</b> the valve rather than replace it — repair keeps the whole apparatus (and the LV geometry it supports) intact.</p>
<ul>
  <li><b>Anterior leaflet (AML):</b> the big sail — one-third of the annular circumference but two-thirds of the valve area. It hangs in continuity with the aortic valve through the aortic–mitral curtain.</li>
  <li><b>Posterior leaflet (PML):</b> smaller and scalloped into P1–P2–P3; the usual site of degenerative prolapse (a flail P2 is the classic repair).</li>
  <li><b>Mitral annulus:</b> a 3-D saddle shape — fibrous anteriorly (against the aortic root), muscular posteriorly (where it dilates). An annuloplasty ring exists to shrink and re-saddle it.</li>
  <li><b>Chordae tendineae:</b> primary chords to the leaflet free edge (make the seal), secondary to the body, tertiary to the posterior base — the cords of the parachute.</li>
  <li><b>Two papillary muscles:</b> Cohn places them in <b>superolateral (anterolateral)</b> and <b>inferoseptal (posteromedial)</b> positions. The anterolateral has a <em>dual</em> supply (LAD diagonals + circumflex marginals) and is protected; the posteromedial is fed by a <em>single</em> source (RCA/PDA, or a dominant circumflex) — the one that ruptures after an inferior MI.</li>
</ul>
<p>Two sourced points sharpen the surgical picture. First, the annulus proper is a <b>dense collagenous band that hangs off the two fibrous trigones</b> — the thickened ends of the aortic–mitral fibrous continuity — which is why the anterior (aortic) leaflet's annulus is the strong, fibrous part and the mural leaflet's annulus is the weaker, dilation-prone part. Second, the mitral valve is boxed in by structures that punish a deep stitch: the <b>circumflex coronary artery runs adjacent to the <em>left half</em> of the mural leaflet</b>, the <b>coronary sinus adjacent to its <em>right half</em></b>, and the AV node/penetrating bundle sit at the trigone end near the aortic leaflet. When the circumflex is dominant, the <em>entire</em> mural-leaflet attachment can be intimately draped by the artery.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Even when you must <em>replace</em> the mitral valve, preserve the subvalvular apparatus (chords + papillary muscles). Those cords tether the LV walls; cut them all and the ventricle loses its scaffolding, dilates, and drops its EF. "Chordal-sparing" replacement protects postoperative LV function.</p>
</div>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Because the circumflex hugs the left half of the mural leaflet, an <b>over-deep annuloplasty or replacement suture</b> there can kink or occlude it — watch the post-bypass TEE for a new lateral/inferolateral wall-motion abnormality. On the right half, the same mistake tears the coronary sinus; at the anterior trigone, it catches the conduction axis.</p>
</div>`
    },
    {
      title: "Tricuspid and Pulmonic Valve Anatomy",
      html: `<p>The tricuspid valve is often dismissed as the "forgotten valve," but it repays close study for one reason: it is the valve most often pulled open by <em>functional</em> (secondary) regurgitation, where the leaflets are normal and it is the dilating right ventricle and annulus that stop them meeting. Understanding that its problem is usually the ring, not the leaflets, is what makes annuloplasty — rather than replacement — the mainstay of tricuspid repair.</p>
<ul>
  <li><b>Three leaflets:</b> anterior (largest), posterior (mural), and septal (smallest). The defining feature Cohn stresses is that the tricuspid septal leaflet has <b>direct chordal attachments to the ventricular septum</b> — unlike the mitral valve, which has none — and those attachments sit right over the AV node and penetrating bundle. That direct septal anchoring is both the tricuspid's identifying feature on echo <em>and</em> its built-in booby trap.</li>
  <li><b>Annulus:</b> larger, more nearly circular, and far less supported than the mitral annulus (it lacks the strong trigone/fibrous-continuity backing) — so in functional TR it dilates readily, mainly in the anteroposterior/free-wall direction, which is exactly what a ring is shaped to cinch back down.</li>
  <li><b>Right ventricle:</b> think of it in Cohn's three parts — an <b>inlet</b> around the tricuspid apparatus, a heavily trabeculated <b>apical</b> portion (carrying the septomarginal trabeculation/moderator band with the right bundle), and a smooth <b>outlet (infundibulum)</b> leading to the pulmonary valve.</li>
  <li><b>Triangle of Koch</b> sits in the septal-leaflet region, so any stitch along the septal annulus is a stitch near the node.</li>
</ul>
<p>The <b>pulmonic valve</b> — three semilunar cusps guarding the RV outflow tract, and the only valve with no fibrous continuity to any other valve (it is separated from the tricuspid by the muscular infundibulum, and from the aortic valve by the transverse sinus) — is the valve adults almost never need operated. It matters mostly in congenital work: tetralogy of Fallot repair, and the Ross procedure, where the patient's own pulmonary valve is moved into the aortic position.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>The <b>septal leaflet of the tricuspid valve</b> sits over the AV node and His bundle. Tricuspid annuloplasty sutures along the septal annulus carry the highest conduction risk of any tricuspid stitch — many surgeons keep them shallow or deliberately leave the ring incomplete over that segment.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "During mitral valve replacement, the surgeon preserves the chordae tendineae and papillary muscles. What is the primary physiological benefit of this technique?",
      options: [
        "Preserved LV geometry and function",
        "It reduces the risk of endocarditis",
        "It prevents atrial fibrillation",
        "It allows future valve-in-valve procedures"
      ],
      answer: 0,
      explain: "Preserving the subvalvular apparatus (chordae tendineae and papillary muscles) during mitral valve replacement is critical for maintaining LV geometric integrity. The papillary muscles help tether the LV walls and contribute to efficient LV contraction. Resecting the apparatus disrupts this geometry, reducing stroke volume and EF after surgery. This is a major reason surgeons prefer repair over replacement whenever possible."
    },
    {
      title: "Aortic Root Relationships and Surgical Access",
      html: `<p>The aortic root sits at the crossroads of the heart, so each of its three cusps looks out onto a different at-risk neighbour — and a surgeon replacing the aortic valve is, in effect, sewing along a ring where every clock position has its own hazard. Memorise the valve as three cusps, each with one thing behind it:</p>
<ul>
  <li><b>Non-coronary cusp (NCC):</b> behind it, in the aortic–mitral continuity, lies the <b>AV node</b>. A deep NCC bite is the classic cause of post-AVR complete heart block.</li>
  <li><b>Right coronary cusp (RCC):</b> behind it, the membranous septum and <b>His bundle / right bundle branch</b>.</li>
  <li><b>Left coronary cusp (LCC):</b> above it, the <b>left main ostium</b> — sutures here must not kink or occlude the left coronary.</li>
</ul>
<p>Two operative consequences follow. In open AVR the surgeon keeps the coronary ostia in direct view and, with the root open, often delivers cardioplegia straight into them to keep the heart protected. In TAVR the same ostia are the danger from a different direction: fluoroscopy and TEE must confirm the frame is not deployed so low that it obstructs a coronary.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>NCC = "No Coronary, but Near Conduction."</b> The <b>N</b>on-coronary cusp has no coronary ostium but overlies the AV node. The other two are named for what they feed: <b>RCC</b> → <b>R</b>ight <b>C</b>oronary ostium, <b>LCC</b> → the <b>L</b>eft main. Cusp name tells you both the coronary and the hazard behind it.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "During aortic valve replacement, a suture is placed deeply at the non-coronary cusp annulus. Which structure is most at risk and what is the consequence?",
      options: [
        "Left main coronary artery; acute coronary occlusion",
        "Left atrium; atrial perforation",
        "Pulmonary artery; pulmonary hypertension",
        "AV node and His bundle; complete heart block"
      ],
      answer: 3,
      explain: "Deep to the non-coronary cusp, in the region of the aortic-mitral fibrous continuity and adjacent membranous septum, lies the AV node. Sutures placed too aggressively here during AVR can injure the AV node or penetrating His bundle, causing complete heart block. This is why pacing wires are placed after all valve cases and why the incidence of heart block after SAVR is approximately 1–3% (and up to 8% after TAVR)."
    }
  ]
};

/* ==== Senior (L4) and Mastery (L5) layers merged into the existing Day-1 lessons ==== */

window.LESSONS["d1-coronaries"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: dominance is an operational fact, not a label",
    html: `<p>"Right-dominant in about 85–90%, left-dominant in about 7–8%, co-dominant in the rest" is a med-student sentence until you attach the consequence. <b>Whoever gives off the posterior descending artery (PDA) supplies the inferior wall and, through the AV nodal artery, the AV node.</b> That single relationship drives three senior-level facts:</p>
<ul>
  <li>An <b>inferior STEMI in a right-dominant heart</b> threatens AV-nodal block (the RCA feeds the node) — which is why inferior infarcts come with bradyarrhythmia and why the RCA/PDA territory is worth grafting even when the vessel looks small.</li>
  <li>In a <b>left-dominant</b> system the circumflex continues all the way to the crux and gives the PDA — so a circumflex lesion now jeopardises the inferior wall <i>and</i> the conduction supply, and the circumflex runs its whole course close to the mitral annulus (see the valve lesson).</li>
  <li>The <b>LAD is frequently intramyocardial</b> (a myocardial bridge or a deeply buried mid-LAD): the surgeon planning the anastomosis must find the vessel in the fat/muscle, and a deep, bridged segment changes where the arteriotomy is safely made.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Read dominance off the angiogram before you plan grafts: it tells you which vessel owns the inferior wall and the AV node, which target carries conduction risk, and whether the distal RCA/PDA deserves a graft.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the circumflex at the mitral annulus",
    html: `<p><b>Viva-grade relationship:</b> the circumflex runs in the left atrioventricular groove within roughly <b>3–4 mm</b> of the posterior (P1/lateral) mitral annulus, and it is <b>closest at the lateral annulus in the left-dominant heart</b>, where it reaches the crux. A deep annuloplasty or replacement bite at the lateral annulus can kink, purse-string, or transect it.</p>
<p>The senior does four things with that fact, in sequence:</p>
<ol>
  <li><b>Modifies the bite</b> — shallow and angled slightly away from the groove at the lateral annulus, rather than deep radial bites.</li>
  <li><b>Reads the post-bypass TEE</b> for a <b>new lateral (or inferolateral) wall-motion abnormality</b>, the earliest sign the artery was caught.</li>
  <li><b>Confirms mechanically</b> — inspects the vessel, checks for kinking under the ring.</li>
  <li><b>Rescues</b> — if the circumflex is compromised, the options are an <b>on-pump vein graft to the injured segment</b> or, in the right setting, <b>PCI to the circumflex</b>; the ring may need to be revised or replaced.</li>
</ol>
<div class="kbox danger">
  <div class="kbox-tag">WHY "STAY SUPERFICIAL" ISN'T ENOUGH</div>
  <p>The standard teaching is necessary but not sufficient: dominance changes the artery's proximity, a heavily calcified annulus forces deeper bites, and the only proof you stayed out of it is the post-bypass wall motion. A senior teaches the junior <i>why</i> the rule exists and what to do when anatomy forces a violation of it.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "During a mitral annuloplasty in a left-dominant patient, a deep bite is placed at the lateral (P1) annulus and the post-bypass TEE shows a new inferolateral wall-motion abnormality. What has most likely happened and what is the rescue?",
    options: [
      "Air embolism to the LAD; raise perfusion pressure and observe",
      "Circumflex injury; return to bypass for urgent revascularization",
      "Expected stunning after mitral repair; no action needed",
      "RCA injury; the ring cannot affect the circumflex"
    ],
    answer: 1,
    explain: "The circumflex lies within a few millimetres of the lateral mitral annulus and is closest in the left-dominant heart. A deep lateral bite can kink or occlude it, producing a new lateral/inferolateral wall-motion abnormality on the post-bypass TEE. The rescue is to go back on pump and revise — a vein graft to the injured segment or PCI — rather than accept it as stunning."
  }
);

window.LESSONS["d1-conduction"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the conduction axis as a surgical constraint across four operations",
    html: `<p>The AV node sits at the apex of Koch's triangle (bounded by the tendon of Todaro, the coronary-sinus os, and the septal tricuspid annulus); the His bundle penetrates the central fibrous body at the membranous septum, directly beneath the commissure between the <b>non-coronary and right-coronary cusps</b>. That geometry constrains four different operations, and the senior modifies technique for each:</p>
<ul>
  <li><b>SAVR:</b> keep annular bites at the NCC/RCC nadir <b>shallow and angled outward</b>; decalcify the septal annulus down to healthy tissue <b>without gouging into it</b>. Deep bites here are the classic mechanism of post-AVR complete heart block.</li>
  <li><b>VSD closure:</b> place sutures buttressed on the <b>right-ventricular side, to the right of the septal crest</b>, keeping the needle away from the His as it runs along the posteroinferior rim of a perimembranous defect.</li>
  <li><b>Tricuspid annuloplasty:</b> the AV node sits at the <b>apex of Koch's triangle</b> near the septal leaflet–coronary-sinus region; sutures there are kept shallow, and some rings are deliberately interrupted at that segment.</li>
  <li><b>Septal myectomy:</b> the resection plane is kept toward the LAD side of the septum; a <b>new left bundle branch block is common</b> after myectomy (the mirror of the RBBB that TAVR/aortic work causes).</li>
</ul>
<p>The quantitative anchor: complete heart block requiring a permanent pacemaker occurs in roughly <b>3–6%</b> after isolated SAVR (about <b>4% by 30 days</b>), and is higher with heavy annular calcification, pre-existing right bundle branch block, a small or bicuspid annulus, and endocarditis with a root abscess. <!-- VERIFY: SAVR PPM ~3-6% (early ~4%), risk factors per NHR/registry data -->`
  },
  {
    level: 5,
    title: "PGY-5 mastery: recovery biology and the pacemaker decision, SAVR vs TAVR",
    html: `<p><b>Viva summit:</b> block appearing intraoperatively or early may be <b>transient, from edema</b>, and can recover over days — hence an <b>observation window of about 5–7 days</b> of temporary pacing before committing to a permanent device. What predicts <i>non</i>-recovery: <b>persistent complete block</b>, and <b>new persistent left bundle branch block with a prolonged His–ventricular interval</b>.</p>
<p>The device comparison the senior commands: the permanent-pacemaker burden is <b>markedly device-dependent</b>. For the balloon-expandable valve in PARTNER 3 it is about <b>6.5% at 30 days</b> (versus surgical ~4%); for the supra-annular <b>self-expanding</b> valve in Evolut Low Risk it is roughly <b>20% or more</b>, most within the first two years. <!-- VERIFY: PARTNER 3 PPM ~6.5% at 30d; Evolut self-expanding ~20%+ cumulative --> That higher TAVR pacemaker burden is a real input into a borderline SAVR-versus-TAVR conversation, especially in a younger patient who will live with the device for decades.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE HEMODYNAMIC TRAP</div>
  <p>The stiff, hypertrophied, previously pressure-overloaded LV of an AS patient is exquisitely <b>preload- and AV-synchrony-dependent</b>. Pacing that abandons the atrial kick (VVI) can drop cardiac output sharply — the paced patient needs <b>DDD to preserve AV synchrony</b>, not simply a ventricular backup.</p>
</div>
<p>The senior can teach the whole chain — the anatomy at the membranous septum, the suture technique that respects it, the edema-versus-scar recovery biology, and the device decision — and defend the pacemaker-timing choice to an examiner three levels deep.</p>`
  },
  {
    type: "checkpoint",
    q: "Three days after SAVR a patient remains in complete heart block, currently paced. Why is the usual approach to observe rather than implant a permanent pacemaker immediately?",
    options: [
      "Permanent pacemakers cannot be placed within a week of surgery",
      "Early postoperative conduction edema may resolve over 5–7 days",
      "Complete heart block after SAVR always resolves within 24 hours",
      "The pacing wires must be removed before any permanent device is considered"
    ],
    answer: 1,
    explain: "Block appearing early after AVR is frequently transient from peri-annular edema and can recover over about 5–7 days, so a temporary-pacing observation window is standard. Features predicting non-recovery — persistent complete block, or new persistent LBBB with a prolonged His–ventricular interval — push toward committing to a permanent device."
  }
);

window.LESSONS["d1-chambers"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: what is actually behind the sternum, and the redo read",
    html: `<p>In a first-time chest the <b>right ventricle</b> lies immediately behind the sternal table, with the RV outflow and ascending aorta just deep to it. In a redo, prior pericardial scar can plaster three things to the back of the bone: the <b>RV free wall</b>, a <b>patent graft</b> (classically a LIMA pedicle crossing to the LAD), and a <b>dilated ascending aorta</b> — any of which the saw can lacerate before the chest is open.</p>
<p>The <b>transverse sinus</b> (behind the aorta and pulmonary trunk, in front of the atria) and the <b>oblique sinus</b> (behind the left atrium) are the reflections you pass a tape or clamp through around the great vessels; their obliteration by adhesions is part of what makes a redo slow and bloody.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE REDO QUESTION ANSWERED BEFORE YOU SCRUB</div>
  <p>On the gated CT: is any structure (RV, graft, aorta) adherent to or within a few millimetres of the posterior sternal table, and where does the LIMA pedicle run? If yes — you expose a femoral or right axillary vessel and are ready to go on bypass <b>before</b> the saw touches bone.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the reoperative hazard map and the three catastrophic rescues",
    html: `<p><b>Viva summit:</b> <i>"Reoperative sternotomy for a redo AVR with a patent LIMA-to-LAD graft — how does the CT change your plan, and what do you do if you enter the RV on opening?"</i> The answer is a sequence.</p>
<p><b>The plan:</b> read the retrosternal distance of RV/aorta/each graft, the course of the LIMA, and the aortic calibre and calcification; if anything is adherent, <b>expose and be ready to cannulate a femoral or axillary vessel before re-entry</b>, and divide the sternum with an <b>oscillating saw that takes the anterior table first, then the posterior table is lifted and divided under vision</b> while an assistant elevates the edges — never one blind pass through both tables. Cooling on peripheral bypass before opening means that if you enter a chamber you are already on a decompressed heart.</p>
<p><b>The three rescues, each ordered:</b></p>
<ul>
  <li><b>RV laceration:</b> finger control and pack → go on (peripheral) bypass to decompress the RV → repair the flaccid wall with pledgeted horizontal-mattress sutures. Never suture a full, high-pressure, beating ventricle.</li>
  <li><b>Patent-graft (LIMA) avulsion:</b> expect LAD-territory ischaemia → go on bypass → <b>on-pump revision or re-grafting</b> of that territory, not hope that a torn in-situ graft holds.</li>
  <li><b>Ascending-aortic entry:</b> control and pack → peripheral bypass and cool → complete the repair under <b>hypothermic circulatory arrest</b> with an open aorta.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">THE COMMON THREAD</div>
  <p>Every rescue routes through one principle: <b>get on bypass and decompress before you repair.</b> The prepared groin — decided before the incision — is what makes that possible in seconds.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "The gated CT before a redo AVR shows the ascending aorta densely adherent to the posterior sternal table. What is the most appropriate step before sternal re-entry?",
    options: [
      "Proceed with a standard single saw pass and react if bleeding occurs",
      "Cancel the operation permanently",
      "Prepare peripheral bypass access before re-entry",
      "Divide the sternum faster to minimise the time at risk"
    ],
    answer: 2,
    explain: "When the CT shows an adherent aorta (or RV or graft), the safe path is to establish, or be fully prepared for, peripheral cannulation before re-entry, and to divide the posterior table under vision. That converts a potential exsanguination into a controlled rescue on a decompressed, coolable heart."
  }
);

window.LESSONS["d1-valves-anat"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the aortic root as a single unit",
    html: `<p>The aortic root is not "the valve" — it is a unit the senior holds as a set of related structures and measurements:</p>
<ul>
  <li>The <b>virtual basal ring (annulus)</b> — the surgical/sizing plane.</li>
  <li>Three <b>sinuses of Valsalva</b>, with the <b>coronary ostia</b> arising from the left and right sinuses. Ostial heights are typically about <b>13–15 mm</b> above the annulus; the danger is a <b>low ostium</b> (a high-risk cutoff is roughly <b>&lt; 12 mm</b>, and left-main ostial height below about <b>11 mm</b>), which a bulky supra-annular prosthesis or a low transcatheter deployment can obstruct. <!-- VERIFY: coronary ostial danger cutoff ~<12 mm, LM <~11 mm per TAVR CT literature --></li>
  <li>The <b>sinotubular junction</b> and the <b>three commissures</b>.</li>
  <li>The <b>fibrous aortomitral curtain</b>, continuous with the anterior mitral leaflet — which is why deep work at the NCC can involve the mitral valve, and why root abscess can destroy both.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Measure ostial height and sinus depth on the gated CT before any root case. Once the aorta is open, deliver cardioplegia by <b>direct ostial cannulation</b> — an open, incompetent root cannot hold a column of antegrade cardioplegia.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the SAVR annulus, step by step, with its hazards",
    html: `<p><b>Viva-grade sequence.</b> Seating a prosthesis in the calcified aortic annulus is a series of decisions, each with a hazard and a rescue:</p>
<ol>
  <li><b>Decalcify</b> the annulus to healthy tissue <b>without perforating</b> into the LVOT or the aortomitral curtain — over-aggressive decalcification causes annular disruption or a LV–aortic discontinuity that must be repaired with a patch.</li>
  <li><b>Size to avoid patient–prosthesis mismatch:</b> predict the indexed effective orifice area — <b>moderate mismatch below ~0.85 cm²/m², severe below ~0.65 cm²/m²</b> — worst in the small, active, or low-EF patient. If the annulus is smaller than the valve you sized for, the decision tree is: accept the mismatch, choose a supra-annular/modern externally-mounted valve to buy orifice, or perform a <b>posterior annular enlargement (Nicks/Manouguian)</b>.</li>
  <li><b>Respect the conduction axis</b> at the NCC/RCC commissure (shallow, outward-angled bites).</li>
  <li><b>Protect the coronary ostia</b> — a low ostium under a bulky prosthesis obstructs the coronary; the rescue is a lower-profile valve or button reimplantation.</li>
  <li><b>De-air obsessively</b> before unclamping — air rises into the anterosuperior RCA and stuns the inferior wall.</li>
</ol>
<div class="kbox danger">
  <div class="kbox-tag">THREE HAZARDS AT THIS STEP</div>
  <p><b>Annular rupture</b> (decalcify gently; patch repair), <b>coronary ostial obstruction</b> (measure ostial height; direct ostial protection), and <b>complete heart block</b> (shallow NCC/RCC bites). Each is anticipated at the step where it arises, not listed as a complication afterward.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "You open a 62-year-old's aortic root for SAVR and the annulus measures smaller than the valve you sized for, in an active patient at risk of patient–prosthesis mismatch. Which is NOT an appropriate option?",
    options: [
      "Perform a posterior annular enlargement (Nicks or Manouguian)",
      "Forcing an oversized valve into the annulus",
      "Choose a supra-annular or modern externally-mounted valve to gain effective orifice area",
      "Accept a mild degree of mismatch after weighing it against the patient's size and activity"
    ],
    answer: 1,
    explain: "Forcing a valve in with deep radial bites risks annular rupture and complete heart block and does not actually solve mismatch. The legitimate options are annular enlargement, a supra-annular/externally-mounted valve to gain indexed effective orifice area, or accepting a mild mismatch after weighing indexed EOA (moderate below ~0.85, severe below ~0.65 cm²/m²) against the patient."
  }
);

/* ---------------- Rotation-readiness merge: OR etiquette & scrubbing in (from guide front matter) ---------------- */

window.LESSONS["d1-chambers"].chunks.push(
  {
    title: "Scrubbing in: OR etiquette and conduct at the table",
    html: `<p>Knowing the anatomy is only half of being useful in the operating room; the other half is conduct. Walking into a cardiac case unprepared is disrespectful to the team and a wasted learning opportunity, and a single break in sterility or a poorly-timed question can genuinely harm a patient. The behaviours below are what separate a student the team wants back from one they do not.</p>
<p>The single most important habit is to <b>read the room's tempo</b>. A cardiac operation has quiet phases and lethal ones, and your job is to be invisible during the lethal ones and curious during the quiet ones.</p>
<ul>
  <li><b>Introduce yourself</b> to the scrub tech, circulating nurse, and anesthesiologist before the case, and learn the perfusionist's name — these are the people who make the room run.</li>
  <li><b>Never reach across the sterile field.</b> If you are unsure where to stand, stand behind the first assistant and observe. Keep your hands above your waist once scrubbed, and do not touch anything on the back table unless asked.</li>
  <li><b>Be silent during critical moments</b> — induction, cannulation, going on and coming off bypass, and any moment of technical difficulty. <b>Ask questions during low-intensity phases</b> instead: conduit harvest, rewarming, and wound closure.</li>
  <li><b>When handed a retractor, hold it steadily</b> and do not drift; the surgeon will reposition you if needed.</li>
  <li><b>If you feel faint</b> — it happens in a warm room after hours of standing still — step back from the table and tell someone. Passing out and contaminating the field is the failure; stepping back is not.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Silence is a skill. The most reliable way to be invited back to the OR is to be quiet, still, and attentive when the surgeon is concentrating, and to save your good question for conduit harvest or closure.</p>
</div>`
  },
  {
    title: "Before you scrub: the questions to answer for any case",
    html: `<p>Before every case, answer these questions for yourself the night before — not to impress anyone, but because you cannot follow an operation you do not understand, and understanding the plan is what lets you anticipate the next move instead of merely watching.</p>
<ol>
  <li><b>What is the diagnosis and what is the operation?</b> Not just the procedure name — understand <i>why this patient needs this operation</i>.</li>
  <li><b>What is the relevant anatomy?</b> For CABG, which vessels are diseased and where are the targets? For a valve, what is the mechanism of dysfunction?</li>
  <li><b>What is the plan for bypass?</b> On-pump or off-pump? What is the expected cross-clamp time?</li>
  <li><b>What are the key risks for this particular patient?</b> Renal dysfunction, prior sternotomy (redo), hemodynamic instability, coagulopathy?</li>
  <li><b>What conduit or prosthesis is planned?</b> LIMA, radial, or saphenous vein for CABG; repair vs replacement and mechanical vs bioprosthetic for a valve.</li>
</ol>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Day-specific pre-case checklists follow: the CABG-case list lives in the Day 6 technique lesson and the valve-case list in the Day 7 SAVR lesson. The generic five questions above apply to every case you scrub.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "During which phase of a cardiac operation is it most appropriate for a student to ask a clarifying question?",
    options: [
      "During cannulation and while going on bypass",
      "During anesthetic induction",
      "At the moment the surgeon encounters unexpected bleeding",
      "During conduit harvest, rewarming, or wound closure"
    ],
    answer: 3,
    explain: "Questions belong in the low-intensity phases — conduit harvest, rewarming, and closure — when the surgeon has spare attention. During induction, cannulation, going on and coming off bypass, and any moment of technical difficulty, the correct behaviour is silence and stillness; a question at those moments is a distraction that can cost the patient."
  }
);
