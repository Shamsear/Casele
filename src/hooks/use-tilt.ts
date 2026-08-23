"use client";

import { useRef, useCallback } from "react";

export function useTilt(maxTilt = 5) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.transform = `perspective(1000px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    ref.current.style.transition = "transform 0.4s ease-out";
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = "";
    }, 400);
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
