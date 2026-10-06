import KeyboardGhostingTest from "../../components/KeyboardGhostingTest";
import Breadcrumbs from "../../components/Breadcrumbs";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";
import { Info, Keyboard as KeyboardIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
  description:
    "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
  alternates: { canonical: "/keyboard-ghosting" },
  openGraph: {
    title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
    description: "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
    url: "https://geometrydashspam.cc/keyboard-ghosting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
    description: "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
  },
};

export default function KeyboardGhostingPage() {
  return (
    <>
      <ToolWebApplicationSchema
        name="Keyboard Ghosting Test"
        path="/keyboard-ghosting"
        description="Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations."
      />
      <Breadcrumbs items={[{ label: "Keyboard Ghosting", href: "/keyboard-ghosting", active: true }]} />
      <header className="mb-8 text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
          <KeyboardIcon className="h-10 w-10 text-amber-400" aria-hidden="true" />
        </div>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Keyboard Ghosting & Key Rollover Test
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
          Hold several keys at once and see which key events reach this browser. The page visualizes registered inputs; it cannot observe a key event that the keyboard, operating system or browser never delivers.
        </p>
      </header>

      <KeyboardGhostingTest />

      <section className="mx-auto mt-8 flex max-w-5xl items-start gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
        <Info className="h-6 w-6 shrink-0 text-blue-400" aria-hidden="true" />
        <p className="text-sm leading-6 text-blue-100">
          <strong>How to test:</strong> hold a combination you actually use, such as W + A + Space, then add another key.
          Watch which keys remain highlighted. Repeat the same combination several times. This can reveal a rollover limitation,
          but it does not prove the exact electrical cause inside the keyboard.
        </p>
      </section>
      <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 md:p-6">
        <h2 className="mb-2 text-xl font-bold text-white">Ghosting vs key rollover</h2>
        <p className="text-sm leading-6 text-slate-400">
          Ghosting asks whether a specific key combination is lost or misreported. Rollover asks how many simultaneous keys remain visible at once.
          Use the <a href="/key-rollover" className="font-semibold text-amber-300 hover:underline">Key Rollover Test</a> when the number of simultaneous registered keys is the main question.
        </p>
      </section>
      <InputToolGuide tool="keyboard-ghosting" />
      <RelatedTools currentTool="keyboardGhosting" />
    </>
  );
}
