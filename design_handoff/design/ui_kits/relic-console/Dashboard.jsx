// Dashboard.jsx — overview screen
function Kpi({ label, value, unit, delta, deltaColor, accent }) {
  return (
    <div style={{ position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-line)', padding: '13px 15px', clipPath: CLIP(9) }}>
      <span style={{ position: 'absolute', left: 0, top: 13, bottom: 13, width: 2, background: accent }} />
      <Label style={{ color: '#98a3a5' }}>{label}</Label>
      <div style={{ fontFamily: 'var(--ris-font-display)', fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: 'var(--ris-fg1)', fontVariantNumeric: 'tabular-nums', marginTop: 6 }}>
        {value}{unit && <span style={{ fontSize: 14, color: '#98a3a5' }}>{unit}</span>}
      </div>
      <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 10, marginTop: 7, color: deltaColor }}>{delta}</div>
    </div>
  );
}

function SysRow({ label, value, pct, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
      <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ris-fg2)', width: 90 }}>{label}</span>
      <div style={{ flex: 1 }}><Meter value={pct} color={color} /></div>
      <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, color, width: 44, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function Dashboard({ feed }) {
  return (
    <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, gridAutoRows: 'min-content' }}>
      <div style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Kpi label="Subjects" value="12" accent="var(--ris-cyan)" delta="3 ACTIVE THIS WEEK" deltaColor="var(--ris-green)" />
        <Kpi label="Observations" value="1,940" accent="var(--ris-amber)" delta="▲ 176 / 24H" deltaColor="var(--ris-green)" />
        <Kpi label="Hypotheses" value="07" unit="/12" accent="var(--ris-violet)" delta="2 PENDING REVIEW" deltaColor="var(--ris-amber)" />
        <Kpi label="Blocked Events" value="03" accent="var(--ris-red)" delta="▲ SAFETY REVIEW DUE" deltaColor="var(--ris-red)" />
      </div>

      <Panel title="Model Health" right={<Chip tone="green" dot>NOMINAL</Chip>} style={{ gridColumn: '1 / 3' }}>
        <SysRow label="Confidence" value="74%" pct={74} color="var(--ris-green)" />
        <SysRow label="Coverage" value="64%" pct={64} color="var(--ris-cyan)" />
        <SysRow label="Drift" value="11%" pct={11} color="var(--ris-amber)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
          <span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ris-fg2)', width: 90 }}>Facets</span>
          <div style={{ flex: 1 }}><SegMeter on={5} total={8} color="var(--ris-amber)" /></div>
          <span style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: 'var(--ris-amber)', width: 44, textAlign: 'right' }}>14/18</span>
        </div>
      </Panel>

      <Panel title="Governance" right={<Chip tone="red" dot>REVIEW</Chip>} accent="var(--ris-red-line)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: 'var(--ris-font-display)', fontWeight: 700, fontSize: 44, color: 'var(--ris-red)', lineHeight: 1 }}>03</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 1, 1, 0, 0].map((v, i) => <span key={i} style={{ width: 7, height: 34, background: v ? 'var(--ris-red)' : 'var(--ris-surface-3)' }} />)}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: '#98a3a5', marginTop: 12, lineHeight: 1.6 }}>
          3 blocked Gumi initiatives<br />2 corrections awaiting sign-off
        </div>
      </Panel>

      <Panel title="Priority Review" accent="var(--ris-amber-line)" style={{ gridColumn: '1 / 2', background: 'linear-gradient(var(--ris-amber-glow), var(--ris-surface-1))' }}>
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 9, letterSpacing: '.2em', color: 'var(--ris-amber)', marginBottom: 8 }}>◆ PENDING</div>
        <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 15, fontWeight: 600, color: 'var(--ris-fg1)' }}>Approve hypothesis "Achievement masks avoidance"</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--ris-font-mono)', fontSize: 11, color: '#98a3a5', marginTop: 10 }}>
          <Icon name="user" size={11} color="var(--ris-amber)" /> SUBJ-0104 · CONF 0.78
        </div>
      </Panel>

      <Panel title="Activity Feed" right={<Label>LIVE</Label>} style={{ gridColumn: '2 / 4' }} bodyStyle={{ padding: 0 }}>
        <div style={{ fontFamily: 'var(--ris-font-mono)', fontSize: 11.5 }}>
          {feed.slice(0, 5).map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 14px', borderBottom: '1px solid var(--ris-line-faint)', borderLeft: '2px solid ' + l.color }}>
              <span style={{ color: '#98a3a5', flex: '0 0 58px' }}>{l.ts}</span>
              <span style={{ fontWeight: 700, fontSize: 9, letterSpacing: '.1em', color: l.color, flex: '0 0 34px' }}>{l.tag}</span>
              <span style={{ color: 'var(--ris-fg2)' }}>{l.msg}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { Dashboard });
