import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

const SAMPLE_CATEGORIES = [
  { id: "cat-1", name: "Classic Collection", slug: "classic", description: "Minimalist precision-molded luxury cases", productsCount: 8, salePercent: null, isActive: true },
  { id: "cat-2", name: "Luxe Series", slug: "premium", description: "Aerospace composite cases with metallic accents", productsCount: 12, salePercent: 15, isActive: true },
  { id: "cat-3", name: "Sport Shield", slug: "sport", description: "Shockproof heavy-duty armor for active lifestyles", productsCount: 6, salePercent: null, isActive: true },
  { id: "cat-4", name: "Designer Atelier", slug: "designer", description: "Bespoke handcrafted limited editions", productsCount: 4, salePercent: 10, isActive: true },
];

// ─── GET: Fetch all Categories ─────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`categories-get:${ip}`, RATE_LIMITS.api);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { sortOrder: "asc" },
      });

      if (categories.length > 0) {
        return NextResponse.json({
          categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageUrl: c.imageUrl,
            salePercent: c.salePercent,
            sortOrder: c.sortOrder,
            isActive: c.isActive,
            productsCount: c._count?.products || 0,
          })),
        });
      }
    } catch (e) {
      console.warn("DB categories fetch failed, returning sample:", e);
    }

    return NextResponse.json({ categories: SAMPLE_CATEGORIES });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// ─── POST: Create Category ─────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, imageUrl, salePercent, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const newCat = await prisma.category.create({
      data: {
        name: String(name).trim(),
        slug: cleanSlug,
        description: description || null,
        imageUrl: imageUrl || null,
        salePercent: salePercent ? Number(salePercent) : null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      category: {
        id: newCat.id,
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        imageUrl: newCat.imageUrl,
        salePercent: newCat.salePercent,
        isActive: newCat.isActive,
        productsCount: 0,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// ─── PUT: Update Category ──────────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, slug, description, imageUrl, salePercent, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing category ID" }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(slug && { slug: String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") }),
        ...(description !== undefined && { description: description || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(salePercent !== undefined && { salePercent: salePercent ? Number(salePercent) : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({
      success: true,
      category: updated,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// ─── DELETE: Delete Category ───────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing category ID" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
