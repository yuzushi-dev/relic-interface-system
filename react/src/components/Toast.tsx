'use client';

import React from 'react';

export type ToastVariant = 'hud' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastAction {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastData {
  id: string;
  title: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  timestamp?: string;
  isDismissing?: boolean;
}

export interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const VARIANT_ACCENT_VARS: Record<ToastVariant, string> = {
  hud: 'var(--ris-accent, #e6a23c)',
  success: 'var(--ris-green, #5fae84)',
  warning: 'var(--ris-yellow, #e6a23c)',
  danger: 'var(--ris-red, #d45565)',
  info: 'var(--ris-cyan, #6fb3c9)',
};

/**
 * Tactical Toast Item component (`.ris-toast`).
 * Features chamfered geometry, left telemetry stripe, high-contrast title,
 * optional action button, and smooth interruptible transitions.
 */
export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, title, description, variant = 'hud', action, timestamp, isDismissing } = toast;

  const variantClass = variant === 'hud' ? 'ris-toast--hud' : `ris-toast--${variant}`;
  const accentColor = VARIANT_ACCENT_VARS[variant];

  return (
    <div
      role="status"
      className={`ris-toast ${variantClass}`.trim()}
      style={{
        opacity: isDismissing ? 0 : 1,
        transform: isDismissing ? 'translateX(24px)' : 'translateX(0)',
        transition: 'transform var(--ris-dur, 160ms) var(--ris-ease-snap), opacity var(--ris-dur, 160ms) var(--ris-ease-snap)',
        borderLeftColor: accentColor,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span
            className="title"
            style={{
              color: accentColor,
            }}
          >
            {title}
          </span>
          {timestamp && (
            <span
              style={{
                fontFamily: 'var(--ris-font-mono)',
                fontSize: '10px',
                color: 'var(--ris-fg4)',
                letterSpacing: '0.04em',
              }}
            >
              {timestamp}
            </span>
          )}
        </div>

        {description && (
          <div
            style={{
              marginTop: '4px',
              fontFamily: 'var(--ris-font-body)',
              fontSize: 'var(--ris-text-xs, 12px)',
              color: 'var(--ris-fg2)',
              lineHeight: 1.45,
            }}
          >
            {description}
          </div>
        )}

        {action && (
          <div style={{ marginTop: '8px' }}>
            <button
              type="button"
              onClick={(e) => {
                action.onClick(e);
                onDismiss(id);
              }}
              className="ris-btn ris-btn--sm ris-btn--ghost"
              style={{
                padding: '3px 8px',
                minHeight: 22,
                fontSize: '10px',
                borderColor: accentColor,
                color: accentColor,
              }}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss toast"
        className="ris-btn ris-btn--ghost ris-btn--icon ris-btn--sm"
        style={{
          width: 22,
          height: 22,
          minHeight: 22,
          padding: 0,
          fontSize: 12,
          color: 'var(--ris-fg4)',
          marginLeft: '4px',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
};

Toast.displayName = 'Toast';
