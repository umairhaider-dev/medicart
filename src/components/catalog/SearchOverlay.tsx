"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, ArrowRight, Sparkles, Package, Tag, FolderOpen, Stethoscope, Loader2 } from "lucide-react";
import type { SearchSuggestion } from "@/lib/search";

const RECENT_KEY = "medicart_recent_searches";

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(term: string) {
  const prev = getRecent().filter((s) => s !== term);
  localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0, 6)));
}
function removeRecent(term: string) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter((s) => s !== term)));
}

const iconMap: Record<string, React.ReactNode> = {
  "🔥": <TrendingUp size={14} />, "🏷️": <Tag size={14} />,
  "📂": <FolderOpen size={14} />, "🩺": <Stethoscope size={14} />,
};

const typeColor: Record<string, string> = {
  trending: "text-orange-500", brand: "text-blue-500",
  category: "text-purple-500", condition: "text-teal-500", product: "text-green-600",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSearch: (q: string) => void;
  initialQuery?: string;
}

export default function SearchOverlay({ open, onClose, onSearch, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [didYouMean, setDidYouMean] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => { if (open) { setRecent(getRecent()); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setSuggestions([]); setDidYouMean(undefined); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&mode=suggest`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setDidYouMean(data.didYouMean);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 280);
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchSuggestions]);

  const handleSubmit = (term: string) => {
    if (!term.trim()) return;
    saveRecent(term.trim());
    setRecent(getRecent());
    onSearch(term.trim());
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    const items = suggestions.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, items - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter") { e.preventDefault(); activeIdx >= 0 ? handleSubmit(suggestions[activeIdx].text) : handleSubmit(query); }
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[61] bg-white shadow-2xl rounded-b-3xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-green-400 focus-within:bg-white transition-all duration-200">
                <motion.div animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.8, repeat: loading ? Infinity : 0, ease: "linear" }}>
                  {loading ? <Loader2 size={20} className="text-green-500" /> : <Search size={20} className="text-gray-400" />}
                </motion.div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
                  onKeyDown={handleKey}
                  placeholder="Search medicines, brands, conditions..."
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 font-medium text-base focus:outline-none"
                />
                {query && (
                  <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </motion.button>
                )}
              </div>

              {/* AI Badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0">
                <Sparkles size={12} className="animate-pulse" />
                AI Search
              </div>

              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-3 space-y-4">
              {/* Did you mean */}
              <AnimatePresence>
                {didYouMean && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    Did you mean: <button onClick={() => setQuery(didYouMean)} className="text-green-600 font-semibold hover:underline">{didYouMean}</button>?
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2 px-1">
                    {query ? "Suggestions" : "Trending Searches"}
                  </p>
                  <div className="space-y-1">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={`${s.type}-${s.text}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleSubmit(s.text)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 group ${
                          activeIdx === i ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${
                          s.type === "product" ? "bg-green-50" :
                          s.type === "brand" ? "bg-blue-50" :
                          s.type === "condition" ? "bg-teal-50" :
                          s.type === "category" ? "bg-purple-50" : "bg-orange-50"
                        }`}>
                          {s.icon && !iconMap[s.icon] ? s.icon : iconMap[s.icon || ""] ?? <Package size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-800 truncate">{s.text}</div>
                          {s.subtitle && <div className="text-xs text-gray-400 truncate">{s.subtitle}</div>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {s.discount && <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">-{s.discount}%</span>}
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${typeColor[s.type] || "text-gray-400"}`}>{s.type}</span>
                          <ArrowRight size={14} className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent searches */}
              {!query && recent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Recent</p>
                    <button onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]); }} className="text-xs text-red-400 hover:text-red-600">Clear all</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <div key={term} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5 group">
                        <Clock size={12} className="text-gray-400" />
                        <button onClick={() => handleSubmit(term)} className="text-sm text-gray-700 hover:text-green-600 font-medium">{term}</button>
                        <button onClick={() => { removeRecent(term); setRecent(getRecent()); }} className="text-gray-300 hover:text-red-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick categories */}
              {!query && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2 px-1">Browse Categories</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[
                      { label: "Medicines", icon: "💊" }, { label: "Vitamins", icon: "🌟" },
                      { label: "Devices", icon: "🩺" }, { label: "Baby Care", icon: "👶" },
                      { label: "Herbal", icon: "🌿" }, { label: "Fitness", icon: "💪" },
                      { label: "Beauty", icon: "✨" }, { label: "Ayurvedic", icon: "🌾" },
                    ].map((cat) => (
                      <button key={cat.label} onClick={() => { onSearch(""); onClose(); }}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-gray-50 hover:bg-green-50 hover:text-green-700 transition-colors text-center group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">{cat.icon}</span>
                        <span className="text-[10px] font-semibold text-gray-600 group-hover:text-green-700 leading-tight">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {query.length >= 2 && !loading && suggestions.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-700 font-semibold">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different spelling or browse categories above</p>
                  <button onClick={() => handleSubmit(query)} className="mt-4 px-6 py-2.5 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
                    Search anyway →
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer shortcut hint */}
            <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">↵</kbd> select</span>
              <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">Esc</kbd> close</span>
              <div className="ml-auto flex items-center gap-1 text-purple-500 font-semibold">
                <Sparkles size={11} /> Powered by AI
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
