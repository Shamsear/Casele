"use client";

import { useState } from "react";
import Image from "next/image";
import { Shield, Magnet, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LAYERS = [
  {
    id: "shell",
    number: "01",
    title: "Aerospace Composite Outer Shell",
    subtitle: "High-density polycarbonate shell with UV fade-resistant pigmentation and anti-scratch coating.",
    icon: Shield,
    offset: "translate-y-0 translate-x-0",
    activeHighlight: "ring-2 ring-neutral-950",
  },
  {
    id: "magsafe",
    number: "02",
    title: "MagSafe Neodymium Array",
    subtitle: "38-piece N52 magnet ring delivering 15W peak Qi wireless charging and snap-tight accessory locking.",
    icon: Magnet,
    offset: "-translate-y-4 -translate-x-3",
    activeHighlight: "ring-2 ring-[#A88B4D]",
  },
  {
    id: "tpu",
    number: "03",
    title: "Honeycomb Shock Cushioning",
    subtitle: "Internal air-pocket perimeter dissipation matrix tested for 10-foot multi-angle drop resilience.",
    icon: Layers,
    offset: "-translate-y-8 -translate-x-6",
    activeHighlight: "ring-2 ring-neutral-950",
  },
  {
    id: "microfiber",
    number: "04",
    title: "Microfiber Device Bedding",
    subtitle: "Silky microfiber lining that cushions the glass back of your flagship device from micro-abrasions.",
    icon: Sparkles,
    offset: "-translate-y-12 -translate-x-9",
    activeHighlight: "ring-2 ring-neutral-950",
  },
];

export function ExplodedLayers() {
  const [activeLayer, setActiveLayer] = useState<string>("shell");

  return (
    <section className="py-20 sm:py-28 bg-neutral-50 border-t border-neutral-200/70 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
            Engineering Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal text-neutral-950">
            Exploded 4-Layer Protection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
            Deconstructed precision. Click each component layer below to explore how CASELÉ engineers zero-compromise protection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Interactive 3D Exploded Visual Stage (6 Cols) */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl border border-neutral-200/80 bg-gradient-to-b from-white to-neutral-100 p-8 flex items-center justify-center shadow-sm">
            {/* Ambient circular glow */}
            <div className="absolute h-64 w-64 rounded-full bg-neutral-200/50 blur-3xl" />

            {/* Exploded Render Stacks */}
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 transition-transform duration-500 hover:scale-105">
              {/* Layer 4: Microfiber Base */}
              <div
                onClick={() => setActiveLayer("microfiber")}
                className={cn(
                  "absolute inset-0 transition-all duration-500 cursor-pointer",
                  activeLayer === "microfiber" ? "-translate-y-10 scale-105 z-40 opacity-100" : "-translate-y-6 opacity-40 hover:opacity-80"
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/products/carbon-case-blue.png"
                    alt="Microfiber bedding"
                    fill
                    className="object-contain filter grayscale contrast-75 drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Layer 3: TPU Honeycomb Shock core */}
              <div
                onClick={() => setActiveLayer("tpu")}
                className={cn(
                  "absolute inset-0 transition-all duration-500 cursor-pointer",
                  activeLayer === "tpu" ? "-translate-y-6 scale-105 z-40 opacity-100" : "-translate-y-3 opacity-60 hover:opacity-90"
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/products/silicone-case-taupe.png"
                    alt="Shock absorbing core"
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Layer 2: MagSafe Ring Overlay */}
              <div
                onClick={() => setActiveLayer("magsafe")}
                className={cn(
                  "absolute inset-0 transition-all duration-500 cursor-pointer",
                  activeLayer === "magsafe" ? "translate-y-0 scale-110 z-40 opacity-100" : "translate-y-2 opacity-80 hover:opacity-100"
                )}
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full border-4 border-dashed border-[#A88B4D] animate-spin-slow opacity-90 shadow-lg flex items-center justify-center">
                    <div className="h-12 w-2 rounded-full bg-[#A88B4D]" />
                  </div>
                </div>
              </div>

              {/* Layer 1: Outer Shell */}
              <div
                onClick={() => setActiveLayer("shell")}
                className={cn(
                  "absolute inset-0 transition-all duration-500 cursor-pointer",
                  activeLayer === "shell" ? "translate-y-6 scale-105 z-40 opacity-100" : "translate-y-6 opacity-70 hover:opacity-100"
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/products/leather-case-black.png"
                    alt="Outer shell"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Active layer label floating indicator */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 px-4 py-2 text-xs shadow-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-950">
                Layer {LAYERS.find((l) => l.id === activeLayer)?.number}: {LAYERS.find((l) => l.id === activeLayer)?.title}
              </span>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Interactive 3D Stage</span>
            </div>
          </div>

          {/* Right: Layer Selector Cards (6 Cols) */}
          <div className="lg:col-span-6 space-y-3">
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              const isSelected = activeLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={cn(
                    "rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none",
                    isSelected
                      ? "border-neutral-950 bg-white shadow-sm -translate-y-0.5"
                      : "border-neutral-200/80 bg-white/60 hover:bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isSelected
                          ? "bg-neutral-950 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-neutral-950 uppercase tracking-wider">
                          {layer.number} / {layer.title}
                        </h3>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />}
                      </div>
                      <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                        {layer.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
