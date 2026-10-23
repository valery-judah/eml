import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createSiteServer } from './server.mjs';
import { projectRoot, servicePages } from './render.mjs';
import { collections, publications } from '../content/catalog.mjs';
import { site, publicPath } from '../site.config.mjs';

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: projectRoot, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run(['scripts/build.mjs']);
const tests = (await readdir(path.join(projectRoot, 'tests'))).filter(file => file.endsWith('.test.mjs')).sort();
run(['--test', ...tests.map(file => `tests/${file}`)]);

async function inspectArtifacts(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const filename = path.join(directory, entry.name);
    const stats = await lstat(filename);
    assert.ok(!stats.isSymbolicLink(), `Pages artifact contains a symbolic link: ${filename}`);
    if (stats.isDirectory()) await inspectArtifacts(filename);
    else assert.equal(stats.nlink, 1, `Pages artifact contains a hard link: ${filename}`);
  }
}
await inspectArtifacts(path.join(projectRoot, 'dist'));

const server = createSiteServer({ production: true });
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const local = `http://127.0.0.1:${server.address().port}`;
const routes = ['/', ...servicePages.map(page => page.route), ...Object.values(collections).map(collection => collection.route), ...publications.map(entry => entry.route)];
let checks = 0;
const request = (route, options) => fetch(`${local}${publicPath(route)}`, { signal: AbortSignal.timeout(10000), ...options });
try {
  for (const route of routes) {
    const response = await request(route);
    assert.equal(response.status, 200, `Unreachable published route: ${route}`);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    const filename = path.join(projectRoot, 'dist', route, 'index.html');
    assert.equal(await response.text(), await readFile(filename, 'utf8'), `Preview changed the deployment artifact: ${route}`);
    checks++;
    if (route !== '/') {
      const redirect = await request(`${route.slice(0, -1)}?from=verify`, { redirect: 'manual' });
      assert.equal(redirect.status, 308);
      assert.equal(redirect.headers.get('location'), `${publicPath(route)}?from=verify`);
      checks++;
    }
  }
  for (const route of ['/styles.css', '/theme.css', '/theme.js', '/main.js', '/assets/system.svg', '/assets/social-card.jpg', '/sitemap.xml', '/feed.xml', '/robots.txt', '/.nojekyll', ...(site.customDomain ? ['/CNAME'] : [])]) {
    const response = await request(route, { method: 'HEAD' });
    assert.equal(response.status, 200, `Missing public asset: ${route}`);
    assert.equal(await response.text(), '');
    checks++;
  }
  for (const route of ['/not-a-real-page/', '/README.md', '/docs/consulting-patterns.md', '/site.config.mjs', '/content/tech-notes.mjs', '/content/pricing.json', '/content/pricing.schema.json', '/.env', '/.git/config']) {
    const response = await request(route);
    assert.equal(response.status, 404, `Unexpectedly published route: ${route}`);
    const body = await response.text();
    assert.match(body, /noindex/);
    assert.ok(body.includes(`href="${publicPath('/')}"`), 'The 404 page must link back to the configured site root');
    checks++;
  }
  const rejectedPost = await request('/', { method: 'POST' });
  assert.equal(rejectedPost.status, 405);
  checks++;
  console.log(`Verified ${routes.length} HTML pages and ${checks} production HTTP checks for ${site.url}`);
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
