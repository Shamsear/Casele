"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductBadge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

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
        goToNext();
      } else {
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
        {/* Main Stage Container */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-100/60 border border-neutral-200/80 touch-pan-y group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Images */}
          {allImages.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 transition-opacity duration-300 cursor-pointer flex items-center justify-center",
                idx === activeIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
              )}
              onClick={() => setLightbox(true)}
            >
              <Image
                src={img}
                alt={`${alt} view ${idx + 1}`}
                fill
                className="object-contain p-6 sm:p-12 transition-transform duration-700 group-hover:scale-102"
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          ))}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-1.5 z-10 pointer-events-none">
            {badge && <ProductBadge badge={badge} />}
            {discount && discount > 0 ? (
              <span className="rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-bold tracking-wider text-red-700 uppercase">
                Save {discount}%
              </span>
            ) : null}
          </div>

          {/* Zoom button */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="Expand image"
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200/80 text-neutral-600 hover:text-neutral-950 transition-all opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          {/* Left Arrow Button */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-neutral-200 text-neutral-800 transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-neutral-200 text-neutral-800 transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Bottom Dot Indicators */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 border border-neutral-200/80 backdrop-blur-sm shadow-xs">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all cursor-pointer",
                    i === activeIndex
                      ? "w-4 h-1.5 bg-neutral-950"
                      : "w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-500"
                  )}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-neutral-400 font-mono hidden sm:block pointer-events-none font-semibold">
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
                  "relative aspect-square overflow-hidden rounded-2xl bg-neutral-100/60 border transition-all cursor-pointer",
                  activeIndex === index
                    ? "border-neutral-950 ring-2 ring-neutral-950/10 shadow-xs"
                    : "border-neutral-200/80 hover:border-neutral-400"
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

      {/* Clean Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-950/90 backdrop-blur-md p-6"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <span>Close</span>
            <X className="h-4 w-4" />
          </button>

          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
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
