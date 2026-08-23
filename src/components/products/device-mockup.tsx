"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  imageUrl: string;
  caseColor?: string;
  device?: "iphone" | "samsung" | "pixel";
  angle?: "front" | "angled" | "flat";
  className?: string;
}

/**
 * Renders a phone case image inside a device frame mockup.
 * Used for product cards and hero images to show cases in context.
 */
export function DeviceMockup({
  imageUrl,
  device = "iphone",
  angle = "front",
  className,
}: DeviceMockupProps) {
  const transforms = {
    front: "",
    angled: "perspective(800px) rotateY(-12deg) rotateX(5deg)",
    flat: "perspective(800px) rotateX(8deg)",
  };

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ transform: transforms[angle] }}
    >
      {/* Device frame */}
      <div className="relative w-[180px] h-[360px] md:w-[220px] md:h-[440px]">
        {/* Phone body */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-2xl">
          {/* Screen */}
          <div className="absolute inset-[3px] rounded-[2.3rem] overflow-hidden bg-black">
            {/* Case image */}
            <Image
              src={imageUrl}
              alt="Phone case"
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>

          {/* Notch (iPhone) */}
          {device === "iphone" && (
            <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-b-2xl z-10" />
          )}

          {/* Camera bump (Samsung/Pixel) */}
          {device === "samsung" && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-10">
              <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-700" />
              <div className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-700" />
            </div>
          )}

          {/* Side buttons */}
          <div className="absolute -left-[2px] top-24 w-[3px] h-8 bg-gray-600 rounded-l" />
          <div className="absolute -left-[2px] top-36 w-[3px] h-12 bg-gray-600 rounded-l" />
          <div className="absolute -right-[2px] top-28 w-[3px] h-14 bg-gray-600 rounded-r" />
        </div>

        {/* Reflection */}
        <div className="absolute -bottom-4 left-4 right-4 h-8 bg-gradient-to-b from-black/20 to-transparent rounded-full blur-md" />
      </div>
    </div>
  );
}

/**
 * Inline SVG device frame with case color overlay.
 * Used when you want a lightweight SVG-only representation.
 */
export function DeviceMockupSVG({
  caseColor = "#1a1a1a",
  className,
}: {
  caseColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 400"
      className={cn("w-full h-auto", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Phone body */}
      <rect x="10" y="10" width="180" height="380" rx="30" fill="#1a1a1a" stroke="#333" strokeWidth="2" />

      {/* Screen area */}
      <rect x="16" y="16" width="168" height="368" rx="26" fill="#000" />

      {/* Case color overlay */}
      <rect x="16" y="16" width="168" height="368" rx="26" fill={caseColor} opacity="0.9" />

      {/* Camera cutout */}
      <circle cx="100" cy="36" r="6" fill="#000" opacity="0.5" />

      {/* Notch */}
      <rect x="70" y="16" width="60" height="14" rx="7" fill="#000" />

      {/* Side buttons */}
      <rect x="6" y="120" width="4" height="30" rx="2" fill="#333" />
      <rect x="6" y="160" width="4" height="50" rx="2" fill="#333" />
      <rect x="190" y="140" width="4" height="60" rx="2" fill="#333" />

      {/* Bottom speaker grilles */}
      <circle cx="80" cy="386" r="2" fill="#333" />
      <circle cx="90" cy="386" r="2" fill="#333" />
      <circle cx="110" cy="386" r="2" fill="#333" />
      <circle cx="120" cy="386" r="2" fill="#333" />

      {/* CASELÉ branding on case */}
      <text x="100" y="200" textAnchor="middle" fill="#D4AF37" fontSize="10" fontFamily="Georgia, serif" opacity="0.6">
        CASELÉ
      </text>
    </svg>
  );
}

/**
 * Lifestyle scene mockup — shows a case in a real-world context.
 */
export function LifestyleMockup({
  imageUrl,
  label,
  className,
}: {
  imageUrl: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-surface via-black to-dark-surface" />

      {/* Desk/surface elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-dark-border/20 to-transparent" />

      {/* Phone with case */}
      <div className="relative flex items-center justify-center py-12 px-8">
        <DeviceMockup imageUrl={imageUrl} angle="angled" />
      </div>

      {/* Label */}
      {label && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-xs text-warm-gray/60">{label}</p>
        </div>
      )}
    </div>
  );
}
