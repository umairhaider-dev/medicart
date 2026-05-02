"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart, ShoppingCart, Trash2, ArrowRight, Star, Package,
  Sparkles, X, CheckCircle, ChevronRight, Gift, TrendingUp
} from "lucide-react";
import { useWishlist } from "@/store/wishlistStore";
import { useCart } from "@/store/cartStore";
import { useToast } from "@/components/ui/Toast";
import { PRODUCTS, type Product } from "@/lib/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

/* ─── Mini product card used in recommended section ─── */
function RecoCard({ p }: { p: Product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { show } = useToast();
  const wishlisted = isWishlisted(p.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      <Link href={`/products/${p.id}`}>
        <div className={`h-32 bg-gradient-to-br ${p.bgColor} flex items-center justify-center relative`}>
          <span className="text-5xl">{p.image}</span>
          {p.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
              -{p.discount}%
            </span>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/products/${p.id}`}>
          <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{p.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{p.brand}</p>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="font-black text-gray-900 text-sm">${p.price}</span>
          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={() => {
                const added = toggle(p);
                show({ type: "wishlist", title: added ? "Added to wishlist" : "Removed from wishlist" });
              }}
              whileTap={{ scale: 0.8 }}
              className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Heart size={13} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-300"} />
            </motion.button>
            <motion.button
              onClick={() => { addItem(p); show({ type: "cart", title: "Added to cart!", desc: p.name }); }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-gradient-to-r ${p.color} text-white`}
            >
              <ShoppingCart size={11} /> Add
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Wishlist item card ─── */
function WishlistCard({ product: p, onRemove }: { product: Product; onRemove: () => void }) {
  const { addItem } = useCart();
  const { show } = useToast();
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");

  const handleAddToCart = async () => {
    setCartState("adding");
    await new Promise(r => setTimeout(r, 700));
    addItem(p);
    show({ type: "cart", title: "Added to cart!", desc: p.name });
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <Link href={`/products/${p.id}`} className="block relative">
        <div className={`h-40 bg-gradient-to-br ${p.bgColor} flex items-center justify-center relative overflow-hidden`}>
          <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${p.color} opacity-20 blur-2xl`} />
          <motion.span
            className="text-6xl relative z-10"
            whileHover={{ scale: 1.15, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {p.image}
          </motion.span>
          {p.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
              -{p.discount}%
            </span>
          )}
          {p.isBestSeller && (
            <span className="absolute top-3 right-3 bg-orange-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">BEST</span>
          )}
        </div>
      </Link>

      {/* Remove button */}
      <motion.button
        onClick={onRemove}
        whileTap={{ scale: 0.85 }}
        className="absolute top-3 right-3 w-7 h-7 rounded-xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X size={12} className="text-gray-500" />
      </motion.button>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <Link href={`/products/${p.id}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-green-700 transition-colors">{p.name}</h3>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">{p.brand}{p.strength ? ` · ${p.strength}` : ""}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={10} className={s <= Math.round(p.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
          ))}
          <span className="text-xs text-gray-500">({p.reviews >= 1000 ? `${(p.reviews/1000).toFixed(1)}k` : p.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-black text-gray-900">${p.price}</span>
            {p.originalPrice > p.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">${p.originalPrice}</span>
            )}
          </div>
          {p.originalPrice > p.price && (
            <span className="text-xs text-green-600 font-bold">Save ${(p.originalPrice - p.price).toFixed(2)}</span>
          )}
        </div>

        {/* Pack + stock */}
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Package size={10} /> {p.packSize}
          {p.stock < 20 && (
            <span className="ml-auto text-orange-500 font-semibold">Only {p.stock} left!</span>
          )}
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleAddToCart}
          disabled={cartState === "adding"}
          whileHover={{ scale: cartState === "idle" ? 1.02 : 1 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "w-full py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300",
            cartState === "added"
              ? "bg-green-500 text-white"
              : `bg-gradient-to-r ${p.color} text-white hover:shadow-lg`
          )}
        >
          <AnimatePresence mode="wait">
            {cartState === "added" ? (
              <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                <CheckCircle size={14} /> In Cart!
              </motion.span>
            ) : cartState === "adding" ? (
              <motion.span key="spin" className="flex items-center gap-1.5">
                <motion.div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} />
                Adding...
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                <ShoppingCart size={14} /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <button
          onClick={onRemove}
          className="w-full py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-all"
        >
          <Trash2 size={12} /> Remove from wishlist
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Page ─── */
export default function WishlistPage() {
  const { items, remove, count } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();

  const totalSavings = items.reduce((s, p) => s + (p.originalPrice - p.price), 0);
  const recommended  = PRODUCTS.filter(p => !items.some(w => w.id === p.id) && p.isBestSeller).slice(0, 8);

  const moveAllToCart = () => {
    items.forEach(p => addItem(p));
    show({ type: "cart", title: `${count} items added to cart!`, desc: "Your wishlist items are in the cart." });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 border-b border-rose-100">
        <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200">
                  <Heart size={22} className="text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Wishlist</h1>
                  <p className="text-sm text-gray-500 mt-0.5">{count} {count === 1 ? "item" : "items"} saved</p>
                </div>
              </div>
              {count > 0 && totalSavings > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3 text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-100 rounded-xl px-4 py-2 w-fit"
                >
                  <Gift size={14} />
                  You save <span className="font-black">${totalSavings.toFixed(2)}</span> on all wishlisted items!
                </motion.div>
              )}
            </div>

            {count > 0 && (
              <motion.button
                onClick={moveAllToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-xl transition-all text-sm"
              >
                <ShoppingCart size={16} />
                Move All to Cart
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        {count === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-28 h-28 rounded-full bg-rose-100 flex items-center justify-center mb-6"
            >
              <Heart size={50} className="text-rose-300" />
            </motion.div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 max-w-sm mb-8">
              Save your favorite health products here and add them to your cart when you're ready.
            </p>
            <Link
              href="/products"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles size={16} /> Explore Products <ArrowRight size={15} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Item grid */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-gray-900">Saved Items <span className="text-rose-500">({count})</span></h2>
                <button
                  onClick={() => { items.forEach(p => remove(p.id)); show({ type: "info", title: "Wishlist cleared" }); }}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative">
                <AnimatePresence>
                  {items.map(p => (
                    <WishlistCard
                      key={p.id}
                      product={p}
                      onRemove={() => {
                        remove(p.id);
                        show({ type: "wishlist", title: "Removed from wishlist", desc: p.name });
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Continue shopping */}
            <div className="flex justify-center">
              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-all text-sm"
              >
                <ArrowRight size={15} /> Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Recommended section */}
        {recommended.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-green-500" />
                <h2 className="text-xl font-black text-gray-900">You Might Also Like</h2>
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm text-green-600 font-semibold hover:text-green-700 transition-colors">
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {recommended.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <RecoCard p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
