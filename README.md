# Geometry Dash Spam

Source code for **geometrydashspam.cc**, a browser-based Geometry Dash training and reference site focused on spam, wave control, CPS and demon-list discovery.

## Core pages

- `/` — Geometry Dash Spam Test
- `/geometry-dash-wave` — Wave trainer
- `/cps-test` — Geometry Dash / GD CPS test with 1–60 second modes and local run history
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

The project is intentionally designed to run without a paid database or application server. CPS history, wave-run history and personal-best data are stored locally in the browser where appropriate.

## Development

Requirements: Node.js 22+ recommended.

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run check
npm run build
npm run verify
```

The verification step checks core static routes, internal links, sitemap targets, canonical URLs and required metadata before deployment.


## Architecture invariants

- Keep the global `Header` server-rendered. Route highlighting and native menu cleanup belong in the tiny `HeaderRouteState` client helper.
- Keep article bodies, SEO guides, related-tool copy and structured data in Server Components whenever they do not require browser state.
- Keep `CpsTest`, `WaveSimulator` and `GameCanvas` focused on interaction only; do not move static SEO copy back into those client bundles.
- Wave movement must remain delta-time normalized so 60 Hz, 120 Hz and other displays do not change the intended practice speed.
- Wave audio is opt-in on first visit. Do not initialize Web Audio while muted.
- Jitter, Butterfly and Right Click audio also stays opt-in and lazy-loaded through the shared `lib/clickSound.ts` chunk.
- Demon List rows stay server-rendered; only the small filter controller may hydrate and progressively hide/show rows.
- Geometry Dash Clicker persistence is debounced and flushed on exit; do not synchronously write localStorage on every click.
- Large 1200×630 social previews use `summary_large_image` on every sitemap-indexed page.
- Lower-priority click-method utilities may exist as contextual links, but should not return to the global Header.
- Long below-the-fold guides may use `content-visibility: auto`; their HTML must still be fully present in the static export.

The CI export verifier protects these boundaries in addition to metadata, sitemap, redirect, data freshness, internal-link and indexability checks.

## SEO / GEO standard

This project follows the owner baseline in [chenmu2024/Website-Starter-Standard](https://github.com/chenmu2024/Website-Starter-Standard), with the project-specific rules in `SEO-GEO.md`, the completed architecture in `SEO-GEO-PROJECT-BRIEF.md`, release proof in `SEO-GEO-RELEASE-EVIDENCE.md`, and the public drift baseline in `SEO-GEO-BASELINE.md`.

The public repository intentionally does not store private Search Console or analytics performance data.

Project governance files:

- `DESIGN.md` — Geometry Dash Spam visual system and UI guardrails.
- `QA-CHECKLIST.md` — project-specific release/visual/accessibility QA.
- `ADS-CONSENT.md` — AdSense consent/CMP setup notes and the account-side action that cannot be verified from source code alone.
- `SEO-GEO-PROJECT-BRIEF.md` — search intent, indexation, source, entity and crawler architecture.
- `SEO-GEO-RELEASE-EVIDENCE.md` — release proof and production verification.

## SEO and content policy

- Preserve established URLs such as `/cps-test`.
- Keep one clear primary search intent per core page.
- Do not publish fabricated ratings, player counts, interviews or precision claims.
- Time-sensitive Demon List claims must show a source and a verification date.
- Sitemap entries must resolve to real indexable pages.
- Keep `llms.txt` limited to canonical, indexable public pages and treat it as optional interoperability metadata, not a ranking signal.
- Keep About/Contact entity and correction-path schema aligned with visible site policy.

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
