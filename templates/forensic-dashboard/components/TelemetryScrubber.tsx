'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { IconActivity, IconPlay, IconPause, IconAlertTriangle } from './Icons';

export interface TelemetryPoint {
  timestamp: string;
  timeLabel: string;
  value: number; // in Mbps
  delta: number;
}

// 60-sample calibrated forensic telemetry dataset
const RAW_TELEMETRY_SERIES: TelemetryPoint[] = [
  { timestamp: '2026-09-08T19:30:00Z', timeLabel: '19:30:00', value: 4120, delta: 0 },
  { timestamp: '2026-09-08T19:30:05Z', timeLabel: '19:30:05', value: 4180, delta: 60 },
  { timestamp: '2026-09-08T19:30:10Z', timeLabel: '19:30:10', value: 4210, delta: 30 },
  { timestamp: '2026-09-08T19:30:15Z', timeLabel: '19:30:15', value: 4190, delta: -20 },
  { timestamp: '2026-09-08T19:30:20Z', timeLabel: '19:30:20', value: 4350, delta: 160 },
  { timestamp: '2026-09-08T19:30:25Z', timeLabel: '19:30:25', value: 4420, delta: 70 },
  { timestamp: '2026-09-08T19:30:30Z', timeLabel: '19:30:30', value: 4390, delta: -30 },
  { timestamp: '2026-09-08T19:30:35Z', timeLabel: '19:30:35', value: 4510, delta: 120 },
  { timestamp: '2026-09-08T19:30:40Z', timeLabel: '19:30:40', value: 4680, delta: 170 },
  { timestamp: '2026-09-08T19:30:45Z', timeLabel: '19:30:45', value: 4720, delta: 40 },
  { timestamp: '2026-09-08T19:30:50Z', timeLabel: '19:30:50', value: 4850, delta: 130 },
  { timestamp: '2026-09-08T19:30:55Z', timeLabel: '19:30:55', value: 4910, delta: 60 },
  { timestamp: '2026-09-08T19:31:00Z', timeLabel: '19:31:00', value: 4880, delta: -30 },
  { timestamp: '2026-09-08T19:31:05Z', timeLabel: '19:31:05', value: 5020, delta: 140 },
  { timestamp: '2026-09-08T19:31:10Z', timeLabel: '19:31:10', value: 5180, delta: 160 },
  { timestamp: '2026-09-08T19:31:15Z', timeLabel: '19:31:15', value: 5240, delta: 60 }, // Alert > 5200
  { timestamp: '2026-09-08T19:31:20Z', timeLabel: '19:31:20', value: 5390, delta: 150 }, // Alert
  { timestamp: '2026-09-08T19:31:25Z', timeLabel: '19:31:25', value: 5420, delta: 30 }, // Alert
  { timestamp: '2026-09-08T19:31:30Z', timeLabel: '19:31:30', value: 5438, delta: 18 }, // Alert Δ +18
  { timestamp: '2026-09-08T19:31:35Z', timeLabel: '19:31:35', value: 5310, delta: -128 }, // Alert
  { timestamp: '2026-09-08T19:31:40Z', timeLabel: '19:31:40', value: 5150, delta: -160 },
  { timestamp: '2026-09-08T19:31:45Z', timeLabel: '19:31:45', value: 4980, delta: -170 },
  { timestamp: '2026-09-08T19:31:50Z', timeLabel: '19:31:50', value: 4890, delta: -90 },
  { timestamp: '2026-09-08T19:31:55Z', timeLabel: '19:31:55', value: 4780, delta: -110 },
  { timestamp: '2026-09-08T19:32:00Z', timeLabel: '19:32:00', value: 4820, delta: 40 },
  { timestamp: '2026-09-08T19:32:05Z', timeLabel: '19:32:05', value: 4860, delta: 40 },
  { timestamp: '2026-09-08T19:32:10Z', timeLabel: '19:32:10', value: 4810, delta: -50 },
  { timestamp: '2026-09-08T19:32:15Z', timeLabel: '19:32:15', value: 4940, delta: 130 },
  { timestamp: '2026-09-08T19:32:20Z', timeLabel: '19:32:20', value: 4990, delta: 50 },
  { timestamp: '2026-09-08T19:32:25Z', timeLabel: '19:32:25', value: 5080, delta: 90 },
  { timestamp: '2026-09-08T19:32:30Z', timeLabel: '19:32:30', value: 5120, delta: 40 },
  { timestamp: '2026-09-08T19:32:35Z', timeLabel: '19:32:35', value: 5280, delta: 160 }, // Alert
  { timestamp: '2026-09-08T19:32:40Z', timeLabel: '19:32:40', value: 5340, delta: 60 }, // Alert
  { timestamp: '2026-09-08T19:32:45Z', timeLabel: '19:32:45', value: 5210, delta: -130 }, // Alert
  { timestamp: '2026-09-08T19:32:50Z', timeLabel: '19:32:50', value: 5050, delta: -160 },
  { timestamp: '2026-09-08T19:32:55Z', timeLabel: '19:32:55', value: 4920, delta: -130 },
  { timestamp: '2026-09-08T19:33:00Z', timeLabel: '19:33:00', value: 4890, delta: -30 },
  { timestamp: '2026-09-08T19:33:05Z', timeLabel: '19:33:05', value: 4830, delta: -60 },
  { timestamp: '2026-09-08T19:33:10Z', timeLabel: '19:33:10', value: 4820, delta: -10 },
  { timestamp: '2026-09-08T19:33:15Z', timeLabel: '19:33:15', value: 4850, delta: 30 },
];

const PEAK_ALERT_THRESHOLD = 5200; // Mbps

export const TelemetryScrubber: React.FC = () => {
  const [telemetrySeries, setTelemetrySeries] = useState<TelemetryPoint[]>(RAW_TELEMETRY_SERIES);
  const [timeRange, setTimeRange] = useState<'1M' | '5M' | '15M'>('5M');
  const [isLive, setIsLive] = useState<boolean>(true);

  // Active timeRange filtering:
  // 1M: last 12 points (60s)
  // 5M: last 20 points
  // 15M: all points
  const visibleData = useMemo(() => {
    if (timeRange === '1M') return telemetrySeries.slice(-12);
    if (timeRange === '5M') return telemetrySeries.slice(-20);
    return telemetrySeries;
  }, [telemetrySeries, timeRange]);

  const [selectedIndex, setSelectedIndex] = useState<number>(Math.min(18, visibleData.length - 1));
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Synchronize index when visibleData length changes
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, visibleData.length - 1));
  }, [visibleData.length]);

  // Live real-time telemetry stream (appends new reading every 3s when isLive is true)
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTelemetrySeries((prev) => {
        const last = prev[prev.length - 1];
        const now = new Date();
        const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
        const t = now.getTime() / 8000;
        const simulatedVal = Math.round(4850 + Math.sin(t) * 320);
        const delta = simulatedVal - last.value;
        const newPoint: TelemetryPoint = {
          timestamp: now.toISOString(),
          timeLabel: timeStr,
          value: simulatedVal,
          delta,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const selectedPoint = visibleData[selectedIndex] || visibleData[visibleData.length - 1];
  const isPeakAlert = selectedPoint.value >= PEAK_ALERT_THRESHOLD;

  // Chart coordinate math (memoized to guarantee zero reflow)
  const viewBoxWidth = 800;
  const viewBoxHeight = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };

  const graphWidth = viewBoxWidth - padding.left - padding.right;
  const graphHeight = viewBoxHeight - padding.top - padding.bottom;

  const minVal = 4000;
  const maxVal = 5600;

  const pointsCoordinates = useMemo(() => {
    return visibleData.map((pt, i) => {
      const x = padding.left + (i / Math.max(1, visibleData.length - 1)) * graphWidth;
      const normalizedY = (pt.value - minVal) / (maxVal - minVal);
      const y = padding.top + graphHeight - normalizedY * graphHeight;
      return { x, y, pt, i };
    });
  }, [visibleData, graphWidth, graphHeight, minVal, maxVal, padding.left, padding.top]);

  // Line SVG path & Area path
  const linePath = useMemo(() => {
    return pointsCoordinates.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}` : `${acc} L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }, '');
  }, [pointsCoordinates]);

  const areaPath = useMemo(() => {
    if (pointsCoordinates.length === 0) return '';
    const bottomY = padding.top + graphHeight;
    const firstX = pointsCoordinates[0].x.toFixed(1);
    const lastX = pointsCoordinates[pointsCoordinates.length - 1].x.toFixed(1);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, pointsCoordinates, graphHeight, padding.top]);

  // Threshold Y coordinate
  const thresholdY = padding.top + graphHeight - ((PEAK_ALERT_THRESHOLD - minVal) / (maxVal - minVal)) * graphHeight;

  // Scrubber pointer movement handler
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const relativeX = clientX - rect.left;
      const scaleX = viewBoxWidth / rect.width;
      const svgX = relativeX * scaleX;

      // Find nearest point
      let closestIdx = 0;
      let minDistance = Infinity;
      pointsCoordinates.forEach((coord, i) => {
        const dist = Math.abs(coord.x - svgX);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });
      setSelectedIndex(closestIdx);
    },
    [pointsCoordinates, viewBoxWidth]
  );

  // Keyboard navigation for full WCAG 2.1.1 keyboard accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(visibleData.length - 1, prev + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setSelectedIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setSelectedIndex(visibleData.length - 1);
      }
    },
    [visibleData.length]
  );

  const currentCoord = pointsCoordinates[selectedIndex] || pointsCoordinates[0];

  return (
    <section
      className="ris-panel w-full bg-ris-surface1 border border-ris-line relative select-none"
      aria-labelledby="telemetry-scrubber-heading"
    >
      {/* Header Chrome */}
      <div className="ris-panel-head">
        <div className="flex items-center gap-2">
          <IconActivity size={15} className="text-ris-accent" />
          <h2 id="telemetry-scrubber-heading" className="font-mono text-xs font-bold text-ris-fg1 tracking-wider uppercase">
            FORENSIC TELEMETRY STREAM // BUS-0
          </h2>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="hidden sm:flex items-center bg-ris-surface3 p-0.5 border border-ris-line">
            {(['1M', '5M', '15M'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`font-mono text-[10px] px-2 py-0.5 uppercase transition-colors duration-instant ${
                  timeRange === range
                    ? 'bg-ris-accent text-ris-fgInvert font-semibold'
                    : 'text-ris-fg3 hover:text-ris-fg1'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Pause / Live streaming button */}
          <button
            type="button"
            onClick={() => setIsLive(!isLive)}
            className={`ris-btn ris-btn--sm flex items-center gap-1.5 py-1 px-2.5 font-mono text-[11px] ${
              isLive ? 'ris-btn--ghost text-ris-green border-ris-green/40' : 'ris-btn--ghost text-ris-fg3'
            }`}
          >
            {isLive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-ris-green animate-pulse" />
                <IconPause size={12} />
                <span>LIVE</span>
              </>
            ) : (
              <>
                <IconPlay size={12} />
                <span>PAUSED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Readout Bar (Zero Reflow Tabular Box) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2.5 bg-ris-surface2 border-b border-ris-line font-mono text-xs">
        {/* Timestamp */}
        <div>
          <span className="text-ris-fg4 text-[10px] block">TIMESTAMP:</span>
          <span className="text-ris-fg1 font-semibold tabular-nums">
            {selectedPoint.timeLabel} UTC
          </span>
        </div>

        {/* Value */}
        <div>
          <span className="text-ris-fg4 text-[10px] block">TRANSFER RATE:</span>
          <span className="text-ris-fg1 font-bold text-sm tabular-nums text-ris-accent">
            {selectedPoint.value.toLocaleString()} <span className="text-[11px] text-ris-fg3 font-normal">Mbps</span>
          </span>
        </div>

        {/* Delta */}
        <div>
          <span className="text-ris-fg4 text-[10px] block">CALIBRATED DELTA:</span>
          <span
            className={`font-semibold tabular-nums ${
              selectedPoint.delta > 0
                ? 'text-ris-green'
                : selectedPoint.delta < 0
                ? 'text-ris-yellow'
                : 'text-ris-fg3'
            }`}
          >
            {selectedPoint.delta > 0 ? `Δ +${selectedPoint.delta}` : `Δ ${selectedPoint.delta}`} Mbps
          </span>
        </div>

        {/* Threshold status / PEAK ALERT */}
        <div className="flex flex-col justify-center">
          <span className="text-ris-fg4 text-[10px] block">STATUS:</span>
          {isPeakAlert ? (
            <span className="inline-flex items-center gap-1 font-bold text-ris-red px-1.5 py-0.5 bg-ris-red/20 border border-ris-red/50 chamfer-sm text-[11px] animate-pulse">
              <IconAlertTriangle size={12} />
              [PEAK ALERT]
            </span>
          ) : (
            <span className="text-ris-green font-semibold text-[11px]">
              NOMINAL // WITHIN BOUNDS
            </span>
          )}
        </div>
      </div>

      {/* Interactive SVG Chart Canvas with Full Keyboard Accessibility */}
      <div
        tabIndex={0}
        role="slider"
        aria-label="Interactive Telemetry Scrubber Chart (use Left/Right arrow keys to inspect points)"
        aria-valuemin={0}
        aria-valuemax={visibleData.length - 1}
        aria-valuenow={selectedIndex}
        aria-valuetext={`${selectedPoint.value} Mbps at ${selectedPoint.timeLabel} UTC`}
        onKeyDown={handleKeyDown}
        className="p-3 bg-ris-void/40 relative focus:outline-none focus:ring-1 focus:ring-ris-accent"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto cursor-crosshair touch-none select-none block"
          onPointerMove={handlePointerMove}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ris-accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--ris-accent)" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[4000, 4400, 4800, 5200, 5600].map((val) => {
            const y = padding.top + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={viewBoxWidth - padding.right}
                  y2={y}
                  stroke="var(--ris-line-faint)"
                  strokeDasharray="2 4"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="var(--ris-fg4)"
                  fontSize="10"
                  fontFamily="var(--ris-font-mono)"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Threshold alert line (5200 Mbps) */}
          <line
            x1={padding.left}
            y1={thresholdY}
            x2={viewBoxWidth - padding.right}
            y2={thresholdY}
            stroke="var(--ris-red)"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.6}
          />
          <text
            x={viewBoxWidth - padding.right - 4}
            y={thresholdY - 4}
            textAnchor="end"
            fill="var(--ris-red)"
            fontSize="9"
            fontFamily="var(--ris-font-mono)"
            fontWeight="bold"
          >
            PEAK THRESHOLD (5,200 Mbps)
          </text>

          {/* Filled Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Data Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--ris-accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Scrubber Vertical Bar */}
          <line
            x1={currentCoord.x}
            y1={padding.top}
            x2={currentCoord.x}
            y2={padding.top + graphHeight}
            stroke={isPeakAlert ? 'var(--ris-red)' : 'var(--ris-fg1)'}
            strokeWidth={1.5}
            strokeDasharray={isPeakAlert ? 'none' : '2 2'}
          />

          {/* Scrubber active point marker */}
          <circle
            cx={currentCoord.x}
            cy={currentCoord.y}
            r={5}
            fill={isPeakAlert ? 'var(--ris-red)' : 'var(--ris-accent)'}
            stroke="var(--ris-bg)"
            strokeWidth={2}
          />
          <circle
            cx={currentCoord.x}
            cy={currentCoord.y}
            r={8}
            fill="none"
            stroke={isPeakAlert ? 'var(--ris-red)' : 'var(--ris-accent)'}
            strokeWidth={1}
            opacity={0.4}
            className="animate-ping"
          />
        </svg>
      </div>

      {/* Footer scrubber instructions */}
      <div className="px-4 py-2 bg-ris-surface2 border-t border-ris-line flex items-center justify-between font-mono text-[10px] text-ris-fg3">
        <span>INTERACTIVE SCRUBBER: HOVER / TOUCH DRAG / KEYBOARD ARROWS</span>
        <span className="text-ris-accent font-semibold">POINT [{selectedIndex + 1}/{visibleData.length}]</span>
      </div>
    </section>
  );
};
