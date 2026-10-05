import type { Metadata } from "next";
import Link from "next/link";
import VaultCodeTable from "../../components/VaultCodeTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  VAULT_CODES_CHECKED_AT,
  VAULT_OF_SECRETS_CODES,
  VAULT_SOURCES,
} from "../../data/vaultCodes";

export const metadata: Metadata = {
  title: "Geometry Dash Vault of Secrets Codes | All Codes",
  description:
    "Geometry Dash Vault of Secrets codes with brainpower, octocube, seven, glubfub, cod3breaker and The Challenge, plus the 50-diamond unlock steps.",
  alternates: { canonical: "/geometry-dash-vault-of-secrets-codes" },
  openGraph: {
    title: "Geometry Dash Vault of Secrets Codes | All Codes",
    description: "Geometry Dash Vault of Secrets codes with brainpower, octocube, seven, glubfub, cod3breaker and The Challenge, plus the 50-diamond unlock steps.",
    url: "https://geometrydashspam.cc/geometry-dash-vault-of-secrets-codes",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Vault of Secrets Codes | All Codes",
    description: "Geometry Dash Vault of Secrets codes with brainpower, octocube, seven, glubfub, cod3breaker and The Challenge, plus the 50-diamond unlock steps.",
  },
};

const vaultFaqs = [
  {
    q: "How do you unlock the Vault of Secrets in Geometry Dash?",
    a: "Collect 50 diamonds, open the Tools menu from the main menu and use the unlocked padlock icon to enter the Vault of Secrets.",
  },
  {
    q: "What are the Geometry Dash Vault of Secrets codes?",
    a: "The code list includes entries such as brainpower, octocube, seven, glubfub, cod3breaker and The Challenge. Some entries have extra prerequisites, so use the notes beside each code.",
  },
  {
    q: "Why is a Vault of Secrets code not working?",
    a: "First confirm that you are in the Vault of Secrets rather than The Vault or Chamber of Time. Then check whether the code has an extra prerequisite or has already been redeemed.",
  },
];

export default function VaultOfSecretsCodesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vaultFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[{ label: "Codes", href: "/geometry-dash-codes" }, { label: "Vault of Secrets", href: "/geometry-dash-vault-of-secrets-codes" }]} />
    <article className="mx-auto max-w-5xl">
      <header className="mb-10 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          Vault of Secrets · checked {VAULT_CODES_CHECKED_AT}
        </p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Geometry Dash Vault of Secrets Codes
        </h1>
        <p className="leading-7 text-slate-400">
          The Vault of Secrets is separate from The Vault and the Chamber of Time. It requires <strong className="text-white">50 diamonds</strong> to unlock, and some codes have extra prerequisites rather than working as a simple one-step password.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-purple-500/20 bg-purple-950/15 p-5 md:p-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300">Quick answer</div>
        <p className="leading-7 text-slate-300">
          You need <strong className="text-white">50 diamonds</strong> to unlock the Vault of Secrets.
          If you still need diamonds, use the <Link href="/how-to-get-diamonds-geometry-dash" className="text-blue-400 hover:underline">Geometry Dash diamond guide</Link>.
          Once inside, use the code table below and follow the prerequisite note for codes such as glubfub or cod3breaker.
        </p>
      </section>

      <VaultCodeTable codes={VAULT_OF_SECRETS_CODES} label="Vault of Secrets codes" />

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">How to unlock the Vault of Secrets</h2>
          <p className="text-sm leading-6 text-slate-400">
            Collect 50 diamonds, open the Tools menu from the main menu and use the unlocked padlock icon to enter the Vault of Secrets.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">Why glubfub is different</h2>
          <p className="text-sm leading-6 text-slate-400">
            Glubfub needs the dialogue sequence involving Sparky in the regular Vault before it can be redeemed in the Vault of Secrets.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">How cod3breaker works</h2>
          <p className="text-sm leading-6 text-slate-400">
            The game shows six numbers. Subtract each previous number from the next one, then concatenate the five results and enter that answer.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">What “The Challenge” does</h2>
          <p className="text-sm leading-6 text-slate-400">
            Entering “the challenge” reveals access to the secret level. The level itself then requires 200 diamonds.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Vault of Secrets FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {vaultFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="mb-2 font-bold text-white">{item.q}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href={VAULT_SOURCES.secrets} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
          Geometry Dash Wiki source
        </a>
        <Link href="/geometry-dash-codes" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
          All Geometry Dash codes
        </Link>
        <Link href="/how-to-get-diamonds-geometry-dash" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
          How to get Diamonds
        </Link>
      </div>
    </article>
    </>
  );
}
