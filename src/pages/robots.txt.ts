import type { APIRoute } from 'astro';
import { href, isProduction } from '../lib/util';

// Staging (github.io) is closed to crawlers; production opens up automatically
// once `site` in astro.config.mjs is https://strategy.nu.
export const GET: APIRoute = ({ site }) => {
  const rules = isProduction(site) ? 'Allow: /' : 'Disallow: /';
  return new Response(`User-agent: *\n${rules}\n\nSitemap: ${new URL(href('sitemap.xml'), site).href}\n`);
};
