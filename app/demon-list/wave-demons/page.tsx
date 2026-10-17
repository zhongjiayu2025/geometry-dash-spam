import type { Metadata } from "next";
import Link from "next/link";
import LevelPracticeCards from "../../../components/LevelPracticeCards";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../../../data/demons";

export const metadata: Metadata = {
  title: "Geometry Dash Wave Demons – Wave Practice Guide",
  description:
    "Explore wave-focused Geometry Dash demon practice references with current Pointercrate positions, source date and a dedicated wave trainer.",
  alternates: { canonical: "/demon-list/wave-demons" },
  openGraph: {
    title: "Geometry Dash Wave Demons – Wave Practice Guide",
    description: "Explore wave-focused Geometry Dash demon practice references with current Pointercrate positions, source date and a dedicated wave trainer.",
    url: "https://geometrydashspam.cc/demon-list/wave-demons",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Wave Demons – Wave Practice Guide",
    description: "Explore wave-focused Geometry Dash demon practice references with current Pointercrate positions, source date and a dedicated wave trainer.",
  },
};

const WAVE_REFERENCES = [
  { name: "Tidal Wave", note: "A well-known modern Extreme Demon with major wave sections and high precision demands." },
  { name: "Ashley Wave Trials", note: "A wave-centered level that makes the mechanic itself the main practice focus." },
  { name: "Ultra Paracosm", note: "A circles-style reference useful for players interested in sustained wave control." },
  { name: "Defeated Circles", note: "A current Main List circles-style level that can be used as an advanced wave reference." },
  { name: "Sakupen Circles", note: "Known for very tight wave gameplay and repeated micro-corrections." },
  { name: "Slaughterhouse", note: "Contains demanding wave sections where timing consistency matters." },
];

const waveFaqs = [
  {
    q: "What are wave demons in Geometry Dash?",
    a: "Wave demons are an informal player label for Demon levels where wave control is a major execution challenge. Pointercrate does not maintain a separate official wave-only ranking.",
  },
  {
    q: "Is there an official Geometry Dash wave demon list?",
    a: "No. Pointercrate ranks Extreme Demons overall. This page uses dated Pointercrate Main List positions only as context for wave-focused practice references.",
  },
  {
    q: "How should I practice Geometry Dash wave demons?",
    a: "Start with wider corridors and shorter sections, focus on repeatable press-and-release timing, then add tighter gaps and longer runs. Raw CPS is less useful if the wave path is not stable.",
  },
];

export default function WaveDemonsPage() {
  const entries = WAVE_REFERENCES.map((reference) => ({
    ...reference,
    demon: DEMONS.find((item) => item.level === reference.name),
  })).filter((item) => item.demon);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Geometry Dash Wave Demons",
    url: "https://geometrydashspam.cc/demon-list/wave-demons",
    dateModified: DEMON_VERIFIED_AT,
    isBasedOn: DEMON_SOURCE_URL,
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: entries.length,
      itemListElement: entries.map(({ demon, note }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: demon?.level,
          description: `${note} Pointercrate Main List rank: #${demon?.rank} as checked ${DEMON_VERIFIED_AT}.`,
        },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: waveFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <article className="mx-auto max-w-5xl">
      <Breadcrumbs items={[{ label: "Demon List", href: "/demon-list" }, { label: "Wave Demons", href: "/demon-list/wave-demons" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
          Skill-focused guide · list checked {DEMON_VERIFIED_AT}
        </p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Geometry Dash Wave Demons
        </h1>
        <p className="leading-7 text-slate-400">
          “Wave demon” is a practice label, not an official Pointercrate category. The examples below
          are selected because wave control is a meaningful part of why players discuss them. Their
          displayed ranks come from the dated Main List snapshot, not from a separate wave ranking.
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-950/15 p-5 md:p-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Quick answer</div>
        <p className="leading-7 text-slate-300">
          There is <strong className="text-white">no official wave-only Demon List</strong>. This guide
          uses the current Pointercrate Main List snapshot for rank context, then highlights levels where wave control is a meaningful practice focus.
          For hands-on practice, use the <Link href="/geometry-dash-wave" className="text-blue-400 hover:underline">Geometry Dash Wave Trainer</Link>.
        </p>
      </section>

      <LevelPracticeCards kind="wave" />

      <section className="mb-10 rounded-2xl border border-blue-500/20 p-6">
        <h2 className="mb-3 text-2xl font-bold text-white">A wave route before Extreme Demons</h2>
        <ol className="list-decimal space-y-4 pl-5 text-sm leading-6 text-slate-300">
          <li><strong>Learn direction changes:</strong> open the Normal Wave preset here. Finish three runs at one difficulty before trying Mini; return to Normal if the same wall collision repeats.</li>
          <li><strong>Use real game physics:</strong> search Ultra Paracosm by Rulas, <a href="https://gdbrowser.com/11588490" className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">ID 11588490</a>. Practice its wave passage from a checkpoint and include its entry/exit. This Easy Demon is distinct from the declanlc Extreme Demon above.</li>
          <li><strong>Handle longer circles gameplay:</strong> Nine Circles by Zobros, <a href="https://gdbrowser.com/4284013" className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">ID 4284013</a>, is a Hard Demon reference. Start with a short wave subsection, then join adjacent subsections. Do not jump to it until the previous task is reproducible.</li>
          <li><strong>Study an advanced target:</strong> inspect one of the exact Extreme Demon IDs above. Pick one marked passage; a full clear is not a prerequisite for learning from its video. Browser-preset completion is not proof of readiness for that level.</li>
        </ol>
      </section>

      <section className="mb-10 rounded-2xl border border-blue-500/20 bg-blue-950/10 p-5 md:p-6">
        <h2 className="mb-3 text-xl font-bold text-white">Wave demons, spam demons and the SCL answer different questions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/demon-list/spam-demons" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-blue-400/40">
            <h3 className="mb-1 font-bold text-white">Spam Demon references</h3>
            <p className="text-sm leading-6 text-slate-400">Rated Demons selected as rapid-input practice references, with their real Pointercrate positions kept separate.</p>
          </Link>
          <Link href="/spam-challenge-list" className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-4 hover:border-fuchsia-400/40">
            <h3 className="mb-1 font-bold text-white">Spam Challenge List</h3>
            <p className="text-sm leading-6 text-slate-400">Use the SCL when the search intent is a community ranking of spam challenges rather than rated Demons.</p>
          </Link>
          <Link href="/blog/top-spam-levels-2026" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-blue-400/40">
            <h3 className="mb-1 font-bold text-white">Top Spam Levels 2026</h3>
            <p className="text-sm leading-6 text-slate-400">Use the overview when you need help choosing the correct list or practice reference.</p>
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Wave Demons FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {waveFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-white/10 bg-slate-900/25 p-5 md:p-6">
        <h2 className="mb-2 text-xl font-bold text-white">Want examples without treating them as a ranking?</h2>
        <p className="text-sm leading-6 text-slate-400">
          Read <Link href="/blog/notable-wave-spam-levels" className="font-semibold text-blue-300 hover:underline">Notable Wave and Spam Levels in Geometry Dash</Link> for a non-ranking overview, then return here when you need current Pointercrate rank context.
        </p>
      </section>

      <div className="rounded-xl border border-white/10 bg-slate-900/25 p-5 text-sm text-slate-400">
        Rankings can change.{" "}
        <a href={DEMON_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Check Pointercrate for the live list
        </a>
        .
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/geometry-dash-wave" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Open Wave Trainer</Link>
        <Link href="/demon-list/spam-demons" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Spam Demonlist</Link>
        <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Full Demon List</Link>
        <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Spam Test</Link>
      </div>
    </article>
  );
}
