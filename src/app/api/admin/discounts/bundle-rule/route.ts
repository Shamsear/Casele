import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { clearSettingsCache } from "@/lib/settings";
import { verifyAdminAuth } from "@/lib/admin-auth";

// ─── GET: Fetch Bundle Discount Configuration ─────────────────
export async function GET(request: NextRequest) {
  try {
    let config = await prisma.bundleDiscountConfig.findFirst();

    if (!config) {
      config = await prisma.bundleDiscountConfig.create({
        data: {
          buy2Percent: 5,
          buy3Percent: 10,
          isActive: true,
        },
      });
    }

    return NextResponse.json(
      { config },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Fetch bundle discount config error:", error);
    return NextResponse.json(
      {
        config: {
          id: "default-bundle-config",
          buy2Percent: 5,
          buy3Percent: 10,
          isActive: true,
        },
      },
      { status: 200 }
    );
  }
}

// ─── PUT: Update or Toggle Bundle Discount Configuration ───────
export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { buy2Percent, buy3Percent, isActive } = body;

    let config = await prisma.bundleDiscountConfig.findFirst();

    if (!config) {
      config = await prisma.bundleDiscountConfig.create({
        data: {
          buy2Percent: buy2Percent !== undefined ? Number(buy2Percent) : 5,
          buy3Percent: buy3Percent !== undefined ? Number(buy3Percent) : 10,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      });
    } else {
      config = await prisma.bundleDiscountConfig.update({
        where: { id: config.id },
        data: {
          ...(buy2Percent !== undefined && { buy2Percent: Number(buy2Percent) }),
          ...(buy3Percent !== undefined && { buy3Percent: Number(buy3Percent) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      });
    }

    clearSettingsCache();

    return NextResponse.json(
      {
        success: true,
        config,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Update bundle discount config error:", error);
    return NextResponse.json(
      { error: "Failed to update bundle discount configuration", details: String(error) },
      { status: 500 }
    );
  }
}
