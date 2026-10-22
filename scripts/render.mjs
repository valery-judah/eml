import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../content/articles.mjs';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function renderArticle(article) {
  const homepage = await readFile(path.join(projectRoot, 'index.html'), 'utf8');
  const header = homepage.match(/    <header class="site-header[\s\S]*?<\/header>/)[0].replaceAll('href="#', 'href="/#');
  const footer = homepage.match(/    <footer class="site-footer[\s\S]*?<\/footer>/)[0];
  const related = articles.filter(item => item.slug !== article.slug);
  const pageUrl = `https://eml.systems/writing/${article.slug}/`;
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.standfirst, url: pageUrl, author: { '@type': 'Person', name: 'Valery', url: 'https://valery.tech/' }, publisher: { '@type': 'Organization', name: 'EML Systems', url: 'https://eml.systems/' } }).replaceAll('<', '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f6f4ee">
  <title>${escapeHtml(article.title)} — EML Systems</title>
  <meta name="description" content="${escapeHtml(article.standfirst)}">
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(article.title)} — EML Systems">
  <meta property="og:description" content="${escapeHtml(article.standfirst)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="https://eml.systems/assets/social-card.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="EML Systems — AI products, built for the real world.">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <script type="module" src="/main.js"></script>
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="wrap">
    <article class="article-page">
      <a class="article-back" href="/#perspectives"><span aria-hidden="true">←</span> Back to perspectives</a>
      <p class="eyebrow">${escapeHtml(article.category.toUpperCase())} &nbsp; / &nbsp; ${escapeHtml(article.readTime.toUpperCase())}</p>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="article-standfirst">${escapeHtml(article.standfirst)}</p>
      <p class="article-byline">VALERY · PRINCIPAL, EML SYSTEMS</p>
      <div class="article-body">${article.sections.map(section => `<section><h2>${escapeHtml(section.heading)}</h2>${section.text.map(text => `<p>${escapeHtml(text)}</p>`).join('')}</section>`).join('')}</div>
      <p class="article-sources">Adapted from our working notes on AI products and engineering. Explore the broader body of work at <a href="https://valery.tech/" target="_blank" rel="noopener noreferrer">valery.tech ↗</a>.</p>
      <aside class="article-cta"><h2>Working through a similar question?</h2><p>Let’s connect the product, the engineering, and the evidence.</p><a class="button button-primary" href="mailto:hello@eml.systems?subject=${encodeURIComponent(`A question about: ${article.title}`)}">Start a conversation <span aria-hidden="true">↗</span></a></aside>
      <nav class="related-writing" aria-label="More perspectives"><p>KEEP EXPLORING</p>${related.map(item => `<a href="/writing/${item.slug}/">${escapeHtml(item.title)}<span aria-hidden="true">↗</span></a>`).join('')}</nav>
    </article>
  </main>
${footer}
</body>
</html>\n`;
}

export async function renderWriting(outputDirectory) {
  for (const article of articles) {
    const directory = path.join(outputDirectory, 'writing', article.slug);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), await renderArticle(article));
  }
}

export function renderSitemap() {
  const locations = ['https://eml.systems/', ...articles.map(article => `https://eml.systems/writing/${article.slug}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>\n`;
}
