// Inspector.jsx — Health Inspector (Metrics / Sleep tabs)
const METRICS = [
  { type: 'heart_rate', icon: 'heart', value: 62, unit: 'bpm', records: 1840, ts: 'mag 07, 07:38' },
  { type: 'hrv_rmssd', icon: 'activity', value: 48, unit: 'ms', records: 420, ts: 'mag 07, 07:38' },
  { type: 'oxygen_saturation', icon: 'wind', value: 97, unit: '%', records: 312, ts: 'mag 07, 07:30' },
  { type: 'steps', icon: 'footprints', value: 8214, unit: 'steps', records: 96, ts: 'mag 07, 07:40' },
  { type: 'skin_temperature', icon: 'thermometer', value: 33, unit: '°C', records: 288, ts: 'mag 07, 06:55' },
  { type: 'stress', icon: 'zap', value: 34, unit: '/100', records: 144, ts: 'mag 07, 07:20' },
  { type: 'active_calories', icon: 'flame', value: 486, unit: 'kcal', records: 96, ts: 'mag 07, 07:40' },
  { type: 'weight', icon: 'scale', value: 71, unit: 'kg', records: 22, ts: 'mag 06, 08:02' },
];
const SLEEP = [
  { date: 'mag 07, 23:40', title: 'Sonno notturno', h: 7, m: 12 },
  { date: 'mag 06, 23:55', title: 'Sonno notturno', h: 6, m: 48 },
  { date: 'mag 05, 00:20', title: 'Sonno notturno', h: 7, m: 31 },
];
function fmtMetric(t){ return t.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase()); }

function BioInspector() {
  const [tab, setTab] = React.useState(0);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)', flex: '0 0 auto' }}>
        {[['Metrics','analytics'],['Sleep','moon']].map(([l], i) => {
          const on = tab === i;
          return <button key={l} onClick={() => setTab(i)} style={{ position: 'relative', flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--ris-font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: on ? 'var(--ris-cyan)' : 'var(--ris-fg3)' }}>
            {l}{on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--ris-cyan)' }} />}
          </button>;
        })}
      </div>
      <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tab === 0 ? METRICS.map(m => (
          <Card key={m.type} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px' }}>
            <Ico name={m.icon} size={24} color="var(--ris-cyan)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--ris-fg1)' }}>{fmtMetric(m.type)}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginTop: 2 }}>{m.ts}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, justifyContent: 'flex-end' }}><Stat size={20}>{m.value}</Stat><span style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginBottom: 2 }}>{m.unit}</span></div>
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: '#98a3a5', marginTop: 2 }}>{m.records} records</div>
            </div>
          </Card>
        )) : SLEEP.map((s, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderLeft: '2px solid var(--ris-violet)' }}>
            <Ico name="moon" size={24} color="var(--ris-violet)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--ris-fg1)' }}>{s.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginTop: 2 }}>{s.title}</div>
            </div>
            <div style={{ textAlign: 'right' }}><Stat size={18}>{s.h}h {s.m}m</Stat><Lbl style={{ fontSize: 8, marginTop: 2 }}>durata</Lbl></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { BioInspector });
