import SoundReactionTest from "../../components/SoundReactionTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sound Reaction Time Test | Audio Response Test",
  description:
    "Measure browser-based response time to an audio cue. Device, audio output and browser timing can affect results.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/sound-reaction" },
  openGraph: {
    title: "Sound Reaction Time Test | Audio Response Test",
    description: "Measure browser-based response time to an audio cue. Device, audio output and browser timing can affect results.",
    url: "https://geometrydashspam.cc/sound-reaction",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sound Reaction Time Test | Audio Response Test",
    description: "Measure browser-based response time to an audio cue. Device, audio output and browser timing can affect results.",
  },
};

export default function SoundReactionPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          AUDIO RESPONSE PRACTICE
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">SOUND REACTION TEST</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Click as soon as you hear the cue and compare repeated attempts on the same setup.
        </p>
      </div>
      <SoundReactionTest />
    </>
  );
}
