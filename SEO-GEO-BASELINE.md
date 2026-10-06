# SEO / GEO Technical Baseline

Baseline date: 2026-10-07  
Site: https://geometrydashspam.cc  
Framework: Next.js static export

This file records the accepted public technical baseline for drift detection. Private Search Console and analytics numbers are intentionally not stored in this public repository.

## Core architecture

- Canonical host: `https://geometrydashspam.cc`
- Primary language: English
- Rendering: static export for public SEO pages
- Search sitemap: `/sitemap.xml`
- Human sitemap: `/sitemap`
- Robots: `/robots.txt`
- Optional AI interoperability file: `/llms.txt`
- Global entity graph: Organization + WebSite
- Main topic hubs: Spam Test, Wave, CPS, Demon List, Codes, Guides

## Protected core routes

- `/`
- `/geometry-dash-wave`
- `/cps-test`
- `/demon-list`
- `/spam-challenge-list`
- `/demon-list/spam-demons`
- `/demon-list/wave-demons`
- `/hardest-level`
- `/geometry-dash-codes`
- `/blog`

## Current quality gates

The export verifier protects:

- required routes
- removed legacy routes and permanent redirects
- canonical/index/noindex policy
- sitemap ↔ indexable-page parity
- sitemap freshness for source-sensitive pages
- unique title and description checks
- one H1 on sitemap pages
- Open Graph / Twitter metadata
- broken internal links
- orphan sitemap pages
- authority leakage from core pages into noindex utilities
- core-page interlinking
- HTML sitemap coverage
- explanatory support guides
- search-intent clusters
- source data → rendered page consistency
- WebApplication schema on interactive tools
- visible FAQ/schema parity for selected search pages

## Drift rules

A future change should be treated as a regression when it unintentionally:

- changes a protected canonical URL
- removes a core page from the sitemap
- creates an indexable orphan
- turns a noindex utility into an indexable page without an intent decision
- removes source/check dates from changing factual claims
- moves the only important SEO copy into client-only rendering
- breaks an established intent cluster
- changes the public site entity identity or correction path
- makes `llms.txt` point to noindex, redirected, or nonexistent pages

## Measurement policy

Search performance, CrUX and analytics are evaluated separately from this public baseline. Do not infer field performance from lab tests or repository code.
