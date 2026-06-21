// Chronicle.jsx — Governed audit: Events / Decisions / Snapshots sub-sections
const EVENTS = [
  { id: 'chr_a91f0023', cls: 'checkin',          stream: 'gumi',       onto: 'gumi initiative', init: 'gumi',       ts: '07:42:01', risk: 'none',   decision: 'delivered', txt: 'Scheduled weekly check-in dispatched to subject channel.', flags: [] },
  { id: 'chr_a91f0019', cls: 'user_message',     stream: 'evidence',   onto: 'observed signal', init: 'subject',    ts: '07:38:02', risk: 'none',   decision: 'delivered', txt: '"I just kept working through the weekend, easier than calling anyone back."', flags: ['user response'] },
  { id: 'chr_a91f0014', cls: 'system',           stream: 'runtime',    onto: 'model recalibration', init: 'runtime', ts: '07:36:55', risk: 'none',   decision: 'delivered', txt: 'Facet "Withdrawal" confidence updated 0.48 → 0.52 from 3 new signals.', flags: [] },
  { id: 'chr_a91f0011', cls: 'researcher_action',stream: 'correction', onto: 'manual correction', init: 'researcher',ts: '07:31:20', risk: 'low',    decision: 'delivered', txt: 'Researcher overrode inferred goal — flagged as speculative.', flags: ['correction'] },
  { id: 'chr_a91f0008', cls: 'gumi_initiative',  stream: 'blocked',    onto: 'boundary probe',  init: 'gumi',       ts: '07:24:10', risk: 'high',   decision: 'blocked',   txt: '', flags: ['boundary risk'] },
  { id: 'chr_a91f0004', cls: 'inference',        stream: 'inference',  onto: 'hypothesis formed', init: 'runtime',  ts: '07:18:47', risk: 'medium', decision: 'pending',   txt: 'New cross-facet hypothesis "Achievement masks avoidance" queued for review.', flags: [] },
];
const DECISIONS = [
  { id: 'dec_5510', ref: 'chr_a91f0008', verdict: 'blocked',  actor: 'safety-policy', policy: 'BOUNDARY.no_probe', ts: '07:24:11', risk: 'high',   rationale: 'Gumi initiative targeted an opted-out topic (family conflict). Auto-blocked before delivery.' },
  { id: 'dec_5507', ref: 'chr_a91f0004', verdict: 'pending',  actor: 'researcher',    policy: 'REVIEW.inference', ts: '07:18:48', risk: 'medium', rationale: 'New hypothesis exceeds auto-approve confidence floor; held for researcher sign-off.' },
  { id: 'dec_5503', ref: 'chr_a91f0011', verdict: 'approved', actor: 'researcher',    policy: 'OVERRIDE.manual',  ts: '07:31:21', risk: 'low',    rationale: 'Researcher correction accepted; inferred goal demoted to speculative.' },
  { id: 'dec_5499', ref: 'chr_a91f0023', verdict: 'approved', actor: 'auto-policy',   policy: 'CADENCE.weekly',   ts: '07:42:02', risk: 'none',   rationale: 'Scheduled check-in within cadence window and boundary set. Auto-approved.' },
];
const SNAPSHOTS = [
  { id: 'snap_v14', ver: 14, ts: '07:42:05', facets: 14, conf: 0.74, drift: 0.11, trigger: 'recalibration', delta: 'Withdrawal +0.04 · conf +0.03', note: 'Most recent committed model state.' },
  { id: 'snap_v13', ver: 13, ts: '06:10:42', facets: 14, conf: 0.71, drift: 0.09, trigger: 'evidence batch', delta: 'Industriousness obs 6 → 7', note: 'Pre-check-in baseline.' },
  { id: 'snap_v12', ver: 12, ts: '2026-05-29', facets: 13, conf: 0.68, drift: 0.14, trigger: 'researcher edit', delta: 'Compassion anchor relabeled', note: 'Manual correction applied.' },
  { id: 'snap_v11', ver: 11, ts: '2026-05-22', facets: 12, conf: 0.63, drift: 0.18, trigger: 'weekly rollup', delta: 'Assertiveness −0.06', note: 'Weekly consolidation.' },
];
const RISK_LABEL = { none: 'None', low: 'Low', medium: 'Medium', high: 'High' };
const VERDICT_TONE = { approved: 'green', blocked: 'red', pending: 'amber' };

const SUBTABS = [['events', 'Events'], ['decisions', 'Decisions'], ['snapshots', 'Snapshots']];

function ChronEvents() {
  const [filter, setFilter] = React.useState('all');
  const classes = ['all', ...Array.from(new Set(EVENTS.map(e => e.cls)))];
  const rows = filter === 'all' ? EVENTS : EVENTS.filter(e => e.cls === filter);
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line-strong)', padding: '8px 12px', marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-fg4)', marginRight: 6 }}>Class</span>
        {classes.map(c => {
          const on = filter === c;
          return <button key={c} onClick={() => setFilter(c)} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, padding: '5px 11px', textTransform: 'uppercase', letterSpacing: '.04em', background: on ? 'var(--ris-amber)' : 'transparent', color: on ? 'var(--ris-fg-invert)' : 'var(--ris-fg3)', border: '1px solid ' + (on ? 'var(--ris-amber)' : 'transparent'), cursor: 'pointer' }}>{c.replace(/_/g, ' ')}</button>;
        })}
      </div>
      <Panel title={'Event Log · ' + rows.length} right={<Chip tone="green" dot>LIVE</Chip>} bodyStyle={{ padding: 0 }} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflow: 'auto' }}>
          {rows.map(e => (
            <div key={e.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--ris-line-faint)', borderLeft: '2px solid var(--ris-stream-' + e.stream + ', var(--ris-line))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <span className="ris-stream" data-stream={e.stream}>{e.onto}</span>
                <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: '#98a3a5', border: '1px solid var(--ris-line-strong)', padding: '2px 6px' }}>{e.init}</span>
                <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ris-fg3)', border: '1px solid var(--ris-line)', padding: '2px 6px' }}>{e.cls.replace(/_/g, ' ')}</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}><Icon name="clock" size={11} color="#98a3a5" />{e.ts}</span>
              </div>
              <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12.5, color: e.decision === 'blocked' ? 'var(--ris-fg4)' : 'var(--ris-fg1)', lineHeight: 1.55, background: 'var(--ris-surface-2)', borderLeft: '2px solid ' + (e.decision === 'blocked' ? 'var(--ris-red-line)' : 'var(--ris-cyan-line)'), padding: '9px 12px', fontStyle: e.txt ? 'normal' : 'italic' }}>
                {e.txt || '[ Blocked by safety policy ]'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 9 }}>
                {e.risk !== 'none' && <span className="ris-risk" data-risk={e.risk}>Risk: {RISK_LABEL[e.risk]}</span>}
                {e.flags.map(f => <span key={f} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: f.includes('risk') ? 'var(--ris-red)' : '#98a3a5', border: '1px solid ' + (f.includes('risk') ? 'var(--ris-red-line)' : 'var(--ris-line-strong)'), padding: '2px 6px' }}>{f}</span>)}
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 9.5, color: 'var(--ris-fg4)' }}>ID: {e.id.slice(4, 16)}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function ChronDecisions() {
  return (
    <Panel title={'Decision History · ' + DECISIONS.length} right={<Label>GOVERNANCE</Label>} bodyStyle={{ padding: 0 }} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflow: 'auto' }}>
        {DECISIONS.map(d => (
          <div key={d.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--ris-line-faint)', borderLeft: '2px solid var(--ris-' + (d.verdict === 'approved' ? 'green' : d.verdict === 'blocked' ? 'red' : 'amber') + '-line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <Chip tone={VERDICT_TONE[d.verdict]} dot>{d.verdict}</Chip>
              <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: d.actor === 'researcher' ? 'var(--ris-cyan)' : '#98a3a5', border: '1px solid var(--ris-line-strong)', padding: '2px 6px' }}>{d.actor}</span>
              <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: 'var(--ris-violet)' }}>{d.policy}</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}><Icon name="clock" size={11} color="#98a3a5" />{d.ts}</span>
            </div>
            <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13.5, color: 'var(--ris-fg1)', lineHeight: 1.5 }}>{d.rationale}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 9 }}>
              {d.risk !== 'none' && <span className="ris-risk" data-risk={d.risk}>Risk: {RISK_LABEL[d.risk]}</span>}
              <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9.5, color: 'var(--ris-fg4)' }}>→ event {d.ref.slice(4)}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 9.5, color: 'var(--ris-fg4)' }}>ID: {d.id}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ChronSnapshots() {
  const [sel, setSel] = React.useState('snap_v14');
  return (
    <Panel title={'State Snapshots · ' + SNAPSHOTS.length} right={<Label>MODEL HISTORY</Label>} bodyStyle={{ padding: 0 }} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflow: 'auto' }}>
        {SNAPSHOTS.map((s, i) => {
          const on = s.id === sel;
          return (
            <button key={s.id} onClick={() => setSel(s.id)} style={{ width: '100%', textAlign: 'left', display: 'block', padding: '14px 16px', borderBottom: '1px solid var(--ris-line-faint)', borderLeft: '2px solid ' + (on ? 'var(--ris-cyan)' : 'transparent'), background: on ? 'var(--ris-cyan-glow)' : 'transparent', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 15, fontWeight: 700, color: on ? 'var(--ris-cyan)' : 'var(--ris-fg1)', letterSpacing: '.02em' }}>v{s.ver}</span>
                {i === 0 && <Chip tone="green" dot>CURRENT</Chip>}
                <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: '#98a3a5', border: '1px solid var(--ris-line-strong)', padding: '2px 6px' }}>{s.trigger}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>{s.ts}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                {[['facets', s.facets], ['mean conf', s.conf.toFixed(2)], ['drift', s.drift.toFixed(2)]].map(([k, v]) => (
                  <div key={k}>
                    <span style={{ display: 'block', fontFamily: 'var(--ris-font-mono)', fontSize: 8.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-fg4)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 17, fontWeight: 700, color: k === 'drift' && v > 0.15 ? 'var(--ris-amber)' : 'var(--ris-fg1)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ flex: 1, alignSelf: 'center' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--ris-font-mono)', fontSize: 8.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-fg4)' }}>Δ change</span>
                  <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11.5, color: 'var(--ris-cyan)' }}>{s.delta}</span>
                </div>
              </div>
              {on && <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--ris-line)', fontFamily: 'var(--ris-font-body)', fontSize: 12.5, color: 'var(--ris-fg2)' }}>{s.note}</div>}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function Chronicle() {
  const [tab, setTab] = React.useState('events');
  const delivered = EVENTS.filter(e => e.decision === 'delivered').length;
  const blocked = EVENTS.filter(e => e.decision === 'blocked').length;
  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14, height: 'calc(100% - 36px)' }}>
      {/* header meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12, color: '#98a3a5' }}>{EVENTS.length} EVENTS</span>
        <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12, color: 'var(--ris-green)' }}>● {delivered} DELIVERED</span>
        <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12, color: 'var(--ris-red)' }}>✕ {blocked} BLOCKED</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: '#98a3a5' }}>SUBJ-0104</span>
      </div>

      {/* sub-section tabs */}
      <div style={{ display: 'flex', border: '1px solid var(--ris-line-strong)' }}>
        {SUBTABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, fontFamily: 'var(--ris-font-body)', fontSize: 11.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', padding: '10px', background: tab === id ? 'var(--ris-amber)' : 'transparent', color: tab === id ? 'var(--ris-fg-invert)' : 'var(--ris-fg3)', border: 'none', borderRight: id !== 'snapshots' ? '1px solid var(--ris-line)' : 'none', cursor: 'pointer' }}>{label}</button>
        ))}
      </div>

      {tab === 'events' && <ChronEvents />}
      {tab === 'decisions' && <ChronDecisions />}
      {tab === 'snapshots' && <ChronSnapshots />}
    </div>
  );
}
Object.assign(window, { Chronicle, EVENTS, DECISIONS, SNAPSHOTS, RISK_LABEL, VERDICT_TONE });
