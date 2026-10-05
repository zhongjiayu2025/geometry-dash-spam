import DragClickTest from "../../components/DragClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drag Click Test | Friction Clicking Practice",
  description:
    "Practice drag clicking and measure registered click speed in a browser-based test.",
  alternates: { canonical: "/drag-click" },
  openGraph: {
    title: "Drag Click Test | Friction Clicking Practice",
    description: "Practice drag clicking and measure registered click speed in a browser-based test.",
    url: "https://geometrydashspam.cc/drag-click",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Drag Click Test | Friction Clicking Practice",
    description: "Practice drag clicking and measure registered click speed in a browser-based test.",
  },
};

export default function DragClickPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          FRICTION CLICK PRACTICE
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">DRAG CLICK TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Measure the clicks your browser registers while practicing a drag-click motion.
        </p>
      </div>
      <DragClickTest />
    </>
  );
}
