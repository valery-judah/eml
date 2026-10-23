import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projectRoot, renderWriting, renderSitemap, renderFeed, renderHomepage } from './render.mjs';
import { collections } from '../content/catalog.mjs';

const destination = path.join(projectRoot, 'dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const file of ['index.html', 'styles.css', 'main.js', 'assets', '404.html', 'robots.txt']) {
  await cp(path.join(projectRoot, file), path.join(destination, file), { recursive: true });
}
await renderWriting(destination);
await writeFile(path.join(destination, 'index.html'), await renderHomepage());
await writeFile(path.join(destination, 'sitemap.xml'), renderSitemap());
await writeFile(path.join(destination, 'feed.xml'), renderFeed());
console.log(`Built EML Systems: homepage, client problems, ${collections.papers.entries.length} papers, ${collections.notes.entries.length} technical notes, ${collections.blog.entries.length} blog essays, collection pages, and RSS → dist/`);
