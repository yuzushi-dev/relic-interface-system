// Export.jsx — data export (CSV / JSON formats)
const FORMATS = [
  { id: 'health_csv', icon: 'heart-pulse', name: 'Health CSV', desc: 'All health samples with metadata', size: '2.4 MB', tone: 'var(--ris-cyan)' },
  { id: 'muse_csv', icon: 'brain', name: 'Muse CSV', desc: 'EEG samples per session', size: '14.8 MB', tone: 'var(--ris-magenta)' },
  { id: 'merged', icon: 'git-merge', name: 'Merged Timeline', desc: 'All data merged by timestamp', size: '17.1 MB', tone: 'var(--ris-amber)' },
  { id: 'json', icon: 'braces', name: 'JSON Backup', desc: 'Complete database export', size: '21.3 MB', tone: 'var(--ris-green)' },
];

function BioExport() {
  const [sel, setSel] = React.useState('health_csv');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const f = FORMATS.find(x => x.id === sel);
  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Lbl>Formato Export</Lbl>
      {FORMATS.map(fmt => {
        const on = fmt.id === sel;
        return (
          <Card key={fmt.id} accent={on ? fmt.tone : 'var(--ris-line)'} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', cursor: 'pointer', borderLeft: '2px solid '+(on?fmt.tone:'var(--ris-line)'), background: on ? 'var(--ris-surface-2)' : 'var(--ris-surface-1)' }}>
            <div onClick={() => { setSel(fmt.id); setDone(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <Ico name={fmt.icon} size={22} color={fmt.tone} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ris-fg1)' }}>{fmt.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginTop: 2 }}>{fmt.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg2)' }}>{fmt.size}</div>
                <span style={{ width: 14, height: 14, marginTop: 4, display: 'inline-block', border: '1px solid '+(on?fmt.tone:'var(--ris-line-strong)'), background: on ? fmt.tone : 'transparent' }} />
              </div>
            </div>
          </Card>
        );
      })}

      <div style={{ borderTop: '1px solid var(--ris-line)', paddingTop: 14, marginTop: 4 }}>
        <Card style={{ padding: 12, marginBottom: 12 }}>
          <Lbl>Riepilogo</Lbl>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: MONO, fontSize: 12, color: 'var(--ris-fg2)' }}><span>Formato</span><span style={{ color: f.tone }}>{f.name}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: MONO, fontSize: 12, color: 'var(--ris-fg2)' }}><span>Dimensione</span><span style={{ color: 'var(--ris-fg1)' }}>{f.size}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: MONO, fontSize: 12, color: 'var(--ris-fg2)' }}><span>Periodo</span><span style={{ color: 'var(--ris-fg1)' }}>ultimi 90 giorni</span></div>
        </Card>
        <button className="ris-btn ris-btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDone(true)}>
          <Ico name={done?'check':'upload'} size={14} />{done ? 'Esportato' : 'Esporta '+f.name}
        </button>
        {done && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 12px', border: '1px solid rgba(47,228,138,.4)', background: 'var(--ris-green-glow)', borderLeft: '3px solid var(--ris-green)', clipPath: clip(7) }}>
          <Ico name="check-circle-2" size={15} color="var(--ris-green)" />
          <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg1)' }}>{f.name} salvato in /Download · {f.size}</span>
        </div>}
      </div>
    </div>
  );
}
Object.assign(window, { BioExport });
