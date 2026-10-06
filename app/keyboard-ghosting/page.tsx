import KeyboardGhostingTest from "../../components/KeyboardGhostingTest";
import RelatedTools from "../../components/RelatedTools";
import InputToolGuide from "../../components/InputToolGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
  description:
    "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
  alternates: { canonical: "/keyboard-ghosting" },
  openGraph: {
    title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
    description: "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
    url: "https://geometrydashspam.cc/keyboard-ghosting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyboard Ghosting Test | Multi-Key Input Visualizer",
    description: "Visualize which simultaneous key presses your browser receives and inspect possible rollover or ghosting limitations.",
  },
};

export default function KeyboardGhostingPage() {
  return (
    <>
      <KeyboardGhostingTest />
      <InputToolGuide tool="keyboard-ghosting" />
          <RelatedTools currentTool="keyboardGhosting" />
</>
  );
}
