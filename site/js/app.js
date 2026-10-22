/* ============ CardiacSchool engine v3 — adaptive practice + resident layer ============ */
"use strict";

/* ---------- storage ---------- */
const Store = {
  get(k, d) { try { const v = (window.StaffPreview?.active() ? StaffPreview.storage : localStorage).getItem("cs_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  inspect(k) {
    let raw = null;
    try {
      raw = (window.StaffPreview?.active() ? StaffPreview.storage : localStorage).getItem("cs_" + k);
    } catch (error) {
      return { status: "unavailable", value: null, raw: null, error: error };
    }
    if (raw === null) return { status: "missing", value: null, raw: null };
    try {
      return { status: "ok", value: JSON.parse(raw), raw: raw };
    } catch (error) {
      /* Keep the exact malformed value for repair/export; never silently erase it. */
      return { status: "malformed", value: null, raw: raw, error: error };
    }
  },
  set(k, v, options) {
    try {
      (window.StaffPreview?.active() ? StaffPreview.storage : localStorage).setItem("cs_" + k, JSON.stringify(v));
      if (!(options && options.silent) && typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
        window.dispatchEvent(new CustomEvent("cs:store-change", { detail: { key: k } }));
      }
      return true;
    } catch (error) {
      return false;
    }
  },
  remove(k, options) {
    try {
      (window.StaffPreview?.active() ? StaffPreview.storage : localStorage).removeItem("cs_" + k);
      if (!(options && options.silent) && typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
        window.dispatchEvent(new CustomEvent("cs:store-change", { detail: { key: k } }));
      }
      return true;
    } catch (error) {
      return false;
    }
  },
  notify(k) {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("cs:store-change", { detail: { key: k } }));
    }
  }
};

/* ---------- progress-safe backup + scheduler transfer ---------- */
const PROGRESS_BACKUP_SCHEMA = "cardiac-school-progress-backup";
const PROGRESS_BACKUP_VERSION = 1;
const NON_TRANSFERABLE_STORAGE_KEYS = new Set(["cs_adminOverride"]);

function isProgressRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function owns(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
function currentCatalogCardIds() {
  const cards = window.CardCatalog && typeof window.CardCatalog.all === "function"
    ? window.CardCatalog.all()
    : (window.FLASHCARDS || []);
  return Array.from(new Set(cards.map(card => String(card && card.id || "")).filter(Boolean))).sort();
}
function csStorageKeys(storage) {
  const keys = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (typeof key === "string" && key.startsWith("cs_") && !NON_TRANSFERABLE_STORAGE_KEYS.has(key)) keys.push(key);
  }
  return Array.from(new Set(keys)).sort();
}
function buildProgressBackup(storage, origin, catalogIds, now) {
  const values = Object.create(null);
  csStorageKeys(storage).forEach(key => {
    const raw = storage.getItem(key);
    if (raw !== null) values[key] = raw;
  });
  return {
    schema: PROGRESS_BACKUP_SCHEMA,
    version: PROGRESS_BACKUP_VERSION,
    timestamp: new Date(now == null ? Date.now() : now).toISOString(),
    origin: String(origin || ""),
    catalogIds: Array.from(new Set((catalogIds || []).map(String).filter(Boolean))).sort(),
    localStorage: values
  };
}
function validateProgressBackup(payload) {
  if (!isProgressRecord(payload)) throw new Error("The selected file is not a progress backup.");
  if (payload.schema !== PROGRESS_BACKUP_SCHEMA || payload.version !== PROGRESS_BACKUP_VERSION) {
    throw new Error("This backup schema is not supported by this course version.");
  }
  if (typeof payload.timestamp !== "string" || !Number.isFinite(Date.parse(payload.timestamp))) {
    throw new Error("The backup timestamp is missing or invalid.");
  }
  if (typeof payload.origin !== "string") throw new Error("The backup origin is missing.");
  if (!Array.isArray(payload.catalogIds) || payload.catalogIds.some(id => typeof id !== "string" || !id)) {
    throw new Error("The backup catalog ID list is invalid.");
  }
  if (!isProgressRecord(payload.localStorage)) throw new Error("The backup has no raw localStorage values.");
  Object.keys(payload.localStorage).forEach(key => {
    if (!key.startsWith("cs_") || typeof payload.localStorage[key] !== "string") {
      throw new Error("The backup contains an invalid storage entry.");
    }
  });
  return payload;
}
function parseProgressBackup(text) {
  let payload;
  try { payload = JSON.parse(text); }
  catch (error) { throw new Error("The selected file is not valid JSON."); }
  return validateProgressBackup(payload);
}
function rawJsonRecord(raw) {
  if (typeof raw !== "string") return null;
  try {
    const value = JSON.parse(raw);
    return isProgressRecord(value) ? value : null;
  } catch (error) {
    return null;
  }
}
function previewProgressRestore(payload, storage) {
  const backup = validateProgressBackup(payload);
  const actions = [];
  Object.keys(backup.localStorage).filter(key => !NON_TRANSFERABLE_STORAGE_KEYS.has(key)).sort().forEach(key => {
    const backupRaw = backup.localStorage[key];
    const currentRaw = storage.getItem(key);
    if (key !== "cs_srs") {
      actions.push({ key: key, action: currentRaw === null ? "add" : currentRaw === backupRaw ? "same" : "conflict" });
      return;
    }
    const backupSrs = rawJsonRecord(backupRaw);
    if (!backupSrs) {
      actions.push({ key: key, action: "blocked-srs", reason: "The backup's scheduler value is malformed." });
      return;
    }
    if (currentRaw === null) {
      actions.push({ key: key, action: "add", srsAdditions: Object.keys(backupSrs).length });
      return;
    }
    if (currentRaw === backupRaw) {
      actions.push({ key: key, action: "same", srsProtected: Object.keys(backupSrs).length });
      return;
    }
    const currentSrs = rawJsonRecord(currentRaw);
    if (!currentSrs) {
      actions.push({ key: key, action: "blocked-srs", reason: "The current scheduler value is malformed and was protected." });
      return;
    }
    const backupIds = Object.keys(backupSrs);
    const additions = backupIds.filter(id => !owns(currentSrs, id));
    actions.push({
      key: key,
      action: additions.length ? "merge-srs" : "protect-srs",
      srsAdditions: additions.length,
      srsProtected: Object.keys(currentSrs).length
    });
  });
  const preview = {
    actions: actions,
    keyCount: actions.length,
    addKeys: actions.filter(item => item.action === "add").map(item => item.key),
    sameKeys: actions.filter(item => item.action === "same").map(item => item.key),
    conflictKeys: actions.filter(item => item.action === "conflict").map(item => item.key),
    srsAdditions: actions.reduce((sum, item) => sum + (item.srsAdditions || 0), 0),
    srsProtected: actions.reduce((sum, item) => sum + (item.srsProtected || 0), 0),
    blockedSrs: actions.find(item => item.action === "blocked-srs") || null
  };
  preview.signature = JSON.stringify(actions);
  return preview;
}
function mergeSchedulerRaw(currentRaw, backupRaw) {
  const current = rawJsonRecord(currentRaw), backup = rawJsonRecord(backupRaw);
  if (!current || !backup) return null;
  const merged = Object.create(null);
  Object.keys(current).forEach(id => { merged[id] = current[id]; });
  Object.keys(backup).forEach(id => { if (!owns(merged, id)) merged[id] = backup[id]; });
  return JSON.stringify(merged);
}
function applyProgressRestore(payload, storage, options) {
  options = options || {};
  if (options.confirmed !== true) throw new Error("Restore requires explicit confirmation.");
  const backup = validateProgressBackup(payload);
  const preview = previewProgressRestore(backup, storage);
  if (options.previewSignature && options.previewSignature !== preview.signature) {
    throw new Error("Stored progress changed after the preview. Re-open the backup to review the current changes.");
  }
  const result = { addedKeys: 0, replacedKeys: 0, srsAdded: 0, unchangedKeys: 0, skippedKeys: 0 };
  preview.actions.forEach(item => {
    const backupRaw = backup.localStorage[item.key];
    if (item.action === "add") {
      storage.setItem(item.key, backupRaw);
      result.addedKeys++;
      result.srsAdded += item.srsAdditions || 0;
    } else if (item.action === "conflict" && options.replaceConflicts === true) {
      storage.setItem(item.key, backupRaw);
      result.replacedKeys++;
    } else if (item.action === "merge-srs") {
      const mergedRaw = mergeSchedulerRaw(storage.getItem(item.key), backupRaw);
      if (mergedRaw !== null) {
        storage.setItem(item.key, mergedRaw);
        result.srsAdded += item.srsAdditions || 0;
      } else result.skippedKeys++;
    } else if (item.action === "same" || item.action === "protect-srs") result.unchangedKeys++;
    else result.skippedKeys++;
  });
  return result;
}
function srsCatalogStats(srs, catalogIds) {
  const states = isProgressRecord(srs) ? srs : {};
  const currentIds = new Set((catalogIds || []).map(String));
  const active = Object.keys(states).filter(id => currentIds.has(id));
  return {
    tracked: active.length,
    mature: active.filter(id => states[id] && states[id].iv >= 21).length,
    learning: active.filter(id => {
      const state = states[id];
      return state && (state.st === "lrn" || state.st === "rel" || (!state.st && state.iv === 0));
    }).length,
    archived: Object.keys(states).filter(id => !currentIds.has(id)).length
  };
}
function migrateLegacySrsSafely(store) {
  store = store || Store;
  const sharedInspection = store.inspect("srs");
  if (sharedInspection.status === "malformed" || sharedInspection.status === "unavailable") {
    return { status: "protected", added: 0, reason: sharedInspection.status };
  }
  if (sharedInspection.status === "ok" && !isProgressRecord(sharedInspection.value)) {
    return { status: "protected", added: 0, reason: "invalid-shape" };
  }
  const merged = Object.create(null);
  if (sharedInspection.status === "ok") {
    Object.keys(sharedInspection.value).forEach(id => { merged[id] = sharedInspection.value[id]; });
  }
  let added = 0;
  ["anat_srs", "surgery_srs"].forEach(key => {
    const legacy = store.inspect(key);
    if (legacy.status !== "ok" || !isProgressRecord(legacy.value)) return;
    Object.keys(legacy.value).forEach(id => {
      if (!owns(merged, id)) { merged[id] = legacy.value[id]; added++; }
    });
  });
  if (!added) return { status: "unchanged", added: 0 };
  if (!store.set("srs", merged)) return { status: "write-failed", added: 0 };
  return { status: "migrated", added: added };
}
function copyExactCardAliasesSafely(aliases, store) {
  store = store || Store;
  aliases = aliases && typeof aliases === "object" && !Array.isArray(aliases) ? aliases : {};
  const inspection = store.inspect("srs");
  if (inspection.status === "malformed" || inspection.status === "unavailable") {
    return { status: "protected", copied: 0, conflicts: 0, reason: inspection.status };
  }
  if (inspection.status === "ok" && !isProgressRecord(inspection.value)) {
    return { status: "protected", copied: 0, conflicts: 0, reason: "invalid-shape" };
  }
  const srs = Object.create(null);
  Object.keys(inspection.value || {}).forEach(id => { srs[id] = inspection.value[id]; });
  const candidates = new Map();
  Object.keys(aliases).sort().forEach(oldId => {
    const canonicalId = String(aliases[oldId] || "");
    if (!canonicalId || canonicalId === oldId || !owns(srs, oldId) || owns(srs, canonicalId)) return;
    if (!candidates.has(canonicalId)) candidates.set(canonicalId, []);
    candidates.get(canonicalId).push(oldId);
  });
  let copied = 0, conflicts = 0;
  candidates.forEach((oldIds, canonicalId) => {
    if (oldIds.length !== 1) { conflicts++; return; }
    srs[canonicalId] = srs[oldIds[0]];
    copied++;
  });
  if (!copied) return { status: conflicts ? "conflict" : "unchanged", copied: 0, conflicts: conflicts };
  if (!store.set("srs", srs)) return { status: "write-failed", copied: 0, conflicts: conflicts };
  return { status: "copied", copied: copied, conflicts: conflicts };
}

window.ProgressTransfer = Object.freeze({
  schema: PROGRESS_BACKUP_SCHEMA,
  version: PROGRESS_BACKUP_VERSION,
  buildBackup: buildProgressBackup,
  parseBackup: parseProgressBackup,
  validateBackup: validateProgressBackup,
  previewRestore: previewProgressRestore,
  applyRestore: applyProgressRestore,
  srsCatalogStats: srsCatalogStats,
  migrateLegacySrs: migrateLegacySrsSafely,
  copyExactAliases: copyExactCardAliasesSafely
});
/* ---------- end progress-safe backup + scheduler transfer ---------- */
const DAY14_BANK_STATS_VERSION = 2;
function migrateDay14QuestionStats() {
  if (Store.get("day14BankStatsVersion", 0) >= DAY14_BANK_STATS_VERSION) return;
  /* The 1,056-item upgrade preserves every legacy question id. Do not purge
     Question Bank history; only retire the former destructive migration. */
  Store.set("day14BankStatsVersion", DAY14_BANK_STATS_VERSION);
}
const CRISIS_COMPLETION_MIGRATION_VERSION = 1;
function migrateCrisisCompletions() {
  if (Store.get("crisisCompletionMigrationVersion", 0) >= CRISIS_COMPLETION_MIGRATION_VERSION) return;
  const completed = Store.get("crisis_done", {});
  const scores = Store.get("crisis_scores", {});
  Object.keys(scores).forEach(id => {
    if (!completed[id]) completed[id] = scores[id] && scores[id].ts || Date.now();
  });
  Store.set("crisis_done", completed);
  Store.set("crisisCompletionMigrationVersion", CRISIS_COMPLETION_MIGRATION_VERSION);
}
const DAY_MS = 86400000;
const todayStr = (value) => {
  const d = value ? new Date(value) : new Date();
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
function localDateFromStr(value) {
  const p = String(value).split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

function validDateStr(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const date = localDateFromStr(value);
  return Number.isFinite(date.getTime()) && todayStr(date) === value;
}
/* Civil-day arithmetic must not divide local-midnight timestamps by 24 hours:
   spring/fall DST days are not 24 hours long. */
function civilDayOrdinal(value) {
  const d = value instanceof Date ? value : localDateFromStr(value);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
}

/* ---------- password-protected course override ---------- */
const ADMIN_OVERRIDE_SCHEMA_VERSION = 1;
/* The override password is never shipped in clear text. Only a salted SHA-256
   of it lives here; rotate it with `node tools/set-override-password.js <new>`.
   This is a local convenience gate (nothing server-side depends on it), so the
   hash removes the readable secret rather than making the gate unbreakable. */
const ADMIN_OVERRIDE_SALT = "cardiacschool-override-v1";
const ADMIN_OVERRIDE_PASSWORD_HASH = "a4986f61d776dae275b5a11cfe770fdedc721e101174e0f62f0a28d288dd36c6";

/* Compact synchronous SHA-256 (FIPS 180-4) so the check works identically in
   the browser and in the Node validators, without crypto.subtle's async API. */
function sha256Hex(input) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  const str = String(input), bytes = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c >= 0xd800 && c < 0xdc00 && i + 1 < str.length) {
      c = 0x10000 + ((c - 0xd800) << 10) + (str.charCodeAt(++i) - 0xdc00);
      bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    } else bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLength >>> (i * 8)) & 255);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Array(64);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4;
      w[i] = (bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
  }
  return h.map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

function adminOverrideState(store) {
  const target = store || Store;
  const inspected = target.inspect("adminOverride");
  if (inspected.status === "missing") return { active: false, status: "missing", warning: null };
  if (inspected.status === "malformed" || inspected.status === "unavailable") {
    return { active: false, status: inspected.status, warning: "The saved override record could not be read. Override access remains off." };
  }
  const value = inspected.value;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { active: false, status: "invalid", warning: "The saved override record is invalid. Override access remains off." };
  }
  if (value.version !== ADMIN_OVERRIDE_SCHEMA_VERSION) {
    return {
      active: false,
      status: value.version > ADMIN_OVERRIDE_SCHEMA_VERSION ? "future" : "migration",
      warning: value.version > ADMIN_OVERRIDE_SCHEMA_VERSION
        ? "This override record was created by a newer app version. Update the app and unlock again."
        : "This override record needs migration. Unlock again with the current app."
    };
  }
  if (value.active !== true || !Number.isFinite(value.activatedAt)) {
    return { active: false, status: "invalid", warning: "The saved override record is invalid. Override access remains off." };
  }
  return { active: true, status: "active", warning: null, value: value };
}

function verifyAdminOverridePassword(value) {
  const candidate = String(value == null ? "" : value);
  if (!candidate) return false;
  return sha256Hex(ADMIN_OVERRIDE_SALT + ":" + candidate) === ADMIN_OVERRIDE_PASSWORD_HASH;
}

function setAdminOverride(active, password, store, now) {
  const target = store || Store;
  if (active) {
    if (!verifyAdminOverridePassword(password)) return { ok: false, reason: "password", message: "Incorrect password." };
    const record = { version: ADMIN_OVERRIDE_SCHEMA_VERSION, active: true, activatedAt: now == null ? Date.now() : Number(now) };
    if (!Number.isFinite(record.activatedAt) || !target.set("adminOverride", record)) {
      return { ok: false, reason: "write", message: "Override could not be saved on this device." };
    }
    return { ok: true, active: true, record: record };
  }
  if (!target.remove("adminOverride")) return { ok: false, reason: "write", message: "Override could not be turned off on this device." };
  return { ok: true, active: false };
}

function courseStartForDay(day, date) {
  day = Number(day);
  const current = date instanceof Date ? date : new Date(date == null ? Date.now() : date);
  if (!Number.isInteger(day) || day < 1 || day > 14 || !Number.isFinite(current.getTime())) return null;
  const ordinal = civilDayOrdinal(todayStr(current)) - (day - 1);
  const civil = new Date(ordinal * DAY_MS);
  return `${civil.getUTCFullYear()}-${String(civil.getUTCMonth() + 1).padStart(2, "0")}-${String(civil.getUTCDate()).padStart(2, "0")}`;
}

function rebaseCourseToDay(day, store, date, now) {
  const target = store || Store;
  if (!adminOverrideState(target).active) return { ok: false, reason: "authorization", message: "Unlock Course Override before selecting a day." };
  const startedOn = courseStartForDay(day, date == null ? new Date() : date);
  if (!startedOn) return { ok: false, reason: "day", message: "Choose a curriculum day from 1 to 14." };
  const inspected = target.inspect("enrollment");
  if (inspected.status === "malformed" || inspected.status === "unavailable") {
    return { ok: false, reason: "enrollment", message: "Enrollment data could not be read safely and was left untouched." };
  }
  const current = inspected.status === "ok" ? inspected.value : null;
  if (current && (typeof current !== "object" || Array.isArray(current) || current.version !== 1 || !validDateStr(current.startedOn))) {
    return { ok: false, reason: "enrollment", message: "Enrollment data uses an unsupported format and was left untouched." };
  }
  const timestamp = now == null ? Date.now() : Number(now);
  if (!Number.isFinite(timestamp)) return { ok: false, reason: "date", message: "The current time is unavailable." };
  const next = Object.assign({}, current || {}, {
    version: 1,
    startedOn: startedOn,
    startedAt: current && Number.isFinite(current.startedAt) ? current.startedAt : timestamp,
    rebasedAt: timestamp,
    rebasedFrom: current && current.startedOn || null,
    selectedDay: Number(day)
  });
  if (!target.set("enrollment", next, { silent: true })) {
    return { ok: false, reason: "write", message: "The selected day could not be saved. Your existing course date is unchanged." };
  }
  const warnings = [];
  if (!target.set("startDate", startedOn, { silent: true })) warnings.push("The legacy start-date mirror could not be updated.");
  if (!target.remove("recovery", { silent: true })) warnings.push("The prior recovery episode could not be cleared; pacing will remain fail-open until it can be reconciled.");
  if (typeof target.notify === "function") target.notify("enrollment");
  return { ok: true, day: Number(day), startedOn: startedOn, enrollment: next, warning: warnings.join(" ") || null };
}

window.CourseOverride = Object.freeze({
  version: ADMIN_OVERRIDE_SCHEMA_VERSION,
  getState: adminOverrideState,
  setActive: setAdminOverride,
  rebase: rebaseCourseToDay,
  startForDay: courseStartForDay,
  verifyPassword: verifyAdminOverridePassword
});
/* ---------- end password-protected course override ---------- */
let adminOverrideNotice = "";

function hasMeaningfulProgress() {
  const objectKeys = ["done", "anatomy_done", "surgery_read", "surgery_done", "trials_done", "crisis_done", "vivastats", "srs", "qstats", "activity"];
  return objectKeys.some(key => {
    const value = Store.get(key, {});
    return value && typeof value === "object" && Object.keys(value).length > 0;
  }) || Store.get("xp", 0) > 0 || Store.get("examCompleted", false);
}
function enrollmentState() {
  const value = Store.get("enrollment", null);
  return value && value.version === 1 && validDateStr(value.startedOn) ? value : null;
}
function migrateEnrollment() {
  if (enrollmentState()) return;
  const legacyStart = Store.get("startDate", null);
  if (validDateStr(legacyStart) && hasMeaningfulProgress()) {
    Store.set("enrollment", { version: 1, startedOn: legacyStart, migratedAt: Date.now() });
  }
}
function startCourse() {
  const startedOn = todayStr();
  if (!Store.set("startDate", startedOn)) return false;
  if (!Store.set("enrollment", { version: 1, startedOn: startedOn, startedAt: Date.now() })) return false;
  return true;
}
function getStartDate() {
  const enrollment = enrollmentState();
  return enrollment ? enrollment.startedOn : null;
}
function elapsedPlanDay() {
  const start = getStartDate();
  if (!start) return 1;
  return Math.max(1, civilDayOrdinal(todayStr()) - civilDayOrdinal(start) + 1);
}
function planDay() {
  return Math.min(14, elapsedPlanDay());
}

/* ---------- immutable pacing credit ---------- */
const PACING_CREDIT_SCHEMA_VERSION = 1;
const PACING_POLICY_VERSION = 1;
const PACING_COMPLETION_KEYS = ["done", "anatomy_done", "surgery_read", "surgery_done", "trials_done", "crisis_done", "vivastats"];
let pacingDataHealth = { ok: true, reason: "", key: "" };

function curriculumCrisis(day) {
  return ((window.CS_ADVANCED && window.CS_ADVANCED.crises) || []).find(item => +item.day === +day) || null;
}
function requiredPacingItems(day) {
  const circuit = (window.DAY_ECOSYSTEMS || []).find(item => +item.day === +day);
  if (!circuit) return [];
  const items = lessonsForDay(+day).map(lesson => ({ type: "lesson", id: lesson.id, day: +day }));
  ["anatomy", "surgery", "evidence", "viva"].forEach(type => {
    if (circuit[type] && circuit[type].id) items.push({ type: type, id: String(circuit[type].id), day: +day });
  });
  const crisis = curriculumCrisis(day);
  if (crisis && crisis.id) items.push({ type: "crisis", id: String(crisis.id), day: +day });
  return items;
}
function pacingCreditKey(type, id) { return String(type) + ":" + String(id); }
function nativePacingComplete(type, id) {
  if (type === "lesson") return !!Store.get("done", {})[id];
  if (type === "anatomy") return !!Store.get("anatomy_done", {})[id];
  if (type === "surgery") return !!Store.get("surgery_read", {})[id] || !!Store.get("surgery_done", {})[id];
  if (type === "evidence") return !!Store.get("trials_done", {})[id];
  if (type === "crisis") return !!Store.get("crisis_done", {})[id];
  if (type === "viva") {
    const attempt = Store.get("vivastats", {})[id];
    return !!(attempt && Array.isArray(attempt.grades) && attempt.grades.length === 3 &&
      attempt.grades.every(grade => Number.isFinite(+grade)));
  }
  return false;
}
function inspectPacingData() {
  for (const key of PACING_COMPLETION_KEYS) {
    const state = Store.inspect(key);
    if (state.status === "malformed" || state.status === "unavailable") {
      return { ok: false, reason: state.status === "malformed" ? "repair" : "storage", key: key };
    }
    if (state.status === "ok" && (!state.value || typeof state.value !== "object" || Array.isArray(state.value))) {
      return { ok: false, reason: "repair", key: key };
    }
  }
  const credit = Store.inspect("pacingCredit");
  const recovery = Store.inspect("recovery");
  for (const item of [{ key: "pacingCredit", state: credit }, { key: "recovery", state: recovery }]) {
    if (item.state.status === "malformed" || item.state.status === "unavailable") {
      return { ok: false, reason: item.state.status === "malformed" ? "repair" : "storage", key: item.key };
    }
    if (item.state.status === "ok") {
      const value = item.state.value;
      if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, reason: "repair", key: item.key };
      if (+value.schemaVersion > PACING_CREDIT_SCHEMA_VERSION || +value.policyVersion > PACING_POLICY_VERSION) {
        return { ok: false, reason: "update", key: item.key };
      }
    }
  }
  return { ok: true, reason: "", key: "" };
}
function pacingCredits() {
  const value = Store.get("pacingCredit", null);
  return value && value.schemaVersion === PACING_CREDIT_SCHEMA_VERSION &&
    value.policyVersion === PACING_POLICY_VERSION && value.entries &&
    typeof value.entries === "object" && !Array.isArray(value.entries) ? value : null;
}
function syncPacingCredits() {
  pacingDataHealth = inspectPacingData();
  if (!pacingDataHealth.ok) return false;
  const current = pacingCredits();
  const now = Date.now();
  const next = current ? {
    schemaVersion: current.schemaVersion,
    policyVersion: current.policyVersion,
    seededAt: current.seededAt || now,
    updatedAt: current.updatedAt || now,
    entries: Object.assign({}, current.entries)
  } : {
    schemaVersion: PACING_CREDIT_SCHEMA_VERSION,
    policyVersion: PACING_POLICY_VERSION,
    seededAt: now,
    updatedAt: now,
    entries: {}
  };
  let changed = !current;
  for (let day = 1; day <= 14; day++) {
    requiredPacingItems(day).forEach(item => {
      const key = pacingCreditKey(item.type, item.id);
      if (!next.entries[key] && nativePacingComplete(item.type, item.id)) {
        next.entries[key] = now;
        changed = true;
      }
    });
  }
  if (!changed) return true;
  next.updatedAt = now;
  if (!Store.set("pacingCredit", next)) {
    pacingDataHealth = { ok: false, reason: "write", key: "pacingCredit" };
    return false;
  }
  return true;
}
function hasPacingCredit(type, id) {
  const state = pacingCredits();
  return !!(state && state.entries[pacingCreditKey(type, id)]);
}
function initializePacing() {
  syncPacingCredits();
  if (typeof window.createPacingEngine !== "function") {
    pacingDataHealth = { ok: false, reason: "update", key: "pacing engine" };
    window.Pacing = null;
    return null;
  }
  window.Pacing = window.createPacingEngine({
    store: Store,
    clock: () => new Date(),
    getStartDate: getStartDate,
    isOverrideActive: () => adminOverrideState().active,
    schemaVersion: PACING_CREDIT_SCHEMA_VERSION,
    policyVersion: PACING_POLICY_VERSION,
    data: {
      lessons: () => window.ALL_LESSONS || [],
      dayEcosystems: () => window.DAY_ECOSYSTEMS || [],
      crises: () => (window.CS_ADVANCED && window.CS_ADVANCED.crises) || [],
      getSource: (type, id) => window.CardCatalog ? CardCatalog.source(type, id) : null
    },
    completion: {
      isComplete: (type, id) => pacingDataHealth.ok && hasPacingCredit(type, id),
      isIndeterminate: () => !pacingDataHealth.ok
    },
    getCardState: id => getCardState(id),
    getQuestionStats: () => qStats()
  });
  try { window.Pacing.reconcile("initialize"); } catch (error) {
    pacingDataHealth = { ok: false, reason: "update", key: "pacing engine" };
  }
  window.StaffPreview?.patchPacing(window.Pacing);
  return window.Pacing;
}
function pacingState() {
  if (!window.Pacing || typeof window.Pacing.getState !== "function") {
    return { status: getStartDate() ? "indeterminate" : "unenrolled", overrideActive: adminOverrideState().active, locksEnabled: false, elapsedDay: elapsedPlanDay(), scheduledDay: planDay(), activeStudyDay: planDay() };
  }
  try { return window.Pacing.getState(); }
  catch (error) { return { status: "indeterminate", overrideActive: adminOverrideState().active, locksEnabled: false, elapsedDay: elapsedPlanDay(), scheduledDay: planDay(), activeStudyDay: planDay() }; }
}
function activeStudyDay() {
  const state = pacingState();
  return Math.max(1, Math.min(14, +(state.activeStudyDay || state.activeDay || state.scheduledDay || planDay())));
}
function isBehind(state) {
  const current = state || pacingState();
  return current.status === "yellow" || current.status === "red";
}
function accessAllowed(result) {
  return typeof result === "object" ? result.allowed !== false : result !== false;
}
function canAccessSource(type, id, purpose) {
  if (!window.Pacing || typeof window.Pacing.canAccessSource !== "function") return true;
  try { return accessAllowed(window.Pacing.canAccessSource(type, id, purpose || "browse")); }
  catch (error) { return true; }
}
function canAccessCoreDay(day) {
  if (!window.Pacing || typeof window.Pacing.canAccessCoreDay !== "function") return true;
  try { return accessAllowed(window.Pacing.canAccessCoreDay(+day)); }
  catch (error) { return true; }
}
function filterPacingCards(cards, mode) {
  if (!window.Pacing || typeof window.Pacing.filterCards !== "function") return cards.slice();
  try { return window.Pacing.filterCards(cards, mode); } catch (error) { return cards.slice(); }
}
function filterPacingQuestions(questions, mode) {
  if (!window.Pacing || typeof window.Pacing.filterQuestions !== "function") return questions.slice();
  try { return window.Pacing.filterQuestions(questions, mode); } catch (error) { return questions.slice(); }
}

function doneLessons() { return Store.get("done", {}); }
function exDone() { return Store.get("exdone", {}); }
function bumpStreak() {
  const s = Store.get("streak", { count: 0, last: null });
  const t = todayStr();
  if (s.last === t) return;
  const yest = todayStr(new Date(Date.now() - DAY_MS));
  s.count = (s.last === yest) ? s.count + 1 : 1;
  s.last = t; Store.set("streak", s);
  checkAchievements();
}
function streakCount() {
  const s = Store.get("streak", { count: 0, last: null });
  if (!s.last) return 0;
  const yest = todayStr(new Date(Date.now() - DAY_MS));
  return (s.last === todayStr() || s.last === yest) ? s.count : 0;
}

/* ---------- activity log (heatmap) ---------- */
function logActivity(n) {
  const a = Store.get("activity", {});
  a[todayStr()] = (a[todayStr()] || 0) + (n || 1);
  Store.set("activity", a);
}

/* ---------- daily counters + quests ---------- */
function daily() {
  const d = Store.get("daily", {});
  return d.date === todayStr() ? d : { date: todayStr(), rev: 0, qok: 0, les: 0, newCards: 0 };
}
function bumpDaily(k) {
  const d = daily(); d[k] = (d[k] || 0) + 1; Store.set("daily", d);
  checkQuests();
}
function questDefs() {
  const state = pacingState();
  const dayLessons = Math.max(1, lessonsForDay(activeStudyDay()).length);
  const quests = [
    { id: "rev20", icon: "🧠", label: "Review 20 flashcards", target: 20, val: Math.min(20, daily().rev), xp: 25 },
    { id: "mcq10", icon: "🎯", label: "Get 10 MCQs right", target: 10, val: Math.min(10, daily().qok), xp: 25 }
  ];
  if (!isBehind(state)) quests.push({
    id: "les", icon: "📚", label: "Finish " + dayLessons + " lesson" + (dayLessons === 1 ? "" : "s"),
    target: dayLessons, val: Math.min(dayLessons, daily().les), xp: 30
  });
  return quests;
}
function questsDoneToday() {
  const all = Store.get("questsDone", {});
  return all[todayStr()] || {};
}
function checkQuests() {
  const all = Store.get("questsDone", {});
  const key = todayStr();
  all[key] = all[key] || {};
  questDefs().forEach(q => {
    if (!all[key][q.id] && q.val >= q.target) {
      all[key][q.id] = true; Store.set("questsDone", all);
      toast("⚡ Quest complete: " + q.label);
      addXP(q.xp);
    }
  });
  Store.set("questsDone", all);
}

/* ---------- XP + levels ---------- */
const LEVELS = [
  { xp: 0, title: "Med Student" },
  { xp: 120, title: "Clerkship Star" },
  { xp: 300, title: "Sub-Intern" },
  { xp: 600, title: "Intern" },
  { xp: 1000, title: "Junior Resident" },
  { xp: 1600, title: "Senior Resident" },
  { xp: 2400, title: "Chief Resident" },
  { xp: 3400, title: "Fellow" },
  { xp: 4600, title: "Integrated Thinker" },
  { xp: 6000, title: "Capstone Scholar" }
];
function xpTotal() { return Store.get("xp", 0); }
function levelInfo(xp) {
  let li = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) li = i;
  const cur = LEVELS[li], next = LEVELS[li + 1];
  return {
    n: li + 1, title: cur.title, max: !next,
    pct: next ? Math.round(100 * (xp - cur.xp) / (next.xp - cur.xp)) : 100,
    toNext: next ? next.xp - xp : 0
  };
}
function addXP(n) {
  const before = levelInfo(xpTotal());
  Store.set("xp", xpTotal() + n);
  const after = levelInfo(xpTotal());
  xpChip(n);
  renderXP();
  if (after.n > before.n) levelUp(after);
  checkAchievements();
}
function xpChip(n) {
  let lane = document.getElementById("xp-lane");
  if (!lane) { lane = document.createElement("div"); lane.id = "xp-lane"; document.body.appendChild(lane); }
  const c = document.createElement("div"); c.className = "xp-chip"; c.textContent = "+" + n + " XP";
  lane.appendChild(c); setTimeout(() => c.remove(), 1600);
}
function levelUp(info) {
  confettiBurst();
  const o = document.createElement("div"); o.className = "levelup-overlay";
  o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Level achieved");
  o.innerHTML = `<div class="levelup-card">
    <div class="lvl-badge big">${info.n}</div>
    <h1>LEVEL UP</h1>
    <p>You are now <b>${info.title}</b></p>
    <button class="btn" id="lvl-ok">Keep operating</button></div>`;
  document.body.appendChild(o);
  const close = () => o.remove();
  o.querySelector("#lvl-ok").onclick = close;
  o.querySelector("#lvl-ok").focus();
  o.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  o.addEventListener("click", e => { if (e.target === o) o.remove(); });
}

/* ---------- achievements ---------- */
const ACHIEVEMENTS = [
  { id: "first-lesson", icon: "🔪", title: "First Incision", desc: "Complete your first lesson", check: () => Object.keys(doneLessons()).length >= 1 },
  { id: "five-lessons", icon: "🩺", title: "Rounding Resident", desc: "Complete 5 lessons", check: () => Object.keys(doneLessons()).length >= 5 },
  { id: "twenty-lessons", icon: "📖", title: "Page Turner", desc: "Complete 20 lessons", check: () => Object.keys(doneLessons()).length >= 20 },
  { id: "all-lessons", icon: "👑", title: "Curriculum Conqueror", desc: "Complete every lesson", check: () => window.ALL_LESSONS.length && Object.keys(doneLessons()).length >= window.ALL_LESSONS.length },
  { id: "streak-3", icon: "🔥", title: "On Call", desc: "3-day study streak", check: () => streakCount() >= 3 },
  { id: "streak-7", icon: "⚡", title: "Week-One Warrior", desc: "7-day study streak", check: () => streakCount() >= 7 },
  { id: "streak-14", icon: "🛡️", title: "Iron Surgeon", desc: "14-day study streak", check: () => streakCount() >= 14 },
  { id: "cards-50", icon: "🧠", title: "Memory Bank", desc: "50 flashcard reviews", check: () => Store.get("revCount", 0) >= 50 },
  { id: "cards-250", icon: "🌀", title: "Spaced-Rep Machine", desc: "250 flashcard reviews", check: () => Store.get("revCount", 0) >= 250 },
  { id: "cards-600", icon: "🐘", title: "Hippocampus Hypertrophy", desc: "600 flashcard reviews", check: () => Store.get("revCount", 0) >= 600 },
  { id: "q-50", icon: "🎯", title: "Vignette Hunter", desc: "Answer 50 MCQs", check: () => totalAnswered() >= 50 },
  { id: "q-200", icon: "💣", title: "Bank Breaker", desc: "Answer 200 MCQs", check: () => totalAnswered() >= 200 },
  { id: "acc-80", icon: "🔬", title: "Sharp Scalpel", desc: "80%+ accuracy over 50+ answers", check: () => { const t = totalAnswered(); return t >= 50 && totalCorrect() / t >= 0.8; } },
  { id: "quiz-perfect", icon: "💎", title: "Flawless Vignettes", desc: "Score 100% on a quiz of 10+", check: () => Store.get("perfectQuiz", false) },
  { id: "combo-10", icon: "🌟", title: "Combo ×10", desc: "10 correct answers in a row", check: () => Store.get("bestCombo", 0) >= 10 },
  { id: "ex-flawless", icon: "🤲", title: "Steady Hands", desc: "Finish an interactive with zero misses", check: () => Store.get("flawlessEx", false) },
  { id: "exam-pass", icon: "🏆", title: "Capstone Benchmark", desc: "Reach the cumulative-exam benchmark (≥70%)", check: () => Store.get("examPass", false) },
  { id: "night-owl", icon: "🦉", title: "Night Shift", desc: "Study between midnight and 5 a.m.", check: () => { const h = new Date().getHours(); return h >= 0 && h < 5; } },
  { id: "early-bird", icon: "🌅", title: "Pre-Rounds", desc: "Study before 7 a.m.", check: () => { const h = new Date().getHours(); return h >= 5 && h < 7; } },
  { id: "level-5", icon: "🎖️", title: "Halfway to the Top", desc: "Reach level 5", check: () => levelInfo(xpTotal()).n >= 5 },
  { id: "level-10", icon: "⚜️", title: "Full-Circuit Scholar", desc: "Reach level 10", check: () => levelInfo(xpTotal()).n >= 10 }
];
function achState() { return Store.get("ach", {}); }
let achChecking = false;
function checkAchievements() {
  if (achChecking) return; achChecking = true;
  try {
    const st = achState(); let changed = false;
    ACHIEVEMENTS.forEach(a => {
      if (!st[a.id] && a.check()) { st[a.id] = Date.now(); changed = true; achToast(a); }
    });
    if (changed) { Store.set("ach", st); }
  } finally { achChecking = false; }
}
function achToast(a) {
  const t = document.createElement("div"); t.className = "ach-toast";
  t.innerHTML = `<span class="ach-ico">${a.icon}</span><span class="ach-txt"><b>ACHIEVEMENT UNLOCKED</b><span>${a.title}</span></span>`;
  document.body.appendChild(t); setTimeout(() => t.remove(), 4500);
}

/* ---------- confetti ---------- */
function confettiBurst() {
  const colors = ["#22D3EE", "#8B5CF6", "#F59E0B", "#10B981", "#F472B6", "#60A5FA"];
  const wrap = document.createElement("div"); wrap.className = "confetti-burst"; wrap.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (1.7 + Math.random() * 1.6) + "s";
    p.style.animationDelay = (Math.random() * 0.4) + "s";
    p.style.width = p.style.height = (5 + Math.random() * 6) + "px";
    if (i % 3 === 0) p.style.borderRadius = "50%";
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3600);
}

/* ---------- icons (Lucide-style inline SVG) ---------- */
const IC = (name, cls) => {
  const paths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    map: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 4v5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M20 17v5H6.5a2.5 2.5 0 0 1 0-5"/>',
    cards: '<rect x="2" y="6" width="16" height="13" rx="2"/><path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/>',
    quiz: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><circle cx="12" cy="17.5" r=".5" fill="currentColor"/>',
    puzzle: '<path d="M14 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3H7a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3v2a1 1 0 0 0 1 1h3v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-3V8a1 1 0 0 0-1-1z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    minus: '<path d="M5 12h14"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    flame: '<path d="M12 22c4.4 0 8-3.6 8-8 0-3.5-2.5-6.3-4.5-8.5C14 3.9 13 2.5 13 2c-1 2-2 3.5-3.5 5C7.5 9 6 11 6 14c0 4.4 3.6 8 6 8z"/><path d="M12 22c-2 0-3.5-1.6-3.5-3.5 0-1.7 1.2-2.8 2-3.8.7-.8 1.3-1.6 1.5-2.7 1.4 1.3 3.5 3.2 3.5 6.5 0 1.9-1.5 3.5-3.5 3.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    scope: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/>',
    grad: '<path d="M22 9 12 4 2 9l10 5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v6"/>',
    trophy: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M17 5h3a1 1 0 0 1 1 1c0 2-1.5 3.5-4 4M7 5H4a1 1 0 0 0-1 1c0 2 1.5 3.5 4 4"/>',
    zap: '<path d="M13 2 3 14h7l-1 8 11-13h-8z"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    heart: '<path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 4.5 5.6 4.5c2 0 3.4 1.1 4.4 2.4 1-1.3 2.4-2.4 4.4-2.4 3.6 0 5.2 3.8 3.6 7.2C19.5 16.4 12 21 12 21z"/>',
    scalpel: '<path d="m14.5 3.5 6 6-9.5 9.5-4 1 1-4z"/><path d="m12 6 6 6M7 20H3"/>',
    activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'
  };
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
};

/* ---------- Anki scheduler ----------
   States: "lrn" (learning steps), "rev" (graduated review), "rel" (relearning after lapse).
   Ratings: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy. */
const LEARN_STEPS = [1, 10];     // minutes
const RELEARN_STEPS = [10];      // minutes
const GRAD_IVL = 1, EASY_IVL = 4, MAX_IVL = 365;

function srsData() { return Store.get("srs", {}); }
function saveSrs(d) { Store.set("srs", d); }
function blankCard() { return { st: "lrn", step: 0, ef: 2.5, iv: 0, reps: 0, lapses: 0, due: 0 }; }
function getCardState(id, states) {
  const c = (states || srsData())[id];
  if (!c) return null;
  if (!c.st) return Object.assign(blankCard(), c, { st: c.iv > 0 ? "rev" : "lrn" }); // migrate v1 SM-2 data
  return Object.assign(blankCard(), c);
}
function schedule(c0, r, now) {
  const c = Object.assign(blankCard(), c0);
  const MIN = 60000;
  if (c.st === "lrn" || c.st === "rel") {
    const steps = c.st === "lrn" ? LEARN_STEPS : RELEARN_STEPS;
    if (r === 0) { c.step = 0; c.due = now + steps[0] * MIN; }
    else if (r === 1) { c.due = now + Math.round(steps[Math.min(c.step, steps.length - 1)] * 1.5) * MIN; }
    else if (r === 2) {
      c.step++;
      if (c.step >= steps.length) {
        c.iv = c.st === "lrn" ? GRAD_IVL : Math.max(1, c.iv);
        c.st = "rev"; c.step = 0; c.reps++; c.due = now + c.iv * DAY_MS;
      } else c.due = now + steps[c.step] * MIN;
    } else {
      c.iv = c.st === "lrn" ? EASY_IVL : Math.max(2, c.iv + 1);
      c.st = "rev"; c.step = 0; c.reps++; c.due = now + c.iv * DAY_MS;
    }
  } else { // review
    if (r === 0) {
      c.lapses++; c.ef = Math.max(1.3, c.ef - 0.2);
      c.iv = Math.max(1, Math.round(c.iv * 0.25));
      c.st = "rel"; c.step = 0; c.due = now + RELEARN_STEPS[0] * MIN;
    } else {
      if (r === 1) { c.ef = Math.max(1.3, c.ef - 0.15); c.iv = Math.max(c.iv + 1, Math.round(c.iv * 1.2)); }
      else if (r === 2) { c.iv = Math.max(c.iv + 1, Math.round(c.iv * c.ef)); }
      else { c.ef += 0.15; c.iv = Math.max(c.iv + 1, Math.round(c.iv * c.ef * 1.3)); }
      c.iv = Math.min(c.iv, MAX_IVL); c.reps++;
      const fuzz = c.iv > 2 ? (Math.random() * 0.1 - 0.05) : 0;
      c.due = now + Math.round(c.iv * (1 + fuzz)) * DAY_MS;
    }
  }
  return c;
}
function previewIvl(card, r, states) {
  const now = Date.now();
  const c = schedule(getCardState(card.id, states) || blankCard(), r, now);
  const delta = c.due - now;
  if (delta < 55 * 60000) return Math.max(1, Math.round(delta / 60000)) + " min";
  if (delta < DAY_MS * 1.4) return "1 d";
  const d = Math.round(delta / DAY_MS);
  return d < 30 ? d + " d" : (d / 30).toFixed(1) + " mo";
}
function rateCard(card, r) {
  const srs = srsData();
  const now = Date.now();
  const c = schedule(getCardState(card.id, srs) || blankCard(), r, now);
  srs[card.id] = c; saveSrs(srs);
  Store.set("revCount", Store.get("revCount", 0) + 1);
  bumpStreak(); logActivity(); bumpDaily("rev");
  addXP(r === 0 ? 2 : 5);
  return c.due <= now + 15 * 60000; // true → requeue this session
}
function lessonDone(id) { return !!(id && doneLessons()[id]); }
function cardDayPrefs() { return Store.get("cardDays", {}); }
function dayCardsEnabled(day) {
  const prefs = cardDayPrefs();
  // Connected 14-day decks are opt-in: an untouched day stays out of review.
  return prefs[String(day)] === true;
}
function setDayCardsEnabled(day, enabled) {
  const prefs = cardDayPrefs();
  prefs[String(day)] = !!enabled;
  Store.set("cardDays", prefs);
}
function cardSourceType(c) {
  if (c && c.source && typeof c.source === "object") return c.source.type;
  if (c && c.lesson) return "lesson";
  if (c && c.surgery) return "surgery";
  return String(c && c.source || "").toLowerCase();
}
function cardSourceId(c) {
  if (c && c.source && typeof c.source === "object") return String(c.source.id || "");
  if (c && c.lesson) return String(c.lesson);
  if (c && c.surgery) return String(c.surgery);
  return "";
}
function cardSourceCompleted(c, done, surgery) {
  const type = cardSourceType(c), id = cardSourceId(c);
  if (!id) return false;
  if (type === "lesson") return !!(done || doneLessons())[id];
  if (type === "anatomy") return !!Store.get("anatomy_done", {})[id];
  if (type === "surgery") return !!(surgery || Store.get("surgery_done", {}))[id] || !!Store.get("surgery_read", {})[id];
  if (type === "evidence") return !!Store.get("trials_done", {})[id];
  if (type === "physiology") return !!Store.get("physiology_lab_scores", {})[id];
  if (type === "exercise") return !!Store.get("exdone", {})[id];
  if (type === "crisis") return !!Store.get("crisis_done", {})[id];
  if (type === "viva") return !!Store.get("vivastats", {})[id];
  if (type === "angiography") {
    const chapters = (window.ANGIOGRAPHY && (window.ANGIOGRAPHY.chapters || window.ANGIOGRAPHY.lessons)) || [];
    const read = Store.get("angio_read", {});
    return chapters.length > 0 && chapters.every(chapter => read[String(chapter.id)]);
  }
  return false;
}
function cardGateUnlocked(c, done, surgery) {
  if (window.StaffPreview?.active()) return true;
  return cardSourceCompleted(c, done, surgery) || (c.unlockDay === 14 && Store.get("examCompleted", false));
}
// Source cards join the shared queue only after their own learning item is complete.
// Curriculum cards additionally require the learner to opt that 14-day deck in.
function unlockedCards() {
  if (window.StaffPreview?.active()) return (window.FLASHCARDS || []).slice();
  const done = doneLessons();
  const surgery = Store.get("surgery_done", {});
  return (window.FLASHCARDS || []).filter(c => cardGateUnlocked(c, done, surgery))
    .filter(c => cardSourceType(c) !== "lesson" || !(c.linkedDays || []).length || c.linkedDays.some(dayCardsEnabled));
}
function enrichmentEnabled() { return Store.get("includeEnrichmentCards", false) === true; }
function cardTierEligible(card, states) {
  if (!card || card.tier !== "enrichment") return true;
  return !!((states || srsData())[card.id]) || enrichmentEnabled();
}
function setEnrichmentEnabled(enabled) {
  Store.set("includeEnrichmentCards", !!enabled);
  if (location.hash.startsWith("#/cards")) viewCards();
}
window.setEnrichmentEnabled = setEnrichmentEnabled;
function isGuidelineNumberCard(card) {
  return !!card && (card.archetype === "numeric-guideline" || card.category === "number" || card.category === "guideline" || !!card.numeric || !!card.guideline);
}
const RETRIEVAL_SOURCE_BATCHES_PER_DAY = 2;
const RETRIEVAL_NEW_CARDS_PER_DAY = 20;
function retrievalSourceKey(card) {
  const type = cardSourceType(card), id = cardSourceId(card);
  return type && id ? type + ":" + id : "";
}
function retrievalReleaseState(cards, states, persist) {
  cards = Array.isArray(cards) ? cards : [];
  states = states && typeof states === "object" ? states : {};
  const inspected = Store.inspect("retrievalRelease");
  const stored = inspected.status === "ok" && inspected.value && typeof inspected.value === "object" && !Array.isArray(inspected.value)
    ? inspected.value : {};
  const admitted = new Set(Array.isArray(stored.admittedSources) ? stored.admittedSources.map(String) : []);

  // Once any card from a rebuilt source has scheduling history, the rest of
  // that source belongs to the same release batch. Existing reviews therefore
  // remain available even when this release ledger is new or malformed.
  cards.forEach(card => {
    const key = retrievalSourceKey(card);
    if (card && card.schemaVersion === 2 && key && states[card.id]) admitted.add(key);
  });

  const sourceDay = new Map();
  cards.forEach(card => {
    const key = retrievalSourceKey(card);
    if (!key) return;
    const linked = (card.linkedDays || []).map(Number).filter(Number.isFinite);
    const first = linked.length ? Math.min.apply(null, linked) : 99;
    sourceDay.set(key, Math.min(sourceDay.has(key) ? sourceDay.get(key) : 99, first));
  });
  const pending = Array.from(new Set(cards.filter(card => card && card.schemaVersion === 2 && !states[card.id])
    .map(retrievalSourceKey).filter(key => key && !admitted.has(key))))
    .sort((left, right) => (sourceDay.get(left) || 99) - (sourceDay.get(right) || 99) || left.localeCompare(right));
  const today = todayStr();
  const canAdmit = stored.lastAdmissionDate !== today;
  const added = canAdmit ? pending.slice(0, RETRIEVAL_SOURCE_BATCHES_PER_DAY) : [];
  added.forEach(key => admitted.add(key));
  const next = {
    version: 1,
    lastAdmissionDate: added.length ? today : (stored.lastAdmissionDate || null),
    admittedSources: Array.from(admitted).sort()
  };
  const storageWritable = inspected.status === "missing" || inspected.status === "ok";
  if (persist !== false && storageWritable && (inspected.status !== "ok" || JSON.stringify(stored) !== JSON.stringify(next))) {
    Store.set("retrievalRelease", next);
  }
  return { admitted: admitted, pending: pending.filter(key => !admitted.has(key)), added: added, state: next };
}
function retrievalReleaseSummary() {
  const states = srsData();
  const eligible = unlockedCards().filter(card => cardTierEligible(card, states));
  return retrievalReleaseState(eligible, states, true);
}
function unlockedQuestions() {
  const done = doneLessons();
  const surgery = Store.get("surgery_done", {}), read = Store.get("surgery_read", {});
  return (window.QUESTIONS || []).filter(q => (q.lesson && done[q.lesson]) || (q.surgery && (surgery[q.surgery] || read[q.surgery])));
}
function dueCards() {
  const srs = srsData(), now = Date.now();
  const candidates = (window.FLASHCARDS || []).filter(card => {
    const state = getCardState(card.id, srs);
    if (!state) return false;
    if (cardSourceType(card) === "lesson" && (card.linkedDays || []).length && !card.linkedDays.some(dayCardsEnabled)) return false;
    return state.st === "rel" || state.due <= now;
  });
  return filterPacingCards(candidates, { purpose: "review", states: srs, now: now });
}
function newCards() {
  const srs = srsData();
  const eligible = unlockedCards().filter(c => !srs[c.id] && cardTierEligible(c, srs));
  const release = retrievalReleaseState(eligible, srs, true);
  return filterPacingCards(eligible.filter(card => card.schemaVersion !== 2 || release.admitted.has(retrievalSourceKey(card))),
    { purpose: "review", states: srs, now: Date.now() });
}
window.RetrievalRelease = Object.freeze({
  sourceKey: retrievalSourceKey,
  state: retrievalReleaseState,
  batchesPerDay: RETRIEVAL_SOURCE_BATCHES_PER_DAY,
  newCardsPerDay: RETRIEVAL_NEW_CARDS_PER_DAY
});
/* ---------- quiz stats ---------- */
function qStats() { return Store.get("qstats", {}); }
function totalAnswered() { return Object.values(qStats()).reduce((a, b) => a + b.seen, 0); }
function totalCorrect() { return Object.values(qStats()).reduce((a, b) => a + b.ok, 0); }
function recordAnswer(qid, ok) {
  const s = qStats(); const e = s[qid] || { seen: 0, ok: 0 };
  e.seen++; if (ok) e.ok++; s[qid] = e; Store.set("qstats", s);
  bumpStreak(); logActivity();
  if (ok) bumpDaily("qok");
}

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const escAttr = s => esc(s).replace(/"/g, "&quot;");
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
  document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
}
function ring(pct, size) {
  size = size || 96; const r = size / 2 - 7, c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px" role="img" aria-label="${pct}% complete">
    <svg width="${size}" height="${size}"><defs><linearGradient id="ringgrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="var(--g1)"/><stop offset="100%" stop-color="var(--g2)"/></linearGradient></defs>
    <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="9" fill="none"/>
    <circle class="meter" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="9" fill="none" stroke="url(#ringgrad)" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg>
    <div class="ring-label">${pct}%</div></div>`;
}
function countUpAll() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const end = +el.dataset.count; if (!end) { return; }
    const t0 = performance.now(), dur = 700;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
/* Shared practice-hub hero. One component, three identities — the accent class,
   kicker and watermark icon are what distinguish quiz / interactive / viva.
   opts: {accent, kicker, icon, title, lead, stats:[{v,l,count}], side} */
function hubHero(opts) {
  const stats = (opts.stats || []).map(s =>
    `<div class="stat"><div class="v"${s.count ? ` data-count="${s.v}"` : ""}>${s.count ? 0 : s.v}</div><div class="l">${s.l}</div></div>`).join("");
  const side = opts.side || (stats ? `<div class="hub-stats">${stats}</div>` : "");
  return `<div class="feature-hero hub-hero ${opts.accent || ""}">
    <div class="fh-body">
      <span class="eyebrow">${opts.kicker || ""}</span>
      <h1>${opts.title || ""}</h1>
      ${opts.lead ? `<p class="fh-sub">${opts.lead}</p>` : ""}
    </div>
    ${side ? `<div class="fh-side">${side}</div>` : ""}
    ${opts.icon ? `<span class="fh-icon" aria-hidden="true">${IC(opts.icon)}</span>` : ""}
  </div>`;
}
/* Labelled progress row: head (label · value) over a .bar. One markup for
   progress, exam results and hub accuracy rows. */
function barRow(label, valueText, pct, opts) {
  opts = opts || {};
  return `<div class="bar-row">
    <div class="bar-row-head small"><b>${label}</b><span class="muted">${valueText}</span></div>
    <div class="bar ${opts.green ? "green" : ""}${opts.sm ? " sm" : ""}"><span style="width:${Math.max(0, Math.min(100, pct))}%"></span></div>
    ${opts.sub ? `<p class="bar-row-sub small muted">${opts.sub}</p>` : ""}</div>`;
}
function pacingDayProgress(day) {
  if (!window.Pacing || typeof window.Pacing.dayProgress !== "function") {
    return { day: +day, score: 0, pct: 0, breakdown: {} };
  }
  try { return window.Pacing.dayProgress(+day); }
  catch (error) { return { day: +day, score: 0, pct: 0, breakdown: {}, indeterminate: true }; }
}
function pacingScore(progress) {
  const raw = Number(progress && (progress.score != null ? progress.score : progress.pct));
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(100, raw <= 1 ? raw * 100 : raw));
}
function pacingThreshold(state) {
  const rawValue = state && state.threshold;
  const raw = Number(rawValue);
  if (rawValue != null && Number.isFinite(raw)) return raw <= 1 ? raw * 100 : raw;
  return state && state.status === "red" ? 75 : 50;
}
function pacingBreakdownHTML(progress) {
  const b = progress && progress.breakdown || {};
  const items = [];
  if (b.lessons) {
    const complete = b.lessons.completed != null ? b.lessons.completed : b.lessons.done;
    items.push(`Lessons ${complete || 0}/${b.lessons.total || 0} · ${Math.round(Number(b.lessons.points) || 0)}%`);
  }
  const labels = { anatomy: "Anatomy", surgery: "Article", evidence: "Evidence", crisis: "Crisis", viva: "Viva" };
  Object.keys(labels).forEach(key => {
    if (b[key]) items.push(`${labels[key]} ${b[key].complete ? "✓" : "○"} · ${Math.round(Number(b[key].points) || 0)}%`);
  });
  return items.length ? `<div class="pacing-breakdown">${items.map(item => `<span>${esc(item)}</span>`).join("")}</div>` : "";
}
function pacingWarningHTML() {
  const state = pacingState();
  if (state.status !== "indeterminate" && pacingDataHealth.ok) return "";
  const update = pacingDataHealth.reason === "update";
  return `<section class="pacing-status yellow" role="alert">
    <span class="pacing-icon" aria-hidden="true">⚠</span>
    <div><h2>Pacing status unavailable — locks are off</h2>
      <p>${update ? "This saved pacing data was created by a newer app version. Update the app before relying on recovery status." :
        "Saved progress could not be read or updated safely. Your raw data has been left untouched; repair browser storage before relying on pacing."}</p></div>
    <div class="pacing-score">OPEN<small>fail-safe</small></div>
  </section>`;
}
function pacingStatusHTML(state, day) {
  const s = state || pacingState();
  if (s.status === "indeterminate") return pacingWarningHTML();
  if (s.status === "unenrolled") return "";
  if (s.overrideActive) {
    const scheduled = +(s.scheduledDay || planDay());
    const underlying = String(s.underlyingStatus || "on-track").replace("on-track", "on track");
    const underlyingDay = +(s.underlyingActiveDay || scheduled);
    const underlyingCopy = underlying === "unenrolled"
      ? "The course clock has not started yet; select a numbered day on the Plan to begin it."
      : underlying === "yellow" || underlying === "red"
        ? `Underlying pacing is ${underlying} on Day ${underlyingDay}; it will be enforced again when the override is turned off.`
        : `Underlying pacing is ${underlying}; the course clock and all progress continue to update normally.`;
    return `<section class="pacing-status override" role="status" aria-live="polite">
      <span class="pacing-icon" aria-hidden="true">↯</span>
      <div><h2>Course override active</h2><p>Scheduled Day ${scheduled}. All pacing and recovery locks are bypassed. ${esc(underlyingCopy)}</p>
        <p><a href="#/plan"><b>Manage override or change day →</b></a></p></div>
      <div class="pacing-score">OPEN<small>Day ${scheduled}</small></div>
    </section>`;
  }
  const active = Math.max(1, Math.min(14, +(day || s.activeStudyDay || s.activeDay || s.scheduledDay || 1)));
  const progress = pacingDayProgress(active);
  const score = Math.round(pacingScore(progress));
  const threshold = Math.round(pacingThreshold(s));
  const behind = isBehind(s);
  const recovery = s.recovery || {};
  const lockFrom = +(s.lockFromDay || recovery.lockFromDay || 0);
  const scheduled = +(s.scheduledDay || planDay());
  const lag = +(s.lag || s.daysBehind || 0);
  const kind = s.status === "red" ? "red" : s.status === "yellow" ? "yellow" : "";
  const icon = s.status === "red" ? "⛔" : s.status === "yellow" ? "⚠" : "✓";
  let title = "On pace";
  let copy = `Scheduled Day ${scheduled}. No elapsed curriculum day is below 50%.`;
  if (s.status === "yellow") {
    title = `Catch up on Day ${active}`;
    copy = `Scheduled Day ${scheduled} · ${lag} day${lag === 1 ? "" : "s"} behind. Later core days are paused until Day ${active} reaches 50%.`;
  } else if (s.status === "red") {
    title = `Recovery circuit: Day ${active}`;
    copy = `Scheduled Day ${scheduled} · ${lag} days behind. The frozen cohort must reach 75% per day.${lockFrom ? ` Extras introduced from Day ${lockFrom} onward are softly locked.` : ""}`;
  }
  return `<section class="pacing-status ${kind}" role="status" aria-live="polite">
    <span class="pacing-icon" aria-hidden="true">${icon}</span>
    <div><h2>${esc(title)}</h2><p>${esc(copy)}</p>${pacingBreakdownHTML(progress)}
      ${behind ? `<p><a href="#/day/${active}"><b>Continue Day ${active} recovery →</b></a></p>` : ""}</div>
    <div class="pacing-score">${score}%<small>need ${threshold}%</small></div>
  </section>`;
}
function renderPacingLock(access) {
  const state = pacingState();
  const active = activeStudyDay();
  const recoveryPause = isBehind(state);
  const prerequisite = access && access.kind === "prerequisite";
  const reason = access && (access.reason || access.message) ||
    (state.status === "red" ? "Finish the active recovery circuit before opening this content." :
      "Bring the earliest incomplete day to 50% before moving forward.");
  pauseExam();
  if (window.CSLab && typeof window.CSLab.teardown === "function") window.CSLab.teardown();
  if (window.Surgery && typeof window.Surgery.teardown === "function") window.Surgery.teardown();
  if (window.Angiography && typeof window.Angiography.teardown === "function") window.Angiography.teardown();
  $("#main").innerHTML = `<section class="pacing-lock-screen" role="alert" tabindex="-1">
    <span class="lock-mark" aria-hidden="true">${IC("lock")}</span>
    <h1>${prerequisite ? "Learning prerequisite" : recoveryPause ? "Recovery pause" : "Scheduled content"}</h1>
    <p>${esc(reason)}</p>
    ${pacingStatusHTML(state, active)}
    <div class="action-row"><a class="btn" href="#/day/${active}">${recoveryPause ? "Continue" : "Open"} Day ${active}</a>
      <a class="btn secondary" href="#/">Today</a></div>
  </section>`;
}
function lessonById(id) { return (window.ALL_LESSONS || []).find(l => l.id === id); }
function lessonsForDay(d) { return (window.ALL_LESSONS || []).filter(l => l.day === d); }
function exercisesForDay(d) { return (window.EXERCISES || []).filter(e => e.day === d); }
function advancedForDay(d) {
  const sources = window.CardCatalog ? CardCatalog.sourcesForDay(d) : [];
  const crises = ((window.CS_ADVANCED && window.CS_ADVANCED.crises) || [])
    .filter(crisis => +crisis.day === +d)
    .map(crisis => window.CardCatalog ? CardCatalog.source("crisis", crisis.id) : {
      type: "crisis", id: crisis.id, title: crisis.title, route: "#/crisis/" + encodeURIComponent(crisis.id)
    })
    .filter(Boolean);
  return {
    operations: sources.filter(source => source.type === "surgery"),
    labs: sources.filter(source => source.type === "physiology"),
    /* Crisis navigation belongs to the 14-day plan even though Crisis Rooms
       intentionally contribute no flashcards to the card catalog. */
    crises: crises
  };
}
function markLessonDone(id) {
  const d = doneLessons();
  if (!d[id]) {
    d[id] = Date.now(); Store.set("done", d);
    bumpStreak(); logActivity(); bumpDaily("les");
    addXP(40);
  }
}

/* ---------- navigation shell ---------- */
const NAV = [
  ["#/", "home", "Today"],
  ["#/plan", "map", "14-Day Plan"],
  ["#/physiology", "activity", "Labs"],
  ["#/cards", "cards", "Flashcards"],
  ["#/quiz", "quiz", "Question Bank"],
  ["#/progress", "chart", "Progress"],
  ["#/awards", "trophy", "Awards"],
  ["#/extras", "book", "Library"],
  ["#/feedback", "alert", "Feedback"]
];
const EXTRA_ROUTE_PREFIXES = ["#/extras", "#/surgery", "#/viva", "#/anatomy", "#/anat-cards", "#/exercises", "#/exercise", "#/trials", "#/crisis", "#/angiography"];
function renderNav() {
  const due = dueCards().length;
  const route = location.hash || "#/";
  const unlockedAch = Object.keys(achState()).length;
  const pacing = pacingState();
  const link = ([href, icon, label]) => {
    const active = href === "#/"
      ? (route === "#/" || route === "" || route.startsWith("#/day/"))
      : href === "#/extras"
        ? EXTRA_ROUTE_PREFIXES.some(prefix => route.startsWith(prefix))
        : href === "#/quiz" && route.startsWith("#/exam")
          ? true
          : route.startsWith(href);
    let badge = "";
    if (href === "#/cards" && due > 0) badge = `<span class="nav-badge">${due}</span>`;
    if (href === "#/awards" && unlockedAch > 0) badge = `<span class="nav-badge gold">${unlockedAch}</span>`;
    if (href === "#/" && pacing.overrideActive) badge = `<span class="nav-badge override" aria-label="Course override active">O</span>`;
    else if (href === "#/" && pacing.status === "yellow") badge = `<span class="nav-badge warn" aria-label="Catch-up needed">!</span>`;
    else if (href === "#/" && pacing.status === "red") badge = `<span class="nav-badge danger" aria-label="Recovery active">!</span>`;
    return `<a class="nav-link ${active ? "active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${IC(icon)}<span>${label}</span>${badge}</a>`;
  };
  $("#main-nav").innerHTML = NAV.map((item, i) => (i === 0 ? '<span class="nav-group">Learn</span>' : i === 3 ? '<span class="nav-group">Practice</span>' : i === 5 ? '<span class="nav-group">Your workspace</span>' : '') + link(item)).join("");
  const mobile = new Set(["#/", "#/physiology", "#/cards", "#/quiz", "#/extras"]);
  $("#bottom-nav").innerHTML = NAV.filter(n => mobile.has(n[0])).map(link).join("");
  const dark = document.documentElement.dataset.theme === "dark";
  $("#theme-toggle").innerHTML = `${IC(dark ? "sun" : "moon")}<span>${dark ? "Light mode" : "Dark mode"}</span>`;
  positionNavIndicator();
  renderXP();
}
/* Sidebar selection pill that springs from the old active item to the new one.
   Degrades to an instant jump without the spring engine; leaves the CSS pill in
   place (no .has-ind) if anything here fails. */
let _navIndPos = null;
function positionNavIndicator() {
  try {
    const nav = $("#main-nav"); if (!nav) return;
    const active = nav.querySelector(".nav-link.active");
    let ind = nav.querySelector(".nav-ind");
    if (!active || !active.offsetHeight) {   // no selection, or sidebar hidden (mobile)
      if (ind) ind.style.opacity = "0";
      nav.classList.remove("has-ind");
      return;
    }
    if (!ind) { ind = document.createElement("div"); ind.className = "nav-ind"; nav.insertBefore(ind, nav.firstChild); }
    nav.classList.add("has-ind");
    const top = active.offsetTop, height = active.offsetHeight;
    if (_navIndPos && _navIndPos.top === top && _navIndPos.height === height) {
      ind.style.top = top + "px"; ind.style.height = height + "px"; ind.style.opacity = "1";
      return;                                // nav re-rendered without a selection change
    }
    if (nav._indS) { nav._indS.forEach(s => s.stop()); nav._indS = null; }
    ind.style.opacity = "1";
    const hasPrev = !!(_navIndPos && _navIndPos.height);
    const from = hasPrev ? _navIndPos : { top: top, height: height };
    ind.style.top = from.top + "px"; ind.style.height = from.height + "px";
    if (hasPrev && window.Spring && !window.prefersReducedMotion()) {
      const topS = new window.Spring(from.top, { response: 0.34, bounce: 0.16, onUpdate: v => ind.style.top = v + "px" });
      const hS = new window.Spring(from.height, { response: 0.34, bounce: 0.16, onUpdate: v => ind.style.height = v + "px" });
      nav._indS = [topS, hS];
      topS.setTarget(top); hS.setTarget(height);
    } else {
      ind.style.top = top + "px"; ind.style.height = height + "px";
    }
    _navIndPos = { top: top, height: height };
  } catch (err) { /* leave the CSS pill as-is */ }
}
/* Instant, uniform press feedback on pointer-down for every tappable control. */
(function () {
  const SEL = ".btn,.nav-link,.link-card,.task,.q-opt,.chip,.badge,.ex-step,.day-select-button,.card-day-toggle,.fc-rate button,.deck-tabs a,.daily-deck-tabs a";
  document.addEventListener("pointerdown", e => {
    const el = e.target.closest && e.target.closest(SEL);
    if (!el || el.disabled || el.classList.contains("pressing")) return;
    el.classList.add("pressing");
    const clear = () => el.classList.remove("pressing");
    el.addEventListener("pointerup", clear, { once: true });
    el.addEventListener("pointercancel", clear, { once: true });
    el.addEventListener("pointerleave", clear, { once: true });
  }, { passive: true });
})();

function viewExtras() {
  const pacing = pacingState();
  const destinations = [
    ["#/surgery", "scalpel", "Surgeries", "Twelve operative modules from indication through technique, failure modes and rescue."],
    ["#/viva", "grad", "Viva Circuit", "Practise structured oral cases and defend your reasoning."],
    ["#/anatomy", "book", "Anatomy Review", "Review operative anatomy, relationships and surgical hazards."],
    ["#/exercises", "puzzle", "Interactive", "Work through hands-on identification and sequencing exercises."],
    ["#/trials", "scope", "Trials", "Learn the landmark evidence that shapes cardiac surgery decisions."],
    ["#/crisis", "shield", "Crisis Rooms", "Manage evolving emergencies and see the consequences of each move."],
    ["#/physiology", "activity", "Physiology Labs", "Manipulate live models for hemodynamics, rhythm, bypass and support."],
    ["#/angiography", "scope", "Angiography", "Read coronary projections, interrogate lesions and translate them into a surgical target plan.", ["angiography", "coronary-angiography"]]
  ];
  $("#main").innerHTML = `
    <div class="advanced-head">
      <span class="eyebrow">Extended training</span>
      <h1>Extras</h1>
      <p>Open a focused training module beyond your daily plan and core practice queues.</p>
    </div>
    ${pacingStatusHTML(pacing, activeStudyDay())}
    <div class="command-grid">
      ${destinations.map(([href, icon, title, description, source]) => {
        const allowed = !source || canAccessSource(source[0], source[1], "browse");
        const inner = `
          <span>${IC(icon)}</span>
          <div><b>${title}</b><p>${description}</p></div>
          ${IC(allowed ? "chevR" : "lock")}`;
        return allowed
          ? `<a class="command-card" href="${href}">${inner}</a>`
          : `<div class="command-card pacing-locked-card" aria-disabled="true">${inner}</div>`;
      }).join("")}
    </div>`;
}
function renderXP() {
  const w = $("#xp-widget"); if (!w) return;
  const xp = xpTotal(), li = levelInfo(xp), st = streakCount();
  w.innerHTML = `
    <div class="xp-top">
      <div class="lvl-badge">${li.n}</div>
      <div class="xp-meta">
        <div class="xp-title">${li.title}</div>
        <div class="xp-sub">${xp.toLocaleString()} XP${li.max ? "" : " · " + li.toNext + " to next"}</div>
      </div>
      <div class="xp-flame ${st > 0 ? "lit" : ""}" title="${st}-day streak">${IC("flame")}<b>${st}</b></div>
    </div>
    <div class="bar xp-bar"><span style="width:${li.pct}%"></span></div>`;
}

/* ---------- dashboard ---------- */
const CARDIAC_SURGERY_FACTS = [
  "The heart-lung machine can temporarily do the work of both the heart and lungs, giving the surgeon a quiet, bloodless field inside the heart.",
  "The left internal thoracic artery is a prized coronary bypass graft because it can remain open for decades and is unusually resistant to atherosclerosis.",
  "During cardioplegic arrest, the heart is deliberately stopped and protected—then usually resumes beating once it is rewarmed and coronary blood flow returns.",
  "A median sternotomy provides access to nearly every surface of the heart through a single midline incision.",
  "Modern mechanical heart valves are built to last for decades, while tissue valves trade some durability for freedom from lifelong anticoagulation in many patients.",
  "Coronary bypass grafting reroutes blood around a blockage; it does not remove the plaque from the native coronary artery.",
  "The first successful use of a heart-lung machine for open-heart surgery was reported by John Gibbon in 1953.",
  "Surgeons can cool the body during complex aortic surgery to reduce metabolism and help protect the brain and other organs.",
  "Tiny air bubbles matter in cardiac surgery, which is why meticulous de-airing is a formal step before the heart is allowed to eject again.",
  "The heart's own blood supply arises just above the aortic valve from two small openings called the coronary ostia.",
  "Some coronary operations are performed on a beating heart, using stabilizers to quiet only the small area where the graft is sewn.",
  "A transesophageal echocardiogram gives the operating team a real-time view of valve function, heart filling, and the result of a repair before leaving the operating room.",
  "The surgeon's knots in coronary bypass surgery secure sutures finer than a human hair around vessels only a few millimetres wide.",
  "In a valve-sparing aortic root replacement, the diseased aorta is replaced while the patient's own aortic valve is preserved and reimplanted inside the graft."
];

function cardiacSurgeryFactForToday(date = new Date()) {
  const calendarDay = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return CARDIAC_SURGERY_FACTS[calendarDay % CARDIAC_SURGERY_FACTS.length];
}

function viewDashboard() {
  const pacing = pacingState();
  if (pacing.status === "unenrolled") {
    $("#main").innerHTML = `
      <div class="hero">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-body"><span class="pill cyan">14-DAY COURSE</span>
          <h1 style="margin-top:8px">A clearer view of<br>cardiac surgery.</h1>
          <p class="muted">Your course clock will begin only when you choose Start Course. Browsing this app does not create a start date or make you fall behind.</p>
          <button class="btn mt" id="start-course">Start Course</button>
        </div>${ring(0)}</div>
      ${pacingWarningHTML()}
      <div class="card"><h2>${IC("map")} What starts with the course clock?</h2>
        <p class="muted">Daily pacing, catch-up guidance, and recovery locks. Your study data remains on this device.</p>
        <div class="action-row"><a class="btn secondary" href="#/plan">Preview the 14-day plan</a>
          <a class="btn secondary" href="#/physiology">Explore physiology labs →</a></div></div>`;
    $("#start-course").onclick = () => {
      if (!startCourse()) { pacingDataHealth = { ok: false, reason: "write", key: "enrollment" }; viewDashboard(); return; }
      initializePacing();
      route();
    };
    return;
  }
  const scheduledDay = +(pacing.scheduledDay || planDay());
  const day = activeStudyDay();
  const dayInfo = window.CURRICULUM[day - 1];
  const done = doneLessons();
  const lessons = lessonsForDay(day);
  const exs = exercisesForDay(day);
  const advanced = advancedForDay(day);
  const signedOps = Store.get("surgery_read", {}), crisisDone = Store.get("crisis_done", {});
  const due = dueCards().length;
  const fresh = newCards().length;
  const allDone = Object.keys(done).length;
  const pct = Math.round(100 * allDone / (window.ALL_LESSONS.length || 1));
  const greet = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const li = levelInfo(xpTotal());
  const qd = questsDoneToday();

  const taskRow = (href, icon, title, sub, isDone, xpTag, locked) => {
    const inner = `
      <span class="t-icon">${IC(isDone ? "check" : icon)}</span>
      <span class="t-body"><span class="t-title">${title}</span><br><span class="t-sub">${sub}</span></span>
      ${xpTag && !isDone ? `<span class="xp-tag">+${xpTag} XP</span>` : ""}
      <span class="t-go">${IC(locked ? "lock" : "chevR")}</span>`;
    return locked
      ? `<div class="task pacing-locked-card" aria-disabled="true">${inner}</div>`
      : `<a class="task ${isDone ? "done" : ""}" href="${href}">${inner}</a>`;
  };

  let tasks = taskRow("#/day/" + day, "target", "Day " + day + " connected circuit", "Lessons + anatomy + operation + evidence + Crisis Room + viva + linked cards", false, 0);
  tasks += lessons.map(l => taskRow("#/lesson/" + l.id, "book", l.title, `Lesson · ~${l.minutes} min · ${l.chunks.length} micro-chunks`, !!done[l.id], 40)).join("");
  if (day === 5 && window.ANGIOGRAPHY) {
    const angioRead = Store.get("angio_read", {});
    const angioChapters = window.ANGIOGRAPHY.chapters || [];
    const angioDone = angioChapters.length > 0 && angioChapters.every(chapter => angioRead[chapter.id]);
    tasks += taskRow("#/angiography", "scope", "Coronary Angiography Intensive", `${angioChapters.length} chapters · projection atlas · staged image cases · structured readout`, angioDone, 0,
      !canAccessSource("angiography", "coronary-angiography", "browse"));
  }
  tasks += exs.map(e => taskRow("#/exercise/" + e.id, "puzzle", e.title, e.type === "order" ? "Interactive · put the steps in order" : "Interactive · click the anatomy", !!exDone()[e.id], 30,
    !canAccessSource("exercise", e.id, "browse"))).join("");
  tasks += advanced.operations.map(o => taskRow(o.route, "scalpel", o.title, "Operative article · indication → technique → rescue", !!signedOps[o.id], 50,
    !canAccessSource("surgery", o.id, "browse"))).join("");
  tasks += advanced.labs.map(lab => taskRow(lab.route, "activity", lab.title, "Physiology lab · manipulate variables and explain the coupled signals", false, 0,
    !canAccessSource("physiology", lab.id, "browse"))).join("");
  tasks += advanced.crises.map(crisis => taskRow(crisis.route, "shield", crisis.title, "Crisis run · decisions under an evolving hemodynamic trace", !!crisisDone[crisis.id], 70,
    !canAccessSource("crisis", crisis.id, "browse"))).join("");
  if (due + fresh > 0) tasks += taskRow("#/cards", "cards", "Spaced repetition", `${due} due review${due === 1 ? "" : "s"} · ${fresh} new card${fresh === 1 ? "" : "s"} — never skip this`, false, 0);
  if (unlockedQuestions().some(q => q.day === day)) tasks += taskRow("#/quiz/day/" + day, "quiz", "Daily MCQ set", "Test yourself on today's completed lessons (retrieval practice)", false, 0);
  if (day >= 3) tasks += taskRow("#/quiz/weak", "target", "Weakness drill", "Re-attempts questions you have missed before", false, 0);
  if (day === 14) {
    tasks = taskRow("#/exam", "grad", "MOCK ROYAL COLLEGE EXAM", "Up to 75 questions across all topics — now re-weighted toward decision-making", false, 250) + tasks;
  }

  const questRows = questDefs().map(q => {
    const doneQ = !!qd[q.id] || q.val >= q.target;
    return `<div class="quest ${doneQ ? "done" : ""}">
      <span class="quest-ico">${doneQ ? "✅" : q.icon}</span>
      <span class="quest-body"><span class="quest-label">${q.label}</span>
      <span class="bar sm"><span style="width:${Math.round(100 * q.val / q.target)}%"></span></span></span>
      <span class="quest-val">${q.val}/${q.target}</span>
      <span class="xp-tag">+${q.xp}</span></div>`;
  }).join("") + (isBehind(pacing) ? `<div class="quest pacing-catchup">
      <span class="quest-ico">${pacing.status === "red" ? "⛔" : "⚠"}</span>
      <span class="quest-body"><span class="quest-label">Catch-up Day ${day} to ${Math.round(pacingThreshold(pacing))}%</span>
      <span class="bar sm"><span style="width:${Math.min(100, Math.round(100 * pacingScore(pacingDayProgress(day)) / pacingThreshold(pacing)))}%"></span></span></span>
      <span class="quest-val">${Math.round(pacingScore(pacingDayProgress(day)))}%</span>
      <span class="pill">No XP</span></div>` : "");
  const remainingDays = Math.max(0, 15 - +(pacing.elapsedDay || elapsedPlanDay()));

  $("#main").innerHTML = `
    <div class="hero ${pacing.status === "yellow" ? "pacing-yellow" : pacing.status === "red" ? "pacing-red" : ""}">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="hero-body">
        <span class="pill ${pacing.status === "red" ? "pacing-red" : pacing.status === "yellow" ? "pacing-yellow" : "cyan"}">${isBehind(pacing) ? `Scheduled Day ${scheduledDay} · Catch-up Day ${day}` : `Day ${day} of 14`} · ${esc(dayInfo.theme)}</span>
        <h1 style="margin-top:8px">${greet}.<br>Let’s build your next decision.</h1>
        <p class="muted">${esc(dayInfo.tagline)}</p>
        <div class="studio-continue"><a class="btn" href="${lessons.find(l => !done[l.id]) ? "#/lesson/" + lessons.find(l => !done[l.id]).id : "#/day/" + day}">Continue learning →</a></div>
        <nav class="studio-timeline" aria-label="Course days">${window.CURRICULUM.map(d => `<a href="#/day/${d.day}" class="${d.day === day ? "current" : ""}" aria-label="Day ${d.day}">${d.day}</a>`).join("")}</nav>
        <div class="hero-level">
          <div class="lvl-badge">${li.n}</div>
          <div style="flex:1;min-width:120px">
            <div class="xp-title">${li.title} · ${xpTotal().toLocaleString()} XP</div>
            <div class="bar xp-bar"><span style="width:${li.pct}%"></span></div>
          </div>
        </div>
      </div>
      ${ring(pct)}
      <p class="hero-fact"><b>Cardiac surgery fact:</b> ${esc(cardiacSurgeryFactForToday())}</p>
    </div>
    ${pacingStatusHTML(pacing, day)}
    ${window.Daily ? Daily.summaryHTML(day) : ""}
    <div class="stat-row">
      <div class="stat"><div class="v" data-count="${due}">0</div><div class="l">Cards due</div></div>
      <div class="stat"><div class="v">${streakCount()}${streakCount() > 0 ? ` <span class="stat-flame">${IC("flame")}</span>` : ""}</div><div class="l">Day streak</div></div>
      <div class="stat"><div class="v">${allDone}/${window.ALL_LESSONS.length}</div><div class="l">Lessons done</div></div>
      <div class="stat"><div class="v" data-count="${totalAnswered()}">0</div><div class="l">Questions answered</div></div>
    </div>
    <div class="command-grid">
      <a class="command-card surgery" href="#/surgery"><span>${IC("scalpel")}</span><div><b>Operate the case</b><p>Twelve operative modules from indication through technique, failure modes and rescue.</p></div>${IC("chevR")}</a>
      <a class="command-card physiology" href="#/physiology"><span>${IC("activity")}</span><div><b>Move the physiology</b><p>Fourteen workstations spanning loops, ECG, CPB, cardioplegia, support, hemostasis and operative monitoring.</p></div>${IC("chevR")}</a>
      <a class="command-card crisis" href="${advanced.crises[0] ? advanced.crises[0].route : "#/crisis"}"><span>${IC("shield")}</span><div><b>Run today's Crisis Room</b><p>Branching decisions, consequences, rescue and a structured debrief.</p></div>${IC("chevR")}</a>
    </div>
    <div class="card">
      <h2>${IC("zap")} Daily quests</h2>
      ${questRows}
    </div>
    <div class="card">
      <h2>${IC("target")} Today's mission</h2>
      <p class="muted small">Built on what works: <b>chunking</b> (short lessons), <b>retrieval practice</b> (checkpoints &amp; MCQs), <b>spaced repetition</b> (flashcards), and <b>dual coding</b> (diagrams + mnemonics).</p>
      ${tasks}
    </div>
    <div class="card">
      <h2>${IC("bulb")} ${remainingDays ? `How to use your ${remainingDays} remaining course day${remainingDays === 1 ? "" : "s"}` : "How to keep using the course after Day 14"}</h2>
      <ol class="small muted" style="padding-left:20px;margin:6px 0">
        <li><b>Flashcards first</b> — clear your due reviews before anything new. This is non-negotiable for retention.</li>
        <li><b>Lessons</b> — short chunks with checkpoints. Answer every checkpoint from memory before peeking.</li>
        <li><b>Interactives + MCQs</b> — same-day testing roughly doubles retention vs re-reading.</li>
        <li><b>Done early?</b> Hit the weakness drill, not new material.</li>
      </ol>
    </div>
    `;
  countUpAll();
}

function courseOverridePanelHTML(pacing) {
  const override = adminOverrideState();
  const warning = override.warning ? `<p class="override-message error" role="alert">${esc(override.warning)}</p>` : "";
  const notice = adminOverrideNotice ? `<p class="override-message" role="status">${esc(adminOverrideNotice)}</p>` : "";
  if (pacing.overrideActive) {
    return `<section class="course-override-panel active" aria-labelledby="course-override-title">
      <div class="course-override-mark" aria-hidden="true">↯</div>
      <div><h2 id="course-override-title">Course Override is active</h2>
        <p>All pacing and recovery locks are open on this device. Select any numbered day below to make it today; completed progress is preserved.</p>
        ${warning}${notice}</div>
      <button class="btn secondary" type="button" id="disable-course-override">Turn off override</button>
    </section>`;
  }
  return `<section class="course-override-panel" aria-labelledby="course-override-title">
    <div class="course-override-mark" aria-hidden="true">🔐</div>
    <div><h2 id="course-override-title">Course Override</h2>
      <p>Unlock with the local administrator password to bypass pacing locks and select a new current day. Your progress will not be reset.</p>
      ${warning}${notice}</div>
    <button class="btn secondary" type="button" id="open-course-override">Unlock override</button>
  </section>`;
}

function openCourseOverrideDialog(trigger) {
  document.querySelector(".override-dialog-backdrop")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "override-dialog-backdrop";
  backdrop.innerHTML = `<section class="override-dialog" role="dialog" aria-modal="true" aria-labelledby="override-dialog-title" aria-describedby="override-dialog-description">
    <button class="ghost-btn override-dialog-close" type="button" aria-label="Close password dialog">×</button>
    <span class="pill cyan">LOCAL ADMINISTRATOR</span>
    <h2 id="override-dialog-title">Unlock Course Override</h2>
    <p id="override-dialog-description" class="muted">This convenience password is checked only on this device. It opens pacing restrictions and enables the Plan day selector.</p>
    <form id="override-password-form" novalidate>
      <label for="override-password">Password</label>
      <input id="override-password" name="override-password" type="password" autocomplete="current-password" required>
      <p class="override-dialog-error" id="override-password-error" role="alert" aria-live="assertive"></p>
      <div class="action-row"><button class="btn" type="submit">Unlock override</button><button class="btn secondary" type="button" data-override-cancel>Cancel</button></div>
    </form>
  </section>`;
  document.body.appendChild(backdrop);
  const dialog = backdrop.querySelector(".override-dialog");
  const input = backdrop.querySelector("#override-password");
  const error = backdrop.querySelector("#override-password-error");
  const close = () => {
    input.value = "";
    backdrop.remove();
    if (trigger && document.contains(trigger)) trigger.focus();
  };
  backdrop.querySelector(".override-dialog-close").onclick = close;
  backdrop.querySelector("[data-override-cancel]").onclick = close;
  backdrop.addEventListener("click", event => { if (event.target === backdrop) close(); });
  backdrop.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialog.querySelectorAll("button:not([disabled]),input:not([disabled])"));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const form = backdrop.querySelector("#override-password-form");
  form.onsubmit = event => {
    event.preventDefault();
    const password = input.value;
    input.value = "";
    const result = setAdminOverride(true, password);
    if (!result.ok) {
      error.textContent = result.message || "Override could not be unlocked.";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    adminOverrideNotice = "Override unlocked. Select a numbered day to rebase the course clock.";
    close();
    reconcilePacingRuntime("override-enabled", true);
  };
  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    form.requestSubmit();
  });
  requestAnimationFrame(() => input.focus());
}

function viewPlan() {
  const pacing = pacingState(), day = +(pacing.scheduledDay || planDay()), active = activeStudyDay();
  const done = doneLessons(), ex = exDone();
  const chip = (href, label, complete, allowed) => allowed
    ? `<a class="chip ${complete ? "done" : ""}" href="${href}">${label}</a>`
    : `<span class="chip pacing-locked-card" aria-disabled="true">${IC("lock")} ${label}</span>`;
  const rows = window.CURRICULUM.map(d => {
    const ls = lessonsForDay(d.day), exs = exercisesForDay(d.day);
    const advanced = advancedForDay(d.day), signed = Store.get("surgery_read", {}), crisisDone = Store.get("crisis_done", {});
    const allDone = d.day === 14 ? Store.get("examCompleted", false) : ls.length && ls.every(l => done[l.id]);
    const coreAllowed = canAccessCoreDay(d.day);
    const cls = `${d.day === day ? "current " : ""}${d.day === active && isBehind(pacing) ? "pacing-active " : ""}${allDone ? "done " : ""}${!coreAllowed ? "locked pacing-blocked" : ""}`;
    const dayCards = window.CardCatalog ? CardCatalog.forDay(d.day) : (window.FLASHCARDS || []).filter(c => c.day === d.day);
    const activeCards = filterPacingCards(dayCards.filter(c => cardGateUnlocked(c, done, Store.get("surgery_done", {}))), "study").length;
    const cardsOn = dayCardsEnabled(d.day);
    const progress = pacingDayProgress(d.day);
    const chips = chip("#/day/" + d.day, `${IC("target")} Connected day circuit`, false, coreAllowed) +
      ls.map(l => chip("#/lesson/" + l.id, `${done[l.id] ? IC("check") : IC("book")} ${esc(l.short || l.title)}`, !!done[l.id], coreAllowed)).join("") +
      exs.map(e => chip("#/exercise/" + e.id, `${ex[e.id] ? IC("check") : IC("puzzle")} ${esc(e.short || e.title)}`, !!ex[e.id],
        canAccessSource("exercise", e.id, "browse"))).join("") +
      advanced.operations.map(o => chip(o.route, `${IC("scalpel")} ${esc(o.title)}`, !!signed[o.id],
        canAccessSource("surgery", o.id, "browse"))).join("") +
      advanced.labs.map(lab => chip(lab.route, `${IC("activity")} ${esc(lab.title)}`, false,
        canAccessSource("physiology", lab.id, "browse"))).join("") +
      advanced.crises.map(crisis => chip(crisis.route, `${IC("shield")} ${esc(crisis.title)}`, !!crisisDone[crisis.id],
        canAccessSource("crisis", crisis.id, "browse"))).join("") +
      (d.day === 5 && window.ANGIOGRAPHY ? chip("#/angiography", `${IC("scope")} Angiography intensive`, false,
        canAccessSource("angiography", "coronary-angiography", "browse")) : "") +
      (d.day === 14 ? chip("#/exam", `${IC("grad")} Written capstone`, !!Store.get("examCompleted", false), coreAllowed) : "");
    const dayNumber = pacing.overrideActive
      ? `<button class="day-num day-select-button" type="button" data-select-course-day="${d.day}" aria-label="Make Day ${d.day} the current course day"${d.day === day ? ' aria-current="date"' : ""}>${d.day}</button>`
      : `<div class="day-num" aria-hidden="true">${d.day}</div>`;
    return `<div class="day-row ${cls}" data-tour-day="${d.day}">
      ${dayNumber}
      <div style="flex:1;min-width:0">
        <div class="day-title">${esc(d.theme)}</div>
        <div class="day-theme">${esc(d.tagline)} · <b>${Math.round(pacingScore(progress))}% required-day pacing</b></div>
        <div class="chip-row">${chips}</div>
      </div>
      <button class="card-day-toggle ${cardsOn && activeCards ? "on" : ""}" type="button" role="switch"
        aria-checked="${cardsOn && activeCards ? "true" : "false"}" data-card-day="${d.day}"
        ${activeCards && coreAllowed ? "" : "disabled"} title="${activeCards && coreAllowed ? "Include or exclude Day " + d.day + " cards from review" : (d.day === 14 ? "Complete recovery and submit the capstone exam to activate these cards" : "Complete or regain access to this day to activate its cards")}">
        <span class="switch-track" aria-hidden="true"><span></span></span>
        <span class="switch-label">${activeCards && coreAllowed ? (cardsOn ? "Cards on" : "Cards off") : "Cards locked"} · ${dayCards.length} connected</span>
      </button></div>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>The 14-Day Plan</h1>
    <p>A mechanism-first spiral from anatomy to operative strategy, bypass, critical care and an integrated capstone. Core lessons build the map; surgeries, physiology labs and crisis scenarios force you to use it.</p></div></div>
    ${courseOverridePanelHTML(pacing)}
    ${pacingStatusHTML(pacing, active)}
    <div class="card">${rows}</div>`;
  const unlock = document.querySelector("#open-course-override");
  if (unlock) unlock.onclick = () => openCourseOverrideDialog(unlock);
  const disable = document.querySelector("#disable-course-override");
  if (disable) disable.onclick = () => {
    const result = setAdminOverride(false);
    adminOverrideNotice = result.ok ? "Override turned off. Normal pacing rules are active." : (result.message || "Override could not be turned off.");
    reconcilePacingRuntime("override-disabled", true);
  };
  document.querySelectorAll("[data-select-course-day]").forEach(button => button.onclick = () => {
    const selected = +button.dataset.selectCourseDay;
    const result = rebaseCourseToDay(selected);
    adminOverrideNotice = result.ok
      ? `Day ${selected} is now today. The course will advance from ${result.startedOn}; completed progress was preserved.${result.warning ? " " + result.warning : ""}`
      : (result.message || "The selected day could not be saved.");
    reconcilePacingRuntime("day-rebased", true);
  });
  document.querySelectorAll("[data-card-day]").forEach(button => button.onclick = () => {
    const cardDay = +button.dataset.cardDay;
    setDayCardsEnabled(cardDay, !dayCardsEnabled(cardDay));
    viewPlan();
    renderNav();
  });
}

/* ---------- lesson player ---------- */
const player = { id: null, idx: 0, answered: {} };
function safePartId(value) {
  return String(value == null ? "part" : value).toLowerCase().replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "part";
}
function viewLesson(id) {
  const l = lessonById(id);
  if (!l) { location.hash = "#/"; return; }
  if (!canAccessCoreDay(l.day)) { renderPacingLock({ reason: `Day ${l.day} is paused until the active catch-up day reaches its threshold.` }); return; }
  if (player.id !== id) { player.id = id; player.idx = window.StaffTour?.lessonIndex(id) || 0; player.answered = {}; }
  renderChunk();
}
function renderChunk() {
  const l = lessonById(player.id);
  if (!l || !canAccessCoreDay(l.day)) { renderPacingLock({ reason: "Recovery status changed before the next lesson step." }); return; }
  const n = l.chunks.length, i = player.idx;
  if (i >= n) { return lessonComplete(l); }
  const ch = l.chunks[i];
  const pct = Math.round(100 * i / n);
  let body = "";
  if (ch.type === "checkpoint") {
    const a = player.answered[i];
    body = `<span class="pill cyan">${IC("target")} Checkpoint — answer from memory</span>
      <h2 style="margin-top:10px">${ch.q}</h2>
      ${ch.options.map((o, oi) => {
        let cls = "", dis = a !== undefined ? "disabled" : "";
        if (a !== undefined) { if (oi === ch.answer) cls = "correct"; else if (oi === a) cls = "wrong"; }
        return `<button class="q-opt ${cls}" ${dis} data-opt="${oi}"><span class="opt-key">${"ABCDE"[oi]}</span><span>${o}</span></button>`;
      }).join("")}
      ${a !== undefined ? `<div class="explain"><b>${a === ch.answer ? "✓ Correct." : "✗ Not quite — the answer is " + "ABCDE"[ch.answer] + "."}</b> ${ch.explain}</div>` : ""}`;
  } else {
    body = (ch.title ? `<h2>${ch.title}</h2>` : "") + ch.html;
  }
  const figurePhase = ch.type === "checkpoint" ? (player.answered[i] === undefined ? "prompt" : "feedback") : "content";
  const figureHTML = window.Figures ?
    (i === 0 ? Figures.slot("lesson", l.id, "overview", "content") : "") +
    Figures.slot("lesson", l.id, ch.partId || ch.id || (ch.figure === true && ch.title ? safePartId(ch.title) : ("chunk:" + String(i + 1).padStart(2, "0"))), figurePhase) : "";
  const canNext = ch.type !== "checkpoint" || player.answered[i] !== undefined;
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="#/plan" aria-label="Exit lesson">${IC("chevL")} Exit</a>
      <div class="bar" aria-label="Lesson progress"><span style="width:${pct}%"></span></div>
      <span class="small muted tabular">${i + 1}/${n}</span>
    </div>
    <p class="kicker"><b>${esc(l.title)}</b> · Day ${l.day}</p>
    ${window.CardCatalog ? CardCatalog.ctaHTML("lesson", l.id) : ""}
    <div class="chunk">${body}${figureHTML}</div>
    <div class="player-nav">
      <button class="btn secondary" id="prev-chunk" ${i === 0 ? "disabled" : ""}>${IC("chevL")} Back</button>
      <button class="btn" id="next-chunk" ${canNext ? "" : "disabled"}>${i === n - 1 ? "Finish lesson" : "Next"} ${IC("chevR")}</button>
    </div>`;
  $("#prev-chunk").onclick = () => { player.idx--; renderChunk(); window.scrollTo(0, 0); };
  $("#next-chunk").onclick = () => { player.idx++; renderChunk(); window.scrollTo(0, 0); };
  document.querySelectorAll(".q-opt").forEach(b => b.onclick = () => {
    if (!canAccessCoreDay(l.day)) { renderPacingLock({ reason: "Recovery status changed before this checkpoint was saved." }); return; }
    const pick = +b.dataset.opt;
    player.answered[i] = pick;
    if (pick === ch.answer) addXP(5);
    logActivity();
    renderChunk();
    window.StaffTour?.record("lesson:checkpoint", { lesson: l.id, index: i, correct: pick === ch.answer });
  });
}
window.StaffTourLesson = {
  jumpToFirstCheckpoint() {
    if (!window.StaffPreview?.active() || player.id !== "d1-coronaries") return false;
    const lesson = lessonById(player.id);
    const index = lesson?.chunks.findIndex(chunk => chunk.type === "checkpoint");
    if (index < 0) return false;
    player.idx = index; renderChunk(); return true;
  }
};
function lessonComplete(l) {
  const first = !doneLessons()[l.id];
  markLessonDone(l.id);
  checkAchievements();
  if (first) confettiBurst();
  const newCount = window.CardCatalog ? CardCatalog.count("lesson", l.id) : (window.FLASHCARDS || []).filter(c => c.lesson === l.id).length;
  const nextL = lessonsForDay(l.day).find(x => !doneLessons()[x.id]);
  $("#main").innerHTML = `<div class="card center celebrate finale">
    <div class="confetti">🎉</div>
    <h1>Lesson complete${first ? " · +40 XP" : ""}</h1>
    <p class="muted">${esc(l.title)} is in the bank.${newCount ? ` <b>${newCount} flashcards</b> on this topic are now in your spaced-repetition deck.` : ""}</p>
    <div class="mt action-row">
      ${nextL ? `<a class="btn" href="#/lesson/${nextL.id}">Next lesson ${IC("chevR")}</a>` : ""}
      <a class="btn ${nextL ? "secondary" : ""}" href="#/cards/source/lesson/${encodeURIComponent(l.id)}">Review all ${newCount} lesson cards</a>
      <a class="btn secondary" href="#/">Dashboard</a>
    </div></div>`;
  player.id = null;
  renderNav();
}

/* ---------- flashcards ---------- */
const fc = { queue: [], i: 0, flipped: false, done: 0, again: 0, deck: "all", day: null, type: null, sourceType: null, sourceId: null };
function cardDeck(c) {
  const type = cardSourceType(c);
  return type === "lesson" ? "curriculum" : type === "anatomy" ? "anatomy" : type === "surgery" ? "surgery" : "modules";
}
function flashcardBackRoute() {
  if (fc.day) return "#/day/" + fc.day;
  if (fc.sourceType && window.CardCatalog) {
    const source = CardCatalog.source(fc.sourceType, fc.sourceId);
    return source ? source.route : "#/cards";
  }
  return "#/";
}
function enrichmentControlHTML() {
  const release = retrievalReleaseSummary();
  const intakeRemaining = Math.max(0, RETRIEVAL_NEW_CARDS_PER_DAY - (daily().newCards || 0));
  const staged = release.pending.length
    ? ` · ${release.pending.length} rebuilt source batch${release.pending.length === 1 ? "" : "es"} staged for later`
    : "";
  return `<div class="retrieval-controls"><label class="enrichment-toggle small"><input type="checkbox" ${enrichmentEnabled() ? "checked" : ""} onchange="setEnrichmentEnabled(this.checked)"> Include new enrichment cards</label><span class="small muted">Normal review admits up to ${intakeRemaining} new card${intakeRemaining === 1 ? "" : "s"} today${staged}. Opening a source deck introduces that source intentionally.</span></div>`;
}
function deckTabs() {
  if (fc.day && window.Daily) {
    const types = [["all", "All connected"]].concat(Daily.typesForDay(fc.day).map(t => [t, Daily.typeLabel[t]]));
    return `<div class="daily-deck-context"><div><a class="small muted" href="#/day/${fc.day}">← Day ${fc.day} circuit</a><h2>Connected retrieval deck</h2></div>
      <div class="daily-deck-tabs">${types.map(d => `<a class="${fc.type === d[0] ? "active" : ""}" href="#/cards/day/${fc.day}/${d[0]}">${d[1]}</a>`).join("")}</div></div>${enrichmentControlHTML()}`;
  }
  if (fc.sourceType && window.CardCatalog) {
    const source = CardCatalog.source(fc.sourceType, fc.sourceId);
    const cards = CardCatalog.forSource(fc.sourceType, fc.sourceId), states = srsData();
    const count = cards.filter(card => cardTierEligible(card, states)).length;
    return `<div class="daily-deck-context"><div><a class="small muted" href="${source ? source.route : "#/cards"}">← Back to source</a><h2>${source ? esc(source.title) : esc(fc.sourceId)}</h2><p class="small muted">Complete source deck · ${count} available card${count === 1 ? "" : "s"}</p></div></div>${enrichmentControlHTML()}`;
  }
  const names = [["all","All"],["curriculum","Curriculum"],["guidelines","Guidelines & numbers"],["anatomy","Anatomy"],["surgery","Surgery"],["modules","Modules"]];
  return `<div class="deck-tabs" aria-label="Flashcard deck filter">${names.map(d => `<a class="${fc.deck === d[0] ? "active" : ""}" href="#/cards/${d[0]}">${d[1]}</a>`).join("")}</div>${enrichmentControlHTML()}`;
}
function orderedCompleteDeck(pool) {
  const states = srsData(), now = Date.now();
  const due = [], fresh = [], later = [];
  pool.forEach(card => {
    const state = states[card.id];
    if (!state) fresh.push(card);
    else if ((state.due || 0) <= now) due.push(card);
    else later.push(card);
  });
  return shuffle(due).concat(shuffle(fresh), shuffle(later));
}
function cardSessionFilter() {
  const purpose = fc.sourceType ? "full-deck" : fc.day ? "study" : "review";
  return { purpose: purpose, states: srsData(), now: Date.now() };
}
function revalidateCardQueue() {
  if (fc.i >= fc.queue.length) return false;
  const remaining = filterPacingCards(fc.queue.slice(fc.i), cardSessionFilter());
  fc.queue = fc.queue.slice(0, fc.i).concat(remaining);
  return fc.i < fc.queue.length;
}
function buildQueue() {
  const parts = (location.hash || "#/cards/all").slice(2).split("/");
  if (parts[1] === "day" && window.Daily) {
    fc.day = +parts[2]; fc.type = parts[3] || "all"; fc.deck = "day"; fc.sourceType = null; fc.sourceId = null;
    const sourcePool = fc.type === "all" ? Daily.allCardsFor(fc.day) : Daily.cardsFor(fc.day, fc.type);
    const states = srsData();
    const pool = filterPacingCards(sourcePool.filter(card => cardTierEligible(card, states)), { purpose: "study", states: states, now: Date.now() });
    fc.queue = orderedCompleteDeck(pool); fc.i = 0; fc.flipped = false; fc.done = 0; fc.again = 0;
    return;
  }
  if (parts[1] === "source" && window.CardCatalog && parts[2] && parts[3]) {
    fc.day = null; fc.type = null; fc.deck = "source"; fc.sourceType = decodeURIComponent(parts[2]); fc.sourceId = decodeURIComponent(parts[3]);
    const states = srsData();
    const nativePool = CardCatalog.forSource(fc.sourceType, fc.sourceId).filter(card => cardGateUnlocked(card) && cardTierEligible(card, states));
    fc.queue = window.StaffTour?.isCardSample()
      ? [nativePool.find(card => card.claimIds?.some(id => id.endsWith(".concept"))) || nativePool[0]].filter(Boolean)
      : orderedCompleteDeck(filterPacingCards(nativePool,
        { purpose: "full-deck", states: states, now: Date.now() })); fc.i = window.StaffTour?.cardSampleIndex() || 0; fc.flipped = false; fc.done = 0; fc.again = 0;
    return;
  }
  fc.day = null; fc.type = null; fc.sourceType = null; fc.sourceId = null;
  fc.deck = ["all","curriculum","guidelines","anatomy","surgery","modules"].includes(parts[1]) ? parts[1] : "all";
  const inDeck = c => fc.deck === "all" || (fc.deck === "guidelines" ? isGuidelineNumberCard(c) : cardDeck(c) === fc.deck);
  const due = shuffle(dueCards().filter(inDeck));
  const remainingIntake = Math.max(0, RETRIEVAL_NEW_CARDS_PER_DAY - (daily().newCards || 0));
  const fresh = shuffle(newCards().filter(inDeck)).slice(0, remainingIntake);
  fc.queue = filterPacingCards(due.concat(fresh), { purpose: "review", states: srsData(), now: Date.now() });
  fc.i = 0; fc.flipped = false; fc.done = 0; fc.again = 0;
}
function viewCards() {
  buildQueue();
  if (!fc.queue.length) {
    const emptyStates = srsData();
    const total = fc.day && window.Daily ? filterPacingCards(Daily.cardsFor(fc.day, fc.type).filter(card => cardTierEligible(card, emptyStates)), { purpose: "study", states: emptyStates, now: Date.now() }).length
      : fc.sourceType && window.CardCatalog ? filterPacingCards(CardCatalog.forSource(fc.sourceType, fc.sourceId).filter(card => cardGateUnlocked(card) && cardTierEligible(card, emptyStates)), { purpose: "full-deck", states: emptyStates, now: Date.now() }).length
      : unlockedCards().filter(c => cardTierEligible(c, srsData()) && (fc.deck === "all" || (fc.deck === "guidelines" ? isGuidelineNumberCard(c) : cardDeck(c) === fc.deck))).length;
    const learning = Object.values(srsData()).filter(c => c.st === "lrn" || c.st === "rel").length;
    $("#main").innerHTML = `<div class="page-head"><div><h1>Flashcards</h1><p>One scheduler for curriculum facts, anatomy cloze cards and signed-off operations.</p></div></div>${deckTabs()}
    <div class="card empty">${IC("check")}<h2>All clear! 🧠</h2>
    <p>No cards due right now. ${total ? `You're tracking <b>${total}</b> unlocked cards — more unlock each curriculum day.` : "Cards unlock as you progress through the days."}${learning ? ` <b>${learning}</b> are still in their learning steps and will reappear within minutes.` : ""}</p>
    <p class="small muted">Come back later today or tomorrow — the scheduler knows when you're about to forget.</p>
    <a class="btn mt" href="${flashcardBackRoute()}">Back</a></div>`;
    return;
  }
  renderCard();
}
function cardStatePill(c, states) {
  const s = getCardState(c.id, states);
  if (!s) return `<span class="state-dot new" aria-hidden="true"></span>New card`;
  if (s.st === "rev") return `<span class="state-dot review" aria-hidden="true"></span>Review · ivl ${s.iv}d`;
  return `<span class="state-dot learning" aria-hidden="true"></span>${s.st === "rel" ? "Relearning" : "Learning"}`;
}
function cardGradeGuide(c) {
  if (c.archetype === "bounded-set") {
    return `<div class="fc-grade-guide"><b>Set grading:</b> Again = two or more items missing · Hard = one missing · Good = complete with hesitation · Easy = complete and prompt.</div>`;
  }
  if (c.archetype === "ordered-sequence") {
    return `<div class="fc-grade-guide"><b>Sequence grading:</b> any ordering error caps the rating at Hard. Again = two or more phases missing; Good/Easy require the complete order.</div>`;
  }
  return "";
}
function renderCard() {
  revalidateCardQueue();
  if (fc.i >= fc.queue.length) {
    $("#main").innerHTML = `<div class="card center celebrate finale">
      <div class="confetti">🧠</div><h1>Session complete</h1>
      <p class="muted">${fc.done} card${fc.done === 1 ? "" : "s"} reviewed${fc.again ? `, ${fc.again} in learning (they'll return in minutes)` : ""}.</p>
      <div class="mt action-row">
        <a class="btn" href="${flashcardBackRoute()}">Back</a>
        <button class="btn secondary" onclick="viewCards()">Check for more</button>
      </div></div>`;
    return;
  }
  const c = fc.queue[fc.i];
  const states = srsData();
  fc.flipped = false;
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="${flashcardBackRoute()}">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * fc.i / fc.queue.length)}%"></span></div>
      <span class="small muted tabular">${fc.i + 1}/${fc.queue.length}</span>
    </div>
    ${deckTabs()}
    <div class="fc-count"><span>${cardStatePill(c, states)}</span><span>Deck: <b>${cardDeck(c)}</b></span><span>Topic: <b>${esc(c.topic)}</b></span>${c.schemaVersion === 2 ? `<span>Type: <b>${esc(String(c.archetype || "retrieval").replace(/-/g, " "))}</b></span><span>Tier: <b>${esc(c.tier || "core")}</b></span>` : ""}</div>
    <div class="fc-stage">
      <div class="fc-swipe fc-enter" id="fc-swipe">
        <div class="fc-hint again" aria-hidden="true">Again</div>
        <div class="fc-hint good" aria-hidden="true">Good</div>
        <div class="fc-card" id="fc-card" role="button" tabindex="0" aria-label="Flashcard — press to flip, swipe left or right to grade">
          <div class="fc-face"><span class="fc-topic pill cyan">Q</span><div>${c.front}</div><div class="small muted fc-flip-cue" style="font-weight:500">tap / space to flip</div></div>
          <div class="fc-face back"><span class="fc-topic pill green">A</span><div>${c.back}</div></div>
        </div>
      </div>
    </div>
    <div class="fc-controls" id="fc-controls">
      <button class="btn fc-flip-btn" style="width:100%" id="flip-btn">Show answer</button>
      <div class="fc-rate">
        <button class="fc-again" data-q="0">Again<span class="ivl">${previewIvl(c, 0, states)}</span></button>
        <button class="fc-hard" data-q="1">Hard<span class="ivl">${previewIvl(c, 1, states)}</span></button>
        <button class="fc-good" data-q="2">Good<span class="ivl">${previewIvl(c, 2, states)}</span></button>
        <button class="fc-easy" data-q="3">Easy<span class="ivl">${previewIvl(c, 3, states)}</span></button>
      </div>
    </div>
    <p class="small muted center mt fc-rate-hint">Swipe or press 1 · 2 · 3 · 4 — <b>Again</b> and <b>Good</b> also answer to a left / right flick. Be honest; the scheduler only works if you are.</p>${cardGradeGuide(c)}`;
  attachCard();
}
/* Fluid flashcard controller: spring-driven flip + 1:1 swipe-to-grade with
   velocity handoff and momentum projection. Falls back to a class toggle if
   the spring engine is unavailable. */
function attachCard() {
  const swipe = $("#fc-swipe"), card = $("#fc-card"),
        controls = $("#fc-controls"), flipBtn = $("#flip-btn");
  if (!card) return;
  const rateEl = controls.querySelector(".fc-rate");
  const rateBtns = controls.querySelectorAll(".fc-rate button");
  const hintAgain = swipe.querySelector(".fc-hint.again");
  const hintGood = swipe.querySelector(".fc-hint.good");

  if (!window.Spring) {                       // graceful, motion-free fallback
    const toggle = () => {
      fc.flipped = !fc.flipped;
      card.classList.toggle("flipped", fc.flipped);
      controls.classList.toggle("revealed", fc.flipped);
      if (fc.flipped) window.StaffTour?.record("cards:revealed");
    };
    card.onclick = e => {                       // don't flip when tapping a link/summary/button
      if (e.target && e.target.closest && e.target.closest("a,button,summary,label,input,select,textarea,.cloze-detail")) return;
      toggle();
    };
    flipBtn.onclick = () => { if (!fc.flipped) toggle(); };
    rateBtns.forEach(b => b.onclick = () => rateAndAdvance(+b.dataset.q));
    fc.ctrl = { flip: toggle, grade: g => rateAndAdvance(g), revealed: () => fc.flipped };
    return;
  }

  card.style.transition = "none";             // JS owns the flip transform
  let flip = 0, x = 0, pressed = false, revealed = false;
  let flying = false, pendingGrade = null;
  let gradeFallback = 0;

  function finishGrade() {
    if (pendingGrade == null) return;
    const grade = pendingGrade;
    pendingGrade = null; flying = false;
    if (gradeFallback) { clearTimeout(gradeFallback); gradeFallback = 0; }
    flipS.stop(); xS.stop();
    rateAndAdvance(grade);
  }

  const flipS = new window.Spring(0, { response: 0.42, bounce: 0,
    onUpdate: v => { flip = v; drawFlip(); } });
  const xS = new window.Spring(0, { response: 0.35, bounce: 0.18,
    onUpdate: v => { x = v; drawSwipe(); },
    onRest: finishGrade });

  function drawFlip() { card.style.transform = "rotateX(" + flip + "deg)"; }
  function drawSwipe() {
    const tilt = Math.max(-8, Math.min(8, x * 0.05));
    const scale = pressed ? 0.985 : 1;
    swipe.style.transform = "translateX(" + x + "px) rotate(" + tilt + "deg) scale(" + scale + ")";
    const t = (card.getBoundingClientRect().width || 320) * 0.4;
    if (hintAgain) hintAgain.style.opacity = Math.max(0, Math.min(1, -x / t));
    if (hintGood) hintGood.style.opacity = Math.max(0, Math.min(1, x / t));
  }
  drawFlip(); drawSwipe();
  if (rateEl) rateEl.inert = true;

  function setRevealed(on) {
    revealed = on; fc.flipped = on;
    flipS.setTarget(on ? 180 : 0);
    controls.classList.toggle("revealed", on);
    if (rateEl) rateEl.inert = !on;
    flipBtn.inert = on;
    if (on) window.StaffTour?.record("cards:revealed");
  }
  function toggleFlip() { setRevealed(!revealed); }

  function flyOff(grade, velocity) {
    if (flying) return;
    flying = true; pendingGrade = grade;
    const w = window.innerWidth || 800;
    const dir = grade <= 1 ? -1 : 1;          // Again/Hard exit left, Good/Easy right
    swipe.style.transition = "opacity .14s ease";
    swipe.style.opacity = "0";
    swipe.addEventListener("transitionend", finishGrade, { once: true });
    xS.setTarget(dir * w * 0.9, velocity != null ? velocity : dir * 700);
    if (pendingGrade != null) gradeFallback = setTimeout(finishGrade, 200);
  }

  let dragging = false, moved = false, sx = 0, sy = 0, axis = null, hist = [], pid = null;
  function press(on) { pressed = on; drawSwipe(); }
  function velocity() {
    if (hist.length < 2) return 0;
    const a = hist[hist.length - 2], b = hist[hist.length - 1];
    const dt = (b.t - a.t) / 1000;
    return dt > 0 ? (b.x - a.x) / dt : 0;
  }
  /* A tap that lands on an interactive child (a link, button, or a <details> summary
     inside the answer) must behave as itself, not as a card flip/swipe. Without this the
     card captures the pointer and swallows the child's activation. */
  const isInteractive = e => !!(e.target && e.target.closest &&
    e.target.closest("a,button,summary,label,input,select,textarea,.cloze-detail"));
  card.addEventListener("pointerdown", e => {
    if (flying || isInteractive(e)) return;
    dragging = true; moved = false; axis = null;
    sx = e.clientX; sy = e.clientY; hist = [{ x: e.clientX, t: e.timeStamp }];
    press(true); xS.stop();
    try { card.setPointerCapture(e.pointerId); pid = e.pointerId; } catch (err) {}
  });
  card.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.hypot(dx, dy) > 6) { moved = true; press(false); }
    if (!moved || !revealed) return;          // only the answer side is swipeable
    if (axis == null) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (axis !== "x") return;
    if (e.cancelable) e.preventDefault();
    hist.push({ x: e.clientX, t: e.timeStamp }); if (hist.length > 6) hist.shift();
    xS.set(dx);                               // 1:1 with the finger
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; press(false);
    if (pid != null) { try { card.releasePointerCapture(pid); } catch (err) {} pid = null; }
    if (!moved) { toggleFlip(); return; }     // it was a tap
    if (!revealed || axis !== "x") { xS.setTarget(0); return; }
    const vx = velocity();
    const projected = x + window.projectMomentum(vx, 0.99);
    if (Math.abs(projected) > (card.getBoundingClientRect().width || 320) * 0.4) flyOff(x < 0 ? 0 : 2, vx);
    else xS.setTarget(0, vx);                 // hand off velocity into the settle
  }
  card.addEventListener("pointerup", endDrag);
  card.addEventListener("pointercancel", () => { dragging = false; press(false); xS.setTarget(0); });

  flipBtn.onclick = () => { if (!revealed) setRevealed(true); };
  rateBtns.forEach(b => b.onclick = () => flyOff(+b.dataset.q));

  fc.ctrl = { flip: toggleFlip, grade: g => flyOff(g), revealed: () => revealed };
}
function rateAndAdvance(r) {
  const current = fc.queue[fc.i];
  if (!current || !filterPacingCards([current], cardSessionFilter()).length) {
    fc.queue.splice(fc.i, 1);
    renderCard();
    return;
  }
  const wasNew = !getCardState(current.id, srsData());
  const requeue = rateCard(current, r);
  if (wasNew) bumpDaily("newCards");
  fc.done++;
  if (requeue && !window.StaffTour?.isCardSample()) { fc.again++; fc.queue.push(current); }
  fc.i++; fc.flipped = false; renderCard();
  window.StaffTour?.record("cards:rated", { rating: r, card: current.id });
  const route = location.hash;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (location.hash === route) renderNav();
  }));
}
document.addEventListener("keydown", e => {
  if (!location.hash.startsWith("#/cards") || !fc.queue.length || fc.i >= fc.queue.length || !fc.ctrl) return;
  if (e.key === " " || e.key === "Enter") {
    if (/^(BUTTON|A)$/.test((e.target && e.target.tagName) || "")) return;  // let native activation run
    e.preventDefault(); fc.ctrl.flip();
  } else if (["1", "2", "3", "4"].includes(e.key) && fc.ctrl.revealed && fc.ctrl.revealed()) {
    fc.ctrl.grade(+e.key - 1);
  }
});

/* ---------- quiz ---------- */
function questionReferenceHTML(q) {
  const registry = window.QUESTION_SOURCES || {};
  const sources = (q.refs || []).map(id => registry[id]).filter(Boolean);
  const visible = q.showRefs || sources.some(source => source.type === "guideline" || source.type === "trial");
  if (!visible || !sources.length) return "";
  const items = sources.map(source => {
    const label = esc(source.citation || source.title || "Reference");
    const version = source.version ? ` <span class="muted">(${esc(source.version)})</span>` : "";
    return /^https:\/\//.test(String(source.url || ""))
      ? `<li><a href="${escAttr(source.url)}" target="_blank" rel="noopener noreferrer">${label}</a>${version}</li>`
      : `<li>${label}${version}</li>`;
  }).join("");
  return `<details class="q-references"><summary>Key reference${items.includes("</li><li>") ? "s" : ""}</summary><ul>${items}</ul></details>`;
}
function questionTeachingHTML(q, resultLabel, announce) {
  return `<div class="explain q-teaching"${announce ? ' role="status" aria-live="polite" tabindex="-1"' : ""}>
    ${resultLabel ? `<b>${resultLabel}</b>` : ""}
    <div class="q-rationale">${q.explain}</div>
    <div class="q-objective"><span>${IC("bulb")}</span><p><b>Educational objective</b>${esc(q.objective || "Use the decisive clinical findings to select the safest next step.")}</p></div>
    ${questionReferenceHTML(q)}
  </div>`;
}
const quiz = { qs: [], i: 0, score: 0, answered: null, title: "", combo: 0, mode: "standard" };
function topicList() {
  const map = {};
  (window.QUESTIONS || []).forEach(q => { (map[q.topic] = map[q.topic] || []).push(q); });
  return map;
}
function viewQuizMenu() {
  const stats = qStats(), day = activeStudyDay();
  const map = topicList();
  const unlockedIds = new Set(filterPacingQuestions(unlockedQuestions(), { purpose: "standard", stats: stats }).map(q => q.id));
  const rows = Object.entries(map).map(([topic, qs]) => {
    const unlocked = qs.filter(q => unlockedIds.has(q.id));
    const seen = qs.filter(q => stats[q.id]);
    const acc = seen.length ? Math.round(100 * seen.reduce((a, q) => a + (stats[q.id].ok / stats[q.id].seen), 0) / seen.length) : null;
    const locked = unlocked.length === 0;
    const sub = locked
      ? "Complete the linked lesson or surgery article and the active recovery step to unlock its MCQs"
      : `${unlocked.length}/${qs.length} unlocked · ${seen.length ? `${seen.length} attempted` : "not attempted"}`;
    const inner = `
      <span class="t-icon">${IC(locked ? "lock" : "quiz")}</span>
      <span class="t-body"><span class="t-title">${esc(topic)}</span><br>
      <span class="t-sub">${sub}</span></span>
      ${acc !== null ? `<span class="task-bar" title="${acc}% accuracy"><span class="task-bar-v">${acc}%</span>
        <span class="bar sm ${acc >= 70 ? "green" : ""}"><span style="width:${acc}%"></span></span></span>` : ""}
      <span class="t-go">${IC(locked ? "lock" : "chevR")}</span>`;
    return locked
      ? `<div class="task pacing-locked-card" aria-disabled="true">${inner}</div>`
      : `<a class="task" href="#/quiz/topic/${encodeURIComponent(topic)}">${inner}</a>`;
  }).join("");
  const attempted = Object.keys(stats).length;
  const overall = totalAnswered() ? Math.round(100 * totalCorrect() / totalAnswered()) : null;
  $("#main").innerHTML = `
    ${hubHero({
      accent: "accent-violet", kicker: "Assess", icon: "quiz", title: "Question Bank",
      lead: "Single-best-answer MCQs spanning core knowledge and surgery-level judgment. Every explanation teaches the mechanism and the dangerous distractor.",
      stats: [
        { v: (window.QUESTIONS || []).length, l: "Questions", count: true },
        { v: attempted, l: "Attempted", count: true },
        { v: overall === null ? "—" : overall + "%", l: "Accuracy" }
      ]
    })}
    <div class="command-grid">
      <a class="command-card" href="#/quiz/day/${day}"><span>${IC("clock")}</span><div><b>Today's set</b><p>Mixed questions drawn from your Day ${day} topics.</p></div>${IC("chevR")}</a>
      <a class="command-card crisis" href="#/quiz/weak"><span>${IC("target")}</span><div><b>Weakness drill</b><p>Re-attempts every question you have ever missed.</p></div>${IC("chevR")}</a>
      ${canAccessCoreDay(14)
        ? `<a class="command-card" href="#/exam"><span>${IC("grad")}</span><div><b>Cumulative written exam</b><p>75 questions, 90 minutes, no feedback until you submit.</p></div>${IC("chevR")}</a>`
        : `<div class="command-card pacing-locked-card" aria-disabled="true"><span>${IC("lock")}</span><div><b>Cumulative written exam</b><p>Day 14 opens after the active catch-up day.</p></div>${IC("lock")}</div>`}
    </div>
    <div class="card mt hub-tasks accent-violet"><h2>${IC("book")} By topic</h2>${rows}</div>`;
  countUpAll();
}
function startQuiz(qs, title, limit, mode) {
  quiz.mode = mode || "standard";
  qs = filterPacingQuestions(qs, { purpose: quiz.mode, stats: qStats() });
  if (!qs.length) { toast("No questions available yet."); location.hash = "#/quiz"; return; }
  quiz.qs = window.QuestionBank ? window.QuestionBank.buildBalancedBlock(qs, limit || 15) : shuffle(qs).slice(0, limit || 15);
  quiz.i = 0; quiz.score = 0; quiz.answered = null; quiz.title = title; quiz.combo = 0;
  renderQuiz();
}
function revalidateQuestionQueue() {
  if (quiz.answered !== null || quiz.i >= quiz.qs.length) return;
  const remaining = filterPacingQuestions(quiz.qs.slice(quiz.i), { purpose: quiz.mode, stats: qStats() });
  quiz.qs = quiz.qs.slice(0, quiz.i).concat(remaining);
}
function renderQuiz() {
  revalidateQuestionQueue();
  if (quiz.i >= quiz.qs.length) {
    const pct = Math.round(100 * quiz.score / quiz.qs.length);
    if (pct === 100 && quiz.qs.length >= 10) { Store.set("perfectQuiz", true); }
    if (pct >= 80) confettiBurst();
    checkAchievements();
    $("#main").innerHTML = `<div class="card center celebrate finale">
      <div class="confetti">${pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📚"}</div>
      <h1>${quiz.score}/${quiz.qs.length} (${pct}%)</h1>
      <p class="muted">${pct >= 80 ? "Strong retrieval on this set. Keep it durable with the linked cards." : pct >= 60 ? "Approaching the course benchmark — drill the ones you missed." : "Below the course benchmark today — revisit the linked lesson, then re-drill."}</p>
      <div class="mt action-row">
        <a class="btn" href="#/quiz/weak">Drill my misses</a>
        <a class="btn secondary" href="#/quiz">Question bank</a>
        <a class="btn secondary" href="#/">Dashboard</a>
      </div></div>`;
    return;
  }
  const q = quiz.qs[quiz.i], a = quiz.answered;
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="#/quiz">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * quiz.i / quiz.qs.length)}%"></span></div>
      ${quiz.combo >= 3 ? `<span class="combo-chip">${IC("flame")}×${quiz.combo}</span>` : ""}
      <span class="small muted tabular">${quiz.i + 1}/${quiz.qs.length}</span>
    </div>
    <p class="kicker"><b>${esc(quiz.title)}</b> · ${esc(q.topic)}</p>
    <div class="chunk">
      <h2 style="font-size:1.1rem">${q.stem}</h2>
      ${q.options.map((o, oi) => {
        let cls = "", dis = a !== null ? "disabled" : "";
        if (a !== null) { if (oi === q.answer) cls = "correct"; else if (oi === a) cls = "wrong"; }
        return `<button class="q-opt ${cls}" ${dis} data-opt="${oi}"><span class="opt-key">${"ABCDE"[oi]}</span><span>${o}</span></button>`;
      }).join("")}
      ${a !== null ? questionTeachingHTML(q, a === q.answer ? "✓ Correct." : "✗ The best answer is " + esc(q.options[q.answer]) + ".", true) : ""}
    </div>
    ${a !== null ? `<div class="player-nav"><span></span><button class="btn" id="next-q">${quiz.i === quiz.qs.length - 1 ? "See results" : "Next question"} ${IC("chevR")}</button></div>` : ""}`;
  document.querySelectorAll(".q-opt").forEach(b => b.onclick = () => {
    if (!filterPacingQuestions([q], { purpose: quiz.mode, stats: qStats() }).length) {
      renderPacingLock({ reason: "Recovery status changed before this question was answered." });
      return;
    }
    quiz.answered = +b.dataset.opt;
    const ok = quiz.answered === q.answer;
    if (ok) {
      quiz.score++; quiz.combo++;
      if (quiz.combo > Store.get("bestCombo", 0)) Store.set("bestCombo", quiz.combo);
      addXP(10 + (quiz.combo >= 3 ? Math.min(quiz.combo, 8) : 0));
    } else quiz.combo = 0;
    recordAnswer(q.id, ok);
    checkAchievements();
    renderQuiz();
    requestAnimationFrame(() => { const feedback = document.querySelector(".q-teaching"); if (feedback) feedback.focus(); });
  });
  if ($("#next-q")) $("#next-q").onclick = () => { quiz.i++; quiz.answered = null; renderQuiz(); window.scrollTo(0, 0); };
}

/* ---------- mock exam ---------- */
const EXAM_DRAFT_VERSION = 4;
const exam = { qs: [], perms: [], answers: [], flags: [], i: 0, end: 0, remaining: 0, timer: null, paused: true, finished: false };
function examRandomInt(max) {
  if (!Number.isInteger(max) || max < 1) return 0;
  if (window.crypto && window.crypto.getRandomValues) {
    const range = 0x100000000, limit = range - (range % max), value = new Uint32Array(1);
    do { window.crypto.getRandomValues(value); } while (value[0] >= limit);
    return value[0] % max;
  }
  return Math.floor(Math.random() * max);
}
function examShuffle(values) {
  const copy = values.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = examRandomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function seededExamShuffle(values, seed) {
  const copy = values.slice();
  let state = seed >>> 0;
  for (let i = copy.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function examSequenceQuality(sequence) {
  if (window.QuestionBank) return window.QuestionBank.sequenceQuality(sequence);
  let run = sequence.length ? 1 : 0, maxRun = run;
  const transitions = new Set();
  for (let i = 1; i < sequence.length; i++) {
    transitions.add(`${sequence[i - 1]}${sequence[i]}`);
    run = sequence[i] === sequence[i - 1] ? run + 1 : 1;
    maxRun = Math.max(maxRun, run);
  }
  return { maxRun, transitions: transitions.size };
}
function balancedExamTargets(count) {
  if (window.QuestionBank) return window.QuestionBank.balancedTargets(count, examRandomInt);
  if (count < 1) return [];
  const slots = [0, 1, 2, 3], counts = [0, 0, 0, 0];
  const base = Math.floor(count / 4);
  counts.fill(base);
  examShuffle(slots).slice(0, count % 4).forEach(slot => { counts[slot]++; });
  const pool = [];
  counts.forEach((n, slot) => { for (let i = 0; i < n; i++) pool.push(slot); });
  const minTransitions = Math.min(10, Math.max(0, count - 1));
  for (let attempt = 0; attempt < 500; attempt++) {
    const candidate = examShuffle(pool), quality = examSequenceQuality(candidate);
    if (quality.maxRun <= 2 && quality.transitions >= minTransitions) return candidate;
  }
  /* A broken/degenerate ambient RNG must not collapse into a visible answer cycle. */
  for (let seed = 1; seed <= 1000; seed++) {
    const candidate = seededExamShuffle(pool, Math.imul(count + seed, 2654435761));
    const quality = examSequenceQuality(candidate);
    if (quality.maxRun <= 2 && quality.transitions >= minTransitions) return candidate;
  }
  return seededExamShuffle(pool, Math.imul(count + 1001, 2654435761));
}
function validExamPermutation(order) {
  if (window.QuestionBank) return window.QuestionBank.validOrder(order);
  return Array.isArray(order) && order.length === 4 && order.every(Number.isInteger) &&
    order.every(index => index >= 0 && index < 4) && new Set(order).size === 4;
}
function buildExamQuestion(question, order) {
  if (window.QuestionBank) return window.QuestionBank.buildQuestion(question, order);
  if (!question || !Array.isArray(question.options) || question.options.length !== 4 ||
      !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3 ||
      !validExamPermutation(order)) return null;
  const answer = order.indexOf(question.answer);
  if (answer < 0) return null;
  return {
    ...question,
    options: order.map(index => question.options[index]),
    answer
  };
}
function permuteExamQuestion(question, target) {
  if (window.QuestionBank) return window.QuestionBank.permuteQuestion(question, target, examRandomInt);
  if (!Number.isInteger(target) || target < 0 || target > 3 || !question) return { order: null, question: null };
  const distractors = examShuffle([0, 1, 2, 3].filter(index => index !== question.answer));
  const order = new Array(4);
  order[target] = question.answer;
  [0, 1, 2, 3].filter(slot => slot !== target).forEach((slot, index) => { order[slot] = distractors[index]; });
  return { order, question: buildExamQuestion(question, order) };
}
function blueprintExam(pool, limit) {
  const selected = [], used = new Set();
  const byDay = {};
  pool.forEach(q => (byDay[q.day] = byDay[q.day] || []).push(q));
  Object.keys(byDay).sort((a, b) => +a - +b).forEach(day => {
    shuffle(byDay[day]).slice(0, 5).forEach(q => { selected.push(q); used.add(q.id); });
  });
  const remaining = shuffle(pool.filter(q => !used.has(q.id))).sort((a, b) => (+b.level || 0) - (+a.level || 0));
  return examShuffle(selected.concat(remaining).slice(0, Math.min(limit, pool.length)));
}
function saveExamDraft() {
  if (!exam.qs.length || exam.finished) return;
  const remaining = exam.paused ? exam.remaining : Math.max(0, exam.end - Date.now());
  Store.set("examDraft", {
    version: EXAM_DRAFT_VERSION,
    ids: exam.qs.map(q => q.id),
    perms: exam.perms,
    answers: exam.answers,
    flags: exam.flags,
    i: exam.i,
    end: exam.paused ? 0 : exam.end,
    remaining: remaining
  });
}
function loadExamDraft() {
  const d = Store.get("examDraft", null);
  const reject = () => { Store.set("examDraft", null); return false; };
  const legacyRemaining = d && d.version === 3 && Number.isFinite(d.end) ? d.end - Date.now() : null;
  const savedRemaining = d && d.version === EXAM_DRAFT_VERSION ? d.remaining : legacyRemaining;
  if (!d || ![3, EXAM_DRAFT_VERSION].includes(d.version) || !Array.isArray(d.ids) || !Array.isArray(d.perms) ||
      !Array.isArray(d.answers) || !Array.isArray(d.flags) || !Number.isFinite(savedRemaining) || savedRemaining <= 0) return reject();
  const count = d.ids.length;
  if (count < 1 || count > 75 || d.perms.length !== count || d.answers.length !== count || d.flags.length !== count ||
      d.ids.some(id => typeof id !== "string" || !id) || new Set(d.ids).size !== count ||
      d.perms.some(order => !validExamPermutation(order)) || !Number.isInteger(d.i) || d.i < 0 || d.i >= count ||
      d.answers.some(answer => answer !== null && (!Number.isInteger(answer) || answer < 0 || answer > 3)) ||
      d.flags.some(flag => typeof flag !== "boolean")) return reject();
  const byId = new Map((window.QUESTIONS || []).map(q => [q.id, q]));
  const qs = d.ids.map((id, index) => {
    const base = byId.get(id);
    return base ? buildExamQuestion(base, d.perms[index]) : null;
  });
  if (qs.some(q => !q)) return reject();
  exam.qs = qs; exam.perms = d.perms.map(order => order.slice()); exam.answers = d.answers.slice(); exam.flags = d.flags.slice();
  exam.i = d.i; exam.remaining = Math.min(90 * 60000, savedRemaining); exam.end = 0; exam.paused = true; exam.finished = false;
  if (d.version === 3) saveExamDraft();
  return true;
}
function pauseExam() {
  if (exam.timer) clearInterval(exam.timer);
  exam.timer = null;
  if (exam.qs.length && !exam.finished) {
    if (!exam.paused && exam.end) exam.remaining = Math.max(0, exam.end - Date.now());
    exam.paused = true;
    saveExamDraft();
  }
}
function resumeExam() {
  if (!exam.qs.length || exam.finished) return;
  exam.end = Date.now() + Math.max(1, exam.remaining || 90 * 60000);
  exam.paused = false;
  saveExamDraft();
  startExamTimer();
  renderExam();
}
function startExamTimer() {
  clearInterval(exam.timer);
  exam.paused = false;
  exam.timer = setInterval(() => {
    const access = authorizePacingRoute("#/exam");
    if (!access.allowed) { pauseExam(); renderPacingLock(access); return; }
    const el = $("#exam-clock");
    const left = exam.end - Date.now();
    if (left <= 0) { finishExam(); return; }
    if (!el) return;
    const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
    el.textContent = `${m}:${String(s).padStart(2, "0")}`;
    if (left < 5 * 60000) el.style.color = "var(--danger)";
  }, 1000);
}
function viewExamIntro() {
  const hasDraft = loadExamDraft();
  $("#main").innerHTML = `<div class="card center finale">
    <h1>${IC("grad", "")} Cumulative Written Exam</h1>
    <p class="muted" style="max-width:600px;margin:8px auto">Up to 75 single-best-answer questions blueprint-sampled across every completed day, with additional weight given to higher-level decision questions. Ninety minutes, neutral answer selection, flagging and navigation. Feedback appears only after submission.</p>
    <p class="small muted">Course benchmark: <b>70%</b> · Reward: <b>+150 XP</b> (+100 bonus at or above the benchmark)</p>
    <div class="mt action-row">${hasDraft ? '<button class="btn" id="resume-exam">Resume saved attempt</button><button class="btn secondary" id="start-exam">Start over</button>' : '<button class="btn" id="start-exam">Begin exam</button>'}</div></div>`;
  if ($("#resume-exam")) $("#resume-exam").onclick = resumeExam;
  $("#start-exam").onclick = () => {
    const pool = filterPacingQuestions(unlockedQuestions(), { purpose: "exam", stats: qStats() });
    if (pool.length < 10) { toast("Complete more lessons to unlock enough questions for the exam."); location.hash = "#/quiz"; return; }
    const base = blueprintExam(pool, 75), targets = balancedExamTargets(base.length);
    const built = base.map((question, index) => permuteExamQuestion(question, targets[index]));
    exam.qs = built.map(item => item.question);
    exam.perms = built.map(item => item.order);
    exam.answers = new Array(exam.qs.length).fill(null);
    exam.flags = new Array(exam.qs.length).fill(false);
    exam.i = 0; exam.finished = false; exam.paused = false;
    exam.end = Date.now() + 90 * 60000;
    exam.remaining = 90 * 60000;
    saveExamDraft(); startExamTimer();
    renderExam();
  };
}
function renderExam() {
  const access = authorizePacingRoute("#/exam");
  if (!access.allowed) { pauseExam(); renderPacingLock(access); return; }
  if (exam.finished) return renderExamResults();
  const q = exam.qs[exam.i];
  const grid = exam.qs.map((_, gi) =>
    `<button data-g="${gi}" class="${gi === exam.i ? "cur " : ""}${exam.answers[gi] !== null ? "answered " : ""}${exam.flags[gi] ? "flagged" : ""}" aria-label="Question ${gi + 1}${exam.flags[gi] ? ", flagged" : ""}">${gi + 1}</button>`).join("");
  $("#main").innerHTML = `
    <div class="player-top">
      <span class="pill cyan">MOCK EXAM</span>
      <div class="bar"><span style="width:${Math.round(100 * exam.answers.filter(a => a !== null).length / exam.qs.length)}%"></span></div>
      <span class="exam-timer" id="exam-clock">--:--</span>
    </div>
    <div class="exam-grid">${grid}</div>
    <div class="chunk">
      <p class="muted small" style="margin:0">Question ${exam.i + 1} of ${exam.qs.length} · ${esc(q.topic)}</p>
      <h2 style="font-size:1.1rem">${q.stem}</h2>
      ${q.options.map((o, oi) => `<button class="q-opt ${exam.answers[exam.i] === oi ? "selected" : ""}" data-opt="${oi}"><span class="opt-key">${"ABCDE"[oi]}</span><span>${o}</span></button>`).join("")}
    </div>
    <div class="player-nav">
      <button class="btn secondary" id="ex-prev" ${exam.i === 0 ? "disabled" : ""}>${IC("chevL")} Prev</button>
      <button class="btn secondary" id="ex-flag">${exam.flags[exam.i] ? "Unflag" : "Flag for review"}</button>
      <button class="btn outline" id="ex-submit">Submit exam</button>
      <button class="btn" id="ex-next" ${exam.i === exam.qs.length - 1 ? "disabled" : ""}>Next ${IC("chevR")}</button>
    </div>`;
  document.querySelectorAll(".exam-grid button").forEach(b => b.onclick = () => { exam.i = +b.dataset.g; saveExamDraft(); renderExam(); });
  document.querySelectorAll(".q-opt").forEach(b => b.onclick = () => { exam.answers[exam.i] = +b.dataset.opt; saveExamDraft(); renderExam(); });
  $("#ex-prev").onclick = () => { exam.i--; saveExamDraft(); renderExam(); };
  $("#ex-next").onclick = () => { exam.i++; saveExamDraft(); renderExam(); };
  $("#ex-flag").onclick = () => { exam.flags[exam.i] = !exam.flags[exam.i]; saveExamDraft(); renderExam(); };
  $("#ex-submit").onclick = () => {
    const blank = exam.answers.filter(a => a === null).length;
    if (blank && !confirm(`${blank} unanswered question${blank === 1 ? "" : "s"}. Submit anyway?`)) return;
    finishExam();
  };
}
function finishExam() {
  const access = authorizePacingRoute("#/exam");
  if (!access.allowed) { pauseExam(); renderPacingLock(access); return; }
  clearInterval(exam.timer); exam.finished = true;
  Store.set("examDraft", null);
  exam.qs.forEach((q, i) => recordAnswer(q.id, exam.answers[i] === q.answer));
  const score = exam.qs.reduce((a, q, i) => a + (exam.answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round(100 * score / exam.qs.length);
  Store.set("examCompleted", true);
  if (pct >= 70) { Store.set("examPass", true); }
  addXP(150 + (pct >= 70 ? 100 : 0));
  checkAchievements();
  renderExamResults();
}
/* Sequence-5 readiness reporting (task 5): a single percentage hides whether a learner is strong
 * on facts but unsafe in a crisis. Split performance by the competency the question's `kind` tests,
 * so the report separates knowledge from interpretation, operative sequencing, judgment and rescue. */
const EXAM_DIMS = [
  ["Core knowledge", "Recall and mechanism"],
  ["Interpretation & evidence", "Reading data, reconciling discordance, using trials"],
  ["Operative sequencing", "Narrating and ordering the operation"],
  ["Judgment (when not to / convert)", "Deciding not to operate, to abort or to convert"],
  ["Crisis recognition & rescue", "Naming the deteriorating physiology and dosing the rescue"],
  ["Integrated case management", "Combining anatomy, physiology, evidence and rescue across domains"]
];
function examDimension(q) {
  if (q.day === 14 || q.kind === "integration") return "Integrated case management";
  switch (q.kind) {
    case "operative-step": return "Operative sequencing";
    case "complication-rescue": case "dosed-algorithm": return "Crisis recognition & rescue";
    case "when-not-to": return "Judgment (when not to / convert)";
    case "reconcile-discordant": case "evidence": case "quantitative": return "Interpretation & evidence";
    default: return "Core knowledge";
  }
}
function renderExamResults() {
  const score = exam.qs.reduce((a, q, i) => a + (exam.answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round(100 * score / exam.qs.length);
  if (pct >= 70) confettiBurst();
  const byTopic = {};
  exam.qs.forEach((q, i) => {
    const t = byTopic[q.topic] = byTopic[q.topic] || { n: 0, ok: 0 };
    t.n++; if (exam.answers[i] === q.answer) t.ok++;
  });
  const topicRows = Object.entries(byTopic).sort((a, b) => (a[1].ok / a[1].n) - (b[1].ok / b[1].n)).map(([t, v]) =>
    barRow(esc(t), `${v.ok}/${v.n}`, Math.round(100 * v.ok / v.n), { green: v.ok / v.n >= .7 })).join("");
  const byDim = {};
  exam.qs.forEach((q, i) => {
    const d = examDimension(q);
    const t = byDim[d] = byDim[d] || { n: 0, ok: 0 };
    t.n++; if (exam.answers[i] === q.answer) t.ok++;
  });
  const dimRows = EXAM_DIMS.filter(([d]) => byDim[d]).map(([d, sub]) => {
    const v = byDim[d];
    return barRow(esc(d), `${v.ok}/${v.n}`, Math.round(100 * v.ok / v.n), { green: v.ok / v.n >= .7, sub: esc(sub) });
  }).join("");
  const review = exam.qs.map((q, i) => {
    const ok = exam.answers[i] === q.answer;
    return `<details class="chunk exam-review-item" style="margin-top:12px" ${ok ? "" : "open"}>
      <summary><span>Q${i + 1} · ${esc(q.topic)}</span><b class="${ok ? "review-ok" : "review-miss"}">${ok ? "Correct" : "Review"}</b></summary>
      <div class="exam-review-body"><h3>${q.stem}</h3>
      <p class="small"><span class="pill ${ok ? "green" : "red"}">Your answer</span> ${exam.answers[i] === null ? "<i>blank</i>" : q.options[exam.answers[i]]}</p>
      ${ok ? "" : `<p class="small"><span class="pill green">Best answer</span> ${q.options[q.answer]}</p>`}
      ${questionTeachingHTML(q, "")}</div></details>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="card center celebrate finale">
      <div class="confetti">${pct >= 70 ? "🏆" : "📚"}</div>
      <h1>${score}/${exam.qs.length} — ${pct}%</h1>
      <p class="muted"><b>${pct >= 70 ? "At or above the course benchmark. Review the competency profile before moving on." : "Below the 70% course benchmark. Use the competency profile to choose the next circuit and retrieval set."}</b></p>
    </div>
    <div class="card mt"><h2>${IC("chart")} Performance evidence by competency</h2>
      <p class="small muted" style="margin:0 0 4px">One score hides whether retrieval, interpretation, sequencing and rescue are developing at the same rate. This profile reports only what this attempt sampled.</p>${dimRows}</div>
    <div class="card mt"><h2>${IC("chart")} Performance by topic (weakest first)</h2>${topicRows}</div>
    ${review ? `<h2 class="mt">Review every question</h2><p class="small muted">Missed questions are expanded. Open any correct question to revisit its teaching explanation.</p>${review}` : ""}
    <div class="mt center"><a class="btn" href="#/">Back to dashboard</a></div>`;
  window.scrollTo(0, 0);
}

/* ---------- exercises ---------- */
function viewExerciseList() {
  const done = exDone();
  const all = window.EXERCISES || [];
  // Group by day so the list reads as a progression rather than one long stack.
  const byDay = {};
  all.forEach(e => (byDay[e.day] = byDay[e.day] || []).push(e));
  const groups = Object.keys(byDay).map(Number).sort((a, b) => a - b).map(d => {
    const info = (window.CURRICULUM || [])[d - 1];
    const rows = byDay[d].map(e => {
      const locked = !canAccessSource("exercise", e.id, "browse");
      const inner = `
        <span class="t-icon">${IC(done[e.id] ? "check" : e.type === "order" ? "puzzle" : "scope")}</span>
        <span class="t-body"><span class="t-title">${esc(e.title)}</span><br>
        <span class="t-sub">${e.type === "order" ? "Sequence builder — assemble the operation" : "Click-the-anatomy — identify the structure"}${locked ? " · recovery locked" : ""}</span></span>
        <span class="t-go">${IC(locked ? "lock" : "chevR")}</span>`;
      return locked
        ? `<div class="task pacing-locked-card" aria-disabled="true">${inner}</div>`
        : `<a class="task ${done[e.id] ? "done" : ""}" href="#/exercise/${e.id}">${inner}</a>`;
    }).join("");
    return `<div class="section-title" style="margin-top:20px"><span>${String(d).padStart(2, "0")}</span>
      <div><h2>Day ${d}${info ? " — " + esc(info.theme) : ""}</h2>
      <p>${byDay[d].length} interactive${byDay[d].length === 1 ? "" : "s"}</p></div></div>${rows}`;
  }).join("");
  const doneN = all.filter(e => done[e.id]).length;
  const unlockedN = all.filter(e => canAccessSource("exercise", e.id, "browse")).length;
  $("#main").innerHTML = `
    ${hubHero({
      accent: "accent-coral", kicker: "Build", icon: "puzzle", title: "Interactive Lab",
      lead: "Anatomy you click and operations you assemble step by step. Active reconstruction beats passive review — these are your hands for the next two weeks.",
      stats: [
        { v: all.length, l: "Interactives", count: true },
        { v: unlockedN, l: "Unlocked", count: true },
        { v: doneN, l: "Completed", count: true }
      ]
    })}
    <div class="card hub-tasks accent-coral">${groups || `<p class="muted small">No interactives loaded yet.</p>`}</div>`;
  countUpAll();
}
const ex = { id: null, next: 0, errors: 0, order: [] };
function viewExercise(id) {
  const e = (window.EXERCISES || []).find(x => x.id === id);
  if (!e) { location.hash = "#/exercises"; return; }
  if (!canAccessSource("exercise", e.id, "browse")) { renderPacingLock({ reason: "This interactive is outside the current recovery buffer." }); return; }
  ex.id = id; ex.next = 0; ex.errors = 0;
  if (e.type === "order") { ex.order = shuffle(e.steps.map((_, i) => i)); renderOrderEx(e); }
  else renderLabelEx(e);
}
function renderOrderEx(e) {
  if (!canAccessSource("exercise", e.id, "practice")) { renderPacingLock({ reason: "Recovery status changed before the next exercise step." }); return; }
  const placed = e.steps.slice(0, ex.next);
  if (ex.next >= e.steps.length) return exComplete(e);
  $("#main").innerHTML = `
    <div class="player-top"><a class="btn sm secondary" href="#/exercises">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * ex.next / e.steps.length)}%"></span></div>
      <span class="small muted">${ex.next}/${e.steps.length}</span></div>
    ${window.CardCatalog ? CardCatalog.ctaHTML("exercise", e.id) : ""}
    <div class="card">
      <h2>${IC("puzzle")} ${esc(e.title)}</h2>
      <p class="muted small">${e.intro || "Click the steps in the correct order. Wrong picks shake — and teach."}</p>
      ${placed.map((s, i) => `<div class="ex-step placed"><span class="step-no">${i + 1}</span>${s}</div>`).join("")}
      <hr class="sep">
      <p class="small muted" style="margin:4px 0"><b>Which step comes next?</b></p>
      ${ex.order.filter(i => i >= ex.next).map(i => `<button class="ex-step" data-i="${i}">${e.steps[i]}</button>`).join("")}
    </div>`;
  document.querySelectorAll("button.ex-step").forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    if (i === ex.next) { ex.next++; renderOrderEx(e); }
    else { ex.errors++; b.classList.add("shake"); setTimeout(() => b.classList.remove("shake"), 350); }
  });
}
function renderLabelEx(e) {
  if (!canAccessSource("exercise", e.id, "practice")) { renderPacingLock({ reason: "Recovery status changed before the next exercise step." }); return; }
  if (ex.next >= e.targets.length) return exComplete(e);
  const t = e.targets[ex.next];
  $("#main").innerHTML = `
    <div class="player-top"><a class="btn sm secondary" href="#/exercises">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * ex.next / e.targets.length)}%"></span></div>
      <span class="small muted">${ex.next}/${e.targets.length}</span></div>
    ${window.CardCatalog ? CardCatalog.ctaHTML("exercise", e.id) : ""}
    <div class="card">
      <h2>${IC("scope")} ${esc(e.title)}</h2>
      <div class="ex-prompt">Click on: <span style="color:var(--primary)">${t.label}</span></div>
      <div class="diagram label-svg" id="label-stage">${e.svg}</div>
      <p class="small muted center">${e.caption || ""}</p>
    </div>`;
  const stage = $("#label-stage");
  e.targets.slice(0, ex.next).forEach(done => {
    const el = stage.querySelector(`[data-zone="${done.zone}"]`);
    if (el) { el.style.fill = "var(--ok)"; el.style.opacity = ".55"; el.classList.add("zone-found"); }
  });
  stage.querySelectorAll("[data-zone]").forEach(z => z.addEventListener("click", () => {
    if (z.dataset.zone === t.zone) { ex.next++; renderLabelEx(e); }
    else {
      ex.errors++;
      z.style.fill = "var(--danger)";
      setTimeout(() => { z.style.fill = ""; }, 350);
      toast("Not that one — " + (t.hint || "look again."));
    }
  }));
}
function exComplete(e) {
  const d = exDone();
  const first = !d[e.id];
  d[e.id] = true; Store.set("exdone", d);
  bumpStreak(); logActivity();
  if (first) addXP(ex.errors === 0 ? 45 : 30);
  if (ex.errors === 0) { Store.set("flawlessEx", true); confettiBurst(); }
  checkAchievements();
  const acc = e.type === "order" ? e.steps.length : e.targets.length;
  const exerciseFigures = window.Figures ? Figures.slot("exercise", e.id, "overview", "content") : "";
  $("#main").innerHTML = `<div class="card center celebrate finale">
    <div class="confetti">${ex.errors === 0 ? "🎯" : "✅"}</div>
    <h1>${ex.errors === 0 ? "Flawless!" : "Complete"}</h1>
    <p class="muted">${esc(e.title)} — ${acc} items, ${ex.errors} miss${ex.errors === 1 ? "" : "es"}.${ex.errors > 2 ? " Run it again tomorrow; sequences need repetition too." : ""}</p>
    ${exerciseFigures}
    <div class="mt action-row">
      <button class="btn secondary" onclick="viewExercise('${e.id}')">Retry</button>
      ${window.CardCatalog && canAccessSource("exercise", e.id, "full-deck") ? `<a class="btn" href="#/cards/source/exercise/${encodeURIComponent(e.id)}">Review ${CardCatalog.count("exercise", e.id)} cards</a>` : ""}
      <a class="btn" href="#/exercises">More interactives</a>
      <a class="btn secondary" href="#/">Dashboard</a></div></div>`;
}

/* ---------- viva circuit ---------- */
/* Level-5 "defend three levels deep" bank. Each case unlocks when that day's
   lessons are complete; Day 14 (integration capstone) unlocks when every
   other day is complete. Self-graded — the model answer is the yardstick. */
function vivaUnlocked(day) {
  if (day === 14) return [1,2,3,4,5,6,7,8,9,10,11,12,13].every(d => vivaUnlocked(d));
  const done = doneLessons();
  const ls = lessonsForDay(day);
  return ls.length > 0 && ls.every(l => done[l.id]);
}
function vivaStats() { return Store.get("vivastats", {}); }
function recordViva(caseId, grades) {
  const s = vivaStats();
  s[caseId] = { grades: grades, ts: Date.now() };
  Store.set("vivastats", s);
}
function vivaScore(caseId) {
  const s = vivaStats()[caseId];
  if (!s) return null;
  return s.grades.reduce((a, g) => a + g, 0) / (s.grades.length * 2); // 0..1
}
function viewViva() {
  const cases = (window.VIVA || []).slice().sort((a, b) => a.day - b.day);
  const graded = cases.filter(c => vivaScore(c.id) !== null);
  const rows = cases.map(c => {
    const nativeUnlocked = vivaUnlocked(c.day);
    const unlocked = nativeUnlocked && canAccessSource("viva", c.id, "browse");
    const sc = vivaScore(c.id);
    const badge = !unlocked
      ? `<span class="pill">${IC("lock")} locked</span>`
      : sc === null ? `<span class="pill cyan">not attempted</span>`
      : sc >= 0.75 ? `<span class="pill solid-green">defended · ${Math.round(sc*100)}%</span>`
      : `<span class="pill solid-amber">shaky · ${Math.round(sc*100)}%</span>`;
    const inner = `<span class="t-icon">${IC(unlocked ? "grad" : "lock")}</span>
      <span class="t-body"><span class="t-title">Day ${c.day} — ${esc(c.topic)}</span><br>
      <span class="t-sub">${unlocked ? esc(c.stem.slice(0, 96)) + (c.stem.length > 96 ? "…" : "") :
        nativeUnlocked ? "Paused by the active recovery circuit" : "Complete Day " + c.day + "'s lessons to unlock"}</span></span>
      ${badge}`;
    return unlocked
      ? `<a class="task ${sc !== null ? "done" : ""}" href="#/viva/${c.id}">${inner}<span class="t-go">${IC("chevR")}</span></a>`
      : `<div class="task locked">${inner}</div>`;
  }).join("");
  const unlockedCases = cases.filter(c => vivaUnlocked(c.day) && canAccessSource("viva", c.id, "practice"));
  // The readiness bars are this page's best visual — promote them into the hero.
  const side = graded.length
    ? `<div class="hub-readiness"><b>Defence log · ${graded.length}/${cases.length} attempted</b>${vivaReadinessHTML(graded)}</div>`
    : `<div class="hub-stats">
        <div class="stat"><div class="v" data-count="${cases.length}">0</div><div class="l">Cases</div></div>
        <div class="stat"><div class="v" data-count="${unlockedCases.length}">0</div><div class="l">Unlocked</div></div></div>`;
  $("#main").innerHTML = `
    ${hubHero({
      accent: "accent-gold", kicker: "Defend", icon: "grad", title: "Viva Circuit",
      lead: "The examiner's chair. Each case escalates three levels deep — <b>mechanism → evidence → exception</b>. Defend your answer out loud, then reveal the model answer and grade yourself honestly. Facts test recall; this tests whether your reasoning survives follow-up.",
      side: side
    })}
    ${unlockedCases.length ? `<div class="daily-bridge hub-cta accent-gold">
      <p><b>Sit the full circuit.</b> Every unlocked case back-to-back, shuffled — the closest thing to a real viva sitting.</p>
      <button class="btn" id="viva-circuit">${IC("zap")} Run ${unlockedCases.length} cases</button></div>` : ""}
    <div class="card hub-tasks accent-gold">${rows}</div>`;
  countUpAll();
  if ($("#viva-circuit")) $("#viva-circuit").onclick = () => {
    vc.queue = shuffle(unlockedCases.map(c => c.id)); vc.circuit = true;
    location.hash = "#/viva/" + vc.queue[0];
  };
}
function vivaReadinessHTML(graded) {
  // aggregate self-grades per beat level across attempted cases
  const levels = ["Mechanism", "Evidence", "Exception"];
  const agg = [[0,0],[0,0],[0,0]];
  graded.forEach(c => {
    const g = vivaStats()[c.id].grades;
    g.forEach((v, i) => { if (i < 3) { agg[i][0] += v; agg[i][1] += 2; } });
  });
  return `<div class="viva-readiness">${levels.map((lv, i) => {
    const pct = agg[i][1] ? Math.round(100 * agg[i][0] / agg[i][1]) : 0;
    return `<div class="vr-row"><span class="vr-label">${lv}</span>
      <span class="bar"><span style="width:${pct}%"></span></span>
      <span class="vr-pct">${pct}%</span></div>`;
  }).join("")}</div>`;
}
const vc = { id: null, beat: 0, revealed: false, grades: [], circuit: false, queue: [] };
const GRADE_LABELS = ["Missed it", "Shaky — partial", "Nailed it"];
function viewVivaCase(caseId) {
  const c = (window.VIVA || []).find(x => x.id === caseId);
  if (!c || !vivaUnlocked(c.day)) { location.hash = "#/viva"; return; }
  if (!canAccessSource("viva", c.id, "practice")) { renderPacingLock({ reason: "This viva is outside the active recovery circuit." }); return; }
  if (vc.id !== caseId) { vc.id = caseId; vc.beat = 0; vc.revealed = false; vc.grades = []; }
  renderVivaBeat();
}
function renderVivaBeat() {
  const c = (window.VIVA || []).find(x => x.id === vc.id);
  if (!c) { location.hash = "#/viva"; return; }
  if (!canAccessSource("viva", c.id, "practice")) { renderPacingLock({ reason: "Recovery status changed before the next viva prompt." }); return; }
  if (vc.beat >= c.beats.length) return vivaComplete(c);
  const b = c.beats[vc.beat];
  const pos = vc.circuit ? ` · case ${vc.queue.indexOf(c.id) + 1}/${vc.queue.length}` : "";
  $("#main").innerHTML = `
    <div class="player-top">
      <a class="btn sm secondary" href="#/viva">${IC("chevL")} Exit</a>
      <div class="bar"><span style="width:${Math.round(100 * vc.beat / c.beats.length)}%"></span></div>
      <span class="small muted">${vc.beat + 1}/${c.beats.length}${pos}</span>
    </div>
    <p class="kicker"><b>Day ${c.day} — ${esc(c.topic)}</b> · Level 5 viva</p>
    ${window.Daily ? Daily.bridgeHTML("viva", c.id) : ""}
    <div class="chunk">
      <div class="viva-stem">${c.stem}</div>
      <div class="viva-beat">
        <span class="viva-lv lv-${vc.beat}">${b.level} <span class="viva-depth">· level ${vc.beat + 1} of 3</span></span>
        <p class="viva-ask">${b.ask}</p>
      </div>
      ${vc.revealed
        ? `<div class="viva-model"><span class="kbox-tag">Model answer</span><p>${b.model}</p></div>
           <p class="small muted" style="margin:14px 0 6px"><b>How did your defence hold up?</b></p>
           <div class="viva-grade">${GRADE_LABELS.map((lb, gi) =>
             `<button class="btn ${gi === 2 ? "" : "secondary"}" data-grade="${gi}">${IC(["x", "minus", "check"][gi])} ${lb}</button>`).join("")}</div>`
        : `<div class="player-nav"><span></span><button class="btn" id="viva-reveal">${IC("bulb")} Reveal model answer</button></div>`}
    </div>`;
  if ($("#viva-reveal")) $("#viva-reveal").onclick = () => { vc.revealed = true; renderVivaBeat(); window.scrollTo(0, 0); };
  document.querySelectorAll(".viva-grade button").forEach(btn => btn.onclick = () => {
    if (!canAccessSource("viva", c.id, "practice")) { renderPacingLock({ reason: "Recovery status changed before this grade was saved." }); return; }
    vc.grades[vc.beat] = +btn.dataset.grade;
    vc.beat++; vc.revealed = false;
    renderVivaBeat(); window.scrollTo(0, 0);
  });
}
function vivaComplete(c) {
  const first = vivaScore(c.id) === null;
  recordViva(c.id, vc.grades);
  bumpStreak(); logActivity();
  const total = vc.grades.reduce((a, g) => a + g, 0), max = c.beats.length * 2;
  const pct = Math.round(100 * total / max);
  if (first) addXP(pct >= 75 ? 60 : 40);
  if (pct >= 75) confettiBurst();
  checkAchievements();
  const nextInCircuit = vc.circuit && vc.queue.indexOf(c.id) < vc.queue.length - 1;
  const nextId = nextInCircuit ? vc.queue[vc.queue.indexOf(c.id) + 1] : null;
  const nextAllowed = nextId && canAccessSource("viva", nextId, "practice");
  $("#main").innerHTML = `<div class="card center celebrate finale">
    <div class="confetti">${pct >= 75 ? "🎓" : "📚"}</div>
    <h1>${pct}% defended</h1>
    <p class="muted" style="max-width:520px;margin:8px auto">${
      pct >= 75 ? "That would survive the examiner's follow-ups. The exception level is where seniors are made — you held it."
      : pct >= 40 ? "You have the shape of it but the follow-ups found gaps. Re-read the Level-5 layer for this day and re-run the case — a viva is won on the second and third question, not the first."
      : "This one owns you right now — that's the point of finding out here rather than in the exam. Go back to the day's Mastery layer, then re-sit it."}</p>
    <div class="mt action-row">
      ${nextInCircuit && nextAllowed ? `<a class="btn" href="#/viva/${nextId}">Next case ${IC("chevR")}</a>` : ""}
      ${!vc.circuit && window.Daily && Daily.get(c.day) ? `<a class="btn" href="#/day/${c.day}">Day ${c.day} circuit ${IC("chevR")}</a>` : ""}
      <button class="btn secondary" onclick="vc.circuit=false;viewVivaCase('${c.id}')">Re-sit this case</button>
      <a class="btn secondary" href="#/viva">Viva circuit</a>
    </div></div>`;
  if (!nextInCircuit || !nextAllowed) vc.circuit = false;
}

/* ---------- heatmap ---------- */
function heatmapHTML() {
  const a = Store.get("activity", {});
  const weeks = 12, cells = [];
  const today = localDateFromStr(todayStr());
  const start = new Date(today.getTime() - (weeks * 7 - 1) * DAY_MS);
  // align to Sunday
  start.setDate(start.getDate() - start.getDay());
  let html = "";
  for (let w = 0; w < weeks + 1; w++) {
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
      if (dt > today) continue;
      const key = todayStr(dt);
      const n = a[key] || 0;
      const lvl = n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
      html += `<i class="hm-cell l${lvl}" style="grid-column:${w + 1};grid-row:${d + 1}" title="${key}: ${n} action${n === 1 ? "" : "s"}"></i>`;
    }
  }
  return `<div class="heatmap" role="img" aria-label="Study activity heatmap">${html}</div>
    <div class="hm-legend small muted">Less <i class="hm-cell l0"></i><i class="hm-cell l1"></i><i class="hm-cell l2"></i><i class="hm-cell l3"></i><i class="hm-cell l4"></i> More</div>`;
}

/* ---------- progress ---------- */
function downloadProgressBackup() {
  try {
    const backup = buildProgressBackup(localStorage, location.origin, currentCatalogCardIds());
    const blob = new Blob([JSON.stringify(backup, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cardiac-school-progress-" + backup.timestamp.replace(/[:.]/g, "-") + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Progress backup downloaded");
  } catch (error) {
    alert("The progress backup could not be created. No stored progress was changed.\n\n" + error.message);
  }
}
function restoreKeyList(keys) {
  if (!keys.length) return "None";
  const shown = keys.slice(0, 8).map(key => `<code>${esc(key)}</code>`).join(", ");
  return shown + (keys.length > 8 ? ` and ${keys.length - 8} more` : "");
}
function progressRestorePreviewHTML(backup, preview) {
  const thisOrigin = String(location.origin || "");
  const originWarning = backup.origin !== thisOrigin
    ? `<p class="small" style="color:var(--warn)"><b>Different origin:</b> this backup came from ${esc(backup.origin || "an unknown origin")}; this page is ${esc(thisOrigin || "an unknown origin")}.</p>`
    : "";
  const srsWarning = preview.blockedSrs
    ? `<p class="small" style="color:var(--warn)"><b>Scheduler protected:</b> ${esc(preview.blockedSrs.reason)} It will not be replaced.</p>`
    : "";
  const conflictControl = preview.conflictKeys.length ? `
    <label class="small" style="display:flex;gap:8px;align-items:flex-start;margin:12px 0">
      <input type="checkbox" id="progress-restore-replace">
      <span>Replace the ${preview.conflictKeys.length} conflicting <b>non-scheduler</b> value${preview.conflictKeys.length === 1 ? "" : "s"} listed below. Existing per-card schedules are always protected.</span>
    </label>` : "";
  return `<div class="card" style="margin-top:14px" role="status">
    <h3 style="margin-top:0">Backup preview</h3>
    <p class="small muted">Created ${esc(new Date(backup.timestamp).toLocaleString())} · ${backup.catalogIds.length.toLocaleString()} catalog IDs · ${preview.keyCount} stored values</p>
    ${originWarning}${srsWarning}
    <p class="small"><b>New values:</b> ${preview.addKeys.length}<br>
      <b>Matching values:</b> ${preview.sameKeys.length}<br>
      <b>Conflicting non-scheduler values:</b> ${preview.conflictKeys.length}<br>
      <b>Missing schedules that can be added:</b> ${preview.srsAdditions}<br>
      <b>Existing schedules that will stay unchanged:</b> ${preview.srsProtected}</p>
    ${preview.conflictKeys.length ? `<p class="small muted"><b>Conflicts:</b> ${restoreKeyList(preview.conflictKeys)}</p>` : ""}
    ${conflictControl}
    <div class="action-row">
      <button class="btn" id="progress-restore-confirm">Confirm restore</button>
      <button class="btn secondary" id="progress-restore-cancel">Cancel</button>
    </div>
  </div>`;
}
function wireProgressBackupControls() {
  const exportButton = $("#progress-export"), fileInput = $("#progress-restore-file"), previewNode = $("#progress-restore-preview");
  if (!exportButton || !fileInput || !previewNode) return;
  exportButton.onclick = downloadProgressBackup;
  fileInput.onchange = async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    previewNode.innerHTML = `<p class="small muted">Reading backup…</p>`;
    try {
      const backup = parseProgressBackup(await file.text());
      const preview = previewProgressRestore(backup, localStorage);
      previewNode.innerHTML = progressRestorePreviewHTML(backup, preview);
      $("#progress-restore-cancel").onclick = () => {
        fileInput.value = "";
        previewNode.innerHTML = "";
      };
      $("#progress-restore-confirm").onclick = () => {
        const replace = $("#progress-restore-replace");
        const replaceConflicts = !!(replace && replace.checked);
        const summary = `Restore ${preview.addKeys.length} missing stored value${preview.addKeys.length === 1 ? "" : "s"} and ${preview.srsAdditions} missing schedule${preview.srsAdditions === 1 ? "" : "s"}?` +
          (replaceConflicts ? `\n\nYou also selected replacement of ${preview.conflictKeys.length} conflicting non-scheduler value${preview.conflictKeys.length === 1 ? "" : "s"}.` : "") +
          "\n\nNo existing per-card schedule will be replaced or deleted.";
        if (!confirm(summary)) return;
        try {
          const result = applyProgressRestore(backup, localStorage, {
            confirmed: true,
            replaceConflicts: replaceConflicts,
            previewSignature: preview.signature
          });
          const changed = result.addedKeys + result.replacedKeys + result.srsAdded;
          if (!changed) {
            toast("Backup checked — no changes were needed");
            return;
          }
          alert(`Restore complete. Added ${result.addedKeys} stored value${result.addedKeys === 1 ? "" : "s"}, added ${result.srsAdded} schedule${result.srsAdded === 1 ? "" : "s"}, and replaced ${result.replacedKeys} explicitly selected non-scheduler value${result.replacedKeys === 1 ? "" : "s"}. The page will now reload.`);
          location.reload();
        } catch (error) {
          alert("Restore stopped. Existing scheduler entries were not deleted.\n\n" + error.message);
        }
      };
    } catch (error) {
      previewNode.innerHTML = "";
      const message = document.createElement("p");
      message.className = "small";
      message.style.color = "var(--warn)";
      message.textContent = error.message;
      previewNode.appendChild(message);
    }
  };
}
function viewProgress() {
  const pacing = pacingState(), done = doneLessons(), stats = qStats();
  const srsInspection = Store.inspect("srs");
  const srs = srsInspection.status === "ok" && isProgressRecord(srsInspection.value) ? srsInspection.value : {};
  const srsStats = srsCatalogStats(srs, currentCatalogCardIds());
  const lessonsPct = Math.round(100 * Object.keys(done).length / window.ALL_LESSONS.length);
  const tracked = srsStats.tracked, mature = srsStats.mature, learning = srsStats.learning, archived = srsStats.archived;
  const totalQ = totalAnswered(), okQ = totalCorrect();
  const dayRows = window.CURRICULUM.map(d => {
    const ls = lessonsForDay(d.day);
    const n = ls.filter(l => done[l.id]).length;
    return barRow(`Day ${d.day} — ${esc(d.theme)}`, `${n}/${ls.length}`, ls.length ? Math.round(100 * n / ls.length) : 0, { green: n === ls.length && !!ls.length });
  }).join("");
  const pacingRows = window.CURRICULUM.map(d => {
    const progress = pacingDayProgress(d.day);
    const score = Math.round(pacingScore(progress));
    return barRow(`Day ${d.day} — ${esc(d.theme)}`, `${score}%`, score, { green: score >= 75, sub: "Required-day pacing: lessons 50% + five stations at 10% each." });
  }).join("");
  const map = topicList();
  const topicRows = Object.entries(map).map(([t, qs]) => {
    const att = qs.filter(q => stats[q.id]);
    if (!att.length) return "";
    const acc = Math.round(100 * att.reduce((a, q) => a + stats[q.id].ok / stats[q.id].seen, 0) / att.length);
    return barRow(esc(t), acc + "%", acc, { green: acc >= 70 });
  }).join("") || `<p class="muted small">Answer some MCQs to see your accuracy map.</p>`;
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>Progress</h1><p>What gets measured gets retained.</p></div>${ring(lessonsPct)}</div>
    ${pacingStatusHTML(pacing, activeStudyDay())}
    <div class="stat-row">
      <div class="stat"><div class="v" data-count="${tracked}">0</div><div class="l">Cards in rotation</div></div>
      <div class="stat"><div class="v" data-count="${mature}">0</div><div class="l">Mature (≥21d)</div></div>
      <div class="stat"><div class="v" data-count="${learning}">0</div><div class="l">In learning</div></div>
      <div class="stat"><div class="v" data-count="${archived}">0</div><div class="l">Archived schedules</div></div>
      <div class="stat"><div class="v">${totalQ ? Math.round(100 * okQ / totalQ) + "%" : "—"}</div><div class="l">MCQ accuracy</div></div>
    </div>
    ${archived ? `<p class="small muted">${archived.toLocaleString()} scheduler entr${archived === 1 ? "y is" : "ies are"} preserved from cards outside the current catalog. ${archived === 1 ? "It is" : "They are"} archived, not erased, and excluded from the active counts above.</p>` : ""}
    ${srsInspection.status === "malformed" || srsInspection.status === "unavailable" || (srsInspection.status === "ok" && !isProgressRecord(srsInspection.value)) ? `<div class="card" style="border-color:var(--warn)"><b>Scheduler data protected</b><p class="small muted">The current <code>cs_srs</code> value could not be read safely. It has not been overwritten. Download a raw backup before attempting manual recovery.</p></div>` : ""}
    ${window.Advanced ? `<div class="card"><h2>${IC("activity")} Domain readiness map</h2><p class="muted small">A blended training signal from lesson completion, question performance, completed operative articles and crisis practice. The PGY labels are learning milestones, not clinical credentials.</p>${window.Advanced.masteryHTML()}</div>` : ""}
    <div class="card"><h2>${IC("flame")} Study activity</h2>
      <p class="muted small" style="margin-top:0">Every review, answer and lesson lights a square. Don't break the chain.</p>
      ${heatmapHTML()}</div>
    <div class="grid-2 mt">
      <div class="card"><h2>${IC("map")} Curriculum</h2>${dayRows}</div>
      <div class="card"><h2>${IC("target")} MCQ accuracy by topic</h2>${topicRows}</div>
    </div>
    <div class="card mt"><h2>${IC("clock")} Required-day pacing</h2>
      <p class="muted small">This recovery-only score does not replace the lesson ring, Connected Circuit /5, Plan checks, or exam badge.</p>${pacingRows}</div>
    ${window.StaffPreview?.active() ? '' : `<div class="card mt">
      <h2>${IC("download")} Progress backup</h2>
      <p class="muted small">Download an exact copy of every <code>cs_*</code> browser-storage value before major course updates. Restore previews every change first; existing per-card schedules are never replaced or deleted.</p>
      <div class="action-row">
        <button class="btn" id="progress-export">${IC("download")} Download progress backup</button>
        <label class="btn secondary" for="progress-restore-file">Choose backup file</label>
        <input id="progress-restore-file" type="file" accept="application/json,.json" style="display:none">
      </div>
      <div id="progress-restore-preview"></div>
    </div>`}
    ${window.StaffPreview?.active() ? '' : `<div class="card mt">
      <h2>${IC("alert")} Danger zone</h2>
      <p class="muted small">Wipes lessons, XP, achievements, scheduler history, and stats. There is no undo.</p>
      <button class="btn outline danger" id="reset-all">Reset all progress</button>
    </div>`}
    <p class="legal-links mt"><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms of use</a><a href="#/feedback">Send feedback</a></p>`;
  countUpAll();
  if (!window.StaffPreview?.active()) wireProgressBackupControls();
  if ($("#reset-all")) $("#reset-all").onclick = () => {
    if (confirm("Really wipe ALL progress? This cannot be undone.") && confirm("Last chance — wipe everything?")) {
      pauseExam();
      if (pacingMidnightTimer) clearTimeout(pacingMidnightTimer);
      if (window.CSLab && typeof window.CSLab.teardown === "function") window.CSLab.teardown();
      if (window.Surgery && typeof window.Surgery.teardown === "function") window.Surgery.teardown();
      if (window.Angiography && typeof window.Angiography.teardown === "function") window.Angiography.teardown();
      Object.keys(localStorage).filter(k => k.startsWith("cs_")).forEach(k => localStorage.removeItem(k));
      location.hash = "#/";
      location.reload();
    }
  };
}

/* ---------- feedback form (Formspree) ---------- */
const FEEDBACK_MIN_SECONDS = 3;
const FEEDBACK_COOLDOWN_MS = 2 * 60 * 1000;
const FEEDBACK_MESSAGE_RANGE = [20, 2000];
function viewFeedback(fromHash) {
  const config = window.CS_CONFIG || {};
  const configured = !!config.formspreeId;
  const page = fromHash && fromHash !== "#/feedback" ? fromHash : (location.hash || "#/");
  const contact = config.contactEmail ? `<a href="mailto:${escAttr(config.contactEmail)}">${esc(config.contactEmail)}</a>` : "the course team";
  $("#main").innerHTML = `
    <div class="card">
      <span class="pill cyan">FEEDBACK</span>
      <h1 style="margin-top:8px">Spotted something wrong?</h1>
      <p class="muted">Clinical content is curated from published sources and can still contain errors. Tell us what you found and where. Your course progress is never sent with this form.</p>
      ${configured ? "" : `<p class="feedback-status err" role="status">Feedback is not configured on this site yet. You can email ${contact} instead.</p>`}
      <form class="feedback-form" id="feedback-form" novalidate ${configured ? "" : "hidden"}>
        <div>
          <label for="fb-category">What is it about?</label>
          <select id="fb-category" name="category" required>
            <option value="">Choose one</option>
            <option value="clinical-error">A clinical or factual error</option>
            <option value="bug">Something broken (bug)</option>
            <option value="suggestion">A suggestion</option>
            <option value="other">Other</option>
          </select>
          <p class="field-error" id="fb-category-error" role="alert"></p>
        </div>
        <div>
          <label for="fb-page">Where did you see it? <span class="optional">(page or route)</span></label>
          <input id="fb-page" name="page" type="text" maxlength="200" value="${escAttr(page)}">
        </div>
        <div>
          <label for="fb-message">What happened, and what should it say instead?</label>
          <textarea id="fb-message" name="message" required minlength="${FEEDBACK_MESSAGE_RANGE[0]}" maxlength="${FEEDBACK_MESSAGE_RANGE[1]}" aria-describedby="fb-message-hint"></textarea>
          <p class="field-hint" id="fb-message-hint"><span>Include the lesson, card or question text if you can.</span><span id="fb-count">0 / ${FEEDBACK_MESSAGE_RANGE[1]}</span></p>
          <p class="field-error" id="fb-message-error" role="alert"></p>
        </div>
        <div>
          <label for="fb-email">Your email <span class="optional">(optional, only if you want a reply)</span></label>
          <input id="fb-email" name="email" type="email" autocomplete="email" maxlength="254" inputmode="email">
          <p class="field-error" id="fb-email-error" role="alert"></p>
        </div>
        <div class="hp-field" aria-hidden="true">
          <label for="fb-website">Leave this field empty</label>
          <input id="fb-website" name="_gotcha" type="text" tabindex="-1" autocomplete="off">
        </div>
        <div class="action-row">
          <button class="btn" type="submit" id="fb-submit">Send feedback</button>
          <a class="btn secondary" href="${escAttr(page)}">Back</a>
        </div>
        <p class="feedback-status" id="fb-status" role="status" aria-live="polite"></p>
        <p class="muted small">Sent through Formspree. See the <a href="privacy.html">privacy policy</a> for what is stored.</p>
      </form>
    </div>`;
  if (!configured) return;
  const form = $("#feedback-form"), status = $("#fb-status"), submit = $("#fb-submit");
  const field = id => $("#" + id);
  const message = field("fb-message"), count = field("fb-count");
  const renderedAt = Date.now();
  const setError = (input, errorId, text) => {
    field(errorId).textContent = text || "";
    if (text) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  };
  message.addEventListener("input", () => { count.textContent = message.value.length + " / " + FEEDBACK_MESSAGE_RANGE[1]; });
  const validate = () => {
    let first = null;
    const category = field("fb-category"), email = field("fb-email");
    const text = message.value.trim();
    const emailValue = email.value.trim();
    if (!category.value) { setError(category, "fb-category-error", "Choose what the feedback is about."); first = first || category; } else setError(category, "fb-category-error", "");
    if (text.length < FEEDBACK_MESSAGE_RANGE[0]) { setError(message, "fb-message-error", `Please write at least ${FEEDBACK_MESSAGE_RANGE[0]} characters so we can act on it.`); first = first || message; }
    else if (text.length > FEEDBACK_MESSAGE_RANGE[1]) { setError(message, "fb-message-error", `Please keep it under ${FEEDBACK_MESSAGE_RANGE[1]} characters.`); first = first || message; }
    else setError(message, "fb-message-error", "");
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) { setError(email, "fb-email-error", "That email address doesn't look right."); first = first || email; } else setError(email, "fb-email-error", "");
    if (first) first.focus();
    return !first;
  };
  form.onsubmit = async event => {
    event.preventDefault();
    status.className = "feedback-status"; status.textContent = "";
    if (!validate()) return;
    /* Spam gates: honeypot filled, submitted faster than a human could type, or a repeat inside the cooldown. */
    if (field("fb-website").value) { status.className = "feedback-status ok"; status.textContent = "Thanks, your feedback was received."; form.reset(); return; }
    if (Date.now() - renderedAt < FEEDBACK_MIN_SECONDS * 1000) { status.className = "feedback-status err"; status.textContent = "Please take a moment to review your message before sending."; return; }
    const last = Number(Store.get("feedback_last", 0)) || 0;
    if (Date.now() - last < FEEDBACK_COOLDOWN_MS) { status.className = "feedback-status err"; status.textContent = "You sent feedback a moment ago. Please wait a couple of minutes before sending more."; return; }
    if (navigator.onLine === false) { status.className = "feedback-status err"; status.textContent = "You appear to be offline. Copy your message and try again when you are back online."; return; }
    submit.disabled = true; status.textContent = "Sending…";
    const payload = {
      category: field("fb-category").value,
      page: field("fb-page").value.trim().slice(0, 200),
      message: message.value.trim(),
      email: field("fb-email").value.trim(),
      _subject: "CardiacSchool feedback: " + field("fb-category").value
    };
    try {
      const response = await fetch("https://formspree.io/f/" + encodeURIComponent(config.formspreeId), {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      Store.set("feedback_last", Date.now(), { silent: true });
      form.reset(); count.textContent = "0 / " + FEEDBACK_MESSAGE_RANGE[1];
      status.className = "feedback-status ok"; status.textContent = "Thanks, your feedback was sent. Every clinical report is reviewed.";
    } catch (error) {
      status.className = "feedback-status err";
      status.textContent = "Sending failed. Please try again, or email " + (config.contactEmail || "the course team") + ".";
    } finally { submit.disabled = false; }
  };
}

/* ---------- awards ---------- */
function viewAwards() {
  const st = achState();
  const unlocked = Object.keys(st).length;
  const li = levelInfo(xpTotal());
  const ranks = LEVELS.map((l, i) => `
    <div class="rank-row ${li.n > i ? "reached" : li.n === i + 1 ? "" : "future"}">
      <div class="lvl-badge sm ${li.n >= i + 1 ? "" : "ghost"}">${i + 1}</div>
      <span class="rank-title">${l.title}</span>
      <span class="muted small">${l.xp.toLocaleString()} XP</span>
    </div>`).join("");
  const badges = ACHIEVEMENTS.map(a => {
    const got = st[a.id];
    return `<div class="badge ${got ? "got" : "locked"}">
      <span class="badge-ico">${got ? a.icon : "🔒"}</span>
      <span class="badge-title">${a.title}</span>
      <span class="badge-desc">${a.desc}</span>
      ${got ? `<span class="badge-date">${new Date(got).toLocaleDateString()}</span>` : ""}
    </div>`;
  }).join("");
  $("#main").innerHTML = `
    <div class="page-head"><div><h1>Awards</h1><p>${unlocked}/${ACHIEVEMENTS.length} achievements unlocked · each badge is worth bragging rights and the XP that got you there.</p></div></div>
    <div class="grid-2">
      <div class="card"><h2>${IC("grad")} Rank ladder</h2>${ranks}</div>
      <div class="card"><h2>${IC("trophy")} Achievements</h2><div class="badge-grid">${badges}</div></div>
    </div>`;
}

/* ---------- router ---------- */
function authorizePacingRoute(hash) {
  if (window.StaffPreview?.active()) return { allowed: true };
  const sourceMatch = /^#\/cards\/source\/([^/]+)\/([^/]+)\/?$/.exec(String(hash || ""));
  if (sourceMatch && window.CardCatalog) {
    try {
      const type = decodeURIComponent(sourceMatch[1]), id = decodeURIComponent(sourceMatch[2]);
      const cards = CardCatalog.forSource(type, id);
      if (cards.length && !cards.some(card => cardGateUnlocked(card))) {
        return { allowed: false, kind: "prerequisite", reason: "Complete this learning item before opening its full flashcard deck." };
      }
    } catch (error) { return { allowed: true }; }
  }
  if (!window.Pacing || typeof window.Pacing.authorizeRoute !== "function") return { allowed: true };
  try {
    const result = window.Pacing.authorizeRoute(hash);
    if (typeof result === "boolean") return { allowed: result };
    return result && typeof result === "object" ? Object.assign({ allowed: true }, result) : { allowed: true };
  } catch (error) {
    return { allowed: true, failOpen: true };
  }
}
/* ---------- per-route document title + description ---------- */
const DEFAULT_META = { title: "CardiacSchool — 14-Day Cardiac Surgery Trainer", description: "" };
const ROUTE_META = {
  "": ["Today", "Your 14-day adult cardiac surgery course: today's lessons, flashcards, labs and quests."],
  plan: ["14-Day Plan", "The complete 14-day adult cardiac surgery curriculum, day by day."],
  extras: ["Library", "Anatomy atlas, operative library, coronary angiography, landmark trials, viva and exercises."],
  day: parts => ["Day " + (parts[1] || ""), "Lessons, exercises and connected stations for day " + (parts[1] || "") + " of the cardiac surgery course."],
  lesson: parts => { const lesson = window.LESSONS && window.LESSONS[parts[1]]; return [lesson ? lesson.title : "Lesson", lesson ? "Lesson: " + lesson.title + "." : null]; },
  cards: ["Flashcards", "Spaced-repetition flashcards for adult cardiac surgery, unlocked lesson by lesson."],
  quiz: ["Question Bank", "Clinical judgment MCQs for adult cardiac surgery with explanations and weakness drills."],
  exam: ["Final Exam", "Timed final examination for the 14-day cardiac surgery course."],
  exercises: ["Exercises", "Applied reasoning exercises for adult cardiac surgery."],
  exercise: ["Exercise", "Applied reasoning exercise for adult cardiac surgery."],
  viva: ["Oral Viva", "Oral examination cases in adult cardiac surgery."],
  surgery: ["Operative Library", "Step-by-step walkthroughs of adult cardiac operations: sternotomy, bypass, CABG, valves, aorta and LVAD."],
  angiography: ["Coronary Angiography", "Learn to read coronary angiograms: projections, cases, drills and an atlas."],
  physiology: ["Physiology Labs", "Interactive cardiac physiology labs: bypass console, pressure-volume loops, pacing, IABP, ECG and more."],
  crisis: ["Crisis Room", "Time-critical cardiac surgical crisis simulations."],
  progress: ["Progress", "Your mastery, pacing and progress backups."],
  awards: ["Awards", "Achievements earned across the 14-day cardiac surgery course."],
  anatomy: ["Anatomy Atlas", "Surgical anatomy of the heart: chambers, valves, coronaries, conduction and operative access."],
  "anat-cards": ["Anatomy Cards", "Anatomy flashcards for adult cardiac surgery."],
  trials: ["Landmark Trials", "The clinical trials that shape adult cardiac surgical decisions."],
  feedback: ["Send Feedback", "Report a clinical error, a bug or a suggestion to the CardiacSchool team."]
};
function applyRouteMeta(parts) {
  let entry = ROUTE_META[parts[0] || ""];
  if (typeof entry === "function") { try { entry = entry(parts); } catch (error) { entry = null; } }
  const title = entry && entry[0] ? entry[0] + " · CardiacSchool" : DEFAULT_META.title;
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (!meta) return;
  if (!DEFAULT_META.description) DEFAULT_META.description = meta.getAttribute("content") || "";
  meta.setAttribute("content", entry && entry[1] ? entry[1] : DEFAULT_META.description);
}
let previousRouteHash = "";
function route() {
  const h = location.hash || "#/";
  let parts;
  try { parts = h.slice(2).split("/").map(decodeURIComponent); }
  catch (error) { location.replace("#/"); return; }
  syncPacingCredits();
  if (window.Pacing && typeof window.Pacing.reconcile === "function") {
    try { window.Pacing.reconcile("route"); } catch (error) { /* fail open */ }
  }
  const access = authorizePacingRoute(h);
  if (h !== "#/exam" || !access.allowed) pauseExam();
  if (window.CSLab && typeof window.CSLab.teardown === "function") window.CSLab.teardown();
  if (window.Surgery && typeof window.Surgery.teardown === "function") window.Surgery.teardown();
  if (window.Angiography && typeof window.Angiography.teardown === "function") window.Angiography.teardown();
  window.scrollTo(0, 0);
  const main = $("#main");
  main.classList.toggle("physiology-page", parts[0] === "physiology");
  main.classList.toggle("angiography-page", parts[0] === "angiography");
  main.classList.remove("page-anim"); void main.offsetWidth; main.classList.add("page-anim");
  if (!access.allowed) renderPacingLock(access);
  else if (h === "#/" || h === "") viewDashboard();
  else if (parts[0] === "plan") viewPlan();
  else if (parts[0] === "extras") viewExtras();
  else if (parts[0] === "day" && window.Daily) window.Daily.render(parts);
  else if (parts[0] === "lesson") viewLesson(parts[1]);
  else if (parts[0] === "cards") viewCards();
  else if (parts[0] === "quiz" && parts[1] === "day") startQuiz(unlockedQuestions().filter(q => q.day === +parts[2]), "Day " + parts[2] + " question bank", 40, "standard");
  else if (parts[0] === "quiz" && parts[1] === "topic") startQuiz(unlockedQuestions().filter(q => q.topic === parts[2]), parts[2], 15, "standard");
  else if (parts[0] === "quiz" && parts[1] === "weak") {
    const s = qStats();
    startQuiz((window.QUESTIONS || []).filter(q => s[q.id] && s[q.id].ok < s[q.id].seen), "Weakness drill", 15, "weak");
  }
  else if (parts[0] === "quiz") viewQuizMenu();
  else if (parts[0] === "exam") viewExamIntro();
  else if (parts[0] === "exercises") viewExerciseList();
  else if (parts[0] === "exercise") viewExercise(parts[1]);
  else if (parts[0] === "viva" && parts[1]) viewVivaCase(parts[1]);
  else if (parts[0] === "viva") viewViva();
  else if (parts[0] === "surgery" && window.Surgery) window.Surgery.render(parts);
  else if (parts[0] === "angiography" && window.Angiography) window.Angiography.render(parts);
  else if (["physiology", "crisis"].includes(parts[0]) && window.Advanced) window.Advanced.render(parts);
  else if (parts[0] === "progress") viewProgress();
  else if (parts[0] === "feedback") viewFeedback(previousRouteHash);
  else if (parts[0] === "awards") viewAwards();
  else if (parts[0] === "anatomy" && window.Anatomy) window.Anatomy.render(parts);
  else if (parts[0] === "anat-cards" && window.Anatomy) window.Anatomy.renderCards(parts);
  else if (parts[0] === "trials" && window.Trials) window.Trials.render(parts);
  else { location.replace("#/"); return; }
  previousRouteHash = h;
  applyRouteMeta(parts);
  renderNav();
  if(window.StudioUI)window.StudioUI.decorate();
  const focusTarget = $("#main").querySelector(".pacing-lock-screen") || $("#main");
  focusTarget.focus({ preventScroll: true });
  window.StaffTour?.onRoute();
  requestAnimationFrame(() => window.scrollTo(0, 0));
}

/* ---------- pacing lifecycle ---------- */
let pacingMidnightTimer = null;
let pacingReconciling = false;
const PACING_RELEVANT_KEYS = new Set(PACING_COMPLETION_KEYS.concat(["pacingCredit", "recovery", "enrollment", "startDate", "adminOverride"]));
function schedulePacingMidnight() {
  if (pacingMidnightTimer) clearTimeout(pacingMidnightTimer);
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
  pacingMidnightTimer = setTimeout(() => {
    reconcilePacingRuntime("midnight", true);
    schedulePacingMidnight();
  }, Math.max(1000, next.getTime() - now.getTime()));
}
function pacingHubRoute() {
  return ["#/", "", "#/plan", "#/progress", "#/extras", "#/quiz", "#/exercises", "#/viva", "#/anatomy", "#/trials", "#/surgery", "#/physiology", "#/awards"].includes(location.hash || "#/");
}
function reconcilePacingRuntime(reason, refreshHub) {
  if (pacingReconciling) return;
  pacingReconciling = true;
  try {
    syncPacingCredits();
    if (window.Pacing && typeof window.Pacing.reconcile === "function") window.Pacing.reconcile(reason);
    const access = authorizePacingRoute(location.hash || "#/");
    if (!access.allowed) {
      renderPacingLock(access);
      renderNav();
      const lock = $("#main").querySelector(".pacing-lock-screen");
      if (lock) lock.focus({ preventScroll: true });
    } else if ($("#main").querySelector(".pacing-lock-screen") || refreshHub && pacingHubRoute()) {
      route();
    } else {
      renderNav();
    }
  } catch (error) {
    /* Pacing is motivational, never a security boundary: unexpected runtime
       failures keep learning content open. */
  } finally {
    pacingReconciling = false;
  }
}
function showUpdateReady(registration) {
  if (document.querySelector("#update-ready")) return;
  const notice = document.createElement("div");
  notice.id = "update-ready";
  notice.className = "update-ready";
  notice.setAttribute("role", "status");
  notice.innerHTML = `<div><b>Course update ready</b><span>Your current screen will not reload automatically.</span></div>
    <button class="btn sm">Apply update</button><button class="ghost-btn" aria-label="Dismiss update notice">×</button>`;
  document.body.appendChild(notice);
  notice.querySelector(".ghost-btn").onclick = () => notice.remove();
  notice.querySelector(".btn").onclick = () => {
    pauseExam();
    const waiting = registration.waiting;
    if (!waiting) return;
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      location.reload();
    });
    waiting.postMessage({ type: "SKIP_WAITING" });
  };
}
function registerCourseWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  navigator.serviceWorker.register("./sw.js?v=66-surgery-images").then(registration => {
    if (registration.waiting && navigator.serviceWorker.controller) showUpdateReady(registration);
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdateReady(registration);
      });
    });
  }).catch(() => {});
}

/* ---------- boot ---------- */
(function init() {
  if (!window.StaffPreview?.role()) {
    window.StaffTour?.showArrival();
    return;
  }
  migrateDay14QuestionStats();
  migrateCrisisCompletions();
  /* Add legacy standalone schedules only when their IDs are absent. A missing,
     malformed or inaccessible shared scheduler is never silently replaced. */
  migrateLegacySrsSafely();
  copyExactCardAliasesSafely(window.CARD_ID_ALIASES || {});
  window.ALL_LESSONS = Object.values(window.LESSONS || {}).sort((a, b) => a.day - b.day || a.ord - b.ord);
  migrateEnrollment();
  initializePacing();
  const savedTheme = Store.get("theme", null);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = savedTheme || "light";
  $("#theme-toggle").onclick = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; Store.set("theme", next); renderNav();
  };
  registerCourseWorker();
  schedulePacingMidnight();
  window.addEventListener("cs:store-change", event => {
    const key = event.detail && event.detail.key;
    if (PACING_RELEVANT_KEYS.has(key)) reconcilePacingRuntime("same-tab:" + key, false);
  });
  window.addEventListener("storage", event => {
    if (event.key === "cs_enrollment" && event.newValue === null) {
      location.hash = "#/";
      location.reload();
      return;
    }
    if (!event.key || PACING_RELEVANT_KEYS.has(String(event.key).replace(/^cs_/, ""))) {
      reconcilePacingRuntime("cross-tab", true);
    }
  });
  window.addEventListener("pageshow", () => reconcilePacingRuntime("pageshow", true));
  window.addEventListener("focus", () => reconcilePacingRuntime("focus", true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") reconcilePacingRuntime("visibility", true);
  });
  /* The skip link targets #main, which the hash router would otherwise treat as
     a route and bounce back to the dashboard. */
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) skipLink.addEventListener("click", event => { event.preventDefault(); $("#main").focus(); });
  window.addEventListener("hashchange", route);
  route();
  if (window.StaffPreview.active()) window.StaffTour?.startIfNeeded();
})();
