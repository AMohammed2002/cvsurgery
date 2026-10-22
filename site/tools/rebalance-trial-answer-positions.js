/* One-time mechanical rewrite: balance trial MCQ answer positions without
   altering clinical option text. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "../js/trials");
const files = fs.readdirSync(dir).filter(f => /^trials-(?!base).*\.js$/.test(f)).sort();
let globalIndex = 0, rewritten = 0;

for (const file of files) {
  const full = path.join(dir, file), source = fs.readFileSync(full, "utf8");
  const next = source.replace(/(options:\s*)\[(.*?)\](,\s*\n?\s*answer:\s*)(\d)/gs, (all, prefix, body, answerPrefix, answerRaw) => {
    const options = vm.runInNewContext("[" + body + "]");
    const oldAnswer = Number(answerRaw), target = globalIndex % options.length;
    globalIndex++;
    const correct = options[oldAnswer], distractors = options.filter((_, index) => index !== oldAnswer);
    const reordered = distractors.slice(); reordered.splice(target, 0, correct); rewritten++;
    return prefix + JSON.stringify(reordered) + answerPrefix + target;
  });
  fs.writeFileSync(full, next);
}

console.log("Rebalanced", rewritten, "trial questions across", files.length, "files.");
if (rewritten !== 60) process.exit(1);
