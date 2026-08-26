import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// ─── GET: Fetch all Categories directly from PostgreSQL ────────
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(
      {
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
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// ─── POST: Create Category ─────────────────────────────────────
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
