export function getDragPeakOneSecondCps(times: number[]) {
  if (!times.length) return 0;

  let left = 0;
  let peak = 0;

  for (let right = 0; right < times.length; right += 1) {
    while (times[right] - times[left] > 1000) left += 1;
    peak = Math.max(peak, right - left + 1);
  }

  return peak;
}

export function getDragBuckets(times: number[], startTime: number) {
  const buckets = Array(10).fill(0);

  for (const time of times) {
    const index = Math.min(9, Math.max(0, Math.floor((time - startTime) / 1000)));
    buckets[index] += 1;
  }

  return buckets;
}
