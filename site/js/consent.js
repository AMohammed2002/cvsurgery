/* ============ CardiacSchool privacy notice + analytics consent ============
   The app sets no cookies and loads no third-party scripts, so today this is
   a one-time transparency notice. If CS_CONFIG.analytics is configured, the
   same banner becomes an accept/decline gate and the analytics script is only
   injected after an explicit "Accept". Decisions live in localStorage under
   cs_consent as { version, storage, analytics: "granted"|"denied"|null, at }. */
"use strict";
(function () {
  const KEY = "cs_consent";
  const VERSION = 1;
  const listeners = [];
  let analyticsLoaded = false;

  function config() { return (window.CS_CONFIG && window.CS_CONFIG.analytics) || null; }
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      return value && value.version === VERSION ? value : null;
    } catch (error) { return null; }
  }
  function write(decision) {
    const record = { version: VERSION, storage: true, analytics: decision, at: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(record)); } catch (error) { /* private mode: notice shows again next visit */ }
    if (decision === "granted") loadAnalytics();
    return record;
  }
  function granted() { return !!config() && read()?.analytics === "granted"; }
  function whenGranted(fn) {
    if (typeof fn !== "function") return;
    if (granted()) { fn(); return; }
    listeners.push(fn);
  }

  /* Only runs after an explicit Accept. Each provider is a plain script tag so
     there is nothing to load until then. */
  function loadAnalytics() {
    const a = config();
    if (!a || analyticsLoaded) return;
    analyticsLoaded = true;
    const script = document.createElement("script");
    script.defer = true;
    if (a.provider === "plausible") {
      script.src = a.src || "https://plausible.io/js/script.js";
      script.dataset.domain = a.domain || location.hostname;
    } else if (a.provider === "umami") {
      script.src = a.src;
      script.dataset.websiteId = a.websiteId;
    } else if (a.provider === "ga4") {
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.measurementId);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", a.measurementId, { anonymize_ip: true });
    } else { analyticsLoaded = false; return; }
    document.head.appendChild(script);
    listeners.splice(0).forEach(fn => { try { fn(); } catch (error) { /* ignore */ } });
  }

  function dismiss(el) {
    el.classList.add("is-leaving");
    const done = () => el.remove();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) done(); else setTimeout(done, 220);
  }

  function show() {
    if (document.querySelector("#consent-banner")) return;
    const withAnalytics = !!config();
    const el = document.createElement("section");
    el.id = "consent-banner";
    el.className = "consent-banner";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", withAnalytics ? "Analytics consent" : "Privacy notice");
    el.innerHTML = withAnalytics
      ? `<div><b>Help improve CardiacSchool?</b><span>Your progress stays in this browser. With your permission we also collect anonymous usage statistics. <a href="privacy.html">Privacy policy</a></span></div>
         <div class="consent-actions"><button type="button" class="btn sm" data-consent="granted">Accept</button><button type="button" class="btn sm secondary" data-consent="denied">Decline</button></div>`
      : `<div><b>Your progress stays on this device.</b><span>CardiacSchool keeps your course data in this browser only. No cookies, no tracking, no account. <a href="privacy.html">Privacy policy</a></span></div>
         <div class="consent-actions"><button type="button" class="btn sm" data-consent="none">OK</button></div>`;
    el.addEventListener("click", event => {
      const button = event.target.closest("[data-consent]");
      if (!button) return;
      const choice = button.dataset.consent;
      write(choice === "none" ? null : choice);
      dismiss(el);
    });
    document.body.appendChild(el);
  }

  function staffPreview() {
    /* The staff preview is a sandboxed session: nothing is written to
       localStorage, and the guided tour needs the lab controls unobstructed. */
    try { return sessionStorage.getItem("cardiac-school-audience-v1") === "staff"; } catch (error) { return false; }
  }

  function init() {
    if (staffPreview()) return;
    const saved = read();
    if (saved) {
      /* A visitor who said OK before analytics existed is asked again. */
      if (config() && saved.analytics == null) show();
      else if (saved.analytics === "granted") loadAnalytics();
      return;
    }
    show();
  }

  window.Consent = Object.freeze({ get: read, set: write, granted, whenGranted, show });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
