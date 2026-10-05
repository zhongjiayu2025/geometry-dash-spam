import type { Metadata } from "next";
import Link from "next/link";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../../data/demons";

export const metadata: Metadata = {
  title: "What Is the Hardest Level in Geometry Dash? Current #1 Demon",
  description:
    "See the current hardest Geometry Dash level according to Pointercrate, plus the verification date and top five Demon List positions.",
  alternates: { canonical: "/hardest-level" },
};

export default function HardestLevelPage() {
  const numberOne = DEMONS[0];

  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          Checked {DEMON_VERIFIED_AT}
        </p>
        <h1 className="mb-5 text-3xl font-display font-bold text-white md:text-5xl">
          What Is the Hardest Level in Geometry Dash?
        </h1>
        <div className="rounded-2xl border border-purple-500/25 bg-purple-950/20 p-6 text-lg leading-8 text-slate-200">
          As of <strong>{DEMON_VERIFIED_AT}</strong>, Pointercrate ranks{" "}
          <strong className="text-white">{numberOne.level}</strong> by {numberOne.publisher} at #1 on its Geometry Dash Demonlist.
          Rankings can change, so the live source should be checked when the exact current position matters.
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Current top five</h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          {DEMONS.slice(0, 5).map((item) => (
            <div key={item.rank} className="flex items-center gap-4 border-b border-white/5 bg-slate-900/25 px-5 py-4 last:border-b-0">
              <span className="w-10 font-mono font-bold text-blue-400">#{item.rank}</span>
              <div>
                <div className="font-semibold text-white">{item.level}</div>
                <div className="text-xs text-slate-500">Published by {item.publisher}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 space-y-4 text-slate-400">
        <h2 className="text-2xl font-bold text-white">How this answer is maintained</h2>
        <p className="leading-7">
          This page does not treat “hardest level” as a permanent fact. It records the source and date used for the answer so later ranking changes can be audited.
        </p>
        <a href={DEMON_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-blue-400 hover:text-blue-300">
          Open the live Pointercrate Demonlist →
        </a>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/demon-list" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">Full Demon List</Link>
        <Link href="/geometry-dash-wave" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Practice Wave</Link>
      </div>
    </article>
  );
}
