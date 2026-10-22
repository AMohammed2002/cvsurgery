#!/usr/bin/env node
/* Alt-text gate: every <img> emitted by the app must carry alt text.
   Scans index.html and every .js under js/ (string templates and concatenations included).
   Rule: `alt="..."` with a non-empty value, OR `alt=""` only when the same line(s) carry
   aria-label / aria-hidden="true" (decorative image inside a labelled control).
   No dependencies. Exit 1 on any offender. */
"use strict";
const fs = require("fs"), path = require("path");

const root = path.join(__dirname, "..");
const files = [path.join(root, "index.html")];
(function collect(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
  });
})(path.join(root, "js"));

const offenders = [];
let sites = 0;
files.forEach(file => {
  const text = fs.readFileSync(file, "utf8");
  const re = /<img(?=[\s>])/g;
  let match;
  while ((match = re.exec(text))) {
    const start = match.index;
    const lineNo = text.slice(0, start).split("\n").length;
    const lineStart = text.lastIndexOf("\n", start) + 1;
    const before = text.slice(lineStart, start).trim();
    /* Skip prose mentions inside comments ("swaps the <img>, so ..."). */
    if (/^(?:\/\/|\/\*|\*)/.test(before)) continue;
    const close = text.indexOf(">", start);
    const tag = text.slice(start, close === -1 ? text.length : close + 1);
    if (/^<img>$/.test(tag) && !/["'`]/.test(before.slice(-1))) continue; /* bare "<img>" in prose */
    sites++;
    const lineEnd = text.indexOf("\n", close === -1 ? start : close);
    const snippet = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
    const label = `${path.relative(root, file)}:${lineNo}`;
    const alt = tag.match(/\balt=("|')(.*?)\1/);
    if (!alt) { offenders.push(`${label}: <img> has no alt attribute -> ${tag.slice(0, 120)}`); return; }
    if (alt[2].trim() === "") {
      const decorative = /aria-label=|aria-hidden="true"/.test(snippet);
      /* A src-less <img> is a template placeholder whose src and alt are set by script (e.g. a lightbox). */
      const placeholder = !/\bsrc=/.test(tag);
      if (!decorative && !placeholder) offenders.push(`${label}: alt="" without aria-label / aria-hidden="true" on the same line -> ${tag.slice(0, 120)}`);
    }
  }
});

if (offenders.length) {
  console.error("alt text: " + offenders.length + " offender(s)");
  offenders.forEach(line => console.error("  ✗ " + line));
  process.exit(1);
}
console.log("alt text: " + sites + " <img> sites checked");
