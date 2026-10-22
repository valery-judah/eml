import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { articles } from '../content/articles.mjs';
import { projectRoot, renderArticle } from '../scripts/render.mjs';

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
const articleRoute = article => `/writing/${article.slug}/`;
const textOf = html => decodeEntities(html.replace(/<[^>]*>/g, '')).trim();

let inventory;
try {
  inventory = await filesIn(output);
} catch (error) {
  throw new Error('The production build is missing. Run npm run build before npm test.', { cause: error });
}
const documents = new Map(await Promise.all(inventory
  .filter(file => /\.(?:html|svg|css|xml|txt|js)$/.test(file))
  .map(async file => [file, await readFile(path.join(output, file), 'utf8')])));

test('every published essay has a complete, readable page and a homepage entry', () => {
  const homepage = documents.get('index.html');
  assert.ok(homepage, 'the homepage must be included');
  const homepageLinks = tags(homepage).filter(tag => tag.name === 'a').map(tag => tag.attrs.href);

  for (const article of articles) {
    const file = `writing/${article.slug}/index.html`;
    const html = documents.get(file);
    assert.ok(html, `missing generated page: ${file}`);
    assert.ok(homepageLinks.includes(articleRoute(article)), `homepage does not link to ${article.slug}`);
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `${file} needs one primary heading`);
    assert.equal(textOf(headings[0][1]), article.title);
    const body = html.match(/<div class="article-body">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(body, `${file} has no visible article body`);
    const published = [...body.matchAll(/<(h2|p)>([\s\S]*?)<\/\1>/g)].map(([, , content]) => textOf(content));
    assert.deepEqual(published, article.sections.flatMap(section => [section.heading, ...section.text]), `${file} lost or reordered article content`);
    const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(schemaText, `${file} needs structured article metadata`);
    const schema = JSON.parse(schemaText);
    assert.equal(schema.headline, article.title);
    assert.equal(schema.description, article.standfirst);
    assert.equal(schema.url, `${origin}${articleRoute(article)}`);
  }
});

test('page routes, canonical metadata, and sitemap describe the same unique public pages', () => {
  const slugs = articles.map(article => article.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate article slugs overwrite a page');
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `unsafe article route: ${slug}`);

  const routes = inventory.filter(file => file.endsWith('.html') && file !== '404.html').map(routeFor);
  const expectedRoutes = ['/', ...articles.map(articleRoute)].sort();
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
    category: unsafe, readTime: unsafe,
    sections: [{ heading: unsafe, text: [unsafe] }]
  };
  const html = await renderArticle(article);
  assert.ok(html.includes(`<h1>${encoded}</h1>`), 'the title must remain text');
  assert.ok(html.includes(`<h2>${encoded}</h2>`), 'section headings must remain text');
  assert.ok(html.includes(`<p>${encoded}</p>`), 'paragraphs must remain text');
  assert.ok(html.includes(`name="description" content="${encoded}"`), 'metadata attributes must remain quoted');
  assert.doesNotMatch(html, /<(?:img|script)\b[^>]*data-injected\s*=/i, 'title, category, reading time, and body text must not create HTML elements');
  assert.ok(!tags(html).some(tag => tag.attrs['data-injected'] === 'true'), 'content introduced an executable HTML element');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, 'structured metadata must survive hostile text');
  const schema = JSON.parse(json);
  assert.equal(schema.headline, unsafe, 'structured data must preserve the original content');
  assert.equal(schema.description, unsafe);
  assert.ok(!json.includes('<'), 'literal angle brackets can terminate a JSON script element');
  const enquiry = tags(html).find(tag => tag.name === 'a' && tag.attrs.href?.startsWith('mailto:'));
  assert.equal(new URL(enquiry.attrs.href).searchParams.get('subject'), `A question about: ${unsafe}`, 'article enquiry subjects must round-trip through URL encoding');
});

test('deployment contains public artifacts only, without notes, source modules, or local paths', () => {
  const publicFiles = new Set(['index.html', '404.html', 'styles.css', 'main.js', 'robots.txt', 'sitemap.xml', ...articles.map(article => `writing/${article.slug}/index.html`)]);
  for (const file of inventory) {
    const publicAsset = /^assets\/[a-z0-9/_.-]+\.(?:svg|png|jpe?g|webp|avif|ico|woff2?)$/i.test(file);
    assert.ok(publicFiles.has(file) || publicAsset, `unexpected deploy artifact: ${file}`);
    assert.doesNotMatch(file, /(?:^|\/)(?:\.|content\/|scripts\/|tests\/|node_modules\/)|\.(?:md|mjs|map|toml|env)$/i, `source or private file in deploy output: ${file}`);
  }
  for (const [file, source] of documents) {
    assert.doesNotMatch(source, /\/Users\/|\/home\/[^/]+\/|file:\/\/|\/notes\/(?:ai|ai-engineering|var)\//, `local source path leaked into ${file}`);
  }
});
