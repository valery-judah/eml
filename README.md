# EML Systems

A responsive, dependency-free website for EML Systems: AI product strategy, development, and engineering, with full technical papers, a notes library, a blog, and a detailed client-problems page. Built with HTML, CSS, JavaScript, and Node.js 20+.

## Run locally

The Docker/Make workflow uses the Node.js and npm versions pinned in `.infra/versions.env`, matching GitHub Actions:

```sh
make up
```

Open http://localhost:5173. Stop it with `make down`. Use `SITE_PORT=5174 make up` when that host port is occupied. The container has a separate dependency volume and mounts this repository only; external notes are not required to build or preview.

With a compatible local Node.js installation, the direct commands remain available:

```sh
npm ci --ignore-scripts
npm run dev
```

The development process watches imported source modules and restarts when they change. To use another port: `npm run dev -- --port 3000`.

## Build and verify

```sh
make verify
```

The same verification path runs directly on the host and in CI:

```sh
npm run verify
npm run preview
```

Verification builds `dist/`, runs the complete test suite and public-artifact audit, rejects artifact links unsupported by Pages, then starts a temporary local production server to check pages, assets, redirects, HEAD responses, and 404/private-file boundaries. Each stage must pass before deployment can upload the artifact. `npm run build` and `npm test` remain available separately; tests read the latest build.

Deploy `dist/` to a static host; no application server or external service is required. `npm run preview` serves it at http://localhost:5173. Stop development first or use `npm run preview -- --port 5174`. `make preview` serves the built output in the pinned container. `make clean` removes generated output.

## GitHub Pages

The workflows follow the same build and deployment structure as the companion website:

- `.github/actions/setup-site/action.yml` reads `.infra/versions.env`, installs the pinned toolchain, and uses the committed npm lockfile.
- `.github/workflows/ci.yml` validates pull requests and non-`main` pushes, including a build under a repository subpath.
- `.github/workflows/deploy.yml` verifies pushes to `main`, uploads only `dist/`, then deploys through the `github-pages` environment. Manual runs can deploy `main` as well.

For the first deployment:

1. Connect this checkout to its intended GitHub repository and push the source.
2. In the repository's **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
3. Set the confirmed custom domain, **eml.systems**, in Pages settings and configure its DNS for that repository. Enable HTTPS when GitHub makes it available.
4. Run the deployment workflow, or push a subsequent change to `main`. Its deployment environment links to the published URL.

The build uses the base URL reported by `actions/configure-pages`. Before a custom domain is configured, it also works at a project URL such as `https://OWNER.github.io/REPOSITORY/`. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

`site.config.mjs` owns the default production URL. An explicit `SITE_URL` changes page links, stylesheet imports, canonical/social/structured metadata, RSS, sitemap, 404 links, and robots output together:

```sh
SITE_URL=https://example.github.io/eml/ npm run verify
SITE_URL=https://example.github.io/eml/ npm run preview
```

Use the same value for a build and its local preview. The build emits `.nojekyll` and includes `CNAME` only when building for the confirmed root custom domain. For an Actions deployment, the domain must also be configured in Pages settings. Regenerate the default build with `npm run build` after testing another URL.

## Edit the site

- `index.html`: homepage copy, services, engagements, and enquiry form.
- `theme.css`: shared style configuration: semantic colors, fonts, type scale, spacing, dimensions, borders, focus, and motion.
- `styles.css`: layout and components that consume the configuration, plus responsive and print rules.
- `theme.js`: theme selection before first paint, device preference, and persistent user choice.
- `main.js`: mobile navigation, approach accordion, and enquiry dialog.
- `content/tech-notes.mjs`: six practical technical references with examples and code.
- `content/papers.mjs`: three full technical position papers with abstracts, arguments, hypothetical cases, counterarguments, limitations, methods, and annotated primary references.
- `content/client-problems.mjs`: the motivation behind the practice and six client situations, diagnostic questions, work products, and decisions.
- `content/client-rationale.mjs`: the separate client case for acting: affected roles, consequences, evidence, improvement criteria, and when external help is justified.
- `content/engagements.mjs`: three starting situations, work products, client inputs, scope, completion criteria, and next decisions for the Working together page.
- `content/pricing.json`: public offer catalogue, pricing models, scope, deliverables, and commercial explanations. Generates the pricing overview, individual engagement pages, homepage offers, and Working together formats.
- `content/pricing.schema.json`: editor schema for the offer catalogue.
- `content/pricing.mjs`: catalogue validation, public offer routes, and currency-aware price formatting.
- `content/work-products.mjs`: two complete, explicitly synthetic teaching examples: an investment decision memo and a release-readiness review.
- `content/reader-paths.mjs`: an explicit client situation, worked example, and engagement starting point for each publication, with article-specific explanations.
- `content/blog.mjs`: four original long-form blog essays adapted from the supplied notes.
- `content/articles.mjs`: the three original essays, retained at their existing `/writing/` URLs and included in the blog.
- `content/catalog.mjs`: collection metadata, publication routes, related reading, and reading-time calculation.
- `scripts/render.mjs`: collection and article templates, homepage counts, sitemap, and RSS feed.
- `site.config.mjs`: the deployment URL, repository base path, URL rewriting, and generated robots metadata.
- `scripts/verify-site.mjs`: the shared production build, tests, artifact checks, and HTTP verification.
- `assets/system.svg`: original vector illustration.

The site uses system fonts and makes no third-party font, analytics, or script requests. The enquiry form opens a prefilled email draft to **hello@eml.systems**; the visitor sends it from their email application. It does not store submissions or claim that a message has been delivered.

## Style configuration

Edit `theme.css` to change the site's shared appearance. `styles.css` imports it into the first cascade layer, so the same configuration reaches the homepage, client problems, all collections and publications, and the 404 page. The build publishes both files; no CSS framework or preprocessing is required.

The configuration groups fonts and fluid type sizes (`--font-*`, `--type-*`), line heights and tracking, a spacing scale (`--space-*`), shared page dimensions (`--layout-*`), control shape, focus treatment, and motion durations. Responsive configuration changes the page gutter, section spacing, and display scale in one place. Component-specific geometry stays in `styles.css`. Media-query breakpoints remain literal values because native CSS custom properties cannot be used in media conditions.

Colors describe their purpose rather than a hue: `--color-bg`, `--color-surface-*`, `--color-text-*`, `--color-border-*`, and `--color-accent`. Selected controls, accent buttons, and contrasting sections each have paired background and foreground roles. Code blocks, diagrams, overlays, fields, and vector artwork also use theme roles. Override both sides of a pair when changing their contrast.

Light and dark palettes share the same typography, layout, and component selectors. The dark palette lives in `:root[data-theme="dark"]` in `theme.css`; each palette also sets the native `color-scheme`. The header’s Color theme selector offers Auto, Light, and Dark. Auto follows the device appearance, including live changes. An explicit choice is saved under `eml-color-theme` in local storage and retained across pages and tabs; Auto clears that override. Theme selection remains usable when storage is blocked.

`theme.js` is a small classic script in the head, after the stylesheet and before page content, so it selects the theme before the first paint. It also updates browser `theme-color` from the active CSS background token, keeping palette values in one place. Every page, including the 404 page, loads the script. Without JavaScript, the default light palette remains usable and the inactive selector is hidden. The header navigation collapses at 1000px to keep both navigation and theme selection comfortable on narrower screens.

The homepage renderer embeds `assets/system.svg` inline so its `--art-*` roles inherit the selected theme. SVG color fallbacks keep the standalone asset usable; the favicon and social-sharing card remain independent brand assets. Print colors are separate (`--print-*`), with body-level overrides that keep articles readable regardless of the screen theme.

## Engagements and pricing

Edit `content/pricing.json` to maintain the public offers in one place. `/pricing/` groups the catalogue into assessments, implementation projects, and advisory. Each offer generates `/pricing/ID/` with its fit, outcome, included work, boundaries, client inputs, completion criteria, pricing, and contextual enquiry. The homepage engagement list and Working together formats read the same model. Adding an offer adds its page, discovery links, sitemap entry, and production verification automatically.

The public catalogue presents each engagement's scope, deliverables, and how its fee is agreed. A `quote` displays **Scoped after discussion**, with monetary fields left `null`. Project totals and monthly advisory fees are agreed individually in USD. Internal estimating rates and assumptions belong in the separate notes workspace and are not inputs to the website build. All content in this JSON is public editorial material; keep internal cost calculations, margins, client negotiations, and private proposals outside this repository.

An offer's `price` supports these models:

| Model | Numeric fields | Display |
| --- | --- | --- |
| `quote` | All monetary fields and currency `null` | Scoped after discussion |
| `fixed` | `amount`, `currency`; bounds `null` | Currency and amount per unit |
| `from` | `amount`, `currency`; bounds `null` | From currency and amount per unit |
| `range` | `minimum`, `maximum`, `currency`; amount `null` | Indicative fee range per unit |
| `indicative` | `amount`, `currency`; bounds `null` | Approximate currency and amount per unit |

`unit` is `engagement`, `project`, `hour`, `day`, or `month`. The last supports monthly advisory or retainers. `note` explains the basis and relevant conditions. Amounts use **currency major units**, and formatting displays an explicit currency code. For example, the following is an editing illustration, not an EML fee:

```json
{
  "model": "fixed",
  "currency": "USD",
  "amount": 2500,
  "minimum": null,
  "maximum": null,
  "unit": "project",
  "note": "Describe the actual scope and pricing conditions here."
}
```

The schema supplies editor hints. Runtime validation rejects unsupported fields, duplicate offer IDs, undefined groups, incomplete scope, invalid monetary records, unsupported currency codes, excess currency precision, and reversed ranges. The renderer also rejects unresolved journey references. A malformed catalogue fails the build before output is replaced. The development watcher reloads JSON changes through Node's module loader.

To add another kind of work, add a `groups` entry and an offer referencing it. Each offer needs a stable lowercase `id`, a group, title, summary, applicability (`bestFor`), outcome, `includes`, `excludes`, `clientInputs`, completion criteria, existing `journeyIds`, and a `price`. Changing an ID changes its public URL. Rebuild and run `npm run verify` after editing. Only the rendered HTML is deployed; the source JSON and editor schema are not copied to `dist/`.

## Writing collections

`/papers/` contains three full technical position papers on evaluation as decision evidence, diagnosing AI system failures, and human–AI work allocation and ownership. The papers distinguish the proposed methods and hypothetical examples from the findings supported by their references. Section citations link to an annotated bibliography; a print button opens the browser's print dialog, where readers can save a PDF. Print styles include reference URLs and omit site navigation.

`/notes/` contains six technical notes covering evaluation coverage, failure diagnosis, retrieval provenance, coding-agent ownership, experiment design, and automated evaluators. `/blog/` contains seven essays on product outcomes, production commitments, interfaces, quality ownership, and engineering practice. All three indexes support combined topic filtering and title/topic search, shareable filter URLs, and a clear empty state. Every publication is fully rendered in static HTML, with section navigation and related reading. `/feed.xml` is the blog RSS feed.

Each technical note leads with a practical answer and applicability guidance, then preserves the full method. Its final checklist includes a blank Markdown working record, completion criteria, and limits. Native disclosure and selectable text work without JavaScript. Where the Clipboard API is available, Copy working record copies the exact plain text and announces success or a manual-copy fallback. Print includes the record and restores its previous disclosure state afterward. Reading times include this practical material.

All 16 publications end with an article-specific route to a client situation, a labeled illustrative work product, and a relevant engagement scope, while retaining related reading and a contextual email link. The editorial mapping explains cross-domain examples explicitly, including the limits of applying the report example to coding-agent work. Papers retain their abstract, thesis, method, and citations; essays retain their existing opening structure.

`/problems/` separately explains why EML works across the whole system and why clients seek help. Six situations cover product direction, production readiness, evaluation usefulness, unexplained failures, quality ownership, and coding-agent throughput. Each develops the buyer's motivation, possible causes, diagnostic questions, concrete work, and the decision an engagement should unlock. Causes are hypotheses to investigate, not claims about every client.

The dedicated `/problems/#why-act` section makes the business rationale explicit before the detailed diagnoses. It connects each situation to affected roles, stakes, evidence that would establish it for a particular client, and observable improvement. Native disclosure panels keep the complete copy available without JavaScript. The section also explains when specialist help is useful and when an internal next step is sufficient. EML’s own motivation is separately linked at `/problems/#why-eml`. These are reasoned positioning hypotheses grounded in the notes; the site does not present them as validated market-demand research or client results.

## Working together and illustrative work products

`/working-together/` connects three starting situations to concrete work: choosing the next investment, building a defined change, and investigating an existing system. Each explains the question, client contribution, outputs, boundaries, completion criteria, and next decision. The existing assessment, implementation, and advisory formats remain available across these situations. Each client problem links directly to the relevant starting point, and the homepage navigation and engagement section lead to the details.

`/examples/choosing-an-ai-investment/` contains a full illustrative investment memo with a synthetic effort map, alternatives, experiment design, decision criteria, conditional economics, ownership, and limits. `/examples/release-readiness-review/` develops a fictional support-assistant review with supported scope, an evidence matrix, a reconstructed failure, action boundaries, interventions, and release conditions. They are public teaching examples, labeled as synthetic before the recommendation, with no claims of client work or measured results. Wide evidence tables support keyboard scrolling; both examples can be printed or saved as PDF.

`servicePages` in `scripts/render.mjs` registers the client-problems page, Working together, the JSON-generated pricing and offer pages, and the two examples. The build, development and preview routing, and sitemap share that registry. The examples remain separate from the papers, notes, and blog collections and RSS. Internal consulting plans are maintained in the separate notes workspace; this repository contains the website and its public maintenance documentation.

To add a note or essay, add an entry to the relevant content module with `slug`, `title`, `category`, `standfirst`, `tags`, and `sections`. Each section has a `heading`, paragraph strings in `text`, and optional `bullets`, `code`, and `codeLanguage`. Notes use the categories in `collections.notes.categories`; blog entries use `collections.blog.categories`. Reading time and public indexes are generated automatically. The optional `sourceNotes` field records local editorial provenance and is excluded from all public artifacts.

Add a `readerPaths` entry for every publication: `problemId`, `journeyId`, `exampleSlug`, `heading`, `text`, and `exampleContext`. Rendering rejects missing mappings or unresolved destinations. A technical note also requires `practical`: `question`, `answer`, `useWhen`, `title`, `intro`, `checks`, `record`, `completion`, and `limit`. Write `record` as plain text with intentional newlines; it is escaped in HTML and copied without formatting changes. These are public editorial fields and must contain publishable material only.

Papers additionally have `abstract`, `thesis`, `methodNote`, and `references`. A reference contains `id`, `title`, `url` (HTTPS), and `note` explaining its relevance and limits. A section's optional `citations` array names reference IDs; unresolved citations fail rendering. Add a new category to its collection metadata when needed. Client problem `reading` arrays contain canonical local publication routes; invalid routes fail the build.

Default domain: **https://eml.systems**, configured in `site.config.mjs`. The build generates consistent canonical URLs, social metadata, `robots.txt`, and sitemap for the selected deployment URL. A 1200 × 630 JPEG social card is included alongside its editable SVG source in `assets/`.

## Editorial basis

Copy was developed from the supplied consulting, AI, and AI engineering notes. The site describes a principal-led practice and emphasizes complete products, practical engineering, evidence, and continued learning. It does not claim clients, measured results, fixed pricing, company registration, or credentials that the notes did not establish. Private business-planning material is not included in the build.
