# Adsterra Social Bar integration — 2026-11-09

## Owner-supplied placement

The owner supplied an Adsterra Social Bar code for geometrydashspam.cc and requested the script immediately before closing `</body>` on every page.

```html
<script data-cfasync="false" src="https://bauval.org/14/a5024f416ca331965f268098798e5cd1"></script>
```

Implementation: `app/layout.tsx`, immediately after `<Footer />` and before `</body>`. The script is not an official Google AdSense script and should not be confused with existing `components/AdSenseHead.tsx`.

## Quality and safeguards

- Google AdSense retained on its 9 eligible routes; Adsterra loaded on every HTML page per the owner's request.
- The exact Adsterra URL is allowlisted, not arbitrary networks.
- A build-time check inspects all exported HTML pages for one Social Bar script tag within the body, and confirms `data-cfasync="false"`.
- A production check probes representative pages after Cloudflare deploy.
- The site's privacy disclosures now mention both networks.
- Do not add an Adsterra seller ID to `ads.txt` unless independently supplied or confirmed by the provider.

## Important external considerations

- Google AdSense restricts disruptive popups, popunders and unwanted redirections, including those triggered by other ad networks. Social Bar can include overlay-like variants; verify actual ads do not obscure the trainer, create popunders or interrupt navigation.
- The user's AdSense low-value content review has not been confirmed as approved; loading this format may increase policy risk. Do not represent successful technical deployment as AdSense compatibility or approval.
- Adsterra dashboard activation, applicable consent/TCF configuration and real mobile creative behavior require external review. Current Google CMP is not automatically consent for Adsterra.
