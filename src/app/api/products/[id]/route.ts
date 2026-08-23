import { NextResponse } from "next/server";

const SAMPLE_PRODUCT = {
  id: "1",
  name: "Midnight Black Premium Case",
  slug: "midnight-black-premium-case",
  description:
    "Crafted from premium materials, this case offers exceptional protection without compromising on style.",
  price: "799",
  comparePrice: "999",
  images: ["/placeholder-case.jpg"],
  badge: "bestseller",
  isFeatured: true,
  viewCount: 234,
  orderCount: 89,
  categoryName: "Premium",
  categorySlug: "premium",
  modelSlug: "iphone-15-pro",
  modelName: "iPhone 15 Pro",
  models: [
    { id: "m1", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
    { id: "m2", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
  ],
  createdAt: "2026-08-01T00:00:00Z",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // In production: increment view_count, fetch from DB
  // For now: return sample data
  return NextResponse.json({ ...SAMPLE_PRODUCT, id });
}
