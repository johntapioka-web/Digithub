/* ============================================================
   DFX — Cyber-Shogun · logique de la page (autonome)
   - <image-slot> light-DOM (glisser-déposer, persistance localStorage)
   - génération étoiles / barres d'égaliseur cyan
   - panneau Tweaks « Dark Blu & Galaxie »
   - export PNG plein format (SVG foreignObject → canvas)
   ============================================================ */
(() => {
  'use strict';
  const AVATAR_MASKED_URI='./masque.png';
  const AVATAR_URI='./dfx-terrestre.jpg';

  /* ---------------------------------------------------------
     RNG déterministe — repris du prototype (Lehmer / MINSTD)
     pour reproduire exactement la même distribution.
     --------------------------------------------------------- */
  function seeded(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  /* État global piloté par le panneau Tweaks */
  const state = {
    accent: '#2440D6',
    starDensity: 30, // %
    cyanGlow: 25,    // %
    showCircuit: true,
  };

  /* Registres pour pouvoir figer les animations à l'export */
  let starParticles = []; // {el, rise, dx, peak, dur, phase, anim, delay}
  let eqBars = [];        // {el, lo, hi, dur, phase, anim, delay}

  /* =========================================================
     1) GÉNÉRATION DES ÉTOILES
     makeStars(base, seed, rise) — identique au prototype.
     ========================================================= */
  function buildStars() {
    starParticles = [];
    document.querySelectorAll('.stars[data-stars]').forEach((container) => {
      container.textContent = '';
      const base = +container.dataset.stars;
      const seed = +container.dataset.seed;
      const rise = +container.dataset.rise;
      const rnd = seeded(seed);
      const n = Math.max(2, Math.round(base * (0.18 + state.starDensity / 100)));

      const frag = document.createDocumentFragment();
      for (let i = 0; i < n; i++) {
        const size = 1.6 + rnd() * 4;
        const dur = 8 + rnd() * 10;
        const peak = 0.3 + rnd() * 0.5;
        const cyan = rnd() > 0.6;
        const bottom = -12 - rnd() * 50;
        const left = rnd() * 100;
        const dx = (rnd() - 0.5) * 220;
        const phase = rnd();
        const delay = -phase * dur;

        const el = document.createElement('span');
        const anim = 'starRise ' + dur + 's linear infinite';
        el.style.cssText =
          'position:absolute;' +
          'bottom:' + bottom + 'px;' +
          'left:' + left + '%;' +
          'width:' + size + 'px;height:' + size + 'px;' +
          'border-radius:50%;' +
          'background:' + (cyan ? 'var(--accent,#2440D6)' : 'rgba(231,236,255,0.95)') + ';' +
          'box-shadow:0 0 ' + (5 + size * 2.2) + 'px ' + (1.5 + size) + 'px var(--accent,#2440D6);' +
          'opacity:0;' +
          '--rise:' + rise + 'px;' +
          '--dx:' + dx + 'px;' +
          '--peak:' + peak + ';' +
          'pointer-events:none;';
        el.style.animation = anim;
        el.style.animationDelay = delay + 's';

        frag.appendChild(el);
        starParticles.push({ el, rise, dx, peak, dur, phase, anim, delay });
      }
      container.appendChild(frag);
    });
  }

  /* =========================================================
     2) GÉNÉRATION DES BARRES D'ÉGALISEUR
     makeEq(count, seed, w, h) — identique au prototype.
     ========================================================= */
  function buildEq() {
    eqBars = [];
    document.querySelectorAll('.eq[data-eq]').forEach((container) => {
      container.textContent = '';
      const count = +container.dataset.eq;
      const seed = +container.dataset.seed;
      const w = +container.dataset.w;
      const h = +container.dataset.h;
      const rnd = seeded(seed);

      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const lo = 0.16 + rnd() * 0.3;
        const hi = 0.68 + rnd() * 0.55;
        const dur = 0.65 + rnd() * 0.95;
        const phase = rnd();
        const delay = -phase * dur;

        const el = document.createElement('span');
        const anim = 'eqPulse ' + dur + 's ease-in-out infinite';
        el.style.cssText =
          'display:block;' +
          'width:' + w + 'px;height:' + h + 'px;' +
          'border-radius:' + w + 'px;' +
          'transform-origin:bottom;' +
          'background:linear-gradient(180deg, var(--accent,#2440D6), color-mix(in srgb, var(--accent,#2440D6) 45%, #07080C));' +
          'box-shadow:0 0 14px color-mix(in srgb, var(--accent,#2440D6) 60%, transparent);' +
          '--lo:' + lo + ';--hi:' + hi + ';';
        el.style.animation = anim;
        el.style.animationDelay = delay + 's';

        frag.appendChild(el);
        eqBars.push({ el, lo, hi, dur, phase, anim, delay });
      }
      container.appendChild(frag);
    });
  }

  /* =========================================================
     3) <image-slot> — version autonome (light DOM)
     Persistance localStorage ; pas de Shadow DOM pour que
     l'image dropée soit sérialisée à l'export PNG.
     ========================================================= */
  const SLOT_KEY = 'dfx.imageSlots.v1';
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  const MAX_DIM = 1600;

  function loadSlots() {
    try { return JSON.parse(localStorage.getItem(SLOT_KEY)) || {}; }
    catch { return {}; }
  }
  function saveSlots(obj) {
    try { localStorage.setItem(SLOT_KEY, JSON.stringify(obj)); } catch {}
  }

  async function fileToDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  const SLOT_ICON =
    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' +
    '<path d="m21 15-5-5L5 21"/></svg>';

  class ImageSlot extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this._depth = 0;

      this.innerHTML =
        '<img class="slot-img" alt="">' +
        '<div class="slot-empty">' + SLOT_ICON +
        '  <div class="cap"></div>' +
        '  <div class="sub">ou <u>parcourir les fichiers</u></div>' +
        '</div>' +
        '<div class="slot-ring"></div>' +
        '<div class="slot-clear">✕ Retirer</div>' +
        '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';

      this._img = this.querySelector('.slot-img');
      this._empty = this.querySelector('.slot-empty');
      this._cap = this.querySelector('.cap');
      this._input = this.querySelector('input');
      this._clear = this.querySelector('.slot-clear');
      this._cap.textContent = this.getAttribute('placeholder') || 'Déposer une image';

      this._empty.addEventListener('click', () => this._input.click());
      this._clear.addEventListener('click', (e) => { e.stopPropagation(); this._set(null); });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });

      this.addEventListener('dragenter', this._onDrag.bind(this));
      this.addEventListener('dragover', this._onDrag.bind(this));
      this.addEventListener('dragleave', this._onDrag.bind(this));
      this.addEventListener('drop', this._onDrag.bind(this));

      this._render();
    }

    _onDrag(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault(); e.stopPropagation();
        this._depth = 0; this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _ingest(file) {
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        console.warn('<image-slot> : déposez un PNG, JPEG, WebP ou AVIF.');
        return;
      }
      try {
        const url = await fileToDataUrl(file, this.clientWidth || MAX_DIM);
        this._set(url);
      } catch (err) {
        console.warn('<image-slot> : lecture impossible.', err);
      }
    }

    _set(url) {
      const slots = loadSlots();
      const id = this.id;
      if (url) { if (id) slots[id] = url; this._local = url; }
      else { if (id) delete slots[id]; this._local = null; }
      if (id) saveSlots(slots);
      this._render();
    }

    _render() {
      const id = this.id;
      const stored = this._local || (id ? loadSlots()[id] : null);
      const url = stored && /^data:image\//i.test(stored) ? stored : null;
      if (url) {
        this._img.src = url;
        this.setAttribute('data-filled', '');
      } else {
        this._img.removeAttribute('src');
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) customElements.define('image-slot', ImageSlot);

  /* =========================================================
     4) PANNEAU TWEAKS — Dark Blu & Galaxie
     ========================================================= */
  function applyAccent() {
    document.documentElement.style.setProperty('--accent', state.accent);
    const v = document.getElementById('val-accent');
    if (v) v.textContent = state.accent.toUpperCase();
    document.querySelectorAll('#accent-swatches .swatch[data-color]').forEach((s) => {
      s.classList.toggle('active', s.dataset.color.toLowerCase() === state.accent.toLowerCase());
    });
  }
  function applyGlow() {
    document.documentElement.style.setProperty('--glow', (state.cyanGlow / 100).toString());
    const v = document.getElementById('val-glow');
    if (v) v.textContent = state.cyanGlow + '%';
    const rng = document.getElementById('rng-glow');
    if (rng) rng.style.setProperty('--fill', state.cyanGlow + '%');
  }
  function applyStarsLabel() {
    const v = document.getElementById('val-stars');
    if (v) v.textContent = state.starDensity + '%';
    const rng = document.getElementById('rng-stars');
    if (rng) rng.style.setProperty('--fill', state.starDensity + '%');
  }
  function applyCircuit() {
    document.querySelectorAll('.circuit-layer').forEach((el) => {
      el.style.display = state.showCircuit ? '' : 'none';
    });
    const tg = document.getElementById('tg-circuit');
    if (tg) tg.classList.toggle('on', state.showCircuit);
  }

  function initTweaks() {
    // Repli / dépli
    document.getElementById('tw-toggle').addEventListener('click', () => {
      document.getElementById('tweaks').classList.toggle('collapsed');
    });

    // Nuanciers + couleur personnalisée
    document.querySelectorAll('#accent-swatches .swatch[data-color]').forEach((s) => {
      s.addEventListener('click', () => { state.accent = s.dataset.color; applyAccent(); });
    });
    const custom = document.getElementById('accent-custom');
    custom.addEventListener('input', () => { state.accent = custom.value; applyAccent(); });

    // Densité d'étoiles
    document.getElementById('rng-stars').addEventListener('input', (e) => {
      state.starDensity = +e.target.value;
      applyStarsLabel();
      buildStars();
    });

    // Lueur bleu nuit
    document.getElementById('rng-glow').addEventListener('input', (e) => {
      state.cyanGlow = +e.target.value;
      applyGlow();
    });

    // Circuits
    document.getElementById('tg-circuit').addEventListener('click', () => {
      state.showCircuit = !state.showCircuit;
      applyCircuit();
    });

    applyAccent();
    applyGlow();
    applyStarsLabel();
    applyCircuit();
  }

  /* =========================================================
     5) EXPORT PNG plein format
     Technique : on sérialise le nœud natif (2560×1440, etc.)
     dans un <foreignObject> SVG, on rastérise via <img> puis
     canvas → toDataURL. Polices embarquées en data: pour
     garder le canvas non « tainted » et le rendu fidèle.
     ========================================================= */

  // Embarquage des polices Google (woff2 → data:) — mis en cache.
  let fontCssPromise = null;
  function getFontCss() {
    if (fontCssPromise) return fontCssPromise;
    fontCssPromise = (async () => {
      const links = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .filter((l) => /fonts\.googleapis\.com/.test(l.href));
      let out = '';
      for (const link of links) {
        try {
          let css = await (await fetch(link.href)).text();
          const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
          for (const u of urls) {
            try {
              const buf = await (await fetch(u)).arrayBuffer();
              const b64 = abToB64(buf);
              const mime = /\.woff2(\?|$)/.test(u) ? 'font/woff2'
                : /\.woff(\?|$)/.test(u) ? 'font/woff' : 'font/ttf';
              css = css.split(u).join('data:' + mime + ';base64,' + b64);
            } catch { /* on stripera plus bas */ }
          }
          // Sécurité anti-taint : supprime toute URL externe résiduelle.
          css = css.replace(/url\(https:\/\/[^)]+\)/g, "url('')");
          out += css + '\n';
        } catch (e) {
          console.warn('Embarquage police impossible pour', link.href, e);
        }
      }
      return out;
    })();
    return fontCssPromise;
  }

  function abToB64(buf) {
    let bin = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }

  // Fige toutes les animations à leur phase courante (snapshot fidèle).
  function freezeAnimations() {
    for (const p of starParticles) {
      p.el.style.animation = 'none';
      const ty = -p.phase * p.rise;
      const tx = p.phase * p.dx;
      const sc = 1 - 0.65 * p.phase;
      p.el.style.transform = 'translateY(' + ty + 'px) translateX(' + tx + 'px) scale(' + sc + ')';
      let op;
      if (p.phase < 0.14) op = p.peak * (p.phase / 0.14);
      else if (p.phase < 0.78) op = p.peak;
      else op = p.peak * (1 - (p.phase - 0.78) / 0.22);
      p.el.style.opacity = op;
    }
    for (const b of eqBars) {
      b.el.style.animation = 'none';
      const tri = 1 - Math.abs(2 * b.phase - 1); // 0→1→0
      b.el.style.transform = 'scaleY(' + (b.lo + (b.hi - b.lo) * tri) + ')';
    }
    // Lueurs pulsées (glowPulse) : fige à pleine intensité.
    document.querySelectorAll('[style*="glowPulse"]').forEach((el) => {
      el.dataset._anim = el.style.animation;
      el.style.animation = 'none';
    });
  }

  function unfreezeAnimations() {
    for (const p of starParticles) {
      p.el.style.animation = p.anim;
      p.el.style.animationDelay = p.delay + 's';
      p.el.style.transform = '';
      p.el.style.opacity = '0';
    }
    for (const b of eqBars) {
      b.el.style.animation = b.anim;
      b.el.style.animationDelay = b.delay + 's';
      b.el.style.transform = '';
    }
    document.querySelectorAll('[data-_anim]').forEach((el) => {
      el.style.animation = el.dataset._anim;
      delete el.dataset._anim;
    });
  }

  async function exportPng(targetId, w, h) {
    const node = document.querySelector('#' + CSS.escape(targetId) + ' [data-screen-label]');
    if (!node) throw new Error('cible export introuvable : ' + targetId);

    const fontCss = await getFontCss();
    freezeAnimations();

    let dataUrl;
    try {
      const clone = node.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';

      const xmlSer = new XMLSerializer();
      const cloneXml = xmlSer.serializeToString(clone);
      // Les defs (#circuit, #dfx-emblem, gradients) doivent vivre dans le
      // même document SVG pour que url(#…) / <use> résolvent.
      const defs = document.getElementById('dfx-defs').cloneNode(true);
      const defsXml = xmlSer.serializeToString(defs);

      const accent = state.accent;
      const glow = (state.cyanGlow / 100).toString();

      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        'width="' + w + '" height="' + h + '">' +
        '<foreignObject x="0" y="0" width="' + w + '" height="' + h + '">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" ' +
        'style="width:' + w + 'px;height:' + h + 'px;--accent:' + accent + ';--glow:' + glow + ';">' +
        '<style>' + fontCss + '</style>' +
        defsXml + cloneXml +
        '</div></foreignObject></svg>';

      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      const img = new Image();
      img.decoding = 'sync';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = () => rej(new Error('rendu SVG échoué'));
        img.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      dataUrl = canvas.toDataURL('image/png');
    } finally {
      unfreezeAnimations();
    }
    return dataUrl;
  }

  function initExport() {
    document.querySelectorAll('.dl[data-target]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.target;
        const w = +btn.dataset.w, h = +btn.dataset.h;
        const label = btn.textContent;
        btn.disabled = true;
        btn.textContent = '… rendu';
        try {
          const url = await exportPng(id, w, h);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'DFX-' + id + '-' + w + 'x' + h + '.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
          btn.textContent = '✓ PNG';
          setTimeout(() => { btn.textContent = label; }, 1600);
        } catch (e) {
          console.error('Export PNG échoué :', e);
          btn.textContent = '⚠ erreur';
          setTimeout(() => { btn.textContent = label; }, 2200);
        } finally {
          btn.disabled = false;
        }
      });
    });
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    buildStars();
    buildEq();
    initTweaks();
    initExport();
    document.querySelectorAll('img.dfx-avatar').forEach(function(i){ i.src=AVATAR_URI; });
    document.querySelectorAll('img.dfx-avatar-masked').forEach(function(i){ i.src=AVATAR_MASKED_URI; });
    // Précharge les polices embarquées une fois la page rendue (export instantané).
    if ('requestIdleCallback' in window) requestIdleCallback(() => getFontCss());
    else setTimeout(() => getFontCss(), 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
