import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publications, collections, relatedPublications } from '../content/catalog.mjs';
import { clientProblems } from '../content/client-problems.mjs';
import { clientRationale } from '../content/client-rationale.mjs';
import { workingTogether, journeyForProblem } from '../content/engagements.mjs';
import { workProducts } from '../content/work-products.mjs';
import { readerPathFor } from '../content/reader-paths.mjs';
import { pricing, pricingRoute, offerRoute, formatPrice } from '../content/pricing.mjs';
import { contactTopics } from '../contact.js';
import { site, withSitePaths, withHomepageMetadata } from '../site.config.mjs';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const origin = site.root;
const safeJson = value => JSON.stringify(value).replaceAll('<', '\\u003c');

export async function renderHomepage() {
  const source = withHomepageMetadata(await readFile(path.join(projectRoot, 'index.html'), 'utf8'));
  const artwork = await readFile(path.join(projectRoot, 'assets/system.svg'), 'utf8');
  return withSitePaths(source
    .replace('<div class="engagement-list" data-offer-list></div>', `<div class="engagement-list">${pricing.offers.map(offer => `<a class="engagement" href="${offerRoute(offer)}"><span class="engagement-type">${escapeHtml(pricing.groups.find(group => group.id === offer.group).title.toUpperCase())}</span><div><h3>${escapeHtml(offer.title)}</h3><p>${escapeHtml(offer.summary)}</p><span class="engagement-price">${escapeHtml(formatPrice(offer.price))}</span></div><span class="round-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`)
    .replace(/<img class="system-art"[^>]*alt="([^"]+)"[^>]*>/, (_, description) => artwork
      .replace('<svg ', '<svg class="system-art" role="img" aria-labelledby="system-art-title" focusable="false" ')
      .replace('>', `><title id="system-art-title">${description}</title>`))
    .replace(/data-collection-count="(notes|blog|papers)">[^<]*/g, (match, key) => `data-collection-count="${key}">${collections[key].entries.length}`));
}

async function chrome(activeCollection) {
  const homepage = await readFile(path.join(projectRoot, 'index.html'), 'utf8');
  let header = homepage.match(/    <header class="site-header[\s\S]*?<\/header>/)[0].replaceAll('href="#', 'href="/#');
  if (activeCollection) header = header.replace(`href="/${activeCollection}/"`, `href="/${activeCollection}/" aria-current="page"`);
  return { header, footer: homepage.match(/    <footer class="site-footer[\s\S]*?<\/footer>/)[0] };
}

function head({ title, description, route, type = 'website', schema, modules = [] }) {
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f3f5f7">
  <title>${escapeHtml(title)} — EML Systems</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${origin}${route}">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${escapeHtml(title)} — EML Systems">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${origin}${route}">
  <meta property="og:image" content="${origin}/assets/social-card.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="EML Systems — AI products, built for the real world.">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <script src="/theme.js"></script>
  <link rel="alternate" type="application/rss+xml" title="EML Systems Blog" href="/feed.xml">
  <script type="module" src="/main.js"></script>
  ${modules.map(src => `<script type="module" src="${src}"></script>`).join('\n  ')}
  <script type="application/ld+json">${safeJson(schema)}</script>
</head>`;
}

const tags = entry => `<ul class="publication-tags" aria-label="Topics">${(entry.tags || []).map(tag => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>`;

function visual(index) {
  const variants = [
    '<div class="diagram-circles"><i></i><i></i><i></i></div>',
    '<div class="chart-bars"><i></i><i></i><i></i><i></i><i></i></div>',
    '<div class="context-squares"><i></i><i></i><i></i></div>'
  ];
  const styles = ['visual-production', 'visual-measure', 'visual-context'];
  return `<div class="article-visual ${styles[index % 3]}" aria-hidden="true">${variants[index % 3]}<span class="visual-index">EML / PERSPECTIVES</span><span class="visual-annotation">PRODUCT · ENGINEERING · PEOPLE</span></div>`;
}

function publicationCard(entry, index, collection) {
  const search = [entry.title, entry.standfirst, entry.category, ...(entry.tags || [])].join(' ');
  if (collection === 'papers') return `<article class="paper-entry" data-publication data-category="${escapeHtml(entry.category)}" data-search="${escapeHtml(search)}">
    <div class="paper-entry-number"><span class="eyebrow">EML PAPER</span><span>${String(index + 1).padStart(2, '0')}</span><span class="mono">${escapeHtml(entry.readTime)}</span></div>
    <div class="paper-entry-copy"><p class="publication-category">${escapeHtml(entry.category)}</p><h2><a href="${entry.route}">${escapeHtml(entry.title)}</a></h2><p>${escapeHtml(entry.standfirst)}</p>${tags(entry)}<a class="text-link" href="${entry.route}">Read the full paper <span aria-hidden="true">↗</span></a></div>
  </article>`;
  if (collection === 'notes') return `<article class="note-entry" data-publication data-category="${escapeHtml(entry.category)}" data-search="${escapeHtml(search)}">
    <span class="note-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
    <div class="note-entry-copy"><p class="publication-category">${escapeHtml(entry.category)}</p><h2><a href="${entry.route}">${escapeHtml(entry.title)}</a></h2><p>${escapeHtml(entry.standfirst)}</p>${tags(entry)}</div>
    <div class="note-entry-aside"><span>${escapeHtml(entry.readTime.toUpperCase())}</span><a href="${entry.route}" class="round-arrow" aria-label="Read ${escapeHtml(entry.title)}">↗</a></div>
  </article>`;
  return `<article class="blog-entry${index === 0 ? ' is-featured' : ''}" data-publication data-category="${escapeHtml(entry.category)}" data-search="${escapeHtml(search)}">
    <a class="publication-cover" href="${entry.route}" aria-label="Read ${escapeHtml(entry.title)}">${visual(index)}</a>
    <div class="blog-entry-copy"><div class="publication-meta"><span>${escapeHtml(entry.category)}</span><span>${escapeHtml(entry.readTime.toUpperCase())}</span></div><h2><a href="${entry.route}">${escapeHtml(entry.title)}<span aria-hidden="true">↗</span></a></h2><p>${escapeHtml(entry.standfirst)}</p>${tags(entry)}${index === 0 ? `<a class="text-link" href="${entry.route}">Read the essay <span aria-hidden="true">↗</span></a>` : ''}</div>
  </article>`;
}

export async function renderCollection(key) {
  const collection = collections[key];
  if (!collection) throw new Error(`Unknown collection: ${key}`);
  const { header, footer } = await chrome(key);
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${collection.title} — EML Systems`, description: collection.description, url: `${origin}${collection.route}`, mainEntity: { '@type': 'ItemList', itemListElement: collection.entries.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, name: entry.title, url: `${origin}${entry.route}` })) } };
  const other = key === 'notes' ? collections.papers : collections.notes;
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: collection.title, description: collection.description, route: collection.route, schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="collection-page wrap" data-library="${key}" data-noun="${collection.noun}">
    <nav class="collection-switch" aria-label="Writing collections">${Object.entries(collections).map(([name, item]) => `<a href="${item.route}"${key === name ? ' aria-current="page"' : ''}>${item.title} <span>${item.entries.length}</span></a>`).join('')}</nav>
    <section class="collection-hero" aria-labelledby="collection-title"><div><p class="eyebrow"><span class="status-dot"></span>${collection.eyebrow}</p><h1 id="collection-title">${collection.headline}<br><em>${collection.emphasis}</em></h1><p class="collection-description">${collection.description}</p></div><div class="collection-annotation"><span class="collection-count">${String(collection.entries.length).padStart(2, '0')}<span aria-hidden="true">↗</span></span><p class="eyebrow">${collection.label}</p><p>${collection.context}</p>${key === 'blog' ? '<a class="text-link" href="/feed.xml">Follow via RSS <span aria-hidden="true">↗</span></a>' : '<span class="annotation-note">WRITTEN TO BE PUT TO WORK.</span>'}</div></section>
    <section class="library-section" aria-labelledby="library-title">
      <div class="library-heading"><h2 id="library-title">${collection.libraryTitle}</h2><p class="library-result" role="status" aria-live="polite" aria-atomic="true" data-result-count>${collection.entries.length} ${collection.noun}s</p></div>
      <div class="library-tools"><div class="topic-filters" role="group" aria-label="Filter by topic"><button type="button" class="topic-filter" data-filter="all" aria-pressed="true">All topics</button>${collection.categories.map(category => `<button type="button" class="topic-filter" data-filter="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)}</button>`).join('')}</div><form class="library-search" role="search"><label class="sr-only" for="library-query">Search ${collection.title.toLowerCase()} by title or topic</label><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input type="search" id="library-query" name="q" autocomplete="off" maxlength="200" placeholder="Search by title or topic"><button type="button" class="search-clear" data-clear-search aria-label="Clear search" hidden>×</button></form></div>
      <div class="${key === 'blog' ? 'blog-grid' : key === 'papers' ? 'papers-list' : 'notes-list'}" data-publication-list>${collection.entries.map((entry, index) => publicationCard(entry, index, key)).join('')}</div>
      <div class="library-empty" data-empty-state hidden><span class="empty-symbol" aria-hidden="true">∅</span><h3>No matches this time.</h3><p>Try a broader term or explore a different topic.</p><button class="button button-primary" type="button" data-reset-filters>Show all ${collection.noun}s <span aria-hidden="true">↗</span></button></div>
    </section>
    <aside class="collection-next"><div><p class="eyebrow">KEEP EXPLORING</p><h2>${key === 'notes' ? 'Follow the argument further.' : 'Put the reasoning to work.'}</h2><p>${key === 'notes' ? 'The papers develop the reasoning behind our methods, with worked cases, objections, and references.' : 'The technical notes turn ideas into methods, worked examples, and engineering decisions.'}</p></div><a class="button button-outline" href="${other.route}">Explore ${other.title.toLowerCase()} <span aria-hidden="true">↗</span></a></aside>
  </main>
${footer}
</body>
</html>\n`);
}

function sectionCitations(section, references) {
  if (!section.citations?.length) return '';
  return `<p class="section-citations">Supporting reading: ${section.citations.map(id => {
    const index = references.findIndex(reference => reference.id === id);
    if (index < 0) throw new Error(`Unknown reference: ${id}`);
    return `<a href="#reference-${index + 1}">[${index + 1}] ${escapeHtml(references[index].title)}</a>`;
  }).join(' · ')}</p>`;
}

function referenceUrl(reference) {
  const url = new URL(reference.url);
  if (url.protocol !== 'https:') throw new Error(`References must use HTTPS: ${reference.id}`);
  return escapeHtml(url.href);
}

function renderReferences(references = []) {
  if (!references.length) return '';
  return `<section class="paper-references" id="references" aria-labelledby="references-title"><p class="eyebrow">SOURCES & SCOPE</p><h2 id="references-title">References</h2><p>The annotations explain what each source supports. The argument and worked examples in this paper are EML Systems’ own synthesis.</p><ol>${references.map((reference, index) => `<li id="reference-${index + 1}"><a href="${referenceUrl(reference)}" target="_blank" rel="noopener noreferrer">${escapeHtml(reference.title)} <span aria-hidden="true">↗</span></a><p>${escapeHtml(reference.note)}</p></li>`).join('')}</ol></section>`;
}

function renderSection(section, index, references = []) {
  return `<section id="section-${index + 1}"><h2>${escapeHtml(section.heading)}</h2>${(section.text || []).map(text => `<p>${escapeHtml(text)}</p>`).join('')}${section.table ? renderWorkTable(section.table) : ''}${(section.after || []).map(text => `<p>${escapeHtml(text)}</p>`).join('')}${section.bullets?.length ? `<ul>${section.bullets.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : ''}${section.code ? `<figure class="code-example"><figcaption>${escapeHtml(section.codeLanguage || 'EXAMPLE')}</figcaption><pre tabindex="0" aria-label="${escapeHtml(section.heading)} example"><code>${escapeHtml(section.code)}</code></pre></figure>` : ''}${sectionCitations(section, references)}</section>`;
}

function renderWorkTable(table) {
  if (table.rows.some(row => row.length !== table.columns.length)) throw new Error(`Inconsistent table columns: ${table.caption}`);
  return `<figure class="work-table-figure"><figcaption>${escapeHtml(table.caption)}<span class="work-table-hint">Scroll the table horizontally <span aria-hidden="true">↔</span></span></figcaption><div class="work-table-scroll" role="region" tabindex="0" aria-label="${escapeHtml(table.caption)}"><table class="work-table"><caption class="sr-only">${escapeHtml(table.caption)}</caption><thead><tr>${table.columns.map(column => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></figure>`;
}

const journeyRoute = journey => `${workingTogether.route}#${journey.id}`;
const enquiryHref = topic => `/contact/?topic=${encodeURIComponent(topic)}`;

// Resolve editorial references before rendering so a JSON edit cannot publish a broken path.
for (const offer of pricing.offers) {
  for (const id of offer.journeyIds) {
    if (!workingTogether.journeys.some(journey => journey.id === id)) throw new Error(`Pricing catalogue: ${offer.id} references unknown journey ${id}`);
  }
}

function priceBlock(price) {
  const rateLabel = ['hour', 'day'].includes(price.unit) ? `${price.unit === 'hour' ? 'HOURLY' : 'DAILY'} RATE` : 'FEE';
  const label = price.model === 'indicative' ? `INDICATIVE ${rateLabel}` : price.model === 'quote' ? 'ENGAGEMENT FEE' : price.model === 'range' ? 'INDICATIVE FEE RANGE' : price.model === 'from' ? 'STARTING FEE' : rateLabel;
  return `<div class="offer-fee"><p class="eyebrow">${label}</p><p class="offer-price">${escapeHtml(formatPrice(price))}</p><p class="offer-price-note">${escapeHtml(price.note)}</p></div>`;
}

function engagementFormat(format, index) {
  return `<article><span class="mono">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(format.title)}</h3><p>${escapeHtml(format.text)}</p><p class="engagement-price">${escapeHtml(formatPrice(format.price))}</p><a class="text-link" href="${offerRoute(format)}">Scope & pricing <span aria-hidden="true">↗</span></a></article>`;
}

export async function renderPricing() {
  const page = pricing.page;
  const { header, footer } = await chrome('pricing');
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: page.title, description: page.description, url: `${origin}${pricingRoute}`, mainEntity: { '@type': 'ItemList', itemListElement: pricing.offers.map((offer, index) => ({ '@type': 'ListItem', position: index + 1, name: offer.title, url: `${origin}${offerRoute(offer)}` })) } };
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: page.title, description: page.description, route: pricingRoute, schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="pricing-page wrap">
    <header class="pricing-hero"><p class="eyebrow"><span class="status-dot"></span>ENGAGEMENTS & PRICING</p><div class="pricing-hero-grid"><h1>${escapeHtml(page.headline)}<br><em>${escapeHtml(page.emphasis)}</em></h1><div><p>${escapeHtml(page.intro)}</p><a class="text-link" href="/working-together/">Start with your situation <span aria-hidden="true">↗</span></a></div></div></header>
    <nav class="problem-page-nav" aria-label="Pricing page sections">${pricing.groups.map(group => `<a href="#pricing-${group.id}">${escapeHtml(group.title)}</a>`).join('')}<a href="#agreeing-the-work">Agreeing the work</a></nav>
    <div class="pricing-groups">${pricing.groups.map(group => `<section class="pricing-group" id="pricing-${group.id}" aria-labelledby="pricing-${group.id}-title"><header><h2 id="pricing-${group.id}-title">${escapeHtml(group.title)}</h2><p>${escapeHtml(group.description)}</p></header>${pricing.offers.filter(offer => offer.group === group.id).map(offer => `<article class="offer-card"><h3><a href="${offerRoute(offer)}">${escapeHtml(offer.title)}</a></h3><p class="offer-summary">${escapeHtml(offer.summary)}</p>${priceBlock(offer.price)}<div class="offer-card-result"><p class="eyebrow">WHAT YOU LEAVE WITH</p><p>${escapeHtml(offer.outcome)}</p></div><a class="text-link" href="${offerRoute(offer)}">Scope, deliverables & fee <span aria-hidden="true">↗</span></a></article>`).join('')}</section>`).join('')}</div>
    <section class="pricing-terms" id="agreeing-the-work" aria-labelledby="pricing-terms-title"><p class="eyebrow">BEFORE THE WORK STARTS</p><h2 id="pricing-terms-title">A shared understanding.<br><em>An explicit agreement.</em></h2><div>${pricing.commercialNotes.map(note => `<section><h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.text)}</p></section>`).join('')}</div></section>
    <section class="working-contact" aria-labelledby="pricing-contact-title"><div><p class="eyebrow">FIND A USEFUL STARTING POINT</p><h2 id="pricing-contact-title">What needs<br><em>to change?</em></h2><p>Tell us the decision, the relevant context, and the constraints. We can establish the work needed and propose a scope and fee.</p></div><div><a class="button button-primary" href="${enquiryHref('Engagement scope and fee')}">Discuss an engagement <span aria-hidden="true">↗</span></a><a class="working-email" href="mailto:hello@eml.systems">hello@eml.systems</a></div></section>
  </main>
${footer}
</body>
</html>\n`);
}

export async function renderOffer(offer) {
  const { header, footer } = await chrome('pricing');
  const group = pricing.groups.find(group => group.id === offer.group);
  const bulletList = values => `<ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;
  const schema = { '@context': 'https://schema.org', '@type': 'Service', name: offer.title, description: offer.summary, url: `${origin}${offerRoute(offer)}`, serviceType: group.title, provider: { '@type': 'Organization', name: 'EML Systems', url: `${origin}/` } };
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: offer.title, description: offer.summary, route: offerRoute(offer), schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="pricing-page offer-page wrap">
    <nav class="reading-breadcrumb" aria-label="Breadcrumb"><a href="/">EML Systems</a><span aria-hidden="true">/</span><a href="${pricingRoute}">Engagements & pricing</a><span aria-hidden="true">/</span><span>${escapeHtml(group.title)}</span></nav>
    <header class="pricing-hero"><p class="eyebrow">${escapeHtml(group.title)}</p><div class="pricing-hero-grid"><div><h1>${escapeHtml(offer.title)}</h1><p class="offer-standfirst">${escapeHtml(offer.summary)}</p></div><aside class="offer-fee-panel" aria-label="Engagement pricing">${priceBlock(offer.price)}<a class="button button-primary" href="${enquiryHref(`${offer.title}: scope and fee`)}">Discuss this engagement <span aria-hidden="true">↗</span></a></aside></div></header>
    <div class="offer-detail-layout"><div class="offer-detail-body"><section aria-labelledby="offer-fit"><p class="eyebrow">THE SITUATION</p><h2 id="offer-fit">When this is useful</h2><p>${escapeHtml(offer.bestFor)}</p></section><section class="offer-outcome" aria-labelledby="offer-outcome"><p class="eyebrow">THE RESULT</p><h2 id="offer-outcome">What you leave with</h2><p>${escapeHtml(offer.outcome)}</p></section><section aria-labelledby="offer-includes"><h2 id="offer-includes">What the work includes</h2>${bulletList(offer.includes)}</section><section aria-labelledby="offer-excludes"><h2 id="offer-excludes">Scope boundaries</h2>${bulletList(offer.excludes)}</section><section aria-labelledby="offer-inputs"><h2 id="offer-inputs">What you contribute</h2>${bulletList(offer.clientInputs)}</section><section aria-labelledby="offer-completion"><h2 id="offer-completion">How we assess completion</h2><p>${escapeHtml(offer.completion)}</p></section></div><aside class="offer-context"><p class="eyebrow">CONNECT THE OFFER TO THE WORK</p><h2>Your starting point</h2>${offer.journeyIds.map(id => { const journey = workingTogether.journeys.find(journey => journey.id === id); return `<a href="${journeyRoute(journey)}">${escapeHtml(journey.title)} <span aria-hidden="true">↗</span></a>`; }).join('')}<p>The starting point explains the decision, evidence, and next action. The engagement defines the support around it.</p><a class="text-link" href="${pricingRoute}">Compare engagements <span aria-hidden="true">←</span></a></aside></div>
    <section class="pricing-terms" aria-labelledby="offer-terms-title"><p class="eyebrow">AGREEING THE WORK</p><h2 id="offer-terms-title">Clear before we start.</h2><div>${pricing.commercialNotes.map(note => `<section><h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.text)}</p></section>`).join('')}</div><a class="text-link" href="${enquiryHref(`${offer.title}: scope and fee`)}">Talk through the scope and fee <span aria-hidden="true">↗</span></a></section>
  </main>
${footer}
</body>
</html>\n`);
}

function exampleCard(example, index) {
  return `<article class="work-example-card"><div class="example-card-top"><span class="mono">EXAMPLE / 0${index + 1}</span><span class="example-label">SYNTHETIC SCENARIO</span></div><p class="eyebrow">${escapeHtml(example.type)}</p><h3><a href="${example.route}">${escapeHtml(example.title)}<span aria-hidden="true">↗</span></a></h3><p>${escapeHtml(example.standfirst)}</p><div class="example-card-bottom"><span>QUESTION → EVIDENCE → DECISION</span><a class="text-link" href="${example.route}">Read the complete example <span aria-hidden="true">↗</span></a></div></article>`;
}

export async function renderWorkingTogether() {
  const page = workingTogether;
  const { header, footer } = await chrome('working-together');
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: `${origin}${page.route}` };
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: page.title, description: page.description, route: page.route, schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="working-page wrap">
    <header class="working-hero"><p class="eyebrow"><span class="status-dot"></span>WORKING WITH EML SYSTEMS</p><div class="working-hero-grid"><h1>${escapeHtml(page.headline)}<br><em>${escapeHtml(page.emphasis)}</em></h1><div><p>${escapeHtml(page.intro)}</p><a class="text-link" href="#work-products">See what the work looks like <span aria-hidden="true">↓</span></a></div></div><nav class="journey-picker" aria-label="Choose a starting point">${page.journeys.map((journey, index) => `<a href="#${journey.id}"><span class="mono">0${index + 1} / ${journey.label}</span><h2>${escapeHtml(journey.title)}</h2><p>${escapeHtml(journey.summary)}</p><span class="text-link">Explore this starting point <span aria-hidden="true">↓</span></span></a>`).join('')}</nav></header>
    <nav class="problem-page-nav" aria-label="Working together page sections"><a href="#starting-points">Your starting point</a><a href="#work-products">Example work products</a><a href="#engagement-formats">Ways to work together</a><a href="#next-step">Start a conversation</a></nav>
    <section class="working-section" id="starting-points" aria-labelledby="starting-points-title"><div class="section-heading"><div><p class="eyebrow section-kicker">01 / START WITH YOUR SITUATION</p><h2 id="starting-points-title">A question to resolve.<br><em>A result you can use.</em></h2></div><p class="section-intro">Each starting point can lead to assessment, implementation, or advisory work. The scope follows the decision and the evidence already available.</p></div>
      ${page.journeys.map((journey, index) => `<article class="journey-detail" id="${journey.id}"><header><p class="eyebrow">STARTING POINT / 0${index + 1}</p><h3>${escapeHtml(journey.title)}</h3><p class="journey-question">${escapeHtml(journey.question)}</p><a class="text-link" href="${enquiryHref(journey.enquiry)}">Discuss this starting point <span aria-hidden="true">↗</span></a></header><div class="journey-body"><p>${escapeHtml(journey.motivation)}</p><dl><div><dt>The work</dt><dd>${escapeHtml(journey.work)}</dd></div><div><dt>What you contribute</dt><dd>${escapeHtml(journey.inputs)}</dd></div><div class="journey-outputs"><dt>What you receive</dt><dd><ul>${journey.outputs.map(output => `<li>${escapeHtml(output)}</li>`).join('')}</ul></dd></div><div><dt>Scope and boundaries</dt><dd>${escapeHtml(journey.boundary)}</dd></div><div><dt>How we assess completion</dt><dd>${escapeHtml(journey.completion)}</dd></div><div><dt>Your next decision</dt><dd>${escapeHtml(journey.next)}</dd></div></dl><div class="journey-example-links"><span class="eyebrow">SEE THE REASONING IN PRACTICE</span>${journey.exampleSlugs.map(slug => { const example = workProducts.find(item => item.slug === slug); if (!example) throw new Error(`Unknown work product: ${slug}`); return `<a class="text-link" href="${example.route}">${escapeHtml(example.title)} <span aria-hidden="true">↗</span></a>`; }).join('')}</div></div></article>`).join('')}
    </section>
    <section class="working-section working-examples" id="work-products" aria-labelledby="work-products-title"><div class="section-heading"><div><p class="eyebrow section-kicker">02 / OPEN THE WORK PRODUCT</p><h2 id="work-products-title">What does useful<br><em>work look like?</em></h2></div><p class="section-intro">Read the question, evidence, alternatives, and recommendation in full. These synthetic examples show the method and its limits.</p></div><div class="work-example-grid">${workProducts.map(exampleCard).join('')}</div></section>
    <section class="working-section working-formats" id="engagement-formats" aria-labelledby="formats-title"><div class="section-heading"><div><p class="eyebrow section-kicker">03 / SHAPE THE SUPPORT TO THE WORK</p><h2 id="formats-title">The right involvement.<br><em>Clear responsibilities.</em></h2></div><p class="section-intro">We agree on the question, outputs, scope, responsibilities, and commercial terms before starting. Changes to the commitment are reviewed together.</p></div><div class="working-format-grid">${page.formats.map(engagementFormat).join('')}</div><aside class="working-stop"><span class="sidebar-cross" aria-hidden="true">+</span><div><h3>A useful place to stop.</h3><p>An assessment should leave your team with a decision and usable reasoning. You can implement internally, narrow the ambition, or stop an approach. Known implementation work can begin directly; ongoing advisory is useful when recurring decisions warrant it.</p><a class="text-link" href="/problems/#why-act">Establish the case for acting <span aria-hidden="true">↗</span></a></div></aside></section>
    <section class="working-contact" id="next-step" aria-labelledby="next-step-title"><div><p class="eyebrow">A GOOD FIRST CONVERSATION</p><h2 id="next-step-title">Bring the decision.<br><em>And what you know.</em></h2><p>Tell us which decision you face, what you have observed, and what you would like to change. A representative case is often a useful starting point.</p></div><div><a class="button button-primary" href="${enquiryHref('A useful next step')}">Start a conversation <span aria-hidden="true">↗</span></a><a class="working-email" href="mailto:hello@eml.systems">hello@eml.systems</a><p>Share a short brief or email us directly.</p></div></section>
  </main>
${footer}
</body>
</html>\n`);
}

export async function renderWorkProduct(example) {
  const journey = workingTogether.journeys.find(item => item.id === example.journeyId);
  const problem = clientProblems.problems.find(item => item.id === example.problemId);
  if (!journey || !problem) throw new Error(`Unknown work product context: ${example.slug}`);
  const index = workProducts.findIndex(item => item.slug === example.slug);
  const other = workProducts.find(item => item.slug !== example.slug);
  const { header, footer } = await chrome('working-together');
  const schema = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: example.title, description: example.description, url: `${origin}${example.route}`, articleSection: 'Illustrative work products', author: { '@type': 'Organization', name: 'EML Systems', url: `${origin}/` } };
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: `Illustrative work product: ${example.title}`, description: example.description, route: example.route, type: 'article', schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="wrap reading-page example-page">
    <nav class="reading-breadcrumb" aria-label="Breadcrumb"><a href="/">EML Systems</a><span aria-hidden="true">/</span><a href="${workingTogether.route}#work-products">Example work products</a></nav>
    <article class="reading-article"><header class="reading-heading"><p class="eyebrow">ILLUSTRATIVE WORK PRODUCT / 0${index + 1} &nbsp; · &nbsp; ${escapeHtml(example.type)}</p><h1>${escapeHtml(example.title)}</h1><p class="article-standfirst">${escapeHtml(example.standfirst)}</p></header>
      <aside class="example-notice" aria-label="Status of this example"><span class="example-label">SYNTHETIC EXAMPLE</span><p>${escapeHtml(example.notice)}</p></aside>
      <section class="example-decision" aria-labelledby="example-decision-title"><div><p class="eyebrow">THE DECISION IN BRIEF</p><h2 id="example-decision-title">A question.<br><em>A supported next step.</em></h2><button type="button" class="text-link" data-print-article hidden>Print / save as PDF <span aria-hidden="true">↗</span></button></div><dl><div><dt>Decision</dt><dd>${escapeHtml(example.question)}</dd></div><div><dt>Recommendation in this scenario</dt><dd>${escapeHtml(example.recommendation)}</dd></div><div><dt>Accountability</dt><dd>${escapeHtml(example.owner)}</dd></div></dl></section>
      <div class="reading-layout"><div class="article-body">${example.sections.map((section, sectionIndex) => renderSection(section, sectionIndex)).join('')}</div><aside class="reading-sidebar"><nav aria-label="On this page"><p class="eyebrow">INSIDE THE WORK PRODUCT</p><ol>${example.sections.map((section, sectionIndex) => `<li><a href="#section-${sectionIndex + 1}">${escapeHtml(section.heading.replace(/^\d+\.\s*/, ''))}</a></li>`).join('')}</ol></nav><div class="sidebar-context"><span class="sidebar-cross" aria-hidden="true">+</span><p>A complete teaching example. Adapt the questions and evidence to your own system.</p><a href="${journeyRoute(journey)}">${escapeHtml(journey.title)} <span aria-hidden="true">↗</span></a></div></aside></div>
      <div class="reading-end"><aside class="article-cta"><p class="eyebrow">APPLY THE METHOD TO YOUR SITUATION</p><h2>${escapeHtml(journey.title)}</h2><p>${escapeHtml(journey.summary)}</p><a class="button button-primary" href="${journeyRoute(journey)}">See the work and what you receive <span aria-hidden="true">↗</span></a></aside><nav class="related-writing" aria-label="Methods behind this example"><p>THE METHODS BEHIND THIS EXAMPLE</p>${example.reading.map(route => { const entry = publications.find(item => item.route === route); if (!entry) throw new Error(`Unknown work product reading: ${route}`); return `<a href="${route}"><span><small>${entry.collection === 'papers' ? 'PAPER' : entry.collection === 'notes' ? 'TECHNICAL NOTE' : 'BLOG'}</small>${escapeHtml(entry.title)}</span><span aria-hidden="true">↗</span></a>`; }).join('')}<a href="/problems/#${problem.id}"><span><small>CLIENT SITUATION</small>${escapeHtml(problem.title)}</span><span aria-hidden="true">↗</span></a></nav><a class="text-link" href="${other.route}">Read the other illustrative work product <span aria-hidden="true">↗</span></a><a class="article-back reading-back" href="${workingTogether.route}#work-products"><span aria-hidden="true">←</span> Back to working together</a></div>
    </article>
  </main>
${footer}
</body>
</html>\n`);
}

function renderNoteAnswer(practical) {
  return `<section class="note-quick-start" id="quick-answer" aria-labelledby="quick-answer-title"><div><p class="eyebrow">THE PRACTICAL ANSWER</p><h2 id="quick-answer-title">${escapeHtml(practical.question)}</h2><p>${escapeHtml(practical.answer)}</p></div><div class="note-use-when"><h3>When to use this</h3><p>${escapeHtml(practical.useWhen)}</p><a class="text-link" href="#working-record">Use the checklist and record <span aria-hidden="true">↓</span></a><button type="button" class="text-link note-print" data-print-article hidden>Print / save as PDF <span aria-hidden="true">↗</span></button></div></section>`;
}

function renderNotePractice(practical) {
  return `<section class="note-practice" id="working-record" aria-labelledby="working-record-title"><p class="eyebrow">PUT THIS NOTE TO WORK</p><h2 id="working-record-title">${escapeHtml(practical.title)}</h2><p class="practice-intro">${escapeHtml(practical.intro)}</p><ol class="practice-checks">${practical.checks.map(check => `<li>${escapeHtml(check)}</li>`).join('')}</ol><details class="working-record"><summary><span>Open the copyable working record</span><span class="rationale-toggle" aria-hidden="true"></span></summary><div class="working-record-body"><p>Copy this blank record into your project and fill it with your own evidence. Keep links to the underlying work.</p><div class="record-toolbar"><button type="button" class="button button-outline" data-copy-record="working-record-text" aria-describedby="record-copy-status" hidden>Copy working record <span aria-hidden="true">↗</span></button><span id="record-copy-status" class="record-copy-status" role="status" aria-live="polite"></span></div><pre id="working-record-text" tabindex="0" aria-label="${escapeHtml(practical.title)} template"><code>${escapeHtml(practical.record)}</code></pre></div></details><div class="practice-outcome"><h3>What you should leave with</h3><p>${escapeHtml(practical.completion)}</p></div><p class="practice-limit">${escapeHtml(practical.limit)}</p></section>`;
}

function renderReaderNextStep(content, path) {
  const mailto = `mailto:hello@eml.systems?subject=${encodeURIComponent(`A question about: ${content.title}`)}`;
  if (!path) return `<aside class="article-cta"><h2>Working through a similar question?</h2><p>Let’s connect the product, the engineering, and the evidence.</p><a class="button button-primary" href="${mailto}">Start a conversation <span aria-hidden="true">↗</span></a></aside>`;
  return `<aside class="article-cta reader-next-step" aria-labelledby="reader-next-step-title"><p class="eyebrow">FROM THE ARTICLE TO YOUR NEXT DECISION</p><h2 id="reader-next-step-title">${escapeHtml(path.heading)}</h2><p>${escapeHtml(path.text)}</p><div class="reader-context-links"><a href="/problems/#${path.problem.id}"><span class="eyebrow">RECOGNIZE THIS SITUATION?</span><strong>${escapeHtml(path.problem.title)}</strong><span class="reader-route-arrow" aria-hidden="true">↗</span></a><a href="${path.example.route}"><span class="eyebrow">ILLUSTRATIVE WORK PRODUCT</span><strong>${escapeHtml(path.example.title)}</strong><p>${escapeHtml(path.exampleContext)}</p><span class="reader-route-arrow" aria-hidden="true">↗</span></a></div><div class="reader-engagement"><p><span class="eyebrow">A USEFUL STARTING POINT</span><strong>${escapeHtml(path.journey.title)}</strong></p><a class="button button-primary" href="${journeyRoute(path.journey)}">See scope and deliverables <span aria-hidden="true">↗</span></a></div><a class="text-link reader-enquiry" href="${mailto}">Discuss this question <span aria-hidden="true">↗</span></a></aside>`;
}

export async function renderArticle(article) {
  const entry = publications.find(item => item.slug === article.slug) || { ...article, collection: 'blog', route: `/writing/${article.slug}/` };
  const content = { ...entry, ...article, collection: entry.collection, route: entry.route };
  const collection = collections[content.collection];
  const isNote = content.collection === 'notes';
  const isPaper = content.collection === 'papers';
  const practical = isNote ? content.practical : null;
  const readerPath = readerPathFor(content.slug);
  if (!readerPath && publications.some(item => item.slug === content.slug)) throw new Error(`Missing reader path: ${content.slug}`);
  if (isNote && !practical) throw new Error(`Missing practical reference: ${content.slug}`);
  const label = isPaper ? 'TECHNICAL POSITION PAPER' : isNote ? 'TECHNICAL NOTE' : 'FROM THE BLOG';
  const referenceList = content.references || [];
  const { header, footer } = await chrome(content.collection);
  const pageUrl = `${origin}${content.route}`;
  const schema = { '@context': 'https://schema.org', '@type': isNote || isPaper ? 'TechArticle' : 'BlogPosting', headline: content.title, description: content.standfirst, url: pageUrl, author: { '@type': 'Person', name: 'Valery', url: 'https://valery.tech/' }, publisher: { '@type': 'Organization', name: 'EML Systems', url: `${origin}/` }, ...(referenceList.length ? { citation: referenceList.map(reference => ({ '@type': 'CreativeWork', name: reference.title, url: reference.url })) } : {}) };
  const related = relatedPublications(content);
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: content.title, description: content.standfirst, route: content.route, type: 'article', schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="wrap reading-page">
    <nav class="reading-breadcrumb" aria-label="Breadcrumb"><a href="/">EML Systems</a><span aria-hidden="true">/</span><a href="${collection.route}">${collection.title}</a><span aria-hidden="true">/</span><span>${escapeHtml(content.category)}</span></nav>
    <article class="reading-article">
      <header class="reading-heading"><p class="eyebrow">${label} &nbsp; / &nbsp; ${escapeHtml(content.readTime.toUpperCase())}</p><h1>${escapeHtml(content.title)}</h1><p class="article-standfirst">${escapeHtml(content.standfirst)}</p><div class="reading-byline"><span>VALERY · PRINCIPAL, EML SYSTEMS</span>${tags(content)}</div></header>
      ${content.abstract ? `<div class="paper-abstract"><p class="eyebrow">ABSTRACT</p><p>${escapeHtml(content.abstract)}</p>${content.thesis ? `<p class="paper-thesis"><strong>The central argument</strong>${escapeHtml(content.thesis)}</p>` : ''}${content.methodNote ? `<p class="paper-method">${escapeHtml(content.methodNote)}</p>` : ''}<button type="button" class="text-link" data-print-article hidden>Print / save as PDF <span aria-hidden="true">↗</span></button></div>` : ''}
      ${practical ? renderNoteAnswer(practical) : ''}
      <div class="reading-layout"><div class="article-body">${content.sections.map((section, index) => renderSection(section, index, referenceList)).join('')}</div><aside class="reading-sidebar"><nav aria-label="On this page"><p class="eyebrow">${isPaper ? 'IN THIS PAPER' : isNote ? 'IN THIS NOTE' : 'IN THIS ESSAY'}</p><ol>${practical ? '<li><a href="#quick-answer">The practical answer</a></li>' : ''}${content.sections.map((section, index) => `<li><a href="#section-${index + 1}">${escapeHtml(section.heading.replace(/^\d+\.\s*/, ''))}</a></li>`).join('')}${practical ? '<li><a href="#working-record">Checklist & working record</a></li>' : ''}${referenceList.length ? '<li><a href="#references">References & scope</a></li>' : ''}<li><a href="#next-decision">Apply this to your situation</a></li></ol></nav><div class="sidebar-context"><span class="sidebar-cross" aria-hidden="true">+</span><p>${isNote ? 'A practical working reference. Apply it to your context and revise it as the evidence changes.' : 'Ideas from our working notes on AI products, engineering, and the systems around them.'}</p><a href="${collection.route}">Explore ${isPaper ? 'all papers' : isNote ? 'all technical notes' : 'the blog'} <span aria-hidden="true">↗</span></a></div></aside></div>
      <div class="reading-end">${practical ? renderNotePractice(practical) : ''}${renderReferences(referenceList)}<p class="article-sources">Adapted from our working notes on AI products and engineering. Explore the broader body of work at <a href="https://valery.tech/" target="_blank" rel="noopener noreferrer">valery.tech ↗</a>.</p><div id="next-decision">${renderReaderNextStep(content, readerPath)}</div><nav class="related-writing" aria-label="Related reading"><p>READ NEXT</p>${related.map(item => `<a href="${item.route}"><span><small>${item.collection === 'papers' ? 'PAPER' : item.collection === 'notes' ? 'TECHNICAL NOTE' : 'BLOG'}</small>${escapeHtml(item.title)}</span><span aria-hidden="true">↗</span></a>`).join('')}</nav><a class="article-back reading-back" href="${collection.route}"><span aria-hidden="true">←</span> Back to ${collection.title.toLowerCase()}</a></div>
    </article>
  </main>
${footer}
</body>
</html>\n`);
}

export async function renderWriting(outputDirectory) {
  for (const page of servicePages) {
    const directory = path.join(outputDirectory, page.route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), await page.render());
  }
  for (const collection of Object.keys(collections)) {
    const directory = path.join(outputDirectory, collection);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), await renderCollection(collection));
  }
  for (const entry of publications) {
    const directory = path.join(outputDirectory, entry.route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), await renderArticle(entry));
  }
}

function renderClientRationale() {
  const rationale = clientRationale;
  return `<section class="client-rationale" id="why-act" aria-labelledby="rationale-title">
    <div class="rationale-heading"><p class="eyebrow">THE CLIENT’S CASE FOR ACTING</p><h2 id="rationale-title">${escapeHtml(rationale.title)}</h2><p>${escapeHtml(rationale.summary)}</p></div>
    <div class="rationale-criteria">${rationale.criteria.map((criterion, index) => `<div><span class="mono">0${index + 1}</span><h3>${escapeHtml(criterion.title)}</h3><p>${escapeHtml(criterion.text)}</p></div>`).join('')}</div>
    <div class="rationale-validation"><h3>${escapeHtml(rationale.validation.title)}</h3><p>${escapeHtml(rationale.validation.text)}</p></div>
    <div class="rationale-situations">${rationale.situations.map((situation, index) => {
      const problem = clientProblems.problems.find(item => item.id === situation.problemId);
      if (!problem) throw new Error(`Unknown client rationale: ${situation.problemId}`);
      return `<details class="rationale-case"${index === 0 ? ' open' : ''}><summary><span class="mono">0${index + 1}</span><span><strong>${escapeHtml(problem.title)}</strong><span class="rationale-role">${escapeHtml(situation.role)}</span></span><span class="rationale-toggle" aria-hidden="true"></span></summary><div class="rationale-case-body"><dl><div><dt>What is at stake</dt><dd>${escapeHtml(situation.stakes)}</dd></div><div><dt>Evidence to establish the problem</dt><dd>${escapeHtml(situation.evidence)}</dd></div><div><dt>What improvement would mean</dt><dd>${escapeHtml(situation.value)}</dd></div></dl><a class="text-link" href="#${escapeHtml(problem.id)}">Explore the diagnosis and possible work <span aria-hidden="true">↓</span></a></div></details>`;
    }).join('')}</div>
    <aside class="rationale-help" aria-labelledby="outside-help-title"><div><p class="eyebrow">WHEN AN ENGAGEMENT EARNS ITS PLACE</p><h3 id="outside-help-title">${escapeHtml(rationale.help.title)}</h3><p>${escapeHtml(rationale.help.intro)}</p></div><div><ul>${rationale.help.conditions.map(condition => `<li>${escapeHtml(condition)}</li>`).join('')}</ul><p class="rationale-alternative">${escapeHtml(rationale.help.alternative)}</p></div></aside>
  </section>`;
}

export async function renderProblems() {
  const page = clientProblems;
  const { header, footer } = await chrome('problems');
  const paragraphs = values => values.map(value => `<p>${escapeHtml(value)}</p>`).join('');
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: `${origin}/problems/` };
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: page.title, description: page.description, route: '/problems/', schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="problems-page wrap">
    <header class="problems-hero"><p class="eyebrow"><span class="status-dot"></span>WHY TEAMS COME TO EML</p><h1>${escapeHtml(page.headline)}<br><em>${escapeHtml(page.emphasis)}</em></h1><div class="problems-intro">${paragraphs(page.intro)}</div></header>
    <nav class="problem-page-nav" aria-label="Client problems page sections"><a href="#why-act">The case for acting</a><a href="#client-situations">Your situation</a><a href="#why-eml">Why EML</a><a href="#working-together">Working together</a></nav>
    ${renderClientRationale()}
    <nav class="problem-map" id="client-situations" aria-label="Find your situation"><p class="eyebrow">START WITH THE SITUATION YOU RECOGNIZE</p><ol>${page.problems.map((problem, index) => `<li><a href="#${escapeHtml(problem.id)}"><span class="mono">0${index + 1}</span><span>${escapeHtml(problem.title)}</span><span aria-hidden="true">↓</span></a></li>`).join('')}</ol></nav>
    <div class="problem-cases">${page.problems.map((problem, index) => `<article class="problem-case" id="${escapeHtml(problem.id)}"><header><p class="eyebrow">SITUATION / 0${index + 1}</p><h2>${escapeHtml(problem.title)}</h2><p class="problem-trigger">${escapeHtml(problem.trigger)}</p><a class="text-link" href="mailto:hello@eml.systems?subject=${encodeURIComponent(`Let's discuss: ${problem.title}`)}">Discuss this situation <span aria-hidden="true">↗</span></a><a class="text-link problem-starting-point" href="${journeyRoute(journeyForProblem(problem.id))}">See the work and what you receive <span aria-hidden="true">↗</span></a></header><div class="problem-detail"><section><h3>Why this matters to you</h3><p>${escapeHtml(problem.motivation)}</p></section><section><h3>What may be underneath</h3>${paragraphs(problem.diagnosis)}</section><section class="problem-questions"><h3>Questions worth answering first</h3><ul>${problem.questions.map(question => `<li>${escapeHtml(question)}</li>`).join('')}</ul></section><section><h3>What we work on together</h3><ul>${problem.work.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section class="problem-outcome"><h3>The decision this should unlock</h3><p>${escapeHtml(problem.outcome)}</p></section><nav class="problem-reading" aria-label="Supporting reading for ${escapeHtml(problem.title)}"><p class="eyebrow">THE REASONING & METHODS</p>${problem.reading.map(route => {
    const entry = publications.find(item => item.route === route);
    if (!entry) throw new Error(`Unknown problem reading route: ${route}`);
    return `<a href="${entry.route}">${escapeHtml(entry.title)} <span aria-hidden="true">↗</span></a>`;
  }).join('')}</nav></div></article>`).join('')}</div>
    <section class="practice-motivation" id="why-eml" aria-labelledby="motivation-title"><div><p class="eyebrow">THE MOTIVATION BEHIND OUR PRACTICE</p><h2 id="motivation-title">${escapeHtml(page.motivation.heading)}</h2></div><div>${paragraphs(page.motivation.text)}</div></section>
    <section class="problem-engagement" id="working-together" aria-labelledby="engagement-title"><p class="eyebrow">FROM RECOGNITION TO A USEFUL NEXT STEP</p><h2 id="engagement-title">${escapeHtml(page.engagement.heading)}</h2><div class="engagement-intro">${paragraphs(page.engagement.text)}</div><ol>${page.engagement.steps.map(step => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></li>`).join('')}</ol><a class="button button-primary" href="${workingTogether.route}">Explore starting points and example work <span aria-hidden="true">↗</span></a></section>
  </main>
${footer}
</body>
</html>\n`);
}

export async function renderContact() {
  const { header, footer } = await chrome('contact');
  const description = 'Talk with Valery about AI product direction, architecture, and engineering. Share your situation and find a useful next step with EML Systems.';
  const schema = { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact EML Systems', description, url: `${origin}/contact/`, mainEntity: { '@type': 'Organization', name: 'EML Systems', email: 'hello@eml.systems', url: `${origin}/` } };
  return withSitePaths(`<!doctype html>
<html lang="en">
${head({ title: 'Contact', description, route: '/contact/', schema, modules: ['/contact.js'] })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="contact-page wrap">
    <header class="contact-hero">
      <div><p class="eyebrow"><span class="status-dot"></span>LET’S FIND A USEFUL NEXT STEP</p><h1>Bring the question.<br><em>We’ll work from there.</em></h1><p>A product to shape, a system to build, or something that isn’t working. Tell us where you are and what you want to change.</p><div class="contact-hero-actions"><a class="button button-primary" href="#brief">Tell us about your project <span aria-hidden="true">↓</span></a><a class="text-link" href="#team">Who you’ll work with <span aria-hidden="true">↓</span></a></div></div>
      <aside class="contact-first-step" aria-label="How a conversation starts"><p class="eyebrow">FROM FIRST CONTACT TO CLEAR SCOPE</p><ol><li><span>01</span><div><h2>Share your context</h2><p>A few sentences are enough to begin.</p></div></li><li><span>02</span><div><h2>Talk it through</h2><p>Clarify the question, constraints, and fit.</p></div></li><li><span>03</span><div><h2>Agree a next step</h2><p>Define the work, deliverables, and fee before starting.</p></div></li></ol></aside>
    </header>

    <section class="contact-intake" id="brief" aria-labelledby="brief-title">
      <div class="contact-section-heading"><p class="eyebrow">START A CONVERSATION</p><h2 id="brief-title">A little context.<br><em>A better first conversation.</em></h2><p>No finished brief needed. If you’re still exploring, choose the first option.</p></div>
      <noscript><p class="contact-no-script">Email <a href="mailto:hello@eml.systems">hello@eml.systems</a> with your situation and what you’d like to change. The guided email brief requires JavaScript; all direct contacts below work without it.</p></noscript>
      <form class="contact-form" data-contact-form hidden>
        <fieldset class="contact-choices"><legend><span class="mono">01</span> What brings you here?</legend><div>${contactTopics.map((topic, index) => `<label class="contact-choice"><input type="radio" name="topic" value="${topic.id}"${index === 0 ? ' checked' : ''}><span><strong>${escapeHtml(topic.title)}</strong><span>${escapeHtml(topic.description)}</span></span><span class="contact-choice-mark" aria-hidden="true">↗</span></label>`).join('')}</div></fieldset>
        <div class="contact-context" data-contact-context hidden>Continuing the conversation about: <span></span></div>
        <fieldset class="contact-details"><legend><span class="mono">02</span> Tell us a little about the work</legend><div class="contact-field-grid"><div><label for="contact-name">Your name <span>(required)</span></label><input id="contact-name" name="name" autocomplete="name" maxlength="120" required></div><div><label for="contact-email">Your email <span>(required)</span></label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required></div><div><label for="contact-company">Company or website <span>(optional)</span></label><input id="contact-company" name="company" autocomplete="organization" maxlength="160"></div><div><label for="contact-timing">When are you looking to start? <span>(optional)</span></label><select id="contact-timing" name="timing"><option value="">Select a timeframe</option><option>Just exploring</option><option>Within a month</option><option>In the next 1–3 months</option><option>Later / flexible</option></select></div></div><label for="contact-message">What would you like to work through? <span>(required)</span></label><p class="contact-field-hint" id="contact-message-hint">What’s happening today, what should change, and any constraints we should know about. Please leave out confidential details for now.</p><textarea id="contact-message" name="message" rows="5" maxlength="3000" aria-describedby="contact-message-hint" required></textarea></fieldset>
        <div class="contact-submit"><button class="button button-primary" type="submit">Prepare my email <span aria-hidden="true">↗</span></button><p>Prepare a draft to <strong data-contact-recipient>hello@eml.systems</strong>.<br>You review and send it from your email app. Nothing is submitted on this page.</p></div>
      </form>
      <section class="contact-draft" data-contact-draft hidden aria-labelledby="draft-title"><p class="eyebrow">03 / REVIEW & SEND</p><h3 id="draft-title" tabindex="-1">Your email is ready to review.</h3><p>This has not been sent. Open the draft in your email app, or copy it into webmail.</p><div class="contact-draft-actions"><a class="button button-primary" data-contact-open>Open email app <span aria-hidden="true">↗</span></a><button class="button button-outline" type="button" data-contact-copy>Copy email</button></div><label for="contact-preview" class="sr-only">Prepared email, ready to copy</label><textarea id="contact-preview" data-contact-preview rows="10" readonly></textarea><p class="form-status" data-contact-status role="status" aria-live="polite"></p></section>
    </section>

    <section class="contact-team" id="team" aria-labelledby="team-title"><div class="contact-section-heading"><p class="eyebrow">THE PEOPLE & THE WORK</p><h2 id="team-title">Principal-led.<br><em>Personally involved.</em></h2><p>You can start with any of these addresses. Valery receives the initial enquiry and helps shape the right approach.</p></div><div class="contact-team-grid"><article class="contact-principal"><div class="contact-person-mark" aria-hidden="true">v.</div><div><p class="eyebrow">PRINCIPAL / EML SYSTEMS</p><h3>Valery</h3><p>Product thinking, architecture, and hands-on engineering. Work directly with the person thinking through your problem and building alongside your team.</p><a class="text-link" href="mailto:valery@eml.systems">valery@eml.systems <span aria-hidden="true">↗</span></a><a class="text-link" href="https://valery.tech/" target="_blank" rel="noopener noreferrer">Writing & background <span aria-hidden="true">↗</span></a></div></article><div class="contact-role-list"><article><p class="eyebrow">AI ARCHITECTURE</p><h3>Connect the whole system.</h3><p>Discuss system design, technical choices, data flows, and integration.</p><a class="text-link" href="mailto:architecture@eml.systems">architecture@eml.systems <span aria-hidden="true">↗</span></a></article><article><p class="eyebrow">AI ENGINEERING</p><h3>Make the next version work.</h3><p>Discuss implementation, evaluation, reliability, and production issues.</p><a class="text-link" href="mailto:engineering@eml.systems">engineering@eml.systems <span aria-hidden="true">↗</span></a></article><p class="contact-role-note">We agree the people, responsibilities, and scope before an engagement begins.</p></div></div></section>
    <aside class="contact-direct"><div><p class="eyebrow">PREFER A SIMPLE EMAIL?</p><h2>A few sentences will do.</h2><p>Send your question directly, and we can take it from there.</p></div><a class="text-link" href="mailto:hello@eml.systems">hello@eml.systems <span aria-hidden="true">↗</span></a></aside>
  </main>
${footer}
</body>
</html>\n`);
}

export const servicePages = [
  { route: '/contact/', render: renderContact },
  { route: '/problems/', render: renderProblems },
  { route: workingTogether.route, render: renderWorkingTogether },
  { route: pricingRoute, render: renderPricing },
  ...pricing.offers.map(offer => ({ route: offerRoute(offer), render: () => renderOffer(offer) })),
  ...workProducts.map(example => ({ route: example.route, render: () => renderWorkProduct(example) }))
];

export function renderSitemap() {
  const routes = ['/', ...servicePages.map(page => page.route), ...Object.values(collections).map(collection => collection.route), ...publications.map(entry => entry.route)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>\n`;
}

export function renderFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>EML Systems — Blog</title><link>${origin}/blog/</link><description>Perspectives on AI products, engineering, and the people around them.</description><language>en</language>${collections.blog.entries.map(entry => `<item><title>${escapeHtml(entry.title)}</title><link>${origin}${entry.route}</link><guid isPermaLink="true">${origin}${entry.route}</guid><description>${escapeHtml(entry.standfirst)}</description></item>`).join('')}</channel></rss>\n`;
}
