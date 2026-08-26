"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DISMISSED_KEY = "casele_announcement_dismissed_v2";

interface ActivePromo {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  isActive: boolean;
}

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [deliveryThreshold, setDeliveryThreshold] = useState(100);
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(false);
  const [customAnnouncement, setCustomAnnouncement] = useState("");
  const [activePromo, setActivePromo] = useState<ActivePromo | null>(null);

  // Sync dismissal state and fetch live settings on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
      setIsDismissed(dismissed);
    } catch {
      setIsDismissed(false);
    }

    // 1. Fetch live delivery rule from dedicated table
    fetch("/api/admin/discounts/delivery-rule", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setFreeDeliveryEnabled(Boolean(data.config.isFreeDeliveryActive));
          if (data.config.freeThreshold) {
            setDeliveryThreshold(Number(data.config.freeThreshold));
          }
        } else {
          setFreeDeliveryEnabled(false);
        }
      })
      .catch(() => setFreeDeliveryEnabled(false));

    // 2. Fetch custom announcement text from settings
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.announcement_text) {
          setCustomAnnouncement(data.settings.announcement_text.trim());
        }
      })
      .catch(() => {});

    // 3. Fetch active promo from database (NEVER hardcode WELCOME20)
    fetch("/api/promo/active", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.promo && data.promo.isActive) {
          setActivePromo(data.promo);
        } else {
          setActivePromo(null);
        }
      })
      .catch(() => setActivePromo(null));
  }, []);

  const announcementsList = [
    // Free delivery banner — ONLY when enabled in database
    ...(freeDeliveryEnabled && deliveryThreshold > 0
      ? [
          {
            text:
              customAnnouncement && customAnnouncement.toLowerCase().includes("delivery")
                ? customAnnouncement
                : `Complimentary Doha Express Delivery on Orders Over QR ${deliveryThreshold}`,
            badge: "FREE DELIVERY",
            link: "/shop",
          },
        ]
      : []),

    // Custom announcement banner — Only if NOT empty and NOT a delivery message when delivery is disabled
    ...(customAnnouncement &&
    (!customAnnouncement.toLowerCase().includes("delivery") || freeDeliveryEnabled)
      ? [
          {
            text: customAnnouncement,
            badge: "ANNOUNCEMENT",
            link: "/shop",
          },
        ]
      : []),

    // Active promo code banner — ONLY when active in database
    ...(activePromo
      ? [
          {
            text: `${activePromo.discountType === "percentage" ? `${activePromo.discountValue}% OFF` : `QR ${activePromo.discountValue} OFF`} ${activePromo.minOrder > 0 ? `Orders Over QR ${activePromo.minOrder}` : "Your First Order"} — Use Code: ${activePromo.code}`,
            badge: "EXCLUSIVE",
            link: "/shop",
          },
        ]
      : []),

    // Brand Guarantee
    {
      text: "Bespoke Aerospace Composites • 100% Precision Fit Guarantee",
      badge: "PRECISION FIT",
      link: "/about",
    },
  ];

  // Rotate announcements with smooth transition
  useEffect(() => {
    if (isDismissed || announcementsList.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % announcementsList.length);
        setIsTransitioning(false);
      }, 250);
    }, 5500);
    return () => clearInterval(interval);
  }, [isDismissed, announcementsList.length]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  };

  // If dismissed or checking initial state, do not render
  if (isDismissed === true || isDismissed === null || announcementsList.length === 0) {
    return null;
  }

  const item = announcementsList[current % announcementsList.length];

  return (
    <div className="relative z-50 border-b border-neutral-200/80 bg-neutral-900 text-white select-none transition-all duration-300">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left spacer for perfect centering on desktop */}
        <div className="hidden sm:flex items-center gap-2 w-28">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#C5A869]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-pulse" />
            Doha, Qatar
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
          {announcementsList.length > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {announcementsList.map((_, i) => (
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
                    i === (current % announcementsList.length)
                      ? "w-3.5 h-1 bg-[#C5A869]"
                      : "w-1 h-1 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

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
