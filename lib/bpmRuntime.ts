export function updateBpmTaps(previous: number[], now: number) {
  const last = previous.at(-1);
  let taps =
    last === undefined || now - last > 3000
      ? [now]
      : [...previous, now];

  if (taps.length > 10) taps = taps.slice(-10);
  if (taps.length < 2) return { taps, bpm: 0 };

  const intervals = taps
    .slice(1)
    .map((time, index) => time - taps[index])
    .sort((a, b) => a - b);

  const middle = Math.floor(intervals.length / 2);
  const median =
    intervals.length % 2
      ? intervals[middle]
      : (intervals[middle - 1] + intervals[middle]) / 2;
  const estimate = median > 0 ? Math.round(60000 / median) : 0;

  return {
    taps,
    bpm: estimate > 0 && estimate < 1000 ? estimate : 0,
  };
}
