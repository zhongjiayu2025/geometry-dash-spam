import ButterflyClickTest from "../../components/ButterflyClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Butterfly Click Test | Two-Finger CPS Practice",
  description:
    "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
  alternates: { canonical: "/butterfly-click" },
  openGraph: {
    title: "Butterfly Click Test | Two-Finger CPS Practice",
    description: "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
    url: "https://geometrydashspam.cc/butterfly-click",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Butterfly Click Test | Two-Finger CPS Practice",
    description: "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
  },
};

export default function ButterflyClickPage() {
  return <ButterflyClickTest />;
}
