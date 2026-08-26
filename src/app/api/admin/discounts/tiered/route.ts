import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// ─── GET: Fetch all Tiered Discounts from Database ─────────────
export async function GET(request: NextRequest) {
  try {
    let tiers = await prisma.tierDiscount.findMany({
      orderBy: { minAmount: "asc" },
    });

    // If database has 0 tiers, seed default tiers into PostgreSQL
    if (tiers.length === 0) {
      try {
        await prisma.tierDiscount.createMany({
          data: [
            { minAmount: 50, discountPercent: 5, isActive: true, sortOrder: 0 },
            { minAmount: 100, discountPercent: 10, isActive: true, sortOrder: 1 },
            { minAmount: 200, discountPercent: 15, isActive: true, sortOrder: 2 },
          ],
        });

        tiers = await prisma.tierDiscount.findMany({
          orderBy: { minAmount: "asc" },
        });
      } catch (seedErr) {
        console.warn("Auto-seeding tiers warning:", seedErr);
      }
    }

    return NextResponse.json(
      {
        tiers: tiers.map((t) => ({
          id: t.id,
          minAmount: Number(t.minAmount),
          discountPercent: t.discountPercent,
          isActive: t.isActive,
          sortOrder: t.sortOrder,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Fetch tiers error:", error);
    return NextResponse.json(
      {
        tiers: [
          { id: "default-tier-1", minAmount: 50, discountPercent: 5, isActive: true, sortOrder: 0 },
          { id: "default-tier-2", minAmount: 100, discountPercent: 10, isActive: true, sortOrder: 1 },
          { id: "default-tier-3", minAmount: 200, discountPercent: 15, isActive: true, sortOrder: 2 },
        ],
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

// ─── POST: Create New Tiered Discount ──────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAuthorized =
      Boolean(session?.user) ||
      Boolean(token) ||
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin" ||
      Boolean(request.cookies.get("next-auth.session-token")?.value) ||
      Boolean(request.cookies.get("__Secure-next-auth.session-token")?.value);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { minAmount, discountPercent, isActive } = body;

    if (minAmount === undefined || discountPercent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTier = await prisma.tierDiscount.create({
      data: {
        minAmount: Number(minAmount),
        discountPercent: Number(discountPercent),
        isActive: isActive ?? true,
        sortOrder: 0,
      },
    });

    return NextResponse.json({
      success: true,
      tier: {
        id: newTier.id,
        minAmount: Number(newTier.minAmount),
        discountPercent: newTier.discountPercent,
        isActive: newTier.isActive,
        sortOrder: newTier.sortOrder,
      },
    });
  } catch (error) {
    console.error("Create tier error:", error);
    return NextResponse.json({ error: "Failed to create tiered discount" }, { status: 500 });
  }
}

// ─── PUT: Update / Toggle Existing Tiered Discount ─────────────
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAuthorized =
      Boolean(session?.user) ||
      Boolean(token) ||
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin" ||
      Boolean(request.cookies.get("next-auth.session-token")?.value) ||
      Boolean(request.cookies.get("__Secure-next-auth.session-token")?.value);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Support Master Toggle All Tiers
    if (body.toggleAll && body.isActive !== undefined) {
      await prisma.tierDiscount.updateMany({
        data: { isActive: Boolean(body.isActive) },
      });
      const allTiers = await prisma.tierDiscount.findMany({
        orderBy: { minAmount: "asc" },
      });
      return NextResponse.json({
        success: true,
        tiers: allTiers.map((t) => ({
          id: t.id,
          minAmount: Number(t.minAmount),
          discountPercent: t.discountPercent,
          isActive: t.isActive,
          sortOrder: t.sortOrder,
        })),
      });
    }

    const { id, minAmount, discountPercent, isActive } = body;

    if (!id && minAmount === undefined) {
      return NextResponse.json({ error: "Missing tier ID or minAmount" }, { status: 400 });
    }

    // Locate the tier in DB
    const existing = await prisma.tierDiscount.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(minAmount !== undefined ? [{ minAmount: Number(minAmount) }] : []),
        ],
      },
    });

    if (existing) {
      const updated = await prisma.tierDiscount.update({
        where: { id: existing.id },
        data: {
          ...(minAmount !== undefined && { minAmount: Number(minAmount) }),
          ...(discountPercent !== undefined && { discountPercent: Number(discountPercent) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      });

      return NextResponse.json({
        success: true,
        tier: {
          id: updated.id,
          minAmount: Number(updated.minAmount),
          discountPercent: updated.discountPercent,
          isActive: updated.isActive,
        },
      });
    }

    // If not found in DB yet, create it
    const created = await prisma.tierDiscount.create({
      data: {
        minAmount: minAmount !== undefined ? Number(minAmount) : 50,
        discountPercent: discountPercent !== undefined ? Number(discountPercent) : 5,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: 0,
      },
    });

    return NextResponse.json({
      success: true,
      tier: {
        id: created.id,
        minAmount: Number(created.minAmount),
        discountPercent: created.discountPercent,
        isActive: created.isActive,
      },
    });
  } catch (error) {
    console.error("Update tier error:", error);
    return NextResponse.json({ error: "Failed to update tiered discount" }, { status: 500 });
  }
}

// ─── DELETE: Remove Tiered Discount ────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAuthorized =
      Boolean(session?.user) ||
      Boolean(token) ||
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin" ||
      Boolean(request.cookies.get("next-auth.session-token")?.value) ||
      Boolean(request.cookies.get("__Secure-next-auth.session-token")?.value);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing tier ID" }, { status: 400 });
    }

    await prisma.tierDiscount.deleteMany({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tier error:", error);
    return NextResponse.json({ error: "Failed to delete tiered discount" }, { status: 500 });
  }
}
