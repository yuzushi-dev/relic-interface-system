import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroEqualizerVariant = 'discrete' | 'waveform' | 'mirrored';
export type MicroEqualizerPreset = 'audio-signal' | 'packet-stream' | 'bandwidth';

export interface MicroEqualizerProps extends Omit<MicroBaseProps, 'values'> {
  /** Visual variant: 'discrete' | 'waveform' | 'mirrored' */
  variant?: MicroEqualizerVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroEqualizerPreset;
  /** Number of equalizer bars (default: 8) */
  bars?: number;
  /** Amplitudes for each bar (0–100) */
  values?: number[];
  /** Maximum bar height in pixels (default: 22) */
  maxHeight?: number;
  /** Width of each individual bar in pixels */
  barWidth?: number;
  /** Spacing gap between adjacent bars in pixels */
  gap?: number;
}

const DEFAULT_PRESET_VALUES: Record<MicroEqualizerPreset, number[]> = {
  'audio-signal': [25, 45, 75, 95, 80, 60, 40, 20],
  'packet-stream': [40, 85, 25, 65, 100, 35, 75, 50],
  'bandwidth': [30, 50, 75, 90, 85, 65, 45, 25],
};

/**
 * Tactical Frequency & Quantized Signal Atom (`<MicroEqualizer>`).
 * Provides discrete vertical signal bars with quantized heights, optional mirrored mode,
 * and animated audio-spectrum waves.
 */
export const MicroEqualizer = forwardRef<SVGSVGElement, MicroEqualizerProps>(function MicroEqualizer(
  {
    variant,
    preset,
    bars = 8,
    values,
    maxHeight,
    barWidth,
    gap,
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
  const effectiveVariant: MicroEqualizerVariant = variant ?? (
    preset === 'bandwidth' ? 'mirrored' :
    preset === 'packet-stream' ? 'discrete' :
    preset === 'audio-signal' ? 'waveform' :
    'waveform'
  );

  const effectiveBars = Math.max(1, bars);

  // Resolve amplitudes for each bar
  const resolvedValues: number[] = Array.from({ length: effectiveBars }, (_, i): number => {
    if (values) {
      const v = values[i];
      if (v !== undefined) {
        return Math.max(0, Math.min(100, v));
      }
    }
    if (preset && DEFAULT_PRESET_VALUES[preset] && effectiveBars === DEFAULT_PRESET_VALUES[preset].length) {
      const presetArr = DEFAULT_PRESET_VALUES[preset];
      const presetVal = presetArr[i];
      if (presetVal !== undefined) {
        return presetVal;
      }
    }
    if (preset === 'audio-signal' || effectiveVariant === 'waveform') {
      return Math.round(20 + 75 * Math.sin(((i + 1) / (effectiveBars + 1)) * Math.PI));
    }
    if (preset === 'bandwidth' || effectiveVariant === 'mirrored') {
      return Math.round(25 + 70 * Math.sin(((i + 0.5) / effectiveBars) * Math.PI));
    }
    // packet-stream / discrete fallback sequence
    const pattern = [40, 85, 25, 65, 100, 35, 75, 50, 90, 30, 60, 80];
    return pattern[i % pattern.length] ?? 50;
  });

  // Geometry configuration
  const baselineY = 27;
  const effectiveMaxHeight = maxHeight ?? 22;
  const effectiveGap = gap ?? 1.5;

  const calculatedBarWidth = Number(
    Math.max(1, (28 - (effectiveBars - 1) * effectiveGap) / effectiveBars).toFixed(2)
  );
  const effectiveBarWidth = barWidth ?? calculatedBarWidth;

  const contentWidth = effectiveBars * effectiveBarWidth + (effectiveBars - 1) * effectiveGap;
  const totalWidth = Math.max(32, Math.ceil(contentWidth + 4));
  const totalHeight = Math.max(32, maxHeight ? maxHeight + 10 : 32);
  const startX = Number(Math.max(2, (totalWidth - contentWidth) / 2).toFixed(2));
  const centerY = Number((totalHeight / 2).toFixed(2));

  const width = resolveMicroSize(size, totalWidth);
  const height = resolveMicroSize(size, totalHeight);
  const color = resolveMicroColor(status, brand);

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
      data-brand={brand}
      data-status={status}
      className={`ris-micro-equalizer ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 1. WAVEFORM VARIANT */}
      {effectiveVariant === 'waveform' && (
        <g>
          {/* Ground Baseline with 45° Chamfered End Stops */}
          <line x1="2" y1={baselineY} x2={totalWidth - 2} y2={baselineY} strokeWidth="1" />
          <line x1="2" y1={baselineY - 2} x2="2" y2={baselineY} strokeWidth="1" />
          <line x1={totalWidth - 2} y1={baselineY - 2} x2={totalWidth - 2} y2={baselineY} strokeWidth="1" />

          {/* Equalizer Frequency Bars */}
          {resolvedValues.map((val, i) => {
            const x = Number((startX + i * (effectiveBarWidth + effectiveGap)).toFixed(2));
            const h = Math.max(1.5, Number(((val / 100) * effectiveMaxHeight).toFixed(2)));
            const y = Number((baselineY - h).toFixed(2));
            const peakY = Number(Math.max(2, y - 2).toFixed(2));

            return (
              <g
                key={`wave-bar-${i}`}
                className={animated ? 'ris-micro-scan' : undefined}
                style={{
                  animationDelay: animated ? `${(i * 120) % 960}ms` : undefined,
                  transformOrigin: `${x + effectiveBarWidth / 2}px ${baselineY}px`,
                }}
              >
                {/* Solid Bar */}
                <rect x={x} y={y} width={effectiveBarWidth} height={h} fill="currentColor" stroke="none" />
                {/* Floating Peak Hold Dash */}
                <line
                  x1={x}
                  y1={peakY}
                  x2={Number((x + effectiveBarWidth).toFixed(2))}
                  y2={peakY}
                  strokeWidth="1"
                  stroke="currentColor"
                  opacity="0.85"
                />
              </g>
            );
          })}
        </g>
      )}

      {/* 2. DISCRETE VARIANT */}
      {effectiveVariant === 'discrete' && (
        <g>
          {/* Ground Baseline */}
          <line x1="2" y1={baselineY} x2={totalWidth - 2} y2={baselineY} strokeWidth="1" />
          <line x1="2" y1={baselineY - 2} x2="2" y2={baselineY} strokeWidth="1" />
          <line x1={totalWidth - 2} y1={baselineY - 2} x2={totalWidth - 2} y2={baselineY} strokeWidth="1" />

          {/* Quantized Segmented Blocks (5 vertical blocks per column) */}
          {resolvedValues.map((val, i) => {
            const x = Number((startX + i * (effectiveBarWidth + effectiveGap)).toFixed(2));
            const numBlocks = 5;
            const blockGap = 1;
            const blockHeight = Math.max(
              1.5,
              Number(((effectiveMaxHeight - (numBlocks - 1) * blockGap) / numBlocks).toFixed(2))
            );

            return (
              <g
                key={`disc-col-${i}`}
                className={animated ? 'ris-micro-scan' : undefined}
                style={{
                  animationDelay: animated ? `${(i * 120) % 960}ms` : undefined,
                  transformOrigin: `${x + effectiveBarWidth / 2}px ${baselineY}px`,
                }}
              >
                {Array.from({ length: numBlocks }, (_, b) => {
                  const bY = Number((baselineY - (b + 1) * blockHeight - b * blockGap).toFixed(2));
                  const threshold = ((b + 0.5) / numBlocks) * 100;
                  const isActive = val >= threshold;

                  return (
                    <rect
                      key={`block-${i}-${b}`}
                      x={x}
                      y={bY}
                      width={effectiveBarWidth}
                      height={blockHeight}
                      fill="currentColor"
                      opacity={isActive ? 1 : 0.15}
                      stroke="none"
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      )}

      {/* 3. MIRRORED VARIANT */}
      {effectiveVariant === 'mirrored' && (
        <g>
          {/* Center Zero-dB Axis Line with Stops */}
          <line
            x1="2"
            y1={centerY}
            x2={totalWidth - 2}
            y2={centerY}
            strokeWidth="0.75"
            strokeDasharray="1.5 1.5"
            opacity="0.35"
          />
          <line x1="2" y1={centerY - 2} x2="2" y2={centerY + 2} strokeWidth="1" />
          <line x1={totalWidth - 2} y1={centerY - 2} x2={totalWidth - 2} y2={centerY + 2} strokeWidth="1" />

          {/* Symmetrically Mirrored Bars Growing Up & Down */}
          {resolvedValues.map((val, i) => {
            const x = Number((startX + i * (effectiveBarWidth + effectiveGap)).toFixed(2));
            const halfH = Math.max(1, Number(((val / 100) * (effectiveMaxHeight / 2)).toFixed(2)));
            const y = Number((centerY - halfH).toFixed(2));
            const totalBarH = Number((halfH * 2).toFixed(2));
            const midBarX = Number((x + effectiveBarWidth / 2).toFixed(2));

            return (
              <g
                key={`mirror-bar-${i}`}
                className={animated ? 'ris-micro-scan' : undefined}
                style={{
                  animationDelay: animated ? `${(i * 120) % 960}ms` : undefined,
                  transformOrigin: `${midBarX}px ${centerY}px`,
                }}
              >
                {/* Mirrored Vertical Bar */}
                <rect x={x} y={y} width={effectiveBarWidth} height={totalBarH} fill="currentColor" stroke="none" />
                {/* Floating Peak Dots (Upper and Lower) */}
                <circle cx={midBarX} cy={Number((y - 1.5).toFixed(2))} r="0.75" fill="currentColor" opacity="0.8" stroke="none" />
                <circle
                  cx={midBarX}
                  cy={Number((y + totalBarH + 1.5).toFixed(2))}
                  r="0.75"
                  fill="currentColor"
                  opacity="0.8"
                  stroke="none"
                />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
});

MicroEqualizer.displayName = 'MicroEqualizer';
