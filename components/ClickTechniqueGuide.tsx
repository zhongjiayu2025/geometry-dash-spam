import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Crosshair,
  Mouse,
  MousePointer2,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";

export default function ClickTechniqueGuide({ variant }: { variant: "jitter" | "butterfly" }) {
  if (variant === "jitter") {
    return (
      <div className="defer-render">
        <section className="space-y-8 mb-16">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-950/10 p-5 md:p-6">
            <p className="text-sm leading-7 text-slate-300">
              <strong className="text-white">Quick answer:</strong> the jitter click test runs for 10 seconds and reports browser-registered CPS. Compare several runs on the same setup; the useful result is a repeatable range, not a universal target number.
            </p>
          </div>
          <section className="rounded-2xl border border-white/10 p-5 md:p-8">
            <h2 className="mb-4 text-2xl font-bold text-white">Separate a jitter burst from a repeatable gain</h2>
            <p className="mb-4 text-sm leading-7 text-slate-300">Use three 10-second normal-click runs as a baseline, then three jitter runs with the same mouse and settings. Rest between attempts and reverse the order in another session. Record each average CPS; this page cannot recognise your physical clicking technique, so label the method yourself.</p>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-2 text-left text-slate-400">Arithmetic example, not measured player results</caption><thead><tr><th className="p-3">Method</th><th className="p-3">Three average CPS values</th><th className="p-3">Median / range</th></tr></thead><tbody className="text-slate-300"><tr className="border-t border-white/10"><td className="p-3">Normal</td><td className="p-3">6.4 / 6.6 / 6.5</td><td className="p-3">6.5 / 6.4–6.6</td></tr><tr className="border-t border-white/10"><td className="p-3">Jitter</td><td className="p-3">9.6 / 7.1 / 6.8</td><td className="p-3">7.1 / 6.8–9.6</td></tr></tbody></table></div>
            <p className="mt-4 text-sm leading-7 text-slate-300">The example supports a 0.6 CPS difference between medians, not a repeatable 3.1 CPS gain based on the best jitter run. The declining series is a reason to retest; it cannot identify fatigue, registration or technique as the cause. Next compare the methods at one fixed Wave preset. Keep the faster method only if you can also reproduce the intended rises and releases.</p>
          </section>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="text-orange-500 w-8 h-8" />
              How to Practice Jitter Clicking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 leading-relaxed">
              <div>
                <p className="mb-4">
                  <strong>Jitter clicking</strong> is a rapid clicking technique that uses controlled tension and small repeated movements. Browser-registered CPS can vary by player, mouse, operating system and browser, so repeated tests on the same setup are more useful than comparing against a universal target.
                </p>
                <h3 className="text-white font-bold mb-2 mt-6">Step-by-Step Technique:</h3>
                <ol className="space-y-2 list-decimal pl-5">
                  <li><strong>Start lightly:</strong> Use a comfortable grip and avoid forcing the motion.</li>
                  <li><strong>Keep tests short:</strong> Compare several brief runs instead of one long high-effort attempt.</li>
                  <li><strong>Track control:</strong> A faster result is only useful if you can still click where and when you intend.</li>
                  <li><strong>Stop on discomfort:</strong> End the session if you feel pain, numbness or unusual strain.</li>
                </ol>
              </div>
              <div className="space-y-6">
                <div className="bg-orange-900/20 border border-orange-500/20 p-6 rounded-xl">
                  <h3 className="text-orange-400 font-bold flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5" /> Safety Warning
                  </h3>
                  <p className="text-sm">
                    Repeated high-effort clicking can be uncomfortable. Keep practice brief, take breaks, and stop if you feel pain, numbness or unusual strain.
                  </p>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                  <h3 className="text-white font-bold mb-2">Pros vs Cons</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span className="text-green-400">Rapid repeated input</span> <span className="text-red-400">Can reduce precision</span></li>
                    <li className="flex justify-between"><span className="text-green-400">Easy to test in-browser</span> <span className="text-red-400">Can be tiring</span></li>
                    <li className="flex justify-between"><span className="text-green-400">Comparable over fixed durations</span> <span className="text-red-400">Results vary by setup</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
              <Crosshair className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-bold text-white mb-2">Is Jitter Clicking good for Geometry Dash?</h3>
              <p className="text-sm text-slate-400">It can be one way to produce rapid repeated inputs, but it may reduce fine control. For Geometry Dash wave practice, compare raw CPS with whether the input rhythm stays controllable.</p>
            </div>
            <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
              <MousePointer2 className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="font-bold text-white mb-2">Butterfly vs Jitter Clicking?</h3>
              <p className="text-sm text-slate-400">They use different input motions, so one may feel faster or more controllable for a particular player. Compare both with the same test duration and the same device instead of assuming one universal winner.</p>
            </div>
            <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
              <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-bold text-white mb-2">Why do jitter CPS scores vary?</h3>
              <p className="text-sm text-slate-400">Input hardware, browser event handling, test duration and technique all affect the number your browser records. Repeated tests on the same setup are the most comparable.</p>
            </div>
          </div>
        </section>

        <Link
          href="/blog/how-to-improve-cps-geometry-dash"
          className="block mb-12 group relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-900/40 to-slate-900/40 p-8 transition-all hover:border-orange-400/50"
        >
          <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/3 bg-orange-500/10 blur-[50px] transition-all group-hover:bg-orange-500/20" />
          <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <BookOpen className="h-4 w-4" /> CPS Training Guide
              </div>
              <h3 className="font-display text-2xl font-bold text-white group-hover:text-orange-200">
                Improve CPS without losing control
              </h3>
              <p className="max-w-xl text-slate-400">
                Compare fixed-duration runs, jitter and butterfly clicking, then transfer the faster rhythm into controlled Geometry Dash wave practice.
              </p>
            </div>
            <div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg shadow-orange-900/50 transition-transform group-hover:translate-x-2 group-hover:scale-110">
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <section className="defer-render space-y-8">
      <div className="rounded-2xl border border-pink-500/20 bg-pink-950/10 p-5 md:p-6">
        <p className="text-sm leading-7 text-slate-300">
          <strong className="text-white">Quick answer:</strong> the butterfly click test runs for 10 seconds and measures browser-registered CPS while you alternate two fingers. Compare repeated runs on the same mouse instead of treating one peak score as a fixed benchmark.
        </p>
      </div>
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-display font-bold text-white mb-6">What is Butterfly Clicking?</h2>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>
            <strong>Butterfly clicking</strong> involves using two fingers (usually the index and middle finger) to hit the mouse button in an alternating rhythm. Alternating two fingers can change how quickly and consistently repeated clicks are produced, but results vary by player and mouse.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-pink-400" /> Technique Guide
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Positioning:</strong> Place both fingers on the Left Mouse Button (LMB). Lift one while the other strikes.</li>
                <li><strong>Rhythm:</strong> Think of it like a drum roll. Left-Right-Left-Right.</li>
                <li><strong>Double Clicking:</strong> Some mice may register unintended bounce or double clicks. Treat that as device behavior rather than a skill requirement.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Mouse className="w-5 h-5 text-blue-400" /> Mouse factors that matter
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Button width and shape:</strong> Both fingers need a comfortable, repeatable contact area.</li>
                <li><strong>Switch and debounce behavior:</strong> Registration can differ by exact mouse, firmware and settings.</li>
                <li><strong>Grip comfort:</strong> A technique that feels fast for one hand may be awkward or tiring for another.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-pink-500/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Why use Butterfly Clicking in Geometry Dash?</h3>
        <p className="text-slate-300 leading-relaxed">
          Butterfly clicking splits repeated inputs between two fingers, which may feel more sustainable or controllable for some players during longer rapid-input sections. That does not make it universally better for Geometry Dash: compare it with your normal method using the same device, test length and wave difficulty, then keep the technique that produces the most repeatable control.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 p-5 md:p-8">
        <h2 className="mb-4 text-2xl font-bold text-white">Check the handoff between two fingers</h2>
        <p className="mb-4 text-sm leading-7 text-slate-300">Begin slowly: press with the index finger, release fully, then press with the middle finger. First make the two gaps feel similar, then increase pace. If one finger keeps the switch held while the other lands, two physical movements may produce only one registered press. The browser does not identify which finger caused an event.</p>
        <p className="mb-4 text-sm leading-7 text-slate-300">A rhythm example explains why CPS alone is insufficient: alternating 20ms and 80ms gaps has the same 50ms mean as evenly spaced 50ms gaps. The alternating pattern still contains close pairs and longer pauses. These are illustrative timings, not a capture from this test; use the main <Link href="/cps-test" className="text-blue-300 underline">CPS Test</Link> for its interval-consistency metric.</p>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-300"><li>Record three 10-second runs with one finger, then three with alternating fingers. Keep the mouse firmware, debounce setting and contact area fixed.</li><li>If the alternating count is unexpectedly high, repeat slow, deliberate single presses. Extra registered events are a registration question; a high CPS result alone does not prove either skill or switch bounce.</li><li>If CPS rises but wave direction changes arrive in pairs, slow the finger handoff and work on full releases. Compare the same Wave preset rather than increasing difficulty at the same time.</li><li>Before using the method for a ranked challenge, check that list’s current input rules. Two fingers on one button and two separately bound inputs are different arrangements.</li></ol>
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-slate-950/50 p-6 rounded-xl border border-white/5">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Is it Cheating?</h3>
          <p className="text-xs text-slate-400">Rules can vary by leaderboard or community. Check the rules of the specific competition or list before using modified input behavior.</p>
        </div>
        <div className="flex-1 bg-slate-950/50 p-6 rounded-xl border border-white/5">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-orange-400" /> Health Check</h3>
          <p className="text-xs text-slate-400">Any repetitive clicking technique can become uncomfortable. Use a relaxed posture, take breaks and stop if you feel pain or numbness.</p>
        </div>
      </div>

      <Link
        href="/blog/how-to-improve-cps-geometry-dash"
        className="group block rounded-2xl border border-pink-500/20 bg-pink-950/10 p-6 hover:border-pink-400/40"
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-300">
          <BookOpen className="h-4 w-4" /> CPS Training Guide
        </div>
        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-pink-200">
          Build a repeatable CPS routine
        </h3>
        <p className="text-sm leading-6 text-slate-400">
          Compare butterfly, jitter and keyboard input with fixed-duration tests, then check whether the faster rhythm still transfers into controlled wave practice.
        </p>
      </Link>
    </section>
  );
}
