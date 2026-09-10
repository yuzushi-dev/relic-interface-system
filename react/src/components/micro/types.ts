import React from 'react';

export type RisBrand = 'relic' | 'biohub' | 'omnikon' | 'neutral';
export type RisMicroStatus = 'nominal' | 'active' | 'warning' | 'critical' | 'idle';
export type RisMicroSize = 'sm' | 'md' | 'lg' | number;

export interface MicroBaseProps extends React.SVGAttributes<SVGSVGElement> {
  brand?: RisBrand;
  status?: RisMicroStatus;
  size?: RisMicroSize;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function resolveMicroSize(size: RisMicroSize = 'md', defaultPx = 32): number {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'sm': return defaultPx * 0.75;
    case 'lg': return defaultPx * 1.5;
    case 'md':
    default: return defaultPx;
  }
}

export function resolveMicroColor(status?: RisMicroStatus, brand?: RisBrand): string | undefined {
  if (status) {
    switch (status) {
      case 'nominal': return 'var(--ris-green, #5fae84)';
      case 'active': return 'var(--ris-accent, #e6a23c)';
      case 'warning': return 'var(--ris-yellow, #e6a23c)';
      case 'critical': return 'var(--ris-red, #d45565)';
      case 'idle': return 'var(--ris-fg4, #97a4ad)';
    }
  }
  if (brand) {
    switch (brand) {
      case 'relic': return 'var(--ris-yellow, #e6a23c)';
      case 'biohub': return 'var(--ris-cyan, #6fb3c9)';
      case 'omnikon': return 'var(--ris-red, #d45565)';
      case 'neutral': return 'var(--ris-violet, #8479be)';
    }
  }
  return undefined;
}

/* ==========================================================================
   EYEWEAR MICRO-HUD TYPES & PROPS
   Optical waveguide, biometrics, turn-by-turn wayfinding, live captions & AR
   ========================================================================== */

export type MicroManeuver =
  | 'straight'
  | 'slight-right'
  | 'right'
  | 'sharp-right'
  | 'slight-left'
  | 'left'
  | 'sharp-left'
  | 'u-turn';

export type EyewearOpticalProfile =
  | 'phosphor-green'
  | 'tactical-amber'
  | 'cyber-cyan'
  | 'alert-red';

export type EyewearHudMode =
  | 'ambient'
  | 'commute'
  | 'meeting'
  | 'field-ops';

export interface MicroNavGuidanceProps extends MicroBaseProps {
  maneuver?: MicroManeuver;
  distanceMeters?: number;
  streetName?: string;
  eta?: string;
  opticalProfile?: EyewearOpticalProfile;
}

export interface MicroLiveCaptionsProps extends MicroBaseProps {
  line1?: string;
  line2?: string;
  speaker?: string;
  listening?: boolean;
  opticalProfile?: EyewearOpticalProfile;
}

export interface MicroVitalTelemetryProps extends MicroBaseProps {
  heartRate?: number;
  hrZone?: 1 | 2 | 3 | 4 | 5;
  altitudeMeters?: number;
  batteryPercent?: number;
  batteryRuntimeHours?: number;
  opticalProfile?: EyewearOpticalProfile;
}

export interface MicroGlanceNoticeProps extends MicroBaseProps {
  category?: 'CALENDAR' | 'COLLISION' | 'SYSTEM' | 'SECURITY';
  title?: string;
  subtitle?: string;
  severity?: 'info' | 'warn' | 'critical';
  dismissProgress?: number;
}

export type MicroSpatialInspectionStatus = 'scanning' | 'locked' | 'standby';

export interface MicroSpatialInspectionProps extends Omit<MicroBaseProps, 'status'> {
  distanceMeters?: number;
  targetLabel?: string;
  status?: MicroSpatialInspectionStatus;
  specCode?: string;
  bracketWidth?: number;
  bracketHeight?: number;
}

export interface SmartGlassesHUDProps extends MicroBaseProps {
  mode?: EyewearHudMode;
  opticalProfile?: EyewearOpticalProfile;
  navData?: Partial<MicroNavGuidanceProps>;
  captionData?: Partial<MicroLiveCaptionsProps>;
  vitalData?: Partial<MicroVitalTelemetryProps>;
  noticeData?: Partial<MicroGlanceNoticeProps>;
  inspectionData?: Partial<MicroSpatialInspectionProps>;
}

