import ChimpTest from "../../components/ChimpTest";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chimp Test | Number Sequence Memory Test",
  description:
    "Test visual sequence memory by remembering numbered positions before they are hidden.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/chimp-test" },
  openGraph: {
    title: "Chimp Test | Number Sequence Memory Test",
    description: "Test visual sequence memory by remembering numbered positions before they are hidden.",
    url: "https://geometrydashspam.cc/chimp-test",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chimp Test | Number Sequence Memory Test",
    description: "Test visual sequence memory by remembering numbered positions before they are hidden.",
  },
};

export default function ChimpTestPage() {
  return (
    <>
      <header className="mx-auto mb-6 max-w-3xl text-center"><h1 className="mb-3 text-3xl font-bold text-white">Number sequence memory test</h1><p className="text-sm leading-6 text-slate-400">Remember the numbered positions, then select them in ascending order after the numbers disappear. This is an optional memory game; its score is not a Geometry Dash skill rating.</p></header>
      <ChimpTest />
      <RelatedTools currentTool="chimpTest" />
    </>
  );
}
