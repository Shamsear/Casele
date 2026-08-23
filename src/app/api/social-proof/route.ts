import { NextResponse } from "next/server";

export async function GET() {
  // In production: query database for real counts
  // For now: return sample data
  return NextResponse.json({
    products: {
      "1": { viewCount: 234, orderCount: 89, lastSoldAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      "2": { viewCount: 156, orderCount: 34, lastSoldAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
      "3": { viewCount: 189, orderCount: 67, lastSoldAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      "4": { viewCount: 145, orderCount: 45, lastSoldAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    },
  });
}
