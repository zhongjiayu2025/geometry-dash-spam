
import WaveSimulator from "../components/WaveSimulator";
import HomeGuide from "../components/HomeGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  // CRITICAL FOR SEO: Sets the base URL for all relative URLs (canonical, og:image, etc.)
  metadataBase: new URL("https://geometrydashspam.cc"),
  title: {
    default: "Geometry Dash Spam Test | Ultimate Wave Simulator",
    template: "%s | Geometry Dash Spam"
  },
  description: "The most accurate Geometry Dash Spam Test on the web. Simulate 2.2 wave physics, improve your Geometry Dash Spam consistency, and practice for Extreme Demons.",
  keywords: ["geometry dash spam", "geometry dash spam test", "wave simulator", "gd spam", "cps test", "jitter click", "butterfly click", "click speed test"],
  alternates: {
    canonical: './', 
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.svg',
    },
  },
  verification: {
    google: "Yz_6YlW_BzjxZVMUNDmQKQV3n-Jf8cRUr6sMnqJDzyQ",
  },
  openGraph: {
    type: "website",
    url: "https://geometrydashspam.cc",
    siteName: "Geometry Dash Spam Test",
    title: "Geometry Dash Spam Test",
    description: "Test your clicking speed and precision with the ultimate Geometry Dash Spam Wave Simulator.",
    images: [{ url: "https://geometrydashspam.cc/logo.svg" }],
    locale: 'en_US',
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Spam Test",
    description: "Master the wave with the ultimate Geometry Dash Spam simulator.",
    images: ["https://geometrydashspam.cc/logo.svg"],
  },
};

export default function Home() {
  // Structured Data for Software Application
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Geometry Dash Spam Test",
    "operatingSystem": "Any",
    "applicationCategory": "GameApplication",
    "genre": "Rhythm Game Utility",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "12450",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "The ultimate Geometry Dash Spam Test and Wave Simulator. Accurate 2.2 physics for practicing CPS and consistency."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      
      <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            SYSTEM ONLINE
         </div>
         <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-2xl uppercase">
            GEOMETRY DASH SPAM TEST
         </h1>
         <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Welcome to the ultimate <strong>Geometry Dash Spam Test</strong>. 
            This simulator is designed to help players master the <strong>Geometry Dash spam</strong> mechanic, 
            improve wave consistency, and survive the hardest sections in the game.
         </p>
      </div>

      <WaveSimulator />
      <HomeGuide />
    </>
  );
}
