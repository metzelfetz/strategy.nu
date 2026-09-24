import type { ImageMetadata } from 'astro';

/** Prefixes a site path with the configured base, e.g. `href('#team')`. */
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}

export function mailto(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/** Link text derived from a URL: "LinkedIn" for profiles, else the bare host and path. */
export function linkLabel(url: string): string {
  const bare = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return bare.startsWith('linkedin.com') ? 'LinkedIn' : bare;
}

const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
export const roman = (n: number): string => ROMAN[n] ?? String(n);

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*', { eager: true });
export function photo(file: string): ImageMetadata {
  const hit = photos[`../assets/photos/${file}`];
  if (!hit) throw new Error(`Missing photo ${file}`);
  return hit.default;
}

/** True only on the production domain; staging is kept out of search indexes. */
export const isProduction = (site: URL | undefined): boolean => site?.hostname === 'strategy.nu';
