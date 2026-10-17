import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

const SOURCE_URL = "https://geometrydash.wiki.gg/wiki/Collectibles";
const CHECKED_AT = "2026-10-05";

export const metadata: Metadata = {
  title: "Geometry Dash Difficulty Faces | All Ratings Explained",
  description:
    "Geometry Dash difficulty faces explained from Auto to Demon, including star ranges and all five Demon sub-difficulties: Easy, Medium, Hard, Insane and Extreme.",
  alternates: { canonical: "/geometry-dash-difficulty-faces" },
  openGraph: {
    title: "Geometry Dash Difficulty Faces | All Ratings Explained",
    description: "Geometry Dash difficulty faces explained from Auto to Demon, including star ranges and all five Demon sub-difficulties: Easy, Medium, Hard, Insane and Extreme.",
    url: "https://geometrydashspam.cc/geometry-dash-difficulty-faces",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Difficulty Faces | All Ratings Explained",
    description: "Geometry Dash difficulty faces explained from Auto to Demon, including star ranges and all five Demon sub-difficulties: Easy, Medium, Hard, Insane and Extreme.",
  },
};

const baseDifficulties = [
  { name: "Auto", stars: "1★", face: 0, tone: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10", note: "Rated automated level." },
  { name: "Easy", stars: "2★", face: 1, tone: "text-blue-300 border-blue-500/30 bg-blue-500/10", note: "Lowest standard user-level difficulty." },
  { name: "Normal", stars: "3★", face: 2, tone: "text-green-300 border-green-500/30 bg-green-500/10", note: "Standard early progression difficulty." },
  { name: "Hard", stars: "4–5★", face: 3, tone: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10", note: "A step above Normal." },
  { name: "Harder", stars: "6–7★", face: 4, tone: "text-orange-300 border-orange-500/30 bg-orange-500/10", note: "Higher-rated non-Demon difficulty." },
  { name: "Insane", stars: "8–9★", face: 5, tone: "text-pink-300 border-pink-500/30 bg-pink-500/10", note: "Highest standard non-Demon rating." },
  { name: "Demon", stars: "10★", face: 6, tone: "text-red-300 border-red-500/30 bg-red-500/10", note: "Demon levels use five community-voted sub-difficulties." },
];

function DifficultyReferenceFace({ name }: { name: string }) {
  return <img src={`/difficulty-faces/${name.toLowerCase()}.png`} width={64} height={64} alt={`${name} difficulty icon from Geometry Dash`} className="h-16 w-16 object-contain" />;
}

const difficultyFaqs = [
  {
    q: "What are the Geometry Dash difficulty faces?",
    a: "For rated user levels, the main difficulty scale is Auto, Easy, Normal, Hard, Harder, Insane and Demon. Demon levels also have five community-voted sub-difficulties.",
  },
  {
    q: "How many stars do Geometry Dash difficulty ratings give?",
    a: "Rated user levels generally award 1 star for Auto, 2 for Easy, 3 for Normal, 4–5 for Hard, 6–7 for Harder, 8–9 for Insane and 10 for Demon.",
  },
  {
    q: "What are the five Demon difficulties?",
    a: "The Demon sub-difficulties are Easy Demon, Medium Demon, Hard Demon, Insane Demon and Extreme Demon.",
  },
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: difficultyFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Difficulty Faces", href: "/geometry-dash-difficulty-faces" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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

        <section className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-950/15 p-5 md:p-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Quick answer</div>
          <p className="leading-7 text-slate-300">
            The rated user-level scale is <strong className="text-white">Auto → Easy → Normal → Hard → Harder → Insane → Demon</strong>.
            Demon then splits into Easy, Medium, Hard, Insane and Extreme Demon. Compare the actual difficulty icons below; the star reward stays at 10 for every Demon sub-rating.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold text-white">Standard difficulty ratings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {baseDifficulties.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-900/30 p-5">
                <div className={"mb-4 grid h-16 w-16 place-items-center rounded-full border-2 " + item.tone}>
                  <DifficultyReferenceFace name={item.name} />
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
            Difficulty sprites are Geometry Dash game artwork by RobTop Games, reproduced here for identification. Asset reference: GDBrowser community archive; see the source credit below.
          </p>
        </section>

        <section className="mb-12 rounded-2xl border border-purple-500/20 bg-purple-950/10 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Demon difficulty faces</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {demonDifficulties.map((item) => (
              <div key={item.name} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <img src={`/difficulty-faces/demon-${item.name.split(" ")[0].toLowerCase()}.png`} width={64} height={64} alt={`${item.name} difficulty icon from Geometry Dash`} className="mb-3 h-16 w-16 object-contain" />
                <h3 className="mb-2 font-bold text-white">{item.name}</h3>
                <p className="text-xs leading-5 text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Demon sub-difficulties are an indication of difficulty rather than a different star reward.
            The Geometry Dash Wiki notes that Demon user levels award 10 stars regardless of sub-difficulty, and
            the sub-rating is determined by community votes.
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-white/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-white">Where to find the face in the game</h2>
          <p className="mb-3 leading-7 text-slate-300">Open a user level from Search or a saved list. The large face beside the level name identifies its rating; read the stars as a separate reward. Easy is blue, Normal is green, Hard is yellow, Harder is orange and Insane is pink. Demon icons add horns and change their facial shape and colour across sub-ratings.</p>
          <p className="leading-7 text-slate-400">Do not confuse Easy with Easy Demon: Easy gives 2 stars, while Easy Demon uses a horned Demon icon and gives 10. A glow or featured decoration around a face describes an additional rating distinction; it is not an extra Demon tier. These references omit those frames to make the faces comparable.</p>
          <p className="mt-3 text-xs leading-5 text-slate-400">Image source: <a href="https://github.com/tzt345/GDBrowser/tree/master/assets/difficulties" className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">GDBrowser difficulty asset archive</a>. Game artwork belongs to RobTop Games; this independent fan guide does not claim ownership or an official affiliation.</p>
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

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Difficulty Faces FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {difficultyFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
            Geometry Dash Wiki source
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
