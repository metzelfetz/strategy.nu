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
  }),
}).parse(raw);
