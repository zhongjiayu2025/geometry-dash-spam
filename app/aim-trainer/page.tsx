import AimTrainer from "../../components/AimTrainer";
import RelatedTools from "../../components/RelatedTools";
import Breadcrumbs from "../../components/Breadcrumbs";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";
import Link from "next/link";
import { Metadata } from "next";
import { Crosshair, MousePointer2, Target } from "lucide-react";

const description =
  "Practice mouse accuracy, target clicking and precision with a free 30-second browser aim trainer. Compare repeatable results on the same device and setup.";

export const metadata: Metadata = {
  title: "Aim Trainer | Mouse Accuracy & Precision Test",
  description,
  alternates: { canonical: "/aim-trainer" },
  openGraph: {
    title: "Aim Trainer | Mouse Accuracy & Precision Test",
    description,
    url: "https://geometrydashspam.cc/aim-trainer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aim Trainer | Mouse Accuracy & Precision Test",
    description,
  },
};

const aimFaqs = [
  {
    q: "What does this aim trainer measure?",
    a: "It records browser-side target hits, misses, accuracy and score during a 30-second mouse precision drill. Results depend on your device, pointer settings, display, browser and how you approach the targets.",
  },
  {
    q: "How should I compare aim trainer results?",
    a: "Keep the same mouse, sensitivity, browser and display, then compare several runs rather than one peak score. A repeatable improvement is more useful than a single outlier.",
  },
  {
    q: "Does aim training directly improve Geometry Dash wave skill?",
    a: "Not directly. Geometry Dash wave control is primarily a timing and press-release skill. This aim trainer is a supporting mouse-control exercise; use the CPS and Wave tools for game-specific repeated-input practice.",
  },
];

export default function AimTrainerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: aimFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <ToolWebApplicationSchema
        name="Mouse Aim Trainer"
        path="/aim-trainer"
        description={description}
        applicationCategory="GameApplication"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumbs items={[{ label: "Aim Trainer", href: "/aim-trainer", active: true }]} />

      <header className="mb-8 text-center md:mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
          30-SECOND MOUSE PRECISION PRACTICE
        </div>
        <h1 className="mb-3 text-3xl font-display font-bold uppercase text-white md:text-5xl">
          Aim Trainer
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
          Practice target clicking, mouse accuracy and precision in a lightweight browser drill. Compare repeated runs on the same setup instead of relying on one peak score.
        </p>
      </header>

      <AimTrainer />

      <section className="mx-auto mt-12 max-w-4xl space-y-8">
        <div className="rounded-2xl border border-white/10 bg-slate-900/35 p-6 md:p-8">
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-display font-bold text-white">
            <Target className="h-7 w-7 text-blue-400" aria-hidden="true" />
            How to use this aim trainer
          </h2>
          <ol className="grid gap-4 text-sm leading-6 text-slate-400 md:grid-cols-3">
            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <strong className="mb-1 block text-white">1. Keep settings fixed</strong>
              Use the same mouse, sensitivity, browser zoom and display when comparing runs.
            </li>
            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <strong className="mb-1 block text-white">2. Prioritize clean hits</strong>
              Move deliberately between targets instead of chasing speed while accuracy collapses.
            </li>
            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <strong className="mb-1 block text-white">3. Compare several runs</strong>
              Look for a repeatable score and accuracy range rather than one unusually strong attempt.
            </li>
          </ol>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <MousePointer2 className="h-5 w-5 text-blue-400" aria-hidden="true" />
              Mouse precision vs click speed
            </h2>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Aim practice tests target acquisition and pointer control. CPS tests answer a different question: how quickly and consistently you can register repeated inputs.
            </p>
            <Link href="/cps-test" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
              Open the Geometry Dash CPS Test →
            </Link>
          </div>

          <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <Crosshair className="h-5 w-5 text-fuchsia-400" aria-hidden="true" />
              How this relates to Geometry Dash
            </h2>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Geometry Dash wave control is mainly about timing repeated press-and-release inputs, not cursor aim. Use this page as optional mouse-control practice, then use the dedicated Wave Trainer for the game-specific skill.
            </p>
            <Link href="/geometry-dash-wave" className="text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200">
              Open the Wave Trainer →
            </Link>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-display font-bold text-white">Aim Trainer FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {aimFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <RelatedTools currentTool="aim" />
    </>
  );
}
