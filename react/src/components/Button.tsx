import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'default' | 'secondary' | 'danger' | 'outline' | 'invert';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size tier: sm (28px), md (36px default), lg (46px) */
  size?: ButtonSize;
  /** Whether the button is in a loading/busy state */
  loading?: boolean;
  /** Optional text to display alongside or instead of children when loading */
  loadingText?: React.ReactNode;
  /** Icon element placed before the button label */
  leftIcon?: React.ReactNode;
  /** Icon element placed after the button label */
  rightIcon?: React.ReactNode;
  /** Stretches the button to 100% width of its parent */
  block?: boolean;
  /** True for square single-icon buttons */
  iconOnly?: boolean;
}

/**
 * Tactical Cyber Button component (`.ris-btn`).
 * Adheres to Emil Kowalski motion principles:
 * - 80ms micro-feedback on press (`:active` transform scale 0.97)
 * - Hardware-accelerated CSS transition (transform, background, border-color, box-shadow)
 * - Zero layout reflow
 * - Accessible loading spinner (`role="status"`, `aria-busy="true"`)
 * - WCAG 2.2 AA compliant focus rings and minimum touch targets
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'default',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    block = false,
    iconOnly = false,
    disabled = false,
    className = '',
    style,
    type = 'button',
    ...rest
  },
  ref
) {
  const variantClass = variant === 'default'
    ? ''
    : variant === 'outline'
      ? 'ris-btn--ghost'
      : `ris-btn--${variant}`;

  const sizeClass = size === 'md' ? '' : `ris-btn--${size}`;
  const blockClass = block ? 'ris-btn--block' : '';
  const iconClass = iconOnly ? 'ris-btn--icon' : '';

  const combinedClassName = [
    'ris-btn',
    variantClass,
    sizeClass,
    blockClass,
    iconClass,
    className,
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      className={combinedClassName}
      style={{
        // Ensure Emil Kowalski 80ms active snap scale(0.97) and smooth release
        transition: 'transform var(--ris-dur-instant, 80ms) var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1)), background var(--ris-dur-fast, 140ms) var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1)), border-color var(--ris-dur-fast, 140ms) var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1)), box-shadow var(--ris-dur-fast, 140ms) var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1))',
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <>
          <span
            className="ris-spinner"
            role="status"
            aria-label="Loading"
            style={{
              width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
              height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
              borderWidth: size === 'sm' ? 1.5 : 2,
              flexShrink: 0,
            }}
          />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {leftIcon && <span className="ris-btn-icon-left" style={{ display: 'inline-flex', flexShrink: 0 }} aria-hidden="true">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="ris-btn-icon-right" style={{ display: 'inline-flex', flexShrink: 0 }} aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
