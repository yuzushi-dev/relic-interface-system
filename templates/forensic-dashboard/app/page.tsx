'use client';

import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { KpiGrid } from '../components/KpiGrid';
import { TelemetryScrubber } from '../components/TelemetryScrubber';
import { EventLogStream } from '../components/EventLogStream';
import { SystemModal } from '../components/SystemModal';
import { MobileBottomSheet } from '../components/MobileBottomSheet';
import {
  IconActivity,
  IconCpu,
  IconDatabase,
  IconShield,
  IconTerminal,
  IconRadio,
} from '../components/Icons';

export default function ForensicDashboardPage() {
  const [activeNav, setActiveNav] = useState<string>('telemetry');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);
  const [lastOverrideAction, setLastOverrideAction] = useState<string | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleConfirmOverride = (action: string) => {
    setLastOverrideAction(action);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-ris-accent selection:text-ris-fgInvert">
      {/* 1. HUD Top Status Bar */}
      <TopBar
        onOpenModal={() => setIsModalOpen(true)}
        onOpenMobileSheet={() => setIsMobileSheetOpen(true)}
      />

      <div className="flex-1 flex pt-[52px]">
        {/* 2. Desktop Tactical Navigation Rail */}
        <Sidebar
          activeItem={activeNav}
          onSelectItem={setActiveNav}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
        />

        {/* 3. Main Forensics Workspace Container (Zero Reflow) */}
        <main
          id="main-content"
          className={`flex-1 px-3 sm:px-6 py-4 transition-all duration-fast space-y-4 max-w-[1600px] mx-auto w-full ${
            isSidebarCollapsed ? 'md:ml-[64px]' : 'md:ml-[230px]'
          }`}
        >
          {/* Breadcrumb & System Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-ris-line/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ris-accent font-bold">SEC-NODE // 01</span>
              <span className="text-ris-fg4">/</span>
              <span className="text-ris-fg2">TELEMETRY BUS</span>
              <span className="text-ris-fg4">/</span>
              <span className="text-ris-green font-semibold">[CHANNEL SYNCHRONIZED]</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ris-fg3">
              <span className="px-2 py-0.5 bg-ris-surface2 border border-ris-line font-medium">
                SESSION: <strong className="text-ris-fg1">0x9F4C-AA28</strong>
              </span>
              <span className="px-2 py-0.5 bg-ris-surface2 border border-ris-line font-medium">
                POLARITY: <strong className="text-ris-cyan">NOMINAL</strong>
              </span>
            </div>
          </div>

          {/* Tactical Override Success Alert Banner (if triggered) */}
          {lastOverrideAction && (
            <div className="p-3 bg-ris-surface2 border-l-4 border-ris-accent flex items-center justify-between font-mono text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <IconShield size={16} className="text-ris-accent" />
                <span>
                  DIRECTIVE COMMITTED: <strong className="text-ris-accent uppercase">{lastOverrideAction}</strong> — ALL PACKETS RECORDED IN AUDIT LEDGER.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLastOverrideAction(null)}
                className="text-ris-fg4 hover:text-ris-fg1 text-[11px] underline uppercase"
              >
                DISMISS
              </button>
            </div>
          )}

          {/* 4. High-Contrast KPI Cards Grid */}
          <KpiGrid />

          {/* 5. Interactive SVG Telemetry Scrubber Chart */}
          <TelemetryScrubber />

          {/* 6. Dual Split: Event Stream on Left, Diagnostics Panel on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Live Event Stream (7 Cols) */}
            <div className="lg:col-span-7">
              <EventLogStream />
            </div>

            {/* Hardware Status & Quick Command Panel (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="ris-panel bg-ris-surface1 border border-ris-line flex flex-col h-[380px]">
                <div className="ris-panel-head">
                  <div className="flex items-center gap-2">
                    <IconCpu size={15} className="text-ris-accent" />
                    <span className="font-mono text-xs font-bold text-ris-fg1 tracking-wider uppercase">
                      SYSTEM CORE // HARMONICS
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-ris-green">ONLINE</span>
                </div>

                <div className="p-4 space-y-4 font-mono text-xs flex-1 overflow-y-auto">
                  {/* Carrier Frequency Breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-ris-fg3">SUB-CARRIER SYNC</span>
                      <span className="text-ris-cyan font-semibold">99.82%</span>
                    </div>
                    <div className="w-full h-1.5 bg-ris-surface3 border border-ris-line">
                      <div className="h-full bg-ris-cyan" style={{ width: '99.82%' }} />
                    </div>
                  </div>

                  {/* Ring Buffer Density */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-ris-fg3">DMA RING BUFFER 0</span>
                      <span className="text-ris-yellow font-semibold">77.50%</span>
                    </div>
                    <div className="w-full h-1.5 bg-ris-surface3 border border-ris-line">
                      <div className="h-full bg-ris-yellow" style={{ width: '77.5%' }} />
                    </div>
                  </div>

                  {/* Channel Hardware Telemetry Matrix */}
                  <div className="pt-2 border-t border-ris-line/70 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-ris-surface2 border border-ris-line">
                      <span className="text-ris-fg4 text-[9px] block">CARRIER FREQ</span>
                      <span className="font-bold text-ris-fg1">14.288 GHz</span>
                    </div>
                    <div className="p-2 bg-ris-surface2 border border-ris-line">
                      <span className="text-ris-fg4 text-[9px] block">TEMP SENSOR</span>
                      <span className="font-bold text-ris-green">+41.2 °C</span>
                    </div>
                    <div className="p-2 bg-ris-surface2 border border-ris-line">
                      <span className="text-ris-fg4 text-[9px] block">PACKET JITTER</span>
                      <span className="font-bold text-ris-accent">0.12 ms</span>
                    </div>
                    <div className="p-2 bg-ris-surface2 border border-ris-line">
                      <span className="text-ris-fg4 text-[9px] block">ENTROPY POOL</span>
                      <span className="font-bold text-ris-fg1">4096 BITS</span>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="ris-btn ris-btn--primary ris-btn--sm flex-1"
                    >
                      EXECUTE OVERRIDE
                    </button>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="ris-btn ris-btn--ghost ris-btn--sm"
                      title="Reload Telemetry Pipeline"
                    >
                      REFRESH
                    </button>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-ris-surface2 border-t border-ris-line font-mono text-[10px] text-ris-fg4 flex items-center justify-between">
                  <span>ARCHITECTURE: RIS-ARM64</span>
                  <span>BUILD: 2026.09.08-PROD</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 7. Tactical Override Modal Dialog */}
      <SystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmOverride={handleConfirmOverride}
      />

      {/* 8. Mobile Tactical Touch Bottom Sheet (<768px) */}
      <MobileBottomSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        activeItem={activeNav}
        onSelectItem={setActiveNav}
      />
    </div>
  );
}
