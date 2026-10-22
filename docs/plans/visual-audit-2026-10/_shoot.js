const { chromium } = require(process.argv[2] + '/playwright');
const base = 'http://localhost:8765/';
const out = process.argv[3];
const routes = [['01-today','#/'],['02-plan','#/plan'],['03-day1','#/day/1'],['04-lesson','#/lesson/d1-coronaries'],['05-cards','#/cards'],['06-quiz','#/quiz'],['07-surgery','#/surgery'],['08-physiology','#/physiology'],['09-anatomy','#/anatomy'],['10-trials','#/trials'],['11-crisis','#/crisis'],['12-progress','#/progress'],['13-cpb','#/physiology/cpb-console'],['14-extras','#/extras'],['15-flashcard','#/cards/all']];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(base + '#/'); await p.waitForTimeout(1200);
  const btn = await p.$('[data-staff-choice="student"]'); if (btn) { await btn.click(); await p.waitForTimeout(800); }
  for (const theme of ['light','dark']) {
    await p.evaluate(t => { localStorage.setItem('cs_theme', JSON.stringify(t)); document.documentElement.dataset.theme = t; }, theme);
    for (const [name, r] of routes) {
      if (theme==='dark' && !['01-today','04-lesson','07-surgery','13-cpb','15-flashcard'].includes(name)) continue;
      await p.goto(base + r); await p.waitForTimeout(1300);
      await p.evaluate(t => document.documentElement.dataset.theme = t, theme);
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${out}/${name}-${theme}.png` });
      if (name==='04-lesson' && theme==='light') { await p.mouse.wheel(0, 1600); await p.waitForTimeout(600); await p.screenshot({ path: `${out}/04b-lesson-scrolled.png` }); }
      if (name==='01-today' && theme==='light') { await p.screenshot({ path: `${out}/01b-today-full.png`, fullPage: true }); }
    }
  }
  await b.close();
})();
