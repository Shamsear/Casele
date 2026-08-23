import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage, deleteImage, validateImageFile } from "@/lib/image-service";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// ─── POST: Upload Image ───────────────────────────────────────
export async function POST(request: NextRequest) {
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
    const { success, remaining } = rateLimit(`upload:${ip}`, RATE_LIMITS.upload);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: { "X-RateLimit-Remaining": "0" }
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    try {
      validateImageFile(file);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid file" },
        { status: 400 }
      );
    }

    // Sanitize folder name
    const sanitizedFolder = folder?.replace(/[^a-zA-Z0-9-_]/g, "") || "products";

    // Upload to provider
    const url = await uploadImage(file, sanitizedFolder);

    return NextResponse.json({ 
      success: true, 
      url,
      fileName: file.name,
      size: file.size,
    }, {
      headers: { "X-RateLimit-Remaining": remaining.toString() }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Delete Image ─────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    await deleteImage(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
