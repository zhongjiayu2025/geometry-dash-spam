"use client";

import { useCallback, useRef } from "react";

type MemoryTestRuntime = typeof import("./memoryTestRuntime");

export function useMemoryTestRuntime() {
  const runtimeRef = useRef<MemoryTestRuntime | null>(null);
  const loadRef = useRef<Promise<MemoryTestRuntime | null> | null>(null);

  const ensureRuntime = useCallback(async () => {
    if (runtimeRef.current) return runtimeRef.current;

    if (!loadRef.current) {
      loadRef.current = import("./memoryTestRuntime").catch(() => null);
    }

    const runtime = await loadRef.current;
    if (runtime) runtimeRef.current = runtime;
    return runtime;
  }, []);

  const preloadRuntime = useCallback(() => {
    void ensureRuntime();
  }, [ensureRuntime]);

  return { ensureRuntime, preloadRuntime };
}
