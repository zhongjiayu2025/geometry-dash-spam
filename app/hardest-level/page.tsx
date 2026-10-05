import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../../data/demons";

const currentHardest = DEMONS[0];
const hardestTitle = `Geometry Dash Hardest Level: ${currentHardest.level} | Current #1 Demon`;
const hardestDescription = `As checked ${DEMON_VERIFIED_AT}, Pointercrate ranks ${currentHardest.level} by ${currentHardest.publisher} #1. See the current top five and live source.`;

export const metadata: Metadata = {
  title: hardestTitle,
  description: hardestDescription,
  alternates: { canonical: "/hardest-level" },
  openGraph: {
    title: hardestTitle,
    description: hardestDescription,
    url: "https://geometrydashspam.cc/hardest-level",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: hardestTitle,
    description: hardestDescription,
  },
};

const hardestFaqs = [
  {
    q: "What is the hardest Geometry Dash level right now?",
    a: `As checked ${DEMON_VERIFIED_AT}, Pointercrate ranks ${currentHardest.level} by ${currentHardest.publisher} at #1 on its community Demon List.`,
  },
  {
    q: "Is the hardest Geometry Dash level an official RobTop ranking?",
    a: "No. This page uses Pointercrate, a community-run Demon List. It is not an official RobTop Games ranking.",
  },
  {
    q: "Can the hardest Geometry Dash level change?",
    a: "Yes. Demon List positions change when new levels are placed or existing levels are re-evaluated, so the verification date and live source matter.",
  },
];

export default function HardestLevelPage() {
  const numberOne = currentHardest;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "What Is the Hardest Level in Geometry Dash?",
    url: "https://geometrydashspam.cc/hardest-level",
    dateModified: DEMON_VERIFIED_AT,
    isBasedOn: DEMON_SOURCE_URL,
    about: {
      "@type": "Thing",
      name: numberOne.level,
      description: `Pointercrate Demonlist #1 as checked on ${DEMON_VERIFIED_AT}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hardestFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Hardest Level", href: "/hardest-level" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          Checked {DEMON_VERIFIED_AT}
        </p>
        <h1 className="mb-5 text-3xl font-display font-bold text-white md:text-5xl">
          Geometry Dash Hardest Level: {numberOne.level}
        </h1>
        <div className="rounded-2xl border border-purple-500/25 bg-purple-950/20 p-6 text-lg leading-8 text-slate-200">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300">Quick answer</div>
          <strong className="text-white">The current hardest Geometry Dash level is {numberOne.level}</strong> according to Pointercrate's community Demon List,
          checked <strong>{DEMON_VERIFIED_AT}</strong>. It was published by {numberOne.publisher}. Rankings can change, and this is not an official RobTop Games list.
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Current top five</h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          {DEMONS.slice(0, 5).map((item) => (
            <div key={item.rank} className="flex items-center gap-4 border-b border-white/5 bg-slate-900/25 px-5 py-4 last:border-b-0">
              <span className="w-10 font-mono font-bold text-blue-400">#{item.rank}</span>
              <div>
                <div className="font-semibold text-white">{item.level}</div>
                <div className="text-xs text-slate-500">Published by {item.publisher}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 space-y-4 text-slate-400">
        <h2 className="text-2xl font-bold text-white">How this answer is maintained</h2>
        <p className="leading-7">
          This page does not treat “hardest level” as a permanent fact. It records the source and date used for the answer so later ranking changes can be audited.
        </p>
        <a href={DEMON_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-blue-400 hover:text-blue-300">
          Open the live Pointercrate Demonlist →
        </a>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Hardest Geometry Dash Level FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {hardestFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/demon-list" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">Full Demon List</Link>
        <Link href="/geometry-dash-wave" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Practice Wave</Link>
      </div>
      </article>
    </>
  );
}
