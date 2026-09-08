import type { Config, PluginCreator } from 'tailwindcss/types/config';

interface RelicTailwindPlugin extends PluginCreator {
  theme: Config['theme'];
  themeExtension: Config['theme'];
  handler: PluginCreator;
}

declare const relicPlugin: RelicTailwindPlugin;
export default relicPlugin;
export { relicPlugin };
