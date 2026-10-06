import CpsTest from "../../components/CpsTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Metadata } from "next";
import Link from "next/link";
import CpsGuide from "../../components/CpsGuide";
import { CPS_DURATIONS, CPS_DURATION_LABEL } from "../../data/cpsDurations";

export const metadata: Metadata = {
  title: "Geometry Dash CPS Test (GD CPS Test) | Spam Click Test",
  description:
    `Take a Geometry Dash CPS test (GD CPS test) and spam click test in ${CPS_DURATION_LABEL} second modes. Measure click speed, peak CPS and consistency.`,
  alternates: {
    canonical: "/cps-test",
  },
  openGraph: {
    title: "Geometry Dash CPS Test (GD CPS Test) | Spam Click Test",
    description: "Run a Geometry Dash click test or spam click test from 1 to 60 seconds and compare CPS, peak CPS and consistency.",
    url: "https://geometrydashspam.cc/cps-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash CPS Test (GD CPS Test) | Spam Click Test",
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

const supportingToolLinks = [
  {
    href: "/reaction-test",
    title: "Reaction Time Test",
    description: "Compare browser-observed visual response timing separately from repeated-input speed.",
  },
  {
    href: "/aim-trainer",
    title: "Aim Trainer",
    description: "Practice mouse accuracy and target clicking as a separate precision skill.",
  },
];

const clickMethodLinks = [
  {
    href: "/jitter-click",
    title: "Jitter Click Test",
    description: "Compare rapid vibration-style clicking with the same browser-side CPS metric.",
  },
  {
    href: "/butterfly-click",
    title: "Butterfly Click Test",
    description: "Compare a two-finger rhythm and whether the faster pace stays repeatable.",
  },
  {
    href: "/drag-click",
    title: "Drag Click Test",
    description: "Measure short rolling click bursts separately from ordinary repeated clicking.",
  },
  {
    href: "/right-click",
    title: "Right Click CPS Test",
    description: "Run the same speed question with the right mouse button.",
  },
  {
    href: "/spacebar-counter",
    title: "Spacebar CPS Test",
    description: "Compare repeated keyboard input with mouse-based clicking practice.",
  },
];


export default function CpsTestPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Geometry Dash CPS Test",
    url: "https://geometrydashspam.cc/cps-test",
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
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

  const durationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Geometry Dash CPS Test Durations",
    numberOfItems: CPS_DURATIONS.length,
    itemListElement: CPS_DURATIONS.map((seconds, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${seconds} Second CPS Test`,
      url: "https://geometrydashspam.cc/cps-test",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(durationSchema) }}
      />
      <Breadcrumbs items={[{ label: "Geometry Dash CPS Test", href: "/cps-test" }]} />
      <header className="mb-8 md:mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          {CPS_DURATIONS[0]}–{CPS_DURATIONS.at(-1)} SECOND MODES
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 uppercase">
          Geometry Dash CPS Test
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          Use this <strong className="text-slate-200">Geometry Dash click test</strong> as a raw <strong className="text-slate-200">spam click test</strong>:
          measure CPS, peak one-second CPS, timing consistency and local personal bests across {CPS_DURATION_LABEL} second modes.
        </p>
      </header>
      <CpsTest />
      <div className="mx-auto max-w-5xl">
        <CpsGuide />
      </div>

      <section className="mx-auto mt-12 max-w-5xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Clicking technique</p>
        <h2 className="mb-3 text-2xl font-display font-bold text-white">
          Compare Geometry Dash clicking & input methods
        </h2>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-400">
          Keep the main CPS test as your baseline, then compare one technique at a time. Use the same duration and device when you want a fair like-for-like result.
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {clickMethodLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-white/10 bg-slate-900/30 p-5 transition-colors hover:border-blue-500/40 hover:bg-slate-900/50"
            >
              <h3 className="mb-2 font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-blue-400">Open test →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Supporting diagnostics</p>
        <h2 className="mb-3 text-2xl font-display font-bold text-white">Supporting response & precision tools</h2>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-400">
          CPS measures repeated-input speed. Use these separate tools when you want to compare visual response or pointer precision without mixing those results into your click-speed score.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {supportingToolLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-white/10 bg-slate-900/30 p-5 transition-colors hover:border-blue-500/40"
            >
              <h3 className="mb-2 font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-blue-400">Open tool →</span>
            </Link>
          ))}
        </div>
      </section>

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
          <Link href="/geometry-dash-wave" className="text-sm font-semibold text-blue-400 hover:text-blue-300">Open the Geometry Dash Wave Trainer →</Link>
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
