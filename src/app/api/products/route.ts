import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get("model");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const query = searchParams.get("q");
    const sort = searchParams.get("sort") || "newest";

    let products = await getAllProducts();

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.modelName.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Filter by model
    if (model) {
      products = products.filter(
        (p) => p.modelSlug === model || p.models?.some((m) => m.slug === model)
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
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
