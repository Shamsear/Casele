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
      lastOrder: string;
      lastOrderDate: Date;
    }>();

    for (const o of orders) {
      const phoneKey = o.customerPhone.trim();
      const existing = customerMap.get(phoneKey);

      if (existing) {
        existing.orders += 1;
        existing.totalSpend += Number(o.total);
        if (o.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = o.createdAt;
          existing.lastOrder = formatCustomerTime(o.createdAt);
          existing.name = o.customerName;
        }
      } else {
        customerMap.set(phoneKey, {
          phone: phoneKey,
          name: o.customerName,
          orders: 1,
          totalSpend: Number(o.total),
          lastOrderDate: o.createdAt,
          lastOrder: formatCustomerTime(o.createdAt),
        });
      }
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpend - a.totalSpend
    );

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
