import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { lastCommitDate } from '../lib/lastmod';
import { href } from '../lib/util';

export const GET: APIRoute = async ({ site }) => {
  const privacy = await getEntry('pages', 'privacy');
  // The home page is everything under src/ except the files of the other pages.
  const home = lastCommitDate('src', ':!src/content/pages', ':!src/pages/privacy.astro', ':!src/pages/404.astro');
  const urls: [string, string | undefined][] = [
    [href(), home],
    [href('privacy/'), privacy?.data.updated.toISOString().slice(0, 10)],
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, mod]) => `  <url><loc>${new URL(path, site).href}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
