#!/usr/bin/env node
"use strict";

/* Launch policy: no copied textbook figures, captions or placements ship. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const site = path.resolve(__dirname, "..");
const absent = [
  "assets/key-questions",
  "css/figures.css",
  "js/media/image-registry.js",
  "js/media/image-placements.js"
];
absent.forEach(name => assert.ok(!fs.existsSync(path.join(site, name)), name + " must not be shipped"));
const index = fs.readFileSync(path.join(site, "index.html"), "utf8");
const worker = fs.readFileSync(path.join(site, "sw.js"), "utf8");
const figures = fs.readFileSync(path.join(site, "js/media/figures.js"), "utf8");
assert.doesNotMatch(index + worker, /assets\/key-questions|image-registry\.js|image-placements\.js/);
assert.doesNotMatch(figures, /<img|figcaption|caption|image\.src/);
function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) scan(name);
    else if (entry.name.endsWith(".js")) {
      const source = fs.readFileSync(name, "utf8");
      assert.doesNotMatch(source, /assets\/key-questions|What you are looking at|figure:\s*true/, name + " retains textbook figure material");
    }
  }
}
scan(path.join(site, "js"));
console.log("Textbook image policy: PASS (no assets, placements, captions or offline cache references)");
