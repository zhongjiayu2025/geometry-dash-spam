import type { Metadata } from "next";
import Link from "next/link";
import VaultCodeTable from "../../components/VaultCodeTable";
import {
  VAULT_CODES_CHECKED_AT,
  VAULT_OF_SECRETS_CODES,
  VAULT_SOURCES,
} from "../../data/vaultCodes";

export const metadata: Metadata = {
  title: "Geometry Dash Vault of Secrets Codes – All Codes & Unlock Steps",
  description:
    "Geometry Dash Vault of Secrets codes including brainpower, octocube, seven, glubfub, cod3breaker and The Challenge, with unlock notes.",
  alternates: { canonical: "/geometry-dash-vault-of-secrets-codes" },
  openGraph: {
    title: "Geometry Dash Vault of Secrets Codes – All Codes & Unlock Steps",
    description: "Geometry Dash Vault of Secrets codes including brainpower, octocube, seven, glubfub, cod3breaker and The Challenge, with unlock notes.",
    url: "https://geometrydashspam.cc/geometry-dash-vault-of-secrets-codes",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Vault of Secrets Codes – All Codes & Unlock Steps",
    description: "Geometry Dash Vault of Secrets codes including brainpower, octocube, seven, glubfub, cod3breaker and The Challenge, with unlock notes.",
  },
};

export default function VaultOfSecretsCodesPage() {
  return (
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

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href={VAULT_SOURCES.secrets} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
          Geometry Dash Wiki source
        </a>
        <Link href="/geometry-dash-codes" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">
          All Geometry Dash codes
        </Link>
      </div>
    </article>
  );
}
