import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every field is required unless marked optional, and unknown fields are
// rejected, so a typo in a md file fails the build instead of vanishing.
const text = z.string().trim().min(1);
const photo = text.refine(
  (file) => existsSync(join(process.cwd(), 'src/assets/photos', file)),
  { message: 'Photo not found in src/assets/photos/' },
);
const base = { title: text, order: z.number().int().min(0) };
// Mood images for sections. `credit` records the source; it is not shown on the page.
const image = z.strictObject({
  file: text.refine(
    (file) => existsSync(join(process.cwd(), 'src/assets/images', file)),
    { message: 'Image not found in src/assets/images/' },
  ),
  alt: text,
  credit: text,
});

const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sections' }),
  schema: z.discriminatedUnion('id', [
    z.strictObject({ id: z.literal('hero'), ...base, headline: z.array(text).min(1), subline: text, cta: text, image: image.optional() }),
    z.strictObject({ id: z.literal('field'), ...base, segments: z.array(z.strictObject({ title: text, image: image.optional(), body: text })).min(1) }),
    z.strictObject({
      id: z.literal('approach'), ...base, intro: text,
      steps: z.array(z.strictObject({ title: text, subtitle: text, image: image.optional(), body: text })).min(1),
    }),
    z.strictObject({ id: z.literal('team'), ...base }),
    z.strictObject({ id: z.literal('network'), ...base, cta: z.strictObject({ text, label: text, subject: text }) }),
    z.strictObject({
      id: z.literal('rates'), ...base, note: text,
      items: z.array(z.strictObject({ name: text, price: text, unit: z.string(), note: text, subject: text })).min(1),
    }),
    z.strictObject({ id: z.literal('contact'), ...base, heading: text, email: z.email() }),
  ]),
});

const team = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/team' }),
  schema: z.strictObject({
    name: text,
    role: text,
    order: z.number().int(),
    photo,
    linkedin: z.url(),
    languages: z.array(z.strictObject({ language: text, level: text })).min(1),
    expertise: z.array(text).min(1),
  }),
});

const network = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/network' }),
  schema: z.strictObject({
    name: text,
    company: text.optional(),
    order: z.number().int(),
    location: text,
    url: z.url(),
    photo,
    expertise: z.array(text).min(1),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.strictObject({ title: text, updated: z.coerce.date() }),
});

export const collections = { sections, team, network, pages };
