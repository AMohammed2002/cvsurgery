/* ============================================================================
   CardiacSchool — CORONARY ANGIOGRAPHY LEARNING ENGINE

   Standalone renderer for #/angiography and its teaching, atlas, staged-case,
   drill, quiz and report-builder routes. Source content lives in
   window.ANGIOGRAPHY; this file owns presentation and interaction only.

   Persistent state is intentionally isolated to:
     cs_angio_read, cs_angio_read_awarded, cs_angio_case_scores,
     cs_angio_qstats, cs_angio_quizbest
   ============================================================================ */
(function () {
  "use strict";
  if (!window.ANGIOGRAPHY) return;

  const AX = window.ANGIOGRAPHY;
  const BASE = "#/angiography";
  const IMAGE_TARGET = "coronary-angiography";
  const PASS = 0.7;
  const $main = () => document.querySelector("#main");
  const arr = value => Array.isArray(value) ? value : (value == null ? [] : [value]);
  const chapters = () => arr(AX.chapters || AX.lessons);
  const cases = () => arr(AX.cases);
  const questions = () => arr(AX.questions || AX.quiz);
  let viewCleanup = null;
  let activeLightbox = null;

  /* ---------- safe host-app bridges ---------- */
  function E(value) {
    const text = String(value == null ? "" : value);
    return text.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }
  function icon(name) {
    return typeof IC === "function" ? IC(name, "angio-icon") : "";
  }
  function figureSlot(anchor, phase) {
    return window.Figures && typeof window.Figures.slot === "function"
      ? (window.Figures.slot("angiography", IMAGE_TARGET, anchor, phase || "content") || "")
      : "";
  }
  function mixed(list) {
    if (typeof shuffle === "function") return shuffle(list);
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function getStore(key, fallback) {
    try { return typeof Store !== "undefined" ? Store.get(key, fallback) : fallback; }
    catch (error) { return fallback; }
  }
  function setStore(key, value) {
    try { if (typeof Store !== "undefined") Store.set(key, value); }
    catch (error) { /* storage is an enhancement, never a rendering dependency */ }
  }
  function reward(xp, activity) {
    if (xp && typeof addXP === "function") addXP(xp);
    if (typeof logActivity === "function") logActivity(activity || 1);
  }
  function pulseStreak() {
    if (typeof bumpStreak === "function") bumpStreak();
  }
  function cleanupView() {
    if (typeof viewCleanup === "function") viewCleanup();
    viewCleanup = null;
  }
  function setHTML(html) {
    const main = $main();
    if (main) main.innerHTML = `<div class="angio-shell">${html}</div>`;
  }
  function rich(value) {
    if (value == null || value === "") return "";
    if (Array.isArray(value)) return value.map(item => `<p>${E(item)}</p>`).join("");
    if (typeof value === "object") return rich(value.html || value.body || value.text || value.content || "");
    const text = String(value);
    if (/<\/?[a-z][^>]*>/i.test(text)) return text;
    return text.split(/\n{2,}/).map(p => `<p>${E(p).replace(/\n/g, "<br>")}</p>`).join("");
  }
  function textOf(value) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    return String(value.label || value.title || value.text || value.name || "");
  }
  function chapterById(id) { return chapters().find(item => String(item.id) === String(id)); }
  function caseById(id) { return cases().find(item => String(item.id) === String(id)); }
  function chapterTitle(id) { const chapter = chapterById(id); return chapter ? chapter.title : "Core angiography"; }

  /* ---------- isolated progress and assessment state ---------- */
  function readMap() { return getStore("angio_read", {}); }
  function readAwards() { return getStore("angio_read_awarded", {}); }
  function caseScores() { return getStore("angio_case_scores", {}); }
  function qStats() { return getStore("angio_qstats", {}); }
  function quizBest() { return getStore("angio_quizbest", {}); }
  function isRead(id) { return !!readMap()[id]; }
  function readCount() {
    const valid = new Set(chapters().map(item => String(item.id)));
    return Object.keys(readMap()).filter(id => valid.has(String(id))).length;
  }
  function toggleRead(id) {
    const state = readMap();
    const first = !state[id];
    if (state[id]) delete state[id]; else state[id] = Date.now();
    setStore("angio_read", state);
    if (first) {
      const awarded = readAwards();
      if (!awarded[id]) {
        awarded[id] = Date.now();
        setStore("angio_read_awarded", awarded);
        reward(35, 2);
        pulseStreak();
      }
    }
    return !!state[id];
  }
  function recordCase(id, score) {
    const state = caseScores();
    const previous = state[id] || { best: -1, attempts: 0 };
    const improved = score > previous.best;
    state[id] = { best: Math.max(score, previous.best), attempts: previous.attempts + 1, last: score, ts: Date.now() };
    setStore("angio_case_scores", state);
    if (improved) reward(score === 2 ? 20 : 8, 2);
    return state[id];
  }
  function recordQuestion(id, correct) {
    const state = qStats();
    const current = state[id] || { seen: 0, ok: 0 };
    current.seen += 1;
    if (correct) current.ok += 1;
    current.last = !!correct;
    current.ts = Date.now();
    state[id] = current;
    setStore("angio_qstats", state);
    reward(correct ? 3 : 0, 1);
  }
  function recordBest(key, correct, total) {
    if (!total) return;
    const state = quizBest();
    const pct = Math.round(100 * correct / total);
    const previous = state[key];
    if (!previous || pct > previous.pct) {
      state[key] = { best: correct, total: total, pct: pct, ts: Date.now() };
      setStore("angio_quizbest", state);
      reward(pct >= 90 ? 35 : pct >= 70 ? 20 : 8, 2);
    }
  }

  /* ---------- image resolution, figures and accessible lightbox ---------- */
  function imageLibrary() {
    const found = [];
    const seen = new Set();
    const supplied = arr(AX.atlas).concat(arr(AX.images));
    chapters().forEach(chapter => arr(chapter.sections || chapter.blocks).forEach(section => {
      arr(section.image || section.images || section.figure).forEach(reference => {
        if (typeof reference === "object" && reference) supplied.push(Object.assign({ chapterId: chapter.id, sectionId: section.id, title: section.title }, reference));
        else supplied.push({ src: reference, chapterId: chapter.id, sectionId: section.id, title: section.title });
      });
    }));
    supplied.forEach((item, index) => {
      const image = typeof item === "string" ? { id: `image-${index + 1}`, src: item } : item;
      if (!image) return;
      const key = image.id || image.src || image.path || image.file || `image-${index}`;
      if (!seen.has(key)) { seen.add(key); found.push(image); }
    });
    return found;
  }
  function resolveImage(reference, fallback) {
    if (!reference && fallback) reference = fallback;
    if (!reference) return null;
    if (typeof reference === "string") {
      const match = imageLibrary().find(item => String(item.id) === reference);
      return match ? Object.assign({}, match) : { src: reference, alt: "Coronary angiogram" };
    }
    const linked = reference.imageId || reference.ref || reference.image;
    if (linked && typeof linked === "string") {
      const match = imageLibrary().find(item => String(item.id) === String(linked));
      if (match) return Object.assign({}, match, reference);
    }
    return Object.assign({}, reference);
  }
  function imageSrc(image) { return image && (image.src || image.path || image.file || image.url) || ""; }
  function imageAlt(image, fallback) { return image && (image.alt || image.title || image.caption) || fallback || "Coronary angiogram"; }
  function imageSource(source) {
    if (!source) return "";
    if (typeof source === "string") return source;
    const documentName = source.document || source.title || source.file || source.pdf || source.deck || "Source document";
    const locator = source.slide != null ? `slide ${source.slide}` : source.page != null ? `page ${source.page}` : source.locator || "";
    return [documentName, locator].filter(Boolean).join(", ");
  }
  function imageLabels(image, stage) {
    const labels = arr(image && (image.labels || image.overlays || image.annotations));
    return labels.filter(label => {
      const revealAt = Number(label.stage || label.revealAt || 2) - 1;
      return stage >= Math.max(1, revealAt);
    }).map((label, index) => {
      const x = Math.max(0, Math.min(100, Number(label.x == null ? 50 : label.x)));
      const y = Math.max(0, Math.min(100, Number(label.y == null ? 50 : label.y)));
      return `<span class="angio-image-label" style="--angio-x:${x}%;--angio-y:${y}%" aria-hidden="true"><span class="angio-image-dot"></span><span class="angio-image-label-text">${E(label.label || label.text || `Label ${index + 1}`)}</span></span>`;
    }).join("");
  }
  function imageHTML(reference, options) {
    const opts = options || {};
    const image = resolveImage(reference);
    if (!image || !imageSrc(image)) {
      return `<div class="angio-image-missing">${icon("scope")}<span>Image unavailable</span></div>`;
    }
    const src = imageSrc(image);
    const alt = imageAlt(image, opts.alt);
    const title = image.title || opts.title || "Angiogram";
    const caption = image.caption || opts.caption || "";
    const source = imageSource(image.source || image.attribution);
    const meta = [image.projection || image.view, image.vessel || image.artery, image.phase].filter(Boolean);
    return `<figure class="angio-figure${opts.compact ? " angio-figure-compact" : ""}">
      <div class="angio-image-stage">
        <button type="button" class="angio-image-button" data-angio-lightbox data-src="${E(src)}" data-alt="${E(alt)}" data-title="${E(title)}" aria-label="Open ${E(title)} at full size">
          <img class="angio-image" src="${E(src)}" alt="${E(alt)}"${image.width && image.height ? ` width="${E(image.width)}" height="${E(image.height)}"` : ""} loading="lazy" decoding="async">
          <span class="angio-zoom-cue">${icon("search")} Zoom</span>
        </button>
        ${opts.stage == null ? "" : imageLabels(Object.assign({}, image, { labels: opts.labels || image.labels }), opts.stage)}
      </div>
      ${(caption || source || meta.length) ? `<figcaption class="angio-caption"><span class="angio-caption-copy">${caption ? `<span>${E(caption)}</span>` : ""}${source ? `<span class="angio-caption-source">Source: ${E(source)}</span>` : ""}</span>${meta.length ? `<span class="angio-caption-meta">${meta.map(E).join(" · ")}</span>` : ""}</figcaption>` : ""}
    </figure>`;
  }
  function wireLightboxes(scope) {
    (scope || document).querySelectorAll("[data-angio-lightbox]").forEach(button => {
      button.addEventListener("click", () => openLightbox(button.dataset.src, button.dataset.alt, button.dataset.title));
    });
  }
  function openLightbox(src, alt, title) {
    closeLightbox();
    const previous = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "angio-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", title || "Expanded angiogram");
    overlay.innerHTML = `<div class="angio-lightbox-toolbar">
        <div class="angio-lightbox-title">${E(title || "Angiogram")}</div>
        <div class="angio-lightbox-actions">
          <button type="button" class="angio-lightbox-control" data-angio-zoom-out aria-label="Zoom out">−</button>
          <span class="angio-lightbox-level" aria-live="polite">100%</span>
          <button type="button" class="angio-lightbox-control" data-angio-zoom-in aria-label="Zoom in">+</button>
          <button type="button" class="angio-lightbox-control" data-angio-zoom-reset aria-label="Reset zoom">${icon("refresh")}</button>
          <button type="button" class="angio-lightbox-control angio-lightbox-close" data-angio-close aria-label="Close expanded image">×</button>
        </div>
      </div>
      <div class="angio-lightbox-canvas"><img class="angio-lightbox-image" src="${E(src)}" alt="${E(alt || "Expanded coronary angiogram")}" loading="lazy" decoding="async"></div>
      <p class="angio-lightbox-help">Use +/− to zoom, 0 to reset, and Esc to close.</p>`;
    document.body.appendChild(overlay);
    document.documentElement.classList.add("angio-lock");
    let zoom = 1;
    const image = overlay.querySelector(".angio-lightbox-image");
    const level = overlay.querySelector(".angio-lightbox-level");
    const paint = next => {
      zoom = Math.max(0.5, Math.min(4, next));
      image.style.transform = `scale(${zoom})`;
      level.textContent = `${Math.round(zoom * 100)}%`;
    };
    const close = () => { closeLightbox(); if (previous && typeof previous.focus === "function") previous.focus(); };
    overlay.querySelector("[data-angio-zoom-out]").onclick = () => paint(zoom - 0.25);
    overlay.querySelector("[data-angio-zoom-in]").onclick = () => paint(zoom + 0.25);
    overlay.querySelector("[data-angio-zoom-reset]").onclick = () => paint(1);
    overlay.querySelector("[data-angio-close]").onclick = close;
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    const keydown = event => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      else if (event.key === "+" || event.key === "=") { event.preventDefault(); paint(zoom + 0.25); }
      else if (event.key === "-") { event.preventDefault(); paint(zoom - 0.25); }
      else if (event.key === "0") { event.preventDefault(); paint(1); }
      else if (event.key === "Tab") {
        const focusable = Array.from(overlay.querySelectorAll("button"));
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    overlay.addEventListener("keydown", keydown);
    activeLightbox = { overlay: overlay };
    overlay.querySelector("[data-angio-close]").focus();
  }
  function closeLightbox() {
    if (activeLightbox && activeLightbox.overlay) activeLightbox.overlay.remove();
    activeLightbox = null;
    document.documentElement.classList.remove("angio-lock");
  }

  /* ---------- shared UI pieces ---------- */
  function progressHTML() {
    const total = chapters().length;
    const done = readCount();
    const pct = total ? Math.round(100 * done / total) : 0;
    return `<div class="angio-progress" aria-label="${pct}% of chapters complete">
      <div class="angio-progress-copy"><span>Course progress</span><strong>${done}/${total} chapters</strong></div>
      <div class="angio-progress-track"><span style="width:${pct}%"></span></div>
    </div>`;
  }
  function eyebrow(text) { return `<span class="angio-eyebrow">${E(text)}</span>`; }
  function emptyState(title, body, href, label) {
    return `<div class="angio-empty">${icon("scope")}<h2>${E(title)}</h2><p>${E(body)}</p>${href ? `<a class="angio-btn" href="${href}">${E(label || "Go back")}</a>` : ""}</div>`;
  }

  /* ============================== HUB ============================== */
  function renderHub() {
    const list = chapters();
    const caseList = cases();
    const atlas = atlasEntries();
    const best = quizBest().all;
    const next = list.find(chapter => !isRead(chapter.id)) || list[0];
    const meta = AX.meta || {};
    const sourceList = arr(AX.sources);
    const overview = AX.intro || AX.overview || meta.description || "A systematic, surgery-facing course in coronary angiography: orient the projection, trace every vessel, define disease, and turn the film into an operative plan.";
    let html = `<header class="angio-hero">
      <div class="angio-hero-copy">
        ${eyebrow(meta.eyebrow || "Imaging day · coronary angiography")}
        <h1>${E(meta.heroTitle || "Read the film. Build the operation.")}</h1>
        <div class="angio-hero-lede">${rich(overview)}</div>
        ${meta.learningContract ? `<div class="angio-hero-contract"><strong>Reading contract</strong><span>${E(meta.learningContract)}</span></div>` : ""}
        <div class="angio-hero-actions">
          ${next ? `<a class="angio-btn" href="${BASE}/learn/${encodeURIComponent(next.id)}">${icon("book")} ${readCount() ? "Continue learning" : "Start the course"}</a>` : ""}
          <a class="angio-btn angio-btn-secondary" href="${BASE}/case/${caseList[0] ? encodeURIComponent(caseList[0].id) : ""}">${icon("scope")} Read a case</a>
        </div>
      </div>
      <div class="angio-hero-orbit" aria-hidden="true"><span></span><span></span><span></span><b>LM</b><b>LAD</b><b>RCA</b></div>
    </header>
    ${window.CardCatalog ? CardCatalog.ctaHTML("angiography", "coronary-angiography") : ""}
    ${figureSlot("overview", "content")}
    ${progressHTML()}
    <section class="angio-stats" aria-label="Module overview">
      <div class="angio-stat"><strong>${list.length}</strong><span>Deep-dive chapters</span></div>
      <div class="angio-stat"><strong>${atlas.length}</strong><span>Source figures</span></div>
      <div class="angio-stat"><strong>${caseList.length}</strong><span>Staged cases</span></div>
      <div class="angio-stat"><strong>${questions().length}</strong><span>Key questions</span></div>
      <div class="angio-stat"><strong>${best ? `${best.pct}%` : "—"}</strong><span>Best quiz</span></div>
    </section>
    ${(arr(meta.objectives).length || arr(meta.interpretationChecklist).length || arr(meta.sourceLimitations).length || sourceList.length) ? `<details class="angio-contract"><summary><span><strong>Open the course contract</strong><small>Objectives, the nine-part read, static-frame boundaries, and source provenance</small></span><span>${icon("chevR")}</span></summary><div class="angio-contract-grid">${arr(meta.objectives).length ? `<section><h2>What you will be able to do</h2>${listHTML(meta.objectives, false)}</section>` : ""}${arr(meta.interpretationChecklist).length ? `<section><h2>The fixed interpretation sequence</h2>${listHTML(meta.interpretationChecklist, false)}</section>` : ""}${arr(meta.sourceLimitations).length ? `<section class="angio-contract-wide"><h2>Source and static-frame boundaries</h2>${listHTML(meta.sourceLimitations, false)}${arr(meta.excludedSourceMaterial).length ? `<h3>Intentionally excluded</h3>${listHTML(meta.excludedSourceMaterial, false)}` : ""}</section>` : ""}${sourceList.length ? `<section class="angio-contract-wide"><h2>Sources and provenance</h2><div class="angio-source-grid">${sourceList.map(source => `<article class="angio-source-card"><h3>${E(source.title || source.id || "Source")}</h3>${source.citation ? `<p><strong>Citation</strong>${E(source.citation)}</p>` : ""}${source.scope ? `<p><strong>Used for</strong>${E(source.scope)}</p>` : ""}${source.note ? `<p><strong>Boundary</strong>${E(source.note)}</p>` : ""}</article>`).join("")}</div></section>` : ""}</div></details>` : ""}
    <section class="angio-action-grid" aria-label="Angiography learning modes">
      <a class="angio-action-card" href="${BASE}/atlas"><span class="angio-action-icon">${icon("search")}</span><div><h2>Projection atlas</h2><p>Compare named views, vessel territories, landmarks, and pathology at full resolution.</p></div><span class="angio-action-go">${icon("chevR")}</span></a>
      <a class="angio-action-card" href="${BASE}/drill"><span class="angio-action-icon">${icon("zap")}</span><div><h2>Rapid recognition drill</h2><p>Identify anatomy, projections, lesions, and consequences under retrieval pressure.</p></div><span class="angio-action-go">${icon("chevR")}</span></a>
      <a class="angio-action-card" href="${BASE}/quiz"><span class="angio-action-icon">${icon("target")}</span><div><h2>Integrated question bank</h2><p>Test the complete slide set and the cardiac-surgery key-question material.</p></div><span class="angio-action-go">${icon("chevR")}</span></a>
      <a class="angio-action-card" href="${BASE}/report"><span class="angio-action-icon">${icon("chart")}</span><div><h2>Report builder</h2><p>Translate visual findings into a disciplined structured angiography report and graft plan.</p></div><span class="angio-action-go">${icon("chevR")}</span></a>
      <a class="angio-action-card" href="#/physiology/cath-projections"><span class="angio-action-icon">${icon("target")}</span><div><h2>C-arm projection trainer</h2><p>Drive the gantry around a patient on the table until each named view locks, and read what it opens and what it hides.</p></div><span class="angio-action-go">${icon("chevR")}</span></a>
    </section>`;

    if (list.length) {
      html += `<section class="angio-section-head"><div>${eyebrow("Curriculum")}<h2>Learn in a deliberate sequence</h2><p>Build the visual grammar first, then interpret lesions and make the surgical handoff.</p></div></section>
      <div class="angio-chapter-grid">${list.map((chapter, index) => {
        const sections = arr(chapter.sections || chapter.blocks);
        return `<a class="angio-chapter-card${isRead(chapter.id) ? " angio-chapter-card-read" : ""}" href="${BASE}/learn/${encodeURIComponent(chapter.id)}">
          <span class="angio-chapter-number">${String(index + 1).padStart(2, "0")}</span>
          <div class="angio-chapter-body"><span class="angio-chapter-kicker">${E(chapter.kicker || chapter.category || "Core lesson")}</span><h3>${E(chapter.title)}</h3><p>${E(chapter.summary || chapter.subtitle || chapter.blurb || "Focused angiographic interpretation with an operative lens.")}</p><span class="angio-chapter-meta">${sections.length} sections${chapter.readMins ? ` · ${E(chapter.readMins)} min` : ""}</span></div>
          <span class="angio-chapter-status">${isRead(chapter.id) ? `${icon("check")} Read` : icon("chevR")}</span>
        </a>`;
      }).join("")}</div>`;
    } else html += emptyState("Course content is loading", "No angiography chapters are available yet.");

    if (caseList.length) {
      html += `<section class="angio-section-head"><div>${eyebrow("Cold reads")}<h2>Three-stage case interpretation</h2><p>Commit to a raw read before anatomy labels, final interpretation, and surgical consequences appear.</p></div><a class="angio-text-link" href="${BASE}/case/${encodeURIComponent(caseList[0].id)}">Start cases ${icon("chevR")}</a></section>
      <div class="angio-case-preview-grid">${caseList.slice(0, 4).map((item, index) => {
        const score = caseScores()[item.id];
        return `<a class="angio-case-preview" href="${BASE}/case/${encodeURIComponent(item.id)}"><span class="angio-case-preview-index">Case ${index + 1}</span><h3>${E(item.title)}</h3><p>${E(item.summary || item.subtitle || chapterTitle(item.chapterId))}</p><span class="angio-case-preview-foot">${E(item.difficulty || "Guided read")}${score ? ` · best ${score.best}/2` : ""} ${icon("chevR")}</span></a>`;
      }).join("")}</div>`;
    }
    setHTML(html);
  }

  /* ============================== CHAPTERS ============================== */
  function listHTML(items, ordered) {
    const values = arr(items).filter(item => item != null && item !== "");
    if (!values.length) return "";
    const tag = ordered ? "ol" : "ul";
    return `<${tag} class="angio-prose-list">${values.map(item => `<li>${typeof item === "string" ? rich(item) : rich(item.body || item.text || item.label || item)}</li>`).join("")}</${tag}>`;
  }
  function tableHTML(table, title) {
    if (!table) return "";
    if (typeof table === "string") return `<div class="angio-table-rich">${rich(table)}</div>`;
    let headers = arr(table.headers || table.columns);
    let rows = arr(table.rows || (Array.isArray(table) ? table : []));
    if (!rows.length && Array.isArray(table)) rows = table;
    if (!headers.length && rows[0] && !Array.isArray(rows[0]) && typeof rows[0] === "object") headers = Object.keys(rows[0]);
    if (!rows.length) return "";
    const cells = row => Array.isArray(row) ? row : headers.map(header => row[header] == null ? "" : row[header]);
    return `<div class="angio-table-wrap"><table class="angio-table">${title ? `<caption>${E(title)}</caption>` : ""}${headers.length ? `<thead><tr>${headers.map(header => `<th scope="col">${E(textOf(header))}</th>`).join("")}</tr></thead>` : ""}<tbody>${rows.map(row => `<tr>${cells(row).map((cell, index) => index === 0 ? `<th scope="row">${E(textOf(cell))}</th>` : `<td>${typeof cell === "string" && /<\/?[a-z][^>]*>/i.test(cell) ? cell : E(textOf(cell))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function calloutHTML(kind, title, content) {
    const values = arr(content).filter(Boolean);
    if (!values.length) return "";
    return `<aside class="angio-callout angio-callout-${kind}"><div class="angio-callout-title">${kind === "caution" ? icon("alert") : icon("bulb")}${E(title)}</div>${listHTML(values, false)}</aside>`;
  }
  function sectionImages(section) {
    return arr(section.image || section.images || section.figure).filter(Boolean);
  }
  function renderChapterSection(section, index) {
    const id = section.id || `section-${index + 1}`;
    const body = section.body || section.html || section.content || section.text;
    const type = section.type || section.kicker;
    const images = sectionImages(section);
    return `<section class="angio-chapter-section" id="angio-${E(id)}" data-angio-section>
      <header class="angio-chapter-section-head">${type ? `<span class="angio-section-type">${E(type)}</span>` : ""}<h2>${E(section.title || section.heading || `Section ${index + 1}`)}</h2></header>
      ${body ? `<div class="angio-prose">${rich(body)}</div>` : ""}
      ${section.bullets ? listHTML(section.bullets, false) : ""}
      ${section.steps ? `<div class="angio-steps"><h3>Systematic sequence</h3>${listHTML(section.steps, true)}</div>` : ""}
      ${tableHTML(section.table, section.tableTitle)}
      ${images.length ? `<div class="angio-section-images">${images.map(image => imageHTML(image, { title: section.title })).join("")}</div>` : ""}
      ${figureSlot(id, "content")}
      ${calloutHTML("pearl", section.pearlTitle || "Interpretive pearl", section.pearls || section.pearl)}
      ${calloutHTML("caution", section.cautionTitle || "Pitfall", section.cautions || section.caution)}
    </section>`;
  }
  function renderLearn(id) {
    const chapter = chapterById(id);
    if (!chapter) { location.hash = BASE; return; }
    const list = chapters();
    const index = list.findIndex(item => item.id === chapter.id);
    const sections = arr(chapter.sections || chapter.blocks);
    const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
    const previous = index > 0 ? list[index - 1] : null;
    let html = `<div class="angio-reading-progress" aria-hidden="true"><span></span></div>
      <nav class="angio-breadcrumb" aria-label="Breadcrumb"><a href="${BASE}">${icon("chevL")} Angiography</a><span>${E(chapter.kicker || "Course chapter")}</span></nav>
      <header class="angio-article-head">
        <div>${eyebrow(`Chapter ${index + 1} of ${list.length}`)}<h1>${E(chapter.title)}</h1><p>${E(chapter.summary || chapter.subtitle || chapter.blurb || "")}</p>
          <div class="angio-article-meta">${chapter.readMins ? `<span>${icon("clock")} ${E(chapter.readMins)} min</span>` : ""}<span>${sections.length} sections</span>${isRead(chapter.id) ? `<span class="angio-read-badge">${icon("check")} Read</span>` : ""}</div>
        </div>
      </header>`;
    html += figureSlot(chapter.id, "content");
    if (chapter.objectives && arr(chapter.objectives).length) html += `<section class="angio-objectives"><h2>By the end, you should be able to</h2>${listHTML(chapter.objectives, false)}</section>`;
    if (sections.length > 1) html += `<nav class="angio-toc" aria-label="Chapter contents"><div class="angio-toc-title">On this page</div><ol>${sections.map((section, sectionIndex) => `<li><button type="button" data-angio-toc="${sectionIndex}"><span>${String(sectionIndex + 1).padStart(2, "0")}</span>${E(section.title || section.heading || `Section ${sectionIndex + 1}`)}</button></li>`).join("")}</ol></nav>`;
    html += `<article class="angio-article">${sections.map(renderChapterSection).join("")}</article>`;
    if (chapter.keyPoints || chapter.takeaways) html += `<section class="angio-takeaways"><h2>${icon("check")} Chapter synthesis</h2>${listHTML(chapter.keyPoints || chapter.takeaways, false)}</section>`;
    html += `<footer class="angio-article-foot">
      <button type="button" class="angio-btn${isRead(chapter.id) ? " angio-btn-secondary" : ""}" data-angio-mark-read aria-pressed="${isRead(chapter.id)}">${isRead(chapter.id) ? `${icon("refresh")} Mark unread` : `${icon("check")} Mark chapter read`}</button>
      <div class="angio-article-nav">${previous ? `<a class="angio-btn angio-btn-quiet" href="${BASE}/learn/${encodeURIComponent(previous.id)}">${icon("chevL")} Previous</a>` : ""}${next ? `<a class="angio-btn" href="${BASE}/learn/${encodeURIComponent(next.id)}">Next chapter ${icon("chevR")}</a>` : `<a class="angio-btn" href="${BASE}/quiz">Test the complete module ${icon("target")}</a>`}</div>
    </footer>`;
    setHTML(html);
    wireLightboxes($main());
    const mark = $main().querySelector("[data-angio-mark-read]");
    if (mark) mark.onclick = () => {
      const read = toggleRead(chapter.id);
      mark.classList.toggle("angio-btn-secondary", read);
      mark.innerHTML = read ? `${icon("refresh")} Mark unread` : `${icon("check")} Mark chapter read`;
      mark.setAttribute("aria-pressed", String(read));
    };
    installChapterNavigation();
  }
  function installChapterNavigation() {
    const main = $main();
    const sections = Array.from(main.querySelectorAll("[data-angio-section]"));
    const buttons = Array.from(main.querySelectorAll("[data-angio-toc]"));
    buttons.forEach(button => button.onclick = () => {
      const target = sections[Number(button.dataset.angioToc)];
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const paintProgress = () => {
      const article = main.querySelector(".angio-article");
      const meter = main.querySelector(".angio-reading-progress > span");
      if (!article || !meter) return;
      const rect = article.getBoundingClientRect();
      const traversed = Math.max(0, -rect.top + window.innerHeight * 0.25);
      const total = Math.max(1, rect.height - window.innerHeight * 0.45);
      meter.style.width = `${Math.min(100, Math.round(100 * traversed / total))}%`;
    };
    window.addEventListener("scroll", paintProgress, { passive: true });
    paintProgress();
    let observer = null;
    if ("IntersectionObserver" in window && sections.length) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = sections.indexOf(entry.target);
        buttons.forEach((button, buttonIndex) => button.classList.toggle("angio-toc-active", buttonIndex === index));
      }), { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
      sections.forEach(section => observer.observe(section));
    }
    viewCleanup = () => { window.removeEventListener("scroll", paintProgress); if (observer) observer.disconnect(); };
  }

  /* ============================== IMAGE ATLAS ============================== */
  const AtlasState = { query: "", vessel: "all", projection: "all" };
  function atlasEntries() {
    const list = imageLibrary().slice();
    const seen = new Set(list.map(item => imageSrc(resolveImage(item)) || item.id));
    cases().forEach(item => arr(item.images || item.image).forEach((reference, index) => {
      const image = resolveImage(reference);
      if (!image || !imageSrc(image)) return;
      const key = image.id || imageSrc(image);
      if (seen.has(key)) return;
      seen.add(key);
      list.push(Object.assign({ id: `${item.id}-${index}`, title: item.title, caseId: item.id, chapterId: item.chapterId }, image));
    }));
    return list;
  }
  function uniqueMeta(list, fields) {
    return Array.from(new Set(list.map(item => fields.map(field => item[field]).find(Boolean)).filter(Boolean).map(String))).sort((a, b) => a.localeCompare(b));
  }
  function optionHTML(values, selected, allLabel) {
    return `<option value="all">${E(allLabel)}</option>${values.map(value => `<option value="${E(value)}"${String(value) === String(selected) ? " selected" : ""}>${E(value)}</option>`).join("")}`;
  }
  function renderAtlas() {
    const list = atlasEntries();
    const vessels = uniqueMeta(list, ["vessel", "artery", "territory"]);
    const projections = uniqueMeta(list, ["projection", "view"]);
    setHTML(`<nav class="angio-breadcrumb" aria-label="Breadcrumb"><a href="${BASE}">${icon("chevL")} Angiography</a><span>Projection atlas</span></nav>
      <header class="angio-page-head"><div>${eyebrow("Visual reference")}<h1>Coronary angiography atlas</h1><p>Search the extracted slide images by vessel or projection, then open any frame for high-resolution inspection.</p></div><span class="angio-count-badge" data-angio-atlas-count>${list.length} images</span></header>
      ${figureSlot("atlas", "content")}
      <div class="angio-atlas-tools" role="search">
        <label class="angio-search"><span>${icon("search")}</span><span class="angio-sr-only">Search atlas</span><input type="search" data-angio-atlas-search placeholder="Search view, vessel, finding…" value="${E(AtlasState.query)}"></label>
        <label class="angio-filter"><span>Vessel</span><select data-angio-atlas-vessel>${optionHTML(vessels, AtlasState.vessel, "All vessels")}</select></label>
        <label class="angio-filter"><span>Projection</span><select data-angio-atlas-projection>${optionHTML(projections, AtlasState.projection, "All projections")}</select></label>
      </div>
      <div class="angio-atlas-grid" data-angio-atlas-grid></div>`);
    const search = $main().querySelector("[data-angio-atlas-search]");
    const vessel = $main().querySelector("[data-angio-atlas-vessel]");
    const projection = $main().querySelector("[data-angio-atlas-projection]");
    const update = () => {
      AtlasState.query = search.value.trim().toLowerCase();
      AtlasState.vessel = vessel.value;
      AtlasState.projection = projection.value;
      paintAtlasGrid();
    };
    search.addEventListener("input", update);
    vessel.addEventListener("change", update);
    projection.addEventListener("change", update);
    paintAtlasGrid();
  }
  function paintAtlasGrid() {
    const host = $main().querySelector("[data-angio-atlas-grid]");
    if (!host) return;
    const list = atlasEntries().filter(item => {
      const vessel = String(item.vessel || item.artery || item.territory || "");
      const projection = String(item.projection || item.view || "");
      const haystack = [item.title, item.caption, item.finding, item.interpretation, vessel, projection, item.tags && arr(item.tags).join(" ")].filter(Boolean).join(" ").toLowerCase();
      return (!AtlasState.query || haystack.includes(AtlasState.query)) &&
        (AtlasState.vessel === "all" || vessel === AtlasState.vessel) &&
        (AtlasState.projection === "all" || projection === AtlasState.projection);
    });
    const count = $main().querySelector("[data-angio-atlas-count]");
    if (count) count.textContent = `${list.length} image${list.length === 1 ? "" : "s"}`;
    host.innerHTML = list.length ? list.map((item, index) => {
      const image = resolveImage(item);
      const meta = [item.projection || item.view, item.vessel || item.artery || item.territory].filter(Boolean);
      const detail = item.finding || item.interpretation || item.caption || "Open the frame and trace the arterial tree systematically.";
      return `<article class="angio-atlas-card">
        <div class="angio-atlas-image">${imageHTML(image, { compact: true, title: item.title || `Angiogram ${index + 1}` })}</div>
        <div class="angio-atlas-card-body"><div class="angio-atlas-meta">${meta.map(value => `<span>${E(value)}</span>`).join("")}</div><h2>${E(item.title || item.label || `Angiographic frame ${index + 1}`)}</h2><p>${E(detail)}</p>
        ${item.caseId ? `<a class="angio-text-link" href="${BASE}/case/${encodeURIComponent(item.caseId)}">Read as a staged case ${icon("chevR")}</a>` : ""}</div>
      </article>`;
    }).join("") : emptyState("No matching frames", "Try a broader search or reset the vessel and projection filters.");
    wireLightboxes(host);
  }

  /* ============================== STAGED CASES ============================== */
  const CaseState = { id: null, stage: 0, unlocked: 0, image: 0 };
  const STAGE_DEFAULTS = [
    { eyebrow: "Stage 1 · raw film", title: "Read it cold", lead: "Do not hunt for the answer. Orient the view, identify the injected system, and trace every visible segment before revealing labels." },
    { eyebrow: "Stage 2 · orientation and anatomy", title: "Name what you are seeing", lead: "Lock down projection, dominance, branch anatomy, overlap, foreshortening, and the segment in question." },
    { eyebrow: "Stage 3 · interpretation and consequence", title: "Turn the image into a plan", lead: "State the lesion, its physiologic meaning, technical limitations, and what changes for revascularization or surgery." }
  ];
  function normalizeStage(value, index, item) {
    const fallback = STAGE_DEFAULTS[index];
    const source = value == null ? {} : (typeof value === "object" ? value : { body: value });
    let body = source.body || source.html || source.text || source.content || source.prompt || "";
    if (!body && index === 0) body = item.prompt || item.stem || fallback.lead;
    if (!body && index === 1) body = item.orientation || item.anatomy || fallback.lead;
    if (!body && index === 2) body = item.interpretation || item.findings || fallback.lead;
    return {
      eyebrow: source.eyebrow || source.label || fallback.eyebrow,
      title: source.title || source.heading || fallback.title,
      lead: source.lead || source.subtitle || "",
      body: body,
      orientation: source.orientation,
      anatomy: source.anatomy,
      findings: source.findings,
      interpretation: source.interpretation,
      reasoning: source.reasoning,
      diagnosis: source.diagnosis,
      synthesis: source.synthesis,
      surgical: source.surgicalConsequence || source.surgical || source.operative || (index === 2 ? (item.surgicalConsequence || item.surgical || item.operativeImpact) : ""),
      bullets: source.bullets || source.checklist || source.points || source.tasks,
      pearls: source.pearls || source.pearl,
      cautions: source.cautions || source.caution || source.pitfalls,
      labels: source.labels || source.overlays || source.annotations
    };
  }
  function caseStages(item) {
    const supplied = arr(item.stages || item.reveal);
    return [0, 1, 2].map(index => normalizeStage(item[`stage${index + 1}`] != null ? item[`stage${index + 1}`] : supplied[index], index, item));
  }
  function stageContentHTML(stage, index) {
    let html = `<div class="angio-stage-copy">${eyebrow(stage.eyebrow)}<h2>${E(stage.title)}</h2>${stage.lead ? `<p class="angio-stage-lead">${E(stage.lead)}</p>` : ""}${stage.body ? `<div class="angio-prose">${rich(stage.body)}</div>` : ""}`;
    [["Orientation", stage.orientation], ["Anatomy map", stage.anatomy], ["Key findings", stage.findings], ["Reasoning", stage.reasoning], ["Diagnosis", stage.diagnosis], ["Synthesis", stage.synthesis], ["Interpretation", stage.interpretation], ["Surgical consequence", stage.surgical]].forEach(pair => {
      if (pair[1]) html += `<section class="angio-stage-detail"><h3>${E(pair[0])}</h3><div class="angio-prose">${rich(pair[1])}</div></section>`;
    });
    if (stage.bullets) html += listHTML(stage.bullets, false);
    html += calloutHTML("pearl", "Reading pearl", stage.pearls);
    html += calloutHTML("caution", "Do not miss", stage.cautions);
    if (index === 0) html += `<div class="angio-cold-read"><span>${icon("clock")}</span><div><strong>Thirty-second discipline</strong><p>Projection → injected artery → dominance → proximal-to-distal trace → branches → stenosis → flow → collaterals → surgical implication.</p></div></div>`;
    return html + `</div>`;
  }
  function caseImageList(item) {
    const values = arr(item.images || item.image).filter(Boolean);
    return values.length ? values : arr(item.imageId).filter(Boolean);
  }
  function renderCase(id) {
    const item = caseById(id);
    if (!item) {
      const first = cases()[0];
      if (first) location.hash = `${BASE}/case/${encodeURIComponent(first.id)}`;
      else { setHTML(emptyState("No cases available", "Staged angiography cases have not been loaded.", BASE, "Back to module")); }
      return;
    }
    if (CaseState.id !== item.id) { CaseState.id = item.id; CaseState.stage = 0; CaseState.unlocked = 0; CaseState.image = 0; }
    const stages = caseStages(item);
    const stage = stages[CaseState.stage];
    const caseList = cases();
    const index = caseList.findIndex(entry => entry.id === item.id);
    const previous = index > 0 ? caseList[index - 1] : null;
    const next = index >= 0 && index < caseList.length - 1 ? caseList[index + 1] : null;
    const images = caseImageList(item);
    const image = resolveImage(images[CaseState.image] || images[0]);
    const imageWithLabels = image ? Object.assign({}, image, { labels: stage.labels || image.labels }) : null;
    const score = caseScores()[item.id];
    const supplementalPhase = CaseState.stage === 0 ? "prompt" : CaseState.stage === 1 ? "feedback" : "debrief";
    const supplementalAnchor = "case:" + item.id + ":stage:" + String(CaseState.stage + 1).padStart(2, "0");
    let html = `<nav class="angio-breadcrumb" aria-label="Breadcrumb"><a href="${BASE}">${icon("chevL")} Angiography</a><span>Case ${index + 1} of ${caseList.length}</span></nav>
      <header class="angio-case-head"><div>${eyebrow(item.difficulty || "Staged interpretation")}<h1>${E(item.title)}</h1><p>${E(item.summary || item.subtitle || chapterTitle(item.chapterId))}</p></div><div class="angio-case-score">${score ? `<span>Best self-rating</span><strong>${score.best}/2</strong>` : `<span>Not yet rated</span><strong>—</strong>`}</div></header>
      <div class="angio-stage-tabs" role="tablist" aria-label="Case reveal stages">${stages.map((entry, stageIndex) => `<button type="button" id="angio-case-stage-tab-${stageIndex}" class="angio-stage-tab${stageIndex === CaseState.stage ? " angio-stage-tab-active" : ""}${stageIndex < CaseState.stage ? " angio-stage-tab-done" : ""}" data-angio-stage="${stageIndex}" role="tab" aria-selected="${stageIndex === CaseState.stage}" aria-controls="angio-case-stage-panel" tabindex="${stageIndex === CaseState.stage ? "0" : "-1"}"${stageIndex > CaseState.unlocked ? " disabled" : ""}><span>${stageIndex < CaseState.unlocked ? icon("check") : stageIndex + 1}</span>${E(["Raw film", "Anatomy", "Interpretation"][stageIndex])}</button>`).join("")}</div>
      <div class="angio-case-layout">
        <section class="angio-case-film" aria-label="Case angiogram">
          ${imageHTML(imageWithLabels, { title: item.title, caption: item.caption, stage: CaseState.stage, labels: stage.labels })}
          ${images.length > 1 ? `<div class="angio-film-strip" aria-label="Case frames">${images.map((reference, imageIndex) => {
            const frame = resolveImage(reference);
            return `<button type="button" class="angio-film-thumb${imageIndex === CaseState.image ? " angio-film-thumb-active" : ""}" data-angio-frame="${imageIndex}" aria-label="Show frame ${imageIndex + 1}"><img src="${E(imageSrc(frame))}" alt="" loading="lazy"></button>`;
          }).join("")}</div>` : ""}
        </section>
        <section id="angio-case-stage-panel" class="angio-stage-panel" role="tabpanel" aria-labelledby="angio-case-stage-tab-${CaseState.stage}" tabindex="-1">${stageContentHTML(stage, CaseState.stage)}
          ${figureSlot(supplementalAnchor, supplementalPhase)}
          <div class="angio-stage-actions">${CaseState.stage > 0 ? `<button type="button" class="angio-btn angio-btn-quiet" data-angio-stage-back>${icon("chevL")} Previous stage</button>` : `<span></span>`}${CaseState.stage < 2 ? `<button type="button" class="angio-btn" data-angio-stage-next>${CaseState.stage === 0 ? "Reveal orientation and anatomy" : "Reveal interpretation and consequence"} ${icon("chevR")}</button>` : ""}</div>
          ${CaseState.stage === 2 ? `<div class="angio-self-rate"><h3>How well did your cold read hold up?</h3><p>Rate the interpretation you committed to before the reveal.</p><div class="angio-self-rate-buttons"><button type="button" data-angio-case-score="0"><span>0</span>Missed the pattern</button><button type="button" data-angio-case-score="1"><span>1</span>Partly correct</button><button type="button" data-angio-case-score="2"><span>2</span>Defensible read</button></div></div>` : ""}
        </section>
      </div>
      <footer class="angio-case-foot"><div>${previous ? `<a class="angio-btn angio-btn-quiet" href="${BASE}/case/${encodeURIComponent(previous.id)}">${icon("chevL")} Previous case</a>` : ""}</div><div><a class="angio-btn angio-btn-secondary" href="${BASE}/drill">Rapid drill</a>${next ? `<a class="angio-btn" href="${BASE}/case/${encodeURIComponent(next.id)}">Next case ${icon("chevR")}</a>` : `<a class="angio-btn" href="${BASE}/quiz">Finish with the quiz ${icon("target")}</a>`}</div></footer>`;
    setHTML(html);
    wireLightboxes($main());
    const stageTabs = Array.from($main().querySelectorAll("[data-angio-stage]"));
    stageTabs.forEach(button => button.onclick = () => {
      const target = Number(button.dataset.angioStage);
      if (target <= CaseState.unlocked) { CaseState.stage = target; renderCase(item.id); }
    });
    stageTabs.forEach(button => button.onkeydown = event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const enabledTabs = stageTabs.filter(tab => !tab.disabled);
      const current = enabledTabs.indexOf(button);
      let nextIndex = current;
      if (event.key === "ArrowRight") nextIndex = (current + 1) % enabledTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (current - 1 + enabledTabs.length) % enabledTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = enabledTabs.length - 1;
      event.preventDefault();
      enabledTabs.forEach(tab => tab.setAttribute("tabindex", "-1"));
      enabledTabs[nextIndex].setAttribute("tabindex", "0");
      enabledTabs[nextIndex].focus();
    });
    const forward = $main().querySelector("[data-angio-stage-next]");
    if (forward) forward.onclick = () => {
      CaseState.stage = Math.min(2, CaseState.stage + 1);
      CaseState.unlocked = Math.max(CaseState.unlocked, CaseState.stage);
      renderCase(item.id);
      const panel = $main().querySelector(".angio-stage-panel"); if (panel) panel.focus({ preventScroll: true });
    };
    const back = $main().querySelector("[data-angio-stage-back]");
    if (back) back.onclick = () => { CaseState.stage = Math.max(0, CaseState.stage - 1); renderCase(item.id); };
    $main().querySelectorAll("[data-angio-frame]").forEach(button => button.onclick = () => { CaseState.image = Number(button.dataset.angioFrame); renderCase(item.id); });
    $main().querySelectorAll("[data-angio-case-score]").forEach(button => button.onclick = () => {
      recordCase(item.id, Number(button.dataset.angioCaseScore));
      renderCase(item.id);
    });
  }

  /* ============================== QUESTIONS ============================== */
  function optionText(option) {
    return typeof option === "object" && option !== null ? String(option.text || option.label || option.option || "") : String(option == null ? "" : option);
  }
  function canonicalAnswer(question, options) {
    const objectCorrect = options.findIndex(option => option && typeof option === "object" && (option.correct === true || option.isCorrect === true));
    if (objectCorrect >= 0) return objectCorrect;
    const answer = question.answer != null ? question.answer : question.correct;
    if (typeof answer === "number" && Number.isFinite(answer)) return answer;
    if (typeof answer === "string") {
      const trimmed = answer.trim();
      if (/^\d+$/.test(trimmed)) return Number(trimmed);
      if (/^[A-Za-z]$/.test(trimmed)) return trimmed.toUpperCase().charCodeAt(0) - 65;
      const exact = options.findIndex(option => optionText(option).trim().toLowerCase() === trimmed.toLowerCase());
      if (exact >= 0) return exact;
    }
    return 0;
  }
  function deliveryQuestion(question, index) {
    const rawOptions = arr(question.options || question.choices || question.answers);
    const correct = canonicalAnswer(question, rawOptions);
    const tagged = rawOptions.map((option, optionIndex) => ({ text: optionText(option), correct: optionIndex === correct }));
    const randomized = mixed(tagged);
    return Object.assign({}, question, {
      id: question.id || `angio-q-${index + 1}`,
      stem: question.stem || question.q || question.question || "Question",
      options: randomized.map(option => option.text),
      answer: randomized.findIndex(option => option.correct),
      explanation: question.explanation || question.explain || question.rationale || "",
      teachingPoint: question.teachingPoint || question.pearl || question.takeaway || ""
    });
  }
  function linkedQuestionImage(question) {
    if (question.image || question.imageId) return resolveImage(question.image || question.imageId);
    if (question.caseId) {
      const item = caseById(question.caseId);
      if (item) return resolveImage(caseImageList(item)[0]);
    }
    return null;
  }
  function questionCardHTML(question, picked, mode) {
    const image = linkedQuestionImage(question);
    const answered = picked !== null;
    const correct = answered && picked === question.answer;
    return `<div class="angio-question-card">
      <div class="angio-question-top"><span>${E(question.level || question.difficulty || (mode === "drill" ? "Rapid recognition" : "Single best answer"))}</span><span>${E(question.topic || chapterTitle(question.chapterId))}</span></div>
      ${image ? `<div class="angio-question-image">${imageHTML(image, { compact: true, title: question.stem })}</div>` : ""}
      <h2 class="angio-question-stem">${E(question.stem)}</h2>
      <div class="angio-options" role="group" aria-label="Answer choices">${question.options.map((option, optionIndex) => {
        let state = "";
        if (answered) {
          if (optionIndex === question.answer) state = " angio-option-correct";
          else if (optionIndex === picked) state = " angio-option-wrong";
          else state = " angio-option-dim";
        }
        return `<button type="button" class="angio-option${state}" data-angio-option="${optionIndex}"${answered ? " disabled" : ""}><span class="angio-option-key">${String.fromCharCode(65 + optionIndex)}</span><span>${E(option)}</span>${answered && optionIndex === question.answer ? `<span class="angio-option-mark">${icon("check")}</span>` : ""}</button>`;
      }).join("")}</div>
      ${answered ? `<div class="angio-feedback angio-feedback-${correct ? "correct" : "wrong"}" role="status"><div class="angio-feedback-verdict">${correct ? `${icon("check")} Correct` : "Not quite"}</div>${question.explanation ? `<div class="angio-prose">${rich(question.explanation)}</div>` : ""}${question.teachingPoint ? `<div class="angio-teaching-point"><strong>Carry this forward</strong><div>${rich(question.teachingPoint)}</div></div>` : ""}</div>` : `<p class="angio-keyboard-hint">Keyboard: A–D or 1–4 to answer</p>`}
    </div>`;
  }

  /* ============================== RAPID DRILL ============================== */
  const DrillState = { pool: null, i: 0, correct: 0, answered: null };
  function drillSource() {
    const explicit = arr(AX.drills);
    if (explicit.length) return explicit;
    const visual = questions().filter(question => question.image || question.imageId || question.caseId);
    return visual.length >= 5 ? visual : questions();
  }
  function startDrill() {
    const source = drillSource();
    if (!source.length) {
      setHTML(emptyState("No drill items available", "Add questions or image drills to begin.", BASE, "Back to module"));
      return;
    }
    const count = Math.min(Number(AX.drillLength) || 12, source.length);
    DrillState.pool = mixed(source).slice(0, count).map(deliveryQuestion);
    DrillState.i = 0; DrillState.correct = 0; DrillState.answered = null;
    renderDrill();
  }
  function renderDrill() {
    const pool = DrillState.pool || [];
    if (DrillState.i >= pool.length) {
      recordBest("drill", DrillState.correct, pool.length);
      pulseStreak();
      const pct = pool.length ? Math.round(100 * DrillState.correct / pool.length) : 0;
      setHTML(`<div class="angio-result"><div class="angio-result-mark">${pct >= 80 ? "⚡" : "🎞️"}</div>${eyebrow("Rapid drill complete")}<h1>${DrillState.correct}/${pool.length} correct</h1><p>${pct >= 80 ? "Fast, accurate recognition. Now defend the same decisions in the full cases." : "Slow the sequence down: orient first, trace second, interpret third."}</p><div class="angio-result-actions"><button type="button" class="angio-btn" data-angio-drill-retry>${icon("refresh")} Run another set</button><a class="angio-btn angio-btn-secondary" href="${BASE}/case/${cases()[0] ? encodeURIComponent(cases()[0].id) : ""}">Staged cases</a><a class="angio-btn angio-btn-quiet" href="${BASE}">Module home</a></div></div>`);
      const retry = $main().querySelector("[data-angio-drill-retry]"); if (retry) retry.onclick = startDrill;
      return;
    }
    const question = pool[DrillState.i];
    const pct = Math.round(100 * DrillState.i / pool.length);
    setHTML(`<div class="angio-player-top"><a class="angio-btn angio-btn-quiet angio-btn-small" href="${BASE}">${icon("chevL")} Exit</a><div class="angio-player-progress"><span style="width:${pct}%"></span></div><span class="angio-player-count">${DrillState.i + 1}/${pool.length}</span></div>
      <div class="angio-mode-line">${eyebrow("Rapid recognition drill")}<span>Commit, reveal, correct the mental model.</span></div>
      ${questionCardHTML(question, DrillState.answered, "drill")}
      ${DrillState.answered !== null ? `<div class="angio-player-actions"><button type="button" class="angio-btn" data-angio-drill-next>${DrillState.i === pool.length - 1 ? "See results" : "Next item"} ${icon("chevR")}</button></div>` : ""}`);
    wireLightboxes($main());
    if (DrillState.answered === null) $main().querySelectorAll("[data-angio-option]").forEach(button => button.onclick = () => answerDrill(Number(button.dataset.angioOption)));
    const next = $main().querySelector("[data-angio-drill-next]"); if (next) next.onclick = advanceDrill;
  }
  function answerDrill(index) {
    if (DrillState.answered !== null || !DrillState.pool) return;
    const question = DrillState.pool[DrillState.i];
    DrillState.answered = index;
    const correct = index === question.answer;
    if (correct) DrillState.correct += 1;
    recordQuestion(question.id, correct);
    renderDrill();
  }
  function advanceDrill() { if (DrillState.answered === null) return; DrillState.i += 1; DrillState.answered = null; renderDrill(); }

  /* ============================== FULL QUIZ ============================== */
  const QuizState = { pool: null, i: 0, correct: 0, answered: null, key: "all", label: "Complete module", scope: null };
  function startQuiz(chapterId) {
    const source = chapterId ? questions().filter(question => String(question.chapterId || question.chapter) === String(chapterId)) : questions();
    if (!source.length) {
      setHTML(emptyState("No questions in this scope", "The integrated question bank has not been loaded for this chapter.", BASE, "Back to module"));
      return;
    }
    QuizState.pool = mixed(source).map(deliveryQuestion);
    QuizState.i = 0; QuizState.correct = 0; QuizState.answered = null;
    QuizState.key = chapterId ? `chapter:${chapterId}` : "all";
    QuizState.label = chapterId ? chapterTitle(chapterId) : "Complete angiography module";
    QuizState.scope = chapterId || null;
    renderQuiz();
  }
  function renderQuiz() {
    const pool = QuizState.pool || [];
    if (QuizState.i >= pool.length) {
      recordBest(QuizState.key, QuizState.correct, pool.length);
      pulseStreak();
      const pct = pool.length ? Math.round(100 * QuizState.correct / pool.length) : 0;
      const passed = pct >= PASS * 100;
      setHTML(`<div class="angio-result"><div class="angio-result-mark">${passed ? "🏆" : "📈"}</div>${eyebrow("Integrated quiz complete")}<h1>${QuizState.correct}/${pool.length} correct <span>${pct}%</span></h1><p>${passed ? "You cleared the benchmark. Revisit any miss until you can explain the projection, lesion, and surgical consequence without cues." : "The interpretation chain is not reliable yet. Review the weak chapters, then reshuffle and retest."}</p><div class="angio-result-actions"><button type="button" class="angio-btn" data-angio-quiz-retry>${icon("refresh")} Reshuffle and retry</button><a class="angio-btn angio-btn-secondary" href="${BASE}">Review chapters</a><a class="angio-btn angio-btn-quiet" href="${BASE}/report">Build a report</a></div></div>`);
      const retry = $main().querySelector("[data-angio-quiz-retry]"); if (retry) retry.onclick = () => startQuiz(QuizState.scope);
      return;
    }
    const question = pool[QuizState.i];
    const pct = Math.round(100 * QuizState.i / pool.length);
    setHTML(`<div class="angio-player-top"><a class="angio-btn angio-btn-quiet angio-btn-small" href="${BASE}">${icon("chevL")} Exit</a><div class="angio-player-progress"><span style="width:${pct}%"></span></div><span class="angio-player-count">${QuizState.i + 1}/${pool.length}</span></div>
      <div class="angio-mode-line">${eyebrow(QuizState.label)}<span>Options reshuffle each time the quiz is delivered.</span></div>
      ${questionCardHTML(question, QuizState.answered, "quiz")}
      ${QuizState.answered !== null ? `<div class="angio-player-actions"><button type="button" class="angio-btn" data-angio-quiz-next>${QuizState.i === pool.length - 1 ? "See score" : "Next question"} ${icon("chevR")}</button></div>` : ""}`);
    wireLightboxes($main());
    if (QuizState.answered === null) $main().querySelectorAll("[data-angio-option]").forEach(button => button.onclick = () => answerQuiz(Number(button.dataset.angioOption)));
    const next = $main().querySelector("[data-angio-quiz-next]"); if (next) next.onclick = advanceQuiz;
  }
  function answerQuiz(index) {
    if (QuizState.answered !== null || !QuizState.pool) return;
    const question = QuizState.pool[QuizState.i];
    QuizState.answered = index;
    const correct = index === question.answer;
    if (correct) QuizState.correct += 1;
    recordQuestion(question.id, correct);
    renderQuiz();
  }
  function advanceQuiz() { if (QuizState.answered === null) return; QuizState.i += 1; QuizState.answered = null; renderQuiz(); }

  /* ============================== REPORT BUILDER ============================== */
  const REPORT_FALLBACK = {
    access: ["Not specified", "Right radial", "Left radial", "Right femoral", "Left femoral", "Other"],
    dominance: ["Not assessed", "Right dominant", "Left dominant", "Co-dominant", "Indeterminate"],
    stenosis: ["Not assessed", "Normal / 0%", "<25%", "25–49%", "50–69%", "70–89%", "90–99%", "Occluded"],
    location: ["", "Ostial", "Proximal", "Mid", "Distal", "Diffuse", "Bifurcation"],
    morphology: ["", "Focal", "Diffuse", "Calcified", "Eccentric", "Thrombotic", "Bifurcation", "Chronic total occlusion"],
    flow: ["Not assessed", "TIMI 3", "TIMI 2", "TIMI 1", "TIMI 0"],
    target: ["Not assessed", "Good target", "Borderline target", "Poor target", "Not graftable"],
    segments: [
      { id: "lm", label: "Left main" }, { id: "lad", label: "LAD" }, { id: "d1", label: "Diagonal" },
      { id: "lcx", label: "LCx" }, { id: "om", label: "Obtuse marginal" }, { id: "rca", label: "RCA" },
      { id: "pda", label: "PDA" }, { id: "plb", label: "Posterolateral" }, { id: "grafts", label: "Existing grafts" }
    ]
  };
  let ReportState = null;
  function reportSchema() {
    const supplied = AX.reportOptions || AX.reportSchema || {};
    const schema = {};
    Object.keys(REPORT_FALLBACK).forEach(key => { schema[key] = arr(supplied[key]).length ? arr(supplied[key]) : REPORT_FALLBACK[key]; });
    schema.segments = schema.segments.map((segment, index) => typeof segment === "string" ? { id: `segment-${index}`, label: segment } : segment);
    return schema;
  }
  function freshReportState() {
    const schema = reportSchema();
    const segments = {};
    schema.segments.forEach(segment => { segments[segment.id] = { stenosis: schema.stenosis[0], location: "", morphology: "", flow: schema.flow[0], target: schema.target[0], notes: "" }; });
    return {
      patientContext: "", indication: "", access: schema.access[0], catheter: "", contrast: "", fluoroscopy: "",
      dominance: schema.dominance[0], aorticPressure: "", lvedp: "", ventricularFunction: "", collaterals: "",
      limitations: "", impression: "", surgicalRecommendation: "", segments: segments
    };
  }
  function selectHTML(values, selected, attrs) {
    return `<select class="angio-control" ${attrs || ""}>${values.map(value => {
      const val = textOf(value);
      return `<option value="${E(val)}"${String(val) === String(selected) ? " selected" : ""}>${E(val || "—")}</option>`;
    }).join("")}</select>`;
  }
  function inputHTML(value, attrs, placeholder) {
    return `<input class="angio-control" type="text" value="${E(value)}" ${attrs || ""}${placeholder ? ` placeholder="${E(placeholder)}"` : ""}>`;
  }
  function renderReport() {
    if (!ReportState) ReportState = freshReportState();
    const schema = reportSchema();
    setHTML(`<nav class="angio-breadcrumb" aria-label="Breadcrumb"><a href="${BASE}">${icon("chevL")} Angiography</a><span>Structured report builder</span></nav>
      <header class="angio-page-head"><div>${eyebrow("From film to handoff")}<h1>Build a structured angiography report</h1><p>Document the study in the same order you read it: context, technique, dominance, segment-by-segment disease, flow, target quality, and surgical consequence.</p></div></header>
      <div class="angio-report-layout">
        <form class="angio-report-form" data-angio-report-form>
          <section class="angio-form-section"><div class="angio-form-section-head"><span>01</span><div><h2>Clinical context</h2><p>Say why the angiogram was performed before describing what it shows.</p></div></div>
            <div class="angio-form-grid angio-form-grid-two">
              <label class="angio-field"><span>Patient / study context</span>${inputHTML(ReportState.patientContext, "data-angio-report-field=\"patientContext\"", "e.g., NSTEMI, severe AS, pre-CABG")}</label>
              <label class="angio-field"><span>Indication</span><textarea class="angio-control" rows="2" data-angio-report-field="indication" placeholder="Clinical question and relevant presentation">${E(ReportState.indication)}</textarea></label>
            </div>
          </section>
          <section class="angio-form-section"><div class="angio-form-section-head"><span>02</span><div><h2>Technique and hemodynamics</h2><p>Record acquisition details and anything that constrains interpretation.</p></div></div>
            <div class="angio-form-grid angio-form-grid-three">
              <label class="angio-field"><span>Access</span>${selectHTML(schema.access, ReportState.access, "data-angio-report-field=\"access\"")}</label>
              <label class="angio-field"><span>Catheters / technique</span>${inputHTML(ReportState.catheter, "data-angio-report-field=\"catheter\"", "e.g., JL4/JR4")}</label>
              <label class="angio-field"><span>Contrast</span>${inputHTML(ReportState.contrast, "data-angio-report-field=\"contrast\"", "mL and agent")}</label>
              <label class="angio-field"><span>Fluoroscopy</span>${inputHTML(ReportState.fluoroscopy, "data-angio-report-field=\"fluoroscopy\"", "time / dose")}</label>
              <label class="angio-field"><span>Aortic pressure</span>${inputHTML(ReportState.aorticPressure, "data-angio-report-field=\"aorticPressure\"", "mmHg")}</label>
              <label class="angio-field"><span>LVEDP</span>${inputHTML(ReportState.lvedp, "data-angio-report-field=\"lvedp\"", "mmHg")}</label>
            </div>
          </section>
          <section class="angio-form-section"><div class="angio-form-section-head"><span>03</span><div><h2>Coronary findings</h2><p>Grade stenosis conservatively, describe morphology, and separate lesion severity from graftability.</p></div></div>
            <div class="angio-form-grid angio-form-grid-three angio-report-overview">
              <label class="angio-field"><span>Dominance</span>${selectHTML(schema.dominance, ReportState.dominance, "data-angio-report-field=\"dominance\"")}</label>
              <label class="angio-field"><span>LV function / wall motion</span>${inputHTML(ReportState.ventricularFunction, "data-angio-report-field=\"ventricularFunction\"", "if ventriculography available")}</label>
              <label class="angio-field"><span>Collaterals</span>${inputHTML(ReportState.collaterals, "data-angio-report-field=\"collaterals\"", "source, recipient, grade")}</label>
            </div>
            <div class="angio-segment-wrap"><table class="angio-segment-table"><caption>Segment-by-segment coronary assessment</caption><thead><tr><th scope="col">Segment</th><th scope="col">Stenosis</th><th scope="col">Location</th><th scope="col">Morphology</th><th scope="col">Flow</th><th scope="col">Target</th><th scope="col">Notes</th></tr></thead><tbody>${schema.segments.map(segment => {
              const state = ReportState.segments[segment.id] || {};
              const data = field => `data-angio-report-segment="${E(segment.id)}" data-angio-report-segment-field="${field}"`;
              return `<tr><th scope="row">${E(segment.label || segment.title || segment.id)}</th><td>${selectHTML(schema.stenosis, state.stenosis, data("stenosis"))}</td><td>${selectHTML(schema.location, state.location, data("location"))}</td><td>${selectHTML(schema.morphology, state.morphology, data("morphology"))}</td><td>${selectHTML(schema.flow, state.flow, data("flow"))}</td><td>${selectHTML(schema.target, state.target, data("target"))}</td><td>${inputHTML(state.notes, data("notes"), "branch, size, distal bed…")}</td></tr>`;
            }).join("")}</tbody></table></div>
          </section>
          <section class="angio-form-section"><div class="angio-form-section-head"><span>04</span><div><h2>Impression and surgical synthesis</h2><p>End with the disease pattern, graftable targets, missing information, and the decision-relevant handoff.</p></div></div>
            <div class="angio-form-grid angio-form-grid-two">
              <label class="angio-field"><span>Interpretive limitations</span><textarea class="angio-control" rows="3" data-angio-report-field="limitations" placeholder="Overlap, foreshortening, poor filling, motion, missing views…">${E(ReportState.limitations)}</textarea></label>
              <label class="angio-field"><span>Impression override</span><textarea class="angio-control" rows="3" data-angio-report-field="impression" placeholder="Leave blank to generate from the structured findings">${E(ReportState.impression)}</textarea></label>
              <label class="angio-field angio-field-wide"><span>Surgical recommendation / discussion points</span><textarea class="angio-control" rows="3" data-angio-report-field="surgicalRecommendation" placeholder="Targets, conduit strategy questions, need for physiology or additional imaging…">${E(ReportState.surgicalRecommendation)}</textarea></label>
            </div>
          </section>
          <div class="angio-report-form-actions"><button type="button" class="angio-btn angio-btn-quiet" data-angio-report-reset>${icon("refresh")} Reset builder</button></div>
        </form>
        <aside class="angio-report-preview" aria-label="Generated angiography report"><div class="angio-report-preview-head"><div>${eyebrow("Live output")}<h2>Structured report</h2></div><div><button type="button" class="angio-btn angio-btn-small" data-angio-report-copy>${icon("cards")} Copy</button><button type="button" class="angio-btn angio-btn-small angio-btn-secondary" data-angio-report-download>${icon("download")} .txt</button><button type="button" class="angio-btn angio-btn-small angio-btn-quiet" data-angio-report-print>Print</button></div></div><pre class="angio-report-output" data-angio-report-output></pre><div class="angio-report-status" data-angio-report-status aria-live="polite"></div></aside>
      </div>`);
    const form = $main().querySelector("[data-angio-report-form]");
    form.addEventListener("input", updateReportState);
    form.addEventListener("change", updateReportState);
    const copy = $main().querySelector("[data-angio-report-copy]"); if (copy) copy.onclick = copyReport;
    const download = $main().querySelector("[data-angio-report-download]"); if (download) download.onclick = downloadReport;
    const print = $main().querySelector("[data-angio-report-print]"); if (print) print.onclick = () => window.print();
    const reset = $main().querySelector("[data-angio-report-reset]"); if (reset) reset.onclick = () => { ReportState = freshReportState(); renderReport(); };
    paintReport();
  }
  function updateReportState(event) {
    const control = event.target;
    if (control.dataset.angioReportField) ReportState[control.dataset.angioReportField] = control.value;
    if (control.dataset.angioReportSegment && control.dataset.angioReportSegmentField) {
      const id = control.dataset.angioReportSegment;
      ReportState.segments[id] = ReportState.segments[id] || {};
      ReportState.segments[id][control.dataset.angioReportSegmentField] = control.value;
    }
    paintReport();
  }
  function stenosisRank(value) {
    const text = String(value || "").toLowerCase();
    if (text.includes("occlud")) return 6;
    if (text.includes("90")) return 5;
    if (text.includes("70")) return 4;
    if (text.includes("50")) return 3;
    if (text.includes("25–49") || text.includes("25-49")) return 2;
    if (text.includes("<25")) return 1;
    return 0;
  }
  function sentence(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }
  function buildReportText() {
    const schema = reportSchema();
    const lines = ["CORONARY ANGIOGRAPHY", ""];
    lines.push(`Clinical context: ${ReportState.patientContext || "Not specified"}.`);
    lines.push(`Indication: ${ReportState.indication || "Not specified"}.`, "");
    const technique = [`Access: ${ReportState.access}`];
    if (ReportState.catheter) technique.push(`Technique/catheters: ${ReportState.catheter}`);
    if (ReportState.contrast) technique.push(`Contrast: ${ReportState.contrast}`);
    if (ReportState.fluoroscopy) technique.push(`Fluoroscopy: ${ReportState.fluoroscopy}`);
    lines.push("TECHNIQUE", technique.map(sentence).join(" "), "");
    const hemodynamics = [];
    if (ReportState.aorticPressure) hemodynamics.push(`Aortic pressure ${ReportState.aorticPressure}`);
    if (ReportState.lvedp) hemodynamics.push(`LVEDP ${ReportState.lvedp}`);
    if (hemodynamics.length) lines.push("HEMODYNAMICS", `${hemodynamics.join("; ")}.`, "");
    lines.push("CORONARY ANATOMY AND FINDINGS", `Dominance: ${ReportState.dominance}.`);
    if (ReportState.ventricularFunction) lines.push(`LV function/wall motion: ${sentence(ReportState.ventricularFunction)}`);
    if (ReportState.collaterals) lines.push(`Collaterals: ${sentence(ReportState.collaterals)}`);
    let assessed = 0;
    const significant = [];
    const intermediate = [];
    const targets = [];
    schema.segments.forEach(segment => {
      const state = ReportState.segments[segment.id] || {};
      if (!state.stenosis || /^not assessed$/i.test(state.stenosis)) return;
      assessed += 1;
      const label = segment.label || segment.title || segment.id;
      let finding;
      if (/normal|0%/i.test(state.stenosis)) finding = "No angiographically significant disease";
      else finding = `${state.stenosis} stenosis${state.location ? `, ${state.location.toLowerCase()}` : ""}${state.morphology ? `, ${state.morphology.toLowerCase()}` : ""}`;
      if (state.flow && state.flow !== "Not assessed") finding += `; ${state.flow} flow`;
      if (state.notes) finding += `. ${sentence(state.notes)}`;
      lines.push(`${label}: ${sentence(finding)}`);
      const rank = stenosisRank(state.stenosis);
      const descriptor = `${label} ${state.stenosis}${state.location ? ` ${state.location.toLowerCase()}` : ""}`;
      if ((segment.id === "lm" && rank >= 3) || (segment.id !== "lm" && rank >= 4)) significant.push(descriptor);
      else if (segment.id !== "lm" && rank === 3) intermediate.push(descriptor);
      if (state.target && state.target !== "Not assessed") targets.push(`${label}: ${state.target.toLowerCase()}`);
    });
    if (!assessed) lines.push("No coronary segments have yet been assessed in the builder.");
    if (ReportState.limitations) lines.push("", "LIMITATIONS", sentence(ReportState.limitations));
    const impressionParts = [];
    if (significant.length) impressionParts.push(`Significant coronary disease involving ${significant.join("; ")}.`);
    if (intermediate.length) impressionParts.push(`Intermediate non-left-main disease entered for ${intermediate.join("; ")}; integrate validated physiology or other ischemia evidence when it would change revascularization.`);
    const autoImpression = impressionParts.length ? impressionParts.join(" ") : assessed ? "No left-main stenosis ≥50% or non-left-main high-grade stenosis ≥70% has been entered in the structured fields." : "Incomplete study entry; coronary severity cannot yet be summarized.";
    lines.push("", "IMPRESSION", sentence(ReportState.impression || autoImpression));
    lines.push("", "SURGICAL PERSPECTIVE");
    lines.push(targets.length ? `Target assessment: ${targets.join("; ")}.` : "Graft-target quality has not been specified.");
    if (ReportState.surgicalRecommendation) lines.push(sentence(ReportState.surgicalRecommendation));
    return lines.join("\n");
  }
  function paintReport() {
    const output = $main().querySelector("[data-angio-report-output]");
    if (output) output.textContent = buildReportText();
  }
  function reportStatus(message) {
    const status = $main().querySelector("[data-angio-report-status]");
    if (!status) return;
    status.textContent = message;
    window.setTimeout(() => { if (status.textContent === message) status.textContent = ""; }, 2600);
  }
  async function copyReport() {
    const text = buildReportText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea"); area.value = text; area.setAttribute("readonly", ""); area.className = "angio-copy-fallback";
        document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove();
      }
      reportStatus("Report copied to clipboard.");
    } catch (error) { reportStatus("Copy was blocked. Select the report text manually."); }
  }
  function downloadReport() {
    const blob = new Blob([buildReportText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "coronary-angiography-report.txt"; link.className = "angio-download-link";
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    reportStatus("Text report prepared.");
  }

  /* ============================== ROUTER + KEYBOARD ============================== */
  function render(parts) {
    cleanupView();
    closeLightbox();
    const sub = parts && parts[1];
    if (sub === "learn") renderLearn(parts[2]);
    else if (sub === "atlas") renderAtlas();
    else if (sub === "case") renderCase(parts[2]);
    else if (sub === "drill") startDrill();
    else if (sub === "quiz") startQuiz(parts[2]);
    else if (sub === "report") renderReport();
    else renderHub();
  }
  function keyboardIndex(key) {
    if (/^[1-9]$/.test(key)) return Number(key) - 1;
    if (/^[a-i]$/i.test(key)) return key.toUpperCase().charCodeAt(0) - 65;
    return -1;
  }
  document.addEventListener("keydown", event => {
    if (!/^#\/angiography/.test(location.hash) || activeLightbox) return;
    const target = event.target;
    if (target && target.matches && target.matches("input, textarea, select, button, a, [contenteditable=true]")) return;
    const index = keyboardIndex(event.key);
    if (/^#\/angiography\/quiz/.test(location.hash) && QuizState.pool) {
      if (QuizState.answered === null && index >= 0 && index < QuizState.pool[QuizState.i].options.length) { event.preventDefault(); answerQuiz(index); }
      else if (QuizState.answered !== null && (event.key === "Enter" || event.key === "ArrowRight" || event.key.toLowerCase() === "n")) { event.preventDefault(); advanceQuiz(); }
      return;
    }
    if (/^#\/angiography\/drill/.test(location.hash) && DrillState.pool) {
      if (DrillState.answered === null && index >= 0 && index < DrillState.pool[DrillState.i].options.length) { event.preventDefault(); answerDrill(index); }
      else if (DrillState.answered !== null && (event.key === "Enter" || event.key === "ArrowRight" || event.key.toLowerCase() === "n")) { event.preventDefault(); advanceDrill(); }
      return;
    }
    if (/^#\/angiography\/case/.test(location.hash) && CaseState.id) {
      if (event.key === "ArrowRight" && CaseState.stage < 2) { event.preventDefault(); CaseState.stage += 1; CaseState.unlocked = Math.max(CaseState.unlocked, CaseState.stage); renderCase(CaseState.id); }
      else if (event.key === "ArrowLeft" && CaseState.stage > 0) { event.preventDefault(); CaseState.stage -= 1; renderCase(CaseState.id); }
    }
    if (/^#\/angiography\/atlas/.test(location.hash) && event.key === "/") {
      const search = $main().querySelector("[data-angio-atlas-search]"); if (search) { event.preventDefault(); search.focus(); }
    }
  });
  window.addEventListener("hashchange", () => {
    if (!/^#\/angiography/.test(location.hash)) { cleanupView(); closeLightbox(); }
  });

  window.Angiography = {
    render: render,
    teardown: function () { cleanupView(); closeLightbox(); }
  };
  window.Angio = window.Angiography;

  /* app.js may have routed before this late-loaded module became available. */
  if (/^#\/angiography/.test(location.hash) && typeof route === "function") route();
})();
