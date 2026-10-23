import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteConfig, publicPath, withSitePaths, withStylePaths, withHomepageMetadata } from '../site.config.mjs';

test('deployment configuration distinguishes the custom domain from a Pages project site', () => {
  const custom = resolveSiteConfig();
  assert.equal(custom.url, 'https://eml.systems/');
  assert.equal(custom.basePath, '');
  assert.equal(custom.customDomain, 'eml.systems');
  const project = resolveSiteConfig('https://example.github.io/eml');
  assert.equal(project.url, 'https://example.github.io/eml/');
  assert.equal(project.basePath, '/eml');
  assert.equal(project.origin, 'https://example.github.io');
  assert.equal(project.customDomain, null);
  assert.equal(publicPath('/notes/?topic=Evaluation#results', project), '/eml/notes/?topic=Evaluation#results');
  assert.equal(publicPath('#results', project), '#results');
});

test('HTML and stylesheet paths support project hosting while preserving local and external references', () => {
  const project = resolveSiteConfig('https://example.github.io/eml/');
  const html = '<a href="/notes/">Notes</a><script src="/theme.js"></script><a href="#main">Local</a><a href="https://valery.tech/">External</a><a href="mailto:hello@eml.systems">Email</a><svg><use href="#icon"/></svg><code>href=&quot;/source-example/&quot;</code>';
  const output = withSitePaths(html, project);
  assert.ok(output.includes('href="/eml/notes/"'));
  assert.ok(output.includes('src="/eml/theme.js"'));
  for (const reference of ['href="#main"', 'href="https://valery.tech/"', 'href="mailto:hello@eml.systems"', 'href="#icon"', 'href=&quot;/source-example/&quot;']) assert.ok(output.includes(reference));
  assert.equal(withStylePaths('@import url("/theme.css") layer(tokens); fill: url(#node);', project), '@import url("/eml/theme.css") layer(tokens); fill: url(#node);');
  const sameHost = resolveSiteConfig('https://eml.systems/preview/');
  const source = '<link rel="canonical" href="https://eml.systems/"><link href="https://eml.systems/notes/"><img src="/assets/system.svg">';
  const metadata = withSitePaths(withHomepageMetadata(source, sameHost), sameHost);
  assert.ok(metadata.includes('https://eml.systems/preview/notes/'));
  assert.ok(!metadata.includes('/preview/preview/'));
  assert.ok(withHomepageMetadata(source, resolveSiteConfig('https://other.example/')).includes('https://other.example/notes/'), 'changing the configured domain must also update the source homepage metadata');
});

test('invalid deployment URLs fail before credentials or broken metadata enter an artifact', () => {
  for (const value of ['file:///tmp/site/', 'javascript:alert(1)', 'https://user:password@example.com/', 'https://example.com/?token=value', 'https://example.com/#section']) {
    assert.throws(() => resolveSiteConfig(value), /SITE_URL/);
  }
});
