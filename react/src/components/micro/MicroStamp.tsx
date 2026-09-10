import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroStampVariant = 'barcode' | 'seal' | 'hash-tag' | 'pill-code';
export type MicroStampPreset = 'barcode-mini' | 'hash-stamp' | 'tactical-seal';
export type MicroStampCodeType = '128' | 'matrix';

export interface MicroStampProps extends MicroBaseProps {
  /** Visual variant: 'barcode' | 'seal' | 'hash-tag' | 'pill-code' */
  variant?: MicroStampVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroStampPreset;
  /** Tactical serial number or code (e.g. "RL-8802") */
  serial?: string;
  /** Cryptographic hex hash (e.g. "0x7D1A") */
  hexHash?: string;
  /** Barcode symbology format: '128' (1D stripes) or 'matrix' (2D DataMatrix) */
  codeType?: MicroStampCodeType;
}

const BARCODE_1D_BARS: Array<{ x: number; width: number }> = [
  { x: 4.5, width: 1 },
  { x: 6.5, width: 1.5 },
  { x: 9.0, width: 0.75 },
  { x: 10.5, width: 2 },
  { x: 13.0, width: 1 },
  { x: 14.75, width: 0.75 },
  { x: 16.5, width: 2 },
  { x: 19.0, width: 1.25 },
  { x: 21.0, width: 0.75 },
  { x: 22.75, width: 1.75 },
  { x: 25.0, width: 1 },
  { x: 27.0, width: 1.5 },
];

/**
 * Tactical Stamp, Barcode & Cryptographic Hash Atom (`<MicroStamp>`).
 * Provides miniature 1D barcodes, 2D DataMatrix codes, 45° chamfered tactical seals,
 * and cryptographic hex hash verification tags.
 */
export const MicroStamp = forwardRef<SVGSVGElement, MicroStampProps>(function MicroStamp(
  {
    variant,
    preset,
    serial,
    hexHash,
    codeType,
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
  const effectiveVariant: MicroStampVariant = variant ?? (
    preset === 'barcode-mini' ? 'barcode' :
    preset === 'hash-stamp' ? 'hash-tag' :
    preset === 'tactical-seal' ? 'seal' :
    'barcode'
  );

  const effectiveCodeType: MicroStampCodeType = codeType ?? '128';

  const effectiveSerial: string = serial ?? (
    preset === 'barcode-mini' ? 'RL-8802' :
    preset === 'hash-stamp' ? 'SEC-04' :
    preset === 'tactical-seal' ? 'AUTH' :
    'RL-904'
  );

  const effectiveHexHash: string = hexHash ?? (
    preset === 'hash-stamp' ? '0x7D1A' :
    preset === 'tactical-seal' ? '0x9F' :
    '0x3E2'
  );

  const dimension = resolveMicroSize(size, 32);
  const color = resolveMicroColor(status, brand);

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
      data-code-type={effectiveCodeType}
      data-brand={brand}
      data-status={status}
      className={`ris-micro-stamp ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 1. BARCODE VARIANT */}
      {effectiveVariant === 'barcode' && (
        <g>
          {effectiveCodeType === '128' ? (
            <g>
              {/* Corner Framing Brackets */}
              <path
                d="M 2 7 L 2 2 L 7 2"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 30 7 L 30 2 L 25 2"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />

              {/* 1D Micro Barcode Stripes */}
              {BARCODE_1D_BARS.map((bar, i) => (
                <line
                  key={`bar-${i}`}
                  x1={bar.x}
                  y1="5"
                  x2={bar.x}
                  y2="20"
                  stroke="currentColor"
                  strokeWidth={bar.width}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Animated Scanner Beam */}
              {animated && (
                <line
                  x1="3"
                  y1="13"
                  x2="29"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="ris-micro-scan"
                  opacity="0.85"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Bottom Monospace Serial Number */}
              <text
                x="16"
                y="27"
                fontSize="4.5"
                fontFamily="var(--ris-font-mono, monospace)"
                fontWeight="700"
                fill="currentColor"
                textAnchor="middle"
                letterSpacing="0.8px"
                stroke="none"
              >
                {effectiveSerial}
              </text>
            </g>
          ) : (
            /* 2D DataMatrix Symbology */
            <g>
              {/* Solid L-Finder Pattern (Left & Bottom) */}
              <line
                x1="6"
                y1="4"
                x2="6"
                y2="24"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="6"
                y1="24"
                x2="26"
                y2="24"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />

              {/* Clock Track (Top & Right alternating) */}
              <line
                x1="6"
                y1="4"
                x2="26"
                y2="4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="26"
                y1="4"
                x2="26"
                y2="24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Interior Data Matrix Cells */}
              <rect x="9" y="7" width="2" height="2" fill="currentColor" />
              <rect x="13" y="7" width="2" height="2" fill="currentColor" />
              <rect x="17" y="7" width="2" height="2" fill="currentColor" />
              <rect x="9" y="11" width="2" height="2" fill="currentColor" />
              <rect x="15" y="11" width="2" height="2" fill="currentColor" />
              <rect x="21" y="11" width="2" height="2" fill="currentColor" />
              <rect x="11" y="15" width="2" height="2" fill="currentColor" />
              <rect x="17" y="15" width="2" height="2" fill="currentColor" />
              <rect x="19" y="15" width="2" height="2" fill="currentColor" />
              <rect
                x="13"
                y="19"
                width="2"
                height="2"
                fill="currentColor"
                className={animated ? 'ris-micro-blink' : undefined}
              />
              <rect x="21" y="19" width="2" height="2" fill="currentColor" />

              {/* Matrix Label */}
              <text
                x="16"
                y="29"
                fontSize="3.8"
                fontFamily="var(--ris-font-mono, monospace)"
                fontWeight="700"
                fill="currentColor"
                textAnchor="middle"
                opacity="0.85"
                stroke="none"
              >
                {effectiveSerial}
              </text>
            </g>
          )}
        </g>
      )}

      {/* 2. SEAL VARIANT (45° Chamfered Tactical Stamp) */}
      {effectiveVariant === 'seal' && (
        <g>
          {/* 45° Chamfered Outer Octagon */}
          <polygon
            points="8,2 24,2 30,8 30,24 24,30 8,30 2,24 2,8"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="var(--ris-bg, #0a0a0c)"
            fillOpacity="0.25"
            vectorEffect="non-scaling-stroke"
          />

          {/* Inner Dashed Chamfer Rule */}
          <polygon
            points="9.5,5 22.5,5 27,9.5 27,22.5 22.5,27 9.5,27 5,22.5 5,9.5"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="1.5 1.5"
            strokeOpacity="0.45"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* Header Micro Stamp */}
          <text
            x="16"
            y="9.5"
            fontSize="3.2"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            textAnchor="middle"
            letterSpacing="0.6px"
            opacity="0.75"
            stroke="none"
          >
            TAC•AUTH
          </text>

          {/* Primary Approval Serial */}
          <text
            x="16"
            y="17"
            fontSize="6"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            fill="currentColor"
            textAnchor="middle"
            letterSpacing="0.5px"
            stroke="none"
          >
            {effectiveSerial}
          </text>

          {/* Tactical Verification Mark */}
          <path
            d="M 12 21 L 15 24 L 20 19"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
            vectorEffect="non-scaling-stroke"
            className={animated ? 'ris-micro-pulse' : undefined}
          />

          {/* Micro Hash / Status Subtext */}
          <text
            x="16"
            y="28"
            fontSize="3"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            textAnchor="middle"
            opacity="0.7"
            stroke="none"
          >
            {effectiveHexHash || '承認'}
          </text>
        </g>
      )}

      {/* 3. HASH-TAG VARIANT */}
      {effectiveVariant === 'hash-tag' && (
        <g>
          {/* Chamfered Framing Box */}
          <polygon
            points="7,3 29,3 29,25 25,29 3,29 3,7"
            stroke="currentColor"
            strokeWidth="1"
            fill="var(--ris-bg, #0a0a0c)"
            fillOpacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="3"
            y1="7"
            x2="7"
            y2="3"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="25"
            y1="29"
            x2="29"
            y2="25"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Header Schema Tag */}
          <text
            x="6"
            y="9"
            fontSize="3.2"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            opacity="0.65"
            stroke="none"
          >
            HEX//SIG
          </text>

          {/* Cryptographic Hash Centerpiece */}
          <text
            x="16"
            y="18"
            fontSize="5.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            fill="currentColor"
            textAnchor="middle"
            letterSpacing="0.5px"
            stroke="none"
          >
            {effectiveHexHash}
          </text>

          {/* Serial Sub-Readout */}
          <text
            x="6"
            y="25.5"
            fontSize="3.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.8"
            stroke="none"
          >
            {effectiveSerial}
          </text>

          {/* Parity Checksum Status Indicators */}
          <circle cx="21" cy="24" r="0.8" fill="currentColor" />
          <circle cx="23.5" cy="24" r="0.8" fill="currentColor" />
          <circle
            cx="26"
            cy="24"
            r="0.8"
            fill="currentColor"
            className={animated ? 'ris-micro-blink' : undefined}
          />
        </g>
      )}

      {/* 4. PILL-CODE VARIANT */}
      {effectiveVariant === 'pill-code' && (
        <g>
          {/* Chamfered Pill Boundary */}
          <polygon
            points="6,5 26,5 29,8 29,24 26,27 6,27 3,24 3,8"
            stroke="currentColor"
            strokeWidth="1"
            fill="var(--ris-bg, #0a0a0c)"
            fillOpacity="0.25"
            vectorEffect="non-scaling-stroke"
          />

          {/* Divider Line */}
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="27"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1.5 1.5"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Left Pill Badge Tint */}
          <polygon
            points="6,5 12,5 12,27 6,27 3,24 3,8"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="none"
          />

          {/* Left Prefix Badge Text */}
          <text
            x="7.5"
            y="17.5"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="800"
            fill="currentColor"
            textAnchor="middle"
            stroke="none"
          >
            {effectiveSerial ? effectiveSerial.slice(0, 2).toUpperCase() : 'RL'}
          </text>

          {/* Right Hex Hash */}
          <text
            x="20.5"
            y="14"
            fontSize="4.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fontWeight="700"
            fill="currentColor"
            textAnchor="middle"
            stroke="none"
          >
            {effectiveHexHash}
          </text>

          {/* Right Serial Sub-Label */}
          <text
            x="20.5"
            y="22"
            fontSize="3.5"
            fontFamily="var(--ris-font-mono, monospace)"
            fill="currentColor"
            opacity="0.65"
            textAnchor="middle"
            stroke="none"
          >
            {effectiveSerial}
          </text>

          {/* Status Indicator Pip */}
          <circle
            cx="26"
            cy="8"
            r="1"
            fill="currentColor"
            className={animated ? 'ris-micro-blink' : undefined}
          />
        </g>
      )}
    </svg>
  );
});
