'use client';

import React, { useState, useEffect } from 'react';
import { IconLock, IconSun, IconMoon, IconMenu, IconShield } from './Icons';

export interface TopBarProps {
  onOpenModal?: () => void;
  onOpenMobileSheet?: () => void;
}

export type BrandType = 'relic' | 'biohub' | 'vivokey' | 'neutral';
export type ThemeType = 'dark' | 'light';

export const TopBar: React.FC<TopBarProps> = ({ onOpenModal, onOpenMobileSheet }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [brand, setBrand] = useState<BrandType>('relic');
  const [systemTime, setSystemTime] = useState<string>('2026-09-08 19:34:00 UTC');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Initialize from DOM or defaults
    const currentTheme = (document.documentElement.getAttribute('data-theme') as ThemeType) || 'dark';
    const currentBrand = (document.documentElement.getAttribute('data-brand') as BrandType) || 'relic';
    setTheme(currentTheme);
    setBrand(currentBrand);

    // Live zero-reflow system time ticker
    const interval = setInterval(() => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19);
      setSystemTime(`${iso} UTC`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme: ThemeType = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('ris-theme', nextTheme);
  };

  const handleChangeBrand = (newBrand: BrandType) => {
    setBrand(newBrand);
    document.documentElement.setAttribute('data-brand', newBrand);
    localStorage.setItem('ris-brand', newBrand);
  };

  return (
    <header className="ris-topbar select-none" role="banner">
      {/* Mobile Drawer Trigger (<768px) */}
      <button
        type="button"
        onClick={onOpenMobileSheet}
        className="ris-btn ris-btn--ghost ris-btn--sm md:hidden flex items-center justify-center p-1 min-h-[36px] min-w-[36px]"
        aria-label="Open Mobile Telemetry Drawer"
      >
        <IconMenu size={18} />
      </button>

      {/* Brand Identity / Tactical Logo */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-ris-accent chamfer-sm animate-pulse" />
        <span className="font-display font-bold text-sm tracking-wider text-ris-fg1">
          RELIC <span className="text-ris-accent">FORENSICS</span>
        </span>
        <span className="hidden sm:inline-block font-mono text-[10px] text-ris-fg3 px-1.5 py-0.5 bg-ris-surface2 border border-ris-line rounded-none">
          v2.8.0
        </span>
      </div>

      {/* Hardware / Channel Lock Status Indicator */}
      <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-ris-surface2 border border-ris-line chamfer-sm">
        <span className="inline-block w-2 h-2 rounded-full bg-ris-green animate-pulse" />
        <div className="flex items-center gap-1 font-mono text-xs font-semibold text-ris-green">
          <IconLock size={12} />
          <span>● LOCK</span>
        </div>
        <span className="text-ris-line font-mono">|</span>
        <span className="font-mono text-[11px] text-ris-fg3">AES-256-GCM</span>
        <span className="text-ris-line font-mono">|</span>
        <span className="font-mono text-[11px] text-ris-accent">4ms</span>
      </div>

      {/* System Time Ticker (Zero Reflow Tabular Numbers) */}
      <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 font-mono text-xs text-ris-fg2 border border-ris-line bg-ris-surface1">
        <span className="text-ris-fg4 text-[10px]">SYS.TIME:</span>
        <time className="tabular-nums font-mono text-ris-fg1 font-medium">{systemTime}</time>
      </div>

      <div className="flex-1" />

      {/* Brand Switcher (Relic, Biohub, Vivokey, Neutral) */}
      <div className="hidden sm:flex items-center gap-1 bg-ris-surface2 p-1 border border-ris-line">
        {(['relic', 'biohub', 'vivokey', 'neutral'] as BrandType[]).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => handleChangeBrand(b)}
            className={`font-mono text-[11px] px-2 py-0.5 uppercase transition-colors duration-fast ${
              brand === b
                ? 'bg-ris-accent text-ris-fgInvert font-semibold shadow-sm'
                : 'text-ris-fg3 hover:text-ris-fg1 hover:bg-ris-surface3'
            }`}
            title={`Set brand accent to ${b}`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Theme Toggle (Dark HUD / Light Drafting) */}
      <button
        type="button"
        onClick={handleToggleTheme}
        className="ris-btn ris-btn--ghost ris-btn--sm flex items-center gap-1.5 min-h-[32px] px-2.5"
        title={`Switch to ${theme === 'dark' ? 'Light drafting' : 'Dark HUD'} theme`}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <>
            <IconSun size={14} className="text-ris-yellow" />
            <span className="hidden md:inline font-mono text-[11px]">LIGHT</span>
          </>
        ) : (
          <>
            <IconMoon size={14} className="text-ris-cyan" />
            <span className="hidden md:inline font-mono text-[11px]">DARK</span>
          </>
        )}
      </button>

      {/* Tactical Override Trigger Button */}
      <button
        type="button"
        onClick={onOpenModal}
        className="ris-btn ris-btn--primary ris-btn--sm flex items-center gap-1.5"
      >
        <IconShield size={14} />
        <span className="hidden sm:inline">OVERRIDE</span>
      </button>
    </header>
  );
};
