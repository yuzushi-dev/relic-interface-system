// Import.jsx — data import: GadgetBridge file + Zepp Life API (mirrors ImportScreen.kt)
function BioImport() {
  const [gb, setGb] = React.useState('idle'); // idle / loading / success
  const [zepp, setZepp] = React.useState('idle');
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const State = ({ s, msg }) => s === 'idle' ? null : (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 8px' }}>
      {s === 'loading' ? <span style={{ width: 13, height: 13, border: '2px solid var(--ris-cyan)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'risspin .8s linear infinite' }} />
        : <Ico name="check-circle-2" size={14} color="var(--ris-green)" />}
      <span style={{ fontFamily: MONO, fontSize: 11, color: s==='success'?'var(--ris-green)':'var(--ris-fg2)' }}>{msg}</span>
    </div>
  );

  const runGb = () => { setGb('loading'); setTimeout(() => setGb('success'), 1800); };
  const runZepp = () => { setZepp('loading'); setTimeout(() => setZepp('success'), 2200); };

  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* GadgetBridge */}
      <Card style={{ padding: 14, background: 'var(--ris-surface-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ico name="database" size={18} color="var(--ris-cyan)" />
          <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ris-fg1)', whiteSpace: 'nowrap' }}>GadgetBridge</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: '#98a3a5', marginTop: 10, lineHeight: 1.6 }}>Importa Gadgetbridge.db (Menu → Database Management → Export DB).<br/>Supporta: HR, HRV, RHR, SpO2, stress, temperatura, PAI, sonno.</div>
        <div style={{ marginTop: 10 }}><State s={gb} msg={gb==='loading'?'Importando…':'Importati 8.420 record da Gadgetbridge.db'} /></div>
        <button className="ris-btn" disabled={gb==='loading'} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={runGb}>
          <Ico name="folder-open" size={14} />{gb==='loading'?'Importando…':'Seleziona Gadgetbridge.db'}
        </button>
      </Card>

      {/* Zepp Life */}
      <Card style={{ padding: 14, background: 'var(--ris-surface-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ico name="watch" size={18} color="var(--ris-cyan)" />
          <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ris-fg1)', whiteSpace: 'nowrap' }}>Zepp Life · Amazfit</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: '#98a3a5', marginTop: 10, lineHeight: 1.6 }}>Scarica dati dall'API Zepp Life: HR, HRV, RHR, SpO2, stress, PAI, sonno.</div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1 }}><div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginBottom: 4 }}>DA</div><input className="ris-input" defaultValue="2026-05-01" /></div>
          <div style={{ flex: 1 }}><div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginBottom: 4 }}>A</div><input className="ris-input" defaultValue="2026-05-31" /></div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginBottom: 4 }}>EMAIL ZEPP LIFE</div>
          <input className="ris-input" defaultValue="operative@relic.io" inputMode="email" />
        </div>
        <div style={{ marginTop: 10, position: 'relative' }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginBottom: 4 }}>PASSWORD</div>
          <input className="ris-input" type={showPw?'text':'password'} defaultValue="amazfit2026" style={{ paddingRight: 36 }} />
          <button onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 8, bottom: 8, background: 'none', border: 'none', color: 'var(--ris-fg3)', cursor: 'pointer', padding: 0 }}><Ico name={showPw?'eye-off':'eye'} size={15} /></button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, cursor: 'pointer' }} onClick={() => setRemember(r => !r)}>
          <span style={{ width: 17, height: 17, border: '1px solid '+(remember?'var(--ris-amber)':'var(--ris-line-strong)'), background: remember?'var(--ris-amber-glow)':'var(--ris-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ris-amber)' }}>{remember && <Ico name="check" size={12} />}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg2)' }}>Ricorda email e password</span>
        </label>
        <div style={{ marginTop: 10 }}><State s={zepp} msg={zepp==='loading'?'Connessione API Zepp…':'Importati 4.106 record (31 giorni)'} /></div>
        <button className="ris-btn ris-btn--secondary" disabled={zepp==='loading'} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={runZepp}>
          <Ico name="cloud-download" size={14} />Importa con email/password
        </button>
      </Card>
    </div>
  );
}

// Data.jsx wrapper — Export ⟷ Import toggle
function BioData() {
  const [tab, setTab] = React.useState('export');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', flex: '0 0 auto', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)' }}>
        {[['export', 'Export'], ['import', 'Import']].map(([id, label]) => {
          const on = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{ position: 'relative', flex: 1, padding: '12px 0', background: on?'var(--ris-cyan-glow)':'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--ris-font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: on?'var(--ris-cyan)':'var(--ris-fg3)' }}>
              {label}
              {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--ris-cyan)' }} />}
            </button>
          );
        })}
      </div>
      {tab === 'export' ? <BioExport /> : <BioImport />}
    </div>
  );
}
Object.assign(window, { BioImport, BioData });
