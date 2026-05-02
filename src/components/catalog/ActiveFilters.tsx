"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import type { ProductFilters } from "@/lib/products";

interface Props {
  filters: ProductFilters;
  onChange: (f: Partial<ProductFilters>) => void;
  onReset: () => void;
}

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
  color?: string;
}

export default function ActiveFilters({ filters, onChange, onReset }: Props) {
  const chips: Chip[] = [];

  if (filters.category !== "All") {
    chips.push({ key: "cat", label: `📂 ${filters.category}`, onRemove: () => onChange({ category: "All" }), color: "bg-purple-50 text-purple-700 border-purple-200" });
  }
  if (filters.query) {
    chips.push({ key: "q", label: `🔍 "${filters.query}"`, onRemove: () => onChange({ query: "" }), color: "bg-blue-50 text-blue-700 border-blue-200" });
  }
  if (filters.rating > 0) {
    chips.push({ key: "rating", label: `⭐ ${filters.rating}+ stars`, onRemove: () => onChange({ rating: 0 }), color: "bg-yellow-50 text-yellow-700 border-yellow-200" });
  }
  if (filters.priceMin > 0 || filters.priceMax < 200) {
    chips.push({ key: "price", label: `💲 $${filters.priceMin} – $${filters.priceMax}`, onRemove: () => onChange({ priceMin: 0, priceMax: 200 }), color: "bg-green-50 text-green-700 border-green-200" });
  }
  if (filters.discountMin > 0) {
    chips.push({ key: "disc", label: `🏷️ ${filters.discountMin}%+ off`, onRemove: () => onChange({ discountMin: 0 }), color: "bg-red-50 text-red-600 border-red-200" });
  }
  filters.brands.forEach((b) => {
    chips.push({ key: `brand-${b}`, label: `🏪 ${b}`, onRemove: () => onChange({ brands: filters.brands.filter((x) => x !== b) }), color: "bg-orange-50 text-orange-700 border-orange-200" });
  });
  filters.forms.forEach((f) => {
    chips.push({ key: `form-${f}`, label: `💊 ${f}`, onRemove: () => onChange({ forms: filters.forms.filter((x) => x !== f) }) });
  });
  if (filters.inStockOnly) {
    chips.push({ key: "stock", label: "✅ In Stock Only", onRemove: () => onChange({ inStockOnly: false }), color: "bg-teal-50 text-teal-700 border-teal-200" });
  }
  if (filters.prescriptionFree) {
    chips.push({ key: "rx", label: "🩺 No Prescription", onRemove: () => onChange({ prescriptionFree: false }), color: "bg-indigo-50 text-indigo-700 border-indigo-200" });
  }

  if (chips.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Active:</span>
      <AnimatePresence>
        {chips.map((chip) => (
          <motion.div
            key={chip.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${chip.color ?? "bg-gray-100 text-gray-700 border-gray-200"}`}
          >
            <span>{chip.label}</span>
            <button onClick={chip.onRemove} className="hover:opacity-70 transition-opacity flex-shrink-0">
              <X size={11} strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button
        onClick={onReset}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1.5 rounded-full hover:bg-red-50 transition-all"
        whileTap={{ scale: 0.9 }}
      >
        <RotateCcw size={11} /> Clear all
      </motion.button>
    </motion.div>
  );
}
