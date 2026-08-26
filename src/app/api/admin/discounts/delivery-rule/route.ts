import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { clearSettingsCache } from "@/lib/settings";

// ─── GET: Fetch Delivery Configuration ────────────────────────
export async function GET(request: NextRequest) {
  try {
    let config = await prisma.deliveryConfig.findFirst();

    if (!config) {
      config = await prisma.deliveryConfig.create({
        data: {
          freeThreshold: 100,
          expressFee: 20,
          isFreeDeliveryActive: true,
        },
      });
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
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Fetch delivery config error:", error);
    return NextResponse.json(
      {
        config: {
          id: "default-delivery-config",
          freeThreshold: 100,
          expressFee: 20,
          isFreeDeliveryActive: true,
        },
      },
      { status: 200 }
    );
  }
}

// ─── PUT: Update or Toggle Delivery Configuration ─────────────
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
          "Cache-Control": "no-store, no-cache, must-revalidate",
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
