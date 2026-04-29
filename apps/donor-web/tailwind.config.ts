import type { Config } from 'tailwindcss';
import sharedConfig from '../../tailwind.config.shared.js';

const config: Config = {
  presets: [sharedConfig],
  content: ['./app/**/*.{tsx,ts}', './components/**/*.{tsx,ts}', '../../packages/ui/src/**/*.{tsx,ts}'],
  plugins: [],
};
export default config;
