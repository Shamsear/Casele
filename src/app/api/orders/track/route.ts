import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const orderId = searchParams.get("id");

    if (!phone && !orderId) {
      return NextResponse.json({ error: "Phone number or Order ID required" }, { status: 400 });
    }

    let orders: any[] = [];

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId.trim() },
      });
      if (order) orders = [order];
    } else if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const allOrders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });

      // Match phone loosely (e.g. 55123456 matching +97455123456)
      orders = allOrders.filter((o) => {
        const orderCleanPhone = o.customerPhone.replace(/[^0-9]/g, "");
        return (
          orderCleanPhone.includes(cleanPhone) ||
          cleanPhone.includes(orderCleanPhone)
        );
      });
    }

    const formattedOrders = orders.map((o) => {
      const itemsList = Array.isArray(o.items) ? o.items : [];
      return {
        id: o.id,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        address: o.address || "Doha, Qatar",
        items: itemsList,
        subtotal: Number(o.subtotal),
        discount: Number(o.promoDiscount || 0) + Number(o.tierDiscount || 0),
        total: Number(o.total),
        status: o.status,
        deliverySpeed: o.priority || "same_day",
        notes: o.notes || "",
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
