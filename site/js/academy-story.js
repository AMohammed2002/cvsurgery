/* Learning narrative. On wide screens native scrolling drives a pinned, three-scene composition; at or below 760px the scenes stack statically. */
(function () {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (value, low=0, high=1) => Math.max(low, Math.min(high, value));
  let dispose = null;
  function heart() {
    return `<svg class="story-heart" viewBox="0 0 600 640" fill="none" aria-hidden="true">
      <defs><linearGradient id="heart-coral" x1="120" y1="190" x2="460" y2="540" gradientUnits="userSpaceOnUse"><stop stop-color="#ff8794"/><stop offset=".52" stop-color="#ed506b"/><stop offset="1" stop-color="#c93758"/></linearGradient><linearGradient id="heart-blue" x1="230" y1="70" x2="480" y2="300" gradientUnits="userSpaceOnUse"><stop stop-color="#82d0f0"/><stop offset="1" stop-color="#4565d0"/></linearGradient></defs>
      <ellipse cx="308" cy="562" rx="167" ry="24" fill="#243357" opacity=".12"/>
      <g stroke="#263457" stroke-width="9" stroke-linejoin="round">
        <path d="M254 252V138C254 91 316 83 336 117L361 178" fill="#eb536e"/>
        <path d="M284 137L282 68M313 126L327 58M340 153L370 97" stroke="#263457" stroke-width="39" stroke-linecap="round"/>
        <path d="M284 137L282 68M313 126L327 58M340 153L370 97" stroke="#ff7e8d" stroke-width="22" stroke-linecap="round"/>
        <path d="M221 259L183 159Q169 132 191 121L217 108L263 223" fill="url(#heart-blue)"/>
        <path d="M337 240Q344 159 410 144L467 132L478 171L422 184Q387 194 386 250" fill="url(#heart-blue)"/>
        <path d="M300 239C245 169 143 199 135 287C122 401 240 490 326 554C387 510 461 421 472 330C486 226 382 201 337 257L300 239Z" fill="url(#heart-coral)"/>
        <path d="M174 239C127 214 97 242 112 285L149 329Q151 271 174 239Z" fill="#ef7792"/>
        <path d="M376 230Q402 194 444 216L463 270Q425 241 376 230Z" fill="#e56580"/>
        <path d="M309 262Q346 348 326 519" stroke="#a62c4d" stroke-width="13"/>
        <path d="M313 303L244 339L210 395M319 371L381 400L408 446M251 338L200 324M376 397L402 363" stroke="#ffe6bf" stroke-width="10" stroke-linecap="round"/>
        <path d="M316 275L333 322L347 347" stroke="#ffe6bf" stroke-width="10" stroke-linecap="round"/>
      </g>
      <path d="M190 260Q157 319 201 371" stroke="#ffd0cd" stroke-width="17" stroke-linecap="round" opacity=".7"/>
      <path d="M417 286Q438 355 395 418" stroke="#ffacb4" stroke-width="12" stroke-linecap="round" opacity=".55"/>
    </svg>`;
  }
  function mount(main) {
    if (main.querySelector('.academy-story-home')) return;
    unmount();
    const oldHero = main.querySelector('.hero');
    if (!oldHero) return;
    const next = oldHero.querySelector('.studio-continue a')?.getAttribute('href') || '#/plan';
    const dayLabel = oldHero.querySelector('.hero-body>.pill')?.textContent || 'YOUR CARDIAC SURGERY COURSE';
    const timeline = oldHero.querySelector('.studio-timeline');
    // An unenrolled visitor's real Start Course button (with its live onclick) becomes the primary hero action.
    const startBtn = oldHero.querySelector('#start-course');
    const primaryAction = startBtn ? '<span data-story-start-slot></span>' : `<a class="story-button" href="${next}">Continue learning <span>↗</span></a>`;
    const isStatic = matchMedia('(max-width: 760px)').matches;
    const remaining = [...main.children].filter(node => node !== oldHero);
    const shell = document.createElement('div');
    shell.className = 'academy-story-home' + (isStatic ? ' story-static' : '');
    shell.innerHTML = `
      <section class="story-hero" aria-labelledby="story-welcome">
        <svg class="story-hero-terrain" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path d="M0 785C220 910 518 800 670 508C843 179 1018 -60 1440 101V900H0Z" fill="#f5c33c"/></svg>
        <span class="story-loop loop-a" aria-hidden="true"></span><span class="story-loop loop-b" aria-hidden="true"></span><span class="story-cross" aria-hidden="true">×</span>
        <div class="story-hero-copy"><span class="story-eyebrow">THE SCHOOL OF CARDIAC SURGERY</span><h1 id="story-welcome">Learn it.<br>Feel it.<br><em>Know it.</em></h1><p>A deeper understanding of the heart.<br>One discovery at a time.</p><div class="story-hero-actions">${primaryAction}<button class="story-text-button" data-story-desk>Your training desk <span>↓</span></button></div><div class="story-current"><span class="story-live-dot"></span>${escape(dayLabel)}</div></div>
        <a class="story-hero-art" href="#/physiology" aria-label="Enter the fourteen physiology labs"><div class="story-heart-orbit"></div>${heart()}<div class="story-art-note">Go beyond<br>the textbook.<span>↘</span></div><span class="story-art-tag">14 LABS. COUNTLESS CONNECTIONS. <b>↗</b></span><span class="story-spark spark-one">✳</span><span class="story-spark spark-two">+</span></a>
        <button class="story-scroll-cue" data-story-start><span>SCROLL TO FIND YOUR FLOW</span><i>↓</i></button>
      </section>
      <section class="story-journey" aria-label="Three ways to build clinical understanding">
        <div class="story-pin">
          <div class="story-background-word" aria-hidden="true">UNDERSTAND</div>
          <svg class="story-flightpath" viewBox="0 0 1400 850" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 610C240 390 190 70 530 160S715 825 1060 650S1230 190 1470 300"/></svg>
          <span class="story-orbit-shape shape-one" aria-hidden="true"></span><span class="story-orbit-shape shape-two" aria-hidden="true"></span><span class="story-triangle" aria-hidden="true"></span>
          <nav class="story-chapter-nav" aria-label="Learning modes"><button data-story-chapter="0" aria-current="step"><span>01</span> Understand</button><button data-story-chapter="1"><span>02</span> Remember</button><button data-story-chapter="2"><span>03</span> Explore</button></nav>
          <div class="story-panels">
            <article class="story-panel active" data-scene="0"><div class="story-scene-copy"><span class="story-eyebrow">01 / MAKE THE CONNECTION</span><h2>Small lessons.<br><em>Big lightbulb<br>moments.</em></h2><p>Start with the structure. Connect the mechanism. Build the understanding behind every decision.</p><a class="story-button story-button-ghost" href="${next}">Pick up your lesson <span>↗</span></a></div><div class="story-scene-art lesson-art"><span class="story-sticker">A LITTLE<br>EVERY DAY.</span><div class="story-book book-back"></div><div class="story-book book-front"><div class="story-book-top">CARDIAC SCHOOL <span>VOL. 01</span></div><h3>See the<br>whole heart.</h3><div class="story-book-heart">${heart().replaceAll('id="heart-','id="book-heart-').replaceAll('url(#heart-','url(#book-heart-')}</div><div class="story-book-foot"><span>ANATOMY → UNDERSTANDING</span><b>01</b></div></div><span class="story-hand-note">It starts with a connection. ↗</span></div></article>
            <article class="story-panel" data-scene="1" aria-hidden="true" inert><div class="story-scene-copy"><span class="story-eyebrow">02 / MAKE IT STICK</span><h2>Meet your<br><em>future<br>memory.</em></h2><p>Bring it back. Space it out. Turn a moment of understanding into knowledge you can call on.</p><a class="story-button story-button-ghost" href="#/cards">Open your flashcards <span>↗</span></a></div><div class="story-scene-art recall-art"><div class="story-recall-card recall-back">RECALL.</div><div class="story-recall-card recall-middle">CONNECT.</div><div class="story-recall-card recall-front"><span class="story-eyebrow">SPACED REPETITION</span><span class="story-recall-star">✳</span><h3>You know<br>more than<br>you think.</h3><div class="story-recall-bottom">A QUESTION. A CONNECTION.<span>↗</span></div></div><span class="story-memory-label">Aha! There it is.</span></div></article>
            <article class="story-panel" data-scene="2" aria-hidden="true" inert><div class="story-scene-copy"><span class="story-eyebrow">03 / MAKE IT MOVE</span><h2>Less abstract.<br><em>More<br>alive.</em></h2><p>Follow a signal. Change a variable. See the heart respond in fourteen connected physiology labs.</p><a class="story-button story-button-ghost" href="#/physiology">Enter the physiology labs <span>↗</span></a></div><div class="story-scene-art explore-art"><div class="story-lab-window"><div class="story-window-bar"><span><i></i> PHYSIOLOGY IN MOTION</span><b>14</b></div><div class="story-window-grid"><svg viewBox="0 0 600 280" aria-hidden="true"><path class="story-ecg-shadow" d="M0 170H80L98 150L118 170H155L175 198L199 55L224 245L244 170H290Q321 109 351 170H400L419 150L439 170H475L495 198L519 55L544 245L564 170H600"/><path class="story-ecg" d="M0 170H80L98 150L118 170H155L175 198L199 55L224 245L244 170H290Q321 109 351 170H400L419 150L439 170H475L495 198L519 55L544 245L564 170H600"/></svg><span class="story-signal-label">FOLLOW THE SIGNAL</span></div><div class="story-window-foot"><span>Predict → Adjust → Observe</span><b>↗</b></div></div><span class="story-explore-seal">14<br><small>WAYS IN</small></span></div></article>
          </div>
          <div class="story-journey-foot"><span>KNOWLEDGE BECOMES INSTINCT.</span><div class="story-progress"><span></span></div><span class="story-chapter-count">01 / 03</span><button data-story-desk>Go to your training desk ↓</button></div>
        </div>
      </section>
      <section class="story-desk" id="training-desk" aria-labelledby="story-desk-title"><header class="story-desk-heading"><div><span class="story-eyebrow">YOUR DAILY PRACTICE</span><h2 id="story-desk-title">Keep the<br><em>momentum.</em></h2><a data-tour-plan href="#/plan" class="story-button story-button-ghost">View the 14-day course <span>↗</span></a></div><div class="story-desk-timeline"><span>YOUR FOURTEEN-DAY JOURNEY</span></div></header><div class="story-desk-content"></div></section>
      <footer class="story-finale"><span class="story-eyebrow">KEEP ASKING. KEEP CONNECTING.</span><h2>The heart has<br><em>more to teach you.</em></h2><a class="story-button story-button-ghost" href="#/physiology">Find your next discovery <span>↗</span></a><div class="story-finale-bottom"><span>CardiacSchool</span><a href="#/progress">Your progress ↗</a><a href="#/plan">The course ↗</a></div></footer>`;
    oldHero.replaceWith(shell);
    if (startBtn) {
      startBtn.className = 'story-button';
      startBtn.innerHTML = 'Start the 14-day course <span>↗</span>';
      shell.querySelector('[data-story-start-slot]').replaceWith(startBtn);
    }
    const desk = shell.querySelector('.story-desk-content');
    remaining.forEach(node => desk.append(node));
    if (timeline) shell.querySelector('.story-desk-timeline').append(timeline);
    document.body.classList.add('story-page');
    const header = document.querySelector('.academy-header');
    const pill = header?.querySelector('.academy-continue');
    if (pill) {
      pill.innerHTML = startBtn ? 'Start course <span>↗</span>' : 'Continue learning <span>↗</span>';
      pill.setAttribute('href', startBtn ? '#/' : next);
      pill.onclick = startBtn ? event => { event.preventDefault(); startBtn.click(); } : null;
    }
    const journey = shell.querySelector('.story-journey');
    const pin = shell.querySelector('.story-pin');
    const panels = [...shell.querySelectorAll('.story-panel')];
    if (isStatic) panels.forEach(panel => { panel.classList.add('active'); panel.inert = false; panel.removeAttribute('aria-hidden'); });
    const tabs = [...shell.querySelectorAll('[data-story-chapter]')];
    const word = shell.querySelector('.story-background-word');
    const words = ['UNDERSTAND', 'REMEMBER', 'EXPLORE'];
    const colors = ['#f5c33c', '#ed647d', '#4359cd'];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Narrow screens stack the three scenes; the scroll-driven stage logic never runs there.
    let raf = 0, top = 0, travel = 0, heroHeight = 0, active = -1, stopped = isStatic;
    function measure() { top = journey.getBoundingClientRect().top + scrollY; travel = journey.offsetHeight - pin.offsetHeight; heroHeight = shell.querySelector('.story-hero').offsetHeight; schedule(); }
    function schedule() { if (!raf && !stopped && !document.hidden) raf = requestAnimationFrame(draw); }
    function draw() {
      raf = 0;
      if (stopped) return;
      const progress = clamp((scrollY - top + 88) / Math.max(1, travel));
      const scene = Math.min(2, Math.floor(progress * 3));
      const local = progress * 3 - scene;
      if (scene !== active) {
        active = scene;
        pin.style.backgroundColor = colors[scene];
        pin.dataset.chapter = String(scene);
        word.textContent = words[scene];
        panels.forEach((panel, index) => { panel.classList.toggle('active', index === scene); panel.inert = index !== scene; panel.setAttribute('aria-hidden', String(index !== scene)); });
        tabs.forEach((tab, index) => { if (index === scene) tab.setAttribute('aria-current', 'step'); else tab.removeAttribute('aria-current'); });
        shell.querySelector('.story-chapter-count').textContent = '0' + (scene + 1) + ' / 03';
      }
      const inside = scrollY > top - 120 && scrollY < top + travel + pin.offsetHeight - 160;
      header?.classList.toggle('story-deep', inside && scene === 2);
      header?.classList.toggle('is-scrolled', scrollY > 80);
      shell.style.setProperty('--hero-travel', reduced ? 0 : clamp(scrollY / heroHeight));
      pin.style.setProperty('--scene-progress', reduced ? .5 : local);
      pin.style.setProperty('--journey-progress', progress);
      if (!reduced) {
        word.style.transform = `translateX(${(local-.5)*-110}px)`;
        const art = panels[scene].querySelector('.story-scene-art');
        art.style.transform = `translateY(${(local-.5)*-32}px) rotate(${(local-.5)*-3}deg)`;
      }
    }
    function goToChapter(index) {
      if (isStatic) { panels[index].scrollIntoView({behavior: reduced ? 'instant' : 'smooth', block: 'start'}); return; }
      scrollTo({top: top - 88 + (index / 3 + .08) * travel, behavior: reduced ? 'instant' : 'smooth'});
    }
    tabs.forEach((tab,index) => { tab.onclick = () => goToChapter(index); });
    shell.querySelectorAll('[data-story-desk]').forEach(button => button.onclick = () => { shell.querySelector('#training-desk').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'}); });
    shell.querySelector('[data-story-start]').onclick = () => goToChapter(0);
    const visibility = () => { if (document.hidden && raf) { cancelAnimationFrame(raf); raf=0; } else schedule(); };
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);document.addEventListener('visibilitychange',visibility);
    measure();
    dispose = () => { stopped=true;if(raf)cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility);header?.classList.remove('story-deep','is-scrolled');document.body.classList.remove('story-page');if(pill){pill.innerHTML='Continue learning <span>↗</span>';pill.setAttribute('href','#/');pill.onclick=null;} };
  }
  function unmount() { if (dispose) dispose(); dispose=null; }
  window.AcademyStory = {mount,unmount};
})();
