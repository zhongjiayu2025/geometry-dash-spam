import type { Metadata } from "next";
import Link from "next/link";
import DemonListTable from "../../components/DemonListTable";
import { DEMONS, DEMON_SOURCE_URL, DEMON_VERIFIED_AT } from "../../data/demons";

export const metadata: Metadata = {
  title: "Geometry Dash Demon List – Hardest Demons Ranked",
  description:
    "Browse a sourced Geometry Dash Demon List snapshot with the current top demons, verification date and related hardest-level guides.",
  alternates: { canonical: "/demon-list" },
  openGraph: {
    title: "Geometry Dash Demon List – Hardest Demons Ranked",
    description: "Browse a sourced Geometry Dash Demon List snapshot with the current top demons, verification date and related hardest-level guides.",
    url: "https://geometrydashspam.cc/demon-list",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Demon List – Hardest Demons Ranked",
    description: "Browse a sourced Geometry Dash Demon List snapshot with the current top demons, verification date and related hardest-level guides.",
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="mx-auto mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          Rankings · source checked {DEMON_VERIFIED_AT}
        </p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Geometry Dash Demon List
        </h1>
        <p className="leading-7 text-slate-400">
          This page provides a checked snapshot of the hardest demons on Pointercrate. Use the linked source whenever the exact current order matters because rankings can change.
        </p>
      </header>

      <div className="mx-auto max-w-5xl">
        <DemonListTable />
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
