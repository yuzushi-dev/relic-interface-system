// MobileApp.jsx — Relic Researcher Workbench, mobile surface
// Phone screens: Subjects list · Subject detail (facets) · Chronicle · Gumi
// Reuses Icon / Chip / Label / Calibration / CLIP from Primitives.jsx
const { useState: useMS } = React;

const M_SUBJECTS = [
  { id: 'SUBJ-0091', name: 'Subject 0091', stream: 'approved', risk: 'none',   last: '2m',  conf: 0.81 },
  { id: 'SUBJ-0104', name: 'Subject 0104', stream: 'pending',  risk: 'medium', last: '14m', conf: 0.64 },
  { id: 'SUBJ-0117', name: 'Subject 0117', stream: 'blocked',  risk: 'high',   last: '38m', conf: 0.42 },
  { id: 'SUBJ-0122', name: 'Subject 0122', stream: 'gumi',     risk: 'low',    last: '1h',  conf: 0.73 },
];
const M_FACETS = [
  { facet: 'Volatility', l: 'Composed', r: 'Reactive', pos: 0.72, conf: 0.81 },
  { facet: 'Withdrawal', l: 'Resilient', r: 'Anxious', pos: 0.41, conf: 0.52 },
  { facet: 'Industriousness', l: 'Lax', r: 'Driven', pos: 0.88, conf: 0.34 },
  { facet: 'Compassion', l: 'Detached', r: 'Empathic', pos: 0.63, conf: 0.70 },
];
const M_EVENTS = [
  { onto: 'gumi initiative', stream: 'gumi', init: 'gumi', ts: '07:42', risk: 'none', txt: 'Weekly check-in dispatched.' },
  { onto: 'observed signal', stream: 'evidence', init: 'subject', ts: '07:38', risk: 'none', txt: '"Kept working through the weekend, easier than calling back."' },
  { onto: 'boundary probe', stream: 'blocked', init: 'gumi', ts: '07:24', risk: 'high', txt: '[ Blocked by safety policy ]' },
  { onto: 'hypothesis formed', stream: 'inference', init: 'runtime', ts: '07:18', risk: 'medium', txt: 'New cross-facet hypothesis queued for review.' },
];
const M_DECISIONS = [
  { verdict: 'blocked',  actor: 'safety-policy', policy: 'BOUNDARY.no_probe', ts: '07:24', risk: 'high',   rationale: 'Gumi targeted an opted-out topic. Auto-blocked before delivery.' },
  { verdict: 'pending',  actor: 'researcher',    policy: 'REVIEW.inference', ts: '07:18', risk: 'medium', rationale: 'Hypothesis exceeds auto-approve floor; held for sign-off.' },
  { verdict: 'approved', actor: 'researcher',    policy: 'OVERRIDE.manual',  ts: '07:31', risk: 'low',    rationale: 'Correction accepted; inferred goal demoted to speculative.' },
  { verdict: 'approved', actor: 'auto-policy',   policy: 'CADENCE.weekly',   ts: '07:42', risk: 'none',   rationale: 'Check-in within cadence + boundary set. Auto-approved.' },
];
const M_SNAPSHOTS = [
  { ver: 14, ts: '07:42', conf: 0.74, drift: 0.11, trigger: 'recalibration', delta: 'Withdrawal +0.04 · conf +0.03', cur: true },
  { ver: 13, ts: '06:10', conf: 0.71, drift: 0.09, trigger: 'evidence batch', delta: 'Industriousness obs 6 → 7' },
  { ver: 12, ts: '05-29', conf: 0.68, drift: 0.14, trigger: 'researcher edit', delta: 'Compassion anchor relabeled' },
  { ver: 11, ts: '05-22', conf: 0.63, drift: 0.18, trigger: 'weekly rollup', delta: 'Assertiveness −0.06' },
];
// Baseline (mobile) — fields grouped by section + risk + batteries
const M_BASELINE = [
  { section: 'Self-Report', fields: [['preferred name', 'Subject 0104', 'subject-stated'], ['primary concern', 'Work-driven withdrawal', 'subject-stated']] },
  { section: 'Researcher-Coded', fields: [['cadence', 'Weekly', 'researcher-coded'], ['rapport index', '0.64', 'researcher-coded']] },
  { section: 'System-Inferred', fields: [['dominant affect', 'Guarded / composed', 'system-inferred'], ['authority response', 'Defers, then complies', 'system-inferred']] },
  { section: 'Boundaries', fields: [['hard limits', 'No crisis role-play', 'subject-stated'], ['opt-out', 'medication, family', 'subject-stated']] },
];
const M_BASE_RISK = [['avoidant coping', 'high'], ['deadline stress', 'medium']];
const M_BASE_TIPI = [['Extraversion', 2.5], ['Conscientiousness', 6.1], ['Emotional Stability', 3.4], ['Openness', 5.8]];
const ORIGIN_TONE = { 'subject-stated': 'green', 'researcher-coded': 'cyan', 'system-inferred': '' };
const confLvl = c => c >= 0.7 ? 'high' : c >= 0.4 ? 'medium' : 'low';
const STREAM_TONE = { approved: 'green', pending: 'amber', blocked: 'red', gumi: 'magenta' };
const M_VERDICT_TONE = { approved: 'green', blocked: 'red', pending: 'amber' };

// ---- Status bar (RIS-styled, not iOS) ----
function MStatus() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', height: 30, background: 'var(--ris-void)', borderBottom: '1px solid var(--ris-line-faint)', fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: 'var(--ris-fg2)', flex: '0 0 30px' }}>
      <span style={{ letterSpacing: '.04em' }}>07:42</span>
      <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: 'var(--ris-amber)' }}>RELIC</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Icon name="signal" size={12} color="var(--ris-fg2)" /><Icon name="wifi" size={12} color="var(--ris-fg2)" /><Icon name="battery-full" size={14} color="var(--ris-green)" />
      </span>
    </div>
  );
}

// ---- Top app bar ----
function MTopBar({ title, sub, onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)', flex: '0 0 auto' }}>
      {onBack && <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--ris-line-strong)', color: 'var(--ris-cyan)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', clipPath: CLIP(6) }}><Icon name="chevron-left" size={18} /></button>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', color: 'var(--ris-fg1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {sub && <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5', marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// ---- Bottom tab bar (mobile nav) ----
const M_TABS = [
  { id: 'subjects', icon: 'users', label: 'Subjects' },
  { id: 'profile', icon: 'brain-circuit', label: 'Subject' },
  { id: 'chronicle', icon: 'history', label: 'Chronicle' },
  { id: 'gumi', icon: 'bot', label: 'Gumi' },
];
function MTabBar({ active, onNav }) {
  return (
    <div style={{ display: 'flex', borderTop: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)', flex: '0 0 auto' }}>
      {M_TABS.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '9px 0 11px', background: 'none', border: 'none', color: on ? 'var(--ris-amber)' : 'var(--ris-fg3)', cursor: 'pointer' }}>
            {on && <span style={{ position: 'absolute', top: 0, left: '28%', right: '28%', height: 2, background: 'var(--ris-amber)', boxShadow: '0 0 8px var(--ris-amber-glow)' }} />}
            <Icon name={t.icon} size={19} />
            <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---- Subjects list ----
function MSubjects({ onOpen }) {
  return (
    <div style={{ overflow: 'auto', flex: 1 }}>
      <div style={{ padding: 14, position: 'relative', borderBottom: '1px solid var(--ris-line)' }}>
        <Icon name="search" size={15} color="var(--ris-fg3)" style={{ position: 'absolute', left: 26, top: '50%', transform: 'translateY(-50%)' }} />
        <input className="ris-input" placeholder="SEARCH SUBJECTS…" style={{ paddingLeft: 36 }} />
      </div>
      {M_SUBJECTS.map(s => (
        <button key={s.id} onClick={() => onOpen(s)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--ris-line-faint)', borderLeft: '2px solid var(--ris-stream-' + s.stream + ', var(--ris-line))', background: 'none', cursor: 'pointer' }}>
          <div style={{ width: 40, height: 40, flex: '0 0 40px', background: 'var(--ris-surface-3)', border: '1px solid var(--ris-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ris-cyan)', clipPath: CLIP(7) }}><Icon name="user" size={18} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 15, fontWeight: 600, color: 'var(--ris-fg1)' }}>{s.name}</div>
            <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10.5, color: '#98a3a5', marginTop: 3, display: 'flex', gap: 8 }}><span>{s.id}</span><span>· conf {s.conf.toFixed(2)}</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
            <span className="ris-risk" data-risk={s.risk}>{s.risk}</span>
            <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: 'var(--ris-fg3)' }}>{s.last} ago</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ---- Subject detail (facets) ----
function MProfile({ subject, onOpenBaseline }) {
  const s = subject || M_SUBJECTS[1];
  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[['Confidence', s.conf.toFixed(2), 'var(--ris-cyan)'], ['Risk', s.risk.toUpperCase(), s.risk === 'high' ? 'var(--ris-red)' : s.risk === 'medium' ? 'var(--ris-amber)' : 'var(--ris-green)']].map(([k, v, c]) => (
          <div key={k} style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', padding: '11px 13px', clipPath: CLIP(8) }}>
            <span style={{ position: 'absolute', left: 0, top: 11, bottom: 11, width: 2, background: c }} />
            <Label style={{ color: '#98a3a5' }}>{k}</Label>
            <div style={{ fontFamily: 'var(--ris-font-display)', fontWeight: 700, fontSize: 22, color: c, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', clipPath: CLIP(9) }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ris-line)', fontFamily: 'var(--ris-font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg1)' }}>Dialectical Facets</div>
        <div style={{ padding: '4px 14px 10px' }}>
          {M_FACETS.map(f => (
            <div key={f.facet} className="ris-facet">
              <div className="ris-facet-head"><span className="ris-facet-name" style={{ fontSize: 12 }}>{f.facet}</span><span className="ris-facet-stat">{f.pos.toFixed(2)}</span></div>
              <div className="ris-facet-row">
                <span className="ris-facet-anchor" style={{ width: 60, flex: '0 0 60px', fontSize: 8.5 }}>{f.l}</span>
                <div className="ris-facet-track"><span className="ris-facet-needle" style={{ left: Math.round(f.pos * 100) + '%' }} /></div>
                <span className="ris-facet-anchor" style={{ width: 60, flex: '0 0 60px', fontSize: 8.5 }}>{f.r}</span>
              </div>
              <div className={'ris-conf ris-conf--' + confLvl(f.conf)}><i style={{ width: Math.round(f.conf * 100) + '%' }} /></div>
            </div>
          ))}
        </div>
      </div>
      {/* drill-down to Baseline */}
      <button onClick={onOpenBaseline} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line-strong)', padding: '14px 14px', cursor: 'pointer', clipPath: CLIP(8) }}>
        <div style={{ width: 34, height: 34, flex: '0 0 34px', background: 'var(--ris-surface-3)', border: '1px solid var(--ris-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ris-amber)', clipPath: CLIP(6) }}><Icon name="clipboard-list" size={17} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 14, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ris-fg1)' }}>Baseline Profile</div>
          <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10.5, color: '#98a3a5', marginTop: 2 }}>v3 · 13 fields · 2 risk flags</div>
        </div>
        <Icon name="chevron-right" size={20} color="var(--ris-cyan)" />
      </button>
    </div>
  );
}

// ---- Chronicle (mobile) — Events / Decisions / Snapshots sub-tabs ----
function MSubTabs({ tab, onTab }) {
  const tabs = [['events', 'Events'], ['decisions', 'Decisions'], ['snapshots', 'Snaps']];
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-surface-1)', flex: '0 0 auto' }}>
      {tabs.map(([id, label]) => {
        const on = tab === id;
        return (
          <button key={id} onClick={() => onTab(id)} style={{ position: 'relative', flex: 1, fontFamily: 'var(--ris-font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', padding: '11px 0', background: 'none', border: 'none', borderRight: id !== 'snapshots' ? '1px solid var(--ris-line-faint)' : 'none', color: on ? 'var(--ris-amber)' : 'var(--ris-fg3)', cursor: 'pointer' }}>
            {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--ris-amber)' }} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function MChronicle({ tab }) {
  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tab === 'events' && M_EVENTS.map((e, i) => (
        <div key={i} style={{ background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', borderLeft: '2px solid var(--ris-stream-' + e.stream + ', var(--ris-line))', padding: 12, clipPath: CLIP(8) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
            <span className="ris-stream" data-stream={e.stream}>{e.onto}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>{e.ts}</span>
          </div>
          <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12, color: e.stream === 'blocked' ? 'var(--ris-fg4)' : 'var(--ris-fg1)', lineHeight: 1.5, background: 'var(--ris-surface-2)', borderLeft: '2px solid ' + (e.stream === 'blocked' ? 'var(--ris-red-line)' : 'var(--ris-cyan-line)'), padding: '8px 10px', fontStyle: e.stream === 'blocked' ? 'italic' : 'normal' }}>{e.txt}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ris-fg3)', border: '1px solid var(--ris-line-strong)', padding: '2px 6px' }}>{e.init}</span>
            {e.risk !== 'none' && <span className="ris-risk" data-risk={e.risk}>{e.risk}</span>}
          </div>
        </div>
      ))}

      {tab === 'decisions' && M_DECISIONS.map((d, i) => (
        <div key={i} style={{ background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', borderLeft: '2px solid var(--ris-' + (d.verdict === 'approved' ? 'green' : d.verdict === 'blocked' ? 'red' : 'amber') + '-line)', padding: 12, clipPath: CLIP(8) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
            <Chip tone={M_VERDICT_TONE[d.verdict]} dot>{d.verdict}</Chip>
            <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: d.actor === 'researcher' ? 'var(--ris-cyan)' : '#98a3a5', border: '1px solid var(--ris-line-strong)', padding: '2px 6px' }}>{d.actor}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>{d.ts}</span>
          </div>
          <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13, color: 'var(--ris-fg1)', lineHeight: 1.45 }}>{d.rationale}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9.5, color: 'var(--ris-violet)' }}>{d.policy}</span>
            {d.risk !== 'none' && <span className="ris-risk" data-risk={d.risk}>{d.risk}</span>}
          </div>
        </div>
      ))}

      {tab === 'snapshots' && M_SNAPSHOTS.map((s, i) => (
        <div key={i} style={{ background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', borderLeft: '2px solid ' + (s.cur ? 'var(--ris-cyan)' : 'transparent'), padding: 12, clipPath: CLIP(8) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 9 }}>
            <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 15, fontWeight: 700, color: s.cur ? 'var(--ris-cyan)' : 'var(--ris-fg1)' }}>v{s.ver}</span>
            {s.cur && <Chip tone="green" dot>CURRENT</Chip>}
            <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: '#98a3a5', border: '1px solid var(--ris-line-strong)', padding: '2px 6px' }}>{s.trigger}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>{s.ts}</span>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {[['mean conf', s.conf.toFixed(2)], ['drift', s.drift.toFixed(2)]].map(([k, v]) => (
              <div key={k}>
                <span style={{ display: 'block', fontFamily: 'var(--ris-font-mono)', fontSize: 8.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-fg4)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 18, fontWeight: 700, color: k === 'drift' && v > 0.15 ? 'var(--ris-amber)' : 'var(--ris-fg1)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 9, fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: 'var(--ris-cyan)' }}>Δ {s.delta}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Baseline (mobile drill-down from Subject) ----
function MBaseline({ subject }) {
  const s = subject || M_SUBJECTS[1];
  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Chip tone="amber">VERSION 3</Chip>
        <Chip tone="green" dot>PROVENANCE OK</Chip>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>04·18</span>
      </div>

      {M_BASELINE.map(grp => (
        <div key={grp.section} style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', clipPath: CLIP(9) }}>
          <div style={{ padding: '9px 13px', borderBottom: '1px solid var(--ris-line)', fontFamily: 'var(--ris-font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-amber)' }}>{grp.section}</div>
          {grp.fields.map(([k, v, origin]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderBottom: '1px solid var(--ris-line-faint)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5', textTransform: 'capitalize' }}>{k}</div>
                <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13.5, fontWeight: 500, color: 'var(--ris-fg1)' }}>{v}</div>
              </div>
              <Chip tone={ORIGIN_TONE[origin]}>{origin.split('-')[0]}</Chip>
            </div>
          ))}
        </div>
      ))}

      <div style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-red-line)', clipPath: CLIP(9) }}>
        <div style={{ padding: '9px 13px', borderBottom: '1px solid var(--ris-line)', fontFamily: 'var(--ris-font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-red)' }}>Risk Flags</div>
        {M_BASE_RISK.map(([cat, sev]) => (
          <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', borderBottom: '1px solid var(--ris-line-faint)' }}>
            <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 12.5, color: 'var(--ris-fg1)', textTransform: 'capitalize' }}>{cat}</span>
            <span className="ris-risk" data-risk={sev}>{sev}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', clipPath: CLIP(9) }}>
        <div style={{ padding: '9px 13px', borderBottom: '1px solid var(--ris-line)', fontFamily: 'var(--ris-font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg1)' }}>TIPI · Big Five</div>
        <div style={{ padding: '2px 13px 10px' }}>{M_BASE_TIPI.map(([k, v]) => <Calibration key={k} label={k} value={v} max={7} color="var(--ris-cyan)" />)}</div>
      </div>
    </div>
  );
}

// ---- Gumi (mobile mini-profile) ----
function MGumi() {
  const batteries = [['Extraversion', 3.1], ['Agreeableness', 5.6], ['Conscientiousness', 5.9], ['Openness', 6.0]];
  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, border: '1px solid var(--ris-magenta-line)', background: 'var(--ris-magenta-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ris-magenta)', clipPath: CLIP(8) }}><Icon name="bot" size={22} /></div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ris-fg1)', whiteSpace: 'nowrap', lineHeight: 1.1 }}>GUMI · MIRA</div>
          <div style={{ marginTop: 6 }}><Chip tone="magenta">CALIBRATED</Chip></div>
        </div>
      </div>
      <div style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid rgba(47,228,138,0.35)', padding: 16, clipPath: CLIP(9), textAlign: 'center' }}>
        <Label style={{ color: '#98a3a5' }}>Sweet Spot</Label>
        <div style={{ fontFamily: 'var(--ris-font-display)', fontSize: 46, fontWeight: 700, color: 'var(--ris-green)', lineHeight: 1.1 }}>0.58</div>
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>target 0.3 – 0.7</div>
      </div>
      <div style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', clipPath: CLIP(9) }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ris-line)', fontFamily: 'var(--ris-font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ris-fg1)' }}>TIPI · Big Five</div>
        <div style={{ padding: '2px 14px 10px' }}>{batteries.map(([k, v]) => <Calibration key={k} label={k} value={v} max={7} color="var(--ris-cyan)" />)}</div>
      </div>
    </div>
  );
}

function MobileApp() {
  const [tab, setTab] = useMS('subjects');
  const [subject, setSubject] = useMS(null);
  const [detail, setDetail] = useMS(false);
  const [baseline, setBaseline] = useMS(false);
  const [chronTab, setChronTab] = useMS('events');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const subj = subject || M_SUBJECTS[1];
  const open = s => { setSubject(s); setDetail(true); setBaseline(false); setTab('profile'); };

  // title depends on drill-down state
  let tt, ts, onBack = null;
  if (tab === 'subjects') { tt = 'Subjects'; ts = '12 active · 3 this week'; }
  else if (tab === 'profile' && baseline) { tt = 'Baseline'; ts = subj.id + ' · profile v3'; onBack = () => setBaseline(false); }
  else if (tab === 'profile') { tt = subj.name; ts = subj.id + ' · facet model'; onBack = detail ? () => { setDetail(false); setTab('subjects'); } : null; }
  else if (tab === 'chronicle') { tt = 'Chronicle'; ts = subj.id + ' · governed audit'; }
  else if (tab === 'gumi') { tt = 'Gumi'; ts = 'agent profile'; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--ris-bg)' }} className="ris-grid-bg">
      <MStatus />
      <MTopBar title={tt} sub={ts} onBack={onBack}
        right={tab === 'subjects' ? <Chip tone="green" dot>LIVE</Chip> : null} />
      {tab === 'chronicle' && <MSubTabs tab={chronTab} onTab={setChronTab} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {tab === 'subjects' && <MSubjects onOpen={open} />}
        {tab === 'profile' && !baseline && <MProfile subject={subject} onOpenBaseline={() => setBaseline(true)} />}
        {tab === 'profile' && baseline && <MBaseline subject={subject} />}
        {tab === 'chronicle' && <MChronicle tab={chronTab} />}
        {tab === 'gumi' && <MGumi />}
      </div>
      <MTabBar active={tab} onNav={t => { setTab(t); if (t !== 'profile') { setDetail(false); setBaseline(false); } }} />
    </div>
  );
}
Object.assign(window, { MobileApp });
