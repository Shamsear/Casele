"use client";

import { useState, useEffect } from "react";

const ANNOUNCEMENTS = [
  {
    text: "20% OFF First Order — Use Code: WELCOME20",
    link: "/shop",
    icon: "🎉",
  },
  {
    text: "FREE Delivery on orders over QR 100!",
    link: "/shop",
    icon: "🚚",
  },
  {
    text: "Flash Sale: Up to 40% OFF — Limited Time Only!",
    link: "/shop",
    icon: "⚡",
  },
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check sessionStorage for dismissal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("announcement_dismissed");
      if (dismissed) setIsVisible(false);
    }
  }, []);

  // Rotate announcements with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("announcement_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-black">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gold-shimmer" style={{ backgroundSize: "200% 100%" }} />

      <div className="relative mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <a
          href={ANNOUNCEMENTS[current].link}
          className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:opacity-80 ${
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <span>{ANNOUNCEMENTS[current].icon}</span>
          <span>{ANNOUNCEMENTS[current].text}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 transition-transform hover:translate-x-0.5"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* Dots indicator */}
        <div className="absolute right-12 hidden items-center gap-1.5 sm:flex">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrent(i);
                  setIsTransitioning(false);
                }, 200);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-1.5 bg-black" : "w-1.5 h-1.5 bg-black/30 hover:bg-black/50"
              }`}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-black/50 transition-all hover:text-black hover:bg-black/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
