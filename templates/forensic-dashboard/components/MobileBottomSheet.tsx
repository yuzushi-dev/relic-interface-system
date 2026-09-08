'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  IconX,
  IconActivity,
  IconDatabase,
  IconShield,
  IconTerminal,
  IconRadio,
  IconCpu,
} from './Icons';

export interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onSelectItem?: (id: string) => void;
}

const MOBILE_NAV_ITEMS = [
  { id: 'telemetry', label: 'TELEMETRY STREAM', icon: IconActivity, badge: 'LIVE' },
  { id: 'buffers', label: 'RING BUFFER DIAGNOSTICS', icon: IconDatabase, badge: '4' },
  { id: 'threat', label: 'THREAT VECTOR MATRIX', icon: IconShield },
  { id: 'ledger', label: 'FORENSIC INCIDENT LEDGER', icon: IconTerminal, badge: 'NEW' },
  { id: 'radio', label: 'CARRIER HARMONICS', icon: IconRadio },
  { id: 'core', label: 'KERNEL CORE DIAGNOSTICS', icon: IconCpu },
];

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  activeItem = 'telemetry',
  onSelectItem,
}) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [currentTranslateY, setCurrentTranslateY] = useState<number>(0);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Touch gesture drag-down handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 0) {
      setCurrentTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslateY > 100) {
      onClose();
    }
    setTouchStartY(null);
    setCurrentTranslateY(0);
  };

  return (
    <div
      className="ris-sheet-backdrop md:hidden select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={sheetRef}
        className="ris-sheet bg-ris-surface2 border-t-2 border-ris-lineStrong text-ris-fg1"
        style={{
          transform: currentTranslateY > 0 ? `translateY(${currentTranslateY}px)` : undefined,
          transition: touchStartY === null ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sheet-title"
      >
        {/* Swipe Handle Indicator (min 44px touch target) */}
        <div className="py-2 flex justify-center cursor-grab" aria-hidden="true">
          <div className="ris-sheet-handle" />
        </div>

        {/* Sheet Head */}
        <div className="ris-sheet-head flex items-center justify-between px-4 pb-2 border-b border-ris-line">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ris-accent animate-pulse" />
            <h2 id="mobile-sheet-title" className="font-mono text-xs font-bold uppercase tracking-wider text-ris-fg1">
              TACTICAL FIELD OPERATOR // DRAWER
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ris-btn ris-btn--ghost ris-btn--sm p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close drawer"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Clearance status pill */}
        <div className="px-4 py-2 bg-ris-surface1 border-b border-ris-line flex items-center justify-between font-mono text-[11px]">
          <span className="text-ris-fg3">OPERATOR CLEARANCE:</span>
          <span className="text-ris-accent font-bold px-1.5 py-0.5 bg-ris-surface3 border border-ris-line">
            LVL-4 FORENSIC
          </span>
        </div>

        {/* Navigation List (Touch targets ≥44px compliant with WCAG 2.5.8 & RIS mobile specs) */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[55vh]">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectItem?.(item.id);
                  onClose();
                }}
                className={`w-full min-h-[48px] flex items-center justify-between px-3 py-2 font-mono text-xs text-left border transition-colors duration-fast ${
                  isActive
                    ? 'bg-ris-surface3 border-ris-accent text-ris-fg1 font-semibold'
                    : 'bg-ris-surface1 border-ris-line text-ris-fg2 hover:border-ris-lineStrong active:bg-ris-surface3'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-ris-accent' : 'text-ris-fg3'}>
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-mono font-bold ${
                      item.badge === 'LIVE'
                        ? 'bg-ris-green/20 text-ris-green'
                        : 'bg-ris-surface4 text-ris-fg2'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Safe-area bottom padding indicator */}
        <div className="px-4 py-2 border-t border-ris-line bg-ris-surface1 text-center font-mono text-[10px] text-ris-fg4">
          SWIPE DOWN OR TAP OUTSIDE TO DISMISS
        </div>
      </div>
    </div>
  );
};
