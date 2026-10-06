import { Fingerprint, Mouse, Zap } from "lucide-react";

const HEROES = {
  jitter: {
    badge: "CLICKING TECHNIQUE",
    title: "Jitter Click Test",
    description:
      "Practice jitter clicking and compare a repeatable 10-second browser-registered CPS result.",
    badgeClass: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    Icon: Zap,
  },
  butterfly: {
    badge: "DOUBLE FINGER TECHNIQUE",
    title: "Butterfly Click Test",
    description:
      "Practice an alternating two-finger rhythm and compare your 10-second CPS result.",
    badgeClass: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    Icon: Fingerprint,
  },
  rightClick: {
    badge: "RMB TEST",
    title: "Right Click CPS Test",
    description:
      "Measure your right-mouse-button click speed over a repeatable 10-second test.",
    badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    Icon: Mouse,
  },
} as const;

export default function ClickTestHero({
  variant,
}: {
  variant: keyof typeof HEROES;
}) {
  const item = HEROES[variant];
  const Icon = item.Icon;

  return (
    <header className="mx-auto mb-8 max-w-4xl text-center">
      <div
        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${item.badgeClass}`}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
        {item.badge}
      </div>
      <h1 className="mb-4 text-4xl font-display font-black uppercase text-white drop-shadow-2xl md:text-6xl">
        {item.title}
      </h1>
      <p className="mx-auto max-w-2xl text-slate-400">{item.description}</p>
    </header>
  );
}
