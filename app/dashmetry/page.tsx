import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import relatedSearchData from "../../data/relatedSearch.json";

const relatedPageData = relatedSearchData.dashmetry;
const CHECKED_AT = relatedPageData.checkedAt;
const [REBRAND_SOURCE, CURRENT_GAME_SOURCE] = relatedPageData.sources;
const LEGACY_NAME = relatedPageData.legacyName;
const CURRENT_NAME = relatedPageData.currentName;

export const metadata: Metadata = {
  title: `${LEGACY_NAME} Is Now ${CURRENT_NAME} | Current Game Guide`,
  description:
    `${LEGACY_NAME} is now ${CURRENT_NAME}. See what changed, where the current game lives, how it relates to Geometry Dash and which current features are source-checked.`,
  alternates: { canonical: "/dashmetry" },
  openGraph: {
    title: `${LEGACY_NAME} Is Now ${CURRENT_NAME} | Current Game Guide`,
    description:
      `${LEGACY_NAME} is now ${CURRENT_NAME}. See the current official home, rebrand context and source-checked game features.`,
    url: "https://geometrydashspam.cc/dashmetry",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${LEGACY_NAME} Is Now ${CURRENT_NAME} | Current Game Guide`,
    description:
      `${LEGACY_NAME} is now ${CURRENT_NAME}. See the current official home, rebrand context and source-checked game features.`,
  },
};

const faqs = [
  {
    q: `Is ${LEGACY_NAME} still called ${LEGACY_NAME}?`,
    a: `The ${LEGACY_NAME} rebrand page says the game is now called ${CURRENT_NAME}. It describes the move as the same game under a new home, with levels, scores and leaderboard data moving with it.`,
  },
  {
    q: `Is ${LEGACY_NAME} the same as Geometry Dash?`,
    a: `No. ${LEGACY_NAME}, now ${CURRENT_NAME}, is a separate browser rhythm platformer. It shares familiar auto-running, obstacle-timing and form-change ideas, but it is not an official Geometry Dash release.`,
  },
  {
    q: `Where should I play ${LEGACY_NAME} now?`,
    a: `Use the current ${CURRENT_NAME} page linked from the ${LEGACY_NAME} rebrand notice. This site does not mirror or rehost the game.`,
  },
];

export default function DashmetryPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${LEGACY_NAME} Is Now ${CURRENT_NAME}`,
    url: "https://geometrydashspam.cc/dashmetry",
    isPartOf: { "@id": "https://geometrydashspam.cc/#website" },
    publisher: { "@id": "https://geometrydashspam.cc/#organization" },
    dateModified: CHECKED_AT,
    isBasedOn: [REBRAND_SOURCE, CURRENT_GAME_SOURCE],
    about: {
      "@type": "VideoGame",
      name: CURRENT_NAME,
      alternateName: LEGACY_NAME,
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
      <Breadcrumbs items={[{ label: "Dashmetry", href: "/dashmetry" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Related rhythm game · source checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            {LEGACY_NAME} Is Now {CURRENT_NAME}
          </h1>
          <p className="leading-7 text-slate-400">
            Players still search for <strong className="text-white">Dashmetry</strong>, but the project has moved under the
            <strong className="text-white"> Challenge Rush</strong> name. This page keeps the old search term connected to the
            current game without pretending it is an official Geometry Dash release.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5 md:p-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Quick answer</div>
          <p className="leading-7 text-slate-300">
            {LEGACY_NAME} has been rebranded as <strong className="text-white">{CURRENT_NAME}</strong>. The {LEGACY_NAME} rebrand page
            says existing levels, scores and leaderboard data moved to the new home. For the current playable version,
            use the official Challenge Rush link below rather than an old mirror.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={CURRENT_GAME_SOURCE}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              Play current {CURRENT_NAME} ↗
            </a>
            <a
              href={REBRAND_SOURCE}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-cyan-500/20 px-4 py-2 text-sm font-bold text-cyan-200"
            >
              Verify the Dashmetry rebrand
            </a>
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">What happened to Dashmetry?</h2>
            <p className="leading-7 text-slate-400">
              The legacy Dashmetry site now presents a rebrand notice and points players to Challenge Rush. The notice describes
              it as the same game in a new home rather than a separate sequel.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">Is Dashmetry Geometry Dash?</h2>
            <p className="leading-7 text-slate-400">
              No. Challenge Rush is a separate browser rhythm platformer. The overlap is the style of precision timing,
              automatic forward movement and changing movement forms, which is why the two games are often compared.
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Current Challenge Rush features</h2>
          <p className="mb-4 text-sm leading-7 text-slate-400">
            The current 1Games.IO page documents active development rather than a frozen legacy build. Recent updates include
            Race Mode, rated community-level rewards, player progress tracking, editor additions, graphics controls and gameplay fixes.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Race Mode", "Quick-play races against a bot with finish standings."],
              ["Community levels", "Rated levels can award progression resources and expose player progress."],
              ["Level editor", "Current updates continue adding triggers, portals and customization tools."],
              ["Performance options", "Graphics and effect controls are documented for reducing FPS drops on weaker devices."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
                <h3 className="mb-1 font-bold text-white">{title}</h3>
                <p className="text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Dashmetry FAQ</h2>
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
            <span className="mt-1 block text-xs leading-5 text-slate-500">Practice rapid repeated input in the browser trainer.</span>
          </Link>
          <Link href="/geometry-dash-wave" className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4 hover:border-blue-400/40">
            <strong className="block text-white">Geometry Dash Wave</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">Train wave timing and controlled spam separately from Challenge Rush.</span>
          </Link>
          <Link href="/cps-test" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-blue-500/40">
            <strong className="block text-white">Geometry Dash CPS Test</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">Measure raw repeated-input speed before practicing control.</span>
          </Link>
          <Link href="/geometry-dash-breeze" className="rounded-xl border border-sky-500/20 bg-sky-950/10 p-4 hover:border-sky-400/40">
            <strong className="block text-white">Geometry Dash Breeze</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">See another community-made Geometry Dash-related project.</span>
          </Link>
        </section>

        <div className="flex flex-wrap gap-3">
          <a href={CURRENT_GAME_SOURCE} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
            Open current {CURRENT_NAME}
          </a>
          <a href={REBRAND_SOURCE} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
            Dashmetry rebrand source
          </a>
        </div>
      </article>
    </>
  );
}
