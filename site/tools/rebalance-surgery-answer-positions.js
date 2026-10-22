/* One-time mechanical rewrite: move each surgery answer with its key into a
   balanced A/B/C/D sequence. Clinical text is unchanged. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "../js/surgery");
const files = fs.readdirSync(dir).filter(f => /^surgery-(?!base).*\.js$/.test(f)).sort();
let globalIndex = 0, rewritten = 0;

for (const file of files) {
  const full = path.join(dir, file);
  const source = fs.readFileSync(full, "utf8");
  const next = source.replace(/(options:\s*)\[(.*?)\](,\s*\n?\s*answer:\s*)(\d)/gs, (all, prefix, body, answerPrefix, answerRaw) => {
    const options = vm.runInNewContext("[" + body + "]");
    const oldAnswer = Number(answerRaw), target = globalIndex % options.length;
    globalIndex++;
    const correct = options[oldAnswer];
    const distractors = options.filter((_, index) => index !== oldAnswer);
    const reordered = distractors.slice();
    reordered.splice(target, 0, correct);
    rewritten++;
    return prefix + JSON.stringify(reordered) + answerPrefix + target;
  });
  fs.writeFileSync(full, next);
}

console.log("Rebalanced", rewritten, "surgery questions across", files.length, "files.");
if (rewritten !== 323) {
  console.error("Expected 323 surgery questions; refusing to treat this rewrite as complete.");
  process.exit(1);
}
