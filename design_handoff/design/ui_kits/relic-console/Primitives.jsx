// Primitives.jsx — shared Relic Console building blocks
const { useState, useEffect, useRef } = React;

// Icon helper — renders a lucide icon by name
function Icon({ name, size = 16, color, style, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({ attrs: { width: size, height: size }, nameAttr: 'data-lucide' });
      const svg = ref.current.querySelector('svg');
      if (svg) { svg.style.width = size + 'px'; svg.style.height = size + 'px'; if (color) svg.style.color = color; }
    }
  }, [name, size, color]);
  return <span ref={ref} className={className} style={{ display: 'inline-flex', color, ...style }} />;
}

const CLIP = (n) => `polygon(0 0, calc(100% - ${n}px) 0, 100% ${n}px, 100% 100%, ${n}px 100%, 0 calc(100% - ${n}px))`;

// Angular panel with optional header
function Panel({ title, right, children, accent, clip = 10, style, bodyStyle, head = true }) {
  return (
    <div style={{
      position: 'relative', background: 'var(--ris-surface-1)',
      border: `1px solid ${accent || 'var(--ris-line)'}`,
      clipPath: CLIP(clip), ...style,
    }}>
      {head && title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          padding: '10px 14px', borderBottom: '1px solid var(--ris-line)',
          background: 'linear-gradient(var(--ris-surface-2), var(--ris-surface-1))',
        }}>
          <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg1)' }}>{title}</span>
          {right}
        </div>
      )}
      <div style={{ padding: head ? 14 : 0, ...bodyStyle }}>{children}</div>
    </div>
  );
}

function Btn({ variant = 'default', children, icon, onClick, disabled, style }) {
  const cls = 'ris-btn' + (variant !== 'default' ? ' ris-btn--' + variant : '');
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={13} />}{children}
    </button>
  );
}

function Chip({ tone, children, dot }) {
  const cls = 'ris-chip' + (tone ? ' ris-chip--' + tone : '');
  return <span className={cls}>{dot && <i className="dot" />}{children}</span>;
}

function Label({ children, style }) {
  return <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg3)', ...style }}>{children}</span>;
}

function Meter({ value, color = 'var(--ris-accent)', height = 6 }) {
  return (
    <div className="ris-meter" style={{ height }}>
      <i style={{ width: value + '%', background: color }} />
    </div>
  );
}

function SegMeter({ on, total, color = 'var(--ris-amber)' }) {
  return (
    <div className="ris-segmeter">
      {Array.from({ length: total }).map((_, i) => <i key={i} className={i < on ? 'on' : ''} style={i < on ? { background: color } : null} />)}
    </div>
  );
}

// Bracket corner accents
function Brackets({ color = 'var(--ris-accent)' }) {
  const base = { position: 'absolute', width: 9, height: 9, borderColor: color, borderStyle: 'solid', pointerEvents: 'none', zIndex: 3 };
  return <>
    <span style={{ ...base, top: 3, left: 3, borderWidth: '1px 0 0 1px' }} />
    <span style={{ ...base, bottom: 3, right: 3, borderWidth: '0 1px 1px 0' }} />
  </>;
}

// Calibration slider — repo's CalibrationSlider: label + value + needle on a track
function Calibration({ label, value, max = 7, color = 'var(--ris-cyan)' }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div style={{ padding: '9px 0', borderBottom: '1px solid var(--ris-line-faint)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--ris-font-mono)', fontSize: 11.5, marginBottom: 7 }}>
        <span style={{ color: '#98a3a5' }}>{label}</span>
        <span style={{ color: 'var(--ris-fg1)', fontWeight: 500 }}>{value.toFixed(2)}</span>
      </div>
      <div style={{ position: 'relative', height: 8, background: 'var(--ris-void)', border: '1px solid var(--ris-line-strong)' }}>
        <span style={{ position: 'absolute', top: -2, bottom: -2, width: 4, left: pct + '%', transform: 'translateX(-50%)', background: color, boxShadow: '0 0 8px ' + color }} />
      </div>
    </div>
  );
}

// Stream chip — provenance tag
function Stream({ kind, children }) {
  return <span className="ris-stream" data-stream={kind}>{children}</span>;
}

// Subject context bar — subject registry quick-switch (repo's SubjectNav)
function SubjectBar({ subjects, current, onSwitch }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)' }}>
      <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ris-fg4)' }}>Subject</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {subjects.map(s => {
          const on = s === current;
          return <button key={s} onClick={() => onSwitch(s)} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, padding: '4px 11px', letterSpacing: '.04em', whiteSpace: 'nowrap', background: on ? 'var(--ris-amber)' : 'transparent', color: on ? 'var(--ris-fg-invert)' : 'var(--ris-fg2)', border: '1px solid ' + (on ? 'var(--ris-amber)' : 'var(--ris-line-strong)'), cursor: 'pointer' }}>{s}</button>;
        })}
      </div>
      <span style={{ marginLeft: 'auto' }}><Chip tone="cyan" dot>SCOPED</Chip></span>
    </div>
  );
}

Object.assign(window, { Icon, Panel, Btn, Chip, Label, Meter, SegMeter, Brackets, Calibration, Stream, SubjectBar, CLIP });
