import TypingTest from "../../components/TypingTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Speed Test | 60-Second WPM Test",
  description:
    "Take a 60-second browser typing test and measure words per minute.",
  alternates: { canonical: "/typing-test" },
};

export default function TypingPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          60-SECOND WPM TEST
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">TYPING SPEED TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Type for 60 seconds and measure your words per minute.
        </p>
      </div>
      <TypingTest />
    </>
  );
}
