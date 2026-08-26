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
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <>
      <div className="flex flex-col gap-5 select-none w-full">
        {/* Huge Unconstrained Stage — Shelled style (No container box, No gray border) */}
        <div
          className="product-gallery-primary-img relative aspect-[4/5] sm:aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] w-full max-h-[780px] overflow-hidden rounded-2xl touch-pan-y group cursor-zoom-in"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightbox(true)}
        >
          {/* Images */}
          {allImages.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 transition-opacity duration-300 flex items-center justify-center",
                idx === activeIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
              )}
            >
              <Image
                src={img}
                alt={`${alt} view ${idx + 1}`}
                fill
                className={cn(
                  "object-contain p-0 transition-transform duration-300 ease-out drop-shadow-2xl",
                  isZoomed && idx === activeIndex ? "scale-125" : "scale-100"
                )}
                style={
                  isZoomed && idx === activeIndex
                    ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      }
                    : undefined
                }
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </div>
          ))}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10 pointer-events-none">
            {badge && <ProductBadge badge={badge} />}
            {discount && discount > 0 ? (
              <span className="rounded-full bg-neutral-950/90 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-md backdrop-blur-sm">
                Save {discount}%
              </span>
            ) : null}
          </div>

          {/* Expand Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(true);
            }}
            aria-label="Expand image"
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-neutral-800 hover:text-neutral-950 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Left Navigation Arrow */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-neutral-900 transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Navigation Arrow */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-neutral-900 transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Bottom Indicators */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-neutral-950/40 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
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
                      ? "w-5 h-1.5 bg-white shadow-xs"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Minimal Floating Thumbnails Row */}
        {hasMultiple && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer",
                  activeIndex === index
                    ? "ring-2 ring-neutral-950 scale-105 shadow-sm opacity-100"
                    : "opacity-60 hover:opacity-100 hover:scale-102"
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* High-Resolution Full-Screen Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-950/95 backdrop-blur-xl p-4 sm:p-8"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
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
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/25 transition-all cursor-pointer backdrop-blur-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/25 transition-all cursor-pointer backdrop-blur-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={allImages[activeIndex]}
              alt={alt}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
