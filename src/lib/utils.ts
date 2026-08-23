import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, locale: "en" | "ar" = "en"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-QA" : "en-QA", {
    style: "currency",
    currency: "QAR",
    maximumFractionDigits: 0,
  }).format(num);
  // Always use English numerals (0-9), never Arabic-Indic (٠-٩)
  return formatted.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDiscountPercent(
  price: number | string,
  comparePrice: number | string | null
): number {
  if (!comparePrice) return 0;
  const p = typeof price === "string" ? parseFloat(price) : price;
  const cp = typeof comparePrice === "string" ? parseFloat(comparePrice) : comparePrice;
  if (cp <= p) return 0;
  return Math.round(((cp - p) / cp) * 100);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return d.toLocaleDateString("en-IN");
}
