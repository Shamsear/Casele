"use client";

import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full border border-white/80 bg-white/80 backdrop-blur-md px-3 text-xs font-semibold text-neutral-800 transition-all duration-200 hover:border-neutral-400 hover:bg-white hover:text-neutral-950 hover:shadow-2xs active:scale-95 cursor-pointer select-none",
        className
      )}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <Globe className="h-3.5 w-3.5 text-neutral-500" />
      <span className="font-mono text-[11px] font-bold">{locale === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
