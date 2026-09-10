import { forwardRef } from 'react';
import { MicroBaseProps, resolveMicroSize, resolveMicroColor } from './types.js';

export type MicroConstellationVariant = 'star' | 'relay' | 'tree';
export type MicroConstellationPreset = 'network-3node' | 'orbital-relay' | 'signal-tree';

export interface MicroConstellationNode {
  /** X-coordinate inside 0–32 coordinate system */
  x: number;
  /** Y-coordinate inside 0–32 coordinate system */
  y: number;
  /** Node radius in pixels (default: 2) */
  r?: number;
  /** Monospace micro identification tag */
  label?: string;
}

export interface MicroConstellationProps extends MicroBaseProps {
  /** Visual variant: 'star' | 'relay' | 'tree' */
  variant?: MicroConstellationVariant;
  /** Quick-start tactical preset configuration */
  preset?: MicroConstellationPreset;
  /** Array of planar graph node coordinates and labels */
  nodes?: MicroConstellationNode[];
  /** Array of directed/undirected index pairs [fromNode, toNode] */
  edges?: Array<[number, number]>;
  /** Index of node displaying beacon ping (default: 0) */
  pulseNode?: number;
}

const PRESET_NETWORK_3NODE_NODES: MicroConstellationNode[] = [
  { x: 16, y: 7, r: 2.5, label: '01' },
  { x: 6, y: 24, r: 2, label: '02' },
  { x: 26, y: 24, r: 2, label: '03' },
];
const PRESET_NETWORK_3NODE_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 0],
];

const PRESET_ORBITAL_RELAY_NODES: MicroConstellationNode[] = [
  { x: 16, y: 16, r: 3, label: 'HUB' },
  { x: 7, y: 9, r: 1.75, label: 'S1' },
  { x: 25, y: 9, r: 1.75, label: 'S2' },
  { x: 16, y: 27, r: 2, label: 'R1' },
];
const PRESET_ORBITAL_RELAY_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
];

const PRESET_SIGNAL_TREE_NODES: MicroConstellationNode[] = [
  { x: 16, y: 6, r: 2.5, label: 'TX' },
  { x: 9, y: 16, r: 2, label: 'A' },
  { x: 23, y: 16, r: 2, label: 'B' },
  { x: 5, y: 26, r: 1.5, label: 'A1' },
  { x: 13, y: 26, r: 1.5, label: 'A2' },
  { x: 25, y: 26, r: 1.5, label: 'B1' },
];
const PRESET_SIGNAL_TREE_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
];

const DEFAULT_STAR_NODES: MicroConstellationNode[] = [
  { x: 16, y: 16, r: 2.75, label: 'C' },
  { x: 16, y: 5, r: 2, label: 'N' },
  { x: 27, y: 16, r: 2, label: 'E' },
  { x: 16, y: 27, r: 2, label: 'S' },
  { x: 5, y: 16, r: 2, label: 'W' },
];
const DEFAULT_STAR_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
];

/**
 * Tactical Constellation & Network Graph Atom (`<MicroConstellation>`).
 * Provides mathematical planar graphs with interconnecting stroke lines,
 * orbital relay schematics, signal hierarchy trees, and pulsing beacon nodes.
 */
export const MicroConstellation = forwardRef<SVGSVGElement, MicroConstellationProps>(
  function MicroConstellation(
    {
      variant,
      preset,
      nodes,
      edges,
      pulseNode,
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
    const effectiveVariant: MicroConstellationVariant = variant ?? (
      preset === 'orbital-relay' ? 'relay' :
      preset === 'signal-tree' ? 'tree' :
      preset === 'network-3node' ? 'star' :
      'star'
    );

    const effectiveNodes = nodes ?? (
      preset === 'network-3node' ? PRESET_NETWORK_3NODE_NODES :
      preset === 'orbital-relay' ? PRESET_ORBITAL_RELAY_NODES :
      preset === 'signal-tree' ? PRESET_SIGNAL_TREE_NODES :
      effectiveVariant === 'relay' ? PRESET_ORBITAL_RELAY_NODES :
      effectiveVariant === 'tree' ? PRESET_SIGNAL_TREE_NODES :
      DEFAULT_STAR_NODES
    );

    const effectiveEdges = edges ?? (
      preset === 'network-3node' ? PRESET_NETWORK_3NODE_EDGES :
      preset === 'orbital-relay' ? PRESET_ORBITAL_RELAY_EDGES :
      preset === 'signal-tree' ? PRESET_SIGNAL_TREE_EDGES :
      effectiveVariant === 'relay' ? PRESET_ORBITAL_RELAY_EDGES :
      effectiveVariant === 'tree' ? PRESET_SIGNAL_TREE_EDGES :
      DEFAULT_STAR_EDGES
    );

    const effectivePulseNode = pulseNode ?? 0;

    const dimension = resolveMicroSize(size, 32);
    const color = resolveMicroColor(status, brand);

    return (
      <svg
        ref={ref}
        viewBox="0 0 32 32"
        width={dimension}
        height={dimension}
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
        className={`ris-micro-constellation ${className}`.trim()}
        style={{
          color,
          flexShrink: 0,
          overflow: 'visible',
          ...style,
        }}
        {...rest}
      >
        {/* 1. VARIANT SCHEMATIC BACKGROUND DECORATION */}
        {effectiveVariant === 'relay' && (
          <g>
            <circle
              cx="16"
              cy="16"
              r="11"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="2 2"
              strokeOpacity="0.25"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              cx="16"
              cy="16"
              rx="13"
              ry="6"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1.5 2"
              strokeOpacity="0.18"
              fill="none"
              transform="rotate(-25 16 16)"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}

        {effectiveVariant === 'star' && (
          <g>
            <circle
              cx="16"
              cy="16"
              r="13"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              strokeOpacity="0.2"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="16"
              y1="2"
              x2="16"
              y2="30"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              strokeOpacity="0.15"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="2"
              y1="16"
              x2="30"
              y2="16"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              strokeOpacity="0.15"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}

        {effectiveVariant === 'tree' && (
          <g>
            <line
              x1="3"
              y1="6"
              x2="29"
              y2="6"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              strokeOpacity="0.18"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="3"
              y1="16"
              x2="29"
              y2="16"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              strokeOpacity="0.18"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="3"
              y1="26"
              x2="29"
              y2="26"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              strokeOpacity="0.18"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}

        {/* 2. GRAPH CONNECTING EDGES */}
        <g>
          {effectiveEdges.map(([fromIdx, toIdx], edgeIndex) => {
            const fromNode = effectiveNodes[fromIdx];
            const toNode = effectiveNodes[toIdx];
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={`edge-${edgeIndex}-${fromIdx}-${toIdx}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.65"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        {/* 3. GRAPH NODES & MICRO LABELS */}
        <g>
          {effectiveNodes.map((node, idx) => {
            const r = node.r ?? 2;
            const isPulsing = idx === effectivePulseNode;

            return (
              <g key={`node-${idx}`}>
                {/* Node Outer Ring with Background Shield */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill="var(--ris-bg, #0a0a0c)"
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Node Center Pip */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={Math.max(0.75, r * 0.45)}
                  fill="currentColor"
                  className={isPulsing && animated ? 'ris-micro-pulse' : undefined}
                />

                {/* Beacon Pulse Ring on Active Node */}
                {isPulsing && (
                  animated ? (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      className="ris-micro-beacon"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r + 1.5}
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeDasharray="1.5 1.5"
                      strokeOpacity="0.45"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                  )
                )}

                {/* Optional Micro Identification Label */}
                {node.label && (
                  <text
                    x={node.x}
                    y={node.y > 20 ? node.y - r - 2 : node.y + r + 4.5}
                    fontSize="4"
                    fontFamily="var(--ris-font-mono, monospace)"
                    fontWeight="600"
                    fill="currentColor"
                    textAnchor={node.x < 8 ? 'start' : node.x > 24 ? 'end' : 'middle'}
                    stroke="none"
                    opacity="0.8"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
);
