#!/usr/bin/env node
"use strict";

/* Production gate: run the complete technical suite, then require a named,
   dated clinician sign-off for every authored learning point. Editorial or AI
   review is intentionally insufficient for this final medical-content gate. */

const path = require("path");
const child = require("child_process");

function run(script, args) {
  const result = child.spawnSync(process.execPath, [path.join(__dirname, script)].concat(args || []), { stdio: "inherit" });
  if (result.status) process.exit(result.status);
}

run("validate.js");
run("validate-retrieval-cards.js", ["--clinical-release"]);
console.log("Release validation passed, including clinician sign-off.");
