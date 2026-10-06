"use client";

export type VisualMemoryState = "idle" | "showing" | "playing" | "finished" | "failed";

export default function VisualMemoryGrid({
  gameState,
  gridSize,
  activeSquares,
  clickedSquares,
  missedSquares,
  onSquareClick,
}: {
  gameState: VisualMemoryState;
  gridSize: number;
  activeSquares: number[];
  clickedSquares: number[];
  missedSquares: number[];
  onSquareClick: (index: number) => void;
}) {
  return (
    <div
      className="grid gap-2 p-2 bg-slate-900 rounded-2xl border border-white/10"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        width: "100%",
        maxWidth: `${Math.max(300, gridSize * 80)}px`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const isActive = activeSquares.includes(index);
        const isClicked = clickedSquares.includes(index);
        const isMissed = missedSquares.includes(index);

        let bgColor = "bg-slate-800";

        if (gameState === "showing" && isActive) {
          bgColor = "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]";
        } else if (gameState === "failed") {
          if (isActive && !isClicked) bgColor = "bg-white/50 border border-white";
          if (isClicked) bgColor = "bg-fuchsia-500";
          if (isMissed) bgColor = "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]";
        } else if (isClicked) {
          bgColor = "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]";
        } else if (isMissed) {
          bgColor = "bg-red-500";
        } else {
          bgColor = "bg-slate-800 hover:bg-slate-700 cursor-pointer border border-white/5";
        }

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSquareClick(index)}
            disabled={gameState !== "playing"}
            aria-label={`Memory square ${index + 1}`}
            className={`aspect-square rounded-xl transition-all duration-300 ${bgColor} ${gameState === "playing" ? "active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400" : ""}`}
          />
        );
      })}
    </div>
  );
}
