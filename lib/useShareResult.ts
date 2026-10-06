"use client";

import { useCallback, useState } from "react";
import { useManagedTimeout } from "./useManagedTimeout";

export function useShareResult({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const { schedule: scheduleCopiedReset } = useManagedTimeout();

  const share = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      scheduleCopiedReset(() => setCopied(false), 2000);
    } catch {}
  }, [scheduleCopiedReset, text, title, url]);

  return { copied, share };
}
