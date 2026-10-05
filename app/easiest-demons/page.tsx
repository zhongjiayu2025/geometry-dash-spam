import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Easiest Demons in Geometry Dash – Beginner Practice Guide",
  description:
    "A beginner-focused Geometry Dash Easy Demon guide with common starter picks, skill focus and a practical progression path.",
  alternates: { canonical: "/easiest-demons" },
  openGraph: {
    title: "Easiest Demons in Geometry Dash – Beginner Practice Guide",
    description: "A beginner-focused Geometry Dash Easy Demon guide with common starter picks, skill focus and a practical progression path.",
    url: "https://geometrydashspam.cc/easiest-demons",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Easiest Demons in Geometry Dash – Beginner Practice Guide",
    description: "A beginner-focused Geometry Dash Easy Demon guide with common starter picks, skill focus and a practical progression path.",
  },
};

const recommendations = [
  { level: "The Nightmare", focus: "Basic timing and confidence", bestFor: "First demon attempts" },
  { level: "The Lightning Road", focus: "Simple timing and memorization", bestFor: "Early demon practice" },
  { level: "Platinum Adventure", focus: "Mixed beginner mechanics", bestFor: "General progression" },
  { level: "Demon Mixed", focus: "Short mixed-skill sections", bestFor: "Learning demon pacing" },
  { level: "Speed Racer", focus: "Timing at a faster pace", bestFor: "Moving beyond very easy demons" },
];

export default function EasiestDemonsPage() {
  return (
    <article className="mx-auto max-w-5xl">
      <header className="mx-auto mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Beginner progression</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Easiest Demons in Geometry Dash</h1>
        <p className="leading-7 text-slate-400">
          There is no official universal “easiest demon” ranking because player skillsets differ. These are common beginner practice picks, not a claimed authoritative order.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-4 py-3">Level</th><th className="px-4 py-3">Practice focus</th><th className="px-4 py-3">Best for</th></tr>
          </thead>
          <tbody>
            {recommendations.map((item) => (
              <tr key={item.level} className="border-t border-white/5 bg-slate-950/25">
                <td className="px-4 py-4 font-semibold text-white">{item.level}</td>
                <td className="px-4 py-4 text-slate-400">{item.focus}</td>
                <td className="px-4 py-4 text-slate-400">{item.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5"><h2 className="mb-2 font-bold text-white">Start with consistency</h2><p className="text-sm leading-6 text-slate-400">Repeatable clears are more useful than forcing a harder rating before the fundamentals are stable.</p></div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5"><h2 className="mb-2 font-bold text-white">Train weak mechanics</h2><p className="text-sm leading-6 text-slate-400">If wave control is the problem, isolate that mechanic instead of repeating the entire level.</p></div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5"><h2 className="mb-2 font-bold text-white">Use CPS as a diagnostic</h2><p className="text-sm leading-6 text-slate-400">Stable timing matters more than a single peak clicking score.</p></div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/geometry-dash-wave" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Wave Trainer</Link>
        <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">CPS Test</Link>
        <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Demon List</Link>
      </div>
    </article>
  );
}
