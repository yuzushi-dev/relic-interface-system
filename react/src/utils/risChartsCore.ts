/**
 * Tactical Cyber RIS SVG Charts Core Engine.
 * Self-contained, dependency-free SVG chart generator adhering to RIS v2 aesthetic:
 * hard grid, neon stroke + glow, square markers, monospace tabular labels,
 * ambient phosphor micro-sweep, and interactive tactile scrubbers.
 */

const NS = 'http://www.w3.org/2000/svg';
let UID = 0;

export interface ScrubPoint {
  index: number;
  value: number;
  category?: string;
  formattedValue?: string;
  x: number;
  y: number;
}

export interface BaseChartOptions {
  width?: number;
  height?: number;
  color?: string;
  unit?: string;
  categories?: string[];
  interactive?: boolean;
  ambientSweep?: boolean;
  animate?: boolean;
  label?: string;
  format?: (val: number) => string;
}

export interface LineChartOptions extends BaseChartOptions {
  area?: boolean;
  gridX?: number;
  gridY?: number;
  onScrub?: (point: ScrubPoint | null) => void;
}

export interface BarChartOptions extends BaseChartOptions {
  gap?: number;
  highlight?: number;
  onScrub?: (point: ScrubPoint | null) => void;
}

export interface GaugeChartOptions extends BaseChartOptions {
  segments?: number;
  caption?: string;
  onScrub?: (value: number | null) => void;
}

export interface EegWaveformOptions extends BaseChartOptions {
  colors?: string[];
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, any>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) {
    if (attrs[k] !== undefined && attrs[k] !== null) {
      el.setAttribute(k, String(attrs[k]));
    }
  }
  return el;
}

function base(el: HTMLElement, w: number, h: number, label?: string): SVGSVGElement {
  const svg = svgEl('svg', {
    viewBox: `0 0 ${w} ${h}`,
    width: '100%',
    role: 'img',
    'aria-label': label || 'tactical telemetry chart',
    preserveAspectRatio: 'none',
  });
  svg.style.display = 'block';
  svg.style.overflow = 'hidden';
  el.appendChild(svg);
  return svg;
}

function glowFilter(svg: SVGSVGElement, color: string): string {
  const id = `ris-glow-${++UID}`;
  const f = svgEl('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' });
  f.appendChild(
    svgEl('feDropShadow', {
      dx: 0,
      dy: 0,
      stdDeviation: 2.2,
      'flood-color': color,
      'flood-opacity': 0.55,
    })
  );
  svg.appendChild(f);
  return `url(#${id})`;
}

function grid(svg: SVGSVGElement, w: number, h: number, nx: number, ny: number) {
  const g = svgEl('g', { stroke: 'var(--ris-line-faint, rgba(255,255,255,0.06))', 'stroke-width': 1 });
  for (let i = 1; i < nx; i++) {
    g.appendChild(svgEl('line', { x1: (w / nx) * i, y1: 0, x2: (w / nx) * i, y2: h }));
  }
  for (let i = 1; i < ny; i++) {
    g.appendChild(svgEl('line', { x1: 0, y1: (h / ny) * i, x2: w, y2: (h / ny) * i }));
  }
  svg.appendChild(g);
}

function scale(points: number[], w: number, h: number, pad: number): [number, number][] {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  return points.map((v, i) => [
    pad + (points.length > 1 ? (i / (points.length - 1)) * (w - 2 * pad) : w / 2),
    h - pad - ((v - min) / span) * (h - 2 * pad),
  ]);
}

function getSvgPoint(svg: SVGSVGElement, ev: PointerEvent | MouseEvent, w: number, h: number): { x: number; y: number } {
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

function ambientSweep(svg: SVGSVGElement, w: number, h: number) {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gradId = `ris-sweep-grad-${++UID}`;
  const defs = svgEl('defs', {});
  const grad = svgEl('linearGradient', { id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': 'var(--ris-cyan, #6fb3c9)', 'stop-opacity': '0' }));
  grad.appendChild(svgEl('stop', { offset: '75%', 'stop-color': 'var(--ris-cyan, #6fb3c9)', 'stop-opacity': '0.35' }));
  grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': 'var(--ris-cyan, #6fb3c9)', 'stop-opacity': '0.95' }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  const sweep = svgEl('g', { class: 'ris-chart-ambient-sweep' });
  sweep.appendChild(svgEl('rect', { x: -40, y: 0, width: 40, height: h, fill: `url(#${gradId})` }));
  sweep.appendChild(
    svgEl('line', {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: h,
      stroke: 'var(--ris-cyan, #6fb3c9)',
      'stroke-width': 1.5,
      opacity: '0.9',
    })
  );

  const animX = svgEl('animateTransform', {
    attributeName: 'transform',
    type: 'translate',
    from: '-40 0',
    to: `${w + 40} 0`,
    dur: '4.5s',
    repeatCount: 'indefinite',
  });
  const animOp = svgEl('animate', {
    attributeName: 'opacity',
    values: '0; 0.28; 0.28; 0',
    keyTimes: '0; 0.08; 0.92; 1',
    dur: '4.5s',
    repeatCount: 'indefinite',
  });
  sweep.appendChild(animX);
  sweep.appendChild(animOp);
  svg.appendChild(sweep);
}

function createScrubberOverlay(svg: SVGSVGElement, w: number, h: number, color: string) {
  const g = svgEl('g', { class: 'ris-scrubber-group', style: 'display: none;' });

  const line = svgEl('line', {
    class: 'ris-scrubber-line',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: h,
    stroke: color,
    'stroke-width': 1,
    'stroke-dasharray': '2 2',
  });
  g.appendChild(line);

  const reticle = svgEl('rect', {
    class: 'ris-scrubber-reticle',
    x: -3.5,
    y: -3.5,
    width: 7,
    height: 7,
    stroke: color,
    'stroke-width': 1.5,
    fill: 'none',
  });
  g.appendChild(reticle);

  const badge = svgEl('g', { class: 'ris-scrubber-badge' });
  const bg = svgEl('rect', {
    class: 'ris-scrubber-badge-bg',
    x: 0,
    y: 0,
    width: 84,
    height: 26,
    rx: 2,
    fill: 'var(--ris-surface-4, #232c33)',
    stroke: 'var(--ris-line-strong, rgba(255,255,255,0.18))',
    'stroke-width': 1,
  });
  const t1 = svgEl('text', {
    class: 'ris-scrubber-text-main',
    x: 6,
    y: 11,
    fill: 'var(--ris-fg3, #8a96a0)',
    'font-family': 'var(--ris-font-mono)',
    'font-size': 9,
    'letter-spacing': '0.08em',
  });
  const t2 = svgEl('text', {
    class: 'ris-scrubber-text-sub',
    x: 6,
    y: 21,
    fill: 'var(--ris-fg1, #ffffff)',
    'font-family': 'var(--ris-font-mono)',
    'font-size': 10,
    'font-weight': 'bold',
  });

  badge.appendChild(bg);
  badge.appendChild(t1);
  badge.appendChild(t2);
  g.appendChild(badge);
  svg.appendChild(g);

  return {
    group: g,
    show() {
      g.style.display = '';
      svg.classList.add('is-scrubbing');
    },
    hide() {
      g.style.display = 'none';
      svg.classList.remove('is-scrubbing');
    },
    update(x: number, y: number, line1: string, line2: string) {
      line.setAttribute('x1', x.toFixed(1));
      line.setAttribute('x2', x.toFixed(1));
      reticle.setAttribute('x', (x - 3.5).toFixed(1));
      reticle.setAttribute('y', (y - 3.5).toFixed(1));

      t1.textContent = line1;
      t2.textContent = line2;

      const maxChars = Math.max(line1.length, line2.length);
      const badgeW = Math.max(78, maxChars * 6.2 + 14);
      bg.setAttribute('width', badgeW.toFixed(1));

      let bx = x + 8;
      if (bx + badgeW > w - 4) bx = x - badgeW - 8;
      if (bx < 4) bx = 4;

      let by = y - 26 - 6;
      if (by < 4) by = y + 8;
      if (by + 26 > h - 4) by = h - 26 - 4;

      badge.setAttribute('transform', `translate(${bx.toFixed(1)}, ${by.toFixed(1)})`);
    },
  };
}

export const RisChartsCore = {
  line(el: HTMLElement, points: number[], opts: LineChartOptions = {}): SVGSVGElement {
    const w = opts.width || 320;
    const h = opts.height || 120;
    const pad = 6;
    const color = opts.color || 'var(--ris-cyan, #6fb3c9)';

    const svg = base(el, w, h, opts.label);
    grid(svg, w, h, opts.gridX || 6, opts.gridY || 4);

    if (opts.ambientSweep !== false && opts.area !== false) {
      ambientSweep(svg, w, h);
    }

    const xy = scale(points, w, h, pad);
    const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');

    if (opts.area !== false && points.length > 1) {
      const area = `${d} L ${xy[xy.length - 1]![0].toFixed(1)} ${h - pad} L ${xy[0]![0].toFixed(1)} ${h - pad} Z`;
      svg.appendChild(svgEl('path', { d: area, fill: color, opacity: 0.12 }));
    }

    const path = svgEl('path', {
      d,
      fill: 'none',
      stroke: color,
      'stroke-width': 1.75,
      filter: glowFilter(svg, color),
    });
    svg.appendChild(path);

    // Terminal point marker
    if (xy.length > 0) {
      const last = xy[xy.length - 1]!;
      svg.appendChild(
        svgEl('rect', {
          x: last[0] - 2.5,
          y: last[1] - 2.5,
          width: 5,
          height: 5,
          fill: color,
        })
      );
    }

    // Scrubber interaction
    if (opts.interactive !== false && points.length > 1) {
      svg.classList.add('ris-chart-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'region');
      svg.setAttribute('aria-label', `${opts.label || 'line chart'}, arrow keys to inspect`);

      const scrubber = createScrubberOverlay(svg, w, h, color);
      let activeIdx = -1;

      const renderPoint = (idx: number) => {
        if (idx < 0 || idx >= points.length) return;
        activeIdx = idx;
        const [px, py] = xy[idx]!;
        const val = points[idx]!;
        const formatted = opts.format ? opts.format(val) : `${val}${opts.unit || ''}`;
        const cat = opts.categories?.[idx] || `PT: ${String(idx + 1).padStart(2, '0')}/${points.length}`;

        scrubber.update(px, py, cat, `VAL: ${formatted}`);
        scrubber.show();
        svg.setAttribute('aria-valuenow', String(val));
        opts.onScrub?.({ index: idx, value: val, category: cat, formattedValue: formatted, x: px, y: py });
      };

      const clearPoint = () => {
        activeIdx = -1;
        scrubber.hide();
        opts.onScrub?.(null);
      };

      svg.addEventListener('pointermove', (ev) => {
        const pt = getSvgPoint(svg, ev, w, h);
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < xy.length; i++) {
          const dist = Math.abs(xy[i]![0] - pt.x);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        renderPoint(bestIdx);
      });

      svg.addEventListener('pointerleave', () => {
        if (document.activeElement !== svg) clearPoint();
      });

      svg.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          const next = activeIdx < 0 ? 0 : Math.min(points.length - 1, activeIdx + 1);
          renderPoint(next);
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          const prev = activeIdx < 0 ? points.length - 1 : Math.max(0, activeIdx - 1);
          renderPoint(prev);
        } else if (ev.key === 'Escape') {
          clearPoint();
        }
      });

      svg.addEventListener('blur', clearPoint);
    }

    return svg;
  },

  bars(el: HTMLElement, values: number[], opts: BarChartOptions = {}): SVGSVGElement {
    const w = opts.width || 320;
    const h = opts.height || 120;
    const pad = 8;
    const color = opts.color || 'var(--ris-accent, #e6a23c)';
    const gap = opts.gap ?? 3;
    const max = Math.max(...values, 1);

    const svg = base(el, w, h, opts.label);
    grid(svg, w, h, Math.min(values.length, 12), 4);

    const availW = w - 2 * pad - (values.length - 1) * gap;
    const bw = Math.max(2, availW / values.length);
    const rects: SVGRectElement[] = [];

    values.forEach((v, i) => {
      const bh = Math.max(2, (v / max) * (h - 2 * pad));
      const bx = pad + i * (bw + gap);
      const by = h - pad - bh;
      const isHigh = opts.highlight === i || v === max;
      const barColor = isHigh ? color : 'var(--ris-surface-4, #232c33)';

      const r = svgEl('rect', {
        x: bx,
        y: by,
        width: bw,
        height: bh,
        fill: barColor,
        stroke: isHigh ? color : 'var(--ris-line-strong, rgba(255,255,255,0.15))',
        'stroke-width': 1,
      });
      svg.appendChild(r);
      rects.push(r);
    });

    if (opts.interactive !== false && values.length > 0) {
      svg.classList.add('ris-chart-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'region');

      const scrubber = createScrubberOverlay(svg, w, h, color);
      let activeIdx = -1;

      const renderBar = (idx: number) => {
        if (idx < 0 || idx >= values.length) return;
        activeIdx = idx;
        const v = values[idx]!;
        const bx = pad + idx * (bw + gap) + bw / 2;
        const bh = Math.max(2, (v / max) * (h - 2 * pad));
        const by = h - pad - bh;
        const formatted = opts.format ? opts.format(v) : `${v}${opts.unit || ''}`;
        const cat = opts.categories?.[idx] || `BAR: #${String(idx + 1).padStart(2, '0')}`;

        rects.forEach((r, i) => {
          r.setAttribute('fill', i === idx ? color : 'var(--ris-surface-4, #232c33)');
        });

        scrubber.update(bx, by, cat, `VAL: ${formatted}`);
        scrubber.show();
        opts.onScrub?.({ index: idx, value: v, category: cat, formattedValue: formatted, x: bx, y: by });
      };

      const clearBar = () => {
        activeIdx = -1;
        rects.forEach((r, i) => {
          const isHigh = opts.highlight === i || values[i] === max;
          r.setAttribute('fill', isHigh ? color : 'var(--ris-surface-4, #232c33)');
        });
        scrubber.hide();
        opts.onScrub?.(null);
      };

      svg.addEventListener('pointermove', (ev) => {
        const pt = getSvgPoint(svg, ev, w, h);
        for (let i = 0; i < rects.length; i++) {
          const rx = pad + i * (bw + gap);
          if (pt.x >= rx && pt.x <= rx + bw + gap) {
            renderBar(i);
            return;
          }
        }
      });

      svg.addEventListener('pointerleave', () => {
        if (document.activeElement !== svg) clearBar();
      });

      svg.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          const next = activeIdx < 0 ? 0 : Math.min(values.length - 1, activeIdx + 1);
          renderBar(next);
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          const prev = activeIdx < 0 ? values.length - 1 : Math.max(0, activeIdx - 1);
          renderBar(prev);
        } else if (ev.key === 'Escape') {
          clearBar();
        }
      });

      svg.addEventListener('blur', clearBar);
    }

    return svg;
  },

  spark(el: HTMLElement, points: number[], opts: BaseChartOptions = {}): SVGSVGElement {
    return RisChartsCore.line(el, points, {
      width: opts.width || 96,
      height: opts.height || 28,
      gridX: 0,
      gridY: 0,
      area: false,
      animate: false,
      interactive: false,
      ambientSweep: false,
      ...opts,
    });
  },

  gauge(el: HTMLElement, value: number, opts: GaugeChartOptions = {}): SVGSVGElement {
    const w = opts.width || 120;
    const h = opts.height || 64;
    const segs = opts.segments || 16;
    const color = opts.color || 'var(--ris-accent, #e6a23c)';
    const clampedVal = Math.max(0, Math.min(1, value));

    const svg = base(el, w, h, opts.label);
    const on = Math.round(clampedVal * segs);
    const sw = (w - (segs - 1) * 2) / segs;

    for (let i = 0; i < segs; i++) {
      const isLit = i < on;
      const seg = svgEl('rect', {
        x: i * (sw + 2),
        y: h * 0.35,
        width: sw,
        height: h * 0.3,
        fill: isLit ? color : 'var(--ris-surface-3, #1b2228)',
      });
      svg.appendChild(seg);
    }

    const t = svgEl('text', {
      x: 0,
      y: h * 0.22,
      fill: 'var(--ris-fg3, #8a96a0)',
      'font-family': 'var(--ris-font-mono)',
      'font-size': 9,
      'letter-spacing': '0.08em',
    });
    t.textContent = `${opts.caption || 'GAUGE'} ${Math.round(clampedVal * 100)}${opts.unit || '%'}`;
    svg.appendChild(t);

    if (opts.interactive !== false) {
      svg.setAttribute('role', 'meter');
      svg.setAttribute('aria-valuenow', String(Math.round(clampedVal * 100)));
      svg.setAttribute('aria-valuemin', '0');
      svg.setAttribute('aria-valuemax', '100');
    }

    return svg;
  },

  eegWaveform(el: HTMLElement, channels: number[][], opts: EegWaveformOptions = {}): SVGSVGElement {
    const w = opts.width || 360;
    const h = opts.height || 160;
    const colors = opts.colors || ['var(--ris-cyan, #6fb3c9)', 'var(--ris-yellow, #e6a23c)', 'var(--ris-green, #5fae84)', 'var(--ris-violet, #8479be)'];
    const rows = channels.length || 1;

    const svg = base(el, w, h, opts.label || 'eeg multi-channel waveform');
    grid(svg, w, h, 0, rows);

    const rowH = h / rows;
    channels.forEach((series, ci) => {
      if (!series || series.length < 2) return;
      const color = colors[ci % colors.length]!;
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
      svg.appendChild(
        svgEl('path', {
          d,
          fill: 'none',
          stroke: color,
          'stroke-width': 1.25,
          filter: glowFilter(svg, color),
        })
      );
    });

    return svg;
  },
};
