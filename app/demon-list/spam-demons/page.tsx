import type { Metadata } from "next";
import Link from "next/link";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../../../data/demons";

export const metadata: Metadata = {
  title: "Geometry Dash Spam Demon List – Rapid Input Practice References",
  description:
    "A Geometry Dash spam-focused practice list using current Demon List positions for levels associated with demanding wave or rapid-input sections.",
  alternates: { canonical: "/demon-list/spam-demons" },
};

const SPAM_REFERENCES = [
  { name: "Sakupen Circles", note: "Tight wave sections make input spacing and rapid correction especially visible." },
  { name: "Slaughterhouse", note: "A useful high-end reference for repeated control under difficult transitions." },
  { name: "Ashley Wave Trials", note: "Wave-focused gameplay makes it useful when practicing sustained rapid input." },
  { name: "Silent clubstep", note: "Historically associated with extreme execution demands that go well beyond a simple CPS target." },
  { name: "Ultra Paracosm", note: "A circles-style reference for practicing fast but controlled wave inputs." },
];

export default function SpamDemonsPage() {
  const entries = SPAM_REFERENCES.map((reference) => ({
    ...reference,
    demon: DEMONS.find((item) => item.level === reference.name),
  })).filter((item) => item.demon);

  return (
    <article className="mx-auto max-w-5xl">
      <header className="mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
          Rapid-input practice · ranks checked {DEMON_VERIFIED_AT}
        </p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Geometry Dash Spam Demon List
        </h1>
        <p className="leading-7 text-slate-400">
          There is no official universal “spam demon” ranking. This page uses current Demon List positions
          only as context, then groups a few levels that are useful references when thinking about rapid
          input, wave control and repeatable click timing.
        </p>
      </header>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {entries.map(({ demon, note }) => demon && (
          <div key={demon.rank} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{demon.level}</h2>
                <p className="text-xs text-slate-500">Published by {demon.publisher}</p>
              </div>
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 font-mono text-sm font-bold text-purple-300">
                #{demon.rank}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-400">{note}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        {[
          ["Measure sustainable speed", "A one-second peak CPS score is less useful than a speed you can repeat without losing timing."],
          ["Train the movement", "Use the spam simulator to turn rapid inputs into controlled wave movement instead of chasing a number alone."],
          ["Increase difficulty gradually", "Narrower gaps help only when you can reproduce similar runs instead of relying on isolated lucky attempts."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-white/10 bg-black/20 p-6">
            <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
            <p className="leading-7 text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 rounded-xl border border-white/10 bg-slate-900/25 p-5 text-sm text-slate-400">
        The rank shown beside each level comes from the Pointercrate Main List snapshot.{" "}
        <a href={DEMON_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Open the live source
        </a>
        .
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Spam Test</Link>
        <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">CPS Test</Link>
        <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Full Demon List</Link>
      </div>
    </article>
  );
}
