#!/usr/bin/env node
"use strict";

/* Static/offline release guard. The service worker intentionally discovers its
   shell from index.html, so every local dependency must exist and cache-version
   handshakes must stay synchronized. */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const swPath = path.join(root, "sw.js");
const appPath = path.join(root, "js", "app.js");
const html = fs.readFileSync(indexPath, "utf8");
const sw = fs.readFileSync(swPath, "utf8");
const app = fs.readFileSync(appPath, "utf8");

const localRefs = Array.from(html.matchAll(/(?:src|href)=["']([^"']+)["']/g), match => match[1])
  .filter(ref => ref && !/^(?:https?:|data:|#)/.test(ref));
const missing = localRefs.filter(ref => {
  const clean = ref.split("?")[0].replace(/^\.\//, "");
  return clean !== "" && !fs.existsSync(path.join(root, clean));
});
assert.deepStrictEqual(missing, [], "every index dependency required by the offline shell exists");

assert.ok(!fs.existsSync(path.join(root, "assets", "key-questions")), "textbook image assets are absent from the offline app");
assert.doesNotMatch(html + sw, /assets\/key-questions|image-registry\.js|image-placements\.js/, "offline shell does not reference textbook figures");

const shellVersion = (sw.match(/SHELL_CACHE\s*=\s*CACHE_PREFIX\s*\+\s*["']shell-v(\d+)[^"']*["']/) || [])[1];
const registrationVersion = (app.match(/serviceWorker\.register\(["']\.\/sw\.js\?v=(\d+)[^"']*["']/) || [])[1];
assert.ok(shellVersion, "service worker declares a versioned shell cache");
assert.strictEqual(registrationVersion, shellVersion, "app registration query and shell cache version stay synchronized");

assert.match(sw, /fetch\(event\.request, \{ cache: "no-store" \}\)/,
  "hard reloads and ordinary online requests use network-first fresh content");
assert.match(sw, /function isImmutableAsset[\s\S]*request\.mode === "navigate"\) return false[\s\S]*caches\.match\(event\.request\)\.then\(cached => cached \|\| fetch\(event\.request\)/,
  "versioned assets and media are served cache-first while navigations stay network-first");
assert.match(sw, /const cached = await caches\.match\(event\.request\)/,
  "offline requests fall back to the matching cached asset");
assert.match(sw, /event\.request\.mode === "navigate"[\s\S]*shellCache\.match\("\.\/index\.html"\)/,
  "offline navigations fall back to the cached app shell");
assert.doesNotMatch((sw.match(/self\.addEventListener\("install"[\s\S]*?\n\}\);/) || [""])[0], /skipWaiting/,
  "install does not replace the active worker without learner approval");
assert.match(sw, /event\.data\.type === "SKIP_WAITING"/,
  "the explicit update action can activate a fully installed worker");

const retrievalPacks = fs.readdirSync(path.join(root, "js", "data"))
  .filter(name => /^flashcard-claims-.+\.js$/.test(name) || /^flashcards-retrieval-.+\.js$/.test(name));
retrievalPacks.forEach(name => assert.match(html, new RegExp("js/data/" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  "offline index loads retrieval pack " + name));

console.log("offline shell, hard-reload, and service-worker update guards passed");
