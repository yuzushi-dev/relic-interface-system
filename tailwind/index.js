/**
 * @file index.js
 * @package @relic-ui/tailwind
 * @version 2.8.0
 * 
 * Relic Interface System (RIS v2) Tailwind CSS Plugin.
 * Provides custom utilities (chamfers, scanlines, hud-grid, glows)
 * and theme extensions (colors, typography, transitions, easing curves)
 * matching the forensic instrument aesthetic of RIS v2.
 */

let plugin;
try {
  plugin = require('tailwindcss/plugin');
} catch {
  // Graceful fallback for non-Tailwind runner contexts / isolated unit tests
  plugin = function (pluginFn, optionsFn) {
    const fn = (api) => pluginFn(api);
    fn.__pluginConfig = typeof optionsFn === 'function' ? optionsFn({}) : optionsFn;
    return fn;
  };
  plugin.withOptions = (optionsFn) => (opts) => optionsFn(opts);
}

/**
 * RIS v2 Theme Extension Definitions
 */
const themeExtension = {
  colors: {
    // Core surfaces and canvas
    bg: 'var(--ris-bg, #0a0c0e)',
    void: 'var(--ris-void, #060708)',
    surface: {
      DEFAULT: 'var(--ris-surface-1, #0f1316)',
      1: 'var(--ris-surface-1, #0f1316)',
      2: 'var(--ris-surface-2, #141a1e)',
      3: 'var(--ris-surface-3, #1b2228)',
      4: 'var(--ris-surface-4, #232c33)',
    },
    'surface-1': 'var(--ris-surface-1, #0f1316)',
    'surface-2': 'var(--ris-surface-2, #141a1e)',
    'surface-3': 'var(--ris-surface-3, #1b2228)',
    'surface-4': 'var(--ris-surface-4, #232c33)',

    // Structural tactical lines
    line: {
      DEFAULT: 'var(--ris-line, #2a343b)',
      strong: 'var(--ris-line-strong, #3b4750)',
      faint: 'var(--ris-line-faint, #1a2126)',
    },
    'line-strong': 'var(--ris-line-strong, #3b4750)',
    'line-faint': 'var(--ris-line-faint, #1a2126)',
    scanline: 'var(--ris-scanline, rgba(255, 255, 255, 0.025))',

    // Forensics text hierarchy
    fg: {
      DEFAULT: 'var(--ris-fg1, #e6ebe8)',
      1: 'var(--ris-fg1, #e6ebe8)',
      2: 'var(--ris-fg2, #aab4b2)',
      3: 'var(--ris-fg3, #98a3a5)',
      4: 'var(--ris-fg4, #4a555b)',
      invert: 'var(--ris-fg-invert, #07090a)',
    },
    fg1: 'var(--ris-fg1, #e6ebe8)',
    fg2: 'var(--ris-fg2, #aab4b2)',
    fg3: 'var(--ris-fg3, #98a3a5)',
    fg4: 'var(--ris-fg4, #4a555b)',
    'fg-invert': 'var(--ris-fg-invert, #07090a)',
    'on-accent': 'var(--ris-on-accent, #07090a)',

    // Contextual and brand accents
    accent: {
      DEFAULT: 'var(--ris-accent, #e6a23c)',
      dim: 'var(--ris-accent-dim, #8f6425)',
      glow: 'var(--ris-accent-glow, rgba(230, 162, 60, 0.16))',
      line: 'var(--ris-accent-line, rgba(230, 162, 60, 0.45))',
      fill: 'var(--ris-accent-fill, #e6a23c)',
      2: 'var(--ris-accent-2, #6fb3c9)',
      '2-glow': 'var(--ris-accent-2-glow, rgba(111, 179, 201, 0.13))',
      '2-line': 'var(--ris-accent-2-line, rgba(111, 179, 201, 0.45))',
    },
    'accent-dim': 'var(--ris-accent-dim, #8f6425)',
    'accent-glow': 'var(--ris-accent-glow, rgba(230, 162, 60, 0.16))',
    'accent-line': 'var(--ris-accent-line, rgba(230, 162, 60, 0.45))',
    'accent-fill': 'var(--ris-accent-fill, #e6a23c)',
    'accent-2': 'var(--ris-accent-2, #6fb3c9)',
    'accent-2-glow': 'var(--ris-accent-2-glow, rgba(111, 179, 201, 0.13))',
    'accent-2-line': 'var(--ris-accent-2-line, rgba(111, 179, 201, 0.45))',

    // Forensic instrument spectrum
    yellow: {
      DEFAULT: 'var(--ris-yellow, #e6a23c)',
      fill: 'var(--ris-yellow-fill, #e6a23c)',
      dim: 'var(--ris-yellow-dim, #8f6425)',
      glow: 'var(--ris-yellow-glow, rgba(230, 162, 60, 0.16))',
      line: 'var(--ris-yellow-line, rgba(230, 162, 60, 0.45))',
    },
    'yellow-fill': 'var(--ris-yellow-fill, #e6a23c)',
    'yellow-dim': 'var(--ris-yellow-dim, #8f6425)',
    'yellow-glow': 'var(--ris-yellow-glow, rgba(230, 162, 60, 0.16))',
    'yellow-line': 'var(--ris-yellow-line, rgba(230, 162, 60, 0.45))',

    cyan: {
      DEFAULT: 'var(--ris-cyan, #6fb3c9)',
      fill: 'var(--ris-cyan-fill, #6fb3c9)',
      dim: 'var(--ris-cyan-dim, #456f7d)',
      glow: 'var(--ris-cyan-glow, rgba(111, 179, 201, 0.13))',
      line: 'var(--ris-cyan-line, rgba(111, 179, 201, 0.45))',
    },
    'cyan-fill': 'var(--ris-cyan-fill, #6fb3c9)',
    'cyan-dim': 'var(--ris-cyan-dim, #456f7d)',
    'cyan-glow': 'var(--ris-cyan-glow, rgba(111, 179, 201, 0.13))',
    'cyan-line': 'var(--ris-cyan-line, rgba(111, 179, 201, 0.45))',

    red: {
      DEFAULT: 'var(--ris-red, #da6171)',
      fill: 'var(--ris-red-fill, #d45565)',
      dim: 'var(--ris-red-dim, #83353f)',
      glow: 'var(--ris-red-glow, rgba(212, 85, 101, 0.16))',
      line: 'var(--ris-red-line, rgba(212, 85, 101, 0.50))',
    },
    'red-fill': 'var(--ris-red-fill, #d45565)',
    'red-dim': 'var(--ris-red-dim, #83353f)',
    'red-glow': 'var(--ris-red-glow, rgba(212, 85, 101, 0.16))',
    'red-line': 'var(--ris-red-line, rgba(212, 85, 101, 0.50))',

    green: {
      DEFAULT: 'var(--ris-green, #5fae84)',
      fill: 'var(--ris-green-fill, #5fae84)',
      dim: 'var(--ris-green-dim, #3b6c52)',
      glow: 'var(--ris-green-glow, rgba(95, 174, 132, 0.13))',
      line: 'var(--ris-green-line, rgba(95, 174, 132, 0.42))',
    },
    'green-fill': 'var(--ris-green-fill, #5fae84)',
    'green-dim': 'var(--ris-green-dim, #3b6c52)',
    'green-glow': 'var(--ris-green-glow, rgba(95, 174, 132, 0.13))',
    'green-line': 'var(--ris-green-line, rgba(95, 174, 132, 0.42))',

    violet: {
      DEFAULT: 'var(--ris-violet, #938ac8)',
      fill: 'var(--ris-violet-fill, #8479be)',
      dim: 'var(--ris-violet-dim, #524b76)',
      glow: 'var(--ris-violet-glow, rgba(132, 121, 190, 0.14))',
      line: 'var(--ris-violet-line, rgba(132, 121, 190, 0.45))',
    },
    'violet-fill': 'var(--ris-violet-fill, #8479be)',
    'violet-dim': 'var(--ris-violet-dim, #524b76)',
    'violet-glow': 'var(--ris-violet-glow, rgba(132, 121, 190, 0.14))',
    'violet-line': 'var(--ris-violet-line, rgba(132, 121, 190, 0.45))',

    magenta: {
      DEFAULT: 'var(--ris-magenta, #b274c0)',
      fill: 'var(--ris-magenta-fill, #b274c0)',
      dim: 'var(--ris-magenta-dim, #6e4877)',
      glow: 'var(--ris-magenta-glow, rgba(178, 116, 192, 0.14))',
      line: 'var(--ris-magenta-line, rgba(178, 116, 192, 0.45))',
    },
    'magenta-fill': 'var(--ris-magenta-fill, #b274c0)',
    'magenta-dim': 'var(--ris-magenta-dim, #6e4877)',
    'magenta-glow': 'var(--ris-magenta-glow, rgba(178, 116, 192, 0.14))',
    'magenta-line': 'var(--ris-magenta-line, rgba(178, 116, 192, 0.45))',

    orange: {
      DEFAULT: 'var(--ris-orange, #d08a4e)',
      fill: 'var(--ris-orange-fill, #d08a4e)',
      dim: 'var(--ris-orange-dim, #815630)',
      glow: 'var(--ris-orange-glow, rgba(208, 138, 78, 0.14))',
      line: 'var(--ris-orange-line, rgba(208, 138, 78, 0.45))',
    },
    'orange-fill': 'var(--ris-orange-fill, #d08a4e)',
    'orange-dim': 'var(--ris-orange-dim, #815630)',
    'orange-glow': 'var(--ris-orange-glow, rgba(208, 138, 78, 0.14))',
    'orange-line': 'var(--ris-orange-line, rgba(208, 138, 78, 0.45))',

    // Semantic governance & stream roles
    link: 'var(--ris-link, var(--ris-cyan, #6fb3c9))',
    danger: 'var(--ris-danger, var(--ris-red, #da6171))',
    warning: 'var(--ris-warning, var(--ris-yellow, #e6a23c))',
    success: 'var(--ris-success, var(--ris-green, #5fae84))',
    info: 'var(--ris-info, var(--ris-cyan, #6fb3c9))',
    'focus-ring': 'var(--ris-focus-ring, var(--ris-cyan, #6fb3c9))',

    'stream-evidence': 'var(--ris-stream-evidence, #6fb3c9)',
    'stream-inference': 'var(--ris-stream-inference, #938ac8)',
    'stream-pending': 'var(--ris-stream-pending, #e6a23c)',
    'stream-approved': 'var(--ris-stream-approved, #5fae84)',
    'stream-blocked': 'var(--ris-stream-blocked, #da6171)',
    'stream-gumi': 'var(--ris-stream-gumi, #b274c0)',
    'stream-runtime': 'var(--ris-stream-runtime, #456f7d)',
    'stream-correction': 'var(--ris-stream-correction, #d08a4e)',

    // Explicitly namespaced ris.* helper colors
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

  // Font families matching RIS typography: Archivo, JetBrains Mono, Chakra Petch
  fontFamily: {
    sans: ['var(--ris-font-body)', 'Archivo', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['var(--ris-font-mono)', 'JetBrains Mono', 'ui-monospace', "'Courier New'", 'monospace'],
    display: ['var(--ris-font-display)', 'Chakra Petch', 'Archivo', 'system-ui', 'sans-serif'],
  },

  // Micro-feedback transition durations: instant (80ms), fast (140ms), base (200ms), enter (240ms)
  transitionDuration: {
    instant: 'var(--ris-dur-instant, 80ms)',
    fast: 'var(--ris-dur-fast, 140ms)',
    base: 'var(--ris-dur-base, 200ms)',
    enter: 'var(--ris-dur-enter, 240ms)',
    'dur-instant': 'var(--ris-dur-instant, 80ms)',
    'dur-fast': 'var(--ris-dur-fast, 140ms)',
    'dur-base': 'var(--ris-dur-base, 200ms)',
    'dur-enter': 'var(--ris-dur-enter, 240ms)',
  },

  // Easing curves: snap (tactile HUD button snap), out (high-deceleration entrance)
  transitionTimingFunction: {
    snap: 'var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1))',
    'ease-snap': 'var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1))',
    out: 'var(--ris-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
    'ease-out': 'var(--ris-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
  },

  // RIS Spacing grid (4px base)
  spacing: {
    s1: 'var(--ris-s1, 4px)',
    s2: 'var(--ris-s2, 8px)',
    s3: 'var(--ris-s3, 12px)',
    s4: 'var(--ris-s4, 16px)',
    s5: 'var(--ris-s5, 20px)',
    s6: 'var(--ris-s6, 24px)',
    s7: 'var(--ris-s7, 32px)',
    s8: 'var(--ris-s8, 48px)',
    topbar: 'var(--ris-topbar-h, 52px)',
    rail: 'var(--ris-rail-w, 64px)',
    bottomnav: 'var(--ris-bottomnav-h, 60px)',
  },

  // Box shadow elevation and glow tokens
  boxShadow: {
    'elev-1': 'var(--ris-elev-1, 0 0 0 1px var(--ris-line))',
    'elev-2': 'var(--ris-elev-2, 0 0 0 1px var(--ris-line-strong), 0 8px 24px rgba(0, 0, 0, 0.55))',
    'elev-pop': 'var(--ris-elev-pop, 0 0 0 1px var(--ris-line-strong), 0 12px 40px rgba(0, 0, 0, 0.70))',
    'glow-accent': 'var(--ris-glow-accent, 0 0 0 1px var(--ris-accent-line), 0 0 18px var(--ris-accent-glow))',
    'glow-cyan': 'var(--ris-glow-cyan, 0 0 0 1px var(--ris-cyan-line), 0 0 18px var(--ris-cyan-glow))',
    'glow-red': 'var(--ris-glow-red, 0 0 0 1px var(--ris-red-line), 0 0 18px var(--ris-red-glow))',
    'glow-live': 'var(--ris-live, 0 0 0 1px var(--ris-red-line), 0 0 14px var(--ris-red-glow))',
  },

  // Brutalist zero border-radius
  borderRadius: {
    none: '0px',
    ris: '0px',
  },
};

/**
 * Custom RIS Utilities Plugin Handler
 */
function relicPluginHandler({ addUtilities, matchUtilities, theme }) {
  const customUtilities = {
    // 45-degree polygon chamfer cuts (all 4 corners)
    '.chamfer-sm': {
      '--ris-clip': '6px',
      '--chamfer-size': '6px',
      'clip-path': 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
    },
    '.chamfer-md': {
      '--ris-clip': '10px',
      '--chamfer-size': '10px',
      'clip-path': 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
    },
    '.chamfer-lg': {
      '--ris-clip': '16px',
      '--chamfer-size': '16px',
      'clip-path': 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
    },

    // RIS signature 2-corner diagonal notch (top-right and bottom-left)
    '.chamfer-notch': {
      'clip-path': 'polygon(0 0, calc(100% - var(--ris-clip, var(--chamfer-size, 10px))) 0, 100% var(--ris-clip, var(--chamfer-size, 10px)), 100% 100%, var(--ris-clip, var(--chamfer-size, 10px)) 100%, 0 calc(100% - var(--ris-clip, var(--chamfer-size, 10px))))',
    },
    '.chamfer-notch-sm': {
      'clip-path': 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
    },
    '.chamfer-notch-md': {
      'clip-path': 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
    },
    '.chamfer-notch-lg': {
      'clip-path': 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
    },
    '.chamfer-notch-mirror': {
      'clip-path': 'polygon(var(--ris-clip, var(--chamfer-size, 10px)) 0, 100% 0, 100% calc(100% - var(--ris-clip, var(--chamfer-size, 10px))), calc(100% - var(--ris-clip, var(--chamfer-size, 10px))) 100%, 0 100%, 0 var(--ris-clip, var(--chamfer-size, 10px)))',
    },
    '.chamfer-none': {
      'clip-path': 'none',
    },

    // 32px HUD grid background texture
    '.hud-grid': {
      'background-image': 'linear-gradient(var(--ris-line-faint, rgba(255, 255, 255, 0.05)) 1px, transparent 1px), linear-gradient(90deg, var(--ris-line-faint, rgba(255, 255, 255, 0.05)) 1px, transparent 1px)',
      'background-size': '32px 32px',
    },
    '.hud-grid-16': {
      'background-image': 'linear-gradient(var(--ris-line-faint, rgba(255, 255, 255, 0.05)) 1px, transparent 1px), linear-gradient(90deg, var(--ris-line-faint, rgba(255, 255, 255, 0.05)) 1px, transparent 1px)',
      'background-size': '16px 16px',
    },
    '.hud-grid-32': {
      'background-image': 'linear-gradient(var(--ris-line-faint, rgba(255, 255, 255, 0.05)) 1px, transparent 1px), linear-gradient(90deg, var(--ris-line-faint, rgba(255, 255, 255, 0.05)) 1px, transparent 1px)',
      'background-size': '32px 32px',
    },

    // Faint CRT scanline overlay
    '.scanlines': {
      'position': 'relative',
      '&::after': {
        'content': '""',
        'position': 'absolute',
        'inset': '0',
        'pointer-events': 'none',
        'z-index': '2',
        'background': 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, var(--ris-scanline, rgba(255, 255, 255, 0.025)) 2px, var(--ris-scanline, rgba(255, 255, 255, 0.025)) 3px)',
      },
    },

    // Tactical HUD glow utilities
    '.glow-accent': {
      'box-shadow': 'var(--ris-glow-accent, 0 0 0 1px var(--ris-accent-line, rgba(230, 162, 60, 0.45)), 0 0 18px var(--ris-accent-glow, rgba(230, 162, 60, 0.16)))',
    },
    '.glow-red': {
      'box-shadow': 'var(--ris-glow-red, 0 0 0 1px var(--ris-red-line, rgba(212, 85, 101, 0.50)), 0 0 18px var(--ris-red-glow, rgba(212, 85, 101, 0.16)))',
    },
    '.glow-cyan': {
      'box-shadow': 'var(--ris-glow-cyan, 0 0 0 1px var(--ris-cyan-line, rgba(111, 179, 201, 0.45)), 0 0 18px var(--ris-cyan-glow, rgba(111, 179, 201, 0.13)))',
    },
    '.glow-green': {
      'box-shadow': '0 0 0 1px var(--ris-green-line, rgba(95, 174, 132, 0.42)), 0 0 18px var(--ris-green-glow, rgba(95, 174, 132, 0.13))',
    },
    '.glow-yellow': {
      'box-shadow': '0 0 0 1px var(--ris-yellow-line, rgba(230, 162, 60, 0.45)), 0 0 18px var(--ris-yellow-glow, rgba(230, 162, 60, 0.16))',
    },
    '.glow-live': {
      'box-shadow': 'var(--ris-live, 0 0 0 1px var(--ris-red-line, rgba(212, 85, 101, 0.50)), 0 0 14px var(--ris-red-glow, rgba(212, 85, 101, 0.16)))',
    },

    // Shorthand transition durations
    '.dur-instant': {
      'transition-duration': 'var(--ris-dur-instant, 80ms)',
    },
    '.dur-fast': {
      'transition-duration': 'var(--ris-dur-fast, 140ms)',
    },
    '.dur-base': {
      'transition-duration': 'var(--ris-dur-base, 200ms)',
    },
    '.dur-enter': {
      'transition-duration': 'var(--ris-dur-enter, 240ms)',
    },

    // Shorthand easing curves
    '.ease-snap': {
      'transition-timing-function': 'var(--ris-ease-snap, cubic-bezier(0.16, 1, 0.3, 1))',
    },
    '.ease-out': {
      'transition-timing-function': 'var(--ris-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
    },

    // RIS Corner brackets utility
    '.ris-bracket': {
      'position': 'relative',
      '&::before, &::after': {
        'content': '""',
        'position': 'absolute',
        'width': '8px',
        'height': '8px',
        'border-color': 'var(--ris-accent, #e6a23c)',
        'border-style': 'solid',
        'pointer-events': 'none',
        'z-index': '3',
      },
      '&::before': {
        'top': '3px',
        'left': '3px',
        'border-width': '1px 0 0 1px',
      },
      '&::after': {
        'bottom': '3px',
        'right': '3px',
        'border-width': '0 1px 1px 0',
      },
    },
  };

  addUtilities(customUtilities, ['responsive', 'hover']);

  // Dynamic chamfer matching (e.g. chamfer-[14px], chamfer-notch-[12px])
  if (typeof matchUtilities === 'function') {
    matchUtilities(
      {
        chamfer: (value) => ({
          '--ris-clip': value,
          '--chamfer-size': value,
          'clip-path': `polygon(${value} 0, calc(100% - ${value}) 0, 100% ${value}, 100% calc(100% - ${value}), calc(100% - ${value}) 100%, ${value} 100%, 0 calc(100% - ${value}), 0 ${value})`,
        }),
        'chamfer-notch': (value) => ({
          '--ris-clip': value,
          '--chamfer-size': value,
          'clip-path': `polygon(0 0, calc(100% - ${value}) 0, 100% ${value}, 100% 100%, ${value} 100%, 0 calc(100% - ${value}))`,
        }),
      },
      {
        values: (typeof theme === 'function' ? theme('chamfer') : null) || {
          sm: '6px',
          md: '10px',
          lg: '16px',
        },
        modifiers: true,
      }
    );
  }
}

/**
 * Main plugin export
 */
const relicPlugin = plugin(relicPluginHandler, {
  theme: {
    extend: themeExtension,
  },
});

relicPlugin.theme = themeExtension;
relicPlugin.themeExtension = themeExtension;
relicPlugin.handler = relicPluginHandler;

module.exports = relicPlugin;
