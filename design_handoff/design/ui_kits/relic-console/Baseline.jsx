// Baseline.jsx — Subject Baseline Profile (fields table + risk flags + batteries)
const BASELINE_FIELDS = [
  { name: 'preferred_name', value: 'Subject 0104', origin: 'subject-stated', section: 'Self-Report' },
  { name: 'pronouns', value: 'they / them', origin: 'subject-stated', section: 'Self-Report' },
  { name: 'primary_concern', value: 'Work-driven social withdrawal', origin: 'subject-stated', section: 'Self-Report' },
  { name: 'engagement_cadence', value: 'Weekly', origin: 'researcher-coded', section: 'Researcher-Coded' },
  { name: 'rapport_index', value: '0.64', origin: 'researcher-coded', section: 'Researcher-Coded' },
  { name: 'dominant_affect', value: 'Guarded / composed', origin: 'system-inferred', section: 'System-Inferred' },
  { name: 'response_latency', value: 'High under deadline framing', origin: 'system-inferred', section: 'System-Inferred' },
  { name: 'preferred_modality', value: 'Async text', origin: 'subject-stated', section: 'Interaction Preferences' },
  { name: 'directness', value: 'Prefers indirect prompts', origin: 'researcher-coded', section: 'Interaction Preferences' },
  { name: 'reassurance_need', value: 'Low–moderate', origin: 'system-inferred', section: 'Relational Expectations' },
  { name: 'authority_response', value: 'Defers, then complies', origin: 'system-inferred', section: 'Relational Expectations' },
  { name: 'hard_limits', value: 'No crisis role-play', origin: 'subject-stated', section: 'Boundaries' },
  { name: 'opt_out_categories', value: 'medication, family conflict', origin: 'subject-stated', section: 'Boundaries' },
];
const ORIGIN_TONE = { 'subject-stated': 'green', 'researcher-coded': 'cyan', 'system-inferred': '' };
const SECTIONS = ['Self-Report', 'Researcher-Coded', 'System-Inferred', 'Interaction Preferences', 'Relational Expectations', 'Boundaries'];

const TIPI = [['Extraversion', 2.5], ['Agreeableness', 5.2], ['Conscientiousness', 6.1], ['Emotional Stability', 3.4], ['Openness', 5.8]];
const ECRRS = [['Anxiety', 4.6], ['Avoidance', 5.3]];
const PROJECT = [['warmth target', 6.4], ['challenge tolerance', 4.1], ['disclosure depth', 5.0]];
const RISK_FLAGS = [['avoidant_coping', 'high'], ['deadline_stress', 'medium']];

function Baseline() {
  const [section, setSection] = React.useState('All');
  const rows = section === 'All' ? BASELINE_FIELDS : BASELINE_FIELDS.filter(f => f.section === section);
  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* header */}
      <div style={{ borderBottom: '1px solid var(--ris-line)', paddingBottom: 14 }}>
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ris-amber)', marginBottom: 6 }}>Baseline Profile · Version 3</div>
        <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '.02em', color: 'var(--ris-fg1)' }}>SUBJ-0104</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10, fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: '#98a3a5' }}>
          <span>Method <Chip tone="amber">structured-intake</Chip></span>
          <span>·</span><span>Created 2026-04-18</span>
        </div>
      </div>

      {/* fields table */}
      <Panel title="Baseline Profile Fields" right={<Label>{rows.length} FIELDS</Label>} bodyStyle={{ padding: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--ris-line)' }}>
          {['All', ...SECTIONS].map(s => {
            const on = section === s;
            return <button key={s} onClick={() => setSection(s)} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, padding: '4px 9px', letterSpacing: '.04em', textTransform: 'uppercase', background: on ? 'var(--ris-surface-3)' : 'transparent', color: on ? 'var(--ris-cyan)' : 'var(--ris-fg3)', border: '1px solid ' + (on ? 'var(--ris-cyan-line)' : 'var(--ris-line)'), cursor: 'pointer' }}>{s}</button>;
          })}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Field', 'Value', 'Origin', 'Section'].map(h => <th key={h} style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg4)', textAlign: 'left', padding: '9px 14px', borderBottom: '2px solid var(--ris-line-strong)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(f => (
              <tr key={f.name} style={{ borderBottom: '1px solid var(--ris-line-faint)' }}>
                <td style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11.5, color: '#98a3a5', padding: '10px 14px', textTransform: 'capitalize' }}>{f.name.replace(/_/g, ' ')}</td>
                <td style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13.5, fontWeight: 500, color: 'var(--ris-fg1)', padding: '10px 14px' }}>{f.value}</td>
                <td style={{ padding: '10px 14px' }}><Chip tone={ORIGIN_TONE[f.origin]}>{f.origin}</Chip></td>
                <td style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10.5, color: 'var(--ris-fg3)', padding: '10px 14px' }}>{f.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* risk + version */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Panel title="Risk Flags" right={<Chip tone="red" dot>{RISK_FLAGS.length}</Chip>} bodyStyle={{ padding: 0 }}>
          {RISK_FLAGS.map(([cat, sev]) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', borderBottom: '1px solid var(--ris-line-faint)' }}>
              <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12.5, color: 'var(--ris-fg1)' }}>{cat.replace(/_/g, ' ')}</span>
              <span className="ris-risk" data-risk={sev}>{sev}</span>
            </div>
          ))}
        </Panel>
        <Panel title="Version Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><Label style={{ color: '#98a3a5' }}>Baseline Version</Label><div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ris-fg1)', marginTop: 5 }}>v3</div></div>
            <div><Label style={{ color: '#98a3a5' }}>Created</Label><div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ris-fg1)', marginTop: 5 }}>04·18</div></div>
            <div><Label style={{ color: '#98a3a5' }}>Fields</Label><div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ris-fg1)', marginTop: 5 }}>{BASELINE_FIELDS.length}</div></div>
            <div><Label style={{ color: '#98a3a5' }}>Provenance</Label><div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ris-green)', marginTop: 5 }}>OK</div></div>
          </div>
        </Panel>
      </div>

      {/* battery scores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <Panel title="TIPI · Big Five">{TIPI.map(([k, v]) => <Calibration key={k} label={k} value={v} max={7} color="var(--ris-cyan)" />)}</Panel>
        <Panel title="ECR-RS · Attachment">{ECRRS.map(([k, v]) => <Calibration key={k} label={k} value={v} max={7} color="var(--ris-amber)" />)}</Panel>
        <Panel title="Project Calibration">{PROJECT.map(([k, v]) => <Calibration key={k} label={k} value={v} max={10} color="var(--ris-magenta)" />)}</Panel>
      </div>
    </div>
  );
}
Object.assign(window, { Baseline });
