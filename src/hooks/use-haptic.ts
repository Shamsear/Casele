"use client";

export function useHaptic() {
  const vibrate = (pattern: number | number[] = 10) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return { vibrate };
}
