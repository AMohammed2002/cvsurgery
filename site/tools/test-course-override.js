/* Course-override regression tests — run with: node tools/test-course-override.js */
"use strict";

process.env.TZ = "America/Edmonton";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
/* The clear-text password is not in the source any more; set CS_OVERRIDE_PASSWORD after rotating it. */
const OVERRIDE_PASSWORD = process.env.CS_OVERRIDE_PASSWORD || "cardiac";
const sectionStart = appSource.indexOf("/* ---------- password-protected course override ---------- */");
const sectionEndMarker = "/* ---------- end password-protected course override ---------- */";
const sectionEnd = appSource.indexOf(sectionEndMarker, sectionStart);
assert.ok(sectionStart >= 0 && sectionEnd > sectionStart, "app.js exposes the course-override section");

const context = vm.createContext({ window: {}, Date, Number, String, Object, Array });
vm.runInContext(`
  const DAY_MS = 86400000;
  const todayStr = value => {
    const d = value ? new Date(value) : new Date();
    return String(d.getFullYear()).padStart(4, "0") + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  };
  function localDateFromStr(value) {
    const p = String(value).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function validDateStr(value) {
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(String(value || ""))) return false;
    const date = localDateFromStr(value);
    return Number.isFinite(date.getTime()) && todayStr(date) === value;
  }
  function civilDayOrdinal(value) {
    const d = value instanceof Date ? value : localDateFromStr(value);
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
  }
`, context);
vm.runInContext(appSource.slice(sectionStart, sectionEnd + sectionEndMarker.length), context, { filename: "app-course-override.js" });
const override = context.window.CourseOverride;
assert.ok(override, "course-override API is available to the browser and test harness");

class MemoryStore {
  constructor(seed, failKey) {
    this.state = Object.assign({}, seed || {});
    this.writes = [];
    this.failKey = failKey || null;
    this.notifications = [];
  }
  inspect(key) {
    if (!Object.prototype.hasOwnProperty.call(this.state, key)) return { status: "missing", value: null, raw: null };
    const raw = this.state[key];
    if (raw && raw.__malformed) return { status: "malformed", value: null, raw: raw.value };
    return { status: "ok", value: raw, raw: JSON.stringify(raw) };
  }
  set(key, value) {
    if (key === this.failKey) return false;
    this.state[key] = JSON.parse(JSON.stringify(value));
    this.writes.push({ key, value: this.state[key] });
    return true;
  }
  remove(key) {
    if (key === this.failKey) return false;
    delete this.state[key];
    this.writes.push({ key, value: null });
    return true;
  }
  notify(key) { this.notifications.push(key); }
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

/* Password activation persists only metadata and never stores the password. */
{
  const store = new MemoryStore();
  assert.strictEqual(override.setActive(true, "wrong", store, 100).reason, "password");
  assert.strictEqual(store.writes.length, 0);
  const enabled = override.setActive(true, OVERRIDE_PASSWORD, store, 101);
  assert.strictEqual(enabled.ok, true);
  assert.deepStrictEqual(plain(store.state.adminOverride), { version: 1, active: true, activatedAt: 101 });
  assert.ok(!JSON.stringify(store.state).includes(OVERRIDE_PASSWORD), "password is never persisted");
  assert.strictEqual(override.getState(store).active, true);
  assert.strictEqual(override.setActive(false, null, store).ok, true);
  assert.strictEqual(override.getState(store).active, false);

  const failing = new MemoryStore({}, "adminOverride");
  assert.strictEqual(override.setActive(true, OVERRIDE_PASSWORD, failing, 102).reason, "write");
  assert.strictEqual(override.getState(failing).active, false);
}

/* Malformed and future schemas fail closed but can be replaced after fresh authentication. */
{
  const malformed = new MemoryStore({ adminOverride: { __malformed: true, value: "{broken" } });
  assert.strictEqual(override.getState(malformed).active, false);
  assert.strictEqual(override.getState(malformed).status, "malformed");
  assert.strictEqual(override.setActive(true, "wrong", malformed, 1).ok, false);
  assert.strictEqual(malformed.state.adminOverride.value, "{broken");
  assert.strictEqual(override.setActive(true, OVERRIDE_PASSWORD, malformed, 2).ok, true);
  assert.strictEqual(override.getState(malformed).active, true);

  const future = new MemoryStore({ adminOverride: { version: 99, active: true, activatedAt: 1 } });
  assert.strictEqual(override.getState(future).active, false);
  assert.strictEqual(override.getState(future).status, "future");
}

/* Civil-date rebasing is exact across DST and preserves every progress store. */
{
  const progress = {
    done: { lesson: true },
    srs: { card: { st: "rev", iv: 30 } },
    xp: 900,
    examDraft: { remainingMs: 1000 },
    pacingCredit: { version: 1, entries: { "lesson:l1": 1 } }
  };
  const store = new MemoryStore(Object.assign({
    adminOverride: { version: 1, active: true, activatedAt: 1 },
    enrollment: { version: 1, startedOn: "2026-01-01", startedAt: 1 },
    startDate: "2026-01-01",
    recovery: { schemaVersion: 1, policyVersion: 1 }
  }, progress));
  const beforeProgress = plain(progress);
  const spring = override.rebase(5, store, new Date(2026, 2, 8, 12), 500);
  assert.strictEqual(spring.ok, true);
  assert.strictEqual(spring.startedOn, "2026-03-04");
  assert.strictEqual(store.state.enrollment.startedOn, "2026-03-04");
  assert.strictEqual(store.state.enrollment.selectedDay, 5);
  assert.strictEqual(store.state.startDate, "2026-03-04");
  assert.strictEqual(override.startForDay(6, new Date(2026, 2, 9, 12)), "2026-03-04", "the next civil day advances Day 5 to Day 6 across spring DST");
  assert.ok(!Object.prototype.hasOwnProperty.call(store.state, "recovery"), "obsolete recovery policy state is cleared");
  Object.keys(beforeProgress).forEach(key => assert.deepStrictEqual(plain(store.state[key]), beforeProgress[key], key + " is preserved"));
  assert.deepStrictEqual(store.notifications, ["enrollment"]);

  assert.strictEqual(override.startForDay(1, new Date(2026, 10, 1, 12)), "2026-11-01");
  assert.strictEqual(override.startForDay(14, new Date(2026, 10, 1, 12)), "2026-10-19", "Day 14 crosses fall DST by civil dates");
  assert.strictEqual(override.startForDay(5, new Date(2028, 2, 1, 12)), "2028-02-26", "leap day participates in civil-date rebasing");
}

/* Authorization, validation, and enrollment-write failures leave the existing day untouched. */
{
  const locked = new MemoryStore({ enrollment: { version: 1, startedOn: "2026-01-01" } });
  assert.strictEqual(override.rebase(5, locked, new Date(2026, 0, 5), 1).reason, "authorization");
  assert.strictEqual(locked.state.enrollment.startedOn, "2026-01-01");

  const failing = new MemoryStore({
    adminOverride: { version: 1, active: true, activatedAt: 1 },
    enrollment: { version: 1, startedOn: "2026-01-01" },
    startDate: "2026-01-01"
  }, "enrollment");
  assert.strictEqual(override.rebase(5, failing, new Date(2026, 0, 5), 2).reason, "write");
  assert.strictEqual(failing.state.enrollment.startedOn, "2026-01-01");
  assert.strictEqual(failing.state.startDate, "2026-01-01");

  const malformedEnrollment = new MemoryStore({
    adminOverride: { version: 1, active: true, activatedAt: 1 },
    enrollment: { __malformed: true, value: "{broken" }
  });
  assert.strictEqual(override.rebase(5, malformedEnrollment, new Date(2026, 0, 5), 2).reason, "enrollment");
  assert.strictEqual(malformedEnrollment.state.enrollment.value, "{broken");
}

console.log("course override tests passed");
