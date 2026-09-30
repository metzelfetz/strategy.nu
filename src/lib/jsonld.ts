import { getCollection, getEntry } from 'astro:content';
import { site } from './site';

// UN/CEFACT unit codes for the rate units used in rates.md.
const UNIT_CODES: Record<string, string> = { hour: 'HUR', day: 'DAY' };

/** "DKK 2,000" → { currency: 'DKK', amount: 2000 }; "On request" → undefined. */
function parsePrice(price: string) {
  const m = price.match(/^([A-Z]{3})\s*([\d,.]+)$/);
  return m ? { currency: m[1], amount: Number(m[2].replace(/,/g, '')) } : undefined;
}

/**
 * schema.org graph for the home page: the business (ProfessionalService, a
 * LocalBusiness subtype) with its rates as offers, and the WebSite. Built from
 * site.json, rates.md and the team files, so it cannot drift from the page.
 */
export async function homeGraph(origin: URL, home: string) {
  const [name, street, cityLine] = site.address;
  const city = cityLine?.match(/^(\d{4})\s+([^,]+)/);
  const url = new URL(home, origin).href;
  const orgId = `${url}#organization`;
  const team = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
  const rates = await getEntry('sections', 'rates');
  const items = rates?.data.id === 'rates' ? rates.data.items : [];

  const offers = items.map((r) => {
    const price = parsePrice(r.price);
    const unit = r.unit.replace(/^per\s+/, '');
    return {
      '@type': 'Offer',
      name: r.name,
      description: r.note,
      itemOffered: { '@type': 'Service', name: r.name, provider: { '@id': orgId } },
      ...(price && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price.amount,
          priceCurrency: price.currency,
          valueAddedTaxIncluded: false,
          ...(r.unit && { unitText: r.unit }),
          ...(UNIT_CODES[unit] && { unitCode: UNIT_CODES[unit] }),
        },
      }),
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': site.org.type,
        '@id': orgId,
        name,
        alternateName: site.org.alternateName,
        url,
        logo: new URL(`${home}apple-touch-icon.png`, origin).href,
        image: new URL(`${home}og.png`, origin).href,
        description: site.description,
        email: site.email,
        taxID: site.cvr,
        foundingDate: site.org.foundingDate,
        address: {
          '@type': 'PostalAddress',
          streetAddress: street,
          ...(city && { postalCode: city[1], addressLocality: city[2] }),
          addressCountry: site.org.countryCode,
        },
        areaServed: site.org.areaServed.map((n) => ({ '@type': 'Country', name: n })),
        sameAs: [site.linkedin, ...site.org.sameAs],
        member: team.map((t) => ({
          '@type': 'Person', name: t.data.name, jobTitle: t.data.role, sameAs: t.data.linkedin,
        })),
        makesOffer: offers,
      },
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name,
        alternateName: site.org.alternateName,
        description: site.description,
        inLanguage: 'en',
        publisher: { '@id': orgId },
      },
    ],
  };
}
