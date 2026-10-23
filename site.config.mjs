const defaultUrl = 'https://eml.systems/';

export function resolveSiteConfig(value = defaultUrl) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) site URL without credentials, query parameters, or a fragment.');
  }
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  const basePath = url.pathname === '/' ? '' : url.pathname.slice(0, -1);
  const defaultHost = new URL(defaultUrl).hostname;
  return Object.freeze({
    url: url.href,
    root: url.href.slice(0, -1),
    origin: url.origin,
    basePath,
    customDomain: url.hostname === defaultHost && !basePath && !url.port ? defaultHost : null
  });
}

export const site = resolveSiteConfig(process.env.SITE_URL || defaultUrl);

export function publicPath(route, config = site) {
  return route.startsWith('/') && !route.startsWith('//') ? `${config.basePath}${route}` : route;
}

// Source templates use site-root paths. Rewrite only actual URL attributes,
// leaving local anchors, external links, email, and literal code untouched.
export function withSitePaths(html, config = site) {
  if (!config.basePath) return html;
  return html.replace(/\b(href|src|poster|action)=(['"])\/(?!\/)/g, (_, attribute, quote) => `${attribute}=${quote}${config.basePath}/`);
}

export function withStylePaths(css, config = site) {
  if (!config.basePath) return css;
  return css.replace(/(url\(\s*['"]?)\/(?!\/)/g, (_, start) => `${start}${config.basePath}/`);
}

export function withHomepageMetadata(html, config = site) {
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  if (!canonical) throw new Error('The homepage source needs a canonical URL for metadata rendering.');
  const templateRoot = new URL(canonical[1]).href.replace(/\/$/, '');
  return html.replaceAll(templateRoot, config.root);
}

export const renderRobots = () => `User-agent: *\nAllow: /\n\nSitemap: ${site.root}/sitemap.xml\n`;
