import React from "react";
import Link from "next/link";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  readTime: string;
  coverImage: string;
  content: React.ReactNode;
  tags: string[];
  toc?: { id: string; title: string }[];
}

const ToolLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-blue-400 hover:underline font-semibold">
    {children}
  </Link>
);

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "what-is-spam-geometry-dash-guide",
    title: "What Is Spam in Geometry Dash? Wave, CPS and Control Explained",
    excerpt:
      "A practical explanation of Geometry Dash spam, why wave spam is difficult, and how CPS and timing consistency fit together.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "7 min read",
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    tags: ["Guide", "Spam", "Wave"],
    toc: [
      { id: "definition", title: "What Geometry Dash spam means" },
      { id: "wave", title: "Why wave spam feels different" },
      { id: "cps", title: "CPS vs consistency" },
      { id: "practice", title: "A safer practice loop" },
      { id: "mistakes", title: "Common mistakes" },
    ],
    content: (
      <>
        <h2 id="definition" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          What Geometry Dash spam means
        </h2>
        <p className="mb-4 text-slate-300">
          In Geometry Dash, <strong>spam</strong> is rapid repeated input used to get through a section that needs frequent direction changes or jumps. The important part is not simply clicking as fast as possible. A useful spam input pattern is fast enough for the section and repeatable enough to keep control.
        </p>
        <p className="mb-4 text-slate-300">
          That is why this site separates two measurements: raw speed in the <ToolLink href="/cps-test">Geometry Dash CPS Test</ToolLink> and movement control in the <ToolLink href="/">Geometry Dash Spam Test</ToolLink>.
        </p>

        <h2 id="wave" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          Why wave spam feels different
        </h2>
        <p className="mb-4 text-slate-300">
          Wave sections translate press-and-release timing into alternating diagonal movement. If the intervals between inputs vary too much, the path becomes harder to keep centered even when the average CPS is high.
        </p>
        <p className="mb-4 text-slate-300">
          Use the <ToolLink href="/geometry-dash-wave">Wave Trainer</ToolLink> when you want to isolate that movement skill. Its presets are practice modes, not a claim that the browser simulator reproduces the official game engine exactly.
        </p>

        <h2 id="cps" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          CPS vs consistency
        </h2>
        <p className="mb-4 text-slate-300">
          CPS tells you how many inputs you produce per second. Consistency describes how evenly those inputs arrive. Two players can record the same average CPS while producing very different timing patterns.
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
          <li><strong>Average CPS:</strong> total clicks divided by elapsed time.</li>
          <li><strong>Peak CPS:</strong> a short burst estimate based on the fastest interval.</li>
          <li><strong>Average interval:</strong> average milliseconds between inputs.</li>
          <li><strong>Consistency:</strong> a site-specific score based on variation between input intervals.</li>
        </ul>

        <h2 id="practice" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          A practical training loop
        </h2>
        <ol className="list-decimal pl-6 mb-6 space-y-3 text-slate-300">
          <li>Record a comfortable CPS baseline instead of immediately chasing a one-second maximum.</li>
          <li>Practice an easy wave corridor and focus on smooth, repeatable movement.</li>
          <li>Increase difficulty only after several similar runs, not after one lucky attempt.</li>
          <li>Stop the session if your hand, wrist or forearm becomes painful or numb.</li>
        </ol>

        <h2 id="mistakes" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          Common mistakes
        </h2>
        <p className="text-slate-300">
          The most common problems are tensing the whole arm, using a clicking technique that you cannot sustain, changing settings every attempt, and treating a peak CPS number as the only measure of progress. Use one setup long enough to compare like-for-like runs.
        </p>
      </>
    ),
  },
  {
    id: "2",
    slug: "how-to-improve-cps-geometry-dash",
    title: "How to Improve CPS for Geometry Dash Without Losing Control",
    excerpt:
      "A practical CPS training routine built around repeatable tests, click timing and short practice blocks rather than unsupported target numbers.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "7 min read",
    coverImage:
      "https://images.unsplash.com/photo-1614726365345-0377fa1f513a?q=80&w=2070&auto=format&fit=crop",
    tags: ["Training", "CPS", "Technique"],
    toc: [
      { id: "baseline", title: "Measure a baseline" },
      { id: "methods", title: "Compare clicking methods" },
      { id: "duration", title: "Train short and long tests" },
      { id: "transfer", title: "Transfer speed into wave control" },
    ],
    content: (
      <>
        <h2 id="baseline" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          Measure a baseline first
        </h2>
        <p className="mb-4 text-slate-300">
          Start with the same device, button and test duration for several runs. A ten-second test is useful because it is long enough to expose inconsistent pacing while still being quick to repeat. Save your best score, but also compare the timing metrics.
        </p>
        <p className="mb-4 text-slate-300">
          Open the <ToolLink href="/cps-test">Geometry Dash CPS Test</ToolLink> and run three attempts with the same duration before changing technique.
        </p>

        <h2 id="methods" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          Compare clicking methods
        </h2>
        <p className="mb-4 text-slate-300">
          Normal clicking, jitter clicking, butterfly clicking and keyboard input feel different and can produce different speed-control tradeoffs. The useful method is the one you can repeat reliably for the section you are practicing.
        </p>
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="font-bold text-white mb-2">Jitter clicking</h3>
            <p className="text-sm text-slate-400">Compare your results in the <ToolLink href="/jitter-click">Jitter Click Test</ToolLink> and note whether speed comes at the cost of control.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h3 className="font-bold text-white mb-2">Butterfly clicking</h3>
            <p className="text-sm text-slate-400">Use the <ToolLink href="/butterfly-click">Butterfly Click Test</ToolLink> to compare a two-finger rhythm with your normal method.</p>
          </div>
        </div>

        <h2 id="duration" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          Use different test lengths for different questions
        </h2>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
          <li><strong>1–3 seconds:</strong> useful for a short burst, but very sensitive to the first click.</li>
          <li><strong>5–10 seconds:</strong> useful for comparing general speed and control.</li>
          <li><strong>30–60 seconds:</strong> useful for seeing whether your pace remains stable over time.</li>
        </ul>

        <h2 id="transfer" className="text-3xl font-display font-bold text-white mt-12 mb-6 scroll-mt-24">
          Transfer speed into wave control
        </h2>
        <p className="mb-4 text-slate-300">
          A higher CPS score only matters if it helps the gameplay you are trying to perform. Finish each speed session with several controlled runs in the <ToolLink href="/geometry-dash-wave">Wave Trainer</ToolLink>. If the wave becomes less stable as CPS rises, the next training goal is consistency rather than more speed.
        </p>
        <p className="text-slate-400 text-sm">
          Avoid training through pain or numbness. This site is a game-practice tool, not medical guidance.
        </p>
      </>
    ),
  },
  {
    id: "3",
    slug: "best-mouse-for-spam-geometry-dash",
    title: "How to Choose a Mouse for Geometry Dash Spam",
    excerpt:
      "What actually matters when comparing mice for Geometry Dash: click feel, debounce behavior, polling, shape and repeatable comfort.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "6 min read",
    coverImage:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=2028&auto=format&fit=crop",
    tags: ["Hardware", "Guide"],
    content: (
      <>
        <h2 className="text-3xl font-display font-bold text-white mt-12 mb-6">Do not shop by one latency number</h2>
        <p className="mb-4 text-slate-300">
          Mouse click latency, debounce behavior and polling are measurable, but a product category such as “gaming mouse” does not guarantee one fixed latency. Compare independent measurements for the exact model and firmware you plan to use.
        </p>

        <h2 className="text-3xl font-display font-bold text-white mt-12 mb-6">What matters for repeated inputs</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
          <li><strong>Click force and feel:</strong> a switch that feels comfortable may be easier to repeat consistently.</li>
          <li><strong>Button shape:</strong> wide, stable buttons can make your preferred grip easier to reproduce.</li>
          <li><strong>Debounce behavior:</strong> affects how repeated clicks are registered and filtered.</li>
          <li><strong>Polling rate:</strong> changes how frequently the device can report updates, but it is only one part of end-to-end latency.</li>
          <li><strong>Fit:</strong> hand size and grip style matter more than a generic “best mouse” label.</li>
        </ul>

        <h2 className="text-3xl font-display font-bold text-white mt-12 mb-6">How to compare two mice yourself</h2>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-300">
          <li>Use the same <ToolLink href="/cps-test">CPS Test</ToolLink> duration on both mice.</li>
          <li>Record several runs instead of choosing the highest single score.</li>
          <li>Compare comfort and consistency as well as CPS.</li>
          <li>Use the <ToolLink href="/polling-rate">Polling Rate Test</ToolLink> as a browser-side diagnostic, not as a complete latency benchmark.</li>
        </ol>
      </>
    ),
  },
  {
    id: "4",
    slug: "wave-vs-ufo-spam",
    title: "Wave vs UFO vs Ship Spam: How the Input Skills Differ",
    excerpt:
      "Wave, UFO and ship sections can all involve rapid inputs, but the control problem is different in each mode.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "5 min read",
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    tags: ["Mechanics", "Wave"],
    content: (
      <>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Wave: interval control</h2>
        <p className="text-slate-300 mb-4">
          Wave input directly changes diagonal direction, so the spacing between press and release events strongly affects the path. The <ToolLink href="/geometry-dash-wave">Wave Trainer</ToolLink> is designed around this type of repeated correction.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">UFO: repeated impulses</h2>
        <p className="text-slate-300 mb-4">
          UFO movement reacts to individual taps rather than sustained diagonal movement. Rapid input can still appear, but rhythm and spacing determine whether the UFO climbs too aggressively or stays in the intended lane.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Ship: hold-and-release balance</h2>
        <p className="text-slate-300 mb-4">
          Ship control is more about balancing hold duration and release timing. Fast corrections may look like spam, but the useful skill is controlled micro-adjustment rather than maximum CPS.
        </p>

        <p className="text-slate-300">
          If your goal is specifically rapid-input wave control, start with the <ToolLink href="/">Spam Test</ToolLink> and then move to the dedicated wave presets.
        </p>
      </>
    ),
  },
  {
    id: "5",
    slug: "top-spam-levels-2026",
    title: "Notable Wave and Spam Levels in Geometry Dash",
    excerpt:
      "A non-ranking list of well-known levels associated with difficult wave control and rapid-input sections, with links back to the current Demon List.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "6 min read",
    coverImage:
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2574&auto=format&fit=crop",
    tags: ["Levels", "Wave"],
    content: (
      <>
        <p className="text-slate-300 mb-6">
          This article is <strong>not</strong> an official “spam ranking.” The current Pointercrate order is maintained separately on our <ToolLink href="/demon-list">Geometry Dash Demon List</ToolLink>. The examples below are useful because players commonly associate them with demanding wave or rapid-input gameplay.
        </p>

        {[
          ["Tidal Wave", "A high-difficulty level with wave-heavy sections and a long history of discussion around control consistency."],
          ["Sakupen Circles", "A well-known circles-style Extreme Demon associated with very tight wave gameplay."],
          ["Slaughterhouse", "Contains demanding transitions and wave sections where precise repeated inputs are important."],
          ["Silent Clubstep", "A historically significant extreme challenge whose difficulty goes far beyond a simple CPS number."],
          ["Ashley Wave Trials", "A wave-focused level that makes the mechanic itself central to the challenge."],
        ].map(([level, description]) => (
          <section key={level} className="mb-6 rounded-xl border border-white/10 bg-slate-900/25 p-5">
            <h2 className="text-xl font-bold text-white mb-2">{level}</h2>
            <p className="text-slate-400">{description}</p>
          </section>
        ))}

        <p className="text-slate-300">
          Before using a level&apos;s Demon List position as a fact, check the dated <ToolLink href="/demon-list">Top 50 snapshot</ToolLink> or the live source linked from that page.
        </p>
      </>
    ),
  },
  {
    id: "6",
    slug: "30-day-spam-challenge",
    title: "30-Day Geometry Dash Spam Practice Plan",
    excerpt:
      "A conservative month-long practice structure for improving consistency, wave control and test repeatability without promising a fixed CPS gain.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "6 min read",
    coverImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    tags: ["Training", "Practice Plan"],
    content: (
      <>
        <p className="text-slate-300 mb-6">
          This plan does not promise that you will reach a particular CPS number. The goal is to create a repeatable practice routine and compare your own results over time.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Days 1–7: baseline and control</h2>
        <p className="text-slate-300 mb-4">
          Record three 10-second CPS runs and several Easy/Hard spam runs. Keep the same input device and note which pace feels controllable.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Days 8–14: short speed blocks</h2>
        <p className="text-slate-300 mb-4">
          Add a small number of 1–5 second CPS attempts, then return to the <ToolLink href="/geometry-dash-wave">Wave Trainer</ToolLink> and see whether the extra speed transfers into smoother movement.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Days 15–21: consistency</h2>
        <p className="text-slate-300 mb-4">
          Use longer 30-second tests sparingly and compare average interval and consistency. On the wave trainer, choose a difficulty you can survive repeatedly rather than the hardest available mode.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Days 22–30: progression check</h2>
        <p className="text-slate-300 mb-4">
          Repeat the original baseline setup. Compare several attempts, not only the best result. If control improved without a large CPS increase, that is still useful progress for spam gameplay.
        </p>

        <p className="text-sm text-slate-400">
          Rest between repeated high-effort attempts and stop if a session causes pain or numbness.
        </p>
      </>
    ),
  },
  {
    id: "7",
    slug: "science-of-clicking",
    title: "Why Click Timing Consistency Matters in Geometry Dash",
    excerpt:
      "A measurement-focused explanation of click intervals, variance and why stable timing can matter more than a one-run CPS peak.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "5 min read",
    coverImage:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    tags: ["Measurement", "CPS"],
    content: (
      <>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">CPS is an average</h2>
        <p className="text-slate-300 mb-4">
          A 10 CPS result means ten registered inputs per second on average. It does not tell you whether those clicks arrived evenly. A run with alternating very short and very long intervals can produce the same CPS as a run with stable spacing.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Look at intervals</h2>
        <p className="text-slate-300 mb-4">
          The updated <ToolLink href="/cps-test">CPS Test</ToolLink> records average interval, a short-burst peak estimate and a consistency score. Those numbers are browser-side training diagnostics rather than laboratory measurements.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Why this matters for wave control</h2>
        <p className="text-slate-300 mb-4">
          Repeated wave corrections depend on when inputs arrive. If your interval pattern changes dramatically from click to click, the same average CPS can still produce a less predictable trajectory.
        </p>

        <p className="text-slate-300">
          Use the <ToolLink href="/">Spam Test</ToolLink> after a CPS run to see whether the timing pattern transfers into a controllable path.
        </p>
      </>
    ),
  },
  {
    id: "8",
    slug: "mobile-vs-pc-spam",
    title: "Mobile vs PC for Geometry Dash Spam: What Actually Changes",
    excerpt:
      "A practical comparison of touch, mouse and keyboard input without assuming one platform is always faster.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "5 min read",
    coverImage:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
    tags: ["Mobile", "Input"],
    content: (
      <>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The input path is different</h2>
        <p className="text-slate-300 mb-4">
          Touchscreens, mice and keyboards use different hardware and software paths. Total latency depends on the complete device, operating system, browser or game client, display and input hardware; it cannot be reduced to one universal “mobile” or “PC” number.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Refresh rate is not the same as input latency</h2>
        <p className="text-slate-300 mb-4">
          A higher refresh rate reduces the time between display refreshes, but that frame interval is only one part of end-to-end input response. Use the <ToolLink href="/refresh-rate">Refresh Rate Test</ToolLink> to identify the browser-observed display rate, not to claim full-system latency.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Compare your own setups</h2>
        <p className="text-slate-300 mb-4">
          Run the same CPS duration on each device, then compare repeatability and comfort. For the spam simulator, use the same difficulty and wave mode so the comparison is meaningful.
        </p>
      </>
    ),
  },
  {
    id: "9",
    slug: "common-spam-mistakes",
    title: "10 Common Geometry Dash Spam Mistakes and How to Fix Them",
    excerpt:
      "Ten practical reasons spam practice becomes inconsistent, from chasing peak CPS to changing settings too often.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "6 min read",
    coverImage:
      "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2069&auto=format&fit=crop",
    tags: ["Tips", "Training"],
    content: (
      <>
        <ol className="space-y-6 text-slate-300">
          {[
            ["Chasing only peak CPS", "Track repeatable speed and timing consistency, not just the single highest burst."],
            ["Changing settings every attempt", "Keep the same difficulty and input method long enough to compare results."],
            ["Starting too difficult", "A wider corridor makes timing errors easier to see and correct."],
            ["Tensing the whole arm", "Use a comfortable posture and avoid forcing a technique that feels painful."],
            ["Ignoring click intervals", "Two runs with the same CPS can have very different timing stability."],
            ["Training only 1-second tests", "Short bursts are useful, but longer tests reveal whether a pace is sustainable."],
            ["Treating browser scores as game-engine measurements", "Browser tools are diagnostics; actual game behavior also depends on the game client and hardware."],
            ["Skipping movement practice", "Raw CPS should be followed by wave-control practice so speed transfers into a useful skill."],
            ["Comparing different devices without controlling variables", "Use the same duration, difficulty and technique when testing setups."],
            ["Continuing through pain", "End the session if repeated clicking causes pain, numbness or persistent discomfort."],
          ].map(([title, body], index) => (
            <li key={title}>
              <h2 className="text-xl font-bold text-white mb-2">{index + 1}. {title}</h2>
              <p className="text-slate-400">{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-950/20 p-5">
          <p className="text-slate-300">
            A simple workflow is <ToolLink href="/cps-test">CPS Test</ToolLink> → <ToolLink href="/">Spam Test</ToolLink> → <ToolLink href="/geometry-dash-wave">Wave Trainer</ToolLink>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "10",
    slug: "interview-top-players",
    title: "How to Evaluate Geometry Dash Spam Advice Online",
    excerpt:
      "A checklist for separating useful training advice from unsupported player claims, fake interviews and made-up performance numbers.",
    date: "January 10, 2026",
    updated: "October 5, 2026",
    readTime: "5 min read",
    coverImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    tags: ["Community", "Evidence"],
    content: (
      <>
        <p className="text-slate-300 mb-6">
          Advice is more useful when you can understand the setup, reproduce the test and verify any factual claims. A famous player name or a confident number is not evidence by itself.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Check whether the quote is real</h2>
        <p className="text-slate-300 mb-4">
          A genuine interview should identify where and when the statement was made. If a quote cannot be traced to a public source or an actual conversation, do not present it as a player interview.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Check the settings behind a score</h2>
        <p className="text-slate-300 mb-4">
          CPS depends on duration, device, technique and how the test counts clicks. Compare numbers only when the conditions are similar.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Separate practice models from official physics</h2>
        <p className="text-slate-300 mb-4">
          Browser simulators can isolate useful skills, but they should not claim exact Geometry Dash physics unless that claim has been independently demonstrated.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Prefer reproducible advice</h2>
        <p className="text-slate-300 mb-4">
          “Use the same 10-second test three times and compare interval consistency” is reproducible. “All top players need a specific CPS” is not useful without evidence and context.
        </p>

        <p className="text-slate-300">
          You can reproduce basic speed and timing experiments with the <ToolLink href="/cps-test">CPS Test</ToolLink> and then test movement control in the <ToolLink href="/">Spam Simulator</ToolLink>.
        </p>
      </>
    ),
  },
];
