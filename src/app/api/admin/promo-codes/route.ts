import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// ─── GET: Fetch all Promo Codes ────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`promos-get:${ip}`, RATE_LIMITS.api);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      promos: promos.map((p) => ({
        id: p.id,
        code: p.code,
        discountType: p.discountType,
        discountValue: Number(p.discountValue),
        minOrder: Number(p.minOrder),
        maxUses: p.maxUses,
        usedCount: p.usedCount,
        isActive: p.isActive,
      })),
    });
  } catch (error) {
    console.error("Fetch promos error:", error);
    return NextResponse.json({ error: "Failed to fetch promo codes", promos: [] }, { status: 500 });
  }
}

// ─── POST: Create Promo Code ───────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, discountType, discountValue, minOrder, maxUses, isActive = true } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanCode = String(code).trim().toUpperCase();

    const newPromo = await prisma.promoCode.create({
      data: {
        code: cleanCode,
        discountType: discountType === "flat" ? "flat" : "percentage",
        discountValue: Number(discountValue),
        minOrder: Number(minOrder || 0),
        maxUses: maxUses ? Number(maxUses) : null,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      promo: {
        id: newPromo.id,
        code: newPromo.code,
        discountType: newPromo.discountType,
        discountValue: Number(newPromo.discountValue),
        minOrder: Number(newPromo.minOrder),
        maxUses: newPromo.maxUses,
        usedCount: newPromo.usedCount,
        isActive: newPromo.isActive,
      },
    });
  } catch (error) {
    console.error("Create promo error:", error);
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
  }
}

// ─── PUT: Update Promo Code & Toggle Active/Deactive ──────────
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, code, discountType, discountValue, minOrder, maxUses, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing promo ID" }, { status: 400 });
    }

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(code && { code: String(code).trim().toUpperCase() }),
        ...(discountType && { discountType: discountType === "flat" ? "flat" : "percentage" }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(minOrder !== undefined && { minOrder: Number(minOrder) }),
        ...(maxUses !== undefined && { maxUses: maxUses ? Number(maxUses) : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({
      success: true,
      promo: {
        id: updated.id,
        code: updated.code,
        discountType: updated.discountType,
        discountValue: Number(updated.discountValue),
        minOrder: Number(updated.minOrder),
        maxUses: updated.maxUses,
        usedCount: updated.usedCount,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error("Update promo error:", error);
    return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 });
  }
}

// ─── DELETE: Delete Promo Code ─────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing promo ID" }, { status: 400 });
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete promo error:", error);
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
