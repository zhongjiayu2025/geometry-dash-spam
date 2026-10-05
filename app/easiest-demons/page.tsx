import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Easiest Demons in Geometry Dash | 5 Beginner Picks",
  description:
    "Looking for the easiest demons in Geometry Dash? Compare five common beginner picks, their practice focus and a practical progression path.",
  alternates: { canonical: "/easiest-demons" },
  openGraph: {
    title: "Easiest Demons in Geometry Dash | 5 Beginner Picks",
    description: "Looking for the easiest demons in Geometry Dash? Compare five common beginner picks, their practice focus and a practical progression path.",
    url: "https://geometrydashspam.cc/easiest-demons",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Easiest Demons in Geometry Dash | 5 Beginner Picks",
    description: "Looking for the easiest demons in Geometry Dash? Compare five common beginner picks, their practice focus and a practical progression path.",
  },
};

const easiestFaqs = [
  {
    q: "What are some of the easiest demons in Geometry Dash?",
    a: "Common beginner picks include The Nightmare, The Lightning Road, Platinum Adventure, Demon Mixed and Speed Racer. This is a practice-oriented shortlist, not an official easiest-to-hardest ranking.",
  },
  {
    q: "Is there an official easiest Demon in Geometry Dash?",
    a: "No. Demon sub-difficulty and player experience do not create one universal easiest level. Different mechanics can make a level feel easier or harder to different players.",
  },
  {
    q: "What should I practice before my first Demon?",
    a: "Build repeatable timing first, then isolate the mechanic that causes most failures. Use wave practice or a CPS test only when that specific skill is relevant to the level.",
  },
];

const recommendations = [
  { level: "The Nightmare", focus: "Basic timing and confidence", bestFor: "First demon attempts" },
  { level: "The Lightning Road", focus: "Simple timing and memorization", bestFor: "Early demon practice" },
  { level: "Platinum Adventure", focus: "Mixed beginner mechanics", bestFor: "General progression" },
  { level: "Demon Mixed", focus: "Short mixed-skill sections", bestFor: "Learning demon pacing" },
  { level: "Speed Racer", focus: "Timing at a faster pace", bestFor: "Moving beyond very easy demons" },
];

export default function EasiestDemonsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: easiestFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Easiest Demons", href: "/easiest-demons" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <article className="mx-auto max-w-5xl">
      <header className="mx-auto mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Beginner progression</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Easiest Demons in Geometry Dash</h1>
        <p className="leading-7 text-slate-400">
          There is no official universal “easiest demon” ranking because player skillsets differ. These are common beginner practice picks, not a claimed authoritative order.
        </p>
      </header>

      <div className="space-y-3 md:hidden">
        {recommendations.map((item) => (
          <div key={item.level} className="rounded-xl border border-white/10 bg-slate-950/25 p-4">
            <h2 className="font-semibold text-white">{item.level}</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <div><span className="text-slate-500">Practice focus:</span> <span className="text-slate-300">{item.focus}</span></div>
              <div><span className="text-slate-500">Best for:</span> <span className="text-slate-300">{item.bestFor}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="w-full text-left text-sm">
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

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Easiest Demons FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {easiestFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
    </>
  );
}
