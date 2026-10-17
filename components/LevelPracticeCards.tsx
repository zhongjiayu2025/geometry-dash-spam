import { LEVEL_REFERENCES } from "../data/levelReferences";
import { DEMONS, DEMON_VERIFIED_AT } from "../data/demons";

export default function LevelPracticeCards({ kind }: { kind: "wave" | "spam" }) {
  const entries = LEVEL_REFERENCES.filter((entry) => kind === "wave" || ["Sakupen Circles", "Slaughterhouse", "Ashley Wave Trials"].includes(entry.name));
  return <section className="mb-10 space-y-5">
    <p className="text-sm leading-6 text-slate-400">IDs, lengths and record links: Pointercrate snapshot {DEMON_VERIFIED_AT}. Section descriptions use the linked community gameplay references; exercises are this site’s suggested practice tasks, not claimed personal clears or CPS requirements. Each entry identifies a movement task; match the ID before applying a suggested section boundary.</p>
    {entries.map((entry) => <article key={entry.id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-5 md:p-6">
      <h2 className="mb-2 text-2xl font-bold text-white">{entry.name}</h2>
      <p className="mb-4 font-mono text-xs text-blue-200">ID {entry.id} · {entry.length} · Pointercrate #{DEMONS.find((demon) => demon.level === entry.name)?.rank ?? "outside snapshot"}</p>
      <dl className="space-y-3 text-sm leading-6"><div><dt className="font-bold text-white">{entry.focus}</dt><dd className="text-slate-300">{entry.section}.</dd></div><div><dt className="font-bold text-white">Failure to isolate</dt><dd className="text-slate-400">{entry.error}</dd></div><div><dt className="font-bold text-white">Practice task</dt><dd className="text-slate-300">{entry.drill}</dd></div></dl>
      <a href={entry.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-blue-300 underline">Exact level, publisher and full-completion video evidence ↗</a>
    </article>)}
    <p className="text-xs leading-5 text-slate-400">Gameplay references: <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Slaughterhouse" target="_blank" rel="noopener noreferrer">Slaughterhouse</a>, <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Sakupen_Circles_(Diamond)" target="_blank" rel="noopener noreferrer">rated Sakupen Circles</a> and <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Ashley_Wave_Trials" target="_blank" rel="noopener noreferrer">Ashley Wave Trials</a>, <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Defeated_Circles" target="_blank" rel="noopener noreferrer">Defeated Circles</a> and <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Ultra_Paracosm_(declan)" target="_blank" rel="noopener noreferrer">Ultra Paracosm (declan)</a>. Percentages are approximate gameplay markers, not video timestamps. Compare with the current in-game version.</p>
  </section>;
}
