import KeyRolloverTest from "../../components/KeyRolloverTest";
import ToolWebApplicationSchema from "../../components/ToolWebApplicationSchema";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Key Rollover Test | Keyboard Multi-Key Input Check",
  description:
    "Check how many simultaneous key presses your browser receives and inspect keyboard rollover behavior.",
  alternates: { canonical: "/key-rollover" },
  openGraph: {
    title: "Key Rollover Test | Keyboard Multi-Key Input Check",
    description: "Check how many simultaneous key presses your browser receives and inspect keyboard rollover behavior.",
    url: "https://geometrydashspam.cc/key-rollover",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Key Rollover Test | Keyboard Multi-Key Input Check",
    description: "Check how many simultaneous key presses your browser receives and inspect keyboard rollover behavior.",
  },
};

export default function KeyRolloverPage() {
  return (
    <>
      <ToolWebApplicationSchema
        name="Key Rollover Test"
        path="/key-rollover"
        description="Check how many simultaneous key presses your browser receives and inspect keyboard rollover behavior."
      />
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          KEYBOARD INPUT CHECK
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">KEY ROLLOVER TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Press multiple keys together to inspect rollover behavior in your browser.
        </p>
      </div>
      <KeyRolloverTest />
      <InputToolGuide tool="key-rollover" />
          <RelatedTools currentTool="rollover" />
</>
  );
}
