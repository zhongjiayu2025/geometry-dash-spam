import { DEMON_VERIFIED_AT } from "../../data/demons";

export const dynamic = "force-static";

export function GET() {
  const cloudflareCommit = process.env.CF_PAGES_COMMIT_SHA;
  const githubCommit = process.env.GITHUB_SHA;

  return Response.json(
    {
      commit: cloudflareCommit || githubCommit || "unknown",
      buildSource: cloudflareCommit
        ? "cloudflare-pages"
        : githubCommit
          ? "github-actions"
          : "local",
      demonVerifiedAt: DEMON_VERIFIED_AT,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow",
      },
    }
  );
}
