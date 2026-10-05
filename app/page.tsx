import dynamic from "next/dynamic";
import { Metadata } from "next";
import WaveSimulator from "../components/WaveSimulator";

const HomeGuide = dynamic(() => import("../components/HomeGuide"), {
  ssr: true,
});

export const metadata: Metadata = {
  title: "Geometry Dash Spam Test – Wave Spam Trainer Online",
  description:
    "Play a free Geometry Dash spam test online. Practice wave spam, mini wave and precision control in your browser, with CPS and consistency tools one click away.",
  keywords: [
    "geometry dash spam",
    "geometry dash spam test",
    "geometry dash wave spam",
    "spam click test",
    "gd spam",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://geometrydashspam.cc",
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
    title: "Geometry Dash Spam Test – Wave Spam Trainer Online",
    description:
      "Play a Geometry Dash spam test online, practice wave spam and train repeatable input control in a free browser-based simulator.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Spam Test – Wave Spam Trainer Online",
    description:
      "Play a Geometry Dash spam test online, practice wave spam and train repeatable input control in a free browser-based simulator.",
  },
};

export default function Home() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Geometry Dash Spam Test",
    url: "https://geometrydashspam.cc",
    operatingSystem: "Any",
    applicationCategory: "GameApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A free browser-based Geometry Dash wave spam trainer for practicing control, click timing and consistency.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <header className="mb-5 md:mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-mono text-slate-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          FREE BROWSER TRAINER
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 uppercase">
          Geometry Dash Spam Test
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Practice <strong className="text-slate-200">Geometry Dash spam</strong> in a playable wave trainer.
          Pick a drill, survive the corridor, then compare CPS and timing consistency.
        </p>
      </header>

      <div className="mx-auto mb-4 flex w-full max-w-5xl flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/35 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-slate-300">
          <strong className="text-white">Wave spam:</strong> hold to rise, release to fall, and keep the rhythm through the corridor.
        </div>
        <a href="/cps-test" className="shrink-0 font-semibold text-blue-400 hover:text-blue-300">
          Need raw click speed? GD CPS Test →
        </a>
      </div>

      <WaveSimulator />
      <HomeGuide />
    </>
  );
}
