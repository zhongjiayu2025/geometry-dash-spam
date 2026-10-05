# Geometry Dash Spam

Source code for **geometrydashspam.cc**, a browser-based Geometry Dash training and reference site focused on spam, wave control, CPS and demon-list discovery.

## Core pages

- `/` — Geometry Dash Spam Test
- `/geometry-dash-wave` — Wave trainer
- `/cps-test` — Geometry Dash CPS test
- `/demon-list` — Sourced Demon List snapshot
- `/hardest-level` — Current hardest-level answer page
- `/easiest-demons` — Beginner demon route
- `/geometry-dash-clicker` — Lightweight clicker game

Secondary mouse, keyboard, reaction and memory tools remain available under **More Tools**.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Static export (`output: "export"`)

The project is intentionally designed to run without a paid database or application server. Local personal-best data is stored in the browser where appropriate.

## Development

Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## SEO and content policy

- Preserve established URLs such as `/cps-test`.
- Keep one clear primary search intent per core page.
- Do not publish fabricated ratings, player counts, interviews or precision claims.
- Time-sensitive Demon List claims must show a source and a verification date.
- Sitemap entries must resolve to real indexable pages.

## Deployment

The site is configured for static export and can be deployed to Cloudflare Pages or any static host.

Build command:

```bash
npm run build
```

Output directory:

```text
out
```

## Disclaimer

This is a fan-made training and reference project and is not affiliated with RobTop Games.
