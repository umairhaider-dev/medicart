import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/search";
import { filterProducts, PRODUCTS, DEFAULT_FILTERS, type ProductFilters } from "@/lib/products";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const mode = searchParams.get("mode") || "suggest";

  if (mode === "suggest") {
    const result = getSearchSuggestions(query);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }

  if (mode === "products") {
    const filters: ProductFilters = {
      ...DEFAULT_FILTERS,
      query,
      category: searchParams.get("category") || "All",
      brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
      priceMin: Number(searchParams.get("priceMin") || 0),
      priceMax: Number(searchParams.get("priceMax") || 200),
      rating: Number(searchParams.get("rating") || 0),
      forms: searchParams.get("forms")?.split(",").filter(Boolean) || [],
      inStockOnly: searchParams.get("inStock") === "true",
      prescriptionFree: searchParams.get("rxFree") === "true",
      discountMin: Number(searchParams.get("discountMin") || 0),
      sortBy: (searchParams.get("sort") as ProductFilters["sortBy"]) || "featured",
      view: "grid",
    };
    const results = filterProducts(PRODUCTS, filters);
    const page = Number(searchParams.get("page") || 1);
    const perPage = 12;
    const paginated = results.slice((page - 1) * perPage, page * perPage);
    return NextResponse.json({
      products: paginated,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / perPage),
    });
  }

  return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
}
