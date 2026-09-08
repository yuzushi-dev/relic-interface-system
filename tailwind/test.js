/**
 * @file test.js
 * Verification suite for @relic-ui/tailwind
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('--- Testing @relic-ui/tailwind ---');

// 1. Verify package.json
const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
assert.strictEqual(pkg.name, '@relic-ui/tailwind', 'Package name must match');
assert.strictEqual(pkg.version, '2.8.0', 'Package version must be 2.8.0');
assert.strictEqual(pkg.main, 'index.js', 'Package main must be index.js');
console.log('✓ package.json verified');

// 2. Verify plugin export
const relicPlugin = require('./index.js');
assert.ok(typeof relicPlugin === 'function' || typeof relicPlugin.handler === 'function', 'Plugin must export a function or object with handler');
console.log('✓ index.js loaded');

// 3. Verify theme extensions
const theme = relicPlugin.themeExtension || relicPlugin.theme;
assert.ok(theme, 'Theme extension must exist');
assert.ok(theme.colors.bg, 'Colors.bg must exist');
assert.ok(theme.colors.surface, 'Colors.surface must exist');
assert.ok(theme.colors.line, 'Colors.line must exist');
assert.ok(theme.colors.accent, 'Colors.accent must exist');
assert.ok(theme.colors.yellow, 'Colors.yellow must exist');
assert.ok(theme.colors.cyan, 'Colors.cyan must exist');
assert.ok(theme.colors.red, 'Colors.red must exist');
assert.ok(theme.colors.green, 'Colors.green must exist');
assert.ok(theme.colors.violet, 'Colors.violet must exist');
assert.ok(theme.colors.magenta, 'Colors.magenta must exist');
assert.ok(theme.colors.orange, 'Colors.orange must exist');
console.log('✓ Theme colors verified');

// Fonts
assert.ok(theme.fontFamily.sans.includes('Archivo'), 'fontFamily.sans must include Archivo');
assert.ok(theme.fontFamily.mono.includes('JetBrains Mono'), 'fontFamily.mono must include JetBrains Mono');
assert.ok(theme.fontFamily.display.includes('Chakra Petch'), 'fontFamily.display must include Chakra Petch');
console.log('✓ Theme fonts verified');

// Transition durations
assert.ok(theme.transitionDuration.instant.includes('80ms') || theme.transitionDuration['dur-instant'].includes('80ms'), 'instant must be 80ms');
assert.ok(theme.transitionDuration.fast.includes('140ms') || theme.transitionDuration['dur-fast'].includes('140ms'), 'fast must be 140ms');
assert.ok(theme.transitionDuration.base.includes('200ms') || theme.transitionDuration['dur-base'].includes('200ms'), 'base must be 200ms');
assert.ok(theme.transitionDuration.enter.includes('240ms') || theme.transitionDuration['dur-enter'].includes('240ms'), 'enter must be 240ms');
console.log('✓ Transition durations verified');

// Easing curves
assert.ok(theme.transitionTimingFunction.snap.includes('0.16, 1, 0.3, 1'), 'ease-snap must be cubic-bezier(0.16, 1, 0.3, 1)');
assert.ok(theme.transitionTimingFunction.out.includes('0.22, 1, 0.36, 1'), 'ease-out must be cubic-bezier(0.22, 1, 0.36, 1)');
console.log('✓ Transition curves verified');

// 4. Verify custom utilities handler
let registeredUtilities = {};
let registeredMatched = {};

const mockApi = {
  addUtilities: (utils) => {
    registeredUtilities = Object.assign(registeredUtilities, utils);
  },
  matchUtilities: (matchers) => {
    registeredMatched = Object.assign(registeredMatched, matchers);
  },
  theme: (key) => null,
};

relicPlugin.handler(mockApi);

const requiredUtilities = [
  '.chamfer-sm',
  '.chamfer-md',
  '.chamfer-lg',
  '.chamfer-notch',
  '.hud-grid',
  '.scanlines',
  '.glow-accent',
  '.glow-red',
  '.glow-cyan',
];

for (const util of requiredUtilities) {
  assert.ok(registeredUtilities[util], `Utility ${util} must be registered`);
}

// Detailed checks on custom utilities
assert.ok(registeredUtilities['.chamfer-sm']['clip-path'].includes('polygon(6px 0'), '.chamfer-sm must have 6px polygon clip-path');
assert.ok(registeredUtilities['.chamfer-md']['clip-path'].includes('polygon(10px 0'), '.chamfer-md must have 10px polygon clip-path');
assert.ok(registeredUtilities['.chamfer-lg']['clip-path'].includes('polygon(16px 0'), '.chamfer-lg must have 16px polygon clip-path');
assert.ok(registeredUtilities['.chamfer-notch']['clip-path'].includes('polygon(0 0'), '.chamfer-notch must have notch clip-path');
assert.strictEqual(registeredUtilities['.hud-grid']['background-size'], '32px 32px', '.hud-grid must have 32px background size');
assert.ok(registeredUtilities['.scanlines']['&::after'], '.scanlines must have &::after pseudo-element');
assert.ok(registeredUtilities['.glow-accent']['box-shadow'].includes('--ris-glow-accent'), '.glow-accent must map to --ris-glow-accent');
assert.ok(registeredUtilities['.glow-red']['box-shadow'].includes('--ris-glow-red'), '.glow-red must map to --ris-glow-red');
assert.ok(registeredUtilities['.glow-cyan']['box-shadow'].includes('--ris-glow-cyan'), '.glow-cyan must map to --ris-glow-cyan');
console.log('✓ All custom utilities verified');

// 5. Verify preset.js
const preset = require('./preset.js');
assert.ok(preset.theme && preset.theme.extend, 'Preset must provide theme.extend');
assert.ok(Array.isArray(preset.plugins) && preset.plugins.length > 0, 'Preset must include plugins');
console.log('✓ preset.js verified');

console.log('\nAll tests passed successfully!');
