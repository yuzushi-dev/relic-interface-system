// Sync.jsx — Health Connect sync (mirrors HealthSyncScreen.kt)
const SYNC_METRICS = [
  ['heart', 'Frequenza cardiaca (FC)', 'var(--ris-red)'],
  ['activity', 'HRV RMSSD', 'var(--ris-violet)'],
  ['heart-pulse', 'FC a riposo', 'var(--ris-red)'],
  ['wind', 'Saturazione O₂ (SpO2)', 'var(--ris-green)'],
  ['lungs', 'Frequenza respiratoria', 'var(--ris-cyan)'],
  ['footprints', 'Passi e distanza', 'var(--ris-cyan)'],
  ['flame', 'Calorie attive e totali', 'var(--ris-orange)'],
  ['moon', 'Sessioni sonno e stadi', 'var(--ris-violet)'],
  ['dumbbell', 'Sessioni allenamento', 'var(--ris-amber)'],
];
const SYNC_HISTORY = [
  { ts: '07 mag, 07:41', status: 'completed', records: 1240 },
  { ts: '07 mag, 06:10', status: 'completed', records: 318 },
  { ts: '06 mag, 22:02', status: 'failed', records: 0, err: 'timeout' },
  { ts: '06 mag, 08:15', status: 'completed', records: 902 },
];

function BioSync() {
  const [granted, setGranted] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [result, setResult] = React.useState(null);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const doSync = () => {
    setSyncing(true); setResult(null);
    setTimeout(() => { setSyncing(false); setResult({ ok: true, n: 1240 }); }, 2200);
  };

  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* availability status */}
      <Card accent="rgba(47,228,138,.4)" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'var(--ris-green-glow)' }}>
        <Ico name="check-circle-2" size={20} color="var(--ris-green)" />
        <div>
          <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ris-fg1)' }}>Health Connect disponibile</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginTop: 2 }}>provider · com.google.android.apps.healthdata</div>
        </div>
      </Card>

      {/* permissions */}
      {!granted ? (
        <Card style={{ padding: 14 }}>
          <Lbl>Permessi richiesti</Lbl>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg2)', marginTop: 8, lineHeight: 1.6 }}>FC, HRV, SpO2, frequenza respiratoria, passi, sonno, esercizio, calorie</div>
          <button className="ris-btn ris-btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setGranted(true)}>
            <Ico name="lock" size={14} />Concedi Permessi
          </button>
        </Card>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 2px' }}>
          <Ico name="check-circle-2" size={18} color="var(--ris-green)" />
          <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 14, fontWeight: 500, color: 'var(--ris-green)' }}>Permessi concessi</span>
        </div>
      )}

      {/* sync button */}
      <button className={'ris-btn '+(granted?'ris-btn--secondary':'')} disabled={!granted || syncing}
        style={{ width: '100%', justifyContent: 'center', opacity: granted?1:.5 }} onClick={doSync}>
        {syncing ? <><span style={{ width: 14, height: 14, border: '2px solid var(--ris-cyan)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'risspin .8s linear infinite' }} />Sincronizzazione…</>
          : <><Ico name="refresh-cw" size={14} />Sincronizza tutti i dati</>}
      </button>
      {result && <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-green)', marginTop: -4 }}>✓ Sincronizzati {result.n} record</div>}

      {/* last sync */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--ris-surface-2)' }}>
        <Ico name="check-circle-2" size={18} color="var(--ris-green)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13, fontWeight: 600, color: 'var(--ris-fg1)' }}>Ultima sync: 07 mag, 07:41</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5' }}>1.240 record</div>
        </div>
      </Card>

      {/* data sources */}
      <div>
        <Lbl style={{ marginBottom: 8 }}>Dati sincronizzati</Lbl>
        <Card style={{ padding: '6px 0' }}>
          {SYNC_METRICS.map(([icon, label, c], i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 14px', borderBottom: i<SYNC_METRICS.length-1?'1px solid var(--ris-line-faint)':'none' }}>
              <Ico name={icon} size={15} color={c} />
              <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ris-fg2)' }}>{label}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* history */}
      <div>
        <Lbl style={{ marginBottom: 8 }}>Cronologia sync</Lbl>
        <Card style={{ padding: '4px 0' }}>
          {SYNC_HISTORY.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: i<SYNC_HISTORY.length-1?'1px solid var(--ris-line-faint)':'none', borderLeft: '2px solid '+(s.status==='completed'?'var(--ris-green)':'var(--ris-red)') }}>
              <Ico name={s.status==='completed'?'check-circle-2':'x-octagon'} size={14} color={s.status==='completed'?'var(--ris-green)':'var(--ris-red)'} />
              <span style={{ flex: 1, fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg2)' }}>{s.ts}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: s.status==='completed'?'#98a3a5':'var(--ris-red)' }}>{s.status==='completed'?s.records+' rec':s.err}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { BioSync });
