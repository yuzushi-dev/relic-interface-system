'use client';

import React, { useEffect, useRef, useState, forwardRef } from 'react';
import {
  RisChartsCore,
  ScrubPoint,
  LineChartOptions,
  BarChartOptions,
  GaugeChartOptions,
  EegWaveformOptions,
} from '../utils/risChartsCore.js';

export type { ScrubPoint };

function getEngine() {
  return RisChartsCore;
}

/* ============================================================================
   1. LINE CHART
   ========================================================================== */

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onScrub'> {
  /** Numerical dataset */
  points: number[];
  /** Optional X-axis category labels corresponding to points */
  categories?: string[];
  /** Primary line color (CSS token or hex) */
  color?: string;
  /** Telemetry measurement unit (e.g. ' bpm', ' ms', ' %') */
  unit?: string;
  /** Whether to render the soft neon area under the curve (default: true) */
  area?: boolean;
  /** Number of vertical grid subdivisions (default: 6) */
  gridX?: number;
  /** Number of horizontal grid subdivisions (default: 4) */
  gridY?: number;
  /** Whether mouse/touch scrubbing HUD overlay is enabled (default: true) */
  interactive?: boolean;
  /** Whether continuous ambient phosphor micro-sweep is active (default: true) */
  ambientSweep?: boolean;
  /** Whether to play the 750ms entry stroke animation (default: true) */
  animate?: boolean;
  /** Accessible label describing the chart for screen readers */
  label?: string;
  /** Chart height in pixels (default: 140) */
  height?: number;
  /** Fixed width in pixels (if omitted, chart responsively tracks container width via ResizeObserver) */
  width?: number;
  /** Custom formatter function for HUD value display */
  format?: (val: number) => string;
  /** Callback fired when pointer scrubs over a data point (or null on leave) */
  onScrub?: (point: ScrubPoint | null) => void;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  {
    points,
    categories,
    color,
    unit,
    area = true,
    gridX = 6,
    gridY = 4,
    interactive = true,
    ambientSweep = true,
    animate = true,
    label,
    height = 140,
    width: fixedWidth,
    format,
    onScrub,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(fixedWidth || 320);

  // ResizeObserver auto-tracking
  useEffect(() => {
    if (fixedWidth) {
      setContainerWidth(fixedWidth);
      return;
    }

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        if (w > 20) {
          setContainerWidth(w);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [fixedWidth]);

  // Chart rendering & auto-cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (!container || points.length === 0) return;

    container.innerHTML = '';
    const engine = getEngine();

    const opts: LineChartOptions = {
      width: containerWidth,
      height,
      color,
      unit,
      categories,
      area,
      gridX,
      gridY,
      interactive,
      ambientSweep,
      animate,
      label,
      format,
      onScrub,
    };

    const svg = engine.line(container, points, opts);

    return () => {
      if (svg && svg.parentNode === container) {
        container.removeChild(svg);
      }
      container.innerHTML = '';
    };
  }, [
    points,
    containerWidth,
    height,
    color,
    unit,
    categories,
    area,
    gridX,
    gridY,
    interactive,
    ambientSweep,
    animate,
    label,
    format,
    onScrub,
  ]);

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`ris-chart-container ris-chart-line ${className}`.trim()}
      style={{
        position: 'relative',
        width: fixedWidth ? `${fixedWidth}px` : '100%',
        minHeight: `${height}px`,
        ...style,
      }}
      {...rest}
    />
  );
});

LineChart.displayName = 'LineChart';

/* ============================================================================
   2. BAR CHART
   ========================================================================== */

export interface BarChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onScrub'> {
  /** Numeric values for each column */
  values: number[];
  /** Category titles for each column */
  categories?: string[];
  /** Primary bar color */
  color?: string;
  /** Telemetry measurement unit */
  unit?: string;
  /** Inter-column gap in pixels (default: 3) */
  gap?: number;
  /** Index of bar to highlight with full brightness */
  highlight?: number;
  /** Interactive hover and keyboard navigation (default: true) */
  interactive?: boolean;
  /** Staggered bar entry animation (default: true) */
  animate?: boolean;
  /** Accessible label describing the chart */
  label?: string;
  /** Height in pixels (default: 140) */
  height?: number;
  /** Optional fixed width (otherwise tracks container width) */
  width?: number;
  /** Custom formatter function for values */
  format?: (val: number) => string;
  /** Callback fired when pointer hovers over a bar */
  onScrub?: (point: ScrubPoint | null) => void;
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  {
    values,
    categories,
    color,
    unit,
    gap = 3,
    highlight,
    interactive = true,
    animate = true,
    label,
    height = 140,
    width: fixedWidth,
    format,
    onScrub,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(fixedWidth || 320);

  useEffect(() => {
    if (fixedWidth) {
      setContainerWidth(fixedWidth);
      return;
    }

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        if (w > 20) setContainerWidth(w);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [fixedWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || values.length === 0) return;

    container.innerHTML = '';
    const engine = getEngine();

    const opts: BarChartOptions = {
      width: containerWidth,
      height,
      color,
      unit,
      categories,
      gap,
      highlight,
      interactive,
      animate,
      label,
      format,
      onScrub,
    };

    const svg = engine.bars(container, values, opts);

    return () => {
      if (svg && svg.parentNode === container) {
        container.removeChild(svg);
      }
      container.innerHTML = '';
    };
  }, [
    values,
    containerWidth,
    height,
    color,
    unit,
    categories,
    gap,
    highlight,
    interactive,
    animate,
    label,
    format,
    onScrub,
  ]);

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`ris-chart-container ris-chart-bars ${className}`.trim()}
      style={{
        position: 'relative',
        width: fixedWidth ? `${fixedWidth}px` : '100%',
        minHeight: `${height}px`,
        ...style,
      }}
      {...rest}
    />
  );
});

BarChart.displayName = 'BarChart';

/* ============================================================================
   3. GAUGE CHART
   ========================================================================== */

export interface GaugeChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onScrub'> {
  /** Value from 0.0 to 1.0 */
  value: number;
  /** Descriptive caption label (e.g. 'THROTTLE', 'BUFFER') */
  caption?: string;
  /** Unit suffix (default: '%') */
  unit?: string;
  /** Number of tactical segmented bars (default: 16) */
  segments?: number;
  /** Active segment fill color */
  color?: string;
  /** Interactive accessible meter */
  interactive?: boolean;
  /** Accessible label */
  label?: string;
  /** Chart height (default: 64) */
  height?: number;
  /** Chart width (default: 120) */
  width?: number;
  /** Callback fired on interaction */
  onScrub?: (value: number | null) => void;
}

export const GaugeChart = forwardRef<HTMLDivElement, GaugeChartProps>(function GaugeChart(
  {
    value,
    caption = 'GAUGE',
    unit = '%',
    segments = 16,
    color,
    interactive = true,
    label,
    height = 64,
    width = 120,
    onScrub,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const engine = getEngine();

    const opts: GaugeChartOptions = {
      width,
      height,
      segments,
      caption,
      unit,
      color,
      interactive,
      label,
      onScrub,
    };

    const svg = engine.gauge(container, value, opts);

    return () => {
      if (svg && svg.parentNode === container) {
        container.removeChild(svg);
      }
      container.innerHTML = '';
    };
  }, [value, caption, unit, segments, color, interactive, label, height, width, onScrub]);

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`ris-chart-container ris-chart-gauge ${className}`.trim()}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'inline-block',
        ...style,
      }}
      {...rest}
    />
  );
});

GaugeChart.displayName = 'GaugeChart';

/* ============================================================================
   4. SPARKLINE
   ========================================================================== */

export interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of values */
  points: number[];
  /** Color of sparkline stroke */
  color?: string;
  /** Sparkline width in pixels (default: 96) */
  width?: number;
  /** Sparkline height in pixels (default: 28) */
  height?: number;
  /** Accessible label */
  label?: string;
}

export const Sparkline = forwardRef<HTMLDivElement, SparklineProps>(function Sparkline(
  {
    points,
    color,
    width = 96,
    height = 28,
    label = 'sparkline',
    className = '',
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || points.length === 0) return;

    container.innerHTML = '';
    const engine = getEngine();

    const svg = engine.spark(container, points, {
      width,
      height,
      color,
      label,
    });

    return () => {
      if (svg && svg.parentNode === container) {
        container.removeChild(svg);
      }
      container.innerHTML = '';
    };
  }, [points, color, width, height, label]);

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`ris-chart-container ris-chart-spark ${className}`.trim()}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
      {...rest}
    />
  );
});

Sparkline.displayName = 'Sparkline';

/* ============================================================================
   5. EEG WAVEFORM
   ========================================================================== */

export interface EegWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Multi-channel biometric signal matrices: [channel_1_samples[], channel_2_samples[], ...] */
  channels: number[][];
  /** Color array for channels */
  colors?: string[];
  /** Fixed width in pixels (otherwise tracks container width) */
  width?: number;
  /** Height in pixels (default: 160) */
  height?: number;
  /** Accessible label */
  label?: string;
}

export const EegWaveform = forwardRef<HTMLDivElement, EegWaveformProps>(function EegWaveform(
  {
    channels,
    colors,
    width: fixedWidth,
    height = 160,
    label = 'eeg multi-channel waveform',
    className = '',
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(fixedWidth || 360);

  useEffect(() => {
    if (fixedWidth) {
      setContainerWidth(fixedWidth);
      return;
    }

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        if (w > 20) setContainerWidth(w);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [fixedWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || channels.length === 0) return;

    container.innerHTML = '';
    const engine = getEngine();

    const opts: EegWaveformOptions = {
      width: containerWidth,
      height,
      colors,
      label,
    };

    const svg = engine.eegWaveform(container, channels, opts);

    return () => {
      if (svg && svg.parentNode === container) {
        container.removeChild(svg);
      }
      container.innerHTML = '';
    };
  }, [channels, containerWidth, height, colors, label]);

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`ris-chart-container ris-chart-eeg ${className}`.trim()}
      style={{
        position: 'relative',
        width: fixedWidth ? `${fixedWidth}px` : '100%',
        minHeight: `${height}px`,
        ...style,
      }}
      {...rest}
    />
  );
});

EegWaveform.displayName = 'EegWaveform';
