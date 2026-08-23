/**
 * Server-side product data layer
 * Fetches products from Prisma database with caching.
 * Falls back to hardcoded data if DB is unavailable.
 */

import { prisma } from "./prisma";

// ─── Types ──────────────────────────────────────────────────────
export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  comparePrice: string | null;
  images: string[];
  badge: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  viewCount: number;
  orderCount: number;
  lastSoldAt: Date | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  categoryName: string;
  modelSlug: string;
  modelName: string;
  models: { id: string; name: string; slug: string; brand: string }[];
}

export interface ModelWithCount {
  id: string;
  brand: string;
  name: string;
  slug: string;
  count: number;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  count: number;
  salePercent: number | null;
}

// ─── Fallback hardcoded data ─────────────────────────────────────
// Used when database is not available (e.g., during build without DB)
const FALLBACK_PRODUCTS: ProductWithRelations[] = [
  {
    id: "1", name: "Midnight Black Premium Case", slug: "midnight-black-premium-case",
    description: "Crafted from premium materials, this case offers exceptional protection without compromising on style.",
    price: "79", comparePrice: "99", images: ["/images/products/midnight-black.svg", "/images/products/midnight-black-angle.svg", "/images/products/midnight-black-detail.svg"],
    badge: "bestseller", isFeatured: true, isActive: true, sortOrder: 1,
    viewCount: 234, orderCount: 89, lastSoldAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-2", categoryName: "Premium", modelSlug: "iphone-15-pro", modelName: "iPhone 15 Pro",
    models: [
      { id: "m1", name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "iPhone" },
      { id: "m2", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", brand: "iPhone" },
      { id: "m3", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", brand: "Samsung" },
    ],
  },
  {
    id: "2", name: "Gold Edge Luxe Case", slug: "gold-edge-luxe-case",
    description: "A statement piece for those who appreciate the finer things. Gold accents frame this premium case.",
    price: "129", comparePrice: null, images: ["/images/products/gold-edge.svg", "/images/products/gold-edge-angle.svg", "/images/products/gold-edge-detail.svg"],
    badge: "new", isFeatured: true, isActive: true, sortOrder: 2,
    viewCount: 156, orderCount: 34, lastSoldAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-2", categoryName: "Premium", modelSlug: "iphone-15-pro-max", modelName: "iPhone 15 Pro Max",
    models: [
      { id: "m1", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", brand: "iPhone" },
      { id: "m2", name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "iPhone" },
    ],
  },
  {
    id: "3", name: "Royal Blue Classic Case", slug: "royal-blue-classic-case",
    description: "Classic design meets modern protection. The deep royal blue color gives your phone a regal look.",
    price: "59", comparePrice: "79", images: ["/images/products/royal-blue.svg", "/images/products/royal-blue-angle.svg"],
    badge: "sale", isFeatured: false, isActive: true, sortOrder: 3,
    viewCount: 189, orderCount: 67, lastSoldAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-1", categoryName: "Classic", modelSlug: "samsung-galaxy-s24", modelName: "Samsung Galaxy S24",
    models: [
      { id: "m1", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", brand: "Samsung" },
      { id: "m2", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", brand: "Samsung" },
      { id: "m3", name: "iPhone 15", slug: "iphone-15", brand: "iPhone" },
    ],
  },
  {
    id: "4", name: "Matte Carbon Fiber Case", slug: "matte-carbon-fiber-case",
    description: "Lightweight yet incredibly strong. The carbon fiber texture adds a sporty, tech-forward aesthetic.",
    price: "89", comparePrice: null, images: ["/images/products/carbon-fiber.svg", "/images/products/carbon-fiber-angle.svg", "/images/products/carbon-fiber-detail.svg"],
    badge: null, isFeatured: true, isActive: true, sortOrder: 4,
    viewCount: 145, orderCount: 45, lastSoldAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-3", categoryName: "Sport", modelSlug: "google-pixel-8-pro", modelName: "Google Pixel 8 Pro",
    models: [
      { id: "m1", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", brand: "Google" },
      { id: "m2", name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "iPhone" },
    ],
  },
  {
    id: "5", name: "Clear Crystal Case", slug: "clear-crystal-case",
    description: "Show off your phone's original design while keeping it protected. Crystal clear, anti-yellowing material.",
    price: "49", comparePrice: null, images: ["/images/products/clear-crystal.svg", "/images/products/clear-crystal-angle.svg"],
    badge: null, isFeatured: false, isActive: true, sortOrder: 5,
    viewCount: 210, orderCount: 112, lastSoldAt: new Date(Date.now() - 30 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-1", categoryName: "Classic", modelSlug: "iphone-15-pro", modelName: "iPhone 15 Pro",
    models: [
      { id: "m1", name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "iPhone" },
      { id: "m2", name: "iPhone 15", slug: "iphone-15", brand: "iPhone" },
      { id: "m3", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", brand: "Samsung" },
    ],
  },
  {
    id: "6", name: "Rose Gold Slim Case", slug: "rose-gold-slim-case",
    description: "Ultra-slim profile with a stunning rose gold finish. Elegant protection that slips easily into your pocket.",
    price: "69", comparePrice: "89", images: ["/images/products/rose-gold.svg", "/images/products/rose-gold-angle.svg", "/images/products/rose-gold-detail.svg"],
    badge: "sale", isFeatured: false, isActive: true, sortOrder: 6,
    viewCount: 167, orderCount: 52, lastSoldAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-4", categoryName: "Designer", modelSlug: "samsung-galaxy-s24-ultra", modelName: "Samsung Galaxy S24 Ultra",
    models: [
      { id: "m1", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", brand: "Samsung" },
      { id: "m2", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", brand: "iPhone" },
    ],
  },
  {
    id: "7", name: "Forest Green Leather Case", slug: "forest-green-leather-case",
    description: "Premium leather with a rich forest green hue. Ages beautifully over time, developing a unique patina.",
    price: "119", comparePrice: null, images: ["/images/products/forest-green.svg", "/images/products/forest-green-angle.svg"],
    badge: "new", isFeatured: true, isActive: true, sortOrder: 7,
    viewCount: 98, orderCount: 23, lastSoldAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-2", categoryName: "Premium", modelSlug: "iphone-15-pro-max", modelName: "iPhone 15 Pro Max",
    models: [
      { id: "m1", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", brand: "iPhone" },
      { id: "m2", name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "iPhone" },
    ],
  },
  {
    id: "8", name: "Matte Black Armor Case", slug: "matte-black-armor-case",
    description: "Maximum protection with a tactical look. Reinforced corners and raised edges for ultimate device safety.",
    price: "99", comparePrice: null, images: ["/images/products/matte-black.svg", "/images/products/matte-black-angle.svg", "/images/products/matte-black-detail.svg"],
    badge: "bestseller", isFeatured: true, isActive: true, sortOrder: 8,
    viewCount: 178, orderCount: 61, lastSoldAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    metaTitle: null, metaDescription: null, createdAt: new Date(), updatedAt: new Date(),
    categoryId: "cat-3", categoryName: "Sport", modelSlug: "google-pixel-8-pro", modelName: "Google Pixel 8 Pro",
    models: [
      { id: "m1", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", brand: "Google" },
      { id: "m2", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", brand: "Samsung" },
      { id: "m3", name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "iPhone" },
    ],
  },
];

const FALLBACK_MODELS: ModelWithCount[] = [
  { id: "1", brand: "iPhone", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", count: 4 },
  { id: "2", brand: "iPhone", name: "iPhone 15 Pro", slug: "iphone-15-pro", count: 6 },
  { id: "3", brand: "iPhone", name: "iPhone 15", slug: "iphone-15", count: 2 },
  { id: "4", brand: "Samsung", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", count: 3 },
  { id: "5", brand: "Samsung", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", count: 4 },
  { id: "6", brand: "Google", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", count: 3 },
];

const FALLBACK_CATEGORIES: CategoryWithCount[] = [
  { id: "cat-1", name: "Classic", slug: "classic", description: "Timeless elegance", count: 2, salePercent: null },
  { id: "cat-2", name: "Premium", slug: "premium", description: "Luxury materials", count: 3, salePercent: null },
  { id: "cat-3", name: "Sport", slug: "sport", description: "Active lifestyle", count: 2, salePercent: null },
  { id: "cat-4", name: "Designer", slug: "designer", description: "Limited editions", count: 1, salePercent: null },
];

const FALLBACK_ORDERS = [
  { id: "ORD-248", customerName: "John D.", customerPhone: "97455123456", items: [{ name: "Midnight Black Case", model: "iPhone 15 Pro", qty: 1, price: 79 }], subtotal: 79, tierDiscount: 0, flashDiscount: 0, promoDiscount: 0, bundleDiscount: 0, total: 79, status: "pending", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), address: "Doha" },
  { id: "ORD-247", customerName: "Fatima K.", customerPhone: "97455234567", items: [{ name: "Gold Edge Luxe", model: "iPhone 15 Pro Max", qty: 1, price: 129 }], subtotal: 129, tierDiscount: 0, flashDiscount: 0, promoDiscount: 0, bundleDiscount: 0, total: 129, status: "confirmed", createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), address: "Doha" },
  { id: "ORD-246", customerName: "Ahmed S.", customerPhone: "97455345678", items: [{ name: "Royal Blue Classic", model: "Samsung S24", qty: 1, price: 59 }], subtotal: 59, tierDiscount: 0, flashDiscount: 0, promoDiscount: 0, bundleDiscount: 0, total: 59, status: "dispatched", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), address: "Al Wakrah" },
  { id: "ORD-245", customerName: "Sara M.", customerPhone: "97455456789", items: [{ name: "Clear Crystal", model: "iPhone 15 Pro", qty: 1, price: 49 }], subtotal: 49, tierDiscount: 0, flashDiscount: 0, promoDiscount: 0, bundleDiscount: 0, total: 49, status: "delivered", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), address: "Doha" },
  { id: "ORD-244", customerName: "Omar H.", customerPhone: "97455567890", items: [{ name: "Matte Black Armor", model: "Pixel 8 Pro", qty: 1, price: 99 }], subtotal: 99, tierDiscount: 0, flashDiscount: 0, promoDiscount: 0, bundleDiscount: 0, total: 99, status: "confirmed", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), address: "Al Khor" },
  { id: "ORD-243", customerName: "Neha G.", customerPhone: "97455678901", items: [{ name: "Forest Green Leather", model: "iPhone 15 Pro Max", qty: 1, price: 119 }], subtotal: 119, tierDiscount: 0, flashDiscount: 0, promoDiscount: 0, bundleDiscount: 0, total: 119, status: "pending", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), address: "Doha" },
];

// ─── Helper: try DB, fall back ──────────────────────────────────
async function tryDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("DB query failed, using fallback:", error);
    return fallback;
  }
}

// ─── Product queries ─────────────────────────────────────────────

export async function getAllProducts(): Promise<ProductWithRelations[]> {
  return tryDb(async () => {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        productModels: {
          include: { model: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price.toString(),
      comparePrice: p.comparePrice?.toString() ?? null,
      images: p.images.length > 0 ? p.images : ["/images/products/midnight-black.svg"],
      badge: p.badge,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
      viewCount: p.viewCount,
      orderCount: p.orderCount,
      lastSoldAt: p.lastSoldAt,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? "Uncategorized",
      modelSlug: p.productModels[0]?.model.slug ?? "iphone-15-pro",
      modelName: p.productModels[0]?.model.modelName ?? "Unknown",
      models: p.productModels.map((pm) => ({
        id: pm.model.id,
        name: pm.model.modelName,
        slug: pm.model.slug,
        brand: pm.model.brand,
      })),
    }));
  }, FALLBACK_PRODUCTS);
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.isFeatured).slice(0, 8);
}

export async function getProductsByModel(modelSlug: string): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  return products.filter(
    (p) => p.modelSlug === modelSlug || p.models.some((m) => m.slug === modelSlug)
  );
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.categoryName.toLowerCase().includes(categorySlug));
}

export async function getRelatedProducts(productId: string, modelSlug: string, limit = 4): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  const current = products.find((p) => p.id === productId);
  if (!current) return products.slice(0, limit);

  // First try same model, different product
  const sameModel = products.filter(
    (p) => p.id !== productId && p.models.some((m) => m.slug === modelSlug)
  );
  if (sameModel.length >= limit) return sameModel.slice(0, limit);

  // Fill with same category
  const sameCategory = products.filter(
    (p) => p.id !== productId && p.categoryId === current.categoryId && !sameModel.includes(p)
  );
  const combined = [...sameModel, ...sameCategory];
  if (combined.length >= limit) return combined.slice(0, limit);

  // Fill with any other products
  const remaining = products.filter(
    (p) => p.id !== productId && !combined.includes(p)
  );
  return [...combined, ...remaining].slice(0, limit);
}

// ─── Model queries ───────────────────────────────────────────────

export async function getAllModels(): Promise<ModelWithCount[]> {
  return tryDb(async () => {
    const models = await prisma.phoneModel.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { product: { isActive: true } },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return models.map((m) => ({
      id: m.id,
      brand: m.brand,
      name: m.modelName,
      slug: m.slug,
      count: m.products.length,
    }));
  }, FALLBACK_MODELS);
}

export async function getModelBySlug(slug: string): Promise<ModelWithCount | null> {
  const models = await getAllModels();
  return models.find((m) => m.slug === slug) ?? null;
}

// ─── Category queries ────────────────────────────────────────────

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  return tryDb(async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      count: c.products.length,
      salePercent: c.salePercent,
    }));
  }, FALLBACK_CATEGORIES);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

// ─── Order queries ───────────────────────────────────────────────

export async function getOrdersByPhone(phone: string) {
  return tryDb(async () => {
    const orders = await prisma.order.findMany({
      where: { customerPhone: phone },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      items: o.items as { name: string; model: string; qty: number; price: number }[],
      subtotal: Number(o.subtotal),
      tierDiscount: Number(o.tierDiscount),
      flashDiscount: Number(o.flashDiscount),
      promoDiscount: Number(o.promoDiscount),
      bundleDiscount: Number(o.bundleDiscount),
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      address: o.address,
    }));
  }, FALLBACK_ORDERS.filter((o) => o.customerPhone === phone));
}

// ─── Search ──────────────────────────────────────────────────────

export async function searchProducts(query: string): Promise<ProductWithRelations[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const products = await getAllProducts();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.modelName.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
  );
}

// ─── Admin queries ───────────────────────────────────────────────

export async function getAdminStats() {
  return tryDb(async () => {
    const [totalProducts, totalOrders, totalCustomers, recentOrders] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.findMany({
        select: { customerPhone: true },
        distinct: ["customerPhone"],
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
    });

    const topProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { orderCount: "desc" },
      take: 5,
    });

    return {
      totalProducts,
      totalOrders,
      totalCustomers: totalCustomers.length,
      totalRevenue: Number(totalRevenue._sum.total ?? 0),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        items: o.items as { name: string; model: string; qty: number; price: number }[],
      })),
      topProducts: topProducts.map((p) => ({
        id: p.id,
        name: p.name,
        orderCount: p.orderCount,
        price: Number(p.price),
      })),
    };
  }, null);
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  address?: string;
  items: { productId: string; name: string; model: string; qty: number; price: number }[];
  subtotal: number;
  tierDiscount?: number;
  flashDiscount?: number;
  promoDiscount?: number;
  bundleDiscount?: number;
  promoCode?: string;
  total: number;
}) {
  return tryDb(async () => {
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        items: data.items as any,
        subtotal: data.subtotal,
        tierDiscount: data.tierDiscount ?? 0,
        flashDiscount: data.flashDiscount ?? 0,
        promoDiscount: data.promoDiscount ?? 0,
        bundleDiscount: data.bundleDiscount ?? 0,
        total: data.total,
        status: "pending",
      },
    });

    // Increment order counts for products
    for (const item of data.items) {
      try {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            orderCount: { increment: item.qty },
            lastSoldAt: new Date(),
          },
        });
      } catch {
        // Product may not exist in DB, continue
      }
    }

    return order;
  }, null);
}

// ─── Category page helper ────────────────────────────────────────

export async function getProductsByCategorySlug(categorySlug: string): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  return products.filter((p) => {
    const catSlug = p.categoryName.toLowerCase().replace(/\s+/g, "-").replace("-collection", "");
    return catSlug === categorySlug || p.categoryName.toLowerCase().includes(categorySlug);
  });
}
