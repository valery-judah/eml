import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projectRoot, renderWriting, renderSitemap } from './render.mjs';

const destination = path.join(projectRoot, 'dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const file of ['index.html', 'styles.css', 'main.js', 'assets', '404.html', 'robots.txt']) {
  await cp(path.join(projectRoot, file), path.join(destination, file), { recursive: true });
}
await renderWriting(destination);
await writeFile(path.join(destination, 'sitemap.xml'), renderSitemap());
console.log('Built EML Systems: homepage, 3 perspectives, assets, and sitemap → dist/');
