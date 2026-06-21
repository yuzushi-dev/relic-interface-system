// Muse.jsx — Muse Recorder (BLE / OSC modes, live EEG waveform, session, import)
function BioMuse() {
  const [ble, setBle] = React.useState(true);          // BLE vs OSC
  const [state, setState] = React.useState('idle');    // idle/scanning/found/connected/recording
  const [port, setPort] = React.useState('5000');
  const [dur, setDur] = React.useState(0);
  const [samples, setSamples] = React.useState(0);
  const tick = React.useRef(null);

  // live EEG animation when connected/recording
  React.useEffect(() => {
    let raf, t = 0;
    const draw = () => {
      const c = document.getElementById('muse_eeg');
      if (c && window.risEegWaveform && (state === 'connected' || state === 'recording')) {
        const ch = [0,1,2,3].map(i => window.risSynthEeg(80, t*0.15 + i*1.7, 60 - i*8));
        window.risEegWaveform(c, ch);
      }
      t++; raf = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, [state]);

  React.useEffect(() => {
    if (state === 'recording') {
      tick.current = setInterval(() => { setDur(d => d+1); setSamples(s => s + 53); }, 1000);
    } else clearInterval(tick.current);
    return () => clearInterval(tick.current);
  }, [state]);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const fmt = s => { const m = Math.floor(s/60), ss = s%60; return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0'); };
  const scan = () => { setState('scanning'); setTimeout(() => setState('found'), 1400); };
  const connect = () => setState('connected');
  const reset = () => { setState('idle'); setDur(0); setSamples(0); };

  const statusMap = {
    idle: ['In attesa', 'bluetooth-off', 'var(--ris-line-strong)'],
    scanning: ['Ricerca Muse…', 'bluetooth-searching', 'var(--ris-cyan)'],
    found: ['1 dispositivo trovato', 'bluetooth', 'var(--ris-cyan)'],
    connected: ['Connesso — Muse-2 4F3A', 'bluetooth-connected', 'var(--ris-green)'],
    recording: ['Registrazione — Muse-2 4F3A', 'circle-dot', 'var(--ris-red)'],
  };
  const oscStatus = state === 'recording' ? ['Registrazione', 'circle-dot', 'var(--ris-red)'] : ['In attesa', 'wifi-off', 'var(--ris-line-strong)'];
  const [stText, stIcon, stColor] = ble ? statusMap[state] : oscStatus;
  const pps = state === 'recording' ? 53 : 0;

  return (
    <div style={{ overflow: 'auto', flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* mode chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[[true,'BLE Diretto','bluetooth'],[false,'OSC (Mind Monitor)','wifi']].map(([v,l,ic]) => {
          const on = ble === v;
          return <button key={l} onClick={() => { if (state==='idle'||state==='recording'?false:true) {} setBle(v); reset(); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 0', cursor: 'pointer', clipPath: clip(6), fontFamily: MONO, fontSize: 11, letterSpacing: '.04em', background: on ? 'var(--ris-cyan-glow)' : 'transparent', border: '1px solid '+(on?'var(--ris-cyan-line)':'var(--ris-line-strong)'), color: on ? 'var(--ris-cyan)' : 'var(--ris-fg3)' }}>
            <Ico name={ic} size={14} />{l}
          </button>;
        })}
      </div>

      {/* status card */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 14, borderLeft: '2px solid '+stColor }}>
        <Ico name={stIcon} size={20} color={stColor} style={{ flex: '0 0 auto' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--ris-font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ris-fg1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stText}</div>
          {(state === 'connected' || state === 'recording') && ble && <div style={{ fontFamily: MONO, fontSize: 10, color: '#98a3a5', marginTop: 3 }}>Batteria 82% · Temp 31.4°C</div>}
        </div>
      </Card>

      {/* action buttons */}
      {ble ? (
        <div>
          {state === 'idle' && <button className="ris-btn ris-btn--secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={scan}><Ico name="bluetooth-searching" size={14} />Cerca Muse2</button>}
          {state === 'scanning' && <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 12, color: 'var(--ris-cyan)' }}>Ricerca in corso…</div>}
          {state === 'found' && <button className="ris-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={connect}><Ico name="bluetooth" size={14} />Muse-2 4F3A</button>}
          {state === 'connected' && <div style={{ display: 'flex', gap: 8 }}>
            <button className="ris-btn ris-btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setState('recording')}><Ico name="play" size={14} />Registra</button>
            <button className="ris-btn ris-btn--ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={reset}><Ico name="bluetooth-off" size={14} />Disconnetti</button>
          </div>}
          {state === 'recording' && <div style={{ display: 'flex', gap: 8 }}>
            <button className="ris-btn ris-btn--danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setState('connected')}><Ico name="square" size={14} />Stop</button>
            <button className="ris-btn ris-btn--ghost" style={{ flex: 1, justifyContent: 'center' }}><Ico name="flag" size={14} />Marker</button>
          </div>}
        </div>
      ) : (
        <>
          <div>
            <Lbl style={{ marginBottom: 5 }}>Porta UDP</Lbl>
            <input className="ris-input" value={port} onChange={e => setPort(e.target.value.replace(/\D/g,''))} style={{ fontFamily: MONO }} />
          </div>
          <Card style={{ padding: 12, borderColor: 'var(--ris-cyan-line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ico name="info" size={14} color="var(--ris-cyan)" /><span style={{ fontFamily: 'var(--ris-font-body)', fontSize: 12, fontWeight: 600, color: 'var(--ris-fg1)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Config Mind Monitor</span></div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ris-fg2)', marginTop: 8, lineHeight: 1.7 }}>Host: 192.168.1.24<br/>Port: {port}<br/><span style={{ color: '#98a3a5' }}>Settings → OSC → Host + Port</span></div>
          </Card>
          <button className={'ris-btn '+(state==='recording'?'ris-btn--danger':'ris-btn--primary')} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setState(s => s==='recording'?'idle':'recording')}><Ico name={state==='recording'?'square':'play'} size={14} />{state==='recording'?'Stop':'Start'}</button>
        </>
      )}

      {/* live EEG waveform */}
      {(state === 'connected' || state === 'recording') && (
        <Card style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
            {[['TP9','var(--ris-green)'],['AF7','var(--ris-cyan)'],['AF8','var(--ris-orange)'],['TP10','var(--ris-violet)']].map(([ch,c]) => (
              <div key={ch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--ris-green)' }} />
                <span style={{ fontFamily: MONO, fontSize: 8, color: c }}>{ch}</span>
              </div>
            ))}
          </div>
          <canvas id="muse_eeg" style={{ width: '100%', height: 150, display: 'block' }} />
        </Card>
      )}

      {/* session stats */}
      {(state === 'recording' || dur > 0) && (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 0' }}>
          <div style={{ textAlign: 'center' }}><Stat size={24}>{fmt(dur)}</Stat><Lbl style={{ marginTop: 4 }}>Durata</Lbl></div>
          <div style={{ textAlign: 'center' }}><Stat size={24}>{samples}</Stat><Lbl style={{ marginTop: 4 }}>Campioni</Lbl></div>
          <div style={{ textAlign: 'center' }}><Stat size={24} color={pps>50?'var(--ris-green)':pps>0?'var(--ris-amber)':'var(--ris-red)'}>{pps}</Stat><Lbl style={{ marginTop: 4 }}>Pkt/s</Lbl></div>
        </div>
      )}

      {/* import */}
      <div style={{ borderTop: '1px solid var(--ris-line)', paddingTop: 14 }}>
        <Lbl style={{ marginBottom: 8 }}>Importa da Mind Monitor</Lbl>
        <button className="ris-btn ris-btn--ghost" style={{ width: '100%', justifyContent: 'center' }}><Ico name="file-up" size={14} />Seleziona CSV</button>
      </div>
    </div>
  );
}
Object.assign(window, { BioMuse });
