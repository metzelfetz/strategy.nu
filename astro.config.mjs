// @ts-check
import { defineConfig } from 'astro/config';

// Staging on GitHub Pages lives under /strategy.nu/. At cutover (s5) `site`
// becomes https://strategy.nu and `base` becomes '/'.
export default defineConfig({
  site: 'https://metzelfetz.github.io',
  base: '/strategy.nu/',
  build: { inlineStylesheets: 'always' },
});
