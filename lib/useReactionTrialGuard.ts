"use client";

import { useEffect, type Dispatch, type MutableRefObject, type SetStateAction } from "react";

export function useReactionTrialGuard<State extends string>({
  clearTimeout,
  startTimeRef,
  setState,
}: {
  clearTimeout: () => void;
  startTimeRef: MutableRefObject<number>;
  setState: Dispatch<SetStateAction<State>>;
}) {
  useEffect(() => {
    const cancelInterruptedTrial = () => {
      clearTimeout();
      startTimeRef.current = 0;
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
