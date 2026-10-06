"use client";

export default function SoundReactionResult({ reactionTime }: { reactionTime: number | null }) {
  return (
    <div className="text-center animate-in zoom-in-95 duration-300">
      {reactionTime === null ? (
        <>
          <h3 className="mb-2 text-3xl font-display font-bold text-rose-400">Too Early!</h3>
          <p className="text-slate-400">You must wait for the sound.</p>
        </>
      ) : (
        <>
          <div className="mb-2 text-6xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            {reactionTime} <span className="text-2xl text-violet-400">ms</span>
          </div>
          <p className="mt-2 text-slate-400">Click to try again</p>
        </>
      )}
    </div>
  );
}
