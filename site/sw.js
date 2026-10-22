const CACHE_PREFIX = "cardiac-school-";
const SHELL_CACHE = CACHE_PREFIX + "shell-v66-surgery-images";
/* Reviewed angiography, C-arm, and original surgery figures live in media cache.
   Activation deletes the old textbook-image cache. */
const MEDIA_CACHE = CACHE_PREFIX + "media-angiography-v2";
const IMAGE_CACHE_BATCH = 40;

/* Figures referenced from JavaScript data are invisible to the app-shell HTML
   parser, so list them explicitly for a complete offline Imaging Day. */
const ANGIOGRAPHY_ASSETS = [
  "./assets/angiography/angiogram-air-embolism.jpg",
  "./assets/angiography/angiogram-calcified-plaque.jpg",
  "./assets/angiography/angiogram-coronary-aneurysm.jpg",
  "./assets/angiography/angiogram-coronary-thrombus.jpg",
  "./assets/angiography/angiogram-lad-pa-fistula.jpg",
  "./assets/angiography/angiogram-left-lao-cranial.jpg",
  "./assets/angiography/angiogram-left-rao-caudal.jpg",
  "./assets/angiography/angiogram-left-rao-cranial-long.jpg",
  "./assets/angiography/angiogram-left-rao-cranial.jpg",
  "./assets/angiography/angiogram-left-spider.jpg",
  "./assets/angiography/angiogram-rca-lao-cranial-distal.jpg",
  "./assets/angiography/angiogram-rca-lao-cranial.jpg",
  "./assets/angiography/angiogram-rca-rao.jpg",
  "./assets/angiography/anomalous-lcx-angiogram.jpg",
  "./assets/angiography/anomaly-left-main-from-right-cusp.jpg",
  "./assets/angiography/anomaly-normal-origins.jpg",
  "./assets/angiography/anomaly-rca-from-left-cusp.jpg",
  "./assets/angiography/challenge-left-lao-cranial.jpg",
  "./assets/angiography/challenge-left-ramus.jpg",
  "./assets/angiography/challenge-left-rao-caudal.jpg",
  "./assets/angiography/coronary-collateral-pathways.jpg",
  "./assets/angiography/cranial-caudal-angulation.png",
  "./assets/angiography/history-first-angiography-lab.jpg",
  "./assets/angiography/history-first-coronary-frame.jpg",
  "./assets/angiography/myocardial-bridge-mechanism.jpg",
  "./assets/angiography/pressure-ventricularization-waveform.png",
  "./assets/angiography/projection-lao-cranial-tree.png",
  "./assets/angiography/projection-rao-caudal-geometry.png",
  "./assets/angiography/projection-rao-caudal-tree.png",
  "./assets/angiography/projection-rca-lao-cranial.png",
  "./assets/angiography/projection-rca-rao-cranial.png",
  "./assets/angiography/projection-steep-lao-tree.png",
  "./assets/angiography/projection-true-lateral-geometry.png",
  "./assets/angiography/projection-true-lateral-tree.png",
  "./assets/angiography/rao-lao-angulation.png"
];

/* Projection plates for the C-arm physiology lab, extracted from the Cath
   Slides deck by tools/extract-cath-slides.py. They live outside
   assets/angiography because that folder must mirror the angiography data. */
const CATH_PROJECTION_ASSETS = [
  "./assets/cath-projections/cath-lca-ap-caudal.jpg",
  "./assets/cath-projections/cath-lca-ap-cranial.jpg",
  "./assets/cath-projections/cath-lca-lao-caudal.jpg",
  "./assets/cath-projections/cath-lca-lao-cranial.jpg",
  "./assets/cath-projections/cath-lca-rao-caudal.jpg",
  "./assets/cath-projections/cath-lca-rao-cranial.jpg",
  "./assets/cath-projections/cath-lv-lao-cranial.jpg",
  "./assets/cath-projections/cath-lv-rao-cranial.jpg",
  "./assets/cath-projections/cath-rca-ap-lao-cranial.jpg",
  "./assets/cath-projections/cath-rca-lao-straight.jpg",
  "./assets/cath-projections/cath-rca-rao-straight.jpg"
];

/* Generated, reviewed surgical teaching figures. Kept explicit so the full
   article collection remains available immediately after an offline install. */
const SURGERY_IMAGE_ASSETS = [
  "./assets/surgery-generated/arch/branch-anatomy.png",
  "./assets/surgery-generated/arch/cerebral-perfusion-v2.png",
  "./assets/surgery-generated/arch/elephant-trunk.png",
  "./assets/surgery-generated/bentall/composite-graft.png",
  "./assets/surgery-generated/bentall/david-yacoub.png",
  "./assets/surgery-generated/bentall/root-anatomy.png",
  "./assets/surgery-generated/bypass/antegrade-vs-retrograde-v2.png",
  "./assets/surgery-generated/bypass/two-stage-vs-bicaval-v3.png",
  "./assets/surgery-generated/bypass/weaning-phenotypes-v2.png",
  "./assets/surgery-generated/cabg/end-to-side-anastomosis-v1.png",
  "./assets/surgery-generated/cabg/graft-routing-v1.png",
  "./assets/surgery-generated/cabg/lita-and-vein-grafts-v2.png",
  "./assets/surgery-generated/lvad/aortic-regurgitation-recirculation-v3.png",
  "./assets/surgery-generated/lvad/device-connections.png",
  "./assets/surgery-generated/lvad/filling-and-suction.png",
  "./assets/surgery-generated/maze/atrial-landmarks-v2.png",
  "./assets/surgery-generated/maze/biatrial-lesion-concept-v1.png",
  "./assets/surgery-generated/maze/transmural-block-v1.png",
  "./assets/surgery-generated/mitral-repair/carpentier-motion-v2.png",
  "./assets/surgery-generated/mitral-repair/resection-vs-neochord-v1.png",
  "./assets/surgery-generated/mitral-repair/sam-outflow-v1.png",
  "./assets/surgery-generated/mvr/chordal-preservation.png",
  "./assets/surgery-generated/mvr/mitral-apparatus-v2.png",
  "./assets/surgery-generated/mvr/paravalvular-leak.png",
  "./assets/surgery-generated/opcab/anaortic-y-graft-v1.png",
  "./assets/surgery-generated/opcab/intracoronary-shunt-v1.png",
  "./assets/surgery-generated/opcab/stabilizer-vs-positioner-v1.png",
  "./assets/surgery-generated/savr/aortic-root-anatomy.png",
  "./assets/surgery-generated/savr/replacement-sequence.png",
  "./assets/surgery-generated/savr/stenosis-and-regurgitation.png",
  "./assets/surgery-generated/sternotomy/redo-entry-adhesions-v1.png",
  "./assets/surgery-generated/sternotomy/retrosternal-anatomy-v1.png",
  "./assets/surgery-generated/sternotomy/sternal-closure-methods-v1.png",
  "./assets/surgery-generated/tvr/functional-tr-v1.png",
  "./assets/surgery-generated/tvr/right-atrial-anatomy-v1.png",
  "./assets/surgery-generated/tvr/ring-vs-de-vega-v2.png",
  "./assets/surgery-generated/type-a/complications.png",
  "./assets/surgery-generated/type-a/malperfusion.png",
  "./assets/surgery-generated/type-a/wall-lumens.png"
];

async function installCompleteRuntime() {
  const shellCache = await caches.open(SHELL_CACHE);
  const mediaCache = await caches.open(MEDIA_CACHE);
  const response = await fetch("./index.html", { cache: "reload" });
  if (!response.ok) throw new Error("Unable to load app shell");
  const html = await response.text();
  const refs = Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), match => match[1])
    .filter(ref => ref && !/^(?:https?:|data:|#)/.test(ref))
    .map(ref => new URL(ref, self.location.href).pathname + new URL(ref, self.location.href).search);
  const canonical = asset => new URL(asset, self.location.href).href;
  const indexUrl = canonical("./index.html");
  const labFiles=['foundations','rhythm','cpb','strategy','support','imaging','or-monitor'].map(name=>'./js/physiology/labs-'+name+'.js?v=launch-1');
  const fonts=[400,500,600,700,800].map(weight=>'./assets/fonts/figtree-'+weight+'.woff2');
  const shellAssets = Array.from(new Set(["./", "./index.html"].concat(refs,labFiles,fonts).map(canonical)));
  const mediaAssets = Array.from(new Set(ANGIOGRAPHY_ASSETS.concat(CATH_PROJECTION_ASSETS, SURGERY_IMAGE_ASSETS).map(canonical)));

  await shellCache.put(indexUrl, new Response(html, { headers: { "Content-Type": "text/html" } }));
  await shellCache.addAll(shellAssets.filter(asset => asset !== indexUrl));

  /* Reuse an already-complete media cache. Only missing assets are fetched,
     which also makes a shell-only update substantially smaller. */
  const missingMedia = [];
  for (const asset of mediaAssets) {
    if (!(await mediaCache.match(asset))) missingMedia.push(asset);
  }
  for (let i = 0; i < missingMedia.length; i += IMAGE_CACHE_BATCH) {
    await mediaCache.addAll(missingMedia.slice(i, i + IMAGE_CACHE_BATCH));
  }
}

self.addEventListener("install", event => {
  /* On upgrades, remain waiting until the learner explicitly applies the
     update. A failed precache therefore leaves the prior worker untouched. */
  event.waitUntil(installCompleteRuntime());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== MEDIA_CACHE)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

/* Versioned assets (every ?v= script/stylesheet) and the media/font folders
   are immutable for a given app version, so they are served cache-first: a
   repeat visit no longer re-downloads the whole course. A version bump
   rewrites every ?v= URL in index.html, which stays network-first below, so
   new URLs simply miss the cache and are fetched fresh. */
function isImmutableAsset(request) {
  if (request.mode === "navigate") return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.endsWith("/sw.js") || url.pathname.endsWith("/index.html")) return false;
  return url.searchParams.has("v") || /\/assets\/(fonts|angiography|cath-projections|surgery-generated)\//.test(url.pathname);
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (isImmutableAsset(event.request)) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.ok) {
        const mediaPath = /\/assets\/(angiography|cath-projections|surgery-generated)\//.test(new URL(event.request.url).pathname);
        caches.open(mediaPath ? MEDIA_CACHE : SHELL_CACHE).then(cache => cache.put(event.request, response.clone()));
      }
      return response;
    })));
    return;
  }
  event.respondWith(fetch(event.request, { cache: "no-store" }).then(response => {
    if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
      const pathname = new URL(event.request.url).pathname;
      const mediaPath = pathname.includes("/assets/angiography/") || pathname.includes("/assets/cath-projections/") || pathname.includes("/assets/surgery-generated/");
      caches.open(mediaPath ? MEDIA_CACHE : SHELL_CACHE).then(cache => cache.put(event.request, response.clone()));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === "navigate") {
      const shellCache = await caches.open(SHELL_CACHE);
      return shellCache.match("./index.html");
    }
    throw new Error("Offline asset unavailable");
  }));
});
