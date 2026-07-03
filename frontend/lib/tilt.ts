"use client";

import { useRef, type MouseEvent } from "react";

/**
 * Tracks cursor position over an element and exposes CSS variables
 * (--tilt-x, --tilt-y) consumed by the .glass-tilt class in
 * globals.css. Kept deliberately subtle (max ~6deg) — the point is
 * a sense of depth, not a gimmick.
 */
export function useTilt(maxDegrees = 6) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const tiltX = (px - 0.5) * maxDegrees * 2;
    const tiltY = (0.5 - py) * maxDegrees * 2;

    el.style.setProperty("--tilt-x", `${tiltX}deg`);
    el.style.setProperty("--tilt-y", `${tiltY}deg`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return { ref, onMouseMove, onMouseLeave };
}