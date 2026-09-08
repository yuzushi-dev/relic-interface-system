'use client';

import React, { useState } from 'react';
import {
  IconActivity,
  IconCpu,
  IconDatabase,
  IconShield,
  IconTerminal,
  IconRadio,
  IconChevronLeft,
  IconChevronRight,
} from './Icons';

export interface NavItem {
  id: string;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface SidebarProps {
  activeItem?: string;
  onSelectItem?: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'telemetry', label: 'TELEMETRY', icon: IconActivity, badge: 'LIVE' },
  { id: 'buffers', label: 'MEMORY BUFFERS', icon: IconDatabase, badge: '4' },
  { id: 'threat', label: 'THREAT MATRIX', icon: IconShield },
  { id: 'ledger', label: 'INCIDENT LEDGER', icon: IconTerminal, badge: 'NEW' },
  { id: 'radio', label: 'CARRIER CHANNELS', icon: IconRadio },
  { id: 'core', label: 'SYSTEM CORE', icon: IconCpu },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'telemetry',
  onSelectItem,
  collapsed: externalCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const handleToggle = () => {
    const next = !collapsed;
    if (onToggleCollapse) {
      onToggleCollapse(next);
    } else {
      setInternalCollapsed(next);
    }
  };

  const memoryUsed = 12.4;
  const memoryTotal = 16.0;
  const memoryPercent = Math.round((memoryUsed / memoryTotal) * 100);

  return (
    <aside
      className={`hidden md:flex flex-col ris-rail select-none transition-all duration-fast ease-out ${
        collapsed ? 'w-[64px]' : 'w-[230px]'
      }`}
      aria-label="Tactical Navigation Rail"
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-ris-line w-full">
        {!collapsed && (
          <span className="font-mono text-[10px] uppercase text-ris-fg3 tracking-wider font-semibold">
            SEC-NAV // RAIL
          </span>
        )}
        <button
          type="button"
          onClick={handleToggle}
          className="ris-btn ris-btn--ghost ris-btn--sm p-1 min-h-[28px] min-w-[28px] ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
        </button>
      </div>

      {/* Clearance Level Badge */}
      <div className="px-3 py-2 w-full">
        <div
          className={`p-1.5 border border-ris-line bg-ris-surface2 ${
            collapsed ? 'text-center' : ''
          }`}
          title="Security Clearance Level: Top Secret Forensic Inspection"
        >
          {collapsed ? (
            <span className="font-mono font-bold text-xs text-ris-accent">L4</span>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-ris-fg4 tracking-widest">CLEARANCE</span>
                <span className="font-mono text-[10px] font-bold text-ris-accent px-1 bg-ris-surface3">
                  LVL-4
                </span>
              </div>
              <span className="font-mono text-[10px] text-ris-fg2 font-medium">
                FIELD // FORENSIC
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 w-full px-2 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem?.(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 text-left font-mono text-xs transition-colors duration-fast ${
                isActive
                  ? 'bg-ris-surface3 text-ris-fg1 border-l-2 border-ris-accent font-semibold shadow-sm'
                  : 'text-ris-fg3 hover:text-ris-fg1 hover:bg-ris-surface2 border-l-2 border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={`flex items-center justify-center ${
                  isActive ? 'text-ris-accent' : 'text-ris-fg3'
                }`}
              >
                <Icon size={16} />
              </span>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 font-mono font-bold ${
                        item.badge === 'LIVE'
                          ? 'bg-ris-green/20 text-ris-green'
                          : 'bg-ris-surface4 text-ris-fg2'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Hardware Memory Usage Meter */}
      <div className="p-3 border-t border-ris-line w-full bg-ris-surface1">
        {collapsed ? (
          <div
            className="flex flex-col items-center gap-1 cursor-pointer"
            title={`Memory Buffer: ${memoryUsed}GB / ${memoryTotal}GB (${memoryPercent}%)`}
          >
            <IconDatabase size={14} className="text-ris-accent" />
            <span className="font-mono text-[10px] tabular-nums text-ris-fg2">
              {memoryPercent}%
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-ris-fg3 flex items-center gap-1">
                <IconDatabase size={11} className="text-ris-accent" />
                MEM BUFFER
              </span>
              <span className="text-ris-fg1 tabular-nums font-semibold">
                {memoryUsed} / {memoryTotal} GB
              </span>
            </div>

            {/* Segmented Tactical Progress Bar */}
            <div className="w-full h-1.5 bg-ris-surface3 border border-ris-line overflow-hidden relative">
              <div
                className="h-full bg-ris-accent transition-all duration-base"
                style={{ width: `${memoryPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-ris-fg4">
              <span>USAGE: {memoryPercent}%</span>
              <span className="text-ris-green">ALLOC STABLE</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
