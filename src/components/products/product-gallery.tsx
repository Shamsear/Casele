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
    }, 150);
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
            "relative aspect-square w-full overflow-hidden rounded-2xl bg-white border border-dark-border/20 shadow-sm",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active image view */}
          {allImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${alt} — image ${idx + 1} of ${allImages.length}`}
              fill
              className={cn(
                "object-contain p-6 sm:p-8 transition-all duration-300 ease-out",
                idx === activeIndex
                  ? isTransitioning
                    ? "opacity-0 scale-98"
                    : "opacity-100 scale-100"
                  : "opacity-0 scale-98 pointer-events-none",
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
          <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm",
                  badge === "new" && "bg-emerald-500 text-white",
                  badge === "bestseller" && "bg-gold text-black",
                  badge === "sale" && "bg-red-500 text-white"
                )}
              >
                {badge === "new" ? "NEW" : badge === "bestseller" ? "BESTSELLER" : "SALE"}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm">
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
                  "absolute left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all hover:bg-black/70 hover:scale-105",
                  activeIndex === 0 && "opacity-30 pointer-events-none"
                )}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeIndex < allImages.length - 1) switchImage(activeIndex + 1);
                }}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all hover:bg-black/70 hover:scale-105",
                  activeIndex === allImages.length - 1 && "opacity-30 pointer-events-none"
                )}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators — mobile */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 md:hidden">
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
                      ? "h-1.5 w-5 bg-gold"
                      : "h-1.5 w-1.5 bg-black/30"
                  )}
                />
              ))}
            </div>
          )}

          {/* Image counter — desktop */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] text-white/90 backdrop-blur-md z-10 hidden md:block">
              {activeIndex + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
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
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white transition-all duration-200",
                  activeIndex === index
                    ? "ring-2 ring-gold border-transparent"
                    : "opacity-60 hover:opacity-100 border border-dark-border"
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
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
