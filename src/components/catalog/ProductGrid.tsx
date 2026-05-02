"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Package, SearchX, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product, ProductFilters } from "@/lib/products";

interface Props {
  products: Product[];
  view: ProductFilters["view"];
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  loading?: boolean;
}

function Skeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-28 h-28 rounded-2xl bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            <div className="h-8 bg-gray-100 rounded-2xl w-32 mt-4" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-10 bg-gray-100 rounded-2xl mt-2" />
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl mb-6"
      >
        <SearchX className="w-20 h-20 text-gray-200 mx-auto" strokeWidth={1.5} />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-6">
        Try adjusting your filters or search terms to find what you&apos;re looking for.
      </p>
      <div className="flex gap-3">
        {onReset && (
          <button onClick={onReset} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all">
            Clear Filters
          </button>
        )}
        <a href="#" className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:border-green-400 hover:text-green-600 transition-all flex items-center gap-1.5">
          Browse All <ArrowRight size={14} />
        </a>
      </div>
    </motion.div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 pt-8 pb-2"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-green-50"
      >
        ← Prev
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-gray-400">…</span>
        ) : (
          <motion.button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
              page === p
                ? "bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md shadow-green-200"
                : "border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
            }`}
            whileHover={{ scale: page === p ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {p}
          </motion.button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === Math.ceil(total / perPage)}
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-green-50"
      >
        Next →
      </button>

      <span className="hidden sm:block text-xs text-gray-400 ml-2">
        Page {page} of {Math.ceil(total / perPage)}
      </span>
    </motion.div>
  );
}

export default function ProductGrid({ products, view, page, perPage, total, onPageChange, loading }: Props) {
  const paginated = products.slice((page - 1) * perPage, page * perPage);
  const skeletonCount = view === "grid" ? 8 : 4;

  return (
    <div>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5" : "flex flex-col gap-4"}
          >
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} view={view} />
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={view === "grid" ? "grid" : "flex flex-col"}>
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${view}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}
          >
            {paginated.map((product, i) => (
              <ProductCard key={product.id} product={product} view={view} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && products.length > 0 && (
        <Pagination page={page} total={total} perPage={perPage} onChange={onPageChange} />
      )}

      {/* Results summary */}
      {!loading && products.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <Package size={12} />
            Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total} products
          </p>
        </motion.div>
      )}
    </div>
  );
}
