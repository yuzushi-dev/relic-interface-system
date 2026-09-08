import React, { useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';

export interface SheetProps {
  /** Whether the bottom sheet is currently open */
  open: boolean;
  /** Callback fired when the sheet requests to close */
  onClose: () => void;
  /** Sheet header title */
  title?: React.ReactNode;
  /** Optional secondary subtitle or telemetry stream */
  subtitle?: React.ReactNode;
  /** Optional footer content rendered inside .ris-sheet-foot */
  footer?: React.ReactNode;
  /** Sheet body content */
  children: React.ReactNode;
  /** Whether pressing Escape key closes the sheet (default: true) */
  closeOnEsc?: boolean;
  /** Whether clicking the backdrop closes the sheet (default: true) */
  closeOnBackdrop?: boolean;
  /** Whether to render the default tactical close button (default: true) */
  showCloseButton?: boolean;
  /** Optional DOM container to portal the sheet into (defaults to document.body) */
  portalContainer?: HTMLElement | null;
  /** Additional CSS class for the sheet window */
  className?: string;
  /** Inline styles for the sheet window */
  style?: React.CSSProperties;
}

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Tactical Mobile Bottom Sheet component (`.ris-sheet`).
 * Designed according to Emil Kowalski motion and gesture engineering principles:
 * - Direct element `transform: translateY(...)` manipulation to prevent cascading style recalculation
 * - Drag handle with pointer capture and multi-touch protection
 * - Upward drag damping (resistance rather than hard stop)
 * - Momentum flick detection (velocity > 0.11 px/ms)
 * - 240ms enter animation without ease-in (`var(--ris-dur-enter)`)
 * - Focus trap, ESC key listener, and body scroll lock
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  closeOnEsc = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  portalContainer,
  className = '',
  style,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const titleId = `${generatedId}-sheet-title`;

  // Drag tracking state
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const currentTranslateY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock and focus restoration
  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      if (!sheetRef.current) return;
      const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      } else {
        sheetRef.current.focus();
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

  // ESC key listener & focus trap
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        e.preventDefault();
        handleDismiss();
        return;
      }

      if (e.key === 'Tab') {
        if (!sheetRef.current) return;
        const focusable = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
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

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsDismissing(false);
      onClose();
    }, 160);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  // Pointer drag gestures for sheet handle
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartTime.current = Date.now();
    currentTranslateY.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);

    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sheetRef.current) return;

    const deltaY = e.clientY - dragStartY.current;

    // Upward drag damping (resistance rather than hard stop)
    if (deltaY < 0) {
      const damped = Math.sign(deltaY) * Math.pow(Math.abs(deltaY), 0.7);
      currentTranslateY.current = damped;
      sheetRef.current.style.transform = `translateY(${damped}px)`;
    } else {
      // Downward drag (towards dismiss)
      currentTranslateY.current = deltaY;
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sheetRef.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const elapsed = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = currentTranslateY.current / elapsed; // px/ms
    const distance = currentTranslateY.current;

    // Dismiss if dragged down >= 120px OR quick flick with velocity >= 0.11 px/ms
    if (distance > 120 || velocity > 0.11) {
      sheetRef.current.style.transition = 'transform var(--ris-dur, 160ms) var(--ris-ease-snap)';
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        handleDismiss();
      }, 160);
    } else {
      // Snap back to open position
      sheetRef.current.style.transition = 'transform var(--ris-dur-base, 200ms) var(--ris-ease-out)';
      sheetRef.current.style.transform = 'translateY(0)';
      currentTranslateY.current = 0;
    }
  };

  if (!mounted || (!open && !isDismissing)) {
    return null;
  }

  const targetContainer = portalContainer || (typeof document !== 'undefined' ? document.body : null);
  if (!targetContainer) return null;

  return createPortal(
    <div
      className="ris-sheet-backdrop"
      onClick={handleBackdropClick}
      style={{
        opacity: isDismissing ? 0 : 1,
        transition: 'opacity var(--ris-dur-fast, 140ms) var(--ris-ease-snap)',
      }}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        data-dismissing={isDismissing ? 'true' : undefined}
        className={`ris-sheet ${className}`.trim()}
        style={{
          ...style,
        }}
      >
        {/* Interactive Drag Handle with Pointer Capture */}
        <div
          role="presentation"
          aria-hidden="true"
          className="ris-sheet-handle-zone"
          style={{ touchAction: 'none', cursor: 'grab', width: '100%', padding: '4px 0 2px' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="ris-sheet-handle" />
        </div>

        {(title || subtitle || showCloseButton) && (
          <header className="ris-sheet-head">
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

            {showCloseButton && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close sheet"
                className="ris-btn ris-btn--ghost ris-btn--icon ris-btn--sm"
                style={{
                  width: 28,
                  height: 28,
                  minHeight: 28,
                  padding: 0,
                  fontSize: 14,
                  fontFamily: 'var(--ris-font-mono)',
                  marginLeft: 'auto',
                }}
              >
                ✕
              </button>
            )}
          </header>
        )}

        <div className="ris-sheet-body">
          {children}
        </div>

        {footer && (
          <footer className="ris-sheet-foot">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    targetContainer
  );
};

Sheet.displayName = 'Sheet';
