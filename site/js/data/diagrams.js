window.DG = {};

window.DG.coronaries = `<svg viewBox="0 0 480 320" role="img" aria-label="Coronary artery diagram">
<style>.dgt{font:600 12px Figtree;fill:var(--fg)} .dgs{font:500 10px Figtree;fill:var(--fg);opacity:.75}</style>
<rect x="170" y="20" width="140" height="100" rx="16" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
<text x="240" y="75" class="dgt" text-anchor="middle">HEART</text>
<path data-zone="lmca" d="M170 70 L110 70" stroke="var(--primary)" stroke-width="4" fill="none" stroke-linecap="round"/>
<text x="75" y="67" class="dgs" text-anchor="middle">LMCA</text>
<path data-zone="lad" d="M110 70 L110 40 Q110 20 140 20 L170 20" stroke="var(--primary)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M110 45 L90 70 L80 110" stroke="var(--secondary)" stroke-width="2" fill="none" stroke-linecap="round"/>
<text x="62" y="30" class="dgs">LAD</text>
<path data-zone="diagonal" d="M100 55 L70 50" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round"/>
<text x="42" y="47" class="dgs">D1</text>
<path data-zone="lcx" d="M110 70 L110 110 Q110 140 150 145 L175 147" stroke="var(--secondary)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<text x="82" y="130" class="dgs">LCx</text>
<path data-zone="om" d="M140 145 L120 175 L115 200" stroke="var(--secondary)" stroke-width="2" fill="none" stroke-linecap="round"/>
<text x="95" y="195" class="dgs">OM1</text>
<path data-zone="rca" d="M310 70 Q360 70 370 120 Q375 160 360 200 L345 240" stroke="var(--primary)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<text x="378" y="78" class="dgt">RCA</text>
<path data-zone="pda" d="M345 240 Q330 270 300 280 L250 285" stroke="var(--primary)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<text x="340" y="278" class="dgs">PDA</text>
<path data-zone="plv" d="M345 240 Q360 265 370 285" stroke="var(--secondary)" stroke-width="2" fill="none" stroke-linecap="round"/>
<text x="360" y="300" class="dgs">PLV</text>
<circle cx="310" cy="70" r="5" fill="var(--primary)"/>
<text x="302" y="55" class="dgt">AO root</text>
<circle cx="110" cy="70" r="5" fill="var(--primary)"/>
</svg>`;

window.DG.chambers = `<svg viewBox="0 0 480 360" role="img" aria-label="Cardiac chambers diagram">
<style>.dgt{font:600 12px Figtree;fill:var(--fg)} .dgs{font:500 10px Figtree;fill:var(--fg);opacity:.8}</style>
<rect x="10" y="10" width="460" height="340" rx="8" fill="var(--surface)" stroke="var(--border)"/>
<ellipse data-zone="ra" cx="300" cy="120" rx="80" ry="70" fill="rgba(220,80,80,.15)" stroke="var(--secondary)" stroke-width="2"/>
<text x="300" y="117" class="dgt" text-anchor="middle">RA</text>
<text x="300" y="131" class="dgs" text-anchor="middle">Right Atrium</text>
<ellipse data-zone="rv" cx="290" cy="255" rx="90" ry="80" fill="rgba(220,80,80,.1)" stroke="var(--secondary)" stroke-width="2"/>
<text x="290" y="252" class="dgt" text-anchor="middle">RV</text>
<text x="290" y="266" class="dgs" text-anchor="middle">Right Ventricle</text>
<ellipse data-zone="la" cx="165" cy="120" rx="75" ry="65" fill="rgba(60,120,220,.15)" stroke="var(--primary)" stroke-width="2"/>
<text x="165" y="117" class="dgt" text-anchor="middle">LA</text>
<text x="165" y="131" class="dgs" text-anchor="middle">Left Atrium</text>
<ellipse data-zone="lv" cx="175" cy="255" rx="85" ry="80" fill="rgba(60,120,220,.1)" stroke="var(--primary)" stroke-width="2"/>
<text x="175" y="252" class="dgt" text-anchor="middle">LV</text>
<text x="175" y="266" class="dgs" text-anchor="middle">Left Ventricle</text>
<rect data-zone="ivs" x="222" y="165" width="28" height="125" rx="6" fill="var(--border)" stroke="var(--fg)" stroke-width="1.5" opacity=".6"/>
<text x="236" y="238" class="dgs" text-anchor="middle">IVS</text>
<rect data-zone="tricuspid" x="216" y="172" width="32" height="14" rx="4" fill="var(--secondary)" opacity=".7"/>
<text x="360" y="178" class="dgs">Tricuspid</text>
<line x1="246" y1="179" x2="356" y2="179" stroke="var(--secondary)" stroke-width="1" stroke-dasharray="4,3"/>
<rect data-zone="mitral" x="216" y="158" width="32" height="14" rx="4" fill="var(--primary)" opacity=".7"/>
<text x="80" y="163" class="dgs" text-anchor="end">Mitral</text>
<line x1="82" y1="165" x2="218" y2="165" stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,3"/>
<rect data-zone="aortic-valve" x="150" y="90" width="30" height="12" rx="4" fill="var(--primary)" opacity=".6"/>
<text x="100" y="83" class="dgs" text-anchor="end">AV</text>
<line x1="102" y1="89" x2="152" y2="96" stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,3"/>
<rect data-zone="pulm-valve" x="272" y="90" width="30" height="12" rx="4" fill="var(--secondary)" opacity=".6"/>
<text x="320" y="83" class="dgs">PV</text>
<line x1="316" y1="89" x2="300" y2="96" stroke="var(--secondary)" stroke-width="1" stroke-dasharray="4,3"/>
</svg>`;

window.DG.cpbcircuit = `<svg viewBox="0 0 520 360" role="img" aria-label="Cardiopulmonary bypass circuit diagram">
<style>.dgt{font:600 12px Figtree;fill:var(--fg)} .dgs{font:500 10px Figtree;fill:var(--fg);opacity:.8}</style>
<rect x="5" y="5" width="510" height="350" rx="8" fill="var(--surface)" stroke="var(--border)"/>
<rect data-zone="venous-cannula" x="30" y="130" width="70" height="40" rx="6" fill="rgba(220,80,80,.2)" stroke="var(--secondary)" stroke-width="2"/>
<text x="65" y="148" class="dgt" text-anchor="middle">Venous</text>
<text x="65" y="162" class="dgs" text-anchor="middle">Cannula</text>
<rect data-zone="venous-reservoir" x="30" y="220" width="70" height="50" rx="6" fill="rgba(220,80,80,.15)" stroke="var(--secondary)" stroke-width="2"/>
<text x="65" y="242" class="dgt" text-anchor="middle">Venous</text>
<text x="65" y="257" class="dgs" text-anchor="middle">Reservoir</text>
<line x1="65" y1="170" x2="65" y2="220" stroke="var(--secondary)" stroke-width="2.5"/>
<rect data-zone="oxygenator" x="165" y="220" width="90" height="50" rx="6" fill="rgba(60,180,80,.2)" stroke="var(--fg)" stroke-width="2"/>
<text x="210" y="242" class="dgt" text-anchor="middle">Membrane</text>
<text x="210" y="257" class="dgs" text-anchor="middle">Oxygenator</text>
<line x1="100" y1="245" x2="165" y2="245" stroke="var(--secondary)" stroke-width="2.5"/>
<rect data-zone="roller-pump" x="310" y="220" width="80" height="50" rx="6" fill="rgba(60,120,220,.2)" stroke="var(--primary)" stroke-width="2"/>
<text x="350" y="242" class="dgt" text-anchor="middle">Roller/</text>
<text x="350" y="257" class="dgs" text-anchor="middle">Centrifugal Pump</text>
<line x1="255" y1="245" x2="310" y2="245" stroke="var(--primary)" stroke-width="2.5"/>
<rect data-zone="arterial-filter" x="390" y="130" width="75" height="40" rx="6" fill="rgba(60,120,220,.15)" stroke="var(--primary)" stroke-width="2"/>
<text x="427" y="147" class="dgt" text-anchor="middle">Arterial</text>
<text x="427" y="161" class="dgs" text-anchor="middle">Line Filter</text>
<line x1="350" y1="220" x2="350" y2="170" stroke="var(--primary)" stroke-width="2.5"/>
<line x1="350" y1="170" x2="390" y2="150" stroke="var(--primary)" stroke-width="2.5"/>
<rect data-zone="arterial-cannula" x="390" y="60" width="75" height="40" rx="6" fill="rgba(60,120,220,.2)" stroke="var(--primary)" stroke-width="2"/>
<text x="427" y="77" class="dgt" text-anchor="middle">Arterial</text>
<text x="427" y="91" class="dgs" text-anchor="middle">Cannula (Ao)</text>
<line x1="427" y1="130" x2="427" y2="100" stroke="var(--primary)" stroke-width="2.5"/>
<rect data-zone="heat-exchanger" x="165" y="130" width="90" height="40" rx="6" fill="rgba(255,160,0,.2)" stroke="var(--fg)" stroke-width="2" opacity=".9"/>
<text x="210" y="147" class="dgt" text-anchor="middle">Heat</text>
<text x="210" y="161" class="dgs" text-anchor="middle">Exchanger</text>
<line x1="210" y1="220" x2="210" y2="170" stroke="var(--fg)" stroke-width="2" opacity=".6"/>
<rect data-zone="cardioplegia-circuit" x="165" y="40" width="90" height="50" rx="6" fill="rgba(180,60,220,.15)" stroke="var(--fg)" stroke-width="2" opacity=".9"/>
<text x="210" y="62" class="dgt" text-anchor="middle">Cardioplegia</text>
<text x="210" y="77" class="dgs" text-anchor="middle">Circuit</text>
<text x="427" y="330" class="dgs" text-anchor="middle">Patient (HEART)</text>
<rect x="370" y="315" width="115" height="25" rx="5" fill="var(--surface)" stroke="var(--border)"/>
<line x1="65" y1="150" x2="65" y2="315" stroke="var(--secondary)" stroke-width="1.5" stroke-dasharray="5,4" opacity=".5"/>
<line x1="427" y1="100" x2="427" y2="315" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="5,4" opacity=".5"/>
</svg>`;

window.DG.aorticroot = `<svg viewBox="0 0 420 340" role="img" aria-label="Aortic root and valve diagram">
<style>.dgt{font:600 12px Figtree;fill:var(--fg)} .dgs{font:500 10px Figtree;fill:var(--fg);opacity:.8}</style>
<rect x="5" y="5" width="410" height="330" rx="8" fill="var(--surface)" stroke="var(--border)"/>
<path data-zone="asc-aorta" d="M180 20 Q185 20 200 20 Q230 20 235 50 L235 120" stroke="var(--primary)" stroke-width="3" fill="none"/>
<path d="M180 20 Q175 20 160 20 Q140 20 135 50 L135 120" stroke="var(--primary)" stroke-width="3" fill="none"/>
<text x="200" y="40" class="dgt">Ascending Aorta</text>
<ellipse data-zone="aortic-annulus" cx="185" cy="180" rx="55" ry="25" fill="rgba(60,120,220,.15)" stroke="var(--primary)" stroke-width="2.5"/>
<text x="185" y="183" class="dgt" text-anchor="middle">Aortic Annulus</text>
<path data-zone="sinuses-of-valsalva" d="M130 155 Q115 125 135 100 Q155 80 185 80 Q215 80 235 100 Q255 125 240 155" fill="rgba(60,120,220,.1)" stroke="var(--primary)" stroke-width="2" opacity=".8"/>
<text x="185" y="100" class="dgs" text-anchor="middle">Sinuses of Valsalva</text>
<circle data-zone="rca-ostium" cx="143" cy="118" r="7" fill="rgba(220,80,80,.4)" stroke="var(--secondary)" stroke-width="2"/>
<text x="80" y="108" class="dgs">RCA ostium</text>
<line x1="110" y1="112" x2="138" y2="118" stroke="var(--secondary)" stroke-width="1" stroke-dasharray="3,3"/>
<circle data-zone="lca-ostium" cx="228" cy="118" r="7" fill="rgba(60,120,220,.4)" stroke="var(--primary)" stroke-width="2"/>
<text x="255" y="108" class="dgs">LCA ostium</text>
<line x1="255" y1="112" x2="233" y2="118" stroke="var(--primary)" stroke-width="1" stroke-dasharray="3,3"/>
<path data-zone="ncc" d="M153 95 L215 95" stroke="var(--fg)" stroke-width="2" opacity=".5"/>
<text x="185" y="78" class="dgs" text-anchor="middle">NCC (non-coronary)</text>
<rect data-zone="lvot" x="150" y="195" width="70" height="55" rx="5" fill="rgba(60,120,220,.1)" stroke="var(--primary)" stroke-width="2"/>
<text x="185" y="220" class="dgt" text-anchor="middle">LVOT</text>
<text x="185" y="236" class="dgs" text-anchor="middle">LV outflow tract</text>
<rect data-zone="lv-body" x="140" y="252" width="90" height="70" rx="20" fill="rgba(60,120,220,.08)" stroke="var(--primary)" stroke-width="1.5"/>
<text x="185" y="292" class="dgt" text-anchor="middle">LV</text>
</svg>`;

window.DG.mediastinum = `<svg viewBox="0 0 480 380" role="img" aria-label="Mediastinum anatomy diagram">
<style>.dgt{font:600 12px Figtree;fill:var(--fg)} .dgs{font:500 10px Figtree;fill:var(--fg);opacity:.8}</style>
<rect x="5" y="5" width="470" height="370" rx="8" fill="var(--surface)" stroke="var(--border)"/>
<rect x="30" y="20" width="420" height="340" rx="10" fill="none" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="6,4" opacity=".5"/>
<line x1="240" y1="20" x2="240" y2="360" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4" opacity=".4"/>
<rect data-zone="sternum" x="210" y="20" width="60" height="300" rx="5" fill="rgba(180,140,80,.2)" stroke="var(--fg)" stroke-width="2" opacity=".7"/>
<text x="240" y="172" class="dgt" text-anchor="middle" dominant-baseline="middle">Sternum</text>
<ellipse data-zone="heart-pericardium" cx="240" cy="210" rx="95" ry="100" fill="rgba(60,120,220,.1)" stroke="var(--primary)" stroke-width="2"/>
<text x="240" y="200" class="dgt" text-anchor="middle">Heart</text>
<text x="240" y="216" class="dgs" text-anchor="middle">(Pericardium)</text>
<rect data-zone="trachea" x="220" y="25" width="40" height="80" rx="8" fill="rgba(80,200,80,.15)" stroke="var(--fg)" stroke-width="2"/>
<text x="240" y="72" class="dgt" text-anchor="middle">Trachea</text>
<ellipse data-zone="thymus" cx="240" cy="130" rx="40" ry="25" fill="rgba(200,160,60,.2)" stroke="var(--fg)" stroke-width="1.5" opacity=".8"/>
<text x="240" y="134" class="dgs" text-anchor="middle">Thymus</text>
<path data-zone="svc" d="M300 90 Q330 100 330 150 Q330 190 310 210" stroke="var(--secondary)" stroke-width="3" fill="none"/>
<text x="345" y="130" class="dgt">SVC</text>
<path data-zone="ivc" d="M310 285 Q330 295 330 320" stroke="var(--secondary)" stroke-width="3" fill="none"/>
<text x="340" y="305" class="dgt">IVC</text>
<path data-zone="aortic-arch" d="M155 165 Q160 100 210 80 Q240 68 270 80 Q310 95 320 150" stroke="var(--primary)" stroke-width="3.5" fill="none"/>
<text x="155" y="140" class="dgt">Aortic Arch</text>
<path data-zone="esophagus" x="150" d="M170 80 L165 310" stroke="var(--fg)" stroke-width="2.5" fill="none" opacity=".6"/>
<text x="130" y="200" class="dgt" text-anchor="end">Esophagus</text>
<line x1="132" y1="200" x2="164" y2="200" stroke="var(--fg)" stroke-width="1" stroke-dasharray="3,3" opacity=".6"/>
<path data-zone="phrenic-nerve" d="M330 80 Q350 160 345 300" stroke="var(--fg)" stroke-width="1.5" fill="none" stroke-dasharray="5,4" opacity=".7"/>
<text x="360" y="190" class="dgs">Phrenic n.</text>
</svg>`;

window.DG.conduction = `<svg viewBox="0 0 440 360" role="img" aria-label="Cardiac conduction system diagram">
<style>.dgt{font:600 12px Figtree;fill:var(--fg)} .dgs{font:500 10px Figtree;fill:var(--fg);opacity:.8}</style>
<rect x="5" y="5" width="430" height="350" rx="8" fill="var(--surface)" stroke="var(--border)"/>
<ellipse cx="215" cy="180" rx="140" ry="150" fill="none" stroke="var(--border)" stroke-width="2"/>
<ellipse cx="215" cy="105" rx="105" ry="75" fill="rgba(60,120,220,.06)" stroke="var(--border)" stroke-width="1.5"/>
<ellipse cx="215" cy="245" rx="125" ry="100" fill="rgba(60,120,220,.04)" stroke="var(--border)" stroke-width="1.5"/>
<circle data-zone="sa-node" cx="295" cy="80" r="12" fill="rgba(255,180,0,.35)" stroke="var(--fg)" stroke-width="2"/>
<text x="315" y="75" class="dgt">SA Node</text>
<text x="315" y="89" class="dgs">(pacemaker)</text>
<circle data-zone="av-node" cx="245" cy="160" r="12" fill="rgba(220,80,80,.35)" stroke="var(--fg)" stroke-width="2"/>
<text x="265" y="155" class="dgt">AV Node</text>
<text x="265" y="169" class="dgs">(Koch's triangle)</text>
<path d="M295 80 Q270 120 245 160" stroke="var(--fg)" stroke-width="1.5" fill="none" stroke-dasharray="5,4" opacity=".7"/>
<rect data-zone="bundle-of-his" x="218" y="168" width="56" height="16" rx="5" fill="rgba(80,160,80,.25)" stroke="var(--fg)" stroke-width="1.5"/>
<text x="246" y="180" class="dgs" text-anchor="middle">Bundle of His</text>
<line x1="246" y1="184" x2="246" y2="200" stroke="var(--fg)" stroke-width="1.5" opacity=".7"/>
<path data-zone="right-bundle" d="M246 200 Q260 220 275 270 Q285 300 290 320" stroke="var(--secondary)" stroke-width="2.5" fill="none"/>
<text x="300" y="285" class="dgt">RBB</text>
<path data-zone="left-bundle" d="M246 200 Q225 215 200 255 Q180 285 160 310" stroke="var(--primary)" stroke-width="2.5" fill="none"/>
<text x="125" y="298" class="dgt" text-anchor="end">LBB</text>
<path data-zone="left-anterior-fascicle" d="M200 255 Q185 260 160 255 Q130 250 110 240" stroke="var(--primary)" stroke-width="1.8" fill="none" stroke-dasharray="4,3"/>
<text x="85" y="240" class="dgs" text-anchor="end">LAF</text>
<path data-zone="left-posterior-fascicle" d="M200 255 Q195 280 180 300 Q165 315 150 320" stroke="var(--primary)" stroke-width="1.8" fill="none" stroke-dasharray="4,3"/>
<text x="120" y="325" class="dgs" text-anchor="end">LPF</text>
<ellipse data-zone="purkinje-fibers" cx="215" cy="310" rx="90" ry="20" fill="rgba(255,200,0,.1)" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="4,3" opacity=".7"/>
<text x="215" y="313" class="dgs" text-anchor="middle">Purkinje Fibers</text>
</svg>`;
