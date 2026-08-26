import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Group real customer orders by phone number
    const customerMap = new Map<string, {
      phone: string;
      name: string;
      orders: number;
      totalSpend: number;
      averageOrderValue: number;
      primaryAddress: string;
      firstOrderDate: Date;
      lastOrderDate: Date;
      lastOrder: string;
      tier: "VIP Client" | "Returning Client" | "New Client";
      orderHistory: {
        id: string;
        createdAt: string;
        formattedDate: string;
        total: number;
        status: string;
        address: string;
        itemsCount: number;
        items: { productId?: string; name: string; model: string; qty: number; price: number }[];
      }[];
    }>();

    for (const o of orders) {
      const phoneKey = o.customerPhone.trim();
      const orderTotal = Number(o.total);
      const itemsList = Array.isArray(o.items) ? (o.items as any[]) : [];
      const itemsCount = itemsList.reduce((acc: number, it: any) => acc + (it.qty || 1), 0);

      const orderEntry = {
        id: o.id,
        createdAt: o.createdAt.toISOString(),
        formattedDate: o.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        total: orderTotal,
        status: o.status,
        address: o.address || "Doha, Qatar",
        itemsCount,
        items: itemsList,
      };

      const existing = customerMap.get(phoneKey);

      if (existing) {
        existing.orders += 1;
        existing.totalSpend += orderTotal;
        existing.orderHistory.push(orderEntry);

        if (o.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = o.createdAt;
          existing.lastOrder = formatCustomerTime(o.createdAt);
          existing.name = o.customerName;
          if (o.address) existing.primaryAddress = o.address;
        }

        if (o.createdAt < existing.firstOrderDate) {
          existing.firstOrderDate = o.createdAt;
        }
      } else {
        customerMap.set(phoneKey, {
          phone: phoneKey,
          name: o.customerName,
          orders: 1,
          totalSpend: orderTotal,
          averageOrderValue: orderTotal,
          primaryAddress: o.address || "Doha, Qatar",
          firstOrderDate: o.createdAt,
          lastOrderDate: o.createdAt,
          lastOrder: formatCustomerTime(o.createdAt),
          tier: "New Client",
          orderHistory: [orderEntry],
        });
      }
    }

    const customers = Array.from(customerMap.values()).map((c) => {
      const aov = c.orders > 0 ? Math.round(c.totalSpend / c.orders) : c.totalSpend;
      let tier: "VIP Client" | "Returning Client" | "New Client" = "New Client";
      if (c.totalSpend >= 250 || c.orders >= 3) {
        tier = "VIP Client";
      } else if (c.orders > 1) {
        tier = "Returning Client";
      }

      return {
        ...c,
        averageOrderValue: aov,
        tier,
        firstOrderDate: c.firstOrderDate.toISOString(),
        lastOrderDate: c.lastOrderDate.toISOString(),
      };
    }).sort((a, b) => b.totalSpend - a.totalSpend);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Admin fetch customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

function formatCustomerTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
