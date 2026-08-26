/**
 * Store settings helper
 * Fetches settings from database with fallback to defaults
 */

import { prisma } from "./db/prisma";

// Default settings (used as fallback if DB is unavailable)
const DEFAULTS: Record<string, string> = {
  store_name: "CASELÉ",
  store_email: "info@casele.qa",
  whatsapp_number: "+97455364455",
  currency: "QAR",
  tax_rate: "0",
  meta_title: "CASELÉ — Premium Phone Cases in Qatar",
  meta_description: "Premium mobile phone cases designed for style and durability.",
  instagram: "https://www.instagram.com/casele_premium_mobile_case?igsi=MW55cTM4MmN6dGF3ag%3D%3D&utm_source=qr",
  website: "www.casele.co",
};

// Cache for settings (expires after 5 minutes)
let settingsCache: Record<string, string> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get a single setting value
 */
export async function getSetting(key: string): Promise<string> {
  const settings = await getAllSettings();
  return settings[key] ?? DEFAULTS[key] ?? "";
}

/**
 * Get all settings (with caching)
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  // Return cache if valid
  if (settingsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return settingsCache;
  }

  try {
    const dbSettings = await prisma.setting.findMany();
    const settingsObj: Record<string, string> = {};
    
    dbSettings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    // Merge with defaults (DB takes precedence)
    settingsCache = { ...DEFAULTS, ...settingsObj };
    cacheTimestamp = Date.now();

    return settingsCache;
  } catch (error) {
    console.error("Failed to fetch settings from DB:", error);
    // Return defaults if DB unavailable
    return DEFAULTS;
  }
}

/**
 * Get Bundle Discount Configuration from dedicated table
 */
export async function getBundleDiscountConfig(): Promise<{
  buy2Percent: number;
  buy3Percent: number;
  isActive: boolean;
}> {
  try {
    const config = await prisma.bundleDiscountConfig.findFirst();
    if (config) {
      return {
        buy2Percent: config.buy2Percent,
        buy3Percent: config.buy3Percent,
        isActive: config.isActive,
      };
    }
  } catch (e) {
    console.warn("Failed to fetch bundle discount config:", e);
  }

  // Fallback to settings / defaults
  const settings = await getAllSettings();
  return {
    buy2Percent: Number(settings.bundle_buy_2_discount || 5),
    buy3Percent: Number(settings.bundle_buy_3_discount || 10),
    isActive: settings.bundle_discounts_enabled !== "false",
  };
}

/**
 * Get Delivery Configuration from dedicated table
 */
export async function getDeliveryConfig(): Promise<{
  freeThreshold: number;
  expressFee: number;
  isFreeDeliveryActive: boolean;
}> {
  try {
    const config = await prisma.deliveryConfig.findFirst();
    if (config) {
      return {
        freeThreshold: Number(config.freeThreshold),
        expressFee: Number(config.expressFee),
        isFreeDeliveryActive: config.isFreeDeliveryActive,
      };
    }
  } catch (e) {
    console.warn("Failed to fetch delivery config:", e);
  }

  // Fallback to settings / defaults
  const settings = await getAllSettings();
  return {
    freeThreshold: Number(settings.free_delivery_threshold || 100),
    expressFee: Number(settings.express_delivery_fee || 20),
    isFreeDeliveryActive: settings.free_delivery_enabled !== "false",
  };
}

/**
 * Get WhatsApp number (convenience function)
 */
export async function getWhatsAppNumber(): Promise<string> {
  return getSetting("whatsapp_number");
}

/**
 * Clear settings cache (call after updating settings)
 */
export function clearSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Synchronous getter for client components (uses cache or defaults)
 * Note: For SSR, prefer the async version
 */
export function getSettingsSync(): Record<string, string> {
  return settingsCache ?? DEFAULTS;
}
