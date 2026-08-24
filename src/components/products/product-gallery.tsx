"use client";

import { useState } from "react";
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

  const allImages = images.length > 0 ? images : ["/images/products/midnight-black.svg"];

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Stage */}
        <div
          className="relative aspect-square w-full overflow-hidden bg-[#111111] border border-dark-border cursor-pointer"
          onClick={() => setLightbox(true)}
        >
          {allImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${alt} view ${idx + 1}`}
              fill
              className={cn(
                "object-contain p-8 sm:p-12 transition-opacity duration-200",
                idx === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
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

          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-warm-gray/60 font-mono">
            {activeIndex + 1} / {allImages.length}
          </div>
        </div>

        {/* Minimal Thumbnail Row */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-square overflow-hidden bg-[#111111] border transition-colors",
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
