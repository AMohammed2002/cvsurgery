#!/usr/bin/env node
/* Rotate the Course Override password.
   Usage: node tools/set-override-password.js "<new password>"
   Rewrites ADMIN_OVERRIDE_PASSWORD_HASH in js/app.js with a salted SHA-256.
   The clear-text password is never written anywhere; keep it in a password manager.
   The override test reads CS_OVERRIDE_PASSWORD from the environment, so after
   rotating run: CS_OVERRIDE_PASSWORD="<new password>" node tools/validate.js */
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error("Usage: node tools/set-override-password.js \"<new password, 8+ characters>\"");
  process.exit(1);
}
const appPath = path.join(__dirname, "..", "js", "app.js");
const source = fs.readFileSync(appPath, "utf8");
const salt = (source.match(/const ADMIN_OVERRIDE_SALT = "([^"]+)";/) || [])[1];
if (!salt) { console.error("ADMIN_OVERRIDE_SALT not found in js/app.js"); process.exit(1); }
const hash = crypto.createHash("sha256").update(salt + ":" + password).digest("hex");
const pattern = /const ADMIN_OVERRIDE_PASSWORD_HASH = "[0-9a-f]{64}";/;
if (!pattern.test(source)) { console.error("ADMIN_OVERRIDE_PASSWORD_HASH not found in js/app.js"); process.exit(1); }
fs.writeFileSync(appPath, source.replace(pattern, `const ADMIN_OVERRIDE_PASSWORD_HASH = "${hash}";`));
console.log("Override password hash updated in js/app.js. Remember to bump the cache version and redeploy.");
