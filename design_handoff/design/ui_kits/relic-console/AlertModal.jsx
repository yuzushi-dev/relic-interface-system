// AlertModal.jsx — destructive / confirm overlay (configurable)
function AlertModal({ item, onCancel, onConfirm }) {
  if (!item) return null;
  const title = item.title || 'End Session';
  const body = item.body || 'This locks the workbench and revokes the current researcher token. You will need to re-authenticate to continue.';
  const cta = item.cta || 'Lock Workbench';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,7,8,.72)', backdropFilter: 'blur(2px)' }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} className="ris-scanlines" style={{ width: 440, position: 'relative', background: 'var(--ris-surface-1)', border: '1px solid var(--ris-red-line)', boxShadow: 'var(--ris-glow-red)', clipPath: CLIP(14) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderBottom: '1px solid var(--ris-line)', background: 'var(--ris-red-glow)' }}>
          <Icon name="alert-triangle" size={15} color="var(--ris-red)" />
          <span style={{ fontFamily: 'var(--ris-font-display)', fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ris-red)' }}>{title}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--ris-font-mono)', fontSize: 10, color: '#98a3a5' }}>SYS//CONFIRM</span>
        </div>
        <div style={{ padding: 18 }}>
          <p style={{ margin: '0 0 18px', fontFamily: 'var(--ris-font-body)', fontSize: 14, color: 'var(--ris-fg2)', lineHeight: 1.55 }}>{body}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
            <Btn variant="danger" icon="power" onClick={onConfirm}>{cta}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { AlertModal });
