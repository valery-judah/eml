import { mkdir, rm, cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projectRoot, renderWriting, renderSitemap, renderFeed, renderHomepage } from './render.mjs';
import { collections } from '../content/catalog.mjs';
import { site, withSitePaths, withStylePaths, renderRobots } from '../site.config.mjs';
import { workProducts } from '../content/work-products.mjs';
import { pricing } from '../content/pricing.mjs';

const destination = path.join(projectRoot, 'dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const file of ['index.html', 'styles.css', 'theme.css', 'theme.js', 'main.js', 'assets', '404.html']) {
  await cp(path.join(projectRoot, file), path.join(destination, file), { recursive: true });
}
await renderWriting(destination);
await writeFile(path.join(destination, 'index.html'), await renderHomepage());
await writeFile(path.join(destination, 'sitemap.xml'), renderSitemap());
await writeFile(path.join(destination, 'feed.xml'), renderFeed());
await writeFile(path.join(destination, '404.html'), withSitePaths(await readFile(path.join(projectRoot, '404.html'), 'utf8')));
await writeFile(path.join(destination, 'styles.css'), withStylePaths(await readFile(path.join(projectRoot, 'styles.css'), 'utf8')));
await writeFile(path.join(destination, 'robots.txt'), renderRobots());
await writeFile(path.join(destination, '.nojekyll'), '');
if (site.customDomain) await writeFile(path.join(destination, 'CNAME'), `${site.customDomain}\n`);
console.log(`Built EML Systems: homepage, client problems, working together, pricing and ${pricing.offers.length} engagement pages, ${workProducts.length} illustrative work products, ${collections.papers.entries.length} papers, ${collections.notes.entries.length} technical notes, ${collections.blog.entries.length} blog essays, collection pages, and RSS → dist/ (${site.url})`);
