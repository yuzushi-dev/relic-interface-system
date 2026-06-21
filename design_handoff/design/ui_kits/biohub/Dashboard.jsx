// Dashboard.jsx — BioHub health overview (RIS-skinned)
function BioDashboard({ onScale }) {
  React.useEffect(() => {
    if (window.risLineChart) {
      const hr = [58,61,57,60,63,59,62,64,60,58,55,62,66,61,59,63,62,60,57,62];
      const c1 = document.getElementById('bh_hr'); if (c1) window.risLineChart(c1, hr, { color: '#ff2d3c' });
      const c2 = document.getElementById('bh_eeg'); if (c2) window.risEegBands(c2, [0.42,0.61,0.78,0.55,0.31]);
    }
  });
  const small = (l, v, u, c) => (
    <Card style={{ flex: 1, padding: 8, textAlign: 'center', clipPath: 'none' }}>
      <Lbl style={{ fontSize: 8 }}>{l}</Lbl><Stat size={15} color={c} style={{ marginTop: 3 }}>{v}</Stat>
      <div style={{ fontFamily: MONO, fontSize: 8, color: '#98a3a5' }}>{u}</div>
    </Card>
  );
  const sec = (icon, l, v, c) => (
    <Card style={{ flex: 1, padding: 11, textAlign: 'center' }}>
      <Ico name={icon} size={18} color={c} style={{ justifyContent: 'center' }} />
      <Lbl style={{ marginTop: 5 }}>{l}</Lbl><Stat size={17} style={{ marginTop: 3 }}>{v}</Stat>
    </Card>
  );
  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* primary */}
      <div style={{ display: 'flex', gap: 10 }}>
        <Card style={{ flex: 1, padding: 13 }}>
          <span style={{ position: 'absolute', left: 0, top: 13, bottom: 13, width: 2, background: 'var(--ris-red)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Ico name="heart" size={18} color="var(--ris-red)" /><span style={{ fontFamily: MONO, fontSize: 8.5, color: '#98a3a5' }}>ZEPP</span></div>
          <Lbl style={{ marginTop: 10 }}>FC</Lbl>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 3 }}><Stat size={30}>62</Stat><span style={{ fontFamily: MONO, fontSize: 11, color: '#98a3a5', marginBottom: 3 }}>bpm</span></div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginTop: 5 }}>07 mag, 07:38</div>
        </Card>
        <Card style={{ flex: 1, padding: 13 }}>
          <span style={{ position: 'absolute', left: 0, top: 13, bottom: 13, width: 2, background: 'var(--ris-violet)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Ico name="activity" size={18} color="var(--ris-violet)" /><span style={{ fontFamily: MONO, fontSize: 8.5, color: '#98a3a5' }}>ZEPP</span></div>
          <Lbl style={{ marginTop: 10 }}>HRV</Lbl>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 3 }}><Stat size={30}>48</Stat><span style={{ fontFamily: MONO, fontSize: 11, color: '#98a3a5', marginBottom: 3 }}>ms</span></div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: '#98a3a5', marginTop: 5 }}>07 mag, 07:38</div>
        </Card>
      </div>
      {/* secondary */}
      <div style={{ display: 'flex', gap: 8 }}>
        {sec('footprints', 'Passi', '8.2k', 'var(--ris-cyan)')}
        {sec('moon', 'Sonno', '7h 12m', 'var(--ris-violet)')}
        {sec('wind', 'SpO2', '97%', 'var(--ris-green)')}
      </div>
      {/* small */}
      <div style={{ display: 'flex', gap: 8 }}>
        {small('FC Riposo', '54', 'bpm')}
        {small('Stress', '34', '/100', 'var(--ris-amber)')}
        {small('PAI 7gg', '118', 'pt', 'var(--ris-green)')}
        {small('T. Cute', '33.4', '°C')}
      </div>
      {/* calories */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
        <Ico name="flame" size={22} color="var(--ris-orange)" />
        <div><Lbl>Calorie Attive</Lbl><Stat size={18} style={{ marginTop: 2 }}>486 <span style={{ fontFamily: MONO, fontSize: 11, color: '#98a3a5', fontWeight: 400 }}>kcal</span></Stat></div>
        <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 9, color: '#98a3a5' }}>GADGETBRIDGE</span>
      </Card>
      {/* body comp — drill-down to Scale */}
      <Card style={{ padding: 14, cursor: 'pointer' }} onClick={onScale}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ico name="scale" size={18} color="var(--ris-cyan)" />
          <div><Lbl>Composizione corporea</Lbl><div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}><Stat size={24}>71.4</Stat><span style={{ fontFamily: MONO, fontSize: 11, color: '#98a3a5', marginBottom: 2 }}>kg</span></div></div>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 9, color: '#98a3a5' }}>OKOK <Ico name="chevron-right" size={16} color="var(--ris-cyan)" /></span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {[['22.4','BMI'],['17%','Grasso'],['33kg','Muscolo'],['54%','Acqua'],['8','Visc.']].map(([v,l]) => (
            <div key={l} style={{ flex: 1, textAlign: 'center' }}><Stat size={14}>{v}</Stat><Lbl style={{ fontSize: 8, marginTop: 2 }}>{l}</Lbl></div>
          ))}
        </div>
      </Card>
      {/* charts */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}><Lbl style={{ marginBottom: 5 }}>FC — 7 giorni</Lbl><Card style={{ padding: 6 }}><canvas id="bh_hr" style={{ width: '100%', height: 90, display: 'block' }} /></Card></div>
        <div style={{ flex: 1 }}><Lbl style={{ marginBottom: 5 }}>Muse EEG — bande</Lbl><Card style={{ padding: 6 }}><canvas id="bh_eeg" style={{ width: '100%', height: 90, display: 'block' }} /></Card></div>
      </div>
      {/* recent */}
      <div>
        <Lbl style={{ margin: '2px 0 8px' }}>Sessioni Recenti</Lbl>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderLeft: '2px solid var(--ris-magenta)', marginBottom: 6 }}>
          <Ico name="brain" size={18} color="var(--ris-magenta)" />
          <div style={{ flex: 1 }}><div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13, fontWeight: 600, color: 'var(--ris-fg1)' }}>Muse Session</div><div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5' }}>07 mag, 06:40</div></div>
          <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ris-fg2)' }}>22m</span>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderLeft: '2px solid var(--ris-cyan)' }}>
          <Ico name="heart-pulse" size={18} color="var(--ris-cyan)" />
          <div style={{ flex: 1 }}><div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 13, fontWeight: 600, color: 'var(--ris-fg1)' }}>Health Sync</div><div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5' }}>07 mag, 06:10</div></div>
          <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ris-fg2)' }}>4m</span>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { BioDashboard });
