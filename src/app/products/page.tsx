"use client";
import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Sparkles, TrendingUp, Package, Tag, Zap,
  ChevronRight, Home, X
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ProductGrid from "@/components/catalog/ProductGrid";
import SortBar from "@/components/catalog/SortBar";
import ActiveFilters from "@/components/catalog/ActiveFilters";
import SearchOverlay from "@/components/catalog/SearchOverlay";
import { PRODUCTS, filterProducts, DEFAULT_FILTERS, type ProductFilters } from "@/lib/products";

const PER_PAGE = 12;

const QUICK_LINKS = [
  { label: "Pain Relief", icon: "🩹", query: "pain" },
  { label: "Vitamins", icon: "💊", query: "vitamin" },
  { label: "Antibiotics", icon: "🦠", query: "antibiotic" },
  { label: "Diabetes", icon: "🩸", query: "diabetes" },
  { label: "Heart Health", icon: "❤️", query: "heart" },
  { label: "Skin Care", icon: "✨", query: "skin" },
  { label: "Baby Care", icon: "👶", query: "baby" },
  { label: "Fitness", icon: "💪", query: "protein" },
];

const BANNER_DEALS = [
  { bg: "from-green-500 to-teal-500", text: "Up to 40% OFF on Vitamins", sub: "Limited time offer", icon: "💊" },
  { bg: "from-orange-500 to-red-500", text: "Flash Sale on Devices", sub: "Ends tonight", icon: "⚡" },
  { bg: "from-purple-500 to-violet-500", text: "Buy 2 Get 1 Free on Supplements", sub: "Auto-applied at checkout", icon: "🎁" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<ProductFilters>({
    ...DEFAULT_FILTERS,
    query: searchParams.get("q") || "",
    category: searchParams.get("cat") || "All",
  });
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = filterProducts(PRODUCTS, filters);

  useEffect(() => {
    const iv = setInterval(() => setBannerIdx((i) => (i + 1) % BANNER_DEALS.length), 4000);
    return () => clearInterval(iv);
  }, []);

  const updateFilters = useCallback((partial: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const handleSearch = useCallback((q: string) => {
    updateFilters({ query: q });
    router.replace(`/products?q=${encodeURIComponent(q)}`, { scroll: false });
  }, [updateFilters, router]);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const hasFilters = filters.query || filters.category !== "All" || filters.brands.length > 0 ||
    filters.rating > 0 || filters.forms.length > 0 || filters.inStockOnly ||
    filters.prescriptionFree || filters.discountMin > 0 || filters.priceMin > 0 || filters.priceMax < 200;

  return (
    <>
      <Navbar />

      {/* Search overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
        initialQuery={filters.query}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100 sticky top-[108px] z-20 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-3 space-y-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500">
              <Link href="/" className="hover:text-green-600 flex items-center gap-1 transition-colors"><Home size={12} /> Home</Link>
              <ChevronRight size={11} className="text-gray-300" />
              <span className="text-gray-800 font-semibold">Products</span>
              {filters.category !== "All" && (
                <>
                  <ChevronRight size={11} className="text-gray-300" />
                  <span className="text-green-600 font-semibold">{filters.category}</span>
                </>
              )}
            </nav>

            {/* Search bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-green-400 rounded-2xl px-4 py-3 text-left transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <Search size={18} className="text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              <span className="text-sm text-gray-400 flex-1">
                {filters.query ? (
                  <span className="text-gray-700 font-medium">{filters.query}</span>
                ) : (
                  "Search medicines, vitamins, brands, conditions..."
                )}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {filters.query && (
                  <button onClick={(e) => { e.stopPropagation(); updateFilters({ query: "" }); }} className="p-1 rounded-lg hover:bg-gray-200 text-gray-400">
                    <X size={14} />
                  </button>
                )}
                <div className="flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  <Sparkles size={10} className="animate-pulse" />
                  AI
                </div>
              </div>
            </button>

            {/* Quick search pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {QUICK_LINKS.map((ql) => (
                <button
                  key={ql.label}
                  onClick={() => handleSearch(ql.query)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    filters.query === ql.query
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  }`}
                >
                  <span>{ql.icon}</span>
                  {ql.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-6" ref={topRef}>
          {/* Rotating deal banner */}
          <div className="mb-6 relative h-20 overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={bannerIdx}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className={`absolute inset-0 bg-gradient-to-r ${BANNER_DEALS[bannerIdx].bg} rounded-2xl flex items-center justify-between px-6 text-white overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <div className="flex items-center gap-4 relative z-10">
                  <span className="text-4xl">{BANNER_DEALS[bannerIdx].icon}</span>
                  <div>
                    <div className="font-black text-lg leading-tight">{BANNER_DEALS[bannerIdx].text}</div>
                    <div className="text-white/80 text-sm">{BANNER_DEALS[bannerIdx].sub}</div>
                  </div>
                </div>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex-shrink-0 relative z-10">
                  Shop Now →
                </button>
                {/* Indicator dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {BANNER_DEALS.map((_, i) => (
                    <button key={i} onClick={() => setBannerIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === bannerIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Package, value: `${PRODUCTS.length}+`, label: "Products", color: "text-green-600", bg: "bg-green-50" },
              { icon: Tag, value: "40%", label: "Max Discount", color: "text-orange-600", bg: "bg-orange-50" },
              { icon: TrendingUp, value: "500+", label: "Brands", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Zap, value: "2hr", label: "Express Delivery", color: "text-violet-600", bg: "bg-violet-50" },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center gap-3 ${stat.bg} rounded-2xl px-4 py-3 border border-white`}>
                <stat.icon size={18} className={stat.color} />
                <div>
                  <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main layout: sidebar + content */}
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                totalResults={filtered.length}
                mobileOpen={mobileFilterOpen}
                onMobileClose={() => setMobileFilterOpen(false)}
              />
            </div>

            {/* Content column */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Sort bar */}
              <SortBar
                filters={filters}
                total={PRODUCTS.length}
                filtered={filtered.length}
                onChange={updateFilters}
                onMobileFilterOpen={() => setMobileFilterOpen(true)}
              />

              {/* Active filter chips */}
              {hasFilters && (
                <ActiveFilters filters={filters} onChange={updateFilters} onReset={resetFilters} />
              )}

              {/* Product grid */}
              <ProductGrid
                products={filtered}
                view={filters.view}
                page={page}
                perPage={PER_PAGE}
                total={filtered.length}
                onPageChange={(p) => { setPage(p); scrollToTop(); }}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <motion.div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-500" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
          <p className="text-gray-500 font-medium">Loading catalog...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
