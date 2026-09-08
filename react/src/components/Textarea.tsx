import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, className = '', ...props }, ref) => {
    const textareaId = id || (label ? `ris-textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="ris-field" data-invalid={error ? true : undefined}>
        {label && <label htmlFor={textareaId}>{label}</label>}
        <textarea
          ref={ref}
          id={textareaId}
          className={`ris-textarea ${className}`}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error ? (
          <span className="ris-field-error" role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span className="ris-field-help">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
