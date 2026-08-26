import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

const SAMPLE_MODELS = [
  { id: "model-1", brand: "iPhone", modelName: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", productsCount: 12, isActive: true },
  { id: "model-2", brand: "iPhone", modelName: "iPhone 15 Pro", slug: "iphone-15-pro", productsCount: 10, isActive: true },
  { id: "model-3", brand: "iPhone", modelName: "iPhone 15", slug: "iphone-15", productsCount: 8, isActive: true },
  { id: "model-4", brand: "Samsung", modelName: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", productsCount: 8, isActive: true },
  { id: "model-5", brand: "Samsung", modelName: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", productsCount: 7, isActive: true },
  { id: "model-6", brand: "Google", modelName: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", productsCount: 5, isActive: true },
];

// ─── GET: Fetch all Phone Models ───────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`models-get:${ip}`, RATE_LIMITS.api);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    try {
      const models = await prisma.phoneModel.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: [{ brand: "asc" }, { sortOrder: "asc" }],
      });

      if (models.length > 0) {
        return NextResponse.json({
          models: models.map((m) => ({
            id: m.id,
            brand: m.brand,
            modelName: m.modelName,
            slug: m.slug,
            imageUrl: m.imageUrl,
            isActive: m.isActive,
            productsCount: m._count?.products || 0,
          })),
        });
      }
    } catch (e) {
      console.warn("DB models fetch failed, returning sample:", e);
    }

    return NextResponse.json({ models: SAMPLE_MODELS });
  } catch (error) {
    console.error("Fetch models error:", error);
    return NextResponse.json({ error: "Failed to fetch phone models" }, { status: 500 });
  }
}

// ─── POST: Create Phone Model ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { brand, modelName, slug, imageUrl, isActive } = body;

    if (!brand || !modelName || !slug) {
      return NextResponse.json({ error: "Brand, Model Name, and Slug are required" }, { status: 400 });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const newModel = await prisma.phoneModel.create({
      data: {
        brand: String(brand).trim(),
        modelName: String(modelName).trim(),
        slug: cleanSlug,
        imageUrl: imageUrl || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      model: {
        id: newModel.id,
        brand: newModel.brand,
        modelName: newModel.modelName,
        slug: newModel.slug,
        imageUrl: newModel.imageUrl,
        isActive: newModel.isActive,
        productsCount: 0,
      },
    });
  } catch (error) {
    console.error("Create model error:", error);
    return NextResponse.json({ error: "Failed to create phone model" }, { status: 500 });
  }
}

// ─── PUT: Update Phone Model ───────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, brand, modelName, slug, imageUrl, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing model ID" }, { status: 400 });
    }

    const updated = await prisma.phoneModel.update({
      where: { id },
      data: {
        ...(brand && { brand: String(brand).trim() }),
        ...(modelName && { modelName: String(modelName).trim() }),
        ...(slug && { slug: String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({
      success: true,
      model: updated,
    });
  } catch (error) {
    console.error("Update model error:", error);
    return NextResponse.json({ error: "Failed to update phone model" }, { status: 500 });
  }
}

// ─── DELETE: Delete Phone Model ────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing model ID" }, { status: 400 });
    }

    await prisma.phoneModel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete model error:", error);
    return NextResponse.json({ error: "Failed to delete phone model" }, { status: 500 });
  }
}
