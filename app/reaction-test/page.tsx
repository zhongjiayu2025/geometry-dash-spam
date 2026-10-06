import ReactionTest from "../../components/ReactionTest";
import RelatedTools from "../../components/RelatedTools";
import Breadcrumbs from "../../components/Breadcrumbs";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";
import Link from "next/link";
import { Metadata } from "next";
import { Eye } from "lucide-react";

const description =
  "Measure browser-based reaction time in milliseconds, then compare repeatable visual-response runs for Geometry Dash practice. Device, display and browser latency affect results.";

export const metadata: Metadata = {
  title: "Reaction Time Test (ms) | Geometry Dash Visual Response",
  description,
  alternates: { canonical: "/reaction-test" },
  openGraph: {
    title: "Reaction Time Test (ms) | Geometry Dash Visual Response",
    description,
    url: "https://geometrydashspam.cc/reaction-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reaction Time Test (ms) | Geometry Dash Visual Response",
    description,
  },
};

const reactionFaqs = [
  {
    q: "What does this reaction time test measure?",
    a: "It measures the browser-observed time between a visual cue appearing and the input event reaching the page. The result includes your response plus delay from the display, device, operating system and browser.",
  },
  {
    q: "Can this test measure my exact Geometry Dash input latency?",
    a: "No. This is a browser training diagnostic, not a laboratory measurement of the Geometry Dash client or one hardware component. Use the same setup when comparing your own repeated runs.",
  },
  {
    q: "How should I use reaction practice for Geometry Dash?",
    a: "Use several attempts to establish a repeatable range, then combine visual-response practice with CPS and wave-control drills. Fast reaction alone does not replace timing and movement control.",
  },
];

export default function ReactionTestPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: reactionFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <ToolWebApplicationSchema
        name="Reaction Time Test for Geometry Dash"
        path="/reaction-test"
        description={description}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumbs items={[{ label: "Reaction Time Test", href: "/reaction-test", active: true }]} />

      <header className="mb-8 text-center md:mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
          VISUAL RESPONSE PRACTICE
        </div>
        <h1 className="mb-3 text-3xl font-display font-bold uppercase text-white md:text-5xl">
          Reaction Time Test
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
          Measure browser-observed visual response time, compare a repeatable range on the same setup, and use it as one part of Geometry Dash input practice.
        </p>
      </header>

      <ReactionTest />

      <section className="mx-auto mt-12 max-w-4xl space-y-8 pb-4">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 md:p-10">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-display font-bold text-white md:text-3xl">
            <Eye className="h-7 w-7 text-green-500" /> What this reaction test measures
          </h2>
          <div className="space-y-4 leading-relaxed text-slate-300">
            <p>
              This page measures the time between a browser visual cue and the input event that reaches the page. The number includes your response plus delay from the display, input device, operating system and browser.
            </p>
            <p>
              Use several attempts on the same setup and compare your own range. One unusually fast or slow run is less useful than a group of repeatable results.
            </p>
            <p>
              Refresh rate can change how quickly a visual cue becomes visible, but the display frame interval is not the same thing as total end-to-end input latency.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Keep the setup fixed</h3>
            <p className="text-sm leading-6 text-slate-400">
              Compare runs using the same device, browser, display and input method.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Use multiple attempts</h3>
            <p className="text-sm leading-6 text-slate-400">
              A repeatable range is more informative than one unusually fast result.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Treat it as a browser test</h3>
            <p className="text-sm leading-6 text-slate-400">
              The score is not a laboratory measurement of your nervous system, mouse, keyboard or game client.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">How reaction practice fits Geometry Dash</h2>
          <p className="mb-4 text-sm leading-6 text-slate-400">
            Reaction speed answers a different question from repeated-input speed and wave control. Use the tools together instead of treating one score as a complete performance benchmark.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/cps-test" className="rounded-lg border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 hover:border-blue-400/50">
              Geometry Dash CPS Test →
            </Link>
            <Link href="/geometry-dash-wave" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-blue-400/40">
              Wave Trainer →
            </Link>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-display font-bold text-white">Reaction Time Test FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reactionFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <RelatedTools currentTool="reaction" />
    </>
  );
}
