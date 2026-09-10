import { forwardRef, useId } from 'react';
import {
  MicroGlanceNoticeProps,
  EyewearOpticalProfile,
  RisBrand,
  RisMicroStatus,
  resolveMicroSize,
  resolveMicroColor,
} from './types.js';

export type { MicroGlanceNoticeProps, EyewearOpticalProfile };

function resolveNoticeColor(
  severity: 'info' | 'warn' | 'critical' = 'info',
  opticalProfile?: EyewearOpticalProfile,
  brand: RisBrand = 'biohub',
  status?: RisMicroStatus
): string {
  if (severity === 'critical') return '#ff2d3c';
  if (severity === 'warn') return '#e6a23c';

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

  return resolveMicroColor(status, brand) ?? '#6fb3c9';
}

/**
 * Tactical Peripheral Glance Notice Micro-HUD Component (`<MicroGlanceNotice>`).
 * Provides high-urgency glance notifications (calendar alerts, proximity collisions,
 * system status, security warnings) along the top periphery of smart glasses displays.
 * Features 45° chamfered boundary frame, monospaced category badge, auto-decay countdown line,
 * and zero-reflow optical waveguide clarity with 100% transparent background.
 *
 * Native viewBox: 0 0 220 26 (110:13 aspect ratio).
 */
export const MicroGlanceNotice = forwardRef<SVGSVGElement, MicroGlanceNoticeProps>(
  function MicroGlanceNotice(
    {
      category = 'SYSTEM',
      title = 'COLLISION WARNING',
      subtitle = 'OBJECT AT 1.2M',
      severity = 'info',
      dismissProgress,
      opticalProfile,
      brand = 'biohub',
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
    const clipId = useId();
    const totalWidth = 220;
    const totalHeight = 26;

    const width = typeof size === 'number' ? size : resolveMicroSize(size, totalWidth);
    const height =
      typeof size === 'number'
        ? Math.round(size * (totalHeight / totalWidth))
        : resolveMicroSize(size, totalHeight);

    const color = resolveNoticeColor(severity, opticalProfile, brand, status);

    const opticalClass = opticalProfile
      ? {
          'phosphor-green': 'ris-eyewear-profile-phosphor',
          'tactical-amber': 'ris-eyewear-profile-amber',
          'cyber-cyan': 'ris-eyewear-profile-cyan',
          'alert-red': 'ris-eyewear-profile-alert',
        }[opticalProfile] ?? `ris-eyewear-profile-${opticalProfile}`
      : '';

    const cleanCategory = (category ?? 'SYSTEM').toUpperCase();
    const cleanTitle = (title ?? '').toUpperCase();
    const cleanSubtitle = subtitle ? subtitle.toUpperCase() : '';

    const dynamicAriaLabel =
      ariaLabel ??
      `Notice [${cleanCategory}] ${cleanTitle}${cleanSubtitle ? `: ${cleanSubtitle}` : ''} (${severity})`;

    // Decay countdown line calculation (width = 208 from x=6 to x=214)
    const decayTotalLength = 208;
    const clampedProgress =
      dismissProgress !== undefined
        ? Math.max(0, Math.min(100, dismissProgress))
        : undefined;

    const remainingWidth =
      clampedProgress !== undefined
        ? Math.max(0, (decayTotalLength * (100 - clampedProgress)) / 100)
        : decayTotalLength;

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
        data-category={cleanCategory}
        data-severity={severity}
        data-brand={brand}
        data-optical-profile={opticalProfile}
        data-status={status}
        className={`ris-micro-glance ris-eyewear-glass ${opticalClass} ${className}`.trim()}
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

        <defs>
          <clipPath id={clipId}>
            <rect x="76" y="2" width="128" height="22" />
          </clipPath>
        </defs>

        {/* 45° Chamfered Boundary Frame (4px cuts at all 4 corners) */}
        <path
          d="M 5 1 L 215 1 L 219 5 L 219 21 L 215 25 L 5 25 L 1 21 L 1 5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.8"
          vectorEffect="non-scaling-stroke"
        />

        {/* Chamfer Accent Ticks */}
        <path
          d="M 1 8 L 1 4 L 4 1 L 8 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeOpacity="0.9"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 212 1 L 216 1 L 219 4 L 219 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeOpacity="0.9"
          vectorEffect="non-scaling-stroke"
        />

        {/* Category Badge */}
        <text
          x="8"
          y="17"
          fontSize="8"
          fontWeight="800"
          fontFamily="var(--ris-font-mono, monospace)"
          letterSpacing="0.06em"
          fill="currentColor"
          stroke="none"
        >
          {`[${cleanCategory}]`}
        </text>

        {/* Vertical Divider Tick */}
        <line
          x1="70"
          y1="6"
          x2="70"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Message Title & Subtitle */}
        <g clipPath={`url(#${clipId})`}>
          <text
            x="78"
            y="17"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.04em"
            fill="currentColor"
            stroke="none"
          >
            {cleanTitle}
            {cleanSubtitle && (
              <tspan opacity="0.85" fontWeight="600">
                {` · ${cleanSubtitle}`}
              </tspan>
            )}
          </text>
        </g>

        {/* Operational Status Pip */}
        <circle
          cx="210"
          cy="13"
          r="1.5"
          fill="currentColor"
          stroke="none"
          opacity={severity === 'critical' ? 1 : 0.75}
          className={
            severity === 'critical' || (animated && severity === 'warn')
              ? 'ris-micro-blink'
              : undefined
          }
        />

        {/* Auto-Decay Countdown Line Track */}
        <line
          x1="6"
          y1="24.5"
          x2="214"
          y2="24.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Active Auto-Decay Countdown Line */}
        {clampedProgress !== undefined ? (
          <line
            x1="6"
            y1="24.5"
            x2={6 + remainingWidth}
            y2="24.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <line
            x1="6"
            y1="24.5"
            x2="214"
            y2="24.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            pathLength="100"
            strokeDasharray="100"
            className={animated ? 'ris-micro-decay' : undefined}
            style={
              animated
                ? { animation: 'ris-decay-line 4s linear infinite' }
                : undefined
            }
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    );
  }
);

MicroGlanceNotice.displayName = 'MicroGlanceNotice';
