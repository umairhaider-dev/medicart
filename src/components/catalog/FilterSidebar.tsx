"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, X, SlidersHorizontal, RotateCcw,
  Star, Package, Tag, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRANDS, FORMS, CATEGORIES, type ProductFilters } from "@/lib/products";

interface Props {
  filters: ProductFilters;
  onChange: (f: Partial<ProductFilters>) => void;
  onReset: () => void;
  totalResults: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 pb-4 mb-4 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 group"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-gray-800 group-hover:text-green-600 transition-colors">
          {icon}
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-gray-400" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriceSlider({ min, max, value, onChange }: {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-lg">${value[0]}</span>
        <span className="text-gray-400 text-xs">to</span>
        <span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-lg">${value[1]}</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full mx-1">
        <div
          className="absolute h-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        {/* Min thumb */}
        <input type="range" min={min} max={max} value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 5), value[1]])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        {/* Max thumb */}
        <input type="range" min={min} max={max} value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 5)])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        {[value[0], value[1]].map((v, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-green-500 shadow-md -translate-x-1/2 pointer-events-none"
            style={{ left: `${pct(v)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function CheckPill({ label, checked, onChange, count }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; count?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group py-1">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cn(
            "w-4 h-4 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
            checked ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-green-400"
          )}
          onClick={() => onChange(!checked)}
        >
          {checked && <Check size={10} className="text-white" strokeWidth={3} />}
        </div>
        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </label>
  );
}

function BrandSearch({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const visible = BRANDS.filter((b) => b.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-2">
      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search brands..."
        className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all"
      />
      <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1">
        {visible.map((brand) => (
          <CheckPill
            key={brand} label={brand} checked={selected.includes(brand)}
            onChange={(v) => onChange(v ? [...selected, brand] : selected.filter((b) => b !== brand))}
          />
        ))}
      </div>
      {selected.length > 0 && (
        <button onClick={() => onChange([])} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
          <X size={10} /> Clear brand filters
        </button>
      )}
    </div>
  );
}

const SIDEBAR_CONTENT = ({ filters, onChange }: Pick<Props, "filters" | "onChange">) => (
  <div className="space-y-0">
    {/* Category */}
    <Section title="Category" icon={<Package size={14} />}>
      <div className="space-y-0.5">
        {CATEGORIES.map((cat) => (
          <label key={cat} className="flex items-center gap-2.5 cursor-pointer group py-1">
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                filters.category === cat ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-green-400"
              )}
              onClick={() => onChange({ category: cat })}
            >
              {filters.category === cat && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className={cn("text-sm transition-colors", filters.category === cat ? "text-green-700 font-semibold" : "text-gray-700 group-hover:text-gray-900")}>
              {cat}
            </span>
          </label>
        ))}
      </div>
    </Section>

    {/* Price Range */}
    <Section title="Price Range">
      <PriceSlider
        min={0} max={200}
        value={[filters.priceMin, filters.priceMax]}
        onChange={([min, max]) => onChange({ priceMin: min, priceMax: max })}
      />
    </Section>

    {/* Rating */}
    <Section title="Minimum Rating" icon={<Star size={14} />}>
      <div className="space-y-1.5">
        {[4.5, 4, 3.5, 3, 0].map((r) => (
          <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                filters.rating === r ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-green-400"
              )}
              onClick={() => onChange({ rating: r })}
            >
              {filters.rating === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div className="flex items-center gap-1.5">
              {r === 0 ? (
                <span className="text-sm text-gray-600">All Ratings</span>
              ) : (
                <>
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={12} className={s <= Math.floor(r) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{r}+ stars</span>
                </>
              )}
            </div>
          </label>
        ))}
      </div>
    </Section>

    {/* Brand */}
    <Section title="Brand" icon={<Tag size={14} />} defaultOpen={false}>
      <BrandSearch selected={filters.brands} onChange={(brands) => onChange({ brands })} />
    </Section>

    {/* Form / Dosage */}
    <Section title="Dosage Form" defaultOpen={false}>
      <div className="flex flex-wrap gap-2">
        {FORMS.map((form) => {
          const active = filters.forms.includes(form);
          return (
            <button
              key={form}
              onClick={() => onChange({ forms: active ? filters.forms.filter((f) => f !== form) : [...filters.forms, form] })}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200",
                active ? "bg-green-500 border-green-500 text-white shadow-sm" : "border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 bg-white"
              )}
            >
              {form}
            </button>
          );
        })}
      </div>
    </Section>

    {/* Discount */}
    <Section title="Discount" defaultOpen={false}>
      <div className="space-y-1">
        {[{ label: "Any Discount", value: 1 }, { label: "10% or more", value: 10 }, { label: "20% or more", value: 20 }, { label: "30% or more", value: 30 }, { label: "40% or more", value: 40 }].map((d) => (
          <label key={d.value} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
            <div
              className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all", filters.discountMin === d.value ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-green-400")}
              onClick={() => onChange({ discountMin: filters.discountMin === d.value ? 0 : d.value })}
            >
              {filters.discountMin === d.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900">{d.label}</span>
          </label>
        ))}
      </div>
    </Section>

    {/* Toggles */}
    <Section title="Availability" defaultOpen={false}>
      <div className="space-y-3">
        {[
          { key: "inStockOnly" as const, label: "In Stock Only", desc: "Show available products" },
          { key: "prescriptionFree" as const, label: "No Prescription Needed", desc: "Over-the-counter only" },
        ].map((toggle) => (
          <label key={toggle.key} className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <div className="text-sm font-medium text-gray-800">{toggle.label}</div>
              <div className="text-xs text-gray-400">{toggle.desc}</div>
            </div>
            <button
              role="switch"
              aria-checked={filters[toggle.key]}
              onClick={() => onChange({ [toggle.key]: !filters[toggle.key] })}
              className={cn(
                "relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0",
                filters[toggle.key] ? "bg-green-500" : "bg-gray-200"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                filters[toggle.key] ? "left-[22px]" : "left-0.5"
              )} />
            </button>
          </label>
        ))}
      </div>
    </Section>
  </div>
);

export default function FilterSidebar({ filters, onChange, onReset, totalResults, mobileOpen, onMobileClose }: Props) {
  const hasActiveFilters =
    filters.category !== "All" || filters.brands.length > 0 || filters.rating > 0 ||
    filters.forms.length > 0 || filters.inStockOnly || filters.prescriptionFree ||
    filters.discountMin > 0 || filters.priceMin > 0 || filters.priceMax < 200;

  const panelContent = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-green-600" />
          <span className="font-bold text-gray-800 text-sm">Filters</span>
          {hasActiveFilters && (
            <span className="bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {[filters.category !== "All", filters.brands.length > 0, filters.rating > 0, filters.forms.length > 0, filters.inStockOnly, filters.prescriptionFree, filters.discountMin > 0].filter(Boolean).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{totalResults} results</span>
          {hasActiveFilters && (
            <button onClick={onReset} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>
      </div>
      <div className="p-5">
        <SIDEBAR_CONTENT filters={filters} onChange={onChange} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block sticky top-24 self-start">
        {panelContent}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm" onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-green-600" />
                  <span className="font-bold text-gray-800">Filters</span>
                </div>
                <button onClick={onMobileClose} className="p-1.5 rounded-xl hover:bg-white/80 text-gray-500">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <SIDEBAR_CONTENT filters={filters} onChange={onChange} />
              </div>
              <div className="flex gap-3 p-4 border-t border-gray-100 flex-shrink-0">
                <button onClick={onReset} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-red-300 hover:text-red-500 transition-colors">
                  Reset All
                </button>
                <button onClick={onMobileClose} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold text-sm hover:shadow-lg transition-all">
                  Show {totalResults} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
