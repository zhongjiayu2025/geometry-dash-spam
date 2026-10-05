import dynamic from "next/dynamic";
import { Metadata } from "next";
import WaveSimulator from "../components/WaveSimulator";

const HomeGuide = dynamic(() => import("../components/HomeGuide"), {
  ssr: true,
});

export const metadata: Metadata = {
  title: "Geometry Dash Spam Test – Play Wave Spam Online",
  description:
    "Play a free Geometry Dash spam test online with no download. Practice wave spam, track CPS and click consistency, and train normal or mini wave control.",
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
    title: "Geometry Dash Spam Test – Play Wave Spam Online",
    description:
      "Play Geometry Dash wave spam online and measure click consistency in your browser.",
    images: [{ url: "/logo.svg", alt: "Geometry Dash Spam Test" }],
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

      <header className="mb-8 md:mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          FREE BROWSER TRAINER
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase">
          Geometry Dash Spam Test
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Practice <strong className="text-slate-200">Geometry Dash spam</strong> with a playable wave trainer.
          Test rapid inputs, improve click consistency, and build control before taking the same skills back into the game.
        </p>
      </header>

      <WaveSimulator />
      <HomeGuide />
    </>
  );
}
