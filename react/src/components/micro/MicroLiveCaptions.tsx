import { forwardRef, useId } from 'react';
import {
  MicroLiveCaptionsProps,
  EyewearOpticalProfile,
  RisBrand,
  RisMicroStatus,
  resolveMicroSize,
  resolveMicroColor,
} from './types.js';

export type { MicroLiveCaptionsProps, EyewearOpticalProfile };

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

/**
 * Tactical Live Speech-to-Text & Teleprompter Micro-HUD Component (`<MicroLiveCaptions>`).
 * Provides high-contrast emissive subtitles and transcription for smart glasses optical waveguides.
 * Features 45° chamfered wireframe boundary brackets, an animated recording indicator dot,
 * speaker identifier badge, and zero-reflow two-line typography with defensive character limits.
 *
 * Native viewBox: 0 0 240 52 (60:13 aspect ratio).
 */
export const MicroLiveCaptions = forwardRef<SVGSVGElement, MicroLiveCaptionsProps>(
  function MicroLiveCaptions(
    {
      line1 = 'SPEECH RECOGNITION ACTIVE...',
      line2 = 'TRANSLATION [EN -> IT] IN PROGRESS',
      speaker = 'SYS // AUDIO-01',
      listening = true,
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
    const totalWidth = 240;
    const totalHeight = 52;

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

    const clipId = useId();
    const cleanSpeaker = (speaker !== undefined ? speaker : 'SYS // AUDIO-01').slice(0, 20).toUpperCase();
    const cleanLine1 = (line1 ?? '').slice(0, 34).toUpperCase();
    const cleanLine2 = (line2 ?? '').slice(0, 34).toUpperCase();

    const dynamicAriaLabel =
      ariaLabel ??
      (`Live captions: ` + [cleanLine1, cleanLine2].filter(Boolean).join(' ')).trim();

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
        data-listening={listening ? 'true' : 'false'}
        className={`ris-micro-captions ris-eyewear-glass ${opticalClass} ${className}`.trim()}
        style={{
          color,
          flexShrink: 0,
          overflow: 'visible',
          ...style,
        }}
        {...rest}
      >
        <title>{dynamicAriaLabel}</title>

        <defs>
          <clipPath id={clipId}>
            <rect x="14" y="16" width="206" height="32" />
          </clipPath>
        </defs>

        {/* Top status row */}
        <g className="ris-micro-captions-status">
          {/* Audio listening indicator: pulsing dot */}
          <circle
            cx="14"
            cy="10"
            r="3"
            fill="currentColor"
            stroke="none"
            opacity={listening ? 1 : 0.35}
            className={listening ? 'ris-micro-listen' : undefined}
          />

          {/* Header text / Speaker badge */}
          <text
            x="24"
            y="13"
            fontSize="8"
            fontWeight="700"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.06em"
            fill="currentColor"
            stroke="none"
            opacity="0.9"
          >
            {listening ? `[REC] ${cleanSpeaker}` : `[IDLE] ${cleanSpeaker}`}
          </text>

          {/* Right border notch at x=226, y=10 */}
          <line
            x1="222"
            y1="10"
            x2="228"
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="226"
            y1="7"
            x2="226"
            y2="13"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Flanking boundary wireframes */}
        <g className="ris-micro-captions-wireframe">
          <path
            d="M 6,14 L 6,46 L 12,46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.6"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 234,14 L 234,46 L 228,46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.6"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Captions text body with containment clipPath */}
        <g className="ris-micro-captions-body" clipPath={`url(#${clipId})`}>
          <text
            x="14"
            y="28"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.02em"
            fill="currentColor"
            stroke="none"
          >
            {cleanLine1}
          </text>
          <text
            x="14"
            y="41"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--ris-font-mono, monospace)"
            letterSpacing="0.02em"
            fill="currentColor"
            stroke="none"
            opacity="0.85"
          >
            {cleanLine2}
          </text>
        </g>
      </svg>
    );
  }
);

MicroLiveCaptions.displayName = 'MicroLiveCaptions';
