/* A tab-scoped audience and storage boundary. It is deliberately established
   before app.js initializes pacing, schedules or migrations. */
(function () {
  "use strict";
  const ROLE_KEY = "cardiac-school-audience-v1";
  const PREFIX = "staff-preview:";
  let fallbackRole = null;
  const memory = new Map();
  function role() {
    try { return sessionStorage.getItem(ROLE_KEY) || fallbackRole; }
    catch (_) { return fallbackRole; }
  }
  function choose(next) {
    if (next !== "student" && next !== "staff") return false;
    fallbackRole = next;
    try { sessionStorage.setItem(ROLE_KEY, next); } catch (_) {}
    location.reload();
    return true;
  }
  const storage = {
    getItem(key) {
      const name = PREFIX + key;
      try { return sessionStorage.getItem(name); }
      catch (_) { return memory.has(name) ? memory.get(name) : null; }
    },
    setItem(key, value) {
      const name = PREFIX + key;
      try { sessionStorage.setItem(name, String(value)); }
      catch (_) { memory.set(name, String(value)); }
    },
    removeItem(key) {
      const name = PREFIX + key;
      try { sessionStorage.removeItem(name); } catch (_) {}
      memory.delete(name);
    }
  };
  function patchPacing(pacing) {
    if (role() !== "staff" || !pacing || pacing.__staffPreview) return;
    ["canAccessCoreDay", "canAccessSource", "authorizeRoute"].forEach(name => {
      if (typeof pacing[name] === "function") pacing[name] = () => ({ allowed: true, reason: "Staff preview" });
    });
    if (typeof pacing.filterCards === "function") pacing.filterCards = cards => cards.slice();
    if (typeof pacing.filterQuestions === "function") pacing.filterQuestions = questions => questions.slice();
    pacing.__staffPreview = true;
  }
  window.StaffPreview = { role, choose, storage, patchPacing, active: () => role() === "staff" };
})();
