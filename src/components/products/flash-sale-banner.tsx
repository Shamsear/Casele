"use client";

import { useState, useEffect } from "react";

interface FlashSaleBannerProps {
  name: string;
  discountType: string;
  discountValue: number;
  endsAt: string;
}

export function FlashSaleBanner({
  name,
  discountType,
  discountValue,
  endsAt,
}: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const end = new Date(endsAt).getTime();

    const update = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Sale ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const discountLabel =
    discountType === "percentage"
      ? `${discountValue}% OFF`
      : `QR ${discountValue} OFF`;

  return (
    <div className="flex items-center justify-center gap-3 bg-gold/10 px-4 py-2 text-sm">
      <span className="font-semibold text-gold animate-pulse-gold">
        {name}
      </span>
      <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-black">
        {discountLabel}
      </span>
      <span className="font-mono text-gold">{timeLeft}</span>
    </div>
  );
}
