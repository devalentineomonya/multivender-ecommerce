"use client";
import { useEffect, type RefObject } from "react";

/**
 * Closes a panel/menu on outside pointerdown or Escape. Shared by the search
 * combobox and the category dropdown so dismissal behaves identically everywhere.
 */
export function useDismiss(
  refs: RefObject<HTMLElement | null>[],
  onDismiss: () => void,
  options: { enabled?: boolean; closeOnEscape?: boolean } = {}
) {
  const { enabled = true, closeOnEscape = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (refs.some((r) => r.current?.contains(target))) return;
      onDismiss();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        e.stopPropagation();
        onDismiss();
      }
    };

    // Capture phase: fires even if a descendant stops propagation in the bubble phase.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDismiss, enabled, closeOnEscape, ...refs]);
}
