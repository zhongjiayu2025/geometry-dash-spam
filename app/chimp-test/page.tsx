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
      <ChimpTest />
      <RelatedTools currentTool="chimpTest" />
    </>
  );
}
