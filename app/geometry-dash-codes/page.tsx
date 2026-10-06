import type { Metadata } from "next";
import Link from "next/link";
import VaultCodeTable from "../../components/VaultCodeTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  CHAMBER_CODES,
  THE_VAULT_CODES,
  VAULT_CODES_CHECKED_AT,
  VAULT_OF_SECRETS_CODES,
  VAULT_SOURCES,
  WRAITH_CODES,
} from "../../data/vaultCodes";

const codesTitle = "Geometry Dash Codes – Working Vault & Wraith Codes";
const codesDescription =
  `Working Geometry Dash codes for The Vault, Vault of Secrets, Chamber of Time and Wraith, checked ${VAULT_CODES_CHECKED_AT}. Search, copy and see unlock notes.`;

export const metadata: Metadata = {
  title: codesTitle,
  description: codesDescription,
  alternates: { canonical: "/geometry-dash-codes" },
  openGraph: {
    title: codesTitle,
    description: codesDescription,
    url: "https://geometrydashspam.cc/geometry-dash-codes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: codesTitle,
    description: codesDescription,
  },
};

const codeFaqs = [
  {
    q: "Where do I enter Geometry Dash vault codes?",
    a: "Use the code in the matching room: The Vault, Vault of Secrets, Chamber of Time or the Secret Room/Wraith. Codes from one room generally do not work in another.",
  },
  {
    q: "Are The Vault and Vault of Secrets the same thing?",
    a: "No. They are separate code rooms with different unlock requirements and different code lists. The Vault uses user coins to unlock, while the Vault of Secrets requires diamonds.",
  },
  {
    q: "Why is a Geometry Dash code not working?",
    a: "Check that you are in the correct room, that its unlock requirement is complete, and that the reward has not already been redeemed. Wraith codes can also be enabled or disabled server-side.",
  },
];

export default function GeometryDashCodesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Geometry Dash Codes",
    url: "https://geometrydashspam.cc/geometry-dash-codes",
    dateModified: VAULT_CODES_CHECKED_AT,
    about: { "@type": "VideoGame", name: "Geometry Dash" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: codeFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[{ label: "Geometry Dash Codes", href: "/geometry-dash-codes" }]} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Vault code guide · checked {VAULT_CODES_CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            Geometry Dash Codes
          </h1>
          <p className="leading-7 text-slate-400">
            Geometry Dash has several separate code rooms. Use the correct table for <strong className="text-slate-200">The Vault</strong>,{" "}
            <strong className="text-slate-200">Vault of Secrets</strong>, <strong className="text-slate-200">Chamber of Time</strong> or{" "}
            <strong className="text-slate-200">The Wraith</strong>. Wraith codes are server-side and can change without a game update.
          </p>
        </header>

        <nav className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Code sections">
          {[
            ["#the-vault", "The Vault"],
            ["/geometry-dash-vault-of-secrets-codes", "Vault of Secrets"],
            ["#chamber", "Chamber of Time"],
            ["#wraith", "The Wraith"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-xl border border-white/10 bg-slate-900/35 px-4 py-4 text-sm font-bold text-white hover:border-blue-500/40">
              {label}
            </Link>
          ))}
        </nav>

        <section id="the-vault" className="mb-14 scroll-mt-28">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">The Vault codes</h2>
              <p className="mt-1 text-sm text-slate-500">Unlock The Vault with 10 user coins.</p>
            </div>
            <a href={VAULT_SOURCES.vault} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
              Source: Geometry Dash Wiki
            </a>
          </div>
          <VaultCodeTable codes={THE_VAULT_CODES} label="The Vault codes" />
        </section>

        <section className="mb-14">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Vault of Secrets codes</h2>
              <p className="mt-1 text-sm text-slate-500">The Vault of Secrets requires 50 diamonds to unlock.</p>
            </div>
            <Link href="/geometry-dash-vault-of-secrets-codes" className="text-sm font-semibold text-blue-400 hover:underline">
              Open detailed Vault of Secrets guide →
            </Link>
          </div>
          <VaultCodeTable codes={VAULT_OF_SECRETS_CODES} label="Vault of Secrets codes" />
        </section>

        <section id="chamber" className="mb-14 scroll-mt-28">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Chamber of Time codes</h2>
              <p className="mt-1 text-sm text-slate-500">These fixed codes unlock icons, a color and other Icon Kit rewards.</p>
            </div>
            <a href={VAULT_SOURCES.chamber} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
              Source: Geometry Dash Wiki
            </a>
          </div>
          <VaultCodeTable codes={CHAMBER_CODES} label="Chamber of Time codes" />
        </section>

        <section id="wraith" className="mb-14 scroll-mt-28">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Wraith codes</h2>
              <p className="mt-1 text-sm text-slate-500">
                The Wraith is server-side, so codes can be added or disabled independently of a client update.
              </p>
            </div>
            <a href={VAULT_SOURCES.wraith} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
              Source: Geometry Dash Wiki
            </a>
          </div>
          <VaultCodeTable codes={WRAITH_CODES} label="Wraith codes" />
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <Link href="/how-to-get-diamonds-geometry-dash" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-blue-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">How to get Diamonds</h2>
            <p className="text-sm leading-6 text-slate-400">Daily chests, quests, rotating levels, Gauntlets, Paths and Treasure Room sources.</p>
          </Link>
          <Link href="/how-to-get-gold-keys-geometry-dash" className="rounded-xl border border-white/10 bg-slate-900/30 p-6 hover:border-yellow-500/40">
            <h2 className="mb-2 text-xl font-bold text-white">How to get Gold Keys</h2>
            <p className="text-sm leading-6 text-slate-400">See the Event Level and Secret Room methods, plus where Gold Keys are spent.</p>
          </Link>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-white">Why a code may not work</h2>
          <p className="leading-7 text-slate-400">
            Check that you are in the correct vault, that any unlock requirement is complete, and that a one-time reward has not already been redeemed. For Wraith codes, an internet connection is required and server-side availability can change.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Codes FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {codeFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
