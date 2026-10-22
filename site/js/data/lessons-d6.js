window.LESSONS = window.LESSONS || {};

window.LESSONS["d6-indications"] = {
  id: "d6-indications",
  day: 7,
  ord: 1,
  title: "CABG Indications & Evidence",
  short: "CABGIndic",
  minutes: 18,
  chunks: [
    {
      title: "The Decision Framework for Revascularization",
      html: "<p>Choosing between CABG, PCI, and pills is not a single yes/no switch — it is more like a triage that weighs four things at once and lets them out-vote each other: the <b>anatomy</b> (how complex is the disease — the SYNTAX score), the <b>physiology</b> (is a borderline lesion actually starving muscle — FFR), the <b>pump</b> (how weak is the LV), and the <b>patient</b> (their diabetes, frailty, and goals). No one factor wins on its own; the Heart Team's job is to see where they converge. The recurring theme you will meet in the trials below is simple — <b>the more diffuse and complex the disease, the more surgery pulls ahead of stenting</b>, because bypass treats the whole vessel while a stent treats only the spot.</p><p>The ACC/AHA 2021 guidelines structure this decision using evidence from landmark trials, most of which enrolled patients between 2006 and 2016 using first- and second-generation drug-eluting stents. Understanding the specific trial populations and endpoints is essential for applying the evidence correctly at the bedside.</p><p>The framework did not appear from nowhere — it rests on three seminal 1970s trials (the <b>CASS</b> registry, the <b>Veterans Administration</b> study, and the <b>European Coronary Surgery Study</b>) that compared surgery with medical therapy and taught one durable lesson: <b>the survival benefit of revascularization is greatest in the patients at highest risk from the disease itself</b> — those with the most severe ischemia, the most vessels involved, and the weakest left ventricle. A 1994 overview pooling seven randomized trials confirmed it, and every modern trial (SYNTAX, FREEDOM, EXCEL) is simply that same question asked in a sharper-defined subgroup.</p><p>Two definitions anchor the whole conversation. A stenosis is <b>hemodynamically significant</b> at <b>≥70% diameter loss</b> in an ordinary coronary but only <b>≥50%</b> in the left main, because the left main subtends so much myocardium that a lesser narrowing already matters. And the <b>SYNTAX score</b> is a purely <em>anatomic</em> tally — it assigns points for each lesion's length, severity, and relation to bifurcations and trifurcations, so a higher score literally means more, longer, more awkwardly placed disease. Its weakness is exactly its purity: it ignores clinical variables and carries real interobserver variability, which is why the 2021 guideline pairs it with the STS score and the Heart Team rather than treating any single number as the answer.</p>"
    },
    {
      title: "Class I CABG Indications",
      html: "<p>Class I recommendations represent conditions where the evidence strongly supports CABG over alternative strategies. These are not mere suggestions—they represent survival benefits established in randomized or large observational datasets.</p><ul><li><b>Left main coronary artery disease (≥ 50% stenosis):</b> CABG has a mortality benefit over PCI in most left main disease. CABG is Class I when SYNTAX score &gt; 33; PCI is reasonable for low SYNTAX (&lt; 22) or anatomically suitable lesions</li><li><b>Three-vessel CAD with intermediate-high SYNTAX score:</b> CABG reduces mortality versus medical therapy and shows superior freedom from MACE versus PCI in high SYNTAX scores</li><li><b>Two-vessel CAD with proximal LAD involvement and EF &lt; 35% or large ischemic territory</b></li><li><b>Severe CAD with reduced EF (≤ 35%):</b> CABG + medical therapy versus medical therapy alone — STICH trial</li><li><b>Failed PCI with ongoing ischemia or hemodynamic instability:</b> Emergent CABG</li><li><b>Multivessel CAD in diabetic patients:</b> CABG superior to PCI per FREEDOM trial and BARI 2D</li></ul><p>Read the list the way Cohn frames it: the guideline first sorts by the <b>goal</b> (survival vs symptom relief), then by anatomy, and only then by clinical context. On a pure <b>survival</b> basis CABG is Class I for unprotected left main, three-vessel disease (with or without proximal LAD), and two-vessel disease <i>with</i> proximal LAD; it slides to Class IIa for two-vessel disease without proximal LAD but with extensive ischemia, isolated proximal-LAD disease, and moderate LV dysfunction (<b>EF 35–50%</b>); and only Class IIb for severe LV dysfunction (<b>EF &lt;35%</b>).</p><p>That EF gradient is counterintuitive and worth understanding. The <b>STICH</b> trial randomized 1,212 patients with EF &lt;35% to CABG-plus-medical-therapy versus medical therapy alone and found only a <em>non-significant</em> mortality trend (36% vs 41% at a mean 56 months) — but it was underpowered and <b>17% of the medical arm crossed over to surgery</b>, diluting the effect. The modern reading is the opposite of the old fear: a poor ventricle fed by viable, hibernating muscle is an <b>indication</b> for revascularization, not a contraindication, because that muscle can recover contractile function once flow is restored. Separately, remember what CABG does <em>not</em> reliably do — it renders 80–90% of patients angina-free early (≈60% still angina-free at 10 years) but has never clearly reduced non-fatal MI, partly because peri-operative infarcts offset the later protection.</p>"
    },
    {
      type: "checkpoint",
      q: "Which SYNTAX score range makes CABG clearly superior to PCI based on the SYNTAX trial evidence?",
      options: [
        "SYNTAX score < 22 (low)",
        "SYNTAX score 23–32 (intermediate)",
        "SYNTAX score is not relevant to CABG vs. PCI decisions",
        "SYNTAX score ≥ 33 (high)"
      ],
      answer: 3,
      explain: "The SYNTAX trial showed that at high SYNTAX scores (≥ 33), CABG had significantly lower MACE at 5 years compared to PCI with first-generation DES, including lower MI, lower repeat revascularization, and increasing separation in all-cause mortality. At low SYNTAX scores (< 22), PCI was non-inferior. The intermediate range (23–32) was roughly equivalent overall, though diabetic patients specifically favored CABG even in this range."
    },
    {
      title: "The SYNTAX Trial (2009, 5-year follow-up 2013)",
      html: "<p>The SYNTAX trial is perhaps the most important randomized trial in coronary revascularization. It compared CABG versus PCI with first-generation drug-eluting stents in patients with three-vessel or left main CAD. The SYNTAX score was both a stratification tool and a landmark finding: coronary complexity, as quantified by anatomy, predicts who benefits more from CABG.</p><ul><li><b>High SYNTAX (≥ 33):</b> CABG significantly better — lower MACE, lower MI, lower repeat revascularization. At 5 years, increasing separation in all-cause mortality favoring CABG</li><li><b>Low SYNTAX (&lt; 22):</b> PCI non-inferior to CABG</li><li><b>Intermediate SYNTAX (23–32):</b> Roughly equivalent outcomes</li><li><b>CABG trade-off:</b> Higher stroke rates at 1 year vs. PCI; PCI had higher repeat revascularization throughout the follow-up</li></ul><div class='kbox pearl'><div class='kbox-tag'>PEARL</div><p>The SYNTAX trial used first-generation DES, which have worse outcomes than modern second-generation DES. Contemporary trials (EXCEL, NOBLE) used newer stents with improved results, but CABG still demonstrated advantages in complex anatomy.</p></div><p>The deeper point the trial made is <em>why</em> anatomy should predict who benefits from surgery. A stent treats a discrete point; a bypass graft — especially the LIMA — delivers new inflow <b>distal</b> to the diseased segment and keeps protecting the vessel even as native atherosclerosis marches on proximal to the anastomosis. So the more diffuse, long, and bifurcated the disease (a high SYNTAX score), the more a spot-treatment strategy is out-run by ongoing disease, and the wider CABG's advantage grows. The mirror-image cost is up front: CABG's <b>higher early stroke rate</b> comes largely from manipulating the aorta (cannulation, cross-clamping, proximal anastomoses), which is why epiaortic scanning and anaortic techniques matter, while PCI's penalty is paid later and repeatedly as <b>repeat revascularization</b>. Note too that SYNTAX enrolled a screened minority of all-comers — randomized CABG-vs-PCI trials capture only a fraction of the real population (the original BARI trial randomized just 5% of those screened), so a low score in the trial is not a licence to stent a patient the trial never enrolled.</p><p>One further caveat has aged the trial's reliance on the score: the 2021 guideline explicitly downgrades the SYNTAX score's usefulness to <b>less clear</b> — it is calculated from anatomy alone, ignores clinical variables like frailty and renal function, and carries real interobserver variability — so it now <em>informs</em> the Heart Team rather than dictating the choice, with the STS score carrying the surgical-risk half of the decision.</p>"
    },
    {
      title: "FREEDOM Trial (2012): Diabetes and Multivessel CAD",
      html: "<p>The FREEDOM trial specifically addressed diabetic patients with multivessel CAD—a population where the biology of disease progression differs from non-diabetics, and where incomplete revascularization has outsized consequences. The trial randomized 1,900 diabetic patients with multivessel CAD to CABG versus PCI with DES.</p><p>At 5 years, CABG reduced the primary composite endpoint (death, MI, stroke) from 26.6% (PCI) to 18.7% (CABG)—a relative risk reduction of nearly 30%. The benefit was driven by lower MI rates and lower all-cause mortality with CABG. Stroke rate was modestly higher with CABG. The FREEDOM trial provides the most robust evidence that diabetic patients with multivessel CAD should receive CABG over PCI in most circumstances.</p><p>The <em>reason</em> diabetes tips the balance is vascular biology, not statistics. Diabetic atherosclerosis is diffuse, small-vessel, and relentlessly progressive, so a stent placed at today's tightest lesion is soon flanked by new disease — exactly the setting where a graft that delivers inflow to the whole distal vessel wins. That is also why the benefit is a <b>slow burn</b>: in FREEDOM the mortality curves did not clearly separate until <b>years 4–5</b>, and the composite advantage was driven by fewer <b>deaths and MIs</b>, paid for by a modest excess of <b>early stroke</b> in the CABG arm. The design caveat to keep honest: FREEDOM enrolled largely before the newest-generation drug-eluting stents. The 2021 guideline nonetheless makes diabetes-plus-multivessel disease involving the LAD a <b>Class I (LOE A)</b> reason to choose CABG with a LIMA to the LAD — reserving PCI (Class IIa) for the diabetic who is a poor surgical candidate.</p><p>It helps to see the graft doing the work. In the diabetic the LAD territory is the highest-value real estate, and a <b>LIMA laid onto the LAD</b> keeps feeding the anterior wall for decades regardless of what the native vessel does upstream — a stent in that same LAD sits inside progressively diseased, small-caliber vessel and is repeatedly re-treated. <b>BARI 2D</b> pointed the same direction, showing that among diabetics needing revascularization, those whose anatomy favored surgery fared better with CABG than with PCI. This is why the guideline's language is unusually strong here (Class I, Level of Evidence A) — a rare pairing reserved for a recommendation resting on high-quality randomized data. The bedside translation: a diabetic with multivessel disease involving the LAD should be offered CABG with a LIMA-to-LAD unless a specific reason — prohibitive surgical risk, patient refusal, or unsuitable distal targets — makes stenting the better of two imperfect choices.</p>"
    },
    {
      title: "EXCEL and NOBLE Trials: Left Main Disease",
      html: "<p>Left main coronary artery disease requires especially careful decision-making because the left main supplies the majority of the left ventricle in most patients. Two large trials addressed the CABG-versus-PCI question in left main disease, and their findings are complementary and occasionally contradictory.</p><p><b>EXCEL Trial (2016):</b> Compared CABG versus PCI (SYNTAX ≤ 32) for left main disease. Primary endpoint (death, MI, stroke) at 3 years: non-inferior for PCI. At 5-year follow-up, CABG showed lower all-cause mortality (9.9% CABG vs. 13.0% PCI). The trial remains controversial due to disputes about how periprocedural MI was defined—different definitions yielded different conclusions about early events.</p><p><b>NOBLE Trial (2016):</b> European trial of CABG vs. PCI for left main disease. CABG significantly superior at 5 years for MACE, primarily driven by lower repeat revascularization and lower MI rates for CABG. Stroke rates were similar.</p><div class='kbox study'><div class='kbox-tag'>STUDY</div><p>For left main disease with SYNTAX &gt; 33: CABG is Class I. For SYNTAX &lt; 22 with suitable anatomy: PCI is reasonable. The intermediate range and EXCEL controversy are areas of ongoing debate — Heart Team discussion is essential.</p></div><p>The two trials look contradictory until you see that <b>they measured a heart attack differently</b>, and that single methodological choice drives the disagreement. EXCEL's primary composite leaned on a <b>CK-MB–based (SCAI) definition</b> of peri-procedural MI that counts the enzyme leak surgery inevitably produces — inflating the <i>surgical</i> event count and making PCI look non-inferior early; the definition drew a formal, public complaint. NOBLE used a definition that <b>excluded peri-procedural MI</b>, and it favored CABG (5-year MACCE roughly 28% PCI vs 19% CABG), driven by more <b>spontaneous MI and repeat revascularization</b> after stenting. Look past the composites to the hard endpoint and they converge: at 5 years EXCEL itself showed <b>lower all-cause mortality with CABG (9.9% vs 13.0%)</b>. Both trials were industry-sponsored. The honest synthesis — the one a viva examiner wants — is that PCI performs comparably in <em>low-complexity</em> left main, and CABG's edge widens as anatomic complexity rises, so the SYNTAX score and the Heart Team, not a single trial headline, decide the individual case.</p>"
    },
    {
      type: "checkpoint",
      q: "A 67-year-old diabetic with three-vessel CAD and SYNTAX score 28 is evaluated by the Heart Team. Which statement best reflects the evidence-based recommendation?",
      options: [
        "CABG is preferred",
        "PCI is preferred for intermediate SYNTAX scores regardless of diabetes",
        "Medical therapy alone is the best option for SYNTAX score 23–32",
        "SYNTAX score 28 mandates CABG as Class I recommendation per ACC/AHA guidelines"
      ],
      answer: 0,
      explain: "While a SYNTAX score of 28 (intermediate range) shows roughly equivalent overall outcomes for CABG vs. PCI, the diabetic subgroup specifically favors CABG per the FREEDOM trial, which showed a 7.9% absolute risk reduction in the primary composite at 5 years for CABG over PCI in diabetic multivessel disease. Diabetes with multivessel CAD is a Class I CABG indication. SYNTAX scores ≥ 33 (not 28) mandate CABG as clearly superior — intermediate scores require individualized Heart Team judgment, but diabetes tips the decision toward CABG."
    },
    {
      title: "Emergency CABG and Carotid Disease",
      html: "<p>Emergency CABG is indicated when PCI fails with ongoing ischemia and hemodynamic instability, when anatomy is unsuitable for PCI, when mechanical complications of STEMI require surgery (VSD, acute MR from papillary muscle rupture, free wall rupture), or when cardiogenic shock is refractory to PCI and requires more complete revascularization.</p><p>Concurrent carotid artery disease adds stroke risk during CABG. Carotid duplex screening is warranted in patients with prior stroke/TIA, carotid bruit, significant carotid history, or age &gt; 65 with vascular risk factors. For symptomatic carotid stenosis ≥ 50% or asymptomatic ≥ 80% bilateral disease, most centers consider staged (CEA first, then CABG) or combined (same anesthetic) approaches. The evidence for prophylactic carotid revascularization in asymptomatic patients before CABG remains limited and debated.</p><p>The numbers reframe the carotid worry. Peri-operative stroke after isolated CABG now runs about <b>1.2%</b> (down from ~3% two decades ago), but it is devastating — carrying <b>21–23% in-hospital mortality</b>. Crucially, <b>~75% of these strokes are cardioembolic from manipulation of the atherosclerotic ascending aorta</b> (cannulation, cross-clamping, proximal anastomoses); large-artery disease including the carotids accounts for only about <b>5%</b>. So a carotid stenosis is often a <em>marker</em> of diffuse vascular disease rather than the direct culprit — in one series only 1 of 18 post-CABG strokes in patients with ≥50% carotid disease was even potentially preventable by endarterectomy.</p><p>That is why screening is <b>selective, not universal</b>: duplex is a Class IIa recommendation for a high-risk profile — <b>age &gt;65, left main disease, PVD, prior stroke/TIA, hypertension, smoking, or diabetes</b> — a filter that cuts testing ~40% while missing only ~2% of significant lesions. When intervention is warranted, timing is individualized: <b>staged</b> (CEA first) trades a lower stroke risk for a higher MI risk and suits the stable patient; <b>reverse-staged</b> (CABG first) or <b>concomitant</b> (one anesthetic) is favored when active ischemia or hemodynamic instability makes the heart the more urgent threat. Combined revascularization is Class IIa for symptomatic ≥50% carotid stenosis and Class IIb for bilateral 70–99% disease or unilateral severe stenosis with contralateral occlusion.</p>"
    }
  ]
};

window.LESSONS["d6-conduits"] = {
  id: "d6-conduits",
  day: 7,
  ord: 2,
  title: "Conduits: LIMA, Vein, Radial",
  short: "Conduits",
  minutes: 16,
  chunks: [
    {
      title: "Why Conduit Choice Determines CABG Durability",
      html: "<p>A bypass graft is a piece of the patient's own plumbing re-routed to carry blood around a blockage — and it has to keep doing that job for the rest of their life. Choosing what pipe to use is like choosing pipe material for a wall you are going to seal up permanently: pick a material that corrodes and you will be back to tear the wall open in a few years. A conduit that develops atherosclerosis, scars down with intimal hyperplasia, or clots off has undone the whole operation. So conduit choice is not a detail left to the end — it is one of the surgeon's most consequential decisions.</p><p>Decades of follow-up give a clean ranking, and it comes down to <b>artery beats vein</b>. The internal mammary arteries are the most durable, the radial artery next, and the saphenous vein last — because an artery is built to live under arterial pressure and a vein simply is not. Understanding <em>why</em> each conduit behaves as it does lets you predict how each graft will hold up over a lifetime.</p><p>The durability ranking is not a hunch — it is written in angiographic follow-up. At <b>10 years</b> a LIMA-to-LAD is patent in about <b>95%</b> of patients and still <b>~88% at 15 years</b>; a saphenous vein graft over the same intervals falls to roughly <b>61% then 32%</b>. The radial artery sits in between, with 5-year patency in the high-80s-to-90s <em>when grafted to a tightly stenosed target</em>. Those numbers convert directly into lives: the classic comparison put 10-year survival at <b>82.6% with a LITA-to-LAD versus 71% with a vein graft to the same vessel</b>. The lesson the surgeon carries into the case is to <b>spend the most durable conduit on the most important territory</b> — the LAD — and to match the remaining arteries and veins to the other targets by caliber, stenosis severity, and expected flow.</p><p>The physiologic reason artery beats vein is simply what each vessel was built to withstand. An artery lives its whole life under systemic pressure, so its wall, its elastic lamina, and — most importantly — its endothelium are engineered for that load; a vein is a low-pressure capacitance vessel, and when it is suddenly plumbed into the arterial tree it answers the unfamiliar wall stress with intimal hyperplasia and then accelerated atherosclerosis. Beyond the three workhorses there is a ladder of fallback conduits — the <b>right gastroepiploic artery</b> (a skeletonized in-situ option for a tightly stenosed distal RCA in experienced hands), and, rarely, the lesser saphenous or cephalic veins — but each carries either harvest complexity or inferior patency, which is exactly why the LIMA–radial–vein hierarchy dominates real practice. The practical corollary is that conduit planning happens <em>before</em> the skin incision: the angiogram is read as a map, and each target is assigned its best-matched pipe in advance.</p>"
    },
    {
      title: "LIMA to LAD: The Gold Standard",
      html: "<p>The left internal mammary artery (LIMA) grafted to the left anterior descending artery (LAD) is the most important component of any CABG operation. The LIMA's extraordinary durability stems from its biology: as a medium-sized elastic artery, its endothelium constitutively produces high levels of nitric oxide and prostacyclin, making it resistant to platelet aggregation and, critically, to atherosclerosis. Unlike a vein graft or free arterial graft, the in-situ LIMA maintains a connection to the subclavian artery, preserving native arterial flow characteristics and pulsatile pressure waveforms.</p><ul><li><b>Patency at 10 years: &gt; 95%</b></li><li><b>Patency at 20 years: &gt; 85%</b></li><li>The LIMA-to-LAD graft independently confers a survival benefit</li><li>Use of LIMA to LAD is a Class I recommendation for virtually all CABG patients with suitable anatomy</li></ul><div class='kbox danger'><div class='kbox-tag'>DANGER</div><p>Failing to use the LIMA to the LAD when technically feasible is a quality metric failure in cardiac surgery. The LAD supplies the anterior wall and anterior septum — the most functionally significant territory. Protecting it with the most durable conduit is non-negotiable.</p></div><p>Cohn spells out the biology behind the patency figures, and it is worth more than the numbers alone. Under electron microscopy the ITA has <b>essentially no thrombogenic intimal defects</b> (veins are full of them), and its <b>non-fenestrated internal elastic lamina</b> acts as a physical barrier to the smooth-muscle-cell migration that drives intimal hyperplasia. Its media is thin, with few smooth muscle cells and a blunted proliferative response to mitogens like PDGF. The endothelium is pharmacologically friendly: it pours out nitric oxide and prostacyclin, <b>vasodilates in response to milrinone and nitroglycerin, and — remarkably — does not constrict to norepinephrine</b>, so the pressors used to wean off bypass do not throttle it. That same endothelial output appears to protect the <em>native</em> vessel downstream of the anastomosis, and the graft <b>remodels and widens over time</b> to meet demand. Kept <b>in situ</b> on the subclavian, it never needs a proximal aortic anastomosis at all — one less suture line and no aortic manipulation. All of this is why failing to use the LIMA on the LAD when feasible is a recognized quality-metric failure.</p>"
    },
    {
      type: "checkpoint",
      q: "What is the 10-year patency rate of the LIMA-to-LAD graft and what biological feature accounts for its durability?",
      options: [
        "~60%; the LIMA is thicker-walled than the saphenous vein",
        "~80%; the LIMA has fewer valves than saphenous vein",
        "> 95%; the LIMA is larger in diameter than other arterial conduits",
        "Over 95%; favorable endothelial nitric-oxide biology"
      ],
      answer: 3,
      explain: "LIMA patency exceeds 95% at 10 years and 85% at 20 years. The biological basis is the LIMA's endothelial production of nitric oxide and prostacyclin, which inhibit platelet aggregation and protect against atherosclerosis. The LIMA is also kept in situ (connected to the subclavian artery), preserving arterial flow dynamics. Diameter and wall thickness are not the primary biological explanations."
    },
    {
      title: "Right Internal Mammary Artery (RIMA) and Bilateral IMA Grafting",
      html: "<p>The right internal mammary artery (RIMA) is used as a second arterial conduit in selected patients. It can be used in situ (routed across the mediastinum to the LAD, diagonal, or other left-sided targets) or as a free graft. Bilateral internal mammary artery (BIMA) grafting—using both LIMA and RIMA—has been associated with improved long-term survival in multiple observational series.</p><p>However, BIMA grafting increases the risk of deep sternal wound infection because harvesting both IMAs deprives the sternum of its dual blood supply. This risk is highest in diabetics and obese patients.</p><p>The ART Trial (2019) compared BIMA versus SIMA in a large RCT and found no significant difference in 10-year survival, though the trial was criticized for being underpowered and subject to significant crossover. BIMA remains favored at high-volume centers for lower-risk, non-diabetic patients.</p><p>The sternal-wound problem and its solution are both concrete. A pedicled ITA harvest strips the sternum of a major blood supply, and bone scans show a <b>significant drop in sternal vascularity after pedicled harvest</b> but <b>minimal change after skeletonized harvest</b> — where only the artery is taken and the internal-thoracic venous plexus and surrounding tissue are left intact. That difference shows up clinically: Matsa reported a deep sternal wound infection rate of just <b>1.7%</b> across 765 skeletonized BIMA patients (only 2.6% in the diabetics), and Calafiore found the diabetic sternal-complication rate fell from <b>10% with pedicled to 2.2% with skeletonized</b> harvest. Skeletonization also yields a longer, larger-caliber conduit. Anatomy explains the reach: the RIMA can be routed in situ across the mediastinum, and the <b>left ITA arises as a single artery in ~70% of people, the right in ~95%</b>; the phrenic nerve crosses <em>anterior</em> to the ITA in about two-thirds of patients, so proximal dissection must respect it. The negative <b>ART trial</b> (no 10-year survival benefit for BIMA by intention-to-treat) was blunted by ~40% crossover, so the patency biology of a second arterial graft survives the null headline.</p><p>Why reach for a second mammary at all? Multiple observational series link <b>total arterial revascularization</b> to better very-long-term event-free survival, on the same biological logic that makes the LIMA-LAD sacrosanct — two atherosclerosis-resistant conduits instead of one. The RIMA can reach left-sided targets in situ once the anterior pericardial fat pad is cleared to lengthen it, or it can serve as a free graft or a composite limb taken off the LITA.</p>"
    },
    {
      title: "Radial Artery",
      html: "<p>The radial artery is the third option for an arterial conduit, with patency rates superior to saphenous vein but inferior to the internal mammary arteries. It is harvested from the non-dominant forearm, typically using endoscopic or minimally invasive techniques.</p><ul><li><b>Patency approximately 80–90% at 5 years</b></li><li>The radial artery is prone to vasospasm, which must be addressed intraoperatively (papaverine solution, calcium channel blockers) and post-operatively (long-term oral CCB, typically for 1–3 years)</li><li><b>Contraindication:</b> Inadequate ulnar artery collateral circulation — assessed with Allen test or pulse oximetry; if the hand relies on the radial artery for perfusion, harvest is contraindicated</li></ul><div class='kbox pearl'><div class='kbox-tag'>PEARL</div><p>Always confirm a patent Allen test bilaterally before using the radial artery. Document the result in the pre-operative note. An absent or incomplete Allen test on the left indicates potential hand ischemia if the left radial is harvested.</p></div><p>The radial's personality is set by its wall. Unlike the ITA it has a <b>fenestrated internal elastic lamina, a thicker muscular media, and a higher myocyte density</b> — that muscle mass generates real contractile force, which is why it is so <b>prone to spasm</b>, and it is also more often diseased at harvest (<b>~28% show some atherosclerosis versus ~6% of ITAs</b>). Its history is a cautionary tale: Carpentier's original 1970s radials had a <b>32% occlusion rate at 2 years</b> and the conduit was abandoned, until Acar showed the failures were harvest-induced spasm and revived it with gentle pedicled harvest plus vasodilators. Handled well, patency is genuinely good — ~93% at 9 months, ~89% at 4 years, and <b>98% versus 86% for vein at 5 years when grafted to an <em>ideal</em> target</b>. The critical caveat is <b>competitive flow</b>: in the Radial Artery Patency Study, occlusion was only 5.9% against a &gt;90% stenosis but 11.8% against a 70–89% lesion — so the radial belongs on a <b>tightly stenosed</b> vessel, never a moderate one. In vitro, <b>nitroglycerin is the most effective anti-spasm agent</b>, and an oral calcium-channel blocker is continued through the first postoperative year; transient thumb and forearm paresthesia after harvest affects about a third of patients but only ~1% remain severely troubled at a year.</p>"
    },
    {
      title: "Greater Saphenous Vein (GSV): Pros and Cons",
      html: "<p>The greater saphenous vein is the workhorse second conduit — abundant, long enough to reach any target, and easy to harvest. But asking a vein to work as an artery is like plumbing a soft garden hose into a fire hydrant: it was built for the low-pressure venous return, and the sudden arterial pressure it now sees drives a predictable, two-phase self-destruction called vein graft disease.</p><p><b>Phase 1 (1–2 years): Intimal hyperplasia</b> — a proliferative response to venous wall injury during harvest and the high-pressure arterial environment. This process is not atherosclerosis and is not prevented by statins or aspirin alone.</p><p><b>Phase 2 (beyond 3–5 years): Accelerated atherosclerosis</b> — the venous wall, lacking the protective endothelial biology of an artery, develops foam cell lesions and plaque progression, leading to luminal narrowing and graft occlusion.</p><ul><li><b>Patency: ~60–80% at 10 years</b> (vs. &gt; 95% for LIMA)</li><li>SVG occlusion is the most common cause of late CABG failure</li><li>Post-op aspirin (started within 6 hours of CABG) specifically targets SVG patency</li></ul><p>Two pharmacologic strategies and one harvest choice change how long a vein lasts. <b>Aspirin within 48 hours</b> of CABG reduces not just graft occlusion but early mortality, MI, stroke, renal failure, and bowel infarction — it targets the fresh anastomosis where platelets meet exposed subendothelium. <b>Aggressive statin therapy to an LDL &lt;100 mg/dL cuts by about a third the number of grafts showing atherosclerosis</b> on follow-up angiography and reduces repeat revascularization, attacking Phase 2 directly (the gene-therapy shortcut, PREVENT IV's edifoligide, failed). Harvest technique is the third lever: the vein must never be <b>grasped with forceps, stretched, or over-distended</b>, because endothelial injury seeds later failure. The <b>no-touch technique</b> — removing the vein within a pedicle of surrounding tissue, undistended — raised patency to <b>90% versus 76% for conventional harvest at 8.5 years</b> (approaching ITA territory). Conversely, one 3,000-patient report linked <b>endoscopic harvest to higher graft failure, death, MI, and repeat revascularization</b> — a reminder that the least-invasive option is not automatically the most durable. Harvest site is a smaller but examinable point: lower-leg vein offers a better caliber match but the <b>saphenous nerve runs alongside it</b> (risking a debilitating post-operative neuralgia), while thigh vein heals less reliably through its thicker layer of fat.</p>"
    },
    {
      type: "checkpoint",
      q: "The no-touch saphenous vein technique refers to which modification during conduit harvest?",
      options: [
        "Harvesting the vein endoscopically without surrounding tissue",
        "Pedicled harvest without high-pressure distension",
        "Removing all fat and vasa vasorum from the conduit",
        "Using the small rather than great saphenous vein"
      ],
      answer: 1,
      explain: "The no-touch technique involves harvesting the saphenous vein with its surrounding pedicle of tissue (peri-adventitial fat and small branches) rather than skeletonizing it. This preserves the vasa vasorum supplying the vein wall and avoids mechanical distension. The SWEDVESG trial showed improved early patency with the no-touch technique compared to conventional harvesting, though it is not universally adopted."
    },
    {
      title: "Post-CABG Aspirin and SVG Patency Evidence",
      html: "<p>Aspirin after CABG is not just secondary prevention for atherosclerosis—it specifically targets early SVG thrombosis and intimal hyperplasia. The biological rationale is platelet inhibition at the fresh anastomotic site, where activated platelets adhere to exposed subendothelium and initiate thrombosis or stimulate smooth muscle proliferation.</p><ul><li><b>Post CABG Trial:</b> High-dose aspirin vs. no aspirin after CABG — aspirin reduced SVG occlusion at 1 year. ACC/AHA recommendation: start aspirin within 6 hours of surgery (Class I)</li><li><b>PREVENT IV Trial:</b> Evaluated edifoligide (antisense oligonucleotide against E2F transcription factor) to prevent SVG failure — no benefit over placebo, but confirmed that approximately 40% of SVGs fail within 1 year, many asymptomatically</li><li><b>DACAB Trial:</b> Compared aspirin alone vs. ticagrelor + aspirin (DAPT) vs. ticagrelor alone after off-pump CABG — DAPT improved SVG patency at 1 year, supporting DAPT after off-pump CABG</li></ul><p>Put the trials on a timeline and they tell one story about <em>when</em> a vein graft dies and how to defend it. In the first weeks the enemy is <b>thrombosis</b> at the raw anastomosis, so the guideline's <b>Class I (LOE A)</b> instruction is blunt: start <b>aspirin 100–325 mg within 6 hours</b> of surgery and continue it indefinitely — earlier is better because the platelet plug forms early. PREVENT IV's sobering incidental finding sets the stakes: roughly <b>40% of vein grafts have already failed by one year</b>, many silently, which is why early antiplatelet cover and a durable arterial conduit on the key territory matter so much. DACAB's signal that adding a P2Y12 inhibitor improves <em>vein</em> patency after off-pump surgery is biologically sensible — an off-pump anastomosis is sewn onto a beating, blood-filled vessel and may be more thrombogenic — but it is weighed against bleeding, so aspirin monotherapy remains the default and DAPT is selective.</p><p>The mechanistic bridge between these trials is the fresh anastomosis itself. In the first days after grafting, the vein's denuded, handled endothelium exposes subendothelial collagen; platelets adhere, aggregate, and release growth factors that both <b>seed thrombus</b> and <b>drive the smooth-muscle proliferation of intimal hyperplasia</b>. Aspirin, by acetylating platelet cyclo-oxygenase for the platelet's entire lifetime, blunts both processes — which is why its <em>timing</em> (within 6 hours, before the cascade matures) matters at least as much as its dose. Statins act later and elsewhere, stabilizing the lipid-driven Phase-2 disease; the two drugs are complementary, not interchangeable.</p>"
    }
  ]
};

window.LESSONS["d6-technique"] = {
  id: "d6-technique",
  day: 7,
  ord: 3,
  title: "On-pump vs Off-pump & Technique",
  short: "CABGTech",
  minutes: 14,
  chunks: [
    {
      title: "On-Pump CABG: The Standard Approach",
      html: "<p>Conventional CABG is performed with cardiopulmonary bypass (CPB). The heart is arrested using cardioplegia solution while the bypass circuit maintains systemic circulation. The result is a still, bloodless operative field in which the surgeon can construct precise anastomoses under optimal conditions. This technical advantage translates to higher graft patency rates and more complete revascularization in most series.</p><p>The trade-off is CPB-related morbidity: the systemic inflammatory response triggered by blood contact with the bypass circuit, hemodilution from the circuit prime, and the risk of particulate and gaseous emboli from the pump and cannulation sites. These effects contribute to the well-described CPB syndrome of transient neurological dysfunction, renal impairment, and coagulopathy.</p><p>The mechanics are worth knowing because they are the questions across the table. Before cannulation the patient is heparinized (<b>~300 U/kg</b>) to an <b>ACT over 450 seconds</b>, and the systolic pressure is dropped to about <b>100 mmHg</b> so the aortic cannula does not seed a dissection. Full bypass runs at roughly <b>2.4 L/min/m²</b>, either at normothermia or cooled to ~34 °C. The heart is then arrested with <b>cold blood cardioplegia (~10 mL/kg to start, ~5 mL/kg every 20 minutes)</b> delivered antegrade into the aortic root, retrograde via the coronary sinus, or both — retrograde earns its keep when significant aortic regurgitation makes root delivery leak past the valve. Every one of these steps trades a physiologic disturbance for a <b>still, bloodless field</b>, and that field is precisely what lets the surgeon build millimetre-accurate anastomoses and revascularize completely — the two things most tightly linked to long-term patency and survival. When a diseased aorta or a hostile physiology makes those steps the dominant risk, that is the moment to consider abandoning them for a beating-heart or anaortic strategy.</p><p>It is worth separating the two halves of &quot;CPB morbidity.&quot; The <b>inflammatory</b> half comes from blood contacting the non-endothelial surfaces of the circuit, which activates complement, neutrophils, and the coagulation and fibrinolytic cascades — a whole-body insult that manifests as capillary leak, transient organ dysfunction, and coagulopathy. The <b>embolic</b> half comes from the aorta: cannulation and cross-clamping of an atheromatous ascending aorta can shower particulate debris to the brain, which is why the ascending aorta is inspected, scanned, and sometimes avoided entirely. Hemodilution from the crystalloid prime adds a third hit. None of this negates on-pump's advantage — it simply names the price being paid for the still, protected field, and tells you which specific patients (a shaggy aorta, marginal kidneys, severe lung disease) pay it most dearly.</p>"
    },
    {
      title: "Off-Pump CABG (OPCAB)",
      html: "<p>Off-pump CABG (OPCAB) trades the still, empty heart for a beating one. Instead of stopping the heart on bypass, the surgeon presses a suction stabilizer (the \"Octopus\") onto a small patch of the target vessel to hold just that spot still — like trying to thread a needle on a table someone is gently shaking, while pinning down the one square inch you are working on. The appeal was obvious: skip the bypass circuit and you skip its inflammatory, neurological, and renal toll.</p><p>The reality proved more nuanced. You do avoid CPB, but sewing a millimetre-precise anastomosis onto a moving, blood-filled vessel is genuinely harder than doing it on a still, bloodless one — and several trials paid for that difficulty with more <b>incomplete revascularization</b> and lower graft patency. The lesson: off-pump removes one risk (the pump) by adding another (technical imperfection), so it only makes sense when the pump itself is the bigger danger.</p><div class='kbox study'><div class='kbox-tag'>STUDY</div><p>When to favor off-pump CABG: calcified or porcelain aorta (aortic manipulation and clamping are dangerous), severely atheromatous shaggy aorta (risk of emboli from clamping), severe pulmonary hypertension (CPB poorly tolerated), or prior mediastinal radiation. Requires experienced surgeon at a dedicated center.</p></div><p>The tooling that makes off-pump possible also defines its ceiling. A <b>coronary stabilizer</b> (the Medtronic Octopus or Maquet ACROBAT) uses suction pods to immobilize the ~1 cm of target vessel being sewn, while a separate <b>cardiac positioner</b> lifts and rotates the beating heart to present lateral and inferior targets — the price of that positioning is transient hypotension, arrhythmia, and mitral distortion the anesthesiologist must ride out. Because there is no cardioplegic guarantee, the surgeon <b>verifies each graft with transit-time flow</b> before closing: acceptable is a mean flow <b>&gt;15 mL/min, a pulsatility index &lt;5, and a diastolic fraction &gt;50%</b> for left-sided grafts; anything worse means find the technical fault now. The signal that off-pump can go wrong lives in the numbers — <b>ROOBY reported more incomplete revascularization (17.8% vs 11.1%), fewer grafts placed, and lower 1-year patency (82.6% vs 87.8%)</b>. So the honest framing is a swap: you remove the pump's inflammatory and embolic hit but add the technical hazard of sewing on a moving target, and it only pays when the pump itself is the bigger danger — chiefly a calcified aorta you must not clamp.</p>"
    },
    {
      type: "checkpoint",
      q: "What was the primary finding of the ROOBY trial regarding off-pump CABG?",
      options: [
        "Off-pump CABG was associated with significantly lower stroke rates and superior graft patency",
        "Worse graft patency and long-term outcomes with off-pump CABG",
        "Off-pump and on-pump CABG had identical outcomes across all endpoints",
        "Off-pump CABG was superior in diabetic patients but inferior in non-diabetics"
      ],
      answer: 1,
      explain: "The ROOBY trial (2009), a VA multicenter RCT, found that off-pump CABG was associated with worse composite short-term outcomes, lower graft patency at 1 year (82.6% off-pump vs. 87.8% on-pump), and higher 5-year all-cause mortality compared to on-pump CABG. These findings significantly dampened enthusiasm for off-pump CABG in the US and confined its use to selected patients and experienced centers."
    },
    {
      title: "CORONARY Trial (2012): A Contrasting View",
      html: "<p>The CORONARY trial enrolled 4,752 patients at international centers and compared off-pump versus on-pump CABG. Unlike ROOBY, CORONARY found no significant difference in the primary composite of death, MI, stroke, or renal failure at 30 days, and no difference at 1 year. Off-pump did reduce transfusion requirements and acute kidney injury at 30 days.</p><p>The discordant results between ROOBY and CORONARY likely reflect differences in: surgical experience (CORONARY was performed at centers with established OPCAB programs), patient population, and outcome definitions. The CORONARY trial suggests that at experienced centers, off-pump can achieve equivalent short-term results, but long-term graft patency and mortality remain concerns consistent with ROOBY.</p><p>The discordance is almost entirely explained by <b>who held the needle</b>. ROOBY required only ~20 prior off-pump cases and let <b>residents operate as primary surgeon in 64%</b> of cases — its conversion-to-pump rate was <b>12.4%, roughly five times</b> the national benchmark, and 75% of conversions came from surgeons with fewer than 100 cases. CORONARY, by contrast, demanded <b>&gt;2 years' experience and &gt;100 off-pump cases</b> and enrolled higher-risk patients across 79 centers in 19 countries. A third trial, <b>GOPCABE</b>, randomized 2,539 patients aged ≥75 at expert centers and likewise found no difference in the composite endpoint at 30 days or 1 year. The through-line: off-pump's outcomes track <b>surgeon and center volume</b> more than the technique itself, and the specific catastrophe to fear is the emergent <b>&quot;crash-on-pump&quot; conversion</b> for hemodynamic collapse, which carries a 6–15% mortality — far worse than an elective, controlled conversion.</p><p>What CORONARY <em>did</em> reliably show — and what survives every re-analysis — is that off-pump lowers <b>transfusion requirements and early acute kidney injury</b>, both plausible consequences of avoiding hemodilution and the circuit's inflammatory hit. What it did not show was any mortality or hard-outcome advantage, and longer follow-up (including its own 5-year data and pooled meta-analyses) has if anything hinted at slightly <b>better long-term survival with on-pump</b>, consistent with ROOBY's patency gap. The reconciled teaching point is therefore narrow: off-pump buys measurable short-term physiologic sparing, but it must not cost completeness of revascularization or graft quality — the moment it does, the trade has gone the wrong way.</p>"
    },
    {
      title: "Current Consensus on Off-Pump CABG",
      html: "<p>On-pump CABG remains the standard of care for most patients. The shift toward off-pump that occurred in the early 2000s has largely reversed in North America, where off-pump rates have declined to approximately 20–25% of CABG cases, concentrated at centers with dedicated expertise.</p><ul><li><b>Favor off-pump:</b> Calcified/porcelain aorta, severely atheromatous (shaggy) aorta, severe PAH, prior mediastinal radiation, high CPB risk with marginal renal function</li><li><b>Favor on-pump:</b> Complex multivessel disease requiring complete revascularization, intramyocardial targets, anticipated difficult anastomoses, surgeon inexperience with OPCAB</li></ul><div class='kbox mnemonic'><div class='kbox-tag'>MNEMONIC</div><p><b>CRAP = off-pump candidates:</b> Calcified aorta, Radiation (prior mediastinal), Atheromatous (shaggy) aorta, PAH (severe pulmonary hypertension)</p></div><p>The adoption curve tells the story: off-pump <b>peaked around 2002 at ~23% of CABG in the STS database and settled near ~17% by 2012</b>, concentrated where the expertise lives. The evidence itself splits by study type — <b>randomized trials show equivalence at best</b> (off-pump's real, reproducible wins being fewer transfusions and less acute kidney injury), while several large <b>registries hint at lower operative mortality</b>, a difference most likely explained by selection bias that even propensity matching cannot fully erase. Note one intermediate option the mnemonic hides: <b>on-pump beating-heart</b> CABG uses bypass for hemodynamic support while still avoiding the cross-clamp and cardioplegic arrest — useful in cardiogenic shock or a severely impaired LV that will not tolerate being lifted and positioned off-pump. The unifying principle is that off-pump is not &quot;gentler surgery for everyone&quot; but a <b>targeted tool</b> to spare a specific patient a specific insult.</p><p>Why did the early-2000s enthusiasm reverse so sharply in North America? Partly the ROOBY signal, partly the recognition that the technique is genuinely hard to do well and its benefits evaporate outside high-volume hands. The registries that favor off-pump are precisely the studies most vulnerable to <b>selection bias</b> — a surgeon choosing off-pump for a frail patient with a bad aorta, then being credited for that patient's avoided stroke — so their apparent mortality edge cannot be cleanly separated from who was chosen for the operation. The durable, defensible indications are the mechanical ones, where avoiding the aorta or the pump prevents a <em>specific</em> catastrophe: the porcelain aorta that must not be clamped, the shaggy aorta that will embolize, the lung or kidney that will not tolerate the circuit.</p>"
    },
    {
      type: "checkpoint",
      q: "A 72-year-old patient undergoing CABG is found intraoperatively to have a heavily calcified, immobile ascending aorta (porcelain aorta). Cross-clamping would be extremely hazardous. What is the preferred strategy?",
      options: [
        "Use an anaortic off-pump or clampless strategy",
        "Proceed with standard on-pump CABG with aortic cross-clamping as planned",
        "Abort the CABG and perform PCI instead",
        "Perform total arterial revascularization with cross-clamping at the more compliant proximal aorta"
      ],
      answer: 0,
      explain: "A calcified or porcelain ascending aorta is one of the primary indications for off-pump CABG or for clampless proximal anastomotic devices. Cross-clamping a calcified aorta risks dislodging calcium and particulate debris, causing devastating embolic stroke. Off-pump techniques (or clampless connectors allowing proximal anastomoses without clamping) mitigate this risk. This is a planned or intraoperative conversion decision that experienced CABG surgeons should anticipate."
    },
    {
      title: "CABG Operative Sequence: Overview",
      html: "<p>Understanding the operative sequence of CABG allows the student and junior trainee to anticipate each step, prepare instrumentation, and understand why each phase matters for outcomes. The broad sequence is: sternotomy, cannulation, conduit harvest, bypass establishment, distal anastomoses (on arrested heart for on-pump), proximal anastomoses, weaning from bypass, protamine, hemostasis, and closure.</p><ul><li><b>Conduit harvest:</b> LIMA takedown while sternotomy is being closed, simultaneous GSV/radial harvest by second team</li><li><b>Cardioplegia and arrest:</b> Protects myocardium during distal anastomosis construction</li><li><b>Distal anastomoses:</b> Constructed first (most critical — determines revascularization adequacy)</li><li><b>Proximal anastomoses:</b> GSV/radial connected to ascending aorta (with partial side-biting clamp, or off-pump with clampless connectors)</li><li><b>Reperfusion and weaning:</b> Cross-clamp released; heart reperfused; weaned from CPB with pacing and inotrope support as needed</li></ul><p>A few details give the sequence its logic. Targets are marked while the heart is still full and distended (they are easiest to find then), and the <b>arteriotomy is cut at least 1.5× the target's luminal diameter</b>, proximal enough for a big landing zone but clear of plaque — opening into a plaque can force an unplanned endarterectomy. Anastomoses are sewn with <b>continuous fine polypropylene (7-0 on the coronary, 5-0/6-0 at the aorta), the conduit beveled ~30° and parachuted down from the heel</b>. Order matters for protection: grafting the <b>most ischemic territory first</b> lets cardioplegia run antegrade down that finished graft, and the <b>LITA-to-LAD is customarily sewn last</b> to avoid tension on or disruption of that most precious anastomosis. The proximal (aortic) anastomoses can be done under the same cross-clamp or with a <b>side-biting partial-occlusion clamp</b> — the latter re-clamps the aorta and carries a measurably higher neurocognitive-injury risk, one more reason a diseased aorta pushes toward anaortic technique. Finally, weaning is not rushed: a common rule is to let the heart recover on full bypass roughly <b>10 minutes for every 60 minutes of cross-clamp time</b> before handing circulation back to the native heart.</p><p>One classic intra-operative trap lives inside this sequence: an <b>intramyocardial LAD</b> can be hard to find, and dissecting the wrong plane can inadvertently open the right ventricle — a low-pressure chamber usually closed with fine suture. When no soft, graftable segment can be found at all, <b>coronary endarterectomy</b> — coring the atheroma out of the vessel, most often the RCA — salvages an otherwise ungraftable target, at the price of a higher peri-operative MI rate and lower late patency than a standard anastomosis.</p>"
    }
  ]
};

/* ============================================================================
   PGY-5 DEPTH LAYER (Sequence 3, Day 7) — merged into the existing topic-lessons.
   level:4 = Senior Reasoning (designing the operation); level:5 = Mastery
   (defending it against the alternatives + intra-op surprises and rescues).
   ============================================================================ */

window.LESSONS["d6-conduits"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: reading the coronary map and designing the operation",
    html: `<p>The junior lists conduits. The senior reads the angiogram as a <b>map to be revascularized completely and durably</b>, and designs an operation around three questions for every target: <b>is the target worth grafting, what conduit fits it, and how will the inflow be arranged?</b></p>
<p><b>Target quality and distal run-off.</b> Graft every vessel <b>&gt; 1.5 mm</b> supplying viable myocardium, but only if the distal vessel is a usable, non-diffusely-diseased target with run-off. A graft onto a poor, calcified, or diffusely diseased distal vessel fails regardless of proximal technique.</p>
<p><b>Conduit-to-target matching.</b> The LIMA goes to the LAD — always, when feasible — because the most durable conduit protects the most important territory. Arterial grafts (radial, RIMA) are best matched to <b>tightly stenosed</b> targets; a vein is a reasonable choice for a large-caliber, high-flow target where an arterial graft would be wasted or exposed to competitive flow.</p>
<p><b>Competitive-flow avoidance.</b> Do <b>not</b> put an arterial graft on a <i>moderately</i> stenosed vessel. Native antegrade flow competes with the graft, the trans-graft gradient collapses, flow is sluggish, and the arterial graft <b>strings down</b> (the angiographic "string sign") and occludes. This is why grafts are reserved for hemodynamically significant lesions (≈ ≥ 70%, or ≥ 50% left main).</p>
<p><b>Inflow strategy.</b> In-situ LIMA (and RIMA) preserve native pulsatile inflow; composite <b>Y or T grafts off the LIMA</b> extend arterial inflow to multiple targets without touching the aorta — the backbone of an <b>anaortic</b> operation. Sequential (side-to-side then end-to-side) grafting reaches several compatible targets with one proximal anastomosis and less conduit, at the cost of shared-inflow jeopardy if the proximal anastomosis fails.</p>
<p><b>The numbers that certify the work.</b> Heparinize to <b>ACT &gt; 400 s</b> before cannulation; construct the distal anastomosis with <b>heel-and-toe</b> geometry and intimal-to-intimal apposition, avoiding plaque at the arteriotomy; and confirm each graft with <b>transit-time flow</b> — good mean flow, <b>low pulsatility index</b>, and a <b>diastolic-dominant</b> waveform. Low flow with a high PI is a technical problem to be found and revised <i>before</i> the chest closes.</p>`
  }
);

window.LESSONS["d6-indications"].chunks.push(
  {
    level: 5,
    title: "PGY-5 mastery: defending CABG vs PCI at the level of the trials themselves",
    html: `<p><b>Viva bar:</b> <i>"Diabetic, three-vessel, SYNTAX 29, EF 40% — argue CABG over PCI with the trials at design level."</i> The consultant does not name-drop; they deploy each trial's population, endpoint, and flaw.</p>
<ul>
  <li><b>FREEDOM (diabetes, multivessel).</b> 5-year primary composite (death/MI/stroke) <b>26.6% PCI vs 18.7% CABG</b>, absolute reduction <b>7.9%</b> — driven by fewer <b>deaths and MIs</b>, at the cost of <b>more early strokes</b> with CABG, and the <b>mortality benefit did not emerge until year 4–5</b>. The design caveat: enrolled largely before the newest-generation DES. For your diabetic three-vessel patient, this is the strongest single argument for CABG.</li>
  <li><b>EXCEL vs NOBLE (left main) — the controversy, not just the result.</b> EXCEL called PCI non-inferior on a composite, but used a <b>periprocedural-MI definition anchored on CK-MB (SCAI)</b> that inflated the <i>surgical</i> event count and drew a formal complaint; by other MI definitions the picture flips. At 5 years EXCEL showed <b>lower all-cause mortality with CABG (9.9% vs 13.0%)</b> and less repeat revascularization. NOBLE, using a <b>different MI definition that excluded periprocedural MI</b>, favored CABG with 5-year MACCE of <b>~28% PCI vs ~19% CABG</b>, driven by more spontaneous MI and repeat revascularization after PCI. Both trials were <b>industry-sponsored</b>. The honest synthesis: PCI performs more comparably in <i>lower-complexity</i> left main, and CABG's advantage widens with anatomic complexity.</li>
  <li><b>ART (BIMA vs SIMA) — the negative headline that survives mechanistically.</b> No 10-year survival benefit for BIMA by <b>intention-to-treat (HR ≈ 0.96)</b>, but ~40% crossover and 22% radial use blur the comparison; the patency biology of arterial grafting survives the null ITT result.</li>
  <li><b>RADIAL pooled analysis.</b> Radial artery beats saphenous vein for events and patency — <b>with the competitive-flow caveat</b>: the radial's advantage depends on grafting a tightly stenosed target.</li>
</ul>
<p>The mark of mastery is holding the two left-main trials in tension — same disease, opposite headlines, reconciled by <b>how each defined an MI</b> — rather than quoting whichever supports a pre-formed opinion.</p>`
  }
);

window.LESSONS["d6-technique"].chunks.push(
  {
    level: 5,
    title: "PGY-5 mastery: the intraoperative surprises and their rescues",
    html: `<p>The operative plan meets reality at two classic surprises, and the senior is judged by the <b>rescue</b>, not the plan.</p>
<p><b>The porcelain aorta discovered at the clamp.</b> You go to cross-clamp and find a rock — a circumferentially calcified ascending aorta with no safe clamp or proximal-anastomosis site. Clamping or side-biting it showers atheroemboli and causes stroke. The rescue is to <b>abandon aortic manipulation entirely</b>: convert to an <b>anaortic / off-pump</b> strategy using <b>in-situ LIMA (± RIMA) inflow with composite Y/T grafts</b> for the remaining targets, so not a single clamp, cannula, or proximal anastomosis touches the diseased aorta. Epiaortic ultrasound at the start of every case is what lets you <i>anticipate</i> this rather than discover it mid-clamp.</p>
<p><b>The new territory-specific wall-motion abnormality after separation.</b> You come off bypass and TEE shows a <b>new regional wall-motion abnormality</b> that was not there before — say, new inferior hypokinesis in the RCA/PDA territory. This is a <b>graft problem until proven otherwise</b>: kink, twist, spasm, competitive flow, an anastomotic error, or air down a native ostium. The error is to <b>medicate around it</b> — pushing inotropes and hoping. The rescue is to <b>interrogate</b>: check transit-time flow on the relevant graft, inspect its course and lie, de-air if that is the mechanism, and be prepared to <b>revise the anastomosis or return to bypass</b>. A poor target found at arteriotomy, likewise, is a moment to change the plan — endarterectomize, patch, or reselect the target — not to force a doomed anastomosis.</p>
<div class='kbox danger'><div class='kbox-tag'>DANGER</div><p>A new RWMA after separation from bypass is a surgical finding, not a pharmacologic one. Reaching for norepinephrine before interrogating the graft is how a salvageable technical error becomes a perioperative infarct.</p></div>`
  }
);

/* ---------------- Rotation-readiness merge: what to know before a CABG case (from guide front matter) ---------------- */

window.LESSONS["d6-technique"].chunks.push(
  {
    title: "Before you scrub for a CABG case: the six things to know",
    html: `<p>The generic pre-case questions (Day 1) apply to every operation; a CABG case adds a specific set of facts you should carry into the room. Knowing these lets you follow the operative decisions rather than merely watching hands move, and any one of them may be the question you are asked across the table.</p>
<ol>
  <li><b>Review the coronary angiogram (cath report).</b> Which vessels are diseased? What are the percent stenoses? Is there left main disease? These define the targets and the number of grafts.</li>
  <li><b>Know the LV function (EF from echo).</b> Normal, or mildly, moderately, or severely reduced? A low EF changes the threshold for on-pump support and myocardial-protection strategy.</li>
  <li><b>Know the conduit plan.</b> Is the LIMA being used (it should be, to the LAD)? Was the saphenous vein mapped? Is the radial artery an option — was an <b>Allen test</b> done to confirm ulnar collateral flow to the hand?</li>
  <li><b>Know the antiplatelet history.</b> When was the last aspirin? The last P2Y12 inhibitor (clopidogrel, ticagrelor, prasugrel)? Is the patient on anticoagulation? This drives bleeding risk and whether the case was delayed.</li>
  <li><b>Know the renal function.</b> Cr and eGFR — they affect contrast exposure and cardioplegia adjustments, and predict post-operative AKI risk.</li>
  <li><b>Know the booking.</b> Is this elective, urgent, or emergent? Urgency changes everything from antiplatelet timing to the whole risk conversation.</li>
</ol>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>If you can state the diseased vessels, the EF, the conduit plan, and the last dose of the P2Y12 inhibitor before you scrub, you already know more than enough to be genuinely useful — and to answer the three questions you are most likely to be asked.</p>
</div>`
  }
);

/* ============================================================================
   2021 ACC/AHA/SCAI CORONARY REVASCULARIZATION GUIDELINE — SYNTHESIS + WHEN
   PCI OR CABG IS PREFERRED (Top-10 messages; Sections 8, 3, 4). Merged into
   Day-7 (CABG) lesson d6-indications.
   ============================================================================ */

window.LESSONS["d6-indications"].chunks.push(
  {
    title: "The 2021 Guideline in One Page: Top 10 Take-Home Messages",
    html: `<p>The 2021 ACC/AHA/SCAI coronary revascularization guideline replaced the 2011 CABG and the 2011/2015 PCI guidelines. Its ten take-home messages are the scaffold everything else hangs on:</p>
<ol>
  <li><b>Equity:</b> revascularization decisions should be based on clinical indication <b>regardless of sex, race, or ethnicity</b>; reduce disparities of care.</li>
  <li><b>Heart Team:</b> when the optimal strategy is unclear, a multidisciplinary Heart Team with <b>shared, patient-centered decision-making</b>.</li>
  <li><b>Left main:</b> CABG to improve survival (COR 1); PCI reasonable (COR 2a) for <b>low-to-medium complexity</b> equally suitable for either.</li>
  <li><b>Three-vessel, normal EF:</b> CABG <b>may be reasonable</b> to improve survival (COR 2b); PCI survival benefit <b>uncertain</b>.</li>
  <li><b>Radial artery conduit</b> preferred over saphenous vein for the second-most-important target — better patency, fewer events, better survival.</li>
  <li><b>Radial artery access</b> for PCI (over femoral) reduces bleeding/vascular complications; in ACS also reduces mortality.</li>
  <li><b>Shorter DAPT</b> after PCI, transitioning to P2Y12 monotherapy, reduces bleeding in selected patients.</li>
  <li><b>Staged PCI</b> of a significant non-culprit artery in STEMI improves outcomes in selected patients; <b>non-culprit PCI in cardiogenic shock is harmful</b>.</li>
  <li><b>Diabetes + multivessel disease:</b> Heart Team; triple-vessel disease should get <b>CABG</b>; PCI if a poor surgical candidate.</li>
  <li><b>STS score</b> for surgical risk; SYNTAX score usefulness is <b>less clear</b> (interobserver variability, no clinical variables).</li>
</ol>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Two conceptual anchors run through all ten: <b>the Heart Team owns the ambiguous decision</b>, and <b>anatomy plus physiology plus patient context</b> — not a single number — drives the strategy.</p>
</div>`
  },
  {
    title: "When CABG Is Preferred: Complex Disease and Diabetes",
    html: `<p>Section 8 of the guideline names the situations where one strategy is clearly preferred over the other.</p>
<ul>
  <li><b>Left main with high-complexity CAD — CABG over PCI, COR 1:</b> to improve survival.</li>
  <li><b>Multivessel with complex/diffuse CAD (e.g., SYNTAX &gt;33) — CABG over PCI, COR 2a:</b> to confer a survival advantage.</li>
  <li><b>Diabetes + multivessel CAD involving the LAD — CABG (with LIMA→LAD) over PCI, COR 1 (LOE A):</b> reduces mortality and repeat revascularization (FREEDOM, BARI-2D). If a poor surgical candidate, PCI can be useful (COR 2a). For diabetes with left main and only low/intermediate complexity elsewhere, PCI may be an alternative (COR 2b).</li>
  <li><b>Cannot access/tolerate/adhere to DAPT — CABG over PCI, COR 2a:</b> a patient who cannot maintain DAPT is a poor stent candidate; a graft does not depend on prolonged DAPT.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>The DAPT-adherence recommendation is easy to forget and high-yield: <b>if a patient realistically cannot take dual antiplatelet therapy for its required duration, that fact alone can tip a multivessel decision toward CABG.</b></p>
</div>`
  },
  {
    title: "When PCI Is Preferred: Previous CABG",
    html: `<p>The patient who has already had bypass is a distinct decision. A <b>patent LIMA-to-LAD</b> is the single most protective feature they own, and the strategy is built around preserving it.</p>
<ul>
  <li><b>Previous CABG, patent LIMA→LAD, needs repeat revascularization — PCI over redo-CABG, COR 2a</b> when PCI is feasible: redo sternotomy risks injuring a patent, functioning LIMA and carries higher operative risk.</li>
  <li><b>Previous CABG, refractory angina from LAD disease, an IMA is available as a conduit to the LAD — CABG over PCI, COR 2a.</b></li>
  <li><b>Previous CABG, complex CAD, IMA available to LAD — CABG over PCI may be reasonable, COR 2b.</b></li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>At redo sternotomy a <b>patent LIMA graft crossing the midline</b> can be lacerated on re-entry — a catastrophic, often fatal event. This anatomic hazard is a major reason PCI is favored (COR 2a) for repeat revascularization when the LIMA-to-LAD is patent and PCI is feasible.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "A patient with previous CABG (patent LIMA to LAD, occluded vein grafts) develops recurrent angina from a diseased vein graft to the RCA, with a PCI-feasible native RCA lesion. How does the 2021 guideline weigh repeat CABG versus PCI?",
    options: [
      "Redo CABG is preferred to replace all failed grafts",
      "Medical therapy only; no revascularization is ever indicated after prior CABG",
      "PCI is preferred when feasible because redo CABG threatens the patent LIMA",
      "Emergency surgery regardless of feasibility of PCI"
    ],
    answer: 2,
    explain: "With a patent LIMA-to-LAD, the guideline gives COR 2a to choosing PCI over redo CABG when PCI is feasible. Redo sternotomy risks laceration of the patent LIMA and carries higher operative mortality, while the patent LIMA already protects the most important territory. Redo CABG is favored (COR 2a) mainly when refractory angina is due to LAD disease and an IMA can be used as the conduit to the LAD."
  }
);

/* ============================================================================
   2021 GUIDELINE — BYPASS CONDUITS (Section 12.2) + HYBRID REVASCULARIZATION.
   Merged into Day-7 (CABG) lesson d6-conduits.
   ============================================================================ */

window.LESSONS["d6-conduits"].chunks.push(
  {
    title: "The Guideline's Conduit Recommendations and Best Practices",
    html: `<p>The 2021 guideline formalizes the conduit hierarchy into graded recommendations and a best-practices table.</p>
<ul>
  <li><b>IMA (preferably left) to the LAD — COR 1:</b> when the LAD is bypassed, use an internal mammary artery to improve survival and reduce recurrent ischemia.</li>
  <li><b>Radial artery over saphenous vein — COR 1 (LOE B-R):</b> for the <b>second most important, significantly stenosed, non-LAD target</b>, the radial artery is preferred — better patency, fewer adverse cardiac events, improved survival (RADIAL pooled analysis). A Top-10 message.</li>
  <li><b>Bilateral IMA (BIMA) grafting — COR 2a:</b> by experienced operators in appropriate patients, to improve long-term outcomes.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY — CONDUIT BEST PRACTICES (TABLE 12)</div>
  <p>Assess palmar-arch/ulnar compensation before harvesting the radial and use the arm with the best compensation; graft the radial only to <b>subocclusive</b> (tightly stenosed) targets; <b>avoid the radial after transradial catheterization</b> and in CKD likely to progress to dialysis (preserve it for a fistula); give an oral <b>calcium-channel blocker for the first postoperative year</b>; <b>skeletonize the IMA</b> to reduce sternal-wound complications; use <b>endoscopic vein harvest</b> when wound risk is high and <b>no-touch</b> harvest when wound risk is low; a skeletonized <b>right gastroepiploic artery</b> can graft a subocclusive RCA target in experienced hands.</p>
</div>`
  },
  {
    title: "Hybrid Coronary Revascularization",
    html: `<p><b>Hybrid coronary revascularization</b> deliberately combines the two strategies to give each territory its best treatment: a <b>minimally invasive/robotic LIMA-to-LAD</b> (the graft with unmatched durability protecting the most important territory) plus <b>PCI of the non-LAD vessels</b> (avoiding vein grafts, which fail faster than stents in many targets). It can be done as one procedure in a hybrid suite or staged.</p>
<p>The 2021 guideline classifies hybrid revascularization among the <b>unanswered questions / future directions</b> (Section 17): it is a reasonable option in selected patients — for example, when a durable LIMA-to-LAD is desired but the aorta is heavily calcified or the non-LAD anatomy is favorable for PCI — but robust randomized outcome data are still limited.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>The logic of hybrid revascularization is the same logic that makes LIMA-to-LAD sacrosanct: <b>match the most durable conduit to the most important territory</b>, and treat the rest with whatever gives the best patency for that specific target.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "Per the 2021 guideline's conduit best practices, when should the radial artery be avoided as a bypass conduit?",
    options: [
      "In every patient, because vein grafts are always superior",
      "Only in patients younger than 40",
      "Recent radial access or likely future dialysis access",
      "Whenever the LIMA is also being used"
    ],
    answer: 2,
    explain: "The guideline's best-practices table advises avoiding the radial artery after transradial catheterization (instrumentation causes intimal injury and poor conduit performance) and in patients with CKD at high risk of progression to hemodialysis (the radial should be preserved for future arteriovenous fistula access). It also advises grafting the radial only to subocclusive targets to avoid competitive flow, and giving a calcium-channel blocker for the first postoperative year."
  }
);

/* ============================================================================
   2021 GUIDELINE — CABG PROCEDURE, GLYCEMIC/WOUND, PERI-CABG ANTIPLATELET
   (Sections 12.1, 12.3, 12.5, 13.1, 13.2). Merged into Day-7 lesson d6-technique.
   ============================================================================ */

window.LESSONS["d6-technique"].chunks.push(
  {
    title: "Perioperative Programs and CPB Decisions (2021 Guideline)",
    html: `<p>The guideline treats the perioperative <b>system</b> as part of the operation.</p>
<ul>
  <li><b>Enhanced-recovery perioperative program — COR 1:</b> a multidisciplinary, evidence-based program (ERAS-cardiac) to optimize analgesia, <b>minimize opioid exposure</b>, prevent complications, and reduce time to extubation, length of stay, and cost.</li>
  <li><b>CABG during other cardiac surgery — COR 1:</b> in patients having valve, aortic, or other cardiac surgery who have <b>significant</b> CAD, add CABG to reduce ischemic events; for <b>intermediate</b> CAD it may be reasonable (COR 2b).</li>
  <li><b>Epiaortic ultrasound — COR 2a:</b> routine scanning of the ascending aorta to locate plaque and reduce atheroembolic (stroke) complications.</li>
  <li><b>Avoid aortic manipulation with significant aortic calcification — COR 2a:</b> off-pump/beating-heart or anaortic techniques (by experienced surgeons) reduce perioperative stroke.</li>
  <li><b>Significant pulmonary disease — COR 2b:</b> off-pump surgery may reduce perioperative risk in experienced hands.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Note the guideline's framing of off-pump: it is not "better for everyone," but a <b>targeted tool</b> to avoid manipulating a diseased aorta or to spare a patient with severe pulmonary disease the physiologic hit of CPB — used by <b>experienced</b> surgeons.</p>
</div>`
  },
  {
    title: "Glycemic Control and Sternal Wound Prevention",
    html: `<p>Deep sternal wound infection is a devastating CABG complication; the guideline is prescriptive about preventing it.</p>
<ul>
  <li><b>Intraoperative insulin infusion — COR 1:</b> continuous insulin to keep serum glucose <b>&lt;180 mg/dL</b> to reduce sternal wound infection.</li>
  <li><b>Early postoperative glucose &lt;180 mg/dL — COR 1:</b> continuous IV insulin to achieve/maintain it <b>while avoiding hypoglycemia</b>, reducing deep sternal wound infection and other adverse events.</li>
  <li><b>Comprehensive wound-infection bundle — COR 1:</b> a multi-element approach (skin prep, antibiotic prophylaxis timing, IMA skeletonization, glycemic control, etc.).</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>Do not chase an overly tight intraoperative glucose &lt;140 mg/dL</b> — the guideline calls its usefulness uncertain (COR 2b), and tight targets risk hypoglycemia. The evidence-based target is <b>&lt;180 mg/dL while avoiding hypoglycemia</b>, not the tightest possible number.</p>
</div>`
  },
  {
    title: "Antiplatelet Management Around CABG",
    html: `<p>Timing antiplatelet therapy around bypass balances graft thrombosis against surgical bleeding.</p>
<ul>
  <li><b>Continue aspirin to the time of surgery — COR 1:</b> in patients already on daily aspirin, to reduce ischemic events.</li>
  <li><b>Urgent CABG — COR 1:</b> discontinue clopidogrel and ticagrelor for <b>at least 24 h</b> before surgery to reduce major bleeding.</li>
  <li><b>Elective CABG on a P2Y12 inhibitor — COR 2a:</b> stop <b>clopidogrel 5 days, ticagrelor 3 days, prasugrel 7 days</b> before surgery.</li>
  <li><b>Short-acting GP IIb/IIIa inhibitors — COR 1:</b> stop eptifibatide/tirofiban 4 h and abciximab 12 h before surgery.</li>
  <li><b>Aspirin after CABG — COR 1 (LOE A):</b> 100–325 mg started <b>within 6 h</b> postoperatively, continued indefinitely, to reduce SVG closure.</li>
</ul>
<div class="kbox danger">
  <div class="kbox-tag">DANGER — WHEN NOT TO</div>
  <p><b>In an aspirin-naïve patient having elective CABG, do not start aspirin in the immediate preoperative period (&lt;24 h before surgery)</b> — COR 3: No Benefit. It does not help and adds bleeding. The place for aspirin is <b>after</b> surgery (within 6 h), where it protects vein grafts.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "An elective CABG patient is on ticagrelor. Per the 2021 guideline, how many days before surgery should ticagrelor be discontinued to reduce major bleeding and transfusion?",
    options: [
      "7 days, the same as prasugrel",
      "3 days",
      "It should never be stopped before CABG",
      "24 hours, the same as for urgent surgery"
    ],
    answer: 1,
    explain: "For elective CABG in patients on a P2Y12 inhibitor, the guideline (COR 2a) recommends discontinuing clopidogrel 5 days, ticagrelor 3 days, and prasugrel 7 days before surgery. Ticagrelor's shorter recommended interval (3 days) reflects its reversible binding and faster offset. For urgent CABG, clopidogrel and ticagrelor should be stopped at least 24 hours before surgery (COR 1)."
  }
);
