import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { clearSettingsCache } from "@/lib/settings";
import { verifyAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ─── GET: Fetch Delivery Configuration ────────────────────────
export async function GET(request: NextRequest) {
  try {
    const config = await prisma.deliveryConfig.findFirst();

    if (!config) {
      return NextResponse.json(
        { config: null },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    return NextResponse.json(
      {
        config: {
          id: config.id,
          freeThreshold: Number(config.freeThreshold),
          expressFee: Number(config.expressFee),
          isFreeDeliveryActive: config.isFreeDeliveryActive,
        },
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
    console.error("Fetch delivery config error:", error);
    return NextResponse.json(
      { config: null },
      { status: 200 }
    );
  }
}

// ─── PUT: Update or Toggle Delivery Configuration ─────────────
export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { freeThreshold, expressFee, isFreeDeliveryActive } = body;

    let config = await prisma.deliveryConfig.findFirst();

    if (!config) {
      config = await prisma.deliveryConfig.create({
        data: {
          freeThreshold: freeThreshold !== undefined ? Number(freeThreshold) : 100,
          expressFee: expressFee !== undefined ? Number(expressFee) : 20,
          isFreeDeliveryActive:
            isFreeDeliveryActive !== undefined ? Boolean(isFreeDeliveryActive) : true,
        },
      });
    } else {
      config = await prisma.deliveryConfig.update({
        where: { id: config.id },
        data: {
          ...(freeThreshold !== undefined && { freeThreshold: Number(freeThreshold) }),
          ...(expressFee !== undefined && { expressFee: Number(expressFee) }),
          ...(isFreeDeliveryActive !== undefined && {
            isFreeDeliveryActive: Boolean(isFreeDeliveryActive),
          }),
        },
      });
    }

    clearSettingsCache();

    return NextResponse.json(
      {
        success: true,
        config: {
          id: config.id,
          freeThreshold: Number(config.freeThreshold),
          expressFee: Number(config.expressFee),
          isFreeDeliveryActive: config.isFreeDeliveryActive,
        },
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
    console.error("Update delivery config error:", error);
    return NextResponse.json(
      { error: "Failed to update delivery configuration", details: String(error) },
      { status: 500 }
    );
  }
}
