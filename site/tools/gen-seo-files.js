#!/usr/bin/env node
// Rewrites site/robots.txt and site/sitemap.xml from the siteUrl in js/config.js.
// Usage: node tools/gen-seo-files.js   (run from anywhere; paths resolve from this file)
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const site = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(site, "js", "config.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
const siteUrl = String((sandbox.window.CS_CONFIG || {}).siteUrl || "").replace(/\/+$/, "");
if (!/^https?:\/\//.test(siteUrl)) throw new Error("js/config.js: CS_CONFIG.siteUrl is missing or not an absolute URL");

const today = new Date().toISOString().slice(0, 10);
// Hash routes (#/plan, #/day/N ...) are not separate URLs, so only real files are listed.
const pages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/privacy.html", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms.html", changefreq: "yearly", priority: "0.3" },
];

const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(p => `  <url>\n    <loc>${siteUrl}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`).join("") +
  `</urlset>\n`;

fs.writeFileSync(path.join(site, "robots.txt"), robots);
fs.writeFileSync(path.join(site, "sitemap.xml"), sitemap);
console.log(`Wrote robots.txt and sitemap.xml for ${siteUrl} (lastmod ${today})`);
