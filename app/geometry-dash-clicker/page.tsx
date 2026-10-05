import type { Metadata } from "next";
import Link from "next/link";
import GeometryDashClicker from "../../components/GeometryDashClicker";

export const metadata: Metadata = {
  title: "Geometry Dash Clicker – Free Orb Clicker Game",
  description:
    "Play a lightweight Geometry Dash Clicker in your browser. Click the cube, earn orbs, buy upgrades and save progress locally.",
  alternates: { canonical: "/geometry-dash-clicker" },
};

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="mx-auto mb-8 max-w-4xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Browser clicker</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Geometry Dash Clicker</h1>
        <p className="leading-7 text-slate-400">
          Click the cube, collect orbs and buy upgrades in a lightweight idle clicker. Progress stays in local browser storage and no account is required.
        </p>
      </header>

      <div className="mx-auto max-w-5xl">
        <GeometryDashClicker />

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
