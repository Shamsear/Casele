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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const allImages = images.length > 0 ? images : ["/images/products/midnight-black.svg"];

  // Switch image with crossfade
  const switchImage = useCallback((newIndex: number) => {
    if (newIndex === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setIsZoomed(false);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, [activeIndex, isTransitioning]);

  // Touch / swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < allImages.length - 1) {
        switchImage(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        switchImage(activeIndex - 1);
      }
    }
  }, [activeIndex, allImages.length, switchImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && activeIndex < allImages.length - 1) {
        switchImage(activeIndex + 1);
      } else if (e.key === "ArrowLeft" && activeIndex > 0) {
        switchImage(activeIndex - 1);
      } else if (e.key === "Escape") {
        setIsZoomed(false);
        setLightbox(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, allImages.length, switchImage]);

  // Close zoom when clicking outside
  useEffect(() => {
    if (!isZoomed) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
        setIsZoomed(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isZoomed]);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    if (isZoomed) {
      setIsZoomed(false);
    } else {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
      setIsZoomed(true);
    }
  }, [isZoomed]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, [isZoomed]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main Image */}
        <div
          ref={imageRef}
          className={cn(
            "relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* All images stacked — only active one visible */}
          {allImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${alt} — image ${idx + 1} of ${allImages.length}`}
              fill
              className={cn(
                "object-contain p-6 sm:p-8 transition-all duration-500 ease-out",
                idx === activeIndex
                  ? isTransitioning
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none",
                isZoomed && idx === activeIndex && "scale-[2.5]"
              )}
              style={
                isZoomed && idx === activeIndex
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ))}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow-lg",
                  badge === "new" && "bg-emerald-500 text-white shadow-emerald-500/20",
                  badge === "bestseller" && "bg-gold text-black shadow-gold/20",
                  badge === "sale" && "bg-red-500 text-white shadow-red-500/20"
                )}
              >
                {badge === "new" ? "✨ NEW" : badge === "bestseller" ? "⭐ BESTSELLER" : "🏷️ SALE"}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/20">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Navigation arrows — desktop */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeIndex > 0) switchImage(activeIndex - 1);
                }}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all duration-300 hover:bg-black/60 hover:scale-110",
                  activeIndex === 0 && "opacity-30 pointer-events-none"
                )}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeIndex < allImages.length - 1) switchImage(activeIndex + 1);
                }}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all duration-300 hover:bg-black/60 hover:scale-110",
                  activeIndex === allImages.length - 1 && "opacity-30 pointer-events-none"
                )}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators — mobile */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 md:hidden">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    switchImage(idx);
                  }}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    idx === activeIndex
                      ? "h-2 w-6 bg-gold shadow-md shadow-gold/30"
                      : "h-2 w-2 bg-white/40"
                  )}
                />
              ))}
            </div>
          )}

          {/* Image counter — desktop */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md z-10 hidden md:block">
              {activeIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Zoom hint */}
          {!isZoomed && (
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 backdrop-blur-md z-10 hidden md:flex items-center gap-1.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" />
                <path d="M9 5.75a.75.75 0 01.75.75v1.75h1.75a.75.75 0 010 1.5h-1.75v1.75a.75.75 0 01-1.5 0v-1.75H6.5a.75.75 0 010-1.5h1.75V6.5A.75.75 0 019 5.75z" />
              </svg>
              Click to zoom
            </div>
          )}
          {isZoomed && (
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md z-10 hidden md:block">
              Move to pan — click to close
            </div>
          )}
        </div>

        {/* Thumbnails — horizontal scrollable pills */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  switchImage(index);
                  setIsZoomed(false);
                }}
                className={cn(
                  "relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300",
                  activeIndex === index
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-black shadow-lg shadow-gold/20 scale-105"
                    : "opacity-60 hover:opacity-100 border border-dark-border hover:border-warm-gray/40"
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox overlay */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 z-10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-3xl aspect-square">
            <Image
              src={allImages[activeIndex]}
              alt={alt}
              fill
              className="object-contain p-8"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
