import { NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/discounts/promo";

export async function POST(request: Request) {
  try {
    const { code, subtotal, customerPhone } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Code is required", discount: 0 },
        { status: 400 }
      );
    }

    const result = await validatePromoCode(
      code,
      subtotal || 0,
      customerPhone
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { valid: false, error: "Failed to validate code", discount: 0 },
      { status: 500 }
    );
  }
}
