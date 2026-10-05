import AimTrainer from "../../components/AimTrainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aim Trainer | Mouse Accuracy & Precision Practice",
  description:
    "Practice browser-based mouse precision and target clicking with a lightweight aim trainer.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/aim-trainer" },
  openGraph: {
    title: "Aim Trainer | Mouse Accuracy & Precision Practice",
    description: "Practice browser-based mouse precision and target clicking with a lightweight aim trainer.",
    url: "https://geometrydashspam.cc/aim-trainer",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aim Trainer | Mouse Accuracy & Precision Practice",
    description: "Practice browser-based mouse precision and target clicking with a lightweight aim trainer.",
  },
};

export default function AimTrainerPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
          MOUSE PRECISION PRACTICE
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase">
          AIM TRAINER
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Practice clicking targets accurately and quickly in your browser.
        </p>
      </div>
      <AimTrainer />
    </>
  );
}
