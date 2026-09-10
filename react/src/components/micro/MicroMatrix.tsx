import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroMatrixVariant = 'dots' | 'crosses' | 'blocks';
export type MicroMatrixPreset = 'led-4x4' | 'binary-status' | 'cross-grid' | 'status-3x3';
export type MicroMatrixDensity = 'dense' | 'spaced';
export type MicroMatrixShape = 'dots' | 'crosses' | 'squares';

export interface MicroMatrixProps extends MicroBaseProps {
  /** Visual variant of the matrix: 'dots' | 'crosses' | 'blocks' */
  variant?: MicroMatrixVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroMatrixPreset;
  /** Number of grid rows (default: 4) */
  rows?: number;
  /** Number of grid columns (default: 4) */
  cols?: number;
  /** Array of active boolean flags or 1/0 bits (length rows * cols) */
  activePattern?: boolean[] | number[];
  /** Grid density / spacing between cells: 'dense' | 'spaced' */
  density?: MicroMatrixDensity;
  /** Graphic shape of individual cells: 'dots' | 'crosses' | 'squares' */
  shape?: MicroMatrixShape;
}

const DEFAULT_PRESET_PATTERNS: Record<MicroMatrixPreset, number[]> = {
  'led-4x4': [
    1, 0, 0, 1,
    0, 1, 1, 0,
    0, 1, 1, 0,
    1, 0, 0, 1,
  ],
  'status-3x3': [
    1, 1, 1,
    1, 0, 1,
    1, 1, 1,
  ],
  'binary-status': [
    1, 0, 1, 1,
    0, 1, 0, 0,
    1, 1, 1, 0,
    0, 1, 0, 1,
  ],
  'cross-grid': [
    1, 0, 1, 0,
    0, 1, 0, 1,
    1, 0, 1, 0,
    0, 1, 0, 1,
  ],
};

/**
 * Tactical Matrix & LED Pattern Atom (`<MicroMatrix>`).
 * Provides high-density discrete LED dot grids, binary status indicators,
 * crosshair matrix fields, and square-block telemetry arrays.
 */
export const MicroMatrix = forwardRef<SVGSVGElement, MicroMatrixProps>(function MicroMatrix(
  {
    variant,
    preset,
    rows: rowsProp,
    cols: colsProp,
    activePattern,
    density,
    shape,
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
  const effectiveVariant: MicroMatrixVariant = variant ?? (
    shape === 'crosses' ? 'crosses' :
    shape === 'squares' ? 'blocks' :
    preset === 'cross-grid' ? 'crosses' :
    preset === 'binary-status' ? 'blocks' :
    'dots'
  );

  const effectiveShape: MicroMatrixShape = shape ?? (
    effectiveVariant === 'crosses' ? 'crosses' :
    effectiveVariant === 'blocks' ? 'squares' :
    'dots'
  );

  const effectiveDensity: MicroMatrixDensity = density ?? (
    preset === 'binary-status' ? 'dense' : 'spaced'
  );

  const effectiveRows = Math.max(1, rowsProp ?? (preset === 'status-3x3' ? 3 : 4));
  const effectiveCols = Math.max(1, colsProp ?? (preset === 'status-3x3' ? 3 : 4));

  // Determine active state for a given cell coordinate
  const isActive = (r: number, c: number): boolean => {
    const idx = r * effectiveCols + c;
    if (activePattern && idx < activePattern.length) {
      return Boolean(activePattern[idx]);
    }
    if (preset && DEFAULT_PRESET_PATTERNS[preset]) {
      const p = DEFAULT_PRESET_PATTERNS[preset];
      if (idx < p.length) {
        return Boolean(p[idx]);
      }
    }
    // Fallback alternating tactical pattern
    return (r + c) % 2 === 0;
  };

  // Layout geometry calculation
  const pitch = effectiveDensity === 'dense' ? 6 : 8;
  const contentW = (effectiveCols - 1) * pitch;
  const contentH = (effectiveRows - 1) * pitch;

  const totalWidth = Math.max(32, contentW + (effectiveDensity === 'dense' ? 12 : 8));
  const totalHeight = Math.max(32, contentH + (effectiveDensity === 'dense' ? 12 : 8));

  const startX = effectiveCols <= 1 ? totalWidth / 2 : (totalWidth - contentW) / 2;
  const startY = effectiveRows <= 1 ? totalHeight / 2 : (totalHeight - contentH) / 2;

  const width = resolveMicroSize(size, totalWidth);
  const height = resolveMicroSize(size, totalHeight);
  const color = resolveMicroColor(status, brand);

  const dotRadius = effectiveDensity === 'dense' ? 1.6 : 2;
  const crossArm = effectiveDensity === 'dense' ? 1.5 : 2;
  const blockSize = effectiveDensity === 'dense' ? 3.8 : 4.4;
  const halfBlock = blockSize / 2;

  const activeClass = animated ? 'ris-micro-blink' : '';

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
      role="img"
      aria-hidden={rest['aria-label'] ? undefined : true}
      data-variant={effectiveVariant}
      data-preset={preset}
      data-density={effectiveDensity}
      data-shape={effectiveShape}
      data-brand={brand}
      data-status={status}
      className={`ris-micro-matrix ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 45° Chamfered Framing Corner Markers */}
      <path
        d="M 2 5 L 2 2 L 5 2"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M ${totalWidth - 2} 5 L ${totalWidth - 2} 2 L ${totalWidth - 5} 2`}
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M 2 ${totalHeight - 5} L 2 ${totalHeight - 2} L 5 ${totalHeight - 2}`}
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M ${totalWidth - 2} ${totalHeight - 5} L ${totalWidth - 2} ${totalHeight - 2} L ${totalWidth - 5} ${totalHeight - 2}`}
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />

      {/* Discrete Matrix Cells */}
      <g>
        {Array.from({ length: effectiveRows }, (_, r) =>
          Array.from({ length: effectiveCols }, (_, c) => {
            const active = isActive(r, c);
            const cx = Number((effectiveCols <= 1 ? startX : startX + c * pitch).toFixed(2));
            const cy = Number((effectiveRows <= 1 ? startY : startY + r * pitch).toFixed(2));
            const cellKey = `cell-${r}-${c}`;

            // 1. DOTS SHAPE
            if (effectiveShape === 'dots') {
              return (
                <circle
                  key={cellKey}
                  cx={cx}
                  cy={cy}
                  r={dotRadius}
                  fill="currentColor"
                  opacity={active ? 1 : 0.2}
                  className={active ? activeClass : undefined}
                />
              );
            }

            // 2. CROSSES SHAPE
            if (effectiveShape === 'crosses') {
              return (
                <g
                  key={cellKey}
                  opacity={active ? 1 : 0.2}
                  className={active ? activeClass : undefined}
                >
                  <line
                    x1={cx - crossArm}
                    y1={cy}
                    x2={cx + crossArm}
                    y2={cy}
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={cx}
                    y1={cy - crossArm}
                    x2={cx}
                    y2={cy + crossArm}
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            }

            // 3. SQUARES / BLOCKS SHAPE
            return (
              <rect
                key={cellKey}
                x={Number((cx - halfBlock).toFixed(2))}
                y={Number((cy - halfBlock).toFixed(2))}
                width={blockSize}
                height={blockSize}
                fill="currentColor"
                opacity={active ? 1 : 0.2}
                className={active ? activeClass : undefined}
              />
            );
          })
        )}
      </g>
    </svg>
  );
});

MicroMatrix.displayName = 'MicroMatrix';
