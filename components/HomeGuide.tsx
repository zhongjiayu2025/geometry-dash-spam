import React from "react";
import Link from "next/link";
import { Activity, BookOpen, MousePointer2, Trophy } from "lucide-react";
import { WAVE_PRESETS } from "../data/wavePresets";

const faqs = [
  {
    q: "What is Geometry Dash spam?",
    a: "Geometry Dash spam is rapid repeated clicking, tapping or key pressing used to control a game mode through tight sections. Good spam depends on both input speed and consistent timing.",
    href: null,
  },
  {
    q: "Is higher CPS always better for wave spam?",
    a: "No. High CPS can help in some sections, but uncontrolled inputs make the wave less stable. Use the CPS test for speed and the spam trainer for control.",
    href: null,
  },
  {
    q: "Does the trainer work on mobile?",
    a: "Yes. The trainer accepts pointer and touch input in modern mobile browsers. Device and browser behavior can still affect how the test feels compared with the game.",
    href: null,
  },
  {
    q: "Where is the current Geometry Dash Spam Challenge List?",
    a: "Use the maintained Spam Challenge List entry linked from our SCL guide. The SCL is a separate community challenge ranking from Pointercrate's Demon List, so current placements and rules should be checked at the live list source.",
    href: "/spam-challenge-list",
  },
  {
    q: "What is the best clicking method for Geometry Dash spam?",
    a: "There is no universal best method. Normal or alternating inputs can be easier to control, while jitter, butterfly and drag techniques trade different amounts of speed, consistency and fatigue. Use the method you can repeat cleanly, and check the current challenge rules before a ranked submission.",
    href: null,
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
    <section className="defer-render-long w-full max-w-5xl mx-auto pt-10 pb-16 space-y-14 text-slate-300 leading-relaxed">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">What is Geometry Dash spam?</h2>
        <p className="text-base md:text-lg">
          <strong className="text-white">Geometry Dash spam</strong> means sending rapid repeated inputs while still keeping enough rhythm and control to survive a tight section.
          Raw speed matters, but consistent timing matters just as much. The main tool is a <strong className="text-white">wave-spam control trainer</strong>, while the{" "}
          <Link href="/cps-test" className="text-blue-400 hover:underline">Geometry Dash CPS test (GD CPS test)</Link>{" "}
          is the dedicated spam click test for raw click speed and timing metrics.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6 md:p-8">
        <h2 className="mb-3 text-2xl font-display font-bold text-white">Spam Test vs Spam Click Test</h2>
        <p className="text-sm leading-7 text-slate-300 md:text-base">
          Use this page when you want to practice <strong className="text-white">Geometry Dash wave spam and control</strong>.
          If your goal is simply to count clicks and measure CPS, use the{" "}
          <Link href="/cps-test" className="font-semibold text-blue-400 hover:underline">
            spam click test / Geometry Dash CPS Test
          </Link>.
          Keeping the two tasks separate makes the results easier to interpret: one measures input speed, the other tests whether that speed stays controllable in a wave corridor.
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

      <div id="spam-test-series">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
          Geometry Dash Spam Test Series: 5 drills in one trainer
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500">
          Instead of cloning dozens of numbered spam-test pages, the main trainer keeps five distinct practice presets in one place.
          Start with control, add faster corrections, move into wave spam, tighten precision, then use Endless for repeatable endurance.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {WAVE_PRESETS.map((preset, index) => (
            <a
              key={preset.id}
              href="#spam-test-tool"
              className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-blue-500/40"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
                Drill {index + 1}
              </span>
              <h3 className="mt-2 font-bold text-white">{preset.label}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{preset.description}</p>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Every drill uses the same browser wave simulator, so your comparisons stay on one device and one input pipeline instead of mixing unrelated games.
        </p>
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
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Geometry Dash spam clicking methods</h2>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-500">
          Different methods trade speed for control in different ways. There is no universal “best” spam technique,
          and a challenge list can have its own input rules. Compare methods on the same device, then keep the one you can repeat cleanly.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="mb-2 font-bold text-white">Normal / alternating</h3>
            <p className="text-sm leading-6 text-slate-400">
              A useful baseline because the goal is an even cadence, not the highest one-second peak.
            </p>
          </div>
          <Link href="/jitter-click" className="rounded-xl border border-white/10 bg-slate-900/30 p-5 hover:border-blue-500/40">
            <h3 className="mb-2 font-bold text-white">Jitter clicking</h3>
            <p className="text-sm leading-6 text-slate-400">
              Compare vibration-style clicking speed with repeatability instead of judging one peak attempt.
            </p>
          </Link>
          <Link href="/butterfly-click" className="rounded-xl border border-white/10 bg-slate-900/30 p-5 hover:border-blue-500/40">
            <h3 className="mb-2 font-bold text-white">Butterfly clicking</h3>
            <p className="text-sm leading-6 text-slate-400">
              Alternate two fingers and compare whether the extra input rate still stays evenly spaced.
            </p>
          </Link>
          <Link href="/drag-click" className="rounded-xl border border-white/10 bg-slate-900/30 p-5 hover:border-blue-500/40">
            <h3 className="mb-2 font-bold text-white">Drag clicking</h3>
            <p className="text-sm leading-6 text-slate-400">
              Useful for testing dense bursts, but hardware behavior and list rules can affect whether it is appropriate.
            </p>
          </Link>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          For ranked spam challenges, check the <Link href="/spam-challenge-list" className="text-fuchsia-400 hover:underline">current Spam Challenge List</Link> before assuming a technique or hardware setup is allowed.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Popular Geometry Dash reference guides</h2>
        <p className="text-sm text-slate-500 mb-5 max-w-3xl">
          Use these supporting guides when your search is about game progression or reference information rather than spam training.
          If you are looking for ranked spam challenges, use the <Link href="/spam-challenge-list" className="text-fuchsia-400 hover:underline">Geometry Dash Spam Challenge List</Link>.
          If you want spam-heavy rated Demons instead, use the <Link href="/demon-list/spam-demons" className="text-blue-400 hover:underline">spam Demon reference guide</Link>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/spam-challenge-list" className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-4 hover:border-fuchsia-400/40">
            <h3 className="font-bold text-white mb-1">Spam Challenge List</h3>
            <p className="text-xs leading-5 text-slate-500">Current SCL entry point and clear separation from the Demon List.</p>
          </Link>
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
          <Link href="/how-to-get-diamonds-geometry-dash" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-cyan-500/40">
            <h3 className="font-bold text-white mb-1">How to Get Diamonds</h3>
            <p className="text-xs leading-5 text-slate-500">Daily chests, quests, Daily/Weekly progress, Gauntlets, Paths and Treasure Room sources.</p>
          </Link>
          <Link href="/geometry-dash-stuttering-high-end-pc" className="rounded-xl border border-white/10 bg-slate-900/30 p-4 hover:border-red-500/40">
            <h3 className="font-bold text-white mb-1">PC Stuttering Guide</h3>
            <p className="text-xs leading-5 text-slate-500">A controlled one-variable-at-a-time checklist for high-end PC stutter.</p>
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
              {item.href && (
                <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300">
                  Open current SCL guide →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
