"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

const ANNOUNCEMENTS = [
  {
    text: "Complimentary Doha Express Delivery on Orders Over QR 100",
    badge: "FREE DELIVERY",
    link: "/shop",
  },
  {
    text: "20% OFF Your First Order — Use Code: WELCOME20",
    badge: "EXCLUSIVE",
    link: "/shop",
  },
  {
    text: "Bespoke Aerospace Composites • 100% Precision Fit Guarantee",
    badge: "PRECISION FIT",
    link: "/about",
  },
];

const DISMISSED_KEY = "casele_announcement_dismissed_v2";

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [deliveryThreshold, setDeliveryThreshold] = useState(100);
  const [customAnnouncement, setCustomAnnouncement] = useState("");

  // Sync dismissal state and fetch settings on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
      setIsDismissed(dismissed);
    } catch {
      setIsDismissed(false);
    }

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.free_delivery_threshold) {
            const val = Number(data.settings.free_delivery_threshold);
            if (val > 0) setDeliveryThreshold(val);
          }
          if (data.settings.announcement_text) {
            setCustomAnnouncement(data.settings.announcement_text);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Rotate announcements with smooth transition
  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsTransitioning(false);
      }, 250);
    }, 5500);
    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  };

  // If dismissed or checking initial state, do not render (prevents flash)
  if (isDismissed === true || isDismissed === null) {
    return null;
  }

  const announcementsList = [
    {
      text: customAnnouncement || `Complimentary Doha Express Delivery on Orders Over QR ${deliveryThreshold}`,
      badge: "FREE DELIVERY",
      link: "/shop",
    },
    {
      text: "20% OFF Your First Order — Use Code: WELCOME20",
      badge: "EXCLUSIVE",
      link: "/shop",
    },
    {
      text: "Bespoke Aerospace Composites • 100% Precision Fit Guarantee",
      badge: "PRECISION FIT",
      link: "/about",
    },
  ];

  const item = announcementsList[current % announcementsList.length];

  return (
    <div className="relative z-50 border-b border-neutral-200/80 bg-neutral-900 text-white select-none transition-all duration-300">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left spacer for perfect centering on desktop */}
        <div className="hidden sm:flex items-center gap-2 w-24">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#C5A869]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-pulse" />
            Live Atelier
          </span>
        </div>

        {/* Center message */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <Link
            href={item.link}
            className={`group inline-flex items-center gap-2 text-center text-xs font-medium tracking-wide transition-all duration-300 truncate ${
              isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
            }`}
          >
            <span className="hidden md:inline-block rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#DFCA9B] uppercase">
              {item.badge}
            </span>
            <span className="text-neutral-100 group-hover:text-white transition-colors truncate">
              {item.text}
            </span>
            <span className="text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 text-[11px] shrink-0">
              →
            </span>
          </Link>
        </div>

        {/* Right dots & close */}
        <div className="flex items-center gap-3 w-24 justify-end shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrent(i);
                    setIsTransitioning(false);
                  }, 150);
                }}
                aria-label={`Go to announcement ${i + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? "w-3.5 h-1 bg-[#C5A869]"
                    : "w-1 h-1 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
