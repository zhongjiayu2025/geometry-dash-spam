import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Geometry Dash Wave Demons – Wave Practice Guide",
  description:
    "Build a Geometry Dash wave-demon practice path with skill-focused examples and a wave trainer for control and consistency.",
  alternates: { canonical: "/demon-list/wave-demons" },
};

export default function WaveDemonsPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Skill-focused guide</p>
        <h1 className="mb-4 text-3xl font-display font-bold text-white md:text-5xl">Geometry Dash Wave Demons</h1>
        <p className="leading-7 text-slate-400">
          “Wave demon” is a useful practice label, not an official Demon List category. Use it to find levels where wave control is a major part of the challenge rather than treating this page as an authoritative ranking.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Beginner", "Choose easier demons with readable wave sections and focus on surviving consistently."],
          ["Intermediate", "Add tighter corridors, transitions and longer wave runs once basic timing is stable."],
          ["Advanced", "Practice short difficult sections separately, then combine control with endurance."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
            <h2 className="mb-2 font-bold text-white">{title}</h2>
            <p className="text-sm leading-6 text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/geometry-dash-wave" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Open Wave Trainer</Link>
        <Link href="/demon-list" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">Demon List</Link>
      </div>
    </article>
  );
}
