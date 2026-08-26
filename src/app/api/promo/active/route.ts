import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ─── GET: Fetch first active, valid Promo Code for Storefront Banner ──
export async function GET() {
  try {
    const now = new Date();

    const activePromo = await prisma.promoCode.findFirst({
      where: {
        isActive: true,
        OR: [
          { validFrom: null },
          { validFrom: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { validUntil: null },
              { validUntil: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (!activePromo) {
      return NextResponse.json({ promo: null });
    }

    return NextResponse.json({
      promo: {
        id: activePromo.id,
        code: activePromo.code,
        discountType: activePromo.discountType,
        discountValue: Number(activePromo.discountValue),
        minOrder: Number(activePromo.minOrder),
        isActive: activePromo.isActive,
      },
    });
  } catch (error) {
    console.error("Fetch active promo error:", error);
    return NextResponse.json({ promo: null });
  }
}
