import type { Metadata } from "next";
import Link from "next/link";

const CHECKED_AT = "2026-10-05";
const STEAM_THREAD =
  "https://steamcommunity.com/app/322170/discussions/0/4035852333639920097/";
const STEAM_THREAD_2 =
  "https://steamcommunity.com/app/322170/discussions/0/3881599433109776885/";

export const metadata: Metadata = {
  title: "Geometry Dash Stuttering on High-End PC | Fix Checklist",
  description:
    "Troubleshoot Geometry Dash stuttering on a high-end PC with a controlled checklist for overlays, background apps, VSync, Smooth Fix, display mode and refresh rate.",
  alternates: { canonical: "/geometry-dash-stuttering-high-end-pc" },
  openGraph: {
    title: "Geometry Dash Stuttering on High-End PC | Fix Checklist",
    description: "Troubleshoot Geometry Dash stuttering on a high-end PC with a controlled checklist for overlays, background apps, VSync, Smooth Fix, display mode and refresh rate.",
    url: "https://geometrydashspam.cc/geometry-dash-stuttering-high-end-pc",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Geometry Dash Stuttering on High-End PC | Fix Checklist",
    description: "Troubleshoot Geometry Dash stuttering on a high-end PC with a controlled checklist for overlays, background apps, VSync, Smooth Fix, display mode and refresh rate.",
  },
};

const stutterFaqs = [
  {
    q: "Why can Geometry Dash stutter on a high-end PC?",
    a: "A fast GPU does not eliminate every source of frame-time spikes. Overlays, peripheral utilities, display mode, sync settings, drivers and background software are useful variables to test one at a time.",
  },
  {
    q: "Should I disable VSync or Smooth Fix?",
    a: "There is no single setting that fixes every PC. Test VSync and Smooth Fix separately while replaying the same level, so you can tell which change actually affects the stutter.",
  },
  {
    q: "How should I test a Geometry Dash stutter fix?",
    a: "Keep the level and graphics settings the same, change one variable, then compare the result. Changing several settings at once makes the cause harder to identify.",
  },
];

const steps = [
  {
    title: "Close overlays and peripheral utilities one at a time",
    body:
      "Community reports repeatedly point to background overlays or device suites as possible stutter triggers. Test Xbox Game Bar, GPU overlays, mouse/keyboard suites and recording overlays individually so you know what actually changes the result.",
  },
  {
    title: "Test VSync and Smooth Fix as separate variables",
    body:
      "There is no one setting combination that fixes every system. Try one configuration, replay the same level, then change only one option. Avoid changing fullscreen, VSync, Smooth Fix and FPS settings all at once.",
  },
  {
    title: "Compare fullscreen and windowed behavior",
    body:
      "If the hitching happens only in one display mode, that is useful diagnostic information. Keep the same level and graphics settings while comparing the two modes.",
  },
  {
    title: "Confirm the display refresh rate you are actually using",
    body:
      "A high-refresh monitor does not guarantee that every game or desktop session is running at the expected refresh rate. Check Windows display settings and compare them with a browser-observed refresh-rate reading.",
  },
  {
    title: "Update, verify and retest",
    body:
      "After recording a baseline, update the GPU driver and operating system if needed, verify the game files in Steam, then test again with unnecessary overlays still closed.",
  },
  {
    title: "Look for repeatable timing",
    body:
      "If the stutter starts after a predictable amount of time or only while a certain background application is open, that pattern is more actionable than the fact that the PC is high-end.",
  },
];

export default function GeometryDashStutteringPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Troubleshoot Geometry Dash Stuttering on a High-End PC",
    dateModified: CHECKED_AT,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: stutterFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            PC troubleshooting · checked {CHECKED_AT}
          </p>
          <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
            Geometry Dash Stuttering on a High-End PC
          </h1>
          <p className="leading-7 text-slate-400">
            A fast GPU does not rule out frame-time spikes. Geometry Dash players have reported stutter
            caused or affected by overlays, peripheral software, display mode and sync settings. The useful
            approach is to change <strong className="text-white">one variable at a time</strong> and reproduce the same test.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-950/15 p-5 md:p-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Start here</div>
          <p className="leading-7 text-slate-300">
            Reproduce the stutter on the same level, then test <strong className="text-white">one variable at a time</strong>:
            overlays/background utilities → VSync/Smooth Fix → display mode → refresh rate → driver/file verification.
            Keep the combination that measurably improves the same test.
          </p>
        </section>

        <div className="mb-10 rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-5 text-sm leading-6 text-slate-400">
          This is a troubleshooting checklist, not a guaranteed universal fix. Do not terminate Windows
          system processes or security software just to test game performance.
        </div>

        <section className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-white/10 bg-slate-900/30 p-6">
              <div className="mb-3 flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-500/15 font-mono text-sm font-bold text-blue-300">
                  {index + 1}
                </span>
                <h2 className="text-xl font-bold text-white">{step.title}</h2>
              </div>
              <p className="pl-12 text-sm leading-6 text-slate-400">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Link href="/refresh-rate" className="rounded-xl border border-white/10 bg-black/20 p-5 hover:border-blue-500/40">
            <h2 className="mb-2 font-bold text-white">Refresh Rate Test</h2>
            <p className="text-xs leading-5 text-slate-500">Check the browser-observed display refresh rate before comparing setups.</p>
          </Link>
          <Link href="/system-info" className="rounded-xl border border-white/10 bg-black/20 p-5 hover:border-blue-500/40">
            <h2 className="mb-2 font-bold text-white">System Info</h2>
            <p className="text-xs leading-5 text-slate-500">Record the browser and display details exposed to the site.</p>
          </Link>
          <Link href="/polling-rate" className="rounded-xl border border-white/10 bg-black/20 p-5 hover:border-blue-500/40">
            <h2 className="mb-2 font-bold text-white">Mouse Polling Rate</h2>
            <p className="text-xs leading-5 text-slate-500">Separate mouse report-rate questions from frame stutter.</p>
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Geometry Dash Stuttering FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {stutterFaqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900/25 p-6 md:p-8">
          <h2 className="mb-3 text-xl font-bold text-white">Why background apps are worth testing</h2>
          <p className="mb-4 leading-7 text-slate-400">
            In one Steam community thread, the original poster reported that closing background software
            and Xbox Game Bar resolved the issue; later comments specifically mentioned GPU overlays and
            peripheral utilities. Another thread shows that the same suggested GPU-driver setting did not
            help every user. That is why this guide treats these as tests rather than universal fixes.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={STEAM_THREAD} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-400 hover:underline">
              Community report 1 →
            </a>
            <a href={STEAM_THREAD_2} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-400 hover:underline">
              Community report 2 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
