import SystemInfo from "../../components/SystemInfo";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Browser & System Info | Device Information Viewer",
  description:
    "View screen, browser and device information exposed to this page through standard web APIs.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/system-info" },
  openGraph: {
    title: "Browser & System Info | Device Information Viewer",
    description: "View screen, browser and device information exposed to this page through standard web APIs.",
    url: "https://geometrydashspam.cc/system-info",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browser & System Info | Device Information Viewer",
    description: "View screen, browser and device information exposed to this page through standard web APIs.",
  },
};

export default function SystemInfoPage() {
  return (
    <>
      <section className="mx-auto mb-12 max-w-5xl px-4 text-center md:px-0">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-blue-500/10 p-3">
          <Search className="h-10 w-10 text-blue-400" aria-hidden="true" />
        </div>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">
          Browser & System Info
        </h1>
        <p className="mx-auto max-w-2xl text-slate-400">
          A quick diagnostic tool that reveals what your browser is telling the websites you visit.
        </p>
      </section>
      <SystemInfo />
      <RelatedTools currentTool="systemInfo" />
    </>
  );
}
