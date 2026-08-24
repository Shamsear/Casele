"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: string | null;
  discount?: number;
}

export function ProductGallery({ images, alt, badge, discount }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const allImages = images.length > 0 ? images : ["/images/products/midnight-black.svg"];
  const hasMultiple = allImages.length > 1;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!hasMultiple) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;

    // Ensure horizontal swipe is dominant and exceeds threshold (40px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        // Swiped Left -> Go Next
        goToNext();
      } else {
        // Swiped Right -> Go Prev
        goToPrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!hasMultiple) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        setLightbox(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, hasMultiple]);

  return (
    <>
      <div className="flex flex-col gap-4 select-none">
        {/* Main Stage */}
        <div
          className="relative aspect-square w-full overflow-hidden bg-[#111111] border border-dark-border touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Images */}
          {allImages.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 transition-opacity duration-200 cursor-pointer",
                idx === activeIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
              )}
              onClick={() => setLightbox(true)}
            >
              <Image
                src={img}
                alt={`${alt} view ${idx + 1}`}
                fill
                className="object-contain p-6 sm:p-12"
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          ))}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
            {badge && (
              <span className="bg-black/90 border border-white/10 px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white uppercase">
                {badge}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="bg-[#B91C1C] px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white uppercase">
                -{discount}%
              </span>
            )}
          </div>

          {/* Left Arrow Button */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center bg-black/60 border border-white/10 text-white transition-colors hover:bg-black hover:border-white/30 active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Right Arrow Button */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center bg-black/60 border border-white/10 text-white transition-colors hover:bg-black hover:border-white/30 active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Bottom Dot Indicators */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 px-3 py-1 border border-white/10 backdrop-blur-sm">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    "h-1.5 transition-all cursor-pointer",
                    i === activeIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-warm-gray/70 font-mono hidden sm:block pointer-events-none">
            {activeIndex + 1} / {allImages.length}
          </div>
        </div>

        {/* Thumbnail Row */}
        {hasMultiple && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-square overflow-hidden bg-[#111111] border transition-colors cursor-pointer",
                  activeIndex === index
                    ? "border-white"
                    : "border-dark-border hover:border-white/40"
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} thumb ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clean Fullscreen Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 text-xs uppercase tracking-widest text-white/70 hover:text-white"
          >
            Close ✕
          </button>

          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          <div className="relative w-full max-w-2xl aspect-square">
            <Image
              src={allImages[activeIndex]}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
