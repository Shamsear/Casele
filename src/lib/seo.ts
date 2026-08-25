/**
 * SEO Constants and Helpers
 * Centralised configuration for all SEO-related values.
 */

export const SITE = {
  name: "CASELÉ",
  title: "CASELÉ — Luxury Phone Protection in Qatar",
  description:
    "Protect. Express. Elevate. Premium mobile phone cases designed for style and durability. Shop iPhone, Samsung, & Pixel cases in Doha, Qatar.",
  url: "https://casele.qa",
  locale: "en_QA",
  type: "website" as const,
  twitter: "@casele_qa",
  instagram: "https://www.instagram.com/casele_premium_mobile_case?igsi=MW55cTM4MmN6dGF3ag%3D%3D&utm_source=qr",
  phone: "+97455364455",
  email: "info@casele.qa",
  address: {
    street: "Doha",
    city: "Doha",
    region: "Ad Dawhah",
    country: "QA",
    postal: "",
  },
  geo: {
    latitude: "25.2854",
    longitude: "51.5310",
  },
  keywords: [
    "phone cases Qatar",
    "premium cases Doha",
    "mobile accessories Qatar",
    "iPhone case Qatar",
    "Samsung case Doha",
    "Google Pixel case Qatar",
    "phone covers Qatar",
    "luxury phone cases",
    "WhatsApp order phone case",
  ],
};

/**
 * Build absolute URL from path
 */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path}`;
}

/**
 * Truncate text for meta descriptions (max 160 chars)
 */
export function truncate(str: string, max = 160): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3).trimEnd() + "...";
}

/**
 * Generate product meta title
 */
export function productMetaTitle(name: string, model: string): string {
  return `${name} for ${model} | ${SITE.name} Qatar`;
}

/**
 * Generate product meta description
 */
export function productMetaDescription(
  name: string,
  model: string,
  price: string,
): string {
  return truncate(
    `Buy ${name} case for ${model} in Qatar. Premium protection, stylish design. Only QR ${price}. Fast delivery in Doha. Order on WhatsApp.`,
  );
}

/**
 * Generate category meta title
 */
export function categoryMetaTitle(name: string): string {
  return `${name} Phone Cases | ${SITE.name} Qatar`;
}

/**
 * Generate model meta title
 */
export function modelMetaTitle(model: string): string {
  return `${model} Cases | ${SITE.name} Qatar`;
}
