import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? `ris-chk-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label className="ris-check" htmlFor={checkboxId}>
        <input ref={ref} type="checkbox" id={checkboxId} className={className} {...props} />
        {(label || description) && (
          <span className="ris-check-label">
            {label}
            {description && <small className="ris-field-help" style={{ display: 'block' }}>{description}</small>}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
