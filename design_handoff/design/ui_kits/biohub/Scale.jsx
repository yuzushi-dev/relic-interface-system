// Scale.jsx — body composition via BLE scale (mirrors ScaleScreen.kt)
// Drill-down from the Dashboard body-composition card.
const SCALE_TILES = [
  ['Massa grassa', '12.14 kg'], ['Acqua corporea', '54.2 %'],
  ['M. scheletrica', '33.10 kg'], ['Massa magra (LBM)', '59.26 kg'],
  ['Massa ossea', '3.20 kg'], ['Metab. basale', '1620 kcal/g'],
  ['Grasso viscerale', '8.0'], ['Età metabolica', '29 anni'],
];

function BioScale({ onBack }) {
  const [phase, setPhase] = React.useState('idle'); // idle / scanning / measuring / reading
  const [sex, setSex] = React.useState('M');
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const weigh = () => {
    setPhase('scanning');
    setTimeout(() => setPhase('measuring'), 1500);
    setTimeout(() => setPhase('reading'), 3200);
  };

  const stateLine = {
    idle: { txt: "Premi 'Pesati ora', poi sali sulla bilancia.", c: 'var(--ris-fg3)' },
    scanning: { txt: 'In ascolto… sali sulla bilancia', c: 'var(--ris-cyan)' },
    measuring: { txt: '71.42 kg — attendo stabilizzazione…', c: 'var(--ris-amber)' },
    reading: { txt: '71.42 kg · 512 Ω  ✓', c: 'var(--ris-green)' },
  }[phase];

  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start', background: 'none', border: '1px solid var(--ris-line-strong)', color: 'var(--ris-cyan)', padding: '6px 11px', cursor: 'pointer', clipPath: clip(6), fontFamily: MONO, fontSize: 11, letterSpacing: '.06em' }}>
        <Ico name="chevron-left" size={15} /> DASHBOARD
      </button>

      {/* profile */}
      <Card style={{ padding: 14 }}>
        <Lbl>Profilo · richiesto per BIA</Lbl>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginBottom: 4 }}>ALTEZZA (CM)</div>
            <input className="ris-input" defaultValue="178" inputMode="numeric" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginBottom: 4 }}>ETÀ</div>
            <input className="ris-input" defaultValue="31" inputMode="numeric" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg3)' }}>SESSO</span>
          {['M', 'F'].map(o => (
            <button key={o} onClick={() => setSex(o)} style={{ fontFamily: MONO, fontSize: 11, padding: '5px 14px', letterSpacing: '.06em', cursor: 'pointer',
              background: sex===o?'var(--ris-amber)':'transparent', color: sex===o?'var(--ris-fg-invert)':'var(--ris-fg3)', border: '1px solid '+(sex===o?'var(--ris-amber)':'var(--ris-line-strong)') }}>{o==='M'?'Uomo':'Donna'}</button>
          ))}
        </div>
      </Card>

      {/* weigh */}
      <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Ico name="scale" size={38} color={phase==='reading'?'var(--ris-green)':'var(--ris-cyan)'} />
        <div style={{ fontFamily: MONO, fontSize: 13, color: stateLine.c, textAlign: 'center', minHeight: 18 }}>{stateLine.txt}</div>
        {phase==='idle' || phase==='reading' ? (
          <button className={'ris-btn '+(phase==='reading'?'':'ris-btn--primary')} style={{ width: '100%', justifyContent: 'center' }} onClick={phase==='reading'?()=>setPhase('idle'):weigh}>
            <Ico name={phase==='reading'?'rotate-ccw':'scale'} size={14} />{phase==='reading'?'Nuova misura':'Pesati ora'}
          </button>
        ) : (
          <button className="ris-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setPhase('idle')}>
            <span style={{ width: 13, height: 13, border: '2px solid var(--ris-cyan)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'risspin .8s linear infinite' }} /> Stop
          </button>
        )}
      </Card>

      {/* result */}
      {phase === 'reading' && <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid rgba(47,228,138,.4)', background: 'var(--ris-green-glow)', borderLeft: '3px solid var(--ris-green)', clipPath: clip(7) }}>
          <Ico name="check" size={14} color="var(--ris-green)" /><span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg1)' }}>✓ Salvato in archivio</span>
        </div>
        <Card style={{ padding: 14, background: 'var(--ris-surface-2)' }}>
          <Lbl style={{ marginBottom: 12 }}>Composizione corporea</Lbl>
          <div style={{ display: 'flex', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--ris-line)' }}>
            {[['Peso', '71.42', 'kg'], ['BMI', '22.5', 'normale'], ['Grasso', '17.0', '%']].map(([l, v, u]) => (
              <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#98a3a5' }}>{l}</div>
                <Stat size={22} style={{ margin: '5px 0 3px' }}>{v}</Stat>
                <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5' }}>{u}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            {SCALE_TILES.map(([k, v]) => (
              <div key={k} style={{ background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', padding: '9px 11px' }}>
                <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 8.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#98a3a5' }}>{k}</div>
                <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: 'var(--ris-fg1)', marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </>}
    </div>
  );
}
Object.assign(window, { BioScale });
