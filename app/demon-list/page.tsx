import type { Metadata } from "next";
import Link from "next/link";
import DemonListTable from "../../components/DemonListTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../../data/demons";

const currentNumberOne = DEMONS[0];
const demonListTitle = `Geometry Dash Demon List | Top 50 & #1 ${currentNumberOne.level}`;
const demonListDescription = `Current Geometry Dash Demon List / Demonlist top 50 from a dated Pointercrate snapshot. Checked ${DEMON_VERIFIED_AT}: ${currentNumberOne.level} by ${currentNumberOne.publisher} is #1.`;
const isGriefPlacementDay =
  currentNumberOne.level === "GRIEF" && DEMON_VERIFIED_AT === "2026-10-05";

const demonFaqs = [
  {
    q: "What is the Geometry Dash Demon List?",
    a: "The Demon List is a community ranking of very difficult Geometry Dash user levels. This page uses a dated snapshot of Pointercrate's ranked list.",
  },
  {
    q: "Is Pointercrate an official Geometry Dash ranking?",
    a: "No. Pointercrate is a community-run ranking source and is not an official RobTop Games list. Rankings can change as the community list is updated.",
  },
  {
    q: "How current is this Demon List page?",
    a: `The snapshot on this page was checked on ${DEMON_VERIFIED_AT}. Use the linked Pointercrate source when you need the latest live order.`,
  },
];

export const metadata: Metadata = {
  title: demonListTitle,
  description: demonListDescription,
  alternates: { canonical: "/demon-list" },
  openGraph: {
    title: demonListTitle,
    description: demonListDescription,
    url: "https://geometrydashspam.cc/demon-list",
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: demonListTitle,
    description: demonListDescription,
  },
};

export default function DemonListPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Geometry Dash Demon List",
    url: "https://geometrydashspam.cc/demon-list",
    dateModified: DEMON_VERIFIED_AT,
    isBasedOn: DEMON_SOURCE_URL,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: DEMONS.length,
      itemListElement: DEMONS.map((item) => ({
        "@type": "ListItem",
        position: item.rank,
        name: item.level,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: demonFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[{ label: "Demon List", href: "/demon-list" }]} />
      <header className="mx-auto mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          Rankings · source checked {DEMON_VERIFIED_AT}
        </p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Geometry Dash Demon List
        </h1>
        <p className="leading-7 text-slate-400">
          As checked <strong className="text-slate-200">{DEMON_VERIFIED_AT}</strong>, Pointercrate ranks{" "}
          <strong className="text-white">{currentNumberOne.level}</strong> by {currentNumberOne.publisher} at #1.
          This page keeps a searchable top-50 snapshot; use the linked live source whenever the exact current order matters because rankings can change.
        </p>
      </header>

      <div className="mx-auto max-w-5xl">
        {isGriefPlacementDay && (
          <section className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 md:p-6">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Updated today</div>
            <h2 className="mb-2 text-xl font-bold text-white">GRIEF is the new #1 Demon List level</h2>
            <p className="text-sm leading-6 text-slate-400">
              GRIEF was placed at #1 on October 5, 2026, moving Society to #2. This top-50 snapshot reflects the new order;
              older search caches can still show Society at #1.
            </p>
          </section>
        )}

        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-purple-500/20 bg-purple-950/15 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300">Current #1</div>
            <div className="mt-1 text-xl font-bold text-white">{currentNumberOne.level}</div>
            <div className="text-xs text-slate-500">by {currentNumberOne.publisher}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Snapshot</div>
            <div className="mt-1 text-xl font-bold text-white">Top {DEMONS.length}</div>
            <div className="text-xs text-slate-500">checked {DEMON_VERIFIED_AT}</div>
          </div>
          <a href={DEMON_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-blue-500/20 bg-blue-950/15 p-4 hover:border-blue-400/40">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300">Live source</div>
            <div className="mt-1 text-xl font-bold text-white">Pointercrate →</div>
            <div className="text-xs text-slate-500">community-run ranking</div>
          </a>
        </section>

        <DemonListTable />
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Demon List FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {demonFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <Link href="/hardest-level" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-purple-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">Current hardest level</h2>
            <p className="text-sm leading-6 text-slate-400">See the #1 Demon List position with its verification date and source.</p>
          </Link>
          <Link href="/easiest-demons" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-blue-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">Easiest demons for beginners</h2>
            <p className="text-sm leading-6 text-slate-400">Use a beginner practice route instead of jumping directly into the hardest list.</p>
          </Link>
          <Link href="/demon-list/wave-demons" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-blue-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">Wave demons</h2>
            <p className="text-sm leading-6 text-slate-400">Build a wave-focused practice path around the mechanic you want to improve.</p>
          </Link>
          <Link href="/demon-list/spam-demons" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-blue-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">Spam demonlist guide</h2>
            <p className="text-sm leading-6 text-slate-400">Explore rapid-input demon references while keeping the official Pointercrate ranking separate.</p>
          </Link>
        </section>
      </div>
    </>
  );
}
