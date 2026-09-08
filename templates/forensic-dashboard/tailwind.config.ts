import type { Config } from 'tailwindcss';

let relicPreset: unknown;
try {
  // Try loading installed package preset
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  relicPreset = require('@relic-ui/tailwind/preset');
} catch {
  try {
    // Fallback to local workspace relative path
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    relicPreset = require('../../tailwind/preset.js');
  } catch {
    relicPreset = null;
  }
}

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  presets: relicPreset ? [relicPreset as Config] : [],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ris: {
          bg: 'var(--ris-bg, #0a0c0e)',
          void: 'var(--ris-void, #060708)',
          surface1: 'var(--ris-surface-1, #0f1316)',
          surface2: 'var(--ris-surface-2, #141a1e)',
          surface3: 'var(--ris-surface-3, #1b2228)',
          surface4: 'var(--ris-surface-4, #232c33)',
          line: 'var(--ris-line, #2a343b)',
          lineStrong: 'var(--ris-line-strong, #3b4750)',
          lineFaint: 'var(--ris-line-faint, #1a2126)',
          fg1: 'var(--ris-fg1, #e6ebe8)',
          fg2: 'var(--ris-fg2, #aab4b2)',
          fg3: 'var(--ris-fg3, #98a3a5)',
          fg4: 'var(--ris-fg4, #4a555b)',
          fgInvert: 'var(--ris-fg-invert, #07090a)',
          onAccent: 'var(--ris-on-accent, #07090a)',
          accent: 'var(--ris-accent, #e6a23c)',
          accentDim: 'var(--ris-accent-dim, #8f6425)',
          accentGlow: 'var(--ris-accent-glow, rgba(230, 162, 60, 0.16))',
          accentLine: 'var(--ris-accent-line, rgba(230, 162, 60, 0.45))',
          accentFill: 'var(--ris-accent-fill, #e6a23c)',
          accent2: 'var(--ris-accent-2, #6fb3c9)',
          yellow: 'var(--ris-yellow, #e6a23c)',
          cyan: 'var(--ris-cyan, #6fb3c9)',
          red: 'var(--ris-red, #da6171)',
          green: 'var(--ris-green, #5fae84)',
          violet: 'var(--ris-violet, #938ac8)',
          magenta: 'var(--ris-magenta, #b274c0)',
          orange: 'var(--ris-orange, #d08a4e)',
          scanline: 'var(--ris-scanline, rgba(255, 255, 255, 0.025))',
        },
      },
      fontFamily: {
        sans: ['var(--ris-font-body)', 'Archivo', 'system-ui', 'sans-serif'],
        mono: ['var(--ris-font-mono)', 'JetBrains Mono', 'monospace'],
        display: ['var(--ris-font-display)', 'Chakra Petch', 'Archivo', 'sans-serif'],
      },
      transitionDuration: {
        instant: 'var(--ris-dur-instant, 80ms)',
        fast: 'var(--ris-dur-fast, 140ms)',
        base: 'var(--ris-dur-base, 200ms)',
        enter: 'var(--ris-dur-enter, 240ms)',
      },
      transitionTimingFunction: {
        snap: 'var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1))',
        out: 'var(--ris-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
      },
      boxShadow: {
        'glow-accent': 'var(--ris-glow-accent, 0 0 0 1px var(--ris-accent-line), 0 0 18px var(--ris-accent-glow))',
        'glow-cyan': 'var(--ris-glow-cyan, 0 0 0 1px var(--ris-cyan-line), 0 0 18px var(--ris-cyan-glow))',
        'glow-red': 'var(--ris-glow-red, 0 0 0 1px var(--ris-red-line), 0 0 18px var(--ris-red-glow))',
        'glow-live': 'var(--ris-live, 0 0 0 1px var(--ris-red-line), 0 0 14px var(--ris-red-glow))',
      },
    },
  },
  plugins: [],
};

export default config;
