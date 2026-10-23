import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publications, collections, relatedPublications } from '../content/catalog.mjs';
import { clientProblems } from '../content/client-problems.mjs';
import { clientRationale } from '../content/client-rationale.mjs';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const origin = 'https://eml.systems';
const safeJson = value => JSON.stringify(value).replaceAll('<', '\\u003c');

export async function renderHomepage() {
  const source = await readFile(path.join(projectRoot, 'index.html'), 'utf8');
  return source.replace(/data-collection-count="(notes|blog|papers)">[^<]*/g, (match, key) => `data-collection-count="${key}">${collections[key].entries.length}`);
}

async function chrome(activeCollection) {
  const homepage = await readFile(path.join(projectRoot, 'index.html'), 'utf8');
  let header = homepage.match(/    <header class="site-header[\s\S]*?<\/header>/)[0].replaceAll('href="#', 'href="/#');
  if (activeCollection) header = header.replace(`href="/${activeCollection}/"`, `href="/${activeCollection}/" aria-current="page"`);
  return { header, footer: homepage.match(/    <footer class="site-footer[\s\S]*?<\/footer>/)[0] };
}

function head({ title, description, route, type = 'website', schema }) {
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f6f4ee">
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
  <link rel="alternate" type="application/rss+xml" title="EML Systems Blog" href="/feed.xml">
  <script type="module" src="/main.js"></script>
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
  return `<!doctype html>
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
</html>\n`;
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
  return `<section id="section-${index + 1}"><h2>${escapeHtml(section.heading)}</h2>${(section.text || []).map(text => `<p>${escapeHtml(text)}</p>`).join('')}${section.bullets?.length ? `<ul>${section.bullets.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : ''}${section.code ? `<figure class="code-example"><figcaption>${escapeHtml(section.codeLanguage || 'EXAMPLE')}</figcaption><pre tabindex="0" aria-label="${escapeHtml(section.heading)} example"><code>${escapeHtml(section.code)}</code></pre></figure>` : ''}${sectionCitations(section, references)}</section>`;
}

export async function renderArticle(article) {
  const entry = publications.find(item => item.slug === article.slug) || { ...article, collection: 'blog', route: `/writing/${article.slug}/` };
  const content = { ...entry, ...article, collection: entry.collection, route: entry.route };
  const collection = collections[content.collection];
  const isNote = content.collection === 'notes';
  const isPaper = content.collection === 'papers';
  const label = isPaper ? 'TECHNICAL POSITION PAPER' : isNote ? 'TECHNICAL NOTE' : 'FROM THE BLOG';
  const referenceList = content.references || [];
  const { header, footer } = await chrome(content.collection);
  const pageUrl = `${origin}${content.route}`;
  const schema = { '@context': 'https://schema.org', '@type': isNote || isPaper ? 'TechArticle' : 'BlogPosting', headline: content.title, description: content.standfirst, url: pageUrl, author: { '@type': 'Person', name: 'Valery', url: 'https://valery.tech/' }, publisher: { '@type': 'Organization', name: 'EML Systems', url: `${origin}/` }, ...(referenceList.length ? { citation: referenceList.map(reference => ({ '@type': 'CreativeWork', name: reference.title, url: reference.url })) } : {}) };
  const related = relatedPublications(content);
  return `<!doctype html>
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
      <div class="reading-layout"><div class="article-body">${content.sections.map((section, index) => renderSection(section, index, referenceList)).join('')}</div><aside class="reading-sidebar"><nav aria-label="On this page"><p class="eyebrow">${isPaper ? 'IN THIS PAPER' : isNote ? 'IN THIS NOTE' : 'IN THIS ESSAY'}</p><ol>${content.sections.map((section, index) => `<li><a href="#section-${index + 1}">${escapeHtml(section.heading.replace(/^\d+\.\s*/, ''))}</a></li>`).join('')}${referenceList.length ? '<li><a href="#references">References & scope</a></li>' : ''}</ol></nav><div class="sidebar-context"><span class="sidebar-cross" aria-hidden="true">+</span><p>${isNote ? 'A practical working reference. Apply it to your context and revise it as the evidence changes.' : 'Ideas from our working notes on AI products, engineering, and the systems around them.'}</p><a href="${collection.route}">Explore ${isPaper ? 'all papers' : isNote ? 'all technical notes' : 'the blog'} <span aria-hidden="true">↗</span></a></div></aside></div>
      <div class="reading-end">${renderReferences(referenceList)}<p class="article-sources">Adapted from our working notes on AI products and engineering. Explore the broader body of work at <a href="https://valery.tech/" target="_blank" rel="noopener noreferrer">valery.tech ↗</a>.</p><aside class="article-cta"><h2>Working through a similar question?</h2><p>Let’s connect the product, the engineering, and the evidence.</p><a class="button button-primary" href="mailto:hello@eml.systems?subject=${encodeURIComponent(`A question about: ${content.title}`)}">Start a conversation <span aria-hidden="true">↗</span></a></aside><nav class="related-writing" aria-label="Related reading"><p>READ NEXT</p>${related.map(item => `<a href="${item.route}"><span><small>${item.collection === 'papers' ? 'PAPER' : item.collection === 'notes' ? 'TECHNICAL NOTE' : 'BLOG'}</small>${escapeHtml(item.title)}</span><span aria-hidden="true">↗</span></a>`).join('')}</nav><a class="article-back reading-back" href="${collection.route}"><span aria-hidden="true">←</span> Back to ${collection.title.toLowerCase()}</a></div>
    </article>
  </main>
${footer}
</body>
</html>\n`;
}

export async function renderWriting(outputDirectory) {
  await mkdir(path.join(outputDirectory, 'problems'), { recursive: true });
  await writeFile(path.join(outputDirectory, 'problems', 'index.html'), await renderProblems());
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
  return `<!doctype html>
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
    <div class="problem-cases">${page.problems.map((problem, index) => `<article class="problem-case" id="${escapeHtml(problem.id)}"><header><p class="eyebrow">SITUATION / 0${index + 1}</p><h2>${escapeHtml(problem.title)}</h2><p class="problem-trigger">${escapeHtml(problem.trigger)}</p><a class="text-link" href="mailto:hello@eml.systems?subject=${encodeURIComponent(`Let's discuss: ${problem.title}`)}">Discuss this situation <span aria-hidden="true">↗</span></a></header><div class="problem-detail"><section><h3>Why this matters to you</h3><p>${escapeHtml(problem.motivation)}</p></section><section><h3>What may be underneath</h3>${paragraphs(problem.diagnosis)}</section><section class="problem-questions"><h3>Questions worth answering first</h3><ul>${problem.questions.map(question => `<li>${escapeHtml(question)}</li>`).join('')}</ul></section><section><h3>What we work on together</h3><ul>${problem.work.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section class="problem-outcome"><h3>The decision this should unlock</h3><p>${escapeHtml(problem.outcome)}</p></section><nav class="problem-reading" aria-label="Supporting reading for ${escapeHtml(problem.title)}"><p class="eyebrow">THE REASONING & METHODS</p>${problem.reading.map(route => {
    const entry = publications.find(item => item.route === route);
    if (!entry) throw new Error(`Unknown problem reading route: ${route}`);
    return `<a href="${entry.route}">${escapeHtml(entry.title)} <span aria-hidden="true">↗</span></a>`;
  }).join('')}</nav></div></article>`).join('')}</div>
    <section class="practice-motivation" id="why-eml" aria-labelledby="motivation-title"><div><p class="eyebrow">THE MOTIVATION BEHIND OUR PRACTICE</p><h2 id="motivation-title">${escapeHtml(page.motivation.heading)}</h2></div><div>${paragraphs(page.motivation.text)}</div></section>
    <section class="problem-engagement" id="working-together" aria-labelledby="engagement-title"><p class="eyebrow">FROM RECOGNITION TO A USEFUL NEXT STEP</p><h2 id="engagement-title">${escapeHtml(page.engagement.heading)}</h2><div class="engagement-intro">${paragraphs(page.engagement.text)}</div><ol>${page.engagement.steps.map(step => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></li>`).join('')}</ol><a class="button button-primary" href="mailto:hello@eml.systems?subject=An%20AI%20product%20decision%20to%20work%20through">Tell us what is getting in the way <span aria-hidden="true">↗</span></a></section>
  </main>
${footer}
</body>
</html>\n`;
}

export function renderSitemap() {
  const routes = ['/', '/problems/', ...Object.values(collections).map(collection => collection.route), ...publications.map(entry => entry.route)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>\n`;
}

export function renderFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>EML Systems — Blog</title><link>${origin}/blog/</link><description>Perspectives on AI products, engineering, and the people around them.</description><language>en</language>${collections.blog.entries.map(entry => `<item><title>${escapeHtml(entry.title)}</title><link>${origin}${entry.route}</link><guid isPermaLink="true">${origin}${entry.route}</guid><description>${escapeHtml(entry.standfirst)}</description></item>`).join('')}</channel></rss>\n`;
}
