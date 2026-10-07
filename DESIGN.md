# Geometry Dash Spam — Design System

Status: production design baseline  
Production: https://geometrydashspam.cc  
Last reviewed: 2026-10-07

This file freezes the site's current visual language so future AI/code changes do not drift into unrelated generic SaaS styling.

## 1. Product and visual positioning

- Product: browser-based Geometry Dash spam, wave, CPS and input-practice tools plus source-checked guides.
- Audience: Geometry Dash players, challenge players and users comparing click/input behavior.
- Primary task: start a practice/test quickly, understand the result, then continue into the relevant guide or related tool.
- Brand personality: technical, game-adjacent, fast, precise, dark, competitive without pretending to be an official game UI.
- Desired perception: focused practice lab rather than generic gaming portal.
- Design direction: dark navy canvas, restrained blue/fuchsia/purple accents, high-contrast white headings, compact data panels, grid/technical motifs.
- Do not clone official Geometry Dash assets or RobTop branding.

## 2. Visual theme

The site uses a dark technical training-lab aesthetic:

- near-black/navy canvas
- subtle grid texture
- strong white headings
- slate body copy
- blue as the primary action color
- fuchsia/purple only for secondary topic clusters such as spam/SCL
- borders and surface contrast before shadows
- gradients only when they reinforce depth or section hierarchy
- glow/blur kept subtle and off the critical reading path

Avoid adding decorative glassmorphism, rainbow gradients, neon overload or generic AI-SaaS hero patterns.

## 3. Color system

| Token | Value | Role |
|---|---|---|
| canvas | #020617 | Global background |
| surface-1 | #0b1021 | Navigation/menu elevated surface |
| surface-2 | #0f172a | Cards/panels |
| ink | #ffffff | Primary heading text |
| body | #cbd5e1 | Main body text |
| muted | #94a3b8 | Secondary copy |
| subtle | #64748b | Metadata/tertiary text |
| hairline | rgba(255,255,255,.10) | Borders/dividers |
| primary | #2563eb / #3b82f6 | Main action |
| primary-soft | #60a5fa | Links/highlights |
| spam-accent | fuchsia-300/500 family | SCL/spam ranking cluster |
| wave-accent | blue-300/500 family | Wave cluster |
| success | green-400 | Positive state |
| warning | amber/yellow-400 | Warning state |
| error | red-400/500 | Error state |

Rules:
- Blue remains the default action color.
- Fuchsia/purple are contextual accents, not global primary colors.
- Red is reserved for destructive/error state.
- Avoid arbitrary one-off colors outside the established Tailwind families.

## 4. Typography

- Display: Orbitron, via `--font-orbitron`
- Body: Inter, via `--font-inter`
- Technical/metadata: system monospace / `font-mono`

Use:
- Hero: 3xl–6xl depending on route and viewport.
- Section H2: 2xl–3xl.
- Card H3: base–xl.
- Body: sm–base with comfortable 1.5–1.75 line height.
- Metadata: xs–sm.

Uppercase is allowed for compact labels, HUDs and major tool-brand headings; do not uppercase long prose.

## 5. Spacing

Base rhythm: 4px Tailwind scale.

- compact controls: 8–12px gaps
- card padding: 16–24px
- major panel padding: 24–32px
- section spacing: 40–64px
- main content top offset accounts for fixed header
- mobile gutters: 16px
- desktop max width: `max-w-7xl`
- reading width: generally `max-w-4xl` to `max-w-5xl`

## 6. Shape and depth

- compact controls: rounded-lg
- content cards: rounded-xl
- hero/major panels: rounded-2xl
- pills: rounded-full only for tags/status
- primary elevation: border + darker/lighter surface
- heavy shadow only for menus, major floating panels or social preview composition
- blur/glow should never reduce text contrast

## 7. Core components

### Header
- fixed, dark, high contrast
- core routes visible on desktop
- compact mobile menu
- no bloated mega-menu
- More GD holds secondary topic pages

### Primary button
- blue background, white text
- clear hover state
- visible focus state
- minimum practical touch target around 44px where possible

### Secondary button
- dark/slate surface, border, white/slate text
- should not visually overpower the primary action

### Tool panel
- interactive area is visually dominant above the fold
- result/state changes must be obvious
- instructions stay short near the control; detailed explanation goes below

### Result panel
- result number/state is the strongest element
- units and limitations stay adjacent to the metric
- avoid presenting browser diagnostics as certified hardware values

### Content card
- meaningful heading
- short supporting description
- border/surface hierarchy
- link card must have an obvious hover/focus treatment

### Breadcrumb
- compact, muted, crawlable links
- reflects real information architecture

## 8. Imagery

Preferred order:
1. first-party tool screenshots or diagrams
2. first-party generated charts/visual explanations
3. relevant external editorial imagery only when it adds real context

Do not use logos as generic filler.

Blog cover direction:
- blog covers use first-party branded vector visuals stored under `/public/blog-covers/`
- future upgrades may replace a vector with an actual tool screenshot/diagram when that adds more explanatory value
- social sharing uses the site-owned 1200×630 PNG Open Graph image for broad crawler compatibility
- keep subject matter understandable without overlaid keyword stuffing

### Inline editorial visuals
- Use same-origin diagrams when a concept is easier to understand visually than through another paragraph.
- Every diagram needs meaningful alt text and a short caption that states whether values are illustrative or measured.
- Do not invent benchmark numbers; illustrative values must be labeled as examples.
- Reuse a diagram only when it explains the same underlying concept.

## 9. Motion

- default transitions: 150–250ms
- allowed: hover color, small translate/scale, menu expansion, result transitions
- prohibited: constant parallax, aggressive pulsing, autoplay decorative motion
- reduced-motion must disable or minimize transitions/animations

## 10. Responsive behavior

- Mobile: single-column tool/content flow; fixed header; touch-first controls.
- Tablet: 2-column supporting grids where useful.
- Desktop: tool/content can use wider panels; sidebars only when they materially help navigation.
- Wide: content remains constrained; do not stretch reading text across the full viewport.
- Horizontal scrolling is allowed only for intentional tables/data regions.

## 11. Accessibility

- visible `:focus-visible` outline
- semantic headings and landmarks
- keyboard-operable controls
- no color-only status communication
- body copy must retain strong contrast on dark surfaces
- touch targets should be usable on mobile
- respect `prefers-reduced-motion`
- decorative backgrounds should be `aria-hidden`

## 12. Do / Don't

### Do
- keep tools visually dominant
- keep results readable in seconds
- reuse existing blue/slate/fuchsia topic language
- use compact technical labels where they help scanning
- keep long SEO/GEO copy below the interaction area
- use first-party visual assets where possible

### Don't
- redesign core pages into a generic SaaS landing page
- add arbitrary colors, glass effects or heavy glow
- move important SEO copy into client-only rendering
- create inconsistent one-off button/card styles
- copy official Geometry Dash art or UI
- bury the actual tool under marketing content

## 13. AI implementation rules

Before a UI change:
1. Read this file.
2. Reuse current patterns and Tailwind families.
3. Preserve the core tool-first hierarchy.
4. If a visual language change is necessary, update this file first.
5. Verify mobile, tablet and desktop after implementation.
