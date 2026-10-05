import Link from "next/link";
import { Activity, ListOrdered, MousePointerClick, Trophy } from "lucide-react";

export default function CoreTrainingLinks({ variant }: { variant: "spam" | "wave" }) {
  const isWave = variant === "wave";

  const items = isWave
    ? [
        {
          href: "/cps-test",
          label: "CPS Test",
          desc: "Measure raw click speed and timing.",
          icon: MousePointerClick,
          tone: "blue",
        },
        {
          href: "/",
          label: "Spam Test",
          desc: "Return to the core spam-control trainer.",
          icon: Activity,
          tone: "cyan",
        },
        {
          href: "/demon-list/wave-demons",
          label: "Wave Demons",
          desc: "Use wave-focused Demon references for practice.",
          icon: ListOrdered,
          tone: "fuchsia",
        },
        {
          href: "/demon-list",
          label: "Demon List",
          desc: "See the sourced top-50 Demon List snapshot.",
          icon: Trophy,
          tone: "purple",
        },
      ]
    : [
        {
          href: "/cps-test",
          label: "CPS Test",
          desc: "Measure raw click speed and timing.",
          icon: MousePointerClick,
          tone: "blue",
        },
        {
          href: "/geometry-dash-wave",
          label: "Wave Trainer",
          desc: "Turn click speed into controlled wave movement.",
          icon: Activity,
          tone: "cyan",
        },
        {
          href: "/spam-challenge-list",
          label: "Spam Challenge List",
          desc: "Check the current SCL entry point and rules.",
          icon: ListOrdered,
          tone: "fuchsia",
        },
        {
          href: "/demon-list/spam-demons",
          label: "Spam Demons",
          desc: "Explore spam-heavy Demon practice references.",
          icon: Trophy,
          tone: "purple",
        },
      ];

  const tones: Record<string, string> = {
    blue: "text-blue-500 hover:border-blue-400/50",
    cyan: "text-cyan-500 hover:border-cyan-400/50",
    fuchsia: "text-fuchsia-500 hover:border-fuchsia-400/50",
    purple: "text-purple-500 hover:border-purple-400/50",
  };

  return (
    <nav className="mx-auto mt-8 mb-8 w-full max-w-5xl" aria-label={isWave ? "Continue wave training" : "Continue spam training"}>
      <h2 className="mb-4 border-l-4 border-blue-500 px-2 text-xl font-display font-bold text-white">
        {isWave ? "Continue Wave Training" : "Continue Geometry Dash Spam Training"}
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map(({ href, label, desc, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className={`group block rounded-xl border border-white/5 bg-slate-900/60 p-4 transition-colors hover:bg-slate-900 ${tones[tone]}`}
          >
            <Icon className="mb-3 h-8 w-8 transition-transform group-hover:scale-110" aria-hidden="true" />
            <h3 className="mb-1 text-sm font-bold text-white">{label}</h3>
            <p className="text-xs leading-5 text-slate-400">{desc}</p>
          </Link>
        ))}
      </div>
    </nav>
  );
}
