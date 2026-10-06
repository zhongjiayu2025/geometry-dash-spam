export function isInteractiveKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  return Boolean(
    target.closest(
      'button, a[href], input, textarea, select, summary, [role="button"], [role="link"]'
    )
  );
}
