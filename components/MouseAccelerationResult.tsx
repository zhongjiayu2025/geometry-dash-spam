"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function MouseAccelerationResult({
  startX,
  endX,
  returnX,
  onReset,
}: {
  startX: number;
  endX: number;
  returnX: number;
  onReset: () => void;
}) {
  const difference = Math.abs(startX - returnX);
  const outboundDistance = endX - startX;
  const returnDistance = endX - returnX;
  const validMovement = outboundDistance >= 100 && returnDistance >= 100;
  const hasLargeDifference = validMovement && difference > 50;

  return (
    <>
      <div className="w-full text-center animate-in zoom-in-95 duration-300">
        <h3 className="mb-6 text-3xl font-display font-bold text-white">Results</h3>
        <div className="mb-8 grid grid-cols-3 gap-4 md:gap-8">
          <Point label="Point A (Start)" value={startX} />
          <Point label="Point B (Fast)" value={endX} />
          <Point label="Point C (Slow Return)" value={returnX} />
        </div>

        {!validMovement ? (
          <div className="rounded-2xl border border-amber-500/50 bg-amber-900/20 p-6">
            <div className="mb-2 flex items-center justify-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
              <h4 className="text-2xl font-display font-bold text-amber-400">Movement Too Short</h4>
            </div>
            <p className="text-sm leading-6 text-amber-200/80">
              Move at least 100px to the right, then at least 100px back toward Point A. This trial is not long enough to interpret.
            </p>
          </div>
        ) : (
          <div className={`rounded-2xl border p-6 ${hasLargeDifference ? "border-rose-500/50 bg-rose-900/20" : "border-emerald-500/50 bg-emerald-900/20"}`}>
            <div className="mb-2 flex items-center justify-center gap-3">
              {hasLargeDifference && <AlertTriangle className="h-6 w-6 text-rose-400" />}
              <h4 className={`text-2xl font-display font-bold ${hasLargeDifference ? "text-rose-400" : "text-emerald-400"}`}>
                {hasLargeDifference ? "Large Return Difference" : "Small Return Difference"}
              </h4>
            </div>
            <p className="text-slate-300">
              Cursor difference: <strong className="text-white">{difference}px</strong>
            </p>
            <p className={`mt-2 text-sm ${hasLargeDifference ? "text-rose-300/80" : "text-emerald-300/80"}`}>
              {hasLargeDifference
                ? "The cursor returned far from the starting screen position. Acceleration is one possible cause, but browser pointer behavior, hand path and display scaling can also affect this result."
                : "The cursor returned close to the starting screen position. This does not prove that operating-system mouse acceleration is disabled."}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onReset();
          }}
          className="mx-auto mt-8 flex items-center gap-2 rounded-lg bg-white/10 px-6 py-2 font-medium text-white transition-colors hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
      </div>

      <div className="absolute bottom-0 top-0 w-px bg-orange-500/50" style={{ left: `${startX}px` }} />
      <div className="absolute bottom-0 top-0 w-px bg-green-500/50" style={{ left: `${returnX}px` }} />
    </>
  );
}

function Point({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-800/50 p-4">
      <div className="mb-1 text-xs uppercase text-slate-500">{label}</div>
      <div className="font-mono text-xl text-white">{value}px</div>
    </div>
  );
}
