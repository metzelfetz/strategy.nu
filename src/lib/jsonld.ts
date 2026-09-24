import { getCollection } from 'astro:content';
import { site } from './site';

/** schema.org Organization for the home page, built from site.json and the team files. */
export async function organization(origin: URL, home: string) {
  const [name, street, cityLine] = site.address;
  const city = cityLine?.match(/^(\d{4})\s+([^,]+),\s*(.+)$/);
  const team = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: new URL(home, origin).href,
    logo: new URL(`${home}apple-touch-icon.png`, origin).href,
    description: site.description,
    taxID: site.cvr,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      ...(city && { postalCode: city[1], addressLocality: city[2], addressCountry: city[3] }),
    },
    member: team.map((t) => ({
      '@type': 'Person', name: t.data.name, jobTitle: t.data.role, sameAs: t.data.linkedin,
    })),
  };
}
