import CpsTest from "../../components/CpsTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometry Dash CPS Test – GD Click Speed Test 1–60 Seconds",
  description:
    "Take a Geometry Dash CPS test and GD click test in 1, 3, 5, 10, 30 or 60 seconds. Measure clicks per second, timing consistency and local personal bests.",
  alternates: {
    canonical: "/cps-test",
  },
  openGraph: {
    title: "Geometry Dash CPS Test – GD Click Speed Test",
    description: "Measure Geometry Dash click speed from 1 to 60 seconds.",
    url: "https://geometrydashspam.cc/cps-test",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash CPS Test – GD Click Speed Test",
    description: "Measure Geometry Dash click speed from 1 to 60 seconds.",
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
          Use this Geometry Dash click test to measure CPS, timing consistency and local personal bests across 1, 3, 5, 10, 30 and 60 second modes.
        </p>
      </header>
      <CpsTest />

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
