import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoot, renderArticle, renderCollection, renderSitemap, renderFeed, renderHomepage, renderProblems } from './render.mjs';
import { collections, findPublication } from '../content/catalog.mjs';

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

export function createSiteServer({ production = false } = {}) {
  const root = production ? path.join(projectRoot, 'dist') : projectRoot;
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Cache-Control', 'no-cache');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.includes('..') || pathname.includes('\\') || pathname.includes('\0')) throw new Error('Invalid path');
      if (!production && pathname === '/sitemap.xml') {
        response.writeHead(200, { 'Content-Type': MIME['.xml'] }).end(request.method === 'HEAD' ? undefined : renderSitemap());
        return;
      }
      if (!production && pathname === '/feed.xml') {
        response.writeHead(200, { 'Content-Type': MIME['.xml'] }).end(request.method === 'HEAD' ? undefined : renderFeed());
        return;
      }
      if (!production && ['/', '/index.html'].includes(pathname)) {
        response.writeHead(200, { 'Content-Type': MIME['.html'] }).end(request.method === 'HEAD' ? undefined : await renderHomepage());
        return;
      }
      const article = findPublication(pathname);
      const problemsPage = ['/problems', '/problems/', '/problems/index.html'].includes(pathname);
      const collection = Object.entries(collections).find(([, item]) => pathname === item.route || pathname === `${item.route}index.html` || pathname === item.route.slice(0, -1));
      const canonicalRoute = article?.route || collection?.[1].route || (problemsPage ? '/problems/' : null);
      if (canonicalRoute && pathname === canonicalRoute.slice(0, -1)) {
        response.writeHead(308, { Location: `${canonicalRoute}${new URL(request.url, 'http://localhost').search}` }).end();
        return;
      }
      if (!production && article) {
        response.writeHead(200, { 'Content-Type': MIME['.html'] }).end(request.method === 'HEAD' ? undefined : await renderArticle(article));
        return;
      }
      if (!production && problemsPage) {
        response.writeHead(200, { 'Content-Type': MIME['.html'] }).end(request.method === 'HEAD' ? undefined : await renderProblems());
        return;
      }
      if (!production && collection) {
        response.writeHead(200, { 'Content-Type': MIME['.html'] }).end(request.method === 'HEAD' ? undefined : await renderCollection(collection[0]));
        return;
      }
      const allowed = pathname === '/' || ['/index.html', '/styles.css', '/main.js', '/404.html', '/robots.txt', '/sitemap.xml', '/feed.xml'].includes(pathname) || /^\/assets\/[\w.-]+$/.test(pathname) || Boolean(article) || Boolean(collection) || problemsPage;
      if (!allowed) throw new Error('Not found');
      let filename = path.join(root, pathname);
      if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
      const body = await readFile(filename);
      response.writeHead(200, { 'Content-Type': MIME[path.extname(filename)] || 'application/octet-stream' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      const notFound = await readFile(path.join(root, '404.html')).catch(() => 'Page not found');
      response.writeHead(404, { 'Content-Type': MIME['.html'] });
      response.end(request.method === 'HEAD' ? undefined : notFound);
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const portIndex = process.argv.indexOf('--port');
  const port = Number(portIndex === -1 ? (process.env.PORT || 5173) : process.argv[portIndex + 1]);
  const server = createSiteServer({ production: process.argv.includes('--dist') });
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`EML Systems is ready at http://localhost:${port}`));
}
