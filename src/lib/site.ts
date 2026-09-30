import { z } from 'astro/zod';
import raw from '../content/site.json';

const text = z.string().trim().min(1);

// site.json is a single object, not a collection, so it is checked here.
// A bad value fails the build as soon as any page imports `site`.
export const site = z.strictObject({
  title: text,
  description: text,
  email: z.email(),
  address: z.array(text).min(1),
  cvr: text,
  // The company page, linked in the footer and listed first in the JSON-LD `sameAs`.
  linkedin: z.url(),
  // The footer credit line; {year} becomes the build year.
  credit: text.regex(/\{year\}/),
  // Facts for the JSON-LD only; nothing here is shown on the page.
  org: z.strictObject({
    type: z.enum(['ProfessionalService', 'LocalBusiness']),
    alternateName: text,
    foundingDate: z.iso.date(),
    countryCode: z.string().regex(/^[A-Z]{2}$/),
    areaServed: z.array(text).min(1),
    sameAs: z.array(z.url()),
  }),
  nav: z.array(z.strictObject({ label: text, href: z.string().regex(/^#[a-z]+$/) })).min(1),
  cta: z.strictObject({ label: text, subject: text }),
  labels: z.strictObject({
    home: text,
    mainNav: text,
    menu: text,
    expertise: text,
    languages: text,
    privacy: text,
    updated: text,
    cvr: text,
    links: text,
  }),
}).parse(raw);
