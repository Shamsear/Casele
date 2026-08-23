import { NextResponse } from "next/server";

// Sample data — will be replaced with database queries
const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Midnight Black Premium Case",
    slug: "midnight-black-premium-case",
    price: "799",
    comparePrice: "999",
    images: ["/placeholder-case.jpg"],
    badge: "bestseller",
    isFeatured: true,
    viewCount: 234,
    orderCount: 89,
    categoryName: "Premium",
    modelSlug: "iphone-15-pro",
    modelName: "iPhone 15 Pro",
  },
  {
    id: "2",
    name: "Gold Edge Luxe Case",
    slug: "gold-edge-luxe-case",
    price: "1299",
    comparePrice: null,
    images: ["/placeholder-case.jpg"],
    badge: "new",
    isFeatured: true,
    viewCount: 156,
    orderCount: 34,
    categoryName: "Premium",
    modelSlug: "iphone-15-pro-max",
    modelName: "iPhone 15 Pro Max",
  },
  {
    id: "3",
    name: "Royal Blue Classic Case",
    slug: "royal-blue-classic-case",
    price: "599",
    comparePrice: "799",
    images: ["/placeholder-case.jpg"],
    badge: "sale",
    isFeatured: false,
    viewCount: 189,
    orderCount: 67,
    categoryName: "Classic",
    modelSlug: "samsung-galaxy-s24",
    modelName: "Samsung Galaxy S24",
  },
  {
    id: "4",
    name: "Matte Carbon Fiber Case",
    slug: "matte-carbon-fiber-case",
    price: "899",
    comparePrice: null,
    images: ["/placeholder-case.jpg"],
    badge: null,
    isFeatured: true,
    viewCount: 145,
    orderCount: 45,
    categoryName: "Sport",
    modelSlug: "google-pixel-8-pro",
    modelName: "Google Pixel 8 Pro",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "newest";

  let products = [...SAMPLE_PRODUCTS];

  // Filter by model
  if (model) {
    products = products.filter(
      (p) => p.modelSlug === model
    );
  }

  // Filter by category
  if (category) {
    products = products.filter(
      (p) => p.categoryName.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter featured
  if (featured === "true") {
    products = products.filter((p) => p.isFeatured);
  }

  // Sort
  switch (sort) {
    case "price-low":
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-high":
      products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "popular":
      products.sort((a, b) => b.orderCount - a.orderCount);
      break;
    default:
      // newest — keep default order
      break;
  }

  return NextResponse.json(products);
}
