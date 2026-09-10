import { forwardRef } from 'react';
import {
  SmartGlassesHUDProps,
  EyewearHudMode,
  EyewearOpticalProfile,
  RisBrand,
  RisMicroStatus,
  resolveMicroSize,
  resolveMicroColor,
  MicroNavGuidanceProps,
  MicroLiveCaptionsProps,
  MicroVitalTelemetryProps,
  MicroGlanceNoticeProps,
  MicroSpatialInspectionProps,
} from './types.js';
import { MicroNavGuidance } from './MicroNavGuidance.js';
import { MicroLiveCaptions } from './MicroLiveCaptions.js';
import { MicroVitalTelemetry } from './MicroVitalTelemetry.js';
import { MicroGlanceNotice } from './MicroGlanceNotice.js';
import { MicroSpatialInspection } from './MicroSpatialInspection.js';

export type { SmartGlassesHUDProps, EyewearHudMode, EyewearOpticalProfile };

const OPTICAL_PROFILE_COLORS: Record<EyewearOpticalProfile, string> = {
  'phosphor-green': '#2fe48a',
  'tactical-amber': '#e6a23c',
  'cyber-cyan': '#6fb3c9',
  'alert-red': '#ff2d3c',
};

const OPTICAL_PROFILE_CLASSES: Record<EyewearOpticalProfile, string> = {
  'phosphor-green': 'ris-eyewear-profile-phosphor',
  'tactical-amber': 'ris-eyewear-profile-amber',
  'cyber-cyan': 'ris-eyewear-profile-cyan',
  'alert-red': 'ris-eyewear-profile-alert',
};

function resolveOpticalColor(
  profile?: EyewearOpticalProfile,
  brand: RisBrand = 'biohub',
  status?: RisMicroStatus
): string | undefined {
  if (profile && OPTICAL_PROFILE_COLORS[profile]) {
    return OPTICAL_PROFILE_COLORS[profile];
  }
  return resolveMicroColor(status, brand);
}

const DEFAULT_NAV_DATA: Partial<MicroNavGuidanceProps> = {
  maneuver: 'slight-right',
  distanceMeters: 180,
  streetName: 'CORSO VITTORIO',
  eta: '08:45',
};

const DEFAULT_CAPTION_DATA: Partial<MicroLiveCaptionsProps> = {
  speaker: 'ELENA ROSTOVA',
  line1: 'WE HAVE FINALIZED THE TELEMETRY ARCHITECTURE.',
  line2: 'MOVING REVIEWS TO Q3 TIMELINE.',
  listening: true,
};

const DEFAULT_NOTICE_DATA: Partial<MicroGlanceNoticeProps> = {
  category: 'CALENDAR',
  title: 'NEXT: DESIGN SYNC',
  subtitle: 'IN 10 MIN · CONF RM B',
  severity: 'info',
  dismissProgress: 75,
};

const DEFAULT_INSPECTION_DATA: Partial<MicroSpatialInspectionProps> = {
  distanceMeters: 1.2,
  targetLabel: 'CONDUIT_COUPLER_04',
  status: 'locked',
  specCode: 'SPEC-A9 // PRESSURE OK',
  bracketWidth: 120,
  bracketHeight: 84,
};

const DEFAULT_VITAL_DATA: Partial<MicroVitalTelemetryProps> = {
  heartRate: 74,
  hrZone: 2,
  altitudeMeters: 142,
  batteryPercent: 88,
  batteryRuntimeHours: 4.5,
};

/**
 * Smart Glasses Master Composite HUD Container (`<SmartGlassesHUD>`).
 * Provides turnkey 16:9 heads-up display overlay for optical waveguide smart glasses.
 *
 * Orchestrates all 5 Relic Eyewear optical micro atoms:
 * - `MicroNavGuidance` (tactical wayfinding)
 * - `MicroLiveCaptions` (speech-to-text teleprompter)
 * - `MicroVitalTelemetry` (biometrics & altitude)
 * - `MicroGlanceNotice` (peripheral notification banner)
 * - `MicroSpatialInspection` (central boresight inspection)
 *
 * Features:
 * - Native 640x360 16:9 viewport geometry
 * - Strictly transparent background (zero opaque fills for optical waveguide physics)
 * - 4 peripheral 45° corner registration ticks at (12, 12), (628, 12), (12, 348), (628, 348)
 * - Top micro brand tag [ RIS // OPTIC-HUD ]
 * - 4 specialized operational modes: 'ambient', 'commute', 'meeting', 'field-ops'
 * - Zero-reflow motion and WCAG 2.2 AA compliant accessibility
 */
export const SmartGlassesHUD = forwardRef<SVGSVGElement, SmartGlassesHUDProps>(
  function SmartGlassesHUD(props, ref) {
    const {
      mode = 'ambient',
      opticalProfile = 'cyber-cyan',
      brand = 'biohub',
      status,
      size = 'md',
      animated = false,
      navData,
      captionData,
      vitalData,
      noticeData,
      inspectionData,
      className = '',
      style,
      'aria-label': ariaLabel,
      width: customWidth,
      height: customHeight,
      children,
      ...rest
    } = props;

    const totalWidth = 640;
    const totalHeight = 360;

    const width =
      customWidth ??
      (typeof size === 'number' ? size : resolveMicroSize(size, totalWidth));
    const height =
      customHeight ??
      (typeof size === 'number'
        ? Math.round(size * (totalHeight / totalWidth))
        : resolveMicroSize(size, totalHeight));

    const color = resolveOpticalColor(opticalProfile, brand, status);

    const opticalClass = opticalProfile
      ? (OPTICAL_PROFILE_CLASSES[opticalProfile] ?? `ris-eyewear-profile-${opticalProfile}`)
      : '';

    const dynamicAriaLabel = ariaLabel ?? 'Smart Glasses Heads Up Display';
    const modeUpper = mode.toUpperCase();

    // Ambient mode battery & telemetry calculations
    const ambientBatPercent = vitalData?.batteryPercent ?? 68;
    const ambientBatHours =
      vitalData?.batteryRuntimeHours !== undefined
        ? `~${vitalData.batteryRuntimeHours}H`
        : '~3.4H';
    const ambientBatteryString = `BAT ${ambientBatPercent}% (${ambientBatHours}) · 5G [ONLINE]`;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        shapeRendering="geometricPrecision"
        role="region"
        aria-label={dynamicAriaLabel}
        data-mode={mode}
        data-brand={brand}
        data-optical-profile={opticalProfile}
        data-status={status}
        className={`ris-eyewear-hud ris-eyewear-glass ${opticalClass} ${className}`.trim()}
        style={{
          background: 'transparent',
          color,
          overflow: 'visible',
          ...style,
        }}
        {...rest}
      >
        <title>{`Smart Glasses HUD - ${modeUpper}`}</title>

        {/* ==================================================================
            PERIPHERAL 45° CORNER REGISTRATION TICKS (640x360 Waveguide Framing)
            Corner coords: (12, 12), (628, 12), (12, 348), (628, 348)
            ================================================================== */}
        <g className="ris-hud-registration-ticks" strokeOpacity="0.6">
          {/* Top-Left: (12, 12) */}
          <path
            d="M 12 24 L 12 16 L 16 12 L 24 12"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" fillOpacity="0.4" />

          {/* Top-Right: (628, 12) */}
          <path
            d="M 616 12 L 624 12 L 628 16 L 628 24"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="628" cy="12" r="1.5" fill="currentColor" fillOpacity="0.4" />

          {/* Bottom-Left: (12, 348) */}
          <path
            d="M 12 336 L 12 344 L 16 348 L 24 348"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="12" cy="348" r="1.5" fill="currentColor" fillOpacity="0.4" />

          {/* Bottom-Right: (628, 348) */}
          <path
            d="M 616 348 L 624 348 L 628 344 L 628 336"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="628" cy="348" r="1.5" fill="currentColor" fillOpacity="0.4" />
        </g>

        {/* ==================================================================
            TOP CENTER MICRO BRAND & MODE TAG
            ================================================================== */}
        <g className="ris-hud-brand-tag" opacity="0.6">
          <text
            x="320"
            y="12"
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize="7.5"
            fontWeight="700"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            letterSpacing="1.8"
          >
            [ RIS // OPTIC-HUD // {modeUpper} ]
          </text>
        </g>

        {/* ==================================================================
            MODE 1: AMBIENT
            Top-Left: Live clock + battery/connectivity. 98% clear real world.
            ================================================================== */}
        {mode === 'ambient' && (
          <g
            transform="translate(24, 20)"
            role="group"
            aria-label="Ambient Telemetry"
          >
            {/* Tactical vertical indicator bar */}
            <line
              x1="0"
              y1="2"
              x2="0"
              y2="28"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="0" cy="2" r="1" fill="currentColor" />
            <circle cx="0" cy="28" r="1" fill="currentColor" />

            {/* Live clock */}
            <text
              x="8"
              y="14"
              fill="currentColor"
              fontSize="12"
              fontWeight="700"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              letterSpacing="0.8"
            >
              10:42 AM
            </text>

            {/* Battery & Connectivity */}
            <text
              x="8"
              y="27"
              fill="currentColor"
              fillOpacity="0.75"
              fontSize="8"
              fontWeight="600"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              letterSpacing="0.4"
            >
              {ambientBatteryString}
            </text>

            {/* Connection Pip */}
            <circle
              cx="160"
              cy="24.5"
              r="2"
              fill="currentColor"
              fillOpacity={animated ? '0.9' : '0.7'}
              className={animated ? 'ris-micro-pulse' : undefined}
            />
          </g>
        )}

        {/* ==================================================================
            MODE 2: COMMUTE
            Top-Right: MicroNavGuidance
            Top-Center: Tactical Compass Azimuth Heading Chip
            ================================================================== */}
        {mode === 'commute' && (
          <>
            {/* Top-Center Compass Heading Chip */}
            <g
              transform="translate(260, 20)"
              role="group"
              aria-label="Tactical Heading: 284° WNW"
            >
              {/* 45° Chamfered Heading Badge */}
              <path
                d="M 6 0 L 114 0 L 120 6 L 120 18 L 114 24 L 6 24 L 0 18 L 0 6 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.7"
                vectorEffect="non-scaling-stroke"
              />
              {/* Corner accent ticks */}
              <path
                d="M 3 0 L 0 0 L 0 3 M 117 0 L 120 0 L 120 3 M 0 21 L 0 24 L 3 24 M 120 21 L 120 24 L 117 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeOpacity="0.9"
                vectorEffect="non-scaling-stroke"
              />
              {/* Miniature heading pip */}
              <polygon
                points="20,7 24,17 20,15 16,17"
                fill="currentColor"
                fillOpacity="0.9"
              />
              {/* Heading readout */}
              <text
                x="66"
                y="15.5"
                textAnchor="middle"
                fill="currentColor"
                fontSize="9.5"
                fontWeight="700"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                letterSpacing="1"
              >
                [ 284° WNW ]
              </text>
              {/* Side calibration pip */}
              <circle cx="108" cy="12" r="1.5" fill="currentColor" fillOpacity="0.6" />
            </g>

            {/* Top-Right MicroNavGuidance */}
            <g transform="translate(456, 20)">
              <MicroNavGuidance
                brand={brand}
                opticalProfile={opticalProfile}
                animated={animated}
                width={160}
                height={44}
                {...DEFAULT_NAV_DATA}
                {...navData}
              />
            </g>
          </>
        )}

        {/* ==================================================================
            MODE 3: MEETING
            Top-Center: MicroGlanceNotice
            Bottom-Center: MicroLiveCaptions
            Central fovea completely clear for eye contact.
            ================================================================== */}
        {mode === 'meeting' && (
          <>
            {/* Top-Center MicroGlanceNotice */}
            <g transform="translate(210, 20)">
              <MicroGlanceNotice
                brand={brand}
                opticalProfile={opticalProfile}
                animated={animated}
                width={220}
                height={26}
                {...DEFAULT_NOTICE_DATA}
                {...noticeData}
              />
            </g>

            {/* Bottom-Center MicroLiveCaptions */}
            <g transform="translate(196, 296)">
              <MicroLiveCaptions
                brand={brand}
                opticalProfile={opticalProfile}
                animated={animated}
                width={248}
                height={44}
                {...DEFAULT_CAPTION_DATA}
                {...captionData}
              />
            </g>
          </>
        )}

        {/* ==================================================================
            MODE 4: FIELD-OPS
            Center: MicroSpatialInspection (100% hollow center)
            Top-Left: MicroVitalTelemetry
            Top-Right: Tactical Environmental Status Chip
            ================================================================== */}
        {mode === 'field-ops' && (
          <>
            {/* Center MicroSpatialInspection */}
            <g transform="translate(240, 120)">
              <MicroSpatialInspection
                brand={brand}
                opticalProfile={opticalProfile}
                animated={animated}
                width={160}
                height={120}
                {...DEFAULT_INSPECTION_DATA}
                {...inspectionData}
              />
            </g>

            {/* Top-Left MicroVitalTelemetry */}
            <g transform="translate(24, 20)">
              <MicroVitalTelemetry
                brand={brand}
                opticalProfile={opticalProfile}
                animated={animated}
                width={160}
                height={48}
                {...DEFAULT_VITAL_DATA}
                {...vitalData}
              />
            </g>

            {/* Top-Right Tactical Environmental Status Chip */}
            <g
              transform="translate(500, 20)"
              role="group"
              aria-label="Environmental Status: [AIR: NOMINAL] · RAD: 0.08 μSv/h"
            >
              <title>[AIR: NOMINAL] · RAD: 0.08 μSv/h</title>
              {/* 45° Chamfered Sensor Badge */}
              <path
                d="M 5 0 L 115 0 L 120 5 L 120 21 L 115 26 L 5 26 L 0 21 L 0 5 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.65"
                vectorEffect="non-scaling-stroke"
              />
              {/* Corner accent ticks */}
              <path
                d="M 3 0 L 0 0 L 0 3 M 117 0 L 120 0 L 120 3 M 0 23 L 0 26 L 3 26 M 120 23 L 120 26 L 117 26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeOpacity="0.85"
                vectorEffect="non-scaling-stroke"
              />
              {/* Sensor status pip */}
              <circle
                cx="10"
                cy="13"
                r="2"
                fill="currentColor"
                fillOpacity={animated ? '0.9' : '0.75'}
                className={animated ? 'ris-micro-pulse' : undefined}
              />
              {/* Status readout lines */}
              <text
                x="18"
                y="10.5"
                fill="currentColor"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                letterSpacing="0.8"
              >
                [AIR: NOMINAL]
              </text>
              <text
                x="18"
                y="20.5"
                fill="currentColor"
                fillOpacity="0.8"
                fontSize="7"
                fontWeight="600"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                letterSpacing="0.4"
              >
                RAD: 0.08 μSv/h
              </text>
            </g>
          </>
        )}

        {children}
      </svg>
    );
  }
);
