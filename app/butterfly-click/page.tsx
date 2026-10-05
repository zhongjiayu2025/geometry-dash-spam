import ButterflyClickTest from "../../components/ButterflyClickTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Butterfly Click Test | Two-Finger CPS Practice",
  description:
    "Practice butterfly clicking and compare two-finger click speed and consistency in your browser.",
  alternates: { canonical: "/butterfly-click" },
};

export default function ButterflyClickPage() {
  return <ButterflyClickTest />;
}
