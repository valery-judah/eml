# EML Systems

A responsive, dependency-free website for EML Systems: AI product strategy, development, and engineering. Built with HTML, CSS, JavaScript, and Node.js 20+.

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
- `content/articles.mjs`: three original essays adapted from the supplied notes.
- `scripts/render.mjs`: article templates and sitemap.
- `assets/system.svg`: original vector illustration.

The site uses system fonts and makes no third-party font, analytics, or script requests. The enquiry form opens a prefilled email draft to **hello@eml.systems**; the visitor sends it from their email application. It does not store submissions or claim that a message has been delivered.

Domain: **https://eml.systems**. Canonical URLs, social metadata, robots.txt, and sitemap use that domain. Update those values together if the domain changes. A 1200 × 630 JPEG social card is included alongside its editable SVG source in `assets/`.

## Editorial basis

Copy was developed from the supplied consulting, AI, and AI engineering notes. The site describes a principal-led practice and emphasizes complete products, practical engineering, evidence, and continued learning. It does not claim clients, measured results, fixed pricing, company registration, or credentials that the notes did not establish. Private business-planning material is not included in the build.
