import { SCL_CHECKED_AT, SCL_SOURCE, SPAM_CHALLENGES } from "../data/spamChallenges";

export default function SpamChallengeSnapshot() {
  return <section className="mb-10 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-5 md:p-6">
    <h2 className="mb-3 text-2xl font-bold text-white">Selected SCL entries · {SCL_CHECKED_AT}</h2>
    <p className="mb-5 text-sm leading-6 text-slate-300">These three entries were checked in the maintained list. Their different FPS, device and evidence fields show why a title or CPS score alone is not enough to choose a challenge. This is a dated selection, not a complete live ranking or a beginner clear order.</p>
    <div className="space-y-4">{SPAM_CHALLENGES.map((entry) => <article key={entry.id} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
      <h3 className="text-xl font-bold text-white">#{entry.rank} — {entry.name}</h3>
      <p className="my-2 font-mono text-xs text-fuchsia-200">ID {entry.id} · publisher {entry.publisher}</p>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">{[["Method",entry.method],["FPS",entry.fps],["Device",entry.device],["Handcam",entry.handcam]].map(([key,value]) => <div key={key}><dt className="text-slate-500">{key}</dt><dd className="text-slate-200">{value}</dd></div>)}</dl>
      <p className="my-3 text-sm leading-6 text-slate-300">{entry.note}</p>
      <a href={entry.video} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 underline">Completion linked by the list ↗</a>
    </article>)}</div>
    <h3 className="mb-2 mt-6 text-lg font-bold text-white">Rules to check before recording</h3>
    <ul className="mb-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
      <li>The challenge should derive almost all its difficulty from spam. The list permits a simple timing at an end.</li>
      <li>Use the entry’s method, hardware category and FPS. The current rules treat CBF separately from ordinary FPS values.</li>
      <li>At most two inputs are allowed, including when rebinding. The minimum permitted respawn time is 0.5 seconds.</li>
      <li>Top-50 records generally recommend handcam; an individual entry can require it. Every example above requires 100% completion.</li>
    </ul>
    <h3 className="mb-2 text-lg font-bold text-white">Worked eligibility check: Mesmerized</h3>
    <p className="mb-3 text-sm leading-6 text-slate-300">Search ID 125682406, check publisher ILoveLilies, and compare the entry with your setup. The checked entry specifies Alternating, CBF, all devices and necessary handcam. Prepare a full completion video and handcam evidence before using the maintained list’s Submit Record form. A browser CPS result is useful practice information; it is not completion proof. This walkthrough is not a submitted or accepted record.</p>
    <p className="text-xs leading-5 text-slate-400">Source: <a href={SCL_SOURCE} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">maintained SCL rankings, entry panels and List Requirements</a>. Recheck the entry before attempting a record; current rules can override this snapshot. In particular, a shortest-keypress browser test does not independently certify a device’s debounce setting.</p>
  </section>;
}
