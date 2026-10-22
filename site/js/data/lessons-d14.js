window.LESSONS = window.LESSONS || {};

window.LESSONS["d14-integration"] = {
  id: "d14-integration",
  day: 14,
  ord: 1,
  title: "Capstone Synthesis: Read the Whole Patient",
  short: "Capstone Synthesis",
  minutes: 24,
  chunks: [
    {
      title: "The Day-14 Method",
      html: `<p>Day 14 is not another list of facts — it is learning to think like a <b>detective at a crime scene</b>. A crashing post-op patient throws a dozen clues at you at once, several of them pointing at different suspects, and the skill is reconstructing what actually happened rather than chasing the loudest number. Work the case the same way every time: <b>locate the anatomy, name the physiology, identify the operation-specific failure modes, read the evidence in context, then choose the next action that preserves your rescue options</b>. Same sequence, every patient — that discipline is what stops you from anchoring on the first thing you notice.</p>
      <p>Start with a one-sentence problem representation: procedure and postoperative time, dominant hemodynamic pattern, decisive imaging or monitor change, and the immediate threat. “Four hours after mitral repair, hypotension with a rising CVP and abruptly absent drain output” is more useful than a list of twenty disconnected values because it exposes obstruction as the working mechanism.</p>
      <div class="kbox study"><div class="kbox-tag">CAPSTONE RULE</div><p>Do not ask which diagnosis is common in general. Ask which diagnosis explains the <b>change from this patient's own baseline</b> after this specific operation.</p></div>`
    },
    {
      title: "Build a Coupled Hemodynamic Model",
      html: `<p>Treat the numbers like <b>witnesses whose stories must line up</b>. Pressure, flow, and volume are describing one event from different angles — if your explanation makes one of them a liar, your explanation is wrong. A MAP propped up by norepinephrine can hide a cardiac output that is still on the floor. A high CVP will happily "confess" to RV failure, volume overload, tamponade, <em>or</em> a high ventilator pressure — it cannot tell you which alone. A small LV might mean bleeding, obstruction, RV underdelivery, or too much mechanical support. Cross-examine the signals as a coupled set; do not hand each number its own private diagnosis.</p>
      <ul><li><b>Pump failure:</b> low output with impaired ventricular contraction and rising filling pressure.</li><li><b>Vasoplegia:</b> low pressure from low vascular tone, often with preserved or high flow once preload is adequate.</li><li><b>Obstruction:</b> low flow because filling or ejection is mechanically limited—tamponade, tension physiology, prosthetic obstruction or dynamic LVOT obstruction.</li><li><b>Regional ischemia:</b> new ECG and wall-motion changes that localize to a coronary territory or graft/button.</li></ul>`
    },
    {
      type: "checkpoint",
      q: "After cardiac surgery, MAP improves with norepinephrine but lactate continues to rise, pulse pressure remains narrow and urine output falls. What is the best interpretation?",
      options: [
        "The MAP proves perfusion is adequate",
        "Pressure improved, but flow remains inadequate",
        "The patient must have isolated anemia",
        "No further hemodynamic assessment is needed"
      ],
      answer: 1,
      explain: "Arterial pressure is not cardiac output. Persistent organ-hypoperfusion signals require reassessment of flow, oxygen delivery and the underlying mechanism."
    },
    {
      title: "Interrogate the Operation",
      html: `<p>Every operation creates a short list of technical complications that should move to the top of the differential when the corresponding signal appears. After CABG, new regional ischemia is a graft-flow problem until demonstrated otherwise. After aortic-root replacement, new RV ischemia raises concern for right coronary-button compromise. After mitral repair, hypotension with LVOT obstruction and posterior MR suggests systolic anterior motion. After LVAD implantation, a small LV with leftward septal shift and high CVP suggests inadequate RV delivery or excessive pump speed.</p>
      <p>The operative question is not merely “what can go wrong?” It is “which correctable lesion becomes irreversible if I wait?” That question determines whether the next step is supportive optimization, urgent imaging, return to bypass or re-exploration.</p>`
    },
    {
      title: "Use Evidence Without Hiding Behind It",
      html: `<p>A trial answers a defined question in a defined population using defined endpoints. Before applying it, state the population, comparator, primary result and one important limitation. FREEDOM supports CABG for diabetes with multivessel disease; it does not make every individual with diabetes an automatic surgical candidate. MOMENTUM 3 established major advantages of a magnetically levitated LVAD platform; it did not eliminate RV failure, bleeding or infection.</p>
      <p>When evidence and the bedside appear discordant, first check whether the patient matches the study and whether the endpoint matches the decision being made. The senior answer is often conditional: “The trial favors this strategy <i>if</i> these anatomic and patient-level assumptions hold.”</p>`
    },
    {
      type: "checkpoint",
      q: "Which statement best demonstrates correct use of trial evidence?",
      options: [
        "Match population, comparator, endpoint, and limits to the patient",
        "A positive trial means the intervention is best for every patient",
        "Only the trial name matters",
        "Observational experience always overrides randomized evidence"
      ],
      answer: 0,
      explain: "Evidence becomes clinically useful only after its design and boundaries are matched to the decision in front of you."
    },
    {
      title: "Preserve the Rescue Route",
      html: `<p>The best next move, like a climber's, <b>never lets go of the rope before the next hold is secure</b>: it treats the leading mechanism <em>and</em> keeps an escape route if you turn out to be wrong. That is why redo sternotomy is planned with peripheral rescue access already ready before the saw touches bone; why a suspected graft or coronary-button problem is worked up while the patient is still on — or one step from — bypass; and why a bleeding algorithm corrects the measured coagulopathy while the team keeps hunting for a surgical source. You commit to a diagnosis without ever burning the bridge back.</p>
      <p>State your escalation trigger before the patient deteriorates further: a lactate trajectory, failure of a loading maneuver, persistent regional wall-motion abnormality, inability to maintain reservoir level, refractory pacing failure or continued bleeding after targeted correction. A plan without an escalation threshold is only a hope.</p>`
    },
    {
      type: "checkpoint",
      q: "What makes a management plan defensible in an integration case?",
      options: [
        "Naming one diagnosis with certainty",
        "Choosing the most aggressive treatment first",
        "Listing every possible complication",
        "Mechanism → action → monitor → escalate"
      ],
      answer: 3,
      explain: "A defensible plan makes its mechanism, action, reassessment and rescue threshold explicit."
    }
  ]
};
