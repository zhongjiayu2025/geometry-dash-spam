import { MetadataRoute } from "next";
import { BLOG_POSTS } from "../data/blogContent";
import { DEMON_VERIFIED_AT } from "../data/demons";
import { VAULT_CODES_CHECKED_AT } from "../data/vaultCodes";

export const dynamic = "force-static";

const UPDATED = "2026-10-05";

const DEMON_ROUTES = new Set([
  "/demon-list",
  "/demon-list/wave-demons",
  "/demon-list/spam-demons",
  "/hardest-level",
]);

const CODE_ROUTES = new Set([
  "/geometry-dash-codes",
  "/geometry-dash-vault-of-secrets-codes",
  "/how-to-get-gold-keys-geometry-dash",
]);

const CORE_ROUTES = [
  "",
  "/geometry-dash-wave",
  "/cps-test",
  "/demon-list",
  "/demon-list/wave-demons",
  "/demon-list/spam-demons",
  "/hardest-level",
  "/easiest-demons",
  "/geometry-dash-clicker",
  "/geometry-dash-codes",
  "/geometry-dash-vault-of-secrets-codes",
  "/how-to-get-diamonds-geometry-dash",
  "/how-to-get-gold-keys-geometry-dash",
  "/geometry-dash-difficulty-faces",
  "/geometry-dash-stuttering-high-end-pc",
  "/jitter-click",
  "/butterfly-click",
  "/drag-click",
  "/spacebar-counter",
  "/scroll-test",
  "/reaction-test",
  "/sound-reaction",
  "/chimp-test",
  "/visual-memory",
  "/aim-trainer",
  "/keyboard-latency",
  "/polling-rate",
  "/mouse-acceleration",
  "/keyboard-ghosting",
  "/key-rollover",
  "/bpm-tapper",
  "/refresh-rate",
  "/right-click",
  "/double-click",
  "/typing-test",
  "/system-info",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/sitemap",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geometrydashspam.cc";

  const routeEntries: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: DEMON_ROUTES.has(route)
      ? DEMON_VERIFIED_AT
      : CODE_ROUTES.has(route)
        ? VAULT_CODES_CHECKED_AT
        : UPDATED,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated ?? post.date,
  }));

  return [...routeEntries, ...blogEntries];
}
