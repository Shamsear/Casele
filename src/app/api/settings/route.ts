import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { clearSettingsCache } from "@/lib/settings";

// ─── GET: Fetch all settings ──────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert array to object
    const settingsObj: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ─── PUT: Update settings ─────────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    // Check authentication via session or JWT token
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });

    const isAdmin =
      (session?.user as any)?.role === "admin" ||
      token?.role === "admin" ||
      Boolean(token?.sub);

    if (!isAdmin) {
      console.warn("PUT /api/settings unauthorized attempt");
      return NextResponse.json(
        { error: "Unauthorized. Please log in to admin panel." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const settings = body.settings;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    // Validate WhatsApp number format if provided
    if (settings.whatsapp_number) {
      const cleanPhone = String(settings.whatsapp_number).replace(/[\s\-()]/g, "");
      settings.whatsapp_number = cleanPhone;
    }

    // Update or create each setting with explicit String conversion for Prisma
    const entries = Object.entries(settings);
    for (const [key, rawValue] of entries) {
      const strValue = rawValue === null || rawValue === undefined ? "" : String(rawValue);
      await prisma.setting.upsert({
        where: { key },
        update: { value: strValue },
        create: { key, value: strValue },
      });
    }

    // Invalidate memory cache so updates take effect immediately everywhere
    clearSettingsCache();

    return NextResponse.json({ success: true, updatedKeys: Object.keys(settings) });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings", details: String(error) },
      { status: 500 }
    );
  }
}
