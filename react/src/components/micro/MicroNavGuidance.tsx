import { forwardRef } from 'react';
import {
  MicroNavGuidanceProps,
  MicroManeuver,
  EyewearOpticalProfile,
  RisBrand,
  RisMicroStatus,
  resolveMicroSize,
  resolveMicroColor,
} from './types.js';

export type { MicroNavGuidanceProps, MicroManeuver, EyewearOpticalProfile };

const MANEUVER_PATHS: Record<MicroManeuver, string> = {
  'straight': 'M 21,37 L 27,37 M 24,37 L 24,13 M 17,20 L 24,13 L 31,20',
  'slight-right': 'M 15,37 L 21,37 M 18,37 L 18,25 L 29,14 M 21,14 L 29,14 L 29,22',
  'right': 'M 13,37 L 19,37 M 16,37 L 16,26 L 20,22 L 33,22 M 26,15 L 33,22 L 26,29',
  'sharp-right': 'M 13,37 L 19,37 M 16,37 L 16,22 L 22,16 L 24,16 L 34,26 M 26,26 L 34,26 L 34,18',
  'slight-left': 'M 27,37 L 33,37 M 30,37 L 30,25 L 19,14 M 27,14 L 19,14 L 19,22',
  'left': 'M 29,37 L 35,37 M 32,37 L 32,26 L 28,22 L 15,22 M 22,15 L 15,22 L 22,29',
  'sharp-left': 'M 29,37 L 35,37 M 32,37 L 32,22 L 26,16 L 24,16 L 14,26 M 22,26 L 14,26 L 14,18',
  'u-turn': 'M 28,37 L 34,37 M 31,37 L 31,20 L 26,15 L 20,15 L 15,20 L 15,30 M 8,23 L 15,30 L 22,23',
};

function formatDistance(meters: number): string {
  if (meters < 999.5) {
    return `IN ${Math.round(meters)}M`;
  }
  return `IN ${(meters / 1000).toFixed(1)}KM`;
}

function resolveOpticalColor(
  profile?: EyewearOpticalProfile,
  brand: RisBrand = 'biohub',
  status?: RisMicroStatus
): string | undefined {
  if (profile) {
    switch (profile) {
      case 'phosphor-green':
        return '#2fe48a';
      case 'tactical-amber':
        return '#e6a23c';
      case 'cyber-cyan':
        return '#6fb3c9';
      case 'alert-red':
        return '#ff2d3c';
    }
  }
  return resolveMicroColor(status, brand);
}

/**
 * Tactical Turn-by-Turn Navigation Micro-HUD Component (`<MicroNavGuidance>`).
 * Provides high-contrast emissive wayfinding for smart glasses optical waveguides.
 * Features 45° chamfered vector maneuver glyphs, distance countdowns,
 * waypoint indicators, tactical ETA chips, and zero-reflow optical clarity.
 *
 * Native viewBox: 0 0 160 48 (10:3 aspect ratio).
 */
export const MicroNavGuidance = forwardRef<SVGSVGElement, MicroNavGuidanceProps>(function MicroNavGuidance(
  {
    maneuver = 'straight',
    distanceMeters = 120,
    streetName = 'VIA ROMA',
    eta = '16:42',
    brand = 'biohub',
    opticalProfile,
    status,
    size = 'md',
    animated = false,
    className = '',
    style,
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) {
  const totalWidth = 160;
  const totalHeight = 48;

  const width = typeof size === 'number' ? size : resolveMicroSize(size, totalWidth);
  const height = typeof size === 'number'
    ? Math.round(size * (totalHeight / totalWidth))
    : resolveMicroSize(size, totalHeight);

  const color = resolveOpticalColor(opticalProfile, brand, status);

  const opticalClass = opticalProfile
    ? {
        'phosphor-green': 'ris-eyewear-profile-phosphor',
        'tactical-amber': 'ris-eyewear-profile-amber',
        'cyber-cyan': 'ris-eyewear-profile-cyan',
        'alert-red': 'ris-eyewear-profile-alert',
      }[opticalProfile]
    : '';

  const formattedDistance = formatDistance(distanceMeters);
  const formattedStreet = (streetName ?? '').toUpperCase();
  const formattedEta = `[ETA ${eta}]`;
  const maneuverPath = MANEUVER_PATHS[maneuver] ?? MANEUVER_PATHS['straight'];

  const dynamicAriaLabel =
    ariaLabel ??
    `Navigation: ${maneuver.replace('-', ' ')}, ${formattedDistance}, ${formattedStreet}, ${formattedEta}`;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      width={rest.width ?? width}
      height={rest.height ?? height}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label={dynamicAriaLabel}
      data-maneuver={maneuver}
      data-brand={brand}
      data-optical-profile={opticalProfile}
      data-status={status}
      className={`ris-micro-nav ris-eyewear-glass ${opticalClass} ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      <title>{dynamicAriaLabel}</title>

      {/* 45° Chamfer Corner Alignment Ticks (Frame against real world) */}
      <path
        d="M 0 10 L 0 6 L 6 0 L 10 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 150 0 L 154 0 L 160 6 L 160 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 0 38 L 0 42 L 6 48 L 10 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 150 48 L 154 48 L 160 42 L 160 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.6"
        vectorEffect="non-scaling-stroke"
      />

      {/* Boundary alignment notches */}
      <line x1="80" y1="0" x2="80" y2="3" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
      <line x1="80" y1="45" x2="80" y2="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />

      {/* Caliper spine divider between maneuver and telemetry */}
      <line
        x1="44"
        y1="6"
        x2="44"
        y2="42"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
        vectorEffect="non-scaling-stroke"
      />
      <line x1="42" y1="12" x2="44" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />
      <line x1="41" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
      <line x1="42" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />

      {/* 45° Directional Maneuver Vector Arrow Glyph */}
      <g className="ris-micro-nav-glyph">
        <path
          d={maneuverPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          shapeRendering="geometricPrecision"
          vectorEffect="non-scaling-stroke"
          className={animated ? 'ris-micro-pulse' : undefined}
        />
      </g>

      {/* Right Side Telemetry & Waypoint Block */}
      <g className="ris-micro-nav-telemetry">
        {/* Distance Countdown */}
        <text
          x="52"
          y="16"
          fontSize="13"
          fontWeight="800"
          fontFamily="var(--ris-font-mono, monospace)"
          letterSpacing="0.04em"
          fill="currentColor"
          stroke="none"
        >
          {formattedDistance}
        </text>

        {/* Street / Waypoint */}
        <text
          x="52"
          y="29"
          fontSize="9.5"
          fontWeight="700"
          fontFamily="var(--ris-font-mono, monospace)"
          letterSpacing="0.08em"
          fill="currentColor"
          stroke="none"
          opacity="0.9"
        >
          {formattedStreet}
        </text>

        {/* Tactical ETA Chip */}
        <text
          x="52"
          y="42"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="var(--ris-font-mono, monospace)"
          letterSpacing="0.06em"
          fill="currentColor"
          stroke="none"
          opacity="0.8"
        >
          {formattedEta}
        </text>

        {/* Operational Status Pip */}
        <circle
          cx="152"
          cy="12"
          r="1.5"
          fill="currentColor"
          opacity="0.8"
          className={animated ? 'ris-micro-blink' : undefined}
        />
      </g>
    </svg>
  );
});

MicroNavGuidance.displayName = 'MicroNavGuidance';
