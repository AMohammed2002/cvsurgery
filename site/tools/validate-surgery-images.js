#!/usr/bin/env node
"use strict";

/* Original surgery figures must resolve locally and be available offline. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const site = path.resolve(__dirname, "..");
const surgery = path.join(site, "js", "surgery");
const context = { window: {} };
vm.createContext(context);
for (const name of ["surgery-base.js", ...fs.readdirSync(surgery).filter(name => /^surgery-(?!base).*\.js$/.test(name)).sort()]) {
  vm.runInContext(fs.readFileSync(path.join(surgery, name), "utf8"), context, { filename: name });
}

const worker = fs.readFileSync(path.join(site, "sw.js"), "utf8");
const ids = new Set();
let count = 0;
for (const section of context.window.SURGERY.sections) {
  let sectionCount = 0;
  for (const block of section.blocks) {
    for (const figure of block.figures || []) {
      assert.equal(typeof figure.id, "string", `${section.id}: figure id required`);
      assert.ok(figure.id && !ids.has(figure.id), `${section.id}: duplicate figure id ${figure.id}`);
      ids.add(figure.id);
      assert.match(figure.src, /^assets\/surgery-generated\/[a-z0-9-]+\/[a-z0-9-]+\.png$/, `${figure.id}: invalid local source`);
      assert.ok(figure.src.startsWith(`assets/surgery-generated/${section.id}/`), `${figure.id}: wrong article directory`);
      assert.ok(typeof figure.width === "number" && figure.width > 0, `${figure.id}: width required`);
      assert.ok(typeof figure.height === "number" && figure.height > 0, `${figure.id}: height required`);
      assert.ok(typeof figure.alt === "string" && figure.alt.trim().length >= 20, `${figure.id}: descriptive alt required`);
      assert.ok(typeof figure.caption === "string" && figure.caption.trim().length >= 30, `${figure.id}: explanatory caption required`);
      const file = path.join(site, figure.src);
      assert.ok(fs.existsSync(file), `${figure.id}: file missing`);
      const bytes = fs.readFileSync(file);
      assert.ok(bytes.length > 1000 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `${figure.id}: invalid PNG`);
      assert.equal(bytes.readUInt32BE(16), figure.width, `${figure.id}: width mismatch`);
      assert.equal(bytes.readUInt32BE(20), figure.height, `${figure.id}: height mismatch`);
      assert.ok(worker.includes(JSON.stringify(`./${figure.src}`)), `${figure.id}: missing offline cache entry`);
      sectionCount++;
      count++;
    }
  }
  assert.ok(sectionCount >= 3, `${section.id}: expected at least three accepted figures`);
}
assert.equal(context.window.SURGERY.sections.length, 13, "expected 13 surgery articles");
assert.ok(count >= 39, `expected at least 39 accepted figures, found ${count}`);
console.log(`Surgical illustrations: ${count} valid assets across 13 articles, all cached offline`);
