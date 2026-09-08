import React, { forwardRef } from 'react';

export type PanelVariant = 'default' | 'strong';
export type PanelChamfer = 'none' | 'sm' | 'md' | 'lg';

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional custom header element that overrides default head structure */
  header?: React.ReactNode;
  /** Panel title rendered inside the header */
  title?: React.ReactNode;
  /** Panel header action buttons or status indicators */
  actions?: React.ReactNode;
  /** Background and border surface tier: default (surface-1) or strong (surface-2) */
  variant?: PanelVariant;
  /** Angular corner chamfer size: none (flat/rectangular), sm (6px), md (10px standard), lg (16px modal/hero) */
  chamfer?: PanelChamfer;
  /** Whether to render CRT scanline background texture */
  scanlines?: boolean;
  /** Optional footer content rendered inside .ris-panel-foot */
  footer?: React.ReactNode;
  /** Whether to show tactical accent corner L-brackets (.ris-bracket) */
  bracket?: boolean;
  /** Additional class applied specifically to the .ris-panel-body element */
  bodyClassName?: string;
}

const CHAMFER_CLIP_PATHS: Record<PanelChamfer, string | undefined> = {
  none: 'none',
  sm: 'polygon(0 0, calc(100% - var(--ris-clip-sm, 6px)) 0, 100% var(--ris-clip-sm, 6px), 100% 100%, var(--ris-clip-sm, 6px) 100%, 0 calc(100% - var(--ris-clip-sm, 6px)))',
  md: 'polygon(0 0, calc(100% - var(--ris-clip, 10px)) 0, 100% var(--ris-clip, 10px), 100% 100%, var(--ris-clip, 10px) 100%, 0 calc(100% - var(--ris-clip, 10px)))',
  lg: 'polygon(0 0, calc(100% - var(--ris-clip-lg, 16px)) 0, 100% var(--ris-clip-lg, 16px), 100% 100%, var(--ris-clip-lg, 16px) 100%, 0 calc(100% - var(--ris-clip-lg, 16px)))',
};

/**
 * Tactical Angular Panel component (`.ris-panel`).
 * Signature Relic Interface System container featuring chamfered corners,
 * high-contrast surface hierarchy, optional scanlines, and tactile head/foot chrome.
 */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  {
    header,
    title,
    actions,
    variant = 'default',
    chamfer = 'md',
    scanlines = false,
    footer,
    bracket = false,
    bodyClassName = '',
    className = '',
    style,
    children,
    ...rest
  },
  ref
) {
  const variantClass = variant === 'strong' ? 'ris-panel--2' : '';
  const flatClass = chamfer === 'none' ? 'ris-panel--flat' : '';
  const scanlineClass = scanlines ? 'ris-scanlines' : '';
  const bracketClass = bracket ? 'ris-bracket' : '';

  const combinedClassName = [
    'ris-panel',
    variantClass,
    flatClass,
    scanlineClass,
    bracketClass,
    className,
  ].filter(Boolean).join(' ');

  const clipPathStyle = chamfer !== 'md' && chamfer !== 'none'
    ? { clipPath: CHAMFER_CLIP_PATHS[chamfer] }
    : undefined;

  const hasHead = Boolean(header || title || actions);

  return (
    <div
      ref={ref}
      className={combinedClassName}
      style={{
        ...clipPathStyle,
        ...style,
      }}
      {...rest}
    >
      {hasHead && (
        <header className="ris-panel-head">
          {header ? (
            header
          ) : (
            <>
              {title && (
                <div className="ris-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {typeof title === 'string' ? (
                    <span
                      style={{
                        fontFamily: 'var(--ris-font-display)',
                        fontSize: 'var(--ris-text-sm)',
                        fontWeight: 'var(--ris-w-semi, 600)',
                        letterSpacing: 'var(--ris-track-wide, 0.08em)',
                        textTransform: 'uppercase',
                        color: 'var(--ris-fg1)',
                      }}
                    >
                      {title}
                    </span>
                  ) : (
                    title
                  )}
                </div>
              )}
              {actions && (
                <div
                  className="ris-panel-actions"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--ris-s2, 8px)', marginLeft: 'auto' }}
                >
                  {actions}
                </div>
              )}
            </>
          )}
        </header>
      )}

      {children && (
        <div className={`ris-panel-body ${bodyClassName}`.trim()}>
          {children}
        </div>
      )}

      {footer && (
        <footer className="ris-panel-foot">
          {footer}
        </footer>
      )}
    </div>
  );
});

Panel.displayName = 'Panel';
