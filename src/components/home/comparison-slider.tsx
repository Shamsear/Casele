"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Sparkles, MoveHorizontal } from "lucide-react";

interface ComparisonSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonSlider({
  beforeImage = "/products/leather-case-black.png",
  afterImage = "/products/titanium-case-gray.png",
  beforeLabel = "Velvety Matte Finish",
  afterLabel = "High-Gloss Crystal Luxe",
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="py-16 sm:py-24 border-t border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-[11px] font-bold text-neutral-900 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-[#A88B4D]" />
            <span>Finish Dual-Matrix</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-normal text-neutral-950">
            Matte Velvet vs Glossy Luxe
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
            Drag the interactive slider to compare our anti-fingerprint Matte coating with our ultra-vibrant High-Gloss finish.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative mx-auto max-w-4xl aspect-[16/9] sm:aspect-[2/1] rounded-3xl border border-neutral-200/80 bg-neutral-100/60 overflow-hidden select-none cursor-ew-resize shadow-md"
        >
          {/* Base Layer (Right / After: Glossy) */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative h-full w-full max-w-md">
              <Image
                src={afterImage}
                alt={afterLabel}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
            <div className="absolute top-6 right-6 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 px-3.5 py-1 text-[11px] font-bold text-neutral-950 uppercase tracking-wider shadow-xs">
              {afterLabel}
            </div>
          </div>

          {/* Clipped Layer (Left / Before: Matte) */}
          <div
            className="absolute inset-0 overflow-hidden flex items-center justify-center p-8 bg-neutral-50/90"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-8 min-w-[100%]">
              <div className="relative h-full w-full max-w-md">
                <Image
                  src={beforeImage}
                  alt={beforeLabel}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            </div>
            <div className="absolute top-6 left-6 rounded-full bg-neutral-950 text-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-xs">
              {beforeLabel}
            </div>
          </div>

          {/* Divider Line & Drag Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-neutral-950 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.3)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white border-2 border-neutral-950 flex items-center justify-center text-neutral-950 shadow-lg cursor-ew-resize pointer-events-auto">
              <MoveHorizontal className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Feature comparison pills */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 block mb-1">
              Matte Soft-Touch Finish
            </span>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Hydrophobic micro-texture that completely eliminates glare, smudges, and fingerprints while offering supreme tactile grip.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 block mb-1">
              High-Gloss Crystal Luxe
            </span>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Deep 3D reflective gloss coat that accentuates color saturation, protected by an anti-scratch clearcoat seal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
