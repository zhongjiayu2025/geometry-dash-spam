"use client";

import { useCallback, useEffect, useState } from "react";
import { isInteractiveKeyboardTarget } from "./inputTarget";

type KeyboardChordState = {
  activeKeys: Set<string>;
  maxKeys: number;
};

export function useKeyboardChordMeasurement() {
  const [measurement, setMeasurement] = useState<KeyboardChordState>({
    activeKeys: new Set(),
    maxKeys: 0,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveKeyboardTarget(event.target) || event.repeat) return;

      if (
        ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.code) &&
        !(event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
      }

      setMeasurement((previous) => {
        if (previous.activeKeys.has(event.code)) return previous;

        const activeKeys = new Set(previous.activeKeys);
        activeKeys.add(event.code);
        return {
          activeKeys,
          maxKeys: Math.max(previous.maxKeys, activeKeys.size),
        };
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setMeasurement((previous) => {
        if (!previous.activeKeys.has(event.code)) return previous;

        const activeKeys = new Set(previous.activeKeys);
        activeKeys.delete(event.code);
        return { ...previous, activeKeys };
      });
    };

    const clearActiveKeys = () => {
      setMeasurement((previous) => {
        if (previous.activeKeys.size === 0) return previous;
        return { ...previous, activeKeys: new Set() };
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) clearActiveKeys();
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearActiveKeys);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearActiveKeys);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const resetAll = useCallback(() => {
    setMeasurement({ activeKeys: new Set(), maxKeys: 0 });
  }, []);

  const resetMax = useCallback(() => {
    setMeasurement((previous) => ({
      ...previous,
      maxKeys: previous.activeKeys.size,
    }));
  }, []);

  return {
    activeKeys: measurement.activeKeys,
    maxKeys: measurement.maxKeys,
    resetAll,
    resetMax,
  };
}
