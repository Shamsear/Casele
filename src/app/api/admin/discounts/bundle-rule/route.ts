import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { clearSettingsCache } from "@/lib/settings";

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

    // Keep settings table synchronized for backward compatibility
    await prisma.setting.upsert({
      where: { key: "bundle_discounts_enabled" },
      update: { value: String(config.isActive) },
      create: { key: "bundle_discounts_enabled", value: String(config.isActive) },
    });
    await prisma.setting.upsert({
      where: { key: "bundle_buy_2_discount" },
      update: { value: String(config.buy2Percent) },
      create: { key: "bundle_buy_2_discount", value: String(config.buy2Percent) },
    });
    await prisma.setting.upsert({
      where: { key: "bundle_buy_3_discount" },
      update: { value: String(config.buy3Percent) },
      create: { key: "bundle_buy_3_discount", value: String(config.buy3Percent) },
    });

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
