import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { clearSettingsCache } from "@/lib/settings";
import { verifyAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ─── GET: Fetch all settings ──────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert array to object
    const settingsObj: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json(
      { settings: settingsObj },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ─── Helper: Update Settings in Database ───────────────────────
async function updateSettingsHandler(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      console.warn("PUT/POST /api/settings unauthorized attempt");
      return NextResponse.json(
        { error: "Unauthorized. Please log in to admin panel." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const settingsData = body.settings && typeof body.settings === "object" ? body.settings : body;

    if (!settingsData || typeof settingsData !== "object") {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    // Validate WhatsApp number format if provided
    if (settingsData.whatsapp_number) {
      const cleanPhone = String(settingsData.whatsapp_number).replace(/[\s\-()]/g, "");
      settingsData.whatsapp_number = cleanPhone;
    }

    // Update or create each setting with explicit String conversion for Prisma
    const entries = Object.entries(settingsData);
    for (const [key, rawValue] of entries) {
      if (key === "settings") continue; // Skip nested wrapper if any
      const strValue = rawValue === null || rawValue === undefined ? "" : String(rawValue);
      await prisma.setting.upsert({
        where: { key },
        update: { value: strValue },
        create: { key, value: strValue },
      });
    }

    // Invalidate memory cache so updates take effect immediately everywhere
    clearSettingsCache();

    return NextResponse.json(
      { success: true, updatedKeys: Object.keys(settingsData) },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings", details: String(error) },
      { status: 500 }
    );
  }
}

// ─── PUT: Update settings ─────────────────────────────────────
export async function PUT(request: NextRequest) {
  return updateSettingsHandler(request);
}

// ─── POST: Update settings ────────────────────────────────────
export async function POST(request: NextRequest) {
  return updateSettingsHandler(request);
}
