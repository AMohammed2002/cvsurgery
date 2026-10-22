/* Falling-behind pacing regression tests — run with: node tools/test-pacing.js */
"use strict";

process.env.TZ = "America/Edmonton";

const assert = require("assert");
const createPacingEngine = require("../js/pacing.js");

function memoryStore(seed, failWrites) {
  const state = Object.assign({}, seed || {});
  const writes = [];
  return {
    state,
    writes,
    get(key, fallback) {
      return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : fallback;
    },
    set(key, value) {
      if (failWrites) throw new Error("quota exceeded");
      writes.push({ key, value });
      state[key] = value;
    },
    remove(key) {
      if (failWrites) throw new Error("quota exceeded");
      writes.push({ key, value: null });
      delete state[key];
    }
  };
}

function buildFixture(elapsedDay) {
  const lessons = [];
  const ecosystems = [];
  const crises = [];
  for (let day = 1; day <= 14; day++) {
    lessons.push({ id: `l${day}a`, day }, { id: `l${day}b`, day });
    ecosystems.push({
      day,
      anatomy: { id: `a${day}` },
      surgery: { id: day === 8 ? "s-shared" : `s${day}` },
      evidence: { id: `e${day}` },
      viva: { id: `v${day}` }
    });
    crises.push({ id: `c${day}`, day });
  }
  /* A source reused on multiple days must be classified by its first day. */
  ecosystems[2].surgery.id = "s-shared";
  const sourceRecords = [
    { type: "surgery", id: "s-shared", linkedDays: [8, 3] },
    { type: "surgery", id: "s-optional-shared", linkedDays: [8, 3] },
    { type: "anatomy", id: "a-optional-day3", linkedDays: [3] },
    { type: "evidence", id: "e-unscheduled", linkedDays: [] },
    { type: "physiology", id: "or-monitor", linkedDays: [], alwaysAvailable: true }
  ];
  const raw = {
    lesson: Object.create(null),
    anatomy: Object.create(null),
    surgery: Object.create(null),
    evidence: Object.create(null),
    crisis: Object.create(null),
    viva: Object.create(null)
  };
  const store = memoryStore();
  let now = new Date(2026, 0, elapsedDay, 12, 0, 0);
  let indeterminate = false;
  let overrideActive = false;
  const engine = createPacingEngine({
    store,
    startDate: "2026-01-01",
    clock: { now: () => now },
    data: {
      lessons: () => lessons,
      dayEcosystems: () => ecosystems,
      crises: () => crises,
      sources: () => sourceRecords
    },
    completion: {
      isComplete(type, id) { return raw[type] && raw[type][id]; },
      isIndeterminate() { return indeterminate; }
    },
    isOverrideActive() { return overrideActive; }
  });
  function lessonsComplete(day) {
    raw.lesson[`l${day}a`] = true;
    raw.lesson[`l${day}b`] = true;
  }
  function exact75(day) {
    raw.lesson[`l${day}a`] = true;
    raw.lesson[`l${day}b`] = false;
    raw.anatomy[`a${day}`] = true;
    raw.surgery[ecosystems[day - 1].surgery.id] = true;
    raw.evidence[`e${day}`] = true;
    raw.crisis[`c${day}`] = true;
    raw.viva[`v${day}`] = { grades: [1, 1, 1] };
  }
  return {
    engine, store, raw, lessons, ecosystems, crises,
    lessonsComplete,
    exact75,
    setElapsed(day) { now = new Date(2026, 0, day, 12, 0, 0); },
    setIndeterminate(value) { indeterminate = value; },
    setOverride(value) { overrideActive = !!value; }
  };
}

/* Local civil dates remain one ordinal apart across 23- and 25-hour days. */
const springBefore = new Date(2026, 2, 7, 12);
const springAfter = new Date(2026, 2, 8, 12);
assert.strictEqual((springAfter - springBefore) / 3600000, 23, "Edmonton spring transition is a 23-hour local day");
assert.strictEqual(
  createPacingEngine.civilOrdinal(springAfter) - createPacingEngine.civilOrdinal(springBefore),
  1,
  "civil ordinal advances once over spring DST"
);
const fallBefore = new Date(2026, 9, 31, 12);
const fallAfter = new Date(2026, 10, 1, 12);
assert.strictEqual((fallAfter - fallBefore) / 3600000, 25, "Edmonton fall transition is a 25-hour local day");
assert.strictEqual(
  createPacingEngine.civilOrdinal(fallAfter) - createPacingEngine.civilOrdinal(fallBefore),
  1,
  "civil ordinal advances once over fall DST"
);
assert.strictEqual(createPacingEngine.civilDateString("2028-02-29"), "2028-02-29", "leap day is valid");
assert.ok(Number.isNaN(createPacingEngine.civilOrdinal("2026-02-30")), "invalid civil date is rejected");

/* A future enrollment date does not manufacture elapsed days or locks. */
{
  const fixture = buildFixture(1);
  const future = createPacingEngine({
    store: memoryStore(),
    startDate: "2026-01-10",
    clock: () => new Date(2026, 0, 5, 12),
    data: { lessons: fixture.lessons, dayEcosystems: fixture.ecosystems, crises: fixture.crises },
    completion: { isComplete: () => false }
  }).getState();
  assert.strictEqual(future.elapsedDay, -4);
  assert.strictEqual(future.scheduledDay, 1);
  assert.strictEqual(future.status, "on-track");
  assert.strictEqual(future.locksEnabled, false);
}

/* Weighted progress preserves exact 50% and 75% decision boundaries. */
{
  const f = buildFixture(1);
  assert.strictEqual(f.engine.canAccessCoreDay(1), true);
  assert.strictEqual(f.engine.canAccessCoreDay(2), false, "enrolled on-track learners cannot open future core days");
  assert.deepStrictEqual(
    f.engine.filterQuestions([{ id: "today", day: 1 }, { id: "capstone", day: 14, lesson: "l1a" }], "standard").map(q => q.id),
    ["today"],
    "Day-14 questions cannot leak through an earlier lesson while on track"
  );
  assert.strictEqual(f.engine.dayProgress(1).score, 0, "empty day starts at zero");
  f.lessonsComplete(1);
  let progress = f.engine.dayProgress(1);
  assert.strictEqual(progress.score, 50, "all lessons contribute exactly half");
  assert.deepStrictEqual(progress.contributions, {
    lessons: 50, anatomy: 0, surgery: 0, evidence: 0, crisis: 0, viva: 0
  });

  f.raw.lesson.l1b = false;
  f.raw.anatomy.a1 = true;
  f.raw.surgery.s1 = true;
  f.raw.evidence.e1 = 70;
  f.raw.crisis.c1 = true;
  f.raw.viva.v1 = { grades: [1, 0] };
  progress = f.engine.dayProgress(1);
  assert.strictEqual(progress.score, 65, "evidence at 70% counts while an incomplete viva does not");
  f.raw.viva.v1 = { grades: [1, 0, 2] };
  assert.strictEqual(f.engine.dayProgress(1).score, 75, "half the lessons plus all five stations is exactly 75%");
  f.raw.evidence.e1 = 69;
  assert.strictEqual(f.engine.dayProgress(1).score, 65, "evidence below 70% does not count");
}

/* Yellow applies to lags one through three; red begins at exactly four. */
{
  const lagOne = buildFixture(3);
  lagOne.lessonsComplete(1);
  let state = lagOne.engine.getState();
  assert.strictEqual(state.status, "yellow");
  assert.strictEqual(state.activeDay, 2);
  assert.strictEqual(state.lag, 1);
  assert.strictEqual(state.threshold, 50);
  assert.strictEqual(lagOne.engine.canAccessCoreDay(2), true);
  assert.strictEqual(lagOne.engine.canAccessCoreDay(3), false);
  lagOne.lessonsComplete(2);
  assert.strictEqual(lagOne.engine.getState().status, "on-track", "exactly 50% clears yellow");

  const lagThree = buildFixture(4);
  lagThree.lessonsComplete(2);
  lagThree.lessonsComplete(3);
  state = lagThree.engine.getState();
  assert.strictEqual(state.status, "yellow");
  assert.strictEqual(state.lag, 3);

  const lagFour = buildFixture(5);
  [2, 3, 4].forEach(lagFour.lessonsComplete);
  state = lagFour.engine.getState();
  assert.strictEqual(state.status, "red");
  assert.strictEqual(state.activeDay, 1);
  assert.strictEqual(state.threshold, 75);
  assert.strictEqual(state.recovery.entryElapsedDay, 5);
  assert.strictEqual(state.recovery.cohortEnd, 4);
  assert.strictEqual(state.recovery.lockFromDay, 3);
  assert.ok(lagFour.store.state.recovery, "red entry is durably recorded");
}

/* Administrator override bypasses pacing only and restores the same underlying state when disabled. */
{
  const f = buildFixture(5);
  [2, 3, 4].forEach(f.lessonsComplete);
  const before = f.engine.getState();
  assert.strictEqual(before.status, "red");
  assert.strictEqual(f.engine.canAccessCoreDay(14), false);
  assert.strictEqual(f.engine.canAccessSource("evidence", "e-unscheduled", "browse"), false);

  f.setOverride(true);
  const overridden = f.engine.getState();
  assert.strictEqual(overridden.status, "override");
  assert.strictEqual(overridden.overrideActive, true);
  assert.strictEqual(overridden.underlyingStatus, "red");
  assert.strictEqual(overridden.underlyingActiveDay, 1);
  assert.strictEqual(overridden.activeStudyDay, 5, "override Today follows the scheduled day");
  assert.strictEqual(overridden.locksEnabled, false);
  assert.strictEqual(f.engine.canAccessCoreDay(14), true);
  assert.strictEqual(f.engine.canAccessSource("evidence", "e-unscheduled", "browse"), true);
  assert.deepStrictEqual(
    f.engine.filterCards([{ id: "locked", source: { type: "evidence", id: "e-unscheduled" } }], "full-deck").map(card => card.id),
    ["locked"],
    "override does not prune mixed card pools"
  );
  assert.deepStrictEqual(
    f.engine.filterQuestions([{ id: "capstone", day: 14 }], "standard").map(question => question.id),
    ["capstone"],
    "override does not prune future question pools"
  );
  assert.strictEqual(f.engine.authorizeRoute("#/exam").allowed, true);

  f.setOverride(false);
  const restored = f.engine.getState();
  assert.strictEqual(restored.status, "red");
  assert.strictEqual(restored.activeDay, before.activeDay);
  assert.strictEqual(restored.recovery.entryElapsedDay, before.recovery.entryElapsedDay);
  assert.strictEqual(f.engine.authorizeRoute("#/exam").allowed, false);
}

/* Day 14 joins prior-day evaluation on elapsed Day 15 instead of lateness clamping. */
{
  const day14 = buildFixture(14);
  for (let day = 1; day <= 13; day++) day14.lessonsComplete(day);
  let state = day14.engine.getState();
  assert.strictEqual(state.elapsedDay, 14);
  assert.strictEqual(state.priorDayEnd, 13);
  assert.strictEqual(state.status, "on-track", "Day 14 is not overdue during elapsed Day 14");

  const f = buildFixture(15);
  for (let day = 1; day <= 13; day++) f.lessonsComplete(day);
  state = f.engine.getState();
  assert.strictEqual(state.elapsedDay, 15);
  assert.strictEqual(state.scheduledDay, 14);
  assert.strictEqual(state.priorDayEnd, 14);
  assert.strictEqual(state.status, "yellow");
  assert.strictEqual(state.activeDay, 14);
  assert.strictEqual(state.lag, 1);

  const day30 = buildFixture(30);
  for (let day = 1; day <= 13; day++) day30.exact75(day);
  state = day30.engine.getState();
  assert.strictEqual(state.elapsedDay, 30, "elapsed time remains unbounded after the curriculum");
  assert.strictEqual(state.scheduledDay, 14, "display position remains clamped to Day 14");
  assert.strictEqual(state.status, "red");
  assert.strictEqual(state.activeDay, 14, "Day 14 remains recoverable long after the course window");
}

/* A red cohort remains frozen over midnight and advances at 75%. */
{
  const f = buildFixture(5);
  [2, 4].forEach(f.exact75);
  f.lessonsComplete(3); // Day 3 is no longer deficient, but is still below red's 75% exit threshold.
  let state = f.engine.getState();
  assert.strictEqual(state.status, "red");
  assert.strictEqual(state.activeDay, 1);
  f.setElapsed(8);
  state = f.engine.getState();
  assert.strictEqual(state.recovery.entryElapsedDay, 5);
  assert.strictEqual(state.recovery.cohortEnd, 4, "midnight does not expand the frozen cohort");
  f.setElapsed(3);
  state = f.engine.getState();
  assert.strictEqual(state.status, "red");
  assert.strictEqual(state.clockRollback, true, "clock rollback cannot shrink or clear a frozen cohort");
  assert.strictEqual(state.recovery.cohortEnd, 4);
  f.setElapsed(8);
  f.exact75(1);
  state = f.engine.getState();
  assert.strictEqual(state.activeDay, 3, "recovery advances to the earliest cohort day below 75%");
  assert.strictEqual(state.oldestDeficientDay, null, "red persists even after all cohort days reach 50%");

  assert.strictEqual(f.engine.sourceSchedule("surgery", "s-shared")[0], 3, "shared sources use first curriculum introduction");
  assert.deepStrictEqual(f.engine.sourceSchedule("surgery", "s-shared"), [3, 8]);
  assert.strictEqual(f.engine.isRequiredSource(3, "anatomy", "a3"), true);
  assert.strictEqual(f.engine.canAccessSource("anatomy", "a2", "module"), true, "two-day buffer remains open");
  assert.strictEqual(f.engine.canAccessSource("anatomy", "a3", "module"), true, "active recovery source receives staged exception");
  assert.strictEqual(f.engine.canAccessSource("anatomy", "a-optional-day3", "module"), false, "optional source at cutoff remains locked");
  assert.strictEqual(f.engine.canAccessSource("evidence", "e-unscheduled", "module"), false, "unscheduled extras remain locked in red");
  assert.strictEqual(f.engine.canAccessSource("physiology", "or-monitor", "module"), true, "explicitly always-available labs bypass recovery locks");
  assert.strictEqual(f.engine.canAccessSource("surgery", "s-shared", "module"), true, "active shared source receives the staged exception");
  assert.strictEqual(f.engine.canAccessSource("surgery", "s-optional-shared", "module"), false, "non-active shared source follows earliest introduction");
  assert.strictEqual(f.engine.canAccessCoreDay(4), false, "later core day remains hard locked");

  /* One immutable/shared operation credit counts on every canonically linked
     day and is not tied to a reversible article-read UI flag. */
  f.raw.surgery["s-shared"] = true;
  assert.strictEqual(f.engine.dayProgress(3).contributions.surgery, 10);
  assert.strictEqual(f.engine.dayProgress(8).contributions.surgery, 10);

  const cards = [
    { id: "allowed-region", region: "a2" },
    { id: "active-region", region: "a3" },
    { id: "locked-section", section: "s-optional-shared" },
    { id: "locked-source-due", source: { type: "anatomy", id: "a-optional-day3" } },
    { id: "locked-source-later", source: { type: "anatomy", id: "a-optional-day3" } },
    { id: "locked-source-rel", source: { type: "anatomy", id: "a-optional-day3" } }
  ];
  assert.deepStrictEqual(
    f.engine.filterCards(cards, "full-deck").map(card => card.id),
    ["allowed-region", "active-region"],
    "full decks exclude every locked source and preserve original cards"
  );
  assert.deepStrictEqual(
    f.engine.filterCards(cards, {
      purpose: "review",
      now: 1000,
      states: {
        "locked-source-due": { st: "rev", due: 999 },
        "locked-source-later": { st: "rev", due: 1001 },
        "locked-source-rel": { st: "rel", due: 5000 }
      }
    }).map(card => card.id),
    ["allowed-region", "active-region", "locked-source-due", "locked-source-rel"],
    "review exception admits only due or relearning locked cards"
  );

  const questions = [
    { id: "q-active", day: 3 },
    { id: "q-later", day: 4 },
    { id: "q-capstone-from-early-lesson", day: 14, lesson: "l1a" },
    { id: "q-undated" }
  ];
  assert.deepStrictEqual(
    f.engine.filterQuestions(questions, "daily").map(question => question.id),
    ["q-active"],
    "ordinary pools use q.day and reject undated or later questions"
  );
  assert.deepStrictEqual(
    f.engine.filterQuestions(questions, {
      purpose: "weak",
      stats: { "q-later": { seen: 2, ok: 1 } }
    }).map(question => question.id),
    ["q-active", "q-later"],
    "weakness drill retains prior misses without leaking other later questions"
  );

  assert.strictEqual(f.engine.authorizeRoute("#/day/4").allowed, false);
  assert.strictEqual(f.engine.authorizeRoute("#/lesson/l4a").allowed, false);
  assert.strictEqual(f.engine.authorizeRoute("#/anatomy/a3").allowed, true);
  assert.strictEqual(f.engine.authorizeRoute("#/anatomy/a-optional-day3").allowed, false);
  assert.strictEqual(f.engine.authorizeRoute("#/physiology/or-monitor").allowed, true);
  assert.strictEqual(f.engine.authorizeRoute("#/extras").allowed, true);
  assert.strictEqual(f.engine.describeRoute("#/quiz/day/4").kind, "core");
  [
    ["#/cards/source/evidence/e3", "source"],
    ["#/surgery/quiz/s/s-shared", "source"],
    ["#/surgery/cards/s/s-shared", "source"],
    ["#/surgery/order/s-shared", "source"],
    ["#/anatomy/a3", "source"],
    ["#/trials/e3", "source"],
    ["#/physiology/pv-loop", "source"],
    ["#/crisis/c3", "source"],
    ["#/viva/v3", "source"],
    ["#/exercise/ex3", "source"],
    ["#/angiography/case/anything", "source"],
    ["#/anat-cards/study", "filtered"],
    ["#/quiz/topic/Integration", "filtered"],
    ["#/not-a-real-route", "unknown"]
  ].forEach(([hash, kind]) => assert.strictEqual(f.engine.describeRoute(hash).kind, kind, hash));
}

/* Completing one cohort atomically overwrites it when a second red backlog exists. */
{
  const f = buildFixture(5);
  [2, 3, 4].forEach(f.lessonsComplete);
  assert.strictEqual(f.engine.getState().recovery.entryElapsedDay, 5);
  [1, 2, 3, 4].forEach(f.exact75);
  f.setElapsed(10);
  f.store.writes.length = 0;
  const state = f.engine.getState();
  assert.strictEqual(state.status, "red");
  assert.strictEqual(state.recovery.entryElapsedDay, 10);
  assert.strictEqual(state.recovery.cohortEnd, 9);
  assert.strictEqual(state.activeDay, 5);
  assert.strictEqual(f.store.writes.length, 1, "consecutive red transition uses one durable write");
  assert.ok(f.store.writes[0].value, "old recovery is overwritten without a transient clear");
}

/* Unavailable progress or failed recovery persistence always fails open. */
{
  const f = buildFixture(5);
  [2, 3, 4].forEach(f.lessonsComplete);
  f.setIndeterminate("Pacing credit could not be read.");
  let state = f.engine.getState();
  assert.strictEqual(state.status, "indeterminate");
  assert.strictEqual(state.locksEnabled, false);
  assert.match(state.warning, /credit/i);

  const brokenStore = memoryStore({}, true);
  const broken = createPacingEngine({
    store: brokenStore,
    startDate: "2026-01-01",
    clock: () => new Date(2026, 0, 5, 12),
    data: { lessons: f.lessons, dayEcosystems: f.ecosystems, crises: f.crises },
    completion: {
      isComplete(type, id) {
        if (type === "lesson") return /^l[234]/.test(id);
        return false;
      }
    }
  });
  state = broken.getState();
  assert.strictEqual(state.status, "indeterminate");
  assert.strictEqual(state.locksEnabled, false);
  assert.match(state.warning, /quota exceeded/i);

  const falseStore = memoryStore();
  falseStore.set = () => false;
  const refused = createPacingEngine({
    store: falseStore,
    startDate: "2026-01-01",
    clock: () => new Date(2026, 0, 5, 12),
    data: { lessons: f.lessons, dayEcosystems: f.ecosystems, crises: f.crises },
    completion: { isComplete: (type, id) => type === "lesson" && /^l[234]/.test(id) }
  });
  state = refused.getState();
  assert.strictEqual(state.status, "indeterminate", "a false Store.set result is treated as a failed durable transition");
  assert.strictEqual(state.locksEnabled, false);
}

console.log("Pacing tests passed: civil dates, weighted thresholds, yellow/red recovery, frozen cohorts, access policy, pool filters, and fail-open storage.");
