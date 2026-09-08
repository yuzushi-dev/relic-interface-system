'use client';

import React, { forwardRef, useId } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, children, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helpId = `${selectId}-help`;

    return (
      <div className="ris-field" data-invalid={error ? true : undefined}>
        {label && <label htmlFor={selectId}>{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={`ris-select ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : helperText ? helpId : undefined}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
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
Select.displayName = 'Select';
