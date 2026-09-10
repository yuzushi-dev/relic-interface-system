import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroReticleVariant = 'crosshair' | 'corner-box' | 'optic-survey' | 'target-circle';
export type MicroReticlePreset = 'target-lock' | 'corner-bracket' | 'optic-grid';

export interface MicroReticleProps extends MicroBaseProps {
  /** Visual variant of the reticle */
  variant?: MicroReticleVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroReticlePreset;
  /** Azimuth / survey bearing in degrees (0–360) */
  bearing?: number;
  /** Target acquisition lock state */
  locked?: boolean;
  /** Whether graduation ticks / cardinal markers are displayed */
  ticks?: boolean;
}

/**
 * Tactical Reticle Atom (`<MicroReticle>`).
 * Provides high-density targeting crosshairs, chamfered corner alignment brackets,
 * optical survey circles, and target locks for HUD overlays and telemetry dashboards.
 */
export const MicroReticle = forwardRef<SVGSVGElement, MicroReticleProps>(function MicroReticle(
  {
    variant,
    preset,
    bearing,
    locked,
    ticks,
    brand,
    status,
    size = 'md',
    animated = false,
    className = '',
    style,
    ...rest
  },
  ref
) {
  // Preset defaults resolution
  const effectiveVariant: MicroReticleVariant = variant ?? (
    preset === 'corner-bracket' ? 'corner-box' :
    preset === 'optic-grid' ? 'optic-survey' :
    preset === 'target-lock' ? 'target-circle' :
    'crosshair'
  );

  const effectiveLocked: boolean = locked ?? (preset === 'target-lock');
  const effectiveTicks: boolean = ticks ?? (
    preset === 'optic-grid' || preset === 'target-lock' || preset === 'corner-bracket'
  );

  const dimension = resolveMicroSize(size, 32);
  const color = resolveMicroColor(status, brand);

  const pulseClass = animated ? 'ris-micro-pulse' : '';

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 32"
      width={dimension}
      height={dimension}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      shapeRendering="geometricPrecision"
      role="img"
      aria-hidden={rest['aria-label'] ? undefined : true}
      data-variant={effectiveVariant}
      data-brand={brand}
      data-status={status}
      data-locked={effectiveLocked ? 'true' : undefined}
      className={`ris-micro-reticle ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 1. CROSSHAIR VARIANT */}
      {effectiveVariant === 'crosshair' && (
        <g>
          {/* Main coordinate axes with center gap */}
          <line x1="2" y1="16" x2="11" y2="16" />
          <line x1="21" y1="16" x2="30" y2="16" />
          <line x1="16" y1="2" x2="16" y2="11" />
          <line x1="16" y1="21" x2="16" y2="30" />

          {/* Center target indicator */}
          {effectiveLocked ? (
            <g className={pulseClass}>
              {/* 45° chamfered lock diamond */}
              <polygon points="16,10 22,16 16,22 10,16" strokeWidth="1.25" />
              <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            </g>
          ) : (
            <g>
              <circle cx="16" cy="16" r="3.5" strokeDasharray="1.5 1.5" />
              <circle cx="16" cy="16" r="1" fill="currentColor" />
            </g>
          )}

          {/* Graduation ticks along axes */}
          {effectiveTicks && (
            <g strokeWidth="1">
              {/* Horizontal axis ticks */}
              <line x1="6" y1="14.5" x2="6" y2="17.5" />
              <line x1="9" y1="14.5" x2="9" y2="17.5" />
              <line x1="23" y1="14.5" x2="23" y2="17.5" />
              <line x1="26" y1="14.5" x2="26" y2="17.5" />

              {/* Vertical axis ticks */}
              <line x1="14.5" y1="6" x2="17.5" y2="6" />
              <line x1="14.5" y1="9" x2="17.5" y2="9" />
              <line x1="14.5" y1="23" x2="17.5" y2="23" />
              <line x1="14.5" y1="26" x2="17.5" y2="26" />

              {/* Cardinal boundary stops */}
              <line x1="2" y1="14" x2="2" y2="18" strokeWidth="1.25" />
              <line x1="30" y1="14" x2="30" y2="18" strokeWidth="1.25" />
              <line x1="14" y1="2" x2="18" y2="2" strokeWidth="1.25" />
              <line x1="14" y1="30" x2="18" y2="30" strokeWidth="1.25" />
            </g>
          )}

          {/* Bearing indicator */}
          {bearing !== undefined && (
            <g transform={`rotate(${bearing} 16 16)`}>
              <line x1="16" y1="11" x2="16" y2="3" strokeWidth="1.25" strokeDasharray="2 1" />
              <polygon points="16,1 14,4 18,4" fill="currentColor" stroke="none" />
            </g>
          )}
        </g>
      )}

      {/* 2. CORNER-BOX VARIANT */}
      {effectiveVariant === 'corner-box' && (
        <g>
          {/* 4 Brutalist 45° Chamfered Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
          <path d="M 4 11 L 4 6 L 6 4 L 11 4" strokeWidth="1.25" />
          <path d="M 21 4 L 26 4 L 28 6 L 28 11" strokeWidth="1.25" />
          <path d="M 4 21 L 4 26 L 6 28 L 11 28" strokeWidth="1.25" />
          <path d="M 21 28 L 26 28 L 28 26 L 28 21" strokeWidth="1.25" />

          {/* Center reticle cross and pip */}
          <path d="M 13 16 H 19 M 16 13 V 19" strokeWidth="1" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />

          {/* Locked frame */}
          {effectiveLocked && (
            <polygon
              points="13,11 19,11 21,13 21,19 19,21 13,21 11,19 11,13"
              strokeWidth="1.25"
              className={pulseClass}
            />
          )}

          {/* Mid-edge ticks and corner marks */}
          {effectiveTicks && (
            <g strokeWidth="1">
              <line x1="16" y1="2" x2="16" y2="5" />
              <line x1="16" y1="27" x2="16" y2="30" />
              <line x1="2" y1="16" x2="5" y2="16" />
              <line x1="27" y1="16" x2="30" y2="16" />

              {/* Corner alignment pips */}
              <circle cx="8" cy="8" r="0.75" fill="currentColor" stroke="none" />
              <circle cx="24" cy="8" r="0.75" fill="currentColor" stroke="none" />
              <circle cx="8" cy="24" r="0.75" fill="currentColor" stroke="none" />
              <circle cx="24" cy="24" r="0.75" fill="currentColor" stroke="none" />
            </g>
          )}

          {/* Bearing indicator */}
          {bearing !== undefined && (
            <g transform={`rotate(${bearing} 16 16)`}>
              <line x1="16" y1="11" x2="16" y2="2" strokeWidth="1.25" strokeDasharray="2 1" />
              <polygon points="16,1 14,4 18,4" fill="currentColor" stroke="none" />
            </g>
          )}
        </g>
      )}

      {/* 3. OPTIC-SURVEY VARIANT */}
      {effectiveVariant === 'optic-survey' && (
        <g>
          {/* Outer survey ring */}
          <circle cx="16" cy="16" r="13" strokeWidth="1" />
          {/* Inner survey scale */}
          <circle cx="16" cy="16" r="6" strokeWidth="1" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />

          {/* Cardinal coordinate axes extending beyond ring */}
          <line x1="16" y1="1" x2="16" y2="6" strokeWidth="1" />
          <line x1="16" y1="26" x2="16" y2="31" strokeWidth="1" />
          <line x1="1" y1="16" x2="6" y2="16" strokeWidth="1" />
          <line x1="26" y1="16" x2="31" y2="16" strokeWidth="1" />

          {/* Radial tick marks */}
          {effectiveTicks && (
            <g strokeWidth="1">
              {/* 45-degree radial ticks */}
              <g transform="rotate(45 16 16)">
                <line x1="16" y1="2.5" x2="16" y2="5" />
                <line x1="16" y1="27" x2="16" y2="29.5" />
                <line x1="2.5" y1="16" x2="5" y2="16" />
                <line x1="27" y1="16" x2="29.5" y2="16" />
              </g>

              {/* Inner ring quadrant marks */}
              <line x1="16" y1="9" x2="16" y2="11" />
              <line x1="16" y1="21" x2="16" y2="23" />
              <line x1="9" y1="16" x2="11" y2="16" />
              <line x1="21" y1="16" x2="23" y2="16" />
            </g>
          )}

          {/* Locked target indicator */}
          {effectiveLocked && (
            <polygon
              points="16,8 24,16 16,24 8,16"
              strokeWidth="1.25"
              className={pulseClass}
            />
          )}

          {/* Bearing indicator / continuous radar sweep */}
          {bearing !== undefined ? (
            <g transform={`rotate(${bearing} 16 16)`}>
              <line x1="16" y1="16" x2="16" y2="3" strokeWidth="1.25" strokeDasharray="3 1" />
              <polygon points="16,1 14,4 18,4" fill="currentColor" stroke="none" />
            </g>
          ) : animated ? (
            <g className="ris-micro-spin" style={{ transformOrigin: '16px 16px' }}>
              <line x1="16" y1="16" x2="16" y2="3" strokeWidth="1.25" />
              <polygon points="16,1 14,4 18,4" fill="currentColor" stroke="none" />
            </g>
          ) : null}
        </g>
      )}

      {/* 4. TARGET-CIRCLE VARIANT */}
      {effectiveVariant === 'target-circle' && (
        <g>
          {/* Segmented outer quadrant arcs with cardinal gaps */}
          <path d="M 19 3.42 A 13 13 0 0 1 28.58 13" strokeWidth="1.25" />
          <path d="M 28.58 19 A 13 13 0 0 1 19 28.58" strokeWidth="1.25" />
          <path d="M 13 28.58 A 13 13 0 0 1 3.42 19" strokeWidth="1.25" />
          <path d="M 3.42 13 A 13 13 0 0 1 13 3.42" strokeWidth="1.25" />

          {/* Inner target circle */}
          <circle cx="16" cy="16" r="6.5" strokeWidth="1" />
          {/* Bullseye pip */}
          <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />

          {/* Cardinal crosshair guides cutting through outer gaps */}
          <line x1="16" y1="2" x2="16" y2="9.5" strokeWidth="1" />
          <line x1="16" y1="22.5" x2="16" y2="30" strokeWidth="1" />
          <line x1="2" y1="16" x2="9.5" y2="16" strokeWidth="1" />
          <line x1="22.5" y1="16" x2="30" y2="16" strokeWidth="1" />

          {/* Locked clamp brackets */}
          {effectiveLocked && (
            <g strokeWidth="1.25" className={pulseClass}>
              <path d="M 10 13 V 10 H 13" />
              <path d="M 19 10 H 22 V 13" />
              <path d="M 10 19 V 22 H 13" />
              <path d="M 19 22 H 22 V 19" />
            </g>
          )}

          {/* Diagonal ticks */}
          {effectiveTicks && (
            <g transform="rotate(45 16 16)" strokeWidth="1">
              <line x1="16" y1="2" x2="16" y2="4.5" />
              <line x1="16" y1="27.5" x2="16" y2="30" />
              <line x1="2" y1="16" x2="4.5" y2="16" />
              <line x1="27.5" y1="16" x2="30" y2="16" />
            </g>
          )}

          {/* Bearing indicator */}
          {bearing !== undefined && (
            <g transform={`rotate(${bearing} 16 16)`}>
              <line x1="16" y1="16" x2="16" y2="3" strokeWidth="1.25" strokeDasharray="3 1" />
              <polygon points="16,1 14,4 18,4" fill="currentColor" stroke="none" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
});

MicroReticle.displayName = 'MicroReticle';
