import type { Metadata } from "next";
import Link from "next/link";

const COLLECTIBLES_SOURCE = "https://geometrydash.wiki.gg/wiki/Collectibles";
const EVENT_SOURCE = "https://geometrydash.wiki.gg/wiki/Event_Level";
const TREASURE_SOURCE = "https://geometrydash.wiki.gg/wiki/Treasure_Room";
const CHECKED_AT = "2026-10-05";

export const metadata: Metadata = {
  title: "How to Get Gold Keys in Geometry Dash – Current Methods",
  description:
    "Learn how to get Gold Keys in Geometry Dash from eligible Event Level reward chests and Secret Room codes, and where to use them.",
  alternates: { canonical: "/how-to-get-gold-keys-geometry-dash" },
};

export default function GoldKeysPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get Gold Keys in Geometry Dash",
    dateModified: CHECKED_AT,
    step: [
      {
        "@type": "HowToStep",
        name: "Complete an eligible Event Level",
        text: "Some Event Level reward chests contain a Gold Key. The reward depends on the specific event.",
      },
      {
        "@type": "HowToStep",
        name: "Redeem eligible Secret Room codes",
        text: "Some active Wraith/Secret Room codes can grant Gold Keys or key rewards.",
      },
      {
        "@type": "HowToStep",
        name: "Use Gold Keys in the Treasure Room",
        text: "Gold Keys open the gold chests on the fourth page of the Treasure Room.",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
            Gold Key guide · source checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            How to Get Gold Keys in Geometry Dash
          </h1>
          <p className="leading-7 text-slate-400">
            Gold Keys are different from regular Demon Keys. The official wiki lists two acquisition routes:
            reward chests from specific <strong className="text-white">Event Levels</strong> and eligible{" "}
            <strong className="text-white">Secret Room/Wraith codes</strong>.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-400">Method 1</p>
            <h2 className="mb-3 text-2xl font-bold text-white">Complete eligible Event Levels</h2>
            <p className="leading-7 text-slate-400">
              Event Level completion gives a reward chest. Depending on the event, that chest can contain a Demon Key or a Gold Key.
              The wiki notes that all Demon Event levels to date, plus some non-Demon events, have awarded Gold Keys.
            </p>
            <a href={EVENT_SOURCE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:underline">
              Check Event Level source →
            </a>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-400">Method 2</p>
            <h2 className="mb-3 text-2xl font-bold text-white">Use eligible Wraith codes</h2>
            <p className="leading-7 text-slate-400">
              The Secret Room, commonly called The Wraith, uses server-side codes. Some code rewards can include keys.
              Because Wraith codes can be enabled or disabled without a client update, use the current code list rather than an old screenshot.
            </p>
            <Link href="/geometry-dash-codes#wraith" className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:underline">
              Open current Wraith codes →
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-white">Where do you use Gold Keys?</h2>
          <p className="leading-7 text-slate-400">
            Gold Keys are used on the <strong className="text-white">fourth page of the Treasure Room</strong>.
            That page contains 20 gold chests, and each gold chest costs one Gold Key to open.
          </p>
          <a href={TREASURE_SOURCE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:underline">
            Treasure Room source →
          </a>
        </section>

        <section className="mt-10 rounded-xl border border-white/10 bg-black/20 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">Gold Key vs Demon Key</h2>
          <p className="leading-7 text-slate-400">
            Regular Demon Keys open the standard Treasure Room chest tiers. Gold Keys specifically open gold chests.
            Do not farm 500 mana-orb intervals expecting them to create Gold Keys; that progression is associated with regular Demon Keys.
          </p>
          <a href={COLLECTIBLES_SOURCE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:underline">
            Key source →
          </a>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/geometry-dash-codes" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
            Geometry Dash Codes
          </Link>
          <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Demon List
          </Link>
        </div>
      </article>
    </>
  );
}
