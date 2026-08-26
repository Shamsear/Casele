import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/db/products";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
