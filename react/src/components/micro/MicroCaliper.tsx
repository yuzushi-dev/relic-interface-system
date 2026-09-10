import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroCaliperVariant = 'ruler' | 'bracket' | 'leader-line';
export type MicroCaliperPreset = 'ruler-100' | 'bracket-caliper' | 'leader-45';
export type MicroCaliperOrientation = 'horizontal' | 'vertical';

export interface MicroCaliperProps extends MicroBaseProps {
  /** Visual variant: 'ruler' | 'bracket' | 'leader-line' */
  variant?: MicroCaliperVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroCaliperPreset;
  /** Total measurement length in pixels along primary axis */
  length?: number;
  /** Spatial orientation of the measurement ruler/caliper */
  orientation?: MicroCaliperOrientation;
  /** Number of major ticks (or boolean to toggle ticks) */
  ticks?: number | boolean;
  /** Leader line dogleg angle (45° or 90°) */
  angle?: 45 | 90;
  /** Whether to render minor subdivision ticks */
  subdivisions?: boolean;
}

/**
 * Tactical Caliper & Ruler Atom (`<MicroCaliper>`).
 * Provides graduated technical millimeter rulers, 45° chamfered caliper bounding brackets,
 * and precision dogleg leader lines for telemetry annotations and spatial measurements.
 */
export const MicroCaliper = forwardRef<SVGSVGElement, MicroCaliperProps>(function MicroCaliper(
  {
    variant,
    preset,
    length,
    orientation,
    ticks,
    angle,
    subdivisions,
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
  const effectiveVariant: MicroCaliperVariant = variant ?? (
    preset === 'bracket-caliper' ? 'bracket' :
    preset === 'leader-45' ? 'leader-line' :
    'ruler'
  );

  const effectiveOrientation: MicroCaliperOrientation = orientation ?? 'horizontal';

  const effectiveAngle: 45 | 90 = angle ?? (preset === 'leader-45' ? 45 : 45);

  const effectiveSubdivisions: boolean = subdivisions ?? (
    preset === 'bracket-caliper' ? false : true
  );

  // Determine base dimension along primary axis
  const baseLength = (
    preset === 'ruler-100' ? 100 :
    preset === 'bracket-caliper' ? 80 :
    preset === 'leader-45' ? 64 :
    effectiveVariant === 'ruler' ? 80 :
    effectiveVariant === 'bracket' ? 64 :
    48
  );

  const effectiveLength = length ?? (
    typeof size === 'number' ? size : resolveMicroSize(size, baseLength)
  );

  const crossAxis = effectiveVariant === 'leader-line' ? 24 : 16;
  const isHorizontal = effectiveOrientation === 'horizontal';

  const width = isHorizontal ? effectiveLength : crossAxis;
  const height = isHorizontal ? crossAxis : effectiveLength;
  const viewBox = isHorizontal ? `0 0 ${effectiveLength} ${crossAxis}` : `0 0 ${crossAxis} ${effectiveLength}`;

  const color = resolveMicroColor(status, brand);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      shapeRendering="geometricPrecision"
      role="img"
      aria-hidden={rest['aria-label'] ? undefined : true}
      data-variant={effectiveVariant}
      data-orientation={effectiveOrientation}
      data-brand={brand}
      data-status={status}
      className={`ris-micro-caliper ${className}`.trim()}
      style={{
        color,
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      {/* 1. RULER VARIANT */}
      {effectiveVariant === 'ruler' && (
        <g>
          {isHorizontal ? (
            <g>
              {/* Horizontal Baseline */}
              <line x1="0" y1="12" x2={effectiveLength} y2="12" strokeWidth="1" />

              {/* End Stops with 45° Chamfer Pips */}
              <line x1="0" y1="4" x2="0" y2="12" strokeWidth="1.25" />
              <polygon points="0,12 3,9 3,12" fill="currentColor" stroke="none" />

              <line x1={effectiveLength} y1="4" x2={effectiveLength} y2="12" strokeWidth="1.25" />
              <polygon
                points={`${effectiveLength},12 ${effectiveLength - 3},9 ${effectiveLength - 3},12`}
                fill="currentColor"
                stroke="none"
              />

              {/* Graduation Ticks */}
              {ticks !== false && (() => {
                const tickCount = typeof ticks === 'number' ? Math.max(1, ticks) : Math.max(2, Math.round(effectiveLength / 10));
                const step = effectiveLength / tickCount;
                const items: React.ReactNode[] = [];

                for (let i = 1; i < tickCount; i++) {
                  const x = i * step;
                  items.push(
                    <line key={`maj-${i}`} x1={x} y1="6" x2={x} y2="12" strokeWidth="1" />
                  );
                  if (effectiveSubdivisions && step >= 6) {
                    items.push(
                      <line key={`min-${i}`} x1={x - step / 2} y1="9" x2={x - step / 2} y2="12" strokeWidth="0.75" />
                    );
                  }
                }
                if (effectiveSubdivisions && step >= 6) {
                  items.push(
                    <line key="min-last" x1={effectiveLength - step / 2} y1="9" x2={effectiveLength - step / 2} y2="12" strokeWidth="0.75" />
                  );
                }
                return items;
              })()}

              {/* Millimeter Numeric Stamps */}
              {effectiveLength >= 60 && (
                <g stroke="none" fill="currentColor" opacity="0.6" fontSize="4.5" fontFamily="var(--ris-font-mono, monospace)">
                  <text x="4" y="6">00</text>
                  <text x={effectiveLength - 4} textAnchor="end" y="6">
                    {String(Math.round(effectiveLength)).padStart(2, '0')}
                  </text>
                </g>
              )}

              {/* Animated Scanner Laser Tick */}
              {animated && (
                <line
                  x1={effectiveLength * 0.4}
                  y1="3"
                  x2={effectiveLength * 0.4}
                  y2="13"
                  strokeWidth="1.5"
                  className="ris-micro-pulse"
                />
              )}
            </g>
          ) : (
            <g>
              {/* Vertical Baseline */}
              <line x1="4" y1="0" x2="4" y2={effectiveLength} strokeWidth="1" />

              {/* Top & Bottom End Stops with Chamfer Pips */}
              <line x1="4" y1="0" x2="12" y2="0" strokeWidth="1.25" />
              <polygon points="4,0 7,3 4,3" fill="currentColor" stroke="none" />

              <line x1="4" y1={effectiveLength} x2="12" y2={effectiveLength} strokeWidth="1.25" />
              <polygon
                points={`4,${effectiveLength} 7,${effectiveLength - 3} 4,${effectiveLength - 3}`}
                fill="currentColor"
                stroke="none"
              />

              {/* Graduation Ticks */}
              {ticks !== false && (() => {
                const tickCount = typeof ticks === 'number' ? Math.max(1, ticks) : Math.max(2, Math.round(effectiveLength / 10));
                const step = effectiveLength / tickCount;
                const items: React.ReactNode[] = [];

                for (let i = 1; i < tickCount; i++) {
                  const y = i * step;
                  items.push(
                    <line key={`maj-${i}`} x1="4" y1={y} x2="10" y2={y} strokeWidth="1" />
                  );
                  if (effectiveSubdivisions && step >= 6) {
                    items.push(
                      <line key={`min-${i}`} x1="4" y1={y - step / 2} x2="7" y2={y - step / 2} strokeWidth="0.75" />
                    );
                  }
                }
                if (effectiveSubdivisions && step >= 6) {
                  items.push(
                    <line key="min-last" x1="4" y1={effectiveLength - step / 2} x2="7" y2={effectiveLength - step / 2} strokeWidth="0.75" />
                  );
                }
                return items;
              })()}

              {/* Millimeter Numeric Stamps */}
              {effectiveLength >= 60 && (
                <g stroke="none" fill="currentColor" opacity="0.6" fontSize="4.5" fontFamily="var(--ris-font-mono, monospace)">
                  <text x="6" y="8">00</text>
                  <text x="6" y={effectiveLength - 3}>
                    {String(Math.round(effectiveLength)).padStart(2, '0')}
                  </text>
                </g>
              )}

              {/* Animated Scanner Laser Tick */}
              {animated && (
                <line
                  x1="3"
                  y1={effectiveLength * 0.4}
                  x2="13"
                  y2={effectiveLength * 0.4}
                  strokeWidth="1.5"
                  className="ris-micro-pulse"
                />
              )}
            </g>
          )}
        </g>
      )}

      {/* 2. BRACKET VARIANT */}
      {effectiveVariant === 'bracket' && (
        <g>
          {isHorizontal ? (
            <g>
              {/* Left Chamfered Caliper Jaw */}
              <path d="M 3 11 L 0 14 L 0 6 L 2 4 L 6 4" strokeWidth="1.25" />

              {/* Right Chamfered Caliper Jaw */}
              <path
                d={`M ${effectiveLength - 3} 11 L ${effectiveLength} 14 L ${effectiveLength} 6 L ${effectiveLength - 2} 4 L ${effectiveLength - 6} 4`}
                strokeWidth="1.25"
              />

              {/* Span line with center caliper index notch */}
              {(() => {
                const midX = effectiveLength / 2;
                if (effectiveLength >= 28) {
                  return (
                    <g>
                      <line x1="6" y1="4" x2={midX - 5} y2="4" strokeWidth="1" />
                      <polygon
                        points={`${midX - 3},2 ${midX + 3},2 ${midX},5`}
                        fill="currentColor"
                        stroke="none"
                        className={animated ? 'ris-micro-pulse' : undefined}
                      />
                      <line x1={midX + 5} y1="4" x2={effectiveLength - 6} y2="4" strokeWidth="1" />
                    </g>
                  );
                }
                return <line x1="6" y1="4" x2={effectiveLength - 6} y2="4" strokeWidth="1" />;
              })()}

              {/* Caliper graduation tick marks */}
              {ticks !== false && (() => {
                const midX = effectiveLength / 2;
                const count = typeof ticks === 'number' ? Math.max(1, ticks) : Math.max(2, Math.round((effectiveLength - 16) / 12));
                const step = (effectiveLength - 16) / count;
                const items: React.ReactNode[] = [];

                for (let i = 1; i < count; i++) {
                  const tx = 8 + i * step;
                  if (Math.abs(tx - midX) > 6) {
                    items.push(
                      <line key={i} x1={tx} y1="4" x2={tx} y2="7" strokeWidth="1" />
                    );
                  }
                }
                return items;
              })()}
            </g>
          ) : (
            <g>
              {/* Top Chamfered Caliper Jaw */}
              <path d="M 11 3 L 14 0 L 6 0 L 4 2 L 4 6" strokeWidth="1.25" />

              {/* Bottom Chamfered Caliper Jaw */}
              <path
                d={`M 11 ${effectiveLength - 3} L 14 ${effectiveLength} L 6 ${effectiveLength} L 4 ${effectiveLength - 2} L 4 ${effectiveLength - 6}`}
                strokeWidth="1.25"
              />

              {/* Span line with center caliper index notch */}
              {(() => {
                const midY = effectiveLength / 2;
                if (effectiveLength >= 28) {
                  return (
                    <g>
                      <line x1="4" y1="6" x2="4" y2={midY - 5} strokeWidth="1" />
                      <polygon
                        points={`2,${midY - 3} 2,${midY + 3} 5,${midY}`}
                        fill="currentColor"
                        stroke="none"
                        className={animated ? 'ris-micro-pulse' : undefined}
                      />
                      <line x1="4" y1={midY + 5} x2="4" y2={effectiveLength - 6} strokeWidth="1" />
                    </g>
                  );
                }
                return <line x1="4" y1="6" x2="4" y2={effectiveLength - 6} strokeWidth="1" />;
              })()}

              {/* Caliper graduation tick marks */}
              {ticks !== false && (() => {
                const midY = effectiveLength / 2;
                const count = typeof ticks === 'number' ? Math.max(1, ticks) : Math.max(2, Math.round((effectiveLength - 16) / 12));
                const step = (effectiveLength - 16) / count;
                const items: React.ReactNode[] = [];

                for (let i = 1; i < count; i++) {
                  const ty = 8 + i * step;
                  if (Math.abs(ty - midY) > 6) {
                    items.push(
                      <line key={i} x1="4" y1={ty} x2="7" y2={ty} strokeWidth="1" />
                    );
                  }
                }
                return items;
              })()}
            </g>
          )}
        </g>
      )}

      {/* 3. LEADER-LINE VARIANT */}
      {effectiveVariant === 'leader-line' && (
        <g>
          {isHorizontal ? (
            <g>
              {/* Target coordinate origin anchor */}
              <circle cx="4" cy="18" r="2" fill="currentColor" stroke="none" />
              <circle cx="4" cy="18" r="3.5" strokeDasharray="1.5 1.5" strokeWidth="0.75" />
              {animated && (
                <circle cx="4" cy="18" r="2" className="ris-micro-beacon" strokeWidth="1" fill="none" />
              )}

              {/* Dogleg path: 45° or 90° rise to horizontal shelf */}
              {effectiveAngle === 45 ? (
                <g>
                  <path d={`M 4 18 L 16 6 H ${effectiveLength - 2}`} strokeWidth="1.25" />
                  {/* Terminal 45° chamfer arrow */}
                  <polyline
                    points={`${effectiveLength - 6},3 ${effectiveLength - 2},6 ${effectiveLength - 6},9`}
                    strokeWidth="1.25"
                  />
                </g>
              ) : (
                <g>
                  <path d={`M 4 18 V 6 H ${effectiveLength - 2}`} strokeWidth="1.25" />
                  {/* Terminal vertical tick stop */}
                  <line x1={effectiveLength - 2} y1="3" x2={effectiveLength - 2} y2="9" strokeWidth="1.25" />
                </g>
              )}

              {/* Telemetry tick marks along shelf */}
              {ticks !== false && (() => {
                const shelfStart = effectiveAngle === 45 ? 20 : 8;
                const shelfEnd = effectiveLength - 8;
                const items: React.ReactNode[] = [];

                for (let tx = shelfStart; tx <= shelfEnd; tx += 8) {
                  items.push(
                    <line key={tx} x1={tx} y1="4" x2={tx} y2="8" strokeWidth="1" />
                  );
                  if (effectiveSubdivisions && tx + 4 <= shelfEnd) {
                    items.push(
                      <line key={`sub-${tx}`} x1={tx + 4} y1="5" x2={tx + 4} y2="7" strokeWidth="0.75" />
                    );
                  }
                }
                return items;
              })()}
            </g>
          ) : (
            <g>
              {/* Target coordinate origin anchor */}
              <circle cx="18" cy="4" r="2" fill="currentColor" stroke="none" />
              <circle cx="18" cy="4" r="3.5" strokeDasharray="1.5 1.5" strokeWidth="0.75" />
              {animated && (
                <circle cx="18" cy="4" r="2" className="ris-micro-beacon" strokeWidth="1" fill="none" />
              )}

              {/* Dogleg path: 45° or 90° turn to vertical shelf */}
              {effectiveAngle === 45 ? (
                <g>
                  <path d={`M 18 4 L 6 16 V ${effectiveLength - 2}`} strokeWidth="1.25" />
                  {/* Terminal 45° chamfer arrow */}
                  <polyline
                    points={`3,${effectiveLength - 6} 6,${effectiveLength - 2} 9,${effectiveLength - 6}`}
                    strokeWidth="1.25"
                  />
                </g>
              ) : (
                <g>
                  <path d={`M 18 4 H 6 V ${effectiveLength - 2}`} strokeWidth="1.25" />
                  {/* Terminal horizontal tick stop */}
                  <line x1="3" y1={effectiveLength - 2} x2="9" y2={effectiveLength - 2} strokeWidth="1.25" />
                </g>
              )}

              {/* Telemetry tick marks along shelf */}
              {ticks !== false && (() => {
                const shelfStart = effectiveAngle === 45 ? 20 : 8;
                const shelfEnd = effectiveLength - 8;
                const items: React.ReactNode[] = [];

                for (let ty = shelfStart; ty <= shelfEnd; ty += 8) {
                  items.push(
                    <line key={ty} x1="4" y1={ty} x2="8" y2={ty} strokeWidth="1" />
                  );
                  if (effectiveSubdivisions && ty + 4 <= shelfEnd) {
                    items.push(
                      <line key={`sub-${ty}`} x1="5" y1={ty + 4} x2="7" y2={ty + 4} strokeWidth="0.75" />
                    );
                  }
                }
                return items;
              })()}
            </g>
          )}
        </g>
      )}
    </svg>
  );
});

MicroCaliper.displayName = 'MicroCaliper';
