import VisualMemoryTest from "../../components/VisualMemoryTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Memory Test | Grid Recall Game",
  description:
    "Practice visual pattern recall with a browser-based grid memory game.",
  alternates: { canonical: "/visual-memory" },
};

export default function VisualMemoryPage() {
  return <VisualMemoryTest />;
}
