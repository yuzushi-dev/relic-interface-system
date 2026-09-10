import { forwardRef } from 'react';
import {
  MicroVitalTelemetryProps,
  EyewearOpticalProfile,
  RisBrand,
  RisMicroStatus,
  resolveMicroSize,
  resolveMicroColor,
} from './types.js';

export type { MicroVitalTelemetryProps, EyewearOpticalProfile };

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

function formatAltitude(meters: number): string {
  if (isNaN(meters)) return '0M ALT';
  return `${Math.round(meters)}M ALT`;
}

function formatBatteryRuntime(hours?: number, percent: number = 68): string {
  if (hours !== undefined && !isNaN(hours)) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h > 0) {
      return `~${h}H ${m}M`;
    }
    return `~${m}M`;
  }
  return `${Math.round(percent)}%`;
}

/**
 * Tactical Biometrics & Environmental Sensor Micro-HUD Component (`<MicroVitalTelemetry>`).
 * Provides high-contrast emissive cardiac telemetry, altitude measurement,
 * and quantized power status for smart glasses optical waveguides.
 * Features a 45° chamfered pulse diamond glyph, 5-stage HR zone exertion monitor,
 * 4-segment quantized battery gauge, and zero-reflow tactical typography.
 *
 * Native viewBox: 0 0 160 48 (10:3 aspect ratio).
 */
export const MicroVitalTelemetry = forwardRef<SVGSVGElement, MicroVitalTelemetryProps>(
  function MicroVitalTelemetry(
    {
      heartRate = 138,
      hrZone = 3,
      altitudeMeters = 420,
      batteryPercent = 68,
      batteryRuntimeHours = 3.4,
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
    const height =
      typeof size === 'number'
        ? Math.round(size * (totalHeight / totalWidth))
        : resolveMicroSize(size, totalHeight);

    const color = resolveOpticalColor(opticalProfile, brand, status);

    const opticalClass = opticalProfile
      ? {
          'phosphor-green': 'ris-eyewear-profile-phosphor',
          'tactical-amber': 'ris-eyewear-profile-amber',
          'cyber-cyan': 'ris-eyewear-profile-cyan',
          'alert-red': 'ris-eyewear-profile-alert',
        }[opticalProfile] ?? `ris-eyewear-profile-${opticalProfile}`
      : '';

    const cleanHeartRate =
      typeof heartRate === 'number' && !isNaN(heartRate) ? Math.round(heartRate) : 138;
    const cleanHrZone =
      typeof hrZone === 'number' && !isNaN(hrZone)
        ? (Math.max(1, Math.min(5, Math.round(hrZone))) as 1 | 2 | 3 | 4 | 5)
        : 3;
    const cleanAltitude =
      typeof altitudeMeters === 'number' && !isNaN(altitudeMeters)
        ? Math.round(altitudeMeters)
        : 420;
    const cleanBatteryPercent =
      typeof batteryPercent === 'number' && !isNaN(batteryPercent)
        ? Math.max(0, Math.min(100, batteryPercent))
        : 68;
    const cleanBatteryHours =
      typeof batteryRuntimeHours === 'number' && !isNaN(batteryRuntimeHours)
        ? batteryRuntimeHours
        : 3.4;

    const formattedAltitude = formatAltitude(cleanAltitude);
    const runtimeText = formatBatteryRuntime(cleanBatteryHours, cleanBatteryPercent);

    const dynamicAriaLabel =
      ariaLabel ??
      `Vital telemetry: ${cleanHeartRate} BPM, Zone ${cleanHrZone}, ${formattedAltitude}, Battery ${Math.round(cleanBatteryPercent)}% (${runtimeText})`;

    // 4 discrete segments: width 4px, height 7px each, gap 1.5px (starts at x=88, y=29)
    // Thresholds: segment 0 (>0%), segment 1 (>=50%), segment 2 (>=75%), segment 3 (>=95%)
    const batterySegments = [
      { lit: cleanBatteryPercent > 0 },
      { lit: cleanBatteryPercent >= 50 },
      { lit: cleanBatteryPercent >= 75 },
      { lit: cleanBatteryPercent >= 95 },
    ];

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
        data-brand={brand}
        data-optical-profile={opticalProfile}
        data-status={status}
        data-hr-zone={cleanHrZone}
        data-animated={animated ? 'true' : 'false'}
        className={`ris-micro-vital ris-eyewear-glass ${opticalClass} ${className}`.trim()}
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

        {/* Center boundary alignment notches */}
        <line
          x1="82"
          y1="0"
          x2="82"
          y2="3"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="82"
          y1="45"
          x2="82"
          y2="48"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
          vectorEffect="non-scaling-stroke"
        />

        {/* Center Divider: 1px vertical spine at x=82 with 2 tick notches */}
        <g className="ris-micro-vital-divider">
          <line
            x1="82"
            y1="8"
            x2="82"
            y2="40"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          {/* Notch 1 (Row 1 alignment) */}
          <line
            x1="80"
            y1="16"
            x2="84"
            y2="16"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Notch 2 (Row 2 alignment) */}
          <line
            x1="80"
            y1="32"
            x2="84"
            y2="32"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Left Bay (x=6 to 76): Biometrics */}
        <g className="ris-micro-vital-heart">
          {/* 45° Chamfered Diamond Icon with ECG pulse */}
          <g
            className={animated ? 'ris-micro-pulse' : undefined}
            style={{ transformOrigin: '11px 17px' }}
          >
            {/* 45° Chamfered Diamond Perimeter */}
            <polygon
              points="9,11 13,11 17,15 17,19 13,23 9,23 5,19 5,15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Tactical ECG Pulse Trace */}
            <path
              d="M 7,17 L 9,17 L 10.5,14.5 L 11.5,19.5 L 12.5,16 L 13.5,17 L 15,17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Heart Rate Typography */}
          <text
            x="21"
            y="21"
            fontSize="13"
            fontWeight="800"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.02em"
            fill="currentColor"
            stroke="none"
          >
            {`${cleanHeartRate} BPM`}
          </text>

          {/* HR Zone Badge */}
          <text
            x="21"
            y="36"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.06em"
            fill="currentColor"
            stroke="none"
            opacity="0.85"
          >
            {`[Z${cleanHrZone}]`}
          </text>

          {/* 5-segment HR zone exertion indicator */}
          <g className="ris-micro-vital-zone-ticks" opacity="0.8">
            {[1, 2, 3, 4, 5].map((z) => {
              const isCurrentZone = z === cleanHrZone;
              const isBelowZone = z < cleanHrZone;
              const isLit = z <= cleanHrZone;
              return (
                <rect
                  key={z}
                  x={45 + (z - 1) * 6}
                  y={30}
                  width={4}
                  height={6}
                  fill={isCurrentZone ? 'currentColor' : isBelowZone ? 'currentColor' : 'none'}
                  fillOpacity={isCurrentZone ? 1 : isBelowZone ? 0.45 : 0}
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity={isLit ? 0.9 : 0.25}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        </g>

        {/* Right Bay (x=88 to 154): Environmental & Power */}
        <g className="ris-micro-vital-env">
          {/* Line 1: Altitude */}
          <text
            x="88"
            y="21"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.06em"
            fill="currentColor"
            stroke="none"
          >
            {formattedAltitude}
          </text>

          {/* Line 2: Battery Status */}
          <g className="ris-micro-vital-battery">
            {/* 4-segment 1px quantized battery meter */}
            {batterySegments.map((seg, idx) => (
              <rect
                key={idx}
                x={88 + idx * 5.5}
                y={29}
                width={4}
                height={7}
                fill={seg.lit ? 'currentColor' : 'none'}
                fillOpacity={seg.lit ? 1 : 0}
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity={seg.lit ? 1 : 0.3}
                shapeRendering="geometricPrecision"
                vectorEffect="non-scaling-stroke"
                className={
                  animated && cleanBatteryPercent <= 15 && idx === 0
                    ? 'ris-micro-blink'
                    : undefined
                }
              />
            ))}

            {/* Runtime Estimation Text */}
            <text
              x="113"
              y="36"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="var(--ris-font-mono, monospace)"
              letterSpacing="0.04em"
              fill="currentColor"
              stroke="none"
              opacity="0.9"
            >
              {runtimeText}
            </text>
          </g>
        </g>
      </svg>
    );
  }
);

MicroVitalTelemetry.displayName = 'MicroVitalTelemetry';
