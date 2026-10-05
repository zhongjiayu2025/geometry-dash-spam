import CpsTest from "../../components/CpsTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometry Dash CPS Test – GD Click Speed Test 1–60 Seconds",
  description:
    "Take a Geometry Dash CPS test in 1, 3, 5, 10, 30 or 60 seconds. Measure clicks per second, compare personal bests and train sustainable click speed.",
  alternates: {
    canonical: "/cps-test",
  },
  openGraph: {
    title: "Geometry Dash CPS Test – GD Click Speed Test",
    description: "Measure Geometry Dash click speed from 1 to 60 seconds.",
    url: "https://geometrydashspam.cc/cps-test",
  },
};

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
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
          Measure clicks per second, track local personal bests and compare sustainable speed across multiple test lengths.
        </p>
      </header>
      <CpsTest />
    </>
  );
}
