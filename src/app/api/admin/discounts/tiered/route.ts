import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// ─── GET: Fetch all Tiered Discounts from Database ─────────────
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`discounts-get:${ip}`, RATE_LIMITS.api);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    try {
      let tiers = await prisma.tierDiscount.findMany({
        orderBy: { minAmount: "asc" },
      });

      // If database has 0 tiers, seed default tiers into PostgreSQL
      if (tiers.length === 0) {
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
      }

      return NextResponse.json({
        tiers: tiers.map((t) => ({
          id: t.id,
          minAmount: Number(t.minAmount),
          discountPercent: t.discountPercent,
          isActive: t.isActive,
          sortOrder: t.sortOrder,
        })),
      });
    } catch (e) {
      console.warn("DB tier discounts fetch failed:", e);
      return NextResponse.json({ tiers: [] });
    }
  } catch (error) {
    console.error("Fetch tiers error:", error);
    return NextResponse.json({ error: "Failed to fetch tiered discounts" }, { status: 500 });
  }
}

// ─── POST: Create New Tiered Discount ──────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
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
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, minAmount, discountPercent, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing tier ID" }, { status: 400 });
    }

    const updated = await prisma.tierDiscount.update({
      where: { id },
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
  } catch (error) {
    console.error("Update tier error:", error);
    return NextResponse.json({ error: "Failed to update tiered discount" }, { status: 500 });
  }
}

// ─── DELETE: Remove Tiered Discount ────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing tier ID" }, { status: 400 });
    }

    await prisma.tierDiscount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tier error:", error);
    return NextResponse.json({ error: "Failed to delete tiered discount" }, { status: 500 });
  }
}
