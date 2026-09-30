// @ts-check
import { defineConfig } from 'astro/config';

// Production is the custom domain on GitHub Pages. `site` drives robots.txt,
// the noindex, the canonical and every absolute URL (see isProduction()).
export default defineConfig({
  site: 'https://strategy.nu',
  base: '/',
  build: { inlineStylesheets: 'always' },
});
