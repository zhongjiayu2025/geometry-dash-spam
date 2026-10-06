"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ClickSoundEngine, ClickTone } from "./clickSound";

export function useLazyClickSound() {
  const engineRef = useRef<ClickSoundEngine | null>(null);
  const loadRef = useRef<Promise<ClickSoundEngine | null> | null>(null);
  const disposedRef = useRef(false);

  const ensure = useCallback(async () => {
    if (disposedRef.current) return null;

    if (engineRef.current) {
      await engineRef.current.resume();
      return engineRef.current;
    }

    if (!loadRef.current) {
      loadRef.current = import("./clickSound")
        .then(({ createClickSoundEngine }) => createClickSoundEngine())
        .catch(() => null);
    }

    const engine = await loadRef.current;
    if (!engine) return null;

    if (disposedRef.current) {
      await engine.destroy();
      return null;
    }

    engineRef.current = engine;
    await engine.resume();
    return engine;
  }, []);

  const play = useCallback((tone: ClickTone) => {
    const engine = engineRef.current;
    if (engine) {
      engine.play(tone);
      return;
    }

    void ensure().then((loadedEngine) => loadedEngine?.play(tone));
  }, [ensure]);

  const suspend = useCallback(async () => {
    if (engineRef.current) await engineRef.current.suspend();
  }, []);

  useEffect(() => {
    return () => {
      disposedRef.current = true;
      const engine = engineRef.current;
      engineRef.current = null;
      if (engine) void engine.destroy();
    };
  }, []);

  return { ensure, play, suspend };
}
