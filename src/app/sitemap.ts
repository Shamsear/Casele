import { MetadataRoute } from "next";
import { PRODUCTS, MODELS, CATEGORIES } from "@/lib/data";

const BASE_URL = "https://casele.qa";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages with highest priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/track`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Model pages — high priority for device-specific searches
  const modelPages: MetadataRoute.Sitemap = MODELS.map((model) => ({
    url: `${BASE_URL}/shop/${model.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Product pages — highest priority for transactional searches
  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${BASE_URL}/shop/${product.modelSlug}/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...modelPages, ...productPages, ...categoryPages];
}
