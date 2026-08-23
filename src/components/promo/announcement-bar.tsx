"use client";

import { useState, useEffect } from "react";

const ANNOUNCEMENTS = [
  {
    text: "20% OFF First Order — Use Code: WELCOME20",
    link: "/shop",
  },
  {
    text: "FREE Delivery on orders over QR 100!",
    link: "/shop",
  },
  {
    text: "Flash Sale: Up to 40% OFF — Limited Time Only!",
    link: "/shop",
  },
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate announcements every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gold text-black">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <a
          href={ANNOUNCEMENTS[current].link}
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
        >

          <span>{ANNOUNCEMENTS[current].text}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
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
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-4 bg-black" : "w-1.5 bg-black/30"
              }`}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-black/60 transition-colors hover:text-black"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
