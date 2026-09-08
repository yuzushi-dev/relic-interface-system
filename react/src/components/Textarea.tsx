'use client';

import React, { forwardRef, useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helpId = `${textareaId}-help`;

    return (
      <div className="ris-field" data-invalid={error ? true : undefined}>
        {label && <label htmlFor={textareaId}>{label}</label>}
        <textarea
          ref={ref}
          id={textareaId}
          className={`ris-textarea ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : helperText ? helpId : undefined}
          {...props}
        />
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
Textarea.displayName = 'Textarea';
