/* Real-browser regression for the sequential staff preview.
   Run: STAFF_TOUR_PLAYWRIGHT=/path/to/playwright node tools/test-staff-tour.js
   Optional: STAFF_TOUR_SCREENSHOTS=/tmp/staff-tour-qa */
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.STAFF_TOUR_PLAYWRIGHT || "playwright");
const root = path.resolve(__dirname, "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ttf": "font/ttf" };

function server() {
  return http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
    catch (_) { response.writeHead(400).end(); return; }
    const filename = path.resolve(root, "." + pathname, pathname.endsWith("/") ? "index.html" : "");
    if (filename !== root && !filename.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.readFile(filename, (error, bytes) => {
      if (error) { response.writeHead(404).end(); return; }
      response.writeHead(200, { "content-type": mime[path.extname(filename)] || "application/octet-stream" });
      response.end(bytes);
    });
  });
}

async function step(page, stop, phase) {
  try {
    await page.waitForFunction(expected => {
      const current = window.StaffTour?.state();
      return current?.stop === expected.stop && current?.phase === expected.phase
        && document.querySelector('.staff-tour-box[data-tour-id="' + expected.stop + '"][data-tour-phase="' + expected.phase + '"]');
    }, { stop, phase }, { timeout: 15000 });
  } catch (error) {
    const info = await page.evaluate(() => ({ state: window.StaffTour?.state(), hash: location.hash, box: document.querySelector(".staff-tour-box")?.textContent })).catch(() => null);
    throw new Error("Waiting for " + stop + "/" + phase + ": " + JSON.stringify(info) + ": " + error.message);
  }
}
async function layout(page, label) {
  const r = await page.evaluate(() => {
    const box = document.querySelector(".staff-tour-box")?.getBoundingClientRect();
    return { x: box?.x, y: box?.y, right: box?.right, bottom: box?.bottom, width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth };
  });
  assert.ok(r.x >= -1 && r.right <= r.width + 1 && r.y >= -1 && r.bottom <= r.height + 1, label + ": tutorial fits the viewport");
  assert.ok(r.scrollWidth <= r.width + 1, label + ": no horizontal overflow");
}
async function shot(page, name) {
  if (!process.env.STAFF_TOUR_SCREENSHOTS) return;
  fs.mkdirSync(process.env.STAFF_TOUR_SCREENSHOTS, { recursive: true });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.screenshot({ path: path.join(process.env.STAFF_TOUR_SCREENSHOTS, name + ".png") });
}
async function angle(slider, target) {
  await slider.focus();
  for (let i = 0; i < 130; i++) {
    const value = Number(await slider.getAttribute("aria-valuenow"));
    if (Math.abs(value - target) <= 1) return;
    await slider.press(value < target ? "ArrowRight" : "ArrowLeft");
  }
  throw new Error("C-arm did not reach " + target);
}
async function imageReady(page, file) {
  const image = page.locator('.cath-plate img[src$="' + file + '"]');
  await image.waitFor({ state: "attached", timeout: 15000 });
  await image.scrollIntoViewIfNeeded();
  await page.waitForFunction(filename => {
    const image = document.querySelector('.cath-plate img[src$="' + filename + '"]');
    return image?.complete && image.naturalWidth > 0;
  }, file, { timeout: 15000 });
}
const studentData = page => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith("cs_"))));

async function main() {
  const host = server();
  await new Promise(resolve => host.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + host.address().port + "/";
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ serviceWorkers: "block", reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await desktop.newPage(), errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(origin + "#/lesson/d1-coronaries");
    await page.locator('[data-staff-choice="staff"]').waitFor();
    assert.equal(await page.locator('[data-staff-choice="student"]').count(), 1);
    await page.evaluate(() => {
      localStorage.setItem("cs_xp", "777");
      localStorage.setItem("cs_done", JSON.stringify({ student: true }));
      localStorage.setItem("cs_srs", JSON.stringify({ "student-card": { iv: 12, st: "rev" } }));
    });
    const before = await studentData(page);
    await shot(page, "00-arrival");
    await page.locator('[data-staff-choice="staff"]').click();
    const spot = async () => { const el = page.locator(".staff-tour-spotlit"); await el.scrollIntoViewIfNeeded(); await el.click(); };

    await step(page, "welcome", "leave"); await layout(page, "welcome"); await shot(page, "01-welcome");
    await page.locator("[data-tour-primary]").click();
    await step(page, "landing", "task");
    for (let i = 0; i < 40 && (await page.evaluate(() => window.StaffTour.state().phase)) === "task"; i++) await page.mouse.wheel(0, 500);
    await step(page, "landing", "leave"); await layout(page, "landing exit"); await shot(page, "02-landing");
    await spot();
    await step(page, "plan", "leave"); await shot(page, "03-plan");
    await spot();
    await step(page, "lesson", "task");
    for (let i = 0; i < 4 && (await page.evaluate(() => window.StaffTour.state().stop)) === "lesson"; i++) { await page.locator("#next-chunk").click(); await page.waitForTimeout(300); }
    await step(page, "question", "task");
    await page.locator("#academy-theme").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark", "staff checkpoint supports the dark theme");
    await layout(page, "dark lesson task"); await shot(page, "04-dark-checkpoint");
    await page.locator("#academy-theme").click();
    await page.locator(".q-opt").first().click();
    await step(page, "question", "leave");
    assert.ok(await page.locator(".explain").count(), "lesson checkpoint shows feedback");
    await spot();
    await step(page, "cards", "task");
    await page.locator("#flip-btn").click();
    await page.waitForFunction(() => window.StaffTour.state().task.revealed === true);
    await page.locator('.fc-rate button[data-q="2"]').click();
    await step(page, "cards", "leave"); await shot(page, "05-cards");
    await spot(); await page.locator(".academy-header.menu-open").waitFor();
    await step(page, "cards", "leave"); await spot();
    await step(page, "awards", "leave"); await shot(page, "06-awards");
    await spot();
    await step(page, "wheel", "leave");
    await page.locator(".orbit-experience.is-ready").waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".orbit-card").count(), 14, "wheel contains all fourteen labs");
    await shot(page, "07-wheel");
    await page.locator('.orbit-card[href="#/physiology/cpb-console"]').click();
    await step(page, "cpb", "task");
    await page.waitForFunction(() => window.StaffTour.state().task.loaded === true);
    const firstDO2 = Number((await page.locator("#cpb-m-do2").innerText()).replace(/[^0-9.]/g, ""));
    const flow = page.locator('[data-rotary-for="cpb-flow"] .studio-number');
    await flow.fill("4.2"); await flow.press("Tab");
    await page.waitForFunction(() => window.StaffTour.state().task.flow === true);
    const secondDO2 = Number((await page.locator("#cpb-m-do2").innerText()).replace(/[^0-9.]/g, ""));
    assert.notEqual(firstDO2, secondDO2, "pump flow changes oxygen delivery");
    await page.locator('[data-cpb-action="restore-hb"]').click();
    await step(page, "cpb", "leave");
    const thirdDO2 = Number((await page.locator("#cpb-m-do2").innerText()).replace(/[^0-9.]/g, ""));
    assert.ok(thirdDO2 > secondDO2, "correcting hemodilution raises oxygen delivery");
    await layout(page, "CPB payoff"); await shot(page, "08-cpb");
    await spot();
    await step(page, "wheel2", "leave");
    await page.locator(".orbit-experience.is-ready").waitFor({ timeout: 10000 });
    await page.locator('.orbit-card[href="#/physiology/cath-projections"]').click();
    await step(page, "carm", "task");
    const rot = page.locator('[data-gantry="rot"]'), tilt = page.locator('[data-gantry="tilt"]');
    await angle(rot, 45); await angle(tilt, -25);
    await imageReady(page, "cath-lca-lao-caudal.jpg");
    await page.waitForFunction(() => window.StaffTour.state().task.spider === true);
    assert.equal(await page.locator("[data-cath-labels]").getAttribute("aria-pressed"), "true");
    await angle(rot, 40); await angle(tilt, 25);
    await imageReady(page, "cath-lca-lao-cranial.jpg");
    await step(page, "carm", "leave"); await layout(page, "C-arm payoff"); await shot(page, "09-carm");
    await spot(); await page.locator(".academy-header.menu-open").waitFor();
    await step(page, "carm", "leave"); await spot();
    await step(page, "library", "leave"); await spot();
    await step(page, "order", "leave"); await spot();
    await step(page, "surgery", "task");
    assert.match(await page.locator("#sx-ord-clock").innerText(), /preview.*no timer/i);
    for (let i = 0; i < 4; i++) await page.locator('.sx-ord-chip[data-add="' + i + '"]').click();
    assert.equal(await page.locator(".sx-ord-slot.filled").count(), 4);
    await page.locator("#sx-ord-grade").click();
    await step(page, "surgery", "leave"); await shot(page, "10-surgery");
    await page.locator("[data-tour-primary]").click();
    await page.locator(".staff-tour-complete").waitFor();
    assert.equal(await page.evaluate(() => window.StaffTour.state().status), "complete");
    assert.deepEqual(await studentData(page), before, "preview leaves student records unchanged");
    assert.deepEqual(errors, [], "full tour has no uncaught browser errors");
    await desktop.close();

    const recovery = await browser.newContext({ serviceWorkers: "block", reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const paused = await recovery.newPage();
    await paused.goto(origin); await paused.locator('[data-staff-choice="staff"]').click();
    await step(paused, "welcome", "leave");
    await paused.locator("[data-tour-primary]").click();
    await step(paused, "landing", "task");
    await paused.locator("[data-tour-skip]").click();
    await step(paused, "plan", "leave");
    await paused.locator("[data-tour-exit]").click();
    await paused.locator("[data-tour-resume]").waitFor();
    await paused.reload();
    await paused.locator("[data-tour-resume]").click();
    await step(paused, "plan", "leave");
    await paused.locator("[data-tour-skip]").click();
    await step(paused, "lesson", "task");
    await paused.locator("[data-tour-skip]").click();
    await step(paused, "question", "task");
    assert.ok(await paused.locator(".q-opt").count(), "skipping into the question opens the checkpoint");
    await recovery.close();
    console.log("PASS: sequential fourteen-step tour, followed links, live controls, skip/resume and isolated progress.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => host.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
