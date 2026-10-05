import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import relatedSearchData from "../../data/relatedSearch.json";

const relatedPageData = relatedSearchData.spamChallengeList;
const CHECKED_AT = relatedPageData.checkedAt;
const [LIST_SOURCE, LIST_HUB_SOURCE] = relatedPageData.sources;

export const metadata: Metadata = {
  title: "Geometry Dash Spam Challenge List | Current SCL Guide",
  description:
    "Find the current Geometry Dash Spam Challenge List entry point, understand what the SCL ranks, and see how it differs from the Demon List and spam-demon practice references.",
  alternates: { canonical: "/spam-challenge-list" },
  openGraph: {
    title: "Geometry Dash Spam Challenge List | Current SCL Guide",
    description:
      "Use the current Spam Challenge List source, learn what the SCL ranks and how it differs from Pointercrate's Demon List.",
    url: "https://geometrydashspam.cc/spam-challenge-list",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Spam Challenge List | Current SCL Guide",
    description:
      "Use the current Spam Challenge List source, learn what the SCL ranks and how it differs from Pointercrate's Demon List.",
  },
};

const faqs = [
  {
    q: "What is the Geometry Dash Spam Challenge List?",
    a: "The Spam Challenge List, often shortened to SCL, is a community-run list focused on Geometry Dash challenges built around rapid repeated input. It is separate from Pointercrate's Demon List.",
  },
  {
    q: "Is the Spam Challenge List the same as the Demon List?",
    a: "No. The SCL focuses on spam challenges, while Pointercrate ranks very difficult rated Demon levels overall. A spam-heavy Demon can be useful practice without being an SCL challenge.",
  },
  {
    q: "Where can I see the current Spam Challenge List?",
    a: "Use the maintained Spam Challenges List entry linked on this page. The source page explicitly says it is the new, up-to-date list, so current placements should be checked there rather than copied from old videos or documents.",
  },
];

export default function SpamChallengeListPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Geometry Dash Spam Challenge List",
    url: "https://geometrydashspam.cc/spam-challenge-list",
    dateModified: CHECKED_AT,
    isBasedOn: [LIST_SOURCE, LIST_HUB_SOURCE],
    about: {
      "@type": "Thing",
      name: "Geometry Dash Spam Challenge List",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Spam Challenge List", href: "/spam-challenge-list" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-8 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400">
            Community challenge list · source checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            Geometry Dash Spam Challenge List
          </h1>
          <p className="leading-7 text-slate-400">
            The <strong className="text-white">Spam Challenge List (SCL)</strong> is a community list for
            Geometry Dash challenges centered on rapid repeated input. It is a different ranking system from
            Pointercrate&apos;s Demon List, so this page keeps the two search intents separate.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-5 md:p-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-300">Quick answer</div>
          <p className="leading-7 text-slate-300">
            If you want the <strong className="text-white">current Spam Challenge List rankings, rules or submission information</strong>,
            open the maintained list source below. Its page states that it is the new, up-to-date list.
            We intentionally do not copy the live ranking here because placements and rules can change.
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-fuchsia-300">SCL</div>
            <h2 className="mb-2 text-xl font-bold text-white">Spam Challenge List</h2>
            <p className="text-sm leading-6 text-slate-400">
              Community challenges where spam or rapid repeated input is the defining skill. Use the live SCL for current placements.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Pointercrate</div>
            <h2 className="mb-2 text-xl font-bold text-white">Demon List</h2>
            <p className="text-sm leading-6 text-slate-400">
              A community ranking of extremely difficult Demon levels overall. It does not rank levels by spam intensity.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-300">Practice</div>
            <h2 className="mb-2 text-xl font-bold text-white">Spam Demon References</h2>
            <p className="text-sm leading-6 text-slate-400">
              Our separate practice page highlights spam-heavy Demons while preserving their real Pointercrate positions.
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">How to use the Spam Challenge List</h2>
          <ol className="space-y-4 text-slate-400">
            <li>
              <strong className="text-slate-200">1. Check the maintained source.</strong>{" "}
              Old videos, mirrors and documents can preserve a ranking that is no longer current.
            </li>
            <li>
              <strong className="text-slate-200">2. Read the current rules.</strong>{" "}
              Challenge-list requirements can be different from ordinary Demon List record rules.
            </li>
            <li>
              <strong className="text-slate-200">3. Train speed and control separately.</strong>{" "}
              Use the <Link href="/cps-test" className="text-blue-400 hover:underline">GD CPS Test</Link> for raw speed and the{" "}
              <Link href="/" className="text-blue-400 hover:underline">Geometry Dash Spam Test</Link> for controlled repeated input.
            </li>
            <li>
              <strong className="text-slate-200">4. Use the right reference page.</strong>{" "}
              For difficult rated Demons with spam-heavy gameplay, use the{" "}
              <Link href="/demon-list/spam-demons" className="text-blue-400 hover:underline">Spam Demon List guide</Link> instead.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Spam Challenge List FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            href={LIST_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-bold text-white"
          >
            Open current Spam Challenge List
          </a>
          <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Spam Test
          </Link>
          <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            CPS Test
          </Link>
          <Link href="/demon-list/spam-demons" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Spam Demons
          </Link>
        </div>
      </article>
    </>
  );
}
