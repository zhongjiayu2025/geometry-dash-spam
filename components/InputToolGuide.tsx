import Link from "next/link";

type InputToolGuideKey =
  | "drag"
  | "right-click"
  | "double-click"
  | "spacebar"
  | "polling-rate"
  | "keyboard-timing"
  | "keyboard-ghosting"
  | "key-rollover";

const GUIDES: Record<
  InputToolGuideKey,
  {
    heading: string;
    measures: string;
    practice: string;
    limits: string;
  }
> = {
  drag: {
    heading: "How to use drag-click results",
    measures:
      "This test counts click events that reach the browser while you perform a drag-click motion. Compare repeated attempts on the same mouse, surface and browser instead of treating one burst as a universal hardware score.",
    practice:
      "For Geometry Dash input practice, drag clicking is best treated as a separate high-density technique. Compare its registered input rate with your normal CPS, then use the wave trainer to check whether that extra input density is actually controllable.",
    limits:
      "Browser results can be affected by mouse debounce behavior, operating-system input handling and browser event delivery. The page cannot certify switch health, hardware polling rate or whether a technique is allowed by a community challenge list.",
  },
  "right-click": {
    heading: "What a right-click CPS result means",
    measures:
      "This page counts right-mouse-button events over a fixed test window. It is useful for comparing the feel and repeatability of different mouse buttons on the same setup.",
    practice:
      "Right click is not the default Geometry Dash action on a standard setup, so this result should not be treated as a direct game-performance score. Use it as a mouse-button comparison, then return to the main CPS or wave tools for Geometry Dash-specific practice.",
    limits:
      "A browser can report click events but cannot diagnose the physical switch, debounce firmware or USB path. A surprising result should be repeated in the same browser before drawing conclusions about the mouse.",
  },
  "double-click": {
    heading: "How to interpret rapid duplicate clicks",
    measures:
      "The test shows the time gaps between registered clicks so you can notice unusually tight pairs or repeated events. It is a browser-side observation rather than an automatic hardware diagnosis.",
    practice:
      "Unexpected duplicate inputs can make CPS runs look faster while making controlled Geometry Dash input less predictable. If you see repeated tight intervals, compare several runs and then check whether the same behavior appears in the main CPS test.",
    limits:
      "Fast human clicking can look similar to switch bounce, and browser scheduling can alter the observed interval. Use the result as a clue for further testing, not proof that a mouse is defective.",
  },
  spacebar: {
    heading: "Using a spacebar speed test for Geometry Dash",
    measures:
      "The counter measures how many Space keydown events the browser receives and converts repeated presses into a simple press-rate result. It is useful for comparing your own keyboard tapping across consistent test conditions.",
    practice:
      "Space is a standard Geometry Dash input option, so this page can help separate keyboard tapping speed from mouse clicking speed. For actual wave spam, raw press rate still needs to be paired with controlled press-and-release timing.",
    limits:
      "This tool does not measure end-to-end keyboard latency. It cannot see the physical switch actuation time before the browser receives the event, and operating-system or browser scheduling can influence timing.",
  },
  "polling-rate": {
    heading: "What the browser Hz estimate can tell you",
    measures:
      "The tool estimates how frequently pointer-move events reach the page while you move the mouse. A stable browser-observed event rate can be useful for spotting large differences between setups or browser conditions.",
    practice:
      "For Geometry Dash, polling rate is secondary to consistent input timing. Use this diagnostic only when investigating mouse behavior; use the CPS and wave tools when the goal is actual repeated-input practice.",
    limits:
      "Browser pointer-event frequency is not the same as a direct USB polling-rate measurement. Event coalescing, the display refresh rate, the operating system and the browser can all change the number you see.",
  },
  "keyboard-timing": {
    heading: "What this keyboard timing test actually measures",
    measures:
      "The result is the elapsed time between the browser receiving keydown and keyup for a press. In practice, that includes how long you physically hold the key plus browser scheduling.",
    practice:
      "For Geometry Dash wave practice, shorter or more repeatable holds can matter when you are learning press-and-release rhythm. Compare your own repeated presses rather than treating the number as a keyboard ranking.",
    limits:
      "This is not a true hardware-latency benchmark because there is no external clock marking the physical instant the switch actuates. It should be described as browser-observed key timing, not input-lag certification.",
  },
  "keyboard-ghosting": {
    heading: "How to check a key combination for ghosting",
    measures:
      "Hold the exact key combination you care about and watch which keys the browser continues to report. The useful result is whether a specific combination is fully visible, not a single overall score.",
    practice:
      "Geometry Dash normally needs only a small number of simultaneous inputs, but this visualizer can help when a custom setup or modifier combination appears to drop a key. Re-test the same combination several times before changing hardware.",
    limits:
      "A browser can show missing registered keys but cannot prove where the limitation occurs. Keyboard matrix design, firmware, the operating system and browser handling can all affect the observed combination.",
  },
  "key-rollover": {
    heading: "How to interpret key rollover in a browser",
    measures:
      "This page focuses on how many simultaneous key presses remain visible to the browser and which keys are present at the same time. It complements the combination-focused ghosting visualizer.",
    practice:
      "For Geometry Dash, rollover is usually less important than repeatable timing, but it can matter on unusual multi-key control setups. Test the exact keys you use rather than assuming a keyboard-wide NKRO claim applies to every browser condition.",
    limits:
      "The page cannot certify the keyboard's advertised hardware rollover specification. It only reports events that survive the keyboard, operating system and browser input path.",
  },
};

export default function InputToolGuide({ tool }: { tool: InputToolGuideKey }) {
  const guide = GUIDES[tool];

  return (
    <section
      data-support-guide={tool}
      className="mx-auto mt-10 w-full max-w-5xl space-y-6"
      aria-labelledby={`${tool}-guide-heading`}
    >
      <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
          Result guide
        </p>
        <h2 id={`${tool}-guide-heading`} className="mb-4 text-2xl font-display font-bold text-white">
          {guide.heading}
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-bold text-slate-200">What it measures</h3>
            <p className="text-sm leading-6 text-slate-400">{guide.measures}</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-slate-200">Geometry Dash relevance</h3>
            <p className="text-sm leading-6 text-slate-400">{guide.practice}</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-slate-200">Measurement limits</h3>
            <p className="text-sm leading-6 text-slate-400">{guide.limits}</p>
          </div>
        </div>
      </div>

      <nav aria-label="Continue with core Geometry Dash training" className="grid gap-3 sm:grid-cols-3">
        <Link href="/" className="rounded-xl border border-white/10 bg-black/20 p-4 hover:border-blue-500/40">
          <strong className="block text-white">Spam Test</strong>
          <span className="mt-1 block text-xs leading-5 text-slate-500">Turn repeated inputs into controlled wave movement.</span>
        </Link>
        <Link href="/geometry-dash-wave" className="rounded-xl border border-white/10 bg-black/20 p-4 hover:border-blue-500/40">
          <strong className="block text-white">Wave Trainer</strong>
          <span className="mt-1 block text-xs leading-5 text-slate-500">Practice normal, mini, spam and precision wave control.</span>
        </Link>
        <Link href="/cps-test" className="rounded-xl border border-white/10 bg-black/20 p-4 hover:border-blue-500/40">
          <strong className="block text-white">CPS Test</strong>
          <span className="mt-1 block text-xs leading-5 text-slate-500">Compare raw speed, peak CPS and click consistency.</span>
        </Link>
      </nav>
    </section>
  );
}
