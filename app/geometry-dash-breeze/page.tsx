import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import relatedSearchData from "../../data/relatedSearch.json";

const relatedPageData = relatedSearchData.breeze;
const CHECKED_AT = relatedPageData.checkedAt;
const [REPO_SOURCE, RELEASE_SOURCE] = relatedPageData.sources;
const LATEST_VERSION = "v1.3.1";
const LEVEL_COUNT = 10;
const breezeTitle = `Geometry Dash Breeze | ${LATEST_VERSION}, ${LEVEL_COUNT} Levels & Download`;
const breezeDescription =
  `Geometry Dash Breeze is a fan-made spinoff with ${LEVEL_COUNT} levels. Check ${LATEST_VERSION}, Android/Windows availability, known issues and the maintained GitHub download source.`;

export const metadata: Metadata = {
  title: breezeTitle,
  description: breezeDescription,
  alternates: { canonical: "/geometry-dash-breeze" },
  openGraph: {
    title: breezeTitle,
    description: breezeDescription,
    url: "https://geometrydashspam.cc/geometry-dash-breeze",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: breezeTitle,
    description: breezeDescription,
  },
};

const faqs = [
  {
    q: "Is Geometry Dash Breeze official?",
    a: "No. The project repository describes Geometry Dash Breeze as a fan-made spinoff by Andrexel and explicitly says it is not affiliated with RobTop Games.",
  },
  {
    q: "What is the latest Geometry Dash Breeze version?",
    a: `As checked on ${CHECKED_AT}, the project's GitHub Releases page marks v1.3.1 as the latest release.`,
  },
  {
    q: "Where should I download Geometry Dash Breeze?",
    a: "Use the project's own GitHub repository and Releases page instead of random APK mirrors. The repository lists its supported distribution options and current release assets.",
  },
];

export default function GeometryDashBreezePage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Geometry Dash Breeze",
    url: "https://geometrydashspam.cc/geometry-dash-breeze",
    dateModified: CHECKED_AT,
    isBasedOn: [REPO_SOURCE, RELEASE_SOURCE],
    about: {
      "@type": "VideoGame",
      name: "Geometry Dash Breeze",
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
      <Breadcrumbs items={[{ label: "Geometry Dash Breeze", href: "/geometry-dash-breeze" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
            Fan-made spinoff · source checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            Geometry Dash Breeze
          </h1>
          <p className="leading-7 text-slate-400">
            <strong className="text-white">Geometry Dash Breeze</strong> is a community-made spinoff project associated with
            Andrexel. The maintained repository clearly labels it as fan-made and not affiliated with RobTop Games.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-sky-500/20 bg-sky-950/10 p-5 md:p-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Quick answer</div>
          <p className="leading-7 text-slate-300">
            Geometry Dash Breeze is a <strong className="text-white">fan-made Geometry Dash spinoff</strong>. The project's
            GitHub repository describes <strong className="text-white">{LEVEL_COUNT} levels</strong> and lists GD Lists, Android and Windows availability,
            while its Releases page currently marks <strong className="text-white"> {LATEST_VERSION}</strong> as the latest release.
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">What is Geometry Dash Breeze?</h2>
            <p className="leading-7 text-slate-400">
              The project README describes Breeze as a fan-made spinoff by Andrexel. It uses Geometry Dash as its base subject,
              but its creators separately maintain the fan project and state that it is not an official RobTop Games product.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">Latest version: {LATEST_VERSION}</h2>
            <p className="leading-7 text-slate-400">
              The GitHub Releases page currently marks {LATEST_VERSION} as Latest. Its release notes mention a new achievement,
              a new main level called Ghost Retention, and additional bug fixes and tweaks.
            </p>
          </div>
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-500/20 bg-sky-950/10 p-4">
            <div className="text-2xl font-bold text-white">{LEVEL_COUNT}</div>
            <div className="text-xs uppercase tracking-wider text-sky-300">Levels in the maintained project</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
            <div className="text-2xl font-bold text-white">{LATEST_VERSION}</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Latest GitHub release checked {CHECKED_AT}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
            <div className="text-2xl font-bold text-white">Android + Windows</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Platforms listed by the maintained repository</div>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Platforms, download and compatibility</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
              <h3 className="mb-2 font-bold text-white">Available formats</h3>
              <p className="text-sm leading-6 text-slate-400">The repository lists GD Lists, Android and Windows availability.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
              <h3 className="mb-2 font-bold text-white">Android</h3>
              <p className="text-sm leading-6 text-slate-400">Current project notes target Android 5 and later, while warning that not every Android version has been tested.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
              <h3 className="mb-2 font-bold text-white">Download source</h3>
              <p className="text-sm leading-6 text-slate-400">Prefer the maintained GitHub Releases page so the version and release notes can be checked before installing anything.</p>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-amber-500/20 bg-amber-950/10 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">Known first-launch issue</h2>
          <p className="text-sm leading-7 text-slate-400">
            The project README notes that levels can sometimes appear as “Coming Soon” on the first launch. Its documented fix is
            to close the game completely and reopen it so the levels load again.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Breeze FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Related Geometry Dash pages">
          <Link href="/" className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4 hover:border-blue-400/40">
            <strong className="block text-white">Geometry Dash Spam Test</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">Practice repeated input in the main browser trainer.</span>
          </Link>
          <Link href="/geometry-dash-wave" className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4 hover:border-blue-400/40">
            <strong className="block text-white">Geometry Dash Wave</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">Train wave control without leaving the browser.</span>
          </Link>
          <Link href="/demon-list" className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4 hover:border-purple-400/40">
            <strong className="block text-white">Geometry Dash Demon List</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">Check the current Pointercrate top-50 snapshot.</span>
          </Link>
          <Link href="/dashmetry" className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4 hover:border-cyan-400/40">
            <strong className="block text-white">Dashmetry / Challenge Rush</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">See the current home of the former Dashmetry project.</span>
          </Link>
        </section>

        <div className="flex flex-wrap gap-3">
          <a href={RELEASE_SOURCE} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
            Open GitHub Releases
          </a>
          <a href={REPO_SOURCE} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Project repository
          </a>
        </div>
      </article>
    </>
  );
}
