import { NextRequest, NextResponse } from "next/server";
import { getOrdersByPhone } from "@/lib/db/products";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  // Normalize phone: remove spaces, dashes, parentheses
  const normalizedPhone = phone.replace(/[\s\-()]/g, "");

  const orders = await getOrdersByPhone(normalizedPhone);

  return NextResponse.json({ orders });
}
