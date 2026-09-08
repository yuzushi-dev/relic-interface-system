'use client';

import React from 'react';
import { IconActivity, IconDatabase, IconRadio, IconShield } from './Icons';

export interface KpiCardData {
  id: string;
  label: string;
  sublabel: string;
  value: string;
  unit: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral' | 'alert';
  status: string;
  sparkline: number[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const DEFAULT_KPIS: KpiCardData[] = [
  {
    id: 'bitrate',
    label: 'TRANSFER BITRATE',
    sublabel: 'PRIMARY BUS // CH-0',
    value: '4.82',
    unit: 'Gbps',
    delta: 'Δ +18%',
    deltaType: 'positive',
    status: 'OPTIMAL',
    sparkline: [28, 35, 42, 38, 45, 52, 49, 60, 58, 65, 72, 70],
    icon: IconActivity,
  },
  {
    id: 'buffer',
    label: 'BUFFER INTEGRITY',
    sublabel: 'RING-0 CRC32 CHECKSUM',
    value: '99.94',
    unit: '%',
    delta: 'Δ -0.02%',
    deltaType: 'neutral',
    status: 'SYNCHRONIZED',
    sparkline: [99.8, 99.85, 99.9, 99.88, 99.92, 99.94, 99.93, 99.95, 99.94],
    icon: IconDatabase,
  },
  {
    id: 'snr',
    label: 'SIGNAL NOISE (SNR)',
    sublabel: 'CARRIER HARMONICS',
    value: '-88.4',
    unit: 'dB',
    delta: 'Δ -1.8 dB',
    deltaType: 'positive',
    status: 'CARRIER LOCK',
    sparkline: [-82, -84, -83, -85, -87, -86, -88, -87.5, -88.4],
    icon: IconRadio,
  },
  {
    id: 'threat',
    label: 'THREAT INDEX',
    sublabel: 'DEFCON STATUS',
    value: '0.14',
    unit: 'LVL',
    delta: 'Δ LOW RISK',
    deltaType: 'positive',
    status: 'PASSIVE DEFENSE',
    sparkline: [0.18, 0.16, 0.19, 0.15, 0.17, 0.14, 0.13, 0.14],
    icon: IconShield,
  },
];

export const KpiGrid: React.FC<{ items?: KpiCardData[] }> = ({ items = DEFAULT_KPIS }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 select-none">
      {items.map((kpi) => {
        const Icon = kpi.icon;

        // Render simple inline SVG sparkline path
        const minVal = Math.min(...kpi.sparkline);
        const maxVal = Math.max(...kpi.sparkline);
        const range = maxVal - minVal || 1;
        const width = 80;
        const height = 24;
        const points = kpi.sparkline
          .map((v, i) => {
            const x = (i / (kpi.sparkline.length - 1)) * width;
            const y = height - ((v - minVal) / range) * (height - 4) - 2;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ');

        return (
          <div
            key={kpi.id}
            className="ris-kpi group relative flex flex-col justify-between p-3.5 bg-ris-surface1 border border-ris-line hover:border-ris-lineStrong transition-colors duration-fast"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] uppercase text-ris-fg3 tracking-wider font-semibold block">
                  {kpi.label}
                </span>
                <span className="font-mono text-[10px] text-ris-fg2/85 block truncate font-medium">
                  {kpi.sublabel}
                </span>
              </div>
              <div className="p-1.5 bg-ris-surface2 border border-ris-line text-ris-accent">
                <Icon size={14} />
              </div>
            </div>

            {/* Middle row: Big metric value with tabular numerals */}
            <div className="flex items-baseline justify-between mt-3 mb-2">
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-ris-fg1 tracking-tight tabular-nums">
                  {kpi.value}
                </span>
                <span className="font-mono text-xs text-ris-fg3 uppercase font-medium">
                  {kpi.unit}
                </span>
              </div>

              {/* Mini Sparkline Chart */}
              <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
                aria-hidden="true"
              >
                <polyline
                  fill="none"
                  stroke="var(--ris-accent)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>

            {/* Bottom row: Delta Pill & State Status */}
            <div className="flex items-center justify-between pt-2 border-t border-ris-line/60">
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 font-semibold ${
                  kpi.deltaType === 'positive'
                    ? 'bg-ris-green/15 text-ris-green'
                    : kpi.deltaType === 'alert'
                    ? 'bg-ris-red/15 text-ris-red'
                    : 'bg-ris-cyan/15 text-ris-cyan'
                }`}
              >
                {kpi.delta}
              </span>
              <span className="font-mono text-[9px] text-ris-fg3 uppercase tracking-wider">
                {kpi.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
