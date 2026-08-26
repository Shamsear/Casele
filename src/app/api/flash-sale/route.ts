import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const now = new Date();

    // Only return sale if isActive is TRUE AND current time is within startsAt and endsAt
    const activeSale = await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!activeSale) {
      return NextResponse.json({ sale: null });
    }

    return NextResponse.json({
      sale: {
        id: activeSale.id,
        name: activeSale.name,
        discountType: activeSale.discountType,
        discountValue: Number(activeSale.discountValue),
        startsAt: activeSale.startsAt.toISOString(),
        endsAt: activeSale.endsAt.toISOString(),
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Public flash sale query error:", error);
    return NextResponse.json({ sale: null });
  }
}
