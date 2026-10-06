import type { Metadata } from "next";
import Link from "next/link";
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
      itemListElement: entries.map(({ demon }) => ({
        "@type": "ListItem",
        position: demon?.rank,
        name: demon?.level,
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

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {entries.map(({ demon, note }) => demon && (
          <div key={demon.rank} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{demon.level}</h2>
                <p className="text-xs text-slate-500">Published by {demon.publisher}</p>
              </div>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-sm font-bold text-blue-300">
                #{demon.rank}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-400">{note}</p>
          </div>
        ))}
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {[
          ["Beginner", "Use easier wave sections first and focus on repeatable control rather than maximum speed."],
          ["Intermediate", "Add tighter corridors, transitions and longer runs once basic timing is stable."],
          ["Advanced", "Practice short difficult sections separately, then combine precision with endurance."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-white/10 bg-black/20 p-5">
            <h2 className="mb-2 font-bold text-white">{title}</h2>
            <p className="text-sm leading-6 text-slate-400">{body}</p>
          </div>
        ))}
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
