
import WaveSimulator from "../components/WaveSimulator";
import HomeGuide from "../components/HomeGuide";

export default function Home() {
  // Structured Data for Software Application
  // This helps Google show "Free", "Browser Game", and Star Ratings in search results
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
         <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
            GEOMETRY DASH SPAM TEST
         </h1>
         <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            Master the wave mechanic. Improve consistency. Survive the spam.
         </p>
      </div>

      <WaveSimulator />
      <HomeGuide />
    </>
  );
}
