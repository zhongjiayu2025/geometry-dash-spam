import VisualMemoryTest from "../../components/VisualMemoryTest";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Memory Test | Grid Recall Game",
  description:
    "Practice visual pattern recall with a browser-based grid memory game.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/visual-memory" },
  openGraph: {
    title: "Visual Memory Test | Grid Recall Game",
    description: "Practice visual pattern recall with a browser-based grid memory game.",
    url: "https://geometrydashspam.cc/visual-memory",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Visual Memory Test | Grid Recall Game",
    description: "Practice visual pattern recall with a browser-based grid memory game.",
  },
};

export default function VisualMemoryPage() {
  return (
    <>
      <header className="mx-auto mb-6 max-w-3xl text-center"><h1 className="mb-3 text-3xl font-bold text-white">Visual pattern memory test</h1><p className="text-sm leading-6 text-slate-400">Watch the highlighted cells, then reproduce the pattern after it disappears. This optional memory exercise records performance in this grid task, not a general cognitive or game-performance score.</p></header>
      <VisualMemoryTest />
      <RelatedTools currentTool="visualMemory" />
    </>
  );
}
