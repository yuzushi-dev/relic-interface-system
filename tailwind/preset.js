/**
 * @file preset.js
 * @package @relic-ui/tailwind
 * @version 2.8.0
 * 
 * Complete Tailwind CSS preset for Relic Interface System (RIS v2).
 * 
 * Usage in tailwind.config.js:
 *   module.exports = {
 *     presets: [require('@relic-ui/tailwind/preset')],
 *     content: ['./src/**\/*.{html,js,ts,jsx,tsx}'],
 *   };
 */

const relicPlugin = require('./index.js');

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: relicPlugin.themeExtension || relicPlugin.theme || {},
  },
  plugins: [
    relicPlugin,
  ],
};
