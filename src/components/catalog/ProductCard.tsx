"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart, Heart, Star, Eye, FileText, Zap,
  CheckCircle, Shield, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import { useWishlist } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/Toast";

interface Props {
  product: Product;
  view: "grid" | "list";
  index?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11}
          className={s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function StockBar({ stock }: { stock: number }) {
  if (stock > 50) return null;
  const pct = Math.min(100, (stock / 50) * 100);
  const color = stock < 10 ? "from-red-400 to-orange-400" : stock < 25 ? "from-orange-400 to-amber-400" : "from-green-400 to-teal-400";
  return (
    <div className="space-y-1">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }} />
      </div>
      <p className={cn("text-[10px] font-semibold", stock < 10 ? "text-red-500" : "text-orange-500")}>
        Only {stock} left!
      </p>
    </div>
  );
}

export default function ProductCard({ product: p, view, index = 0 }: Props) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { show } = useToast();
  const wishlisted = isWishlisted(p.id);
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");
  const [hovered, setHovered] = useState(false);

  const handleWishlist = () => {
    const added = toggle(p);
    show({ type: "wishlist", title: added ? "Added to wishlist!" : "Removed from wishlist", desc: p.name });
  };

  const addToCart = async () => {
    setCartState("adding");
    await new Promise((r) => setTimeout(r, 700));
    addItem(p);
    show({ type: "cart", title: "Added to cart!", desc: p.name });
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2000);
  };

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-400 overflow-hidden"
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <Link href={`/products/${p.id}`} className={`relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl bg-gradient-to-br ${p.bgColor} flex items-center justify-center overflow-hidden`}>
            <motion.div className="text-5xl" animate={hovered ? { scale: 1.2, y: -4 } : { scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300 }}>
              {p.image}
            </motion.div>
            {p.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">-{p.discount}%</div>
            )}
            {p.prescription && (
              <div className="absolute bottom-1 left-1 right-1 bg-blue-600/90 text-white text-[8px] font-bold py-0.5 text-center rounded-lg">Rx Required</div>
            )}
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{p.category}</span>
                  {p.isNew && <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>}
                  {p.isBestSeller && <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">BEST SELLER</span>}
                </div>
                <Link href={`/products/${p.id}`}><h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-1 hover:text-green-700 transition-colors">{p.name}</h3></Link>
                {p.genericName && <p className="text-xs text-gray-400 mt-0.5">Generic: {p.genericName}</p>}
                <p className="text-xs text-gray-500 mt-0.5">by {p.brand} · {p.form}{p.strength ? ` · ${p.strength}` : ""}</p>
              </div>
              <button onClick={handleWishlist} className="p-1.5 rounded-xl hover:bg-rose-50 flex-shrink-0 transition-colors">
                <Heart size={16} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-300"} />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 hidden sm:block">{p.description}</p>

            {/* Tags + Uses */}
            <div className="flex flex-wrap gap-1.5 hidden sm:flex">
              {p.uses.slice(0, 3).map((use) => (
                <span key={use} className="text-[10px] bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full">{use}</span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap mt-auto">
              <div className="flex items-center gap-2">
                <Stars rating={p.rating} />
                <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                <span className="text-xs text-gray-400">({p.reviews.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-lg font-black text-gray-900">${p.price}</span>
                  {p.originalPrice > p.price && (
                    <span className="text-xs text-gray-400 line-through ml-1.5">${p.originalPrice}</span>
                  )}
                </div>
                <motion.button
                  onClick={addToCart}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    cartState === "added" ? "bg-green-500 text-white" : `bg-gradient-to-r ${p.color} text-white hover:shadow-lg`
                  )}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {cartState === "added" ? (
                      <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                        <CheckCircle size={13} /> Added
                      </motion.span>
                    ) : cartState === "adding" ? (
                      <motion.span key="adding" className="flex items-center gap-1">
                        <motion.div className="w-3 h-3 border border-white/50 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} />
                        Adding...
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                        <ShoppingCart size={13} /> Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 120 }}
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:border-green-100 hover:-translate-y-1.5 transition-all duration-400">

        {/* Image area */}
        <div className={`relative h-44 bg-gradient-to-br ${p.bgColor} flex items-center justify-center overflow-hidden flex-shrink-0`}>
          {/* Glow */}
          <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${p.color} opacity-20 blur-2xl`} />

          {/* Product emoji */}
          <motion.div
            className="relative z-10 text-6xl select-none"
            animate={hovered ? { scale: 1.15, y: -6, rotate: [0, -3, 3, 0] } : { scale: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            {p.image}
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {p.discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">-{p.discount}%</span>
            )}
            {p.isTrending && (
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <Zap size={9} /> Hot
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
            {p.isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
            {p.prescription && <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Rx</span>}
          </div>

          {/* Wishlist */}
          <motion.button
            className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center"
            onClick={handleWishlist}
            whileTap={{ scale: 0.8 }}
          >
            <Heart size={14} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
          </motion.button>

          {/* Quick actions overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 left-3 z-10 flex gap-1.5"
              >
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white" whileHover={{ scale: 1.1 }}>
                  <Eye size={14} className="text-gray-600" />
                </motion.button>
                {p.prescription && (
                  <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.05 }} className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white" whileHover={{ scale: 1.1 }}>
                    <FileText size={14} className="text-blue-600" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {/* Category + badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{p.subcategory}</span>
            {p.isBestSeller && (
              <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-orange-100">BEST SELLER</span>
            )}
          </div>

          {/* Name + brand */}
          <div>
            <Link href={`/products/${p.id}`}><h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{p.name}</h3></Link>
            <p className="text-xs text-gray-400 mt-0.5">{p.brand}{p.strength ? ` · ${p.strength}` : ""}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Stars rating={p.rating} />
            <span className="text-xs font-bold text-gray-700">{p.rating}</span>
            <span className="text-[10px] text-gray-400">({p.reviews >= 1000 ? `${(p.reviews / 1000).toFixed(1)}k` : p.reviews})</span>
          </div>

          {/* Stock bar */}
          <StockBar stock={p.stock} />

          {/* Pack size */}
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Package size={10} />
            {p.packSize}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price + CTA */}
          <div className="space-y-2 pt-1 border-t border-gray-50">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xl font-black text-gray-900">${p.price}</span>
                {p.originalPrice > p.price && (
                  <span className="text-xs text-gray-400 line-through ml-1.5">${p.originalPrice}</span>
                )}
              </div>
              <span className="text-xs text-green-600 font-semibold">Save ${(p.originalPrice - p.price).toFixed(2)}</span>
            </div>

            <motion.button
              onClick={addToCart}
              disabled={cartState === "adding"}
              className={cn(
                "w-full py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300",
                cartState === "added"
                  ? "bg-green-500 text-white"
                  : `bg-gradient-to-r ${p.color} text-white hover:shadow-lg hover:shadow-black/10`
              )}
              whileHover={{ scale: cartState === "idle" ? 1.02 : 1 }}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {cartState === "added" ? (
                  <motion.span key="done" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex items-center gap-1.5">
                    <CheckCircle size={14} /> Added to Cart!
                  </motion.span>
                ) : cartState === "adding" ? (
                  <motion.span key="spin" className="flex items-center gap-1.5">
                    <motion.div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} />
                    Adding...
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5">
                    <ShoppingCart size={14} />
                    {p.prescription ? "View & Add" : "Add to Cart"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {p.prescription && (
              <div className="flex items-center gap-1 justify-center text-[10px] text-blue-500 font-medium">
                <Shield size={10} /> Prescription required at checkout
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
