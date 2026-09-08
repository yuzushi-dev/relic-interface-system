'use client';

import React, { forwardRef, useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    return (
      <div className="ris-field" data-invalid={error ? true : undefined}>
        {label && <label htmlFor={inputId}>{label}</label>}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftIcon && (
            <span style={{ position: 'absolute', left: 10, display: 'inline-flex', pointerEvents: 'none', color: 'var(--ris-fg3)' }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`ris-input ${className}`}
            style={{
              paddingLeft: leftIcon ? 34 : undefined,
              paddingRight: rightIcon ? 34 : undefined,
              width: '100%',
            }}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : helperText ? helpId : undefined}
            {...props}
          />
          {rightIcon && (
            <span style={{ position: 'absolute', right: 10, display: 'inline-flex', color: 'var(--ris-fg3)' }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <span id={errorId} className="ris-field-error" role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span id={helpId} className="ris-field-help">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
