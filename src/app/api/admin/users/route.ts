import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

// ─── GET: List all Database Admin Users ─────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Fetch admins error:", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

// ─── POST: Create New Admin User in Database ───────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An admin with this email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newAdmin = await prisma.adminUser.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
}

// ─── PUT: Update Admin User Password / Details ─────────────────
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, email, password } = body;

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    let passwordHash = undefined;
    if (password && String(password).trim().length > 0) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(email && { email: String(email).toLowerCase().trim() }),
        ...(passwordHash && { passwordHash }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, admin: updated });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json({ error: "Failed to update admin user" }, { status: 500 });
  }
}

// ─── DELETE: Delete Admin User ─────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // Ensure we don't delete the last remaining admin
    const totalAdmins = await prisma.adminUser.count();
    if (totalAdmins <= 1) {
      return NextResponse.json({ error: "Cannot delete the only remaining admin account" }, { status: 400 });
    }

    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json({ error: "Failed to delete admin user" }, { status: 500 });
  }
}
