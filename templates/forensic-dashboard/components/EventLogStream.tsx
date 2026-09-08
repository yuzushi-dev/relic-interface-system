'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  IconTerminal,
  IconPlay,
  IconPause,
  IconTrash,
  IconFilter,
  IconAlertTriangle,
} from './Icons';

export type EventSeverity = 'INFO' | 'WARN' | 'CRITICAL';

export interface ForensicEvent {
  id: string;
  timestamp: string;
  severity: EventSeverity;
  subsystem: string;
  message: string;
  sourceIp?: string;
}

const INITIAL_EVENTS: ForensicEvent[] = [
  {
    id: 'evt-001',
    timestamp: '19:33:42.102',
    severity: 'INFO',
    subsystem: 'RING-0',
    message: 'Kernel integrity audit complete: CRC32 0x9B44F2 matches signed manifest.',
  },
  {
    id: 'evt-002',
    timestamp: '19:33:45.318',
    severity: 'INFO',
    subsystem: 'BUS-0',
    message: 'Carrier lock acquired on primary telemetry bus (4.82 Gbps, SNR -88.4 dB).',
  },
  {
    id: 'evt-003',
    timestamp: '19:33:49.004',
    severity: 'WARN',
    subsystem: 'MEMORY',
    message: 'Ring buffer pool delta excursion: high allocation transient detected (+160 Mbps).',
  },
  {
    id: 'evt-004',
    timestamp: '19:33:52.881',
    severity: 'CRITICAL',
    subsystem: 'SEC-NET',
    message: 'Anomaly in payload packet checksum at offset 0x00FF8C; potential tampering attempt.',
    sourceIp: '192.168.4.120',
  },
  {
    id: 'evt-005',
    timestamp: '19:33:55.220',
    severity: 'INFO',
    subsystem: 'CIPHER',
    message: 'Hardware key renegotiated: AES-256-GCM session key #0084 rotated cleanly.',
  },
  {
    id: 'evt-006',
    timestamp: '19:33:58.749',
    severity: 'WARN',
    subsystem: 'CLOCK',
    message: 'PTP master offset drifted by +2.4 microseconds; phase-locked loop corrected.',
  },
  {
    id: 'evt-007',
    timestamp: '19:34:02.115',
    severity: 'INFO',
    subsystem: 'TELEMETRY',
    message: 'Diagnostic heartbeat acknowledged by remote forensic node [REPLICANT-04].',
  },
];

const SIMULATED_FEED: Omit<ForensicEvent, 'id' | 'timestamp'>[] = [
  {
    severity: 'INFO',
    subsystem: 'BUFFER',
    message: 'Memory block #4912 sealed and hashed for chain-of-custody archive.',
  },
  {
    severity: 'WARN',
    subsystem: 'SIGNAL',
    message: 'Harmonic distortion observed on secondary carrier channel (-82.1 dB).',
  },
  {
    severity: 'INFO',
    subsystem: 'AUTH',
    message: 'Operator authorization token validated: clearance Level 4 verified.',
  },
  {
    severity: 'CRITICAL',
    subsystem: 'DEFCON',
    message: 'Exceedance of upper bitrate envelope: peak alert threshold tripped.',
  },
  {
    severity: 'INFO',
    subsystem: 'KERNEL',
    message: 'Zero-copy DMA descriptor ring reset to base address 0xFFFF8000.',
  },
];

export const EventLogStream: React.FC = () => {
  const [events, setEvents] = useState<ForensicEvent[]>(INITIAL_EVENTS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | EventSeverity>('ALL');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const feedIndexRef = useRef<number>(0);
  const eventCounterRef = useRef<number>(INITIAL_EVENTS.length + 1);

  // Periodic new event injection (when not paused, deterministic circular feed)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const template = SIMULATED_FEED[feedIndexRef.current % SIMULATED_FEED.length];
      feedIndexRef.current = (feedIndexRef.current + 1) % SIMULATED_FEED.length;
      const currentCount = eventCounterRef.current++;
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(
        now.getMilliseconds()
      ).padStart(3, '0')}`;

      const newEvent: ForensicEvent = {
        id: `evt-${String(currentCount).padStart(4, '0')}`,
        timestamp: timeStr,
        severity: template.severity,
        subsystem: template.subsystem,
        message: template.message,
      };

      setEvents((prev) => {
        // Keep maximum 50 events in circular memory
        const next = [...prev, newEvent];
        return next.length > 50 ? next.slice(next.length - 50) : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll to bottom on new event
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, isPaused]);

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    return e.severity === filter;
  });

  const handleClear = () => {
    setEvents([]);
  };

  return (
    <section
      className="ris-panel w-full bg-ris-surface1 border border-ris-line flex flex-col h-[380px] select-none"
      aria-labelledby="event-stream-heading"
    >
      {/* Head Chrome */}
      <div className="ris-panel-head">
        <div className="flex items-center gap-2">
          <IconTerminal size={15} className="text-ris-accent" />
          <h2 id="event-stream-heading" className="font-mono text-xs font-bold text-ris-fg1 tracking-wider uppercase">
            FORENSIC EVENT STREAM // AUDIT TRAIL
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Severity Filters */}
          <div className="flex items-center bg-ris-surface3 p-0.5 border border-ris-line font-mono text-[10px]">
            {(['ALL', 'INFO', 'WARN', 'CRITICAL'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilter(lvl)}
                className={`px-2 py-0.5 uppercase transition-colors duration-instant ${
                  filter === lvl
                    ? 'bg-ris-accent text-ris-fgInvert font-semibold'
                    : 'text-ris-fg3 hover:text-ris-fg1'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="ris-btn ris-btn--ghost ris-btn--sm p-1 min-h-[26px] min-w-[26px]"
            title={isPaused ? 'Resume live event stream' : 'Pause event stream'}
            aria-label={isPaused ? 'Resume stream' : 'Pause stream'}
          >
            {isPaused ? <IconPlay size={13} className="text-ris-green" /> : <IconPause size={13} />}
          </button>

          {/* Clear Buffer Button */}
          <button
            type="button"
            onClick={handleClear}
            className="ris-btn ris-btn--ghost ris-btn--sm p-1 min-h-[26px] min-w-[26px]"
            title="Clear event stream buffer"
            aria-label="Clear buffer"
          >
            <IconTrash size={13} className="text-ris-fg3 hover:text-ris-red" />
          </button>
        </div>
      </div>

      {/* Log Feed Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1.5 bg-ris-void/50 border-b border-ris-line"
      >
        {filteredEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-ris-fg4 font-mono text-xs">
            [EVENT BUFFER EMPTY // NO MATCHING SIGNALS]
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isCrit = evt.severity === 'CRITICAL';
            const isWarn = evt.severity === 'WARN';

            return (
              <div
                key={evt.id}
                className={`flex items-start gap-2.5 px-2 py-1.5 border-l-2 bg-ris-surface2/60 transition-colors ${
                  isCrit
                    ? 'border-ris-red bg-ris-red/5 text-ris-fg1'
                    : isWarn
                    ? 'border-ris-yellow bg-ris-yellow/5 text-ris-fg1'
                    : 'border-ris-cyan/60 text-ris-fg2'
                }`}
              >
                {/* Timestamp */}
                <time className="tabular-nums text-[10px] text-ris-fg4 font-mono select-none pt-0.5 shrink-0">
                  {evt.timestamp}
                </time>

                {/* Severity Badge */}
                <span
                  className={`shrink-0 text-[9px] px-1.5 py-0.2 font-mono font-bold tracking-wider chamfer-sm ${
                    isCrit
                      ? 'bg-ris-red text-ris-fgInvert'
                      : isWarn
                      ? 'bg-ris-yellow text-ris-fgInvert'
                      : 'bg-ris-cyan/20 text-ris-cyan border border-ris-cyan/40'
                  }`}
                >
                  {evt.severity}
                </span>

                {/* Subsystem */}
                <span className="shrink-0 text-[10px] text-ris-accent font-semibold">
                  [{evt.subsystem}]
                </span>

                {/* Message */}
                <span className="flex-1 text-[11px] leading-relaxed break-all">
                  {evt.message}
                </span>

                {/* Source IP (if available) */}
                {evt.sourceIp && (
                  <span className="shrink-0 text-[9px] text-ris-fg4 border border-ris-line px-1 py-0.2">
                    IP: {evt.sourceIp}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-ris-surface2 flex items-center justify-between font-mono text-[10px] text-ris-fg4">
        <span>BUFFER CAPACITY: {filteredEvents.length} / 50 EVENTS</span>
        <span>STREAM STATUS: {isPaused ? '[STREAM PAUSED]' : '[STREAM ACTIVE]'}</span>
      </div>
    </section>
  );
};
