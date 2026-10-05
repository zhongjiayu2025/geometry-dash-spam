import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Geometry Dash Spam Demons – Rapid Input Practice Guide",
  description:
    "Learn how to practice Geometry Dash spam-heavy demon sections with CPS, consistency and wave-control tools.",
  alternates: { canonical: "/demon-list/spam-demons" },
};

export default function SpamDemonsPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Rapid-input training</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Geometry Dash Spam Demons</h1>
        <p className="leading-7 text-slate-400">
          There is no official universal “spam demon” ranking. This page focuses on the skill itself: rapid inputs, repeatable click spacing and keeping control when a section gets tight.
        </p>
      </header>

      <section className="space-y-4">
        {[
          ["Measure sustainable speed", "A one-second peak CPS score is less useful than the speed you can repeat without losing timing."],
          ["Train the movement", "Use the spam simulator to practice turning rapid inputs into controlled wave motion."],
          ["Increase difficulty gradually", "Narrower gaps only help when you can still reproduce similar runs instead of relying on lucky attempts."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
            <p className="leading-7 text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Spam Test</Link>
        <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">CPS Test</Link>
        <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Demon List</Link>
      </div>
    </article>
  );
}
