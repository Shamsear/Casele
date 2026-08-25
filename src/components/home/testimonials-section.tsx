"use client";

import { Star, CheckCircle, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Nasser Al-Kuwari",
    location: "The Pearl, Doha",
    model: "iPhone 15 Pro Max • Matte Titanium",
    rating: 5,
    text: "The matte velvet finish is flawless. Delivered within 4 hours to The Pearl via WhatsApp concierge. Exceptional build quality and zero bulk.",
    date: "2 days ago",
  },
  {
    name: "Fatima Al-Thani",
    location: "Lusail Marina",
    model: "Samsung Galaxy S24 Ultra • Glossy Carbon",
    rating: 5,
    text: "Camera cutout alignment is exact. The MagSafe magnetic grip is stronger than OEM cases. Truly elevated protection for Qatar flagships.",
    date: "1 week ago",
  },
  {
    name: "Tariq Mansoor",
    location: "West Bay, Doha",
    model: "iPhone 15 Pro • Leather Espresso",
    rating: 5,
    text: "Outstanding tactile feedback on the metal buttons. Cash on delivery was seamless. CASELÉ sets the standard in Doha.",
    date: "2 weeks ago",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-neutral-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
            Client Impressions
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal text-neutral-950">
            Endorsed Across Qatar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
            Rated 4.9/5 by over 1,400+ discerning patrons across Doha, Lusail, and all Qatar municipalities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="rounded-3xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-7 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#A88B4D]">
                    {Array.from({ length: rev.rating }).map((_, r) => (
                      <Star key={r} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-neutral-950">{rev.name}</span>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-0.5">
                  <span>{rev.location}</span>
                  <span className="font-semibold text-neutral-700">{rev.model}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
