import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// ─── GET: Fetch all Phone Models directly from PostgreSQL ──────
export async function GET(request: NextRequest) {
  try {
    const models = await prisma.phoneModel.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ brand: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(
      {
        models: models.map((m) => ({
          id: m.id,
          brand: m.brand,
          modelName: m.modelName,
          slug: m.slug,
          imageUrl: m.imageUrl,
          isActive: m.isActive,
          productsCount: m._count?.products || 0,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Fetch models error:", error);
    return NextResponse.json({ error: "Failed to fetch phone models" }, { status: 500 });
  }
}

// ─── POST: Create Phone Model ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAuthorized =
      Boolean(session?.user) ||
      Boolean(token) ||
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { brand, modelName, slug, imageUrl, isActive, sortOrder } = body;

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
        sortOrder: sortOrder ? Number(sortOrder) : 0,
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
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAuthorized =
      Boolean(session?.user) ||
      Boolean(token) ||
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, brand, modelName, slug, imageUrl, isActive, sortOrder } = body;

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
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
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
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAuthorized =
      Boolean(session?.user) ||
      Boolean(token) ||
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin";

    if (!isAuthorized) {
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
