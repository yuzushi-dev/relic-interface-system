import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroDialVariant = 'needle' | 'arc' | 'radial-ticks' | 'segmented';
export type MicroDialPreset = 'frequency' | 'power-gauge' | 'compass' | 'azimuth-90';

export interface MicroDialProps extends MicroBaseProps {
  /** Visual variant of the dial: 'needle' | 'arc' | 'radial-ticks' | 'segmented' */
  variant?: MicroDialVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroDialPreset;
  /** Current dial telemetry value (default: 50) */
  value?: number;
  /** Minimum gauge value (default: 0) */
  min?: number;
  /** Maximum gauge value (default: 100) */
  max?: number;
  /** Number of radial scale divisions (default: 12) */
  divisions?: number;
  /** Total arc sweep angle in degrees (default: 360) */
  sweepAngle?: number;
}

/**
 * Calculates SVG arc path string for a circle sector between startAngle and endAngle (in degrees).
 */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const diff = endAngle - startAngle;
  if (Math.abs(diff) >= 359.9) {
    const midAngle = startAngle + 180;
    const sRad = (startAngle * Math.PI) / 180;
    const mRad = (midAngle * Math.PI) / 180;
    const x0 = Number((cx + r * Math.cos(sRad)).toFixed(2));
    const y0 = Number((cy + r * Math.sin(sRad)).toFixed(2));
    const xm = Number((cx + r * Math.cos(mRad)).toFixed(2));
    const ym = Number((cy + r * Math.sin(mRad)).toFixed(2));
    return `M ${x0} ${y0} A ${r} ${r} 0 1 1 ${xm} ${ym} A ${r} ${r} 0 1 1 ${x0} ${y0}`;
  }

  const sRad = (startAngle * Math.PI) / 180;
  const eRad = (endAngle * Math.PI) / 180;
  const x1 = Number((cx + r * Math.cos(sRad)).toFixed(2));
  const y1 = Number((cy + r * Math.sin(sRad)).toFixed(2));
  const x2 = Number((cx + r * Math.cos(eRad)).toFixed(2));
  const y2 = Number((cy + r * Math.sin(eRad)).toFixed(2));
  const largeArcFlag = Math.abs(diff) > 180 ? 1 : 0;
  const sweepFlag = diff >= 0 ? 1 : 0;

  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
}

/**
 * Tactical Dial & Azimuth Gauge Atom (`<MicroDial>`).
 * Provides precision circular telemetry with radial division ticks, rotating indicator needle,
 * center pivot pips, quantized arc tracks, and rotating radar sweeps.
 */
export const MicroDial = forwardRef<SVGSVGElement, MicroDialProps>(function MicroDial(
  {
    variant,
    preset,
    value = 50,
    min = 0,
    max = 100,
    divisions,
    sweepAngle,
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
  const effectiveVariant: MicroDialVariant = variant ?? (
    preset === 'power-gauge' ? 'arc' :
    preset === 'compass' ? 'radial-ticks' :
    preset === 'azimuth-90' ? 'arc' :
    preset === 'frequency' ? 'needle' :
    'needle'
  );

  const effectiveSweepAngle: number = sweepAngle ?? (
    preset === 'power-gauge' ? 240 :
    preset === 'azimuth-90' ? 90 :
    360
  );

  const effectiveDivisions: number = divisions ?? (
    preset === 'compass' ? 16 :
    preset === 'power-gauge' ? 10 :
    preset === 'azimuth-90' ? 6 :
    preset === 'frequency' ? 16 :
    12
  );

  // Normalize telemetry value within [min, max]
  const safeRange = max !== min ? max - min : 1;
  const clampedValue = Math.min(Math.max(value, min), max);
  const fraction = (clampedValue - min) / safeRange;

  // Geometry: Dial center at (16, 16) inside 32x32 viewbox
  const startAngle = preset === 'azimuth-90'
    ? -90
    : effectiveSweepAngle >= 360
    ? -90
    : 90 + (360 - effectiveSweepAngle) / 2;

  const currentAngle = startAngle + fraction * effectiveSweepAngle;
  // Needle pointing up (-90°) rotates by (currentAngle + 90)
  const needleRotation = currentAngle + 90;

  const dimension = resolveMicroSize(size, 32);
  const color = resolveMicroColor(status, brand);

  const isSpinning = animated && (effectiveVariant === 'needle' || preset === 'frequency');

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
      data-preset={preset}
      data-brand={brand}
      data-status={status}
      className={`ris-micro-dial ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 1. NEEDLE VARIANT */}
      {effectiveVariant === 'needle' && (
        <g>
          {/* Dial bezel track */}
          {effectiveSweepAngle >= 360 ? (
            <circle cx="16" cy="16" r="13.5" strokeWidth="1" opacity="0.35" />
          ) : (
            <path
              d={describeArc(16, 16, 13.5, startAngle, startAngle + effectiveSweepAngle)}
              strokeWidth="1"
              opacity="0.35"
            />
          )}

          {/* Concentric inner reference ring */}
          <circle cx="16" cy="16" r="9.5" strokeWidth="0.75" strokeDasharray="1.5 2" opacity="0.2" />

          {/* Radial division graduation ticks */}
          {(() => {
            const tickCount = effectiveSweepAngle >= 360 ? effectiveDivisions : effectiveDivisions + 1;
            const items: React.ReactNode[] = [];
            for (let i = 0; i < tickCount; i++) {
              const tickAngle = startAngle + (i / effectiveDivisions) * effectiveSweepAngle;
              const isMajor = i % (effectiveDivisions >= 16 ? 4 : 3) === 0 || i === 0 || i === effectiveDivisions;
              const len = isMajor ? 3.5 : 1.75;
              const rad = (tickAngle * Math.PI) / 180;
              const x1 = Number((16 + (13.5 - len) * Math.cos(rad)).toFixed(2));
              const y1 = Number((16 + (13.5 - len) * Math.sin(rad)).toFixed(2));
              const x2 = Number((16 + 13.5 * Math.cos(rad)).toFixed(2));
              const y2 = Number((16 + 13.5 * Math.sin(rad)).toFixed(2));
              items.push(
                <line
                  key={`tick-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={isMajor ? 1 : 0.75}
                  opacity={isMajor ? 0.9 : 0.45}
                />
              );
            }
            return items;
          })()}

          {/* Rotating Needle / Radar Sweep Group */}
          <g
            className={isSpinning ? 'ris-micro-spin' : undefined}
            transform={isSpinning ? undefined : `rotate(${needleRotation} 16 16)`}
            style={{ transformOrigin: '16px 16px' }}
          >
            {/* Primary Indicator Needle */}
            <line x1="16" y1="16" x2="16" y2="4.5" strokeWidth="1.25" />
            {/* 45° Chamfered Pointer Arrowhead */}
            <polygon points="16,2.5 14.2,5.5 17.8,5.5" fill="currentColor" stroke="none" />
            {/* Counterweight Tail */}
            <line x1="16" y1="16" x2="16" y2="19" strokeWidth="1.5" />
            {/* Crossbar Notch */}
            <line x1="14.5" y1="9.5" x2="17.5" y2="9.5" strokeWidth="0.75" />

            {/* Radar trailing sweep line when in frequency mode */}
            {preset === 'frequency' && (
              <g opacity="0.3">
                <line x1="16" y1="16" x2="13" y2="5" strokeWidth="0.75" strokeDasharray="2 1" />
                <line x1="16" y1="16" x2="10" y2="6.5" strokeWidth="0.5" opacity="0.5" />
              </g>
            )}
          </g>

          {/* Center Pivot Pip */}
          <circle cx="16" cy="16" r="2.5" fill="var(--ris-bg, #0a0a0c)" strokeWidth="1" />
          <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />

          {/* Micro Telemetry Label */}
          {preset === 'frequency' && (
            <text
              x="16"
              y="25.5"
              textAnchor="middle"
              fontSize="4"
              fontFamily="var(--ris-font-mono, monospace)"
              opacity="0.6"
              fill="currentColor"
              stroke="none"
            >
              FRQ
            </text>
          )}
        </g>
      )}

      {/* 2. ARC VARIANT */}
      {effectiveVariant === 'arc' && (
        <g>
          {/* Background Arc Track */}
          <path
            d={describeArc(16, 16, 11.5, startAngle, startAngle + effectiveSweepAngle)}
            strokeWidth="1.5"
            opacity="0.2"
          />

          {/* Active Telemetry Arc */}
          {fraction > 0.005 && (
            <path
              d={describeArc(16, 16, 11.5, startAngle, currentAngle)}
              strokeWidth="2"
              opacity="1"
            />
          )}

          {/* Active Tip Marker Pip */}
          {(() => {
            const rad = (currentAngle * Math.PI) / 180;
            const tipX = Number((16 + 11.5 * Math.cos(rad)).toFixed(2));
            const tipY = Number((16 + 11.5 * Math.sin(rad)).toFixed(2));
            return (
              <circle
                cx={tipX}
                cy={tipY}
                r="1.75"
                fill="currentColor"
                stroke="none"
                className={animated ? 'ris-micro-pulse' : undefined}
              />
            );
          })()}

          {/* Scale Graduation Ticks */}
          {(() => {
            const items: React.ReactNode[] = [];
            const count = effectiveDivisions;
            for (let i = 0; i <= count; i++) {
              const tickAngle = startAngle + (i / count) * effectiveSweepAngle;
              const rad = (tickAngle * Math.PI) / 180;
              const x1 = Number((16 + 12.5 * Math.cos(rad)).toFixed(2));
              const y1 = Number((16 + 12.5 * Math.sin(rad)).toFixed(2));
              const x2 = Number((16 + 14 * Math.cos(rad)).toFixed(2));
              const y2 = Number((16 + 14 * Math.sin(rad)).toFixed(2));
              const isMajor = i === 0 || i === count || i === Math.round(count / 2);
              items.push(
                <line
                  key={`arc-tick-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={isMajor ? 1 : 0.75}
                  opacity={isMajor ? 0.8 : 0.35}
                />
              );
            }
            return items;
          })()}

          {/* Digital Telemetry Value Readout */}
          <text
            x="16"
            y="16"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="6"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            stroke="none"
          >
            {Math.round(clampedValue)}
          </text>
          <text
            x="16"
            y="22"
            textAnchor="middle"
            fontSize="3.5"
            fontFamily="var(--ris-font-mono, monospace)"
            opacity="0.55"
            fill="currentColor"
            stroke="none"
          >
            {preset === 'power-gauge' ? 'PWR' : '%'}
          </text>
        </g>
      )}

      {/* 3. RADIAL-TICKS VARIANT */}
      {effectiveVariant === 'radial-ticks' && (
        <g>
          {/* Outer Compass / Azimuth Ring */}
          <circle cx="16" cy="16" r="13.5" strokeWidth="1" opacity="0.5" />
          {/* Inner Dotted Guideline */}
          <circle cx="16" cy="16" r="8.5" strokeWidth="0.75" strokeDasharray="1.5 1.5" opacity="0.3" />

          {/* Radial Graduation Scale */}
          {(() => {
            const count = effectiveDivisions;
            const items: React.ReactNode[] = [];
            for (let i = 0; i < count; i++) {
              const tickAngle = startAngle + (i / count) * effectiveSweepAngle;
              const cardinalStep = Math.max(1, Math.floor(count / 4));
              const isCardinal = i % cardinalStep === 0;
              const len = isCardinal ? 4 : 2;
              const rad = (tickAngle * Math.PI) / 180;
              const x1 = Number((16 + (13.5 - len) * Math.cos(rad)).toFixed(2));
              const y1 = Number((16 + (13.5 - len) * Math.sin(rad)).toFixed(2));
              const x2 = Number((16 + 13.5 * Math.cos(rad)).toFixed(2));
              const y2 = Number((16 + 13.5 * Math.sin(rad)).toFixed(2));
              items.push(
                <line
                  key={`rt-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={isCardinal ? 1.25 : 0.75}
                  opacity={isCardinal ? 0.95 : 0.4}
                />
              );
            }
            return items;
          })()}

          {/* Compass Cardinal Points */}
          {preset === 'compass' ? (
            <g stroke="none" fill="currentColor">
              {/* North Cardinal Arrow */}
              <polygon points="16,3 14.5,5.5 17.5,5.5" />
              {/* East Pip */}
              <circle cx="28.5" cy="16" r="1" />
              {/* South Pip */}
              <circle cx="16" cy="28.5" r="1" />
              {/* West Pip */}
              <circle cx="3.5" cy="16" r="1" />
              {/* North Label */}
              <text
                x="16"
                y="8.5"
                textAnchor="middle"
                fontSize="3.5"
                fontFamily="var(--ris-font-mono, monospace)"
                fontWeight="700"
              >
                N
              </text>
            </g>
          ) : null}

          {/* Azimuth Indicator Needle */}
          <g
            className={isSpinning ? 'ris-micro-spin' : undefined}
            transform={isSpinning ? undefined : `rotate(${needleRotation} 16 16)`}
            style={{ transformOrigin: '16px 16px' }}
          >
            <line x1="16" y1="16" x2="16" y2="5" strokeWidth="1.25" strokeDasharray="2 1" />
            <polygon points="16,3 14.5,6 17.5,6" fill="currentColor" stroke="none" />
          </g>

          {/* Center Pivot */}
          <circle cx="16" cy="16" r="2" fill="var(--ris-bg, #0a0a0c)" strokeWidth="1" />
          <circle cx="16" cy="16" r="0.75" fill="currentColor" stroke="none" />
        </g>
      )}

      {/* 4. SEGMENTED VARIANT */}
      {effectiveVariant === 'segmented' && (
        <g>
          {/* Radial Quantized Segments */}
          {(() => {
            const items: React.ReactNode[] = [];
            const step = effectiveSweepAngle / effectiveDivisions;
            for (let i = 0; i < effectiveDivisions; i++) {
              const segAngle = startAngle + (i + 0.5) * step;
              const threshold = (i + 0.5) / effectiveDivisions;
              const isActive = fraction >= threshold;
              const rad = (segAngle * Math.PI) / 180;
              const x1 = Number((16 + 9 * Math.cos(rad)).toFixed(2));
              const y1 = Number((16 + 9 * Math.sin(rad)).toFixed(2));
              const x2 = Number((16 + 13 * Math.cos(rad)).toFixed(2));
              const y2 = Number((16 + 13 * Math.sin(rad)).toFixed(2));
              items.push(
                <line
                  key={`seg-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth="2"
                  strokeLinecap="square"
                  opacity={isActive ? 1 : 0.18}
                />
              );
            }
            return items;
          })()}

          {/* Inner Dotted Guideline */}
          <circle cx="16" cy="16" r="6.5" strokeWidth="0.75" strokeDasharray="1.5 1.5" opacity="0.3" />

          {/* Center Pivot & Status Pip */}
          <circle cx="16" cy="16" r="2.5" fill="var(--ris-bg, #0a0a0c)" strokeWidth="1" />
          <circle
            cx="16"
            cy="16"
            r="1"
            fill="currentColor"
            stroke="none"
            className={animated ? 'ris-micro-pulse' : undefined}
          />
        </g>
      )}
    </svg>
  );
});

MicroDial.displayName = 'MicroDial';
