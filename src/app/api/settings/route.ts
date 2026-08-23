import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// ─── GET: Fetch all settings ──────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const { success } = rateLimit(`settings:${ip}`, RATE_LIMITS.api);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limit
    const ip = getClientIp(request);
    const { success } = rateLimit(`settings:${ip}`, RATE_LIMITS.api);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { settings } = await request.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    // Validate WhatsApp number format if provided
    if (settings.whatsapp_number) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      const cleanPhone = settings.whatsapp_number.replace(/[\s\-()]/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
      // Store without spaces or special characters
      settings.whatsapp_number = cleanPhone;
    }

    // Update or create each setting
    const upsertPromises = Object.entries(settings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      })
    );

    await Promise.all(upsertPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
