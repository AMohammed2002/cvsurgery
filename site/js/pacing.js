/* CardiacSchool pacing and recovery policy.
   The engine is deliberately UI-free: browser adapters inject curriculum,
   completion and storage access, while tests can inject a clock and plain data. */
"use strict";

(function (root, factory) {
  var createPacingEngine = factory();
  root.createPacingEngine = createPacingEngine;
  if (typeof module === "object" && module.exports) module.exports = createPacingEngine;
})(typeof window !== "undefined" ? window : globalThis, function () {
  var DAY_MS = 86400000;
  var MAX_DAY = 14;
  var CORE_TYPES = ["anatomy", "surgery", "evidence", "crisis", "viva"];
  var DEFAULT_SCHEMA_VERSION = 1;
  var DEFAULT_POLICY_VERSION = 1;
  var RECOVERY_KEY = "recovery";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function own(object, key) {
    return !!object && Object.prototype.hasOwnProperty.call(object, key);
  }

  function canonicalType(type) {
    var value = String(type == null ? "" : type).toLowerCase();
    if (value === "operation" || value === "operations") return "surgery";
    if (value === "trial" || value === "trials") return "evidence";
    if (value === "case" || value === "daily-case" || value === "integration") return "crisis";
    if (value === "anat") return "anatomy";
    return value;
  }

  function values(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return Object.keys(value).map(function (key) { return value[key]; });
    return [];
  }

  function validDay(value) {
    var day = Number(value);
    return Number.isInteger(day) && day >= 1 && day <= MAX_DAY ? day : null;
  }

  function parseCivilDate(value) {
    if (value instanceof Date) {
      if (!Number.isFinite(value.getTime())) return null;
      return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
    }
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value == null ? "" : value));
    if (!match) return null;
    var year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    var probe = new Date(Date.UTC(year, month - 1, day));
    if (probe.getUTCFullYear() !== year || probe.getUTCMonth() + 1 !== month || probe.getUTCDate() !== day) return null;
    return { year: year, month: month, day: day };
  }

  /* UTC is used only as an integer mapping for local calendar components.
     No elapsed-time calculation is performed on local-midnight timestamps. */
  function civilOrdinal(value) {
    var parts = parseCivilDate(value);
    return parts ? Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_MS) : NaN;
  }

  function civilDateString(value) {
    var parts = parseCivilDate(value);
    if (!parts) return null;
    return String(parts.year).padStart(4, "0") + "-" +
      String(parts.month).padStart(2, "0") + "-" +
      String(parts.day).padStart(2, "0");
  }

  function safeDecode(value) {
    try { return decodeURIComponent(value); } catch (error) { return value; }
  }

  function createPacingEngine(options) {
    options = options || {};
    var store = options.store || null;
    var data = options.data || {};
    var completion = options.completion || {};
    var schemaVersion = Number.isInteger(options.schemaVersion) ? options.schemaVersion : DEFAULT_SCHEMA_VERSION;
    var policyVersion = Number.isInteger(options.policyVersion) ? options.policyVersion : DEFAULT_POLICY_VERSION;
    var recoveryKey = options.recoveryKey || RECOVERY_KEY;

    function isOverrideActive() {
      try {
        var value = typeof options.isOverrideActive === "function"
          ? options.isOverrideActive()
          : options.isOverrideActive;
        return value === true || !!(value && typeof value === "object" && value.active === true);
      } catch (error) {
        /* An unreadable administrator record must never manufacture access. */
        return false;
      }
    }

    function nowDate() {
      var source = options.clock;
      var value;
      if (typeof source === "function") value = source();
      else if (source && typeof source.now === "function") value = source.now();
      else if (typeof options.now === "function") value = options.now();
      else value = new Date();
      value = value instanceof Date ? value : new Date(value);
      return Number.isFinite(value.getTime()) ? new Date(value.getTime()) : null;
    }

    function storeRead(key) {
      if (!store) return { ok: true, missing: true, value: null };
      try {
        if (typeof store.read === "function") {
          var result = store.read(key);
          if (result && typeof result === "object" && own(result, "ok")) {
            if (!result.ok) return { ok: false, missing: false, error: result.error || "Storage read failed." };
            return { ok: true, missing: !!result.missing, value: result.value };
          }
          return { ok: true, missing: result == null, value: result };
        }
        if (typeof store.get === "function") {
          var sentinel = {};
          var value = store.get(key, sentinel);
          return value === sentinel
            ? { ok: true, missing: true, value: null }
            : { ok: true, missing: value == null, value: value };
        }
      } catch (error) {
        return { ok: false, missing: false, error: error && error.message || "Storage read failed." };
      }
      return { ok: true, missing: true, value: null };
    }

    function storeWrite(key, value) {
      if (!store) return { ok: false, error: "Persistent storage is unavailable." };
      try {
        if (value == null && typeof store.remove === "function") {
          var removed = store.remove(key);
          if (removed === false || removed && typeof removed === "object" && removed.ok === false) {
            return { ok: false, error: removed && removed.error || "Storage write failed." };
          }
        }
        else if (typeof store.write === "function") {
          var result = store.write(key, value);
          if (result === false || result && typeof result === "object" && result.ok === false) {
            return { ok: false, error: result && result.error || "Storage write failed." };
          }
        } else if (typeof store.set === "function") {
          var saved = store.set(key, value);
          if (saved === false || saved && typeof saved === "object" && saved.ok === false) {
            return { ok: false, error: saved && saved.error || "Storage write failed." };
          }
        }
        else return { ok: false, error: "Persistent storage is unavailable." };
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error && error.message || "Storage write failed." };
      }
    }

    function resolveStartDate() {
      try {
        var value;
        if (typeof options.getStartDate === "function") value = options.getStartDate();
        else if (typeof options.startDate === "function") value = options.startDate();
        else if (options.startDate != null) value = options.startDate;
        else {
          var stored = storeRead(options.startDateKey || "startDate");
          if (!stored.ok) return { ok: false, error: stored.error };
          if (stored.missing) return { ok: true, missing: true, value: null };
          value = stored.value;
        }
        if (value == null || value === "") return { ok: true, missing: true, value: null };
        var normalized = civilDateString(value);
        return normalized
          ? { ok: true, missing: false, value: normalized }
          : { ok: false, error: "The course start date is malformed." };
      } catch (error) {
        return { ok: false, error: error && error.message || "The course start date is unavailable." };
      }
    }

    function context() {
      var now = nowDate();
      if (!now) return { ok: false, error: "The current date is unavailable." };
      var start = resolveStartDate();
      if (!start.ok) return { ok: false, error: start.error, now: now };
      if (start.missing) return { ok: true, enrolled: false, now: now };
      var elapsedDay = civilOrdinal(now) - civilOrdinal(start.value) + 1;
      if (!Number.isFinite(elapsedDay)) return { ok: false, error: "Course calendar calculation failed.", now: now };
      return {
        ok: true,
        enrolled: true,
        now: now,
        today: civilDateString(now),
        startDate: start.value,
        elapsedDay: elapsedDay,
        scheduledDay: clamp(elapsedDay, 1, MAX_DAY),
        priorDayEnd: Math.max(0, Math.min(MAX_DAY, elapsedDay - 1))
      };
    }

    function resolveData(name, fallbackName) {
      var source = data[name];
      if (source == null && fallbackName) source = data[fallbackName];
      try { return typeof source === "function" ? source() : source; }
      catch (error) { return null; }
    }

    function allLessons() {
      return values(resolveData("lessons", "allLessons")).filter(function (lesson) {
        return lesson && lesson.id && validDay(lesson.day);
      });
    }

    function allEcosystems() {
      return values(resolveData("dayEcosystems", "ecosystems")).filter(function (item) {
        return item && validDay(item.day);
      });
    }

    function allCrises() {
      return values(resolveData("crises", "advancedCrises")).filter(function (item) {
        return item && item.id && validDay(item.day);
      });
    }

    function sourceRecord(type, raw, day) {
      if (raw == null) return null;
      if (typeof raw === "string" || typeof raw === "number") {
        return { type: canonicalType(type), id: String(raw), day: validDay(day) };
      }
      var id = raw.id != null ? raw.id : raw.sourceId;
      if (id == null && raw.source && typeof raw.source === "object") id = raw.source.id;
      if (id == null) return null;
      return {
        type: canonicalType(raw.type || raw.sourceType || type),
        id: String(id),
        day: validDay(day || raw.day),
        title: raw.title || raw.name || ""
      };
    }

    function ecosystemForDay(day) {
      if (typeof data.ecosystemForDay === "function") {
        try { return data.ecosystemForDay(day) || null; } catch (error) { return null; }
      }
      return allEcosystems().find(function (item) { return Number(item.day) === Number(day); }) || null;
    }

    function requiredSource(day, type) {
      day = validDay(day);
      type = canonicalType(type);
      if (!day || CORE_TYPES.indexOf(type) < 0) return null;
      if (typeof data.requiredSource === "function") {
        try {
          var injected = sourceRecord(type, data.requiredSource(day, type), day);
          if (injected) return injected;
        } catch (error) { /* fall through to canonical registries */ }
      }
      var ecosystem = ecosystemForDay(day);
      var raw = ecosystem && ecosystem[type];
      if (!raw && type === "crisis") {
        raw = allCrises().find(function (item) { return Number(item.day) === day; }) || null;
      }
      return sourceRecord(type, raw, day);
    }

    function lessonsForDay(day) {
      day = validDay(day);
      if (!day) return [];
      if (typeof data.lessonsForDay === "function") {
        try { return values(data.lessonsForDay(day)); } catch (error) { return []; }
      }
      return allLessons().filter(function (lesson) { return Number(lesson.day) === day; });
    }

    function completionRaw(type, id, day, source) {
      type = canonicalType(type);
      try {
        if (typeof completion.isComplete === "function") return { known: true, value: completion.isComplete(type, id, day, source) };
        var provider = completion[type];
        if (typeof provider === "function") return { known: true, value: provider(id, day, source) };
        if (provider && typeof provider === "object") return { known: true, value: provider[id] };
        return { known: true, value: false };
      } catch (error) {
        return { known: false, value: false, error: error && error.message || "Completion state is unavailable." };
      }
    }

    function interpretCompletion(type, result) {
      if (!result || result.known === false) return { known: false, complete: false, error: result && result.error };
      var value = result.value;
      if (value && typeof value === "object" && value.known === false) {
        return { known: false, complete: false, error: value.error || "Completion state is indeterminate." };
      }
      if (value && typeof value === "object" && own(value, "value") && own(value, "known")) value = value.value;
      type = canonicalType(type);
      if (type === "evidence") {
        if (typeof value === "number") {
          return { known: true, complete: value > 1 ? value >= 70 : value >= 0.7 };
        }
        if (value && typeof value === "object") {
          if (value.passed === true || value.pass === true || value.complete === true || value.completed === true) {
            return { known: true, complete: true };
          }
          var evidenceScore = own(value, "percent") ? value.percent : own(value, "pct") ? value.pct : value.score;
          if (typeof evidenceScore === "number") {
            var denominator = Number(value.total || value.max || 0);
            if (denominator > 0 && evidenceScore <= denominator) evidenceScore = evidenceScore / denominator;
            return { known: true, complete: evidenceScore > 1 ? evidenceScore >= 70 : evidenceScore >= 0.7 };
          }
        }
      }
      if (type === "viva" && value && typeof value === "object") {
        if (Array.isArray(value.grades)) return { known: true, complete: value.grades.length >= 3 };
        if (value.complete === true || value.completed === true) return { known: true, complete: true };
        return { known: true, complete: false };
      }
      return { known: true, complete: !!value };
    }

    function completionState(type, id, day, source) {
      return interpretCompletion(type, completionRaw(type, id, day, source));
    }

    function dayProgress(day) {
      day = validDay(day);
      if (!day) {
        return {
          day: null, score: 0, pct: 0, indeterminate: true,
          warning: "Day must be an integer from 1 through 14.",
          contributions: { lessons: 0, anatomy: 0, surgery: 0, evidence: 0, crisis: 0, viva: 0 },
          breakdown: {}
        };
      }
      var lessons = lessonsForDay(day);
      var lessonDone = 0;
      var indeterminate = false;
      var warnings = [];
      lessons.forEach(function (lesson) {
        var state = completionState("lesson", String(lesson.id), day, sourceRecord("lesson", lesson, day));
        if (!state.known) {
          indeterminate = true;
          if (state.error) warnings.push(state.error);
        } else if (state.complete) lessonDone += 1;
      });
      var lessonPoints = lessons.length ? 50 * lessonDone / lessons.length : 0;
      var contributions = {
        lessons: lessonPoints, anatomy: 0, surgery: 0, evidence: 0, crisis: 0, viva: 0
      };
      var breakdown = {
        lessons: {
          completed: lessonDone,
          total: lessons.length,
          points: lessonPoints,
          ids: lessons.map(function (lesson) { return String(lesson.id); })
        }
      };
      CORE_TYPES.forEach(function (type) {
        var source = requiredSource(day, type);
        var state = source
          ? completionState(type, source.id, day, source)
          : { known: true, complete: false };
        if (!state.known) {
          indeterminate = true;
          if (state.error) warnings.push(state.error);
        }
        contributions[type] = state.complete ? 10 : 0;
        breakdown[type] = {
          source: source,
          complete: !!state.complete,
          points: contributions[type]
        };
      });
      var score = Object.keys(contributions).reduce(function (sum, key) { return sum + contributions[key]; }, 0);
      return {
        day: day,
        score: score,
        pct: Math.round(score),
        raw: score,
        indeterminate: indeterminate,
        warning: warnings.length ? Array.from(new Set(warnings)).join(" ") : null,
        contributions: contributions,
        breakdown: breakdown
      };
    }

    function completionIndeterminate() {
      try {
        var provider = typeof options.isIndeterminate === "function"
          ? options.isIndeterminate
          : typeof completion.isIndeterminate === "function"
            ? completion.isIndeterminate
            : null;
        var result = provider ? provider() : (options.isIndeterminate || completion.isIndeterminate);
        if (!result) return null;
        if (typeof result === "string") return result;
        if (result && typeof result === "object") return result.warning || result.error || result.reason || "Progress storage is indeterminate.";
        return "Progress storage is indeterminate.";
      } catch (error) {
        return error && error.message || "Progress storage is indeterminate.";
      }
    }

    function commonState(ctx, status) {
      var scheduled = ctx && ctx.scheduledDay || 1;
      return {
        status: status,
        kind: status,
        color: status === "yellow" ? "yellow" : status === "red" ? "red" : null,
        enrolled: !!(ctx && ctx.enrolled),
        locksEnabled: status === "yellow" || status === "red",
        isBehind: status === "yellow" || status === "red",
        elapsedDay: ctx && ctx.enrolled ? ctx.elapsedDay : null,
        scheduledDay: scheduled,
        priorDayEnd: ctx && ctx.enrolled ? ctx.priorDayEnd : 0,
        activeDay: scheduled,
        activeStudyDay: scheduled,
        lag: 0,
        daysBehind: 0,
        deficitLag: 0,
        threshold: null,
        oldestDeficientDay: null,
        recovery: null,
        warning: null
      };
    }

    function indeterminateState(ctx, warning) {
      var state = commonState(ctx || { enrolled: false, scheduledDay: 1, priorDayEnd: 0 }, "indeterminate");
      state.locksEnabled = false;
      state.warning = warning || "Pacing could not be calculated safely. Content remains available.";
      return state;
    }

    function unenrolledState(ctx) {
      var state = commonState(ctx, "unenrolled");
      state.enrolled = false;
      return state;
    }

    function baseAssessment(ctx) {
      var earliest = null;
      for (var day = 1; day <= ctx.priorDayEnd; day += 1) {
        var progress = dayProgress(day);
        if (progress.indeterminate) return { indeterminate: true, warning: progress.warning };
        if (earliest == null && progress.score < 50) earliest = day;
      }
      if (earliest == null) return { status: "on-track", earliest: null, lag: 0 };
      var lag = ctx.elapsedDay - earliest;
      return { status: lag >= 4 ? "red-needed" : "yellow", earliest: earliest, lag: lag };
    }

    function onTrackState(ctx) {
      return commonState(ctx, "on-track");
    }

    function yellowState(ctx, assessment) {
      var state = commonState(ctx, "yellow");
      state.activeDay = assessment.earliest;
      state.activeStudyDay = assessment.earliest;
      state.lag = assessment.lag;
      state.daysBehind = assessment.lag;
      state.deficitLag = assessment.lag;
      state.threshold = 50;
      state.oldestDeficientDay = assessment.earliest;
      return state;
    }

    function recoveryRecord(ctx) {
      return {
        schemaVersion: schemaVersion,
        policyVersion: policyVersion,
        startDate: ctx.startDate,
        entryDate: ctx.today,
        entryElapsedDay: ctx.elapsedDay
      };
    }

    function validateRecovery(record, ctx) {
      if (!record || typeof record !== "object" || Array.isArray(record)) return { ok: false, reason: "Recovery data is malformed." };
      if (record.schemaVersion !== schemaVersion) {
        return { ok: false, reason: record.schemaVersion > schemaVersion
          ? "Recovery data was written by a newer app version."
          : "Recovery data needs migration before locks can be applied." };
      }
      if (record.policyVersion !== policyVersion) return { ok: false, reason: "Recovery policy data needs migration before locks can be applied." };
      if (civilDateString(record.startDate) !== record.startDate ||
          civilDateString(record.entryDate) !== record.entryDate ||
          !Number.isInteger(record.entryElapsedDay) || record.entryElapsedDay < 2) {
        return { ok: false, reason: "Recovery data is malformed." };
      }
      if (record.startDate !== ctx.startDate) return { ok: true, stale: true };
      var derivedEntry = civilOrdinal(record.entryDate) - civilOrdinal(record.startDate) + 1;
      if (derivedEntry !== record.entryElapsedDay) return { ok: false, reason: "Recovery calendar data is inconsistent." };
      return { ok: true, stale: false };
    }

    function recoveryDetails(record) {
      var cohortEnd = Math.max(0, Math.min(MAX_DAY, record.entryElapsedDay - 1));
      return {
        schemaVersion: record.schemaVersion,
        policyVersion: record.policyVersion,
        startDate: record.startDate,
        entryDate: record.entryDate,
        entryElapsedDay: record.entryElapsedDay,
        cohortStart: cohortEnd ? 1 : 0,
        cohortEnd: cohortEnd,
        lockFromDay: clamp(Math.min(MAX_DAY, record.entryElapsedDay) - 2, 1, MAX_DAY)
      };
    }

    function redAssessment(ctx, record) {
      var details = recoveryDetails(record);
      var active = null;
      var oldestDeficient = null;
      for (var day = details.cohortStart; day <= details.cohortEnd; day += 1) {
        var progress = dayProgress(day);
        if (progress.indeterminate) return { indeterminate: true, warning: progress.warning };
        if (active == null && progress.score < 75) active = day;
        if (oldestDeficient == null && progress.score < 50) oldestDeficient = day;
      }
      if (active == null) return { complete: true, recovery: details };
      return {
        complete: false,
        recovery: details,
        active: active,
        oldestDeficient: oldestDeficient
      };
    }

    function redState(ctx, assessment) {
      var state = commonState(ctx, "red");
      state.recovery = assessment.recovery;
      state.activeDay = assessment.active;
      state.activeStudyDay = assessment.active;
      state.lag = Math.max(0, ctx.elapsedDay - assessment.active);
      state.daysBehind = state.lag;
      state.deficitLag = assessment.oldestDeficient == null ? 0 : Math.max(0, ctx.elapsedDay - assessment.oldestDeficient);
      state.threshold = 75;
      state.oldestDeficientDay = assessment.oldestDeficient;
      state.clockRollback = ctx.elapsedDay < assessment.recovery.entryElapsedDay;
      return state;
    }

    function persistAndBuildRed(ctx, record) {
      var write = storeWrite(recoveryKey, record);
      if (!write.ok) return indeterminateState(ctx, write.error + " Recovery locks are disabled.");
      var assessment = redAssessment(ctx, record);
      if (assessment.indeterminate) return indeterminateState(ctx, assessment.warning);
      return redState(ctx, assessment);
    }

    function stateFromBase(ctx, assessment, replacingRecovery) {
      if (assessment.indeterminate) return indeterminateState(ctx, assessment.warning);
      if (assessment.status === "red-needed") return persistAndBuildRed(ctx, recoveryRecord(ctx));
      if (replacingRecovery) {
        var cleared = storeWrite(recoveryKey, null);
        if (!cleared.ok) return indeterminateState(ctx, cleared.error + " Recovery locks are disabled.");
      }
      return assessment.status === "yellow" ? yellowState(ctx, assessment) : onTrackState(ctx);
    }

    /* Reconciliation performs a single durable transition. When one red cohort
       completes and another is already overdue, the old record is overwritten
       directly rather than briefly clearing the recovery state. */
    function reconcileBase(reason) {
      var ctx = context();
      if (!ctx.ok) return indeterminateState(ctx, ctx.error);
      if (!ctx.enrolled) return unenrolledState(ctx);
      var globalWarning = completionIndeterminate();
      if (globalWarning) return indeterminateState(ctx, globalWarning);

      var stored = storeRead(recoveryKey);
      if (!stored.ok) return indeterminateState(ctx, stored.error);
      var record = stored.missing ? null : stored.value;
      if (record == null) {
        var fresh = stateFromBase(ctx, baseAssessment(ctx), false);
        fresh.reconcileReason = reason || null;
        return fresh;
      }

      var validity = validateRecovery(record, ctx);
      if (!validity.ok) return indeterminateState(ctx, validity.reason);
      if (validity.stale) {
        var staleBase = stateFromBase(ctx, baseAssessment(ctx), true);
        staleBase.reconcileReason = reason || null;
        return staleBase;
      }

      var active = redAssessment(ctx, record);
      if (active.indeterminate) return indeterminateState(ctx, active.warning);
      if (!active.complete) {
        var red = redState(ctx, active);
        red.reconcileReason = reason || null;
        return red;
      }

      var next = stateFromBase(ctx, baseAssessment(ctx), true);
      next.reconcileReason = reason || null;
      return next;
    }

    function applyOverride(state) {
      state.overrideActive = false;
      if (!isOverrideActive()) return state;
      var overridden = Object.assign({}, state, {
        status: "override",
        kind: "override",
        color: null,
        overrideActive: true,
        locksEnabled: false,
        isBehind: false,
        activeDay: state.scheduledDay,
        activeStudyDay: state.scheduledDay,
        lag: 0,
        daysBehind: 0,
        deficitLag: 0,
        threshold: null,
        oldestDeficientDay: null,
        underlyingStatus: state.status,
        underlyingActiveDay: state.activeStudyDay || state.activeDay || state.scheduledDay,
        underlyingThreshold: state.threshold,
        underlyingLag: state.lag || state.daysBehind || 0
      });
      return overridden;
    }

    function reconcile(reason) {
      return applyOverride(reconcileBase(reason));
    }

    function sourceSchedule(type, id) {
      type = canonicalType(type);
      id = String(id == null ? "" : id);
      if (!type || !id) return [];
      var days = [];
      function add(valuesToAdd) {
        if (valuesToAdd == null) return;
        (Array.isArray(valuesToAdd) ? valuesToAdd : [valuesToAdd]).forEach(function (value) {
          var day = validDay(value);
          if (day && days.indexOf(day) < 0) days.push(day);
        });
      }
      if (typeof data.sourceSchedule === "function") {
        try { add(data.sourceSchedule(type, id)); } catch (error) { /* continue with canonical data */ }
      }
      if (type === "lesson") {
        allLessons().forEach(function (lesson) { if (String(lesson.id) === id) add(lesson.day); });
      }
      allEcosystems().forEach(function (ecosystem) {
        var source = requiredSource(ecosystem.day, type);
        if (source && source.id === id) add(ecosystem.day);
      });
      if (type === "crisis") {
        allCrises().forEach(function (crisis) { if (String(crisis.id) === id) add(crisis.day); });
      }
      var sources = values(resolveData("sources", "sourceRecords"));
      sources.forEach(function (source) {
        var sourceType = canonicalType(source && (source.type || source.sourceType));
        var sourceId = source && (source.id != null ? source.id : source.sourceId);
        if (sourceType === type && String(sourceId) === id) add((source.linkedDays || []).concat(source.day || []));
      });
      if (typeof data.getSource === "function") {
        try {
          var source = data.getSource(type, id);
          if (source) {
            add(source.linkedDays);
            add(source.day);
          }
        } catch (error) { /* schedules already collected remain usable */ }
      }
      return days.sort(function (a, b) { return a - b; });
    }

    function sourceIsAlwaysAvailable(type, id) {
      type = canonicalType(type);
      id = String(id == null ? "" : id);
      if (!type || !id) return false;
      var sources = values(resolveData("sources", "sourceRecords"));
      for (var i = 0; i < sources.length; i++) {
        var candidate = sources[i];
        var candidateType = canonicalType(candidate && (candidate.type || candidate.sourceType));
        var candidateId = candidate && (candidate.id != null ? candidate.id : candidate.sourceId);
        if (candidateType === type && String(candidateId) === id && candidate.alwaysAvailable === true) return true;
      }
      if (typeof data.getSource === "function") {
        try {
          var source = data.getSource(type, id);
          return !!(source && source.alwaysAvailable === true);
        } catch (error) { return false; }
      }
      return false;
    }

    function isRequiredSource(day, type, id) {
      var source = requiredSource(day, type);
      return !!(source && source.id === String(id) && source.type === canonicalType(type));
    }

    function canAccessCoreDayWithState(day, state) {
      day = validDay(day);
      if (!day) return false;
      if (state.overrideActive) return true;
      /* Unenrolled preview and indeterminate storage deliberately fail open.
         Once enrolled, future day-scoped core content follows the course clock
         even when no catch-up lock is active. */
      if (state.status === "unenrolled" || state.status === "indeterminate") return true;
      return day <= (state.locksEnabled ? state.activeDay : state.scheduledDay);
    }

    function canAccessCoreDay(day) {
      return canAccessCoreDayWithState(day, reconcile("core-access"));
    }

    function canAccessSourceWithState(type, id, purpose, state) {
      type = canonicalType(type);
      id = String(id == null ? "" : id);
      if (!type || !id) return state.status === "unenrolled" || state.status === "indeterminate";
      if (state.overrideActive) return true;
      if (state.status === "unenrolled" || state.status === "indeterminate") return true;
      if (sourceIsAlwaysAvailable(type, id)) return true;
      var schedule = sourceSchedule(type, id);
      if (type === "lesson") {
        return schedule.length > 0 && canAccessCoreDayWithState(schedule[0], state);
      }
      if (state.status !== "red") return true;
      if (isRequiredSource(state.activeDay, type, id)) return true;
      if (!schedule.length) return false;
      return schedule[0] < state.recovery.lockFromDay;
    }

    function canAccessSource(type, id, purpose) {
      return canAccessSourceWithState(type, id, purpose, reconcile("source-access"));
    }

    function cardSource(card) {
      if (!card || typeof card !== "object") return null;
      if (card.source && typeof card.source === "object" && card.source.type && card.source.id != null) {
        return { type: canonicalType(card.source.type), id: String(card.source.id) };
      }
      if (card.origin && card.origin.type && card.origin.id != null) {
        return { type: canonicalType(card.origin.type), id: String(card.origin.id) };
      }
      if (card.lesson != null) return { type: "lesson", id: String(card.lesson) };
      if (card.region != null) return { type: "anatomy", id: String(card.region) };
      if (card.section != null || card.surgery != null) return { type: "surgery", id: String(card.section || card.surgery) };
      if (card.trial != null || card.evidence != null) return { type: "evidence", id: String(card.trial || card.evidence) };
      if (card.crisis != null) return { type: "crisis", id: String(card.crisis) };
      if (card.viva != null) return { type: "viva", id: String(card.viva) };
      if (card.sourceType && card.sourceId != null) return { type: canonicalType(card.sourceType), id: String(card.sourceId) };
      return null;
    }

    function modeOptions(mode) {
      if (mode && typeof mode === "object") return mode;
      return { purpose: String(mode || "full-deck") };
    }

    function reviewException(card, mode) {
      var state = null;
      if (mode.states && card && card.id != null) state = mode.states[card.id];
      if (!state && typeof options.getCardState === "function") {
        try { state = options.getCardState(card && card.id, card); } catch (error) { state = null; }
      }
      if (!state) return false;
      if (state.st === "rel") return true;
      var current = nowDate();
      var now = mode.now instanceof Date ? mode.now.getTime() :
        Number.isFinite(mode.now) ? mode.now :
          (current ? current.getTime() : Date.now());
      return Number.isFinite(state.due) && state.due <= now;
    }

    function filterCards(cards, mode) {
      cards = Array.isArray(cards) ? cards : [];
      mode = modeOptions(mode);
      var state = reconcile("filter-cards");
      if (state.overrideActive) return cards.slice();
      var reviewMode = ["review", "global-review", "due", "relearning"].indexOf(mode.purpose) >= 0;
      return cards.filter(function (card) {
        var source = cardSource(card);
        var allowed = source
          ? canAccessSourceWithState(source.type, source.id, mode.purpose, state)
          : false;
        return allowed || reviewMode && reviewException(card, mode);
      });
    }

    function questionStats(mode) {
      if (mode.stats && typeof mode.stats === "object") return mode.stats;
      if (typeof options.getQuestionStats === "function") {
        try { return options.getQuestionStats() || {}; } catch (error) { return {}; }
      }
      return {};
    }

    function wasMissed(question, stats) {
      var entry = question && stats[question.id];
      if (!entry) return false;
      if (Number(entry.wrong) > 0 || entry.missed === true) return true;
      return Number(entry.seen) > Number(entry.ok);
    }

    function filterQuestions(questions, mode) {
      questions = Array.isArray(questions) ? questions : [];
      mode = modeOptions(mode);
      var state = reconcile("filter-questions");
      if (state.overrideActive) return questions.slice();
      var weak = mode.purpose === "weak" || mode.purpose === "weakness";
      var stats = weak ? questionStats(mode) : {};
      return questions.filter(function (question) {
        if (weak && wasMissed(question, stats)) return true;
        var day = validDay(question && question.day);
        return !!day && canAccessCoreDayWithState(day, state);
      });
    }

    function describeRoute(hash) {
      hash = String(hash == null ? "" : hash) || "#/";
      var clean = hash.split("?")[0].split("&")[0];
      var path = clean.indexOf("#/") === 0 ? clean.slice(2) : clean.replace(/^#/, "").replace(/^\//, "");
      var parts = path.split("/").filter(Boolean).map(safeDecode);
      var head = parts[0] || "";
      var description = { hash: hash, kind: "hub", purpose: "menu", day: null, type: null, id: null };
      if (!head || ["plan", "extras", "progress", "awards", "exercises"].indexOf(head) >= 0) return description;
      if (head === "day" || head === "case") {
        description.kind = "core"; description.purpose = "day"; description.day = validDay(parts[1]);
        return description;
      }
      if (head === "lesson") {
        description.kind = "core"; description.purpose = "lesson"; description.type = "lesson"; description.id = parts[1] || "";
        description.day = sourceSchedule("lesson", description.id)[0] || null;
        return description;
      }
      if (head === "cards") {
        if (parts[1] === "day") {
          description.kind = "core"; description.purpose = "day-cards"; description.day = validDay(parts[2]);
        } else if (parts[1] === "source" && parts[2] && parts[3]) {
          description.kind = "source"; description.purpose = "source-cards"; description.type = canonicalType(parts[2]); description.id = parts[3];
        } else {
          description.kind = "filtered"; description.purpose = "cards";
        }
        return description;
      }
      if (head === "quiz") {
        if (parts[1] === "day") {
          description.kind = "core"; description.purpose = "day-quiz"; description.day = validDay(parts[2]);
        } else {
          description.kind = "filtered"; description.purpose = parts[1] === "weak" ? "weak" : "questions";
        }
        return description;
      }
      if (head === "exam") {
        description.kind = "core"; description.purpose = "exam"; description.day = 14;
        return description;
      }
      if (head === "anat-cards") {
        description.kind = "filtered"; description.purpose = "anatomy-cards";
        return description;
      }
      if (head === "angiography") {
        description.kind = "source"; description.purpose = "module"; description.type = "angiography"; description.id = "coronary-angiography";
        return description;
      }
      if (head === "exercise" && parts[1]) {
        description.kind = "source"; description.purpose = "module"; description.type = "exercise"; description.id = parts[1];
        return description;
      }
      if (head === "surgery") {
        var aggregate = !parts[1] || ["quiz", "cards", "order"].indexOf(parts[1]) >= 0 && !(
          parts[1] === "order" && parts[2] ||
          (parts[1] === "quiz" || parts[1] === "cards") && parts[2] === "s" && parts[3]
        );
        if (aggregate) {
          description.kind = parts[1] ? "filtered" : "hub"; description.purpose = "surgery-" + (parts[1] || "menu");
        } else {
          description.kind = "source"; description.purpose = "surgery-session"; description.type = "surgery";
          description.id = parts[1] === "order" ? parts[2] :
            (parts[1] === "quiz" || parts[1] === "cards") ? parts[3] : parts[1];
        }
        return description;
      }
      var sourceHeads = { anatomy: "anatomy", trials: "evidence", crisis: "crisis", viva: "viva", physiology: "physiology" };
      if (own(sourceHeads, head)) {
        if (!parts[1]) return description;
        description.kind = "source"; description.purpose = "module"; description.type = sourceHeads[head]; description.id = parts[1];
        return description;
      }
      description.kind = "unknown";
      return description;
    }

    function lockReason(description, state, purpose) {
      if (typeof description === "string" && typeof state === "string") {
        description = { kind: "source", type: canonicalType(description), id: state, purpose: purpose || "module" };
        state = null;
      }
      state = state || reconcile("lock-reason");
      if (state.overrideActive) return null;
      if (!description || state.status === "unenrolled" || state.status === "indeterminate") return null;
      if (!state.locksEnabled) {
        return description.day
          ? "Day " + description.day + " opens when your course reaches that scheduled day."
          : "This lesson belongs to a later scheduled course day.";
      }
      if (state.status === "yellow") {
        return "Complete at least 50% of Day " + state.activeDay + " before opening later core content.";
      }
      return "Recovery is active. Bring Day " + state.activeDay + " to 75% to unlock the next stage.";
    }

    function authorizeRoute(hash) {
      var state = reconcile("route");
      var description = describeRoute(hash);
      var allowed = true;
      if (description.kind === "core") allowed = !!description.day && canAccessCoreDayWithState(description.day, state);
      else if (description.kind === "source") {
        allowed = canAccessSourceWithState(description.type, description.id, description.purpose, state);
      }
      return {
        allowed: allowed,
        description: description,
        state: state,
        reason: allowed ? null : lockReason(description, state)
      };
    }

    return {
      getState: function () { return reconcile("read"); },
      reconcile: reconcile,
      dayProgress: dayProgress,
      describeRoute: describeRoute,
      authorizeRoute: authorizeRoute,
      canAccessCoreDay: canAccessCoreDay,
      sourceSchedule: sourceSchedule,
      isRequiredSource: isRequiredSource,
      canAccessSource: canAccessSource,
      filterCards: filterCards,
      filterQuestions: filterQuestions,
      lockReason: lockReason,
      civilOrdinal: civilOrdinal,
      civilDateString: civilDateString,
      constants: {
        maxDay: MAX_DAY,
        coreTypes: CORE_TYPES.slice(),
        schemaVersion: schemaVersion,
        policyVersion: policyVersion,
        recoveryKey: recoveryKey
      }
    };
  }

  createPacingEngine.civilOrdinal = civilOrdinal;
  createPacingEngine.civilDateString = civilDateString;
  createPacingEngine.constants = {
    maxDay: MAX_DAY,
    coreTypes: CORE_TYPES.slice(),
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    policyVersion: DEFAULT_POLICY_VERSION,
    recoveryKey: RECOVERY_KEY
  };

  return createPacingEngine;
});
