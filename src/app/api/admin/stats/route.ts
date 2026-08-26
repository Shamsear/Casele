import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
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

    const [totalProducts, totalOrders, totalCustomers, recentOrders] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.findMany({
        select: { customerPhone: true },
        distinct: ["customerPhone"],
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      where: { status: { not: "cancelled" } },
      _sum: { total: true },
    });

    const topProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { orderCount: "desc" },
      take: 5,
    });

    return NextResponse.json(
      {
        totalProducts,
        totalOrders,
        totalCustomers: totalCustomers.length,
        totalRevenue: Number(totalRevenue._sum.total ?? 0),
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          total: Number(o.total),
          status: o.status,
          createdAt: o.createdAt.toISOString(),
          items: (Array.isArray(o.items) ? o.items : []) as { name: string; model: string; qty: number; price: number }[],
        })),
        topProducts: topProducts.map((p) => ({
          id: p.id,
          name: p.name,
          orderCount: p.orderCount,
          price: Number(p.price),
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
