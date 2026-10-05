import type { Metadata } from "next";
import Link from "next/link";
import WaveSimulator from "../../components/WaveSimulator";

export const metadata: Metadata = {
  title: "Geometry Dash Wave – Wave Spam Trainer Online",
  description:
    "Practice Geometry Dash wave and wave spam online with normal, mini, precision and endless training modes. Compare CPS, timing and control in your browser.",
  alternates: { canonical: "/geometry-dash-wave" },
  openGraph: {
    title: "Geometry Dash Wave – Wave Spam Trainer Online",
    description: "Practice Geometry Dash wave and wave spam online with normal, mini, precision and endless training modes. Compare CPS, timing and control in your browser.",
    url: "https://geometrydashspam.cc/geometry-dash-wave",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Wave – Wave Spam Trainer Online",
    description: "Practice Geometry Dash wave and wave spam online with normal, mini, precision and endless training modes. Compare CPS, timing and control in your browser.",
  },
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
          Practice <strong className="text-slate-200">Geometry Dash Wave</strong> movement and
          <strong className="text-slate-200"> wave spam</strong> with normal, mini, precision and endless presets.
          The trainer separates rapid clicking from the harder part: keeping repeated inputs controlled.
        </p>
      </header>

      <WaveSimulator variant="wave" />

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

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">Geometry Dash wave spam vs raw CPS</h2>
            <p className="text-sm leading-7 text-slate-400">
              Raw CPS tells you how many inputs you can produce. Wave spam also depends on the spacing between those inputs.
              Two runs can have the same average CPS but different paths if one run has much more timing variation.
              Use the <Link href="/cps-test" className="text-blue-400 hover:underline">GD CPS Test</Link> for speed,
              then use this trainer to see whether that speed stays controllable.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">What the run metrics mean</h2>
            <ul className="space-y-2 text-sm leading-6 text-slate-400">
              <li><strong className="text-slate-200">Average CPS:</strong> clicks divided by run time.</li>
              <li><strong className="text-slate-200">Peak 1s CPS:</strong> the busiest rolling one-second input window.</li>
              <li><strong className="text-slate-200">Timing SD:</strong> variation in the intervals between registered inputs.</li>
              <li><strong className="text-slate-200">Survival time:</strong> how long you kept the wave inside the practice corridor.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">How to practice Geometry Dash wave</h2>
          <ol className="space-y-3 text-sm leading-6 text-slate-400">
            <li><strong className="text-white">1. Start with Normal Wave.</strong> Learn repeatable direction changes before narrowing the corridor.</li>
            <li><strong className="text-white">2. Compare several runs.</strong> A single lucky survival time is less useful than similar results across multiple attempts.</li>
            <li><strong className="text-white">3. Move to Mini or Wave Spam.</strong> Increase input density only after basic control is stable.</li>
            <li><strong className="text-white">4. Use Precision last.</strong> Treat the hardest preset as a consistency check rather than a required benchmark.</li>
          </ol>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Spam Test</Link>
          <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">CPS Test</Link>
          <Link href="/demon-list/wave-demons" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Wave Demon Guide</Link>
        </div>
      </section>
    </>
  );
}
