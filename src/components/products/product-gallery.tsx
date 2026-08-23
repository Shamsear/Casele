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
  const imageRef = useRef<HTMLDivElement>(null);

  const allImages = images.length > 0 ? images : ["/images/products/midnight-black.svg"];

  // Close zoom when clicking outside the image
  useEffect(() => {
    if (!isZoomed) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
        setIsZoomed(false);
      }
    };

    // Use setTimeout to avoid catching the same click that opened the zoom
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
      // Already zoomed — clicking the image closes it
      setIsZoomed(false);
    } else {
      // Not zoomed — clicking opens zoom and sets position to click point
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
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        ref={imageRef}
        className={cn(
          "relative aspect-square overflow-hidden rounded-xl bg-white",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onClick={handleImageClick}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={allImages[activeIndex]}
          alt={`${alt} — image ${activeIndex + 1} of ${allImages.length}`}
          fill
          className={cn(
            "object-contain p-8 transition-transform duration-300 ease-out",
            isZoomed && "scale-[2.5]"
          )}
          style={
            isZoomed
              ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {badge && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                badge === "new" && "bg-emerald-500 text-white",
                badge === "bestseller" && "bg-gold text-black",
                badge === "sale" && "bg-red-500 text-white"
              )}
            >
              {badge === "new" ? "NEW" : badge === "bestseller" ? "BESTSELLER" : "SALE"}
            </span>
          )}
          {discount && discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm z-10">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Zoom hint */}
        {!isZoomed && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white/70 backdrop-blur-sm z-10">
            Click to zoom
          </div>
        )}
        {isZoomed && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm z-10">
            Move mouse to pan — click to close
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
                setIsZoomed(false);
              }}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                activeIndex === index
                  ? "border-gold ring-1 ring-gold/30"
                  : "border-dark-border hover:border-warm-gray/40"
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
  );
}
