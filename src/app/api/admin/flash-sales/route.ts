import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ─── GET: Fetch All Flash Sales from Database ──────────────────
export async function GET(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sales = await prisma.flashSale.findMany({
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const formatted = sales.map((s) => {
      const starts = new Date(s.startsAt);
      const ends = new Date(s.endsAt);
      let timingStatus: "live" | "upcoming" | "expired" | "deactivated" = "live";

      if (!s.isActive) {
        timingStatus = "deactivated";
      } else if (now < starts) {
        timingStatus = "upcoming";
      } else if (now > ends) {
        timingStatus = "expired";
      } else {
        timingStatus = "live";
      }

      return {
        id: s.id,
        name: s.name,
        discountType: s.discountType,
        discountValue: Number(s.discountValue),
        appliesTo: s.appliesTo,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        isActive: s.isActive,
        timingStatus,
      };
    });

    return NextResponse.json(
      { sales: formatted },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Fetch flash sales error:", error);
    return NextResponse.json({ error: "Failed to fetch flash sales" }, { status: 500 });
  }
}

// ─── POST: Create Date & Time Based Sale in Database ───────────
export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, discountType, discountValue, startsAt, endsAt, isActive = true } = body;

    if (!name || !discountValue || !startsAt || !endsAt) {
      return NextResponse.json({ error: "Name, discount value, start date/time, and end date/time are required" }, { status: 400 });
    }

    const created = await prisma.flashSale.create({
      data: {
        name: String(name).trim(),
        discountType: discountType || "percentage",
        discountValue: Number(discountValue),
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, sale: created });
  } catch (error) {
    console.error("Create flash sale error:", error);
    return NextResponse.json({ error: "Failed to create flash sale" }, { status: 500 });
  }
}

// ─── PUT: Update or Toggle Deactivate/Activate Status ──────────
export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, discountType, discountValue, startsAt, endsAt, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Sale ID is required" }, { status: 400 });
    }

    const updated = await prisma.flashSale.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt && { endsAt: new Date(endsAt) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, sale: updated });
  } catch (error) {
    console.error("Update flash sale error:", error);
    return NextResponse.json({ error: "Failed to update flash sale" }, { status: 500 });
  }
}

// ─── DELETE: Delete Flash Sale ─────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sale ID is required" }, { status: 400 });
    }

    await prisma.flashSale.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete flash sale error:", error);
    return NextResponse.json({ error: "Failed to delete flash sale" }, { status: 500 });
  }
}
