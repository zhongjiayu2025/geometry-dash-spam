# Content-quality and crawler-access follow-up — 2026-11-09

## Code changes

1. Two Demon ranking pages no longer freeze Society at #2 or call an older placement "new". They report the current source-checked top positions from the maintained Demon data, making later list refreshes consistent with the text.
2. The Vault, Vault of Secrets, Chamber of Time and Wraith code tables now support a first-party personal checklist. Visitors can mark codes **tried**, filter by progress, and preserve selections in local browser storage. The overview and Vault of Secrets detail share the same room key.
3. The UI explicitly states that a check mark is **not a successful redemption**, not evidence of a reward and not a link to the user's game account. No server receives the status.
4. Build checks assert the new original tool value and ban the stale ranking text.
5. The production smoke test samples actual HTML responses for eight representative pages with browser-like and Googlebot-like user agents, rather than only robots.txt/sitemap.xml. This is not evidence that actual Google crawler IP addresses are trusted.

## Validation boundaries

Source merge, CI pass and Cloudflare production are separate states. Check CI and deploy-status before calling work live. A pass does not establish AdSense approval, full Google Search Console live URL inspection, comprehensive article originality, or regional Cloudflare WAF behavior. Some web fetch environments previously received HTTP 403 while GitHub-hosted probes were accepted: examine Cloudflare Security Events and actual Search Console results.

Do not delete existing SEO pages without evidence, falsify last-verified dates, or invent gameplay results.
