import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';
import { MicroReticle } from './MicroReticle.js';
import { MicroDial } from './MicroDial.js';
import { MicroMatrix } from './MicroMatrix.js';
import { MicroEqualizer } from './MicroEqualizer.js';
import { MicroConstellation } from './MicroConstellation.js';
import { MicroCaliper } from './MicroCaliper.js';
import { MicroStamp } from './MicroStamp.js';
import { MicroTelemetry } from './MicroTelemetry.js';

export type MicroClusterPreset =
  | 'sensor-lock'
  | 'node-health'
  | 'frequency-diag'
  | 'terminal-header'
  | 'orbital-relay'
  | 'power-module'
  | 'packet-analyzer'
  | 'tactical-survey';

export interface MicroClusterTelemetry {
  label?: string;
  value?: string | number;
  code?: string;
  kanji?: string;
  serial?: string;
}

export interface MicroClusterProps extends Omit<MicroBaseProps, 'values'> {
  /** Turnkey HUD cluster preset combining atomic components */
  preset?: MicroClusterPreset;
  /** Tactical cluster title displayed in header */
  title?: string;
  /** Telemetry datablock field overrides */
  telemetry?: MicroClusterTelemetry;
  /** Primary dial or gauge value (0–100) */
  dialValue?: number;
  /** Serial identification number or stamp code */
  serial?: string;
  /** Cryptographic hex hash (e.g. "0x7D1A") */
  hexHash?: string;
  /** Coordinate string for targeting or survey */
  coordinates?: string;
  /** Azimuth or optic bearing angle in degrees (0–360) */
  bearing?: number;
  /** Waveform / equalizer bar amplitudes */
  values?: number[];
  /** Secondary status tag text */
  statusText?: string;
}

/**
 * Turnkey Composite HUD Cluster (`<MicroCluster>`).
 * Assembles multiple tactical micro atoms (Reticle, Dial, Matrix, Equalizer,
 * Caliper, Constellation, Stamp, Telemetry) into a unified 45° chamfered telemetry card.
 *
 * Native viewBox: 0 0 160 48 (10:3 aspect ratio). Default size sets width to 160px and height to 48px.
 */
export const MicroCluster = forwardRef<SVGSVGElement, MicroClusterProps>(function MicroCluster(
  {
    preset = 'sensor-lock',
    title,
    telemetry,
    dialValue,
    serial,
    hexHash,
    coordinates,
    bearing,
    values,
    statusText,
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
  const totalWidth = 160;
  const totalHeight = 48;

  const width = typeof size === 'number' ? size : resolveMicroSize(size, totalWidth);
  const height = typeof size === 'number'
    ? Math.round(size * (totalHeight / totalWidth))
    : resolveMicroSize(size, totalHeight);

  const color = resolveMicroColor(status, brand);

  // Preset title resolution
  const effectiveTitle = title ?? (
    preset === 'sensor-lock' ? 'SENSOR-LOCK // ACQ-01' :
    preset === 'node-health' ? 'NODE HEALTH // SYS-07' :
    preset === 'frequency-diag' ? 'FREQUENCY // DIAGNOSTICS' :
    preset === 'terminal-header' ? 'TERMINAL // TTY-01' :
    preset === 'orbital-relay' ? 'ORBITAL RELAY // SAT-LINK' :
    preset === 'power-module' ? 'POWER MODULE // CELL-B' :
    preset === 'packet-analyzer' ? 'PACKET ANALYZER // ETH-0' :
    'TACTICAL SURVEY // SECTOR-7'
  );

  // Header right tag resolution
  const headerRightText = (
    preset === 'sensor-lock' ? (coordinates ?? 'AZ 142.5° EL +12°') :
    preset === 'node-health' ? (serial ?? 'SN: 884-NK') :
    preset === 'frequency-diag' ? (telemetry?.kanji ?? '周波数解析') :
    preset === 'orbital-relay' ? (statusText ?? 'SYNC: 99.9%') :
    preset === 'power-module' ? (telemetry?.kanji ?? '電力管理') :
    preset === 'packet-analyzer' ? (statusText ?? 'RATE: 10 Gbps') :
    preset === 'tactical-survey' ? (coordinates ?? '37°46′N 122°25′W') :
    ''
  );

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
      data-preset={preset}
      data-brand={brand}
      data-status={status}
      className={`ris-micro-cluster ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 45° Chamfered Outer Boundary Polygon */}
      <polygon
        points="0,6 6,0 154,0 160,6 160,42 154,48 6,48 0,42"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.6"
        vectorEffect="non-scaling-stroke"
      />

      {/* 45° Chamfer Corner Alignment Ticks */}
      <path
        d="M 0 10 L 0 6 L 6 0 L 10 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 150 0 L 154 0 L 160 6 L 160 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 0 38 L 0 42 L 6 48 L 10 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 150 48 L 154 48 L 160 42 L 160 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />

      {/* Header Bar (for non-terminal-header presets) */}
      {preset !== 'terminal-header' && (
        <g>
          <polygon
            points="6,1 154,1 159,6 159,10 1,10 1,6"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="none"
          />
          <line
            x1="1"
            y1="10"
            x2="159"
            y2="10"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="6"
            y="7.5"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            letterSpacing="0.08em"
            fill="currentColor"
            opacity="0.85"
            stroke="none"
          >
            {effectiveTitle}
          </text>
          {headerRightText && (
            <text
              x="154"
              y="7.5"
              textAnchor="end"
              fontSize="4"
              fontFamily="var(--ris-font-mono, monospace)"
              fontWeight="700"
              fill="currentColor"
              opacity="0.75"
              stroke="none"
            >
              {headerRightText}
            </text>
          )}
        </g>
      )}

      {/* ====================================================================
          1. PRESET: 'sensor-lock'
          MicroReticle + MicroMatrix + MicroDial + telemetry
          ==================================================================== */}
      {preset === 'sensor-lock' && (
        <g>
          {/* MicroReticle Target Reticle */}
          <g transform="translate(6, 12)">
            <MicroReticle
              preset="target-lock"
              locked={true}
              size={30}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* Vertical Divider */}
          <line
            x1="38"
            y1="13"
            x2="38"
            y2="43"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.25"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />

          {/* MicroMatrix Status Grid */}
          <g transform="translate(42, 14)">
            <MicroMatrix
              preset="led-4x4"
              size={24}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroDial Compass Bearing */}
          <g transform="translate(70, 12)">
            <MicroDial
              preset="compass"
              value={bearing ?? dialValue ?? 72}
              size={30}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroTelemetry Status Datablock */}
          <g transform="translate(104, 12)">
            <MicroTelemetry
              variant="stacked"
              label={telemetry?.label ?? 'TRK-09'}
              value={telemetry?.value ?? '[LOCKED]'}
              code={telemetry?.code ?? '0x4B'}
              kanji={telemetry?.kanji ?? '照準'}
              serial={telemetry?.serial ?? (serial ?? 'DST:1.8km')}
              size={44}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          2. PRESET: 'node-health'
          MicroDial + MicroTelemetry + MicroMatrix + serial
          ==================================================================== */}
      {preset === 'node-health' && (
        <g>
          {/* MicroDial Gauge */}
          <g transform="translate(6, 12)">
            <MicroDial
              preset="power-gauge"
              value={dialValue ?? 88}
              size={30}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroTelemetry Node Health Block */}
          <g transform="translate(38, 12)">
            <MicroTelemetry
              variant="stacked"
              label={telemetry?.label ?? 'CORE-TEMP'}
              value={telemetry?.value ?? '[ONLINE]'}
              code={telemetry?.code ?? '38.4°C'}
              kanji={telemetry?.kanji ?? '健全性'}
              serial={telemetry?.serial ?? (serial ?? 'SYS-OK')}
              size={46}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* Vertical Divider */}
          <line
            x1="88"
            y1="13"
            x2="88"
            y2="43"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.25"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />

          {/* MicroMatrix Status Indicator */}
          <g transform="translate(92, 14)">
            <MicroMatrix
              preset="status-3x3"
              size={26}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroStamp Serial Stamp */}
          <g transform="translate(122, 13)">
            <MicroStamp
              preset="hash-stamp"
              serial={serial ?? 'NK-884'}
              hexHash="0x9F"
              size={24}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          3. PRESET: 'frequency-diag'
          MicroEqualizer + MicroDial + MicroTelemetry + hex stamp
          ==================================================================== */}
      {preset === 'frequency-diag' && (
        <g>
          {/* MicroDial Frequency Gauge */}
          <g transform="translate(6, 12)">
            <MicroDial
              preset="frequency"
              value={dialValue ?? 64}
              size={32}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroEqualizer Waveform */}
          <g transform="translate(42, 13)">
            <MicroEqualizer
              variant="waveform"
              values={values ?? [28, 55, 85, 95, 78, 62, 45, 22]}
              bars={8}
              maxHeight={26}
              size={32}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroTelemetry Frequency Readout */}
          <g transform="translate(86, 12)">
            <MicroTelemetry
              variant="stacked"
              label={telemetry?.label ?? 'BANDWIDTH'}
              value={telemetry?.value ?? '142.8M'}
              code={telemetry?.code ?? 'BW:20M'}
              kanji={telemetry?.kanji ?? '同期'}
              serial={telemetry?.serial ?? 'RF-04'}
              size={44}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroStamp Cryptographic Hex Stamp */}
          <g transform="translate(132, 13)">
            <MicroStamp
              preset="hash-stamp"
              hexHash={hexHash ?? '0x7D1A'}
              serial={serial ?? 'SEC-04'}
              size={24}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          4. PRESET: 'terminal-header'
          MicroCaliper + MicroStamp + MicroTelemetry
          ==================================================================== */}
      {preset === 'terminal-header' && (
        <g>
          {/* MicroCaliper Full-Width Ruler Top Header */}
          <g transform="translate(6, 2)">
            <MicroCaliper
              preset="ruler-100"
              length={148}
              orientation="horizontal"
              size={148}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroStamp Mini Barcode */}
          <g transform="translate(8, 16)">
            <MicroStamp
              preset="barcode-mini"
              serial={serial ?? 'RL-8802'}
              size={28}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroTelemetry Inline Badge */}
          <g transform="translate(42, 19)">
            <MicroTelemetry
              variant="inline"
              label={telemetry?.label ?? (title ?? 'SYS-TERM')}
              value={telemetry?.value ?? '[SYS-OK]'}
              code={telemetry?.code ?? 'TTY-01'}
              kanji={telemetry?.kanji ?? '端末'}
              serial={telemetry?.serial ?? '2026-X'}
              size="sm"
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroCaliper Corner Caliper Bracket */}
          <g transform="translate(122, 16)">
            <MicroCaliper
              preset="bracket-caliper"
              length={30}
              orientation="horizontal"
              size={30}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          5. PRESET: 'orbital-relay'
          MicroConstellation + MicroTelemetry + beacon pulse
          ==================================================================== */}
      {preset === 'orbital-relay' && (
        <g>
          {/* MicroConstellation Network Schematic */}
          <g transform="translate(6, 11)">
            <MicroConstellation
              preset="orbital-relay"
              size={34}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* Beacon Pulse Visualizer */}
          <g transform="translate(44, 12)">
            <circle
              cx="18"
              cy="16"
              r="3"
              fill="currentColor"
              className={animated ? 'ris-micro-blink' : undefined}
            />
            <circle
              cx="18"
              cy="16"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
              className={animated ? 'ris-micro-pulse' : undefined}
              vectorEffect="non-scaling-stroke"
            />
            {animated && (
              <circle
                cx="18"
                cy="16"
                r="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                opacity="0.35"
                className="ris-micro-beacon"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <text
              x="18"
              y="32"
              textAnchor="middle"
              fontSize="4"
              fontFamily="var(--ris-font-mono, monospace)"
              fill="currentColor"
              opacity="0.7"
              stroke="none"
            >
              BEACON
            </text>
          </g>

          {/* MicroTelemetry Framed Relay Status */}
          <g transform="translate(84, 11)">
            <MicroTelemetry
              variant="framed"
              label={telemetry?.label ?? 'ORBIT-04'}
              value={telemetry?.value ?? '[LINKED]'}
              code={telemetry?.code ?? '18ms'}
              kanji={telemetry?.kanji ?? '軌道中継'}
              serial={telemetry?.serial ?? (serial ?? 'SAT-99')}
              size="sm"
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          6. PRESET: 'power-module'
          MicroDial + MicroEqualizer + voltage telemetry
          ==================================================================== */}
      {preset === 'power-module' && (
        <g>
          {/* MicroDial Segmented Gauge */}
          <g transform="translate(6, 12)">
            <MicroDial
              variant="segmented"
              value={dialValue ?? 78}
              size={32}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroEqualizer Discrete Power Bars */}
          <g transform="translate(42, 13)">
            <MicroEqualizer
              variant="discrete"
              bars={6}
              values={values ?? [94, 90, 84, 76, 58, 40]}
              maxHeight={26}
              size={32}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroTelemetry Voltage Readout */}
          <g transform="translate(86, 12)">
            <MicroTelemetry
              variant="stacked"
              label={telemetry?.label ?? 'MAIN-BUS'}
              value={telemetry?.value ?? '48.2V'}
              code={telemetry?.code ?? '1.24kW'}
              kanji={telemetry?.kanji ?? '電力'}
              serial={telemetry?.serial ?? (serial ?? 'PWR-OK')}
              size={42}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroStamp Pill Code Warning/Status */}
          <g transform="translate(132, 13)">
            <MicroStamp
              variant="pill-code"
              serial={serial ?? 'CELL-B'}
              hexHash="0x48"
              size={24}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          7. PRESET: 'packet-analyzer'
          MicroEqualizer + MicroMatrix + MicroStamp
          ==================================================================== */}
      {preset === 'packet-analyzer' && (
        <g>
          {/* MicroEqualizer Mirrored Bandwidth Stream */}
          <g transform="translate(6, 13)">
            <MicroEqualizer
              preset="bandwidth"
              values={values ?? [20, 50, 85, 95, 85, 50, 20]}
              bars={7}
              maxHeight={26}
              size={30}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroMatrix Packet Status Matrix */}
          <g transform="translate(40, 14)">
            <MicroMatrix
              preset="binary-status"
              rows={4}
              cols={4}
              size={24}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroStamp Pill Code */}
          <g transform="translate(68, 13)">
            <MicroStamp
              variant="pill-code"
              serial={serial ?? 'PKT-08'}
              hexHash={hexHash ?? '0x3E2'}
              size={26}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroTelemetry Packet Telemetry */}
          <g transform="translate(98, 12)">
            <MicroTelemetry
              variant="stacked"
              label={telemetry?.label ?? 'LOSS'}
              value={telemetry?.value ?? '0.00%'}
              code={telemetry?.code ?? '99.8%'}
              kanji={telemetry?.kanji ?? 'パケット'}
              serial={telemetry?.serial ?? 'ACK-OK'}
              size={48}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}

      {/* ====================================================================
          8. PRESET: 'tactical-survey'
          MicroReticle + MicroCaliper + coordinate telemetry
          ==================================================================== */}
      {preset === 'tactical-survey' && (
        <g>
          {/* MicroReticle Optic Survey Grid */}
          <g transform="translate(6, 12)">
            <MicroReticle
              preset="optic-grid"
              bearing={bearing ?? 45}
              size={32}
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>

          {/* MicroCaliper Azimuth Ruler / Angle Scale */}
          <g transform="translate(42, 16)">
            <MicroCaliper
              variant="ruler"
              length={40}
              orientation="horizontal"
              size={40}
              ticks={true}
              subdivisions={true}
              brand={brand}
              status={status}
              animated={animated}
            />
            <text
              x="20"
              y="22"
              textAnchor="middle"
              fontSize="4"
              fontFamily="var(--ris-font-mono, monospace)"
              fill="currentColor"
              opacity="0.85"
              stroke="none"
            >
              {`AZ: ${String(bearing ?? 45).padStart(3, '0')}°`}
            </text>
          </g>

          {/* MicroTelemetry Framed Target Reference */}
          <g transform="translate(86, 11)">
            <MicroTelemetry
              variant="framed"
              label={telemetry?.label ?? 'GRID-REF'}
              value={telemetry?.value ?? '[TARGET]'}
              code={telemetry?.code ?? 'ZONE-A'}
              kanji={telemetry?.kanji ?? '測量'}
              serial={telemetry?.serial ?? (serial ?? 'SV-08')}
              size="sm"
              brand={brand}
              status={status}
              animated={animated}
            />
          </g>
        </g>
      )}
    </svg>
  );
});
