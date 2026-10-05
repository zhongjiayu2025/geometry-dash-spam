import type { Metadata } from "next";
import Link from "next/link";
import WaveSimulator from "../../components/WaveSimulator";

export const metadata: Metadata = {
  title: "Geometry Dash Wave – Online Wave Trainer & Simulator",
  description:
    "Practice Geometry Dash Wave control online with normal, mini and endless training modes. Improve wave spam consistency and precision in your browser.",
  alternates: { canonical: "/geometry-dash-wave" },
};

export default function GeometryDashWavePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Geometry Dash Wave Trainer",
    url: "https://geometrydashspam.cc/geometry-dash-wave",
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="mx-auto mb-8 max-w-4xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Wave practice</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Geometry Dash Wave Trainer</h1>
        <p className="leading-7 text-slate-400">
          Practice <strong className="text-slate-200">Geometry Dash Wave</strong> movement with normal or mini-wave controls, multiple difficulty presets and an endless mode for consistency training.
        </p>
      </header>

      <WaveSimulator />

      <section className="mx-auto mt-14 max-w-5xl space-y-10">
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-white">What is the Wave in Geometry Dash?</h2>
          <p className="leading-7 text-slate-400">
            Wave gameplay converts press-and-release timing into alternating diagonal movement. Tight wave sections reward precise input spacing: clicking faster only helps when the rhythm remains controlled enough to stay inside the corridor.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/25 p-5">
            <h2 className="mb-2 font-bold text-white">Normal Wave</h2>
            <p className="text-sm leading-6 text-slate-400">Build direction-change timing with the standard trainer profile.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/25 p-5">
            <h2 className="mb-2 font-bold text-white">Mini Wave</h2>
            <p className="text-sm leading-6 text-slate-400">Use the Mini Wave toggle for faster vertical movement and smaller correction windows.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/25 p-5">
            <h2 className="mb-2 font-bold text-white">Endless Practice</h2>
            <p className="text-sm leading-6 text-slate-400">Remove the fixed finish goal and focus on a repeatable personal-best run.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Spam Test</Link>
          <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">CPS Test</Link>
          <Link href="/demon-list/wave-demons" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Wave Demon Guide</Link>
        </div>
      </section>
    </>
  );
}
