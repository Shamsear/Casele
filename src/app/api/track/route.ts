import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  // In production: query database by phone number
  // For now: return sample data
  const orders = [
    {
      id: "ORD-248",
      status: "confirmed",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          name: "Midnight Black Case",
          model: "iPhone 15 Pro",
          qty: 1,
          price: 799,
        },
      ],
      total: 799,
      address: "Mumbai, Maharashtra",
    },
  ];

  return NextResponse.json(orders);
}
