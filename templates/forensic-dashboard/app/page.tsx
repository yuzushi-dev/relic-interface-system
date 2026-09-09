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

        {/* 3. Main Forensics Workspace Container (Zero Layout Reflow - Instant Mechanical Snap) */}
        <main
          id="main-content"
          className={`flex-1 px-3 sm:px-6 py-4 space-y-4 max-w-[1600px] mx-auto w-full ${
            isSidebarCollapsed ? 'md:ml-[64px]' : 'md:ml-[230px]'
          }`}
        >
          {/* Breadcrumb & System Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-ris-line/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ris-accent font-bold">SEC-NODE // 01</span>
              <span className="text-ris-fg3">/</span>
              <span className="text-ris-fg2 uppercase">{activeNav}</span>
              <span className="text-ris-fg3">/</span>
              <span className="text-ris-green font-semibold">[CHANNEL SYNCHRONIZED]</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ris-fg3">
              <span className="px-2 py-0.5 bg-ris-surface2 border border-ris-line font-medium">
                BUFFER: <strong className="text-ris-fg1">RING-0 // SEC-BUS</strong>
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
                className="text-ris-fg3 hover:text-ris-fg1 text-[11px] underline uppercase"
              >
                DISMISS
              </button>
            </div>
          )}

          {/* VIEW SWITCHER BASED ON SIDEBAR NAVIGATION */}
          {activeNav === 'telemetry' && (
            <>
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
                          <span className="text-ris-fg3 text-[9px] block">CARRIER FREQ</span>
                          <span className="font-bold text-ris-fg1">14.288 GHz</span>
                        </div>
                        <div className="p-2 bg-ris-surface2 border border-ris-line">
                          <span className="text-ris-fg3 text-[9px] block">TEMP SENSOR</span>
                          <span className="font-bold text-ris-green">+41.2 °C</span>
                        </div>
                        <div className="p-2 bg-ris-surface2 border border-ris-line">
                          <span className="text-ris-fg3 text-[9px] block">PACKET JITTER</span>
                          <span className="font-bold text-ris-accent">0.12 ms</span>
                        </div>
                        <div className="p-2 bg-ris-surface2 border border-ris-line">
                          <span className="text-ris-fg3 text-[9px] block">ENTROPY POOL</span>
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

                    <div className="px-3 py-1.5 bg-ris-surface2 border-t border-ris-line font-mono text-[10px] text-ris-fg3 flex items-center justify-between">
                      <span>ARCHITECTURE: RIS-ARM64</span>
                      <span>BUILD: 2026.09.08-PROD</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. Buffers / Ring Buffer Diagnostics View */}
          {activeNav === 'buffers' && (
            <div className="space-y-4">
              <div className="p-4 bg-ris-surface1 border border-ris-line">
                <div className="flex items-center justify-between mb-3 border-b border-ris-line pb-2">
                  <div className="flex items-center gap-2">
                    <IconDatabase size={16} className="text-ris-accent" />
                    <h2 className="font-mono text-sm font-bold text-ris-fg1 tracking-wider uppercase">
                      DMA RING BUFFER POOLS // MEMORY SUBSYSTEM
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-ris-green font-semibold">
                    HEALTH: 99.98% // 4 POOLS MOUNTED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs mb-4">
                  {[
                    { name: 'RING_BUFFER_0 (KERNEL DMA)', size: '4,096 MB', util: '64.2%', pages: '1,048,576', state: 'NOMINAL', color: 'text-ris-green' },
                    { name: 'RING_BUFFER_1 (NETWORK RX)', size: '2,048 MB', util: '81.5%', pages: '524,288', state: 'ELEVATED', color: 'text-ris-yellow' },
                    { name: 'RING_BUFFER_2 (CRYPTO PIPE)', size: '1,024 MB', util: '32.0%', pages: '262,144', state: 'OPTIMAL', color: 'text-ris-cyan' },
                    { name: 'RING_BUFFER_3 (CRASH DUMP)', size: '512 MB', util: '4.8%', pages: '131,072', state: 'STANDBY', color: 'text-ris-fg3' },
                  ].map((buf) => (
                    <div key={buf.name} className="p-3 bg-ris-surface2 border border-ris-line space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-ris-fg1 text-[11px] truncate">{buf.name}</span>
                        <span className={`text-[10px] font-bold ${buf.color}`}>{buf.state}</span>
                      </div>
                      <div className="text-[11px] text-ris-fg3 space-y-1">
                        <div>CAPACITY: <strong className="text-ris-fg2">{buf.size}</strong></div>
                        <div>ALLOCATION: <strong className="text-ris-accent">{buf.util}</strong></div>
                        <div>PAGE FRAMES: <strong className="text-ris-fg2">{buf.pages}</strong></div>
                      </div>
                      <div className="w-full h-1.5 bg-ris-surface4 overflow-hidden">
                        <div
                          className="h-full bg-ris-accent"
                          style={{ width: buf.util }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hex Memory Inspector */}
                <div className="bg-ris-surface2 border border-ris-line p-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-ris-fg3 border-b border-ris-line pb-1.5 mb-2 text-[11px]">
                    <span className="font-bold text-ris-fg2">HEX DISK BUFFER INSPECTOR // ADDR 0x7FFF_E490</span>
                    <span className="text-ris-cyan">PAGE OFFSET: +0x0400</span>
                  </div>
                  <pre className="text-ris-fg2 text-[11px] leading-relaxed overflow-x-auto select-all">
                    {`0x7FFF_E490: 48 89 E5 48 83 EC 20 48  89 7D E8 48 89 75 F0 48  |H..H.. H.}..u.H|
0x7FFF_E4A0: 8B 45 E8 48 8B 00 48 89  C7 E8 00 00 00 00 48 8B  |.E.H..H. .....H.|
0x7FFF_E4B0: 45 F0 48 8B 40 08 48 89  C6 48 8B 45 E8 48 8B 38  |E.H.@.H. .H.E.H.8|
0x7FFF_E4C0: E8 00 00 00 00 90 C9 C3  55 48 89 E5 53 48 83 EC  |........ UH..SH..|`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 3. Threat Matrix View */}
          {activeNav === 'threat' && (
            <div className="space-y-4">
              <div className="p-4 bg-ris-surface1 border border-ris-line">
                <div className="flex items-center justify-between mb-3 border-b border-ris-line pb-2">
                  <div className="flex items-center gap-2">
                    <IconShield size={16} className="text-ris-red" />
                    <h2 className="font-mono text-sm font-bold text-ris-fg1 tracking-wider uppercase">
                      THREAT MATRIX // ANOMALY VECTOR RADAR
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-ris-green font-semibold">
                    DEFCON: LEVEL 4 // DEFENSIVE SHIELD ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs mb-4">
                  <div className="p-3 bg-ris-surface2 border border-ris-line space-y-1">
                    <span className="text-ris-fg3 text-[10px]">INGRESS PACKET RATE</span>
                    <div className="text-lg font-bold text-ris-fg1">1,482 <span className="text-xs text-ris-fg3">pkts/s</span></div>
                    <div className="text-ris-green text-[10px]">0 DROPPED (0.00%)</div>
                  </div>
                  <div className="p-3 bg-ris-surface2 border border-ris-line space-y-1">
                    <span className="text-ris-fg3 text-[10px]">INTRUSION DETECTION SCORE</span>
                    <div className="text-lg font-bold text-ris-green">0.02 <span className="text-xs text-ris-fg3">/ 1.00</span></div>
                    <div className="text-ris-cyan text-[10px]">ZERO SIGNATURE MATCHES</div>
                  </div>
                  <div className="p-3 bg-ris-surface2 border border-ris-line space-y-1">
                    <span className="text-ris-fg3 text-[10px]">CRYPTO ENCLAVE ATTESTATION</span>
                    <div className="text-lg font-bold text-ris-cyan">VALID <span className="text-xs text-ris-fg3">TPM 2.0</span></div>
                    <div className="text-ris-green text-[10px]">CHAIN OF TRUST VERIFIED</div>
                  </div>
                </div>

                <div className="p-3 bg-ris-surface2 border border-ris-line font-mono text-xs space-y-2">
                  <div className="font-bold text-ris-fg2 border-b border-ris-line pb-1">ISOLATION RULES & ACTIVE INTERCEPTORS</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between p-2 bg-ris-surface1 border border-ris-line">
                      <span className="text-ris-fg3">AIRGAP BRIDGE FIREWALL:</span>
                      <strong className="text-ris-green">ENFORCED (DROP ALL)</strong>
                    </div>
                    <div className="flex justify-between p-2 bg-ris-surface1 border border-ris-line">
                      <span className="text-ris-fg3">EPHEMERAL KEY EXCHANGE:</span>
                      <strong className="text-ris-cyan">X25519-CHACHA20</strong>
                    </div>
                    <div className="flex justify-between p-2 bg-ris-surface1 border border-ris-line">
                      <span className="text-ris-fg3">DMA BUFFER GUARDS:</span>
                      <strong className="text-ris-green">ENABLED (IOMMU)</strong>
                    </div>
                    <div className="flex justify-between p-2 bg-ris-surface1 border border-ris-line">
                      <span className="text-ris-fg3">SIGNATURE PROBING:</span>
                      <strong className="text-ris-yellow">MONITORING (PASSIVE)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Incident Ledger View */}
          {(activeNav === 'forensics' || activeNav === 'ledger') && (
            <div className="space-y-4">
              <div className="p-4 bg-ris-surface1 border border-ris-line">
                <div className="flex items-center justify-between mb-3 border-b border-ris-line pb-2">
                  <div className="flex items-center gap-2">
                    <IconTerminal size={16} className="text-ris-accent" />
                    <h2 className="font-mono text-sm font-bold text-ris-fg1 tracking-wider uppercase">
                      INCIDENT AUDIT LEDGER // CRYPTOGRAPHIC TRAIL
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-ris-green font-semibold">
                    SYNCED // BLOCK #48,192
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="ris-table w-full text-xs font-mono">
                    <thead>
                      <tr>
                        <th>INCIDENT ID</th>
                        <th>TIMESTAMP</th>
                        <th>SEVERITY</th>
                        <th>SUBSYSTEM</th>
                        <th>CHECKSUM</th>
                        <th className="num">LATENCY</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-bold text-ris-fg1">INC-2026-081</td>
                        <td className="text-ris-fg3">2026-09-08 22:14:02 UTC</td>
                        <td><span className="text-ris-green font-bold">[RESOLVED]</span></td>
                        <td>DMA Ring Buffer</td>
                        <td className="text-ris-cyan">0x7F18..D412</td>
                        <td className="num text-ris-fg2 font-bold">1.2 ms</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-ris-fg1">INC-2026-080</td>
                        <td className="text-ris-fg3">2026-09-08 21:58:45 UTC</td>
                        <td><span className="text-ris-yellow font-bold">[ELEVATED]</span></td>
                        <td>RF Transceiver #02</td>
                        <td className="text-ris-cyan">0x3E8B..9901</td>
                        <td className="num text-ris-fg2 font-bold">3.8 ms</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-ris-fg1">INC-2026-079</td>
                        <td className="text-ris-fg3">2026-09-08 20:30:11 UTC</td>
                        <td><span className="text-ris-green font-bold">[RESOLVED]</span></td>
                        <td>Carrier Lock Sync</td>
                        <td className="text-ris-cyan">0xAA45..C109</td>
                        <td className="num text-ris-fg2 font-bold">0.8 ms</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-ris-fg1">INC-2026-078</td>
                        <td className="text-ris-fg3">2026-09-08 19:12:05 UTC</td>
                        <td><span className="text-ris-green font-bold">[RESOLVED]</span></td>
                        <td>ECC Memory Check</td>
                        <td className="text-ris-cyan">0x55C1..4420</td>
                        <td className="num text-ris-fg2 font-bold">0.4 ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. Carrier Channels & RF Spectrum View */}
          {(activeNav === 'radio' || activeNav === 'nodes' || activeNav === 'transceiver') && (
            <div className="space-y-4">
              <div className="p-4 bg-ris-surface1 border border-ris-line">
                <div className="flex items-center justify-between mb-3 border-b border-ris-line pb-2">
                  <div className="flex items-center gap-2">
                    <IconRadio size={16} className="text-ris-cyan" />
                    <h2 className="font-mono text-sm font-bold text-ris-fg1 tracking-wider uppercase">
                      NODE TOPOLOGY // RF SPECTRUM CARRIER
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-ris-accent font-semibold">
                    ACTIVE NODES: 8/8
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  {['NODE-01 (PRIMARY)', 'NODE-02 (CARRIER)', 'NODE-03 (RECEIVER)', 'NODE-04 (CRYPTO)'].map((node, i) => (
                    <div key={node} className="p-3 bg-ris-surface2 border border-ris-line flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-ris-fg1">{node}</span>
                        <span className="text-ris-green text-[10px]">ACTIVE</span>
                      </div>
                      <div className="text-[11px] text-ris-fg3 space-y-1">
                        <div>FREQUENCY: <strong className="text-ris-fg2">{14.2 + i * 0.1} GHz</strong></div>
                        <div>LOAD: <strong className="text-ris-accent">{35 + i * 8}%</strong></div>
                        <div>JITTER: <strong className="text-ris-cyan">{0.1 + i * 0.02} ms</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. System Core Architecture View */}
          {(activeNav === 'core' || activeNav === 'security') && (
            <div className="space-y-4">
              <div className="p-4 bg-ris-surface1 border border-ris-line">
                <div className="flex items-center justify-between mb-3 border-b border-ris-line pb-2">
                  <div className="flex items-center gap-2">
                    <IconCpu size={16} className="text-ris-accent" />
                    <h2 className="font-mono text-sm font-bold text-ris-fg1 tracking-wider uppercase">
                      SYSTEM CORE // KERNEL THREAD TOPOLOGY
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-ris-green font-semibold">
                    STATUS: SECURE // AIRGAP LOCKED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs mb-4">
                  {[
                    { core: 'CORE 0 (ISOLATED)', freq: '4.20 GHz', load: '18%', temp: '42°C', gov: 'performance' },
                    { core: 'CORE 1 (REALTIME)', freq: '4.20 GHz', load: '44%', temp: '46°C', gov: 'performance' },
                    { core: 'CORE 2 (IO_WAIT)', freq: '3.80 GHz', load: '12%', temp: '39°C', gov: 'schedutil' },
                    { core: 'CORE 3 (SECURITY)', freq: '4.20 GHz', load: '08%', temp: '38°C', gov: 'performance' },
                  ].map((c) => (
                    <div key={c.core} className="p-3 bg-ris-surface2 border border-ris-line space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-ris-fg1">{c.core}</span>
                        <span className="text-ris-cyan">{c.temp}</span>
                      </div>
                      <div className="text-base font-bold text-ris-fg1">{c.freq}</div>
                      <div className="flex justify-between text-[10px] text-ris-fg3">
                        <span>LOAD: <strong className="text-ris-accent">{c.load}</strong></span>
                        <span>GOV: <strong className="text-ris-fg2">{c.gov}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-ris-surface2 border border-ris-line font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span>HARDWARE ENCLAVE ENCRYPTION:</span>
                    <strong className="text-ris-green">CHACHA20-POLY1305 (256-BIT)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ZERO-KNOWLEDGE AUTH BUS:</span>
                    <strong className="text-ris-cyan">ACTIVE // VERIFIED</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DEFCON SECURITY LEVEL:</span>
                    <strong className="text-ris-accent">DEFCON 4 (NORMAL READINESS)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
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
