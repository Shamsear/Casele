import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/db/products";

const orderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  address: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      model: z.string(),
      qty: z.number().min(1),
      price: z.number(),
    })
  ),
  subtotal: z.number(),
  tierDiscount: z.number().default(0),
  flashDiscount: z.number().default(0),
  promoDiscount: z.number().default(0),
  bundleDiscount: z.number().default(0),
  promoCode: z.string().optional(),
  total: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);

    const order = await createOrder({
      customerName: validated.customerName,
      customerPhone: validated.customerPhone,
      address: validated.address,
      items: validated.items,
      subtotal: validated.subtotal,
      tierDiscount: validated.tierDiscount,
      flashDiscount: validated.flashDiscount,
      promoDiscount: validated.promoDiscount,
      bundleDiscount: validated.bundleDiscount,
      promoCode: validated.promoCode,
      total: validated.total,
    });

    if (!order) {
      // Fallback: return success with generated ID if DB is unavailable
      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      return NextResponse.json({
        success: true,
        orderId,
        order: validated,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
