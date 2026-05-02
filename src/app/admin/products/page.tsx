"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Edit2, Trash2, ChevronUp, ChevronDown,
  Filter, X, CheckCircle, AlertTriangle, Star,
  Package, ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type SortKey = "name" | "price" | "stock" | "rating" | "discount";
type SortDir = "asc" | "desc";

const CATEGORIES = ["All", "Medicines", "Vitamins", "Herbal", "Ayurvedic", "Devices", "Baby Care", "Fitness", "Beauty"];

function Badge({ label, variant }: { label: string; variant: "green" | "yellow" | "red" | "blue" | "purple" }) {
  const styles = {
    green:  "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red:    "bg-red-50 text-red-600 border-red-200",
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  }[variant];
  return <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", styles)}>{label}</span>;
}

function StockBar({ stock }: { stock: number }) {
  const pct = Math.min((stock / 100) * 100, 100);
  const color = stock < 10 ? "bg-red-500" : stock < 30 ? "bg-orange-400" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-xs font-bold", stock < 10 ? "text-red-600" : stock < 30 ? "text-orange-600" : "text-gray-700")}>{stock}</span>
    </div>
  );
}

/* ── Add/Edit Modal ── */
function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name:  product?.name  ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "Medicines",
    price: product?.price?.toString() ?? "",
    originalPrice: product?.originalPrice?.toString() ?? "",
    stock: product?.stock?.toString() ?? "",
    description: product?.description ?? "",
    prescription: product?.prescription ?? false,
  });
  const [saved, setSaved] = useState(false);

  const field = (key: keyof typeof form) => ({
    value: String(form[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEdit ? product?.sku : "Fill in the product details"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {[
            { label: "Product Name", key: "name" as const, placeholder: "e.g. Paracetamol 500mg" },
            { label: "Brand",        key: "brand" as const, placeholder: "e.g. Sun Pharma" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input {...field(f.key)} placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all" />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Category</label>
              <select {...field("category")} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all">
                {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Stock</label>
              <input {...field("stock")} type="number" min="0" placeholder="0" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Price ($)</label>
              <input {...field("price")} type="number" step="0.01" min="0" placeholder="0.00" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Original Price ($)</label>
              <input {...field("originalPrice")} type="number" step="0.01" min="0" placeholder="0.00" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea {...field("description")} rows={3} placeholder="Product description…" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all resize-none" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.prescription} onChange={(e) => setForm(f => ({ ...f, prescription: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-green-500" />
            <span className="text-sm text-gray-700 font-medium">Requires Prescription</span>
          </label>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          <motion.button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >
            {saved ? <><CheckCircle size={15} /> Saved!</> : isEdit ? "Save Changes" : "Add Product"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ── */
const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [sortKey, setSortKey]       = useState<SortKey>("name");
  const [sortDir, setSortDir]       = useState<SortDir>("asc");
  const [page, setPage]             = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null | "new">(null);
  const [delId, setDelId]           = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let res = PRODUCTS.filter(p => !deletedIds.has(p.id));
    if (category !== "All") res = res.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    res = [...res].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * mul;
      return ((a[sortKey] as number) - (b[sortKey] as number)) * mul;
    });
    return res;
  }, [search, category, sortKey, sortDir, deletedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    sortKey === k
      ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <ChevronDown size={12} className="opacity-30" />
  );

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{filtered.length} products total</p>
        </div>
        <motion.button
          onClick={() => setEditProduct("new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-green-300/50 transition-all w-fit"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, brand, SKU…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={cn("px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0", category === cat ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                {(["name","price","stock","rating","discount"] as SortKey[]).slice(1).map((k) => (
                  <th key={k} className="px-4 py-3.5 text-left">
                    <button onClick={() => toggleSort(k)} className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">
                      {k.charAt(0).toUpperCase() + k.slice(1)} <SortIcon k={k} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {paged.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.bgColor} flex items-center justify-center text-xl flex-shrink-0`}>{p.image}</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-[180px]">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-gray-400">{p.brand}</span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                            {p.prescription && <Badge label="Rx" variant="blue" />}
                            {p.isNew && <Badge label="New" variant="green" />}
                            {p.isBestSeller && <Badge label="Best Seller" variant="yellow" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-bold text-gray-900">${p.price}</span>
                        {p.originalPrice > p.price && <span className="text-[10px] text-gray-400 line-through ml-1">${p.originalPrice}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StockBar stock={p.stock} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {p.discount > 0
                        ? <Badge label={`-${p.discount}%`} variant="red" />
                        : <span className="text-[10px] text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3.5">
                      {p.inStock
                        ? <Badge label="In Stock" variant="green" />
                        : <Badge label="Out of Stock" variant="red" />
                      }
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditProduct(p)} className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Preview">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setDelId(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={cn("w-8 h-8 rounded-xl text-xs font-bold transition-all", page === n ? "bg-green-500 text-white" : "hover:bg-gray-100 text-gray-600")}
              >
                {n}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {delId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-center">Delete Product?</h3>
              <p className="text-sm text-gray-500 text-center mt-1 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDelId(null)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={() => { setDeletedIds(s => new Set([...s, delId])); setDelId(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit modal */}
      <AnimatePresence>
        {editProduct && (
          <ProductModal product={editProduct === "new" ? null : editProduct} onClose={() => setEditProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
