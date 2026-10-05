import DoubleClickTest from "../../components/DoubleClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Double Click Test | Browser Mouse Bounce Check",
  description:
    "Check for unusually rapid repeated mouse clicks and inspect time intervals between registered clicks in your browser.",
  alternates: { canonical: "/double-click" },
  openGraph: {
    title: "Double Click Test | Browser Mouse Bounce Check",
    description: "Check for unusually rapid repeated mouse clicks and inspect time intervals between registered clicks in your browser.",
    url: "https://geometrydashspam.cc/double-click",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Double Click Test | Browser Mouse Bounce Check",
    description: "Check for unusually rapid repeated mouse clicks and inspect time intervals between registered clicks in your browser.",
  },
};

export default function DoubleClickPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          CLICK INTERVAL CHECK
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">DOUBLE CLICK TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Inspect rapid repeated clicks as a browser-side diagnostic for possible mouse bounce.
        </p>
      </div>
      <DoubleClickTest />
    </>
  );
}
