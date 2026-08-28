"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductBadge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: string | null;
  discount?: number;
}

export function ProductGallery({ images, alt, badge, discount }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const allImages = images.length > 0 ? images : ["/images/products/midnight-black.svg"];
  const hasMultiple = allImages.length > 1;

  const goToNext = useCallback(() => {
    setIsZoomed(false);
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const goToPrev = useCallback(() => {
    setIsZoomed(false);
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
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, hasMultiple]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleToggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
    setIsZoomed((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-5 select-none w-full">
      {/* Huge Unconstrained Stage — Shelled style (No container box, No gray border) */}
      <div
        className={cn(
          "product-gallery-primary-img relative aspect-[4/5] sm:aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] w-full max-h-[780px] overflow-hidden rounded-2xl touch-pan-y group transition-all",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
        onClick={handleToggleZoom}
      >
        {/* Images with Click-to-Zoom in place */}
        {allImages.map((img, idx) => (
          <div
            key={idx}
            className={cn(
              "absolute inset-0 transition-opacity duration-300 flex items-center justify-center pointer-events-none",
              idx === activeIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
            )}
          >
            <Image
              src={img}
              alt={`${alt} view ${idx + 1}`}
              fill
              className={cn(
                "object-contain p-0 transition-transform drop-shadow-2xl",
                isZoomed && idx === activeIndex
                  ? "scale-175 duration-100 ease-out"
                  : "scale-100 duration-300 ease-out"
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

        {/* Zoom Mode Hint Button */}
        <div
          className={cn(
            "absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wider transition-all pointer-events-none backdrop-blur-md shadow-xs",
            isZoomed
              ? "bg-neutral-950/85 text-white opacity-100"
              : "bg-white/75 text-neutral-800 opacity-0 group-hover:opacity-100"
          )}
        >
          {isZoomed ? (
            <>
              <ZoomOut className="h-3.5 w-3.5" />
              <span>Click to reset</span>
            </>
          ) : (
            <>
              <ZoomIn className="h-3.5 w-3.5" />
              <span>Click to zoom</span>
            </>
          )}
        </div>

        {/* Left Navigation Arrow */}
        {hasMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous Image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-neutral-900 transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-neutral-900 transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  setIsZoomed(false);
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

      {/* Minimal Floating Thumbnails Row — No container boxes */}
      {hasMultiple && (
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none px-1">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setIsZoomed(false);
                setActiveIndex(index);
              }}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer",
                activeIndex === index
                  ? "opacity-100 scale-105"
                  : "opacity-40 hover:opacity-80 hover:scale-102"
              )}
            >
              <div className="relative h-20 w-16 sm:h-24 sm:w-20">
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="80px"
                />
              </div>
              <span
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  activeIndex === index ? "w-6 bg-[#C5A869]" : "w-1.5 bg-transparent group-hover:bg-neutral-300"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
