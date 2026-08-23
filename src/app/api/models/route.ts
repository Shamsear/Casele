import { NextResponse } from "next/server";

const SAMPLE_MODELS = [
  { id: "1", brand: "iPhone", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", count: 12 },
  { id: "2", brand: "iPhone", name: "iPhone 15 Pro", slug: "iphone-15-pro", count: 10 },
  { id: "3", brand: "iPhone", name: "iPhone 15", slug: "iphone-15", count: 8 },
  { id: "4", brand: "Samsung", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", count: 8 },
  { id: "5", brand: "Samsung", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", count: 7 },
  { id: "6", brand: "Google", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", count: 5 },
];

export async function GET() {
  return NextResponse.json(SAMPLE_MODELS);
}
