"use client";

import { useCallback, useEffect, useRef, type MutableRefObject } from "react";

export function useExactCountdown({
  running,
  durationMs,
  startTimeRef,
  onTick,
  onFinish,
  intervalMs = 100,
}: {
  running: boolean;
  durationMs: number;
  startTimeRef: MutableRefObject<number>;
  onTick: (remainingMs: number) => void;
  onFinish: () => void;
  intervalMs?: number;
}) {
  const intervalRef = useRef<number | null>(null);
  const endRef = useRef<number | null>(null);
  const onTickRef = useRef(onTick);
  const onFinishRef = useRef(onFinish);

  onTickRef.current = onTick;
  onFinishRef.current = onFinish;

  const cancel = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (endRef.current !== null) {
      window.clearTimeout(endRef.current);
      endRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) {
      cancel();
      return;
    }

    const update = () => {
      const elapsedMs = performance.now() - startTimeRef.current;
      onTickRef.current(Math.max(0, durationMs - elapsedMs));
    };

    update();
    intervalRef.current = window.setInterval(update, intervalMs);

    const elapsedMs = performance.now() - startTimeRef.current;
    endRef.current = window.setTimeout(
      () => onFinishRef.current(),
      Math.max(0, durationMs - elapsedMs)
    );

    return cancel;
  }, [cancel, durationMs, intervalMs, running, startTimeRef]);

  return cancel;
}
