#!/usr/bin/env node
/* Link checker for the hash-routed CardiacSchool shell. No dependencies (Node >= 18 for --network).

   default   static: every href="#/..." and location.hash = "#/..." in index.html and js/** must
             start with a path segment that route() in js/app.js handles. Also lists in-page
             href="#anchor" links (not "#/" routes), which a hash router will swallow, and
             relative href="x.html" links whose file is missing. Exit 1 on unhandled route targets.
   --network fetch every distinct external http(s) URL in js/** and index.html (GET, redirects
             followed, 15 s timeout, browser-like UA, concurrency 5) and print "status url". */
"use strict";
const fs = require("fs"), path = require("path");

const root = path.join(__dirname, "..");
const rel = file => path.relative(root, file);
const files = [path.join(root, "index.html")];
(function collect(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
  });
})(path.join(root, "js"));

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

function staticMode() {
  const appSource = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  const routeStart = appSource.indexOf("function route()");
  if (routeStart === -1) { console.error("check-links: cannot find function route() in js/app.js"); process.exit(1); }
  const routeEnd = appSource.indexOf("\n}", routeStart);
  const routeBody = appSource.slice(routeStart, routeEnd);
  const handled = new Set([""]);
  routeBody.replace(/parts\[0\]\s*===\s*"([^"]+)"/g, (m, seg) => { handled.add(seg); return m; });
  routeBody.replace(/\[((?:\s*"[^"]+"\s*,?)+)\]\.includes\(parts\[0\]\)/g, (m, list) => {
    list.replace(/"([^"]+)"/g, (n, seg) => { handled.add(seg); return n; });
    return m;
  });

  const routeTargets = [];   /* {file, line, target} */
  const pageAnchors = [];    /* href="#foo" */
  const missingFiles = [];   /* href="x.html" that does not exist */
  files.forEach(file => {
    const text = fs.readFileSync(file, "utf8");
    const hrefRe = /href=(["'])(#[^"']*)\1/g;
    let m;
    while ((m = hrefRe.exec(text))) {
      const target = m[2];
      const line = lineOf(text, m.index);
      if (target.startsWith("#/")) routeTargets.push({ file, line, target });
      /* The skip link (#main) is intercepted in app.js init() with preventDefault + focus(). */
      else if (target !== "#main") pageAnchors.push({ file, line, target });
    }
    const hashRe = /location\.hash\s*=\s*(["'`])(#\/[^"'`]*)\1/g;
    while ((m = hashRe.exec(text))) routeTargets.push({ file, line: lineOf(text, m.index), target: m[2] });
    const fileRe = /href=(["'])([\w./-]+\.html?)\1/g;
    while ((m = fileRe.exec(text))) {
      if (/^https?:/.test(m[2])) continue;
      if (!fs.existsSync(path.join(root, m[2]))) missingFiles.push({ file, line: lineOf(text, m.index), target: m[2] });
    }
  });

  const unhandled = [], dynamic = [];
  routeTargets.forEach(item => {
    const seg = item.target.slice(2).split(/[\/?#]/)[0];
    if (seg.includes("${") || seg.includes("' +") || seg.includes("\" +")) { dynamic.push(item); return; }
    if (!handled.has(seg)) unhandled.push(item);
  });

  console.log(`check-links: ${routeTargets.length} hash-route targets in ${files.length} files; route() handles [${Array.from(handled).filter(Boolean).sort().join(", ")}]`);
  if (dynamic.length) {
    console.log(`  ${dynamic.length} target(s) with a dynamic first segment were not checked:`);
    dynamic.forEach(item => console.log(`    ? ${rel(item.file)}:${item.line} ${item.target}`));
  }
  if (pageAnchors.length) {
    console.log(`  ${pageAnchors.length} in-page anchor(s) that are not "#/" routes (a hash router will treat these as navigation):`);
    pageAnchors.forEach(item => console.log(`    ! ${rel(item.file)}:${item.line} href="${item.target}"`));
  }
  if (missingFiles.length) {
    console.log(`  ${missingFiles.length} relative href(s) to files that do not exist:`);
    missingFiles.forEach(item => console.log(`    ! ${rel(item.file)}:${item.line} href="${item.target}"`));
  }
  if (unhandled.length) {
    console.error(`  ${unhandled.length} route target(s) whose first segment route() does not handle:`);
    unhandled.forEach(item => console.error(`    ✗ ${rel(item.file)}:${item.line} ${item.target}`));
    process.exit(1);
  }
  console.log("check-links: all hash-route targets are handled");
}

async function networkMode() {
  /* Reserved placeholder hosts (RFC 2606 .example / example.com, localhost) and the w3.org namespace URIs are not links. */
  const ignore = /(?:^|\.)(?:w3\.org|localhost|example|example\.com)$|^127\.0\.0\.1$/;
  const seen = new Map(); /* url -> [file:line] */
  files.forEach(file => {
    const text = fs.readFileSync(file, "utf8");
    const re = /https?:\/\/[^\s"'`<>)\\]+/g;
    let m;
    while ((m = re.exec(text))) {
      let url = m[0].replace(/[.,;:]+$/, "");
      let host;
      try { host = new URL(url).hostname; } catch (error) { continue; }
      if (ignore.test(host)) continue;
      if (!seen.has(url)) seen.set(url, []);
      seen.get(url).push(`${rel(file)}:${lineOf(text, m.index)}`);
    }
  });
  const urls = Array.from(seen.keys()).sort();
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      try {
        const response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(15000),
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
        });
        results.push({ url, status: response.status, finalUrl: response.url });
        try { await response.body?.cancel(); } catch (error) { /* ignore */ }
      } catch (error) {
        results.push({ url, status: "ERR", note: (error && (error.cause && error.cause.code || error.name || error.message)) || "error" });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(5, urls.length) }, worker));
  results.sort((a, b) => a.url.localeCompare(b.url));
  results.forEach(item => console.log(`${String(item.status).padEnd(4)} ${item.url}${item.note ? "  (" + item.note + ")" : ""}`));
  const bad = results.filter(item => typeof item.status !== "number" || item.status < 200 || item.status >= 300);
  console.log(`\ncheck-links --network: ${results.length} URLs checked, ${bad.length} non-2xx`);
  bad.forEach(item => console.log(`  ✗ ${item.status} ${item.url}\n      ${seen.get(item.url).join(", ")}`));
  process.exit(bad.length ? 1 : 0);
}

if (process.argv.includes("--network")) networkMode();
else staticMode();
