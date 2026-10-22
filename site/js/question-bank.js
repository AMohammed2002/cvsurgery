/* Shared Question Bank transforms: deterministic canonical balance plus
   per-session balanced option permutation. No learner state is stored here. */
(function (root) {
  "use strict";

  const LETTERS = "ABCD";
  /* Stable six-per-position blueprints. Each 24-character string is aligned to
     that lesson's questions sorted by day, then numeric id suffix. Keeping the
     blueprint separate from authored options makes three-digit ids safe and
     makes canonical delivery O(n) instead of running a search on every boot. */
  const CANONICAL_TARGETS = Object.freeze({
    "d1-chambers": "031103210301032123221320",
    "d1-conduction": "121012103203320332103210",
    "d1-coronaries": "002301230033112301221123",
    "d1-valves-anat": "333231223013011200120012",
    "d10-cardioplegia": "032103210311032203210321",
    "d10-circuit": "123002310231123102310230",
    "d10-weaning": "210321031203220321031103",
    "d11-bleeding": "103213021032130210321302",
    "d11-coag": "230123002301231123102301",
    "d11-reexplore": "021302133210321002130213",
    "d12-af": "120311031103220321032203",
    "d12-block": "100210321332103213021032",
    "d12-pacing": "230023012300231023112311",
    "d13-complications": "321002103213021032133210",
    "d13-lcos": "102300231123102310231023",
    "d13-vaso": "310231023002310231123012",
    "d14-integration": "031103110322031203120322",
    "d2-angina": "021032103213021332103210",
    "d2-ischemia": "002311231023102310231023",
    "d2-o2": "311231023102301230023102",
    "d3-ar": "032203120311032103120312",
    "d3-as": "123102301230023002311231",
    "d3-mr": "012300230123012310231123",
    "d3-ms": "133210321002103210321302",
    "d3-tr": "032203210311031103220312",
    "d4-cath": "321002130213321302130210",
    "d4-ct": "312300231023012301231021",
    "d4-echo": "301230123012310230123102",
    "d5-heartteam": "031203120311032203220311",
    "d5-optimize": "023012301230023112311230",
    "d5-risk": "112310231023012300231023",
    "d6-conduits": "133213021002103213021302",
    "d6-indications": "230123002311230023102311",
    "d6-technique": "023102311231023012301230",
    "d7-mitral": "210311031203210322031203",
    "d7-prosthetics": "300231023112311230123002",
    "d7-savr": "230123102310230023112301",
    "d7-tavr": "321302103210021302133210",
    "d8-aneurysm": "110311032203120312032203",
    "d8-dissection": "100213321332100210321302",
    "d8-pericardium": "230023112310231023102310",
    "d9-ecmo": "021332103213021332100210",
    "d9-iabp": "012300231023112300231123",
    "d9-vad": "311230123012310230023012"
  });

  function numericId(question) {
    const match = /-(\d+)$/.exec(String(question && question.id || ""));
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  }

  function randomInt(max) {
    if (!Number.isInteger(max) || max < 1) return 0;
    if (root.crypto && root.crypto.getRandomValues) {
      const range = 0x100000000, limit = range - (range % max), value = new Uint32Array(1);
      do { root.crypto.getRandomValues(value); } while (value[0] >= limit);
      return value[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function shuffled(values, intFn) {
    const copy = values.slice(), pick = intFn || randomInt;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = pick(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function sequenceQuality(sequence) {
    let run = sequence.length ? 1 : 0, maxRun = run;
    const transitions = new Set();
    for (let i = 1; i < sequence.length; i++) {
      transitions.add(String(sequence[i - 1]) + String(sequence[i]));
      run = sequence[i] === sequence[i - 1] ? run + 1 : 1;
      maxRun = Math.max(maxRun, run);
    }
    return { maxRun, transitions: transitions.size };
  }

  function balancedTargets(count, intFn) {
    if (!Number.isInteger(count) || count < 1) return [];
    const pick = intFn || randomInt, counts = [0, 0, 0, 0], slots = [0, 1, 2, 3];
    const base = Math.floor(count / 4);
    counts.fill(base);
    shuffled(slots, pick).slice(0, count % 4).forEach(slot => { counts[slot]++; });
    const pool = [];
    counts.forEach((n, slot) => { for (let i = 0; i < n; i++) pool.push(slot); });
    const minTransitions = Math.min(10, Math.max(0, count - 1));
    for (let attempt = 0; attempt < 500; attempt++) {
      const candidate = shuffled(pool, pick), quality = sequenceQuality(candidate);
      if (quality.maxRun <= 2 && quality.transitions >= minTransitions) return candidate;
    }
    /* Deterministic fallback when ambient randomness is unavailable or degenerate. */
    const result = [], left = counts.slice();
    while (result.length < count) {
      const previous = result[result.length - 1], before = result[result.length - 2];
      const candidates = slots.filter(slot => left[slot] > 0 && !(slot === previous && slot === before))
        .sort((a, b) => left[b] - left[a] || a - b);
      const slot = candidates.length ? candidates[0] : slots.filter(value => left[value] > 0)[0];
      result.push(slot); left[slot]--;
    }
    return result;
  }

  function validOrder(order) {
    return Array.isArray(order) && order.length === 4 && order.every(Number.isInteger) &&
      order.every(index => index >= 0 && index < 4) && new Set(order).size === 4;
  }

  function buildQuestion(question, order) {
    if (!question || !Array.isArray(question.options) || question.options.length !== 4 ||
        !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3 || !validOrder(order)) return null;
    const answer = order.indexOf(question.answer);
    if (answer < 0) return null;
    return { ...question, options: order.map(index => question.options[index]), answer };
  }

  function permuteQuestion(question, target, intFn) {
    if (!question || !Number.isInteger(target) || target < 0 || target > 3) return { order: null, question: null };
    const distractors = shuffled([0, 1, 2, 3].filter(index => index !== question.answer), intFn);
    const order = new Array(4);
    order[target] = question.answer;
    [0, 1, 2, 3].filter(slot => slot !== target).forEach((slot, index) => { order[slot] = distractors[index]; });
    return { order, question: buildQuestion(question, order) };
  }

  function buildBalancedBlock(questions, limit, intFn) {
    const base = shuffled(questions || [], intFn).slice(0, limit || 15);
    const targets = balancedTargets(base.length, intFn);
    return base.map((question, index) => permuteQuestion(question, targets[index], intFn).question).filter(Boolean);
  }

  function enrichReferences(question) {
    const copy = { ...question }, refs = Array.isArray(question && question.refs) ? question.refs.slice() : [];
    const add = id => { if (!refs.includes(id)) refs.push(id); };
    const text = [question && question.stem, ...(question && question.options || []), question && question.explain]
      .join(" ").replace(/<[^>]*>/g, " ");
    const lesson = String(question && question.lesson || "");
    const timeSensitive = question && (question.kind === "evidence" || question.kind === "quantitative" ||
      /(?:\d+(?:\.\d+)?\s*(?:%|mg|mcg|g\/l|mmol|mm\s*hg|mm|cm|ml|l\/min|hours?|days?|weeks?|months?|years?)|\b(?:dose|threshold|target|timing|trial|guideline|mortality|survival|anticoag|transfus|hold|stop)\b)/i.test(text));

    if (/\bFREEDOM\b/i.test(text)) add("freedom");
    if (/\bSYNTAX\b/i.test(text)) add("syntax");
    if (/\b(?:EXCEL|NOBLE)\b/i.test(text)) add("excel-noble");
    if (/\b(?:COAPT|MITRA-?FR)\b/i.test(text)) add("coapt-mitrafr");
    if (/\bTRICS(?:\s+III)?\b/i.test(text)) add("trics-iii");
    if (/\b(?:STICH|STICHES)\b/i.test(text)) add("stiches");
    if (/\bISCHEMIA(?:-EXTEND)?\b/.test(text)) add("ischemia");
    if (/\bPARTNER\s*1B\b/i.test(text)) add("partner-1b");
    if (/\bPARTNER\s*3\b/i.test(text)) add("partner-3");
    if (/\b(?:CoreValve|Evolut)\b/i.test(text)) add("evolut-low-risk");
    if (/\bMOMENTUM\s*3\b/i.test(text)) add("momentum-3");
    if (/\bIABP-SHOCK\s*II\b/i.test(text)) add("iabp-shock-ii");
    if (/\bPROACT\b/i.test(text)) add("proact");
    if (/\bRE-ALIGN\b/i.test(text)) add("re-align");

    if (timeSensitive) {
      if (/^d2-/.test(lesson) || /^d6-/.test(lesson)) add("acc-aha-revasc-2021");
      if (/^d3-/.test(lesson) || /^d7-/.test(lesson)) add("acc-aha-vhd-2020");
      if (/^d4-/.test(lesson) && /valve|stenosis|regurg|gradient|calcium|annul/i.test(text)) add("acc-aha-vhd-2020");
      if (/^d5-optimize/.test(lesson)) add("eacts-pbm-2024");
      if (/^d5-heartteam/.test(lesson) && /valve|tavr|savr|prosthe/i.test(text)) add("acc-aha-vhd-2020");
      if (/^d5-heartteam/.test(lesson) && /cabg|pci|coronar/i.test(text)) add("acc-aha-revasc-2021");
      if (/^d8-(?:aneurysm|dissection)/.test(lesson)) { add("acc-aha-aortic-2022"); add("eacts-sts-aortic-2024"); }
      if (/^d9-/.test(lesson)) add("ishlt-mcs-2023");
      if (/^d10-/.test(lesson)) add("eacts-cpb-2019");
      if (/^d11-/.test(lesson)) add("eacts-pbm-2024");
      if (/^d12-/.test(lesson)) { add("acc-aha-af-2023"); add("sts-poaf-2026"); }
      if (/^d13-/.test(lesson)) add("acc-aha-hf-2022");
      if (/^d14-/.test(lesson)) {
        if (/aort|dissection/i.test(text)) add("eacts-sts-aortic-2024");
        if (/cabg|graft|coronar|revascular/i.test(text)) add("acc-aha-revasc-2021");
        if (/valve|mitral|tavr|savr|prosthe/i.test(text)) add("acc-aha-vhd-2020");
        if (/bypass|cpb|cardiopleg/i.test(text)) add("eacts-cpb-2019");
        if (/bleed|coag|transfus|fibrin|platelet/i.test(text)) add("eacts-pbm-2024");
        if (/atrial fibrillation|postoperative af|\bpoaf\b/i.test(text)) add("sts-poaf-2026");
        if (/\b(?:ecmo|vad|lvad|rvad|iabp)\b/i.test(text)) add("ishlt-mcs-2023");
      }
    }
    copy.refs = refs;
    return copy;
  }

  function canonicalScore(questions, targets) {
    const byDay = {}, byTopic = {};
    questions.forEach((q, index) => {
      const day = String(q.day), topic = String(q.topic || "");
      (byDay[day] ||= [0, 0, 0, 0])[targets[index]]++;
      (byTopic[topic] ||= [0, 0, 0, 0])[targets[index]]++;
    });
    let score = 0;
    Object.values(byDay).forEach(counts => { const excess = Math.max(0, Math.max(...counts) - Math.min(...counts) - 1); score += excess * excess * 100; });
    Object.values(byTopic).forEach(counts => { const excess = Math.max(0, Math.max(...counts) - Math.min(...counts) - 1); score += excess * excess * 75; });
    const sorted = questions.map((q, index) => ({ q, target: targets[index] }))
      .sort((a, b) => a.q.day - b.q.day || numericId(a.q) - numericId(b.q) || String(a.q.id).localeCompare(String(b.q.id)));
    let lastDay = null, previous = null, run = 0;
    sorted.forEach(item => {
      if (item.q.day !== lastDay) { lastDay = item.q.day; previous = null; run = 0; }
      run = item.target === previous ? run + 1 : 1;
      if (run > 2) score += (run - 2) * 25;
      previous = item.target;
    });
    return score;
  }

  function canonicalize(questions) {
    const input = (questions || []).map(enrichReferences);
    const groups = {};
    input.forEach((question, index) => (groups[question.lesson] ||= []).push(index));
    const lessonIds = Object.keys(groups).sort();
    if (!input.length || lessonIds.some(id => groups[id].length !== 24)) return input;

    const targets = new Array(input.length), dayCounts = {};
    const hasStableBlueprint = lessonIds.every(lessonId => /^[0-3]{24}$/.test(CANONICAL_TARGETS[lessonId] || ""));
    if (hasStableBlueprint) lessonIds.forEach(lessonId => {
      groups[lessonId].slice().sort((left, right) =>
        input[left].day - input[right].day || numericId(input[left]) - numericId(input[right]) || String(input[left].id).localeCompare(String(input[right].id)))
        .forEach((questionIndex, localIndex) => { targets[questionIndex] = Number(CANONICAL_TARGETS[lessonId][localIndex]); });
    });
    else lessonIds.forEach((lessonId, lessonIndex) => {
      const remaining = [6, 6, 6, 6];
      const indexes = groups[lessonId].slice().sort((left, right) =>
        input[left].day - input[right].day || numericId(input[left]) - numericId(input[right]) || String(input[left].id).localeCompare(String(input[right].id)));
      indexes.forEach((questionIndex, localIndex) => {
        const question = input[questionIndex], counts = (dayCounts[String(question.day)] ||= [0, 0, 0, 0]);
        const candidates = [0, 1, 2, 3].filter(slot => remaining[slot] > 0).sort((a, b) =>
          counts[a] - counts[b] || remaining[b] - remaining[a] ||
          ((a + lessonIndex + localIndex) % 4) - ((b + lessonIndex + localIndex) % 4));
        const target = candidates[0];
        targets[questionIndex] = target; remaining[target]--; counts[target]++;
      });
    });

    /* Deterministic same-lesson swaps improve day balance and authored ID-order runs
       while preserving the exact 6/6/6/6 lesson invariant. */
    let state = 0x51f15e, score = canonicalScore(input, targets);
    const next = max => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % max; };
    for (let attempt = 0; !hasStableBlueprint && attempt < 4000 && score > 0; attempt++) {
      const indexes = groups[lessonIds[next(lessonIds.length)]];
      const left = indexes[next(indexes.length)], right = indexes[next(indexes.length)];
      if (left === right || targets[left] === targets[right]) continue;
      [targets[left], targets[right]] = [targets[right], targets[left]];
      const candidate = canonicalScore(input, targets);
      if (candidate <= score) score = candidate;
      else [targets[left], targets[right]] = [targets[right], targets[left]];
    }

    return input.map((question, index) => {
      const current = question.answer, target = targets[index];
      if (current === target) return { ...question, options: question.options.slice() };
      const order = [0, 1, 2, 3].filter(option => option !== current);
      order.splice(target, 0, current);
      return buildQuestion(question, order);
    });
  }

  const api = Object.freeze({
    LETTERS, numericId, shuffled, sequenceQuality, balancedTargets, validOrder,
    buildQuestion, permuteQuestion, buildBalancedBlock, enrichReferences, canonicalize
  });
  root.QuestionBank = api;
  if (Array.isArray(root.QUESTIONS)) root.QUESTIONS = canonicalize(root.QUESTIONS);
})(typeof window !== "undefined" ? window : globalThis);
