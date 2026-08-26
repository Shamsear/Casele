/**
 * Server-side product data layer
 * Directly queries Prisma PostgreSQL database.
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
  stock: number;
  inStock: boolean;
  models: { id: string; name: string; slug: string; brand: string; stock: number }[];
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

// ─── Product queries ─────────────────────────────────────────────

export async function getAllProducts(): Promise<ProductWithRelations[]> {
  try {
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

    return products.map((p) => {
      const models = p.productModels.map((pm) => ({
        id: pm.model.id,
        name: pm.model.modelName,
        slug: pm.model.slug,
        brand: pm.model.brand,
        stock: pm.stock,
      }));
      const totalStock = models.reduce((acc, m) => acc + (m.stock || 0), 0);

      return {
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
        modelSlug: p.productModels[0]?.model.slug ?? "",
        modelName: p.productModels[0]?.model.modelName ?? "",
        stock: totalStock,
        inStock: totalStock > 0,
        models,
      };
    });
  } catch (error) {
    console.error("getAllProducts query error:", error);
    return [];
  }
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
  return products.filter((p) => p.categoryName.toLowerCase().includes(categorySlug.toLowerCase()));
}

export async function getRelatedProducts(productId: string, modelSlug: string, limit = 4): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  const current = products.find((p) => p.id === productId);
  if (!current) return products.slice(0, limit);

  const sameModel = products.filter(
    (p) => p.id !== productId && p.models.some((m) => m.slug === modelSlug)
  );
  if (sameModel.length >= limit) return sameModel.slice(0, limit);

  const sameCategory = products.filter(
    (p) => p.id !== productId && p.categoryId === current.categoryId && !sameModel.includes(p)
  );
  const combined = [...sameModel, ...sameCategory];
  if (combined.length >= limit) return combined.slice(0, limit);

  const remaining = products.filter(
    (p) => p.id !== productId && !combined.includes(p)
  );
  return [...combined, ...remaining].slice(0, limit);
}

// ─── Model queries ───────────────────────────────────────────────

export async function getAllModels(): Promise<ModelWithCount[]> {
  try {
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
  } catch (error) {
    console.error("getAllModels query error:", error);
    return [];
  }
}

export async function getModelBySlug(slug: string): Promise<ModelWithCount | null> {
  const models = await getAllModels();
  return models.find((m) => m.slug === slug) ?? null;
}

// ─── Category queries ────────────────────────────────────────────

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  try {
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
  } catch (error) {
    console.error("getAllCategories query error:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

// ─── Order queries ───────────────────────────────────────────────

export async function getOrdersByPhone(phone: string) {
  try {
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
  } catch (error) {
    console.error("getOrdersByPhone query error:", error);
    return [];
  }
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
  try {
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
      where: { status: { not: "cancelled" } },
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
  } catch (error) {
    console.error("getAdminStats query error:", error);
    return null;
  }
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
  try {
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
        // Continue
      }
    }

    return order;
  } catch (error) {
    console.error("createOrder error:", error);
    return null;
  }
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<ProductWithRelations[]> {
  const products = await getAllProducts();
  return products.filter((p) => {
    const catSlug = p.categoryName.toLowerCase().replace(/\s+/g, "-").replace("-collection", "");
    return catSlug === categorySlug || p.categoryName.toLowerCase().includes(categorySlug);
  });
}
