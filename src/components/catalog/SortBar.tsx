"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, ChevronDown, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductFilters } from "@/lib/products";

const SORT_OPTIONS: { value: ProductFilters["sortBy"]; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

interface Props {
  filters: ProductFilters;
  total: number;
  filtered: number;
  onChange: (f: Partial<ProductFilters>) => void;
  onMobileFilterOpen: () => void;
}

export default function SortBar({ filters, total, filtered, onChange, onMobileFilterOpen }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeSort = SORT_OPTIONS.find((o) => o.value === filters.sortBy) ?? SORT_OPTIONS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Left: result count */}
      <div className="flex items-center gap-3">
        {/* Mobile filter button */}
        <motion.button
          onClick={onMobileFilterOpen}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-green-400 hover:text-green-600 transition-all shadow-sm"
          whileTap={{ scale: 0.95 }}
        >
          <SlidersHorizontal size={15} />
          Filters
        </motion.button>

        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold text-gray-900">{filtered.toLocaleString()}</span>
          {filtered !== total && (
            <> of <span className="font-bold text-gray-900">{total.toLocaleString()}</span></>
          )}{" "}
          products
          {filters.query && (
            <> for <span className="font-semibold text-green-700">&ldquo;{filters.query}&rdquo;</span></>
          )}
        </div>
      </div>

      {/* Right: view + sort */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
          {(["grid", "list"] as const).map((v) => (
            <motion.button
              key={v}
              onClick={() => onChange({ view: v })}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                filters.view === v ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-700"
              )}
              whileTap={{ scale: 0.9 }}
              title={v === "grid" ? "Grid view" : "List view"}
            >
              {v === "grid" ? <LayoutGrid size={16} /> : <List size={16} />}
            </motion.button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div ref={ref} className="relative">
          <motion.button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-green-400 hover:text-green-600 transition-all shadow-sm whitespace-nowrap"
            whileTap={{ scale: 0.97 }}
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline">{activeSort.label}</span>
            <span className="sm:hidden">Sort</span>
            <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 400 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-30"
              >
                <div className="p-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { onChange({ sortBy: opt.value }); setSortOpen(false); }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors",
                        filters.sortBy === opt.value
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {opt.label}
                      {filters.sortBy === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
