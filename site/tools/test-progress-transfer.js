/* Progress-transfer regression tests — run with: node tools/test-progress-transfer.js */
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const appPath = path.join(root, "js/app.js");
const appSource = fs.readFileSync(appPath, "utf8");
const sectionStart = appSource.indexOf("/* ---------- progress-safe backup + scheduler transfer ---------- */");
const sectionEndMarker = "/* ---------- end progress-safe backup + scheduler transfer ---------- */";
const sectionEnd = appSource.indexOf(sectionEndMarker, sectionStart);
assert.ok(sectionStart >= 0 && sectionEnd > sectionStart, "app.js exposes the progress-transfer section");

const context = vm.createContext({ window: {} });
vm.runInContext(appSource.slice(sectionStart, sectionEnd + sectionEndMarker.length), context, { filename: "app-progress-transfer.js" });
const transfer = context.window.ProgressTransfer;
assert.ok(transfer, "progress-transfer API is available to the browser and test harness");

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

class MemoryStorage {
  constructor(seed) {
    this.values = new Map(Object.entries(seed || {}).map(([key, value]) => [String(key), String(value)]));
    this.writes = [];
  }
  get length() { return this.values.size; }
  key(index) { return Array.from(this.values.keys())[index] == null ? null : Array.from(this.values.keys())[index]; }
  getItem(key) { return this.values.has(String(key)) ? this.values.get(String(key)) : null; }
  setItem(key, value) {
    this.writes.push({ key: String(key), value: String(value) });
    this.values.set(String(key), String(value));
  }
  removeItem(key) { this.values.delete(String(key)); }
}

function inspectableStore(seed, failWrites) {
  const storage = new MemoryStorage(seed);
  return {
    storage,
    writes: storage.writes,
    inspect(key) {
      const raw = storage.getItem("cs_" + key);
      if (raw === null) return { status: "missing", value: null, raw: null };
      try { return { status: "ok", value: JSON.parse(raw), raw }; }
      catch (error) { return { status: "malformed", value: null, raw, error }; }
    },
    set(key, value) {
      if (failWrites) return false;
      storage.setItem("cs_" + key, JSON.stringify(value));
      return true;
    }
  };
}

/* Export includes every cs_* raw string, including malformed values, and no unrelated keys. */
{
  const storage = new MemoryStorage({
    cs_srs: '{"card-a":{"iv":4}}',
    cs_malformed: "{not-json",
    cs_adminOverride: '{"version":1,"active":true,"activatedAt":1}',
    unrelated: "leave-me-out"
  });
  const now = Date.UTC(2026, 6, 31, 18, 30, 0);
  const backup = transfer.buildBackup(storage, "https://course.example", ["card-b", "card-a", "card-a"], now);
  assert.strictEqual(backup.schema, "cardiac-school-progress-backup");
  assert.strictEqual(backup.version, 1);
  assert.strictEqual(backup.timestamp, "2026-07-31T18:30:00.000Z");
  assert.strictEqual(backup.origin, "https://course.example");
  assert.deepStrictEqual(plain(backup.catalogIds), ["card-a", "card-b"]);
  assert.deepStrictEqual(Object.keys(backup.localStorage).sort(), ["cs_malformed", "cs_srs"]);
  assert.ok(!Object.prototype.hasOwnProperty.call(backup.localStorage, "cs_adminOverride"), "administrator override is never exported as progress");
  assert.strictEqual(backup.localStorage.cs_malformed, "{not-json", "malformed raw storage is preserved exactly");
  assert.strictEqual(transfer.parseBackup(JSON.stringify(backup)).localStorage.cs_srs, storage.getItem("cs_srs"));
  assert.throws(
    () => transfer.parseBackup(JSON.stringify(Object.assign({}, plain(backup), { localStorage: { unsafe: "x" } }))),
    /invalid storage entry/
  );

  const crafted = plain(backup);
  crafted.localStorage.cs_adminOverride = '{"version":1,"active":true,"activatedAt":1}';
  const target = new MemoryStorage();
  const craftedPreview = transfer.previewRestore(crafted, target);
  assert.ok(!craftedPreview.actions.some(action => action.key === "cs_adminOverride"), "restore ignores a crafted override record");
  transfer.applyRestore(crafted, target, { confirmed: true });
  assert.strictEqual(target.getItem("cs_adminOverride"), null, "restoring progress cannot activate administrator access");
}

/* Restore is confirmation-gated, defaults to add-only, and never fans out or overwrites SRS state. */
{
  const backupStorage = new MemoryStorage({
    cs_srs: JSON.stringify({
      shared: { st: "rev", iv: 21, due: 100, reps: 8, lapses: 1 },
      backupOnly: { st: "lrn", iv: 0, due: 200, reps: 0, lapses: 0 }
    }),
    cs_xp: "120",
    cs_done: '{"lesson-1":true}'
  });
  const backup = transfer.buildBackup(backupStorage, "https://course.example", ["shared", "backupOnly"], 1);
  const current = new MemoryStorage({
    cs_srs: JSON.stringify({
      shared: { st: "rev", iv: 90, due: 999, reps: 30, lapses: 4 },
      currentOnly: { st: "rel", iv: 2, due: 300, reps: 12, lapses: 3 }
    }),
    cs_xp: "900"
  });
  const preview = transfer.previewRestore(backup, current);
  assert.deepStrictEqual(plain(preview.addKeys), ["cs_done"]);
  assert.deepStrictEqual(plain(preview.conflictKeys), ["cs_xp"]);
  assert.strictEqual(preview.srsAdditions, 1);
  assert.throws(() => transfer.applyRestore(backup, current), /explicit confirmation/);

  const result = transfer.applyRestore(backup, current, { confirmed: true });
  assert.strictEqual(result.addedKeys, 1);
  assert.strictEqual(result.replacedKeys, 0, "conflicts are not overwritten by default");
  assert.strictEqual(result.srsAdded, 1);
  assert.strictEqual(current.getItem("cs_xp"), "900");
  assert.strictEqual(current.getItem("cs_done"), '{"lesson-1":true}');
  const restoredSrs = JSON.parse(current.getItem("cs_srs"));
  assert.deepStrictEqual(restoredSrs.shared, { st: "rev", iv: 90, due: 999, reps: 30, lapses: 4 }, "current schedule wins byte-for-byte at the value level");
  assert.deepStrictEqual(restoredSrs.currentOnly, { st: "rel", iv: 2, due: 300, reps: 12, lapses: 3 }, "current-only historical schedule remains present");
  assert.deepStrictEqual(restoredSrs.backupOnly, { st: "lrn", iv: 0, due: 200, reps: 0, lapses: 0 }, "only the missing schedule is added");

  const writesAfterFirstRestore = current.writes.length;
  const second = transfer.applyRestore(backup, current, { confirmed: true });
  assert.strictEqual(second.srsAdded, 0);
  assert.strictEqual(current.writes.length, writesAfterFirstRestore, "an add-only restore is idempotent");
  const replaced = transfer.applyRestore(backup, current, { confirmed: true, replaceConflicts: true });
  assert.strictEqual(replaced.replacedKeys, 1, "non-SRS replacement requires an explicit option");
  assert.strictEqual(current.getItem("cs_xp"), "120");
  assert.deepStrictEqual(JSON.parse(current.getItem("cs_srs")).shared, restoredSrs.shared, "explicit non-SRS replacement still cannot replace a schedule");
}

/* Malformed current scheduler data is protected even during an explicitly confirmed restore. */
{
  const backupStorage = new MemoryStorage({ cs_srs: '{"safe":{"st":"rev","iv":12}}' });
  const backup = transfer.buildBackup(backupStorage, "https://course.example", ["safe"], 1);
  const current = new MemoryStorage({ cs_srs: "{malformed-current" });
  const preview = transfer.previewRestore(backup, current);
  assert.ok(preview.blockedSrs);
  transfer.applyRestore(backup, current, { confirmed: true, replaceConflicts: true });
  assert.strictEqual(current.getItem("cs_srs"), "{malformed-current");
  assert.strictEqual(current.writes.length, 0);
}

/* Boot migration adds only absent legacy IDs, protects shared IDs, and becomes a no-op after success. */
{
  const store = inspectableStore({
    cs_srs: JSON.stringify({ shared: { iv: 90, due: 999 }, falsy: null }),
    cs_anat_srs: JSON.stringify({ shared: { iv: 1, due: 1 }, falsy: { iv: 2 }, anatomyOnly: { iv: 4, due: 4 } }),
    cs_surgery_srs: JSON.stringify({ surgeryOnly: { iv: 8, due: 8 } })
  });
  const first = transfer.migrateLegacySrs(store);
  assert.deepStrictEqual(plain(first), { status: "migrated", added: 2 });
  const merged = JSON.parse(store.storage.getItem("cs_srs"));
  assert.deepStrictEqual(merged.shared, { iv: 90, due: 999 }, "shared state is never overwritten by legacy state");
  assert.strictEqual(merged.falsy, null, "even a falsy existing value is treated as existing and protected");
  assert.deepStrictEqual(merged.anatomyOnly, { iv: 4, due: 4 });
  assert.deepStrictEqual(merged.surgeryOnly, { iv: 8, due: 8 });
  const writesAfterFirstPass = store.writes.length;
  assert.deepStrictEqual(plain(transfer.migrateLegacySrs(store)), { status: "unchanged", added: 0 });
  assert.strictEqual(store.writes.length, writesAfterFirstPass, "repeat boot does not rewrite cs_srs");
}

/* Malformed/invalid shared SRS and empty legacy stores are never overwritten with an empty object. */
{
  const malformed = inspectableStore({ cs_srs: "{broken", cs_anat_srs: '{"legacy":{"iv":1}}' });
  assert.deepStrictEqual(plain(transfer.migrateLegacySrs(malformed)), { status: "protected", added: 0, reason: "malformed" });
  assert.strictEqual(malformed.storage.getItem("cs_srs"), "{broken");
  assert.strictEqual(malformed.writes.length, 0);

  const invalidShape = inspectableStore({ cs_srs: "[]", cs_surgery_srs: '{"legacy":{"iv":1}}' });
  assert.strictEqual(transfer.migrateLegacySrs(invalidShape).status, "protected");
  assert.strictEqual(invalidShape.writes.length, 0);

  const empty = inspectableStore({});
  assert.deepStrictEqual(plain(transfer.migrateLegacySrs(empty)), { status: "unchanged", added: 0 });
  assert.strictEqual(empty.storage.getItem("cs_srs"), null, "boot does not manufacture an empty scheduler value");
  assert.strictEqual(empty.writes.length, 0);
}

/* Progress metrics intersect SRS IDs with the live catalog and report unmatched history separately. */
{
  const stats = transfer.srsCatalogStats({
    activeMature: { st: "rev", iv: 30 },
    activeLearning: { st: "lrn", iv: 0 },
    activeRelearning: { st: "rel", iv: 2 },
    historicalRemoved: { st: "rev", iv: 100 }
  }, ["activeMature", "activeLearning", "activeRelearning", "unseenCurrent"]);
  assert.deepStrictEqual(plain(stats), { tracked: 3, mature: 1, learning: 2, archived: 1 });
}

/* Exact-duplicate aliases copy once, retain the old raw entry, and never merge competing histories. */
{
  const store = inspectableStore({
    cs_srs: JSON.stringify({
      legacyOnly: { st: "rev", iv: 42, due: 900, reps: 14 },
      protectedOld: { st: "rev", iv: 3, due: 50 },
      protectedNew: { st: "rev", iv: 80, due: 999 },
      duplicateA: { st: "rev", iv: 4 },
      duplicateB: { st: "rev", iv: 9 }
    })
  });
  const aliases = {
    legacyOnly: "canonicalOnly",
    protectedOld: "protectedNew",
    duplicateA: "ambiguousCanonical",
    duplicateB: "ambiguousCanonical"
  };
  assert.deepStrictEqual(plain(transfer.copyExactAliases(aliases, store)), { status: "copied", copied: 1, conflicts: 1 });
  const after = JSON.parse(store.storage.getItem("cs_srs"));
  assert.deepStrictEqual(after.canonicalOnly, after.legacyOnly, "the one unambiguous exact duplicate is copied");
  assert.deepStrictEqual(after.protectedNew, { st: "rev", iv: 80, due: 999 }, "an existing canonical schedule is never overwritten");
  assert.ok(!Object.prototype.hasOwnProperty.call(after, "ambiguousCanonical"), "two old schedules are never combined or arbitrarily selected");
  assert.ok(Object.prototype.hasOwnProperty.call(after, "legacyOnly"), "the old raw schedule remains present");
  const writes = store.writes.length;
  assert.strictEqual(transfer.copyExactAliases(aliases, store).copied, 0);
  assert.strictEqual(store.writes.length, writes, "alias copy is idempotent");

  const malformed = inspectableStore({ cs_srs: "{broken" });
  assert.strictEqual(transfer.copyExactAliases({ old: "new" }, malformed).status, "protected");
  assert.strictEqual(malformed.writes.length, 0);
}

/* Focused integration guards: Progress has both controls/metrics and boot uses the safe path. */
assert.match(appSource, /id="progress-export"/);
assert.match(appSource, /id="progress-restore-file"[^>]+type="file"/);
assert.match(appSource, /Archived schedules/);
assert.match(appSource, /migrateLegacySrsSafely\(\);/);
assert.match(appSource, /copyExactCardAliasesSafely\(window\.CARD_ID_ALIASES \|\| \{\}\);/);
assert.doesNotMatch(appSource, /Store\.set\("srs", sharedSrs\)/);

console.log("progress transfer tests passed");
