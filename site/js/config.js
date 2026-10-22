/* ============ CardiacSchool site configuration ============
   One place for everything that changes between environments.
   Edit the values below, then run `node tools/gen-seo-files.js`
   so robots.txt and sitemap.xml pick up the new siteUrl.
   Nothing in this file is secret: it ships to every visitor. */
"use strict";
window.CS_CONFIG = Object.freeze({
  /* Public origin of the deployed site, no trailing slash. Replace the
     placeholder with the real domain before launch. */
  siteUrl: "https://cardiacschool.example",
  siteName: "CardiacSchool",
  /* Optional. When empty, the feedback form points visitors to "the course team"
     and no mailto link is rendered anywhere. */
  contactEmail: "",
  /* Formspree form id (the part after https://formspree.io/f/). Leave empty
     until a form has been created; the feedback page then explains that
     feedback is not configured yet instead of failing silently. */
  formspreeId: "",
  /* Analytics are off. To enable later, set one of:
       { provider: "plausible", domain: "cardiacschool.example" }  cookieless
       { provider: "umami", websiteId: "...", src: "https://..." }  cookieless
       { provider: "ga4", measurementId: "G-XXXXXXX" }            sets cookies
     js/consent.js loads the script only after the visitor accepts, and the
     privacy policy must be updated to match. */
  analytics: null
});
