# EML Systems

A responsive, dependency-free website for EML Systems: AI product strategy, development, and engineering, with full technical papers, a notes library, a blog, and a detailed client-problems page. Built with HTML, CSS, JavaScript, and Node.js 20+.

## Run locally

```sh
npm run dev
```

Open http://localhost:5173. To use another port: `npm run dev -- --port 3000`.

## Build and verify

```sh
npm run build
npm test
npm run preview
```

The production build is written to `dist/`. Deploy that directory to any static web host; no application server or external service is required. The preview command serves `dist/` at http://localhost:5173; stop the development server first or specify another port.

## Edit the site

- `index.html`: homepage copy, services, engagements, and enquiry form.
- `styles.css`: layout, responsive styles, and visual identity.
- `main.js`: mobile navigation, approach accordion, and enquiry dialog.
- `content/tech-notes.mjs`: six practical technical references with examples and code.
- `content/papers.mjs`: three full technical position papers with abstracts, arguments, hypothetical cases, counterarguments, limitations, methods, and annotated primary references.
- `content/client-problems.mjs`: the motivation behind the practice and six client situations, diagnostic questions, work products, and decisions.
- `content/client-rationale.mjs`: the separate client case for acting: affected roles, consequences, evidence, improvement criteria, and when external help is justified.
- `content/blog.mjs`: four original long-form blog essays adapted from the supplied notes.
- `content/articles.mjs`: the three original essays, retained at their existing `/writing/` URLs and included in the blog.
- `content/catalog.mjs`: collection metadata, publication routes, related reading, and reading-time calculation.
- `scripts/render.mjs`: collection and article templates, homepage counts, sitemap, and RSS feed.
- `assets/system.svg`: original vector illustration.

The site uses system fonts and makes no third-party font, analytics, or script requests. The enquiry form opens a prefilled email draft to **hello@eml.systems**; the visitor sends it from their email application. It does not store submissions or claim that a message has been delivered.

## Writing collections

`/papers/` contains three full technical position papers on evaluation as decision evidence, diagnosing AI system failures, and human–AI work allocation and ownership. The papers distinguish the proposed methods and hypothetical examples from the findings supported by their references. Section citations link to an annotated bibliography; a print button opens the browser's print dialog, where readers can save a PDF. Print styles include reference URLs and omit site navigation.

`/notes/` contains six technical notes covering evaluation coverage, failure diagnosis, retrieval provenance, coding-agent ownership, experiment design, and automated evaluators. `/blog/` contains seven essays on product outcomes, production commitments, interfaces, quality ownership, and engineering practice. All three indexes support combined topic filtering and title/topic search, shareable filter URLs, and a clear empty state. Every publication is fully rendered in static HTML, with section navigation and related reading. `/feed.xml` is the blog RSS feed.

`/problems/` separately explains why EML works across the whole system and why clients seek help. Six situations cover product direction, production readiness, evaluation usefulness, unexplained failures, quality ownership, and coding-agent throughput. Each develops the buyer's motivation, possible causes, diagnostic questions, concrete work, and the decision an engagement should unlock. Causes are hypotheses to investigate, not claims about every client.

The dedicated `/problems/#why-act` section makes the business rationale explicit before the detailed diagnoses. It connects each situation to affected roles, stakes, evidence that would establish it for a particular client, and observable improvement. Native disclosure panels keep the complete copy available without JavaScript. The section also explains when specialist help is useful and when an internal next step is sufficient. EML’s own motivation is separately linked at `/problems/#why-eml`. These are reasoned positioning hypotheses grounded in the notes; the site does not present them as validated market-demand research or client results.

To add a note or essay, add an entry to the relevant content module with `slug`, `title`, `category`, `standfirst`, `tags`, and `sections`. Each section has a `heading`, paragraph strings in `text`, and optional `bullets`, `code`, and `codeLanguage`. Notes use the categories in `collections.notes.categories`; blog entries use `collections.blog.categories`. Reading time and public indexes are generated automatically. The optional `sourceNotes` field records local editorial provenance and is excluded from all public artifacts.

Papers additionally have `abstract`, `thesis`, `methodNote`, and `references`. A reference contains `id`, `title`, `url` (HTTPS), and `note` explaining its relevance and limits. A section's optional `citations` array names reference IDs; unresolved citations fail rendering. Add a new category to its collection metadata when needed. Client problem `reading` arrays contain canonical local publication routes; invalid routes fail the build.

Domain: **https://eml.systems**. Canonical URLs, social metadata, robots.txt, and sitemap use that domain. Update those values together if the domain changes. A 1200 × 630 JPEG social card is included alongside its editable SVG source in `assets/`.

## Editorial basis

Copy was developed from the supplied consulting, AI, and AI engineering notes. The site describes a principal-led practice and emphasizes complete products, practical engineering, evidence, and continued learning. It does not claim clients, measured results, fixed pricing, company registration, or credentials that the notes did not establish. Private business-planning material is not included in the build.
