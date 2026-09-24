import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { href } from '../lib/util';

export const GET: APIRoute = async ({ site }) => {
  const privacy = await getEntry('pages', 'privacy');
  const urls: [string, Date | undefined][] = [
    [href(), undefined],
    [href('privacy/'), privacy?.data.updated],
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, mod]) => `  <url><loc>${new URL(path, site).href}</loc>${mod ? `<lastmod>${mod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
