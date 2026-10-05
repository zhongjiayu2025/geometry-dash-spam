import React from "react";
import Link from "next/link";
import { Activity, BookOpen, MousePointer2, Trophy } from "lucide-react";

const faqs = [
  {
    q: "What is Geometry Dash spam?",
    a: "Geometry Dash spam is rapid repeated clicking, tapping or key pressing used to control a game mode through tight sections. Good spam depends on both input speed and consistent timing.",
  },
  {
    q: "Is higher CPS always better for wave spam?",
    a: "No. High CPS can help in some sections, but uncontrolled inputs make the wave less stable. Use the CPS test for speed and the spam trainer for control.",
  },
  {
    q: "Does the trainer work on mobile?",
    a: "Yes. The trainer accepts pointer and touch input in modern mobile browsers. Device and browser behavior can still affect how the test feels compared with the game.",
  },
];

export default function HomeGuide() {
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
    <section className="w-full max-w-5xl mx-auto pt-10 pb-16 space-y-14 text-slate-300 leading-relaxed">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">What is Geometry Dash spam?</h2>
        <p className="text-base md:text-lg">
          <strong className="text-white">Geometry Dash spam</strong> means sending rapid repeated inputs while still keeping enough rhythm and control to survive a tight section.
          Raw speed matters, but consistent timing matters just as much. The main tool works as a <strong className="text-white">Geometry Dash spam click test</strong> with wave control, while the{" "}
          <Link href="/cps-test" className="text-blue-400 hover:underline">Geometry Dash CPS test (GD CPS test)</Link>{" "}
          isolates raw click speed and timing metrics.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">Train the skill, not just the click count</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/geometry-dash-wave" className="rounded-xl border border-white/10 bg-slate-900/40 p-6 hover:border-blue-500/50 transition-colors">
            <Activity className="w-7 h-7 text-blue-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Geometry Dash Wave</h3>
            <p className="text-sm text-slate-400">Practice wave control, mini wave and tighter corridors in a dedicated trainer.</p>
          </Link>
          <Link href="/cps-test" className="rounded-xl border border-white/10 bg-slate-900/40 p-6 hover:border-blue-500/50 transition-colors">
            <MousePointer2 className="w-7 h-7 text-blue-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Geometry Dash CPS Test</h3>
            <p className="text-sm text-slate-400">Measure click speed over 1, 3, 5, 10, 30 or 60 seconds and keep local personal bests.</p>
          </Link>
          <Link href="/demon-list" className="rounded-xl border border-white/10 bg-slate-900/40 p-6 hover:border-blue-500/50 transition-colors">
            <Trophy className="w-7 h-7 text-blue-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Geometry Dash Demon List</h3>
            <p className="text-sm text-slate-400">See a sourced snapshot of the hardest listed demons and jump to focused level guides.</p>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-4">How to practice wave spam</h2>
          <ol className="space-y-3 text-slate-400">
            <li><strong className="text-slate-200">Start wide.</strong> Use an easier difficulty until your inputs are repeatable.</li>
            <li><strong className="text-slate-200">Measure speed separately.</strong> Use the CPS test to find your sustainable rate.</li>
            <li><strong className="text-slate-200">Tighten the corridor.</strong> Increase difficulty only when control remains stable.</li>
            <li><strong className="text-slate-200">Stop if your hand hurts.</strong> Short practice sessions are preferable to grinding through pain.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
          <BookOpen className="w-7 h-7 text-blue-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-3">Guides that support the tools</h2>
          <p className="text-sm text-slate-400 mb-4">
            Use the practical guides to compare clicking methods, wave control and training routines, with each browser metric explained in plain language.
          </p>
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 font-semibold">Browse Geometry Dash guides →</Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Popular Geometry Dash reference guides</h2>
        <p className="text-sm text-slate-500 mb-5 max-w-3xl">
          Use these supporting guides when your search is about game progression or reference information rather than spam training.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/geometry-dash-codes" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-blue-500/40">
            <h3 className="font-bold text-white mb-1">Geometry Dash Codes</h3>
            <p className="text-xs leading-5 text-slate-500">Vault, Secrets, Chamber and Wraith code reference.</p>
          </Link>
          <Link href="/hardest-level" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-purple-500/40">
            <h3 className="font-bold text-white mb-1">Hardest Geometry Dash Level</h3>
            <p className="text-xs leading-5 text-slate-500">Current #1 answer tied to a dated Demon List source.</p>
          </Link>
          <Link href="/easiest-demons" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-green-500/40">
            <h3 className="font-bold text-white mb-1">Easiest Demons</h3>
            <p className="text-xs leading-5 text-slate-500">Beginner-oriented demon progression references.</p>
          </Link>
          <Link href="/geometry-dash-difficulty-faces" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-yellow-500/40">
            <h3 className="font-bold text-white mb-1">Difficulty Faces</h3>
            <p className="text-xs leading-5 text-slate-500">Difficulty ratings, star ranges and Demon sub-difficulties.</p>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">Geometry Dash spam FAQ</h2>
        <div className="space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="font-bold text-white mb-2">{item.q}</h3>
              <p className="text-sm text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
