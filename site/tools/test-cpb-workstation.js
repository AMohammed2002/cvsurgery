/* CPB interaction regression. Run against the local static server.
   CPB_PLAYWRIGHT may point at a shared Playwright installation. */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.CPB_PLAYWRIGHT || 'playwright');
const base = process.env.CPB_URL || 'http://127.0.0.1:8765/';
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CPB_CHROMIUM ? { executablePath: process.env.CPB_CHROMIUM } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => sessionStorage.setItem('cardiac-school-audience-v1', 'student'));
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const action = name => page.locator('.cpb-workstation [data-cpb-action="' + name + '"]');
  async function open(mode) {
    await page.goto(base + '#/physiology/cpb-' + mode);
    await page.locator('.cpb-workstation #studio-reset').waitFor();
  }
  async function exact(id, value) {
    const input = page.locator('[data-rotary-for="' + id + '"] .studio-number');
    await input.fill(String(value)); await input.press('Tab');
    assert.equal(Number(await page.locator('#' + id).inputValue()), value);
    assert.equal(Number(await page.locator('[data-rotary-for="' + id + '"] [role=slider]').getAttribute('aria-valuenow')), value);
  }
  async function layout() {
    const problems = await page.evaluate(() => {
      const root = document.querySelector('.cpb-workstation');
      const results = [];
      const controls = [...root.querySelectorAll('button,select,input[type=number],[role=slider]')].filter(e => !e.closest('dialog') && e.getBoundingClientRect().width > 0);
      for (const e of controls) {
        if (e.disabled || e.hasAttribute('data-guided-inactive')) results.push('Locked: ' + (e.id || e.textContent));
        const rect = e.getBoundingClientRect();
        if (rect.left < -1 || rect.right > innerWidth + 1) results.push('Horizontal overflow: ' + (e.id || e.textContent));
      }
      const circuit = root.querySelector('.cpb-circuit').getBoundingClientRect();
      const metrics = root.querySelector('.cpb-readout-grid,.cpbs-mini-metrics').getBoundingClientRect();
      if (circuit.bottom > metrics.top) results.push('Circuit overlaps measurements');
      const bounds = root.querySelector('.cpb-machine-stage,.cpbs-scenario').getBoundingClientRect();
      if (circuit.bottom > bounds.bottom) results.push('Circuit escapes panel');
      const knobs = [...root.querySelectorAll('.cpb-knob')];
      for (const knob of knobs) {
        const r = knob.getBoundingClientRect();
        for (const e of knob.querySelectorAll('input[type=number],[role=slider],select')) {
          const k = e.getBoundingClientRect();
          if (k.bottom > r.bottom + 1 || k.right > r.right + 1) results.push('Control escapes knob panel: ' + (e.id || e.getAttribute('aria-label')));
        }
      }
      return results;
    });
    assert.deepEqual(problems, []);
  }
  await open('console');
  for (const size of [{width:1440,height:900},{width:1280,height:720},{width:1920,height:1080}]) { await page.setViewportSize(size); await layout(); }
  await page.setViewportSize({width:1440,height:900});
  await action('pump').click(); assert.match(await page.locator('#cpb-pump-status').innerText(), /STOPPED/);
  await action('pump').click(); assert.match(await page.locator('#cpb-pump-status').innerText(), /RUNNING/);
  await exact('cpb-flow', 4.2);
  await page.locator('[data-rotary-for="cpb-flow"] [role=slider]').press('ArrowUp');
  assert.equal(Number(await page.locator('#cpb-flow').inputValue()), 4.3);
  await page.selectOption('#cpb-cpg-route', 'combined'); await action('cpg').click();
  assert.match(await page.locator('#cpb-cpg-status').innerText(), /combined delivery active/);
  await page.selectOption('#cpb-fault-select', 'air');
  assert.match(await page.locator('#cpb-alarm-strip').innerText(), /ARTERIAL AIR/);
  await action('clear-air').click();
  assert.match(await page.locator('#cpb-pump-status').innerText(), /STOPPED/);
  await page.locator('#cpb-evaluate').click(); assert.match(await page.locator('#cpb-challenge-result').innerText(), /safe|correct|contained/i);
  await page.selectOption('#cpb-fault-select', 'baseline');
  assert.match(await action('pump').innerText(), /Stop pump/);
  await page.locator('.cpb-notes-open').click(); assert.equal(await page.locator('.cpb-notes-dialog').evaluate(e => e.open), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.cpb-notes-dialog').evaluate(e => e.open), false);
  await open('surgery');
  for (const size of [{width:1440,height:900},{width:1280,height:720},{width:1920,height:1080}]) { await page.setViewportSize(size); await layout(); }
  await page.setViewportSize({width:1440,height:900});
  await action('pump').click(); assert.match(await page.locator('#cpbs-feedback').innerText(), /blocked/);
  await page.locator('#cpbs-commit').click(); assert.match(await page.locator('#cpbs-feedback').innerText(), /not safely completed/);
  assert.match(await page.locator('#cpb-track-progress').innerText(), /01 \/ 12/);
  async function commit(step) {
    await page.locator('#cpbs-commit').click();
    await page.waitForFunction(step => document.querySelector('#cpb-track-progress').textContent.startsWith(String(step + 1).padStart(2, '0')), step);
  }
  await action('heparin').click(); await commit(1);
  await action('check-lines').click(); await commit(2);
  await exact('cpbs-flow', 4.6); await action('pump').click(); await commit(3);
  await action('protamine').click(); assert.match(await page.locator('#cpbs-feedback').innerText(), /Protamine blocked/);
  await action('vent').click(); await action('clamp').click(); await action('cpg').click(); await commit(4);
  await exact('cpbs-temperature', 32); await commit(5);
  await page.selectOption('#cpbs-route', 'combined'); await action('redose').click(); await commit(6);
  await exact('cpbs-temperature', 36.8); await commit(7);
  await action('ventilate').click(); await action('deair').click(); await commit(8);
  await action('cpg').click(); await action('clamp').click(); await action('rhythm').click(); await exact('cpbs-flow', 1.5); await commit(9);
  await action('pump').click(); await commit(10);
  await action('protamine').click(); await commit(11);
  await action('decannulate').click(); await page.locator('#cpbs-commit').click();
  await page.locator('#cpbs-retry').waitFor();
  assert.match(await page.locator('.cpbs-debrief h2').innerText(), /11 \/ 12/);
  assert.match(await page.locator('#cpb-track-progress').innerText(), /CASE COMPLETE/);
  await page.locator('#cpbs-retry').click(); await page.locator('.cpb-workstation #studio-reset').waitFor();
  await exact('cpbs-flow', 3.5); await action('heparin').click();
  await page.locator('#studio-reset').click(); await page.locator('.cpb-workstation #studio-reset').waitFor();
  assert.equal(await page.locator('#cpbs-act').innerText(), '110');
  assert.equal(Number(await page.locator('#cpbs-flow').inputValue()), 0);
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: CPB layout at 3 desktop sizes, unlocked controls, exact entry, keyboard dials, faults, alarms, notes, all 12 surgeon commands, safety gates, scoring, retry and reset.');
})().catch(error => { console.error(error); process.exit(1); });
