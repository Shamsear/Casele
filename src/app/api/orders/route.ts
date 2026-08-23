import { NextResponse } from "next/server";
import { z } from "zod";

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
  promoCode: z.string().optional(),
  total: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);

    // In production: save to database
    // For now: return success with order ID
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      orderId,
      order: validated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
