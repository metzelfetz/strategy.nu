import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

type Section = CollectionEntry<'sections'>;
type SectionId = Section['data']['id'];

/** Loads one section file with its frontmatter narrowed to that section's schema. */
export async function section<K extends SectionId>(id: K) {
  const entry = await getEntry('sections', id);
  if (!entry || entry.data.id !== id) throw new Error(`Missing section ${id}.md`);
  const { Content } = await render(entry);
  return { data: entry.data as Extract<Section['data'], { id: K }>, Content };
}

/** Loads a people collection in `order`, each with its rendered body. */
export async function people<C extends 'team' | 'network'>(collection: C) {
  const entries = (await getCollection(collection)) as CollectionEntry<C>[];
  entries.sort((a, b) => a.data.order - b.data.order);
  return Promise.all(entries.map(async (e) => ({ data: e.data, Content: (await render(e)).Content })));
}
