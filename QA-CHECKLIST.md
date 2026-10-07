# Geometry Dash Spam — QA Checklist

Use this checklist before calling a major website release complete.

## Product

- [ ] Spam Test works end-to-end.
- [ ] Wave Trainer presets start, run and reset correctly.
- [ ] CPS durations run and finish correctly.
- [ ] Primary result metrics remain understandable.
- [ ] Demon/SCL/code pages expose their source and freshness context.
- [ ] No agreed important route is missing.

## Design system

- [ ] Current UI follows `DESIGN.md`.
- [ ] Blue remains the primary action language.
- [ ] Fuchsia/purple are used contextually rather than everywhere.
- [ ] No new generic AI-SaaS visual pattern was introduced.
- [ ] Tool controls remain visually stronger than below-the-fold SEO copy.

## Responsive / visual

- [ ] 360–390px mobile checked.
- [ ] Large mobile checked.
- [ ] Tablet checked.
- [ ] 1280px desktop checked.
- [ ] Wide desktop checked.
- [ ] Header/mobile menu works.
- [ ] No accidental horizontal overflow.
- [ ] Long Demon/code tables remain usable.
- [ ] Result panels remain readable without zooming.

## Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus ring is visible.
- [ ] Touch targets are practical on mobile.
- [ ] Reduced motion is respected.
- [ ] Important state is not communicated only by color.
- [ ] Images have meaningful alt text or are correctly decorative.

## SEO / GEO

- [ ] `npm run verify` passes.
- [ ] Approved core intents remain mapped to their canonical pages.
- [ ] No accidental noindex/index change.
- [ ] Sitemap contains only canonical indexable routes.
- [ ] No indexable orphan pages.
- [ ] No broken internal links.
- [ ] One H1 on important indexable routes.
- [ ] Primary answer/tool content is present in static HTML.
- [ ] Structured data matches visible content.
- [ ] Time-sensitive facts retain source/check-date handling.
- [ ] About keeps editorial identity and primary-source policy visible.
- [ ] `llms.txt` does not promote noindex/redirected pages.

## GEO / AI-search

- [ ] No duplicate AI-only answer pages.
- [ ] Important answer blocks are concise and self-contained.
- [ ] Original value is obvious: interactive tool, source-checked data, comparison or first-party measurement.
- [ ] Entity names stay consistent: Geometry Dash Spam / Geometry Dash Spam Editorial.
- [ ] No invented AI-visibility score.
- [ ] No special AI-only schema added without a real machine-understanding use.

## Content / media

- [ ] No placeholder variables render literally.
- [ ] No fabricated rankings, ratings, interviews or user counts.
- [ ] Blog cover images load.
- [ ] First-party visuals are preferred for high-value articles.
- [ ] No logo/stock-image filler where a tool screenshot/diagram would be more useful.

## Ads / privacy

- [ ] `ads.txt` contains the current publisher ID.
- [ ] AdSense tag is present once in the root layout.
- [ ] Referrer policy remains compatible with Google Privacy & messaging.
- [ ] Google-certified CMP / European regulations message is published in AdSense for the production site if personalized ads are served to EEA/UK/Swiss users.
- [ ] Privacy policy URL in AdSense matches `https://geometrydashspam.cc/privacy`.
- [ ] Consent configuration is not confused with local practice-tool storage.

## Performance

- [ ] Production LCP measured on homepage, Wave and a representative blog page.
- [ ] Production INP/interactivity measured where available.
- [ ] CLS checked with ads loaded.
- [ ] Lab data is not mislabeled as CrUX field data.
- [ ] New images/fonts/scripts do not create obvious regressions.
- [ ] No unnecessary hydration was added to static content.

## Production

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] `npm run verify` passes.
- [ ] Production deployment verifier passes.
- [ ] `robots.txt` and `sitemap.xml` are reachable.
- [ ] Production serves the expected commit or a verified descendant.
- [ ] No obvious runtime/console failures on primary routes.

## Post-launch

- [ ] Search Console query → page ownership reviewed after enough data accumulates.
- [ ] Pages ranking roughly 4–15 with meaningful impressions are prioritized before broad rewrites.
- [ ] Existing winners are not repeatedly retitled without evidence.
- [ ] Cannibalization is checked before creating new routes.
- [ ] Backlink/community outreach is preferred over endless on-page micro-edits once the technical baseline is stable.
