"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import translations, { type Locale, type TranslationKey } from "./translations";
import { formatPrice as baseFormatPrice } from "@/lib/utils";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
  formatPrice: (price: number | string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "casele_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Read saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === "en" || saved === "ar")) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const val = translations[locale][key];
      if (typeof val === "string") return val;
      const fallback = translations.en[key];
      if (typeof fallback === "string") return fallback;
      return key;
    },
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  const formatPrice = useCallback(
    (price: number | string): string => {
      return baseFormatPrice(price, locale);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir, formatPrice }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback for SSR or when provider is missing
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: TranslationKey) => { const v = translations.en[key]; return typeof v === "string" ? v : key; },
      formatPrice: (price: number | string) => baseFormatPrice(price, "en"),
      dir: "ltr" as const,
    };
  }
  return context;
}
