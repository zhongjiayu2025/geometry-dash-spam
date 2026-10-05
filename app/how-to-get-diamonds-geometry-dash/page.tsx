import type { Metadata } from "next";
import Link from "next/link";

const SOURCE_URL = "https://geometrydash.wiki.gg/wiki/Collectibles";
const CHECKED_AT = "2026-10-05";

export const metadata: Metadata = {
  title: "How to Get Diamonds in Geometry Dash – All Main Methods",
  description:
    "Learn how to get diamonds in Geometry Dash through daily chests, quests, Daily and Weekly levels, Treasure Room chests, Gauntlets and Paths.",
  alternates: { canonical: "/how-to-get-diamonds-geometry-dash" },
  openGraph: {
    title: "How to Get Diamonds in Geometry Dash – All Main Methods",
    description: "Learn how to get diamonds in Geometry Dash through daily chests, quests, Daily and Weekly levels, Treasure Room chests, Gauntlets and Paths.",
    url: "https://geometrydashspam.cc/how-to-get-diamonds-geometry-dash",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "How to Get Diamonds in Geometry Dash – All Main Methods",
    description: "Learn how to get diamonds in Geometry Dash through daily chests, quests, Daily and Weekly levels, Treasure Room chests, Gauntlets and Paths.",
  },
};

const methods = [
  {
    title: "Open daily chests",
    detail:
      "Daily reward chests are one of the repeatable diamond sources. Claim them when they become available instead of leaving them unopened.",
    cadence: "Repeatable",
  },
  {
    title: "Complete daily quests",
    detail:
      "Quests award diamonds when their objectives are completed. They are useful because the tasks can be progressed alongside normal play.",
    cadence: "Repeatable",
  },
  {
    title: "Play the Daily Level and Weekly Demon",
    detail:
      "Forward progress in the Daily Level and Weekly Demon awards diamonds, and the Weekly Demon also has a completion chest.",
    cadence: "Rotating",
  },
  {
    title: "Open Treasure Room chests",
    detail:
      "Treasure Room chests can contain diamonds together with other collectibles. You need Demon Keys to open the regular chest tiers.",
    cadence: "Key-limited",
  },
  {
    title: "Complete Gauntlet levels",
    detail:
      "Gauntlets award diamonds for level progress and can award additional diamonds when a gauntlet is completed.",
    cadence: "Progression",
  },
  {
    title: "Progress through Paths",
    detail:
      "Paths are another official source of diamonds as you advance through their reward tracks.",
    cadence: "Progression",
  },
];

export default function DiamondsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get Diamonds in Geometry Dash",
    dateModified: CHECKED_AT,
    step: methods.map((method, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: method.title,
      text: method.detail,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Progression guide · source checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            How to Get Diamonds in Geometry Dash
          </h1>
          <p className="leading-7 text-slate-400">
            The main legitimate diamond sources are daily chests, quests, Daily/Weekly content,
            Treasure Room chests, Gauntlets and Paths. Diamonds unlock progression content and,
            in Update 2.2, each diamond earned also grants a Diamond Shard.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {methods.map((method, index) => (
            <div key={method.title} className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">
                  {index + 1}. {method.title}
                </h2>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {method.cadence}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-400">{method.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-950/15 p-6 md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-white">A simple diamond routine</h2>
          <ol className="list-decimal space-y-2 pl-5 text-slate-400">
            <li>Claim available daily reward chests.</li>
            <li>Check current quests and combine them with the levels you already plan to play.</li>
            <li>Make progress on the current Daily Level and Weekly Demon.</li>
            <li>Use earned keys on Treasure Room chests and work through unfinished Gauntlets or Paths.</li>
          </ol>
        </section>

        <section className="mt-10 rounded-xl border border-white/10 bg-slate-900/25 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">How many diamonds does a Daily or Weekly level give?</h2>
          <p className="leading-7 text-slate-400">
            For non-Auto Daily/Weekly levels, the official wiki documents the available progress diamonds as
            two more than the level&apos;s star or moon rating. For example, a 10-star Demon has 12 progress diamonds available.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
            Official Wiki source
          </a>
          <Link href="/geometry-dash-codes" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Geometry Dash Codes
          </Link>
          <Link href="/easiest-demons" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Easiest Demons
          </Link>
        </div>
      </article>
    </>
  );
}
