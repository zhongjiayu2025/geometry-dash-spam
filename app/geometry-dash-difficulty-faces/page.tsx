import type { Metadata } from "next";
import Link from "next/link";

const SOURCE_URL = "https://geometrydash.wiki.gg/wiki/Collectibles";
const CHECKED_AT = "2026-10-05";

export const metadata: Metadata = {
  title: "Geometry Dash Difficulty Faces – Ratings & Demon Difficulties",
  description:
    "Geometry Dash difficulty faces explained: Auto, Easy, Normal, Hard, Harder, Insane and Demon, plus all five Demon sub-difficulties.",
  alternates: { canonical: "/geometry-dash-difficulty-faces" },
};

const baseDifficulties = [
  { name: "Auto", stars: "1★", symbol: "A", tone: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10", note: "Rated automated level." },
  { name: "Easy", stars: "2★", symbol: "E", tone: "text-green-300 border-green-500/30 bg-green-500/10", note: "Lowest standard user-level difficulty." },
  { name: "Normal", stars: "3★", symbol: "N", tone: "text-blue-300 border-blue-500/30 bg-blue-500/10", note: "Standard early progression difficulty." },
  { name: "Hard", stars: "4–5★", symbol: "H", tone: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10", note: "A step above Normal." },
  { name: "Harder", stars: "6–7★", symbol: "H+", tone: "text-orange-300 border-orange-500/30 bg-orange-500/10", note: "Higher-rated non-Demon difficulty." },
  { name: "Insane", stars: "8–9★", symbol: "I", tone: "text-pink-300 border-pink-500/30 bg-pink-500/10", note: "Highest standard non-Demon rating." },
  { name: "Demon", stars: "10★", symbol: "D", tone: "text-red-300 border-red-500/30 bg-red-500/10", note: "Demon levels use five community-voted sub-difficulties." },
];

const demonDifficulties = [
  { name: "Easy Demon", description: "Entry-level Demon sub-difficulty." },
  { name: "Medium Demon", description: "One step above Easy Demon." },
  { name: "Hard Demon", description: "The default Demon sub-rating before enough community votes." },
  { name: "Insane Demon", description: "High-end Demon sub-difficulty." },
  { name: "Extreme Demon", description: "Highest Demon sub-difficulty." },
];

export default function DifficultyFacesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Geometry Dash Difficulty Faces and Ratings",
    numberOfItems: baseDifficulties.length + demonDifficulties.length,
    itemListElement: [...baseDifficulties, ...demonDifficulties].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Difficulty reference · checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            Geometry Dash Difficulty Faces
          </h1>
          <p className="leading-7 text-slate-400">
            Geometry Dash uses difficulty faces to communicate a level&apos;s rating. For rated user levels,
            the standard scale runs from Auto through Demon. Demon levels then use five sub-difficulties:
            Easy, Medium, Hard, Insane and Extreme Demon.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold text-white">Standard difficulty ratings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {baseDifficulties.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-900/30 p-5">
                <div className={"mb-4 grid h-16 w-16 place-items-center rounded-full border-2 font-display text-xl font-black " + item.tone}>
                  {item.symbol}
                </div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <span className="font-mono text-sm text-slate-400">{item.stars}</span>
                </div>
                <p className="text-sm leading-6 text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-600">
            The letter badges above are original reference markers for this guide, not copies of the official game artwork.
          </p>
        </section>

        <section className="mb-12 rounded-2xl border border-purple-500/20 bg-purple-950/10 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Demon difficulty faces</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {demonDifficulties.map((item, index) => (
              <div key={item.name} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-xs font-mono text-purple-300">D{index + 1}</div>
                <h3 className="mb-2 font-bold text-white">{item.name}</h3>
                <p className="text-xs leading-5 text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Demon sub-difficulties are an indication of difficulty rather than a different star reward.
            The official wiki notes that Demon user levels award 10 stars regardless of sub-difficulty, and
            the sub-rating is determined by community votes.
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-xl font-bold text-white">What does an unrated face mean?</h2>
            <p className="text-sm leading-6 text-slate-400">
              An unrated user level has not received a star or moon rating, so it does not award the standard rated-level star reward.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-xl font-bold text-white">Are main-level star values the same?</h2>
            <p className="text-sm leading-6 text-slate-400">
              No. Official main levels have their own star values. The star ranges above describe rated user levels.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
            Official Wiki source
          </a>
          <Link href="/easiest-demons" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Easiest Demons
          </Link>
          <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Demon List
          </Link>
        </div>
      </article>
    </>
  );
}
