import React, { forwardRef } from 'react';

export type ChipVariant =
  | 'accent'
  | 'cyan'
  | 'green'
  | 'red'
  | 'yellow'
  | 'violet'
  | 'magenta'
  | 'orange';

export type StreamTag =
  | 'evidence'
  | 'inference'
  | 'pending'
  | 'approved'
  | 'blocked'
  | 'gumi'
  | 'runtime'
  | 'correction'
  | 'neutral';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual accent color tier */
  variant?: ChipVariant;
  /** Whether to show the leading indicator dot (provides dual visual channel for color blindness) */
  dot?: boolean;
  /** Optional RIS Stream provenance tag (renders .ris-stream[data-stream]) */
  stream?: StreamTag;
  /** Optional RIS Risk classification tag (renders .ris-risk[data-risk]) */
  risk?: RiskLevel;
  /** Optional removal callback that renders a tactical dismiss '✕' button */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional interactive click handler */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

/**
 * Tactical Chip and Stream component (`.ris-chip` / `.ris-stream` / `.ris-risk`).
 * Follows WCAG 2.2 AA non-color-only encoding: the copy declares the state,
 * while the dot and color reinforce it.
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    children,
    variant = 'accent',
    dot = true,
    stream,
    risk,
    onRemove,
    onClick,
    className = '',
    style,
    ...rest
  },
  ref
) {
  // 1. Risk tag mode
  if (risk) {
    return (
      <span
        ref={ref}
        className={`ris-risk ${className}`.trim()}
        data-risk={risk}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  }

  // 2. Stream provenance tag mode
  if (stream) {
    return (
      <span
        ref={ref}
        className={`ris-stream ${className}`.trim()}
        data-stream={stream}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  }

  // 3. Standard tactical chip
  const isInteractive = Boolean(onClick);
  const variantClass = `ris-chip--${variant}`;

  return (
    <span
      ref={ref}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
              }
            }
          : undefined
      }
      className={`ris-chip ${variantClass} ${className}`.trim()}
      style={{
        cursor: isInteractive ? 'pointer' : undefined,
        ...style,
      }}
      {...rest}
    >
      {dot && <span className="dot" aria-hidden="true" />}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label="Remove chip"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            color: 'inherit',
            cursor: 'pointer',
            fontFamily: 'var(--ris-font-mono)',
            fontSize: 10,
            lineHeight: 1,
            marginLeft: 2,
            opacity: 0.75,
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
});

Chip.displayName = 'Chip';
