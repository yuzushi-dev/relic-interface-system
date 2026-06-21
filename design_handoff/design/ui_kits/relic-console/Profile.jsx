// Profile.jsx — Subject Intelligence / Psyche Profile (facet model + hypotheses)
const FACET_GROUPS = [
  { group: 'Plasticity', facets: [
    { facet: 'Openness', l: 'Concrete', r: 'Exploratory', pos: 0.74, conf: 0.82, obs: 41 },
    { facet: 'Novelty Drive', l: 'Routine', r: 'Seeking', pos: 0.58, conf: 0.61, obs: 22 },
  ]},
  { group: 'Stability', facets: [
    { facet: 'Volatility', l: 'Composed', r: 'Reactive', pos: 0.72, conf: 0.81, obs: 34 },
    { facet: 'Withdrawal', l: 'Resilient', r: 'Anxious', pos: 0.41, conf: 0.52, obs: 19 },
    { facet: 'Industriousness', l: 'Lax', r: 'Driven', pos: 0.88, conf: 0.34, obs: 7 },
  ]},
  { group: 'Affiliation', facets: [
    { facet: 'Compassion', l: 'Detached', r: 'Empathic', pos: 0.63, conf: 0.70, obs: 28 },
    { facet: 'Assertiveness', l: 'Yielding', r: 'Dominant', pos: 0.36, conf: 0.66, obs: 25 },
  ]},
];
const HYPS = [
  { title: 'Achievement masks avoidance', conf: 0.78, label: 'STRONG', tone: 'green', facets: ['Industriousness', 'Withdrawal', 'Volatility'],
    summary: 'High industriousness co-occurs with social withdrawal under stress — productivity appears to function as an avoidance channel rather than pure drive.' },
  { title: 'Compliance under perceived authority', conf: 0.51, label: 'MODERATE', tone: 'amber', facets: ['Assertiveness', 'Compassion'],
    summary: 'Assertiveness collapses sharply when the counterpart is framed as an authority figure; otherwise sits mid-range.' },
  { title: 'Novelty-seeking decay over sessions', conf: 0.29, label: 'WEAK', tone: 'red', facets: ['Novelty Drive', 'Openness'],
    summary: 'Weak signal that exploratory responses taper across longitudinal check-ins. Confidence accumulating.' },
];
const confLevel = c => c >= 0.7 ? 'high' : c >= 0.4 ? 'medium' : 'low';

function FacetRow({ f }) {
  return (
    <div className="ris-facet">
      <div className="ris-facet-head">
        <span className="ris-facet-name">{f.facet}</span>
        <span className="ris-facet-stat">pos <b>{f.pos.toFixed(2)}</b> · conf <b>{f.conf.toFixed(2)}</b> · obs <b>{f.obs}</b></span>
      </div>
      <div className="ris-facet-row">
        <span className="ris-facet-anchor">{f.l}</span>
        <div className="ris-facet-track"><span className="ris-facet-needle" style={{ left: Math.round(f.pos * 100) + '%' }} /></div>
        <span className="ris-facet-anchor">{f.r}</span>
      </div>
      <div className={'ris-conf ris-conf--' + confLevel(f.conf)}><i style={{ width: Math.round(f.conf * 100) + '%' }} /></div>
    </div>
  );
}

function Profile() {
  const [tab, setTab] = React.useState('facets');
  const [open, setOpen] = React.useState(0);
  const total = FACET_GROUPS.flatMap(g => g.facets).length;
  const stats = [['Facets Modeled', total + ' / 18'], ['Observations', '176'], ['Signals', '402'], ['Hypotheses', '3']];

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* model stat bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {stats.map(([k, v], i) => (
          <div key={k} style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', padding: '13px 15px', clipPath: CLIP(9) }}>
            <span style={{ position: 'absolute', left: 0, top: 13, bottom: 13, width: 2, background: i === 3 ? 'var(--ris-magenta)' : 'var(--ris-cyan)' }} />
            <Label style={{ color: '#98a3a5' }}>{k}</Label>
            <div style={{ fontFamily: 'var(--ris-font-display)', fontWeight: 700, fontSize: 26, color: 'var(--ris-fg1)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', border: '1px solid var(--ris-line-strong)' }}>
        {[['facets', '18-Facet Model'], ['overview', 'Hypotheses'], ['evidence', 'Evidence Feed']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, fontFamily: 'var(--ris-font-body)', fontSize: 11.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', padding: '10px', background: tab === id ? 'var(--ris-amber)' : 'transparent', color: tab === id ? 'var(--ris-fg-invert)' : 'var(--ris-fg3)', border: 'none', borderRight: id !== 'evidence' ? '1px solid var(--ris-line)' : 'none', cursor: 'pointer' }}>{label}</button>
        ))}
      </div>

      {tab === 'facets' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, alignItems: 'start' }}>
          <Panel title="Dialectical Facet Model" right={<Chip tone="cyan" dot>SCANNING</Chip>}>
            {FACET_GROUPS.map(g => (
              <div key={g.group} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ris-amber)', borderLeft: '2px solid var(--ris-amber)', paddingLeft: 8, marginBottom: 4 }}>{g.group}</div>
                {g.facets.map(f => <FacetRow key={f.facet} f={f} />)}
              </div>
            ))}
          </Panel>
          <Panel title="Top Traits">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {['Conscientious', 'Stress-avoidant', 'Empathic', 'Deferential', 'Exploratory'].map(t => (
                <span key={t} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, letterSpacing: '.05em', color: 'var(--ris-fg2)', border: '1px solid var(--ris-line-strong)', background: 'var(--ris-surface-2)', padding: '3px 8px' }}>{t}</span>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg4)', marginBottom: 8 }}>Active Goals</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, margin: 0, padding: 0 }}>
              {['Maintain weekly check-in cadence', 'Reduce avoidance under deadline stress', 'Re-engage dormant social ties'].map(goal => (
                <li key={goal} style={{ position: 'relative', paddingLeft: 18, fontFamily: 'var(--ris-font-body)', fontSize: 13, color: 'var(--ris-fg2)', lineHeight: 1.45 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--ris-cyan)', fontFamily: 'var(--ris-font-mono)' }}>→</span>{goal}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {tab === 'overview' && (
        <Panel title="Cross-Facet Hypotheses" right={<Label>3 ACTIVE</Label>} bodyStyle={{ padding: 0 }}>
          {HYPS.map((h, i) => {
            const isOpen = open === i;
            return (
              <div key={h.title} style={{ borderBottom: '1px solid var(--ris-line-faint)' }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 14, fontWeight: 600, color: 'var(--ris-fg1)' }}>{h.title}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Chip tone={h.tone}>{h.conf.toFixed(2)} {h.label}</Chip>
                    <span style={{ color: 'var(--ris-fg3)', fontFamily: 'var(--ris-font-mono)', fontSize: 12 }}>{isOpen ? '▾' : '▸'}</span>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 16px 16px' }}>
                    <p style={{ margin: '0 0 10px', fontFamily: 'var(--ris-font-body)', fontSize: 13, color: 'var(--ris-fg2)', lineHeight: 1.6 }}>{h.summary}</p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {h.facets.map(f => <span key={f} style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: '#98a3a5', border: '1px solid var(--ris-line-strong)', padding: '2px 7px' }}>{f}</span>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Panel>
      )}

      {tab === 'evidence' && (
        <Panel title="Evidence Transcript Feed" right={<span className="ris-stream" data-stream="evidence">EVIDENCE</span>} bodyStyle={{ padding: 0 }}>
          {[
            { id: 'EV-3391', ch: 'check-in', ts: '07:38:02', txt: '"I just kept working through the weekend, easier than calling anyone back."' },
            { id: 'EV-3388', ch: 'gumi', ts: '07:31:44', txt: '"You said the deadline felt fine — was that true, or the version you tell people?"' },
            { id: 'EV-3380', ch: 'check-in', ts: '07:22:10', txt: '"New project, new tools. I like not knowing how it\'ll go yet."' },
          ].map(e => (
            <div key={e.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--ris-line-faint)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>
                <span style={{ color: e.ch === 'gumi' ? 'var(--ris-magenta)' : 'var(--ris-cyan)', fontWeight: 500 }}>{e.id}</span>
                <span>{e.ch} · {e.ts}</span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--ris-font-body)', fontSize: 13.5, color: 'var(--ris-fg1)', lineHeight: 1.55, borderLeft: '2px solid ' + (e.ch === 'gumi' ? 'var(--ris-magenta)' : 'var(--ris-cyan)'), paddingLeft: 11, background: 'var(--ris-surface-2)', padding: '8px 11px' }}>{e.txt}</p>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}
Object.assign(window, { Profile });
