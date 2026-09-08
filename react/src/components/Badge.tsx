import React, { forwardRef } from 'react';

export type BadgeVariant = 'accent' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Numeric count or text displayed inside the badge */
  count?: number | string;
  /** Maximum count to display before suffixing with '+' (e.g. 99+) */
  max?: number;
  /** Visual variant: 'accent' (default amber/active fill) or 'danger' (crimson alert fill) */
  variant?: BadgeVariant;
  /** Accessible label for screen readers (e.g., "5 unread notifications") */
  'aria-label'?: string;
}

/**
 * Tactical Numeric Count Badge (`.ris-badge-count`).
 * Chamfered notification pill designed for HUD headers, tabs, and avatar badges.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    max = 99,
    variant = 'accent',
    'aria-label': ariaLabel,
    className = '',
    style,
    children,
    ...rest
  },
  ref
) {
  const displayCount = typeof count === 'number' && count > max ? `${max}+` : count;
  const variantClass = variant === 'danger' ? 'ris-badge-count--danger' : '';

  return (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel || (typeof count !== 'undefined' ? `${count} notifications` : undefined)}
      className={`ris-badge-count ${variantClass} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {displayCount ?? children}
    </span>
  );
});

Badge.displayName = 'Badge';

/* ============================================================================
   KPI TELEMETRY PILL & KPI BLOCK
   ========================================================================== */

export interface TelemetryDelta {
  value: string | number;
  direction?: 'up' | 'down' | 'neutral';
}

export type TelemetryVariant = 'accent' | 'cyan' | 'green' | 'red' | 'yellow';

export interface TelemetryPillProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric label (e.g., 'CORE_0', 'HRV', 'PWR') */
  label: string;
  /** Metric current numerical or formatted value */
  value: string | number;
  /** Metric measurement unit (e.g., '°C', 'bpm', 'W') */
  unit?: string;
  /** Optional trend delta */
  delta?: TelemetryDelta;
  /** Color theme for border and value accent */
  variant?: TelemetryVariant;
}

const TELEMETRY_COLORS: Record<TelemetryVariant, { line: string; fg: string; glow: string }> = {
  accent: { line: 'var(--ris-accent-line, #e6a23c)', fg: 'var(--ris-accent, #e6a23c)', glow: 'var(--ris-accent-glow)' },
  cyan: { line: 'var(--ris-cyan-line, #6fb3c9)', fg: 'var(--ris-cyan, #6fb3c9)', glow: 'var(--ris-cyan-glow)' },
  green: { line: 'var(--ris-green-line, #5fae84)', fg: 'var(--ris-green, #5fae84)', glow: 'var(--ris-green-glow)' },
  red: { line: 'var(--ris-red-line, #d45565)', fg: 'var(--ris-red, #d45565)', glow: 'var(--ris-red-glow)' },
  yellow: { line: 'var(--ris-yellow-line, #e6a23c)', fg: 'var(--ris-yellow, #e6a23c)', glow: 'var(--ris-yellow-glow)' },
};

/**
 * Compact Tactical KPI Telemetry Pill.
 * High-density monospace capsule displaying live sensor readings, units,
 * and trend direction for HUD statusbars and telemetry grids.
 */
export const TelemetryPill = forwardRef<HTMLDivElement, TelemetryPillProps>(function TelemetryPill(
  {
    label,
    value,
    unit,
    delta,
    variant = 'accent',
    className = '',
    style,
    ...rest
  },
  ref
) {
  const colors = TELEMETRY_COLORS[variant];

  return (
    <div
      ref={ref}
      className={`ris-telemetry-pill ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        background: 'var(--ris-surface-2, #141a1e)',
        border: `1px solid ${colors.line}`,
        fontFamily: 'var(--ris-font-mono)',
        fontSize: '11px',
        letterSpacing: '0.04em',
        clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          color: 'var(--ris-fg3, #8a96a0)',
          fontSize: '10px',
          textTransform: 'uppercase',
          borderRight: '1px solid var(--ris-line-faint, rgba(255,255,255,0.08))',
          paddingRight: '6px',
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: colors.fg,
          fontWeight: 'var(--ris-w-bold, 700)' as any,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: '9px', color: 'var(--ris-fg3)', marginLeft: '2px' }}>
            {unit}
          </span>
        )}
      </span>

      {delta && (
        <span
          style={{
            fontSize: '10px',
            color:
              delta.direction === 'up'
                ? 'var(--ris-green, #5fae84)'
                : delta.direction === 'down'
                  ? 'var(--ris-red, #d45565)'
                  : 'var(--ris-fg4)',
          }}
        >
          {delta.direction === 'up' ? '▲' : delta.direction === 'down' ? '▼' : '•'}
          {delta.value}
        </span>
      )}
    </div>
  );
});

TelemetryPill.displayName = 'TelemetryPill';

/* ============================================================================
   KPI CARD (.ris-kpi)
   ========================================================================== */

export interface KpiProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric descriptive label */
  label: string;
  /** Primary metric value */
  value: string | number;
  /** Optional measurement unit */
  unit?: string;
  /** Optional trend delta string or object */
  delta?: string | { value: string | number; direction: 'up' | 'down' };
  /** Accent color applied to left stripe and focus */
  accent?: string;
}

/**
 * Standard Relic KPI block (`.ris-kpi`).
 * Large tabular typography with metric label, measurement unit,
 * and up/down colorized delta indicator.
 */
export const Kpi = forwardRef<HTMLDivElement, KpiProps>(function Kpi(
  {
    label,
    value,
    unit,
    delta,
    accent,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const deltaObj = typeof delta === 'string'
    ? { value: delta, direction: delta.startsWith('+') ? 'up' : delta.startsWith('-') ? 'down' : undefined }
    : delta;

  return (
    <div
      ref={ref}
      className={`ris-kpi ${className}`.trim()}
      style={{
        ...((accent ? { ['--ris-kpi-accent' as any]: accent } : {})),
        ...style,
      }}
      {...rest}
    >
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {deltaObj && (
        <span className={`kpi-delta ${deltaObj.direction || ''}`.trim()}>
          {deltaObj.value}
        </span>
      )}
    </div>
  );
});

Kpi.displayName = 'Kpi';
