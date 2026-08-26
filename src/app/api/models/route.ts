import { NextResponse } from "next/server";
import { getAllModels } from "@/lib/db/products";

export async function GET() {
  try {
    const models = await getAllModels();
    return NextResponse.json(models);
  } catch (error) {
    console.error("GET /api/models error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
