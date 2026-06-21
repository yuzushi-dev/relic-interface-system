// Shell.jsx — Boot screen + app chrome (nav rail, top status bar)
const { useState: useStateShell, useEffect: useEffectShell } = React;

const NAV = [
  { id: 'dashboard', icon: 'layout-dashboard', label: 'Study' },
  { id: 'profile', icon: 'brain-circuit', label: 'Subject' },
  { id: 'baseline', icon: 'clipboard-list', label: 'Baseline' },
  { id: 'gumi', icon: 'bot', label: 'Gumi' },
  { id: 'chronicle', icon: 'history', label: 'Chronicle' },
];

function Clock() {
  const [t, setT] = useStateShell('00:00:00');
  useEffectShell(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-GB'));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12, color: 'var(--ris-cyan)', letterSpacing: '.08em' }}>{t}</span>;
}

function BootScreen({ onJackIn }) {
  const [lines, setLines] = useStateShell([]);
  const seq = [
    'RELIC RESEARCHER WORKBENCH v2.4.1',
    'initializing study context…',
    'mounting subject registry … 12 OK',
    'loading facet models … OK',
    'Gumi runtime … ACTIVE',
    'READY',
  ];
  useEffectShell(() => {
    let i = 0; const id = setInterval(() => {
      i++; setLines(seq.slice(0, i)); if (i >= seq.length) clearInterval(id);
    }, 320); return () => clearInterval(id);
  }, []);
  return (
    <div className="ris-grid-bg ris-scanlines" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      <img src="../../assets/relic-logo.svg" style={{ height: 64 }} className="ris-flicker" alt="Relic" />
      <div style={{ width: 420, minHeight: 130, fontFamily: 'var(--ris-font-mono)', fontSize: 12.5, lineHeight: 1.9 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l === 'READY' ? 'var(--ris-green)' : (l.includes('ACTIVE') ? 'var(--ris-amber)' : 'var(--ris-fg2)') }}>
            <span style={{ color: 'var(--ris-fg4)' }}>{'>'} </span>{l}{l.includes('OK') || l.includes('ACTIVE') ? '' : ''}
          </div>
        ))}
        {lines.length < seq.length && <span className="ris-blink" style={{ color: 'var(--ris-cyan)' }}>▋</span>}
      </div>
      {lines.length >= seq.length && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Btn variant="primary" icon="log-in" onClick={onJackIn}>Enter Workbench</Btn>
          <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: 'var(--ris-fg3)' }}>press <b style={{ color: 'var(--ris-fg1)' }}>F</b> to sign in</span>
        </div>
      )}
    </div>
  );
}

function Shell({ active, onNav, breadcrumb, children, onAlert }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '64px 1fr', gridTemplateRows: '52px 1fr', background: 'var(--ris-bg)' }} className="ris-grid-bg">
      {/* top bar */}
      <header style={{ gridColumn: '1 / 3', display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)', zIndex: 5 }}>
        <img src="../../assets/relic-mark.svg" style={{ height: 28 }} alt="R" />
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11.5, letterSpacing: '.08em', color: 'var(--ris-fg3)' }}>
          {breadcrumb.map((b, i) => (
            <span key={i}>{i > 0 && <span style={{ color: 'var(--ris-fg4)' }}> / </span>}<span style={{ color: i === breadcrumb.length - 1 ? 'var(--ris-cyan)' : '#98a3a5' }}>{b}</span></span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Chip tone="green" dot>LIVE</Chip>
          <Chip tone="cyan" dot>12 SUBJECTS</Chip>
          <Clock />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, borderLeft: '1px solid var(--ris-line)' }}>
            <div style={{ width: 28, height: 28, background: 'var(--ris-surface-3)', border: '1px solid var(--ris-cyan-line)', clipPath: CLIP(6), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ris-cyan)' }}><Icon name="user" size={15} /></div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ris-fg1)' }}>RESEARCHER</div>
              <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, color: '#98a3a5' }}>R-0007-RELIC</div>
            </div>
          </div>
        </div>
      </header>

      {/* nav rail */}
      <nav style={{ gridRow: '2', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 0', borderRight: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)' }}>
        {NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} title={n.label}
              style={{ position: 'relative', width: 44, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: on ? 'var(--ris-amber-glow)' : 'transparent', border: '1px solid ' + (on ? 'var(--ris-amber-line)' : 'transparent'), color: on ? 'var(--ris-amber)' : 'var(--ris-fg3)', cursor: 'pointer', clipPath: CLIP(6) }}>
              {on && <span style={{ position: 'absolute', left: -1, top: 8, bottom: 8, width: 2, background: 'var(--ris-amber)' }} />}
              <Icon name={n.icon} size={18} />
            </button>
          );
        })}
        <button onClick={onAlert} title="End Session" style={{ marginTop: 'auto', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', color: 'var(--ris-red)', cursor: 'pointer', clipPath: CLIP(6) }}>
          <Icon name="power" size={18} />
        </button>
      </nav>

      {/* main */}
      <main style={{ gridRow: '2', overflow: 'auto', position: 'relative' }}>{children}</main>
    </div>
  );
}

Object.assign(window, { Shell, BootScreen, NAV });
