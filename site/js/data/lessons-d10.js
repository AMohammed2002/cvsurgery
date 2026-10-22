window.LESSONS = window.LESSONS || {};

window.LESSONS["d10-circuit"] = {
  id: "d10-circuit",
  day: 2,
  ord: 1,
  title: "The CPB Circuit & Cannulation",
  short: "CPB Circuit",
  minutes: 20,
  chunks: [
    {
      title: "Why CPB Exists: Replacing Heart and Lungs",
      html: `<p>You cannot operate inside a beating, blood-filled heart — it moves, it is full of blood, and the moment you stop it the patient's brain begins to die for lack of oxygen. Cardiopulmonary bypass is the elegant workaround: a machine that <b>temporarily becomes the patient's heart and lungs</b>, so the real ones can be stopped and opened. Think of it like re-routing traffic around a construction site — blood is diverted out of the body <em>before</em> it reaches the right atrium, sent through an artificial lung that adds oxygen and blows off CO₂, and pumped back into the aorta downstream, while the heart and lungs sit quietly out of the loop.</p>
<p>The key to actually understanding the circuit — rather than memorising a row of boxes — is to see that every component solves one of just four problems: <b>how to drain</b> blood out reliably, <b>how to exchange gas</b> outside the body, <b>how to push it forward</b> without shredding the red cells, and <b>how to keep air and debris</b> out of the patient. Learn the circuit as four jobs and you can troubleshoot it live; memorise it as a parts list and you can only name what has already gone wrong.</p>
<p>Two facts from Cohn keep the diagram honest. First, none of this is possible without <b>anticoagulation</b>: the moment blood meets the enormous synthetic surface area of the tubing, reservoir, and oxygenator it will clot, so full heparinisation is a non-negotiable prerequisite, not a refinement. Second, going on bypass is a large <b>volume shift</b> — as much as <b>1–3 litres of the patient's blood is translocated from body into circuit</b> the instant full CPB begins, which is why the reservoir must hold a buffer and why the moment of initiation is watched so closely. Cohn also stresses that the circuit is really <b>three loops running in parallel</b>: the main systemic loop that replaces heart and lungs, a separate <b>cardioplegia loop</b> (its own pump, sharing the oxygenator's blood), and a <b>suction/vent loop</b> that returns field and cavity blood through a cardiotomy reservoir before it rejoins the main flow.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Circuit flow path: venous cannula(s) &rarr; venous reservoir &rarr; membrane oxygenator/heat exchanger &rarr; arterial pump &rarr; arterial line filter &rarr; arterial cannula &rarr; patient. A separate cardioplegia circuit and a suction/vent circuit run in parallel. The reservoir's buffer volume also buys the perfusionist <b>a few seconds of reaction time</b> if venous return is suddenly interrupted.</p>
</div>`
    },
    {
      title: "Venous Drainage: Bicaval vs. Two-Stage Cannulation",
      html: `<p>Venous drainage is the rate-limiting step of the entire circuit — the pump can only return what the venous side delivers, so problems here manifest immediately as falling reservoir volume and falling flow. Drainage is classically <b>passive</b>, powered by gravity siphon (the reservoir hangs below the patient), or <b>augmented</b> — vacuum-assisted venous drainage (VAVD) applies a regulated negative pressure to a closed hard-shell reservoir. VAVD lets you use smaller, longer, peripheral cannulae, but Cohn flags the tradeoff bluntly: added negative pressure raises the risk of <b>aspirating micro-air</b> (with cerebral injury), causing hemolysis, or pulling air into the blood phase of a hollow-fiber oxygenator — and, conversely, <em>positive</em> pressure in the reservoir can push air backward into the venous line and the right heart. VAVD therefore demands dedicated safety monitors and protocols.</p>
<p>Two cannulation strategies exist, and the choice is dictated by whether the right atrium must be entered:</p>
<ul>
  <li><b>Single two-stage venous cannula:</b> placed through the right atrial appendage, with one drainage stage in the IVC and a wider basket draining the RA itself. Used for CABG and any procedure that leaves the RA closed.</li>
  <li><b>Bicaval cannulation:</b> separate cannulae in the SVC and IVC with snares (caval tapes), isolating the RA so it can be opened for valve, septal or tricuspid work without losing drainage or entraining air.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>If the venous reservoir level is falling rapidly and the perfusionist has not changed flow settings, the first question is always: has the venous cannula kinked, migrated against the atrial wall, or lost siphon (a "chattering" line)? Reflexive volume administration without addressing drainage delays the real fix.</p>
</div>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Watch for a <b>persistent left SVC (PLSVC)</b> — present in 0.3–0.5% of people, suspected when the left innominate vein is small/absent or a <b>dilated coronary sinus</b> appears on baseline TEE. It usually drains into the coronary sinus (so it can flood the field and <em>defeat retrograde cardioplegia</em>), and in ~10% drains to the LA. If the innominate vein is inadequate it cannot simply be snared without risking cerebral venous hypertension — it must be drained.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A mitral valve repair requires the right atrium to be opened. Which venous cannulation strategy is required, and why?",
      options: [
        "Single two-stage venous cannula — it drains both the SVC and IVC territories adequately",
        "Femoral venous cannulation alone — avoids right atrial instrumentation entirely",
        "No special cannulation is needed since the RA is not part of the venous circuit",
        "Bicaval cannulation with caval snares to isolate the right atrium"
      ],
      answer: 3,
      explain: "Bicaval cannulation places separate cannulae in the SVC and IVC with caval snares, isolating venous return from the right atrium itself. This allows the RA to be opened for valve or septal surgery without losing venous drainage or entraining air. The single two-stage cannula drains from within the RA and cannot be used once the RA is opened."
    },
    {
      title: "The Venous Reservoir",
      html: `<p>The venous reservoir is essentially a bathtub in the circuit — a chamber that collects drained blood and holds a buffer volume before it flows on to the oxygenator. That buffer is what smooths out the moment-to-moment mismatch between how fast blood drains in and how fast the pump sends it out. Just as importantly, it is the one part of the circuit the perfusionist can <b>watch by eye</b>, so its level is the single fastest warning sign of trouble anywhere — a kinked cannula, sudden bleeding, or a volume problem all show up first as a falling reservoir.</p>
<p>And like a bathtub, the cardinal sin is letting it run dry. If the level drops below the outlet port, the pump starts sucking <b>air</b> instead of blood and delivers it straight up the arterial line to the brain and coronaries — a catastrophic air embolism. This is why the reservoir carries visual markings and low-level alarms, and why "watch the level" is the perfusionist's constant discipline.</p>
<p>Cohn frames the reservoir as a <b>high-capacitance, low-pressure</b> receiving chamber that does five jobs at once: it holds the buffer volume, facilitates gravity drainage, acts as a <b>venous bubble trap</b>, gives an access point for drugs/fluids/blood, and — crucially — provides <b>several seconds of reaction time</b> if venous return suddenly falls. It comes in two designs, and the choice is a real tradeoff. The <b>open, rigid hard-shell canister</b> is versatile — larger capacity, easy to prime, cheaper, permits vacuum-assisted drainage, lets the perfusionist see and manage venous air directly, and can double as a cardiotomy reservoir — but its silicone antifoam compounds can shed microemboli and it activates blood elements across a large blood–air interface. The <b>closed, collapsible soft bag</b> eliminates that blood–gas interface (less inflammation, fewer gaseous microemboli) and, by collapsing when empty, physically <b>reduces the risk of pumping a massive air embolus</b> if venous return is abruptly lost — but it surrenders the open reservoir's versatility and the option of vacuum assist.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>An empty or near-empty venous reservoir is a circuit emergency. The perfusionist will immediately reduce or stop arterial pump flow to prevent air from being pumped into the patient — communicate any sudden drop in venous return to the surgeon and perfusionist instantly. Aside from open stopcocks and air in the heart, Cohn notes the <b>cardiotomy reservoir is the single largest source of gaseous emboli</b> in a membrane-oxygenator circuit — another reason excessive suction is not free.</p>
</div>`
    },
    {
      title: "The Oxygenator and Heat Exchanger",
      html: `<p>Modern CPB circuits use a <b>hollow-fiber membrane oxygenator</b>: Cohn describes sheaves of thousands of microporous hollow fibers, with <b>gas flowing inside the fibers and blood flowing outside</b>, across the aggregate surface. Oxygen diffuses in and CO₂ diffuses out across the fiber wall, mimicking the alveolar–capillary interface without ever letting gas bubble directly through blood. That separation is the whole point — the older bubble oxygenators, which sparged gas straight into the blood, caused far more hemolysis, protein denaturation, and gaseous microemboli, which is why they were abandoned.</p>
<p>Two gas controls sit on the oxygenator, and it helps to map them to the native lung: the <b>FiO₂</b> of the sweep gas sets oxygenation (like inspired O₂), and the total <b>sweep-gas flow rate</b> sets CO₂ removal (like minute ventilation) — turn the sweep up to blow off CO₂, turn FiO₂ up to raise the pO₂. The <b>heat exchanger</b> is built into the same module, circulating temperature-controlled water to cool or rewarm the blood; this is what enables systemic hypothermia (to cut metabolic demand during low-flow or circulatory arrest) and controlled rewarming before separation. Temperature is watched at several sites (perfusate, nasopharyngeal, bladder/rectal) because compartments equilibrate at different rates — the "core" warms long before the periphery, setting up the ICU "afterdrop."</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Rewarming is deliberately capped: perfusate and arterial temperatures are kept <b>at or below ~37°C</b> and never allowed to overshoot, because cerebral <b>hyperthermia</b> during rewarming worsens neurologic injury, and warming blood too fast drives dissolved gas out of solution as micro-bubbles.</p>
</div>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Oxygenator outlet pO2 should be well above 200 mmHg. A low outlet pO2 despite adequate gas flow points to oxygenator failure (membrane fouling, gas supply problem) and requires immediate perfusionist troubleshooting — occasionally an emergency oxygenator change.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why do membrane oxygenators cause less hemolysis and microembolic load than older bubble oxygenators?",
      options: [
        "No direct blood-gas bubbling",
        "Membrane oxygenators run at lower flow rates",
        "Membrane oxygenators do not require a heat exchanger",
        "Membrane oxygenators use lower FiO2 to reduce oxidative injury"
      ],
      answer: 0,
      explain: "Bubble oxygenators bubble gas directly through blood, causing protein denaturation, hemolysis, and gaseous microemboli at the blood-gas interface. Membrane oxygenators use a semi-permeable membrane that permits gas exchange (O2 in, CO2 out) without direct blood-gas contact, closely mimicking the alveolar-capillary membrane and dramatically reducing hemolysis and embolic load — the reason they became the modern standard."
    },
    {
      title: "Roller Pumps vs. Centrifugal Pumps",
      html: `<p>The arterial pump is the machine's "heart," and the two designs behave in opposite ways when something downstream goes wrong — which is the whole reason the distinction matters. A <b>roller pump</b> works like a hand squeezing toothpaste along a tube: rollers compress the tubing in sequence, so flow depends only on how fast they spin and is essentially <em>fixed</em> regardless of what is downstream. That is a hidden danger — if the arterial line kinks or is clamped, the roller keeps squeezing anyway and line pressure climbs until something tears (classically, an aortic dissection at the cannula).</p>
<p>Cohn adds the numbers that make the roller pump's danger concrete. Its flow depends on four things — tubing internal diameter, rotation rate (RPM), the length of the compression raceway, and how completely the rollers "occlude" the tube — and the occlusion is deliberately set to be <b>barely non-occlusive</b>, tuned against a standing fluid column that produces about <b>45–75 mmHg</b> of back pressure (tighter and you get hemolysis and tubing wear; looser and you get backflow). Because it is <em>afterload-independent</em>, it will keep generating flow into an obstructed line until a connection ruptures. Its other liabilities are specific: shedding of microparticles from the compressed tubing (<b>spallation</b>), the potential to propel air if run carelessly, and the possibility of massive air embolism. For those reasons roller pumps are now mostly relegated to the <b>sucker systems and cardioplegia delivery</b> rather than the main arterial line.</p>
<p>A <b>centrifugal pump</b> works more like a spinning whirlpool (an impeller creating a pressure gradient), and this gives it a built-in safety valve: if resistance rises or venous return falls, flow simply <em>drops off</em> rather than building runaway pressure — a whirlpool cannot force fluid through a blocked pipe. Cohn quantifies the gentler physics: it generates up to <b>~900 mmHg of forward pressure but only 400–500 mmHg of negative pressure</b>, which means less cavitation and fewer gaseous microemboli than a roller pump can produce. It can pump small amounts of air but becomes <b>"deprimed" once more than ~30–50 mL of air</b> enters the blood chamber. That forgiveness, plus better handling of red cells, is why centrifugal pumps are the default main-circuit and long-term-assist pump at most high-volume centres.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Because centrifugal pumps are flow-limited by resistance and preload, they cannot pump against a fully occluded line the way a roller pump can — inherently safer against a cannulation or clamp mishap. The price is two-fold: they need a <b>flow probe</b> (pump RPM alone does not tell you delivered flow), and because they are non-occlusive, if the pump stops the <b>arterial line must be clamped immediately</b> or blood will run backward from the aorta into the circuit — a hazard the roller pump's own occlusive rollers make impossible.</p>
</div>`
    },
    {
      title: "The Arterial Line Filter and Arterial Cannulation",
      html: `<p>Just before blood returns to the patient, it passes through an arterial line filter, which removes microemboli — platelet-fibrin aggregates, fat globules, air microbubbles, and particulate debris generated throughout the circuit — before they can reach the cerebral, coronary, or systemic circulation. This filter is one of the most important safeguards against the neurocognitive and embolic complications of bypass.</p>
<p>The arterial cannula returns blood under pressure to the systemic circulation, and the choice of site is really a choice about <b>which direction the blood (and any debris) travels</b>:</p>
<ul>
  <li><b>Ascending aorta:</b> the standard for most primary operations — short, direct, high-flow <em>antegrade</em> return. The one prerequisite is a landing zone free of dangerous atheroma, which is why Cohn stresses palpation and, in the high-risk aorta, <b>epiaortic ultrasound</b> before committing the cannula.</li>
  <li><b>Femoral artery:</b> the fallback for redo sternotomy (to be on bypass before the saw touches a heart that may be stuck to the sternum) and for crash/emergency access. Its liability is that flow runs <em>retrograde</em> up a diseased aorta — pushing atheroma toward the brain — plus the risk of lower-limb ischemia beyond the cannula.</li>
  <li><b>Axillary/subclavian artery:</b> increasingly preferred for arch work and redos because it restores <em>antegrade</em> flow (debris travels away from the arch vessels) and, cannulated via a side-graft, allows <b>selective antegrade cerebral perfusion</b> through the innominate during circulatory arrest. Cohn lists its own price: brachial plexus injury and axillary artery thrombosis.</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>The unifying rule: <b>the diseased aorta chooses the cannula.</b> A clean ascending aorta takes the direct central cannula; a heavily atheromatous or "porcelain" aorta pushes you to the axillary (antegrade, away from the arch) — or to an anaortic off-pump strategy entirely — because the dominant danger is stroke from dislodged atheroma.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "During CPB, the perfusionist notes the arterial line pressure is rising sharply on a roller pump while flow is unchanged. What is the most immediate concern?",
      options: [
        "The oxygenator membrane has failed",
        "The venous reservoir is empty",
        "The patient has developed vasoplegia",
        "Downstream arterial-line obstruction"
      ],
      answer: 3,
      explain: "Roller pumps generate a fixed flow largely independent of downstream resistance. A rising line pressure with unchanged flow indicates an obstruction (kink, clamp, cannula malposition, or aortic dissection at the cannulation site) — because the pump keeps pushing against this obstruction, the risk is arterial line rupture or, most dangerously, an aortic dissection at the cannulation site. This is a key safety difference from centrifugal pumps, which are inherently pressure-limited."
    },
    {
      title: "Heparin and ACT Before Cannulation",
      html: `<p>Full anticoagulation must be established before any cannula touches the circuit, because blood exposed to the enormous synthetic surface area of the CPB circuit will clot almost immediately without it. Heparin is dosed at approximately 300–400 units/kg IV bolus prior to cannulation, and adequacy of anticoagulation is confirmed with the activated clotting time (ACT) — a bedside test of whole-blood clotting time that is prolonged far beyond the normal range by therapeutic heparin.</p>
<p>Cohn is precise about the thresholds. The <b>generally accepted minimum ACT is ≥400 seconds</b>, but many groups use <b>≥480 seconds</b> because heparin only <em>partially</em> inhibits thrombin generation during CPB; a few centres, trying to reduce surgical bleeding, have argued for accepting ACTs in the 300s, but that is not yet generally accepted. The anticoagulant effect is measured about <b>3 minutes</b> after the bolus. On bypass, ACT (or the more reproducible Hepcon heparin-concentration test) is rechecked every <b>~30 minutes</b>, and a practical rule is to re-give roughly <b>one-third of the initial bolus every hour</b> — because heparin's apparent effect wanes with hemodilution, consumption, and hypothermia.</p>
<p>A crucial troubleshooting point: if a <b>full 500 units/kg fails to prolong the ACT</b>, the problem is usually not the heparin dose but a <b>low antithrombin (AT) level</b> — heparin works only by accelerating antithrombin (it speeds that reaction roughly a thousand-fold), so "heparin resistance" is treated by giving antithrombin as fresh-frozen plasma or recombinant AT-III, not simply by piling on more heparin. Note also that excessively high concentrations (ACT &gt; 1000 s) can paradoxically cause remote bleeding.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Initiating CPB with an inadequate ACT allows thrombus formation within the oxygenator and reservoir, with microthrombi embolizing to the brain, coronaries, kidneys, and mesentery. Most perfusionists will not initiate bypass until the target ACT is confirmed — this is a hard safety checkpoint, not a formality. If ACT will not rise despite adequate heparin, suspect antithrombin deficiency rather than under-dosing.</p>
</div>`
    },
    {
      title: "Flow Targets, DO2, and MAP Goals on Bypass",
      html: `<p>Once on full bypass, the perfusionist sets pump flow to meet the body's metabolic demand rather than simply mimicking a resting cardiac output. The anchor number from Cohn: at <b>35–37°C with a hematocrit of 25%, flow of ~2.4 L/min/m²</b> supports a deeply anesthetized, muscle-relaxed adult. That figure is <em>higher</em> than a normal resting cardiac index for a reason — hemodilution has cut arterial oxygen content roughly in half (from ~20 to ~10–12 mL/dL), so the circuit must move more blood to deliver the same oxygen.</p>
<p>Oxygen delivery (DO2) is flow × arterial O2 content, so it is defended with exactly two levers: <b>raise pump flow</b> or <b>raise hematocrit</b>. Hypothermia buys margin on the demand side — it cuts oxygen consumption by a factor of ~0.5 per 10°C — which lets flow be safely turned down. Cohn quantifies the safe floors (flow kept high enough to permit ≥85% of maximal O2 consumption): about <b>1.8 L/min/m² at 30°C, 1.6 at 25°C, and 1.0 at 18°C</b>. If total flow is dropped further, organs de-perfuse in a fixed hierarchy — skeletal muscle first, then abdominal viscera and bowel, then finally the kidneys.</p>
<p>Mean arterial pressure on bypass is a separate dial. Cerebral autoregulation is preserved down to roughly <b>50–60 mmHg</b>, and Cohn cites the one prospective RCT showing <b>lower combined morbidity/mortality when MAP was held near 70 (avg 69) versus below 60 (avg 52)</b> — which is why older or vasculopathic patients are run at <b>MAP 70–80 mmHg</b>. Pressure is <em>not</em> pushed higher than needed, because excess pressure drives collateral bronchial/coronary flow that floods the operative field. When MAP is low, the differential is deliberate: low pump flow, aortic dissection, a measurement artifact, or vasoplegia — treated with <b>phenylephrine or vasopressin (0.05–0.1 U/min)</b>, not reflexively with more volume.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>DO2 = Flow &times; O2 content.</b> If DO2 looks marginal on bypass, the perfusionist has exactly two levers: raise pump flow, or raise hematocrit (transfuse). Everything else is downstream of these two variables.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why is maintaining MAP above approximately 65–70 mmHg during CPB specifically protective against acute kidney injury?",
      options: [
        "Higher MAP increases heparin clearance",
        "Higher MAP prevents hemolysis in the oxygenator",
        "MAP has no relationship to renal perfusion during CPB",
        "Adequate MAP preserves renal-medullary perfusion"
      ],
      answer: 3,
      explain: "The renal outer medulla operates near the edge of its oxygen delivery reserve even under normal physiologic conditions because the countercurrent-concentrating mechanism is metabolically demanding while medullary blood supply is sparse. Non-pulsatile CPB flow further reduces medullary perfusion. Maintaining adequate MAP defends the perfusion pressure gradient to this vulnerable territory, which is why MAP (alongside minimizing total CPB duration) is one of the few modifiable protective factors against post-CPB AKI."
    },
    {
      title: "Alpha-Stat vs. pH-Stat Blood Gas Management",
      html: `<p>During hypothermic CPB, blood gases can be managed by one of two strategies that differ in how they interpret and correct pH and pCO2 measurements for the patient's actual (cold) blood temperature versus a standardized 37°C reference. This is not a trivial technical detail — the choice affects cerebral blood flow regulation and has real clinical implications during deep hypothermia.</p>
<ul>
  <li><b>Alpha-stat:</b> Blood gases are interpreted and managed at the standard 37°C reference values without temperature correction, allowing pH to rise (become more alkalotic) as temperature falls — this preserves normal enzyme function and intracellular electrochemical neutrality. Alpha-stat maintains normal cerebral autoregulation (flow tracks metabolic demand) and is generally preferred for adult, non-deep-hypothermic cases.</li>
  <li><b>pH-stat:</b> Blood gases are temperature-corrected to the patient's actual core temperature and CO2 is added to the sweep gas to maintain a "normal" pH at the cold temperature. This causes cerebral vasodilation and increases cerebral blood flow independent of metabolic demand — beneficial for more uniform brain cooling before deep hypothermic circulatory arrest, but at the cost of losing flow-metabolism coupling (and theoretically increasing embolic load to the brain during rewarming).</li>
</ul>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Practical rule of thumb: alpha-stat for routine hypothermic CPB (preserves autoregulation); pH-stat during cooling for procedures requiring deep hypothermic circulatory arrest (promotes uniform, rapid cerebral cooling).</p>
</div>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>"pH-stat adds Ph-luff — more flow to the brain."</b> pH-stat adds CO₂, dilating cerebral vessels and <b>increasing</b> cerebral blood flow (good for cooling the brain uniformly before DHCA). Alpha-stat leaves flow coupled to metabolism (better for routine adult cases). Think: <b>pH-stat = Plumbing opened wide; Alpha-stat = Autoregulation preserved.</b></p>
</div>`
    },
    {
      title: "Hemodilution, Hematocrit, and Modified Ultrafiltration",
      html: `<p>The CPB circuit must be primed with fluid (crystalloid, sometimes with added colloid or blood products) before bypass begins, and this priming volume — typically on the order of 1.5–2 liters — mixes with the patient's own blood volume the instant bypass starts. The result is acute hemodilution: a patient with a preoperative hemoglobin of 13 g/dL may see it fall to 8–9 g/dL on bypass purely from dilution, before any surgical blood loss is even considered.</p>
<p>This hemodilution is a deliberate tradeoff, and Cohn gives an elegant rule for how far to take it: <b>viscosity stays roughly constant when the hematocrit number equals the temperature in °C</b> — so a hematocrit of 20% "matches" 20°C, and 37% matches 37°C. That is why a cold bypass at 26–28°C tolerates a hematocrit as low as <b>18–22%</b> (the cold thins nothing dangerously, and low viscosity actually helps microcirculatory flow), whereas a warm bypass near normothermia cannot afford that dilution because pump-flow limits can no longer meet oxygen demand. The floor is not merely theoretical: Cohn cites data (DeFoe) showing <b>rising hospital mortality once hematocrit falls below ~23% on CPB</b>, so most programs now aim for <b>25–30%</b> in adults, accepting a little transfusion for a safer oxygen margin.</p>
<p>The reduced oxygen-carrying capacity is the price of dilution, which is why DO2 must be actively defended by flow and, if hematocrit falls too low, by transfusion.</p>
<p>Modified ultrafiltration (MUF) is a technique applied near the end of bypass (or immediately after separation) in which blood is passed through a hemoconcentrator that removes excess plasma water while retaining red cells, platelets, and clotting factors. It concentrates the blood, raises hematocrit, and removes inflammatory mediators accumulated during CPB, and is used especially in pediatric and select adult cases to mitigate the hemodilutional and inflammatory burden of bypass before the patient leaves the OR.</p>`
    },
    {
      type: "checkpoint",
      q: "What is the primary purpose of modified ultrafiltration (MUF) applied at the end of CPB?",
      options: [
        "To reverse heparin anticoagulation",
        "To rewarm the patient more rapidly",
        "To remove excess plasma water",
        "To filter arterial line microemboli before decannulation"
      ],
      answer: 2,
      explain: "Modified ultrafiltration passes blood through a hemoconcentrator that selectively removes plasma water while preserving cellular and protein components. This concentrates the diluted post-CPB blood, raising hematocrit, and simultaneously clears some of the inflammatory cytokines and complement fragments generated by circuit exposure — mitigating both the hemodilutional and inflammatory consequences of bypass before the patient leaves the operating room."
    },
    {
      title: "Pump Troubleshooting: High Line Pressure, Low Venous Return, Air Lock",
      html: `<p>Recognizing circuit problems quickly — and knowing which are perfusionist-only fixes versus which require immediate surgeon involvement — is a core competency for anyone in the operative field during bypass. Three scenarios recur often enough that every trainee should be able to reason through them immediately.</p>
<ul>
  <li><b>High arterial line pressure:</b> Suggests obstruction downstream of the pump — a kinked cannula, a clamped line, cannula malposition against the aortic wall, or (most dangerously) an aortic dissection at the cannulation site. On a roller pump this is a true emergency, since the pump will continue generating flow against the obstruction.</li>
  <li><b>Low venous return / falling reservoir level:</b> Suggests a drainage problem — venous cannula kink or malposition, inadequate cannula size for the flow demanded, or true hypovolemia. Also consider a "chattering" venous line (intermittent collapse of the atrial wall against the cannula tip, worsened by excessive vacuum-assisted drainage).</li>
  <li><b>Air lock in the venous line:</b> Air trapped in the venous line (from a loose connection, an open vent, or a leaking purse-string) can obstruct siphon drainage entirely, causing venous return to fall precipitously despite normal patient volume status. This requires immediate perfusionist intervention to clear the air and re-establish siphon.</li>
</ul>
<p>Behind these three lies a theme Cohn returns to repeatedly: <b>gas can enter the perfusate from many sources</b>, and knowing them lets you localise a problem fast. The recognised entry points include stopcocks and sampling/injection sites, priming solutions and procedures, vents, tears or loose connections, <b>loose purse-string sutures — especially during vacuum-assisted (augmented) venous drainage</b>, rapid rewarming of cold blood (gas comes out of solution), cavitation, and a <b>venous reservoir run too low</b>. Aside from frank technical errors (open stopcock, empty reservoir, air in the heart), the <b>cardiotomy reservoir is the single largest source of gaseous microemboli</b> in a membrane-oxygenator circuit — which is exactly why excessive field suction is discouraged and why VAVD, though it lets you use smaller cannulae, is double-edged: too much negative pressure aspirates micro-air and causes hemolysis, while <em>positive</em> pressure in a closed reservoir can push air backward into the venous line and right heart.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Sudden high arterial line pressure with new pallor or swelling around the aortic cannulation site should raise immediate concern for aortic dissection — stop the pump, and do not resume arterial flow until the surgeon has assessed the cannulation site. On a roller pump this is time-critical, because the afterload-independent pump keeps driving flow into the false lumen and enlarges the dissection until it is stopped.</p>
</div>`
    },
    {
      title: "The Left Heart Vent and Cardiotomy Suction",
      html: `<p>Even on full bypass with a competent aortic valve, some blood continues to enter the left ventricle from bronchial and thebesian venous return, and from any degree of aortic insufficiency — if left unaddressed, this blood distends the arrested, non-ejecting LV, raising wall tension and myocardial oxygen demand precisely when the heart is supposed to be resting. Cohn puts numbers on the "small but continuous" leak: during CPB, <b>bronchial venous return averages ~140 mL/min and noncoronary collateral flow ~48 mL/min</b> — enough to distend a flaccid, thick-walled ventricle insidiously. A left heart vent decompresses it, and Cohn lists the routes (Fig. 13-6): most commonly a soft-tip <b>8–10 Fr catheter into the right-superior-pulmonary-vein/left-atrial junction</b> (advanced through the mitral valve into the LV if needed), or through the <b>aortic root vent</b>, the main pulmonary artery (which decompresses the LA because the pulmonary veins have no valves), or — rarely now, for myocardial injury reasons — the LV apex directly. Inspection and palpation can miss distension; <b>TEE or a directly measured LA/PA pressure is more reliable</b>.</p>
<p>Cardiotomy suction returns blood shed into the operative field (rather than the vasculature) back to the circuit for reuse, while a separate cell-saver device can process shed blood through a centrifuge to produce washed, concentrated red cells for reinfusion — reducing allogeneic transfusion requirements. Cardiotomy suction blood is more traumatized (higher hemolysis, more debris, more activated clotting factors) than venous-return blood — and, as noted above, the cardiotomy reservoir is the largest single source of gaseous microemboli in the circuit — which is why excessive or prolonged cardiotomy suction is a recognized contributor to post-CPB coagulopathy, hemolysis, and embolic load, and why it is deliberately discontinued once protamine is started.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>An LV that appears to be distending on TEE during cross-clamp (even with the aortic valve competent) should prompt immediate evaluation of the left heart vent for obstruction or malposition — an undrained, distended arrested LV suffers ongoing subendocardial ischemic injury throughout the clamp period.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why is a left heart vent used even when the aortic valve is competent and the patient is on full cardiopulmonary bypass?",
      options: [
        "To provide the antegrade cardioplegia delivery route",
        "Bronchial and thebesian venous return continue to enter the LV",
        "To measure central venous pressure directly",
        "To remove residual air from the aortic root before cross-clamp removal"
      ],
      answer: 1,
      explain: "Even with a competent aortic valve and full bypass, bronchial and thebesian venous return continues to deliver a small but continuous volume of blood into the LV. Without a vent, this blood distends the arrested, non-ejecting ventricle, raising wall tension and oxygen demand and worsening subendocardial ischemia during the cross-clamp period. The left heart vent continuously drains this blood, keeping the LV decompressed. De-airing the aortic root is a related but separate maneuver performed before unclamping."
    }
  ]
};

window.LESSONS["d10-cardioplegia"] = {
  id: "d10-cardioplegia",
  day: 2,
  ord: 2,
  title: "Myocardial Protection & Cardioplegia",
  short: "Cardioplegia",
  minutes: 19,
  chunks: [
    {
      title: "The Problem: Global Ischemia Under the Cross-Clamp",
      html: `<p>You cannot rebuild an engine while it is running — you turn it off first. The aortic cross-clamp is how the surgeon "turns off" the heart: it seals the ascending aorta between the arterial cannula and the coronary ostia, cutting the coronaries off from all blood flow so the heart falls still and empty. But turning the engine off comes at a price. From the instant the clamp goes on the entire myocardium is <b>globally ischemic</b>, and left unprotected it begins to die within roughly <b>20–30 minutes</b> of warm ischemia — far too little time for most operations, which take an hour or more inside the arrested heart.</p>
<p>Cardioplegia is the engineered answer to that ticking clock. It is a solution pumped into the coronaries that does three jobs at once: (1) it <b>stops</b> the heart in a controlled, energy-sparing state, (2) it <b>lowers the heart's oxygen demand</b> so the fixed energy reserve lasts longer, and (3) it <b>blunts reperfusion injury</b> when flow finally returns. Every design choice you will read below — how much potassium, how cold, which route — is just a lever on one of those three jobs.</p>
<p>That third job matters more than it first seems, because Cohn is emphatic that a large share of the damage is inflicted not during the ischemia but at the moment of <b>reperfusion</b>. During arrest, ATP falls and the cell accumulates sodium and hydrogen ions; when oxygenated blood suddenly returns, the recovering machinery drives a burst of <b>reactive oxygen species (ROS)</b> and a surge of <b>intracellular calcium overload</b>, and the combination throws open the <b>mitochondrial permeability transition pore (mPTP)</b> — the point of no return that commits a marginal cell to death. This is why the <em>manner</em> of reperfusion (a warm, substrate-enriched, sometimes calcium-modified "hot shot" before the clamp comes off) is a deliberate part of protection, not an afterthought — you are trying to coax the mitochondria back on line without tripping the mPTP.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Cardioplegia's three jobs: arrest the heart, suppress its metabolic rate during arrest, and minimize reperfusion injury when the clamp comes off. The reperfusion enemy is a cascade — <b>ROS → calcium overload → mPTP opening</b> — so a controlled, warm terminal "hot shot" is designed to refill energy stores before normal flow resumes.</p>
</div>`
    },
    {
      title: "Mechanism of Arrest: Hyperkalemic Diastolic Arrest",
      html: `<p>Cardioplegia solutions are hyperkalemic, typically containing 15–30 mEq/L of potassium in crystalloid formulations (or delivered as blood cardioplegia with a concentrated potassium additive). Elevated extracellular potassium depolarizes the cardiomyocyte resting membrane potential from its normal −90 mV to approximately −60 mV — a sustained, partial depolarization rather than a normal transient action potential.</p>
<p>At this depolarized plateau, the fast sodium channels responsible for phase 0 of the action potential remain inactivated, because they require the membrane to first repolarize to a sufficiently negative potential before they can be triggered again. Without functioning sodium channels, the action potential cannot propagate — electrical activity ceases and the heart arrests in diastole.</p>
<p>Diastolic arrest is specifically the goal (rather than any arrest) because myocardial oxygen consumption is lowest during diastole, when there is minimal actin-myosin crossbridge cycling — the single largest consumer of ATP in contracting myocardium. A tetanic, systolic-type arrest would maintain high metabolic activity and rapidly exhaust the cell's energy reserves.</p>
<p>The <em>dose</em> of potassium is a lesson written in blood. Cohn traces it to <b>Melrose (1955)</b>, who introduced reversible chemical arrest but with a high-concentration potassium citrate that was later found to cause <b>myocardial necrosis</b> — so damaging that surgeons temporarily abandoned it for plain normothermic ischemia. It was <b>Gay and Ebert (1973)</b> who showed that a <b>lower potassium concentration arrests the heart just as reliably without the necrosis</b>, reviving the technique. That is why modern crystalloid formulas keep potassium in the <b>10–40 mmol/L</b> range (never above ~40), with a final arresting concentration of roughly <b>20–25 mEq/L</b>, then drop to a <b>maintenance 8–10 mEq/L</b> for subsequent doses — enough to hold the diastolic plateau without the toxicity of the original Melrose solution.</p>
<p>Cohn also splits crystalloid solutions into two mechanistic families worth naming: <b>extracellular-type</b> solutions (higher sodium, calcium, magnesium — e.g. St. Thomas', which arrests by <em>depolarisation</em> with added KCl and MgCl₂) and <b>intracellular-type</b> solutions (low or absent sodium and calcium — e.g. Bretschneider/HTK, which arrests by removing the ions the action potential needs). Both are buffered with bicarbonate and osmotically balanced; they simply pull different rungs out from under the action potential.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>High K+ &rarr; depolarize &rarr; inactivate Na+ channels &rarr; no action potential &rarr; diastolic arrest.</b> Diastole is chosen because crossbridge cycling (the dominant ATP consumer) is minimal there. The Melrose lesson: <b>too much</b> potassium arrests the heart but necroses it — arrest at the lowest concentration that reliably works.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Why is the heart specifically arrested in diastole during cardioplegia, rather than in a contracted (systolic) state?",
      options: [
        "Diastolic arrest minimizes ATP-consuming cross-bridge cycling",
        "Diastolic arrest allows the aortic valve to remain open for easier cannulation",
        "Diastolic arrest prevents coronary artery spasm",
        "Systolic arrest is not achievable with any known cardioplegia formulation"
      ],
      answer: 0,
      explain: "Actin-myosin crossbridge cycling is the dominant consumer of ATP in the beating heart. During diastole, crossbridge cycling is minimal, so myocardial oxygen consumption falls to its lowest level. Hyperkalemic cardioplegia depolarizes the membrane to a plateau potential that inactivates fast sodium channels, preventing action potential propagation and holding the heart in this low-metabolic-demand diastolic-equivalent state — conserving energy stores for the duration of the cross-clamp."
    },
    {
      title: "Temperature: Hypothermia as a Second Layer of Protection",
      html: `<p>Hyperkalemic arrest alone reduces oxygen demand substantially, but temperature adds an independent and multiplicative layer of protection. Most cardioplegia is delivered cold — Cohn cools the solution to roughly <b>4–12°C</b> and cools the whole patient to <b>~28–33°C</b> — because hypothermia reduces myocardial metabolic rate by approximately 50% for every 10°C drop, and (from the myocardial-oxygen-demand curve) by about <b>7% for each 1°C</b>. The layering is what buys time: arrest alone drops myocardial oxygen consumption from ~10 to ~1 mL O₂/100 g/min — a roughly <b>90% cut</b> — and cold then slides the number lower still. Combining electromechanical arrest with hypothermia extends the safe ischemic time far beyond what either strategy could achieve alone; indeed Cohn notes some data suggesting that in blood cardioplegia <b>it is the level of hypothermia, more than the hematocrit, that carries the protection</b>.</p>
<p>One counterintuitive point the same curve makes: a <b>fibrillating</b> heart sits <em>above</em> an unloaded beating heart on the oxygen-demand ladder — disorganised electromechanical activity actually costs more oxygen than an empty, gently beating ventricle. That is the physiological argument against treating "cross-clamp fibrillation" as an economical shortcut; it burns the ischemic budget faster than true cardioplegic arrest.</p>
<p>Topical cooling — ice slush or cold saline poured directly onto the pericardial well — supplements cardioplegia by maintaining local myocardial hypothermia between doses, particularly useful for protecting territories with reduced cardioplegia delivery (such as a hypertrophied septum). This same topical cooling, however, is the recognized mechanism of cold-injury to the phrenic nerve, which runs along the lateral pericardium and can suffer conduction injury from prolonged ice slush exposure — a tradeoff worth remembering when a patient has unexplained hemidiaphragm paralysis post-operatively.</p>`
    },
    {
      title: "Blood vs. Crystalloid Cardioplegia",
      html: `<p>Two broad cardioplegia formulations are used, and the choice reflects a tradeoff between physiologic completeness and delivery simplicity. A little history clarifies why the field landed where it did (Cohn): the earliest chemical arrest, <b>Melrose's</b> high-concentration potassium citrate (1955), actually <em>caused myocardial necrosis</em>, and it was Gay and Ebert who showed that a <b>lower potassium concentration arrests the heart just as reliably without that injury</b> — the lesson baked into every modern formula.</p>
<ul>
  <li><b>Blood cardioplegia (most commonly used):</b> the patient's own oxygenated blood from the circuit, mixed with a concentrated potassium additive. Because it keeps hemoglobin, it continues to <em>deliver oxygen and substrate during arrest</em>, provides physiologic <em>buffering</em> against ischemic acidosis, and has <em>oncotic pressure</em> that limits myocardial edema — most evidence favors it for lower enzyme release and better functional recovery.</li>
  <li><b>Crystalloid cardioplegia:</b> a purely electrolyte solution needing no blood integration. The classic is <b>St. Thomas' solution</b> — Ringer's-based, with <b>KCl 16 mmol/L</b> to depolarize and arrest and <b>MgCl₂ 16 mmol/L</b>, which Hearse showed adds independent cardioprotection (magnesium blunts calcium entry). The other family, <b>Bretschneider/HTK (Custodiol)</b>, takes the opposite tack — <em>low-sodium, calcium-free</em>, achieving arrest by removing the ions the action potential needs rather than by high potassium, and giving a long single-dose window. Crystalloid offers less buffering and no oxygen, historically limiting the safe interval between doses.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Blood cardioplegia's advantages — oxygen delivery, buffering, oncotic support — all come from the fact that it is still, fundamentally, blood. The two crystalloid philosophies differ at the root: <b>St. Thomas depolarizes (high K⁺)</b>; <b>Bretschneider/HTK hyperpolarizes/inactivates (low Na⁺, Ca²⁺-free)</b>. Both stop the heart; they just take away different rungs of the action-potential ladder.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "What is the main physiologic advantage of blood cardioplegia over crystalloid cardioplegia during a prolonged cross-clamp?",
      options: [
        "Blood cardioplegia contains no potassium, avoiding hyperkalemic complications",
        "It supplies oxygen and buffering with less crystalloid hemodilution",
        "Blood cardioplegia does not require redosing",
        "Blood cardioplegia is delivered exclusively retrograde"
      ],
      answer: 1,
      explain: "Because blood cardioplegia is built on the patient's own oxygenated blood, it retains hemoglobin's oxygen-carrying and buffering functions and blood's oncotic pressure — providing ongoing metabolic support and edema protection during arrest that a purely electrolyte-based crystalloid solution cannot. This is why most evidence favors blood cardioplegia for enzyme release and functional recovery, particularly for longer cross-clamp times."
    },
    {
      title: "del Nido Cardioplegia: Single-Dose Protection",
      html: `<p>del Nido cardioplegia is a modified crystalloid formulation, originally developed for pediatric cardiac surgery, that has gained substantial adoption in adult practice — particularly for minimally invasive procedures. Its composition includes potassium (for arrest), lidocaine (a sodium channel blocker that adds membrane stabilization on top of the potassium-mediated depolarization, further suppressing any residual electrical activity), magnesium, and mannitol (providing osmotic protection against cellular edema).</p>
<p>Its composition reads like a checklist of the cardioprotective design principles Cohn enumerates. It is built on a <b>PlasmaLyte-A base</b> and delivered as roughly <b>1 part blood to 4 parts crystalloid</b>, and each additive targets one arm of ischemia-reperfusion injury: <b>lidocaine</b> (sodium-channel blockade → membrane stabilisation on top of the potassium depolarisation); <b>magnesium</b>, which Cohn notes both blunts calcium entry and "avoids intracellular calcium overload by providing a hypocalcemic environment"; a <b>calcium-free</b> formulation for the same reason; <b>mannitol</b> as the colloid/osmotic agent that "prevents cellular edema" and scavenges free radicals; and <b>bicarbonate</b> buffering to hold an alkaline pH against ischemic acidosis. In other words, del Nido is a single solution engineered to hit calcium overload, edema, and reperfusion ROS simultaneously — the reason a single dose reaches so far.</p>
<p>The defining clinical advantage of del Nido is duration: a single dose provides approximately 60–90 minutes of myocardial protection, compared with standard blood cardioplegia's need for redosing every 20–30 minutes. This is particularly valuable when repeated cardioplegia delivery is technically cumbersome — for example, through an endoaortic balloon catheter in minimally invasive mitral surgery, where repositioning a delivery device repeatedly interrupts the case.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>del Nido's lidocaine component matters mechanistically: sodium channel blockade adds a second, independent layer of electrical suppression on top of hyperkalemic depolarization, which is thought to contribute to its extended single-dose protection window. The ~90-minute window assumes a normal adult myocardium — a heavily hypertrophied or very-long-cross-clamp heart consumes its protection faster and should be redosed sooner, or on any return of electrical activity.</p>
</div>`
    },
    {
      title: "Antegrade Cardioplegia Delivery",
      html: `<p>There are two ways to get cardioplegia into the heart, and they are best understood as sending it in the <em>front door</em> versus the <em>back door</em>. <b>Antegrade</b> is the front door: a needle in the proximal ascending aorta (just below the clamp) squirts the solution into the aortic root, from where it pours into the coronary ostia and runs down the arteries exactly the way real coronary blood flow would. It is simple, fast, and physiologic — the default first dose.</p>
<p>Cohn gives the delivery parameters that make it fast and physiologic: antegrade root cardioplegia is infused at roughly <b>60–100 mmHg</b> at about <b>250 mL/min</b>, arresting the heart within <b>30–60 seconds</b>, with an induction volume that <b>generally does not exceed ~1000 mL</b> and redoses of <b>300–500 mL</b> whenever electrical activity resumes or a long ischemic interval is anticipated. There is also a second antegrade route for a different operative moment: once the aortic root itself has been <em>opened</em> (aortic valve replacement, a Bentall/root procedure), there is no root left to pressurise, so cardioplegia is delivered by a hand-held cannula placed <b>directly into the left main and right coronary ostia</b> — one vessel at a time, which has the advantage that each territory's protection can be checked and troubleshot independently.</p>
<p>Its weakness is the obvious one for a front door: if the road is blocked, the solution cannot get through. A vessel with a tight proximal stenosis or a total occlusion shields its downstream territory from antegrade cardioplegia — precisely the patient sitting in front of you for a CABG. The elegant fix is to use each new graft as a private delivery road: once an anastomosis is complete, cardioplegia is given <b>"down the graft,"</b> directly perfusing the territory that was previously unreachable. This is routine, and it means each region becomes fully protected the moment its graft is sewn. The one hard contraindication to <em>root</em> antegrade delivery is <b>severe aortic regurgitation</b>, where the pressurised solution simply leaks back across the incompetent valve into the LV — the classic cause of a heart that "won't arrest" while it distends.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient undergoing CABG has a chronic total occlusion of the RCA. Which territory is at risk of inadequate protection with antegrade-only cardioplegia, and what technique addresses it once the graft is placed?",
      options: [
        "The LAD territory is at risk; retrograde cardioplegia alone protects it",
        "No territory is at risk since antegrade cardioplegia bypasses coronary stenoses automatically",
        "RCA/PDA territory; deliver cardioplegia down the completed graft",
        "The left main territory is at risk; topical cooling alone is sufficient"
      ],
      answer: 2,
      explain: "Antegrade cardioplegia follows the native coronary arterial tree, so territories distal to a total occlusion or severe stenosis will not receive adequate solution through that route. In a CTO of the RCA, the RCA/PDA territory is at risk with antegrade-only delivery. Once the RCA graft is constructed, down-the-graft antegrade delivery directly perfuses the newly revascularized territory — this is standard practice for protecting each territory as its graft is completed."
    },
    {
      title: "Retrograde Cardioplegia and the Coronary Sinus Catheter",
      html: `<p>If antegrade is the front door, <b>retrograde</b> cardioplegia is the back door — the solution is pushed <em>backward</em> through the heart's veins. A balloon-tipped catheter is slid into the coronary sinus (through the right atrial wall under direct vision, or by TEE guidance in minimally invasive cases) and cardioplegia is infused against the normal direction of venous flow, so it soaks the myocardium from the venous side and seeps out through the arteries. The beauty of this route is that the coronary <em>veins</em> drain the whole heart fairly evenly and — crucially — they do not care about arterial blockages, so retrograde delivery reaches territories sitting behind an occlusion that antegrade cardioplegia can never get to.</p>
<p>Retrograde delivery has its own specific limitation: the right ventricle and posterior/inferior territories are poorly protected by retrograde cardioplegia, because the thebesian venous system of the RV drains directly into the RV cavity rather than through the coronary sinus — meaning retrograde solution largely bypasses the RV. For this reason, most high-volume programs use combined antegrade and retrograde delivery: antegrade for the initial arresting dose and RV protection, retrograde for ongoing maintenance doses during the case (when the aorta remains clamped and antegrade access is not readily available between anastomoses).</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Retrograde cardioplegia alone provides inadequate RV protection due to thebesian venous drainage bypassing the coronary sinus. Down-the-graft antegrade delivery to the RCA territory remains the most reliable strategy for RV protection once that graft is complete.</p>
</div>`
    },
    {
      title: "Combined Delivery, Redosing, and Distribution Problems",
      html: `<p>For a prolonged cross-clamp — a complex multivessel CABG combined with a valve procedure, for example — a comprehensive protection strategy layers several elements together: cold blood cardioplegia for the combined benefits of hypothermia and physiologic buffering; combined antegrade and retrograde delivery, using antegrade for arrest and RV coverage and retrograde for maintenance between anastomoses; redosing every 20–30 minutes (or sooner if myocardial temperature rises or electrical activity returns); down-the-graft delivery immediately after each anastomosis is completed; and topical cooling to maintain local hypothermia between doses.</p>
<p>The concentrations shift as the case proceeds, and it is worth knowing why. Cohn's blood-cardioplegia scheme uses a high <b>induction</b> concentration (~20–25 mEq/L K⁺) to arrest quickly, then drops to a low <b>maintenance</b> concentration (~8–10 mEq/L) for the redoses — enough to hold the diastolic plateau on an already-arrested heart without over-loading it. Retrograde maintenance is delivered gently: coronary-sinus pressure kept around <b>30–50 mmHg</b> (higher risks sinus rupture) at a lower flow than antegrade. And immediately before the cross-clamp comes off, many surgeons give a <b>terminal warm "hot shot"</b> — a normothermic, substrate-enriched reperfusion dose shown by Teoh and colleagues to accelerate metabolic recovery — refilling the energy tank before the heart is asked to work again.</p>
<p>Two clinical scenarios predictably distort cardioplegia distribution and must be anticipated rather than discovered mid-case. In severe aortic regurgitation, antegrade cardioplegia delivered into the aortic root leaks backward through the incompetent valve into the LV instead of being driven into the coronary ostia, causing inadequate arrest and LV distension — retrograde delivery via the coronary sinus becomes the primary route in this setting, since it does not depend on aortic valve competence. In severe coronary artery disease with diffuse, non-bypassable distal disease, both antegrade and retrograde routes may under-protect specific territories, and the surgeon may rely more heavily on topical cooling and shorter ischemic intervals.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient with severe aortic regurgitation requires aortic valve replacement. Why is antegrade cardioplegia delivered into the aortic root problematic in this setting, and what route is preferred?",
      options: [
        "Antegrade delivery causes hyperkalemia; crystalloid cardioplegia should be avoided entirely",
        "Antegrade delivery is contraindicated in all valve surgery",
        "Root delivery regurgitates into the LV; use retrograde cardioplegia",
        "The aortic root cannot be cannulated in AR, so cardioplegia must be given intravenously"
      ],
      answer: 2,
      explain: "In severe AR, cardioplegia delivered antegrade into the aortic root regurgitates backward through the incompetent valve into the LV rather than being directed into the coronary ostia under pressure — resulting in inadequate coronary perfusion of the cardioplegia solution and, simultaneously, LV distension from the misdirected volume. Because retrograde delivery via the coronary sinus does not depend on aortic valve competence, it becomes the primary and preferred delivery route in this scenario (often after the aortic valve itself is opened, allowing direct ostial cannulation as an alternative)."
    },
    {
      title: "Warm Cardioplegia and the Cross-Clamp Physiology Bottom Line",
      html: `<p>An alternative strategy — warm (normothermic) continuous blood cardioplegia — was born of the reasonable-sounding idea that a normothermic solution supplies nutrients and endogenous factors crystalloid lacks while sparing the patient the insults of systemic cooling and rewarming. Cohn tempers that appeal with the trial data. In a prospective RCT of <b>1001 patients</b> comparing continuous warm blood cardioplegia (systemic ≥35°C) against intermittent cold crystalloid cardioplegia (systemic ≤28°C), operative mortality was similar (<b>1.0 vs 1.6%</b>) — but the incidence of <b>permanent neurologic deficits was roughly threefold higher in the warm-normothermic group (3.1% vs 1.0%)</b>. <!-- VERIFY: Cohn 5th ed. cites warm-blood cardioplegia RCT (n=1001) with 3x higher permanent neurologic deficit rate (3.1% vs 1.0%), reversing the "warm = less neurologic injury" framing --> The core problem is mechanical: with no hypothermic reserve, a warm heart has essentially no protective buffer if delivery is interrupted even briefly by an obscured field or maldistribution — so warm cardioplegia demands genuinely <b>uninterrupted</b> flow, a much narrower margin for error. Later work suggests well-designed <em>intermittent antegrade warm</em> protocols and "tepid" (~29°C) delivery can recover an acceptable middle ground, but most surgeons still favour cold intermittent blood cardioplegia as the default.</p>
<p>Taken together, the physiology of the cross-clamp period reduces to a simple accounting problem: myocardial oxygen supply is zero (clamp on, no coronary flow between doses), so total protection time is a race against a fixed and depleting energy budget. Every strategy discussed in this lesson — hyperkalemic arrest, hypothermia, blood-based buffering, redosing, combined delivery routes — exists to either shrink the metabolic demand side of that ledger or to periodically resupply the substrate side before the budget runs out.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Cross-clamp physiology in one sentence: coronary flow is zero, so cardioplegia strategy is entirely about minimizing demand (arrest + cold) and periodically resupplying substrate (redosing, blood-based delivery) before the myocardium's fixed energy reserve is exhausted.</p>
</div>`
    }
  ]
};

window.LESSONS["d10-weaning"] = {
  id: "d10-weaning",
  day: 2,
  ord: 3,
  title: "Going On & Coming Off Bypass",
  short: "Weaning CPB",
  minutes: 19,
  chunks: [
    {
      title: "Preparing to Separate: Why a Checklist Matters",
      html: `<p>Coming off bypass is like landing a plane, not flipping a switch: the machine has been flying the patient, and you are handing the controls back to a heart that has just been stopped, cooled, and restarted. You would never slam a jet onto the runway without running the pre-landing checklist first, and for the same reason you do not simply turn the pump off. CPB deranges half a dozen variables at once — temperature, potassium, acid-base, intravascular volume, and the contractile state of a myocardium fresh off ischemia and reperfusion — and each one left uncorrected is a way the landing can go wrong.</p>
<p>The safest mental model is a checklist run through deliberately, in order, before the surgeon and perfusionist agree to reduce pump flow: temperature, rhythm, de-airing, electrolytes/acid-base, then a final assessment of preload, contractility, and afterload with TEE as the arbiter. Skipping ahead in this sequence is the most common reason for an unnecessarily difficult separation.</p>
<p>Cohn lists the concrete pre-separation tasks, and they map cleanly onto that checklist: the patient is <b>rewarmed to ~34–36°C</b>, the heart is <b>defibrillated if necessary</b>, and — a step easy to forget on bypass — the <b>lungs are re-expanded and ventilated</b> again (they have been idle, and atelectasis and hypoxic pulmonary vasoconstriction both raise RV afterload if you separate onto collapsed lungs). Rhythm is monitored; hematocrit, blood gases, acid-base status, and plasma electrolytes are all reviewed. If the heart has been opened, <b>TEE is used to find and clear trapped air before the heart is allowed to eject</b>. The <b>caval catheters are checked</b> for any obstruction to venous return, and if inotropic support is anticipated — a poor preoperative ventricle, a difficult repair — it is <b>started at low pump flow, proactively rather than reactively</b>. Only then does the actual weaning begin.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Weaning checklist, in order: (1) rewarm and re-expand/ventilate the lungs, (2) rhythm and de-air, (3) correct K+/acid-base, (4) assess preload/contractility/afterload with TEE, (5) reduce pump flow gradually while watching native cardiac performance. Cohn's satisfactory-separation numbers: <b>pulse-ox ~100%, end-tidal CO₂ &gt; 25 mmHg, and mixed venous O₂ saturation &gt; 65%</b>.</p>
</div>`
    },
    {
      title: "Rewarming Before Separation",
      html: `<p>Systemic rewarming must be adequate before separation is attempted — Cohn's target before stopping CPB is roughly <b>34–36°C</b>. <!-- VERIFY: Cohn 5th ed. states rewarm to 34-36°C before separation; some programs use higher nasopharyngeal targets (~36.5°C) --> The <em>site</em> of the temperature reading matters as much as the number, because compartments equilibrate at different rates and no single probe reflects the brain: bladder or rectal temperature estimates the main body mass but lags the brain; esophageal and PA readings can be falsely low from adjacent cardioplegia; nasopharyngeal and tympanic probes are convenient but <b>underestimate true (jugular-venous-bulb) brain temperature by 3–5°C during rewarming</b>; and the <b>arterial-line temperature correlates best with jugular-bulb temperature</b>, which is why it is watched during rewarming.</p>
<p>Rewarming must also be controlled rather than rapid: too-fast rewarming drives dissolved gas out of solution as micro-bubbles and stresses the brain, while overshooting risks <b>cerebral hyperthermia</b>, which independently worsens neurologic outcomes. This is why Cohn favours "tepid" perfusion (arterial temperature held around <b>33–35°C</b> and never allowed to overshoot ~37°C) — one study even found improved neuropsychometric outcomes when patients were rewarmed to <b>only 34°C</b>.</p>
<p>Why insist on adequate rewarming at all, if hyperthermia is the greater enemy? Because residual hypothermia has a long list of costs that Cohn spells out: it <b>interferes with enzyme and organ function, aggravates bleeding, raises systemic vascular resistance, delays cardiac recovery, and lengthens the duration of bypass</b> — every one of which makes a clean separation harder. The art is therefore a narrow band: warm enough that the heart is not stiff, arrhythmic, and coagulopathic, but never overshooting into the cerebral hyperthermia that worsens neurologic outcome.</p>
<p>The clinical relevance of rewarming extends well past the OR: peripheral tissues, which were vasoconstricted and relatively under-warmed during CPB even as the core was brought to target temperature, will re-equilibrate with the still-cool periphery after CPB ends — producing a predictable core temperature drop of 1–3°C in the ICU ("afterdrop") that can precipitate coagulopathy and arrhythmia hours after an apparently successful separation.</p>`
    },
    {
      type: "checkpoint",
      q: "A patient is rewarmed to 37°C on CPB and separates successfully. Two hours later in the ICU, core temperature has dropped to 34°C. What explains this, and why does it matter?",
      options: [
        "Redistribution hypothermia (afterdrop)",
        "This indicates a new infection and requires blood cultures",
        "The heat exchanger malfunctioned during bypass",
        "This is expected and requires no intervention or monitoring"
      ],
      answer: 0,
      explain: "During CPB rewarming, the perfusionist warms the core (brain, heart, great vessels) but the vasoconstricted periphery lags behind. After separation, peripheral vasodilation allows cold peripheral blood to equilibrate with the warm core, dropping core temperature 1-3 degrees C — redistribution hypothermia, or afterdrop. This matters because hypothermia causes platelet dysfunction and coagulopathy (worsening bleeding), increases cardiac irritability (VF risk below 32C), and increases oxygen demand through shivering — active rewarming and shivering control are indicated."
    },
    {
      title: "Rhythm and De-Airing",
      html: `<p>Most hearts return to sinus rhythm spontaneously once the cross-clamp is removed and warm, oxygenated blood reperfuses the myocardium — and the terminal warm "hot shot" given before unclamping exists partly to make that spontaneous recovery more likely. If ventricular fibrillation persists despite reperfusion, internal defibrillation with internal paddles (typically 10–20 J) is applied directly to the heart. Persistent or <em>recurrent</em> VF is itself a signal, not just a nuisance: it points to ongoing ischemia (air down the RCA, an inadequate or kinked graft, incomplete revascularisation) or an unfavourable milieu (residual hyperkalemia, hypomagnesemia, acidosis, hypothermia), and each of those is corrected before repeatedly shocking a heart that will simply re-fibrillate. It also burns oxygen the freshly reperfused myocardium can ill afford, since a fibrillating heart consumes <em>more</em> oxygen than an unloaded beating one. If the rhythm is instead asystole or significant bradycardia, temporary epicardial pacing wires — placed specifically for this purpose — restore rate and, importantly, <b>AV synchrony</b>, the atrial kick a stiff hypertrophied ventricle depends on to fill.</p>
<p>Before the cross-clamp is released, de-airing maneuvers must be completed. Cohn is specific that whenever <b>the heart has been opened</b>, TEE is used to <b>detect and remove trapped air before the heart is allowed to eject</b> — the air must be out before the first beat pressurises the aortic root and coronaries. The maneuvers layer together: the surgical team positions and manipulates the heart (Trendelenburg, gentle massage, needle-venting the LV apex and aortic root) to float air up toward the highest point, TEE watches the LV, LA, and aortic root fill and clear in real time, and the <b>aortic root vent is left on gentle suction</b> after the clamp is off to catch any undiscovered air that surfaces later. This step exists specifically to prevent coronary and cerebral air embolism at the moment flow is restored — incomplete de-airing is a recognized and preventable cause of both perioperative stroke and the RCA-territory ischemia/ventricular arrhythmia pattern seen immediately after left-heart procedures.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>The RCA is the most anterosuperior coronary artery and preferentially receives residual air during de-airing after open left-heart procedures — incomplete de-airing classically produces inferior wall ischemia and ventricular arrhythmias within minutes of coming off bypass.</p>
</div>`
    },
    {
      title: "Potassium and Acid-Base Correction",
      html: `<p>Reviewing <b>hematocrit, blood gases, acid-base status, and plasma electrolytes</b> is an explicit item on Cohn's pre-separation list — not a background lab draw but a gate. Cardioplegia leaves the patient with a residual potassium load from the hyperkalemic arresting solution, and this potassium must be actively addressed before weaning: the very mechanism that arrested the heart — potassium depolarising the membrane and inactivating fast sodium channels — is the mechanism that now <b>suppresses automaticity and conduction</b>, working directly against the goal of restoring a stable, spontaneous rhythm. The target is potassium <b>less than 5.5 mEq/L</b> before attempting separation. If it remains elevated, correction is by <b>insulin with glucose</b> (drives K⁺ intracellularly), forced <b>diuresis</b>, or — fastest, while still on the circuit — <b>hemofiltration/ultrafiltration</b>, which strips potassium and excess fluid together.</p>
<p>Metabolic acidosis, whether from the ischemic interval itself or from hypoperfusion during bypass, independently reduces myocardial contractility and blunts the efficacy of any vasoconstrictor or inotrope given to support the heart during weaning — a heart trying to separate against an uncorrected pH will look like a failing pump when the real problem is chemical. Correcting pH and confirming an adequate base excess before separation removes one more variable that could otherwise be mistaken for a primary cardiac performance problem. It is also worth remembering Cohn's warning that a <b>base deficit or rising lactate can flag inadequate perfusion even when the mixed-venous saturation reads "normal"</b> — because regional beds (splanchnic, renal medulla) can be under-perfused while the global number looks reassuring.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Pre-separation metabolic gates: <b>K⁺ &lt; 5.5 mEq/L</b> (insulin/glucose, diuresis, or on-circuit ultrafiltration if higher), corrected pH/base excess, and an ionised calcium and magnesium checked — low Mg²⁺ predisposes to the very reperfusion arrhythmias that make a heart re-fibrillate. Note that switching to the low-concentration <b>8–10 mEq/L maintenance</b> cardioplegia and using retrograde maintenance both limit how much of a potassium load is left to clear at the end.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "Before attempting to wean from CPB, why must serum potassium specifically be addressed if it remains elevated from cardioplegia?",
      options: [
        "Elevated potassium increases the risk of protamine anaphylaxis",
        "Hyperkalemia suppresses automaticity and conduction",
        "Elevated potassium prevents adequate rewarming",
        "Elevated potassium causes false-low ACT readings"
      ],
      answer: 1,
      explain: "Cardioplegia's arresting mechanism is hyperkalemic depolarization, which suppresses automaticity and conduction by inactivating fast sodium channels. Residual elevated potassium after cross-clamp removal continues to suppress the heart's ability to generate and conduct a spontaneous rhythm. The target is potassium below 5.5 mEq/L before weaning is attempted, since attempting to separate against ongoing potassium-mediated suppression works directly against restoring stable cardiac electrical activity."
    },
    {
      title: "Assessing Preload, Contractility, and Afterload Before Reducing Flow",
      html: `<p>Once temperature, rhythm, and metabolic status are optimized, weaning itself is a gradual process: pump flow is progressively reduced while the surgeon and anesthesiologist watch the heart's native performance take over, using TEE as the primary real-time arbiter of adequacy. TEE assessment during this phase evaluates global and regional contractility (new wall motion abnormalities suggest graft problems, coronary embolism, or inadequate revascularization rather than simple stunning), valve function (has the repair or replacement performed as intended under real loading conditions), and chamber filling (is the heart adequately but not excessively filled as venous return is restored).</p>
<p>The mechanics of the wean itself are worth picturing exactly as Cohn describes them, because they explain what each dial does. The perfusionist <b>gradually occludes the venous line</b>, which lets the right heart fill and eject through the lungs to the left side, while <b>simultaneously reducing pump input</b> — control is handed back to the native heart a little at a time rather than all at once. Initially the blood volume held within the circuit is kept constant; then, as pump flow approaches zero, volume is deliberately <b>added to or removed from the patient</b> to land the arterial and venous pressures inside physiologic ranges. This is the moment preload, afterload, and contractility are titrated <em>together</em> rather than in isolation: volume is given cautiously if the heart appears underfilled, vasoconstrictors or vasodilators adjust afterload depending on systemic vascular resistance, and inotropic support is started <b>proactively — rather than reactively after a failed attempt</b> — in a heart with known reduced pre-operative function or a technically difficult repair.</p>
<div class="kbox study">
  <div class="kbox-tag">STUDY</div>
  <p>Criteria for a successful wean: adequate heart rate and rhythm (HR roughly 70-90, sinus or paced), good contraction on TEE without new wall motion abnormality, MAP roughly 60-80 mmHg, acceptable acid-base and electrolytes, and adequate volume status. Cohn's confirmatory trio: <b>pulse-ox ~100%, end-tidal CO₂ &gt; 25 mmHg, mixed venous O₂ saturation &gt; 65%</b>.</p>
</div>`
    },
    {
      title: "Failure to Wean: A Systematic Approach",
      html: `<p>Failure to wean means the heart cannot sustain adequate output once bypass support is withdrawn — and the correct response is not to escalate inotropes reflexively but to work through a structured differential, because the underlying cause dictates entirely different management. The same systematic categories used to assess LCOS in the ICU apply here, at the bedside, in real time: is there a new wall motion abnormality suggesting a graft problem, coronary embolism, or inadequate revascularization (which may require returning to bypass for graft revision)? Is there new valve dysfunction on TEE? Is there an uncorrected rhythm problem? Is there tamponade from retained blood or over-distension? Is volume status adequate, or is the heart underfilled or overfilled? Is systemic vascular resistance too high (afterload mismatch) or pathologically low (vasoplegia)?</p>
<p>Only once correctable causes have been addressed — or excluded — does escalation of support become appropriate, and this escalation itself follows a stepwise ladder: first, intensify pharmacologic support (inotropes such as epinephrine or milrinone, vasopressors for vasoplegia); if this proves insufficient, initiate the IABP for afterload reduction and coronary perfusion augmentation in the failing, ischemic heart; and if the heart still cannot sustain adequate output despite IABP, escalate to more complete mechanical circulatory support with Impella or ECMO, matching the device to the specific physiology (isolated LV failure versus biventricular failure) as covered in the Day 9 MCS lessons.</p>
<div class="kbox mnemonic">
  <div class="kbox-tag">MNEMONIC</div>
  <p><b>Failure-to-wean escalation ladder:</b> optimize (rhythm, valve, volume, afterload) &rarr; inotropes &rarr; IABP &rarr; Impella/ECMO/VAD. Never skip straight to mechanical support without first excluding a correctable cause.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient fails an initial attempt to wean from bypass despite normal temperature, rhythm, and electrolytes. What is the correct next step before escalating to mechanical circulatory support?",
      options: [
        "Immediately initiate ECMO, since failure to wean is itself an indication for MCS",
        "Reassess ischemia, repair, preload, afterload, and tamponade",
        "Give a large fluid bolus regardless of TEE findings",
        "Increase pump flow back to full bypass indefinitely without further assessment"
      ],
      answer: 1,
      explain: "Failure to wean requires a systematic search for correctable causes before escalating support: new regional wall motion abnormality (graft problem, coronary embolism, inadequate revascularization), new valve dysfunction, tamponade, inadequate or excessive volume, and afterload mismatch. Only once these are addressed or excluded should support be escalated in a stepwise fashion — pharmacologic optimization, then IABP, then more complete MCS (Impella/ECMO) if the heart still cannot sustain output."
    },
    {
      title: "Protamine Reversal and Protamine Reactions",
      html: `<p>Once the patient is separated from bypass and hemostasis is being addressed, heparin must be reversed with protamine, which binds heparin to form an inactive complex. Cohn's dose is <b>1 mg of protamine for every 100 units of the initial heparin bolus, not to exceed 3 mg/kg</b>, and reversal is confirmed by a return of the ACT (or Hepcon) to baseline — if it remains prolonged or the field is oozing, an extra <b>~50 mg</b> is given. Two procedural rules travel with it. First, once the protamine infusion begins, <b>cardiotomy suction into the reservoir is stopped</b>: with heparin now being neutralised, returning field blood risks generating clot inside the circuit and forfeits the option of an emergency return to bypass. Second, for exactly that reason the <b>heart-lung machine is kept primed and available until the chest is closed and the patient is ready to leave the OR</b>.</p>
<p>Protamine carries real risks that every surgical team must anticipate. The <b>heparin-protamine complex activates complement</b> and can cause acute hypotension — often blunted by giving <b>calcium (about 2 mg calcium per 1 mg protamine)</b> and by slowing the infusion. Beyond that dose-rate effect are two more dangerous reactions: <b>severe pulmonary vasoconstriction</b>, which acutely raises RV afterload and can precipitate right heart failure, and true <b>anaphylaxis</b> — rare but potentially fatal, and more common in patients with prior protamine exposure or prior <b>NPH insulin</b> use (NPH contains protamine and sensitises). A severe reaction may force an urgent return to CPB, or be managed with epinephrine and immediate discontinuation of the infusion. Because of the clotting risk, protamine is <b>never given while the cross-clamp is on or before CPB is fully discontinued</b>.</p>
<div class="kbox danger">
  <div class="kbox-tag">DANGER</div>
  <p>Protamine anaphylaxis and severe pulmonary vasoconstriction can precipitate acute right heart failure within minutes of administration. Patients with prior protamine exposure or NPH insulin use are at elevated risk — have the team ready to treat anaphylaxis and support the RV if this occurs.</p>
</div>`
    },
    {
      type: "checkpoint",
      q: "A patient with a history of NPH insulin use receives protamine after separation from bypass and develops sudden severe hypotension with signs of acute right heart strain. What is the most likely mechanism?",
      options: [
        "Heparin rebound causing new circuit clotting",
        "Inadequate de-airing causing cerebral air embolism",
        "Protamine reaction causing pulmonary vasoconstriction",
        "Excessive modified ultrafiltration causing hypovolemia"
      ],
      answer: 2,
      explain: "Prior exposure to protamine-containing NPH insulin can sensitize patients to protamine, increasing the risk of anaphylaxis or severe pulmonary vasoconstriction on re-exposure. Pulmonary vasoconstriction acutely raises RV afterload, precipitating right heart failure and hypotension. This is a recognized, feared complication of protamine administration and the reason a careful medication history (including insulin formulation) matters before giving it."
    },
    {
      title: "Heparin Rebound",
      html: `<p>Heparin does not all stay in the bloodstream where the protamine can find it — some of it slips into fatty tissues and clings to plasma proteins, like water soaking into a sponge. Protamine mops up the heparin that is <em>in circulation</em> at the time it is given, and the ACT returns to baseline. But over the next several hours that sponge slowly wrings itself back out: sequestered heparin leaks back into the plasma with no protamine left to meet it. This is <b>heparin rebound</b> — a delayed return of anticoagulation that shows up in the ICU as fresh oozing or a rising chest-tube output hours after the patient looked perfectly reversed in the OR.</p>
<p>Cohn adds two practical anchors. Because the sequestered reservoir is largely <b>adipose tissue</b>, heparin rebound is seen <b>more often in obese patients</b>, and because protamine itself is only a <b>mild anticoagulant at higher doses</b>, it is safe to give <b>one or two empiric 25–50 mg doses</b> when rebound is suspected or the ACT drifts back up — you are not risking meaningful over-anticoagulation by treating presumptively. Because heparin rebound characteristically presents with a prolonged aPTT (or re-prolonged ACT) out of proportion to other coagulation parameters, and because it responds specifically to that additional protamine rather than to platelet or factor transfusion, recognizing it correctly avoids both unnecessary blood product exposure and a missed, treatable cause of post-operative bleeding.</p>
<p>One important mimic to keep in mind: Cohn notes the <b>ACT can be elevated by significant thrombocytopenia even when heparin is fully reversed</b>. So a rising ACT after protamine is not automatically heparin rebound — check the platelet count before committing to more protamine, or you will chase a coagulopathy that protamine cannot fix.</p>
<p>The practical teaching point is a discipline of surveillance rather than a single test. Because rebound emerges over hours and is easy to mistake for surgical bleeding, the ICU team watches the <b>chest-tube trend against the coagulation panel</b>: a heparin-pattern picture (prolonged aPTT/ACT out of proportion to platelet count and fibrinogen) in a patient who was cleanly reversed in the OR, especially an obese patient, is the signature. Getting this right is what separates a small dose of protamine from an unnecessary trip back to the operating room for "surgical" bleeding that was never surgical.</p>`
    },
    {
      title: "Decannulation Sequence",
      html: `<p>Once hemostasis and hemodynamic stability are confirmed, cannulae are removed in a deliberate sequence. The venous cannula(s) come out first and the arterial cannula last in most protocols — the logic being that the arterial line is the lifeline that lets you rapidly re-transfuse volume from the circuit or crash back onto bypass, so it is surrendered only once the heart has clearly held. Sequence can vary by institution and scenario, with the aortic (or alternative) cannulation site secured by pre-placed purse-string sutures cinched down and reinforced as needed. Each cannulation site is inspected for bleeding before the drapes come down, since a slow leak at a cannulation site is far easier to address immediately than to diagnose later as unexplained post-operative bleeding or a developing hematoma.</p>
<p>The blood left in the circuit is not discarded. Cohn describes several salvage routes: the whole perfusate can be <b>washed and returned as packed red cells</b>, its excess water removed through a <b>hemoconcentrator</b>, or — since it still contains heparin — <b>gradually pumped back into the patient</b> and hemoconcentrated by the kidneys, with any surplus bagged and given later. And a discipline that closes the whole case safely: the <b>heart-lung machine is not fully disassembled until the chest is closed and the patient is ready to leave the operating room</b>, so that an unexpected decompensation can still be met with an urgent return to CPB.</p>
<p>Temporary epicardial pacing wires are placed at this stage in essentially every case — atrial and ventricular wires, brought out through the skin below the sternotomy incision — providing a bridge for rhythm support in the ICU while the conduction system recovers from the trauma of surgery, cardioplegia, and the cross-clamp interval. Chest tubes are placed to drain the mediastinal and pleural spaces before sternal closure, allowing ongoing surveillance of bleeding and preventing tamponade from accumulating blood in the immediate post-operative period.</p>
<div class="kbox pearl">
  <div class="kbox-tag">PEARL</div>
  <p>Temporary epicardial pacing wires and mediastinal chest tubes are placed as standard practice at decannulation in nearly every cardiac case — not because a problem is anticipated, but because both are far easier to place prophylactically than to add emergently once the chest is closed.</p>
</div>`
    }
  ]
};

/* ==== Senior (L4) and Mastery (L5) layers merged into the existing Day-2 (CPB) lessons ==== */

window.LESSONS["d10-circuit"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: perfusion is delivery, not pressure",
    html: `<p>A junior watches the mean arterial pressure on pump. A senior watches <b>oxygen delivery</b>, because a normal MAP can sit on top of dangerously low flow, low haematocrit, or a failing oxygenator. Derive it from first principles:</p>
<p><b>CaO₂ = (1.34 × Hb × SaO₂) + (0.003 × PaO₂)</b> — arterial oxygen content is almost entirely the haemoglobin-bound term. <b>Indexed DO₂ = CaO₂ × pump-flow index × 10.</b> Below an indexed DO₂ of roughly <b>270–300 mL O₂/min/m²</b>, acute kidney injury and other organ injury rise sharply — which is why you protect flow and haematocrit, not just pressure. <!-- VERIFY: on-pump indexed DO2 nadir ~270-300 mL/min/m2 for AKI risk --></p>
<p>The readouts that tell you delivery is adequate are the <b>mixed venous saturation</b> and the <b>lactate trend</b>. A falling SvO₂ or a rising lactate on a "normal" MAP means demand is outrunning delivery — raise flow, raise haematocrit, deepen anaesthesia, or cool.</p>
<p>Three troubleshooting differentials the senior runs cold:</p>
<ul>
  <li><b>High arterial-line pressure:</b> cannula malposition or a false-lumen dissection, a kink, or a clamp still on — not "the pump is fine."</li>
  <li><b>Low venous return with a rising reservoir level:</b> an air lock, the cannula against a wall, or hypovolaemia.</li>
  <li><b>The "won't arrest" heart:</b> aortic insufficiency running cardioplegia into the LV, an inadequate cross-clamp, or a delivery failure.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Pressure ≠ perfusion. A MAP of 55 with an SvO₂ of 80% and a flat lactate is fine; a MAP of 70 with an SvO₂ of 55% and a rising lactate is not.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the abnormal arterial trace is a dissection, and the air-embolism drill",
    html: `<p><b>Viva reflex #1:</b> a <b>flat, blunted, or sharply high-resistance arterial trace as you initiate bypass is aortic dissection until proven otherwise</b> — the arterial cannula is in a false lumen or has created one. Do not flow through it.</p>
<ol>
  <li><b>Stop the pump.</b></li>
  <li><b>Re-cannulate the true lumen</b> — commonly switch to the <b>right axillary/innominate artery</b> for antegrade true-lumen flow, or direct central true-lumen cannulation under epiaortic/TEE guidance.</li>
  <li><b>Cool and arrest</b> — convert to a hypothermic-circulatory-arrest strategy and repair the ascending aorta open, rather than fighting a propagating dissection warm.</li>
</ol>
<p>The tell is the <b>combination</b>: rising line pressure with a flat systemic trace, a dusky or expanding ascending aorta, and poor venous return.</p>
<p><b>Viva reflex #2 — massive arterial air embolism</b> (e.g., a run-away emptied reservoir): <b>stop the pump</b>, place the patient in <b>steep Trendelenburg</b>, <b>de-air</b> the arterial line and aorta, and consider <b>retrograde cerebral perfusion</b> (via the SVC) to flush air from the cerebral circulation, with deep hypothermia for cerebral protection.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE ERROR TO AVOID</div>
  <p>Increasing pump flow to "overcome" a high arterial-line pressure at initiation drives a dissection larger. The reflex is to <b>stop</b>, not push harder.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "Seconds after going on bypass the arterial-line pressure spikes, the radial arterial trace goes flat, and the ascending aorta looks dusky and expanded. What is the correct immediate action?",
    options: [
      "Stop the pump and manage suspected aortic dissection",
      "Increase pump flow to overcome the elevated line resistance",
      "Give vasodilators to lower the arterial-line pressure and continue",
      "Continue bypass and observe the aorta for several minutes"
    ],
    answer: 0,
    explain: "A high line pressure with a flat systemic trace and a dusky, expanding aorta on initiation is aortic dissection (false-lumen cannulation) until proven otherwise. Stop the pump, re-cannulate the true lumen (often right axillary), and cool to arrest for an open repair. Increasing flow enlarges the dissection."
  }
);

window.LESSONS["d10-cardioplegia"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: protection chosen for the heart in front of you",
    html: `<p>Cardioplegia is a decision, not a default. The senior selects by pathology and cross-clamp time:</p>
<ul>
  <li><b>del Nido</b> — 1:4 blood-to-crystalloid, PlasmaLyte-A base, carrying lidocaine, magnesium, mannitol, bicarbonate and potassium, as a <b>single dose lasting up to ~90 minutes</b>. Suits routine adult work with reasonable cross-clamp times. <!-- VERIFY: del Nido single-dose interval up to ~90 min in adults --></li>
  <li><b>4:1 blood cardioplegia</b>, re-dosed every <b>~15–20 minutes</b> — suits long, complex, or heavily hypertrophied hearts where you want frequent substrate and buffering.</li>
  <li><b>Retrograde</b> coronary-sinus delivery — protects the heart antegrade cannot reach: severe <b>aortic insufficiency</b> (antegrade runs into the LV instead of the coronaries), <b>ostial obstruction</b>, and the heavily <b>hypertrophied</b> ventricle.</li>
  <li>A warm <b>"hot-shot"</b> reperfusion dose precedes cross-clamp removal to replenish substrate before the heart works again.</li>
</ul>
<p><b>Temperature-management strategy</b> is a paired decision: <b>alpha-stat</b> (do not correct blood-gas for temperature) preserves cerebral autoregulation and is standard for routine adult hypothermia; <b>pH-stat</b> (correct for temperature, adding CO₂) improves cerebral cooling and is chosen for deep-hypothermic circulatory arrest, especially in children, at the cost of losing autoregulation.</p>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: the 'won't arrest' heart, and re-dosing the hypertrophied ventricle",
    html: `<p><b>Viva scenario:</b> you deliver antegrade cardioplegia and the heart <b>will not arrest</b> (persistent electrical/mechanical activity). Run the ordered differential:</p>
<ol>
  <li><b>Aortic insufficiency</b> — the commonest cause: cardioplegia regurgitates into the LV instead of pressurising the coronaries. Switch to <b>retrograde coronary-sinus</b> and/or <b>direct ostial</b> delivery, and <b>vent the LV</b> to stop distension.</li>
  <li><b>Inadequate cross-clamp</b> — the clamp is incompletely occluding; reposition it.</li>
  <li><b>Delivery problem</b> — a misplaced cannula, an air lock, or an inadequate pressure/volume of solution.</li>
</ol>
<p>And the re-dosing judgment: del Nido's ~90-minute single dose assumes a normal adult myocardium. The <b>heavily hypertrophied or long-cross-clamp heart</b> consumes its protection faster — re-dose <b>before</b> 90 minutes, and re-dose on any <b>return of electrical activity</b>, because a warming, activity-resuming ventricle is unprotected.</p>
<div class="kbox danger">
  <div class="kbox-tag">THE TRAP</div>
  <p>A distending LV under a leaking antegrade root in AR both fails to arrest <i>and</i> injures itself by wall-tension. The move is retrograde/ostial delivery plus an LV vent — not simply more antegrade pressure, which worsens the distension.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "During a case with severe aortic insufficiency, antegrade root cardioplegia fails to arrest the heart and the LV begins to distend. What is the correct response?",
    options: [
      "Increase the antegrade root pressure until arrest occurs",
      "Abandon cardioplegia and operate on the beating heart",
      "Warm the patient to promote arrest",
      "Vent the LV; use retrograde or ostial delivery"
    ],
    answer: 3,
    explain: "In aortic insufficiency, antegrade root cardioplegia leaks into the LV rather than perfusing the coronaries, so the heart does not arrest and the ventricle distends. Switch to retrograde and/or direct ostial delivery and vent the LV. More antegrade pressure worsens the distension."
  }
);

window.LESSONS["d10-weaning"].chunks.push(
  {
    level: 4,
    title: "Senior reasoning: the pre-separation checklist",
    html: `<p>Separating from bypass is a checklist run in order, not a switch thrown. Before the first attempt the senior confirms:</p>
<ul>
  <li><b>Temperature</b> — rewarmed to ~36–37 °C (a cold heart is a stiff, arrhythmic heart).</li>
  <li><b>Rhythm and rate</b> — an organised rhythm with <b>AV synchrony</b>; pace if needed, and remember the hypertrophied ventricle depends on the atrial kick.</li>
  <li><b>Potassium</b> — brought down toward ~4.5–5.0 mEq/L; residual cardioplegic hyperkalaemia suppresses automaticity and conduction.</li>
  <li><b>De-airing</b> — complete, confirmed on TEE, before the heart ejects into the coronaries and brain.</li>
  <li><b>The result</b> — TEE of the repair/replacement, valve function, and baseline ventricular function.</li>
  <li><b>Loading conditions</b> — appropriate preload and afterload, inotropic support prepared.</li>
</ul>
<div class="kbox pearl">
  <div class="kbox-tag">SENIOR PEARL</div>
  <p>Do not attempt to wean into a cold, hyperkalaemic, poorly-synchronised, or under-filled state. Each item on the checklist is a reason a first attempt fails — fix them <i>before</i> the attempt, not after.</p>
</div>`
  },
  {
    level: 5,
    title: "PGY-5 mastery: can't come off pump — the six-domain differential",
    html: `<p><b>Viva summit:</b> <i>"You cannot separate from bypass after a straightforward AVR — give me the ordered six-domain differential and how you distinguish the causes at the table in the next three minutes."</i> Go back on full flow and run the six domains against <b>TEE + filling pressures + direct inspection</b>:</p>
<ol>
  <li><b>Residual ischaemia / incomplete revascularisation</b> — a new regional wall-motion abnormality on TEE, ST changes; check grafts, exclude air down the RCA.</li>
  <li><b>An unaddressed or new valve lesion</b> — TEE the repair/replacement result and the other valves.</li>
  <li><b>RV failure</b> — a distended, poorly-contracting RV on direct view and TEE; high CVP with an underfilled LV.</li>
  <li><b>Arrhythmia / loss of AV synchrony</b> — rhythm, rate, pacing.</li>
  <li><b>Air down the RCA</b> — transient inferior dysfunction that recovers; de-air and raise perfusion pressure.</li>
  <li><b>Tamponade / vasoplegia</b> — <b>measure the SVR</b>; distributive shock mimics pump failure until the number is seen.</li>
</ol>
<p>Correct the identified domain, then escalate <b>stepwise</b> — inotropes → IABP → temporary VAD/ECMO — rather than reflexively bolusing fluid or jumping to ECMO.</p>
<div class="kbox danger">
  <div class="kbox-tag">DISCIPLINE</div>
  <p>"Failure to wean" is a prompt, not a diagnosis. Name the domain, prove it with TEE/pressures/inspection, fix <i>that</i> — do not treat the whole differential blindly or commit a patient to ECMO for a problem a graft revision or a volume adjustment would have fixed.</p>
</div>`
  },
  {
    type: "checkpoint",
    q: "After an uncomplicated AVR with good temperature, rhythm, and electrolytes, the patient will not separate from bypass and the measured SVR is low with a high-normal SvO₂. Which domain is implicated?",
    options: [
      "RV failure",
      "Tamponade",
      "Residual coronary ischaemia",
      "Vasoplegia"
    ],
    answer: 3,
    explain: "A low SVR with a preserved/high SvO₂ and adequate filling is distributive (vasoplegic) shock, not pump failure (which shows high filling pressures and a low SvO₂) or tamponade (equalised elevated pressures). Measuring the SVR is what distinguishes it — the reason the six-domain differential includes it explicitly."
  }
);
