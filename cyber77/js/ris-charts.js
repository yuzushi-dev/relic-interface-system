/* ============================================================================
   RELIC INTERFACE SYSTEM v2 — ris-charts.js
   Dependency-free SVG charts in RIS style: hard grid, neon stroke + glow,
   square markers, mono labels, interactive HUD telemetry & tactical scrubbers.
   Mirrors compose/Charts.kt.

   API (every fn returns the created <svg>):
     RisCharts.line(el, points, opts)    — time series w/ area glow & tactical scrubber
     RisCharts.bars(el, values, opts)    — bar chart w/ column overdrive & HUD callout
     RisCharts.spark(el, points, opts)   — inline sparkline (compact, non-interactive)
     RisCharts.gauge(el, value, opts)    — square HUD gauge (0..1) w/ breathing active seg
     RisCharts.wave(el, opts)            — animated EEG-style waveform
     RisCharts.bands(el, bands, opts)    — horizontal band meter (EEG bands)
     RisCharts.intraday(el, points, opts)— time-of-day trend w/ baseline band, peak markers & scrubber
     RisCharts.replay(svgOrContainer)    — replays entrance animations on-demand

   opts.color: any CSS color (default var(--ris-accent-2)).
   opts.unit: optional string unit (e.g. ' bpm', ' steps', ' µV') appended to real telemetry.
   opts.categories: optional array of strings for point/bar labels.
   opts.interactive: boolean (default true for line, intraday, bars, gauge).
   opts.ambientSweep: boolean (default true; subtle phosphor micro-sweep across grid).
   opts.animate: boolean (default true; plays entry animation when scrolled into viewport).

   Strict Directive: ALL scrubber telemetry maps 1:1 to real data (no dummy lore).
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
      'aria-label': label || 'chart', preserveAspectRatio: 'none',
    });
    svg.style.display = 'block';
    svg.style.overflow = 'hidden';
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

  function getSvgPoint(svg, ev, w, h) {
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const inv = ctm.inverse();
      const p = pt.matrixTransform(inv);
      return { x: p.x, y: p.y };
    }
    const rect = svg.getBoundingClientRect();
    return {
      x: rect.width ? ((ev.clientX - rect.left) / rect.width) * w : 0,
      y: rect.height ? ((ev.clientY - rect.top) / rect.height) * h : 0,
    };
  }

  function runWhenVisible(el, callback) {
    if (REDUCED.matches) return;
    if (typeof IntersectionObserver === 'undefined') {
      callback();
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
          obs.disconnect();
        }
      });
    }, { threshold: 0.15, rootMargin: '40px' });
    observer.observe(el);
  }

  function ambientSweep(svg, w, h) {
    if (REDUCED.matches) return;
    const gradId = 'ris-sweep-grad-' + (++UID);
    const defs = svgEl('defs');
    const grad = svgEl('linearGradient', { id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
    grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': 'var(--ris-cyan)', 'stop-opacity': '0' }));
    grad.appendChild(svgEl('stop', { offset: '75%', 'stop-color': 'var(--ris-cyan)', 'stop-opacity': '0.35' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': 'var(--ris-cyan)', 'stop-opacity': '0.95' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    const sweep = svgEl('g', { class: 'ris-chart-ambient-sweep' });
    sweep.appendChild(svgEl('rect', { x: -40, y: 0, width: 40, height: h, fill: `url(#${gradId})` }));
    sweep.appendChild(svgEl('line', { x1: 0, y1: 0, x2: 0, y2: h, stroke: 'var(--ris-cyan)', 'stroke-width': 1.5, opacity: '0.9' }));

    // Native SVG animation: 100% cross-browser, moves across the entire width of the SVG viewBox!
    const animX = svgEl('animateTransform', {
      attributeName: 'transform',
      type: 'translate',
      from: `-40 0`,
      to: `${w + 40} 0`,
      dur: '4.5s',
      repeatCount: 'indefinite'
    });
    const animOp = svgEl('animate', {
      attributeName: 'opacity',
      values: '0; 0.28; 0.28; 0',
      keyTimes: '0; 0.08; 0.92; 1',
      dur: '4.5s',
      repeatCount: 'indefinite'
    });
    sweep.appendChild(animX);
    sweep.appendChild(animOp);
    svg.appendChild(sweep);
  }

  function createScrubberOverlay(svg, w, h, color) {
    const g = svgEl('g', { class: 'ris-scrubber-group', style: 'display: none;' });

    const line = svgEl('line', {
      class: 'ris-scrubber-line',
      x1: 0, y1: 0, x2: 0, y2: h,
      stroke: color || 'var(--ris-cyan)',
      'stroke-width': 1,
      'stroke-dasharray': '2 2'
    });
    g.appendChild(line);

    const reticle = svgEl('rect', {
      class: 'ris-scrubber-reticle',
      x: -3.5, y: -3.5, width: 7, height: 7,
      stroke: color || 'var(--ris-cyan)',
      'stroke-width': 1.5,
      fill: 'none'
    });
    g.appendChild(reticle);

    const badge = svgEl('g', { class: 'ris-scrubber-badge' });
    const bg = svgEl('rect', {
      class: 'ris-scrubber-badge-bg',
      x: 0, y: 0, width: 84, height: 26, rx: 2
    });
    const t1 = svgEl('text', {
      class: 'ris-scrubber-text-main',
      x: 6, y: 11
    });
    const t2 = svgEl('text', {
      class: 'ris-scrubber-text-sub',
      x: 6, y: 21
    });
    const t3 = svgEl('text', {
      class: 'ris-scrubber-text-alert',
      x: 6, y: 31,
      style: 'display: none;'
    });

    badge.appendChild(bg);
    badge.appendChild(t1);
    badge.appendChild(t2);
    badge.appendChild(t3);
    g.appendChild(badge);
    svg.appendChild(g);

    return {
      group: g,
      line,
      reticle,
      badge,
      show() {
        g.style.display = '';
        svg.classList.add('is-scrubbing');
      },
      hide() {
        g.style.display = 'none';
        svg.classList.remove('is-scrubbing');
      },
      update(x, y, line1, line2, alertText) {
        line.setAttribute('x1', x.toFixed(1));
        line.setAttribute('x2', x.toFixed(1));

        reticle.setAttribute('x', (x - 3.5).toFixed(1));
        reticle.setAttribute('y', (y - 3.5).toFixed(1));

        t1.textContent = line1 || '';
        t2.textContent = line2 || '';

        let badgeH = 26;
        if (alertText) {
          t3.textContent = alertText;
          t3.style.display = '';
          badgeH = 36;
        } else {
          t3.style.display = 'none';
        }

        const maxChars = Math.max(
          (line1 || '').length,
          (line2 || '').length,
          (alertText || '').length
        );
        const badgeW = Math.max(78, maxChars * 6.0 + 12);
        bg.setAttribute('width', badgeW.toFixed(1));
        bg.setAttribute('height', badgeH.toFixed(1));

        let bx = x + 8;
        if (bx + badgeW > w - 4) bx = x - badgeW - 8;
        if (bx < 4) bx = 4;

        let by = y - badgeH - 6;
        if (by < 4) by = y + 8;
        if (by + badgeH > h - 4) by = h - badgeH - 4;

        badge.setAttribute('transform', `translate(${bx.toFixed(1)}, ${by.toFixed(1)})`);
      }
    };
  }

  function line(el, points, opts = {}) {
    const w = opts.width || 320, h = opts.height || 120, pad = 6;
    const color = opts.color || 'var(--ris-accent-2)';
    const svg = base(el, w, h, opts.label);
    grid(svg, w, h, opts.gridX || 6, opts.gridY || 4);
    if (opts.ambientSweep !== false && opts.area !== false) ambientSweep(svg, w, h);

    const xy = scale(points, w, h, pad);
    const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    if (opts.area !== false) {
      const area = `${d} L ${xy[xy.length - 1][0].toFixed(1)} ${h - pad} L ${xy[0][0].toFixed(1)} ${h - pad} Z`;
      svg.appendChild(svgEl('path', { d: area, fill: color, opacity: 0.10 }));
    }
    const path = svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.75, filter: glowFilter(svg, color) });
    svg.appendChild(path);

    function playLineEntry() {
      if (REDUCED.matches || opts.animate === false) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: 750,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'forwards'
      });
    }

    runWhenVisible(svg, playLineEntry);
    svg._risReplay = playLineEntry;

    const last = xy[xy.length - 1];
    svg.appendChild(svgEl('rect', { x: last[0] - 2.5, y: last[1] - 2.5, width: 5, height: 5, fill: color }));

    if (opts.interactive !== false && points.length > 1) {
      svg.classList.add('ris-chart-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'region');
      svg.setAttribute('aria-label', `${opts.label || 'line chart'}, use left and right arrow keys to inspect data points`);

      const scrubber = createScrubberOverlay(svg, w, h, color);
      let activeIdx = -1;

      function renderPoint(idx) {
        if (idx < 0 || idx >= points.length) return;
        activeIdx = idx;
        const [px, py] = xy[idx];
        const val = points[idx];
        const unit = opts.unit || '';
        const formattedVal = opts.format ? opts.format(val) : `${val}${unit}`;
        const line1 = (opts.categories && opts.categories[idx]) ? opts.categories[idx] : `PT: ${String(idx + 1).padStart(2, '0')}/${points.length}`;
        const line2 = `VAL: ${formattedVal}`;
        scrubber.update(px, py, line1, line2, null);
        scrubber.show();
        svg.setAttribute('aria-valuenow', String(val));
        svg.setAttribute('aria-valuetext', `${line1}: ${formattedVal}`);
      }

      function findClosest(svgX) {
        let bestDist = Infinity, bestIdx = 0;
        for (let i = 0; i < xy.length; i++) {
          const dist = Math.abs(xy[i][0] - svgX);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        return bestIdx;
      }

      svg.addEventListener('pointerenter', ev => {
        const pt = getSvgPoint(svg, ev, w, h);
        renderPoint(findClosest(pt.x));
      });

      svg.addEventListener('pointermove', ev => {
        const pt = getSvgPoint(svg, ev, w, h);
        renderPoint(findClosest(pt.x));
      });

      svg.addEventListener('pointerleave', () => {
        if (document.activeElement !== svg) {
          scrubber.hide();
          activeIdx = -1;
        }
      });

      svg.addEventListener('keydown', ev => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          const next = activeIdx < 0 ? 0 : Math.min(points.length - 1, activeIdx + 1);
          renderPoint(next);
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          const prev = activeIdx < 0 ? points.length - 1 : Math.max(0, activeIdx - 1);
          renderPoint(prev);
        } else if (ev.key === 'Home') {
          ev.preventDefault();
          renderPoint(0);
        } else if (ev.key === 'End') {
          ev.preventDefault();
          renderPoint(points.length - 1);
        } else if (ev.key === 'Escape') {
          scrubber.hide();
          activeIdx = -1;
        }
      });

      svg.addEventListener('blur', () => {
        scrubber.hide();
        activeIdx = -1;
      });
    }

    return svg;
  }

  function bars(el, values, opts = {}) {
    const w = opts.width || 320, h = opts.height || 120, pad = 6, gap = opts.gap ?? 4;
    const color = opts.color || 'var(--ris-accent)';
    const svg = base(el, w, h, opts.label);
    grid(svg, w, h, 1, opts.gridY || 4);
    if (opts.ambientSweep !== false) ambientSweep(svg, w, h);

    const max = Math.max(...values) || 1;
    const bw = (w - 2 * pad - gap * (values.length - 1)) / values.length;
    const rects = [];

    values.forEach((v, i) => {
      const bh = Math.max(2, (v / max) * (h - 2 * pad));
      const r = svgEl('rect', {
        x: pad + i * (bw + gap), y: h - pad - bh, width: bw, height: bh,
        fill: color, opacity: opts.highlight === i ? 1 : 0.55,
        class: 'ris-bar-col', 'data-index': String(i),
      });
      r.style.transformOrigin = `0 ${h - pad}px`;
      svg.appendChild(r);
      rects.push(r);
    });

    function playBarsEntry() {
      if (REDUCED.matches || opts.animate === false) return;
      rects.forEach((r, i) => {
        r.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
          duration: 450,
          delay: i * 35,
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'backwards'
        });
      });
    }

    runWhenVisible(svg, playBarsEntry);
    svg._risReplay = playBarsEntry;

    if (opts.interactive !== false && values.length > 0) {
      svg.classList.add('ris-chart-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'region');
      svg.setAttribute('aria-label', `${opts.label || 'bar chart'}, use arrow keys to inspect columns`);

      const badge = svgEl('g', { class: 'ris-scrubber-badge', style: 'display: none; pointer-events: none;' });
      const bg = svgEl('rect', { class: 'ris-scrubber-badge-bg', x: 0, y: 0, width: 80, height: 26, rx: 2 });
      const t1 = svgEl('text', { class: 'ris-scrubber-text-main', x: 6, y: 11 });
      const t2 = svgEl('text', { class: 'ris-scrubber-text-sub', x: 6, y: 21 });
      const t3 = svgEl('text', { class: 'ris-scrubber-text-alert', x: 6, y: 31, style: 'display: none;' });
      badge.appendChild(bg); badge.appendChild(t1); badge.appendChild(t2); badge.appendChild(t3);
      svg.appendChild(badge);

      let activeIdx = -1;

      function highlightBar(idx) {
        if (idx < 0 || idx >= values.length) return;
        activeIdx = idx;
        svg.classList.add('has-active-bar', 'is-scrubbing');
        rects.forEach((r, i) => {
          if (i === idx) r.classList.add('is-active');
          else r.classList.remove('is-active');
        });

        const v = values[idx];
        const valStr = (opts.format ? opts.format(v) : (v.toLocaleString ? v.toLocaleString('it-IT') : String(v))) + (opts.unit || '');
        const catStr = (opts.categories && opts.categories[idx]) ? opts.categories[idx] : `BAR #${String(idx + 1).padStart(2, '0')}`;
        const isMax = v === max;

        t1.textContent = catStr;
        t2.textContent = `VAL: ${valStr}`;
        let badgeH = 26;
        if (isMax) {
          t3.textContent = '[MAX PEAK]';
          t3.style.display = '';
          badgeH = 36;
        } else {
          t3.style.display = 'none';
        }

        const maxChars = Math.max(catStr.length, (`VAL: ${valStr}`).length, isMax ? 11 : 0);
        const badgeW = Math.max(78, maxChars * 6.0 + 12);
        bg.setAttribute('width', badgeW.toFixed(1));
        bg.setAttribute('height', badgeH.toFixed(1));

        const barX = pad + idx * (bw + gap);
        const barTop = h - pad - Math.max(2, (v / max) * (h - 2 * pad));
        let bx = barX + bw / 2 - badgeW / 2;
        if (bx < 4) bx = 4;
        if (bx + badgeW > w - 4) bx = w - badgeW - 4;

        let by = barTop - badgeH - 4;
        if (by < 4) by = barTop + 4;
        if (by + badgeH > h - 4) by = h - badgeH - 4;

        badge.setAttribute('transform', `translate(${bx.toFixed(1)}, ${by.toFixed(1)})`);
        badge.style.display = '';

        svg.setAttribute('aria-valuenow', String(v));
        svg.setAttribute('aria-valuetext', `${catStr}: ${valStr}`);
      }

      function clearHighlight() {
        activeIdx = -1;
        svg.classList.remove('has-active-bar', 'is-scrubbing');
        rects.forEach(r => r.classList.remove('is-active'));
        badge.style.display = 'none';
      }

      rects.forEach((r, i) => {
        r.addEventListener('pointerenter', () => highlightBar(i));
      });

      svg.addEventListener('pointermove', ev => {
        const pt = getSvgPoint(svg, ev, w, h);
        for (let i = 0; i < rects.length; i++) {
          const rx = pad + i * (bw + gap);
          if (pt.x >= rx && pt.x <= rx + bw + gap) {
            highlightBar(i);
            return;
          }
        }
      });

      svg.addEventListener('pointerleave', () => {
        if (document.activeElement !== svg) clearHighlight();
      });

      svg.addEventListener('keydown', ev => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          const next = activeIdx < 0 ? 0 : Math.min(values.length - 1, activeIdx + 1);
          highlightBar(next);
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          const prev = activeIdx < 0 ? values.length - 1 : Math.max(0, activeIdx - 1);
          highlightBar(prev);
        } else if (ev.key === 'Home') {
          ev.preventDefault();
          highlightBar(0);
        } else if (ev.key === 'End') {
          ev.preventDefault();
          highlightBar(values.length - 1);
        } else if (ev.key === 'Escape') {
          clearHighlight();
        }
      });

      svg.addEventListener('blur', clearHighlight);
    }

    return svg;
  }

  function spark(el, points, opts = {}) {
    return line(el, points, { width: 96, height: 28, gridX: 0, gridY: 0, area: false, animate: false, interactive: false, ambientSweep: false, ...opts });
  }

  function gauge(el, value, opts = {}) {
    const w = opts.width || 120, h = opts.height || 64, segs = opts.segments || 16;
    const color = opts.color || 'var(--ris-accent)';
    const svg = base(el, w, h, opts.label);
    const on = Math.round(value * segs);
    const sw = (w - (segs - 1) * 2) / segs;
    const segRects = [];

    for (let i = 0; i < segs; i++) {
      const isLastLit = (i === on - 1 && !REDUCED.matches);
      const seg = svgEl('rect', {
        x: i * (sw + 2), y: h * 0.35, width: sw, height: h * 0.3,
        fill: i < on ? color : 'var(--ris-surface-3)',
        class: isLastLit ? 'ris-gauge-breathing' : '',
      });
      if (isLastLit) {
        const anim = svgEl('animate', {
          attributeName: 'opacity',
          values: '1; 0.55; 1',
          dur: '2s',
          repeatCount: 'indefinite'
        });
        seg.appendChild(anim);
      }
      svg.appendChild(seg);
      segRects.push(seg);
    }

    const t = svgEl('text', {
      x: 0, y: h * 0.22, fill: 'var(--ris-fg3)',
      'font-family': 'var(--ris-font-mono)', 'font-size': 9, 'letter-spacing': '0.08em',
    });
    const defaultLabel = (opts.caption || '') + ' ' + Math.round(value * 100) + '%';
    t.textContent = defaultLabel;
    svg.appendChild(t);

    function playGaugeEntry() {
      if (REDUCED.matches || opts.animate === false) return;
      segRects.forEach((r, i) => {
        if (i < on) {
          r.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 260,
            delay: i * 20,
            easing: 'ease-out',
            fill: 'backwards'
          });
        }
      });
    }

    runWhenVisible(svg, playGaugeEntry);
    svg._risReplay = playGaugeEntry;

    if (opts.interactive !== false) {
      svg.classList.add('ris-chart-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'meter');
      svg.setAttribute('aria-valuenow', String(Math.round(value * 100)));
      svg.setAttribute('aria-valuemin', '0');
      svg.setAttribute('aria-valuemax', '100');

      svg.addEventListener('pointerenter', () => {
        t.textContent = (opts.caption || '') + ' ' + (value * 100).toFixed(1) + `% (${on}/${segs})`;
        t.setAttribute('fill', color);
      });
      svg.addEventListener('pointerleave', () => {
        t.textContent = defaultLabel;
        t.setAttribute('fill', 'var(--ris-fg3)');
      });
    }

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
    const w = opts.width || 360, h = opts.height || 132;
    const padX = 6, padTop = 12, padBot = 16;
    const color = opts.color || 'var(--ris-accent-2)';
    const svg = base(el, w, h, opts.label || 'intraday trend');
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
    if (opts.ambientSweep !== false) ambientSweep(svg, w, h);

    // Baseline band (median ± band) + dashed median.
    if (bl) {
      const top = Y(bl.hi), bot = Y(bl.lo);
      svg.appendChild(svgEl('rect', { x: padX, y: top, width: w - 2 * padX, height: Math.max(1, bot - top), fill: color, opacity: 0.08 }));
      svg.appendChild(svgEl('line', { x1: padX, y1: Y(bl.median), x2: w - padX, y2: Y(bl.median), stroke: color, 'stroke-width': 1, opacity: 0.5, 'stroke-dasharray': '4 4' }));
    }

    // Hourly ticks (local time step) with mono label.
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

    // Area + trend line.
    const d = points.map((p, i) => (i ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
    svg.appendChild(svgEl('path', { d: `${d} L ${X(t1).toFixed(1)} ${h - padBot} L ${X(t0).toFixed(1)} ${h - padBot} Z`, fill: color, opacity: 0.10 }));
    const path = svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.75, filter: glowFilter(svg, color) });
    svg.appendChild(path);

    function playIntradayEntry() {
      if (REDUCED.matches || opts.animate === false) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: 750,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'forwards'
      });
    }

    runWhenVisible(svg, playIntradayEntry);
    svg._risReplay = playIntradayEntry;

    // Peak markers: solid square on points exceeding threshold with micro-pulse
    const thr = opts.peakThreshold ?? (bl ? bl.hi : vMax);
    points.forEach(p => {
      if (p.v >= thr) {
        const peakRect = svgEl('rect', {
          x: X(p.t) - 2.5, y: Y(p.v) - 2.5, width: 5, height: 5,
          fill: 'var(--ris-red)', class: 'ris-peak-pulse',
        });
        if (!REDUCED.matches) {
          const anim = svgEl('animate', {
            attributeName: 'opacity',
            values: '1; 0.35; 1',
            dur: '1.4s',
            repeatCount: 'indefinite'
          });
          peakRect.appendChild(anim);
        }
        svg.appendChild(peakRect);
      }
    });

    if (opts.interactive !== false && points.length > 1) {
      svg.classList.add('ris-chart-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'region');
      svg.setAttribute('aria-label', `${opts.label || 'intraday trend'}, use arrow keys to inspect timestamps and values`);

      const scrubber = createScrubberOverlay(svg, w, h, color);
      let activeIdx = -1;

      function renderPoint(idx) {
        if (idx < 0 || idx >= points.length) return;
        activeIdx = idx;
        const p = points[idx];
        const px = X(p.t);
        const py = Y(p.v);

        const d = new Date(p.t);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const timeStr = `TIME: ${hh}:${mm}`;

        let valStr = `VAL: ${p.v}${opts.unit || ''}`;
        if (bl) {
          const delta = p.v - bl.median;
          const deltaStr = (delta > 0 ? `+${delta}` : String(delta));
          valStr += ` (Δ ${deltaStr})`;
        }

        const isPeak = p.v >= thr;
        const alertText = isPeak ? 'PEAK ALERT' : null;

        scrubber.update(px, py, timeStr, valStr, alertText);
        scrubber.show();
        svg.setAttribute('aria-valuenow', String(p.v));
        svg.setAttribute('aria-valuetext', `${timeStr}, ${valStr}${isPeak ? ', peak' : ''}`);
      }

      function findClosest(svgX) {
        let bestDist = Infinity, bestIdx = 0;
        for (let i = 0; i < points.length; i++) {
          const dist = Math.abs(X(points[i].t) - svgX);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        return bestIdx;
      }

      svg.addEventListener('pointerenter', ev => {
        const pt = getSvgPoint(svg, ev, w, h);
        renderPoint(findClosest(pt.x));
      });

      svg.addEventListener('pointermove', ev => {
        const pt = getSvgPoint(svg, ev, w, h);
        renderPoint(findClosest(pt.x));
      });

      svg.addEventListener('pointerleave', () => {
        if (document.activeElement !== svg) {
          scrubber.hide();
          activeIdx = -1;
        }
      });

      svg.addEventListener('keydown', ev => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          const next = activeIdx < 0 ? 0 : Math.min(points.length - 1, activeIdx + 1);
          renderPoint(next);
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          const prev = activeIdx < 0 ? points.length - 1 : Math.max(0, activeIdx - 1);
          renderPoint(prev);
        } else if (ev.key === 'Home') {
          ev.preventDefault();
          renderPoint(0);
        } else if (ev.key === 'End') {
          ev.preventDefault();
          renderPoint(points.length - 1);
        } else if (ev.key === 'Escape') {
          scrubber.hide();
          activeIdx = -1;
        }
      });

      svg.addEventListener('blur', () => {
        scrubber.hide();
        activeIdx = -1;
      });
    }

    return svg;
  }

  function eegWaveform(el, channels, opts = {}) {
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
    const w = opts.width || 320, rowH = 22, pad = 64;
    const svg = base(el, w, data.length * rowH, opts.label || 'bands');
    const fillRects = [];
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
      svg.appendChild(fill);
      fillRects.push({ el: fill, targetWidth: fill.getAttribute('width') });
    });

    function playBandsEntry() {
      if (REDUCED.matches || opts.animate === false) return;
      fillRects.forEach((item, i) => {
        item.el.animate([{ width: 0 }, { width: item.targetWidth }], {
          duration: 500,
          delay: i * 60,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          fill: 'backwards'
        });
      });
    }

    runWhenVisible(svg, playBandsEntry);
    svg._risReplay = playBandsEntry;

    return svg;
  }

  function replay(target) {
    if (!target) return;
    const svgs = target.nodeName === 'svg' ? [target] : (target.querySelectorAll ? target.querySelectorAll('svg') : []);
    svgs.forEach(s => {
      if (typeof s._risReplay === 'function') s._risReplay();
    });
  }

  global.RisCharts = { line, bars, spark, gauge, wave, bands, intraday, eegWaveform, replay };
})(window);
