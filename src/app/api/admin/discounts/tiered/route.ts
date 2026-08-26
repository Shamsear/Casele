import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
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
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}

// ─── POST: Create New Tiered Discount ──────────────────────────
export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
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
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // 1. Support Master Toggle All Tiers
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

    // 2. Direct ID update (if real database UUID)
    if (id && !id.startsWith("default-tier")) {
      try {
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
      } catch (err) {
        console.warn("Direct ID update failed, attempting minAmount match:", err);
      }
    }

    // 3. Match or Upsert by minAmount
    if (minAmount !== undefined) {
      const numMinAmount = Number(minAmount);
      const existing = await prisma.tierDiscount.findFirst({
        where: { minAmount: numMinAmount },
      });

      if (existing) {
        const updated = await prisma.tierDiscount.update({
          where: { id: existing.id },
          data: {
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
      } else {
        const created = await prisma.tierDiscount.create({
          data: {
            minAmount: numMinAmount,
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
      }
    }

    return NextResponse.json({ error: "Missing tier ID or minAmount" }, { status: 400 });
  } catch (error) {
    console.error("Update tier error:", error);
    return NextResponse.json({ error: "Failed to update tiered discount in database" }, { status: 500 });
  }
}

// ─── DELETE: Remove Tiered Discount ────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
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
