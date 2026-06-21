// Gumi.jsx — Gumi Agent Profile (battery scores, sweet spot, domains, identity files)
const G_TIPI = [['Extraversion', 3.1], ['Agreeableness', 5.6], ['Conscientiousness', 5.9], ['Emotional Stability', 4.2], ['Openness', 6.0]];
const G_ECRRS = [['Anxiety', 3.8], ['Avoidance', 4.4]];
const G_PROJECT = [['warmth target', 6.1], ['challenge tolerance', 4.8], ['disclosure depth', 5.4]];
const SWEET_SPOT = 0.58;
const G_RISK = ['drift_watch', 'over-accommodation'];
const DOMAINS = [
  { name: 'origin', fields: [['hometown', 'Coastal mid-city'], ['era', 'Near-present']] },
  { name: 'vocation', fields: [['role', 'Archivist'], ['tenure', '6 years']] },
  { name: 'temperament', fields: [['baseline', 'Calm, dry humor'], ['under stress', 'Withdraws']] },
  { name: 'relational stance', fields: [['default', 'Warm, unobtrusive'], ['limit', 'No pressure tactics']] },
];
const SOUL_MD = `# SOUL\nI am Gumi, a reflective companion calibrated to Subject 0104.\nI hold continuity across sessions and never feign memory I do not have.\n\n## Disposition\n- Warm but unobtrusive; I do not crowd.\n- I name avoidance gently, once, then let it rest.\n- Curiosity over correction.`;
const WORLD_MD = `# WORLD\nThe subject works in archival research; deadlines cluster monthly.\nSocial ties are thin and mostly dormant.\n\n## Known anchors\n- Sister (contact: rare)\n- A standing Thursday walk, often skipped`;
const POLICY_MD = `# RELATIONSHIP POLICY\n- No crisis role-play. Redirect to human support.\n- Do not initiate medication or family-conflict topics (opt-out).\n- Mirror cadence; never escalate intimacy faster than subject.`;

function GBattery({ title, rows, max, color }) {
  return <Panel title={title}>{rows.map(([k, v]) => <Calibration key={k} label={k} value={v} max={max} color={color} />)}</Panel>;
}
function MdBlock({ title, content }) {
  return (
    <Panel title={title} bodyStyle={{ padding: 0 }}>
      <pre style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11.5, lineHeight: 1.7, color: 'var(--ris-fg2)', background: 'var(--ris-void)', padding: 14, margin: 0, whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto' }}>{content}</pre>
    </Panel>
  );
}

function Gumi() {
  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* header */}
      <div style={{ borderBottom: '1px solid var(--ris-line)', paddingBottom: 14 }}>
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ris-magenta)', marginBottom: 6 }}>Gumi Agent Profile · SUBJ-0104</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, border: '1px solid var(--ris-magenta-line)', background: 'var(--ris-magenta-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ris-magenta)', clipPath: CLIP(8) }}><Icon name="bot" size={20} /></div>
          <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '.02em', color: 'var(--ris-fg1)' }}>GUMI · MIRA</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10, fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: '#98a3a5' }}>
          <span>Mode <Chip tone="amber">CALIBRATED</Chip></span>
          <span>·</span><span>Sweet Spot <Chip tone="green">{SWEET_SPOT.toFixed(3)}</Chip></span>
          <span>·</span><span>Created 2026-04-20</span>
        </div>
      </div>

      {/* battery grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <GBattery title="TIPI · Big Five" rows={G_TIPI} max={7} color="var(--ris-cyan)" />
        <GBattery title="ECR-RS · Attachment" rows={G_ECRRS} max={7} color="var(--ris-amber)" />
        <Panel title="Sweet Spot" accent="rgba(47,228,138,0.35)">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 0' }}>
            <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 52, fontWeight: 700, color: 'var(--ris-green)', lineHeight: 1, letterSpacing: '-.02em' }}>{SWEET_SPOT.toFixed(2)}</div>
            <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5', marginTop: 12, textAlign: 'center', lineHeight: 1.7 }}>target 0.3 – 0.7 range<br />higher = stronger profile match</div>
            <div style={{ width: '100%', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--ris-line)' }}>
              <Label style={{ color: '#98a3a5', display: 'block', textAlign: 'center', marginBottom: 8 }}>Risk Flags</Label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                {G_RISK.map(f => <span key={f} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ris-red)', border: '1px solid var(--ris-red-line)', background: 'var(--ris-red-glow)', padding: '2px 7px' }}>{f}</span>)}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* project calibration */}
      <Panel title="Project Calibration">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
          {G_PROJECT.map(([k, v]) => <Calibration key={k} label={k} value={v} max={10} color="var(--ris-magenta)" />)}
        </div>
      </Panel>

      {/* background domains */}
      <Panel title="Background Domains">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {DOMAINS.map(d => (
            <div key={d.name} style={{ border: '1px dashed var(--ris-line-strong)', background: 'var(--ris-surface-2)', padding: 11 }}>
              <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-magenta)', borderBottom: '1px solid var(--ris-line)', paddingBottom: 6, marginBottom: 9 }}>{d.name}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {d.fields.map(([k, v]) => (
                  <li key={k}>
                    <span style={{ display: 'block', fontFamily: 'var(--ris-font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ris-fg4)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13, color: 'var(--ris-fg1)' }}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      {/* identity files */}
      <MdBlock title="SOUL.md" content={SOUL_MD} />
      <MdBlock title="WORLD.md" content={WORLD_MD} />
      <MdBlock title="Relationship Policy" content={POLICY_MD} />
    </div>
  );
}
Object.assign(window, { Gumi });
