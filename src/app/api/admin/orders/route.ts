import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// ─── GET: Fetch Real Database Orders ───────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status && status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const formattedOrders = orders.map((order) => {
      const itemsList = Array.isArray(order.items) ? order.items : [];
      const totalItemCount = itemsList.reduce((acc: number, it: any) => acc + (it.qty || 1), 0);

      return {
        id: order.id,
        customer: order.customerName,
        phone: order.customerPhone,
        address: order.address || "Doha, Qatar",
        items: totalItemCount,
        total: Number(order.total),
        status: order.status,
        time: formatOrderTime(order.createdAt),
        createdAt: order.createdAt.toISOString(),
        itemsDetail: itemsList,
        notes: order.notes || "",
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// ─── POST: Admin Manual Order Creation (From WhatsApp / Direct Call) ───
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      address,
      items,
      subtotal,
      discount = 0,
      total,
      status = "confirmed",
      notes,
    } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Customer name, phone number, and at least 1 product item are required" },
        { status: 400 }
      );
    }

    const calculatedSubtotal = subtotal || items.reduce((acc: number, it: any) => acc + (Number(it.price) * (Number(it.qty) || 1)), 0);
    const calculatedTotal = total !== undefined ? Number(total) : Math.max(0, calculatedSubtotal - Number(discount));

    const order = await prisma.order.create({
      data: {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: address?.trim() || "Doha, Qatar",
        items: items,
        subtotal: calculatedSubtotal,
        promoDiscount: Number(discount),
        total: calculatedTotal,
        status: status || "confirmed",
        notes: notes?.trim() || null,
        whatsappSent: true,
      },
    });

    // Update product sold counters
    for (const it of items) {
      if (it.productId) {
        try {
          await prisma.product.update({
            where: { id: it.productId },
            data: {
              orderCount: { increment: Number(it.qty) || 1 },
              lastSoldAt: new Date(),
            },
          });
        } catch {
          // Continue if custom item or id not matched
        }
      }
    }

    // Log admin activity
    try {
      const adminUserId = (session.user as any)?.id;
      if (adminUserId) {
        await prisma.adminActivityLog.create({
          data: {
            adminId: adminUserId,
            action: "create_order",
            details: `Manual WhatsApp order created for ${customerName} (QR ${calculatedTotal})`,
          },
        });
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Admin create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// ─── PUT: Update Order Status / Details ─────────────────────────
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes, address } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(address && { address }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// ─── DELETE: Delete Order ──────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete order error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

function formatOrderTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
