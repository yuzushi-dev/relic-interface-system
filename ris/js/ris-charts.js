/* ============================================================================
   RELIC INTERFACE SYSTEM v2 — ris-charts.js
   Dependency-free SVG charts in RIS style: hard grid, neon stroke + glow,
   square markers, mono labels. Mirrors compose/Charts.kt.

   API (every fn returns the created <svg>):
     RisCharts.line(el, points, opts)    — time series w/ area glow
     RisCharts.bars(el, values, opts)    — bar chart
     RisCharts.spark(el, points, opts)   — inline sparkline
     RisCharts.gauge(el, value, opts)    — square HUD gauge (0..1)
     RisCharts.wave(el, opts)            — animated EEG-style waveform
     RisCharts.bands(el, bands, opts)    — horizontal band meter (EEG bands)
     RisCharts.intraday(el, points, opts)— time-of-day trend w/ baseline band + peak markers

   opts.color: any CSS color (default var(--ris-accent-2)).
   Charts are decorative renderings: ALWAYS pair with an accessible
   text/table alternative (aria-label here is a summary, not a substitute).
   Animations respect prefers-reduced-motion.
   ========================================================================== */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
  let UID = 0;

  function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  function base(el, w, h, label) {
    const svg = svgEl('svg', {
      viewBox: `0 0 ${w} ${h}`, width: '100%', role: 'img',
      'aria-label': label || 'grafico', preserveAspectRatio: 'none',
    });
    svg.style.display = 'block';
    el.appendChild(svg);
    return svg;
  }
  function glowFilter(svg, color) {
    const id = 'ris-glow-' + (++UID);
    const f = svgEl('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' });
    f.appendChild(svgEl('feDropShadow', { dx: 0, dy: 0, stdDeviation: 2.2, 'flood-color': color, 'flood-opacity': 0.55 }));
    svg.appendChild(f);
    return `url(#${id})`;
  }
  function grid(svg, w, h, nx, ny) {
    const g = svgEl('g', { stroke: 'var(--ris-line-faint)', 'stroke-width': 1 });
    for (let i = 1; i < nx; i++) g.appendChild(svgEl('line', { x1: (w / nx) * i, y1: 0, x2: (w / nx) * i, y2: h }));
    for (let i = 1; i < ny; i++) g.appendChild(svgEl('line', { x1: 0, y1: (h / ny) * i, x2: w, y2: (h / ny) * i }));
    svg.appendChild(g);
  }
  function scale(points, w, h, pad) {
    const min = Math.min(...points), max = Math.max(...points);
    const span = (max - min) || 1;
    return points.map((v, i) => [
      pad + (i / (points.length - 1)) * (w - 2 * pad),
      h - pad - ((v - min) / span) * (h - 2 * pad),
    ]);
  }

  function line(el, points, opts = {}) {
    const w = opts.width || 320, h = opts.height || 120, pad = 6;
    const color = opts.color || 'var(--ris-accent-2)';
    const svg = base(el, w, h, opts.label);
    grid(svg, w, h, opts.gridX || 6, opts.gridY || 4);
    const xy = scale(points, w, h, pad);
    const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    if (opts.area !== false) {
      const area = `${d} L ${xy[xy.length - 1][0].toFixed(1)} ${h - pad} L ${xy[0][0].toFixed(1)} ${h - pad} Z`;
      svg.appendChild(svgEl('path', { d: area, fill: color, opacity: 0.10 }));
    }
    const path = svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.75, filter: glowFilter(svg, color) });
    svg.appendChild(path);
    if (!REDUCED.matches && opts.animate !== false) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    }
    const last = xy[xy.length - 1];
    svg.appendChild(svgEl('rect', { x: last[0] - 2.5, y: last[1] - 2.5, width: 5, height: 5, fill: color }));
    return svg;
  }

  function bars(el, values, opts = {}) {
    const w = opts.width || 320, h = opts.height || 120, pad = 6, gap = opts.gap ?? 4;
    const color = opts.color || 'var(--ris-accent)';
    const svg = base(el, w, h, opts.label);
    grid(svg, w, h, 1, opts.gridY || 4);
    const max = Math.max(...values) || 1;
    const bw = (w - 2 * pad - gap * (values.length - 1)) / values.length;
    values.forEach((v, i) => {
      const bh = Math.max(2, (v / max) * (h - 2 * pad));
      const r = svgEl('rect', {
        x: pad + i * (bw + gap), y: h - pad - bh, width: bw, height: bh,
        fill: color, opacity: opts.highlight === i ? 1 : 0.55,
      });
      if (!REDUCED.matches && opts.animate !== false) {
        r.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
          { duration: 420, delay: i * 35, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        r.style.transformOrigin = `0 ${h - pad}px`;
      }
      svg.appendChild(r);
    });
    return svg;
  }

  function spark(el, points, opts = {}) {
    return line(el, points, { width: 96, height: 28, gridX: 0, gridY: 0, area: false, animate: false, ...opts });
  }

  function gauge(el, value, opts = {}) {
    const w = opts.width || 120, h = opts.height || 64, segs = opts.segments || 16;
    const color = opts.color || 'var(--ris-accent)';
    const svg = base(el, w, h, opts.label);
    const on = Math.round(value * segs);
    const sw = (w - (segs - 1) * 2) / segs;
    for (let i = 0; i < segs; i++) {
      svg.appendChild(svgEl('rect', {
        x: i * (sw + 2), y: h * 0.35, width: sw, height: h * 0.3,
        fill: i < on ? color : 'var(--ris-surface-3)',
      }));
    }
    const t = svgEl('text', {
      x: 0, y: h * 0.22, fill: 'var(--ris-fg3)',
      'font-family': 'var(--ris-font-mono)', 'font-size': 9, 'letter-spacing': '0.08em',
    });
    t.textContent = (opts.caption || '') + ' ' + Math.round(value * 100) + '%';
    svg.appendChild(t);
    return svg;
  }

  function wave(el, opts = {}) {
    const w = opts.width || 320, h = opts.height || 80;
    const color = opts.color || 'var(--ris-cyan)';
    const svg = base(el, w, h, opts.label || 'waveform');
    grid(svg, w, h, 8, 2);
    const path = svgEl('path', { fill: 'none', stroke: color, 'stroke-width': 1.5, filter: glowFilter(svg, color) });
    svg.appendChild(path);
    const f1 = opts.freq || 0.09, amp = (opts.amp || 0.32) * h;
    let t = 0, raf;
    function frame() {
      let d = '';
      for (let x = 0; x <= w; x += 3) {
        const y = h / 2
          + Math.sin(x * f1 + t) * amp * 0.6
          + Math.sin(x * f1 * 2.7 + t * 1.6) * amp * 0.25
          + Math.sin(x * f1 * 6.1 + t * 2.3) * amp * 0.12;
        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
      }
      path.setAttribute('d', d);
      t += 0.06;
      raf = requestAnimationFrame(frame);
    }
    if (REDUCED.matches || opts.animate === false) { t = 2.4; frame(); cancelAnimationFrame(raf); }
    else frame();
    new MutationObserver((_, obs) => {
      if (!document.contains(svg)) { cancelAnimationFrame(raf); obs.disconnect(); }
    }).observe(document.body, { childList: true, subtree: true });
    return svg;
  }

  function intraday(el, points, opts = {}) {
    // points: [{t: epochMs, v: number}, …] (ordinati per tempo).
    // opts.baseline: {median, lo, hi} → banda di riferimento.
    // opts.peakThreshold: valore oltre il quale un punto è "picco" (marker).
    const w = opts.width || 360, h = opts.height || 132;
    const padX = 6, padTop = 12, padBot = 16;
    const color = opts.color || 'var(--ris-accent-2)';
    const svg = base(el, w, h, opts.label || 'andamento intraday');
    if (!points || points.length < 2) return svg;

    const t0 = points[0].t, t1 = points[points.length - 1].t;
    const tSpan = (t1 - t0) || 1;
    const bl = opts.baseline;
    let vMin = Math.min(...points.map(p => p.v));
    let vMax = Math.max(...points.map(p => p.v));
    if (bl) { vMin = Math.min(vMin, bl.lo); vMax = Math.max(vMax, bl.hi); }
    const vSpan = (vMax - vMin) || 1;
    const X = t => padX + ((t - t0) / tSpan) * (w - 2 * padX);
    const Y = v => padTop + (1 - (v - vMin) / vSpan) * (h - padTop - padBot);

    grid(svg, w, h, 0, 4);

    // Banda baseline (mediana ± banda) + mediana tratteggiata.
    if (bl) {
      const top = Y(bl.hi), bot = Y(bl.lo);
      svg.appendChild(svgEl('rect', { x: padX, y: top, width: w - 2 * padX, height: Math.max(1, bot - top), fill: color, opacity: 0.08 }));
      svg.appendChild(svgEl('line', { x1: padX, y1: Y(bl.median), x2: w - padX, y2: Y(bl.median), stroke: color, 'stroke-width': 1, opacity: 0.5, 'stroke-dasharray': '4 4' }));
    }

    // Tick orari (mezzanotte locale ogni ~ora multipla) con label mono.
    const stepH = opts.hourStep || 3;
    const d0 = new Date(t0);
    let tick = new Date(d0); tick.setMinutes(0, 0, 0);
    if (tick.getTime() < t0) tick.setHours(tick.getHours() + 1);
    while (tick.getTime() <= t1) {
      if (tick.getHours() % stepH === 0) {
        const x = X(tick.getTime());
        svg.appendChild(svgEl('line', { x1: x, y1: padTop, x2: x, y2: h - padBot, stroke: 'var(--ris-line-faint)', 'stroke-width': 1 }));
        const lbl = svgEl('text', { x: x + 2, y: h - 5, fill: 'var(--ris-fg-meta)', 'font-family': 'var(--ris-font-mono)', 'font-size': 8, 'letter-spacing': '0.04em' });
        lbl.textContent = String(tick.getHours()).padStart(2, '0');
        svg.appendChild(lbl);
      }
      tick.setHours(tick.getHours() + 1);
    }

    // Area + linea andamento.
    const d = points.map((p, i) => (i ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
    svg.appendChild(svgEl('path', { d: `${d} L ${X(t1).toFixed(1)} ${h - padBot} L ${X(t0).toFixed(1)} ${h - padBot} Z`, fill: color, opacity: 0.10 }));
    const path = svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.75, filter: glowFilter(svg, color) });
    svg.appendChild(path);
    if (!REDUCED.matches && opts.animate !== false) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    }

    // Marcatori picco: quadrato pieno sui punti oltre soglia (o oltre banda hi).
    const thr = opts.peakThreshold ?? (bl ? bl.hi : vMax);
    points.forEach(p => {
      if (p.v >= thr) svg.appendChild(svgEl('rect', { x: X(p.t) - 2.5, y: Y(p.v) - 2.5, width: 5, height: 5, fill: 'var(--ris-red)' }));
    });
    return svg;
  }

  function eegWaveform(el, channels, opts = {}) {
    // channels: [[v,…], …] — una serie per canale (µV grezzi o normalizzati).
    // Multi-traccia, una riga per canale, DC rimosso e scalato per traccia.
    // Per l'EEG live (es. Muse TP9/AF7/AF8/TP10).
    const w = opts.width || 360, h = opts.height || 160;
    const colors = opts.colors || ['var(--ris-cyan)', 'var(--ris-amber)', 'var(--ris-green)', 'var(--ris-violet)'];
    const rows = channels.length || 1;
    const svg = base(el, w, h, opts.label || 'eeg waveform');
    grid(svg, w, h, 0, rows);
    const rowH = h / rows;
    channels.forEach((series, ci) => {
      if (!series || series.length < 2) return;
      const color = colors[ci % colors.length];
      const baseY = rowH * ci + rowH / 2;
      const amp = rowH * 0.4;
      const mean = series.reduce((a, b) => a + b, 0) / series.length;
      let maxAbs = 0;
      for (const v of series) maxAbs = Math.max(maxAbs, Math.abs(v - mean));
      maxAbs = maxAbs || 1;
      const n = series.length;
      let d = '';
      series.forEach((v, i) => {
        const x = (i / (n - 1)) * w;
        const y = baseY - ((v - mean) / maxAbs) * amp;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      svg.appendChild(svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.25, filter: glowFilter(svg, color) }));
    });
    return svg;
  }

  function bands(el, data, opts = {}) {
    // data: [{name:'ALPHA', value:0..1, color?}, …]
    const w = opts.width || 320, rowH = 22, pad = 64;
    const svg = base(el, w, data.length * rowH, opts.label || 'bande');
    data.forEach((b, i) => {
      const y = i * rowH;
      const t = svgEl('text', {
        x: 0, y: y + rowH * 0.62, fill: 'var(--ris-fg3)',
        'font-family': 'var(--ris-font-mono)', 'font-size': 9, 'letter-spacing': '0.1em',
      });
      t.textContent = b.name.toUpperCase();
      svg.appendChild(t);
      svg.appendChild(svgEl('rect', { x: pad, y: y + rowH * 0.3, width: w - pad, height: 7, fill: 'var(--ris-void)', stroke: 'var(--ris-line)', 'stroke-width': 1 }));
      const fill = svgEl('rect', { x: pad, y: y + rowH * 0.3, width: Math.max(2, (w - pad) * b.value), height: 7, fill: b.color || 'var(--ris-accent-2)' });
      if (!REDUCED.matches) fill.animate([{ width: 0 }, { width: fill.getAttribute('width') }], { duration: 500, delay: i * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      svg.appendChild(fill);
    });
    return svg;
  }

  global.RisCharts = { line, bars, spark, gauge, wave, bands, intraday, eegWaveform };
})(window);
