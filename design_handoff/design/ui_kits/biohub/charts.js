// charts.js — lightweight canvas widgets for the BioHub kit (no deps)
// Mirrors the repo's Vico line charts + adds an EEG band meter.

function risLineChart(canvas, data, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  const color = opts.color || '#16e0e0';
  const pad = { l: 6, r: 6, t: 10, b: 10 };
  const min = Math.min(...data), max = Math.max(...data), range = (max - min) || 1;
  const xs = i => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
  const ys = v => pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b);
  ctx.clearRect(0, 0, w, h);
  // baseline grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let g = 0; g <= 3; g++) { const y = pad.t + g/3*(h-pad.t-pad.b); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke(); }
  // area fill
  ctx.beginPath(); ctx.moveTo(xs(0), ys(data[0]));
  data.forEach((v, i) => ctx.lineTo(xs(i), ys(v)));
  ctx.lineTo(xs(data.length-1), h-pad.b); ctx.lineTo(xs(0), h-pad.b); ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad.t, 0, h);
  grad.addColorStop(0, color + '33'); grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad; ctx.fill();
  // line
  ctx.beginPath(); ctx.moveTo(xs(0), ys(data[0]));
  data.forEach((v, i) => ctx.lineTo(xs(i), ys(v)));
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.stroke();
  // last point dot
  ctx.beginPath(); ctx.arc(xs(data.length-1), ys(data[data.length-1]), 2.5, 0, 7); ctx.fillStyle = color; ctx.fill();
}

// EEG band powers: delta/theta/alpha/beta/gamma vertical bars
function risEegBands(canvas, bands, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  const labels = ['δ','θ','α','β','γ'];
  const cols = ['#b06bff','#16e0e0','#2fe48a','#f2e205','#ff2d3c'];
  const pad = { l: 4, r: 4, t: 8, b: 16 };
  const bw = (w - pad.l - pad.r) / bands.length;
  const max = Math.max(...bands) || 1;
  ctx.clearRect(0, 0, w, h);
  bands.forEach((v, i) => {
    const bh = (v / max) * (h - pad.t - pad.b);
    const x = pad.l + i * bw + bw * 0.18, bwi = bw * 0.64;
    // track
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(x, pad.t, bwi, h - pad.t - pad.b);
    // bar
    ctx.fillStyle = cols[i]; ctx.fillRect(x, pad.t + (h - pad.t - pad.b - bh), bwi, bh);
    ctx.shadowColor = cols[i]; ctx.shadowBlur = 8; ctx.fillRect(x, pad.t + (h - pad.t - pad.b - bh), bwi, 2); ctx.shadowBlur = 0;
    // label
    ctx.fillStyle = '#98a3a5'; ctx.font = '11px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + bwi/2, h - 4);
  });
}

window.risLineChart = risLineChart; window.risEegBands = risEegBands;

// 4-channel live EEG waveform (TP9/AF7/AF8/TP10) — mirrors MuseRecorder EegWaveformCard
function risEegWaveform(canvas, channels, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  const cols = ['#2fe48a', '#16e0e0', '#e08a3c', '#b06bff']; // TP9 AF7 AF8 TP10
  ctx.clearRect(0, 0, w, h);
  const chH = h / channels.length;
  channels.forEach((samples, idx) => {
    if (!samples || samples.length < 2) return;
    const yBase = idx * chH;
    const min = Math.min(...samples), max = Math.max(...samples), range = Math.max(max - min, 20);
    const xStep = w / (samples.length - 1);
    if (idx > 0) { ctx.strokeStyle = cols[idx] + '26'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, yBase); ctx.lineTo(w, yBase); ctx.stroke(); }
    ctx.beginPath();
    samples.forEach((v, i) => {
      const x = i * xStep, y = yBase + chH * (1 - Math.min(Math.max((v - min) / range, 0), 1)) * 0.9 - chH * 0.05;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = cols[idx]; ctx.lineWidth = 1.3; ctx.lineJoin = 'round'; ctx.stroke();
  });
}

// synth EEG channel data (for the prototype's live feed)
function risSynthEeg(n, seed, amp) {
  const a = []; for (let i = 0; i < n; i++) a.push(Math.sin(i * 0.4 + seed) * amp + Math.sin(i * 1.3 + seed * 2) * amp * 0.4 + (Math.random() - 0.5) * amp * 0.5);
  return a;
}

window.risEegWaveform = risEegWaveform; window.risSynthEeg = risSynthEeg;
