import KeyboardGhostingTest from "../../components/KeyboardGhostingTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
  description:
    "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
  alternates: { canonical: "/keyboard-ghosting" },
};

export default function KeyboardGhostingPage() {
  return <KeyboardGhostingTest />;
}
