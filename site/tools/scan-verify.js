/* scan-verify.js — reconcile inline <!-- VERIFY: ... --> markers with VERIFY_QUEUE.md.
 *
 *   node tools/scan-verify.js
 *
 * Lists every VERIFY marker currently in the content (data, surgery, physiology, advanced, trials),
 * with its file, and reports whether the running queue in ../VERIFY_QUEUE.md has been populated. It is
 * a bookkeeping aid for the Part-5 authoring loop, not a validator — it exits 0 always, but prints a
 * clear reconciliation summary so no number ships flagged-but-unlogged (or logged-but-un-flagged).
 */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const projectRoot = path.join(root, "..");

const scanDirs = ["js/data", "js/advanced", "js/surgery", "js/physiology", "js/trials", "js/anatomy", "js/angiography"];
const MARKER = /<!--\s*VERIFY:\s*([\s\S]*?)-->/g;

const found = [];
for (const rel of scanDirs) {
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".js")) continue;
    const p = path.join(dir, f);
    const txt = fs.readFileSync(p, "utf8");
    let m;
    MARKER.lastIndex = 0;
    while ((m = MARKER.exec(txt))) {
      const line = txt.slice(0, m.index).split("\n").length;
      found.push({ file: rel + "/" + f, line, claim: m[1].trim().replace(/\s+/g, " ") });
    }
  }
}

/* count logged rows in the queue (rows that are not the placeholder/header) */
let loggedRows = 0, queueExists = false;
const queuePath = path.join(projectRoot, "docs", "reference", "VERIFY_QUEUE.md");
if (fs.existsSync(queuePath)) {
  queueExists = true;
  const lines = fs.readFileSync(queuePath, "utf8").split("\n");
  for (const l of lines) {
    const cells = l.split("|").map(c => c.trim());
    // a data row looks like: | <#> | <day> | ... ; first cell empty, second is an integer
    if (cells.length > 6 && /^\d+$/.test(cells[1])) loggedRows++;
  }
}

console.log("=== scan-verify.js ===");
console.log(`VERIFY markers in content: ${found.length}`);
for (const f of found) console.log(`  • ${f.file}:${f.line}  ${f.claim.slice(0, 100)}`);
console.log(`\nVERIFY_QUEUE.md: ${queueExists ? "present" : "MISSING"}, logged rows: ${loggedRows}`);

if (found.length && loggedRows < found.length) {
  console.log(`\n⚠ ${found.length - loggedRows} marker(s) in content may not yet be logged as queue rows — log them before submitting the day (Part 5.6).`);
} else if (found.length === 0 && loggedRows === 0) {
  console.log("\n✓ No VERIFY markers outstanding and no queue rows — clean (expected before content authoring begins).");
} else {
  console.log("\n✓ Marker count is covered by the queue rows.");
}
process.exit(0);
