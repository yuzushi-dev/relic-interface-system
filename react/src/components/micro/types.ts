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
