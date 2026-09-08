import React, { useEffect, useRef, useId, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /** Whether the modal is currently open */
  open: boolean;
  /** Callback fired when the modal requests to close (via ESC, backdrop click, or close button) */
  onClose: () => void;
  /** Modal header title */
  title?: React.ReactNode;
  /** Optional secondary subtitle or system ID */
  subtitle?: React.ReactNode;
  /** Optional header actions */
  actions?: React.ReactNode;
  /** Optional footer content rendered inside .ris-modal-foot */
  footer?: React.ReactNode;
  /** Main dialog body content */
  children: React.ReactNode;
  /** Whether pressing Escape key closes the modal (default: true) */
  closeOnEsc?: boolean;
  /** Whether clicking the backdrop closes the modal (default: true) */
  closeOnBackdrop?: boolean;
  /** Whether to render the default tactical close button (default: true) */
  showCloseButton?: boolean;
  /** Max width tier: sm (420px), md (560px default), lg (840px), full */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Optional DOM container to portal the modal into (defaults to document.body) */
  portalContainer?: HTMLElement | null;
  /** Additional CSS class for the modal dialog window */
  className?: string;
  /** Inline styles for the modal dialog window */
  style?: React.CSSProperties;
}

const SIZE_WIDTHS: Record<'sm' | 'md' | 'lg' | 'full', string> = {
  sm: 'min(420px, calc(100vw - 32px))',
  md: 'min(560px, calc(100vw - 32px))',
  lg: 'min(840px, calc(100vw - 32px))',
  full: 'min(1180px, calc(100vw - 32px))',
};

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Tactical Modal Dialog component (`.ris-modal`).
 * Adheres to Emil Kowalski motion principles:
 * - 240ms enter animation (`var(--ris-dur-enter)`), scale(0.96) → scale(1)
 * - Centered transform origin
 * - Strictly no ease-in on entrance (uses `--ris-ease-out`)
 * - Robust focus trap with auto-focus and restoration to previous active element
 * - ESC listener and backdrop dismissal
 * - Scroll-locking on body while active
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  footer,
  children,
  closeOnEsc = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  size = 'md',
  portalContainer,
  className = '',
  style,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle open/close side effects (focus restoration, body scroll lock)
  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first interactive element inside modal
    const timer = setTimeout(() => {
      if (!modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      } else {
        modalRef.current.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [open]);

  // Focus trap + ESC listener
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEsc]);

  const handleClose = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsDismissing(false);
      onClose();
    }, 140);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted || (!open && !isDismissing)) {
    return null;
  }

  const targetContainer = portalContainer || (typeof document !== 'undefined' ? document.body : null);
  if (!targetContainer) return null;

  return createPortal(
    <div
      className="ris-modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        opacity: isDismissing ? 0 : 1,
        transition: 'opacity var(--ris-dur-fast, 140ms) var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1))',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`ris-modal ${className}`.trim()}
        style={{
          width: SIZE_WIDTHS[size],
          transform: isDismissing ? 'scale(0.96)' : undefined,
          opacity: isDismissing ? 0 : undefined,
          transition: isDismissing ? 'transform var(--ris-dur-fast, 140ms) var(--ris-ease-snap), opacity var(--ris-dur-fast, 140ms) var(--ris-ease-snap)' : undefined,
          ...style,
        }}
      >
        {(title || actions || showCloseButton) && (
          <header className="ris-modal-head">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              {title && (
                <span
                  id={titleId}
                  style={{
                    fontFamily: 'var(--ris-font-display)',
                    fontSize: 'var(--ris-text-md, 16px)',
                    fontWeight: 'var(--ris-w-bold, 700)',
                    letterSpacing: 'var(--ris-track-wide, 0.08em)',
                    textTransform: 'uppercase',
                    color: 'var(--ris-fg1)',
                  }}
                >
                  {title}
                </span>
              )}
              {subtitle && (
                <span
                  style={{
                    fontFamily: 'var(--ris-font-mono)',
                    fontSize: 'var(--ris-text-xs, 11px)',
                    color: 'var(--ris-fg3)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {subtitle}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ris-s2, 8px)', marginLeft: 'auto' }}>
              {actions}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="ris-btn ris-btn--ghost ris-btn--icon ris-btn--sm"
                  style={{
                    width: 28,
                    height: 28,
                    minHeight: 28,
                    padding: 0,
                    lineHeight: 1,
                    fontSize: 14,
                    fontFamily: 'var(--ris-font-mono)',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </header>
        )}

        <div className="ris-modal-body">
          {children}
        </div>

        {footer && (
          <footer className="ris-modal-foot">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    targetContainer
  );
};

Modal.displayName = 'Modal';
