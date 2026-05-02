import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "relevance";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const inStock = searchParams.get("inStock");
  const rxFree = searchParams.get("rxFree");
  const brands = searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
  const priceMin = parseFloat(searchParams.get("priceMin") ?? "0");
  const priceMax = parseFloat(searchParams.get("priceMax") ?? "999999");
  const rating = parseFloat(searchParams.get("rating") ?? "0");
  const discountMin = parseInt(searchParams.get("discountMin") ?? "0");

  try {
    const where = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { brand: { contains: q, mode: "insensitive" as const } },
          { genericName: { contains: q, mode: "insensitive" as const } },
          { tags: { has: q } },
        ],
      }),
      ...(category && category !== "All" && { category }),
      ...(brands.length && { brand: { in: brands } }),
      ...(inStock === "true" && { inStock: true }),
      ...(rxFree === "true" && { prescription: false }),
      price: { gte: priceMin, lte: priceMax },
      ...(rating > 0 && { rating: { gte: rating } }),
      ...(discountMin > 0 && { discount: { gte: discountMin } }),
    };

    const orderBy = (() => {
      switch (sort) {
        case "price_asc": return { price: "asc" as const };
        case "price_desc": return { price: "desc" as const };
        case "rating": return { rating: "desc" as const };
        case "discount": return { discount: "desc" as const };
        case "newest": return { createdAt: "desc" as const };
        default: return { isBestSeller: "desc" as const };
      }
    })();

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
