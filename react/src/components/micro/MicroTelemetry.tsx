import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroTelemetryVariant = 'inline' | 'stacked' | 'framed';
export type MicroTelemetryPreset = 'node-status' | 'system-reset' | 'epoch-diag';

export interface MicroTelemetryProps extends MicroBaseProps {
  /** Visual variant: 'inline' | 'stacked' | 'framed' */
  variant?: MicroTelemetryVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroTelemetryPreset;
  /** Tactical tracking-spaced monospace label (e.g. "NODE-01", "SYS-RST") */
  label?: string;
  /** Primary telemetry readout or bracketed status (e.g. "[ONLINE]", "[SYS-OK]") */
  value?: string | number;
  /** Technical status or hex diagnostic code (e.g. "ACK-200", "0x00FF") */
  code?: string;
  /** Katakana or technical kanji accent (e.g. "オンライン", "同期", "データ") */
  kanji?: string;
  /** Serial identification number stamp (e.g. "SN:9904-B", "RST-092") */
  serial?: string;
}

/**
 * Industrial Telemetry DataBlock Atom (`<MicroTelemetry>`).
 * Provides high-density multi-line technical metadata badges with serial stamps,
 * bracketed status indicators ([ONLINE], [OFFLINE], [SYS-OK]), tracking-spaced
 * monospace labels, Katakana accents, and 45° chamfered boundaries.
 */
export const MicroTelemetry = forwardRef<SVGSVGElement, MicroTelemetryProps>(function MicroTelemetry(
  {
    variant,
    preset,
    label,
    value,
    code,
    kanji,
    serial,
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
  const effectiveVariant: MicroTelemetryVariant = variant ?? (
    preset === 'node-status' ? 'framed' :
    preset === 'system-reset' ? 'stacked' :
    preset === 'epoch-diag' ? 'inline' :
    'stacked'
  );

  const effectiveLabel: string = label ?? (
    preset === 'node-status' ? 'NODE-01' :
    preset === 'system-reset' ? 'SYS-RST' :
    preset === 'epoch-diag' ? 'EPOCH' :
    'TELEMETRY'
  );

  const effectiveValue: string | number = value ?? (
    preset === 'node-status' ? '[ONLINE]' :
    preset === 'system-reset' ? '[SYS-OK]' :
    preset === 'epoch-diag' ? '[NOMINAL]' :
    '[ONLINE]'
  );

  const effectiveCode: string = code ?? (
    preset === 'node-status' ? 'ACK-200' :
    preset === 'system-reset' ? '0x00FF' :
    preset === 'epoch-diag' ? 'DIAG-X' :
    '0x7F'
  );

  const effectiveKanji: string = kanji ?? (
    preset === 'node-status' ? 'オンライン' :
    preset === 'system-reset' ? '同期' :
    preset === 'epoch-diag' ? 'データ' :
    'データ'
  );

  const effectiveSerial: string = serial ?? (
    preset === 'node-status' ? 'SN:9904-B' :
    preset === 'system-reset' ? 'RST-092' :
    preset === 'epoch-diag' ? 'EP-88' :
    'SN:402'
  );

  const effectiveStatus = status ?? (
    preset === 'node-status' ? 'nominal' :
    preset === 'system-reset' ? 'active' :
    preset === 'epoch-diag' ? 'nominal' :
    undefined
  );

  const color = resolveMicroColor(effectiveStatus, brand);

  // Dimension and viewBox resolution per variant
  let totalWidth = 72;
  let totalHeight = 36;
  if (effectiveVariant === 'inline') {
    totalWidth = 96;
    totalHeight = 24;
  } else if (effectiveVariant === 'framed') {
    totalWidth = 80;
    totalHeight = 40;
  }

  const width = typeof size === 'number' ? size : resolveMicroSize(size, totalWidth);
  const height = typeof size === 'number'
    ? Math.round(size * (totalHeight / totalWidth))
    : resolveMicroSize(size, totalHeight);

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
      aria-hidden={rest['aria-label'] ? undefined : true}
      data-variant={effectiveVariant}
      data-preset={preset}
      data-brand={brand}
      data-status={effectiveStatus}
      className={`ris-micro-telemetry ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* ====================================================================
          1. INLINE VARIANT: Sleek horizontal telemetry strip badge
          ==================================================================== */}
      {effectiveVariant === 'inline' && (
        <g>
          {/* 45° Chamfered Boundary Strip */}
          <polygon
            points="0,4 4,0 92,0 96,4 96,20 92,24 4,24 0,20"
            fill="currentColor"
            fillOpacity="0.04"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Left Corner Notches */}
          <line x1="0" y1="8" x2="0" y2="4" strokeWidth="1.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
          <line x1="4" y1="0" x2="8" y2="0" strokeWidth="1.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />

          {/* Status Indicator Pip */}
          <circle
            cx="6"
            cy="12"
            r="2"
            fill="currentColor"
            className={animated ? 'ris-micro-blink' : undefined}
          />

          {/* Katakana Accent (upper left) */}
          <text
            x="12"
            y="8.5"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.65"
            stroke="none"
          >
            {effectiveKanji}
          </text>

          {/* Primary Tracking Monospace Label */}
          <text
            x="12"
            y="18.5"
            fontSize="5.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            letterSpacing="0.08em"
            fill="currentColor"
            stroke="none"
          >
            {effectiveLabel}
          </text>

          {/* Divider Line with 45° Chamfer Pip */}
          <line
            x1="46"
            y1="4"
            x2="46"
            y2="20"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          <polygon
            points="46,11 47.5,12 46,13 44.5,12"
            fill="currentColor"
            opacity="0.7"
            stroke="none"
          />

          {/* Bracketed Status Value */}
          <text
            x="51"
            y="15.5"
            fontSize="6.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            letterSpacing="0.04em"
            fill="currentColor"
            stroke="none"
          >
            {effectiveValue}
          </text>

          {/* Diagnostic Code (Right Upper) */}
          <text
            x="91"
            y="9"
            textAnchor="end"
            fontSize="4"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            opacity="0.7"
            stroke="none"
          >
            {effectiveCode}
          </text>

          {/* Serial Stamp (Right Lower) */}
          <text
            x="91"
            y="18.5"
            textAnchor="end"
            fontSize="3.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.45"
            stroke="none"
          >
            {effectiveSerial}
          </text>
        </g>
      )}

      {/* ====================================================================
          2. STACKED VARIANT: Multi-line technical telemetry block
          ==================================================================== */}
      {effectiveVariant === 'stacked' && (
        <g>
          {/* Tactical Left Caliper Spine */}
          <line
            x1="2"
            y1="3"
            x2="2"
            y2="33"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <line x1="2" y1="3" x2="6" y2="3" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line x1="2" y1="33" x2="6" y2="33" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

          {/* Ticks along caliper spine */}
          <line x1="2" y1="11" x2="4.5" y2="11" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="2" y1="18" x2="5.5" y2="18" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="2" y1="25" x2="4.5" y2="25" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />

          {/* Top Row: Monospace Tracking Label & Katakana Accent */}
          <text
            x="8"
            y="8.5"
            fontSize="5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            letterSpacing="0.08em"
            fill="currentColor"
            stroke="none"
          >
            {effectiveLabel}
          </text>

          <text
            x="68"
            y="8.5"
            textAnchor="end"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.7"
            stroke="none"
          >
            {effectiveKanji}
          </text>

          {/* Divider Line */}
          <line
            x1="8"
            y1="11"
            x2="68"
            y2="11"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.3"
            vectorEffect="non-scaling-stroke"
          />

          {/* Middle Row: Value Container with Chamfered Tag */}
          <polygon
            points="8,15 10,13 60,13 62,15 62,23 60,25 10,25 8,23"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
          />

          <text
            x="35"
            y="21.5"
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            letterSpacing="0.05em"
            fill="currentColor"
            stroke="none"
          >
            {effectiveValue}
          </text>

          {/* Status Indicator Blinker */}
          <circle
            cx="65.5"
            cy="19"
            r="1.5"
            fill="currentColor"
            className={animated ? 'ris-micro-blink' : undefined}
          />

          {/* Bottom Row: Diagnostic Code & Serial Stamp */}
          <text
            x="8"
            y="32"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            opacity="0.8"
            stroke="none"
          >
            {effectiveCode}
          </text>

          <text
            x="68"
            y="32"
            textAnchor="end"
            fontSize="4"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.55"
            stroke="none"
          >
            {effectiveSerial}
          </text>
        </g>
      )}

      {/* ====================================================================
          3. FRAMED VARIANT: High-density tactical badge with 45° chamfered boundary
          ==================================================================== */}
      {effectiveVariant === 'framed' && (
        <g>
          {/* 45° Chamfered Boundary Polygon */}
          <polygon
            points="0,6 6,0 74,0 80,6 80,34 74,40 6,40 0,34"
            fill="currentColor"
            fillOpacity="0.04"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.6"
            vectorEffect="non-scaling-stroke"
          />

          {/* 45° Corner Alignment Ticks */}
          <path
            d="M 0 10 L 0 6 L 6 0 L 10 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 70 0 L 74 0 L 80 6 L 80 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 0 30 L 0 34 L 6 40 L 10 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 70 40 L 74 40 L 80 34 L 80 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />

          {/* Header Banner Area */}
          <polygon
            points="6,1 74,1 79,6 79,12 1,12 1,6"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="none"
          />
          <line
            x1="1"
            y1="12"
            x2="79"
            y2="12"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.4"
            vectorEffect="non-scaling-stroke"
          />

          <text
            x="6"
            y="9"
            fontSize="5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            letterSpacing="0.08em"
            fill="currentColor"
            stroke="none"
          >
            {effectiveLabel}
          </text>

          <text
            x="74"
            y="9"
            textAnchor="end"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.8"
            stroke="none"
          >
            {effectiveKanji}
          </text>

          {/* Primary Telemetry Status Readout */}
          <text
            x="8"
            y="23.5"
            fontSize="8.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="900"
            letterSpacing="0.06em"
            fill="currentColor"
            stroke="none"
          >
            {effectiveValue}
          </text>

          {/* Status Beacon Dot & Outer Pulse Ring */}
          <circle
            cx="71"
            cy="20.5"
            r="2"
            fill="currentColor"
            className={animated ? 'ris-micro-pulse' : undefined}
          />
          {animated && (
            <circle
              cx="71"
              cy="20.5"
              r="4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="ris-micro-beacon"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Sub-divider Line */}
          <line
            x1="5"
            y1="28"
            x2="75"
            y2="28"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Bottom Diagnostics: Code & Serial */}
          <text
            x="7"
            y="35.5"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            opacity="0.85"
            stroke="none"
          >
            {`CODE: ${effectiveCode}`}
          </text>

          <text
            x="73"
            y="35.5"
            textAnchor="end"
            fontSize="4"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.6"
            stroke="none"
          >
            {effectiveSerial}
          </text>
        </g>
      )}
    </svg>
  );
});
