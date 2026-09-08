import React from 'react';

export type AlertVariant = 'info' | 'warn' | 'danger' | 'success';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'danger'
      ? 'ris-toast--danger'
      : variant === 'warn'
      ? 'ris-toast--warn'
      : variant === 'success'
      ? 'ris-toast--success'
      : '';

  return (
    <div
      role="alert"
      className={`ris-panel ris-panel--strong ${variantClass} ${className}`}
      style={{
        borderLeftWidth: 3,
        borderLeftColor:
          variant === 'danger'
            ? 'var(--ris-red)'
            : variant === 'warn'
            ? 'var(--ris-yellow)'
            : variant === 'success'
            ? 'var(--ris-green)'
            : 'var(--ris-cyan)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
      {...props}
    >
      {icon && <span style={{ flexShrink: 0, marginTop: 2 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontFamily: 'var(--ris-font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 4,
              color:
                variant === 'danger'
                  ? 'var(--ris-red)'
                  : variant === 'warn'
                  ? 'var(--ris-yellow)'
                  : variant === 'success'
                  ? 'var(--ris-green)'
                  : 'var(--ris-cyan)',
            }}
          >
            {title}
          </div>
        )}
        <div style={{ fontSize: '13px', color: 'var(--ris-fg2)', lineHeight: 1.5 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
