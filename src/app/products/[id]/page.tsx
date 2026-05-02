"use client";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, Heart, Share2, ShoppingCart, Zap, Shield, Truck,
  Clock, ChevronRight, Home, CheckCircle, AlertTriangle,
  Package, RotateCcw, Phone, FileText, Minus, Plus,
  BadgeCheck, Sparkles, TrendingUp
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import QuantityManager from "@/components/product/QuantityManager";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/utils";

/* Gallery views */
const GALLERY_SLOTS = ["Front", "Side", "Label", "Ingredients"];

function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  const p = product;
  const { addItem, openDrawer } = useCart();

  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeGallery, setActiveGallery] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);

  const handleAddToCart = () => {
    addItem(p, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    addItem(p, qty);
    await new Promise((r) => setTimeout(r, 600));
    setBuyingNow(false);
    openDrawer();
  };

  const totalPrice = (p.price * qty).toFixed(2);
  const totalSaving = ((p.originalPrice - p.price) * qty).toFixed(2);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 sticky top-[108px] z-20">
          <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
              <Link href="/" className="hover:text-green-600 flex items-center gap-1 transition-colors">
                <Home size={12} /> Home
              </Link>
              <ChevronRight size={11} className="text-gray-300" />
              <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
              <ChevronRight size={11} className="text-gray-300" />
              <Link href={`/products?cat=${p.category}`} className="hover:text-green-600 transition-colors">{p.category}</Link>
              <ChevronRight size={11} className="text-gray-300" />
              <span className="text-gray-800 font-semibold truncate max-w-[200px]">{p.name}</span>
            </nav>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-8 space-y-8">
          {/* ── Main product section ── */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ── LEFT: Gallery ── */}
            <div className="space-y-4">
              {/* Main image */}
              <motion.div
                className={`relative aspect-square rounded-3xl bg-gradient-to-br ${p.bgColor} border border-white shadow-xl overflow-hidden flex items-center justify-center`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background decoration */}
                <div className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${p.color} opacity-15 blur-3xl`} />
                <motion.div
                  className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                />

                {/* Product emoji — animated */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGallery}
                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative z-10 select-none"
                    style={{ fontSize: "clamp(80px, 15vw, 140px)" }}
                  >
                    {p.image}
                  </motion.div>
                </AnimatePresence>

                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  {p.discount > 0 && (
                    <motion.div
                      className="bg-red-500 text-white font-black px-3 py-1.5 rounded-full text-sm shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      -{p.discount}% OFF
                    </motion.div>
                  )}
                  {p.isTrending && (
                    <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
                      <Zap size={11} /> Trending
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <motion.button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                >
                  <Heart size={18} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
                </motion.button>

                {/* Share */}
                <motion.button
                  className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                  whileTap={{ scale: 0.85 }}
                >
                  <Share2 size={16} />
                </motion.button>

                {/* Gallery label */}
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full z-20">
                  {GALLERY_SLOTS[activeGallery]}
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {GALLERY_SLOTS.map((slot, i) => (
                  <motion.button
                    key={slot}
                    onClick={() => setActiveGallery(i)}
                    className={cn(
                      "flex-1 aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 border-2",
                      `bg-gradient-to-br ${p.bgColor}`,
                      activeGallery === i
                        ? "border-green-500 shadow-md shadow-green-100 scale-95"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    whileTap={{ scale: 0.9 }}
                  >
                    {p.image}
                  </motion.button>
                ))}
              </div>

              {/* Trust badges row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "100% Genuine", color: "text-green-600 bg-green-50" },
                  { icon: Truck, label: "Free Delivery", color: "text-blue-600 bg-blue-50" },
                  { icon: RotateCcw, label: "Easy Returns", color: "text-orange-600 bg-orange-50" },
                ].map((b) => (
                  <div key={b.label} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${b.color} border border-white`}>
                    <b.icon size={18} />
                    <span className="text-xs font-semibold text-center">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Product info ── */}
            <div className="space-y-5">
              {/* Category + tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.subcategory}</span>
                {p.isNew && <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">NEW</span>}
                {p.isBestSeller && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1"><TrendingUp size={9} /> BEST SELLER</span>}
                {p.prescription && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1"><FileText size={9} /> Rx Required</span>}
              </div>

              {/* Name */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{p.name}</h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <p className="text-sm text-gray-500">by <span className="font-semibold text-gray-700">{p.brand}</span></p>
                  {p.genericName && <span className="text-xs text-gray-400">· Generic: {p.genericName}</span>}
                  {p.strength && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{p.strength}</span>}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={p.rating} size={16} />
                  <span className="font-black text-gray-900">{p.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{p.reviews.toLocaleString()} verified reviews</span>
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <BadgeCheck size={13} /> Verified Product
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-2xl p-4">
                <div className="flex items-end gap-3 flex-wrap">
                  <div>
                    <span className="text-4xl font-black text-gray-900">${p.price}</span>
                    <span className="text-sm text-gray-400 ml-1">/ {p.packSize}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-gray-400 line-through">${p.originalPrice}</span>
                    <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">-{p.discount}%</span>
                  </div>
                </div>
                <p className="text-sm text-green-700 font-semibold mt-1">
                  💰 You save ${(p.originalPrice - p.price).toFixed(2)} per pack
                </p>
                {qty > 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 pt-2 border-t border-green-100 flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">Total for {qty} × {p.packSize}:</span>
                    <div className="text-right">
                      <span className="font-black text-gray-900 text-lg">${totalPrice}</span>
                      <span className="text-xs text-green-600 ml-1.5 font-semibold">save ${totalSaving}</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Express delivery */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                <Clock size={18} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-800">Express 2-hour delivery available</p>
                  <p className="text-xs text-gray-500">Order before 5 PM for same-day delivery · Free on orders over $49</p>
                </div>
              </div>

              {/* Stock indicator */}
              {p.stock < 30 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-orange-600 font-semibold">
                      <AlertTriangle size={11} /> Low stock — only {p.stock} left
                    </span>
                    <span className="text-gray-400">{p.stock} / 100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.stock}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Pack info */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Pack", value: p.packSize },
                  { label: "Form", value: p.form },
                  { label: "SKU", value: p.sku },
                  { label: "Expires", value: `${p.expiryMonths > 0 ? `~${p.expiryMonths}mo` : "Lifetime"}` },
                ].map((spec) => (
                  <div key={spec.label} className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-1.5">
                    <span className="text-[10px] text-gray-400 font-medium uppercase">{spec.label}</span>
                    <span className="text-xs font-bold text-gray-700">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Prescription upload */}
              {p.prescription && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-blue-300 rounded-2xl p-4 bg-blue-50 space-y-2"
                >
                  <div className="flex items-center gap-2 text-blue-700">
                    <FileText size={16} />
                    <span className="font-bold text-sm">Prescription Required</span>
                  </div>
                  <p className="text-xs text-blue-600">Upload a valid doctor&apos;s prescription to proceed with this order.</p>
                  {prescriptionFile ? (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs font-semibold text-green-700">{prescriptionFile}</span>
                      <button onClick={() => setPrescriptionFile(null)} className="ml-auto text-gray-400 hover:text-red-500">×</button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                        Upload Prescription
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => setPrescriptionFile(e.target.files?.[0]?.name ?? null)}
                      />
                      <span className="text-xs text-gray-500">JPG, PNG or PDF</span>
                    </label>
                  )}
                </motion.div>
              )}

              {/* Quantity + Add to cart */}
              <div className="space-y-3">
                <QuantityManager value={qty} min={1} max={Math.min(p.stock, 10)} onChange={setQty} size="lg" />

                <div className="grid grid-cols-2 gap-3">
                  {/* Add to cart */}
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={cn(
                      "py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-lg",
                      addedToCart
                        ? "bg-green-500 text-white shadow-green-200"
                        : `bg-gradient-to-r ${p.color} text-white hover:shadow-xl hover:shadow-black/15`
                    )}
                    whileHover={{ scale: addedToCart ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span key="done" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex items-center gap-2">
                          <CheckCircle size={18} /> Added!
                        </motion.span>
                      ) : (
                        <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                          <ShoppingCart size={18} /> Add to Cart
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Buy now */}
                  <motion.button
                    onClick={handleBuyNow}
                    className="py-4 rounded-2xl font-black text-base border-2 border-gray-200 text-gray-800 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {buyingNow ? (
                      <motion.div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                    ) : (
                      <><Zap size={18} /> Buy Now</>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Pharmacist CTA */}
              <motion.div
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-2xl cursor-pointer hover:shadow-md transition-all group"
                whileHover={{ y: -1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">Talk to a Pharmacist</p>
                  <p className="text-xs text-gray-500">Free advice from licensed experts · 24/7</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
              </motion.div>

              {/* Offers */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-yellow-500" /> Available Offers
                </p>
                {[
                  { icon: "🏷️", text: "Use code SAVE10 — extra 10% off", sub: "On orders above $20" },
                  { icon: "🚚", text: "Free delivery on orders above $49", sub: "Express also available" },
                  { icon: "💳", text: "5% cashback with select credit cards", sub: "T&C apply" },
                ].map((offer, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                    <span className="text-lg flex-shrink-0">{offer.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{offer.text}</p>
                      <p className="text-[10px] text-gray-500">{offer.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Manufacturer + Verified */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <span>Manufactured by <strong className="text-gray-700">{p.manufacturer}</strong></span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <CheckCircle size={12} /> MediCart Verified
                </span>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <ProductTabs product={p} />

          {/* ── Related Products ── */}
          <RelatedProducts product={p} />
        </div>
      </main>

      {/* ── Mobile sticky CTA ── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 safe-b shadow-[0_-8px_32px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="text-2xl font-black text-gray-900">${p.price}</div>
            <div className="text-xs text-green-600 font-semibold">Save ${(p.originalPrice - p.price).toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-2 flex-1">
            {/* Compact qty */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5 gap-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white transition-all">
                <Minus size={13} />
              </button>
              <span className="w-8 text-center font-bold text-sm text-gray-900">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white transition-all">
                <Plus size={13} />
              </button>
            </div>
            <motion.button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all",
                addedToCart ? "bg-green-500 text-white" : `bg-gradient-to-r ${p.color} text-white hover:shadow-lg`
              )}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingCart size={15} />
              {addedToCart ? "Added!" : "Add to Cart"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
}
