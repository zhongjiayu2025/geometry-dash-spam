import VisualMemoryTest from "../../components/VisualMemoryTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Memory Test | Grid Recall Game",
  description:
    "Practice visual pattern recall with a browser-based grid memory game.",
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
  return <VisualMemoryTest />;
}
