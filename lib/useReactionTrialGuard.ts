"use client";

import { useEffect, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from "react";

export function useReactionTrialGuard<State extends string>({
  clearTimeout,
  startTimeRef,
  setState,
  onInterrupt,
}: {
  clearTimeout: () => void;
  startTimeRef: MutableRefObject<number>;
  setState: Dispatch<SetStateAction<State>>;
  onInterrupt?: () => void;
}) {
  const interruptRef = useRef(onInterrupt);
  interruptRef.current = onInterrupt;

  useEffect(() => {
    const cancelInterruptedTrial = () => {
      clearTimeout();
      startTimeRef.current = 0;
      interruptRef.current?.();
      setState((current) =>
        (current === "waiting" || current === "ready" ? "idle" : current) as State
      );
    };

    const handleVisibilityChange = () => {
      if (document.hidden) cancelInterruptedTrial();
    };

    window.addEventListener("blur", cancelInterruptedTrial);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("blur", cancelInterruptedTrial);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimeout, setState, startTimeRef]);
}
