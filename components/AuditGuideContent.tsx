import Link from "next/link";
import { SPAM_CHALLENGES, SCL_CHECKED_AT } from "../data/spamChallenges";

export function SpamSelectionComparison() {
  return <section className="my-8">
    <h2 className="mb-4 text-2xl font-bold text-white">Three top spam challenge references to compare in 2026</h2>
    <p className="mb-4 text-slate-300">Selection criteria: each entry has a checked SCL placement, an exact level ID and linked completion evidence. The selection deliberately includes different eligibility conditions. It is not a ranking of the three easiest, hardest or most enjoyable levels. Placements below are the source’s snapshot from {SCL_CHECKED_AT}.</p>
    <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr><th className="p-3">Reference / ID</th><th className="p-3">SCL rank</th><th className="p-3">FPS / device</th><th className="p-3">Best reason to inspect it</th></tr></thead><tbody>
      {SPAM_CHALLENGES.map((entry,index) => <tr key={entry.id} className="border-t border-white/10 text-slate-300"><td className="p-3"><a href={entry.video} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">{entry.name}</a><br /><span className="font-mono text-xs">{entry.id}</span></td><td className="p-3">#{entry.rank}</td><td className="p-3">{entry.fps} / {entry.device}</td><td className="p-3">{["Study a high placement with an explicit handcam requirement.","Check the Uncapped device condition before attempting a record.","Compare a fixed 60-FPS challenge with the CBF entries."][index]}</td></tr>)}
    </tbody></table></div>
    <h3 className="mb-3 mt-6 text-xl font-bold text-white">Which example should you open first?</h3>
    <p className="mb-4 text-slate-300">If you are investigating a standard 60-FPS setup, start by reading Spam Me Maybe’s entry. If you want to understand the evidence attached to a very high placement, inspect Mesmerized. If your question is whether a device category matters, compare Needles chal with Mesmerized: both list Alternating and CBF, while their device fields differ. None of these choices implies the level is appropriate for a new player.</p>
    <p className="text-slate-300">For a rated Demon with a short precision target, Sakupen Circles (ID 76962930) is a different kind of reference: inspect its dual mini-wave rather than reading its Pointercrate position as a spam rank. For gradual practice, use <Link href="/demon-list/wave-demons" className="text-blue-300 underline">the wave progression route</Link>. The <Link href="/spam-challenge-list" className="text-blue-300 underline">SCL guide</Link> contains the entry-by-entry requirements and an eligibility walkthrough.</p>
  </section>;
}

export function NotableLevelAnalysis() {
  return <>
    <p className="mb-5 text-slate-300">This guide asks how to turn a well-known wave passage into a precise practice task. It compares three sections rather than repeating a list of famous level names. Level IDs and full-completion evidence are linked so you can check the actual version.</p>
    <section className="mb-6 rounded-xl border border-white/10 p-5">
      <h2 className="mb-3 text-2xl font-bold text-white">Slaughterhouse: train a transition, then the corridor</h2>
      <p className="mb-3 text-slate-300">Use ID 27690100. River’s passage, approximately 49–58%, combines a very tight, fast wave with gravity and size changes. The following section introduces mini-UFO timing and later returns to wave. These are different input tasks even though both can feel “fast”.</p>
      <ol className="mb-3 list-decimal space-y-2 pl-5 text-slate-300"><li>Place a practice checkpoint before River’s entry. Write the first failed turn and whether gravity/size changed immediately before it.</li><li>Practice through the wave exit. Count completed passages out of five attempts from the same checkpoint.</li><li>Extend the task through the following mode transition. Keep this result separate: you have added a new skill and more gameplay.</li></ol>
      <p className="text-sm text-slate-400">If the corridor works alone but the extended task fails on entry or exit, practice that boundary. A higher raw CPS result does not answer the transition problem.</p>
      <p className="mt-3 text-sm"><a className="text-blue-300 underline" href="https://pointercrate.com/demonlist/permalink/380/" target="_blank" rel="noopener noreferrer">Exact level and full-completion evidence</a> · <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Slaughterhouse" target="_blank" rel="noopener noreferrer">Community section breakdown</a></p>
    </section>
    <section className="mb-6 rounded-xl border border-white/10 p-5">
      <h2 className="mb-3 text-2xl font-bold text-white">Sakupen Circles: a short bottleneck is not an endurance test</h2>
      <p className="mb-3 text-slate-300">Use the rated Diamond version, ID 76962930. The dual mini-wave passage around 50–66% is a compact precision target. The older Nick24 version and modified copies are separate references; a run on one cannot be reported as the other.</p>
      <p className="mb-3 text-slate-300">Break the passage at the first failed reversal. Note the intended press, release and the exit height. Practice that movement before adding the previous few inputs. If you can repeat the short movement but fail after moving the start earlier, check the entry alignment rather than immediately increasing speed. A successful isolated section demonstrates that section only.</p>
      <p className="text-sm"><a className="text-blue-300 underline" href="https://pointercrate.com/demonlist/permalink/391/" target="_blank" rel="noopener noreferrer">Exact level and completion evidence</a> · <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Sakupen_Circles_(Diamond)" target="_blank" rel="noopener noreferrer">Rated-version gameplay reference</a></p>
    </section>
    <section className="mb-6 rounded-xl border border-white/10 p-5">
      <h2 className="mb-3 text-2xl font-bold text-white">Ashley Wave Trials: separate pace changes from raw speed</h2>
      <p className="mb-3 text-slate-300">Use ID 62912799. The community gameplay description identifies a half-speed opening, an increase to normal speed near 2%, and later changes. Around 56%, it describes quadruple-speed mini-wave gameplay with tight spaces and portals. A single constant-rate CPS test hides these changes in task.</p>
      <p className="mb-3 text-slate-300">Use two logs: one for maintaining the early slow path and another for a short later mini-wave section. For each, record the start/end markers, size, gravity and the first repeated error. Do not average the two sections into a supposed universal CPS requirement. Rejoin them only after each chosen segment has a repeatable input pattern.</p>
      <p className="text-sm"><a className="text-blue-300 underline" href="https://pointercrate.com/demonlist/permalink/669/" target="_blank" rel="noopener noreferrer">Exact level and completion evidence</a> · <a className="text-blue-300 underline" href="https://geometrydash.wiki.gg/wiki/Ashley_Wave_Trials" target="_blank" rel="noopener noreferrer">Community gameplay description</a></p>
    </section>
    <h2 className="mb-3 mt-8 text-2xl font-bold text-white">One log that keeps the comparison honest</h2>
    <div className="mb-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["Level ID / version", "Start → end", "Failure", "Input change", "Completed / attempts"].map((title) => <th key={title} className="p-3">{title}</th>)}</tr></thead><tbody><tr className="border-t border-white/10"><td className="p-3">Your exact ID</td><td className="p-3">Your markers</td><td className="p-3">First repeated turn</td><td className="p-3">One press/release change</td><td className="p-3">— / 5</td></tr></tbody></table></div>
    <p className="mb-4 text-sm text-slate-400">These are suggested exercises based on sourced gameplay descriptions, not a claim that our editors cleared the levels. Percentage markers are approximate and should be checked against the current version. Video timestamps differ between uploads. Use the <Link href="/geometry-dash-wave" className="text-blue-300 underline">browser wave guide</Link> for the basic hold/release mechanism, and the real game for these exact portals and physics.</p>
  </>;
}

export function MouseComparisonSheet() {
  return <section className="my-8">
    <h2 className="mb-3 text-2xl font-bold text-white">Fillable decision sheet: current mouse versus candidate</h2>
    <p className="mb-4 text-slate-300">Copy this table into your notes. Keep an unknown field blank instead of filling it from a different model’s review.</p>
    <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead><tr><th className="p-3">Question</th><th className="p-3">Current mouse</th><th className="p-3">Candidate</th><th className="p-3">Decision value</th></tr></thead><tbody>{[
      ["Exact model / firmware / connection", "—", "—", "Makes specifications and tests attributable."],
      ["10s CPS, three runs", "— / — / —", "— / — / —", "Compute median and range separately."],
      ["Fixed wave preset / difficulty, three survivals", "— / — / —", "— / — / —", "Checks whether speed remains controlled."],
      ["Grip / button reach with your preferred finger", "—", "—", "A higher score does not compensate for poor reach."],
      ["Unwanted duplicate inputs or missed presses", "—", "—", "Repeat an unusual result before diagnosing a switch."],
      ["Polling specification / browser observation", "— / —", "— / —", "Keep the advertised value separate from observed events."],
      ["List eligibility for your actual target", "—", "—", "Check method/device rules, not a generic gaming label."],
      ["Price and return terms you verified", "—", "—", "Leave unknown until checked at the seller."],
    ].map(([question,a,b,value]) => <tr className="border-t border-white/10 text-slate-300" key={question}><td className="p-3">{question}</td><td className="p-3">{a}</td><td className="p-3">{b}</td><td className="p-3">{value}</td></tr>)}</tbody></table></div>
    <h3 className="mb-3 mt-6 text-xl font-bold text-white">How to resolve a trade-off</h3>
    <p className="mb-3 text-slate-300">If a candidate increases your short CPS burst but lowers survival at the same wave setting, try the original comfortable pace before buying for “speed”. If its scores are similar but reach and grip are easier to reproduce, comfort may be the useful difference. If you only have marketing specifications and no access to the device, the performance comparison remains unknown.</p>
    <p className="text-sm text-slate-400">These are decision examples, not measured results or endorsements of a particular product. The worksheet is designed to answer whether changing a mouse solves your own observed problem.</p>
  </section>;
}

export function MobileInputComparison() {
  return <section className="my-8">
    <h2 className="mb-3 text-2xl font-bold text-white">What actually changes between touch, mouse and keyboard?</h2>
    <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr><th className="p-3">Input setup</th><th className="p-3">Repeatable position</th><th className="p-3">Press / release issue to inspect</th><th className="p-3">A useful comparison</th></tr></thead><tbody>{[
      ["Touchscreen", "Support the device and use the same touch area; keep the path visible.", "Finger contact can cover the obstacle; a long contact also changes the hold duration.", "Same finger and region for three CPS runs, then the same visible wave corridor."],
      ["Mouse", "Keep the mouse still and place the same finger at the same point on the button.", "Button travel and finger lift change the hold/release pattern; sliding can create unintended bursts.", "Keep the technique fixed; change mouse or button in separate blocks."],
      ["Keyboard", "Use one fixed key and support the hand consistently.", "Holding a key is one press, not repeated intentional taps; OS auto-repeat is not a spam technique.", "Use the 20-tap hold/release drill, then test the same binding in game."],
    ].map(([input,position,issue,comparison]) => <tr key={input} className="border-t border-white/10 text-slate-300"><td className="p-3">{input}</td><td className="p-3">{position}</td><td className="p-3">{issue}</td><td className="p-3">{comparison}</td></tr>)}</tbody></table></div>
    <h3 className="mb-3 mt-6 text-xl font-bold text-white">Separate platform from technique</h3>
    <p className="mb-3 text-slate-300">Changing from a phone held in the hands to a desktop mouse changes device, screen, posture and technique together. That can answer “which complete setup works better for me?” It cannot isolate how much the touchscreen or polling rate caused the difference. Record the whole setup, use the same test length, and compare each device’s own three-run series before comparing them.</p>
    <p className="text-slate-300">For a touch result that looks fast but loses the wave, first move the contact area away from the path and shorten long holds. For keyboard tapping, inspect <Link className="text-blue-300 underline" href="/keyboard-latency">the separate hold and release samples</Link>. The site does not provide controlled measurements proving one platform universally faster.</p>
  </section>;
}

export function AdviceVerificationCase() {
  return <section className="my-8 rounded-2xl border border-blue-500/20 p-5">
    <h2 className="mb-3 text-2xl font-bold text-white">A real case: can the shortest browser keypress establish debounce?</h2>
    <p className="mb-3 text-slate-300">Source checked October 16, 2026: the maintained <a className="text-blue-300 underline" href="https://thespamchallengelist.pages.dev/#/" target="_blank" rel="noopener noreferrer">SCL List Requirements</a> describes an Uncapped device category using a 10ms debounce threshold and directs players to a shortest-keypress browser test. This is an actual public measurement suggestion, separate from the list’s authority to set its own eligibility rules.</p>
    <ol className="mb-4 list-decimal space-y-3 pl-5 text-slate-300"><li><strong>Identify the quantity:</strong> debounce is device input filtering. A browser key-hold test records the interval between delivered keydown and keyup events.</li><li><strong>Follow the measurement:</strong> our <Link className="text-blue-300 underline" href="/keyboard-latency">Key Timing tool</Link> starts a clock when a keydown handler runs and ends it when the keyup handler runs. It never observes the physical switch actuation or reads a firmware setting.</li><li><strong>Try a discriminating check:</strong> keep the keyboard unchanged and deliberately make one long hold and one short tap. Their measured durations differ without any firmware change. This is a reproducible experiment design, not a recorded hardware benchmark.</li><li><strong>Limit the conclusion:</strong> a short observed hold is not, by itself, a certificate of a device’s debounce setting. A direct setting readout or a suitable independently controlled hardware method would be different evidence.</li></ol>
    <p className="mb-3 text-sm text-slate-400">Technical reference: MDN’s <a className="text-blue-300 underline" href="https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event" target="_blank" rel="noopener noreferrer">keydown</a> and <a className="text-blue-300 underline" href="https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event" target="_blank" rel="noopener noreferrer">keyup</a> event definitions. The distinction between those events and a physical filtering delay is the inference made in this case.</p>
    <p className="text-slate-300">Practical decision: read the current entry’s device rules and ask the list’s staff which evidence they accept if the category is unclear. Do not use a browser timing score to self-certify a hardware condition. This does not change the community list’s placements or claim its records are invalid.</p>
  </section>;
}
