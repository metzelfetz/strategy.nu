import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { people, section } from '../lib/content';
import { site } from '../lib/site';
import { href, linkLabel } from '../lib/util';

// llms.txt (https://llmstxt.org): the page's facts as plain markdown, built
// from the same md files as the page, so the two cannot drift apart.

const para = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join('\n\n');

export const GET: APIRoute = async ({ site: origin }) => {
  const url = (path = '') => new URL(href(path), origin).href;
  const [hero, field, approach, teamSection, networkSection, rates, contact] = await Promise.all([
    section('hero'), section('field'), section('approach'), section('team'),
    section('network'), section('rates'), section('contact'),
  ]);
  const team = await people('team');
  const network = await people('network');
  const privacy = await getEntry('pages', 'privacy');

  const text = para(
    `# ${site.address[0]}`,
    `> ${site.description}`,
    `${hero.data.headline.join(' ')} ${hero.data.subline}`,

    `## ${field.data.title}`,
    field.body,
    ...field.data.segments.map((s) => `### ${s.title}\n\n${s.body}`),

    `## ${approach.data.title}`,
    approach.data.intro,
    ...approach.data.steps.map((s, i) => `### ${i + 1}. ${s.title} ${s.subtitle}\n\n${s.body}`),

    `## ${teamSection.data.title}`,
    teamSection.body,
    ...team.map(({ data: p, body }) => para(
      `### ${p.name}, ${p.role}`,
      body,
      `- ${site.labels.expertise}: ${p.expertise.join(', ')}\n` +
      `- ${site.labels.languages}: ${p.languages.map((l) => `${l.language} (${l.level})`).join(', ')}\n` +
      `- [${linkLabel(p.linkedin)}](${p.linkedin})`,
    )),

    `## ${networkSection.data.title}`,
    networkSection.body,
    ...network.map(({ data: p, body }) => para(
      `### ${p.name}${p.company ? `, ${p.company}` : ''} (${p.location})`,
      body,
      `- ${site.labels.expertise}: ${p.expertise.join(', ')}\n- [${linkLabel(p.url)}](${p.url})`,
    )),
    `${networkSection.data.cta.text} ${networkSection.data.cta.label}: [${site.email}](mailto:${site.email})`,

    `## ${rates.data.title}`,
    rates.data.items.map((r) => `- ${r.name}: ${r.price}${r.unit ? ` ${r.unit}` : ''}. ${r.note}`).join('\n'),
    rates.data.note,

    `## ${contact.data.title}`,
    `${contact.data.heading} ${contact.body} [${contact.data.email}](mailto:${contact.data.email})`,
    `${site.address.join(', ')}. ${site.labels.cvr} ${site.cvr}.`,

    `## ${site.labels.links}`,
    [
      `- [${site.labels.home}](${url()}): ${site.title}`,
      privacy && `- [${privacy.data.title}](${url('privacy/')})`,
    ].filter(Boolean).join('\n'),
  );
  return new Response(`${text}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
