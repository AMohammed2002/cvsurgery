/* Anatomy diagram library — themable inline SVG (mirrors window.DG conventions).
   Regions reference these by key, e.g. diagram:"ADG.coronary_overview".
   Region.diagram is OPTIONAL. Use var(--fg)/var(--primary)/var(--accent) for theming. */
window.ADG = {};

/* ---- Coronary artery overview ---- */
window.ADG.coronary_overview = `
<svg viewBox="0 0 480 300" role="img" aria-label="Coronary artery overview">
  <style>.adt{font:600 12px Figtree,sans-serif;fill:var(--fg);pointer-events:none}.ads{font:600 10.5px Figtree,sans-serif;fill:var(--fg-soft);pointer-events:none}</style>
  <ellipse cx="240" cy="150" rx="120" ry="100" fill="none" stroke="var(--fg-soft)" stroke-width="2"/>
  <text x="240" y="155" text-anchor="middle" class="ads">Heart</text>
  <path d="M240 50 Q200 40 170 80" stroke="var(--primary)" stroke-width="3" fill="none"/>
  <text x="155" y="68" class="ads" style="fill:var(--primary)">LM</text>
  <path d="M170 80 Q140 110 130 180" stroke="var(--primary)" stroke-width="2.5" fill="none"/>
  <text x="108" y="135" class="ads" style="fill:var(--primary)">LAD</text>
  <path d="M170 80 Q170 130 180 170" stroke="var(--primary)" stroke-width="2" fill="none"/>
  <text x="182" y="155" class="ads" style="fill:var(--primary)">Cx</text>
  <path d="M240 50 Q280 40 310 80 Q340 130 330 200" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
  <text x="340" y="135" class="ads" style="fill:var(--accent)">RCA</text>
  <path d="M330 200 Q290 240 240 245" stroke="var(--accent)" stroke-width="2" fill="none"/>
  <text x="255" y="258" class="ads" style="fill:var(--accent)">PDA</text>
  <circle cx="240" cy="50" r="7" fill="var(--primary)" opacity="0.7"/>
  <text x="242" y="38" class="ads">Aortic root</text>
</svg>`;

/* ---- Triangle of Koch (conduction) ---- */
window.ADG.triangle_koch = `
<svg viewBox="0 0 400 260" role="img" aria-label="Triangle of Koch">
  <style>.adt{font:600 12px Figtree,sans-serif;fill:var(--fg);pointer-events:none}.ads{font:600 10.5px Figtree,sans-serif;fill:var(--fg-soft);pointer-events:none}</style>
  <polygon points="200,60 80,210 320,210" fill="rgba(124,58,237,.15)" stroke="var(--mnem,#7c3aed)" stroke-width="2" stroke-dasharray="5 3"/>
  <text x="195" y="52" text-anchor="middle" class="adt" style="fill:var(--mnem,#7c3aed)">AV Node</text>
  <circle cx="200" cy="65" r="8" fill="var(--mnem,#7c3aed)" opacity="0.7"/>
  <text x="55" y="228" class="ads">Tendon of Todaro</text>
  <text x="255" y="228" class="ads">Septal TV hinge</text>
  <line x1="80" y1="210" x2="320" y2="210" stroke="var(--primary)" stroke-width="2.5"/>
  <text x="185" y="206" class="ads" style="fill:var(--primary)">Coronary sinus</text>
</svg>`;

/* ---- Mitral valve leaflets ---- */
window.ADG.mitral_valve = `
<svg viewBox="0 0 400 220" role="img" aria-label="Mitral valve leaflets">
  <style>.adt{font:600 12px Figtree,sans-serif;fill:var(--fg);pointer-events:none}.ads{font:600 10.5px Figtree,sans-serif;fill:var(--fg-soft);pointer-events:none}</style>
  <ellipse cx="200" cy="110" rx="140" ry="90" fill="none" stroke="var(--fg-soft)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M80 110 Q200 55 320 110" stroke="var(--primary)" stroke-width="3" fill="rgba(8,145,178,.18)"/>
  <text x="195" y="85" text-anchor="middle" class="ads" style="fill:var(--primary)">Anterior leaflet (A1-A2-A3)</text>
  <path d="M80 110 Q200 165 320 110" stroke="var(--accent)" stroke-width="3" fill="rgba(5,150,105,.18)"/>
  <text x="195" y="148" text-anchor="middle" class="ads" style="fill:var(--accent)">Posterior leaflet (P1-P2-P3)</text>
  <circle cx="80" cy="110" r="5" fill="var(--fg-soft)"/>
  <circle cx="320" cy="110" r="5" fill="var(--fg-soft)"/>
  <text x="30" y="114" class="ads">AL comm.</text>
  <text x="325" y="114" class="ads">PM comm.</text>
</svg>`;

/* ---- LIMA course ---- */
window.ADG.lima_course = `
<svg viewBox="0 0 360 300" role="img" aria-label="LIMA course on posterior chest wall">
  <style>.adt{font:600 12px Figtree,sans-serif;fill:var(--fg);pointer-events:none}.ads{font:600 10.5px Figtree,sans-serif;fill:var(--fg-soft);pointer-events:none}</style>
  <line x1="180" y1="20" x2="180" y2="280" stroke="var(--fg-soft)" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="185" y="18" class="ads">Sternum (midline)</text>
  <path d="M140 40 Q138 150 135 260" stroke="var(--primary)" stroke-width="3" fill="none"/>
  <text x="80" y="155" class="adt" style="fill:var(--primary)">LIMA</text>
  <text x="82" y="168" class="ads">~2 cm lateral</text>
  <text x="82" y="180" class="ads">to sternal edge</text>
  <line x1="135" y1="100" x2="90" y2="100" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <text x="30" y="104" class="ads">Int. IC m.</text>
  <line x1="135" y1="70" x2="90" y2="62" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="25" y="60" class="ads" style="fill:var(--accent)">Pericardiophrenic a.</text>
  <line x1="135" y1="255" x2="90" y2="265" stroke="var(--fg-soft)" stroke-width="1.5"/>
  <text x="20" y="270" class="ads">Sup. epigastric a.</text>
</svg>`;
