/* Data and geometry tests for the cath projection lab.
   Run: node tools/test-cath-projections.js */
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");

const root = path.join(__dirname, "..");
const context = { console };
context.window = context;
vm.createContext(context);
["js/physiology/lab-core.js", "js/physiology/labs-imaging.js"].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const lab = context.CSLab.get("cath-projections");
assert.ok(lab, "the cath projection lab is registered");

const { plates, targets, drills, lockDegrees, assetRoot } = lab;
let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks++; };

/* --- plates ------------------------------------------------------------- */
ok(plates.length === 11, `all eleven Cath Slides plates are present, found ${plates.length}`);
const ids = new Set();
for (const plate of plates) {
  ok(!ids.has(plate.id), `plate id ${plate.id} is unique`);
  ids.add(plate.id);
  ok(targets.some(t => t.id === plate.target), `${plate.id} names a known injection`);
  ok(fs.existsSync(path.join(root, assetRoot + plate.file)), `${plate.id} image exists at ${assetRoot}${plate.file}`);
  ok(plate.w > 0 && plate.h > 0, `${plate.id} declares intrinsic dimensions`);
  ok(plate.note && plate.note.length > 40, `${plate.id} explains what the view buys`);
  ok(plate.labels.length >= 5, `${plate.id} carries its source label set`);
  for (const label of plate.labels) {
    ok(label.x >= 0 && label.x <= 100 && label.y >= 0 && label.y <= 100, `${plate.id} hotspot ${label.t} is inside the frame`);
    ok(label.lx >= 0 && label.lx <= 100 && label.ly >= 0 && label.ly <= 100, `${plate.id} caption ${label.t} is inside the frame`);
  }
  const vocab = targets.filter(t => t.id === plate.target)[0].vocab;
  for (const label of plate.labels) ok(vocab.indexOf(label.t) !== -1, `${plate.id} label ${label.t} is in the ${plate.target} quiz vocabulary`);
  const seen = new Set(plate.labels.map(l => l.t));
  ok(seen.size === plate.labels.length, `${plate.id} has no duplicated label`);
}

/* --- lock geometry ------------------------------------------------------ */
/* Two views of the same injection must not sit inside each other's lock zone,
   or one of them could never be reached on its own. */
for (const target of targets) {
  const group = plates.filter(p => p.target === target.id);
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i], b = group[j];
      const overlaps = Math.abs(a.rot - b.rot) <= lockDegrees && Math.abs(a.tilt - b.tilt) <= lockDegrees;
      ok(!overlaps, `${a.id} and ${b.id} have separable lock zones (Δrot ${Math.abs(a.rot - b.rot)}°, Δtilt ${Math.abs(a.tilt - b.tilt)}°)`);
    }
  }
}
/* Every plate must be reachable inside the gantry's travel limits. */
for (const plate of plates) {
  ok(Math.abs(plate.rot) <= 60, `${plate.id} rotation ${plate.rot}° is within gantry travel`);
  ok(Math.abs(plate.tilt) <= 40, `${plate.id} tilt ${plate.tilt}° is within gantry travel`);
}
/* Sitting exactly on a plate's angles must open that plate and no other. */
for (const plate of plates) {
  const hits = plates.filter(p => p.target === plate.target
    && Math.abs(p.rot - plate.rot) <= lockDegrees && Math.abs(p.tilt - plate.tilt) <= lockDegrees);
  ok(hits.length === 1 && hits[0].id === plate.id, `${plate.id} angles resolve uniquely to itself`);
}

/* --- drills ------------------------------------------------------------- */
ok(drills.length === 8, `eight projection drills are authored, found ${drills.length}`);
for (const drill of drills) {
  const plate = plates.filter(p => p.id === drill.plate)[0];
  ok(plate, `drill target ${drill.plate} is a real plate`);
  ok(plate && plate.target === drill.target, `drill for ${drill.plate} names the matching injection`);
  ok(drill.goal.length > 60, `drill for ${drill.plate} states a clinical question`);
}
ok(new Set(drills.map(d => d.plate)).size === drills.length, "every drill asks for a different view");
ok(targets.every(t => drills.some(d => d.target === t.id)), "the drills cover all three injections");

/* --- lab contract ------------------------------------------------------- */
ok(typeof lab.render === "function", "the lab exposes a render function");
ok(lab.objectives.length >= 4, "the lab declares at least four objectives");
ok(lab.sourceSections.length >= 2, "the lab cites its sources");
ok((lab.linkedDays || []).indexOf(5) !== -1, "the lab is linked to imaging day 5");

console.log("Cath projection plates:", plates.length, "| labels:", plates.reduce((n, p) => n + p.labels.length, 0));
console.log("Assertions:", checks);
console.log("Failures: 0");
