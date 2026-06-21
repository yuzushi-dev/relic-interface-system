// BioComponents.jsx — shared BioHub kit primitives (RIS-skinned Android)
const MONO = 'var(--ris-font-mono)';
const DISP = 'var(--ris-font-display)';

function clip(n){ return `polygon(0 0, calc(100% - ${n}px) 0, 100% ${n}px, 100% 100%, ${n}px 100%, 0 calc(100% - ${n}px))`; }

function Ico({ name, size = 18, color, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons();
      const svg = ref.current.querySelector('svg');
      if (svg) { svg.style.width = size+'px'; svg.style.height = size+'px'; if (color) svg.style.color = color; }
    }
  }, [name, size, color]);
  return <span ref={ref} style={{ display: 'inline-flex', color, ...style }} />;
}

function Lbl({ children, style }) {
  return <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#98a3a5', ...style }}>{children}</div>;
}
function Stat({ children, size = 17, color = 'var(--ris-fg1)', style }) {
  return <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: size, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1, ...style }}>{children}</div>;
}
function Card({ children, style, cut = 8, accent, onClick }) {
  return <div onClick={onClick} style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid '+(accent||'var(--ris-line)'), clipPath: clip(cut), ...style }}>{children}</div>;
}

function StatusBar({ name }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', height: 30, flex: '0 0 30px', background: 'var(--ris-void)', borderBottom: '1px solid var(--ris-line-faint)', fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg2)' }}>
      <span>07:42</span>
      <span style={{ fontFamily: DISP, fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: 'var(--ris-cyan)' }}>{name}</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Ico name="signal" size={12} /><Ico name="wifi" size={12} /><Ico name="battery-full" size={14} color="var(--ris-green)" /></span>
    </div>
  );
}

function BioTopBar({ title, sub, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', flex: '0 0 auto', background: 'var(--ris-surface-1)', borderBottom: '1px solid var(--ris-line)' }}>
      <div>
        <div style={{ fontFamily: DISP, fontSize: 24, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', color: 'var(--ris-fg1)', lineHeight: 1.05 }}>{title}</div>
        {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginTop: 4 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

const BIO_TABS = [
  { id: 'dashboard', icon: 'layout-dashboard', label: 'Dash' },
  { id: 'inspector', icon: 'list', label: 'Inspector' },
  { id: 'muse', icon: 'brain', label: 'Muse' },
  { id: 'sync', icon: 'refresh-cw', label: 'Sync' },
  { id: 'data', icon: 'database', label: 'Data' },
];
function BioBottomNav({ active, onNav }) {
  return (
    <div style={{ display: 'flex', flex: '0 0 auto', borderTop: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)' }}>
      {BIO_TABS.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '9px 0 11px', background: 'none', border: 'none', color: on ? 'var(--ris-cyan)' : 'var(--ris-fg3)', cursor: 'pointer' }}>
            {on && <span style={{ position: 'absolute', top: 0, left: '26%', right: '26%', height: 2, background: 'var(--ris-cyan)', boxShadow: '0 0 8px var(--ris-cyan-glow)' }} />}
            <Ico name={t.icon} size={19} />
            <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { MONO, DISP, clip, Ico, Lbl, Stat, Card, StatusBar, BioTopBar, BioBottomNav });
