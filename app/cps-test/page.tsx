import CpsTest from "../../components/CpsTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometry Dash CPS Test | GD Spam Click Test (1–60s)",
  description:
    "Take a Geometry Dash CPS test and spam click test in 1, 3, 5, 10, 30 or 60 seconds. Measure click speed, peak CPS, consistency and local personal bests.",
  alternates: {
    canonical: "/cps-test",
  },
  openGraph: {
    title: "Geometry Dash CPS Test | GD Spam Click Test",
    description: "Run a Geometry Dash click test or spam click test from 1 to 60 seconds and compare CPS, peak CPS and consistency.",
    url: "https://geometrydashspam.cc/cps-test",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash CPS Test – GD Click Speed Test",
    description: "Run a Geometry Dash click test or spam click test from 1 to 60 seconds and compare CPS, peak CPS and consistency.",
  },
};

const cpsFaqs = [
  {
    q: "What is a Geometry Dash CPS test?",
    a: "A Geometry Dash CPS test measures how many clicks or taps you register per second. This page also shows peak one-second CPS and click-timing consistency.",
  },
  {
    q: "Which CPS test duration should I use?",
    a: "Use 1–5 second modes for short bursts, 10 seconds for a quick baseline, and 30–60 seconds when you want to compare whether your pace stays repeatable.",
  },
  {
    q: "Is higher CPS always better in Geometry Dash?",
    a: "No. Some sections reward faster repeated input, but wave control also depends on spacing and timing. A higher click count is only useful if you can still control the movement.",
  },
];

export default function CpsTestPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Geometry Dash CPS Test",
    url: "https://geometrydashspam.cc/cps-test",
    description:
      "A browser-based click speed test with multiple durations for Geometry Dash players.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cpsFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className="mb-8 md:mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          1–60 SECOND MODES
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 uppercase">
          Geometry Dash CPS Test
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          Use this <strong className="text-slate-200">Geometry Dash click test</strong> as a raw <strong className="text-slate-200">spam click test</strong>:
          measure CPS, peak one-second CPS, timing consistency and local personal bests across 1, 3, 5, 10, 30 and 60 second modes.
        </p>
      </header>
      <CpsTest />

      <section className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/15 p-6">
          <h2 className="mb-2 text-xl font-bold text-white">Geometry Dash click test</h2>
          <p className="text-sm leading-6 text-slate-400">
            Use this page when the goal is raw clicking speed. It reports average CPS, peak one-second CPS and click-spacing consistency so repeated runs are easier to compare.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
          <h2 className="mb-2 text-xl font-bold text-white">Need wave spam practice instead?</h2>
          <p className="mb-3 text-sm leading-6 text-slate-400">
            A click score does not measure whether rapid inputs stay controllable in a wave corridor.
          </p>
          <a href="/" className="text-sm font-semibold text-blue-400 hover:text-blue-300">Open the Geometry Dash Spam Test →</a>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-5xl">
        <h2 className="mb-5 text-2xl font-display font-bold text-white">Geometry Dash CPS Test FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {cpsFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
