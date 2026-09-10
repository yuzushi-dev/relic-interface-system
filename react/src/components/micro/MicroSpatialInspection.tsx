import { forwardRef } from 'react';
import {
  MicroSpatialInspectionProps,
  MicroSpatialInspectionStatus,
  EyewearOpticalProfile,
  RisBrand,
  resolveMicroSize,
  resolveMicroColor,
} from './types.js';

export type {
  MicroSpatialInspectionProps,
  MicroSpatialInspectionStatus,
  EyewearOpticalProfile,
};

function resolveInspectionColor(
  opticalProfile?: EyewearOpticalProfile,
  brand: RisBrand = 'biohub',
  status: MicroSpatialInspectionStatus = 'locked'
): string {
  if (opticalProfile) {
    switch (opticalProfile) {
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

  if (status === 'standby') {
    return 'var(--ris-fg4, #97a4ad)';
  }

  return resolveMicroColor(undefined, brand) ?? '#6fb3c9';
}

/**
 * Tactical Central Spatial Boresight Targeting Frame (`<MicroSpatialInspection>`).
 * Provides high-precision spatial inspection for field engineers, logistics, and assembly.
 *
 * INVARIANT: The central 70-80% of the viewfinder is 100% HOLLOW and completely transparent
 * to allow unobstructed inspection of real-world objects, wiring, and machinery.
 *
 * Features 4 hollow 45° corner brackets, exterior boresight alignment ticks, lateral range ruler
 * with dynamic distance pip, and peripheral telemetry chips.
 *
 * Native viewBox: 0 0 160 120 (4:3 aspect ratio).
 */
export const MicroSpatialInspection = forwardRef<
  SVGSVGElement,
  MicroSpatialInspectionProps
>(function MicroSpatialInspection(
  {
    distanceMeters = 1.4,
    targetLabel = 'VALVE_ACTUATOR_B2',
    status = 'locked',
    specCode = 'P/N: 884-J · OK',
    bracketWidth = 120,
    bracketHeight = 84,
    opticalProfile,
    brand = 'biohub',
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
  const totalHeight = 120;

  const width = typeof size === 'number' ? size : resolveMicroSize(size, totalWidth);
  const height =
    typeof size === 'number'
      ? Math.round(size * (totalHeight / totalWidth))
      : resolveMicroSize(size, totalHeight);

  const color = resolveInspectionColor(opticalProfile, brand, status);

  const opticalClass = opticalProfile
    ? {
        'phosphor-green': 'ris-eyewear-profile-phosphor',
        'tactical-amber': 'ris-eyewear-profile-amber',
        'cyber-cyan': 'ris-eyewear-profile-cyan',
        'alert-red': 'ris-eyewear-profile-alert',
      }[opticalProfile] ?? `ris-eyewear-profile-${opticalProfile}`
    : '';

  // 4 Corner bracket coordinates centered around (80, 60)
  // Ensures central 70-80% is 100% hollow and free of any occluding geometry.
  const halfW = Math.max(20, Math.min(68, Math.round(bracketWidth / 2)));
  const halfH = Math.max(16, Math.min(48, Math.round(bracketHeight / 2)));

  const left = 80 - halfW;
  const right = 80 + halfW;
  const top = 60 - halfH;
  const bottom = 60 + halfH;

  const arm = 12;
  const chamfer = 4;

  // Lateral Range Ruler calculation (clamped between 0.2m and 10.0m)
  const rulerTopY = 24;
  const rulerBottomY = 96;
  const rulerHeight = rulerBottomY - rulerTopY; // 72px

  const clampedDist = Math.max(0.2, Math.min(10.0, distanceMeters));
  const distRatio = (clampedDist - 0.2) / (10.0 - 0.2); // 0 at 0.2m, 1 at 10.0m
  const pipY = Math.round(rulerBottomY - distRatio * rulerHeight);

  const cleanTargetLabel = (targetLabel ?? 'VALVE_ACTUATOR_B2').toUpperCase();
  const cleanStatus = (status ?? 'locked').toUpperCase();
  const cleanSpecCode = specCode ? specCode.toUpperCase() : '';

  const dynamicAriaLabel =
    ariaLabel ??
    `Spatial Inspection: ${cleanTargetLabel}, DST ${distanceMeters.toFixed(2)}M, status [${cleanStatus}]${
      cleanSpecCode ? `, ${cleanSpecCode}` : ''
    }`;

  const bracketAnimationClass =
    animated && status === 'scanning' ? 'ris-micro-pulse' : undefined;

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
      data-status={status}
      data-brand={brand}
      data-optical-profile={opticalProfile}
      className={`ris-micro-inspection ris-eyewear-glass ${opticalClass} ${className}`.trim()}
      style={{
        color,
        background: 'transparent !important',
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      <title>{dynamicAriaLabel}</title>

      {/* ====================================================================
          1. 4 HOLLOW 45° CORNER BRACKETS
          100% HOLLOW CENTER: Central 70-80% area is completely clear!
          ==================================================================== */}
      <g
        className={`ris-micro-inspection-brackets ${bracketAnimationClass ?? ''}`.trim()}
        opacity={status === 'standby' ? 0.5 : 1}
      >
        {/* Top-Left Bracket */}
        <path
          d={`M ${left} ${top + arm} L ${left} ${top + chamfer} L ${left + chamfer} ${top} L ${left + arm} ${top}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* Top-Right Bracket */}
        <path
          d={`M ${right - arm} ${top} L ${right - chamfer} ${top} L ${right} ${top + chamfer} L ${right} ${top + arm}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom-Left Bracket */}
        <path
          d={`M ${left} ${bottom - arm} L ${left} ${bottom - chamfer} L ${left + chamfer} ${bottom} L ${left + arm} ${bottom}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom-Right Bracket */}
        <path
          d={`M ${right - arm} ${bottom} L ${right - chamfer} ${bottom} L ${right} ${bottom - chamfer} L ${right} ${bottom - arm}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* ====================================================================
          2. EXTERIOR BORESIGHT ALIGNMENT TICKS (N / S / E / W)
          Strictly exterior: ZERO lines cross the central inspection field!
          ==================================================================== */}
      <g className="ris-micro-boresight-ticks" opacity="0.75">
        {/* North Tick (x=80, y=10 to 14) */}
        <line
          x1="80"
          y1="10"
          x2="80"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* South Tick (x=80, y=106 to 110) */}
        <line
          x1="80"
          y1="106"
          x2="80"
          y2="110"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* West Tick (x=12 to 16, y=60) */}
        <line
          x1="12"
          y1="60"
          x2="16"
          y2="60"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* East Tick (x=144 to 148, y=60) */}
        <line
          x1="144"
          y1="60"
          x2="148"
          y2="60"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* ====================================================================
          3. LATERAL RANGE RULER (Right Bay: x=148 to 155)
          Vertical guide with 5 quantile tick marks and active indicator pip
          ==================================================================== */}
      <g className="ris-micro-range-ruler">
        {/* Vertical ruler guide line */}
        <line
          x1="150"
          y1={rulerTopY}
          x2="150"
          y2={rulerBottomY}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
          vectorEffect="non-scaling-stroke"
        />

        {/* 5 Quantile Range Ticks (y=24, 42, 60, 78, 96) */}
        <line
          x1="148"
          y1="24"
          x2="153"
          y2="24"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="149"
          y1="42"
          x2="152"
          y2="42"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="148"
          y1="60"
          x2="153"
          y2="60"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="149"
          y1="78"
          x2="152"
          y2="78"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="148"
          y1="96"
          x2="153"
          y2="96"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />

        {/* Active Range Pip (Pointer triangle pointing left at the ruler) */}
        <polygon
          points={`155,${pipY - 2.5} 150.5,${pipY} 155,${pipY + 2.5}`}
          fill="currentColor"
          stroke="none"
          opacity="0.9"
        />
      </g>

      {/* ====================================================================
          4. TELEMETRY CHIPS (Top & Bottom, strictly outside center)
          ==================================================================== */}
      {/* Top Chip: Distance & Spec Code */}
      <g className="ris-micro-inspection-chip-top">
        <text
          x="20"
          y="12"
          fontSize="8.5"
          fontWeight="800"
          fontFamily="var(--ris-font-mono, monospace)"
          letterSpacing="0.04em"
          fill="currentColor"
          stroke="none"
        >
          {`DST: ${distanceMeters.toFixed(2)}M`}
        </text>

        {cleanSpecCode && (
          <text
            x="140"
            y="12"
            textAnchor="end"
            fontSize="7.5"
            fontWeight="600"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.04em"
            fill="currentColor"
            stroke="none"
            opacity="0.8"
          >
            {cleanSpecCode}
          </text>
        )}
      </g>

      {/* Bottom Chip: Target Label & Status */}
      <g className="ris-micro-inspection-chip-bottom">
        <text
          x="80"
          y="117"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fontFamily="var(--ris-font-mono, monospace)"
          letterSpacing="0.04em"
          fill="currentColor"
          stroke="none"
        >
          {cleanTargetLabel}
          <tspan opacity="0.85">{` · [${cleanStatus}]`}</tspan>
        </text>
      </g>
    </svg>
  );
});

MicroSpatialInspection.displayName = 'MicroSpatialInspection';
