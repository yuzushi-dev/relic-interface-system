'use client';

import React, { forwardRef, useId } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled default checked state */
  defaultChecked?: boolean;
  /** Primary label text or element */
  label?: React.ReactNode;
  /** Secondary helper or status description text */
  description?: React.ReactNode;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Callback fired when the checked state changes */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Tactical Mechanical Switch component (`.ris-switch`).
 * Features a chamfered sliding thumb, amber/accent engagement glow,
 * keyboard accessibility, and WCAG 2.2 AA compliant hit targets.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked,
    label,
    description,
    disabled = false,
    onChange,
    className = '',
    style,
    id: explicitId,
    name,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = explicitId || `ris-switch-${generatedId}`;
  const descId = description ? `${inputId}-desc` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked, e);
  };

  return (
    <label
      htmlFor={inputId}
      className={`ris-switch ${className}`.trim()}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      <input
        ref={ref}
        id={inputId}
        name={name}
        type="checkbox"
        role="switch"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-checked={checked}
        aria-describedby={descId}
        onChange={handleChange}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        {...rest}
      />
      {(label || description) && (
        <span
          className="ris-switch-text"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            lineHeight: 1.3,
          }}
        >
          {label && (
            <span
              className="ris-switch-label"
              style={{
                fontFamily: 'var(--ris-font-body)',
                fontSize: 'var(--ris-text-sm)',
                fontWeight: 'var(--ris-w-med, 500)',
                color: disabled ? 'var(--ris-fg4)' : 'var(--ris-fg1)',
              }}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              id={descId}
              className="ris-switch-desc"
              style={{
                fontFamily: 'var(--ris-font-mono)',
                fontSize: 'var(--ris-text-xs, 11px)',
                color: 'var(--ris-fg3)',
              }}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

Switch.displayName = 'Switch';
