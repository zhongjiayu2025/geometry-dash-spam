"use client";

import { useCallback, useRef } from "react";

export function useIntentionalPointerAction<T extends HTMLElement>({
  onAction,
  deferTouch,
  ignoreSelector,
  moveThreshold = 12,
}: {
  onAction: () => void;
  deferTouch: boolean;
  ignoreSelector?: string;
  moveThreshold?: number;
}) {
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  const onPointerDown = useCallback((event: React.PointerEvent<T>) => {
    const target = event.target as Element;
    if (ignoreSelector && target.closest(ignoreSelector)) return;

    if (event.pointerType === "touch" && deferTouch) {
      pendingTouchRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

    event.preventDefault();
    onAction();
  }, [deferTouch, ignoreSelector, onAction]);

  const onPointerUp = useCallback((event: React.PointerEvent<T>) => {
    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== event.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
    if (moved <= moveThreshold) onAction();
  }, [moveThreshold, onAction]);

  const onPointerCancel = useCallback(() => {
    pendingTouchRef.current = null;
  }, []);

  return { onPointerDown, onPointerUp, onPointerCancel };
}
