import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import GeometryDashClicker from "../../components/GeometryDashClicker";

export const metadata: Metadata = {
  title: "Geometry Dash Clicker | Free Orb Clicker Game",
  description:
    "Play a free Geometry Dash Clicker in your browser. Click the cube, earn orbs, buy upgrades, prestige and keep progress locally with no account.",
  alternates: { canonical: "/geometry-dash-clicker" },
  openGraph: {
    title: "Geometry Dash Clicker | Free Orb Clicker Game",
    description: "Play a free Geometry Dash Clicker in your browser. Click the cube, earn orbs, buy upgrades, prestige and keep progress locally with no account.",
    url: "https://geometrydashspam.cc/geometry-dash-clicker",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Clicker | Free Orb Clicker Game",
    description: "Play a free Geometry Dash Clicker in your browser. Click the cube, earn orbs, buy upgrades, prestige and keep progress locally with no account.",
  },
};

const clickerFaqs = [
  {
    q: "What is Geometry Dash Clicker?",
    a: "This is a small independent browser clicker game: manual clicks earn orbs, upgrades increase click value, auto upgrades generate orbs over time, and prestige resets upgrades for a larger manual-click multiplier.",
  },
  {
    q: "Does Geometry Dash Clicker save progress?",
    a: "Yes. Progress is stored locally in your browser on this device. No account or server-side save is required.",
  },
  {
    q: "Is this the official Geometry Dash game?",
    a: "No. This is an independent fan-made clicker tool and is not the official Geometry Dash game or affiliated with RobTop Games.",
  },
];

export default function GeometryDashClickerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Geometry Dash Clicker",
    url: "https://geometrydashspam.cc/geometry-dash-clicker",
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A lightweight browser clicker game with local progress, upgrades, achievements and prestige.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: clickerFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Geometry Dash Clicker", href: "/geometry-dash-clicker" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="mx-auto mb-8 max-w-4xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Browser clicker</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Geometry Dash Clicker</h1>
        <p className="leading-7 text-slate-400">
          Click the cube, collect orbs and buy upgrades in a lightweight idle clicker. Progress stays in local browser storage and no account is required.
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-600">
          Independent fan-made browser game · not affiliated with RobTop Games.
        </p>
      </header>

      <div className="mx-auto max-w-5xl">
        <GeometryDashClicker />

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Clicker FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {clickerFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <Link href="/cps-test" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-blue-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">Want a real speed test?</h2>
            <p className="text-sm leading-6 text-slate-400">
              Use the Geometry Dash CPS Test when you want a timed clicks-per-second measurement instead of game progression.
            </p>
          </Link>
          <Link href="/" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-blue-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">Practice Geometry Dash spam</h2>
            <p className="text-sm leading-6 text-slate-400">
              Move from raw clicking to a wave-control challenge where timing and consistency matter.
            </p>
          </Link>
        </section>
      </div>
    </>
  );
}
