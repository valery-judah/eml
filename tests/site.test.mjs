import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { articles } from '../content/articles.mjs';
import { publications, collections } from '../content/catalog.mjs';
import { clientProblems } from '../content/client-problems.mjs';
import { projectRoot, renderArticle, renderCollection, renderFeed, renderProblems } from '../scripts/render.mjs';

const origin = 'https://eml.systems';
const output = path.join(projectRoot, 'dist');

async function filesIn(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory()
      ? filesIn(path.join(directory, entry.name), relative)
      : [relative];
  }));
  return nested.flat().sort();
}

// The site uses quoted attributes and plain text content. These small readers
// inspect its published output without a DOM package or a running web server.
function decodeEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code) => {
    if (code.startsWith('#x')) return String.fromCodePoint(parseInt(code.slice(2), 16));
    if (code.startsWith('#')) return String.fromCodePoint(Number(code.slice(1)));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[code.toLowerCase()];
  });
}

function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(([, name, doubleQuoted, singleQuoted]) => [name, decodeEntities(doubleQuoted ?? singleQuoted)]));
}

function tags(source) {
  return [...source.matchAll(/<([a-z][\w:-]*)\b([^<>]*)>/gi)]
    .map(([, name, source]) => ({ name: name.toLowerCase(), attrs: attributes(source) }));
}

const routeFor = file => `/${file.replace(/index\.html$/, '')}`;
const fileFor = route => `${route.replace(/^\//, '')}index.html`;
const textOf = html => decodeEntities(html.replace(/<[^>]*>/g, '')).trim();
const structuredData = html => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null');

let inventory;
try {
  inventory = await filesIn(output);
} catch (error) {
  throw new Error('The production build is missing. Run npm run build before npm test.', { cause: error });
}
const documents = new Map(await Promise.all(inventory
  .filter(file => /\.(?:html|svg|css|xml|txt|js)$/.test(file))
  .map(async file => [file, await readFile(path.join(output, file), 'utf8')])));

test('every publication renders its complete sections, lists, examples, and navigation', () => {
  let checkedExamples = 0;
  let checkedLists = 0;
  for (const article of publications) {
    const file = fileFor(article.route);
    const html = documents.get(file);
    assert.ok(html, `missing generated page: ${file}`);
    const collection = collections[article.collection];
    assert.ok(collection, `unknown publication collection: ${article.collection}`);
    const collectionLinks = tags(documents.get(fileFor(collection.route))).filter(tag => tag.name === 'a').map(tag => tag.attrs.href);
    assert.ok(collectionLinks.includes(article.route), `${article.slug} cannot be discovered through its collection`);
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `${file} needs one primary heading`);
    assert.equal(textOf(headings[0][1]), article.title);
    const body = html.match(/<div class="article-body">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(body, `${file} has no visible article body`);
    const sections = [...body.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)];
    assert.equal(sections.length, article.sections.length, `${file} lost a section`);
    sections.forEach(([, attrs, sectionHtml], index) => {
      const section = article.sections[index];
      const id = attributes(attrs).id;
      assert.ok(id, `${file} section ${index + 1} cannot be linked`);
      assert.ok(tags(html).some(tag => tag.name === 'a' && tag.attrs.href === `#${id}`), `${file} section ${index + 1} is absent from the contents`);
      assert.equal(textOf(sectionHtml.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] || ''), section.heading);
      assert.deepEqual([...sectionHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, text]) => textOf(text)), section.text || [], `${file} changed section paragraphs`);
      assert.deepEqual([...sectionHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, text]) => textOf(text)), section.bullets || [], `${file} lost list items`);
      if (section.bullets?.length) checkedLists += 1;
      const examples = [...sectionHtml.matchAll(/<code>([\s\S]*?)<\/code>/g)];
      assert.equal(examples.length, section.code ? 1 : 0, `${file} has the wrong number of examples`);
      if (section.code) {
        assert.equal(decodeEntities(examples[0][1]), section.code, `${file} changed code or whitespace`);
        assert.equal(textOf(sectionHtml.match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1] || ''), section.codeLanguage || 'EXAMPLE');
        assert.ok(tags(sectionHtml).some(tag => tag.name === 'pre' && tag.attrs.tabindex === '0'), `${file} code must be reachable by keyboard`);
        checkedExamples += 1;
      }
    });
    const schema = structuredData(html);
    assert.ok(schema, `${file} needs structured article metadata`);
    assert.equal(schema['@type'], ['notes', 'papers'].includes(article.collection) ? 'TechArticle' : 'BlogPosting');
    assert.equal(schema.headline, article.title);
    assert.equal(schema.description, article.standfirst);
    assert.equal(schema.url, `${origin}${article.route}`);
  }
  assert.ok(checkedExamples > 0 && checkedLists > 0, 'the technical-note examples and lists must be exercised');
});

test('papers develop a substantial argument with examples, methods, objections, and declared limits', () => {
  const papers = collections.papers.entries;
  assert.equal(papers.length, 3, 'publish all three commissioned position papers');
  const countWords = text => text.trim().split(/\s+/).filter(Boolean).length;
  for (const paper of papers) {
    const html = documents.get(fileFor(paper.route));
    assert.ok(paper.abstract && countWords(paper.abstract) >= 50, `${paper.slug} needs a substantive abstract`);
    assert.ok(paper.thesis && countWords(paper.thesis) >= 20, `${paper.slug} needs an explicit central argument`);
    assert.ok(paper.methodNote?.trim(), `${paper.slug} must explain the status and basis of its method`);
    for (const field of ['abstract', 'thesis', 'methodNote']) assert.ok(textOf(html).includes(paper[field]), `${paper.slug} does not publish its ${field}`);
    assert.ok(paper.sections.length >= 6, `${paper.slug} is an outline rather than a developed paper`);
    const body = paper.sections.flatMap(section => [section.heading, ...(section.text || []), ...(section.bullets || [])]).join(' ');
    assert.ok(countWords(body) >= 1200, `${paper.slug} needs a complete technical argument`);
    assert.match(body, /hypothetical|imagine|suppose|worked example/i, `${paper.slug} needs an identifiable worked example`);
    assert.ok(paper.sections.some(section => /counterargument|objection|alternative|critici/i.test(section.heading) && countWords((section.text || []).join(' ')) >= 80), `${paper.slug} must develop objections or alternatives`);
    assert.ok(paper.sections.some(section => /limit|scope/i.test(section.heading) && countWords((section.text || []).join(' ')) >= 80), `${paper.slug} must develop its limits`);
    assert.ok(paper.sections.some(section => /method|practic|procedure|workflow|investigat|design|record|step/i.test(section.heading) && ((section.text?.length || 0) >= 2 || section.bullets?.length)), `${paper.slug} needs an actionable method`);
    assert.match(`${paper.abstract} ${paper.methodNote}`, /hypothetical/i, `${paper.slug} must make the status of its examples clear`);
  }
});

test('paper citations resolve to annotated HTTPS references and preserve their scope', () => {
  for (const paper of collections.papers.entries) {
    const html = documents.get(fileFor(paper.route));
    const references = paper.references || [];
    assert.ok(references.length >= 2, `${paper.slug} needs supporting primary references`);
    const referenceIds = references.map(reference => reference.id);
    assert.equal(new Set(referenceIds).size, referenceIds.length, `${paper.slug} has duplicate reference identifiers`);
    for (const reference of references) {
      assert.match(reference.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${paper.slug} has an invalid reference identifier`);
      assert.ok(reference.title?.trim(), `${paper.slug} has an untitled reference`);
      assert.ok(reference.note?.trim().split(/\s+/).length >= 15, `${paper.slug} needs an annotation explaining each source's contribution and limits`);
      assert.equal(new URL(reference.url).protocol, 'https:', `${paper.slug} has a non-HTTPS reference`);
    }
    const citations = paper.sections.flatMap(section => section.citations || []);
    assert.ok(citations.length > 0, `${paper.slug} needs citations attached to its argument`);
    for (const id of citations) assert.ok(referenceIds.includes(id), `${paper.slug} cites an unknown reference: ${id}`);
    for (const id of referenceIds) assert.ok(citations.includes(id), `${paper.slug} lists an unused reference: ${id}`);
    const renderedCitations = [...html.matchAll(/<a href="#reference-(\d+)">([\s\S]*?)<\/a>/g)];
    assert.deepEqual(renderedCitations.map(([, number]) => Number(number)), citations.map(id => referenceIds.indexOf(id) + 1), `${paper.slug} changed citation numbering or omitted inline citations`);
    renderedCitations.forEach(([, number, label]) => assert.equal(textOf(label), `[${number}] ${references[Number(number) - 1].title}`));
    const referenceSection = html.match(/<section class="paper-references"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(referenceSection, `${paper.slug} needs a visible references section`);
    const referenceItems = [...referenceSection.matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)];
    assert.equal(referenceItems.length, references.length, `${paper.slug} omitted or duplicated references`);
    referenceItems.forEach(([, attrs, itemHtml], index) => {
      const reference = references[index];
      assert.equal(attributes(attrs).id, `reference-${index + 1}`);
      const link = tags(itemHtml).find(tag => tag.name === 'a');
      assert.equal(link?.attrs.href, new URL(reference.url).href, `${paper.slug} changed a reference destination`);
      assert.ok(textOf(itemHtml).includes(reference.title), `${paper.slug} omitted a reference title`);
      assert.equal(textOf(itemHtml.match(/<p>([\s\S]*?)<\/p>/)?.[1] || ''), reference.note, `${paper.slug} omitted a scope annotation`);
      assert.equal(link.attrs.target, '_blank');
      assert.ok(link.attrs.rel?.split(/\s+/).includes('noopener'));
    });
    assert.deepEqual(structuredData(html).citation, references.map(reference => ({ '@type': 'CreativeWork', name: reference.title, url: reference.url })), `${paper.slug} has inconsistent citation metadata`);
  }
});

test('the client problems page publishes motivations, diagnostic work, next decisions, and supporting reading', async () => {
  const html = documents.get('problems/index.html');
  assert.ok(html, 'the complete client problems page must be built');
  assert.equal(html, await renderProblems(), 'the client problems page is stale relative to its content');
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(headings.length, 1);
  assert.equal(textOf(headings[0][1].replace(/<br\s*\/?>/gi, ' ')), `${clientProblems.headline} ${clientProblems.emphasis}`);
  for (const paragraph of clientProblems.intro) assert.ok(textOf(html).includes(paragraph), 'the client context is missing');
  const motivation = html.match(/<section class="practice-motivation"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(motivation, 'EML practice motivation must be separate from individual client situations');
  assert.equal(textOf(motivation.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] || ''), clientProblems.motivation.heading);
  assert.deepEqual([...motivation.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, paragraph]) => textOf(paragraph)), clientProblems.motivation.text);
  assert.ok(clientProblems.problems.length >= 5, 'the page must cover the distinct client situations');
  const cases = [...html.matchAll(/<article class="problem-case"([^>]*)>([\s\S]*?)<\/article>/g)];
  assert.equal(cases.length, clientProblems.problems.length, 'the page omitted or duplicated a client situation');
  const ids = clientProblems.problems.map(problem => problem.id);
  assert.equal(new Set(ids).size, ids.length, 'client situations need unique anchor targets');
  const situationMap = html.match(/<nav class="problem-map"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(situationMap, 'visitors need a way to navigate between client situations');
  assert.deepEqual(tags(situationMap).filter(tag => tag.name === 'a').map(tag => tag.attrs.href), ids.map(id => `#${id}`));
  cases.forEach(([, source, caseHtml], index) => {
    const problem = clientProblems.problems[index];
    assert.match(problem.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(attributes(source).id, problem.id);
    assert.equal(textOf(caseHtml.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] || ''), problem.title);
    assert.equal(textOf(caseHtml.match(/<p class="problem-trigger">([\s\S]*?)<\/p>/)?.[1] || ''), problem.trigger);
    assert.deepEqual([...caseHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, paragraph]) => textOf(paragraph)), [problem.motivation, ...problem.diagnosis, problem.outcome], `${problem.id} omitted a motivation, explanation, or next decision`);
    assert.deepEqual([...caseHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, item]) => textOf(item)), [...problem.questions, ...problem.work], `${problem.id} omitted diagnostic questions or concrete work`);
    assert.ok(problem.questions.length >= 3 && problem.work.length >= 3, `${problem.id} needs diagnostic questions and reviewable work`);
    const reading = caseHtml.match(/<nav class="problem-reading"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(reading, `${problem.id} needs supporting reasoning and methods`);
    assert.deepEqual(tags(reading).filter(tag => tag.name === 'a').map(tag => tag.attrs.href), problem.reading);
    for (const route of problem.reading) assert.ok(publications.some(entry => entry.route === route), `${problem.id} links to unpublished reading: ${route}`);
    const contact = tags(caseHtml).find(tag => tag.name === 'a' && tag.attrs.href?.startsWith('mailto:'));
    assert.equal(new URL(contact.attrs.href).searchParams.get('subject'), `Let's discuss: ${problem.title}`, `${problem.id} enquiry subject must preserve its context`);
  });
  const engagement = html.match(/<section class="problem-engagement"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(engagement, 'the page needs a concrete route from diagnosis to engagement');
  assert.equal(textOf(engagement.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] || ''), clientProblems.engagement.heading);
  for (const paragraph of clientProblems.engagement.text) assert.ok(textOf(engagement).includes(paragraph));
  const steps = [...engagement.matchAll(/<li>([\s\S]*?)<\/li>/g)];
  assert.equal(steps.length, clientProblems.engagement.steps.length);
  steps.forEach(([, stepHtml], index) => {
    assert.equal(textOf(stepHtml.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] || ''), clientProblems.engagement.steps[index].title);
    assert.equal(textOf(stepHtml.match(/<p>([\s\S]*?)<\/p>/)?.[1] || ''), clientProblems.engagement.steps[index].text);
  });
  const schema = structuredData(html);
  assert.equal(schema['@type'], 'WebPage');
  assert.equal(schema.name, clientProblems.title);
  assert.equal(schema.description, clientProblems.description);
  assert.equal(schema.url, `${origin}/problems/`);
  assert.ok(tags(documents.get('index.html')).some(tag => tag.name === 'a' && tag.attrs.href === '/problems/'), 'the homepage must make the client problems page discoverable');
});

test('collection pages expose exactly their catalog entries and usable topic/search metadata', async () => {
  const homepageLinks = tags(documents.get('index.html')).filter(tag => tag.name === 'a').map(tag => tag.attrs.href);
  const membership = [];
  for (const [key, collection] of Object.entries(collections)) {
    const file = fileFor(collection.route);
    const html = documents.get(file);
    assert.ok(html, `missing collection: ${file}`);
    assert.equal(html, await renderCollection(key), `${file} is stale relative to the catalog`);
    assert.ok(homepageLinks.includes(collection.route), `the homepage must lead to ${collection.title}`);
    const expected = publications.filter(entry => entry.collection === key);
    assert.deepEqual(collection.entries.map(entry => entry.route), expected.map(entry => entry.route), `${key} catalog membership diverged`);
    membership.push(...collection.entries.map(entry => entry.route));
    const cards = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)]
      .filter(([, attrs]) => /(?:^|\s)data-publication(?:\s|=|$)/.test(attrs));
    assert.equal(cards.length, expected.length, `${key} omits or duplicates publication cards`);
    cards.forEach(([, source, cardHtml], index) => {
      const entry = expected[index];
      const metadata = attributes(source);
      assert.equal(metadata['data-category'], entry.category, `${entry.slug} has the wrong filter category`);
      for (const term of [entry.title, entry.standfirst, entry.category, ...entry.tags]) {
        assert.ok(metadata['data-search']?.includes(term), `${entry.slug} cannot be searched by ${term}`);
      }
      const links = tags(cardHtml).filter(tag => tag.name === 'a').map(tag => tag.attrs.href);
      assert.deepEqual([...new Set(links)], [entry.route], `${entry.slug} card links to a different entry`);
      const cardTags = cardHtml.match(/<ul class="publication-tags"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
      assert.ok(cardTags, `${entry.slug} needs visible topics`);
      assert.deepEqual([...cardTags.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, tag]) => textOf(tag)), entry.tags);
    });
    assert.deepEqual(new Set(expected.map(entry => entry.category)), new Set(collection.categories), `${key} contains an unfilterable category or empty topic`);
    const filters = tags(html).filter(tag => tag.name === 'button' && 'data-filter' in tag.attrs);
    assert.deepEqual(filters.map(tag => tag.attrs['data-filter']), ['all', ...collection.categories]);
    assert.deepEqual(filters.map(tag => tag.attrs['aria-pressed']), ['true', ...collection.categories.map(() => 'false')]);
    assert.ok(tags(html).some(tag => tag.name === 'input' && tag.attrs.id === 'library-query' && tag.attrs.type === 'search'));
    assert.ok(tags(html).some(tag => tag.attrs.role === 'status' && tag.attrs['aria-live'] === 'polite'), `${key} needs an accessible result announcement`);
    const schema = structuredData(html);
    assert.equal(schema?.['@type'], 'CollectionPage');
    assert.deepEqual(schema.mainEntity.itemListElement.map(item => item.url), expected.map(entry => `${origin}${entry.route}`));
  }
  assert.deepEqual(membership.sort(), publications.map(entry => entry.route).sort(), 'publications must belong to exactly one collection');
});

test('the three original writing URLs remain the canonical pages for their essays', () => {
  for (const article of articles) {
    const legacyRoute = `/writing/${article.slug}/`;
    const entry = publications.find(entry => entry.slug === article.slug);
    assert.equal(entry?.route, legacyRoute, `legacy URL changed for ${article.slug}`);
    assert.equal(entry.collection, 'blog');
    assert.ok(documents.has(fileFor(legacyRoute)), `legacy page is missing: ${legacyRoute}`);
    assert.ok(!documents.has(fileFor(`/blog/${article.slug}/`)), `duplicate blog URL dilutes the canonical legacy page: ${article.slug}`);
  }
});

test('page routes, canonical metadata, and sitemap describe the same unique public pages', () => {
  const slugs = publications.map(article => article.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate article slugs overwrite a page');
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `unsafe article route: ${slug}`);

  const routes = inventory.filter(file => file.endsWith('.html') && file !== '404.html').map(routeFor);
  const expectedRoutes = ['/', '/problems/', ...Object.values(collections).map(collection => collection.route), ...publications.map(entry => entry.route)].sort();
  assert.equal(new Set(expectedRoutes).size, expectedRoutes.length, 'catalog routes collide');
  for (const entry of publications) assert.match(entry.route, /^\/(?:notes|blog|writing|papers)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/, `unsafe publication route: ${entry.route}`);
  assert.deepEqual(routes.sort(), expectedRoutes);
  const canonicalUrls = [];
  for (const file of inventory.filter(file => file.endsWith('.html') && file !== '404.html')) {
    const elements = tags(documents.get(file));
    const canonical = elements.filter(tag => tag.name === 'link' && tag.attrs.rel === 'canonical');
    assert.equal(canonical.length, 1, `${file} needs one canonical URL`);
    const expected = `${origin}${routeFor(file)}`;
    assert.equal(canonical[0].attrs.href, expected, `${file} has the wrong canonical route`);
    const socialUrl = elements.find(tag => tag.name === 'meta' && tag.attrs.property === 'og:url');
    assert.equal(socialUrl?.attrs.content, expected, `${file} has mismatched social metadata`);
    canonicalUrls.push(canonical[0].attrs.href);
  }
  assert.equal(new Set(canonicalUrls).size, canonicalUrls.length, 'canonical URLs must be unique');
  const sitemap = documents.get('sitemap.xml');
  assert.ok(sitemap?.includes('http://www.sitemaps.org/schemas/sitemap/0.9'));
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decodeEntities(url));
  assert.equal(new Set(locations).size, locations.length, 'duplicate sitemap locations');
  assert.deepEqual(locations.sort(), canonicalUrls.sort(), 'sitemap omits or invents public pages');
  assert.match(documents.get('robots.txt'), /Sitemap: https:\/\/eml\.systems\/sitemap\.xml/);
  assert.ok(tags(documents.get('404.html')).some(tag => tag.attrs.name === 'robots' && tag.attrs.content === 'noindex'));
});

test('RSS publishes every blog entry once with its actual canonical URL and escaped text', () => {
  const feed = documents.get('feed.xml');
  assert.ok(feed, 'the build must include feed.xml');
  assert.equal(feed, renderFeed(), 'the published feed is stale relative to the catalog');
  assert.match(feed, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(feed, /<rss version="2\.0"><channel>/);
  assert.ok(feed.endsWith('</channel></rss>\n'), 'the RSS document must close its channel and root');
  assert.doesNotMatch(feed, /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i, 'RSS must escape ampersands, including in URLs');
  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => item);
  const expected = collections.blog.entries;
  assert.equal(items.length, expected.length, 'RSS omitted or duplicated a blog essay');
  const links = [];
  items.forEach((item, index) => {
    const entry = expected[index];
    for (const [element, value] of [['title', entry.title], ['description', entry.standfirst], ['link', `${origin}${entry.route}`]]) {
      const match = item.match(new RegExp(`<${element}>([^<]*)<\\/${element}>`));
      assert.ok(match, `${entry.slug} has missing or unescaped RSS ${element}`);
      assert.equal(decodeEntities(match[1]), value, `${entry.slug} RSS ${element} changed`);
    }
    const guid = item.match(/<guid\b([^>]*)>([^<]*)<\/guid>/);
    assert.ok(guid, `${entry.slug} needs a stable feed identifier`);
    assert.equal(attributes(guid[1]).isPermaLink, 'true');
    assert.equal(decodeEntities(guid[2]), `${origin}${entry.route}`);
    links.push(decodeEntities(item.match(/<link>([^<]+)<\/link>/)[1]));
  });
  assert.equal(new Set(links).size, links.length, 'duplicate feed items');
  for (const entry of publications.filter(entry => entry.collection !== 'blog')) assert.ok(!links.includes(`${origin}${entry.route}`), 'notes and papers should not enter the blog feed');
  for (const collection of Object.values(collections)) {
    assert.ok(tags(documents.get(fileFor(collection.route))).some(tag => tag.name === 'link' && tag.attrs.rel === 'alternate' && tag.attrs.type === 'application/rss+xml' && tag.attrs.href === '/feed.xml'), 'collection pages need RSS discovery metadata');
  }
});

test('internal links, assets, SVG references, and interactive targets all resolve in the build', () => {
  const ids = new Map();
  for (const [file, source] of documents) {
    if (!/\.(?:html|svg)$/.test(file)) continue;
    const values = tags(source).map(tag => tag.attrs.id).filter(Boolean);
    assert.equal(new Set(values).size, values.length, `${file} has duplicate IDs`);
    ids.set(file, new Set(values));
  }

  let checkedReferences = 0;
  function checkReference(reference, from) {
    assert.ok(reference.trim(), `${from} has an empty reference`);
    const base = new URL(from.endsWith('.html') ? routeFor(from) : `/${from}`, origin);
    const url = new URL(reference, base);
    assert.ok(['http:', 'https:', 'mailto:', 'tel:', 'data:'].includes(url.protocol), `${from} uses an unexpected URL scheme: ${url.protocol}`);
    if (url.origin !== origin) return;
    let target = decodeURIComponent(url.pathname).replace(/^\//, '');
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!inventory.includes(target) && inventory.includes(`${target}/index.html`)) target += '/index.html';
    assert.ok(inventory.includes(target), `${from} references a missing file: ${reference}`);
    if (url.hash) {
      const fragment = decodeURIComponent(url.hash.slice(1));
      assert.ok(ids.get(target)?.has(fragment), `${from} references a missing fragment: ${reference}`);
    }
    checkedReferences += 1;
  }

  for (const [file, source] of documents) {
    if (!/\.(?:html|svg|css)$/.test(file)) continue;
    if (/\.(?:html|svg)$/.test(file)) {
      for (const { name, attrs } of tags(source)) {
        for (const attribute of ['href', 'xlink:href', 'src', 'poster', 'action']) {
          if (attribute in attrs) checkReference(attrs[attribute], file);
        }
        if (attrs.srcset) {
          for (const candidate of attrs.srcset.split(',')) checkReference(candidate.trim().split(/\s+/)[0], file);
        }
        if (name === 'meta' && attrs.property === 'og:image') checkReference(attrs.content, file);
        for (const attribute of ['aria-controls', 'aria-labelledby', 'aria-describedby', 'for']) {
          if (!attrs[attribute]) continue;
          for (const id of attrs[attribute].split(/\s+/)) {
            assert.ok(ids.get(file)?.has(id), `${file} has a missing ${attribute} target: ${id}`);
          }
        }
      }
    }
    for (const [, reference] of source.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) checkReference(reference, file);
  }
  assert.ok(checkedReferences > 0, 'the reference audit did not inspect any internal URLs');
});

test('every service and engagement enquiry maps to one real form option', () => {
  const html = documents.get('index.html');
  const select = html.match(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)
    ?.find(element => attributes(element.match(/^<select\b([^>]*)>/)[1]).id === 'enquiry-interest');
  assert.ok(select, 'the enquiry interest selector must be published');
  const optionValues = [...select.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/g)]
    .map(([, attrs, label]) => attributes(attrs).value ?? textOf(label));
  assert.ok(optionValues.length > 1, 'the enquiry form needs a choice of topics');
  assert.ok(optionValues.every(value => value.trim()), 'empty enquiry options cannot be selected reliably');
  assert.equal(new Set(optionValues).size, optionValues.length, 'duplicate enquiry option values');

  const enquiryLinks = tags(html).filter(tag => 'data-enquiry' in tag.attrs);
  assert.ok(enquiryLinks.length > 0, 'service and engagement enquiry links must exist');
  for (const link of enquiryLinks) {
    assert.ok(optionValues.includes(link.attrs['data-enquiry']), `unknown enquiry topic: ${link.attrs['data-enquiry']}`);
    assert.equal(link.attrs.href, '#contact', 'enquiry links need a useful destination when scripting is unavailable');
  }
  const form = html.match(/<form\b[^>]*id="enquiry-form"[\s\S]*?<\/form>/)?.[0];
  assert.ok(form, 'the enquiry form must be published');
  const fields = tags(form).filter(tag => ['input', 'select', 'textarea'].includes(tag.name));
  assert.deepEqual(new Set(fields.map(field => field.attrs.name)), new Set(['name', 'email', 'interest', 'message']));
  assert.ok(fields.some(field => field.attrs.name === 'email' && field.attrs.type === 'email'));
  assert.match(form, /hello@eml\.systems/, 'visitors need the enquiry recipient before opening a draft');
});

test('article content remains text in HTML and cannot break out of structured metadata', async () => {
  const unsafe = `A <img data-injected="true"> & "quote" 'apostrophe' </script><script data-injected="true">alert(1)</script>`;
  const encoded = 'A &lt;img data-injected=&quot;true&quot;&gt; &amp; &quot;quote&quot; &#39;apostrophe&#39; &lt;/script&gt;&lt;script data-injected=&quot;true&quot;&gt;alert(1)&lt;/script&gt;';
  const article = {
    slug: 'escaping-probe', title: unsafe, standfirst: unsafe,
    category: unsafe, readTime: unsafe, tags: [unsafe],
    sourceNotes: ['private-editorial-only/source.md'],
    sections: [{ heading: unsafe, text: [unsafe], bullets: [unsafe], code: unsafe, codeLanguage: unsafe }]
  };
  const html = await renderArticle(article);
  assert.ok(html.includes(`<h1>${encoded}</h1>`), 'the title must remain text');
  assert.ok(html.includes(`<h2>${encoded}</h2>`), 'section headings must remain text');
  assert.ok(html.includes(`<p>${encoded}</p>`), 'paragraphs must remain text');
  assert.ok(html.includes(`<li>${encoded}</li>`), 'bullet and topic text must remain text');
  assert.ok(html.includes(`<code>${encoded}</code>`), 'code examples must remain literal text');
  assert.ok(html.includes(`<figcaption>${encoded}</figcaption>`), 'code language captions must remain text');
  assert.ok(html.includes(`name="description" content="${encoded}"`), 'metadata attributes must remain quoted');
  assert.ok(html.includes(`aria-label="${encoded} example"`), 'example labels must remain quoted');
  assert.doesNotMatch(html, /<(?:img|script)\b[^>]*data-injected\s*=/i, 'title, category, reading time, and body text must not create HTML elements');
  assert.ok(!tags(html).some(tag => tag.attrs['data-injected'] === 'true'), 'content introduced an executable HTML element');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, 'structured metadata must survive hostile text');
  const schema = JSON.parse(json);
  assert.equal(schema.headline, unsafe, 'structured data must preserve the original content');
  assert.equal(schema.description, unsafe);
  assert.ok(!json.includes('<'), 'literal angle brackets can terminate a JSON script element');
  assert.ok(!html.includes('private-editorial-only'), 'private editorial metadata must not be serialized');
  const enquiry = tags(html).find(tag => tag.name === 'a' && tag.attrs.href?.startsWith('mailto:'));
  assert.equal(new URL(enquiry.attrs.href).searchParams.get('subject'), `A question about: ${unsafe}`, 'article enquiry subjects must round-trip through URL encoding');
});

test('paper reference titles and annotations remain escaped text in citations, bibliography, and metadata', async () => {
  const unsafe = `Reference <img data-injected="true"> & "quote" </script><script data-injected="true">alert(1)</script>`;
  const encoded = 'Reference &lt;img data-injected=&quot;true&quot;&gt; &amp; &quot;quote&quot; &lt;/script&gt;&lt;script data-injected=&quot;true&quot;&gt;alert(1)&lt;/script&gt;';
  const referenceUrl = 'https://example.com/paper?q="quoted"&topic=<evaluation>';
  const paper = {
    ...collections.papers.entries[0],
    references: [{ id: 'escaping-reference', title: unsafe, note: unsafe, url: referenceUrl }],
    sections: [{ heading: 'Citation escaping probe', text: ['A literal reference must remain text.'], citations: ['escaping-reference'] }]
  };
  const html = await renderArticle(paper);
  assert.ok(html.includes(`<a href="#reference-1">[1] ${encoded}</a>`), 'inline citation titles must remain text');
  assert.ok(html.includes(`<p>${encoded}</p>`), 'reference annotations must remain text');
  assert.ok(!tags(html).some(tag => tag.attrs['data-injected'] === 'true'), 'a reference created an HTML element');
  const referenceSection = html.match(/<section class="paper-references"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  const link = tags(referenceSection).find(tag => tag.name === 'a');
  assert.equal(link.attrs.href, new URL(referenceUrl).href, 'reference query strings must survive URL normalization and attribute escaping');
  assert.ok(referenceSection.includes(`${encoded} <span aria-hidden="true">`), 'bibliography titles must remain text');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(!json.includes('<'), 'a reference title must not terminate the metadata script');
  assert.deepEqual(JSON.parse(json).citation, [{ '@type': 'CreativeWork', name: unsafe, url: referenceUrl }]);
});

test('paper rendering rejects unsafe reference destinations and unresolved citations', async () => {
  const base = collections.papers.entries[0];
  for (const url of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'http://example.com/paper', 'file:///private/paper.pdf', '//example.com/paper', '/relative-paper']) {
    await assert.rejects(renderArticle({ ...base, references: [{ id: 'unsafe-reference', title: 'Reference probe', note: 'A scope annotation.', url }], sections: [{ heading: 'A reference', text: ['A destination must be HTTPS.'], citations: ['unsafe-reference'] }] }), /HTTPS|Invalid URL/, `unsafe reference URL was accepted: ${url}`);
  }
  await assert.rejects(renderArticle({ ...base, references: [], sections: [{ heading: 'Unresolved citation', text: ['The cited source must exist.'], citations: ['absent-reference'] }] }), /Unknown reference: absent-reference/);
});

test('deployment contains public artifacts only, without notes, source modules, or local paths', () => {
  const publicFiles = new Set(['index.html', '404.html', 'styles.css', 'main.js', 'robots.txt', 'sitemap.xml', 'feed.xml', 'problems/index.html', ...Object.values(collections).map(collection => fileFor(collection.route)), ...publications.map(entry => fileFor(entry.route))]);
  const privateSources = [...new Set([...publications.flatMap(entry => entry.sourceNotes || []), ...clientProblems.sourceNotes])];
  assert.ok(privateSources.length > 0, 'private source references must be represented in this audit');
  for (const file of inventory) {
    const publicAsset = /^assets\/[a-z0-9/_.-]+\.(?:svg|png|jpe?g|webp|avif|ico|woff2?)$/i.test(file);
    assert.ok(publicFiles.has(file) || publicAsset, `unexpected deploy artifact: ${file}`);
    assert.doesNotMatch(file, /(?:^|\/)(?:\.|content\/|scripts\/|tests\/|node_modules\/)|\.(?:md|mjs|map|toml|env)$/i, `source or private file in deploy output: ${file}`);
  }
  for (const [file, source] of documents) {
    assert.doesNotMatch(source, /\/Users\/|\/home\/[^/]+\/|file:\/\/|\/notes\/(?:ai|ai-engineering|var)\//, `local source path leaked into ${file}`);
    assert.ok(!source.includes('sourceNotes'), `private editorial field leaked into ${file}`);
    for (const privateSource of privateSources) assert.ok(!source.includes(privateSource), `private source reference leaked into ${file}: ${privateSource}`);
  }
});
