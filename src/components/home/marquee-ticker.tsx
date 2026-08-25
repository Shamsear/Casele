"use client";

import { ShieldCheck, Truck, Sparkles, Magnet, RefreshCw, Zap } from "lucide-react";

const MARQUEE_ITEMS = [
  { icon: ShieldCheck, text: "0.1mm Aerospace Tolerance Fit" },
  { icon: Truck, text: "Doha Express Same-Day Dispatch" },
  { icon: Magnet, text: "MagSafe Neo-Array 15W Alignment" },
  { icon: Sparkles, text: "Anti-Yellowing Scratch-Proof Shield" },
  { icon: RefreshCw, text: "7-Day Atelier Fit Guarantee" },
  { icon: Zap, text: "10-Foot Multi-Angle Shock Absorption" },
];

export function MarqueeTicker() {
  return (
    <div className="border-y border-neutral-200/80 bg-white py-4 overflow-hidden select-none">
      <div className="flex w-max animate-marquee space-x-8">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-800 whitespace-nowrap shrink-0">
              <Icon className="h-4 w-4 text-[#A88B4D] shrink-0" />
              <span className="whitespace-nowrap">{item.text}</span>
              <span className="text-neutral-300 ml-6 shrink-0">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
