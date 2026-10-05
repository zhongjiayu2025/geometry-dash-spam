import MouseAccelerationTest from "../../components/MouseAccelerationTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mouse Acceleration Test | Pointer Movement Consistency Check",
  description:
    "Compare browser-reported pointer movement to look for signs of acceleration or inconsistent scaling. This cannot directly read operating-system settings.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/mouse-acceleration" },
  openGraph: {
    title: "Mouse Acceleration Test | Pointer Movement Consistency Check",
    description: "Compare browser-reported pointer movement to look for signs of acceleration or inconsistent scaling. This cannot directly read operating-system settings.",
    url: "https://geometrydashspam.cc/mouse-acceleration",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mouse Acceleration Test | Pointer Movement Consistency Check",
    description: "Compare browser-reported pointer movement to look for signs of acceleration or inconsistent scaling. This cannot directly read operating-system settings.",
  },
};

export default function MouseAccelerationPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          POINTER MOVEMENT DIAGNOSTIC
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">MOUSE ACCELERATION TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Compare pointer movement consistency in the browser. The page cannot directly inspect system acceleration settings.
        </p>
      </div>
      <MouseAccelerationTest />
    </>
  );
}
